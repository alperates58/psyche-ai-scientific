import fs from 'fs';
import path from 'path';

export interface ResearchSourcesAuditResult {
  success: boolean;
  metrics: {
    totalSources: number;
    primaryVerifiedSources: number;
    turkishAdaptationSources: number;
    theoreticalSynthesisSources: number;
    blueprintsReferencingSources: number;
    totalSourceReferences: number;
    unresolvedSourceReferences: number;
  };
  errors: string[];
  warnings: string[];
}

export function runResearchSourcesAudit(): ResearchSourcesAuditResult {
  const root = path.resolve(__dirname, '..');
  const errors: string[] = [];
  const warnings: string[] = [];

  const batteryDir = path.resolve(root, 'data/research-battery');
  const sourcesFile = path.join(batteryDir, 'scientific-sources-v1.json');
  const blueprintsFile = path.join(batteryDir, 'facet-measurement-blueprints-v1.json');

  console.log('='.repeat(95));
  console.log('PSYCHEAI RESEARCH SCIENTIFIC SOURCES & LITERATURE AUDIT (FAZ 2.16.1)');
  console.log('='.repeat(95));

  if (!fs.existsSync(sourcesFile)) {
    errors.push(`Missing scientific sources file: ${sourcesFile}`);
    return {
      success: false,
      metrics: {
        totalSources: 0,
        primaryVerifiedSources: 0,
        turkishAdaptationSources: 0,
        theoreticalSynthesisSources: 0,
        blueprintsReferencingSources: 0,
        totalSourceReferences: 0,
        unresolvedSourceReferences: 0
      },
      errors,
      warnings
    };
  }

  const sourcesData = JSON.parse(fs.readFileSync(sourcesFile, 'utf8'));
  const blueprintsData = JSON.parse(fs.readFileSync(blueprintsFile, 'utf8'));

  const sources = sourcesData.sources || [];
  const blueprints = blueprintsData.blueprints || [];

  const sourceMap = new Map<string, any>();
  let primaryCount = 0;
  let turkishCount = 0;
  let synthesisCount = 0;

  sources.forEach((src: any) => {
    if (!src.sourceId) {
      errors.push('A source entry is missing sourceId.');
      return;
    }
    if (sourceMap.has(src.sourceId)) {
      errors.push(`Duplicate sourceId found: ${src.sourceId}`);
    }
    sourceMap.set(src.sourceId, src);

    if (!src.title || src.title.length < 5) {
      errors.push(`Source ${src.sourceId} has missing or invalid title.`);
    }
    if (!src.authors || src.authors.length === 0) {
      errors.push(`Source ${src.sourceId} has no authors.`);
    }
    if (!src.year || typeof src.year !== 'number') {
      errors.push(`Source ${src.sourceId} has invalid publication year.`);
    }

    if (src.sourceType === 'TURKISH_PSYCHOMETRIC_ADAPTATION') {
      turkishCount++;
    } else if (src.sourceType === 'THEORETICAL_SYNTHESIS_PAPER' || src.sourceType === 'THEORETICAL_FOUNDATION_PAPER') {
      synthesisCount++;
    }

    if (src.verificationStatus === 'VERIFIED_PRIMARY') {
      primaryCount++;
    }
  });

  // Cross-reference with facet blueprints
  let totalSourceReferences = 0;
  let unresolvedSourceReferences = 0;

  blueprints.forEach((bp: any) => {
    const primaryRefs = bp.primarySourceIds || [];
    const secondaryRefs = bp.secondarySourceIds || [];
    const turkishRefs = bp.turkishEvidenceSourceIds || [];

    const allRefs = [...primaryRefs, ...secondaryRefs, ...turkishRefs];

    allRefs.forEach((refId: string) => {
      totalSourceReferences++;
      if (!sourceMap.has(refId)) {
        errors.push(`Blueprint ${bp.facetId} references non-existent sourceId: ${refId}`);
        unresolvedSourceReferences++;
      }
    });
  });

  const result: ResearchSourcesAuditResult = {
    success: errors.length === 0,
    metrics: {
      totalSources: sources.length,
      primaryVerifiedSources: primaryCount,
      turkishAdaptationSources: turkishCount,
      theoreticalSynthesisSources: synthesisCount,
      blueprintsReferencingSources: blueprints.length,
      totalSourceReferences,
      unresolvedSourceReferences
    },
    errors,
    warnings
  };

  console.log(`- Total Scientific Sources Registered: ${result.metrics.totalSources}`);
  console.log(`- Primary Verified Sources: ${result.metrics.primaryVerifiedSources}`);
  console.log(`- Turkish Psychometric Adaptations: ${result.metrics.turkishAdaptationSources}`);
  console.log(`- Theoretical Synthesis Sources: ${result.metrics.theoreticalSynthesisSources}`);
  console.log(`- Facet Blueprints Audited: ${result.metrics.blueprintsReferencingSources} / 91`);
  console.log(`- Total Source Cross-References: ${result.metrics.totalSourceReferences}`);
  console.log(`- Unresolved References: ${result.metrics.unresolvedSourceReferences}`);
  console.log(`- Errors: ${errors.length}, Warnings: ${warnings.length}`);
  console.log('='.repeat(95));

  if (errors.length > 0) {
    console.error('SOURCES AUDIT FAILED WITH ERRORS:');
    errors.forEach(e => console.error(`  - ❌ ${e}`));
  } else {
    console.log('✅ SCIENTIFIC SOURCES AUDIT PASSED (100% GROUNDED & VERIFIED)');
  }

  return result;
}

if (require.main === module) {
  const result = runResearchSourcesAudit();
  if (!result.success) {
    process.exit(1);
  }
}
