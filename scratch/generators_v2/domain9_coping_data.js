/**
 * DOMAIN 9: COPING, ADAPTATION & PSYCHOLOGICAL RESILIENCE — 2 CONSTRUCTS, 4 FACETS (20 ITEMS)
 * Complete blueprints and original items.
 */

const DOMAIN_9_DATA = {
  domainId: "coping_resilience",
  domainNameTr: "Başa Çıkma, Uyum ve Psikolojik Dayanıklılık",
  domainNameEn: "Coping, Adaptation & Psychological Resilience",
  constructs: [
    // 1. Trait Resilience & Recovery
    {
      constructId: "trait_resilience",
      facets: [
        {
          blueprint: {
            domainId: "coping_resilience",
            constructId: "trait_resilience",
            facetId: "ego_resilience",
            nameTr: "Ego Dayanıklılığı ve Esnek Uyum",
            nameEn: "Ego-Resilience",
            scientificDefinitionTr: "Değişen çevresel taleplere ve beklenmedik stres faktörlerine karşı esnek, yaratıcı ve kaynaklarını harekete geçirerek uyum sağlayabilme kapasitesi.",
            inclusionCriteria: ["Esnek uyum sağlama", "Kriz anında kaynak bulma", "Zorlukları aşma inancı"],
            exclusionCriteria: ["Katı inatçılık", "Duygusal hissizlik"],
            adjacentConstructs: ["stress_recovery", "flexibility_personality", "growth_mindset_intelligence"],
            discriminantRisks: ["Esnek dayanıklılığı katı duygusal bastırmadan ayırmak"],
            referenceInstruments: ["Ego-Resiliency Scale (ER89 - Block & Kremen)"],
            primarySourceIds: ["src_block_kremen_1996_er89"],
            secondarySourceIds: ["src_smith_2008_brs"],
            turkishEvidenceSourceIds: ["src_karairmak_2010_resilience_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Zorlukların yeni fırsatlar barındırabileceğini düşünme"],
              emotionalIndicators: ["Beklenmedik krizler karşısında paniğe kapılmadan sakin kalabilme"],
              motivationalIndicators: ["Zorluklar karşısında yılmadan alternatif yollar deneme"],
              interpersonalIndicators: ["Kriz durumlarında çevresine güven ve itidal aşılama"],
              behavioralIndicatorsDetailed: [
                "Beklenmedik bir engelle karşılaştığında hızla alternatif çözümler üretir",
                "Hayatın getirdiği ani değişimlere ve belirsizliklere kolayca ayak uydurur",
                "Zor durumlardan yeni deneyimler ve güç kazanarak çıkmasını bilir",
                "Planları bozulduğunda umutsuzluğa kapılmak yerine şartlara uyum sağlar"
              ]
            },
            relevantContexts: ["stress_decision", "uncertainty", "work_task"],
            undesiredItemPatterns: ["Bana hiçbir şey olmaz gibi narsistik/yenilmezlik ifadeleri"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Bireyin dinamik psikolojik esnekliğini ve uyum gücünü ölçer."
          },
          items: [
            {
              itemId: "psi_cr_egr_01",
              promptTr: "Hayatımda beklenmedik bir kriz veya büyük bir değişiklik olduğunda yeni duruma hızla uyum sağlayabilirim.",
              promptEn: "When an unexpected crisis or major change occurs in my life, I can quickly adapt to the new situation.",
              behavioralIndicator: "Beklenmedik değişimlere hızlı uyum",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cr_egr_02",
              promptTr: "Planlarım dışındaki ani aksilikler karşısında ne yapacağımı şaşırır, tamamen kilitlenir kalırım.",
              promptEn: "In the face of sudden setbacks outside my plans, I get disoriented and completely freeze up.",
              behavioralIndicator: "Aksilikler karşısında kilitlenme ve uyumsuzluk (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_cr_egr_03",
              promptTr: "Zor bir durumla karşılaştığımda paniğe kapılmak yerine sakinleşip farklı çıkış yolları bulmaya odaklanırım.",
              promptEn: "When facing a difficult situation, instead of panicking, I calm down and focus on finding alternative ways out.",
              behavioralIndicator: "Sakin kalarak çıkış yolu bulma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cr_egr_04",
              promptTr: "Başarısızlıkları ve aksilikleri kendimi geliştirmem için birer öğrenme fırsatı olarak görürüm.",
              promptEn: "I view failures and setbacks as learning opportunities to grow and improve myself.",
              behavioralIndicator: "Zorlukları öğrenme fırsatı olarak görme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cr_egr_05",
              promptTr: "Alışık olduğum düzen azıcık bozulduğunda bile günlerce toparlanmakta güçlük çekerim.",
              promptEn: "Even when my familiar routine is slightly disrupted, I struggle for days to get back on track.",
              behavioralIndicator: "Düzen değişimine karşı aşırı kırılganlık (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            }
          ]
        },
        {
          blueprint: {
            domainId: "coping_resilience",
            constructId: "trait_resilience",
            facetId: "stress_recovery",
            nameTr: "Stresten Toparlanma Hızı (Bounce-Back)",
            nameEn: "Stress Recovery",
            scientificDefinitionTr: "Yoğun stres, travmatik deneyim veya hayal kırıklığı sonrasında psikolojik ve fizyolojik dengeye hızla geri dönebilme (bounce-back) yeteneği.",
            inclusionCriteria: ["Stresten hızlı toparlanma", "Dengeyi yeniden kurma", "Kalıcı yıpranmadan kaçınma"],
            exclusionCriteria: ["Kronik tükenmişlik", "Travma sonrası donma"],
            adjacentConstructs: ["ego_resilience", "emotional_stability_regulation", "anxiety"],
            discriminantRisks: ["Toparlanma hızını kronik duygusal hissizlikten ayırmak"],
            referenceInstruments: ["Brief Resilience Scale (BRS - Smith et al.)"],
            primarySourceIds: ["src_smith_2008_brs"],
            secondarySourceIds: ["src_block_kremen_1996_er89"],
            turkishEvidenceSourceIds: ["src_karairmak_2010_resilience_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Kötü dönemlerin geçici olduğuna ve yeniden ayağa kalkacağına inanma"],
              emotionalIndicators: ["Zorlu bir dönemin ardından hızla normal duygu durumuna dönebilme"],
              motivationalIndicators: ["Düştüğü yerden yeniden başlama azmi"],
              interpersonalIndicators: ["Zorluklar sonrasında sosyal hayata hızla geri katılma"],
              behavioralIndicatorsDetailed: [
                "Büyük bir hayal kırıklığı yaşadıktan sonra kısa sürede toparlanır",
                "Yoğun stresli dönemlerin ardından normal psikolojik dengesini hızla geri kazanır",
                "Zorlayıcı yaşam olaylarının etkisini uzun süre üzerinde taşımaz",
                "Darbe aldığında hızla ayağa kalkıp yoluna devam eder"
              ]
            },
            relevantContexts: ["stress_decision", "everyday_life"],
            undesiredItemPatterns: ["Hiçbir şey beni incitemez gibi savunmacı inkar ifadeleri"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Bireyin zorlayıcı stresörlerin ardından orijinal dengesine dönme (bounce-back) kapasitesini ölçer."
          },
          items: [
            {
              itemId: "psi_cr_rec_01",
              promptTr: "Zor ve yıpratıcı bir olay yaşadıktan sonra genellikle kısa sürede kendimi toparlayıp normal hayatıma dönerim.",
              promptEn: "After experiencing a hard and stressful event, I usually bounce back quickly and return to my normal life.",
              behavioralIndicator: "Stres sonrası hızlı toparlanma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cr_rec_02",
              promptTr: "Yaşadığım olumsuz olayların ve hayal kırıklıklarının etkisinden uzun süre kurtulamam.",
              promptEn: "I take a long time to get over set-backs and disappointments in my life.",
              behavioralIndicator: "Hayal kırıklıklarından uzun süre çıkamama (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_cr_rec_03",
              promptTr: "Ağır bir stres dönemi atlattığımda psikolojik dengemi ve iç huzurumu yeniden kolayca kurarım.",
              promptEn: "When getting through a period of severe stress, I easily re-establish my psychological balance and inner peace.",
              behavioralIndicator: "İçsel dengeyi yeniden kurabilme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cr_rec_04",
              promptTr: "Düştüğüm yerden hızla ayağa kalkıp mücadeleye kaldığım yerden devam etme gücüne sahibimdir.",
              promptEn: "I have the strength to bounce back quickly when down and resume where I left off.",
              behavioralIndicator: "Ayağa kalkıp devam etme gücü",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cr_rec_05",
              promptTr: "Hayatımda işler ters gittiğinde toparlanmak benim için son derece zor ve yorucu olur.",
              promptEn: "When things go wrong in my life, recovering is extremely difficult and exhausting for me.",
              behavioralIndicator: "Toparlanmakta aşırı zorlanma (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            }
          ]
        }
      ]
    },

    // 2. Coping Strategies
    {
      constructId: "coping_strategies",
      facets: [
        {
          blueprint: {
            domainId: "coping_resilience",
            constructId: "coping_strategies",
            facetId: "problem_focused_coping",
            nameTr: "Problem Odaklı Başa Çıkma",
            nameEn: "Problem-Focused Coping",
            scientificDefinitionTr: "Stres yaratan durum veya sorunun kaynağını doğrudan ortadan kaldırmak veya değiştirmek amacıyla plan yapma, adım adım hareket etme ve somut eyleme geçme stratejisi.",
            inclusionCriteria: ["Planlı eylem", "Sorunun kaynağına yönelme", "Somut problem çözme"],
            exclusionCriteria: ["Duygusal kaçınma", "Körlemesine acelecilik"],
            adjacentConstructs: ["emotion_focused_coping", "action_orientation_decision", "prudence"],
            discriminantRisks: ["Problem odaklı yaklaşımı salt duygusal dışavurumdan ayırmak"],
            referenceInstruments: ["COPE / Brief COPE (Active Coping & Planning Scales)"],
            primarySourceIds: ["src_carver_1989_cope"],
            secondarySourceIds: ["src_lazarus_folkman_1984"],
            turkishEvidenceSourceIds: ["src_agargun_2005_cope_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Sorunu parçalara ayırarak çözüm adımları planlama"],
              emotionalIndicators: ["Eyleme geçtikçe stresin azaldığını hissetme"],
              motivationalIndicators: ["Sorunu kökünden çözme ve kontrol altına alma motivasyonu"],
              interpersonalIndicators: ["Gerektiğinde somut bilgi ve uzman görüşü arama"],
              behavioralIndicatorsDetailed: [
                "Bir sorunla karşılaştığında sorunu çözmek için somut bir eylem planı yapar",
                "Sorunun kök nedenlerini analiz eder ve adım adım ortadan kaldırmaya çalışır",
                "Stres karşısında sadece şikayet etmek yerine doğrudan çözüm için harekete geçer",
                "Zorluğu aşmak için gerekli kaynakları ve bilgileri araştırıp kullanır"
              ]
            },
            relevantContexts: ["work_task", "stress_decision", "everyday_life"],
            undesiredItemPatterns: ["Her problemi anında çözerim gibi kibirli ifadeler"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Lazarus & Folkman stres kuramında aktif problem odaklı başa çıkma yönelimini ölçer."
          },
          items: [
            {
              itemId: "psi_cr_pfc_01",
              promptTr: "Zor bir durumla veya stresle karşılaştığımda sorunu çözmek için hemen somut bir plan yapar ve harekete geçerim.",
              promptEn: "When facing a difficult situation or stress, I immediately make a concrete plan to solve the problem and take action.",
              behavioralIndicator: "Somut plan yapma ve eyleme geçme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cr_pfc_02",
              promptTr: "Sorunlar karşısında ne yapacağımı düşünmek yerine genellikle olayları akışına bırakır ve eylemsiz kalırım.",
              promptEn: "Instead of thinking about what to do in the face of problems, I usually let things drift and stay inactive.",
              behavioralIndicator: "Eylemsizlik ve akışına bırakma (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_cr_pfc_03",
              promptTr: "Bir problem yaşadığımda dikkatimi doğrudan sorunun kaynağını değiştirmeye ve ortadan kaldırmaya odaklarim.",
              promptEn: "When experiencing a problem, I focus my attention directly on altering and eliminating the source of the problem.",
              behavioralIndicator: "Sorunun kök kaynağına odaklanma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cr_pfc_04",
              promptTr: "Karşılaştığım engeli aşmak için gerekli bilgi ve kaynakları adım adım araştırıp uygularım.",
              promptEn: "I research and apply the necessary information and resources step by step to overcome the obstacle I face.",
              behavioralIndicator: "Adım adım kaynak ve bilgi uygulama",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cr_pfc_05",
              promptTr: "Bir sıkıntı çıktığında çözüm üretmek yerine durumdan şikayet etmekle vakit kaybederim.",
              promptEn: "When trouble arises, I waste time complaining about the situation rather than producing solutions.",
              behavioralIndicator: "Çözüm yerine şikayet etme (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            }
          ]
        },
        {
          blueprint: {
            domainId: "coping_resilience",
            constructId: "coping_strategies",
            facetId: "emotion_focused_coping",
            nameTr: "Duygu Odaklı Başa Çıkma ve Anlamlandırma",
            nameEn: "Emotion-Focused Coping & Meaning-Making",
            scientificDefinitionTr: "Değiştirilemeyen veya kontrol dışı stresörler karşısında olumsuz duygusal sıkıntıyı yatıştırmak için bilişsel kabul, yeniden çerçeveleme ve içsel anlamlandırma yollarını kullanma stratejisi.",
            inclusionCriteria: ["Bilişsel kabul", "Olumlu yeniden çerçeveleme", "İçsel anlam bulma"],
            exclusionCriteria: ["Madde kullanımıyla uyuşma", "İnkar ve kaçınma"],
            adjacentConstructs: ["cognitive_reappraisal", "problem_focused_coping", "acceptance_mindfulness"],
            discriminantRisks: ["Uyumlu duygu odaklı başa çıkmayı (reappraisal) uyumsuz kaçınmadan (inkar) ayırmak"],
            referenceInstruments: ["COPE / Brief COPE (Positive Reframing & Acceptance Scales)"],
            primarySourceIds: ["src_carver_1989_cope"],
            secondarySourceIds: ["src_lazarus_folkman_1984"],
            turkishEvidenceSourceIds: ["src_agargun_2005_cope_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Değiştirilemeyecek durumları kabullenerek olumlu bir anlam çıkarma"],
              emotionalIndicators: ["Kabulleniş ve anlamlandırma sayesinde içsel sakinliğe ulaşma"],
              motivationalIndicators: ["Duygusal dengeyi koruyarak içsel huzuru sağlama arzusu"],
              interpersonalIndicators: ["Zorlukları olgunlukla ve anlayışla karşılama"],
              behavioralIndicatorsDetailed: [
                "Değiştiremeyeceği durumları kabullenir ve onlarla barışık yaşamayı öğrenir",
                "Olumsuz bir deneyimin ardındaki olumlu veya öğretici yanları bulmaya çalışır",
                "Stres anında duygularını yatıştırmak için yapıcı içsel konuşmalar yapar",
                "Zorlukları hayatın doğal bir parçası olarak görerek içsel dengesini korur"
              ]
            },
            relevantContexts: ["stress_decision", "everyday_life"],
            undesiredItemPatterns: ["Alkol veya maddeyle unuturum gibi uyumsuz/klinik kaçınmalar"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Kontrol edilemeyen stresörler karşısında uyumlu duygusal düzenleme ve kabulü ölçer."
          },
          items: [
            {
              itemId: "psi_cr_efc_01",
              promptTr: "Değiştiremeyeceğim zor durumlarla karşılaştığımda gerçeği kabullenir ve onunla barışmaya çalışırım.",
              promptEn: "When facing difficult situations I cannot change, I accept the reality and try to make peace with it.",
              behavioralIndicator: "Değiştirilemeyeni kabul etme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cr_efc_02",
              promptTr: "Elimden bir şey gelmeyen olaylar karşısında kendimi sürekli yer bitirir, bir türlü kabullenemem.",
              promptEn: "In the face of events where nothing can be done, I constantly torment myself and can never accept it.",
              behavioralIndicator: "Kabullenememe ve kendini yıpratma (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_cr_efc_03",
              promptTr: "Başıma gelen kötü olaylarda bile bana kattığı olgunluğu veya öğretici tarafı görmeye gayret ederim.",
              promptEn: "Even in bad events that happen to me, I strive to see the maturity or instructive aspect it brings to me.",
              behavioralIndicator: "Olumlu yeniden çerçeveleme ve olgunluk",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cr_efc_04",
              promptTr: "Stresli dönemlerde duygularımı yatıştırmak ve iç huzurumu korumak için kendime yapıcı telkinlerde bulunurum.",
              promptEn: "During stressful periods, I give myself constructive self-talk to soothe my emotions and protect inner peace.",
              behavioralIndicator: "Yapıcı içsel telkin ve yatışma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cr_efc_05",
              promptTr: "Bir hayal kırıklığı yaşadığımda hiçbir şeyde olumlu bir anlam bulamaz, tamamen karamsarlığa gömülürüm.",
              promptEn: "When experiencing a disappointment, I cannot find positive meaning in anything and sink completely into pessimism.",
              behavioralIndicator: "Anlam bulamama ve karamsarlık (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            }
          ]
        }
      ]
    }
  ]
};

module.exports = DOMAIN_9_DATA;
