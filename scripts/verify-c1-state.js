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
    modulesSummary: [],
  };

  try {
    // 1. Check Schema Migration Readiness
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

  // 2. Fetch all modules and published forms
  const modules = await db.assessmentModule.findMany({
    orderBy: { code: 'asc' },
  });

  const publishedForms = await db.assessmentFormVersion.findMany({
    where: {
      OR: [{ status: 'PUBLISHED' }, { isPublished: true }],
    },
    include: {
      module: true,
      items: {
        orderBy: { sortOrder: 'asc' },
        include: {
          itemVersion: true,
        },
      },
    },
  });

  details.publishedFormsCount = publishedForms.length;

  if (publishedForms.length === 0) {
    errors.push('INTAKE_INVARIANT_VIOLATION: No published assessment forms found in the database.');
  }

  // Check multi-module uniqueness invariant: at most 1 published form per module
  const publishedFormsByModule = new Map();
  for (const form of publishedForms) {
    const list = publishedFormsByModule.get(form.moduleId) || [];
    list.push(form);
    publishedFormsByModule.set(form.moduleId, list);
  }

  for (const mod of modules) {
    const modForms = publishedFormsByModule.get(mod.id) || [];
    if (modForms.length > 1) {
      errors.push(
        `MODULE_MULTIPLE_PUBLISHED_FORMS: Modül '${mod.code}' için birden fazla (${modForms.length}) yayınlanmış form bulundu: ${modForms.map((f) => f.versionCode).join(', ')}`
      );
    }

    const liveForm = modForms[0] || null;
    details.modulesSummary.push({
      moduleId: mod.id,
      moduleCode: mod.code,
      moduleTitleTr: mod.titleTr,
      publishedFormId: liveForm ? liveForm.id : null,
      publishedVersionCode: liveForm ? liveForm.versionCode : null,
      itemCount: liveForm ? liveForm.items.length : 0,
    });
  }

  // Primary live form (for backward compatibility / logging)
  const primaryForm = publishedForms[0] || null;
  if (primaryForm) {
    details.liveFormCode = primaryForm.versionCode;
    details.liveFormItemCount = primaryForm.items.length;
  }

  // 3. Inspect each published form for structural & lifecycle coherence
  const allLiveItemVersionIds = new Set();
  let totalLiveCoherentItems = 0;

  for (const form of publishedForms) {
    // Dual-state coherence check
    if (form.status !== 'PUBLISHED' || !form.isPublished) {
      errors.push(
        `LIFECYCLE_INCOHERENCE: Form '${form.versionCode}' dual-state incoherence (status='${form.status}', isPublished=${form.isPublished})`
      );
    }

    if (form.items.length === 0) {
      errors.push(`EMPTY_PUBLISHED_FORM: Published form '${form.versionCode}' has 0 items.`);
    }

    // Sort order 1..N and uniqueness
    const seenSort = new Set();
    const seenVersionIds = new Set();

    for (let i = 0; i < form.items.length; i++) {
      const expectedSort = i + 1;
      const formItem = form.items[i];

      if (formItem.sortOrder !== expectedSort) {
        errors.push(
          `SORT_ORDER_INCONSISTENCY: Form '${form.versionCode}' item #${i + 1} has sortOrder ${formItem.sortOrder} (expected ${expectedSort})`
        );
      }
      seenSort.add(formItem.sortOrder);

      if (seenVersionIds.has(formItem.itemVersionId)) {
        errors.push(
          `DUPLICATE_ITEM_IN_FORM: Form '${form.versionCode}' has duplicate itemVersionId '${formItem.itemVersionId}'`
        );
      }
      seenVersionIds.add(formItem.itemVersionId);

      // ItemVersion status check
      const iv = formItem.itemVersion;
      if (!iv) {
        errors.push(
          `MISSING_ITEM_VERSION: Form '${form.versionCode}' references non-existent itemVersionId '${formItem.itemVersionId}'`
        );
        continue;
      }

      if (iv.status !== 'ACTIVE' || !iv.isActive) {
        errors.push(
          `ITEM_VERSION_INCOHERENCE: ItemVersion '${iv.id}' in live form '${form.versionCode}' has status='${iv.status}', isActive=${iv.isActive}`
        );
      } else {
        totalLiveCoherentItems++;
      }

      allLiveItemVersionIds.add(iv.id);
    }
  }

  details.liveItemVersionsCount = totalLiveCoherentItems;

  // 4. Check for active item versions outside published forms
  const otherActiveItems = await db.itemVersion.count({
    where: {
      isActive: true,
      id: { notIn: Array.from(allLiveItemVersionIds) },
    },
  });

  details.activeItemsOutsideLiveFormCount = otherActiveItems;
  if (otherActiveItems > 0) {
    errors.push(
      `AMBIGUOUS_ACTIVE_ITEMS: Found ${otherActiveItems} active item version(s) outside published live forms.`
    );
  }

  // 5. Check Validation Matrix (84 Facets & Exact Level Breakdown)
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

  // 6. Check Evidence Child Records
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
