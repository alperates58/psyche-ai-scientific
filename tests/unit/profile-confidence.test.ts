import { describe, it, expect } from 'vitest';
import {
  deriveDimensionConfidence,
  buildProfileConfidenceMap,
  deriveProfileCompleteness,
  STANDARD_USER_PROFILE_DOMAIN_CODES,
} from '@/lib/profileConfidenceEvaluator';

describe('FAZ 2.13 — Profile Confidence Evaluator & Completeness Unit Tests', () => {
  // ---------------------------------------------------------
  // 1. Explicit Ordinal Decision Table Tests (Zero Hidden Numeric Points)
  // ---------------------------------------------------------
  describe('Ordinal Decision Table Derivation & Conservative Guardrails', () => {
    it('assigns HIGH confidence ONLY when ALL criteria are met (>=6 items, clean telemetry, direct evidence, Turkish adaptation, verified instrument)', () => {
      const conf = deriveDimensionConfidence({
        dimensionId: 'facet-1',
        dimensionCode: 'organization',
        dimensionNameTr: 'Düzenlilik',
        domainCode: 'core_personality',
        domainNameTr: 'Temel Kişilik',
        itemCount: 10,
        responseQuality: 'EXCELLENT',
        evidenceLevel: 'DIRECT',
        hasTurkishEvidence: true,
        instrumentName: 'HEXACO-60 TR',
      });

      expect(conf.level).toBe('HIGH');
      expect(conf.levelLabelTr).toBe('Güçlü Ölçüm Desteği');
      expect(conf.itemCount).toBe(10);
      expect(conf.calibrationState).toBe('PRE_CALIBRATION');
      expect(conf.positiveFactors.length).toBeGreaterThanOrEqual(3);
      expect(conf.positiveFactors.some((f) => f.includes('10 madde'))).toBe(true);
      expect(conf.positiveFactors.some((f) => f.includes('Türkçe psikometrik'))).toBe(true);
      expect(conf.positiveFactors.some((f) => f.includes('Doğrulanmış psikometrik envanter'))).toBe(true);
      expect(conf.uncertainties.some((u) => u.type === 'CALIBRATION_UNCERTAINTY')).toBe(true);
      expect(conf.explanationTr).toContain('ampirik ölçüm desteği güçlüdür');
    });

    it('caps confidence at MODERATE when item count is high (10 items) but evidenceLevel is UNKNOWN', () => {
      const conf = deriveDimensionConfidence({
        dimensionId: 'facet-unknown-ev',
        dimensionCode: 'unknown_trait',
        dimensionNameTr: 'Bilinmeyen Boyut',
        domainCode: 'core_personality',
        domainNameTr: 'Temel Kişilik',
        itemCount: 10,
        responseQuality: 'EXCELLENT',
        evidenceLevel: 'UNKNOWN',
        hasTurkishEvidence: false,
      });

      // Must NOT be HIGH!
      expect(conf.level).not.toBe('HIGH');
      expect(conf.level).toBe('MODERATE');
      expect(conf.levelLabelTr).toContain('Orta');
      expect(conf.uncertainties.some((u) => u.type === 'EVIDENCE_UNCERTAINTY')).toBe(true);
      expect(conf.missingSignals).toContain('Doğrulanmış psikometrik envanter kaydı');
    });

    it('caps confidence at MODERATE when item count is high (10 items) but hasTurkishEvidence is false', () => {
      const conf = deriveDimensionConfidence({
        dimensionId: 'facet-no-tr',
        dimensionCode: 'foreign_scale',
        dimensionNameTr: 'Yabancı Ölçek Boyutu',
        domainCode: 'core_personality',
        domainNameTr: 'Temel Kişilik',
        itemCount: 10,
        responseQuality: 'ACCEPTABLE',
        evidenceLevel: 'DIRECT',
        hasTurkishEvidence: false,
        instrumentName: 'Unadapted Foreign Inventory',
      });

      expect(conf.level).not.toBe('HIGH');
      expect(conf.level).toBe('MODERATE');
      expect(conf.uncertainties.some((u) => u.labelTr.includes('Türkçe Uyarlama'))).toBe(true);
    });

    it('assigns MODERATE confidence for 3–5 items with acceptable response telemetry and evidence', () => {
      const conf = deriveDimensionConfidence({
        dimensionId: 'facet-2',
        dimensionCode: 'prudence',
        dimensionNameTr: 'Tedbirlilik',
        domainCode: 'core_personality',
        domainNameTr: 'Temel Kişilik',
        itemCount: 4,
        responseQuality: 'ACCEPTABLE',
        evidenceLevel: 'DIRECT',
        hasTurkishEvidence: true,
        instrumentName: 'HEXACO-24 TR',
      });

      expect(conf.level).toBe('MODERATE');
      expect(conf.levelLabelTr).toBe('Orta Düzey Destek');
      expect(conf.itemCount).toBe(4);
      expect(conf.positiveFactors.some((f) => f.includes('4 madde'))).toBe(true);
    });

    it('assigns LOW confidence for 1–2 items (sparse probe) even with clean telemetry and direct evidence', () => {
      const conf = deriveDimensionConfidence({
        dimensionId: 'facet-3',
        dimensionCode: 'creativity',
        dimensionNameTr: 'Yaratıcılık',
        domainCode: 'core_personality',
        domainNameTr: 'Temel Kişilik',
        itemCount: 2,
        responseQuality: 'EXCELLENT',
        evidenceLevel: 'DIRECT',
        hasTurkishEvidence: true,
        instrumentName: 'HEXACO-60 TR',
      });

      expect(conf.level).toBe('LOW');
      expect(conf.levelLabelTr).toContain('Sınırlı');
      expect(conf.uncertainties.some((u) => u.type === 'MEASUREMENT_COVERAGE_UNCERTAINTY')).toBe(true);
    });

    it('strictly caps confidence at LOW when response telemetry is QUESTIONABLE, regardless of 10 items or direct evidence', () => {
      const conf = deriveDimensionConfidence({
        dimensionId: 'facet-4',
        dimensionCode: 'self_esteem',
        dimensionNameTr: 'Benlik Saygısı',
        domainCode: 'self_system',
        domainNameTr: 'Benlik Sistemi',
        itemCount: 10,
        responseQuality: 'QUESTIONABLE',
        evidenceLevel: 'DIRECT',
        hasTurkishEvidence: true,
        instrumentName: 'RSES-10',
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
      expect(conf.levelLabelTr).toBe('Yetersiz / Düşük Kalite');
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

    it('fails conservatively when defaults are used (unknown evidence remains unknown)', () => {
      const conf = deriveDimensionConfidence({
        dimensionId: 'facet-default',
        dimensionCode: 'trait_default',
        dimensionNameTr: 'Varsayılan Boyut',
        domainCode: 'core_personality',
        domainNameTr: 'Temel Kişilik',
        itemCount: 8,
        responseQuality: 'ACCEPTABLE',
      });

      expect(conf.evidenceLevel).toBe('UNKNOWN');
      expect(conf.provenanceCompleteness).toBe(false);
      expect(conf.level).not.toBe('HIGH');
    });
  });

  // ---------------------------------------------------------
  // 2. Source-Session Specific Telemetry Isolation
  // ---------------------------------------------------------
  describe('Source-Session Specific Telemetry Isolation', () => {
    it('preserves HIGH confidence for clean session measurements when a different session has QUESTIONABLE telemetry', () => {
      // Dimension from Session A (Clean HEXACO session)
      const hexacoFacetConf = deriveDimensionConfidence({
        dimensionId: 'facet-org',
        dimensionCode: 'organization',
        dimensionNameTr: 'Düzenlilik',
        domainCode: 'core_personality',
        domainNameTr: 'Temel Kişilik',
        itemCount: 10,
        responseQuality: 'EXCELLENT', // Session A's clean telemetry
        evidenceLevel: 'DIRECT',
        hasTurkishEvidence: true,
        instrumentName: 'HEXACO-60 TR',
      });

      // Dimension from Session B (Questionable speed in separate short assessment)
      const rsesFacetConf = deriveDimensionConfidence({
        dimensionId: 'facet-rses',
        dimensionCode: 'self_evaluation',
        dimensionNameTr: 'Benlik Değerlendirmesi',
        domainCode: 'self_system',
        domainNameTr: 'Benlik Sistemi',
        itemCount: 10,
        responseQuality: 'QUESTIONABLE', // Session B's flagged telemetry
        evidenceLevel: 'DIRECT',
        hasTurkishEvidence: true,
        instrumentName: 'RSES-10',
      });

      // Invariant: Session A is unaffected by Session B's telemetry
      expect(hexacoFacetConf.level).toBe('HIGH');
      expect(hexacoFacetConf.levelLabelTr).toBe('Güçlü Ölçüm Desteği');

      // Invariant: Session B reflects its own telemetry warning
      expect(rsesFacetConf.level).toBe('LOW');
      expect(rsesFacetConf.levelLabelTr).toContain('Telemetri Uyarısı');
    });
  });

  // ---------------------------------------------------------
  // 3. Authoritative Scientific Evidence & Scope Alignment Tests
  // ---------------------------------------------------------
  describe('Authoritative Validation Evidence & Scope Alignment Guardrails', () => {
    it('does NOT assign DIRECT or HIGH when only citation text is present without validation summary', () => {
      const conf = deriveDimensionConfidence({
        dimensionId: 'facet-cit-only',
        dimensionCode: 'cit_trait',
        dimensionNameTr: 'Yalnızca Alıntı',
        domainCode: 'core_personality',
        domainNameTr: 'Temel Kişilik',
        itemCount: 10,
        responseQuality: 'EXCELLENT',
        evidenceLevel: 'UNKNOWN',
        hasTurkishEvidence: false,
        instrumentName: 'Instrument With Citation Only (Ashton & Lee, 2007)',
      });

      // Must NOT be HIGH
      expect(conf.level).not.toBe('HIGH');
      expect(conf.level).toBe('LOW');
      expect(conf.levelLabelTr).toContain('Sınırlı');
      expect(conf.provenanceCompleteness).toBe(false);
    });

    it('does NOT create Turkish evidence from author name substrings (e.g. Wasti, Aypay)', () => {
      const conf = deriveDimensionConfidence({
        dimensionId: 'facet-author-check',
        dimensionCode: 'author_trait',
        dimensionNameTr: 'Yazar İsimli Boyut',
        domainCode: 'core_personality',
        domainNameTr: 'Temel Kişilik',
        itemCount: 10,
        responseQuality: 'EXCELLENT',
        evidenceLevel: 'NO_DIRECT',
        overallTurkishEvidenceLevel: 'NO_DIRECT',
        hasTurkishEvidence: false,
        instrumentName: 'Inventory (Wasti, Aypay, Yildirim)',
      });

      expect(conf.level).toBe('LOW');
      expect(conf.uncertainties.some((u) => u.labelTr.includes('Türkçe Uyarlama Kanıtı Eksik'))).toBe(true);
    });

    it('downgrades BROAD_FACTOR lexical evidence so it does NOT become facet DIRECT', () => {
      const conf = deriveDimensionConfidence({
        dimensionId: 'facet-broad-lex',
        dimensionCode: 'broad_trait',
        dimensionNameTr: 'Geniş Leksikal Faktör',
        domainCode: 'core_personality',
        domainNameTr: 'Temel Kişilik',
        itemCount: 10,
        responseQuality: 'EXCELLENT',
        evidenceLevel: 'LEXICAL',
        overallTurkishEvidenceLevel: 'LEXICAL',
        appliesToLevel: 'BROAD_FACTOR',
        measurementAlignmentLevel: 'CONSTRUCT_ALIGNED',
        instrumentMatch: true,
        instrumentName: 'HEXACO-60 TR',
      });

      // Broad factor lexical support must NOT grant HIGH
      expect(conf.level).not.toBe('HIGH');
      expect(conf.level).toBe('MODERATE');
      expect(conf.levelLabelTr).toContain('Geniş Faktör/Leksikal');
      expect(conf.uncertainties.some((u) => u.labelTr.includes('Yalnızca Leksikal'))).toBe(true);
    });

    it('assigns HIGH when DIRECT + exact facet alignment + matching instrument + clean telemetry are met', () => {
      const conf = deriveDimensionConfidence({
        dimensionId: 'facet-perfect',
        dimensionCode: 'exact_facet',
        dimensionNameTr: 'Tam Uyumlu Alt Boyut',
        domainCode: 'core_personality',
        domainNameTr: 'Temel Kişilik',
        itemCount: 10,
        responseQuality: 'EXCELLENT',
        evidenceLevel: 'DIRECT',
        overallTurkishEvidenceLevel: 'DIRECT',
        appliesToLevel: 'FACET',
        measurementAlignmentLevel: 'EXACT_FACET',
        instrumentMatch: true,
        instrumentValidationEstablished: true,
        hasTurkishEvidence: true,
        instrumentName: 'HEXACO-60 TR',
        humanVerified: false,
      });

      expect(conf.level).toBe('HIGH');
      expect(conf.levelLabelTr).toBe('Güçlü Ölçüm Desteği');
      expect(conf.positiveFactors.some((f) => f.includes('Doğrulanmış psikometrik envanter'))).toBe(true);
      // Invariant: humanVerified: false remains honestly represented
      expect(conf.humanVerified).toBe(false);
      expect(conf.uncertainties.some((u) => u.labelTr.includes('Uzman Onayı Bekleniyor'))).toBe(true);
    });

    it('honestly includes human-verified positive factor only when humanVerified is explicitly true', () => {
      const conf = deriveDimensionConfidence({
        dimensionId: 'facet-human-verified',
        dimensionCode: 'verified_trait',
        dimensionNameTr: 'Uzman Onaylı Boyut',
        domainCode: 'core_personality',
        domainNameTr: 'Temel Kişilik',
        itemCount: 10,
        responseQuality: 'EXCELLENT',
        evidenceLevel: 'DIRECT',
        overallTurkishEvidenceLevel: 'DIRECT',
        appliesToLevel: 'FACET',
        measurementAlignmentLevel: 'EXACT_FACET',
        instrumentMatch: true,
        instrumentValidationEstablished: true,
        hasTurkishEvidence: true,
        instrumentName: 'HEXACO-60 TR',
        humanVerified: true,
      });

      expect(conf.humanVerified).toBe(true);
      expect(conf.positiveFactors.some((f) => f.includes('human-verified'))).toBe(true);
      expect(conf.uncertainties.some((u) => u.labelTr.includes('Uzman Onayı Bekleniyor'))).toBe(false);
    });

    it('caps at LOW when session instrument does NOT match validation record instrument', () => {
      const conf = deriveDimensionConfidence({
        dimensionId: 'facet-mismatched',
        dimensionCode: 'mismatched_trait',
        dimensionNameTr: 'Eşleşmeyen Boyut',
        domainCode: 'core_personality',
        domainNameTr: 'Temel Kişilik',
        itemCount: 10,
        responseQuality: 'EXCELLENT',
        evidenceLevel: 'NO_DIRECT',
        overallTurkishEvidenceLevel: 'NO_DIRECT',
        instrumentMatch: false,
        instrumentName: 'Different Unknown Instrument',
      });

      expect(conf.level).toBe('LOW');
      expect(conf.levelLabelTr).toContain('Eşleşmeyen');
      expect(conf.uncertainties.some((u) => u.labelTr.includes('Envanter Eşleşme Uyarısı'))).toBe(true);
    });
  });

  // ---------------------------------------------------------
  // 4. Separate Evidence from Calibration Tests
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
        evidenceLevel: 'DIRECT',
        hasTurkishEvidence: true,
        instrumentName: 'Rosenberg Self-Esteem Scale (Çuhadaroğlu, 1986)',
      });

      // Positive factor for evidence
      expect(conf.positiveFactors.some((f) => f.includes('Türkçe doğrudan psikometrik uyarlama'))).toBe(true);

      // Limiting factor for calibration
      expect(conf.calibrationState).toBe('PRE_CALIBRATION');
      expect(conf.uncertainties.some((u) => u.type === 'CALIBRATION_UNCERTAINTY')).toBe(true);
      expect(conf.missingSignals).toContain('Temsili ulusal norm kıyaslaması');
    });
  });

  // ---------------------------------------------------------
  // 4. Repeated Measurement Signals Tests
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
        evidenceLevel: 'DIRECT',
        hasTurkishEvidence: true,
        instrumentName: 'HEXACO-60 TR',
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
  // 5. Aggregated Confidence Map (NO Mathematical Average)
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
          evidenceLevel: 'DIRECT',
          hasTurkishEvidence: true,
          instrumentName: 'Valid Inst',
        }),
        deriveDimensionConfidence({
          dimensionId: '2',
          dimensionCode: 'b',
          dimensionNameTr: 'B',
          domainCode: 'd',
          domainNameTr: 'D',
          itemCount: 4,
          responseQuality: 'ACCEPTABLE',
          evidenceLevel: 'DIRECT',
          hasTurkishEvidence: true,
          instrumentName: 'Valid Inst',
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
  // 6. Central Completeness Denominator
  // ---------------------------------------------------------
  describe('Profile Completeness Central Denominators', () => {
    it('derives central completeness summary dynamically with zero hardcoded 84', () => {
      const completeness = deriveProfileCompleteness({
        measuredFacetsCount: 24,
        totalOntologyFacets: 84,
        measuredUserFacingDomains: 2,
        totalUserFacingDomains: 7,
        totalOntologyDomains: 9,
        measuredOntologyDomains: 2,
      });

      expect(completeness.totalOntologyFacets).toBe(84);
      expect(completeness.measuredFacetsCount).toBe(24);
      expect(completeness.facetCoveragePercentage).toBe(29); // Math.round(24/84 * 100) = 29
      expect(completeness.totalUserFacingDomains).toBe(7);
      expect(completeness.measuredUserFacingDomains).toBe(2);

      expect(completeness.summaryStatementsTr[0]).toContain('84 psikolojik alt boyutun 24\'ini (%29)');
      expect(completeness.summaryStatementsTr[1]).toContain('7 temel psikolojik alandan 2\'sinde');
      expect(completeness.disclaimerTr).toContain('psikolojik kesinlik veya eksiksizlik anlamına gelmez');
    });

    it('dynamically formats arbitrary totalOntologyFacets (e.g. 50)', () => {
      const completeness = deriveProfileCompleteness({
        measuredFacetsCount: 10,
        totalOntologyFacets: 50,
        measuredUserFacingDomains: 3,
        totalUserFacingDomains: 7,
        totalOntologyDomains: 9,
        measuredOntologyDomains: 3,
      });

      expect(completeness.summaryStatementsTr[0]).toContain('50 psikolojik alt boyutun 10\'ini (%20)');
    });

    it('standard user profile domain codes contains exactly 7 standard domains', () => {
      expect(STANDARD_USER_PROFILE_DOMAIN_CODES).toHaveLength(7);
      expect(STANDARD_USER_PROFILE_DOMAIN_CODES).not.toContain('integrity_validity');
    });
  });
});
