/**
 * PsycheAI Profile Confidence Evaluator
 * 
 * Implements an explicit conservative ordinal decision table for dimension-level confidence.
 * Strictly avoids hidden weighted numeric points or pseudo-statistical confidence percentages.
 * Fails conservatively: UNKNOWN evidence remains UNKNOWN, and high confidence requires
 * full item coverage, clean telemetry, verified provenance, and documented adaptation evidence.
 */

import {
  AuthoritativeEvidenceLevel,
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
  evidenceLevel?: AuthoritativeEvidenceLevel;
  overallTurkishEvidenceLevel?: AuthoritativeEvidenceLevel;
  measurementAlignmentLevel?: string;
  appliesToLevel?: string;
  instrumentValidationEstablished?: boolean;
  instrumentMatch?: boolean;
  humanVerified?: boolean;
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
 * - Authoritative direct instrument evidence (evidenceLevel === 'DIRECT')
 * - Direct Turkish adaptation evidence (overallTurkishEvidenceLevel === 'DIRECT' || hasTurkishEvidence === true)
 * - Exact instrument match with validated inventory (instrumentMatch !== false)
 * - Facet/subscale level alignment (appliesToLevel !== 'BROAD_FACTOR' && measurementAlignmentLevel !== 'NOT_APPLICABLE')
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
    overallTurkishEvidenceLevel = 'NO_DIRECT',
    measurementAlignmentLevel = 'EXACT_FACET',
    appliesToLevel = 'FACET',
    instrumentValidationEstablished = true,
    instrumentMatch = true,
    humanVerified = false,
    hasTurkishEvidence = false,
    instrumentName = null,
    measurementCount = 1,
    temporalSignal = measurementCount > 1 ? 'REPEATED_CONSISTENT' : 'SINGLE_MEASUREMENT',
  } = params;

  // 1. Evaluate Scientific Evidence Gates
  const isTelemetryClean = responseQuality === 'EXCELLENT' || responseQuality === 'ACCEPTABLE';
  const isAuthoritativeDirect = evidenceLevel === 'DIRECT';
  const isTurkishDirect = overallTurkishEvidenceLevel === 'DIRECT' || hasTurkishEvidence === true;
  const isInstrumentMatched = instrumentMatch !== false && Boolean(instrumentName);
  const isFacetAligned =
    (appliesToLevel === 'FACET' || appliesToLevel === 'SUBSCALE') &&
    (measurementAlignmentLevel === 'EXACT_FACET' || measurementAlignmentLevel === 'SUBSCALE_ALIGNED');
  const isBroadFactor = appliesToLevel === 'BROAD_FACTOR' || evidenceLevel === 'LEXICAL';

  const isFullyDirectValidated =
    isAuthoritativeDirect &&
    isTurkishDirect &&
    isInstrumentMatched &&
    isFacetAligned &&
    instrumentValidationEstablished &&
    !isBroadFactor;

  // 2. Explicit Conservative Ordinal Decision Table
  let level: DimensionConfidenceLevel = 'LOW';
  let levelLabelTr = 'Sınırlı Ölçüm Desteği';

  if (responseQuality === 'COMPROMISED') {
    level = 'VERY_LOW';
    levelLabelTr = 'Yetersiz / Düşük Kalite';
  } else if (itemCount <= 0) {
    level = 'VERY_LOW';
    levelLabelTr = 'Ölçülmedi';
  } else if (responseQuality === 'QUESTIONABLE') {
    // Flagged response quality strictly caps confidence at LOW
    level = 'LOW';
    levelLabelTr = 'Sınırlı (Telemetri Uyarısı)';
  } else if (itemCount < 3) {
    // 1-2 items: sparse probe, strictly LOW
    level = 'LOW';
    levelLabelTr = 'Sınırlı (Kısa Form / 1-2 Madde)';
  } else if (itemCount >= 6 && isTelemetryClean && isFullyDirectValidated) {
    // HIGH requires ALL: >=6 items, clean telemetry, direct evidence, Turkish direct adaptation, instrument match, facet alignment
    level = 'HIGH';
    levelLabelTr = 'Güçlü Ölçüm Desteği';
  } else if (itemCount >= 3 && isTelemetryClean) {
    if (isFullyDirectValidated) {
      level = 'MODERATE';
      levelLabelTr = 'Orta Düzey Destek';
    } else if (isInstrumentMatched && (isAuthoritativeDirect || isTurkishDirect)) {
      level = 'MODERATE';
      levelLabelTr = 'Orta Düzey Destek';
    } else if (isInstrumentMatched && isBroadFactor && itemCount >= 6) {
      level = 'MODERATE';
      levelLabelTr = 'Orta (Geniş Faktör/Leksikal Kanıt)';
    } else if (isInstrumentMatched && evidenceLevel === 'RELATED' && itemCount >= 6) {
      level = 'MODERATE';
      levelLabelTr = 'Orta (İlişkili Envanter Kanıtı)';
    } else {
      level = 'LOW';
      levelLabelTr = !isInstrumentMatched
        ? 'Sınırlı (Eşleşmeyen Envanter)'
        : 'Sınırlı (Doğrulanmamış Kanıt)';
    }
  } else {
    level = 'LOW';
    levelLabelTr = 'Sınırlı Ölçüm Desteği';
  }

  // 3. Derive Transparent Positive Factors
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

  if (isTurkishDirect && isInstrumentMatched) {
    positiveFactors.push('Türkçe doğrudan psikometrik uyarlama kaydı mevcut');
  }

  if (isAuthoritativeDirect && isInstrumentMatched) {
    positiveFactors.push(`Doğrulanmış psikometrik envanter kaynağı (${instrumentName})`);
  }

  if (humanVerified === true) {
    positiveFactors.push('Uzman denetiminden geçmiş (human-verified) bilimsel kanıt');
  }

  if (temporalSignal === 'REPEATED_CONSISTENT') {
    positiveFactors.push('Tekrarlı ölçümlerde tutarlı puanlama deseni gözlendi');
  }

  // 4. Derive Explicit Uncertainties & Limiting Signals
  const uncertainties: DimensionUncertaintyItem[] = [];
  const missingSignals: string[] = [];

  // Calibration uncertainty (always present in pre-calibration)
  uncertainties.push({
    type: 'CALIBRATION_UNCERTAINTY',
    labelTr: 'Ön Kalibrasyon (Norm Yok)',
    descriptionTr: 'Bu ölçüm henüz temsili ulusal nüfus normlarıyla kalibre edilmemiştir; betimsel puan sunulur.',
  });
  missingSignals.push('Temsili ulusal norm kıyaslaması');

  // Provenance & Instrument match uncertainty
  if (!isInstrumentMatched) {
    uncertainties.push({
      type: 'PROVENANCE_UNCERTAINTY',
      labelTr: 'Envanter Eşleşme Uyarısı',
      descriptionTr: 'Mevcut oturum envanteri ile bu boyutun doğrulanmış geçerlik veritabanı kayıtları eşleşmemektedir.',
    });
    missingSignals.push('Doğrulanmış envanter ile doğrudan eşleşme');
  } else if (evidenceLevel === 'UNKNOWN' || !instrumentName) {
    uncertainties.push({
      type: 'EVIDENCE_UNCERTAINTY',
      labelTr: 'Doğrulanmamış Envanter Kanıtı',
      descriptionTr: 'Bu boyut için literatür geçerlik kaydı veya envanter kaynağı doğrulanmamıştır.',
    });
    missingSignals.push('Doğrulanmış psikometrik envanter kaydı');
  } else if (isBroadFactor) {
    uncertainties.push({
      type: 'EVIDENCE_UNCERTAINTY',
      labelTr: 'Yalnızca Leksikal / Geniş Faktör Kanıtı',
      descriptionTr: 'Bu boyut için doğrudan alt ölçek ampirik uyarlaması yerine geniş faktör leksikal desteği mevcuttur.',
    });
    missingSignals.push('Doğrudan alt ölçek ampirik geçerlik çalışması');
  } else if (evidenceLevel === 'RELATED') {
    uncertainties.push({
      type: 'EVIDENCE_UNCERTAINTY',
      labelTr: 'İlişkili Ölçek Kanıtı',
      descriptionTr: 'Bu boyut doğrudan değil, ilişkili bir envanter üzerinden dolaylı olarak desteklenmektedir.',
    });
    missingSignals.push('Özgün envanter doğrudan geçerlik çalışması');
  } else if (evidenceLevel === 'NO_DIRECT') {
    uncertainties.push({
      type: 'EVIDENCE_UNCERTAINTY',
      labelTr: 'Doğrudan Kanıt Bulunmuyor',
      descriptionTr: 'Bu boyut için literatürde doğrudan Türkçe geçerlik kanıtı doğrulanmamıştır.',
    });
    missingSignals.push('Doğrudan ampirik geçerlik kaydı');
  }

  if (!isTurkishDirect) {
    uncertainties.push({
      type: 'EVIDENCE_UNCERTAINTY',
      labelTr: 'Türkçe Uyarlama Kanıtı Eksik',
      descriptionTr: 'Bu ölçeğin Türkçe psikometrik uyarlama ve geçerlik kanıtı doğrulanmamıştır.',
    });
    missingSignals.push('Türkçe psikometrik geçerlik kanıtı');
  }

  // Human verification signal (honest representation - never invent)
  if (humanVerified === false) {
    uncertainties.push({
      type: 'PROVENANCE_UNCERTAINTY',
      labelTr: 'Uzman Onayı Bekleniyor',
      descriptionTr: 'Bu boyutun psikometrik kanıt kaydı henüz bağımsız uzman incelemesinden (human review) geçmemiştir.',
    });
    missingSignals.push('Bağımsız uzman denetimi (human verification)');
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

  // 5. Construct Clear Explanation
  let explanationTr = '';
  if (level === 'HIGH') {
    explanationTr = `${itemCount} maddelik doğrudan ölçekleme, doğrulanmış Türkçe uyarlama ve tutarlı oturum telemetrisi sayesinde ampirik ölçüm desteği güçlüdür.`;
  } else if (level === 'MODERATE') {
    explanationTr = `${itemCount} maddelik ampirik ölçüm ve tutarlı oturum deseni ile orta düzey ölçüm desteğine sahiptir.`;
  } else if (level === 'LOW') {
    explanationTr = itemCount < 3
      ? `Az sayıda madde (${itemCount} md.) ile ölçüldüğünden ölçüm desteği başlangıç düzeyindedir; ek değerlendirme önerilir.`
      : responseQuality === 'QUESTIONABLE'
      ? 'Oturum telemetrisindeki dikkat/hız uyarısı nedeniyle temkinli değerlendirilmelidir.'
      : !isInstrumentMatched
      ? 'Uygulanan envanter ile geçerlik veritabanı eşleşmediğinden temkinli değerlendirilmelidir.'
      : 'Psikometrik kanıt veya uyarlama bilgisi henüz doğrudan doğrulanmadığından sınırlı ölçüm desteği sunar.';
  } else {
    explanationTr = 'Veri kalitesi veya madde sayısı yetersiz olduğundan ölçüm desteği düşüktür.';
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
    provenanceCompleteness: Boolean(instrumentName) && isFullyDirectValidated,
    positiveFactors,
    uncertainties,
    missingSignals,
    explanationTr,
    overallTurkishEvidenceLevel,
    measurementAlignmentLevel,
    appliesToLevel,
    instrumentMatch: isInstrumentMatched,
    humanVerified,
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
      'Ölçüm desteği seviyeleri ampirik veri gücünü (madde sayısı, oturum telemetrisi, doğrulanmış envanter kanıtı) gösterir; istatistiksel güven aralığı (95% CI) veya kesinlik yüzdesi değildir.',
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
