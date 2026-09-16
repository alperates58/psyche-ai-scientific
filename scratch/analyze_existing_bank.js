const fs = require('fs');

const masterItemBank = JSON.parse(fs.readFileSync('data/master-item-bank.json', 'utf8'));
const proposedModel = JSON.parse(fs.readFileSync('data/master-model/proposed-master-model.json', 'utf8'));

console.log('Total items in master-item-bank.json:', masterItemBank.length);

const facetSet = new Set();
proposedModel.domains.forEach(d => {
  d.constructs.forEach(c => {
    c.facets.forEach(f => facetSet.add(f));
  });
});

console.log('Total facets in proposed master model:', facetSet.size);

const itemsByFacet = new Map();
masterItemBank.forEach(item => {
  const f = item.facetId || item.primaryFacet;
  if (!itemsByFacet.has(f)) itemsByFacet.set(f, []);
  itemsByFacet.get(f).push(item);
});

console.log('Facets represented in existing bank:', itemsByFacet.size);

let coveredFacets = 0;
let emptyFacets = 0;
for (const f of facetSet) {
  const items = itemsByFacet.get(f) || [];
  if (items.length > 0) {
    coveredFacets++;
  } else {
    emptyFacets++;
    console.log('Facet with NO items in existing bank:', f);
  }
}

console.log(`Covered facets: ${coveredFacets}/${facetSet.size}, Empty facets: ${emptyFacets}`);

// Check sample item structure
console.log('\nSample item:', JSON.stringify(masterItemBank[0], null, 2));
