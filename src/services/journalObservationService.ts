/**
 * FAZ 2.21 Scientific Hardening: Journal Observation & Semantic Pattern Service
 * Separates Context Frequency (life domain recurrence) from Semantic Psychological Themes.
 * Enforces:
 * - >= 3 semantically related entries AND >= 2 distinct calendar dates for Repeated Themes.
 * - Directional observational signals for Profile Alignment and Contextual Variation.
 * - Strict non-diagnostic, non-psychometric boundaries (USER_REPORTED_CONTEXT, OBSERVATIONAL_DATA).
 */

import {
  JournalEntryV1,
  JournalObservationSummaryV1,
  ContextFrequencyV1,
  RepeatedThemeV1,
  MultiContextThemeV1,
  JournalObservationBundleV1,
  JournalContextTag,
  VALID_JOURNAL_CONTEXT_TAGS,
  JournalRelationshipType,
  JournalProfileRelationshipV1,
  ObservationalTopicKey,
  ThemeExtractionMethod,
  RepeatedThemeStatus,
  GrowthCandidateAreaV1,
  JournalEntryType,
} from '@/types/journal';
import { UnifiedPsychologicalProfileV2, FacetProfileV2 } from '@/types/unifiedProfileV2';
import { MASTER_FACETS, MASTER_DOMAINS, MASTER_CONSTRUCTS } from '@/lib/profile/masterModelConstants';
import { getJournalEntries } from './journalService';
import { getCurrentUnifiedProfile } from './unifiedProfileService';

/**
 * Common emotion dictionary for descriptive self-expression extraction
 * Strictly non-diagnostic (USER_EXPRESSED_EMOTION).
 * Everyday language expressions (e.g. 'panik', 'tükenmişlik') are NEVER translated into clinical diagnoses.
 */
const EMOTION_LEXICON: Record<string, string[]> = {
  öfke: ['öfke', 'kızgın', 'sinirli', 'öfkelendim', 'çıldırdım'],
  kaygı: ['kaygı', 'endişe', 'tedirgin', 'korku', 'endişeliyim'],
  üzüntü: ['üzüntü', 'üzgün', 'kırgın', 'mutsuz', 'hüzün', 'moralim bozuk'],
  rahatlama: ['rahatlama', 'hafifleme', 'ferahlama', 'huzurlu', 'dingin'],
  heyecan: ['heyecan', 'coşku', 'istekli', 'hevesli', 'motive'],
  hayal_kırıklığı: ['hayal kırıklığı', 'beklenti', 'boşa gitti', 'yenilgi'],
  yorgunluk: ['tükenmişlik', 'yorgunluk', 'bitkin', 'yorgunum', 'aşırı yorgun'],
};

/**
 * Potentially relevant Master Model measurement areas per context
 * INVARIANT: Context alone only scopes POTENTIALLY relevant facets for inquiry.
 * It NEVER automatically constitutes evidence about that facet.
 */
export const POTENTIALLY_RELEVANT_FACET_MAP: Record<JournalContextTag, string[]> = {
  WORK: [
    'diligence',
    'perfectionism',
    'organization',
    'liveliness',
    'social_boldness',
    'long_term_grit',
    'general_self_control',
    'competence_need_satisfaction',
    'anxiety',
    'stress_recovery',
  ],
  RELATIONSHIPS: [
    'forgivingness',
    'gentleness',
    'flexibility',
    'patience',
    'empathic_concern',
    'cognitive_perspective_taking',
    'attachment_anxiety',
    'attachment_avoidance',
    'relatedness_need_satisfaction',
  ],
  FAMILY: [
    'forgivingness',
    'sentimentality',
    'attachment_anxiety',
    'attachment_avoidance',
    'relatedness_need_satisfaction',
  ],
  DECISION_MAKING: [
    'prudence',
    'rational_analytical_thinking',
    'intuitive_experiential_thinking',
    'intolerance_of_uncertainty',
    'need_for_cognitive_closure',
    'decision_style_maximizing',
  ],
  STRESS: [
    'fearfulness',
    'anxiety',
    'dependence',
    'distress_tolerance',
    'stress_recovery',
    'ego_resilience',
    'negative_affect_trait',
  ],
  SOCIAL: [
    'social_self_esteem',
    'social_boldness',
    'sociability',
    'liveliness',
    'social_connectedness',
    'assertiveness',
  ],
  SELF_IMAGE: [
    'core_self_esteem',
    'generalized_self_efficacy',
    'authenticity',
    'self_compassion',
    'self_concept_clarity',
  ],
  GOALS: [
    'long_term_grit',
    'diligence',
    'presence_of_meaning',
    'search_for_meaning',
    'competence_need_satisfaction',
  ],
  HEALTH: [
    'subjective_vitality',
    'stress_recovery',
    'flourishing_scale',
  ],
  LIFE_EVENT: [
    'ego_resilience',
    'stress_recovery',
    'cognitive_flexibility',
    'presence_of_meaning',
  ],
  GENERAL: [
    'inquisitiveness',
    'authenticity',
    'growth_mindset_intelligence',
  ],
};

// Backward-compatibility alias
export const CONTEXT_FACET_MAP = POTENTIALLY_RELEVANT_FACET_MAP;

/**
 * Controlled Observational Topic Definition Interface
 */
export interface ObservationalTopicDefinition {
  key: ObservationalTopicKey;
  labelTr: string;
  keywords: string[];
  entryTypes?: JournalEntryType[];
  relevantFacetIds: string[];
  descriptionTemplateTr: (count: number, datesCount: number, contexts: string[]) => string;
}

/**
 * Authoritative Observational Topic Registry (17 Controlled Topics)
 * Strictly descriptive observational categories; NOT facets, constructs, or diagnoses.
 */
export const OBSERVATIONAL_TOPIC_REGISTRY: ObservationalTopicDefinition[] = [
  {
    key: 'SOCIAL_EXPRESSION',
    labelTr: 'Toplantılarda ve Sosyal Ortamlarda Kendini İfade Etme',
    keywords: [
      'fikrimi söyle',
      'fikirlerimi ifade',
      'çekindim',
      'çekingen',
      'konuşmak iste',
      'konuşamadım',
      'paylaşmadan önce',
      'söz almak',
      'toplantıda çekin',
      'fikrimi belirt',
      'sesimi çıkar',
      'kendimi ifade',
      'topluluk önünde',
      'toplantıda konuş',
      'sunum yaparken çekin',
      'fikrimi aç',
    ],
    relevantFacetIds: ['social_boldness', 'social_self_esteem', 'assertiveness'],
    descriptionTemplateTr: (count, datesCount, contexts) =>
      `Farklı ${datesCount} günde kaydedilen ${count} yansımada, ${contexts.join(', ')} ortamında fikir beyan etme ve kendini ifade etme deneyimi tekrar eden bir gözlem olarak kaydedildi.`,
  },
  {
    key: 'WORK_STRESS',
    labelTr: 'İş ve Çalışma Ortamında Yüksek Baskı ve Stres',
    keywords: [
      'iş stresi',
      'yoğun iş temposu',
      'iş yetiştirme',
      'iş baskısı',
      'iş yerinde bunal',
      'mesai',
      'deadline',
      'yetişmeyecek',
      'iş yerinde stres',
      'iş yükü',
      'iş stresi çok',
      'aşırı iş yükü',
      'yetiştiremedim',
    ],
    entryTypes: ['STRESS', 'CHALLENGE'],
    relevantFacetIds: ['stress_recovery', 'anxiety', 'distress_tolerance', 'ego_resilience'],
    descriptionTemplateTr: (count, datesCount, contexts) =>
      `Farklı ${datesCount} günde kaydedilen ${count} yansımada iş süreçlerindeki yüksek tempo ve stres deneyimi öne çıktı.`,
  },
  {
    key: 'DECISION_DIFFICULTY',
    labelTr: 'Karar Alma ve Seçim Süreçlerinde Tereddüt',
    keywords: [
      'karar verem',
      'kararsız',
      'seçim yapmak',
      'arada kaldım',
      'netleştiremedim',
      'tereddüt',
      'ikilem',
      'karar anı',
      'karar vermekte zorlan',
      'seçim yapmakta',
    ],
    entryTypes: ['DECISION'],
    relevantFacetIds: ['rational_analytical_thinking', 'need_for_cognitive_closure', 'decision_style_maximizing', 'prudence'],
    descriptionTemplateTr: (count, datesCount, contexts) =>
      `Farklı ${datesCount} günde kaydedilen ${count} yansımada karar verme aşamalarındaki ikilem ve değerlendirme süreçleri paylaşıldı.`,
  },
  {
    key: 'UNCERTAINTY',
    labelTr: 'Belirsizlik ve Öngörülemeyen Durumlar Karşısında Temkinlilik',
    keywords: [
      'belirsizlik',
      'öngöremiyorum',
      'belirsiz',
      'net değil',
      'kontrol edem',
      'ne olacağı belli değil',
      'gelecek kaygısı',
      'belirsiz durum',
      'bilinmezlik',
    ],
    relevantFacetIds: ['intolerance_of_uncertainty', 'cognitive_flexibility', 'fearfulness'],
    descriptionTemplateTr: (count, datesCount, contexts) =>
      `Farklı ${datesCount} günde kaydedilen ${count} yansımada belirsizlik içeren süreçlere dair gözlemler tekrar etti.`,
  },
  {
    key: 'CONFLICT_AVOIDANCE',
    labelTr: 'İletişimde Uyuşmazlık ve Çatışmadan Kaçınma',
    keywords: [
      'çatışmadan kaç',
      'tartışmak isteme',
      'tartışmaya girme',
      'uyumsuz görünme',
      'kavga etme',
      'huzursuzluk çıkmasın',
      'alttan aldım',
      'itiraz etmedim',
      'karşı çıkmadım',
      'sesimi çıkarmadım',
    ],
    relevantFacetIds: ['conflict_avoidance', 'cooperation_orientation', 'forgivingness', 'gentleness'],
    descriptionTemplateTr: (count, datesCount, contexts) =>
      `Farklı ${datesCount} günde kaydedilen ${count} yansımada ilişkisel uyuşmazlıklardan ve çatışmalardan kaçınma eğilimi gözlendi.`,
  },
  {
    key: 'RELATIONSHIP_DISTANCE',
    labelTr: 'İlişkilerde Mesafe ve İçe Çekilme',
    keywords: [
      'mesafe koydum',
      'uzaklaştım',
      'soğukluk',
      'iletişimi kestim',
      'bağlantıyı kopardım',
      'yalnız kalmak iste',
      'kendimi geri çektim',
      'mesafeli dur',
      'içe kapandım',
    ],
    relevantFacetIds: ['attachment_avoidance', 'social_connectedness'],
    descriptionTemplateTr: (count, datesCount, contexts) =>
      `Farklı ${datesCount} günde kaydedilen ${count} yansımada sosyal/ilişkisel mesafelenme ve geri çekilme teması gözlendi.`,
  },
  {
    key: 'RELATIONSHIP_CLOSENESS',
    labelTr: 'İlişkisel Bağ Kurma ve Destek Paylaşımı',
    keywords: [
      'yakın hisset',
      'bağ kurdum',
      'samimiyet',
      'destek aldım',
      'paylaşımda bulun',
      'içten sohbet',
      'derin bağ',
      'yakınlık kur',
      'birlikte vakit',
      'omuz omuza',
    ],
    relevantFacetIds: ['relatedness_need_satisfaction', 'empathic_concern', 'social_connectedness'],
    descriptionTemplateTr: (count, datesCount, contexts) =>
      `Farklı ${datesCount} günde kaydedilen ${count} yansımada yakın ilişkiler ve dayanışma deneyimleri paylaşıldı.`,
  },
  {
    key: 'SELF_CRITICISM',
    labelTr: 'Kendine Yönelik Eleştirel Tutum ve Öz-Yargılama',
    keywords: [
      'kendime kızdım',
      'yetersiz hisset',
      'hata yaptım',
      'kendimi suçla',
      'suçluluk',
      'daha iyi olmalıydım',
      'öz eleştiri',
      'kendimi yargıla',
      'beceremedim',
    ],
    relevantFacetIds: ['self_compassion', 'core_self_esteem', 'contingent_self_worth', 'guilt_proneness'],
    descriptionTemplateTr: (count, datesCount, contexts) =>
      `Farklı ${datesCount} günde kaydedilen ${count} yansımada öz-eleştirel düşünce kalıpları ve yüksek beklentiler öne çıktı.`,
  },
  {
    key: 'GOAL_PERSISTENCE',
    labelTr: 'Hedefe Yönelik Kararlılık, Azim ve İlerleme',
    keywords: [
      'vazgeçmedim',
      'ısrarla devam',
      'hedefe odaklan',
      'disiplinle çalış',
      'azim',
      'kararlılıkla',
      'planıma sadık',
      'pes etme',
      'hedefime doğru',
      'istikrar',
    ],
    entryTypes: ['GOAL', 'SUCCESS'],
    relevantFacetIds: ['long_term_grit', 'diligence', 'general_self_control', 'competence_need_satisfaction'],
    descriptionTemplateTr: (count, datesCount, contexts) =>
      `Farklı ${datesCount} günde kaydedilen ${count} yansımada hedeflere bağlılık ve uzun vadeli azim vurgulandı.`,
  },
  {
    key: 'PROCRASTINATION',
    labelTr: 'Görev ve Sorumlulukları Erteleme Eğilimi',
    keywords: [
      'erteledim',
      'öteledim',
      'son dakikaya bırak',
      'oyalandım',
      'başlayamadım',
      'erteleyip dur',
      'kaçındım çalışmaktan',
    ],
    relevantFacetIds: ['procrastination_tendency', 'general_self_control', 'diligence'],
    descriptionTemplateTr: (count, datesCount, contexts) =>
      `Farklı ${datesCount} günde kaydedilen ${count} yansımada işleri başlatma ve erteleme süreçleri gözlendi.`,
  },
  {
    key: 'EMOTIONAL_SUPPRESSION',
    labelTr: 'Duyguları Belli Etmeme ve İçe Atma',
    keywords: [
      'içime attım',
      'belli etmedim',
      'gizledim',
      'duygularımı sakla',
      'yansıtmamaya çalış',
      'maske tak',
      'yutkundum',
      'içimde tuttum',
    ],
    relevantFacetIds: ['expressive_suppression', 'affect_intensity'],
    descriptionTemplateTr: (count, datesCount, contexts) =>
      `Farklı ${datesCount} günde kaydedilen ${count} yansımada duygusal tepkileri bastırma veya gizleme teması kaydedildi.`,
  },
  {
    key: 'EMOTIONAL_REAPPRAISAL',
    labelTr: 'Duygusal Durumları Bilişsel Olarak Yeniden Anlamlandırma',
    keywords: [
      'farklı açıdan bak',
      'olumlu tarafından',
      'anlamlandırmaya çalış',
      'sakinleşip düşün',
      'yeniden değerlendir',
      'bakış açımı değiş',
      'ders çıkardım',
    ],
    relevantFacetIds: ['cognitive_reappraisal', 'cognitive_flexibility', 'stress_recovery'],
    descriptionTemplateTr: (count, datesCount, contexts) =>
      `Farklı ${datesCount} günde kaydedilen ${count} yansımada olayları yapıcı bir çerçevede yeniden değerlendirme eğilimi görüldü.`,
  },
  {
    key: 'BOUNDARY_SETTING',
    labelTr: 'Kişisel Sınır Çizme ve Koruma',
    keywords: [
      'hayır dedim',
      'hayır diyebil',
      'sınır koydum',
      'sınırlarımı koru',
      'kabul etmedim',
      'kendi alanımı',
      'taviz vermedim',
      'sınırlarımı net',
    ],
    relevantFacetIds: ['assertiveness', 'autonomy_need_satisfaction'],
    descriptionTemplateTr: (count, datesCount, contexts) =>
      `Farklı ${datesCount} günde kaydedilen ${count} yansımada kişisel sınırları belirleme ve koruma çabası öne çıktı.`,
  },
  {
    key: 'NEED_FOR_APPROVAL',
    labelTr: 'Başkalarının Onay ve Takdirine İhtiyaç Duyma',
    keywords: [
      'onay bekledim',
      'onaylanma',
      'ne düşünürler',
      'beğenilme',
      'başkalarının görüşü',
      'takdir edilmek',
      'kabul görmek iste',
      'eleştirilmekten kork',
    ],
    relevantFacetIds: ['rejection_sensitivity_nonclinical', 'contingent_self_worth'],
    descriptionTemplateTr: (count, datesCount, contexts) =>
      `Farklı ${datesCount} günde kaydedilen ${count} yansımada dışsal onay ve beğeni arayışı teması gözlendi.`,
  },
  {
    key: 'PERCEIVED_COMPETENCE',
    labelTr: 'Yetkinlik, Başarı ve Öz-Güven Hissi',
    keywords: [
      'başardım',
      'üstesinden geldim',
      'iyi yaptım',
      'yeterliyim',
      'becerdim',
      'güvenim yerine geldi',
      'yeteneklerime inan',
      'kendimle gurur',
      'başarıyla tamamla',
    ],
    entryTypes: ['SUCCESS'],
    relevantFacetIds: ['generalized_self_efficacy', 'competence_need_satisfaction'],
    descriptionTemplateTr: (count, datesCount, contexts) =>
      `Farklı ${datesCount} günde kaydedilen ${count} yansımada yetkinlik ve başarı deneyimleri paylaşıldı.`,
  },
  {
    key: 'MEANING_PURPOSE',
    labelTr: 'Yaşam Anlamı ve Kişisel Amaç Arayışı',
    keywords: [
      'yaşam amacı',
      'hayatın anlamı',
      'anlamlı hisset',
      'değerlerime uygun',
      'neden buradayım',
      'varoluşsal',
      'bana iyi gelen',
      'anlam arayışı',
      'hayattaki yolum',
    ],
    relevantFacetIds: ['presence_of_meaning', 'search_for_meaning'],
    descriptionTemplateTr: (count, datesCount, contexts) =>
      `Farklı ${datesCount} günde kaydedilen ${count} yansımada varoluşsal anlam ve amaç arayışı teması öne çıktı.`,
  },
];

/**
 * Detects observational topics for an individual journal entry
 * Non-diagnostic keyword & topic matching.
 */
export function detectTopicsForEntry(
  entry: JournalEntryV1
): { topicKey: ObservationalTopicKey; labelTr: string; method: ThemeExtractionMethod; matchedTerms: string[] }[] {
  const text = ((entry.title || '') + ' ' + (entry.body || '')).toLowerCase();
  const detected: { topicKey: ObservationalTopicKey; labelTr: string; method: ThemeExtractionMethod; matchedTerms: string[] }[] = [];

  // 1. Check userTags matching
  if (entry.userTags && entry.userTags.length > 0) {
    for (const tag of entry.userTags) {
      const normTag = tag.toLowerCase().trim();
      for (const def of OBSERVATIONAL_TOPIC_REGISTRY) {
        if (normTag.includes(def.key.toLowerCase()) || def.keywords.some((kw) => kw.includes(normTag) || normTag.includes(kw))) {
          if (!detected.some((d) => d.topicKey === def.key)) {
            detected.push({
              topicKey: def.key,
              labelTr: def.labelTr,
              method: 'USER_TAG_DERIVED',
              matchedTerms: [tag],
            });
          }
        }
      }
    }
  }

  // 2. Deterministic keyword matching
  for (const def of OBSERVATIONAL_TOPIC_REGISTRY) {
    const matched = def.keywords.filter((kw) => text.includes(kw));

    // Special condition for WORK_STRESS: WORK context + high stress rating (>=4) or entryType STRESS
    let matchesSpecialCondition = false;
    if (def.key === 'WORK_STRESS' && entry.contextTags.includes('WORK')) {
      if ((entry.stressSelfReport !== null && entry.stressSelfReport !== undefined && entry.stressSelfReport >= 4) || entry.entryType === 'STRESS') {
        matchesSpecialCondition = true;
      }
    }

    // Special condition for DECISION_DIFFICULTY: DECISION entryType + relevant text
    if (def.key === 'DECISION_DIFFICULTY' && (entry.entryType === 'DECISION' || entry.contextTags.includes('DECISION_MAKING'))) {
      if (text.includes('karar') || text.includes('seçim') || text.includes('tereddüt') || text.includes('zor')) {
        matchesSpecialCondition = true;
      }
    }

    if (matched.length > 0 || matchesSpecialCondition) {
      if (!detected.some((d) => d.topicKey === def.key)) {
        detected.push({
          topicKey: def.key,
          labelTr: def.labelTr,
          method: 'DETERMINISTIC_KEYWORD',
          matchedTerms: matched.length > 0 ? matched : [def.key],
        });
      }
    }
  }

  return detected;
}

/**
 * Computes pure context frequency distribution across life domains
 * INVARIANT: Independent of semantic themes.
 */
export function computeContextFrequencies(entries: JournalEntryV1[]): ContextFrequencyV1[] {
  const contextMap = new Map<JournalContextTag, { count: number; dates: Set<string> }>();
  for (const tag of VALID_JOURNAL_CONTEXT_TAGS) {
    contextMap.set(tag, { count: 0, dates: new Set() });
  }

  for (const entry of entries) {
    const dateStr = entry.createdAt.split('T')[0];
    for (const tag of entry.contextTags) {
      const data = contextMap.get(tag);
      if (data) {
        data.count++;
        data.dates.add(dateStr);
      }
    }
  }

  const total = Array.from(contextMap.values()).reduce((sum, item) => sum + item.count, 0);

  return Array.from(contextMap.entries())
    .filter(([_, data]) => data.count > 0)
    .map(([context, data]) => ({
      context,
      contextLabelTr: getContextLabelTr(context),
      entryCount: data.count,
      distinctDatesCount: data.dates.size,
      percentage: total > 0 ? Math.round((data.count / total) * 100) : 0,
    }))
    .sort((a, b) => b.entryCount - a.entryCount);
}

/**
 * Computes semantic repeated themes requiring content relationship
 * INVARIANT: >= 3 semantically related entries AND >= 2 distinct calendar dates.
 * Unrelated entries with same context tag DO NOT form a theme.
 */
export function computeRepeatedThemes(entries: JournalEntryV1[]): RepeatedThemeV1[] {
  const topicEntriesMap = new Map<
    ObservationalTopicKey,
    { entries: JournalEntryV1[]; methods: Set<ThemeExtractionMethod> }
  >();

  for (const entry of entries) {
    const detected = detectTopicsForEntry(entry);
    for (const d of detected) {
      if (!topicEntriesMap.has(d.topicKey)) {
        topicEntriesMap.set(d.topicKey, { entries: [], methods: new Set() });
      }
      const item = topicEntriesMap.get(d.topicKey)!;
      if (!item.entries.some((e) => e.id === entry.id)) {
        item.entries.push(entry);
      }
      item.methods.add(d.method);
    }
  }

  const repeated: RepeatedThemeV1[] = [];

  for (const [topicKey, data] of Array.from(topicEntriesMap.entries())) {
    const matchingEntries = data.entries;
    // Hard Invariant: >= 3 entries AND >= 2 distinct dates
    if (matchingEntries.length < 3) continue;

    const distinctDates = new Set(matchingEntries.map((e) => e.createdAt.split('T')[0]));
    if (distinctDates.size < 2) continue;

    const topicDef = OBSERVATIONAL_TOPIC_REGISTRY.find((d) => d.key === topicKey);
    const labelTr = topicDef?.labelTr || topicKey;
    const allContexts = new Set<JournalContextTag>();
    matchingEntries.forEach((e) => e.contextTags.forEach((t) => allContexts.add(t)));
    const contextsList = Array.from(allContexts);

    const sortedDates = matchingEntries.map((e) => e.createdAt).sort();
    const isMultiContext = contextsList.length >= 2;
    const status: RepeatedThemeStatus = isMultiContext ? 'MULTI_CONTEXT_REPEATED_REPORT' : 'REPEATED_SELF_REPORT';

    let extractionMethod: ThemeExtractionMethod = 'DETERMINISTIC_KEYWORD';
    if (data.methods.has('USER_TAG_DERIVED')) extractionMethod = 'USER_TAG_DERIVED';
    else if (data.methods.has('DETERMINISTIC_TOPIC')) extractionMethod = 'DETERMINISTIC_TOPIC';

    const relatedFacets = topicDef?.relevantFacetIds || [];
    const summaryTr = topicDef
      ? topicDef.descriptionTemplateTr(matchingEntries.length, distinctDates.size, contextsList.map(getContextLabelTr))
      : `Farklı ${distinctDates.size} günde kaydedilen ${matchingEntries.length} yansımada ${labelTr} konusu tekrar eden bir gözlem olarak kaydedildi.`;

    repeated.push({
      themeId: `theme_${topicKey.toLowerCase()}_${matchingEntries.length}`,
      labelTr,
      normalizedThemeKey: topicKey,
      topicCategory: topicKey,
      evidenceEntryIds: matchingEntries.map((e) => e.id),
      entryCount: matchingEntries.length,
      distinctDatesCount: distinctDates.size,
      contexts: contextsList,
      status,
      extractionMethod,
      dateRange: { start: sortedDates[0], end: sortedDates[sortedDates.length - 1] },
      summaryTr,
      relatedFacetIds: relatedFacets,
      // Compatibility aliases
      themeKey: `theme_${topicKey.toLowerCase()}`,
      themeTitleTr: labelTr,
      context: contextsList[0] || 'GENERAL',
      sampleEntryIds: matchingEntries.slice(0, 5).map((e) => e.id),
    });
  }

  return repeated.sort((a, b) => b.entryCount - a.entryCount);
}

/**
 * Computes Multi-Context Themes
 * Invariant: >= 3 semantically related entries spanning >= 2 distinct contexts across >= 2 distinct dates.
 */
export function computeMultiContextThemes(repeatedThemes: RepeatedThemeV1[]): MultiContextThemeV1[] {
  return repeatedThemes
    .filter((t) => t.contexts.length >= 2)
    .map((t) => ({
      themeId: `mc_${t.themeId}`,
      themeKey: t.themeKey || `mc_${t.normalizedThemeKey.toLowerCase()}`,
      themeTitleTr: `Çoklu Bağlamda: ${t.labelTr}`,
      topicKey: t.normalizedThemeKey,
      contexts: t.contexts,
      entryCount: t.entryCount,
      distinctDatesCount: t.distinctDatesCount,
      evidenceEntryIds: t.evidenceEntryIds,
      sampleEntryIds: t.evidenceEntryIds.slice(0, 5),
      status: 'MULTI_CONTEXT_REPEATED_REPORT',
      extractionMethod: t.extractionMethod,
      summaryTr: `Bu tema hem ${t.contexts.slice(0, 2).map(getContextLabelTr).join(' hem de ')} bağlamında (${t.distinctDatesCount} farklı günde) kendini göstermektedir.`,
      relatedFacetIds: t.relatedFacetIds,
    }));
}

/**
 * Extract descriptive emotions
 * Invariant: Descriptive USER_EXPRESSED_EMOTION only; no clinical diagnostic conclusions.
 */
export function extractEmotions(entries: JournalEntryV1[]): { emotion: string; count: number }[] {
  const counts: Record<string, number> = {};

  for (const entry of entries) {
    const text = ((entry.title || '') + ' ' + (entry.body || '')).toLowerCase();
    for (const [emotion, keywords] of Object.entries(EMOTION_LEXICON)) {
      const match = keywords.some((kw) => text.includes(kw));
      if (match) {
        counts[emotion] = (counts[emotion] || 0) + 1;
      }
    }
  }

  return Object.entries(counts)
    .map(([emotion, count]) => ({ emotion, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Evaluates observational profile links & contextual variations
 * INVARIANT: Context alone does not create profile alignment or variation.
 * Requires directional semantic topic signals.
 */
export function evaluateProfileObservationalLinks(
  entries: JournalEntryV1[],
  profile: UnifiedPsychologicalProfileV2
) {
  const profileAlignedThemes: JournalObservationSummaryV1['profileAlignedThemes'] = [];
  const contextualVariations: JournalObservationSummaryV1['contextualVariations'] = [];
  const unmeasuredRelevantAreas: JournalObservationSummaryV1['unmeasuredRelevantAreas'] = [];

  const measuredFacetsMap = new Map<string, FacetProfileV2>();
  if (Array.isArray(profile.facets)) {
    for (const f of profile.facets) {
      if (f.measurementStatus !== 'NOT_MEASURED' && f.score !== null) {
        measuredFacetsMap.set(f.facetId, f);
      }
    }
  }

  // Detect topics across all active entries
  const entryTopicsList = entries.map((e) => ({ entry: e, topics: detectTopicsForEntry(e) }));

  // Collect topics that have at least one explicit signal
  const detectedTopicKeys = new Set<ObservationalTopicKey>();
  entryTopicsList.forEach(({ topics }) => topics.forEach((t) => detectedTopicKeys.add(t.topicKey)));

  for (const topicKey of Array.from(detectedTopicKeys)) {
    const topicDef = OBSERVATIONAL_TOPIC_REGISTRY.find((d) => d.key === topicKey);
    if (!topicDef) continue;

    const matchingEntries = entryTopicsList.filter(({ topics }) => topics.some((t) => t.topicKey === topicKey));
    if (matchingEntries.length === 0) continue;

    for (const facetId of topicDef.relevantFacetIds) {
      const facetMeta = MASTER_FACETS.find((f) => f.facetId === facetId);
      if (!facetMeta) continue;

      const profileFacet = measuredFacetsMap.get(facetId);
      if (profileFacet && profileFacet.score !== null) {
        const score = profileFacet.score;

        // Contextual Variation Check: Explicit directional divergence
        if (topicKey === 'WORK_STRESS' && facetId === 'anxiety' && score <= 2.5) {
          const hasWorkContext = matchingEntries.some(({ entry }) => entry.contextTags.includes('WORK'));
          if (hasWorkContext && !contextualVariations.some((v) => v.facetId === 'anxiety' && v.context === 'WORK')) {
            contextualVariations.push({
              context: 'WORK',
              facetId,
              facetNameTr: facetMeta.nameTr,
              measuredScore: score,
              topicKey,
              userReportedTendencyTr: 'İş ortamında yoğun baskı ve stres bildirimleri',
              narrativeTr: `Genel profilinizde sakinlik ve düşük kaygı düzeyi (${score.toFixed(2)}) ölçülmüşken, iş bağlamında daha yüksek stres bildirdiğiniz gözleniyor. Bu durum bağlamsal bir farklılaşmaya işaret eder.`,
            });
          }
        } else if (topicKey === 'SOCIAL_EXPRESSION' && facetId === 'social_boldness' && score >= 3.8) {
          const hasHesitation = matchingEntries.some(({ entry }) =>
            (entry.body + ' ' + (entry.title || '')).toLowerCase().includes('çekin')
          );
          if (hasHesitation && !contextualVariations.some((v) => v.facetId === 'social_boldness')) {
            contextualVariations.push({
              context: matchingEntries[0]?.entry.contextTags[0] || 'WORK',
              facetId,
              facetNameTr: facetMeta.nameTr,
              measuredScore: score,
              topicKey,
              userReportedTendencyTr: 'Toplantılarda ve sosyal ortamlarda ifade çekingenliği',
              narrativeTr: `Ölçülen sosyal cesaret ve girişkenlik düzeyiniz (${score.toFixed(2)}) yüksek olmasına karşın, belirli sosyal/iş ortamlarında çekingenlik bildirdiğiniz görülüyor.`,
            });
          }
        } else if (score >= 3.5 || score <= 2.2) {
          if (!profileAlignedThemes.some((a) => a.facetId === facetId)) {
            profileAlignedThemes.push({
              relationshipType: 'ALIGNED_WITH_MEASUREMENT',
              facetId,
              facetNameTr: facetMeta.nameTr,
              constructId: facetMeta.constructId,
              topicKey,
              summaryTr: `Yansımalarınızdaki '${topicDef.labelTr}' gözlemleri, ölçülen ${facetMeta.nameTr} (${score.toFixed(2)}) alanı ile aynı yönde deneyimler içermektedir.`,
            });
          }
        }
      } else {
        // Unmeasured relevant area
        if (matchingEntries.length >= 2) {
          if (!unmeasuredRelevantAreas.some((a) => a.areaNameTr === facetMeta.nameTr)) {
            unmeasuredRelevantAreas.push({
              areaNameTr: facetMeta.nameTr,
              context: matchingEntries[0]?.entry.contextTags[0] || 'GENERAL',
              topicKey,
              entryCount: matchingEntries.length,
            });
          }
        }
      }
    }
  }

  return { profileAlignedThemes, contextualVariations, unmeasuredRelevantAreas };
}

/**
 * Computes Growth Candidate Areas
 * INVARIANT: Consumes ONLY validated repeated semantic themes or verified contextual variations.
 * NEVER consumes context-frequency-only tags.
 */
export function computeGrowthCandidateAreas(
  repeatedThemes: RepeatedThemeV1[],
  contextualVariations: JournalObservationSummaryV1['contextualVariations']
): GrowthCandidateAreaV1[] {
  const candidates: GrowthCandidateAreaV1[] = [];

  // ONLY consumes validated repeated themes (>=3 entries, >=2 dates)
  for (const theme of repeatedThemes) {
    candidates.push({
      candidateId: `growth_theme_${theme.normalizedThemeKey.toLowerCase()}`,
      sourceType: 'JOURNAL_OBSERVATION',
      topicKey: theme.normalizedThemeKey,
      labelTr: theme.labelTr,
      relatedFacetIds: theme.relatedFacetIds,
      relatedJournalThemes: [theme.labelTr],
      userPriority: theme.entryCount >= 5 ? 'HIGH' : 'MEDIUM',
      repeatEvidenceCount: theme.entryCount,
      distinctDatesCount: theme.distinctDatesCount,
      contexts: theme.contexts,
      notesTr: `Kullanıcının yansımalarında ${theme.distinctDatesCount} farklı günde ${theme.entryCount} kez gözlenen '${theme.labelTr}' teması potansiyel gelişim ve farkındalık alanı olarak yapılandırılmıştır.`,
    });
  }

  // Also include significant contextual variations
  for (const variation of contextualVariations) {
    if (!candidates.some((c) => c.relatedFacetIds.includes(variation.facetId))) {
      candidates.push({
        candidateId: `growth_var_${variation.facetId}_${variation.context.toLowerCase()}`,
        sourceType: 'LONGITUDINAL_VARIATION',
        topicKey: variation.topicKey,
        labelTr: `${variation.facetNameTr} — ${getContextLabelTr(variation.context)} Bağlamı Farklılaşması`,
        relatedFacetIds: [variation.facetId],
        relatedJournalThemes: [variation.userReportedTendencyTr],
        userPriority: 'MEDIUM',
        repeatEvidenceCount: 1,
        distinctDatesCount: 1,
        contexts: [variation.context],
        notesTr: variation.narrativeTr,
      });
    }
  }

  return candidates;
}

/**
 * Computes dynamic observation summary from active user journal entries
 * Invariant: Never modifies psychometric scores or profile coverage
 */
export async function computeDynamicObservationSummary(
  userId: string,
  providedEntries?: JournalEntryV1[],
  providedProfile?: UnifiedPsychologicalProfileV2
): Promise<JournalObservationSummaryV1> {
  const entries = providedEntries || (await getJournalEntries(userId));
  const profile = providedProfile || (await getCurrentUnifiedProfile(userId));

  const activeEntries = entries.filter((e) => !e.deletedAt);
  const entryCount = activeEntries.length;

  // 1. Date Range
  let dateRange: { start: string; end: string } | null = null;
  if (entryCount > 0) {
    const dates = activeEntries.map((e) => e.createdAt).sort();
    dateRange = { start: dates[0], end: dates[dates.length - 1] };
  }

  // 2. Context Frequencies (Independent life domain recurrence)
  const contextFrequencies = computeContextFrequencies(activeEntries);
  const dominantContexts = contextFrequencies.map((f) => ({
    context: f.context,
    count: f.entryCount,
    percentage: f.percentage,
  }));

  // 3. Repeated Semantic Themes (Rule: >= 3 semantically related entries, >= 2 distinct dates)
  const repeatedThemes = computeRepeatedThemes(activeEntries);

  // 4. Multi-Context Themes
  const multiContextThemes = computeMultiContextThemes(repeatedThemes);

  // 5. Emotion Extraction (Descriptive)
  const repeatedEmotions = extractEmotions(activeEntries);

  // 6. Profile Alignment & Directional Contextual Variations
  const { profileAlignedThemes, contextualVariations, unmeasuredRelevantAreas } =
    evaluateProfileObservationalLinks(activeEntries, profile);

  // 7. Life Events
  const lifeEvents = activeEntries
    .filter((e) => e.isLifeEvent && e.lifeEventType)
    .map((e) => ({
      entryId: e.id,
      date: e.createdAt,
      eventType: e.lifeEventType!,
      title: e.title || null,
    }));

  // 8. Growth Candidate Areas (Strictly consumes validated repeated themes/variations, NEVER raw context count)
  const growthCandidateAreas = computeGrowthCandidateAreas(repeatedThemes, contextualVariations);

  return {
    userId,
    entryCount,
    activeEntriesCount: entryCount,
    dateRange,
    contextFrequencies,
    dominantContexts,
    repeatedThemes,
    multiContextThemes,
    repeatedEmotions,
    profileAlignedThemes,
    contextualVariations,
    unmeasuredRelevantAreas,
    lifeEvents,
    growthCandidateAreas,
    limitations: [
      'Günlük kayıtları kişisel öz-bildirimlerdir; psikometrik ölçüm yerine geçmez.',
      'Tekrarlanan temalar semantik içerik benzerliğine dayalı operasyonel gözlemlerdir; psikolojik tanı teşkil etmez.',
      'Yaşam alanı sıklığı (bağlam frekansı), psikolojik bir tema tekrarı ile eşdeğer değildir.',
      'Bağlamsal farklılıklar genel kişiliği geçersiz kılmaz, durumsal dinamikleri betimler.',
    ],
  };
}

/**
 * Builds scoped, privacy-preserving AI observation bundle
 * Strict Invariant: NO name, email, userId, IP, raw assessment questions, or unrelated history
 */
export async function buildJournalObservationBundle(
  userId: string,
  entry: JournalEntryV1,
  profile?: UnifiedPsychologicalProfileV2,
  providedRecentEntries?: JournalEntryV1[]
): Promise<JournalObservationBundleV1> {
  const currentProfile = profile || (await getCurrentUnifiedProfile(userId));
  let activeEntries: JournalEntryV1[] = [];

  if (providedRecentEntries) {
    activeEntries = providedRecentEntries.filter((e) => !e.deletedAt && e.id !== entry.id);
  } else {
    try {
      const recentEntries = await getJournalEntries(userId, { limit: 10 });
      activeEntries = recentEntries.filter((e) => !e.deletedAt && e.id !== entry.id);
    } catch {
      // In offline / unit-testing environments without live DB
      activeEntries = [];
    }
  }

  // Scoped context distribution
  const contextCounts: Record<JournalContextTag, number> = {} as any;
  for (const e of activeEntries) {
    for (const t of e.contextTags) {
      contextCounts[t] = (contextCounts[t] || 0) + 1;
    }
  }

  const recentContextDistribution = Object.entries(contextCounts)
    .filter(([_, count]) => count > 0)
    .map(([context, count]) => ({ context: context as JournalContextTag, count }));

  // Scoped profile evidence relevant to entry's context tags
  const relevantFacetIds = new Set<string>();
  for (const tag of entry.contextTags) {
    (POTENTIALLY_RELEVANT_FACET_MAP[tag] || []).forEach((id) => relevantFacetIds.add(id));
  }

  const scopedProfileEvidence: JournalObservationBundleV1['scopedProfileEvidence'] = [];
  const measuredFacetsMap = new Map<string, FacetProfileV2>();
  if (Array.isArray(currentProfile.facets)) {
    for (const f of currentProfile.facets) {
      if (f.measurementStatus !== 'NOT_MEASURED' && f.score !== null) {
        measuredFacetsMap.set(f.facetId, f);
      }
    }
  }

  for (const facetId of Array.from(relevantFacetIds)) {
    const pf = measuredFacetsMap.get(facetId);
    const facetMeta = MASTER_FACETS.find((f) => f.facetId === facetId);
    if (pf && pf.score !== null && facetMeta) {
      const constructMeta = MASTER_CONSTRUCTS.find((c) => c.constructId === facetMeta.constructId);
      scopedProfileEvidence.push({
        facetId,
        facetNameTr: facetMeta.nameTr,
        constructId: facetMeta.constructId,
        constructNameTr: constructMeta?.nameTr || facetMeta.constructId,
        domainId: facetMeta.domainId,
        score: pf.score,
        confidenceLevel: pf.confidenceComponents?.coverage || 'MODERATE',
      });
    }
  }

  // Active repeated themes
  const allActive = [entry, ...activeEntries];
  const repeated = computeRepeatedThemes(allActive);

  return {
    currentEntryExcerpt: {
      title: entry.title,
      body: entry.body,
      entryType: entry.entryType,
      contextTags: entry.contextTags,
      moodSelfReport: entry.moodSelfReport,
      energySelfReport: entry.energySelfReport,
      stressSelfReport: entry.stressSelfReport,
      isLifeEvent: entry.isLifeEvent,
      lifeEventType: entry.lifeEventType,
      createdAt: entry.createdAt,
    },
    recentContextDistribution,
    activeRepeatedThemes: repeated.map((r) => ({
      titleTr: r.labelTr,
      context: r.contexts[0],
      entryCount: r.entryCount,
      summaryTr: r.summaryTr,
    })),
    scopedProfileEvidence,
    limitations: [
      'Günlük kayıtları öz-bildirimdir; doğrudan ölçüm değildir.',
      'Kesin tanısal iddialarda bulunulamaz.',
    ],
  };
}

/**
 * Resolves observational relationships between entry and Master Model
 * INVARIANT: Context alone does not establish alignment or variation.
 * A directional observational topic signal is required.
 */
export function resolveJournalProfileRelationships(
  entry: JournalEntryV1,
  profile: UnifiedPsychologicalProfileV2
): JournalProfileRelationshipV1[] {
  const relationships: JournalProfileRelationshipV1[] = [];
  const measuredFacetsMap = new Map<string, FacetProfileV2>();
  if (Array.isArray(profile.facets)) {
    for (const f of profile.facets) {
      if (f.measurementStatus !== 'NOT_MEASURED' && f.score !== null) {
        measuredFacetsMap.set(f.facetId, f);
      }
    }
  }

  const detectedTopics = detectTopicsForEntry(entry);

  // If entry contains NO matching semantic topic signals, return NO_CLEAR_RELATION
  if (detectedTopics.length === 0) {
    for (const tag of entry.contextTags) {
      const potentiallyRelevant = (POTENTIALLY_RELEVANT_FACET_MAP[tag] || []).slice(0, 2);
      for (const facetId of potentiallyRelevant) {
        const facetMeta = MASTER_FACETS.find((f) => f.facetId === facetId);
        if (!facetMeta) continue;

        relationships.push({
          id: `rel_${entry.id}_${facetId}_noclear`,
          entryId: entry.id,
          relationshipType: 'NO_CLEAR_RELATION',
          evidenceType: 'USER_REPORTED_CONTEXT',
          strength: 'WEAK',
          relatedFacetIds: [facetId],
          relatedConstructIds: [facetMeta.constructId],
          relatedDomainIds: [facetMeta.domainId],
          narrativeTr: `Bu kayıttaki deneyim, genel ${getContextLabelTr(tag)} bağlamına aittir ancak ölçülen ${facetMeta.nameTr} boyutuyla doğrudan bir örtüşme veya ayrışma sinyali içermemektedir.`,
          createdAt: new Date().toISOString(),
        });
      }
    }
    return relationships;
  }

  // Evaluate each detected topic against relevant facets
  for (const topic of detectedTopics) {
    const topicDef = OBSERVATIONAL_TOPIC_REGISTRY.find((d) => d.key === topic.topicKey);
    if (!topicDef) continue;

    for (const facetId of topicDef.relevantFacetIds) {
      const facetMeta = MASTER_FACETS.find((f) => f.facetId === facetId);
      if (!facetMeta) continue;

      const profileFacet = measuredFacetsMap.get(facetId);
      if (profileFacet && profileFacet.score !== null) {
        const score = profileFacet.score;

        let relType: JournalRelationshipType = 'ALIGNED_WITH_MEASUREMENT';
        let narrative = `Bu kayıtta gözlenen ${topic.labelTr} teması, profilinizdeki ${facetMeta.nameTr} (${score.toFixed(2)}) ölçümüyle anlamlı bir paralellik taşımaktadır.`;

        // Check for specific directional variation
        if (topic.topicKey === 'SOCIAL_EXPRESSION' && facetId === 'social_boldness' && score >= 3.5) {
          relType = 'CONTEXTUAL_VARIATION';
          narrative = `Ölçülen sosyal cesaret ve girişkenlik düzeyiniz (${score.toFixed(2)}) yüksek olmasına karşın, bu yansımada sosyal/iş ortamında çekingenlik deneyimi paylaşıldı.`;
        } else if (topic.topicKey === 'WORK_STRESS' && facetId === 'anxiety' && score <= 2.5) {
          relType = 'CONTEXTUAL_VARIATION';
          narrative = `Genel profilinizde düşük kaygı (${score.toFixed(2)}) ölçülmüşken, bu yansımada iş ortamında yoğun stres ve baskı bildirilmektedir.`;
        }

        relationships.push({
          id: `rel_${entry.id}_${facetId}`,
          entryId: entry.id,
          relationshipType: relType,
          evidenceType: 'OBSERVATIONAL_DATA',
          strength: entry.body.length > 150 ? 'MODERATE' : 'WEAK',
          relatedFacetIds: [facetId],
          relatedConstructIds: [facetMeta.constructId],
          relatedDomainIds: [facetMeta.domainId],
          narrativeTr: narrative,
          createdAt: new Date().toISOString(),
        });
      } else {
        // Unmeasured relevant area
        relationships.push({
          id: `rel_${entry.id}_${facetId}_unmeasured`,
          entryId: entry.id,
          relationshipType: 'UNMEASURED_RELEVANT_AREA',
          evidenceType: 'USER_REPORTED_CONTEXT',
          strength: 'WEAK',
          relatedFacetIds: [facetId],
          relatedConstructIds: [facetMeta.constructId],
          relatedDomainIds: [facetMeta.domainId],
          narrativeTr: `Bu yansımada gözlenen ${topic.labelTr} alanı (${facetMeta.nameTr}), profilinizde henüz doğrudan bir modül ile ölçülmemiştir.`,
          createdAt: new Date().toISOString(),
        });
      }
    }
  }

  return relationships;
}

export function getContextLabelTr(tag: JournalContextTag): string {
  switch (tag) {
    case 'WORK':
      return 'İş ve Çalışma';
    case 'RELATIONSHIPS':
      return 'İlişkiler';
    case 'FAMILY':
      return 'Aile';
    case 'DECISION_MAKING':
      return 'Karar Alma';
    case 'STRESS':
      return 'Stres ve Zorlanma';
    case 'SOCIAL':
      return 'Sosyal Çevre';
    case 'SELF_IMAGE':
      return 'Benlik Algısı';
    case 'GOALS':
      return 'Hedefler ve Başarı';
    case 'HEALTH':
      return 'Sağlık ve Zindelik';
    case 'LIFE_EVENT':
      return 'Önemli Yaşam Olayı';
    case 'GENERAL':
    default:
      return 'Genel Yansıma';
  }
}
