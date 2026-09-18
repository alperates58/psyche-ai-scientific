import { describe, it, expect } from 'vitest';
import {
  resolveConsumerScalePosition,
  sanitizeMeasurementStatus,
  sanitizeEpistemicClaimType,
  neutralizeTensionDescription,
  SCALE_POSITION_EXPLANATION_NOTE,
  EMPTY_NORM_CONSUMER_MESSAGE,
} from '@/lib/consumerLanguage';
import { verifyAIInsightClaims } from '@/lib/ai/verification/claimVerifier';
import { AIInsightV2, InterpretationPlanV2 } from '@/types/aiInsightV2';

describe('Consumer Experience & Scientific Language Hardening', () => {
  describe('A & B. Value-Neutral Scale Position Language', () => {
    it('A. score 3.0 resolves to neutral "orta bölge" without "dengeli" or "ideal" implications', () => {
      const midPos = resolveConsumerScalePosition(3.0);
      expect(midPos.bandCode).toBe('MID');
      expect(midPos.labelTr).toBe('Orta bölge');
      expect(midPos.descriptionTr).toBe('Ölçüm ölçeğinin orta bölgesinde bir konum.');
      expect(midPos.descriptionTr).not.toContain('dengeli');
      expect(midPos.descriptionTr).not.toContain('ideal');
    });

    it('B. score 4.8 resolves to "yüksek uca yakın" without "güçlü" or "iyi" value judgements', () => {
      const highPos = resolveConsumerScalePosition(4.8);
      expect(highPos.bandCode).toBe('HIGH');
      expect(highPos.labelTr).toBe('Yüksek uca yakın');
      expect(highPos.descriptionTr).toBe('Ölçüm ölçeğinin yüksek ucuna yakın bir konum.');
      expect(highPos.descriptionTr).not.toContain('güçlü');
      expect(highPos.descriptionTr).not.toContain('iyi');
      expect(highPos.descriptionTr).not.toContain('başarılı');
    });

    it('resolves all 5 scale positions with strictly neutral descriptive location copy', () => {
      const vlow = resolveConsumerScalePosition(1.3);
      expect(vlow.descriptionTr).toBe('Ölçüm ölçeğinin düşük ucuna yakın bir konum.');

      const lowMid = resolveConsumerScalePosition(2.2);
      expect(lowMid.descriptionTr).toBe('Ölçüm ölçeğinin orta bölgesinin altında bir konum.');

      const midHigh = resolveConsumerScalePosition(3.9);
      expect(midHigh.descriptionTr).toBe('Ölçüm ölçeğinin orta bölgesinin üzerinde bir konum.');
    });

    it('includes disclaimer note that scale position is NOT a population norm', () => {
      const pos = resolveConsumerScalePosition(3.5);
      expect(pos.explanationNoteTr).toBe(SCALE_POSITION_EXPLANATION_NOTE);
      expect(pos.explanationNoteTr).toContain('Bu ifade toplum ortalaması veya norm karşılaştırması değildir');
    });
  });

  describe('C. Unknown Measurement Status Safety', () => {
    it('unknown or unsupported enum never falls back to "Ölçüldü"', () => {
      const unknownResult = sanitizeMeasurementStatus('FUTURE_UNSUPPORTED_STATUS');
      expect(unknownResult).toBe('Durum belirlenemedi');
      expect(unknownResult).not.toBe('Ölçüldü');

      const nullResult = sanitizeMeasurementStatus(undefined);
      expect(nullResult).toBe('Henüz keşfedilmedi');
    });

    it('sanitizes known internal statuses appropriately', () => {
      expect(sanitizeMeasurementStatus('MEASURED_PRECALIBRATION')).toBe('Ölçüldü');
      expect(sanitizeMeasurementStatus('PROVISIONAL_POINT_ESTIMATE')).toBe('Ölçüldü');
      expect(sanitizeMeasurementStatus('NOT_MEASURED')).toBe('Henüz keşfedilmedi');
      expect(sanitizeMeasurementStatus('PARTIALLY_EXPLORED')).toBe('Kısmen keşfedildi');
      expect(sanitizeMeasurementStatus('VERSION_INCOMPATIBLE')).toBe('Bu iki ölçüm doğrudan karşılaştırılamıyor');
      expect(sanitizeMeasurementStatus('QUALITY_LIMITED')).toBe('Bu karşılaştırmayı daha temkinli yorumlamak gerekiyor');
    });
  });

  describe('D. User Language Preservation', () => {
    it('does NOT blindly rewrite user words like "travma" or "risk"', () => {
      const userRawText = 'Bu olay benim için travmaydı ve büyük bir risk taşıyordu.';
      const output = neutralizeTensionDescription(userRawText);
      // Original user words "travma" and "risk" must remain untouched by generic tension neutralizer
      expect(output).toContain('travmaydı');
      expect(output).toContain('risk');
    });

    it('only neutralizes specific clinical risk phrases in system descriptions', () => {
      const systemDescription = 'Bu profilde yüksek tükenmişlik riski ve depresyon riski bulunmaktadır.';
      const sanitized = neutralizeTensionDescription(systemDescription);
      expect(sanitized).not.toContain('tükenmişlik riski');
      expect(sanitized).not.toContain('depresyon riski');
      expect(sanitized).toContain('zorlayıcı olabilecek denge noktası');
      expect(sanitized).toContain('duygusal yük oluşturabilecek alan');
    });
  });

  describe('E. Unsupported Clinical AI Claim Rejection', () => {
    const mockPlan: InterpretationPlanV2 = {
      planId: 'plan_test_safety',
      userId: 'user_1',
      requestType: 'FACET_DEEP_DIVE',
      primaryEvidence: [
        {
          evidenceId: 'ev_sincerity',
          targetId: 'sincerity',
          type: 'FACET',
          score: 4.5,
          band: 'HIGH',
          weight: 1.0,
          scientificRationaleTr: 'Dürüstlük ve içtenlik eğilimi.',
        },
      ],
      supportingEvidence: [],
      counterbalancingEvidence: [],
      activatedTensions: [],
      activatedSynergies: [],
      activatedPatterns: [],
      longitudinalState: { hasRepeat: false },
      epistemicRules: ['ONLY_MEASURED_FACETS'],
    };

    it('claim verifier rejects diagnostic disease labels in AI insights', () => {
      const badInsight: AIInsightV2 = {
        insightId: 'ins_bad_1',
        userId: 'user_1',
        createdAt: new Date().toISOString(),
        evidenceHash: 'hash1',
        evidenceRefs: ['ev_sincerity'],
        targetScope: 'FACET',
        titleTr: 'İçtenlik Analizi',
        summaryTr: 'Bu sonuçlar sizde belirgin bir depresyon tanısı olduğunu göstermektedir.',
        bodyTr: 'Klinik tanı konulmalı ve ilaç tedavisi uygulanmalıdır.',
        dailyLifePatterns: [],
        traitInteractions: [],
        developmentAreas: [],
        reflectionPrompts: [],
        isFallback: false,
      };

      const result = verifyAIInsightClaims(badInsight, mockPlan);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Yasaklı klinik/psikiyatrik tanı'))).toBe(true);
    });

    it('claim verifier rejects ungrounded percentile claims in pre-calibration mode', () => {
      const percentileInsight: AIInsightV2 = {
        insightId: 'ins_bad_2',
        userId: 'user_1',
        createdAt: new Date().toISOString(),
        evidenceHash: 'hash2',
        evidenceRefs: ['ev_sincerity'],
        targetScope: 'FACET',
        titleTr: 'İçtenlik Analizi',
        summaryTr: 'Türkiye ortalamasının %95 üzerinde bir puana sahipsiniz.',
        bodyTr: 'Toplumun %80 dilimindesiniz.',
        dailyLifePatterns: [],
        traitInteractions: [],
        developmentAreas: [],
        reflectionPrompts: [],
        isFallback: false,
      };

      const result = verifyAIInsightClaims(percentileInsight, mockPlan);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('yüzdelik (percentile) veya norm'))).toBe(true);
    });
  });

  describe('F. Domain Visualization Language & Epistemic Separation', () => {
    it('epistemic claim sanitizer translates claim types into transparent consumer labels', () => {
      expect(sanitizeEpistemicClaimType('MEASURED_FINDING')).toBe('Ölçülen Dayanak');
      expect(sanitizeEpistemicClaimType('THEORETICAL_INTERPRETATION')).toBe('Kuramsal Yorum');
      expect(sanitizeEpistemicClaimType('REFLECTIVE_HYPOTHESIS')).toBe('Üzerinde Düşünebileceğin Sorular');
      expect(sanitizeEpistemicClaimType('USER_PROVIDED_CONTEXT')).toBe('Kullanıcı Bildirimi / Günlük');
    });

    it('provides clear empty norm message avoiding population comparisons', () => {
      expect(EMPTY_NORM_CONSUMER_MESSAGE).toContain('Toplum normlarıyla karşılaştırma henüz sunulmuyor');
      expect(EMPTY_NORM_CONSUMER_MESSAGE).toContain('yanıtlarınızın ölçüm ölçeğindeki konumuna dayanır');
    });
  });
});
