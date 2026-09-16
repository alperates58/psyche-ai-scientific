import { describe, it, expect, vi } from 'vitest';
import {
  deriveOverallTurkishEvidenceLevel as deriveLevelTS,
  assertExecutionEnvironment as assertEnvTS,
  runPreflightChecks as runPreflightTS,
  executeScientificBackfill as executeBackfillTS,
} from '../../prisma/backfill-scientific-data';
import {
  deriveOverallTurkishEvidenceLevel as deriveLevelJS,
  assertExecutionEnvironment as assertEnvJS,
  runPreflightChecks as runPreflightJS,
  executeScientificBackfill as executeBackfillJS,
} from '../../prisma/backfill-runner';
import { verifyScientificC1State as verifyC1TS } from '../../src/lib/scientificC1Verifier';
import { verifyScientificC1State as verifyC1JS } from '../../scripts/verify-c1-state';

describe('FAZ 2.7C-1 & 2.10: Backfill Atomicity & Verifier Safety Unit Tests', () => {
  // Helper to generate a valid 84-facet mock database state
  function createMockValidDb() {
    const mockItems1 = Array.from({ length: 17 }, (_, i) => ({
      id: `m1-item-${i + 1}`,
      formVersionId: 'form-1',
      itemVersionId: `iv-m1-${i + 1}`,
      sortOrder: i + 1,
      itemVersion: {
        id: `iv-m1-${i + 1}`,
        status: 'ACTIVE',
        isActive: true,
        authorType: 'ADMIN_AUTHORED',
      },
    }));

    const mockItems2 = Array.from({ length: 10 }, (_, i) => ({
      id: `m2-item-${i + 1}`,
      formVersionId: 'form-2',
      itemVersionId: `iv-m2-${i + 1}`,
      sortOrder: i + 1,
      itemVersion: {
        id: `iv-m2-${i + 1}`,
        status: 'ACTIVE',
        isActive: true,
        authorType: 'ADMIN_AUTHORED',
      },
    }));

    const mockModule1 = {
      id: 'mod-1',
      code: 'MODULE_1_CORE_PERSONALITY',
      titleTr: 'Temel Kişilik',
      formVersions: [],
    };
    const mockModule2 = {
      id: 'mod-2',
      code: 'MODULE_2_ROSENBERG_SELF_ESTEEM',
      titleTr: 'Rosenberg Benlik Saygısı',
      formVersions: [],
    };

    const mockForm1 = {
      id: 'form-1',
      moduleId: 'mod-1',
      versionCode: 'v1.0.0',
      status: 'PUBLISHED',
      isPublished: true,
      items: mockItems1,
      module: mockModule1,
    };

    const mockForm2 = {
      id: 'form-2',
      moduleId: 'mod-2',
      versionCode: 'v1.0.0',
      status: 'PUBLISHED',
      isPublished: true,
      items: mockItems2,
      module: mockModule2,
    };

    mockModule1.formVersions = [mockForm1] as any;
    mockModule2.formVersions = [mockForm2] as any;

    // 14 DIRECT, 24 LEXICAL, 2 RELATED, 44 NO_DIRECT = 84
    const mockSummaries = [
      ...Array.from({ length: 14 }, (_, i) => ({ id: `s-dir-${i}`, overallTurkishEvidenceLevel: 'DIRECT' })),
      ...Array.from({ length: 24 }, (_, i) => ({ id: `s-lex-${i}`, overallTurkishEvidenceLevel: 'LEXICAL' })),
      ...Array.from({ length: 2 }, (_, i) => ({ id: `s-rel-${i}`, overallTurkishEvidenceLevel: 'RELATED' })),
      ...Array.from({ length: 44 }, (_, i) => ({ id: `s-nod-${i}`, overallTurkishEvidenceLevel: 'NO_DIRECT' })),
    ];

    let currentLiveItemIds = new Set([
      ...mockItems1.map((i) => i.itemVersionId),
    ]);

    const writes: Array<{ operation: string; model: string; args: any }> = [];

    const db: any = {
      facet: {
        count: vi.fn().mockResolvedValue(84),
      },
      facetValidationSummary: {
        count: vi.fn().mockResolvedValue(84),
        findMany: vi.fn().mockResolvedValue(mockSummaries),
        upsert: vi.fn().mockImplementation(async (args) => {
          writes.push({ operation: 'upsert', model: 'facetValidationSummary', args });
          return { id: `summary-${args.where.facetId}` };
        }),
      },
      facetValidationStudyEvidence: {
        count: vi.fn().mockResolvedValue(40),
        deleteMany: vi.fn().mockImplementation(async (args) => {
          writes.push({ operation: 'deleteMany', model: 'facetValidationStudyEvidence', args });
          return { count: 1 };
        }),
        create: vi.fn().mockImplementation(async (args) => {
          writes.push({ operation: 'create', model: 'facetValidationStudyEvidence', args });
          return { id: 'study-new' };
        }),
      },
      facetReliabilityEvidence: {
        count: vi.fn().mockResolvedValue(40),
        deleteMany: vi.fn().mockImplementation(async (args) => {
          writes.push({ operation: 'deleteMany', model: 'facetReliabilityEvidence', args });
          return { count: 1 };
        }),
        create: vi.fn().mockImplementation(async (args) => {
          writes.push({ operation: 'create', model: 'facetReliabilityEvidence', args });
          return { id: 'rel-new' };
        }),
      },
      assessmentModule: {
        findMany: vi.fn().mockResolvedValue([mockModule1, mockModule2]),
      },
      assessmentFormVersion: {
        findMany: vi.fn().mockResolvedValue([mockForm1, mockForm2]),
        findFirst: vi.fn().mockResolvedValue(mockForm1),
        update: vi.fn().mockImplementation(async (args) => {
          writes.push({ operation: 'update', model: 'assessmentFormVersion', args });
          return { id: args.where.id };
        }),
        updateMany: vi.fn().mockImplementation(async (args) => {
          writes.push({ operation: 'updateMany', model: 'assessmentFormVersion', args });
          return { count: 1 };
        }),
      },
      itemVersion: {
        count: vi.fn().mockImplementation(async (args) => {
          const notIn = args?.where?.id?.notIn || [];
          const notInSet = new Set(notIn);
          let outsideActive = 0;
          for (const id of currentLiveItemIds) {
            if (!notInSet.has(id)) outsideActive++;
          }
          return outsideActive;
        }),
        updateMany: vi.fn().mockImplementation(async (args) => {
          writes.push({ operation: 'updateMany', model: 'itemVersion', args });
          return { count: 17 };
        }),
      },
      instrument: {
        findMany: vi.fn().mockResolvedValue([{ id: 'inst-1' }]),
      },
      scientificSource: {
        findMany: vi.fn().mockResolvedValue([{ id: 'src-1' }]),
      },
      $transaction: vi.fn().mockImplementation(async (callback, _opts) => {
        return await callback(db);
      }),
      _setLiveItemIds: (ids: Set<string>) => {
        currentLiveItemIds = ids;
      },
      _writes: writes,
    };

    return { db, mockModule1, mockModule2, mockForm1, mockForm2, mockSummaries, writes };
  }

  // =========================================================================
  // SCENARIO 1: Incomplete + authorization yok => fail-closed
  // =========================================================================
  describe('1. Incomplete state + missing authorization => fail-closed', () => {
    it('rejects when target is production but NODE_ENV is development', () => {
      const origNodeEnv = process.env.NODE_ENV;
      const origAllow = process.env.ALLOW_SCIENTIFIC_BACKFILL_2_7C1;
      const origBackup = process.env.SCIENTIFIC_BACKUP_VERIFIED;
      try {
        process.env.NODE_ENV = 'development';
        process.env.ALLOW_SCIENTIFIC_BACKFILL_2_7C1 = 'YES';
        process.env.SCIENTIFIC_BACKUP_VERIFIED = 'YES';

        expect(() => assertEnvTS('production', false, () => {})).toThrow(/Must be 'production'/);
        expect(() => assertEnvJS('production', false)).toThrow(/Must be 'production'/);
      } finally {
        process.env.NODE_ENV = origNodeEnv;
        process.env.ALLOW_SCIENTIFIC_BACKFILL_2_7C1 = origAllow;
        process.env.SCIENTIFIC_BACKUP_VERIFIED = origBackup;
      }
    });

    it('rejects when target is production but ALLOW_SCIENTIFIC_BACKFILL_2_7C1 is missing', () => {
      const origNodeEnv = process.env.NODE_ENV;
      const origAllow = process.env.ALLOW_SCIENTIFIC_BACKFILL_2_7C1;
      const origBackup = process.env.SCIENTIFIC_BACKUP_VERIFIED;
      try {
        process.env.NODE_ENV = 'production';
        delete process.env.ALLOW_SCIENTIFIC_BACKFILL_2_7C1;
        process.env.SCIENTIFIC_BACKUP_VERIFIED = 'YES';

        expect(() => assertEnvTS('production', false, () => {})).toThrow(/ALLOW_SCIENTIFIC_BACKFILL_2_7C1=YES/);
        expect(() => assertEnvJS('production', false)).toThrow(/ALLOW_SCIENTIFIC_BACKFILL_2_7C1=YES/);
      } finally {
        process.env.NODE_ENV = origNodeEnv;
        process.env.ALLOW_SCIENTIFIC_BACKFILL_2_7C1 = origAllow;
        process.env.SCIENTIFIC_BACKUP_VERIFIED = origBackup;
      }
    });

    it('rejects when target is production but SCIENTIFIC_BACKUP_VERIFIED is missing', () => {
      const origNodeEnv = process.env.NODE_ENV;
      const origAllow = process.env.ALLOW_SCIENTIFIC_BACKFILL_2_7C1;
      const origBackup = process.env.SCIENTIFIC_BACKUP_VERIFIED;
      try {
        process.env.NODE_ENV = 'production';
        process.env.ALLOW_SCIENTIFIC_BACKFILL_2_7C1 = 'YES';
        delete process.env.SCIENTIFIC_BACKUP_VERIFIED;

        expect(() => assertEnvTS('production', false, () => {})).toThrow(/SCIENTIFIC_BACKUP_VERIFIED=YES/);
        expect(() => assertEnvJS('production', false)).toThrow(/SCIENTIFIC_BACKUP_VERIFIED=YES/);
      } finally {
        process.env.NODE_ENV = origNodeEnv;
        process.env.ALLOW_SCIENTIFIC_BACKFILL_2_7C1 = origAllow;
        process.env.SCIENTIFIC_BACKUP_VERIFIED = origBackup;
      }
    });
  });

  // =========================================================================
  // SCENARIO 2: Authorized backfill => success within transaction
  // =========================================================================
  describe('2. Authorized backfill => success within atomic transaction', () => {
    it('passes environment check when properly authorized', () => {
      const origNodeEnv = process.env.NODE_ENV;
      const origAllow = process.env.ALLOW_SCIENTIFIC_BACKFILL_2_7C1;
      const origBackup = process.env.SCIENTIFIC_BACKUP_VERIFIED;
      try {
        process.env.NODE_ENV = 'production';
        process.env.ALLOW_SCIENTIFIC_BACKFILL_2_7C1 = 'YES';
        process.env.SCIENTIFIC_BACKUP_VERIFIED = 'YES';

        expect(() => assertEnvTS('production', false, () => {})).not.toThrow();
        expect(() => assertEnvJS('production', false)).not.toThrow();
      } finally {
        process.env.NODE_ENV = origNodeEnv;
        process.env.ALLOW_SCIENTIFIC_BACKFILL_2_7C1 = origAllow;
        process.env.SCIENTIFIC_BACKUP_VERIFIED = origBackup;
      }
    });

    it('executes atomic backfill inside $transaction', async () => {
      const { db, writes } = createMockValidDb();

      // State is initially incomplete (0 summaries)
      db.facetValidationSummary.count.mockResolvedValueOnce(0); // for initial state check

      const result = await executeBackfillTS({
        prisma: db,
        target: 'production',
        dryRun: false,
        logger: () => {},
      });

      expect(result.success).toBe(true);
      expect(result.alreadyApplied).toBe(false);
      expect(db.$transaction).toHaveBeenCalledTimes(1);
      expect(writes.length).toBeGreaterThan(0);
    });
  });

  // =========================================================================
  // SCENARIO 3: Complete state + flags yok => verification success (read-only)
  // =========================================================================
  describe('3. Complete state + flags yok => startup/verification success', () => {
    it('verifies complete C1 state on both JS and TS verifiers without inspecting flags', async () => {
      const { db } = createMockValidDb();

      const resultTS = await verifyC1TS(db);
      expect(resultTS.isComplete).toBe(true);
      expect(resultTS.errors.length).toBe(0);
      expect(resultTS.details.publishedFormsCount).toBe(2);
      expect(resultTS.details.evidenceDistribution.DIRECT).toBe(14);
      expect(resultTS.details.evidenceDistribution.LEXICAL).toBe(24);
      expect(resultTS.details.evidenceDistribution.RELATED).toBe(2);
      expect(resultTS.details.evidenceDistribution.NO_DIRECT).toBe(44);

      const resultJS = await verifyC1JS(db);
      expect(resultJS.isComplete).toBe(true);
      expect(resultJS.errors.length).toBe(0);
      expect(resultJS.details.publishedFormsCount).toBe(2);
      expect(resultJS.details.evidenceDistribution.DIRECT).toBe(14);
      expect(resultJS.details.evidenceDistribution.LEXICAL).toBe(24);
      expect(resultJS.details.evidenceDistribution.RELATED).toBe(2);
      expect(resultJS.details.evidenceDistribution.NO_DIRECT).toBe(44);
    });
  });

  // =========================================================================
  // SCENARIO 4 & 5: Complete state restart & second backfill => no changes
  // =========================================================================
  describe('4 & 5. Complete state restart & second backfill => ALREADY_APPLIED (0 writes)', () => {
    it('returns ALREADY_APPLIED with zero database writes on second run (TS)', async () => {
      const { db, writes } = createMockValidDb();

      const result = await executeBackfillTS({
        prisma: db,
        target: 'production',
        dryRun: false,
        logger: () => {},
      });

      expect(result.success).toBe(true);
      expect(result.alreadyApplied).toBe(true);
      expect(db.$transaction).not.toHaveBeenCalled();
      expect(writes.length).toBe(0);
    });

    it('returns ALREADY_APPLIED with zero database writes on second run (JS)', async () => {
      const { db, writes } = createMockValidDb();

      const result = await executeBackfillJS({
        prisma: db,
        target: 'production',
        dryRun: false,
      });

      expect(result.success).toBe(true);
      expect(result.alreadyApplied).toBe(true);
      expect(db.$transaction).not.toHaveBeenCalled();
      expect(writes.length).toBe(0);
    });
  });

  // =========================================================================
  // SCENARIO 6: Backfill error mid-way => transaction rollback
  // =========================================================================
  describe('6. Mid-backfill error => transaction rejects and aborts', () => {
    it('aborts transaction when a database operation fails during upsert loop', async () => {
      const { db } = createMockValidDb();
      db.facetValidationSummary.count.mockResolvedValueOnce(0); // incomplete state

      // Simulate a failure on the 10th upsert
      let upsertCallCount = 0;
      db.facetValidationSummary.upsert.mockImplementation(async () => {
        upsertCallCount++;
        if (upsertCallCount >= 10) {
          throw new Error('SIMULATED_DB_ERROR: Connection dropped during facet upsert');
        }
        return { id: `summary-${upsertCallCount}` };
      });

      await expect(
        executeBackfillTS({
          prisma: db,
          target: 'production',
          dryRun: false,
          logger: () => {},
        })
      ).rejects.toThrow(/SIMULATED_DB_ERROR/);
    });
  });

  // =========================================================================
  // SCENARIO 7: Verifier failure => fail-closed
  // =========================================================================
  describe('7. Verifier detects invalid states and fails closed', () => {
    it('detects summary count mismatch (< 84)', async () => {
      const { db } = createMockValidDb();
      db.facetValidationSummary.count.mockResolvedValue(83);

      const result = await verifyC1TS(db);
      expect(result.isComplete).toBe(false);
      expect(result.errors.some((e: string) => e.includes('VALIDATION_SUMMARY_COUNT_MISMATCH'))).toBe(true);
    });

    it('detects missing study evidence', async () => {
      const { db } = createMockValidDb();
      db.facetValidationStudyEvidence.count.mockResolvedValue(0);

      const result = await verifyC1TS(db);
      expect(result.isComplete).toBe(false);
      expect(result.errors.some((e: string) => e.includes('STUDY_EVIDENCE_EMPTY'))).toBe(true);
    });

    it('detects missing reliability evidence', async () => {
      const { db } = createMockValidDb();
      db.facetReliabilityEvidence.count.mockResolvedValue(0);

      const result = await verifyC1TS(db);
      expect(result.isComplete).toBe(false);
      expect(result.errors.some((e: string) => e.includes('RELIABILITY_EVIDENCE_EMPTY'))).toBe(true);
    });

    it('detects evidence level distribution mismatch', async () => {
      const { db, mockSummaries } = createMockValidDb();
      // Corrupt one DIRECT into LEXICAL
      mockSummaries[0].overallTurkishEvidenceLevel = 'LEXICAL';
      db.facetValidationSummary.findMany.mockResolvedValue(mockSummaries);

      const result = await verifyC1TS(db);
      expect(result.isComplete).toBe(false);
      expect(result.errors.some((e: string) => e.includes('EVIDENCE_DISTRIBUTION_MISMATCH'))).toBe(true);
    });
  });

  // =========================================================================
  // SCENARIO 8: Multi-module / Draft records => no false failures
  // =========================================================================
  describe('8. Multi-module & Draft records do not produce false failures', () => {
    it('accepts multiple modules with 1 published form each', async () => {
      const { db, mockForm1, mockForm2 } = createMockValidDb();
      db._setLiveItemIds(
        new Set([...mockForm1.items.map((i: any) => i.itemVersionId), ...mockForm2.items.map((i: any) => i.itemVersionId)])
      );

      const result = await verifyC1TS(db);
      expect(result.isComplete).toBe(true);
      expect(result.details.publishedFormsCount).toBe(2);
      expect(result.details.modulesSummary.length).toBe(2);
    });

    it('accepts modules with 0 published forms (e.g. draft modules)', async () => {
      const { db, mockModule1, mockForm1 } = createMockValidDb();
      const mockModuleDraft = { id: 'mod-draft', code: 'MODULE_3_DRAFT', titleTr: 'Taslak Modül' };

      db._setLiveItemIds(new Set(mockForm1.items.map((i: any) => i.itemVersionId)));
      db.assessmentModule.findMany.mockResolvedValue([mockModule1, mockModuleDraft]);
      db.assessmentFormVersion.findMany.mockResolvedValue([mockForm1]); // only module 1 is published

      const result = await verifyC1TS(db);
      expect(result.isComplete).toBe(true);
      expect(result.details.publishedFormsCount).toBe(1);
    });

    it('rejects when a single module has > 1 published form', async () => {
      const { db, mockModule1, mockForm1 } = createMockValidDb();
      const mockForm1Duplicate = { ...mockForm1, id: 'form-1-dup', versionCode: 'v1.1.0' };

      db.assessmentFormVersion.findMany.mockResolvedValue([mockForm1, mockForm1Duplicate]);

      const result = await verifyC1TS(db);
      expect(result.isComplete).toBe(false);
      expect(result.errors.some((e: string) => e.includes('MODULE_MULTIPLE_PUBLISHED_FORMS'))).toBe(true);
    });
  });

  // =========================================================================
  // SCENARIO 9: Ambiguous ACTIVE items outside published forms => failure
  // =========================================================================
  describe('9. Ambiguous ACTIVE items outside published forms => failure', () => {
    it('fails when active item versions exist outside published forms', async () => {
      const { db } = createMockValidDb();
      db.itemVersion.count.mockResolvedValue(2); // 2 rogue active items

      const result = await verifyC1TS(db);
      expect(result.isComplete).toBe(false);
      expect(result.errors.some((e: string) => e.includes('AMBIGUOUS_ACTIVE_ITEMS'))).toBe(true);
    });
  });

  // =========================================================================
  // SCENARIO 10: Dry-run => zero writes
  // =========================================================================
  describe('10. Dry-run => zero database writes', () => {
    it('dry-run reports metrics and performs 0 database writes (TS)', async () => {
      const { db, writes } = createMockValidDb();
      db.facetValidationSummary.count.mockResolvedValueOnce(0); // incomplete state

      const result = await executeBackfillTS({
        prisma: db,
        target: 'production',
        dryRun: true,
        logger: () => {},
      });

      expect(result.success).toBe(true);
      expect(result.dryRun).toBe(true);
      expect(db.$transaction).not.toHaveBeenCalled();
      expect(writes.length).toBe(0);
    });

    it('dry-run reports metrics and performs 0 database writes (JS)', async () => {
      const { db, writes } = createMockValidDb();
      db.facetValidationSummary.count.mockResolvedValueOnce(0); // incomplete state

      const result = await executeBackfillJS({
        prisma: db,
        target: 'production',
        dryRun: true,
      });

      expect(result.success).toBe(true);
      expect(result.dryRun).toBe(true);
      expect(db.$transaction).not.toHaveBeenCalled();
      expect(writes.length).toBe(0);
    });
  });
});
