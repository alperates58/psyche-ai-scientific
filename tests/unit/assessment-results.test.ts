import { describe, it, expect } from 'vitest';
import {
  getScoreBand,
  ASSESSMENT_VISUAL_REGISTRY,
  HEXACO_CONSTRUCT_INTERPRETATIONS,
  TRAIT_DYNAMIC_RULES,
  deriveKeyObservations,
} from '../../src/lib/assessmentInterpretationConfig';

describe('FAZ 2.9: Score Band Classification Logic', () => {
  it('correctly classifies LOW score bands below 2.50', () => {
    const low1 = getScoreBand(1.0);
    expect(low1.band).toBe('LOW');
    expect(low1.labelTr).toBe('Daha Düşük Eğilim');

    const lowBoundary = getScoreBand(2.49);
    expect(lowBoundary.band).toBe('LOW');
  });

  it('correctly classifies BALANCED score bands between 2.50 and 3.50 inclusive', () => {
    const balancedMin = getScoreBand(2.5);
    expect(balancedMin.band).toBe('BALANCED');
    expect(balancedMin.labelTr).toBe('Dengeli / Orta Düzey Eğilim');

    const balancedMid = getScoreBand(3.0);
    expect(balancedMid.band).toBe('BALANCED');

    const balancedMax = getScoreBand(3.5);
    expect(balancedMax.band).toBe('BALANCED');
  });

  it('correctly classifies HIGH score bands above 3.50', () => {
    const highBoundary = getScoreBand(3.51);
    expect(highBoundary.band).toBe('HIGH');
    expect(highBoundary.labelTr).toBe('Daha Yüksek Eğilim');

    const high5 = getScoreBand(5.0);
    expect(high5.band).toBe('HIGH');
  });
});

describe('FAZ 2.9: Assessment Visual Registry', () => {
  it('maps core personality module to HEXACO_RADAR', () => {
    expect(ASSESSMENT_VISUAL_REGISTRY['MODULE_1_CORE_PERSONALITY']).toBe('HEXACO_RADAR');
    expect(ASSESSMENT_VISUAL_REGISTRY['CORE_INTAKE']).toBe('HEXACO_RADAR');
  });

  it('maps modular deep dives to TRAIT_BREAKDOWN', () => {
    expect(ASSESSMENT_VISUAL_REGISTRY['MODULE_2_SELF_IDENTITY']).toBe('TRAIT_BREAKDOWN');
    expect(ASSESSMENT_VISUAL_REGISTRY['MODULE_3_EMOTION_REGULATION']).toBe('TRAIT_BREAKDOWN');
    expect(ASSESSMENT_VISUAL_REGISTRY['MODULE_4_VOLITION_CONTROL']).toBe('TRAIT_BREAKDOWN');
  });
});

describe('FAZ 2.9: Deterministic Key Observations Derivation', () => {
  it('identifies salient high and low traits first', () => {
    const traits = [
      { code: 'conscientiousness', nameTr: 'Sorumluluk', compositeScore: 4.8 },
      { code: 'emotionality', nameTr: 'Duygusallık', compositeScore: 1.4 },
      { code: 'extraversion', nameTr: 'Dışadönüklük', compositeScore: 3.1 },
      { code: 'agreeableness', nameTr: 'Uyumluluk', compositeScore: 3.0 },
    ];

    const observations = deriveKeyObservations(traits);
    expect(observations.length).toBeGreaterThanOrEqual(2);
    expect(observations.length).toBeLessThanOrEqual(4);

    // Conscientiousness and Emotionality are furthest from 3.0
    expect(observations[0]).toContain('Sorumluluk');
    expect(observations[0]).toContain('yüksek eğilim');
    expect(observations[1]).toContain('Duygusallık');
    expect(observations[1]).toContain('daha düşük eğilim');
  });

  it('generates a balanced profile observation when traits are near the center', () => {
    const balancedTraits = [
      { code: 'honesty_humility', nameTr: 'Dürüstlük-Alçakgönüllülük', compositeScore: 3.0 },
      { code: 'emotionality', nameTr: 'Duygusallık', compositeScore: 3.1 },
      { code: 'extraversion', nameTr: 'Dışadönüklük', compositeScore: 2.9 },
      { code: 'agreeableness', nameTr: 'Uyumluluk', compositeScore: 3.2 },
      { code: 'conscientiousness', nameTr: 'Sorumluluk', compositeScore: 3.0 },
      { code: 'openness_to_experience', nameTr: 'Deneyime Açıklık', compositeScore: 3.1 },
    ];

    const observations = deriveKeyObservations(balancedTraits);
    expect(observations.length).toBeGreaterThanOrEqual(1);
    expect(observations.some((o) => o.includes('dengeli bir dağılım'))).toBe(true);
  });
});

describe('FAZ 2.9: Cross-Trait Dynamic Rules (Synergies & Tensions)', () => {
  it('evaluates Goal Execution synergy for High Extraversion + High Conscientiousness', () => {
    const goalRule = TRAIT_DYNAMIC_RULES.find((r) => r.id === 'goal_execution_dynamic')!;
    expect(goalRule).toBeDefined();

    expect(goalRule.condition({ extraversion: 4.2, conscientiousness: 4.0 })).toBe(true);
    expect(goalRule.condition({ extraversion: 4.2, conscientiousness: 3.2 })).toBe(false);
  });

  it('evaluates Stress Sensitivity tension for High Emotionality + Low Agreeableness', () => {
    const stressRule = TRAIT_DYNAMIC_RULES.find((r) => r.id === 'stress_sensitivity_friction')!;
    expect(stressRule).toBeDefined();

    expect(stressRule.condition({ emotionality: 4.0, agreeableness: 2.0 })).toBe(true);
    expect(stressRule.condition({ emotionality: 4.0, agreeableness: 3.0 })).toBe(false);
  });

  it('evaluates Trusted Collaboration synergy for High Honesty + High Agreeableness', () => {
    const trustRule = TRAIT_DYNAMIC_RULES.find((r) => r.id === 'trusted_collaboration_dynamic')!;
    expect(trustRule).toBeDefined();

    expect(trustRule.condition({ honesty_humility: 4.5, agreeableness: 4.2 })).toBe(true);
  });

  it('evaluates Exploratory Focus tension for High Openness + Low Conscientiousness', () => {
    const exploreRule = TRAIT_DYNAMIC_RULES.find((r) => r.id === 'exploratory_focus_tension')!;
    expect(exploreRule).toBeDefined();

    expect(exploreRule.condition({ openness_to_experience: 4.4, conscientiousness: 2.1 })).toBe(true);
  });
});

describe('FAZ 2.9: Construct Interpretations Completeness', () => {
  const hexacoKeys = [
    'honesty_humility',
    'emotionality',
    'extraversion',
    'agreeableness',
    'conscientiousness',
    'openness_to_experience',
  ];

  it('provides complete interpretations, strengths, and risks for all 6 HEXACO constructs', () => {
    for (const key of hexacoKeys) {
      const def = HEXACO_CONSTRUCT_INTERPRETATIONS[key];
      expect(def).toBeDefined();
      expect(def.nameTr).toBeDefined();
      expect(def.interpretationByBand.HIGH).toBeDefined();
      expect(def.interpretationByBand.BALANCED).toBeDefined();
      expect(def.interpretationByBand.LOW).toBeDefined();

      expect(def.strengths.HIGH.length).toBeGreaterThanOrEqual(1);
      expect(def.strengths.BALANCED.length).toBeGreaterThanOrEqual(1);
      expect(def.strengths.LOW.length).toBeGreaterThanOrEqual(1);

      expect(def.risks.HIGH.length).toBeGreaterThanOrEqual(1);
      expect(def.risks.BALANCED.length).toBeGreaterThanOrEqual(1);
      expect(def.risks.LOW.length).toBeGreaterThanOrEqual(1);
    }
  });
});
