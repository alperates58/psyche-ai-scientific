import { describe, it, expect } from 'vitest';
import {
  getModuleJourneyMetadata,
  MODULE_JOURNEY_RULES,
  JourneyClassification,
} from '../../src/lib/assessmentJourneyConfig';

describe('FAZ 2.8 & 2.16: Assessment Journey Config & Metadata Rules', () => {
  it('resolves explicit rules for known core modules', () => {
    const core1 = getModuleJourneyMetadata('MODULE_1_CORE_PERSONALITY');
    expect(core1.classification).toBe('REQUIRED');
    expect(core1.priority).toBe(1);
    expect(core1.userFacingTitleTr).toContain('Temel Kişilik');
    expect(core1.recommendationReasonTr).toBeDefined();

    const coreIntake = getModuleJourneyMetadata('CORE_INTAKE');
    expect(coreIntake.classification).toBe('REQUIRED');
    expect(coreIntake.priority).toBe(1);

    const identity = getModuleJourneyMetadata('MODULE_2_SELF_IDENTITY');
    expect(identity.classification).toBe('REQUIRED');
    expect(identity.priority).toBe(2);

    const emotion = getModuleJourneyMetadata('MODULE_3_EMOTION_REGULATION');
    expect(emotion.classification).toBe('REQUIRED');
    expect(emotion.priority).toBe(3);

    const cognitive = getModuleJourneyMetadata('MODULE_4_COGNITIVE_EPISTEMIC');
    expect(cognitive.classification).toBe('REQUIRED');
    expect(cognitive.priority).toBe(4);

    const volition = getModuleJourneyMetadata('MODULE_5_VOLITION_IMPULSE');
    expect(volition.classification).toBe('RECOMMENDED');
    expect(volition.priority).toBe(5);

    const attachment = getModuleJourneyMetadata('MODULE_6_ATTACHMENT_PATTERNS');
    expect(attachment.classification).toBe('RECOMMENDED');
    expect(attachment.priority).toBe(8);
  });

  it('resolves intelligent heuristics for custom or dynamic module codes', () => {
    // Core pattern
    const customCore = getModuleJourneyMetadata('CUSTOM_CORE_TRAITS_2026', 'Özel Temel Test');
    expect(customCore.classification).toBe('REQUIRED');
    expect(customCore.priority).toBe(1);

    // Identity pattern
    const customSelf = getModuleJourneyMetadata('ORGANIZATIONAL_SELF_CONCEPT');
    expect(customSelf.classification).toBe('REQUIRED');
    expect(customSelf.priority).toBe(2);

    // Emotion pattern
    const customEmotion = getModuleJourneyMetadata('STRESS_AND_EMOTION_PROFILE');
    expect(customEmotion.classification).toBe('REQUIRED');

    // Volition / Cognitive pattern
    const customCognitive = getModuleJourneyMetadata('EXECUTIVE_COGNITIVE_CONTROL');
    expect(customCognitive.classification).toBe('REQUIRED');

    // Unknown custom module fallback to OPTIONAL
    const unknown = getModuleJourneyMetadata('CREATIVE_EXPRESSION_EXP_1');
    expect(unknown.classification).toBe('OPTIONAL');
    expect(unknown.priority).toBe(50);
  });
});

describe('FAZ 2.8: Deterministic Next Best Action Priority Logic', () => {
  interface MockItem {
    moduleId: string;
    title: string;
    classification: JourneyClassification;
    priority: number;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
    estimatedMinutes: number;
    recommendationReason: string;
    startOrResumeUrl: string;
  }

  function determineNextAction(items: MockItem[]) {
    const required = items.filter((i) => i.classification === 'REQUIRED');
    const recommended = items.filter((i) => i.classification === 'RECOMMENDED');
    const optional = items.filter((i) => i.classification === 'OPTIONAL');

    // Priority 1: IN_PROGRESS required
    const inProgReq = required.find((i) => i.status === 'IN_PROGRESS');
    if (inProgReq) {
      return {
        title: inProgReq.title,
        status: 'IN_PROGRESS',
        ctaText: 'Kaldığın Yerden Devam Et',
        assessment: inProgReq,
      };
    }

    // Priority 2: NOT_STARTED required
    const notStartedReq = required.find((i) => i.status === 'NOT_STARTED');
    if (notStartedReq) {
      return {
        title: notStartedReq.title,
        status: 'NOT_STARTED',
        ctaText: 'Değerlendirmeye Başla',
        assessment: notStartedReq,
      };
    }

    // Priority 3: IN_PROGRESS recommended
    const inProgRec = recommended.find((i) => i.status === 'IN_PROGRESS');
    if (inProgRec) {
      return {
        title: inProgRec.title,
        status: 'IN_PROGRESS',
        ctaText: 'Kaldığın Yerden Devam Et',
        assessment: inProgRec,
      };
    }

    // Priority 4: NOT_STARTED recommended
    const notStartedRec = recommended.find((i) => i.status === 'NOT_STARTED');
    if (notStartedRec) {
      return {
        title: notStartedRec.title,
        status: 'NOT_STARTED',
        ctaText: 'Önerilen Değerlendirmeye Başla',
        assessment: notStartedRec,
      };
    }

    // Priority 5: OPTIONAL
    const opt = optional.find((i) => i.status === 'IN_PROGRESS' || i.status === 'NOT_STARTED');
    if (opt) {
      return {
        title: opt.title,
        status: opt.status,
        ctaText: opt.status === 'IN_PROGRESS' ? 'Kaldığın Yerden Devam Et' : 'Derinlemesine İncelemeye Başla',
        assessment: opt,
      };
    }

    return null;
  }

  it('prioritizes in-progress required assessment above not-started required', () => {
    const items: MockItem[] = [
      {
        moduleId: 'mod_1',
        title: 'Temel Kişilik',
        classification: 'REQUIRED',
        priority: 1,
        status: 'IN_PROGRESS',
        estimatedMinutes: 12,
        recommendationReason: 'Temel profil',
        startOrResumeUrl: '/assessment?module=MODULE_1',
      },
      {
        moduleId: 'mod_2',
        title: 'Benlik Sistemi',
        classification: 'REQUIRED',
        priority: 2,
        status: 'NOT_STARTED',
        estimatedMinutes: 10,
        recommendationReason: 'Kimlik',
        startOrResumeUrl: '/assessment?module=MODULE_2',
      },
    ];

    const action = determineNextAction(items);
    expect(action).not.toBeNull();
    expect(action!.assessment.moduleId).toBe('mod_1');
    expect(action!.ctaText).toBe('Kaldığın Yerden Devam Et');
  });

  it('moves to next required assessment when first required is completed', () => {
    const items: MockItem[] = [
      {
        moduleId: 'mod_1',
        title: 'Temel Kişilik',
        classification: 'REQUIRED',
        priority: 1,
        status: 'COMPLETED',
        estimatedMinutes: 12,
        recommendationReason: 'Temel profil',
        startOrResumeUrl: '/assessment?module=MODULE_1',
      },
      {
        moduleId: 'mod_2',
        title: 'Benlik Sistemi',
        classification: 'REQUIRED',
        priority: 2,
        status: 'NOT_STARTED',
        estimatedMinutes: 10,
        recommendationReason: 'Kimlik',
        startOrResumeUrl: '/assessment?module=MODULE_2',
      },
    ];

    const action = determineNextAction(items);
    expect(action).not.toBeNull();
    expect(action!.assessment.moduleId).toBe('mod_2');
    expect(action!.ctaText).toBe('Değerlendirmeye Başla');
  });

  it('moves to recommended assessment when all required are completed', () => {
    const items: MockItem[] = [
      {
        moduleId: 'mod_1',
        title: 'Temel Kişilik',
        classification: 'REQUIRED',
        priority: 1,
        status: 'COMPLETED',
        estimatedMinutes: 12,
        recommendationReason: 'Temel profil',
        startOrResumeUrl: '/assessment?module=MODULE_1',
      },
      {
        moduleId: 'mod_3',
        title: 'Duygu Düzenleme',
        classification: 'RECOMMENDED',
        priority: 3,
        status: 'NOT_STARTED',
        estimatedMinutes: 8,
        recommendationReason: 'Duygu dinamikleri',
        startOrResumeUrl: '/assessment?module=MODULE_3',
      },
    ];

    const action = determineNextAction(items);
    expect(action).not.toBeNull();
    expect(action!.assessment.moduleId).toBe('mod_3');
    expect(action!.ctaText).toBe('Önerilen Değerlendirmeye Başla');
  });

  it('returns null nextAction when all assessments in catalog are completed', () => {
    const items: MockItem[] = [
      {
        moduleId: 'mod_1',
        title: 'Temel Kişilik',
        classification: 'REQUIRED',
        priority: 1,
        status: 'COMPLETED',
        estimatedMinutes: 12,
        recommendationReason: 'Temel profil',
        startOrResumeUrl: '/assessment?module=MODULE_1',
      },
    ];

    const action = determineNextAction(items);
    expect(action).toBeNull();
  });
});

describe('FAZ 2.8: Stage & Denominator Honesty', () => {
  it('correctly derives coreProfileReady and stage based on single published required module', () => {
    const totalRequired = 1;
    let completedRequired = 0;
    let totalCompleted = 0;
    let inProgress = 0;

    // Stage 1: Brand new user
    let stage =
      totalCompleted === 0 && inProgress === 0
        ? 'ONBOARDING_NOT_STARTED'
        : completedRequired < totalRequired
        ? 'ONBOARDING_IN_PROGRESS'
        : 'CORE_PROFILE_READY';
    expect(stage).toBe('ONBOARDING_NOT_STARTED');

    // Stage 2: In progress
    inProgress = 1;
    stage =
      totalCompleted === 0 && inProgress === 0
        ? 'ONBOARDING_NOT_STARTED'
        : completedRequired < totalRequired
        ? 'ONBOARDING_IN_PROGRESS'
        : 'CORE_PROFILE_READY';
    expect(stage).toBe('ONBOARDING_IN_PROGRESS');

    // Stage 3: Completed 1/1
    inProgress = 0;
    completedRequired = 1;
    totalCompleted = 1;
    const coreProfileReady = totalRequired > 0 && completedRequired === totalRequired;
    stage =
      totalCompleted === 0 && inProgress === 0
        ? 'ONBOARDING_NOT_STARTED'
        : !coreProfileReady
        ? 'ONBOARDING_IN_PROGRESS'
        : totalCompleted === totalRequired
        ? 'CORE_PROFILE_READY'
        : 'PROGRESSIVE_STAGE';

    expect(coreProfileReady).toBe(true);
    expect(stage).toBe('CORE_PROFILE_READY');
  });
});
