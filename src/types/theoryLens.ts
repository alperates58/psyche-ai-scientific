/**
 * PsycheAI FAZ 2.19 — Theory Lens & Kuramsal Konsil Engine Contracts
 *
 * Grounded theoretical/historical interpretation layer downstream of deterministic scoring.
 * Invariants:
 * - Deterministic Master Psychological Model (11 domains, 37 constructs, 91 facets) is authoritative.
 * - Theories NEVER modify psychometric scores, invent missing data, or diagnose.
 * - Strict epistemic separation: MEASURED_FINDING vs THEORETICAL_INTERPRETATION vs USER_PROVIDED_CONTEXT vs REFLECTIVE_HYPOTHESIS.
 * - 10 Supported Lenses: FREUD, JUNG, ADLER, ROGERS, MASLOW, SKINNER, WILLIAM_JAMES, GESTALT, FRANKL, BECK.
 */

import { z } from 'zod';

export type TheoryLensId =
  | 'FREUD'
  | 'JUNG'
  | 'ADLER'
  | 'ROGERS'
  | 'MASLOW'
  | 'SKINNER'
  | 'WILLIAM_JAMES'
  | 'GESTALT'
  | 'FRANKL'
  | 'BECK';

export const ALL_THEORY_LENS_IDS: TheoryLensId[] = [
  'FREUD',
  'JUNG',
  'ADLER',
  'ROGERS',
  'MASLOW',
  'SKINNER',
  'WILLIAM_JAMES',
  'GESTALT',
  'FRANKL',
  'BECK',
];

export interface TheorySource {
  sourceId: string;
  lensId: TheoryLensId;
  title: string;
  author: string;
  year: number;
  publisherOrJournal: string;
  doiOrCanonicalUrl: string;
  sourceType: string;
  verificationStatus: string;
  conceptsSupported: string[];
  notes?: string;
  citationTr?: string;
}

export interface TheoryConcept {
  conceptId: string;
  nameTr: string;
  nameEn?: string;
  definitionTr: string;
  sourceRefs: string[];
}

export interface TheoryConceptMapping {
  conceptId: string;
  targetDomainCodes?: string[];
  targetConstructCodes?: string[];
  targetFacetIds?: string[];
  mappingRationaleTr: string;
}

export interface TheoryLensDefinition {
  lensId: TheoryLensId;
  displayNameTr: string;
  displayNameEn?: string;
  theoristName: string;
  shortDescriptionTr: string;
  historicalContextTr: string;
  historicalPeriod: string;
  theoreticalTradition: string;
  epistemicStatus: string;
  coreConcepts: TheoryConcept[];
  allowedConceptMappings: TheoryConceptMapping[];
  forbiddenInterpretations: string[];
  clinicalRiskNotes: string[];
  historicalLimitations: string[];
  modernEvidenceLimitations: string[];
  reflectionPrompts: string[];
  sourceIds: string[];
}

export type EpistemicClaimType =
  | 'MEASURED_FINDING'
  | 'THEORETICAL_INTERPRETATION'
  | 'USER_PROVIDED_CONTEXT'
  | 'REFLECTIVE_HYPOTHESIS';

export interface EpistemicSegment {
  claimType: EpistemicClaimType;
  contentTr: string;
  evidenceRefs?: string[];
}

export interface GroundedFacetDetail {
  code: string;
  nameTr: string;
  domainNameTr: string;
  bandLabelTr: string;
  score: number;
  epistemicStatus: string;
}

export interface ScopedLensEvidenceBundle {
  lensId: TheoryLensId;
  lensDisplayNameTr: string;
  theoristName: string;
  generatedAt: string;
  userId: string;
  coverageRatio: number;
  measuredFacetCount: number;
  totalFacetCount: number;
  scopedFacets: GroundedFacetDetail[];
  activatedPatterns: Array<{
    id: string;
    titleTr: string;
    sourceFacetIds: string[];
    epistemicStatus: string;
  }>;
  activatedTensions: Array<{
    id: string;
    titleTr: string;
    sourceFacetIds: string[];
    epistemicStatus: string;
  }>;
  activatedSynergies: Array<{
    id: string;
    titleTr: string;
    sourceFacetIds: string[];
    epistemicStatus: string;
  }>;
  relevantConcepts: TheoryConcept[];
  sources: TheorySource[];
  unmeasuredAreasWarningTr?: string;
}

export const EpistemicSegmentSchema = z.object({
  claimType: z.enum([
    'MEASURED_FINDING',
    'THEORETICAL_INTERPRETATION',
    'USER_PROVIDED_CONTEXT',
    'REFLECTIVE_HYPOTHESIS',
  ]),
  contentTr: z.string().min(3),
  evidenceRefs: z.array(z.string()).optional(),
});

export const TheoryInsightV1Schema = z.object({
  insightId: z.string(),
  lensId: z.enum([
    'FREUD',
    'JUNG',
    'ADLER',
    'ROGERS',
    'MASLOW',
    'SKINNER',
    'WILLIAM_JAMES',
    'GESTALT',
    'FRANKL',
    'BECK',
  ]),
  titleTr: z.string().min(5).max(200),
  summaryTr: z.string().min(10).max(600),
  epistemicSegments: z.array(EpistemicSegmentSchema),
  perspectiveAnalysisTr: z.string().min(20).max(4000),
  identifiedTensionsAndSynergiesTr: z.string().max(2000).optional(),
  reflectionPromptsTr: z.array(z.string().min(5).max(300)).max(8),
  historicalLimitationsTr: z.array(z.string().min(5).max(300)),
  modernLimitationsTr: z.array(z.string().min(5).max(300)),
  evidenceRefs: z.array(z.string()),
  isFallback: z.boolean().default(false),
  modelProvider: z.string(),
  modelName: z.string(),
  generatedAt: z.string(),
});

export type TheoryInsightV1 = z.infer<typeof TheoryInsightV1Schema> & {
  sourcesUsed: TheorySource[];
  groundedFacetDetails: GroundedFacetDetail[];
};

export interface TheoryChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  epistemicSegments?: EpistemicSegment[];
  evidenceRefs?: string[];
  sourcesUsed?: TheorySource[];
  isFallback?: boolean;
  timestamp: string;
}

export const TheoryConversationResponseSchema = z.object({
  lensId: z.enum([
    'FREUD',
    'JUNG',
    'ADLER',
    'ROGERS',
    'MASLOW',
    'SKINNER',
    'WILLIAM_JAMES',
    'GESTALT',
    'FRANKL',
    'BECK',
  ]),
  replyTr: z.string().min(10).max(3000),
  epistemicSegments: z.array(EpistemicSegmentSchema),
  evidenceRefs: z.array(z.string()),
  suggestedReflectionPrompts: z.array(z.string().min(5).max(300)).max(5),
  isFallback: z.boolean().default(false),
  modelProvider: z.string(),
  modelName: z.string(),
});

export type TheoryConversationResponseV1 = z.infer<typeof TheoryConversationResponseSchema> & {
  sourcesUsed: TheorySource[];
};

export interface LensComparisonView {
  lensId: TheoryLensId;
  lensNameTr: string;
  theoristName: string;
  coreViewTr: string;
  keyConceptsUsed: string[];
  epistemicSegments: EpistemicSegment[];
  sources: TheorySource[];
}

export interface TheoryComparisonResult {
  comparisonId: string;
  comparedLensIds: TheoryLensId[];
  topicOrDomain: string;
  lenses: LensComparisonView[];
  consensusPointsTr: string[];
  divergencePointsTr: string[];
  integrativeSynthesisTr: string;
  evidenceRefs: string[];
  isFallback: boolean;
  generatedAt: string;
}
