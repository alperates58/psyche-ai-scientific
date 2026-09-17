/**
 * PsycheAI Deterministic Synergy Engine
 *
 * Identifies mutually reinforcing positive psychological combinations.
 * Enforces strict scientific principles:
 * - Deterministic, non-AI rule evaluation.
 * - Strictly evaluates measured facet evidence.
 * - Avoids value judgements (does not rank individuals as "good" or "bad").
 * - Avoids causal claims ("causes").
 * - Fully exposes constituent facet IDs and scientific rationales.
 */

import { ProfilePatternItemV2 } from '@/types/unifiedProfileV2';
import { MASTER_FACET_BY_ID } from './masterModelConstants';

export interface DeterministicSynergyRule {
  id: string;
  titleTr: string;
  requiredFacetIds: string[];
  scientificRationaleTr: string;
  descriptionTr: string;
  reflectionPromptTr: string;
  epistemicStatus: string;
  confidence: 'HIGH' | 'MODERATE' | 'LOW';
  evaluate: (facetScores: Map<string, number>) => boolean;
}

export const DETERMINISTIC_SYNERGY_RULES: DeterministicSynergyRule[] = [
  {
    id: 'syn_self_efficacy_persistence',
    titleTr: 'Öz-Yeterlik ve Hedef Sürdürme Sinerjisi',
    requiredFacetIds: ['generalized_self_efficacy', 'long_term_grit', 'diligence'],
    scientificRationaleTr: 'Yüksek öz-yeterlik inancı ile uzun vadeli azim ve çalışkanlık zorluklar karşısında dayanıklılığı güçlendirir (Bandura, 1997; Duckworth, 2007).',
    descriptionTr: 'Kendi yetkinliğine duyulan güven ile uzun vadeli hedeflere bağlılık birbirini destekleyerek engeller karşısında eylemi sürdürmeyi kolaylaştırmaktadır.',
    reflectionPromptTr: 'Zorlu ve belirsiz bir projede çalışırken kendinize duyduğunuz güven ve çalışma disiplininiz hedefe ulaşmanıza nasıl katkı sağlıyor?',
    epistemicStatus: 'EVIDENCE_SUPPORTED_SYNERGY',
    confidence: 'HIGH',
    evaluate: (scores) => {
      const gse = scores.get('generalized_self_efficacy') ?? 0;
      const grit = scores.get('long_term_grit') ?? 0;
      const dil = scores.get('diligence') ?? 0;
      return gse >= 3.6 && grit >= 3.5 && dil >= 3.5;
    },
  },
  {
    id: 'syn_empathy_perspective_taking',
    titleTr: 'Çok Boyutlu Empati ve Bakış Açısı Alma Sinerjisi',
    requiredFacetIds: ['cognitive_perspective_taking', 'empathic_concern', 'social_connectedness'],
    scientificRationaleTr: 'Bilişsel zihinselleştirme (perspective taking) ile duygusal duyarlık (empathic concern) sağlıklı sosyal bağları pekiştirir (Davis, 1983).',
    descriptionTr: 'Başkalarının bakış açısını anlama yetisi ile samimi şefkat duygusu birleşerek kişilerarası ilişkilerde derin ve yapıcı bir anlayış oluşturmaktadır.',
    reflectionPromptTr: 'Farklı görüşteki insanlarla iletişim kurarken hem mantıksal hem duygusal düzeyde nasıl bir denge kuruyorsunuz?',
    epistemicStatus: 'EVIDENCE_SUPPORTED_SYNERGY',
    confidence: 'HIGH',
    evaluate: (scores) => {
      const cpt = scores.get('cognitive_perspective_taking') ?? 0;
      const ec = scores.get('empathic_concern') ?? 0;
      const sc = scores.get('social_connectedness') ?? 0;
      return cpt >= 3.6 && ec >= 3.6 && sc >= 3.5;
    },
  },
  {
    id: 'syn_curiosity_openness',
    titleTr: 'Bilişsel Merak ve Zihinsel Esneklik Sinerjisi',
    requiredFacetIds: ['joyous_exploration_curiosity', 'inquisitiveness', 'cognitive_flexibility'],
    scientificRationaleTr: 'Keşif merakı, entelektüel araştırmacılık ve bilişsel esneklik problem çözmede yaratıcı çözümleri zenginleştirir (Kashdan et al., 2018).',
    descriptionTr: 'Yeni bilgileri öğrenme tutkusu ile alternatif düşünme yollarına açık olma dinamikleri zihinsel esnekliği ve problem çözme kapasitesini artırmaktadır.',
    reflectionPromptTr: 'Yeni ve alışılmadık bir problemle karşılaştığınızda merak duygunuz çözüme ulaşmanızı nasıl şekillendiriyor?',
    epistemicStatus: 'EVIDENCE_SUPPORTED_SYNERGY',
    confidence: 'HIGH',
    evaluate: (scores) => {
      const jec = scores.get('joyous_exploration_curiosity') ?? 0;
      const inq = scores.get('inquisitiveness') ?? 0;
      const cf = scores.get('cognitive_flexibility') ?? 0;
      return jec >= 3.6 && inq >= 3.5 && cf >= 3.5;
    },
  },
  {
    id: 'syn_self_compassion_resilience',
    titleTr: 'Öz-Şefkat ve Psikolojik Sağlamlık Sinerjisi',
    requiredFacetIds: ['self_compassion', 'ego_resilience', 'stress_recovery'],
    scientificRationaleTr: 'Başarısızlık anlarında kendine şefkat gösterme, stres sonrası toparlanma süresini kısaltır ve ego sağlamlığını korur (Neff, 2003; Block, 1996).',
    descriptionTr: 'Hatalar karşısında kendini acımasızca eleştirmek yerine anlayış gösterme tutumu, stres sonrasında hızla toparlanmayı ve dengede kalmayı desteklemektedir.',
    reflectionPromptTr: 'Beklenmedik bir hayal kırıklığı yaşadığınızda kendinize gösterdiğiniz anlayış toparlanma sürecinizi nasıl etkiliyor?',
    epistemicStatus: 'EVIDENCE_SUPPORTED_SYNERGY',
    confidence: 'HIGH',
    evaluate: (scores) => {
      const sc = scores.get('self_compassion') ?? 0;
      const er = scores.get('ego_resilience') ?? 0;
      const sr = scores.get('stress_recovery') ?? 0;
      return sc >= 3.5 && er >= 3.5 && sr >= 3.5;
    },
  },
  {
    id: 'syn_reappraisal_distress_tolerance',
    titleTr: 'Bilişsel Yeniden Değerlendirme ve Sıkıntı Dayanıklılığı Sinerjisi',
    requiredFacetIds: ['cognitive_reappraisal', 'distress_tolerance'],
    scientificRationaleTr: 'Olayları farklı açılardan anlamlandırabilme ile rahatsız edici duygulara katlanabilme kapasitesi duygusal regülasyonu kolaylaştırır (Gross, 2002; Simons & Gaher, 2005).',
    descriptionTr: 'Zorlu durumların anlamını yapıcı bir perspektifle yeniden kurma ile olumsuz duygulara tahammül edebilme kapasitesi güçlü bir duygusal denge sağlamaktadır.',
    reflectionPromptTr: 'Yoğun baskı altında kaldığınızda olaylara farklı bir çerçeveden bakmak duygusal yükünüzü hafifletmeye nasıl yardımcı oluyor?',
    epistemicStatus: 'EVIDENCE_SUPPORTED_SYNERGY',
    confidence: 'HIGH',
    evaluate: (scores) => {
      const cr = scores.get('cognitive_reappraisal') ?? 0;
      const dt = scores.get('distress_tolerance') ?? 0;
      return cr >= 3.6 && dt >= 3.6;
    },
  },
  {
    id: 'syn_integrity_fairness_modesty',
    titleTr: 'Ahlaki Bütünlük ve Alçakgönüllülük Sinerjisi',
    requiredFacetIds: ['fairness', 'sincerity', 'modesty', 'greed_avoidance'],
    scientificRationaleTr: 'HEXACO Dürüstlük-Alçakgönüllülük faktörünün dört alt boyutu yüksek tutarlılıkla etik ilişkisel güveni pekiştirir (Ashton & Lee, 2007).',
    descriptionTr: 'Adalet, içtenlik, mütevazılık ve aşırı gösterişten kaçınma özellikleri bir araya gelerek güçlü bir kişilerarası güvenilirlik zemini oluşturmaktadır.',
    reflectionPromptTr: 'Çıkar çatışması yaşanan ortamlarda adalet ve samimiyet ilkeleriniz kararlarınıza nasıl rehberlik ediyor?',
    epistemicStatus: 'EVIDENCE_SUPPORTED_SYNERGY',
    confidence: 'HIGH',
    evaluate: (scores) => {
      const fair = scores.get('fairness') ?? 0;
      const sinc = scores.get('sincerity') ?? 0;
      const mod = scores.get('modesty') ?? 0;
      const greed = scores.get('greed_avoidance') ?? 0;
      return fair >= 3.6 && sinc >= 3.6 && mod >= 3.5 && greed >= 3.5;
    },
  },
  {
    id: 'syn_vitality_flourishing',
    titleTr: 'Öznel Canlılık ve Psikolojik Gelişme Sinerjisi',
    requiredFacetIds: ['subjective_vitality', 'flourishing_scale', 'satisfaction_with_life'],
    scientificRationaleTr: 'İçsel enerji ve canlılık hissi ile psikolojik gelişme ve yaşam doyumu genel esenliği artırır (Ryan & Frederick, 1997; Diener et al., 2010).',
    descriptionTr: 'Güne enerjik başlama hissi, yaşamda anlamlı bir gelişim algısı ve genel yaşam memnuniyeti birbirini besleyen pozitif bir iyi oluş döngüsü yaratmaktadır.',
    reflectionPromptTr: 'Günlük enerjinizi ve yaşam doyumunuzu en çok hangi aktivitelerin ve hedeflerin beslediğini gözlemliyorsunuz?',
    epistemicStatus: 'EVIDENCE_SUPPORTED_SYNERGY',
    confidence: 'HIGH',
    evaluate: (scores) => {
      const vit = scores.get('subjective_vitality') ?? 0;
      const flr = scores.get('flourishing_scale') ?? 0;
      const swl = scores.get('satisfaction_with_life') ?? 0;
      return vit >= 3.6 && flr >= 3.6 && swl >= 3.5;
    },
  },
  {
    id: 'syn_growth_mindset_competence',
    titleTr: 'Gelişim Zihniyeti ve Yetkinlik İnancı Sinerjisi',
    requiredFacetIds: ['growth_mindset_intelligence', 'competence_need_satisfaction', 'creative_self_efficacy'],
    scientificRationaleTr: 'Yeteneklerin geliştirilebilir olduğuna inanma ile işlerinde ustalaşma hissi öğrenme motivasyonunu pekiştirir (Dweck, 2006; Ryan & Deci, 2000).',
    descriptionTr: 'Çabanın zekayı ve becerileri dönüştüreceğine olan inanç ile eylemlerde yetkin hissetme duygusu sürekli kendini geliştirme motivasyonunu canlı tutmaktadır.',
    reflectionPromptTr: 'Becerilerinizi aşan yeni bir göreve başladığınızda gelişim inancınız kaygıyı öğrenme isteğine nasıl dönüştürüyor?',
    epistemicStatus: 'EVIDENCE_SUPPORTED_SYNERGY',
    confidence: 'HIGH',
    evaluate: (scores) => {
      const gmi = scores.get('growth_mindset_intelligence') ?? 0;
      const com = scores.get('competence_need_satisfaction') ?? 0;
      const cse = scores.get('creative_self_efficacy') ?? 0;
      return gmi >= 3.6 && com >= 3.6 && cse >= 3.5;
    },
  },
];

export const SYNERGY_RULES = DETERMINISTIC_SYNERGY_RULES;

export function generateDeterministicSynergies(facetScoresMap: Map<string, number>): ProfilePatternItemV2[] {
  const synergies: ProfilePatternItemV2[] = [];

  for (const rule of DETERMINISTIC_SYNERGY_RULES) {
    const hasAllFacets = rule.requiredFacetIds.every((fId) => facetScoresMap.has(fId));
    if (!hasAllFacets) continue;

    if (rule.evaluate(facetScoresMap)) {
      const sourceFacetNamesTr = rule.requiredFacetIds.map(
        (fId) => MASTER_FACET_BY_ID.get(fId)?.nameTr || fId
      );

      synergies.push({
        id: rule.id,
        titleTr: rule.titleTr,
        type: 'SYNERGY',
        descriptionTr: rule.descriptionTr,
        scientificRationaleTr: rule.scientificRationaleTr,
        sourceFacetIds: rule.requiredFacetIds,
        sourceFacetNamesTr,
        epistemicStatus: rule.epistemicStatus,
        confidence: rule.confidence,
        reflectionPromptTr: rule.reflectionPromptTr,
      });
    }
  }

  return synergies;
}

export function evaluateProfileSynergies(
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
  return generateDeterministicSynergies(scoresMap);
}
