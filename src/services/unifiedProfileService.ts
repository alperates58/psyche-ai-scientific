import { prisma } from '@/lib/prisma';
import { TOTAL_ONTOLOGY_FACETS_SOURCE_OF_TRUTH, calculateProfileCoverage } from '@/psychometrics/coverage';
import { resolveScoringStrategy, HEXACO_PRECALIBRATION_STRATEGY } from '@/lib/scoringStrategies';
import { ALL_TRAIT_INTERPRETATIONS, getScoreBand } from '@/lib/assessmentInterpretationConfig';
import {
  evaluateUnifiedInteractions,
  evaluateProfileTensionMatrix,
} from '@/lib/unifiedInteractionRegistry';
import { getCategorizedVisualizations } from '@/lib/profileVisualizationRegistry';
import {
  deriveDimensionConfidence,
  buildProfileConfidenceMap,
  deriveProfileCompleteness,
  STANDARD_USER_PROFILE_DOMAIN_CODES,
} from '@/lib/profileConfidenceEvaluator';
import { resolveDescriptiveBand } from '@/lib/descriptiveBandPolicyRegistry';
import {
  resolveFacetValidationEvidence,
  ResolvedFacetEvidence,
} from '@/lib/facetEvidenceResolver';
import { getUserAssessmentJourney } from './assessmentJourneyService';
import { resolveUnifiedPsychologicalProfileV2 } from '@/lib/profile/masterProfileResolver';
export { resolveUnifiedPsychologicalProfileV2 };
import {
  UnifiedProfileViewModel,
  UnifiedDomainViewModel,
  UnifiedConstructViewModel,
  UnifiedFacetViewModel,
  ProfileFingerprintDimension,
  ProfileMaturityStage,
  UnifiedResponseQualitySummary,
  UnifiedQualityDimensions,
  SourceAssessmentProvenance,
  MeasurementScaleMetadata,
  MeasurementProvenanceMetadata,
  ScoreBandDetails,
} from '@/types/profile';
import { DimensionConfidence } from '@/types/confidence';
import {
  HeatmapCellViewModel,
  HeatmapRowViewModel,
  HeatmapMatrixViewModel,
  HeatmapCellState,
} from '@/types/heatmap';

/**
 * Deterministic Profile Maturity Evaluator (Product Measurement Coverage Concept only).
 * Base it purely on actual measurement coverage (completed assessments, measured domains, measured facets).
 * NEVER base on psychological score magnitude or clinical completeness.
 */
export function deriveProfileMaturity(params: {
  completedAssessmentsCount: number;
  measuredDomainsCount: number;
  measuredFacetsCount: number;
  totalOntologyFacets: number;
}): {
  stage: ProfileMaturityStage;
  labelTr: string;
  descriptionTr: string;
  progressPercentage: number;
} {
  const { completedAssessmentsCount, measuredDomainsCount, measuredFacetsCount, totalOntologyFacets } = params;

  const total = totalOntologyFacets > 0 ? totalOntologyFacets : 84;
  const progressPercentage = Math.min(100, Math.max(0, Math.round((measuredFacetsCount / total) * 100)));

  if (completedAssessmentsCount === 0 || measuredFacetsCount === 0) {
    return {
      stage: 'BAŞLANGIÇ',
      labelTr: 'Başlangıç Aşaması',
      descriptionTr: 'Henüz tamamlanmış bir psikolojik değerlendirme bulunmuyor.',
      progressPercentage: 0,
    };
  }

  // KAPSAMLI: requires high ontology facet coverage (>= 60/84, ~71%+) AND broad domain coverage (>= 6 domains)
  if (measuredFacetsCount >= 60 && measuredDomainsCount >= 6) {
    return {
      stage: 'KAPSAMLI',
      labelTr: 'Kapsamlı Profil',
      descriptionTr: `Ontolojideki alt boyutların büyük çoğunluğu (%${progressPercentage}) ${measuredDomainsCount} alanda taranmıştır.`,
      progressPercentage,
    };
  }

  // GENİŞLEYEN: requires substantial facet coverage (>= 35/84, ~41%+) AND multiple domains (>= 4 domains)
  if (measuredFacetsCount >= 35 && measuredDomainsCount >= 4) {
    return {
      stage: 'GENİŞLEYEN',
      labelTr: 'Genişleyen Profil',
      descriptionTr: `Geniş ontolojik kapsama (%${progressPercentage}) ulaşıldı. ${measuredDomainsCount} alanda psikolojik dinamikler analiz edilmektedir.`,
      progressPercentage,
    };
  }

  // GELİŞEN: requires meaningful facet coverage (>= 15/84) AND at least 2 domains
  if (measuredFacetsCount >= 15 && measuredDomainsCount >= 2) {
    return {
      stage: 'GELİŞEN',
      labelTr: 'Gelişen Profil',
      descriptionTr: `Temel psikolojik boyutlar (%${progressPercentage} kapsam) ${measuredDomainsCount} alanda haritalandırılmıştır.`,
      progressPercentage,
    };
  }

  // BAŞLANGIÇ: narrow/initial coverage (<15 facets or <2 domains)
  return {
    stage: 'BAŞLANGIÇ',
    labelTr: 'Başlangıç Profili',
    descriptionTr: `Başlangıç seviyesinde ölçüm yapılmıştır (%${progressPercentage} kapsam). Yeni modüllerle profilinizi zenginleştirebilirsiniz.`,
    progressPercentage,
  };
}

/**
 * Aggregates response-quality signals across assessments contributing to the active profile.
 * Strictly avoids generating a fake master confidence percentage.
 */
export function deriveUnifiedResponseQuality(
  sessionsWithIntegrity: Array<{
    moduleTitleTr: string;
    overallFlag: string;
    speedViolations: number;
    straightliningDetected: boolean;
    attentionCheckPassed: boolean;
  }>
): UnifiedResponseQualitySummary {
  if (!sessionsWithIntegrity || sessionsWithIntegrity.length === 0) {
    return {
      overallFlag: 'ACCEPTABLE',
      isClean: true,
      totalAssessmentsAudited: 0,
      statusCounts: { excellent: 0, acceptable: 0, questionable: 0, compromised: 0 },
      speedViolationsCount: 0,
      straightliningDetected: false,
      attentionChecksPassed: true,
      headlineTr: 'Henüz Veri Kaydı Yok',
      explanationTr: 'Değerlendirmeler tamamlandıkça yanıt bütünlüğü ve veri kalitesi telemetrisi burada sunulur.',
    };
  }

  let totalSpeedViolations = 0;
  let anyStraightlining = false;
  let allAttentionPassed = true;

  const statusCounts = {
    excellent: 0,
    acceptable: 0,
    questionable: 0,
    compromised: 0,
  };

  for (const s of sessionsWithIntegrity) {
    totalSpeedViolations += s.speedViolations || 0;
    if (s.straightliningDetected) anyStraightlining = true;
    if (!s.attentionCheckPassed) allAttentionPassed = false;

    const flag = (s.overallFlag || 'ACCEPTABLE').toUpperCase();
    if (flag === 'EXCELLENT') statusCounts.excellent++;
    else if (flag === 'QUESTIONABLE') statusCounts.questionable++;
    else if (flag === 'COMPROMISED') statusCounts.compromised++;
    else statusCounts.acceptable++;
  }

  let overallFlag: 'EXCELLENT' | 'ACCEPTABLE' | 'QUESTIONABLE' | 'COMPROMISED' = 'ACCEPTABLE';
  if (statusCounts.compromised > 0) {
    overallFlag = 'COMPROMISED';
  } else if (statusCounts.questionable > 0) {
    overallFlag = 'QUESTIONABLE';
  } else if (statusCounts.excellent === sessionsWithIntegrity.length) {
    overallFlag = 'EXCELLENT';
  } else {
    overallFlag = 'ACCEPTABLE';
  }

  const isClean = overallFlag === 'EXCELLENT' || overallFlag === 'ACCEPTABLE';
  const totalAudited = sessionsWithIntegrity.length;
  const acceptableOrBetter = statusCounts.excellent + statusCounts.acceptable;

  let headlineTr = '';
  let explanationTr = '';

  if (overallFlag === 'EXCELLENT') {
    headlineTr = `${totalAudited} değerlendirmenin tümünde yanıt kalitesi yüksek`;
    explanationTr = 'Tüm değerlendirmelerde yanıtlama hızı, dikkat kontrolleri ve yanıt çeşitliliği yüksek güvenilirlikle karşılanmıştır.';
  } else if (overallFlag === 'ACCEPTABLE') {
    headlineTr = `${totalAudited} değerlendirmenin ${acceptableOrBetter}'sinde yanıt kalitesi yeterli`;
    explanationTr = 'Yanıtlama deseniniz tutarlı ve ölçüm kriterlerine uygundur; belirgin bir veri anomalisi saptanmamıştır.';
  } else if (overallFlag === 'QUESTIONABLE') {
    headlineTr = `${statusCounts.questionable} değerlendirmede dikkat/hız uyarısı saptandı`;
    explanationTr = 'Bazı maddelerde hızlı geçiş veya düz yanıtlama örüntüsü görüldü. Puanlar genel eğilimi yansıtmaktadır.';
  } else {
    headlineTr = 'Bazı değerlendirmelerde düşük yanıt kalitesi saptandı';
    explanationTr = 'Dikkat kontrolü veya yanıtlama süresi kriterlerinde uyumsuzluk tespit edilmiştir.';
  }

  return {
    overallFlag,
    isClean,
    totalAssessmentsAudited: totalAudited,
    statusCounts,
    speedViolationsCount: totalSpeedViolations,
    straightliningDetected: anyStraightlining,
    attentionChecksPassed: allAttentionPassed,
    headlineTr,
    explanationTr,
  };
}

/**
 * Builds the 4-dimensional honest quality breakdown without a single fake confidence percentage.
 * Distinguishes instrument diversity from multi-method diversity.
 */
export function deriveUnifiedQualityDimensions(params: {
  measuredDomainsCount: number;
  totalDomainsCount: number;
  exploredFacetsCount: number;
  totalFacetsCount: number;
  explorationPercentage: number;
  depthPercentage: number;
  responseQuality: UnifiedResponseQualitySummary;
  instrumentsUsed: string[];
}): UnifiedQualityDimensions {
  const {
    measuredDomainsCount,
    totalDomainsCount,
    exploredFacetsCount,
    totalFacetsCount,
    explorationPercentage,
    depthPercentage,
    responseQuality,
    instrumentsUsed,
  } = params;

  return {
    coverage: {
      measuredDomains: measuredDomainsCount,
      totalDomains: totalDomainsCount,
      exploredFacets: exploredFacetsCount,
      totalFacets: totalFacetsCount,
      explorationPercentage,
      depthPercentage,
      labelTr: `${measuredDomainsCount}/${totalDomainsCount} Alan (${exploredFacetsCount}/${totalFacetsCount} Alt Boyut)`,
    },
    responseQuality: {
      status: responseQuality.overallFlag,
      labelTr:
        responseQuality.overallFlag === 'EXCELLENT'
          ? 'Yüksek Kalite'
          : responseQuality.overallFlag === 'ACCEPTABLE'
          ? 'Kabul Edilebilir'
          : responseQuality.overallFlag === 'QUESTIONABLE'
          ? 'İncelenmesi Önerilir'
          : 'Düşük Güvenilirlik',
      detailTr: responseQuality.headlineTr,
    },
    methodDiversity: {
      instrumentCount: instrumentsUsed.length,
      instrumentsUsed,
      labelTr: `${instrumentsUsed.length} Değerlendirme Aracı (Ölçek Çeşitliliği)`,
      detailTr:
        instrumentsUsed.length > 1
          ? 'Farklı öz-bildirim envanterleri üzerinden çoklu ölçek ölçümü sağlanmıştır.'
          : instrumentsUsed.length === 1
          ? 'Tek bir değerlendirme envanteri tamamlanmıştır.'
          : 'Henüz tamamlanmış değerlendirme aracı bulunmuyor.',
    },
    calibrationStatus: {
      status: 'PRE_CALIBRATION',
      labelTr: 'Ön Kalibrasyon (Nüfus Normu Hariç)',
      disclaimerTr:
        'Temsili ulusal norm kalibrasyonu tamamlanana kadar yüzdelik dilimler (percentile) ve z/T puanları gizlenmiştir; betimsel nokta kestirimleri sunulur.',
    },
  };
}

/**
 * Helper to determine instrument-specific scale-relative response range state.
 * Uses explicit descriptive band policy registry; returns DESCRIPTIVE_BAND_UNAVAILABLE if unmapped.
 */
export function getDescriptiveResponseRangeState(
  score: number | null,
  scaleMin: number,
  scaleMax: number,
  strategyOrInstrumentCode?: string | null
): { state: HeatmapCellState; labelTr: string } {
  return resolveDescriptiveBand(score, scaleMin, scaleMax, strategyOrInstrumentCode);
}

/**
 * Centralized Server-Side Unified Psychological Profile Service.
 * Resolves the user's complete psychological profile by aggregating authoritative persisted measurements
 * across completed assessment sessions at read-time.
 */
export async function getUnifiedPsychologicalProfile(userId: string): Promise<UnifiedProfileViewModel> {
  // 1. Fetch user identity
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true },
  });

  const userName = user?.name || 'Kullanıcı';

  // 2. Fetch canonical ontology (Domains -> Constructs -> Facets) with validation summaries
  const canonicalDomains = await prisma.domain.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      constructs: {
        orderBy: { sortOrder: 'asc' },
        include: {
          facets: {
            orderBy: { sortOrder: 'asc' },
            include: {
              validationSummary: {
                include: {
                  studyEvidences: true,
                  reliabilityEvidences: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const canonicalFacetMap = new Map<
    string,
    (typeof canonicalDomains)[0]['constructs'][0]['facets'][0]
  >();
  for (const domain of canonicalDomains) {
    for (const construct of domain.constructs) {
      for (const facet of construct.facets) {
        canonicalFacetMap.set(facet.id, facet);
      }
    }
  }

  const totalOntologyFacets = canonicalDomains.reduce(
    (acc, d) => acc + d.constructs.reduce((cAcc, c) => cAcc + c.facets.length, 0),
    0
  ) || TOTAL_ONTOLOGY_FACETS_SOURCE_OF_TRUTH;

  // 3. Fetch all completed assessment sessions with linked snapshots & items
  const completedSessions = await prisma.assessmentSession.findMany({
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
                      instrument: true,
                    },
                  },
                },
              },
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
              facetScores: {
                include: {
                  facet: {
                    include: { construct: true },
                  },
                },
              },
              constructScores: {
                include: {
                  construct: true,
                },
              },
              domainScores: {
                include: {
                  domain: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { completedAt: 'desc' },
  });

  // Filter sessions that have a valid snapshot and module
  const validCompletedSessions = completedSessions.filter(
    (s) => s.snapshotSessions && s.snapshotSessions.length > 0 && s.snapshotSessions[0]?.profileSnapshot && s.formVersion?.module
  );

  const hasAssessments = validCompletedSessions.length > 0;

  // 4. Group valid sessions by module to identify latest per module and build historical provenance
  const sessionsByModule = new Map<string, typeof validCompletedSessions>();
  const sourceAssessments: SourceAssessmentProvenance[] = [];

  for (const session of validCompletedSessions) {
    const modId = session.formVersion?.module?.id || session.formVersion?.moduleId || 'unknown';
    if (!sessionsByModule.has(modId)) {
      sessionsByModule.set(modId, []);
    }
    sessionsByModule.get(modId)!.push(session);
  }

  // Identify latest valid session per module and populate provenance timeline
  const latestSessionPerModule = new Map<string, typeof validCompletedSessions[0]>();
  for (const [modId, moduleSessions] of sessionsByModule.entries()) {
    const latest = moduleSessions[0];
    latestSessionPerModule.set(modId, latest);
  }

  for (const session of validCompletedSessions) {
    const modId = session.formVersion?.module?.id || session.formVersion?.moduleId || 'unknown';
    const isLatestForModule = latestSessionPerModule.get(modId)?.id === session.id;
    const snapshot = session.snapshotSessions[0]?.profileSnapshot;
    if (!snapshot) continue;
    const integrity = session.integrityResults[0]?.overallFlag || 'ACCEPTABLE';

    sourceAssessments.push({
      sessionId: session.id,
      moduleId: modId,
      moduleCode: session.formVersion?.module?.code || 'MODULE',
      moduleTitleTr: session.formVersion?.module?.titleTr || 'Değerlendirme Modülü',
      formVersionCode: session.formVersion?.versionCode || 'v1.0.0',
      scoringModelCode: snapshot.scoringModelVersion?.code || 'PRE_CALIBRATION_MEAN_V1',
      completedAt: session.completedAt ? session.completedAt.toISOString() : (session.startedAt ? new Date(session.startedAt).toISOString() : new Date().toISOString()),
      resultUrl: `/assessments/results/${session.id}`,
      integrityFlag: integrity,
      isLatestForModule,
    });
  }

  // 5. Identify active sessions contributing to CURRENT profile
  const activeSessions = Array.from(latestSessionPerModule.values());
  activeSessions.sort((a, b) => {
    const timeA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
    const timeB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
    return timeB - timeA;
  });

  // Extract REAL distinct source instruments contributing to current measurements
  const distinctInstrumentsMap = new Map<string, { id: string; code: string; name: string }>();
  for (const session of activeSessions) {
    for (const formItem of session.formVersion?.items || []) {
      const inst = formItem.itemVersion?.item?.instrument;
      if (inst && !distinctInstrumentsMap.has(inst.id)) {
        distinctInstrumentsMap.set(inst.id, {
          id: inst.id,
          code: inst.code,
          name: inst.fullName || inst.name,
        });
      }
    }
    if ((session.formVersion?.items || []).length === 0 || distinctInstrumentsMap.size === 0) {
      const fallbackKey = session.formVersion?.module?.code || 'MOD';
      if (!distinctInstrumentsMap.has(fallbackKey)) {
        distinctInstrumentsMap.set(fallbackKey, {
          id: session.formVersion?.module?.id || fallbackKey,
          code: session.formVersion?.module?.code || fallbackKey,
          name: session.formVersion?.module?.titleTr || 'Değerlendirme',
        });
      }
    }
  }

  // 6. Multi-Assessment Read-Time Aggregation (Latest valid measurement per facet/construct)
  const latestFacetMap = new Map<
    string,
    {
      rawMean: number;
      itemCount: number;
      scale: MeasurementScaleMetadata;
      provenance: MeasurementProvenanceMetadata;
      instrumentName?: string | null;
      evidence: ResolvedFacetEvidence;
      sourceSessionIntegrity: 'EXCELLENT' | 'ACCEPTABLE' | 'QUESTIONABLE' | 'COMPROMISED';
    }
  >();

  const latestConstructMap = new Map<
    string,
    {
      compositeScore: number;
      facetCount: number;
      scale: MeasurementScaleMetadata;
      provenance: MeasurementProvenanceMetadata;
      instrumentName?: string | null;
      sourceSessionIntegrity: 'EXCELLENT' | 'ACCEPTABLE' | 'QUESTIONABLE' | 'COMPROMISED';
    }
  >();

  for (const session of activeSessions) {
    const snapshot = session.snapshotSessions[0]?.profileSnapshot;
    if (!snapshot) continue;

    const sessionIntegrity = (session.integrityResults[0]?.overallFlag || 'ACCEPTABLE').toUpperCase() as
      | 'EXCELLENT'
      | 'ACCEPTABLE'
      | 'QUESTIONABLE'
      | 'COMPROMISED';

    let scoringStrategy = HEXACO_PRECALIBRATION_STRATEGY;
    try {
      scoringStrategy = resolveScoringStrategy(
        snapshot.scoringModelVersion?.code,
        session.formVersion?.module?.code
      );
    } catch {
      scoringStrategy = HEXACO_PRECALIBRATION_STRATEGY;
    }

    const scaleMetadata: MeasurementScaleMetadata = {
      scaleMin: scoringStrategy.scaleMin || 1.0,
      scaleMax: scoringStrategy.scaleMax || 5.0,
      scoreType: scoringStrategy.scoreType || 'MEAN',
      scoringModelCode: snapshot.scoringModelVersion?.code || 'PRE_CALIBRATION_MEAN_V1',
    };

    const provenanceMetadata: MeasurementProvenanceMetadata = {
      sessionId: session.id,
      moduleCode: session.formVersion?.module?.code || 'MODULE',
      moduleTitleTr: session.formVersion?.module?.titleTr || 'Değerlendirme Modülü',
      formVersionCode: session.formVersion?.versionCode || 'v1.0.0',
      scoringModelCode: snapshot.scoringModelVersion?.code || 'PRE_CALIBRATION_MEAN_V1',
      measuredAt: session.completedAt ? session.completedAt.toISOString() : (session.startedAt ? new Date(session.startedAt).toISOString() : new Date().toISOString()),
    };

    // Extract Instrument directly from session item records (no substring guessing)
    let sessionInstrument: { id: string; code: string; name: string } | null = null;
    for (const formItem of session.formVersion?.items || []) {
      const inst = formItem.itemVersion?.item?.instrument;
      if (inst) {
        sessionInstrument = {
          id: inst.id,
          code: inst.code,
          name: inst.fullName || inst.name,
        };
        break;
      }
    }

    // Facets (resolve evidence strictly from authoritative FacetValidationSummary)
    for (const fs of snapshot.facetScores || []) {
      if (!latestFacetMap.has(fs.facetId)) {
        const canonicalFacet = canonicalFacetMap.get(fs.facetId);
        const resolvedEvidence = resolveFacetValidationEvidence({
          validationSummary: canonicalFacet?.validationSummary,
          sessionInstrumentId: sessionInstrument ? sessionInstrument.id : null,
          sessionInstrumentName: sessionInstrument ? sessionInstrument.name : null,
        });

        latestFacetMap.set(fs.facetId, {
          rawMean: fs.rawMean,
          itemCount: fs.itemCount,
          scale: scaleMetadata,
          provenance: provenanceMetadata,
          instrumentName: sessionInstrument ? sessionInstrument.name : null,
          evidence: resolvedEvidence,
          sourceSessionIntegrity: sessionIntegrity,
        });
      }
    }

    // Constructs
    for (const cs of snapshot.constructScores || []) {
      if (!latestConstructMap.has(cs.constructId)) {
        latestConstructMap.set(cs.constructId, {
          compositeScore: cs.compositeScore,
          facetCount: cs.facetCount,
          scale: scaleMetadata,
          provenance: provenanceMetadata,
          instrumentName: sessionInstrument ? sessionInstrument.name : null,
          sourceSessionIntegrity: sessionIntegrity,
        });
      }
    }
  }

  // 7. Response Quality Telemetry Summary from ACTIVE sessions contributing to the CURRENT profile
  const activeSessionsWithIntegrity = activeSessions.map((s) => {
    const ir = s.integrityResults[0];
    return {
      moduleTitleTr: s.formVersion.module.titleTr,
      overallFlag: ir?.overallFlag || 'ACCEPTABLE',
      speedViolations: ir?.speedViolations || 0,
      straightliningDetected: ir?.straightliningDetected || false,
      attentionCheckPassed: ir?.attentionCheckPassed ?? true,
    };
  });
  const responseQuality = deriveUnifiedResponseQuality(activeSessionsWithIntegrity);

  // 8. Build the Complete 84-Facet List, Dimension Confidences, and Heatmap Rows
  const allFacets84: UnifiedFacetViewModel[] = [];
  const domainViewModels: UnifiedDomainViewModel[] = [];
  const dimensionConfidenceList: DimensionConfidence[] = [];
  const heatmapRows: HeatmapRowViewModel[] = [];

  let totalMeasuredFacetsCount = 0;
  let totalMeasuredDomainsCount = 0;

  // Track map for interaction evaluator: constructCode -> { score, scaleMin, scaleMax, nameTr }
  const interactionConstructsMap: Record<
    string,
    { score: number; scaleMin: number; scaleMax: number; nameTr: string }
  > = {};

  for (const domain of canonicalDomains) {
    let domainMeasuredConstructsCount = 0;
    let domainMeasuredFacetsCount = 0;
    const constructViewModels: UnifiedConstructViewModel[] = [];

    for (const construct of domain.constructs) {
      let constructMeasuredFacetsCount = 0;
      const facetViewModels: UnifiedFacetViewModel[] = [];
      const heatmapCells: HeatmapCellViewModel[] = [];

      for (const facet of construct.facets) {
        const measured = latestFacetMap.get(facet.id);

        if (measured) {
          totalMeasuredFacetsCount++;
          domainMeasuredFacetsCount++;
          constructMeasuredFacetsCount++;

          const scaleRange = Math.max(0.1, measured.scale.scaleMax - measured.scale.scaleMin);
          const scorePercentage = Math.min(
            100,
            Math.max(0, Math.round(((measured.rawMean - measured.scale.scaleMin) / scaleRange) * 100))
          );
          const bandInfo = getScoreBand(measured.rawMean, measured.scale.scaleMax);
          const measurementSupport: 'High' | 'Moderate' | 'Developing' =
            measured.itemCount >= 6 ? 'High' : measured.itemCount >= 3 ? 'Moderate' : 'Developing';

          const responseRange = getDescriptiveResponseRangeState(
            measured.rawMean,
            measured.scale.scaleMin,
            measured.scale.scaleMax,
            measured.scale.scoringModelCode
          );

          // Dimension Confidence derivation with session-specific telemetry and authoritative validation evidence
          const confidenceObj = deriveDimensionConfidence({
            dimensionId: facet.id,
            dimensionCode: facet.code,
            dimensionNameTr: facet.nameTr,
            domainCode: domain.code,
            domainNameTr: domain.nameTr,
            itemCount: measured.itemCount,
            responseQuality: measured.sourceSessionIntegrity, // Session-specific!
            evidenceLevel: measured.evidence.evidenceLevel,
            overallTurkishEvidenceLevel: measured.evidence.overallTurkishEvidenceLevel,
            measurementAlignmentLevel: measured.evidence.measurementAlignmentLevel,
            appliesToLevel: measured.evidence.appliesToLevel,
            instrumentValidationEstablished: measured.evidence.instrumentValidationEstablished,
            instrumentMatch: measured.evidence.instrumentMatch,
            humanVerified: measured.evidence.humanVerified,
            hasTurkishEvidence: measured.evidence.hasTurkishEvidence,
            instrumentName: measured.instrumentName,
          });

          dimensionConfidenceList.push(confidenceObj);

          const facetVm: UnifiedFacetViewModel = {
            facetId: facet.id,
            code: facet.code,
            nameTr: facet.nameTr,
            nameEn: facet.nameEn,
            descriptionTr: facet.descriptionTr,
            constructId: construct.id,
            constructCode: construct.code,
            constructNameTr: construct.nameTr,
            domainId: domain.id,
            domainCode: domain.code,
            domainNameTr: domain.nameTr,
            isMeasured: true,
            rawMean: measured.rawMean,
            scorePercentage,
            scale: measured.scale,
            itemCount: measured.itemCount,
            bandInfo,
            provenance: measured.provenance,
            epistemicStatus: 'PROVISIONAL_POINT_ESTIMATE',
            precision: measurementSupport,
            measurementSupport,
            confidenceLevel: confidenceObj.level,
            responseRangeState: responseRange.state,
          };

          facetViewModels.push(facetVm);
          allFacets84.push(facetVm);

          heatmapCells.push({
            facetId: facet.id,
            facetCode: facet.code,
            facetNameTr: facet.nameTr,
            constructCode: construct.code,
            constructNameTr: construct.nameTr,
            domainCode: domain.code,
            domainNameTr: domain.nameTr,
            isMeasured: true,
            rawScore: measured.rawMean,
            scaleMin: measured.scale.scaleMin,
            scaleMax: measured.scale.scaleMax,
            normalizedVisualCoordinate: scorePercentage,
            cellState: responseRange.state,
            stateLabelTr: responseRange.labelTr,
            itemCount: measured.itemCount,
            measurementSupport,
            instrumentName: measured.instrumentName || measured.provenance.moduleTitleTr,
            formVersionCode: measured.provenance.formVersionCode,
            measuredAt: measured.provenance.measuredAt,
            epistemicStatus: 'PROVISIONAL_POINT_ESTIMATE',
          });
        } else {
          // Unmeasured facet
          const facetVm: UnifiedFacetViewModel = {
            facetId: facet.id,
            code: facet.code,
            nameTr: facet.nameTr,
            nameEn: facet.nameEn,
            descriptionTr: facet.descriptionTr,
            constructId: construct.id,
            constructCode: construct.code,
            constructNameTr: construct.nameTr,
            domainId: domain.id,
            domainCode: domain.code,
            domainNameTr: domain.nameTr,
            isMeasured: false,
            rawMean: null,
            scorePercentage: null,
            scale: null,
            itemCount: 0,
            bandInfo: null,
            provenance: null,
            epistemicStatus: 'UNTOUCHED',
            precision: 'Unmeasured',
            measurementSupport: 'Unmeasured',
            confidenceLevel: 'VERY_LOW',
            responseRangeState: 'UNMEASURED',
          };

          facetViewModels.push(facetVm);
          allFacets84.push(facetVm);

          heatmapCells.push({
            facetId: facet.id,
            facetCode: facet.code,
            facetNameTr: facet.nameTr,
            constructCode: construct.code,
            constructNameTr: construct.nameTr,
            domainCode: domain.code,
            domainNameTr: domain.nameTr,
            isMeasured: false,
            rawScore: null,
            scaleMin: null,
            scaleMax: null,
            normalizedVisualCoordinate: null,
            cellState: 'UNMEASURED',
            stateLabelTr: 'Ölçülmedi',
            itemCount: 0,
            measurementSupport: 'Unmeasured',
            instrumentName: null,
            formVersionCode: null,
            measuredAt: null,
            epistemicStatus: 'UNTOUCHED',
          });
        }
      }

      // Heatmap Row for construct
      heatmapRows.push({
        domainId: domain.id,
        domainCode: domain.code,
        domainNameTr: domain.nameTr,
        constructId: construct.id,
        constructCode: construct.code,
        constructNameTr: construct.nameTr,
        cells: heatmapCells,
      });

      // Construct View Model
      const measuredConstruct = latestConstructMap.get(construct.id);
      if (measuredConstruct) {
        domainMeasuredConstructsCount++;

        const scaleRange = Math.max(0.1, measuredConstruct.scale.scaleMax - measuredConstruct.scale.scaleMin);
        const scorePercentage = Math.min(
          100,
          Math.max(
            0,
            Math.round(((measuredConstruct.compositeScore - measuredConstruct.scale.scaleMin) / scaleRange) * 100)
          )
        );
        const bandInfo = getScoreBand(measuredConstruct.compositeScore, measuredConstruct.scale.scaleMax);
        const interpDef = ALL_TRAIT_INTERPRETATIONS[construct.code];

        const interpretation = interpDef
          ? {
              shortDescriptionTr: interpDef.shortDescriptionTr,
              textTr: interpDef.interpretationByBand[bandInfo.band],
              strengths: interpDef.strengths[bandInfo.band] || [],
              risks: interpDef.risks[bandInfo.band] || [],
            }
          : null;

        constructViewModels.push({
          constructId: construct.id,
          code: construct.code,
          nameTr: construct.nameTr,
          nameEn: construct.nameEn,
          descriptionTr: construct.descriptionTr,
          domainId: domain.id,
          domainCode: domain.code,
          domainNameTr: domain.nameTr,
          isMeasured: true,
          compositeScore: measuredConstruct.compositeScore,
          scorePercentage,
          scale: measuredConstruct.scale,
          bandInfo,
          interpretation,
          facetCount: construct.facets.length,
          measuredFacetCount: constructMeasuredFacetsCount,
          facets: facetViewModels,
          provenance: measuredConstruct.provenance,
        });

        interactionConstructsMap[construct.code] = {
          score: measuredConstruct.compositeScore,
          scaleMin: measuredConstruct.scale.scaleMin,
          scaleMax: measuredConstruct.scale.scaleMax,
          nameTr: construct.nameTr,
        };
      } else {
        // Unmeasured construct
        constructViewModels.push({
          constructId: construct.id,
          code: construct.code,
          nameTr: construct.nameTr,
          nameEn: construct.nameEn,
          descriptionTr: construct.descriptionTr,
          domainId: domain.id,
          domainCode: domain.code,
          domainNameTr: domain.nameTr,
          isMeasured: false,
          compositeScore: null,
          scorePercentage: null,
          scale: null,
          bandInfo: null,
          interpretation: null,
          facetCount: construct.facets.length,
          measuredFacetCount: 0,
          facets: facetViewModels,
          provenance: null,
        });
      }
    }

    // Determine Domain Status based strictly on canonical facet coverage
    const totalFacetsInDomain = domain.constructs.reduce((acc, c) => acc + c.facets.length, 0);
    const totalConstructsInDomain = domain.constructs.length;

    let domainStatus: 'MEASURED' | 'PARTIAL' | 'UNMEASURED' = 'UNMEASURED';
    if (totalFacetsInDomain > 0) {
      if (domainMeasuredFacetsCount === 0) {
        domainStatus = 'UNMEASURED';
      } else if (domainMeasuredFacetsCount === totalFacetsInDomain) {
        domainStatus = 'MEASURED';
        totalMeasuredDomainsCount++;
      } else {
        domainStatus = 'PARTIAL';
        totalMeasuredDomainsCount++;
      }
    }

    const coveragePercentage =
      totalFacetsInDomain > 0 ? Math.round((domainMeasuredFacetsCount / totalFacetsInDomain) * 100) : 0;

    let domainCompositeScore: number | null = null;
    let domainScale: MeasurementScaleMetadata | null = null;

    if (domain.code === 'core_personality' && domainStatus === 'MEASURED') {
      const measuredScores = constructViewModels
        .map((c) => c.compositeScore)
        .filter((s): s is number => typeof s === 'number');
      if (measuredScores.length === 6) {
        domainCompositeScore = Number((measuredScores.reduce((a, b) => a + b, 0) / 6).toFixed(2));
        domainScale = {
          scaleMin: 1.0,
          scaleMax: 5.0,
          scoreType: 'MEAN',
          scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
        };
      }
    }

    domainViewModels.push({
      domainId: domain.id,
      code: domain.code,
      nameTr: domain.nameTr,
      nameEn: domain.nameEn,
      descriptionTr: domain.descriptionTr,
      color: domain.color,
      sortOrder: domain.sortOrder,
      status: domainStatus,
      measuredConstructCount: domainMeasuredConstructsCount,
      totalConstructCount: totalConstructsInDomain,
      measuredFacetCount: domainMeasuredFacetsCount,
      totalFacetCount: totalFacetsInDomain,
      coveragePercentage,
      compositeScore: domainCompositeScore,
      scale: domainScale,
      constructs: constructViewModels,
    });
  }

  // 9. Calculate Exploration Coverage & Measurement Depth
  const facetItemCounts: Record<string, number> = {};
  for (const [fId, data] of latestFacetMap.entries()) {
    facetItemCounts[fId] = data.itemCount;
  }
  const coverageMetrics = calculateProfileCoverage(facetItemCounts, totalOntologyFacets, 6);

  // 10. 4-Dimensional Quality Breakdown
  const qualityDimensions = deriveUnifiedQualityDimensions({
    measuredDomainsCount: totalMeasuredDomainsCount,
    totalDomainsCount: canonicalDomains.length,
    exploredFacetsCount: totalMeasuredFacetsCount,
    totalFacetsCount: totalOntologyFacets,
    explorationPercentage: coverageMetrics.explorationPercentage,
    depthPercentage: coverageMetrics.measurementDepthPercentage,
    responseQuality,
    instrumentsUsed: Array.from(distinctInstrumentsMap.values()).map((i) => i.name),
  });

  // 11. Profile Maturity Stage
  const maturity = deriveProfileMaturity({
    completedAssessmentsCount: activeSessions.length,
    measuredDomainsCount: totalMeasuredDomainsCount,
    measuredFacetsCount: totalMeasuredFacetsCount,
    totalOntologyFacets,
  });

  // 12. Profile Confidence Map & Completeness Summary (FAZ 2.13)
  const confidenceMap = buildProfileConfidenceMap(dimensionConfidenceList);

  const standardUserDomains = canonicalDomains.filter((d) =>
    (STANDARD_USER_PROFILE_DOMAIN_CODES as readonly string[]).includes(d.code)
  );
  const measuredStandardUserDomains = domainViewModels.filter(
    (d) =>
      d.status !== 'UNMEASURED' &&
      (STANDARD_USER_PROFILE_DOMAIN_CODES as readonly string[]).includes(d.code)
  );

  const completenessSummary = deriveProfileCompleteness({
    measuredFacetsCount: totalMeasuredFacetsCount,
    totalOntologyFacets,
    measuredUserFacingDomains: measuredStandardUserDomains.length,
    totalUserFacingDomains: standardUserDomains.length,
    totalOntologyDomains: canonicalDomains.length,
    measuredOntologyDomains: totalMeasuredDomainsCount,
  });

  // 13. Trait Heatmap Matrix View Model (FAZ 2.13)
  const traitHeatmap: HeatmapMatrixViewModel = {
    rows: heatmapRows,
    totalCells: totalOntologyFacets,
    measuredCellsCount: totalMeasuredFacetsCount,
    unmeasuredCellsCount: totalOntologyFacets - totalMeasuredFacetsCount,
    legendDisclaimerTr: 'Bu renkler nüfus yüzdeliklerini değil, ilgili ölçekteki yanıt konumunu gösterir.',
  };

  // 14. Profile Fingerprint Visual Dimensions (V2)
  const fingerprintDimensions: ProfileFingerprintDimension[] = [];
  for (const domain of domainViewModels) {
    for (const construct of domain.constructs) {
      if (construct.isMeasured && construct.compositeScore !== null && construct.scale) {
        const scaleRange = Math.max(0.1, construct.scale.scaleMax - construct.scale.scaleMin);
        const normalizedCoordinate = Math.min(
          100,
          Math.max(
            0,
            Math.round(((construct.compositeScore - construct.scale.scaleMin) / scaleRange) * 100)
          )
        );

        const measurementSupport =
          construct.measuredFacetCount >= 4 ? 'High' : construct.measuredFacetCount >= 2 ? 'Moderate' : 'Developing';

        fingerprintDimensions.push({
          id: construct.constructId,
          code: construct.code,
          nameTr: construct.nameTr,
          domainNameTr: domain.nameTr,
          domainCode: domain.code,
          nativeScore: construct.compositeScore,
          scaleMin: construct.scale.scaleMin,
          scaleMax: construct.scale.scaleMax,
          normalizedCoordinate,
          isMeasured: true,
          bandInfo: construct.bandInfo,
          measurementSupport,
          instrumentName: construct.provenance?.moduleTitleTr,
          measuredAt: construct.provenance?.measuredAt,
        });
      } else if (construct.measuredFacetCount > 0) {
        for (const facet of construct.facets) {
          if (facet.isMeasured && facet.rawMean !== null && facet.scale) {
            const scaleRange = Math.max(0.1, facet.scale.scaleMax - facet.scale.scaleMin);
            const normalizedCoordinate = Math.min(
              100,
              Math.max(
                0,
                Math.round(((facet.rawMean - facet.scale.scaleMin) / scaleRange) * 100)
              )
            );

            fingerprintDimensions.push({
              id: facet.facetId,
              code: facet.code,
              nameTr: facet.nameTr,
              domainNameTr: domain.nameTr,
              domainCode: domain.code,
              nativeScore: facet.rawMean,
              scaleMin: facet.scale.scaleMin,
              scaleMax: facet.scale.scaleMax,
              normalizedCoordinate,
              isMeasured: true,
              bandInfo: facet.bandInfo,
              measurementSupport: facet.measurementSupport,
              instrumentName: facet.provenance?.moduleTitleTr,
              measuredAt: facet.provenance?.measuredAt,
            });
          }
        }
      }
    }
  }

  const fingerprint = {
    dimensions: fingerprintDimensions,
    measuredCount: fingerprintDimensions.length,
    totalCount: canonicalDomains.reduce((acc, d) => acc + d.constructs.length, 0),
    summaryText:
      fingerprintDimensions.length > 0
        ? `Profil parmak iziniz, şu ana kadar ölçülen ${fingerprintDimensions.length} psikolojik boyutun görsel özetidir.`
        : 'Henüz ölçülen bir boyut bulunmuyor.',
  };

  // 15. Specialized Modular Sections
  // A) HEXACO Profile Section
  const coreDomain = domainViewModels.find((d) => d.code === 'core_personality');
  let hexacoSection = null;

  if (coreDomain && coreDomain.measuredConstructCount > 0) {
    const radarData = coreDomain.constructs
      .filter((c) => c.isMeasured && c.compositeScore !== null && c.scale)
      .map((c) => {
        const scaleRange = Math.max(0.1, c.scale!.scaleMax - c.scale!.scaleMin);
        const score100 = Number(
          (((c.compositeScore! - c.scale!.scaleMin) / scaleRange) * 100).toFixed(1)
        );
        return {
          name: c.code,
          name_tr: c.nameTr,
          score: score100,
          scaleMin: 0,
          scaleMax: 100,
        };
      });

    hexacoSection = {
      isMeasured: true,
      radarData,
      constructs: coreDomain.constructs,
      measuredFacetCount: coreDomain.measuredFacetCount,
      totalFacetCount: coreDomain.totalFacetCount,
    };
  }

  // B) Self-System Section
  const selfDomain = domainViewModels.find((d) => d.code === 'self_system');
  let selfSystemSection = null;

  if (selfDomain && selfDomain.measuredConstructCount > 0) {
    const rsesConstruct = selfDomain.constructs.find(
      (c) => c.code === 'self_evaluation' || c.code === 'core_self_esteem'
    );
    const gseConstruct = selfDomain.constructs.find(
      (c) => c.code === 'agency_mastery' || c.code === 'generalized_self_efficacy'
    );

    const rsesData = rsesConstruct && rsesConstruct.isMeasured && rsesConstruct.compositeScore !== null
      ? {
          isMeasured: true,
          score: rsesConstruct.compositeScore,
          scaleMin: rsesConstruct.scale?.scaleMin || 1.0,
          scaleMax: rsesConstruct.scale?.scaleMax || 4.0,
          bandInfo: rsesConstruct.bandInfo,
          titleTr: 'Temel Benlik Saygısı (RSES)',
          measuredAt: rsesConstruct.provenance?.measuredAt || null,
          itemCount: rsesConstruct.facets.reduce((acc, f) => acc + f.itemCount, 0),
          provenance: rsesConstruct.provenance,
        }
      : null;

    const gseData = gseConstruct && gseConstruct.isMeasured && gseConstruct.compositeScore !== null
      ? {
          isMeasured: true,
          score: gseConstruct.compositeScore,
          scaleMin: gseConstruct.scale?.scaleMin || 1.0,
          scaleMax: gseConstruct.scale?.scaleMax || 4.0,
          bandInfo: gseConstruct.bandInfo,
          titleTr: 'Genel Öz-Yeterlik (GSE)',
          measuredAt: gseConstruct.provenance?.measuredAt || null,
          itemCount: gseConstruct.facets.reduce((acc, f) => acc + f.itemCount, 0),
          provenance: gseConstruct.provenance,
        }
      : null;

    if (rsesData || gseData) {
      selfSystemSection = {
        isMeasured: true,
        rses: rsesData,
        gse: gseData,
      };
    }
  }

  // 16. Strengths & Attention Points (Deterministic, with provenance and epistemic status)
  const strengths: Array<{ traitName: string; point: string; sourceConstruct: string; sourceInstrument?: string; epistemicStatus?: string }> = [];
  const attentionPoints: Array<{ traitName: string; point: string; sourceConstruct: string; sourceInstrument?: string; epistemicStatus?: string }> = [];
  const seenStrengthTexts = new Set<string>();
  const seenAttentionTexts = new Set<string>();

  for (const domain of domainViewModels) {
    for (const construct of domain.constructs) {
      if (construct.isMeasured && construct.interpretation) {
        for (const st of construct.interpretation.strengths) {
          if (!seenStrengthTexts.has(st) && strengths.length < 6) {
            seenStrengthTexts.add(st);
            strengths.push({
              traitName: construct.nameTr,
              point: st,
              sourceConstruct: construct.code,
              sourceInstrument: construct.provenance?.moduleTitleTr,
              epistemicStatus: 'EVIDENCE_SUPPORTED_INTERPRETATION',
            });
          }
        }

        for (const rk of construct.interpretation.risks) {
          if (!seenAttentionTexts.has(rk) && attentionPoints.length < 5) {
            seenAttentionTexts.add(rk);
            attentionPoints.push({
              traitName: construct.nameTr,
              point: rk,
              sourceConstruct: construct.code,
              sourceInstrument: construct.provenance?.moduleTitleTr,
              epistemicStatus: 'PROVISIONAL_PATTERN',
            });
          }
        }
      }
    }
  }

  // 17. Cross-Domain Interactions & Profile Tension Matrix (FAZ 2.13)
  const interactions = evaluateUnifiedInteractions(interactionConstructsMap);
  const tensionMatrix = evaluateProfileTensionMatrix(interactionConstructsMap);

  // 18. Master Visual Registry Status Categorization (FAZ 2.13)
  const measuredConstructCodes = Object.keys(interactionConstructsMap);
  const measuredFacetCodes = Array.from(latestFacetMap.keys());
  const hasAttachmentData = measuredFacetCodes.some((f) => f.includes('attachment') || f.includes('ecr'));
  const hasErqData = measuredFacetCodes.some((f) => f.includes('erq') || f.includes('reappraisal') || f.includes('suppression'));
  const hasRsesData = Boolean(selfSystemSection?.rses?.isMeasured);
  const hasGseData = Boolean(selfSystemSection?.gse?.isMeasured);

  const visualRegistry = getCategorizedVisualizations({
    measuredConstructCodes,
    measuredFacetCodes,
    hasAttachmentData,
    hasErqData,
    hasRsesData,
    hasGseData,
  });

  // 19. Unmeasured Domains Catalogue
  const DOMAIN_WHY_IT_MATTERS: Record<string, string> = {
    emotional_affective:
      'Duygusal dayanıklılık, stres toleransı ve duygulanım düzenleme stratejilerinizi haritalandırır.',
    regulatory_volitional:
      'Hedef odaklılık, dürtü kontrolü, azim ve yürütücü irade işlevlerinizi analiz eder.',
    motivational_value:
      'Yaşamdaki temel motivasyon kaynaklarınızı ve evrensel değer yönelimlerinizi keşfetmenizi sağlar.',
    relational_interpersonal:
      'Bağlanma stilleri, empati boyutları ve çatışma yönetimi dinamiklerinizi ortaya koyar.',
    cognitive_epistemic:
      'Biliş ihtiyacı, belirsizliğe tahammül ve problem çözme yaklaşımlarınızı değerlendirir.',
    existential_meaning:
      'Anlam arayışı, varoluşsal amaç algısı ve içsel bütünlük dinamiklerinizi inceler.',
    integrity_validity:
      'Sosyal beğenirlik, öz-aldatma ve cevap verme bütünlüğü telemetrisini tamamlar.',
    self_system:
      'Benlik saygısı, öz-yeterlilik ve öz-şefkat dinamiklerini haritalandırır.',
    core_personality:
      'Kişiliğin 6 temel faktörü üzerinden geniş davranışsal eğilimlerinizi tanımlar.',
  };

  const journey = await getUserAssessmentJourney(userId);

  const unmeasuredDomains = domainViewModels
    .filter((d) => d.status === 'UNMEASURED')
    .map((d) => {
      const matchingAssessment = journey.allAssessments.find(
        (a) =>
          a.domainName?.toLowerCase().includes(d.nameTr.toLowerCase()) ||
          a.moduleCode.toLowerCase().includes(d.code.toLowerCase())
      );

      return {
        domainId: d.domainId,
        code: d.code,
        nameTr: d.nameTr,
        descriptionTr: d.descriptionTr,
        whyItMattersTr:
          DOMAIN_WHY_IT_MATTERS[d.code] || 'Psikolojik profilinizi daha derinlemesine anlamanızı sağlar.',
        availableAssessmentTitleTr: matchingAssessment?.title,
        availableAssessmentUrl: matchingAssessment?.startOrResumeUrl,
        isAssessmentAvailable: Boolean(matchingAssessment),
      };
    });

  const latestCompletedDate = validCompletedSessions[0]?.completedAt || null;

  return {
    userId,
    userName,
    hasAssessments,
    maturity,
    lastUpdatedAt: latestCompletedDate ? latestCompletedDate.toISOString() : null,
    completedAssessmentCount: activeSessions.length,
    qualityDimensions,
    responseQuality,
    domains: domainViewModels,
    allFacets84,
    confidenceMap,
    completenessSummary,
    traitHeatmap,
    tensionMatrix,
    interactions,
    visualRegistry,
    fingerprint,
    hexacoSection,
    selfSystemSection,
    strengths,
    attentionPoints,
    unmeasuredDomains,
    sourceAssessments,
    nextAction: journey.nextAction
      ? {
          title: journey.nextAction.title,
          reason: journey.nextAction.reason,
          estimatedMinutes: journey.nextAction.estimatedMinutes,
          url: journey.nextAction.url,
          ctaText: journey.nextAction.ctaText,
          status: journey.nextAction.status,
        }
      : null,
    profileV2: await resolveUnifiedPsychologicalProfileV2(userId),
  };
}
