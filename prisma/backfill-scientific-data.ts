import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { assertTestDatabaseSafety } from '../scripts/verify-test-db-safety';

const prisma = new PrismaClient();

interface ValidationMatrixEntry {
  facetId: string;
  domainId: string;
  constructId: string;
  facetName: string;
  status: string;
  sourceIds: string[];
  instrumentId?: string | null;
  sampleDescription?: string | null;
  measurementInvarianceStatus?: string | null;
  reliabilityEvidence?: {
    internalConsistency?: {
      value?: number | null;
      metric?: string | null;
      sourceId?: string | null;
      location?: string | null;
      claimVerificationStatus?: string | null;
      humanVerified?: boolean;
    };
    testRetest?: {
      value?: number | null;
      interval?: string | null;
      sourceId?: string | null;
      location?: string | null;
      claimVerificationStatus?: string | null;
      humanVerified?: boolean;
    };
  };
  scientificNotes?: string | null;
  auditHistory?: any[];
  targetConstructInstrumentId?: string | null;
  supportingEvidenceInstrumentId?: string | null;
  instrumentValidationEstablished?: boolean;
  studyEvidence?: {
    sampleN?: {
      value?: number | null;
      description?: string | null;
      sourceId?: string | null;
      location?: string | null;
      claimVerificationStatus?: string | null;
      humanVerified?: boolean;
    };
    population?: string | null;
    samplingMethod?: string | null;
  };
  supportingEvidence?: Array<{
    sourceId: string;
    evidenceType: string;
    studySampleN?: number | null;
    appliesToLevel?: string;
    doesNotEstablish?: string[];
  }>;
  measurementAlignmentLevel?: string;
  factorStructureEvidence?: {
    status?: string;
    level?: string;
    sourceId?: string | null;
    claimVerificationStatus?: string;
    verificationMethod?: string;
    humanVerified?: boolean;
  };
}

/**
 * Maps JSON status strings to canonical 4-tier Turkish evidence levels:
 * DIRECT (14), LEXICAL (24), RELATED (2), NO_DIRECT (44) -> Total 84
 */
export function deriveOverallTurkishEvidenceLevel(status: string): 'DIRECT' | 'LEXICAL' | 'RELATED' | 'NO_DIRECT' {
  const normalized = status.toUpperCase();
  if (normalized === 'DIRECT_FACET_VALIDATION' || normalized === 'DIRECT') {
    return 'DIRECT';
  }
  if (normalized === 'LEXICAL_SUPPORT_ONLY' || normalized === 'LEXICAL') {
    return 'LEXICAL';
  }
  if (normalized === 'RELATED_MEASURE_VALIDATION' || normalized === 'RELATED') {
    return 'RELATED';
  }
  return 'NO_DIRECT';
}

export async function runScientificBackfill(customPrisma?: PrismaClient) {
  const db = customPrisma || prisma;

  console.log('\n==================================================');
  console.log('FAZ 2.7C-1: SCIENTIFIC BACKFILL EXECUTION');
  console.log('==================================================');

  // 1. Enforce Test Database Safety Gate
  assertTestDatabaseSafety();

  // 2. BACKFILL ASSESSMENT FORMS (Fail-Closed)
  console.log('\n📋 1. AssessmentFormVersion Backfill (Lifecycle & Invariants)...');
  const allForms = await db.assessmentFormVersion.findMany({
    include: {
      module: true,
      items: true,
    },
  });

  console.log(`Found ${allForms.length} existing AssessmentFormVersion record(s).`);

  for (const form of allForms) {
    const targetStatus = form.isPublished ? 'PUBLISHED' : 'DRAFT';
    const targetPublished = form.isPublished;
    const targetPublishedAt = form.isPublished ? form.publishedAt || form.createdAt : null;

    await db.assessmentFormVersion.update({
      where: { id: form.id },
      data: {
        status: targetStatus,
        isPublished: targetPublished,
        publishedAt: targetPublishedAt,
      },
    });
  }

  // Verify Assessment Module Invariant: COUNT(PUBLISHED) <= 1
  const modules = await db.assessmentModule.findMany({
    include: {
      formVersions: {
        where: { status: 'PUBLISHED' },
      },
    },
  });

  for (const mod of modules) {
    if (mod.formVersions.length > 1) {
      throw new Error(
        `FAIL_CLOSED_ABORT: Module '${mod.code}' has ${mod.formVersions.length} PUBLISHED form versions. Max 1 allowed.`
      );
    }
  }

  // Verify Core Personality Module Invariant
  const coreModule = modules.find((m) => m.code === 'MODULE_1_CORE_PERSONALITY');
  if (!coreModule || coreModule.formVersions.length !== 1) {
    throw new Error(
      `FAIL_CLOSED_ABORT: Core module MODULE_1_CORE_PERSONALITY must have exactly 1 PUBLISHED form version.`
    );
  }

  const liveForm = coreModule.formVersions[0];
  const liveFormItemsCount = await db.assessmentFormItem.count({
    where: { formVersionId: liveForm.id },
  });

  if (liveForm.versionCode !== 'v1.0.0' || !liveForm.isPublished || liveFormItemsCount !== 17) {
    throw new Error(
      `FAIL_CLOSED_ABORT: Live form version invariant mismatch. Expected v1.0.0, isPublished=true, 17 items. Found: ${liveForm.versionCode}, isPublished=${liveForm.isPublished}, items=${liveFormItemsCount}`
    );
  }

  console.log(`✅ AssessmentFormVersion validated: ${liveForm.versionCode} is PUBLISHED with ${liveFormItemsCount} items.`);

  // 3. BACKFILL ITEM VERSIONS (Membership-Derived from v1.0.0)
  console.log('\n📝 2. ItemVersion Backfill (Membership-Derived from v1.0.0)...');
  const liveFormItems = await db.assessmentFormItem.findMany({
    where: { formVersionId: liveForm.id },
    select: { itemVersionId: true },
  });

  const liveItemVersionIds = new Set(liveFormItems.map((fi) => fi.itemVersionId));
  console.log(`Identified ${liveItemVersionIds.size} live ItemVersion IDs referenced in v1.0.0.`);

  const allItemVersions = await db.itemVersion.findMany();
  let liveItemUpdatedCount = 0;
  let otherItemUpdatedCount = 0;

  for (const iv of allItemVersions) {
    if (liveItemVersionIds.has(iv.id)) {
      await db.itemVersion.update({
        where: { id: iv.id },
        data: {
          status: 'ACTIVE',
          isActive: true,
          validationStatus: 'PRE_CALIBRATION',
          authorType: 'LEGACY_UNSPECIFIED',
        },
      });
      liveItemUpdatedCount++;
    } else {
      if (iv.isActive) {
        throw new Error(
          `AMBIGUOUS_LEGACY_STATE: ItemVersion '${iv.id}' has isActive=true but is NOT part of live form v1.0.0.`
        );
      }
      await db.itemVersion.update({
        where: { id: iv.id },
        data: {
          status: 'DRAFT',
          isActive: false,
          authorType: 'LEGACY_UNSPECIFIED',
        },
      });
      otherItemUpdatedCount++;
    }
  }

  console.log(
    `✅ ItemVersions updated: ${liveItemUpdatedCount} live items set to ACTIVE/LEGACY_UNSPECIFIED, ${otherItemUpdatedCount} draft items.`
  );

  // 4. BACKFILL VALIDATION MATRIX (84 Facets Normalized)
  console.log('\n🔬 3. Normalized Validation Matrix Backfill from turkish-validation-matrix.json...');
  const matrixPath = path.resolve(process.cwd(), 'research/turkish-validation-matrix.json');
  if (!fs.existsSync(matrixPath)) {
    throw new Error(`FAIL_CLOSED_ABORT: File not found: ${matrixPath}`);
  }

  const rawMatrix: ValidationMatrixEntry[] = JSON.parse(fs.readFileSync(matrixPath, 'utf8'));
  console.log(`Loaded ${rawMatrix.length} facet entries from canonical validation matrix.`);

  if (rawMatrix.length !== 84) {
    throw new Error(`FAIL_CLOSED_ABORT: Expected exactly 84 facets in validation matrix, found ${rawMatrix.length}`);
  }

  // Pre-fetch all valid instrument and source IDs in DB to preserve referential integrity
  const existingInstruments = await db.instrument.findMany({ select: { id: true } });
  const instrumentIdSet = new Set(existingInstruments.map((i) => i.id));

  const existingSources = await db.scientificSource.findMany({ select: { id: true } });
  const sourceIdSet = new Set(existingSources.map((s) => s.id));

  const levelCounts = { DIRECT: 0, LEXICAL: 0, RELATED: 0, NO_DIRECT: 0 };

  for (const entry of rawMatrix) {
    const evidenceLevel = deriveOverallTurkishEvidenceLevel(entry.status);
    levelCounts[evidenceLevel]++;

    // Safe Instrument FK checks
    const targetInstId = entry.targetConstructInstrumentId && instrumentIdSet.has(entry.targetConstructInstrumentId)
      ? entry.targetConstructInstrumentId
      : null;
    const suppInstId = entry.supportingEvidenceInstrumentId && instrumentIdSet.has(entry.supportingEvidenceInstrumentId)
      ? entry.supportingEvidenceInstrumentId
      : null;

    // Upsert FacetValidationSummary
    const summary = await db.facetValidationSummary.upsert({
      where: { facetId: entry.facetId },
      update: {
        overallTurkishEvidenceLevel: evidenceLevel,
        overallStatus: entry.status,
        measurementAlignmentLevel: entry.measurementAlignmentLevel || 'NOT_APPLICABLE',
        measurementInvarianceStatus: entry.measurementInvarianceStatus || 'NOT_ASSESSED',
        instrumentValidationEstablished: Boolean(entry.instrumentValidationEstablished),
        targetConstructInstrumentId: targetInstId,
        supportingEvidenceInstrumentId: suppInstId,
        sampleDescription: entry.sampleDescription || null,
        scientificNotes: entry.scientificNotes || null,
        humanVerified: Boolean(entry.reliabilityEvidence?.internalConsistency?.humanVerified && entry.studyEvidence?.sampleN?.humanVerified),
      },
      create: {
        facetId: entry.facetId,
        overallTurkishEvidenceLevel: evidenceLevel,
        overallStatus: entry.status,
        measurementAlignmentLevel: entry.measurementAlignmentLevel || 'NOT_APPLICABLE',
        measurementInvarianceStatus: entry.measurementInvarianceStatus || 'NOT_ASSESSED',
        instrumentValidationEstablished: Boolean(entry.instrumentValidationEstablished),
        targetConstructInstrumentId: targetInstId,
        supportingEvidenceInstrumentId: suppInstId,
        sampleDescription: entry.sampleDescription || null,
        scientificNotes: entry.scientificNotes || null,
        humanVerified: Boolean(entry.reliabilityEvidence?.internalConsistency?.humanVerified && entry.studyEvidence?.sampleN?.humanVerified),
      },
    });

    // Clean existing study and reliability child records for idempotent backfill
    await db.facetValidationStudyEvidence.deleteMany({ where: { validationSummaryId: summary.id } });
    await db.facetReliabilityEvidence.deleteMany({ where: { validationSummaryId: summary.id } });

    // Insert Study Evidence (from supportingEvidence array & studyEvidence)
    if (entry.supportingEvidence && entry.supportingEvidence.length > 0) {
      for (const supp of entry.supportingEvidence) {
        const srcId = supp.sourceId && sourceIdSet.has(supp.sourceId) ? supp.sourceId : null;
        await db.facetValidationStudyEvidence.create({
          data: {
            validationSummaryId: summary.id,
            sourceId: srcId,
            evidenceType: supp.evidenceType,
            evidenceLevel: evidenceLevel,
            appliesToLevel: supp.appliesToLevel || 'FACET',
            measurementAlignmentLevel: entry.measurementAlignmentLevel || 'NOT_APPLICABLE',
            sampleN: supp.studySampleN || entry.studyEvidence?.sampleN?.value || null,
            population: entry.studyEvidence?.population || null,
            samplingMethod: entry.studyEvidence?.samplingMethod || null,
            doesNotEstablish: supp.doesNotEstablish || [],
            factorEvidenceLevel: entry.factorStructureEvidence?.level || null,
            factorEvidenceStatus: entry.factorStructureEvidence?.status || null,
            claimVerificationStatus: entry.factorStructureEvidence?.claimVerificationStatus || 'NOT_ASSESSED',
            verificationMethod: entry.factorStructureEvidence?.verificationMethod || 'NOT_VERIFIED',
            humanVerified: Boolean(entry.factorStructureEvidence?.humanVerified),
            notes: entry.scientificNotes || null,
          },
        });
      }
    } else if (entry.studyEvidence?.sampleN?.value || entry.studyEvidence?.population) {
      // Fallback study evidence record if supportingEvidence array is empty
      const srcId = entry.studyEvidence?.sampleN?.sourceId && sourceIdSet.has(entry.studyEvidence.sampleN.sourceId)
        ? entry.studyEvidence.sampleN.sourceId
        : null;

      await db.facetValidationStudyEvidence.create({
        data: {
          validationSummaryId: summary.id,
          sourceId: srcId,
          evidenceType: entry.status,
          evidenceLevel: evidenceLevel,
          appliesToLevel: 'FACET',
          measurementAlignmentLevel: entry.measurementAlignmentLevel || 'NOT_APPLICABLE',
          sampleN: entry.studyEvidence?.sampleN?.value || null,
          population: entry.studyEvidence?.population || null,
          samplingMethod: entry.studyEvidence?.samplingMethod || null,
          doesNotEstablish: [],
          claimVerificationStatus: entry.studyEvidence?.sampleN?.claimVerificationStatus || 'NOT_ASSESSED',
          humanVerified: Boolean(entry.studyEvidence?.sampleN?.humanVerified),
          notes: entry.studyEvidence?.sampleN?.description || entry.scientificNotes || null,
        },
      });
    }

    // Insert Reliability Evidence (internal consistency)
    if (entry.reliabilityEvidence?.internalConsistency) {
      const ic = entry.reliabilityEvidence.internalConsistency;
      const srcId = ic.sourceId && sourceIdSet.has(ic.sourceId) ? ic.sourceId : null;
      await db.facetReliabilityEvidence.create({
        data: {
          validationSummaryId: summary.id,
          sourceId: srcId,
          metricType: 'INTERNAL_CONSISTENCY',
          metricName: ic.metric || 'CRONBACH_ALPHA',
          value: ic.value !== null && ic.value !== undefined ? Number(ic.value) : null,
          location: ic.location || null,
          evidenceLevel: evidenceLevel,
          claimVerificationStatus: ic.claimVerificationStatus || 'NOT_ASSESSED',
          humanVerified: Boolean(ic.humanVerified),
        },
      });
    }

    // Insert Reliability Evidence (test-retest)
    if (entry.reliabilityEvidence?.testRetest) {
      const tr = entry.reliabilityEvidence.testRetest;
      const srcId = tr.sourceId && sourceIdSet.has(tr.sourceId) ? tr.sourceId : null;
      await db.facetReliabilityEvidence.create({
        data: {
          validationSummaryId: summary.id,
          sourceId: srcId,
          metricType: 'TEST_RETEST',
          metricName: 'PEARSON_R',
          value: tr.value !== null && tr.value !== undefined ? Number(tr.value) : null,
          interval: tr.interval || null,
          location: tr.location || null,
          evidenceLevel: evidenceLevel,
          claimVerificationStatus: tr.claimVerificationStatus || 'NOT_ASSESSED',
          humanVerified: Boolean(tr.humanVerified),
        },
      });
    }
  }

  console.log('\n==================================================');
  console.log('VALIDATION MATRIX BACKFILL AGGREGATE RESULTS:');
  console.log(`DIRECT:     ${levelCounts.DIRECT} (Expected: 14)`);
  console.log(`LEXICAL:    ${levelCounts.LEXICAL} (Expected: 24)`);
  console.log(`RELATED:    ${levelCounts.RELATED} (Expected: 2)`);
  console.log(`NO_DIRECT:  ${levelCounts.NO_DIRECT} (Expected: 44)`);
  console.log(`TOTAL:      ${Object.values(levelCounts).reduce((a, b) => a + b, 0)} (Expected: 84)`);
  console.log('==================================================\n');

  if (
    levelCounts.DIRECT !== 14 ||
    levelCounts.LEXICAL !== 24 ||
    levelCounts.RELATED !== 2 ||
    levelCounts.NO_DIRECT !== 44
  ) {
    throw new Error(
      `VALIDATION_COUNT_MISMATCH: Counts do not match expected ground truth (14 DIRECT, 24 LEXICAL, 2 RELATED, 44 NO_DIRECT).`
    );
  }

  console.log('🎉 Scientific Backfill Completed Successfully!\n');
}

if (require.main === module) {
  runScientificBackfill()
    .catch((err) => {
      console.error('❌ Backfill failed:', err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
