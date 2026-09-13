// BATCH B: SELF-SYSTEM & IDENTITY (7 Facets)
// 10 candidate items per facet = 70 items

const DEFAULT_TRANSLATION_PROVENANCE = {
  originalLanguage: "tr",
  translationMethod: "DIRECT_NATIVE_TURKISH_AUTHORING",
  translatorType: "SCIENTIFIC_RESEARCH_TEAM",
  backTranslationStatus: "PENDING_PILOT_VERIFICATION",
  culturalReviewStatus: "COMPLETED_INTERNAL_REVIEW"
};

const LIKERT_6_AGREEMENT = {
  scaleId: "scale_likert_6_agreement",
  min: 1,
  max: 6,
  step: 1,
  labels_tr: ["Kesinlikle Katılmıyorum", "Katılmıyorum", "Biraz Katılmıyorum", "Biraz Katılıyorum", "Katılıyorum", "Kesinlikle Katılıyorum"],
  labels_en: ["Strongly Disagree", "Disagree", "Slightly Disagree", "Slightly Agree", "Agree", "Strongly Agree"]
};

const LIKERT_6_FREQUENCY = {
  scaleId: "scale_likert_6_frequency",
  min: 1,
  max: 6,
  step: 1,
  labels_tr: ["Hiçbir Zaman", "Çok Nadir", "Bazen", "Sık Sık", "Çoğu Zaman", "Her Zaman"],
  labels_en: ["Never", "Very Rarely", "Sometimes", "Often", "Most of the Time", "Always"]
};

function createItem(props) {
  return {
    id: props.id,
    domainId: "self_system",
    constructId: props.constructId,
    facetId: props.facetId,
    primaryFacet: props.facetId,
    possibleCrossLoadings: props.possibleCrossLoadings || [],
    itemType: props.itemType || "likert",
    text_tr: props.text_tr,
    text_en: props.text_en || "",
    responseScale: props.responseScale || LIKERT_6_AGREEMENT,
    keying: props.keying || "POSITIVE",
    reverseWorded: props.keying === "NEGATIVE",
    context: props.context || "general",
    measurementPurpose: props.measurementPurpose || "trait_level",
    observableIndicatorId: props.observableIndicatorId || `${props.facetId}_ind_1`,
    sourceType: props.sourceType || "ORIGINAL_AI_ASSISTED_RESEARCH_DRAFT",
    sourceIds: props.sourceIds || ["src_rosenberg_1965"],
    instrumentIds: props.instrumentIds || ["inst_rses"],
    licenseStatus: "APPROVED_PUBLIC",
    validationStatus: "RESEARCH_DRAFT",
    candidateStatus: "INTERNAL_REVIEW",
    socialDesirabilitySensitivity: props.socialDesirabilitySensitivity || "moderate",
    acquiescenceRisk: props.acquiescenceRisk || "low",
    readingDifficulty: props.readingDifficulty || "easy",
    estimatedCompletionSeconds: props.estimatedCompletionSeconds || 7,
    semanticCluster: props.semanticCluster || `${props.facetId}_cluster`,
    pairedItemId: props.pairedItemId || null,
    forcedChoiceBlock: props.forcedChoiceBlock || null,
    situationalScenarios: props.situationalScenarios || null,
    translationProvenance: DEFAULT_TRANSLATION_PROVENANCE,
    version: "1.0.0-draft"
  };
}

const items = [];

function addFacetItems(facetDef) {
  facetDef.items.forEach((it, idx) => {
    const num = String(idx + 1).padStart(3, '0');
    const id = `${facetDef.prefix}-${num}`;
    items.push(createItem({
      id,
      constructId: facetDef.constructId,
      facetId: facetDef.facetId,
      ...it
    }));
  });
}

// 1. CORE SELF-ESTEEM
addFacetItems({
  prefix: "SS-SE-RSE",
  constructId: "self_evaluation",
  facetId: "core_self_esteem",
  items: [
    { text_tr: "Kendimi en az diğer insanlar kadar değerli bir birey olarak görürüm.", text_en: "I feel that I have a number of good qualities, on par with others.", keying: "POSITIVE" },
    { text_tr: "Zaman zaman kendimi tamamen başarısız ve yetersiz hissederim.", text_en: "All in all, I am inclined to feel that I am a failure.", keying: "NEGATIVE" },
    { text_tr: "Kişiliğimin güçlü yönlerinden genel olarak memnunumdur.", text_en: "I take a positive attitude toward myself.", keying: "POSITIVE" },
    { text_tr: "Kendimle gurur duyacak pek bir şey bulamam.", text_en: "I feel I do not have much to be proud of.", keying: "NEGATIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Kendime karşı genel olarak olumlu bir tutum beslerim.", text_en: "On the whole, I am satisfied with myself.", keying: "POSITIVE" },
    { text_tr: "Kendimi işe yaramaz hissettiğim dönemler olur.", text_en: "At times I think I am no good at all.", keying: "NEGATIVE" },
    { text_tr: "Başkalarıyla eşit hak ve değere sahip olduğumun bilincindeyim.", text_en: "I am aware that I have equal worth and rights compared to others.", keying: "POSITIVE" },
    { text_tr: "Keşke kendime daha fazla saygı duyabilseydim.", text_en: "I wish I could have more respect for myself.", keying: "NEGATIVE" },
    { text_tr: "İş ortamında kendi katkımın değerine güvenirim.", text_en: "In the workplace, I trust the value of my contributions.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Sosyal gruplarda diğer insanların benden daha değerli olduğunu düşünürüm.", text_en: "In social groups, I assume others are more worthy than me.", keying: "NEGATIVE", itemType: "contextual", context: "social" }
  ]
});

// 2. CONTINGENT SELF-WORTH
addFacetItems({
  prefix: "SS-SE-CSW",
  constructId: "self_evaluation",
  facetId: "contingent_self_worth",
  items: [
    { text_tr: "Kendime olan saygım başarılarıma veya başarısızlıklarıma göre aşırı dalgalanır.", text_en: "My self-esteem fluctuates heavily based on my successes or failures.", keying: "POSITIVE" },
    { text_tr: "Bir işte başarısız olsam bile temel özdeğerimi korurum.", text_en: "Even if I fail at a task, I preserve my baseline sense of worth.", keying: "NEGATIVE" },
    { text_tr: "Başkalarının beni onaylaması kendimi iyi hissetmemin ana şartıdır.", text_en: "Others' approval is the primary prerequisite for me to feel good.", keying: "POSITIVE" },
    { text_tr: "Girdiğim bir sınav veya değerlendirme kötü geçerse kendimi değersiz sayarım.", text_en: "If an evaluation goes poorly, I write myself off as worthless.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Dış onay almasam da kendi kıymetimi bilirim.", text_en: "I know my worth even without receiving external validation.", keying: "NEGATIVE" },
    { text_tr: "Yakınlarımın ufak bir eleştirisi bile özsaygımı zedeler.", text_en: "Even slight criticism from close ones damages my self-esteem.", keying: "POSITIVE" },
    { text_tr: "Maddi kazanımlarım veya statüm düştüğünde kendimi yok hükmünde görürüm.", text_en: "If my earnings or status drop, I perceive myself as void.", keying: "POSITIVE" },
    { text_tr: "Hata yaptığımda bu durum kişisel değerimi düşürmez.", text_en: "Making a mistake does not diminish my personal worth.", keying: "NEGATIVE" },
    { text_tr: "İş yerinde terfi alamadığımda kendimi bütünüyle yetersiz hissederim.", text_en: "At work, missing a promotion makes me feel thoroughly inadequate.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "İlişkim bittiğinde kendi değerimden şüphe etmeye başlarım.", text_en: "When a relationship ends, I begin doubting my inherent worth.", keying: "POSITIVE", itemType: "contextual", context: "relationship" }
  ]
});

// 3. SELF-COMPASSION
addFacetItems({
  prefix: "SS-SE-SCP",
  constructId: "self_evaluation",
  facetId: "self_compassion",
  items: [
    { text_tr: "Hata yaptığımda kendime karşı anlayışlı ve şefkatli yaklaşırım.", text_en: "When I make a mistake, I am understanding and gentle toward myself.", keying: "POSITIVE" },
    { text_tr: "İşler ters gittiğinde kendimi acımasızca suçlarım ve hırpalarım.", text_en: "When things go wrong, I blame and berate myself harshly.", keying: "NEGATIVE" },
    { text_tr: "Zor zamanlardan geçerken kendime bir dost gibi destek olurum.", text_en: "During hard times, I support myself like a good friend would.", keying: "POSITIVE" },
    { text_tr: "Kusurlarım karşısında aşırı öfkeli ve sabırsız olurum.", text_en: "I am impatient and angry with my own flaws.", keying: "NEGATIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Acı çekmenin ve hata yapmanın insan olmanın doğal bir parçası olduğunu bilirim.", text_en: "I recognize that suffering and flaw are part of the shared human condition.", keying: "POSITIVE" },
    { text_tr: "Bir aksilik yaşadığımda sanki sadece benim başıma geliyormuş gibi yalnız hissederim.", text_en: "When facing a setback, I feel as though only I suffer this way.", keying: "NEGATIVE" },
    { text_tr: "Duygusal acı çektiğimde kendime gereken zamanı ve şefkati tanırım.", text_en: "When in pain, I give myself the needed time and compassion.", keying: "POSITIVE" },
    { text_tr: "Beklentilerimi karşılayamadığımda kendime duyduğum saygıyı kaybederim.", text_en: "When falling short of expectations, I lose respect for myself.", keying: "NEGATIVE" },
    { text_tr: "İş yerinde bir projede aksama olduğunda kendimi aşırı yıpratmam.", text_en: "At work, if a project stumbles, I do not excessively tear myself down.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Kişisel bir ilişkimde hata yaptığımda telafi etmeye odaklanırım.", text_en: "When I err in a relationship, I focus on amends without self-hatred.", keying: "POSITIVE", itemType: "contextual", context: "relationship" }
  ]
});

// 4. GENERALIZED SELF-EFFICACY
addFacetItems({
  prefix: "SS-AM-GSE",
  constructId: "agency_mastery",
  facetId: "generalized_self_efficacy",
  items: [
    { text_tr: "Beklenmedik zorluklarla karşılaştığımda bir çözüm yolu bulacağıma güvenirim.", text_en: "I can always manage to solve difficult problems if I try hard enough.", keying: "POSITIVE" },
    { text_tr: "Yeni ve karmaşık durumlar karşısında kolayca çaresiz kalırım.", text_en: "I easily feel helpless when facing novel and complex situations.", keying: "NEGATIVE" },
    { text_tr: "Yeterince emek verirsem zor hedeflere ulaşabileceğime inanırım.", text_en: "It is easy for me to stick to my aims and accomplish my goals.", keying: "POSITIVE" },
    { text_tr: "Beklenmeyen aksilikler planlarımı rayından çıkarmaya yeter.", text_en: "Unexpected events easily derail my determination.", keying: "NEGATIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Baskı altındayken kaynaklarımı ve yeteneklerimi etkin kullanabilirim.", text_en: "I can remain calm when facing difficulties relying on my coping abilities.", keying: "POSITIVE" },
    { text_tr: "Bilinmeyen bir problemle karşılaştığımda nasıl başa çıkacağımı bilemem.", text_en: "When faced with an unknown issue, I rarely know what to do.", keying: "NEGATIVE" },
    { text_tr: "Kendi yeteneklerime duyduğum güven sayesinde engelleri aşarım.", text_en: "Thanks to my resourcefulness, I overcome obstacles.", keying: "POSITIVE" },
    { text_tr: "Çözüm bulmakta diğer insanlara kıyasla yetersiz kalırım.", text_en: "I fall short compared to others in finding pragmatic solutions.", keying: "NEGATIVE" },
    { text_tr: "İş hayatında zorlu bir görev verildiğinde üstesinden geleceğime inanırım.", text_en: "At work, when handed a daunting task, I trust I will master it.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Kişisel hedeflerimde ilk engelde pes etmeye meylederim.", text_en: "On personal goals, I tend to give up at the first hurdle.", keying: "NEGATIVE", itemType: "contextual", context: "decision" }
  ]
});

// 5. LOCUS OF CONTROL
addFacetItems({
  prefix: "SS-AM-LOC",
  constructId: "agency_mastery",
  facetId: "locus_of_control",
  items: [
    { text_tr: "Hayatımın yönünü büyük ölçüde kendi kararlarım ve çabam belirler.", text_en: "My decisions and efforts largely steer the direction of my life.", keying: "POSITIVE" },
    { text_tr: "Başıma gelenlerin çoğunu şans, kader veya dış faktörler belirler.", text_en: "What happens to me is mostly determined by luck, fate, or external forces.", keying: "NEGATIVE" },
    { text_tr: "Başarılarım rastlantı değil, gösterdiğim emeğin doğrudan sonucudur.", text_en: "My successes are direct results of my dedication, not coincidence.", keying: "POSITIVE" },
    { text_tr: "Koşulları değiştirmeye çalışmanın pek bir faydası olmadığına inanırım.", text_en: "I believe trying to change circumstances is mostly futile.", keying: "NEGATIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Geleceğimi şekillendirme gücünü kendi ellerimde hissederim.", text_en: "I feel the power to shape my future resides in my hands.", keying: "POSITIVE" },
    { text_tr: "Hayatımı güçlü insanların ve tesadüflerin yönettiğini düşünürüm.", text_en: "I think powerful individuals and coincidences run my life.", keying: "NEGATIVE" },
    { text_tr: "Karşılaştığım sorunlarda suçu dış etkenlere atmak yerine sorumluluk alırım.", text_en: "I take ownership of problems rather than shifting blame to circumstances.", keying: "POSITIVE" },
    { text_tr: "Ne kadar uğraşırsam uğraşayım sonuçların değişmeyeceğine inanırım.", text_en: "I feel no matter how hard I strive, outcomes remain fixed.", keying: "NEGATIVE" },
    { text_tr: "Kariyerimdeki ilerlemeyi kendi stratejilerimin ürünü olarak görürüm.", text_en: "I view my career advancement as the fruit of my own strategies.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "İlişkilerimdeki sorunları tamamen karşı tarafın kusuru olarak değerlendiririm.", text_en: "I attribute relational troubles entirely to the other party's fault.", keying: "NEGATIVE", itemType: "contextual", context: "relationship" }
  ]
});

// 6. SELF-CONCEPT CLARITY
addFacetItems({
  prefix: "SS-II-SCC",
  constructId: "identity_integrity",
  facetId: "self_concept_clarity",
  items: [
    { text_tr: "Kim olduğum, neye inandığım ve ne istediğim konusunda net bir fikrim vardır.", text_en: "I have a clear sense of who I am, what I believe, and what I want.", keying: "POSITIVE" },
    { text_tr: "Kendim hakkındaki inançlarım ve hislerim günden güne çok değişir.", text_en: "My beliefs and feelings about myself change drastically day to day.", keying: "NEGATIVE" },
    { text_tr: "Farklı ortamlarda bulunsam bile benliğimin özünü tutarlı hissederim.", text_en: "Even across different settings, I feel the core of myself is consistent.", keying: "POSITIVE" },
    { text_tr: "Bazen aynaya baktığımda kendime tamamen yabancılaşırım.", text_en: "Sometimes looking in the mirror, I feel completely alienated from myself.", keying: "NEGATIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Değerlerimin ve amaçlarımın ne olduğu konusunda içsel bir şüphem yoktur.", text_en: "I have no internal doubt about what my core values and aims are.", keying: "POSITIVE" },
    { text_tr: "Kim olduğumu tarif etmekte zorlanır, çelişkili hisler yaşarım.", text_en: "I struggle to describe who I am and experience contradictory feelings.", keying: "NEGATIVE" },
    { text_tr: "Geleceğe baktığımda benliğimin istikrarlı bir şekilde geliştiğini görürüm.", text_en: "Looking to the future, I see my identity developing stably.", keying: "POSITIVE" },
    { text_tr: "Başkalarının yanındayken gerçek kimliğimin ne olduğunu unuturum.", text_en: "Around others, I lose touch with what my real identity is.", keying: "NEGATIVE" },
    { text_tr: "İş tercihlerimi yaparken kişisel değerlerimle tam bir uyum ararım.", text_en: "In career choices, I seek thorough harmony with my self-knowledge.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Arkadaş grubum değiştikçe fikirlerim ve kişiliğim kökten başkalaşır.", text_en: "As my peer group shifts, my opinions and personality metamorphose.", keying: "NEGATIVE", itemType: "contextual", context: "social" }
  ]
});

// 7. AUTHENTICITY
addFacetItems({
  prefix: "SS-II-AUT",
  constructId: "identity_integrity",
  facetId: "authenticity",
  items: [
    { text_tr: "Davranışlarım ve sözlerim gerçek içsel duygularımı ve inançlarımı yansıtır.", text_en: "My actions and words reflect my true internal emotions and convictions.", keying: "POSITIVE" },
    { text_tr: "Toplumsal kabul görmek için inanmadığım bir kişiliği takınırım.", text_en: "I put on a persona I don't believe in just to gain social acceptance.", keying: "NEGATIVE" },
    { text_tr: "Başkalarının baskısı altında dahi kendi doğrularımdan ödün vermem.", text_en: "Even under others' pressure, I do not compromise my personal truths.", keying: "POSITIVE" },
    { text_tr: "Beğenilmek uğruna kendimi rol yaparken bulurum.", text_en: "For the sake of being liked, I catch myself acting out a role.", keying: "NEGATIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "İçimden geldiği gibi doğal ve dürüst yaşamayı seçerim.", text_en: "I choose to live naturally and honestly as I feel inside.", keying: "POSITIVE" },
    { text_tr: "Çevremdekilerin benden beklediği kalıplara sığmak için kendimi gizlerim.", text_en: "I hide myself to squeeze into moulds expected by those around me.", keying: "NEGATIVE" },
    { text_tr: "Kendi kusurlarımı ve zayıflıklarımı dürüstçe kabul edebilirim.", text_en: "I can honestly accept my own imperfections and vulnerabilities.", keying: "POSITIVE" },
    { text_tr: "Çıkar sağlamak için değerlerimle çelişen tavırlar sergilerim.", text_en: "I display stances conflicting with my values to secure benefits.", keying: "NEGATIVE" },
    { text_tr: "İş yerinde mesleki rolümle öz değerlerimi dengede tutabilirim.", text_en: "At work, I balance my professional role with my authentic values.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "İkili ilişkilerimde sevilmek için kendimi olmadığım biri gibi gösteririm.", text_en: "In romantic ties, I portray myself as someone I am not to be loved.", keying: "NEGATIVE", itemType: "contextual", context: "relationship" }
  ]
});

module.exports = {
  batchName: "BATCH_B_SELF_SYSTEM",
  items
};
