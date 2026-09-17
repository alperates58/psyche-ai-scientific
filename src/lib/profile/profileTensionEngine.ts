/**
 * PsycheAI Deterministic Psychological Tension Engine
 *
 * Identifies intrapersonal polarities, competing needs, and developmental friction points.
 * Enforces strict scientific principles:
 * - Deterministic, non-AI rule evaluation.
 * - Strictly evaluates measured facet evidence.
 * - Avoids pathological framing, psychiatric diagnosis, and value judgements.
 * - Avoids causal claims ("causes").
 * - Fully exposes constituent facet IDs and scientific rationales.
 */

import { ProfilePatternItemV2 } from '@/types/unifiedProfileV2';
import { MASTER_FACET_BY_ID } from './masterModelConstants';

export interface DeterministicTensionRule {
  id: string;
  titleTr: string;
  requiredFacetIds: string[];
  scientificRationaleTr: string;
  descriptionTr: string;
  reflectionPromptTr: string;
  limitationsTr: string;
  epistemicStatus: string;
  confidence: 'HIGH' | 'MODERATE' | 'LOW';
  evaluate: (facetScores: Map<string, number>) => boolean;
}

export const DETERMINISTIC_TENSION_RULES: DeterministicTensionRule[] = [
  {
    id: 'ten_closure_vs_openness',
    titleTr: 'Bilişsel Kapanma İhtiyacı ve Yeniliğe Açıklık Gerilimi',
    requiredFacetIds: ['need_for_cognitive_closure', 'inquisitiveness', 'unconventionality'],
    scientificRationaleTr: 'Hızlı netlik arayışı (kapanma ihtiyacı) ile belirsiz, sıra dışı ve yenilikçi fikirleri keşfetme arzusu aynı profilde karşıt eğilimler oluşturabilir (Webster & Kruglanski, 1994).',
    descriptionTr: 'Bir yandan belirsizlikten hızla kurtulup net kurallar ve kararlar belirleme arzusu varken, diğer yandan sıra dışı ve alışılmadık fikirleri keşfetme merakı birlikte yer almaktadır.',
    reflectionPromptTr: 'Yeni bir fikir veya proje geliştirirken ne zaman keşfetmeye devam edip ne zaman son kararı vermeniz gerektiğine nasıl karar veriyorsunuz?',
    limitationsTr: 'Bu durum bir kişilik kusuru değil, zihinsel derinlik ve hız arasındaki doğal bir dengeleme sürecidir.',
    epistemicStatus: 'EVIDENCE_SUPPORTED_TENSION',
    confidence: 'HIGH',
    evaluate: (scores) => {
      const nfc = scores.get('need_for_cognitive_closure') ?? 0;
      const inq = scores.get('inquisitiveness') ?? 0;
      const unc = scores.get('unconventionality') ?? 0;
      return nfc >= 3.6 && (inq >= 3.6 || unc >= 3.6);
    },
  },
  {
    id: 'ten_empathy_vs_assertiveness',
    titleTr: 'Yüksek Empatik Duyarlık ve Sınır Koyma Güçlüğü',
    requiredFacetIds: ['empathic_concern', 'assertiveness'],
    scientificRationaleTr: 'Yüksek başkası odaklı duyarlılık ile görece düşük atılganlık, kişinin kendi sınırlarını ve ihtiyaçlarını savunmasında içsel sürtünme yaratabilir (Davis, 1983; Alberti & Emmons, 2017).',
    descriptionTr: 'Başkalarının duygusal ihtiyaçlarına karşı yüksek bir hassasiyet gösterilirken, kendi sınırlarını ve taleplerini net bir şekilde ifade etmekte görece zorlanma eğilimi görülebilir.',
    reflectionPromptTr: 'Başkalarını kırmamak veya üzmemek adına kendi zamanınızdan ya da önceliklerinizden taviz verdiğiniz durumları nasıl yönetebilirsiniz?',
    limitationsTr: 'Kişilerarası yakınlık düzeyine ve ilişkinin hiyerarşik yapısına göre bu dinamik değişkenlik gösterebilir.',
    epistemicStatus: 'EVIDENCE_SUPPORTED_TENSION',
    confidence: 'HIGH',
    evaluate: (scores) => {
      const ec = scores.get('empathic_concern') ?? 0;
      const ass = scores.get('assertiveness') ?? 0;
      return ec >= 3.7 && ass <= 2.6;
    },
  },
  {
    id: 'ten_perfectionism_vs_flexibility',
    titleTr: 'Kusursuzluk Standartları ve Esneklik İhtiyacı Gerilimi',
    requiredFacetIds: ['perfectionism', 'flexibility'],
    scientificRationaleTr: 'Aşırı yüksek ayrıntı ve standart titizliği (perfectionism) ile uzlaşmacı esneklik ihtiyacı plan değişikliklerinde içsel gerginlik yaratabilir (Hewitt & Flett, 1991; Ashton & Lee, 2007).',
    descriptionTr: 'İşleri en yüksek kalitede ve hatasız tamamlama arzusu yüksekken, beklenmedik aksilikler veya değişen koşullar karşısında planları esnetmede içsel bir direnç yaşanabilir.',
    reflectionPromptTr: 'Planlarınız dış etkenlerle değişmek zorunda kaldığında "yeterince iyi" standardını kabul etmek size nasıl hissettiriyor?',
    limitationsTr: 'Görevin kritiklik derecesine ve zaman baskısına göre esneklik tepkisi değişebilir.',
    epistemicStatus: 'EVIDENCE_SUPPORTED_TENSION',
    confidence: 'HIGH',
    evaluate: (scores) => {
      const perf = scores.get('perfectionism') ?? 0;
      const flex = scores.get('flexibility') ?? 0;
      return perf >= 3.8 && flex <= 2.6;
    },
  },
  {
    id: 'ten_maximizing_vs_decisiveness',
    titleTr: 'En İyiyi Bulma Arayışı ve Karar Erteleme',
    requiredFacetIds: ['decision_style_maximizing', 'procrastination_tendency'],
    scientificRationaleTr: 'Tüm alternatifleri eksiksiz değerlendirme arzusu (maximizing) bilişsel aşırı yüklenme yaratarak eyleme geçmeyi ertelemeye yol açabilir (Schwartz et al., 2002; Steel, 2007).',
    descriptionTr: 'Her kararda olası en mükemmel tercihi bulma çabası ile karara varıp eyleme başlamayı geciktirme eğilimi bir arada bulunabilir.',
    reflectionPromptTr: 'Seçeneklerin çok olduğu durumlarda tatmin edici bir karara ulaştığınızı gösteren asgari kriterleriniz nelerdir?',
    limitationsTr: 'Kararın önemi ve geri döndürülemezlik düzeyine göre erteleme eğilimi farklılaşabilir.',
    epistemicStatus: 'EVIDENCE_SUPPORTED_TENSION',
    confidence: 'HIGH',
    evaluate: (scores) => {
      const max = scores.get('decision_style_maximizing') ?? 0;
      const proc = scores.get('procrastination_tendency') ?? 0;
      return max >= 3.7 && proc >= 3.4;
    },
  },
  {
    id: 'ten_anxious_attachment_vs_suppression',
    titleTr: 'Bağlanma Kaygısı ve Duyguları Bastırma Gerilimi',
    requiredFacetIds: ['attachment_anxiety', 'expressive_suppression'],
    scientificRationaleTr: 'İlişkilerde terk edilme veya sevilmeme kaygısı taşırken içsel duyguları dışarı yansıtmama (baskılama) içsel stres birikimine yol açabilir (Mikulincer & Shaver, 2007; Gross, 2002).',
    descriptionTr: 'Yakın ilişkilerde onay ve güven ihtiyacı yoğun hissedilirken, yaşanan kırgınlık veya endişeleri dışa vurmayıp bastırma eğilimi görülebilir.',
    reflectionPromptTr: 'Yakın ilişkilerinizde güvende hissetmediğiniz anlarda duygularınızı açıkça paylaşmak yerine bastırmak size ve ilişkinize nasıl yansıyor?',
    limitationsTr: 'Partnerin tepkiselliğine ve ilişkinin güven ortamına göre duygusal ifade tarzı değişebilir.',
    epistemicStatus: 'EVIDENCE_SUPPORTED_TENSION',
    confidence: 'HIGH',
    evaluate: (scores) => {
      const anx = scores.get('attachment_anxiety') ?? 0;
      const sup = scores.get('expressive_suppression') ?? 0;
      return anx >= 3.5 && sup >= 3.5;
    },
  },
  {
    id: 'ten_urgency_vs_self_control',
    titleTr: 'Duygusal Aciliyet ve İrade Kontrolü Dengesi',
    requiredFacetIds: ['uppsp_negative_urgency', 'general_self_control'],
    scientificRationaleTr: 'Yoğun olumsuz duygu anlarında düşünmeden tepki verme dürtüsü (negative urgency) ile genel irade kontrolü arasında dönemsel çekişme yaşanabilir (Whiteside & Lynam, 2001; Tangney et al., 2004).',
    descriptionTr: 'Sakin zamanlarda yüksek öz-kontrol ve disiplin sergilenebilirken, ani ve yoğun duygusal baskı altında dürtüsel kararlar alma riski ortaya çıkabilir.',
    reflectionPromptTr: 'Yoğun öfke, hayal kırıklığı veya kaygı hissettiğiniz anlarda tepki vermeden önce kendinize kısa bir mola alanı yaratmak nasıl bir fark yaratır?',
    limitationsTr: 'Yorgunluk, açlık ve kronik stres gibi fizyolojik faktörler dürtü kontrol eşiğini doğrudan etkiler.',
    epistemicStatus: 'EVIDENCE_SUPPORTED_TENSION',
    confidence: 'HIGH',
    evaluate: (scores) => {
      const urg = scores.get('uppsp_negative_urgency') ?? 0;
      const gsc = scores.get('general_self_control') ?? 0;
      return urg >= 3.5 && gsc >= 3.4;
    },
  },
  {
    id: 'ten_search_vs_presence_of_meaning',
    titleTr: 'Yoğun Anlam Arayışı ve Mevcut Anlam Boşluğu Gerilimi',
    requiredFacetIds: ['search_for_meaning', 'presence_of_meaning'],
    scientificRationaleTr: 'Yüksek varoluşsal anlam arayışı yaşanırken mevcut yaşamda anlam bulma algısının düşük olması varoluşsal bir arayış dönemine işaret eder (Steger et al., 2006).',
    descriptionTr: 'Yaşama derin bir amaç ve anlam kazandırma isteği çok güçlüyken, mevcut yaşam koşullarında bu anlamı henüz tam olarak bulamama hissi bir arada yer almaktadır.',
    reflectionPromptTr: 'Şu anki yaşamınızda size en çok anlam veren küçük günlük anları ve değerleri nasıl daha görünür kılabilirsiniz?',
    limitationsTr: 'Kariyer ve yaşam geçiş dönemlerinde (mezuniyet, iş değişimi) bu dinamik çok yaygın ve geçicidir.',
    epistemicStatus: 'EVIDENCE_SUPPORTED_TENSION',
    confidence: 'HIGH',
    evaluate: (scores) => {
      const sfm = scores.get('search_for_meaning') ?? 0;
      const pom = scores.get('presence_of_meaning') ?? 0;
      return sfm >= 3.8 && pom <= 2.6;
    },
  },
  {
    id: 'ten_social_boldness_vs_rejection_sensitivity',
    titleTr: 'Sosyal Girişkenlik ve Reddedilme Hassasiyeti İkilemi',
    requiredFacetIds: ['social_boldness', 'rejection_sensitivity_nonclinical'],
    scientificRationaleTr: 'Sosyal ortamlarda öne çıkma cesareti taşırken olası bir dışlanma veya soğuk karşılanma ipucuna karşı aşırı hassasiyet gösterme durumudur (Downey & Feldman, 1996; Ashton & Lee, 2007).',
    descriptionTr: 'Topluluk önünde konuşma ve liderlik etme cesareti sergilenirken, aynı zamanda diğer insanların olumsuz tepkilerine veya ilgisizliğine karşı yüksek bir içsel alınganlık hissedilebilir.',
    reflectionPromptTr: 'Bir grupta inisiyatif aldığınızda aldığınız nötr geri bildirimleri doğrudan kişisel bir reddedilme olarak yorumlamaktan nasıl kaçınabilirsiniz?',
    limitationsTr: 'Grubun tanıdıklık düzeyine ve ortamın samimiyetine göre hassasiyet tepkisi değişir.',
    epistemicStatus: 'EVIDENCE_SUPPORTED_TENSION',
    confidence: 'HIGH',
    evaluate: (scores) => {
      const sb = scores.get('social_boldness') ?? 0;
      const rs = scores.get('rejection_sensitivity_nonclinical') ?? 0;
      return sb >= 3.6 && rs >= 3.5;
    },
  },
];

export const TENSION_RULES = DETERMINISTIC_TENSION_RULES;

export function generateDeterministicTensions(facetScoresMap: Map<string, number>): ProfilePatternItemV2[] {
  const tensions: ProfilePatternItemV2[] = [];

  for (const rule of DETERMINISTIC_TENSION_RULES) {
    const hasAllFacets = rule.requiredFacetIds.every((fId) => facetScoresMap.has(fId));
    if (!hasAllFacets) continue;

    if (rule.evaluate(facetScoresMap)) {
      const sourceFacetNamesTr = rule.requiredFacetIds.map(
        (fId) => MASTER_FACET_BY_ID.get(fId)?.nameTr || fId
      );

      tensions.push({
        id: rule.id,
        titleTr: rule.titleTr,
        type: 'TENSION',
        descriptionTr: rule.descriptionTr,
        scientificRationaleTr: rule.scientificRationaleTr,
        sourceFacetIds: rule.requiredFacetIds,
        sourceFacetNamesTr,
        epistemicStatus: rule.epistemicStatus,
        confidence: rule.confidence,
        reflectionPromptTr: rule.reflectionPromptTr,
        limitationsTr: rule.limitationsTr,
      });
    }
  }

  return tensions;
}

export function evaluateProfileTensions(
  facetData: Map<string, number> | Map<string, any>
): ProfilePatternItemV2[] {
  const scoresMap = new Map<string, number>();
  for (const [key, val] of facetData.entries()) {
    if (typeof val === 'number') {
      scoresMap.set(key, val);
    } else if (val && typeof val === 'object' && val.score !== null && typeof val.score === 'number') {
      scoresMap.set(key, val.score);
    }
  }
  return generateDeterministicTensions(scoresMap);
}
