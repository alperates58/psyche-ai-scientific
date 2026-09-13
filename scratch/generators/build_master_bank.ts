import fs from 'fs';
import path from 'path';
import { lintItemBank, analyzeSemanticClusters } from '../../src/research/item-quality';

const constructs = require('../../data/constructs.json');

// Import all batches
const batchA = require('./batchA_corePersonality.js');
const batchB = require('./batchB_selfSystem.js');
const batchC = require('./batchC_emotionRegulation.js');
const batchD = require('./batchD_cognitionDecision.js');
const batchE = require('./batchE_selfRegulation.js');
const batchF = require('./batchF_motivationValues.js');
const batchG = require('./batchG_socialRelational.js');
const batchH = require('./batchH_responseIntegrity.js');
const batchI = require('./batchI_darkTetrad.js');

const allBatches = [
  batchA,
  batchB,
  batchC,
  batchD,
  batchE,
  batchF,
  batchG,
  batchH,
  batchI
];

const masterItems: any[] = [];
const batchSummaries: any[] = [];

for (const b of allBatches) {
  masterItems.push(...b.items);
  const lintRes = lintItemBank(b.items);
  batchSummaries.push({
    batchName: b.batchName,
    itemCount: b.items.length,
    cleanCount: lintRes.summary.cleanItemsCount,
    flaggedCount: lintRes.summary.flaggedItemsCount,
    criticalCount: lintRes.summary.criticalIssuesCount,
    avgScore: lintRes.summary.averageQualityScore
  });
}

console.log('=== BATCH QUALITY AUDIT ===');
console.table(batchSummaries);

// Check facet coverage against constructs.json
const coveredFacetIds = new Set(masterItems.map(it => it.facetId));
const ontologyFacetIds = constructs.map((c: any) => c.facetId);
const missingFacets = ontologyFacetIds.filter((id: string) => !coveredFacetIds.has(id));

console.log('\n=== ONTOLOGY COVERAGE ===');
console.log(`Total Facets in Constructs Ontology: ${ontologyFacetIds.length}`);
console.log(`Covered Facets in Master Bank: ${coveredFacetIds.size}`);
if (missingFacets.length > 0) {
  console.error(`Missing Facets (${missingFacets.length}):`, missingFacets);
} else {
  console.log('ALL 84 FACETS ARE 100% COVERED IN THE MASTER ITEM BANK!');
}

// Global Linter Run
const globalLint = lintItemBank(masterItems);
console.log('\n=== GLOBAL LINTER REPORT ===');
console.log(`Total Scanned: ${globalLint.summary.totalItemsScanned}`);
console.log(`Clean Items: ${globalLint.summary.cleanItemsCount} (${Math.round((globalLint.summary.cleanItemsCount / globalLint.summary.totalItemsScanned) * 100)}%)`);
console.log(`Flagged Items: ${globalLint.summary.flaggedItemsCount}`);
console.log(`Critical Issues: ${globalLint.summary.criticalIssuesCount}`);
console.log(`Average Quality Score: ${globalLint.summary.averageQualityScore} / 100`);
console.log('Warnings By Rule:', globalLint.summary.warningsByRule);

// Semantic Duplicate Analysis
const semanticReport = analyzeSemanticClusters(
  masterItems.map(it => ({ id: it.id, facetId: it.facetId, text_tr: it.text_tr })),
  0.70
);

console.log('\n=== SEMANTIC DUPLICATE ANALYSIS ===');
console.log(`Total Near-Duplicate Pairs Detected (Threshold >= 0.70): ${semanticReport.totalDuplicatesDetected}`);
if (semanticReport.totalDuplicatesDetected > 0) {
  console.log('Sample Duplicate Pairs:', semanticReport.duplicatePairs.slice(0, 3));
}

// Ensure unique Item IDs
const idSet = new Set();
const duplicateIds: string[] = [];
for (const it of masterItems) {
  if (idSet.has(it.id)) {
    duplicateIds.push(it.id);
  }
  idSet.add(it.id);
}
if (duplicateIds.length > 0) {
  console.error('ERROR: Duplicate Item IDs found:', duplicateIds);
  process.exit(1);
} else {
  console.log(`All ${masterItems.length} Item IDs are strictly unique!`);
}

// Save to data/master-item-bank.json
const outputPath = path.resolve(__dirname, '../../data/master-item-bank.json');
fs.writeFileSync(outputPath, JSON.stringify(masterItems, null, 2), 'utf8');
console.log(`\nSuccessfully saved ${masterItems.length} candidate items to data/master-item-bank.json`);
