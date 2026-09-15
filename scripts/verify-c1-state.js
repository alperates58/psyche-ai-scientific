const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyScientificC1State(db) {
  const errors = [];
  const details = {
    schemaReady: false,
    publishedFormsCount: 0,
    liveFormCode: null,
    liveFormItemCount: 0,
    liveItemVersionsCount: 0,
    activeItemsOutsideLiveFormCount: 0,
    validationSummariesCount: 0,
    evidenceDistribution: {
      DIRECT: 0,
      LEXICAL: 0,
      RELATED: 0,
      NO_DIRECT: 0,
    },
    studyEvidencesCount: 0,
    reliabilityEvidencesCount: 0,
  };

  try {
    const [summaryCount, studyCount, relCount] = await Promise.all([
      db.facetValidationSummary.count(),
      db.facetValidationStudyEvidence.count(),
      db.facetReliabilityEvidence.count(),
    ]);

    details.schemaReady = true;
    details.validationSummariesCount = summaryCount;
    details.studyEvidencesCount = studyCount;
    details.reliabilityEvidencesCount = relCount;
  } catch (err) {
    errors.push(`SCHEMA_NOT_READY: Scientific tables could not be queried: ${err.message}`);
    return { isComplete: false, details, errors };
  }

  const publishedForms = await db.assessmentFormVersion.findMany({
    where: {
      OR: [{ status: 'PUBLISHED' }, { isPublished: true }],
    },
    include: {
      items: {
        include: {
          itemVersion: true,
        },
      },
    },
  });

  details.publishedFormsCount = publishedForms.length;

  if (publishedForms.length !== 1) {
    errors.push(
      `INTAKE_INVARIANT_VIOLATION: Expected exactly 1 published assessment form, found ${publishedForms.length}`
    );
  } else {
    const liveForm = publishedForms[0];
    details.liveFormCode = liveForm.versionCode;
    details.liveFormItemCount = liveForm.items.length;

    if (liveForm.versionCode !== 'v1.0.0') {
      errors.push(`LIVE_FORM_MISMATCH: Expected published form versionCode 'v1.0.0', found '${liveForm.versionCode}'`);
    }
    if (liveForm.status !== 'PUBLISHED' || !liveForm.isPublished) {
      errors.push(
        `LIFECYCLE_INCOHERENCE: Live form dual-state incoherence (status='${liveForm.status}', isPublished=${liveForm.isPublished})`
      );
    }
    if (liveForm.items.length !== 17) {
      errors.push(`ITEM_COUNT_MISMATCH: Live form v1.0.0 must contain exactly 17 items, found ${liveForm.items.length}`);
    }

    const liveItemIds = new Set(liveForm.items.map((i) => i.itemVersionId));
    let liveCoherentCount = 0;

    for (const item of liveForm.items) {
      const iv = item.itemVersion;
      if (iv.status === 'ACTIVE' && iv.isActive === true && iv.authorType === 'LEGACY_UNSPECIFIED') {
        liveCoherentCount++;
      } else {
        errors.push(
          `ITEM_VERSION_INCOHERENCE: ItemVersion '${iv.id}' in live form has status='${iv.status}', isActive=${iv.isActive}, authorType='${iv.authorType}'`
        );
      }
    }
    details.liveItemVersionsCount = liveCoherentCount;

    const otherActiveItems = await db.itemVersion.count({
      where: {
        isActive: true,
        id: { notIn: Array.from(liveItemIds) },
      },
    });

    details.activeItemsOutsideLiveFormCount = otherActiveItems;
    if (otherActiveItems > 0) {
      errors.push(
        `AMBIGUOUS_ACTIVE_ITEMS: Found ${otherActiveItems} active item version(s) outside published live form v1.0.0`
      );
    }
  }

  if (details.validationSummariesCount !== 84) {
    errors.push(
      `VALIDATION_SUMMARY_COUNT_MISMATCH: Expected 84 FacetValidationSummary records, found ${details.validationSummariesCount}`
    );
  }

  const summaries = await db.facetValidationSummary.findMany();
  for (const s of summaries) {
    if (s.overallTurkishEvidenceLevel in details.evidenceDistribution) {
      details.evidenceDistribution[s.overallTurkishEvidenceLevel]++;
    }
  }

  if (
    details.evidenceDistribution.DIRECT !== 14 ||
    details.evidenceDistribution.LEXICAL !== 24 ||
    details.evidenceDistribution.RELATED !== 2 ||
    details.evidenceDistribution.NO_DIRECT !== 44
  ) {
    errors.push(
      `EVIDENCE_DISTRIBUTION_MISMATCH: Expected 14 DIRECT, 24 LEXICAL, 2 RELATED, 44 NO_DIRECT. ` +
        `Found: ${JSON.stringify(details.evidenceDistribution)}`
    );
  }

  if (details.studyEvidencesCount === 0) {
    errors.push('STUDY_EVIDENCE_EMPTY: FacetValidationStudyEvidence table has 0 records');
  }
  if (details.reliabilityEvidencesCount === 0) {
    errors.push('RELIABILITY_EVIDENCE_EMPTY: FacetReliabilityEvidence table has 0 records');
  }

  const isComplete = errors.length === 0;

  return {
    isComplete,
    details,
    errors,
  };
}

async function main() {
  console.log('==================================================');
  console.log('FAZ 2.7C-1: SCIENTIFIC C1 STATE VERIFIER');
  console.log('==================================================\n');

  try {
    const result = await verifyScientificC1State(prisma);

    console.log('Verification Details:');
    console.log(`- Schema Tables Ready:         ${result.details.schemaReady}`);
    console.log(`- Published Forms Count:       ${result.details.publishedFormsCount}`);
    console.log(`- Live Form Version:           ${result.details.liveFormCode}`);
    console.log(`- Live Form Items:             ${result.details.liveFormItemCount}`);
    console.log(`- Coherent Live Item Versions: ${result.details.liveItemVersionsCount}`);
    console.log(`- Ambiguous Items Outside:     ${result.details.activeItemsOutsideLiveFormCount}`);
    console.log(`- Validation Summaries:        ${result.details.validationSummariesCount} / 84`);
    console.log(`- Study Evidence Records:      ${result.details.studyEvidencesCount}`);
    console.log(`- Reliability Evidence Records:${result.details.reliabilityEvidencesCount}`);
    console.log('- Evidence Level Distribution:');
    console.log(`  * DIRECT:    ${result.details.evidenceDistribution.DIRECT} (Expected: 14)`);
    console.log(`  * LEXICAL:   ${result.details.evidenceDistribution.LEXICAL} (Expected: 24)`);
    console.log(`  * RELATED:   ${result.details.evidenceDistribution.RELATED} (Expected: 2)`);
    console.log(`  * NO_DIRECT: ${result.details.evidenceDistribution.NO_DIRECT} (Expected: 44)`);
    console.log('==================================================\n');

    if (!result.isComplete) {
      console.error('❌ SCIENTIFIC C1 STATE INCOMPLETE with errors:');
      result.errors.forEach((err, idx) => console.error(`  ${idx + 1}. ${err}`));
      process.exit(1);
    }

    console.log('✅ SCIENTIFIC C1 STATE VERIFIED: Complete, coherent, and ready for production serving.\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ VERIFIER_UNEXPECTED_ERROR:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

module.exports = { verifyScientificC1State };
