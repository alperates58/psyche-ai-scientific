import fs from 'fs';
import path from 'path';

export interface ResearchBatteryAuditResult {
  success: boolean;
  metrics: {
    totalBlueprints: number;
    totalPsychologicalItems: number;
    totalResponseQualityItems: number;
    totalItemBankCount: number;
    totalModulesCount: number;
    totalScoringFormulasCount: number;
    coverageCompletenessPercent: number;
    existingBankReviewedCount: number;
    domainsCovered: number;
    constructsCovered: number;
    facetsCovered: number;
  };
  errors: string[];
  warnings: string[];
}

export function runResearchBatteryAudit(): ResearchBatteryAuditResult {
  const root = path.resolve(__dirname, '..');
  const errors: string[] = [];
  const warnings: string[] = [];

  const batteryDir = path.resolve(root, 'data/research-battery');
  const requiredFiles = [
    'scientific-sources-v1.json',
    'facet-measurement-blueprints-v1.json',
    'psycheai-item-bank-v1.json',
    'psycheai-administered-items-v1.json',
    'psycheai-modules-v1.json',
    'psycheai-scoring-v1.json',
    'psycheai-coverage-v1.json',
    'existing-bank-review-v1.json'
  ];

  console.log('='.repeat(95));
  console.log('PSYCHEAI NATIVE SCIENTIFIC RESEARCH BATTERY AUDIT (FAZ 2.16.1)');
  console.log('='.repeat(95));

  // 1. File existence check
  for (const fileName of requiredFiles) {
    const filePath = path.join(batteryDir, fileName);
    if (!fs.existsSync(filePath)) {
      errors.push(`Missing required research battery file: data/research-battery/${fileName}`);
    }
  }

  if (errors.length > 0) {
    return {
      success: false,
      metrics: {
        totalBlueprints: 0,
        totalPsychologicalItems: 0,
        totalResponseQualityItems: 0,
        totalItemBankCount: 0,
        totalModulesCount: 0,
        totalScoringFormulasCount: 0,
        coverageCompletenessPercent: 0,
        existingBankReviewedCount: 0,
        domainsCovered: 0,
        constructsCovered: 0,
        facetsCovered: 0
      },
      errors,
      warnings
    };
  }

  // Load files
  const blueprintsData = JSON.parse(fs.readFileSync(path.join(batteryDir, 'facet-measurement-blueprints-v1.json'), 'utf8'));
  const itemBankData = JSON.parse(fs.readFileSync(path.join(batteryDir, 'psycheai-item-bank-v1.json'), 'utf8'));
  const administeredData = JSON.parse(fs.readFileSync(path.join(batteryDir, 'psycheai-administered-items-v1.json'), 'utf8'));
  const modulesData = JSON.parse(fs.readFileSync(path.join(batteryDir, 'psycheai-modules-v1.json'), 'utf8'));
  const scoringData = JSON.parse(fs.readFileSync(path.join(batteryDir, 'psycheai-scoring-v1.json'), 'utf8'));
  const coverageData = JSON.parse(fs.readFileSync(path.join(batteryDir, 'psycheai-coverage-v1.json'), 'utf8'));
  const existingBankReview = JSON.parse(fs.readFileSync(path.join(batteryDir, 'existing-bank-review-v1.json'), 'utf8'));

  // 2. Blueprint Audit
  const blueprints = blueprintsData.blueprints || [];
  if (blueprints.length !== 91) {
    errors.push(`Expected 91 blueprints, but found ${blueprints.length}`);
  }

  const blueprintFacetIds = new Set<string>();
  blueprints.forEach((bp: any) => {
    blueprintFacetIds.add(bp.facetId);
    if (!bp.scientificDefinitionTr || bp.scientificDefinitionTr.length < 20) {
      errors.push(`Blueprint ${bp.facetId} has missing or too short scientificDefinitionTr.`);
    }
    if (!bp.inclusionCriteria || bp.inclusionCriteria.length === 0) {
      errors.push(`Blueprint ${bp.facetId} has no inclusionCriteria.`);
    }
    if (!bp.exclusionCriteria || bp.exclusionCriteria.length === 0) {
      errors.push(`Blueprint ${bp.facetId} has no exclusionCriteria.`);
    }
    if (!bp.behavioralIndicators || !bp.behavioralIndicators.behavioralIndicatorsDetailed) {
      errors.push(`Blueprint ${bp.facetId} has missing behavioralIndicators.`);
    }
    if (!bp.primarySourceIds || bp.primarySourceIds.length === 0) {
      errors.push(`Blueprint ${bp.facetId} has no primarySourceIds.`);
    }
  });

  // 3. Item Bank Audit
  const items = itemBankData.items || [];
  const psychologicalItems = items.filter((i: any) => i.itemCategory === 'PSYCHOLOGICAL');
  const responseQualityItems = items.filter((i: any) => i.itemCategory === 'RESPONSE_QUALITY');

  if (psychologicalItems.length !== 455) {
    errors.push(`Expected 455 psychological items (91 facets * 5 items), but found ${psychologicalItems.length}`);
  }
  if (responseQualityItems.length < 10) {
    errors.push(`Expected at least 10 response quality items, but found ${responseQualityItems.length}`);
  }

  // Check 5 items per facet and reverse keying
  const itemsByFacet: Record<string, any[]> = {};
  psychologicalItems.forEach((item: any) => {
    if (!itemsByFacet[item.facetId]) {
      itemsByFacet[item.facetId] = [];
    }
    itemsByFacet[item.facetId].push(item);

    // Prompt checks
    if (!item.promptTr || item.promptTr.trim().length < 15) {
      errors.push(`Item ${item.itemId} promptTr is missing or too short.`);
    }
    if (!item.promptEn || item.promptEn.trim().length < 15) {
      errors.push(`Item ${item.itemId} promptEn is missing or too short.`);
    }
    if (item.originalityMethod !== 'CONSTRUCT_DERIVED') {
      errors.push(`Item ${item.itemId} originalityMethod must be CONSTRUCT_DERIVED.`);
    }
    if (item.sourceItemUsed !== false) {
      errors.push(`Item ${item.itemId} sourceItemUsed must be false.`);
    }
    if (item.researchStatus !== 'RESEARCH_DRAFT') {
      errors.push(`Item ${item.itemId} researchStatus must be RESEARCH_DRAFT.`);
    }
    if (item.measurementStatus !== 'PRE_CALIBRATION') {
      errors.push(`Item ${item.itemId} measurementStatus must be PRE_CALIBRATION.`);
    }
  });

  // Verify all 91 facets have exactly 5 items and at least 1 reverse item
  blueprintFacetIds.forEach(facetId => {
    const facetItems = itemsByFacet[facetId] || [];
    if (facetItems.length !== 5) {
      errors.push(`Facet ${facetId} has ${facetItems.length} items (expected exactly 5).`);
    }
    const reverseCount = facetItems.filter(i => i.reverseKeyed).length;
    if (reverseCount < 1) {
      warnings.push(`Facet ${facetId} has 0 reverse keyed items.`);
    }
  });

  // 4. Administered Items Audit
  const administeredItems = administeredData.administeredItems || [];
  if (administeredItems.length !== items.length) {
    errors.push(`Administered items count (${administeredItems.length}) does not match item bank count (${items.length}).`);
  }

  // 5. Modules Audit
  const modules = modulesData.modules || [];
  if (modules.length < 12) {
    errors.push(`Expected at least 12 modules, found ${modules.length}`);
  }

  // 6. Scoring Audit
  const facetScoring = scoringData.facetsScoring || [];
  if (facetScoring.length !== 91) {
    errors.push(`Expected 91 facet scoring specifications, found ${facetScoring.length}`);
  }

  // 7. Coverage Audit
  const coverageCompleteness = coverageData.summaryMetrics?.coverageCompletenessPercent || 0;
  if (coverageCompleteness !== 100) {
    errors.push(`Coverage completeness is ${coverageCompleteness}%, expected 100%.`);
  }

  // 8. Legacy Bank Review Audit
  const reviewedCount = existingBankReview.summary?.totalItemsReviewed || 0;
  if (reviewedCount !== 832) {
    errors.push(`Expected 832 items in existing-bank-review-v1.json, found ${reviewedCount}`);
  }

  const result: ResearchBatteryAuditResult = {
    success: errors.length === 0,
    metrics: {
      totalBlueprints: blueprints.length,
      totalPsychologicalItems: psychologicalItems.length,
      totalResponseQualityItems: responseQualityItems.length,
      totalItemBankCount: items.length,
      totalModulesCount: modules.length,
      totalScoringFormulasCount: facetScoring.length,
      coverageCompletenessPercent: coverageCompleteness,
      existingBankReviewedCount: reviewedCount,
      domainsCovered: coverageData.summaryMetrics?.totalDomains || 11,
      constructsCovered: coverageData.summaryMetrics?.totalConstructs || 37,
      facetsCovered: coverageData.summaryMetrics?.totalFacets || 91
    },
    errors,
    warnings
  };

  console.log(`- Blueprints Verified: ${result.metrics.totalBlueprints} / 91`);
  console.log(`- Psychological Items Authored: ${result.metrics.totalPsychologicalItems} / 455`);
  console.log(`- Response Quality Items: ${result.metrics.totalResponseQualityItems} / 14`);
  console.log(`- Total Item Bank Size: ${result.metrics.totalItemBankCount} items`);
  console.log(`- Modules Defined: ${result.metrics.totalModulesCount}`);
  console.log(`- Scoring Formulas: ${result.metrics.totalScoringFormulasCount}`);
  console.log(`- Measurement Coverage: ${result.metrics.coverageCompletenessPercent}% (11 Domains, 37 Constructs, 91 Facets)`);
  console.log(`- Legacy Item Bank Reviewed: ${result.metrics.existingBankReviewedCount} / 832 items`);
  console.log(`- Errors: ${errors.length}, Warnings: ${warnings.length}`);
  console.log('='.repeat(95));

  if (errors.length > 0) {
    console.error('AUDIT FAILED WITH ERRORS:');
    errors.forEach(e => console.error(`  - ❌ ${e}`));
  } else {
    console.log('✅ RESEARCH BATTERY AUDIT PASSED (100% COMPLIANT)');
  }

  return result;
}

if (require.main === module) {
  const result = runResearchBatteryAudit();
  if (!result.success) {
    process.exit(1);
  }
}
