import { PrismaClient } from '@prisma/client';

export interface ScientificC1StateVerificationResult {
  isComplete: boolean;
  details: {
    schemaReady: boolean;
    publishedFormsCount: number;
    liveFormCode: string | null;
    liveFormItemCount: number;
    liveItemVersionsCount: number;
    activeItemsOutsideLiveFormCount: number;
    validationSummariesCount: number;
    evidenceDistribution: {
      DIRECT: number;
      LEXICAL: number;
      RELATED: number;
      NO_DIRECT: number;
    };
    studyEvidencesCount: number;
    reliabilityEvidencesCount: number;
  };
  errors: string[];
}

export async function verifyScientificC1State(
  prisma: PrismaClient
): Promise<ScientificC1StateVerificationResult> {
  const errors: string[] = [];
  const details = {
    schemaReady: false,
    publishedFormsCount: 0,
    liveFormCode: null as string | null,
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
    // 1. Check Schema Migration Readiness (Query new models)
    const [summaryCount, studyCount, relCount] = await Promise.all([
      prisma.facetValidationSummary.count(),
      prisma.facetValidationStudyEvidence.count(),
      prisma.facetReliabilityEvidence.count(),
    ]);

    details.schemaReady = true;
    details.validationSummariesCount = summaryCount;
    details.studyEvidencesCount = studyCount;
    details.reliabilityEvidencesCount = relCount;
  } catch (err: any) {
    errors.push(`SCHEMA_NOT_READY: Scientific tables could not be queried: ${err.message}`);
    return { isComplete: false, details, errors };
  }

  // 2. Check Assessment Forms & Intake Invariants
  const publishedForms = await prisma.assessmentFormVersion.findMany({
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

    // 3. Check Live Item Versions Coherence
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

    // Check for ambiguous active item versions outside live form
    const otherActiveItems = await prisma.itemVersion.count({
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

  // 4. Check Validation Matrix (84 Facets & Exact Level Breakdown)
  if (details.validationSummariesCount !== 84) {
    errors.push(
      `VALIDATION_SUMMARY_COUNT_MISMATCH: Expected 84 FacetValidationSummary records, found ${details.validationSummariesCount}`
    );
  }

  const summaries = await prisma.facetValidationSummary.findMany();
  for (const s of summaries) {
    if (s.overallTurkishEvidenceLevel in details.evidenceDistribution) {
      details.evidenceDistribution[s.overallTurkishEvidenceLevel as keyof typeof details.evidenceDistribution]++;
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

  // 5. Check Evidence Child Records
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
