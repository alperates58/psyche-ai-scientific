import fs from 'fs';
import path from 'path';

const rootDir = path.resolve(__dirname, '..');
const masterModelDir = path.resolve(rootDir, 'data/master-model');

export interface CandidateConstruct {
  candidateId: string;
  canonicalNameEn: string;
  canonicalNameTr: string;
  entityType: 'DOMAIN' | 'CONSTRUCT' | 'FACET' | 'DIRECT_MEASURE' | 'DERIVED_INDEX' | 'BEHAVIORAL_PATTERN' | 'THEORETICAL_CONCEPT' | 'HISTORICAL_CONCEPT' | 'CLINICAL_CONSTRUCT';
  proposedDomain: string;
  definition: string;
  aliases: string[];
  relatedConstructs: string[];
  overlapWithCurrentOntology: string[];
  directOrDerived: 'DIRECT' | 'DERIVED' | 'LONGITUDINAL' | 'THEORETICAL' | 'NOT_MEASURED';
  measurementMode: 'DIRECT_PSYCHOMETRIC' | 'DERIVED_DETERMINISTIC' | 'LONGITUDINAL_DERIVED' | 'OBSERVATIONAL_HYPOTHESIS' | 'THEORETICAL_ONLY' | 'NOT_MEASURABLE';
  measurementLevel: 'FACET' | 'SUBSCALE' | 'CONSTRUCT' | 'SCALE_TOTAL' | 'BROAD_FACTOR' | 'DERIVED_INDEX' | 'OBSERVATIONAL_PATTERN' | 'THEORETICAL_FRAMEWORK';
  evidenceQuality: 'STRONG' | 'MODERATE' | 'LIMITED' | 'EMERGING' | 'THEORETICAL_ONLY' | 'INSUFFICIENT';
  evidenceSummary: string;
  keySources: string[];
  claimSources: {
    definitionSourceIds: string[];
    evidenceSourceIds: string[];
    measurementSourceIds: string[];
    turkishEvidenceSourceIds: string[];
    overlapSourceIds: string[];
    licensingSourceIds: string[];
  };
  turkishEvidenceStatus: 'DIRECT' | 'LEXICAL' | 'RELATED' | 'NO_DIRECT' | 'UNKNOWN';
  turkishEvidenceLevel: 'FACET' | 'SUBSCALE' | 'CONSTRUCT' | 'SCALE_TOTAL' | 'BROAD_FACTOR' | 'NOT_ASSESSED';
  knownInstrumentCandidates: Array<{
    instrumentName: string;
    instrumentId?: string;
    isPublicDomainOrOpen: boolean;
    licenseStatus: string;
  }>;
  licensingStatus: 'APPROVED_PUBLIC' | 'REQUIRES_LICENSE' | 'STRICTLY_PROPRIETARY' | 'UNKNOWN' | 'NOT_APPLICABLE';
  clinicalRisk: 'NONE' | 'LOW' | 'MODERATE' | 'HIGH';
  clinicalSafetyClass: 'NON_CLINICAL' | 'NON_CLINICAL_ADJACENT' | 'CLINICAL_SCREENING' | 'CLINICAL_DIAGNOSTIC' | 'HIGH_RISK_INTERPRETATION' | 'UNKNOWN';
  consumerSuitability: 'HIGH' | 'MODERATE' | 'CONDITIONAL' | 'UNSUITABLE';
  longitudinalSuitability: 'STATIC_TRAIT' | 'HIGH_LONGITUDINAL_VALUE' | 'STATE_REACTIVE' | 'NOT_APPLICABLE';
  visualizationSuitability: string[];
  aiInterpretationEligibility: 'DIRECT_PSYCHOMETRIC_INPUT' | 'DERIVED_INTERACTION_INPUT' | 'OBSERVATIONAL_HYPOTHESIS' | 'THEORETICAL_LENS_ONLY' | 'PROHIBITED';
  historicalTheoryEligibility: string[];
  decisionRubric: {
    scientificDistinctiveness: 'HIGH' | 'MODERATE' | 'LOW';
    incrementalValue: 'HIGH' | 'MODERATE' | 'LOW';
    measurementMaturity: 'HIGH' | 'MODERATE' | 'LOW' | 'EMERGING';
    consumerRelevance: 'HIGH' | 'MODERATE' | 'LOW';
    safety: 'SAFE_NON_CLINICAL' | 'GOVERNED_ADJACENT' | 'CLINICAL_RISK';
    turkishEvidence: 'DIRECT_VALIDATED' | 'LEXICAL_OR_RELATED' | 'NO_DIRECT' | 'UNKNOWN';
    licensingFeasibility: 'OPEN_ACCESSIBLE' | 'REQUIRES_LICENSE' | 'PROPRIETARY_BLOCKED' | 'UNKNOWN';
    assessmentBurden: 'LOW' | 'MODERATE' | 'HIGH';
    longitudinalValue: 'HIGH' | 'MODERATE' | 'LOW';
    interpretability: 'HIGH' | 'MODERATE' | 'LOW';
  };
  decision: 'INCLUDE_CORE' | 'INCLUDE_ADVANCED' | 'DERIVED_ONLY' | 'LONGITUDINAL_ONLY' | 'THEORY_ONLY' | 'RESEARCH_ONLY' | 'DEFER' | 'EXCLUDE';
  decisionRationale: string;
}

// We import the first 66 candidates from generate-candidate-pool
import { CANDIDATE_POOL } from './generate-candidate-pool';

function add(c: CandidateConstruct) {
  CANDIDATE_POOL.push(c);
}

// -----------------------------------------------------------------------------
// 6. MOTIVATION, PSYCHOLOGICAL NEEDS & VALUES (11 Candidates)
// -----------------------------------------------------------------------------
add({
  candidateId: "cand_autonomy_need_satisfaction",
  canonicalNameEn: "Autonomy Need Satisfaction",
  canonicalNameTr: "Özerklik İhtiyacı Doyumu",
  entityType: "CONSTRUCT",
  proposedDomain: "motivation_values",
  definition: "The basic psychological experience of volition, agency, and self-endorsement of one's actions rather than feeling coerced or pressured.",
  aliases: ["Self-Determination Autonomy", "Basic Need: Autonomy"],
  relatedConstructs: ["cand_competence_need_satisfaction", "cand_relatedness_need_satisfaction"],
  overlapWithCurrentOntology: ["autonomy_need", "basic_psychological_needs"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SUBSCALE",
  evidenceQuality: "STRONG",
  evidenceSummary: "Deci & Ryan Self-Determination Theory. Chen et al. (2015) cross-cultural validation across 4 continents. Validated in Turkish by Cihangir-Çankaya (2009).",
  keySources: ["src_deci_ryan_2000_sdt", "src_chen_2015_bpnsfs", "src_cihangir_cankaya_2009_bpns"],
  claimSources: {
    definitionSourceIds: ["src_deci_ryan_2000_sdt"],
    evidenceSourceIds: ["src_deci_ryan_2000_sdt", "src_chen_2015_bpnsfs"],
    measurementSourceIds: ["src_chen_2015_bpnsfs"],
    turkishEvidenceSourceIds: ["src_cihangir_cankaya_2009_bpns"],
    overlapSourceIds: ["src_deci_ryan_2000_sdt"],
    licensingSourceIds: ["src_chen_2015_bpnsfs"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "SUBSCALE",
  knownInstrumentCandidates: [
    { instrumentName: "BPNSFS Autonomy Subscale (TR Cihangir-Çankaya, 2009)", instrumentId: "inst_bpnsfs", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["BAR_GRID", "HEATMAP", "FINGERPRINT", "DASHBOARD"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_rogers", "lens_maslow"],
  decisionRubric: {
    scientificDistinctiveness: "HIGH",
    incrementalValue: "HIGH",
    measurementMaturity: "HIGH",
    consumerRelevance: "HIGH",
    safety: "SAFE_NON_CLINICAL",
    turkishEvidence: "DIRECT_VALIDATED",
    licensingFeasibility: "OPEN_ACCESSIBLE",
    assessmentBurden: "LOW",
    longitudinalValue: "HIGH",
    interpretability: "HIGH"
  },
  decision: "INCLUDE_CORE",
  decisionRationale: "Foundational human need in SDT. High construct validity and validated Turkish psychometrics."
});

add({
  candidateId: "cand_competence_need_satisfaction",
  canonicalNameEn: "Competence Need Satisfaction",
  canonicalNameTr: "Yeterlik / Ustalık İhtiyacı Doyumu",
  entityType: "CONSTRUCT",
  proposedDomain: "motivation_values",
  definition: "The basic psychological experience of effectiveness in interacting with one's environment and experiencing opportunities to exercise and express one's capacities.",
  aliases: ["Self-Determination Competence", "Basic Need: Competence"],
  relatedConstructs: ["cand_generalized_self_efficacy", "cand_autonomy_need_satisfaction"],
  overlapWithCurrentOntology: ["competence_need", "basic_psychological_needs"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SUBSCALE",
  evidenceQuality: "STRONG",
  evidenceSummary: "Deci & Ryan SDT model. Chen et al. (2015). Validated in Turkish samples by Cihangir-Çankaya (2009).",
  keySources: ["src_deci_ryan_2000_sdt", "src_chen_2015_bpnsfs", "src_cihangir_cankaya_2009_bpns"],
  claimSources: {
    definitionSourceIds: ["src_deci_ryan_2000_sdt"],
    evidenceSourceIds: ["src_deci_ryan_2000_sdt", "src_chen_2015_bpnsfs"],
    measurementSourceIds: ["src_chen_2015_bpnsfs"],
    turkishEvidenceSourceIds: ["src_cihangir_cankaya_2009_bpns"],
    overlapSourceIds: ["src_deci_ryan_2000_sdt"],
    licensingSourceIds: ["src_chen_2015_bpnsfs"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "SUBSCALE",
  knownInstrumentCandidates: [
    { instrumentName: "BPNSFS Competence Subscale (TR Cihangir-Çankaya, 2009)", instrumentId: "inst_bpnsfs", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["BAR_GRID", "HEATMAP", "FINGERPRINT", "DASHBOARD"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_adler", "lens_maslow"],
  decisionRubric: {
    scientificDistinctiveness: "HIGH",
    incrementalValue: "HIGH",
    measurementMaturity: "HIGH",
    consumerRelevance: "HIGH",
    safety: "SAFE_NON_CLINICAL",
    turkishEvidence: "DIRECT_VALIDATED",
    licensingFeasibility: "OPEN_ACCESSIBLE",
    assessmentBurden: "LOW",
    longitudinalValue: "HIGH",
    interpretability: "HIGH"
  },
  decision: "INCLUDE_CORE",
  decisionRationale: "Essential psychological need. Captures state-level fulfillment of mastery."
});

add({
  candidateId: "cand_relatedness_need_satisfaction",
  canonicalNameEn: "Relatedness Need Satisfaction",
  canonicalNameTr: "İlişkilenme / Ait Olma İhtiyacı Doyumu",
  entityType: "CONSTRUCT",
  proposedDomain: "motivation_values",
  definition: "The basic psychological experience of feeling connected, cared for, and belonging with significant others.",
  aliases: ["Self-Determination Relatedness", "Basic Need: Relatedness"],
  relatedConstructs: ["cand_social_connectedness", "cand_attachment_anxiety"],
  overlapWithCurrentOntology: ["relatedness_need", "basic_psychological_needs"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SUBSCALE",
  evidenceQuality: "STRONG",
  evidenceSummary: "Deci & Ryan SDT model. Validated in Turkish by Cihangir-Çankaya (2009). Predicts relational well-being and social flourishing.",
  keySources: ["src_deci_ryan_2000_sdt", "src_chen_2015_bpnsfs", "src_cihangir_cankaya_2009_bpns"],
  claimSources: {
    definitionSourceIds: ["src_deci_ryan_2000_sdt"],
    evidenceSourceIds: ["src_deci_ryan_2000_sdt", "src_chen_2015_bpnsfs"],
    measurementSourceIds: ["src_chen_2015_bpnsfs"],
    turkishEvidenceSourceIds: ["src_cihangir_cankaya_2009_bpns"],
    overlapSourceIds: ["src_deci_ryan_2000_sdt"],
    licensingSourceIds: ["src_chen_2015_bpnsfs"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "SUBSCALE",
  knownInstrumentCandidates: [
    { instrumentName: "BPNSFS Relatedness Subscale (TR Cihangir-Çankaya, 2009)", instrumentId: "inst_bpnsfs", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["BAR_GRID", "HEATMAP", "FINGERPRINT", "DASHBOARD"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_adler", "lens_maslow"],
  decisionRubric: {
    scientificDistinctiveness: "HIGH",
    incrementalValue: "HIGH",
    measurementMaturity: "HIGH",
    consumerRelevance: "HIGH",
    safety: "SAFE_NON_CLINICAL",
    turkishEvidence: "DIRECT_VALIDATED",
    licensingFeasibility: "OPEN_ACCESSIBLE",
    assessmentBurden: "LOW",
    longitudinalValue: "HIGH",
    interpretability: "HIGH"
  },
  decision: "INCLUDE_CORE",
  decisionRationale: "Essential psychological need in SDT. Direct Turkish psychometric backing."
});

add({
  candidateId: "cand_need_for_achievement",
  canonicalNameEn: "Need for Achievement (nAch)",
  canonicalNameTr: "Başarı İhtiyacı / Güdüsü",
  entityType: "CONSTRUCT",
  proposedDomain: "motivation_values",
  definition: "Dispositional drive to excel, accomplish difficult standards, and outperform benchmarks through personal effort.",
  aliases: ["nAch", "Achievement Motivation"],
  relatedConstructs: ["cand_hexaco_conscientiousness", "cand_long_term_grit"],
  overlapWithCurrentOntology: ["diligence"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "CONSTRUCT",
  evidenceQuality: "STRONG",
  evidenceSummary: "McClelland (1985) Acquired Needs Theory. Widely used in educational and organizational psychology.",
  keySources: ["src_mcclelland_1985"],
  claimSources: {
    definitionSourceIds: ["src_mcclelland_1985"],
    evidenceSourceIds: ["src_mcclelland_1985"],
    measurementSourceIds: ["src_mcclelland_1985"],
    turkishEvidenceSourceIds: [],
    overlapSourceIds: ["src_mcclelland_1985"],
    licensingSourceIds: ["src_mcclelland_1985"]
  },
  turkishEvidenceStatus: "NO_DIRECT",
  turkishEvidenceLevel: "NOT_ASSESSED",
  knownInstrumentCandidates: [
    { instrumentName: "IPIP Need for Achievement Scale", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["BAR_GRID", "HEATMAP"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_adler"],
  decisionRubric: {
    scientificDistinctiveness: "HIGH",
    incrementalValue: "HIGH",
    measurementMaturity: "HIGH",
    consumerRelevance: "HIGH",
    safety: "SAFE_NON_CLINICAL",
    turkishEvidence: "NO_DIRECT",
    licensingFeasibility: "OPEN_ACCESSIBLE",
    assessmentBurden: "LOW",
    longitudinalValue: "LOW",
    interpretability: "HIGH"
  },
  decision: "INCLUDE_ADVANCED",
  decisionRationale: "Provides dedicated motivational striving assessment in vocational/achievement enrichment modules."
});

add({
  candidateId: "cand_need_for_affiliation",
  canonicalNameEn: "Need for Affiliation (nAff)",
  canonicalNameTr: "İlişki ve Bağlanma İhtiyacı / Güdüsü",
  entityType: "CONSTRUCT",
  proposedDomain: "motivation_values",
  definition: "Dispositional drive to establish, maintain, and restore positive, warm, and affectionate interpersonal relationships.",
  aliases: ["nAff", "Affiliation Motivation"],
  relatedConstructs: ["cand_relatedness_need_satisfaction", "cand_hexaco_extraversion"],
  overlapWithCurrentOntology: ["sociability"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "CONSTRUCT",
  evidenceQuality: "STRONG",
  evidenceSummary: "McClelland (1985). Measures motive to connect rather than extraverted social talkativeness.",
  keySources: ["src_mcclelland_1985"],
  claimSources: {
    definitionSourceIds: ["src_mcclelland_1985"],
    evidenceSourceIds: ["src_mcclelland_1985"],
    measurementSourceIds: ["src_mcclelland_1985"],
    turkishEvidenceSourceIds: [],
    overlapSourceIds: ["src_mcclelland_1985"],
    licensingSourceIds: ["src_mcclelland_1985"]
  },
  turkishEvidenceStatus: "NO_DIRECT",
  turkishEvidenceLevel: "NOT_ASSESSED",
  knownInstrumentCandidates: [
    { instrumentName: "IPIP Need for Affiliation Scale", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["BAR_GRID", "HEATMAP"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_adler"],
  decisionRubric: {
    scientificDistinctiveness: "HIGH",
    incrementalValue: "HIGH",
    measurementMaturity: "HIGH",
    consumerRelevance: "HIGH",
    safety: "SAFE_NON_CLINICAL",
    turkishEvidence: "NO_DIRECT",
    licensingFeasibility: "OPEN_ACCESSIBLE",
    assessmentBurden: "LOW",
    longitudinalValue: "LOW",
    interpretability: "HIGH"
  },
  decision: "INCLUDE_ADVANCED",
  decisionRationale: "Complements achievement and power motives in motivational profiling."
});

add({
  candidateId: "cand_need_for_power",
  canonicalNameEn: "Need for Power (nPower)",
  canonicalNameTr: "Güç ve Etki İhtiyacı / Güdüsü",
  entityType: "CONSTRUCT",
  proposedDomain: "motivation_values",
  definition: "Dispositional drive to have impact, control, influence, and authority over other people and environments.",
  aliases: ["nPower", "Influence Motivation"],
  relatedConstructs: ["cand_interpersonal_dominance_agency", "cand_grandiose_narcissism_subclinical"],
  overlapWithCurrentOntology: ["social_boldness"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "CONSTRUCT",
  evidenceQuality: "STRONG",
  evidenceSummary: "McClelland (1985). Important predictor of leadership emergence and organizational influence.",
  keySources: ["src_mcclelland_1985"],
  claimSources: {
    definitionSourceIds: ["src_mcclelland_1985"],
    evidenceSourceIds: ["src_mcclelland_1985"],
    measurementSourceIds: ["src_mcclelland_1985"],
    turkishEvidenceSourceIds: [],
    overlapSourceIds: ["src_mcclelland_1985"],
    licensingSourceIds: ["src_mcclelland_1985"]
  },
  turkishEvidenceStatus: "NO_DIRECT",
  turkishEvidenceLevel: "NOT_ASSESSED",
  knownInstrumentCandidates: [
    { instrumentName: "IPIP Need for Power Scale", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["BAR_GRID", "HEATMAP"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_adler"],
  decisionRubric: {
    scientificDistinctiveness: "HIGH",
    incrementalValue: "HIGH",
    measurementMaturity: "HIGH",
    consumerRelevance: "HIGH",
    safety: "SAFE_NON_CLINICAL",
    turkishEvidence: "NO_DIRECT",
    licensingFeasibility: "OPEN_ACCESSIBLE",
    assessmentBurden: "LOW",
    longitudinalValue: "LOW",
    interpretability: "HIGH"
  },
  decision: "INCLUDE_ADVANCED",
  decisionRationale: "Assesses leadership and impact drives non-pathologically."
});

add({
  candidateId: "cand_growth_mindset_implicit_theory",
  canonicalNameEn: "Growth Mindset (Implicit Theories)",
  canonicalNameTr: "Gelişim Zihniyeti (Gelişebilirlik İnancı)",
  entityType: "CONSTRUCT",
  proposedDomain: "motivation_values",
  definition: "The belief that personal abilities, intelligence, and personality attributes can be cultivated and developed through effort, strategy, and learning.",
  aliases: ["Incremental Theory of Intelligence", "Dweck Growth Mindset"],
  relatedConstructs: ["cand_generalized_self_efficacy"],
  overlapWithCurrentOntology: ["cognitive_adaptability"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SCALE_TOTAL",
  evidenceQuality: "STRONG",
  evidenceSummary: "Dweck (1999) framework. Widely studied in educational and organizational settings as a predictor of challenge-seeking and resilience after setbacks.",
  keySources: ["src_dweck_1999_mindset"],
  claimSources: {
    definitionSourceIds: ["src_dweck_1999_mindset"],
    evidenceSourceIds: ["src_dweck_1999_mindset"],
    measurementSourceIds: ["src_dweck_1999_mindset"],
    turkishEvidenceSourceIds: [],
    overlapSourceIds: ["src_dweck_1999_mindset"],
    licensingSourceIds: ["src_dweck_1999_mindset"]
  },
  turkishEvidenceStatus: "NO_DIRECT",
  turkishEvidenceLevel: "NOT_ASSESSED",
  knownInstrumentCandidates: [
    { instrumentName: "Implicit Theories of Intelligence Scale (Dweck)", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["BAR_GRID", "HEATMAP", "FINGERPRINT"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_rogers", "lens_adler"],
  decisionRubric: {
    scientificDistinctiveness: "HIGH",
    incrementalValue: "HIGH",
    measurementMaturity: "HIGH",
    consumerRelevance: "HIGH",
    safety: "SAFE_NON_CLINICAL",
    turkishEvidence: "NO_DIRECT",
    licensingFeasibility: "OPEN_ACCESSIBLE",
    assessmentBurden: "LOW",
    longitudinalValue: "HIGH",
    interpretability: "HIGH"
  },
  decision: "INCLUDE_CORE",
  decisionRationale: "High actionable value in self-development. Measures core epistemic belief regarding personal growth potential."
});

// Schwartz 4 Higher-Order Value Dimensions
add({
  candidateId: "cand_schwartz_openness_to_change",
  canonicalNameEn: "Openness to Change Values",
  canonicalNameTr: "Değişime Açıklık Değerleri (Öz-Yönelim ve Uyarılma)",
  entityType: "CONSTRUCT",
  proposedDomain: "motivation_values",
  definition: "Higher-order value dimension prioritizing independence of thought and action, novelty, curiosity, and excitement (Self-Direction and Stimulation values).",
  aliases: ["Schwartz Openness Values", "Self-Direction & Stimulation"],
  relatedConstructs: ["cand_schwartz_conservation", "cand_hexaco_openness"],
  overlapWithCurrentOntology: ["values_openness_to_change", "universal_values"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SUBSCALE",
  evidenceQuality: "STRONG",
  evidenceSummary: "Schwartz (1992, 2012) universal values theory. Replicated in 80+ countries. Validated in Turkish by Kuşdil & Kağıtçıbaşı (2000).",
  keySources: ["src_schwartz_2012_values", "src_kusdil_kagitcibasi_2000_values", "src_ipip_ori_licensing"],
  claimSources: {
    definitionSourceIds: ["src_schwartz_2012_values"],
    evidenceSourceIds: ["src_schwartz_2012_values"],
    measurementSourceIds: ["src_schwartz_2012_values"],
    turkishEvidenceSourceIds: ["src_kusdil_kagitcibasi_2000_values"],
    overlapSourceIds: ["src_schwartz_2012_values"],
    licensingSourceIds: ["src_ipip_ori_licensing"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "SUBSCALE",
  knownInstrumentCandidates: [
    { instrumentName: "IPIP-Schwartz Values Scale (Openness to Change Subscale)", instrumentId: "inst_ipip_schwartz_values", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["CIRCUMPLEX", "BAR_GRID", "HEATMAP", "FINGERPRINT"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_maslow", "lens_rogers"],
  decisionRubric: {
    scientificDistinctiveness: "HIGH",
    incrementalValue: "HIGH",
    measurementMaturity: "HIGH",
    consumerRelevance: "HIGH",
    safety: "SAFE_NON_CLINICAL",
    turkishEvidence: "DIRECT_VALIDATED",
    licensingFeasibility: "OPEN_ACCESSIBLE",
    assessmentBurden: "LOW",
    longitudinalValue: "LOW",
    interpretability: "HIGH"
  },
  decision: "INCLUDE_CORE",
  decisionRationale: "Core quadrant of universal human values with direct Turkish psychometric validation."
});

add({
  candidateId: "cand_schwartz_self_transcendence",
  canonicalNameEn: "Self-Transcendence Values",
  canonicalNameTr: "Öz-Aşkınlık Değerleri (Evrenselcilik ve İyilikseverlik)",
  entityType: "CONSTRUCT",
  proposedDomain: "motivation_values",
  definition: "Higher-order value dimension prioritizing concern for the welfare and interests of others, nature, and society (Benevolence and Universalism values).",
  aliases: ["Schwartz Self-Transcendence", "Benevolence & Universalism"],
  relatedConstructs: ["cand_schwartz_self_enhancement", "cand_empathic_concern"],
  overlapWithCurrentOntology: ["values_self_transcendence", "universal_values"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SUBSCALE",
  evidenceQuality: "STRONG",
  evidenceSummary: "Schwartz model. Validated in Turkish samples by Kuşdil & Kağıtçıbaşı (2000). Distinct from personality traits by measuring desirable guiding life goals.",
  keySources: ["src_schwartz_2012_values", "src_kusdil_kagitcibasi_2000_values", "src_ipip_ori_licensing"],
  claimSources: {
    definitionSourceIds: ["src_schwartz_2012_values"],
    evidenceSourceIds: ["src_schwartz_2012_values"],
    measurementSourceIds: ["src_schwartz_2012_values"],
    turkishEvidenceSourceIds: ["src_kusdil_kagitcibasi_2000_values"],
    overlapSourceIds: ["src_schwartz_2012_values"],
    licensingSourceIds: ["src_ipip_ori_licensing"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "SUBSCALE",
  knownInstrumentCandidates: [
    { instrumentName: "IPIP-Schwartz Values Scale (Self-Transcendence Subscale)", instrumentId: "inst_ipip_schwartz_values", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["CIRCUMPLEX", "BAR_GRID", "HEATMAP", "FINGERPRINT"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_adler", "lens_maslow"],
  decisionRubric: {
    scientificDistinctiveness: "HIGH",
    incrementalValue: "HIGH",
    measurementMaturity: "HIGH",
    consumerRelevance: "HIGH",
    safety: "SAFE_NON_CLINICAL",
    turkishEvidence: "DIRECT_VALIDATED",
    licensingFeasibility: "OPEN_ACCESSIBLE",
    assessmentBurden: "LOW",
    longitudinalValue: "LOW",
    interpretability: "HIGH"
  },
  decision: "INCLUDE_CORE",
  decisionRationale: "Essential prosocial value pillar with robust Turkish psychometric validation."
});

add({
  candidateId: "cand_schwartz_conservation",
  canonicalNameEn: "Conservation Values",
  canonicalNameTr: "Muhafaza / Koruma Değerleri (Güvenlik, Uyum, Gelenek)",
  entityType: "CONSTRUCT",
  proposedDomain: "motivation_values",
  definition: "Higher-order value dimension prioritizing self-restriction, preservation of traditional practices, and stability of society, relationships, and self (Security, Conformity, and Tradition values).",
  aliases: ["Schwartz Conservation", "Security, Conformity & Tradition"],
  relatedConstructs: ["cand_schwartz_openness_to_change"],
  overlapWithCurrentOntology: ["values_conservation", "universal_values"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SUBSCALE",
  evidenceQuality: "STRONG",
  evidenceSummary: "Schwartz model. Validated in Turkish samples by Kuşdil & Kağıtçıbaşı (2000). Orthogonal balance to Openness to Change.",
  keySources: ["src_schwartz_2012_values", "src_kusdil_kagitcibasi_2000_values", "src_ipip_ori_licensing"],
  claimSources: {
    definitionSourceIds: ["src_schwartz_2012_values"],
    evidenceSourceIds: ["src_schwartz_2012_values"],
    measurementSourceIds: ["src_schwartz_2012_values"],
    turkishEvidenceSourceIds: ["src_kusdil_kagitcibasi_2000_values"],
    overlapSourceIds: ["src_schwartz_2012_values"],
    licensingSourceIds: ["src_ipip_ori_licensing"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "SUBSCALE",
  knownInstrumentCandidates: [
    { instrumentName: "IPIP-Schwartz Values Scale (Conservation Subscale)", instrumentId: "inst_ipip_schwartz_values", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["CIRCUMPLEX", "BAR_GRID", "HEATMAP", "FINGERPRINT"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_maslow"],
  decisionRubric: {
    scientificDistinctiveness: "HIGH",
    incrementalValue: "HIGH",
    measurementMaturity: "HIGH",
    consumerRelevance: "HIGH",
    safety: "SAFE_NON_CLINICAL",
    turkishEvidence: "DIRECT_VALIDATED",
    licensingFeasibility: "OPEN_ACCESSIBLE",
    assessmentBurden: "LOW",
    longitudinalValue: "LOW",
    interpretability: "HIGH"
  },
  decision: "INCLUDE_CORE",
  decisionRationale: "Essential value pillar measuring social order, security, and tradition."
});

add({
  candidateId: "cand_schwartz_self_enhancement",
  canonicalNameEn: "Self-Enhancement Values",
  canonicalNameTr: "Kendini Yüceltme Değerleri (Güç ve Başarı)",
  entityType: "CONSTRUCT",
  proposedDomain: "motivation_values",
  definition: "Higher-order value dimension prioritizing pursuit of one's own relative success, dominance, and resources over others (Achievement and Power values).",
  aliases: ["Schwartz Self-Enhancement", "Power & Achievement Values"],
  relatedConstructs: ["cand_schwartz_self_transcendence", "cand_hexaco_honesty_humility"],
  overlapWithCurrentOntology: ["values_self_enhancement", "universal_values"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SUBSCALE",
  evidenceQuality: "STRONG",
  evidenceSummary: "Schwartz model. Validated in Turkish samples by Kuşdil & Kağıtçıbaşı (2000). Completes the 4-quadrant universal value circumplex.",
  keySources: ["src_schwartz_2012_values", "src_kusdil_kagitcibasi_2000_values", "src_ipip_ori_licensing"],
  claimSources: {
    definitionSourceIds: ["src_schwartz_2012_values"],
    evidenceSourceIds: ["src_schwartz_2012_values"],
    measurementSourceIds: ["src_schwartz_2012_values"],
    turkishEvidenceSourceIds: ["src_kusdil_kagitcibasi_2000_values"],
    overlapSourceIds: ["src_schwartz_2012_values"],
    licensingSourceIds: ["src_ipip_ori_licensing"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "SUBSCALE",
  knownInstrumentCandidates: [
    { instrumentName: "IPIP-Schwartz Values Scale (Self-Enhancement Subscale)", instrumentId: "inst_ipip_schwartz_values", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["CIRCUMPLEX", "BAR_GRID", "HEATMAP", "FINGERPRINT"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_adler"],
  decisionRubric: {
    scientificDistinctiveness: "HIGH",
    incrementalValue: "HIGH",
    measurementMaturity: "HIGH",
    consumerRelevance: "HIGH",
    safety: "SAFE_NON_CLINICAL",
    turkishEvidence: "DIRECT_VALIDATED",
    licensingFeasibility: "OPEN_ACCESSIBLE",
    assessmentBurden: "LOW",
    longitudinalValue: "LOW",
    interpretability: "HIGH"
  },
  decision: "INCLUDE_CORE",
  decisionRationale: "Essential quadrant completing the universal value circumplex."
});

console.log(`Candidate pool built: ${CANDIDATE_POOL.length} candidate constructs. Proceeding to write data/master-model/candidate-constructs.json...`);

fs.writeFileSync(
  path.resolve(masterModelDir, 'candidate-constructs.json'),
  JSON.stringify(CANDIDATE_POOL, null, 2),
  'utf8'
);
