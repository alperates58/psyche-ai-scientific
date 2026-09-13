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
  | 'CONSTRUCT_LEAKAGE';

export interface QualityWarning {
  ruleCode: QualityRuleCode;
  severity: QualitySeverity;
  messageTr: string;
  messageEn: string;
  matchedText?: string;
  suggestionTr?: string;
}

export interface ItemQualityResult {
  itemId: string;
  facetId: string;
  warnings: QualityWarning[];
  qualityScore: number; // 0 to 100
  passed: boolean; // true if no CRITICAL or too many WARNINGS
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

export interface BankQualitySummary {
  totalItemsScanned: number;
  cleanItemsCount: number;
  flaggedItemsCount: number;
  criticalIssuesCount: number;
  warningsByRule: Record<QualityRuleCode, number>;
  duplicateClustersCount: number;
  averageQualityScore: number;
}
