/**
 * PsycheAI Profile Confidence Evaluator
 * 
 * Implements an explicit conservative ordinal decision table for dimension-level confidence.
 * Strictly avoids hidden weighted numeric points or pseudo-statistical confidence percentages.
 * Fails conservatively: UNKNOWN evidence remains UNKNOWN, and high confidence requires
 * full item coverage, clean telemetry, verified provenance, and documented adaptation evidence.
 */

import {
  DimensionConfidence,
  DimensionConfidenceLevel,
  DimensionUncertaintyItem,
  ProfileConfidenceMapViewModel,
  ProfileCompletenessSummary,
  TemporalStabilitySignal,
} from '@/types/confidence';

/**
 * Canonical standard user profile domain codes (7 core domains).
 * Excludes optional/experimental domains and response integrity from standard completeness denominator.
 */
export const STANDARD_USER_PROFILE_DOMAIN_CODES = [
  'core_personality',
  'self_system',
  'emotional_affective',
  'regulatory_volitional',
  'motivational_value',
  'relational_interpersonal',
  'cognitive_epistemic',
] as const;

export type StandardUserProfileDomainCode = typeof STANDARD_USER_PROFILE_DOMAIN_CODES[number];

export interface EvaluateDimensionConfidenceParams {
  dimensionId: string;
  dimensionCode: string;
  dimensionNameTr: string;
  domainCode: string;
  domainNameTr: string;
  itemCount: number;
  responseQuality: 'EXCELLENT' | 'ACCEPTABLE' | 'QUESTIONABLE' | 'COMPROMISED';
  evidenceLevel?: 'DIRECT' | 'INDIRECT' | 'PROVISIONAL' | 'UNKNOWN';
  hasTurkishEvidence?: boolean;
  instrumentName?: string | null;
  measurementCount?: number;
  temporalSignal?: TemporalStabilitySignal;
}

/**
 * Evaluates dimension confidence level via an explicit conservative ordinal decision table.
 * NO hidden weighted score (e.g., +20, +30) is used.
 * HIGH confidence requires ALL of:
 * - Adequate item coverage (>= 6 items or scale full form)
 * - Clean response quality (EXCELLENT or ACCEPTABLE)
 * - Verified direct instrument provenance (evidenceLevel === 'DIRECT')
 * - Documented Turkish adaptation evidence (hasTurkishEvidence === true)
 * - Known instrument identifier
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
    evidenceLevel = 'UNKNOWN',
    hasTurkishEvidence = false,
    instrumentName = null,
    measurementCount = 1,
    temporalSignal = measurementCount > 1 ? 'REPEATED_CONSISTENT' : 'SINGLE_MEASUREMENT',
  } = params;

  // 1. Explicit Conservative Ordinal Decision Table
  let level: DimensionConfidenceLevel = 'LOW';
  let levelLabelTr = 'Düşük';

  const isTelemetryClean = responseQuality === 'EXCELLENT' || responseQuality === 'ACCEPTABLE';
  const hasDirectEvidence = evidenceLevel === 'DIRECT' && Boolean(instrumentName);
  const isFullyValidated = hasDirectEvidence && hasTurkishEvidence;

  if (responseQuality === 'COMPROMISED') {
    level = 'VERY_LOW';
    levelLabelTr = 'Çok Düşük';
  } else if (itemCount <= 0) {
    level = 'VERY_LOW';
    levelLabelTr = 'Ölçülmedi';
  } else if (responseQuality === 'QUESTIONABLE') {
    // Flagged response quality strictly caps confidence at LOW
    level = 'LOW';
    levelLabelTr = 'Düşük (Telemetri Uyarısı)';
  } else if (itemCount < 3) {
    // 1-2 items: sparse probe, strictly LOW
    level = 'LOW';
    levelLabelTr = 'Düşük (Kısa Form / 1-2 Madde)';
  } else if (itemCount >= 6 && isTelemetryClean && isFullyValidated) {
    // HIGH requires ALL: >=6 items, clean telemetry, direct evidence, Turkish evidence, verified provenance
    level = 'HIGH';
    levelLabelTr = 'Yüksek';
  } else if (itemCount >= 3 && isTelemetryClean) {
    if (isFullyValidated || hasDirectEvidence || hasTurkishEvidence) {
      level = 'MODERATE';
      levelLabelTr = 'Orta';
    } else {
      // Missing both direct evidence and Turkish evidence: conservative capping
      if (itemCount >= 6) {
        level = 'MODERATE';
        levelLabelTr = 'Orta (Kanıt Bilgisi Kısıtlı)';
      } else {
        level = 'LOW';
        levelLabelTr = 'Düşük (Doğrulanmamış Kanıt)';
      }
    }
  } else {
    level = 'LOW';
    levelLabelTr = 'Düşük';
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

  if (hasDirectEvidence) {
    positiveFactors.push(`Doğrulanmış psikometrik envanter kaynağı (${instrumentName})`);
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

  // Evidence / Adaptation uncertainty
  if (evidenceLevel === 'UNKNOWN' || !instrumentName) {
    uncertainties.push({
      type: 'EVIDENCE_UNCERTAINTY',
      labelTr: 'Doğrulanmamış Envanter Kanıtı',
      descriptionTr: 'Bu boyut için literatür geçerlik kaydı veya envanter kaynağı doğrulanmamıştır.',
    });
    missingSignals.push('Doğrulanmış psikometrik envanter kaydı');
  }

  if (!hasTurkishEvidence) {
    uncertainties.push({
      type: 'EVIDENCE_UNCERTAINTY',
      labelTr: 'Türkçe Uyarlama Kanıtı Eksik',
      descriptionTr: 'Bu ölçeğin Türkçe psikometrik uyarlama ve geçerlik kanıtı doğrulanmamıştır.',
    });
    missingSignals.push('Türkçe psikometrik geçerlik kanıtı');
  }

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
    explanationTr = `${itemCount} maddelik doğrudan ölçekleme, doğrulanmış Türkçe uyarlama ve tutarlı yanıt telemetrisi sayesinde ölçüm kanıt gücü yüksektir.`;
  } else if (level === 'MODERATE') {
    explanationTr = `${itemCount} maddelik ampirik ölçüm ve tutarlı yanıtlama deseni ile güvenilirdir.`;
  } else if (level === 'LOW') {
    explanationTr = itemCount < 3
      ? `Az sayıda madde (${itemCount} md.) ile ölçüldüğünden kanıt gücü başlangıç düzeyindedir; ek değerlendirme önerilir.`
      : responseQuality === 'QUESTIONABLE'
      ? 'Yanıt telemetrisindeki dikkat/hız uyarısı nedeniyle temkinli değerlendirilmelidir.'
      : 'Psikometrik kanıt veya uyarlama bilgisi doğrulanmadığından temkinli değerlendirilmelidir.';
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
    provenanceCompleteness: Boolean(instrumentName) && hasDirectEvidence,
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
    totalUserFacingDomains = 7,
    totalOntologyDomains = 9,
    measuredOntologyDomains,
  } = params;

  const facetCoveragePercentage =
    totalOntologyFacets > 0 ? Math.round((measuredFacetsCount / totalOntologyFacets) * 100) : 0;

  const summaryStatementsTr = [
    `Profiliniz ${totalOntologyFacets} psikolojik alt boyutun ${measuredFacetsCount}'ini (%${facetCoveragePercentage}) doğrudan ölçmektedir.`,
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
