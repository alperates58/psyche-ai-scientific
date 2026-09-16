/**
 * PsycheAI Descriptive Band Policy Registry
 * 
 * Defines explicit, instrument-specific response range policies keyed by scoring strategy or instrument code.
 * Strictly prevents arbitrary universal thirds (e.g. 38/62 thresholds) across different psychometric tools.
 * If no policy is registered or enabled for an instrument, returns DESCRIPTIVE_BAND_UNAVAILABLE.
 */

import { HeatmapCellState } from '@/types/heatmap';

export interface DescriptiveBandThresholds {
  lowerRatioThreshold: number;
  upperRatioThreshold: number;
}

export interface DescriptiveBandPolicy {
  strategyCode: string;
  instrumentCode?: string;
  enabled: boolean;
  thresholds?: DescriptiveBandThresholds;
  rationale: string;
  source: string;
  wording?: {
    lower: string;
    mid: string;
    upper: string;
    unavailable?: string;
  };
}

/**
 * Authoritative registry of approved descriptive band policies for validated instruments.
 */
export const DESCRIPTIVE_BAND_POLICIES: Record<string, DescriptiveBandPolicy> = {
  // HEXACO-60 & HEXACO-24 (1.0 - 5.0 Likert)
  HEXACO_60_STRATEGY: {
    strategyCode: 'HEXACO_60_STRATEGY',
    instrumentCode: 'HEXACO_60',
    enabled: true,
    thresholds: { lowerRatioThreshold: 0.333, upperRatioThreshold: 0.666 },
    rationale: 'HEXACO 5\'li Likert ölçeğinde (1-5) 1.00-2.33 alt yanıt bölgesi, 2.34-3.66 orta yanıt bölgesi, 3.67-5.00 üst yanıt bölgesi olarak yapılandırılmıştır.',
    source: 'Ashton & Lee (2007); Türk Uyarlaması: Wasti, Lee, Ashton & Somer (2008)',
    wording: {
      lower: 'Ölçek Alt Yanıt Bölgesi',
      mid: 'Ölçek Orta Yanıt Bölgesi',
      upper: 'Ölçek Üst Yanıt Bölgesi',
    },
  },
  HEXACO_24_STRATEGY: {
    strategyCode: 'HEXACO_24_STRATEGY',
    instrumentCode: 'HEXACO_24',
    enabled: true,
    thresholds: { lowerRatioThreshold: 0.333, upperRatioThreshold: 0.666 },
    rationale: 'HEXACO Kısa Form 5\'li Likert ölçeğinde standart üçlü yanıt bölgesi dağılımı.',
    source: 'Ashton & Lee (2007); Türk Uyarlaması: Wasti vd. (2008)',
    wording: {
      lower: 'Ölçek Alt Yanıt Bölgesi',
      mid: 'Ölçek Orta Yanıt Bölgesi',
      upper: 'Ölçek Üst Yanıt Bölgesi',
    },
  },
  HEXACO: {
    strategyCode: 'HEXACO',
    instrumentCode: 'HEXACO',
    enabled: true,
    thresholds: { lowerRatioThreshold: 0.333, upperRatioThreshold: 0.666 },
    rationale: 'HEXACO envanteri genel Likert yanıt bölgesi politikası.',
    source: 'Ashton & Lee (2007)',
    wording: {
      lower: 'Ölçek Alt Yanıt Bölgesi',
      mid: 'Ölçek Orta Yanıt Bölgesi',
      upper: 'Ölçek Üst Yanıt Bölgesi',
    },
  },

  // Rosenberg Self-Esteem Scale (1.0 - 4.0 Likert)
  RSES_10_STRATEGY: {
    strategyCode: 'RSES_10_STRATEGY',
    instrumentCode: 'RSES_10',
    enabled: true,
    thresholds: { lowerRatioThreshold: 0.333, upperRatioThreshold: 0.666 },
    rationale: 'Rosenberg Benlik Saygısı Ölçeği (1-4 Likert) yanıt aralığı.',
    source: 'Rosenberg (1965); Türk Uyarlaması: Çuhadaroğlu (1986)',
    wording: {
      lower: 'Ölçek Alt Yanıt Bölgesi',
      mid: 'Ölçek Orta Yanıt Bölgesi',
      upper: 'Ölçek Üst Yanıt Bölgesi',
    },
  },
  RSES: {
    strategyCode: 'RSES',
    instrumentCode: 'RSES',
    enabled: true,
    thresholds: { lowerRatioThreshold: 0.333, upperRatioThreshold: 0.666 },
    rationale: 'Rosenberg Benlik Saygısı Ölçeği genel politikası.',
    source: 'Rosenberg (1965)',
    wording: {
      lower: 'Ölçek Alt Yanıt Bölgesi',
      mid: 'Ölçek Orta Yanıt Bölgesi',
      upper: 'Ölçek Üst Yanıt Bölgesi',
    },
  },

  // Generalized Self-Efficacy Scale (1.0 - 4.0 Likert)
  GSE_10_STRATEGY: {
    strategyCode: 'GSE_10_STRATEGY',
    instrumentCode: 'GSE_10',
    enabled: true,
    thresholds: { lowerRatioThreshold: 0.333, upperRatioThreshold: 0.666 },
    rationale: 'Genel Öz-Yeterlik Ölçeği (1-4 Likert) yanıt aralığı.',
    source: 'Schwarzer & Jerusalem (1995); Türk Uyarlaması: Yeşilay, Ogel & Eke (2012)',
    wording: {
      lower: 'Ölçek Alt Yanıt Bölgesi',
      mid: 'Ölçek Orta Yanıt Bölgesi',
      upper: 'Ölçek Üst Yanıt Bölgesi',
    },
  },
  GSE: {
    strategyCode: 'GSE',
    instrumentCode: 'GSE',
    enabled: true,
    thresholds: { lowerRatioThreshold: 0.333, upperRatioThreshold: 0.666 },
    rationale: 'Genel Öz-Yeterlik Ölçeği genel politikası.',
    source: 'Schwarzer & Jerusalem (1995)',
    wording: {
      lower: 'Ölçek Alt Yanıt Bölgesi',
      mid: 'Ölçek Orta Yanıt Bölgesi',
      upper: 'Ölçek Üst Yanıt Bölgesi',
    },
  },

  // Difficulties in Emotion Regulation Scale (1.0 - 5.0 Likert)
  DERS_16_STRATEGY: {
    strategyCode: 'DERS_16_STRATEGY',
    instrumentCode: 'DERS_16',
    enabled: true,
    thresholds: { lowerRatioThreshold: 0.333, upperRatioThreshold: 0.666 },
    rationale: 'Duygu Düzenleme Güçlüğü Ölçeği (1-5 Likert) yanıt aralığı.',
    source: 'Bjureberg et al. (2016); Türk Uyarlaması: Yiğit & Yiğit (2017)',
    wording: {
      lower: 'Ölçek Alt Yanıt Bölgesi',
      mid: 'Ölçek Orta Yanıt Bölgesi',
      upper: 'Ölçek Üst Yanıt Bölgesi',
    },
  },

  // Brief COPE (1.0 - 4.0 Likert)
  BRIEF_COPE_28_STRATEGY: {
    strategyCode: 'BRIEF_COPE_28_STRATEGY',
    instrumentCode: 'BRIEF_COPE_28',
    enabled: true,
    thresholds: { lowerRatioThreshold: 0.333, upperRatioThreshold: 0.666 },
    rationale: 'Başa Çıkma Tutumları Kısa Formu (1-4 Likert) yanıt aralığı.',
    source: 'Carver (1997); Türk Uyarlaması: Bacanlı, Sürüm & İlhan (2013)',
    wording: {
      lower: 'Ölçek Alt Yanıt Bölgesi',
      mid: 'Ölçek Orta Yanıt Bölgesi',
      upper: 'Ölçek Üst Yanıt Bölgesi',
    },
  },
};

/**
 * Looks up the descriptive band policy for a scoring strategy or instrument code.
 */
export function getDescriptiveBandPolicy(
  strategyOrInstrumentCode?: string | null
): DescriptiveBandPolicy | null {
  if (!strategyOrInstrumentCode) return null;
  const normalized = strategyOrInstrumentCode.toUpperCase().trim();
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
 * If no explicit enabled policy exists for the scoring strategy, returns DESCRIPTIVE_BAND_UNAVAILABLE.
 */
export function resolveDescriptiveBand(
  score: number | null,
  scaleMin: number,
  scaleMax: number,
  strategyOrInstrumentCode?: string | null
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

  const policy = getDescriptiveBandPolicy(strategyOrInstrumentCode);
  if (!policy || !policy.enabled || !policy.thresholds) {
    return {
      state: 'DESCRIPTIVE_BAND_UNAVAILABLE',
      labelTr: 'Betimsel Bant Tanımlanmamış',
      rationale: 'Bu değerlendirme aracı için standartlaştırılmış betimsel bant politikası tanımlanmamıştır. Yalnızca ham ölçek puanı sunulur.',
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
