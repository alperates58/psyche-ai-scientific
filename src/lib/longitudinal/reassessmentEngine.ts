/**
 * PsycheAI Reassessment Recommendation & Comparison Engine (FAZ 2.20)
 *
 * Enforces scientific invariants:
 * 1. Reassessment scheduling uses configurable product intervals (30d / 90d / 180d),
 *    NOT scientifically prescribed fixed norms.
 * 2. Reassessments are NEVER recommended because a score is "bad", "low", or "undesirable".
 *    Recommendation is purely driven by elapsed time, low repeat count, and ontological coverage.
 * 3. Results comparison provides honest, neutral observed delta without value judgments.
 */

import {
  DEFAULT_ASSESSMENT_MODULE_PORTFOLIO,
} from '@/lib/assessmentJourneyConfig';
import {
  MASTER_DOMAINS,
  MASTER_FACETS,
  MASTER_FACET_BY_ID,
  MASTER_DOMAIN_BY_ID,
  normalizeMasterFacetId,
} from '@/lib/profile/masterModelConstants';
import { ResponseQualityStatus } from '@/types/unifiedProfileV2';
import {
  ReassessmentRecommendation,
  ModuleRepeatComparison,
  RepeatMeasurementComparisonItem,
} from '@/types/longitudinal';
import { classifyObservedShift } from './longitudinalEngine';

/**
 * Configurable operational reassessment intervals in days.
 * Documented as product defaults, not validated psychometric prescriptions.
 */
export const REASSESSMENT_INTERVALS = {
  SHORT: 30, // 1 month
  STANDARD: 90, // 3 months
  LONG: 180, // 6 months
} as const;

export interface EvaluateReassessmentOptions {
  now?: Date;
  preferredIntervalDays?: number;
}

/**
 * Deterministically generates reassessment recommendations for completed modules.
 */
export function evaluateReassessmentRecommendations(
  completedSessions: any[],
  options?: EvaluateReassessmentOptions
): ReassessmentRecommendation[] {
  const nowMs = (options?.now || new Date()).getTime();
  const defaultInterval = options?.preferredIntervalDays || REASSESSMENT_INTERVALS.STANDARD;

  // Group completed sessions by module code
  const sessionsByModule = new Map<string, any[]>();

  for (const session of completedSessions || []) {
    if (session.status !== 'COMPLETED') continue;
    const mCode = session.formVersion?.module?.code;
    if (!mCode) continue;

    if (!sessionsByModule.has(mCode)) {
      sessionsByModule.set(mCode, []);
    }
    sessionsByModule.get(mCode)!.push(session);
  }

  const recommendations: ReassessmentRecommendation[] = [];

  for (const moduleItem of DEFAULT_ASSESSMENT_MODULE_PORTFOLIO) {
    const moduleSessions = sessionsByModule.get(moduleItem.moduleCode) || [];
    const completionsCount = moduleSessions.length;

    const targetDomain = MASTER_DOMAIN_BY_ID.get(moduleItem.targetDomainCode);
    const domainTitle = targetDomain?.nameTr || 'Psikolojik Alan';

    if (completionsCount === 0) {
      // Uncompleted module
      recommendations.push({
        moduleId: moduleItem.moduleCode,
        moduleCode: moduleItem.moduleCode,
        titleTr: moduleItem.titleTr,
        targetDomainNameTr: domainTitle,
        estimatedMinutes: moduleItem.estimatedMinutes,
        lastCompletedAt: null,
        completionsCount: 0,
        daysSinceLastCompletion: null,
        recommendedIntervalDays: defaultInterval,
        urgency: 'NEW_MODULE',
        reasonTr: `Bu değerlendirme ile ${domainTitle} alanındaki temel boyutlarınızı ilk kez keşfedebilirsiniz.`,
        ctaUrl: `/assessment?module=${moduleItem.moduleCode}`,
      });
      continue;
    }

    // Sort module sessions by completion date desc
    moduleSessions.sort((a, b) => {
      const dateA = new Date(a.completedAt || a.startedAt).getTime();
      const dateB = new Date(b.completedAt || b.startedAt).getTime();
      return dateB - dateA;
    });

    const latestSession = moduleSessions[0];
    const latestDate = new Date(latestSession.completedAt || latestSession.startedAt);
    const daysSince = Math.max(0, Math.floor((nowMs - latestDate.getTime()) / (1000 * 60 * 60 * 24)));

    let urgency: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
    let reasonTr = '';

    if (daysSince >= defaultInterval) {
      urgency = 'HIGH';
      reasonTr = `Son değerlendirmenizden bu yana ${daysSince} gün geçti. Zaman içindeki eğilimlerinizi güncellemek için tekrar ölçüm önerilir.`;
    } else if (daysSince >= REASSESSMENT_INTERVALS.SHORT) {
      urgency = 'MEDIUM';
      reasonTr = `Son değerlendirmenizden bu yana ${daysSince} gün geçti. Dilerseniz bu alanı tekrar değerlendirebilirsiniz.`;
    } else {
      urgency = 'LOW';
      reasonTr = `Son değerlendirmeniz yakın zamanda (${daysSince} gün önce) tamamlanmıştır; standart takip için ${defaultInterval - daysSince} gün sonra önerilir.`;
    }

    recommendations.push({
      moduleId: moduleItem.moduleCode,
      moduleCode: moduleItem.moduleCode,
      titleTr: moduleItem.titleTr,
      targetDomainNameTr: domainTitle,
      estimatedMinutes: moduleItem.estimatedMinutes,
      lastCompletedAt: latestDate.toISOString(),
      completionsCount,
      daysSinceLastCompletion: daysSince,
      recommendedIntervalDays: defaultInterval,
      urgency,
      reasonTr,
      ctaUrl: `/assessment?module=${moduleItem.moduleCode}`,
    });
  }

  // Sort recommendations: HIGH urgency first, then NEW_MODULE, then MEDIUM, then LOW
  const urgencyWeight = { HIGH: 4, NEW_MODULE: 3, MEDIUM: 2, LOW: 1 };
  recommendations.sort((a, b) => urgencyWeight[b.urgency] - urgencyWeight[a.urgency]);

  return recommendations;
}

/**
 * Compares two specific sessions of the same module for repeat measurement analysis.
 */
export function compareModuleSessions(
  previousSession: any,
  currentSession: any
): ModuleRepeatComparison {
  const modId = currentSession.formVersion?.module?.id || 'mod';
  const modCode = currentSession.formVersion?.module?.code || 'module';
  const modTitleTr = currentSession.formVersion?.module?.titleTr || 'Değerlendirme Modülü';

  const prevDate = previousSession.completedAt
    ? new Date(previousSession.completedAt).toISOString()
    : new Date(previousSession.startedAt).toISOString();

  const currDate = currentSession.completedAt
    ? new Date(currentSession.completedAt).toISOString()
    : new Date(currentSession.startedAt).toISOString();

  const prevQuality = ((previousSession.integrityResults?.[0]?.overallFlag || 'ACCEPTABLE').toUpperCase()) as ResponseQualityStatus;
  const currQuality = ((currentSession.integrityResults?.[0]?.overallFlag || 'ACCEPTABLE').toUpperCase()) as ResponseQualityStatus;

  // Extract facet scores from previous session
  const prevFacetScores = new Map<string, { sum: number; count: number }>();
  for (const resp of previousSession.responses || []) {
    const rawFacetId = resp.item?.facet?.id || resp.item?.facetId;
    if (!rawFacetId) continue;
    const cId = normalizeMasterFacetId(rawFacetId);
    if (!prevFacetScores.has(cId)) prevFacetScores.set(cId, { sum: 0, count: 0 });
    const acc = prevFacetScores.get(cId)!;
    acc.sum += resp.scoredValue ?? resp.rawValue;
    acc.count++;
  }

  // Extract facet scores from current session
  const currFacetScores = new Map<string, { sum: number; count: number }>();
  for (const resp of currentSession.responses || []) {
    const rawFacetId = resp.item?.facet?.id || resp.item?.facetId;
    if (!rawFacetId) continue;
    const cId = normalizeMasterFacetId(rawFacetId);
    if (!currFacetScores.has(cId)) currFacetScores.set(cId, { sum: 0, count: 0 });
    const acc = currFacetScores.get(cId)!;
    acc.sum += resp.scoredValue ?? resp.rawValue;
    acc.count++;
  }

  // Compare matching facets
  const comparisons: RepeatMeasurementComparisonItem[] = [];
  const allFacetIds = Array.from(new Set([...prevFacetScores.keys(), ...currFacetScores.keys()]));

  for (const fId of allFacetIds) {
    const prev = prevFacetScores.get(fId);
    const curr = currFacetScores.get(fId);
    if (!prev || !curr) continue; // only repeatedly measured facets

    const facetDef = MASTER_FACET_BY_ID.get(fId);
    if (!facetDef) continue;

    const prevScore = Number((prev.sum / prev.count).toFixed(2));
    const currScore = Number((curr.sum / curr.count).toFixed(2));
    const rawDelta = Number((currScore - prevScore).toFixed(2));

    const hasQualityLimitation =
      prevQuality === 'QUESTIONABLE' ||
      prevQuality === 'COMPROMISED' ||
      currQuality === 'QUESTIONABLE' ||
      currQuality === 'COMPROMISED';

    const { classification, direction, descriptionTr } = classifyObservedShift(
      rawDelta,
      hasQualityLimitation
    );

    let qualityNoteTr = 'Ölçüm kalitesi kabul edilebilir düzeydedir.';
    if (hasQualityLimitation) {
      qualityNoteTr = 'Oturumlardan birinde telemetri uyarısı bulunduğu için gözlenen fark temkinli yorumlanmalıdır.';
    }

    comparisons.push({
      facetId: fId,
      code: facetDef.code,
      nameTr: facetDef.nameTr,
      domainId: facetDef.domainId,
      previousScore: prevScore,
      currentScore: currScore,
      observedDelta: rawDelta,
      direction,
      classification,
      qualityNoteTr,
      neutralDescriptionTr: descriptionTr,
    });
  }

  const stableCount = comparisons.filter((c) => c.classification === 'STABLE_RANGE').length;
  const shiftedCount = comparisons.filter(
    (c) =>
      c.classification === 'SMALL_OBSERVED_SHIFT' ||
      c.classification === 'MODERATE_OBSERVED_SHIFT' ||
      c.classification === 'LARGE_OBSERVED_SHIFT' ||
      c.classification === 'QUALITY_LIMITED'
  ).length;

  const overallSummaryTr = `${comparisons.length} alt boyut karşılaştırıldı: ${stableCount} alt boyutta stabilite, ${shiftedCount} alt boyutta gözlenen puan farkı kaydedildi.`;

  return {
    moduleId: modId,
    moduleCode: modCode,
    moduleTitleTr: modTitleTr,
    previousSessionId: previousSession.id,
    previousCompletedAt: prevDate,
    previousQuality: prevQuality,
    currentSessionId: currentSession.id,
    currentCompletedAt: currDate,
    currentQuality: currQuality,
    comparisons,
    overallSummaryTr,
    governanceDisclaimerTr:
      'Ön kalibrasyon aşamasındaki bu karşılaştırma istatistiksel veya klinik anlamlılık iddia etmez; yalnızca iki oturum arasındaki betimsel gözlenen puan farkını yansıtır.',
  };
}
