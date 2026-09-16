const fs = require('fs');
const cand = JSON.parse(fs.readFileSync('data/master-model/candidate-constructs.json', 'utf8'));
const baseline = JSON.parse(fs.readFileSync('data/master-model/current-ontology-baseline.json', 'utf8'));
const crosswalk = JSON.parse(fs.readFileSync('data/master-model/current-to-master-crosswalk.json', 'utf8'));

console.log('Candidate constructs count:', cand.length);
console.log('Sample candidate IDs:', cand.slice(0, 15).map(c => ({ id: c.candidateId, nameTr: c.nameTr, entityType: c.entityType })));
console.log('Baseline facets sample:', baseline.facets.slice(0, 10).map(f => ({ id: f.facetId, nameTr: f.nameTr })));
