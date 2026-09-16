/**
 * DOMAIN 8: WELLBEING, FLOURISHING & VITALITY — 1 CONSTRUCT, 3 FACETS (15 ITEMS)
 * Complete blueprints and original items.
 */

const DOMAIN_8_DATA = {
  domainId: "wellbeing_vitality",
  domainNameTr: "İyilik Hali, Gelişme ve Yaşam Canlılığı",
  domainNameEn: "Wellbeing, Flourishing & Vitality",
  constructs: [
    // 1. Subjective Wellbeing & Flourishing
    {
      constructId: "subjective_wellbeing",
      facets: [
        {
          blueprint: {
            domainId: "wellbeing_vitality",
            constructId: "subjective_wellbeing",
            facetId: "flourishing_scale",
            nameTr: "Psikolojik Gelişme ve Çiçeklenme (Flourishing)",
            nameEn: "Psychological Flourishing",
            scientificDefinitionTr: "Bireyin psikolojik, sosyal ve ilişkisel alanlarda kendini yetkin, amaç sahibi, olumlu katkı sunan ve genel olarak gelişen bir insan olarak algılaması.",
            inclusionCriteria: ["Anlam ve amaç hissi", "Kişisel gelişim algısı", "Sosyal katkı ve yetkinlik"],
            exclusionCriteria: ["Geçici haz/hedonik mutluluk", "Mani"],
            adjacentConstructs: ["satisfaction_with_life", "subjective_vitality", "meaning_making"],
            discriminantRisks: ["Ödomonik gelişmeyi (eudaimonic flourishing) anlık keyiften ayırmak"],
            referenceInstruments: ["Flourishing Scale (FS - Diener et al.)"],
            primarySourceIds: ["src_diener_2010_flourishing"],
            secondarySourceIds: ["src_diener_1985_swls"],
            turkishEvidenceSourceIds: ["src_telefoncu_2016_flourishing_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Hayatının bir amacı ve anlamı olduğuna inanma", "Önemli alanlarda yetkin hissetme"],
              emotionalIndicators: ["Hayatına dair genel bir doyum ve içsel zenginlik hissi"],
              motivationalIndicators: ["Gelişmeye, öğrenmeye ve topluma katkı sağlamaya yönelme"],
              interpersonalIndicators: ["İlişkilerinde destekleyici ve yapıcı bir rol üstlenme"],
              behavioralIndicatorsDetailed: [
                "Yaşamında anlamlı bir amaç doğrultusunda ilerlediğini hisseder",
                "Önemli aktivitelerinde kendisini yetkin ve başarılı görür",
                "İnsanların hayatına olumlu katkıda bulunduğuna inanır",
                "Kendisini her geçen gün geliştiren ve öğrenen biri olarak tanımlar"
              ]
            },
            relevantContexts: ["everyday_life", "work_task", "relationships"],
            undesiredItemPatterns: ["Her zaman mükemmelim gibi narsistik abartılar"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Ödomonik iyi oluş kuramına dayalı genel psikolojik çiçeklenmeyi ölçer."
          },
          items: [
            {
              itemId: "psi_wv_flr_01",
              promptTr: "Hayatımı anlamlı, amaç dolu ve değerlerime uygun bir şekilde yaşadığımı hissederim.",
              promptEn: "I feel that I lead a purposeful, meaningful life in line with my values.",
              behavioralIndicator: "Amaç ve anlam dolu yaşam hissi",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_wv_flr_02",
              promptTr: "Yaşamımın bir amacı olmadığını ve günlerimin boşa geçtiğini düşünürüm.",
              promptEn: "I feel that my life has no clear purpose and that my days are passing in vain.",
              behavioralIndicator: "Amaçsızlık ve anlamsızlık algısı (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_wv_flr_03",
              promptTr: "Günlük aktivitelerimde ve üstlendiğim görevlerde kendimi yetkin ve etkili hissederim.",
              promptEn: "I feel competent and capable in the activities and tasks that are important to me.",
              behavioralIndicator: "Yetkinlik ve etkililik algısı",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_wv_flr_04",
              promptTr: "Çevremdeki insanların hayatına olumlu bir katkı sağladığımı ve faydalı bir insan olduğumu bilirim.",
              promptEn: "I know that I contribute positively to the lives of people around me and make a helpful difference.",
              behavioralIndicator: "Topluma ve başkalarına faydalı olma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_wv_flr_05",
              promptTr: "Kendimi uzun süredir yerinde sayan ve hiçbir alanda gelişmeyen biri gibi hissederim.",
              promptEn: "I feel stuck in place for a long time, not growing or developing in any area of my life.",
              behavioralIndicator: "Gelişememe ve durağanlık hissi (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            }
          ]
        },
        {
          blueprint: {
            domainId: "wellbeing_vitality",
            constructId: "subjective_wellbeing",
            facetId: "subjective_vitality",
            nameTr: "Öznel Canlılık ve Enerji",
            nameEn: "Subjective Vitality",
            scientificDefinitionTr: "Bireyin kendisini zihinsel ve bedensel olarak canlı, enerjik, coşkulu ve yaşam dolu hissetme deneyimi.",
            inclusionCriteria: ["Fiziksel ve zihinsel enerji", "Yaşam coşkusu", "Dinamizm"],
            exclusionCriteria: ["Hiperaktivite", "Kafein/madde uyarımı"],
            adjacentConstructs: ["liveliness", "flourishing_scale", "ego_resilience"],
            discriminantRisks: ["İçsel psikolojik canlılığı geçici uyarılmadan ayırmak"],
            referenceInstruments: ["Subjective Vitality Scale (SVS - Ryan & Frederick)"],
            primarySourceIds: ["src_ryan_frederick_1997_vitality"],
            secondarySourceIds: ["src_diener_2010_flourishing"],
            turkishEvidenceSourceIds: ["src_akin_2012_vitality_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Güne heyecanla ve istekle başlama düşüncesi"],
              emotionalIndicators: ["İçten gelen bir coşku ve tazelik hissi"],
              motivationalIndicators: ["Yeni aktivitelere girişmek için yüksek istek ve motivasyon"],
              interpersonalIndicators: ["Sosyal ortamlarda dinamik ve enerjik bir varlık gösterme"],
              behavioralIndicatorsDetailed: [
                "Kendisini genellikle zinde, enerjik ve yaşam dolu hisseder",
                "Sabahları yeni bir güne başlarken içinde bir heyecan ve şevk duyar",
                "Yorgunluğa kolay teslim olmaz, içinde güçlü bir canlılık barındırır",
                "Aktivitelerine büyük bir ilgi ve dinamizmle katılır"
              ]
            },
            relevantContexts: ["everyday_life", "work_task", "social_settings"],
            undesiredItemPatterns: ["Klinik hipomani veya uykusuzluk bildiren ifadeler"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Bireyin içsel yaşam enerjisini ve psikolojik zindeliğini ölçer."
          },
          items: [
            {
              itemId: "psi_wv_vit_01",
              promptTr: "Kendimi çoğu zaman enerji dolu, zinde ve yaşam sevinciyle dopdolu hissederim.",
              promptEn: "Most of the time, I feel full of energy, alert, and alive with the joy of living.",
              behavioralIndicator: "Enerji ve yaşam sevinci hissi",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_wv_vit_02",
              promptTr: "Genellikle kendimi tükenmiş, bitkin ve hiçbir şey yapmaya mecali kalmamış hissederim.",
              promptEn: "I usually feel depleted, exhausted, and lacking the stamina to do anything.",
              behavioralIndicator: "Tükenmişlik ve enerji düşüklüğü (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_wv_vit_03",
              promptTr: "Yeni bir güne başlarken içimde yapacağım işlere karşı bir heves ve canlılık duyarım.",
              promptEn: "When starting a new day, I feel enthusiasm and liveliness inside me for the things I will do.",
              behavioralIndicator: "Güne hevesle ve canlılıkla başlama",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_wv_vit_04",
              promptTr: "Bedenimde ve zihnimde beni ileriye taşıyan taze bir enerji ve güç hissederim.",
              promptEn: "I feel a fresh energy and strength in my body and mind propelling me forward.",
              behavioralIndicator: "Zihinsel ve bedensel tazelik",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_wv_vit_05",
              promptTr: "Günlük aktivitelerimi sürdürürken içimdeki enerjinin tamamen çekildiğini hissederim.",
              promptEn: "While going through daily activities, I feel as if all energy has been drained from within me.",
              behavioralIndicator: "İçsel enerjinin çekilmesi hissi (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            }
          ]
        },
        {
          blueprint: {
            domainId: "wellbeing_vitality",
            constructId: "subjective_wellbeing",
            facetId: "satisfaction_with_life",
            nameTr: "Yaşam Doyumu",
            nameEn: "Satisfaction with Life",
            scientificDefinitionTr: "Bireyin kendi belirlediği kriterler ve beklentiler çerçevesinde genel hayatını bütünsel olarak olumlu ve tatmin edici bulma derecesi.",
            inclusionCriteria: ["Bütünsel yaşam memnuniyeti", "Hayat şartlarından hoşnutluk", "Geçmişe dönük tatmin"],
            exclusionCriteria: ["Anlık neşe/zevk", "Kendini kandırma"],
            adjacentConstructs: ["flourishing_scale", "gratitude", "optimism"],
            discriminantRisks: ["Bilişsel yaşam doyumunu anlık duygusal dalgalanmalardan ayırmak"],
            referenceInstruments: ["Satisfaction with Life Scale (SWLS - Diener et al.)"],
            primarySourceIds: ["src_diener_1985_swls"],
            secondarySourceIds: ["src_diener_2010_flourishing"],
            turkishEvidenceSourceIds: ["src_koker_1991_swls_tr"],
            behavioralIndicators: {
              cognitiveIndicators: ["Hayatının genel seyrini kendi ideallerine yakın bulma"],
              emotionalIndicators: ["Hayatına baktığında duyduğu iç huzuru ve hoşnutluk"],
              motivationalIndicators: ["Mevcut yaşamını koruma ve daha da zenginleştirme isteği"],
              interpersonalIndicators: ["Hayatından şikayet etmek yerine memnuniyetini dile getirme"],
              behavioralIndicatorsDetailed: [
                "Genel olarak hayat şartlarından ve bulunduğu durumdan memnundur",
                "Hayatında şu ana kadar elde ettiklerinin ideallerine yakın olduğunu düşünür",
                "Geriye dönüp baktığında hayatını büyük oranda iyi ki böyle yaşamışım der",
                "Yaşamından genel bir hoşnutluk duyar ve büyük pişmanlıklar yaşamaz"
              ]
            },
            relevantContexts: ["everyday_life", "reflection"],
            undesiredItemPatterns: ["Her şey kusursuz gibi gerçek dışı ifadeler"],
            socialDesirabilityRisk: "LOW",
            clinicalRisk: "NONE",
            recommendedItemCount: 5,
            recommendedReverseItemCount: 2,
            measurementRationale: "Öznel iyi oluşun bilişsel-yargısal bileşeni olan genel yaşam doyumunu ölçer."
          },
          items: [
            {
              itemId: "psi_wv_swl_01",
              promptTr: "Genel olarak baktığımda hayatımın şartlarından ve yaşam standartlarımdan memnunumdur.",
              promptEn: "Taking everything into account, I am satisfied with the conditions of my life and my living standards.",
              behavioralIndicator: "Hayat şartlarından genel memnuniyet",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_wv_swl_02",
              promptTr: "Şu ana kadarki hayatımı düşündüğümde büyük bir hayal kırıklığı ve tatminsizlik hissederim.",
              promptEn: "When I reflect on my life so far, I feel a deep sense of disappointment and dissatisfaction.",
              behavioralIndicator: "Hayal kırıklığı ve tatminsizlik (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            },
            {
              itemId: "psi_wv_swl_03",
              promptTr: "Hayatımda benim için gerçekten önemli olan birçok şeye sahip olduğumu düşünürüm.",
              promptEn: "I feel that I have acquired the important things I want in life.",
              behavioralIndicator: "Önemli hedeflere ve kazanımlara sahip olma",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_wv_swl_04",
              promptTr: "Hayatımı baştan yaşama şansım olsaydı, hemen hemen hiçbir şeyi değiştirmek istemezdim.",
              promptEn: "If I could live my life over, I would change almost nothing.",
              behavioralIndicator: "Geçmişe yönelik yüksek doyum ve kabul",
              direction: "POSITIVE",
              reverseKeyed: false
            },
            {
              itemId: "psi_wv_swl_05",
              promptTr: "Mevcut yaşam tarzım ve gidişatım beklentilerimin çok altında kaldı.",
              promptEn: "My current lifestyle and life trajectory fell far short of my expectations.",
              behavioralIndicator: "Beklentilerin altında kalma ve hoşnutsuzluk (Ters)",
              direction: "NEGATIVE",
              reverseKeyed: true
            }
          ]
        }
      ]
    }
  ]
};

module.exports = DOMAIN_8_DATA;
