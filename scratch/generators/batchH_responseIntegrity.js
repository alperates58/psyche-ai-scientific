// BATCH H: RESPONSE INTEGRITY / MEASUREMENT QUALITY (4 Facets)
// 8-10 candidate items per facet = ~36 items

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

function createItem(props) {
  return {
    id: props.id,
    domainId: "response_integrity",
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
    context: "general",
    measurementPurpose: props.measurementPurpose || "careless_detection",
    observableIndicatorId: props.observableIndicatorId || `${props.facetId}_ind_1`,
    sourceType: props.sourceType || "ORIGINAL_AI_ASSISTED_RESEARCH_DRAFT",
    sourceIds: props.sourceIds || ["src_curran_2016_careless"],
    instrumentIds: props.instrumentIds || ["inst_bidr_6"],
    licenseStatus: "APPROVED_WITH_ATTRIBUTION",
    validationStatus: "RESEARCH_DRAFT",
    candidateStatus: "INTERNAL_REVIEW",
    socialDesirabilitySensitivity: props.socialDesirabilitySensitivity || "low",
    acquiescenceRisk: "low",
    readingDifficulty: "easy",
    estimatedCompletionSeconds: props.estimatedCompletionSeconds || 7,
    semanticCluster: props.semanticCluster || `${props.facetId}_cluster`,
    pairedItemId: props.pairedItemId || null,
    forcedChoiceBlock: null,
    situationalScenarios: null,
    attentionCheck: props.attentionCheck || false,
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

// 1. RESPONSE TIME ANOMALY (Instructed Response / Trap Items for speed calibration)
addFacetItems({
  prefix: "RI-AE-RTA",
  constructId: "attention_effort",
  facetId: "response_time_analysis",
  items: [
    { text_tr: "Dikkat kontrolü: Anketi dikkatle okuduğunuzu doğrulamak için lütfen 'Katılıyorum' seçeneğini işaretleyin.", text_en: "Attention check: Please select 'Agree' to confirm you are reading carefully.", keying: "POSITIVE", attentionCheck: true },
    { text_tr: "Bu madde bir dikkat testidir; lütfen doğrudan 'Kesinlikle Katılmıyorum' seçeneğine tıklayın.", text_en: "This item is an attention probe; please click 'Strongly Disagree'.", keying: "POSITIVE", attentionCheck: true },
    { text_tr: "Metni dikkatle takip ettiğinizi göstermek amacıyla bu soruda 'Biraz Katılıyorum' cevabını verin.", text_en: "To show careful reading, select 'Slightly Agree' for this question.", keying: "POSITIVE", attentionCheck: true },
    { text_tr: "Dikkat kontrolü: Lütfen bu soruya cevap olarak 'Katılmıyorum' kutucuğunu işaretleyin.", text_en: "Attention check: Please mark 'Disagree' as your response.", keying: "POSITIVE", attentionCheck: true },
    { text_tr: "Soruları özenle okuduğunuzu doğrulamak adına 'Biraz Katılmıyorum' seçeneğini tıklayın.", text_en: "Confirming attentiveness: please select 'Slightly Disagree'.", keying: "POSITIVE", attentionCheck: true },
    { text_tr: "Sistem kalibrasyonu: Bu soruyu yanıtlarken lütfen 'Kesinlikle Katılıyorum' şıkkını tercih edin.", text_en: "System calibration: select 'Strongly Agree' when responding.", keying: "POSITIVE", attentionCheck: true },
    { text_tr: "Dikkat kontrolü: Yalnızca yönergeye uymak adına dördüncü seçeneği işaretleyin.", text_en: "Attention check: mark the fourth option to verify compliance.", keying: "POSITIVE", attentionCheck: true },
    { text_tr: "Lütfen bu maddeyi okuduğunuzu teyit etmek için ikinci seçeneği seçiniz.", text_en: "Please select the second option to confirm reading this item.", keying: "POSITIVE", attentionCheck: true }
  ]
});

// 2. LONGSTRING INDEX (Low-variance anomaly calibration items)
addFacetItems({
  prefix: "RI-AE-LSI",
  constructId: "attention_effort",
  facetId: "longstring_index",
  items: [
    { text_tr: "Hayatımda hiçbir zaman hiç kimseye kızmadım.", text_en: "I have never in my life felt angry at anyone.", keying: "NEGATIVE", measurementPurpose: "careless_detection" },
    { text_tr: "Dünyadaki bütün insanları istisnasız eşit derecede çok severim.", text_en: "I love all human beings on earth equally without exception.", keying: "NEGATIVE", measurementPurpose: "careless_detection" },
    { text_tr: "Günde yirmi dört saat boyunca aralıksız uyanık kalırım.", text_en: "I remain awake 24 hours a day without sleep.", keying: "NEGATIVE", measurementPurpose: "careless_detection" },
    { text_tr: "Tüm hayatım boyunca tek bir kuralı dahi ihlal etmedim.", text_en: "Across my entire life, I never violated a single rule.", keying: "NEGATIVE", measurementPurpose: "careless_detection" },
    { text_tr: "Hangi dilde konuşulursa konuşulsun dünyadaki bütün dilleri anlarım.", text_en: "I understand every language on earth, no matter how spoken.", keying: "NEGATIVE", measurementPurpose: "careless_detection" },
    { text_tr: "Hemen hemen her gün su içerim.", text_en: "I drink water almost every day.", keying: "POSITIVE", measurementPurpose: "careless_detection" },
    { text_tr: "Hayatımda en az bir kez bir şey satın aldım.", text_en: "I have bought something at least once in my lifetime.", keying: "POSITIVE", measurementPurpose: "careless_detection" },
    { text_tr: "Bazen hava sıcaklığı mevsime göre değişiklik gösterir.", text_en: "Sometimes temperatures vary depending on season.", keying: "POSITIVE", measurementPurpose: "careless_detection" }
  ]
});

// 3. IMPRESSION MANAGEMENT (BIDR-6 adaptation)
addFacetItems({
  prefix: "RI-RB-IMP",
  constructId: "response_bias",
  facetId: "impression_management",
  items: [
    { text_tr: "Kişisel çıkarım için dahi olsa hayatımda bir kez bile yalan söylemedim.", text_en: "I have never dropped a lie even for personal advantage.", keying: "POSITIVE", socialDesirabilitySensitivity: "high", measurementPurpose: "response_bias" },
    { text_tr: "Trafikte veya sırada beklerken içimden bir kez bile öfkelenmem.", text_en: "I never feel a flash of irritation while in traffic or queues.", keying: "POSITIVE", socialDesirabilitySensitivity: "high", measurementPurpose: "response_bias" },
    { text_tr: "Başkaları hakkında asla en ufak bir dedikodu yapmam.", text_en: "I never gossip about other people.", keying: "POSITIVE", socialDesirabilitySensitivity: "high", measurementPurpose: "response_bias" },
    { text_tr: "Sevmediğim bir hediye aldığımda bile içimden hiç hayal kırıklığı geçmez.", text_en: "Receiving an unwanted gift never sparks inner disappointment.", keying: "POSITIVE", socialDesirabilitySensitivity: "high", measurementPurpose: "response_bias" },
    { text_tr: "Bana borçlu olan kişilere karşı hiçbir zaman kırgınlık duymam.", text_en: "I never resent individuals who owe me money.", keying: "POSITIVE", socialDesirabilitySensitivity: "high", measurementPurpose: "response_bias" },
    { text_tr: "Zaman zaman başkaları hakkında hoş olmayan düşünceler aklımdan geçer.", text_en: "At times, unflattering thoughts about others cross my mind.", keying: "NEGATIVE", socialDesirabilitySensitivity: "moderate", measurementPurpose: "response_bias" },
    { text_tr: "Bazen yapmam gereken işleri son dakikaya kadar ertelediğim olur.", text_en: "I sometimes put off things I should do until the last minute.", keying: "NEGATIVE", socialDesirabilitySensitivity: "moderate", measurementPurpose: "response_bias" },
    { text_tr: "Öfkelendiğim anlarda istemeden de olsa kırıcı sözler söylediğim olmuştur.", text_en: "When angry, I have occasionally blurted out hurtful words.", keying: "NEGATIVE", socialDesirabilitySensitivity: "moderate", measurementPurpose: "response_bias" }
  ]
});

// 4. SEMANTIC PAIR INCONSISTENCY (Paired synonymous & antonymous probe calibration)
addFacetItems({
  prefix: "RI-PC-SPI",
  constructId: "profile_coherence",
  facetId: "semantic_pair_inconsistency",
  items: [
    { text_tr: "Yeni insanlarla tanışmak bana büyük bir enerji ve keyif verir.", text_en: "Meeting new individuals grants me tremendous energy and pleasure.", keying: "POSITIVE", measurementPurpose: "coherence_probe", pairedItemId: "RI-PC-SPI-002" },
    { text_tr: "Tanımadığım insanlarla bir arada bulunmaktan nefret eder ve kaçınırım.", text_en: "I loathe and flee from being around unfamiliar people.", keying: "NEGATIVE", measurementPurpose: "coherence_probe", pairedItemId: "RI-PC-SPI-001" },
    { text_tr: "Geleceğe dair planlarımı her zaman önceden titizlikle tasarlarım.", text_en: "I always design future plans meticulously beforehand.", keying: "POSITIVE", measurementPurpose: "coherence_probe", pairedItemId: "RI-PC-SPI-004" },
    { text_tr: "Plan yapmaktan tamamen nefret eder, her şeyi akışına bırakırım.", text_en: "I utterly hate making plans, leaving everything to chance.", keying: "NEGATIVE", measurementPurpose: "coherence_probe", pairedItemId: "RI-PC-SPI-003" },
    { text_tr: "İnsanlara güvenmekten çekinmez, onların iyi niyetine inanırım.", text_en: "I don't hesitate to trust others, believing in their goodwill.", keying: "POSITIVE", measurementPurpose: "coherence_probe", pairedItemId: "RI-PC-SPI-006" },
    { text_tr: "İnsanların doğası gereği kötü niyetli ve aldatıcı olduğuna inanırım.", text_en: "I believe people are intrinsically deceitful and malicious.", keying: "NEGATIVE", measurementPurpose: "coherence_probe", pairedItemId: "RI-PC-SPI-005" },
    { text_tr: "Kendimi genel olarak neşeli ve dinamik bir insan olarak tanımlarım.", text_en: "I define myself as generally cheerful and dynamic.", keying: "POSITIVE", measurementPurpose: "coherence_probe", pairedItemId: "RI-PC-SPI-008" },
    { text_tr: "Kendimi çoğunlukla mutsuz, karamsar ve durgun hissederim.", text_en: "I mostly feel unhappy, pessimistic, and sluggish.", keying: "NEGATIVE", measurementPurpose: "coherence_probe", pairedItemId: "RI-PC-SPI-007" }
  ]
});

module.exports = {
  batchName: "BATCH_H_RESPONSE_INTEGRITY",
  items
};
