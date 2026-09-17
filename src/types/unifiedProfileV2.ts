/**
 * PsycheAI Unified Psychological Profile Data Contract V2
 *
 * Authoritative Master Psychological Model (11 Domains, 37 Constructs, 91 Facets).
 * Enforces strict scientific principles:
 * - Facet scores are the primary measurement layer (scale: 1.00–5.00).
 * - Construct scores are allowed only where deterministic aggregation is scientifically defined.
 * - Domain scores are nullable (no artificial collapsing into fake global means).
 * - Profile Coverage reflects actual measurement coverage, strictly separated from confidence.
 * - Confidence Map V2 separates independent epistemic dimensions without single fake percentages.
 * - Missing facets remain NOT_MEASURED (never midpoint imputed).
 * - All native items remain PRE_CALIBRATION.
 * - AI has ZERO psychometric scoring role.
 */

export type MeasurementStatus =
  | 'NOT_MEASURED'
  | 'PARTIALLY_MEASURED'
  | 'MEASURED_PRECALIBRATION'
  | 'LEGACY_ONLY';

export type AggregationStatus =
  | 'DIRECT_CONSTRUCT_SCORE'
  | 'FACET_PATTERN_ONLY'
  | 'PARTIAL_CONSTRUCT_PATTERN'
  | 'NOT_MEASURED';

export type EpistemicStatus =
  | 'PROVISIONAL_POINT_ESTIMATE'
  | 'UNTOUCHED'
  | 'LEGACY_PRECALIBRATION'
  | 'EVIDENCE_SUPPORTED_INTERPRETATION'
  | 'PROVISIONAL_PATTERN';

export type ResponseQualityStatus =
  | 'EXCELLENT'
  | 'ACCEPTABLE'
  | 'QUESTIONABLE'
  | 'COMPROMISED'
  | 'NO_DATA';

export interface FacetConfidenceComponents {
  coverage: 'HIGH' | 'MODERATE' | 'LOW' | 'NONE';
  responseQuality: 'EXCELLENT' | 'ACCEPTABLE' | 'CAUTION' | 'COMPROMISED' | 'NO_DATA';
  calibrationStatus: 'PRE_CALIBRATION';
  repeatMeasurement: 'NONE' | 'SINGLE_FOLLOWUP' | 'LONGITUDINAL';
  methodDiversity: 'SELF_REPORT_ONLY' | 'MULTI_INVENTORY' | 'MULTI_METHOD';
}

export interface ScoreBandDetailsV2 {
  band: 'LOW' | 'BALANCED' | 'HIGH' | 'LOWER_RANGE' | 'MID_RANGE' | 'UPPER_RANGE';
  labelTr: string;
  shortLabelTr: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

export interface SourceAssessmentModuleReference {
  moduleId: string;
  moduleCode: string;
  moduleTitleTr: string;
  sessionId?: string;
  measuredAt?: string;
}

export interface FacetProfileV2 {
  facetId: string;
  code: string;
  nameTr: string;
  nameEn: string;
  domainId: string;
  constructId: string;
  measurementStatus: MeasurementStatus;
  score: number | null; // Raw mean on native 1.00–5.00 scale (strictly null when unmeasured)
  normalizedVisualCoordinate: number | null; // 0-100 visual rendering coordinate ONLY (explicitly NOT a percentile)
  itemCountExpected: number;
  itemCountAnswered: number;
  completionRatio: number; // 0.0 to 1.0
  measurementEvidenceCount: number;
  sourceAssessmentModules: SourceAssessmentModuleReference[];
  latestMeasuredAt: string | null;
  responseQualityStatus: ResponseQualityStatus;
  epistemicStatus: EpistemicStatus;
  confidenceComponents: FacetConfidenceComponents;
  bandInfo: ScoreBandDetailsV2 | null;
  scientificDefinitionTr?: string;
  inclusionCriteria?: string[];
  referenceInstruments?: string[];
}

export interface ConstructProfileV2 {
  constructId: string;
  code: string;
  nameTr: string;
  nameEn: string;
  domainId: string;
  facetIds: string[];
  measuredFacetCount: number;
  totalFacetCount: number;
  coverageRatio: number; // 0.0 to 1.0
  aggregationStatus: AggregationStatus;
  constructScore: number | null; // Strictly null unless deterministic construct aggregation is authorized
  normalizedVisualCoordinate: number | null;
  bandInfo: ScoreBandDetailsV2 | null;
  facets: FacetProfileV2[];
  interpretation?: {
    shortDescriptionTr: string;
    textTr: string;
    strengths: string[];
    risks: string[];
  } | null;
}

export interface DomainProfileV2 {
  domainId: string;
  code: string;
  nameTr: string;
  nameEn: string;
  descriptionTr: string;
  color?: string | null;
  sortOrder: number;
  constructCount: number;
  measuredConstructCount: number;
  facetCount: number;
  measuredFacetCount: number;
  coverageRatio: number; // 0.0 to 1.0
  coveragePercentage: number; // 0 to 100
  dominantMeasuredPatterns: string[];
  underMeasuredAreas: string[];
  domainScore: null; // Strictly null (no fake global domain totals)
  constructs: ConstructProfileV2[];
}

export interface ProfileCoverageV2 {
  domainCoverage: {
    measuredCount: number;
    totalCount: number;
    ratio: number;
    percentage: number;
  };
  constructCoverage: {
    measuredCount: number;
    totalCount: number;
    ratio: number;
    percentage: number;
  };
  facetCoverage: {
    measuredCount: number;
    totalCount: number;
    ratio: number;
    percentage: number;
  };
  questionCoverage: {
    answeredCount: number;
    totalCount: number;
    ratio: number;
    percentage: number;
  };
  disclaimerTr: string;
}

export interface ConfidenceMapV2 {
  measurementCoverage: 'HIGH' | 'MODERATE' | 'LOW' | 'NONE';
  responseQuality: 'EXCELLENT' | 'ACCEPTABLE' | 'QUESTIONABLE' | 'COMPROMISED' | 'NO_DATA';
  itemCompletion: 'ADEQUATE' | 'PARTIAL' | 'UNMEASURED';
  repeatMeasurement: 'NONE' | 'SINGLE_FOLLOWUP' | 'LONGITUDINAL';
  methodDiversity: 'SELF_REPORT_ONLY' | 'MULTI_INVENTORY' | 'MULTI_METHOD';
  calibrationStatus: 'PRE_CALIBRATION';
  componentsSummaryTr: string;
}

export interface ResponseQualityV2 {
  overallFlag: ResponseQualityStatus;
  speedViolationsCount: number;
  straightliningDetected: boolean;
  attentionChecksPassed: boolean;
  inconsistencyViolationsCount: number;
  totalAssessmentsAudited: number;
  statusCounts: {
    excellent: number;
    acceptable: number;
    questionable: number;
    compromised: number;
  };
  cautiousInterpretationRequired: boolean;
  cautionsTr: string[];
  headlineTr: string;
  explanationTr: string;
}

export interface ProfilePatternItemV2 {
  id: string;
  titleTr: string;
  type: 'CROSS_DOMAIN_PATTERN' | 'TENSION' | 'SYNERGY';
  descriptionTr: string;
  scientificRationaleTr: string;
  sourceFacetIds: string[];
  sourceFacetNamesTr: string[];
  epistemicStatus: string;
  confidence: 'HIGH' | 'MODERATE' | 'LOW';
  reflectionPromptTr?: string;
  limitationsTr?: string;
}

export interface SelfSystemViewsV2 {
  actualSelf: {
    isMeasured: boolean;
    selfEsteemScore: number | null;
    selfEfficacyScore: number | null;
    selfCompassionScore: number | null;
    locusOfControlScore: number | null;
    clarityScore: number | null;
    authenticityScore: number | null;
  };
  idealSelf: null; // Explicitly unmeasured in current battery
  socialSelf: null; // Explicitly unmeasured in current battery
  disclaimerTr: string;
}

export interface ContextualViewsV2 {
  work: null;
  relationships: null;
  stress: null;
  decisionMaking: null;
  disclaimerTr: string;
}

export interface LongitudinalReadinessV2 {
  hasRepeatMeasurements: boolean;
  measurementEpochsCount: number;
  canComputeTrajectories: boolean;
  statusLabelTr: string;
  explanationTr: string;
}

export interface LegacyCompatibilityV2 {
  hasLegacy17ItemData: boolean;
  legacySessionsCount: number;
  legacyFacetScores: Record<string, number>;
  isolationNoteTr: string;
}

export interface NextBestAssessmentV2 {
  moduleCode: string;
  titleTr: string;
  reasonTr: string;
  estimatedMinutes: number;
  targetUncoveredFacetsCount: number;
  targetDomainNameTr: string;
  url: string;
  ctaText: string;
}

export interface RecentAssessmentProvenanceV2 {
  sessionId: string;
  moduleId: string;
  moduleCode: string;
  moduleTitleTr: string;
  formVersionCode: string;
  completedAt: string;
  integrityFlag: string;
  resultUrl: string;
}

export interface UnifiedPsychologicalProfileV2 {
  profileVersion: '2.0.0';
  generatedAt: string;
  userId: string;
  userName: string;
  hasAssessments: boolean;
  measurementModelVersion: 'PSYCHEAI_MASTER_MODEL_V1';
  batteryVersion: 'NATIVE_RESEARCH_BATTERY_V1';

  // 1. Model Coverage (strictly separated from confidence)
  coverage: ProfileCoverageV2;

  // 2. Authoritative Taxonomy
  domains: DomainProfileV2[];
  constructs: ConstructProfileV2[];
  facets: FacetProfileV2[];

  // 3. Response Quality Telemetry & Epistemic Confidence Map
  responseQuality: ResponseQualityV2;
  confidenceMap: ConfidenceMapV2;

  // 4. Deterministic Dynamics (strictly measured evidence only)
  crossDomainPatterns: ProfilePatternItemV2[];
  tensions: ProfilePatternItemV2[];
  synergies: ProfilePatternItemV2[];

  // 5. Self-System & Contextual Framework Readiness
  selfSystemViews: SelfSystemViewsV2;
  contextualViews: ContextualViewsV2;

  // 6. Scientific Grounding & Evidence Summary
  evidenceSummary: {
    totalEvidences: number;
    facetEvidencesCount: number;
    constructEvidencesCount: number;
    patternEvidencesCount: number;
  };

  // 7. Longitudinal & Legacy Support
  longitudinalReadiness: LongitudinalReadinessV2;
  legacyCompatibility: LegacyCompatibilityV2;

  // 8. Next Step & Session Timeline
  nextBestAssessment: NextBestAssessmentV2 | null;
  recentAssessments: RecentAssessmentProvenanceV2[];
}
