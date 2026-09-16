/**
 * DOMAIN 3: AFFECTIVE DYNAMICS & EMOTION REGULATION — 5 CONSTRUCTS, 9 FACETS (45 ITEMS)
 * Complete blueprints and original items.
 */

const DOMAIN_3_DATA = {
  domainId: "emotion_regulation",
  domainNameTr: "Duygu Dinamikleri ve Duygu Düzenleme",
  domainNameEn: "Affective Dynamics & Emotion Regulation",
  constructs: [
    // 1. Cognitive Reappraisal
    {
      constructId: "cognitive_reappraisal",
      facets: [
        {
          blueprint: {
            domainId: "emotion_regulation",
            constructId: "cognitive_reappraisal",
            facetId: "cognitive_reappraisal",
            nameTr: "Bilişsel Yeniden Değerlendirme",
            nameEn: "Cognitive Reappraisal",
            scientificDefinitionTr: "Duygusal tepkiyi değiştirmek amacıyla bir durumun anlamını ve bakış açısını zihinsel olarak yeniden yapılandırma ve dönüştürme stratejisi.",
            inclusionCriteria: ["Bakış açısını değiştirme", "Durumu yeniden çerçeveleme", "Duyguyu düşünceyle dönüştürme"],
            exclusionCriteria: ["Duyguyu yok sayma", "Toksik pozitiflik"],
            adjacentConstructs: ["expressive_suppression", "problem_focused_coping", "cognitive_flexibility"],
            discriminantRisks: ["Yeniden değerlendirmeyi duyguları bastırmaktan ve inkardan ayırmak"],
            referenceInstruments: ["Emotion Regulation Questionnaire (ERQ - Reappraisal Subscale)"],
            primarySourceIds: ["src_gross_john_2003_erq"],
            secondarySourceIds: ["src_carver_1997_brief_cope"],
            turkishEvidenceSourceIds: ["src_ucanok_2006_erq_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Zor bir olayın olumlu veya öğretici yönlerini görebilme"],
              emotionalIndicators: ["Bakış açısını değiştirerek olumsuz duyguların şiddetini azaltabilme"],
              motivationalIndicators: ["Duygusal kontrolü zihinsel dönüşümle sağlama arzusu"],
              interpersonalIndicators: ["Gergin ortamlarda olaylara farklı pencerelerden bakmayı önerme"],
              behavioralIndicatorsDetailed: [
                "Stresli bir durumla karşılaştığında olaya daha sakinleştirici bir açıdan bakar",
                "Kendini kötü hissettiğinde durumu düşünüş biçimini değiştirerek rahatlar",
                "Yaşadığı bir hayal kırıklığının gelecekte kendisine ne katacağını değerlendirir",
                "Öfkelendiğinde karşı tarafın niyetini yeniden yorumlayarak sakinleşir"
              ]
            },
            relevantContexts: ["stress_decision", "relationships", "everyday_life"],
            undesiredItemPatterns: ["Duygularımı içime atarım gibi bastırma ifadeleri"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 1,
            measurementRationale: "Öncül-odaklı duygu düzenleme stratejisi olarak bilişsel yeniden çerçeveleme kapasitesini ölçer."
          },
          items: [
            {
              itemId: "psi_er_reap_01",
              promptTr: "Stresli veya can sıkıcı bir olay yaşadığımda, sakinleşmek için olaya farklı bir pencereden bakmaya çalışırım.",
              promptEn: "When experiencing a stressful or annoying event, I try to look at it from a different perspective to calm down.",
              behavioralIndicator: "Stres anında bakış açısını değiştirme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_er_reap_02",
              promptTr: "Kendimi kötü hissettiğimde, olay hakkındaki düşünüş tarzımı değiştirerek duygularımı dönüştürebilirim.",
              promptEn: "When I feel bad, I can transform my emotions by changing the way I think about the situation.",
              behavioralIndicator: "Düşünce yoluyla duyguyu dönüştürme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_er_reap_03",
              promptTr: "Bir hayal kırıklığı yaşadığımda olayın bana kazandırabileceği deneyimleri ve olumlu yönleri ararım.",
              promptEn: "When I experience a disappointment, I look for the experiences and positive aspects the event might offer me.",
              behavioralIndicator: "Hayal kırıklığında öğretici yönleri arama",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_er_reap_04",
              promptTr: "Öfkelendiğimde olayın arka planını yeniden değerlendirmek yerine sadece öfkeme teslim olurum.",
              promptEn: "When I get angry, I surrender to my anger rather than re-evaluating the background of the event.",
              behavioralIndicator: "Yeniden değerlendirme yapamama (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_er_reap_05",
              promptTr: "Zorlu durumların yarattığı duygusal baskıyı, olayın anlamını yeniden yorumlayarak hafifletirim.",
              promptEn: "I ease the emotional pressure created by challenging situations by reinterpreting the meaning of the event.",
              behavioralIndicator: "Anlamı yeniden yorumlayarak rahatlama",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        }
      ]
    },

    // 2. Expressive Suppression
    {
      constructId: "expressive_suppression",
      facets: [
        {
          blueprint: {
            domainId: "emotion_regulation",
            constructId: "expressive_suppression",
            facetId: "expressive_suppression",
            nameTr: "Duygusal Baskılama",
            nameEn: "Expressive Suppression",
            scientificDefinitionTr: "Yaşanan duyguların dışsal davranışsal ifadelerini, mimiklerini ve tepkilerini bilinçli olarak gizleme ve bastırma stratejisi.",
            inclusionCriteria: ["Duygu ifadesini gizleme", "Dışarıya yansıtmama", "Maskeleme"],
            exclusionCriteria: ["Duygusal donukluk", "Aleksitimi"],
            adjacentConstructs: ["cognitive_reappraisal", "experiential_avoidance"],
            discriminantRisks: ["Tepki-odaklı duygu bastırmayı bilişsel yeniden değerlendirmeden ayrıştırmak"],
            referenceInstruments: ["Emotion Regulation Questionnaire (ERQ - Suppression Subscale)"],
            primarySourceIds: ["src_gross_john_2003_erq"],
            secondarySourceIds: ["src_watson_1988_panas"],
            turkishEvidenceSourceIds: ["src_ucanok_2006_erq_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Duyguları belli etmenin zayıflık olduğuna inanma"],
              emotionalIndicators: ["İçte yaşanan fırtınaya rağmen dışarıya sakin bir maske takma"],
              motivationalIndicators: ["Duygusal kırılganlığını başkalarından saklama arzusu"],
              interpersonalIndicators: ["Üzüntü veya öfkesini yüz ifadesinden gizleme"],
              behavioralIndicatorsDetailed: [
                "Yoğun olumsuz duygular hissettiğinde bunu dışarıya hiç belli etmemeye çalışır",
                "İçinde ne yaşarsa yaşasın yüz ifadesini ve tepkilerini kontrol altında tutar",
                "Duygusal sıkıntılarını başkalarının fark etmesini istemez",
                "Duygularını dışa vurmak yerine içine atar"
              ]
            },
            relevantContexts: ["relationships", "work_task", "social_settings"],
            undesiredItemPatterns: ["Hiçbir şey hissetmem gibi duygusal duyarsızlık ifadeleri"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Tepki-odaklı duygu düzenleme mekanizması olarak duygusal ifadeleri maskeleme eğilimini ölçer."
          },
          items: [
            {
              itemId: "psi_er_sup_01",
              promptTr: "Yoğun bir üzüntü veya öfke hissettiğimde, bunu başkalarına belli etmemek için duygularımı gizlerim.",
              promptEn: "When I feel intense sadness or anger, I hide my emotions to avoid showing them to others.",
              behavioralIndicator: "Olumsuz duyguları dışarıdan gizleme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_er_sup_02",
              promptTr: "Duygularımı başkalarına açıkça göstermekten ve hissettiklerimi paylaşmaktan çekinmem.",
              promptEn: "I do not hesitate to openly show my emotions to others and share what I feel.",
              behavioralIndicator: "Duyguları açıkça ifade etme (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_er_sup_03",
              promptTr: "İç dünyamda ne kadar sarsılırsam sarsılayım, dışarıdan son derece duygusuz ve sakin görünmeye çalışırım.",
              promptEn: "No matter how shaken I am in my inner world, I try to appear extremely emotionless and calm on the outside.",
              behavioralIndicator: "Dışsal sakinlik maskesi takma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_er_sup_04",
              promptTr: "Bir olay karşısında hissettiğim sevinci veya hüznü yüz ifadelerimle rahatça yansıtırım.",
              promptEn: "I comfortably reflect the joy or sadness I feel in response to an event through my facial expressions.",
              behavioralIndicator: "Doğal yüz ifadesi ve mimik aktarımı (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_er_sup_05",
              promptTr: "Duygularımı kontrol altında tutmanın en iyi yolunun onları içime atmak olduğunu düşünürüm.",
              promptEn: "I think the best way to keep my emotions under control is to keep them inside.",
              behavioralIndicator: "İçe atma stratejisini benimseme",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        }
      ]
    },

    // 3. Trait Affective Tone (PANAS)
    {
      constructId: "affective_tone",
      facets: [
        {
          blueprint: {
            domainId: "emotion_regulation",
            constructId: "affective_tone",
            facetId: "positive_affect_trait",
            nameTr: "Pozitif Duygulanım Eğilimi",
            nameEn: "Trait Positive Affect",
            scientificDefinitionTr: "Gündelik yaşamda coşku, heyecan, gurur, enerji ve dikkatlilik gibi olumlu duygusal durumları sık ve yoğun yaşama eğilimi.",
            inclusionCriteria: ["Gündelik enerji", "Heves ve coşku", "Aktif katılım"],
            exclusionCriteria: ["Hipomani semptomları", "Zorlama neşe"],
            adjacentConstructs: ["liveliness", "subjective_vitality", "negative_affect_trait"],
            discriminantRisks: ["Pozitif duygulanımı dışadönüklükten ve durumsal mutluluktan ayrıştırmak"],
            referenceInstruments: ["Positive and Negative Affect Schedule (PANAS - PA Scale)"],
            primarySourceIds: ["src_watson_1988_panas"],
            secondarySourceIds: ["src_larsen_diener_1987_aim"],
            turkishEvidenceSourceIds: ["src_gencoz_2000_panas_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Gündelik işlere hevesle ve odaklanmış şekilde yaklaşma"],
              emotionalIndicators: ["Enerjik, kararlı ve heyecanlı hissetme sıklığı"],
              motivationalIndicators: ["Yeni aktivitelere hevesle girişme"],
              interpersonalIndicators: ["Sosyal ortamlarda canlı ve ilgili bir duruş sergileme"],
              behavioralIndicatorsDetailed: [
                "Gündelik hayatta kendisini sık sık hevesli ve enerjik hisseder",
                "Yaptığı işlere odaklanırken heyecan ve kararlılık duyar",
                "Güne pozitif ve canlı bir beklentiyle başlar",
                "Hayatın sunduğu fırsatlara ilgiyle yönelir"
              ]
            },
            relevantContexts: ["everyday_life", "work_task", "social_settings"],
            undesiredItemPatterns: ["Hiçbir zaman yorulmam gibi gerçek dışı iddialar"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 1,
            measurementRationale: "Bireyin mizaçsal pozitif duygulanım sıklığını ve enerjik canlılığını ölçer."
          },
          items: [
            {
              itemId: "psi_er_pa_01",
              promptTr: "Gündelik hayatımda kendimi genellikle hevesli, enerjik ve motive hissederim.",
              promptEn: "In my daily life, I generally feel enthusiastic, energetic, and motivated.",
              behavioralIndicator: "Heves ve motivasyon sıklığı",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_er_pa_02",
              promptTr: "Giriştiğim işlere ilgi duymakta zorlanır, çoğunlukla isteksiz ve heyecansız olurum.",
              promptEn: "I struggle to feel interest in tasks I undertake, mostly being reluctant and unenthusiastic.",
              behavioralIndicator: "İsteksizlik ve düşük ilgi (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_er_pa_03",
              promptTr: "Yeni bir projeye veya aktiviteye başlarken içimde canlı bir heyecan duyarım.",
              promptEn: "When starting a new project or activity, I feel a lively excitement inside.",
              behavioralIndicator: "Yeni başlangıçlarda canlı heyecan",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_er_pa_04",
              promptTr: "Gün boyunca dikkatimi toplayıp işlerime kararlılıkla odaklanabilirim.",
              promptEn: "Throughout the day, I can gather my attention and focus on my work with determination.",
              behavioralIndicator: "Dikkatli ve kararlı odaklanma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_er_pa_05",
              promptTr: "Genel olarak kendimi güçlü, uyanık ve yaşama aktif katılan biri olarak hissederim.",
              promptEn: "In general, I feel strong, alert, and actively engaged in life.",
              behavioralIndicator: "Aktif katılım ve uyanıklık",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        },
        {
          blueprint: {
            domainId: "emotion_regulation",
            constructId: "affective_tone",
            facetId: "negative_affect_trait",
            nameTr: "Negatif Duygulanım Eğilimi",
            nameEn: "Trait Negative Affect",
            scientificDefinitionTr: "Gündelik yaşamda suçluluk, korku, gerginlik, huzursuzluk ve hırçınlık gibi sıkıntı verici duygusal durumları sık yaşama eğilimi.",
            inclusionCriteria: ["Sıkıntı verici duygulanım sıklığı", "Gerginlik ve huzursuzluk", "Hırçınlık"],
            exclusionCriteria: ["Ağır klinik depresyon atağı", "Somatizasyon"],
            adjacentConstructs: ["anxiety", "rumination_brooding", "distress_tolerance"],
            discriminantRisks: ["Mizaçsal negatif duygulanımı klinik depresyon ve kaygı bozukluklarından ayırmak"],
            referenceInstruments: ["Positive and Negative Affect Schedule (PANAS - NA Scale)"],
            primarySourceIds: ["src_watson_1988_panas"],
            secondarySourceIds: ["src_simons_gaher_2005_dts"],
            turkishEvidenceSourceIds: ["src_gencoz_2000_panas_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Olayları tehditkar ve sıkıntı verici algılama eğilimi"],
              emotionalIndicators: ["Gerginlik, huzursuzluk ve sinirlilik sıklığı"],
              motivationalIndicators: ["Olumsuz duygulardan kaçınma çabası"],
              interpersonalIndicators: ["Sosyal etkileşimlerde çabuk gerilme"],
              behavioralIndicatorsDetailed: [
                "Gündelik hayatta kendisini sık sık gergin ve huzursuz hisseder",
                "Küçük aksiliklerde kolayca sinirlenir veya suçluluk duyar",
                "Zihni olumsuz duygusal uyarıcılarla meşgul olur",
                "İçsel bir sıkıntı ve gerginlik hali yaşar"
              ]
            },
            relevantContexts: ["everyday_life", "stress_decision"],
            undesiredItemPatterns: ["Yaşamak istemiyorum gibi klinik kriz ifadeleri"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "LOW_SUBCLINICAL",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Bireyin mizaçsal negatif duygusal sıkıntı ve gerginlik yaşama sıklığını ölçer."
          },
          items: [
            {
              itemId: "psi_er_na_01",
              promptTr: "Belirgin bir sebep olmasa bile gün içinde kendimi sık sık gergin ve huzursuz hissederim.",
              promptEn: "Even without an obvious reason, I often feel tense and uneasy during the day.",
              behavioralIndicator: "Gündelik gerginlik ve huzursuzluk",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_er_na_02",
              promptTr: "Genel olarak iç dünyam sakin, dengeli ve huzurludur.",
              promptEn: "In general, my inner world is calm, balanced, and peaceful.",
              behavioralIndicator: "İçsel sükunet ve huzur (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_er_na_03",
              promptTr: "Gündelik hayatın küçük aksilikleri karşısında kolayca hırçınlaşır ve sinirlenirim.",
              promptEn: "In response to daily minor setbacks, I easily become irritable and annoyed.",
              behavioralIndicator: "Hırçınlık ve çabuk sinirlenme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_er_na_04",
              promptTr: "Olaylar karşısında nadiren yoğun bir suçluluk veya içsel sıkıntı yaşarım.",
              promptEn: "I rarely experience intense guilt or internal distress in response to events.",
              behavioralIndicator: "Düşük suçluluk ve sıkıntı sıklığı (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_er_na_05",
              promptTr: "Zihnim sık sık geçmiş hatalar veya olumsuz anıların yarattığı huzursuzlukla meşgul olur.",
              promptEn: "My mind is often occupied with the unease created by past mistakes or negative memories.",
              behavioralIndicator: "Olumsuz anıların yarattığı içsel huzursuzluk",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        },
        {
          blueprint: {
            domainId: "emotion_regulation",
            constructId: "affective_tone",
            facetId: "affect_intensity",
            nameTr: "Duygu Yoğunluğu",
            nameEn: "Affect Intensity",
            scientificDefinitionTr: "Hem olumlu hem olumsuz duygusal uyarıcılara karşı fizyolojik ve psikolojik olarak çok derin, sarsıcı ve güçlü tepkiler verme eğilimi.",
            inclusionCriteria: ["Duygusal tepki genliği", "Derin duygusal yaşantı", "Uyarılma şiddeti"],
            exclusionCriteria: ["Borderline duygusal dengesizlik", "Bipolar dalgalanma"],
            adjacentConstructs: ["sentimentality", "positive_affect_trait", "negative_affect_trait"],
            discriminantRisks: ["Duygu yoğunluğunu mizaç dengesizliğinden veya patolojiden ayrıştırmak"],
            referenceInstruments: ["Affect Intensity Measure (AIM - Larsen & Diener)"],
            primarySourceIds: ["src_larsen_diener_1987_aim"],
            secondarySourceIds: ["src_watson_1988_panas"],
            turkishEvidenceSourceIds: ["src_gencoz_2000_panas_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Duyguların hayatı çok derinden etkilediğini düşünme"],
              emotionalIndicators: ["Sevinçte havalara uçma, üzüntüde derinden sarsılma"],
              motivationalIndicators: ["Duyguları tüm şiddetiyle hissetme"],
              interpersonalIndicators: ["Duygularını güçlü bir enerjiyle dışa vurma"],
              behavioralIndicatorsDetailed: [
                "Mutlu olduğunda coşkuyu tüm bedeninde çok güçlü hisseder",
                "Bir şeye üzüldüğünde derin bir sarsıntı ve acı yaşar",
                "Olaylara verdiği duygusal tepkilerin şiddeti çoğu insandan daha yüksektir",
                "Duygusal durumları hafif değil, uçlarda ve yoğun deneyimler"
              ]
            },
            relevantContexts: ["everyday_life", "relationships", "self_reflection"],
            undesiredItemPatterns: ["Duygularımı hiç kontrol edemem gibi patoloji ifadeleri"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 1,
            measurementRationale: "Bireyin affektif tepkilerinin şiddet ve genlik derecesini (Affect Intensity) ölçer."
          },
          items: [
            {
              itemId: "psi_er_int_01",
              promptTr: "Mutlu olduğumda içimdeki sevinci ve coşkuyu tüm bedenimde son derece güçlü hissederim.",
              promptEn: "When I am happy, I feel the joy and enthusiasm inside me extremely powerfully throughout my entire body.",
              behavioralIndicator: "Yüksek olumlu duygu şiddeti",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_er_int_02",
              promptTr: "Olaylar karşısında duygularımı genellikle çok ılımlı, hafif ve sakin bir düzeyde yaşarım.",
              promptEn: "In response to events, I generally experience my emotions at a very moderate, mild, and calm level.",
              behavioralIndicator: "Ilımlı ve düşük duygu yoğunluğu (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_er_int_03",
              promptTr: "Bir şeye üzüldüğümde hissettiğim keder pek çok insana göre çok daha derin ve sarsıcı olur.",
              promptEn: "When I am sad about something, the grief I feel is much deeper and more shattering than for most people.",
              behavioralIndicator: "Derin olumsuz duygu sarsıntısı",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_er_int_04",
              promptTr: "Duygusal deneyimlerim hafif geçici hisler değil, beni bütünüyle saran güçlü dalgalardır.",
              promptEn: "My emotional experiences are not mild transient feelings, but powerful waves that completely envelop me.",
              behavioralIndicator: "Güçlü duygusal dalgalanma hissi",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_er_int_05",
              promptTr: "Hayatımdaki olaylara karşı hissettiğim heyecan veya hayal kırıklığı çok yüksek şiddette ortaya çıkar.",
              promptEn: "The excitement or disappointment I feel toward events in my life emerges with very high intensity.",
              behavioralIndicator: "Yüksek tepki genliği",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        }
      ]
    },

    // 4. Distress Tolerance & Acceptance
    {
      constructId: "distress_tolerance",
      facets: [
        {
          blueprint: {
            domainId: "emotion_regulation",
            constructId: "distress_tolerance",
            facetId: "distress_tolerance",
            nameTr: "Sıkıntı Toleransı",
            nameEn: "Distress Tolerance",
            scientificDefinitionTr: "Olumsuz, zorlayıcı ve acı verici duygusal durumları felaketleştirmeden, fevri kaçış yollarına sapmadan tolere edebilme kapasitesi.",
            inclusionCriteria: ["Zorlayıcı duyguları tolere etme", "Acıya tahammül", "Fevri kaçıştan uzak durma"],
            exclusionCriteria: ["Mazoşizm", "Acıdan zevk alma"],
            adjacentConstructs: ["experiential_avoidance", "patience", "psychological_resilience"],
            discriminantRisks: ["Sıkıntı toleransını duygusal hissizlikten veya acı çekme arzusundan ayrıştırmak"],
            referenceInstruments: ["Distress Tolerance Scale (DTS - Simons & Gaher)"],
            primarySourceIds: ["src_simons_gaher_2005_dts"],
            secondarySourceIds: ["src_hayes_2004_aaq"],
            turkishEvidenceSourceIds: ["src_sirimseri_2019_dts_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Olumsuz hislerin geçici olduğunu ve dayanılabilir olduğunu bilme"],
              emotionalIndicators: ["Yoğun stres altındayken bile paniklemeden duyguyla kalabilme"],
              motivationalIndicators: ["Zor duygulardan hemen kurtulmak için sağlıksız yollara başvurmama"],
              interpersonalIndicators: ["Gerginlik anlarında yapıcı çözümü bekleyebilme"],
              behavioralIndicatorsDetailed: [
                "Kendini kötü hissettiğinde bu duyguya dayanabileceğini bilir",
                "Sıkıntılı anlarda hemen paniğe kapılıp sağlıksız kaçış yolları aramaz",
                "Zorlayıcı duyguların hayatın bir parçası olduğunu kabul edip sabreder",
                "Duygusal acı karşısında yıkılmadan durabilir"
              ]
            },
            relevantContexts: ["stress_decision", "everyday_life", "self_reflection"],
            undesiredItemPatterns: ["Acı çekmekten hoşlanırım gibi mazoşist ifadeler"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Zorlayıcı duygusal yaşantılara tahammül etme ve sıkıntı anında dayanıklılık kapasitesini ölçer."
          },
          items: [
            {
              itemId: "psi_er_dt_01",
              promptTr: "Yoğun bir duygusal sıkıntı yaşadığımda bununla başa çıkabileceğimi ve dayanabileceğimi bilirim.",
              promptEn: "When I experience intense emotional distress, I know that I can cope with and endure it.",
              behavioralIndicator: "Duygusal sıkıntıya dayanabilme inancı",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_er_dt_02",
              promptTr: "Kendimi biraz bile kötü hissettiğimde bu duyguya tahammül edemez ve paniklerim.",
              promptEn: "When I feel even slightly bad, I cannot tolerate this feeling and panic.",
              behavioralIndicator: "Düşük sıkıntı tahammülü ve panikleme (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_er_dt_03",
              promptTr: "Zorlayıcı duygular içimi sardığında hemen kaçmak yerine bu hissin geçmesini sabırla bekleyebilirim.",
              promptEn: "When challenging emotions engulf me, I can patiently wait for this feeling to pass rather than immediately escaping.",
              behavioralIndicator: "Duyguyla kalabilme ve sabretme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_er_dt_04",
              promptTr: "Sıkıntı verici duygulardan kurtulmak için ne yapacağımı şaşırır, kontrolümü kaybederim.",
              promptEn: "I get flustered about what to do to get rid of distressing emotions and lose my control.",
              behavioralIndicator: "Sıkıntı anında kontrol kaybı (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_er_dt_05",
              promptTr: "Acı ve üzüntü verici hislerin hayatın doğal bir parçası olduğunu kabul eder ve göğüs gererim.",
              promptEn: "I accept that painful and sorrowful feelings are a natural part of life and face them bravely.",
              behavioralIndicator: "Zor duyguları kabullenme ve göğüs germe",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        },
        {
          blueprint: {
            domainId: "emotion_regulation",
            constructId: "distress_tolerance",
            facetId: "experiential_avoidance",
            nameTr: "Yaşantısal Kaçınma",
            nameEn: "Experiential Avoidance",
            scientificDefinitionTr: "İstenmeyen düşünce, anı, duygu ve bedensel duyumlarla temas etmekten kaçınma; bu içsel yaşantıları bastırmak veya değiştirmek için sürekli çaba harcama eğilimi.",
            inclusionCriteria: ["İçsel yaşantılardan kaçış", "Olumsuz düşünceleri bastırma çabası", "Uyuşma arayışı"],
            exclusionCriteria: ["Sağlıklı dikkat dağıtma", "Gevşeme teknikleri"],
            adjacentConstructs: ["distress_tolerance", "expressive_suppression", "rumination_brooding"],
            discriminantRisks: ["Yaşantısal kaçınmayı sağlıklı problem odaklı başa çıkmadan ayrıştırmak"],
            referenceInstruments: ["Acceptance and Action Questionnaire-II (AAQ-II)"],
            primarySourceIds: ["src_hayes_2004_aaq"],
            secondarySourceIds: ["src_simons_gaher_2005_dts"],
            turkishEvidenceSourceIds: ["src_yavuz_2016_aaq_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Olumsuz düşüncelerle asla yüzleşilmemesi gerektiğine inanma"],
              emotionalIndicators: ["Zor bir duygu belirdiğinde hemen dikkatini başka şeylerle uyuşturma"],
              motivationalIndicators: ["İçsel rahatsızlıktan ne pahasına olursa olsun kaçınma"],
              interpersonalIndicators: ["Duygusal derinlik içeren konuşmalardan uzak durma"],
              behavioralIndicatorsDetailed: [
                "Canını sıkan bir düşünce veya anı aklına geldiğinde onu hemen kafasından atmaya çalışır",
                "Zorlayıcı duyguları hissetmemek için kendisini sürekli meşgul eder veya uyuşturur",
                "İç dünyasındaki huzursuzluklarla yüzleşmekten korkar",
                "Olumsuz hislerden kaçınmak için hayatını kısıtlar"
              ]
            },
            relevantContexts: ["everyday_life", "self_reflection", "stress_decision"],
            undesiredItemPatterns: ["Her zaman yüzleşirim gibi abartılı ifadeler"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "İçsel olumsuz duygu ve düşüncelerden kronik kaçınma ve psikolojik katılık eğilimini ölçer."
          },
          items: [
            {
              itemId: "psi_er_ea_01",
              promptTr: "Canımı sıkan bir duygu veya düşünce ortaya çıktığında onu hissetmemek için kendimi çılgınca meşgul ederim.",
              promptEn: "When an annoying emotion or thought arises, I keep myself frantically busy so as not to feel it.",
              behavioralIndicator: "Duygudan kaçmak için aşırı meşguliyet",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_er_ea_02",
              promptTr: "Zorlayıcı duygu ve düşüncelerimle kaçmadan yüzleşebilir ve onları oldukları gibi kabul edebilirim.",
              promptEn: "I can face my challenging emotions and thoughts without escaping and accept them as they are.",
              behavioralIndicator: "İçsel yaşantıları kabul etme ve yüzleşme (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_er_ea_03",
              promptTr: "İç dünyamdaki huzursuz edici hislerle baş başa kalmaktan çok korkar ve hemen uzaklaşırım.",
              promptEn: "I am very afraid of being left alone with unsettling feelings in my inner world and pull away immediately.",
              behavioralIndicator: "İçsel huzursuzlukla baş başa kalmaktan kaçış",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_er_ea_04",
              promptTr: "Rahatsız edici duygular hissettiğimde bile hedeflerim doğrultusunda yaşamaya devam edebilirim.",
              promptEn: "Even when I feel uncomfortable emotions, I can continue to live in line with my goals.",
              behavioralIndicator: "Duyguya rağmen eyleme devam edebilme (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_er_ea_05",
              promptTr: "Kötü anıları veya hisleri bastırmak için enerjimin büyük bir kısmını harcarım.",
              promptEn: "I spend a large portion of my energy trying to suppress bad memories or feelings.",
              behavioralIndicator: "Olumsuz anıları bastırma çabası",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        }
      ]
    },

    // 5. Self-Conscious Emotions
    {
      constructId: "self_conscious_emotions",
      facets: [
        {
          blueprint: {
            domainId: "emotion_regulation",
            constructId: "self_conscious_emotions",
            facetId: "shame_proneness",
            nameTr: "Utanç Yatkınlığı",
            nameEn: "Shame Proneness",
            scientificDefinitionTr: "Bir hata veya ahlaki kusur karşısında tüm benliğini değersiz, kusurlu, küçük ve saklanma arzusu uyandıracak şekilde küresel olarak yargılama eğilimi.",
            inclusionCriteria: ["Küresel benlik değersizleştirmesi", "Saklanma ve yerin dibine geçme arzusu", "Aşağılanmışlık hissi"],
            exclusionCriteria: ["Spesifik eylem pişmanlığı (suçluluk)", "Sağlıklı mahcubiyet"],
            adjacentConstructs: ["guilt_proneness", "core_self_esteem", "rejection_sensitivity_nonclinical"],
            discriminantRisks: ["Utanç (küresel benlik saldırısı) ile suçluluğu (spesifik eylem telafisi) kesin olarak ayırmak"],
            referenceInstruments: ["Test of Self-Conscious Affect (TOSCA-3 - Shame Scale)"],
            primarySourceIds: ["src_tangney_1992_tosca"],
            secondarySourceIds: ["src_rosenberg_1965"],
            turkishEvidenceSourceIds: ["src_sahin_1992_tosca_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Hata yaptığında 'Ben ne kadar kusurlu ve berbat biriyim' diye düşünme"],
              emotionalIndicators: ["Yerin dibine geçme, küçülme ve yoğun utanç hissi"],
              motivationalIndicators: ["Ortamdan kaçma ve görünmez olma arzusu"],
              interpersonalIndicators: ["Hata açığa çıktığında göz temasından kaçınma ve içe kapanma"],
              behavioralIndicatorsDetailed: [
                "Topluluk içinde küçük bir hata yaptığında yerin dibine geçmek ister",
                "Bir kusuru ortaya çıktığında kendisini bütünüyle değersiz ve yetersiz görür",
                "Utanç verici bir durumda herkesten saklanma arzusu duyar",
                "Hatayı sadece eylemle değil kendi kişiliğinin özüyle bağdaştırır"
              ]
            },
            relevantContexts: ["social_settings", "relationships", "self_reflection"],
            undesiredItemPatterns: ["Suç işlediğimde telafi ederim gibi suçluluk ifadeleri"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Öz-bilinçli duygularda küresel benlik değersizleştirmesi ve utanç yatkınlığını ölçer."
          },
          items: [
            {
              itemId: "psi_er_shm_01",
              promptTr: "Başkalarının önünde küçük bir hata yaptığımda utançtan yerin dibine geçmek ve görünmez olmak isterim.",
              promptEn: "When I make a small mistake in front of others, I want to sink into the ground in shame and become invisible.",
              behavioralIndicator: "Hata karşısında yerin dibine geçme arzusu",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_er_shm_02",
              promptTr: "Bir kusurum ortaya çıktığında kendimi bütünüyle değersiz görmek yerine sadece yaptığım eyleme odaklanırım.",
              promptEn: "When a flaw of mine is revealed, I focus only on the action I took rather than seeing myself as entirely worthless.",
              behavioralIndicator: "Benlik yerine eyleme odaklanma (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_er_shm_03",
              promptTr: "Yanlış bir şey yaptığımda içimde 'Ben ne kadar berbat ve yetersiz biriyim' hissi uyanır.",
              promptEn: "When I do something wrong, a feeling of 'How terrible and inadequate I am' awakens inside me.",
              behavioralIndicator: "Küresel benliği değersizleştirme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_er_shm_04",
              promptTr: "Topluluk içindeki ufak tefek gafları büyütmeden gülüp geçebilirim.",
              promptEn: "I can laugh off minor blunders in public without blowing them out of proportion.",
              behavioralIndicator: "Gafları rahatlıkla aşabilme (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_er_shm_05",
              promptTr: "Eleştirildiğimde veya hatam yüzüme vurulduğunda kendimi tamamen küçük düşmüş ve ezilmiş hissederim.",
              promptEn: "When criticized or confronted with my mistake, I feel completely humiliated and crushed.",
              behavioralIndicator: "Küçük düşme ve ezilme hissi",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        },
        {
          blueprint: {
            domainId: "emotion_regulation",
            constructId: "self_conscious_emotions",
            facetId: "guilt_proneness",
            nameTr: "Suçluluk Yatkınlığı ve Telafi Bilinci",
            nameEn: "Guilt Proneness",
            scientificDefinitionTr: "Bir hata yapıldığında veya birine zarar verildiğinde spesifik eylemin sorumluluğunu hissedip vicdani rahatsızlık duyma ve durumu telafi etmeye yönelme eğilimi.",
            inclusionCriteria: ["Spesifik eylem pişmanlığı", "Onarım ve telafi motivasyonu", "Vicdani sorumluluk"],
            exclusionCriteria: ["Küresel benlik utancı", "Kayıtsız ahlaksızlık"],
            adjacentConstructs: ["shame_proneness", "fairness", "empathic_concern"],
            discriminantRisks: ["Suçluluğu (yapıcı onarım) utançtan (yıkıcı saklanma) ayrıştırmak"],
            referenceInstruments: ["Test of Self-Conscious Affect (TOSCA-3 - Guilt Scale)", "GASP Scale"],
            primarySourceIds: ["src_tangney_1992_tosca"],
            secondarySourceIds: ["src_lee_ashton_2004"],
            turkishEvidenceSourceIds: ["src_sahin_1992_tosca_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Yapılan yanlışın başkasına verdiği zararı fark etme"],
              emotionalIndicators: ["Spesifik bir eylemden dolayı vicdani rahatsızlık ve pişmanlık duyma"],
              motivationalIndicators: ["Özür dileme, telafi etme ve zararı karşılama arzusu"],
              interpersonalIndicators: ["Hatanın sorumluluğunu üstlenip onarıcı adım atma"],
              behavioralIndicatorsDetailed: [
                "Birini incittiğinde vicdan azabı duyar ve hemen özür dileyip telafi etmek ister",
                "Verdiği bir sözü tutamadığında eyleminin sorumluluğunu üstlenir",
                "Hatasının doğurduğu zararı gidermek için somut adımlar atar",
                "Yaptığı yanlış davranışı düzeltmek için çaba gösterir"
              ]
            },
            relevantContexts: ["relationships", "work_task", "everyday_life"],
            undesiredItemPatterns: ["Ben değersiz biriyim gibi utanç ifadeleri"],
            socialDesirabilityRisk: "MODERATE",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 1,
            measurementRationale: "Öz-bilinçli duygularda yapıcı ahlaki vicdan ve telafi/onarım bilincini ölçer."
          },
          items: [
            {
              itemId: "psi_er_glt_01",
              promptTr: "İstemeden de olsa birini kırdığımda içimde güçlü bir vicdan azabı hisseder ve hemen özür dilemek isterim.",
              promptEn: "When I hurt someone even unintentionally, I feel a strong pang of conscience inside and want to apologize immediately.",
              behavioralIndicator: "Vicdani rahatsızlık ve özür dileme arzusu",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_er_glt_02",
              promptTr: "Birine zarar verdiğimde bunu telafi etmek yerine hiçbir şey olmamış gibi davranırım.",
              promptEn: "When I harm someone, I act as if nothing happened instead of compensating for it.",
              behavioralIndicator: "Zararı telafi etmekten kaçınma (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_er_glt_03",
              promptTr: "Verdiğim bir sözü yerine getiremediğimde ortaya çıkan aksaklığı düzeltmek için elimden geleni yaparım.",
              promptEn: "When I fail to fulfill a promise, I do my best to rectify the resulting disruption.",
              behavioralIndicator: "Verilmeyen sözün sorumluluğunu onarma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_er_glt_04",
              promptTr: "Yaptığım bir hatanın başkalarını nasıl etkilediğini düşünüp durumu onarmaya odaklanırım.",
              promptEn: "I think about how a mistake I made affects others and focus on repairing the situation.",
              behavioralIndicator: "Hatanın etkisini düşünüp onarma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_er_glt_05",
              promptTr: "Hatalı bir eylemde bulunduğumda suçu üstlenir ve telafi edici adımlar atarım.",
              promptEn: "When I commit an erroneous act, I take responsibility and take compensatory steps.",
              behavioralIndicator: "Sorumluluk üstlenme ve telafi adımları",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        }
      ]
    }
  ]
};

module.exports = { DOMAIN_3_DATA };
