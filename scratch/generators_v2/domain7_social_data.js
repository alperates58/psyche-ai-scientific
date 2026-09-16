/**
 * DOMAIN 7: SOCIAL & RELATIONAL DYNAMICS — 2 CONSTRUCTS, 9 FACETS (45 ITEMS)
 * Complete blueprints and original items.
 */

const DOMAIN_7_DATA = {
  domainId: "social_relational",
  domainNameTr: "Sosyal ve İlişkisel Dinamikler",
  domainNameEn: "Social & Relational Dynamics",
  constructs: [
    // 1. Adult Attachment Dimensions
    {
      constructId: "adult_attachment",
      facets: [
        {
          blueprint: {
            domainId: "social_relational",
            constructId: "adult_attachment",
            facetId: "attachment_anxiety",
            nameTr: "Bağlanma Kaygısı",
            nameEn: "Attachment Anxiety",
            scientificDefinitionTr: "Yakın ilişkilerde partnerinin/yakınlarının sevgisini, ilgisini veya bağlılığını kaybetme korkusu; reddedilme ve terk edilme ihtimaline karşı aşırı zihinsel meşguliyet ve tetikte olma eğilimi.",
            inclusionCriteria: ["Terk edilme korkusu", "Sürekli ilgi ve onay ihtiyacı", "İlişkisel aşırı duyarlılık"],
            exclusionCriteria: ["Genel sosyal fobi", "Klinik obsesyon"],
            adjacentConstructs: ["rejection_sensitivity_nonclinical", "dependence", "anxiety"],
            discriminantRisks: ["Yakın ilişki kaygısını genel yaygın kaygıdan ayırmak"],
            referenceInstruments: ["Experiences in Close Relationships-Revised (ECR-R Anxiety Dimension)"],
            primarySourceIds: ["src_fraley_2000_ecrr", "src_brennan_1998_ecr"],
            secondarySourceIds: ["src_lee_ashton_2004"],
            turkishEvidenceSourceIds: ["src_sumer_2001_attachment_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Partnerinin ilgisizliğini sevgisizlik olarak yorumlama", "Terk edilme senaryoları kurma"],
              emotionalIndicators: ["İletişim geciktiğinde panik ve yoğun huzursuzluk hissetme"],
              motivationalIndicators: ["Sürekli güvence ve onay alma arayışı"],
              interpersonalIndicators: ["İlişkide yapışkan veya aşırı talepkar tepkiler verme"],
              behavioralIndicatorsDetailed: [
                "Sevdiği insanların kendisinden uzaklaşacağı korkusunu sık sık yaşar",
                "İlişkilerinde karşı tarafın ona verdiği değerden tam olarak emin olmakta zorlanır",
                "Yakınlarının mesajlarına geç dönmesi durumunda sevilmediğini veya istenmediğini düşünebilir",
                "İlişkide sürekli onay ve sevgi güvencesi arama ihtiyacı hisseder"
              ]
            },
            relevantContexts: ["relationships", "stress_decision"],
            undesiredItemPatterns: ["Klinik BPD (borderline) semptomları ve kendine zarar verme ifadeleri"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "LOW_SUBCLINICAL",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Yetişkin bağlanma kuramındaki temel kaygı boyutunu ölçer."
          },
          items: [
            {
              itemId: "psi_sr_anx_01",
              promptTr: "Yakın ilişkilerimde karşımdaki insanın bana duyduğu sevgi ve ilgiyi kaybedebileceğim korkusunu sık sık yaşarım.",
              promptEn: "In my close relationships, I often fear that I might lose the other person's love and affection.",
              behavioralIndicator: "Sevgi ve ilgiyi kaybetme endişesi",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_anx_02",
              promptTr: "Değer verdiğim insanların bana olan bağlılığı konusunda içim oldukça rahattır ve sürekli bir onay aramam.",
              promptEn: "I feel quite at ease regarding the commitment of people I value and do not seek constant reassurance.",
              behavioralIndicator: "İlişkisel güvende hissetme (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_sr_anx_03",
              promptTr: "Yakın bir arkadaşım veya partnerim bana biraz mesafeli davrandığında, bir hata yaptığımı düşünüp telaşlanırım.",
              promptEn: "When a close friend or partner acts a bit distant, I panic thinking I must have done something wrong.",
              behavioralIndicator: "Mesafe karşısında aşırı kaygı ve telaş",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_anx_04",
              promptTr: "İlişkilerimde karşımdaki insanın beni terk edebileceği veya benden soğuyabileceği düşüncesi aklımı kurcalar.",
              promptEn: "In relationships, the thought that the other person might leave me or lose interest constantly occupies my mind.",
              behavioralIndicator: "Terk edilme düşünceleriyle zihinsel meşguliyet",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_anx_05",
              promptTr: "Birlikte olduğum veya değer verdiğim insanların beni olduğum gibi benimsediğine güvenir, reddedilme endişesi taşımam.",
              promptEn: "I trust that people I am with or care about accept me as I am, without worrying about being rejected.",
              behavioralIndicator: "Kabul görme güveni ve düşük kaygı (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            }
          ]
        },
        {
          blueprint: {
            domainId: "social_relational",
            constructId: "adult_attachment",
            facetId: "attachment_avoidance",
            nameTr: "Bağlanma Kaçınması",
            nameEn: "Attachment Avoidance",
            scientificDefinitionTr: "Duygusal yakınlıktan, bağımlılıktan ve kırılganlığını açmaktan rahatsızlık duyma; aşırı bağımsızlık savunması ve ilişkilerde duygusal mesafe koyma eğilimi.",
            inclusionCriteria: ["Duygusal mesafeyi koruma", "Kırılganlığı açmaktan kaçınma", "Aşırı özerklik savunması"],
            exclusionCriteria: ["İçe dönüklük", "Şizoid kopukluk"],
            adjacentConstructs: ["social_boldness", "sociability", "autonomy_need_satisfaction"],
            discriminantRisks: ["Sağlıklı özerkliği kaçıngan duygusal duvardan ayırmak"],
            referenceInstruments: ["Experiences in Close Relationships-Revised (ECR-R Avoidance Dimension)"],
            primarySourceIds: ["src_fraley_2000_ecrr", "src_brennan_1998_ecr"],
            secondarySourceIds: ["src_lee_ashton_2004"],
            turkishEvidenceSourceIds: ["src_sumer_2001_attachment_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["İnsanlara aşırı bağlanmanın zayıflık getireceğini düşünme"],
              emotionalIndicators: ["Aşırı duygusal yakınlık veya bağımlılık karşısında boğulmuşluk hissi"],
              motivationalIndicators: ["Tamamen kendi kendine yetme ve duygusal duvar örme motivasyonu"],
              interpersonalIndicators: ["İç dünyasını açmaktan kaçınma ve mesafeli durma"],
              behavioralIndicatorsDetailed: [
                "İnsanlarla aşırı samimi ve duygusal olarak bağımlı ilişkiler kurmaktan kaçınır",
                "Sorunlarını veya içsel kırılganlıklarını başkalarına açmak yerine kendi içine gömer",
                "Karşı taraf fazla yakınlaşmak istediğinde geri çekilme ve mesafe koyma ihtiyacı duyar",
                "Kendi kendine yetmeyi her şeyin üstünde tutarak kimseden yardım istememeye çalışır"
              ]
            },
            relevantContexts: ["relationships", "social_settings"],
            undesiredItemPatterns: ["İnsanlardan nefret ederim gibi mizantropik ifadeler"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Yetişkin bağlanma kuramındaki temel kaçınma boyutunu ölçer."
          },
          items: [
            {
              itemId: "psi_sr_avd_01",
              promptTr: "İnsanların bana duygusal olarak çok fazla yaklaşmasından veya bana bağımlı hale gelmesinden rahatsız olurum.",
              promptEn: "I feel uncomfortable when people get too close to me emotionally or become dependent on me.",
              behavioralIndicator: "Aşırı yakınlıktan rahatsız olma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_avd_02",
              promptTr: "En derin duygularımı ve kırılganlıklarımı güvendiğim insanlarla rahatça paylaşabilirim.",
              promptEn: "I can comfortably share my deepest feelings and vulnerabilities with people I trust.",
              behavioralIndicator: "Duygusal yakınlığa ve kendini açmaya açıklık (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_sr_avd_03",
              promptTr: "Zor bir durumla karşılaştığımda başkalarından destek istemek yerine her şeyi tamamen kendi başıma çözmeyi tercih ederim.",
              promptEn: "When facing a difficult situation, I prefer to handle everything entirely on my own rather than asking others for support.",
              behavioralIndicator: "Duygusal mesafe ve aşırı kendine yetme savunması",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_avd_04",
              promptTr: "İlişkilerimde karşı tarafın benden çok fazla duygusal beklentiye girmesi bende geri çekilme isteği uyandırır.",
              promptEn: "When someone in a relationship has too many emotional expectations of me, it makes me want to withdraw.",
              behavioralIndicator: "Beklentiler karşısında geri çekilme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_avd_05",
              promptTr: "İnsanlara güvenip onlara sırtımı dayamak ve hayatımı onlarla paylaşmak benim için doğaldır.",
              promptEn: "Trusting people, leaning on them, and sharing my life with them feels natural to me.",
              behavioralIndicator: "Yakın ilişkilere güven ve bağımlılık rahatlığı (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            }
          ]
        }
      ]
    },

    // 2. Interpersonal Competence & Social Functioning
    {
      constructId: "interpersonal_competence",
      facets: [
        {
          blueprint: {
            domainId: "social_relational",
            constructId: "interpersonal_competence",
            facetId: "cognitive_perspective_taking",
            nameTr: "Bilişsel Perspektif Alma",
            nameEn: "Cognitive Perspective Taking",
            scientificDefinitionTr: "Başkalarının olaylara bakış açısını, düşüncelerini ve zihinsel durumlarını kendi bakış açısından bağımsız olarak anlayabilme ve zihninde canlandırabilme kapasitesi.",
            inclusionCriteria: ["Başkalarının bakış açısını anlama", "Zihinselleştirme", "Çok yönlü bakabilme"],
            exclusionCriteria: ["Duygusal empati", "Kendi fikrinden hemen vazgeçme"],
            adjacentConstructs: ["empathic_concern", "intellectual_curiosity", "sentimentality"],
            discriminantRisks: ["Bilişsel perspektif almayı affektif empatiden ayırmak"],
            referenceInstruments: ["Interpersonal Reactivity Index (IRI - Perspective Taking Scale)"],
            primarySourceIds: ["src_davis_1983_iri"],
            secondarySourceIds: ["src_lee_ashton_2004"],
            turkishEvidenceSourceIds: ["src_derlega_1993_self_disclosure"],
            behavioralIndicators: {
              cognitiveIndicators: ["Bir tartışmada karşı tarafın neden öyle düşündüğünü analiz etme"],
              emotionalIndicators: ["Olayları tarafsızca değerlendirebilmenin getirdiği sükunet"],
              motivationalIndicators: ["Olaylara farklı açılardan bakma motivasyonu"],
              interpersonalIndicators: ["Karşı tarafı yargılamadan önce onun şartlarını düşünme"],
              behavioralIndicatorsDetailed: [
                "Bir anlaşmazlıkta karşı tarafın haklı olabileceği noktaları zihninde tartar",
                "Birini eleştirmeden önce kendisini onun yerine koyarak durumu anlamaya çalışır",
                "Olaylara sadece kendi penceresinden değil başkalarının gözünden de bakabilir",
                "İnsanların farklı arka plan ve deneyimlere sahip olduklarını hesaba katarak davranır"
              ]
            },
            relevantContexts: ["relationships", "work_task", "social_settings"],
            undesiredItemPatterns: ["Aşırı duygusal acı çekme ifadeleri"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Bilişsel empati ve zihin kuramı kapasitesini ölçer."
          },
          items: [
            {
              itemId: "psi_sr_cpt_01",
              promptTr: "Birisiyle farklı düşündüğümde, onun olaylara neden o açıdan baktığını anlamaya çalışırım.",
              promptEn: "When I disagree with someone, I try to understand why they see things from that perspective.",
              behavioralIndicator: "Farklı bakış açılarını anlama çabası",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_cpt_02",
              promptTr: "Olayları değerlendirirken genellikle sadece kendi haklılığıma odaklanır, başkalarının ne düşündüğünü pek önemsemem.",
              promptEn: "When evaluating situations, I usually focus only on my own correctness and care little about what others think.",
              behavioralIndicator: "Tek yönlü bakış ve perspektif almama (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_sr_cpt_03",
              promptTr: "Bir karar vermeden önce o kararın etkileyeceği diğer insanların durumunu onların gözünden değerlendiririm.",
              promptEn: "Before making a decision, I assess the situation of other affected people through their eyes.",
              behavioralIndicator: "Kararlarda başkalarının bakış açısını gözetme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_cpt_04",
              promptTr: "Birinin neden öyle davrandığını anlamak için kendimi onun şartlarında hayal etmeye gayret ederim.",
              promptEn: "To understand why someone acted that way, I strive to imagine myself in their circumstances.",
              behavioralIndicator: "Kendini başkasının yerine koyma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_cpt_05",
              promptTr: "Başkalarının hangi motivasyonla hareket ettiğini anlamaya çalışmak bana gereksiz ve yorucu gelir.",
              promptEn: "Trying to understand what motivates others feels unnecessary and exhausting to me.",
              behavioralIndicator: "Başkalarının zihinsel durumunu anlamaya ilgisizlik (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            }
          ]
        },
        {
          blueprint: {
            domainId: "social_relational",
            constructId: "interpersonal_competence",
            facetId: "empathic_concern",
            nameTr: "Empatik İlgi ve Şefkat",
            nameEn: "Empathic Concern",
            scientificDefinitionTr: "Zor durumda veya acı çeken bireylere karşı sıcaklık, şefkat, merhamet ve yardım etme arzusu hissetme eğilimi.",
            inclusionCriteria: ["Başkalarının acısına şefkat", "Merhamet hissi", "Yardım etme isteği"],
            exclusionCriteria: ["Duygusal tükenmişlik", "Kişisel sıkıntıya kapılma"],
            adjacentConstructs: ["cognitive_perspective_taking", "sentimentality", "forgiveness"],
            discriminantRisks: ["Empatik ilgiyi salt duygusal hassasiyetten ayırmak"],
            referenceInstruments: ["Interpersonal Reactivity Index (IRI - Empathic Concern Scale)"],
            primarySourceIds: ["src_davis_1983_iri"],
            secondarySourceIds: ["src_lee_ashton_2004"],
            turkishEvidenceSourceIds: ["src_derlega_1993_self_disclosure"],
            behavioralIndicators: {
              cognitiveIndicators: ["Zor durumdaki insanların şefkati hak ettiğini düşünme"],
              emotionalIndicators: ["Başkalarının sıkıntısını gördüğünde içten bir üzüntü ve şefkat duyma"],
              motivationalIndicators: ["Zor durumdakilere destek olma arzusu"],
              interpersonalIndicators: ["Sıkıntılı anlarda teselli edici ve yardımsever davranma"],
              behavioralIndicatorsDetailed: [
                "Zor durumda veya mağdur olan birini gördüğünde derin bir merhamet hisseder",
                "Başkalarının yaşadığı sıkıntıları görmezden gelemez, elinden geldiğince yardım etmek ister",
                "İnsanların üzüntülerini paylaştığında onlara karşı içten bir şefkat besler",
                "Haksızlığa veya acıya uğrayan insanlara karşı kayıtsız kalamaz"
              ]
            },
            relevantContexts: ["relationships", "social_settings", "everyday_life"],
            undesiredItemPatterns: ["Kendi kendine acıma veya depresif tükenmişlik"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Affektif empati, merhamet ve şefkat yönelimini ölçer."
          },
          items: [
            {
              itemId: "psi_sr_emp_01",
              promptTr: "Zor durumda olan veya haksızlığa uğrayan insanları gördüğümde içimde derin bir şefkat ve yardım etme arzusu uyanır.",
              promptEn: "When I see people in difficulty or facing injustice, a deep sense of compassion and desire to help arises in me.",
              behavioralIndicator: "Şefkat ve yardım etme arzusu",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_emp_02",
              promptTr: "Başkalarının dertleri ve yaşadıkları acılar beni pek fazla etkilemez, duygusal olarak mesafemi korurum.",
              promptEn: "Other people's troubles and pains do not affect me much; I keep my emotional distance.",
              behavioralIndicator: "Duygusal kayıtsızlık ve şefkatsizlik (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_sr_emp_03",
              promptTr: "Bir yakınıma veya tanımadığım birine bir kötülük geldiğinde onun acısını kalbimde hissederim.",
              promptEn: "When something bad happens to a loved one or even a stranger, I feel their pain in my heart.",
              behavioralIndicator: "Başkalarının acısına ortak olma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_emp_04",
              promptTr: "Kendi rahatımdan biraz ödün vererek de olsa sıkıntıdaki birine destek olmaya gönüllü olurum.",
              promptEn: "I am willing to support someone in distress, even if it means sacrificing some of my own comfort.",
              behavioralIndicator: "Zor durumdakilere fedakarca destek olma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_emp_05",
              promptTr: "İnsanların kendi hataları yüzünden başlarına gelen sıkıntılara pek acımam.",
              promptEn: "I do not feel much pity for people who get into trouble because of their own mistakes.",
              behavioralIndicator: "Katı yaklaşım ve düşük merhamet (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            }
          ]
        },
        {
          blueprint: {
            domainId: "social_relational",
            constructId: "interpersonal_competence",
            facetId: "assertiveness",
            nameTr: "Girişkenlik ve Kendini İfade Etme",
            nameEn: "Assertiveness",
            scientificDefinitionTr: "Başkalarının haklarına saygı gösterirken kendi haklarını, ihtiyaçlarını, fikirlerini ve sınırlarını net, dürüst ve kararlı bir şekilde ifade edebilme becerisi.",
            inclusionCriteria: ["Sınırlarını koyabilme", "Hayır diyebilme", "Hakkını savunabilme"],
            exclusionCriteria: ["Saldırganlık", "Kabalık", "Pasiflik"],
            adjacentConstructs: ["social_boldness", "conflict_avoidance", "authenticity"],
            discriminantRisks: ["Girişkenliği saldırganlıktan (agresyon) ve kavgacılıktan ayırmak"],
            referenceInstruments: ["Rathus Assertiveness Schedule", "Alberti & Emmons Assertiveness Inventory"],
            primarySourceIds: ["src_alberti_emmons_2017"],
            secondarySourceIds: ["src_goldberg_1999_ipip"],
            turkishEvidenceSourceIds: ["src_derlega_1993_self_disclosure"],
            behavioralIndicators: {
              cognitiveIndicators: ["Kendi haklarını ve sınırlarını savunmanın meşru olduğuna inanma"],
              emotionalIndicators: ["Hayır derken gereksiz suçluluk hissetmeme"],
              motivationalIndicators: ["Haklarını koruma ve net iletişim kurma isteği"],
              interpersonalIndicators: ["Haksız bir talep geldiğinde sakin ama kararlı bir şekilde reddetme"],
              behavioralIndicatorsDetailed: [
                "İstemediği bir şey talep edildiğinde çekinmeden 'hayır' diyebilir",
                "Hak ettiği bir durum engellendiğinde hakkını sakin ve net bir dille arar",
                "Fikirlerini bir toplulukta rahatça dile getirir ve arkasında durur",
                "Başkalarını kırmadan kendi kişisel sınırlarını çizebilir"
              ]
            },
            relevantContexts: ["work_task", "social_settings", "relationships"],
            undesiredItemPatterns: ["İnsanları ezer geçerim gibi saldırganlık ifadeleri"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Sağlıklı kişilerarası iletişim ve sınır koyma yetkinliğini ölçer."
          },
          items: [
            {
              itemId: "psi_sr_asr_01",
              promptTr: "Kendi haklarımı, isteklerimi ve sınırlarımı insanlara net ve açık bir dille ifade edebilirim.",
              promptEn: "I can express my rights, wishes, and boundaries to people in a clear and direct manner.",
              behavioralIndicator: "Hak ve sınırları açıkça ifade etme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_asr_02",
              promptTr: "İstemediğim bir şey istendiğinde 'hayır' demekte çok zorlanır, kırılmasınlar diye kabul ederim.",
              promptEn: "When asked for something I do not want, I find it very hard to say 'no' and accept just not to upset others.",
              behavioralIndicator: "Hayır diyememe ve boyun eğme (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_sr_asr_03",
              promptTr: "Haksızlığa uğradığımı düşündüğümde öfkelenmeden ama kararlı bir şekilde hakkımı ararım.",
              promptEn: "When I feel treated unfairly, I stand up for my rights firmly without losing my temper.",
              behavioralIndicator: "Kararlı ve sakin hak arama",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_asr_04",
              promptTr: "Bir toplantıda veya grupta genel görüşe katılmadığımda kendi düşüncemi cesurca dile getiririm.",
              promptEn: "In a meeting or group when I disagree with the prevailing view, I boldly voice my opinion.",
              behavioralIndicator: "Grup içinde fikirlerini cesaretle savunma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_asr_05",
              promptTr: "Biri bana haksızlık yaptığında sessiz kalıp içime atmayı tercih ederim.",
              promptEn: "When someone treats me unfairly, I prefer to stay silent and bottle it up.",
              behavioralIndicator: "Sessiz kalma ve hakkını savunamama (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            }
          ]
        },
        {
          blueprint: {
            domainId: "social_relational",
            constructId: "interpersonal_competence",
            facetId: "social_connectedness",
            nameTr: "Sosyal Bağlılık ve Aidiyet",
            nameEn: "Social Connectedness",
            scientificDefinitionTr: "Kendini bir sosyal çevreye, topluluğa veya insanlara ait hissetme; sosyal dünyayla anlamlı, güvenli ve destekleyici bağlar kurma duygusu.",
            inclusionCriteria: ["Aidiyet hissi", "Topluluğun parçası olma", "Sosyal bütünleşme"],
            exclusionCriteria: ["Yalnızlık korkusu", "Grup baskısına boyun eğme"],
            adjacentConstructs: ["relatedness_need_satisfaction", "sociability", "attachment_anxiety"],
            discriminantRisks: ["Sosyal bağlılığı yüzeysel popülerlikten ayırmak"],
            referenceInstruments: ["Social Connectedness Scale-Revised (SCS-R)"],
            primarySourceIds: ["src_lee_robbins_1995_scs"],
            secondarySourceIds: ["src_chen_2015_bpnsfs"],
            turkishEvidenceSourceIds: ["src_derlega_1993_self_disclosure"],
            behavioralIndicators: {
              cognitiveIndicators: ["Sosyal çevresine ait olduğunu ve kabul gördüğünü düşünme"],
              emotionalIndicators: ["İnsanlarla bir aradayken duyulan sıcaklık ve aidiyet huzuru"],
              motivationalIndicators: ["Toplumsal bağları güçlendirme isteği"],
              interpersonalIndicators: ["Gruplara kolayca kaynaşma ve kendini dışlanmış hissetmeme"],
              behavioralIndicatorsDetailed: [
                "Kendisini yaşadığı çevreye ve arkadaş gruplarına ait hisseder",
                "İnsanlarla kolayca bağ kurabilir ve kendisini bir bütünün parçası gibi görür",
                "Sosyal ortamlarda dışlanmış veya yabancılaşmış hissetmez",
                "Zor zamanlarında sığınabileceği ve güvenebileceği bir sosyal ağa sahiptir"
              ]
            },
            relevantContexts: ["social_settings", "relationships", "everyday_life"],
            undesiredItemPatterns: ["Klinik sosyal yabancılaşma ve anomi hezeyanları"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Bireyin sosyal dünyayla kurduğu aidiyet ve bütünleşme bağını ölçer."
          },
          items: [
            {
              itemId: "psi_sr_sct_01",
              promptTr: "Kendimi arkadaş çevreme, topluluğuma ve etrafımdaki insanlara gerçekten ait hissederim.",
              promptEn: "I feel that I truly belong to my circle of friends, my community, and the people around me.",
              behavioralIndicator: "Aidiyet ve gruba ait hissetme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_sct_02",
              promptTr: "Kalabalıklar içinde bile olsam kendimi genellikle dışlanmış, yabancı ve yalnız hissederim.",
              promptEn: "Even when in crowds, I often feel isolated, like an outsider, and lonely.",
              behavioralIndicator: "Sosyal yabancılaşma ve dışlanmışlık (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_sr_sct_03",
              promptTr: "İnsanlarla aramda sıcak, samimi ve güven veren bağlar olduğunu bilmek bana güç verir.",
              promptEn: "Knowing there are warm, sincere, and reassuring bonds between me and others gives me strength.",
              behavioralIndicator: "Güven veren bağlar ve sosyal güç",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_sct_04",
              promptTr: "Yeni bir sosyal ortama girdiğimde insanlarla ortak bir zemin bulup kolayca kaynaşabilirim.",
              promptEn: "When entering a new social environment, I can easily find common ground and fit in.",
              behavioralIndicator: "Sosyal ortamlara kolay kaynaşma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_sct_05",
              promptTr: "Etrafımdaki dünyayla ve insanlarla gerçek bir bağım yokmuş gibi kopuk hissederim.",
              promptEn: "I feel disconnected, as if I have no real bond with the world around me and other people.",
              behavioralIndicator: "Sosyal kopukluk ve köksüzlük hissi (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            }
          ]
        },
        {
          blueprint: {
            domainId: "social_relational",
            constructId: "interpersonal_competence",
            facetId: "rejection_sensitivity_nonclinical",
            nameTr: "Reddedilme Hassasiyeti (Subklinik)",
            nameEn: "Rejection Sensitivity (Nonclinical)",
            scientificDefinitionTr: "Kişilerarası etkileşimlerde başkaları tarafından reddedilme, eleştirilme veya dışlanma olasılığını kaygıyla bekleme ve nötr davranışları bile reddedilme olarak yorumlama eğilimi.",
            inclusionCriteria: ["Reddedilme beklentisi", "Nötr ipuçlarını negatif yorumlama", "Sosyal onay hassasiyeti"],
            exclusionCriteria: ["Paranoid sanrılar", "Klinik sosyal anksiyete"],
            adjacentConstructs: ["attachment_anxiety", "social_boldness", "fearfulness"],
            discriminantRisks: ["Subklinik reddedilme hassasiyetini paranoid hezeyandan ayırmak"],
            referenceInstruments: ["Rejection Sensitivity Questionnaire (RSQ - Adult/Nonclinical)"],
            primarySourceIds: ["src_downey_feldman_1996_rsq"],
            secondarySourceIds: ["src_fraley_2000_ecrr"],
            turkishEvidenceSourceIds: ["src_derlega_1993_self_disclosure"],
            behavioralIndicators: {
              cognitiveIndicators: ["İnsanların küçük bir hareketini veya bakışını soğukluk olarak algılama"],
              emotionalIndicators: ["Küçük bir eleştiride bile derin alınganlık ve incinme"],
              motivationalIndicators: ["Reddedilmemek için kendini geri çekme veya aşırı uyum sağlama"],
              interpersonalIndicators: ["Sosyal ipuçlarına karşı aşırı tetikte olma"],
              behavioralIndicatorsDetailed: [
                "Başkalarının sıradan bir tavrından bile kendisini istemedikleri sonucunu çıkarabilir",
                "Bir istekte bulunurken reddedilme korkusuyla çok büyük bir çekingenlik yaşar",
                "En ufak bir eleştiri veya mesafeli tavır karşısında hemen kırılır ve geri çekilir",
                "İnsanların hakkındaki düşüncelerini sürekli olumsuz yönde tahmin etmeye meyillidir"
              ]
            },
            relevantContexts: ["relationships", "social_settings"],
            undesiredItemPatterns: ["Herkes bana komplo kuruyor gibi hezeyanlar"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "LOW_SUBCLINICAL",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Kişilerarası hassasiyet ve reddedilme tehdidine odaklı algıyı ölçer."
          },
          items: [
            {
              itemId: "psi_sr_rsn_01",
              promptTr: "Birinden bir şey rica ettiğimde veya bir öneride bulunduğumda reddedilme ihtimali beni aşırı tedirgin eder.",
              promptEn: "When asking someone for something or making a suggestion, the possibility of being rejected makes me overly uneasy.",
              behavioralIndicator: "Talep anında reddedilme tedirginliği",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_rsn_02",
              promptTr: "Biri bana mesafeli veya soğuk davransa bile bunu hemen kişisel bir reddedilme olarak algılamam.",
              promptEn: "Even if someone acts distant or cold towards me, I do not immediately take it as a personal rejection.",
              behavioralIndicator: "Kişiselleştirmeme ve düşük hassasiyet (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_sr_rsn_03",
              promptTr: "İnsanların ufak bir bakışından veya ses tonundaki değişiklikten beni eleştirdiklerini veya istemediklerini düşünürüm.",
              promptEn: "From a slight glance or change in tone, I often think that people are criticizing me or do not want me.",
              behavioralIndicator: "Nötr ipuçlarını reddedilme olarak algılama",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_rsn_04",
              promptTr: "Grup içinde veya ikili ilişkilerde en ufak bir soğukluk hissettiğimde hemen içime kapanırım.",
              promptEn: "Whenever I sense the slightest coldness in a group or one-on-one relationship, I withdraw immediately.",
              behavioralIndicator: "Soğukluk karşısında kırılıp geri çekilme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_rsn_05",
              promptTr: "Bir davete veya teklife olumsuz yanıt alsam bile bunu rahatlıkla karşılar, üzerimde baskı hissetmem.",
              promptEn: "Even if I receive a negative response to an invitation or offer, I take it in stride without feeling distressed.",
              behavioralIndicator: "Reddedilme karşısında sakin kalabilme (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            }
          ]
        },
        {
          blueprint: {
            domainId: "social_relational",
            constructId: "interpersonal_competence",
            facetId: "cooperation_orientation",
            nameTr: "İş Birliği ve Ortak Fayda Yönelimi",
            nameEn: "Cooperation Orientation",
            scientificDefinitionTr: "Grup çalışmalarında ve sosyal ilişkilerde rekabet yerine iş birliğini, ortak hedefleri ve kolektif başarıyı önceleme eğilimi.",
            inclusionCriteria: ["Birlikte çalışma arzusu", "Bilgi ve kaynak paylaşımı", "Kolektif fayda"],
            exclusionCriteria: ["Kendi çıkarından tamamen vazgeçme", "Pasif uyum"],
            adjacentConstructs: ["benevolence_caring", "fairness", "tolerance"],
            discriminantRisks: ["İş birliği yönelimini bencil rekabetçilik ve aşırı boyun eğicilikten ayırmak"],
            referenceInstruments: ["Social Value Orientation (SVO Cooperative Scale)", "IPIP Cooperation"],
            primarySourceIds: ["src_goldberg_1999_ipip"],
            secondarySourceIds: ["src_schwartz_2012_pvq"],
            turkishEvidenceSourceIds: ["src_wasti_2008_lexical"],
            behavioralIndicators: {
              cognitiveIndicators: ["Birlikte çalışmanın bireysel başarıdan daha yüksek verim getireceğine inanma"],
              emotionalIndicators: ["Grup olarak başarıldığında duyulan gurur ve sevinç"],
              motivationalIndicators: ["Ortak faydayı maksimize etme motivasyonu"],
              interpersonalIndicators: ["Ekip arkadaşlarını destekleme ve kaynakları paylaşma"],
              behavioralIndicatorsDetailed: [
                "Bir projede tek başına öne çıkmak yerine ekiple uyum içinde üretmeyi tercih eder",
                "Bilgi ve deneyimlerini başkalarıyla cömertçe paylaşır",
                "Ortak bir hedefe ulaşırken herkesin katkısını önemser ve destekler",
                "Kişisel rekabet yerine ortak kazanç sağlayan çözümler üretmeye odaklanır"
              ]
            },
            relevantContexts: ["work_task", "social_settings"],
            undesiredItemPatterns: ["Kimseyle rekabet edemem gibi özgüvensizlik ifadeleri"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Sosyal değer yönelimi ve takım çalışması yatkınlığını ölçer."
          },
          items: [
            {
              itemId: "psi_sr_coo_01",
              promptTr: "Bir görevi veya projeyi yürütürken tek başıma parlamaktansa ekiple iş birliği içinde ortak bir başarıya ulaşmayı tercih ederim.",
              promptEn: "When carrying out a task or project, I prefer reaching mutual success in collaboration with a team rather than shining alone.",
              behavioralIndicator: "Takım çalışması ve ortak başarı tercihi",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_coo_02",
              promptTr: "İş ortamında başkalarının önüne geçmek için bilgimi ve kaynaklarımı kendime saklamaya özen gösteririm.",
              promptEn: "In the work environment, I tend to keep my knowledge and resources to myself to get ahead of others.",
              behavioralIndicator: "Bencil rekabet ve bilgi saklama (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_sr_coo_03",
              promptTr: "Birlikte çalıştığım insanların güçlü yönlerini ortaya çıkarmak ve onları desteklemek beni mutlu eder.",
              promptEn: "Bringing out the strengths of the people I work with and supporting them makes me happy.",
              behavioralIndicator: "Ekip arkadaşlarını destekleme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_coo_04",
              promptTr: "Farklı fikirlerin birleştiği ortak akıl ve dayanışmanın her zaman tekil çalışmalardan daha verimli olduğuna inanırım.",
              promptEn: "I believe that collective wisdom and solidarity combining diverse ideas are always more productive than individual work.",
              behavioralIndicator: "Ortak akla ve dayanışmaya inanç",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_coo_05",
              promptTr: "Bir grupta çalışırken sadece kendi görevime ve çıkarıma odaklanır, grubun geneliyle pek ilgilenmem.",
              promptEn: "When working in a group, I focus solely on my own task and interest, caring little about the group overall.",
              behavioralIndicator: "Grup hedeflerine ilgisizlik ve bireyselcilik (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            }
          ]
        },
        {
          blueprint: {
            domainId: "social_relational",
            constructId: "interpersonal_competence",
            facetId: "conflict_avoidance",
            nameTr: "Çatışma Kaçınması ve Uyum Sağlama",
            nameEn: "Conflict Avoidance",
            scientificDefinitionTr: "Kişilerarası gerginlik, tartışma ve yüzleşmelerden rahatsızlık duyarak huzuru korumak adına tartışmalardan kaçınma, sessiz kalma veya aşırı uyum gösterme eğilimi.",
            inclusionCriteria: ["Tartışmadan kaçınma", "Huzuru ön planda tutma", "Yüzleşmelerden geri durma"],
            exclusionCriteria: ["Barışçıl diplomatik arabuluculuk", "Korkaklık"],
            adjacentConstructs: ["assertiveness", "forgiveness", "flexibility_personality"],
            discriminantRisks: ["Çatışma kaçınmasını sağlıklı girişkenlikten ve yapıcı problem çözmeden ayırmak"],
            referenceInstruments: ["Thomas-Kilmann Conflict Mode Instrument (TKI - Avoidance Mode)"],
            primarySourceIds: ["src_thomas_kilmann_1974_tki"],
            secondarySourceIds: ["src_lee_ashton_2004"],
            turkishEvidenceSourceIds: ["src_derlega_1993_self_disclosure"],
            behavioralIndicators: {
              cognitiveIndicators: ["Tartışmanın her halükarda ilişkiye zarar vereceğine inanma"],
              emotionalIndicators: ["Gergin ortamlarda yoğun içsel stres ve huzursuzluk"],
              motivationalIndicators: ["Ortamın huzurunu ve dinginliğini her ne pahasına olursa olsun koruma arzusu"],
              interpersonalIndicators: ["Fikir ayrılığı çıktığında konuyu kapatma veya geri çekilme"],
              behavioralIndicatorsDetailed: [
                "Bir gerginlik veya tartışma ihtimali hissettiğinde konuyu hemen değiştirmeye çalışır",
                "Huzursuzluk çıkmasın diye kendi fikrinden veya hakkından kolayca vazgeçebilir",
                "İnsanlarla yüzleşmek ve açıkça tartışmak yerine sessiz kalmayı yeğler",
                "Gergin ortamlardan uzaklaşmak için elinden geleni yapar"
              ]
            },
            relevantContexts: ["relationships", "work_task", "social_settings"],
            undesiredItemPatterns: ["Her zaman başkalarına boyun eğmek zorundayım gibi acizlik bildiren ifadeler"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Kişilerarası çatışma yönetimi stillerinden kaçınma boyutunu ölçer."
          },
          items: [
            {
              itemId: "psi_sr_cav_01",
              promptTr: "Kişilerarası ilişkilerde tartışma ve gerginlik çıkmasın diye genellikle alttan alır ve konuyu kapatmayı tercih ederim.",
              promptEn: "In interpersonal relationships, I usually give in and prefer dropping the topic to avoid arguments and tension.",
              behavioralIndicator: "Huzuru korumak için alttan alma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_cav_02",
              promptTr: "Önemli bir konuda anlaşmazlık çıktığında tartışmaktan ve karşımdakiyle yüzleşmekten çekinmem.",
              promptEn: "When a disagreement arises over an important matter, I do not shy away from arguing and confronting the other person.",
              behavioralIndicator: "Yüzleşmeye ve tartışmaya açıklık (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_sr_cav_03",
              promptTr: "Ortamdaki barış ve huzuru korumak adına kendi isteklerimi geri plana atmaya meyilliyimdir.",
              promptEn: "I tend to put my own wishes on the back burner in order to maintain peace and harmony in the environment.",
              behavioralIndicator: "Huzur için kendi isteklerinden feragat etme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_cav_04",
              promptTr: "Bir toplantıda veya sohbette hava gerildiğinde hemen ortamdan uzaklaşmak veya sessizliğe bürünmek isterim.",
              promptEn: "When tension rises in a meeting or conversation, I immediately want to leave the room or retreat into silence.",
              behavioralIndicator: "Gerginlik anında geri çekilme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_sr_cav_05",
              promptTr: "Bir fikir ayrılığı olduğunda bunu sakince masaya yatırıp sonuna kadar tartışarak çözmeyi hedeflerim.",
              promptEn: "When there is a divergence of views, I aim to calmly put it on the table and resolve it by debating thoroughly.",
              behavioralIndicator: "Açıkça tartışarak çözüm arama (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            }
          ]
        }
      ]
    }
  ]
};

module.exports = DOMAIN_7_DATA;
