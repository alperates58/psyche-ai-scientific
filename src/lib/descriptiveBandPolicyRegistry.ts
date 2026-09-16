/**
 * PsycheAI Descriptive Band Policy Registry
 * 
 * Defines explicit, instrument-specific response range policies keyed by authoritative scoring model codes.
 * In PRE_CALIBRATION mode, instruments default to enabled: false unless an explicit,
 * empirically validated interpretive cutoff policy is verified in the repository.
 * If no policy is enabled, returns DESCRIPTIVE_BAND_UNAVAILABLE, presenting raw scores without artificial colored bands.
 */

import { HeatmapCellState } from '@/types/heatmap';

export interface DescriptiveBandThresholds {
  lowerRatioThreshold: number;
  upperRatioThreshold: number;
}

export interface DescriptiveBandPolicy {
  scoringModelCode: string;
  enabled: boolean;
  thresholds?: DescriptiveBandThresholds;
  rationale: string;
  source?: string;
  wording?: {
    lower: string;
    mid: string;
    upper: string;
  };
}

/**
 * Registry of authoritative scoring models.
 * In pre-calibration mode, generic thirds are strictly forbidden; policies default to enabled: false.
 */
export const DESCRIPTIVE_BAND_POLICIES: Record<string, DescriptiveBandPolicy> = {
  PRE_CALIBRATION_MEAN_V1: {
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    enabled: false,
    rationale: 'Ön-kalibrasyon aşamasında yapay bantlandırma yapılmaz; doğrudan ham puan ve ölçek aralığı (1.0-5.0) sunulur.',
    source: 'Ashton & Lee (2007); Türk Uyarlaması: Wasti, Lee, Ashton & Somer (2008)',
  },
  HEXACO_PRECALIBRATION_V1: {
    scoringModelCode: 'HEXACO_PRECALIBRATION_V1',
    enabled: false,
    rationale: 'HEXACO ön-kalibrasyon modeli; doğrudan ham puan ve ölçek aralığı (1.0-5.0) sunulur.',
    source: 'Ashton & Lee (2007); Türk Uyarlaması: Wasti vd. (2008)',
  },
  RSES_MEAN_V1: {
    scoringModelCode: 'RSES_MEAN_V1',
    enabled: false,
    rationale: 'Rosenberg Benlik Saygısı Ölçeği ön-kalibrasyon modeli (1.0-4.0 ölçeği). Doğrudan ham puan sunulur.',
    source: 'Rosenberg (1965); Türk Uyarlaması: Çuhadaroğlu (1986)',
  },
  RSES_SUM_V1: {
    scoringModelCode: 'RSES_SUM_V1',
    enabled: false,
    rationale: 'RSES puan modeli; doğrudan ham ölçek aralığı sunulur.',
    source: 'Rosenberg (1965); Türk Uyarlaması: Çuhadaroğlu (1986)',
  },
  GSE_MEAN_V1: {
    scoringModelCode: 'GSE_MEAN_V1',
    enabled: false,
    rationale: 'Genel Öz-Yeterlik Ölçeği ön-kalibrasyon modeli (1.0-4.0 ölçeği). Doğrudan ham puan sunulur.',
    source: 'Schwarzer & Jerusalem (1995); Türk Uyarlaması: Aypay (2010); Yıldırım & İlhan (2010)',
  },
  GSE_SUM_V1: {
    scoringModelCode: 'GSE_SUM_V1',
    enabled: false,
    rationale: 'GSE puan modeli; doğrudan ham ölçek aralığı sunulur.',
    source: 'Schwarzer & Jerusalem (1995); Türk Uyarlaması: Aypay (2010); Yıldırım & İlhan (2010)',
  },
  ERQ_MEAN_V1: {
    scoringModelCode: 'ERQ_MEAN_V1',
    enabled: false,
    rationale: 'Duygu Düzenleme Anketi (ERQ) iki bağımsız alt ölçek (1.0-7.0) için ham ortalama sunulur.',
    source: 'Gross & John (2003)',
  },
  ECR_R_MEAN_V1: {
    scoringModelCode: 'ECR_R_MEAN_V1',
    enabled: false,
    rationale: 'Yakın İlişkilerde Yaşantılar (ECR-R) sürekli boyutları (1.0-7.0) için ham ortalama sunulur.',
    source: 'Fraley, Waller & Brennan (2000)',
  },
};

/**
 * Looks up the descriptive band policy for a scoring model code.
 */
export function getDescriptiveBandPolicy(
  scoringModelCode?: string | null
): DescriptiveBandPolicy | null {
  if (!scoringModelCode) return null;
  const normalized = scoringModelCode.toUpperCase().trim();
  return DESCRIPTIVE_BAND_POLICIES[normalized] || null;
}

export interface DescriptiveBandResult {
  state: HeatmapCellState;
  labelTr: string;
  rationale?: string;
  source?: string;
  policyEnabled: boolean;
}

/**
 * Evaluates scale-relative response range state strictly through the policy registry.
 * If no explicit enabled policy exists for the scoring model code, returns DESCRIPTIVE_BAND_UNAVAILABLE.
 */
export function resolveDescriptiveBand(
  score: number | null,
  scaleMin: number,
  scaleMax: number,
  scoringModelCode?: string | null
): DescriptiveBandResult {
  if (score === null || typeof score !== 'number' || isNaN(score)) {
    return {
      state: 'UNMEASURED',
      labelTr: 'Ölçülmedi',
      policyEnabled: false,
    };
  }

  const range = scaleMax - scaleMin;
  if (range <= 0) {
    return {
      state: 'DESCRIPTIVE_BAND_UNAVAILABLE',
      labelTr: 'Ölçek Aralığı Belirsiz',
      policyEnabled: false,
    };
  }

  const policy = getDescriptiveBandPolicy(scoringModelCode);
  if (!policy || !policy.enabled || !policy.thresholds) {
    return {
      state: 'DESCRIPTIVE_BAND_UNAVAILABLE',
      labelTr: 'Betimsel Bant Tanımlanmamış',
      rationale: policy?.rationale || 'Bu değerlendirme aracı için ön-kalibrasyon aşamasında standartlaştırılmış betimsel bant politikası tanımlanmamıştır. Yalnızca ham ölçek puanı sunulur.',
      source: policy?.source,
      policyEnabled: false,
    };
  }

  const ratio = (score - scaleMin) / range;
  const { lowerRatioThreshold, upperRatioThreshold } = policy.thresholds;

  const lowerWord = policy.wording?.lower || 'Ölçek Alt Yanıt Bölgesi';
  const midWord = policy.wording?.mid || 'Ölçek Orta Yanıt Bölgesi';
  const upperWord = policy.wording?.upper || 'Ölçek Üst Yanıt Bölgesi';

  if (ratio < lowerRatioThreshold) {
    return {
      state: 'LOWER_RESPONSE_RANGE',
      labelTr: lowerWord,
      rationale: policy.rationale,
      source: policy.source,
      policyEnabled: true,
    };
  }

  if (ratio <= upperRatioThreshold) {
    return {
      state: 'MID_RESPONSE_RANGE',
      labelTr: midWord,
      rationale: policy.rationale,
      source: policy.source,
      policyEnabled: true,
    };
  }

  return {
    state: 'UPPER_RESPONSE_RANGE',
    labelTr: upperWord,
    rationale: policy.rationale,
    source: policy.source,
    policyEnabled: true,
  };
}
