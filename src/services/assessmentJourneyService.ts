import { prisma } from '@/lib/prisma';
import {
  JourneyClassification,
  JourneyStage,
  ProfileDepthLevel,
  CatalogCategory,
  CATALOG_CATEGORIES,
  AssessmentItemStatus,
  ContentAvailabilityState,
  loadAssessmentArchitectureModules,
  getModuleJourneyMetadata,
  ModuleJourneyRule,
} from '@/lib/assessmentJourneyConfig';
import { getUserProfileCoverage, UserProfileCoverageSummary } from './profileService';

export interface AssessmentJourneyItem {
  assessmentId: string;
  moduleId: string;
  moduleCode: string;
  title: string;
  subtitle?: string;
  description: string;
  catalogCategory: CatalogCategory;
  categoryNameTr: string;
  stage: 'CORE' | 'EXPANSION' | 'DEEP' | 'ADVANCED';
  estimatedMinutes: number;
  formVersionId: string;
  formVersionCode: string;
  itemCount: number;
  classification: JourneyClassification;
  priority: number;
  status: AssessmentItemStatus;
  contentAvailability: ContentAvailabilityState;
  isPlayable: boolean;
  progressPercentage: number;
  answeredCount: number;
  startedAt?: string | null;
  completedAt?: string | null;
  activeSessionId?: string | null;
  completedSessionId?: string | null;
  startOrResumeUrl: string;
  resultUrl?: string | null;
  recommendationReason: string;
  domainName?: string;
  constructIdsCovered: string[];
  subscaleCount: number;
}

export interface ProfileDepthSummary {
  profileDepthPercentage: number;
  depthPercentage: number;
  completedModulesCount: number;
  completedModules: number;
  totalConsumerModulesCount: number;
  totalModules: number;
  answeredQuestionsCount: number;
  completedQuestions: number;
  targetQuestionsCount: number;
  totalQuestions: number;
  constructCoverageCount: number;
  totalConstructsCount: number;
  domainCoverageCount: number;
  totalDomainsCount: number;
  completedFacets: number;
  totalFacets: number;
  depthLevel: ProfileDepthLevel;
  depthLevelTr: string;
  depthLevelDescriptionTr: string;
  summaryTextTr: string;
  unlockedCapabilities: string[];
}

export interface NextActionDetails {
  title: string;
  reason: string;
  estimatedMinutes: number;
  url: string;
  ctaText: string;
  status: AssessmentItemStatus;
  assessment: AssessmentJourneyItem;
  advisoryBreakNotice?: string | null;
  canContinueImmediately: boolean;
}

export interface CategoryGroup {
  category: CatalogCategory;
  categoryKey: CatalogCategory;
  categoryNameTr: string;
  titleTr: string;
  categoryDescriptionTr: string;
  descriptionTr: string;
  assessments: AssessmentJourneyItem[];
}

export type AssessmentCategoryGroup = CategoryGroup;

export interface JourneyStageGroup {
  stageKey: 'CORE' | 'EXPANSION' | 'DEEP' | 'ADVANCED';
  titleTr: string;
  descriptionTr: string;
  isCompleted: boolean;
  isActive: boolean;
  completedModulesCount: number;
  totalModulesCount: number;
  modules: AssessmentJourneyItem[];
}

export interface UserAssessmentJourney {
  userId: string;
  currentStage: JourneyStage;
  currentStageNameTr: string;
  coreProfileReady: boolean;
  expandedProfileReady: boolean;
  comprehensiveProfileReady: boolean;
  profileDepth: ProfileDepthSummary;
  totalAvailableAssessments: number;
  completedAssessmentsCount: number;
  inProgressAssessmentsCount: number;
  coreAssessments: AssessmentJourneyItem[];
  expansionAssessments: AssessmentJourneyItem[];
  deepAssessments: AssessmentJourneyItem[];
  advancedAssessments: AssessmentJourneyItem[];
  stages: JourneyStageGroup[];
  categoryGroups: CategoryGroup[];
  allAssessments: AssessmentJourneyItem[];
  nextAction: NextActionDetails | null;
  coverage: UserProfileCoverageSummary;
  milestoneMessage?: string;
  advisoryBreakNotice?: string | null;
  hasLegacyFormsOnly: boolean;
  legacyNotice?: string | null;
  requiredAssessments: AssessmentJourneyItem[];
  recommendedAssessments: AssessmentJourneyItem[];
  optionalAssessments: AssessmentJourneyItem[];
}

const STAGE_NAMES_TR: Record<JourneyStage, string> = {
  ONBOARDING: 'Başlangıç ve Temel Profil (Core Onboarding)',
  FIRST_PROFILE: 'Temel Profil Hazır',
  PROFILE_EXPANSION: 'Genişletilmiş Profil Katmanı',
  DEEP_PROFILE: 'Kapsamlı Derin Haritalama Katmanı',
  ADVANCED_EXPLORATION: 'İleri Araştırma & Özel Dinamikler',
  COMPREHENSIVE_COMPLETE: 'Kapsamlı Psikolojik Profil Tamamlandı',
};

const DEPTH_LEVEL_METADATA: Record<ProfileDepthLevel, { nameTr: string; descTr: string }> = {
  STARTING: {
    nameTr: 'Başlangıç Profili',
    descTr: 'Psikolojik profil yolculuğunun başlangıç aşaması.',
  },
  CORE: {
    nameTr: 'Temel Profil',
    descTr: '6 temel kişilik boyutu, özsaygı, öz-yeterlik, duygu düzenleme ve epistemik yönelim haritası.',
  },
  EXPANDED: {
    nameTr: 'Genişletilmiş Profil',
    descTr: 'İrade, temel psikolojik ihtiyaçlar, Schwartz değer çemberi ve yetişkin bağlanma haritası.',
  },
  COMPREHENSIVE: {
    nameTr: 'Kapsamlı Profil',
    descTr: 'Bilişsel esneklik, anlam, çatışma tarzları, duygulanım dengesi, canlılık ve stres dayanıklılığını kapsayan çok alanlı profil.',
  },
  ADVANCED: {
    nameTr: 'İleri Düzey Keşif',
    descTr: 'Tüm tüketici modüllerine ek olarak isteğe bağlı subklinik dinamikleri içeren tam araştırma profili.',
  },
};

/**
 * Pure & deterministic assessment journey engine.
 * Computes user journey stage, profile depth, catalog groupings, and next best action dynamically from DB & architecture.
 */
export async function getUserAssessmentJourney(userId: string): Promise<UserAssessmentJourney> {
  const architectureModules = loadAssessmentArchitectureModules();

  // 1. Fetch published assessment modules and form versions from DB
  const dbModules = await prisma.assessmentModule.findMany({
    include: {
      formVersions: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  // 2. Fetch all user assessment sessions
  const userSessions = await prisma.assessmentSession.findMany({
    where: { userId },
    include: {
      formVersion: {
        select: {
          id: true,
          moduleId: true,
          versionCode: true,
          itemCount: true,
          status: true,
          isPublished: true,
        },
      },
      _count: {
        select: { responses: true },
      },
    },
    orderBy: { startedAt: 'desc' },
  });

  // 3. Fetch profile coverage
  const coverage = await getUserProfileCoverage(userId);

  // 4. Map each architecture module into AssessmentJourneyItem
  const allItems: AssessmentJourneyItem[] = [];

  for (const arch of architectureModules) {
    // Find matching module in DB (exact code match prioritized)
    const matchingDbMod =
      dbModules.find(
        (m) =>
          m.code.toLowerCase() === arch.assessmentId.toLowerCase() ||
          m.code.toLowerCase() === arch.moduleCode.toLowerCase()
      ) ||
      dbModules.find(
        (m) =>
          (arch.assessmentId === 'mod_core_hexaco_60' && (m.code === 'MODULE_1_CORE_PERSONALITY' || m.code === 'CORE_INTAKE')) ||
          (arch.assessmentId === 'mod_self_agency' && m.code === 'MODULE_2_SELF_IDENTITY') ||
          (arch.assessmentId === 'mod_emotion_regulation' && m.code === 'MODULE_3_EMOTION_REGULATION') ||
          (arch.assessmentId === 'mod_cognitive_epistemic' && m.code === 'MODULE_4_COGNITIVE_EPISTEMIC') ||
          (arch.assessmentId === 'mod_volition_impulse' && m.code === 'MODULE_5_VOLITION_IMPULSE') ||
          (arch.assessmentId === 'mod_basic_needs_sdt' && m.code === 'MODULE_6_BASIC_NEEDS_SDT') ||
          (arch.assessmentId === 'mod_universal_values' && m.code === 'MODULE_7_UNIVERSAL_VALUES') ||
          (arch.assessmentId === 'mod_relational_attachment_empathy' && (m.code === 'MODULE_8_RELATIONAL_ATTACHMENT_EMPATHY' || m.code === 'MODULE_6_ATTACHMENT_PATTERNS'))
      );

    const publishedForm =
      matchingDbMod?.formVersions?.find(
        (f) => f.isPublished && f.status === 'PUBLISHED' && f.versionCode === 'v1.0.0-psycheai-native'
      ) ||
      matchingDbMod?.formVersions?.find(
        (f) => f.isPublished && f.status === 'PUBLISHED'
      );

    // Find sessions for this module
    const sessionsForModule = userSessions.filter(
      (s) => matchingDbMod && s.formVersion?.moduleId === matchingDbMod.id
    );

    const completedSession = sessionsForModule.find((s) => s.status === 'COMPLETED');
    const activeSession = sessionsForModule.find(
      (s) => s.status === 'IN_PROGRESS' || s.status === 'PAUSED'
    );

    let status: AssessmentItemStatus = 'NOT_STARTED';
    let progressPercentage = 0;
    let answeredCount = 0;
    let startedAt: string | null = null;
    let completedAt: string | null = null;
    let activeSessionId: string | null = null;
    let completedSessionId: string | null = null;

    const plannedQuestions = arch.questionCountPlanned || 20;
    const formItemCount = publishedForm ? (publishedForm.itemCount > 0 ? publishedForm.itemCount : plannedQuestions) : plannedQuestions;

    let contentAvailability: ContentAvailabilityState = publishedForm
      ? 'READY'
      : arch.stage === 'ADVANCED'
      ? 'RESEARCH_DRAFT'
      : 'CONTENT_PENDING';

    const isPlayable = !!publishedForm;

    if (completedSession) {
      status = 'COMPLETED';
      progressPercentage = 100;
      answeredCount = formItemCount;
      startedAt = completedSession.startedAt ? new Date(completedSession.startedAt).toISOString() : null;
      completedAt = completedSession.completedAt ? new Date(completedSession.completedAt).toISOString() : null;
      completedSessionId = completedSession.id;
    } else if (activeSession) {
      status = 'IN_PROGRESS';
      answeredCount = activeSession._count?.responses || 0;
      progressPercentage = Math.min(100, Math.round((answeredCount / formItemCount) * 100));
      startedAt = activeSession.startedAt ? new Date(activeSession.startedAt).toISOString() : null;
      activeSessionId = activeSession.id;
    } else if (!isPlayable) {
      status = 'CONTENT_PENDING';
    }
 else {
      status = 'NOT_STARTED';
    }

    const startOrResumeUrl = `/assessment?module=${encodeURIComponent(matchingDbMod?.code || arch.assessmentId)}`;
    const resultUrl = completedSessionId ? `/assessments/results/${completedSessionId}` : null;

    allItems.push({
      assessmentId: arch.assessmentId,
      moduleId: matchingDbMod?.id || arch.assessmentId,
      moduleCode: matchingDbMod?.code || arch.assessmentId,
      title: arch.userFacingTitleTr,
      subtitle: arch.userFacingSubtitleTr,
      description: matchingDbMod?.descriptionTr || arch.recommendationReasonTr,
      catalogCategory: arch.catalogCategory,
      categoryNameTr: CATALOG_CATEGORIES[arch.catalogCategory]?.nameTr || 'Psikolojik Boyut',
      stage: arch.stage,
      estimatedMinutes: arch.estimatedMinutes,
      formVersionId: publishedForm?.id || 'pending',
      formVersionCode: publishedForm?.versionCode || 'v1.0.0-planned',
      itemCount: formItemCount,
      classification: arch.classification,
      priority: arch.priority,
      status,
      contentAvailability,
      isPlayable,
      progressPercentage,
      answeredCount,
      startedAt,
      completedAt,
      activeSessionId,
      completedSessionId,
      startOrResumeUrl,
      resultUrl,
      recommendationReason: arch.recommendationReasonTr,
      domainName: arch.domainNameTr,
      constructIdsCovered: arch.constructIdsCovered,
      subscaleCount: arch.subscales?.length || 1,
    });
  }

  // 5. Group by Stages
  const coreAssessments = allItems.filter((i) => i.stage === 'CORE');
  const expansionAssessments = allItems.filter((i) => i.stage === 'EXPANSION');
  const deepAssessments = allItems.filter((i) => i.stage === 'DEEP');
  const advancedAssessments = allItems.filter((i) => i.stage === 'ADVANCED');
  const consumerAssessments = allItems.filter((i) => i.stage !== 'ADVANCED');

  // 6. Stage Completion Metrics
  const completedCoreCount = coreAssessments.filter((i) => i.status === 'COMPLETED').length;
  const coreProfileReady = coreAssessments.length > 0 && completedCoreCount === coreAssessments.length;

  const completedExpansionCount = expansionAssessments.filter((i) => i.status === 'COMPLETED').length;
  const expandedProfileReady =
    coreProfileReady && expansionAssessments.length > 0 && completedExpansionCount === expansionAssessments.length;

  const completedDeepCount = deepAssessments.filter((i) => i.status === 'COMPLETED').length;
  const comprehensiveProfileReady =
    expandedProfileReady && deepAssessments.length > 0 && completedDeepCount === deepAssessments.length;

  // 7. Determine Journey Stage
  let currentStage: JourneyStage;
  if (completedCoreCount === 0 && allItems.every((i) => i.status !== 'IN_PROGRESS')) {
    currentStage = 'ONBOARDING';
  } else if (!coreProfileReady) {
    currentStage = 'ONBOARDING';
  } else if (!expandedProfileReady) {
    currentStage = completedExpansionCount === 0 ? 'FIRST_PROFILE' : 'PROFILE_EXPANSION';
  } else if (!comprehensiveProfileReady) {
    currentStage = 'DEEP_PROFILE';
  } else if (advancedAssessments.some((a) => a.status === 'IN_PROGRESS' || a.status === 'COMPLETED')) {
    currentStage = advancedAssessments.every((a) => a.status === 'COMPLETED') ? 'COMPREHENSIVE_COMPLETE' : 'ADVANCED_EXPLORATION';
  } else {
    currentStage = 'COMPREHENSIVE_COMPLETE';
  }

  // 8. Calculate Profile Depth Summary (Journey / Coverage Completion)
  const completedModulesCount = consumerAssessments.filter((i) => i.status === 'COMPLETED').length;
  const totalConsumerModulesCount = consumerAssessments.length;

  const answeredQuestionsCount = consumerAssessments.reduce(
    (acc, m) => acc + (m.status === 'COMPLETED' ? m.itemCount : m.answeredCount),
    0
  );
  const targetQuestionsCount = consumerAssessments.reduce((acc, m) => acc + m.itemCount, 0);

  const profileDepthPercentage =
    targetQuestionsCount > 0 ? Math.min(100, Math.round((answeredQuestionsCount / targetQuestionsCount) * 100)) : 0;

  let depthLevel: ProfileDepthLevel = 'STARTING';
  if (comprehensiveProfileReady) {
    depthLevel = advancedAssessments.some((a) => a.status === 'COMPLETED') ? 'ADVANCED' : 'COMPREHENSIVE';
  } else if (expandedProfileReady) {
    depthLevel = 'EXPANDED';
  } else if (coreProfileReady) {
    depthLevel = 'CORE';
  }

  const unlockedCapabilities: string[] = [];
  if (coreAssessments.find((a) => a.assessmentId === 'mod_core_hexaco_60')?.status === 'COMPLETED') {
    unlockedCapabilities.push('Kişilik Radarı (6 Temel Faktör)');
  }
  if (coreAssessments.find((a) => a.assessmentId === 'mod_self_agency')?.status === 'COMPLETED') {
    unlockedCapabilities.push('Benlik Değeri & Yetkinlik Göstergesi');
  }
  if (coreAssessments.find((a) => a.assessmentId === 'mod_emotion_regulation')?.status === 'COMPLETED') {
    unlockedCapabilities.push('Duygu Düzenleme Matrisi (Yeniden Değerlendirme vs Bastırma)');
  }
  if (coreProfileReady) {
    unlockedCapabilities.push('Temel Psikolojik Profil ve Atlas');
  }
  if (expandedProfileReady) {
    unlockedCapabilities.push('Schwartz Değer Çemberi ve Yetişkin Bağlanma Haritası');
  }
  if (comprehensiveProfileReady) {
    unlockedCapabilities.push('Kapsamlı Çok Boyutlu Psikolojik Sentez');
  }

  const legacySessions = userSessions.filter(
    (s) => s.formVersion?.versionCode === 'form_hexaco_v1_0_0' || s.formVersion?.versionCode?.includes('legacy')
  );
  const modernCompletedSessions = userSessions.filter(
    (s) => s.formVersion?.versionCode !== 'form_hexaco_v1_0_0' && !s.formVersion?.versionCode?.includes('legacy') && s.status === 'COMPLETED'
  );
  const hasLegacyFormsOnly = legacySessions.length > 0 && modernCompletedSessions.length === 0;
  const legacyNotice = hasLegacyFormsOnly
    ? 'Önceki sürümden kalan yanıtlarınız bulunmaktadır. Güncel bilimsel standartlarımızla uyumlu tam profiliniz için yeni değerlendirmelerle devam etmeniz önerilir.'
    : null;

  const summaryTextTr = `${completedModulesCount}/${totalConsumerModulesCount} modül tamamlandı, ${answeredQuestionsCount} soru yanıtlandı.`;

  const profileDepth: ProfileDepthSummary = {
    profileDepthPercentage,
    depthPercentage: profileDepthPercentage,
    completedModulesCount,
    completedModules: completedModulesCount,
    totalConsumerModulesCount,
    totalModules: totalConsumerModulesCount,
    answeredQuestionsCount,
    completedQuestions: answeredQuestionsCount,
    targetQuestionsCount,
    totalQuestions: targetQuestionsCount,
    constructCoverageCount: (coverage?.exploredFacetsCount || 0) > 0 ? Math.min(37, Math.max(1, Math.round(((coverage?.exploredFacetsCount || 0) / 91) * 37))) : 0,
    totalConstructsCount: 37,
    domainCoverageCount: (coverage?.exploredFacetsCount || 0) > 0 ? Math.min(11, Math.max(1, Math.ceil((coverage?.exploredFacetsCount || 0) / 8))) : 0,
    totalDomainsCount: 11,
    completedFacets: coverage?.exploredFacetsCount || 0,
    totalFacets: coverage?.totalOntologyFacets || 91,
    depthLevel,
    depthLevelTr: DEPTH_LEVEL_METADATA[depthLevel].nameTr,
    depthLevelDescriptionTr: DEPTH_LEVEL_METADATA[depthLevel].descTr,
    summaryTextTr,
    unlockedCapabilities,
  };


  // 9. Deterministic Next Best Action Selection
  let nextAction: NextActionDetails | null = null;

  // Priority 1: Resume any IN_PROGRESS module (prefer core then expansion then deep)
  const inProgressModule =
    coreAssessments.find((i) => i.status === 'IN_PROGRESS') ||
    expansionAssessments.find((i) => i.status === 'IN_PROGRESS') ||
    deepAssessments.find((i) => i.status === 'IN_PROGRESS') ||
    advancedAssessments.find((i) => i.status === 'IN_PROGRESS');

  if (inProgressModule) {
    nextAction = {
      title: inProgressModule.title,
      reason: `Yarıda kalan "${inProgressModule.title}" değerlendirmenizi tamamlayın (%${inProgressModule.progressPercentage} tamamlandı).`,
      estimatedMinutes: inProgressModule.estimatedMinutes,
      url: inProgressModule.startOrResumeUrl,
      ctaText: 'Kaldığın Yerden Devam Et',
      status: 'IN_PROGRESS',
      assessment: inProgressModule,
      advisoryBreakNotice: null,
      canContinueImmediately: true,
    };
  }

  // Priority 2: Next remaining playable CORE module
  if (!nextAction) {
    const nextCore = coreAssessments.find((i) => i.status === 'NOT_STARTED' && i.isPlayable);
    if (nextCore) {
      nextAction = {
        title: nextCore.title,
        reason: nextCore.recommendationReason,
        estimatedMinutes: nextCore.estimatedMinutes,
        url: nextCore.startOrResumeUrl,
        ctaText: 'Değerlendirmeye Başla',
        status: 'NOT_STARTED',
        assessment: nextCore,
        advisoryBreakNotice: completedCoreCount > 0 ? 'Bu bölümden sonra kısa bir ara vermek yanıt kalitesini destekleyebilir.' : null,
        canContinueImmediately: true,
      };
    }
  }

  // Priority 3: Next remaining playable EXPANSION module
  if (!nextAction && coreProfileReady) {
    const nextExp = expansionAssessments.find((i) => i.status === 'NOT_STARTED' && i.isPlayable);
    if (nextExp) {
      nextAction = {
        title: nextExp.title,
        reason: nextExp.recommendationReason,
        estimatedMinutes: nextExp.estimatedMinutes,
        url: nextExp.startOrResumeUrl,
        ctaText: 'Genişletilmiş Değerlendirmeye Başla',
        status: 'NOT_STARTED',
        assessment: nextExp,
        advisoryBreakNotice: 'Bu bölümden sonra kısa bir ara vermek yanıt kalitesini destekleyebilir.',
        canContinueImmediately: true,
      };
    }
  }

  // Priority 4: Next remaining playable DEEP module
  if (!nextAction && expandedProfileReady) {
    const nextDeep = deepAssessments.find((i) => i.status === 'NOT_STARTED' && i.isPlayable);
    if (nextDeep) {
      nextAction = {
        title: nextDeep.title,
        reason: nextDeep.recommendationReason,
        estimatedMinutes: nextDeep.estimatedMinutes,
        url: nextDeep.startOrResumeUrl,
        ctaText: 'Derin Haritalamaya Başla',
        status: 'NOT_STARTED',
        assessment: nextDeep,
        advisoryBreakNotice: 'Bu bölümden sonra kısa bir ara vermek yanıt kalitesini destekleyebilir.',
        canContinueImmediately: true,
      };
    }
  }

  // Priority 5: Fallback first available playable module
  if (!nextAction) {
    const firstPlayable = allItems.find((i) => i.status === 'NOT_STARTED' && i.isPlayable);
    if (firstPlayable) {
      nextAction = {
        title: firstPlayable.title,
        reason: firstPlayable.recommendationReason,
        estimatedMinutes: firstPlayable.estimatedMinutes,
        url: firstPlayable.startOrResumeUrl,
        ctaText: 'Değerlendirmeye Başla',
        status: 'NOT_STARTED',
        assessment: firstPlayable,
        canContinueImmediately: true,
      };
    }
  }

  // 10. Build Journey Stage Groups
  const stages: JourneyStageGroup[] = [
    {
      stageKey: 'CORE',
      titleTr: 'Aşama 1: Temel Profil (Core Onboarding)',
      descriptionTr: '6 temel kişilik faktörü, benlik yapısı, duygu düzenleme ve epistemik yönelim.',
      isCompleted: coreProfileReady,
      isActive: currentStage === 'ONBOARDING',
      completedModulesCount: completedCoreCount,
      totalModulesCount: coreAssessments.length,
      modules: coreAssessments,
    },
    {
      stageKey: 'EXPANSION',
      titleTr: 'Aşama 2: Genişletilmiş Profil (Expansion)',
      descriptionTr: 'İrade & dürtü kontrolü, temel psikolojik ihtiyaçlar, evrensel değerler ve yetişkin bağlanma dinamikleri.',
      isCompleted: expandedProfileReady,
      isActive: currentStage === 'FIRST_PROFILE' || currentStage === 'PROFILE_EXPANSION',
      completedModulesCount: completedExpansionCount,
      totalModulesCount: expansionAssessments.length,
      modules: expansionAssessments,
    },
    {
      stageKey: 'DEEP',
      titleTr: 'Aşama 3: Kapsamlı Derin Haritalama (Deep Profile)',
      descriptionTr: 'Bilişsel esneklik, anlam & azim, çatışma tarzları, duygulanım dengesi, canlılık, başa çıkma ve yaratıcılık.',
      isCompleted: comprehensiveProfileReady,
      isActive: currentStage === 'DEEP_PROFILE',
      completedModulesCount: completedDeepCount,
      totalModulesCount: deepAssessments.length,
      modules: deepAssessments,
    },
    {
      stageKey: 'ADVANCED',
      titleTr: 'Aşama 4: İleri Düzey Araştırma (Advanced Exploration)',
      descriptionTr: 'İsteğe bağlı subklinik dinamikler ve uç kişilik özellikleri (Karanlık Dörtlü / SD4).',
      isCompleted: advancedAssessments.length > 0 && advancedAssessments.every((a) => a.status === 'COMPLETED'),
      isActive: currentStage === 'ADVANCED_EXPLORATION' || currentStage === 'COMPREHENSIVE_COMPLETE',
      completedModulesCount: advancedAssessments.filter((a) => a.status === 'COMPLETED').length,
      totalModulesCount: advancedAssessments.length,
      modules: advancedAssessments,
    },
  ];

  // 11. Build Discovery Category Groups
  const categoryOrder: CatalogCategory[] = [
    'PERSONALITY',
    'SELF_REGULATION',
    'EMOTION',
    'COGNITION',
    'MOTIVATION_VALUES',
    'RELATIONSHIPS',
    'ADVANCED',
  ];

  const categoryGroups: CategoryGroup[] = categoryOrder.map((catKey) => ({
    category: catKey,
    categoryKey: catKey,
    categoryNameTr: CATALOG_CATEGORIES[catKey].nameTr,
    titleTr: CATALOG_CATEGORIES[catKey].titleTr || CATALOG_CATEGORIES[catKey].nameTr,
    categoryDescriptionTr: CATALOG_CATEGORIES[catKey].descriptionTr,
    descriptionTr: CATALOG_CATEGORIES[catKey].descriptionTr,
    assessments: allItems.filter((i) => i.catalogCategory === catKey),
  }));

  // 12. Generate milestone message
  let milestoneMessage: string | undefined;
  if (comprehensiveProfileReady) {
    milestoneMessage = 'Tebrikler! Kapsamlı Psikolojik Profilinizi başarıyla tamamladınız.';
  } else if (expandedProfileReady) {
    milestoneMessage = 'Genişletilmiş Profil katmanınız tamamlandı. Derin psikolojik haritalama modülleriyle devam edebilirsiniz.';
  } else if (coreProfileReady) {
    milestoneMessage = 'Temel profiliniz hazır! Profilinizi inceleyebilir veya genişletilmiş değerlendirmelerle devam edebilirsiniz.';
  }

  return {
    userId,
    currentStage,
    currentStageNameTr: STAGE_NAMES_TR[currentStage],
    coreProfileReady,
    expandedProfileReady,
    comprehensiveProfileReady,
    profileDepth,
    totalAvailableAssessments: allItems.length,
    completedAssessmentsCount: allItems.filter((i) => i.status === 'COMPLETED').length,
    inProgressAssessmentsCount: allItems.filter((i) => i.status === 'IN_PROGRESS').length,
    coreAssessments,
    expansionAssessments,
    deepAssessments,
    advancedAssessments,
    stages,
    categoryGroups,
    allAssessments: allItems,
    nextAction,
    coverage,
    milestoneMessage,
    advisoryBreakNotice: nextAction?.advisoryBreakNotice || null,
    hasLegacyFormsOnly,
    legacyNotice,
    requiredAssessments: coreAssessments,
    recommendedAssessments: expansionAssessments,
    optionalAssessments: [...deepAssessments, ...advancedAssessments],
  };
}

/**
 * Standalone Profile Depth Service
 */
export async function getProfileDepth(userId: string): Promise<ProfileDepthSummary> {
  const journey = await getUserAssessmentJourney(userId);
  return journey.profileDepth;
}

/**
 * Pure helper to derive user journey stage based on completed assessment codes.
 */
export function deriveUserJourneyStage(params: {
  completedAssessmentCodes: string[];
  inProgressAssessmentCodes: string[];
  hasLegacyForm?: boolean;
}): { stageKey: JourneyStage; targetDepthLevel: ProfileDepthLevel; titleTr: string } {
  const { completedAssessmentCodes, inProgressAssessmentCodes } = params;

  const coreCodes = ['mod_core_hexaco_60', 'mod_self_agency', 'mod_emotion_regulation', 'mod_cognitive_epistemic'];
  const expansionCodes = ['mod_volition_impulse', 'mod_basic_needs_sdt', 'mod_universal_values', 'mod_relational_attachment_empathy'];
  const deepCodes = [
    'mod_cognitive_adaptability',
    'mod_meaning_compassion_grit',
    'mod_conflict_boundaries',
    'mod_affective_distress',
    'mod_flourishing_vitality',
    'mod_coping_resilience',
    'mod_creativity_growth',
  ];

  const completedSet = new Set(completedAssessmentCodes.map((c) => c.toLowerCase()));

  const completedCoreCount = coreCodes.filter((c) => completedSet.has(c)).length;
  const completedExpansionCount = expansionCodes.filter((c) => completedSet.has(c)).length;
  const completedDeepCount = deepCodes.filter((c) => completedSet.has(c)).length;
  const totalCompleted = completedSet.size;

  if (totalCompleted === 0 && inProgressAssessmentCodes.length === 0) {
    return {
      stageKey: 'ONBOARDING',
      targetDepthLevel: 'STARTING',
      titleTr: 'Başlangıç ve Temel Profil (Core Onboarding)',
    };
  }

  if (completedCoreCount < 4) {
    return {
      stageKey: 'FIRST_PROFILE',
      targetDepthLevel: 'CORE',
      titleTr: 'İlk Profil (Temel Katman)',
    };
  }

  if (completedExpansionCount < 4) {
    return {
      stageKey: 'PROFILE_EXPANSION',
      targetDepthLevel: 'EXPANDED',
      titleTr: 'Profil Genişletme Katmanı',
    };
  }

  if (completedDeepCount < 7) {
    return {
      stageKey: 'DEEP_PROFILE',
      targetDepthLevel: 'COMPREHENSIVE',
      titleTr: 'Derin Profil Katmanı',
    };
  }

  return {
    stageKey: 'COMPREHENSIVE_COMPLETE',
    targetDepthLevel: 'COMPREHENSIVE',
    titleTr: 'Kapsamlı Psikolojik Profil Tamamlandı',
  };
}

/**
 * Pure helper to compute profile depth metrics from counts.
 */
export function deriveProfileDepth(params: {
  completedFacetsCount: number;
  totalOntologyFacets: number;
  completedQuestionsCount: number;
  totalQuestionsCount: number;
  completedModulesCount: number;
  totalModulesCount: number;
}): {
  depthLevel: 'BAŞLANGIÇ' | 'TEMEL' | 'GENİŞLETİLMİŞ' | 'KAPSAMLI' | 'İLERİ DÜZEY';
  depthPercentage: number;
} {
  const {
    completedFacetsCount,
    totalOntologyFacets,
    completedQuestionsCount,
    totalQuestionsCount,
    completedModulesCount,
    totalModulesCount,
  } = params;

  const total = totalOntologyFacets > 0 ? totalOntologyFacets : 91;
  const totalQ = totalQuestionsCount > 0 ? totalQuestionsCount : 431;

  const facetCoverageRatio = completedFacetsCount / total;
  const questionRatio = completedQuestionsCount / totalQ;

  const depthPercentage = Math.min(
    100,
    Math.max(0, Math.round((facetCoverageRatio * 0.7 + questionRatio * 0.3) * 100))
  );

  if (completedModulesCount === 0 || completedFacetsCount === 0) {
    return { depthLevel: 'BAŞLANGIÇ', depthPercentage: 0 };
  }

  if (completedModulesCount >= 15 || completedFacetsCount >= 80) {
    return { depthLevel: 'KAPSAMLI', depthPercentage };
  }

  if (completedModulesCount >= 8 || completedFacetsCount >= 50) {
    return { depthLevel: 'GENİŞLETİLMİŞ', depthPercentage };
  }

  if (completedModulesCount >= 4 || completedFacetsCount >= 24) {
    return { depthLevel: 'TEMEL', depthPercentage };
  }

  return { depthLevel: 'BAŞLANGIÇ', depthPercentage };
}

/**
 * Pure helper to determine next best action from a list of assessment items.
 */
export function determineNextBestAction(items: AssessmentJourneyItem[]): NextActionDetails | null {
  const required = items.filter((i) => i.classification === 'REQUIRED');
  const recommended = items.filter((i) => i.classification === 'RECOMMENDED');
  const optional = items.filter((i) => i.classification === 'OPTIONAL' || i.classification === 'ADVANCED');

  // 1. In-progress required
  const inProgReq = required.find((i) => i.status === 'IN_PROGRESS');
  if (inProgReq) {
    return {
      title: inProgReq.title,
      reason: 'Yarım kalan temel değerlendirmenize devam ederek profilinizi tamamlayın.',
      estimatedMinutes: inProgReq.estimatedMinutes,
      url: inProgReq.startOrResumeUrl,
      ctaText: 'Kaldığın Yerden Devam Et',
      status: 'IN_PROGRESS',
      assessment: inProgReq,
      canContinueImmediately: true,
    };
  }

  // 2. Not-started required
  const notStartedReq = required.find((i) => i.status === 'NOT_STARTED');
  if (notStartedReq) {
    return {
      title: notStartedReq.title,
      reason: notStartedReq.recommendationReason,
      estimatedMinutes: notStartedReq.estimatedMinutes,
      url: notStartedReq.startOrResumeUrl,
      ctaText: 'Değerlendirmeye Başla',
      status: 'NOT_STARTED',
      assessment: notStartedReq,
      canContinueImmediately: true,
    };
  }

  // 3. In-progress recommended
  const inProgRec = recommended.find((i) => i.status === 'IN_PROGRESS');
  if (inProgRec) {
    return {
      title: inProgRec.title,
      reason: 'Yarım kalan genişletilmiş değerlendirmenize devam edin.',
      estimatedMinutes: inProgRec.estimatedMinutes,
      url: inProgRec.startOrResumeUrl,
      ctaText: 'Kaldığın Yerden Devam Et',
      status: 'IN_PROGRESS',
      assessment: inProgRec,
      canContinueImmediately: true,
    };
  }

  // 4. Not-started recommended
  const notStartedRec = recommended.find((i) => i.status === 'NOT_STARTED');
  if (notStartedRec) {
    return {
      title: notStartedRec.title,
      reason: notStartedRec.recommendationReason,
      estimatedMinutes: notStartedRec.estimatedMinutes,
      url: notStartedRec.startOrResumeUrl,
      ctaText: 'Önerilen Değerlendirmeye Başla',
      status: 'NOT_STARTED',
      assessment: notStartedRec,
      canContinueImmediately: true,
    };
  }

  // 5. In-progress optional/advanced
  const inProgOpt = optional.find((i) => i.status === 'IN_PROGRESS');
  if (inProgOpt) {
    return {
      title: inProgOpt.title,
      reason: 'Yarım kalan derinlemesine incelemenize devam edin.',
      estimatedMinutes: inProgOpt.estimatedMinutes,
      url: inProgOpt.startOrResumeUrl,
      ctaText: 'Kaldığın Yerden Devam Et',
      status: 'IN_PROGRESS',
      assessment: inProgOpt,
      canContinueImmediately: true,
    };
  }

  // 6. Not-started optional/advanced
  const notStartedOpt = optional.find((i) => i.status === 'NOT_STARTED');
  if (notStartedOpt) {
    return {
      title: notStartedOpt.title,
      reason: notStartedOpt.recommendationReason,
      estimatedMinutes: notStartedOpt.estimatedMinutes,
      url: notStartedOpt.startOrResumeUrl,
      ctaText: 'Derinlemesine İncelemeye Başla',
      status: 'NOT_STARTED',
      assessment: notStartedOpt,
      canContinueImmediately: true,
    };
  }

  return null;
}

