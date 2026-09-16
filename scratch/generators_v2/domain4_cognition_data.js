/**
 * DOMAIN 4: COGNITION, METACOGNITION & DECISION STYLES — 4 CONSTRUCTS, 9 FACETS (45 ITEMS)
 * Complete blueprints and original items.
 */

const DOMAIN_4_DATA = {
  domainId: "cognition_decision",
  domainNameTr: "Biliş, Üstbiliş ve Karar Tarzları",
  domainNameEn: "Cognition, Metacognition & Decision Styles",
  constructs: [
    // 1. Epistemic Drive & Closure
    {
      constructId: "epistemic_drive",
      facets: [
        {
          blueprint: {
            domainId: "cognition_decision",
            constructId: "epistemic_drive",
            facetId: "need_for_cognition",
            nameTr: "Biliş İhtiyacı",
            nameEn: "Need for Cognition",
            scientificDefinitionTr: "Zihinsel çaba gerektiren karmaşık görevlere girmekten, derinlemesine düşünmekten ve analitik problem çözme süreçlerinden içsel bir zevk alma eğilimi.",
            inclusionCriteria: ["Zihinsel çabadan zevk alma", "Karmaşık problemleri sevme", "Derin düşünme motivasyonu"],
            exclusionCriteria: ["Yüzeysel ezbercilik", "Zihinsel tembellik"],
            adjacentConstructs: ["rational_analytical_thinking", "inquisitiveness", "need_for_cognitive_closure"],
            discriminantRisks: ["Biliş ihtiyacını salt akademik başarıdan veya kapanma ihtiyacından ayrıştırmak"],
            referenceInstruments: ["Need for Cognition Scale (NCS / NCS-18)"],
            primarySourceIds: ["src_cacioppo_1982_nfc"],
            secondarySourceIds: ["src_epstein_1996_rei"],
            turkishEvidenceSourceIds: ["src_gulgoz_1995_nfc_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Zorlayıcı düşünsel problemlerin zihni açtığına inanma"],
              emotionalIndicators: ["Karmaşık bir konuyu derinlemesine çözerken entelektüel tatmin"],
              motivationalIndicators: ["Kolay ve yüzeysel görevler yerine derinlikli görevleri seçme"],
              interpersonalIndicators: ["Düşünce ağırlıklı ve felsefi sohbetlere istekli katılım"],
              behavioralIndicatorsDetailed: [
                "Zihinsel çaba ve derin düşünme gerektiren problemleri çözmekten keyif alır",
                "Kolay ve basit işler yerine karmaşık ve düşündürücü görevleri tercih eder",
                "Bir konu hakkında sadece yüzeysel bilgiyle yetinmeyip detaylı analiz yapar",
                "Zihnini zorlayan yeni kavramlar üzerine kafa yormayı sever"
              ]
            },
            relevantContexts: ["work_task", "decisions", "everyday_life"],
            undesiredItemPatterns: ["Ben bir dahiyim gibi kibirli ifadeler"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Bireyin bilişsel çaba harcama ve derin analitik düşünme motivasyonunu ölçer."
          },
          items: [
            {
              itemId: "psi_cd_nfc_01",
              promptTr: "Zihnimi zorlayan ve derinlemesine düşünmemi gerektiren karmaşık problemleri çözmekten büyük keyif alırım.",
              promptEn: "I take great pleasure in solving complex problems that challenge my mind and require deep thinking.",
              behavioralIndicator: "Karmaşık problemleri çözme zevki",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cd_nfc_02",
              promptTr: "Çok fazla düşünmeyi gerektiren işler bana sıkıcı ve yorucu gelir, basit görevleri tercih ederim.",
              promptEn: "Tasks requiring too much thinking seem boring and tiring to me; I prefer simple tasks.",
              behavioralIndicator: "Zihinsel çabadan kaçınma (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_cd_nfc_03",
              promptTr: "Bir durumun veya olayın sadece yüzeydeki sonucuna değil, arkasındaki neden-sonuç zincirine odaklanırım.",
              promptEn: "I focus not only on the surface outcome of an event, but on the cause-and-effect chain behind it.",
              behavioralIndicator: "Neden-sonuç zincirine derin odaklanma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cd_nfc_04",
              promptTr: "Yeni ve karmaşık kavramlar üzerine kafa yormak bana zihinsel bir tatmin duygusu verir.",
              promptEn: "Pondering new and complex concepts gives me a sense of mental fulfillment.",
              behavioralIndicator: "Kavramsal düşünmeden entelektüel tatmin",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cd_nfc_05",
              promptTr: "Düşünsel olarak zorlanmak yerine beynimi yormayacak hafif şeylerle vakit geçirmeyi yeğlerim.",
              promptEn: "Rather than being challenged intellectually, I would rather spend time on light things that won't strain my brain.",
              behavioralIndicator: "Zihinsel konfor tercihi (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            }
          ]
        },
        {
          blueprint: {
            domainId: "cognition_decision",
            constructId: "epistemic_drive",
            facetId: "need_for_cognitive_closure",
            nameTr: "Bilişsel Kapanma İhtiyacı",
            nameEn: "Need for Cognitive Closure",
            scientificDefinitionTr: "Belirsizlik ve karmaşıklıktan kaçınarak bir an önce kesin, net ve değişmez bir karara veya sonuca ulaşma arzusu.",
            inclusionCriteria: ["Kesinlik ve netlik arzusu", "Belirsizliği hızlı sonlandırma", "Öngörülebilirlik arayışı"],
            exclusionCriteria: ["Açık uçlu derin keşif", "Belirsizlik toleransı"],
            adjacentConstructs: ["intolerance_of_uncertainty", "prudence", "need_for_cognition"],
            discriminantRisks: ["Kapanma ihtiyacını (hızlı kesin sonuca varma) genel belirsizlik tahammülsüzlüğünden ayrıştırmak"],
            referenceInstruments: ["Need for Closure Scale (NFCS - Kruglanski & Webster)"],
            primarySourceIds: ["src_webster_kruglanski_1994_nfcc"],
            secondarySourceIds: ["src_cacioppo_1982_nfc"],
            turkishEvidenceSourceIds: ["src_yurtsever_2001_nfcc_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Kararsızlığın ve muğlak durumların tahammül edilemez olduğuna inanma"],
              emotionalIndicators: ["Bir konu havada kaldığında içsel huzursuzluk duyma"],
              motivationalIndicators: ["Hızlıca kesin bir hükme varıp konuyu kapatma isteği"],
              interpersonalIndicators: ["Net, açık ve kesin kurallarla yönetilen ilişkileri tercih etme"],
              behavioralIndicatorsDetailed: [
                "Bir konu belirsiz veya havada kaldığında hemen kesin bir sonuca bağlamak ister",
                "Gri alanlar ve çok anlamlı durumlar yerine siyah-beyaz netlikten hoşlanır",
                "Karar verdikten sonra fikrini tekrar tekrar sorgulamaktan kaçınır",
                "Öngörülebilir ve net kuralların olduğu ortamları tercih eder"
              ]
            },
            relevantContexts: ["decisions", "uncertainty", "planning"],
            undesiredItemPatterns: ["Her zaman şüpheciyim gibi açık uçlu ifadeler"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Bireyin belirsizliği sonlandırıp net ve kesin bir yargıya ulaşma arzusunu (Closure) ölçer."
          },
          items: [
            {
              itemId: "psi_cd_nfcc_01",
              promptTr: "Bir konu havada veya belirsiz kaldığında büyük bir huzursuzluk hisseder ve hemen kesin bir sonuca varmak isterim.",
              promptEn: "When a topic remains up in the air or ambiguous, I feel great unease and want to reach a definitive conclusion immediately.",
              behavioralIndicator: "Belirsizliği hızlıca netleştirme arzusu",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cd_nfcc_02",
              promptTr: "Kararlarımın kesinleşmeden uzun süre açık uçlu ve esnek kalmasından rahatsızlık duymam.",
              promptEn: "I am not bothered by my decisions remaining open-ended and flexible for a long time before being finalized.",
              behavioralIndicator: "Açık uçluluğu tolere etme (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_cd_nfcc_03",
              promptTr: "Her durumun net kurallara ve öngörülebilir sınırlara sahip olmasını tercih ederim.",
              promptEn: "I prefer every situation to have clear rules and predictable boundaries.",
              behavioralIndicator: "Net kural ve öngörülebilirlik tercihi",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cd_nfcc_04",
              promptTr: "Bir konuda karar verdikten sonra yeni bilgilere göre fikrimi baştan aşağı değiştirmekte zorlanmam.",
              promptEn: "After making a decision on a matter, I find it easy to change my mind completely based on new information.",
              behavioralIndicator: "Karar sonrası esneklik ve açık fikirlilik (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_cd_nfcc_05",
              promptTr: "Muallak ve karmaşık durumlar karşısında hızla net bir tavır alıp konuyu kapatmayı severim.",
              promptEn: "In ambiguous and complex situations, I like to take a clear stance quickly and close the matter.",
              behavioralIndicator: "Hızlı net tavır alıp konuyu kapatma",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        }
      ]
    },

    // 2. Dual-Process Thinking Styles
    {
      constructId: "thinking_styles",
      facets: [
        {
          blueprint: {
            domainId: "cognition_decision",
            constructId: "thinking_styles",
            facetId: "rational_analytical_thinking",
            nameTr: "Rasyonel-Analitik Düşünme",
            nameEn: "Rational-Analytical Thinking",
            scientificDefinitionTr: "Karar verirken ve problemleri çözerken mantık, kanıt, nesnel veriler ve sistematik akıl yürütme ilkelerine dayanma eğilimi.",
            inclusionCriteria: ["Mantıksal çıkarım", "Kanıta dayalı analiz", "Nesnel değerlendirme"],
            exclusionCriteria: ["Duygusal körlük", "Katı dogmatizm"],
            adjacentConstructs: ["need_for_cognition", "intuitive_experiential_thinking", "decision_style_maximizing"],
            discriminantRisks: ["Rasyonel analitik düşünmeyi sezgisel karar tarzından ayrıştırmak"],
            referenceInstruments: ["Rational-Experiential Inventory (REI - Rational Scale)"],
            primarySourceIds: ["src_epstein_1996_rei"],
            secondarySourceIds: ["src_cacioppo_1982_nfc"],
            turkishEvidenceSourceIds: ["src_bulus_2011_rei_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Kararların mantıksal argümanlara dayanması gerektiğine inanma"],
              emotionalIndicators: ["Kanıtlara dayalı sonuca ulaştığında zihinsel güven hissi"],
              motivationalIndicators: ["Verileri ve gerçekleri adım adım analiz etme isteği"],
              interpersonalIndicators: ["Görüşlerini mantıklı gerekçelerle savunma"],
              behavioralIndicatorsDetailed: [
                "Karar vermeden önce mevcut verileri ve kanıtları sistematik olarak inceler",
                "Duygusal dürtüler yerine mantıksal gerekçelere göre hareket eder",
                "Bir iddiayı kabul etmeden önce arkasındaki kanıtların sağlamlığını sorgular",
                "Analitik ve adım adım problem çözme yaklaşımını benimser"
              ]
            },
            relevantContexts: ["decisions", "work_task", "planning"],
            undesiredItemPatterns: ["Duyguları tamamen yok sayarım gibi insandışı ifadeler"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 1,
            measurementRationale: "Bilişsel ikili süreç kuramında Sistem 2'yi temsil eden rasyonel-analitik düşünme tarzını ölçer."
          },
          items: [
            {
              itemId: "psi_cd_rat_01",
              promptTr: "Önemli bir karar verirken hislerimden çok nesnel kanıtlara ve mantıksal gerekçelere güvenirim.",
              promptEn: "When making an important decision, I rely on objective evidence and logical reasons rather than my feelings.",
              behavioralIndicator: "Nesnel kanıta ve mantığa dayanma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cd_rat_02",
              promptTr: "Problemleri çözerken mantıklı ve adım adım bir analiz yapmak bana en güvenilir yol olarak gelir.",
              promptEn: "When solving problems, making a logical and step-by-step analysis seems to me the most reliable way.",
              behavioralIndicator: "Adım adım analitik problem çözme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cd_rat_03",
              promptTr: "Kararlarımı mantıksal bir değerlendirme yapmadan, sadece anlık duygularımın rüzgarına bırakırım.",
              promptEn: "I leave my decisions purely to the wind of momentary emotions without making a logical evaluation.",
              behavioralIndicator: "Duygusal ve mantıksız karar alma (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_cd_rat_04",
              promptTr: "Bir fikri kabul etmeden önce arkasındaki verilerin ve kanıtların tutarlılığını dikkatle incelerim.",
              promptEn: "Before accepting an idea, I carefully examine the consistency of the data and evidence behind it.",
              behavioralIndicator: "Kanıt tutarlılığını denetleme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cd_rat_05",
              promptTr: "Kişisel tercihlerimde dahi artı ve eksi yönleri mantık çerçevesinde tartarak sonuca ulaşırım.",
              promptEn: "Even in my personal preferences, I reach a conclusion by weighing pros and cons within a logical framework.",
              behavioralIndicator: "Artı-eksi analizi ile mantıksal tartım",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        },
        {
          blueprint: {
            domainId: "cognition_decision",
            constructId: "thinking_styles",
            facetId: "intuitive_experiential_thinking",
            nameTr: "Sezgisel-Yaşantısal Düşünme",
            nameEn: "Intuitive-Experiential Thinking",
            scientificDefinitionTr: "Karar verirken iç sesine, ilk izlenimlerine, sezgilerine ve deneyimsel hislerine güvenerek hızlı ve bütüncül değerlendirmeler yapma eğilimi.",
            inclusionCriteria: ["İç sesine güven", "İlk izlenimleri dikkate alma", "Sezgisel içgörü"],
            exclusionCriteria: ["Kör batıl inanç", "Fevri saldırganlık"],
            adjacentConstructs: ["rational_analytical_thinking", "creativity"],
            discriminantRisks: ["Sezgisel düşünmeyi rasyonel analitik düşünceden bağımsız bir ikinci süreç olarak ölçmek"],
            referenceInstruments: ["Rational-Experiential Inventory (REI - Experiential Scale)"],
            primarySourceIds: ["src_epstein_1996_rei"],
            secondarySourceIds: ["src_cacioppo_1982_nfc"],
            turkishEvidenceSourceIds: ["src_bulus_2011_rei_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Sezgilerin geçmiş deneyimlerin hızlı bir özeti olduğuna inanma"],
              emotionalIndicators: ["İç sesinin doğruyu fısıldadığına dair güçlü bir his duyma"],
              motivationalIndicators: ["Karmaşık durumlarda içgüdülerine başvurma isteği"],
              interpersonalIndicators: ["İnsanları ilk anda sezgisel olarak tartabilme"],
              behavioralIndicatorsDetailed: [
                "Karar verirken iç sesinin ve ilk hislerinin genellikle doğru çıktığını görür",
                "Bir kişi veya durum hakkında mantıksal kanıtlar olmasa bile sezgilerine güvenir",
                "Aşırı analiz etmek yerine 'içine sinen' seçeneği tercih eder",
                "Karmaşık anlarda hissettiği ilk izlenimlerin peşinden gider"
              ]
            },
            relevantContexts: ["decisions", "relationships", "everyday_life"],
            undesiredItemPatterns: ["Fal ve astrolojiye inanırım gibi ilgisiz maddeler"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 1,
            measurementRationale: "Bilişsel ikili süreç kuramında Sistem 1'i temsil eden sezgisel-yaşantısal içgörü tarzını ölçer."
          },
          items: [
            {
              itemId: "psi_cd_int_01",
              promptTr: "Önemli kararlar verirken iç sesime ve ilk anda içime doğan hisse büyük ölçüde güvenirim.",
              promptEn: "When making important decisions, I rely heavily on my inner voice and the gut feeling that arises at first.",
              behavioralIndicator: "İç sese ve ilk hislere güven",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cd_int_02",
              promptTr: "Bir insanla tanıştığımda onun hakkındaki ilk sezgisel izlenimlerim genellikle doğru çıkar.",
              promptEn: "When I meet someone, my first intuitive impressions about them usually turn out to be correct.",
              behavioralIndicator: "Kişilerarası sezgisel ilk izlenimler",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cd_int_03",
              promptTr: "Sezgilerime ve hislerime asla güvenmem; somut kanıtı olmayan hiçbir hissi dikkate almam.",
              promptEn: "I never trust my intuition and feelings; I ignore any feeling that lacks concrete proof.",
              behavioralIndicator: "Sezgileri tamamen yok sayma (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_cd_int_04",
              promptTr: "Bazen bir kararın doğru olduğunu mantıkla açıklayamasam bile içten içe kesin olarak bilirim.",
              promptEn: "Sometimes I know deep down for sure that a decision is right even if I cannot explain it logically.",
              behavioralIndicator: "Açıklanamayan sezgisel kesinlik hissi",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cd_int_05",
              promptTr: "Karmaşık bir seçim yaparken uzun uzun düşünmektense içime en çok sinen alternatife yönelirim.",
              promptEn: "When making a complex choice, I gravitate toward the alternative that feels right inside rather than overthinking.",
              behavioralIndicator: "İçe sinen alternatife yönelme",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        }
      ]
    },

    // 3. Cognitive Adaptability & Uncertainty
    {
      constructId: "cognitive_adaptability",
      facets: [
        {
          blueprint: {
            domainId: "cognition_decision",
            constructId: "cognitive_adaptability",
            facetId: "cognitive_flexibility",
            nameTr: "Bilişsel Esneklik",
            nameEn: "Cognitive Flexibility",
            scientificDefinitionTr: "Değişen koşullara ve yeni durumlara göre düşünce biçimini ve stratejilerini uyarlayabilme; bir problemin birden fazla çözümü olduğunu kavrama kapasitesi.",
            inclusionCriteria: ["Alternatif çözüm üretme", "Yeni koşullara zihinsel uyum", "Fikir değiştirme esnekliği"],
            exclusionCriteria: ["Katı dogmatizm", "Kör kuralcılık"],
            adjacentConstructs: ["flexibility", "creative_mindset", "intolerance_of_uncertainty"],
            discriminantRisks: ["Bilişsel esnekliği kişilerarası uyumluluktan ve kararsızlıktan ayrıştırmak"],
            referenceInstruments: ["Cognitive Flexibility Inventory (CFI - Dennis & Vander Wal)"],
            primarySourceIds: ["src_dennis_2010_cfi"],
            secondarySourceIds: ["src_freeston_1994_ius"],
            turkishEvidenceSourceIds: ["src_gulum_dag_2012_cfi_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Her problemin farklı açılardan çözülebileceğini bilme"],
              emotionalIndicators: ["Planlar değiştiğinde paniklememek"],
              motivationalIndicators: ["Zorluklar karşısında yeni stratejiler deneme isteği"],
              interpersonalIndicators: ["Grup içinde farklı bakış açılarını sentezleme"],
              behavioralIndicatorsDetailed: [
                "Bir plan bozulduğunda hemen alternatif yeni bir yol geliştirebilir",
                "Karşılaştığı zorluklara tek bir açıdan değil çok boyutlu yaklaşır",
                "Yeni bilgiler ışığında eski fikirlerini rahatlıkla günceller",
                "Beklenmedik durumlara hızla zihinsel uyum sağlar"
              ]
            },
            relevantContexts: ["work_task", "decisions", "uncertainty", "planning"],
            undesiredItemPatterns: ["Her gün başka bir fikir benimserim gibi tutarsızlık ifadeleri"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Bireyin problem çözme süreçlerinde alternatif üretebilme ve zihinsel uyum kapasitesini ölçer."
          },
          items: [
            {
              itemId: "psi_cd_cfx_01",
              promptTr: "Bir problemle karşılaştığımda, onu çözmek için tek bir yol yerine birden fazla alternatif üretebilirim.",
              promptEn: "When facing a problem, I can generate multiple alternatives to solve it rather than a single way.",
              behavioralIndicator: "Alternatif çözümler üretebilme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cd_cfx_02",
              promptTr: "Planlarım beklenmedik şekilde değiştiğinde ne yapacağımı şaşırır ve zihnen kilitlenirim.",
              promptEn: "When my plans change unexpectedly, I get flustered and mentally locked up.",
              behavioralIndicator: "Plan değişiminde zihinsel kilitlenme (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_cd_cfx_03",
              promptTr: "Yeni kanıtlar sunulduğunda eski inançlarımı ve düşüncelerimi esnetmekte zorlanmam.",
              promptEn: "When new evidence is presented, I have no difficulty flexing my old beliefs and thoughts.",
              behavioralIndicator: "Yeni kanıtlarla düşünceyi esnetme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cd_cfx_04",
              promptTr: "Olaylara sadece kendi alışık olduğum tek bir pencereden bakar, diğer olasılıkları görmezden gelirim.",
              promptEn: "I view events only from the single window I am used to and ignore other possibilities.",
              behavioralIndicator: "Tek boyutlu katı bakış açısı (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_cd_cfx_05",
              promptTr: "Zor bir duruma girdiğimde farklı stratejiler deneyerek durumu başarıyla yönetebilirim.",
              promptEn: "When I enter a difficult situation, I can manage it successfully by trying different strategies.",
              behavioralIndicator: "Farklı stratejileri deneme çevikliği",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        },
        {
          blueprint: {
            domainId: "cognition_decision",
            constructId: "cognitive_adaptability",
            facetId: "intolerance_of_uncertainty",
            nameTr: "Belirsizliğe Tahammülsüzlük",
            nameEn: "Intolerance of Uncertainty",
            scientificDefinitionTr: "Geleceğin veya bir olayın sonucunun belirsiz olması durumunu stres verici, tehditkar ve felç edici bir durum olarak algılama eğilimi.",
            inclusionCriteria: ["Belirsizlik kaygısı", "Öngörülemezlikten rahatsızlık", "Sürprizlere tahammülsüzlük"],
            exclusionCriteria: ["Sağlıklı planlama", "Klinik OKB"],
            adjacentConstructs: ["need_for_cognitive_closure", "anxiety", "rumination_brooding"],
            discriminantRisks: ["Belirsizliğe tahammülsüzlüğü genel kaygıdan ve kapanma ihtiyacından ayrıştırmak"],
            referenceInstruments: ["Intolerance of Uncertainty Scale (IUS / IUS-12)"],
            primarySourceIds: ["src_freeston_1994_ius"],
            secondarySourceIds: ["src_cacioppo_1982_nfc"],
            turkishEvidenceSourceIds: ["src_sari_dag_2009_ius_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Belirsizliğin olası bir felaketin habercisi olduğunu düşünme"],
              emotionalIndicators: ["Geleceği tam göremediğinde yoğun bir huzursuzluk hissetme"],
              motivationalIndicators: ["Her ayrıntıyı önceden bilme ve garantiye alma arzusu"],
              interpersonalIndicators: ["Belirsiz planlarda sürekli onay ve netlik talep etme"],
              behavioralIndicatorsDetailed: [
                "Gelecekte ne olacağını tam olarak bilememek ona büyük bir stres verir",
                "Beklenmedik sürprizler ve belirsizlikler karşısında sakinliğini koruyamaz",
                "Her durumun sonucunun önceden kesinleşmiş olmasını ister",
                "Belirsiz bir durum uzadığında zihinsel olarak yıpranır"
              ]
            },
            relevantContexts: ["uncertainty", "planning", "decisions", "stress_decision"],
            undesiredItemPatterns: ["Gelecekten nefret ederim gibi mantık dışı ifadeler"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "LOW_SUBCLINICAL",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Bireyin belirsizlik ve öngörülemezlik durumları karşısındaki duygusal ve bilişsel kırılganlığını ölçer."
          },
          items: [
            {
              itemId: "psi_cd_iu_01",
              promptTr: "Gelecekte bir durumun nasıl sonuçlanacağını tam olarak bilememek bende yoğun bir huzursuzluk yaratır.",
              promptEn: "Not knowing exactly how a situation will turn out in the future creates intense unease in me.",
              behavioralIndicator: "Belirsizlik karşısında huzursuzluk",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cd_iu_02",
              promptTr: "Hayatın getireceği beklenmedik sürprizler ve belirsizlikler karşısında son derece rahat ve sakinimdir.",
              promptEn: "I am extremely relaxed and calm in the face of unexpected surprises and uncertainties life brings.",
              behavioralIndicator: "Belirsizlik karşısında rahatlık (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_cd_iu_03",
              promptTr: "Bir belirsizlik durumu uzun sürdüğünde başka hiçbir şeye odaklanamaz ve yıpranırım.",
              promptEn: "When an ambiguous situation lasts long, I cannot focus on anything else and get worn out.",
              behavioralIndicator: "Uzayan belirsizlikte odak kaybı ve yıpranma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cd_iu_04",
              promptTr: "Giriştiğim işlerin her ayrıntısının önceden garanti altında olmasını beklemem, akışa bırakabilirim.",
              promptEn: "I do not expect every detail of my endeavors to be guaranteed in advance; I can go with the flow.",
              behavioralIndicator: "Akışa bırakabilme esnekliği (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_cd_iu_05",
              promptTr: "Belirsiz ve öngörülemeyen durumlar beni sanki kötü bir şey olacakmış gibi tedirgin eder.",
              promptEn: "Ambiguous and unpredictable situations make me uneasy as if something bad is about to happen.",
              behavioralIndicator: "Öngörülemezlikte tehdit algısı",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        },
        {
          blueprint: {
            domainId: "cognition_decision",
            constructId: "cognitive_adaptability",
            facetId: "rumination_brooding",
            nameTr: "Ruminasyon ve Kara Kara Düşünme",
            nameEn: "Rumination (Brooding)",
            scientificDefinitionTr: "Olumsuz olayların, kişisel başarısızlıkların ve sıkıntıların nedenleri ile sonuçları üzerine yapıcı bir çözüm üretmeksizin sürekli, döngüsel ve pasif şekilde kafa yorma eğilimi.",
            inclusionCriteria: ["Döngüsel olumsuz düşünme", "Geçmişe takılıp kalma", "Çözümsüz zihinsel geviş getirme"],
            exclusionCriteria: ["Yapıcı derin düşünme (reflection)", "Problem çözme"],
            adjacentConstructs: ["negative_affect_trait", "anxiety", "intolerance_of_uncertainty"],
            discriminantRisks: ["Yıkıcı kara kara düşünmeyi (brooding) yapıcı öz-yansıtmadan (reflection) ayrıştırmak"],
            referenceInstruments: ["Ruminative Responses Scale (RRS - Brooding Subscale)"],
            primarySourceIds: ["src_treynor_2003_rrs"],
            secondarySourceIds: ["src_watson_1988_panas"],
            turkishEvidenceSourceIds: ["src_erdur_baker_2010_rrs_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["'Neden hep benim başıma geliyor?' şeklinde döngüsel sorular sorma"],
              emotionalIndicators: ["Geçmiş hataları düşündükçe keder ve moralsizliğin derinleşmesi"],
              motivationalIndicators: ["Eyleme geçmek yerine düşünce bataklığında kilitlenme"],
              interpersonalIndicators: ["Sohbetlerde sürekli aynı olumsuz anıları tekrar anlatma"],
              behavioralIndicatorsDetailed: [
                "Yaşadığı olumsuz bir olayı zihninde defalarca başa sarıp durur",
                "Hataları karşısında 'Keşke öyle yapmasaydım' diyerek kendini tüketir",
                "Sorunları çözmek yerine neden bu durumda olduğuna takılıp kalır",
                "Olumsuz düşünce döngüsünden çıkmakta büyük güçlük çeker"
              ]
            },
            relevantContexts: ["self_reflection", "stress_decision", "everyday_life"],
            undesiredItemPatterns: ["Klinik majör depresyon semptomları"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "LOW_SUBCLINICAL",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Bireyin pasif ve döngüsel olumsuz bilişsel odaklanma (Ruminative Brooding) düzeyini ölçer."
          },
          items: [
            {
              itemId: "psi_cd_rum_01",
              promptTr: "Canımı sıkan bir olay yaşadığımda, bunu günlerce zihnimde tekrar tekrar başa sarıp düşünmekten kendimi alamam.",
              promptEn: "When I experience an upsetting event, I cannot help replaying and rethinking it in my mind for days.",
              behavioralIndicator: "Olumsuz anıyı zihinde tekrar tekrar sarma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cd_rum_02",
              promptTr: "Bir sorun yaşadığımda geçmişe takılıp kalmak yerine hızlıca çözüme odaklanır ve önüme bakarım.",
              promptEn: "When I experience a problem, I focus quickly on the solution and look forward rather than getting stuck in the past.",
              behavioralIndicator: "Geçmişe takılmadan çözüme odaklanma (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_cd_rum_03",
              promptTr: "Hata yaptığımda 'Bunu neden yaptım, neden her şey ters gidiyor' diyerek kendimi yıpratıcı bir düşünce döngüsüne sokarım.",
              promptEn: "When I make a mistake, I put myself into a destructive thought loop saying 'Why did I do this, why does everything go wrong'.",
              behavioralIndicator: "Yıpratıcı döngüsel sorgulama",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cd_rum_04",
              promptTr: "Geçmişteki olumsuz anıların ve pişmanlıkların bugünkü ruh halimi zehirlemesine izin vermem.",
              promptEn: "I do not allow past negative memories and regrets to poison my current mood.",
              behavioralIndicator: "Pişmanlıklardan zihinsel olarak özgürleşme (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_cd_rum_05",
              promptTr: "Moralim bozulduğunda olumsuz hislerin nedenlerine takılıp kalır, bir türlü o ruh halinden çıkamam.",
              promptEn: "When my morale is low, I get stuck on the causes of negative feelings and just cannot exit that mood.",
              behavioralIndicator: "Olumsuz ruh halinden çıkmakta zorlanma",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        }
      ]
    },

    // 4. Decision Orientation
    {
      constructId: "decision_orientation",
      facets: [
        {
          blueprint: {
            domainId: "cognition_decision",
            constructId: "decision_orientation",
            facetId: "decision_style_maximizing",
            nameTr: "Maksimalist Karar Tarzı (En İyiyi Arama)",
            nameEn: "Decision Style (Maximizing)",
            scientificDefinitionTr: "Herhangi bir seçim yaparken 'yeterince iyi' olanla yetinmeyip daima olası en mükemmel ve en üstün seçeneği bulmak için aşırı araştırma ve karşılaştırma yapma eğilimi.",
            inclusionCriteria: ["En iyi seçeneği arama", "Kapsamlı karşılaştırma", "Yeterince iyi olana razı olmama"],
            exclusionCriteria: ["Tatmin edici karar (satisficing)", "Hızlı seçim"],
            adjacentConstructs: ["perfectionism", "procrastination_tendency", "prudence"],
            discriminantRisks: ["Maksimalist karar tarzını genel mükemmeliyetçilikten ve ertelemeden ayrıştırmak"],
            referenceInstruments: ["Maximizing Scale (Schwartz et al.)"],
            primarySourceIds: ["src_schwartz_2002_maximizing"],
            secondarySourceIds: ["src_tuckman_1991_procrastination"],
            turkishEvidenceSourceIds: ["src_isgor_2014_maximizing_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Daha iyi bir seçeneğin her zaman var olabileceğini düşünme"],
              emotionalIndicators: ["Karar verdikten sonra 'Acaba diğeri daha mı iyiydi' pişmanlığı duyma"],
              motivationalIndicators: ["Tüm alternatifleri tüketene kadar araştırmaya devam etme"],
              interpersonalIndicators: ["Başkalarının seçimleriyle kendi seçimlerini sürekli kıyaslama"],
              behavioralIndicatorsDetailed: [
                "Küçük bir alışverişte bile en mükemmel seçeneği bulmak için saatlerce araştırma yapar",
                "Bir karar verdikten sonra bile aklı seçmediği diğer alternatiflerde kalır",
                "Sadece 'iyi' olanla yetinmeyip her zaman 'en iyi' olanı elde etmek ister",
                "Tüm seçenekleri görmeden karar vermekten çekinir"
              ]
            },
            relevantContexts: ["decisions", "everyday_life", "work_task"],
            undesiredItemPatterns: ["Hiçbir karar veremem gibi genel kararsızlık ifadeleri"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Karar alma süreçlerinde maksimum fayda arayışı ve tatminsizlik riskini (Maximizing) ölçer."
          },
          items: [
            {
              itemId: "psi_cd_max_01",
              promptTr: "Basit bir karar verirken bile olası en mükemmel seçeneği bulmak için tüm alternatifleri uzun uzun araştırırım.",
              promptEn: "Even when making a simple decision, I thoroughly research all alternatives to find the most perfect option possible.",
              behavioralIndicator: "Tüm alternatifleri derinlemesine araştırma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cd_max_02",
              promptTr: "Kriterlerime uyan 'yeterince iyi' bir seçenek bulduğumda daha fazlasını aramadan hemen karar veririm.",
              promptEn: "When I find a 'good enough' option that meets my criteria, I decide immediately without searching further.",
              behavioralIndicator: "Tatmin edici kararla yetinme (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_cd_max_03",
              promptTr: "Bir seçim yaptıktan sonra aklım çoğu zaman seçmediğim diğer seçeneklerin daha iyi olup olmadığında kalır.",
              promptEn: "After making a choice, my mind often remains on whether the other options I didn't choose were better.",
              behavioralIndicator: "Karar sonrası alternatif pişmanlığı",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cd_max_04",
              promptTr: "Karar verirken en mükemmelini değil, işimi görecek pratik seçeneği tercih ederim.",
              promptEn: "When deciding, I prefer the practical option that will do the job rather than the most perfect one.",
              behavioralIndicator: "Pratik seçim tercihi (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_cd_max_05",
              promptTr: "Kişisel tercihlerimde en üst standardı yakalamak için diğer insanlardan çok daha fazla çaba sarf ederim.",
              promptEn: "I put in much more effort than most people to achieve the top standard in my personal choices.",
              behavioralIndicator: "En üst standardı arama çabası",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        },
        {
          blueprint: {
            domainId: "cognition_decision",
            constructId: "decision_orientation",
            facetId: "procrastination_tendency",
            nameTr: "Erteleme Eğilimi",
            nameEn: "Procrastination Tendency",
            scientificDefinitionTr: "Sonucunun olumsuz olacağını bilmesine rağmen yapılması gereken önemli görev ve kararları irrasyonel şekilde son dakikaya bırakma ve öteleme eğilimi.",
            inclusionCriteria: ["İrrasyonel erteleme", "Son dakikaya bırakma", "Başlamakta zorlanma"],
            exclusionCriteria: ["Stratejik bekletme", "Önceliklendirme"],
            adjacentConstructs: ["diligence", "general_self_control", "uppsp_lack_of_perseverance"],
            discriminantRisks: ["İrrasyonel ertelemeyi akılcı stratejik planlamadan ayrıştırmak"],
            referenceInstruments: ["Tuckman Procrastination Scale", "General Procrastination Scale (Lay)"],
            primarySourceIds: ["src_tuckman_1991_procrastination"],
            secondarySourceIds: ["src_tangney_2004_bscs"],
            turkishEvidenceSourceIds: ["src_uzun_ozer_2009_procrastination_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["'Daha sonra yaparım' diyerek görevi meşrulaştırma"],
              emotionalIndicators: ["Erteledikçe artan suçluluk ve kaygı"],
              motivationalIndicators: ["Gereken işe başlamak yerine önemsiz aktivitelerle oyalanma"],
              interpersonalIndicators: ["Taahhütleri son ana kadar bekletip yetiştirememe riski yaratma"],
              behavioralIndicatorsDetailed: [
                "Yapması gereken önemli bir işi son teslim anına kadar erteler",
                "Bir göreve hemen başlamak yerine gereksiz şeylerle oyalanır",
                "Ertelemenin kendisine stres yaratacağını bilse bile başlamayı geciktirir",
                "Zor işleri hep yarına bırakma eğilimindedir"
              ]
            },
            relevantContexts: ["work_task", "personal_goals", "planning"],
            undesiredItemPatterns: ["Hiçbir işi yapmam gibi aşırı uçlamalar"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Görev ve kararları irrasyonel olarak erteleme ve öteleme eğilimini ölçer."
          },
          items: [
            {
              itemId: "psi_cd_prc_01",
              promptTr: "Yapmam gereken önemli bir iş olduğunda, son teslim tarihi yaklaşana kadar başlamayı ertelerim.",
              promptEn: "When there is an important task I need to do, I delay starting until the deadline approaches.",
              behavioralIndicator: "Son teslim tarihine kadar erteleme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cd_prc_02",
              promptTr: "Üzerime düşen bir görevi ertelemek yerine hemen ele alıp zamanında bitirmeyi ilke edinirim.",
              promptEn: "I make it a principle to take on a task immediately and finish it on time rather than delaying.",
              behavioralIndicator: "Zamanında ele alma ve bitirme disiplini (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_cd_prc_03",
              promptTr: "Zor bir çalışmaya başlamam gerektiğinde kendimi önemsiz şeylerle oyalanırken bulurum.",
              promptEn: "When I need to start a difficult piece of work, I find myself dawdling with trivial things.",
              behavioralIndicator: "Önemsiz şeylerle oyalanma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cd_prc_04",
              promptTr: "Günlük planlarımdaki işleri ertelemeden, planlanan saatte yapmaya özen gösteririm.",
              promptEn: "I take care to do the tasks in my daily plans at the scheduled hour without postponing.",
              behavioralIndicator: "Planlanan saatte eyleme geçme (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_cd_prc_05",
              promptTr: "Ertelemenin bana fazladan stres yaratacağını bildiğim halde 'nasılsa daha vakit var' diyerek işi ötelerim.",
              promptEn: "Even though I know delaying will create extra stress for me, I put off work saying 'there is still time anyway'.",
              behavioralIndicator: "Strese rağmen irrasyonel erteleme",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        }
      ]
    }
  ]
};

module.exports = { DOMAIN_4_DATA };
