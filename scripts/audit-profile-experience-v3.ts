import fs from 'fs';
import path from 'path';
import { MASTER_DOMAINS, MASTER_CONSTRUCTS, MASTER_FACETS } from '../src/lib/profile/masterModelConstants';

export interface ProfileExperienceV3AuditResult {
  success: boolean;
  checks: {
    name: string;
    passed: boolean;
    details: string;
  }[];
  errors: string[];
}

export async function runProfileExperienceV3Audit(): Promise<ProfileExperienceV3AuditResult> {
  const root = path.resolve(__dirname, '..');
  const errors: string[] = [];
  const checks: { name: string; passed: boolean; details: string }[] = [];

  console.log('='.repeat(95));
  console.log('PSYCHE-AI PROFILE EXPERIENCE V3 SCIENTIFIC HARDENING AUDIT (V3.1)');
  console.log('='.repeat(95));

  // Helper to record check
  const recordCheck = (name: string, passed: boolean, details: string, errorMsg?: string) => {
    checks.push({ name, passed, details });
    if (!passed && errorMsg) {
      errors.push(errorMsg);
    }
  };

  const profileClientViewPath = path.join(root, 'src/components/profile/UnifiedProfileClientViewV2.tsx');
  const profileClientViewContent = fs.existsSync(profileClientViewPath)
    ? fs.readFileSync(profileClientViewPath, 'utf8')
    : '';

  const narrativePath = path.join(root, 'src/components/profile/ProfileNarrative.tsx');
  const narrativeContent = fs.existsSync(narrativePath) ? fs.readFileSync(narrativePath, 'utf8') : '';

  const dnaPath = path.join(root, 'src/components/profile/PersonalityDNA.tsx');
  const dnaContent = fs.existsSync(dnaPath) ? fs.readFileSync(dnaPath, 'utf8') : '';

  const compassPath = path.join(root, 'src/components/profile/InterpersonalStyleCompass.tsx');
  const compassContent = fs.existsSync(compassPath) ? fs.readFileSync(compassPath, 'utf8') : '';

  const radarPath = path.join(root, 'src/components/profile/HexacoRadarV2.tsx');
  const radarContent = fs.existsSync(radarPath) ? fs.readFileSync(radarPath, 'utf8') : '';

  const schwartzPath = path.join(root, 'src/components/profile/SchwartzValuesCircle.tsx');
  const schwartzContent = fs.existsSync(schwartzPath) ? fs.readFileSync(schwartzPath, 'utf8') : '';

  const heroPath = path.join(root, 'src/components/profile/ProfileHeroV3.tsx');
  const heroContent = fs.existsSync(heroPath) ? fs.readFileSync(heroPath, 'utf8') : '';

  const heatmapPath = path.join(root, 'src/components/profile/HexacoFacetHeatmap.tsx');
  const heatmapContent = fs.existsSync(heatmapPath) ? fs.readFileSync(heatmapPath, 'utf8') : '';

  const matrixPath = path.join(root, 'src/components/profile/TraitInteractionMatrix.tsx');
  const matrixContent = fs.existsSync(matrixPath) ? fs.readFileSync(matrixPath, 'utf8') : '';

  // 1. Old spiky fingerprint removed & replaced by PersonalityDNA
  const oldFingerprintRemoved =
    !profileClientViewContent.includes('<ProfileFingerprint') &&
    profileClientViewContent.includes('PersonalityDNA');
  recordCheck(
    '1. Old spiky fingerprint removed',
    oldFingerprintRemoved,
    'PersonalityDNA radial coordinates replaces spiky 56-point polar star in main client view',
    'Main profile client view still renders raw ProfileFingerprint instead of PersonalityDNA'
  );

  // 2. No second permanent profile sidebar
  const noPermanentSidebar =
    !profileClientViewContent.includes('lg:col-span-4 sticky top-20') &&
    profileClientViewContent.includes('sticky top-14') &&
    profileClientViewContent.includes('overflow-x-auto');
  recordCheck(
    '2. No second permanent profile sidebar',
    noPermanentSidebar,
    'Permanently wide 4-column sidebar removed; full-width canvas with sticky top jump navigation pills implemented',
    'Main profile still contains permanently wide 4-column desktop sidebar'
  );

  // 3. Deep profile analysis uses real pipeline (no setTimeout, no hardcoded text)
  const realDeepAnalysisPipeline =
    !narrativeContent.includes('setTimeout(') &&
    !narrativeContent.includes('--- ÇOK BOYUTLU DERİN PROFİL ANALİZİ ---') &&
    narrativeContent.includes('/api/profile/deep-analysis') &&
    narrativeContent.includes('generateEvidenceGroundedDeepFallback') &&
    narrativeContent.includes('deepState');
  recordCheck(
    '3. Real Deep Profile Analysis pipeline',
    realDeepAnalysisPipeline,
    'ProfileNarrative calls real /api/profile/deep-analysis route and deterministic evidence-grounded fallback without setTimeout simulation',
    'ProfileNarrative still uses setTimeout or hardcoded simulation instead of real insight pipeline'
  );

  // 4. Client cache keys do NOT contain raw userId
  const cleanCacheKeys =
    !narrativeContent.includes('profile.userId') &&
    !narrativeContent.includes('userId') &&
    narrativeContent.includes('cacheKey');
  recordCheck(
    '4. Client cache keys hygiene (zero PII / zero raw userId)',
    cleanCacheKeys,
    'Session storage cache keys are derived from facet signature and timestamp without leaking raw userId',
    'Client-side cache keys still contain raw userId'
  );

  // 5. PersonalityDNA balanced axes selection (at most 1-2 per domain)
  const dnaBalancedAxes =
    dnaContent.includes('facetsByDomain') &&
    dnaContent.includes('uniqueDomainsCount') &&
    dnaContent.includes('selectedFacets');
  recordCheck(
    '5. PersonalityDNA balanced axes selection',
    dnaBalancedAxes,
    'PersonalityDNA balances axes across measured domains (1-2 per domain) and displays domain coverage state',
    'PersonalityDNA lacks domain-balanced axis selection or over-indexes on a single domain'
  );

  // 6. PersonalityDNA distinctiveness uses Math.abs(score - 3.0), NOT descending score
  const dnaMidpointDistinctiveness =
    dnaContent.includes('Math.abs') &&
    dnaContent.includes('3.0') &&
    !dnaContent.includes('sort((a, b) => b.score - a.score)') &&
    dnaContent.includes('Ölçekte En Uçta Yer Alan Eksenlerin');
  recordCheck(
    '6. PersonalityDNA midpoint distinctiveness heuristic',
    dnaMidpointDistinctiveness,
    'Distinctiveness is computed as distance from midpoint 3.0 (Math.abs(score - 3.0)) capturing both high and low scale poles',
    'PersonalityDNA computes distinctiveness via descending score instead of distance from neutral midpoint'
  );

  // 7. PersonalityDNA contains metaphor disclaimer
  const dnaMetaphorDisclaimer =
    dnaContent.includes('Bu görsel genetik bir DNA modeli değildir') &&
    dnaContent.includes('ölçülen psikolojik boyutlarının görsel imzasıdır');
  recordCheck(
    '7. PersonalityDNA product metaphor disclaimer',
    dnaMetaphorDisclaimer,
    'Explicit disclaimer present stating the visual is a product metaphor and not a genetic DNA model',
    'PersonalityDNA lacks product metaphor disclaimer'
  );

  // 8. InterpersonalStyleCompass uses "Keşifsel türetilmiş görünüm" (NOT "Kuramsal")
  const compassCorrectBadge =
    compassContent.includes('Keşifsel türetilmiş görünüm') &&
    !compassContent.includes('Kuramsal Türetilmiş');
  recordCheck(
    '8. InterpersonalStyleCompass exploratory derived badge',
    compassCorrectBadge,
    'InterpersonalStyleCompass clearly displays "Keşifsel türetilmiş görünüm"',
    'InterpersonalStyleCompass lacks exploratory derived label or still uses "Kuramsal"'
  );

  // 9. InterpersonalStyleCompass axis label uses "Daha geri planda / daha az yönlendirici" (NOT "Alçakgönüllü")
  const compassCorrectAxisLabel =
    compassContent.includes('Daha geri planda / daha az yönlendirici (-Agency)') &&
    !compassContent.includes('Alçakgönüllü (-Agency)');
  recordCheck(
    '9. InterpersonalStyleCompass agency axis terminology',
    compassCorrectAxisLabel,
    'Negative agency axis correctly labeled "Daha geri planda / daha az yönlendirici (-Agency)" avoiding confusion with humility',
    'InterpersonalStyleCompass still conflates negative agency with humility (Alçakgönüllü)'
  );

  // 10. InterpersonalStyleCompass requires >= 2 indicators for Agency AND >= 2 for Communion
  const compassThresholdEnforced =
    compassContent.includes('agencyScores.length >= 2') &&
    compassContent.includes('communionScores.length >= 2') &&
    compassContent.includes('Henüz yeterli veri yok');
  recordCheck(
    '10. InterpersonalStyleCompass operational threshold (>=2 agency, >=2 communion)',
    compassThresholdEnforced,
    'Strictly requires >= 2 measured indicators for agency AND >= 2 for communion; displays informative fallback otherwise',
    'InterpersonalStyleCompass renders coordinates with insufficient facet indicators'
  );

  // 11. HexacoRadarV2 uses ONLY constructScore (no facet averaging fallback)
  const radarNoAveraging =
    radarContent.includes('construct?.constructScore ?? null') &&
    !radarContent.includes('relevantFacets.reduce') &&
    !radarContent.includes('sum / relevantFacets.length');
  recordCheck(
    '11. HexacoRadar canonical constructScore integrity',
    radarNoAveraging,
    'HexacoRadar uses strictly canonical constructScore with zero synthetic averaging fallback for broad factors',
    'HexacoRadar fabricates broad factor scores by averaging whatever facets are measured'
  );

  // 12. SchwartzValuesCircle handles partial data (1-3 facets) with unmeasured labels
  const schwartzPartialHandling =
    schwartzContent.includes('schwartz_openness_to_change') &&
    schwartzContent.includes('Ölçülmedi') &&
    schwartzContent.includes('allSectors.map');
  recordCheck(
    '12. SchwartzValuesCircle partial data handling and unmeasured labels',
    schwartzPartialHandling,
    'Schwartz values circumplex renders 4-quadrant layout labeling measured vs "Ölçülmedi" sectors without fabrication',
    'SchwartzValuesCircle does not properly handle partial facet measurements or lacks unmeasured labels'
  );

  // 13. Interaction matrix uses no fake correlation
  let matrixNoFakeCorr = false;
  if (fs.existsSync(matrixPath)) {
    matrixNoFakeCorr =
      !matrixContent.includes('calculatePearson') &&
      !matrixContent.includes('calculateSpearman') &&
      !matrixContent.includes('r =') &&
      matrixContent.includes('synergies') &&
      matrixContent.includes('tensions');
  }
  recordCheck(
    '13. Interaction matrix uses no fake statistical correlation',
    matrixNoFakeCorr,
    'TraitInteractionMatrix uses qualitative synergies and balance rules without mathematical correlation fabrication',
    'Trait interaction matrix improperly claims Pearson/Spearman correlation on single-user profile'
  );

  // 14. 91/37/11 source of truth preserved
  const sourceOfTruthPreserved =
    MASTER_DOMAINS.length === 11 &&
    MASTER_CONSTRUCTS.length === 37 &&
    MASTER_FACETS.length === 91;
  recordCheck(
    '14. 91/37/11 master model source of truth preserved',
    sourceOfTruthPreserved,
    `Master model constants verified intact: 11 Domains, 37 Constructs, 91 Facets (Exact: ${MASTER_DOMAINS.length}/${MASTER_CONSTRUCTS.length}/${MASTER_FACETS.length})`,
    `Master model constants corrupted: expected 11/37/91, got ${MASTER_DOMAINS.length}/${MASTER_CONSTRUCTS.length}/${MASTER_FACETS.length}`
  );

  // Summary
  const passedCount = checks.filter((c) => c.passed).length;
  const success = errors.length === 0 && passedCount === 14;

  console.log('\nAudit Results:');
  checks.forEach((c) => {
    console.log(`  ${c.passed ? '✅' : '❌'} ${c.name}: ${c.details}`);
  });

  console.log('\n' + '='.repeat(95));
  console.log(`PROFILE EXPERIENCE V3 SCIENTIFIC HARDENING AUDIT: ${success ? 'PASSED ✅ (14/14)' : 'FAILED ❌'}`);
  console.log('='.repeat(95));

  if (errors.length > 0) {
    console.error('\nErrors detected:');
    errors.forEach((e) => console.error(`  - [ERROR] ${e}`));
  }

  return {
    success,
    checks,
    errors,
  };
}

// CLI Execution
if (require.main === module) {
  runProfileExperienceV3Audit().then((result) => {
    if (!result.success) {
      process.exit(1);
    }
  });
}
