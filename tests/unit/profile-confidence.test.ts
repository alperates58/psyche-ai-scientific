import { describe, it, expect } from 'vitest';
import {
  deriveDimensionConfidence,
  buildProfileConfidenceMap,
  deriveProfileCompleteness,
} from '@/lib/profileConfidenceEvaluator';

describe('FAZ 2.13 — Profile Confidence Evaluator & Completeness Unit Tests', () => {
  // ---------------------------------------------------------
  // 1. Explicit Ordinal Decision Table Tests (Zero Hidden Numeric Points)
  // ---------------------------------------------------------
  describe('Ordinal Decision Table Derivation', () => {
    it('assigns HIGH confidence for >=6 items with clean response telemetry', () => {
      const conf = deriveDimensionConfidence({
        dimensionId: 'facet-1',
        dimensionCode: 'organization',
        dimensionNameTr: 'Düzenlilik',
        domainCode: 'core_personality',
        domainNameTr: 'Temel Kişilik',
        itemCount: 10,
        responseQuality: 'EXCELLENT',
        hasTurkishEvidence: true,
      });

      expect(conf.level).toBe('HIGH');
      expect(conf.levelLabelTr).toBe('Yüksek');
      expect(conf.itemCount).toBe(10);
      expect(conf.calibrationState).toBe('PRE_CALIBRATION');
      expect(conf.positiveFactors.length).toBeGreaterThanOrEqual(2);
      expect(conf.positiveFactors.some((f) => f.includes('10 madde'))).toBe(true);
      expect(conf.uncertainties.some((u) => u.type === 'CALIBRATION_UNCERTAINTY')).toBe(true);
      expect(conf.explanationTr).toContain('kanıt gücü yüksektir');
    });

    it('assigns MODERATE confidence for 3–5 items with acceptable response telemetry', () => {
      const conf = deriveDimensionConfidence({
        dimensionId: 'facet-2',
        dimensionCode: 'prudence',
        dimensionNameTr: 'Tedbirlilik',
        domainCode: 'core_personality',
        domainNameTr: 'Temel Kişilik',
        itemCount: 4,
        responseQuality: 'ACCEPTABLE',
        hasTurkishEvidence: true,
      });

      expect(conf.level).toBe('MODERATE');
      expect(conf.levelLabelTr).toBe('Orta');
      expect(conf.itemCount).toBe(4);
      expect(conf.positiveFactors.some((f) => f.includes('4 madde'))).toBe(true);
    });

    it('assigns LOW confidence for 1–2 items (sparse probe) even with clean telemetry', () => {
      const conf = deriveDimensionConfidence({
        dimensionId: 'facet-3',
        dimensionCode: 'creativity',
        dimensionNameTr: 'Yaratıcılık',
        domainCode: 'core_personality',
        domainNameTr: 'Temel Kişilik',
        itemCount: 2,
        responseQuality: 'EXCELLENT',
      });

      expect(conf.level).toBe('LOW');
      expect(conf.levelLabelTr).toContain('Düşük');
      expect(conf.uncertainties.some((u) => u.type === 'MEASUREMENT_COVERAGE_UNCERTAINTY')).toBe(true);
    });

    it('caps confidence at LOW when response telemetry is QUESTIONABLE, regardless of item count', () => {
      const conf = deriveDimensionConfidence({
        dimensionId: 'facet-4',
        dimensionCode: 'self_esteem',
        dimensionNameTr: 'Benlik Saygısı',
        domainCode: 'self_system',
        domainNameTr: 'Benlik Sistemi',
        itemCount: 10,
        responseQuality: 'QUESTIONABLE',
      });

      expect(conf.level).toBe('LOW');
      expect(conf.levelLabelTr).toContain('Telemetri Uyarısı');
      expect(conf.uncertainties.some((u) => u.type === 'RESPONSE_QUALITY_UNCERTAINTY')).toBe(true);
    });

    it('assigns VERY_LOW when response telemetry is COMPROMISED', () => {
      const conf = deriveDimensionConfidence({
        dimensionId: 'facet-5',
        dimensionCode: 'anxiety',
        dimensionNameTr: 'Kaygı',
        domainCode: 'emotional_affective',
        domainNameTr: 'Duygulanım',
        itemCount: 12,
        responseQuality: 'COMPROMISED',
      });

      expect(conf.level).toBe('VERY_LOW');
      expect(conf.levelLabelTr).toBe('Çok Düşük');
    });

    it('assigns VERY_LOW when item count is 0 (unmeasured)', () => {
      const conf = deriveDimensionConfidence({
        dimensionId: 'facet-6',
        dimensionCode: 'altruism',
        dimensionNameTr: 'Özgecilik',
        domainCode: 'core_personality',
        domainNameTr: 'Temel Kişilik',
        itemCount: 0,
        responseQuality: 'ACCEPTABLE',
      });

      expect(conf.level).toBe('VERY_LOW');
      expect(conf.levelLabelTr).toBe('Ölçülmedi');
    });
  });

  // ---------------------------------------------------------
  // 2. Separate Evidence from Calibration Tests
  // ---------------------------------------------------------
  describe('Separation of Validation Evidence from Calibration Status', () => {
    it('records pre-calibration uncertainty even when Turkish psychometric evidence is present', () => {
      const conf = deriveDimensionConfidence({
        dimensionId: 'facet-rses',
        dimensionCode: 'self_evaluation',
        dimensionNameTr: 'Benlik Değerlendirmesi',
        domainCode: 'self_system',
        domainNameTr: 'Benlik Sistemi',
        itemCount: 10,
        responseQuality: 'EXCELLENT',
        hasTurkishEvidence: true,
        instrumentName: 'Rosenberg Self-Esteem Scale (Çuhadaroğlu, 1986)',
      });

      // Positive factor for evidence
      expect(conf.positiveFactors.some((f) => f.includes('Türkçe psikometrik uyarlama'))).toBe(true);

      // Limiting factor for calibration
      expect(conf.calibrationState).toBe('PRE_CALIBRATION');
      expect(conf.uncertainties.some((u) => u.type === 'CALIBRATION_UNCERTAINTY')).toBe(true);
      expect(conf.missingSignals).toContain('Temsili ulusal norm kıyaslaması');
    });
  });

  // ---------------------------------------------------------
  // 3. Repeated Measurement Signals Tests
  // ---------------------------------------------------------
  describe('Repeated Measurement Temporal Stability', () => {
    it('notes single measurement without claiming longitudinal stability', () => {
      const conf = deriveDimensionConfidence({
        dimensionId: 'facet-single',
        dimensionCode: 'extraversion',
        dimensionNameTr: 'Dışadönüklük',
        domainCode: 'core_personality',
        domainNameTr: 'Temel Kişilik',
        itemCount: 10,
        responseQuality: 'EXCELLENT',
        measurementCount: 1,
        temporalSignal: 'SINGLE_MEASUREMENT',
      });

      expect(conf.temporalSignal).toBe('SINGLE_MEASUREMENT');
      expect(conf.uncertainties.some((u) => u.type === 'TEMPORAL_UNCERTAINTY')).toBe(true);
      expect(conf.missingSignals).toContain('Boylamsal tekrar testi');
    });

    it('records repeated-variable as temporal uncertainty rather than blindly awarding points', () => {
      const conf = deriveDimensionConfidence({
        dimensionId: 'facet-rep-var',
        dimensionCode: 'emotionality',
        dimensionNameTr: 'Duygusallık',
        domainCode: 'core_personality',
        domainNameTr: 'Temel Kişilik',
        itemCount: 10,
        responseQuality: 'EXCELLENT',
        measurementCount: 2,
        temporalSignal: 'REPEATED_VARIABLE',
      });

      expect(conf.temporalSignal).toBe('REPEATED_VARIABLE');
      expect(conf.uncertainties.some((u) => u.descriptionTr.includes('değişkenlik'))).toBe(true);
    });
  });

  // ---------------------------------------------------------
  // 4. Aggregated Confidence Map (NO Mathematical Average)
  // ---------------------------------------------------------
  describe('Profile Confidence Map ViewModel Aggregation', () => {
    it('exposes distribution counts and NO mathematical average score', () => {
      const confList = [
        deriveDimensionConfidence({
          dimensionId: '1',
          dimensionCode: 'a',
          dimensionNameTr: 'A',
          domainCode: 'd',
          domainNameTr: 'D',
          itemCount: 10,
          responseQuality: 'EXCELLENT',
        }),
        deriveDimensionConfidence({
          dimensionId: '2',
          dimensionCode: 'b',
          dimensionNameTr: 'B',
          domainCode: 'd',
          domainNameTr: 'D',
          itemCount: 4,
          responseQuality: 'ACCEPTABLE',
        }),
        deriveDimensionConfidence({
          dimensionId: '3',
          dimensionCode: 'c',
          dimensionNameTr: 'C',
          domainCode: 'd',
          domainNameTr: 'D',
          itemCount: 2,
          responseQuality: 'EXCELLENT',
        }),
      ];

      const map = buildProfileConfidenceMap(confList);

      expect(map.distribution.totalMeasured).toBe(3);
      expect(map.distribution.high).toBe(1);
      expect(map.distribution.moderate).toBe(1);
      expect(map.distribution.low).toBe(1);
      expect(map.distribution.veryLow).toBe(0);

      // Invariant: no mathematical average exists on the object
      expect((map as any).averageConfidenceScore).toBeUndefined();
      expect((map as any).averageEvidenceStrength).toBeUndefined();
    });
  });

  // ---------------------------------------------------------
  // 5. Central Completeness Denominator
  // ---------------------------------------------------------
  describe('Profile Completeness Central Denominators', () => {
    it('derives central completeness summary distinguishing user-facing domains from internal models', () => {
      const completeness = deriveProfileCompleteness({
        measuredFacetsCount: 24,
        totalOntologyFacets: 84,
        measuredUserFacingDomains: 2,
        totalUserFacingDomains: 8,
        totalOntologyDomains: 9,
        measuredOntologyDomains: 2,
      });

      expect(completeness.totalOntologyFacets).toBe(84);
      expect(completeness.measuredFacetsCount).toBe(24);
      expect(completeness.facetCoveragePercentage).toBe(29); // Math.round(24/84 * 100) = 29
      expect(completeness.totalUserFacingDomains).toBe(8);
      expect(completeness.measuredUserFacingDomains).toBe(2);

      expect(completeness.summaryStatementsTr[0]).toContain('84 psikolojik alt boyutun 24\'ini (%29)');
      expect(completeness.summaryStatementsTr[1]).toContain('8 temel psikolojik alandan 2\'sinde');
      expect(completeness.disclaimerTr).toContain('psikolojik kesinlik veya eksiksizlik anlamına gelmez');
    });
  });
});
