const fs = require('fs');
const cand = JSON.parse(fs.readFileSync('data/master-model/candidate-constructs.json', 'utf8'));
const constructsJson = JSON.parse(fs.readFileSync('data/constructs.json', 'utf8'));

console.log('Sample candidate structure:', cand[12]);
console.log('Sample data/constructs.json structure:', constructsJson[0]);
