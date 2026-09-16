const fs = require('fs');
const path = require('path');

const proposedModel = JSON.parse(fs.readFileSync('data/master-model/proposed-master-model.json', 'utf8'));

// Master Facet Blueprint Catalog Specifications
const BLUEPRINTS_MAP = {};

// Helper to add blueprint
function addBlueprint(b) {
  BLUEPRINTS_MAP[b.facetId] = b;
}

// -------------------------------------------------------------
// DOMAIN 1: CORE PERSONALITY (HEXACO) — 24 Facets
// -------------------------------------------------------------

// Honesty-Humility
addBlueprint({
  domainId: "core_personality",
  constructId: "hexaco_honesty_humility",
  facetId: "sincerity",
  nameTr: "İçtenlik",
  nameEn: "Sincerity",
  scientificDefinitionTr: "Kişilerarası ilişkilerde dürüst, yapmacıksız ve şeffaf olma; çıkar sağlamak amacıyla başkalarını pohpohlamaktan, manipüle etmekten ve sahte rollere bürünmekten kaçınma eğilimi.",
  inclusionCriteria: ["Kişilerarası şeffaflık", "Yaltaklanmadan kaçınma", "Dürüst doğrudan iletişim"],
  exclusionCriteria: ["Aşırı nezaket", "Ahlaki üstünlük taslama", "Açık sözlülük bahanesiyle kabalık"],
  adjacentConstructs: ["fairness", "modesty", "machiavellianism_subclinical"],
  discriminantRisks: ["Geçimlilik ile yapmacık uyumu karıştırmamak", "Makyavelist taktiksel nezaketten ayrıştırmak"],
  referenceInstruments: ["IPIP-HEXACO Sincerity Scale", "HEXACO-PI-R"],
  primarySourceIds: ["src_lee_ashton_2004", "src_ashton_lee_2007"],
  secondarySourceIds: ["src_goldberg_1999_ipip"],
  turkishEvidenceSourceIds: ["src_wasti_2008_lexical"],
  behavioralIndicators: {
    cognitiveIndicators: ["İlişkilerde gizli ajanda gütmeme inancı", "Samimiyetsizliğin uzun vadede zarar vereceğini düşünme"],
    emotionalIndicators: ["Yapmacık davranmak zorunda kaldığında içsel rahatsızlık hissetme"],
    motivationalIndicators: ["Saf ve dürüst ilişkiler kurma motivasyonu"],
    interpersonalIndicators: ["İnsanlara hak etmedikleri abartılı övgülerden kaçınma", "Kendi gerçek niyetini gizlemeden iletişim kurma"],
    behavioralIndicatorsDetailed: [
      "Çıkar sağlamak için sahte iltifatlar yapmaktan kaçınır",
      "Kişisel kazanç elde etmek amacıyla insanların hoşuna gidecek maskeler takmaz",
      "Birine karşı hissetmediği yakınlığı sırf işi görülsün diye taklit etmez",
      "Kendi düşüncelerini manipülatif taktiklere başvurmadan açıkça paylaşır"
    ]
  },
  relevantContexts: ["relationships", "work_task", "social_settings"],
  undesiredItemPatterns: ["Ben asla yalan söylemem gibi mutlakçı ve ahlakçı ifadeler"],
  socialDesirabilityRisk: "MODERATE",
  clinicalRisk: "NONE",
  recommendedItemCount: 5,
  recommendedReverseItemCount: 1,
  measurementRationale: "HEXACO Dürüstlük-Alçakgönüllülük faktörünün temel kişilerarası şeffaflık alt boyutudur."
});

addBlueprint({
  domainId: "core_personality",
  constructId: "hexaco_honesty_humility",
  facetId: "fairness",
  nameTr: "Adillik",
  nameEn: "Fairness",
  scientificDefinitionTr: "Dolandırıcılık, rüşvet alma veya kuralları kendi çıkarına esnetme gibi hileli yollardan kaçınma; başkalarının haklarına ve ortak etik standartlara tarafsızca saygı gösterme eğilimi.",
  inclusionCriteria: ["Hile ve haksız kazançtan kaçınma", "Kurallara ve haklara adil riayet"],
  exclusionCriteria: ["Aşırı katı kuralcılık", "Körlemesine bürokrasiye bağlılık"],
  adjacentConstructs: ["sincerity", "prudence", "machiavellianism_subclinical"],
  discriminantRisks: ["Sorumluluk kuralcılığı ile ahlaki adilliği ayrıştırmak"],
  referenceInstruments: ["IPIP-HEXACO Fairness Scale", "HEXACO-PI-R"],
  primarySourceIds: ["src_lee_ashton_2004", "src_ashton_lee_2007"],
  secondarySourceIds: ["src_goldberg_1999_ipip"],
  turkishEvidenceSourceIds: ["src_wasti_2008_lexical"],
  behavioralIndicators: {
    cognitiveIndicators: ["Haksız avantaj elde etmenin etik dışı olduğuna inanma"],
    emotionalIndicators: ["Haksız bir avantaja maruz kaldığında veya tanık olduğunda huzursuzluk duyma"],
    motivationalIndicators: ["Hak edilmemiş ayrıcalıkları reddetme motivasyonu"],
    interpersonalIndicators: ["Ortak kaynakları veya görevleri paylaşırken eşitliği gözetme"],
    behavioralIndicatorsDetailed: [
      "Kimse fark etmeyecek olsa bile haksız bir avantajdan yararlanmaktan kaçınır",
      "Bir oyunda veya rekabette kuralları kendi lehine gizlice esnetmeyi reddeder",
      "Kendi çıkarı için başkalarının bilgisizliğinden faydalanmaz",
      "Fırsat çıksa dahi hak etmediği bir kazancı elde etmek istemez"
    ]
  },
  relevantContexts: ["work_task", "everyday_life", "decisions"],
  undesiredItemPatterns: ["Ben tamamen dürüst biriyim tarzı doğrudan ahlak sorgulamaları"],
  socialDesirabilityRisk: "HIGH",
  clinicalRisk: "NONE",
  recommendedItemCount: 5,
  recommendedReverseItemCount: 1,
  measurementRationale: "Sosyal işbirliği ve kaynak paylaşımında etik sınırların korunmasını ölçer."
});

addBlueprint({
  domainId: "core_personality",
  constructId: "hexaco_honesty_humility",
  facetId: "greed_avoidance",
  nameTr: "Açgözlülükten Kaçınma",
  nameEn: "Greed Avoidance",
  scientificDefinitionTr: "Gösterişli zenginlik, lüks tüketim ve yüksek sosyal statü sembollerine karşı aşırı hırs duymama; maddi varlıkları ve gücü kişisel üstünlük aracı olarak görmeme eğilimi.",
  inclusionCriteria: ["Maddi hırs düşüklüğü", "Lüks ve statü gösterişine kayıtsızlık"],
  exclusionCriteria: ["Finansal ihmalkarlık", "Tembellik veya hedefsizlik"],
  adjacentConstructs: ["modesty", "schwartz_self_enhancement"],
  discriminantRisks: ["Maddi hırs yokluğu ile başarı motivasyonu eksikliğini karıştırmamak"],
  referenceInstruments: ["IPIP-HEXACO Greed Avoidance Scale", "HEXACO-PI-R"],
  primarySourceIds: ["src_lee_ashton_2004", "src_ashton_lee_2007"],
  secondarySourceIds: ["src_goldberg_1999_ipip"],
  turkishEvidenceSourceIds: ["src_wasti_2008_lexical"],
  behavioralIndicators: {
    cognitiveIndicators: ["Statü sembollerinin insan değerini belirlemediğine inanma"],
    emotionalIndicators: ["Başkalarının lüks yaşam tarzlarına karşı haset duymama"],
    motivationalIndicators: ["Sade ve dengeli bir yaşamı gösterişe tercih etme"],
    interpersonalIndicators: ["Maddi varlıkları insanları etkilemek veya ezmek için kullanmama"],
    behavioralIndicatorsDetailed: [
      "Çok lüks ve gösterişli eşyalara sahip olma arzusu hissetmez",
      "Zenginliğini ve statüsünü başkalarına sergileme ihtiyacı duymaz",
      "Pahalı zevkler yerine mütevazı ve işlevsel olanı tercih eder",
      "Sosyal çevresini insanların maddi gücüne göre seçmez"
    ]
  },
  relevantContexts: ["everyday_life", "personal_goals", "social_settings"],
  undesiredItemPatterns: ["Paradan nefret ederim gibi mantık dışı aşırı uçlamalar"],
  socialDesirabilityRisk: "MODERATE",
  clinicalRisk: "NONE",
  recommendedItemCount: 5,
  recommendedReverseItemCount: 2,
  measurementRationale: "Maddi statü hırsının ve tüketim gösterişçiliğinin bireysel düzeydeki etkisini değerlendirir."
});

addBlueprint({
  domainId: "core_personality",
  constructId: "hexaco_honesty_humility",
  facetId: "modesty",
  nameTr: "Alçakgönüllülük",
  nameEn: "Modesty",
  scientificDefinitionTr: "Kendini başkalarından üstün, özel veya ayrıcalıklı görmeme; başarıları karşısında böbürlenmekten kaçınma ve herkese eşit saygıyla yaklaşma eğilimi.",
  inclusionCriteria: ["Kişisel tevazu", "Kendini üstün görmeme", "Özel muamele beklememe"],
  exclusionCriteria: ["Düşük özgüven", "Kendini aşağılama", "Değersizlik hissi"],
  adjacentConstructs: ["sincerity", "social_self_esteem", "grandiose_narcissism_subclinical"],
  discriminantRisks: ["Alçakgönüllülüğü düşük benlik saygısıyla karıştırmamak"],
  referenceInstruments: ["IPIP-HEXACO Modesty Scale", "HEXACO-PI-R"],
  primarySourceIds: ["src_lee_ashton_2004", "src_ashton_lee_2007"],
  secondarySourceIds: ["src_goldberg_1999_ipip"],
  turkishEvidenceSourceIds: ["src_wasti_2008_lexical"],
  behavioralIndicators: {
    cognitiveIndicators: ["Her bireyin eşit değere sahip olduğunu kabul etme"],
    emotionalIndicators: ["Övülmekten veya merkezde olmaktan aşırı haz duymama"],
    motivationalIndicators: ["Ayrıcalıklı davranılmayı talep etmeme"],
    interpersonalIndicators: ["Başarılarını abartmadan, sade bir dille ifade etme"],
    behavioralIndicatorsDetailed: [
      "Kendisini diğer insanlardan daha önemli veya üstün bir konumda görmez",
      "Başarı elde ettiğinde bunu sürekli başkalarının gözüne sokmaktan kaçınır",
      "Girdiği ortamlarda kendisine özel bir ilgi veya saygı gösterilmesini beklemez",
      "Kusurlarını ve sınırlarını dürüstçe kabul etmekten çekinmez"
    ]
  },
  relevantContexts: ["relationships", "work_task", "social_settings"],
  undesiredItemPatterns: ["Ben önemsiz biriyim gibi öz-değer düşüklüğü içeren ifadeler"],
  socialDesirabilityRisk: "HIGH",
  clinicalRisk: "NONE",
  recommendedItemCount: 5,
  recommendedReverseItemCount: 2,
  measurementRationale: "Narsistik kibir ve üstünlük algısına karşı koruyucu temel kişilik boyutudur."
});

// Emotionality
addBlueprint({
  domainId: "core_personality",
  constructId: "hexaco_emotionality",
  facetId: "fearfulness",
  nameTr: "Korku / Tedbirlilik",
  nameEn: "Fearfulness",
  scientificDefinitionTr: "Fiziksel tehlikelere, bedensel yaralanmalara ve riskli durumlara karşı yüksek duyarlılık gösterme; fiziksel tehdit içeren aktivitelerden kaçınma eğilimi.",
  inclusionCriteria: ["Fiziksel tehlike duyarlılığı", "Bedensel riskten kaçınma"],
  exclusionCriteria: ["Sosyal kaygı", "Genel panik bozukluğu semptomları"],
  adjacentConstructs: ["anxiety", "uppsp_sensation_seeking"],
  discriminantRisks: ["Fiziksel korkuyu sosyal kaygıdan ve heyecan arayışından ayrıştırmak"],
  referenceInstruments: ["IPIP-HEXACO Fearfulness Scale", "HEXACO-PI-R"],
  primarySourceIds: ["src_lee_ashton_2004", "src_ashton_lee_2007"],
  secondarySourceIds: ["src_goldberg_1999_ipip"],
  turkishEvidenceSourceIds: ["src_wasti_2008_lexical"],
  behavioralIndicators: {
    cognitiveIndicators: ["Fiziksel tehlikeleri önceden sezme ve hesaplama"],
    emotionalIndicators: ["Yükseklik, hız veya fiziksel tehdit anlarında yoğun tedirginlik duyma"],
    motivationalIndicators: ["Kişisel fiziksel güvenliği garantiye alma arzusu"],
    interpersonalIndicators: ["Riskli grup aktivitelerinden geri durma"],
    behavioralIndicatorsDetailed: [
      "Fiziksel yaralanma riski taşıyan tehlikeli aktivitelerden uzak durur",
      "Güvenliğinden emin olmadığı ortamlarda hemen tetikte olur",
      "Aşırı hız veya tehlikeli sporlar gibi heyecan arayışlarından kaçınır",
      "Olası bir fiziksel kazaya karşı önceden tedbir alır"
    ]
  },
  relevantContexts: ["everyday_life", "uncertainty"],
  undesiredItemPatterns: ["Klinik fobi ve panik atak semptomları"],
  socialDesirabilityRisk: "LOW",
  clinicalRisk: "NONE",
  recommendedItemCount: 5,
  recommendedReverseItemCount: 2,
  measurementRationale: "Evrimsel tehdit algısı ve fiziksel korunma yönelimini ölçer."
});

addBlueprint({
  domainId: "core_personality",
  constructId: "hexaco_emotionality",
  facetId: "anxiety",
  nameTr: "Kaygıya Yatkınlık",
  nameEn: "Anxiety",
  scientificDefinitionTr: "Gündelik problemler, belirsizlikler ve gelecekteki olası olumsuzluklar karşısında zihinsel endişe ve telaş yaşama eğilimi.",
  inclusionCriteria: ["Zihinsel endişe", "Küçük aksilikleri büyütme", "Gelecek kaygısı"],
  exclusionCriteria: ["Klinik anksiyete bozukluğu", "Somatik panik krizleri"],
  adjacentConstructs: ["fearfulness", "rumination_brooding", "intolerance_of_uncertainty"],
  discriminantRisks: ["Normal mizaç kaygısını patolojik panikten ayırt etmek"],
  referenceInstruments: ["IPIP-HEXACO Anxiety Scale", "HEXACO-PI-R"],
  primarySourceIds: ["src_lee_ashton_2004", "src_ashton_lee_2007"],
  secondarySourceIds: ["src_goldberg_1999_ipip"],
  turkishEvidenceSourceIds: ["src_wasti_2008_lexical"],
  behavioralIndicators: {
    cognitiveIndicators: ["En kötü senaryoları zihinde canlandırma"],
    emotionalIndicators: ["Olaylar planlandığı gibi gitmediğinde içsel huzursuzluk"],
    motivationalIndicators: ["Belirsizliği ortadan kaldırma ve kontrol sağlama çabası"],
    interpersonalIndicators: ["Endişelerini yakın çevresiyle paylaşarak rahatlama arayışı"],
    behavioralIndicatorsDetailed: [
      "Küçük aksilikler karşısında bile kolayca endişeye kapılır",
      "Gelecekte ne olacağını tam bilemediğinde zihnini kurcalayan kaygılar hisseder",
      "Önemli bir iş öncesinde her şeyin ters gidebileceğini düşünerek gerilir",
      "Zor bir durumla karşılaştığında sakin kalmakta zorlanır"
    ]
  },
  relevantContexts: ["stress_decision", "uncertainty", "planning"],
  undesiredItemPatterns: ["Klinik düzeyde nefes alamama, bayılma hissi gibi tanısal somatik yakınmalar"],
  socialDesirabilityRisk: "LOW",
  clinicalRisk: "LOW_SUBCLINICAL",
  recommendedItemCount: 5,
  recommendedReverseItemCount: 2,
  measurementRationale: "Mizaç düzeyindeki duygusal tepkisellik ve stres duyarlılığını gösterir."
});

addBlueprint({
  domainId: "core_personality",
  constructId: "hexaco_emotionality",
  facetId: "dependence",
  nameTr: "Bağlılık ve Destek Arayışı",
  nameEn: "Dependence",
  scientificDefinitionTr: "Duygusal sıkıntı veya zorluk anlarında başkalarının tesellisine, empatisine ve tavsiyesine ihtiyaç duyma; duygusal desteğe açık olma eğilimi.",
  inclusionCriteria: ["Duygusal destek arayışı", "Sıkıntıyı paylaşma ihtiyacı"],
  exclusionCriteria: ["Patolojik bağımlı kişilik bozukluğu", "Tam karar verememe"],
  adjacentConstructs: ["attachment_anxiety", "sentimentality", "social_connectedness"],
  discriminantRisks: ["Sağlıklı duygusal paylaşımı patolojik bağımlılıktan ayırmak"],
  referenceInstruments: ["IPIP-HEXACO Dependence Scale", "HEXACO-PI-R"],
  primarySourceIds: ["src_lee_ashton_2004", "src_ashton_lee_2007"],
  secondarySourceIds: ["src_goldberg_1999_ipip"],
  turkishEvidenceSourceIds: ["src_wasti_2008_lexical"],
  behavioralIndicators: {
    cognitiveIndicators: ["Zorlukların başkalarıyla paylaşılarak daha kolay çözüleceğini düşünme"],
    emotionalIndicators: ["Yalnız kaldığında duygusal yükü taşımakta zorlanma"],
    motivationalIndicators: ["Yakınlarından onay ve teselli alma arzusu"],
    interpersonalIndicators: ["Sorunlarını yakın arkadaşlarına açma"],
    behavioralIndicatorsDetailed: [
      "Moralini bozan bir olay yaşadığında bunu hemen bir yakınıyla paylaşmak ister",
      "Zor kararlar alırken güvendiği birinin onayını ve fikrini alma ihtiyacı duyar",
      "Sıkıntılı anlarda tek başına kalmak yerine birinin desteğini yanında görmek ister",
      "Başkalarının tesellisi ve anlayışı sayesinde daha hızlı toparlanır"
    ]
  },
  relevantContexts: ["relationships", "stress_decision"],
  undesiredItemPatterns: ["Başkaları olmadan hiçbir şey yapamam gibi çaresizlik bildiren ifadeler"],
  socialDesirabilityRisk: "LOW",
  clinicalRisk: "NONE",
  recommendedItemCount: 5,
  recommendedReverseItemCount: 2,
  measurementRationale: "Sosyal destek arama eğilimi ve duygusal ilişkisellik ihtiyacını ölçer."
});

addBlueprint({
  domainId: "core_personality",
  constructId: "hexaco_emotionality",
  facetId: "sentimentality",
  nameTr: "Duygusallık ve İçsel Duyarlık",
  nameEn: "Sentimentality",
  scientificDefinitionTr: "Kişilerarası bağlarda derin duygusal yakınlık hissetme; başkalarının acısına veya sevinçlerine karşı güçlü duygusal tepkiler verme eğilimi.",
  inclusionCriteria: ["Duygusal hassasiyet", "Veda ve kavuşmalarda gözyaşı", "İçten duygusal tepkiler"],
  exclusionCriteria: ["Aşırı dramatizasyon", "Bilişsel empati"],
  adjacentConstructs: ["empathic_concern", "dependence"],
  discriminantRisks: ["Duygusal hassasiyeti bilişsel perspektif almadan ayrıştırmak"],
  referenceInstruments: ["IPIP-HEXACO Sentimentality Scale", "HEXACO-PI-R"],
  primarySourceIds: ["src_lee_ashton_2004", "src_ashton_lee_2007"],
  secondarySourceIds: ["src_goldberg_1999_ipip"],
  turkishEvidenceSourceIds: ["src_wasti_2008_lexical"],
  behavioralIndicators: {
    cognitiveIndicators: ["İnsan ilişkilerinin en önemli parçasının duygu paylaşımı olduğuna inanma"],
    emotionalIndicators: ["Hüzünlü bir filmde veya vedalarda kolayca duygulanma"],
    motivationalIndicators: ["Duygusal bağları koruma ve canlı tutma isteği"],
    interpersonalIndicators: ["Başkalarının acısına şahit olduğunda gözleri dolma"],
    behavioralIndicatorsDetailed: [
      "Duygusal bir veda veya kavuşma anında gözyaşlarına hakim olmakta zorlanır",
      "Birinin yaşadığı üzüntüyü gördüğünde derinden etkilenir ve duygulanır",
      "Anlamlı anılar ve eski fotoğraflar karşısında yoğun bir hüzün ve sevgi hisseder",
      "Sanat eserleri veya dokunaklı hikayeler karşısında kolayca etkilenir"
    ]
  },
  relevantContexts: ["relationships", "everyday_life", "social_settings"],
  undesiredItemPatterns: ["Aşırı histeri veya mantıksız duygusallık ifadeleri"],
  socialDesirabilityRisk: "LOW",
  clinicalRisk: "NONE",
  recommendedItemCount: 5,
  recommendedReverseItemCount: 1,
  measurementRationale: "Affektif duyarlılık ve derin kişilerarası duygusal rezonans kapasitesini değerlendirir."
});

// We continue systematically for all remaining 87 facets...
// Let's write the complete generator script that outputs all 91 blueprints!
