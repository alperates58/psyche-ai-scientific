import { describe, it, expect } from 'vitest';
import {
  deriveProfileMaturity,
  deriveUnifiedResponseQuality,
  deriveUnifiedQualityDimensions,
  getDescriptiveResponseRangeState,
} from '@/services/unifiedProfileService';
import {
  evaluateUnifiedInteractions,
  evaluateProfileTensionMatrix,
  UNIFIED_INTERACTION_RULES,
} from '@/lib/unifiedInteractionRegistry';
import { resolveScoringStrategy } from '@/lib/scoringStrategies';
import { getScoreBand } from '@/lib/assessmentInterpretationConfig';
import { TOTAL_ONTOLOGY_FACETS_SOURCE_OF_TRUTH } from '@/psychometrics/coverage';

describe('FAZ 2.13 — Unified Psychological Profile Unit Tests', () => {
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

    it('returns BAŞLANGIÇ (20%) for single completed assessment with 17/84 facets', () => {
      const maturity = deriveProfileMaturity({
        completedAssessmentsCount: 1,
        measuredDomainsCount: 1,
        measuredFacetsCount: 17,
        totalOntologyFacets: 84,
      });

      expect(maturity.stage).toBe('BAŞLANGIÇ');
      expect(maturity.progressPercentage).toBe(20);
    });

    it('returns GELİŞEN (23%) for 2 completed assessments across 2 domains with 19/84 facets', () => {
      const maturity = deriveProfileMaturity({
        completedAssessmentsCount: 2,
        measuredDomainsCount: 2,
        measuredFacetsCount: 19,
        totalOntologyFacets: 84,
      });

      expect(maturity.stage).toBe('GELİŞEN');
      expect(maturity.progressPercentage).toBe(23);
      expect(maturity.labelTr).toContain('Gelişen');
    });

    it('returns GENİŞLEYEN (45%) for 38/84 facets across 4 domains', () => {
      const maturity = deriveProfileMaturity({
        completedAssessmentsCount: 3,
        measuredDomainsCount: 4,
        measuredFacetsCount: 38,
        totalOntologyFacets: 84,
      });

      expect(maturity.stage).toBe('GENİŞLEYEN');
      expect(maturity.progressPercentage).toBe(45);
    });

    it('returns KAPSAMLI (77%) only when substantial facet coverage (65/84) AND broad domains (6) are met', () => {
      const maturity = deriveProfileMaturity({
        completedAssessmentsCount: 5,
        measuredDomainsCount: 6,
        measuredFacetsCount: 65,
        totalOntologyFacets: 84,
      });

      expect(maturity.stage).toBe('KAPSAMLI');
      expect(maturity.progressPercentage).toBe(77);
      expect(maturity.labelTr).toContain('Kapsamlı');
    });
  });

  // ---------------------------------------------------------
  // 2. Response Quality Aggregation (Multi-Signal, Zero Fake Score)
  // ---------------------------------------------------------
  describe('Response Quality Telemetry Aggregation', () => {
    it('handles empty session list gracefully', () => {
      const res = deriveUnifiedResponseQuality([]);
      expect(res.totalAssessmentsAudited).toBe(0);
      expect(res.isClean).toBe(true);
      expect(res.headlineTr).toBe('Henüz Veri Kaydı Yok');
    });

    it('aggregates multiple clean assessments into EXCELLENT without averaging into a fake score', () => {
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
    });
  });

  // ---------------------------------------------------------
  // 3. Instrument Diversity vs Method Diversity
  // ---------------------------------------------------------
  describe('Quality Dimensions & Instrument Diversity', () => {
    it('labels multiple self-reports accurately as instrument diversity and NOT multi-method', () => {
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
        instrumentsUsed: ['HEXACO-60 TR', 'Rosenberg Self-Esteem Scale TR'],
      });

      expect(dimensions.methodDiversity.instrumentCount).toBe(2);
      expect(dimensions.methodDiversity.labelTr).toContain('Ölçek Çeşitliliği');
      expect(dimensions.methodDiversity.detailTr).toContain('öz-bildirim envanterleri');
      expect(dimensions.calibrationStatus.status).toBe('PRE_CALIBRATION');
    });
  });

  // ---------------------------------------------------------
  // 4. Heatmap Scale-Relative Descriptive Range States
  // ---------------------------------------------------------
  describe('Heatmap Scale-Relative Response Range Resolution', () => {
    it('resolves UNMEASURED for null/NaN scores', () => {
      expect(getDescriptiveResponseRangeState(null, 1.0, 5.0, 'PRE_CALIBRATION_MEAN_V1').state).toBe('UNMEASURED');
    });

    it('defaults pre-calibration models to DESCRIPTIVE_BAND_UNAVAILABLE preventing unvalidated thirds', () => {
      const precalRes = getDescriptiveResponseRangeState(3.5, 1.0, 5.0, 'PRE_CALIBRATION_MEAN_V1');
      expect(precalRes.state).toBe('DESCRIPTIVE_BAND_UNAVAILABLE');
      expect(precalRes.labelTr).toBe('Betimsel Bant Tanımlanmamış');
    });

    it('returns DESCRIPTIVE_BAND_UNAVAILABLE when scoring model code has no registered policy', () => {
      const unmappedRes = getDescriptiveResponseRangeState(3.5, 1.0, 5.0, 'UNMAPPED_CUSTOM_MODEL');
      expect(unmappedRes.state).toBe('DESCRIPTIVE_BAND_UNAVAILABLE');
      expect(unmappedRes.labelTr).toBe('Betimsel Bant Tanımlanmamış');
    });

    it('returns DESCRIPTIVE_BAND_UNAVAILABLE when no scoring model code is supplied', () => {
      const noStrategyRes = getDescriptiveResponseRangeState(3.5, 1.0, 5.0, null);
      expect(noStrategyRes.state).toBe('DESCRIPTIVE_BAND_UNAVAILABLE');
    });
  });

  // ---------------------------------------------------------
  // 5. Profile Tension Matrix Evaluation
  // ---------------------------------------------------------
  describe('Profile Tension Matrix Evaluator', () => {
    it('identifies CONVERGENT state for synergy rules', () => {
      const scores = {
        extraversion: { score: 4.2, scaleMin: 1.0, scaleMax: 5.0, nameTr: 'Dışadönüklük' },
        conscientiousness: { score: 4.0, scaleMin: 1.0, scaleMax: 5.0, nameTr: 'Sorumluluk' },
      };

      const matrix = evaluateProfileTensionMatrix(scores);
      const synergyItem = matrix.find((m) => m.id === 'goal_execution_dynamic');

      expect(synergyItem).toBeDefined();
      expect(synergyItem?.type).toBe('SYNERGY');
      expect(synergyItem?.state).toBe('CONVERGENT');
      expect(synergyItem?.scientificRationale).toBeDefined();
      expect(synergyItem?.reflectionPromptTr).toBeDefined();
    });

    it('identifies POTENTIAL_TENSION state for tension rules', () => {
      const scores = {
        conscientiousness: { score: 4.5, scaleMin: 1.0, scaleMax: 5.0, nameTr: 'Sorumluluk' },
        self_evaluation: { score: 1.5, scaleMin: 1.0, scaleMax: 4.0, nameTr: 'Benlik Değerlendirmesi' },
      };

      const matrix = evaluateProfileTensionMatrix(scores);
      const tensionItem = matrix.find((m) => m.id === 'perfectionist_vulnerability_tension');

      expect(tensionItem).toBeDefined();
      expect(tensionItem?.type).toBe('TENSION');
      expect(tensionItem?.state).toBe('POTENTIAL_TENSION');
      expect(tensionItem?.stateLabelTr).toContain('İçsel Gerilim');
    });

    it('identifies CONTEXT_DEPENDENT state for modulation rules', () => {
      const scores = {
        extraversion: { score: 4.2, scaleMin: 1.0, scaleMax: 5.0, nameTr: 'Dışadönüklük' },
        emotionality: { score: 4.2, scaleMin: 1.0, scaleMax: 5.0, nameTr: 'Duygusallık' },
      };

      const matrix = evaluateProfileTensionMatrix(scores);
      const modItem = matrix.find((m) => m.id === 'social_assertiveness_relational_caution_modulation');

      expect(modItem).toBeDefined();
      expect(modItem?.type).toBe('MODULATION');
      expect(modItem?.state).toBe('CONTEXT_DEPENDENT');
      expect(modItem?.stateLabelTr).toContain('Bağlama Dayalı');
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
