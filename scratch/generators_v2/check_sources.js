const { SCIENTIFIC_SOURCES } = require('./sources_data');
const bp = JSON.parse(require('fs').readFileSync('data/research-battery/facet-measurement-blueprints-v1.json', 'utf8'));

const existingSourceIds = new Set(SCIENTIFIC_SOURCES.map(s => s.sourceId));

const missing = new Set();
bp.blueprints.forEach(b => {
  const refs = [...(b.primarySourceIds || []), ...(b.secondarySourceIds || []), ...(b.turkishEvidenceSourceIds || [])];
  refs.forEach(r => {
    if (!existingSourceIds.has(r)) {
      missing.add(r);
    }
  });
});

console.log("Missing Source IDs Count:", missing.size);
console.log("Missing Source IDs:", Array.from(missing).sort());
