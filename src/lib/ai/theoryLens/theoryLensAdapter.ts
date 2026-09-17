/**
 * PsycheAI Theory Lens Evidence Adapter (FAZ 2.19)
 *
 * Normalizes and scopes profile evidence for consumption by Theoretical Lenses.
 *
 * Strict Invariants:
 * - Deterministic psychometric profile is authoritative ground truth.
 * - Theories consume scoped evidence without altering scores or inventing missing facets.
 * - Epistemic provenance is attached to each facet.
 */

import { UnifiedPsychologicalProfileV2 } from '@/types/unifiedProfileV2';
import { ProfileEvidenceBundleV2 } from '@/lib/profile/profileEvidenceBundle';
import {
  TheoryLensId,
  ScopedLensEvidenceBundle,
  GroundedFacetDetail,
} from '@/types/theoryLens';
import { TheoryLensEvidenceBundle } from '@/types/aiInsightV2';
import { getTheoryLens, getTheorySourcesForLens } from './theoryLensRegistry';

/**
 * Backward compatibility export for FAZ 2.18 bundle format
 */
export function exportTheoryLensEvidenceBundle(
  bundle: ProfileEvidenceBundleV2
): TheoryLensEvidenceBundle {
  return {
    bundleVersion: '2.0.0',
    generatedAt: bundle.generatedAt,
    userId: bundle.userId,
    measurementModelVersion: 'PSYCHEAI_MASTER_MODEL_V1',
    batteryVersion: 'NATIVE_RESEARCH_BATTERY_V1',
    measuredFacets: bundle.measuredFacets.map((f) => ({
      facetId: f.facetId,
      code: f.code,
      nameTr: f.nameTr,
      domainId: f.domainId,
      constructId: f.constructId,
      score: f.score,
      epistemicStatus: f.epistemicStatus,
    })),
    crossDomainPatterns: bundle.crossDomainPatterns.map((p) => ({
      id: p.id,
      titleTr: p.titleTr,
      sourceFacetIds: p.sourceFacetIds,
      epistemicStatus: p.epistemicStatus,
    })),
    tensions: bundle.tensions.map((t) => ({
      id: t.id,
      titleTr: t.titleTr,
      sourceFacetIds: t.sourceFacetIds,
      epistemicStatus: t.epistemicStatus,
    })),
    synergies: bundle.synergies.map((s) => ({
      id: s.id,
      titleTr: s.titleTr,
      sourceFacetIds: s.sourceFacetIds,
      epistemicStatus: s.epistemicStatus,
    })),
    measurementStatus: bundle.measurementStatuses,
    governanceNotice:
      'Theoretical lenses in FAZ 2.19 MUST consume this normalized bundle strictly as interpretive context and MUST NEVER alter underlying psychometric scores.',
  };
}

/**
 * Builds a Scoped Lens Evidence Bundle tailored to a specific theoretical framework.
 */
export function buildScopedLensEvidenceBundle(
  profile: UnifiedPsychologicalProfileV2,
  lensId: TheoryLensId
): ScopedLensEvidenceBundle {
  const lens = getTheoryLens(lensId);
  const sources = getTheorySourcesForLens(lensId);

  if (!lens) {
    throw new Error(`Theory lens not found: ${lensId}`);
  }

  // Collect target facet IDs / domain IDs from mappings
  const targetFacetCodes = new Set<string>();
  const targetDomainCodes = new Set<string>();

  for (const mapping of lens.allowedConceptMappings) {
    if (mapping.targetFacetIds) {
      mapping.targetFacetIds.forEach((id) => targetFacetCodes.add(id.toLowerCase()));
    }
    if (mapping.targetDomainCodes) {
      mapping.targetDomainCodes.forEach((d) => targetDomainCodes.add(d.toLowerCase()));
    }
  }

  // Map domain IDs to display names
  const domainMap = new Map<string, string>();
  for (const d of profile.domains) {
    domainMap.set(d.domainId, d.nameTr);
    domainMap.set(d.code, d.nameTr);
  }

  // Find measured facets relevant to this lens
  const scopedFacets: GroundedFacetDetail[] = [];
  const measuredFacetCodes = new Set<string>();

  // First pass: facets directly mapped or belonging to target domains
  for (const facet of profile.facets) {
    if (facet.measurementStatus === 'MEASURED_PRECALIBRATION' && facet.score !== null) {
      const facetCodeLower = facet.code.toLowerCase();
      const facetIdLower = facet.facetId.toLowerCase();
      const domainIdLower = facet.domainId.toLowerCase();

      const isDirectlyMapped =
        targetFacetCodes.has(facetCodeLower) || targetFacetCodes.has(facetIdLower);
      const isDomainMapped = targetDomainCodes.has(domainIdLower);

      if (isDirectlyMapped || isDomainMapped || targetDomainCodes.size === 0) {
        scopedFacets.push({
          code: facet.code,
          nameTr: facet.nameTr,
          domainNameTr: domainMap.get(facet.domainId) || facet.domainId,
          bandLabelTr: facet.bandInfo?.shortLabelTr || 'Dengeli',
          score: facet.score,
          epistemicStatus: facet.epistemicStatus,
        });
        measuredFacetCodes.add(facet.facetId);
        measuredFacetCodes.add(facet.code);
      }
    }
  }

  // If scopedFacets is empty (e.g., target domain unmeasured), include all measured facets as broad context
  if (scopedFacets.length === 0) {
    for (const facet of profile.facets) {
      if (facet.measurementStatus === 'MEASURED_PRECALIBRATION' && facet.score !== null) {
        scopedFacets.push({
          code: facet.code,
          nameTr: facet.nameTr,
          domainNameTr: domainMap.get(facet.domainId) || facet.domainId,
          bandLabelTr: facet.bandInfo?.shortLabelTr || 'Dengeli',
          score: facet.score,
          epistemicStatus: facet.epistemicStatus,
        });
        measuredFacetCodes.add(facet.facetId);
        measuredFacetCodes.add(facet.code);
      }
    }
  }

  // Filter tensions & synergies relevant to measured facets
  const activatedTensions = profile.tensions.map((t) => ({
    id: t.id,
    titleTr: t.titleTr,
    sourceFacetIds: t.sourceFacetIds,
    epistemicStatus: t.epistemicStatus,
  }));

  const activatedSynergies = profile.synergies.map((s) => ({
    id: s.id,
    titleTr: s.titleTr,
    sourceFacetIds: s.sourceFacetIds,
    epistemicStatus: s.epistemicStatus,
  }));

  const activatedPatterns = profile.crossDomainPatterns.map((p) => ({
    id: p.id,
    titleTr: p.titleTr,
    sourceFacetIds: p.sourceFacetIds,
    epistemicStatus: p.epistemicStatus,
  }));

  // Check unmeasured target domains
  let unmeasuredAreasWarningTr: string | undefined;
  const unmeasuredTargetDomains: string[] = [];
  for (const domainCode of targetDomainCodes) {
    const d = profile.domains.find(
      (dom) => dom.code.toLowerCase() === domainCode || dom.domainId.toLowerCase() === domainCode
    );
    if (d && d.measuredFacetCount === 0) {
      unmeasuredTargetDomains.push(d.nameTr);
    }
  }

  if (unmeasuredTargetDomains.length > 0) {
    unmeasuredAreasWarningTr = `Bu kuramsal merceğin doğrudan odaklandığı bazı alanlar (${unmeasuredTargetDomains.join(
      ', '
    )}) henüz ölçülmemiştir. Yorumlar mevcut tamamlanmış modüllerdeki bulgularla sınırlandırılmıştır.`;
  }

  return {
    lensId: lens.lensId,
    lensDisplayNameTr: lens.displayNameTr,
    theoristName: lens.theoristName,
    generatedAt: profile.generatedAt,
    userId: profile.userId,
    coverageRatio: profile.coverage?.facetCoverage?.ratio ?? 0,
    measuredFacetCount: profile.coverage?.facetCoverage?.measuredCount ?? 0,
    totalFacetCount: profile.coverage?.facetCoverage?.totalCount ?? 91,
    scopedFacets,
    activatedPatterns,
    activatedTensions,
    activatedSynergies,
    relevantConcepts: lens.coreConcepts,
    sources,
    unmeasuredAreasWarningTr,
  };
}
