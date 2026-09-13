// BATCH F: MOTIVATION, NEEDS & VALUES (9 Facets)
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
    domainId: "motivation_values",
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
    sourceIds: props.sourceIds || ["src_ryan_deci_2000"],
    instrumentIds: props.instrumentIds || ["inst_bpnsfs"],
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

// 1. AUTONOMY NEED
addFacetItems({
  prefix: "MV-BN-AUT",
  constructId: "basic_psychological_needs",
  facetId: "autonomy_need",
  items: [
    { text_tr: "Günlük kararlarımı kendi özgür irademle ve seçimlerimle aldığımı hissederim.", text_en: "I feel that my decisions reflect what I really want.", keying: "POSITIVE" },
    { text_tr: "Hayatımı başkalarının dayattığı kurallara göre yaşamak zorunda hissediyorum.", text_en: "I feel forced to follow rules dictated by others.", keying: "NEGATIVE" },
    { text_tr: "Yaptığım işlerde kendi kararlarımı uygulama özgürlüğüne sahip olmak benim için esastır.", text_en: "Having liberty to implement my own choices in my tasks is essential.", keying: "POSITIVE" },
    { text_tr: "Başkalarının baskısıyla istemediğim şeyleri yapmak zorunda kalırım.", text_en: "I am pressured into doing things I do not endorse.", keying: "NEGATIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Kişisel tercihlerimin arkasında içtenlikle durabilirim.", text_en: "I can genuinely stand behind my personal preferences.", keying: "POSITIVE" },
    { text_tr: "Kendi hayatımın kontrolünün elimden alındığını hissederim.", text_en: "I feel control over my life has been stripped from me.", keying: "NEGATIVE" },
    { text_tr: "Fikirlerimi özgürce dile getirebildiğim ortamlarda nefes alırım.", text_en: "I thrive in atmospheres where I can freely voice my views.", keying: "POSITIVE" },
    { text_tr: "Sürekli birilerinin gözetimi altında yaşamak beni tüketir.", text_en: "Living under constant surveillance exhausts me.", keying: "POSITIVE" },
    { text_tr: "İş yerinde görevlerimi nasıl yapacağımı kendim belirlerim.", text_en: "At work, I determine for myself how to execute my duties.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Ailem hayatımla ilgili her karara müdahale eder ve beni kısıtlar.", text_en: "My family intervenes in every move, constricting my choices.", keying: "NEGATIVE", itemType: "contextual", context: "family" }
  ]
});

// 2. COMPETENCE NEED
addFacetItems({
  prefix: "MV-BN-COM",
  constructId: "basic_psychological_needs",
  facetId: "competence_need",
  items: [
    { text_tr: "Uğraştığım alanlarda yetkinleştiğimi ve ustalık kazandığımı hissederim.", text_en: "I feel confident that I can do things well and achieve mastery.", keying: "POSITIVE" },
    { text_tr: "Çoğu zaman beceriksiz ve yetersiz olduğum hissine kapılırım.", text_en: "I frequently feel inept and incapable in what I undertake.", keying: "NEGATIVE" },
    { text_tr: "Yeni beceriler öğrenip zorlukların üstesinden geldikçe güçlenirim.", text_en: "I grow stronger as I learn new skills and conquer challenges.", keying: "POSITIVE" },
    { text_tr: "Yaptığım işlerde başarılı sonuçlar üretmekte zorlanırım.", text_en: "I struggle to produce successful outcomes in my endeavors.", keying: "NEGATIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Yeteneklerimi gösterebileceğim fırsatlara sahip olduğumu bilirim.", text_en: "I have opportunities to demonstrate how capable I am.", keying: "POSITIVE" },
    { text_tr: "Zor bir görev verildiğinde çuvallayacağımdan korkarım.", text_en: "When given a tough task, I dread that I will bungle it.", keying: "NEGATIVE" },
    { text_tr: "Çabalarımın takdir edilebilir somut sonuçlar doğurduğunu görürüm.", text_en: "I see my efforts yield tangible, commendable results.", keying: "POSITIVE" },
    { text_tr: "Gelişmek için ne kadar çabalasam da yerimde saydığımı düşünürüm.", text_en: "No matter how I strive, I feel I am treading water.", keying: "NEGATIVE" },
    { text_tr: "İş yerinde mesleki uzmanlığımla karmaşık sorunları çözerim.", text_en: "At work, I resolve complex issues via my professional expertise.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Yeni bir teknoloji veya yöntemi öğrenirken çabucak pes ederim.", text_en: "I give up quickly when attempting to master new tech or tools.", keying: "NEGATIVE", itemType: "contextual", context: "general" }
  ]
});

// 3. RELATEDNESS NEED
addFacetItems({
  prefix: "MV-BN-REL",
  constructId: "basic_psychological_needs",
  facetId: "relatedness_need",
  items: [
    { text_tr: "Beni gerçekten önemseyen ve seven insanlarla çevrili olduğumu hissederim.", text_en: "I feel close and connected with people who are important to me.", keying: "POSITIVE" },
    { text_tr: "Kendimi sıklıkla dışlanmış, yabancılaşmış ve yapayalnız hissederim.", text_en: "I frequently feel isolated, alienated, and thoroughly alone.", keying: "NEGATIVE" },
    { text_tr: "Yakınlarımla derin ve içten bağlar kurabilmek bana güven verir.", text_en: "Building deep, sincere bonds with close ones gives me security.", keying: "POSITIVE" },
    { text_tr: "İnsanlarla birlikteyken bile bir mesafe ve soğukluk hissederim.", text_en: "Even around others, I sense an emotional coldness and barrier.", keying: "NEGATIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Dertlerimi ve sevinçlerimi paylaşabileceğim dostlarım vardır.", text_en: "I have friends with whom I can share joys and sorrows.", keying: "POSITIVE" },
    { text_tr: "Kimsenin beni gerçekten tanımadığını ve anlamadığını düşünürüm.", text_en: "I feel nobody truly understands or genuinely knows me.", keying: "NEGATIVE" },
    { text_tr: "Bir topluluğa veya aileye ait olduğumu hissetmek bana güç katar.", text_en: "Belonging to a community or family imparts strength to me.", keying: "POSITIVE" },
    { text_tr: "İlişkilerimde karşımdakilere güvenmekte büyük çekinceler yaşarım.", text_en: "I harbor major reservations trusting others in relationships.", keying: "NEGATIVE" },
    { text_tr: "İş yerinde ekip arkadaşlarımla sıcak ve dayanışmacı bir ilişkim vardır.", text_en: "At work, I maintain a warm, supportive rapport with teammates.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Aile ortamında sevildiğimi ve kabul gördüğümü bilirim.", text_en: "In my family environment, I know I am loved and cherished.", keying: "POSITIVE", itemType: "contextual", context: "family" }
  ]
});

// 4. OPENNESS TO CHANGE VALUES
addFacetItems({
  prefix: "MV-UV-OTC",
  constructId: "universal_values",
  facetId: "values_openness_to_change",
  items: [
    { text_tr: "Düşünce ve eylemlerimde bağımsız olmak ve kendi yolumu çizmek benim için çok önemlidir.", text_en: "Being independent in thought and action is paramount to me.", keying: "POSITIVE" },
    { text_tr: "Rutinleri bozmaktan kaçınır, öngörülebilir bir yaşamı tercih ederim.", text_en: "I avoid disrupting routines and prefer a predictable life.", keying: "NEGATIVE" },
    { text_tr: "Hayatımda yeni heyecanlar, keşifler ve maceralar ararım.", text_en: "I seek fresh thrills, discoveries, and adventures in my life.", keying: "POSITIVE" },
    { text_tr: "Sıradışı ve deneysel şeyleri denemekten büyük heyecan duyarım.", text_en: "I get excited trying unconventional and experimental paths.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Herkesin yürüdüğü bilindik yollardan sapmayı gereksiz bulurum.", text_en: "I find straying from well-trodden paths unnecessary.", keying: "NEGATIVE" },
    { text_tr: "Kendi kaderimi kendi özgür kararlarımla belirlemeye paha biçilmez değer veririm.", text_en: "I place invaluable importance on charting my destiny freely.", keying: "POSITIVE" },
    { text_tr: "Sürprizler ve beklenmedik değişiklikler yerine istikrarı seçerim.", text_en: "I choose stability over surprises and unexpected shifts.", keying: "NEGATIVE" },
    { text_tr: "Yeni kültürleri ve farklı yaşam tarzlarını merakla incelerim.", text_en: "I explore novel cultures and diverse lifestyles with fascination.", keying: "POSITIVE" },
    { text_tr: "İş hayatında yenilikçi projelere öncülük etmekten keyif alırım.", text_en: "In my career, I relish pioneering innovative initiatives.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Geleneksel tatil mekanları yerine bilinmeyen rotalara seyahat ederim.", text_en: "I travel to uncharted trails instead of conventional holiday resorts.", keying: "POSITIVE", itemType: "contextual", context: "general" }
  ]
});

// 5. SELF-TRANSCENDENCE VALUES
addFacetItems({
  prefix: "MV-UV-STR",
  constructId: "universal_values",
  facetId: "values_self_transcendence",
  items: [
    { text_tr: "Yakınlarımın ve tüm insanların refahı ve mutluluğu benim için birincil önceliktir.", text_en: "The well-being of close ones and all humanity is my primary priority.", keying: "POSITIVE" },
    { text_tr: "Önce kendi çıkarlarımı gözetirim; başkalarının durumu beni pek ilgilendirmez.", text_en: "I look after myself first; others' state is not my concern.", keying: "NEGATIVE" },
    { text_tr: "Doğayı, çevreyi ve tüm canlıları korumayı ahlaki bir sorumluluk sayarım.", text_en: "I consider guarding nature and all life an ethical imperative.", keying: "POSITIVE" },
    { text_tr: "İhtiyacı olanlara yardım etmek için zamanımdan ve imkanlarımdan fedakarlık yaparım.", text_en: "I sacrifice time and resources to assist those in need.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Toplumdaki adaletsizlikler ve yoksulluk karşısında kayıtsız kalamam.", text_en: "I cannot remain indifferent before social inequities and poverty.", keying: "POSITIVE" },
    { text_tr: "Yardımlaşma faaliyetlerini naif ve pratik faydası olmayan çabalar sayarım.", text_en: "I write off charity work as naive and unpragmatic efforts.", keying: "NEGATIVE" },
    { text_tr: "Herkesin eşit haklara ve onura sahip olduğu bir dünya hayal ederim.", text_en: "I envision a world where everyone enjoys equal dignity and rights.", keying: "POSITIVE" },
    { text_tr: "Kendi ailem dışındaki insanların dertleriyle ilgilenmek bana anlamsız gelir.", text_en: "Caring about strangers' woes seems senseless to me.", keying: "NEGATIVE" },
    { text_tr: "İş yerinde meslektaşlarıma karşılıksız destek vermekten çekinmem.", text_en: "At work, I offer colleagues assistance without asking for return.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Sosyal sorumluluk projelerinde gönüllü olarak görev alırım.", text_en: "I volunteer my time in community service projects.", keying: "POSITIVE", itemType: "contextual", context: "social" }
  ]
});

// 6. CONSERVATION VALUES
addFacetItems({
  prefix: "MV-UV-CON",
  constructId: "universal_values",
  facetId: "values_conservation",
  items: [
    { text_tr: "Geleneklerin, ahlaki normların ve toplumsal düzenin korunmasına büyük önem veririm.", text_en: "Preserving traditions, moral norms, and social order matters deeply.", keying: "POSITIVE" },
    { text_tr: "Yerleşik kuralları ve tabuları sorgulamaktan veya kırmaktan çekinmem.", text_en: "I don't hesitate to interrogate or shatter settled rules and taboos.", keying: "NEGATIVE" },
    { text_tr: "Ailemin ve toplumun benden beklediği geleneksel rollere saygı gösteririm.", text_en: "I respect traditional roles expected of me by family and community.", keying: "POSITIVE" },
    { text_tr: "Otoriteye ve büyüklere saygı göstermeyi en temel erdemlerden biri sayarım.", text_en: "I deem respect for authority and elders one of the foundational virtues.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Toplumsal düzenin korunması bireysel isteklerden daha mühimdir.", text_en: "Safeguarding social stability is more crucial than individual desires.", keying: "POSITIVE" },
    { text_tr: "Eski geleneklerin modern çağda geçerliliğini yitirdiğini düşünürüm.", text_en: "I believe ancient traditions have expired in the modern era.", keying: "NEGATIVE" },
    { text_tr: "Güvenlik, istikrar ve yasaların katı bir şekilde uygulanmasını savunurum.", text_en: "I advocate security, order, and rigorous enforcement of laws.", keying: "POSITIVE" },
    { text_tr: "Toplumun ahlak kurallarını hiçe sayan davranışları hoş göremem.", text_en: "I cannot tolerate conduct that flouts public moral standards.", keying: "POSITIVE" },
    { text_tr: "İş yerinde kurum kültürüne ve hiyerarşik kurallara harfiyen uyarım.", text_en: "At work, I observe organizational hierarchies and customs scrupulously.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Geleneksel bayram ve aile merasimlerini ihmal etmeden yerine getiririm.", text_en: "I observe customary festive and family rituals without neglect.", keying: "POSITIVE", itemType: "contextual", context: "family" }
  ]
});

// 7. SELF-ENHANCEMENT VALUES
addFacetItems({
  prefix: "MV-UV-SEN",
  constructId: "universal_values",
  facetId: "values_self_enhancement",
  items: [
    { text_tr: "Hayatta güç, başarı, etki ve yüksek bir sosyal statüye sahip olmak benim için kritiktir.", text_en: "Attaining power, success, influence, and high status is critical to me.", keying: "POSITIVE" },
    { text_tr: "Başkalarını yönetmek veya yüksek statü sembolleri taşımak bana cazip gelmez.", text_en: "Leading others or bearing status symbols does not tempt me.", keying: "NEGATIVE" },
    { text_tr: "Girdiğim her rekabette en önde olmak ve kazanmak için mücadele ederim.", text_en: "In every contest, I fight to be first and triumph.", keying: "POSITIVE" },
    { text_tr: "Hırs ve rekabetçilik olmadan gerçek başarının geleceğine inanmam.", text_en: "I believe true triumph never arrives without ambition and rivalry.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Yetkili olmak ve insanları yönlendirebilmek bana tatmin verir.", text_en: "Wielding authority and steering people grants me satisfaction.", keying: "POSITIVE" },
    { text_tr: "Sıradan, iddiasız bir yaşam benim için tamamen yeterlidir.", text_en: "A quiet, unambitious life is completely satisfactory for me.", keying: "NEGATIVE" },
    { text_tr: "Başarılarımla çevremdeki insanları etkilemek ve saygı uyandırmak isterim.", text_en: "I want to command respect and impress my peers through achievements.", keying: "POSITIVE" },
    { text_tr: "Liderlik koltuğunda oturmaktansa arkada sakin kalmayı seçerim.", text_en: "I prefer staying quietly behind rather than occupying the executive seat.", keying: "NEGATIVE" },
    { text_tr: "Kariyer basamaklarını en hızlı şekilde tırmanmak için tüm gücümle çalışırım.", text_en: "I work tirelessly to ascend corporate ladders at maximum velocity.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Sosyal çevremde liderlik rolünü üstlenip kararları yönlendiririm.", text_en: "In my social circle, I assume leadership and steer outcomes.", keying: "POSITIVE", itemType: "contextual", context: "social" }
  ]
});

// 8. PRESENCE OF MEANING
addFacetItems({
  prefix: "MV-EM-PRM",
  constructId: "existential_meaning",
  facetId: "presence_of_meaning",
  items: [
    { text_tr: "Hayatımın net bir anlamı, yönü ve derin bir amacı olduğunu hissederim.", text_en: "I understand my life's meaning and feel a clear purpose.", keying: "POSITIVE" },
    { text_tr: "Hayatımın neden var olduğunu veya neye hizmet ettiğini hiç bilemiyorum.", text_en: "I have no clear understanding of what makes my life meaningful.", keying: "NEGATIVE" },
    { text_tr: "Neden yaşadığımı ve varoluşumun amacını içsel olarak bilirim.", text_en: "I have discovered a satisfying life purpose.", keying: "POSITIVE" },
    { text_tr: "Günlerimi derin bir anlamsızlık ve boşluk içinde geçirdiğim olur.", text_en: "My life has no clear purpose and feels hollow.", keying: "NEGATIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Yaptığım şeylerin dünyada anlamlı bir fark yarattığına inanırım.", text_en: "I believe my actions make a meaningful mark in the world.", keying: "POSITIVE" },
    { text_tr: "Hayat bana boş, rastgele ve amaçsız bir koşturmaca gibi gelir.", text_en: "Life strikes me as an empty, random, and aimless rat race.", keying: "NEGATIVE" },
    { text_tr: "Sabahları uyanmak için beni heyecanlandıran anlamlı bir misyonum vardır.", text_en: "I have a mission that excites me to get out of bed in the morning.", keying: "POSITIVE" },
    { text_tr: "Varoluşumun hiçbir iz bırakmadan kaybolup gideceğini hissederim.", text_en: "I feel my existence will fade without leaving a single trace.", keying: "NEGATIVE" },
    { text_tr: "Mesleki faaliyetlerimi daha yüce bir varoluşsal amaçla birleştiririm.", text_en: "I unite my career labor with a higher existential calling.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Zor zamanlarımda bile hayatımın anlamına tutunarak güç bulurum.", text_en: "Even in adversity, I draw strength clinging to my life's meaning.", keying: "POSITIVE", itemType: "contextual", context: "stress" }
  ]
});

// 9. SEARCH FOR MEANING
addFacetItems({
  prefix: "MV-EM-SRM",
  constructId: "existential_meaning",
  facetId: "search_for_meaning",
  items: [
    { text_tr: "Hayatıma yön ve derinlik katacak nihai bir amaç arayışı içindeyimdir.", text_en: "I am always looking to find my life's purpose.", keying: "POSITIVE" },
    { text_tr: "Varoluşumun amacını sorgulamaz, hayatı olduğu gibi yaşarım.", text_en: "I don't question existence; I live life plainly as it comes.", keying: "NEGATIVE" },
    { text_tr: "Kendimi hayatımı daha anlamlı kılacak yeni yollar ararken bulurum.", text_en: "I am seeking something that will make my life feel meaningful.", keying: "POSITIVE" },
    { text_tr: "Yaşamın derin felsefi anlamını keşfetmek için düşüncelere dalarım.", text_en: "I brood in contemplation to discover life's esoteric meaning.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Anlam arayışı gibi soyut felsefi sorgulamaları gereksiz bulurum.", text_en: "I deem abstract existential quests unhelpful.", keying: "NEGATIVE" },
    { text_tr: "Ruhumu doyuracak ve beni aşan büyük bir misyonun izini sürerim.", text_en: "I track down a grand mission that feeds my soul.", keying: "POSITIVE" },
    { text_tr: "Mevcut yaşam tarzımın bana yetip yetmediğini sürekli sorgularım.", text_en: "I constantly interrogate whether my current life suffices.", keying: "POSITIVE" },
    { text_tr: "Hayatın anlamına dair kafa yormaktansa günü yaşamayı seçerim.", text_en: "I choose to live the day rather than philosophizing over purpose.", keying: "NEGATIVE" },
    { text_tr: "Kariyerimde yeni anlamlar bulmak için sürekli kitaplar ve fikirler araştırırım.", text_en: "In my career, I research ideas seeking deeper existential resonance.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Farklı inanç sistemlerinin anlam arayışlarına ilgi duyarım.", text_en: "I am intrigued by the spiritual quests of diverse belief systems.", keying: "POSITIVE", itemType: "contextual", context: "general" }
  ]
});

module.exports = {
  batchName: "BATCH_F_MOTIVATION_VALUES",
  items
};
