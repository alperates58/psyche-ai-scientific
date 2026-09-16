/**
 * DOMAIN 11: OPTIONAL / RESEARCH-ONLY DARK TETRAD (SUBCLINICAL) — 1 CONSTRUCT, 4 FACETS (20 ITEMS)
 * Complete blueprints and original items.
 */

const DOMAIN_11_DATA = {
  domainId: "optional_dark_tetrad",
  domainNameTr: "Opsiyonel / Araştırma Odaklı Karanlık Dörtlü (Subklinik)",
  domainNameEn: "Optional / Research-Only Dark Tetrad (Subclinical)",
  constructs: [
    // 1. Subclinical Dark Tetrad
    {
      constructId: "dark_tetrad_subclinical",
      facets: [
        {
          blueprint: {
            domainId: "optional_dark_tetrad",
            constructId: "dark_tetrad_subclinical",
            facetId: "machiavellianism",
            nameTr: "Makyavelizm (Stratejik Manipülasyon)",
            nameEn: "Machiavellianism",
            scientificDefinitionTr: "Sosyal ilişkilerde pragmatik, çıkarcı, stratejik ve duygudan arındırılmış bir yaklaşımla başkalarını kendi hedefleri doğrultusunda yönlendirme ve manipüle etme eğilimi.",
            inclusionCriteria: ["Stratejik manipülasyon", "Çıkarcı ittifaklar", "Duygusal mesafeli pragmatizm"],
            exclusionCriteria: ["Klinik antisosyal bozukluk", "Açık şiddet"],
            adjacentConstructs: ["sincerity", "fairness", "psychopathy"],
            discriminantRisks: ["Subklinik Makyavelist stratejikliği klinik psikopatiden ve dürüstlük düşüklüğünden ayırmak"],
            referenceInstruments: ["Short Dark Triad (SD3 - Machiavellianism Subscale)", "Mach-IV"],
            primarySourceIds: ["src_paulhus_2002_dark_triad"],
            secondarySourceIds: ["src_lee_ashton_2004"],
            turkishEvidenceSourceIds: ["src_ozsoy_2017_sd3_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Amaca ulaşmak için her yolun mübah olabileceğine inanma"],
              emotionalIndicators: ["Manipülasyon yaparken suçluluk duymama ve soğukkanlı kalma"],
              motivationalIndicators: ["Kişisel güç, kontrol ve çıkarı maksimize etme dürtüsü"],
              interpersonalIndicators: ["İnsanların zayıf yönlerini tespit edip bunları lehine kullanma"],
              behavioralIndicatorsDetailed: [
                "Hedeflerine ulaşmak için insanları fark ettirmeden yönlendirmeyi ve ikna etmeyi bilir",
                "İlişkilerinde duygulardan ziyade stratejik çıkarlarını ve kazanımlarını gözetir",
                "Gerektiğinde insanların duymak istediği şeyleri söyleyerek onları kendi tarafına çeker",
                "Başkalarının zayıf noktalarını kendi menfaati için bir koz olarak kullanabilir"
              ]
            },
            relevantContexts: ["work_task", "social_settings", "stress_decision"],
            undesiredItemPatterns: ["Suç örgütü kurarım gibi klinik/adli ifadeler"],
            socialDesirabilityRisk: "HIGH",
            clinicalRisk: "LOW_SUBCLINICAL",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Subklinik karanlık dörtlü kuramında stratejik manipülasyon ve pragmatizmi ölçer."
          },
          items: [
            {
              itemId: "psi_dt_mac_01",
              promptTr: "Kendi hedeflerime ulaşmak için insanları fark ettirmeden yönlendirmek ve lehimde kullanmak benim için doğaldır.",
              promptEn: "Directing and using people subtly to achieve my own goals feels natural to me.",
              behavioralIndicator: "Gizli yönlendirme ve amaca ulaşma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_dt_mac_02",
              promptTr: "Bana büyük bir avantaj sağlayacak olsa bile asla başkalarını kandıracak veya yönlendirecek taktiklere başvurmam.",
              promptEn: "Even if it gives me a massive advantage, I never resort to tactics that deceive or manipulate others.",
              behavioralIndicator: "Manipülasyondan kesin kaçınma (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_dt_mac_03",
              promptTr: "İlişkilerde ve iş hayatında en önemli şey duygusallık değil, stratejik hamlelerle kendi çıkarını korumaktır.",
              promptEn: "In relationships and work life, the most important thing is not sentimentality but protecting self-interest with strategic moves.",
              behavioralIndicator: "Stratejik çıkarı duyguların üstünde tutma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_dt_mac_04",
              promptTr: "İşlerimi kolaylaştırmak için insanların zayıf yönlerini ve hoşlandıkları şeyleri tespit edip kullanırım.",
              promptEn: "To make my work easier, I identify people's weak spots and personal likes, and leverage them.",
              behavioralIndicator: "Zayıf noktaları tespit edip kullanma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_dt_mac_05",
              promptTr: "İnsanlarla kurduğum ilişkilerde hiçbir gizli hesap gütmez, daima tamamen şeffaf ve açık davranırım.",
              promptEn: "In the relationships I build, I have no hidden agenda and always act completely transparently and openly.",
              behavioralIndicator: "Tam şeffaflık ve hesapsızlık (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            }
          ]
        },
        {
          blueprint: {
            domainId: "optional_dark_tetrad",
            constructId: "dark_tetrad_subclinical",
            facetId: "grandiose_narcissism",
            nameTr: "Büyüklenmeci Narsisizm (Subklinik)",
            nameEn: "Grandiose Narcissism",
            scientificDefinitionTr: "Kendini diğer insanlardan üstün, ayrıcalıklı ve özel görme; sürekli hayranlık, dikkat ve özel muamele bekleme eğilimi.",
            inclusionCriteria: ["Üstünlük inancı", "Hayranlık beklentisi", "Ayrıcalıklı hissetme"],
            exclusionCriteria: ["Klinik narsistik kişilik bozukluğu", "Kırılgan narsisizm"],
            adjacentConstructs: ["modesty", "self_esteem", "machiavellianism"],
            discriminantRisks: ["Büyüklenmeci narsisizmi sağlıklı yüksek öz-saygıdan (self-esteem) ayırmak"],
            referenceInstruments: ["Short Dark Triad (SD3 - Narcissism Subscale)", "NPI-16"],
            primarySourceIds: ["src_paulhus_2002_dark_triad"],
            secondarySourceIds: ["src_lee_ashton_2004"],
            turkishEvidenceSourceIds: ["src_ozsoy_2017_sd3_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Diğer insanlardan çok daha üstün yeteneklere sahip olduğunu düşünme"],
              emotionalIndicators: ["Övülmediğinde veya dikkat çekmediğinde içsel rahatsızlık hissetme"],
              motivationalIndicators: ["Her ortamda ilgi odağı olma ve hayranlık toplama arzusu"],
              interpersonalIndicators: ["Sıradan insanlardan farklı kurallara tabi olması gerektiğini savunma"],
              behavioralIndicatorsDetailed: [
                "Girdiği her ortamda dikkatlerin ve hayran bakışların üzerinde toplanmasını ister",
                "Kendisini ortalama insanlardan belirgin şekilde daha zeki ve yetenekli görür",
                "Özel muameleyi ve ayrıcalıkları sonuna kadar hak ettiğine inanır",
                "Önemli ve nüfuzlu insanlarla birlikte anılmaktan büyük gurur duyar"
              ]
            },
            relevantContexts: ["social_settings", "work_task", "relationships"],
            undesiredItemPatterns: ["Tanrısal güçlerim var gibi psikotik grandiyözite"],
            socialDesirabilityRisk: "HIGH",
            clinicalRisk: "LOW_SUBCLINICAL",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Subklinik narsisizmin büyüklenmeci ve ayrıcalıklılık algısı boyutunu ölçer."
          },
          items: [
            {
              itemId: "psi_dt_nar_01",
              promptTr: "Girdiğim ortamlarda insanların bana hayranlık duymasını ve dikkatlerin üzerimde olmasını isterim.",
              promptEn: "In environments I enter, I want people to admire me and the spotlight to be on me.",
              behavioralIndicator: "Hayranlık ve dikkat çekme arzusu",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_dt_nar_02",
              promptTr: "Kendimi kimseden üstün veya ayrıcalıklı görmem; herkes gibi sıradan bir insan olduğumun bilincindeyimdir.",
              promptEn: "I do not see myself as superior or entitled compared to anyone; I am conscious of being an ordinary person like everyone.",
              behavioralIndicator: "Sıradanlık bilinci ve alçakgönüllülük (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_dt_nar_03",
              promptTr: "Pek çok konuda etrafımdaki çoğu insandan çok daha yetenekli ve özel olduğumu bilirim.",
              promptEn: "I know that I am much more talented and special than most people around me in many areas.",
              behavioralIndicator: "Üstünlük ve özel olma inancı",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_dt_nar_04",
              promptTr: "Bana sıradan biri gibi davranılması yerine özel bir saygı ve ayrıcalık gösterilmesini hak ettiğimi düşünürüm.",
              promptEn: "I believe I deserve special respect and privilege rather than being treated like an ordinary person.",
              behavioralIndicator: "Ayrıcalıklı muamele beklentisi",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_dt_nar_05",
              promptTr: "Övülmekten veya ilgi odağı olmaktan rahatsız olur, arka planda kalmayı tercih ederim.",
              promptEn: "Being praised or being the center of attention makes me uncomfortable; I prefer staying in the background.",
              behavioralIndicator: "İlgi odağı olmaktan kaçınma (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            }
          ]
        },
        {
          blueprint: {
            domainId: "optional_dark_tetrad",
            constructId: "dark_tetrad_subclinical",
            facetId: "psychopathy",
            nameTr: "Subklinik Psikopati (Duygusal Soğukluk ve Dürtüsellik)",
            nameEn: "Subclinical Psychopathy",
            scientificDefinitionTr: "Düşük empati, duygusal duyarsızlık, pişmanlık eksikliği, risk alma ve anlık dürtüleri kontrol etmede zorlanma ile karakterize subklinik kişilik boyutu.",
            inclusionCriteria: ["Duygusal soğukluk", "Pişmanlık duymama", "Dürtüsel heyecan arayışı"],
            exclusionCriteria: ["Klinik psikopati/adli cezaevi profili", "Ağır şiddet suçları"],
            adjacentConstructs: ["prudence", "empathic_concern", "fearfulness"],
            discriminantRisks: ["Subklinik psikopatik eğilimleri klinik antisosyal kişilik bozukluğundan ayırmak"],
            referenceInstruments: ["Short Dark Triad (SD3 - Psychopathy Subscale)", "SRP-III"],
            primarySourceIds: ["src_paulhus_2002_dark_triad"],
            secondarySourceIds: ["src_lee_ashton_2004"],
            turkishEvidenceSourceIds: ["src_ozsoy_2017_sd3_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Kuralların ve vicdanın zayıf insanlar için olduğunu düşünme"],
              emotionalIndicators: ["Başkalarına zarar verdiğinde bile suçluluk veya vicdan azabı hissetmeme"],
              motivationalIndicators: ["Anlık heyecan, risk ve tehlikeli deneyimler yaşama isteği"],
              interpersonalIndicators: ["İlişkilerde duygusal bağ kurmadan soğuk ve pervasız davranma"],
              behavioralIndicatorsDetailed: [
                "Yaptığı bir hata başkalarını üzse bile kolay kolay vicdan azabı çekmez",
                "Sonuçlarını düşünmeden sırf o anki heyecan için tehlikeli riskler alabilir",
                "İnsanların duygusal tepkilerine karşı kayıtsız ve soğukkanlı kalır",
                "Toplumsal kuralları çiğnemekten veya sınırları zorlamaktan çekinmez"
              ]
            },
            relevantContexts: ["stress_decision", "social_settings", "everyday_life"],
            undesiredItemPatterns: ["Cinayet işlerim veya fiziksel şiddet uygularım gibi adli/klinik ifadeler"],
            socialDesirabilityRisk: "HIGH",
            clinicalRisk: "LOW_SUBCLINICAL",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Subklinik düzeydeki duyarsızlık, empati düşüklüğü ve dürtüsel cüreti ölçer."
          },
          items: [
            {
              itemId: "psi_dt_psy_01",
              promptTr: "Bir eylemim başkalarının canını sıksa veya onları üzse bile sonrasında pek vicdan azabı duymam.",
              promptEn: "Even if an action of mine upsets or hurts others, I rarely feel remorse afterwards.",
              behavioralIndicator: "Pişmanlık ve suçluluk eksikliği",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_dt_psy_02",
              promptTr: "Başkasına istemeden bile bir zarar verdiğimde günlerce bunun üzüntüsünü ve suçluluğunu yaşarım.",
              promptEn: "When I accidentally cause harm to someone, I feel sorrow and guilt about it for days.",
              behavioralIndicator: "Güçlü vicdan ve suçluluk duyarlılığı (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_dt_psy_03",
              promptTr: "Sırf anlık heyecan yaşamak veya can sıkıntımı gidermek için tehlikeli ve riskli işlere kalkışabilirim.",
              promptEn: "Just to experience thrill or relieve boredom, I can jump into dangerous and risky ventures.",
              behavioralIndicator: "Dürtüsel heyecan arayışı ve pervasızlık",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_dt_psy_04",
              promptTr: "İnsanların dramatik duygusal tepkileri veya ağlamaları karşısında tamamen soğukkanlı ve etkilenmemiş kalırım.",
              promptEn: "In the face of people's dramatic emotional reactions or crying, I remain completely cold and unmoved.",
              behavioralIndicator: "Duygusal hissizlik ve soğukkanlılık",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_dt_psy_05",
              promptTr: "Kuralları çiğnemekten veya birilerinin hakkına girmekten derin bir rahatsızlık ve çekince duyarım.",
              promptEn: "I feel deep discomfort and hesitation about breaking rules or infringing upon others' rights.",
              behavioralIndicator: "Kural ve hak ihlalinden çekinme (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            }
          ]
        },
        {
          blueprint: {
            domainId: "optional_dark_tetrad",
            constructId: "dark_tetrad_subclinical",
            facetId: "everyday_sadism_subclinical",
            nameTr: "Gündelik Sadizm (Subklinik)",
            nameEn: "Everyday Sadism (Subclinical)",
            scientificDefinitionTr: "Başkalarının küçük düşmesini, yenilmesini, zor durumda kalmasını veya fiziksel/psikolojik acı çekmesini izlemekten ya da sebep olmaktan üstü kapalı bir keyif alma eğilimi.",
            inclusionCriteria: ["Başkalarının zor durumundan keyif alma", "Agresif mizah/alaycılık", "Zalimce oyunlar"],
            exclusionCriteria: ["Klinik cinsel sadizm", "Ağır fiziksel işkence"],
            adjacentConstructs: ["psychopathy", "machiavellianism", "forgiveness"],
            discriminantRisks: ["Gündelik subklinik sadizmi klinik cinsel sadizm ve adli şiddetten ayırmak"],
            referenceInstruments: ["Comprehensive Assessment of Sadistic Tendencies (CAST)", "Short Sadistic Impulse Scale (SSIS)"],
            primarySourceIds: ["src_buckels_2013_sadism"],
            secondarySourceIds: ["src_paulhus_2002_dark_triad"],
            turkishEvidenceSourceIds: ["src_ozsoy_2017_sd3_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Bazı insanların aşağılanmayı veya acı çekmeyi hak ettiğini düşünme"],
              emotionalIndicators: ["Başkalarının zor duruma düştüğünü gördüğünde gizli bir eğlenme hissi"],
              motivationalIndicators: ["İnsanları alaya alma ve zora sokmaktan tatmin sağlama"],
              interpersonalIndicators: ["İğneleyici şakalar ve acımasız alaylarla insanları zor durumda bırakma"],
              behavioralIndicatorsDetailed: [
                "Birisinin küçük düştüğü veya utandığı anları izlemekten gizli bir keyif alır",
                "Video oyunlarında veya şakalarda karakterlere/insanlara acı çektirmekten eğlenir",
                "İnsanların hatalarıyla acımasızca ve iğneleyici bir dille alay eder",
                "Başkalarının yenilgisini veya sıkıntısını izlerken içten içe eğlenir"
              ]
            },
            relevantContexts: ["social_settings", "everyday_life"],
            undesiredItemPatterns: ["Canlı hayvanlara işkence ederim veya insanları yaralarım gibi ağır adli/klinik ifadeler"],
            socialDesirabilityRisk: "HIGH",
            clinicalRisk: "LOW_SUBCLINICAL",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Subklinik karanlık dörtlüde gündelik sadist eğilimleri ve zalimce haz duygusunu ölçer."
          },
          items: [
            {
              itemId: "psi_dt_sad_01",
              promptTr: "Birisinin küçük düştüğü, zor durumda kaldığı veya rezil olduğu anları izlemekten içten içe keyif alırım.",
              promptEn: "I secretly enjoy watching moments when someone is humiliated, in a tough spot, or embarrassed.",
              behavioralIndicator: "Başkalarının küçük düşmesinden keyif alma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_dt_sad_02",
              promptTr: "Bir insanın acı çektiğini veya zor duruma düştüğünü görmek bana her zaman derin bir rahatsızlık verir.",
              promptEn: "Seeing a person suffer or get into a tough situation always causes me deep discomfort.",
              behavioralIndicator: "Başkalarının acısından rahatsız olma (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_dt_sad_03",
              promptTr: "İğneleyici şakalar ve sert alaylarla insanları köşeye sıkıştırmaktan ve terletmekten hoşlanırım.",
              promptEn: "I enjoy cornering people and making them sweat with sarcastic jokes and harsh teasing.",
              behavioralIndicator: "Alay ve iğnelemeyle insanları zora sokma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_dt_sad_04",
              promptTr: "Video oyunlarında veya kurgusal hikayelerde karakterlere acı çektirmek veya onları yok etmek bana eğlenceli gelir.",
              promptEn: "In video games or fictional stories, tormenting or destroying characters feels entertaining to me.",
              behavioralIndicator: "Kurgusal/sanal ortamda acı çektirmekten eğlenme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_dt_sad_05",
              promptTr: "Bana kötülük yapmış birinin bile başına talihsiz bir olay geldiğinde sevinemem, üzülürüm.",
              promptEn: "Even when misfortune befalls someone who wronged me, I cannot rejoice; I feel sorry.",
              behavioralIndicator: "Düşmanının bile acısına sevinmeme (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            }
          ]
        }
      ]
    }
  ]
};

module.exports = DOMAIN_11_DATA;
