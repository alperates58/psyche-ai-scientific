const fs = require('fs');

const masterItemBank = JSON.parse(fs.readFileSync('data/master-item-bank.json', 'utf8'));
const crosswalk = JSON.parse(fs.readFileSync('data/master-model/current-to-master-crosswalk.json', 'utf8'));
const proposedModel = JSON.parse(fs.readFileSync('data/master-model/proposed-master-model.json', 'utf8'));

console.log('Crosswalk entries count:', crosswalk.length);

const crosswalkMap = new Map();
crosswalk.forEach(c => {
  crosswalkMap.set(c.currentEntityId, c);
});

// Check facet mapping of all 832 items
const facetCountsInBank = {};
masterItemBank.forEach(item => {
  const f = item.facetId;
  facetCountsInBank[f] = (facetCountsInBank[f] || 0) + 1;
});

console.log('Unique facets in masterItemBank:', Object.keys(facetCountsInBank).length);
console.log('Facet counts sample:', Object.entries(facetCountsInBank).slice(0, 20));
