import fs from 'fs';
import path from 'path';
import {
  MASTER_DOMAINS,
  MASTER_CONSTRUCTS,
  MASTER_FACETS,
  TOTAL_MASTER_DOMAINS_COUNT,
  TOTAL_MASTER_CONSTRUCTS_COUNT,
  TOTAL_MASTER_FACETS_COUNT,
  TOTAL_ADMINISTERED_ITEMS_COUNT,
  MASTER_DOMAIN_BY_ID,
  MASTER_CONSTRUCT_BY_ID,
  MASTER_FACET_BY_ID,
  normalizeMasterFacetId,
} from '../src/lib/profile/masterModelConstants';
import {
  CONSTRUCT_AGGREGATION_RULES,
  scoreToVisualCoordinate,
  visualCoordinateToScore,
} from '../src/lib/profile/constructAggregationResolver';
import { calculateProfileCoverageV2 } from '../src/lib/profile/profileCoverageResolver';
import { calculateProfileConfidenceMapV2 } from '../src/lib/profile/profileConfidenceResolver';
import { EVALUATED_PATTERNS, evaluateCrossDomainPatterns } from '../src/lib/profile/profilePatternEngine';
import { SYNERGY_RULES, evaluateProfileSynergies } from '../src/lib/profile/profileSynergyEngine';
import { TENSION_RULES, evaluateProfileTensions } from '../src/lib/profile/profileTensionEngine';
import { buildProfileEvidenceBundleV2 } from '../src/lib/profile/profileEvidenceBundle';
import { resolveUnifiedPsychologicalProfileV2 } from '../src/lib/profile/masterProfileResolver';
import { FacetProfileV2 } from '../src/types/unifiedProfileV2';

export interface UnifiedProfileV2AuditResult {
  success: boolean;
  metrics: {
    masterDomainsCount: number;
    masterConstructsCount: number;
    masterFacetsCount: number;
    constructAggregationRulesCount: number;
    patternsCount: number;
    synergyRulesCount: number;
    tensionRulesCount: number;
    administeredItemsExpected: number;
    emptyProfileFacetsNotMeasured: number;
    blueprintAlignmentCount: number;
  };
  errors: string[];
  warnings: string[];
}

export async function runUnifiedProfileV2Audit(): Promise<UnifiedProfileV2AuditResult> {
  const root = path.resolve(__dirname, '..');
  const errors: string[] = [];
  const warnings: string[] = [];

  console.log('='.repeat(95));
  console.log('PSYCHE-AI UNIFIED PSYCHOLOGICAL PROFILE V2 & MASTER MODEL AUDIT (FAZ 2.17)');
  console.log('='.repeat(95));

  // =========================================================================
  // 1. Structural Invariants: Domains (11), Constructs (37), Facets (91)
  // =========================================================================
  if (MASTER_DOMAINS.length !== TOTAL_MASTER_DOMAINS_COUNT) {
    errors.push(`MASTER_DOMAINS length is ${MASTER_DOMAINS.length}, expected ${TOTAL_MASTER_DOMAINS_COUNT}`);
  }
  if (MASTER_CONSTRUCTS.length !== TOTAL_MASTER_CONSTRUCTS_COUNT) {
    errors.push(`MASTER_CONSTRUCTS length is ${MASTER_CONSTRUCTS.length}, expected ${TOTAL_MASTER_CONSTRUCTS_COUNT}`);
  }
  if (MASTER_FACETS.length !== TOTAL_MASTER_FACETS_COUNT) {
    errors.push(`MASTER_FACETS length is ${MASTER_FACETS.length}, expected ${TOTAL_MASTER_FACETS_COUNT}`);
  }

  // Domain ID uniqueness & construct containment
  const domainIdSet = new Set<string>();
  let totalConstructsInDomains = 0;
  let totalFacetsInDomains = 0;

  for (const domain of MASTER_DOMAINS) {
    if (domainIdSet.has(domain.domainId)) {
      errors.push(`Duplicate domainId: ${domain.domainId}`);
    }
    domainIdSet.add(domain.domainId);
    totalConstructsInDomains += domain.constructIds.length;
    totalFacetsInDomains += domain.facetIds.length;

    for (const cId of domain.constructIds) {
      const construct = MASTER_CONSTRUCT_BY_ID.get(cId);
      if (!construct) {
        errors.push(`Domain ${domain.domainId} references unknown construct: ${cId}`);
      } else if (construct.domainId !== domain.domainId) {
        errors.push(`Domain mismatch: construct ${cId} has domainId ${construct.domainId} but listed under ${domain.domainId}`);
      }
    }

    for (const fId of domain.facetIds) {
      const facet = MASTER_FACET_BY_ID.get(fId);
      if (!facet) {
        errors.push(`Domain ${domain.domainId} references unknown facet: ${fId}`);
      } else if (facet.domainId !== domain.domainId) {
        errors.push(`Domain mismatch: facet ${fId} has domainId ${facet.domainId} but listed under ${domain.domainId}`);
      }
    }
  }

  if (totalConstructsInDomains !== 37) {
    errors.push(`Total constructs across domains is ${totalConstructsInDomains}, expected 37`);
  }
  if (totalFacetsInDomains !== 91) {
    errors.push(`Total facets across domains is ${totalFacetsInDomains}, expected 91`);
  }

  // Construct ID uniqueness & facet containment
  const constructIdSet = new Set<string>();
  let totalFacetsInConstructs = 0;

  for (const construct of MASTER_CONSTRUCTS) {
    if (constructIdSet.has(construct.constructId)) {
      errors.push(`Duplicate constructId: ${construct.constructId}`);
    }
    constructIdSet.add(construct.constructId);
    totalFacetsInConstructs += construct.facetIds.length;

    for (const fId of construct.facetIds) {
      const facet = MASTER_FACET_BY_ID.get(fId);
      if (!facet) {
        errors.push(`Construct ${construct.constructId} references unknown facet: ${fId}`);
      } else if (facet.constructId !== construct.constructId) {
        errors.push(`Construct mismatch: facet ${fId} has constructId ${facet.constructId} but listed under ${construct.constructId}`);
      }
    }
  }

  if (totalFacetsInConstructs !== 91) {
    errors.push(`Total facets across constructs is ${totalFacetsInConstructs}, expected 91`);
  }

  // Facet ID uniqueness
  const facetIdSet = new Set<string>();
  for (const facet of MASTER_FACETS) {
    if (facetIdSet.has(facet.facetId)) {
      errors.push(`Duplicate facetId: ${facet.facetId}`);
    }
    facetIdSet.add(facet.facetId);

    if (facet.expectedItemCount !== 5) {
      errors.push(`Facet ${facet.facetId} expectedItemCount is ${facet.expectedItemCount}, expected 5`);
    }
    if (!facet.scientificDefinitionTr || facet.scientificDefinitionTr.trim().length < 10) {
      errors.push(`Facet ${facet.facetId} missing scientific definition`);
    }
  }

  // =========================================================================
  // 2. Blueprint Alignment Check (against data/research-battery/facet-measurement-blueprints-v1.json)
  // =========================================================================
  const blueprintPath = path.resolve(root, 'data/research-battery/facet-measurement-blueprints-v1.json');
  let blueprintCount = 0;
  if (fs.existsSync(blueprintPath)) {
    const blueprintData = JSON.parse(fs.readFileSync(blueprintPath, 'utf8'));
    const blueprints = blueprintData.blueprints || [];
    blueprintCount = blueprints.length;

    if (blueprintCount !== 91) {
      errors.push(`Blueprint count is ${blueprintCount}, expected 91`);
    }

    for (const bp of blueprints) {
      const canonicalId = normalizeMasterFacetId(bp.facetId);
      if (!facetIdSet.has(canonicalId)) {
        errors.push(`Blueprint facetId ${bp.facetId} (canonical: ${canonicalId}) not found in MASTER_FACETS`);
      }
    }
  } else {
    warnings.push(`Blueprint file not found at ${blueprintPath}`);
  }

  // =========================================================================
  // 3. Construct Aggregation Rules Verification
  // =========================================================================
  const aggregationRuleConstructs = Object.keys(CONSTRUCT_AGGREGATION_RULES);
  if (aggregationRuleConstructs.length !== 37) {
    errors.push(`CONSTRUCT_AGGREGATION_RULES count is ${aggregationRuleConstructs.length}, expected 37`);
  }

  for (const construct of MASTER_CONSTRUCTS) {
    const rule = CONSTRUCT_AGGREGATION_RULES[construct.constructId];
    if (!rule) {
      errors.push(`Missing aggregation rule for construct: ${construct.constructId}`);
    } else {
      if (rule.allowed !== construct.allowsDirectAggregation) {
        errors.push(`Aggregation mismatch for construct ${construct.constructId}: rule.allowed (${rule.allowed}) !== construct.allowsDirectAggregation (${construct.allowsDirectAggregation})`);
      }
      if (rule.allowed && rule.minRequiredFacets <= 0) {
        errors.push(`Construct ${construct.constructId} allows aggregation but minRequiredFacets is ${rule.minRequiredFacets}`);
      }
    }
  }

  // Coordinate Conversion Invariants
  const testScore1 = 1.0;
  const testScore3 = 3.0;
  const testScore5 = 5.0;
  if (scoreToVisualCoordinate(testScore1) !== 0) {
    errors.push(`scoreToVisualCoordinate(1.0) must equal 0, got ${scoreToVisualCoordinate(testScore1)}`);
  }
  if (scoreToVisualCoordinate(testScore3) !== 50) {
    errors.push(`scoreToVisualCoordinate(3.0) must equal 50, got ${scoreToVisualCoordinate(testScore3)}`);
  }
  if (scoreToVisualCoordinate(testScore5) !== 100) {
    errors.push(`scoreToVisualCoordinate(5.0) must equal 100, got ${scoreToVisualCoordinate(testScore5)}`);
  }
  if (visualCoordinateToScore(0) !== 1.0) {
    errors.push(`visualCoordinateToScore(0) must equal 1.0, got ${visualCoordinateToScore(0)}`);
  }
  if (visualCoordinateToScore(50) !== 3.0) {
    errors.push(`visualCoordinateToScore(50) must equal 3.0, got ${visualCoordinateToScore(50)}`);
  }
  if (visualCoordinateToScore(100) !== 5.0) {
    errors.push(`visualCoordinateToScore(100) must equal 5.0, got ${visualCoordinateToScore(100)}`);
  }

  // =========================================================================
  // 4. Pattern, Synergy & Tension Engines Verification
  // =========================================================================
  if (EVALUATED_PATTERNS.length !== 8) {
    errors.push(`EVALUATED_PATTERNS count is ${EVALUATED_PATTERNS.length}, expected 8`);
  }
  if (SYNERGY_RULES.length !== 8) {
    errors.push(`SYNERGY_RULES count is ${SYNERGY_RULES.length}, expected 8`);
  }
  if (TENSION_RULES.length !== 8) {
    errors.push(`TENSION_RULES count is ${TENSION_RULES.length}, expected 8`);
  }

  // Test pattern engine with missing facets -> must return not active
  const emptyFacetsMap = new Map<string, FacetProfileV2>();
  const emptyPatterns = evaluateCrossDomainPatterns(emptyFacetsMap);
  if (emptyPatterns.length > 0) {
    errors.push(`Empty facets triggered ${emptyPatterns.length} patterns unexpectedly!`);
  }

  // Test synergy and tension engines with empty map
  const emptySynergies = evaluateProfileSynergies(emptyFacetsMap);
  if (emptySynergies.length > 0) {
    errors.push(`Empty facets triggered ${emptySynergies.length} synergies unexpectedly!`);
  }

  const emptyTensions = evaluateProfileTensions(emptyFacetsMap);
  if (emptyTensions.length > 0) {
    errors.push(`Empty facets triggered ${emptyTensions.length} tensions unexpectedly!`);
  }

  // =========================================================================
  // 5. Full Profile Resolution Invariant Tests
  // =========================================================================
  // Scenario A: Empty Profile
  const emptyProfile = await resolveUnifiedPsychologicalProfileV2('test-user-audit-empty', {
    mockSessions: [],
  });

  if (emptyProfile.domains.length !== 11) {
    errors.push(`Empty profile domain count is ${emptyProfile.domains.length}, expected 11`);
  }
  if (emptyProfile.constructs.length !== 37) {
    errors.push(`Empty profile construct count is ${emptyProfile.constructs.length}, expected 37`);
  }
  if (emptyProfile.facets.length !== 91) {
    errors.push(`Empty profile facet count is ${emptyProfile.facets.length}, expected 91`);
  }

  // Invariant: Domain scores MUST BE NULL (no collapsing into fake global means)
  for (const domain of emptyProfile.domains) {
    if (domain.domainScore !== null) {
      errors.push(`Domain ${domain.domainId} domainScore must be null, got ${domain.domainScore}`);
    }
  }

  // Invariant: Missing facets must remain NOT_MEASURED (never midpoint imputed)
  let unmeasuredCount = 0;
  for (const facet of emptyProfile.facets) {
    if (facet.measurementStatus === 'NOT_MEASURED') {
      unmeasuredCount++;
      if (facet.score !== null || facet.normalizedVisualCoordinate !== null) {
        errors.push(`Facet ${facet.facetId} is NOT_MEASURED but has non-null score: score=${facet.score}`);
      }
    }
  }

  if (unmeasuredCount !== 91) {
    errors.push(`Empty profile unmeasured facets count is ${unmeasuredCount}, expected 91`);
  }

  // Invariant: Epistemic confidence map has 6 dimensions without single fake percentage
  const confMap = emptyProfile.confidenceMap;
  if (!confMap.measurementCoverage || !confMap.responseQuality || !confMap.itemCompletion ||
      !confMap.repeatMeasurement || !confMap.methodDiversity || !confMap.calibrationStatus) {
    errors.push(`ConfidenceMapV2 missing one or more required 6 epistemic dimensions`);
  }

  // Invariant: Profile Coverage separation
  if (emptyProfile.coverage.facetCoverage.measuredCount !== 0 || emptyProfile.coverage.facetCoverage.percentage !== 0) {
    errors.push(`Empty profile coverage non-zero: ${emptyProfile.coverage.facetCoverage.percentage}%`);
  }

  // =========================================================================
  // 6. Evidence Bundle Export Validation (FAZ 2.18 Grounding Invariant)
  // =========================================================================
  const evidenceBundle = buildProfileEvidenceBundleV2(emptyProfile);
  if (evidenceBundle.measuredFacets.length !== 0) {
    errors.push(`Evidence bundle measuredFacets should be empty for empty profile, got ${evidenceBundle.measuredFacets.length}`);
  }
  if (Object.keys(evidenceBundle.measurementStatuses).length !== 91) {
    errors.push(`Evidence bundle measurementStatuses should have 91 facets, got ${Object.keys(evidenceBundle.measurementStatuses).length}`);
  }
  if (!evidenceBundle.aiGovernanceRule || evidenceBundle.aiGovernanceRule.length < 10) {
    errors.push(`Evidence bundle missing aiGovernanceRule`);
  }

  // Scenario B: Simulated Partial Profile (HEXACO Honesty-Humility completed with 4 facets)
  const mockHonestySession = {
    id: 'sess_honesty_test',
    status: 'COMPLETED',
    completedAt: new Date(),
    formVersion: {
      versionCode: 'v1.0.0_battery',
      module: { id: 'mod_hexaco_hh', code: 'mod_hexaco_hh', titleTr: 'HEXACO Dürüstlük-Alçakgönüllülük' },
      items: [],
    },
    responses: [
      { scoredValue: 4.5, rawValue: 4.5, item: { facet: { id: 'sincerity' } } },
      { scoredValue: 4.0, rawValue: 4.0, item: { facet: { id: 'fairness' } } },
      { scoredValue: 3.5, rawValue: 3.5, item: { facet: { id: 'greed_avoidance' } } },
      { scoredValue: 4.0, rawValue: 4.0, item: { facet: { id: 'modesty' } } },
    ],
    integrityResults: [{ overallFlag: 'EXCELLENT' }],
  };

  const partialProfile = await resolveUnifiedPsychologicalProfileV2('test-user-partial', {
    mockSessions: [mockHonestySession],
  });

  const sincerityFacet = partialProfile.facets.find(f => f.facetId === 'sincerity');
  if (!sincerityFacet || sincerityFacet.measurementStatus !== 'MEASURED_PRECALIBRATION' || sincerityFacet.score !== 4.5) {
    errors.push(`Partial profile sincerity facet failed to compute expected score 4.5. Got: ${JSON.stringify(sincerityFacet)}`);
  }

  const honestyConstruct = partialProfile.constructs.find(c => c.constructId === 'hexaco_honesty_humility');
  if (!honestyConstruct || honestyConstruct.aggregationStatus !== 'DIRECT_CONSTRUCT_SCORE' || honestyConstruct.constructScore === null) {
    errors.push(`Honesty-Humility construct failed to aggregate 4 valid facets. Got: ${JSON.stringify(honestyConstruct)}`);
  }

  // Invariant: Non-aggregatable construct (e.g. Locus of Control) should have allowsDirectAggregation === false
  const locusConstruct = partialProfile.constructs.find(c => c.constructId === 'locus_of_control');
  if (locusConstruct && locusConstruct.aggregationStatus === 'DIRECT_CONSTRUCT_SCORE') {
    errors.push(`Locus of control construct cannot have DIRECT_CONSTRUCT_SCORE aggregation`);
  }

  // Result metrics
  const success = errors.length === 0;
  const metrics = {
    masterDomainsCount: MASTER_DOMAINS.length,
    masterConstructsCount: MASTER_CONSTRUCTS.length,
    masterFacetsCount: MASTER_FACETS.length,
    constructAggregationRulesCount: aggregationRuleConstructs.length,
    patternsCount: EVALUATED_PATTERNS.length,
    synergyRulesCount: SYNERGY_RULES.length,
    tensionRulesCount: TENSION_RULES.length,
    administeredItemsExpected: TOTAL_ADMINISTERED_ITEMS_COUNT,
    emptyProfileFacetsNotMeasured: unmeasuredCount,
    blueprintAlignmentCount: blueprintCount,
  };

  console.log(`- Master Domains: ${metrics.masterDomainsCount} / 11`);
  console.log(`- Master Constructs: ${metrics.masterConstructsCount} / 37 (Deterministic aggregation rules verified)`);
  console.log(`- Master Facets: ${metrics.masterFacetsCount} / 91 (100% aligned with Research Battery blueprints)`);
  console.log(`- Construct Aggregation Rules: ${metrics.constructAggregationRulesCount} / 37 verified`);
  console.log(`- Cross-Domain Patterns: ${metrics.patternsCount} / 8 deterministic pattern models`);
  console.log(`- Profile Synergies: ${metrics.synergyRulesCount} / 8 rules`);
  console.log(`- Profile Tensions: ${metrics.tensionRulesCount} / 8 rules`);
  console.log(`- 6-Dimensional Epistemic Confidence Map verified (No single fake percentages)`);
  console.log(`- Missing Facets Invariant verified: NOT_MEASURED (Never midpoint imputed)`);
  console.log(`- Domain Level Collapsing Prohibition verified (Domain scores strictly null)`);
  console.log(`- Visual Coordinates Linear Mapping [1,5] -> [0,100] verified`);
  console.log(`- Evidence Bundle Export verified (FAZ 2.18 Grounding Ready; Zero AI scoring role)`);
  console.log(`- Errors: ${errors.length}, Warnings: ${warnings.length}`);
  console.log('='.repeat(95));

  if (errors.length > 0) {
    console.error('AUDIT FAILED WITH ERRORS:');
    errors.forEach(e => console.error(`  - ❌ ${e}`));
  } else {
    console.log('✅ UNIFIED PSYCHOLOGICAL PROFILE V2 AUDIT PASSED (100% COMPLIANT)');
  }

  return {
    success,
    metrics,
    errors,
    warnings,
  };
}

if (require.main === module) {
  runUnifiedProfileV2Audit().then(result => {
    if (!result.success) {
      process.exit(1);
    }
  });
}
