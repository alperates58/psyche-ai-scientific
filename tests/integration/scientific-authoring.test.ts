import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { assertTestDatabaseSafety } from '../../scripts/verify-test-db-safety';
import {
  createAssessmentFormDraft,
  cloneAssessmentFormDraft,
  addQuestionToFormDraft,
  removeQuestionFromFormDraft,
  reorderFormDraftItems,
  createNewItem,
  createNewItemVersion,
  updateDraftItemVersion,
  publishAssessmentFormVersion,
} from '../../src/services/scientificAdminService';
import {
  validateAssessmentFormForPublication,
} from '../../src/lib/publicationValidator';
import {
  assertFormVersionMutable,
  assertItemVersionMutable,
  assertItemMetadataMutable,
} from '../../src/lib/scientificImmutability';

describe('FAZ 2.7C: Scientific Authoring & Publication Lifecycle Integration Tests', () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    assertTestDatabaseSafety();
    prisma = new PrismaClient({
      datasources: {
        db: {
          url:
            process.env.TEST_DATABASE_URL ||
            'postgresql://postgres:postgres@localhost:5434/psyche_ai_test?schema=public',
        },
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('creates a blank draft form version and logs audit event', async () => {
    const moduleRecord = await prisma.assessmentModule.findFirst();
    expect(moduleRecord).toBeDefined();

    const draftCode = `v_test_blank_${Date.now()}`;
    const form = await createAssessmentFormDraft(
      {
        moduleId: moduleRecord!.id,
        versionCode: draftCode,
        description: 'Test blank draft form',
      },
      { actorUserId: 'test-admin-actor' }
    );

    expect(form.status).toBe('DRAFT');
    expect(form.isPublished).toBe(false);
    expect(form.itemCount).toBe(0);

    // Audit event check
    const audit = await prisma.scientificAuditEvent.findFirst({
      where: {
        eventType: 'FORM_VERSION_CREATED',
        targetEntityId: form.id,
      },
    });
    expect(audit).toBeDefined();
    expect(audit!.targetEntityType).toBe('AssessmentFormVersion');
  });

  it('clones a published form to a new draft preserving item mappings and order', async () => {
    const liveForm = await prisma.assessmentFormVersion.findFirst({
      where: { status: 'PUBLISHED' },
      include: { items: { orderBy: { sortOrder: 'asc' } } },
    });
    expect(liveForm).toBeDefined();

    const cloneCode = `v_test_clone_${Date.now()}`;
    const cloned = await cloneAssessmentFormDraft(
      {
        sourceFormVersionId: liveForm!.id,
        newVersionCode: cloneCode,
        description: 'Cloned from live form',
      },
      { actorUserId: 'test-admin-actor' }
    );

    expect(cloned.status).toBe('DRAFT');
    expect(cloned.isPublished).toBe(false);
    expect(cloned.itemCount).toBe(liveForm!.items.length);

    // Verify cloned items
    const clonedItems = await prisma.assessmentFormItem.findMany({
      where: { formVersionId: cloned.id },
      orderBy: { sortOrder: 'asc' },
    });
    expect(clonedItems.length).toBe(liveForm!.items.length);
    for (let i = 0; i < liveForm!.items.length; i++) {
      expect(clonedItems[i].sortOrder).toBe(liveForm!.items[i].sortOrder);
      expect(clonedItems[i].itemVersionId).toBe(liveForm!.items[i].itemVersionId);
    }
  });

  it('creates a new Item and initial ItemVersion with ADMIN_AUTHORED provenance and Likert 5 options', async () => {
    const facet = await prisma.facet.findFirst();
    expect(facet).toBeDefined();

    const itemCode = `TEST_ITEM_${Date.now()}`;
    const result = await createNewItem(
      {
        facetId: facet!.id,
        itemCode,
        isKeyed: false,
        isAttentionCheck: false,
        promptTr: 'Test Türkçe önerme metni.',
        promptEn: 'Test English prompt text.',
        notes: 'Integration test item',
        authorType: 'ADMIN_AUTHORED',
      },
      { actorUserId: 'test-admin-actor' }
    );

    expect(result.item.itemCode).toBe(itemCode);
    expect(result.item.isKeyed).toBe(false);
    expect(result.initialVersion.versionNumber).toBe(1);
    expect(result.initialVersion.status).toBe('DRAFT');
    expect(result.initialVersion.authorType).toBe('ADMIN_AUTHORED');

    // Verify 5 Likert options
    const options = await prisma.itemVersionOption.findMany({
      where: { itemVersionId: result.initialVersion.id },
      orderBy: { sortOrder: 'asc' },
    });
    expect(options.length).toBe(5);
    expect(options[0].value).toBe(1);
    expect(options[4].value).toBe(5);
  });

  it('creates next ItemVersion atomically (vN+1)', async () => {
    const item = await prisma.item.findFirst({
      include: { versions: { orderBy: { versionNumber: 'desc' } } },
    });
    expect(item).toBeDefined();

    const maxVer = item!.versions[0].versionNumber;
    const newVersion = await createNewItemVersion(
      {
        itemId: item!.id,
        promptTr: 'Revize edilmiş Türkçe önerme.',
        promptEn: 'Revised English prompt.',
        cloneOptionsFromVersionId: item!.versions[0].id,
      },
      { actorUserId: 'test-admin-actor' }
    );

    expect(newVersion.versionNumber).toBe(maxVer + 1);
    expect(newVersion.status).toBe('DRAFT');
    expect(newVersion.authorType).toBe('ADMIN_AUTHORED');
  });

  it('rejects in-place edits on frozen ItemVersions used in published form', async () => {
    const liveFormItem = await prisma.assessmentFormItem.findFirst({
      where: { formVersion: { status: 'PUBLISHED' } },
      include: { itemVersion: true },
    });
    expect(liveFormItem).toBeDefined();

    await expect(
      assertItemVersionMutable(liveFormItem!.itemVersionId, prisma)
    ).rejects.toThrow(/ITEM_VERSION_IMMUTABLE/);
  });

  it('rejects in-place edits on published AssessmentFormVersion', async () => {
    const liveForm = await prisma.assessmentFormVersion.findFirst({
      where: { status: 'PUBLISHED' },
    });
    expect(liveForm).toBeDefined();

    await expect(assertFormVersionMutable(liveForm!.id, prisma)).rejects.toThrow(
      /FORM_IMMUTABLE/
    );
  });

  // =========================================================
  // FAZ 2.7C-3: ATOMIC PUBLICATION & LIFECYCLE TESTS
  // =========================================================
  it('validates publication readiness of a cloned draft form', async () => {
    const liveForm = await prisma.assessmentFormVersion.findFirst({
      where: { status: 'PUBLISHED' },
    });
    expect(liveForm).toBeDefined();

    const cloneCode = `v_test_val_${Date.now()}`;
    const draft = await cloneAssessmentFormDraft(
      {
        sourceFormVersionId: liveForm!.id,
        newVersionCode: cloneCode,
      },
      { actorUserId: 'test-admin-actor' }
    );

    const validation = await validateAssessmentFormForPublication(draft.id, prisma);
    expect(validation.publishable).toBe(true);
    expect(validation.blockers.length).toBe(0);
    expect(validation.details.formVersionId).toBe(draft.id);
    expect(validation.details.existingPublishedFormId).toBe(liveForm!.id);
  });

  it('atomically publishes a draft form, archiving the previous published form and activating item versions', async () => {
    const liveForm = await prisma.assessmentFormVersion.findFirst({
      where: { status: 'PUBLISHED' },
      include: { module: true },
    });
    expect(liveForm).toBeDefined();

    const newCode = `v_test_pub_${Date.now()}`;
    const draft = await cloneAssessmentFormDraft(
      {
        sourceFormVersionId: liveForm!.id,
        newVersionCode: newCode,
        description: 'New published candidate',
      },
      { actorUserId: 'test-admin-actor' }
    );

    const result = await publishAssessmentFormVersion(
      { formVersionId: draft.id },
      { actorUserId: 'test-admin-actor' }
    );

    expect(result.publishedForm.id).toBe(draft.id);
    expect(result.publishedForm.status).toBe('PUBLISHED');
    expect(result.publishedForm.isPublished).toBe(true);
    expect(result.publishedForm.publishedAt).toBeDefined();

    // Verify previous form is archived
    if (result.previousArchivedForm) {
      const archived = await prisma.assessmentFormVersion.findUnique({
        where: { id: result.previousArchivedForm.id },
      });
      expect(archived!.status).toBe('ARCHIVED');
      expect(archived!.isPublished).toBe(false);
      expect(archived!.archivedAt).toBeDefined();
    }

    // Verify linked item versions are ACTIVE
    const formItems = await prisma.assessmentFormItem.findMany({
      where: { formVersionId: draft.id },
      include: { itemVersion: true },
    });
    expect(formItems.length).toBeGreaterThan(0);
    for (const fi of formItems) {
      expect(fi.itemVersion.status).toBe('ACTIVE');
      expect(fi.itemVersion.isActive).toBe(true);
    }

    // Verify Audit Logs
    const publishAudit = await prisma.scientificAuditEvent.findFirst({
      where: {
        eventType: 'FORM_PUBLISHED',
        targetEntityId: draft.id,
      },
    });
    expect(publishAudit).toBeDefined();
  });
});

