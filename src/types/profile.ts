import { EpistemicTier, EpistemicStatus } from './construct';
import { ValidationStatus } from './item';
import { TheoryCouncilInterpretation } from './theory';

export type NormStatus = 'unavailable' | 'provisional' | 'validated';

export interface SystemVersions {
  ontologyVersion: string;
  itemBankVersion: string;
  scoringModelVersion: string;
  normVersion?: string | null;
  theoryEngineVersion: string;
  aiPromptVersion: string;
}

export interface ProfileCoverage {
  overallPercentage: number;
  measuredFacetCount: number;
  totalFacetCount: number;
  domainCoverage: Record<string, number>;
}

export type MeasurementPrecisionLevel = 'low' | 'moderate' | 'high';
export type CalibrationStatus = 'uncalibrated' | 'pilot_weights' | 'cfa_standardized' | 'irt_calibrated';

export interface ConfidenceMetrics {
  measurementPrecision: MeasurementPrecisionLevel;
  numericConfidenceIndicator: number; // 0.0 to 1.0 composite indicator (NOT percentage truth)
  standardError: number;
  responseQualityFactor: number;
  itemCoverageRatio: number;
  temporalStability?: number | null;
  methodDiversityFactor: number;
  normAvailability: boolean;
  calibrationStatus: CalibrationStatus;
}

export interface FacetScore {
  domainId: string;
  constructId: string;
  facetId: string;
  rawScore: number;
  provisionalCompositeScore: number;
  latentTheta?: number | null;
  zScore?: number | null;
  tScore?: number | null;
  percentile?: number | null; // Strictly null unless normStatus is 'validated'
  standardError: number;
  confidenceInterval95: [number, number];
  observedItemCount: number;
  epistemicTier: EpistemicTier;
  validationStatus: ValidationStatus;
  confidenceMetrics: ConfidenceMetrics;
}

export interface SelfDiscrepancyMetric {
  actualIdealDistance: number;
  actualOughtDistance: number;
  interpretation_tr: string;
  epistemicStatus: EpistemicStatus;
}

export interface AttachmentSpaceMetric {
  anxietyDimension: number;
  avoidanceDimension: number;
  explanatoryQuadrant:
    | 'secure_region'
    | 'anxious_preoccupied_region'
    | 'dismissive_avoidant_region'
    | 'fearful_avoidant_region';
  epistemicStatus: EpistemicStatus;
}

export interface EmotionRegulationQuadrantsMetric {
  reappraisalLevel: number;
  suppressionLevel: number;
  quadrantDescription_tr: string;
}

export interface SchwartzValueRank {
  valueKey: string;
  relativePriorityRank: number;
  standardizedScore: number;
}

export interface DerivedMetrics {
  selfDiscrepancy: SelfDiscrepancyMetric;
  attachmentSpace: AttachmentSpaceMetric;
  emotionRegulationQuadrants: EmotionRegulationQuadrantsMetric;
  schwartzValueDistribution?: SchwartzValueRank[];
}

export interface IntrapersonalTension {
  id: string;
  facetA: string;
  facetB: string;
  tensionIntensity: number;
  evidenceCount: number;
  description_tr: string;
}

export interface Synergy {
  id: string;
  facetA: string;
  facetB: string;
  synergyStrength: number;
  description_tr: string;
}

export interface ContextModulation {
  facetId: string;
  contextScores: Record<string, number>;
  contextVariabilityIndex: number;
  summary_tr: string;
}

export interface RelationalDynamics {
  intrapersonalTensions: IntrapersonalTension[];
  synergies: Synergy[];
  contextModulations: ContextModulation[];
}

export type QualityGrade = 'strong' | 'acceptable' | 'review_suggested' | 'compromised';
export type RiskLevel = 'low' | 'moderate' | 'high';

export interface ResponseIntegrityReport {
  overallQualityGrade: QualityGrade;
  attentionChecksPassed: boolean;
  carelessResponseRisk: RiskLevel;
  longstringCount: number;
  rapidResponseItemCount: number;
  semanticInconsistencyScore: number;
  impressionManagementIndex: number;
  selfDeceptiveEnhancementIndex: number;
  extremeResponseBias: RiskLevel;
  acquiescenceBias: RiskLevel;
}

export interface AiNarrativeSummary {
  executiveSummary_tr: string;
  growthEdges_tr: string[];
  suggestedMicroAssessments: string[];
  verifiedClaimConstructIds: string[];
}

export interface ProfileOutput {
  profileId: string;
  userId: string;
  timestamp: string;
  systemVersions: SystemVersions;
  normStatus: NormStatus;
  profileCoverage: ProfileCoverage;
  facetScores: FacetScore[];
  derivedMetrics: DerivedMetrics;
  relationalDynamics: RelationalDynamics;
  responseIntegrity: ResponseIntegrityReport;
  theoryCouncil: TheoryCouncilInterpretation[];
  aiNarrative?: AiNarrativeSummary | null;
}
