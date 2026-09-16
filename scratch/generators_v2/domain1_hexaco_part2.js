/**
 * DOMAIN 1: CORE PERSONALITY (HEXACO) — PART 2
 * Constructs:
 * 4. hexaco_agreeableness (forgivingness, gentleness, flexibility, patience)
 * 5. hexaco_conscientiousness (organization, diligence, perfectionism, prudence)
 * 6. hexaco_openness (aesthetic_appreciation, inquisitiveness, creativity, unconventionality)
 */

const DOMAIN_1_PART2 = {
  constructs: [
    // 4. Agreeableness
    {
      constructId: "hexaco_agreeableness",
      facets: [
        {
          blueprint: {
            domainId: "core_personality",
            constructId: "hexaco_agreeableness",
            facetId: "forgivingness",
            nameTr: "Affedicilik",
            nameEn: "Forgivingness",
            scientificDefinitionTr: "Kendisine haksızlık veya kötülük yapan insanlara karşı kin tutmama; intikam duygusundan uzak durup güveni ve ilişkileri onarmaya açık olma eğilimi.",
            inclusionCriteria: ["Kin gütmeme", "Hataları bağışlama", "İlişkiyi onarma isteği"],
            exclusionCriteria: ["Sınırsız suistimale izin verme", "Kişisel sınır eksikliği"],
            adjacentConstructs: ["patience", "gentleness", "empathic_concern"],
            discriminantRisks: ["Affediciliği zayıflık veya sınır koyamama ile karıştırmamak"],
            referenceInstruments: ["IPIP-HEXACO Forgivingness Scale", "HEXACO-PI-R"],
            primarySourceIds: ["src_lee_ashton_2004", "src_ashton_lee_2007"],
            secondarySourceIds: ["src_goldberg_1999_ipip"],
            turkishEvidenceSourceIds: ["src_wasti_2008_lexical"],
            behavioralIndicators: {
              cognitiveIndicators: ["İnsanların hata yapabileceğini kabul etme"],
              emotionalIndicators: ["Öfke ve kızgınlığı uzun süre içinde taşımama"],
              motivationalIndicators: ["Barışçıl ve huzurlu ilişkileri sürdürme arzusu"],
              interpersonalIndicators: ["Özür dileyen birine ikinci şans verme"],
              behavioralIndicatorsDetailed: [
                "Biri kalbini kırdığında özür dilerse onu kolayca bağışlar",
                "Geçmişte yaşanan haksızlıkları yıllarca kin güderek içinde büyütmez",
                "İntikam alma veya öç alma planları yapmaktan tamamen uzaktır",
                "İlişkilerde kırgınlıkları uzatmak yerine barışmayı tercih eder"
              ]
            },
            relevantContexts: ["relationships", "social_settings"],
            undesiredItemPatterns: ["Bana ne yapılırsa yapılsın gülerim gibi pasifist ifadeler"],
            socialDesirabilityRisk: "MODERATE",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Kişilerarası çatışmaların ardından kin tutmama ve affetme eğilimini ölçer."
          },
          items: [
            {
              itemId: "psi_ag_forg_01",
              promptTr: "Bana haksızlık yapan biri samimiyetle pişman olduğunda onu affetmekte zorlanmam.",
              promptEn: "When someone who wronged me is genuinely repentant, I do not find it difficult to forgive them.",
              behavioralIndicator: "Samimi pişmanlığı bağışlama",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_ag_forg_02",
              promptTr: "Biri bana zarar verdiğinde bunu yıllarca unutmam ve içimde derin bir kin tutarım.",
              promptEn: "When someone harms me, I do not forget it for years and hold a deep grudge inside.",
              behavioralIndicator: "Kin tutma ve unutamama (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_ag_forg_03",
              promptTr: "Geçmişte yaşanan kırgınlıkları uzatmak yerine tatlıya bağlayıp önüme bakmayı tercih ederim.",
              promptEn: "I prefer to settle past resentments and look forward rather than prolonging them.",
              behavioralIndicator: "Kırgınlıkları uzatmama",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_ag_forg_04",
              promptTr: "Canımı yakan insanlardan fırsatını bulduğumda intikam alma isteği duyarım.",
              promptEn: "I feel a desire to take revenge on people who hurt me whenever I find the opportunity.",
              behavioralIndicator: "İntikam arzusu (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_ag_forg_05",
              promptTr: "İnsanların istemeden de olsa hata yapabileceğini anlayışla karşılarım.",
              promptEn: "I understand with tolerance that people can make mistakes even unintentionally.",
              behavioralIndicator: "Hataları anlayışla karşılama",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        },
        {
          blueprint: {
            domainId: "core_personality",
            constructId: "hexaco_agreeableness",
            facetId: "gentleness",
            nameTr: "Yumuşak Başlılık ve Nezaket",
            nameEn: "Gentleness",
            scientificDefinitionTr: "Başkalarını sert bir şekilde yargılamaktan, eleştirmekten ve kırmaktan kaçınma; iletişimde yapıcı, anlayışlı ve nazik bir üslup kullanma eğilimi.",
            inclusionCriteria: ["Nazik ve yapıcı üslup", "Sert eleştiriden kaçınma", "Hoşgörü"],
            exclusionCriteria: ["Pasif boyun eğme", "Fikrini hiç söyleyememe"],
            adjacentConstructs: ["patience", "flexibility", "sincerity"],
            discriminantRisks: ["Nezaketi fikirsizlikle karıştırmamak"],
            referenceInstruments: ["IPIP-HEXACO Gentleness Scale", "HEXACO-PI-R"],
            primarySourceIds: ["src_lee_ashton_2004", "src_ashton_lee_2007"],
            secondarySourceIds: ["src_goldberg_1999_ipip"],
            turkishEvidenceSourceIds: ["src_wasti_2008_lexical"],
            behavioralIndicators: {
              cognitiveIndicators: ["Kırıcı eleştirinin iletişimi tıkadığına inanma"],
              emotionalIndicators: ["Başkalarının kusurlarına karşı şefkatli bir yaklaşım"],
              motivationalIndicators: ["İletişimde ortamı yumuşatma ve insanları incitmeme isteği"],
              interpersonalIndicators: ["Görüş ayrılıklarını nazik ve saygılı bir dille ifade etme"],
              behavioralIndicatorsDetailed: [
                "İnsanların hatalarını yüzlerine sert bir şekilde vurmaktan kaçınır",
                "Eleştirilerini kırıcı olmadan, yapıcı ve nazik bir dille iletir",
                "Görüş ayrılıklarında karşısındakini aşağılamadan tartışır",
                "İletişiminde hoşgörülü ve yumuşak bir yaklaşımı korur"
              ]
            },
            relevantContexts: ["relationships", "work_task", "social_settings"],
            undesiredItemPatterns: ["Kimseye asla hayır diyemem gibi asertiflik kaybı ifadeleri"],
            socialDesirabilityRisk: "MODERATE",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 1,
            measurementRationale: "Kişilerarası eleştiri ve iletişim tarzında nezaket ve hoşgörü seviyesini ölçer."
          },
          items: [
            {
              itemId: "psi_ag_gent_01",
              promptTr: "Birinin hatasını düzeltmem gerektiğinde bunu kırmadan ve nazik bir dille ifade ederim.",
              promptEn: "When I need to correct someone's mistake, I express it gently and without offending.",
              behavioralIndicator: "Nazik ve yapıcı geribildirim",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_ag_gent_02",
              promptTr: "İnsanların kusurlarını ve eksiklerini doğrudan yüzlerine çok sert bir şekilde söylerim.",
              promptEn: "I point out people's flaws and shortcomings very harshly right to their faces.",
              behavioralIndicator: "Sert ve kırıcı eleştiri (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_ag_gent_03",
              promptTr: "Farklı düşünen insanlarla tartışırken saygılı ve hoşgörülü üslubumu korurum.",
              promptEn: "While debating with people who think differently, I maintain my respectful and tolerant tone.",
              behavioralIndicator: "Tartışmalarda hoşgörülü üslup",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_ag_gent_04",
              promptTr: "Başkalarını yargılarken acımasız davranmak yerine anlayış göstermeye çalışırım.",
              promptEn: "Instead of being ruthless when judging others, I try to show understanding.",
              behavioralIndicator: "Yargılamada şefkat ve anlayış",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_ag_gent_05",
              promptTr: "İnsanlarla iletişimimde sertlik ve kabalık yerine uzlaşmacı bir dili tercih ederim.",
              promptEn: "In my communication with people, I prefer an agreeable language over harshness and rudeness.",
              behavioralIndicator: "Uzlaşmacı dil tercihi",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        },
        {
          blueprint: {
            domainId: "core_personality",
            constructId: "hexaco_agreeableness",
            facetId: "flexibility",
            nameTr: "Esneklik ve Uzlaşmacılık",
            nameEn: "Flexibility",
            scientificDefinitionTr: "Kendi görüşlerinde inatlaşmaktan kaçınma; başkalarının önerilerine, fikirlerine ve ortak uzlaşılara açık olma eğilimi.",
            inclusionCriteria: ["Fikir esnekliği", "Ortak kararlara uyum", "Uzlaşmaya açıklık"],
            exclusionCriteria: ["Omurgasızlık", "Kendi fikrinden hemen vazgeçme"],
            adjacentConstructs: ["cognitive_flexibility", "cooperation_orientation", "gentleness"],
            discriminantRisks: ["Kişilerarası uzlaşmacılığı bilişsel problem esnekliğinden ayrıştırmak"],
            referenceInstruments: ["IPIP-HEXACO Flexibility Scale", "HEXACO-PI-R"],
            primarySourceIds: ["src_lee_ashton_2004", "src_ashton_lee_2007"],
            secondarySourceIds: ["src_goldberg_1999_ipip"],
            turkishEvidenceSourceIds: ["src_wasti_2008_lexical"],
            behavioralIndicators: {
              cognitiveIndicators: ["Kendi fikrinin her zaman en doğrusu olmayabileceğini kabul etme"],
              emotionalIndicators: ["Uzlaşma ararken öfkelenmeme"],
              motivationalIndicators: ["Ortak noktada buluşma isteği"],
              interpersonalIndicators: ["Grup kararlarında esnek davranabilme"],
              behavioralIndicatorsDetailed: [
                "Birlikte çalışırken başkalarının makul önerilerine kolayca uyum sağlar",
                "Bir anlaşmazlıkta sırf kendi dediği olsun diye inatlaşmaz",
                "Yeni kanıtlar sunulduğunda fikrini değiştirmekte zorlanmaz",
                "Ortak kararlarda orta yolu bulmaya isteklidir"
              ]
            },
            relevantContexts: ["work_task", "relationships", "social_settings"],
            undesiredItemPatterns: ["Herkes ne derse onu yaparım gibi iradesizlik ifadeleri"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "İkili ilişkilerde ve grup çalışmalarında inatçılıktan kaçınma ve esnek uzlaşma kapasitesini ölçer."
          },
          items: [
            {
              itemId: "psi_ag_flex_01",
              promptTr: "Bir grupta farklı fikirler çıktığında ortak bir noktada buluşmak için esneklik gösteririm.",
              promptEn: "When different ideas emerge in a group, I show flexibility to meet at a common point.",
              behavioralIndicator: "Grup kararlarında uzlaşma esnekliği",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_ag_flex_02",
              promptTr: "Bir konuda karar verdiğimde başkalarının ne söylediğine bakmaksızın inatla kendi bildiğimi okurum.",
              promptEn: "Once I decide on a matter, I stubbornly do things my way regardless of what others say.",
              behavioralIndicator: "Katı inatçılık (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_ag_flex_03",
              promptTr: "Karşımdaki kişinin önerisi mantıklıysa kendi planımı değiştirmekte bir sakınca görmem.",
              promptEn: "If the other person's suggestion is logical, I see no problem in changing my plan.",
              behavioralIndicator: "Mantıklı önerilere uyum",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_ag_flex_04",
              promptTr: "Bir tartışmada haklı olduğumu kanıtlamak için sonuna kadar direnirim ve geri adım atmam.",
              promptEn: "In a debate, I resist to the very end to prove I am right and never take a step back.",
              behavioralIndicator: "Haklı çıkma inadı (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_ag_flex_05",
              promptTr: "İlişkilerde orta yolu bulmanın her zaman katı inatlaşmalardan daha değerli olduğunu bilirim.",
              promptEn: "I know that finding a middle ground in relationships is always more valuable than rigid stubbornness.",
              behavioralIndicator: "Orta yol bulma anlayışı",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        },
        {
          blueprint: {
            domainId: "core_personality",
            constructId: "hexaco_agreeableness",
            facetId: "patience",
            nameTr: "Sabır ve Sakinlik",
            nameEn: "Patience",
            scientificDefinitionTr: "Kışkırtıcı durumlarda, gecikmelerde veya engellenmelerde öfkesini kontrol edebilme; kolayca parlamayıp sakinliğini koruma eğilimi.",
            inclusionCriteria: ["Öfke kontrolü", "Provokasyonlara sakin tepki", "Sabırlı yaklaşım"],
            exclusionCriteria: ["Duygusal donukluk", "Kayıtsızlık"],
            adjacentConstructs: ["forgivingness", "gentleness", "distress_tolerance"],
            discriminantRisks: ["Sabırlılığı duygusuzluk veya pasif agresiflikle karıştırmamak"],
            referenceInstruments: ["IPIP-HEXACO Patience Scale", "HEXACO-PI-R"],
            primarySourceIds: ["src_lee_ashton_2004", "src_ashton_lee_2007"],
            secondarySourceIds: ["src_goldberg_1999_ipip"],
            turkishEvidenceSourceIds: ["src_wasti_2008_lexical"],
            behavioralIndicators: {
              cognitiveIndicators: ["Ani öfkenin sorunları çözmeyeceğine inanma"],
              emotionalIndicators: ["Kışkırtma anlarında nabzı ve tepkiyi kontrol altında tutabilme"],
              motivationalIndicators: ["Gergin anlarda soğukkanlı kalma arzusu"],
              interpersonalIndicators: ["İnsanların sabır zorlayan tavırlarına karşı sakin kalabilme"],
              behavioralIndicatorsDetailed: [
                "Biri onu kışkırtsa bile kolayca öfkelenip kontrolünü kaybetmez",
                "İşler yavaş ilerlediğinde veya beklemek zorunda kaldığında sabırlı davranır",
                "Trafikte veya günlük gerilimlerde hemen parlamaz",
                "Zorlayıcı insanlarla iletişim kurarken sakinliğini korur"
              ]
            },
            relevantContexts: ["everyday_life", "work_task", "relationships"],
            undesiredItemPatterns: ["Beni hiçbir şey sinirlendiremez gibi insan doğasına aykırı mutlak iddialar"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Öfke patlamalarına direnç ve gündelik gerilimler karşısında mizaçsal sabır düzeyini ölçer."
          },
          items: [
            {
              itemId: "psi_ag_pat_01",
              promptTr: "Kışkırtıcı ve can sıkıcı durumlar karşısında bile kolayca öfkeye kapılmam.",
              promptEn: "Even in provocative and annoying situations, I do not easily get angry.",
              behavioralIndicator: "Kışkırtma karşısında öfke kontrolü",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_ag_pat_02",
              promptTr: "Biri beni sinirlendirdiğinde aniden parlar ve çok sert tepkiler veririm.",
              promptEn: "When someone makes me angry, I flare up suddenly and react very harshly.",
              behavioralIndicator: "Ani öfke parlaması (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_ag_pat_03",
              promptTr: "İşlerin yavaş ilerlediği veya beklemek zorunda kaldığım anlarda sabrımı korurum.",
              promptEn: "In moments when things progress slowly or I have to wait, I maintain my patience.",
              behavioralIndicator: "Gecikmelerde sabırlı kalma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_ag_pat_04",
              promptTr: "Ters giden küçük şeylere bile tahammül etmekte zorlanır ve hemen gerilirim.",
              promptEn: "I struggle to tolerate even small things going wrong and get tense right away.",
              behavioralIndicator: "Düşük tahammül ve gerginlik (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_ag_pat_05",
              promptTr: "Zorlayıcı insanlarla muhatap olurken sakinliğimi ve nezaketimi muhafaza edebilirim.",
              promptEn: "When dealing with difficult people, I can preserve my calm and courtesy.",
              behavioralIndicator: "Zorlayıcı kişiler karşısında sükunet",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        }
      ]
    },

    // 5. Conscientiousness
    {
      constructId: "hexaco_conscientiousness",
      facets: [
        {
          blueprint: {
            domainId: "core_personality",
            constructId: "hexaco_conscientiousness",
            facetId: "organization",
            nameTr: "Düzenlilik ve Planlılık",
            nameEn: "Organization",
            scientificDefinitionTr: "Fiziksel çevresini düzenli tutma, işlerini ve zamanını yapılandırılmış bir plan dahilinde yürütme eğilimi.",
            inclusionCriteria: ["Fiziksel çevre düzeni", "Zaman yönetimi", "Sistematik çalışma"],
            exclusionCriteria: ["Aşırı OKB kompulsiyonları", "Katı takıntılar"],
            adjacentConstructs: ["diligence", "prudence", "perfectionism"],
            discriminantRisks: ["Düzenliliği klinik obsesif kompulsif takıntılardan ayrıştırmak"],
            referenceInstruments: ["IPIP-HEXACO Organization Scale", "HEXACO-PI-R"],
            primarySourceIds: ["src_lee_ashton_2004", "src_ashton_lee_2007"],
            secondarySourceIds: ["src_goldberg_1999_ipip"],
            turkishEvidenceSourceIds: ["src_wasti_2008_lexical"],
            behavioralIndicators: {
              cognitiveIndicators: ["Düzenin verimliliği artırdığına inanma"],
              emotionalIndicators: ["Dağınık ortamlarda rahatsızlık duyma"],
              motivationalIndicators: ["Planlı ve yapılandırılmış yaşama arzusu"],
              interpersonalIndicators: ["Ortak alanların düzenine özen gösterme"],
              behavioralIndicatorsDetailed: [
                "Çalışma masasını, eşyalarını ve yaşam alanını derli toplu tutar",
                "Yapacağı işleri önceden listeler ve sıraya koyar",
                "Zamanını planlayarak son dakika telaşlarından kaçınır",
                "Sistematik ve organize bir çalışma tarzını benimser"
              ]
            },
            relevantContexts: ["work_task", "everyday_life", "planning"],
            undesiredItemPatterns: ["Eşyalarım milimetrik durmazsa çıldırırım gibi klinik OKB ifadeleri"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Kişisel ve profesyonel alanda yapılandırılmış düzen ve zaman yönetimi disiplinini ölçer."
          },
          items: [
            {
              itemId: "psi_co_org_01",
              promptTr: "Eşyalarımı ve çalışma ortamımı düzenli ve derli toplu tutmaya özen gösteririm.",
              promptEn: "I take care to keep my belongings and workspace neat and orderly.",
              behavioralIndicator: "Çevre ve eşya düzeni",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_co_org_02",
              promptTr: "Gündelik işlerimi belirli bir plan yapmadan, tamamen rastgele ve dağınık yürütürüm.",
              promptEn: "I carry out my daily tasks without making a specific plan, completely randomly and disorganized.",
              behavioralIndicator: "Plansız ve dağınık çalışma (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_co_org_03",
              promptTr: "Güne başlamadan önce yapmam gereken işleri listelemek ve sıraya koymak bana kolaylık sağlar.",
              promptEn: "Listing and prioritizing the tasks I need to do before starting the day makes things easier for me.",
              behavioralIndicator: "İşleri listeleme ve planlama",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_co_org_04",
              promptTr: "Çevremdeki dağınıklık veya plansızlık beni hiç rahatsız etmez.",
              promptEn: "Clutter or lack of planning around me does not bother me at all.",
              behavioralIndicator: "Dağınıklığa kayıtsızlık (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_co_org_05",
              promptTr: "Önemli evraklarımı ve kişisel eşyalarımı aradığımda hemen bulabileceğim şekilde saklarım.",
              promptEn: "I store my important documents and personal belongings so that I can find them immediately when needed.",
              behavioralIndicator: "Sistematik saklama ve arşivleme",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        },
        {
          blueprint: {
            domainId: "core_personality",
            constructId: "hexaco_conscientiousness",
            facetId: "diligence",
            nameTr: "Çalışkanlık ve Sebat",
            nameEn: "Diligence",
            scientificDefinitionTr: "Zorlu görevlerde yüksek çaba gösterme, başladığı işi sonuna kadar tamamlama ve sorumluluklarını disiplinle yerine getirme eğilimi.",
            inclusionCriteria: ["Görev tamamlama motivasyonu", "Çalışma disiplini", "Zorluklarda pes etmeme"],
            exclusionCriteria: ["İşkoliklik patolojisi", "Tükenmişlik"],
            adjacentConstructs: ["long_term_grit", "general_self_control", "organization"],
            discriminantRisks: ["Çalışkanlığı aşırı yıpratıcı işkoliklikten ayrıştırmak"],
            referenceInstruments: ["IPIP-HEXACO Diligence Scale", "HEXACO-PI-R"],
            primarySourceIds: ["src_lee_ashton_2004", "src_ashton_lee_2007"],
            secondarySourceIds: ["src_goldberg_1999_ipip"],
            turkishEvidenceSourceIds: ["src_wasti_2008_lexical"],
            behavioralIndicators: {
              cognitiveIndicators: ["Başarının disiplinli çalışma ile geleceğine inanma"],
              emotionalIndicators: ["İşi bitirdiğinde derin bir tatmin duygusu yaşama"],
              motivationalIndicators: ["Zorluklar karşısında yılmadan devam etme arzusu"],
              interpersonalIndicators: ["Verdiği sözleri ve görev taahhütlerini zamanında yerine getirme"],
              behavioralIndicatorsDetailed: [
                "Başladığı zor bir projeyi yarıda bırakmadan tamamlamak için çabalar",
                "İşinde hedeflerine ulaşmak için gereken ekstra emeği vermekten kaçınmaz",
                "Yorulduğunda bile sorumluluklarını ertelemek yerine bitirmeye odaklanır",
                "Disiplinli ve özverili çalışma temposunu korur"
              ]
            },
            relevantContexts: ["work_task", "personal_goals"],
            undesiredItemPatterns: ["Uyumadan 24 saat çalışırım gibi gerçek dışı iddialar"],
            socialDesirabilityRisk: "MODERATE",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 1,
            measurementRationale: "Göreve adanmışlık, çalışma azmi ve sorumluluk bilincini ölçer."
          },
          items: [
            {
              itemId: "psi_co_dil_01",
              promptTr: "Başladığım zor bir işi ne kadar zaman alırsa alsın sonuna kadar tamamlamaya çalışırım.",
              promptEn: "I try to complete a difficult task I started to the very end, no matter how much time it takes.",
              behavioralIndicator: "İşi sonuna kadar götürme azmi",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_co_dil_02",
              promptTr: "Zorlayıcı bir görevle karşılaştığımda çaba göstermek yerine kolayca pes eder veya ertelerim.",
              promptEn: "When faced with a challenging task, I easily give up or procrastinate rather than making an effort.",
              behavioralIndicator: "Zorluk karşısında çabuk pes etme (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_co_dil_03",
              promptTr: "Hedeflerime ulaşmak için gereken emeği ve disiplinli çalışmayı ortaya koymaktan çekinmem.",
              promptEn: "I do not hesitate to put in the effort and disciplined work needed to reach my goals.",
              behavioralIndicator: "Hedef için disiplinli çaba",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_co_dil_04",
              promptTr: "Üzerime aldığım sorumlulukları baştan savma değil, hakkını vererek yerine getiririm.",
              promptEn: "I fulfill the responsibilities I take on with full dedication rather than doing a sloppy job.",
              behavioralIndicator: "Sorumlulukları titizlikle tamamlama",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_co_dil_05",
              promptTr: "İşlerimde yüksek bir standart yakalamak için sabırla çalışmaya devam ederim.",
              promptEn: "I continue to work patiently to achieve a high standard in my tasks.",
              behavioralIndicator: "Sebatla çalışma temposu",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        },
        {
          blueprint: {
            domainId: "core_personality",
            constructId: "hexaco_conscientiousness",
            facetId: "perfectionism",
            nameTr: "Mükemmeliyetçilik ve Titizlik",
            nameEn: "Perfectionism",
            scientificDefinitionTr: "Yapılan işlerde kusursuzluk arama, en küçük ayrıntıları dahi titizlikle denetleme ve yüksek kalite standartlarını koruma eğilimi.",
            inclusionCriteria: ["Detaycılık", "Kalite standartları", "Hata denetimi"],
            exclusionCriteria: ["Klinik felç edici obsesyon", "Aşırı kaygılı erteleme"],
            adjacentConstructs: ["diligence", "organization", "prudence"],
            discriminantRisks: ["Sağlıklı titizliği patolojik felç edici mükemmeliyetçilikten ayırmak"],
            referenceInstruments: ["IPIP-HEXACO Perfectionism Scale", "HEXACO-PI-R"],
            primarySourceIds: ["src_lee_ashton_2004", "src_ashton_lee_2007"],
            secondarySourceIds: ["src_goldberg_1999_ipip"],
            turkishEvidenceSourceIds: ["src_wasti_2008_lexical"],
            behavioralIndicators: {
              cognitiveIndicators: ["Detayların işin kalitesini belirlediğine inanma"],
              emotionalIndicators: ["Kusurlu veya özensiz bir iş teslim etmekten rahatsızlık duyma"],
              motivationalIndicators: ["Her işi olabilecek en iyi standartta yapma arzusu"],
              interpersonalIndicators: ["Ortak projelerde kaliteyi denetleme"],
              behavioralIndicatorsDetailed: [
                "Teslim edeceği bir işi göndermeden önce hatalara karşı defalarca kontrol eder",
                "Küçük detayların ve inceliklerin doğru yapılmasına büyük önem verir",
                "Özensiz veya eksik bırakılmış işlerden hoşlanmaz",
                "Yaptığı işin kusursuz olması için çaba sarf eder"
              ]
            },
            relevantContexts: ["work_task", "planning"],
            undesiredItemPatterns: ["Hata yaparsam hayatım mahvolur gibi felaketleştirici ifadeler"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 1,
            measurementRationale: "İş ve görevlerde detaylara verilen önem ve kalite kontrol titizliğini ölçer."
          },
          items: [
            {
              itemId: "psi_co_perf_01",
              promptTr: "Yaptığım bir işi teslim etmeden önce en küçük hatalara karşı bile dikkatle kontrol ederim.",
              promptEn: "Before submitting a work I did, I check it carefully even for the smallest errors.",
              behavioralIndicator: "Hatalara karşı detaylı kontrol",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_co_perf_02",
              promptTr: "İşlerimin detaylarıyla uğraşmak yerine sadece genel hatlarıyla tamamlanmış olmasını yeterli bulurum.",
              promptEn: "Instead of dealing with details, I find it sufficient if my tasks are completed in broad strokes.",
              behavioralIndicator: "Detaylara kayıtsızlık (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_co_perf_03",
              promptTr: "Ortaya koyduğum her çalışmanın olabilecek en yüksek kalitede ve kusursuz olmasını isterim.",
              promptEn: "I want every work I produce to be of the highest possible quality and flawless.",
              behavioralIndicator: "Yüksek kalite standardı arayışı",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_co_perf_04",
              promptTr: "Özensiz ve baştan savma yapılmış işler beni derinden rahatsız eder.",
              promptEn: "Sloppy and carelessly done work bothers me deeply.",
              behavioralIndicator: "Özensizliğe karşı tahammülsüzlük",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_co_perf_05",
              promptTr: "Bir projedeki kritik ayrıntıları gözden kaçırmamak için titizlikle çalışırım.",
              promptEn: "I work meticulously so as not to miss critical details in a project.",
              behavioralIndicator: "Kritik detayları titizlikle denetleme",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        },
        {
          blueprint: {
            domainId: "core_personality",
            constructId: "hexaco_conscientiousness",
            facetId: "prudence",
            nameTr: "İhtiyatlılık ve Tedbirlilik",
            nameEn: "Prudence",
            scientificDefinitionTr: "Karar alırken ve harekete geçerken olası sonuçları önceden düşünme; fevri ve düşüncesizce davranmaktan kaçınma eğilimi.",
            inclusionCriteria: ["Düşünerek hareket etme", "Olası sonuçları hesaplama", "Fevrilikten kaçınma"],
            exclusionCriteria: ["Aşırı kararsızlık", "Eyleme geçememe"],
            adjacentConstructs: ["uppsp_lack_of_premeditation", "general_self_control", "organization"],
            discriminantRisks: ["İhtiyatlılığı aşırı korkaklık ve eylemsizlikten ayırmak"],
            referenceInstruments: ["IPIP-HEXACO Prudence Scale", "HEXACO-PI-R"],
            primarySourceIds: ["src_lee_ashton_2004", "src_ashton_lee_2007"],
            secondarySourceIds: ["src_goldberg_1999_ipip"],
            turkishEvidenceSourceIds: ["src_wasti_2008_lexical"],
            behavioralIndicators: {
              cognitiveIndicators: ["Her eylemin bir sonucu olduğunu öngörme"],
              emotionalIndicators: ["Aceleye getirilmiş kararlardan çekinme"],
              motivationalIndicators: ["Gereksiz risklerden kaçınma arzusu"],
              interpersonalIndicators: ["Önemli konularda düşünmeden söz vermeme"],
              behavioralIndicatorsDetailed: [
                "Bir karar vermeden önce artı ve eksi yönleri tartar",
                "Sonradan pişman olmamak için fevri çıkışlardan kaçınır",
                "Adım atmadan önce karşılaşabileceği riskleri hesaplar",
                "Düşünmeden hareket etmek yerine sağduyulu bir yol izler"
              ]
            },
            relevantContexts: ["decisions", "planning", "everyday_life"],
            undesiredItemPatterns: ["Hiçbir karar veremem gibi kararsızlık ifadeleri"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Karar alma ve eyleme geçme süreçlerinde sağduyulu ön-düşünme ve fevrilik kontrolünü ölçer."
          },
          items: [
            {
              itemId: "psi_co_prud_01",
              promptTr: "Önemli bir karar vermeden önce doğurabileceği sonuçları etraflıca düşünürüm.",
              promptEn: "Before making an important decision, I thoroughly consider the consequences it might produce.",
              behavioralIndicator: "Sonuçları önceden hesaplama",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_co_prud_02",
              promptTr: "Çoğu zaman ne yapacağımı önceden tartmadan, anlık heveslerle harekete geçerim.",
              promptEn: "Most of the time I act on momentary impulses without weighing what to do beforehand.",
              behavioralIndicator: "Düşüncesizce anlık hareket etme (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_co_prud_03",
              promptTr: "Sonradan pişman olmamak için adımlarımı temkinli ve sağduyulu şekilde atarım.",
              promptEn: "I take my steps cautiously and sensibly so as not to regret them later.",
              behavioralIndicator: "Temkinli ve sağduyulu eylem",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_co_prud_04",
              promptTr: "Gelecekte yaratabileceği riskleri düşünmeden acele kararlar veririm.",
              promptEn: "I make hasty decisions without thinking about the risks they might create in the future.",
              behavioralIndicator: "Aceleci ve riskli karar alma (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_co_prud_05",
              promptTr: "Büyük bir taahhütte bulunmadan önce seçeneklerimi karşılaştırmayı tercih ederim.",
              promptEn: "I prefer to compare my options before making a major commitment.",
              behavioralIndicator: "Seçenekleri karşılaştırarak ilerleme",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        }
      ]
    },

    // 6. Openness to Experience
    {
      constructId: "hexaco_openness",
      facets: [
        {
          blueprint: {
            domainId: "core_personality",
            constructId: "hexaco_openness",
            facetId: "aesthetic_appreciation",
            nameTr: "Estetik Takdir ve Sanat Duyarlılığı",
            nameEn: "Aesthetic Appreciation",
            scientificDefinitionTr: "Sanat eserlerine, müziğe, edebiyata ve doğadaki görsel/işitsel güzelliklere karşı derin bir hayranlık ve estetik duyarlılık hissetme eğilimi.",
            inclusionCriteria: ["Sanat ilgisi", "Estetik algı", "Doğa güzelliklerine duyarlılık"],
            exclusionCriteria: ["Züppelik", "Sanatsal gösterişçilik"],
            adjacentConstructs: ["creativity", "inquisitiveness", "sentimentality"],
            discriminantRisks: ["İçten estetik duyarlılığı sanatsal bilgi gösterişinden ayırmak"],
            referenceInstruments: ["IPIP-HEXACO Aesthetic Appreciation Scale", "HEXACO-PI-R"],
            primarySourceIds: ["src_lee_ashton_2004", "src_ashton_lee_2007"],
            secondarySourceIds: ["src_goldberg_1999_ipip"],
            turkishEvidenceSourceIds: ["src_wasti_2008_lexical"],
            behavioralIndicators: {
              cognitiveIndicators: ["Sanatın insan ruhunu beslediğine inanma"],
              emotionalIndicators: ["Güzel bir müzik veya görsel sanat karşısında büyülenme"],
              motivationalIndicators: ["Kültürel ve sanatsal etkinlikleri takip etme arzusu"],
              interpersonalIndicators: ["Sanatsal zevkleri ve deneyimleri paylaşma"],
              behavioralIndicatorsDetailed: [
                "Güzel bir sanat eseri veya müzik dinlediğinde derin bir hayranlık hisseder",
                "Doğadaki manzaraların ve estetik formların güzelliğine hayran kalır",
                "Sanat galerileri, tiyatro veya edebi eserlerle vakit geçirmekten keyif alır",
                "Estetik ve görsel uyuma gündelik yaşamında önem verir"
              ]
            },
            relevantContexts: ["everyday_life", "social_settings"],
            undesiredItemPatterns: ["Sanattan anlamayanlar cahildir gibi elitist ifadeler"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Sanat, müzik, edebiyat ve doğa estetiğine karşı bireysel duyarlılığı değerlendirir."
          },
          items: [
            {
              itemId: "psi_op_aes_01",
              promptTr: "Güzel bir sanat eseri veya etkileyici bir müzik dinlediğimde derin bir hayranlık hissederim.",
              promptEn: "When I experience a beautiful piece of art or listen to impressive music, I feel deep admiration.",
              behavioralIndicator: "Sanat ve müzik karşısında hayranlık",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_op_aes_02",
              promptTr: "Resim sergileri, tiyatro veya şiir gibi sanatsal alanlar bana oldukça sıkıcı ve anlamsız gelir.",
              promptEn: "Artistic fields like painting exhibitions, theater, or poetry seem quite boring and meaningless to me.",
              behavioralIndicator: "Sanatsal alanlara kayıtsızlık (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_op_aes_03",
              promptTr: "Doğadaki manzaraların ve mimari yapıların estetik uyumunu izlemekten büyük keyif alırım.",
              promptEn: "I take great pleasure in watching the aesthetic harmony of natural landscapes and architectural structures.",
              behavioralIndicator: "Doğal ve mimari estetik takdiri",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_op_aes_04",
              promptTr: "Eşyaların veya mekanların görsel güzelliği ve zarafeti benim için hiçbir önem taşımaz.",
              promptEn: "The visual beauty and elegance of objects or spaces carry no importance for me.",
              behavioralIndicator: "Görsel güzelliğe ilgisizlik (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_op_aes_05",
              promptTr: "Sanatsal yaratıcılık içeren eserler beni zihinsel ve duygusal olarak büyüler.",
              promptEn: "Works containing artistic creativity captivate me mentally and emotionally.",
              behavioralIndicator: "Sanatsal yaratıcılığa açık olma",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        },
        {
          blueprint: {
            domainId: "core_personality",
            constructId: "hexaco_openness",
            facetId: "inquisitiveness",
            nameTr: "Zihinsel Merak ve Araştırmacılık",
            nameEn: "Inquisitiveness",
            scientificDefinitionTr: "Doğa bilimleri, felsefe, sosyal olgular ve dünyanın işleyişine dair derin bir öğrenme tutkusu ve zihinsel merak duyma eğilimi.",
            inclusionCriteria: ["Bilimsel/felsefi merak", "Yeni bilgiler öğrenme isteği", "Dünyayı anlama arzusu"],
            exclusionCriteria: ["Boş magazin merakı", "Gereksiz dedikodu"],
            adjacentConstructs: ["need_for_cognition", "joyous_exploration_curiosity", "creativity"],
            discriminantRisks: ["Zihinsel/entelektüel merakı kişilerarası dedikodu merakından ayırmak"],
            referenceInstruments: ["IPIP-HEXACO Inquisitiveness Scale", "HEXACO-PI-R"],
            primarySourceIds: ["src_lee_ashton_2004", "src_ashton_lee_2007"],
            secondarySourceIds: ["src_goldberg_1999_ipip"],
            turkishEvidenceSourceIds: ["src_wasti_2008_lexical"],
            behavioralIndicators: {
              cognitiveIndicators: ["Öğrenmenin hayat boyu süren bir zevk olduğuna inanma"],
              emotionalIndicators: ["Yeni bir bilimsel gerçek veya fikir keşfettiğinde heyecanlanma"],
              motivationalIndicators: ["Farklı alanlarda kitap ve belgesel takip etme isteği"],
              interpersonalIndicators: ["Derin entelektüel sohbetler kurma"],
              behavioralIndicatorsDetailed: [
                "Evrenin, doğanın veya toplumların nasıl işlediğini araştırmayı sever",
                "Tarih, bilim veya felsefe konularında yeni bilgiler öğrenmekten zevk alır",
                "Sadece işine yarayacak bilgileri değil, saf merakla yeni konuları inceler",
                "Karşılaştığı ilginç bir olgunun arka planını sorgular"
              ]
            },
            relevantContexts: ["everyday_life", "work_task", "decisions"],
            undesiredItemPatterns: ["Her şeyi bilirim gibi bilgiçlik taslayan ifadeler"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 1,
            measurementRationale: "Entelektüel merak, bilimsel ilgi ve dünyayı anlama arzusunu ölçer."
          },
          items: [
            {
              itemId: "psi_op_inq_01",
              promptTr: "Dünyanın, doğanın veya evrenin nasıl işlediğine dair bilimsel açıklamaları okumaktan büyük zevk alırım.",
              promptEn: "I take great pleasure in reading scientific explanations about how the world, nature, or the universe works.",
              behavioralIndicator: "Bilimsel ve doğal süreçleri araştırma zevki",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_op_inq_02",
              promptTr: "Tarih, felsefe veya bilim gibi teorik konular bana karmaşık ve lüzumsuz gelir.",
              promptEn: "Theoretical subjects like history, philosophy, or science seem complicated and unnecessary to me.",
              behavioralIndicator: "Entelektüel konulara ilgisizlik (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_op_inq_03",
              promptTr: "Gündelik hayatımda doğrudan işime yaramayacak olsa bile yeni bilgiler öğrenmek beni heyecanlandırır.",
              promptEn: "Learning new information excites me even if it will not be directly useful in my daily life.",
              behavioralIndicator: "Saf öğrenme heyecanı",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_op_inq_04",
              promptTr: "Karşılaştığım karmaşık bir problemin kökenini ve nedenlerini merak edip araştırırım.",
              promptEn: "I wonder about and investigate the root causes of a complex problem I encounter.",
              behavioralIndicator: "Problemlerin kökenini sorgulama",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_op_inq_05",
              promptTr: "Farklı kültürlerin ve düşünce sistemlerinin dünyayı nasıl yorumladığını öğrenmekten hoşlanırım.",
              promptEn: "I enjoy learning how different cultures and thought systems interpret the world.",
              behavioralIndicator: "Farklı düşünce sistemlerini keşfetme",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        },
        {
          blueprint: {
            domainId: "core_personality",
            constructId: "hexaco_openness",
            facetId: "creativity",
            nameTr: "Yaratıcılık ve Özgün Fikir Üretimi",
            nameEn: "Creativity",
            scientificDefinitionTr: "Olaylara alışılmışın dışında bakabilme, yeni ve özgün çözümler üretebilme; zihinsel imgelemi ve yaratıcı ifadeyi kullanma eğilimi.",
            inclusionCriteria: ["Özgün problem çözme", "Yaratıcı fikir üretimi", "Zengin hayal gücü"],
            exclusionCriteria: ["Uygulanamaz saçmalık", "Sanrısal düşünceler"],
            adjacentConstructs: ["creative_self_efficacy", "unconventionality", "aesthetic_appreciation"],
            discriminantRisks: ["Yaratıcı düşünceyi psikotik karmaşadan ayrıştırmak"],
            referenceInstruments: ["IPIP-HEXACO Creativity Scale", "HEXACO-PI-R"],
            primarySourceIds: ["src_lee_ashton_2004", "src_ashton_lee_2007"],
            secondarySourceIds: ["src_goldberg_1999_ipip"],
            turkishEvidenceSourceIds: ["src_wasti_2008_lexical"],
            behavioralIndicators: {
              cognitiveIndicators: ["Sorunlara standart dışı yeni yollar bulma inancı"],
              emotionalIndicators: ["Yeni bir fikir ürettiğinde zihinsel coşku duyma"],
              motivationalIndicators: ["Kendi özgün damgasını vurma arzusu"],
              interpersonalIndicators: ["Grup beyin fırtınalarında yaratıcı fikirler sunma"],
              behavioralIndicatorsDetailed: [
                "Sorunlara herkesin aklına gelmeyen farklı açılardan yaklaşır",
                "Zengin bir hayal gücüne ve yenilikçi fikir üretme kapasitesine sahiptir",
                "Klasik çözümler yerine denenmemiş özgün yöntemleri dener",
                "Farklı fikirleri birleştirerek yaratıcı sentezler oluşturur"
              ]
            },
            relevantContexts: ["work_task", "everyday_life", "personal_goals"],
            undesiredItemPatterns: ["Ben bir dahiyim gibi büyüklenmeci iddialar"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 1,
            measurementRationale: "Özgün düşünme, yenilikçi problem çözme ve hayal gücü kapasitesini ölçer."
          },
          items: [
            {
              itemId: "psi_op_cre_01",
              promptTr: "Bir problemle karşılaştığımda alışılagelmiş yollar yerine özgün ve yeni çözümler üretmeyi severim.",
              promptEn: "When facing a problem, I like to generate original and novel solutions rather than conventional ways.",
              behavioralIndicator: "Özgün çözüm üretme",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_op_cre_02",
              promptTr: "Hayal gücüm oldukça sınırlıdır ve yenilikçi fikirler bulmakta çok zorlanırım.",
              promptEn: "My imagination is quite limited and I struggle a lot to come up with innovative ideas.",
              behavioralIndicator: "Düşük hayal gücü ve yaratıcılık (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_op_cre_03",
              promptTr: "Farklı ve birbiriyle alakasız görünen kavramları birleştirerek yeni fikirler geliştirebilirim.",
              promptEn: "I can develop new ideas by combining concepts that seem different and unrelated.",
              behavioralIndicator: "Kavramsal sentez ve yaratıcı bağlantı kurma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_op_cre_04",
              promptTr: "Günlük hayatımda veya işimde yaratıcı yöntemler denemek bana heyecan verir.",
              promptEn: "Trying creative methods in my daily life or work excites me.",
              behavioralIndicator: "Yaratıcı yöntemleri deneme hevesi",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_op_cre_05",
              promptTr: "İnsanların olaylara baktığı klasik kalıpların dışına çıkıp farklı pencereler açabilirim.",
              promptEn: "I can step outside the classical molds through which people view events and open different perspectives.",
              behavioralIndicator: "Kalıpların dışına çıkabilme",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        },
        {
          blueprint: {
            domainId: "core_personality",
            constructId: "hexaco_openness",
            facetId: "unconventionality",
            nameTr: "Sıradışılık ve Yeniliğe Açıklık",
            nameEn: "Unconventionality",
            scientificDefinitionTr: "Toplumun yerleşik geleneksel kalıplarına körü körüne uymama; sıra dışı, marjinal ve farklı yaşam tarzlarına ve fikirlere hoşgörüyle yaklaşma eğilimi.",
            inclusionCriteria: ["Geleneksel kalıpların dışına çıkma", "Farklılıklara hoşgörü", "Alışılmadık deneyimlere açıklık"],
            exclusionCriteria: ["Sırf marjinal görünmek için yapılan anlamsız isyan", "Antisosyal kuralsızlık"],
            adjacentConstructs: ["schwartz_openness_to_change", "creativity", "inquisitiveness"],
            discriminantRisks: ["Sıradışılığı antisosyal norm ihlallerinden ayrıştırmak"],
            referenceInstruments: ["IPIP-HEXACO Unconventionality Scale", "HEXACO-PI-R"],
            primarySourceIds: ["src_lee_ashton_2004", "src_ashton_lee_2007"],
            secondarySourceIds: ["src_goldberg_1999_ipip"],
            turkishEvidenceSourceIds: ["src_wasti_2008_lexical"],
            behavioralIndicators: {
              cognitiveIndicators: ["Geleneklerin mutlak değişmez doğrular olmadığını bilme"],
              emotionalIndicators: ["Farklı ve sıra dışı durumlar karşısında merak ve kabul"],
              motivationalIndicators: ["Kendi özgün yaşam yolunu çizme isteği"],
              interpersonalIndicators: ["Toplumdan farklı yaşayan insanlara ön yargısız yaklaşma"],
              behavioralIndicatorsDetailed: [
                "Toplumsal çoğunluğun kalıplaşmış tabularına sorgulamadan uymaz",
                "Alışılagelmişin dışındaki sıra dışı fikirleri hemen reddetmek yerine anlamaya çalışır",
                "Kendi tercihlerinde başkalarının ne düşündüğünden çok kendi doğrusunu izler",
                "Farklı yaşam tarzlarına karşı açık fikirli ve hoşgörülüdür"
              ]
            },
            relevantContexts: ["everyday_life", "social_settings", "personal_goals"],
            undesiredItemPatterns: ["Bütün geleneklerden nefret ederim gibi saldırgan ifadeler"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Geleneksel sosyal normlara eleştirel yaklaşabilme ve sıra dışı fikirlere açık olma düzeyini ölçer."
          },
          items: [
            {
              itemId: "psi_op_unc_01",
              promptTr: "Alışılmışın dışındaki sıra dışı fikirleri hemen reddetmek yerine ilgiyle dinlemeyi tercih ederim.",
              promptEn: "Instead of immediately rejecting unconventional ideas, I prefer to listen with interest.",
              behavioralIndicator: "Sıra dışı fikirlere ön yargısız yaklaşım",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_op_unc_02",
              promptTr: "Toplumun belirlediği geleneksel kuralların dışına çıkmayı kesinlikle doğru bulmam.",
              promptEn: "I definitely do not consider it right to go outside the traditional rules set by society.",
              behavioralIndicator: "Katı gelenekçilik ve norm bağlılığı (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_op_unc_03",
              promptTr: "Çoğunluğun benimsediği yaşam tarzından farklı seçimler yapan insanlara saygı ve merakla yaklaşırım.",
              promptEn: "I approach people who make choices different from the lifestyle adopted by the majority with respect and curiosity.",
              behavioralIndicator: "Farklı yaşam tarzlarına hoşgörü",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_op_unc_04",
              promptTr: "Her zaman çoğunluğun gittiği güvenli yolları izler, sıra dışı tercihlerden uzak dururum.",
              promptEn: "I always follow the safe paths that the majority takes and stay away from unconventional choices.",
              behavioralIndicator: "Konformizm / sıradışılıktan kaçınma (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_op_unc_05",
              promptTr: "Kendi kararlarımda başkalarının beklentilerinden ziyade kendi özgün bakış açımı temel alırım.",
              promptEn: "In my decisions, I base things on my own original perspective rather than others' expectations.",
              behavioralIndicator: "Özgün bağımsız duruş",
              direction: "POSITIVE",
              reverseKeyed: false
            }
          ]
        }
      ]
    }
  ]
};

module.exports = { DOMAIN_1_PART2 };
