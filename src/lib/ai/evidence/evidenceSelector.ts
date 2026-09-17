/**
 * PsycheAI Evidence Selection Layer (Minimum Necessary Data Principle)
 *
 * Selects only the minimal necessary, already-resolved psychological evidence
 * required for the requested interpretation scope.
 *
 * Strict Privacy & Grounding Rules:
 * - NO raw item answers or questions sent.
 * - NO user personally identifying information (name, email, IP, user ID).
 * - NO unmeasured facets included as measured data.
 * - Non-relevant domains are excluded when targeted insights are requested.
 */

import { ProfileEvidenceBundleV2 } from '@/lib/profile/profileEvidenceBundle';
import { InsightType } from '@/types/aiInsightV2';

export interface EvidenceSelectionRequest {
  requestType: InsightType;
  targetDomainIds?: string[];
  targetConstructIds?: string[];
  targetFacetIds?: string[];
  targetModuleCode?: string;
}

export interface SelectedFacetEvidence {
  facetId: string;
  code: string;
  nameTr: string;
  domainId: string;
  constructId: string;
  score: number;
  band: string;
  epistemicStatus: string;
  scientificDefinitionTr?: string;
}

export interface SelectedEvidencePayload {
  requestType: InsightType;
  selectedFacets: SelectedFacetEvidence[];
  selectedConstructs: Array<{
    constructId: string;
    nameTr: string;
    domainId: string;
    constructScore: number | null;
    aggregationStatus: string;
  }>;
  selectedTensions: Array<{
    id: string;
    titleTr: string;
    descriptionTr: string;
    sourceFacetIds: string[];
    sourceFacetNamesTr: string[];
  }>;
  selectedSynergies: Array<{
    id: string;
    titleTr: string;
    descriptionTr: string;
    sourceFacetIds: string[];
    sourceFacetNamesTr: string[];
  }>;
  selectedPatterns: Array<{
    id: string;
    titleTr: string;
    descriptionTr: string;
    sourceFacetIds: string[];
  }>;
  coverage: {
    facetCoverageRatio: number;
    facetCoveragePercentage: number;
    unmeasuredDomainNamesTr: string[];
    isUnmeasuredTarget: boolean;
  };
  responseQuality: {
    overallFlag: string;
    isClean: boolean;
    cautionRequired: boolean;
    cautionReasonsTr: string[];
  };
  longitudinal: {
    hasRepeatMeasurements: boolean;
    measurementEpochsCount: number;
  };
  allEvidenceIdsInScope: string[];
}

export function selectEvidenceForInterpretation(
  bundle: ProfileEvidenceBundleV2,
  request: EvidenceSelectionRequest
): SelectedEvidencePayload {
  const { requestType, targetDomainIds, targetConstructIds, targetFacetIds } = request;

  // 1. Determine facet IDs in scope
  let isTargeted = false;
  const targetFacetIdSet = new Set<string>();

  if (targetFacetIds && targetFacetIds.length > 0) {
    isTargeted = true;
    targetFacetIds.forEach((id) => targetFacetIdSet.add(id));
  }

  if (targetConstructIds && targetConstructIds.length > 0) {
    isTargeted = true;
    for (const f of bundle.measuredFacets) {
      if (targetConstructIds.includes(f.constructId)) {
        targetFacetIdSet.add(f.facetId);
      }
    }
  }

  if (targetDomainIds && targetDomainIds.length > 0) {
    isTargeted = true;
    for (const f of bundle.measuredFacets) {
      if (targetDomainIds.includes(f.domainId)) {
        targetFacetIdSet.add(f.facetId);
      }
    }
  }

  // 2. Filter measured facets based on scope
  const filteredFacets = isTargeted
    ? bundle.measuredFacets.filter((f) => targetFacetIdSet.has(f.facetId))
    : bundle.measuredFacets;

  const selectedFacets: SelectedFacetEvidence[] = filteredFacets.map((f) => {
    const entry = bundle.evidenceEntries.find(
      (e) => e.type === 'FACET_SCORE' && e.targetId === f.facetId
    );
    return {
      facetId: f.facetId,
      code: f.code,
      nameTr: f.nameTr,
      domainId: f.domainId,
      constructId: f.constructId,
      score: f.score,
      band: f.band,
      epistemicStatus: f.epistemicStatus,
      scientificDefinitionTr: entry?.scientificRationaleTr,
    };
  });

  const selectedFacetIds = new Set(selectedFacets.map((f) => f.facetId));

  // 3. Filter construct patterns
  const selectedConstructs = bundle.constructPatterns
    .filter((c) => {
      if (!isTargeted) return true;
      if (targetDomainIds && targetDomainIds.includes(c.domainId)) return true;
      if (targetConstructIds && targetConstructIds.includes(c.constructId)) return true;
      return false;
    })
    .map((c) => ({
      constructId: c.constructId,
      nameTr: c.nameTr,
      domainId: c.domainId,
      constructScore: c.constructScore,
      aggregationStatus: c.aggregationStatus,
    }));

  // 4. Filter tensions in scope (where at least one source facet is in scope)
  const selectedTensions = bundle.tensions
    .filter((t) => {
      if (!isTargeted) return true;
      return t.sourceFacetIds.some((id) => selectedFacetIds.has(id));
    })
    .map((t) => ({
      id: t.id,
      titleTr: t.titleTr,
      descriptionTr: t.descriptionTr,
      sourceFacetIds: t.sourceFacetIds,
      sourceFacetNamesTr: t.sourceFacetNamesTr,
    }));

  // 5. Filter synergies in scope
  const selectedSynergies = bundle.synergies
    .filter((s) => {
      if (!isTargeted) return true;
      return s.sourceFacetIds.some((id) => selectedFacetIds.has(id));
    })
    .map((s) => ({
      id: s.id,
      titleTr: s.titleTr,
      descriptionTr: s.descriptionTr,
      sourceFacetIds: s.sourceFacetIds,
      sourceFacetNamesTr: s.sourceFacetNamesTr,
    }));

  // 6. Filter cross-domain patterns
  const selectedPatterns = bundle.crossDomainPatterns
    .filter((p) => {
      if (!isTargeted) return true;
      return p.sourceFacetIds.some((id) => selectedFacetIds.has(id));
    })
    .map((p) => ({
      id: p.id,
      titleTr: p.titleTr,
      descriptionTr: p.descriptionTr,
      sourceFacetIds: p.sourceFacetIds,
    }));

  // 7. Check if target is completely unmeasured
  const isUnmeasuredTarget = isTargeted && selectedFacets.length === 0;

  // 8. Collect all valid evidence IDs in scope
  const allEvidenceIdsInScope: string[] = [];
  for (const f of selectedFacets) {
    allEvidenceIdsInScope.push(`ev_facet_${f.facetId}`);
    allEvidenceIdsInScope.push(f.facetId);
  }
  for (const c of selectedConstructs) {
    allEvidenceIdsInScope.push(`ev_construct_${c.constructId}`);
    allEvidenceIdsInScope.push(c.constructId);
  }
  for (const t of selectedTensions) {
    allEvidenceIdsInScope.push(`ev_tension_${t.id}`);
    allEvidenceIdsInScope.push(t.id);
  }
  for (const s of selectedSynergies) {
    allEvidenceIdsInScope.push(`ev_synergy_${s.id}`);
    allEvidenceIdsInScope.push(s.id);
  }
  for (const p of selectedPatterns) {
    allEvidenceIdsInScope.push(p.id);
  }

  // 9. Coverage and response quality summaries
  const unmeasuredDomainNamesTr: string[] = [];
  if (bundle.coverage.domainCoverage.measuredCount < bundle.coverage.domainCoverage.totalCount) {
    // Collect unmeasured domains if applicable
  }

  const cautionRequired = bundle.responseQuality.overallFlag === 'QUESTIONABLE' ||
    bundle.responseQuality.overallFlag === 'COMPROMISED';

  return {
    requestType,
    selectedFacets,
    selectedConstructs,
    selectedTensions,
    selectedSynergies,
    selectedPatterns,
    coverage: {
      facetCoverageRatio: bundle.coverage.facetCoverage.ratio,
      facetCoveragePercentage: bundle.coverage.facetCoverage.percentage,
      unmeasuredDomainNamesTr,
      isUnmeasuredTarget,
    },
    responseQuality: {
      overallFlag: bundle.responseQuality.overallFlag,
      isClean: bundle.responseQuality.overallFlag === 'EXCELLENT' || bundle.responseQuality.overallFlag === 'ACCEPTABLE',
      cautionRequired,
      cautionReasonsTr: bundle.responseQuality.cautionsTr || [],
    },
    longitudinal: {
      hasRepeatMeasurements: false, // strictly false in single epoch baseline
      measurementEpochsCount: 1,
    },
    allEvidenceIdsInScope,
  };
}
