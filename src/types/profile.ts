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

// ---------------------------------------------------------
// FAZ 2.11 UNIFIED PSYCHOLOGICAL PROFILE VIEW MODELS
// ---------------------------------------------------------

export type ProfileMaturityStage = 'BAŞLANGIÇ' | 'GELİŞEN' | 'GENİŞLEYEN' | 'KAPSAMLI';

export type UnifiedDomainStatus = 'MEASURED' | 'PARTIAL' | 'UNMEASURED';

export interface ScoreBandDetails {
  band: 'LOW' | 'BALANCED' | 'HIGH';
  labelTr: string;
  shortLabelTr: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

export interface MeasurementScaleMetadata {
  scaleMin: number;
  scaleMax: number;
  scoreType: 'MEAN' | 'SUM';
  scoringModelCode: string;
}

export interface MeasurementProvenanceMetadata {
  sessionId: string;
  moduleCode: string;
  moduleTitleTr: string;
  formVersionCode: string;
  scoringModelCode: string;
  measuredAt: string;
}

export interface UnifiedFacetViewModel {
  facetId: string;
  code: string;
  nameTr: string;
  nameEn: string;
  descriptionTr: string;
  constructId: string;
  constructCode: string;
  constructNameTr: string;
  domainId: string;
  domainCode: string;
  domainNameTr: string;
  isMeasured: boolean;
  rawMean: number | null; // Native score on instrument scale
  scorePercentage: number | null; // Normalized 0-100 visual coordinate (visual rendering only)
  scale: MeasurementScaleMetadata | null;
  itemCount: number;
  bandInfo: ScoreBandDetails | null;
  provenance: MeasurementProvenanceMetadata | null;
  epistemicStatus: string;
  precision: 'High' | 'Moderate' | 'Developing' | 'Unmeasured';
}

export interface UnifiedConstructViewModel {
  constructId: string;
  code: string;
  nameTr: string;
  nameEn: string;
  descriptionTr: string;
  domainId: string;
  domainCode: string;
  domainNameTr: string;
  isMeasured: boolean;
  compositeScore: number | null; // Native composite score
  scorePercentage: number | null; // Normalized 0-100 visual coordinate
  scale: MeasurementScaleMetadata | null;
  bandInfo: ScoreBandDetails | null;
  interpretation?: {
    shortDescriptionTr: string;
    textTr: string;
    strengths: string[];
    risks: string[];
  } | null;
  facetCount: number;
  measuredFacetCount: number;
  facets: UnifiedFacetViewModel[];
  provenance: MeasurementProvenanceMetadata | null;
}

export interface UnifiedDomainViewModel {
  domainId: string;
  code: string;
  nameTr: string;
  nameEn: string;
  descriptionTr: string;
  color?: string | null;
  sortOrder: number;
  status: UnifiedDomainStatus;
  measuredConstructCount: number;
  totalConstructCount: number;
  measuredFacetCount: number;
  totalFacetCount: number;
  coveragePercentage: number;
  compositeScore: number | null; // ONLY present if an authoritative scientific aggregation exists
  scale: MeasurementScaleMetadata | null;
  constructs: UnifiedConstructViewModel[];
}

export interface UnifiedResponseQualitySummary {
  overallFlag: 'EXCELLENT' | 'ACCEPTABLE' | 'QUESTIONABLE' | 'COMPROMISED';
  isClean: boolean;
  totalAssessmentsAudited: number;
  statusCounts: {
    excellent: number;
    acceptable: number;
    questionable: number;
    compromised: number;
  };
  speedViolationsCount: number;
  straightliningDetected: boolean;
  attentionChecksPassed: boolean;
  headlineTr: string;
  explanationTr: string;
}

export interface UnifiedQualityDimensions {
  coverage: {
    measuredDomains: number;
    totalDomains: number;
    exploredFacets: number;
    totalFacets: number;
    explorationPercentage: number;
    depthPercentage: number;
    labelTr: string;
  };
  responseQuality: {
    status: 'EXCELLENT' | 'ACCEPTABLE' | 'QUESTIONABLE' | 'COMPROMISED';
    labelTr: string;
    detailTr: string;
  };
  methodDiversity: {
    instrumentCount: number;
    instrumentsUsed: string[];
    labelTr: string;
    detailTr: string;
  };
  calibrationStatus: {
    status: 'PRE_CALIBRATION' | 'CALIBRATED';
    labelTr: string;
    disclaimerTr: string;
  };
}

export interface ProfileFingerprintDimension {
  id: string;
  code: string;
  nameTr: string;
  domainNameTr: string;
  nativeScore: number | null;
  scaleMin: number;
  scaleMax: number;
  normalizedCoordinate: number | null; // 0-100 visual rendering coordinate only
  isMeasured: boolean;
  bandInfo: ScoreBandDetails | null;
}

export interface UnifiedInteractionViewModel {
  id: string;
  titleTr: string;
  type: 'SYNERGY' | 'TENSION';
  descriptionTr: string;
  epistemicStatus: string;
  sourceDimensions: string[];
}

export interface SourceAssessmentProvenance {
  sessionId: string;
  moduleId: string;
  moduleCode: string;
  moduleTitleTr: string;
  formVersionCode: string;
  scoringModelCode: string;
  completedAt: string;
  resultUrl: string;
  integrityFlag: string;
  isLatestForModule: boolean;
}

export interface UnifiedProfileViewModel {
  userId: string;
  userName: string;
  hasAssessments: boolean;
  maturity: {
    stage: ProfileMaturityStage;
    labelTr: string;
    descriptionTr: string;
    progressPercentage: number;
  };
  lastUpdatedAt: string | null;
  completedAssessmentCount: number;
  qualityDimensions: UnifiedQualityDimensions;
  responseQuality: UnifiedResponseQualitySummary;

  // Complete 84-facet ontology map & domains
  domains: UnifiedDomainViewModel[];
  allFacets84: UnifiedFacetViewModel[];

  // Visual Fingerprint (measured dimensions only)
  fingerprint: {
    dimensions: ProfileFingerprintDimension[];
    measuredCount: number;
    totalCount: number;
    summaryText: string;
  };

  // Modular specialized sections
  hexacoSection: {
    isMeasured: boolean;
    radarData: Array<{
      name: string;
      name_tr: string;
      score: number;
      scaleMin: number;
      scaleMax: number;
    }>;
    constructs: UnifiedConstructViewModel[];
    measuredFacetCount: number;
    totalFacetCount: number;
  } | null;

  selfSystemSection: {
    isMeasured: boolean;
    rses: {
      isMeasured: boolean;
      score: number | null;
      scaleMin: number;
      scaleMax: number;
      bandInfo: ScoreBandDetails | null;
      titleTr: string;
      measuredAt: string | null;
      itemCount: number;
      provenance: MeasurementProvenanceMetadata | null;
    } | null;
    gse: {
      isMeasured: boolean;
      score: number | null;
      scaleMin: number;
      scaleMax: number;
      bandInfo: ScoreBandDetails | null;
      titleTr: string;
      measuredAt: string | null;
      itemCount: number;
      provenance: MeasurementProvenanceMetadata | null;
    } | null;
  } | null;

  // Strengths & Attention Points (deterministic config)
  strengths: Array<{ traitName: string; point: string; sourceConstruct: string }>;
  attentionPoints: Array<{ traitName: string; point: string; sourceConstruct: string }>;

  // Cross-Domain Interactions
  interactions: UnifiedInteractionViewModel[];

  // What is not yet known
  unmeasuredDomains: Array<{
    domainId: string;
    code: string;
    nameTr: string;
    descriptionTr: string;
    whyItMattersTr: string;
    availableAssessmentTitleTr?: string;
    availableAssessmentUrl?: string;
    isAssessmentAvailable: boolean;
  }>;

  // Source Provenance Timeline
  sourceAssessments: SourceAssessmentProvenance[];

  // Next Best Assessment Recommendation
  nextAction: {
    title: string;
    reason: string;
    estimatedMinutes: number;
    url: string;
    ctaText: string;
    status: string;
  } | null;
}

