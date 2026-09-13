export type QualitySeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export type QualityRuleCode =
  | 'TOO_LONG'
  | 'TOO_SHORT'
  | 'DOUBLE_BARRELED'
  | 'ABSOLUTE_WORDING'
  | 'COMPLEX_NEGATION'
  | 'REPEATED_WORDING'
  | 'NEAR_DUPLICATE'
  | 'READING_DIFFICULTY'
  | 'LEADING_WORDING'
  | 'MORALIZED_WORDING'
  | 'OBVIOUS_DESIRABILITY'
  | 'AMBIGUOUS_TIMEFRAME'
  | 'CONSTRUCT_LEAKAGE'
  | 'SJT_REQUIRES_REVISION'
  | 'FORCED_CHOICE_DESIRABILITY_MISMATCH';

export interface QualityWarning {
  ruleCode: QualityRuleCode;
  severity: QualitySeverity;
  messageTr: string;
  messageEn: string;
  matchedText?: string;
  suggestionTr?: string;
}

export type ItemTriageStatus =
  | 'READY_FOR_EXPERT_REVIEW'
  | 'REQUIRES_INTERNAL_REVISION'
  | 'BLOCKED_PROVENANCE_OR_LICENSE';

export interface ItemQualityResult {
  itemId: string;
  facetId: string;
  warnings: QualityWarning[];
  wordingLintScore: number; // 0 to 100 (Renamed from qualityScore)
  formattingHeuristicScore: number; // Alias
  qualityScore: number; // Deprecated backward-compatible alias
  passed: boolean;
  automatedHeuristicOnly: boolean;
  triageStatus: ItemTriageStatus;
  disclaimerTr: string;
}

export interface SemanticCluster {
  clusterId: string;
  facetId: string;
  itemIds: string[];
  themeDescription: string;
  pairSimilarities: Array<{
    itemA: string;
    itemB: string;
    similarityScore: number; // 0.0 to 1.0
  }>;
}

export interface LexicalPair {
  itemAId: string;
  itemBId: string;
  itemAText: string;
  itemBText: string;
  facetA: string;
  facetB: string;
  isCrossFacet: boolean;
  similarityScore: number;
}

export interface LexicalAnalysisReport {
  method: 'LEXICAL_SIMILARITY_ANALYSIS';
  threshold: number;
  withinFacetDuplicates: LexicalPair[];
  crossFacetOverlaps: LexicalPair[];
  totalDuplicatesDetected: number;
  semanticDuplicateStatus: 'NOT_ASSESSED';
  summaryTr: string;
}

export interface BankQualitySummary {
  totalItemsScanned: number;
  cleanItemsCount: number;
  flaggedItemsCount: number;
  criticalIssuesCount: number;
  warningsByRule: Record<QualityRuleCode, number>;
  duplicateClustersCount: number;
  averageQualityScore: number; // Deprecated alias
  averageWordingLintScore: number;
  triageSummary: {
    readyForExpertReview: number;
    requiresInternalRevision: number;
    blockedProvenanceOrLicense: number;
  };
  disclaimerTr: string;
}
