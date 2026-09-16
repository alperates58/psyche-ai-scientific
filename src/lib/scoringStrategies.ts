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
 * Returns 1.0–4.0 arithmetic mean of reverse-coded scored items.
 */
export const RSES_MEAN_STRATEGY: ScoringStrategyDefinition = {
  code: 'RSES_MEAN_V1',
  nameTr: 'Rosenberg Benlik Saygısı Ortalama Puan Modeli (V1)',
  descriptionTr: '10 maddelik Rosenberg Benlik Saygısı Ölçeği için ters kodlama ve 1.0–4.0 aralığında ortalama puan hesaplaması.',
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

export const RSES_SUM_STRATEGY = RSES_MEAN_STRATEGY; // Backward-compatibility alias

/**
 * General Self-Efficacy Scale (GSE) scoring strategy.
 * 10 items on 1.0–4.0 scale (all positively keyed).
 * Returns 1.0–4.0 arithmetic mean.
 */
export const GSE_MEAN_STRATEGY: ScoringStrategyDefinition = {
  code: 'GSE_MEAN_V1',
  nameTr: 'Genel Öz-Yeterlik Ortalama Puan Modeli (V1)',
  descriptionTr: '10 maddelik Schwarzer & Jerusalem Genel Öz-Yeterlik Ölçeği için 1.0–4.0 aralığında ortalama puan hesaplaması.',
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

export const GSE_SUM_STRATEGY = GSE_MEAN_STRATEGY; // Backward-compatibility alias

export const SCORING_STRATEGIES: Record<string, ScoringStrategyDefinition> = {
  PRE_CALIBRATION_MEAN_V1: HEXACO_PRECALIBRATION_STRATEGY,
  HEXACO_PRECALIBRATION_V1: HEXACO_PRECALIBRATION_STRATEGY,
  RSES_MEAN_V1: RSES_MEAN_STRATEGY,
  RSES_SUM_V1: RSES_MEAN_STRATEGY, // Alias for historical snapshots
  GSE_MEAN_V1: GSE_MEAN_STRATEGY,
  GSE_SUM_V1: GSE_MEAN_STRATEGY, // Alias for historical snapshots
};

/**
 * Resolves the appropriate scoring strategy given a model code or module code.
 * Authoritative: modelCode lookup in registry.
 * Controlled fallback: specific module rules before broad ones.
 * Unknown: FAILS CLOSED with explicit error (never defaults to HEXACO silently).
 */
export function resolveScoringStrategy(
  modelCode?: string | null,
  moduleCode?: string | null
): ScoringStrategyDefinition {
  // 1. Authoritative: modelCode in registry
  if (modelCode && SCORING_STRATEGIES[modelCode]) {
    return SCORING_STRATEGIES[modelCode];
  }

  // 2. Controlled backward-compatibility module code heuristics (specific before broad)
  if (moduleCode) {
    const norm = moduleCode.toUpperCase().trim();

    // Specific Rule 1: GSE / General Self Efficacy
    if (
      norm.includes('GSE') ||
      norm.includes('GENERAL_SELF_EFFICACY') ||
      norm.includes('SELF_EFFICACY') ||
      norm.includes('OZ_YETERLILIK')
    ) {
      return GSE_MEAN_STRATEGY;
    }

    // Specific Rule 2: RSES / Rosenberg Self Esteem / MODULE_2_SELF_IDENTITY
    if (
      norm.includes('RSES') ||
      norm.includes('ROSENBERG') ||
      norm === 'MODULE_2_SELF_IDENTITY' ||
      norm.includes('SELF_ESTEEM') ||
      norm.includes('BENLIK_SAYGISI')
    ) {
      return RSES_MEAN_STRATEGY;
    }

    // Specific Rule 3: HEXACO / Core Personality
    if (
      norm.includes('HEXACO') ||
      norm === 'MODULE_1_CORE_PERSONALITY' ||
      norm === 'CORE_INTAKE'
    ) {
      return HEXACO_PRECALIBRATION_STRATEGY;
    }

    // Fail closed for unknown module codes
    throw new Error(
      `UNKNOWN_SCORING_STRATEGY: '${moduleCode}' değerlendirme modülü için tanımlı bir puanlama stratejisi bulunamadı.`
    );
  }

  if (modelCode) {
    throw new Error(
      `UNKNOWN_SCORING_STRATEGY: '${modelCode}' puanlama modeli kayıt defterinde bulunamadı.`
    );
  }

  throw new Error(
    'UNKNOWN_SCORING_STRATEGY: Puanlama stratejisi çözümlenemedi (modelCode ve moduleCode belirtilmedi).'
  );
}
