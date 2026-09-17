/**
 * PsycheAI Deterministic Cross-Domain Pattern Engine
 *
 * Enforces strict scientific principles:
 * - Deterministic, rule-based pattern identification (zero AI inference).
 * - Strictly evaluates measured facet evidence (fails safely if unmeasured).
 * - Avoids causal claims ("causes"), diagnoses, and value judgements.
 * - Refers to dynamics as "eş-oluşum" (co-occurrence) or "profil örüntüsü" (pattern), never cross-sectional correlation.
 */

import { ProfilePatternItemV2 } from '@/types/unifiedProfileV2';
import { MASTER_FACET_BY_ID } from './masterModelConstants';

export interface DeterministicPatternRule {
  id: string;
  titleTr: string;
  requiredFacetIds: string[];
  scientificRationaleTr: string;
  descriptionTr: string;
  epistemicStatus: string;
  confidence: 'HIGH' | 'MODERATE' | 'LOW';
  evaluate: (facetScores: Map<string, number>) => boolean;
}

export const DETERMINISTIC_PATTERN_RULES: DeterministicPatternRule[] = [
  {
    id: 'pat_analytical_epistemic_style',
    titleTr: 'Analitik Biliş ve Entelektüel Merak Örüntüsü',
    requiredFacetIds: ['need_for_cognition', 'rational_analytical_thinking', 'inquisitiveness'],
    scientificRationaleTr: 'Yüksek biliş ihtiyacı, rasyonel düşünme ve entelektüel araştırmacılık sistematik bilgi işleme yönelimini gösterir.',
    descriptionTr: 'Karmaşık konuları derinlemesine araştırma, mantıksal argümanlar geliştirme ve bilgiye dayalı karar verme eğilimi birlikte görülmektedir.',
    epistemicStatus: 'EVIDENCE_SUPPORTED_PATTERN',
    confidence: 'HIGH',
    evaluate: (scores) => {
      const nfc = scores.get('need_for_cognition') ?? 0;
      const rat = scores.get('rational_analytical_thinking') ?? 0;
      const inq = scores.get('inquisitiveness') ?? 0;
      return nfc >= 3.6 && rat >= 3.6 && inq >= 3.5;
    },
  },
  {
    id: 'pat_autonomous_self_direction',
    titleTr: 'Özerk Benlik ve Değişime Açıklık Örüntüsü',
    requiredFacetIds: ['autonomy_need_satisfaction', 'schwartz_openness_to_change', 'authenticity'],
    scientificRationaleTr: 'Özerklik ihtiyacı doyumu, Schwartz değişime açıklık değerleri ve otantik yaşam yönelimi bağımsız karar alma dinamiklerini destekler.',
    descriptionTr: 'Kendi değerleriyle uyumlu hareket etme, dışsal baskılardan bağımsız seçimler yapma ve yenilikçi deneyimlere açık olma örüntüsü gözlemlenmektedir.',
    epistemicStatus: 'EVIDENCE_SUPPORTED_PATTERN',
    confidence: 'HIGH',
    evaluate: (scores) => {
      const aut = scores.get('autonomy_need_satisfaction') ?? 0;
      const soc = scores.get('schwartz_openness_to_change') ?? 0;
      const ath = scores.get('authenticity') ?? 0;
      return aut >= 3.6 && soc >= 3.6 && ath >= 3.5;
    },
  },
  {
    id: 'pat_prudent_self_regulation',
    titleTr: 'İhtiyatlı Öz-Düzenleme ve Planlama Örüntüsü',
    requiredFacetIds: ['prudence', 'general_self_control', 'uppsp_lack_of_premeditation'],
    scientificRationaleTr: 'Yüksek ihtiyatlılık ve öz-kontrol ile düşük plansızlık (ters skorlama), eylemlerin sonuçlarını önceden değerlendirme kapasitesini temsil eder.',
    descriptionTr: 'Dürtüsel tepkilerden kaçınarak adımlarını önceden planlama, riskleri tartma ve uzun vadeli hedeflere bağlı kalma eğilimi bir arada yer almaktadır.',
    epistemicStatus: 'EVIDENCE_SUPPORTED_PATTERN',
    confidence: 'HIGH',
    evaluate: (scores) => {
      const pru = scores.get('prudence') ?? 0;
      const gsc = scores.get('general_self_control') ?? 0;
      const lop = scores.get('uppsp_lack_of_premeditation') ?? 0;
      return pru >= 3.6 && gsc >= 3.6 && lop <= 2.8;
    },
  },
  {
    id: 'pat_cooperative_relational_style',
    titleTr: 'İşbirlikçi ve Hoşgörülü Kişilerarası Yaklaşım',
    requiredFacetIds: ['forgivingness', 'gentleness', 'cooperation_orientation'],
    scientificRationaleTr: 'Bağışlayıcılık, nezaket ve işbirliği yönelimi yapıcı çatışma çözümü ve sosyal uyumu yansıtır.',
    descriptionTr: 'İlişkilerde kin tutmama, eleştirilerde yapıcı olma ve anlaşmazlıklarda ortak kazan-kazan çözümleri arama yönelimi birlikte belirginleşmektedir.',
    epistemicStatus: 'EVIDENCE_SUPPORTED_PATTERN',
    confidence: 'HIGH',
    evaluate: (scores) => {
      const forg = scores.get('forgivingness') ?? 0;
      const gent = scores.get('gentleness') ?? 0;
      const coop = scores.get('cooperation_orientation') ?? 0;
      return forg >= 3.5 && gent >= 3.5 && coop >= 3.6;
    },
  },
  {
    id: 'pat_reflective_meaning_orientation',
    titleTr: 'Varoluşsal Anlam ve İçsel Bütünlük Arayışı',
    requiredFacetIds: ['presence_of_meaning', 'self_concept_clarity'],
    scientificRationaleTr: 'Yaşamda anlam varlığı ile benlik algısının netliği içsel uyumu ve amaç duygusunu destekler.',
    descriptionTr: 'Yaşamın bir amaca sahip olduğu algısı ile kim olduğuna dair net bir içsel kavrayış aynı profilde birlikte yer almaktadır.',
    epistemicStatus: 'EVIDENCE_SUPPORTED_PATTERN',
    confidence: 'MODERATE',
    evaluate: (scores) => {
      const pom = scores.get('presence_of_meaning') ?? 0;
      const scc = scores.get('self_concept_clarity') ?? 0;
      return pom >= 3.6 && scc >= 3.6;
    },
  },
  {
    id: 'pat_creative_exploration_mindset',
    titleTr: 'Yaratıcı Keşif ve Gelişim Zihniyeti',
    requiredFacetIds: ['joyous_exploration_curiosity', 'creative_self_efficacy', 'growth_mindset_intelligence'],
    scientificRationaleTr: 'Keşif merakı, yaratıcı öz-inanç ve gelişim zihniyeti entelektüel yenilikçiliği destekler.',
    descriptionTr: 'Yeni alanları öğrenme heyecanı, yaratıcı problem çözme inancı ve yeteneklerin çabayla gelişebileceğine olan temel inanç bir arada gözlenmektedir.',
    epistemicStatus: 'EVIDENCE_SUPPORTED_PATTERN',
    confidence: 'HIGH',
    evaluate: (scores) => {
      const jec = scores.get('joyous_exploration_curiosity') ?? 0;
      const cse = scores.get('creative_self_efficacy') ?? 0;
      const gmi = scores.get('growth_mindset_intelligence') ?? 0;
      return jec >= 3.6 && cse >= 3.5 && gmi >= 3.6;
    },
  },
  {
    id: 'pat_sober_emotional_stability',
    titleTr: 'Soğukkanlılık ve Düşük Tepkisellik Dengesi',
    requiredFacetIds: ['anxiety', 'fearfulness', 'distress_tolerance'],
    scientificRationaleTr: 'Düşük kaygı ve tehlike duyarlılığı ile yüksek sıkıntı toleransı duygusal sağlamlık profilini oluşturur.',
    descriptionTr: 'Baskı ve belirsizlik altında paniğe kapılmama, olumsuz duyguları tolere edebilme ve sakinliğini koruma eğilimi sergilenmektedir.',
    epistemicStatus: 'EVIDENCE_SUPPORTED_PATTERN',
    confidence: 'HIGH',
    evaluate: (scores) => {
      const anx = scores.get('anxiety') ?? 0;
      const fear = scores.get('fearfulness') ?? 0;
      const dt = scores.get('distress_tolerance') ?? 0;
      return anx <= 2.6 && fear <= 2.6 && dt >= 3.6;
    },
  },
  {
    id: 'pat_ethical_transcendence_core',
    titleTr: 'Etik Dürüstlük ve Öz-Aşkınlık Yönelimi',
    requiredFacetIds: ['fairness', 'sincerity', 'schwartz_self_transcendence'],
    scientificRationaleTr: 'HEXACO Adillik/İçtenlik boyutları ile Schwartz evrenselcilik/yardımseverlik değerlerinin birlikteliği.',
    descriptionTr: 'Kişilerarası ilişkilerde dürüstlük ve adalet ilkelerine bağlılık ile başkalarının ve toplumun esenliğini gözetme değeri birlikte görülmektedir.',
    epistemicStatus: 'EVIDENCE_SUPPORTED_PATTERN',
    confidence: 'HIGH',
    evaluate: (scores) => {
      const fair = scores.get('fairness') ?? 0;
      const sinc = scores.get('sincerity') ?? 0;
      const sst = scores.get('schwartz_self_transcendence') ?? 0;
      return fair >= 3.6 && sinc >= 3.6 && sst >= 3.6;
    },
  },
];

export const EVALUATED_PATTERNS = DETERMINISTIC_PATTERN_RULES;

export function generateDeterministicPatterns(facetScoresMap: Map<string, number>): ProfilePatternItemV2[] {
  const patterns: ProfilePatternItemV2[] = [];

  for (const rule of DETERMINISTIC_PATTERN_RULES) {
    // Verify ALL required facets are measured
    const hasAllFacets = rule.requiredFacetIds.every((fId) => facetScoresMap.has(fId));
    if (!hasAllFacets) continue;

    if (rule.evaluate(facetScoresMap)) {
      const sourceFacetNamesTr = rule.requiredFacetIds.map(
        (fId) => MASTER_FACET_BY_ID.get(fId)?.nameTr || fId
      );

      patterns.push({
        id: rule.id,
        titleTr: rule.titleTr,
        type: 'CROSS_DOMAIN_PATTERN',
        descriptionTr: rule.descriptionTr,
        scientificRationaleTr: rule.scientificRationaleTr,
        sourceFacetIds: rule.requiredFacetIds,
        sourceFacetNamesTr,
        epistemicStatus: rule.epistemicStatus,
        confidence: rule.confidence,
      });
    }
  }

  return patterns;
}

export function evaluateCrossDomainPatterns(
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
  return generateDeterministicPatterns(scoresMap);
}
