/**
 * PsycheAI FAZ 2.19 — Theory Sources & Lenses Audit Script
 *
 * Validates integrity of:
 * - 10 supported theoretical lenses
 * - Academic source registry and citations
 * - Allowed concept mappings to Master Model domains
 */

import lensesData from '../data/theory-lenses/theory-lenses-v1.json';
import sourcesData from '../data/theory-lenses/theory-sources-v1.json';
import { ALL_THEORY_LENS_IDS, TheoryLensId } from '../src/types/theoryLens';

async function runAudit() {
  console.log('====================================================');
  console.log('FAZ 2.19 — THEORY SOURCES & LENSES AUDIT');
  console.log('====================================================\n');

  let passed = true;

  // 1. Verify 10 Lenses Presence
  console.log(`[1] Verifying 10 Theory Lenses Registry...`);
  const lenses = lensesData as any[];
  console.log(`- Loaded ${lenses.length} lenses.`);

  if (lenses.length !== 10) {
    console.error(`❌ Expected 10 lenses, found ${lenses.length}`);
    passed = false;
  }

  const lensIdsInJson = new Set(lenses.map((l) => l.lensId));
  for (const expectedId of ALL_THEORY_LENS_IDS) {
    if (!lensIdsInJson.has(expectedId)) {
      console.error(`❌ Missing lens definition for: ${expectedId}`);
      passed = false;
    } else {
      console.log(`  ✓ Lens: ${expectedId}`);
    }
  }

  // 2. Verify Academic Sources Registry
  console.log(`\n[2] Verifying Academic Sources Registry...`);
  const sources = sourcesData as any[];
  console.log(`- Loaded ${sources.length} academic sources.`);

  const sourceIds = new Set(sources.map((s) => s.sourceId));

  for (const source of sources) {
    if (!source.sourceId || !source.author || !source.title || !source.year) {
      console.error(`❌ Incomplete source record: ${JSON.stringify(source)}`);
      passed = false;
    }
    if (!ALL_THEORY_LENS_IDS.includes(source.lensId)) {
      console.error(`❌ Invalid lensId in source: ${source.lensId}`);
      passed = false;
    }
  }
  console.log(`  ✓ All ${sources.length} sources have valid metadata.`);

  // 3. Verify Source References within Lenses
  console.log(`\n[3] Verifying Source References in Lenses...`);
  for (const lens of lenses) {
    if (!lens.sourceIds || lens.sourceIds.length === 0) {
      console.error(`❌ Lens ${lens.lensId} has no sourceIds.`);
      passed = false;
    } else {
      for (const sid of lens.sourceIds) {
        if (!sourceIds.has(sid)) {
          console.error(`❌ Lens ${lens.lensId} references unknown source: ${sid}`);
          passed = false;
        }
      }
      console.log(`  ✓ ${lens.lensId}: ${lens.sourceIds.length} verified source refs.`);
    }
  }

  // 4. Verify Concept Mappings and Safety Rules
  console.log(`\n[4] Verifying Safety Boundaries & Concept Mappings...`);
  for (const lens of lenses) {
    if (!lens.coreConcepts || lens.coreConcepts.length === 0) {
      console.error(`❌ Lens ${lens.lensId} has no coreConcepts.`);
      passed = false;
    }
    if (!lens.forbiddenInterpretations || lens.forbiddenInterpretations.length === 0) {
      console.error(`❌ Lens ${lens.lensId} has no forbiddenInterpretations.`);
      passed = false;
    }
    if (!lens.historicalLimitations || lens.historicalLimitations.length === 0) {
      console.error(`❌ Lens ${lens.lensId} has no historicalLimitations.`);
      passed = false;
    }
    if (!lens.modernEvidenceLimitations || lens.modernEvidenceLimitations.length === 0) {
      console.error(`❌ Lens ${lens.lensId} has no modernEvidenceLimitations.`);
      passed = false;
    }
    if (!lens.reflectionPrompts || lens.reflectionPrompts.length === 0) {
      console.error(`❌ Lens ${lens.lensId} has no reflectionPrompts.`);
      passed = false;
    }
  }
  console.log(`  ✓ All 10 lenses have required governance constraints and prompts.`);

  console.log('\n====================================================');
  if (passed) {
    console.log('✅ AUDIT PASSED: All 10 Theory Lenses and Sources are 100% valid.');
    console.log('====================================================');
    process.exit(0);
  } else {
    console.error('❌ AUDIT FAILED: Please fix the errors above.');
    console.log('====================================================');
    process.exit(1);
  }
}

runAudit().catch((err) => {
  console.error('Audit crashed:', err);
  process.exit(1);
});
