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

export type EvidenceLevel =
  | 'gold_standard'
  | 'tier_a'
  | 'tier_b'
  | 'tier_c'
  | 'exploratory'
  | 'STRONG_DIRECT_EVIDENCE'
  | 'MODERATE_DIRECT_EVIDENCE'
  | 'INDIRECT_EVIDENCE'
  | 'THEORETICAL_SUPPORT'
  | 'LIMITED_EVIDENCE'
  | 'UNVERIFIED';

export type BibliographicVerificationStatus = 'VERIFIED_PRIMARY' | 'VERIFIED_SECONDARY' | 'UNVERIFIED';

export type EvidenceScope =
  | 'DIRECT_FACET'
  | 'DIRECT_CONSTRUCT'
  | 'RELATED_CONSTRUCT'
  | 'LEXICAL'
  | 'TRANSLATION_ONLY'
  | 'METHODOLOGICAL';

export type ClaimVerificationStatus =
  | 'VERIFIED_EXACT'
  | 'VERIFIED_GENERAL'
  | 'NOT_VERIFIED'
  | 'CONFLICTING_EVIDENCE'
  | 'NOT_ASSESSED';

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
  bibliographicVerificationStatus: BibliographicVerificationStatus;
  verificationEvidenceUrl?: string | null;
  verifiedAt?: string;
  doiVerified?: boolean | null;
  authorListVerified?: boolean;
  publicationVerified?: boolean;
  language?: 'tr' | 'en';
  isTurkishAdaptation?: boolean;
  evidenceScope?: EvidenceScope;
}

export interface InternalConsistencyClaim {
  value: number | null;
  metric: 'alpha' | 'omega_total' | 'omega_hierarchical' | null;
  sourceId: string | null;
  location: string | null;
  claimVerificationStatus: ClaimVerificationStatus;
}

export interface TestRetestClaim {
  value: number | null;
  interval: string | null;
  sourceId: string | null;
  location: string | null;
  claimVerificationStatus: ClaimVerificationStatus;
}

export interface SampleNClaim {
  value: number | null;
  description: string | null;
  sourceId: string | null;
  location: string | null;
  claimVerificationStatus: ClaimVerificationStatus;
}

export interface PsychometricReliabilityEvidence {
  internalConsistency: InternalConsistencyClaim;
  testRetest: TestRetestClaim;
  sampleN: SampleNClaim;
}

export type TurkishValidationStatus =
  | 'DIRECT_FACET_VALIDATION'
  | 'LEXICAL_SUPPORT_ONLY'
  | 'RELATED_MEASURE_VALIDATION'
  | 'NO_DIRECT_TURKISH_VALIDATION';

export interface TurkishValidationMatrixEntry {
  facetId: string;
  domainId: string;
  constructId: string;
  facetName: string;
  status: TurkishValidationStatus;
  sourceIds: string[];
  instrumentId?: string | null;
  sampleDescription: string;
  factorStructureStatus: string;
  measurementInvarianceStatus: string;
  reliabilityEvidence: PsychometricReliabilityEvidence;
  scientificNotes: string;
}

