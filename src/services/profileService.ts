import { prisma } from '@/lib/prisma';
import { evaluateSessionIntegrity } from './integrityService';
import { calculatePreCalibrationScores } from './scoringService';
import { calculateProfileCoverage, TOTAL_ONTOLOGY_FACETS_SOURCE_OF_TRUTH } from '@/psychometrics/coverage';
import { resolveUnifiedPsychologicalProfileV2 } from '@/lib/profile/masterProfileResolver';
import { TOTAL_MASTER_FACETS_COUNT } from '@/lib/profile/masterModelConstants';
import { getUnifiedPsychologicalProfile } from './unifiedProfileService';
export { getUnifiedPsychologicalProfile, resolveUnifiedPsychologicalProfileV2 };


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

export interface UserProfileCoverageSummary {
  exploredFacetsCount: number;
  totalOntologyFacets: number;
  explorationPercentage: number;
  measurementDepthPercentage: number;
  isAssessed: boolean;
}

export async function getUserProfileCoverage(userId: string): Promise<UserProfileCoverageSummary> {
  try {
    const profile = await resolveUnifiedPsychologicalProfileV2(userId);
    return {
      exploredFacetsCount: profile.coverage.facetCoverage.measuredCount,
      totalOntologyFacets: TOTAL_MASTER_FACETS_COUNT, // 91 active master facets
      explorationPercentage: profile.coverage.facetCoverage.percentage,
      measurementDepthPercentage: profile.coverage.questionCoverage.percentage,
      isAssessed: profile.hasAssessments,
    };
  } catch (error) {
    return {
      exploredFacetsCount: 0,
      totalOntologyFacets: TOTAL_MASTER_FACETS_COUNT, // 91
      explorationPercentage: 0,
      measurementDepthPercentage: 0,
      isAssessed: false,
    };
  }
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

export interface UserLayerUnlockStatus {
  layerKey: string;
  titleTr: string;
  isUnlocked: boolean;
  unlockedAt: string | null;
  requiredModuleCodes: string[];
  completedRequiredCount: number;
  totalRequiredCount: number;
}

export interface StructuredProfileEvidence {
  userId: string;
  generatedAt: string;
  journeyStage: string;
  depthLevel: string;
  depthPercentage: number;
  unlockedLayers: UserLayerUnlockStatus[];
  unlockedTheoryLenses: Array<{
    lensCode: string;
    titleTr: string;
    isAvailable: boolean;
    evidenceCount: number;
    requiredDomains: string[];
  }>;
  measuredFacets: Array<{
    facetId: string;
    code: string;
    nameTr: string;
    rawMean: number;
    scaleMin: number;
    scaleMax: number;
    itemCount: number;
    constructCode: string;
    domainCode: string;
    instrumentName: string | null;
    confidenceLevel: string;
    epistemicStatus: string;
  }>;
  measuredConstructs: Array<{
    constructId: string;
    code: string;
    nameTr: string;
    compositeScore: number;
    scaleMin: number;
    scaleMax: number;
    facetCount: number;
    domainCode: string;
  }>;
  qualitySummary: {
    overallFlag: string;
    isClean: boolean;
    instrumentCount: number;
    measuredDomainsCount: number;
    totalDomainsCount: number;
    exploredFacetsCount: number;
    totalFacetsCount: number;
  };
}

export async function getUserLayerUnlocks(userId: string): Promise<UserLayerUnlockStatus[]> {
  const completedSessions = await prisma.assessmentSession.findMany({
    where: { userId, status: 'COMPLETED' },
    include: {
      formVersion: {
        include: { module: true }
      }
    },
    orderBy: { completedAt: 'asc' }
  });

  const completedModuleCodes = new Set(
    completedSessions.map(s => s.formVersion.module.code)
  );

  const layerDefinitions = [
    {
      layerKey: 'LAYER_1_FIRST_PROFILE',
      titleTr: 'İlk Profil (Temel Kişilik & Öz-Sistem Katmanı)',
      requiredModuleCodes: ['mod_core_hexaco_60', 'mod_self_agency', 'mod_emotion_regulation', 'mod_cognitive_epistemic'],
    },
    {
      layerKey: 'LAYER_2_PROFILE_EXPANSION',
      titleTr: 'Genişletilmiş Profil (İrade, İhtiyaçlar & İlişkiler Katmanı)',
      requiredModuleCodes: ['mod_volition_impulse', 'mod_basic_needs_sdt', 'mod_universal_values', 'mod_relational_attachment_empathy'],
    },
    {
      layerKey: 'LAYER_3_DEEP_PROFILE',
      titleTr: 'Derin Profil (Bilişsel Esneklik, Anlam, Çatışma & Dayanıklılık Katmanı)',
      requiredModuleCodes: [
        'mod_cognitive_adaptability',
        'mod_meaning_compassion_grit',
        'mod_conflict_boundaries',
        'mod_affective_distress',
        'mod_flourishing_vitality',
        'mod_coping_resilience',
        'mod_creativity_growth',
      ],
    },
    {
      layerKey: 'LAYER_4_ADVANCED_EXPLORATION',
      titleTr: 'İleri Düzey İnceleme (Karanlık Dörtlü & Uç Dinamikler Katmanı)',
      requiredModuleCodes: ['mod_dark_tetrad_advanced'],
    },
  ];

  return layerDefinitions.map(def => {
    const completedRequired = def.requiredModuleCodes.filter(c => completedModuleCodes.has(c));
    const isUnlocked = completedRequired.length === def.requiredModuleCodes.length;
    
    // Find latest completion timestamp among required modules
    let unlockedAt: string | null = null;
    if (isUnlocked) {
      const relevantSessions = completedSessions.filter(s => def.requiredModuleCodes.includes(s.formVersion.module.code));
      if (relevantSessions.length > 0) {
        const lastSession = relevantSessions[relevantSessions.length - 1];
        unlockedAt = lastSession.completedAt ? lastSession.completedAt.toISOString() : lastSession.startedAt.toISOString();
      }
    }

    return {
      layerKey: def.layerKey,
      titleTr: def.titleTr,
      isUnlocked,
      unlockedAt,
      requiredModuleCodes: def.requiredModuleCodes,
      completedRequiredCount: completedRequired.length,
      totalRequiredCount: def.requiredModuleCodes.length,
    };
  });
}

export async function getStructuredProfileEvidence(userId: string): Promise<StructuredProfileEvidence> {
  const unifiedProfile = await getUnifiedPsychologicalProfile(userId);
  const layerUnlocks = await getUserLayerUnlocks(userId);

  const measuredFacets: StructuredProfileEvidence['measuredFacets'] = [];
  const measuredConstructs: StructuredProfileEvidence['measuredConstructs'] = [];

  for (const domain of unifiedProfile.domains) {
    for (const construct of domain.constructs) {
      if (construct.isMeasured && construct.compositeScore !== null && construct.scale) {
        measuredConstructs.push({
          constructId: construct.constructId,
          code: construct.code,
          nameTr: construct.nameTr,
          compositeScore: construct.compositeScore,
          scaleMin: construct.scale.scaleMin,
          scaleMax: construct.scale.scaleMax,
          facetCount: construct.facetCount,
          domainCode: domain.code,
        });
      }

      for (const facet of construct.facets) {
        if (facet.isMeasured && facet.rawMean !== null && facet.scale) {
          measuredFacets.push({
            facetId: facet.facetId,
            code: facet.code,
            nameTr: facet.nameTr,
            rawMean: facet.rawMean,
            scaleMin: facet.scale.scaleMin,
            scaleMax: facet.scale.scaleMax,
            itemCount: facet.itemCount,
            constructCode: construct.code,
            domainCode: domain.code,
            instrumentName: facet.provenance?.moduleTitleTr || null,
            confidenceLevel: facet.confidenceLevel || 'MODERATE',
            epistemicStatus: facet.epistemicStatus,
          });
        }
      }
    }
  }

  // Determine Unlocked Theory Lenses for FAZ 2.18 / 2.19
  const domainCodesMeasured = new Set(
    unifiedProfile.domains.filter((d: { status: string; code: string }) => d.status !== 'UNMEASURED').map((d: { code: string }) => d.code)
  );

  const theoryLensDefinitions = [
    {
      lensCode: 'TRAIT_DISPOSITIONAL',
      titleTr: 'Ayırıcı Özellik & Mizaç Lensi (HEXACO / Big Five)',
      requiredDomains: ['core_personality'],
    },
    {
      lensCode: 'HUMANISTIC_SELF_ACTUALIZATION',
      titleTr: 'Hümanistik & Kendini Gerçekleştirme Lensi (Rogers / Maslow / SDT)',
      requiredDomains: ['self_system', 'motivational_value'],
    },
    {
      lensCode: 'COGNITIVE_BEHAVIORAL',
      titleTr: 'Bilişsel & Davranışsal Düzenleme Lensi (CBT / ERQ)',
      requiredDomains: ['cognitive_epistemic', 'emotional_affective'],
    },
    {
      lensCode: 'RELATIONAL_ATTACHMENT',
      titleTr: 'İlişkisel & Bağlanma Lensi (Bowlby / ECR-R)',
      requiredDomains: ['relational_interpersonal'],
    },
    {
      lensCode: 'VOLITIONAL_EXECUTION',
      titleTr: 'İrade & Yürütücü İşlevler Lensi (Bandura / Duckworth)',
      requiredDomains: ['regulatory_volitional'],
    },
    {
      lensCode: 'EXISTENTIAL_MEANING',
      titleTr: 'Varoluşsal & Anlam Lensi (Frankl / Yalom)',
      requiredDomains: ['existential_meaning'],
    },
  ];

  const unlockedTheoryLenses = theoryLensDefinitions.map(def => {
    const matchingDomains = def.requiredDomains.filter(d => domainCodesMeasured.has(d));
    const isAvailable = matchingDomains.length === def.requiredDomains.length;
    const evidenceCount = measuredFacets.filter(f => def.requiredDomains.includes(f.domainCode)).length;

    return {
      lensCode: def.lensCode,
      titleTr: def.titleTr,
      isAvailable,
      evidenceCount,
      requiredDomains: def.requiredDomains,
    };
  });

  return {
    userId,
    generatedAt: new Date().toISOString(),
    journeyStage: unifiedProfile.maturity.stage,
    depthLevel: unifiedProfile.maturity.labelTr,
    depthPercentage: unifiedProfile.qualityDimensions.coverage.depthPercentage,
    unlockedLayers: layerUnlocks,
    unlockedTheoryLenses,
    measuredFacets,
    measuredConstructs,
    qualitySummary: {
      overallFlag: unifiedProfile.responseQuality.overallFlag,
      isClean: unifiedProfile.responseQuality.isClean,
      instrumentCount: unifiedProfile.qualityDimensions.methodDiversity.instrumentCount,
      measuredDomainsCount: unifiedProfile.qualityDimensions.coverage.measuredDomains,
      totalDomainsCount: unifiedProfile.qualityDimensions.coverage.totalDomains,
      exploredFacetsCount: unifiedProfile.qualityDimensions.coverage.exploredFacets,
      totalFacetsCount: unifiedProfile.qualityDimensions.coverage.totalFacets,
    },
  };
}

