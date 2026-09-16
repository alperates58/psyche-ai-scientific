import fs from 'fs';
import path from 'path';

// Output Directory
const rootDir = path.resolve(__dirname, '..');
const masterModelDir = path.resolve(rootDir, 'data/master-model');

if (!fs.existsSync(masterModelDir)) {
  fs.mkdirSync(masterModelDir, { recursive: true });
}

console.log('🚀 Generating FAZ 2.14 Master Psychological Model Data Artifacts...');

// =============================================================================
// 1. GENERATE CURRENT ONTOLOGY BASELINE REPORT
// =============================================================================
const constructsPath = path.resolve(rootDir, 'data/constructs.json');
const sourcesPath = path.resolve(rootDir, 'data/source-registry.json');
const instrumentsPath = path.resolve(rootDir, 'data/instrument-registry.json');
const trMatrixPath = path.resolve(rootDir, 'research/turkish-validation-matrix.json');

const currentFacetsRaw = JSON.parse(fs.readFileSync(constructsPath, 'utf8'));
const currentSourcesRaw = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));
const currentInstrumentsRaw = JSON.parse(fs.readFileSync(instrumentsPath, 'utf8'));
const currentTrMatrixRaw = JSON.parse(fs.readFileSync(trMatrixPath, 'utf8'));

// Build lookup maps
const trMatrixMap = new Map(currentTrMatrixRaw.map((m: any) => [m.facetId, m]));
const instrumentMap = new Map(currentInstrumentsRaw.map((i: any) => [i.instrumentId, i]));

// Extract unique domains and constructs dynamically
const domainMap = new Map<string, { domainId: string; domainNameTr: string; domainNameEn: string; constructIds: Set<string>; facetCount: number }>();
const constructMap = new Map<string, { constructId: string; constructNameTr: string; constructNameEn: string; domainId: string; facetIds: string[] }>();

function parseTrEn(combined: string): { tr: string; en: string } {
  const match = combined.match(/^(.*?)\s*\((.*?)\)$/);
  if (match) {
    return { en: match[1].trim(), tr: match[2].trim() };
  }
  return { en: combined, tr: combined };
}

for (const f of currentFacetsRaw) {
  const { tr: domainTr, en: domainEn } = parseTrEn(f.domainName || f.domainId);
  if (!domainMap.has(f.domainId)) {
    domainMap.set(f.domainId, {
      domainId: f.domainId,
      domainNameTr: domainTr,
      domainNameEn: domainEn,
      constructIds: new Set(),
      facetCount: 0
    });
  }
  const dom = domainMap.get(f.domainId)!;
  dom.constructIds.add(f.constructId);
  dom.facetCount++;

  const { tr: constructTr, en: constructEn } = parseTrEn(f.constructName || f.constructId);
  if (!constructMap.has(f.constructId)) {
    constructMap.set(f.constructId, {
      constructId: f.constructId,
      constructNameTr: constructTr,
      constructNameEn: constructEn,
      domainId: f.domainId,
      facetIds: []
    });
  }
  constructMap.get(f.constructId)!.facetIds.push(f.facetId);
}

const baselineFacets = currentFacetsRaw.map((f: any) => {
  const { tr: facetTr, en: facetEn } = parseTrEn(f.facetName);
  const { tr: constructTr, en: constructEn } = parseTrEn(f.constructName);
  const { tr: domainTr, en: domainEn } = parseTrEn(f.domainName);
  const trEvidence = trMatrixMap.get(f.facetId) as any;
  const inst = instrumentMap.get(f.primaryInstrumentId) as any;

  return {
    facetId: f.facetId,
    canonicalNameEn: facetEn,
    canonicalNameTr: facetTr,
    definition: f.definition,
    parentHierarchy: {
      domainId: f.domainId,
      domainNameEn: domainEn,
      domainNameTr: domainTr,
      constructId: f.constructId,
      constructNameEn: constructEn,
      constructNameTr: constructTr
    },
    measurementStatus: f.isOptionalModule ? 'OPTIONAL_MODULE' : 'CORE_BATTERY',
    liveStatus: f.epistemicTier === 'A' ? 'LIVE' : 'RESEARCH_ONLY',
    epistemicTier: f.epistemicTier || 'B',
    currentInstrumentMapping: {
      instrumentId: f.primaryInstrumentId || null,
      instrumentName: inst?.name || null,
      licenseDecision: inst?.decision || 'UNKNOWN'
    },
    currentGlobalEvidenceLevel: f.epistemicTier === 'A' ? 'STRONG' : 'MODERATE',
    currentTurkishEvidence: {
      status: trEvidence?.status || 'NO_DIRECT_TURKISH_VALIDATION',
      measurementAlignmentLevel: trEvidence?.measurementAlignmentLevel || 'NOT_ASSESSED',
      factorStructureLevel: trEvidence?.factorStructureEvidence?.level || 'NOT_ASSESSED',
      sourceIds: trEvidence?.sourceIds || []
    },
    visualizationAvailability: f.domainId === 'core_personality' ? ['RADAR', 'FACET_PROFILE', 'HEATMAP', 'FINGERPRINT'] : ['HEATMAP', 'FINGERPRINT', 'BAR_GRID']
  };
});

const baselineDomains = Array.from(domainMap.values()).map(d => ({
  domainId: d.domainId,
  domainNameEn: d.domainNameEn,
  domainNameTr: d.domainNameTr,
  constructCount: d.constructIds.size,
  facetCount: d.facetCount,
  constructIds: Array.from(d.constructIds),
  status: d.domainId === 'optional_dark_tetrad' ? 'OPTIONAL_EXPANSION' : (d.domainId === 'response_integrity' ? 'MEASUREMENT_QUALITY' : 'CORE_ACTIVE')
}));

const baselineConstructs = Array.from(constructMap.values()).map(c => ({
  constructId: c.constructId,
  constructNameEn: c.constructNameEn,
  constructNameTr: c.constructNameTr,
  domainId: c.domainId,
  facetCount: c.facetIds.length,
  facetIds: c.facetIds,
  measurementStatus: c.constructId.startsWith('dark_') ? 'OPTIONAL_RESEARCH' : 'ACTIVE_MEASUREMENT'
}));

const currentOntologyBaseline = {
  baselineMetadata: {
    generatedAt: "2026-09-16T20:45:00Z",
    sourceOfTruthFiles: [
      "data/constructs.json",
      "data/source-registry.json",
      "data/instrument-registry.json",
      "research/turkish-validation-matrix.json"
    ],
    invariants: {
      totalDomains: baselineDomains.length,
      totalConstructs: baselineConstructs.length,
      totalFacets: baselineFacets.length
    }
  },
  domains: baselineDomains,
  constructs: baselineConstructs,
  facets: baselineFacets
};

fs.writeFileSync(
  path.resolve(masterModelDir, 'current-ontology-baseline.json'),
  JSON.stringify(currentOntologyBaseline, null, 2),
  'utf8'
);
console.log(`✅ Generated current-ontology-baseline.json: ${baselineDomains.length} domains, ${baselineConstructs.length} constructs, ${baselineFacets.length} facets.`);

// We continue building other artifacts via dedicated modular generators
