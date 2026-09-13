const fs = require('fs');
const path = require('path');

const constructs = require('../data/constructs.json');
const trMatrix = require('../research/turkish-validation-matrix.json');

// Lookup map for Turkish validation matrix
const trMap = new Map();
for (const entry of trMatrix) {
  trMap.set(entry.facetId, entry);
}

// Verified Facet Evidence Profiles (with NO correlation guesses, NO unverified numbers, and explicit cultural sourcing)
const VERIFIED_FACET_PROFILES = {
  sincerity: {
    name_tr: "İçtenlik",
    name_en: "Sincerity",
    operationalDefinition_tr: "Kişilerarası ilişkilerde manipülasyondan, sahte övgülerden ve dalkavukluktan bilinçli olarak kaçınma eğilimi.",
    operationalDefinition_en: "Tendency to be genuine in interpersonal relations, avoiding manipulation, flattery, and deceit.",
    observableIndicators: [
      "Çıkar sağlamak için başkalarına hak etmedikleri övgülerde bulunmaktan kaçınır.",
      "Kendi düşünce ve niyetlerini dürüstçe ortaya koyar.",
      "İnsanları yönlendirmek için samimiyetsiz rollere bürünmez."
    ],
    constructBoundary: "Sosyal manipülasyon ve yapmacıklık ile açık ve dürüst iletişim arasındaki çizgiyi belirler. Sosyal nezaket veya diplomasi ile karıştırılmamalıdır.",
    whatItMeasures: "Kişilerarası dürüstlük, dalkavukluktan kaçınma, şeffaf iletişim tercihi.",
    whatItDoesNotMeasure: "Kaba bir lafını esirgememe, sosyal beceri eksikliği veya nezaketsizlik.",
    nearestOverlappingFacets: ["fairness", "authenticity", "assertiveness"],
    discriminantFeatures: "Fairness kural ihlallerine odaklanırken, sincerity kişilerarası sahte davranışlara odaklanır.",
    expectedCorrelates: [
      { relation: "Makyavelizm ile negatif ilişki beklenir", relationType: "EXPECTED_THEORETICAL_RELATION", targetConstruct: "machiavellianism" },
      { relation: "İşbirlikçilik ile pozitif ilişki beklenir", relationType: "EXPECTED_THEORETICAL_RELATION", targetConstruct: "agreeableness" }
    ],
    knownConfounds: ["Sosyal beğenirlik etkisi (aşırı erdemli görünme çabası)"],
    socialDesirabilityRisk: "high",
    acquiescenceRisk: "moderate",
    culturalSensitivity: "CULTURAL_HYPOTHESIS_UNVERIFIED: Nezaket icabı iltifat davranışı kültürel norm olabilir; ampirik ayrım için yerel psikometrik kalibrasyon gereklidir.",
    recommendedMethods: ["likert", "behavior_frequency", "contextual"],
    recommendedItemBankSize: 12,
    minimumResearchTarget: 4,
    standardResearchTarget: 8,
    extendedResearchTarget: 12,
    evidenceLevel: "MODERATE_DIRECT_EVIDENCE",
    primarySources: ["src_wasti_2008", "src_ashton_lee_2007"],
    secondarySources: ["src_goldberg_2006"],
    instruments: ["inst_ipip_hexaco"],
    licenseNotes: "Madde metinleri Türkçe özgün taslak olarak üretilmiştir (ORIGINAL_WORDING). IPIP-HEXACO kuramsal referanstır."
  },
  fairness: {
    name_tr: "Adalet",
    name_en: "Fairness",
    operationalDefinition_tr: "Hile, yolsuzluk, rüşvet ve kayırmacılıktan uzak durarak kurallara ve hakkaniyete uygun davranma ilkesi.",
    operationalDefinition_en: "Tendency to avoid fraud, corruption, bribery, and nepotism, adhering strictly to equity and rules.",
    observableIndicators: [
      "Kişisel kazanç uğruna kuralları esnetmeyi veya hile yapmayı reddeder.",
      "Fırsat çıksa dahi başkalarının aleyhine haksız avantaj sağlamaz.",
      "Kaynakları ve sorumlulukları tarafsızca paylaştırır."
    ],
    constructBoundary: "Haksız kazanç ve fırsatçılıktan kaçınmayı ölçer. Yasalara körü körüne itaatten ziyade ahlaki hakkaniyeti temsil eder.",
    whatItMeasures: "Hakkaniyet, kural ihlalinden kaçınma, dürüst rekabet anlayışı.",
    whatItDoesNotMeasure: "Katı cezalandırıcılık veya bürokratik kuralcılık.",
    nearestOverlappingFacets: ["sincerity", "prudence", "values_conservation"],
    discriminantFeatures: "Prudence kendi riskini azaltırken, fairness başkalarının hakkını korumaya yöneliktir.",
    expectedCorrelates: [
      { relation: "Psikopati ile negatif ilişki beklenir", relationType: "EXPECTED_THEORETICAL_RELATION", targetConstruct: "subclinical_psychopathy" },
      { relation: "Kural uyumu ile pozitif ilişki beklenir", relationType: "EXPECTED_THEORETICAL_RELATION", targetConstruct: "rule_compliance" }
    ],
    knownConfounds: ["Sosyal beğenirlik etkisi"],
    socialDesirabilityRisk: "high",
    acquiescenceRisk: "low",
    culturalSensitivity: "CULTURAL_HYPOTHESIS_UNVERIFIED: Nepotizm ve tanıdık kayırma ikilemleri için yerel normatif çalışma gerekir.",
    recommendedMethods: ["likert", "behavior_frequency", "contextual"],
    recommendedItemBankSize: 12,
    minimumResearchTarget: 4,
    standardResearchTarget: 8,
    extendedResearchTarget: 12,
    evidenceLevel: "MODERATE_DIRECT_EVIDENCE",
    primarySources: ["src_wasti_2008", "src_ashton_lee_2007"],
    secondarySources: [],
    instruments: ["inst_ipip_hexaco"],
    licenseNotes: "Madde metinleri Türkçe özgün taslaktır (ORIGINAL_WORDING)."
  },
  core_self_esteem: {
    name_tr: "Temel Benlik Saygısı",
    name_en: "Core Self-Esteem",
    operationalDefinition_tr: "Bireyin bir bütün olarak kendisine değer verme, kendini kabul etme ve saygı duyulmaya değer bulma düzeyi.",
    operationalDefinition_en: "Global evaluation of self-worth, positive self-regard, and unconditional self-acceptance.",
    observableIndicators: [
      "Kendisini diğer insanlar kadar değerli bir birey olarak görür.",
      "Hatalarına rağmen kendisinden genel bir hoşnutluk duyar.",
      "Kişisel başarı veya başarısızlıklardan bağımsız temel bir öz-değer hissine sahiptir."
    ],
    constructBoundary: "Genel benlik değerini ölçer. Belirli bir alandaki yetkinlik algısıyla (öz-yeterlik) veya narsisistik üstünlük iddiasıyla karıştırılmamalıdır.",
    whatItMeasures: "Genel benlik saygısı, öz-kabul, olumlu benlik tutumu.",
    whatItDoesNotMeasure: "Spesifik beceri yeterliliği, kibir veya büyüklenmecilik.",
    nearestOverlappingFacets: ["self_compassion", "generalized_self_efficacy", "grandiose_narcissism"],
    discriminantFeatures: "Öz-yeterlik eylem başarısına dayanırken, benlik saygısı varoluşsal öz-değere dayanır.",
    expectedCorrelates: [
      { relation: "Depresif belirtiler ile negatif ilişki beklenir", relationType: "EXPECTED_THEORETICAL_RELATION", targetConstruct: "depression" },
      { relation: "Yaşam doyumu ile pozitif ilişki beklenir", relationType: "EXPECTED_THEORETICAL_RELATION", targetConstruct: "life_satisfaction" }
    ],
    knownConfounds: ["Anlık duygu durum dalgalanmaları ve savunmacı benlik saygısı"],
    socialDesirabilityRisk: "high",
    acquiescenceRisk: "low",
    culturalSensitivity: "Çuhadaroğlu (1986) uzmanlık tezi Türk örnekleminde uygulanmıştır (src_cuhadaroglu_1986).",
    recommendedMethods: ["likert", "behavior_frequency"],
    recommendedItemBankSize: 10,
    minimumResearchTarget: 4,
    standardResearchTarget: 6,
    extendedResearchTarget: 10,
    evidenceLevel: "STRONG_DIRECT_EVIDENCE",
    primarySources: ["src_cuhadaroglu_1986", "src_rosenberg_1965"],
    secondarySources: [],
    instruments: ["inst_rses"],
    licenseNotes: "Rosenberg ölçeği kamu malıdır (inst_rses). Özgün Türkçe maddeler geliştirilmiştir."
  }
};

function buildEvidenceMap() {
  const result = [];

  for (const c of constructs) {
    const trEntry = trMap.get(c.facetId) || {
      status: 'NO_DIRECT_TURKISH_VALIDATION',
      sourceIds: c.sourceIds || [],
      scientificNotes: 'No peer-reviewed Turkish empirical validation record.'
    };

    const verifiedProfile = VERIFIED_FACET_PROFILES[c.facetId] || {};

    const match = c.facetName.match(/^(.*?)\s*\((.*?)\)$/);
    const name_en = verifiedProfile.name_en || (match ? match[1].trim() : c.facetName);
    const name_tr = verifiedProfile.name_tr || (match ? match[2].trim() : c.facetName);

    // Honest evidence level mapping based on literature evidence rather than internal tier
    let evidenceLevel = 'THEORETICAL_SUPPORT';
    if (trEntry.status === 'DIRECT_FACET_VALIDATION') {
      evidenceLevel = 'STRONG_DIRECT_EVIDENCE';
    } else if (trEntry.status === 'LEXICAL_SUPPORT_ONLY' || trEntry.status === 'RELATED_MEASURE_VALIDATION') {
      evidenceLevel = 'MODERATE_DIRECT_EVIDENCE';
    } else if (c.primaryInstrumentId && trEntry.status === 'CONSTRUCT_LEVEL_VALIDATION') {
      evidenceLevel = 'INDIRECT_EVIDENCE';
    } else if (c.domainId === 'optional_dark_tetrad') {
      evidenceLevel = 'LIMITED_EVIDENCE';
    }

    // Expected correlates: NO correlation guesses! Qualitative only
    const expectedCorrelates = verifiedProfile.expectedCorrelates || [
      {
        relation: `İlgili ${c.domainId} psikolojik yapısıyla kuramsal örtüşme beklenir`,
        relationType: 'EXPECTED_THEORETICAL_RELATION',
        targetConstruct: c.constructId
      }
    ];

    // Cultural sensitivity with honest disclaimer
    let culturalSensitivity = verifiedProfile.culturalSensitivity;
    if (!culturalSensitivity) {
      if (c.domainId === 'core_personality') {
        culturalSensitivity = 'Wasti et al. (2008) çalışması Türk leksikal yapısında faktör düzeyinde destek sunar (src_wasti_2008). Facet düzeyinde ampirik normlar toplanmalıdır.';
      } else {
        culturalSensitivity = 'CULTURAL_HYPOTHESIS_UNVERIFIED: Bu facet için doğrulanmış Türkçe ampirik kültürlerarası norm çalışması henüz tescil edilmemiştir.';
      }
    }

    const entry = {
      facetId: c.facetId,
      domainId: c.domainId,
      constructId: c.constructId,
      name_tr: name_tr,
      name_en: name_en,
      operationalDefinition_tr: verifiedProfile.operationalDefinition_tr || c.definition,
      operationalDefinition_en: verifiedProfile.operationalDefinition_en || `Operationalization of ${name_en} within ${c.constructName}.`,
      observableIndicators: verifiedProfile.observableIndicators || [
        `${name_tr} eğilimini gösteren tipik tutum veya davranış sergiler.`
      ],
      constructBoundary: verifiedProfile.constructBoundary || `Bu yapı ${name_tr} boyutuna odaklanır; komşu psikolojik yapılarla ayrıştırılmalıdır.`,
      whatItMeasures: verifiedProfile.whatItMeasures || `${name_tr} ile ilişkili tutum, davranış ve algısal eğilimler.`,
      whatItDoesNotMeasure: verifiedProfile.whatItDoesNotMeasure || `Klinik psikopatoloji tanıları veya yetenek testleri.`,
      nearestOverlappingFacets: verifiedProfile.nearestOverlappingFacets || [],
      discriminantFeatures: verifiedProfile.discriminantFeatures || `Hedef yapının teorik çekirdeği ve gözlenebilir göstergeleri.`,
      expectedCorrelates: expectedCorrelates,
      knownConfounds: verifiedProfile.knownConfounds || ["Sosyal beğenirlik etkisi ve bağlamsal değişkenler"],
      socialDesirabilityRisk: verifiedProfile.socialDesirabilityRisk || "moderate",
      acquiescenceRisk: verifiedProfile.acquiescenceRisk || "low",
      culturalSensitivity: culturalSensitivity,
      recommendedMethods: verifiedProfile.recommendedMethods || ["likert", "behavior_frequency", "contextual"],
      recommendedItemBankSize: verifiedProfile.recommendedItemBankSize || 10,
      minimumResearchTarget: verifiedProfile.minimumResearchTarget || 4,
      standardResearchTarget: verifiedProfile.standardResearchTarget || 8,
      extendedResearchTarget: verifiedProfile.extendedResearchTarget || 12,
      evidenceLevel: evidenceLevel,
      primarySources: verifiedProfile.primarySources || trEntry.sourceIds || [],
      secondarySources: verifiedProfile.secondarySources || [],
      instruments: verifiedProfile.instruments || (trEntry.instrumentId ? [trEntry.instrumentId] : []),
      licenseNotes: verifiedProfile.licenseNotes || "Araştırma amaçlı özgün Türkçe taslak maddeler (ORIGINAL_WORDING).",
      turkishValidationStatus: trEntry.status,
      turkishValidationNotes: trEntry.scientificNotes,
      researchNotes: `Literatür temelli araştırma havuzu maddesi. Epistemik statü: RESEARCH_DRAFT.`
    };

    result.push(entry);
  }

  return result;
}

const map = buildEvidenceMap();
const outPath = path.resolve(__dirname, '../research/facet-evidence-map.json');
fs.writeFileSync(outPath, JSON.stringify(map, null, 2), 'utf8');
console.log(`Successfully generated research/facet-evidence-map.json with ${map.length} facets.`);
