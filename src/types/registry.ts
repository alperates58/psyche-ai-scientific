export type InstrumentDecision =
  | 'approved'
  | 'research_only'
  | 'requires_license'
  | 'rejected';

export interface InstrumentRegistryEntry {
  instrumentId: string;
  name: string;
  constructs: string[];
  authors: string[];
  year: number;
  license: string;
  commercialUse: boolean;
  translationRights: string;
  itemReproductionAllowed: boolean;
  officialUrl: string;
  doi?: string | null;
  notes: string;
  decision: InstrumentDecision;
}

export type EvidenceLevel = 'gold_standard' | 'tier_a' | 'tier_b' | 'tier_c' | 'exploratory';

export interface SourceRegistryEntry {
  sourceId: string;
  citation: string;
  doi?: string | null;
  url?: string | null;
  publicationType: string;
  peerReviewed: boolean;
  year: number;
  constructIds: string[];
  claimIds: string[];
  evidenceLevel: EvidenceLevel;
  notes: string;
}
