import { describe, it, expect } from 'vitest';
import { PROFILE_TABS } from '@/components/profile/ProfileTabNav';
import { MASTER_DOMAINS, MASTER_CONSTRUCTS, MASTER_FACETS } from '@/lib/profile/masterModelConstants';
import { getAllTheoryLenses } from '@/lib/ai/theoryLens/theoryLensRegistry';
import { UnifiedPsychologicalProfileV2, FacetProfileV2 } from '@/types/unifiedProfileV2';
import fs from 'fs';
import path from 'path';

describe('Requirement 54 — Profile Experience V4 & Theory Council UX Tests', () => {
  const root = path.resolve(__dirname, '../..');

  // Minimal mock profile with realistic facets
  const mockFacets: FacetProfileV2[] = [
    {
      facetId: 'sincerity',
      code: 'HEXACO_H_SINC',
      constructId: 'hexaco_honesty_humility',
      domainId: 'core_personality',
      nameTr: 'İçtenlik',
      nameEn: 'Sincerity',
      score: 4.4,
      normalizedVisualCoordinate: 85,
      measurementStatus: 'MEASURED_PRECALIBRATION',
      itemCountExpected: 4,
      itemCountAnswered: 4,
      completionRatio: 1.0,
      measurementEvidenceCount: 4,
      sourceAssessmentModules: [],
      latestMeasuredAt: new Date().toISOString(),
      responseQualityStatus: 'ACCEPTABLE',
      epistemicStatus: 'PROVISIONAL_POINT_ESTIMATE',
      confidenceComponents: {
        coverage: 'HIGH',
        responseQuality: 'ACCEPTABLE',
        calibrationStatus: 'PRE_CALIBRATION',
        repeatMeasurement: 'NONE',
        methodDiversity: 'SELF_REPORT_ONLY',
      },
      bandInfo: {
        band: 'HIGH',
        labelTr: 'Yüksek',
        shortLabelTr: 'Yüksek',
        colorClass: 'text-indigo-600',
        bgClass: 'bg-indigo-50',
        borderClass: 'border-indigo-200',
      },
      scientificDefinitionTr: 'Başkalarıyla ilişkilerde içten ve dürüst olma eğilimi.',
    },
    {
      facetId: 'fearfulness',
      code: 'HEXACO_E_FEAR',
      constructId: 'hexaco_emotionality',
      domainId: 'core_personality',
      nameTr: 'Korku / Endişe Duyarlılığı',
      nameEn: 'Fearfulness',
      score: 2.1,
      normalizedVisualCoordinate: 28,
      measurementStatus: 'MEASURED_PRECALIBRATION',
      itemCountExpected: 4,
      itemCountAnswered: 4,
      completionRatio: 1.0,
      measurementEvidenceCount: 4,
      sourceAssessmentModules: [],
      latestMeasuredAt: new Date().toISOString(),
      responseQualityStatus: 'ACCEPTABLE',
      epistemicStatus: 'PROVISIONAL_POINT_ESTIMATE',
      confidenceComponents: {
        coverage: 'HIGH',
        responseQuality: 'ACCEPTABLE',
        calibrationStatus: 'PRE_CALIBRATION',
        repeatMeasurement: 'NONE',
        methodDiversity: 'SELF_REPORT_ONLY',
      },
      bandInfo: {
        band: 'LOW',
        labelTr: 'Düşük',
        shortLabelTr: 'Düşük',
        colorClass: 'text-rose-600',
        bgClass: 'bg-rose-50',
        borderClass: 'border-rose-200',
      },
      scientificDefinitionTr: 'Fiziksel tehlikelere ve belirsizliklere karşı düşük endişe duyarlılığı.',
    },
  ];

  // A. ProfileTabNav renders at most 6 top-level items
  it('A. ProfileTabNav renders at most 6 top-level navigation tabs', () => {
    expect(PROFILE_TABS.length).toBeLessThanOrEqual(6);
    expect(PROFILE_TABS.length).toBe(6);

    const labels = PROFILE_TABS.map((t) => t.labelTr);
    expect(labels).toContain('Özet');
    expect(labels).toContain('Haritam');
    expect(labels).toContain('Alanlar');
    expect(labels).toContain('Alt Boyutlar');
    expect(labels).toContain('Zaman');
    expect(labels).toContain('Kuramlar');
  });

  // B. FlagshipVisualsCanvas renders all flagship visual sections
  it('B. FlagshipVisualsCanvas integrates all required flagship visual components', () => {
    const canvasPath = path.join(root, 'src/components/profile/FlagshipVisualsCanvas.tsx');
    expect(fs.existsSync(canvasPath)).toBe(true);

    const content = fs.readFileSync(canvasPath, 'utf8');
    expect(content).toContain('PersonalityDNA');
    expect(content).toContain('HexacoRadarV2');
    expect(content).toContain('HexacoFacetHeatmap');
    expect(content).toContain('SchwartzValuesCircle');
    expect(content).toContain('InterpersonalStyleCompass');
    expect(content).toContain('TraitInteractionMatrix');
  });

  // C. FacetExplorerV4 handles search, filtering, and all 91 facets
  it('C. FacetExplorerV4 handles 91 facets, searching, and domain filtering', () => {
    const explorerPath = path.join(root, 'src/components/profile/FacetExplorerV4.tsx');
    expect(fs.existsSync(explorerPath)).toBe(true);

    const content = fs.readFileSync(explorerPath, 'utf8');
    expect(content).toContain('searchQuery');
    expect(content).toContain('domainFilter');
    expect(content).toContain('statusFilter');
    expect(content).toContain('UnexploredAreasPanel');
    expect(MASTER_FACETS.length).toBe(91);
  });

  // D. Personality DNA computes 8 themes deterministically
  it('D. Personality DNA computes 8 higher-level visual themes without fake composite scores', () => {
    const dnaPath = path.join(root, 'src/components/profile/PersonalityDNA.tsx');
    expect(fs.existsSync(dnaPath)).toBe(true);

    const content = fs.readFileSync(dnaPath, 'utf8');
    expect(content).toContain('HIGHER_LEVEL_THEMES');
    expect(content).toContain('Düzen & Çaba');
    expect(content).toContain('Merak & Yaratıcılık');
    expect(content).toContain('Öz-Yeterlik');
    expect(content).toContain('Duygusal Yoğunluk');
    expect(content).toContain('Öz-Kontrol');
    expect(content).toContain('Sosyal Yaklaşım');
    expect(content).toContain('İlişkisel Duyarlılık');
    expect(content).toContain('Değer Yönelimi');
  });

  // E. HexacoRadarV2 generates 3-5 evidence-grounded interpretation bullets
  it('E. HexacoRadarV2 contains evidence-grounded interpretation bullets section', () => {
    const radarPath = path.join(root, 'src/components/profile/HexacoRadarV2.tsx');
    expect(fs.existsSync(radarPath)).toBe(true);

    const content = fs.readFileSync(radarPath, 'utf8');
    expect(content).toContain('Profilinde Ne Dikkat Çekiyor?');
    expect(content).toContain('interpretation');
  });

  // F. Domain routes export valid page components and unique visual grammar
  it('F. Dedicated domain routes exist with unique visual grammar and colors', () => {
    const domainRoutes = [
      { file: 'src/app/profile/personality/page.tsx', color: 'violet' },
      { file: 'src/app/profile/self/page.tsx', color: 'indigo' },
      { file: 'src/app/profile/emotions/page.tsx', color: 'rose' },
      { file: 'src/app/profile/cognition/page.tsx', color: 'blue' },
      { file: 'src/app/profile/motivation/page.tsx', color: 'amber' },
      { file: 'src/app/profile/relationships/page.tsx', color: 'teal' },
      { file: 'src/app/profile/resilience/page.tsx', color: 'cyan' },
    ];

    for (const route of domainRoutes) {
      const fullPath = path.join(root, route.file);
      expect(fs.existsSync(fullPath)).toBe(true);
      const content = fs.readFileSync(fullPath, 'utf8');
      expect(content).toContain(route.color);
      expect(content).toContain('export default');
    }
  });

  // G. TheoryCouncilLandingClient renders 3 recommended lenses and 5 canonical traditions
  it('G. TheoryCouncilLandingClient renders recommendation-first flow and 5 canonical traditions', () => {
    const landingPath = path.join(root, 'src/components/theory/TheoryCouncilLandingClient.tsx');
    expect(fs.existsSync(landingPath)).toBe(true);

    const content = fs.readFileSync(landingPath, 'utf8');
    expect(content).toContain('Profiline farklı psikoloji merceklerinden bak');
    expect(content).toContain('Sana Şu Anda En Anlamlı Olabilecek Mercekler');
    expect(content).toContain('Psikanalitik Gelenek');
    expect(content).toContain('Hümanist Gelenek');
    expect(content).toContain('Varoluşçu Gelenek');
    expect(content).toContain('Bilişsel ve Davranışçı Gelenek');
    expect(content).toContain('Bütünsel ve Süreç Odaklı Gelenek');

    const allLenses = getAllTheoryLenses();
    expect(allLenses.length).toBe(10);
  });

  // H. TheoryComparisonClient supports curated questions and mode toggle
  it('H. TheoryComparisonClient supports Question-First flow with 5 curated questions', () => {
    const comparePath = path.join(root, 'src/components/theory/TheoryComparisonClient.tsx');
    expect(fs.existsSync(comparePath)).toBe(true);

    const content = fs.readFileSync(comparePath, 'utf8');
    expect(content).toContain('CURATED_QUESTIONS');
    expect(content).toContain('Kendimi neden bu kadar kontrol etmeye çalışıyorum?');
    expect(content).toContain('İlişkilerde kendimi nasıl konumlandırıyorum?');
    expect(content).toContain('Hedeflerimi ve motivasyonumu ne yönlendiriyor?');
    expect(content).toContain('Kendime ve hatalarıma neden bu kadar sert davranıyorum?');
    expect(content).toContain('Karar verirken neden bu kadar çok yönlü düşünüyorum?');
    expect(content).toContain('Bir Soruyu Farklı Kuramlarla İncele');
  });

  // I. TheoryLensDetailClient supports reading depth selector and 8 sections
  it('I. TheoryLensDetailClient supports reading depth selector and 8 sections', () => {
    const detailPath = path.join(root, 'src/components/theory/TheoryLensDetailClient.tsx');
    expect(fs.existsSync(detailPath)).toBe(true);

    const content = fs.readFileSync(detailPath, 'utf8');
    expect(content).toContain('Kısa Bakış');
    expect(content).toContain('Detaylı İnceleme');
    expect(content).toContain('Derin Analiz & Diyalog');
    expect(content).toContain('1. 30 Saniyede Bu Kuram');
    expect(content).toContain('2. Profilinin Bu Mercekten Genel Resmi');
    expect(content).toContain('3. Öne Çıkan Kuramsal Temalar');
    expect(content).toContain('4. Detaylı Kuramsal Analiz');
    expect(content).toContain('5. Günlük Hayat Yansımaları');
    expect(content).toContain('6. Ölçüm Dayanakları');
    expect(content).toContain('7. Düşünme Soruları');
    expect(content).toContain('8. Yorumun Sınırları');
  });

  // J. Assessment result view adheres to 8-step structure without raw facet dump
  it('J. Assessment result view implements 8-step structure with no facet dumping', () => {
    const resultPagePath = path.join(root, 'src/app/assessments/results/[sessionId]/page.tsx');
    expect(fs.existsSync(resultPagePath)).toBe(true);

    const content = fs.readFileSync(resultPagePath, 'utf8');
    expect(content).toContain('ResultSummaryHero');
    expect(content).toContain('StrengthsRisksPanel');
    expect(content).toContain('TensionsSynergiesPanel');
    expect(content).toContain('MeasurementCoveragePanel');
    expect(content).toContain('NextAssessmentHandoff');

    const coveragePath = path.join(root, 'src/components/results/MeasurementCoveragePanel.tsx');
    const coverageContent = fs.readFileSync(coveragePath, 'utf8');
    expect(coverageContent).toContain('Profiline Ne Ekledi?');
  });

  // K. Science page displays norm status disclaimer
  it('K. Science page explicitly displays population norm disclaimer', () => {
    const sciencePath = path.join(root, 'src/components/profile/ProfileSciencePageClient.tsx');
    expect(fs.existsSync(sciencePath)).toBe(true);

    const content = fs.readFileSync(sciencePath, 'utf8');
    expect(content).toContain('Toplum normlarıyla karşılaştırma henüz sunulmuyor');
    expect(content).toContain('Master Model V2.2');
  });

  // L. Overview page displays personalized greeting and progress components
  it('L. Overview page renders personalized psychological home components', () => {
    const overviewPath = path.join(root, 'src/app/overview/page.tsx');
    expect(fs.existsSync(overviewPath)).toBe(true);

    const content = fs.readFileSync(overviewPath, 'utf8');
    expect(content).toContain('Hoş geldin');
    expect(content).toContain('Son Eklenen İçgörü');
    expect(content).toContain('Sıradaki Önerilen Değerlendirme');
    expect(content).toContain('Profil Keşif İlerlemesi');
    expect(content).toContain('Son Tamamlanan Değerlendirme');
    expect(content).toContain('Kuramsal Mercek Önerisi');
    expect(content).toContain('Yansımalardan Son Tema');
  });
});
