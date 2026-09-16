const fs = require('fs');
const path = require('path');

/**
 * 91 Facet Blueprint Definitions Builder
 */
const { BLUEPRINTS_MAP } = require('./blueprints_raw_map.js');

const blueprintsList = Object.values(BLUEPRINTS_MAP);
console.log(`Loaded ${blueprintsList.length} facet blueprints.`);

if (blueprintsList.length !== 91) {
  console.error(`ERROR: Expected 91 blueprints, got ${blueprintsList.length}`);
  process.exit(1);
}

fs.writeFileSync(
  path.join(__dirname, 'blueprints_data.js'),
  `/**\n * FAZ 2.16.1 — 91 MASTER FACET MEASUREMENT BLUEPRINTS\n */\n\nconst FACET_BLUEPRINTS = ${JSON.stringify(blueprintsList, null, 2)};\n\nmodule.exports = { FACET_BLUEPRINTS };\n`,
  'utf8'
);

console.log('✓ blueprints_data.js successfully written.');
