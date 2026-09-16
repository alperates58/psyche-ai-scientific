/**
 * DOMAIN 1: CORE PERSONALITY (HEXACO) — PART 1
 * Constructs:
 * 1. hexaco_honesty_humility (sincerity, fairness, greed_avoidance, modesty)
 * 2. hexaco_emotionality (fearfulness, anxiety, dependence, sentimentality)
 * 3. hexaco_extraversion (social_self_esteem, social_boldness, sociability, liveliness)
 */

const DOMAIN_1_PART1 = {
  constructs: [
    // 1. Honesty-Humility
    {
      constructId: "hexaco_honesty_humility",
      facets: [
        {
          blueprint: {
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
          },
          items: [
            {
              itemId: "psi_hh_sinc_01",
              promptTr: "Birinden bir fayda sağlamak için hissetmediğim övgülerde bulunmaktan özellikle kaçınırım.",
              promptEn: "I especially avoid giving praise I don't feel just to get something from someone.",
              behavioralIndicator: "Çıkar sağlamak için sahte iltifatlar yapmaktan kaçınma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_hh_sinc_02",
              promptTr: "İşlerimi kolaylaştırmak amacıyla insanlara karşı yapmacık bir samimiyet sergilemem.",
              promptEn: "I do not show false friendliness toward people just to make things easier for myself.",
              behavioralIndicator: "Taktiksel yapmacıklıktan kaçınma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_hh_sinc_03",
              promptTr: "İstediğim bir sonucu almak için gerekirse karşımdaki kişiye hak etmediği iltifatlar ederim.",
              promptEn: "If needed to get the outcome I want, I give unearned compliments to the person.",
              behavioralIndicator: "Çıkar amaçlı dalkavukluk eğilimi (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_hh_sinc_04",
              promptTr: "İnsanlarla iletişimimde gerçek niyetimi saklamadan, açık ve dolaysız olmayı tercih ederim.",
              promptEn: "In communicating with people, I prefer to be open and direct without hiding my real intention.",
              behavioralIndicator: "Açık ve şeffaf iletişim tercihi",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_hh_sinc_05",
              promptTr: "Başkalarını yönlendirmek için rol yapmak yerine olduğum gibi görünmeye özen gösteririm.",
              promptEn: "I take care to appear as I am rather than acting to steer others.",
              behavioralIndicator: "Manipülatif rollerden kaçınma",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        },
        {
          blueprint: {
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
          },
          items: [
            {
              itemId: "psi_hh_fair_01",
              promptTr: "Kimsenin görmediği durumlarda dahi kuralları kendi çıkarıma göre esnetmekten kaçınırım.",
              promptEn: "Even when no one is watching, I avoid bending the rules for my own gain.",
              behavioralIndicator: "Gözetimsiz ortamlarda dahi etik kurallara uyma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_hh_fair_02",
              promptTr: "Bir rekabette veya paylaşımda haksız bir avantaj yakaladığımda bundan yararlanmayı doğru bulmam.",
              promptEn: "When I catch an unfair advantage in competition or sharing, I do not consider it right to use it.",
              behavioralIndicator: "Haksız avantajı reddetme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_hh_fair_03",
              promptTr: "Yakalanma riski yoksa kuralları kendi lehime çevirmekte bir sakınca görmem.",
              promptEn: "If there is no risk of being caught, I see no harm in bending rules in my favor.",
              behavioralIndicator: "Fırsatçı kural ihlali eğilimi (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_hh_fair_04",
              promptTr: "Kendi kazancımı artırmak için karşımdaki kişinin dikkatsizliğinden veya bilgisizliğinden faydalanmam.",
              promptEn: "I do not take advantage of someone else's carelessness or lack of knowledge to boost my gain.",
              behavioralIndicator: "Başkalarının zayıflığını istismar etmeme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_hh_fair_05",
              promptTr: "Ortak bir çalışmada herkesin payına düşen hakkı almasını kişisel kazancımdan önde tutarım.",
              promptEn: "In collaborative work, I prioritize everyone receiving their fair share over personal gain.",
              behavioralIndicator: "Ortak hakkaniyeti gözetme",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        },
        {
          blueprint: {
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
          },
          items: [
            {
              itemId: "psi_hh_greed_01",
              promptTr: "Sırf başkalarına zengin ve başarılı görünmek için pahalı eşyalar alma isteği duymam.",
              promptEn: "I feel no desire to buy expensive items just to look rich and successful to others.",
              behavioralIndicator: "Statü gösterişinden uzak durma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_hh_greed_02",
              promptTr: "Sosyal statümü sergileyecek çok lüks bir yaşam tarzına sahip olmak benim için büyük bir önceliktir.",
              promptEn: "Having a very luxurious lifestyle that showcases my social status is a top priority for me.",
              behavioralIndicator: "Lüks ve statü hırsı (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_hh_greed_03",
              promptTr: "Maddi gücü insanları etkilemek veya onlara üstünlük kurmak için bir araç olarak görmem.",
              promptEn: "I do not see financial power as a tool to impress or dominate people.",
              behavioralIndicator: "Parayı güç gösterisi aracı yapmama",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_hh_greed_04",
              promptTr: "Ne kadar çok kazanırsam kazanayım, her zaman daha fazlasına ve en pahalısına sahip olmak isterim.",
              promptEn: "No matter how much I earn, I always want more and the most expensive things.",
              behavioralIndicator: "Doyumsuz maddi kazanç arzusu (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_hh_greed_05",
              promptTr: "İhtiyaçlarımı karşılayan sade ve işlevsel eşyalar bana fazlasıyla yeterli gelir.",
              promptEn: "Simple and functional items that meet my needs are more than enough for me.",
              behavioralIndicator: "İşlevsel ve sade tüketime yönelim",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        },
        {
          blueprint: {
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
          },
          items: [
            {
              itemId: "psi_hh_mod_01",
              promptTr: "Yeteneklerime güvensem bile kendimi diğer insanlardan daha üstün görmem.",
              promptEn: "Even while trusting my abilities, I do not consider myself superior to other people.",
              behavioralIndicator: "Kendini üstün görmeme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_hh_mod_02",
              promptTr: "Girdiğim ortamlarda insanların bana özel bir ilgi ve hayranlık göstermesini beklerim.",
              promptEn: "In settings I enter, I expect people to show special attention and admiration to me.",
              behavioralIndicator: "Ayrıcalık ve hayranlık beklentisi (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_hh_mod_03",
              promptTr: "Büyük bir başarı kazandığımda bunu başkalarının gözüne sokmadan tevazuyla karşılarım.",
              promptEn: "When I achieve major success, I accept it with modesty without showing off to others.",
              behavioralIndicator: "Başarıda böbürlenmeme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_hh_mod_04",
              promptTr: "Toplumda pek çok insandan daha özel ve ayrıcalıklı bir konumda olduğumu düşünürüm.",
              promptEn: "I think I am in a more special and privileged position than most people in society.",
              behavioralIndicator: "Üstünlük ve ayrıcalık algısı (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_hh_mod_05",
              promptTr: "Statüsü ne olursa olsun her insanın eşit saygıyı hak ettiğine inanırım.",
              promptEn: "I believe that every person deserves equal respect regardless of their status.",
              behavioralIndicator: "Eşitlikçi saygı anlayışı",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        }
      ]
    },

    // 2. Emotionality
    {
      constructId: "hexaco_emotionality",
      facets: [
        {
          blueprint: {
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
          },
          items: [
            {
              itemId: "psi_em_fear_01",
              promptTr: "Fiziksel olarak yaralanma veya kaza riski taşıyan durumlardan uzak durmaya özen gösteririm.",
              promptEn: "I take care to stay away from situations that carry a risk of physical injury or accident.",
              behavioralIndicator: "Fiziksel tehlikeden kaçınma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_em_fear_02",
              promptTr: "Tehlikeli sporlar ve yüksek hız gibi heyecan verici fiziksel riskleri denemekten büyük keyif alırım.",
              promptEn: "I greatly enjoy trying exciting physical risks such as dangerous sports and high speed.",
              behavioralIndicator: "Fiziksel risk arayışı (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_em_fear_03",
              promptTr: "Güvenliğinden emin olmadığım bir ortamda bulunduğumda hemen tedirgin olur ve tetikte beklerim.",
              promptEn: "When I am in an environment I am not sure is safe, I immediately get uneasy and stay alert.",
              behavioralIndicator: "Güvensiz ortamlarda tetikte olma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_em_fear_04",
              promptTr: "Acil ve fiziksel olarak tehlikeli durumlarda bile korkuya kapılmadan rahat hareket ederim.",
              promptEn: "Even in emergency and physically dangerous situations, I act comfortably without panic.",
              behavioralIndicator: "Fiziksel tehlike karşısında korkusuzluk (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_em_fear_05",
              promptTr: "Bedenime zarar gelme ihtimali olan ortamlara girmekten kaçınırım.",
              promptEn: "I avoid entering environments where there is a possibility of bodily harm.",
              behavioralIndicator: "Bedensel korunma refleksi",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        },
        {
          blueprint: {
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
          },
          items: [
            {
              itemId: "psi_em_anx_01",
              promptTr: "Gündelik planlarımda küçük bir aksilik çıktığında bile içimde bir telaş ve endişe başlar.",
              promptEn: "Even when a small hitch occurs in my daily plans, a rush and worry begins inside me.",
              behavioralIndicator: "Küçük aksiliklerde endişelenme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_em_anx_02",
              promptTr: "Belirsiz ve kritik durumlar karşısında son derece sakin ve rahat kalmayı başarırım.",
              promptEn: "I manage to stay extremely calm and relaxed in ambiguous and critical situations.",
              behavioralIndicator: "Stres karşısında yüksek sükunet (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_em_anx_03",
              promptTr: "Önemli bir karar vermem gerektiğinde olası kötü sonuçları düşünmekten kendimi alamam.",
              promptEn: "When I need to make an important decision, I cannot help thinking about possible bad outcomes.",
              behavioralIndicator: "Karar anında olumsuz senaryolara odaklanma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_em_anx_04",
              promptTr: "Gelecekle ilgili belirsizlikler zihnimi meşgul ettiğinde kolayca huzursuz olurum.",
              promptEn: "When future uncertainties occupy my mind, I easily get uneasy.",
              behavioralIndicator: "Gelecek belirsizliğine kaygılı tepki",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_em_anx_05",
              promptTr: "Pek çok insanın kaygı duyacağı zorlu olaylar karşısında nadiren endişelenirim.",
              promptEn: "I rarely worry in challenging situations where most people would feel anxious.",
              behavioralIndicator: "Zorlu durumlarda düşük kaygı (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            }
          ]
        },
        {
          blueprint: {
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
          },
          items: [
            {
              itemId: "psi_em_dep_01",
              promptTr: "Zor bir dönemden geçerken yakınlarımın duygusal desteği ve tesellisi bana büyük güç verir.",
              promptEn: "When going through a difficult period, the emotional support and comfort of my loved ones gives me great strength.",
              behavioralIndicator: "Duygusal teselli arayışı",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_em_dep_02",
              promptTr: "Yaşadığım kişisel sıkıntıları başkalarına anlatmak yerine tek başıma çözmeyi tercih ederim.",
              promptEn: "I prefer to solve my personal difficulties alone rather than sharing them with others.",
              behavioralIndicator: "Kendi kendine yetme / destekten kaçınma (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_em_dep_03",
              promptTr: "Önemli ve karmaşık sorunlarla karşılaştığımda güvendiğim birinin fikrini almadan rahat edemem.",
              promptEn: "When facing important and complex problems, I cannot feel comfortable without getting advice from someone I trust.",
              behavioralIndicator: "Fikir ve onay alma ihtiyacı",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_em_dep_04",
              promptTr: "Duygusal yüklerimi taşırken hiç kimsenin yardımına veya anlayışına ihtiyaç duymam.",
              promptEn: "I need no one's help or understanding while carrying my emotional burdens.",
              behavioralIndicator: "Duygusal bağımsızlık / izole başa çıkma (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_em_dep_05",
              promptTr: "Canımı sıkan bir durum olduğunda bunu içime atmak yerine değer verdiğim biriyle konuşurum.",
              promptEn: "When there is a situation bothering me, I talk to someone I value instead of keeping it inside.",
              behavioralIndicator: "Sorunları paylaşarak rahatlama",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        },
        {
          blueprint: {
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
          },
          items: [
            {
              itemId: "psi_em_sent_01",
              promptTr: "Dokunaklı bir hikaye veya hüzünlü bir film izlerken kolayca gözlerim dolar.",
              promptEn: "My eyes easily water while watching a touching story or a sad movie.",
              behavioralIndicator: "Dokunaklı olaylar karşısında duygulanma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_em_sent_02",
              promptTr: "Uzun süredir görmediğim bir yakınımı uğurlarken veya karşılarken yoğun duygusal anlar yaşarım.",
              promptEn: "I experience intense emotional moments when seeing off or meeting a loved one after a long time.",
              behavioralIndicator: "Ayrılık ve kavuşma anlarında duygusal yoğunluk",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_em_sent_03",
              promptTr: "Duygusal durumlar karşısında oldukça soğukkanlıyımdır ve nadiren etkilenirim.",
              promptEn: "I am quite cold-blooded in emotional situations and rarely get affected.",
              behavioralIndicator: "Duygusal olaylar karşısında mesafeli durma (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_em_sent_04",
              promptTr: "Bir başkasının yaşadığı derin kederi gördüğümde içimde güçlü bir hüzün hissederim.",
              promptEn: "When I see someone else experiencing deep grief, I feel strong sorrow inside.",
              behavioralIndicator: "Başkalarının kederine duygusal rezonans",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_em_sent_05",
              promptTr: "Geçmişe ait anlamlı anılar ve hatıralar bana derin bir duygu yoğunluğu yaşatır.",
              promptEn: "Meaningful memories and souvenirs from the past give me deep emotional intensity.",
              behavioralIndicator: "Nostalji ve anılara duygusal bağlılık",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        }
      ]
    },

    // 3. Extraversion
    {
      constructId: "hexaco_extraversion",
      facets: [
        {
          blueprint: {
            domainId: "core_personality",
            constructId: "hexaco_extraversion",
            facetId: "social_self_esteem",
            nameTr: "Sosyal Özsaygı",
            nameEn: "Social Self-Esteem",
            scientificDefinitionTr: "Sosyal bağlamlarda ve topluluk içinde kendini değerli, popüler, beğenilen ve saygı gören biri olarak algılama eğilimi.",
            inclusionCriteria: ["Sosyal güven", "Beğenilirlik algısı", "Grup içinde rahatlık"],
            exclusionCriteria: ["Genel küresel benlik saygısı", "Kibir ve narsisizm"],
            adjacentConstructs: ["core_self_esteem", "social_boldness", "sociability"],
            discriminantRisks: ["Sosyal özsaygıyı genel öz-değerlilikten ayrıştırmak"],
            referenceInstruments: ["IPIP-HEXACO Social Self-Esteem Scale", "HEXACO-PI-R"],
            primarySourceIds: ["src_lee_ashton_2004", "src_ashton_lee_2007"],
            secondarySourceIds: ["src_goldberg_1999_ipip"],
            turkishEvidenceSourceIds: ["src_wasti_2008_lexical"],
            behavioralIndicators: {
              cognitiveIndicators: ["Sosyal ortamlarda ilgi çekici ve sevilen biri olduğuna inanma"],
              emotionalIndicators: ["Topluluk içinde kendini rahat ve güvende hissetme"],
              motivationalIndicators: ["Sosyal etkileşimlere özgüvenle katılma isteği"],
              interpersonalIndicators: ["İnsanlarla eşit ve rahat bir iletişim dili kurma"],
              behavioralIndicatorsDetailed: [
                "Sosyal ortamlarda insanların kendisinden hoşlandığını ve değer verdiğini hisseder",
                "Yeni girdiği bir grupta kabul göreceğine ve sevileceğine dair inancı yüksektir",
                "Topluluk içinde konuşurken yetersizlik veya dışlanma endişesi duymaz",
                "Arkadaş çevresinde fikirlerine değer verilen biri olduğunu düşünür"
              ]
            },
            relevantContexts: ["social_settings", "relationships", "work_task"],
            undesiredItemPatterns: ["Herkes bana hayrandır gibi aşırı narsistik iddialar"],
            socialDesirabilityRisk: "MODERATE",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Bireyin sosyal ilişkilerdeki öznel yeterlilik ve kabul görme inancını ölçer."
          },
          items: [
            {
              itemId: "psi_ex_sse_01",
              promptTr: "Yeni insanlarla tanıştığımda genellikle benden hoşlanacaklarını ve beni seveceklerini düşünürüm.",
              promptEn: "When meeting new people, I generally think they will like me and enjoy my company.",
              behavioralIndicator: "Sosyal kabul görme beklentisi",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_ex_sse_02",
              promptTr: "Bir topluluk içindeyken çoğu zaman kendimi diğer insanlardan daha sönük ve yetersiz hissederim.",
              promptEn: "In a group, I often feel more dull and inadequate compared to other people.",
              behavioralIndicator: "Sosyal yetersizlik ve sönüklük hissi (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_ex_sse_03",
              promptTr: "Arkadaş çevremde fikirlerime ve varlığıma değer verildiğini hissederim.",
              promptEn: "I feel that my thoughts and presence are valued in my friend circle.",
              behavioralIndicator: "Sosyal değerlilik algısı",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_ex_sse_04",
              promptTr: "Sosyal ortamlarda insanların beni sıkıcı bulmasından veya beğenmemesinden endişelenirim.",
              promptEn: "In social settings, I worry that people might find me boring or dislike me.",
              behavioralIndicator: "Sosyal beğenilmeme endişesi (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_ex_sse_05",
              promptTr: "Girdiğim ortamlarda kendimle barışık ve sosyal olarak rahat bir duruş sergilerim.",
              promptEn: "In environments I enter, I display a self-assured and socially comfortable demeanor.",
              behavioralIndicator: "Sosyal ortamlarda rahat duruş",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        },
        {
          blueprint: {
            domainId: "core_personality",
            constructId: "hexaco_extraversion",
            facetId: "social_boldness",
            nameTr: "Sosyal Cesaret",
            nameEn: "Social Boldness",
            scientificDefinitionTr: "Grup önünde rahatça konuşabilme, yabancılarla kolayca iletişim başlatabilme ve liderlik rollerini üstlenirken çekinmeme eğilimi.",
            inclusionCriteria: ["Topluluk önünde konuşma rahatlığı", "Sosyal çekingenlikten uzaklık", "Girişkenlik"],
            exclusionCriteria: ["Agresif baskınlık", "Başkalarını susturma"],
            adjacentConstructs: ["assertiveness", "social_self_esteem", "sociability"],
            discriminantRisks: ["Sosyal cesareti nezaketsiz baskınlıktan ayrıştırmak"],
            referenceInstruments: ["IPIP-HEXACO Social Boldness Scale", "HEXACO-PI-R"],
            primarySourceIds: ["src_lee_ashton_2004", "src_ashton_lee_2007"],
            secondarySourceIds: ["src_goldberg_1999_ipip"],
            turkishEvidenceSourceIds: ["src_wasti_2008_lexical"],
            behavioralIndicators: {
              cognitiveIndicators: ["Fikirlerini bir kitleye açıklarken çekinmeme"],
              emotionalIndicators: ["Topluluk önünde konuşurken sahne korkusu yaşamama"],
              motivationalIndicators: ["Grup tartışmalarında inisiyatif alma arzusu"],
              interpersonalIndicators: ["Yabancılarla ilk konuşmayı başlatan taraf olma"],
              behavioralIndicatorsDetailed: [
                "Kalabalık bir grup önünde sunum yaparken veya söz alırken rahat davranır",
                "Tanımadığı insanlarla dolu bir ortama girdiğinde kolayca sohbet başlatır",
                "Bir toplantıda fikrini söylemekten veya itiraz etmekten çekinmez",
                "Grup içinde liderlik veya sözcülük rolü üstlenmekten korkmaz"
              ]
            },
            relevantContexts: ["social_settings", "work_task"],
            undesiredItemPatterns: ["Herkesi ezer geçerim gibi zorba ifadeler"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Sosyal ortamlarda girişkenlik, kamusal konuşma rahatlığı ve sosyal çekingenlik düzeyini ölçer."
          },
          items: [
            {
              itemId: "psi_ex_sbd_01",
              promptTr: "Kalabalık bir grup önünde söz alıp konuşurken kendimi son derece rahat hissederim.",
              promptEn: "I feel completely comfortable speaking up in front of a large group of people.",
              behavioralIndicator: "Topluluk önünde konuşma rahatlığı",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_ex_sbd_02",
              promptTr: "Tanımadığım insanlarla dolu bir ortama girdiğimde konuşma başlatmakta çok çekingen davranırım.",
              promptEn: "When entering an environment full of strangers, I act very shy in initiating a conversation.",
              behavioralIndicator: "Yabancılar karşısında çekingenlik (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_ex_sbd_03",
              promptTr: "Bir toplantıda veya tartışmada fikrimi açıkça savunmaktan ve öne çıkmaktan çekinmem.",
              promptEn: "In a meeting or discussion, I do not hesitate to openly defend my view and stand out.",
              behavioralIndicator: "Grup tartışmalarında öne çıkma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_ex_sbd_04",
              promptTr: "Gözlerin üzerimde olduğu sosyal durumlarda heyecandan ne söyleyeceğimi şaşırırım.",
              promptEn: "In social situations where all eyes are on me, I get flustered from excitement about what to say.",
              behavioralIndicator: "Sosyal dikkat altında panikleme (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_ex_sbd_05",
              promptTr: "Bir grupta inisiyatif alıp sohbeti yönlendirmekten keyif alırım.",
              promptEn: "I enjoy taking the initiative and steering the conversation in a group.",
              behavioralIndicator: "Sosyal inisiyatif alma",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        },
        {
          blueprint: {
            domainId: "core_personality",
            constructId: "hexaco_extraversion",
            facetId: "sociability",
            nameTr: "Sosyallik",
            nameEn: "Sociability",
            scientificDefinitionTr: "İnsanlarla bir arada olmaktan, sohbet etmekten ve sosyal etkinliklere katılmaktan keyif alma; yalnızlık yerine insan etkileşimini tercih etme eğilimi.",
            inclusionCriteria: ["Sosyal etkileşim tercihi", "Sohbet etmekten zevk alma", "Sosyal çevre genişliği"],
            exclusionCriteria: ["Yalnız kalamama patolojisi", "Aşırı gevezelik"],
            adjacentConstructs: ["social_boldness", "liveliness", "social_connectedness"],
            discriminantRisks: ["Sosyallik arzusunu sosyal cesaretten ayrıştırmak"],
            referenceInstruments: ["IPIP-HEXACO Sociability Scale", "HEXACO-PI-R"],
            primarySourceIds: ["src_lee_ashton_2004", "src_ashton_lee_2007"],
            secondarySourceIds: ["src_goldberg_1999_ipip"],
            turkishEvidenceSourceIds: ["src_wasti_2008_lexical"],
            behavioralIndicators: {
              cognitiveIndicators: ["Sosyal hayatın hayatı zenginleştirdiğine inanma"],
              emotionalIndicators: ["İnsanlarla vakit geçirdikten sonra enerji dolma"],
              motivationalIndicators: ["Sık sık arkadaşlarıyla buluşma ve etkinlik organize etme isteği"],
              interpersonalIndicators: ["Geniş bir sosyal çevre edinme ve sıcak sohbetler kurma"],
              behavioralIndicatorsDetailed: [
                "Boş zamanlarını arkadaşlarıyla veya insanlarla bir arada geçirmeyi sever",
                "Kalabalık partiler ve sosyal buluşmalar ona keyif ve canlılık verir",
                "Uzun süre tek başına kaldığında insanlarla sohbet etmeyi özler",
                "Yeni arkadaşlıklar kurmaktan ve sosyal çevresini genişletmekten hoşlanır"
              ]
            },
            relevantContexts: ["social_settings", "everyday_life"],
            undesiredItemPatterns: ["Yalnızlıktan nefret ederim gibi zorunluluk bildiren ifadeler"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "İnsan etkileşimi ve sosyal temas ihtiyacının mizaçsal yoğunluğunu ölçer."
          },
          items: [
            {
              itemId: "psi_ex_soc_01",
              promptTr: "İnsanlarla bir araya gelip sohbet etmek bana her zaman büyük bir enerji ve keyif verir.",
              promptEn: "Gathering and chatting with people always gives me great energy and enjoyment.",
              behavioralIndicator: "Sosyal etkileşimden keyif alma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_ex_soc_02",
              promptTr: "Boş vakitlerimi insanlarla geçirmek yerine genellikle tek başıma kalmayı tercih ederim.",
              promptEn: "I usually prefer staying alone rather than spending my free time with people.",
              behavioralIndicator: "Yalnızlık tercihi / düşük sosyallik (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_ex_soc_03",
              promptTr: "Kalabalık etkinliklere ve arkadaş buluşmalarına katılmaktan zevk alırım.",
              promptEn: "I enjoy participating in crowded events and friend gatherings.",
              behavioralIndicator: "Sosyal etkinlik katılımı",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_ex_soc_04",
              promptTr: "Sosyal ortamlarda uzun süre bulunmak beni çabucak yorar ve uzaklaşmak isterim.",
              promptEn: "Being in social environments for a long time exhausts me quickly and I want to step away.",
              behavioralIndicator: "Sosyal ortamlarda çabuk yorulma (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_ex_soc_05",
              promptTr: "Yeni insanlarla tanışıp arkadaş çevremi genişletmekten hoşlanırım.",
              promptEn: "I enjoy meeting new people and expanding my friend circle.",
              behavioralIndicator: "Yeni arkadaşlıklar kurma arzusu",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        },
        {
          blueprint: {
            domainId: "core_personality",
            constructId: "hexaco_extraversion",
            facetId: "liveliness",
            nameTr: "Canlılık ve İyimserlik",
            nameEn: "Liveliness",
            scientificDefinitionTr: "Yüksek enerjili, neşeli, coşkulu ve pozitif bir ruh hali sergileme; gündelik hayata neşe ve iyimserlikle yaklaşma eğilimi.",
            inclusionCriteria: ["Yüksek pozitif duygulanım", "Neşe ve coşku", "Gündelik enerji"],
            exclusionCriteria: ["Mani semptomları", "Yüzeysel polyannacılık"],
            adjacentConstructs: ["positive_affect_trait", "subjective_vitality", "sociability"],
            discriminantRisks: ["Canlılık mizacını durumsal aşırı uyarılmadan ayrıştırmak"],
            referenceInstruments: ["IPIP-HEXACO Liveliness Scale", "HEXACO-PI-R"],
            primarySourceIds: ["src_lee_ashton_2004", "src_ashton_lee_2007"],
            secondarySourceIds: ["src_goldberg_1999_ipip"],
            turkishEvidenceSourceIds: ["src_wasti_2008_lexical"],
            behavioralIndicators: {
              cognitiveIndicators: ["Güne enerjik ve pozitif bir beklentiyle başlama"],
              emotionalIndicators: ["Coşkulu, neşeli ve kıpır kıpır bir ruh hali"],
              motivationalIndicators: ["Etrafına neşe saçma ve hayatın tadını çıkarma arzusu"],
              interpersonalIndicators: ["Güleryüzlü, esprili ve canlı bir iletişim tarzı"],
              behavioralIndicatorsDetailed: [
                "Çoğu zaman neşeli, hareketli ve enerjik hisseder",
                "Etrafındaki insanlara pozitif enerji ve canlılık yayar",
                "Gündelik olaylara iyimser bir pencereden bakar",
                "Moral bozukluklarının ardından hızlıca neşeli haline geri döner"
              ]
            },
            relevantContexts: ["everyday_life", "social_settings"],
            undesiredItemPatterns: ["Asla üzülmem gibi gerçekçi olmayan ifadeler"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 1,
            measurementRationale: "Pozitif mizaç enerjisi ve neşeli duygulanım düzeyini değerlendirir."
          },
          items: [
            {
              itemId: "psi_ex_liv_01",
              promptTr: "Gündelik hayatımda genellikle neşeli, enerjik ve hayat dolu bir ruh haline sahibimdir.",
              promptEn: "In my daily life, I generally have a cheerful, energetic, and lively mood.",
              behavioralIndicator: "Gündelik neşe ve canlılık",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_ex_liv_02",
              promptTr: "Çoğu zaman kendimi halsiz, keyifsiz ve düşük enerjili hissederim.",
              promptEn: "Most of the time I feel sluggish, dispirited, and low-energy.",
              behavioralIndicator: "Düşük canlılık ve halsizlik (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_ex_liv_03",
              promptTr: "İyimser ve coşkulu yapımla etrafımdaki insanları da canlandırırım.",
              promptEn: "With my optimistic and enthusiastic nature, I also enliven the people around me.",
              behavioralIndicator: "Çevreye pozitif enerji yayma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_ex_liv_04",
              promptTr: "Gülmeyi, şakalaşmayı ve hayatın eğlenceli yönlerini yakalamayı severim.",
              promptEn: "I love laughing, joking, and catching the fun sides of life.",
              behavioralIndicator: "Mizah ve eğlenceye yatkınlık",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_ex_liv_05",
              promptTr: "Zor bir günün ardından bile pozitif ve hevesli ruh halimi korumayı başarırım.",
              promptEn: "Even after a hard day, I manage to preserve my positive and eager mood.",
              behavioralIndicator: "Ruh hali dayanıklılığı",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        }
      ]
    }
  ]
};

module.exports = { DOMAIN_1_PART1 };
