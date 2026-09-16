/**
 * DOMAIN 2: SELF-SYSTEM & IDENTITY STRUCTURE — 6 CONSTRUCTS, 8 FACETS (40 ITEMS)
 * Complete blueprints and original items.
 */

const DOMAIN_2_DATA = {
  domainId: "self_system",
  domainNameTr: "Benlik Sistemi ve Kimlik Yapısı",
  domainNameEn: "Self-System & Identity Structure",
  constructs: [
    // 1. Global Self-Esteem
    {
      constructId: "core_self_esteem",
      facets: [
        {
          blueprint: {
            domainId: "self_system",
            constructId: "core_self_esteem",
            facetId: "core_self_esteem",
            nameTr: "Temel Benlik Saygısı",
            nameEn: "Core Self-Esteem",
            scientificDefinitionTr: "Bireyin bir bütün olarak kendi varlığını değerli, saygıdeğer ve kabul edilebilir bulma düzeyini yansıtan küresel öz-değerlilik algısı.",
            inclusionCriteria: ["Küresel öz-değer", "Kişisel yeterlilik ve saygı algısı", "Kendini kabul"],
            exclusionCriteria: ["Narsistik üstünlük", "Durumsal kibir"],
            adjacentConstructs: ["social_self_esteem", "self_compassion", "contingent_self_worth"],
            discriminantRisks: ["Temel benlik saygısını narsistik böbürlenmeden ve durumsal başarıdan ayırmak"],
            referenceInstruments: ["Rosenberg Self-Esteem Scale (RSES)", "IPIP Core Self-Evaluations"],
            primarySourceIds: ["src_rosenberg_1965"],
            secondarySourceIds: ["src_goldberg_1999_ipip"],
            turkishEvidenceSourceIds: ["src_cuhadaroglu_1986_rses_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Kendisinin de en az diğer insanlar kadar değerli olduğuna inanma"],
              emotionalIndicators: ["Kendi varlığından genel bir hoşnutluk duyma"],
              motivationalIndicators: ["Kendini geliştirmeye ve haklarını savunmaya açık olma"],
              interpersonalIndicators: ["İlişkilerde kendini ezdirmeden ve başkalarını ezmeden var olma"],
              behavioralIndicatorsDetailed: [
                "Kendisini değerli ve saygıyı hak eden bir birey olarak görür",
                "Kişisel özelliklerinden ve genel duruşundan memnundur",
                "Hatalarına rağmen temel öz-değer duygusunu korur",
                "Kendisine karşı olumlu ve yapıcı bir bakış açısına sahiptir"
              ]
            },
            relevantContexts: ["everyday_life", "self_reflection", "personal_goals"],
            undesiredItemPatterns: ["Ben mükemmel biriyim gibi narsistik abartılar"],
            socialDesirabilityRisk: "MODERATE",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Bireyin psikolojik sağlığının çekirdeğini oluşturan küresel öz-değerlilik algısını ölçer."
          },
          items: [
            {
              itemId: "psi_ss_rse_01",
              promptTr: "Genel olarak kendimi değerli ve saygıya layık bir insan olarak görürüm.",
              promptEn: "In general, I see myself as a valuable person worthy of respect.",
              behavioralIndicator: "Küresel öz-değer algısı",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_ss_rse_02",
              promptTr: "Bazen kendimi tamamen işe yaramaz ve yetersiz hissederim.",
              promptEn: "Sometimes I feel completely useless and inadequate.",
              behavioralIndicator: "Kendini değersiz hissetme (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_ss_rse_03",
              promptTr: "Pek çok konuda en az diğer insanlar kadar yetenekli ve başarılı olduğuma inanırım.",
              promptEn: "I believe I am at least as capable and successful as most other people in many areas.",
              behavioralIndicator: "Eşit yeterlilik ve öz-saygı inancı",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_ss_rse_04",
              promptTr: "Kendimle ilgili olumlu hissetmekte zorlanır, kusurlarıma fazla odaklanırım.",
              promptEn: "I struggle to feel positive about myself and focus too much on my flaws.",
              behavioralIndicator: "Kusurlara aşırı odaklanma ve düşük öz-kabul (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_ss_rse_05",
              promptTr: "Kişisel özelliklerimden ve genel olarak kim olduğumdan memnunumdur.",
              promptEn: "I am pleased with my personal qualities and with who I am overall.",
              behavioralIndicator: "Genel benlik memnuniyeti",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        },
        {
          blueprint: {
            domainId: "self_system",
            constructId: "core_self_esteem",
            facetId: "contingent_self_worth",
            nameTr: "Koşullu Öz-Değerlilik",
            nameEn: "Contingent Self-Worth",
            scientificDefinitionTr: "Bireyin öz-değer duygusunu başkalarının onayına, akademik/mesleki başarıya veya dışsal performansa aşırı derecede bağımlı kılması eğilimi.",
            inclusionCriteria: ["Dışsal onaya bağlı öz-değer", "Başarısızlıkta yıkılma", "Performans bağımlılığı"],
            exclusionCriteria: ["Sağlıklı başarı motivasyonu", "Gelişim arzusu"],
            adjacentConstructs: ["core_self_esteem", "perfectionism", "rejection_sensitivity_nonclinical"],
            discriminantRisks: ["Koşullu öz-değeri sağlıklı başarı hedefinden ayırmak"],
            referenceInstruments: ["Contingencies of Self-Worth Scale (CSWS)"],
            primarySourceIds: ["src_crocker_wolfe_2001"],
            secondarySourceIds: ["src_rosenberg_1965"],
            turkishEvidenceSourceIds: ["src_cuhadaroglu_1986_rses_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Yalnızca başarılı olduğunda sevilmeyi hak ettiğine inanma"],
              emotionalIndicators: ["Bir başarısızlık yaşadığında aniden değersizlik hissetme"],
              motivationalIndicators: ["Başkalarının onayını almak için aşırı çabalama"],
              interpersonalIndicators: ["Eleştiri aldığında öz-değerinin tamamen sarsılması"],
              behavioralIndicatorsDetailed: [
                "Bir işte başarısız olduğunda tüm değerini kaybetmiş gibi hisseder",
                "Kendini iyi hissetmesi tamamen başkalarından gelen övgü ve onaylara bağlıdır",
                "Hata yaptığında kendisine olan saygısı hızla dibe vurur",
                "Dışsal başarıları olmadan kendini boşlukta ve yetersiz hisseder"
              ]
            },
            relevantContexts: ["work_task", "relationships", "self_reflection"],
            undesiredItemPatterns: ["Hiç kimsenin onayına bakmam gibi yapay duyarsızlıklar"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Öz-değerin dışsal başarı ve onay koşullarına kırılgan bağımlılığını ölçer."
          },
          items: [
            {
              itemId: "psi_ss_csw_01",
              promptTr: "Bir konuda başarısız olduğumda bir insan olarak tüm değerimi kaybetmiş gibi hissederim.",
              promptEn: "When I fail at something, I feel as if I have lost all my value as a human being.",
              behavioralIndicator: "Başarısızlık anında öz-değer çöküşü",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_ss_csw_02",
              promptTr: "Başkalarının övgüsünü almasam bile kendi içsel değerimin farkında kalabilirim.",
              promptEn: "Even without receiving praise from others, I can remain aware of my own intrinsic value.",
              behavioralIndicator: "İçsel koşulsuz öz-değer (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_ss_csw_03",
              promptTr: "Kendimi iyi ve değerli hissetmem tamamen işimdeki veya okuldaki performansıma bağlıdır.",
              promptEn: "Feeling good and worthy about myself depends entirely on my performance at work or school.",
              behavioralIndicator: "Performansa dayalı kırılgan öz-değer",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_ss_csw_04",
              promptTr: "Hata yaptığımda veya eleştirildiğimde kendime olan temel saygımı korumayı başarırım.",
              promptEn: "When I make a mistake or get criticized, I manage to preserve my core respect for myself.",
              behavioralIndicator: "Eleştiri karşısında öz-saygıyı koruma (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_ss_csw_05",
              promptTr: "Çevremdeki insanların hakkımdaki olumlu görüşleri olmadan kendime güvenmekte zorlanırım.",
              promptEn: "Without the positive opinions of people around me, I struggle to trust myself.",
              behavioralIndicator: "Sosyal onaya bağımlılık",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        }
      ]
    },

    // 2. Self-Compassion
    {
      constructId: "self_compassion",
      facets: [
        {
          blueprint: {
            domainId: "self_system",
            constructId: "self_compassion",
            facetId: "self_compassion",
            nameTr: "Öz-Şefkat ve Kendine Anlayış",
            nameEn: "Self-Compassion",
            scientificDefinitionTr: "Zor zamanlarda, acı çektiğinde veya yetersizlik hissettiğinde kendine acımasızca saldırmak yerine anlayış, şefkat ve nezaketle yaklaşabilme; insanlık ortak paydasını kavrama eğilimi.",
            inclusionCriteria: ["Kendine nezaket", "Ortak insanlık bilinci", "Bilinçli farkındalık"],
            exclusionCriteria: ["Kendine acıma / kurban psikolojisi", "Bencilce kendini haklı çıkarma"],
            adjacentConstructs: ["core_self_esteem", "rumination_brooding", "psychological_resilience"],
            discriminantRisks: ["Öz-şefkati kendine acıma veya gevşeklikten ayrıştırmak"],
            referenceInstruments: ["Self-Compassion Scale (SCS / SCS-SF)"],
            primarySourceIds: ["src_neff_2003"],
            secondarySourceIds: ["src_schwarzer_1995_gses"],
            turkishEvidenceSourceIds: ["src_akin_2007_self_compassion_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Hata yapmanın ve zorlanmanın her insanın paylaştığı bir durum olduğunu bilme"],
              emotionalIndicators: ["Kişisel eksiklikler karşısında kendine sıcak ve teselli edici yaklaşabilme"],
              motivationalIndicators: ["Kendini acımasızca yıpratmak yerine yapıcı şekilde destekleme"],
              interpersonalIndicators: ["Kendi kusurlarına gösterdiği anlayışı başkalarına da yansıtabilme"],
              behavioralIndicatorsDetailed: [
                "İşler ters gittiğinde kendine karşı anlayışlı ve hoşgörülü davranır",
                "Hata yaptığında kendini acımasızca yargılamak yerine sakinleşmeye çalışır",
                "Zorlukların hayatın doğal bir parçası olduğunu hatırlar",
                "Acı ve hayal kırıklığı anlarında kendine bir dost gibi destek olur"
              ]
            },
            relevantContexts: ["stress_decision", "self_reflection", "everyday_life"],
            undesiredItemPatterns: ["Her hatamda kendimi överim gibi gerçek dışı savunmalar"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Bireyin kişisel yetersizlikler ve hayatın zorlukları karşısındaki içsel şefkat ve toparlanma mekanizmasını ölçer."
          },
          items: [
            {
              itemId: "psi_ss_scp_01",
              promptTr: "Zor bir dönemden geçerken veya hata yaptığımda kendime karşı anlayışlı ve şefkatli davranırım.",
              promptEn: "When going through a hard time or making a mistake, I treat myself with understanding and compassion.",
              behavioralIndicator: "Kendine anlayış ve şefkat gösterme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_ss_scp_02",
              promptTr: "Bir aksilik yaşadığımda kendimi acımasızca suçlar ve kusurlarımı kafamda büyütürüm.",
              promptEn: "When I experience a setback, I ruthlessly blame myself and magnify my flaws in my mind.",
              behavioralIndicator: "Kendini acımasızca yargılama (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_ss_scp_03",
              promptTr: "Acı çekmenin ve hata yapmanın her insanın yaşadığı doğal bir durum olduğunu kendime hatırlatırım.",
              promptEn: "I remind myself that suffering and making mistakes is a natural condition shared by all humans.",
              behavioralIndicator: "Ortak insanlık bilinci",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_ss_scp_04",
              promptTr: "Yetersiz hissettiğim anlarda dünyada sanki sadece ben bu durumdaymışım gibi yalnızlık duyarım.",
              promptEn: "In moments when I feel inadequate, I feel isolated as if I am the only one in this state.",
              behavioralIndicator: "Yetersizlik anında soyutlanma hissi (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_ss_scp_05",
              promptTr: "Hayatımda işler yolunda gitmediğinde kendime iyi bir dostun göstereceği özeni ve desteği veririm.",
              promptEn: "When things don't go well in my life, I give myself the care and support a good friend would provide.",
              behavioralIndicator: "Kendine dostça yaklaşabilme",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        }
      ]
    },

    // 3. Generalized Self-Efficacy
    {
      constructId: "generalized_self_efficacy",
      facets: [
        {
          blueprint: {
            domainId: "self_system",
            constructId: "generalized_self_efficacy",
            facetId: "generalized_self_efficacy",
            nameTr: "Genel Öz-Yeterlik",
            nameEn: "Generalized Self-Efficacy",
            scientificDefinitionTr: "Bireyin yeni, zorlu veya beklenmedik yaşam durumlarıyla başa çıkabileceğine ve hedeflerine ulaşmak için gerekli eylemleri başarıyla yürütebileceğine dair genel inancı.",
            inclusionCriteria: ["Genel başa çıkma inancı", "Zorlukları aşma özgüveni", "Kişisel yetkinlik beklentisi"],
            exclusionCriteria: ["Spesifik tekil beceri", "Gerçekçi olmayan aşırı özgüven yanılsaması"],
            adjacentConstructs: ["locus_of_control_internal", "long_term_grit", "core_self_esteem"],
            discriminantRisks: ["Genel öz-yeterliği spesifik teknik beceriden ayrıştırmak"],
            referenceInstruments: ["General Self-Efficacy Scale (GSES)", "New General Self-Efficacy Scale (NGSE)"],
            primarySourceIds: ["src_schwarzer_1995_gses"],
            secondarySourceIds: ["src_rosenberg_1965"],
            turkishEvidenceSourceIds: ["src_yesilay_2003_gse_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Çaba gösterdiğinde her sorunun bir çözümünü bulabileceğine inanma"],
              emotionalIndicators: ["Yeni ve zorlu bir görev karşısında çaresizliğe kapılmama"],
              motivationalIndicators: ["Zorlukları bir tehdit değil aşılması gereken meydan okuma olarak görme"],
              interpersonalIndicators: ["Zorlu durumlarda inisiyatif alıp liderlik edebilme"],
              behavioralIndicatorsDetailed: [
                "Beklenmedik zorluklarla karşılaştığında sakin kalıp bir çözüm yolu bulur",
                "Yeterince emek verdiğinde hedeflerine ulaşabileceğine güvenir",
                "Yeni ve karmaşık durumlarla karşılaştığında başa çıkabileceğini bilir",
                "Bir engelle karşılaştığında pes etmek yerine alternatif yollar üretir"
              ]
            },
            relevantContexts: ["work_task", "decisions", "stress_decision", "personal_goals"],
            undesiredItemPatterns: ["Ben dünyadaki her şeyi yapabilirim gibi abartılı ifadeler"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Genişletilmiş problem çözme ve zorlu durumlarla başa çıkma genel öz-inancını ölçer."
          },
          items: [
            {
              itemId: "psi_ss_gse_01",
              promptTr: "Beklenmedik zorluklarla karşılaştığımda genellikle bir çıkış yolu ve çözüm bulacağıma güvenirim.",
              promptEn: "When facing unexpected difficulties, I generally trust that I will find a way out and a solution.",
              behavioralIndicator: "Beklenmedik zorluklarda çözüm bulma inancı",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_ss_gse_02",
              promptTr: "Karmaşık ve yeni problemlerle karşılaştığımda ne yapacağımı bilemez ve çaresiz hissederim.",
              promptEn: "When faced with complex and new problems, I don't know what to do and feel helpless.",
              behavioralIndicator: "Karmaşık durumlarda çaresizlik (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_ss_gse_03",
              promptTr: "Yeterince emek ve çaba gösterirsem çoğu hedefe ulaşabileceğimi bilirim.",
              promptEn: "I know that if I put in enough effort and work, I can achieve most goals.",
              behavioralIndicator: "Çaba ile hedefe ulaşma inancı",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_ss_gse_04",
              promptTr: "Önüme çıkan engeller karşısında hızlıca umutsuzluğa kapılır ve vazgeçerim.",
              promptEn: "In the face of obstacles, I quickly fall into despair and give up.",
              behavioralIndicator: "Engeller karşısında çabuk vazgeçme (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_ss_gse_05",
              promptTr: "Kendi becerilerime güvenir, zorlu durumların üstesinden gelebileceğime inanırım.",
              promptEn: "I trust my skills and believe I can overcome challenging situations.",
              behavioralIndicator: "Genel beceri ve yetkinlik özgüveni",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        }
      ]
    },

    // 4. Locus of Control
    {
      constructId: "locus_of_control",
      facets: [
        {
          blueprint: {
            domainId: "self_system",
            constructId: "locus_of_control",
            facetId: "locus_of_control_internal",
            nameTr: "İçsel Denetim Odağı",
            nameEn: "Internal Locus of Control",
            scientificDefinitionTr: "Yaşamındaki olayların, başarıların ve başarısızlıkların büyük ölçüde kendi kararlarına, çabalarına ve davranışlarına bağlı olduğuna inanma eğilimi.",
            inclusionCriteria: ["Kişisel sorumluluk alma", "Eylemlerinin sonuçlarını sahiplenme", "Öz-etki inancı"],
            exclusionCriteria: ["Dış faktörleri tamamen inkar etme", "Kör kadercilik"],
            adjacentConstructs: ["locus_of_control_external", "generalized_self_efficacy", "autonomy_need_satisfaction"],
            discriminantRisks: ["İçsel denetimi dışsal faktörleri inkar eden aşırı suçlamadan ayrıştırmak"],
            referenceInstruments: ["Rotter's Internal-External Locus of Control Scale", "Levenson Multidimensional Locus of Control"],
            primarySourceIds: ["src_rotter_1966_loc"],
            secondarySourceIds: ["src_schwarzer_1995_gses"],
            turkishEvidenceSourceIds: ["src_dag_1991_loc_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Kişinin kendi hayatının mimarı olduğuna inanma"],
              emotionalIndicators: ["Kendi hayatı üzerinde kontrol sahibi olmanın verdiği güven"],
              motivationalIndicators: ["Sonuçları değiştirmek için aktif adımlar atma"],
              interpersonalIndicators: ["Başarısızlıkta başkalarını suçlamak yerine kendi payını arama"],
              behavioralIndicatorsDetailed: [
                "Elde ettiği başarıların kendi çabasının ve kararlarının sonucu olduğunu bilir",
                "İşler kötü gittiğinde suçu başkalarına atmak yerine kendi payını değerlendirir",
                "Geleceğini şekillendirme gücünün kendi ellerinde olduğuna inanır",
                "Hayatındaki gelişmeleri yönlendirmek için proaktif davranır"
              ]
            },
            relevantContexts: ["decisions", "work_task", "personal_goals"],
            undesiredItemPatterns: ["Dünyadaki her şey sadece benim elimdedir gibi abartılı ifadeler"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 1,
            measurementRationale: "Kişinin yaşam olayları üzerindeki kişisel etki ve sorumluluk inancını ölçer."
          },
          items: [
            {
              itemId: "psi_ss_loc_in_01",
              promptTr: "Hayatımdaki başarıların ve ulaştığım hedeflerin en önemli belirleyicisi kendi çabam ve kararlılığımdır.",
              promptEn: "The most important determinant of my successes and goals achieved is my own effort and determination.",
              behavioralIndicator: "Başarıyı kişisel çabaya atfetme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_ss_loc_in_02",
              promptTr: "Ne kadar çabalarsam çabalayayım, hayatımın gidişatını etkileyebileceğime inanmam.",
              promptEn: "No matter how much I strive, I do not believe I can affect the course of my life.",
              behavioralIndicator: "Kişisel etki inancının yokluğu (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_ss_loc_in_03",
              promptTr: "Bir işte başarısız olduğumda suçu dış etkenlerde aramak yerine nerede hata yaptığımı sorgularım.",
              promptEn: "When I fail at a task, I question where I made a mistake rather than looking for blame in external factors.",
              behavioralIndicator: "Başarısızlıkta kişisel sorumluluk alma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_ss_loc_in_04",
              promptTr: "Geleceğimin nasıl şekilleneceği büyük oranda bugün aldığım kararlara ve eylemlerime bağlıdır.",
              promptEn: "How my future will be shaped depends largely on the decisions and actions I take today.",
              behavioralIndicator: "Geleceğini kontrol edebilme inancı",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_ss_loc_in_05",
              promptTr: "Hayatımdaki önemli olayların yönünü değiştirebilecek güce ve iradeye sahibimdir.",
              promptEn: "I have the power and willpower to change the direction of major events in my life.",
              behavioralIndicator: "Yaşama yön verme iradesi",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        },
        {
          blueprint: {
            domainId: "self_system",
            constructId: "locus_of_control",
            facetId: "locus_of_control_external",
            nameTr: "Dışsal Denetim Odağı",
            nameEn: "External Locus of Control",
            scientificDefinitionTr: "Yaşamındaki olayların, başarıların ve zorlukların kendi kontrolü dışındaki şansa, kadere, güçlü kişilere veya rastlantılara bağlı olduğuna inanma eğilimi.",
            inclusionCriteria: ["Şans ve kader atıfları", "Dışsal güçlere bağımlılık", "Çaresizlik inancı"],
            exclusionCriteria: ["Gerçekçi dışsal engelleri kabul etme", "İçsel denetim"],
            adjacentConstructs: ["locus_of_control_internal", "generalized_self_efficacy"],
            discriminantRisks: ["Dışsal denetimi gerçekçi sosyoekonomik zorlukların farkındalığından ayırmak"],
            referenceInstruments: ["Rotter's Internal-External Locus of Control Scale"],
            primarySourceIds: ["src_rotter_1966_loc"],
            secondarySourceIds: ["src_schwarzer_1995_gses"],
            turkishEvidenceSourceIds: ["src_dag_1991_loc_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["İnsan hayatını tamamen şans ve kaderin yönettiğine inanma"],
              emotionalIndicators: ["Olaylar karşısında pasifleşme ve kaderci kabulleniş"],
              motivationalIndicators: ["Sonucu değiştirmek için çabalamaktan vazgeçme"],
              interpersonalIndicators: ["Başarıyı veya başarısızlığı güçlü kişilerin lütfuna bağlama"],
              behavioralIndicatorsDetailed: [
                "Başarılı olmanın çalışmaktan çok doğru zamanda doğru yerde bulunma şansına bağlı olduğunu düşünür",
                "İşler ters gittiğinde bunu kaderin veya şanssızlığın bir cilvesi olarak görür",
                "Geleceğini planlamanın anlamsız olduğunu çünkü her şeyin dış etkenlerce belirlendiğini savunur",
                "Hayatındaki dönüm noktalarını rastlantılara bağlar"
              ]
            },
            relevantContexts: ["decisions", "planning", "everyday_life"],
            undesiredItemPatterns: ["Her şey boştur gibi nihilist genellemeler"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Yaşam olaylarının şans, kader ve dışsal güçler tarafından belirlendiği algısını ölçer."
          },
          items: [
            {
              itemId: "psi_ss_loc_ex_01",
              promptTr: "Hayatta ne kadar başarılı olacağımız kişisel çabamızdan ziyade şansımıza ve talihe bağlıdır.",
              promptEn: "How successful we are in life depends on luck and fortune rather than personal effort.",
              behavioralIndicator: "Başarıyı şansa atfetme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_ss_loc_ex_02",
              promptTr: "Planlı ve disiplinli bir şekilde çalışan insanların kaderlerini kendilerinin çizdiğine inanırım.",
              promptEn: "I believe that people who work planned and disciplined draw their own destinies.",
              behavioralIndicator: "Kaderini çizme inancı (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_ss_loc_ex_03",
              promptTr: "Başıma gelen kötü olayların çoğu tamamen şanssızlıktan ve kontrolüm dışındaki güçlerden kaynaklanır.",
              promptEn: "Most bad events that happen to me originate entirely from bad luck and forces outside my control.",
              behavioralIndicator: "Olumsuzlukları dışsal şanssızlığa atfetme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_ss_loc_ex_04",
              promptTr: "Kararlı adımlar attığımda dış koşullar ne olursa olsun hedefime ulaşabilirim.",
              promptEn: "When I take decisive steps, I can reach my goal regardless of external conditions.",
              behavioralIndicator: "Dış koşulları aşma inancı (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_ss_loc_ex_05",
              promptTr: "Hayatımızdaki pek çok önemli gelişme tamamen tesadüflerin ve rastlantıların sonucudur.",
              promptEn: "Many important developments in our lives are entirely the result of coincidences and accidents.",
              behavioralIndicator: "Yaşamı tesadüflere bağlama",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        }
      ]
    },

    // 5. Self-Concept Clarity
    {
      constructId: "self_concept_clarity",
      facets: [
        {
          blueprint: {
            domainId: "self_system",
            constructId: "self_concept_clarity",
            facetId: "self_concept_clarity",
            nameTr: "Benlik Belirginliği ve Tutarlılığı",
            nameEn: "Self-Concept Clarity",
            scientificDefinitionTr: "Bireyin kendi kişilik özellikleri, inançları ve değerleri hakkındaki bilgilerinin net, açık, içsel olarak tutarlı ve zaman içinde kararlı olması düzeyi.",
            inclusionCriteria: ["Benlik algısında netlik", "İçsel tutarlılık", "Kimlik istikrarı"],
            exclusionCriteria: ["Katı dogmatizm", "Gelişime kapalılık"],
            adjacentConstructs: ["authenticity", "core_self_esteem", "self_compassion"],
            discriminantRisks: ["Benlik belirginliğini katı düşünce dogmatizminden ayırmak"],
            referenceInstruments: ["Self-Concept Clarity Scale (SCCS)"],
            primarySourceIds: ["src_campbell_1996_scc"],
            secondarySourceIds: ["src_rosenberg_1965"],
            turkishEvidenceSourceIds: ["src_sumer_gungor_1999_scc_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Kim olduğunu, ne istediğini ve temel değerlerini net olarak bilme"],
              emotionalIndicators: ["Kimliğinden emin olmanın sağladığı içsel huzur"],
              motivationalIndicators: ["Kendi değerlerine uygun kararlar alma"],
              interpersonalIndicators: ["Farklı ortamlarda da aynı temel kişilik duruşunu koruma"],
              behavioralIndicatorsDetailed: [
                "Kişilik özellikleri ve değerleri konusunda net ve kararlı bir algıya sahiptir",
                "Farklı günlerde veya ortamlarda kendisini çelişkili ve karmaşık hissetmez",
                "Kim olduğu ve ne istediği konusunda zihninde belirgin bir tablo vardır",
                "Kendi fikirleri ve duyguları arasında içsel bir bütünlük yaşar"
              ]
            },
            relevantContexts: ["self_reflection", "decisions", "relationships"],
            undesiredItemPatterns: ["Ben hiç değişmem gibi katı gelişim karşıtı ifadeler"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Bireyin benlik yapısının yapısal netliğini, tutarlılığını ve kimlik istikrarını ölçer."
          },
          items: [
            {
              itemId: "psi_ss_scc_01",
              promptTr: "Gerçekte nasıl bir insan olduğum ve temel değerlerimin neler olduğu konusunda net bir fikre sahibimdir.",
              promptEn: "I have a clear idea about what kind of person I truly am and what my core values are.",
              behavioralIndicator: "Benlik ve değer netliği",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_ss_scc_02",
              promptTr: "Günden güne kim olduğum ve ne istediğim konusundaki düşüncelerim sürekli değişir ve çelişir.",
              promptEn: "From day to day, my thoughts about who I am and what I want constantly change and contradict.",
              behavioralIndicator: "Benlik algısında değişkenlik ve çelişki (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_ss_scc_03",
              promptTr: "Farklı ortamlarda bulunsam bile temel kişilik özelliklerimin ve duruşumun tutarlı kaldığını hissederim.",
              promptEn: "Even in different environments, I feel that my core personality traits and stance remain consistent.",
              behavioralIndicator: "Ortamlar arası benlik tutarlılığı",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_ss_scc_04",
              promptTr: "Bazen kendimi tanıyamadığımı ve iç dünyamın tam bir karmaşa içinde olduğunu düşünürüm.",
              promptEn: "Sometimes I think that I don't know myself and that my inner world is in complete chaos.",
              behavioralIndicator: "Kendini tanıyamama ve içsel karmaşa (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_ss_scc_05",
              promptTr: "Kendi inançlarım, hedeflerim ve tercihlerim konusunda içsel bir netliğe sahibimdir.",
              promptEn: "I have an internal clarity regarding my own beliefs, goals, and preferences.",
              behavioralIndicator: "Hedef ve inançlarda içsel netlik",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        }
      ]
    },

    // 6. Authenticity
    {
      constructId: "authenticity",
      facets: [
        {
          blueprint: {
            domainId: "self_system",
            constructId: "authenticity",
            facetId: "authenticity",
            nameTr: "Otantiklik ve Özgün Yaşantı",
            nameEn: "Authenticity",
            scientificDefinitionTr: "Bireyin kendi içsel değerlerine, inançlarına ve duygularına sadık kalarak yaşaması; başkalarının baskılarına veya dış beklentilere göre yapay maskeler takmaktan kaçınması eğilimi.",
            inclusionCriteria: ["Öz-uyumlu eylem", "Dış baskılara boyun eğmeme", "İçsel yabancılaşmadan uzaklık"],
            exclusionCriteria: ["Toplumsal kurallara anlamsız isyan", "Kaba düşüncesizlik"],
            adjacentConstructs: ["self_concept_clarity", "sincerity", "schwartz_openness_to_change"],
            discriminantRisks: ["Otantikliği kaba bencillikten ve saygısızlıktan ayırmak"],
            referenceInstruments: ["The Authenticity Scale (Wood et al.)"],
            primarySourceIds: ["src_wood_2008_authenticity"],
            secondarySourceIds: ["src_campbell_1996_scc"],
            turkishEvidenceSourceIds: ["src_ilhan_2013_authenticity_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["İnsanın kendi özüne uygun yaşamasının en temel gereklilik olduğuna inanma"],
              emotionalIndicators: ["Başkalarını memnun etmek için rol yapmadığında içsel huzur"],
              motivationalIndicators: ["Kendi gerçek duygu ve düşüncelerini cesaretle ifade etme"],
              interpersonalIndicators: ["Sosyal baskılara rağmen kendi inandığı yolda yürüyebilme"],
              behavioralIndicatorsDetailed: [
                "Başkalarının ne beklediğine göre değil, kendi içsel inançlarına göre hareket eder",
                "Sırf kabul görmek için hissetmediği rolleri oynamayı reddeder",
                "Kendi duygu ve düşüncelerine yabancılaşmadan yaşar",
                "Kişisel değerleriyle eylemleri arasında tam bir uyum gözetir"
              ]
            },
            relevantContexts: ["everyday_life", "relationships", "social_settings"],
            undesiredItemPatterns: ["Kimseyi umursamam gibi asosyal ifadeler"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "İçsel değerler ile gündelik eylemler arasındaki öz-uyumu ve otantik yaşam düzeyini ölçer."
          },
          items: [
            {
              itemId: "psi_ss_aut_01",
              promptTr: "Davranışlarım ve kararlarım başkalarının beklentilerinden çok kendi içsel inançlarıma dayanır.",
              promptEn: "My behaviors and decisions are based on my own internal beliefs rather than others' expectations.",
              behavioralIndicator: "İçsel inançlara uygun eylem",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_ss_aut_02",
              promptTr: "Sırf bir gruba kabul edilmek veya sevilmek için gerçek düşüncelerimi gizleyip rol yaparım.",
              promptEn: "Just to be accepted or liked in a group, I hide my real thoughts and put on an act.",
              behavioralIndicator: "Sosyal kabul için rol yapma (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_ss_aut_03",
              promptTr: "Günlük hayatımda hissettiğim duygularla dışarıya yansıttığım tavırlar birbirine uygundur.",
              promptEn: "In my daily life, the emotions I feel and the attitudes I project outward are congruent.",
              behavioralIndicator: "İçsel ve dışsal ifade uyumu",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_ss_aut_04",
              promptTr: "Çoğu zaman başkalarını memnun etmek adına kendi isteklerimden tamamen ödün veririm.",
              promptEn: "Most of the time, for the sake of pleasing others, I completely sacrifice my own wishes.",
              behavioralIndicator: "Başkalarını memnun etmek için öz-taviz (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_ss_aut_05",
              promptTr: "Kendi öz değerlerime sadık kalarak yaşamak benim için her türlü dış onaydan daha kıymetlidir.",
              promptEn: "Living true to my own core values is more valuable to me than any external validation.",
              behavioralIndicator: "Öz-değerlere sadakat",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        }
      ]
    }
  ]
};

module.exports = { DOMAIN_2_DATA };
