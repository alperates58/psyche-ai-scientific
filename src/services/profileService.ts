import { prisma } from '@/lib/prisma';
import { evaluateSessionIntegrity } from './integrityService';
import { calculatePreCalibrationScores } from './scoringService';

export async function finalizeAssessmentAndCreateSnapshot(
  sessionId: string,
  userId: string
) {
  // 1. Session verification & state check
  const session = await prisma.assessmentSession.findUnique({
    where: { id: sessionId },
    include: {
      responses: true,
      formVersion: {
        include: {
          items: true
        }
      }
    }
  });

  if (!session) {
    throw new Error('Değerlendirme oturumu bulunamadı.');
  }

  if (session.userId !== userId) {
    throw new Error('Yetkisiz oturum sonlandırma işlemi.');
  }

  if (session.status === 'COMPLETED') {
    throw new Error('Bu değerlendirme oturumu zaten tamamlanmış ve dondurulmuştur.');
  }

  // Check if at least some responses have been recorded
  if (session.responses.length === 0) {
    throw new Error('Tamamlamak için en az bir soruya cevap verilmiş olmalıdır.');
  }

  // 2. Evaluate Integrity and Pre-Calibration Scores
  const integrity = await evaluateSessionIntegrity(sessionId);
  const scores = await calculatePreCalibrationScores(sessionId);

  // 3. Atomic Finalization Transaction
  return await prisma.$transaction(async tx => {
    // Mark session as completed
    const completedSession = await tx.assessmentSession.update({
      where: { id: sessionId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date()
      }
    });

    // Create Profile Snapshot
    const snapshot = await tx.profileSnapshot.create({
      data: {
        userId,
        scoringModelVersionId: scores.scoringModelVersionId,
        overallIntegrity: integrity.overallFlag,
        provisionalComposite: scores.provisionalComposite,
        normStatus: 'UNAVAILABLE',
        standardError: null,
        ci95Lower: null,
        ci95Upper: null
      }
    });

    // Link Snapshot to Session
    await tx.profileSnapshotSession.create({
      data: {
        profileSnapshotId: snapshot.id,
        assessmentSessionId: completedSession.id
      }
    });

    // Insert Facet Scores
    for (const fs of scores.facetScores) {
      await tx.facetScore.create({
        data: {
          profileSnapshotId: snapshot.id,
          facetId: fs.facetId,
          rawMean: fs.rawMean,
          itemCount: fs.itemCount,
          standardError: null,
          ci95Lower: null,
          ci95Upper: null,
          normVersionId: null
        }
      });
    }

    // Insert Construct Scores
    for (const cs of scores.constructScores) {
      await tx.constructScore.create({
        data: {
          profileSnapshotId: snapshot.id,
          constructId: cs.constructId,
          compositeScore: cs.compositeScore,
          facetCount: cs.facetCount,
          standardError: null,
          ci95Lower: null,
          ci95Upper: null,
          normVersionId: null
        }
      });
    }

    // Insert Domain Scores
    for (const ds of scores.domainScores) {
      await tx.domainScore.create({
        data: {
          profileSnapshotId: snapshot.id,
          domainId: ds.domainId,
          compositeScore: ds.compositeScore,
          constructCount: ds.constructCount,
          standardError: null,
          ci95Lower: null,
          ci95Upper: null,
          normVersionId: null
        }
      });
    }

    return getSnapshotById(snapshot.id, tx);
  });
}

export async function getSnapshotById(snapshotId: string, client: any = prisma) {
  return client.profileSnapshot.findUnique({
    where: { id: snapshotId },
    include: {
      user: true,
      scoringModelVersion: true,
      domainScores: {
        include: { domain: true },
        orderBy: { domain: { sortOrder: 'asc' } }
      },
      constructScores: {
        include: { construct: true },
        orderBy: { construct: { sortOrder: 'asc' } }
      },
      facetScores: {
        include: {
          facet: {
            include: {
              construct: true,
              scientificSources: { include: { source: true } },
              instruments: { include: { instrument: true } },
              theoryLenses: { include: { theoryLens: true } }
            }
          }
        },
        orderBy: { facet: { sortOrder: 'asc' } }
      },
      sessions: {
        include: {
          assessmentSession: {
            include: {
              integrityResults: {
                orderBy: { computedAt: 'desc' },
                take: 1
              }
            }
          }
        }
      }
    }
  });
}

export async function getLatestProfileSnapshotForUser(userId: string) {
  const snapshot = await prisma.profileSnapshot.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });

  if (!snapshot) return null;
  return getSnapshotById(snapshot.id);
}

export interface SnapshotAuditReport {
  snapshotId: string;
  scoringModelCode: string;
  normStatus: string;
  isPreCalibration: boolean;
  totalResponsesAudited: number;
  storedProvisionalComposite: number;
  recomputedProvisionalComposite: number;
  isReproducible: boolean;
  sourceSessionsCount: number;
  itemLevelAudit: Array<{
    itemId: string;
    itemVersionId: string;
    selectedOptionVersionId: string;
    rawValue: number;
    scoredValue: number;
    isKeyed: boolean;
    reverseScoredCorrectly: boolean;
  }>;
}

export async function auditSnapshotProvenance(snapshotId: string): Promise<SnapshotAuditReport> {
  const snapshot = await prisma.profileSnapshot.findUnique({
    where: { id: snapshotId },
    include: {
      scoringModelVersion: true,
      sessions: {
        include: {
          assessmentSession: {
            include: {
              formVersion: true,
              responses: {
                include: {
                  item: true,
                  itemVersion: {
                    include: {
                      options: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  if (!snapshot) {
    throw new Error(`Snapshot bulunamadı: ${snapshotId}`);
  }

  const allResponses = snapshot.sessions.flatMap(s => s.assessmentSession.responses);
  const itemLevelAudit = [];

  for (const resp of allResponses) {
    const options = resp.itemVersion.options;
    const minScale = Math.min(...options.map(o => o.value));
    const maxScale = Math.max(...options.map(o => o.value));
    const expectedScored = resp.item.isKeyed ? resp.rawValue : (minScale + maxScale) - resp.rawValue;
    const reverseScoredCorrectly = Math.abs(resp.scoredValue - expectedScored) < 0.001;

    itemLevelAudit.push({
      itemId: resp.itemId,
      itemVersionId: resp.itemVersionId,
      selectedOptionVersionId: resp.selectedOptionVersionId,
      rawValue: resp.rawValue,
      scoredValue: resp.scoredValue,
      isKeyed: resp.item.isKeyed,
      reverseScoredCorrectly
    });
  }

  // Recompute scores from the ground up using the first session ID
  const sessionId = snapshot.sessions[0]?.assessmentSessionId;
  const recomputed = await calculatePreCalibrationScores(sessionId);

  const isReproducible =
    Math.abs(snapshot.provisionalComposite - recomputed.provisionalComposite) < 0.005 &&
    itemLevelAudit.every(a => a.reverseScoredCorrectly);

  return {
    snapshotId,
    scoringModelCode: snapshot.scoringModelVersion.code,
    normStatus: snapshot.normStatus,
    isPreCalibration: snapshot.scoringModelVersion.isPreCalibration,
    totalResponsesAudited: allResponses.length,
    storedProvisionalComposite: snapshot.provisionalComposite,
    recomputedProvisionalComposite: recomputed.provisionalComposite,
    isReproducible,
    sourceSessionsCount: snapshot.sessions.length,
    itemLevelAudit
  };
}
