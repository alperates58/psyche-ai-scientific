// BATCH I: OPTIONAL RESEARCH MODULE — DARK TETRAD (4 Facets)
// 10 candidate items per facet = 40 items
// Strictly isolated from default forms; candidateStatus = 'RESEARCH_ONLY'; Non-diagnostic!

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
    domainId: "optional_dark_tetrad",
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
    measurementPurpose: "subclinical_research",
    observableIndicatorId: props.observableIndicatorId || `${props.facetId}_ind_1`,
    sourceType: "RESEARCH_ONLY",
    sourceIds: props.sourceIds || ["src_paulhus_2021_sd4"],
    instrumentIds: props.instrumentIds || ["inst_sd4"],
    licenseStatus: "RESEARCH_ONLY",
    validationStatus: "RESEARCH_DRAFT",
    candidateStatus: "RESEARCH_ONLY",
    isOptionalModule: true,
    socialDesirabilitySensitivity: "high",
    acquiescenceRisk: "low",
    readingDifficulty: "easy",
    estimatedCompletionSeconds: props.estimatedCompletionSeconds || 7,
    semanticCluster: props.semanticCluster || `${props.facetId}_cluster`,
    pairedItemId: null,
    forcedChoiceBlock: null,
    situationalScenarios: null,
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

// 1. MACHIAVELLIANISM (Strategic Pragmatism)
addFacetItems({
  prefix: "DT-TR-MAC",
  constructId: "dark_tetrad_traits",
  facetId: "machiavellianism",
  items: [
    { text_tr: "İnsanları yönlendirmek için zayıf yönlerini bilmek ve stratejik kullanmak gerekir.", text_en: "It is wise to know others' vulnerabilities and leverage them strategically.", keying: "POSITIVE" },
    { text_tr: "Kişisel çıkar uğruna başkalarını aldatmayı kesinlikle ahlak dışı bulurum.", text_en: "I consider deceiving others for personal gain strictly unethical.", keying: "NEGATIVE" },
    { text_tr: "Önemli hedeflere ulaşırken karşımdakine niyetimi hemen açık etmemek akıllıcadır.", text_en: "When chasing major targets, concealing true intentions is prudent.", keying: "POSITIVE" },
    { text_tr: "Güç kazanmak için bazen insanların duymak istediği şeyleri söylemek gerekir.", text_en: "Gaining leverage sometimes requires telling people what they want to hear.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "İlişkilerimde daima dürüst ve şeffaf kalmayı tercih ederim.", text_en: "I always prefer remaining genuine and transparent in relationships.", keying: "NEGATIVE" },
    { text_tr: "Çoğu insanın çıkarlarına göre hareket ettiğini bilerek gardımı alırım.", text_en: "Knowing most act out of self-interest, I keep my guard raised.", keying: "POSITIVE" },
    { text_tr: "Amaca ulaşmak için her yolu mubah sayan yaklaşımları reddederim.", text_en: "I reject stances believing the ends always justify any means.", keying: "NEGATIVE" },
    { text_tr: "Kritik durumlarda ipleri elime almak için perde arkasından yönlendirme yapabilirim.", text_en: "In critical pinches, I can orchestrate matters from behind the scenes.", keying: "POSITIVE" },
    { text_tr: "İş yerinde rakiplerimin adımlarını önceden hesaplayıp stratejik karşı hamleler yaparım.", text_en: "At work, I anticipate rivals' moves and launch strategic countermoves.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Müzakerelerde zayıflığımı asla belli etmemek için duygularımı gizlerim.", text_en: "In negotiations, I mask emotions to conceal any sign of weakness.", keying: "POSITIVE", itemType: "contextual", context: "work" }
  ]
});

// 2. GRANDIOSE NARCISSISM (Status Striving & Admiration Need)
addFacetItems({
  prefix: "DT-TR-NAR",
  constructId: "dark_tetrad_traits",
  facetId: "grandiose_narcissism",
  items: [
    { text_tr: "Girdiğim ortamlarda insanların dikkatini çekmek ve hayranlık uyandırmak isterim.", text_en: "In public venues, I desire to draw attention and command admiration.", keying: "POSITIVE" },
    { text_tr: "İlgi odağı olmaktan hoşlanmam, arka planda kalmayı tercih ederim.", text_en: "I dislike being center stage and prefer staying in the background.", keying: "NEGATIVE" },
    { text_tr: "Sıradan insanlardan daha büyük işler başarmak için doğduğumu hissederim.", text_en: "I feel born to achieve things grander than ordinary people.", keying: "POSITIVE" },
    { text_tr: "Başarılarımla övülmek ve alkışlanmak bana büyük bir haz verir.", text_en: "Being applauded and celebrated for triumphs grants me great thrill.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Kendimi kimseden üstün veya benzersiz bir konumda görmem.", text_en: "I do not position myself as superior or peerless compared to anyone.", keying: "NEGATIVE" },
    { text_tr: "Toplumda yüksek bir statüye ve nüfuza sahip olmayı hedeflerim.", text_en: "I target holding high social status and commanding influence.", keying: "POSITIVE" },
    { text_tr: "Bana yeterince hürmet gösterilmeyen ortamlardan rahatsızlık duyarım.", text_en: "I feel discomfort in venues where I am not accorded due deference.", keying: "POSITIVE" },
    { text_tr: "Özel bir muamele görmektense herkesle aynı şartlara tabi olmayı yeğlerim.", text_en: "I prefer equal treatment rather than being accorded special exemptions.", keying: "NEGATIVE" },
    { text_tr: "İş ortamında liderlik koltuğunun doğal olarak bana ait olduğunu düşünürüm.", text_en: "In the workplace, I feel the executive chair naturally belongs to me.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Sosyal medyada popülerliğimi ve görünürlüğümü artırmaya odaklanırım.", text_en: "On social media, I focus on boosting my prominence and visibility.", keying: "POSITIVE", itemType: "contextual", context: "social" }
  ]
});

// 3. SUBCLINICAL PSYCHOPATHY (Impulsive Tough-Mindedness & Low Empathy)
addFacetItems({
  prefix: "DT-TR-PSY",
  constructId: "dark_tetrad_traits",
  facetId: "subclinical_psychopathy",
  items: [
    { text_tr: "Başkalarının duygusal sızlanmalarına karşı sabırsız ve sert bir tutum takınırım.", text_en: "I adopt a blunt and impatient posture toward emotional whining.", keying: "POSITIVE" },
    { text_tr: "Birinin acı çektiğini gördüğümde içim sızlar ve hemen yardım etmek isterim.", text_en: "Seeing someone suffer, my heart aches and I seek to aid them immediately.", keying: "NEGATIVE" },
    { text_tr: "Tehlikeli ve yasak şeylerin verdiği adrenalin bana çekici gelir.", text_en: "The adrenaline rush from dangerous or forbidden pursuits allures me.", keying: "POSITIVE" },
    { text_tr: "Duygusal bağlar kurmak yerine soğukkanlı ve mesafeli kalmayı seçerim.", text_en: "I elect to stay cold-blooded and detached over forging sentimental ties.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Başkalarını incitebilecek bir davranışta bulunduğumda vicdan azabı duyarım.", text_en: "I feel heavy remorse when engaging in conduct that bruises others.", keying: "NEGATIVE" },
    { text_tr: "Zor kararlar alırken karşımdakinin gözyaşlarından etkilenmem.", text_en: "When making tough calls, I remain unmoved by others' tears.", keying: "POSITIVE" },
    { text_tr: "Kendi çıkarlarım söz konusu olduğunda başkalarının duygularını göz ardı edebilirim.", text_en: "When my stakes are involved, I can disregard others' feelings.", keying: "POSITIVE" },
    { text_tr: "Hassas ve kırılgan insanlara karşı derin bir anlayış gösteririm.", text_en: "I display profound consideration toward tender and fragile individuals.", keying: "NEGATIVE" },
    { text_tr: "İş ortamında acımasızca rekabet etmekten çekinmem.", text_en: "At work, I do not hesitate to compete with ruthless determination.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Kuralların çiğnenmesi gerektiğinde kimseden çekinmeden çiğnerim.", text_en: "When rules must be broken, I break them without blinking.", keying: "POSITIVE", itemType: "contextual", context: "general" }
  ]
});

// 4. EVERYDAY SADISM (Antagonistic Assertion)
addFacetItems({
  prefix: "DT-TR-SAD",
  constructId: "dark_tetrad_traits",
  facetId: "everyday_sadism",
  items: [
    { text_tr: "Beni sinirlendiren birinin küçük düşürüldüğünü görmek içten içe hoşuma gider.", text_en: "Seeing someone who annoyed me get humiliated brings subtle amusement.", keying: "POSITIVE" },
    { text_tr: "Başkalarının zor durumda kalmasından veya utanmasından asla zevk almam.", text_en: "I never take pleasure in seeing others embarrassed or cornered.", keying: "NEGATIVE" },
    { text_tr: "Rekabetçi oyunlarda veya tartışmalarda rakibimi tamamen ezmekten keyif alırım.", text_en: "In competitive games, crushing my opponent utterly gives me joy.", keying: "POSITIVE" },
    { text_tr: "İnsanların zayıf noktalarıyla alay edip onları köşeye sıkıştırırım.", text_en: "I mock people's soft spots and box them into a corner.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Başkalarının mahcubiyeti beni de üzer ve rahatsız eder.", text_en: "Others' embarrassment distresses and discomforts me too.", keying: "NEGATIVE" },
    { text_tr: "Tartışmalarda karşı tarafı zihinsel olarak köşeye sıkıştırmak beni eğlendirir.", text_en: "Mentally trapping the counterparty in debates entertains me.", keying: "POSITIVE" },
    { text_tr: "Sert ve kırıcı şakalarla etrafımdakileri iğnelemekten kaçınırım.", text_en: "I refrain from stinging those around me with biting sarcasm.", keying: "NEGATIVE" },
    { text_tr: "Filmlerde kötü karakterlerin hak ettikleri sert cezaları almasını keyifle izlerim.", text_en: "I relish watching villains suffer harsh, merciless penalties in films.", keying: "POSITIVE" },
    { text_tr: "İş toplantılarında haksız çıkan bir meslektaşımın düştüğü duruma gülerim.", text_en: "At work, I chuckle inwardly when an opposing colleague is proven wrong.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Video oyunlarında rakipleri acımasızca yok etmek bana ekstra tatmin sağlar.", text_en: "In video games, mercilessly wrecking rivals provides extra thrill.", keying: "POSITIVE", itemType: "contextual", context: "general" }
  ]
});

module.exports = {
  batchName: "BATCH_I_DARK_TETRAD",
  items
};
