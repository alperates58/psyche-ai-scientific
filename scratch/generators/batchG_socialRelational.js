// BATCH G: INTERPERSONAL & SOCIAL DYNAMICS (9 Facets)
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
    domainId: "social_relational",
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
    sourceIds: props.sourceIds || ["src_fraley_2000_ecrr"],
    instrumentIds: props.instrumentIds || ["inst_ecr_r"],
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

// 1. ATTACHMENT ANXIETY
addFacetItems({
  prefix: "SR-AS-ANX",
  constructId: "attachment_system",
  facetId: "attachment_anxiety",
  items: [
    { text_tr: "Yakın ilişkilerimde partnerimin beni terk edeceğinden veya daha az seveceğinden endişelenirim.", text_en: "I worry a lot about losing my partner and whether they love me.", keying: "POSITIVE" },
    { text_tr: "İlişkilerimde sevildiğime ve önemsendiğime dair derin bir güven hissederim.", text_en: "I feel confident that my partners love and care about me.", keying: "NEGATIVE" },
    { text_tr: "Karşımdakinin bana olan ilgisi biraz azaldığında hemen paniğe kapılırım.", text_en: "I panic immediately when I sense even slight withdrawal of attention.", keying: "POSITIVE" },
    { text_tr: "Sürekli sevildiğime ve onaylandığıma dair güvence ararım.", text_en: "I seek constant reassurance that I am truly cherished.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Sevgilimden bir süre haber alamadığımda felaket senaryoları kurmam.", text_en: "Not hearing from my partner for a while doesn't spark catastrophes in my head.", keying: "NEGATIVE" },
    { text_tr: "İlişkilerimde karşı tarafın bana hak ettiğim kadar değer vermediğini düşünürüm.", text_en: "I often think my partners do not value me as much as I value them.", keying: "POSITIVE" },
    { text_tr: "Terk edilme korkusu yüzünden ilişkilerimde aşırı kıskançlık gösteririm.", text_en: "Fear of abandonment drives me toward intense jealousy.", keying: "POSITIVE" },
    { text_tr: "Partnerimin bana olan sevgisinden kuşku duymam.", text_en: "I do not doubt my partner's affection toward me.", keying: "NEGATIVE" },
    { text_tr: "İlişkilerimde ufacık bir soğukluk olduğunda her şeyin bittiğini zannederim.", text_en: "Any slight aloofness makes me suspect the relationship is dead.", keying: "POSITIVE", itemType: "contextual", context: "relationship" },
    { text_tr: "Partnerimin mesajlarına geç dönmesi içimde büyük bir kaygı dalgası yaratır.", text_en: "Delayed replies from my partner trigger massive anxiety waves.", keying: "POSITIVE", itemType: "contextual", context: "relationship" }
  ]
});

// 2. ATTACHMENT AVOIDANCE
addFacetItems({
  prefix: "SR-AS-AVO",
  constructId: "attachment_system",
  facetId: "attachment_avoidance",
  items: [
    { text_tr: "Biriyle aşırı yakınlaşmak ve duygusal olarak ona bağlanmak beni tedirgin eder.", text_en: "I feel uncomfortable getting too close and emotionally dependent on others.", keying: "POSITIVE" },
    { text_tr: "Duygusal sırlarımı ve savunmasız yönlerimi partnerimle paylaşmaktan çekinmem.", text_en: "I don't hesitate to share my vulnerable sides and secrets with partners.", keying: "NEGATIVE" },
    { text_tr: "Kendi kendime yetmeyi başkalarına muhtaç olmaya daima tercih ederim.", text_en: "I strongly prioritize self-reliance over relying on others.", keying: "POSITIVE" },
    { text_tr: "Biri bana duygusal olarak fazla bağlandığında geriye doğru adım atarım.", text_en: "When someone leans on me too intimately, I pull back.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Yakın ilişkilerimde tam bir samimiyet ve duygusal açıklık kurabilirim.", text_en: "I can establish complete intimacy and emotional openness in ties.", keying: "NEGATIVE" },
    { text_tr: "İç dünyamı ve hislerimi kendime saklamayı daha güvenli bulurum.", text_en: "I find keeping my inner feelings strictly to myself much safer.", keying: "POSITIVE" },
    { text_tr: "İlişkilerimde bağımsızlığımın tehdit edildiğini hissedersem uzaklaşırım.", text_en: "If I feel my autonomy threatened, I distance myself.", keying: "POSITIVE" },
    { text_tr: "Zor zamanlarımda partnerimin omzunda ağlamaktan çekinmem.", text_en: "I feel free to cry on my partner's shoulder in hard times.", keying: "NEGATIVE" },
    { text_tr: "Romantik ilişkilerimde derin bağlar kurmak yerine mesafeli dururum.", text_en: "In romance, I maintain a cool perimeter rather than forging deep bonds.", keying: "POSITIVE", itemType: "contextual", context: "relationship" },
    { text_tr: "Dertlerimi arkadaşlarıma anlatmak yerine kendi içimde hallederim.", text_en: "I process troubles internally rather than venting to friends.", keying: "POSITIVE", itemType: "contextual", context: "social" }
  ]
});

// 3. COGNITIVE PERSPECTIVE TAKING
addFacetItems({
  prefix: "SR-ME-CPT",
  constructId: "multidimensional_empathy",
  facetId: "cognitive_perspective_taking",
  items: [
    { text_tr: "Birini yargılamadan önce olaylara onun gözünden ve şartlarından bakmaya çalışırım.", text_en: "I try to look at everybody's side of a disagreement before making decisions.", keying: "POSITIVE" },
    { text_tr: "Benimle aynı fikirde olmayanların bakış açısını anlamakta zorlanırım.", text_en: "I find it difficult to understand perspectives contrary to my own.", keying: "NEGATIVE" },
    { text_tr: "Tartışmalarda karşımdakinin neden öyle hissettiğini kavramaya odaklanırım.", text_en: "In disputes, I focus on grasping why the opponent feels that way.", keying: "POSITIVE" },
    { text_tr: "Kendimi başkasının yerine koyarak onun ne hissettiğini hayal ederim.", text_en: "I imagine how things look from the other person's standpoint.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Sadece kendi penceremden bakar, diğer açılara kafa yormam.", text_en: "I look strictly through my window, dismissing alternate angles.", keying: "NEGATIVE" },
    { text_tr: "Bir çatışmada iki tarafın da haklı gerekçeleri olabileceğini görebilirim.", text_en: "I can spot legitimate rationale behind both opposing parties in a clash.", keying: "POSITIVE" },
    { text_tr: "İnsanların eylemlerinin arkasındaki gizli motivasyonları çözümlerim.", text_en: "I dissect the hidden motivations driving people's actions.", keying: "POSITIVE" },
    { text_tr: "Bana ters gelen bir kararın mantığını anlamaya çalışmayı reddederim.", text_en: "I refuse to invest effort understanding logic behind choices I oppose.", keying: "NEGATIVE" },
    { text_tr: "İş müzakerelerinde karşı tarafın önceliklerini hesaba katarak konuşurum.", text_en: "In business negotiations, I speak mindful of the other party's stakes.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Aile fertlerimle tartışırken onların içinde bulunduğu duygusal hali tartarim.", text_en: "During family arguments, I weigh their internal emotional baggage.", keying: "POSITIVE", itemType: "contextual", context: "family" }
  ]
});

// 4. EMPATHIC CONCERN
addFacetItems({
  prefix: "SR-ME-ECO",
  constructId: "multidimensional_empathy",
  facetId: "empathic_concern",
  items: [
    { text_tr: "Zor durumda veya acı çeken birini gördüğümde içimde derin bir şefkat ve koruma arzusu uyanır.", text_en: "I often have tender, concerned feelings for people less fortunate than me.", keying: "POSITIVE" },
    { text_tr: "Başkalarının dertleri ve talihsizlikleri beni pek duygulandırmaz.", text_en: "Other people's misfortunes do not usually disturb me a great deal.", keying: "NEGATIVE" },
    { text_tr: "Haksızlığa uğrayan veya incitilen birini savunan güçlü bir merhamet hissederim.", text_en: "I feel strong compassion standing up for wronged or bruised individuals.", keying: "POSITIVE" },
    { text_tr: "Sokaktaki çaresiz bir insana veya hayvana yardım etmek için içim sızlar.", text_en: "My heart aches to help vulnerable people or stray animals on the street.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Acı çeken birine karşı soğuk ve duygusuz kalabilirim.", text_en: "I can stay indifferent and detached toward someone in anguish.", keying: "NEGATIVE" },
    { text_tr: "Bir dostumun kederi benim de içimi hüzünle doldurur.", text_en: "A friend's heartache fills my own heart with sorrow.", keying: "POSITIVE" },
    { text_tr: "İnsanların kendi hataları yüzünden çektikleri sıkıntılara acımam.", text_en: "I hold no pity for miseries people bring upon themselves.", keying: "NEGATIVE" },
    { text_tr: "Toplumsal mağduriyetleri gördüğümde yardım etme isteğiyle dolarım.", text_en: "Seeing community hardships, I brim with desire to assist.", keying: "POSITIVE" },
    { text_tr: "İş yerinde tükenmiş veya üzgün bir meslektaşıma destek olurum.", text_en: "At work, I offer support to an exhausted or grieving coworker.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Haberlerdeki trajik olayları gördüğümde gözlerimin dolmasına engel olamam.", text_en: "Watching tragic reports on the news, I cannot stop tears welling up.", keying: "POSITIVE", itemType: "contextual", context: "general" }
  ]
});

// 5. ASSERTIVENESS
addFacetItems({
  prefix: "SR-SB-ASS",
  constructId: "social_agency_boundaries",
  facetId: "assertiveness",
  items: [
    { text_tr: "Görüşlerimi ve haklarımı başkalarının karşısında net ve saygılı bir şekilde savunurum.", text_en: "I voice my thoughts and rights clearly and respectfully before others.", keying: "POSITIVE" },
    { text_tr: "Hakkım yendiğinde bile sessiz kalır, itiraz etmekten çekinirim.", text_en: "Even when cheated, I remain quiet and shrink from protesting.", keying: "NEGATIVE" },
    { text_tr: "Katılmadığım bir fikir ortaya atıldığında kendi fikrimi açıkça beyan ederim.", text_en: "When an idea I dispute is floated, I state my divergence openly.", keying: "POSITIVE" },
    { text_tr: "Baskı altında kaldığımda kendi isteklerim yerine diğerlerinin dediğini yaparım.", text_en: "Under peer pressure, I acquiesce to others rather than my wishes.", keying: "NEGATIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Bir toplulukta söz alıp kendi taleplerimi dile getirebilirim.", text_en: "I can take the floor in an assembly to voice my requests.", keying: "POSITIVE" },
    { text_tr: "Çatışma çıkmasın diye haklı olduğum konularda bile geri adım atarım.", text_en: "To avert conflict, I retreat even on grounds where I am right.", keying: "NEGATIVE" },
    { text_tr: "Başkalarının üzerimde tahakküm kurmasına izin vermem.", text_en: "I do not permit others to exert dominance over me.", keying: "POSITIVE" },
    { text_tr: "Haksız bir muameleye uğradığımda hemen sesimi yükseltip durumu düzeltirim.", text_en: "Upon unfair treatment, I raise my voice immediately to fix things.", keying: "POSITIVE" },
    { text_tr: "İş toplantılarında hak ettiğim terfi veya ücreti masaya yatırabilirim.", text_en: "In review meetings, I can put forward promotions or raises I deserve.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Restoranda yanlış gelen bir siparişi nezaketle geri gönderirim.", text_en: "At a diner, I politely send back an erroneous order.", keying: "POSITIVE", itemType: "contextual", context: "general" }
  ]
});

// 6. BOUNDARY SETTING
addFacetItems({
  prefix: "SR-SB-BND",
  constructId: "social_agency_boundaries",
  facetId: "boundary_setting",
  items: [
    { text_tr: "Zamanımı ve enerjimi tüketecek taleplere suçluluk hissetmeden 'hayır' diyebilirim.", text_en: "I can say 'no' to draining demands without feeling guilty.", keying: "POSITIVE" },
    { text_tr: "İnsanları kırmaktan korktuğum için istemediğim sorumlulukları üzerime alırım.", text_en: "Fearing to disappoint people, I take on unwanted burdens.", keying: "NEGATIVE" },
    { text_tr: "Kişisel alanıma ve mahremiyetime saygı gösterilmesini açıkça talep ederim.", text_en: "I explicitly demand respect for my personal space and privacy.", keying: "POSITIVE" },
    { text_tr: "Başkalarının sorunlarını kendi meselem gibi üstlenip yıpranırım.", text_en: "I adopt others' woes as my own issues and wear myself out.", keying: "NEGATIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Sınırlarımı aşmaya çalışan birine nazik ama kesin bir duruş sergilerim.", text_en: "I display a polite yet firm posture to anyone overstepping my line.", keying: "POSITIVE" },
    { text_tr: "Kendi ihtiyaçlarımı hep diğer insanların isteklerinin arkasına atarım.", text_en: "I perpetually push my needs behind other people's desires.", keying: "NEGATIVE" },
    { text_tr: "Hangi konularda taviz vermeyeceğimi net olarak bilirim.", text_en: "I have crystal clarity on what points I will not compromise.", keying: "POSITIVE" },
    { text_tr: "İnsanlar bana istedikleri gibi davranabilir, sınır koymakta zorlanırım.", text_en: "People treat me as they please; I struggle to erect borders.", keying: "NEGATIVE" },
    { text_tr: "İş yerinde mesai saatleri dışında gelen acil olmayan talepleri reddedebilirim.", text_en: "At work, I can decline non-urgent off-hours demands.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Aile fertlerinin özel hayatıma müdahale etmesine sınır çizebilirim.", text_en: "I can set limits when family relatives meddle in my private life.", keying: "POSITIVE", itemType: "contextual", context: "family" }
  ]
});

// 7. SOCIAL APPROVAL DEPENDENCE
addFacetItems({
  prefix: "SR-SB-SAD",
  constructId: "social_agency_boundaries",
  facetId: "social_approval_dependence",
  items: [
    { text_tr: "Kararlarımı alırken çevremdekilerin beni takdir edip onaylamasına aşırı ihtiyaç duyarım.", text_en: "I depend excessively on others' praise and approval for decisions.", keying: "POSITIVE" },
    { text_tr: "Başkaları beni eleştirse veya beğenmese bile kendi yolumda yürürüm.", text_en: "Even if disapproved, I tread my personal path undeterred.", keying: "NEGATIVE" },
    { text_tr: "Bir toplulukta dışlanma veya hor görülme düşüncesi beni dehşete düşürür.", text_en: "The prospect of being ostracized terrifies me.", keying: "POSITIVE" },
    { text_tr: "Sırf başkalarının gözüne girmek için tarzımı ve fikirlerimi değiştiririm.", text_en: "I alter my style and ideas merely to win favor.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Başkalarının hakkımda ne düşündüğü iç huzurumu zerre kadar bozmaz.", text_en: "What others think of me doesn't perturb my peace a single bit.", keying: "NEGATIVE" },
    { text_tr: "Sosyal medyada beğeni veya onay almadığımda kendimi yetersiz hissederim.", text_en: "Lacking likes or approval online makes me feel deficient.", keying: "POSITIVE" },
    { text_tr: "Toplumsal beğenilme arzusu kararlarımın ana itici gücüdür.", text_en: "The thirst for public acclaim is the primary driver of my actions.", keying: "POSITIVE" },
    { text_tr: "Kendi değerimi başkalarının alkışına endekslemem.", text_en: "I do not index my self-worth to the applause of others.", keying: "NEGATIVE" },
    { text_tr: "İş yerinde yöneticim beni övmediğinde tüm motivasyonumu yitiririm.", text_en: "At work, if my supervisor does not praise me, I lose all drive.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Sosyal ortamlarda giydiğim kıyafetin herkesçe beğenilmesini saplantı yaparım.", text_en: "In social scenes, I obsess over everyone validating my outfit.", keying: "POSITIVE", itemType: "contextual", context: "social" }
  ]
});

// 8. CONFLICT COLLABORATING
addFacetItems({
  prefix: "SR-CS-COL",
  constructId: "conflict_styles",
  facetId: "conflict_collaborating",
  items: [
    { text_tr: "Bir çatışma yaşadığımda her iki tarafın da ihtiyaçlarını karşılayan kazan-kazan çözümleri ararım.", text_en: "In conflicts, I seek win-win integrations meeting both parties' needs.", keying: "POSITIVE" },
    { text_tr: "Anlaşmazlıklarda sadece kendi taleplerimin kabul edilmesine odaklanırım.", text_en: "In disputes, I focus exclusively on having my demands accepted.", keying: "NEGATIVE" },
    { text_tr: "Sorunları çözmek için karşı tarafın beklentilerini açıkça dinleyip ortak zemin kurarım.", text_en: "I listen closely to the other's stakes and engineer mutual ground.", keying: "POSITIVE" },
    { text_tr: "Farklı çıkarları birleştirecek yaratıcı çözümler üretirim.", text_en: "I generate creative remedies synthesizing divergent interests.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Ya benim dediğim olur ya da masadan kalkarım tavrını benimserim.", text_en: "I adopt a my-way-or-the-highway ultimatum.", keying: "NEGATIVE" },
    { text_tr: "Çatışmayı derinleştirmek yerine iki tarafı da mutlu edecek formüller ararım.", text_en: "Rather than inflaming conflict, I pursue formulas pleasing both sides.", keying: "POSITIVE" },
    { text_tr: "Uzlaşma sağlamak için karşı tarafın endişelerini gidermeye çaba harcarım.", text_en: "To reach consensus, I endeavor to soothe the other's anxieties.", keying: "POSITIVE" },
    { text_tr: "Çatışmalarda orta yol bulmaya çalışmayı zaman kaybı sayarım.", text_en: "I consider seeking common ground a waste of time in disputes.", keying: "NEGATIVE" },
    { text_tr: "İş yerinde departmanlar arası gerilimleri ortak hedefler etrafında çözerim.", text_en: "At work, I bridge cross-departmental friction around shared targets.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "İlişkilerimde tartışmaları iki tarafın da kazançlı çıktığı bir diyalogla sonlandırırım.", text_en: "In romance, I conclude rows through dialogue where both win.", keying: "POSITIVE", itemType: "contextual", context: "relationship" }
  ]
});

// 9. CONFLICT AVOIDING
addFacetItems({
  prefix: "SR-CS-AVO",
  constructId: "conflict_styles",
  facetId: "conflict_avoiding",
  items: [
    { text_tr: "Gerginlik ve kavga çıkmasın diye rahatsız olduğum konuları dile getirmekten kaçınırım.", text_en: "To avert rows, I skirt around issues that perturb me.", keying: "POSITIVE" },
    { text_tr: "Bir anlaşmazlık olduğunda konunun üzerine cesaretle ve hemen giderim.", text_en: "When an issue emerges, I confront it immediately and bravely.", keying: "NEGATIVE" },
    { text_tr: "Tartışma alevlendiğinde ortamı terk ederek konuyu kapatmayı yeğlerim.", text_en: "When arguments heat up, I prefer exiting the room to bury it.", keying: "POSITIVE" },
    { text_tr: "Huzursuzluk çıkmasın diye kendi itirazlarımı içime atarım.", text_en: "I swallow my dissent to keep peace and order.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Sorunları halının altına süpürmek yerine açıkça masaya yatırırım.", text_en: "Instead of sweeping issues under the rug, I lay them bare.", keying: "NEGATIVE" },
    { text_tr: "Çatışma kokusu aldığım anda sessizliğe bürünürüm.", text_en: "The second I smell conflict, I cloak myself in silence.", keying: "POSITIVE" },
    { text_tr: "Zorlayıcı meselelerin konuşulmasını zamana bırakıp ertelerim.", text_en: "I defer discussing painful matters, leaving them to time.", keying: "POSITIVE" },
    { text_tr: "Karşımdakini rahatsız edecek olsa da gerçeği doğrudan söylerim.", text_en: "Even if it upsets someone, I voice the truth directly.", keying: "NEGATIVE" },
    { text_tr: "İş yerinde fikir ayrılığı olduğunda toplantıda sessiz kalmayı seçerim.", text_en: "At work, upon dissent, I elect to remain silent in the meeting.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Aile içindeki huzursuzluklarda odama çekilip görünmez olurum.", text_en: "During family turbulence, I withdraw to my room and vanish.", keying: "POSITIVE", itemType: "contextual", context: "family" }
  ]
});

module.exports = {
  batchName: "BATCH_G_SOCIAL_RELATIONAL",
  items
};
