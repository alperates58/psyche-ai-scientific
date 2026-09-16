import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import {
  assertFormVersionMutable,
  assertItemVersionMutable,
  assertItemMetadataMutable,
} from '@/lib/scientificImmutability';
import { logScientificAuditEventTx } from '@/lib/scientificAuditLog';
import { validateAssessmentFormForPublication } from '@/lib/publicationValidator';
import { normalizeInstrumentLicensingDecision, normalizeItemLicenseStatus } from '@/lib/licenseNormalization';

/**
 * Computes a deterministic signed 64-bit BigInt hash from an ID string
 * for PostgreSQL advisory transaction locking.
 */
function hashToBigInt(str: string): string {
  const hash = crypto.createHash('sha256').update(str).digest('hex').substring(0, 15);
  return BigInt('0x' + hash).toString();
}

const DEFAULT_LIKERT_5_OPTIONS = [
  { value: 1, labelTr: 'Kesinlikle Katılmıyorum', labelEn: 'Strongly Disagree', sortOrder: 1 },
  { value: 2, labelTr: 'Katılmıyorum', labelEn: 'Disagree', sortOrder: 2 },
  { value: 3, labelTr: 'Kararsızım / Nötr', labelEn: 'Neutral', sortOrder: 3 },
  { value: 4, labelTr: 'Katılıyorum', labelEn: 'Agree', sortOrder: 4 },
  { value: 5, labelTr: 'Kesinlikle Katılıyorum', labelEn: 'Strongly Agree', sortOrder: 5 },
];

export interface AuditContext {
  actorUserId?: string | null;
  ip?: string | null;
  userAgent?: string | null;
}

// ---------------------------------------------------------
// 1. SELECTORS & READ HELPERS
// ---------------------------------------------------------

export async function getAssessmentModulesList() {
  return prisma.assessmentModule.findMany({
    orderBy: { code: 'asc' },
  });
}

export async function getOntologyCascade() {
  return prisma.domain.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      constructs: {
        orderBy: { sortOrder: 'asc' },
        include: {
          facets: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      },
    },
  });
}

export async function getEligibleItemVersionsForPicker(
  formVersionId: string,
  filter?: { search?: string; facetId?: string }
) {
  // 1. Get already assigned itemVersionIds in this form
  const existingFormItems = await prisma.assessmentFormItem.findMany({
    where: { formVersionId },
    select: { itemVersionId: true },
  });
  const excludedVersionIds = existingFormItems.map((fi) => fi.itemVersionId);

  // 2. Query eligible item versions (ACTIVE or DRAFT, NOT DEPRECATED)
  const versions = await prisma.itemVersion.findMany({
    where: {
      id: { notIn: excludedVersionIds },
      status: { in: ['ACTIVE', 'DRAFT'] },
      item: {
        facetId: filter?.facetId || undefined,
      },
    },
    include: {
      item: {
        include: {
          facet: {
            include: {
              construct: {
                include: {
                  domain: true,
                },
              },
            },
          },
          instrument: true,
        },
      },
      options: {
        orderBy: { sortOrder: 'asc' },
      },
    },
    orderBy: [
      { item: { itemCode: 'asc' } },
      { versionNumber: 'desc' },
    ],
  });

  // Search filter
  let filtered = versions;
  if (filter?.search && filter.search.trim()) {
    const q = filter.search.toLowerCase().trim();
    filtered = filtered.filter((v) => {
      const matchCode = v.item.itemCode.toLowerCase().includes(q);
      const matchFacet =
        v.item.facet.nameTr.toLowerCase().includes(q) ||
        v.item.facet.nameEn.toLowerCase().includes(q);
      const matchPrompt =
        v.promptTr.toLowerCase().includes(q) ||
        v.promptEn.toLowerCase().includes(q);
      return matchCode || matchFacet || matchPrompt;
    });
  }

  return filtered.map((v) => ({
    ...v,
    normalizedInstrumentDecision: normalizeInstrumentLicensingDecision(v.item.instrument?.licensingDecision),
  }));
}

// ---------------------------------------------------------
// 2. ASSESSMENT FORM DRAFT MUTATIONS
// ---------------------------------------------------------

export interface CreateFormDraftInput {
  moduleId: string;
  versionCode: string;
  description?: string;
}

export async function createAssessmentFormDraft(
  input: CreateFormDraftInput,
  ctx?: AuditContext
) {
  return prisma.$transaction(async (tx) => {
    // Check module exists
    const mod = await tx.assessmentModule.findUnique({
      where: { id: input.moduleId },
    });
    if (!mod) {
      throw new Error('NOT_FOUND: Belirtilen değerlendirme modülü bulunamadı.');
    }

    // Check versionCode uniqueness for module
    const existing = await tx.assessmentFormVersion.findUnique({
      where: {
        moduleId_versionCode: {
          moduleId: input.moduleId,
          versionCode: input.versionCode.trim(),
        },
      },
    });

    if (existing) {
      throw new Error(
        `DUPLICATE_VERSION_CODE: Bu modül (${mod.code}) için '${input.versionCode.trim()}' sürüm kodu zaten mevcuttur.`
      );
    }

    const form = await tx.assessmentFormVersion.create({
      data: {
        moduleId: input.moduleId,
        versionCode: input.versionCode.trim(),
        description: input.description?.trim() || null,
        status: 'DRAFT',
        isPublished: false,
        itemCount: 0,
      },
    });

    await logScientificAuditEventTx(tx, {
      eventType: 'FORM_VERSION_CREATED',
      actorUserId: ctx?.actorUserId,
      targetEntityType: 'AssessmentFormVersion',
      targetEntityId: form.id,
      ip: ctx?.ip,
      userAgent: ctx?.userAgent,
      metadata: {
        moduleId: input.moduleId,
        versionCode: form.versionCode,
      },
    });

    return form;
  });
}

export interface CloneFormDraftInput {
  sourceFormVersionId: string;
  newVersionCode: string;
  description?: string;
}

export async function cloneAssessmentFormDraft(
  input: CloneFormDraftInput,
  ctx?: AuditContext
) {
  return prisma.$transaction(async (tx) => {
    // 1. Fetch source form with its items ordered
    const sourceForm = await tx.assessmentFormVersion.findUnique({
      where: { id: input.sourceFormVersionId },
      include: {
        items: {
          orderBy: { sortOrder: 'asc' },
        },
        module: true,
      },
    });

    if (!sourceForm) {
      throw new Error('NOT_FOUND: Klonlanacak kaynak form bulunamadı.');
    }

    const trimmedVersionCode = input.newVersionCode.trim();

    // 2. Check collision on (moduleId, versionCode)
    const collision = await tx.assessmentFormVersion.findUnique({
      where: {
        moduleId_versionCode: {
          moduleId: sourceForm.moduleId,
          versionCode: trimmedVersionCode,
        },
      },
    });

    if (collision) {
      throw new Error(
        `DUPLICATE_VERSION_CODE: Bu modül (${sourceForm.module.code}) için '${trimmedVersionCode}' sürüm kodu zaten mevcuttur.`
      );
    }

    // 3. Create new DRAFT AssessmentFormVersion
    const newForm = await tx.assessmentFormVersion.create({
      data: {
        moduleId: sourceForm.moduleId,
        versionCode: trimmedVersionCode,
        description: input.description?.trim() || sourceForm.description,
        status: 'DRAFT',
        isPublished: false,
        itemCount: sourceForm.items.length,
      },
    });

    // 4. Copy item mappings preserving sortOrder and referencing the same itemVersionIds
    if (sourceForm.items.length > 0) {
      for (const item of sourceForm.items) {
        await tx.assessmentFormItem.create({
          data: {
            formVersionId: newForm.id,
            itemVersionId: item.itemVersionId,
            sortOrder: item.sortOrder,
          },
        });
      }
    }

    // 5. Transactional Audit Log
    await logScientificAuditEventTx(tx, {
      eventType: 'FORM_VERSION_CLONED',
      actorUserId: ctx?.actorUserId,
      targetEntityType: 'AssessmentFormVersion',
      targetEntityId: newForm.id,
      ip: ctx?.ip,
      userAgent: ctx?.userAgent,
      metadata: {
        sourceFormVersionId: sourceForm.id,
        sourceVersionCode: sourceForm.versionCode,
        newVersionCode: newForm.versionCode,
        itemCount: sourceForm.items.length,
      },
    });

    return newForm;
  });
}

export interface UpdateFormMetadataInput {
  formVersionId: string;
  description?: string;
  versionCode?: string;
}

export async function updateAssessmentFormDraftMetadata(
  input: UpdateFormMetadataInput,
  ctx?: AuditContext
) {
  return prisma.$transaction(async (tx) => {
    const form = await assertFormVersionMutable(input.formVersionId, tx);

    const updateData: any = {};
    if (input.description !== undefined) {
      updateData.description = input.description.trim() || null;
    }

    if (input.versionCode && input.versionCode.trim() !== form.versionCode) {
      const trimmed = input.versionCode.trim();
      const existing = await tx.assessmentFormVersion.findUnique({
        where: {
          moduleId_versionCode: {
            moduleId: form.moduleId,
            versionCode: trimmed,
          },
        },
      });
      if (existing && existing.id !== form.id) {
        throw new Error(`DUPLICATE_VERSION_CODE: '${trimmed}' sürüm kodu bu modülde zaten kullanılıyor.`);
      }
      updateData.versionCode = trimmed;
    }

    const updated = await tx.assessmentFormVersion.update({
      where: { id: input.formVersionId },
      data: updateData,
    });

    await logScientificAuditEventTx(tx, {
      eventType: 'FORM_METADATA_UPDATED',
      actorUserId: ctx?.actorUserId,
      targetEntityType: 'AssessmentFormVersion',
      targetEntityId: updated.id,
      ip: ctx?.ip,
      userAgent: ctx?.userAgent,
      metadata: {
        fieldsChanged: Object.keys(updateData),
      },
    });

    return updated;
  });
}

export interface AddQuestionToFormInput {
  formVersionId: string;
  itemVersionId: string;
}

export async function addQuestionToFormDraft(
  input: AddQuestionToFormInput,
  ctx?: AuditContext
) {
  return prisma.$transaction(async (tx) => {
    // 1. Transaction-scoped advisory lock on formVersionId to serialize sortOrder increments (Fail Closed)
    const lockKey = hashToBigInt(input.formVersionId);
    try {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(${BigInt(lockKey)}::bigint)`;
    } catch (err: any) {
      throw new Error(`FORM_LOCK_FAILED: Form eşzamanlılık kilidi alınamadı: ${err.message}`);
    }

    // 2. Assure form is mutable
    await assertFormVersionMutable(input.formVersionId, tx);

    // 3. Validate ItemVersion exists and is eligible
    const itemVersion = await tx.itemVersion.findUnique({
      where: { id: input.itemVersionId },
      include: { item: true },
    });

    if (!itemVersion) {
      throw new Error('NOT_FOUND: Eklenmek istenen madde sürümü bulunamadı.');
    }

    if (itemVersion.status === 'DEPRECATED') {
      throw new Error('ITEM_DEPRECATED: Kullanımdan kaldırılmış (DEPRECATED) madde sürümleri forma eklenemez.');
    }

    // 4. Check if already in form
    const existing = await tx.assessmentFormItem.findUnique({
      where: {
        formVersionId_itemVersionId: {
          formVersionId: input.formVersionId,
          itemVersionId: input.itemVersionId,
        },
      },
    });

    if (existing) {
      throw new Error('DUPLICATE_FORM_ITEM: Bu madde sürümü zaten bu formda yer almaktadır.');
    }

    // 5. Calculate next sortOrder
    const maxSortItem = await tx.assessmentFormItem.findFirst({
      where: { formVersionId: input.formVersionId },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });

    const nextSortOrder = (maxSortItem?.sortOrder ?? 0) + 1;

    // 6. Create AssessmentFormItem
    const formItem = await tx.assessmentFormItem.create({
      data: {
        formVersionId: input.formVersionId,
        itemVersionId: input.itemVersionId,
        sortOrder: nextSortOrder,
      },
    });

    // 7. Update itemCount on form
    const currentCount = await tx.assessmentFormItem.count({
      where: { formVersionId: input.formVersionId },
    });

    await tx.assessmentFormVersion.update({
      where: { id: input.formVersionId },
      data: { itemCount: currentCount },
    });

    // 8. Transactional audit log
    await logScientificAuditEventTx(tx, {
      eventType: 'FORM_ITEMS_UPDATED',
      actorUserId: ctx?.actorUserId,
      targetEntityType: 'AssessmentFormVersion',
      targetEntityId: input.formVersionId,
      ip: ctx?.ip,
      userAgent: ctx?.userAgent,
      metadata: {
        action: 'ADD_ITEM',
        itemVersionId: input.itemVersionId,
        itemCode: itemVersion.item.itemCode,
        sortOrder: nextSortOrder,
        totalItems: currentCount,
      },
    });

    return formItem;
  });
}

export interface RemoveQuestionFromFormInput {
  formVersionId: string;
  formItemId: string;
}

export async function removeQuestionFromFormDraft(
  input: RemoveQuestionFromFormInput,
  ctx?: AuditContext
) {
  return prisma.$transaction(async (tx) => {
    // 1. Assure form is mutable
    await assertFormVersionMutable(input.formVersionId, tx);

    // 2. Fetch target formItem
    const targetItem = await tx.assessmentFormItem.findUnique({
      where: { id: input.formItemId },
    });

    if (!targetItem || targetItem.formVersionId !== input.formVersionId) {
      throw new Error('NOT_FOUND: Silinecek form maddesi bulunamadı.');
    }

    // 3. Delete ONLY the mapping row
    await tx.assessmentFormItem.delete({
      where: { id: input.formItemId },
    });

    // 4. Fetch remaining items ordered
    const remainingItems = await tx.assessmentFormItem.findMany({
      where: { formVersionId: input.formVersionId },
      orderBy: { sortOrder: 'asc' },
    });

    // 5. Safe 2-phase re-index to eliminate any gap and avoid unique constraint collisions
    // Phase 1: temporary negatives
    for (let i = 0; i < remainingItems.length; i++) {
      await tx.assessmentFormItem.update({
        where: { id: remainingItems[i].id },
        data: { sortOrder: -(i + 1) },
      });
    }

    // Phase 2: positive 1..N
    for (let i = 0; i < remainingItems.length; i++) {
      await tx.assessmentFormItem.update({
        where: { id: remainingItems[i].id },
        data: { sortOrder: i + 1 },
      });
    }

    // 6. Update itemCount
    await tx.assessmentFormVersion.update({
      where: { id: input.formVersionId },
      data: { itemCount: remainingItems.length },
    });

    // 7. Transactional audit log
    await logScientificAuditEventTx(tx, {
      eventType: 'FORM_ITEMS_UPDATED',
      actorUserId: ctx?.actorUserId,
      targetEntityType: 'AssessmentFormVersion',
      targetEntityId: input.formVersionId,
      ip: ctx?.ip,
      userAgent: ctx?.userAgent,
      metadata: {
        action: 'REMOVE_ITEM',
        formItemId: input.formItemId,
        itemVersionId: targetItem.itemVersionId,
        totalItems: remainingItems.length,
      },
    });

    return { success: true, remainingCount: remainingItems.length };
  });
}

export interface ReorderFormDraftItemsInput {
  formVersionId: string;
  orderedFormItemIds: string[];
}

export async function reorderFormDraftItems(
  input: ReorderFormDraftItemsInput,
  ctx?: AuditContext
) {
  return prisma.$transaction(async (tx) => {
    // 1. Assure form is mutable
    await assertFormVersionMutable(input.formVersionId, tx);

    // 2. Fetch all existing items for this form
    const currentItems = await tx.assessmentFormItem.findMany({
      where: { formVersionId: input.formVersionId },
      select: { id: true },
    });

    const currentIdSet = new Set(currentItems.map((ci) => ci.id));
    if (input.orderedFormItemIds.length !== currentItems.length) {
      throw new Error('INVALID_REORDER_COUNT: Sıralama listesi mevcut madde sayısıyla eşleşmiyor.');
    }

    for (const id of input.orderedFormItemIds) {
      if (!currentIdSet.has(id)) {
        throw new Error('INVALID_FORM_ITEM_ID: Formda bulunmayan bir madde ID belirtildi.');
      }
    }

    // 3. Safe 2-phase reorder:
    // Phase 1: assign temporary negative values
    for (let i = 0; i < input.orderedFormItemIds.length; i++) {
      const id = input.orderedFormItemIds[i];
      await tx.assessmentFormItem.update({
        where: { id },
        data: { sortOrder: -(i + 1) },
      });
    }

    // Phase 2: assign final sequential 1..N values
    for (let i = 0; i < input.orderedFormItemIds.length; i++) {
      const id = input.orderedFormItemIds[i];
      await tx.assessmentFormItem.update({
        where: { id },
        data: { sortOrder: i + 1 },
      });
    }

    // 4. Transactional audit log
    await logScientificAuditEventTx(tx, {
      eventType: 'FORM_ITEMS_UPDATED',
      actorUserId: ctx?.actorUserId,
      targetEntityType: 'AssessmentFormVersion',
      targetEntityId: input.formVersionId,
      ip: ctx?.ip,
      userAgent: ctx?.userAgent,
      metadata: {
        action: 'REORDER_ITEMS',
        count: input.orderedFormItemIds.length,
      },
    });

    return { success: true, count: input.orderedFormItemIds.length };
  });
}

// ---------------------------------------------------------
// 3. ITEM & VERSION AUTHORING MUTATIONS (Server-Controlled Provenance)
// ---------------------------------------------------------

export interface CreateNewItemInput {
  facetId: string;
  itemCode: string;
  itemType?: string; // default LIKERT_5
  isKeyed: boolean; // true = regular (+), false = reverse (-)
  isAttentionCheck: boolean;
  instrumentId?: string | null;
  promptTr: string;
  promptEn: string;
  notes?: string;
}

export async function createNewItem(
  input: CreateNewItemInput,
  ctx?: AuditContext
) {
  return prisma.$transaction(async (tx) => {
    const trimmedCode = input.itemCode.trim();

    // 1. Check itemCode uniqueness
    const existingCode = await tx.item.findUnique({
      where: { itemCode: trimmedCode },
    });
    if (existingCode) {
      throw new Error(`DUPLICATE_ITEM_CODE: '${trimmedCode}' madde kodu zaten kullanımda.`);
    }

    // 2. Validate facet exists
    const facet = await tx.facet.findUnique({
      where: { id: input.facetId },
    });
    if (!facet) {
      throw new Error('NOT_FOUND: Belirtilen alt boyut (facet) bulunamadı.');
    }

    // 3. Validate instrument if provided
    if (input.instrumentId) {
      const inst = await tx.instrument.findUnique({
        where: { id: input.instrumentId },
      });
      if (!inst) {
        throw new Error('NOT_FOUND: Belirtilen envanter (instrument) bulunamadı.');
      }
    }

    // 4. Create Item record
    const item = await tx.item.create({
      data: {
        itemCode: trimmedCode,
        facetId: input.facetId,
        instrumentId: input.instrumentId || null,
        isKeyed: input.isKeyed,
        itemType: input.itemType || 'LIKERT_5',
        isAttentionCheck: input.isAttentionCheck,
      },
    });

    // 5. Create initial ItemVersion (DRAFT, RESEARCH_DRAFT, strictly server-assigned authorType = ADMIN_AUTHORED)
    const initialVersion = await tx.itemVersion.create({
      data: {
        itemId: item.id,
        versionNumber: 1,
        promptTr: input.promptTr.trim(),
        promptEn: input.promptEn.trim(),
        notes: input.notes?.trim() || null,
        status: 'DRAFT',
        isActive: false,
        validationStatus: 'RESEARCH_DRAFT',
        authorType: 'ADMIN_AUTHORED',
      },
    });

    // 6. Create default 5-point Likert options
    for (const opt of DEFAULT_LIKERT_5_OPTIONS) {
      await tx.itemVersionOption.create({
        data: {
          itemVersionId: initialVersion.id,
          value: opt.value,
          labelTr: opt.labelTr,
          labelEn: opt.labelEn,
          sortOrder: opt.sortOrder,
        },
      });
    }

    // 7. Transactional audit logs
    await logScientificAuditEventTx(tx, {
      eventType: 'ITEM_CREATED',
      actorUserId: ctx?.actorUserId,
      targetEntityType: 'Item',
      targetEntityId: item.id,
      ip: ctx?.ip,
      userAgent: ctx?.userAgent,
      metadata: {
        itemCode: item.itemCode,
        facetId: item.facetId,
        isKeyed: item.isKeyed,
        isAttentionCheck: item.isAttentionCheck,
      },
    });

    await logScientificAuditEventTx(tx, {
      eventType: 'ITEM_VERSION_CREATED',
      actorUserId: ctx?.actorUserId,
      targetEntityType: 'ItemVersion',
      targetEntityId: initialVersion.id,
      ip: ctx?.ip,
      userAgent: ctx?.userAgent,
      metadata: {
        itemId: item.id,
        versionNumber: 1,
        authorType: initialVersion.authorType,
      },
    });

    return { item, initialVersion };
  });
}

export interface CreateNewItemVersionInput {
  itemId: string;
  promptTr: string;
  promptEn: string;
  notes?: string;
  cloneOptionsFromVersionId?: string;
  customOptions?: { value: number; labelTr: string; labelEn: string; sortOrder: number }[];
}

export async function createNewItemVersion(
  input: CreateNewItemVersionInput,
  ctx?: AuditContext
) {
  return prisma.$transaction(async (tx) => {
    // 1. Concurrency control via PostgreSQL transaction advisory lock (Fail Closed)
    const lockKey = hashToBigInt(input.itemId);
    try {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(${BigInt(lockKey)}::bigint)`;
    } catch (err: any) {
      throw new Error(`VERSION_LOCK_FAILED: Sürüm eşzamanlılık kilidi alınamadı: ${err.message}`);
    }

    // 2. Fetch item with all versions
    const item = await tx.item.findUnique({
      where: { id: input.itemId },
      include: {
        versions: {
          orderBy: { versionNumber: 'desc' },
          include: {
            options: {
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    });

    if (!item) {
      throw new Error('NOT_FOUND: Madde bulunamadı.');
    }

    // 3. Compute next version number
    const maxVersionNumber = item.versions[0]?.versionNumber ?? 0;
    const nextVersionNumber = maxVersionNumber + 1;

    // 4. Create new ItemVersion (Starts DRAFT, isActive: false, validationStatus: RESEARCH_DRAFT, authorType: ADMIN_AUTHORED)
    const newVersion = await tx.itemVersion.create({
      data: {
        itemId: item.id,
        versionNumber: nextVersionNumber,
        promptTr: input.promptTr.trim(),
        promptEn: input.promptEn.trim(),
        notes: input.notes?.trim() || null,
        status: 'DRAFT',
        isActive: false,
        validationStatus: 'RESEARCH_DRAFT',
        authorType: 'ADMIN_AUTHORED',
      },
    });

    // 5. Options population: customOptions -> clone from specified version -> clone from latest -> default Likert 5
    if (input.customOptions && input.customOptions.length > 0) {
      for (const opt of input.customOptions) {
        await tx.itemVersionOption.create({
          data: {
            itemVersionId: newVersion.id,
            value: opt.value,
            labelTr: opt.labelTr,
            labelEn: opt.labelEn,
            sortOrder: opt.sortOrder,
          },
        });
      }
    } else if (input.cloneOptionsFromVersionId) {
      const sourceVer = item.versions.find((v) => v.id === input.cloneOptionsFromVersionId);
      const optionsToClone = sourceVer?.options || item.versions[0]?.options || DEFAULT_LIKERT_5_OPTIONS;
      for (const opt of optionsToClone) {
        await tx.itemVersionOption.create({
          data: {
            itemVersionId: newVersion.id,
            value: opt.value,
            labelTr: opt.labelTr,
            labelEn: opt.labelEn,
            sortOrder: opt.sortOrder,
          },
        });
      }
    } else if (item.versions[0]?.options && item.versions[0].options.length > 0) {
      for (const opt of item.versions[0].options) {
        await tx.itemVersionOption.create({
          data: {
            itemVersionId: newVersion.id,
            value: opt.value,
            labelTr: opt.labelTr,
            labelEn: opt.labelEn,
            sortOrder: opt.sortOrder,
          },
        });
      }
    } else {
      for (const opt of DEFAULT_LIKERT_5_OPTIONS) {
        await tx.itemVersionOption.create({
          data: {
            itemVersionId: newVersion.id,
            value: opt.value,
            labelTr: opt.labelTr,
            labelEn: opt.labelEn,
            sortOrder: opt.sortOrder,
          },
        });
      }
    }

    // 6. Transactional audit log
    await logScientificAuditEventTx(tx, {
      eventType: 'ITEM_VERSION_CREATED',
      actorUserId: ctx?.actorUserId,
      targetEntityType: 'ItemVersion',
      targetEntityId: newVersion.id,
      ip: ctx?.ip,
      userAgent: ctx?.userAgent,
      metadata: {
        itemId: item.id,
        itemCode: item.itemCode,
        versionNumber: nextVersionNumber,
        authorType: newVersion.authorType,
      },
    });

    return newVersion;
  });
}

export interface UpdateDraftItemVersionInput {
  itemVersionId: string;
  promptTr?: string;
  promptEn?: string;
  notes?: string;
  options?: {
    id?: string;
    value: number;
    labelTr: string;
    labelEn: string;
  }[];
}

export async function updateDraftItemVersion(
  input: UpdateDraftItemVersionInput,
  ctx?: AuditContext
) {
  return prisma.$transaction(async (tx) => {
    // 1. Assure ItemVersion is strictly mutable
    const version = await assertItemVersionMutable(input.itemVersionId, tx);

    // 2. Update prompt texts & notes
    const updateData: any = {};
    if (input.promptTr !== undefined) updateData.promptTr = input.promptTr.trim();
    if (input.promptEn !== undefined) updateData.promptEn = input.promptEn.trim();
    if (input.notes !== undefined) updateData.notes = input.notes.trim() || null;

    const updated = await tx.itemVersion.update({
      where: { id: input.itemVersionId },
      data: updateData,
    });

    // 3. Update options if provided
    if (input.options && input.options.length > 0) {
      for (const opt of input.options) {
        if (opt.id) {
          await tx.itemVersionOption.update({
            where: { id: opt.id },
            data: {
              labelTr: opt.labelTr.trim(),
              labelEn: opt.labelEn.trim(),
            },
          });
        }
      }
    }

    // 4. Transactional audit log
    await logScientificAuditEventTx(tx, {
      eventType: 'ITEM_VERSION_UPDATED_DRAFT',
      actorUserId: ctx?.actorUserId,
      targetEntityType: 'ItemVersion',
      targetEntityId: updated.id,
      ip: ctx?.ip,
      userAgent: ctx?.userAgent,
      metadata: {
        fieldsChanged: Object.keys(updateData),
        optionsUpdated: !!input.options,
      },
    });

    return updated;
  });
}

export interface UpdateItemMetadataInput {
  itemId: string;
  facetId?: string;
  isKeyed?: boolean;
  isAttentionCheck?: boolean;
  instrumentId?: string | null;
}

export async function updateItemMetadata(
  input: UpdateItemMetadataInput,
  ctx?: AuditContext
) {
  return prisma.$transaction(async (tx) => {
    // 1. Assure Item metadata is strictly mutable
    const item = await assertItemMetadataMutable(input.itemId, tx);

    const updateData: any = {};
    if (input.facetId !== undefined) {
      const facet = await tx.facet.findUnique({ where: { id: input.facetId } });
      if (!facet) throw new Error('NOT_FOUND: Belirtilen facet bulunamadı.');
      updateData.facetId = input.facetId;
    }

    if (input.isKeyed !== undefined) {
      updateData.isKeyed = input.isKeyed;
    }

    if (input.isAttentionCheck !== undefined) {
      updateData.isAttentionCheck = input.isAttentionCheck;
    }

    if (input.instrumentId !== undefined) {
      if (input.instrumentId) {
        const inst = await tx.instrument.findUnique({ where: { id: input.instrumentId } });
        if (!inst) throw new Error('NOT_FOUND: Belirtilen instrument bulunamadı.');
        updateData.instrumentId = input.instrumentId;
      } else {
        updateData.instrumentId = null;
      }
    }

    const updated = await tx.item.update({
      where: { id: input.itemId },
      data: updateData,
    });

    // 2. Transactional audit log
    await logScientificAuditEventTx(tx, {
      eventType: 'ITEM_METADATA_UPDATED',
      actorUserId: ctx?.actorUserId,
      targetEntityType: 'Item',
      targetEntityId: updated.id,
      ip: ctx?.ip,
      userAgent: ctx?.userAgent,
      metadata: {
        fieldsChanged: Object.keys(updateData),
      },
    });

    return updated;
  });
}

// ---------------------------------------------------------
// 4. ATOMIC PUBLISH & VERSION REPLACEMENT
// ---------------------------------------------------------

export interface PublishFormVersionInput {
  formVersionId: string;
}

export async function publishAssessmentFormVersion(
  input: PublishFormVersionInput,
  ctx?: AuditContext
) {
  return prisma.$transaction(async (tx) => {
    // 1. Fetch form to get moduleId
    const targetForm = await tx.assessmentFormVersion.findUnique({
      where: { id: input.formVersionId },
      include: { module: true },
    });

    if (!targetForm) {
      throw new Error('NOT_FOUND: Yayınlanacak form bulunamadı.');
    }

    // 2. Concurrency control via PostgreSQL transaction advisory lock on moduleId (Fail Closed)
    const lockKey = hashToBigInt(targetForm.moduleId);
    try {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(${BigInt(lockKey)}::bigint)`;
    } catch (err: any) {
      throw new Error(`PUBLISH_LOCK_FAILED: Modül yayınlama kilidi alınamadı: ${err.message}`);
    }

    // 3. Re-run publication validation inside the transaction
    const validation = await validateAssessmentFormForPublication(input.formVersionId, tx);
    if (!validation.publishable) {
      throw new Error(`PUBLICATION_BLOCKED: ${validation.blockers.join(' | ')}`);
    }

    const now = new Date();

    // 4. Archive any existing PUBLISHED form in the same module
    const existingPublished = await tx.assessmentFormVersion.findFirst({
      where: {
        moduleId: targetForm.moduleId,
        status: 'PUBLISHED',
        id: { not: targetForm.id },
      },
    });

    if (existingPublished) {
      await tx.assessmentFormVersion.update({
        where: { id: existingPublished.id },
        data: {
          status: 'ARCHIVED',
          isPublished: false,
          archivedAt: now,
        },
      });

      await logScientificAuditEventTx(tx, {
        eventType: 'FORM_ARCHIVED',
        actorUserId: ctx?.actorUserId,
        targetEntityType: 'AssessmentFormVersion',
        targetEntityId: existingPublished.id,
        ip: ctx?.ip,
        userAgent: ctx?.userAgent,
        metadata: {
          versionCode: existingPublished.versionCode,
          replacedByFormVersionId: targetForm.id,
          replacedByVersionCode: targetForm.versionCode,
        },
      });
    }

    // 5. Publish target form
    const published = await tx.assessmentFormVersion.update({
      where: { id: targetForm.id },
      data: {
        status: 'PUBLISHED',
        isPublished: true,
        publishedAt: now,
      },
    });

    // 6. Activate all linked ItemVersions
    const formItems = await tx.assessmentFormItem.findMany({
      where: { formVersionId: targetForm.id },
      select: { itemVersionId: true },
    });
    const itemVersionIds = formItems.map((fi) => fi.itemVersionId);

    if (itemVersionIds.length > 0) {
      await tx.itemVersion.updateMany({
        where: { id: { in: itemVersionIds } },
        data: {
          status: 'ACTIVE',
          isActive: true,
        },
      });
    }

    // 7. Transactional audit log for publication
    await logScientificAuditEventTx(tx, {
      eventType: 'FORM_PUBLISHED',
      actorUserId: ctx?.actorUserId,
      targetEntityType: 'AssessmentFormVersion',
      targetEntityId: published.id,
      ip: ctx?.ip,
      userAgent: ctx?.userAgent,
      metadata: {
        moduleId: published.moduleId,
        moduleCode: targetForm.module.code,
        versionCode: published.versionCode,
        itemCount: formItems.length,
        archivedPreviousFormId: existingPublished?.id || null,
        archivedPreviousVersionCode: existingPublished?.versionCode || null,
      },
    });

    return {
      publishedForm: published,
      previousArchivedForm: existingPublished,
    };
  });
}

