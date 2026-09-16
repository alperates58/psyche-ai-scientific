export interface ScoredResponseItem {
  itemId: string;
  facetId: string;
  constructId: string;
  domainId: string;
  rawValue: number;
  scoredValue: number;
  isKeyed: boolean;
  isAttentionCheck: boolean;
}

export interface CalculatedScoresResult {
  provisionalComposite: number;
  scaleMin: number;
  scaleMax: number;
  scoreType: 'MEAN' | 'SUM';
  facetScores: Array<{
    facetId: string;
    rawMean: number;
    itemCount: number;
  }>;
  constructScores: Array<{
    constructId: string;
    compositeScore: number;
    facetCount: number;
  }>;
  domainScores: Array<{
    domainId: string;
    compositeScore: number;
    constructCount: number;
  }>;
}

export interface ScoringStrategyDefinition {
  code: string;
  nameTr: string;
  descriptionTr: string;
  scaleMin: number;
  scaleMax: number;
  scoreType: 'MEAN' | 'SUM';
  isPreCalibration: boolean;
  calculate: (responses: ScoredResponseItem[]) => CalculatedScoresResult;
}

/**
 * Standard unweighted composite mean scoring (used for HEXACO and general multi-facet instruments).
 */
export const HEXACO_PRECALIBRATION_STRATEGY: ScoringStrategyDefinition = {
  code: 'PRE_CALIBRATION_MEAN_V1',
  nameTr: 'Ağırlıksız Ön-Kalibrasyon Ortalama Modeli (V1)',
  descriptionTr: 'Maddelerin aritmetik ortalaması üzerinden alt boyut ve ana faktör bileşik puanlarını 1.0–5.0 ölçeğinde hesaplar.',
  scaleMin: 1.0,
  scaleMax: 5.0,
  scoreType: 'MEAN',
  isPreCalibration: true,
  calculate: (responses: ScoredResponseItem[]): CalculatedScoresResult => {
    // Exclude attention checks
    const validResponses = responses.filter((r) => !r.isAttentionCheck);

    const facetItemsMap = new Map<string, { constructId: string; domainId: string; scoredValues: number[] }>();
    for (const resp of validResponses) {
      if (!facetItemsMap.has(resp.facetId)) {
        facetItemsMap.set(resp.facetId, {
          constructId: resp.constructId,
          domainId: resp.domainId,
          scoredValues: [],
        });
      }
      facetItemsMap.get(resp.facetId)!.scoredValues.push(resp.scoredValue);
    }

    // 1. Facet Scores
    const facetScores = [];
    const constructFacetsMap = new Map<string, { domainId: string; facetMeans: number[] }>();

    for (const [facetId, data] of facetItemsMap.entries()) {
      const sum = data.scoredValues.reduce((acc, v) => acc + v, 0);
      const rawMean = Number((sum / data.scoredValues.length).toFixed(4));
      facetScores.push({ facetId, rawMean, itemCount: data.scoredValues.length });

      if (!constructFacetsMap.has(data.constructId)) {
        constructFacetsMap.set(data.constructId, { domainId: data.domainId, facetMeans: [] });
      }
      constructFacetsMap.get(data.constructId)!.facetMeans.push(rawMean);
    }

    // 2. Construct Scores
    const constructScores = [];
    const domainConstructsMap = new Map<string, number[]>();

    for (const [constructId, data] of constructFacetsMap.entries()) {
      const sum = data.facetMeans.reduce((acc, v) => acc + v, 0);
      const compositeScore = Number((sum / data.facetMeans.length).toFixed(4));
      constructScores.push({ constructId, compositeScore, facetCount: data.facetMeans.length });

      if (!domainConstructsMap.has(data.domainId)) {
        domainConstructsMap.set(data.domainId, []);
      }
      domainConstructsMap.get(data.domainId)!.push(compositeScore);
    }

    // 3. Domain Scores
    const domainScores = [];
    for (const [domainId, constructs] of domainConstructsMap.entries()) {
      const sum = constructs.reduce((acc, v) => acc + v, 0);
      const compositeScore = Number((sum / constructs.length).toFixed(4));
      domainScores.push({ domainId, compositeScore, constructCount: constructs.length });
    }

    // 4. Provisional Composite
    const totalDomainSum = domainScores.reduce((acc, d) => acc + d.compositeScore, 0);
    const provisionalComposite =
      domainScores.length > 0 ? Number((totalDomainSum / domainScores.length).toFixed(4)) : 0;

    return {
      provisionalComposite,
      scaleMin: 1.0,
      scaleMax: 5.0,
      scoreType: 'MEAN',
      facetScores,
      constructScores,
      domainScores,
    };
  },
};

/**
 * Rosenberg Self-Esteem Scale (RSES) scoring strategy.
 * 10 items on 1.0–4.0 scale (Positive: 1, 3, 4, 7, 10; Reverse: 2, 5, 6, 8, 9).
 * Returns both mean (1.0 to 4.0) and sum (10 to 40) representation.
 */
export const RSES_SUM_STRATEGY: ScoringStrategyDefinition = {
  code: 'RSES_SUM_V1',
  nameTr: 'Rosenberg Benlik Saygısı Puanlama Modeli (V1)',
  descriptionTr: '10 maddelik Rosenberg Benlik Saygısı Ölçeği için ters kodlama ve toplam/ortalama puan hesaplaması.',
  scaleMin: 1.0,
  scaleMax: 4.0,
  scoreType: 'MEAN',
  isPreCalibration: true,
  calculate: (responses: ScoredResponseItem[]): CalculatedScoresResult => {
    const validResponses = responses.filter((r) => !r.isAttentionCheck);

    if (validResponses.length === 0) {
      return {
        provisionalComposite: 0,
        scaleMin: 1.0,
        scaleMax: 4.0,
        scoreType: 'MEAN',
        facetScores: [],
        constructScores: [],
        domainScores: [],
      };
    }

    const first = validResponses[0];
    const scoredSum = validResponses.reduce((acc, r) => acc + r.scoredValue, 0);
    const rawMean = Number((scoredSum / validResponses.length).toFixed(4));

    const facetScores = [{ facetId: first.facetId, rawMean, itemCount: validResponses.length }];
    const constructScores = [{ constructId: first.constructId, compositeScore: rawMean, facetCount: 1 }];
    const domainScores = [{ domainId: first.domainId, compositeScore: rawMean, constructCount: 1 }];

    return {
      provisionalComposite: rawMean,
      scaleMin: 1.0,
      scaleMax: 4.0,
      scoreType: 'MEAN',
      facetScores,
      constructScores,
      domainScores,
    };
  },
};

/**
 * General Self-Efficacy Scale (GSE) scoring strategy.
 * 10 items on 1.0–4.0 scale (all positively keyed).
 */
export const GSE_SUM_STRATEGY: ScoringStrategyDefinition = {
  code: 'GSE_SUM_V1',
  nameTr: 'Genel Öz-Yeterlik Puanlama Modeli (V1)',
  descriptionTr: '10 maddelik Schwarzer & Jerusalem Genel Öz-Yeterlik Ölçeği için ortalama puan hesaplaması.',
  scaleMin: 1.0,
  scaleMax: 4.0,
  scoreType: 'MEAN',
  isPreCalibration: true,
  calculate: (responses: ScoredResponseItem[]): CalculatedScoresResult => {
    const validResponses = responses.filter((r) => !r.isAttentionCheck);

    if (validResponses.length === 0) {
      return {
        provisionalComposite: 0,
        scaleMin: 1.0,
        scaleMax: 4.0,
        scoreType: 'MEAN',
        facetScores: [],
        constructScores: [],
        domainScores: [],
      };
    }

    const first = validResponses[0];
    const scoredSum = validResponses.reduce((acc, r) => acc + r.scoredValue, 0);
    const rawMean = Number((scoredSum / validResponses.length).toFixed(4));

    const facetScores = [{ facetId: first.facetId, rawMean, itemCount: validResponses.length }];
    const constructScores = [{ constructId: first.constructId, compositeScore: rawMean, facetCount: 1 }];
    const domainScores = [{ domainId: first.domainId, compositeScore: rawMean, constructCount: 1 }];

    return {
      provisionalComposite: rawMean,
      scaleMin: 1.0,
      scaleMax: 4.0,
      scoreType: 'MEAN',
      facetScores,
      constructScores,
      domainScores,
    };
  },
};

export const SCORING_STRATEGIES: Record<string, ScoringStrategyDefinition> = {
  PRE_CALIBRATION_MEAN_V1: HEXACO_PRECALIBRATION_STRATEGY,
  HEXACO_PRECALIBRATION_V1: HEXACO_PRECALIBRATION_STRATEGY,
  RSES_SUM_V1: RSES_SUM_STRATEGY,
  GSE_SUM_V1: GSE_SUM_STRATEGY,
};

/**
 * Resolves the appropriate scoring strategy given a model code or module code.
 */
export function resolveScoringStrategy(
  modelCode?: string | null,
  moduleCode?: string | null
): ScoringStrategyDefinition {
  if (modelCode && SCORING_STRATEGIES[modelCode]) {
    return SCORING_STRATEGIES[modelCode];
  }

  if (moduleCode) {
    const norm = moduleCode.toUpperCase();
    if (norm.includes('SELF') || norm.includes('IDENTITY') || norm.includes('RSES')) {
      return RSES_SUM_STRATEGY;
    }
    if (norm.includes('EFFICACY') || norm.includes('GSE')) {
      return GSE_SUM_STRATEGY;
    }
  }

  return HEXACO_PRECALIBRATION_STRATEGY;
}
