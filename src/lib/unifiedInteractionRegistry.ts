/**
 * PsycheAI Deterministic Psychological Interaction & Tension Registry
 * 
 * Defines evidence-supported cross-domain and within-domain synergies, tensions, and modulations.
 * Strictly enforces:
 * - Explicit required construct codes (no rule triggers if any required dimension is unmeasured)
 * - Scale-aware predicates evaluating construct scores
 * - Epistemic status (THEORETICAL_INTERPRETATION, PROVISIONAL_PATTERN, EVIDENCE_SUPPORTED_INTERPRETATION)
 * - Clear scientific rationale and limitations
 * - Clean separation between measurement inconsistency, intrapersonal tension, and contextual modulation.
 */

export type InteractionType = 'SYNERGY' | 'TENSION' | 'MODULATION';

export type TensionMatrixState =
  | 'CONVERGENT'
  | 'POTENTIAL_TENSION'
  | 'CONTEXT_DEPENDENT'
  | 'INSUFFICIENT_DATA';

export interface UnifiedInteractionRule {
  id: string;
  titleTr: string;
  type: InteractionType;
  requiredConstructCodes: string[];
  scientificRationale: string;
  sourceReferences?: string[];
  descriptionTr: string;
  limitationsTr: string;
  epistemicStatus: string;
  evaluate: (scores: Record<string, { score: number; scaleMin: number; scaleMax: number }>) => boolean;
  getSourceDimensionNames: (scores: Record<string, { nameTr: string }>) => string[];
}

export interface ProfileTensionItem {
  id: string;
  titleTr: string;
  type: InteractionType;
  state: TensionMatrixState;
  stateLabelTr: string;
  sourceDimensionCodes: string[];
  sourceDimensionNames: string[];
  descriptionTr: string;
  scientificRationale: string;
  reflectionPromptTr: string;
  limitationsTr: string;
  epistemicStatus: string;
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
    scientificRationale: 'Düşük duygusal tepkisellik ile yüksek öz-yeterlik inancı kriz yönetiminde problem odaklı başa çıkmayı destekler.',
    sourceReferences: ['Bandura (1997)', 'Ashton & Lee (2007)'],
    descriptionTr:
      'Düşük Duygusallık (soğukkanlılık) ve yüksek Genel Öz-Yeterlik inancı; belirsizlik ve kriz anlarında paniğe kapılmadan çözüm odaklı eylemleri kararlılıkla yürütmeyi sağlar.',
    limitationsTr: 'Bu dinamik stresli durumlar için geçerli bir eğilimdir; durumsal tükenmişlik durumlarında değişkenlik gösterebilir.',
    epistemicStatus: 'THEORETICAL_INTERPRETATION',
    evaluate: (scores) => {
      const em = toRatio(scores['emotionality']);
      const ag = toRatio(scores['agency_mastery']);
      return em < 0.38 && ag > 0.62;
    },
    getSourceDimensionNames: () => ['Duygusallık (Soğukkanlılık)', 'Yetkinlik ve İrade (Genel Öz-Yeterlik)'],
  },
  {
    id: 'confident_extraversion_synergy',
    titleTr: 'Özgüvenli Sosyal Girişimcilik',
    type: 'SYNERGY',
    requiredConstructCodes: ['extraversion', 'self_evaluation'],
    scientificRationale: 'Dışadönüklük ve olumlu benlik saygısı sosyal ortamlarda inisiyatif alma ve liderlik etme motivasyonunu güçlendirir.',
    sourceReferences: ['Judge et al. (2002)', 'Somer et al. (2016)'],
    descriptionTr:
      'Yüksek Dışadönüklük ve sağlam Benlik Saygısı; sosyal ortamlarda reddedilme korkusu yaşamadan inisiyatif almayı ve fikirleri güvenle ifade etmeyi kolaylaştırır.',
    limitationsTr: 'Sosyal bağlamın hiyerarşik veya destekleyici yapısına göre ifade biçimi farklılaşabilir.',
    epistemicStatus: 'THEORETICAL_INTERPRETATION',
    evaluate: (scores) => {
      const ex = toRatio(scores['extraversion']);
      const se = toRatio(scores['self_evaluation']);
      return ex > 0.62 && se > 0.62;
    },
    getSourceDimensionNames: () => ['Dışadönüklük', 'Benlik Değerlendirmesi (Özsaygı)'],
  },
  {
    id: 'perfectionist_vulnerability_tension',
    titleTr: 'Mükemmeliyetçi Öz-Eleştiri Gerilimi',
    type: 'TENSION',
    requiredConstructCodes: ['conscientiousness', 'self_evaluation'],
    scientificRationale: 'Yüksek standartlar ve titizlik ile kırılgan benlik saygısı birlikteliği performans anksiyetesini tetikleyebilir.',
    sourceReferences: ['Frost et al. (1990)', 'Stoeber & Otto (2006)'],
    descriptionTr:
      'Yüksek Sorumluluk ve titizlik ile daha temkinli Benlik Saygısı; hata yapıldığında kişinin kendine karşı aşırı sertleşmesine ve performans kaygısı yaşamasına zemin hazırlayabilir.',
    limitationsTr: 'Bu bir klinik tanı değildir; yüksek standartların içsel baskıya dönüşme eğilimini betimler.',
    epistemicStatus: 'PROVISIONAL_PATTERN',
    evaluate: (scores) => {
      const co = toRatio(scores['conscientiousness']);
      const se = toRatio(scores['self_evaluation']);
      return co > 0.65 && se < 0.40;
    },
    getSourceDimensionNames: () => ['Sorumluluk', 'Benlik Değerlendirmesi (Özsaygı)'],
  },
  {
    id: 'empathy_vulnerability_tension',
    titleTr: 'Duygusal Yüklenme ve Yetersizlik Hissi Riski',
    type: 'TENSION',
    requiredConstructCodes: ['emotionality', 'self_evaluation'],
    scientificRationale: 'Yüksek duygusal duyarlılık ve kırılgan benlik algısı olumsuz geri bildirimlerin içselleştirilmesini artırabilir.',
    sourceReferences: ['Neff (2003)', 'Ashton et al. (2014)'],
    descriptionTr:
      'Yüksek Duygusallık ve hassasiyet ile temkinli Benlik Saygısı; olumsuz geri bildirimleri ve dışsal zorlukları kişiselleştirip içselleştirme eğilimini artırabilir. Öz-şefkat pratikleri önerilir.',
    limitationsTr: 'Sosyal destek mekanizmaları bu gerilimin etkisini hafifletebilir.',
    epistemicStatus: 'PROVISIONAL_PATTERN',
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
    scientificRationale: 'Sosyal enerji ve metodolojik çalışma disiplini projelerin sürdürülebilirliğini ve görünürlüğünü artırır.',
    sourceReferences: ['Barrick & Mount (1991)'],
    descriptionTr:
      'Yüksek Dışadönüklük ve Yüksek Sorumluluk birlikteliği; vizyoner hedefleri disiplinli bir planlama ve sosyal motivasyonla somut başarılara dönüştürme gücü verir.',
    limitationsTr: 'Aşırı iş yükü durumlarında dinlenme dengesinin gözetilmesi önerilir.',
    epistemicStatus: 'THEORETICAL_INTERPRETATION',
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
    scientificRationale: 'Yüksek duygulanım ve düşük tolerans stres altında ani çatışma tepkilerini tetikleyebilir.',
    sourceReferences: ['Lee & Ashton (2004)'],
    descriptionTr:
      'Yüksek Duygusallık ile Düşük Uyumluluk; stresli durumlarda duygusal baskının doğrudan ve sert tepkilere dönüşmesine yol açabilir. Çatışma anlarında bilinçli bir duraklama önerilir.',
    limitationsTr: 'İletişim becerileri eğitimi ve durumsal farkındalık bu eğilimi dengeleyebilir.',
    epistemicStatus: 'PROVISIONAL_PATTERN',
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
    scientificRationale: 'Alçakgönüllülük ve uzlaşmacılık uzun vadeli takım güvenini ve psikolojik güvenliği inşa eder.',
    sourceReferences: ['Ashton & Lee (2007)'],
    descriptionTr:
      'Yüksek Dürüstlük-Alçakgönüllülük ve Yüksek Uyumluluk birlikteliği; derin ve samimi güven ilişkileri kurarak ekiplerde yapıcı ve huzurlu bir işbirliği zemini oluşturur.',
    limitationsTr: 'Zorlu müzakerelerde kişisel sınırların net çizilmesi önem taşır.',
    epistemicStatus: 'THEORETICAL_INTERPRETATION',
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
    scientificRationale: 'Açık fikirli yaratıcılık ile sistematik çalışma alışkanlığı özgün fikirlerin hayata geçmesini sağlar.',
    sourceReferences: ['Costa & McCrae (1992)', 'Ashton & Lee (2007)'],
    descriptionTr:
      'Yüksek Deneyime Açıklık ve Yüksek Sorumluluk; soyut yaratıcılığı ve özgün fikirleri havada bırakmayıp somut, metodolojik projelere dönüştürmeyi sağlar.',
    limitationsTr: 'Fikir üretme ile uygulama fazları arasında önceliklendirme gerektirir.',
    epistemicStatus: 'THEORETICAL_INTERPRETATION',
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
    scientificRationale: 'Sürekli yeni uyaran arayışı ve düşük rutin disiplini başlanan işlerin yarım kalmasına yol açabilir.',
    sourceReferences: ['DeYoung (2015)'],
    descriptionTr:
      'Yüksek Deneyime Açıklık ile Düşük Sorumluluk; zengin ve yeni fikirlere hızla yönelme sağlarken, başlanan projeleri sonlandırmada ekstra yapılandırma ve dışsal takip desteği gerektirebilir.',
    limitationsTr: 'Yaratıcı kuluçka evrelerinde bu esneklik bir avantaj olarak da değerlendirilebilir.',
    epistemicStatus: 'PROVISIONAL_PATTERN',
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
    scientificRationale: 'Hassas risk algısı ile titiz hazırlık kriz önleyici stratejilerin geliştirilmesini sağlar.',
    sourceReferences: ['Lee & Ashton (2004)'],
    descriptionTr:
      'Yüksek Duygusallık ile Yüksek Sorumluluk; risk algısını titiz bir hazırlık ve detaylı önlem planlarına dönüştürerek olası krizlerin önüne geçer.',
    limitationsTr: 'Gereksiz mükemmeliyetçilik veya aşırı temkinlilik karar alma hızını yavaşlatabilir.',
    epistemicStatus: 'THEORETICAL_INTERPRETATION',
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
    scientificRationale: 'Yüksek sosyal girişkenlik ve düşük uzlaşmacılık doğrudan çatışma olasılığını artırır.',
    sourceReferences: ['Graziano et al. (1996)'],
    descriptionTr:
      'Yüksek Dışadönüklük ve Düşük Uyumluluk; toplantı ve tartışmalarda cesur ve baskın bir duruş sağlarken, diplomatik incelik gerektiren anlarda sürtüşmelere yol açabilir.',
    limitationsTr: 'Liderlik ve kriz anlarında doğrudan iletişim yapıcı sonuçlar da doğurabilir.',
    epistemicStatus: 'PROVISIONAL_PATTERN',
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
    scientificRationale: 'Düşük kaygı ve yüksek organizasyon kriz ortamlarında soğukkanlı karar almayı destekler.',
    sourceReferences: ['Ashton & Lee (2007)'],
    descriptionTr:
      'Düşük Duygusallık ve Yüksek Sorumluluk; yüksek baskı altındaki kriz ortamlarında soğukkanlılığı koruyarak adım adım rasyonel eylem planları uygulamayı sağlar.',
    limitationsTr: 'Duygusal empati gerektiren insan odaklı süreçlerde ekstra özen gösterilmelidir.',
    epistemicStatus: 'THEORETICAL_INTERPRETATION',
    evaluate: (scores) => {
      const em = toRatio(scores['emotionality']);
      const co = toRatio(scores['conscientiousness']);
      return em < 0.38 && co > 0.62;
    },
    getSourceDimensionNames: () => ['Duygusallık (Soğukkanlılık)', 'Sorumluluk'],
  },
  // ---------------------------------------------------------
  // 3. Contextual Modulation Rules
  // ---------------------------------------------------------
  {
    id: 'social_assertiveness_relational_caution_modulation',
    titleTr: 'Sosyal Girişkenlik ve Yakın İlişki Temkinliliği Modülasyonu',
    type: 'MODULATION',
    requiredConstructCodes: ['extraversion', 'emotionality'],
    scientificRationale: 'Geniş sosyal ortamlarda yüksek enerji ile yakın ikili ilişkilerde temkinli yaklaşım bağlamsal bir modülasyondur.',
    sourceReferences: ['Bowlby (1982)', 'Ashton & Lee (2007)'],
    descriptionTr:
      'Sosyal ortamlarda dışadönük ve aktif bir profil sergilenirken, yakın duygusal bağlarda temkinli veya seçici bir yaklaşım gözlenebilir. Bu bir çelişki değil, bağlama göre değişen sağlıklı bir sınır yönetimidir.',
    limitationsTr: 'Sosyal bağlam ile samimi ilişki bağlamı arasındaki dinamikler duruma göre farklılaşır.',
    epistemicStatus: 'THEORETICAL_INTERPRETATION',
    evaluate: (scores) => {
      const ex = toRatio(scores['extraversion']);
      const em = toRatio(scores['emotionality']);
      return ex > 0.62 && em > 0.62;
    },
    getSourceDimensionNames: () => ['Dışadönüklük (Sosyal Enerji)', 'Duygusallık (Hassasiyet)'],
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
  type: InteractionType;
  descriptionTr: string;
  epistemicStatus: string;
  sourceDimensions: string[];
  sourceDimensionCodes: string[];
}> {
  const results: Array<{
    id: string;
    titleTr: string;
    type: InteractionType;
    descriptionTr: string;
    epistemicStatus: string;
    sourceDimensions: string[];
    sourceDimensionCodes: string[];
  }> = [];

  for (const rule of UNIFIED_INTERACTION_RULES) {
    const hasAllDimensions = rule.requiredConstructCodes.every(
      (code) => measuredConstructsMap[code] !== undefined
    );
    if (!hasAllDimensions) continue;

    if (rule.evaluate(measuredConstructsMap)) {
      results.push({
        id: rule.id,
        titleTr: rule.titleTr,
        type: rule.type,
        descriptionTr: rule.descriptionTr,
        epistemicStatus: rule.epistemicStatus,
        sourceDimensions: rule.getSourceDimensionNames(measuredConstructsMap),
        sourceDimensionCodes: rule.requiredConstructCodes,
      });
    }
  }

  return results;
}

/**
 * Evaluates the Profile Tension Matrix.
 * Cleanly distinguishes:
 * - CONVERGENT (synergistic harmony)
 * - POTENTIAL_TENSION (intrapersonal tension requiring self-awareness)
 * - CONTEXT_DEPENDENT (contextual modulation, e.g. work vs relational style)
 * - INSUFFICIENT_DATA
 */
export function evaluateProfileTensionMatrix(
  measuredConstructsMap: Record<string, { score: number; scaleMin: number; scaleMax: number; nameTr: string }>
): ProfileTensionItem[] {
  const tensionItems: ProfileTensionItem[] = [];

  for (const rule of UNIFIED_INTERACTION_RULES) {
    const hasAllDimensions = rule.requiredConstructCodes.every(
      (code) => measuredConstructsMap[code] !== undefined
    );

    if (!hasAllDimensions) continue;

    if (rule.evaluate(measuredConstructsMap)) {
      let state: TensionMatrixState = 'CONVERGENT';
      let stateLabelTr = 'Uyumlu / Sinerjik';
      let reflectionPromptTr = 'Bu güçlü sinerjiyi günlük hedeflerinizde nasıl avantaja dönüştürebilirsiniz?';

      if (rule.type === 'TENSION') {
        state = 'POTENTIAL_TENSION';
        stateLabelTr = 'Potansiyel İçsel Gerilim';
        reflectionPromptTr = 'Bu iki eğilim karşı karşıya geldiğinde kendinize nasıl alan açabilirsiniz?';
      } else if (rule.type === 'MODULATION') {
        state = 'CONTEXT_DEPENDENT';
        stateLabelTr = 'Bağlama Dayalı Değişkenlik';
        reflectionPromptTr = 'Farklı ortamlarda bu iki yönünüzün nasıl dengelendiğini gözlemleyin.';
      }

      tensionItems.push({
        id: rule.id,
        titleTr: rule.titleTr,
        type: rule.type,
        state,
        stateLabelTr,
        sourceDimensionCodes: rule.requiredConstructCodes,
        sourceDimensionNames: rule.getSourceDimensionNames(measuredConstructsMap),
        descriptionTr: rule.descriptionTr,
        scientificRationale: rule.scientificRationale,
        reflectionPromptTr,
        limitationsTr: rule.limitationsTr,
        epistemicStatus: rule.epistemicStatus,
      });
    }
  }

  return tensionItems;
}
