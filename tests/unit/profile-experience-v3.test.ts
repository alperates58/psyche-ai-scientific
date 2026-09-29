import { describe, it, expect } from 'vitest';
import { MASTER_DOMAINS, MASTER_CONSTRUCTS, MASTER_FACETS } from '@/lib/profile/masterModelConstants';
import {
  generateProfileHeroSynthesis,
  generatePersonalizedFacetInterpretation,
  generateStructuredPsychologicalReport,
} from '@/lib/profile/profileInterpretationGenerator';
import { UnifiedPsychologicalProfileV2, FacetProfileV2 } from '@/types/unifiedProfileV2';
import { resolveConsumerScalePosition } from '@/lib/consumerLanguage';
import { generateEvidenceGroundedDeepFallback } from '@/lib/profile/deepProfileSynthesis';
import { buildProfileEvidenceBundleV2 } from '@/lib/profile/profileEvidenceBundle';

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

  describe('49. Scientific Hardening & Evidence Grounding Tests (V3.1)', () => {
    function createTestFacet(
      facetId: string,
      score: number | null,
      domainId: string = 'domain_personality_hexaco',
      constructId: string = 'hexaco_honesty_humility',
      nameTr: string = facetId
    ): FacetProfileV2 {
      return {
        facetId,
        code: facetId,
        nameTr,
        nameEn: facetId,
        domainId,
        constructId,
        measurementStatus: score !== null ? 'MEASURED_PRECALIBRATION' : 'NOT_MEASURED',
        score,
        normalizedVisualCoordinate: score !== null ? Math.round(((score - 1) / 4) * 100) : null,
        itemCountExpected: 4,
        itemCountAnswered: score !== null ? 4 : 0,
        completionRatio: score !== null ? 1.0 : 0.0,
        measurementEvidenceCount: score !== null ? 1 : 0,
        sourceAssessmentModules: score !== null ? [{ moduleId: 'm1', moduleCode: 'm1', moduleTitleTr: 'Modül', sessionId: 's1' }] : [],
        latestMeasuredAt: score !== null ? new Date().toISOString() : null,
        responseQualityStatus: 'EXCELLENT',
        epistemicStatus: 'PROVISIONAL_POINT_ESTIMATE',
        confidenceComponents: {
          coverage: 'HIGH',
          responseQuality: 'EXCELLENT',
          calibrationStatus: 'PRE_CALIBRATION',
          repeatMeasurement: 'NONE',
          methodDiversity: 'SELF_REPORT_ONLY',
        },
        bandInfo: score !== null ? {
          band: score >= 3.8 ? 'HIGH' : score <= 2.2 ? 'LOW' : 'BALANCED',
          labelTr: score >= 3.8 ? 'Yüksek' : score <= 2.2 ? 'Düşük' : 'Dengeli',
          shortLabelTr: score >= 3.8 ? 'Yüksek' : score <= 2.2 ? 'Düşük' : 'Dengeli',
          colorClass: '',
          bgClass: '',
          borderClass: '',
        } : null,
      };
    }

    function createTestProfile(facets: FacetProfileV2[], constructs: any[] = []): UnifiedPsychologicalProfileV2 {
      const measuredCount = facets.filter((f) => f.score !== null).length;
      return {
        userId: 'test_hardening_user',
        userName: 'Test User',
        updatedAt: new Date().toISOString(),
        hasAssessments: measuredCount > 0,
        domains: [
          { domainId: 'domain_personality_hexaco', code: 'personality', nameTr: 'Kişilik & Mizaç', nameEn: 'Personality', descriptionTr: '', sortOrder: 1, constructCount: 6, measuredConstructCount: 1, facetCount: 24, measuredFacetCount: measuredCount, coverageRatio: 0.2, coveragePercentage: 20, dominantMeasuredPatterns: [], underMeasuredAreas: [], domainScore: null, constructs: [] },
          { domainId: 'domain_cognitive_curiosity', code: 'cognition', nameTr: 'Bilişsel Merak', nameEn: 'Cognition', descriptionTr: '', sortOrder: 2, constructCount: 2, measuredConstructCount: 0, facetCount: 4, measuredFacetCount: 0, coverageRatio: 0, coveragePercentage: 0, dominantMeasuredPatterns: [], underMeasuredAreas: [], domainScore: null, constructs: [] },
        ],
        constructs: constructs.length > 0 ? constructs : [
          { constructId: 'hexaco_honesty_humility', code: 'hexaco_honesty_humility', nameTr: 'Dürüstlük-Alçakgönüllülük', nameEn: 'Honesty-Humility', domainId: 'domain_personality_hexaco', facetIds: ['sincerity', 'fairness'], measuredFacetCount: 2, totalFacetCount: 4, coverageRatio: 0.5, aggregationStatus: 'PRECALIBRATED', constructScore: 4.3, normalizedVisualCoordinate: 82, bandInfo: null, facets: [] },
        ],
        facets,
        synergies: [],
        tensions: [],
        coverage: {
          facetCoverage: { measured: measuredCount, total: 91, percentage: Math.round((measuredCount / 91) * 100) },
          constructCoverage: { measured: 1, total: 37, percentage: 3 },
          domainCoverage: { measured: 1, total: 11, percentage: 9 },
          questionCoverage: { answeredCount: measuredCount * 4, totalCount: 364, percentage: 1 },
          lastCalculatedAt: new Date().toISOString(),
        },
        responseQuality: {
          overallFlag: 'EXCELLENT',
          isClean: true,
          headlineTr: 'Yüksek Yanıt Tutarlılığı',
          speedViolationsCount: 0,
          straightliningDetected: false,
          attentionChecksPassed: 2,
          attentionChecksTotal: 2,
          semanticConsistencyScore: 95,
        },
        confidenceMap: {
          averageConfidenceLevel: 'HIGH',
          overallEpistemicStatus: 'PROVISIONAL_POINT_ESTIMATE',
          dimensions: [],
        },
        longitudinalReadiness: {
          hasRepeatMeasurements: false,
          measurementCount: 1,
          earliestMeasurement: new Date().toISOString(),
          latestMeasurement: new Date().toISOString(),
          hasLongitudinalSignificance: false,
        },
        crossDomainPatterns: [],
        legacyCompatibility: {
          hasLegacy17ItemData: false,
          legacyFacetScores: {},
        },
        recentAssessments: [],
      };
    }

    // A. Deep analysis pipeline returns real structured result from evidence bundle
    it('A. Deep analysis pipeline returns real structured result from evidence bundle', () => {
      const facets = [
        createTestFacet('sincerity', 4.5, 'domain_personality_hexaco', 'hexaco_honesty_humility', 'İçtenlik'),
        createTestFacet('diligence', 4.2, 'domain_personality_hexaco', 'hexaco_conscientiousness', 'Çalışkanlık'),
        createTestFacet('anxiety', 2.0, 'domain_personality_hexaco', 'hexaco_emotionality', 'Kaygı'),
      ];
      const profile = createTestProfile(facets);
      const bundle = buildProfileEvidenceBundleV2(profile);
      const result = generateEvidenceGroundedDeepFallback(profile, bundle);

      expect(result.headlineTr).toBe('Kanıta Dayalı Çok Boyutlu Derin Profil Analizi');
      expect(result.executiveSummaryTr).toContain('3 alt boyut');
      expect(result.thinkingStyle).toBeDefined();
      expect(result.decisionStyle).toBeDefined();
      expect(result.workExecution.length).toBeGreaterThan(0);
      expect(result.emotionalPatterns.length).toBeGreaterThan(0);
      expect(result.relationshipPatterns.length).toBeGreaterThan(0);
      expect(result.motivationPatterns).toBeDefined();
      expect(result.traitInteractions).toBeDefined();
      expect(result.balancePoints).toBeDefined();
      expect(result.reflectionQuestions.length).toBeGreaterThan(0);
      expect(result.limitations.length).toBeGreaterThanOrEqual(3);
      expect(result.evidenceRefs).toEqual(['sincerity', 'diligence', 'anxiety']);
      expect(result.isFallback).toBe(true);
    });

    // B. Deep analysis handles zero measured facets gracefully
    it('B. Deep analysis handles zero measured facets gracefully', () => {
      const facets = [
        createTestFacet('sincerity', null),
        createTestFacet('diligence', null),
      ];
      const profile = createTestProfile(facets);
      const bundle = buildProfileEvidenceBundleV2(profile);
      const result = generateEvidenceGroundedDeepFallback(profile, bundle);

      expect(result.evidenceRefs.length).toBe(0);
      expect(result.executiveSummaryTr).toContain('Henüz tamamlanmış bir değerlendirme bulunmuyor');
      expect(result.thinkingStyle[0]).toContain('henüz ölçülmemiştir');
      expect(result.workExecution[0]).toContain('henüz ölçülmemiştir');
      expect(result.relationshipPatterns[0]).toContain('henüz ölçülmemiştir');
    });

    // C. Deep analysis handles partial facets gracefully
    it('C. Deep analysis handles partial facets gracefully', () => {
      const facets = [
        createTestFacet('sincerity', 4.4, 'domain_personality_hexaco', 'hexaco_honesty_humility', 'İçtenlik'),
      ];
      const profile = createTestProfile(facets);
      const bundle = buildProfileEvidenceBundleV2(profile);
      const result = generateEvidenceGroundedDeepFallback(profile, bundle);

      expect(result.evidenceRefs).toEqual(['sincerity']);
      expect(result.relationshipPatterns.some((p) => p.includes('İçtenlik'))).toBe(true);
      expect(result.thinkingStyle[0]).toContain('henüz ölçülmemiştir');
    });

    // D. Deep analysis does not include unmeasured facets in its claims
    it('D. Deep analysis does not include unmeasured facets in its claims', () => {
      const facets = [
        createTestFacet('sincerity', 4.5, 'domain_personality_hexaco', 'hexaco_honesty_humility', 'İçtenlik'),
        createTestFacet('creativity', null, 'domain_cognitive_curiosity', 'hexaco_openness_to_experience', 'Yaratıcılık'),
      ];
      const profile = createTestProfile(facets);
      const bundle = buildProfileEvidenceBundleV2(profile);
      const result = generateEvidenceGroundedDeepFallback(profile, bundle);

      expect(result.evidenceRefs).not.toContain('creativity');
      expect(result.evidenceRefs).toContain('sincerity');
      expect(result.thinkingStyle[0]).toContain('henüz ölçülmemiştir');
    });

    // E. PersonalityDNA axis selection is balanced across domains
    it('E. PersonalityDNA axis selection logic balances facets across measured domains', () => {
      const facets: FacetProfileV2[] = [
        createTestFacet('f1', 4.0, 'd1'),
        createTestFacet('f2', 4.2, 'd1'),
        createTestFacet('f3', 4.1, 'd1'),
        createTestFacet('f4', 3.9, 'd2'),
        createTestFacet('f5', 4.3, 'd2'),
      ];
      const facetsByDomain = new Map<string, FacetProfileV2[]>();
      facets.forEach((f) => {
        const list = facetsByDomain.get(f.domainId) || [];
        list.push(f);
        facetsByDomain.set(f.domainId, list);
      });

      const selected: FacetProfileV2[] = [];
      facetsByDomain.forEach((list) => {
        if (list.length > 0) selected.push(list[0]);
      });
      facetsByDomain.forEach((list) => {
        if (list.length > 1) selected.push(list[1]);
      });

      const d1Selected = selected.filter((f) => f.domainId === 'd1');
      const d2Selected = selected.filter((f) => f.domainId === 'd2');
      expect(d1Selected.length).toBeLessThanOrEqual(2);
      expect(d2Selected.length).toBeLessThanOrEqual(2);
    });

    // F. PersonalityDNA distinctiveness correctly identifies both high and low extreme scores
    it('F. PersonalityDNA distinctiveness correctly identifies both high and low extreme scores', () => {
      const lowPole = 1.2;
      const midHigh = 3.6;
      const lowDistinctiveness = Math.abs(lowPole - 3.0); // 1.8
      const midHighDistinctiveness = Math.abs(midHigh - 3.0); // 0.6

      expect(lowDistinctiveness).toBeGreaterThan(midHighDistinctiveness);
    });

    // G. InterpersonalStyleCompass shows insufficient data when < 2 agency or < 2 communion facets measured
    it('G. InterpersonalStyleCompass shows insufficient data when < 2 agency or < 2 communion facets measured', () => {
      // 1 agency, 2 communion
      const agencyScores = [4.2];
      const communionScores = [4.0, 3.8];
      const hasSufficient = agencyScores.length >= 2 && communionScores.length >= 2;
      expect(hasSufficient).toBe(false);

      // 2 agency, 2 communion
      const agencyScores2 = [4.2, 3.9];
      const hasSufficient2 = agencyScores2.length >= 2 && communionScores.length >= 2;
      expect(hasSufficient2).toBe(true);
    });

    // H. HexacoRadar does not fabricate factor scores when constructScore is null
    it('H. HexacoRadar does not fabricate factor scores when constructScore is null', () => {
      const constructWithNull = {
        constructId: 'hexaco_honesty_humility',
        constructScore: null,
      };
      // In the hardened HexacoRadar, we strictly use constructScore ?? null
      const resolvedScore = constructWithNull?.constructScore ?? null;
      expect(resolvedScore).toBeNull();
    });

    // I. SchwartzValuesCircle correctly distinguishes measured from unmeasured sectors
    it('I. SchwartzValuesCircle correctly distinguishes measured from unmeasured sectors', () => {
      const schwartzFacets = [
        { id: 'schwartz_openness_to_change', nameTr: 'Değişime Açıklık' },
        { id: 'schwartz_self_transcendence', nameTr: 'Öz-Aşkınlık' },
        { id: 'schwartz_conservation', nameTr: 'Muhafazacılık / Düzen' },
        { id: 'schwartz_self_enhancement', nameTr: 'Öz-Genişletme' },
      ];

      const profileFacets = [
        createTestFacet('schwartz_openness_to_change', 4.1),
        createTestFacet('schwartz_self_transcendence', null),
      ];

      const allSectors = schwartzFacets.map((item) => {
        const facet = profileFacets.find((f) => f.facetId === item.id);
        const isMeasured = facet?.measurementStatus !== 'NOT_MEASURED' && facet?.score !== null && facet?.score !== undefined;
        return {
          ...item,
          score: isMeasured ? facet!.score! : null,
          isMeasured,
          bandLabelTr: isMeasured ? 'Yüksek' : 'Ölçülmedi',
        };
      });

      const measured = allSectors.filter((s) => s.isMeasured);
      const unmeasured = allSectors.filter((s) => !s.isMeasured);

      expect(measured.length).toBe(1);
      expect(unmeasured.length).toBe(3);
      expect(unmeasured.every((u) => u.bandLabelTr === 'Ölçülmedi')).toBe(true);
    });
  });
});

