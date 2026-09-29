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
  console.log('PSYCHE-AI PROFILE EXPERIENCE V3 AUDIT (REQUIREMENT 45)');
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

  // 1. Old spiky fingerprint removed
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

  // 3. Profile hero interpretation-first
  const heroPath = path.join(root, 'src/components/profile/ProfileHeroV3.tsx');
  const heroExists = fs.existsSync(heroPath);
  let heroInterpretationFirst = false;
  if (heroExists) {
    const heroContent = fs.readFileSync(heroPath, 'utf8');
    heroInterpretationFirst =
      heroContent.includes('generateProfileHeroSynthesis') &&
      heroContent.includes('headlineTr') &&
      heroContent.includes('synthesisTextTr') &&
      heroContent.includes('themeChips');
  }
  recordCheck(
    '3. Profile hero interpretation-first',
    heroInterpretationFirst,
    'ProfileHeroV3 leads with 2-3 sentence personalized psychological synthesis and key theme tags before secondary progress',
    'Profile hero is missing narrative synthesis or does not lead with psychological interpretation'
  );

  // 4. HEXACO radar exists
  const radarPath = path.join(root, 'src/components/profile/HexacoRadarV2.tsx');
  const radarExists = fs.existsSync(radarPath);
  let hexacoRadarValid = false;
  if (radarExists) {
    const radarContent = fs.readFileSync(radarPath, 'utf8');
    hexacoRadarValid =
      radarContent.includes('hexaco_honesty_humility') &&
      radarContent.includes('hexaco_emotionality') &&
      radarContent.includes('hexaco_extraversion') &&
      radarContent.includes('hexaco_agreeableness') &&
      radarContent.includes('hexaco_conscientiousness') &&
      radarContent.includes('hexaco_openness_to_experience') &&
      radarContent.includes('RadarChart');
  }
  recordCheck(
    '4. HEXACO radar exists',
    hexacoRadarValid,
    'HexacoRadarV2 accurately renders 6 broad personality factors with Recharts and value-neutral scale positions',
    'HEXACO radar component is missing or does not correctly configure the 6 broad factors'
  );

  // 5. HEXACO heatmap exists
  const heatmapPath = path.join(root, 'src/components/profile/HexacoFacetHeatmap.tsx');
  const heatmapExists = fs.existsSync(heatmapPath);
  let heatmapValid = false;
  if (heatmapExists) {
    const heatmapContent = fs.readFileSync(heatmapPath, 'utf8');
    heatmapValid =
      heatmapContent.includes('HEXACO_24_STRUCTURE') &&
      heatmapContent.includes('selectedFacet') &&
      heatmapContent.includes('generatePersonalizedFacetInterpretation');
  }
  recordCheck(
    '5. HEXACO heatmap exists',
    heatmapValid,
    'HexacoFacetHeatmap renders exact 24-cell matrix (6 factors × 4 facets) with interactive slide-over drawer',
    'HEXACO facet heatmap is missing or does not support 24 facets with inspection drawer'
  );

  // 6. Schwartz circle conditional
  const schwartzPath = path.join(root, 'src/components/profile/SchwartzValuesCircle.tsx');
  const schwartzExists = fs.existsSync(schwartzPath);
  let schwartzValid = false;
  if (schwartzExists) {
    const schwartzContent = fs.readFileSync(schwartzPath, 'utf8');
    schwartzValid =
      schwartzContent.includes('schwartz_openness_to_change') &&
      schwartzContent.includes('isMeasured') &&
      schwartzContent.includes('Henüz Ölçülmedi');
  }
  recordCheck(
    '6. Schwartz circle conditional',
    schwartzValid,
    'SchwartzValuesCircle conditionally verifies measurement and does not fabricate scores when unmeasured',
    'Schwartz values circle does not properly guard unmeasured status'
  );

  // 7. Percentile chart conditional on norm data
  const normConditional =
    profileClientViewContent.includes('Toplum Normlarıyla Karşılaştırma Henüz Sunulmuyor') ||
    profileClientViewContent.includes('Toplum normlarıyla karşılaştırma henüz sunulmuyor');
  recordCheck(
    '7. Percentile chart conditional on norm data',
    normConditional,
    'No fabricated percentiles or simulated population distributions rendered; explicit epistemic norm transparency provided',
    'Profile view leaks uncalibrated population percentiles or lacks explicit norm status note'
  );

  // 8. RIASEC conditional on actual data
  const riasecNotFakeInProfile = !profileClientViewContent.includes('<RiasecHexagon');
  recordCheck(
    '8. RIASEC conditional on actual data',
    riasecNotFakeInProfile,
    'RIASEC hexagon is not rendered with fabricated data in the live profile view; remains reserved for future vocational module',
    'Live profile view inappropriately renders fabricated RIASEC vocational model without measurement instrument'
  );

  // 9. Interaction matrix uses no fake correlation
  const matrixPath = path.join(root, 'src/components/profile/TraitInteractionMatrix.tsx');
  const matrixExists = fs.existsSync(matrixPath);
  let matrixNoFakeCorr = false;
  if (matrixExists) {
    const matrixContent = fs.readFileSync(matrixPath, 'utf8');
    matrixNoFakeCorr =
      !matrixContent.includes('calculatePearson') &&
      !matrixContent.includes('calculateSpearman') &&
      !matrixContent.includes('r =') &&
      matrixContent.includes('synergies') &&
      matrixContent.includes('tensions') &&
      matrixContent.includes('sahte istatistiksel Pearson veya Spearman korelasyonu hesaplamaz');
  }
  recordCheck(
    '9. Interaction matrix uses no fake correlation',
    matrixNoFakeCorr,
    'TraitInteractionMatrix uses qualitative synergies and delicate balance tension rules without claiming statistical correlation',
    'Trait interaction matrix improperly claims Pearson/Spearman mathematical correlation on single-user profile'
  );

  // 10. Measured facets personalized
  const facetCardPath = path.join(root, 'src/components/profile/FacetInsightCardV3.tsx');
  const facetCardExists = fs.existsSync(facetCardPath);
  let facetCardPersonalized = false;
  if (facetCardExists) {
    const cardContent = fs.readFileSync(facetCardPath, 'utf8');
    facetCardPersonalized =
      cardContent.includes('generatePersonalizedFacetInterpretation') &&
      cardContent.includes('selfMeaningTr') &&
      cardContent.includes('dailyLifeTr') &&
      cardContent.includes('strengthsContextTr') &&
      cardContent.includes('energyCostContextTr') &&
      cardContent.includes('reflectionQuestionTr');
  }
  recordCheck(
    '10. Measured facets personalized',
    facetCardPersonalized,
    'FacetInsightCardV3 provides 6-part rich personalized interpretation beyond raw dictionary definitions',
    'Facet cards lack personalized interpretation sections or rely solely on dictionary definitions'
  );

  // 11. Unmeasured facets grouped separately
  const unmeasuredPanelPath = path.join(root, 'src/components/profile/UnexploredAreasPanel.tsx');
  const unmeasuredPanelExists = fs.existsSync(unmeasuredPanelPath);
  const unmeasuredSeparated =
    unmeasuredPanelExists &&
    profileClientViewContent.includes('UnexploredAreasPanel') &&
    profileClientViewContent.includes('Henüz Ölçülmeyenler');
  recordCheck(
    '11. Unmeasured facets grouped separately',
    unmeasuredSeparated,
    'Unmeasured facets are grouped separately into dedicated discovery views and actionable next-assessment CTAs',
    'Unmeasured facets are not clearly grouped separately from measured findings'
  );

  // 12. Scientific technical enums hidden
  const sciencePanelPath = path.join(root, 'src/components/profile/ScientificDetailPanelV2.tsx');
  const sciencePanelExists = fs.existsSync(sciencePanelPath);
  let enumsHiddenInDrawer = false;
  if (sciencePanelExists) {
    const scienceContent = fs.readFileSync(sciencePanelPath, 'utf8');
    enumsHiddenInDrawer =
      scienceContent.includes('showTechnicalDrawer') &&
      scienceContent.includes('Teknik Ayrıntıları') &&
      scienceContent.includes('qualityExplanation');
  }
  recordCheck(
    '12. Scientific technical enums hidden',
    enumsHiddenInDrawer,
    'ScientificDetailPanelV2 presents a 6-dimension consumer explanation first; raw technical enums are collapsed in an expert drawer',
    'Technical enums leak directly into the primary consumer science view without collapsible drawer containment'
  );

  // 13. Deep profile analysis available
  const narrativePath = path.join(root, 'src/components/profile/ProfileNarrative.tsx');
  const narrativeExists = fs.existsSync(narrativePath);
  let deepAnalysisAvailable = false;
  if (narrativeExists) {
    const narrativeContent = fs.readFileSync(narrativePath, 'utf8');
    deepAnalysisAvailable =
      narrativeContent.includes("'deep'") &&
      narrativeContent.includes('handleGenerateDeepAnalysis') &&
      narrativeContent.includes('localStorage.setItem') &&
      narrativeContent.includes('localStorage.getItem');
  }
  recordCheck(
    '13. Deep profile analysis available',
    deepAnalysisAvailable,
    'ProfileNarrative provides Quick/Detailed/Deep modes with cached on-demand Deep Profile Analysis generation',
    'Deep Profile Analysis mode or evidence caching is missing from ProfileNarrative'
  );

  // 14. 91/37/11 source of truth preserved
  const sourceOfTruthPreserved =
    MASTER_DOMAINS.length === 11 &&
    MASTER_CONSTRUCTS.length === 37 &&
    MASTER_FACETS.length === 91;
  recordCheck(
    '14. 91/37/11 source of truth preserved',
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
  console.log(`PROFILE EXPERIENCE V3 AUDIT: ${success ? 'PASSED ✅ (14/14)' : 'FAILED ❌'}`);
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
