/**
 * PsycheAI Response Integrity & Telemetry Heuristic Configuration
 *
 * NOTE: All thresholds in this file are currently classified as RESEARCH_HEURISTIC.
 * They are not immutable psychometric constants; they represent conservative screening
 * criteria derived from digital assessment literature (Curran 2016; Wood et al. 2017;
 * Kim et al. 2019) and will be formally calibrated in Phase 3 with Turkish pilot data.
 */

export interface IntegrityHeuristic<T> {
  value: T;
  status: 'RESEARCH_HEURISTIC' | 'PILOT_CALIBRATED' | 'STANDARDIZED';
  source: string;
  version: string;
  descriptionTr: string;
}

export const INTEGRITY_CONFIG = {
  /**
   * Minimum reading time threshold per item (in milliseconds).
   * Stimulus reading below 1200ms is considered rapid guessing or non-reflective response.
   */
  speedViolationThresholdMs: {
    value: 1200,
    status: 'RESEARCH_HEURISTIC',
    source: 'Curran (2016) Methods for identifying careless responding; Wood et al. (2017) 1.0-1.5s reading threshold',
    version: '1.0.0-heuristic',
    descriptionTr: 'Psikolojik madde metnini okuma ve bilişsel olarak yanıtlama için asgari araştırma eşiği (1200 ms).'
  } as IntegrityHeuristic<number>,

  /**
   * Consecutive identical response streak (Longstring index).
   * Longstring of 8 or more identical options in a row indicates possible straightlining.
   */
  straightliningStreakThreshold: {
    value: 8,
    status: 'RESEARCH_HEURISTIC',
    source: 'Kim et al. (2019); Johnson (2005) Longstring screening in web batteries',
    version: '1.0.0-heuristic',
    descriptionTr: 'Ardışık aynı cevabı işaretleme (düz yanıtlama / straightlining) araştırma eşiği.'
  } as IntegrityHeuristic<number>,

  /**
   * Target value for standard attention check items.
   */
  attentionCheckTargetValue: {
    value: 4, // 4 = "Katılıyorum" / "Agree"
    status: 'RESEARCH_HEURISTIC',
    source: 'Meade & Craig (2012) Directed response items',
    version: '1.0.0-specification',
    descriptionTr: 'Yönerge tabanlı doğrulama maddesi için beklenen cevap değeri.'
  } as IntegrityHeuristic<number>,

  /**
   * Weight/penalty allocated to a single attention check failure.
   * Scientifically, a single failure generates an anomaly signal (REVIEW)
   * but CANNOT alone invalidate a session (cannot produce COMPROMISED / LOW_QUALITY on its own).
   */
  attentionCheckAnomalyWeight: {
    value: 2, // Anomaly penalty points
    status: 'RESEARCH_HEURISTIC',
    source: 'PsycheAI Scientific Guardrail: Multi-signal integration rule (single signal cannot invalidate)',
    version: '1.0.0-heuristic',
    descriptionTr: 'Dikkat kontrolü hatasına verilen anomali ağırlığı; tek başına geçersizlik üretemez.'
  } as IntegrityHeuristic<number>,

  /**
   * Terminology definitions for integrity flags in pre-calibration.
   * Replaces unscientific claims ("Mükemmel", "%100 Güvenilir") with calm, accurate terminology.
   */
  integrityLabelsTr: {
    EXCELLENT: 'Yanıt Bütünlüğü: Temiz',
    ACCEPTABLE: 'Belirgin Kalite Sorunu Saptanmadı',
    QUESTIONABLE: 'İncelenmesi Önerilir',
    COMPROMISED: 'Düşük Veri Kalitesi (Yüksek Anomali)'
  }
} as const;
