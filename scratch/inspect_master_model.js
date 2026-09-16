const fs = require('fs');
const path = require('path');

const proposedModel = JSON.parse(fs.readFileSync('data/master-model/proposed-master-model.json', 'utf8'));
const candidateConstructs = JSON.parse(fs.readFileSync('data/master-model/candidate-constructs.json', 'utf8'));
const sources = JSON.parse(fs.readFileSync('data/master-model/master-model-sources.json', 'utf8'));
const sourceRegistry = JSON.parse(fs.readFileSync('data/source-registry.json', 'utf8'));
const masterItemBank = JSON.parse(fs.readFileSync('data/master-item-bank.json', 'utf8'));
const assessmentArch = JSON.parse(fs.readFileSync('data/assessment-architecture/assessment-architecture.json', 'utf8'));

console.log('--- Master Model Breakdown ---');
console.log(`Domains: ${proposedModel.domains.length}`);
let totalConstructs = 0;
let totalFacets = 0;

const candidateMap = new Map();
candidateConstructs.forEach(c => candidateMap.set(c.candidateId, c));

const sourceMap = new Map();
sources.forEach(s => sourceMap.set(s.sourceId, s));
sourceRegistry.forEach(s => sourceMap.set(s.id, s));

proposedModel.domains.forEach(domain => {
  console.log(`\nDomain: [${domain.domainId}] ${domain.domainNameTr} (${domain.domainNameEn}) - ${domain.constructs.length} constructs`);
  totalConstructs += domain.constructs.length;
  domain.constructs.forEach(construct => {
    totalFacets += construct.facets.length;
    console.log(`  Construct: [${construct.constructId}] ${construct.nameTr} (${construct.nameEn}) - Priority: ${construct.priority} - ${construct.facets.length} facets`);
    construct.facets.forEach(facetId => {
      const cand = candidateMap.get(facetId) || candidateMap.get(construct.constructId);
      const facetNameTr = cand?.nameTr || facetId;
      const facetNameEn = cand?.nameEn || facetId;
      console.log(`    Facet: [${facetId}] ${facetNameTr} (${facetNameEn})`);
    });
  });
});

console.log(`\nTotal Domains: ${proposedModel.domains.length}`);
console.log(`Total Constructs: ${totalConstructs}`);
console.log(`Total Facets: ${totalFacets}`);
console.log(`Master Item Bank Items: ${masterItemBank.length}`);
console.log(`Assessment Architecture Modules: ${assessmentArch.length}`);
