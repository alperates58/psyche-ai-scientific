import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  TurkishValidationMatrixSchema,
  TurkishValidationEntrySchema
} from '../src/schemas/validationMatrixSchema';
import { generateScientificAuditReport } from '../scripts/generate-scientific-audit-report';

describe('FAZ 2.4: Schema Hygiene, Factor Evidence Levels & Epistemic Audit', () => {
  const root = path.resolve(__dirname, '..');
  const matrixPath = path.resolve(root, 'research/turkish-validation-matrix.json');
  const constructsPath = path.resolve(root, 'data/constructs.json');
  const sourcesPath = path.resolve(root, 'data/source-registry.json');

  const trMatrix = JSON.parse(fs.readFileSync(matrixPath, 'utf8'));
  const ontologyFacets = JSON.parse(fs.readFileSync(constructsPath, 'utf8'));
  const sources = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));

  const validSourceIds = new Set(sources.map((s: any) => s.sourceId));

  // 1. reliabilityEvidence cannot contain sampleN
  it('1. reliabilityEvidence cannot contain sampleN across all 84 facets', () => {
    expect(trMatrix.length).toBe(84);
    for (const facet of trMatrix) {
      expect(facet.reliabilityEvidence).toBeDefined();
      expect(facet.reliabilityEvidence.sampleN).toBeUndefined();
      expect('sampleN' in facet.reliabilityEvidence).toBe(false);
    }
  });

  // 2. sampleN can only exist in studyEvidence
  it('2. sampleN can only exist in studyEvidence across all 84 facets', () => {
    for (const facet of trMatrix) {
      expect(facet.studyEvidence).toBeDefined();
      expect(facet.studyEvidence.sampleN).toBeDefined();
      expect(typeof facet.studyEvidence.sampleN).toBe('object');
      expect('claimVerificationStatus' in facet.studyEvidence.sampleN).toBe(true);
      expect('humanVerified' in facet.studyEvidence.sampleN).toBe(true);
    }
  });

  // 3. lexical study cannot create facet validation sample
  it('3. lexical study cannot create facet validation sample (value is null, status is NOT_ASSESSED)', () => {
    const lexicalFacets = trMatrix.filter((f: any) => f.status === 'LEXICAL_SUPPORT_ONLY');
    expect(lexicalFacets.length).toBe(24);

    for (const facet of lexicalFacets) {
      expect(facet.studyEvidence.sampleN.value).toBeNull();
      expect(facet.studyEvidence.sampleN.claimVerificationStatus).toBe('NOT_ASSESSED');
    }
  });

  // 4. lexical facet factor structure is not independently supported
  it('4. lexical facet factor structure is not independently supported (status is NOT_ASSESSED, level is FACET)', () => {
    const lexicalFacets = trMatrix.filter((f: any) => f.status === 'LEXICAL_SUPPORT_ONLY');
    expect(lexicalFacets.length).toBe(24);

    for (const facet of lexicalFacets) {
      expect(facet.factorStructureEvidence).toBeDefined();
      expect(facet.factorStructureEvidence.status).toBe('NOT_ASSESSED');
      expect(facet.factorStructureEvidence.level).toBe('FACET');
      expect(facet.factorStructureEvidence.sourceId).toBeNull();
      expect(facet.factorStructureEvidence.humanVerified).toBe(false);
    }
  });

  // 5. broad factor evidence explicitly declares BROAD_FACTOR level
  it('5. broad factor evidence explicitly declares BROAD_FACTOR level in supportingEvidence', () => {
    const lexicalFacets = trMatrix.filter((f: any) => f.status === 'LEXICAL_SUPPORT_ONLY');
    expect(lexicalFacets.length).toBe(24);

    for (const facet of lexicalFacets) {
      expect(Array.isArray(facet.supportingEvidence)).toBe(true);
      expect(facet.supportingEvidence.length).toBeGreaterThanOrEqual(1);

      const wastiEvidence = facet.supportingEvidence.find((se: any) => se.sourceId === 'src_wasti_2008');
      expect(wastiEvidence).toBeDefined();
      expect(wastiEvidence.evidenceType).toBe('BROAD_FACTOR_LEXICAL_SUPPORT');
      expect(wastiEvidence.appliesToLevel).toBe('BROAD_FACTOR');
      expect(wastiEvidence.studySampleN).toBe(521);
      expect(wastiEvidence.doesNotEstablish).toContain('facet reliability');
    }
  });

  // 6. direct scale evidence declares scale/subscale/facet level
  it('6. direct scale evidence declares scale/subscale/facet level and explicit measurementAlignmentLevel', () => {
    const directFacets = trMatrix.filter((f: any) => f.status === 'DIRECT_FACET_VALIDATION');
    expect(directFacets.length).toBe(14);

    const validLevels = new Set(['SCALE_TOTAL', 'SUBSCALE', 'FACET']);
    const validAlignments = new Set(['EXACT_FACET', 'SUBSCALE_ALIGNED', 'CONSTRUCT_ALIGNED']);

    for (const facet of directFacets) {
      expect(facet.factorStructureEvidence).toBeDefined();
      expect(facet.factorStructureEvidence.status).toBe('SUPPORTED');
      expect(validLevels.has(facet.factorStructureEvidence.level)).toBe(true);
      expect(validAlignments.has(facet.measurementAlignmentLevel)).toBe(true);
      expect(facet.factorStructureEvidence.sourceId).toBeTruthy();
      expect(validSourceIds.has(facet.factorStructureEvidence.sourceId)).toBe(true);
    }

    const scaleTotalCount = directFacets.filter((f: any) => f.factorStructureEvidence.level === 'SCALE_TOTAL').length;
    const subscaleCount = directFacets.filter((f: any) => f.factorStructureEvidence.level === 'SUBSCALE').length;
    expect(scaleTotalCount).toBe(7);
    expect(subscaleCount).toBe(7);
  });

  // 7. factorStructureEvidence requires source
  it('7. factorStructureEvidence requires source when status is SUPPORTED', () => {
    for (const facet of trMatrix) {
      if (facet.factorStructureEvidence.status === 'SUPPORTED') {
        expect(facet.factorStructureEvidence.sourceId).toBeTruthy();
        expect(typeof facet.factorStructureEvidence.sourceId).toBe('string');
        expect(validSourceIds.has(facet.factorStructureEvidence.sourceId)).toBe(true);
      }
    }
  });

  // 8. report facet denominator is dynamic
  it('8. report facet denominator is dynamic and derives from source-of-truth ontology', () => {
    const reportText = generateScientificAuditReport();
    const dynamicDenominator = `${ontologyFacets.length} facet`;
    expect(reportText).toContain(`Toplam: 14 / ${dynamicDenominator}`);
    expect(reportText).toContain(`Toplam: 24 / ${dynamicDenominator}`);
    expect(reportText).toContain(`Toplam: 2 / ${dynamicDenominator}`);
    expect(reportText).toContain(`Toplam: 44 / ${dynamicDenominator}`);
  });

  // 9. report lexical count is dynamic
  it('9. report lexical count is dynamic', () => {
    const lexicalFacets = trMatrix.filter((f: any) => f.status === 'LEXICAL_SUPPORT_ONLY');
    const reportText = generateScientificAuditReport();
    expect(reportText).toContain(`${lexicalFacets.length} facet'in her birinde facet-seviyesindeki`);
    expect(reportText).toContain(`${lexicalFacets.length} Leksikal facet için instrumentValidationEstablished: false`);
  });

  // 10. status counts sum to ontology facet total
  it('10. status counts sum strictly to ontology facet total with bidirectional set equality', () => {
    const directCount = trMatrix.filter((f: any) => f.status === 'DIRECT_FACET_VALIDATION').length;
    const lexicalCount = trMatrix.filter((f: any) => f.status === 'LEXICAL_SUPPORT_ONLY').length;
    const relatedCount = trMatrix.filter((f: any) => f.status === 'RELATED_MEASURE_VALIDATION').length;
    const noDirectCount = trMatrix.filter((f: any) => f.status === 'NO_DIRECT_TURKISH_VALIDATION').length;

    expect(directCount + lexicalCount + relatedCount + noDirectCount).toBe(ontologyFacets.length);
    expect(ontologyFacets.length).toBe(84);

    const ontologySet = new Set(ontologyFacets.map((c: any) => c.facetId));
    const matrixSet = new Set(trMatrix.map((m: any) => m.facetId));

    expect(ontologySet.size).toBe(matrixSet.size);
    for (const id of ontologySet) {
      expect(matrixSet.has(id)).toBe(true);
    }
  });

  // 11. invalid sourceId fails schema validation
  it('11. invalid sourceId fails schema validation', () => {
    const sampleEntry = { ...trMatrix[0] };
    const invalidEntry = {
      ...sampleEntry,
      factorStructureEvidence: {
        ...sampleEntry.factorStructureEvidence,
        status: 'SUPPORTED',
        sourceId: '' // invalid empty sourceId for SUPPORTED status
      }
    };

    const parseResult = TurkishValidationEntrySchema.safeParse(invalidEntry);
    expect(parseResult.success).toBe(false);
    if (!parseResult.success) {
      const messages = parseResult.error.issues.map(i => i.message);
      expect(messages.some(m => m.includes('requires a non-empty sourceId'))).toBe(true);
    }
  });

  // 12. VERIFIED_EXACT without location fails validation
  it('12. VERIFIED_EXACT without location fails validation', () => {
    const sampleEntry = { ...trMatrix[0] };
    const invalidEntry = {
      ...sampleEntry,
      reliabilityEvidence: {
        ...sampleEntry.reliabilityEvidence,
        internalConsistency: {
          value: 0.85,
          metric: 'alpha',
          sourceId: 'src_gencoz_2000_panas',
          location: '', // Missing location
          claimVerificationStatus: 'VERIFIED_EXACT',
          verificationMethod: 'AI_ASSISTED_SOURCE_AUDIT',
          humanVerified: false
        }
      }
    };

    const parseResult = TurkishValidationEntrySchema.safeParse(invalidEntry);
    expect(parseResult.success).toBe(false);
    if (!parseResult.success) {
      const messages = parseResult.error.issues.map(i => i.message);
      expect(messages.some(m => m.includes('strictly require a non-empty location'))).toBe(true);
    }
  });

  // 13. VERIFIED_EXACT without verificationMethod fails validation
  it('13. VERIFIED_EXACT without verificationMethod fails validation', () => {
    const sampleEntry = { ...trMatrix[0] };
    const invalidEntry = {
      ...sampleEntry,
      reliabilityEvidence: {
        ...sampleEntry.reliabilityEvidence,
        internalConsistency: {
          value: 0.85,
          metric: 'alpha',
          sourceId: 'src_gencoz_2000_panas',
          location: 's. 240, Tablo 1',
          claimVerificationStatus: 'VERIFIED_EXACT',
          verificationMethod: 'NOT_VERIFIED', // Invalid for VERIFIED_EXACT
          humanVerified: false
        }
      }
    };

    const parseResult = TurkishValidationEntrySchema.safeParse(invalidEntry);
    expect(parseResult.success).toBe(false);
    if (!parseResult.success) {
      const messages = parseResult.error.issues.map(i => i.message);
      expect(messages.some(m => m.includes('strictly require an active verificationMethod'))).toBe(true);
    }
  });

  // 14. humanVerified is independent from VERIFIED_EXACT
  it('14. humanVerified is independent from VERIFIED_EXACT', () => {
    let exactClaimsCount = 0;
    let humanVerifiedCount = 0;

    trMatrix.forEach((f: any) => {
      const claims = [
        f.reliabilityEvidence.internalConsistency,
        f.reliabilityEvidence.testRetest,
        f.studyEvidence.sampleN
      ];
      claims.forEach((c: any) => {
        if (c.claimVerificationStatus === 'VERIFIED_EXACT') {
          exactClaimsCount++;
          if (c.humanVerified === true) humanVerifiedCount++;
          // Currently, claims are AI-audited; humanVerified must be explicitly false
          expect(c.humanVerified).toBe(false);
          expect(c.verificationMethod).toBe('AI_ASSISTED_SOURCE_AUDIT');
        }
      });
    });

    expect(exactClaimsCount).toBe(32);
    expect(humanVerifiedCount).toBe(0);
  });
});
