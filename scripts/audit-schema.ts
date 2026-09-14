import fs from 'fs';
import path from 'path';
import { TurkishValidationMatrixSchema } from '../src/schemas/validationMatrixSchema';

export function runSchemaAudit(): { success: boolean; metrics: any; errors: string[] } {
  const root = path.resolve(__dirname, '..');
  const matrixPath = path.resolve(root, 'research/turkish-validation-matrix.json');
  const constructsPath = path.resolve(root, 'data/constructs.json');
  const sourcesPath = path.resolve(root, 'data/source-registry.json');

  const errors: string[] = [];

  const trMatrix = JSON.parse(fs.readFileSync(matrixPath, 'utf8'));
  const ontologyFacets = JSON.parse(fs.readFileSync(constructsPath, 'utf8'));
  const sources = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));

  // 1. Ontology uniqueness & bidirectional set equality
  const ontologyIds = ontologyFacets.map((c: any) => c.facetId);
  const matrixIds = trMatrix.map((m: any) => m.facetId);

  const ontologyIdSet = new Set(ontologyIds);
  const matrixIdSet = new Set(matrixIds);

  if (ontologyIds.length !== ontologyIdSet.size) {
    errors.push(`Duplicate facetId found in constructs.json (${ontologyIds.length} items, ${ontologyIdSet.size} unique)`);
  }
  if (matrixIds.length !== matrixIdSet.size) {
    errors.push(`Duplicate facetId found in turkish-validation-matrix.json (${matrixIds.length} items, ${matrixIdSet.size} unique)`);
  }

  const missingInMatrix = ontologyIds.filter((id: string) => !matrixIdSet.has(id));
  const unexpectedInMatrix = matrixIds.filter((id: string) => !ontologyIdSet.has(id));

  if (missingInMatrix.length > 0) {
    errors.push(`Facets in ontology but missing from matrix: ${missingInMatrix.join(', ')}`);
  }
  if (unexpectedInMatrix.length > 0) {
    errors.push(`Facets in matrix but missing from ontology: ${unexpectedInMatrix.join(', ')}`);
  }

  const totalOntologyFacets = ontologyIdSet.size;

  // 2. Invariant: Status counts sum to total ontology facets
  const directFacets = trMatrix.filter((f: any) => f.status === 'DIRECT_FACET_VALIDATION');
  const lexicalFacets = trMatrix.filter((f: any) => f.status === 'LEXICAL_SUPPORT_ONLY');
  const relatedFacets = trMatrix.filter((f: any) => f.status === 'RELATED_MEASURE_VALIDATION');
  const noDirectFacets = trMatrix.filter((f: any) => f.status === 'NO_DIRECT_TURKISH_VALIDATION');

  const sumOfStatuses = directFacets.length + lexicalFacets.length + relatedFacets.length + noDirectFacets.length;
  if (sumOfStatuses !== totalOntologyFacets) {
    errors.push(`Status counts sum (${sumOfStatuses}) does not match ontology total (${totalOntologyFacets})`);
  }

  // 3. Prohibition of sampleN under reliabilityEvidence
  let forbiddenSampleNCount = 0;
  trMatrix.forEach((f: any) => {
    if (f.reliabilityEvidence && 'sampleN' in f.reliabilityEvidence) {
      forbiddenSampleNCount++;
      errors.push(`Facet ${f.facetId} contains forbidden reliabilityEvidence.sampleN`);
    }
  });

  // 4. Source ID validity across all references
  const validSourceIds = new Set(sources.map((s: any) => s.sourceId));

  trMatrix.forEach((f: any) => {
    // sourceIds array
    if (f.sourceIds && Array.isArray(f.sourceIds)) {
      f.sourceIds.forEach((sid: string) => {
        if (!validSourceIds.has(sid)) {
          errors.push(`Facet ${f.facetId} references unregistered sourceId in sourceIds: ${sid}`);
        }
      });
    }

    // claims sourceIds
    const claims = [
      f.reliabilityEvidence?.internalConsistency,
      f.reliabilityEvidence?.testRetest,
      f.studyEvidence?.sampleN
    ];
    claims.forEach((c: any) => {
      if (c && c.sourceId && !validSourceIds.has(c.sourceId)) {
        errors.push(`Facet ${f.facetId} references unregistered sourceId in claim: ${c.sourceId}`);
      }
    });

    // factorStructureEvidence sourceId
    if (f.factorStructureEvidence?.sourceId && !validSourceIds.has(f.factorStructureEvidence.sourceId)) {
      errors.push(`Facet ${f.facetId} references unregistered sourceId in factorStructureEvidence: ${f.factorStructureEvidence.sourceId}`);
    }

    // supportingEvidence sourceIds
    if (f.supportingEvidence && Array.isArray(f.supportingEvidence)) {
      f.supportingEvidence.forEach((se: any) => {
        if (!validSourceIds.has(se.sourceId)) {
          errors.push(`Facet ${f.facetId} references unregistered sourceId in supportingEvidence: ${se.sourceId}`);
        }
      });
    }
  });

  // 5. DIRECT validations: verified Turkish source + alignment level
  directFacets.forEach((f: any) => {
    if (!f.measurementAlignmentLevel || f.measurementAlignmentLevel === 'NOT_APPLICABLE') {
      errors.push(`DIRECT facet ${f.facetId} is missing valid measurementAlignmentLevel`);
    }
    const hasVerifiedTr = f.sourceIds.some((sid: string) => {
      const src = sources.find((s: any) => s.sourceId === sid);
      return src && (src.isTurkishAdaptation || src.language === 'tr') && src.evidenceScope === 'DIRECT_FACET';
    });
    if (!hasVerifiedTr) {
      errors.push(`DIRECT facet ${f.facetId} does not have a registered direct Turkish adaptation source`);
    }
  });

  // 6. Lexical facets: factorStructureEvidence.status must be NOT_ASSESSED
  lexicalFacets.forEach((f: any) => {
    if (f.factorStructureEvidence?.status !== 'NOT_ASSESSED') {
      errors.push(`LEXICAL facet ${f.facetId} claims factorStructureEvidence.status: ${f.factorStructureEvidence?.status}`);
    }
    if (f.factorStructureEvidence?.level !== 'FACET') {
      errors.push(`LEXICAL facet ${f.facetId} claims factorStructureEvidence.level: ${f.factorStructureEvidence?.level}`);
    }
    if (f.studyEvidence?.sampleN?.value !== null) {
      errors.push(`LEXICAL facet ${f.facetId} has non-null sampleN in studyEvidence: ${f.studyEvidence?.sampleN?.value}`);
    }
    const broadEvidence = f.supportingEvidence?.find((se: any) => se.sourceId === 'src_wasti_2008');
    if (!broadEvidence || broadEvidence.appliesToLevel !== 'BROAD_FACTOR') {
      errors.push(`LEXICAL facet ${f.facetId} is missing BROAD_FACTOR supportingEvidence`);
    }
  });

  // 7. Zod schema validation
  const zodResult = TurkishValidationMatrixSchema.safeParse(trMatrix);
  if (!zodResult.success) {
    errors.push(`Zod validation error: ${JSON.stringify(zodResult.error.format())}`);
  }

  // 8. Metrics calculation
  const broadFactorEvidenceCount = trMatrix.reduce((acc: number, f: any) => {
    const broad = f.supportingEvidence?.filter((se: any) => se.appliesToLevel === 'BROAD_FACTOR').length || 0;
    return acc + broad;
  }, 0);

  const scaleTotalCount = trMatrix.filter((f: any) => f.factorStructureEvidence?.level === 'SCALE_TOTAL').length;
  const subscaleCount = trMatrix.filter((f: any) => f.factorStructureEvidence?.level === 'SUBSCALE').length;
  const facetLevelCount = trMatrix.filter((f: any) => f.factorStructureEvidence?.level === 'FACET').length;
  const notAssessedFactorCount = trMatrix.filter((f: any) => f.factorStructureEvidence?.status === 'NOT_ASSESSED').length;

  const exactFacetAlignmentCount = directFacets.filter((f: any) => f.measurementAlignmentLevel === 'EXACT_FACET').length;
  const subscaleAlignmentCount = directFacets.filter((f: any) => f.measurementAlignmentLevel === 'SUBSCALE_ALIGNED').length;
  const constructAlignmentCount = directFacets.filter((f: any) => f.measurementAlignmentLevel === 'CONSTRUCT_ALIGNED').length;

  const sampleNInStudyEvidenceCount = trMatrix.filter((f: any) => f.studyEvidence?.sampleN !== undefined).length;

  const metrics = {
    totalOntologyFacets,
    totalMatrixFacets: trMatrix.length,
    statusDistribution: {
      DIRECT: directFacets.length,
      LEXICAL: lexicalFacets.length,
      RELATED: relatedFacets.length,
      NO_DIRECT: noDirectFacets.length
    },
    sampleNRemovedFromReliability: totalOntologyFacets - forbiddenSampleNCount,
    sampleNInStudyEvidence: sampleNInStudyEvidenceCount,
    factorStructureLevels: {
      BROAD_FACTOR: broadFactorEvidenceCount,
      SCALE_TOTAL: scaleTotalCount,
      SUBSCALE: subscaleCount,
      FACET: facetLevelCount,
      NOT_ASSESSED: notAssessedFactorCount
    },
    directAlignmentDistribution: {
      EXACT_FACET: exactFacetAlignmentCount,
      SUBSCALE_ALIGNED: subscaleAlignmentCount,
      CONSTRUCT_ALIGNED: constructAlignmentCount
    }
  };

  return {
    success: errors.length === 0,
    metrics,
    errors
  };
}

if (require.main === module) {
  console.log('Running FAZ 2.4 Schema & Epistemic Audit...\n');
  const result = runSchemaAudit();

  if (!result.success) {
    console.error('❌ SCHEMA AUDIT FAILED with errors:');
    result.errors.forEach((err, idx) => console.error(`  ${idx + 1}. ${err}`));
    process.exit(1);
  }

  console.log(`✅ SCHEMA AUDIT PASSED: All ${result.metrics.totalOntologyFacets} facets comply with canonical FAZ 2.4 schema.`);
  console.log('Metrics Summary:');
  console.log(JSON.stringify(result.metrics, null, 2));
}
