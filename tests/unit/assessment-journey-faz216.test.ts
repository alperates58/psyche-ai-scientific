import { describe, it, expect } from 'vitest';
import {
  ASSESSMENT_MODULE_PORTFOLIO,
  ASSESSMENT_CATALOG_CATEGORIES,
  JOURNEY_STAGES,
  calculateCumulativeQuestionBudget,
  resolveActiveModuleBudget,
  LEGACY_FORM_CODES,
  getModuleJourneyMetadata,
} from '../../src/lib/assessmentJourneyConfig';
import {
  deriveUserJourneyStage,
  deriveProfileDepth,
  determineNextBestAction,
  AssessmentJourneyItem,
} from '../../src/services/assessmentJourneyService';
import { resolveScoringStrategy } from '../../src/lib/scoringStrategies';

describe('FAZ 2.16: Assessment Module Portfolio & Discovery Categories', () => {
  it('contains exactly 16 modules covering 11 master domains', () => {
    expect(ASSESSMENT_MODULE_PORTFOLIO.length).toBe(16);

    const stages = new Set(ASSESSMENT_MODULE_PORTFOLIO.map((m) => m.stage));
    expect(stages.has('CORE')).toBe(true);
    expect(stages.has('EXPANSION')).toBe(true);
    expect(stages.has('DEEP')).toBe(true);
    expect(stages.has('ADVANCED')).toBe(true);

    const coreModules = ASSESSMENT_MODULE_PORTFOLIO.filter((m) => m.stage === 'CORE');
    const expansionModules = ASSESSMENT_MODULE_PORTFOLIO.filter((m) => m.stage === 'EXPANSION');
    const deepModules = ASSESSMENT_MODULE_PORTFOLIO.filter((m) => m.stage === 'DEEP');
    const advancedModules = ASSESSMENT_MODULE_PORTFOLIO.filter((m) => m.stage === 'ADVANCED');

    expect(coreModules.length).toBe(4);
    expect(expansionModules.length).toBe(4);
    expect(deepModules.length).toBe(7);
    expect(advancedModules.length).toBe(1);
  });

  it('contains exactly 7 product discovery categories with rich metadata', () => {
    const categoryKeys = Object.keys(ASSESSMENT_CATALOG_CATEGORIES);
    expect(categoryKeys.length).toBe(7);
    expect(categoryKeys).toEqual([
      'PERSONALITY',
      'SELF_REGULATION',
      'EMOTION',
      'COGNITION',
      'MOTIVATION_VALUES',
      'RELATIONSHIPS',
      'ADVANCED',
    ]);

    for (const key of categoryKeys) {
      const cat = ASSESSMENT_CATALOG_CATEGORIES[key as keyof typeof ASSESSMENT_CATALOG_CATEGORIES];
      expect(cat.titleTr).toBeDefined();
      expect(cat.descriptionTr).toBeDefined();
      expect(cat.iconName).toBeDefined();
    }
  });

  it('isolates historical forms in LEGACY_FORM_CODES', () => {
    expect(LEGACY_FORM_CODES).toContain('form_hexaco_v1_0_0');
  });
});

describe('FAZ 2.16: Dynamic Question Budgets (No Hardcoded Ceiling)', () => {
  it('calculates stage question budgets dynamically from portfolio', () => {
    const budget = calculateCumulativeQuestionBudget(ASSESSMENT_MODULE_PORTFOLIO);

    expect(budget.coreQuestions).toBe(108);
    expect(budget.expansionQuestions).toBe(157);
    expect(budget.expansionCumulativeQuestions).toBe(265);
    expect(budget.deepQuestions).toBe(166);
    expect(budget.comprehensiveCumulativeQuestions).toBe(431);
    expect(budget.advancedQuestions).toBe(28);
    expect(budget.advancedTotalQuestions).toBe(459);
  });

  it('resolves active module budget on-demand', () => {
    expect(resolveActiveModuleBudget('mod_core_hexaco_60')).toBe(60);
    expect(resolveActiveModuleBudget('mod_self_agency')).toBe(20);
    expect(resolveActiveModuleBudget('mod_emotion_regulation')).toBe(10);
    expect(resolveActiveModuleBudget('mod_cognitive_epistemic')).toBe(18);
    expect(resolveActiveModuleBudget('mod_dark_tetrad_advanced')).toBe(28);
  });
});

describe('FAZ 2.16: User Journey Stage Transitions', () => {
  it('returns ONBOARDING when no modules completed and nothing in progress', () => {
    const stage = deriveUserJourneyStage({
      completedAssessmentCodes: [],
      inProgressAssessmentCodes: [],
      hasLegacyForm: false,
    });

    expect(stage.stageKey).toBe('ONBOARDING');
    expect(stage.targetDepthLevel).toBe('STARTING');
    expect(stage.titleTr).toContain('Başlangıç');
  });

  it('returns FIRST_PROFILE when 1-3 core modules completed or in progress', () => {
    const stage = deriveUserJourneyStage({
      completedAssessmentCodes: ['mod_core_hexaco_60'],
      inProgressAssessmentCodes: [],
      hasLegacyForm: false,
    });

    expect(stage.stageKey).toBe('FIRST_PROFILE');
    expect(stage.targetDepthLevel).toBe('CORE');
  });

  it('transitions to PROFILE_EXPANSION when all 4 core modules completed', () => {
    const stage = deriveUserJourneyStage({
      completedAssessmentCodes: [
        'mod_core_hexaco_60',
        'mod_self_agency',
        'mod_emotion_regulation',
        'mod_cognitive_epistemic',
      ],
      inProgressAssessmentCodes: [],
      hasLegacyForm: false,
    });

    expect(stage.stageKey).toBe('PROFILE_EXPANSION');
    expect(stage.targetDepthLevel).toBe('EXPANDED');
  });

  it('transitions to DEEP_PROFILE when all 8 core+expansion modules completed', () => {
    const stage = deriveUserJourneyStage({
      completedAssessmentCodes: [
        'mod_core_hexaco_60',
        'mod_self_agency',
        'mod_emotion_regulation',
        'mod_cognitive_epistemic',
        'mod_volition_impulse',
        'mod_basic_needs_sdt',
        'mod_universal_values',
        'mod_relational_attachment_empathy',
      ],
      inProgressAssessmentCodes: [],
      hasLegacyForm: false,
    });

    expect(stage.stageKey).toBe('DEEP_PROFILE');
    expect(stage.targetDepthLevel).toBe('COMPREHENSIVE');
  });

  it('transitions to COMPREHENSIVE_COMPLETE when all 15 consumer modules completed', () => {
    const all15ConsumerCodes = ASSESSMENT_MODULE_PORTFOLIO
      .filter((m) => m.stage !== 'ADVANCED')
      .map((m) => m.moduleCode);

    const stage = deriveUserJourneyStage({
      completedAssessmentCodes: all15ConsumerCodes,
      inProgressAssessmentCodes: [],
      hasLegacyForm: false,
    });

    expect(stage.stageKey).toBe('COMPREHENSIVE_COMPLETE');
    expect(stage.targetDepthLevel).toBe('COMPREHENSIVE');
  });
});

describe('FAZ 2.16: Profile Depth Measurement (Not Labeled Accuracy/Confidence)', () => {
  it('computes depth levels strictly based on coverage and questions answered', () => {
    const initialDepth = deriveProfileDepth({
      completedFacetsCount: 0,
      totalOntologyFacets: 91,
      completedQuestionsCount: 0,
      totalQuestionsCount: 431,
      completedModulesCount: 0,
      totalModulesCount: 15,
    });

    expect(initialDepth.depthLevel).toBe('BAŞLANGIÇ');
    expect(initialDepth.depthPercentage).toBe(0);

    const coreDepth = deriveProfileDepth({
      completedFacetsCount: 31,
      totalOntologyFacets: 91,
      completedQuestionsCount: 108,
      totalQuestionsCount: 431,
      completedModulesCount: 4,
      totalModulesCount: 15,
    });

    expect(coreDepth.depthLevel).toBe('TEMEL');
    expect(coreDepth.depthPercentage).toBeGreaterThan(20);

    const comprehensiveDepth = deriveProfileDepth({
      completedFacetsCount: 87,
      totalOntologyFacets: 91,
      completedQuestionsCount: 431,
      totalQuestionsCount: 431,
      completedModulesCount: 15,
      totalModulesCount: 15,
    });

    expect(comprehensiveDepth.depthLevel).toBe('KAPSAMLI');
    expect(comprehensiveDepth.depthPercentage).toBeGreaterThanOrEqual(95);
  });
});

describe('FAZ 2.16: Multi-Instrument Containers & Scoring Independence', () => {
  it('resolves multi-instrument scoring strategies with independent subscales', () => {
    const selfAgencyStrategy = resolveScoringStrategy('SELF_AGENCY_PRECALIBRATION_V1', 'mod_self_agency');
    expect(selfAgencyStrategy.code).toBe('SELF_AGENCY_PRECALIBRATION_V1');
    expect(selfAgencyStrategy.scaleMin).toBe(1.0);
    expect(selfAgencyStrategy.scaleMax).toBe(4.0);

    const erqStrategy = resolveScoringStrategy('ERQ_MEAN_V1', 'mod_emotion_regulation');
    expect(erqStrategy.code).toBe('ERQ_MEAN_V1');
    expect(erqStrategy.scaleMin).toBe(1.0);
    expect(erqStrategy.scaleMax).toBe(7.0);

    const ecrrStrategy = resolveScoringStrategy('ECR_R_MEAN_V1', 'mod_relational_attachment_empathy');
    expect(ecrrStrategy.code).toBe('ECR_R_MEAN_V1');
    expect(ecrrStrategy.scaleMin).toBe(1.0);
    expect(ecrrStrategy.scaleMax).toBe(7.0);
  });
});

describe('FAZ 2.16: Deterministic Next Best Action & Advisory Breaks', () => {
  const mockItems: AssessmentJourneyItem[] = [
    {
      moduleId: 'mod_core_hexaco_60',
      moduleCode: 'mod_core_hexaco_60',
      title: 'Temel Kişilik Boyutları',
      classification: 'REQUIRED',
      priority: 1,
      status: 'IN_PROGRESS',
      progressPercentage: 45,
      estimatedMinutes: 12,
      itemCount: 60,
      formVersionCode: 'form_hexaco_60_v1_0_0',
      startOrResumeUrl: '/assessment?module=mod_core_hexaco_60',
    },
    {
      moduleId: 'mod_self_agency',
      moduleCode: 'mod_self_agency',
      title: 'Benlik Sistemi ve Öz-Yetkinlik',
      classification: 'REQUIRED',
      priority: 2,
      status: 'NOT_STARTED',
      progressPercentage: 0,
      estimatedMinutes: 4,
      itemCount: 20,
      formVersionCode: 'form_self_agency_v1_0_0',
      startOrResumeUrl: '/assessment?module=mod_self_agency',
    },
  ];

  it('prioritizes resuming an in-progress session over starting a new one', () => {
    const next = determineNextBestAction(mockItems);
    expect(next).not.toBeNull();
    expect(next!.assessment.moduleId).toBe('mod_core_hexaco_60');
    expect(next!.ctaText).toBe('Kaldığın Yerden Devam Et');
    expect(next!.status).toBe('IN_PROGRESS');
  });

  it('selects next required assessment when previous is completed', () => {
    const updatedItems = mockItems.map((item) =>
      item.moduleId === 'mod_core_hexaco_60'
        ? { ...item, status: 'COMPLETED' as const, progressPercentage: 100 }
        : item
    );

    const next = determineNextBestAction(updatedItems);
    expect(next).not.toBeNull();
    expect(next!.assessment.moduleId).toBe('mod_self_agency');
    expect(next!.ctaText).toBe('Değerlendirmeye Başla');
    expect(next!.status).toBe('NOT_STARTED');
  });
});
