const fs = require('fs');

const pm = JSON.parse(fs.readFileSync('data/master-model/proposed-master-model.json', 'utf8'));
const cand = JSON.parse(fs.readFileSync('data/master-model/candidate-constructs.json', 'utf8'));
const cMap = new Map(cand.map(c => [c.candidateId, c]));

let facetIdx = 1;
pm.domains.forEach(d => {
  console.log(`\n=== Domain [${d.domainId}]: ${d.domainNameTr} (${d.domainNameEn}) ===`);
  d.constructs.forEach(c => {
    console.log(`  Construct [${c.constructId}]: ${c.nameTr} (${c.nameEn}) [Priority: ${c.priority}]`);
    c.facets.forEach(f => {
      const cd = cMap.get(f) || {};
      console.log(`    ${facetIdx++}. Facet [${f}]: ${cd.nameTr || f} | ${cd.nameEn || f} | safety: ${cd.clinicalSafetyClass || 'NON_CLINICAL'}`);
    });
  });
});
