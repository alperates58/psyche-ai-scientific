/**
 * DOMAIN 6: MOTIVATION, NEEDS & HUMAN VALUES — 3 CONSTRUCTS, 9 FACETS (45 ITEMS)
 * Complete blueprints and original items.
 */

const DOMAIN_6_DATA = {
  domainId: "motivation_values",
  domainNameTr: "Motivasyon, İhtiyaçlar ve Evrensel Değerler",
  domainNameEn: "Motivation, Needs & Human Values",
  constructs: [
    // 1. Basic Psychological Needs (SDT)
    {
      constructId: "basic_psychological_needs",
      facets: [
        {
          blueprint: {
            domainId: "motivation_values",
            constructId: "basic_psychological_needs",
            facetId: "autonomy_need_satisfaction",
            nameTr: "Özerklik İhtiyacı Doyumu",
            nameEn: "Autonomy Need Satisfaction",
            scientificDefinitionTr: "Bireyin kendi eylemlerinin, seçimlerinin ve yaşam tarzının gerçek kaynağı olduğunu hissetmesi; kararlarını dış baskı olmadan kendi iradesiyle alabilme duygusu.",
            inclusionCriteria: ["Kendi kararlarını alabilme", "Seçim özgürlüğü hissi", "Baskı altında hissetmeme"],
            exclusionCriteria: ["Antisosyal itaatsizlik", "Sorumsuzluk"],
            adjacentConstructs: ["authenticity", "competence_need_satisfaction", "locus_of_control_internal"],
            discriminantRisks: ["Özerklik doyumunu bencilce kuralsızlıktan ayırmak"],
            referenceInstruments: ["Basic Psychological Need Satisfaction and Frustration Scale (BPNSFS - Autonomy Subscale)"],
            primarySourceIds: ["src_chen_2015_bpnsfs"],
            secondarySourceIds: ["src_wood_2008_authenticity"],
            turkishEvidenceSourceIds: ["src_selvi_bozo_2020_bpnsfs_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Kişisel kararlarında özgür bir iradeye sahip olduğunu düşünme"],
              emotionalIndicators: ["Kendi istediği gibi yaşadığında duyulan özgürlük ve tatmin"],
              motivationalIndicators: ["Dış baskılara göre değil kendi hedeflerine göre yönelme"],
              interpersonalIndicators: ["İlişkilerinde kendi sınırlarını ve seçimlerini koruyabilme"],
              behavioralIndicatorsDetailed: [
                "Günlük hayatındaki seçimleri kendi özgür iradesiyle yaptığını hisseder",
                "Başkalarının zorlaması olmadan kendi istediği kararları alabilir",
                "Yaptığı işlerde kendi tarzını ve tercihlerini yansıtabilir",
                "Hayatının kontrolünün kendi elinde olduğunu deneyimler"
              ]
            },
            relevantContexts: ["everyday_life", "work_task", "decisions"],
            undesiredItemPatterns: ["Kimsenin kuralını tanımam gibi anarşist ifadeler"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Öz-Belirleme Kuramında (SDT) temel psikolojik ihtiyaç olan özerklik doyumunu ölçer."
          },
          items: [
            {
              itemId: "psi_mv_aut_01",
              promptTr: "Günlük hayatımda aldığım kararların ve yaptığım seçimlerin gerçekten kendi özgür irademe dayandığını hissederim.",
              promptEn: "In my daily life, I feel that the decisions I make and choices I take truly rest on my own free will.",
              behavioralIndicator: "Özgür irade ve seçim duygusu",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_mv_aut_02",
              promptTr: "Hayatımı istemediğim şekilde yaşamaya zorlandığımı ve sürekli başkalarının baskısı altında olduğumu hissederim.",
              promptEn: "I feel forced to live my life in a way I do not want and under constant pressure from others.",
              behavioralIndicator: "Özerklik engellenmesi ve baskı hissi (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_mv_aut_03",
              promptTr: "Önem verdiğim konularda kendi isteklerim ve değerlerim doğrultusunda hareket etme özgürlüğüne sahibimdir.",
              promptEn: "In matters I care about, I have the freedom to act in line with my own wishes and values.",
              behavioralIndicator: "Değerler doğrultusunda hareket özgürlüğü",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_mv_aut_04",
              promptTr: "Yaptığım çoğu işte kendi tercihlerim yerine başkalarının dayattığı kuralları uygulamak zorunda kalırım.",
              promptEn: "In most work I do, I am forced to apply rules imposed by others rather than my own preferences.",
              behavioralIndicator: "Dışsal dayatma ve kontrol hissi (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_mv_aut_05",
              promptTr: "Kendimi ifade ederken ve yaşamımı şekillendirirken gerçek anlamda bağımsız hissederim.",
              promptEn: "I feel genuinely independent when expressing myself and shaping my life.",
              behavioralIndicator: "Otantik bağımsızlık hissi",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        },
        {
          blueprint: {
            domainId: "motivation_values",
            constructId: "basic_psychological_needs",
            facetId: "competence_need_satisfaction",
            nameTr: "Yetkinlik İhtiyacı Doyumu",
            nameEn: "Competence Need Satisfaction",
            scientificDefinitionTr: "Bireyin çevresiyle etkileşiminde kendini etkili, usta, becerikli ve hedeflerine ulaşmada yetkin hissetmesi duygusu.",
            inclusionCriteria: ["Ustalık hissi", "Görevlerde etkililik", "Gelişme ve başarma duygusu"],
            exclusionCriteria: ["Narsistik üstünlük", "Aşırı mükemmeliyetçilik"],
            adjacentConstructs: ["generalized_self_efficacy", "autonomy_need_satisfaction", "diligence"],
            discriminantRisks: ["Yetkinlik ihtiyacı doyumunu genel benlik saygısından ve spesifik öz-yeterlikten ayrıştırmak"],
            referenceInstruments: ["Basic Psychological Need Satisfaction and Frustration Scale (BPNSFS - Competence Subscale)"],
            primarySourceIds: ["src_chen_2015_bpnsfs"],
            secondarySourceIds: ["src_schwarzer_1995_gses"],
            turkishEvidenceSourceIds: ["src_selvi_bozo_2020_bpnsfs_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Giriştiği işleri ustalıkla başarabileceğine inanma"],
              emotionalIndicators: ["Zor bir görevi tamamladığında derin bir yetkinlik tatmini"],
              motivationalIndicators: ["Becerilerini geliştirecek meydan okumalara yönelme"],
              interpersonalIndicators: ["Bilgi ve becerisini başkalarıyla paylaşabilme"],
              behavioralIndicatorsDetailed: [
                "Yaptığı işlerde etkili ve yetenekli olduğunu hisseder",
                "Zor görevleri başarıyla tamamlayabileceğine dair güven duyar",
                "Kendini sürekli geliştirdiğini ve ustalaştığını deneyimler",
                "Hedeflerine ulaşırken yeteneklerini sergileyebilir"
              ]
            },
            relevantContexts: ["work_task", "personal_goals", "everyday_life"],
            undesiredItemPatterns: ["Her konuda en iyisiyim gibi narsistik iddialar"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Öz-Belirleme Kuramında (SDT) temel psikolojik ihtiyaç olan yetkinlik ve ustalık doyumunu ölçer."
          },
          items: [
            {
              itemId: "psi_mv_cmp_01",
              promptTr: "Üzerime aldığım görevlerde kendimi yetenekli, etkili ve becerikli hissederim.",
              promptEn: "In the tasks I take on, I feel capable, effective, and skillful.",
              behavioralIndicator: "Görevlerde etkili ve becerikli hissetme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_mv_cmp_02",
              promptTr: "Çoğu zaman yaptığım işlerde kendimi yetersiz, başarısız ve hayal kırıklığı yaratmış hissederim.",
              promptEn: "Most of the time, I feel inadequate, unsuccessful, and like a disappointment in the work I do.",
              behavioralIndicator: "Yetkinlik engellenmesi ve yetersizlik hissi (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_mv_cmp_03",
              promptTr: "Zorlayıcı hedeflere ulaştıkça becerilerimin geliştiğini ve ustalaştığımı görürüm.",
              promptEn: "As I achieve challenging goals, I see that my skills improve and I become proficient.",
              behavioralIndicator: "Ustalık ve gelişim deneyimi",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_mv_cmp_04",
              promptTr: "Önem verdiğim hedeflere ulaşmakta kendimi çaresiz ve beceriksiz hissederim.",
              promptEn: "I feel helpless and clumsy in reaching the goals I care about.",
              behavioralIndicator: "Hedef karşısında beceriksizlik algısı (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_mv_cmp_05",
              promptTr: "Günlük hayatımda ve işimde ortaya koyduğum sonuçlar bana büyük bir yetkinlik tatmini verir.",
              promptEn: "The results I produce in my daily life and work give me great fulfillment of competence.",
              behavioralIndicator: "Üretilen sonuçlardan yetkinlik tatmini",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        },
        {
          blueprint: {
            domainId: "motivation_values",
            constructId: "basic_psychological_needs",
            facetId: "relatedness_need_satisfaction",
            nameTr: "İlişkililik İhtiyacı Doyumu",
            nameEn: "Relatedness Need Satisfaction",
            scientificDefinitionTr: "Bireyin başkalarıyla sıcak, samimi, güvenli ve karşılıklı değer verilen bağlar kurduğunu, sevildiğini ve ait olduğunu hissetmesi duygusu.",
            inclusionCriteria: ["Yakın bağlar hissetme", "Karşılıklı sevgi ve değer", "Ait olma duygusu"],
            exclusionCriteria: ["Yüzeysel popülerlik", "Bağımlı yapışkanlık"],
            adjacentConstructs: ["social_connectedness", "attachment_anxiety", "attachment_avoidance"],
            discriminantRisks: ["İlişkililik doyumunu aşırı bağımlılıktan ve sosyal popülerlikten ayrıştırmak"],
            referenceInstruments: ["Basic Psychological Need Satisfaction and Frustration Scale (BPNSFS - Relatedness Subscale)"],
            primarySourceIds: ["src_chen_2015_bpnsfs"],
            secondarySourceIds: ["src_lee_robbins_1995_connectedness"],
            turkishEvidenceSourceIds: ["src_selvi_bozo_2020_bpnsfs_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Değer verdiği insanların kendisini gerçekten önemsediğine inanma"],
              emotionalIndicators: ["Yakın ilişkilerde duyulan sıcaklık ve güven"],
              motivationalIndicators: ["Başkalarına özen gösterme ve bağlarını derinleştirme isteği"],
              interpersonalIndicators: ["Duygusal olarak açık ve besleyici dostluklar sürdürme"],
              behavioralIndicatorsDetailed: [
                "Değer verdiği insanların kendisini içtenlikle sevdiğini ve önemsediğini hisseder",
                "Sosyal çevresinde gerçekten ait olduğu ve anlaşıldığı bir yer bulur",
                "İlişkilerinde derin bir karşılıklı güven ve yakınlık deneyimler",
                "Yalnız veya dışlanmış hissetmez"
              ]
            },
            relevantContexts: ["relationships", "social_settings", "everyday_life"],
            undesiredItemPatterns: ["Herkes bana aşıktır gibi yapay ifadeler"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Öz-Belirleme Kuramında (SDT) temel psikolojik ihtiyaç olan ait olma ve derin ilişkililik doyumunu ölçer."
          },
          items: [
            {
              itemId: "psi_mv_rel_01",
              promptTr: "Hayatımdaki insanların beni gerçekten önemsediğini, sevdiğini ve bana değer verdiğini hissederim.",
              promptEn: "I feel that the people in my life genuinely care about me, love me, and value me.",
              behavioralIndicator: "Önemsenme ve sevilme hissi",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_mv_rel_02",
              promptTr: "İnsanların arasındayken bile kendimi dışlanmış, yabancılaşmış ve yapayalnız hissederim.",
              promptEn: "Even while among people, I feel excluded, alienated, and utterly lonely.",
              behavioralIndicator: "İlişkililik engellenmesi ve yabancılaşma (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_mv_rel_03",
              promptTr: "Yakın çevremle kurduğum ilişkilerde derin bir sıcaklık ve karşılıklı güven bağı deneyimlerim.",
              promptEn: "In relationships with my close circle, I experience a deep warmth and mutual bond of trust.",
              behavioralIndicator: "Sıcak ve güvenli ilişki bağı",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_mv_rel_04",
              promptTr: "Etrafımdaki insanların bana karşı mesafeli ve soğuk davrandığını düşünürüm.",
              promptEn: "I think that people around me act distant and cold toward me.",
              behavioralIndicator: "Duygusal mesafe ve soğukluk algısı (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_mv_rel_05",
              promptTr: "Dertlerimi ve sevinçlerimi içtenlikle paylaşabileceğim sağlam dostluklara sahibimdir.",
              promptEn: "I have solid friendships with whom I can sincerely share my troubles and joys.",
              behavioralIndicator: "İçten ve sağlam dostluklar",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        }
      ]
    },

    // 2. Universal Human Values (Schwartz)
    {
      constructId: "universal_values",
      facets: [
        {
          blueprint: {
            domainId: "motivation_values",
            constructId: "universal_values",
            facetId: "schwartz_openness_to_change",
            nameTr: "Değişime Açıklık Değerleri",
            nameEn: "Openness to Change Values",
            scientificDefinitionTr: "Düşünce ve eylemde bağımsızlığı (Öz-Yönelim), yenilik, heyecan ve meydan okumayı (Uyarılma) ve yaşamdan zevk almayı (Hazcılık) temel yaşam ideali olarak benimseme.",
            inclusionCriteria: ["Öz-yönelim", "Yenilik arayışı", "Bağımsız düşünce"],
            exclusionCriteria: ["Geleneksel kör bağlılık", "Katı statüko savunusu"],
            adjacentConstructs: ["schwartz_conservation", "unconventionality", "creativity"],
            discriminantRisks: ["Değişime açıklık değerlerini koruma/muhafazakarlık değerleriyle zıt kutuplu olarak ölçmek"],
            referenceInstruments: ["Portrait Values Questionnaire (PVQ-RR - Openness to Change Subscale)"],
            primarySourceIds: ["src_schwartz_2012_values"],
            secondarySourceIds: ["src_ashton_lee_2007"],
            turkishEvidenceSourceIds: ["src_kusdil_2000_values_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Kişinin kendi yolunu kendisinin çizmesi gerektiğine inanma"],
              emotionalIndicators: ["Yeni ufuklar ve deneyimler keşfettikçe heyecan duyma"],
              motivationalIndicators: ["Kalıpların dışına çıkma ve özgürce yaratma arzusu"],
              interpersonalIndicators: ["Farklı fikirlere ve yenilikçi projelere öncülük etme"],
              behavioralIndicatorsDetailed: [
                "Kararlarında tamamen bağımsız olmayı ve kendi fikirlerini üretmeyi çok önemser",
                "Hayatında yeni, heyecan verici ve alışılmadık deneyimler aramaya değer verir",
                "Özgürlük ve yaratıcılığı hayatının en öncelikli değerleri arasında görür",
                "Rutin ve tekdüze kalıpların hayatını sınırlamasına izin vermez"
              ]
            },
            relevantContexts: ["personal_goals", "decisions", "everyday_life"],
            undesiredItemPatterns: ["Kuralları çiğnerim gibi suç çağrışımları"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 1,
            measurementRationale: "Schwartz değer modelinde yüksek-dereceli Değişime Açıklık (Öz-Yönelim, Uyarılma) boyutunu ölçer."
          },
          items: [
            {
              itemId: "psi_mv_opc_01",
              promptTr: "Kendi kararlarımı tamamen bağımsız almak ve kendi özgün yolumu çizmek hayatımın en temel önceliğidir.",
              promptEn: "Making my own decisions completely independently and drawing my own authentic path is the top priority of my life.",
              behavioralIndicator: "Öz-yönelim ve bağımsızlık değeri",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_mv_opc_02",
              promptTr: "Hayatımda yenilikler aramak yerine her zaman alışkın olduğum güvenli ve değişmeyen rutinleri sürdürmeyi yeğlerim.",
              promptEn: "Rather than seeking novelties in my life, I always prefer maintaining the safe and unchanging routines I am used to.",
              behavioralIndicator: "Rutin ve statükoya bağlılık (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_mv_opc_03",
              promptTr: "Yeni şeyler keşfetmek, yaratıcı fikirler üretmek ve merakımın peşinden gitmek benim için çok değerlidir.",
              promptEn: "Discovering new things, generating creative ideas, and following my curiosity is very valuable to me.",
              behavioralIndicator: "Yaratıcılık ve keşif değeri",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_mv_opc_04",
              promptTr: "Hayatın sunduğu heyecan verici fırsatları ve maceraları deneyimlemek benim için büyük önem taşır.",
              promptEn: "Experiencing thrilling opportunities and adventures that life offers carries great importance for me.",
              behavioralIndicator: "Uyarılma ve heyecan arayışı değeri",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_mv_opc_05",
              promptTr: "Özgürce düşünmek ve kendi tercihlerimi kısıtlanmadan yaşamak yaşam felsefemin çekirdeğidir.",
              promptEn: "Thinking freely and living my own choices without constraint is the core of my life philosophy.",
              behavioralIndicator: "Özgürlük odaklı yaşam felsefesi",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        },
        {
          blueprint: {
            domainId: "motivation_values",
            constructId: "universal_values",
            facetId: "schwartz_self_transcendence",
            nameTr: "Öz-Aşım Değerleri (Evrenselcilik ve İyilikseverlik)",
            nameEn: "Self-Transcendence Values",
            scientificDefinitionTr: "Kişisel çıkarların ötesine geçerek yakın çevresindekilerin iyiliğini gözetmeyi (İyilikseverlik) ve tüm insanların refahını, adaleti ve doğayı korumayı (Evrenselcilik) temel ideal olarak benimseme.",
            inclusionCriteria: ["Evrensel adalet", "Doğayı ve insanı koruma", "Fedakar iyilikseverlik"],
            exclusionCriteria: ["Bencil statü hırsı", "Kaynak gaspı"],
            adjacentConstructs: ["schwartz_self_enhancement", "empathic_concern", "fairness"],
            discriminantRisks: ["Öz-aşım değerlerini kişisel çıkar ve statü değerleriyle zıt kutuplu olarak ölçmek"],
            referenceInstruments: ["Portrait Values Questionnaire (PVQ-RR - Self-Transcendence Subscale)"],
            primarySourceIds: ["src_schwartz_2012_values"],
            secondarySourceIds: ["src_ashton_lee_2007"],
            turkishEvidenceSourceIds: ["src_kusdil_2000_values_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Her insanın eşit haklara ve onurlu bir yaşama layık olduğuna inanma"],
              emotionalIndicators: ["Başkalarının refahı ve doğanın korunması karşısında derin bir sorumluluk hissi"],
              motivationalIndicators: ["Topluma ve insanlığa fayda sağlama arzusu"],
              interpersonalIndicators: ["İhtiyacı olanlara karşılıksız yardım etme"],
              behavioralIndicatorsDetailed: [
                "Toplumda adaletin sağlanmasını ve zayıfların korunmasını çok önemser",
                "Yakınlarının ve sevdiklerinin mutluluğu için özveriyle çabalar",
                "Doğanın ve tüm canlıların korunmasına derin bir değer atfeder",
                "Bencil kazançlar yerine ortak insanlık yararını gözetir"
              ]
            },
            relevantContexts: ["social_settings", "relationships", "personal_goals"],
            undesiredItemPatterns: ["Ben bir azizim gibi kendini kusursuz ahlaklı gösterme ifadeleri"],
            socialDesirabilityRisk: "MODERATE",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 1,
            measurementRationale: "Schwartz değer modelinde yüksek-dereceli Öz-Aşım (Evrenselcilik, İyilikseverlik) boyutunu ölçer."
          },
          items: [
            {
              itemId: "psi_mv_st_01",
              promptTr: "Tüm insanların eşit haklara sahip olmasını ve toplumda adaletin korunmasını en temel değerim olarak görürüm.",
              promptEn: "I consider all people having equal rights and preserving justice in society as my most fundamental value.",
              behavioralIndicator: "Evrensel adalet ve eşitlik değeri",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_mv_st_02",
              promptTr: "Başkalarının veya toplumun sorunları beni ilgilendirmez; sadece kendi çıkarıma ve rahatıma odaklanırım.",
              promptEn: "The problems of others or society do not concern me; I focus only on my own gain and comfort.",
              behavioralIndicator: "Toplumsal kayıtsızlık ve bencillik (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_mv_st_03",
              promptTr: "Yakın çevremdeki insanların iyiliği, mutluluğu ve esenliği için gönülden fedakarlık yaparım.",
              promptEn: "I wholeheartedly make sacrifices for the goodness, happiness, and well-being of people around me.",
              behavioralIndicator: "İyilikseverlik ve fedakarlık",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_mv_st_04",
              promptTr: "Doğayı, çevreyi ve tüm canlıların yaşam hakkını korumak benim için vazgeçilmez bir sorumluluktur.",
              promptEn: "Protecting nature, the environment, and the right to life of all living beings is an indispensable responsibility for me.",
              behavioralIndicator: "Çevre ve doğayı koruma bilinci",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_mv_st_05",
              promptTr: "Dünyayı gelecek nesiller için daha adil, yaşanabilir ve barışçıl bir yer haline getirmeye katkı sunmak isterim.",
              promptEn: "I want to contribute to making the world a fairer, more livable, and peaceful place for future generations.",
              behavioralIndicator: "Gelecek nesiller için ortak fayda ideali",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        },
        {
          blueprint: {
            domainId: "motivation_values",
            constructId: "universal_values",
            facetId: "schwartz_conservation",
            nameTr: "Muhafazakarlık ve Koruma Değerleri (Güvenlik, Uyum, Gelenek)",
            nameEn: "Conservation Values",
            scientificDefinitionTr: "Toplumsal düzeni ve güvenliği korumayı (Güvenlik), sosyal normlara ve otoriteye saygıyı (Uyum) ve kültürel/dini mirasa bağlılığı (Gelenek) temel yaşam önceliği olarak görme.",
            inclusionCriteria: ["Sosyal düzen ve güvenlik", "Geleneklere bağlılık", "Kurallara saygı"],
            exclusionCriteria: ["Kör fanatizm", "Zorbalık"],
            adjacentConstructs: ["schwartz_openness_to_change", "prudence"],
            discriminantRisks: ["Koruma/Muhafazakarlık değerlerini değişime açıklık değerleriyle zıt kutuplu olarak ölçmek"],
            referenceInstruments: ["Portrait Values Questionnaire (PVQ-RR - Conservation Subscale)"],
            primarySourceIds: ["src_schwartz_2012_values"],
            secondarySourceIds: ["src_ashton_lee_2007"],
            turkishEvidenceSourceIds: ["src_kusdil_2000_values_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Düzenin, geleneklerin ve toplumsal istikrarın korunması gerektiğine inanma"],
              emotionalIndicators: ["Kaos ve anarşi durumlarında huzursuzluk duyma"],
              motivationalIndicators: ["Aileye, kültüre ve kurallara sadık kalma isteği"],
              interpersonalIndicators: ["Büyüklere ve otoriteye saygılı davranma"],
              behavioralIndicatorsDetailed: [
                "Toplumsal kurallara ve yasalara uymayı çok önemser",
                "Ailesinin ve kültürünün geleneklerini yaşatmaya değer verir",
                "Kişisel ve toplumsal güvenliğin her şeyin temeli olduğunu savunur",
                "Toplumsal barış için normlara saygılı davranır"
              ]
            },
            relevantContexts: ["social_settings", "everyday_life", "personal_goals"],
            undesiredItemPatterns: ["Herkes bana itaat etmeli gibi faşizan ifadeler"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 1,
            measurementRationale: "Schwartz değer modelinde yüksek-dereceli Koruma/Muhafazakarlık (Güvenlik, Uyum, Gelenek) boyutunu ölçer."
          },
          items: [
            {
              itemId: "psi_mv_con_01",
              promptTr: "Toplumsal düzenin, kuralların ve yasaların korunması benim için son derece büyük bir önceliktir.",
              promptEn: "Preserving social order, rules, and laws is an extremely high priority for me.",
              behavioralIndicator: "Toplumsal düzen ve kural değeri",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_mv_con_02",
              promptTr: "Gelenekler, görenekler ve geçmişten gelen kültürel değerler bana çağ dışı ve gereksiz gelir.",
              promptEn: "Traditions, customs, and cultural values from the past seem outdated and unnecessary to me.",
              behavioralIndicator: "Gelenek ve göreneklere kayıtsızlık (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_mv_con_03",
              promptTr: "Ailemin ve toplumun huzurunu tehdit edebilecek her türlü kaostan ve istikrarsızlıktan kaçınırım.",
              promptEn: "I avoid any kind of chaos and instability that could threaten the peace of my family and society.",
              behavioralIndicator: "İstikrar ve güvenliği koruma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_mv_con_04",
              promptTr: "Toplumsal hayatta büyüklere saygı ve yerleşik ahlaki normlara bağlılık olmazsa olmaz bir değerdir.",
              promptEn: "Respect for elders and adherence to established moral norms in social life is an essential value.",
              behavioralIndicator: "Saygı ve norm bağlılığı",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_mv_con_05",
              promptTr: "Kişisel güvenliğin ve öngörülebilir bir yaşam düzeninin her şeyin temeli olduğuna inanırım.",
              promptEn: "I believe that personal security and a predictable life order are the foundation of everything.",
              behavioralIndicator: "Kişisel güvenlik ve düzen inancı",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        },
        {
          blueprint: {
            domainId: "motivation_values",
            constructId: "universal_values",
            facetId: "schwartz_self_enhancement",
            nameTr: "Öz-Geliştirme Değerleri (Güç ve Başarı)",
            nameEn: "Self-Enhancement Values",
            scientificDefinitionTr: "Kişisel başarıyı kanıtlamayı (Başarı), sosyal statü ve prestij elde etmeyi ve insanlar ile kaynaklar üzerinde etki/kontrol sahibi olmayı (Güç) temel ideal olarak benimseme.",
            inclusionCriteria: ["Başarı ve rekabetçilik", "Statü ve prestij", "Etki ve liderlik"],
            exclusionCriteria: ["Zorbalık", "Suç işleme"],
            adjacentConstructs: ["schwartz_self_transcendence", "greed_avoidance", "modesty"],
            discriminantRisks: ["Öz-geliştirme değerlerini öz-aşım değerleriyle zıt kutuplu olarak ölçmek"],
            referenceInstruments: ["Portrait Values Questionnaire (PVQ-RR - Self-Enhancement Subscale)"],
            primarySourceIds: ["src_schwartz_2012_values"],
            secondarySourceIds: ["src_ashton_lee_2007"],
            turkishEvidenceSourceIds: ["src_kusdil_2000_values_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Kişinin zirveye çıkmak için rekabet etmesi gerektiğine inanma"],
              emotionalIndicators: ["Başarı ve güç elde ettiğinde yüksek bir doyum yaşama"],
              motivationalIndicators: ["Toplumda saygın, etkili ve güçlü bir konuma gelme arzusu"],
              interpersonalIndicators: ["İnsanları yönetme ve etki alanını genişletme"],
              behavioralIndicatorsDetailed: [
                "Toplumda yüksek bir statü ve saygın bir konuma sahip olmayı çok önemser",
                "Girdiği yarışlarda ve projelerde en başarılı olmak için yoğun çaba gösterir",
                "Kaynaklar ve insanlar üzerinde yönlendirici bir etkiye sahip olmak ister",
                "Kişisel başarılarının takdir edilmesi ona büyük motivasyon verir"
              ]
            },
            relevantContexts: ["work_task", "personal_goals", "social_settings"],
            undesiredItemPatterns: ["Herkesi ezerim gibi suç içeren ifadeler"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 1,
            measurementRationale: "Schwartz değer modelinde yüksek-dereceli Öz-Geliştirme (Güç, Başarı) boyutunu ölçer."
          },
          items: [
            {
              itemId: "psi_mv_se_01",
              promptTr: "Toplumda yüksek bir statüye, güçlü bir etkiye ve prestijli bir konuma ulaşmak benim için çok önemlidir.",
              promptEn: "Reaching a high status, strong influence, and prestigious position in society is very important to me.",
              behavioralIndicator: "Statü ve prestij arzusu",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_mv_se_02",
              promptTr: "Güç sahibi olmak veya başkalarına üstünlük kurmak gibi hedefler bana son derece anlamsız gelir.",
              promptEn: "Goals like having power or establishing superiority over others seem utterly meaningless to me.",
              behavioralIndicator: "Güç ve üstünlük hedeflerine ilgisizlik (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_mv_se_03",
              promptTr: "Giriştiğim işlerde en başarılı olmak ve yeteneklerimi herkese kanıtlamak için büyük bir hırs duyarım.",
              promptEn: "I feel great ambition to be the most successful in endeavors I undertake and prove my talents to everyone.",
              behavioralIndicator: "Başarı hırsı ve kendini kanıtlama",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_mv_se_04",
              promptTr: "İnsanları yönlendirebilecek ve kararları etkileyebilecek güçlü bir liderlik konumunda olmayı hedeflerim.",
              promptEn: "I aim to be in a strong leadership position that can guide people and influence decisions.",
              behavioralIndicator: "Liderlik ve yönlendirici güç hedefi",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_mv_se_05",
              promptTr: "Elde ettiğim somut başarıların takdir edilmesi ve toplumda hayranlık uyandırması benim için değerlidir.",
              promptEn: "It is valuable to me that my concrete achievements are appreciated and arouse admiration in society.",
              behavioralIndicator: "Başarı takdiri ve hayranlık uyandırma",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        }
      ]
    },

    // 3. Existential Meaning & Coherence
    {
      constructId: "existential_meaning",
      facets: [
        {
          blueprint: {
            domainId: "motivation_values",
            constructId: "existential_meaning",
            facetId: "presence_of_meaning",
            nameTr: "Anlam Varlığı",
            nameEn: "Presence of Meaning",
            scientificDefinitionTr: "Bireyin kendi yaşamının bir anlamı, amacı ve değeri olduğunu derinden hissetmesi ve yaşamını bir bütünlük içinde algılama düzeyi.",
            inclusionCriteria: ["Yaşam amacı hissi", "Anlamlı varoluş", "İçsel bütünlük"],
            exclusionCriteria: ["Varoluşsal boşluk", "Nihilizm"],
            adjacentConstructs: ["search_for_meaning", "psychological_flourishing", "subjective_vitality"],
            discriminantRisks: ["Anlam varlığını anlam arayışından ayrıştırmak"],
            referenceInstruments: ["Meaning in Life Questionnaire (MLQ - Presence Subscale)"],
            primarySourceIds: ["src_steger_2006_mlq"],
            secondarySourceIds: ["src_diener_2010_flourishing"],
            turkishEvidenceSourceIds: ["src_boyraz_2013_mlq_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Hayatının net bir misyona ve değere sahip olduğuna inanma"],
              emotionalIndicators: ["Sabahları uyanırken yaşama amacının verdiği içsel huzur"],
              motivationalIndicators: ["Anlamlı hedefler doğrultusunda yaşamını sürdürme"],
              interpersonalIndicators: ["Yaşamındaki anlamı başkalarıyla paylaşabilme"],
              behavioralIndicatorsDetailed: [
                "Hayatının derin bir anlamı ve açık bir amacı olduğunu hisseder",
                "Neden yaşadığını ve varoluşunun neye hizmet ettiğini bilir",
                "Yaşamını boş ve anlamsız bir sürükleniş olarak görmez",
                "Hedeflerinin kendisine tatmin verici bir yön çizdiğini deneyimler"
              ]
            },
            relevantContexts: ["self_reflection", "personal_goals", "everyday_life"],
            undesiredItemPatterns: ["Her şeyi çözdüm gibi fanatik ifadeler"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Bireyin yaşamındaki öznel anlam ve varoluşsal amaç netliğini (Presence of Meaning) ölçer."
          },
          items: [
            {
              itemId: "psi_mv_pom_01",
              promptTr: "Hayatımın net bir amacı, derin bir anlamı ve yönü olduğunu hissediyorum.",
              promptEn: "I feel that my life has a clear purpose, a deep meaning, and direction.",
              behavioralIndicator: "Net yaşam amacı ve yön duygusu",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_mv_pom_02",
              promptTr: "Çoğu zaman hayatımın tamamen boş, anlamsız ve hedefsiz bir sürükleniş olduğunu düşünürüm.",
              promptEn: "Most of the time, I think my life is a completely empty, meaningless, and aimless drift.",
              behavioralIndicator: "Varoluşsal boşluk ve anlamsızlık (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_mv_pom_03",
              promptTr: "Beni bu dünyada neyin mutlu ve tatmin ettiğini, varoluşumun neye hizmet ettiğini biliyorum.",
              promptEn: "I know what makes me happy and fulfilled in this world, and what my existence serves.",
              behavioralIndicator: "Varoluşsal misyon netliği",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_mv_pom_04",
              promptTr: "Yaşamımı neyin anlamlı kıldığına dair zihnimde hiçbir net fikir yoktur.",
              promptEn: "There is no clear idea in my mind about what makes my life meaningful.",
              behavioralIndicator: "Anlam yoksunluğu ve kafa karışıklığı (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_mv_pom_05",
              promptTr: "Gündelik yaşamımda yaptığım işlerin daha büyük ve değerli bir amaca katkı sunduğunu hissederim.",
              promptEn: "In my daily life, I feel that the things I do contribute to a greater and valuable purpose.",
              behavioralIndicator: "Gündelik eylemlerin amaca bağlılığı",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        },
        {
          blueprint: {
            domainId: "motivation_values",
            constructId: "existential_meaning",
            facetId: "search_for_meaning",
            nameTr: "Anlam Arayışı",
            nameEn: "Search for Meaning",
            scientificDefinitionTr: "Yaşamında daha derin bir anlam, amaç, varoluşsal bütünlük ve yaşam misyonu keşfetmek için aktif olarak düşünsel ve ruhsal çaba gösterme eğilimi.",
            inclusionCriteria: ["Anlam keşif arzusu", "Varoluşsal sorgulama", "Daha derin amaç arayışı"],
            exclusionCriteria: ["Kör nihilizm", "Çaresizlik"],
            adjacentConstructs: ["presence_of_meaning", "inquisitiveness", "authenticity"],
            discriminantRisks: ["Anlam arayışını (aktif keşif motivasyonu) anlamsızlık krizinden ayrıştırmak"],
            referenceInstruments: ["Meaning in Life Questionnaire (MLQ - Search Subscale)"],
            primarySourceIds: ["src_steger_2006_mlq"],
            secondarySourceIds: ["src_cacioppo_1982_nfc"],
            turkishEvidenceSourceIds: ["src_boyraz_2013_mlq_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Yaşamın daha derin sırlarını ve amacını anlama arzusu"],
              emotionalIndicators: ["Yeni anlam ufukları ararken duyulan manevi merak"],
              motivationalIndicators: ["Kendi hayatına daha derin bir misyon kazandırmak için çabalama"],
              interpersonalIndicators: ["Varoluşsal ve felsefi konuları tartışmaktan zevk alma"],
              behavioralIndicatorsDetailed: [
                "Hayatına daha derin bir anlam ve yön kazandırmak için sürekli arayış içindedir",
                "Kendi varoluş amacını keşfetmeye yönelik kitaplar okur veya düşünür",
                "Yaşamını daha doyumlu kılacak yeni manevi/zihinsel kaynaklar arar",
                "Varoluşunun anlamını sorgulamaktan çekinmez"
              ]
            },
            relevantContexts: ["self_reflection", "personal_goals", "everyday_life"],
            undesiredItemPatterns: ["Hayatım bomboştur gibi depresif ifadeler"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 1,
            measurementRationale: "Bireyin yaşamındaki varoluşsal anlam ve amaç arama motivasyonunu (Search for Meaning) ölçer."
          },
          items: [
            {
              itemId: "psi_mv_sfm_01",
              promptTr: "Hayatıma daha derin bir anlam ve değer katacak yeni amaçlar keşfetmek için sürekli bir arayış içindeyimdir.",
              promptEn: "I am in a constant search to discover new purposes that will add deeper meaning and value to my life.",
              behavioralIndicator: "Daha derin anlam ve amaç arayışı",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_mv_sfm_02",
              promptTr: "Hayatımın anlamını veya varoluş amacımı sorgulamak bana gereksiz gelir, hiç kafa yormam.",
              promptEn: "Questioning the meaning of my life or my existential purpose seems unnecessary to me; I don't ponder it at all.",
              behavioralIndicator: "Anlam arayışına ilgisizlik (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_mv_sfm_03",
              promptTr: "Varoluşumun bu dünyadaki yerini ve misyonunu daha iyi anlamaya yönelik düşünsel bir çaba sarf ederim.",
              promptEn: "I make an intellectual effort toward better understanding the place and mission of my existence in this world.",
              behavioralIndicator: "Varoluşsal misyonu anlama çabası",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_mv_sfm_04",
              promptTr: "Yaşamımı daha doyumlu ve anlamlı kılacak felsefi veya manevi kaynakları araştırmayı severim.",
              promptEn: "I like investigating philosophical or spiritual resources that will make my life more fulfilling and meaningful.",
              behavioralIndicator: "Anlam kaynaklarını araştırma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_mv_sfm_05",
              promptTr: "Kendimi ve hayatın derin amacını keşfetme yolculuğu benim için hiç bitmeyen bir tutkudur.",
              promptEn: "The journey of discovering myself and life's deep purpose is a never-ending passion for me.",
              behavioralIndicator: "Bitmeyen anlam keşfi tutkusu",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        }
      ]
    }
  ]
};

module.exports = { DOMAIN_6_DATA };
