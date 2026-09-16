/**
 * DOMAIN 5: SELF-REGULATION, VOLITION & IMPULSE CONTROL — 2 CONSTRUCTS, 8 FACETS (40 ITEMS)
 * Complete blueprints and original items.
 */

const DOMAIN_5_DATA = {
  domainId: "self_regulation",
  domainNameTr: "Öz-Düzenleme, İrade ve Dürtü Kontrolü",
  domainNameEn: "Self-Regulation, Volition & Impulse Control",
  constructs: [
    // 1. Multidimensional Impulsivity (UPPS-P)
    {
      constructId: "impulsivity_uppsp",
      facets: [
        {
          blueprint: {
            domainId: "self_regulation",
            constructId: "impulsivity_uppsp",
            facetId: "uppsp_negative_urgency",
            nameTr: "Negatif Dürtüsellik (Olumsuz Aciliyet)",
            nameEn: "Negative Urgency (UPPS-P)",
            scientificDefinitionTr: "Öfke, üzüntü veya hayal kırıklığı gibi yoğun olumsuz duygular altındayken sonradan pişman olunacak fevri ve düşüncesiz eylemlerde bulunma eğilimi.",
            inclusionCriteria: ["Olumsuz duygu altında fevrilik", "Stres anında düşüncesiz eylem", "Duygusal tepkisellik"],
            exclusionCriteria: ["Olumlu coşku anında fevrilik", "Planlı saldırganlık"],
            adjacentConstructs: ["uppsp_positive_urgency", "uppsp_lack_of_premeditation", "patience"],
            discriminantRisks: ["Negatif dürtüselliği pozitif duygu altındaki dürtüsellikten ve genel öfkeden ayrıştırmak"],
            referenceInstruments: ["UPPS-P Impulsive Behavior Scale (Negative Urgency Subscale)"],
            primarySourceIds: ["src_whiteside_lynam_2001_uppsp"],
            secondarySourceIds: ["src_tangney_2004_bscs"],
            turkishEvidenceSourceIds: ["src_yargic_2011_uppsp_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Yoğun öfke anında sonuçları değerlendirecek zihinsel frenin devre dışı kalması"],
              emotionalIndicators: ["Üzüntü veya öfke patlamasında hemen eyleme geçme baskısı"],
              motivationalIndicators: ["Olumsuz duygusal gerilimi fevri bir eylemle boşaltma arzusu"],
              interpersonalIndicators: ["Kavga anında sonradan utanılacak kırıcı sözler sarf etme"],
              behavioralIndicatorsDetailed: [
                "Morali çok bozulduğunda sonradan pişman olacağı acele kararlar verir",
                "Öfkelendiğinde kendini tutamayıp kırıcı veya fevri davranışlar sergiler",
                "Yoğun stres altındayken sonuçlarını düşünmeden hareket eder",
                "Üzgün olduğunda duygularını rahatlatmak için zararlı alışkanlıklara yönelebilir"
              ]
            },
            relevantContexts: ["stress_decision", "relationships", "everyday_life"],
            undesiredItemPatterns: ["Klinik sınırda kişilik patolojileri"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Olumsuz affektif uyarılma altındaki davranışsal frenleme ve dürtüsellik kontrolünü ölçer."
          },
          items: [
            {
              itemId: "psi_sr_nu_01",
              promptTr: "Çok öfkelendiğimde veya moralim bozulduğunda, sonradan pişman olacağım fevri davranışlarda bulunurum.",
              promptEn: "When I get very angry or upset, I engage in impulsive behaviors that I regret later.",
              behavioralIndicator: "Olumsuz duygu altında fevri eylem",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_nu_02",
              promptTr: "Yoğun bir üzüntü veya hayal kırıklığı yaşasam bile sakinliğimi korur ve düşüncesizce hareket etmem.",
              promptEn: "Even when experiencing intense sadness or disappointment, I stay calm and do not act thoughtlessly.",
              behavioralIndicator: "Olumsuz duygu altında sağduyulu frenleme (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_sr_nu_03",
              promptTr: "Kendimi kötü hissettiğimde o anki sıkıntıdan kurtulmak için mantıksız ve aceleci adımlar atarım.",
              promptEn: "When I feel bad, I take irrational and hasty steps just to escape the momentary distress.",
              behavioralIndicator: "Sıkıntı anında aceleci adımlar",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_nu_04",
              promptTr: "Tartışma anında ne kadar sinirlenirsem sinirleneyim ağzımdan çıkacak sözleri tartar ve kontrol ederim.",
              promptEn: "No matter how angry I get during an argument, I weigh and control the words coming out of my mouth.",
              behavioralIndicator: "Öfke anında sözsel otokontrol (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_sr_nu_05",
              promptTr: "Duygusal olarak çok yıprandığımda kendimi durdurmakta ve mantıklı davranmakta çok zorlanırım.",
              promptEn: "When I am emotionally exhausted, I find it very difficult to stop myself and act logically.",
              behavioralIndicator: "Duygusal baskı altında irade kaybı",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        },
        {
          blueprint: {
            domainId: "self_regulation",
            constructId: "impulsivity_uppsp",
            facetId: "uppsp_positive_urgency",
            nameTr: "Pozitif Dürtüsellik (Olumlu Aciliyet)",
            nameEn: "Positive Urgency (UPPS-P)",
            scientificDefinitionTr: "Aşırı sevinç, coşku veya heyecan gibi yoğun olumlu duygusal anlardayken sonuçlarını tartmadan fevri, riskli ve aşırıya kaçan eylemlerde bulunma eğilimi.",
            inclusionCriteria: ["Aşırı sevinç anında fevrilik", "Coşku altındayken risk alma", "Kutlama anında sınır kaybı"],
            exclusionCriteria: ["Negatif öfke dürtüselliği", "Planlı eğlence"],
            adjacentConstructs: ["uppsp_negative_urgency", "uppsp_sensation_seeking", "liveliness"],
            discriminantRisks: ["Pozitif dürtüselliği negatif dürtüsellikten ve genel heyecan arayışından ayrıştırmak"],
            referenceInstruments: ["UPPS-P Impulsive Behavior Scale (Positive Urgency Subscale)"],
            primarySourceIds: ["src_whiteside_lynam_2001_uppsp"],
            secondarySourceIds: ["src_tangney_2004_bscs"],
            turkishEvidenceSourceIds: ["src_yargic_2011_uppsp_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Aşırı coşku anında riskleri önemsiz görme"],
              emotionalIndicators: ["Büyük sevinç anında sınır tanımayan bir taşkınlık hissi"],
              motivationalIndicators: ["Kutlama ve coşku anında hemen aşırı harcama veya riskli eyleme yönelme"],
              interpersonalIndicators: ["Heyecan anında tutamayacağı büyük vaatlerde bulunma"],
              behavioralIndicatorsDetailed: [
                "Çok mutlu veya heyecanlı olduğunda sonradan pişman olacağı abartılı sözler veya hediyeler verir",
                "Büyük bir sevinç anında aşırı para harcama veya riskli kararlar alma eğilimindedir",
                "Coşkuya kapıldığında otokontrolünü kaybedip aşırıya kaçar",
                "Kutlama ortamlarında sınırlarını korumakta zorlanır"
              ]
            },
            relevantContexts: ["social_settings", "decisions", "everyday_life"],
            undesiredItemPatterns: ["Klinik manik atak ifadeleri"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Pozitif affektif coşku altındaki davranışsal frenleme ve fevrilik düzeyini ölçer."
          },
          items: [
            {
              itemId: "psi_sr_pu_01",
              promptTr: "Çok mutlu veya coşkulu olduğum anlarda, sonradan mantıksız bulacağım aşırı ve fevri kararlar alabilirim.",
              promptEn: "In moments when I am very happy or enthusiastic, I can make extreme and impulsive decisions that I later find irrational.",
              behavioralIndicator: "Coşku anında mantıksız kararlar alma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_pu_02",
              promptTr: "Büyük bir sevinç veya kutlama anında bile sağduyulu sınırlarımı ve otokontrolümü korurum.",
              promptEn: "Even in moments of great joy or celebration, I maintain my sensible boundaries and self-control.",
              behavioralIndicator: "Sevinç anında otokontrolü koruma (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_sr_pu_03",
              promptTr: "Kendimi harika hissettiğimde aşırı para harcamak veya gereksiz riskler almak bana cazip gelir.",
              promptEn: "When I feel wonderful, spending excessive money or taking unnecessary risks appeals to me.",
              behavioralIndicator: "İyi hissederken aşırı harcama veya risk alma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_pu_04",
              promptTr: "Aşırı heyecanlandığımda bile ileride pişman olacağım büyük sözler vermekten kaçınırım.",
              promptEn: "Even when overly excited, I avoid making big promises that I will regret later.",
              behavioralIndicator: "Heyecan anında tutamayacağı sözler vermeme (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_sr_pu_05",
              promptTr: "Coşkuya kapıldığımda aklımın sesini dinlemeyi bırakıp kendimi anın akışına kontrolsüzce kaptırırım.",
              promptEn: "When caught up in enthusiasm, I stop listening to the voice of reason and lose myself uncontrollably in the moment.",
              behavioralIndicator: "Coşkuda kontrolsüzce kendini kaptırma",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        },
        {
          blueprint: {
            domainId: "self_regulation",
            constructId: "impulsivity_uppsp",
            facetId: "uppsp_lack_of_premeditation",
            nameTr: "Önceden Düşünmeme (Fevrilik)",
            nameEn: "Lack of Premeditation (UPPS-P)",
            scientificDefinitionTr: "Bir eyleme geçmeden veya karar vermeden önce olası sonuçları, alternatifleri ve riskleri önceden etraflıca düşünmeme eğilimi.",
            inclusionCriteria: ["Düşünmeden harekete geçme", "Sonuçları hesaplamama", "Anlık hevesle eylem"],
            exclusionCriteria: ["Duygusal dürtüsellik", "Planlı strateji"],
            adjacentConstructs: ["prudence", "general_self_control", "delay_discounting_preference"],
            discriminantRisks: ["Düşüncesiz fevriliği duygusal aciliyetten ve sebat eksikliğinden ayrıştırmak"],
            referenceInstruments: ["UPPS-P Impulsive Behavior Scale (Lack of Premeditation Subscale)"],
            primarySourceIds: ["src_whiteside_lynam_2001_uppsp"],
            secondarySourceIds: ["src_tangney_2004_bscs"],
            turkishEvidenceSourceIds: ["src_yargic_2011_uppsp_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Eylemlerin gelecekteki sonuçlarını hesaba katmama"],
              emotionalIndicators: ["Sonuçları düşünmeksizin anlık hevese kapılma"],
              motivationalIndicators: ["Hemen eyleme geçme ve beklememe isteği"],
              interpersonalIndicators: ["Düşünmeden ani tepkiler verme"],
              behavioralIndicatorsDetailed: [
                "Bir şeye karar verirken sonuçlarını enine boyuna düşünmeden harekete geçer",
                "Aklına ilk geleni hemen uygular",
                "Olayların nereye varacağını hesaplamaktan kaçınır",
                "Aceleci ve düşüncesiz adımlar atar"
              ]
            },
            relevantContexts: ["decisions", "planning", "everyday_life"],
            undesiredItemPatterns: ["Hiç düşünmem gibi mutlakçı ifadeler"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Eylem öncesi bilişsel değerlendirme ve ihtiyatlı ön-düşünme eksikliğini ölçer."
          },
          items: [
            {
              itemId: "psi_sr_lop_01",
              promptTr: "Çoğu zaman bir eyleme geçmeden önce doğurabileceği sonuçları etraflıca tartmadan harekete geçerim.",
              promptEn: "Most of the time, I act before thoroughly weighing the consequences an action might produce.",
              behavioralIndicator: "Sonuçları tartmadan harekete geçme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_lop_02",
              promptTr: "Önemli bir adım atmadan önce her zaman olası riskleri ve alternatifleri dikkatle incelerim.",
              promptEn: "Before taking an important step, I always examine possible risks and alternatives carefully.",
              behavioralIndicator: "Adım atmadan önce riskleri inceleme (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_sr_lop_03",
              promptTr: "Aklıma bir fikir geldiğinde sonucunu fazla düşünmeden hemen uygulamaya koyulurum.",
              promptEn: "When an idea comes to my mind, I set out to implement it right away without thinking much about the outcome.",
              behavioralIndicator: "Aklına geleni anında uygulama",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_lop_04",
              promptTr: "Kararlarımı aceleye getirmem, olayın tüm boyutlarını sağduyuyla değerlendiririm.",
              promptEn: "I do not rush my decisions; I evaluate all dimensions of the matter with common sense.",
              behavioralIndicator: "Sağduyulu ve temkinli karar alma (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_sr_lop_05",
              promptTr: "Genellikle önce davranıp ne yaptığımı ancak sonrasında fark eden bir yapım vardır.",
              promptEn: "I usually have a nature of acting first and only realizing what I did afterwards.",
              behavioralIndicator: "Önce davranıp sonra fark etme",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        },
        {
          blueprint: {
            domainId: "self_regulation",
            constructId: "impulsivity_uppsp",
            facetId: "uppsp_lack_of_perseverance",
            nameTr: "Sebat Eksikliği (Çabuk Bıkma)",
            nameEn: "Lack of Perseverance (UPPS-P)",
            scientificDefinitionTr: "Zorlayıcı, sıkıcı veya dikkat dağıtıcı görevler karşısında odaklanmayı sürdürememe; bir işi sonuna kadar tamamlamakta zorlanıp çabuk sıkılma eğilimi.",
            inclusionCriteria: ["Görevden çabuk sıkılma", "Zorlukta odağı kaybetme", "Yarım bırakma"],
            exclusionCriteria: ["DEHB klinik tanısı", "Stratejik vazgeçiş"],
            adjacentConstructs: ["diligence", "long_term_grit", "general_self_control"],
            discriminantRisks: ["Sebat eksikliğini genel çalışkanlık düşüklüğünden ve dikkat eksikliğinden ayrıştırmak"],
            referenceInstruments: ["UPPS-P Impulsive Behavior Scale (Lack of Perseverance Subscale)"],
            primarySourceIds: ["src_whiteside_lynam_2001_uppsp"],
            secondarySourceIds: ["src_duckworth_2007_grit"],
            turkishEvidenceSourceIds: ["src_yargic_2011_uppsp_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Sıkıcı görevlerin sürdürülemeyeceğini düşünme"],
              emotionalIndicators: ["İş rutinleştiğinde yoğun bir bıkkınlık ve huzursuzluk duyma"],
              motivationalIndicators: ["Zorluk anında görevi hemen bırakıp daha eğlenceli şeylere kayma"],
              interpersonalIndicators: ["Grup projelerinde işin sonunu getirmekte zorlanma"],
              behavioralIndicatorsDetailed: [
                "Bir iş biraz sıkıcı veya zorlayıcı hale geldiğinde çabucak ilgisini kaybeder",
                "Başladığı projeleri sonuna kadar bitirmekte büyük güçlük çeker",
                "Dikkatini uzun süre tek bir görev üzerinde tutamaz",
                "İşler rutinleştiğinde yarım bırakma eğilimi gösterir"
              ]
            },
            relevantContexts: ["work_task", "personal_goals", "planning"],
            undesiredItemPatterns: ["Hiçbir şeye dikkat edemem gibi nörolojik ifadeler"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Bireyin sıkıcı ve zorlayıcı görevler karşısındaki dikkati sürdürme ve sebat kapasitesini ölçer."
          },
          items: [
            {
              itemId: "psi_sr_lopv_01",
              promptTr: "Bir iş biraz sıkıcı veya zorlayıcı hale geldiğinde dikkatimi sürdürmekte çok zorlanır ve işi yarım bırakırım.",
              promptEn: "When a task becomes somewhat boring or challenging, I struggle greatly to maintain attention and leave it half-done.",
              behavioralIndicator: "Sıkıcı görevlerde işi yarım bırakma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_lopv_02",
              promptTr: "Ne kadar monoton veya zor olursa olsun, başladığım bir görevi kararlılıkla sonuna kadar bitiririm.",
              promptEn: "No matter how monotonous or hard it is, I finish a task I started with determination to the very end.",
              behavioralIndicator: "Monoton görevlerde sonuna kadar sebat etme (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_sr_lopv_03",
              promptTr: "Zorlu bir proje üzerinde çalışırken en ufak bir zorlukta hevesim hemen kaçar.",
              promptEn: "While working on a challenging project, my enthusiasm quickly vanishes at the slightest difficulty.",
              behavioralIndicator: "Zorluk karşısında hevesin çabuk kaçması",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_lopv_04",
              promptTr: "Dikkat dağıtıcı unsurlar olsa bile odaklandığım işi tamamlamadan başından kalkmam.",
              promptEn: "Even when there are distractions, I do not get up from the task I focus on before completing it.",
              behavioralIndicator: "Dikkat dağıtıcılara rağmen işi tamamlama (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_sr_lopv_05",
              promptTr: "Hayatımda büyük bir hevesle başlayıp yarım bıraktığım sayısız iş ve proje vardır.",
              promptEn: "In my life, there are countless tasks and projects that I started with great enthusiasm and left unfinished.",
              behavioralIndicator: "Yarım bırakılmış projeler eğilimi",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        },
        {
          blueprint: {
            domainId: "self_regulation",
            constructId: "impulsivity_uppsp",
            facetId: "uppsp_sensation_seeking",
            nameTr: "Heyecan Arayışı",
            nameEn: "Sensation Seeking (UPPS-P)",
            scientificDefinitionTr: "Yeni, yoğun, heyecan verici ve sıradışı deneyimleri arama; bu deneyimler için fiziksel veya sosyal riskleri göze alma eğilimi.",
            inclusionCriteria: ["Yeni ve yoğun deneyim arayışı", "Heyecan ve adrenalin isteği", "Risk alma arzusu"],
            exclusionCriteria: ["Fiziksel korku", "Antisosyal yıkıcılık"],
            adjacentConstructs: ["fearfulness", "unconventionality", "joyous_exploration_curiosity"],
            discriminantRisks: ["Heyecan arayışını düşüncesiz fevrilikten ve antisosyal sapkınlıktan ayrıştırmak"],
            referenceInstruments: ["UPPS-P Impulsive Behavior Scale (Sensation Seeking Subscale)", "Zuckerman Sensation Seeking Scale"],
            primarySourceIds: ["src_whiteside_lynam_2001_uppsp"],
            secondarySourceIds: ["src_ashton_lee_2007"],
            turkishEvidenceSourceIds: ["src_yargic_2011_uppsp_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Hayatın rutin değil macera dolu olması gerektiğine inanma"],
              emotionalIndicators: ["Hız, yükseklik veya yeni deneyimler anında yoğun keyif"],
              motivationalIndicators: ["Monotonluktan kaçıp adrenalin dolu aktivitelere yönelme"],
              interpersonalIndicators: ["Sosyal çevresini heyecan verici maceralara teşvik etme"],
              behavioralIndicatorsDetailed: [
                "Yeni ve heyecan verici deneyimleri tatmaktan büyük zevk alır",
                "Adrenalin salgılatacak macera dolu aktivitelere istekle katılır",
                "Monoton ve her günü aynı geçen bir yaşamdan çabuk sıkılır",
                "Heyecan uğruna belirli riskleri göze almaktan çekinmez"
              ]
            },
            relevantContexts: ["everyday_life", "social_settings"],
            undesiredItemPatterns: ["Yasa dışı suç işlerim gibi kriminal ifadeler"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Bireyin yeni, yoğun ve heyecan verici duyusal deneyimlere yönelim düzeyini ölçer."
          },
          items: [
            {
              itemId: "psi_sr_ss_01",
              promptTr: "Adrenalin ve heyecan dolu yeni maceralar denemek bana büyük bir canlılık verir.",
              promptEn: "Trying new adventures full of adrenaline and excitement gives me great vitality.",
              behavioralIndicator: "Adrenalin ve macera arayışı",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_ss_02",
              promptTr: "Güvenli, sakin ve öngörülebilir bir yaşamı heyecan dolu maceralara her zaman tercih ederim.",
              promptEn: "I always prefer a safe, calm, and predictable life over adventures full of excitement.",
              behavioralIndicator: "Sakin ve güvenli yaşam tercihi (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_sr_ss_03",
              promptTr: "Daha önce hiç denemediğim sıra dışı ve heyecan verici deneyimleri yaşamayı severim.",
              promptEn: "I like experiencing unusual and thrilling experiences that I have never tried before.",
              behavioralIndicator: "Sıra dışı deneyim merakı",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_ss_04",
              promptTr: "Tehlike veya belirsizlik içeren aktiviteler bana hiç çekici gelmez, uzak dururum.",
              promptEn: "Activities involving danger or uncertainty do not appeal to me at all; I stay away.",
              behavioralIndicator: "Riskli aktivitelerden uzak durma (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_sr_ss_05",
              promptTr: "Monotonluktan kurtulmak için hayatımda ara sıra sınırları zorlayacak heyecanlar ararım.",
              promptEn: "To break free from monotony, I occasionally seek thrills in my life that push the boundaries.",
              behavioralIndicator: "Monotonluğu kırma ve sınırları zorlama",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        }
      ]
    },

    // 2. Volitional Stamina & Self-Control
    {
      constructId: "volitional_stamina",
      facets: [
        {
          blueprint: {
            domainId: "self_regulation",
            constructId: "volitional_stamina",
            facetId: "general_self_control",
            nameTr: "Genel Öz-Kontrol",
            nameEn: "General Self-Control",
            scientificDefinitionTr: "Anlık arzu, dürtü ve ayartıcı unsurları uzun vadeli hedefler lehine bilinçli olarak dizginleyebilme ve davranışlarını yönetebilme kapasitesi.",
            inclusionCriteria: ["Ayartıcılara direnme", "Öz-disiplin", "Anlık dürtüleri dizginleme"],
            exclusionCriteria: ["Katı rijitlik", "Zevk alamama (anhedoni)"],
            adjacentConstructs: ["prudence", "delay_discounting_preference", "long_term_grit"],
            discriminantRisks: ["Öz-kontrolü aşırı katı duygusal baskılamadan ayrıştırmak"],
            referenceInstruments: ["Brief Self-Control Scale (BSCS - Tangney et al.)"],
            primarySourceIds: ["src_tangney_2004_bscs"],
            secondarySourceIds: ["src_duckworth_2007_grit"],
            turkishEvidenceSourceIds: ["src_duyan_2012_bscs_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Anlık hazzı ertelemenin uzun vadede kazandıracağını bilme"],
              emotionalIndicators: ["Ayartıcı durumlar karşısında iradesine hakim olabilme"],
              motivationalIndicators: ["Zararlı alışkanlıklara ve dürtülere 'dur' diyebilme gücü"],
              interpersonalIndicators: ["Sosyal ortamlarda taşkınlıktan kaçınma"],
              behavioralIndicatorsDetailed: [
                "Kendisine zarar verecek anlık ayartıcılara ve zevklere karşı rahatça 'hayır' diyebilir",
                "Alışkanlıklarını ve dürtülerini kontrol altında tutmakta başarılıdır",
                "Uzun vadeli hedefleri için anlık rahatlığından feragat edebilir",
                "İradesini disiplinli şekilde kullanır"
              ]
            },
            relevantContexts: ["everyday_life", "personal_goals", "work_task"],
            undesiredItemPatterns: ["Hiçbir zevkten hoşlanmam gibi anhedonik ifadeler"],
            socialDesirabilityRisk: "MODERATE",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Bireyin anlık ayartıcılar karşısındaki yürütücü öz-denetim ve irade gücünü ölçer."
          },
          items: [
            {
              itemId: "psi_sr_sc_01",
              promptTr: "Uzun vadeli hedeflerime zarar verebilecek anlık ayartıcılara ve heveslere karşı irademi koruyabilirim.",
              promptEn: "I can maintain my willpower against momentary temptations and whims that could harm my long-term goals.",
              behavioralIndicator: "Ayartıcılar karşısında iradeyi koruma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_sc_02",
              promptTr: "Zararlı olduğunu bildiğim alışkanlıklarıma ve anlık dürtülerime karşı koymakta çok zorlanırım.",
              promptEn: "I find it very hard to resist my harmful habits and momentary impulses even though I know they are detrimental.",
              behavioralIndicator: "Zararlı dürtülere karşı koyamama (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_sr_sc_03",
              promptTr: "Kişisel disiplinimi koruyarak yapmam gereken şeylere odaklanmakta başarılıyımdır.",
              promptEn: "I am successful in focusing on what I need to do by preserving my personal discipline.",
              behavioralIndicator: "Kişisel öz-disiplin başarısı",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_sc_04",
              promptTr: "Kendime koyduğum kuralları ve sınırları en ufak bir zevk veya rahatlık fırsatında hemen bozarım.",
              promptEn: "I immediately break the rules and boundaries I set for myself at the slightest opportunity of pleasure or comfort.",
              behavioralIndicator: "Kuralları ve sınırları çabuk bozma (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_sr_sc_05",
              promptTr: "Dürtülerimin ve anlık arzularımın esiri olmak yerine davranışlarımı bilinçli olarak yönetirim.",
              promptEn: "Rather than being a slave to my impulses and momentary desires, I manage my behaviors consciously.",
              behavioralIndicator: "Davranışları bilinçli yönetme",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        },
        {
          blueprint: {
            domainId: "self_regulation",
            constructId: "volitional_stamina",
            facetId: "delay_discounting_preference",
            nameTr: "Gecikmeli Ödül Tercihi (Geleceğe Yatırım)",
            nameEn: "Delay Discounting Preference",
            scientificDefinitionTr: "Küçük ama hemen elde edilecek bir ödül yerine, daha büyük ama gelecekte elde edilecek bir ödülü sabırla bekleyebilme eğilimi.",
            inclusionCriteria: ["Hazzı erteleme", "Gelecek odaklı yatırım", "Sabırla bekleme"],
            exclusionCriteria: ["Kör cimrilik", "Bugünü hiç yaşayamama"],
            adjacentConstructs: ["general_self_control", "long_term_grit", "prudence"],
            discriminantRisks: ["Gecikmeli ödül tercihini aşırı cimrilikten veya anı yaşayamamaktan ayrıştırmak"],
            referenceInstruments: ["Delay Discounting Questionnaire (Kirby et al.)", "Monetary Choice Questionnaire"],
            primarySourceIds: ["src_kirby_1999_discounting"],
            secondarySourceIds: ["src_tangney_2004_bscs"],
            turkishEvidenceSourceIds: ["src_duyan_2012_bscs_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Gelecekteki büyük kazanımların bugünkü anlık keyiflerden değerli olduğunu bilme"],
              emotionalIndicators: ["Beklemenin getirdiği geçici mahrumiyeti huzurla tolere etme"],
              motivationalIndicators: ["Geleceği güvenceye almak için bugün fedakarlık yapma isteği"],
              interpersonalIndicators: ["Ortak yatırımlarda sabırlı davranma"],
              behavioralIndicatorsDetailed: [
                "Gelecekte daha büyük bir başarı elde etmek için bugünkü küçük zevkleri erteleyebilir",
                "Anında tatmin olmak yerine sabırla beklemeyi tercih eder",
                "Geleceğine yatırım yapmayı anlık tüketimden önde tutar",
                "Sabretmenin meyvesini alacağına dair inancı yüksektir"
              ]
            },
            relevantContexts: ["decisions", "personal_goals", "planning", "everyday_life"],
            undesiredItemPatterns: ["Bugünü hiç yaşamam gibi aşırı ifadeler"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Bireyin anlık hazzı erteleyip gelecekteki daha büyük kazanımları seçme (Delay of Gratification) derecesini ölçer."
          },
          items: [
            {
              itemId: "psi_sr_dd_01",
              promptTr: "Gelecekte çok daha büyük bir kazanım elde edeceksem, bugünkü küçük zevkleri sabırla erteleyebilirim.",
              promptEn: "If I will achieve a much greater gain in the future, I can patiently postpone today's minor pleasures.",
              behavioralIndicator: "Büyük gelecek kazanımı için anlık zevki erteleme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_dd_02",
              promptTr: "Gelecekte ne olacağı belirsiz olduğundan, elime geçen her fırsatı ve zevki hemen tüketmeyi tercih ederim.",
              promptEn: "Since what will happen in the future is uncertain, I prefer to consume every opportunity and pleasure that comes my way immediately.",
              behavioralIndicator: "Anında tüketim tercihi (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_sr_dd_03",
              promptTr: "Uzun vadeli hedeflerim için bugün yapmam gereken fedakarlıkları gönüllü olarak üstlenirim.",
              promptEn: "I voluntarily undertake the sacrifices I need to make today for my long-term goals.",
              behavioralIndicator: "Uzun vadeli hedef için gönüllü fedakarlık",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_dd_04",
              promptTr: "Bir ödülü veya sonucu beklemek zorunda olmak bana katlanılmaz gelir; hemen şimdi elde etmek isterim.",
              promptEn: "Having to wait for a reward or outcome feels intolerable to me; I want to get it right now.",
              behavioralIndicator: "Beklemeye tahammülsüzlük / anında tatmin arayışı (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_sr_dd_05",
              promptTr: "Sabırla geleceğe yatırım yapmanın kısa vadeli hazlardan çok daha değerli olduğunu bilirim.",
              promptEn: "I know that patiently investing in the future is much more valuable than short-term pleasures.",
              behavioralIndicator: "Geleceğe yatırım bilinci",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        },
        {
          blueprint: {
            domainId: "self_regulation",
            constructId: "volitional_stamina",
            facetId: "long_term_grit",
            nameTr: "Uzun Vadeli Sebat ve Azim (Grit)",
            nameEn: "Long-Term Grit",
            scientificDefinitionTr: "Aylar ve yıllar süren uzun vadeli hedeflere karşı sönmeyen bir tutku ve zorluklara, başarısızlıklara ve duraklamalara rağmen vazgeçmeden çalışma azmi.",
            inclusionCriteria: ["Yıllara yayılan hedef bağlılığı", "Tutku sürekliliği", "Yenilgiden sonra ayağa kalkma"],
            exclusionCriteria: ["Kör inat", "Zarar veren çıkmaz yolda ısrar"],
            adjacentConstructs: ["diligence", "general_self_control", "ego_resilience"],
            discriminantRisks: ["Uzun vadeli azmi (yıllara yayılan hedef tutkusu) anlık çalışkanlıktan ayrıştırmak"],
            referenceInstruments: ["Short Grit Scale (Grit-S - Duckworth et al.)", "Grit Scale (Grit-O)"],
            primarySourceIds: ["src_duckworth_2007_grit"],
            secondarySourceIds: ["src_tangney_2004_bscs"],
            turkishEvidenceSourceIds: ["src_saricam_2016_grit_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Başarının yetenekten çok uzun vadeli sebatla kazanılacağına inanma"],
              emotionalIndicators: ["Yıllar geçse bile temel hedefine duyduğu heyecanı kaybetmeme"],
              motivationalIndicators: ["Büyük başarısızlıklardan sonra dahi aynı hedefe asılmaya devam etme"],
              interpersonalIndicators: ["Hedefine ulaşırken çevresine ilham verici bir azim sergileme"],
              behavioralIndicatorsDetailed: [
                "Aylar hatta yıllar süren büyük bir hedefe olan ilgisini ve tutkusunu kaybetmez",
                "Ciddi engeller ve başarısızlıklar karşısında vazgeçmeyip yoluna devam eder",
                "Bir projeye başladığında aradan uzun zaman geçse bile hedefine sadık kalır",
                "Zorluklar onun azmini kırmak yerine daha da biler"
              ]
            },
            relevantContexts: ["personal_goals", "work_task", "everyday_life"],
            undesiredItemPatterns: ["Hiçbir zaman fikrimi değiştirmem gibi kör inat ifadeleri"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Uzun vadeli büyük hedeflere yönelik sarsılmaz sebat ve tutku sürekliliğini (Grit) ölçer."
          },
          items: [
            {
              itemId: "psi_sr_grt_01",
              promptTr: "Aylar hatta yıllar süren büyük hedeflerime ulaşmak için zorluklar karşısında yılmadan çalışmaya devam ederim.",
              promptEn: "To reach my major goals that span months or even years, I continue to work undaunted in the face of difficulties.",
              behavioralIndicator: "Uzun vadeli hedefe yılmadan çalışma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_grt_02",
              promptTr: "Yeni hedeflere hızla heveslenir, ancak birkaç ay sonra ilgimi tamamen kaybedip başka şeylere yönelirim.",
              promptEn: "I quickly get enthusiastic about new goals, but after a few months I lose interest completely and turn to other things.",
              behavioralIndicator: "Hedef tutkusunun çabuk sönmesi (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_sr_grt_03",
              promptTr: "Büyük bir başarısızlık veya engelle karşılaştığımda vazgeçmek yerine hedefime daha büyük bir azimle sarılırım.",
              promptEn: "When faced with a major failure or obstacle, rather than giving up, I embrace my goal with even greater determination.",
              behavioralIndicator: "Başarısızlıkta azimle yola devam etme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_grt_04",
              promptTr: "Bir proje uzun sürdüğünde ve zorlaştığında başlangıçtaki bağlılığımı korumakta zorlanırım.",
              promptEn: "When a project takes a long time and gets difficult, I struggle to maintain my initial commitment.",
              behavioralIndicator: "Uzun süren projelerde bağlılık kaybı (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_sr_grt_05",
              promptTr: "Önem verdiğim bir hayali gerçekleştirmek için gereken uzun soluklu mücadeleyi sabırla sürdürebilirim.",
              promptEn: "I can patiently maintain the long-term struggle required to realize a dream I care about.",
              behavioralIndicator: "Uzun soluklu mücadeleyi sürdürebilme",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        }
      ]
    }
  ]
};

module.exports = { DOMAIN_5_DATA };
