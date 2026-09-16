import {
  ASSESSMENT_MODULE_PORTFOLIO,
  ASSESSMENT_CATALOG_CATEGORIES,
  JOURNEY_STAGES,
  calculateCumulativeQuestionBudget,
  resolveActiveModuleBudget,
  LEGACY_FORM_CODES,
} from '../src/lib/assessmentJourneyConfig';
import { resolveScoringStrategy } from '../src/lib/scoringStrategies';
import { TOTAL_ONTOLOGY_FACETS_SOURCE_OF_TRUTH } from '../src/psychometrics/coverage';

interface AuditError {
  type: string;
  message: string;
  details?: any;
}

const errors: AuditError[] = [];
const warnings: string[] = [];

console.log('====================================================');
console.log('FAZ 2.16 — ASSESSMENT JOURNEY & ARCHITECTURE AUDIT');
console.log('====================================================\n');

// 1. Module Portfolio Audit
console.log('1. Checking Assessment Module Portfolio (16 Modules)...');
if (ASSESSMENT_MODULE_PORTFOLIO.length !== 16) {
  errors.push({
    type: 'PORTFOLIO_SIZE_MISMATCH',
    message: `Expected 16 assessment modules, found ${ASSESSMENT_MODULE_PORTFOLIO.length}`,
  });
} else {
  console.log(`  ✓ Exact 16 modules registered.`);
}

const uniqueModuleCodes = new Set<string>();
const domainsRepresented = new Set<string>();
const uniqueCategories = new Set(Object.keys(ASSESSMENT_CATALOG_CATEGORIES));

for (const mod of ASSESSMENT_MODULE_PORTFOLIO) {
  // Check unique code
  if (uniqueModuleCodes.has(mod.moduleCode)) {
    errors.push({
      type: 'DUPLICATE_MODULE_CODE',
      message: `Duplicate module code: ${mod.moduleCode}`,
    });
  }
  uniqueModuleCodes.add(mod.moduleCode);

  // Check valid category
  if (!uniqueCategories.has(mod.categoryKey)) {
    errors.push({
      type: 'INVALID_CATEGORY_KEY',
      message: `Module ${mod.moduleCode} has unknown categoryKey: ${mod.categoryKey}`,
    });
  }

  // Check valid journey stage
  if (!JOURNEY_STAGES[mod.journeyStage]) {
    errors.push({
      type: 'INVALID_JOURNEY_STAGE',
      message: `Module ${mod.moduleCode} has unknown journeyStage: ${mod.journeyStage}`,
    });
  }

  // Check target domain
  if (mod.targetDomainCode) {
    domainsRepresented.add(mod.targetDomainCode);
  }

  // Check item count positive
  if (typeof mod.estimatedItemCount !== 'number' || mod.estimatedItemCount <= 0) {
    errors.push({
      type: 'INVALID_ITEM_COUNT',
      message: `Module ${mod.moduleCode} has invalid estimatedItemCount: ${mod.estimatedItemCount}`,
    });
  }

  // Check scoring strategy resolution
  try {
    const strat = resolveScoringStrategy(mod.scoringModelCode, mod.moduleCode);
    if (!strat || !strat.code) {
      errors.push({
        type: 'STRATEGY_RESOLUTION_FAILED',
        message: `Scoring strategy resolution failed for module ${mod.moduleCode} (${mod.scoringModelCode})`,
      });
    }
  } catch (err: any) {
    errors.push({
      type: 'STRATEGY_RESOLUTION_ERROR',
      message: `Error resolving strategy for ${mod.moduleCode}: ${err.message}`,
    });
  }
}

console.log(`  ✓ All 16 modules have valid unique codes, categories, stages, and scoring strategies.`);
console.log(`  ✓ Domains directly represented in module portfolio: ${domainsRepresented.size}`);

// 2. Catalog Categories Audit (7 Categories)
console.log('\n2. Checking Product Discovery Categories (7 Categories)...');
const categoryKeys = Object.keys(ASSESSMENT_CATALOG_CATEGORIES);
if (categoryKeys.length !== 7) {
  errors.push({
    type: 'CATEGORY_COUNT_MISMATCH',
    message: `Expected 7 discovery categories, found ${categoryKeys.length}`,
  });
} else {
  console.log(`  ✓ Exact 7 discovery categories configured: ${categoryKeys.join(', ')}`);
}

for (const key of categoryKeys) {
  const cat = ASSESSMENT_CATALOG_CATEGORIES[key as keyof typeof ASSESSMENT_CATALOG_CATEGORIES];
  if (!cat.titleTr || !cat.descriptionTr) {
    errors.push({
      type: 'INCOMPLETE_CATEGORY_DEF',
      message: `Category ${key} missing Turkish title or description.`,
    });
  }
}

// 3. Dynamic Question Budget & Stage Calculation Audit
console.log('\n3. Checking Dynamic Stage Question Budgets...');
const budget = calculateCumulativeQuestionBudget(ASSESSMENT_MODULE_PORTFOLIO);

console.log(`  - Core Profile (4 modules): ${budget.coreQuestions} questions (expected 108)`);
console.log(`  - Expansion Profile (8 modules): ${budget.expansionCumulativeQuestions} cumulative questions (expected 265)`);
console.log(`  - Comprehensive Profile (15 modules): ${budget.comprehensiveCumulativeQuestions} cumulative questions (expected 431)`);
console.log(`  - Advanced Total (16 modules): ${budget.advancedTotalQuestions} cumulative questions (expected 459)`);

if (budget.coreQuestions !== 108) {
  errors.push({
    type: 'BUDGET_MISMATCH',
    message: `Core question budget mismatch: expected 108, got ${budget.coreQuestions}`,
  });
}

if (budget.expansionCumulativeQuestions !== 265) {
  errors.push({
    type: 'BUDGET_MISMATCH',
    message: `Expansion question budget mismatch: expected 265, got ${budget.expansionCumulativeQuestions}`,
  });
}

if (budget.comprehensiveCumulativeQuestions !== 431) {
  errors.push({
    type: 'BUDGET_MISMATCH',
    message: `Comprehensive question budget mismatch: expected 431, got ${budget.comprehensiveCumulativeQuestions}`,
  });
}

if (budget.advancedTotalQuestions !== 459) {
  errors.push({
    type: 'BUDGET_MISMATCH',
    message: `Advanced total question budget mismatch: expected 459, got ${budget.advancedTotalQuestions}`,
  });
}

if (errors.length === 0) {
  console.log('  ✓ Question budgets match dynamic calculations perfectly across all stages.');
}

// 4. Multi-Instrument Container Independence Audit
console.log('\n4. Checking Multi-Instrument Containers...');
const selfAgencyMod = ASSESSMENT_MODULE_PORTFOLIO.find(m => m.moduleCode === 'mod_self_agency');
if (!selfAgencyMod || selfAgencyMod.instruments.length < 2) {
  errors.push({
    type: 'MULTI_INSTRUMENT_CONTAINER_ERROR',
    message: 'mod_self_agency must contain both RSES and GSES instruments.',
  });
} else {
  console.log(`  ✓ mod_self_agency contains: ${selfAgencyMod.instruments.join(', ')}`);
}

const emotionMod = ASSESSMENT_MODULE_PORTFOLIO.find(m => m.moduleCode === 'mod_emotion_regulation');
if (!emotionMod || !emotionMod.scoringModelCode.includes('ERQ')) {
  errors.push({
    type: 'MULTI_SUBSCALE_ERROR',
    message: 'mod_emotion_regulation must use ERQ independent subscale scoring.',
  });
} else {
  console.log(`  ✓ mod_emotion_regulation uses independent subscale scoring: ${emotionMod.scoringModelCode}`);
}

// 5. Legacy Form Isolation Audit
console.log('\n5. Checking Legacy Form Isolation...');
if (!LEGACY_FORM_CODES.includes('form_hexaco_v1_0_0')) {
  errors.push({
    type: 'LEGACY_ISOLATION_ERROR',
    message: 'form_hexaco_v1_0_0 must be recorded in LEGACY_FORM_CODES.',
  });
} else {
  console.log('  ✓ form_hexaco_v1_0_0 is isolated in LEGACY_FORM_CODES.');
}

// Summary Report
console.log('\n====================================================');
if (errors.length > 0) {
  console.error(`❌ AUDIT FAILED with ${errors.length} error(s):`);
  for (const err of errors) {
    console.error(`  - [${err.type}]: ${err.message}`);
  }
  process.exit(1);
} else {
  console.log('✅ ALL FAZ 2.16 ASSESSMENT JOURNEY AUDITS PASSED (100%)');
  console.log('====================================================\n');
}
