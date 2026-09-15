const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { verifyScientificC1State } = require('../scripts/verify-c1-state');

function deriveOverallTurkishEvidenceLevel(status) {
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

function assertExecutionEnvironment(target, dryRun) {
  console.log(`\n--- Execution Environment Check (Target: ${target.toUpperCase()}, DryRun: ${dryRun}) ---`);

  if (target === 'production') {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        `PRODUCTION_SAFETY_ABORT: Target is 'production' but NODE_ENV is '${process.env.NODE_ENV}'. Must be 'production'.`
      );
    }
    if (process.env.ALLOW_SCIENTIFIC_BACKFILL_2_7C1 !== 'YES') {
      throw new Error(
        `PRODUCTION_SAFETY_ABORT: Explicit authorization required. Set ALLOW_SCIENTIFIC_BACKFILL_2_7C1=YES to proceed.`
      );
    }
    if (process.env.SCIENTIFIC_BACKUP_VERIFIED !== 'YES') {
      throw new Error(
        `PRODUCTION_SAFETY_ABORT: Explicit backup verification required. Set SCIENTIFIC_BACKUP_VERIFIED=YES after verifying a fresh PostgreSQL database backup.`
      );
    }
    console.log('ENVIRONMENT_GATE: PRODUCTION_AUTHORIZED (NODE_ENV=production, ALLOW=YES, BACKUP_VERIFIED=YES)');
    return;
  }

  if (target === 'test') {
    // In test mode, verify test environment
    const testUrl = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
    if (!testUrl || !testUrl.includes('psyche_ai_test') || !testUrl.includes('5434')) {
      throw new Error(`SAFETY_ABORT: Target is test but URL does not match localhost:5434/psyche_ai_test`);
    }
    console.log('ENVIRONMENT_GATE: TEST_DATABASE_VERIFIED (localhost:5434/psyche_ai_test)');
    return;
  }

  throw new Error(`UNKNOWN_TARGET: Invalid backfill target '${target}'.`);
}

async function runPreflightChecks(db, rawMatrix) {
  if (rawMatrix.length !== 84) {
    throw new Error(`PREFLIGHT_ABORT: Validation matrix JSON must contain exactly 84 facets, found ${rawMatrix.length}`);
  }

  const dbFacetCount = await db.facet.count();
  if (dbFacetCount !== 84) {
    throw new Error(`PREFLIGHT_ABORT: Database ontology must contain exactly 84 facets, found ${dbFacetCount}`);
  }

  const modules = await db.assessmentModule.findMany({
    include: {
      formVersions: {
        where: { OR: [{ status: 'PUBLISHED' }, { isPublished: true }] },
      },
    },
  });

  for (const mod of modules) {
    if (mod.formVersions.length > 1) {
      throw new Error(
        `PREFLIGHT_ABORT: Module '${mod.code}' has multiple published form versions (${mod.formVersions.length}). Max 1 allowed.`
      );
    }
  }

  const coreModule = modules.find((m) => m.code === 'MODULE_1_CORE_PERSONALITY');
  if (!coreModule) {
    throw new Error(`PREFLIGHT_ABORT: Assessment module 'MODULE_1_CORE_PERSONALITY' not found in database.`);
  }

  const liveForm = await db.assessmentFormVersion.findFirst({
    where: {
      moduleId: coreModule.id,
      versionCode: 'v1.0.0',
    },
    include: {
      items: {
        include: {
          itemVersion: true,
        },
      },
    },
  });

  if (!liveForm) {
    throw new Error(`PREFLIGHT_ABORT: Live form version 'v1.0.0' not found in database.`);
  }

  if (liveForm.items.length !== 17) {
    throw new Error(`PREFLIGHT_ABORT: Live form 'v1.0.0' must contain exactly 17 items, found ${liveForm.items.length}`);
  }

  const resolvedItemVersionIds = new Set(liveForm.items.map((i) => i.itemVersionId));
  if (resolvedItemVersionIds.size !== 17) {
    throw new Error(
      `PREFLIGHT_ABORT: Live form items reference ${resolvedItemVersionIds.size} unique ItemVersions (expected 17).`
    );
  }

  const ambiguousActiveItems = await db.itemVersion.count({
    where: {
      isActive: true,
      id: { notIn: Array.from(resolvedItemVersionIds) },
    },
  });

  if (ambiguousActiveItems > 0) {
    throw new Error(
      `PREFLIGHT_ABORT: Found ${ambiguousActiveItems} ambiguous active ItemVersion(s) outside live form v1.0.0.`
    );
  }

  return { liveForm, resolvedItemVersionIds, dbFacetCount };
}

async function executeScientificBackfill(options = {}) {
  const db = options.prisma || new PrismaClient();
  const dryRun = Boolean(options.dryRun);
  const target = options.target || (process.env.NODE_ENV === 'production' ? 'production' : 'test');

  console.log('\n==================================================');
  console.log(`FAZ 2.7C-1: SCIENTIFIC BACKFILL (${target.toUpperCase()}${dryRun ? ' - DRY RUN' : ''})`);
  console.log('==================================================');

  const matrixPath = path.resolve(process.cwd(), 'research/turkish-validation-matrix.json');
  if (!fs.existsSync(matrixPath)) {
    throw new Error(`FAIL_CLOSED_ABORT: Matrix file not found: ${matrixPath}`);
  }
  const rawMatrix = JSON.parse(fs.readFileSync(matrixPath, 'utf8'));

  console.log('\n🔍 Running Production Preflight Checks...');
  const preflight = await runPreflightChecks(db, rawMatrix);
  console.log(`✅ Preflight Passed: Live form v1.0.0 has 17 items, ontology has 84 facets, 0 ambiguous items.`);

  const stateCheck = await verifyScientificC1State(db);
  if (stateCheck.isComplete) {
    console.log('\nℹ️ ALREADY_APPLIED / NO_CHANGES_REQUIRED: Scientific C1 state is already 100% complete and coherent.');
    return { success: true, alreadyApplied: true };
  }

  if (dryRun) {
    console.log('\n[DRY RUN] Invariant verification succeeded. Actions that WOULD be performed:');
    console.log(`- AssessmentFormVersion '${preflight.liveForm.versionCode}' set to PUBLISHED (17 items)`);
    console.log(`- Exactly 17 live ItemVersions set to ACTIVE/LEGACY_UNSPECIFIED`);
    console.log(`- Exactly 84 FacetValidationSummary records upserted`);
    console.log('[DRY RUN] Zero database writes executed.');
    return { success: true, dryRun: true };
  }

  // 1. Assessment Form Version
  await db.assessmentFormVersion.update({
    where: { id: preflight.liveForm.id },
    data: {
      status: 'PUBLISHED',
      isPublished: true,
      itemCount: 17,
      publishedAt: preflight.liveForm.publishedAt || preflight.liveForm.createdAt,
    },
  });

  await db.assessmentFormVersion.updateMany({
    where: { id: { not: preflight.liveForm.id } },
    data: { status: 'DRAFT', isPublished: false },
  });

  // 2. Item Versions
  await db.itemVersion.updateMany({
    where: { id: { in: Array.from(preflight.resolvedItemVersionIds) } },
    data: {
      status: 'ACTIVE',
      isActive: true,
      validationStatus: 'PRE_CALIBRATION',
      authorType: 'LEGACY_UNSPECIFIED',
    },
  });

  await db.itemVersion.updateMany({
    where: { id: { notIn: Array.from(preflight.resolvedItemVersionIds) } },
    data: { status: 'DRAFT', isActive: false, authorType: 'LEGACY_UNSPECIFIED' },
  });

  // 3. Summaries & Evidence
  const existingInstruments = await db.instrument.findMany({ select: { id: true } });
  const instrumentIdSet = new Set(existingInstruments.map((i) => i.id));

  const existingSources = await db.scientificSource.findMany({ select: { id: true } });
  const sourceIdSet = new Set(existingSources.map((s) => s.id));

  for (const entry of rawMatrix) {
    const evidenceLevel = deriveOverallTurkishEvidenceLevel(entry.status);
    const targetInstId = entry.targetConstructInstrumentId && instrumentIdSet.has(entry.targetConstructInstrumentId)
      ? entry.targetConstructInstrumentId
      : null;
    const suppInstId = entry.supportingEvidenceInstrumentId && instrumentIdSet.has(entry.supportingEvidenceInstrumentId)
      ? entry.supportingEvidenceInstrumentId
      : null;

    const summaryRecord = await db.facetValidationSummary.upsert({
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

    await db.facetValidationStudyEvidence.deleteMany({ where: { validationSummaryId: summaryRecord.id } });
    await db.facetReliabilityEvidence.deleteMany({ where: { validationSummaryId: summaryRecord.id } });

    if (entry.supportingEvidence && entry.supportingEvidence.length > 0) {
      for (const supp of entry.supportingEvidence) {
        const srcId = supp.sourceId && sourceIdSet.has(supp.sourceId) ? supp.sourceId : null;
        await db.facetValidationStudyEvidence.create({
          data: {
            validationSummaryId: summaryRecord.id,
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
      const srcId = entry.studyEvidence?.sampleN?.sourceId && sourceIdSet.has(entry.studyEvidence.sampleN.sourceId)
        ? entry.studyEvidence.sampleN.sourceId
        : null;

      await db.facetValidationStudyEvidence.create({
        data: {
          validationSummaryId: summaryRecord.id,
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

    if (entry.reliabilityEvidence?.internalConsistency) {
      const ic = entry.reliabilityEvidence.internalConsistency;
      const srcId = ic.sourceId && sourceIdSet.has(ic.sourceId) ? ic.sourceId : null;
      await db.facetReliabilityEvidence.create({
        data: {
          validationSummaryId: summaryRecord.id,
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

    if (entry.reliabilityEvidence?.testRetest) {
      const tr = entry.reliabilityEvidence.testRetest;
      const srcId = tr.sourceId && sourceIdSet.has(tr.sourceId) ? tr.sourceId : null;
      await db.facetReliabilityEvidence.create({
        data: {
          validationSummaryId: summaryRecord.id,
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

  const postCheck = await verifyScientificC1State(db);
  if (!postCheck.isComplete) {
    throw new Error(
      `POST_BACKFILL_VERIFICATION_FAILED: State remains incomplete after backfill: ${postCheck.errors.join(', ')}`
    );
  }

  console.log('✅ Backfill Executed and Verified Successfully!');
  return { success: true, alreadyApplied: false };
}

async function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');

  let target = 'test';
  if (args.includes('--target=production')) {
    target = 'production';
  } else if (args.includes('--target=test')) {
    target = 'test';
  } else if (process.env.NODE_ENV === 'production') {
    target = 'production';
  }

  assertExecutionEnvironment(target, isDryRun);

  const prisma = new PrismaClient();
  try {
    const result = await executeScientificBackfill({ prisma, target, dryRun: isDryRun });
    if (!result.success) process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error('❌ BACKFILL_FATAL_ERROR:', err.message);
    process.exit(1);
  });
}

module.exports = {
  executeScientificBackfill,
  runPreflightChecks,
  assertExecutionEnvironment,
  deriveOverallTurkishEvidenceLevel,
};
