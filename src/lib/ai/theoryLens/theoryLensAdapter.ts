/**
 * PsycheAI Theory Lens Evidence Adapter (FAZ 2.18 Preparation for FAZ 2.19)
 *
 * Normalizes profile evidence for consumption by future Theoretical Lenses.
 *
 * INVARIANT: Does NOT implement or trigger any theoretical personas
 * (Freud, Jung, Adler, Rogers, Maslow, Skinner, Beck, Frankl) in FAZ 2.18.
 */

import { ProfileEvidenceBundleV2 } from '@/lib/profile/profileEvidenceBundle';
import { TheoryLensEvidenceBundle } from '@/types/aiInsightV2';

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
