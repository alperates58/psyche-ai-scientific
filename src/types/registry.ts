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

export type StudyType =
  | 'TURKISH_SCALE_ADAPTATION'
  | 'TURKISH_LEXICAL_STUDY'
  | 'TURKISH_THEORETICAL_MODEL'
  | 'INTERNATIONAL_ORIGINAL_INSTRUMENT'
  | 'METHODOLOGICAL_STANDARD';

export type ClaimVerificationMethod =
  | 'AI_ASSISTED_SOURCE_AUDIT'
  | 'HUMAN_RESEARCHER'
  | 'SOURCE_TEXT_AUDIT';

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
  studyType?: StudyType;
  studyPopulationCountry?: string;
  studyLanguageContext?: 'tr' | 'en';
  addedInPhase?: string;
}

export interface InternalConsistencyClaim {
  value: number | null;
  metric: 'alpha' | 'omega_total' | 'omega_hierarchical' | null;
  sourceId: string | null;
  location: string | null;
  claimVerificationStatus: ClaimVerificationStatus;
  verificationMethod?: ClaimVerificationMethod;
  humanVerified: boolean;
}

export interface TestRetestClaim {
  value: number | null;
  interval: string | null;
  sourceId: string | null;
  location: string | null;
  claimVerificationStatus: ClaimVerificationStatus;
  verificationMethod?: ClaimVerificationMethod;
  humanVerified: boolean;
}

export interface SampleNClaim {
  value: number | null;
  description: string | null;
  sourceId: string | null;
  location: string | null;
  claimVerificationStatus: ClaimVerificationStatus;
  verificationMethod?: ClaimVerificationMethod;
  humanVerified: boolean;
}

export interface PsychometricReliabilityEvidence {
  internalConsistency: InternalConsistencyClaim;
  testRetest: TestRetestClaim;
  sampleN?: SampleNClaim; // Kept as optional for backwards compatibility
}

export interface StudyEvidence {
  sampleN: SampleNClaim;
  population?: string | null;
  samplingMethod?: string | null;
}

export interface SupportingEvidenceRelation {
  sourceId: string;
  evidenceType: string;
  studySampleN?: number;
  appliesToLevel: string;
  doesNotEstablish: string[];
}

export interface AuditHistoryEntry {
  fromStatus: string;
  toStatus: string;
  reasonCode: string;
  reason: string;
  changedInPhase: string;
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
  targetConstructInstrumentId?: string | null;
  supportingEvidenceInstrumentId?: string | null;
  instrumentValidationEstablished?: boolean;
  sampleDescription: string;
  factorStructureStatus: string;
  broadFactorStructuralSupport?: string | null;
  measurementInvarianceStatus: string;
  reliabilityEvidence: PsychometricReliabilityEvidence;
  studyEvidence: StudyEvidence;
  supportingEvidence?: SupportingEvidenceRelation[];
  auditHistory?: AuditHistoryEntry[];
  scientificNotes: string;
}

