import { EpistemicTier } from './construct';

export type ItemType =
  | 'likert'
  | 'forced_choice'
  | 'situational_judgement'
  | 'bipolar'
  | 'behavior_frequency'
  | 'self_discrepancy'
  | 'contextual'
  | 'attention_check'
  | 'open_text';

export type ItemContext =
  | 'general'
  | 'work'
  | 'relationship'
  | 'family'
  | 'social'
  | 'stress'
  | 'decision'
  | 'other';

export type ItemDirection = 'positive' | 'negative';

export type SourceType = 'public_domain' | 'licensed' | 'original' | 'research_only';

export type ValidationStatus = 'provisional' | 'pilot' | 'validated' | 'normed';

export interface ResponseScale {
  min: number;
  max: number;
  step?: number;
  labels_tr?: string[];
  labels_en?: string[];
}

export interface SituationalOption {
  optionId: string;
  text_tr: string;
  text_en?: string;
  mappedFacetId: string;
  weight: number;
}

export interface ForcedChoiceBlock {
  blockId: string;
  pairedFacetIds: string[];
  scoringApproach: 'thurstonian_irt' | 'multi_unfolding' | 'normative_paired';
}

export interface SelfDiscrepancyMetadata {
  attributeKey: string;
  attributeLabel_tr: string;
  ratingTarget: 'actual_self' | 'ideal_self' | 'ought_self';
}

export interface ItemBankItem {
  id: string;
  domainId: string;
  constructId: string;
  facetId: string;
  itemType: ItemType;
  text_tr: string;
  text_en: string;
  responseScale?: ResponseScale;
  direction: ItemDirection;
  reverse_worded: boolean;
  context: ItemContext;
  measurementPurpose?: string;
  epistemicTier: EpistemicTier;
  sourceType: SourceType;
  sourceReference?: string | null;
  licenseStatus: string;
  pairedItemId?: string | null;
  attentionCheck?: boolean;
  socialDesirabilitySensitivity?: 'low' | 'moderate' | 'high';
  readingDifficulty?: 'easy' | 'moderate' | 'advanced';
  estimatedCompletionSeconds?: number;
  pilotStatus?: 'untested' | 'piloting' | 'retained' | 'flagged' | 'dropped';
  validationStatus: ValidationStatus;
  factorLoading?: number | null;
  discrimination?: number | null;
  thresholds?: number[] | null;
  itemInformation?: number | null;
  difFlags?: string[];
  forcedChoiceBlock?: ForcedChoiceBlock | null;
  situationalScenarios?: SituationalOption[] | null;
  selfDiscrepancyMetadata?: SelfDiscrepancyMetadata | null;
  version: string;
}
