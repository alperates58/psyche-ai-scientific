const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'data', 'constructs.json');
const csvPath = path.join(__dirname, '..', 'data', 'constructs.csv');

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const headers = [
  'domainId',
  'domainName',
  'constructId',
  'constructName',
  'facetId',
  'facetName',
  'definition',
  'epistemicTier',
  'isOptionalModule',
  'primaryInstrumentId',
  'minItemsTarget',
  'standardFormTarget',
  'maxBankTarget'
];

const rows = [headers.join(',')];

for (const c of data) {
  const row = [
    c.domainId,
    `"${c.domainName}"`,
    c.constructId,
    `"${c.constructName}"`,
    c.facetId,
    `"${c.facetName}"`,
    `"${c.definition.replace(/"/g, '""')}"`,
    c.epistemicTier,
    c.isOptionalModule,
    c.primaryInstrumentId,
    c.designTargets.minimum_items_target,
    c.designTargets.initial_standard_form_target,
    c.designTargets.maximum_research_bank_target
  ];
  rows.push(row.join(','));
}

fs.writeFileSync(csvPath, rows.join('\n'), 'utf8');
console.log('Successfully generated constructs.csv with', data.length, 'records.');
