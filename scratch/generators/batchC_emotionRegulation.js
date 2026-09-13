// BATCH C: EMOTION & AFFECT REGULATION (10 Facets)
// 10 candidate items per facet = 100 items

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
    domainId: "emotion_regulation",
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
    sourceIds: props.sourceIds || ["src_gross_john_2003"],
    instrumentIds: props.instrumentIds || ["inst_erq"],
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

// 1. COGNITIVE REAPPRAISAL
addFacetItems({
  prefix: "ER-ST-REA",
  constructId: "emotion_regulation_strategies",
  facetId: "cognitive_reappraisal",
  items: [
    { text_tr: "Daha az olumsuz hissetmek istediğimde duruma bakış açımı değiştiririm.", text_en: "When I want to feel less negative emotion, I change the way I'm thinking about it.", keying: "POSITIVE" },
    { text_tr: "Bir olumsuzluk yaşadığımda onu farklı bir gözle yorumlamakta zorlanırım.", text_en: "When facing a negative event, I struggle to interpret it through a fresh lens.", keying: "NEGATIVE" },
    { text_tr: "Zor bir olayla karşılaştığımda sakin kalabilmek için olayın olumlu yönlerini ararım.", text_en: "When faced with a stressful situation, I make myself think about it in a way that helps me stay calm.", keying: "POSITIVE" },
    { text_tr: "Duygularımı kontrol etmek için olaylar hakkındaki düşüncelerimi yeniden çerçevelerim.", text_en: "I control my emotions by changing the way I think about the situation.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Bir aksilik olduğunda aklıma ilk gelen karanlık yoruma saplanıp kalırım.", text_en: "When a mishap happens, I remain stuck in the first dark interpretation that strikes me.", keying: "NEGATIVE" },
    { text_tr: "Öfke veya hayal kırıklığı hissettiğimde durumu daha geniş bir perspektiften tartarim.", text_en: "When feeling anger, I weigh the context from a wider standpoint.", keying: "POSITIVE" },
    { text_tr: "Olaylara olumlu bakmaya çalışmak bana sahte ve yararsız gelir.", text_en: "Trying to look positively at events feels fake and unhelpful.", keying: "NEGATIVE" },
    { text_tr: "Stresli durumlarda zihnimdeki felaket senaryolarını mantıklı kanıtlarla çürütürüm.", text_en: "In stressful scenarios, I dispute catastrophic thoughts with logical evidence.", keying: "POSITIVE" },
    { text_tr: "İş yerinde haksız bir eleştiri aldığımda bunu öğrenme fırsatına dönüştürürüm.", text_en: "At work, when receiving unfair critique, I reframe it as a learning opportunity.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "İlişkimde anlaşmazlık olduğunda karşı tarafın niyetini en kötü ihtimalle yorumlarım.", text_en: "During relationship disputes, I interpret my partner's intent in the worst possible light.", keying: "NEGATIVE", itemType: "contextual", context: "relationship" }
  ]
});

// 2. EXPRESSIVE SUPPRESSION
addFacetItems({
  prefix: "ER-ST-SUP",
  constructId: "emotion_regulation_strategies",
  facetId: "expressive_suppression",
  items: [
    { text_tr: "Olumsuz duygular hissettiğimde bunları dışarıya yansıtmamaya ve gizlemeye çalışırım.", text_en: "When I am feeling negative emotions, I make sure not to express them.", keying: "POSITIVE" },
    { text_tr: "Ne hissediyorsam yüzümden ve ses tonumdan açıkça anlaşılır.", text_en: "Whatever I feel is readily apparent from my face and tone.", keying: "NEGATIVE" },
    { text_tr: "Duygularımı başkalarına göstermeyip içimde tutmayı tercih ederim.", text_en: "I keep my emotions to myself rather than showing them to others.", keying: "POSITIVE" },
    { text_tr: "Üzüntümü veya kırgınlığımı kimse fark etmesin diye maske takarım.", text_en: "I wear a mask so no one notices my sadness or hurt.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Duygusal anlarımda içimi dökmekten ve ağlamaktan çekinmem.", text_en: "In emotional moments, I don't hesitate to pour out feelings and weep.", keying: "NEGATIVE" },
    { text_tr: "İçimde fırtınalar kopsa bile dışarıya karşı tamamen duygusuz görünürüm.", text_en: "Even if storms rage inside, I look entirely impassive externally.", keying: "POSITIVE" },
    { text_tr: "İçimdeki hisleri saklamaya çalışmak beni fazlasıyla yorar.", text_en: "Attempting to bottle up internal feelings exhausts me heavily.", keying: "NEGATIVE" },
    { text_tr: "Öfkemi veya kırgınlığımı dışa vurmanın zayıflık olduğunu düşünürüm.", text_en: "I view voicing anger or vulnerability as an exhibition of weakness.", keying: "POSITIVE" },
    { text_tr: "İş ortamında kişisel kırgınlıklarımı tamamen profesyonel bir maskenin arkasına gizlerim.", text_en: "In the office, I conceal personal grievances behind a professional facade.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Ailemle konuşurken hissettiğim neşeyi veya üzüntüyü filtrelemeden paylaşırım.", text_en: "When talking with family, I share joy or grief without any filtering.", keying: "NEGATIVE", itemType: "contextual", context: "family" }
  ]
});

// 3. EMOTIONAL REACTIVITY
addFacetItems({
  prefix: "ER-AD-REA",
  constructId: "affective_dynamics",
  facetId: "emotional_reactivity",
  items: [
    { text_tr: "Çevremdeki küçük olaylara veya sözlere karşı çok hızlı ve yoğun tepkiler veririm.", text_en: "I react quickly and intensely to minor events or words around me.", keying: "POSITIVE" },
    { text_tr: "Olaylar karşısında duygusal olarak hemen alevlenmem, sakinliğimi korurum.", text_en: "I don't flare up emotionally at events; I maintain my balance.", keying: "NEGATIVE" },
    { text_tr: "Beklenmeyen bir durumda kalbimin hızla çarptığını ve coştuğumu hissederim.", text_en: "In unexpected situations, I feel my heart pounding and emotions surging.", keying: "POSITIVE" },
    { text_tr: "Ufak aksilikler karşısında dahi duygusal olarak kolayca sarsılırım.", text_en: "I am emotionally shaken easily even by slight hitches.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Genellikle tepkilerim ölçülüdür, ani duygusal dalgalanmalar yaşamam.", text_en: "My reactions are generally measured; I don't experience abrupt shifts.", keying: "NEGATIVE" },
    { text_tr: "Eleştiri duyduğum anda içimde güçlü bir duygusal dalga kabarır.", text_en: "The second I hear criticism, a strong emotional surge rises in me.", keying: "POSITIVE" },
    { text_tr: "Başkalarını heyecanlandıran haberler beni pek sarsmaz.", text_en: "News that excites others rarely shakes my equilibrium.", keying: "NEGATIVE" },
    { text_tr: "Film veya müzik dinlerken duygularım ani iniş çıkışlar yaşar.", text_en: "While listening to music or films, my emotions undergo sudden swings.", keying: "POSITIVE" },
    { text_tr: "İş yerinde acil bir kriz çıktığında hemen panik duygusu kaplar.", text_en: "When an urgent workplace crisis erupts, panic immediately envelops me.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Trafikte biri yolumu kestiğinde anlık bir öfke patlaması yaşarım.", text_en: "When someone cuts me off in traffic, I experience an instantaneous flash of rage.", keying: "POSITIVE", itemType: "contextual", context: "stress" }
  ]
});

// 4. EMOTIONAL RECOVERY
addFacetItems({
  prefix: "ER-AD-REC",
  constructId: "affective_dynamics",
  facetId: "emotional_recovery",
  items: [
    { text_tr: "Beni üzen veya öfkelendiren bir durumdan sonra hızla normal halime dönerim.", text_en: "After an upsetting or infuriating event, I quickly return to baseline.", keying: "POSITIVE" },
    { text_tr: "Bir tartışmanın olumsuz etkisinden kurtulmam saatler hatta günler sürer.", text_en: "Recovering from an argument's emotional sting takes me hours or days.", keying: "NEGATIVE" },
    { text_tr: "Moralim bozulduğunda toparlanıp işime odaklanmakta zorlanmam.", text_en: "When downcast, I bounce back and focus on tasks without delay.", keying: "POSITIVE" },
    { text_tr: "Olumsuz bir duyguya kapıldığımda o histen kolay kolay çıkamam.", text_en: "Once negative emotion grips me, I struggle to shake it off.", keying: "NEGATIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Yaşanan kırgınlıkların ardından zihinsel dengemi çabucak yeniden kurarım.", text_en: "Following grievances, I rapidly reconstruct my mental equilibrium.", keying: "POSITIVE" },
    { text_tr: "Kötü bir haber aldığımda bütün günüm felç olur.", text_en: "Receiving bad news paralyzes my entire day.", keying: "NEGATIVE" },
    { text_tr: "Stres yaratan durum sona erer ermez rahatlarım.", text_en: "As soon as the stressor terminates, I relax promptly.", keying: "POSITIVE" },
    { text_tr: "Geçmiş bir olumsuzluğu gün boyu zihnimde taşıyıp dururum.", text_en: "I drag a past grievance through my mind all day long.", keying: "NEGATIVE" },
    { text_tr: "İş yerinde gergin bir toplantıdan sonra sonraki göreve hızla adapte olurum.", text_en: "Following a tense meeting, I pivot smoothly to the next task.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Yakın arkadaşımla sürtüşme yaşadığımda uzun süre içime kapanırım.", text_en: "After friction with a friend, I remain withdrawn for a long period.", keying: "NEGATIVE", itemType: "contextual", context: "relationship" }
  ]
});

// 5. TRAIT POSITIVE AFFECT
addFacetItems({
  prefix: "ER-AD-TPA",
  constructId: "affective_dynamics",
  facetId: "trait_positive_affect",
  items: [
    { text_tr: "Günlük hayatımda kendimi genellikle hevesli, canlı ve kararlı hissederim.", text_en: "In my daily routine, I generally feel enthusiastic, alert, and determined.", keying: "POSITIVE" },
    { text_tr: "Kendimi heyecanlı veya ilham dolu hissettiğim anlar oldukça azdır.", text_en: "Moments where I feel thrilled or inspired are quite rare.", keying: "NEGATIVE" },
    { text_tr: "Güne başlarken içimde bir merak ve canlılık uyanır.", text_en: "Starting the day, a sense of curiosity and vitality wakes in me.", keying: "POSITIVE" },
    { text_tr: "Etrafımdaki gelişmelere karşı coşku ve sevinç duyarım.", text_en: "I feel zest and joy toward developments around me.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Hayata karşı genel bir duyarsızlık veya kayıtsızlık içindeyimdir.", text_en: "I live in a state of general numbness or apathy toward life.", keying: "NEGATIVE" },
    { text_tr: "Zorlu görevlere başlarken içsel bir motivasyon ve enerji hissederim.", text_en: "I feel internal drive and vigor when tackling challenging jobs.", keying: "POSITIVE" },
    { text_tr: "Kendimi güçlü ve amaç sahibi hissederim.", text_en: "I feel strong and purposeful.", keying: "POSITIVE" },
    { text_tr: "Küçük şeylerden sevinç duymak benim için zordur.", text_en: "Taking joy in small moments is difficult for me.", keying: "NEGATIVE" },
    { text_tr: "İş yerinde yeni projeleri heyecan verici bir fırsat olarak karşılarım.", text_en: "At work, I greet new projects as exhilarating opportunities.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Sosyal buluşmalarda içten bir kahkaha atmaktan keyif alırım.", text_en: "In social meetups, I relish having a genuine good laugh.", keying: "POSITIVE", itemType: "contextual", context: "social" }
  ]
});

// 6. TRAIT NEGATIVE AFFECT
addFacetItems({
  prefix: "ER-AD-TNA",
  constructId: "affective_dynamics",
  facetId: "trait_negative_affect",
  items: [
    { text_tr: "Kendimi sıklıkla gergin, huzursuz veya tedirgin hissederim.", text_en: "I frequently feel distressed, nervous, or jittery.", keying: "POSITIVE" },
    { text_tr: "İç dünyamda genellikle derin bir dinginlik ve huzur hakimdir.", text_en: "In my inner world, a deep calmness and tranquility generally rules.", keying: "NEGATIVE" },
    { text_tr: "Ortada somut bir neden yokken bile içimde bir sıkıntı duyarım.", text_en: "Even with no concrete reason, I feel an internal gloom.", keying: "POSITIVE" },
    { text_tr: "Kolayca suçluluk, utanç veya yetersizlik hissine kapılırım.", text_en: "I easily lapse into feelings of guilt, shame, or inadequacy.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Ruh halim çoğunlukla neşeli ve tasasızdır.", text_en: "My mood is mostly bright and untroubled.", keying: "NEGATIVE" },
    { text_tr: "Günün birçok anında içsel bir baskı ve boğulma hissi yaşarım.", text_en: "At many points in the day, I experience internal oppression.", keying: "POSITIVE" },
    { text_tr: "Ufak tefek sorunlar canımı sıkmaz, gülüp geçerim.", text_en: "Petty problems don't bother me; I laugh them off.", keying: "NEGATIVE" },
    { text_tr: "Kendimi sıklıkla çaresiz veya karamsar düşüncelere teslim olmuş bulurum.", text_en: "I frequently find myself surrendered to hopeless or bleak thoughts.", keying: "POSITIVE" },
    { text_tr: "İş yerinde mesai boyunca içimde bir gerginlik taşırım.", text_en: "At work, I carry an underlying tension throughout my shifts.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Yalnız kaldığımda içimdeki huzursuzluk daha da belirginleşir.", text_en: "When alone, my internal unease becomes even more pronounced.", keying: "POSITIVE", itemType: "contextual", context: "general" }
  ]
});

// 7. DISTRESS TOLERANCE
addFacetItems({
  prefix: "ER-DM-DTO",
  constructId: "distress_management",
  facetId: "distress_tolerance",
  items: [
    { text_tr: "Yoğun bir duygusal sıkıntı yaşasam bile bu hisse katlanabilirim.", text_en: "Even during intense emotional distress, I can endure the feeling.", keying: "POSITIVE" },
    { text_tr: "Canım sıkıldığında bu duruma bir dakika bile dayanamayacak gibi hissederim.", text_en: "When feeling distressed, I feel I cannot bear it for another minute.", keying: "NEGATIVE" },
    { text_tr: "Olumsuz duyguların geçici olduğunu bilerek sabırla bekleyebilirim.", text_en: "Knowing negative emotions are temporary, I can wait them out patiently.", keying: "POSITIVE" },
    { text_tr: "Sıkıntı hissettiğimde bundan kurtulmak için hemen fevri eylemlere başvururum.", text_en: "When distressed, I resort to rash actions right away to escape.", keying: "NEGATIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Zorlayıcı hisler karşısında paniklemeden durabilme gücüne sahibimdir.", text_en: "I hold the stamina to sit with agonizing feelings without panicking.", keying: "POSITIVE" },
    { text_tr: "Duygusal acı hissettiğimde aklımı kaçıracakmış gibi olurum.", text_en: "When experiencing emotional pain, I feel as if I am losing my mind.", keying: "NEGATIVE" },
    { text_tr: "Keyifsiz ve gergin anları hayatın doğal bir bedeli olarak kabul edebilirim.", text_en: "I can accept sour and tense moments as a natural cost of living.", keying: "POSITIVE" },
    { text_tr: "En ufak bir duygusal huzursuzluk bile beni darmadağın etmeye yeter.", text_en: "Even slight emotional discomfort is enough to shatter my composure.", keying: "NEGATIVE" },
    { text_tr: "İş yerinde ağır bir hayal kırıklığı yaşadığımda sakin kalarak çalışmaya devam ederim.", text_en: "At work, facing a heavy setback, I remain grounded and keep working.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Ayrılık veya kayıp anlarında hissettiğim boşluğa dayanmakta zorlanmam.", text_en: "In moments of loss, I do not struggle to endure the inner void.", keying: "POSITIVE", itemType: "contextual", context: "relationship" }
  ]
});

// 8. EXPERIENTIAL AVOIDANCE
addFacetItems({
  prefix: "ER-DM-EAV",
  constructId: "distress_management",
  facetId: "experiential_avoidance",
  items: [
    { text_tr: "Acı veren düşünce ve anılardan kaçmak için kendimi sürekli meşgul ederim.", text_en: "I keep myself constantly busy to evade painful memories and thoughts.", keying: "POSITIVE" },
    { text_tr: "Zorlayıcı duygularımdan kaçmak yerine onları dikkatle dinlerim.", text_en: "Instead of fleeing from challenging emotions, I listen to them mindfully.", keying: "NEGATIVE" },
    { text_tr: "Üzüntü veya korku hissettiğimde bunu bastırmak için dikkatimi dağıtırım.", text_en: "When sorrow or dread rises, I distract myself to numb it.", keying: "POSITIVE" },
    { text_tr: "İçimdeki olumsuz hislerle yüzleşmekten köşe bucak kaçarım.", text_en: "I run away from confronting the uncomfortable feelings inside me.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Rahatsız edici duygularımı yargılamadan hissetmeye izin veririm.", text_en: "I permit myself to experience disturbing feelings without judgment.", keying: "NEGATIVE" },
    { text_tr: "Beni kaygılandıran ortamlardan sırf o hissi yaşamamak için kaçınırım.", text_en: "I avoid anxiety-provoking venues solely to escape having that feeling.", keying: "POSITIVE" },
    { text_tr: "Duygusal acı çekmekten o kadar korkarım ki derin bağlar kuramam.", text_en: "I fear emotional heartache so intensely that I shun intimate bonds.", keying: "POSITIVE" },
    { text_tr: "Karanlık düşüncelerim olsa bile onları bastırmadan kabul edebilirim.", text_en: "Even if I have dark thoughts, I accept them without repressing.", keying: "NEGATIVE" },
    { text_tr: "İş yerinde zor bir konuşma yapmam gerektiğinde konuyu günlerce geçiştiririm.", text_en: "At work, if a difficult chat is due, I evade it for days.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Stresli dönemlerde saatlerce ekrana bakarak hislerimi uyuştururum.", text_en: "During stressful periods, I numb my feelings staring at screens for hours.", keying: "POSITIVE", itemType: "contextual", context: "stress" }
  ]
});

// 9. SHAME PRONENESS
addFacetItems({
  prefix: "ER-SC-SHA",
  constructId: "self_conscious_emotions",
  facetId: "shame_proneness",
  items: [
    { text_tr: "Bir hata yaptığımda kendimi bütünüyle küçük, kusurlu ve değersiz hissederim.", text_en: "When I err, I feel entirely small, flawed, and worthless as a person.", keying: "POSITIVE" },
    { text_tr: "Bir yanlış yaptığımda bunu tüm kişiliğimin yetersizliği olarak görmem.", text_en: "When I make a blunder, I don't treat it as total personal inadequacy.", keying: "NEGATIVE" },
    { text_tr: "Topluluk içinde komik veya beceriksiz duruma düştüğümde yerin dibine girmek isterim.", text_en: "When acting clumsy in public, I wish the ground would swallow me whole.", keying: "POSITIVE" },
    { text_tr: "Eleştirildiğimde kendimden utanır ve herkesten saklanmak isterim.", text_en: "When criticized, I feel ashamed of myself and yearn to hide.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Hata yapmış olsam bile başımı dik tutmaya devam ederim.", text_en: "Even after a slip, I keep my head held high.", keying: "NEGATIVE" },
    { text_tr: "Kusurlarımın başkaları tarafından fark edilmesi bende derin bir utanç uyandırır.", text_en: "Having my flaws exposed triggers deep inner humiliation.", keying: "POSITIVE" },
    { text_tr: "Bir başarısızlık yaşadığımda kendimi kusurlu bir insan olarak etiketlemem.", text_en: "When suffering a defeat, I do not brand myself as a defective person.", keying: "NEGATIVE" },
    { text_tr: "Yanlış bir söz söylediğimde günlerce bunu düşünüp kendimden nefret ederim.", text_en: "If I utter the wrong word, I replay it for days, loathing myself.", keying: "POSITIVE" },
    { text_tr: "İş sunumunda takıldığımda meslektaşlarımın gözünde küçüldüğümü düşünürüm.", text_en: "Stumbling in a work presentation, I feel shrunken in colleagues' eyes.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Sosyal bir gaf yaptığımda durumu hafif bir tebessümle geçiştirebilirim.", text_en: "When committing a social faux pas, I can move on with a gentle smile.", keying: "NEGATIVE", itemType: "contextual", context: "social" }
  ]
});

// 10. GUILT PRONENESS
addFacetItems({
  prefix: "ER-SC-GUI",
  constructId: "self_conscious_emotions",
  facetId: "guilt_proneness",
  items: [
    { text_tr: "Birine haksızlık yaptığımda durumu düzeltmek ve telafi etmek için hemen harekete geçerim.", text_en: "When I wrong someone, I act immediately to rectify and make amends.", keying: "POSITIVE" },
    { text_tr: "Birisini incitsem bile vicdan azabı çekmem, üstünde durmam.", text_en: "Even if I hurt someone, I feel no remorse and brush it aside.", keying: "NEGATIVE" },
    { text_tr: "Verdiğim bir sözü tutamadığımda derin bir vicdani sorumluluk hissederim.", text_en: "When I fail a promise, I feel a profound ethical responsibility.", keying: "POSITIVE" },
    { text_tr: "Hatalı bir eylemimden sonra karşımdakinden içtenlikle özür dilerim.", text_en: "After an erroneous act, I sincerely apologize to the injured party.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Birine zarar verdiğimde telafi etmek yerine görmezden gelmeyi seçerim.", text_en: "When I cause harm, I prefer looking away rather than amending it.", keying: "NEGATIVE" },
    { text_tr: "Yaptığım yanlış bir davranışın sonuçlarını onarmak için çaba harcarım.", text_en: "I invest effort to repair the fallout of my improper actions.", keying: "POSITIVE" },
    { text_tr: "Kendi hatam yüzünden başkası zor durumda kaldığında içim sızlar.", text_en: "When someone struggles due to my error, my conscience aches.", keying: "POSITIVE" },
    { text_tr: "Kırdığım birinin gönlünü almadan içim asla rahat etmez.", text_en: "My heart does not rest until I soothe someone I have hurt.", keying: "POSITIVE" },
    { text_tr: "İş yerinde bir ekip arkadaşımın işini aksattığımda gecikmeyi telafi ederim.", text_en: "At work, if I delay a teammate's job, I make up for the backlog.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Aileme karşı haksız bir tepki verdiğimde hemen gidip sarılarak özür dilerim.", text_en: "When reacting unfairly to family, I quickly hug and apologize.", keying: "POSITIVE", itemType: "contextual", context: "family" }
  ]
});

module.exports = {
  batchName: "BATCH_C_EMOTION_REGULATION",
  items
};
