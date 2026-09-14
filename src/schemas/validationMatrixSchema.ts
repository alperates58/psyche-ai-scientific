import { z } from 'zod';

export const ClaimVerificationStatusEnum = z.enum([
  'VERIFIED_EXACT',
  'VERIFIED_GENERAL',
  'NOT_VERIFIED',
  'CONFLICTING_EVIDENCE',
  'NOT_ASSESSED',
  'UNKNOWN'
]);

export const VerificationMethodEnum = z.enum([
  'AI_ASSISTED_SOURCE_AUDIT',
  'HUMAN_SOURCE_AUDIT',
  'NOT_VERIFIED'
]);

export const FactorStructureStatusEnum = z.enum([
  'SUPPORTED',
  'PARTIAL',
  'NOT_SUPPORTED',
  'NOT_ASSESSED',
  'UNKNOWN'
]);

export const FactorStructureLevelEnum = z.enum([
  'FACET',
  'SUBSCALE',
  'SCALE_TOTAL',
  'BROAD_FACTOR',
  'HIGHER_ORDER'
]);

export const MeasurementAlignmentLevelEnum = z.enum([
  'EXACT_FACET',
  'SUBSCALE_ALIGNED',
  'CONSTRUCT_ALIGNED',
  'NOT_APPLICABLE'
]);

export const TurkishValidationStatusEnum = z.enum([
  'DIRECT_FACET_VALIDATION',
  'LEXICAL_SUPPORT_ONLY',
  'RELATED_MEASURE_VALIDATION',
  'NO_DIRECT_TURKISH_VALIDATION'
]);

const baseClaimSchema = z.object({
  value: z.number().nullable(),
  sourceId: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  claimVerificationStatus: ClaimVerificationStatusEnum,
  verificationMethod: VerificationMethodEnum.optional(),
  humanVerified: z.boolean()
}).superRefine((claim, ctx) => {
  if (claim.claimVerificationStatus === 'VERIFIED_EXACT') {
    if (!claim.sourceId || claim.sourceId.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'VERIFIED_EXACT claims strictly require a non-empty sourceId'
      });
    }
    if (!claim.location || claim.location.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'VERIFIED_EXACT claims strictly require a non-empty location (page/table reference)'
      });
    }
    if (!claim.verificationMethod || claim.verificationMethod === 'NOT_VERIFIED') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'VERIFIED_EXACT claims strictly require an active verificationMethod (AI_ASSISTED_SOURCE_AUDIT or HUMAN_SOURCE_AUDIT)'
      });
    }
  }
});

export const InternalConsistencyEvidenceSchema = baseClaimSchema.extend({
  metric: z.enum(['alpha', 'omega_total', 'omega_hierarchical']).nullable().optional()
});

export const TestRetestEvidenceSchema = baseClaimSchema.extend({
  interval: z.string().nullable().optional()
});

export const SampleEvidenceSchema = baseClaimSchema.extend({
  description: z.string().nullable().optional()
});

// Strict prohibition of sampleN under reliabilityEvidence
export const ReliabilityEvidenceSchema = z.object({
  internalConsistency: InternalConsistencyEvidenceSchema,
  testRetest: TestRetestEvidenceSchema
}).strict().superRefine((data, ctx) => {
  if ('sampleN' in data) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'reliabilityEvidence cannot contain sampleN. sampleN must only exist in studyEvidence.'
    });
  }
});

export const StudyEvidenceSchema = z.object({
  sampleN: SampleEvidenceSchema,
  population: z.string().nullable().optional(),
  samplingMethod: z.string().nullable().optional()
});

export const FactorStructureEvidenceSchema = z.object({
  status: FactorStructureStatusEnum,
  level: FactorStructureLevelEnum,
  sourceId: z.string().nullable(),
  claimVerificationStatus: ClaimVerificationStatusEnum,
  verificationMethod: VerificationMethodEnum,
  humanVerified: z.boolean()
}).superRefine((data, ctx) => {
  if (data.status === 'SUPPORTED' && (!data.sourceId || data.sourceId.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'factorStructureEvidence with SUPPORTED status requires a non-empty sourceId'
    });
  }
});

export const SupportingEvidenceSchema = z.object({
  sourceId: z.string(),
  evidenceType: z.string(),
  studySampleN: z.number().optional(),
  appliesToLevel: z.string(),
  doesNotEstablish: z.array(z.string()).optional()
});

export const AuditHistoryEntrySchema = z.object({
  fromStatus: z.string(),
  toStatus: z.string(),
  reasonCode: z.string(),
  reason: z.string(),
  changedInPhase: z.string()
});

export const TurkishValidationEntrySchema = z.object({
  facetId: z.string(),
  domainId: z.string(),
  constructId: z.string(),
  facetName: z.string(),
  status: TurkishValidationStatusEnum,
  sourceIds: z.array(z.string()),
  instrumentId: z.string().nullable().optional(),
  targetConstructInstrumentId: z.string().nullable().optional(),
  supportingEvidenceInstrumentId: z.string().nullable().optional(),
  instrumentValidationEstablished: z.boolean().optional(),
  sampleDescription: z.string(),
  measurementAlignmentLevel: MeasurementAlignmentLevelEnum.optional(),
  factorStructureEvidence: FactorStructureEvidenceSchema,
  measurementInvarianceStatus: z.string(),
  reliabilityEvidence: ReliabilityEvidenceSchema,
  studyEvidence: StudyEvidenceSchema,
  supportingEvidence: z.array(SupportingEvidenceSchema).optional(),
  auditHistory: z.array(AuditHistoryEntrySchema).optional(),
  scientificNotes: z.string()
}).superRefine((entry, ctx) => {
  // Direct validation rules
  if (entry.status === 'DIRECT_FACET_VALIDATION') {
    if (!entry.measurementAlignmentLevel || entry.measurementAlignmentLevel === 'NOT_APPLICABLE') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `DIRECT_FACET_VALIDATION requires explicit measurementAlignmentLevel (EXACT_FACET, SUBSCALE_ALIGNED, or CONSTRUCT_ALIGNED) for ${entry.facetId}`
      });
    }
  }

  // Lexical support rules
  if (entry.status === 'LEXICAL_SUPPORT_ONLY') {
    if (entry.studyEvidence.sampleN.value !== null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `LEXICAL_SUPPORT_ONLY facets cannot have facet-level sampleN value for ${entry.facetId}`
      });
    }
    if (entry.factorStructureEvidence.status !== 'NOT_ASSESSED') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `LEXICAL_SUPPORT_ONLY facets cannot claim factor structure status other than NOT_ASSESSED at facet level for ${entry.facetId}`
      });
    }
    if (entry.factorStructureEvidence.level !== 'FACET') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `LEXICAL_SUPPORT_ONLY facets must declare factorStructureEvidence.level = 'FACET' for ${entry.facetId}`
      });
    }
  }
});

export const TurkishValidationMatrixSchema = z.array(TurkishValidationEntrySchema);
