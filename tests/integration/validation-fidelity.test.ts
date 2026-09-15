import fs from 'fs';
import path from 'path';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { assertTestDatabaseSafety } from '../../scripts/verify-test-db-safety';
import { deriveOverallTurkishEvidenceLevel } from '../../prisma/backfill-scientific-data';

describe('FAZ 2.7C-1: Turkish Validation Matrix Roundtrip Lossless Fidelity', () => {
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

  it('verifies exact 84 facets and aggregate evidence level counts match ground truth', async () => {
    const matrixPath = path.resolve(process.cwd(), 'research/turkish-validation-matrix.json');
    const rawMatrix: any[] = JSON.parse(fs.readFileSync(matrixPath, 'utf8'));

    expect(rawMatrix.length).toBe(84);

    const summaries = await prisma.facetValidationSummary.findMany({
      include: {
        facet: true,
        studyEvidences: true,
        reliabilityEvidences: true,
      },
    });

    expect(summaries.length).toBe(84);

    const levelCounts = {
      DIRECT: 0,
      LEXICAL: 0,
      RELATED: 0,
      NO_DIRECT: 0,
    };

    for (const s of summaries) {
      if (s.overallTurkishEvidenceLevel in levelCounts) {
        levelCounts[s.overallTurkishEvidenceLevel as keyof typeof levelCounts]++;
      }
    }

    expect(levelCounts.DIRECT).toBe(14);
    expect(levelCounts.LEXICAL).toBe(24);
    expect(levelCounts.RELATED).toBe(2);
    expect(levelCounts.NO_DIRECT).toBe(44);
    expect(levelCounts.DIRECT + levelCounts.LEXICAL + levelCounts.RELATED + levelCounts.NO_DIRECT).toBe(84);
  });

  it('losslessly preserves all study dimensions, sample sizes, alignment levels, and reliability metrics', async () => {
    const matrixPath = path.resolve(process.cwd(), 'research/turkish-validation-matrix.json');
    const rawMatrix: any[] = JSON.parse(fs.readFileSync(matrixPath, 'utf8'));

    const summaries = await prisma.facetValidationSummary.findMany({
      include: {
        studyEvidences: true,
        reliabilityEvidences: true,
      },
    });

    const summaryMap = new Map(summaries.map((s) => [s.facetId, s]));

    for (const raw of rawMatrix) {
      const dbSummary = summaryMap.get(raw.facetId);
      expect(dbSummary).toBeDefined();
      if (!dbSummary) continue;

      // 1. Overall Evidence Level & Status
      const expectedLevel = deriveOverallTurkishEvidenceLevel(raw.status);
      expect(dbSummary.overallTurkishEvidenceLevel).toBe(expectedLevel);
      expect(dbSummary.overallStatus).toBe(raw.status);
      expect(dbSummary.measurementAlignmentLevel).toBe(raw.measurementAlignmentLevel || 'NOT_APPLICABLE');
      expect(dbSummary.measurementInvarianceStatus).toBe(raw.measurementInvarianceStatus || 'NOT_ASSESSED');
      expect(dbSummary.instrumentValidationEstablished).toBe(Boolean(raw.instrumentValidationEstablished));

      // 2. Study Evidences
      if (raw.supportingEvidence && raw.supportingEvidence.length > 0) {
        expect(dbSummary.studyEvidences.length).toBeGreaterThanOrEqual(raw.supportingEvidence.length);
        for (const supp of raw.supportingEvidence) {
          const matched = dbSummary.studyEvidences.find((se) => se.evidenceType === supp.evidenceType);
          expect(matched).toBeDefined();
          if (matched && supp.studySampleN) {
            expect(matched.sampleN).toBe(supp.studySampleN);
          }
          if (matched && supp.doesNotEstablish) {
            expect(Array.isArray(matched.doesNotEstablish)).toBe(true);
            expect(matched.doesNotEstablish).toEqual(supp.doesNotEstablish);
          }
        }
      }

      // 3. Reliability Metrics
      if (raw.reliabilityEvidence?.internalConsistency?.value !== null && raw.reliabilityEvidence?.internalConsistency?.value !== undefined) {
        const ic = dbSummary.reliabilityEvidences.find((re) => re.metricType === 'INTERNAL_CONSISTENCY');
        expect(ic).toBeDefined();
        if (ic) {
          expect(ic.value).toBe(Number(raw.reliabilityEvidence.internalConsistency.value));
        }
      }

      if (raw.reliabilityEvidence?.testRetest?.value !== null && raw.reliabilityEvidence?.testRetest?.value !== undefined) {
        const tr = dbSummary.reliabilityEvidences.find((re) => re.metricType === 'TEST_RETEST');
        expect(tr).toBeDefined();
        if (tr) {
          expect(tr.value).toBe(Number(raw.reliabilityEvidence.testRetest.value));
        }
      }
    }
  });
});
