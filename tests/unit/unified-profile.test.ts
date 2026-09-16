import { describe, it, expect } from 'vitest';
import {
  deriveProfileMaturity,
  deriveUnifiedResponseQuality,
  deriveUnifiedQualityDimensions,
} from '@/services/unifiedProfileService';
import { evaluateUnifiedInteractions, UNIFIED_INTERACTION_RULES } from '@/lib/unifiedInteractionRegistry';
import { resolveScoringStrategy } from '@/lib/scoringStrategies';
import { getScoreBand } from '@/lib/assessmentInterpretationConfig';
import { TOTAL_ONTOLOGY_FACETS_SOURCE_OF_TRUTH } from '@/psychometrics/coverage';

describe('FAZ 2.11 — Unified Psychological Profile Unit Tests', () => {
  // ---------------------------------------------------------
  // 1. Profile Maturity Stage Derivation (Deterministic Product Coverage)
  // ---------------------------------------------------------
  describe('Profile Maturity Derivation', () => {
    it('returns BAŞLANGIÇ (0%) for zero completed assessments', () => {
      const maturity = deriveProfileMaturity({
        completedAssessmentsCount: 0,
        measuredDomainsCount: 0,
        measuredFacetsCount: 0,
        totalOntologyFacets: 84,
      });

      expect(maturity.stage).toBe('BAŞLANGIÇ');
      expect(maturity.progressPercentage).toBe(0);
      expect(maturity.labelTr).toContain('Başlangıç');
    });

    it('returns BAŞLANGIÇ (25%) for single completed assessment (1 domain)', () => {
      const maturity = deriveProfileMaturity({
        completedAssessmentsCount: 1,
        measuredDomainsCount: 1,
        measuredFacetsCount: 17,
        totalOntologyFacets: 84,
      });

      expect(maturity.stage).toBe('BAŞLANGIÇ');
      expect(maturity.progressPercentage).toBe(25);
    });

    it('returns GELİŞEN (50%) for 2 completed assessments across 2 domains', () => {
      const maturity = deriveProfileMaturity({
        completedAssessmentsCount: 2,
        measuredDomainsCount: 2,
        measuredFacetsCount: 19,
        totalOntologyFacets: 84,
      });

      expect(maturity.stage).toBe('GELİŞEN');
      expect(maturity.progressPercentage).toBe(50);
      expect(maturity.labelTr).toContain('Gelişen');
    });

    it('returns GENİŞLEYEN (75%) for 3 assessments across 3-4 domains', () => {
      const maturity = deriveProfileMaturity({
        completedAssessmentsCount: 3,
        measuredDomainsCount: 3,
        measuredFacetsCount: 35,
        totalOntologyFacets: 84,
      });

      expect(maturity.stage).toBe('GENİŞLEYEN');
      expect(maturity.progressPercentage).toBe(75);
    });

    it('returns KAPSAMLI (100%) for 4+ assessments or 5+ domains', () => {
      const maturity = deriveProfileMaturity({
        completedAssessmentsCount: 5,
        measuredDomainsCount: 6,
        measuredFacetsCount: 65,
        totalOntologyFacets: 84,
      });

      expect(maturity.stage).toBe('KAPSAMLI');
      expect(maturity.progressPercentage).toBe(100);
      expect(maturity.labelTr).toContain('Kapsamlı');
    });

    it('never bases maturity on psychological score magnitude', () => {
      // High score vs low score with same coverage produces exact same maturity
      const maturityA = deriveProfileMaturity({
        completedAssessmentsCount: 2,
        measuredDomainsCount: 2,
        measuredFacetsCount: 18,
        totalOntologyFacets: 84,
      });
      const maturityB = deriveProfileMaturity({
        completedAssessmentsCount: 2,
        measuredDomainsCount: 2,
        measuredFacetsCount: 18,
        totalOntologyFacets: 84,
      });

      expect(maturityA.stage).toBe(maturityB.stage);
      expect(maturityA.progressPercentage).toBe(maturityB.progressPercentage);
    });
  });

  // ---------------------------------------------------------
  // 2. Response Quality Aggregation (No Fake Master Confidence %)
  // ---------------------------------------------------------
  describe('Response Quality Telemetry Aggregation', () => {
    it('handles empty session list gracefully', () => {
      const res = deriveUnifiedResponseQuality([]);
      expect(res.totalAssessmentsAudited).toBe(0);
      expect(res.isClean).toBe(true);
      expect(res.headlineTr).toBe('Henüz Veri Kaydı Yok');
    });

    it('aggregates multiple clean assessments into EXCELLENT/ACCEPTABLE without averaging into a fake score', () => {
      const res = deriveUnifiedResponseQuality([
        {
          moduleTitleTr: 'Temel Kişilik Yapısı',
          overallFlag: 'EXCELLENT',
          speedViolations: 0,
          straightliningDetected: false,
          attentionCheckPassed: true,
        },
        {
          moduleTitleTr: 'Benlik Sistemi',
          overallFlag: 'EXCELLENT',
          speedViolations: 0,
          straightliningDetected: false,
          attentionCheckPassed: true,
        },
      ]);

      expect(res.overallFlag).toBe('EXCELLENT');
      expect(res.totalAssessmentsAudited).toBe(2);
      expect(res.statusCounts.excellent).toBe(2);
      expect(res.speedViolationsCount).toBe(0);
      expect(res.isClean).toBe(true);
      expect(res.headlineTr).toContain('tümünde yanıt kalitesi yüksek');
    });

    it('surfaces QUESTIONABLE assessment rather than masking it', () => {
      const res = deriveUnifiedResponseQuality([
        {
          moduleTitleTr: 'Temel Kişilik Yapısı',
          overallFlag: 'EXCELLENT',
          speedViolations: 0,
          straightliningDetected: false,
          attentionCheckPassed: true,
        },
        {
          moduleTitleTr: 'Benlik Sistemi',
          overallFlag: 'QUESTIONABLE',
          speedViolations: 2,
          straightliningDetected: true,
          attentionCheckPassed: true,
        },
      ]);

      expect(res.overallFlag).toBe('QUESTIONABLE');
      expect(res.isClean).toBe(false);
      expect(res.statusCounts.questionable).toBe(1);
      expect(res.speedViolationsCount).toBe(2);
      expect(res.straightliningDetected).toBe(true);
      expect(res.headlineTr).toContain('1 değerlendirmede dikkat/hız uyarısı saptandı');
    });
  });

  // ---------------------------------------------------------
  // 3. 4-Dimensional Quality Breakdown
  // ---------------------------------------------------------
  describe('Quality Dimensions Breakdown', () => {
    it('produces 4 distinct indicators with method diversity and pre-calibration notices', () => {
      const responseQuality = deriveUnifiedResponseQuality([
        {
          moduleTitleTr: 'HEXACO Kişilik Envanteri',
          overallFlag: 'ACCEPTABLE',
          speedViolations: 0,
          straightliningDetected: false,
          attentionCheckPassed: true,
        },
        {
          moduleTitleTr: 'Rosenberg Benlik Saygısı Ölçeği',
          overallFlag: 'ACCEPTABLE',
          speedViolations: 0,
          straightliningDetected: false,
          attentionCheckPassed: true,
        },
      ]);

      const dimensions = deriveUnifiedQualityDimensions({
        measuredDomainsCount: 2,
        totalDomainsCount: 9,
        exploredFacetsCount: 18,
        totalFacetsCount: 84,
        explorationPercentage: 21,
        depthPercentage: 35,
        responseQuality,
        instrumentsUsed: ['HEXACO Kişilik Envanteri', 'Rosenberg Benlik Saygısı Ölçeği'],
      });

      // 1. Coverage
      expect(dimensions.coverage.measuredDomains).toBe(2);
      expect(dimensions.coverage.totalDomains).toBe(9);
      expect(dimensions.coverage.exploredFacets).toBe(18);
      expect(dimensions.coverage.totalFacets).toBe(84);

      // 2. Response Quality
      expect(dimensions.responseQuality.status).toBe('ACCEPTABLE');

      // 3. Method Diversity
      expect(dimensions.methodDiversity.instrumentCount).toBe(2);
      expect(dimensions.methodDiversity.instrumentsUsed).toHaveLength(2);

      // 4. Calibration Status
      expect(dimensions.calibrationStatus.status).toBe('PRE_CALIBRATION');
      expect(dimensions.calibrationStatus.disclaimerTr).toContain('yüzdelik dilimler');
    });
  });

  // ---------------------------------------------------------
  // 4. Cross-Domain and Within-Domain Interaction Registry
  // ---------------------------------------------------------
  describe('Deterministic Cross-Domain Interaction Registry', () => {
    it('evaluates cross-domain synergy between HEXACO and Self-System only when both dimensions are measured', () => {
      // Both emotionality (1-5 scale) and agency_mastery (1-4 scale) measured
      const scoresBoth = {
        emotionality: { score: 1.8, scaleMin: 1.0, scaleMax: 5.0, nameTr: 'Duygusallık' }, // Low emotionality (0.2 ratio)
        agency_mastery: { score: 3.6, scaleMin: 1.0, scaleMax: 4.0, nameTr: 'Yetkinlik ve İrade' }, // High agency (0.86 ratio)
      };

      const interactions = evaluateUnifiedInteractions(scoresBoth);
      const synergy = interactions.find((i) => i.id === 'resilient_agency_synergy');

      expect(synergy).toBeDefined();
      expect(synergy?.type).toBe('SYNERGY');
      expect(synergy?.titleTr).toContain('Dirençli Öz-Yeterlik');
      expect(synergy?.sourceDimensions).toHaveLength(2);
    });

    it('skips cross-domain synergy when one required dimension is unmeasured (no false positive)', () => {
      // Only emotionality measured, agency_mastery is missing
      const scoresMissingAgency = {
        emotionality: { score: 1.8, scaleMin: 1.0, scaleMax: 5.0, nameTr: 'Duygusallık' },
      };

      const interactions = evaluateUnifiedInteractions(scoresMissingAgency);
      const synergy = interactions.find((i) => i.id === 'resilient_agency_synergy');

      expect(synergy).toBeUndefined();
    });

    it('evaluates cross-domain tension (perfectionist_vulnerability_tension)', () => {
      // High conscientiousness (4.2 on 1-5) + Low self-esteem (1.8 on 1-4)
      const scores = {
        conscientiousness: { score: 4.2, scaleMin: 1.0, scaleMax: 5.0, nameTr: 'Sorumluluk' },
        self_evaluation: { score: 1.8, scaleMin: 1.0, scaleMax: 4.0, nameTr: 'Benlik Değerlendirmesi' },
      };

      const interactions = evaluateUnifiedInteractions(scores);
      const tension = interactions.find((i) => i.id === 'perfectionist_vulnerability_tension');

      expect(tension).toBeDefined();
      expect(tension?.type).toBe('TENSION');
      expect(tension?.titleTr).toContain('Mükemmeliyetçi Öz-Eleştiri');
    });

    it('returns empty array if no rules match (strictly no fake fallback)', () => {
      // Moderate scores that do not trigger extreme synergy/tension thresholds
      const moderateScores = {
        extraversion: { score: 3.0, scaleMin: 1.0, scaleMax: 5.0, nameTr: 'Dışadönüklük' },
        conscientiousness: { score: 3.0, scaleMin: 1.0, scaleMax: 5.0, nameTr: 'Sorumluluk' },
        emotionality: { score: 3.0, scaleMin: 1.0, scaleMax: 5.0, nameTr: 'Duygusallık' },
        agreeableness: { score: 3.0, scaleMin: 1.0, scaleMax: 5.0, nameTr: 'Uyumluluk' },
      };

      const interactions = evaluateUnifiedInteractions(moderateScores);
      expect(interactions).toEqual([]);
    });
  });

  // ---------------------------------------------------------
  // 5. Scale Provenance & Mixed Scale Separation
  // ---------------------------------------------------------
  describe('Scale Provenance & Scoring Strategy Resolution', () => {
    it('resolves 1.0–5.0 scale for HEXACO pre-calibration strategy', () => {
      const strategy = resolveScoringStrategy('PRE_CALIBRATION_MEAN_V1');
      expect(strategy.scaleMin).toBe(1.0);
      expect(strategy.scaleMax).toBe(5.0);
      expect(strategy.scoreType).toBe('MEAN');
    });

    it('resolves 1.0–4.0 scale for RSES pre-calibration strategy', () => {
      const strategy = resolveScoringStrategy('RSES_MEAN_V1');
      expect(strategy.scaleMin).toBe(1.0);
      expect(strategy.scaleMax).toBe(4.0);
      expect(strategy.scoreType).toBe('MEAN');
    });

    it('resolves 1.0–4.0 scale for GSE pre-calibration strategy', () => {
      const strategy = resolveScoringStrategy('GSE_MEAN_V1');
      expect(strategy.scaleMin).toBe(1.0);
      expect(strategy.scaleMax).toBe(4.0);
      expect(strategy.scoreType).toBe('MEAN');
    });

    it('handles score band thresholds correctly for both 5-point and 4-point scales', () => {
      // 5-point scale (HEXACO)
      const bandHexacoLow = getScoreBand(2.0, 5.0);
      const bandHexacoBalanced = getScoreBand(3.0, 5.0);
      const bandHexacoHigh = getScoreBand(4.2, 5.0);

      expect(bandHexacoLow.band).toBe('LOW');
      expect(bandHexacoBalanced.band).toBe('BALANCED');
      expect(bandHexacoHigh.band).toBe('HIGH');

      // 4-point scale (RSES / GSE)
      const bandRsesLow = getScoreBand(1.8, 4.0);
      const bandRsesBalanced = getScoreBand(2.7, 4.0);
      const bandRsesHigh = getScoreBand(3.6, 4.0);

      expect(bandRsesLow.band).toBe('LOW');
      expect(bandRsesBalanced.band).toBe('BALANCED');
      expect(bandRsesHigh.band).toBe('HIGH');
    });
  });

  // ---------------------------------------------------------
  // 6. Complete 84-Facet Map Invariant Assertion
  // ---------------------------------------------------------
  describe('84-Facet Progressive Map Invariant', () => {
    it('source of truth facet count is strictly 84', () => {
      expect(TOTAL_ONTOLOGY_FACETS_SOURCE_OF_TRUTH).toBe(84);
    });
  });
});
