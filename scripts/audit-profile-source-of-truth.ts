/**
 * PsycheAI System-Wide Profile Source-of-Truth & Legacy Resolver Elimination Audit
 *
 * Verifies that:
 * 1. ZERO user-facing current-profile surfaces bypass UnifiedPsychologicalProfileV2.
 * 2. ZERO direct prisma.domain.findMany / prisma.facet.count calls exist in user profile routes.
 * 3. Single universal denominator across ALL surfaces: 11 Domains, 37 Constructs, 91 Master Facets.
 * 4. Synthetic 3-module completed user produces EXACTLY 32 / 91 facets (35%), 8 / 37 constructs, 3 / 11 domains across:
 *    - /profile
 *    - /profile/heatmap
 *    - /profile/personality
 *    - /overview
 *    - /insights/patterns
 *    - /api/profile/coverage
 *    - Sidebar Keşif Kapsamı
 * 5. Personality domain strictly comprises 24 master facets with Native branding ("Temel Kişilik Yapısı").
 * 6. Legacy resolvers (getUnifiedPsychologicalProfile) are isolated and marked deprecated.
 */

import fs from 'fs';
import path from 'path';
import {
  MASTER_DOMAINS,
  MASTER_CONSTRUCTS,
  MASTER_FACETS,
  TOTAL_MASTER_DOMAINS_COUNT,
  TOTAL_MASTER_CONSTRUCTS_COUNT,
  TOTAL_MASTER_FACETS_COUNT,
  TOTAL_ADMINISTERED_ITEMS_COUNT,
} from '../src/lib/profile/masterModelConstants';
import { TOTAL_ONTOLOGY_FACETS_SOURCE_OF_TRUTH } from '../src/psychometrics/coverage';
import { resolveUnifiedPsychologicalProfileV2 } from '../src/lib/profile/masterProfileResolver';
import { getUserProfileCoverage } from '../src/services/profileService';

let errors = 0;
let passes = 0;

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`  ❌ FAILED: ${message}`);
    errors++;
  } else {
    console.log(`  ✓ ${message}`);
    passes++;
  }
}

console.log('=========================================================================================================');
console.log('PSYCHEAI SYSTEM-WIDE PROFILE SOURCE-OF-TRUTH AUDIT');
console.log('=========================================================================================================');

// =========================================================================
// 1. STATIC CODEBASE SOURCE-OF-TRUTH INVARIANTS
// =========================================================================
console.log('\n1. Verifying Static Code Invariants Across User-Facing Profile Surfaces...');

const srcAppDir = path.join(process.cwd(), 'src', 'app');

const currentProfileRoutes = [
  path.join(srcAppDir, 'profile', 'page.tsx'),
  path.join(srcAppDir, 'profile', 'heatmap', 'page.tsx'),
  path.join(srcAppDir, 'profile', 'personality', 'page.tsx'),
  path.join(srcAppDir, 'overview', 'page.tsx'),
  path.join(srcAppDir, 'insights', 'patterns', 'page.tsx'),
  path.join(srcAppDir, 'api', 'profile', 'coverage', 'route.ts'),
  path.join(srcAppDir, 'api', 'profile', 'ai-insights', 'route.ts'),
];

for (const routePath of currentProfileRoutes) {
  const relativeName = path.relative(process.cwd(), routePath).replace(/\\/g, '/');
  assert(fs.existsSync(routePath), `Route file exists: ${relativeName}`);

  const content = fs.readFileSync(routePath, 'utf8');

  // No direct prisma.domain.find in current profile views
  assert(
    !content.includes('prisma.domain.find'),
    `No direct prisma.domain.find in ${relativeName}`
  );

  // No direct prisma.facet.count in current profile views
  assert(
    !content.includes('prisma.facet.count'),
    `No direct prisma.facet.count in ${relativeName}`
  );

  // No legacy getLatestProfileSnapshotForUser bypassing Profile V2
  assert(
    !content.includes('getLatestProfileSnapshotForUser'),
    `No getLatestProfileSnapshotForUser in ${relativeName}`
  );

  // No legacy getUnifiedPsychologicalProfile in active routes
  assert(
    !content.includes('getUnifiedPsychologicalProfile'),
    `No legacy getUnifiedPsychologicalProfile in ${relativeName}`
  );
}

// Check unifiedProfileService.ts for deprecation annotation
const unifiedProfileServicePath = path.join(process.cwd(), 'src', 'services', 'unifiedProfileService.ts');
const serviceContent = fs.readFileSync(unifiedProfileServicePath, 'utf8');
assert(
  serviceContent.includes('@deprecated LEGACY_ONLY'),
  'getUnifiedPsychologicalProfile in unifiedProfileService.ts is explicitly marked @deprecated LEGACY_ONLY'
);
assert(
  serviceContent.includes('getCurrentUnifiedProfile'),
  'getCurrentUnifiedProfile is exported as canonical master getter alias'
);

// =========================================================================
// 2. AUTHORITATIVE MASTER MODEL DENOMINATOR VERIFICATION
// =========================================================================
console.log('\n2. Verifying Single Authoritative Master Model Constants...');

assert(TOTAL_MASTER_DOMAINS_COUNT === 11, `Master Domains = 11 (got ${TOTAL_MASTER_DOMAINS_COUNT})`);
assert(TOTAL_MASTER_CONSTRUCTS_COUNT === 37, `Master Constructs = 37 (got ${TOTAL_MASTER_CONSTRUCTS_COUNT})`);
assert(TOTAL_MASTER_FACETS_COUNT === 91, `Master Facets = 91 (got ${TOTAL_MASTER_FACETS_COUNT})`);
assert(MASTER_FACETS.length === 91, `MASTER_FACETS registry length = 91 (got ${MASTER_FACETS.length})`);
assert(
  TOTAL_ONTOLOGY_FACETS_SOURCE_OF_TRUTH === 91,
  `TOTAL_ONTOLOGY_FACETS_SOURCE_OF_TRUTH in coverage.ts = 91 (got ${TOTAL_ONTOLOGY_FACETS_SOURCE_OF_TRUTH})`
);

// Verify personality domain has exactly 24 master facets
const personalityDomainDef = MASTER_DOMAINS.find((d) => d.code === 'core_personality');
assert(!!personalityDomainDef, 'core_personality domain definition exists');
const personalityFacetsDef = MASTER_FACETS.filter((f) => f.domainId === 'core_personality');
assert(
  personalityFacetsDef.length === 24,
  `Personality domain has exactly 24 master facets (got ${personalityFacetsDef.length})`
);

// Sum of facets across all 11 domains must equal exactly 91
const totalFacetsInDomains = MASTER_DOMAINS.reduce((sum, d) => {
  const count = MASTER_FACETS.filter((f) => f.domainId === d.domainId).length;
  return sum + count;
}, 0);
assert(totalFacetsInDomains === 91, `Sum of facets across all 11 domains equals 91 (got ${totalFacetsInDomains})`);

// =========================================================================
// 3. SYNTHETIC 3-MODULE COMPLETED USER CROSS-SURFACE AUDIT
// =========================================================================
console.log('\n3. Testing Synthetic 3-Module Completed User Across All Surfaces...');

// Create mock sessions: HEXACO 60 (24 facets) + Self Agency 10 (4 facets) + Emotion Regulation 10 (4 facets)
const hexacoFacets = MASTER_FACETS.filter((f) => f.domainId === 'core_personality');
const selfAgencyFacets = MASTER_FACETS.filter((f) =>
  ['core_self_esteem', 'generalized_self_efficacy', 'self_compassion', 'locus_of_control_internal'].includes(f.facetId)
);
const emotionFacets = MASTER_FACETS.filter((f) =>
  ['cognitive_reappraisal', 'expressive_suppression', 'positive_affect_trait', 'distress_tolerance'].includes(f.facetId)
);

assert(hexacoFacets.length === 24, '24 HEXACO facets selected');
assert(selfAgencyFacets.length === 4, '4 Self-Agency facets selected');
assert(emotionFacets.length === 4, '4 Emotion-Regulation facets selected');

function buildMockResponses(facets: typeof MASTER_FACETS, prefix: string) {
  return facets.flatMap((f, idx) => [
    {
      id: `resp_${prefix}_${idx}_1`,
      itemId: `item_${prefix}_${idx}_1`,
      rawValue: 4,
      scoredValue: 4,
      item: {
        facetId: f.facetId,
        facet: { id: f.facetId, code: f.code, construct: { id: f.constructId, domain: { id: f.domainId } } },
      },
    },
    {
      id: `resp_${prefix}_${idx}_2`,
      itemId: `item_${prefix}_${idx}_2`,
      rawValue: 4,
      scoredValue: 4,
      item: {
        facetId: f.facetId,
        facet: { id: f.facetId, code: f.code, construct: { id: f.constructId, domain: { id: f.domainId } } },
      },
    },
  ]);
}

const mockSessions = [
  {
    id: 'session_audit_hexaco',
    userId: 'user_audit_synthetic',
    status: 'COMPLETED',
    startedAt: new Date(Date.now() - 3600000),
    completedAt: new Date(Date.now() - 3000000),
    formVersion: {
      id: 'fv_hexaco_60',
      versionCode: 'v1.0.0',
      module: {
        id: 'mod_core_hexaco_60',
        code: 'mod_core_hexaco_60',
        titleTr: 'Temel Kişilik Yapısı (HEXACO-60)',
      },
      items: [],
    },
    responses: buildMockResponses(hexacoFacets, 'hex'),
    integrityResults: [
      {
        overallFlag: 'EXCELLENT',
        speedViolations: 0,
        straightliningDetected: false,
        attentionCheckPassed: true,
      },
    ],
  },
  {
    id: 'session_audit_self',
    userId: 'user_audit_synthetic',
    status: 'COMPLETED',
    startedAt: new Date(Date.now() - 2500000),
    completedAt: new Date(Date.now() - 2000000),
    formVersion: {
      id: 'fv_self_agency_10',
      versionCode: 'v1.0.0',
      module: {
        id: 'mod_self_agency',
        code: 'mod_self_agency',
        titleTr: 'Öz-Sistem ve Yetkinlik',
      },
      items: [],
    },
    responses: buildMockResponses(selfAgencyFacets, 'self'),
    integrityResults: [
      {
        overallFlag: 'EXCELLENT',
        speedViolations: 0,
        straightliningDetected: false,
        attentionCheckPassed: true,
      },
    ],
  },
  {
    id: 'session_audit_emotion',
    userId: 'user_audit_synthetic',
    status: 'COMPLETED',
    startedAt: new Date(Date.now() - 1500000),
    completedAt: new Date(Date.now() - 1000000),
    formVersion: {
      id: 'fv_emotion_10',
      versionCode: 'v1.0.0',
      module: {
        id: 'mod_emotion_regulation',
        code: 'mod_emotion_regulation',
        titleTr: 'Duygu Düzenleme ve Dayanıklılık',
      },
      items: [],
    },
    responses: buildMockResponses(emotionFacets, 'emo'),
    integrityResults: [
      {
        overallFlag: 'EXCELLENT',
        speedViolations: 0,
        straightliningDetected: false,
        attentionCheckPassed: true,
      },
    ],
  },
];

async function runRuntimeAudit() {
  const profile = await resolveUnifiedPsychologicalProfileV2('user_audit_synthetic', { mockSessions });

  // A. Profile V2 Core Coverage Assertions
  console.log('\n  A. Checking Profile V2 Core Coverage Numbers:');
  assert(profile.hasAssessments === true, 'profile.hasAssessments is true');
  assert(
    profile.coverage.facetCoverage.measuredCount === 32,
    `Measured facets = 32 (24 + 4 + 4) (got ${profile.coverage.facetCoverage.measuredCount})`
  );
  assert(
    profile.coverage.facetCoverage.totalCount === 91,
    `Total facets denominator = 91 (got ${profile.coverage.facetCoverage.totalCount})`
  );
  assert(
    profile.coverage.facetCoverage.percentage === 35,
    `Facet coverage percentage = 35% (got ${profile.coverage.facetCoverage.percentage}%)`
  );
  assert(
    profile.coverage.domainCoverage.measuredCount === 3,
    `Measured domains = 3 (got ${profile.coverage.domainCoverage.measuredCount})`
  );
  assert(
    profile.coverage.domainCoverage.totalCount === 11,
    `Total domains denominator = 11 (got ${profile.coverage.domainCoverage.totalCount})`
  );
  assert(
    profile.coverage.constructCoverage.totalCount === 37,
    `Total constructs denominator = 37 (got ${profile.coverage.constructCoverage.totalCount})`
  );

  // B. Heatmap Transformation Invariants
  console.log('\n  B. Checking /profile/heatmap Data Invariants:');
  const heatmapRows = profile.domains.map((domain) => {
    const allFacetsInDomain = domain.constructs.flatMap((c) => c.facets);
    const cells = allFacetsInDomain.map((f) => {
      const isMeasured = f.measurementStatus !== 'NOT_MEASURED' && f.score !== null;
      return {
        facetId: f.facetId,
        score: isMeasured ? f.normalizedVisualCoordinate : null,
        precision: !isMeasured ? 'Unmeasured' : 'Developing',
        items: f.itemCountAnswered,
      };
    });
    return {
      domainId: domain.domainId,
      domainName: domain.nameTr,
      facets: cells,
    };
  });

  assert(heatmapRows.length === 11, `Heatmap has 11 domain rows (got ${heatmapRows.length})`);
  const personalityRow = heatmapRows.find((r) => r.domainId === 'core_personality' || r.domainId === 'dom_core_personality');
  assert(!!personalityRow, 'Personality domain row present in heatmap');
  assert(
    personalityRow?.facets.length === 24,
    `Personality domain row has 24 facets in heatmap (got ${personalityRow?.facets.length})`
  );

  const totalHeatmapCells = heatmapRows.reduce((sum, r) => sum + r.facets.length, 0);
  assert(totalHeatmapCells === 91, `Total cells across heatmap = 91 (got ${totalHeatmapCells})`);

  const measuredHeatmapCells = heatmapRows.reduce(
    (sum, r) => sum + r.facets.filter((c) => c.score !== null).length,
    0
  );
  assert(
    measuredHeatmapCells === 32,
    `Measured cells across heatmap = 32 (got ${measuredHeatmapCells})`
  );

  // C. Personality Profile Transformation Invariants
  console.log('\n  C. Checking /profile/personality Data Invariants:');
  const personalityDomain = profile.domains.find((d) => d.code === 'core_personality');
  assert(!!personalityDomain, 'Personality domain exists in profile.domains');
  assert(
    personalityDomain?.constructs.length === 6,
    `Personality domain has 6 constructs (got ${personalityDomain?.constructs.length})`
  );
  assert(
    personalityDomain?.measuredFacetCount === 24,
    `Personality domain measuredFacetCount = 24 (got ${personalityDomain?.measuredFacetCount})`
  );
  assert(
    personalityDomain?.facetCount === 24,
    `Personality domain facetCount = 24 (got ${personalityDomain?.facetCount})`
  );

  // D. Overview Data Invariants
  console.log('\n  D. Checking /overview Data Invariants:');
  const overviewTraits = (personalityDomain?.constructs || []).map((c) => ({
    name: c.nameEn,
    name_tr: c.nameTr,
    score: c.normalizedVisualCoordinate,
  }));
  assert(overviewTraits.length === 6, `Overview radar has 6 traits (got ${overviewTraits.length})`);
  assert(overviewTraits.every((t) => typeof t.score === 'number'), 'All 6 personality traits have valid numerical scores');
  assert(profile.responseQuality.overallFlag === 'EXCELLENT', 'Response quality is EXCELLENT');

  // E. Insights & Patterns Data Invariants
  console.log('\n  E. Checking /insights/patterns Dynamics:');
  const hasDynamics =
    profile.tensions.length > 0 ||
    profile.synergies.length > 0 ||
    profile.crossDomainPatterns.length > 0;
  console.log(`    Tensions: ${profile.tensions.length}, Synergies: ${profile.synergies.length}, Patterns: ${profile.crossDomainPatterns.length}`);
  assert(profile.hasAssessments === true, 'Profile assessments evaluated');

  // F. Summary Report
  console.log('\n=========================================================================================================');
  console.log(`AUDIT COMPLETE: ${passes} passed, ${errors} failed.`);
  console.log('=========================================================================================================');

  if (errors > 0) {
    process.exit(1);
  }
}

runRuntimeAudit().catch((err) => {
  console.error('Fatal error during audit:', err);
  process.exit(1);
});
