/**
 * PsycheAI Profile Confidence and Uncertainty Data Model
 * 
 * Epistemic confidence models deriving dimension-level evidence strength
 * without generating pseudo-statistical confidence percentages.
 */

export type DimensionConfidenceLevel = 'VERY_LOW' | 'LOW' | 'MODERATE' | 'HIGH';

export type UncertaintyType =
  | 'MEASUREMENT_COVERAGE_UNCERTAINTY'
  | 'RESPONSE_QUALITY_UNCERTAINTY'
  | 'CALIBRATION_UNCERTAINTY'
  | 'PROVENANCE_UNCERTAINTY'
  | 'TEMPORAL_UNCERTAINTY';

export type TemporalStabilitySignal =
  | 'SINGLE_MEASUREMENT'
  | 'REPEATED_CONSISTENT'
  | 'REPEATED_VARIABLE'
  | 'NOT_APPLICABLE';

export interface DimensionUncertaintyItem {
  type: UncertaintyType;
  labelTr: string;
  descriptionTr: string;
}

export interface DimensionConfidence {
  dimensionId: string;
  dimensionCode: string;
  dimensionNameTr: string;
  domainCode: string;
  domainNameTr: string;
  level: DimensionConfidenceLevel;
  levelLabelTr: string;
  itemCount: number;
  responseQuality: 'EXCELLENT' | 'ACCEPTABLE' | 'QUESTIONABLE' | 'COMPROMISED';
  evidenceLevel: string;
  calibrationState: 'PRE_CALIBRATION' | 'CALIBRATED';
  temporalSignal: TemporalStabilitySignal;
  measurementCount: number;
  provenanceCompleteness: boolean;
  positiveFactors: string[];
  uncertainties: DimensionUncertaintyItem[];
  missingSignals: string[];
  explanationTr: string;
}

export interface ProfileConfidenceMapViewModel {
  distribution: {
    high: number;
    moderate: number;
    low: number;
    veryLow: number;
    totalMeasured: number;
  };
  dimensions: DimensionConfidence[];
  headlineTr: string;
  overallNoteTr: string;
}

export interface ProfileCompletenessSummary {
  totalOntologyFacets: number;
  measuredFacetsCount: number;
  facetCoveragePercentage: number;
  totalUserFacingDomains: number;
  measuredUserFacingDomains: number;
  totalOntologyDomains: number;
  measuredOntologyDomains: number;
  summaryStatementsTr: string[];
  disclaimerTr: string;
}
