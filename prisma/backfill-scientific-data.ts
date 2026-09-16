import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { assertTestDatabaseSafety } from '../scripts/verify-test-db-safety';
import { verifyScientificC1State } from '../src/lib/scientificC1Verifier';

export interface ValidationMatrixEntry {
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

export type BackfillTarget = 'test' | 'production';

export interface BackfillOptions {
  prisma?: PrismaClient;
  target?: BackfillTarget;
  dryRun?: boolean;
  logger?: (...args: any[]) => void;
}

export interface BackfillExecutionResult {
  success: boolean;
  dryRun: boolean;
  target: BackfillTarget;
  alreadyApplied: boolean;
  preflightPassed: boolean;
  summary: {
    formsInspected: number;
    liveFormCode: string;
    liveItemsCount: number;
    ontologyFacetsCount: number;
    matrixEntriesCount: number;
    summariesUpserted: number;
    studyEvidencesCreated: number;
    reliabilityEvidencesCreated: number;
    evidenceDistribution: {
      DIRECT: number;
      LEXICAL: number;
      RELATED: number;
      NO_DIRECT: number;
    };
  };
  errors?: string[];
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

/**
 * Environment-specific execution guard.
 * Strictly separates TEST database verification from PRODUCTION authorization.
 */
export function assertExecutionEnvironment(
  target: BackfillTarget,
  dryRun: boolean = false,
  customLogger?: (...args: any[]) => void
) {
  const log = customLogger || console.log;

  log(`\n--- Execution Environment Check (Target: ${target.toUpperCase()}, DryRun: ${dryRun}) ---`);

  if (target === 'test') {
    assertTestDatabaseSafety();
    log('ENVIRONMENT_GATE: TEST_DATABASE_VERIFIED (localhost:5434/psyche_ai_test)');
    return;
  }

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

    log('ENVIRONMENT_GATE: PRODUCTION_AUTHORIZED (NODE_ENV=production, ALLOW=YES, BACKUP_VERIFIED=YES)');
    log('SECURITY_NOTICE: Database connection established without logging sensitive credentials.');
    return;
  }

  throw new Error(`UNKNOWN_TARGET: Invalid backfill target '${target}'. Must be 'test' or 'production'.`);
}

/**
 * Production preflight invariant verification. Fails closed if any invariant differs.
 */
export async function runPreflightChecks(db: PrismaClient, rawMatrix: ValidationMatrixEntry[]) {
  // 1. Matrix count invariant
  if (rawMatrix.length !== 84) {
    throw new Error(
      `PREFLIGHT_ABORT: Validation matrix JSON must contain exactly 84 facets, found ${rawMatrix.length}`
    );
  }

  // 2. Ontology facets in database
  const dbFacetCount = await db.facet.count();
  if (dbFacetCount !== 84) {
    throw new Error(
      `PREFLIGHT_ABORT: Database ontology must contain exactly 84 facets, found ${dbFacetCount}`
    );
  }

  // 3. Module & Published Form Invariants
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

  // 4. Live form v1.0.0 invariant
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
    throw new Error(
      `PREFLIGHT_ABORT: Live form 'v1.0.0' must contain exactly 17 AssessmentFormItems, found ${liveForm.items.length}`
    );
  }

  // 5. Ensure all 17 references resolve to distinct ItemVersions
  const resolvedItemVersionIds = new Set(liveForm.items.map((i) => i.itemVersionId));
  if (resolvedItemVersionIds.size !== 17) {
    throw new Error(
      `PREFLIGHT_ABORT: Live form items reference ${resolvedItemVersionIds.size} unique ItemVersions (expected 17).`
    );
  }

  // 6. Check for ambiguous active legacy items outside live form
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

  return {
    liveForm,
    resolvedItemVersionIds,
    dbFacetCount,
  };
}

/**
 * Pure deterministic scientific backfill implementation.
 * Idempotent, safe, and supports dry-run.
 */
export async function executeScientificBackfill(
  options: BackfillOptions = {}
): Promise<BackfillExecutionResult> {
  const db = options.prisma || new PrismaClient();
  const dryRun = Boolean(options.dryRun);
  const target: BackfillTarget = options.target || (process.env.NODE_ENV === 'production' ? 'production' : 'test');
  const log = options.logger || console.log;

  log('\n==================================================');
  log(`FAZ 2.7C-1: SCIENTIFIC BACKFILL (${target.toUpperCase()}${dryRun ? ' - DRY RUN' : ''})`);
  log('==================================================');

  // Load canonical validation matrix JSON
  const matrixPath = path.resolve(process.cwd(), 'research/turkish-validation-matrix.json');
  if (!fs.existsSync(matrixPath)) {
    throw new Error(`FAIL_CLOSED_ABORT: Matrix file not found: ${matrixPath}`);
  }
  const rawMatrix: ValidationMatrixEntry[] = JSON.parse(fs.readFileSync(matrixPath, 'utf8'));

  // 1. Run strict preflight checks
  log('\n🔍 Running Production Preflight Checks...');
  const preflight = await runPreflightChecks(db, rawMatrix);
  log(`✅ Preflight Passed: Live form v1.0.0 has 17 items, ontology has 84 facets, 0 ambiguous items.`);

  const levelCounts = { DIRECT: 0, LEXICAL: 0, RELATED: 0, NO_DIRECT: 0 };
  for (const entry of rawMatrix) {
    const level = deriveOverallTurkishEvidenceLevel(entry.status);
    levelCounts[level]++;
  }

  const summary = {
    formsInspected: 1,
    liveFormCode: preflight.liveForm.versionCode,
    liveItemsCount: preflight.resolvedItemVersionIds.size,
    ontologyFacetsCount: preflight.dbFacetCount,
    matrixEntriesCount: rawMatrix.length,
    summariesUpserted: 0,
    studyEvidencesCreated: 0,
    reliabilityEvidencesCreated: 0,
    evidenceDistribution: levelCounts,
  };

  // 2. Check if already complete
  const stateCheck = await verifyScientificC1State(db);
  if (stateCheck.isComplete) {
    log('\nℹ️ ALREADY_APPLIED / NO_CHANGES_REQUIRED: Scientific C1 state is already 100% complete and coherent.');
    log('No data modifications required.');
    return {
      success: true,
      dryRun,
      target,
      alreadyApplied: true,
      preflightPassed: true,
      summary,
    };
  }

  // If dry-run, output actions that WOULD be performed without writing
  if (dryRun) {
    log('\n[DRY RUN] Invariant verification succeeded. Actions that WOULD be performed:');
    log(`- AssessmentFormVersion '${preflight.liveForm.versionCode}' would be set to status='PUBLISHED', isPublished=true, itemCount=17`);
    log(`- Exactly ${preflight.resolvedItemVersionIds.size} live ItemVersions would be set to status='ACTIVE', isActive=true, authorType='LEGACY_UNSPECIFIED'`);
    log(`- Exactly ${rawMatrix.length} FacetValidationSummary records would be upserted (14 DIRECT, 24 LEXICAL, 2 RELATED, 44 NO_DIRECT)`);
    log(`- Normalized study and reliability child evidence records would be populated without modifying historical scores`);
    log('[DRY RUN] Zero database writes executed.');

    return {
      success: true,
      dryRun: true,
      target,
      alreadyApplied: false,
      preflightPassed: true,
      summary,
    };
  }

  // 3. EXECUTE IDEMPOTENT ATOMIC BACKFILL
  log('\n🚀 Executing backfill within single atomic transaction...');
  await db.$transaction(
    async (tx) => {
      // A. Assessment Form Version
      log('\n📋 1. Updating AssessmentFormVersion Lifecycle...');
      await tx.assessmentFormVersion.update({
        where: { id: preflight.liveForm.id },
        data: {
          status: 'PUBLISHED',
          isPublished: true,
          itemCount: 17,
          publishedAt: preflight.liveForm.publishedAt || preflight.liveForm.createdAt,
        },
      });

      // Set all other form versions to DRAFT / isPublished=false
      await tx.assessmentFormVersion.updateMany({
        where: { id: { not: preflight.liveForm.id } },
        data: {
          status: 'DRAFT',
          isPublished: false,
        },
      });

      // B. Item Versions (Membership-Derived)
      log('📝 2. Updating ItemVersion Lifecycle (17 Live Items)...');
      await tx.itemVersion.updateMany({
        where: { id: { in: Array.from(preflight.resolvedItemVersionIds) } },
        data: {
          status: 'ACTIVE',
          isActive: true,
          validationStatus: 'PRE_CALIBRATION',
          authorType: 'LEGACY_UNSPECIFIED',
        },
      });

      await tx.itemVersion.updateMany({
        where: { id: { notIn: Array.from(preflight.resolvedItemVersionIds) } },
        data: {
          status: 'DRAFT',
          isActive: false,
          authorType: 'LEGACY_UNSPECIFIED',
        },
      });

      // C. Facet Validation Summaries & Child Evidence
      log('🔬 3. Upserting 84 Facet Validation Summaries and Evidence...');
      const existingInstruments = await tx.instrument.findMany({ select: { id: true } });
      const instrumentIdSet = new Set(existingInstruments.map((i) => i.id));

      const existingSources = await tx.scientificSource.findMany({ select: { id: true } });
      const sourceIdSet = new Set(existingSources.map((s) => s.id));

      let studyEvidenceTotal = 0;
      let reliabilityEvidenceTotal = 0;

      for (const entry of rawMatrix) {
        const evidenceLevel = deriveOverallTurkishEvidenceLevel(entry.status);

        const targetInstId =
          entry.targetConstructInstrumentId && instrumentIdSet.has(entry.targetConstructInstrumentId)
            ? entry.targetConstructInstrumentId
            : null;
        const suppInstId =
          entry.supportingEvidenceInstrumentId && instrumentIdSet.has(entry.supportingEvidenceInstrumentId)
            ? entry.supportingEvidenceInstrumentId
            : null;

        const summaryRecord = await tx.facetValidationSummary.upsert({
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
            humanVerified: Boolean(
              entry.reliabilityEvidence?.internalConsistency?.humanVerified &&
                entry.studyEvidence?.sampleN?.humanVerified
            ),
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
            humanVerified: Boolean(
              entry.reliabilityEvidence?.internalConsistency?.humanVerified &&
                entry.studyEvidence?.sampleN?.humanVerified
            ),
          },
        });

        summary.summariesUpserted++;

        // Idempotently replace child records for this summary
        await tx.facetValidationStudyEvidence.deleteMany({ where: { validationSummaryId: summaryRecord.id } });
        await tx.facetReliabilityEvidence.deleteMany({ where: { validationSummaryId: summaryRecord.id } });

        // Insert Study Evidence
        if (entry.supportingEvidence && entry.supportingEvidence.length > 0) {
          for (const supp of entry.supportingEvidence) {
            const srcId = supp.sourceId && sourceIdSet.has(supp.sourceId) ? supp.sourceId : null;
            await tx.facetValidationStudyEvidence.create({
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
            studyEvidenceTotal++;
          }
        } else if (entry.studyEvidence?.sampleN?.value || entry.studyEvidence?.population) {
          const srcId =
            entry.studyEvidence?.sampleN?.sourceId && sourceIdSet.has(entry.studyEvidence.sampleN.sourceId)
              ? entry.studyEvidence.sampleN.sourceId
              : null;

          await tx.facetValidationStudyEvidence.create({
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
          studyEvidenceTotal++;
        }

        // Insert Reliability Evidence (internal consistency)
        if (entry.reliabilityEvidence?.internalConsistency) {
          const ic = entry.reliabilityEvidence.internalConsistency;
          const srcId = ic.sourceId && sourceIdSet.has(ic.sourceId) ? ic.sourceId : null;
          await tx.facetReliabilityEvidence.create({
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
          reliabilityEvidenceTotal++;
        }

        // Insert Reliability Evidence (test-retest)
        if (entry.reliabilityEvidence?.testRetest) {
          const tr = entry.reliabilityEvidence.testRetest;
          const srcId = tr.sourceId && sourceIdSet.has(tr.sourceId) ? tr.sourceId : null;
          await tx.facetReliabilityEvidence.create({
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
          reliabilityEvidenceTotal++;
        }
      }

      summary.studyEvidencesCreated = studyEvidenceTotal;
      summary.reliabilityEvidencesCreated = reliabilityEvidenceTotal;

      // In-transaction state verification (fails & rolls back tx if incomplete)
      const inTxCheck = await verifyScientificC1State(tx as any);
      if (!inTxCheck.isComplete) {
        throw new Error(
          `POST_BACKFILL_VERIFICATION_FAILED: State remains incomplete within transaction: ${inTxCheck.errors.join(', ')}`
        );
      }
    },
    { timeout: 60000, maxWait: 10000 }
  );

  // 4. Re-verify C1 state post backfill
  log('\n🔍 Re-verifying C1 State Post-Backfill...');
  const postCheck = await verifyScientificC1State(db);
  if (!postCheck.isComplete) {
    throw new Error(
      `POST_BACKFILL_VERIFICATION_FAILED: State remains incomplete after backfill: ${postCheck.errors.join(', ')}`
    );
  }

  log('✅ Backfill Executed and Verified Successfully!');
  log(`- 84 Summaries: ${summary.summariesUpserted}`);
  log(`- Study Evidences: ${summary.studyEvidencesCreated}`);
  log(`- Reliability Evidences: ${summary.reliabilityEvidencesCreated}`);

  return {
    success: true,
    dryRun: false,
    target,
    alreadyApplied: false,
    preflightPassed: true,
    summary,
  };
}

/**
 * CLI Entrypoint
 */
async function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');

  let target: BackfillTarget = 'test';
  if (args.includes('--target=production')) {
    target = 'production';
  } else if (args.includes('--target=test')) {
    target = 'test';
  } else if (process.env.NODE_ENV === 'production') {
    target = 'production';
  }

  // 1. Guard environment
  assertExecutionEnvironment(target, isDryRun);

  // 2. Execute backfill
  const prisma = new PrismaClient();
  try {
    const result = await executeScientificBackfill({
      prisma,
      target,
      dryRun: isDryRun,
    });

    if (!result.success) {
      process.exit(1);
    }
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
