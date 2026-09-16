/**
 * PsycheAI Deterministic Psychological Interaction Registry
 * 
 * Defines evidence-supported cross-domain and within-domain synergies and tensions.
 * Every rule explicitly lists:
 * - required construct codes (all must be measured; if any is unmeasured, the rule is skipped)
 * - scale-aware predicate evaluating construct scores
 * - epistemic status
 * - Turkish explanation narrative
 */

export interface UnifiedInteractionRule {
  id: string;
  titleTr: string;
  type: 'SYNERGY' | 'TENSION';
  requiredConstructCodes: string[];
  descriptionTr: string;
  epistemicStatus: string;
  evaluate: (scores: Record<string, { score: number; scaleMin: number; scaleMax: number }>) => boolean;
  getSourceDimensionNames: (scores: Record<string, { nameTr: string }>) => string[];
}

/**
 * Helper to normalize a score to 0.0–1.0 ratio for scale-independent condition checks
 */
function toRatio(entry?: { score: number; scaleMin: number; scaleMax: number }): number {
  if (!entry) return 0.5;
  const range = entry.scaleMax - entry.scaleMin;
  if (range <= 0) return 0.5;
  return (entry.score - entry.scaleMin) / range;
}

export const UNIFIED_INTERACTION_RULES: UnifiedInteractionRule[] = [
  // ---------------------------------------------------------
  // 1. Cross-Domain: Core Personality + Self-System
  // ---------------------------------------------------------
  {
    id: 'resilient_agency_synergy',
    titleTr: 'Dirençli Öz-Yeterlik ve Soğukkanlılık Sinerjisi',
    type: 'SYNERGY',
    requiredConstructCodes: ['emotionality', 'agency_mastery'],
    epistemicStatus: 'EVIDENCE_SUPPORTED_INTERPRETATION',
    descriptionTr:
      'Düşük Duygusallık (soğukkanlılık) ve yüksek Genel Öz-Yeterlik inancı; belirsizlik ve kriz anlarında paniğe kapılmadan çözüm odaklı eylemleri kararlılıkla yürütmeyi sağlar.',
    evaluate: (scores) => {
      const em = toRatio(scores['emotionality']);
      const ag = toRatio(scores['agency_mastery']);
      return em < 0.38 && ag > 0.62; // Low emotionality (<2.5 on 1-5), High agency (>2.85 on 1-4)
    },
    getSourceDimensionNames: () => ['Duygusallık (Soğukkanlılık)', 'Yetkinlik ve İrade (Genel Öz-Yeterlik)'],
  },
  {
    id: 'confident_extraversion_synergy',
    titleTr: 'Özgüvenli Sosyal Girişimcilik',
    type: 'SYNERGY',
    requiredConstructCodes: ['extraversion', 'self_evaluation'],
    epistemicStatus: 'EVIDENCE_SUPPORTED_INTERPRETATION',
    descriptionTr:
      'Yüksek Dışadönüklük ve sağlam Benlik Saygısı; sosyal ortamlarda reddedilme korkusu yaşamadan inisiyatif almayı ve fikirleri güvenle ifade etmeyi kolaylaştırır.',
    evaluate: (scores) => {
      const ex = toRatio(scores['extraversion']);
      const se = toRatio(scores['self_evaluation']);
      return ex > 0.62 && se > 0.62; // High extraversion (>3.5 on 1-5), High self-esteem (>2.85 on 1-4)
    },
    getSourceDimensionNames: () => ['Dışadönüklük', 'Benlik Değerlendirmesi (Özsaygı)'],
  },
  {
    id: 'perfectionist_vulnerability_tension',
    titleTr: 'Mükemmeliyetçi Öz-Eleştiri Gerilimi',
    type: 'TENSION',
    requiredConstructCodes: ['conscientiousness', 'self_evaluation'],
    epistemicStatus: 'PROVISIONAL_PATTERN',
    descriptionTr:
      'Yüksek Sorumluluk ve titizlik ile daha temkinli Benlik Saygısı; hata yapıldığında kişinin kendine karşı aşırı sertleşmesine ve performans kaygısı yaşamasına zemin hazırlayabilir.',
    evaluate: (scores) => {
      const co = toRatio(scores['conscientiousness']);
      const se = toRatio(scores['self_evaluation']);
      return co > 0.65 && se < 0.40; // High conscientiousness (>3.6 on 1-5), Low self-esteem (<2.2 on 1-4)
    },
    getSourceDimensionNames: () => ['Sorumluluk', 'Benlik Değerlendirmesi (Özsaygı)'],
  },
  {
    id: 'empathy_vulnerability_tension',
    titleTr: 'Duygusal Yüklenme ve Yetersizlik Hissi Riski',
    type: 'TENSION',
    requiredConstructCodes: ['emotionality', 'self_evaluation'],
    epistemicStatus: 'PROVISIONAL_PATTERN',
    descriptionTr:
      'Yüksek Duygusallık ve hassasiyet ile düşük Benlik Saygısı; olumsuz geri bildirimleri ve dışsal zorlukları kişiselleştirip içselleştirme eğilimini artırabilir. Öz-şefkat pratikleri önerilir.',
    evaluate: (scores) => {
      const em = toRatio(scores['emotionality']);
      const se = toRatio(scores['self_evaluation']);
      return em > 0.65 && se < 0.40;
    },
    getSourceDimensionNames: () => ['Duygusallık', 'Benlik Değerlendirmesi (Özsaygı)'],
  },

  // ---------------------------------------------------------
  // 2. Intra-Domain: Core Personality (HEXACO Dynamics)
  // ---------------------------------------------------------
  {
    id: 'goal_execution_dynamic',
    titleTr: 'Eylem ve Hedef Odaklılık Sinerjisi',
    type: 'SYNERGY',
    requiredConstructCodes: ['extraversion', 'conscientiousness'],
    epistemicStatus: 'EVIDENCE_SUPPORTED_INTERPRETATION',
    descriptionTr:
      'Yüksek Dışadönüklük ve Yüksek Sorumluluk birlikteliği; vizyoner hedefleri disiplinli bir planlama ve sosyal motivasyonla somut başarılara dönüştürme gücü verir.',
    evaluate: (scores) => {
      const ex = toRatio(scores['extraversion']);
      const co = toRatio(scores['conscientiousness']);
      return ex > 0.62 && co > 0.62;
    },
    getSourceDimensionNames: () => ['Dışadönüklük', 'Sorumluluk'],
  },
  {
    id: 'stress_sensitivity_friction',
    titleTr: 'Tepkisel Hassasiyet ve Gerilim Riski',
    type: 'TENSION',
    requiredConstructCodes: ['emotionality', 'agreeableness'],
    epistemicStatus: 'PROVISIONAL_PATTERN',
    descriptionTr:
      'Yüksek Duygusallık ile Düşük Uyumluluk; stresli durumlarda duygusal baskının doğrudan ve sert tepkilere dönüşmesine yol açabilir. Çatışma anlarında bilinçli bir duraklama önerilir.',
    evaluate: (scores) => {
      const em = toRatio(scores['emotionality']);
      const ag = toRatio(scores['agreeableness']);
      return em > 0.62 && ag < 0.38;
    },
    getSourceDimensionNames: () => ['Duygusallık', 'Uyumluluk'],
  },
  {
    id: 'trusted_collaboration_dynamic',
    titleTr: 'İşbirlikçi Güvenilirlik Sinerjisi',
    type: 'SYNERGY',
    requiredConstructCodes: ['honesty_humility', 'agreeableness'],
    epistemicStatus: 'EVIDENCE_SUPPORTED_INTERPRETATION',
    descriptionTr:
      'Yüksek Dürüstlük-Alçakgönüllülük ve Yüksek Uyumluluk birlikteliği; derin ve samimi güven ilişkileri kurarak ekiplerde yapıcı ve huzurlu bir işbirliği zemini oluşturur.',
    evaluate: (scores) => {
      const hh = toRatio(scores['honesty_humility']);
      const ag = toRatio(scores['agreeableness']);
      return hh > 0.62 && ag > 0.62;
    },
    getSourceDimensionNames: () => ['Dürüstlük-Alçakgönüllülük', 'Uyumluluk'],
  },
  {
    id: 'innovative_execution_dynamic',
    titleTr: 'Yenilikçi Uygulama ve Üretkenlik Sinerjisi',
    type: 'SYNERGY',
    requiredConstructCodes: ['openness_to_experience', 'conscientiousness'],
    epistemicStatus: 'EVIDENCE_SUPPORTED_INTERPRETATION',
    descriptionTr:
      'Yüksek Deneyime Açıklık ve Yüksek Sorumluluk; soyut yaratıcılığı ve özgün fikirleri havada bırakmayıp somut, metodolojik projelere dönüştürmeyi sağlar.',
    evaluate: (scores) => {
      const op = toRatio(scores['openness_to_experience']);
      const co = toRatio(scores['conscientiousness']);
      return op > 0.62 && co > 0.62;
    },
    getSourceDimensionNames: () => ['Deneyime Açıklık', 'Sorumluluk'],
  },
  {
    id: 'exploratory_focus_tension',
    titleTr: 'Keşif Arzusu ve Odak Dağılması Gerilimi',
    type: 'TENSION',
    requiredConstructCodes: ['openness_to_experience', 'conscientiousness'],
    epistemicStatus: 'PROVISIONAL_PATTERN',
    descriptionTr:
      'Yüksek Deneyime Açıklık ile Düşük Sorumluluk; zengin ve yeni fikirlere hızla yönelme sağlarken, başlanan projeleri sonlandırmada ekstra yapılandırma ve dışsal takip desteği gerektirebilir.',
    evaluate: (scores) => {
      const op = toRatio(scores['openness_to_experience']);
      const co = toRatio(scores['conscientiousness']);
      return op > 0.62 && co < 0.38;
    },
    getSourceDimensionNames: () => ['Deneyime Açıklık', 'Sorumluluk'],
  },
  {
    id: 'prepared_prudence_dynamic',
    titleTr: 'Öngörülü Tedbirlilik ve Risk Kontrolü Sinerjisi',
    type: 'SYNERGY',
    requiredConstructCodes: ['emotionality', 'conscientiousness'],
    epistemicStatus: 'EVIDENCE_SUPPORTED_INTERPRETATION',
    descriptionTr:
      'Yüksek Duygusallık ile Yüksek Sorumluluk; risk algısını titiz bir hazırlık ve detaylı önlem planlarına dönüştürerek olası krizlerin önüne geçer.',
    evaluate: (scores) => {
      const em = toRatio(scores['emotionality']);
      const co = toRatio(scores['conscientiousness']);
      return em > 0.62 && co > 0.62;
    },
    getSourceDimensionNames: () => ['Duygusallık', 'Sorumluluk'],
  },
  {
    id: 'assertive_directness_tension',
    titleTr: 'İddialı Doğrudanlık ve Sürtüşme Riski',
    type: 'TENSION',
    requiredConstructCodes: ['extraversion', 'agreeableness'],
    epistemicStatus: 'PROVISIONAL_PATTERN',
    descriptionTr:
      'Yüksek Dışadönüklük ve Düşük Uyumluluk; toplantı ve tartışmalarda cesur ve baskın bir duruş sağlarken, diplomatik incelik gerektiren anlarda sürtüşmelere yol açabilir.',
    evaluate: (scores) => {
      const ex = toRatio(scores['extraversion']);
      const ag = toRatio(scores['agreeableness']);
      return ex > 0.62 && ag < 0.38;
    },
    getSourceDimensionNames: () => ['Dışadönüklük', 'Uyumluluk'],
  },
  {
    id: 'calm_pragmatism_dynamic',
    titleTr: 'Soğukkanlı Pragmatizm Sinerjisi',
    type: 'SYNERGY',
    requiredConstructCodes: ['emotionality', 'conscientiousness'],
    epistemicStatus: 'EVIDENCE_SUPPORTED_INTERPRETATION',
    descriptionTr:
      'Düşük Duygusallık ve Yüksek Sorumluluk; yüksek baskı altındaki kriz ortamlarında soğukkanlılığı koruyarak adım adım rasyonel eylem planları uygulamayı sağlar.',
    evaluate: (scores) => {
      const em = toRatio(scores['emotionality']);
      const co = toRatio(scores['conscientiousness']);
      return em < 0.38 && co > 0.62;
    },
    getSourceDimensionNames: () => ['Duygusallık (Soğukkanlılık)', 'Sorumluluk'],
  },
];

/**
 * Evaluates all interaction rules against currently measured constructs.
 * Strictly enforces that all required construct codes must be measured.
 * Returns empty array if no rules match (no synthetic or generic fallback).
 */
export function evaluateUnifiedInteractions(
  measuredConstructsMap: Record<string, { score: number; scaleMin: number; scaleMax: number; nameTr: string }>
): Array<{
  id: string;
  titleTr: string;
  type: 'SYNERGY' | 'TENSION';
  descriptionTr: string;
  epistemicStatus: string;
  sourceDimensions: string[];
}> {
  const results: Array<{
    id: string;
    titleTr: string;
    type: 'SYNERGY' | 'TENSION';
    descriptionTr: string;
    epistemicStatus: string;
    sourceDimensions: string[];
  }> = [];

  for (const rule of UNIFIED_INTERACTION_RULES) {
    // 1. Verify that all required dimensions are measured
    const hasAllDimensions = rule.requiredConstructCodes.every(
      (code) => measuredConstructsMap[code] !== undefined
    );
    if (!hasAllDimensions) continue;

    // 2. Evaluate condition predicate
    if (rule.evaluate(measuredConstructsMap)) {
      results.push({
        id: rule.id,
        titleTr: rule.titleTr,
        type: rule.type,
        descriptionTr: rule.descriptionTr,
        epistemicStatus: rule.epistemicStatus,
        sourceDimensions: rule.getSourceDimensionNames(measuredConstructsMap),
      });
    }
  }

  return results;
}
