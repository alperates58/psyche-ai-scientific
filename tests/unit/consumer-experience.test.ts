import { describe, it, expect } from 'vitest';
import {
  resolveConsumerScalePosition,
  sanitizeMeasurementStatus,
  sanitizeEpistemicClaimType,
  neutralizeTensionDescription,
  SCALE_POSITION_EXPLANATION_NOTE,
  EMPTY_NORM_CONSUMER_MESSAGE,
} from '@/lib/consumerLanguage';

describe('Consumer Experience & Language Layer (Phase 2 Experience Rebuild)', () => {
  describe('resolveConsumerScalePosition', () => {
    it('maps scores to exact 5-band consumer scale positions without population norm references', () => {
      // 1.00 - 1.79 -> VERY_LOW
      const band1 = resolveConsumerScalePosition(1.4);
      expect(band1.bandCode).toBe('VERY_LOW');
      expect(band1.labelTr).toBe('Düşük uca yakın');
      expect(band1.scoreRangeTr).toBe('1.00 – 1.79');

      // 1.80 - 2.59 -> LOW_MID
      const band2 = resolveConsumerScalePosition(2.2);
      expect(band2.bandCode).toBe('LOW_MID');
      expect(band2.labelTr).toBe('Orta-alt bölge');
      expect(band2.scoreRangeTr).toBe('1.80 – 2.59');

      // 2.60 - 3.40 -> MID
      const band3 = resolveConsumerScalePosition(3.0);
      expect(band3.bandCode).toBe('MID');
      expect(band3.labelTr).toBe('Orta bölge');
      expect(band3.scoreRangeTr).toBe('2.60 – 3.40');

      // 3.41 - 4.20 -> MID_HIGH
      const band4 = resolveConsumerScalePosition(3.8);
      expect(band4.bandCode).toBe('MID_HIGH');
      expect(band4.labelTr).toBe('Orta-üst bölge');
      expect(band4.scoreRangeTr).toBe('3.41 – 4.20');

      // 4.21 - 5.00 -> HIGH
      const band5 = resolveConsumerScalePosition(4.8);
      expect(band5.bandCode).toBe('HIGH');
      expect(band5.labelTr).toBe('Yüksek uca yakın');
      expect(band5.scoreRangeTr).toBe('4.21 – 5.00');
    });

    it('handles null and undefined values safely', () => {
      const nullRes = resolveConsumerScalePosition(null);
      expect(nullRes.bandCode).toBe('MID');
      expect(nullRes.labelTr).toBe('Henüz Ölçülmedi');

      const undefinedRes = resolveConsumerScalePosition(undefined);
      expect(undefinedRes.bandCode).toBe('MID');
      expect(undefinedRes.labelTr).toBe('Henüz Ölçülmedi');
    });

    it('clamps boundary scores outside 1.0-5.0 safely', () => {
      const lowClamped = resolveConsumerScalePosition(0.5);
      expect(lowClamped.bandCode).toBe('VERY_LOW');

      const highClamped = resolveConsumerScalePosition(5.5);
      expect(highClamped.bandCode).toBe('HIGH');
    });

    it('includes clear disclaimer note that scores are not population norms', () => {
      const res = resolveConsumerScalePosition(3.5);
      expect(res.explanationNoteTr).toBe(SCALE_POSITION_EXPLANATION_NOTE);
      expect(res.explanationNoteTr).toContain('Bu ifade toplum ortalaması veya norm karşılaştırması değildir');
    });
  });

  describe('sanitizeMeasurementStatus', () => {
    it('converts developer and psychometric enums into warm Turkish consumer status', () => {
      expect(sanitizeMeasurementStatus('MEASURED_PRECALIBRATION')).toBe('Ölçüldü');
      expect(sanitizeMeasurementStatus('PROVISIONAL_POINT_ESTIMATE')).toBe('Ölçüldü');
      expect(sanitizeMeasurementStatus('MEASURED')).toBe('Ölçüldü');
      expect(sanitizeMeasurementStatus('NOT_MEASURED')).toBe('Henüz keşfedilmedi');
      expect(sanitizeMeasurementStatus('PARTIALLY_EXPLORED')).toBe('Kısmen keşfedildi');
      expect(sanitizeMeasurementStatus('VERSION_INCOMPATIBLE')).toBe('Bu iki ölçüm doğrudan karşılaştırılamıyor');
      expect(sanitizeMeasurementStatus('QUALITY_LIMITED')).toBe('Bu karşılaştırmayı daha temkinli yorumlamak gerekiyor');
    });
  });

  describe('sanitizeEpistemicClaimType', () => {
    it('converts epistemic claim types into transparent consumer labels', () => {
      expect(sanitizeEpistemicClaimType('MEASURED_FINDING')).toBe('Ölçülen Dayanak');
      expect(sanitizeEpistemicClaimType('THEORETICAL_INTERPRETATION')).toBe('Kuramsal Yorum');
      expect(sanitizeEpistemicClaimType('REFLECTIVE_HYPOTHESIS')).toBe('Üzerinde Düşünebileceğin Sorular');
      expect(sanitizeEpistemicClaimType('USER_PROVIDED_CONTEXT')).toBe('Kullanıcı Bildirimi / Günlük');
    });
  });

  describe('neutralizeTensionDescription', () => {
    it('replaces pathologizing or clinical risk words with neutral self-awareness phrasing', () => {
      const sampleText = 'Bu profilde yüksek tükenmişlik riski ve klinik risk bulunmaktadır.';
      const sanitized = neutralizeTensionDescription(sampleText);
      expect(sanitized).not.toContain('tükenmişlik riski');
      expect(sanitized).not.toContain('klinik risk');
      expect(sanitized).toContain('zorlayıcı olabilecek denge noktası');
      expect(sanitized).toContain('hassas denge alanı');
    });
  });

  describe('Empty norm governance', () => {
    it('provides clear explanation that no fake percentiles or population norms are provided', () => {
      expect(EMPTY_NORM_CONSUMER_MESSAGE).toContain('Toplum normlarıyla karşılaştırma henüz sunulmuyor');
    });
  });
});
