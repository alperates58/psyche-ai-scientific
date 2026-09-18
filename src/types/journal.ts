/**
 * FAZ 2.21: Journal, Reflection & Observational Evidence Engine
 * Canonical Data Types, Interfaces & Schemas
 */

export type JournalEntryType =
  | 'FREE_REFLECTION'
  | 'EVENT'
  | 'EMOTION'
  | 'DECISION'
  | 'RELATIONSHIP'
  | 'WORK'
  | 'GOAL'
  | 'STRESS'
  | 'SUCCESS'
  | 'CHALLENGE'
  | 'OTHER';

export type JournalInsightType =
  | 'ENTRY_REFLECTION'
  | 'REPEATED_THEME'
  | 'PROFILE_ALIGNMENT'
  | 'CONTEXTUAL_VARIATION'
  | 'DECISION_REFLECTION'
  | 'EMOTIONAL_PATTERN_REFLECTION'
  | 'GOAL_REFLECTION'
  | 'LONGITUDINAL_CONTEXT_LINK'
  | 'OPEN_QUESTION';

export type JournalEvidenceClass =
  | 'USER_REPORTED_CONTEXT'
  | 'OBSERVATIONAL_DATA'
  | 'AI_REFLECTIVE_HYPOTHESIS'
  | 'THEORETICAL_INTERPRETATION';

export type JournalRelationshipType =
  | 'ALIGNED_WITH_MEASUREMENT'
  | 'DIFFERS_FROM_MEASUREMENT'
  | 'CONTEXTUAL_VARIATION'
  | 'UNMEASURED_RELEVANT_AREA'
  | 'NO_CLEAR_RELATION';

export type JournalRelationshipStrength = 'WEAK' | 'MODERATE' | 'STRONG';

export type JournalLifeEventType =
  | 'JOB_CHANGE'
  | 'RELOCATION'
  | 'RELATIONSHIP_TRANSITION'
  | 'MAJOR_GOAL'
  | 'HIGH_STRESS_PERIOD'
  | 'OTHER';

export type JournalContextTag =
  | 'GENERAL'
  | 'WORK'
  | 'RELATIONSHIPS'
  | 'FAMILY'
  | 'DECISION_MAKING'
  | 'STRESS'
  | 'SOCIAL'
  | 'SELF_IMAGE'
  | 'GOALS'
  | 'HEALTH'
  | 'LIFE_EVENT';

export const VALID_JOURNAL_CONTEXT_TAGS: readonly JournalContextTag[] = [
  'GENERAL',
  'WORK',
  'RELATIONSHIPS',
  'FAMILY',
  'DECISION_MAKING',
  'STRESS',
  'SOCIAL',
  'SELF_IMAGE',
  'GOALS',
  'HEALTH',
  'LIFE_EVENT',
] as const;

export const VALID_JOURNAL_ENTRY_TYPES: readonly JournalEntryType[] = [
  'FREE_REFLECTION',
  'EVENT',
  'EMOTION',
  'DECISION',
  'RELATIONSHIP',
  'WORK',
  'GOAL',
  'STRESS',
  'SUCCESS',
  'CHALLENGE',
  'OTHER',
] as const;

export const VALID_LIFE_EVENT_TYPES: readonly JournalLifeEventType[] = [
  'JOB_CHANGE',
  'RELOCATION',
  'RELATIONSHIP_TRANSITION',
  'MAJOR_GOAL',
  'HIGH_STRESS_PERIOD',
  'OTHER',
] as const;

/**
 * Journal Entry Data Model V1
 */
export interface JournalEntryV1 {
  id: string;
  userId: string;
  title?: string | null;
  body: string;
  entryType: JournalEntryType;
  
  // Subjective self-report ratings (1-5 scale, strictly non-psychometric)
  moodSelfReport?: number | null;
  energySelfReport?: number | null;
  stressSelfReport?: number | null;

  contextTags: JournalContextTag[];
  userTags: string[];

  isLifeEvent: boolean;
  lifeEventType?: JournalLifeEventType | null;

  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  deletedAt?: string | null;

  // Attached child objects
  insights?: JournalInsightV1[];
  relationships?: JournalProfileRelationshipV1[];
}

/**
 * Persisted AI / Deterministic Journal Insight V1
 */
export interface JournalInsightV1 {
  id: string;
  entryId: string;
  userId: string;
  insightType: JournalInsightType;
  evidenceClass: JournalEvidenceClass;
  summaryTr: string;
  reflectivePrompt?: string | null;
  isFallback: boolean;

  // Provenance metadata
  engineVersion: string;
  promptVersion?: string | null;
  provider?: string | null;
  modelId?: string | null;
  sourceContentHash?: string | null;

  createdAt: string; // ISO string
}

/**
 * Observational Profile Relationship V1
 */
export interface JournalProfileRelationshipV1 {
  id: string;
  entryId: string;
  relationshipType: JournalRelationshipType;
  evidenceType: JournalEvidenceClass;
  strength: JournalRelationshipStrength;

  relatedFacetIds: string[];
  relatedConstructIds: string[];
  relatedDomainIds: string[];

  narrativeTr?: string | null;
  createdAt: string; // ISO string
}

/**
 * FAZ 2.21 Scientific Hardening: Observational Topic Registry
 * Controlled taxonomy for descriptive thematic categorization (Strictly non-diagnostic, non-psychometric)
 */
export type ObservationalTopicKey =
  | 'SOCIAL_EXPRESSION'
  | 'DECISION_DIFFICULTY'
  | 'UNCERTAINTY'
  | 'CONFLICT_AVOIDANCE'
  | 'WORK_STRESS'
  | 'RELATIONSHIP_DISTANCE'
  | 'RELATIONSHIP_CLOSENESS'
  | 'SELF_CRITICISM'
  | 'GOAL_PERSISTENCE'
  | 'PROCRASTINATION'
  | 'EMOTIONAL_SUPPRESSION'
  | 'EMOTIONAL_REAPPRAISAL'
  | 'BOUNDARY_SETTING'
  | 'NEED_FOR_APPROVAL'
  | 'PERCEIVED_COMPETENCE'
  | 'MEANING_PURPOSE'
  | 'OTHER';

export type ThemeExtractionMethod =
  | 'DETERMINISTIC_KEYWORD'
  | 'DETERMINISTIC_TOPIC'
  | 'AI_ASSISTED_LABEL'
  | 'USER_TAG_DERIVED';

export type RepeatedThemeStatus =
  | 'REPEATED_SELF_REPORT'
  | 'MULTI_CONTEXT_REPEATED_REPORT'
  | 'SINGLE_REPORT'
  | 'INSUFFICIENT_REPETITION';

/**
 * Context Frequency Model V1
 * Measures pure recurrence of life domain tags (e.g. WORK in 5 entries)
 * STRICT INVARIANT: Context frequency is NOT equivalent to semantic theme recurrence.
 */
export interface ContextFrequencyV1 {
  context: JournalContextTag;
  contextLabelTr: string;
  entryCount: number;
  distinctDatesCount: number;
  percentage: number;
}

/**
 * Extracted Observational Signal (Internal Representation)
 */
export interface ObservationalSignalV1 {
  signalId: string;
  sourceEntryId: string;
  context: JournalContextTag;
  topicKey: ObservationalTopicKey;
  topicLabelTr: string;
  summaryTr: string;
  evidenceClass: JournalEvidenceClass;
  status: 'USER_REPORTED_CONTEXT' | 'REPEATED_SELF_REPORT' | 'AI_REFLECTIVE_HYPOTHESIS';
  detectedEmotions?: string[];
  referencedFacetIds?: string[];
}

/**
 * Dynamically Computed Repeated Theme
 * Invariant: Requires >= 3 semantically related entries AND >= 2 distinct calendar dates.
 */
export interface RepeatedThemeV1 {
  themeId: string;
  labelTr: string;
  normalizedThemeKey: ObservationalTopicKey;
  topicCategory: ObservationalTopicKey;
  evidenceEntryIds: string[];
  entryCount: number;
  distinctDatesCount: number;
  contexts: JournalContextTag[];
  status: RepeatedThemeStatus;
  extractionMethod: ThemeExtractionMethod;
  dateRange?: { start: string; end: string };
  summaryTr: string;
  relatedFacetIds: string[];

  // Compatibility aliases
  themeKey?: string;
  themeTitleTr?: string;
  context?: JournalContextTag;
  sampleEntryIds?: string[];
}

/**
 * Dynamically Computed Multi-Context Theme
 * Invariant: Requires >= 3 semantically related entries across >= 2 contexts on >= 2 distinct dates.
 */
export interface MultiContextThemeV1 {
  themeId: string;
  themeKey: string;
  themeTitleTr: string;
  topicKey: ObservationalTopicKey;
  contexts: JournalContextTag[];
  entryCount: number;
  distinctDatesCount: number;
  evidenceEntryIds: string[];
  sampleEntryIds: string[];
  status: 'MULTI_CONTEXT_REPEATED_REPORT';
  extractionMethod: ThemeExtractionMethod;
  summaryTr: string;
  relatedFacetIds: string[];
}

/**
 * Aggregated Journal Observation Summary
 */
export interface JournalObservationSummaryV1 {
  userId: string;
  entryCount: number;
  activeEntriesCount: number;
  dateRange?: { start: string; end: string } | null;
  
  // 1. Context Frequencies (Independent life domain recurrence)
  contextFrequencies: ContextFrequencyV1[];
  dominantContexts: { context: JournalContextTag; count: number; percentage: number }[]; // alias for compatibility
  
  // 2. Semantic Themes (Requires semantic content relationship + >=3 entries + >=2 dates)
  repeatedThemes: RepeatedThemeV1[];
  multiContextThemes: MultiContextThemeV1[];
  
  // 3. Descriptive Emotions
  repeatedEmotions: { emotion: string; count: number }[];
  
  // 4. Observational Profile Links & Directional Variations
  profileAlignedThemes: {
    relationshipType: JournalRelationshipType;
    facetId: string;
    facetNameTr: string;
    constructId: string;
    topicKey?: ObservationalTopicKey;
    summaryTr: string;
  }[];
  contextualVariations: {
    context: JournalContextTag;
    facetId: string;
    facetNameTr: string;
    measuredScore: number;
    userReportedTendencyTr: string;
    topicKey?: ObservationalTopicKey;
    narrativeTr: string;
  }[];
  unmeasuredRelevantAreas: {
    areaNameTr: string;
    context: JournalContextTag;
    topicKey?: ObservationalTopicKey;
    entryCount: number;
  }[];
  lifeEvents: {
    entryId: string;
    date: string;
    eventType: JournalLifeEventType;
    title?: string | null;
  }[];
  growthCandidateAreas: GrowthCandidateAreaV1[];
  limitations: string[];
}

/**
 * Scoped Privacy-Preserving AI Observation Bundle
 * Contains ZERO user IDs, emails, names, IPs, raw answers, or unrelated entries.
 */
export interface JournalObservationBundleV1 {
  currentEntryExcerpt: {
    title?: string | null;
    body: string;
    entryType: JournalEntryType;
    contextTags: JournalContextTag[];
    moodSelfReport?: number | null;
    energySelfReport?: number | null;
    stressSelfReport?: number | null;
    isLifeEvent: boolean;
    lifeEventType?: JournalLifeEventType | null;
    createdAt: string;
  };
  recentContextDistribution: { context: JournalContextTag; count: number }[];
  activeRepeatedThemes: {
    titleTr: string;
    context?: JournalContextTag;
    entryCount: number;
    summaryTr: string;
  }[];
  scopedProfileEvidence: {
    facetId: string;
    facetNameTr: string;
    constructId: string;
    constructNameTr: string;
    domainId: string;
    score: number;
    confidenceLevel: string;
  }[];
  limitations: string[];
}

export interface GrowthCandidateAreaV1 {
  candidateId: string;
  sourceType: 'JOURNAL_OBSERVATION' | 'PROFILE_TENSION' | 'LONGITUDINAL_VARIATION';
  topicKey?: ObservationalTopicKey;
  labelTr: string;
  relatedFacetIds: string[];
  relatedJournalThemes: string[];
  userPriority?: 'LOW' | 'MEDIUM' | 'HIGH';
  repeatEvidenceCount: number;
  distinctDatesCount: number;
  contexts: JournalContextTag[];
  notesTr?: string;
}

/**
 * Input DTOs
 */
export interface CreateJournalEntryInput {
  title?: string | null;
  body: string;
  entryType?: JournalEntryType;
  moodSelfReport?: number | null;
  energySelfReport?: number | null;
  stressSelfReport?: number | null;
  contextTags?: string[];
  userTags?: string[];
  isLifeEvent?: boolean;
  lifeEventType?: JournalLifeEventType | null;
}

export interface UpdateJournalEntryInput {
  title?: string | null;
  body?: string;
  entryType?: JournalEntryType;
  moodSelfReport?: number | null;
  energySelfReport?: number | null;
  stressSelfReport?: number | null;
  contextTags?: string[];
  userTags?: string[];
  isLifeEvent?: boolean;
  lifeEventType?: JournalLifeEventType | null;
}
