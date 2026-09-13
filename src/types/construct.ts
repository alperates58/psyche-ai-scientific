export type EpistemicTier = 'A' | 'B' | 'C';

export type EpistemicStatus =
  | 'VALIDATED_MEASUREMENT'
  | 'EVIDENCE_SUPPORTED_INTERPRETATION'
  | 'THEORETICAL_INTERPRETATION'
  | 'HISTORICAL_FRAMEWORK';

export interface DesignTargets {
  minimum_items_target: number;
  initial_standard_form_target: number;
  maximum_research_bank_target: number;
}

export interface FacetDefinition {
  domainId: string;
  domainName: string;
  constructId: string;
  constructName: string;
  facetId: string;
  facetName: string;
  definition: string;
  observableIndicators: string[];
  epistemicTier: EpistemicTier;
  isOptionalModule: boolean;
  sourceIds: string[];
  primaryInstrumentId: string;
  designTargets: DesignTargets;
  applicableTheoryLenses: string[];
}
