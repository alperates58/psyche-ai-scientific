// BATCH D: COGNITION & DECISION MAKING (9 Facets)
// 10 candidate items per facet = 90 items

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
    domainId: "cognition_decision",
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
    sourceIds: props.sourceIds || ["src_cacioppo_petty_1982"],
    instrumentIds: props.instrumentIds || ["inst_nfc_sf"],
    licenseStatus: "APPROVED_WITH_ATTRIBUTION",
    validationStatus: "RESEARCH_DRAFT",
    candidateStatus: "INTERNAL_REVIEW",
    socialDesirabilitySensitivity: props.socialDesirabilitySensitivity || "moderate",
    acquiescenceRisk: props.acquiescenceRisk || "low",
    readingDifficulty: props.readingDifficulty || "easy",
    estimatedCompletionSeconds: props.estimatedCompletionSeconds || 7,
    semanticCluster: props.semanticCluster || `${props.facetId}_cluster`,
    pairedItemId: props.pairedItemId || null,
    forcedChoiceBlock: props.forcedChoiceBlock || null,
    situationalScenarios: props.situationalScenarios || null,
    translationProvenance: DEFAULT_TRANSLATION_PROVENANCE,
    version: "1.0.0-draft"
  };
}

const items = [];

function addFacetItems(facetDef) {
  facetDef.items.forEach((it, idx) => {
    const num = String(idx + 1).padStart(3, '0');
    const id = `${facetDef.prefix}-${num}`;
    items.push(createItem({
      id,
      constructId: facetDef.constructId,
      facetId: facetDef.facetId,
      ...it
    }));
  });
}

// 1. NEED FOR COGNITION
addFacetItems({
  prefix: "CD-ED-NFC",
  constructId: "epistemic_drive",
  facetId: "need_for_cognition",
  items: [
    { text_tr: "Zihinsel çaba gerektiren karmaşık problemleri çözmekten zevk alırım.", text_en: "I really enjoy a task that involves coming up with new solutions to problems.", keying: "POSITIVE" },
    { text_tr: "Fazla düşünmeyi gerektirmeyen basit işleri tercih ederim.", text_en: "I prefer simple to complex problems.", keying: "NEGATIVE" },
    { text_tr: "Yeni ve zorlayıcı bir düşünce tarzı öğrenmek bana çekici gelir.", text_en: "Learning new ways to think doesn't appeal to me very much.", keying: "POSITIVE" },
    { text_tr: "Zihnimi zorlayan bulmacalar, analizler veya stratejik oyunlarla uğraşırım.", text_en: "I spend hours on intellectual puzzles, analyses, or strategy games.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Derin düşünmeyi sadece zorunlu kaldığım zamanlarda yaparım.", text_en: "I only think as hard as I have to.", keying: "NEGATIVE" },
    { text_tr: "Bir konunun ardındaki temel mantığı kavramak bana tatmin verir.", text_en: "Grasping the underlying logic behind a topic gives me satisfaction.", keying: "POSITIVE" },
    { text_tr: "Soyut fikirleri tartışmak yerine gündelik olayları konuşmayı yeğlerim.", text_en: "I prefer discussing daily trivialities rather than abstract concepts.", keying: "NEGATIVE" },
    { text_tr: "Bir problemin birden fazla boyutunu uzun uzun analiz etmekten keyif alırım.", text_en: "I relish dissecting multiple facets of a problem at length.", keying: "POSITIVE" },
    { text_tr: "İş yerinde ezbere dayalı işler yerine yaratıcı düşünme gerektiren projeler ararım.", text_en: "At work, I seek projects demanding creative analysis over routine tasks.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Karar verirken hızlı bir özet yerine konunun tüm derinliğini öğrenmek isterim.", text_en: "When deciding, I want to learn the full depth of a topic rather than a quick summary.", keying: "POSITIVE", itemType: "contextual", context: "decision" }
  ]
});

// 2. NEED FOR COGNITIVE CLOSURE
addFacetItems({
  prefix: "CD-ED-NCC",
  constructId: "epistemic_drive",
  facetId: "need_for_cognitive_closure",
  items: [
    { text_tr: "Belirsiz ve ucu açık durumlardan rahatsız olur, bir an önce net bir sonuca varmak isterim.", text_en: "I feel uncomfortable when a situation is unclear and yearn for a swift conclusion.", keying: "POSITIVE" },
    { text_tr: "Soruların cevapsız kalmasını ve seçeneklerin açık durmasını doğal karşılarım.", text_en: "I find it comfortable to leave questions open without definitive answers.", keying: "NEGATIVE" },
    { text_tr: "Bir konu hakkında kesin bir fikre sahip olmak benim için bir zorunluluktur.", text_en: "Holding a definite, fixed opinion on a subject is a must for me.", keying: "POSITIVE" },
    { text_tr: "Hızlı bir karar vermek için elde az veri olsa bile kesin bir hükme varırım.", text_en: "To reach closure, I jump to a verdict even with sparse data.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Farklı olasılıkları uzun süre askıda tutmakta hiçbir sakınca görmem.", text_en: "I see no drawback in holding multiple possibilities in suspension.", keying: "NEGATIVE" },
    { text_tr: "Planlarımın her ayrıntısının önceden belirlenmiş ve net olmasını isterim.", text_en: "I demand that every aspect of my schedule is set in stone beforehand.", keying: "POSITIVE" },
    { text_tr: "Hayatta gri alanlardan ziyade net siyah-beyaz ayrımları tercih ederim.", text_en: "I favor clean black-and-white lines over ambiguous shades of grey.", keying: "POSITIVE" },
    { text_tr: "Bir kararın sonucunu beklemeden sürekli değiştirmeye açığımdır.", text_en: "I am totally fine changing directions without locking in closure.", keying: "NEGATIVE" },
    { text_tr: "İş projelerinde belirsiz roller ve hedefler beni fazlasıyla gerer.", text_en: "At work, ambiguous roles and vague milestones stress me out severely.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Tatil yaparken her günün saat saat planlanmış olmasını beklerim.", text_en: "On holiday, I expect each hour to be firmly timetabled.", keying: "POSITIVE", itemType: "contextual", context: "general" }
  ]
});

// 3. RATIONAL / ANALYTICAL PROCESSING
addFacetItems({
  prefix: "CD-TS-RAT",
  constructId: "thinking_styles",
  facetId: "rational_analytical_style",
  items: [
    { text_tr: "Karar verirken duygularım yerine mantıksal argümanları ve verileri temel alırım.", text_en: "When making decisions, I rely on logical arguments and data over feelings.", keying: "POSITIVE" },
    { text_tr: "Önemli seçimlerimi hislerime ve içimden gelen sese göre yaparım.", text_en: "I make major choices following my gut instincts and feelings.", keying: "NEGATIVE" },
    { text_tr: "Bir iddiayı kabul etmeden önce arkasındaki nesnel kanıtları incelerim.", text_en: "Before accepting a claim, I inspect the objective evidence supporting it.", keying: "POSITIVE" },
    { text_tr: "Problemleri parçalara ayırarak adım adım mantıksal bir sıra içinde çözerim.", text_en: "I tackle problems by deconstructing them into logical sequences.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Mantık yerine ilk aklıma gelen hissin beni yönlendirmesine izin veririm.", text_en: "I let immediate feelings guide me rather than formal logic.", keying: "NEGATIVE" },
    { text_tr: "Görüşlerimi sağlam gerekçelerle ve tutarlı kanıtlarla savunurum.", text_en: "I defend my viewpoints with coherent rationale and solid proof.", keying: "POSITIVE" },
    { text_tr: "Verilere dayalı analiz yapmak bana yorucu ve gereksiz gelir.", text_en: "Data-driven analysis strikes me as cumbersome and unnecessary.", keying: "NEGATIVE" },
    { text_tr: "Kararlarımın gerekçelerini başkalarına şeffaf bir mantıkla izah edebilirim.", text_en: "I can transparently articulate the logic behind my choices to others.", keying: "POSITIVE" },
    { text_tr: "İş yerinde strateji belirlerken rakamları ve objektif göstergeleri incelerim.", text_en: "At work, I analyze numerical indicators when forming strategies.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Kişisel yatırımlarımda duygusal heyecana kapılmadan hesap yaparım.", text_en: "In personal finances, I calculate without surrendering to emotional hype.", keying: "POSITIVE", itemType: "contextual", context: "decision" }
  ]
});

// 4. INTUITIVE / EXPERIENTIAL PROCESSING
addFacetItems({
  prefix: "CD-TS-INT",
  constructId: "thinking_styles",
  facetId: "intuitive_experiential_style",
  items: [
    { text_tr: "Bir durum hakkında ilk anda içime doğan sezgilerime genellikle güvenirim.", text_en: "I usually trust my immediate gut instincts about a situation.", keying: "POSITIVE" },
    { text_tr: "Sezgilerime güvenmek yerine her şeyi rasyonel kanıtlarla doğrulamayı seçerim.", text_en: "I prefer verifying everything logically rather than trusting instincts.", keying: "NEGATIVE" },
    { text_tr: "İnsanlar hakkında edindiğim ilk izlenim genellikle doğru çıkar.", text_en: "My first impressions of people usually turn out to be accurate.", keying: "POSITIVE" },
    { text_tr: "Karar verirken iç sesimin ne söylediğine kulak veririm.", text_en: "I listen closely to what my inner voice whispers when deciding.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Bir seçimin doğru olduğunu mantığımla açıklayamasam bile kalbimle bilirim.", text_en: "Even if I cannot logically explain a choice, my heart knows it's right.", keying: "POSITIVE" },
    { text_tr: "İçgüdülere göre hareket etmeyi tehlikeli ve sorumsuzca bulurum.", text_en: "I find acting on instinct hazardous and irresponsible.", keying: "NEGATIVE" },
    { text_tr: "Karmaşık bir tercihte içimdeki hisse teslim olmak beni rahatlatır.", text_en: "Trusting my intuitive hunch relieves me in complex choices.", keying: "POSITIVE" },
    { text_tr: "Rakamlar olumlu olsa bile içime sinmeyen bir adımdan uzak dururum.", text_en: "Even if metrics look good, I avoid moves that don't sit right with my gut.", keying: "POSITIVE" },
    { text_tr: "İş görüşmelerinde adayın aurasına ve hissettirdiği enerjiye değer veririm.", text_en: "In interviews, I weigh the candidate's energetic vibe heavily.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Yakın ilişkilerimde sorunları mantıkla değil duygusal rezonansla anlarım.", text_en: "In close relationships, I perceive issues via emotional resonance, not logic.", keying: "POSITIVE", itemType: "contextual", context: "relationship" }
  ]
});

// 5. COGNITIVE FLEXIBILITY
addFacetItems({
  prefix: "CD-CA-CFX",
  constructId: "cognitive_adaptability",
  facetId: "cognitive_flexibility",
  items: [
    { text_tr: "Bir problem karşısında birden fazla farklı ve uygulanabilir çözüm yolu üretebilirim.", text_en: "I can devise multiple different feasible solutions to a problem.", keying: "POSITIVE" },
    { text_tr: "Beklenmeyen bir engelle karşılaştığımda zihnim kilitlenir ve alternatif bulamam.", text_en: "When hitting an obstacle, my mind freezes and fails to spot alternatives.", keying: "NEGATIVE" },
    { text_tr: "Koşullar değiştiğinde stratejimi ve düşünce tarzımı hızla güncellerim.", text_en: "When circumstances pivot, I swiftly adapt my strategy and thinking.", keying: "POSITIVE" },
    { text_tr: "Tek bir çözüm yoluna takılıp kalır, diğer seçenekleri görmezden gelirim.", text_en: "I fixate on a single solution and disregard other avenues.", keying: "NEGATIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Bir konuya başkalarının bakış açısından bakarak yeni fikirler geliştirebilirim.", text_en: "I can view an issue from another's lens to develop novel ideas.", keying: "POSITIVE" },
    { text_tr: "Eski alışkanlıklarımı yeni yöntemlerle değiştirmekte büyük zorluk yaşarım.", text_en: "I struggle immensely to replace legacy routines with new approaches.", keying: "NEGATIVE" },
    { text_tr: "Planlarım suya düştüğünde alternatif bir B planını hızla devreye sokarım.", text_en: "When plans collapse, I launch a contingency Plan B smoothly.", keying: "POSITIVE" },
    { text_tr: "Yeni bir fikir mevcut inançlarımla çeliştiğinde hemen reddederim.", text_en: "If a fresh idea clashes with my existing beliefs, I dismiss it instantly.", keying: "NEGATIVE" },
    { text_tr: "İş yerinde değişen önceliklere şikayet etmeden hızla uyum sağlarım.", text_en: "At work, I adjust swiftly to shifting priorities without grumbling.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Stres anlarında bile olaylara mizah ve esneklikle yaklaşabilirim.", text_en: "Even under duress, I can approach situations with humor and elasticity.", keying: "POSITIVE", itemType: "contextual", context: "stress" }
  ]
});

// 6. INTOLERANCE OF UNCERTAINTY
addFacetItems({
  prefix: "CD-CA-IOU",
  constructId: "cognitive_adaptability",
  facetId: "intolerance_of_uncertainty",
  items: [
    { text_tr: "Gelecekte ne olacağını tam olarak bilememek beni derinden huzursuz eder.", text_en: "Not knowing exactly what the future holds unsettlingly disturbs me.", keying: "POSITIVE" },
    { text_tr: "Hayatın belirsizliklerle dolu olmasını doğal ve kabul edilebilir bulurum.", text_en: "I find life's inherent ambiguities natural and acceptable.", keying: "NEGATIVE" },
    { text_tr: "Bir olayın sonucunun belirsiz kalması beni felç eder ve bekleyemem.", text_en: "Unresolved outcomes paralyze me; I cannot stand the wait.", keying: "POSITIVE" },
    { text_tr: "Olası riskleri önceden yüzde yüz kestiremediğim durumlarda kaygı duyarım.", text_en: "I feel anxious when I cannot foresee risks with absolute certainty.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Bilinmezlik karşısında sakin kalır ve olayları akışına bırakabilirim.", text_en: "I remain composed before the unknown and let events flow.", keying: "NEGATIVE" },
    { text_tr: "Beklenmeyen sürprizler benim için keyif değil tehdit anlamına gelir.", text_en: "Unheralded surprises mean threat rather than delight to me.", keying: "POSITIVE" },
    { text_tr: "Her şeyin kontrolüm altında olduğunu bilmeye aşırı ihtiyaç duyarım.", text_en: "I possess an acute need to know everything rests under my control.", keying: "POSITIVE" },
    { text_tr: "Sonucu kesin olmayan yeni bir maceraya atılmaktan çekinmem.", text_en: "I don't hesitate to embark on adventures with uncertain conclusions.", keying: "NEGATIVE" },
    { text_tr: "İş yerinde yönergelerin net olmadığı görevleri yürütürken aşırı gerilirim.", text_en: "At work, undertaking tasks lacking crisp directives stresses me severely.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "İlişkilerimde karşımdakinin hislerinden emin olamadığımda kaygıya kapılırım.", text_en: "In relationships, lack of clarity about my partner's feelings stirs anxiety.", keying: "POSITIVE", itemType: "contextual", context: "relationship" }
  ]
});

// 7. RUMINATION - BROODING
addFacetItems({
  prefix: "CD-CA-RUM",
  constructId: "cognitive_adaptability",
  facetId: "rumination_brooding",
  items: [
    { text_tr: "Yaptığım hataları veya olumsuz olayları zihnimde defalarca tekrar tekrar oynatırım.", text_en: "I replay past errors and negative events over and over in my head.", keying: "POSITIVE" },
    { text_tr: "Bir aksilik yaşandığında geçmişe takılmak yerine ileriye bakarım.", text_en: "When a mishap strikes, I look ahead rather than dwelling on the past.", keying: "NEGATIVE" },
    { text_tr: "'Neden hep benim başıma geliyor?' sorusunu kendime sormaktan vazgeçemem.", text_en: "I keep asking myself 'Why does this always happen to me?'.", keying: "POSITIVE" },
    { text_tr: "Geçmişte söylediğim utanç verici bir cümleyi günlerce kafamda kurcalarım.", text_en: "I chew on an embarrassing phrase I uttered in the past for days.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Değiştiremeyeceğim geçmiş olayları kolayca geride bırakabilirim.", text_en: "I can easily let go of unalterable past events.", keying: "NEGATIVE" },
    { text_tr: "Bir tartışmadan sonra söyleyebileceğim alternatif cevapları saatlerce düşünürüm.", text_en: "Hours after a debate, I brood over replies I could have voiced.", keying: "POSITIVE" },
    { text_tr: "Zihnim sürekli kusurlarımı ve eksiklerimi listeleyen bir döngüye girer.", text_en: "My mind enters loops that constantly catalogue my shortcomings.", keying: "POSITIVE" },
    { text_tr: "Kendimi geçmiş hatalarım için hırpalamaktan kaçınırım.", text_en: "I avoid tormenting myself over historical missteps.", keying: "NEGATIVE" },
    { text_tr: "İş yerinde kaçırdığım bir fırsatı haftalarca aklımdan çıkaramam.", text_en: "At work, I cannot expunge a missed opportunity from my thoughts for weeks.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Gece yatağa yattığımda geçmiş pişmanlıklarım yüzünden uyuyamam.", text_en: "Lying in bed at night, past regrets keep me awake.", keying: "POSITIVE", itemType: "contextual", context: "general" }
  ]
});

// 8. MAXIMIZING TENDENCY
addFacetItems({
  prefix: "CD-DO-MAX",
  constructId: "decision_orientation",
  facetId: "maximizing_tendency",
  items: [
    { text_tr: "Bir karar verirken mümkün olan bütün alternatifleri tek tek inceleyip en iyisini bulmaya çalışırım.", text_en: "When deciding, I try to scrutinize every alternative to find the absolute best.", keying: "POSITIVE" },
    { text_tr: "İhtiyacımı karşılayan makul bir seçenek bulduğumda hemen karar veririm.", text_en: "Once I locate a decent option meeting my needs, I settle immediately.", keying: "NEGATIVE" },
    { text_tr: "Basit bir ürün alırken bile saatlerce araştırma ve karşılaştırma yaparım.", text_en: "Even for simple purchases, I spend hours comparing choices.", keying: "POSITIVE" },
    { text_tr: "Daha iyi bir seçenek olabileceği şüphesiyle karar vermekte zorlanırım.", text_en: "The suspicion of a superior alternative hinders my decision-making.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "'Yeterince iyi' olan bir seçenek benim için fazlasıyla tatmin edicidir.", text_en: "An option that is 'good enough' is thoroughly satisfying for me.", keying: "NEGATIVE" },
    { text_tr: "Bir şey satın aldıktan sonra daha iyi bir fırsat kaçırdım mı diye düşünürüm.", text_en: "After a purchase, I wonder whether I missed a superior deal.", keying: "POSITIVE" },
    { text_tr: "Seçenekleri tüketene kadar araştırmaktan vazgeçmem.", text_en: "I refuse to stop investigating until all options are exhausted.", keying: "POSITIVE" },
    { text_tr: "Hızlıca tatmin edici bir seçim yapıp hayatıma devam ederim.", text_en: "I make a satisfactory choice swiftly and move along.", keying: "NEGATIVE" },
    { text_tr: "Kariyer seçimlerimde mutlak en kusursuz pozisyonu ararım.", text_en: "In career pathways, I pursue the single most flawless position.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Bir restoranda yemek seçerken menünün tamamını incelemeden sipariş veremem.", text_en: "At a diner, I cannot order without auditing the entire menu.", keying: "POSITIVE", itemType: "contextual", context: "general" }
  ]
});

// 9. DECISION AVOIDANCE / PROCRASTINATION
addFacetItems({
  prefix: "CD-DO-AVO",
  constructId: "decision_orientation",
  facetId: "decision_avoidance_procrastination",
  items: [
    { text_tr: "Önemli kararlar almam gerektiğinde kararı son ana kadar ertelerim.", text_en: "When faced with vital choices, I postpone deciding until the last moment.", keying: "POSITIVE" },
    { text_tr: "Zor kararları ertelemeden vaktinde ve kararlılıkla alırım.", text_en: "I make arduous choices promptly and resolutely without delay.", keying: "NEGATIVE" },
    { text_tr: "Seçim yapmanın getirdiği sorumluluktan kaçmak için kararı başkalarına devrederim.", text_en: "To escape accountability, I delegate decisions to other people.", keying: "POSITIVE" },
    { text_tr: "Karar verme anı yaklaştıkça dikkatimi başka önemsiz şeylere veririm.", text_en: "As decision deadlines loom, I divert focus to trivia.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Tereddüt etmeden ve gecikmeden harekete geçebilirim.", text_en: "I can proceed with action without wavering or dragging my feet.", keying: "NEGATIVE" },
    { text_tr: "Yanlış karar vermekten o kadar korkarım ki hiçbir adım atamam.", text_en: "I fear making a misstep so deeply that I become completely stuck.", keying: "POSITIVE" },
    { text_tr: "Zorlayıcı meselelerin kendiliğinden çözülmesini beklerim.", text_en: "I wait for prickly issues to dissolve on their own.", keying: "POSITIVE" },
    { text_tr: "Kararsızlık içinde kıvranmak yerine riski göze alıp karar veririm.", text_en: "Rather than writhing in doubt, I take the risk and decide.", keying: "NEGATIVE" },
    { text_tr: "İş yerinde onay vermem gereken konuları masamda bekletirim.", text_en: "At work, I let files needing my sign-off linger on my desk.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "İlişkilerimde net bir duruş sergilemek yerine belirsiz cevaplar veririm.", text_en: "In relationships, I issue vague non-committal replies rather than stances.", keying: "POSITIVE", itemType: "contextual", context: "relationship" }
  ]
});

module.exports = {
  batchName: "BATCH_D_COGNITION_DECISION",
  items
};
