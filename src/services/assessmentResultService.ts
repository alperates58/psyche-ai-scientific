import { prisma } from '@/lib/prisma';
import {
  ASSESSMENT_VISUAL_REGISTRY,
  HEXACO_CONSTRUCT_INTERPRETATIONS,
  TRAIT_DYNAMIC_RULES,
  deriveKeyObservations,
  getScoreBand,
  ScoreBandDetails,
  VisualRepresentationType,
  TraitInterpretationDefinition,
} from '@/lib/assessmentInterpretationConfig';
import { getUserAssessmentJourney, NextActionDetails } from './assessmentJourneyService';

export interface MeasuredFacetViewModel {
  facetId: string;
  code: string;
  nameTr: string;
  definitionTr: string;
  rawMean: number;
  itemCount: number;
  bandInfo: ScoreBandDetails;
}

export interface MeasuredConstructViewModel {
  constructId: string;
  code: string;
  nameTr: string;
  descriptionTr: string;
  compositeScore: number;
  scorePercentage: number;
  bandInfo: ScoreBandDetails;
  facetCount: number;
  interpretation?: TraitInterpretationDefinition;
  facets: MeasuredFacetViewModel[];
}

export interface UnmeasuredDomainViewModel {
  domainId: string;
  code: string;
  nameTr: string;
  descriptionTr: string;
  status: 'UNMEASURED';
}

export interface DynamicInsightViewModel {
  id: string;
  titleTr: string;
  type: 'SYNERGY' | 'TENSION';
  descriptionTr: string;
}

export interface AssessmentResultViewModel {
  sessionId: string;
  userId: string;
  isCompleted: boolean;
  module: {
    id: string;
    code: string;
    titleTr: string;
    titleEn: string;
    descriptionTr: string;
    estimatedMinutes: number;
  };
  formVersion: {
    id: string;
    versionCode: string;
    itemCount: number;
    description?: string | null;
  };
  snapshot: {
    id: string;
    scoringModelCode: string;
    isPreCalibration: boolean;
    normStatus: string;
    provisionalComposite: number;
    createdAt: string;
  };
  timestamps: {
    startedAt: string;
    completedAt: string;
    durationMs: number;
    durationFormatted: string;
  };
  integrity: {
    overallFlag: string;
    isClean: boolean;
    speedViolations: number;
    straightliningDetected: boolean;
    attentionCheckPassed: boolean;
    focusLostCount: number;
    medianDurationMs: number;
    explanationTr: string;
  };
  visualType: VisualRepresentationType;
  compositeScore: number;
  compositeScoreFormatted: string;
  keyObservations: string[];
  constructs: MeasuredConstructViewModel[];
  radarData: Array<{
    name: string;
    name_tr: string;
    score: number;
    scaleMin: number;
    scaleMax: number;
  }>;
  strengths: Array<{
    traitName: string;
    point: string;
  }>;
  growthAndRisks: Array<{
    traitName: string;
    point: string;
  }>;
  dynamics: DynamicInsightViewModel[];
  unmeasuredDomains: UnmeasuredDomainViewModel[];
  historicalSessions: Array<{
    sessionId: string;
    versionCode: string;
    completedAt: string;
    isCurrent: boolean;
  }>;
  nextAction: NextActionDetails | null;
}

function formatDuration(ms: number): string {
  if (!ms || ms <= 0) return '1 dk';
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds} sn`;
  if (seconds === 0) return `${minutes} dk`;
  return `${minutes} dk ${seconds} sn`;
}

/**
 * Pure and comprehensive view-model builder for assessment results.
 * Preserves historical form version, guarantees user ownership, and adheres strictly
 * to scientific honesty (no fabricated norms or percentiles).
 */
export async function getAssessmentResultView(
  userId: string,
  sessionId: string
): Promise<AssessmentResultViewModel> {
  // 1. Query assessment session
  const session = await prisma.assessmentSession.findUnique({
    where: { id: sessionId },
    include: {
      user: true,
      formVersion: {
        include: {
          module: true,
        },
      },
      integrityResults: {
        orderBy: { computedAt: 'desc' },
        take: 1,
      },
      telemetries: true,
      snapshotSessions: {
        include: {
          profileSnapshot: {
            include: {
              scoringModelVersion: true,
              domainScores: {
                include: { domain: true },
                orderBy: { domain: { sortOrder: 'asc' } },
              },
              constructScores: {
                include: { construct: true },
                orderBy: { construct: { sortOrder: 'asc' } },
              },
              facetScores: {
                include: {
                  facet: {
                    include: { construct: true },
                  },
                },
                orderBy: { facet: { sortOrder: 'asc' } },
              },
            },
          },
        },
      },
    },
  });

  if (!session) {
    throw new Error('Değerlendirme oturumu bulunamadı.');
  }

  // 2. Security & Ownership check
  if (session.userId !== userId) {
    throw new Error('Bu değerlendirme sonucuna erişim yetkiniz bulunmamaktadır.');
  }

  if (session.status !== 'COMPLETED') {
    throw new Error('Bu değerlendirme henüz tamamlanmamış ve sonuçları oluşturulmamıştır.');
  }

  const linkedSnapshot = session.snapshotSessions[0]?.profileSnapshot;
  if (!linkedSnapshot) {
    throw new Error('Bu değerlendirmeye ait profil kaydı (snapshot) bulunamadı.');
  }

  // 3. Query all historical sessions for this user and module
  const historicalSessionsQuery = await prisma.assessmentSession.findMany({
    where: {
      userId,
      formVersion: { moduleId: session.formVersion.moduleId },
      status: 'COMPLETED',
    },
    include: {
      formVersion: {
        select: { versionCode: true },
      },
    },
    orderBy: { completedAt: 'desc' },
  });

  const historicalSessions = historicalSessionsQuery.map((h) => ({
    sessionId: h.id,
    versionCode: h.formVersion.versionCode,
    completedAt: h.completedAt ? h.completedAt.toISOString() : h.startedAt.toISOString(),
    isCurrent: h.id === sessionId,
  }));

  // 4. Extract Integrity telemetry
  const latestIntegrity = session.integrityResults[0];
  const overallFlag = latestIntegrity?.overallFlag || 'ACCEPTABLE';
  const isClean = overallFlag === 'EXCELLENT' || overallFlag === 'ACCEPTABLE';
  const totalFocusLoss = session.telemetries.reduce((acc, t) => acc + (t.focusLostCount || 0), 0);

  let explanationTr = 'Yanıtlama deseniniz tutarlı ve ölçüm kriterlerine uygundur.';
  if (overallFlag === 'EXCELLENT') {
    explanationTr = 'Tüm yanıtlama hızı ve dikkat kontrol kriterleri yüksek güvenilirlikle karşılanmıştır.';
  } else if (overallFlag === 'QUESTIONABLE') {
    explanationTr = 'Bazı maddelerde hızlı geçiş veya sekme değişimi tespit edilmiştir. Sonuçlar genel eğilimi yansıtır.';
  } else if (overallFlag === 'COMPROMISED') {
    explanationTr = 'Yanıtlama süresi veya dikkat maddelerinde uyumsuzluk saptanmıştır.';
  }

  // Calculate actual duration
  const startMs = new Date(session.startedAt).getTime();
  const endMs = session.completedAt ? new Date(session.completedAt).getTime() : startMs;
  const durationMs = session.totalDurationMs > 0 ? session.totalDurationMs : Math.max(0, endMs - startMs);

  // 5. Build measured constructs and facets
  const constructScoresMap: Record<string, number> = {};
  const constructs: MeasuredConstructViewModel[] = [];

  for (const cs of linkedSnapshot.constructScores) {
    constructScoresMap[cs.construct.code] = cs.compositeScore;
    const bandInfo = getScoreBand(cs.compositeScore);
    const interp = HEXACO_CONSTRUCT_INTERPRETATIONS[cs.construct.code];

    // Find facets for this construct in this snapshot
    const matchingFacets = linkedSnapshot.facetScores
      .filter((fs) => fs.facet.constructId === cs.constructId)
      .map((fs) => ({
        facetId: fs.facetId,
        code: fs.facet.code,
        nameTr: fs.facet.nameTr,
        definitionTr: fs.facet.descriptionTr,
        rawMean: fs.rawMean,
        itemCount: fs.itemCount,
        bandInfo: getScoreBand(fs.rawMean),
      }));

    constructs.push({
      constructId: cs.constructId,
      code: cs.construct.code,
      nameTr: cs.construct.nameTr,
      descriptionTr: cs.construct.descriptionTr,
      compositeScore: cs.compositeScore,
      scorePercentage: Math.round(((cs.compositeScore - 1.0) / 4.0) * 100),
      bandInfo,
      facetCount: cs.facetCount,
      interpretation: interp,
      facets: matchingFacets,
    });
  }

  // 6. Build Radar Data
  const radarData = constructs.map((c) => ({
    name: c.code,
    name_tr: c.nameTr,
    score: Number((c.compositeScore * 20).toFixed(1)), // convert 1-5 scale to 0-100 for radar rendering
    scaleMin: 0,
    scaleMax: 100,
  }));

  // 7. Derive Key Observations
  const keyObservations = deriveKeyObservations(
    constructs.map((c) => ({
      code: c.code,
      nameTr: c.nameTr,
      compositeScore: c.compositeScore,
    }))
  );

  // 8. Derive Strengths & Growth Areas
  const strengths: Array<{ traitName: string; point: string }> = [];
  const growthAndRisks: Array<{ traitName: string; point: string }> = [];

  for (const c of constructs) {
    const interp = c.interpretation;
    if (!interp) continue;

    const traitStrengths = interp.strengths[c.bandInfo.band] || [];
    for (const st of traitStrengths) {
      if (strengths.length < 4) {
        strengths.push({ traitName: c.nameTr, point: st });
      }
    }

    const traitRisks = interp.risks[c.bandInfo.band] || [];
    for (const rk of traitRisks) {
      if (growthAndRisks.length < 3) {
        growthAndRisks.push({ traitName: c.nameTr, point: rk });
      }
    }
  }

  // 9. Evaluate Dynamics (Synergies & Tensions)
  const dynamics: DynamicInsightViewModel[] = [];
  for (const rule of TRAIT_DYNAMIC_RULES) {
    if (rule.condition(constructScoresMap)) {
      dynamics.push({
        id: rule.id,
        titleTr: rule.titleTr,
        type: rule.type,
        descriptionTr: rule.descriptionTr,
      });
    }
  }

  // Fallback dynamic if none matched
  if (dynamics.length === 0) {
    dynamics.push({
      id: 'balanced_integration',
      titleTr: 'Dengeli Profil Dinamiği',
      type: 'SYNERGY',
      descriptionTr:
        'Kişilik boyutlarınız arasında belirgin bir aşırılık veya sürtüşme bulunmamakta, farklı sosyal ve profesyonel bağlamlara dengeli bir adaptasyon sergilemektedir.',
    });
  }

  // 10. Query Unmeasured Domains
  const measuredDomainIds = new Set(linkedSnapshot.domainScores.map((d) => d.domainId));
  const allDomains = await prisma.domain.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  const unmeasuredDomains: UnmeasuredDomainViewModel[] = allDomains
    .filter((d) => !measuredDomainIds.has(d.id))
    .map((d) => ({
      domainId: d.id,
      code: d.code,
      nameTr: d.nameTr,
      descriptionTr: d.descriptionTr,
      status: 'UNMEASURED',
    }));

  // 11. Next Action Recommendation
  const journey = await getUserAssessmentJourney(userId);
  const nextAction = journey.nextAction;

  // 12. Visual Representation Archetype
  const visualType =
    ASSESSMENT_VISUAL_REGISTRY[session.formVersion.module.code] || 'HEXACO_RADAR';

  return {
    sessionId: session.id,
    userId: session.userId,
    isCompleted: true,
    module: {
      id: session.formVersion.module.id,
      code: session.formVersion.module.code,
      titleTr: session.formVersion.module.titleTr,
      titleEn: session.formVersion.module.titleEn,
      descriptionTr: session.formVersion.module.descriptionTr,
      estimatedMinutes: session.formVersion.module.estimatedMinutes,
    },
    formVersion: {
      id: session.formVersion.id,
      versionCode: session.formVersion.versionCode,
      itemCount: session.formVersion.itemCount,
      description: session.formVersion.description,
    },
    snapshot: {
      id: linkedSnapshot.id,
      scoringModelCode: linkedSnapshot.scoringModelVersion.code,
      isPreCalibration: linkedSnapshot.scoringModelVersion.isPreCalibration,
      normStatus: linkedSnapshot.normStatus,
      provisionalComposite: linkedSnapshot.provisionalComposite,
      createdAt: linkedSnapshot.createdAt.toISOString(),
    },
    timestamps: {
      startedAt: session.startedAt.toISOString(),
      completedAt: session.completedAt ? session.completedAt.toISOString() : session.startedAt.toISOString(),
      durationMs,
      durationFormatted: formatDuration(durationMs),
    },
    integrity: {
      overallFlag,
      isClean,
      speedViolations: latestIntegrity?.speedViolations || 0,
      straightliningDetected: latestIntegrity?.straightliningDetected || false,
      attentionCheckPassed: latestIntegrity?.attentionCheckPassed ?? true,
      focusLostCount: totalFocusLoss,
      medianDurationMs: latestIntegrity?.medianDurationMs || 0,
      explanationTr,
    },
    visualType,
    compositeScore: linkedSnapshot.provisionalComposite,
    compositeScoreFormatted: `${linkedSnapshot.provisionalComposite.toFixed(1)} / 5.0`,
    keyObservations,
    constructs,
    radarData,
    strengths,
    growthAndRisks,
    dynamics,
    unmeasuredDomains,
    historicalSessions,
    nextAction,
  };
}
