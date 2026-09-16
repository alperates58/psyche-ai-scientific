/**
 * PsycheAI Profile Confidence Evaluator
 * 
 * Implements an explicit conservative ordinal decision table for dimension-level confidence.
 * Strictly avoids hidden weighted numeric points or pseudo-statistical confidence percentages.
 * Transparently separates scientific instrument evidence, Turkish adaptation evidence,
 * calibration status, and response telemetry.
 */

import {
  DimensionConfidence,
  DimensionConfidenceLevel,
  DimensionUncertaintyItem,
  ProfileConfidenceMapViewModel,
  ProfileCompletenessSummary,
  TemporalStabilitySignal,
} from '@/types/confidence';

export interface EvaluateDimensionConfidenceParams {
  dimensionId: string;
  dimensionCode: string;
  dimensionNameTr: string;
  domainCode: string;
  domainNameTr: string;
  itemCount: number;
  responseQuality: 'EXCELLENT' | 'ACCEPTABLE' | 'QUESTIONABLE' | 'COMPROMISED';
  evidenceLevel?: string;
  hasTurkishEvidence?: boolean;
  instrumentName?: string;
  measurementCount?: number;
  temporalSignal?: TemporalStabilitySignal;
}

/**
 * Evaluates dimension confidence level via explicit ordinal decision table.
 * NO hidden weighted score (e.g., +20, +30) is used.
 */
export function deriveDimensionConfidence(
  params: EvaluateDimensionConfidenceParams
): DimensionConfidence {
  const {
    dimensionId,
    dimensionCode,
    dimensionNameTr,
    domainCode,
    domainNameTr,
    itemCount,
    responseQuality,
    evidenceLevel = 'DIRECT',
    hasTurkishEvidence = true,
    instrumentName = 'Geçerliği Belirlenmiş Ölçek',
    measurementCount = 1,
    temporalSignal = measurementCount > 1 ? 'REPEATED_CONSISTENT' : 'SINGLE_MEASUREMENT',
  } = params;

  // 1. Explicit Ordinal Decision Table
  let level: DimensionConfidenceLevel = 'LOW';
  let levelLabelTr = 'Düşük';

  if (responseQuality === 'COMPROMISED') {
    level = 'VERY_LOW';
    levelLabelTr = 'Çok Düşük';
  } else if (responseQuality === 'QUESTIONABLE') {
    level = 'LOW';
    levelLabelTr = 'Düşük (Telemetri Uyarısı)';
  } else if (itemCount <= 0) {
    level = 'VERY_LOW';
    levelLabelTr = 'Ölçülmedi';
  } else if (itemCount < 3) {
    // 1-2 items: initial/sparse probe
    level = 'LOW';
    levelLabelTr = 'Düşük (Kısa Form / 1-2 Madde)';
  } else if (itemCount >= 6) {
    // >= 6 items + clean telemetry
    level = 'HIGH';
    levelLabelTr = 'Yüksek';
  } else {
    // 3-5 items + clean telemetry
    level = 'MODERATE';
    levelLabelTr = 'Orta';
  }

  // 2. Derive Transparent Positive Factors
  const positiveFactors: string[] = [];

  if (itemCount >= 6) {
    positiveFactors.push(`Güçlü alt ölçek madde kapsamı (${itemCount} madde tamamlandı)`);
  } else if (itemCount >= 3) {
    positiveFactors.push(`Yeterli madde kapsamı (${itemCount} madde tamamlandı)`);
  } else if (itemCount > 0) {
    positiveFactors.push(`Ön tarama düzeyinde ${itemCount} madde tamamlandı`);
  }

  if (responseQuality === 'EXCELLENT') {
    positiveFactors.push('Yüksek yanıt kalitesi ve tutarlı yanıtlama süreleri');
  } else if (responseQuality === 'ACCEPTABLE') {
    positiveFactors.push('Kabul edilebilir ve tutarlı yanıt deseni');
  }

  if (hasTurkishEvidence) {
    positiveFactors.push('Türkçe psikometrik uyarlama ve literatür dayanağı mevcut');
  }

  if (temporalSignal === 'REPEATED_CONSISTENT') {
    positiveFactors.push('Tekrarlı ölçümlerde tutarlı puanlama deseni gözlendi');
  }

  // 3. Derive Explicit Uncertainties & Limiting Signals
  const uncertainties: DimensionUncertaintyItem[] = [];
  const missingSignals: string[] = [];

  // Calibration uncertainty (always present in pre-calibration)
  uncertainties.push({
    type: 'CALIBRATION_UNCERTAINTY',
    labelTr: 'Ön Kalibrasyon (Norm Yok)',
    descriptionTr: 'Bu ölçüm henüz temsili ulusal nüfus normlarıyla kalibre edilmemiştir; betimsel puan sunulur.',
  });
  missingSignals.push('Temsili ulusal norm kıyaslaması');

  // Temporal uncertainty
  if (temporalSignal === 'SINGLE_MEASUREMENT') {
    uncertainties.push({
      type: 'TEMPORAL_UNCERTAINTY',
      labelTr: 'Tekil Ölçüm',
      descriptionTr: 'Bu boyut tek bir oturumda ölçülmüştür; zaman içindeki kararlılık henüz değerlendirilmemiştir.',
    });
    missingSignals.push('Boylamsal tekrar testi');
  } else if (temporalSignal === 'REPEATED_VARIABLE') {
    uncertainties.push({
      type: 'TEMPORAL_UNCERTAINTY',
      labelTr: 'Zaman İçinde Değişkenlik',
      descriptionTr: 'Farklı oturumlarda puan değişkenliği saptandı; bağlamsal veya durumsal dalgalanmalar olabilir.',
    });
  }

  // Coverage uncertainty if low items
  if (itemCount > 0 && itemCount < 3) {
    uncertainties.push({
      type: 'MEASUREMENT_COVERAGE_UNCERTAINTY',
      labelTr: 'Kısıtlı Madde Sayısı',
      descriptionTr: `Bu alt boyut az sayıda maddeyle (${itemCount} madde) ölçülmüştür; ek ölçüm önerilir.`,
    });
    missingSignals.push('Genişletilmiş araştırma formu');
  }

  // Response quality uncertainty if flagged
  if (responseQuality === 'QUESTIONABLE' || responseQuality === 'COMPROMISED') {
    uncertainties.push({
      type: 'RESPONSE_QUALITY_UNCERTAINTY',
      labelTr: 'Telemetri Uyarısı',
      descriptionTr: 'Yanıtlama hızında veya düz yanıtlama deseninde dikkat işareti saptandı.',
    });
  }

  // 4. Construct Clear Explanation
  let explanationTr = '';
  if (level === 'HIGH') {
    explanationTr = `${itemCount} maddelik doğrudan ölçekleme ve tutarlı yanıt telemetrisi sayesinde ölçüm kanıt gücü yüksektir.`;
  } else if (level === 'MODERATE') {
    explanationTr = `${itemCount} maddelik ampirik ölçüm ve tutarlı yanıtlama deseni ile güvenilirdir.`;
  } else if (level === 'LOW') {
    explanationTr = itemCount < 3
      ? `Az sayıda madde (${itemCount} md.) ile ölçüldüğünden kanıt gücü başlangıç düzeyindedir; ek değerlendirme önerilir.`
      : 'Yanıt telemetrisindeki dikkat/hız uyarısı nedeniyle temkinli değerlendirilmelidir.';
  } else {
    explanationTr = 'Veri kalitesi veya madde sayısı yetersiz olduğundan güven düzeyi düşüktür.';
  }

  return {
    dimensionId,
    dimensionCode,
    dimensionNameTr,
    domainCode,
    domainNameTr,
    level,
    levelLabelTr,
    itemCount,
    responseQuality,
    evidenceLevel,
    calibrationState: 'PRE_CALIBRATION',
    temporalSignal,
    measurementCount,
    provenanceCompleteness: Boolean(instrumentName),
    positiveFactors,
    uncertainties,
    missingSignals,
    explanationTr,
  };
}

/**
 * Aggregates dimension confidence into a Profile Confidence Map view model.
 * Strictly uses distribution counts (High: N, Moderate: N...) without mathematical averaging.
 */
export function buildProfileConfidenceMap(
  dimensionConfidences: DimensionConfidence[]
): ProfileConfidenceMapViewModel {
  const distribution = {
    high: 0,
    moderate: 0,
    low: 0,
    veryLow: 0,
    totalMeasured: dimensionConfidences.length,
  };

  for (const dc of dimensionConfidences) {
    if (dc.level === 'HIGH') distribution.high++;
    else if (dc.level === 'MODERATE') distribution.moderate++;
    else if (dc.level === 'LOW') distribution.low++;
    else distribution.veryLow++;
  }

  let headlineTr = '';
  if (distribution.totalMeasured === 0) {
    headlineTr = 'Henüz Ölçülmüş Psikolojik Boyut Bulunmuyor';
  } else if (distribution.high + distribution.moderate === distribution.totalMeasured) {
    headlineTr = `Ölçülen ${distribution.totalMeasured} boyutun tamamında kanıt gücü yeterli veya yüksek`;
  } else if (distribution.high >= distribution.totalMeasured / 2) {
    headlineTr = `Ölçülen boyutların çoğunluğunda (${distribution.high}/${distribution.totalMeasured}) yüksek kanıt gücü`;
  } else {
    headlineTr = `${distribution.totalMeasured} psikolojik boyut için kanıt gücü haritası oluşturuldu`;
  }

  return {
    distribution,
    dimensions: dimensionConfidences,
    headlineTr,
    overallNoteTr:
      'Güven seviyeleri ölçümün kanıt gücünü (madde sayısı, telemetri tutarlılığı, geçerlik durumu) gösterir; nüfus kesinlik yüzdesi değildir.',
  };
}

/**
 * Derives a transparent Profile Completeness Summary distinguishing user-facing domains
 * from internal ontology models.
 */
export function deriveProfileCompleteness(params: {
  measuredFacetsCount: number;
  totalOntologyFacets: number;
  measuredUserFacingDomains: number;
  totalUserFacingDomains: number;
  totalOntologyDomains: number;
  measuredOntologyDomains: number;
}): ProfileCompletenessSummary {
  const {
    measuredFacetsCount,
    totalOntologyFacets = 84,
    measuredUserFacingDomains,
    totalUserFacingDomains = 8,
    totalOntologyDomains = 9,
    measuredOntologyDomains,
  } = params;

  const facetCoveragePercentage =
    totalOntologyFacets > 0 ? Math.round((measuredFacetsCount / totalOntologyFacets) * 100) : 0;

  const summaryStatementsTr = [
    `Profiliniz 84 psikolojik alt boyutun ${measuredFacetsCount}'ini (%${facetCoveragePercentage}) doğrudan ölçmektedir.`,
    `${totalUserFacingDomains} temel psikolojik alandan ${measuredUserFacingDomains}'inde ölçüm kaydı mevcuttur.`,
    measuredFacetsCount < 30
      ? 'Ek modülleri tamamlayarak profilinizin açıklama gücünü ve kapsama derinliğini artırabilirsiniz.'
      : 'Geniş bir psikolojik yelpazede doğrudan ölçüm verisine ulaşılmıştır.',
  ];

  return {
    totalOntologyFacets,
    measuredFacetsCount,
    facetCoveragePercentage,
    totalUserFacingDomains,
    measuredUserFacingDomains,
    totalOntologyDomains,
    measuredOntologyDomains,
    summaryStatementsTr,
    disclaimerTr:
      'Ölçüm kapsamı (coverage), ontolojideki taranmış boyut miktarını ifade eder; psikolojik kesinlik veya eksiksizlik anlamına gelmez.',
  };
}
