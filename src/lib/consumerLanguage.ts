/**
 * PsycheAI Consumer Language & Terminology Governance System
 *
 * Centralized helpers mapping psychometric scale positions, status enums,
 * and scientific metadata into warm, human, non-clinical Turkish consumer copy.
 *
 * Inviolable Rules:
 * - Scale position labels are NOT population norms or percentiles.
 * - No fake confidence percentages ("%98.4 güvenilirlik" is prohibited).
 * - No clinical or diagnostic labels (e.g. no "tükenmişlik riski", "depresyon riski").
 * - High score is not inherently "good", low score is not inherently "bad".
 */

export interface ScalePositionInfo {
  bandCode: 'VERY_LOW' | 'LOW_MID' | 'MID' | 'MID_HIGH' | 'HIGH';
  labelTr: string;
  descriptionTr: string;
  scoreRangeTr: string;
  explanationNoteTr: string;
}

export const SCALE_POSITION_EXPLANATION_NOTE =
  'Bu ifade toplum ortalaması veya norm karşılaştırması değildir. Yalnızca yanıtlarınızın 1–5 ölçüm ölçeğindeki konumunu gösterir.';

/**
 * Deterministically resolves the 1–5 consumer scale position.
 * Respects existing canonical deterministic band thresholds.
 */
export function resolveConsumerScalePosition(score: number | null | undefined): ScalePositionInfo {
  if (score === null || score === undefined || isNaN(score)) {
    return {
      bandCode: 'MID',
      labelTr: 'Henüz Ölçülmedi',
      descriptionTr: 'Bu özellik için henüz yeterli değerlendirme verisi bulunmuyor.',
      scoreRangeTr: '—',
      explanationNoteTr: SCALE_POSITION_EXPLANATION_NOTE,
    };
  }

  const clamped = Math.max(1.0, Math.min(5.0, score));

  if (clamped <= 1.79) {
    return {
      bandCode: 'VERY_LOW',
      labelTr: 'Düşük uca yakın',
      descriptionTr: 'Bu özellikte ölçüm ölçeğinin alt sınırına yakın bir eğilim göstermektesiniz.',
      scoreRangeTr: '1.00 – 1.79',
      explanationNoteTr: SCALE_POSITION_EXPLANATION_NOTE,
    };
  }

  if (clamped <= 2.59) {
    return {
      bandCode: 'LOW_MID',
      labelTr: 'Orta-alt bölge',
      descriptionTr: 'Ölçüm ölçeğinde dengeli orta hattın biraz altında bir eğilim sergiliyorsunuz.',
      scoreRangeTr: '1.80 – 2.59',
      explanationNoteTr: SCALE_POSITION_EXPLANATION_NOTE,
    };
  }

  if (clamped <= 3.40) {
    return {
      bandCode: 'MID',
      labelTr: 'Orta bölge',
      descriptionTr: 'Ölçüm ölçeğinde her iki kutba da esneklikle kayabilen dengeli bir orta konumdasınız.',
      scoreRangeTr: '2.60 – 3.40',
      explanationNoteTr: SCALE_POSITION_EXPLANATION_NOTE,
    };
  }

  if (clamped <= 4.20) {
    return {
      bandCode: 'MID_HIGH',
      labelTr: 'Orta-üst bölge',
      descriptionTr: 'Ölçüm ölçeğinde belirginleşen, orta hattın üzerinde güçlü bir eğilim göstermektesiniz.',
      scoreRangeTr: '3.41 – 4.20',
      explanationNoteTr: SCALE_POSITION_EXPLANATION_NOTE,
    };
  }

  return {
    bandCode: 'HIGH',
    labelTr: 'Yüksek uca yakın',
    descriptionTr: 'Bu boyutta ölçüm ölçeğinin en üst bölgesinde çok belirgin bir eğilimdesiniz.',
    scoreRangeTr: '4.21 – 5.00',
    explanationNoteTr: SCALE_POSITION_EXPLANATION_NOTE,
  };
}

/**
 * Translates internal measurement status enums into clean consumer language.
 */
export function sanitizeMeasurementStatus(status: string | undefined): string {
  if (!status) return 'Henüz keşfedilmedi';
  switch (status.toUpperCase()) {
    case 'MEASURED_PRECALIBRATION':
    case 'PROVISIONAL_POINT_ESTIMATE':
    case 'MEASURED':
      return 'Ölçüldü';
    case 'NOT_MEASURED':
    case 'UNMEASURED':
    case 'MISSING':
      return 'Henüz keşfedilmedi';
    case 'PARTIALLY_EXPLORED':
    case 'IN_PROGRESS':
      return 'Kısmen keşfedildi';
    case 'VERSION_INCOMPATIBLE':
      return 'Bu iki ölçüm doğrudan karşılaştırılamıyor';
    case 'QUALITY_LIMITED':
      return 'Bu karşılaştırmayı daha temkinli yorumlamak gerekiyor';
    default:
      return 'Ölçüldü';
  }
}

/**
 * Translates internal epistemic claim types into warm consumer labels.
 */
export function sanitizeEpistemicClaimType(claimType: string | undefined): string {
  if (!claimType) return 'Kuramsal Yorum';
  switch (claimType.toUpperCase()) {
    case 'MEASURED_FINDING':
      return 'Ölçülen Dayanak';
    case 'THEORETICAL_INTERPRETATION':
      return 'Kuramsal Yorum';
    case 'REFLECTIVE_HYPOTHESIS':
      return 'Üzerinde Düşünebileceğin Sorular';
    case 'USER_PROVIDED_CONTEXT':
      return 'Kullanıcı Bildirimi / Günlük';
    case 'DETERMINISTIC_PATTERN':
      return 'Öne Çıkan Örüntü';
    default:
      return 'Kuramsal Yorum';
  }
}

/**
 * Safe neutral tension & balance phrasing (replaces pathologizing or clinical risk words).
 */
export function neutralizeTensionDescription(text: string): string {
  if (!text) return '';
  return text
    .replace(/tükenmişlik riski/gi, 'zorlayıcı olabilecek denge noktası')
    .replace(/depresyon riski/gi, 'duygusal yük oluşturabilecek alan')
    .replace(/kişilik problemi/gi, 'daha fazla dikkat gerektiren eğilim')
    .replace(/travma/gi, 'zorlayıcı yaşam deneyimi')
    .replace(/klinik risk/gi, 'hassas denge alanı')
    .replace(/risk/gi, 'denge noktası');
}

/**
 * Empty norm handler message.
 */
export const EMPTY_NORM_CONSUMER_MESSAGE =
  'Toplum normlarıyla karşılaştırma henüz sunulmuyor. Sonuçlar yalnızca yanıtlarınızın ölçüm ölçeğindeki konumuna dayanır.';
