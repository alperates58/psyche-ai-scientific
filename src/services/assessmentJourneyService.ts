import { prisma } from '@/lib/prisma';
import {
  JourneyClassification,
  JourneyStage,
  AssessmentItemStatus,
  getModuleJourneyMetadata,
} from '@/lib/assessmentJourneyConfig';
import { getUserProfileCoverage, UserProfileCoverageSummary } from './profileService';

export interface AssessmentJourneyItem {
  moduleId: string;
  moduleCode: string;
  title: string;
  subtitle?: string;
  description: string;
  estimatedMinutes: number;
  formVersionId: string;
  formVersionCode: string;
  itemCount: number;
  classification: JourneyClassification;
  priority: number;
  stepNumber?: number;
  status: AssessmentItemStatus;
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
}

export interface NextActionDetails {
  title: string;
  reason: string;
  estimatedMinutes: number;
  url: string;
  ctaText: string;
  status: AssessmentItemStatus;
  assessment: AssessmentJourneyItem;
}

export interface UserAssessmentJourney {
  userId: string;
  currentStage: JourneyStage;
  coreProfileReady: boolean;
  totalAvailableAssessments: number;
  completedAssessmentsCount: number;
  inProgressAssessmentsCount: number;
  requiredAssessments: AssessmentJourneyItem[];
  recommendedAssessments: AssessmentJourneyItem[];
  optionalAssessments: AssessmentJourneyItem[];
  allAssessments: AssessmentJourneyItem[];
  nextAction: NextActionDetails | null;
  coverage: UserProfileCoverageSummary;
  milestoneMessage?: string;
}

/**
 * Pure & deterministic assessment journey engine.
 * Computes user onboarding stage, progress, and next best action entirely from real DB models.
 */
export async function getUserAssessmentJourney(userId: string): Promise<UserAssessmentJourney> {
  // 1. Fetch published assessment modules with their active form versions
  const modulesWithPublishedForms = await prisma.assessmentModule.findMany({
    include: {
      formVersions: {
        where: { isPublished: true, status: 'PUBLISHED' },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  // Filter modules that actually have a published form
  const availableModules = modulesWithPublishedForms.filter(
    (m) => m.formVersions && m.formVersions.length > 0
  );

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
        },
      },
      _count: {
        select: { responses: true },
      },
    },
    orderBy: { startedAt: 'desc' },
  });

  // 3. Fetch canonical profile coverage
  const coverage = await getUserProfileCoverage(userId);

  // 4. Map available modules into AssessmentJourneyItems
  const allItems: AssessmentJourneyItem[] = [];

  for (const mod of availableModules) {
    const publishedForm = mod.formVersions[0];
    const rule = getModuleJourneyMetadata(mod.code, mod.titleTr);

    // Find sessions for this module
    const sessionsForModule = userSessions.filter(
      (s) => s.formVersion.moduleId === mod.id
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

    const totalItems = publishedForm.itemCount > 0 ? publishedForm.itemCount : 17;

    if (completedSession) {
      status = 'COMPLETED';
      progressPercentage = 100;
      answeredCount = totalItems;
      startedAt = completedSession.startedAt.toISOString();
      completedAt = completedSession.completedAt ? completedSession.completedAt.toISOString() : null;
      completedSessionId = completedSession.id;
    } else if (activeSession) {
      status = 'IN_PROGRESS';
      answeredCount = activeSession._count.responses;
      progressPercentage = Math.min(
        100,
        Math.round((answeredCount / totalItems) * 100)
      );
      startedAt = activeSession.startedAt.toISOString();
      activeSessionId = activeSession.id;
    }

    const startOrResumeUrl = `/assessment?module=${encodeURIComponent(mod.code)}`;
    const resultUrl = completedSessionId ? `/assessments/results/${completedSessionId}` : null;

    allItems.push({
      moduleId: mod.id,
      moduleCode: mod.code,
      title: rule.userFacingTitleTr || mod.titleTr,
      subtitle: rule.userFacingSubtitleTr,
      description: mod.descriptionTr,
      estimatedMinutes: mod.estimatedMinutes || 12,
      formVersionId: publishedForm.id,
      formVersionCode: publishedForm.versionCode,
      itemCount: totalItems,
      classification: rule.classification,
      priority: rule.priority,
      stepNumber: rule.stepNumber,
      status,
      progressPercentage,
      answeredCount,
      startedAt,
      completedAt,
      activeSessionId,
      completedSessionId,
      startOrResumeUrl,
      resultUrl,
      recommendationReason: rule.recommendationReasonTr,
      domainName: rule.domainNameTr,
    });
  }

  // Sort items deterministically by priority asc, then title asc
  allItems.sort((a, b) => a.priority - b.priority || a.title.localeCompare(b.title));

  // 5. Group by classification
  const requiredAssessments = allItems.filter((i) => i.classification === 'REQUIRED');
  const recommendedAssessments = allItems.filter((i) => i.classification === 'RECOMMENDED');
  const optionalAssessments = allItems.filter((i) => i.classification === 'OPTIONAL');

  // 6. Compute progress numbers
  const totalAvailableAssessments = allItems.length;
  const completedAssessmentsCount = allItems.filter((i) => i.status === 'COMPLETED').length;
  const inProgressAssessmentsCount = allItems.filter((i) => i.status === 'IN_PROGRESS').length;

  const totalRequiredCount = requiredAssessments.length;
  const completedRequiredCount = requiredAssessments.filter(
    (i) => i.status === 'COMPLETED'
  ).length;

  const coreProfileReady =
    totalRequiredCount > 0 && completedRequiredCount === totalRequiredCount;

  // 7. Determine Journey Stage
  let currentStage: JourneyStage;
  if (completedAssessmentsCount === 0 && inProgressAssessmentsCount === 0) {
    currentStage = 'ONBOARDING_NOT_STARTED';
  } else if (!coreProfileReady) {
    currentStage = 'ONBOARDING_IN_PROGRESS';
  } else if (completedAssessmentsCount === totalRequiredCount) {
    currentStage = 'CORE_PROFILE_READY';
  } else {
    currentStage = 'PROGRESSIVE_STAGE';
  }

  // 8. Deterministic Next Best Action selection
  let nextAction: NextActionDetails | null = null;

  // Priority 1: Resume an IN_PROGRESS required assessment
  const inProgressRequired = requiredAssessments.find((i) => i.status === 'IN_PROGRESS');
  if (inProgressRequired) {
    nextAction = {
      title: inProgressRequired.title,
      reason: 'Yarıda kalan temel değerlendirmenizi tamamlayın.',
      estimatedMinutes: inProgressRequired.estimatedMinutes,
      url: inProgressRequired.startOrResumeUrl,
      ctaText: 'Kaldığın Yerden Devam Et',
      status: 'IN_PROGRESS',
      assessment: inProgressRequired,
    };
  }

  // Priority 2: Next remaining NOT_STARTED required assessment
  if (!nextAction) {
    const nextRequired = requiredAssessments.find((i) => i.status === 'NOT_STARTED');
    if (nextRequired) {
      nextAction = {
        title: nextRequired.title,
        reason: nextRequired.recommendationReason,
        estimatedMinutes: nextRequired.estimatedMinutes,
        url: nextRequired.startOrResumeUrl,
        ctaText: 'Değerlendirmeye Başla',
        status: 'NOT_STARTED',
        assessment: nextRequired,
      };
    }
  }

  // Priority 3: Resume an IN_PROGRESS recommended assessment
  if (!nextAction) {
    const inProgressRecommended = recommendedAssessments.find((i) => i.status === 'IN_PROGRESS');
    if (inProgressRecommended) {
      nextAction = {
        title: inProgressRecommended.title,
        reason: 'Yarıda kalan önerilen değerlendirmenize devam edin.',
        estimatedMinutes: inProgressRecommended.estimatedMinutes,
        url: inProgressRecommended.startOrResumeUrl,
        ctaText: 'Kaldığın Yerden Devam Et',
        status: 'IN_PROGRESS',
        assessment: inProgressRecommended,
      };
    }
  }

  // Priority 4: Next remaining NOT_STARTED recommended assessment
  if (!nextAction) {
    const nextRecommended = recommendedAssessments.find((i) => i.status === 'NOT_STARTED');
    if (nextRecommended) {
      nextAction = {
        title: nextRecommended.title,
        reason: nextRecommended.recommendationReason,
        estimatedMinutes: nextRecommended.estimatedMinutes,
        url: nextRecommended.startOrResumeUrl,
        ctaText: 'Önerilen Değerlendirmeye Başla',
        status: 'NOT_STARTED',
        assessment: nextRecommended,
      };
    }
  }

  // Priority 5: Resume or start an OPTIONAL assessment
  if (!nextAction) {
    const inProgressOptional = optionalAssessments.find((i) => i.status === 'IN_PROGRESS');
    const notStartedOptional = optionalAssessments.find((i) => i.status === 'NOT_STARTED');
    const targetOptional = inProgressOptional || notStartedOptional;

    if (targetOptional) {
      nextAction = {
        title: targetOptional.title,
        reason: targetOptional.recommendationReason,
        estimatedMinutes: targetOptional.estimatedMinutes,
        url: targetOptional.startOrResumeUrl,
        ctaText:
          targetOptional.status === 'IN_PROGRESS'
            ? 'Kaldığın Yerden Devam Et'
            : 'Derinlemesine İncelemeye Başla',
        status: targetOptional.status,
        assessment: targetOptional,
      };
    }
  }

  // 9. Generate human milestone message
  let milestoneMessage: string | undefined;
  if (currentStage === 'CORE_PROFILE_READY') {
    milestoneMessage =
      'Temel profiliniz başarıyla oluşturuldu. Profilinizi daha ayrıntılı hale getirmek için önerilen değerlendirmelere devam edebilirsiniz.';
  } else if (totalAvailableAssessments > 0 && completedAssessmentsCount === totalAvailableAssessments) {
    milestoneMessage =
      'Tebrikler! Şu anda erişilebilir olan tüm psikolojik değerlendirmeleri tamamladınız.';
  }

  return {
    userId,
    currentStage,
    coreProfileReady,
    totalAvailableAssessments,
    completedAssessmentsCount,
    inProgressAssessmentsCount,
    requiredAssessments,
    recommendedAssessments,
    optionalAssessments,
    allAssessments: allItems,
    nextAction,
    coverage,
    milestoneMessage,
  };
}
