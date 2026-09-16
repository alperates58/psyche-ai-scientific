import fs from 'fs';
import path from 'path';

export interface MasterModelAuditResult {
  success: boolean;
  metrics: {
    totalCandidateConstructs: number;
    acceptedCoreCandidates: number;
    acceptedExpansionCandidates: number;
    mergedCandidates: number;
    excludedCandidates: number;
    deferredCandidates: number;
    totalSources: number;
    totalOverlapPairs: number;
    totalTheoreticalLenses: number;
    totalTheoreticalLensMappings: number;
    currentOntologyDomains: number;
    currentOntologyConstructs: number;
    currentOntologyFacets: number;
    crosswalkConstructCoverage: number;
    crosswalkFacetCoverage: number;
    proposedMasterDomains: number;
    proposedMasterConstructs: number;
    proposedMasterFacets: number;
    responseIntegrityMetrics: number;
    derivedIndicesCount: number;
    p0CoreConstructs: number;
    p1ExpansionConstructs: number;
    p2ResearchConstructs: number;
    p3ObservationalConstructs: number;
  };
  errors: string[];
  warnings: string[];
}

export function runMasterModelAudit(): MasterModelAuditResult {
  const root = path.resolve(__dirname, '..');
  const errors: string[] = [];
  const warnings: string[] = [];

  const protocolPath = path.resolve(root, 'data/master-model/literature-screening-protocol.json');
  const sourcesPath = path.resolve(root, 'data/master-model/master-model-sources.json');
  const baselinePath = path.resolve(root, 'data/master-model/current-ontology-baseline.json');
  const candidatesPath = path.resolve(root, 'data/master-model/candidate-constructs.json');
  const overlapPath = path.resolve(root, 'data/master-model/overlap-analysis.json');
  const lensesPath = path.resolve(root, 'data/master-model/theoretical-lens-map.json');
  const crosswalkPath = path.resolve(root, 'data/master-model/current-to-master-crosswalk.json');
  const proposedPath = path.resolve(root, 'data/master-model/proposed-master-model.json');
  const constructsJsonPath = path.resolve(root, 'data/constructs.json');

  // Verify file existence
  const requiredFiles = [
    { name: 'literature-screening-protocol.json', p: protocolPath },
    { name: 'master-model-sources.json', p: sourcesPath },
    { name: 'current-ontology-baseline.json', p: baselinePath },
    { name: 'candidate-constructs.json', p: candidatesPath },
    { name: 'overlap-analysis.json', p: overlapPath },
    { name: 'theoretical-lens-map.json', p: lensesPath },
    { name: 'current-to-master-crosswalk.json', p: crosswalkPath },
    { name: 'proposed-master-model.json', p: proposedPath },
    { name: 'data/constructs.json', p: constructsJsonPath },
  ];

  for (const file of requiredFiles) {
    if (!fs.existsSync(file.p)) {
      errors.push(`Missing required file: ${file.name}`);
    }
  }

  if (errors.length > 0) {
    return {
      success: false,
      metrics: {} as any,
      errors,
      warnings,
    };
  }

  // =========================================================================
  // 1. Source Registry Audit
  // =========================================================================
  const sourceList = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));
  const sourceIdSet = new Set<string>();
  const validSourceTypes = new Set([
    'EMPIRICAL_VALIDATION_STUDY',
    'PSYCHOMETRIC_SCALE_DEVELOPMENT',
    'TURKISH_PSYCHOMETRIC_ADAPTATION',
    'TURKISH_ADAPTATION_STUDY',
    'TURKISH_LEXICAL_STUDY',
    'TURKISH_THEORETICAL_MODEL',
    'THEORETICAL_FOUNDATION_CLASSIC',
    'THEORETICAL_SYNTHESIS_PAPER',
    'THEORETICAL_FOUNDATION_BOOK',
    'SYSTEMATIC_REVIEW_META_ANALYSIS',
    'STANDARDIZED_TEST_MANUAL',
    'OPEN_SCIENCE_LICENSING_DOC',
    'PUBLIC_DOMAIN_ARCHIVE',
    'OFFICIAL_INSTRUMENT_DOCUMENTATION',
    'LICENSING_TERMS_STATEMENT',
    'CLINICAL_CLASSIFICATION_STANDARD',
  ]);

  if (!Array.isArray(sourceList) || sourceList.length === 0) {
    errors.push('master-model-sources.json must be a non-empty array');
  } else {
    for (const src of sourceList) {
      if (!src.sourceId) {
        errors.push(`Source missing sourceId: ${JSON.stringify(src)}`);
        continue;
      }
      if (sourceIdSet.has(src.sourceId)) {
        errors.push(`Duplicate sourceId: ${src.sourceId}`);
      }
      sourceIdSet.add(src.sourceId);

      if (!validSourceTypes.has(src.sourceType)) {
        errors.push(`Source ${src.sourceId} has invalid sourceType: ${src.sourceType}`);
      }
      if (!src.title || !src.authors || !src.year) {
        errors.push(`Source ${src.sourceId} missing required metadata (title, authors, or year)`);
      }
      if (src.verificationStatus !== 'VERIFIED_PRIMARY' && src.verificationStatus !== 'VERIFIED_SECONDARY') {
        errors.push(`Source ${src.sourceId} has invalid verificationStatus: ${src.verificationStatus}`);
      }
    }
  }

  // =========================================================================
  // 2. Current Ontology Baseline Audit
  // =========================================================================
  const baselineData = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
  const currentConstructsJson = JSON.parse(fs.readFileSync(constructsJsonPath, 'utf8'));

  const baselineFacetIds = new Set((baselineData.facets || []).map((f: any) => f.facetId));
  const currentFacetIds = new Set(currentConstructsJson.map((c: any) => c.facetId));
  const baselineConstructIds = new Set((baselineData.constructs || []).map((c: any) => c.constructId));
  const baselineDomainIds = new Set((baselineData.domains || []).map((d: any) => d.domainId));

  if (baselineFacetIds.size !== 84) {
    errors.push(`Current ontology baseline facets count is ${baselineFacetIds.size}, expected 84`);
  }
  if (baselineConstructIds.size !== 30) {
    errors.push(`Current ontology baseline constructs count is ${baselineConstructIds.size}, expected 30`);
  }
  if (baselineDomainIds.size !== 9) {
    errors.push(`Current ontology baseline domains count is ${baselineDomainIds.size}, expected 9`);
  }

  // Invariant: data/constructs.json must match baseline exactly (zero mutations)
  if (currentFacetIds.size !== 84) {
    errors.push(`Production constructs.json facet count mutated! Found ${currentFacetIds.size}, expected 84`);
  }
  for (const fId of baselineFacetIds) {
    if (!currentFacetIds.has(fId)) {
      errors.push(`Production constructs.json missing facet: ${fId}`);
    }
  }

  // =========================================================================
  // 3. Candidate Constructs Audit
  // =========================================================================
  const candidateList = JSON.parse(fs.readFileSync(candidatesPath, 'utf8'));
  const candidateIdSet = new Set<string>();

  const validEntityTypes = new Set([
    'DOMAIN',
    'CONSTRUCT',
    'FACET',
    'DERIVED_INDEX',
    'MEASUREMENT_INTEGRITY_TELEMETRY',
    'THEORETICAL_LENS',
    'OBSERVATIONAL_AI',
    'CLINICAL_SCREENER',
  ]);

  const validClinicalSafety = new Set([
    'NON_CLINICAL',
    'CLINICAL_SCREENER_RESEARCH_ONLY',
    'HIGH_RISK_EXCLUDE_FROM_PRODUCTION_SCORING',
  ]);

  const validTurkishStatus = new Set([
    'VALIDATED_DIRECT',
    'ADAPTATION_STUDY_PUBLISHED',
    'INDIRECT_GENERAL_POPULATION_EVIDENCE',
    'NO_REPRESENTATIVE_TURKISH_EVIDENCE',
    'NEEDS_EMPIRICAL_EVALUATION',
  ]);

  const validMeasurementModes = new Set([
    'DIRECT_PSYCHOMETRIC_ITEM_BANK',
    'DERIVED_COMPUTED_INDEX',
    'TELEMETRY_RESPONSE_LATENCY_DERIVED',
    'BEHAVIORAL_METRICS',
    'OBSERVATIONAL_AI_INTERVIEW_ONLY',
    'THEORETICAL_INTERPRETIVE_LENS_ONLY',
    'CLINICAL_SCREENER_ONLY',
  ]);

  const validDecisions = new Set([
    'ACCEPTED_CORE',
    'ACCEPTED_EXPANSION',
    'MERGED_INTO_EXISTING',
    'EXCLUDED_CLINICAL_SAFETY',
    'EXCLUDED_COMMERCIAL_BARRIER',
    'EXCLUDED_NON_CONSTRUCT',
    'EXCLUDED_THEORETICAL_UNFALSIFIABLE',
    'DEFERRED_FOR_RESEARCH',
  ]);

  let acceptedCore = 0;
  let acceptedExpansion = 0;
  let mergedCount = 0;
  let excludedCount = 0;
  let deferredCount = 0;

  for (const cand of candidateList) {
    if (!cand.candidateId) {
      errors.push(`Candidate missing candidateId: ${JSON.stringify(cand)}`);
      continue;
    }
    if (candidateIdSet.has(cand.candidateId)) {
      errors.push(`Duplicate candidate id: ${cand.candidateId}`);
    }
    candidateIdSet.add(cand.candidateId);

    if (!validEntityTypes.has(cand.entityType)) {
      errors.push(`Candidate ${cand.candidateId} has invalid entityType: ${cand.entityType}`);
    }
    if (!validClinicalSafety.has(cand.clinicalSafetyClass)) {
      errors.push(`Candidate ${cand.candidateId} has invalid clinicalSafetyClass: ${cand.clinicalSafetyClass}`);
    }
    if (!validTurkishStatus.has(cand.turkishEvidenceStatus)) {
      errors.push(`Candidate ${cand.candidateId} has invalid turkishEvidenceStatus: ${cand.turkishEvidenceStatus}`);
    }
    if (!validMeasurementModes.has(cand.measurementMode)) {
      errors.push(`Candidate ${cand.candidateId} has invalid measurementMode: ${cand.measurementMode}`);
    }
    if (!validDecisions.has(cand.finalConsolidationDecision)) {
      errors.push(`Candidate ${cand.candidateId} has invalid finalConsolidationDecision: ${cand.finalConsolidationDecision}`);
    }

    // Tally decisions
    if (cand.finalConsolidationDecision === 'ACCEPTED_CORE') acceptedCore++;
    else if (cand.finalConsolidationDecision === 'ACCEPTED_EXPANSION') acceptedExpansion++;
    else if (cand.finalConsolidationDecision === 'MERGED_INTO_EXISTING') mergedCount++;
    else if (cand.finalConsolidationDecision.startsWith('EXCLUDED_')) excludedCount++;
    else if (cand.finalConsolidationDecision === 'DEFERRED_FOR_RESEARCH') deferredCount++;

    // Decision rationale check
    if (!cand.decisionRationale || cand.decisionRationale.trim().length < 10) {
      errors.push(`Candidate ${cand.candidateId} missing substantive decisionRationale`);
    }

    // Key sources reference check
    if (cand.keySources && Array.isArray(cand.keySources)) {
      for (const srcId of cand.keySources) {
        if (!sourceIdSet.has(srcId)) {
          errors.push(`Candidate ${cand.candidateId} references non-existent keySource: ${srcId}`);
        }
      }
    }

    // Invariant: Theoretical frameworks must not be direct psychometric item banks or core
    if (cand.entityType === 'THEORETICAL_LENS') {
      if (cand.measurementMode === 'DIRECT_PSYCHOMETRIC_ITEM_BANK') {
        errors.push(`Theoretical lens candidate ${cand.candidateId} cannot have DIRECT_PSYCHOMETRIC_ITEM_BANK mode`);
      }
      if (cand.finalConsolidationDecision === 'ACCEPTED_CORE') {
        errors.push(`Theoretical lens candidate ${cand.candidateId} cannot be ACCEPTED_CORE`);
      }
    }

    // Invariant: High risk clinical constructs must be excluded from production scoring
    if (cand.clinicalSafetyClass === 'HIGH_RISK_EXCLUDE_FROM_PRODUCTION_SCORING') {
      if (cand.finalConsolidationDecision === 'ACCEPTED_CORE' || cand.finalConsolidationDecision === 'ACCEPTED_EXPANSION') {
        errors.push(`High risk clinical candidate ${cand.candidateId} cannot be included in production scoring`);
      }
    }

    // Invariant: Non-numeric overlap strings check in rationales
    const fakeOverlapPattern = /\b\d{1,3}%\s*overlap/i;
    if (fakeOverlapPattern.test(cand.decisionRationale || '')) {
      errors.push(`Candidate ${cand.candidateId} decisionRationale contains forbidden fake numeric overlap percentage`);
    }
  }

  // =========================================================================
  // 4. Overlap Analysis Audit
  // =========================================================================
  const overlapList = JSON.parse(fs.readFileSync(overlapPath, 'utf8'));
  const validOverlapTypes = new Set([
    'PARTIALLY_CONVERGENT',
    'FACET_OF',
    'DIFFERENT_THEORETICAL_FRAMEWORK_SAME_PHENOMENON',
    'HIGHER_ORDER_FACTOR',
    'DISTINCT_SURFACE_SIMILAR',
  ]);
  const validDirections = new Set([
    'B_SUBSUMES_A',
    'A_SUBSUMES_B',
    'SYMMETRIC_CONVERGENCE',
    'A_IS_FACET_OF_B',
    'B_IS_FACET_OF_A',
    'DIFFERENT_GRANULARITY_PARALLEL',
  ]);
  const validResolutions = new Set([
    'RETAIN_BOTH_SEPARATE',
    'MERGE_B_INTO_A',
    'MERGE_A_INTO_B',
    'RELEGATE_B_TO_FACET_OF_A',
    'RELEGATE_A_TO_FACET_OF_B',
    'KEEP_A_AS_PSYCHOMETRIC_KEEP_B_AS_LENS',
    'EXCLUDE_B_CLINICAL',
    'EXCLUDE_B_PROPRIETARY',
  ]);

  if (!Array.isArray(overlapList) || overlapList.length === 0) {
    errors.push('overlap-analysis.json must be a non-empty array');
  } else {
    for (const pair of overlapList) {
      if (!candidateIdSet.has(pair.constructA)) {
        errors.push(`Overlap pair references unknown constructA: ${pair.constructA}`);
      }
      if (!candidateIdSet.has(pair.constructB)) {
        errors.push(`Overlap pair references unknown constructB: ${pair.constructB}`);
      }
      if (!validOverlapTypes.has(pair.overlapType)) {
        errors.push(`Overlap pair ${pair.constructA}-${pair.constructB} has invalid overlapType: ${pair.overlapType}`);
      }
      if (!validDirections.has(pair.relationDirection)) {
        errors.push(`Overlap pair ${pair.constructA}-${pair.constructB} has invalid relationDirection: ${pair.relationDirection}`);
      }
      if (!validResolutions.has(pair.resolutionDecision)) {
        errors.push(`Overlap pair ${pair.constructA}-${pair.constructB} has invalid resolutionDecision: ${pair.resolutionDecision}`);
      }
      if (!pair.substantiveRationale || pair.substantiveRationale.trim().length < 10) {
        errors.push(`Overlap pair ${pair.constructA}-${pair.constructB} missing substantive rationale`);
      }
      if (pair.sourceIds && Array.isArray(pair.sourceIds)) {
        for (const sId of pair.sourceIds) {
          if (!sourceIdSet.has(sId)) {
            errors.push(`Overlap pair ${pair.pairId} references non-existent sourceId: ${sId}`);
          }
        }
      }
    }
  }

  // =========================================================================
  // 5. Theoretical Lens Map Audit
  // =========================================================================
  const lensList = JSON.parse(fs.readFileSync(lensesPath, 'utf8'));
  let totalLensMappings = 0;

  if (!Array.isArray(lensList) || lensList.length === 0) {
    errors.push('theoretical-lens-map.json must be a non-empty array');
  } else {
    for (const lens of lensList) {
      if (!lens.lensId || !lens.historicalFigure || !lens.theoreticalFrameworkName) {
        errors.push(`Lens missing required metadata: ${JSON.stringify(lens)}`);
      }
      if (!lens.mappedModernConstructs || !Array.isArray(lens.mappedModernConstructs)) {
        errors.push(`Lens ${lens.lensId} missing mappedModernConstructs array`);
      } else {
        totalLensMappings += lens.mappedModernConstructs.length;
        for (const cId of lens.mappedModernConstructs) {
          if (!candidateIdSet.has(cId)) {
            errors.push(`Lens ${lens.lensId} references unknown candidate: ${cId}`);
          }
        }
      }
      if (lens.isSyntheticTraitScore !== false) {
        errors.push(`Lens ${lens.lensId} MUST have isSyntheticTraitScore === false`);
      }
      if (lens.directionality !== 'MODERN_TO_HISTORICAL_INTERPRETIVE') {
        errors.push(`Lens ${lens.lensId} has invalid directionality: ${lens.directionality}`);
      }
      if (!lens.prohibitedClaims || lens.prohibitedClaims.length === 0) {
        errors.push(`Lens ${lens.lensId} missing prohibitedClaims safety rules`);
      }
      if (lens.references && Array.isArray(lens.references)) {
        for (const rId of lens.references) {
          if (!sourceIdSet.has(rId)) {
            errors.push(`Lens ${lens.lensId} references non-existent source: ${rId}`);
          }
        }
      }
    }
  }

  // =========================================================================
  // 6. Crosswalk Audit
  // =========================================================================
  const crosswalkList = JSON.parse(fs.readFileSync(crosswalkPath, 'utf8'));
  const crosswalkConstructs = new Set<string>();
  const crosswalkFacets = new Set<string>();

  if (!Array.isArray(crosswalkList) || crosswalkList.length !== 114) {
    errors.push(`current-to-master-crosswalk.json expected 114 entries (30 constructs + 84 facets), found ${crosswalkList?.length}`);
  } else {
    for (const entry of crosswalkList) {
      if (entry.currentEntityType === 'CONSTRUCT') {
        crosswalkConstructs.add(entry.currentEntityId);
      } else if (entry.currentEntityType === 'FACET') {
        crosswalkFacets.add(entry.currentEntityId);
      }

      if (!entry.targetMasterEntityIds || entry.targetMasterEntityIds.length === 0) {
        errors.push(`Crosswalk entry ${entry.currentEntityId} has empty targetMasterEntityIds`);
      } else {
        for (const targetId of entry.targetMasterEntityIds) {
          if (!candidateIdSet.has(targetId)) {
            errors.push(`Crosswalk entry ${entry.currentEntityId} references unknown target candidate: ${targetId}`);
          }
        }
      }

      if (entry.evidenceSourceIds && Array.isArray(entry.evidenceSourceIds)) {
        for (const sId of entry.evidenceSourceIds) {
          if (!sourceIdSet.has(sId)) {
            errors.push(`Crosswalk entry ${entry.currentEntityId} references non-existent evidenceSourceId: ${sId}`);
          }
        }
      }
    }

    // Verify all 30 baseline constructs and 84 baseline facets are mapped
    for (const cId of baselineConstructIds) {
      if (!crosswalkConstructs.has(cId)) {
        errors.push(`Crosswalk missing mapping for current construct: ${cId}`);
      }
    }
    for (const fId of baselineFacetIds) {
      if (!crosswalkFacets.has(fId)) {
        errors.push(`Crosswalk missing mapping for current facet: ${fId}`);
      }
    }
  }

  // =========================================================================
  // 7. Proposed Master Model Audit
  // =========================================================================
  const proposedData = JSON.parse(fs.readFileSync(proposedPath, 'utf8'));
  const proposedDomains = proposedData.domains || [];
  const telemetryMetrics = proposedData.responseIntegrityTelemetry || [];
  const derivedIndices = proposedData.derivedIndices || [];

  let proposedConstructsCount = 0;
  let proposedFacetsCount = 0;
  let p0Count = 0;
  let p1Count = 0;
  let p2Count = 0;
  let p3Count = 0;

  const validPriorities = new Set(['P0', 'P1', 'P2', 'P3']);

  for (const dom of proposedDomains) {
    if (!dom.domainId || !dom.domainNameEn) {
      errors.push(`Proposed domain missing id or name: ${JSON.stringify(dom)}`);
    }
    if (dom.constructs && Array.isArray(dom.constructs)) {
      for (const con of dom.constructs) {
        proposedConstructsCount++;
        if (!validPriorities.has(con.priority)) {
          errors.push(`Proposed construct ${con.constructId} has invalid priority: ${con.priority}`);
        }
        if (con.priority === 'P0') p0Count++;
        else if (con.priority === 'P1') p1Count++;
        else if (con.priority === 'P2') p2Count++;
        else if (con.priority === 'P3') p3Count++;

        if (con.facets && Array.isArray(con.facets)) {
          proposedFacetsCount += con.facets.length;
        }
      }
    }
  }

  const success = errors.length === 0;

  const metrics = {
    totalCandidateConstructs: candidateList.length,
    acceptedCoreCandidates: acceptedCore,
    acceptedExpansionCandidates: acceptedExpansion,
    mergedCandidates: mergedCount,
    excludedCandidates: excludedCount,
    deferredCandidates: deferredCount,
    totalSources: sourceList.length,
    totalOverlapPairs: overlapList.length,
    totalTheoreticalLenses: lensList.length,
    totalTheoreticalLensMappings: totalLensMappings,
    currentOntologyDomains: baselineDomainIds.size,
    currentOntologyConstructs: baselineConstructIds.size,
    currentOntologyFacets: baselineFacetIds.size,
    crosswalkConstructCoverage: crosswalkConstructs.size,
    crosswalkFacetCoverage: crosswalkFacets.size,
    proposedMasterDomains: proposedDomains.length,
    proposedMasterConstructs: proposedConstructsCount,
    proposedMasterFacets: proposedFacetsCount,
    responseIntegrityMetrics: telemetryMetrics.length,
    derivedIndicesCount: derivedIndices.length,
    p0CoreConstructs: p0Count,
    p1ExpansionConstructs: p1Count,
    p2ResearchConstructs: p2Count,
    p3ObservationalConstructs: p3Count,
  };

  return {
    success,
    metrics,
    errors,
    warnings,
  };
}

// CLI Execution
if (require.main === module) {
  console.log('='.repeat(60));
  console.log('PSYCHE-AI MASTER PSYCHOLOGICAL MODEL AUDIT (FAZ 2.14)');
  console.log('='.repeat(60));

  const result = runMasterModelAudit();

  console.log('\n--- Model Metrics ---');
  console.log(`Candidate Constructs Evaluated: ${result.metrics.totalCandidateConstructs}`);
  console.log(`  - Accepted Core (P0):          ${result.metrics.acceptedCoreCandidates}`);
  console.log(`  - Accepted Expansion (P1):     ${result.metrics.acceptedExpansionCandidates}`);
  console.log(`  - Merged into Existing:        ${result.metrics.mergedCandidates}`);
  console.log(`  - Excluded (Safety/Barrier):   ${result.metrics.excludedCandidates}`);
  console.log(`  - Deferred for Research:       ${result.metrics.deferredCandidates}`);
  console.log(`Master Model Sources:            ${result.metrics.totalSources}`);
  console.log(`Directional Overlap Pairs:       ${result.metrics.totalOverlapPairs}`);
  console.log(`Theoretical Lenses Mapped:       ${result.metrics.totalTheoreticalLenses} lenses (${result.metrics.totalTheoreticalLensMappings} construct links)`);
  console.log(`Current Baseline Coverage:       ${result.metrics.crosswalkConstructCoverage}/30 constructs, ${result.metrics.crosswalkFacetCoverage}/84 facets (100%)`);
  console.log(`Proposed Master Domains:         ${result.metrics.proposedMasterDomains}`);
  console.log(`Proposed Master Constructs:      ${result.metrics.proposedMasterConstructs} (P0: ${result.metrics.p0CoreConstructs}, P1: ${result.metrics.p1ExpansionConstructs}, P2: ${result.metrics.p2ResearchConstructs}, P3: ${result.metrics.p3ObservationalConstructs})`);
  console.log(`Proposed Master Facets:          ${result.metrics.proposedMasterFacets}`);
  console.log(`Response Telemetry Metrics:      ${result.metrics.responseIntegrityMetrics}`);
  console.log(`Derived Profile Indices:         ${result.metrics.derivedIndicesCount}`);

  if (result.warnings.length > 0) {
    console.log('\n--- Warnings ---');
    result.warnings.forEach((w) => console.warn(`[WARN] ${w}`));
  }

  if (result.errors.length > 0) {
    console.error('\n--- Audit Violations Found ---');
    result.errors.forEach((e) => console.error(`[FAIL] ${e}`));
    console.log('\n' + '='.repeat(60));
    console.error(`AUDIT FAILED with ${result.errors.length} error(s).`);
    console.log('='.repeat(60));
    process.exit(1);
  } else {
    console.log('\n' + '='.repeat(60));
    console.log('AUDIT PASSED — ALL INVARIANTS & INTEGRITY CONSTRAINTS VERIFIED.');
    console.log('='.repeat(60));
    process.exit(0);
  }
}
