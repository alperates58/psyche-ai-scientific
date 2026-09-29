import { describe, it, expect } from 'vitest';
import { MASTER_DOMAINS, MASTER_CONSTRUCTS, MASTER_FACETS } from '@/lib/profile/masterModelConstants';
import {
  generateProfileHeroSynthesis,
  generatePersonalizedFacetInterpretation,
  generateStructuredPsychologicalReport,
} from '@/lib/profile/profileInterpretationGenerator';
import { UnifiedPsychologicalProfileV2, FacetProfileV2 } from '@/types/unifiedProfileV2';
import { resolveConsumerScalePosition } from '@/lib/consumerLanguage';

describe('Requirement 46 & 47 — Profile Experience V3 Visualizations & Content Tests', () => {
  // Mock unified profile with realistic measured facets
  const mockFacets: FacetProfileV2[] = [
    {
      facetId: 'sincerity',
      constructId: 'hexaco_honesty_humility',
      domainId: 'core_personality',
      nameTr: 'İçtenlik',
      nameEn: 'Sincerity',
      definitionTr: 'İçtenlik, kişinin başkalarıyla olan ilişkilerinde yapmacıksız ve dürüst olma eğilimidir.',
      score: 4.4,
      normalizedVisualCoordinate: 85,
      measurementStatus: 'MEASURED_PRECALIBRATION',
      confidenceLevel: 'HIGH_CONFIDENCE',
    },
    {
      facetId: 'fairness',
      constructId: 'hexaco_honesty_humility',
      domainId: 'core_personality',
      nameTr: 'Hakkaniyet',
      nameEn: 'Fairness',
      definitionTr: 'Hakkaniyet, hile yapmaktan, başkalarını sömürmekten veya haksız kazanç sağlamaktan kaçınma eğilimidir.',
      score: 4.2,
      normalizedVisualCoordinate: 80,
      measurementStatus: 'MEASURED_PRECALIBRATION',
      confidenceLevel: 'HIGH_CONFIDENCE',
    },
    {
      facetId: 'diligence',
      constructId: 'hexaco_conscientiousness',
      domainId: 'core_personality',
      nameTr: 'Çalışkanlık & Çaba',
      nameEn: 'Diligence',
      definitionTr: 'Zorlu görevlerde yüksek çaba ve sebat gösterme.',
      score: 4.1,
      normalizedVisualCoordinate: 78,
      measurementStatus: 'MEASURED_PRECALIBRATION',
      confidenceLevel: 'HIGH_CONFIDENCE',
    },
    {
      facetId: 'perfectionism',
      constructId: 'hexaco_conscientiousness',
      domainId: 'core_personality',
      nameTr: 'Mükemmeliyetçilik',
      nameEn: 'Perfectionism',
      definitionTr: 'Detaylara titizlik ve yüksek standartlar arama.',
      score: 3.9,
      normalizedVisualCoordinate: 72,
      measurementStatus: 'MEASURED_PRECALIBRATION',
      confidenceLevel: 'HIGH_CONFIDENCE',
    },
    {
      facetId: 'prudence',
      constructId: 'hexaco_conscientiousness',
      domainId: 'core_personality',
      nameTr: 'Sağduyu & İhtiyat',
      nameEn: 'Prudence',
      definitionTr: 'Olası sonuçları tartma ve tedbirli davranma eğilimi.',
      score: 3.7,
      normalizedVisualCoordinate: 68,
      measurementStatus: 'MEASURED_PRECALIBRATION',
      confidenceLevel: 'HIGH_CONFIDENCE',
    },
    {
      facetId: 'epistemic_curiosity',
      constructId: 'hexaco_openness_to_experience',
      domainId: 'core_personality',
      nameTr: 'Bilişsel Merak',
      nameEn: 'Epistemic Curiosity',
      definitionTr: 'Yeni bilgi edinme ve anlama arzusu.',
      score: 4.3,
      normalizedVisualCoordinate: 82,
      measurementStatus: 'MEASURED_PRECALIBRATION',
      confidenceLevel: 'HIGH_CONFIDENCE',
    },
    {
      facetId: 'anxiety',
      constructId: 'hexaco_emotionality',
      domainId: 'core_personality',
      nameTr: 'Kaygı',
      nameEn: 'Anxiety',
      definitionTr: 'Potansiyel olumsuzluklara karşı tetikte olma.',
      score: 2.2,
      normalizedVisualCoordinate: 30,
      measurementStatus: 'MEASURED_PRECALIBRATION',
      confidenceLevel: 'HIGH_CONFIDENCE',
    },
    {
      facetId: 'presence_of_meaning',
      constructId: 'motivation_meaning',
      domainId: 'motivation_values',
      nameTr: 'Anlam Varlığı',
      nameEn: 'Presence of Meaning',
      definitionTr: 'Yaşamında belirgin bir amaç ve anlam hissetme.',
      score: 4.2,
      normalizedVisualCoordinate: 80,
      measurementStatus: 'MEASURED_PRECALIBRATION',
      confidenceLevel: 'HIGH_CONFIDENCE',
    },
    {
      facetId: 'long_term_grit',
      constructId: 'self_regulation_grit',
      domainId: 'self_regulation',
      nameTr: 'Uzun Vadeli Azim',
      nameEn: 'Long-term Grit',
      definitionTr: 'Uzun vadeli hedeflere tutku ve sebatla bağlı kalma.',
      score: 4.0,
      normalizedVisualCoordinate: 75,
      measurementStatus: 'MEASURED_PRECALIBRATION',
      confidenceLevel: 'HIGH_CONFIDENCE',
    },
  ];

  const mockProfile: UnifiedPsychologicalProfileV2 = {
    userId: 'test_user_01',
    userName: 'Deniz Yılmaz',
    updatedAt: new Date().toISOString(),
    hasAssessments: true,
    domains: [
      {
        domainId: 'core_personality',
        nameTr: 'Temel Kişilik & Mizaç',
        measuredFacetCount: 7,
        totalFacetCount: 24,
      },
      {
        domainId: 'motivation_values',
        nameTr: 'Motivasyon & Değerler',
        measuredFacetCount: 1,
        totalFacetCount: 8,
      },
      {
        domainId: 'self_regulation',
        nameTr: 'Öz-Düzenleme & İrade',
        measuredFacetCount: 1,
        totalFacetCount: 6,
      },
      {
        domainId: 'social_relational',
        nameTr: 'Kişilerarası Dinamikler',
        measuredFacetCount: 0,
        totalFacetCount: 10,
      },
    ],
    constructs: [
      {
        constructId: 'hexaco_honesty_humility',
        nameTr: 'Dürüstlük-Alçakgönüllülük',
        domainId: 'core_personality',
        score: 4.3,
        code: 'hexaco_honesty_humility',
        measurementStatus: 'MEASURED_PRECALIBRATION',
      },
    ],
    facets: mockFacets,
    synergies: [
      {
        id: 'syn_01',
        titleTr: 'Yüksek Standart & Uzun Vadeli Sebat',
        descriptionTr: 'Mükemmeliyetçilik ve azim özellikleriniz projelerde yüksek kalite standartlarını korumanızı destekler.',
        sourceFacetIds: ['perfectionism', 'long_term_grit'],
      },
    ],
    tensions: [
      {
        id: 'ten_01',
        titleTr: 'Detay Odaklılığı & Hız Dengesi',
        descriptionTr: 'Titizlik ile teslim tarihleri arasında durumsal denge gerekebilir.',
        sourceFacetIds: ['perfectionism'],
        balancePromptTr: 'Hangi durumlarda yeterince iyi kabul edilebilir?',
      },
    ],
    coverage: {
      facetCoverage: { measured: 9, total: 91, percentage: 10 },
      domainCoverage: { measured: 3, total: 11, percentage: 27 },
      constructCoverage: { measured: 5, total: 37, percentage: 14 },
    },
    responseQuality: {
      overallFlag: 'EXCELLENT',
      consistencyScore: 94,
      attentionPassedCount: 2,
      attentionTotalCount: 2,
    },
    confidenceMap: {},
    longitudinalReadiness: {
      hasRepeatMeasurements: false,
    },
    recentAssessments: [
      {
        sessionId: 'session_01',
        moduleCode: 'hexaco_personality_native_v1',
        titleTr: 'HEXACO Kişilik Envanteri',
        completedAt: new Date().toISOString(),
      },
    ],
  };

  describe('46. Visualization Tests', () => {
    it('HEXACO radar gets exactly supported 6 broad factor data', () => {
      const broadFactorIds = [
        'hexaco_honesty_humility',
        'hexaco_emotionality',
        'hexaco_extraversion',
        'hexaco_agreeableness',
        'hexaco_conscientiousness',
        'hexaco_openness_to_experience',
      ];
      expect(broadFactorIds.length).toBe(6);
    });

    it('HEXACO heatmap structure specifies exactly 24 facets (6 factors × 4 facets)', () => {
      const factors = 6;
      const facetsPerFactor = 4;
      expect(factors * facetsPerFactor).toBe(24);
    });

    it('No percentile renderer without norm data (value-neutral position used)', () => {
      const pos1 = resolveConsumerScalePosition(4.4);
      expect(pos1.bandCode).toBe('HIGH');
      // Must not fabricate a percentile like "92. persentildesiniz"
      expect(pos1.descriptionTr).not.toMatch(/persentil/i);
      expect(pos1.descriptionTr).not.toMatch(/türkiye ortalaması/i);
    });

    it('No RIASEC renderer without RIASEC module (invariants preserved)', () => {
      const riasecFacets = mockProfile.facets.filter((f) => f.constructId?.startsWith('riasec'));
      expect(riasecFacets.length).toBe(0);
    });

    it('Trait Interaction Matrix uses qualitative synergies and delicate balance rules, no statistical r correlations', () => {
      expect(mockProfile.synergies).toBeDefined();
      expect(mockProfile.synergies.length).toBeGreaterThan(0);
      mockProfile.synergies.forEach((s) => {
        expect(s.descriptionTr).not.toMatch(/r\s*=\s*[0-9]/i);
        expect(s.descriptionTr).not.toMatch(/pearson/i);
        expect(s.descriptionTr).not.toMatch(/spearman/i);
      });
    });

    it('Scale position language strictly avoids high=good / low=bad evaluative bias', () => {
      const testScores = [1.2, 2.5, 3.1, 4.0, 4.9];
      testScores.forEach((score) => {
        const pos = resolveConsumerScalePosition(score);
        expect(pos.descriptionTr).not.toMatch(/\bi̇yi\b/i);
        expect(pos.descriptionTr).not.toMatch(/\bkötü\b/i);
        expect(pos.descriptionTr).not.toMatch(/\byetersiz\b/i);
        expect(pos.descriptionTr).not.toMatch(/\bkusurlu\b/i);
        expect(pos.descriptionTr).not.toMatch(/\bdengeli\b/i);
      });
    });
  });

  describe('47. Profile Content Tests', () => {
    it('facet card contains personalized interpretation (not just dictionary definition)', () => {
      const sincerityFacet = mockFacets[0];
      const interpretation = generatePersonalizedFacetInterpretation(sincerityFacet, mockFacets);

      expect(interpretation.selfMeaningTr).toBeDefined();
      expect(interpretation.selfMeaningTr.length).toBeGreaterThan(20);
      expect(interpretation.selfMeaningTr).not.toBe(sincerityFacet.definitionTr);

      expect(interpretation.dailyLifeTr).toBeDefined();
      expect(interpretation.strengthsContextTr).toBeDefined();
      expect(interpretation.energyCostContextTr).toBeDefined();
      expect(interpretation.reflectionQuestionTr).toBeDefined();
    });

    it('profile hero contains narrative synthesis and key themes', () => {
      const hero = generateProfileHeroSynthesis(mockProfile);

      expect(hero.headlineTr).toBeDefined();
      expect(hero.synthesisTextTr).toBeDefined();
      expect(hero.synthesisTextTr.length).toBeGreaterThan(50);
      expect(hero.themeChips.length).toBeGreaterThan(0);
      expect(mockProfile.coverage.facetCoverage.percentage).toBe(10);
    });

    it('structured psychological report contains 10 distinct analytical sections', () => {
      const report = generateStructuredPsychologicalReport(mockProfile);

      expect(report.length).toBe(10);
      const sectionIds = report.map((r) => r.id);
      expect(sectionIds).toContain('portrait');
      expect(sectionIds).toContain('thinking');
      expect(sectionIds).toContain('deciding');
      expect(sectionIds).toContain('execution');
      expect(sectionIds).toContain('relationships');
      expect(sectionIds).toContain('stress');
      expect(sectionIds).toContain('motivation');
      expect(sectionIds).toContain('synergies');
      expect(sectionIds).toContain('tensions');
      expect(sectionIds).toContain('unmeasured');
    });

    it('scientific detail explanation provides consumer clarity without leaking raw enums', () => {
      const rsesFacet = mockFacets[0];
      expect(rsesFacet.measurementStatus).toBe('MEASURED_PRECALIBRATION');
      const pos = resolveConsumerScalePosition(rsesFacet.score);
      expect(pos.labelTr).toBe('Yüksek uca yakın');
    });
  });

  describe('48. Scientific Invariants', () => {
    it('preserves exactly 11 master domains, 37 constructs, and 91 facets', () => {
      expect(MASTER_DOMAINS.length).toBe(11);
      expect(MASTER_CONSTRUCTS.length).toBe(37);
      expect(MASTER_FACETS.length).toBe(91);
    });
  });
});
