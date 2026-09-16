/**
 * DOMAIN 10: CREATIVITY, CURIOSITY & INTELLECTUAL OPENNESS — 2 CONSTRUCTS, 4 FACETS (20 ITEMS)
 * Complete blueprints and original items.
 */

const DOMAIN_10_DATA = {
  domainId: "creativity_curiosity",
  domainNameTr: "Yaratıcılık, Merak ve Entelektüel Açıklık",
  domainNameEn: "Creativity, Curiosity & Intellectual Openness",
  constructs: [
    // 1. Epistemic Curiosity Dimensions
    {
      constructId: "epistemic_curiosity",
      facets: [
        {
          blueprint: {
            domainId: "creativity_curiosity",
            constructId: "epistemic_curiosity",
            facetId: "joyous_exploration_curiosity",
            nameTr: "Neşeli Keşif Merakı (Joyous Exploration)",
            nameEn: "Joyous Exploration Curiosity",
            scientificDefinitionTr: "Dünyanın karmaşıklığını, yeniliklerini ve bilinmeyenlerini öğrenmekten, keşfetmekten ve deneyimlemekten duyulan içsel neşe, zevk ve heves.",
            inclusionCriteria: ["Öğrenmekten keyif alma", "Yeni konuları hevesle araştırma", "Keşif zevki"],
            exclusionCriteria: ["Zorunlu ders çalışma", "Yüzeysel dedikodu merakı"],
            adjacentConstructs: ["deprivation_sensitivity_curiosity", "intellectual_curiosity", "inquisitiveness"],
            discriminantRisks: ["Neşeli keşif merakını (I-type curiosity) bilgi eksikliğinden kaynaklanan gerginlikten (D-type) ayırmak"],
            referenceInstruments: ["Five-Dimensional Curiosity Scale (5DCR - Joyous Exploration Dimension)"],
            primarySourceIds: ["src_kashdan_2018_5dc"],
            secondarySourceIds: ["src_berlyne_1960_curiosity"],
            turkishEvidenceSourceIds: ["src_demirtas_madran_2020_5dc_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Evrende öğrenilecek sınırsız ilginç şey olduğunu düşünme"],
              emotionalIndicators: ["Yeni bir konu öğrendiğinde duyulan coşku ve heyecan"],
              motivationalIndicators: ["Salt bilme ve anlama zevki için araştırma yapma"],
              interpersonalIndicators: ["Öğrendiği ilginç bilgileri heyecanla başkalarıyla paylaşma"],
              behavioralIndicatorsDetailed: [
                "Yeni ve bilmediği konular hakkında bir şeyler okumaktan ve izlemekten büyük keyif alır",
                "Dünyanın nasıl işlediğine dair yeni bilgiler keşfetmek onu derinden heyecanlandırır",
                "Hiçbir zorunluluk olmasa bile sırf merakını gidermek için araştırmalar yapar",
                "Farklı kültürler, fikirler ve olgular hakkında öğrenmeye karşı doyumsuz bir heves taşır"
              ]
            },
            relevantContexts: ["everyday_life", "work_task", "reflection"],
            undesiredItemPatterns: ["Başkalarının özel hayatını merak ederim gibi dedikodu ifadeleri"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Merak kuramında olumlu duygulanım kaynaklı içsel keşif arzusunu ölçer."
          },
          items: [
            {
              itemId: "psi_cc_jex_01",
              promptTr: "Yeni ve ilginç konular hakkında bir şeyler okumak, öğrenmek ve keşfetmek bana büyük bir zevk verir.",
              promptEn: "Reading, learning, and discovering about new and fascinating topics gives me immense pleasure.",
              behavioralIndicator: "Yeni konuları öğrenmekten büyük zevk alma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cc_jex_02",
              promptTr: "İşim veya günlük hayatım için doğrudan gerekli olmayan konuları öğrenmeye vakit harcamak bana sıkıcı gelir.",
              promptEn: "Spending time learning topics not directly necessary for my work or daily life feels boring to me.",
              behavioralIndicator: "Zorunlu olmayan öğrenmeye ilgisizlik (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_cc_jex_03",
              promptTr: "Dünyanın işleyişi ve farklı alanlar hakkında yeni bilgiler öğrendiğimde içimde taze bir heyecan hissederim.",
              promptEn: "When I learn new information about how the world works and diverse fields, I feel fresh excitement inside.",
              behavioralIndicator: "Bilgi keşfinden duyulan içsel heyecan",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cc_jex_04",
              promptTr: "Hiç bilmediğim alanlara dair belgeseller izlemek, kitaplar karıştırmak veya makaleler okumak beni büyüler.",
              promptEn: "Watching documentaries, browsing books, or reading articles on entirely unfamiliar fields fascinates me.",
              behavioralIndicator: "Bilinmeyen alanları büyüleyici bulma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cc_jex_05",
              promptTr: "Yeni bir fikir veya bilgiyle karşılaştığımda bunu detaylıca araştırmak için içimde pek bir merak uyanmaz.",
              promptEn: "When encountering a new idea or piece of information, not much curiosity awakens inside me to explore it thoroughly.",
              behavioralIndicator: "Yeni fikirlere karşı merak duymama (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            }
          ]
        },
        {
          blueprint: {
            domainId: "creativity_curiosity",
            constructId: "epistemic_curiosity",
            facetId: "deprivation_sensitivity_curiosity",
            nameTr: "Yoksunluk Duyarlılığı Merakı (Deprivation Sensitivity)",
            nameEn: "Deprivation Sensitivity Curiosity",
            scientificDefinitionTr: "Zihindeki bir bilgi boşluğu, çözülmemiş bir problem veya eksik bir parça karşısında bilişsel gerginlik/rahatsızlık duyarak o boşluğu doldurana kadar araştırmayı bırakmama eğilimi.",
            inclusionCriteria: ["Bilgi boşluğuna tahammülsüzlük", "Bulmaca çözme azmi", "Cevabı bulana kadar odaklanma"],
            exclusionCriteria: ["Obsesif kompulsif takıntı", "Kayıp eşya arama kaygısı"],
            adjacentConstructs: ["joyous_exploration_curiosity", "intellectual_curiosity", "perseverance_grit"],
            discriminantRisks: ["Epistemik yoksunluk duyarlılığını klinik obsesyondan ayırmak"],
            referenceInstruments: ["Five-Dimensional Curiosity Scale (5DCR - Deprivation Sensitivity Dimension)"],
            primarySourceIds: ["src_kashdan_2018_5dc"],
            secondarySourceIds: ["src_berlyne_1960_curiosity"],
            turkishEvidenceSourceIds: ["src_demirtas_madran_2020_5dc_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Zihnindeki bir soru cevapsız kaldığında bunu zihinsel bir boşluk olarak görme"],
              emotionalIndicators: ["Cevabı bulamadığında rahatsızlık, cevabı bulunca derin bir rahatlama hissetme"],
              motivationalIndicators: ["Cevabı bulana dek araştırmayı bırakmama dürtüsü"],
              interpersonalIndicators: ["Zorlayıcı soruları ve problemleri başkalarıyla tartışarak çözmeye çalışma"],
              behavioralIndicatorsDetailed: [
                "Aklına takılan bir sorunun cevabını bulana kadar rahat edemez ve araştırmayı sürdürür",
                "Karmaşık bir problemin çözümünü bulamadığında zihinsel bir huzursuzluk yaşar",
                "Eksik bir bilgi parçasını tamamlamak için derinlemesine inceleme yapar",
                "Bir gizemi veya mantık bilmecesini çözmeden bırakmaktan hoşlanmaz"
              ]
            },
            relevantContexts: ["work_task", "everyday_life", "stress_decision"],
            undesiredItemPatterns: ["Klinik obsesif kontrol ritüelleri"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Merak kuramında bilgi boşluğunu kapatmaya odaklı (D-type) zihinsel dürtüyü ölçer."
          },
          items: [
            {
              itemId: "psi_cc_dep_01",
              promptTr: "Aklıma takılan bir sorunun cevabını tam olarak öğrenene kadar içim rahat etmez ve araştırmaya devam ederim.",
              promptEn: "Until I learn the exact answer to a question stuck in my mind, I cannot rest and keep researching.",
              behavioralIndicator: "Cevabı bulana kadar rahat edememe",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cc_dep_02",
              promptTr: "Bir konuyu tam anlamadığımda veya bir boşluk kaldığında bunu dert etmez, kolayca geçiştiririm.",
              promptEn: "When I do not fully understand a topic or there is a gap, I do not mind and let it go easily.",
              behavioralIndicator: "Bilgi boşluğunu önemsememe (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_cc_dep_03",
              promptTr: "Karmaşık bir bulmaca veya çözülememiş bir problemle karşılaştığımda doğru sonuca ulaşana kadar bırakmak istemem.",
              promptEn: "When faced with a complex puzzle or an unsolved problem, I do not want to quit until reaching the correct solution.",
              behavioralIndicator: "Çözüme ulaşana kadar azimle devam etme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cc_dep_04",
              promptTr: "Bir bilginin neden veya nasıl öyle olduğunu çözemediğimde bunu zihnimde sürekli evirip çevirir, anlamaya uğraşırım.",
              promptEn: "When I cannot figure out why or how a piece of information is true, I turn it over in my mind until I grasp it.",
              behavioralIndicator: "Neden ve nasılını çözme çabası",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cc_dep_05",
              promptTr: "Bir mantık hatası veya eksik bilgi gördüğümde doğrusunu araştırmak için vakit harcamak istemem.",
              promptEn: "When I see a logical error or missing information, I do not want to spend time searching for the correct one.",
              behavioralIndicator: "Eksik bilgiyi araştırmaktan kaçınma (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            }
          ]
        }
      ]
    },

    // 2. Creative Self-Belief & Mindset
    {
      constructId: "creative_growth_mindset",
      facets: [
        {
          blueprint: {
            domainId: "creativity_curiosity",
            constructId: "creative_growth_mindset",
            facetId: "creative_self_efficacy",
            nameTr: "Yaratıcı Öz-Yeterlik",
            nameEn: "Creative Self-Efficacy",
            scientificDefinitionTr: "Bireyin özgün fikirler üretebileceğine, yaratıcı çözümler geliştirebileceğine ve yaratıcılık gerektiren görevleri başarıyla tamamlayabileceğine olan inancı.",
            inclusionCriteria: ["Özgün fikir üretebilme inancı", "Yaratıcı problem çözme güveni", "İnovatif yaklaşım"],
            exclusionCriteria: ["Büyüklenmeci narsisizm", "Gereksiz sıra dışılık"],
            adjacentConstructs: ["creativity_openness", "self_efficacy_general", "growth_mindset_intelligence"],
            discriminantRisks: ["Yaratıcı öz-yeterliği genel akademik öz-yeterlikten ayırmak"],
            referenceInstruments: ["Short Scale of Creative Self (SSCS - Karwowski)", "Creative Self-Efficacy Scale (Tierney & Farmer)"],
            primarySourceIds: ["src_tierney_farmer_2002_cse"],
            secondarySourceIds: ["src_karwowski_2013_sscs"],
            turkishEvidenceSourceIds: ["src_demirtas_madran_2020_5dc_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Kalıpların dışında düşünme kapasitesine sahip olduğuna inanma"],
              emotionalIndicators: ["Yaratıcı bir görevle karşılaştığında duyulan özgüven ve heyecan"],
              motivationalIndicators: ["Alışılmışın dışında özgün çözümler deneme isteği"],
              interpersonalIndicators: ["Grup içinde yaratıcı fikirler ve alternatifler sunma"],
              behavioralIndicatorsDetailed: [
                "Zorlayıcı durumlarda kimsenin aklına gelmeyen özgün çözümler üretebileceğine güvenir",
                "Kendisini yaratıcı, yenilikçi ve sıra dışı düşünebilen biri olarak görür",
                "Yaratıcılık gerektiren projelere ve görevlere güvenle liderlik edebilir",
                "Alışılagelmiş yöntemler tıkandığında yeni yollar icat etmekten çekinmez"
              ]
            },
            relevantContexts: ["work_task", "everyday_life", "planning"],
            undesiredItemPatterns: ["Ben bir dâhiyim gibi büyüklenmeci ifadeler"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Bireyin yaratıcı potansiyeline ve inovatif üretim kapasitesine olan inancını ölçer."
          },
          items: [
            {
              itemId: "psi_cc_cse_01",
              promptTr: "Karşılaştığım problemlere başkalarının aklına gelmeyen özgün ve yaratıcı çözümler bulabileceğime güvenirim.",
              promptEn: "I trust that I can come up with novel and creative solutions to problems that others may not think of.",
              behavioralIndicator: "Özgün ve yaratıcı çözüm üretebilme güveni",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cc_cse_02",
              promptTr: "Kendimi yaratıcı biri olarak görmem; genellikle bilinen ve denenmiş yöntemleri aynen uygulamayı tercih ederim.",
              promptEn: "I do not see myself as creative; I usually prefer just applying known and tested methods directly.",
              behavioralIndicator: "Düşük yaratıcı özgüven ve kalıplara bağlılık (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_cc_cse_03",
              promptTr: "Yaratıcılık ve hayal gücü gerektiren bir görev verildiğinde bunu başarıyla yapabileceğimi bilirim.",
              promptEn: "When given a task requiring creativity and imagination, I know I can accomplish it successfully.",
              behavioralIndicator: "Yaratıcı görevlerde başarı inancı",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cc_cse_04",
              promptTr: "Yeni bir proje tasarlarken veya bir fikri geliştirirken sıra dışı ve taze fikirler üretebilirim.",
              promptEn: "When designing a new project or developing an idea, I can generate unconventional and fresh ideas.",
              behavioralIndicator: "Sıra dışı ve taze fikir üretme yeteneği",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cc_cse_05",
              promptTr: "Benden orijinal bir fikir istendiğinde genellikle tıkanır, hiçbir yeni fikir geliştiremem.",
              promptEn: "When asked for an original idea, I usually get blocked and cannot develop any new idea.",
              behavioralIndicator: "Orijinal fikir üretiminde tıkanma (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            }
          ]
        },
        {
          blueprint: {
            domainId: "creativity_curiosity",
            constructId: "creative_growth_mindset",
            facetId: "growth_mindset_intelligence",
            nameTr: "Gelişim Zihniyeti (Growth Mindset)",
            nameEn: "Growth Mindset Intelligence",
            scientificDefinitionTr: "Zekanın, yeteneklerin ve yaratıcılığın sabit olmayıp; çaba, doğru stratejiler, öğrenme ve geri bildirimler yoluyla sürekli geliştirilebileceğine olan inanç.",
            inclusionCriteria: ["Yeteneklerin çabayla gelişeceğine inanç", "Hataları öğrenme aracı görme", "Zorluklara meydan okuma"],
            exclusionCriteria: ["Sabit zeka inancı", "Kadercilik"],
            adjacentConstructs: ["creative_self_efficacy", "ego_resilience", "perseverance_grit"],
            discriminantRisks: ["Gelişim zihniyetini (growth mindset) sabit zihniyetten (fixed mindset) net çizgilerle ayırmak"],
            referenceInstruments: ["Implicit Theories of Intelligence Scale (Dweck Mindset Scale)"],
            primarySourceIds: ["src_dweck_2006_mindset"],
            secondarySourceIds: ["src_tierney_farmer_2002_cse"],
            turkishEvidenceSourceIds: ["src_demirtas_madran_2020_5dc_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Beynin ve yeteneklerin pratikle güçleneceğini düşünme"],
              emotionalIndicators: ["Zorluklar ve başarısızlıklar karşısında yılgınlık yerine öğrenme heyecanı"],
              motivationalIndicators: ["Kendini zorlayan görevleri seçme ve çaba gösterme arzusu"],
              interpersonalIndicators: ["Geri bildirimleri kişisel saldırı değil gelişim fırsatı olarak görme"],
              behavioralIndicatorsDetailed: [
                "Yeterince emek verildiğinde herkesin zihinsel yeteneklerini önemli ölçüde geliştirebileceğine inanır",
                "Hataları bir yetersizlik göstergesi değil, gelişimin doğal bir adımı olarak görür",
                "Zorlayıcı görevleri yeteneklerini esnetmek ve büyütmek için bir fırsat kabul eder",
                "Zekanın doğuştan gelen sabit bir sınır olmadığını düşünür"
              ]
            },
            relevantContexts: ["work_task", "everyday_life", "stress_decision"],
            undesiredItemPatterns: ["Herkes dahi olabilir gibi bilim dışı abartılar"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Dweck'in zihin yapısı kuramındaki gelişim zihniyetini (growth vs. fixed mindset) ölçer."
          },
          items: [
            {
              itemId: "psi_cc_gmw_01",
              promptTr: "Yeterince çaba gösterir, doğru stratejiler kullanır ve pratik yaparsam zihinsel yeteneklerimi ve becerilerimi büyük ölçüde geliştirebilirim.",
              promptEn: "If I put in enough effort, use right strategies, and practice, I can substantially improve my intellectual capacities and skills.",
              behavioralIndicator: "Yeteneklerin çabayla geliştirilebileceğine inanç",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cc_gmw_02",
              promptTr: "İnsanların zekası ve temel yetenekleri doğuştan gelir ve ne kadar uğraşsalar da bunları pek değiştiremezler.",
              promptEn: "People's intelligence and fundamental talents are innate and no matter how hard they try, they cannot change them much.",
              behavioralIndicator: "Sabit zihniyet ve yeteneklerin değişmeyeceğine inanç (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_cc_gmw_03",
              promptTr: "Zor ve beni zorlayan görevlerle uğraşmaktan hoşlanırım çünkü bu sayede sınırlarımı genişletip yeni şeyler öğrenirim.",
              promptEn: "I enjoy tackling hard and demanding tasks because doing so expands my limits and teaches me new things.",
              behavioralIndicator: "Zorlayıcı görevleri gelişim fırsatı görme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cc_gmw_04",
              promptTr: "Bir konuda hata yaptığımda bunu bir başarısızlık değil, nerede gelişmem gerektiğini gösteren değerli bir ders sayarım.",
              promptEn: "When I make a mistake, I consider it not a failure but a valuable lesson showing where I need to improve.",
              behavioralIndicator: "Hataları değerli öğrenme dersi sayma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_cc_gmw_05",
              promptTr: "Bir alanda doğuştan yeteneğim yoksa sonradan çalışarak o konuda başarılı olmanın imkansız olduğuna inanırım.",
              promptEn: "If I have no innate talent in a field, I believe it is impossible to become successful in it through later practice.",
              behavioralIndicator: "Doğuştan yetenek ön şartı inancı (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            }
          ]
        }
      ]
    }
  ]
};

module.exports = DOMAIN_10_DATA;
