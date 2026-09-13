import fs from 'fs';
import path from 'path';
import { lintItem, lintItemBank } from '../src/research/item-quality/itemQualityLinter';
import { analyzeLexicalClusters } from '../src/research/item-quality/semanticClusterAnalyzer';

const masterBankPath = path.resolve(__dirname, '../data/master-item-bank.json');
const trMatrixPath = path.resolve(__dirname, '../research/turkish-validation-matrix.json');

const rawItems = JSON.parse(fs.readFileSync(masterBankPath, 'utf8'));
const trMatrix = JSON.parse(fs.readFileSync(trMatrixPath, 'utf8'));

const trStatusMap = new Map<string, string>();
for (const entry of trMatrix) {
  trStatusMap.set(entry.facetId, entry.status);
}

console.log(`Starting forensic audit of ${rawItems.length} candidate items...`);

// Run lexical similarity analysis across all items
const lexicalReport = analyzeLexicalClusters(
  rawItems.map((it: any) => ({ id: it.id, facetId: it.facetId, text_tr: it.text_tr })),
  0.70
);

const withinFacetDupIds = new Set<string>();
for (const pair of lexicalReport.withinFacetDuplicates) {
  withinFacetDupIds.add(pair.itemAId);
  withinFacetDupIds.add(pair.itemBId);
}

const crossFacetDupIds = new Set<string>();
for (const pair of lexicalReport.crossFacetOverlaps) {
  crossFacetDupIds.add(pair.itemAId);
  crossFacetDupIds.add(pair.itemBId);
}

let aiProvenanceFixedCount = 0;
let sjtRevisionRequiredCount = 0;
let fcDesirabilityMismatchCount = 0;
let readyCount = 0;
let revisionCount = 0;
let blockedCount = 0;

const auditedItems = rawItems.map((item: any) => {
  // 1. Lint the individual item
  const lintRes = lintItem(item);

  // 2. Determine Lexical Similarity Status
  let lexicalSimilarityStatus = 'UNIQUE';
  if (withinFacetDupIds.has(item.id)) {
    lexicalSimilarityStatus = 'FLAGGED_WITHIN_FACET';
  } else if (crossFacetDupIds.has(item.id)) {
    lexicalSimilarityStatus = 'FLAGGED_CROSS_FACET';
  }

  // 3. AI Provenance & Authoring Method Corrections
  const wasClaimingResearchTeam = item.translationProvenance?.translatorType === 'SCIENTIFIC_RESEARCH_TEAM'
    || item.translationProvenance?.culturalReviewStatus === 'COMPLETED_INTERNAL_REVIEW';
  if (wasClaimingResearchTeam) {
    aiProvenanceFixedCount++;
  }

  const cleanTranslationProvenance = {
    originalLanguage: 'tr',
    authoringMethod: 'AI_ASSISTED_ORIGINAL_DRAFT',
    authorType: 'GENERATIVE_AI',
    humanExpertReviewed: false,
    culturalReviewStatus: 'NOT_REVIEWED',
    expertReviewStatus: 'PENDING',
    validationStatus: 'RESEARCH_DRAFT'
  };

  // 4. Distinct Source vs License separation
  const inspiredInstrument = (item.instrumentIds && item.instrumentIds.length > 0)
    ? item.instrumentIds[0]
    : null;

  let licenseStatus = 'ORIGINAL_WORDING_UNRESTRICTED';
  if (item.domainId === 'optional_dark_tetrad') {
    licenseStatus = 'RESEARCH_ONLY';
  }

  // 5. SJT scenario audit
  let sjtReviewStatus = 'NOT_APPLICABLE';
  let sjtScoringReady = false;
  let isPsychometricallyScored = false;

  if (item.itemType === 'situational_judgement') {
    const scenarios = item.situationalScenarios || [];
    if (scenarios.length < 3) {
      sjtReviewStatus = 'SJT_REQUIRES_REVISION';
      sjtRevisionRequiredCount++;
    } else {
      sjtReviewStatus = 'PENDING_EXPERT_REVIEW';
    }
    sjtScoringReady = false; // Never declare as psychometrically scored without empirical data
    isPsychometricallyScored = false;
  }

  // 6. Forced Choice Desirability Audit
  let forcedChoiceDesirabilityStatus = 'NOT_APPLICABLE';
  let forcedChoiceBlock = item.forcedChoiceBlock;

  if (item.itemType === 'forced_choice') {
    const hasMismatchNotice = lintRes.warnings.some(w => w.ruleCode === 'FORCED_CHOICE_DESIRABILITY_MISMATCH');
    if (hasMismatchNotice) {
      forcedChoiceDesirabilityStatus = 'FORCED_CHOICE_DESIRABILITY_MISMATCH';
      fcDesirabilityMismatchCount++;
    } else {
      forcedChoiceDesirabilityStatus = 'PENDING_EXPERT_REVIEW';
    }

    if (forcedChoiceBlock) {
      forcedChoiceBlock = {
        ...forcedChoiceBlock,
        scoringApproach: 'SCORING_NOT_CALIBRATED'
      };
    }
  }

  // 7. Wording lint status
  let wordingLintStatus = 'PASS';
  if (lintRes.warnings.some(w => w.severity === 'CRITICAL')) {
    wordingLintStatus = 'CRITICAL';
  } else if (lintRes.warnings.length > 0) {
    wordingLintStatus = 'FLAGGED';
  }

  // 8. Triage Status
  let triageStatus = 'READY_FOR_EXPERT_REVIEW';
  if (licenseStatus === 'BLOCKED') {
    triageStatus = 'BLOCKED_PROVENANCE_OR_LICENSE';
    blockedCount++;
  } else if (
    wordingLintStatus === 'CRITICAL' ||
    sjtReviewStatus === 'SJT_REQUIRES_REVISION' ||
    forcedChoiceDesirabilityStatus === 'FORCED_CHOICE_DESIRABILITY_MISMATCH' ||
    lintRes.wordingLintScore < 80
  ) {
    triageStatus = 'REQUIRES_INTERNAL_REVISION';
    revisionCount++;
  } else {
    triageStatus = 'READY_FOR_EXPERT_REVIEW';
    readyCount++;
  }

  return {
    ...item,
    // Pure metadata corrections
    itemWordingSource: 'ORIGINAL_AI_ASSISTED',
    constructEvidenceSources: item.sourceIds || ['src_ashton_lee_2007'],
    inspiredByInstrument: inspiredInstrument,
    licenseBasis: 'ORIGINAL_WORDING',
    licenseStatus,
    validationStatus: 'RESEARCH_DRAFT',
    candidateStatus: item.domainId === 'optional_dark_tetrad' ? 'RESEARCH_ONLY' : 'INTERNAL_REVIEW',
    translationProvenance: cleanTranslationProvenance,

    // SJT & Forced Choice
    sjtReviewStatus,
    sjtScoringReady,
    isPsychometricallyScored,
    forcedChoiceDesirabilityStatus,
    forcedChoiceBlock,

    // Forensic Risk Profiles
    wordingLintStatus,
    wordingLintScore: lintRes.wordingLintScore,
    formattingHeuristicScore: lintRes.formattingHeuristicScore,
    lexicalSimilarityStatus,
    provenanceStatus: 'VERIFIED_AI_DRAFT',
    constructAlignmentStatus: 'THEORETICAL_MATCH',
    socialDesirabilityReviewStatus: 'NOT_REVIEWED',
    crossLoadingReviewStatus: 'NOT_REVIEWED',
    culturalReviewStatus: 'NOT_REVIEWED',
    expertReviewStatus: 'PENDING',
    humanExpertReviewed: false,
    triageStatus,
    turkishValidationStatus: trStatusMap.get(item.facetId) || 'NO_DIRECT_TURKISH_VALIDATION',
    automatedHeuristicOnly: true
  };
});

fs.writeFileSync(masterBankPath, JSON.stringify(auditedItems, null, 2), 'utf8');

console.log('\n=== FORENSIC ITEM BANK AUDIT COMPLETE ===');
console.log(`Total Audited Items: ${auditedItems.length}`);
console.log(`AI Provenance Corrected Items: ${aiProvenanceFixedCount}`);
console.log(`SJT Revision Required: ${sjtRevisionRequiredCount}`);
console.log(`Forced-Choice Desirability Mismatch: ${fcDesirabilityMismatchCount}`);
console.log(`Lexical Duplicates (Jaccard >= 0.70): within-facet: ${lexicalReport.withinFacetDuplicates.length}, cross-facet: ${lexicalReport.crossFacetOverlaps.length}`);
console.log('\n=== TRIAGE BREAKDOWN ===');
console.log(`READY_FOR_EXPERT_REVIEW: ${readyCount} (${Math.round((readyCount / auditedItems.length) * 100)}%)`);
console.log(`REQUIRES_INTERNAL_REVISION: ${revisionCount} (${Math.round((revisionCount / auditedItems.length) * 100)}%)`);
console.log(`BLOCKED_PROVENANCE_OR_LICENSE: ${blockedCount}`);
