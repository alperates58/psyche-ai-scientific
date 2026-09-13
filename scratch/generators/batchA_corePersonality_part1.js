// BATCH A: CORE PERSONALITY (HEXACO 24 Facets)
// 10-12 candidate items per facet = ~264 items

const DEFAULT_TRANSLATION_PROVENANCE = {
  originalLanguage: "tr",
  translationMethod: "DIRECT_NATIVE_TURKISH_AUTHORING",
  translatorType: "SCIENTIFIC_RESEARCH_TEAM",
  backTranslationStatus: "PENDING_PILOT_VERIFICATION",
  culturalReviewStatus: "COMPLETED_INTERNAL_REVIEW"
};

const LIKERT_6_AGREEMENT = {
  scaleId: "scale_likert_6_agreement",
  min: 1,
  max: 6,
  step: 1,
  labels_tr: ["Kesinlikle Katılmıyorum", "Katılmıyorum", "Biraz Katılmıyorum", "Biraz Katılıyorum", "Katılıyorum", "Kesinlikle Katılıyorum"],
  labels_en: ["Strongly Disagree", "Disagree", "Slightly Disagree", "Slightly Agree", "Agree", "Strongly Agree"]
};

const LIKERT_6_FREQUENCY = {
  scaleId: "scale_likert_6_frequency",
  min: 1,
  max: 6,
  step: 1,
  labels_tr: ["Hiçbir Zaman", "Çok Nadir", "Bazen", "Sık Sık", "Çoğu Zaman", "Her Zaman"],
  labels_en: ["Never", "Very Rarely", "Sometimes", "Often", "Most of the Time", "Always"]
};

function createItem(props) {
  return {
    id: props.id,
    domainId: "core_personality",
    constructId: props.constructId,
    facetId: props.facetId,
    primaryFacet: props.facetId,
    possibleCrossLoadings: props.possibleCrossLoadings || [],
    itemType: props.itemType || "likert",
    text_tr: props.text_tr,
    text_en: props.text_en || "",
    responseScale: props.responseScale || LIKERT_6_AGREEMENT,
    keying: props.keying || "POSITIVE",
    reverseWorded: props.keying === "NEGATIVE",
    context: props.context || "general",
    measurementPurpose: props.measurementPurpose || "trait_level",
    observableIndicatorId: props.observableIndicatorId || `${props.facetId}_ind_1`,
    sourceType: props.sourceType || "ORIGINAL_AI_ASSISTED_RESEARCH_DRAFT",
    sourceIds: props.sourceIds || ["src_ashton_lee_2007"],
    instrumentIds: props.instrumentIds || ["inst_ipip_hexaco"],
    licenseStatus: "APPROVED_PUBLIC",
    validationStatus: "RESEARCH_DRAFT",
    candidateStatus: "INTERNAL_REVIEW",
    socialDesirabilitySensitivity: props.socialDesirabilitySensitivity || "moderate",
    acquiescenceRisk: props.acquiescenceRisk || "low",
    readingDifficulty: props.readingDifficulty || "easy",
    estimatedCompletionSeconds: props.estimatedCompletionSeconds || 7,
    semanticCluster: props.semanticCluster || `${props.facetId}_general`,
    pairedItemId: props.pairedItemId || null,
    forcedChoiceBlock: props.forcedChoiceBlock || null,
    situationalScenarios: props.situationalScenarios || null,
    translationProvenance: DEFAULT_TRANSLATION_PROVENANCE,
    version: "1.0.0-draft"
  };
}

const items = [];

// ==========================================
// 1. HONESTY-HUMILITY -> SINCERITY (11 items)
// ==========================================
items.push(
  createItem({
    id: "CP-HH-SIN-001",
    constructId: "honesty_humility",
    facetId: "sincerity",
    text_tr: "Birinden fayda sağlamak için yapmacık iltifatlarda bulunmaktan kaçınırım.",
    text_en: "I avoid giving insincere compliments just to get something in return.",
    keying: "POSITIVE",
    socialDesirabilitySensitivity: "high",
    context: "social"
  }),
  createItem({
    id: "CP-HH-SIN-002",
    constructId: "honesty_humility",
    facetId: "sincerity",
    text_tr: "İşlerimi kolaylaştırmak için insanlara duymak istedikleri şeyleri söylerim.",
    text_en: "I tell people what they want to hear if it makes things easier for me.",
    keying: "NEGATIVE",
    socialDesirabilitySensitivity: "high",
    context: "work"
  }),
  createItem({
    id: "CP-HH-SIN-003",
    constructId: "honesty_humility",
    facetId: "sincerity",
    text_tr: "Düşüncelerimi saklamak yerine karşımdakine içtenlikle açarım.",
    text_en: "I share my thoughts genuinely rather than hiding what I really feel.",
    keying: "POSITIVE",
    context: "relationship"
  }),
  createItem({
    id: "CP-HH-SIN-004",
    constructId: "honesty_humility",
    facetId: "sincerity",
    itemType: "behavior_frequency",
    responseScale: LIKERT_6_FREQUENCY,
    text_tr: "Kişisel çıkar sağlamak için yapmacık bir şekilde sempatik davranırım.",
    text_en: "I act artificially charming to gain a personal advantage.",
    keying: "NEGATIVE",
    socialDesirabilitySensitivity: "high",
    context: "general"
  }),
  createItem({
    id: "CP-HH-SIN-005",
    constructId: "honesty_humility",
    facetId: "sincerity",
    text_tr: "İnsanları yönlendirmek için samimiyetsiz rollere girmem.",
    text_en: "I do not put on false personas to manipulate people.",
    keying: "POSITIVE",
    context: "social"
  }),
  createItem({
    id: "CP-HH-SIN-006",
    constructId: "honesty_humility",
    facetId: "sincerity",
    text_tr: "Birini ikna etmek gerekiyorsa biraz rol yapmakta sakınca görmem.",
    text_en: "I see no problem with putting on an act if I need to persuade someone.",
    keying: "NEGATIVE",
    socialDesirabilitySensitivity: "moderate",
    context: "work"
  }),
  createItem({
    id: "CP-HH-SIN-007",
    constructId: "honesty_humility",
    facetId: "sincerity",
    text_tr: "İletişim kurduğum kişilere karşı olduğum gibi görünmeye özen gösteririm.",
    text_en: "I make an effort to appear as I truly am to those I communicate with.",
    keying: "POSITIVE",
    context: "general"
  }),
  createItem({
    id: "CP-HH-SIN-008",
    constructId: "honesty_humility",
    facetId: "sincerity",
    text_tr: "Etrafımdaki önemli kişilerin gözüne girmek için abartılı övgüler yaparım.",
    text_en: "I flatter influential people to get into their good graces.",
    keying: "NEGATIVE",
    socialDesirabilitySensitivity: "high",
    context: "work"
  }),
  createItem({
    id: "CP-HH-SIN-009",
    constructId: "honesty_humility",
    facetId: "sincerity",
    itemType: "contextual",
    context: "work",
    text_tr: "İş yerinde yöneticilerime sırf terfi almak için yapay nezaket göstermem.",
    text_en: "At work, I do not show superficial politeness to supervisors merely for promotion.",
    keying: "POSITIVE"
  }),
  createItem({
    id: "CP-HH-SIN-010",
    constructId: "honesty_humility",
    facetId: "sincerity",
    itemType: "situational_judgement",
    estimatedCompletionSeconds: 15,
    text_tr: "Önemli bir iş fırsatını kaçırmamak için görüşmecinin hoşuna gidecek ama inanmadığınız bir fikri savunmanız önerildiğinde nasıl davranırsınız?",
    text_en: "When advised to endorse an opinion you do not believe in during an interview to secure a job, how would you respond?",
    situationalScenarios: [
      { optionId: "opt_1", text_tr: "Görüşmeyi kazanmak için önerilen fikri benimser gibi yaparım.", weight: 1 },
      { optionId: "opt_2", text_tr: "Kendi görüşümü nazikçe ama dürüstçe ifade ederim.", weight: 5 }
    ]
  }),
  createItem({
    id: "CP-HH-SIN-011",
    constructId: "honesty_humility",
    facetId: "sincerity",
    itemType: "forced_choice",
    text_tr: "A: İnsanlarla iletişimimde tam bir şeffaflık ve dürüstlük ararım. | B: Ortamın huzuru için bazen içten olmasam da uyum sağlarım.",
    text_en: "A: I seek complete genuineness in communication. | B: For peace, I adapt even if I feel insincere.",
    forcedChoiceBlock: {
      blockId: "fc_sin_001",
      pairedFacetIds: ["sincerity", "flexibility"],
      scoringApproach: "normative_paired"
    }
  })
);

// ==========================================
// 2. HONESTY-HUMILITY -> FAIRNESS (11 items)
// ==========================================
items.push(
  createItem({
    id: "CP-HH-FAI-001",
    constructId: "honesty_humility",
    facetId: "fairness",
    text_tr: "Kimse fark etmeyecek olsa bile kuralları kendi lehime esnetmem.",
    text_en: "Even if no one would notice, I do not bend rules in my favor.",
    keying: "POSITIVE",
    socialDesirabilitySensitivity: "high"
  }),
  createItem({
    id: "CP-HH-FAI-002",
    constructId: "honesty_humility",
    facetId: "fairness",
    text_tr: "Yakalanma riski yoksa kuralların açığından faydalanmakta sakınca görmem.",
    text_en: "If there is no risk of getting caught, I see nothing wrong with exploiting rule loopholes.",
    keying: "NEGATIVE",
    socialDesirabilitySensitivity: "high"
  }),
  createItem({
    id: "CP-HH-FAI-003",
    constructId: "honesty_humility",
    facetId: "fairness",
    text_tr: "Başkalarının hakkını gasp ederek avantaj sağlamayı haksızlık sayarım.",
    text_en: "I consider gaining an advantage at others' expense to be unjust.",
    keying: "POSITIVE"
  }),
  createItem({
    id: "CP-HH-FAI-004",
    constructId: "honesty_humility",
    facetId: "fairness",
    itemType: "behavior_frequency",
    responseScale: LIKERT_6_FREQUENCY,
    text_tr: "Sıramı öne almak için tanıdık bağlantılarımı devreye sokarım.",
    text_en: "I use personal connections to jump ahead in queues or processes.",
    keying: "NEGATIVE",
    socialDesirabilitySensitivity: "high"
  }),
  createItem({
    id: "CP-HH-FAI-005",
    constructId: "honesty_humility",
    facetId: "fairness",
    text_tr: "Ortak çalışmalarda herkesin katkısına eşit saygı gösteririm.",
    text_en: "In team efforts, I show equal respect to everyone's contributions.",
    keying: "POSITIVE"
  }),
  createItem({
    id: "CP-HH-FAI-006",
    constructId: "honesty_humility",
    facetId: "fairness",
    text_tr: "Kişisel bir kazanç için başkalarının sırasını almayı normal bulurum.",
    text_en: "I consider it normal to take someone else's turn for personal gain.",
    keying: "NEGATIVE"
  }),
  createItem({
    id: "CP-HH-FAI-007",
    constructId: "honesty_humility",
    facetId: "fairness",
    text_tr: "Bana fazla verilen para üstünü fark ettiğimde hemen iade ederim.",
    text_en: "When I realize I received too much change, I return it immediately.",
    keying: "POSITIVE"
  }),
  createItem({
    id: "CP-HH-FAI-008",
    constructId: "honesty_humility",
    facetId: "fairness",
    text_tr: "Rekabet ortamında avantaj sağlamak için küçük hileler yapılabilir.",
    text_en: "Minor deceits are acceptable to gain an edge in competitive environments.",
    keying: "NEGATIVE"
  }),
  createItem({
    id: "CP-HH-FAI-009",
    constructId: "honesty_humility",
    facetId: "fairness",
    itemType: "contextual",
    context: "work",
    text_tr: "İş yerinde kaynakları paylaştırırken yakın arkadaşlarıma ayrımcılık yapmam.",
    text_en: "At work, I do not favor close friends when allocating resources.",
    keying: "POSITIVE"
  }),
  createItem({
    id: "CP-HH-FAI-010",
    constructId: "honesty_humility",
    facetId: "fairness",
    itemType: "situational_judgement",
    estimatedCompletionSeconds: 15,
    text_tr: "Mağazada kasiyerin pahalı bir ürünü yanlışlıkla barkod okutmadan poşete koyduğunu fark ettiniz. Ne yaparsınız?",
    text_en: "You notice a cashier accidentally bagged an expensive item without scanning it. What would you do?",
    situationalScenarios: [
      { optionId: "opt_1", text_tr: "Durumu kasiyere bildirir ve ürünün ücretini öderim.", weight: 5 },
      { optionId: "opt_2", text_tr: "Mağazanın hatası olduğunu düşünerek sesimi çıkarmam.", weight: 1 }
    ]
  }),
  createItem({
    id: "CP-HH-FAI-011",
    constructId: "honesty_humility",
    facetId: "fairness",
    itemType: "forced_choice",
    text_tr: "A: Kuralların herkes için istisnasız eşit işlemesini savunurum. | B: Sonuç başarı getirdiği sürece bazı kuralların esnetilmesini anlarım.",
    text_en: "A: I advocate that rules apply equally to all without exception. | B: I understand bending rules if it secures success.",
    forcedChoiceBlock: {
      blockId: "fc_fai_001",
      pairedFacetIds: ["fairness", "prudence"],
      scoringApproach: "normative_paired"
    }
  })
);

// ==========================================
// 3. HONESTY-HUMILITY -> GREED AVOIDANCE (11 items)
// ==========================================
items.push(
  createItem({
    id: "CP-HH-GRE-001",
    constructId: "honesty_humility",
    facetId: "greed_avoidance",
    text_tr: "Pahalı ve lüks eşyalarla gösteriş yapmak bana cazip gelmez.",
    text_en: "Showing off with expensive luxury items does not appeal to me.",
    keying: "POSITIVE"
  }),
  createItem({
    id: "CP-HH-GRE-002",
    constructId: "honesty_humility",
    facetId: "greed_avoidance",
    text_tr: "Çok zengin olup lüks bir yaşam sürmek en büyük hayallerim arasındadır.",
    text_en: "Living in great wealth and luxury is among my primary aspirations.",
    keying: "NEGATIVE"
  }),
  createItem({
    id: "CP-HH-GRE-003",
    constructId: "honesty_humility",
    facetId: "greed_avoidance",
    text_tr: "İhtiyaçlarımı karşılayacak düzeyde bir gelir bana yeterli gelir.",
    text_en: "An income sufficient for my needs is enough for me.",
    keying: "POSITIVE"
  }),
  createItem({
    id: "CP-HH-GRE-004",
    constructId: "honesty_humility",
    facetId: "greed_avoidance",
    itemType: "behavior_frequency",
    responseScale: LIKERT_6_FREQUENCY,
    text_tr: "Statümü göstermek amacıyla pahalı markaların ürünlerini tercih ederim.",
    text_en: "I choose expensive brand items to signal my status to others.",
    keying: "NEGATIVE"
  }),
  createItem({
    id: "CP-HH-GRE-005",
    constructId: "honesty_humility",
    facetId: "greed_avoidance",
    text_tr: "Maddi servet kazanmayı hayatın birincil başarı ölçütü olarak görmem.",
    text_en: "I do not consider accumulating wealth as the primary measure of life success.",
    keying: "POSITIVE"
  }),
  createItem({
    id: "CP-HH-GRE-006",
    constructId: "honesty_humility",
    facetId: "greed_avoidance",
    text_tr: "Başkalarını etkileyecek lüks otomobillere veya evlere sahip olmak isterim.",
    text_en: "I desire luxury cars or residences that would impress others.",
    keying: "NEGATIVE"
  }),
  createItem({
    id: "CP-HH-GRE-007",
    constructId: "honesty_humility",
    facetId: "greed_avoidance",
    text_tr: "Sade ve mütevazı bir yaşam tarzı beni fazlasıyla tatmin eder.",
    text_en: "A simple, modest lifestyle satisfies me completely.",
    keying: "POSITIVE"
  }),
  createItem({
    id: "CP-HH-GRE-008",
    constructId: "honesty_humility",
    facetId: "greed_avoidance",
    text_tr: "Daha fazla para kazanmak için sevmediğim bir işte yıllarca çalışırım.",
    text_en: "I would work years in a job I dislike merely to accumulate more money.",
    keying: "NEGATIVE"
  }),
  createItem({
    id: "CP-HH-GRE-009",
    constructId: "honesty_humility",
    facetId: "greed_avoidance",
    itemType: "contextual",
    context: "social",
    text_tr: "Sosyal ortamlarda harcamalarımla veya maddi imkanlarımla övünmem.",
    text_en: "In social gatherings, I do not boast about my spending or financial resources.",
    keying: "POSITIVE"
  }),
  createItem({
    id: "CP-HH-GRE-010",
    constructId: "honesty_humility",
    facetId: "greed_avoidance",
    itemType: "situational_judgement",
    estimatedCompletionSeconds: 15,
    text_tr: "Beklenmedik bir miras aldığınızda ilk tepkiniz ne olurdu?",
    text_en: "If you received an unexpected large inheritance, what would be your initial reaction?",
    situationalScenarios: [
      { optionId: "opt_1", text_tr: "Lüks seyahatler ve pahalı mülkler edinerek hayat standardımı yükseltirim.", weight: 1 },
      { optionId: "opt_2", text_tr: "Mevcut sade hayatımı korur, geleceği güvenceye alıp anlamlı projelere ayırırım.", weight: 5 }
    ]
  }),
  createItem({
    id: "CP-HH-GRE-011",
    constructId: "honesty_humility",
    facetId: "greed_avoidance",
    itemType: "forced_choice",
    text_tr: "A: Hayatımda huzur ve sade ilişkiler maddi zenginlikten daha değerlidir. | B: Maddi güç ve refah hayat kalitemin en temel göstergesidir.",
    text_en: "A: Peace and simple relationships matter more than riches. | B: Wealth and financial power are my main quality markers.",
    forcedChoiceBlock: {
      blockId: "fc_gre_001",
      pairedFacetIds: ["greed_avoidance", "values_self_enhancement"],
      scoringApproach: "normative_paired"
    }
  })
);

// ==========================================
// 4. HONESTY-HUMILITY -> MODESTY (11 items)
// ==========================================
items.push(
  createItem({
    id: "CP-HH-MOD-001",
    constructId: "honesty_humility",
    facetId: "modesty",
    text_tr: "Kendimi diğer insanlardan daha üstün veya ayrıcalıklı görmem.",
    text_en: "I do not consider myself superior or entitled compared to others.",
    keying: "POSITIVE"
  }),
  createItem({
    id: "CP-HH-MOD-002",
    constructId: "honesty_humility",
    facetId: "modesty",
    text_tr: "Sıradan insanlara tanınmayan özel ayrıcalıkları hak ettiğimi düşünürüm.",
    text_en: "I feel entitled to special privileges not granted to ordinary people.",
    keying: "NEGATIVE",
    socialDesirabilitySensitivity: "high"
  }),
  createItem({
    id: "CP-HH-MOD-003",
    constructId: "honesty_humility",
    facetId: "modesty",
    text_tr: "Başarılarımı başkalarının gözüne sokmadan tevazuyla karşılarım.",
    text_en: "I receive my accomplishments with humility rather than flaunting them.",
    keying: "POSITIVE"
  }),
  createItem({
    id: "CP-HH-MOD-004",
    constructId: "honesty_humility",
    facetId: "modesty",
    itemType: "behavior_frequency",
    responseScale: LIKERT_6_FREQUENCY,
    text_tr: "Sohbetlerde kendi yeteneklerimden ve başarılarımdan bahsederim.",
    text_en: "I bring up my talents and achievements in conversations.",
    keying: "NEGATIVE"
  }),
  createItem({
    id: "CP-HH-MOD-005",
    constructId: "honesty_humility",
    facetId: "modesty",
    text_tr: "Toplumdaki konumum ne olursa olsun herkesle eşit seviyede konuşurum.",
    text_en: "Regardless of my social position, I speak with everyone as equals.",
    keying: "POSITIVE"
  }),
  createItem({
    id: "CP-HH-MOD-006",
    constructId: "honesty_humility",
    facetId: "modesty",
    text_tr: "Önemli ortamlarda bana diğerlerinden daha fazla hürmet gösterilmelidir.",
    text_en: "In important settings, I expect more deference than is given to others.",
    keying: "NEGATIVE",
    socialDesirabilitySensitivity: "high"
  }),
  createItem({
    id: "CP-HH-MOD-007",
    constructId: "honesty_humility",
    facetId: "modesty",
    text_tr: "Övülmekten veya ilgi odağı olmaktan ziyade işimi iyi yapmaya odaklanırım.",
    text_en: "I focus on doing my job well rather than being praised or noticed.",
    keying: "POSITIVE"
  }),
  createItem({
    id: "CP-HH-MOD-008",
    constructId: "honesty_humility",
    facetId: "modesty",
    text_tr: "Diğer insanların çoğundan daha akıllı olduğumu sık sık düşünürüm.",
    text_en: "I often think I am substantially smarter than most people around me.",
    keying: "NEGATIVE"
  }),
  createItem({
    id: "CP-HH-MOD-009",
    constructId: "honesty_humility",
    facetId: "modesty",
    itemType: "contextual",
    context: "work",
    text_tr: "Ekip projelerinde başarının sadece bana değil tüm gruba ait olduğunu belirtirim.",
    text_en: "In team projects, I highlight that success belongs to the group, not just me.",
    keying: "POSITIVE"
  }),
  createItem({
    id: "CP-HH-MOD-010",
    constructId: "honesty_humility",
    facetId: "modesty",
    itemType: "situational_judgement",
    estimatedCompletionSeconds: 15,
    text_tr: "Büyük bir şirket başarısında en kritik rolü oynadınız ve toplantıda sadece genel ekibe teşekkür edildi. Tavrınız ne olurdu?",
    text_en: "You played the key role in a major success, but the meeting only thanked the team generally. What would you do?",
    situationalScenarios: [
      { optionId: "opt_1", text_tr: "Bireysel katkımın vurgulanması için yöneticimle ayrıca görüşürüm.", weight: 1 },
      { optionId: "opt_2", text_tr: "Ekip başarısının takdir edilmesini yeterli bulur, sessizce işime devam ederim.", weight: 5 }
    ]
  }),
  createItem({
    id: "CP-HH-MOD-011",
    constructId: "honesty_humility",
    facetId: "modesty",
    itemType: "forced_choice",
    text_tr: "A: Başkalarından farklı muamele görmeyi beklemem. | B: Özel yeteneklerim nedeniyle ayrıcalıklı davranılmasını doğal karşılarım.",
    text_en: "A: I expect no special treatment over others. | B: I find it natural to be treated with privilege due to my abilities.",
    forcedChoiceBlock: {
      blockId: "fc_mod_001",
      pairedFacetIds: ["modesty", "grandiose_narcissism"],
      scoringApproach: "normative_paired"
    }
  })
);

module.exports = {
  batchName: "BATCH_A_CORE_PERSONALITY",
  items
};
