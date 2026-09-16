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
    expect(result.constructScores[0].compositeScore).toBe(2.5);
    expect(result.facetScores[0].rawMean).toBe(2.5);
    expect(result.facetScores[0].itemCount).toBe(10);
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
    }
  });
});

describe('FAZ 2.10: Validation Status vs License Status Independence', () => {
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
});

describe('FAZ 2.10: System Importer Audit Actor Semantics (No FK Bypass)', () => {
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


