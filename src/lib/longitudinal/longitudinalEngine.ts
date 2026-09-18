/**
 * PsycheAI Longitudinal & Profile Change Tracking Engine (FAZ 2.20)
 *
 * Core Scientific & Psychometric Rules:
 * 1. NO LONGITUDINAL CLAIM WITHOUT REPEATED DATA.
 * 2. Pre-calibration state strictly prohibits claiming "statistically significant"
 *    or "clinically meaningful" change. Displays are labeled OBSERVED_SCORE_DIFFERENCE.
 * 3. RCI (Reliable Change Index) is strictly UNAVAILABLE in pre-calibration.
 * 4. Missing epochs are NEVER interpolated (no artificial lines or midpoint imputations).
 * 5. Partial reassessments update only the specific repeated facets; untouched facets
 *    retain their historical point without being falsely marked "remeasured".
 * 6. Response quality flags never alter scores; they trigger QUALITY_LIMITED
 *    / CHANGE_CONFIDENCE_REDUCED to ensure conservative interpretation.
 * 7. Value neutrality: Higher scores are NEVER framed as moral improvement or gamified progress.
 */

import {
  MASTER_DOMAINS,
  MASTER_CONSTRUCTS,
  MASTER_FACETS,
  MASTER_FACET_BY_ID,
  MASTER_CONSTRUCT_BY_ID,
  MASTER_DOMAIN_BY_ID,
  TOTAL_MASTER_DOMAINS_COUNT,
  TOTAL_MASTER_CONSTRUCTS_COUNT,
  TOTAL_MASTER_FACETS_COUNT,
  normalizeMasterFacetId,
} from '@/lib/profile/masterModelConstants';
import { CONSTRUCT_AGGREGATION_RULES } from '@/lib/profile/constructAggregationResolver';
import { ResponseQualityStatus, MeasurementStatus } from '@/types/unifiedProfileV2';
import {
  MeasurementEpoch,
  MeasurementEpochFacetScore,
  MeasurementEpochCoverage,
  FacetTrajectory,
  FacetTrajectoryPoint,
  ConstructTrajectory,
  ConstructTrajectoryPoint,
  DomainCoverageTimelineEntry,
  ResponseQualityTimelineEntry,
  ContextualObservation,
  StabilitySummary,
  ChangeSummary,
  LongitudinalReadiness,
  LongitudinalReadinessLevel,
  TrajectoryEligibility,
  ChangeClassification,
  ObservedDirection,
  StabilityClassification,
  LongitudinalConfidenceComponents,
  LongitudinalProfileV1,
  LongitudinalEvidenceBundleV1,
} from '@/types/longitudinal';
import {
  CANONICAL_VERSIONS,
  evaluateVersionCompatibility,
} from './versionCompatibility';

/**
 * Default operational grouping window for measurement epochs (14 days).
 * NOTE: This is an operational product grouping window, NOT an immutable psychometric truth.
 */
export const DEFAULT_EPOCH_GROUPING_WINDOW_DAYS = 14;

/**
 * Observed delta classification thresholds (provisional display bands only).
 * NOT statistically significant or clinically calibrated cutoffs.
 */
export const CHANGE_THRESHOLDS = {
  STABLE_MAX: 0.20,
  SMALL_MAX: 0.50,
  MODERATE_MAX: 0.80,
} as const;

export interface BuildLongitudinalProfileInput {
  userId: string;
  userName?: string;
  sessions: any[]; // Raw Prisma assessment sessions
  epochGroupingWindowDays?: number;
  userReportedContextEvents?: any[];
}

/**
 * Groups completed assessment sessions into discrete, coherent measurement epochs.
 */
export function groupSessionsIntoMeasurementEpochs(
  sessions: any[],
  groupingWindowDays: number = DEFAULT_EPOCH_GROUPING_WINDOW_DAYS
): MeasurementEpoch[] {
  // 1. Filter completed sessions with valid responses
  const validCompletedSessions = (sessions || [])
    .filter((s) => s.status === 'COMPLETED' && (s.responses?.length > 0 || s.snapshotSessions?.length > 0))
    .sort((a, b) => {
      const dateA = new Date(a.completedAt || a.startedAt).getTime();
      const dateB = new Date(b.completedAt || b.startedAt).getTime();
      return dateA - dateB; // chronological asc
    });

  if (validCompletedSessions.length === 0) {
    return [];
  }

  const windowMs = groupingWindowDays * 24 * 60 * 60 * 1000;
  const epochGroups: any[][] = [];
  let currentGroup: any[] = [];
  let groupStartMs = 0;

  for (const session of validCompletedSessions) {
    const sessionTime = new Date(session.completedAt || session.startedAt).getTime();

    if (currentGroup.length === 0) {
      currentGroup.push(session);
      groupStartMs = sessionTime;
    } else {
      if (sessionTime - groupStartMs <= windowMs) {
        currentGroup.push(session);
      } else {
        epochGroups.push(currentGroup);
        currentGroup = [session];
        groupStartMs = sessionTime;
      }
    }
  }

  if (currentGroup.length > 0) {
    epochGroups.push(currentGroup);
  }

  // 2. Transform session groups into formal MeasurementEpoch objects
  const epochs: MeasurementEpoch[] = [];

  for (let idx = 0; idx < epochGroups.length; idx++) {
    const group = epochGroups[idx];
    const epochIndex = idx + 1;
    const epochId = `epoch_${epochIndex}_${group[0].id.slice(0, 8)}`;

    const groupDates = group.map((s) => new Date(s.completedAt || s.startedAt).getTime());
    const startedAt = new Date(Math.min(...groupDates)).toISOString();
    const endedAt = new Date(Math.max(...groupDates)).toISOString();

    const completedModuleIds: string[] = [];
    const completedModuleCodes: string[] = [];
    const completedModuleTitlesTr: string[] = [];
    const sourceSessionIds: string[] = [];
    const profileSnapshotIds: string[] = [];

    let speedViolationsTotal = 0;
    let straightliningAny = false;
    let attentionCheckAllPassed = true;
    const qualityCounts: Record<string, number> = { EXCELLENT: 0, ACCEPTABLE: 0, QUESTIONABLE: 0, COMPROMISED: 0, NO_DATA: 0 };

    // Accumulate facet responses across sessions in this epoch
    interface EpochFacetAcc {
      sum: number;
      count: number;
      quality: ResponseQualityStatus;
    }
    const epochFacetAccMap = new Map<string, EpochFacetAcc>();

    for (const s of group) {
      sourceSessionIds.push(s.id);
      const modId = s.formVersion?.module?.id || s.formVersion?.moduleId;
      const modCode = s.formVersion?.module?.code || 'module';
      const modTitle = s.formVersion?.module?.titleTr || 'Değerlendirme Modülü';

      if (modId && !completedModuleIds.includes(modId)) completedModuleIds.push(modId);
      if (modCode && !completedModuleCodes.includes(modCode)) completedModuleCodes.push(modCode);
      if (modTitle && !completedModuleTitlesTr.includes(modTitle)) completedModuleTitlesTr.push(modTitle);

      for (const ss of s.snapshotSessions || []) {
        if (ss.profileSnapshot?.id && !profileSnapshotIds.includes(ss.profileSnapshot.id)) {
          profileSnapshotIds.push(ss.profileSnapshot.id);
        }
      }

      // Quality evaluation
      const ir = s.integrityResults?.[0];
      const qFlag = ((ir?.overallFlag || 'ACCEPTABLE').toUpperCase()) as ResponseQualityStatus;
      if (qualityCounts[qFlag] !== undefined) {
        qualityCounts[qFlag]++;
      }
      speedViolationsTotal += ir?.speedViolations || 0;
      if (ir?.straightliningDetected) straightliningAny = true;
      if (ir?.attentionCheckPassed === false) attentionCheckAllPassed = false;

      // Extract facet responses
      for (const resp of s.responses || []) {
        const rawFacetId = resp.item?.facet?.id || resp.item?.facetId;
        if (!rawFacetId) continue;
        const canonicalFacetId = normalizeMasterFacetId(rawFacetId);

        if (['attention_check', 'paired_consistency', 'infrequency_check'].includes(canonicalFacetId)) {
          continue;
        }

        if (!epochFacetAccMap.has(canonicalFacetId)) {
          epochFacetAccMap.set(canonicalFacetId, { sum: 0, count: 0, quality: qFlag });
        }
        const acc = epochFacetAccMap.get(canonicalFacetId)!;
        acc.sum += resp.scoredValue ?? resp.rawValue;
        acc.count += 1;
      }
    }

    // Determine overall epoch response quality
    let epochQuality: ResponseQualityStatus = 'ACCEPTABLE';
    if (qualityCounts.COMPROMISED > 0) epochQuality = 'COMPROMISED';
    else if (qualityCounts.QUESTIONABLE > 0) epochQuality = 'QUESTIONABLE';
    else if (qualityCounts.EXCELLENT > qualityCounts.ACCEPTABLE) epochQuality = 'EXCELLENT';

    // Build epoch facet scores list
    const epochFacetScores: MeasurementEpochFacetScore[] = [];
    for (const [fId, acc] of epochFacetAccMap.entries()) {
      const facetDef = MASTER_FACET_BY_ID.get(fId);
      if (!facetDef) continue;

      const rawMean = Number((acc.sum / acc.count).toFixed(2));
      const boundedScore = Math.max(1.0, Math.min(5.0, rawMean));

      epochFacetScores.push({
        facetId: fId,
        code: facetDef.code,
        nameTr: facetDef.nameTr,
        domainId: facetDef.domainId,
        constructId: facetDef.constructId,
        score: boundedScore,
        itemCount: acc.count,
        responseQualityStatus: acc.quality,
        measurementStatus: 'MEASURED_PRECALIBRATION',
        batteryVersion: CANONICAL_VERSIONS.BATTERY_CURRENT,
        scoringVersion: CANONICAL_VERSIONS.SCORING_CURRENT,
      });
    }

    // Measure epoch coverage
    const measuredFacetIds = new Set(epochFacetScores.map((f) => f.facetId));
    const measuredConstructIds = new Set(
      MASTER_CONSTRUCTS.filter((c) => c.facetIds.some((fId) => measuredFacetIds.has(fId))).map((c) => c.constructId)
    );
    const measuredDomainIds = new Set(
      MASTER_DOMAINS.filter((d) => d.facetIds.some((fId) => measuredFacetIds.has(fId))).map((d) => d.domainId)
    );

    const coverage: MeasurementEpochCoverage = {
      measuredFacetsCount: measuredFacetIds.size,
      totalFacetsCount: TOTAL_MASTER_FACETS_COUNT,
      measuredConstructsCount: measuredConstructIds.size,
      totalConstructsCount: TOTAL_MASTER_CONSTRUCTS_COUNT,
      measuredDomainsCount: measuredDomainIds.size,
      totalDomainsCount: TOTAL_MASTER_DOMAINS_COUNT,
      facetPercentage: Math.round((measuredFacetIds.size / TOTAL_MASTER_FACETS_COUNT) * 100),
    };

    epochs.push({
      epochId,
      epochIndex,
      startedAt,
      endedAt,
      completedModuleIds,
      completedModuleCodes,
      completedModuleTitlesTr,
      profileSnapshotIds,
      batteryVersion: CANONICAL_VERSIONS.BATTERY_CURRENT,
      measurementModelVersion: CANONICAL_VERSIONS.MODEL_CURRENT,
      scoringModelVersion: CANONICAL_VERSIONS.SCORING_CURRENT,
      facetScores: epochFacetScores,
      coverage,
      responseQuality: epochQuality,
      sourceSessionIds,
      isComplete: true,
      notes: `Dönem ${epochIndex}: ${completedModuleTitlesTr.join(', ')}`,
    });
  }

  return epochs;
}

/**
 * Classifies an observed score difference neutrally without moral value judgments.
 */
export function classifyObservedShift(
  rawDelta: number,
  hasQualityLimitation: boolean = false,
  isVersionIncompatible: boolean = false
): { classification: ChangeClassification; direction: ObservedDirection; descriptionTr: string } {
  if (isVersionIncompatible) {
    return {
      classification: 'VERSION_INCOMPATIBLE',
      direction: 'INDETERMINATE',
      descriptionTr: 'Farklı batarya/puanlama sürümleri nedeniyle doğrudan fark hesaplanamaz.',
    };
  }

  const absDelta = Math.abs(rawDelta);
  const formattedDelta = absDelta.toFixed(1);

  if (absDelta < CHANGE_THRESHOLDS.STABLE_MAX) {
    return {
      classification: 'STABLE_RANGE',
      direction: 'STABLE',
      descriptionTr: 'Puan seviyesi önceki ölçümle benzer aralıkta (stabil) seyretmektedir (fark < 0.20).',
    };
  }

  const dir: ObservedDirection = rawDelta > 0 ? 'INCREASED' : 'DECREASED';
  const dirText = rawDelta > 0 ? 'artış' : 'azalış';

  if (hasQualityLimitation) {
    return {
      classification: 'QUALITY_LIMITED',
      direction: dir,
      descriptionTr: `Önceki ölçüme göre ${formattedDelta} puanlık gözlenen bir ${dirText} bulunmaktadır; yanıt kalitesi uyarısı nedeniyle yorumlama temkinli yapılmalıdır.`,
    };
  }

  if (absDelta < CHANGE_THRESHOLDS.SMALL_MAX) {
    return {
      classification: 'SMALL_OBSERVED_SHIFT',
      direction: dir,
      descriptionTr: `Önceki ölçüme göre ${formattedDelta} puanlık hafif düzeyde gözlenen bir ${dirText} mevcuttur.`,
    };
  }

  if (absDelta < CHANGE_THRESHOLDS.MODERATE_MAX) {
    return {
      classification: 'MODERATE_OBSERVED_SHIFT',
      direction: dir,
      descriptionTr: `Önceki ölçüme göre ${formattedDelta} puanlık belirgin düzeyde gözlenen bir ${dirText} mevcuttur.`,
    };
  }

  return {
    classification: 'LARGE_OBSERVED_SHIFT',
    direction: dir,
    descriptionTr: `Önceki ölçüme göre ${formattedDelta} puanlık yüksek düzeyde gözlenen bir ${dirText} mevcuttur.`,
  };
}

/**
 * Computes descriptive stability classification for series with 3+ epochs.
 * Strictly avoids inferring trait immutability.
 */
export function evaluateDescriptiveStability(scores: number[]): StabilityClassification {
  if (scores.length < 3) {
    return 'INSUFFICIENT_DATA';
  }

  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const range = Number((max - min).toFixed(4));
  const mean = scores.reduce((sum, s) => sum + s, 0) / scores.length;

  if (range <= 0.4001) {
    if (mean >= 3.799) return 'CONSISTENTLY_HIGH';
    if (mean <= 2.201) return 'CONSISTENTLY_LOW';
    return 'CONSISTENTLY_MID';
  }

  return 'VARIABLE';
}

/**
 * Builds deterministic FacetTrajectory objects for all 91 master facets.
 */
export function buildFacetTrajectories(
  epochs: MeasurementEpoch[],
  currentProfileFacetMap?: Map<string, number>
): FacetTrajectory[] {
  const trajectories: FacetTrajectory[] = [];

  for (const facetDef of MASTER_FACETS) {
    const fId = facetDef.facetId;

    // Collect measurement points across all epochs where this facet was administered
    const points: FacetTrajectoryPoint[] = [];

    for (const epoch of epochs) {
      const match = epoch.facetScores.find((fs) => fs.facetId === fId);
      if (match) {
        points.push({
          epochId: epoch.epochId,
          epochIndex: epoch.epochIndex,
          measuredAt: epoch.endedAt,
          score: match.score,
          itemCount: match.itemCount,
          responseQualityStatus: match.responseQualityStatus,
          measurementStatus: match.measurementStatus,
          batteryVersion: match.batteryVersion,
          scoringVersion: match.scoringVersion,
        });
      }
    }

    const repeatCount = points.length;
    const isRepeatMeasured = repeatCount >= 2;

    if (repeatCount === 0) {
      // Never measured
      trajectories.push({
        facetId: fId,
        code: facetDef.code,
        nameTr: facetDef.nameTr,
        nameEn: facetDef.nameEn,
        domainId: facetDef.domainId,
        constructId: facetDef.constructId,
        points: [],
        firstScore: null,
        latestScore: null,
        absoluteChange: null,
        rawDelta: null,
        direction: 'INDETERMINATE',
        classification: 'NO_REPEAT_DATA',
        stability: 'INSUFFICIENT_DATA',
        isRepeatMeasured: false,
        repeatCount: 0,
        qualityLimited: false,
        versionIncompatible: false,
        neutralChangeDescriptionTr: 'Bu alt boyut için henüz ölçüm verisi bulunmamaktadır.',
        confidenceComponents: {
          repeatCount: 0,
          responseQuality: 'NO_DATA',
          versionCompatibility: 'COMPATIBLE',
          measurementCompleteness: 'PARTIAL',
          timeSpanDays: 0,
        },
      });
      continue;
    }

    if (repeatCount === 1) {
      // Single cross-sectional measurement (no repeat)
      const singlePoint = points[0];
      trajectories.push({
        facetId: fId,
        code: facetDef.code,
        nameTr: facetDef.nameTr,
        nameEn: facetDef.nameEn,
        domainId: facetDef.domainId,
        constructId: facetDef.constructId,
        points,
        firstScore: singlePoint.score,
        latestScore: singlePoint.score,
        absoluteChange: null,
        rawDelta: null,
        direction: 'INDETERMINATE',
        classification: 'NO_REPEAT_DATA',
        stability: 'INSUFFICIENT_DATA',
        isRepeatMeasured: false,
        repeatCount: 1,
        qualityLimited: false,
        versionIncompatible: false,
        neutralChangeDescriptionTr: 'Tekil kesitsel ölçüm mevcuttur; zaman içindeki değişim veya kararlılık analizi için en az 2 ölçüm dönemi gereklidir.',
        confidenceComponents: {
          repeatCount: 1,
          responseQuality: singlePoint.responseQualityStatus,
          versionCompatibility: 'COMPATIBLE',
          measurementCompleteness: 'COMPLETE',
          timeSpanDays: 0,
        },
      });
      continue;
    }

    // 2+ epochs: Compute observed delta
    const firstPoint = points[0];
    const latestPoint = points[points.length - 1];
    const previousPoint = points[points.length - 2];

    const rawDelta = Number((latestPoint.score - previousPoint.score).toFixed(2));
    const absoluteChange = Number(Math.abs(rawDelta).toFixed(2));

    // Response quality check
    const hasQualityLimitation =
      firstPoint.responseQualityStatus === 'QUESTIONABLE' ||
      firstPoint.responseQualityStatus === 'COMPROMISED' ||
      latestPoint.responseQualityStatus === 'QUESTIONABLE' ||
      latestPoint.responseQualityStatus === 'COMPROMISED' ||
      previousPoint.responseQualityStatus === 'QUESTIONABLE' ||
      previousPoint.responseQualityStatus === 'COMPROMISED';

    const { classification, direction, descriptionTr } = classifyObservedShift(
      rawDelta,
      hasQualityLimitation
    );

    // Stability for 3+ points
    const allScores = points.map((p) => p.score);
    const stability = evaluateDescriptiveStability(allScores);

    // TimeSpan in days
    const firstTime = new Date(firstPoint.measuredAt).getTime();
    const latestTime = new Date(latestPoint.measuredAt).getTime();
    const timeSpanDays = Math.max(0, Math.round((latestTime - firstTime) / (1000 * 60 * 60 * 24)));

    trajectories.push({
      facetId: fId,
      code: facetDef.code,
      nameTr: facetDef.nameTr,
      nameEn: facetDef.nameEn,
      domainId: facetDef.domainId,
      constructId: facetDef.constructId,
      points,
      firstScore: firstPoint.score,
      latestScore: latestPoint.score,
      absoluteChange,
      rawDelta,
      direction,
      classification,
      stability,
      isRepeatMeasured: true,
      repeatCount,
      qualityLimited: hasQualityLimitation,
      versionIncompatible: false,
      neutralChangeDescriptionTr: descriptionTr,
      confidenceComponents: {
        repeatCount,
        responseQuality: latestPoint.responseQualityStatus,
        versionCompatibility: 'COMPATIBLE',
        measurementCompleteness: 'COMPLETE',
        timeSpanDays,
      },
    });
  }

  return trajectories;
}

/**
 * Builds deterministic ConstructTrajectory objects for all 37 master constructs.
 */
export function buildConstructTrajectories(
  epochs: MeasurementEpoch[],
  facetTrajectories: FacetTrajectory[]
): ConstructTrajectory[] {
  const facetTrajectoryMap = new Map(facetTrajectories.map((ft) => [ft.facetId, ft]));
  const constructTrajectories: ConstructTrajectory[] = [];

  for (const constructDef of MASTER_CONSTRUCTS) {
    const constituentFacetTrajs = constructDef.facetIds
      .map((fId) => facetTrajectoryMap.get(fId))
      .filter((ft): ft is FacetTrajectory => ft !== undefined);

    const allowsNumericTrend = constructDef.allowsDirectAggregation;
    const points: ConstructTrajectoryPoint[] = [];

    if (allowsNumericTrend) {
      for (const epoch of epochs) {
        const matchingFacetScores = epoch.facetScores.filter((fs) =>
          constructDef.facetIds.includes(fs.facetId)
        );

        if (matchingFacetScores.length >= constructDef.facetIds.length) {
          const mean = Number(
            (
              matchingFacetScores.reduce((sum, fs) => sum + fs.score, 0) /
              matchingFacetScores.length
            ).toFixed(2)
          );

          points.push({
            epochId: epoch.epochId,
            epochIndex: epoch.epochIndex,
            measuredAt: epoch.endedAt,
            compositeScore: mean,
            measuredFacetCount: matchingFacetScores.length,
            totalFacetCount: constructDef.facetIds.length,
          });
        }
      }
    }

    let patternEvolution = '';
    const repeatCount = constituentFacetTrajs.filter((ft) => ft.isRepeatMeasured).length;
    if (repeatCount > 0) {
      const stableCount = constituentFacetTrajs.filter((ft) => ft.classification === 'STABLE_RANGE').length;
      const shiftedCount = constituentFacetTrajs.filter(
        (ft) =>
          ft.classification === 'SMALL_OBSERVED_SHIFT' ||
          ft.classification === 'MODERATE_OBSERVED_SHIFT' ||
          ft.classification === 'LARGE_OBSERVED_SHIFT'
      ).length;
      patternEvolution = `${constructDef.nameTr}: ${stableCount} alt boyut stabil, ${shiftedCount} alt boyutta gözlenen fark kaydedildi.`;
    } else {
      patternEvolution = `${constructDef.nameTr}: Henüz tekrarlı ölçüm tamamlanmamış.`;
    }

    constructTrajectories.push({
      constructId: constructDef.constructId,
      code: constructDef.code,
      nameTr: constructDef.nameTr,
      nameEn: constructDef.nameEn,
      domainId: constructDef.domainId,
      aggregationStatus: allowsNumericTrend ? 'DIRECT_CONSTRUCT_SCORE' : 'FACET_PATTERN_ONLY',
      allowsNumericTrend,
      points: allowsNumericTrend && points.length > 0 ? points : null,
      constituentFacetTrajectories: constituentFacetTrajs,
      patternEvolutionDescriptionTr: patternEvolution,
    });
  }

  return constructTrajectories;
}

/**
 * Builds the complete LongitudinalProfileV1 object deterministically.
 */
export function buildLongitudinalProfile(
  input: BuildLongitudinalProfileInput
): LongitudinalProfileV1 {
  const { userId, userName = 'Kullanıcı', sessions, epochGroupingWindowDays } = input;

  // 1. Separate native vs legacy sessions
  const nativeSessions = (sessions || []).filter((s) => {
    const code = s.formVersion?.versionCode || '';
    const mCode = s.formVersion?.module?.code || '';
    return (
      !code.includes('legacy') &&
      !code.includes('LEGACY') &&
      !mCode.includes('LEGACY') &&
      mCode !== 'LEGACY_FORM_HEXACO'
    );
  });

  // 2. Group native sessions into epochs
  const measurementEpochs = groupSessionsIntoMeasurementEpochs(
    nativeSessions,
    epochGroupingWindowDays || DEFAULT_EPOCH_GROUPING_WINDOW_DAYS
  );

  // 3. Build Facet Trajectories
  const facetTrajectories = buildFacetTrajectories(measurementEpochs);

  // 4. Build Construct Trajectories
  const constructTrajectories = buildConstructTrajectories(measurementEpochs, facetTrajectories);

  // 5. Coverage Timeline
  const domainCoverageTimeline: DomainCoverageTimelineEntry[] = measurementEpochs.map((e) => ({
    epochId: e.epochId,
    epochIndex: e.epochIndex,
    date: e.endedAt,
    measuredFacetsCount: e.coverage.measuredFacetsCount,
    totalFacetsCount: TOTAL_MASTER_FACETS_COUNT,
    measuredConstructsCount: e.coverage.measuredConstructsCount,
    totalConstructsCount: TOTAL_MASTER_CONSTRUCTS_COUNT,
    measuredDomainsCount: e.coverage.measuredDomainsCount,
    totalDomainsCount: TOTAL_MASTER_DOMAINS_COUNT,
    facetPercentage: e.coverage.facetPercentage,
  }));

  // 6. Response Quality Timeline
  const responseQualityTimeline: ResponseQualityTimelineEntry[] = measurementEpochs.map((e) => {
    const epochSessions = nativeSessions.filter((s) => e.sourceSessionIds.includes(s.id));
    const speedTotal = epochSessions.reduce((sum, s) => sum + (s.integrityResults?.[0]?.speedViolations || 0), 0);
    const straightlining = epochSessions.some((s) => s.integrityResults?.[0]?.straightliningDetected);
    const attentionPass = epochSessions.every((s) => s.integrityResults?.[0]?.attentionCheckPassed !== false);

    return {
      epochId: e.epochId,
      epochIndex: e.epochIndex,
      date: e.endedAt,
      overallFlag: e.responseQuality,
      speedViolations: speedTotal,
      straightliningDetected: straightlining,
      attentionChecksPassed: attentionPass,
    };
  });

  // 7. Contextual Observations (prepared structure for future multi-context batteries)
  const contextualObservations: ContextualObservation[] = [];

  // 8. Longitudinal Readiness Determination
  const epochsCount = measurementEpochs.length;
  const repeatedFacets = facetTrajectories.filter((ft) => ft.isRepeatMeasured);
  const repeatedFacetsCount = repeatedFacets.length;

  let readinessLevel: LongitudinalReadinessLevel = 'NO_REPEAT_DATA';
  let trajectoryEligibility: TrajectoryEligibility = 'NOT_ELIGIBLE';
  let statusLabelTr = 'Tekil Kesitsel Ölçüm (Tekrar Ölçüm Yok)';
  let explanationTr = 'Zaman içindeki kararlılık veya değişim eğilimlerinin belirlenebilmesi için değerlendirmelerin farklı zaman aralıklarında tekrarlanması gereklidir.';

  if (epochsCount >= 5 && repeatedFacetsCount > 0) {
    readinessLevel = 'LONGITUDINAL_SERIES';
    trajectoryEligibility = 'STABILITY_PATTERN_ELIGIBLE';
    statusLabelTr = `Boylamsal Zaman Serisi (${epochsCount} Ölçüm Dönemi)`;
    explanationTr = `${epochsCount} farklı ölçüm dönemi tamamlanmıştır; betimsel kararlılık örüntüleri ve zaman serisi eğilimleri incelenebilir.`;
  } else if (epochsCount >= 3 && repeatedFacetsCount > 0) {
    readinessLevel = 'THREE_PLUS_EPOCHS';
    trajectoryEligibility = 'TRAJECTORY_ELIGIBLE';
    statusLabelTr = `Zaman Serisi Analizine Uygun (${epochsCount} Ölçüm Dönemi)`;
    explanationTr = `${epochsCount} ölçüm dönemi tamamlanmıştır; 3 noktalı zamansal değişim yönü ve seyreltik örüntüler izlenebilir.`;
  } else if (epochsCount >= 2 && repeatedFacetsCount > 0) {
    readinessLevel = 'TWO_EPOCHS';
    trajectoryEligibility = 'PAIRWISE_CHANGE_ONLY';
    statusLabelTr = 'Tekrarlanan Ölçüm Mevcut (2 Dönem Arası Karşılaştırma)';
    explanationTr = '2 ölçüm dönemi tamamlanmıştır. Bilimsel ihtiyat gereği 2 nokta bir "trend" veya "eğilim" olarak adlandırılamaz; yalnızca iki zaman noktası arasındaki gözlenen puan farkı sunulur.';
  }

  const longitudinalReadiness: LongitudinalReadiness = {
    level: readinessLevel,
    hasRepeatMeasurements: repeatedFacetsCount > 0,
    measurementEpochsCount: epochsCount,
    repeatedFacetsCount,
    statusLabelTr,
    explanationTr,
    trajectoryEligibility,
  };

  // 9. Stability Summary
  const stableFacets = repeatedFacets
    .filter((ft) => ft.classification === 'STABLE_RANGE' || ft.stability !== 'VARIABLE')
    .map((ft) => ({
      facetId: ft.facetId,
      nameTr: ft.nameTr,
      domainId: ft.domainId,
      meanScore: ft.latestScore || 0,
      stability: ft.stability,
      epochsCount: ft.repeatCount,
      descriptionTr: `Zaman içinde benzer düzeyde kalan alan (${ft.repeatCount} ölçüm boyunca stabil aralıkta).`,
    }));

  const stabilitySummary: StabilitySummary = {
    stableFacetsCount: stableFacets.length,
    stableFacetIds: stableFacets.map((sf) => sf.facetId),
    stableFacets,
    summaryTr:
      stableFacets.length > 0
        ? `${stableFacets.length} alt boyutta ölçüm dönemleri boyunca benzer düzeyler (stabilite) gözlenmiştir.`
        : 'Henüz yeterli tekrarlı ölçüm tamamlanmamıştır.',
  };

  // 10. Change Summary
  const shiftedFacets = repeatedFacets
    .filter(
      (ft) =>
        ft.classification === 'SMALL_OBSERVED_SHIFT' ||
        ft.classification === 'MODERATE_OBSERVED_SHIFT' ||
        ft.classification === 'LARGE_OBSERVED_SHIFT' ||
        ft.classification === 'QUALITY_LIMITED'
    )
    .map((ft) => ({
      facetId: ft.facetId,
      nameTr: ft.nameTr,
      domainId: ft.domainId,
      previousScore: ft.points[ft.points.length - 2]?.score || ft.firstScore || 0,
      latestScore: ft.latestScore || 0,
      rawDelta: ft.rawDelta || 0,
      absoluteChange: ft.absoluteChange || 0,
      classification: ft.classification,
      direction: ft.direction,
      descriptionTr: ft.neutralChangeDescriptionTr,
      qualityLimited: ft.qualityLimited,
    }));

  const changeSummary: ChangeSummary = {
    shiftedFacetsCount: shiftedFacets.length,
    shiftedFacetIds: shiftedFacets.map((sf) => sf.facetId),
    shiftedFacets,
    summaryTr:
      shiftedFacets.length > 0
        ? `${shiftedFacets.length} alt boyutta önceki ölçüme göre gözlenen puan farklılıkları kaydedilmiştir.`
        : 'Tekrarlanan ölçümlerde belirgin bir puan farkı gözlenmemiştir.',
  };

  // 11. Evidence References
  const evidenceRefs = [
    ...measurementEpochs.map((e) => `epoch:${e.epochId}`),
    ...repeatedFacets.map((f) => `trajectory:${f.facetId}`),
  ];

  return {
    profileVersion: '1.0.0',
    userId,
    userName,
    generatedAt: new Date().toISOString(),
    measurementEpochs,
    facetTrajectories,
    constructTrajectories,
    domainCoverageTimeline,
    responseQualityTimeline,
    contextualObservations,
    stabilitySummary,
    changeSummary,
    longitudinalReadiness,
    evidenceRefs,
    governanceNoticeTr:
      'Ön kalibrasyon aşamasındaki test bataryalarında boylamsal değişimler istatistiksel veya klinik anlamlılık iddiası taşımaksızın betimsel gözlenen fark olarak raporlanır.',
  };
}

/**
 * Builds a privacy-preserving, pseudonymized LongitudinalEvidenceBundleV1 for AI interpretation.
 * Excludes user names, emails, IPs, and raw response strings.
 */
export function buildLongitudinalEvidenceBundleV1(
  longitudinalProfile: LongitudinalProfileV1
): LongitudinalEvidenceBundleV1 {
  const pseudonymizedUserId = `anon_${Buffer.from(longitudinalProfile.userId).toString('hex').slice(0, 12)}`;

  const epochs = longitudinalProfile.measurementEpochs.map((e) => ({
    epochId: e.epochId,
    epochIndex: e.epochIndex,
    date: e.endedAt,
    moduleCodes: e.completedModuleCodes,
    quality: e.responseQuality,
  }));

  const facetTrajectories = longitudinalProfile.facetTrajectories
    .filter((ft) => ft.isRepeatMeasured)
    .map((ft) => ({
      facetId: ft.facetId,
      nameTr: ft.nameTr,
      domainId: ft.domainId,
      pointsCount: ft.repeatCount,
      firstScore: ft.firstScore,
      latestScore: ft.latestScore,
      delta: ft.rawDelta,
      direction: ft.direction,
      classification: ft.classification,
      stability: ft.stability,
      qualityLimited: ft.qualityLimited,
      versionIncompatible: ft.versionIncompatible,
    }));

  const constructTrajectories = longitudinalProfile.constructTrajectories.map((ct) => ({
    constructId: ct.constructId,
    nameTr: ct.nameTr,
    allowsNumericTrend: ct.allowsNumericTrend,
    aggregationStatus: ct.aggregationStatus,
  }));

  const limitations = [
    'Ön kalibrasyon (PRE_CALIBRATION) aşamasında RCI (Reliable Change Index) ve istatistiksel anlamlılık hesaplanamaz.',
    'Puan değişimleri değer yargısı (iyileşme/kötüleşme) veya nedensel çıkarım yapılmaksızın betimsel olarak aktarılmalıdır.',
    'Eksik ölçüm dönemleri ara değerleme (enterpolasyon) yapılmadan ham haliyle sunulmuştur.',
  ];

  return {
    profileVersion: '1.0.0',
    pseudonymizedUserId,
    generatedAt: new Date().toISOString(),
    epochs,
    facetTrajectories,
    constructTrajectories,
    coverageTimeline: longitudinalProfile.domainCoverageTimeline,
    qualityTimeline: longitudinalProfile.responseQualityTimeline,
    contextualShifts: longitudinalProfile.contextualObservations,
    versionCompatibility: [
      {
        batteryVersion: CANONICAL_VERSIONS.BATTERY_CURRENT,
        scoringVersion: CANONICAL_VERSIONS.SCORING_CURRENT,
        compatible: true,
      },
    ],
    limitations,
    governanceNotice:
      'AI Yorumlama Katmanı: AI boylamsal puan farklarını veya trendlerini kendisi hesaplayamaz; yalnızca doğrulanmış deterministik kanıtları nötr ve temkinli bir dille yorumlayabilir.',
  };
}
