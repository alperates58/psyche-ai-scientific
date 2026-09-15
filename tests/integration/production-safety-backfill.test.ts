import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { assertTestDatabaseSafety, validateTestDatabaseConfig } from '../../scripts/verify-test-db-safety';
import {
  assertExecutionEnvironment,
  runPreflightChecks,
  executeScientificBackfill,
} from '../../prisma/backfill-scientific-data';
import { verifyScientificC1State } from '../../src/lib/scientificC1Verifier';

describe('FAZ 2.7C-1: Production Release Safety & Backfill Idempotency Tests', () => {
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

  it('1. TEST target accepts strictly localhost:5434/psyche_ai_test and rejects dev or arbitrary ports', () => {
    // Valid test configuration
    const validResult = validateTestDatabaseConfig(
      'postgresql://postgres:postgres@localhost:5434/psyche_ai_test?schema=public',
      'postgresql://postgres:postgres@localhost:5433/psyche_ai?schema=public'
    );
    expect(validResult.valid).toBe(true);

    // Rejection: Dev port (5433)
    const invalidPort = validateTestDatabaseConfig(
      'postgresql://postgres:postgres@localhost:5433/psyche_ai_test?schema=public'
    );
    expect(invalidPort.valid).toBe(false);
    expect(invalidPort.error).toContain('port');

    // Rejection: Dev db name (psyche_ai)
    const invalidDb = validateTestDatabaseConfig(
      'postgresql://postgres:postgres@localhost:5434/psyche_ai?schema=public'
    );
    expect(invalidDb.valid).toBe(false);
    expect(invalidDb.error).toContain('psyche_ai_test');

    // Rejection: Remote host
    const invalidHost = validateTestDatabaseConfig(
      'postgresql://postgres:postgres@remote-server.com:5434/psyche_ai_test?schema=public'
    );
    expect(invalidHost.valid).toBe(false);
    expect(invalidHost.error).toContain('localhost or 127.0.0.1');
  });

  it('2. Production target refuses when NODE_ENV is not production', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    const originalAllow = process.env.ALLOW_SCIENTIFIC_BACKFILL_2_7C1;
    const originalBackup = process.env.SCIENTIFIC_BACKUP_VERIFIED;

    try {
      process.env.NODE_ENV = 'development';
      process.env.ALLOW_SCIENTIFIC_BACKFILL_2_7C1 = 'YES';
      process.env.SCIENTIFIC_BACKUP_VERIFIED = 'YES';

      expect(() => {
        assertExecutionEnvironment('production', false, () => {});
      }).toThrowError(/Must be 'production'/);
    } finally {
      process.env.NODE_ENV = originalNodeEnv;
      process.env.ALLOW_SCIENTIFIC_BACKFILL_2_7C1 = originalAllow;
      process.env.SCIENTIFIC_BACKUP_VERIFIED = originalBackup;
    }
  });

  it('3. Production target refuses without ALLOW_SCIENTIFIC_BACKFILL_2_7C1=YES', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    const originalAllow = process.env.ALLOW_SCIENTIFIC_BACKFILL_2_7C1;
    const originalBackup = process.env.SCIENTIFIC_BACKUP_VERIFIED;

    try {
      process.env.NODE_ENV = 'production';
      delete process.env.ALLOW_SCIENTIFIC_BACKFILL_2_7C1;
      process.env.SCIENTIFIC_BACKUP_VERIFIED = 'YES';

      expect(() => {
        assertExecutionEnvironment('production', false, () => {});
      }).toThrowError(/ALLOW_SCIENTIFIC_BACKFILL_2_7C1=YES/);
    } finally {
      process.env.NODE_ENV = originalNodeEnv;
      process.env.ALLOW_SCIENTIFIC_BACKFILL_2_7C1 = originalAllow;
      process.env.SCIENTIFIC_BACKUP_VERIFIED = originalBackup;
    }
  });

  it('4. Production target refuses without SCIENTIFIC_BACKUP_VERIFIED=YES', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    const originalAllow = process.env.ALLOW_SCIENTIFIC_BACKFILL_2_7C1;
    const originalBackup = process.env.SCIENTIFIC_BACKUP_VERIFIED;

    try {
      process.env.NODE_ENV = 'production';
      process.env.ALLOW_SCIENTIFIC_BACKFILL_2_7C1 = 'YES';
      delete process.env.SCIENTIFIC_BACKUP_VERIFIED;

      expect(() => {
        assertExecutionEnvironment('production', false, () => {});
      }).toThrowError(/SCIENTIFIC_BACKUP_VERIFIED=YES/);
    } finally {
      process.env.NODE_ENV = originalNodeEnv;
      process.env.ALLOW_SCIENTIFIC_BACKFILL_2_7C1 = originalAllow;
      process.env.SCIENTIFIC_BACKUP_VERIFIED = originalBackup;
    }
  });

  it('5. Production target succeeds when all production safety flags and backup are verified', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    const originalAllow = process.env.ALLOW_SCIENTIFIC_BACKFILL_2_7C1;
    const originalBackup = process.env.SCIENTIFIC_BACKUP_VERIFIED;

    try {
      process.env.NODE_ENV = 'production';
      process.env.ALLOW_SCIENTIFIC_BACKFILL_2_7C1 = 'YES';
      process.env.SCIENTIFIC_BACKUP_VERIFIED = 'YES';

      expect(() => {
        assertExecutionEnvironment('production', false, () => {});
      }).not.toThrow();
    } finally {
      process.env.NODE_ENV = originalNodeEnv;
      process.env.ALLOW_SCIENTIFIC_BACKFILL_2_7C1 = originalAllow;
      process.env.SCIENTIFIC_BACKUP_VERIFIED = originalBackup;
    }
  });

  it('6. Production preflight aborts when matrix entries do not equal 84', async () => {
    const mockMatrix: any[] = [{ facetId: 'sample' }];
    await expect(runPreflightChecks(prisma, mockMatrix)).rejects.toThrowError(
      /Validation matrix JSON must contain exactly 84 facets/
    );
  });

  it('7. Dry run mode reports inspection metrics without performing database writes', async () => {
    const result = await executeScientificBackfill({
      prisma,
      dryRun: true,
      logger: () => {},
    });

    expect(result.success).toBe(true);
    expect(result.dryRun).toBe(true);
    expect(result.summary.ontologyFacetsCount).toBe(84);
    expect(result.summary.liveItemsCount).toBe(17);
    expect(result.summary.liveFormCode).toBe('v1.0.0');
  });

  it('8. Second backfill run is strictly idempotent (ALREADY_APPLIED / NO_CHANGES_REQUIRED)', async () => {
    // Run backfill execution
    const firstResult = await executeScientificBackfill({
      prisma,
      dryRun: false,
      logger: () => {},
    });
    expect(firstResult.success).toBe(true);

    // Record baseline counts
    const summariesCount = await prisma.facetValidationSummary.count();
    const studiesCount = await prisma.facetValidationStudyEvidence.count();
    const relCount = await prisma.facetReliabilityEvidence.count();

    expect(summariesCount).toBe(84);

    // Run backfill a second time
    const secondResult = await executeScientificBackfill({
      prisma,
      dryRun: false,
      logger: () => {},
    });

    expect(secondResult.success).toBe(true);
    expect(secondResult.alreadyApplied).toBe(true);

    // Assert zero duplication of child or summary records
    const postSummariesCount = await prisma.facetValidationSummary.count();
    const postStudiesCount = await prisma.facetValidationStudyEvidence.count();
    const postRelCount = await prisma.facetReliabilityEvidence.count();

    expect(postSummariesCount).toBe(summariesCount);
    expect(postStudiesCount).toBe(studiesCount);
    expect(postRelCount).toBe(relCount);
  });

  it('9. Scientific C1 state verifier detects incomplete state when data is missing or corrupted', async () => {
    // Temporarily mutate a record in a transaction-like test and revert
    const testForm = await prisma.assessmentFormVersion.findFirst({
      where: { versionCode: 'v1.0.0' },
    });
    expect(testForm).toBeDefined();

    try {
      // Set status to DRAFT to test verifier detection
      await prisma.assessmentFormVersion.update({
        where: { id: testForm!.id },
        data: { status: 'DRAFT', isPublished: false },
      });

      const incompleteResult = await verifyScientificC1State(prisma);
      expect(incompleteResult.isComplete).toBe(false);
      expect(incompleteResult.errors.some((e) => e.includes('INTAKE_INVARIANT_VIOLATION') || e.includes('LIFECYCLE_INCOHERENCE'))).toBe(true);
    } finally {
      // Restore coherent state
      await prisma.assessmentFormVersion.update({
        where: { id: testForm!.id },
        data: { status: 'PUBLISHED', isPublished: true },
      });
    }
  });

  it('10. Scientific C1 state verifier passes fully coherent completed state', async () => {
    const verification = await verifyScientificC1State(prisma);

    expect(verification.isComplete).toBe(true);
    expect(verification.errors.length).toBe(0);
    expect(verification.details.schemaReady).toBe(true);
    expect(verification.details.publishedFormsCount).toBe(1);
    expect(verification.details.liveFormCode).toBe('v1.0.0');
    expect(verification.details.liveFormItemCount).toBe(17);
    expect(verification.details.liveItemVersionsCount).toBe(17);
    expect(verification.details.activeItemsOutsideLiveFormCount).toBe(0);
    expect(verification.details.validationSummariesCount).toBe(84);
    expect(verification.details.evidenceDistribution.DIRECT).toBe(14);
    expect(verification.details.evidenceDistribution.LEXICAL).toBe(24);
    expect(verification.details.evidenceDistribution.RELATED).toBe(2);
    expect(verification.details.evidenceDistribution.NO_DIRECT).toBe(44);
  });

  it('11. Scoring models and historical pre-calibration nulls remain strictly unaltered', async () => {
    const scoringModel = await prisma.scoringModelVersion.findUnique({
      where: { code: 'PRE_CALIBRATION_MEAN_V1' },
    });

    expect(scoringModel).toBeDefined();
    expect(scoringModel?.isPreCalibration).toBe(true);
    expect(scoringModel?.algorithm).toBe('UNWEIGHTED_COMPOSITE_MEAN');

    const norms = await prisma.normVersion.findMany();
    for (const norm of norms) {
      expect(norm.status).toBe('UNAVAILABLE');
      expect(norm.isCalibrated).toBe(false);
    }
  });
});
