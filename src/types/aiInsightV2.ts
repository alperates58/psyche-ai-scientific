/**
 * PsycheAI AI Insight Engine V2 Data Contracts & Schema Definitions
 *
 * Grounded psychological interpretation layer downstream of deterministic scoring.
 * Strict invariants:
 * - AI NEVER calculates, modifies, or invents psychometric scores.
 * - AI sits ONLY at the interpretation layer.
 * - Every claim requires valid evidenceRefs.
 * - Clinical diagnoses, fake percentiles, and causal claims are prohibited.
 */

import { z } from 'zod';
import {
  MeasurementStatus,
  ResponseQualityStatus,
  ProfilePatternItemV2,
} from './unifiedProfileV2';
import { GroundedEvidenceEntry } from '@/lib/profile/profileEvidenceBundle';

export type InsightType =
  | 'PROFILE_OVERVIEW'
  | 'DOMAIN_INTERPRETATION'
  | 'CONSTRUCT_INTERPRETATION'
  | 'FACET_INTERPRETATION'
  | 'ASSESSMENT_RESULT'
  | 'CROSS_DOMAIN_PATTERN'
  | 'TENSION_INTERPRETATION'
  | 'SYNERGY_INTERPRETATION'
  | 'REFLECTION_PROMPT'
  | 'NEXT_EXPLORATION'
  | 'LONGITUDINAL_INTERPRETATION'
  | 'THEORY_READY_SUMMARY';

export type ClaimStrength =
  | 'DIRECT_MEASUREMENT'
  | 'MULTI_EVIDENCE_INTERPRETATION'
  | 'DETERMINISTIC_PATTERN'
  | 'THEORETICAL_INTERPRETATION'
  | 'REFLECTIVE_HYPOTHESIS';

export interface AIInsightGovernanceV2 {
  allowExternalProvider: boolean;
  requireConsent: boolean;
  allowRawResponses: false;
  allowClinicalDiagnosis: false;
  allowScoreCalculation: false;
  allowMissingTraitInference: false;
  allowLongitudinalClaimsWithoutRepeat: false;
  allowNormativeClaims: false;
}

export const DEFAULT_AI_GOVERNANCE: AIInsightGovernanceV2 = {
  allowExternalProvider: false,
  requireConsent: true,
  allowRawResponses: false,
  allowClinicalDiagnosis: false,
  allowScoreCalculation: false,
  allowMissingTraitInference: false,
  allowLongitudinalClaimsWithoutRepeat: false,
  allowNormativeClaims: false,
};

export interface InterpretationPlanV2 {
  planId: string;
  requestType: InsightType;
  targetDomainIds: string[];
  targetConstructIds: string[];
  targetFacetIds: string[];
  targetModuleCode?: string;

  primaryEvidence: GroundedEvidenceEntry[];
  supportingEvidence: GroundedEvidenceEntry[];
  counterbalancingEvidence: GroundedEvidenceEntry[];

  activatedPatterns: ProfilePatternItemV2[];
  activatedTensions: ProfilePatternItemV2[];
  activatedSynergies: ProfilePatternItemV2[];

  coverageState: {
    coverageRatio: number;
    unmeasuredDomainNames: string[];
    unmeasuredFacetCount: number;
  };
  responseQualityState: {
    overallFlag: ResponseQualityStatus;
    isClean: boolean;
    cautiousRequired: boolean;
    cautionReasons: string[];
  };
  calibrationState: 'PRE_CALIBRATION';
  longitudinalState: {
    hasRepeat: boolean;
    epochCount: number;
  };

  allowedClaims: string[];
  forbiddenClaims: string[];
  suggestedNextAssessment?: {
    moduleCode: string;
    titleTr: string;
    reasonTr: string;
  } | null;
}

export type InterpretationDepthMode = 'GLANCE' | 'NARRATIVE' | 'DEEP_ANALYSIS';

export const AIInsightV2Schema = z.object({
  insightId: z.string(),
  depthMode: z.enum(['GLANCE', 'NARRATIVE', 'DEEP_ANALYSIS']).default('NARRATIVE'),
  type: z.enum([
    'PROFILE_OVERVIEW',
    'DOMAIN_INTERPRETATION',
    'CONSTRUCT_INTERPRETATION',
    'FACET_INTERPRETATION',
    'ASSESSMENT_RESULT',
    'CROSS_DOMAIN_PATTERN',
    'TENSION_INTERPRETATION',
    'SYNERGY_INTERPRETATION',
    'REFLECTION_PROMPT',
    'NEXT_EXPLORATION',
    'LONGITUDINAL_INTERPRETATION',
    'THEORY_READY_SUMMARY',
  ]),
  titleTr: z.string().min(3).max(180),
  headlineTr: z.string().max(250).optional(),
  summaryTr: z.string().min(10).max(1000),
  bodyTr: z.string().min(20).max(6000),
  whatStandsOut: z.array(z.string()).optional(),
  dailyLifePatterns: z.array(z.string()).optional(),
  situationalStrengths: z.array(z.string()).optional(),
  possibleFrictionPoints: z.array(z.string()).optional(),
  traitInteractions: z.array(z.string()).optional(),
  decisionImplications: z.array(z.string()).optional(),
  relationshipImplications: z.array(z.string()).optional(),
  workGoalImplications: z.array(z.string()).optional(),
  claimStrength: z.enum([
    'DIRECT_MEASUREMENT',
    'MULTI_EVIDENCE_INTERPRETATION',
    'DETERMINISTIC_PATTERN',
    'THEORETICAL_INTERPRETATION',
    'REFLECTIVE_HYPOTHESIS',
  ]),
  evidenceRefs: z.array(z.string()),
  primaryEvidenceRefs: z.array(z.string()),
  supportingEvidenceRefs: z.array(z.string()),
  counterbalancingEvidenceRefs: z.array(z.string()),
  measurementStatus: z.string(),
  coverageStatus: z.string(),
  responseQualityStatus: z.string(),
  reflectionPrompts: z.array(z.string().min(5).max(300)).max(10),
  limitations: z.array(z.string().min(5).max(300)),
  generatedAt: z.string(),
  modelProvider: z.string(),
  modelName: z.string(),
  promptVersion: z.string(),
  engineVersion: z.string(),
  isFallback: z.boolean().default(false),
});

export type AIInsightV2 = z.infer<typeof AIInsightV2Schema>;

export interface EvidenceTransparencyInfo {
  insightId: string;
  titleTr: string;
  claimStrength: ClaimStrength;
  dimensions: Array<{
    facetId: string;
    code: string;
    nameTr: string;
    domainNameTr: string;
    score: number | null;
    bandLabelTr: string;
    status: string;
    scientificRationaleTr?: string;
  }>;
  sourceModules: Array<{
    moduleCode: string;
    titleTr: string;
    measuredAt?: string;
  }>;
  coverageContextTr: string;
  responseQualityNoteTr: string;
  limitationsTr: string[];
}

export interface UnifiedProfileAISectionData {
  overviewInsight: AIInsightV2;
  prominentPatternInsights: AIInsightV2[];
  counterbalancingInsights: AIInsightV2[];
  tensionInsights: AIInsightV2[];
  synergyInsights: AIInsightV2[];
  unmeasuredAreaInsights: AIInsightV2[];
  nextAssessmentPrompt: AIInsightV2 | null;
  generatedAt: string;
  isFallback: boolean;
}

export interface TheoryLensEvidenceBundle {
  bundleVersion: '2.0.0';
  generatedAt: string;
  userId: string;
  measurementModelVersion: 'PSYCHEAI_MASTER_MODEL_V1';
  batteryVersion: 'NATIVE_RESEARCH_BATTERY_V1';
  measuredFacets: Array<{
    facetId: string;
    code: string;
    nameTr: string;
    domainId: string;
    constructId: string;
    score: number;
    epistemicStatus: string;
  }>;
  crossDomainPatterns: Array<{
    id: string;
    titleTr: string;
    sourceFacetIds: string[];
    epistemicStatus: string;
  }>;
  tensions: Array<{
    id: string;
    titleTr: string;
    sourceFacetIds: string[];
    epistemicStatus: string;
  }>;
  synergies: Array<{
    id: string;
    titleTr: string;
    sourceFacetIds: string[];
    epistemicStatus: string;
  }>;
  measurementStatus: Record<string, string>;
  governanceNotice: string;
}
