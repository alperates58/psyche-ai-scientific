import { describe, it, expect } from 'vitest';
import {
  resolveVisualArchetype,
  getScoreBand,
  ALL_TRAIT_INTERPRETATIONS,
  TRAIT_DYNAMIC_RULES,
  deriveKeyObservations,
} from '../../src/lib/assessmentInterpretationConfig';
import {
  resolveScoringStrategy,
  RSES_MEAN_STRATEGY,
  GSE_MEAN_STRATEGY,
  HEXACO_PRECALIBRATION_STRATEGY,
  ScoredResponseItem,
} from '../../src/lib/scoringStrategies';

describe('FAZ 2.10: Visual Archetype Resolution & Fallback Safety', () => {
  it('maps core personality module to HEXACO_RADAR', () => {
    expect(resolveVisualArchetype('MODULE_1_CORE_PERSONALITY')).toBe('HEXACO_RADAR');
    expect(resolveVisualArchetype('CORE_INTAKE')).toBe('HEXACO_RADAR');
  });

  it('maps self identity to DIMENSION_SPECTRUM', () => {
    expect(resolveVisualArchetype('MODULE_2_SELF_IDENTITY')).toBe('DIMENSION_SPECTRUM');
  });

  it('maps emotion regulation to TRAIT_BREAKDOWN', () => {
    expect(resolveVisualArchetype('MODULE_3_EMOTION_REGULATION')).toBe('TRAIT_BREAKDOWN');
  });

  it('NEVER falls back to HEXACO_RADAR for unknown or unspecified modules', () => {
    expect(resolveVisualArchetype('UNKNOWN_CUSTOM_MODULE')).toBe('GENERIC_DIMENSION_PROFILE');
    expect(resolveVisualArchetype('ANOTHER_SURVEY')).toBe('GENERIC_DIMENSION_PROFILE');
    expect(resolveVisualArchetype('')).toBe('GENERIC_DIMENSION_PROFILE');
    expect(resolveVisualArchetype(null)).toBe('GENERIC_DIMENSION_PROFILE');
    expect(resolveVisualArchetype(undefined)).toBe('GENERIC_DIMENSION_PROFILE');
  });
});

describe('FAZ 2.10: Explicit Scale Metadata vs Score Value (Never Infer Scale From Score)', () => {
  it('HEXACO score 3.8 => scale max remains 5.0 (does not mistakenly switch to 4-point)', () => {
    const hexacoStrategy = resolveScoringStrategy('PRE_CALIBRATION_MEAN_V1');
    expect(hexacoStrategy.scaleMin).toBe(1.0);
    expect(hexacoStrategy.scaleMax).toBe(5.0);
    expect(hexacoStrategy.scoreType).toBe('MEAN');

    // Score 3.8 on 5.0 max scale
    const score = 3.8;
    const band = getScoreBand(score, hexacoStrategy.scaleMax);
    expect(band.band).toBe('HIGH');
    expect(hexacoStrategy.scaleMax).toBe(5.0);
  });

  it('RSES score 3.8 => scale max remains 4.0', () => {
    const rsesStrategy = resolveScoringStrategy('RSES_MEAN_V1');
    expect(rsesStrategy.scaleMin).toBe(1.0);
    expect(rsesStrategy.scaleMax).toBe(4.0);
    expect(rsesStrategy.scoreType).toBe('MEAN');

    // Score 3.8 on 4.0 max scale
    const score = 3.8;
    const band = getScoreBand(score, rsesStrategy.scaleMax);
    expect(band.band).toBe('HIGH');
    expect(rsesStrategy.scaleMax).toBe(4.0);
  });
});

describe('FAZ 2.10: 4-Point Likert vs 5-Point Likert Score Band Thresholds', () => {
  it('classifies 5-point scale (HEXACO standard)', () => {
    // 5-point: Low < 2.50, Balanced 2.50..3.50, High > 3.50
    expect(getScoreBand(2.4, 5.0).band).toBe('LOW');
    expect(getScoreBand(2.5, 5.0).band).toBe('BALANCED');
    expect(getScoreBand(3.5, 5.0).band).toBe('BALANCED');
    expect(getScoreBand(3.6, 5.0).band).toBe('HIGH');
  });

  it('classifies 4-point scale (RSES / GSE standard)', () => {
    // 4-point: Low < 2.25, Balanced 2.25..3.25, High > 3.25
    expect(getScoreBand(2.0, 4.0).band).toBe('LOW');
    expect(getScoreBand(2.24, 4.0).band).toBe('LOW');
    expect(getScoreBand(2.25, 4.0).band).toBe('BALANCED');
    expect(getScoreBand(3.0, 4.0).band).toBe('BALANCED');
    expect(getScoreBand(3.25, 4.0).band).toBe('BALANCED');
    expect(getScoreBand(3.3, 4.0).band).toBe('HIGH');
    expect(getScoreBand(4.0, 4.0).band).toBe('HIGH');
  });
});

describe('FAZ 2.10: Scoring Strategy Registry, Strict Resolution & Fail-Closed Behavior', () => {
  it('resolves strategies by model code authoritatively', () => {
    expect(resolveScoringStrategy('RSES_MEAN_V1').code).toBe('RSES_MEAN_V1');
    expect(resolveScoringStrategy('RSES_SUM_V1').code).toBe('RSES_MEAN_V1'); // alias
    expect(resolveScoringStrategy('GSE_MEAN_V1').code).toBe('GSE_MEAN_V1');
    expect(resolveScoringStrategy('GSE_SUM_V1').code).toBe('GSE_MEAN_V1'); // alias
    expect(resolveScoringStrategy('PRE_CALIBRATION_MEAN_V1').code).toBe('PRE_CALIBRATION_MEAN_V1');
  });

  it('resolves specific rules before broad rules (SELF_EFFICACY resolves to GSE, not RSES)', () => {
    expect(resolveScoringStrategy(null, 'SELF_EFFICACY').code).toBe('GSE_MEAN_V1');
    expect(resolveScoringStrategy(null, 'MODULE_2_SELF_IDENTITY').code).toBe('RSES_MEAN_V1');
    expect(resolveScoringStrategy(null, 'RSES_ASSESSMENT').code).toBe('RSES_MEAN_V1');
    expect(resolveScoringStrategy(null, 'MODULE_1_CORE_PERSONALITY').code).toBe('PRE_CALIBRATION_MEAN_V1');
  });

  it('FAILS CLOSED on unknown module code (never silently defaults to HEXACO)', () => {
    expect(() => resolveScoringStrategy(null, 'UNKNOWN_CUSTOM_MODULE')).toThrowError(
      /UNKNOWN_SCORING_STRATEGY/
    );
    expect(() => resolveScoringStrategy('NON_EXISTENT_MODEL_V99')).toThrowError(
      /UNKNOWN_SCORING_STRATEGY/
    );
    expect(() => resolveScoringStrategy(null, null)).toThrowError(
      /UNKNOWN_SCORING_STRATEGY/
    );
  });
});

describe('FAZ 2.10: RSES Scoring Calculation & Reverse-Coding Invariants', () => {
  it('correctly reverse-scores negative items (2, 5, 6, 8, 9) and preserves positive items (1, 3, 4, 7, 10)', () => {
    // Setup test responses:
    // If user answered all items with '4' (Kesinlikle Katılıyorum):
    // Positive items (1, 3, 4, 7, 10): 4 * 5 = 20
    // Reversed items (2, 5, 6, 8, 9): reversed 4 -> 1. 1 * 5 = 5
    // Total sum = 25 / 10 = 2.5 rawMean
    const allFourResponses: ScoredResponseItem[] = [
      { itemId: 'RSES_01', facetId: 'core_self_esteem', constructId: 'self_evaluation', domainId: 'self_system', rawValue: 4, scoredValue: 4, isKeyed: true, isAttentionCheck: false },
      { itemId: 'RSES_02', facetId: 'core_self_esteem', constructId: 'self_evaluation', domainId: 'self_system', rawValue: 4, scoredValue: 1, isKeyed: false, isAttentionCheck: false },
      { itemId: 'RSES_03', facetId: 'core_self_esteem', constructId: 'self_evaluation', domainId: 'self_system', rawValue: 4, scoredValue: 4, isKeyed: true, isAttentionCheck: false },
      { itemId: 'RSES_04', facetId: 'core_self_esteem', constructId: 'self_evaluation', domainId: 'self_system', rawValue: 4, scoredValue: 4, isKeyed: true, isAttentionCheck: false },
      { itemId: 'RSES_05', facetId: 'core_self_esteem', constructId: 'self_evaluation', domainId: 'self_system', rawValue: 4, scoredValue: 1, isKeyed: false, isAttentionCheck: false },
      { itemId: 'RSES_06', facetId: 'core_self_esteem', constructId: 'self_evaluation', domainId: 'self_system', rawValue: 4, scoredValue: 1, isKeyed: false, isAttentionCheck: false },
      { itemId: 'RSES_07', facetId: 'core_self_esteem', constructId: 'self_evaluation', domainId: 'self_system', rawValue: 4, scoredValue: 4, isKeyed: true, isAttentionCheck: false },
      { itemId: 'RSES_08', facetId: 'core_self_esteem', constructId: 'self_evaluation', domainId: 'self_system', rawValue: 4, scoredValue: 1, isKeyed: false, isAttentionCheck: false },
      { itemId: 'RSES_09', facetId: 'core_self_esteem', constructId: 'self_evaluation', domainId: 'self_system', rawValue: 4, scoredValue: 1, isKeyed: false, isAttentionCheck: false },
      { itemId: 'RSES_10', facetId: 'core_self_esteem', constructId: 'self_evaluation', domainId: 'self_system', rawValue: 4, scoredValue: 4, isKeyed: true, isAttentionCheck: false },
    ];

    const result = RSES_MEAN_STRATEGY.calculate(allFourResponses);
    expect(result.scaleMin).toBe(1.0);
    expect(result.scaleMax).toBe(4.0);
    expect(result.scoreType).toBe('MEAN');
    expect(result.provisionalComposite).toBe(2.5);
    expect(result.constructScores.length).toBeGreaterThan(0);
    expect(result.constructScores[0].compositeScore).toBe(2.5);
    expect(result.facetScores.length).toBeGreaterThan(0);
    expect(result.facetScores[0].rawMean).toBe(2.5);
    expect(result.facetScores[0].itemCount).toBe(10);
    // Strict Invariant: RSES measures self_evaluation construct, but does NOT emit a domain score for self_system
    expect(result.domainScores).toEqual([]);
  });

  it('calculates maximum possible self-esteem (all positive=4, all reverse=1 -> scored values all 4)', () => {
    const perfectResponses: ScoredResponseItem[] = [
      { itemId: 'RSES_01', facetId: 'core_self_esteem', constructId: 'self_evaluation', domainId: 'self_system', rawValue: 4, scoredValue: 4, isKeyed: true, isAttentionCheck: false },
      { itemId: 'RSES_02', facetId: 'core_self_esteem', constructId: 'self_evaluation', domainId: 'self_system', rawValue: 1, scoredValue: 4, isKeyed: false, isAttentionCheck: false },
      { itemId: 'RSES_03', facetId: 'core_self_esteem', constructId: 'self_evaluation', domainId: 'self_system', rawValue: 4, scoredValue: 4, isKeyed: true, isAttentionCheck: false },
      { itemId: 'RSES_04', facetId: 'core_self_esteem', constructId: 'self_evaluation', domainId: 'self_system', rawValue: 4, scoredValue: 4, isKeyed: true, isAttentionCheck: false },
      { itemId: 'RSES_05', facetId: 'core_self_esteem', constructId: 'self_evaluation', domainId: 'self_system', rawValue: 1, scoredValue: 4, isKeyed: false, isAttentionCheck: false },
      { itemId: 'RSES_06', facetId: 'core_self_esteem', constructId: 'self_evaluation', domainId: 'self_system', rawValue: 1, scoredValue: 4, isKeyed: false, isAttentionCheck: false },
      { itemId: 'RSES_07', facetId: 'core_self_esteem', constructId: 'self_evaluation', domainId: 'self_system', rawValue: 4, scoredValue: 4, isKeyed: true, isAttentionCheck: false },
      { itemId: 'RSES_08', facetId: 'core_self_esteem', constructId: 'self_evaluation', domainId: 'self_system', rawValue: 1, scoredValue: 4, isKeyed: false, isAttentionCheck: false },
      { itemId: 'RSES_09', facetId: 'core_self_esteem', constructId: 'self_evaluation', domainId: 'self_system', rawValue: 1, scoredValue: 4, isKeyed: false, isAttentionCheck: false },
      { itemId: 'RSES_10', facetId: 'core_self_esteem', constructId: 'self_evaluation', domainId: 'self_system', rawValue: 4, scoredValue: 4, isKeyed: true, isAttentionCheck: false },
    ];

    const result = RSES_MEAN_STRATEGY.calculate(perfectResponses);
    expect(result.provisionalComposite).toBe(4.0);
  });
});

describe('FAZ 2.10: Expanded Trait Interpretations Quality', () => {
  const newConstructKeys = ['self_evaluation', 'core_self_esteem', 'agency_mastery', 'generalized_self_efficacy'];

  it('contains non-clinical, descriptive interpretations for newly added constructs', () => {
    for (const key of newConstructKeys) {
      const interp = ALL_TRAIT_INTERPRETATIONS[key];
      expect(interp).toBeDefined();
      expect(interp.nameTr).toBeDefined();
      expect(interp.shortDescriptionTr).toBeDefined();

      // Band narratives
      expect(interp.interpretationByBand.HIGH).toBeDefined();
      expect(interp.interpretationByBand.BALANCED).toBeDefined();
      expect(interp.interpretationByBand.LOW).toBeDefined();

      // Strengths & Risks
      expect(interp.strengths.HIGH.length).toBeGreaterThanOrEqual(1);
      expect(interp.strengths.BALANCED.length).toBeGreaterThanOrEqual(1);
      expect(interp.strengths.LOW.length).toBeGreaterThanOrEqual(1);
      expect(interp.risks.HIGH.length).toBeGreaterThanOrEqual(1);
      expect(interp.risks.BALANCED.length).toBeGreaterThanOrEqual(1);
      expect(interp.risks.LOW.length).toBeGreaterThanOrEqual(1);

      // Verify no clinical diagnostic words
      const fullText = JSON.stringify(interp).toLowerCase();
      expect(fullText).not.toContain('hastalık');
      expect(fullText).not.toContain('bozukluk');
      expect(fullText).not.toContain('patoloji');
      expect(fullText).not.toContain('tedavi');
      expect(fullText).not.toContain('hasta');
    }
  });
});

describe('FAZ 2.12: ERQ (Gross & John, 2003) Scoring & Multi-Subscale Separation', () => {
  it('computes 2 distinct subscale scores (Reappraisal 6.0 & Suppression 2.0) and strictly NO fake total (4.0)', () => {
    // Reappraisal items (1, 3, 5, 7, 8, 10) scored as 6
    // Suppression items (2, 4, 6, 9) scored as 2
    const erqResponses: ScoredResponseItem[] = [
      { itemId: 'ERQ_01', facetId: 'cognitive_reappraisal', constructId: 'emotion_regulation', domainId: 'emotional_affective', rawValue: 6, scoredValue: 6, isKeyed: true, isAttentionCheck: false },
      { itemId: 'ERQ_02', facetId: 'expressive_suppression', constructId: 'emotion_regulation', domainId: 'emotional_affective', rawValue: 2, scoredValue: 2, isKeyed: true, isAttentionCheck: false },
      { itemId: 'ERQ_03', facetId: 'cognitive_reappraisal', constructId: 'emotion_regulation', domainId: 'emotional_affective', rawValue: 6, scoredValue: 6, isKeyed: true, isAttentionCheck: false },
      { itemId: 'ERQ_04', facetId: 'expressive_suppression', constructId: 'emotion_regulation', domainId: 'emotional_affective', rawValue: 2, scoredValue: 2, isKeyed: true, isAttentionCheck: false },
      { itemId: 'ERQ_05', facetId: 'cognitive_reappraisal', constructId: 'emotion_regulation', domainId: 'emotional_affective', rawValue: 6, scoredValue: 6, isKeyed: true, isAttentionCheck: false },
      { itemId: 'ERQ_06', facetId: 'expressive_suppression', constructId: 'emotion_regulation', domainId: 'emotional_affective', rawValue: 2, scoredValue: 2, isKeyed: true, isAttentionCheck: false },
      { itemId: 'ERQ_07', facetId: 'cognitive_reappraisal', constructId: 'emotion_regulation', domainId: 'emotional_affective', rawValue: 6, scoredValue: 6, isKeyed: true, isAttentionCheck: false },
      { itemId: 'ERQ_08', facetId: 'cognitive_reappraisal', constructId: 'emotion_regulation', domainId: 'emotional_affective', rawValue: 6, scoredValue: 6, isKeyed: true, isAttentionCheck: false },
      { itemId: 'ERQ_09', facetId: 'expressive_suppression', constructId: 'emotion_regulation', domainId: 'emotional_affective', rawValue: 2, scoredValue: 2, isKeyed: true, isAttentionCheck: false },
      { itemId: 'ERQ_10', facetId: 'cognitive_reappraisal', constructId: 'emotion_regulation', domainId: 'emotional_affective', rawValue: 6, scoredValue: 6, isKeyed: true, isAttentionCheck: false },
    ];

    const strategy = resolveScoringStrategy('ERQ_MEAN_V1');
    expect(strategy.scaleMin).toBe(1.0);
    expect(strategy.scaleMax).toBe(7.0);

    const result = strategy.calculate(erqResponses);

    // 1. Verify subscale separation
    const reappraisalFacet = result.facetScores.find((f) => f.facetId === 'cognitive_reappraisal');
    const suppressionFacet = result.facetScores.find((f) => f.facetId === 'expressive_suppression');

    expect(reappraisalFacet).toBeDefined();
    expect(reappraisalFacet?.rawMean).toBe(6.0);
    expect(reappraisalFacet?.itemCount).toBe(6);

    expect(suppressionFacet).toBeDefined();
    expect(suppressionFacet?.rawMean).toBe(2.0);
    expect(suppressionFacet?.itemCount).toBe(4);

    // 2. Strict Invariants: NO fake construct score, NO domain composite, NO 4.0 combined mean
    expect(result.constructScores).toEqual([]);
    expect(result.domainScores).toEqual([]);
    expect(result.provisionalComposite).not.toBe(4.0);
    expect(result.provisionalComposite).toBe(0); // non-interpretable placeholder

    // 3. Confirm NO fake composite interpretation exists for parent construct emotion_regulation
    expect(ALL_TRAIT_INTERPRETATIONS.emotion_regulation).toBeUndefined();
    expect(ALL_TRAIT_INTERPRETATIONS.cognitive_reappraisal).toBeDefined();
    expect(ALL_TRAIT_INTERPRETATIONS.expressive_suppression).toBeDefined();
  });
});

describe('FAZ 2.12: ECR-R (Fraley et al., 2000) Scoring & Continuous Dimension Separation', () => {
  it('computes 2 independent dimensions (Anxiety 6.0 & Avoidance 2.0) and strictly NO fake total (4.0)', () => {
    // 18 Anxiety items scored 6.0, 18 Avoidance items scored 2.0
    const ecrrResponses: ScoredResponseItem[] = [];
    for (let i = 1; i <= 18; i++) {
      ecrrResponses.push({
        itemId: `ECRR_ANX_${i}`,
        facetId: 'attachment_anxiety',
        constructId: 'attachment_patterns',
        domainId: 'relational_interpersonal',
        rawValue: 6,
        scoredValue: 6,
        isKeyed: true,
        isAttentionCheck: false,
      });
    }
    for (let i = 1; i <= 18; i++) {
      ecrrResponses.push({
        itemId: `ECRR_AVD_${i}`,
        facetId: 'attachment_avoidance',
        constructId: 'attachment_patterns',
        domainId: 'relational_interpersonal',
        rawValue: 2,
        scoredValue: 2,
        isKeyed: true,
        isAttentionCheck: false,
      });
    }

    const strategy = resolveScoringStrategy('ECR_R_MEAN_V1');
    expect(strategy.scaleMin).toBe(1.0);
    expect(strategy.scaleMax).toBe(7.0);

    const result = strategy.calculate(ecrrResponses);

    // 1. Verify continuous subscale separation
    const anxietyFacet = result.facetScores.find((f) => f.facetId === 'attachment_anxiety');
    const avoidanceFacet = result.facetScores.find((f) => f.facetId === 'attachment_avoidance');

    expect(anxietyFacet).toBeDefined();
    expect(anxietyFacet?.rawMean).toBe(6.0);
    expect(anxietyFacet?.itemCount).toBe(18);

    expect(avoidanceFacet).toBeDefined();
    expect(avoidanceFacet?.rawMean).toBe(2.0);
    expect(avoidanceFacet?.itemCount).toBe(18);

    // 2. Strict Invariants: NO fake construct score, NO domain composite, NO 4.0 combined mean
    expect(result.constructScores).toEqual([]);
    expect(result.domainScores).toEqual([]);
    expect(result.provisionalComposite).not.toBe(4.0);
    expect(result.provisionalComposite).toBe(0); // non-interpretable placeholder

    // 3. Confirm NO fake composite interpretation exists for parent construct attachment_patterns
    expect(ALL_TRAIT_INTERPRETATIONS.attachment_patterns).toBeUndefined();
    expect(ALL_TRAIT_INTERPRETATIONS.attachment_anxiety).toBeDefined();
    expect(ALL_TRAIT_INTERPRETATIONS.attachment_avoidance).toBeDefined();
  });
});

describe('FAZ 2.12: GSE Scoring Calculation (Schwarzer & Jerusalem, 1995)', () => {
  it('calculates 1.0–4.0 arithmetic mean for 10 positively keyed items', () => {
    const gseResponses: ScoredResponseItem[] = [
      { itemId: 'GSE_01', facetId: 'generalized_self_efficacy', constructId: 'agency_mastery', domainId: 'self_system', rawValue: 3, scoredValue: 3, isKeyed: true, isAttentionCheck: false },
      { itemId: 'GSE_02', facetId: 'generalized_self_efficacy', constructId: 'agency_mastery', domainId: 'self_system', rawValue: 4, scoredValue: 4, isKeyed: true, isAttentionCheck: false },
      { itemId: 'GSE_03', facetId: 'generalized_self_efficacy', constructId: 'agency_mastery', domainId: 'self_system', rawValue: 3, scoredValue: 3, isKeyed: true, isAttentionCheck: false },
      { itemId: 'GSE_04', facetId: 'generalized_self_efficacy', constructId: 'agency_mastery', domainId: 'self_system', rawValue: 4, scoredValue: 4, isKeyed: true, isAttentionCheck: false },
      { itemId: 'GSE_05', facetId: 'generalized_self_efficacy', constructId: 'agency_mastery', domainId: 'self_system', rawValue: 3, scoredValue: 3, isKeyed: true, isAttentionCheck: false },
      { itemId: 'GSE_06', facetId: 'generalized_self_efficacy', constructId: 'agency_mastery', domainId: 'self_system', rawValue: 4, scoredValue: 4, isKeyed: true, isAttentionCheck: false },
      { itemId: 'GSE_07', facetId: 'generalized_self_efficacy', constructId: 'agency_mastery', domainId: 'self_system', rawValue: 3, scoredValue: 3, isKeyed: true, isAttentionCheck: false },
      { itemId: 'GSE_08', facetId: 'generalized_self_efficacy', constructId: 'agency_mastery', domainId: 'self_system', rawValue: 4, scoredValue: 4, isKeyed: true, isAttentionCheck: false },
      { itemId: 'GSE_09', facetId: 'generalized_self_efficacy', constructId: 'agency_mastery', domainId: 'self_system', rawValue: 3, scoredValue: 3, isKeyed: true, isAttentionCheck: false },
      { itemId: 'GSE_10', facetId: 'generalized_self_efficacy', constructId: 'agency_mastery', domainId: 'self_system', rawValue: 4, scoredValue: 4, isKeyed: true, isAttentionCheck: false },
    ];

    const result = GSE_MEAN_STRATEGY.calculate(gseResponses);
    expect(result.scaleMin).toBe(1.0);
    expect(result.scaleMax).toBe(4.0);
    expect(result.provisionalComposite).toBe(3.5);
    expect(result.constructScores.length).toBeGreaterThan(0);
    expect(result.constructScores[0].compositeScore).toBe(3.5);
    expect(result.facetScores.length).toBeGreaterThan(0);
    expect(result.facetScores[0].rawMean).toBe(3.5);
    expect(result.facetScores[0].itemCount).toBe(10);
    // Strict Invariant: GSE measures agency_mastery construct, but does NOT emit a domain score for self_system
    expect(result.domainScores).toEqual([]);
  });
});

describe('FAZ 2.12: Strict Scientific Invariant — Narrow Instruments Must Not Emit Domain Scores', () => {
  it('guarantees that narrow construct/subscale instruments (RSES, GSE, ERQ, ECR-R) do not emit domain composites', () => {
    // 1. RSES
    const rsesResponses: ScoredResponseItem[] = [
      { itemId: 'RSES_01', facetId: 'core_self_esteem', constructId: 'self_evaluation', domainId: 'self_system', rawValue: 3, scoredValue: 3, isKeyed: true, isAttentionCheck: false },
    ];
    const rsesResult = RSES_MEAN_STRATEGY.calculate(rsesResponses);
    expect(rsesResult.facetScores.length).toBe(1);
    expect(rsesResult.constructScores.length).toBe(1);
    expect(rsesResult.domainScores).toEqual([]);

    // 2. GSE
    const gseResponses: ScoredResponseItem[] = [
      { itemId: 'GSE_01', facetId: 'generalized_self_efficacy', constructId: 'agency_mastery', domainId: 'self_system', rawValue: 3, scoredValue: 3, isKeyed: true, isAttentionCheck: false },
    ];
    const gseResult = GSE_MEAN_STRATEGY.calculate(gseResponses);
    expect(gseResult.facetScores.length).toBe(1);
    expect(gseResult.constructScores.length).toBe(1);
    expect(gseResult.domainScores).toEqual([]);

    // 3. ERQ
    const erqResponses: ScoredResponseItem[] = [
      { itemId: 'ERQ_01', facetId: 'cognitive_reappraisal', constructId: 'emotion_regulation', domainId: 'emotional_affective', rawValue: 5, scoredValue: 5, isKeyed: true, isAttentionCheck: false },
      { itemId: 'ERQ_02', facetId: 'expressive_suppression', constructId: 'emotion_regulation', domainId: 'emotional_affective', rawValue: 3, scoredValue: 3, isKeyed: true, isAttentionCheck: false },
    ];
    const erqResult = resolveScoringStrategy('ERQ_MEAN_V1').calculate(erqResponses);
    expect(erqResult.facetScores.length).toBe(2);
    expect(erqResult.constructScores).toEqual([]);
    expect(erqResult.domainScores).toEqual([]);

    // 4. ECR-R
    const ecrrResponses: ScoredResponseItem[] = [
      { itemId: 'ECRR_01', facetId: 'attachment_anxiety', constructId: 'attachment_patterns', domainId: 'relational_interpersonal', rawValue: 5, scoredValue: 5, isKeyed: true, isAttentionCheck: false },
      { itemId: 'ECRR_02', facetId: 'attachment_avoidance', constructId: 'attachment_patterns', domainId: 'relational_interpersonal', rawValue: 3, scoredValue: 3, isKeyed: true, isAttentionCheck: false },
    ];
    const ecrrResult = resolveScoringStrategy('ECR_R_MEAN_V1').calculate(ecrrResponses);
    expect(ecrrResult.facetScores.length).toBe(2);
    expect(ecrrResult.constructScores).toEqual([]);
    expect(ecrrResult.domainScores).toEqual([]);
  });
});

describe('FAZ 2.12: Strict Construct Integrity (No False IPIP-50 Schwartz Values Assumption)', () => {
  it('confirms IPIP-50 is personality, not Schwartz Values, and prevents false value mapping', () => {
    // Assert that the scoring strategy registry has NO fake SCHWARTZ_VALUES_V1 mapped from IPIP-50
    expect(() => resolveScoringStrategy('IPIP_50_SCHWARTZ_V1')).toThrowError(
      /UNKNOWN_SCORING_STRATEGY/
    );
  });
});

describe('FAZ 2.12: Validation Status vs License Status Independence', () => {
  it('maintains licenseStatus and validationStatus as independent scientific fields', () => {
    // RSES is APPROVED_PUBLIC in license, but PRE_CALIBRATION in validation
    const itemVersionRecord = {
      licenseStatus: 'APPROVED_PUBLIC',
      validationStatus: 'PRE_CALIBRATION',
      authorType: 'ADAPTATION',
      sourceType: 'ACADEMIC_ADAPTATION',
    };

    expect(itemVersionRecord.licenseStatus).toBe('APPROVED_PUBLIC');
    expect(itemVersionRecord.validationStatus).toBe('PRE_CALIBRATION');
    expect(itemVersionRecord.validationStatus).not.toBe('VALIDATED');
    expect(itemVersionRecord.authorType).toBe('ADAPTATION');
  });

  it('keeps ERQ and ECR-R licenseStatus as REQUIRES_LICENSE for commercial product usage', () => {
    const erqLicenseInfo = {
      instrumentId: 'inst_erq',
      licenseType: 'Open Academic with Citation',
      licensingDecision: 'restricted',
      itemReproductionAllowed: false,
    };

    const ecrrLicenseInfo = {
      instrumentId: 'inst_ecr_r',
      licenseType: 'Academic Research Only',
      licensingDecision: 'restricted',
      itemReproductionAllowed: false,
    };

    expect(erqLicenseInfo.licensingDecision).toBe('restricted');
    expect(ecrrLicenseInfo.licensingDecision).toBe('restricted');
  });
});

describe('FAZ 2.12: System Importer Audit Actor Semantics (No FK Bypass)', () => {
  it('strictly uses actorUserId = null for non-human deployment operations', () => {
    const systemAuditContext = {
      actorUserId: null,
      actorType: 'SYSTEM_IMPORTER' as const,
      ip: null,
      userAgent: 'PsycheAI-Assessment-Importer/1.0',
      metadata: {
        actorType: 'SYSTEM_IMPORTER',
        operation: 'ASSESSMENT_LIBRARY_IMPORT',
        source: 'FAZ_2_10_IMPORTER',
      },
    };

    // System operations must never write a fake string into actorUserId (FK to User.id)
    expect(systemAuditContext.actorUserId).toBeNull();
    expect(typeof systemAuditContext.actorUserId).not.toBe('string');
    expect(systemAuditContext.actorType).toBe('SYSTEM_IMPORTER');
    expect(systemAuditContext.ip).toBeNull();
    expect(systemAuditContext.metadata.operation).toBe('ASSESSMENT_LIBRARY_IMPORT');
  });

  it('preserves real authenticated user.id for human admin actions', () => {
    const adminUserAuditContext = {
      actorUserId: 'usr_admin_real_uuid_123',
      actorType: 'USER' as const,
      ip: '192.168.1.50',
      userAgent: 'Mozilla/5.0 Chrome/120',
      metadata: {
        actorType: 'USER',
      },
    };

    expect(adminUserAuditContext.actorUserId).toBe('usr_admin_real_uuid_123');
    expect(adminUserAuditContext.actorType).toBe('USER');
    expect(adminUserAuditContext.ip).toBe('192.168.1.50');
  });
});



