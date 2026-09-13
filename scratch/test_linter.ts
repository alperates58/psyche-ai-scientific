import { lintItemBank } from '../src/research/item-quality';
const b = require('./generators/batchA_corePersonality.js');

const result = lintItemBank(b.items);
console.log('Batch A Items Count:', b.items.length);
console.log('Linter Summary for Batch A:', result.summary);
