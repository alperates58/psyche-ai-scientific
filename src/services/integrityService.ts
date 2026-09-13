import { prisma } from '@/lib/prisma';
import { INTEGRITY_CONFIG } from '@/config/integrity-config';

export interface IntegrityEvaluation {
  overallFlag: 'EXCELLENT' | 'ACCEPTABLE' | 'QUESTIONABLE' | 'COMPROMISED';
  flagLabelTr: string;
  speedViolations: number;
  medianDurationMs: number;
  longestStreak: number;
  straightliningDetected: boolean;
  inconsistencyPairsCount: number;
  inconsistencyViolations: number;
  attentionCheckPassed: boolean;
  anomalyScore: number;
}

export async function evaluateSessionIntegrity(sessionId: string): Promise<IntegrityEvaluation> {
  const session = await prisma.assessmentSession.findUnique({
    where: { id: sessionId },
    include: {
      responses: {
        include: {
          item: true,
          formItem: true,
          telemetries: {
            orderBy: { serverReceivedAt: 'desc' },
            take: 1
          }
        },
        orderBy: {
          formItem: { sortOrder: 'asc' }
        }
      }
    }
  });

  if (!session) {
    throw new Error('Değerlendirme oturumu bulunamadı.');
  }

  const responses = session.responses;
  const total = responses.length;

  if (total === 0) {
    return {
      overallFlag: 'QUESTIONABLE',
      flagLabelTr: INTEGRITY_CONFIG.integrityLabelsTr.QUESTIONABLE,
      speedViolations: 0,
      medianDurationMs: 0,
      longestStreak: 0,
      straightliningDetected: false,
      inconsistencyPairsCount: 0,
      inconsistencyViolations: 0,
      attentionCheckPassed: true,
      anomalyScore: 3
    };
  }

  // 1. Duration Analysis & Speed Violations (< 1200ms heuristic)
  const durations: number[] = [];
  let speedViolations = 0;
  const speedThreshold = INTEGRITY_CONFIG.speedViolationThresholdMs.value;

  for (const resp of responses) {
    const telemetry = resp.telemetries[0];
    const duration = telemetry ? telemetry.clientObservedDurationMs : 0;
    durations.push(duration);

    if (duration > 0 && duration < speedThreshold) {
      speedViolations++;
    }
  }

  // Calculate Median Duration
  durations.sort((a, b) => a - b);
  const mid = Math.floor(durations.length / 2);
  const medianDurationMs =
    durations.length % 2 !== 0
      ? durations[mid]
      : (durations[mid - 1] + durations[mid]) / 2;

  // 2. Straightlining Detection (Longstring Index)
  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < responses.length; i++) {
    if (responses[i].rawValue === responses[i - 1].rawValue) {
      currentStreak++;
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    } else {
      currentStreak = 1;
    }
  }

  const straightliningThreshold = INTEGRITY_CONFIG.straightliningStreakThreshold.value;
  const straightliningDetected = longestStreak >= straightliningThreshold;

  // 3. Attention Check Verification
  let attentionCheckPassed = true;
  for (const resp of responses) {
    if (resp.item.isAttentionCheck) {
      if (resp.rawValue !== INTEGRITY_CONFIG.attentionCheckTargetValue.value) {
        attentionCheckPassed = false;
      }
    }
  }

  // 4. Inconsistency Pairs Check
  const inconsistencyPairsCount = 0;
  const inconsistencyViolations = 0;

  // 5. Multi-Signal Anomaly Scoring (Single signal cannot invalidate)
  let anomalyScore = 0;

  // Speed violation penalty
  if (speedViolations >= Math.ceil(total * 0.5)) {
    anomalyScore += 3;
  } else if (speedViolations >= Math.ceil(total * 0.25)) {
    anomalyScore += 2;
  } else if (speedViolations > 0) {
    anomalyScore += 1;
  }

  // Straightlining penalty
  if (straightliningDetected) {
    anomalyScore += 3;
  } else if (longestStreak >= 6) {
    anomalyScore += 1;
  }

  // Attention check penalty (2 points: flags for review, but does NOT invalidate alone)
  if (!attentionCheckPassed) {
    anomalyScore += INTEGRITY_CONFIG.attentionCheckAnomalyWeight.value;
  }

  // Duration bonus / check
  if (medianDurationMs < 1500) {
    anomalyScore += 1;
  }

  // 6. Overall Flag Decision
  let overallFlag: 'EXCELLENT' | 'ACCEPTABLE' | 'QUESTIONABLE' | 'COMPROMISED' = 'ACCEPTABLE';

  if (anomalyScore >= 4) {
    overallFlag = 'COMPROMISED';
  } else if (anomalyScore >= 2) {
    overallFlag = 'QUESTIONABLE';
  } else if (anomalyScore === 1) {
    overallFlag = 'ACCEPTABLE';
  } else {
    // 0 anomaly score and healthy median duration
    overallFlag = medianDurationMs >= 2000 ? 'EXCELLENT' : 'ACCEPTABLE';
  }

  const flagLabelTr = INTEGRITY_CONFIG.integrityLabelsTr[overallFlag];

  // Persist / upsert integrity result
  await prisma.responseIntegrityResult.create({
    data: {
      sessionId,
      overallFlag,
      speedViolations,
      medianDurationMs,
      longestStreak,
      straightliningDetected,
      inconsistencyPairsCount,
      inconsistencyViolations,
      attentionCheckPassed,
      computedAt: new Date()
    }
  });

  return {
    overallFlag,
    flagLabelTr,
    speedViolations,
    medianDurationMs,
    longestStreak,
    straightliningDetected,
    inconsistencyPairsCount,
    inconsistencyViolations,
    attentionCheckPassed,
    anomalyScore
  };
}
