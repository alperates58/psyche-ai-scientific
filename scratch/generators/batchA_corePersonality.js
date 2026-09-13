// BATCH A: CORE PERSONALITY (HEXACO 24 Facets)
// 10 candidate items per facet = 240 items

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
    semanticCluster: props.semanticCluster || `${props.facetId}_cluster`,
    pairedItemId: props.pairedItemId || null,
    forcedChoiceBlock: props.forcedChoiceBlock || null,
    situationalScenarios: props.situationalScenarios || null,
    translationProvenance: DEFAULT_TRANSLATION_PROVENANCE,
    version: "1.0.0-draft"
  };
}

const items = [];

// Helper to add items for a facet with balanced keys & multi-methods
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

// 1. SINCERITY
addFacetItems({
  prefix: "CP-HH-SIN",
  constructId: "honesty_humility",
  facetId: "sincerity",
  items: [
    { text_tr: "Birinden fayda sağlamak için yapmacık iltifatlarda bulunmaktan kaçınırım.", text_en: "I avoid giving insincere compliments just to get something in return.", keying: "POSITIVE" },
    { text_tr: "İşlerimi kolaylaştırmak için insanlara duymak istedikleri şeyleri söylerim.", text_en: "I tell people what they want to hear to smooth my way.", keying: "NEGATIVE" },
    { text_tr: "Düşüncelerimi saklamak yerine karşımdakine içtenlikle açarım.", text_en: "I share my thoughts genuinely rather than hiding them.", keying: "POSITIVE" },
    { text_tr: "Kişisel çıkar sağlamak için yapmacık bir şekilde sempatik davranırım.", text_en: "I act artificially charming for personal benefit.", keying: "NEGATIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "İnsanları yönlendirmek için samimiyetsiz rollere bürünmem.", text_en: "I do not assume false roles to guide people.", keying: "POSITIVE" },
    { text_tr: "Birini ikna etmek gerekiyorsa biraz rol yapmakta sakınca görmem.", text_en: "I see no harm in play-acting if needed to persuade.", keying: "NEGATIVE" },
    { text_tr: "İletişim kurduğum kişilere karşı olduğum gibi görünmeye özen gösteririm.", text_en: "I strive to appear as I truly am.", keying: "POSITIVE" },
    { text_tr: "Nüfuzlu kişilerin gözüne girmek için yapay bir yakınlık kurarım.", text_en: "I build artificial rapport to please influential people.", keying: "NEGATIVE" },
    { text_tr: "İş yerinde yöneticilerime sırf terfi almak için yapay nezaket göstermem.", text_en: "At work, I avoid artificial pleasantries just for promotion.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Önemli bir teklif sunarken inanmadığım iddiaları doğru gibi yansıtırım.", text_en: "While pitching, I present claims I do not believe in as true.", keying: "NEGATIVE", itemType: "contextual", context: "work" }
  ]
});

// 2. FAIRNESS
addFacetItems({
  prefix: "CP-HH-FAI",
  constructId: "honesty_humility",
  facetId: "fairness",
  items: [
    { text_tr: "Kimse fark etmeyecek olsa bile kuralları kendi lehime esnetmem.", text_en: "Even if unnoticed, I do not bend rules in my favor.", keying: "POSITIVE" },
    { text_tr: "Yakalanma riski yoksa kuralların açığından faydalanmakta sakınca görmem.", text_en: "If risk is zero, exploiting rule loopholes is fine.", keying: "NEGATIVE" },
    { text_tr: "Başkalarının hakkını gasp ederek avantaj sağlamayı haksızlık sayarım.", text_en: "I consider gaining an edge at another's expense unjust.", keying: "POSITIVE" },
    { text_tr: "Sıramı öne almak için tanıdık bağlantılarımı devreye sokarım.", text_en: "I utilize personal connections to bypass queues.", keying: "NEGATIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Ortak çalışmalarda herkesin katkısına eşit saygı gösteririm.", text_en: "In collaborative tasks, I respect each person's share equally.", keying: "POSITIVE" },
    { text_tr: "Kişisel bir kazanç için başkalarının sırasını almayı normal bulurum.", text_en: "I find taking others' turn for personal gain acceptable.", keying: "NEGATIVE" },
    { text_tr: "Bana fazla verilen para üstünü fark ettiğimde hemen iade ederim.", text_en: "I return extra change as soon as I notice it.", keying: "POSITIVE" },
    { text_tr: "Rekabet ortamında avantaj sağlamak için küçük hileler yapılabilir.", text_en: "Minor deceptions can be tolerated in competitive settings.", keying: "NEGATIVE" },
    { text_tr: "İş yerinde kaynakları paylaştırırken yakın arkadaşlarıma ayrımcılık yapmam.", text_en: "At work, I do not favor close friends when sharing resources.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Ortak harcamalarda kendi payımı diğerlerinin üzerine bırakmaya çalışırım.", text_en: "In shared bills, I try to pass my share onto others.", keying: "NEGATIVE", itemType: "contextual", context: "relationship" }
  ]
});

// 3. GREED AVOIDANCE
addFacetItems({
  prefix: "CP-HH-GRE",
  constructId: "honesty_humility",
  facetId: "greed_avoidance",
  items: [
    { text_tr: "Pahalı ve lüks eşyalarla gösteriş yapmak bana cazip gelmez.", text_en: "Showing off luxury goods does not appeal to me.", keying: "POSITIVE" },
    { text_tr: "Çok zengin olup lüks bir yaşam sürmek en büyük hayallerim arasındadır.", text_en: "Becoming extremely wealthy and living luxuriously is a top dream.", keying: "NEGATIVE" },
    { text_tr: "İhtiyaçlarımı karşılayacak düzeyde bir gelir bana yeterli gelir.", text_en: "An income that meets my needs is sufficient for me.", keying: "POSITIVE" },
    { text_tr: "Statümü göstermek amacıyla pahalı markaların ürünlerini tercih ederim.", text_en: "I choose costly brands to signal status.", keying: "NEGATIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Maddi servet kazanmayı hayatın birincil başarı ölçütü olarak görmem.", text_en: "I do not see wealth accumulation as life's main score.", keying: "POSITIVE" },
    { text_tr: "Başkalarını etkileyecek lüks otomobillere veya evlere sahip olmak isterim.", text_en: "I desire luxury cars or houses that impress others.", keying: "NEGATIVE" },
    { text_tr: "Sade ve mütevazı bir yaşam tarzı beni fazlasıyla tatmin eder.", text_en: "A simple, modest lifestyle satisfies me well.", keying: "POSITIVE" },
    { text_tr: "Daha fazla para kazanmak için sevmediğim bir işte yıllarca çalışırım.", text_en: "I would work for years in a hated job solely for high pay.", keying: "NEGATIVE" },
    { text_tr: "Sosyal ortamlarda harcamalarımla veya maddi imkanlarımla övünmem.", text_en: "I do not boast about my spendings in social circles.", keying: "POSITIVE", itemType: "contextual", context: "social" },
    { text_tr: "Gelirim arttıkça insanlara daha pahalı hediyelerle gösteriş yaparım.", text_en: "As income grows, I flaunt expensive gifts to show off.", keying: "NEGATIVE", itemType: "contextual", context: "relationship" }
  ]
});

// 4. MODESTY
addFacetItems({
  prefix: "CP-HH-MOD",
  constructId: "honesty_humility",
  facetId: "modesty",
  items: [
    { text_tr: "Kendimi diğer insanlardan daha üstün veya ayrıcalıklı görmem.", text_en: "I do not view myself as superior or privileged.", keying: "POSITIVE" },
    { text_tr: "Sıradan insanlara tanınmayan özel ayrıcalıkları hak ettiğimi düşünürüm.", text_en: "I feel entitled to special perks ordinary people do not get.", keying: "NEGATIVE" },
    { text_tr: "Başarılarımı başkalarının gözüne sokmadan tevazuyla karşılarım.", text_en: "I meet my successes modestly without flaunting them.", keying: "POSITIVE" },
    { text_tr: "Sohbetlerde kendi yeteneklerimden ve başarılarımdan bahsederim.", text_en: "I bring up my talents and accomplishments in talks.", keying: "NEGATIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Toplumdaki konumum ne olursa olsun herkesle eşit seviyede konuşurum.", text_en: "Whatever my station, I converse with everyone as equals.", keying: "POSITIVE" },
    { text_tr: "Önemli ortamlarda bana diğerlerinden daha fazla hürmet gösterilmelidir.", text_en: "I expect greater deference in notable settings.", keying: "NEGATIVE" },
    { text_tr: "Övülmekten ziyade işimi iyi yapmaya odaklanırım.", text_en: "I focus on doing good work rather than receiving praise.", keying: "POSITIVE" },
    { text_tr: "Diğer insanların çoğundan daha zeki olduğumu düşünürüm.", text_en: "I consider myself smarter than the vast majority.", keying: "NEGATIVE" },
    { text_tr: "Ekip projelerinde başarının tüm gruba ait olduğunu belirtirim.", text_en: "In team projects, I state that success belongs to the entire group.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Bir toplulukta en bilgili kişinin ben olduğumun bilinmesini isterim.", text_en: "In a gathering, I want everyone to know I am the most knowledgeable.", keying: "NEGATIVE", itemType: "contextual", context: "social" }
  ]
});

// 5. FEARFULNESS
addFacetItems({
  prefix: "CP-E-FEA",
  constructId: "emotionality",
  facetId: "fearfulness",
  items: [
    { text_tr: "Fiziksel yaralanma riski taşıyan tehlikeli aktivitelerden uzak dururum.", text_en: "I stay away from dangerous activities involving injury risks.", keying: "POSITIVE" },
    { text_tr: "Tehlikeli sporlar veya hız yapmak bana büyük heyecan verir.", text_en: "Dangerous sports or speeding give me great thrills.", keying: "NEGATIVE" },
    { text_tr: "Bedensel acı çekme olasılığı olan durumlarda temkinli davranırım.", text_en: "I act cautiously in situations that might cause bodily pain.", keying: "POSITIVE" },
    { text_tr: "Güvensiz görünen yerlerde bulunmaktan endişe duyarım.", text_en: "I feel uneasy being in places that seem insecure.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Fiziksel tehlikeler beni pek ürkütmez.", text_en: "Physical dangers rarely intimidate me.", keying: "NEGATIVE" },
    { text_tr: "Büyük yüksekliklerde veya sarp yerlerde tedirgin olurum.", text_en: "I feel nervous at great heights or steep ledges.", keying: "POSITIVE" },
    { text_tr: "Fırtınalı veya tehlikeli hava koşullarında dışarı çıkmaktan çekinmem.", text_en: "I don't hesitate to venture out in stormy or harsh weather.", keying: "NEGATIVE" },
    { text_tr: "Trafikte veya sokakta güvensiz bir durum sezdiğimde hemen geri çekilirim.", text_en: "I retreat immediately when sensing an unsafe situation on the road.", keying: "POSITIVE" },
    { text_tr: "Tatilde macera arayışıyla güvenlik uyarısı verilen yerlere giderim.", text_en: "On holiday, I visit warned spots chasing adventure.", keying: "NEGATIVE", itemType: "contextual", context: "general" },
    { text_tr: "Karanlık ve ıssız sokaklarda yürürken tetikte olurum.", text_en: "I remain vigilant when walking on dark, deserted streets.", keying: "POSITIVE", itemType: "contextual", context: "general" }
  ]
});

// 6. ANXIETY PRONENESS
addFacetItems({
  prefix: "CP-E-ANX",
  constructId: "emotionality",
  facetId: "anxiety_proneness",
  items: [
    { text_tr: "Gelecekteki belirsizlikler karşısında kolayca endişeye kapılırım.", text_en: "I easily become worried about future uncertainties.", keying: "POSITIVE" },
    { text_tr: "Zorlu durumlarla karşılaştığımda bile iç huzurumu korurum.", text_en: "I maintain inner composure even when facing tough situations.", keying: "NEGATIVE" },
    { text_tr: "Küçük aksilikler bile zihnimde büyük felaket senaryolarına dönüşebilir.", text_en: "Even minor setbacks can spiral into catastrophe scenarios in my mind.", keying: "POSITIVE" },
    { text_tr: "Önemsiz ayrıntılar için boş yere kaygılanırım.", text_en: "I worry unnecessarily over trivial details.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Olayların kötüye gideceğinden nadiren korkarım.", text_en: "I rarely fear that things will go wrong.", keying: "NEGATIVE" },
    { text_tr: "Beklenmeyen bir haber aldığımda hemen olumsuz ihtimalleri düşünürüm.", text_en: "Upon unexpected news, I immediately imagine negative outcomes.", keying: "POSITIVE" },
    { text_tr: "Baskı altında soğukkanlılığımı kaybetmeden hareket ederim.", text_en: "I operate with cool composure under pressure.", keying: "NEGATIVE" },
    { text_tr: "Gelecek planlarımda en ufak bir aksaklık beni huzursuz eder.", text_en: "Any minor hitch in future plans unsettles me.", keying: "POSITIVE" },
    { text_tr: "İş yerinde teslim tarihlerine yaklaştıkça yoğun kaygı yaşarım.", text_en: "At work, approaching deadlines trigger intense worry.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Ailemdeki kişilerin sağlığıyla ilgili aşırı endişe duymam.", text_en: "I do not harbor excessive anxiety about family members' health.", keying: "NEGATIVE", itemType: "contextual", context: "family" }
  ]
});

// 7. DEPENDENCE
addFacetItems({
  prefix: "CP-E-DEP",
  constructId: "emotionality",
  facetId: "dependence",
  items: [
    { text_tr: "Güç kararlar alırken yakınlarımın onayına ve desteğine ihtiyaç duyarım.", text_en: "When making tough choices, I need reassurance and support from close ones.", keying: "POSITIVE" },
    { text_tr: "Önemli kararları kimseden tavsiye almadan tek başıma alabilirim.", text_en: "I can make major decisions alone without asking anyone for advice.", keying: "NEGATIVE" },
    { text_tr: "Zor bir süreçten geçerken duygularımı paylaşabileceğim birine sığınırım.", text_en: "During tough times, I turn to someone with whom I can share emotions.", keying: "POSITIVE" },
    { text_tr: "Kendime güvenebilmek için başkalarının cesaretlendirmesini beklerim.", text_en: "I await encouragement from others to feel confident.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Kişisel sorunlarımı tamamen kendi başıma çözmeyi tercih ederim.", text_en: "I prefer resolving my personal issues completely on my own.", keying: "NEGATIVE" },
    { text_tr: "Duygusal desteğe ihtiyaç duyduğumda bunu açıkça talep ederim.", text_en: "When in need of emotional support, I openly ask for it.", keying: "POSITIVE" },
    { text_tr: "Başkalarının tesellisine ihtiyaç duymadan toparlanırım.", text_en: "I recover without needing consolation from others.", keying: "NEGATIVE" },
    { text_tr: "Yalnız kaldığımda kararlarımdan şüphe etmeye başlarım.", text_en: "When alone, I begin to doubt my decisions.", keying: "POSITIVE" },
    { text_tr: "İş ortamında takıldığım noktalarda bir meslektaşımdan destek isterim.", text_en: "At work, I seek backing from a colleague when stuck.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "İlişkilerimde karşımdakinin fikirleri olmadan adım atamam.", text_en: "In relationships, I cannot take steps without my partner's views.", keying: "POSITIVE", itemType: "contextual", context: "relationship" }
  ]
});

// 8. SENTIMENTALITY
addFacetItems({
  prefix: "CP-E-SEN",
  constructId: "emotionality",
  facetId: "sentimentality",
  items: [
    { text_tr: "Sevdiklerimden uzun süre ayrılırken yoğun bir veda hüznü yaşarım.", text_en: "I feel deep grief when saying goodbye to loved ones for a long time.", keying: "POSITIVE" },
    { text_tr: "Ayrılıklar ve vedalar beni derinden sarsmaz.", text_en: "Partings and farewells do not shake me deeply.", keying: "NEGATIVE" },
    { text_tr: "Duygusal bir müzik veya film karşısında gözlerim kolayca dolar.", text_en: "My eyes tear up easily during emotional music or films.", keying: "POSITIVE" },
    { text_tr: "Başkalarının üzüntüsünü gördüğümde içimde derin bir şefkat hissederim.", text_en: "I feel profound sympathy when seeing another's sorrow.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Geçmiş hatıralara ve nostaljik anlara karşı mesafeliyimdir.", text_en: "I maintain emotional distance from memories and nostalgia.", keying: "NEGATIVE" },
    { text_tr: "Arkadaşlarımla aramda güçlü duygusal bağlar kurarım.", text_en: "I establish strong emotional bonds with friends.", keying: "POSITIVE" },
    { text_tr: "Olaylara duygusal değil tamamen mantıksal bakmayı tercih ederim.", text_en: "I prefer looking at events with pure logic rather than sentiment.", keying: "NEGATIVE" },
    { text_tr: "Bir dostumun sıkıntısına ortak olurken onun acısını hissederim.", text_en: "I feel my friend's pain while sharing their trouble.", keying: "POSITIVE" },
    { text_tr: "Aile bağlarımdaki sıcak paylaşımlar beni derinden etkiler.", text_en: "Warm moments within family bonds touch me deeply.", keying: "POSITIVE", itemType: "contextual", context: "family" },
    { text_tr: "Eski eşyaları ve hatıraları saklamak bana anlamsız gelir.", text_en: "Saving old memorabilia seems pointless to me.", keying: "NEGATIVE", itemType: "contextual", context: "general" }
  ]
});

// 9. SOCIAL SELF-ESTEEM
addFacetItems({
  prefix: "CP-X-SSE",
  constructId: "extraversion",
  facetId: "social_self_esteem",
  items: [
    { text_tr: "Sosyal ortamlarda kendimi değerli ve kabul edilmiş hissederim.", text_en: "In social gatherings, I feel valued and accepted.", keying: "POSITIVE" },
    { text_tr: "İnsanların arasında kendimi sık sık yetersiz veya silik hissederim.", text_en: "Among people, I frequently feel inadequate or overlooked.", keying: "NEGATIVE" },
    { text_tr: "Yeni bir gruba girdiğimde sevilip sayılacağıma güvenirim.", text_en: "When entering a new group, I trust I will be liked and respected.", keying: "POSITIVE" },
    { text_tr: "Başkalarıyla konuşurken söylediklerimin ilgi çekmediğini düşünürüm.", text_en: "While speaking, I assume what I say lacks interest.", keying: "NEGATIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Kişiliğimin ve fikirlerimin çevremde takdir gördüğünü bilirim.", text_en: "I know my personality and ideas are appreciated around me.", keying: "POSITIVE" },
    { text_tr: "Topluluk içinde varlığımla fark yaratabileceğime inanırım.", text_en: "I believe I can make a meaningful difference in a crowd.", keying: "POSITIVE" },
    { text_tr: "Diğer insanların yanında kendime olan güvenim hızla erir.", text_en: "My confidence rapidly evaporates around other people.", keying: "NEGATIVE" },
    { text_tr: "Sosyal ilişkiler kurmada kendimi yetkin görürüm.", text_en: "I view myself as capable at building social ties.", keying: "POSITIVE" },
    { text_tr: "İş toplantılarında fikirlerimin dinlenmeye değer olduğunu bilirim.", text_en: "In workplace meetings, I know my ideas are worth hearing.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Kalabalık ortamlarda kimsenin benimle ilgilenmek istemeyeceğini düşünürüm.", text_en: "In crowded events, I assume no one wants to talk to me.", keying: "NEGATIVE", itemType: "contextual", context: "social" }
  ]
});

// 10. SOCIAL BOLDNESS
addFacetItems({
  prefix: "CP-X-SBO",
  constructId: "extraversion",
  facetId: "social_boldness",
  items: [
    { text_tr: "Bir topluluk önünde konuşurken kendimi rahat ve cesur hissederim.", text_en: "I feel at ease and bold when speaking before an audience.", keying: "POSITIVE" },
    { text_tr: "Tanımadığım insanlarla dolu bir ortama girdiğimde çekingenleşirim.", text_en: "I become timid upon entering a room full of strangers.", keying: "NEGATIVE" },
    { text_tr: "Grupta liderliği üstlenmekten veya inisiyatif almaktan çekinmem.", text_en: "I do not hesitate to step up and lead a group.", keying: "POSITIVE" },
    { text_tr: "Görüşlerimi kalabalığa duyururken tereddüt ederim.", text_en: "I hesitate when voicing my thoughts to a crowd.", keying: "NEGATIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Önemli kişilerle tanışırken girişken davranırım.", text_en: "I act forward and enterprising when meeting dignitaries.", keying: "POSITIVE" },
    { text_tr: "Topluluk önünde sunum yapma fikri beni felç eder.", text_en: "The idea of presenting publicly paralyzes me.", keying: "NEGATIVE" },
    { text_tr: "Bir tartışmada söz alıp düşüncemi cesurca savunurum.", text_en: "I take the floor in a discussion and defend my stance boldly.", keying: "POSITIVE" },
    { text_tr: "Dikkatleri üzerime çekecek bir davranıştan kaçınırım.", text_en: "I avoid actions that draw public attention onto me.", keying: "NEGATIVE" },
    { text_tr: "İş yerinde üst düzey yöneticilerle doğrudan ve rahatça konuşurum.", text_en: "At work, I speak comfortably and directly with top executives.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Sosyal bir kutlamada ilk dansı veya konuşmayı başlatmaktan kaçınırım.", text_en: "At a social celebration, I shy away from opening the speech or floor.", keying: "NEGATIVE", itemType: "contextual", context: "social" }
  ]
});

// 11. SOCIABILITY
addFacetItems({
  prefix: "CP-X-SOC",
  constructId: "extraversion",
  facetId: "sociability",
  items: [
    { text_tr: "Yeni insanlarla tanışmak ve sohbet etmek bana canlılık verir.", text_en: "Meeting new people and talking gives me vitality.", keying: "POSITIVE" },
    { text_tr: "Uzun süre insanlarla bir arada kalmak enerjimi tüketir.", text_en: "Staying around people for long periods drains my energy.", keying: "NEGATIVE" },
    { text_tr: "Boş zamanlarımı kalabalık arkadaş gruplarıyla geçirmeyi severim.", text_en: "I enjoy spending free hours with large groups of friends.", keying: "POSITIVE" },
    { text_tr: "Hafta sonunu tek başıma sessizce geçirmeyi tercih ederim.", text_en: "I prefer spending the weekend quietly alone.", keying: "NEGATIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Sosyal etkinliklere katılmak için can atarım.", text_en: "I look forward eagerly to participating in social events.", keying: "POSITIVE" },
    { text_tr: "Geniş bir arkadaş çevresine sahip olmak benim için önemlidir.", text_en: "Maintaining a wide circle of friends is important to me.", keying: "POSITIVE" },
    { text_tr: "Yalnız kalmak benim için sosyalleşmekten daha dinlendiricidir.", text_en: "Being alone is more restorative for me than social outings.", keying: "NEGATIVE" },
    { text_tr: "Partilerde veya toplantılarda kolayca kaynaşırım.", text_en: "I mingle effortlessly at parties and gatherings.", keying: "POSITIVE" },
    { text_tr: "İş molalarında meslektaşlarımla sohbet etmekten keyif alırım.", text_en: "I enjoy chatting with colleagues during work breaks.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Sosyal davetleri geri çevirmek için bahaneler ararım.", text_en: "I seek excuses to turn down social invitations.", keying: "NEGATIVE", itemType: "contextual", context: "social" }
  ]
});

// 12. LIVELINESS
addFacetItems({
  prefix: "CP-X-LIV",
  constructId: "extraversion",
  facetId: "liveliness",
  items: [
    { text_tr: "Genellikle yüksek bir enerjiye ve neşeli bir mizaca sahibimdir.", text_en: "I generally possess high energy and a cheerful disposition.", keying: "POSITIVE" },
    { text_tr: "Kendimi sıklıkla durgun, enerjisiz ve isteksiz hissederim.", text_en: "I frequently feel sluggish, low on energy, and subdued.", keying: "NEGATIVE" },
    { text_tr: "Girdiğim ortamlara neşe ve canlılık katmaktan hoşlanırım.", text_en: "I like bringing good cheer and vitality to places I enter.", keying: "POSITIVE" },
    { text_tr: "Güne hevesle ve dinamik bir şekilde başlarım.", text_en: "I begin my days enthusiastically and dynamically.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Olaylara olumlu ve iyimser bir pencereden bakarım.", text_en: "I view events through a positive and optimistic lens.", keying: "POSITIVE" },
    { text_tr: "Nadiren coşkulu veya heyecanlı hissederim.", text_en: "I rarely feel exuberant or thrilled.", keying: "NEGATIVE" },
    { text_tr: "Zorluklar karşısında moralimi çabuk toparlarım.", text_en: "I quickly bounce back my morale in the face of hardships.", keying: "POSITIVE" },
    { text_tr: "Hayata karşı genel bir bıkkınlık ve yorgunluk duyarım.", text_en: "I carry a general sense of weariness toward life.", keying: "NEGATIVE" },
    { text_tr: "İş ortamında projeleri coşkuyla sahiplenirim.", text_en: "At work, I embrace projects with enthusiasm.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Sosyal buluşmalarda neşeli kahkahalar atmaktan geri durmam.", text_en: "In social meetups, I do not hold back hearty laughter.", keying: "POSITIVE", itemType: "contextual", context: "social" }
  ]
});

// 13. FORGIVENESS
addFacetItems({
  prefix: "CP-A-FOR",
  constructId: "agreeableness",
  facetId: "forgiveness",
  items: [
    { text_tr: "Bana haksızlık yapan insanları kin tutmadan affedebilirim.", text_en: "I can forgive people who wronged me without holding a grudge.", keying: "POSITIVE" },
    { text_tr: "Bana yapılan bir yanlışı asla unutmam ve içimde taşırım.", text_en: "I never forget a slight done to me and hold onto it inside.", keying: "NEGATIVE" },
    { text_tr: "Özür dileyen birine ikinci bir şans vermekten yana olurum.", text_en: "I favor giving a second chance to anyone who apologizes.", keying: "POSITIVE" },
    { text_tr: "Beni inciten kişilere karşı öç alma isteği duyarım.", text_en: "I feel an urge for revenge against those who hurt me.", keying: "NEGATIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Geçmiş kırgınlıkları geride bırakıp ilişkiyi onarmaya çalışırım.", text_en: "I try to leave past grudges behind and mend the bond.", keying: "POSITIVE" },
    { text_tr: "Güvenimi bir kez sarsan kişiyi hayatımdan tamamen silerim.", text_en: "I cut out of my life anyone who shakes my trust once.", keying: "NEGATIVE" },
    { text_tr: "İnsanların hata yapabileceğini kabul edip hoşgörülü yaklaşırım.", text_en: "I accept people make errors and approach them tolerantly.", keying: "POSITIVE" },
    { text_tr: "Bir tartışmadan sonra günlerce dargın kalırım.", text_en: "I remain resentful for days following a disagreement.", keying: "NEGATIVE" },
    { text_tr: "İş hayatında eski anlaşmazlıkları profesyonelce arkamda bırakırım.", text_en: "In business, I professionally leave past disputes behind.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Yakın ilişkilerimde eski hataları sürekli gündeme getiririm.", text_en: "In close ties, I keep bringing up past missteps.", keying: "NEGATIVE", itemType: "contextual", context: "relationship" }
  ]
});

// 14. GENTLENESS
addFacetItems({
  prefix: "CP-A-GEN",
  constructId: "agreeableness",
  facetId: "gentleness",
  items: [
    { text_tr: "Eleştirilerimi yaparken karşımdakini kırmamaya ve yumuşak olmaya özen gösteririm.", text_en: "When critiquing, I take care to be gentle and not hurt feelings.", keying: "POSITIVE" },
    { text_tr: "Hataları karşısında insanları sert ve acımasız biçimde yargılarım.", text_en: "I judge people harshly and severely for their mistakes.", keying: "NEGATIVE" },
    { text_tr: "Görüş ayrılıklarında bile nezaketimi ve saygılı tavrımı korurum.", text_en: "Even in sharp disputes, I keep my polite and respectful demeanor.", keying: "POSITIVE" },
    { text_tr: "Başkalarının kusurlarını yüzlerine vurmaktan çekinmem.", text_en: "I do not hesitate to throw others' faults in their face.", keying: "NEGATIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "İnsanlara yaklaşımımda yapıcı ve yumuşak bir dil kullanırım.", text_en: "I use constructive and mild language when relating to people.", keying: "POSITIVE" },
    { text_tr: "Hatalara karşı tahammülsüz davranıp sert tepkiler veririm.", text_en: "I act intolerant toward errors and give sharp retorts.", keying: "NEGATIVE" },
    { text_tr: "Zorlayıcı durumlarda bile kırıcı olmadan kendimi ifade edebilirim.", text_en: "Even in taxing situations, I express myself without bruising feelings.", keying: "POSITIVE" },
    { text_tr: "Birine kızdığımda ağır ve yaralayıcı kelimeler seçerim.", text_en: "When angry at someone, I pick hurtful, biting words.", keying: "NEGATIVE" },
    { text_tr: "İş yerinde geri bildirim verirken yapıcı öneriler sunarım.", text_en: "At work, I offer constructive recommendations when giving feedback.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Aile içinde tartışırken sesimi yükseltip sertleşirim.", text_en: "During family arguments, I raise my voice and turn harsh.", keying: "NEGATIVE", itemType: "contextual", context: "family" }
  ]
});

// 15. FLEXIBILITY
addFacetItems({
  prefix: "CP-A-FLE",
  constructId: "agreeableness",
  facetId: "flexibility",
  items: [
    { text_tr: "Fikir ayrılığı yaşadığımda orta yolu bulmak için uzlaşmaya açığımdır.", text_en: "When differing, I stay open to compromise to find common ground.", keying: "POSITIVE" },
    { text_tr: "Kendi dediğim olana kadar inatla direnirim.", text_en: "I stubbornly dig in my heels until my way is accepted.", keying: "NEGATIVE" },
    { text_tr: "Başkalarının önerilerini dinleyip planlarımı onların ihtiyaçlarına göre esnetirim.", text_en: "I listen to proposals and adjust plans to others' needs.", keying: "POSITIVE" },
    { text_tr: "Haklı olduğumu düşündüğümde zerre kadar taviz vermem.", text_en: "When I feel right, I refuse to concede an inch.", keying: "NEGATIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Ortak kararlarda çoğunluğun arzusuna uyum sağlayabilirim.", text_en: "In group decisions, I can align with the majority's wish.", keying: "POSITIVE" },
    { text_tr: "Benim istemediğim bir yöntem uygulanırsa iş birliğini bırakırım.", text_en: "If a method I dislike is used, I drop cooperation.", keying: "NEGATIVE" },
    { text_tr: "Görüşlerimin yanlış olabileceğini kabul edip tutumumu değiştirebilirim.", text_en: "I can accept being wrong and alter my stance accordingly.", keying: "POSITIVE" },
    { text_tr: "Tartışmalarda son sözün mutlaka bana ait olmasını isterim.", text_en: "In debates, I insist that the final word must belong to me.", keying: "NEGATIVE" },
    { text_tr: "İş toplantılarında farklı fikirleri harmanlayarak ortak çözüm üretirim.", text_en: "In meetings, I blend diverse ideas to create joint solutions.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "İlişkilerimde küçük konularda bile pazarlık yapmaktan kaçınmam.", text_en: "In personal relationships, I contest even trivial details.", keying: "NEGATIVE", itemType: "contextual", context: "relationship" }
  ]
});

// 16. PATIENCE
addFacetItems({
  prefix: "CP-A-PAT",
  constructId: "agreeableness",
  facetId: "patience",
  items: [
    { text_tr: "Sinir bozucu aksilikler karşısında sakinliğimi koruyabilirim.", text_en: "I can retain my calm in the face of irritating snags.", keying: "POSITIVE" },
    { text_tr: "İşler istediğim hızda gitmediğinde hemen öfkelenirim.", text_en: "When things move slowly, I become angry right away.", keying: "NEGATIVE" },
    { text_tr: "Başkalarının yavaşlığına veya acemiliğine sabır gösteririm.", text_en: "I display patience toward others' slowness or inexperience.", keying: "POSITIVE" },
    { text_tr: "Trafikte veya sırada beklerken sinir krizine girerim.", text_en: "I lose my temper while waiting in traffic or queues.", keying: "NEGATIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Tahrik edici bir durumla karşılaştığımda öfkemi kontrol altında tutarım.", text_en: "When confronted by provocation, I keep rage under control.", keying: "POSITIVE" },
    { text_tr: "Bekletilmeye veya oyalanmaya hiç tahammülüm yoktur.", text_en: "I have zero tolerance for being kept waiting or stalled.", keying: "NEGATIVE" },
    { text_tr: "Baskı altında acele kararlar vermek yerine sakin kalıp beklerim.", text_en: "Under pressure, I remain composed and wait rather than rushing.", keying: "POSITIVE" },
    { text_tr: "Küçük bir hata bile beni çileden çıkarmaya yeter.", text_en: "Even a minor fault is enough to send me through the roof.", keying: "NEGATIVE" },
    { text_tr: "İş yerinde acemi meslektaşlarıma anlayışla rehberlik ederim.", text_en: "At work, I guide junior colleagues with forbearance.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Stresli anlarda çevremdekilere patlar ve sesimi yükseltirim.", text_en: "In stressful moments, I snap at those around me and yell.", keying: "NEGATIVE", itemType: "contextual", context: "stress" }
  ]
});

// 17. ORGANIZATION
addFacetItems({
  prefix: "CP-C-ORG",
  constructId: "conscientiousness",
  facetId: "organization",
  items: [
    { text_tr: "Çalışma ortamımı ve eşyalarımı düzenli tutmaya özen gösteririm.", text_en: "I take care to keep my workspace and belongings organized.", keying: "POSITIVE" },
    { text_tr: "Eşyalarımı nereye koyduğumu sık sık unutur ve aramakla vakit kaybederim.", text_en: "I often forget where I placed items and lose time searching.", keying: "NEGATIVE" },
    { text_tr: "Günlük işlerimi planlı ve sistematik bir sırayla yürütürüm.", text_en: "I carry out daily tasks in an orderly, systematic sequence.", keying: "POSITIVE" },
    { text_tr: "Plansız ve dağınık bir şekilde çalışırım.", text_en: "I work in an unstructured and messy fashion.", keying: "NEGATIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Önemli tarihleri ve randevuları takvimime düzenli kaydederim.", text_en: "I routinely log notable dates and appointments in my calendar.", keying: "POSITIVE" },
    { text_tr: "Odam veya masam genellikle darmadağınıktır.", text_en: "My room or desk is usually a chaotic mess.", keying: "NEGATIVE" },
    { text_tr: "Bir işe başlamadan önce adımlarımı tasarlarım.", text_en: "Before starting a project, I design my steps.", keying: "POSITIVE" },
    { text_tr: "Plan yapmaktansa aklıma estiği gibi hareket etmeyi yeğlerim.", text_en: "I prefer acting on whims rather than making schedules.", keying: "NEGATIVE" },
    { text_tr: "İş dosyalarımı herkesin kolayca bulabileceği bir düzen içinde saklarım.", text_en: "I archive work files systematically so anyone can find them.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Evde eşyaları kullandıktan sonra yerlerine kaldırmadan bırakırım.", text_en: "At home, I leave things scattered without putting them away.", keying: "NEGATIVE", itemType: "contextual", context: "family" }
  ]
});

// 18. DILIGENCE
addFacetItems({
  prefix: "CP-C-DIL",
  constructId: "conscientiousness",
  facetId: "diligence",
  items: [
    { text_tr: "Başladığım bir işi engeller çıksa dahi kararlılıkla tamamlarım.", text_en: "I complete started tasks resolutely even if hurdles appear.", keying: "POSITIVE" },
    { text_tr: "Zorlukla karşılaştığımda çabucak sıkılıp işi yarıda bırakırım.", text_en: "When faced with friction, I get bored quickly and quit halfway.", keying: "NEGATIVE" },
    { text_tr: "Hedeflerime ulaşmak için gereken emeği ve uzun saatleri vermekten kaçınmam.", text_en: "I do not shy away from putting in long hours to reach goals.", keying: "POSITIVE" },
    { text_tr: "Sorumluluklarımı son dakikaya kadar ertelerim.", text_en: "I procrastinate on obligations until the eleventh hour.", keying: "NEGATIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Çalışırken yüksek bir disiplin ve adanmışlık sergilerim.", text_en: "I exhibit high discipline and devotion while working.", keying: "POSITIVE" },
    { text_tr: "Yorulur yorulmaz çalışmayı bırakıp dinlenmeye geçerim.", text_en: "As soon as I feel tired, I halt effort and rest.", keying: "NEGATIVE" },
    { text_tr: "Verdiğim sözleri ve taahhütleri vaktinde yerine getiririm.", text_en: "I fulfill promises and commitments on schedule.", keying: "POSITIVE" },
    { text_tr: "Büyük hedefler koyarım ama sürdürmekte zorlanırım.", text_en: "I set grand goals but struggle to sustain momentum.", keying: "NEGATIVE" },
    { text_tr: "İş yerinde mesaim bitse de acil teslimleri bitirmeden ayrılmam.", text_en: "At work, I don't depart without wrapping urgent deliverables.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Kişisel gelişim hedeflerimi birkaç gün sonra terk ederim.", text_en: "I abandon personal development regimens after a few days.", keying: "NEGATIVE", itemType: "contextual", context: "general" }
  ]
});

// 19. PERFECTIONISM
addFacetItems({
  prefix: "CP-C-PER",
  constructId: "conscientiousness",
  facetId: "perfectionism",
  items: [
    { text_tr: "Yaptığım işin hatasız olması için ayrıntıları dikkatle denetlerim.", text_en: "I verify details carefully so that my output is flawless.", keying: "POSITIVE" },
    { text_tr: "İşin ana hatları tamsa küçük hataları görmezden gelirim.", text_en: "If the main outline is okay, I ignore minor mistakes.", keying: "NEGATIVE" },
    { text_tr: "Ortaya koyduğum her çalışmada yüksek kalite standartları ararım.", text_en: "I look for high quality standards in every output I produce.", keying: "POSITIVE" },
    { text_tr: "Ayrıntılara takılmadan işleri baştan savma teslim edebilirim.", text_en: "I can turn in work haphazardly without sweating details.", keying: "NEGATIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Bir metni göndermeden önce birkaç kez gözden geçiririm.", text_en: "I review a text multiple times before dispatching it.", keying: "POSITIVE" },
    { text_tr: "Ufak pürüzler ve kusurlar beni pek rahatsız etmez.", text_en: "Tiny imperfections do not bother me much.", keying: "NEGATIVE" },
    { text_tr: "Hataları erkenden yakalamak için titizlikle çalışırım.", text_en: "I work meticulously to spot errors early.", keying: "POSITIVE" },
    { text_tr: "Yeterince iyi kavramı benim için mükemmel olmakla eşdeğerdir.", text_en: "'Good enough' is equivalent to excellent in my book.", keying: "NEGATIVE" },
    { text_tr: "İş raporlarımda imla ve hesap hatalarına asla yer bırakmam.", text_en: "I leave no room for typos or calculation slips in reports.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Projeleri mükemmel yapma çabasıyla teslim tarihini geciktiririm.", text_en: "In trying to make things perfect, I delay delivery dates.", keying: "POSITIVE", itemType: "contextual", context: "work" }
  ]
});

// 20. PRUDENCE
addFacetItems({
  prefix: "CP-C-PRU",
  constructId: "conscientiousness",
  facetId: "prudence",
  items: [
    { text_tr: "Önemli kararlar almadan önce olası riskleri ve sonuçları tartarım.", text_en: "I weigh possible risks and outcomes before making major moves.", keying: "POSITIVE" },
    { text_tr: "Sonuçlarını hiç düşünmeden anlık heveslerle karar veririm.", text_en: "I make choices on spur-of-the-moment whims without thought.", keying: "NEGATIVE" },
    { text_tr: "Gereksiz risklerden kaçınarak güvenli adımlar atmayı seçerim.", text_en: "I choose safe steps, avoiding unnecessary hazards.", keying: "POSITIVE" },
    { text_tr: "Düşünmeden konuşup sonradan pişman olurum.", text_en: "I speak without thinking and regret it afterwards.", keying: "NEGATIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Harekete geçmeden önce alternatifleri değerlendiririm.", text_en: "I evaluate alternatives thoroughly before taking action.", keying: "POSITIVE" },
    { text_tr: "Gözü kara bir şekilde sonuçları hesaplamadan tehlikeye atılırım.", text_en: "I throw myself recklessly into hazard without calculations.", keying: "NEGATIVE" },
    { text_tr: "Büyük harcamalar yapmadan önce bütçemi gözden geçiririm.", text_en: "I review my budget before making substantial outlays.", keying: "POSITIVE" },
    { text_tr: "Sabırsızlıkla ilk aklıma gelen çözüme atlarım.", text_en: "I impatiently jump to the very first solution that strikes me.", keying: "NEGATIVE" },
    { text_tr: "İş sözleşmelerini imzalamadan önce her maddeyi dikkatle incelerim.", text_en: "I inspect every clause before signing employment agreements.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Öfkelendiğim anlarda geri dönüşü olmayan kararlar veririm.", text_en: "In moments of fury, I execute irreversible decisions.", keying: "NEGATIVE", itemType: "contextual", context: "stress" }
  ]
});

// 21. AESTHETIC APPRECIATION
addFacetItems({
  prefix: "CP-O-AES",
  constructId: "openness",
  facetId: "aesthetic_appreciation",
  items: [
    { text_tr: "Sanat eserleri, müzik veya doğanın güzelliği beni derinden büyüler.", text_en: "Art pieces, music, or nature's elegance captivate me deeply.", keying: "POSITIVE" },
    { text_tr: "Müzeler, sergiler veya sanatsal etkinlikler bana sıkıcı gelir.", text_en: "Museums, exhibits, or art events feel tedious to me.", keying: "NEGATIVE" },
    { text_tr: "Güzel bir mimari veya manzara karşısında hayranlıkla durup izlerim.", text_en: "I pause and admire striking architecture or natural vistas.", keying: "POSITIVE" },
    { text_tr: "Şiir, edebiyat veya klasik müzikle nadiren ilgilenirim.", text_en: "I rarely take interest in poetry, literature, or classical music.", keying: "NEGATIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Sanatın insanın ruhunu zenginleştiren temel bir değer olduğuna inanırım.", text_en: "I believe art is a core value enriching the human spirit.", keying: "POSITIVE" },
    { text_tr: "Tasarım ve estetik ayrıntılara kafa yormayı vakit kaybı sayarım.", text_en: "I deem dwelling on design and aesthetics a waste of time.", keying: "NEGATIVE" },
    { text_tr: "Farklı müzik türlerini keşfetmekten büyük haz alırım.", text_en: "I take deep pleasure in exploring eclectic musical genres.", keying: "POSITIVE" },
    { text_tr: "Görsel sanatlar bana pek bir anlam ifade etmez.", text_en: "Visual arts convey little meaning to me.", keying: "NEGATIVE" },
    { text_tr: "Yaşadığım ortamı estetik ve zevkli objelerle dekore ederim.", text_en: "I furnish my living spaces with tasteful, aesthetic items.", keying: "POSITIVE", itemType: "contextual", context: "general" },
    { text_tr: "Bir ürünü alırken estetiğinden çok sadece işlevine bakarım.", text_en: "When buying a tool, I look purely at function, disregarding looks.", keying: "NEGATIVE", itemType: "contextual", context: "general" }
  ]
});

// 22. INQUISITIVENESS
addFacetItems({
  prefix: "CP-O-INQ",
  constructId: "openness",
  facetId: "inquisitiveness",
  items: [
    { text_tr: "Bilimsel keşifler, tarih ve dünyanın işleyişi hakkında okumayı severim.", text_en: "I love reading about scientific breakthroughs, history, and the cosmos.", keying: "POSITIVE" },
    { text_tr: "Teorik veya felsefi konulara kafa yormaktan hoşlanmam.", text_en: "I dislike wrestling with theoretical or philosophical topics.", keying: "NEGATIVE" },
    { text_tr: "Nasıl çalıştığını bilmediğim bir mekanizma gördüğümde öğrenmek isterim.", text_en: "When seeing an unfamiliar device, I desire to know how it works.", keying: "POSITIVE" },
    { text_tr: "Yeni bilgiler edinmek için belgeseller veya makaleler incelerim.", text_en: "I watch documentaries or read essays to acquire new knowledge.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "İşime doğrudan yaramayan bilgileri öğrenmekle vakit kaybetmem.", text_en: "I don't waste time learning facts lacking direct utility for me.", keying: "NEGATIVE" },
    { text_tr: "Evrenin ve doğanın sırlarını merakla araştırırım.", text_en: "I investigate the mysteries of nature and the cosmos with curiosity.", keying: "POSITIVE" },
    { text_tr: "Soyut tartışmalar beni çabucak sıkar.", text_en: "Abstract discussions bore me very quickly.", keying: "NEGATIVE" },
    { text_tr: "Farklı kültürlerin inanç ve düşünce sistemlerini öğrenmekten keyif alırım.", text_en: "I enjoy discovering belief systems of varied cultures.", keying: "POSITIVE" },
    { text_tr: "Mesleğim dışındaki alanlarda kitaplar okumaktan hoşlanırım.", text_en: "I relish reading books outside my professional purview.", keying: "POSITIVE", itemType: "contextual", context: "general" },
    { text_tr: "Gündelik pratik işler haricinde entelektüel konularla ilgilenmem.", text_en: "Beyond daily practicalities, I ignore intellectual subjects.", keying: "NEGATIVE", itemType: "contextual", context: "general" }
  ]
});

// 23. CREATIVITY
addFacetItems({
  prefix: "CP-O-CRE",
  constructId: "openness",
  facetId: "creativity",
  items: [
    { text_tr: "Sorunlara alışılmadık ve özgün çözümler üretmekten keyif alırım.", text_en: "I relish devising novel, atypical solutions to problems.", keying: "POSITIVE" },
    { text_tr: "Kendimi pek yaratıcı veya hayal gücü geniş biri olarak görmem.", text_en: "I do not view myself as particularly imaginative or creative.", keying: "NEGATIVE" },
    { text_tr: "Zihnimde yeni fikirler ve projeler sürekli canlanır.", text_en: "New concepts and project visions continuously spark in my mind.", keying: "POSITIVE" },
    { text_tr: "İşleri herkesin yaptığı geleneksel yollarla yapmayı yeğlerim.", text_en: "I prefer tackling tasks via the standard, conventional routes.", keying: "NEGATIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Yazı, çizim veya yeni konseptler üretmede yetenekliyimdir.", text_en: "I am adept at writing, drawing, or creating novel concepts.", keying: "POSITIVE" },
    { text_tr: "Olayları farklı perspektiflerden ele alıp yeni sentezler kurarım.", text_en: "I approach events from fresh angles and craft new syntheses.", keying: "POSITIVE" },
    { text_tr: "Hayal kurmak yerine sadece somut gerçeklerle ilgilenirim.", text_en: "I attend strictly to concrete facts rather than daydreaming.", keying: "NEGATIVE" },
    { text_tr: "Bir çıkmaza girildiğinde kalıpların dışına çıkarak çözüm bulurum.", text_en: "When in a deadlock, I think outside the box for remedies.", keying: "POSITIVE" },
    { text_tr: "İş yerinde süreçleri iyileştirecek yenilikçi öneriler sunarım.", text_en: "At work, I offer innovative suggestions to improve workflows.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Daha önce denenmemiş yolları denemekten çekinirim.", text_en: "I feel averse to trying untrodden paths.", keying: "NEGATIVE", itemType: "contextual", context: "decision" }
  ]
});

// 24. UNCONVENTIONALITY
addFacetItems({
  prefix: "CP-O-UNC",
  constructId: "openness",
  facetId: "unconventionality",
  items: [
    { text_tr: "Alışılagelmiş toplumsal kalıpların dışındaki sıra dışı fikirlere açığımdır.", text_en: "I am open to eccentric concepts outside established social moulds.", keying: "POSITIVE" },
    { text_tr: "Geleneksel kurallara ve yerleşik adetlere sıkı sıkıya bağlı kalırım.", text_en: "I adhere tightly to traditional rules and customary norms.", keying: "NEGATIVE" },
    { text_tr: "Toplumun çoğunluğundan farklı düşünmekten veya yaşamaktan çekinmem.", text_en: "I don't hesitate to live or think differently than the mainstream.", keying: "POSITIVE" },
    { text_tr: "Aykırı veya garip görünen yaşam tarzlarını yadırgarım.", text_en: "I view unorthodox or odd lifestyles with disapproval.", keying: "NEGATIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Yeni ve radikal teorileri önyargısız bir şekilde incelerim.", text_en: "I examine fresh and radical theories without prejudice.", keying: "POSITIVE" },
    { text_tr: "Herkesin kabul ettiği doğruları sorgulamadan benimserim.", text_en: "I adopt widely agreed truths without interrogation.", keying: "NEGATIVE" },
    { text_tr: "Bana garip gelen fikirlere hemen sırt çevirmem, anlamaya çalışırım.", text_en: "I do not dismiss odd ideas right away; I seek to understand them.", keying: "POSITIVE" },
    { text_tr: "Düzenin bozulmaması için eski usullerin korunmasını savunurum.", text_en: "I advocate keeping old ways intact so order isn't disrupted.", keying: "NEGATIVE" },
    { text_tr: "Sosyal çevremde marjinal veya sıradışı insanlarla arkadaşlık kurarım.", text_en: "In my circle, I build friendships with nonconformist individuals.", keying: "POSITIVE", itemType: "contextual", context: "social" },
    { text_tr: "Geleneksel aile yapısına uymayan rolleri eleştiririm.", text_en: "I criticize roles that diverge from the traditional family archetype.", keying: "NEGATIVE", itemType: "contextual", context: "family" }
  ]
});

module.exports = {
  batchName: "BATCH_A_CORE_PERSONALITY",
  items
};
