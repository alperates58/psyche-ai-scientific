/**
 * PsycheAI Longitudinal Profile & Change Tracking Data Contracts (FAZ 2.20)
 *
 * Core scientific invariants:
 * - NO LONGITUDINAL CLAIM WITHOUT REPEATED DATA.
 * - 1 epoch: NO_REPEAT_DATA (Cross-sectional point estimate only).
 * - 2 epochs: PAIRWISE_CHANGE_ONLY (Observed score difference; do NOT call 2 points a trend).
 * - 3+ epochs: TRAJECTORY_ELIGIBLE.
 * - 5+ epochs: STABILITY_PATTERN_ELIGIBLE (Descriptive stability only; do not infer trait immutability).
 * - All native items remain PRE_CALIBRATION (RCI = UNAVAILABLE, no statistical significance claims).
 * - Observed difference display bands (abs delta): <0.20 (STABLE_RANGE), 0.20-0.49 (SMALL_OBSERVED_SHIFT),
 *   0.50-0.79 (MODERATE_OBSERVED_SHIFT), >=0.80 (LARGE_OBSERVED_SHIFT).
 * - No interpolation of missing epochs.
 * - Response quality flags reduce interpretive confidence (QUALITY_LIMITED / CHANGE_CONFIDENCE_REDUCED)
 *   without altering psychometric scores.
 * - Legacy 17-item forms are VERSION_INCOMPATIBLE with Native Research Battery (no direct delta).
 * - AI has ZERO delta/scoring calculation role and operates strictly downstream on verified evidence.
 */

import { ResponseQualityStatus, MeasurementStatus } from './unifiedProfileV2';

export type LongitudinalReadinessLevel =
  | 'NO_REPEAT_DATA'
  | 'TWO_EPOCHS'
  | 'THREE_PLUS_EPOCHS'
  | 'LONGITUDINAL_SERIES';

export type TrajectoryEligibility =
  | 'NOT_ELIGIBLE'
  | 'PAIRWISE_CHANGE_ONLY'
  | 'TRAJECTORY_ELIGIBLE'
  | 'STABILITY_PATTERN_ELIGIBLE';

export type ChangeClassification =
  | 'NO_REPEAT_DATA'
  | 'STABLE_RANGE'
  | 'SMALL_OBSERVED_SHIFT'
  | 'MODERATE_OBSERVED_SHIFT'
  | 'LARGE_OBSERVED_SHIFT'
  | 'VARIABLE_PATTERN'
  | 'CONTEXTUAL_SHIFT'
  | 'VERSION_INCOMPATIBLE'
  | 'QUALITY_LIMITED';

export type ObservedDirection =
  | 'INCREASED'
  | 'DECREASED'
  | 'STABLE'
  | 'INDETERMINATE';

export type StabilityClassification =
  | 'CONSISTENTLY_HIGH'
  | 'CONSISTENTLY_MID'
  | 'CONSISTENTLY_LOW'
  | 'VARIABLE'
  | 'INSUFFICIENT_DATA';

export type ContextType =
  | 'GENERAL'
  | 'WORK'
  | 'RELATIONSHIPS'
  | 'STRESS'
  | 'DECISION_MAKING';

export interface MeasurementEpochFacetScore {
  facetId: string;
  code: string;
  nameTr: string;
  domainId: string;
  constructId: string;
  score: number; // Raw mean on 1.00-5.00 scale
  itemCount: number;
  responseQualityStatus: ResponseQualityStatus;
  measurementStatus: MeasurementStatus;
  batteryVersion: string;
  scoringVersion: string;
}

export interface MeasurementEpochCoverage {
  measuredFacetsCount: number; // out of 91
  totalFacetsCount: number; // 91
  measuredConstructsCount: number; // out of 37
  totalConstructsCount: number; // 37
  measuredDomainsCount: number; // out of 11
  totalDomainsCount: number; // 11
  facetPercentage: number;
}

export interface MeasurementEpoch {
  epochId: string;
  epochIndex: number; // 1-based chronological index
  startedAt: string;
  endedAt: string;
  completedModuleIds: string[];
  completedModuleCodes: string[];
  completedModuleTitlesTr: string[];
  profileSnapshotIds: string[];
  batteryVersion: string;
  measurementModelVersion: string;
  scoringModelVersion: string;
  facetScores: MeasurementEpochFacetScore[];
  coverage: MeasurementEpochCoverage;
  responseQuality: ResponseQualityStatus;
  sourceSessionIds: string[];
  isComplete: boolean;
  notes?: string;
}

export interface FacetTrajectoryPoint {
  epochId: string;
  epochIndex: number;
  measuredAt: string;
  score: number; // 1.00-5.00 native mean
  itemCount: number;
  responseQualityStatus: ResponseQualityStatus;
  measurementStatus: MeasurementStatus;
  batteryVersion: string;
  scoringVersion: string;
}

export interface LongitudinalConfidenceComponents {
  repeatCount: number;
  responseQuality: ResponseQualityStatus;
  versionCompatibility: 'COMPATIBLE' | 'INCOMPATIBLE' | 'PARTIALLY_MAPPED';
  measurementCompleteness: 'COMPLETE' | 'PARTIAL';
  timeSpanDays: number;
}

export interface FacetTrajectory {
  facetId: string;
  code: string;
  nameTr: string;
  nameEn: string;
  domainId: string;
  constructId: string;
  points: FacetTrajectoryPoint[];
  firstScore: number | null;
  latestScore: number | null;
  absoluteChange: number | null;
  rawDelta: number | null; // latestScore - firstScore (or latest - previous)
  direction: ObservedDirection;
  classification: ChangeClassification;
  stability: StabilityClassification;
  isRepeatMeasured: boolean;
  repeatCount: number;
  qualityLimited: boolean;
  versionIncompatible: boolean;
  neutralChangeDescriptionTr: string;
  confidenceComponents: LongitudinalConfidenceComponents;
}

export interface ConstructTrajectoryPoint {
  epochId: string;
  epochIndex: number;
  measuredAt: string;
  compositeScore: number | null; // Strictly null if construct aggregation is unauthorized
  measuredFacetCount: number;
  totalFacetCount: number;
}

export interface ConstructTrajectory {
  constructId: string;
  code: string;
  nameTr: string;
  nameEn: string;
  domainId: string;
  aggregationStatus: 'DIRECT_CONSTRUCT_SCORE' | 'FACET_PATTERN_ONLY' | 'PARTIAL_CONSTRUCT_PATTERN' | 'NOT_MEASURED';
  allowsNumericTrend: boolean;
  points: ConstructTrajectoryPoint[] | null;
  constituentFacetTrajectories: FacetTrajectory[];
  patternEvolutionDescriptionTr: string;
}

export interface DomainCoverageTimelineEntry {
  epochId: string;
  epochIndex: number;
  date: string;
  measuredFacetsCount: number;
  totalFacetsCount: number; // 91
  measuredConstructsCount: number;
  totalConstructsCount: number; // 37
  measuredDomainsCount: number;
  totalDomainsCount: number; // 11
  facetPercentage: number;
}

export interface ResponseQualityTimelineEntry {
  epochId: string;
  epochIndex: number;
  date: string;
  overallFlag: ResponseQualityStatus;
  speedViolations: number;
  straightliningDetected: boolean;
  attentionChecksPassed: boolean;
}

export interface ContextualObservation {
  contextType: ContextType;
  facetId: string;
  facetNameTr: string;
  generalScore: number | null;
  contextScore: number | null;
  delta: number | null;
  classification: 'CONTEXTUAL_SHIFT' | 'ALIGNED' | 'NO_DATA';
  noteTr: string;
}

export interface StableFacetSummaryItem {
  facetId: string;
  nameTr: string;
  domainId: string;
  meanScore: number;
  stability: StabilityClassification;
  epochsCount: number;
  descriptionTr: string;
}

export interface StabilitySummary {
  stableFacetsCount: number;
  stableFacetIds: string[];
  stableFacets: StableFacetSummaryItem[];
  summaryTr: string;
}

export interface ShiftedFacetSummaryItem {
  facetId: string;
  nameTr: string;
  domainId: string;
  previousScore: number;
  latestScore: number;
  rawDelta: number;
  absoluteChange: number;
  classification: ChangeClassification;
  direction: ObservedDirection;
  descriptionTr: string;
  qualityLimited: boolean;
}

export interface ChangeSummary {
  shiftedFacetsCount: number;
  shiftedFacetIds: string[];
  shiftedFacets: ShiftedFacetSummaryItem[];
  summaryTr: string;
}

export interface LongitudinalReadiness {
  level: LongitudinalReadinessLevel;
  hasRepeatMeasurements: boolean;
  measurementEpochsCount: number;
  repeatedFacetsCount: number;
  statusLabelTr: string;
  explanationTr: string;
  trajectoryEligibility: TrajectoryEligibility;
}

export interface LongitudinalProfileV1 {
  profileVersion: '1.0.0';
  userId: string;
  userName: string;
  generatedAt: string;
  measurementEpochs: MeasurementEpoch[];
  facetTrajectories: FacetTrajectory[];
  constructTrajectories: ConstructTrajectory[];
  domainCoverageTimeline: DomainCoverageTimelineEntry[];
  responseQualityTimeline: ResponseQualityTimelineEntry[];
  contextualObservations: ContextualObservation[];
  stabilitySummary: StabilitySummary;
  changeSummary: ChangeSummary;
  longitudinalReadiness: LongitudinalReadiness;
  evidenceRefs: string[];
  governanceNoticeTr: string;
}

export interface LongitudinalEvidenceBundleV1 {
  profileVersion: '1.0.0';
  pseudonymizedUserId: string;
  generatedAt: string;
  epochs: Array<{
    epochId: string;
    epochIndex: number;
    date: string;
    moduleCodes: string[];
    quality: ResponseQualityStatus;
  }>;
  facetTrajectories: Array<{
    facetId: string;
    nameTr: string;
    domainId: string;
    pointsCount: number;
    firstScore: number | null;
    latestScore: number | null;
    delta: number | null;
    direction: ObservedDirection;
    classification: ChangeClassification;
    stability: StabilityClassification;
    qualityLimited: boolean;
    versionIncompatible: boolean;
  }>;
  constructTrajectories: Array<{
    constructId: string;
    nameTr: string;
    allowsNumericTrend: boolean;
    aggregationStatus: string;
  }>;
  coverageTimeline: DomainCoverageTimelineEntry[];
  qualityTimeline: ResponseQualityTimelineEntry[];
  contextualShifts: ContextualObservation[];
  versionCompatibility: Array<{
    batteryVersion: string;
    scoringVersion: string;
    compatible: boolean;
  }>;
  limitations: string[];
  governanceNotice: string;
}

export interface ReassessmentRecommendation {
  moduleId: string;
  moduleCode: string;
  titleTr: string;
  targetDomainNameTr: string;
  estimatedMinutes: number;
  lastCompletedAt: string | null;
  completionsCount: number;
  daysSinceLastCompletion: number | null;
  recommendedIntervalDays: number;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW' | 'NEW_MODULE';
  reasonTr: string;
  ctaUrl: string;
}

export interface RepeatMeasurementComparisonItem {
  facetId: string;
  code: string;
  nameTr: string;
  domainId: string;
  previousScore: number;
  currentScore: number;
  observedDelta: number;
  direction: ObservedDirection;
  classification: ChangeClassification;
  qualityNoteTr: string;
  neutralDescriptionTr: string;
}

export interface ModuleRepeatComparison {
  moduleId: string;
  moduleCode: string;
  moduleTitleTr: string;
  previousSessionId: string;
  previousCompletedAt: string;
  previousQuality: ResponseQualityStatus;
  currentSessionId: string;
  currentCompletedAt: string;
  currentQuality: ResponseQualityStatus;
  comparisons: RepeatMeasurementComparisonItem[];
  overallSummaryTr: string;
  governanceDisclaimerTr: string;
}
