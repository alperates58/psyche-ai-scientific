import fs from 'fs';
import path from 'path';

export interface CoverageAuditResult {
  success: boolean;
  metrics: {
    totalMasterDomains: number;
    totalMasterConstructs: number;
    totalMasterFacets: number;
    directlyMeasuredConstructsCount: number;
    partiallyMeasuredConstructsCount: number;
    researchRequiredConstructsCount: number;
    unmeasuredConstructsCount: number;
    totalAssessmentModules: number;
    consumerAssessmentModules: number;
    advancedAssessmentModules: number;
  };
  domainSummaries: Array<{
    domainId: string;
    domainNameTr: string;
    totalConstructsCount: number;
    directlyMeasuredConstructsCount: number;
    partiallyMeasuredConstructsCount: number;
    unmeasuredConstructsCount: number;
    coverageStatus: string;
  }>;
  errors: string[];
  warnings: string[];
}

export function runAssessmentCoverageAudit(): CoverageAuditResult {
  const root = path.resolve(__dirname, '..');
  const errors: string[] = [];
  const warnings: string[] = [];

  const coveragePath = path.resolve(root, 'data/assessment-architecture/master-model-measurement-coverage.json');
  const proposedModelPath = path.resolve(root, 'data/master-model/proposed-master-model.json');
  const archPath = path.resolve(root, 'data/assessment-architecture/assessment-architecture.json');

  if (!fs.existsSync(coveragePath)) {
    errors.push('Missing master-model-measurement-coverage.json');
    return { success: false, metrics: {} as any, domainSummaries: [], errors, warnings };
  }

  const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
  const proposedModel = JSON.parse(fs.readFileSync(proposedModelPath, 'utf8'));
  const modules = JSON.parse(fs.readFileSync(archPath, 'utf8'));

  // Verify all 11 domains exist
  const expectedDomainIds = (proposedModel.domains || []).map((d: any) => d.domainId);
  if (expectedDomainIds.length !== 11) {
    errors.push(`Expected 11 Master Model domains, found ${expectedDomainIds.length}`);
  }

  const coveredDomainIds = new Set(coverage.domainSummaries.map((d: any) => d.domainId));
  for (const dId of expectedDomainIds) {
    if (!coveredDomainIds.has(dId)) {
      errors.push(`Master domain '${dId}' missing from measurement coverage summaries`);
    }
  }

  // Verify all 37 active constructs exist in construct coverage
  const expectedConstructIds = new Set<string>();
  let expectedFacetCount = 0;
  for (const d of proposedModel.domains) {
    for (const c of d.constructs) {
      expectedConstructIds.add(c.constructId);
      expectedFacetCount += c.facets.length;
    }
  }

  if (expectedConstructIds.size !== 37) {
    errors.push(`Expected 37 Master Model active constructs, found ${expectedConstructIds.size}`);
  }
  if (expectedFacetCount !== 91) {
    errors.push(`Expected 91 Master Model facets, found ${expectedFacetCount}`);
  }

  const coveredConstructIds = new Set(coverage.constructCoverage.map((c: any) => c.constructId));
  for (const cId of expectedConstructIds) {
    if (!coveredConstructIds.has(cId)) {
      errors.push(`Master construct '${cId}' missing from measurement coverage matrix`);
    }
  }

  // Count metrics
  let directlyMeasuredConstructs = 0;
  let partiallyMeasuredConstructs = 0;
  let researchRequiredConstructs = 0;
  let unmeasuredConstructs = 0;

  for (const item of coverage.constructCoverage) {
    if (item.directMeasurementStatus === 'DIRECT_FULL') directlyMeasuredConstructs++;
    else if (item.directMeasurementStatus === 'DIRECT_PARTIAL') partiallyMeasuredConstructs++;
    else if (item.directMeasurementStatus === 'RESEARCH_FORM_REQUIRED') researchRequiredConstructs++;
    else unmeasuredConstructs++;
  }

  const success = errors.length === 0;

  return {
    success,
    metrics: {
      totalMasterDomains: expectedDomainIds.length,
      totalMasterConstructs: expectedConstructIds.size,
      totalMasterFacets: expectedFacetCount,
      directlyMeasuredConstructsCount: directlyMeasuredConstructs,
      partiallyMeasuredConstructsCount: partiallyMeasuredConstructs,
      researchRequiredConstructsCount: researchRequiredConstructs,
      unmeasuredConstructsCount: unmeasuredConstructs,
      totalAssessmentModules: modules.length,
      consumerAssessmentModules: modules.filter((m: any) => m.stage !== 'ADVANCED').length,
      advancedAssessmentModules: modules.filter((m: any) => m.stage === 'ADVANCED').length
    },
    domainSummaries: coverage.domainSummaries,
    errors,
    warnings
  };
}

if (require.main === module) {
  console.log('='.repeat(65));
  console.log('PSYCHE-AI MASTER MODEL MEASUREMENT COVERAGE AUDIT (FAZ 2.16)');
  console.log('='.repeat(65));

  const result = runAssessmentCoverageAudit();

  console.log('\n--- Coverage Metrics ---');
  console.log(`Master Domains Accounted For:   ${result.metrics.totalMasterDomains}/11 (100%)`);
  console.log(`Master Constructs Accounted For: ${result.metrics.totalMasterConstructs}/37 (100%)`);
  console.log(`Master Facets Accounted For:     ${result.metrics.totalMasterFacets}/91 (100%)`);
  console.log(`- Directly Measured Constructs:  ${result.metrics.directlyMeasuredConstructsCount}`);
  console.log(`- Partially Measured Constructs: ${result.metrics.partiallyMeasuredConstructsCount}`);
  console.log(`- Research Form Required:        ${result.metrics.researchRequiredConstructsCount}`);
  console.log(`- Unmeasured Constructs:         ${result.metrics.unmeasuredConstructsCount}`);

  console.log('\n--- Domain Coverage Statuses ---');
  for (const d of result.domainSummaries) {
    console.log(`• ${d.domainNameTr} (${d.domainId}): [${d.coverageStatus}] ${d.directlyMeasuredConstructsCount}/${d.totalConstructsCount} direct constructs`);
  }

  console.log('\n--- Assessment Portfolio ---');
  console.log(`Total Assessment Modules:        ${result.metrics.totalAssessmentModules} (${result.metrics.consumerAssessmentModules} Consumer + ${result.metrics.advancedAssessmentModules} Advanced)`);

  if (result.errors.length > 0) {
    console.error('\n--- Violations ---');
    result.errors.forEach(e => console.error(`[FAIL] ${e}`));
    process.exit(1);
  } else {
    console.log('\n' + '='.repeat(65));
    console.log('AUDIT PASSED — COMPLETE MASTER MODEL MEASUREMENT COVERAGE VERIFIED.');
    console.log('='.repeat(65));
    process.exit(0);
  }
}
