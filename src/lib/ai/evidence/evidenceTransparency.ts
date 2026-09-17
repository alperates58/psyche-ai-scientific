import { AIInsightV2, EvidenceTransparencyInfo } from '@/types/aiInsightV2';
import { ProfileEvidenceBundleV2 } from '@/lib/profile/profileEvidenceBundle';

/**
 * Generates user-facing evidence transparency details ("Bu yorum neye dayanıyor?").
 * Pure client-safe function operating only on the insight and ProfileEvidenceBundleV2.
 */
export function getEvidenceTransparencyInfo(
  insight: AIInsightV2,
  bundle: ProfileEvidenceBundleV2
): EvidenceTransparencyInfo {
  const referencedFacetIds = new Set<string>();

  for (const ref of insight.evidenceRefs) {
    if (ref.startsWith('ev_facet_')) {
      referencedFacetIds.add(ref.replace('ev_facet_', ''));
    } else if (bundle.measuredFacets.some((f) => f.facetId === ref)) {
      referencedFacetIds.add(ref);
    }
  }

  const dimensions = Array.from(referencedFacetIds).map((id) => {
    const facet = bundle.measuredFacets.find((f) => f.facetId === id);
    const entry = bundle.evidenceEntries.find(
      (e) => e.type === 'FACET_SCORE' && e.targetId === id
    );

    return {
      facetId: id,
      code: facet?.code || id,
      nameTr: facet?.nameTr || entry?.titleTr || id,
      domainNameTr: facet?.domainId || 'Kişilik & Benlik',
      score: facet?.score ?? null,
      bandLabelTr: facet?.band || 'Ölçüldü',
      status: facet?.epistemicStatus || 'MEASURED_PRECALIBRATION',
      scientificRationaleTr: entry?.scientificRationaleTr,
    };
  });

  const sourceModules = bundle.measuredFacets
    .filter((f) => referencedFacetIds.has(f.facetId))
    .flatMap((f) => f.sourceSessionIds)
    .map((sId) => ({
      moduleCode: 'BATTERY_MODULE',
      titleTr: 'PsycheAI Bilimsel Araştırma Bataryası',
    }));

  return {
    insightId: insight.insightId,
    titleTr: insight.titleTr,
    claimStrength: insight.claimStrength,
    dimensions,
    sourceModules: sourceModules.slice(0, 3),
    coverageContextTr: `11 psikolojik alanın %${(bundle.coverage.facetCoverage.ratio * 100).toFixed(0)}'i ölçülmüştür.`,
    responseQualityNoteTr:
      bundle.responseQuality.overallFlag === 'EXCELLENT' || bundle.responseQuality.overallFlag === 'ACCEPTABLE'
        ? 'Yanıt örüntüleri yüksek geçerlilik kriterlerini karşılamaktadır.'
        : 'Yanıt süreleri veya örüntüleri temkinli yorumlamayı gerektirir.',
    limitationsTr: insight.limitations,
  };
}
