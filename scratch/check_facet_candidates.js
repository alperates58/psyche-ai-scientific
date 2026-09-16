const fs = require('fs');

const pm = JSON.parse(fs.readFileSync('data/master-model/proposed-master-model.json', 'utf8'));
const cand = JSON.parse(fs.readFileSync('data/master-model/candidate-constructs.json', 'utf8'));
const cMap = new Map(cand.map(c => [c.candidateId, c]));

let missing = 0;
pm.domains.forEach(d => {
  d.constructs.forEach(c => {
    c.facets.forEach(f => {
      const cd = cMap.get(f);
      if (!cd) {
        console.log('Missing candidate for facet:', f, 'in construct:', c.constructId);
        missing++;
      } else {
        // Check if nameTr / definition exists
        // console.log(f, '-> nameTr:', cd.nameTr, 'definitionTr:', (cd.definitionTr || '').slice(0, 40));
      }
    });
  });
});
console.log('Total missing candidate entries:', missing);
