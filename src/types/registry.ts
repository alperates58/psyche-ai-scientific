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

export type VerificationMethod =
  | 'AI_ASSISTED_SOURCE_AUDIT'
  | 'HUMAN_SOURCE_AUDIT'
  | 'NOT_VERIFIED';

export type ClaimVerificationMethod = VerificationMethod;

export interface InternalConsistencyEvidence {
  value: number | null;
  metric: 'alpha' | 'omega_total' | 'omega_hierarchical' | null;
  sourceId: string | null;
  location: string | null;
  claimVerificationStatus: ClaimVerificationStatus;
  verificationMethod?: VerificationMethod;
  humanVerified: boolean;
}
export type InternalConsistencyClaim = InternalConsistencyEvidence;

export interface TestRetestEvidence {
  value: number | null;
  interval: string | null;
  sourceId: string | null;
  location: string | null;
  claimVerificationStatus: ClaimVerificationStatus;
  verificationMethod?: VerificationMethod;
  humanVerified: boolean;
}
export type TestRetestClaim = TestRetestEvidence;

export interface SampleEvidence {
  value: number | null;
  description: string | null;
  sourceId: string | null;
  location: string | null;
  claimVerificationStatus: ClaimVerificationStatus;
  verificationMethod?: VerificationMethod;
  humanVerified: boolean;
}
export type SampleNClaim = SampleEvidence;

export interface ReliabilityEvidence {
  internalConsistency: InternalConsistencyEvidence;
  testRetest: TestRetestEvidence;
}
export type PsychometricReliabilityEvidence = ReliabilityEvidence;

export interface StudyEvidence {
  sampleN: SampleEvidence;
  population?: string | null;
  samplingMethod?: string | null;
}

export type FactorStructureStatus =
  | 'SUPPORTED'
  | 'PARTIAL'
  | 'NOT_SUPPORTED'
  | 'NOT_ASSESSED'
  | 'UNKNOWN';

export type FactorStructureLevel =
  | 'FACET'
  | 'SUBSCALE'
  | 'SCALE_TOTAL'
  | 'BROAD_FACTOR'
  | 'HIGHER_ORDER';

export type MeasurementAlignmentLevel =
  | 'EXACT_FACET'
  | 'SUBSCALE_ALIGNED'
  | 'CONSTRUCT_ALIGNED'
  | 'NOT_APPLICABLE';

export interface FactorStructureEvidence {
  status: FactorStructureStatus;
  level: FactorStructureLevel;
  sourceId: string | null;
  claimVerificationStatus: ClaimVerificationStatus;
  verificationMethod: VerificationMethod;
  humanVerified: boolean;
}

export interface SupportingEvidence {
  sourceId: string;
  evidenceType: string;
  studySampleN?: number;
  appliesToLevel: string;
  doesNotEstablish?: string[];
}
export type SupportingEvidenceRelation = SupportingEvidence;

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

export interface TurkishValidationEntry {
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
  measurementAlignmentLevel?: MeasurementAlignmentLevel;
  factorStructureEvidence: FactorStructureEvidence;
  factorStructureStatus?: string; // Optional legacy compatibility during migration
  broadFactorStructuralSupport?: string | null; // Optional legacy compatibility during migration
  measurementInvarianceStatus: string;
  reliabilityEvidence: ReliabilityEvidence;
  studyEvidence: StudyEvidence;
  supportingEvidence?: SupportingEvidence[];
  auditHistory?: AuditHistoryEntry[];
  scientificNotes: string;
}
export type TurkishValidationMatrixEntry = TurkishValidationEntry;


