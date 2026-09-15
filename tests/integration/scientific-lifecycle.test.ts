import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { assertTestDatabaseSafety } from '../../scripts/verify-test-db-safety';
import { getOrCreateAssessmentSession } from '../../src/services/assessmentService';
import { calculatePreCalibrationScores } from '../../src/services/scoringService';

describe('FAZ 2.7C-1: Scientific Lifecycle & Invariant Integrity', () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    assertTestDatabaseSafety();
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.TEST_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5434/psyche_ai_test?schema=public',
        },
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('verifies AssessmentFormVersion dual-state coherence (status <-> isPublished)', async () => {
    const forms = await prisma.assessmentFormVersion.findMany();
    expect(forms.length).toBeGreaterThan(0);

    for (const form of forms) {
      if (form.status === 'PUBLISHED') {
        expect(form.isPublished).toBe(true);
      } else {
        expect(form.isPublished).toBe(false);
      }
    }
  });

  it('verifies ItemVersion dual-state coherence (status <-> isActive)', async () => {
    const itemVersions = await prisma.itemVersion.findMany();
    expect(itemVersions.length).toBeGreaterThan(0);

    for (const iv of itemVersions) {
      if (iv.status === 'ACTIVE') {
        expect(iv.isActive).toBe(true);
      } else {
        expect(iv.isActive).toBe(false);
      }
    }
  });

  it('enforces single published intake form invariant (COUNT(PUBLISHED) <= 1)', async () => {
    const publishedForms = await prisma.assessmentFormVersion.findMany({
      where: {
        OR: [
          { status: 'PUBLISHED' },
          { isPublished: true },
        ],
      },
      include: {
        items: true,
      },
    });

    expect(publishedForms.length).toBe(1);
    const liveForm = publishedForms[0];
    expect(liveForm.versionCode).toBe('v1.0.0');
    expect(liveForm.status).toBe('PUBLISHED');
    expect(liveForm.isPublished).toBe(true);
    expect(liveForm.items.length).toBe(17);
  });

  it('verifies published live form items derivation and authorType metadata', async () => {
    const liveForm = await prisma.assessmentFormVersion.findFirst({
      where: { status: 'PUBLISHED' },
      include: {
        items: {
          include: {
            itemVersion: true,
          },
        },
      },
    });

    expect(liveForm).toBeDefined();
    expect(liveForm!.items.length).toBe(17);

    for (const formItem of liveForm!.items) {
      const iv = formItem.itemVersion;
      expect(iv.status).toBe('ACTIVE');
      expect(iv.isActive).toBe(true);
      expect(iv.authorType).toBe('LEGACY_UNSPECIFIED');
    }
  });

  it('verifies scoring model reproducibility and pre-calibration nulls', async () => {
    const testUser = await prisma.user.create({
      data: {
        name: 'Scientific Lifecycle Tester',
        email: `scientific_lifecycle_${Date.now()}@psycheai.test`,
        isDemoUser: false,
      },
    });

    try {
      const session = await getOrCreateAssessmentSession(testUser.id, 'MODULE_1_CORE_PERSONALITY');
      expect(session).toBeDefined();
      expect(session.formVersion.versionCode).toBe('v1.0.0');

      const scores = await calculatePreCalibrationScores(session.id);
      expect(scores.scoringModelVersionId).toBeDefined();
      
      const scoringModel = await prisma.scoringModelVersion.findUnique({
        where: { id: scores.scoringModelVersionId }
      });
      expect(scoringModel?.code).toBe('PRE_CALIBRATION_MEAN_V1');
      expect(scores.normStatus).toBe('UNAVAILABLE');
      expect(scores.standardError).toBeNull();
      expect(scores.ci95Lower).toBeNull();
      expect(scores.ci95Upper).toBeNull();
    } finally {
      await prisma.user.delete({ where: { id: testUser.id } }).catch(() => {});
    }
  });

  it('verifies ScientificAuditEvent persistence and actor deletion SetNull integrity', async () => {
    const auditUser = await prisma.user.create({
      data: {
        name: 'Audit Actor Test User',
        email: `audit_actor_${Date.now()}@psycheai.test`,
        isDemoUser: false,
      },
    });

    const auditEvent = await prisma.scientificAuditEvent.create({
      data: {
        eventType: 'VERIFY_READ_ONLY',
        targetEntityType: 'AssessmentFormVersion',
        targetEntityId: 'test-form-version-1',
        actorUserId: auditUser.id,
        metadata: { testRunner: 'vitest', phase: 'FAZ_2_7C_1', reason: 'Integration test audit record' },
      },
    });

    expect(auditEvent.id).toBeDefined();
    expect(auditEvent.actorUserId).toBe(auditUser.id);
    expect(auditEvent.targetEntityType).toBe('AssessmentFormVersion');

    // Delete actor user
    await prisma.user.delete({ where: { id: auditUser.id } });

    // Verify audit event remains with actorUserId = null
    const persistedEvent = await prisma.scientificAuditEvent.findUnique({
      where: { id: auditEvent.id },
    });

    expect(persistedEvent).toBeDefined();
    expect(persistedEvent!.actorUserId).toBeNull();
    expect(persistedEvent!.eventType).toBe('VERIFY_READ_ONLY');

    // Clean up audit event
    await prisma.scientificAuditEvent.delete({ where: { id: auditEvent.id } });
  });
});
