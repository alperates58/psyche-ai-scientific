import { describe, it, expect } from 'vitest';
import {
  resolveFacetValidationEvidence,
  FacetValidationSummaryLike,
} from '@/lib/facetEvidenceResolver';

describe('FAZ 2.13 — Authoritative Facet Evidence Resolver Unit Tests', () => {
  it('returns UNKNOWN / NO_DIRECT conservatively when validation summary is missing (null/undefined)', () => {
    const resNull = resolveFacetValidationEvidence({
      validationSummary: null,
      sessionInstrumentId: 'inst-hexaco',
      sessionInstrumentName: 'HEXACO-60 TR',
    });

    expect(resNull.evidenceLevel).toBe('UNKNOWN');
    expect(resNull.overallTurkishEvidenceLevel).toBe('NO_DIRECT');
    expect(resNull.hasTurkishEvidence).toBe(false);
    expect(resNull.hasDirectFacetEvidence).toBe(false);
    expect(resNull.instrumentMatch).toBe(false);
    expect(resNull.rationaleTr).toContain('doğrulanmış psikometrik geçerlik özeti kaydı bulunmamaktadır');
  });

  it('proves citation-only instrument does NOT become DIRECT', () => {
    // An instrument exists with citation metadata in DB, but its facet has no validation summary
    const res = resolveFacetValidationEvidence({
      validationSummary: undefined,
      sessionInstrumentId: 'inst-citation-only',
      sessionInstrumentName: 'Inventory With Citation Only',
    });

    expect(res.evidenceLevel).not.toBe('DIRECT');
    expect(res.evidenceLevel).toBe('UNKNOWN');
    expect(res.hasDirectFacetEvidence).toBe(false);
  });

  it('proves author name substring (e.g. Wasti, Aypay) does NOT create Turkish evidence when validation record is NO_DIRECT', () => {
    const summary: FacetValidationSummaryLike = {
      id: 'summary-1',
      facetId: 'facet-author-test',
      overallTurkishEvidenceLevel: 'NO_DIRECT',
      overallStatus: 'NOT_ASSESSED',
      measurementAlignmentLevel: 'NOT_APPLICABLE',
      instrumentValidationEstablished: false,
      targetConstructInstrumentId: 'inst-wasti-test',
    };

    const res = resolveFacetValidationEvidence({
      validationSummary: summary,
      sessionInstrumentId: 'inst-wasti-test',
      sessionInstrumentName: 'HEXACO TR Adaptation (Wasti, Lee, Ashton & Somer, 2008)',
    });

    // Despite "Wasti" in sessionInstrumentName, evidence must strictly follow DB summary
    expect(res.overallTurkishEvidenceLevel).toBe('NO_DIRECT');
    expect(res.hasTurkishEvidence).toBe(false);
    expect(res.hasDirectFacetEvidence).toBe(false);
    expect(res.evidenceLevel).toBe('NO_DIRECT');
  });

  it('downgrades BROAD_FACTOR lexical evidence so it does NOT establish facet-level direct evidence', () => {
    const broadFactorSummary: FacetValidationSummaryLike = {
      id: 'summary-broad',
      facetId: 'facet-lexical',
      overallTurkishEvidenceLevel: 'DIRECT', // Broad factor study may have direct lexical extraction
      overallStatus: 'LEXICAL_SUPPORT_ONLY',
      measurementAlignmentLevel: 'CONSTRUCT_ALIGNED',
      instrumentValidationEstablished: true,
      targetConstructInstrumentId: 'inst-hexaco',
      studyEvidences: [
        {
          id: 'study-1',
          instrumentId: 'inst-hexaco',
          evidenceType: 'BROAD_FACTOR_LEXICAL_SUPPORT',
          evidenceLevel: 'LEXICAL',
          appliesToLevel: 'BROAD_FACTOR',
          measurementAlignmentLevel: 'CONSTRUCT_ALIGNED',
          humanVerified: false,
        },
      ],
    };

    const res = resolveFacetValidationEvidence({
      validationSummary: broadFactorSummary,
      sessionInstrumentId: 'inst-hexaco',
      sessionInstrumentName: 'HEXACO-60 TR',
    });

    // Invariant: Broad factor lexical support MUST NOT become DIRECT at facet level
    expect(res.hasDirectFacetEvidence).toBe(false);
    expect(res.evidenceLevel).toBe('LEXICAL');
    expect(res.rationaleTr).toContain('geniş faktör leksikal desteği');
  });

  it('rejects SCALE_TOTAL evidence from becoming facet-level direct evidence', () => {
    const scaleTotalSummary: FacetValidationSummaryLike = {
      id: 'summary-scale-total',
      facetId: 'facet-sub',
      overallTurkishEvidenceLevel: 'DIRECT',
      overallStatus: 'DIRECT_VALIDATION',
      measurementAlignmentLevel: 'NOT_APPLICABLE',
      instrumentValidationEstablished: true,
      targetConstructInstrumentId: 'inst-gse',
      studyEvidences: [
        {
          id: 'study-gse-total',
          instrumentId: 'inst-gse',
          evidenceType: 'SCALE_TOTAL_VALIDATION',
          evidenceLevel: 'DIRECT',
          appliesToLevel: 'SCALE_TOTAL',
          measurementAlignmentLevel: 'NOT_APPLICABLE',
          humanVerified: false,
        },
      ],
    };

    const res = resolveFacetValidationEvidence({
      validationSummary: scaleTotalSummary,
      sessionInstrumentId: 'inst-gse',
      sessionInstrumentName: 'General Self-Efficacy Scale',
    });

    // Invariant: SCALE_TOTAL does not establish facet-level DIRECT
    expect(res.hasDirectFacetEvidence).toBe(false);
    expect(res.evidenceLevel).not.toBe('DIRECT');
  });

  it('resolves DIRECT facet evidence when DIRECT + EXACT_FACET + matching instrument are established', () => {
    const directFacetSummary: FacetValidationSummaryLike = {
      id: 'summary-direct',
      facetId: 'facet-org',
      overallTurkishEvidenceLevel: 'DIRECT',
      overallStatus: 'DIRECT_FACET_VALIDATION',
      measurementAlignmentLevel: 'EXACT_FACET',
      instrumentValidationEstablished: true,
      targetConstructInstrumentId: 'inst-hexaco',
      humanVerified: false,
      studyEvidences: [
        {
          id: 'study-exact',
          instrumentId: 'inst-hexaco',
          evidenceType: 'DIRECT_EMPIRICAL_ADAPTATION',
          evidenceLevel: 'DIRECT',
          appliesToLevel: 'FACET',
          measurementAlignmentLevel: 'EXACT_FACET',
          humanVerified: false,
        },
      ],
    };

    const res = resolveFacetValidationEvidence({
      validationSummary: directFacetSummary,
      sessionInstrumentId: 'inst-hexaco',
      sessionInstrumentName: 'HEXACO-60 TR',
    });

    expect(res.instrumentMatch).toBe(true);
    expect(res.hasDirectFacetEvidence).toBe(true);
    expect(res.evidenceLevel).toBe('DIRECT');
    expect(res.overallTurkishEvidenceLevel).toBe('DIRECT');
    expect(res.hasTurkishEvidence).toBe(true);
    // Human verified remains honest
    expect(res.humanVerified).toBe(false);
  });

  it('rejects validation when session instrument does not match the validated instrument', () => {
    const hexacoSummary: FacetValidationSummaryLike = {
      id: 'summary-hexaco',
      facetId: 'facet-org',
      overallTurkishEvidenceLevel: 'DIRECT',
      overallStatus: 'DIRECT_FACET_VALIDATION',
      measurementAlignmentLevel: 'EXACT_FACET',
      instrumentValidationEstablished: true,
      targetConstructInstrumentId: 'inst-hexaco-id',
      studyEvidences: [
        {
          instrumentId: 'inst-hexaco-id',
          evidenceLevel: 'DIRECT',
          appliesToLevel: 'FACET',
          measurementAlignmentLevel: 'EXACT_FACET',
        },
      ],
    };

    const res = resolveFacetValidationEvidence({
      validationSummary: hexacoSummary,
      sessionInstrumentId: 'inst-different-survey-id',
      sessionInstrumentName: 'Quick Pop Quiz',
    });

    expect(res.instrumentMatch).toBe(false);
    expect(res.hasDirectFacetEvidence).toBe(false);
    expect(res.evidenceLevel).toBe('NO_DIRECT');
    expect(res.rationaleTr).toContain('eşleşmemektedir');
  });

  it('honestly represents humanVerified: false without inventing verification', () => {
    const unverifiedSummary: FacetValidationSummaryLike = {
      id: 'summary-unverified',
      facetId: 'facet-unverified',
      overallTurkishEvidenceLevel: 'DIRECT',
      overallStatus: 'DIRECT_FACET_VALIDATION',
      measurementAlignmentLevel: 'EXACT_FACET',
      instrumentValidationEstablished: true,
      targetConstructInstrumentId: 'inst-1',
      humanVerified: false,
    };

    const res = resolveFacetValidationEvidence({
      validationSummary: unverifiedSummary,
      sessionInstrumentId: 'inst-1',
    });

    expect(res.humanVerified).toBe(false);
  });
});
