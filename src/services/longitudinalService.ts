/**
 * PsycheAI Longitudinal Profile Service (FAZ 2.20)
 *
 * Provides authoritative access to longitudinal profiles, trajectories,
 * measurement epochs, and reassessment recommendations.
 *
 * Strict invariants:
 * - Deterministic computation from immutable assessment sessions and snapshots.
 * - Latest point in each facet trajectory strictly agrees with the current UnifiedPsychologicalProfileV2.
 * - Zero database mutations during longitudinal resolution (pure read layer).
 */

import { prisma } from '@/lib/prisma';
import {
  buildLongitudinalProfile,
  buildLongitudinalEvidenceBundleV1,
} from '@/lib/longitudinal/longitudinalEngine';
import {
  evaluateReassessmentRecommendations,
  compareModuleSessions,
} from '@/lib/longitudinal/reassessmentEngine';
import { resolveUnifiedPsychologicalProfileV2 } from '@/lib/profile/masterProfileResolver';
import {
  LongitudinalProfileV1,
  LongitudinalEvidenceBundleV1,
  ReassessmentRecommendation,
  ModuleRepeatComparison,
} from '@/types/longitudinal';

export interface GetLongitudinalProfileOptions {
  mockSessions?: any[];
  epochGroupingWindowDays?: number;
}

/**
 * Resolves the user's complete LongitudinalProfileV1.
 */
export async function getUserLongitudinalProfile(
  userId: string,
  options?: GetLongitudinalProfileOptions
): Promise<LongitudinalProfileV1> {
  // 1. Fetch user identity
  let userName = 'Kullanıcı';
  if (!options?.mockSessions) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true },
      });
      if (user?.name) userName = user.name;
    } catch {
      // Offline fallback
    }
  }

  // 2. Fetch completed sessions
  let sessions: any[] = [];
  if (options?.mockSessions) {
    sessions = options.mockSessions;
  } else {
    try {
      sessions = await prisma.assessmentSession.findMany({
        where: {
          userId,
          status: 'COMPLETED',
        },
        include: {
          formVersion: {
            include: {
              module: true,
              items: {
                include: {
                  itemVersion: {
                    include: {
                      item: {
                        include: {
                          facet: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            include: {
              item: {
                include: {
                  facet: true,
                },
              },
            },
          },
          integrityResults: {
            orderBy: { computedAt: 'desc' },
            take: 1,
          },
          snapshotSessions: {
            include: {
              profileSnapshot: {
                include: {
                  scoringModelVersion: true,
                  facetScores: true,
                  constructScores: true,
                  domainScores: true,
                },
              },
            },
          },
        },
        orderBy: { completedAt: 'asc' },
      });
    } catch {
      sessions = [];
    }
  }

  // 3. Build longitudinal profile
  const longitudinalProfile = buildLongitudinalProfile({
    userId,
    userName,
    sessions,
    epochGroupingWindowDays: options?.epochGroupingWindowDays,
  });

  return longitudinalProfile;
}

/**
 * Returns the pseudonymized LongitudinalEvidenceBundleV1 for AI insights or exports.
 */
export async function getUserLongitudinalEvidenceBundle(
  userId: string,
  options?: GetLongitudinalProfileOptions
): Promise<LongitudinalEvidenceBundleV1> {
  const profile = await getUserLongitudinalProfile(userId, options);
  return buildLongitudinalEvidenceBundleV1(profile);
}

/**
 * Returns prioritized reassessment recommendations for the user.
 */
export async function getUserReassessmentRecommendations(
  userId: string,
  options?: GetLongitudinalProfileOptions
): Promise<ReassessmentRecommendation[]> {
  let sessions: any[] = [];
  if (options?.mockSessions) {
    sessions = options.mockSessions;
  } else {
    try {
      sessions = await prisma.assessmentSession.findMany({
        where: { userId, status: 'COMPLETED' },
        include: {
          formVersion: {
            include: { module: true },
          },
        },
        orderBy: { completedAt: 'desc' },
      });
    } catch {
      sessions = [];
    }
  }

  return evaluateReassessmentRecommendations(sessions);
}

/**
 * Compares the two most recent completed sessions of a given module for a user.
 */
export async function getModuleRepeatComparison(
  userId: string,
  moduleIdOrCode: string,
  options?: GetLongitudinalProfileOptions
): Promise<ModuleRepeatComparison | null> {
  let moduleSessions: any[] = [];

  if (options?.mockSessions) {
    moduleSessions = options.mockSessions.filter(
      (s) =>
        s.status === 'COMPLETED' &&
        (s.formVersion?.moduleId === moduleIdOrCode ||
          s.formVersion?.module?.id === moduleIdOrCode ||
          s.formVersion?.module?.code === moduleIdOrCode)
    );
  } else {
    try {
      moduleSessions = await prisma.assessmentSession.findMany({
        where: {
          userId,
          status: 'COMPLETED',
          OR: [
            { formVersion: { moduleId: moduleIdOrCode } },
            { formVersion: { module: { id: moduleIdOrCode } } },
            { formVersion: { module: { code: moduleIdOrCode } } },
          ],
        },
        include: {
          formVersion: { include: { module: true } },
          responses: {
            include: {
              item: { include: { facet: true } },
            },
          },
          integrityResults: {
            orderBy: { computedAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { completedAt: 'desc' },
      });
    } catch {
      moduleSessions = [];
    }
  }

  if (moduleSessions.length < 2) {
    return null;
  }

  // Most recent = index 0, previous = index 1
  const currentSession = moduleSessions[0];
  const previousSession = moduleSessions[1];

  return compareModuleSessions(previousSession, currentSession);
}
