/**
 * PsycheAI Master Psychological Profile Resolver V2
 *
 * The single authoritative resolver transforming completed assessment sessions
 * into the canonical Unified Psychological Profile V2.
 *
 * Core Principles:
 * - Authoritative Master Model: 11 Domains, 37 Constructs, 91 Facets.
 * - Hierarchy: ITEM -> FACET -> CONSTRUCT -> DOMAIN
 * - Facet scores are the primary measurement layer.
 * - Construct scores are allowed only where deterministic aggregation is scientifically defined.
 * - Domain scores are nullable (strictly null; no artificial collapsing into fake global means).
 * - Profile Coverage reflects actual measurement coverage, strictly separated from confidence.
 * - Confidence Map V2 separates independent epistemic dimensions without single fake percentages.
 * - Missing facets remain NOT_MEASURED (never midpoint imputed).
 * - All native items remain PRE_CALIBRATION.
 * - AI has ZERO psychometric scoring role.
 */

import { prisma } from '@/lib/prisma';
import {
  MASTER_DOMAINS,
  MASTER_CONSTRUCTS,
  MASTER_FACETS,
  MASTER_DOMAIN_BY_ID,
  MASTER_CONSTRUCT_BY_ID,
  MASTER_FACET_BY_ID,
  TOTAL_MASTER_DOMAINS_COUNT,
  TOTAL_MASTER_CONSTRUCTS_COUNT,
  TOTAL_MASTER_FACETS_COUNT,
  TOTAL_ADMINISTERED_ITEMS_COUNT,
  normalizeMasterFacetId,
} from './masterModelConstants';
import {
  resolveConstructAggregation,
  getScoreBandV2,
  toVisualNormalizedCoordinate,
} from './constructAggregationResolver';
import { calculateProfileCoverageV2 } from './profileCoverageResolver';
import {
  deriveFacetConfidenceComponents,
  buildConfidenceMapV2,
} from './profileConfidenceResolver';
import { generateDeterministicPatterns } from './profilePatternEngine';
import { generateDeterministicTensions } from './profileTensionEngine';
import { generateDeterministicSynergies } from './profileSynergyEngine';
import {
  UnifiedPsychologicalProfileV2,
  FacetProfileV2,
  ConstructProfileV2,
  DomainProfileV2,
  ResponseQualityV2,
  ResponseQualityStatus,
  NextBestAssessmentV2,
  RecentAssessmentProvenanceV2,
  SourceAssessmentModuleReference,
} from '@/types/unifiedProfileV2';
import { LEGACY_FORM_CODES, DEFAULT_ASSESSMENT_MODULE_PORTFOLIO } from '@/lib/assessmentJourneyConfig';

export interface ResolveProfileOptions {
  includeHistoricalSnapshots?: boolean;
  mockSessions?: any[];
}

/**
 * Resolves the user's canonical Unified Psychological Profile V2 deterministically.
 */
export async function resolveUnifiedPsychologicalProfileV2(
  userId: string,
  options?: ResolveProfileOptions
): Promise<UnifiedPsychologicalProfileV2> {
  // 1. Fetch user identity
  let user: { id: string; name: string; email: string | null } | null = null;
  if (options?.mockSessions) {
    user = { id: userId, name: 'Kullanıcı', email: null };
  } else {
    try {
      user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true },
      });
    } catch {
      // Graceful fallback if database connection is unavailable (e.g. offline testing)
      user = { id: userId, name: 'Kullanıcı', email: null };
    }
  }

  const userName = user?.name || 'Kullanıcı';

  // 2. Fetch completed assessment sessions
  let completedSessions: any[] = [];
  if (options?.mockSessions) {
    completedSessions = options.mockSessions;
  } else {
    try {
      completedSessions = await prisma.assessmentSession.findMany({
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
                          instrument: true,
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
        orderBy: { completedAt: 'desc' },
      });
    } catch {
      completedSessions = [];
    }
  }

  // 3. Separate Native Battery Sessions vs Legacy Form Sessions
  const nativeSessions: typeof completedSessions = [];
  const legacySessions: typeof completedSessions = [];

  for (const session of completedSessions) {
    const formCode = session.formVersion?.versionCode || '';
    const moduleCode = session.formVersion?.module?.code || '';
    const isLegacy =
      LEGACY_FORM_CODES.includes(formCode) ||
      LEGACY_FORM_CODES.includes(moduleCode) ||
      moduleCode === 'LEGACY_FORM_HEXACO';

    if (isLegacy) {
      legacySessions.push(session);
    } else {
      nativeSessions.push(session);
    }
  }

  // 4. Map and Aggregate Response Quality from Native Sessions
  let speedViolationsTotal = 0;
  let straightliningAny = false;
  let attentionPassedAll = true;
  let inconsistencyViolationsTotal = 0;
  const statusCounts = {
    excellent: 0,
    acceptable: 0,
    questionable: 0,
    compromised: 0,
  };

  const recentAssessments: RecentAssessmentProvenanceV2[] = [];

  for (const session of nativeSessions) {
    const ir = session.integrityResults?.[0];
    const flag = (ir?.overallFlag || 'ACCEPTABLE').toUpperCase() as ResponseQualityStatus;

    if (flag === 'EXCELLENT') statusCounts.excellent++;
    else if (flag === 'ACCEPTABLE') statusCounts.acceptable++;
    else if (flag === 'QUESTIONABLE') statusCounts.questionable++;
    else if (flag === 'COMPROMISED') statusCounts.compromised++;

    speedViolationsTotal += ir?.speedViolations || 0;
    if (ir?.straightliningDetected) straightliningAny = true;
    if (ir?.attentionCheckPassed === false) attentionPassedAll = false;
    inconsistencyViolationsTotal += ir?.inconsistencyViolations || 0;

    recentAssessments.push({
      sessionId: session.id,
      moduleId: session.formVersion?.module?.id || 'mod',
      moduleCode: session.formVersion?.module?.code || 'mod_native',
      moduleTitleTr: session.formVersion?.module?.titleTr || 'Değerlendirme Modülü',
      formVersionCode: session.formVersion?.versionCode || 'v1.0.0',
      completedAt: session.completedAt ? session.completedAt.toISOString() : new Date().toISOString(),
      integrityFlag: flag,
      resultUrl: `/assessments/results/${session.id}`,
    });
  }

  let overallQualityFlag: ResponseQualityStatus = 'NO_DATA';
  if (nativeSessions.length > 0) {
    if (statusCounts.compromised > 0) overallQualityFlag = 'COMPROMISED';
    else if (statusCounts.questionable > 0) overallQualityFlag = 'QUESTIONABLE';
    else if (statusCounts.excellent > statusCounts.acceptable) overallQualityFlag = 'EXCELLENT';
    else overallQualityFlag = 'ACCEPTABLE';
  }

  const responseQuality: ResponseQualityV2 = {
    overallFlag: overallQualityFlag,
    speedViolationsCount: speedViolationsTotal,
    straightliningDetected: straightliningAny,
    attentionChecksPassed: attentionPassedAll,
    inconsistencyViolationsCount: inconsistencyViolationsTotal,
    totalAssessmentsAudited: nativeSessions.length,
    statusCounts,
    cautiousInterpretationRequired: overallQualityFlag === 'QUESTIONABLE' || overallQualityFlag === 'COMPROMISED',
    cautionsTr:
      overallQualityFlag === 'QUESTIONABLE' || overallQualityFlag === 'COMPROMISED'
        ? [
            'Bazı değerlendirmelerde yanıt hızı veya dikkat kontrollerinde dikkat çekici sapmalar tespit edilmiştir.',
            'Profil yorumlamasında bu telemetri uyarıları göz önünde bulundurulmalıdır; skorlar değiştirilmemiştir.',
          ]
        : [],
    headlineTr:
      overallQualityFlag === 'EXCELLENT'
        ? 'Yüksek Kaliteli ve Tutarlı Yanıt Verisi'
        : overallQualityFlag === 'ACCEPTABLE'
        ? 'Kabul Edilebilir Yanıt Bütünlüğü'
        : overallQualityFlag === 'QUESTIONABLE'
        ? 'İnceleme Önerilen Yanıt Örüntüsü'
        : overallQualityFlag === 'COMPROMISED'
        ? 'Düşük Güvenilirlikli Yanıt Telemetrisi'
        : 'Henüz Değerlendirme Verisi Yok',
    explanationTr:
      nativeSessions.length > 0
        ? `${nativeSessions.length} değerlendirme oturumu boyunca toplanan telemetri ve dikkat kontrolü verileri analiz edilmiştir.`
        : 'Değerlendirmeler tamamlandıkça yanıt kalitesi ve veri bütünlüğü burada raporlanacaktır.',
  };

  // 5. Build Facet Measurement Map (Authoritative aggregation per facet using latest session per module)
  interface FacetAccumulator {
    rawScoresSum: number;
    answeredItemCount: number;
    sourceModules: Map<string, SourceAssessmentModuleReference>;
    latestMeasuredAt: string | null;
    sourceSessionIntegrity: ResponseQualityStatus;
    measurementCount: number;
  }

  const facetAccumulators = new Map<string, FacetAccumulator>();

  // Identify latest valid session per module for current profile resolution
  const latestSessionByModule = new Map<string, any>();
  const sortedNativeSessions = [...nativeSessions].sort((a, b) => {
    const timeA = new Date(a.completedAt || a.startedAt || 0).getTime();
    const timeB = new Date(b.completedAt || b.startedAt || 0).getTime();
    return timeB - timeA;
  });

  for (const session of sortedNativeSessions) {
    const modKey =
      session.formVersion?.module?.id ||
      session.formVersion?.module?.code ||
      session.formVersion?.moduleId ||
      session.id;
    if (!latestSessionByModule.has(modKey)) {
      latestSessionByModule.set(modKey, session);
    }
  }

  const activeNativeSessions = Array.from(latestSessionByModule.values());

  for (const session of activeNativeSessions) {
    const sessionDateStr = session.completedAt
      ? session.completedAt.toISOString()
      : (session.startedAt ? new Date(session.startedAt).toISOString() : new Date().toISOString());

    const sessionIntegrity = (session.integrityResults?.[0]?.overallFlag || 'ACCEPTABLE').toUpperCase() as ResponseQualityStatus;

    // Check responses directly from session
    for (const resp of session.responses || []) {
      // Exclude attention checks / response quality items from psychometric trait facet scoring
      const rawFacetId = resp.item?.facet?.id || resp.item?.facetId;
      if (!rawFacetId) continue;
      const canonicalFacetId = normalizeMasterFacetId(rawFacetId);
      if (['attention_check', 'paired_consistency', 'infrequency_check'].includes(canonicalFacetId)) {
        continue;
      }

      if (!facetAccumulators.has(canonicalFacetId)) {
        facetAccumulators.set(canonicalFacetId, {
          rawScoresSum: 0,
          answeredItemCount: 0,
          sourceModules: new Map(),
          latestMeasuredAt: null,
          sourceSessionIntegrity: sessionIntegrity,
          measurementCount: 0,
        });
      }

      const acc = facetAccumulators.get(canonicalFacetId)!;
      acc.rawScoresSum += resp.scoredValue ?? resp.rawValue;
      acc.answeredItemCount += 1;

      const modId = session.formVersion?.module?.id || 'mod';
      if (!acc.sourceModules.has(modId)) {
        acc.sourceModules.set(modId, {
          moduleId: modId,
          moduleCode: session.formVersion?.module?.code || 'module',
          moduleTitleTr: session.formVersion?.module?.titleTr || 'Değerlendirme',
          sessionId: session.id,
          measuredAt: sessionDateStr,
        });
        acc.measurementCount += 1;
      }

      if (!acc.latestMeasuredAt || new Date(sessionDateStr) > new Date(acc.latestMeasuredAt)) {
        acc.latestMeasuredAt = sessionDateStr;
        acc.sourceSessionIntegrity = sessionIntegrity;
      }
    }
  }

  // 6. Build Facet Profiles for all 91 Master Facets
  const facetProfilesMap = new Map<string, FacetProfileV2>();
  const measuredFacetScoresMap = new Map<string, number>();

  for (const facetDef of MASTER_FACETS) {
    const acc = facetAccumulators.get(facetDef.facetId);

    if (acc && acc.answeredItemCount > 0) {
      const rawMean = Number((acc.rawScoresSum / acc.answeredItemCount).toFixed(2));
      const score = Math.max(1.0, Math.min(5.0, rawMean));
      const normalizedVisualCoordinate = toVisualNormalizedCoordinate(score);
      const bandInfo = getScoreBandV2(score);
      const completionRatio = Math.min(1.0, Number((acc.answeredItemCount / facetDef.expectedItemCount).toFixed(2)));

      const confidenceComponents = deriveFacetConfidenceComponents({
        itemCountAnswered: acc.answeredItemCount,
        itemCountExpected: facetDef.expectedItemCount,
        responseQuality: acc.sourceSessionIntegrity,
        measurementCount: acc.measurementCount,
        distinctInstrumentsCount: acc.sourceModules.size,
      });

      const facetProfile: FacetProfileV2 = {
        facetId: facetDef.facetId,
        code: facetDef.code,
        nameTr: facetDef.nameTr,
        nameEn: facetDef.nameEn,
        domainId: facetDef.domainId,
        constructId: facetDef.constructId,
        measurementStatus: 'MEASURED_PRECALIBRATION',
        score,
        normalizedVisualCoordinate,
        itemCountExpected: facetDef.expectedItemCount,
        itemCountAnswered: acc.answeredItemCount,
        completionRatio,
        measurementEvidenceCount: acc.answeredItemCount,
        sourceAssessmentModules: Array.from(acc.sourceModules.values()),
        latestMeasuredAt: acc.latestMeasuredAt,
        responseQualityStatus: acc.sourceSessionIntegrity,
        epistemicStatus: 'PROVISIONAL_POINT_ESTIMATE',
        confidenceComponents,
        bandInfo,
        scientificDefinitionTr: facetDef.scientificDefinitionTr,
        inclusionCriteria: facetDef.inclusionCriteria,
        referenceInstruments: facetDef.referenceInstruments,
      };

      facetProfilesMap.set(facetDef.facetId, facetProfile);
      measuredFacetScoresMap.set(facetDef.facetId, score);
    } else {
      // NOT_MEASURED (never midpoint imputed)
      const confidenceComponents = deriveFacetConfidenceComponents({
        itemCountAnswered: 0,
        itemCountExpected: facetDef.expectedItemCount,
        responseQuality: 'NO_DATA',
      });

      const facetProfile: FacetProfileV2 = {
        facetId: facetDef.facetId,
        code: facetDef.code,
        nameTr: facetDef.nameTr,
        nameEn: facetDef.nameEn,
        domainId: facetDef.domainId,
        constructId: facetDef.constructId,
        measurementStatus: 'NOT_MEASURED',
        score: null,
        normalizedVisualCoordinate: null,
        itemCountExpected: facetDef.expectedItemCount,
        itemCountAnswered: 0,
        completionRatio: 0,
        measurementEvidenceCount: 0,
        sourceAssessmentModules: [],
        latestMeasuredAt: null,
        responseQualityStatus: 'NO_DATA',
        epistemicStatus: 'UNTOUCHED',
        confidenceComponents,
        bandInfo: null,
        scientificDefinitionTr: facetDef.scientificDefinitionTr,
        inclusionCriteria: facetDef.inclusionCriteria,
        referenceInstruments: facetDef.referenceInstruments,
      };

      facetProfilesMap.set(facetDef.facetId, facetProfile);
    }
  }

  // 7. Build Construct Profiles for all 37 Master Constructs
  const constructProfilesMap = new Map<string, ConstructProfileV2>();

  for (const constructDef of MASTER_CONSTRUCTS) {
    const constituentFacets = constructDef.facetIds
      .map((fId) => facetProfilesMap.get(fId))
      .filter((f): f is FacetProfileV2 => f !== undefined);

    const aggregation = resolveConstructAggregation(constructDef, constituentFacets);

    const constructProfile: ConstructProfileV2 = {
      constructId: constructDef.constructId,
      code: constructDef.code,
      nameTr: constructDef.nameTr,
      nameEn: constructDef.nameEn,
      domainId: constructDef.domainId,
      facetIds: constructDef.facetIds,
      measuredFacetCount: aggregation.measuredFacetCount,
      totalFacetCount: aggregation.totalFacetCount,
      coverageRatio: aggregation.coverageRatio,
      aggregationStatus: aggregation.aggregationStatus,
      constructScore: aggregation.constructScore,
      normalizedVisualCoordinate: aggregation.normalizedVisualCoordinate,
      bandInfo: aggregation.bandInfo,
      facets: constituentFacets,
    };

    constructProfilesMap.set(constructDef.constructId, constructProfile);
  }

  // 8. Build Domain Profiles for all 11 Master Domains
  const domainProfiles: DomainProfileV2[] = [];

  for (const domainDef of MASTER_DOMAINS) {
    const constituentConstructs = domainDef.constructIds
      .map((cId) => constructProfilesMap.get(cId))
      .filter((c): c is ConstructProfileV2 => c !== undefined);

    const measuredConstructCount = constituentConstructs.filter(
      (c) => c.measuredFacetCount > 0
    ).length;

    const allDomainFacets = domainDef.facetIds
      .map((fId) => facetProfilesMap.get(fId))
      .filter((f): f is FacetProfileV2 => f !== undefined);

    const measuredDomainFacets = allDomainFacets.filter(
      (f) => f.measurementStatus === 'MEASURED_PRECALIBRATION'
    );

    const totalFacetCount = allDomainFacets.length;
    const measuredFacetCount = measuredDomainFacets.length;
    const coverageRatio = totalFacetCount > 0 ? Number((measuredFacetCount / totalFacetCount).toFixed(3)) : 0;
    const coveragePercentage = Math.round(coverageRatio * 100);

    // Dominant patterns and under-measured areas
    const dominantMeasuredPatterns: string[] = [];
    const underMeasuredAreas: string[] = [];

    for (const c of constituentConstructs) {
      if (c.measuredFacetCount === c.totalFacetCount && c.constructScore !== null) {
        dominantMeasuredPatterns.push(`${c.nameTr}: ${c.bandInfo?.labelTr || 'Ölçüldü'}`);
      } else if (c.measuredFacetCount < c.totalFacetCount) {
        underMeasuredAreas.push(c.nameTr);
      }
    }

    domainProfiles.push({
      domainId: domainDef.domainId,
      code: domainDef.code,
      nameTr: domainDef.nameTr,
      nameEn: domainDef.nameEn,
      descriptionTr: domainDef.descriptionTr,
      color: domainDef.color,
      sortOrder: domainDef.sortOrder,
      constructCount: domainDef.constructIds.length,
      measuredConstructCount,
      facetCount: totalFacetCount,
      measuredFacetCount,
      coverageRatio,
      coveragePercentage,
      dominantMeasuredPatterns,
      underMeasuredAreas,
      domainScore: null, // Strictly null (no fake global domain totals)
      constructs: constituentConstructs,
    });
  }

  // 9. Complete Model Coverage Calculation
  const allFacetsList = Array.from(facetProfilesMap.values());
  const allConstructsList = Array.from(constructProfilesMap.values());
  const coverage = calculateProfileCoverageV2({
    domains: domainProfiles,
    constructs: allConstructsList,
    facets: allFacetsList,
  });

  // 10. Confidence Map V2
  const confidenceMap = buildConfidenceMapV2({
    measuredFacetsCount: coverage.facetCoverage.measuredCount,
    totalFacetsCount: TOTAL_MASTER_FACETS_COUNT,
    responseQuality,
    hasRepeatMeasurements: nativeSessions.length > 1,
    distinctInstrumentsCount: nativeSessions.length,
  });

  // 11. Deterministic Dynamics (Cross-Domain Patterns, Tensions, Synergies)
  const crossDomainPatterns = generateDeterministicPatterns(measuredFacetScoresMap);
  const tensions = generateDeterministicTensions(measuredFacetScoresMap);
  const synergies = generateDeterministicSynergies(measuredFacetScoresMap);

  // 12. Self-System Views (Actual Self only; Ideal & Social are unmeasured)
  const selfEsteemFacet = facetProfilesMap.get('core_self_esteem');
  const selfEfficacyFacet = facetProfilesMap.get('generalized_self_efficacy');
  const selfCompassionFacet = facetProfilesMap.get('self_compassion');
  const locusInternalFacet = facetProfilesMap.get('locus_of_control_internal');
  const clarityFacet = facetProfilesMap.get('self_concept_clarity');
  const authenticityFacet = facetProfilesMap.get('authenticity');

  const selfSystemViews = {
    actualSelf: {
      isMeasured: Boolean(
        selfEsteemFacet?.score ||
        selfEfficacyFacet?.score ||
        selfCompassionFacet?.score
      ),
      selfEsteemScore: selfEsteemFacet?.score || null,
      selfEfficacyScore: selfEfficacyFacet?.score || null,
      selfCompassionScore: selfCompassionFacet?.score || null,
      locusOfControlScore: locusInternalFacet?.score || null,
      clarityScore: clarityFacet?.score || null,
      authenticityScore: authenticityFacet?.score || null,
    },
    idealSelf: null, // Strictly unmeasured in current battery
    socialSelf: null, // Strictly unmeasured in current battery
    disclaimerTr:
      'Mevcut psikolojik envanterler yalnızca Gerçek Benlik (Actual Self) durumunuzu ölçmektedir; İdeal Benlik ve Sosyal Benlik yapay olarak kestirilmemiştir.',
  };

  // 13. Contextual Views (Prepared structures; strictly null without contextual data)
  const contextualViews = {
    work: null,
    relationships: null,
    stress: null,
    decisionMaking: null,
    disclaimerTr:
      'Gelecek modüllerde bağlamsal kişilik ölçümleri aktif hale getirilecektir; mevcut profil genel mizaç eğilimlerini yansıtır.',
  };

  // 14. Longitudinal Readiness
  const longitudinalReadiness = {
    hasRepeatMeasurements: nativeSessions.length > 1,
    measurementEpochsCount: nativeSessions.length,
    canComputeTrajectories: nativeSessions.length >= 3,
    statusLabelTr:
      nativeSessions.length >= 3
        ? 'Zaman Serisi Analizine Uygun (>=3 Ölçüm)'
        : nativeSessions.length > 1
        ? 'Tekrar Ölçüm Mevcut (Karşılaştırma Yapılabilir)'
        : 'İlk Kesitsel Ölçüm (Tekil Nokta Kestirimi)',
    explanationTr:
      nativeSessions.length > 1
        ? `${nativeSessions.length} değerlendirme kaydı mevcuttur; zaman içindeki değişim dinamikleri izlenebilir.`
        : 'Zaman içindeki kararlılık ve değişim analizi için birden fazla zaman noktasında ölçüm gereklidir.',
  };

  // 15. Legacy Compatibility (Isolated legacy 17-item form results)
  const legacyFacetScores: Record<string, number> = {};
  for (const session of legacySessions) {
    for (const resp of session.responses || []) {
      const fId = resp.item?.facet?.id || resp.item?.facetId;
      if (fId && !legacyFacetScores[fId]) {
        legacyFacetScores[fId] = resp.scoredValue ?? resp.rawValue;
      }
    }
  }

  const legacyCompatibility = {
    hasLegacy17ItemData: legacySessions.length > 0,
    legacySessionsCount: legacySessions.length,
    legacyFacetScores,
    isolationNoteTr:
      legacySessions.length > 0
        ? 'Eski 17 maddelik tarama verileri yeni bilimsel araştırma bataryası puanlarıyla harmanlanmamış, tarihsel uyumluluk katmanında izole edilmiştir.'
        : 'Eski form kaydı bulunmamaktadır.',
  };

  // 16. Next Best Assessment Recommendation (Deterministic, based on uncovered coverage)
  const completedModuleCodes = new Set<string>(
    nativeSessions.map((s) => s.formVersion?.module?.code || '').filter(Boolean)
  );

  let nextBestAssessment: NextBestAssessmentV2 | null = null;
  for (const portfolioItem of DEFAULT_ASSESSMENT_MODULE_PORTFOLIO) {
    if (!completedModuleCodes.has(portfolioItem.moduleCode)) {
      const targetDomain = MASTER_DOMAIN_BY_ID.get(portfolioItem.targetDomainCode);
      const domainNameTr = targetDomain?.nameTr || 'Gelişim Alanı';

      nextBestAssessment = {
        moduleCode: portfolioItem.moduleCode,
        titleTr: portfolioItem.titleTr,
        reasonTr: `Bu değerlendirme ile ${domainNameTr} alanındaki eksik boyutlarınızı tamamlayabilirsiniz.`,
        estimatedMinutes: portfolioItem.estimatedMinutes || 15,
        targetUncoveredFacetsCount: portfolioItem.targetConstructCodes.length * 4,
        targetDomainNameTr: domainNameTr,
        url: `/assessment?module=${portfolioItem.moduleCode}`,
        ctaText: 'Değerlendirmeye Başla',
      };
      break;
    }
  }

  const hasAssessments = nativeSessions.length > 0;
  const latestDate = nativeSessions[0]?.completedAt
    ? nativeSessions[0].completedAt.toISOString()
    : null;

  return {
    profileVersion: '2.0.0',
    generatedAt: latestDate || new Date().toISOString(),
    userId,
    userName,
    hasAssessments,
    measurementModelVersion: 'PSYCHEAI_MASTER_MODEL_V1',
    batteryVersion: 'NATIVE_RESEARCH_BATTERY_V1',
    coverage,
    domains: domainProfiles,
    constructs: allConstructsList,
    facets: allFacetsList,
    responseQuality,
    confidenceMap,
    crossDomainPatterns,
    tensions,
    synergies,
    selfSystemViews,
    contextualViews,
    evidenceSummary: {
      totalEvidences: coverage.facetCoverage.measuredCount + tensions.length + synergies.length + crossDomainPatterns.length,
      facetEvidencesCount: coverage.facetCoverage.measuredCount,
      constructEvidencesCount: allConstructsList.filter((c) => c.constructScore !== null).length,
      patternEvidencesCount: tensions.length + synergies.length + crossDomainPatterns.length,
    },
    longitudinalReadiness,
    legacyCompatibility,
    nextBestAssessment,
    recentAssessments,
  };
}
