import fs from 'fs';
import path from 'path';

export interface ProfileExperienceV4AuditResult {
  success: boolean;
  checks: {
    name: string;
    passed: boolean;
    details: string;
  }[];
  errors: string[];
}

export async function runProfileExperienceV4Audit(): Promise<ProfileExperienceV4AuditResult> {
  const root = path.resolve(__dirname, '..');
  const errors: string[] = [];
  const checks: { name: string; passed: boolean; details: string }[] = [];

  console.log('='.repeat(95));
  console.log('PSYCHE-AI PROFILE V4 + THEORY COUNCIL UX REBUILD AUDIT (V4.0)');
  console.log('='.repeat(95));

  const recordCheck = (name: string, passed: boolean, details: string, errorMsg?: string) => {
    checks.push({ name, passed, details });
    if (!passed && errorMsg) {
      errors.push(errorMsg);
    }
  };

  // 1. Hub-and-depth profile architecture exists (/profile hub + 11+ dedicated sub-routes)
  const subRoutes = [
    'src/app/profile/map/page.tsx',
    'src/app/profile/facets/page.tsx',
    'src/app/profile/personality/page.tsx',
    'src/app/profile/self/page.tsx',
    'src/app/profile/emotions/page.tsx',
    'src/app/profile/cognition/page.tsx',
    'src/app/profile/motivation/page.tsx',
    'src/app/profile/relationships/page.tsx',
    'src/app/profile/resilience/page.tsx',
    'src/app/profile/timeline/page.tsx',
    'src/app/profile/science/page.tsx',
    'src/app/profile/career/page.tsx',
  ];
  const allSubRoutesExist = subRoutes.every((r) => fs.existsSync(path.join(root, r)));
  recordCheck(
    '1. Hub-and-depth architecture routes exist',
    allSubRoutesExist,
    `All ${subRoutes.length} sub-routes present in src/app/profile/`,
    'One or more profile sub-routes are missing'
  );

  // 2. Max 6 top-level profile navigation tabs in ProfileTabNav.tsx
  const tabNavPath = path.join(root, 'src/components/profile/ProfileTabNav.tsx');
  const tabNavContent = fs.existsSync(tabNavPath) ? fs.readFileSync(tabNavPath, 'utf8') : '';
  const tabNavValid =
    tabNavContent.includes('PROFILE_TABS') &&
    tabNavContent.includes("'Özet'") &&
    tabNavContent.includes("'Haritam'") &&
    tabNavContent.includes("'Alanlar'") &&
    tabNavContent.includes("'Alt Boyutlar'") &&
    tabNavContent.includes("'Zaman'") &&
    tabNavContent.includes("'Kuramlar'");
  recordCheck(
    '2. Max 6 top-level profile navigation tabs',
    tabNavValid,
    'ProfileTabNav defines exactly 6 canonical tabs (Özet, Haritam, Alanlar, Alt Boyutlar, Zaman, Kuramlar)',
    'ProfileTabNav missing or does not have the 6 canonical top-level tabs'
  );

  // 3. Flagship visuals canvas /profile/map exists with high visual prominence
  const mapCanvasPath = path.join(root, 'src/components/profile/FlagshipVisualsCanvas.tsx');
  const mapCanvasContent = fs.existsSync(mapCanvasPath) ? fs.readFileSync(mapCanvasPath, 'utf8') : '';
  const mapCanvasValid =
    mapCanvasContent.includes('PersonalityDNA') &&
    mapCanvasContent.includes('HexacoRadarV2') &&
    mapCanvasContent.includes('HexacoFacetHeatmap') &&
    mapCanvasContent.includes('SchwartzValuesCircle') &&
    mapCanvasContent.includes('InterpersonalStyleCompass') &&
    mapCanvasContent.includes('TraitInteractionMatrix');
  recordCheck(
    '3. Flagship visuals canvas exists with high prominence',
    mapCanvasValid,
    'FlagshipVisualsCanvas aggregates Personality DNA, HEXACO Radar, Heatmap, Values Circle, Interpersonal Compass, and Matrix',
    'FlagshipVisualsCanvas missing one or more required flagship visualizations'
  );

  // 4. 91 Facet Explorer /profile/facets exists with search, filters, and unlock cards
  const facetExplorerPath = path.join(root, 'src/components/profile/FacetExplorerV4.tsx');
  const facetExplorerContent = fs.existsSync(facetExplorerPath) ? fs.readFileSync(facetExplorerPath, 'utf8') : '';
  const facetExplorerValid =
    facetExplorerContent.includes('searchQuery') &&
    facetExplorerContent.includes('domainFilter') &&
    facetExplorerContent.includes('statusFilter') &&
    facetExplorerContent.includes('UnexploredAreasPanel');
  recordCheck(
    '4. 91 Facet Explorer exists with search, filters, and unlock cards',
    facetExplorerValid,
    'FacetExplorerV4 supports searching 91 facets, filtering by domain and measurement status, and shows unlock cards',
    'FacetExplorerV4 does not support all required search, filter, or unlock card features'
  );

  // 5. Dedicated domain pages have unique visual grammar & colors
  const personalityContent = fs.readFileSync(path.join(root, 'src/app/profile/personality/page.tsx'), 'utf8');
  const selfContent = fs.readFileSync(path.join(root, 'src/app/profile/self/page.tsx'), 'utf8');
  const emotionsContent = fs.readFileSync(path.join(root, 'src/app/profile/emotions/page.tsx'), 'utf8');
  const cognitionContent = fs.readFileSync(path.join(root, 'src/app/profile/cognition/page.tsx'), 'utf8');
  const domainPagesGrammarValid =
    personalityContent.includes('violet') &&
    selfContent.includes('indigo') &&
    emotionsContent.includes('rose') &&
    cognitionContent.includes('blue');
  recordCheck(
    '5. Domain pages have distinct visual grammar',
    domainPagesGrammarValid,
    'Personality (violet), Self (indigo), Emotions (rose), Cognition (blue) each have unique visual grammar',
    'Domain pages do not have distinct visual grammar / color themes'
  );

  // 6. Science methodology route /profile/science exists with norm status disclaimer
  const sciencePath = path.join(root, 'src/components/profile/ProfileSciencePageClient.tsx');
  const scienceContent = fs.existsSync(sciencePath) ? fs.readFileSync(sciencePath, 'utf8') : '';
  const scienceValid =
    scienceContent.includes('Toplum normlarıyla karşılaştırma henüz sunulmuyor') &&
    scienceContent.includes('Master Model V2.2') &&
    scienceContent.includes('11 Alan, 37 Boyut, 91 Alt Boyut');
  recordCheck(
    '6. Science methodology page exists with norm disclaimer',
    scienceValid,
    'ProfileSciencePageClient specifies norm status disclaimer and master model invariants',
    'Science methodology page lacks norm disclaimer or master model specs'
  );

  // 7. Career route /profile/career exists with placeholder documentation
  const careerPath = path.join(root, 'src/app/profile/career/page.tsx');
  const careerContent = fs.existsSync(careerPath) ? fs.readFileSync(careerPath, 'utf8') : '';
  const careerValid =
    careerContent.includes('Kariyer ve İlgi Alanları Haritası') &&
    careerContent.includes('RIASEC') &&
    careerContent.includes('Geliştirilme Aşamasında');
  recordCheck(
    '7. Career route exists as documented placeholder',
    careerValid,
    'Career page documents future RIASEC integration without fabricating unmeasured scores',
    'Career page missing or fabricates unmeasured scores'
  );

  // 8. Timeline actionable empty state exists with reassessment cards
  const timelineClientPath = path.join(root, 'src/components/profile/timeline/ProfileTimelineClient.tsx');
  const timelineContent = fs.existsSync(timelineClientPath) ? fs.readFileSync(timelineClientPath, 'utf8') : '';
  const timelineEmptyValid =
    timelineContent.includes('Zaman içindeki değişimleri görebilmek için') &&
    timelineContent.includes('Tekrar ölçüme uygun alanlar') &&
    timelineContent.includes('measurementEpochs');
  recordCheck(
    '8. Timeline actionable empty state with reassessment recommendations',
    timelineEmptyValid,
    'ProfileTimelineClient provides actionable guidance and candidate modules when epochs <= 1',
    'Timeline does not provide actionable empty state with reassessment suggestions'
  );

  // 9. Main /profile view is a focused 6-section psychological hub
  const unifiedProfilePath = path.join(root, 'src/components/profile/UnifiedProfileClientViewV2.tsx');
  const unifiedProfileContent = fs.existsSync(unifiedProfilePath) ? fs.readFileSync(unifiedProfilePath, 'utf8') : '';
  const unifiedHubValid =
    unifiedProfileContent.includes('section-summary') &&
    unifiedProfileContent.includes('section-fingerprint') &&
    unifiedProfileContent.includes('section-visuals') &&
    unifiedProfileContent.includes('section-domains') &&
    unifiedProfileContent.includes('section-patterns') &&
    unifiedProfileContent.includes('section-previews') &&
    !unifiedProfileContent.includes('lg:col-span-4 sticky top-20');
  recordCheck(
    '9. Main profile is a 6-section psychological hub',
    unifiedHubValid,
    'UnifiedProfileClientViewV2 implements 6 focused sections without raw mega-page dump',
    'Main profile does not implement the 6-section hub structure'
  );

  // 10. Theory Council landing page is recommendation-first with 3 evidence-grounded lenses
  const councilLandingPath = path.join(root, 'src/components/theory/TheoryCouncilLandingClient.tsx');
  const councilLandingContent = fs.existsSync(councilLandingPath) ? fs.readFileSync(councilLandingPath, 'utf8') : '';
  const councilRecommendationValid =
    councilLandingContent.includes('Profiline farklı psikoloji merceklerinden bak') &&
    councilLandingContent.includes('Sana Şu Anda En Anlamlı Olabilecek Mercekler') &&
    councilLandingContent.includes('Neden bu mercek öneriliyor?');
  recordCheck(
    '10. Theory Council landing is recommendation-first',
    councilRecommendationValid,
    'TheoryCouncilLandingClient features recommendation-first section with evidence rationale',
    'Theory Council landing is not recommendation-first'
  );

  // 11. Theory Council groups exactly 10 canonical lenses under 5 traditions
  const councilTraditionsValid =
    councilLandingContent.includes('Psikanalitik Gelenek') &&
    councilLandingContent.includes('Hümanist Gelenek') &&
    councilLandingContent.includes('Varoluşçu Gelenek') &&
    councilLandingContent.includes('Bilişsel ve Davranışçı Gelenek') &&
    councilLandingContent.includes('Bütünsel ve Süreç Odaklı Gelenek') &&
    councilLandingContent.includes("'FREUD', 'JUNG', 'ADLER'") &&
    councilLandingContent.includes("'ROGERS', 'MASLOW'") &&
    councilLandingContent.includes("'FRANKL'") &&
    councilLandingContent.includes("'BECK', 'SKINNER'") &&
    councilLandingContent.includes("'GESTALT', 'WILLIAM_JAMES'");
  recordCheck(
    '11. 10 canonical lenses grouped under 5 traditions',
    councilTraditionsValid,
    'All 10 canonical lenses organized under 5 distinct traditions (Psychoanalytic, Humanistic, Existential, CBT, Holistic)',
    'Theory Council traditions grouping does not match canonical 10 lenses'
  );

  // 12. Theory comparison includes Question-First flow with 5 curated questions
  const comparePath = path.join(root, 'src/components/theory/TheoryComparisonClient.tsx');
  const compareContent = fs.existsSync(comparePath) ? fs.readFileSync(comparePath, 'utf8') : '';
  const compareQuestionsValid =
    compareContent.includes('Bir Soruyu Farklı Kuramlarla İncele') &&
    compareContent.includes('Kendimi neden bu kadar kontrol etmeye çalışıyorum?') &&
    compareContent.includes('İlişkilerde kendimi nasıl konumlandırıyorum?') &&
    compareContent.includes('Hedeflerimi ve motivasyonumu ne yönlendiriyor?') &&
    compareContent.includes('Kendime ve hatalarıma neden bu kadar sert davranıyorum?') &&
    compareContent.includes('Karar verirken neden bu kadar çok yönlü düşünüyorum?');
  recordCheck(
    '12. Theory comparison includes Question-First flow with 5 curated questions',
    compareQuestionsValid,
    'TheoryComparisonClient implements question-first selector with 5 curated psychological questions',
    'Theory comparison lacks question-first flow or 5 curated questions'
  );

  // 13. Theory lens detail includes 8-part structure
  const lensDetailPath = path.join(root, 'src/components/theory/TheoryLensDetailClient.tsx');
  const lensDetailContent = fs.existsSync(lensDetailPath) ? fs.readFileSync(lensDetailPath, 'utf8') : '';
  const lensDetail8Parts =
    lensDetailContent.includes('1. 30 Saniyede Bu Kuram') &&
    lensDetailContent.includes('2. Profilinin Bu Mercekten Genel Resmi') &&
    lensDetailContent.includes('3. Öne Çıkan Kuramsal Temalar') &&
    lensDetailContent.includes('4. Detaylı Kuramsal Analiz') &&
    lensDetailContent.includes('5. Günlük Hayat Yansımaları') &&
    lensDetailContent.includes('6. Ölçüm Dayanakları') &&
    lensDetailContent.includes('7. Düşünme Soruları') &&
    lensDetailContent.includes('8. Yorumun Sınırları');
  recordCheck(
    '13. Theory lens detail includes 8-part structure',
    lensDetail8Parts,
    'TheoryLensDetailClient implements complete 8-part interpretation structure',
    'Theory lens detail missing one or more of the 8 required sections'
  );

  // 14. Theory lens detail includes reading depth selector
  const lensDepthValid =
    lensDetailContent.includes('Kısa Bakış') &&
    lensDetailContent.includes('Detaylı İnceleme') &&
    lensDetailContent.includes('Derin Analiz & Diyalog') &&
    lensDetailContent.includes('depthMode');
  recordCheck(
    '14. Theory lens detail reading depth selector',
    lensDepthValid,
    'TheoryLensDetailClient supports Quick, Detailed, and Deep reading depths',
    'Theory lens detail lacks reading depth selector'
  );

  // 15. No raw technical construct IDs exposed in default Theory Council UI
  const noRawIdsExposed =
    !lensDetailContent.includes('code:') &&
    !lensDetailContent.includes('constructId:') &&
    !councilLandingContent.includes('constructId:');
  recordCheck(
    '15. No technical construct IDs in default Theory UI',
    noRawIdsExposed,
    'UI displays friendly Turkish titles, theorist names, and concepts rather than internal DB keys',
    'Default Theory UI leaks raw internal IDs'
  );

  // 16. Assessment results page implements 8-step structure with no facet dumping
  const resultsPagePath = path.join(root, 'src/app/assessments/results/[sessionId]/page.tsx');
  const resultsPageContent = fs.existsSync(resultsPagePath) ? fs.readFileSync(resultsPagePath, 'utf8') : '';
  const resultsCoveragePath = path.join(root, 'src/components/results/MeasurementCoveragePanel.tsx');
  const resultsCoverageContent = fs.existsSync(resultsCoveragePath) ? fs.readFileSync(resultsCoveragePath, 'utf8') : '';
  const results8StepsValid =
    resultsPageContent.includes('ResultSummaryHero') &&
    resultsPageContent.includes('HexacoRadarSection') &&
    resultsPageContent.includes('DimensionSpectrumView') &&
    resultsPageContent.includes('StrengthsRisksPanel') &&
    resultsPageContent.includes('TensionsSynergiesPanel') &&
    resultsCoverageContent.includes('Profiline Ne Ekledi?') &&
    resultsPageContent.includes('NextAssessmentHandoff');
  recordCheck(
    '16. Assessment results page 8-step structure',
    results8StepsValid,
    'Results page implements takeaways, visualization, dimensions, daily life, interactions, profile additions, science, and handoff',
    'Assessment results page missing one or more required steps'
  );

  // 17. Hardened score language (no "ortalamanın üzerinde" without norms)
  const interpConfigPath = path.join(root, 'src/lib/assessmentInterpretationConfig.ts');
  const interpConfigContent = fs.existsSync(interpConfigPath) ? fs.readFileSync(interpConfigPath, 'utf8') : '';
  const hardenedScoreLanguage =
    !interpConfigContent.includes('ortalamanın üzerinde') &&
    interpConfigContent.includes('ölçeğin yüksek ucuna yakın');
  recordCheck(
    '17. Hardened score language (no population norm assumptions)',
    hardenedScoreLanguage,
    'Score language uses "ölçeğin yüksek ucuna yakın" without unjustified population norm assertions',
    'Found "ortalamanın üzerinde" in assessment interpretation config'
  );

  // 18. Overview page is a personalized psychological home (not an admin dashboard)
  const overviewPath = path.join(root, 'src/app/overview/page.tsx');
  const overviewContent = fs.existsSync(overviewPath) ? fs.readFileSync(overviewPath, 'utf8') : '';
  const overviewHomeValid =
    overviewContent.includes('Hoş geldin') &&
    overviewContent.includes('Son Eklenen İçgörü') &&
    overviewContent.includes('Sıradaki Önerilen Değerlendirme') &&
    overviewContent.includes('Profil Keşif İlerlemesi') &&
    overviewContent.includes('Son Tamamlanan Değerlendirme') &&
    overviewContent.includes('Kuramsal Mercek Önerisi') &&
    overviewContent.includes('Yansımalardan Son Tema');
  recordCheck(
    '18. Overview is a personalized psychological home',
    overviewHomeValid,
    'OverviewPage renders greeting, latest insight, next assessment, exploration progress, latest result, theory recommendation, and reflection theme',
    'Overview page does not implement the personalized home structure'
  );

  // Summary
  console.log('\nAudit Checks:');
  checks.forEach((c) => {
    console.log(`[${c.passed ? 'PASS' : 'FAIL'}] ${c.name} — ${c.details}`);
  });

  const success = errors.length === 0 && checks.every((c) => c.passed);
  console.log('\n' + '='.repeat(95));
  if (success) {
    console.log('✅ PROFILE EXPERIENCE V4 AUDIT PASSED: All 18 checks succeeded.');
  } else {
    console.error(`❌ PROFILE EXPERIENCE V4 AUDIT FAILED with ${errors.length} error(s):`);
    errors.forEach((err) => console.error(`  - ${err}`));
  }
  console.log('='.repeat(95));

  return { success, checks, errors };
}

if (require.main === module) {
  runProfileExperienceV4Audit()
    .then((res) => {
      process.exit(res.success ? 0 : 1);
    })
    .catch((err) => {
      console.error('Fatal error during audit:', err);
      process.exit(1);
    });
}
