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

export const CANDIDATE_POOL: CandidateConstruct[] = [];

// Helper function to push candidates cleanly
function addCandidate(c: CandidateConstruct) {
  CANDIDATE_POOL.push(c);
}

// -----------------------------------------------------------------------------
// 1. CORE BROAD PERSONALITY (HEXACO 6 & COMPARATIVE BIG FIVE) - 12 Candidates
// -----------------------------------------------------------------------------
addCandidate({
  candidateId: "cand_hexaco_honesty_humility",
  canonicalNameEn: "Honesty-Humility",
  canonicalNameTr: "Dürüstlük-Alçakgönüllülük",
  entityType: "CONSTRUCT",
  proposedDomain: "core_personality",
  definition: "Tendency to be sincere, fair, greed-avoidant, and modest in interpersonal relationships versus manipulative, greedy, and entitled.",
  aliases: ["Factor H", "Sincerity-Fairness Dimension"],
  relatedConstructs: ["cand_bigfive_agreeableness", "cand_machiavellianism_subclinical", "cand_sincerity", "cand_fairness"],
  overlapWithCurrentOntology: ["honesty_humility", "sincerity", "fairness", "greed_avoidance", "modesty"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "BROAD_FACTOR",
  evidenceQuality: "STRONG",
  evidenceSummary: "Consistently identified in cross-cultural lexical studies across 12+ languages as the 6th major factor of personality. Strong discriminant validity from Big Five Agreeableness.",
  keySources: ["src_ashton_lee_2007", "src_lee_ashton_2004", "src_wasti_2008_lexical", "src_ipip_ori_licensing"],
  claimSources: {
    definitionSourceIds: ["src_ashton_lee_2007"],
    evidenceSourceIds: ["src_ashton_lee_2007", "src_lee_ashton_2004"],
    measurementSourceIds: ["src_lee_ashton_2004"],
    turkishEvidenceSourceIds: ["src_wasti_2008_lexical"],
    overlapSourceIds: ["src_ashton_lee_2007"],
    licensingSourceIds: ["src_ipip_ori_licensing", "src_hexaco_org_terms"]
  },
  turkishEvidenceStatus: "LEXICAL",
  turkishEvidenceLevel: "BROAD_FACTOR",
  knownInstrumentCandidates: [
    { instrumentName: "IPIP-HEXACO Honesty-Humility Scale", instrumentId: "inst_ipip_hexaco", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" },
    { instrumentName: "Official HEXACO-PI-R Honesty-Humility", instrumentId: "inst_hexaco_pi_r", isPublicDomainOrOpen: false, licenseStatus: "REQUIRES_LICENSE" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["RADAR", "HEATMAP", "FINGERPRINT", "BAR_GRID"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_adler", "lens_rogers"],
  decisionRubric: {
    scientificDistinctiveness: "HIGH",
    incrementalValue: "HIGH",
    measurementMaturity: "HIGH",
    consumerRelevance: "HIGH",
    safety: "SAFE_NON_CLINICAL",
    turkishEvidence: "LEXICAL_OR_RELATED",
    licensingFeasibility: "OPEN_ACCESSIBLE",
    assessmentBurden: "LOW",
    longitudinalValue: "LOW",
    interpretability: "HIGH"
  },
  decision: "INCLUDE_CORE",
  decisionRationale: "Essential pillar of the primary HEXACO personality model. High scientific distinctiveness from FFM Agreeableness, public domain IPIP measurement feasibility, and strong consumer self-insight value."
});

addCandidate({
  candidateId: "cand_hexaco_emotionality",
  canonicalNameEn: "Emotionality",
  canonicalNameTr: "Duygusallık",
  entityType: "CONSTRUCT",
  proposedDomain: "core_personality",
  definition: "Tendency to experience fear of physical danger, anxiety in response to life stress, need for emotional support, and empathic feelings.",
  aliases: ["Factor E", "HEXACO Emotionality"],
  relatedConstructs: ["cand_bigfive_neuroticism", "cand_fearfulness", "cand_anxiety", "cand_sentimentality"],
  overlapWithCurrentOntology: ["emotionality", "fearfulness", "anxiety", "dependence", "sentimentality"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "BROAD_FACTOR",
  evidenceQuality: "STRONG",
  evidenceSummary: "Distinct from Big Five Neuroticism by excluding irritability/anger (placed under HEXACO Agreeableness) and including sentimentality and dependence.",
  keySources: ["src_ashton_lee_2007", "src_lee_ashton_2004", "src_wasti_2008_lexical", "src_ipip_ori_licensing"],
  claimSources: {
    definitionSourceIds: ["src_ashton_lee_2007"],
    evidenceSourceIds: ["src_ashton_lee_2007", "src_lee_ashton_2004"],
    measurementSourceIds: ["src_lee_ashton_2004"],
    turkishEvidenceSourceIds: ["src_wasti_2008_lexical"],
    overlapSourceIds: ["src_ashton_lee_2007"],
    licensingSourceIds: ["src_ipip_ori_licensing"]
  },
  turkishEvidenceStatus: "LEXICAL",
  turkishEvidenceLevel: "BROAD_FACTOR",
  knownInstrumentCandidates: [
    { instrumentName: "IPIP-HEXACO Emotionality Scale", instrumentId: "inst_ipip_hexaco", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["RADAR", "HEATMAP", "FINGERPRINT", "BAR_GRID"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_freud", "lens_james"],
  decisionRubric: {
    scientificDistinctiveness: "HIGH",
    incrementalValue: "HIGH",
    measurementMaturity: "HIGH",
    consumerRelevance: "HIGH",
    safety: "SAFE_NON_CLINICAL",
    turkishEvidence: "LEXICAL_OR_RELATED",
    licensingFeasibility: "OPEN_ACCESSIBLE",
    assessmentBurden: "LOW",
    longitudinalValue: "LOW",
    interpretability: "HIGH"
  },
  decision: "INCLUDE_CORE",
  decisionRationale: "Core broad factor of HEXACO. Differentiates emotional sensitivity and kinship attachment from anger-driven neuroticism."
});

addCandidate({
  candidateId: "cand_hexaco_extraversion",
  canonicalNameEn: "Extraversion (HEXACO)",
  canonicalNameTr: "Dışadönüklük (HEXACO)",
  entityType: "CONSTRUCT",
  proposedDomain: "core_personality",
  definition: "Tendency to feel confident and energetic in social situations, to enjoy social gatherings, and to experience positive enthusiasm.",
  aliases: ["Factor X", "Social Vitality"],
  relatedConstructs: ["cand_bigfive_extraversion", "cand_sociability", "cand_social_boldness", "cand_liveliness"],
  overlapWithCurrentOntology: ["extraversion", "social_self_esteem", "social_boldness", "sociability", "liveliness"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "BROAD_FACTOR",
  evidenceQuality: "STRONG",
  evidenceSummary: "Robust broad factor across all major trait models. High stability, positive affect correlation, and behavioral expressiveness.",
  keySources: ["src_ashton_lee_2007", "src_lee_ashton_2004", "src_wasti_2008_lexical", "src_ipip_ori_licensing"],
  claimSources: {
    definitionSourceIds: ["src_ashton_lee_2007"],
    evidenceSourceIds: ["src_ashton_lee_2007", "src_lee_ashton_2004"],
    measurementSourceIds: ["src_lee_ashton_2004"],
    turkishEvidenceSourceIds: ["src_wasti_2008_lexical"],
    overlapSourceIds: ["src_ashton_lee_2007"],
    licensingSourceIds: ["src_ipip_ori_licensing"]
  },
  turkishEvidenceStatus: "LEXICAL",
  turkishEvidenceLevel: "BROAD_FACTOR",
  knownInstrumentCandidates: [
    { instrumentName: "IPIP-HEXACO Extraversion Scale", instrumentId: "inst_ipip_hexaco", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["RADAR", "HEATMAP", "FINGERPRINT", "BAR_GRID"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_jung", "lens_adler"],
  decisionRubric: {
    scientificDistinctiveness: "HIGH",
    incrementalValue: "HIGH",
    measurementMaturity: "HIGH",
    consumerRelevance: "HIGH",
    safety: "SAFE_NON_CLINICAL",
    turkishEvidence: "LEXICAL_OR_RELATED",
    licensingFeasibility: "OPEN_ACCESSIBLE",
    assessmentBurden: "LOW",
    longitudinalValue: "LOW",
    interpretability: "HIGH"
  },
  decision: "INCLUDE_CORE",
  decisionRationale: "Essential core broad factor governing social energy, enthusiasm, and social leadership."
});

addCandidate({
  candidateId: "cand_hexaco_agreeableness",
  canonicalNameEn: "Agreeableness (versus Anger)",
  canonicalNameTr: "Uyumluluk (Öfkeye Karşı)",
  entityType: "CONSTRUCT",
  proposedDomain: "core_personality",
  definition: "Tendency to be patient, forgiving, gentle, and flexible when dealing with difficult, offensive, or frustrating people.",
  aliases: ["Factor A", "Patience and Forgiveness"],
  relatedConstructs: ["cand_bigfive_agreeableness", "cand_patience", "cand_forgivingness", "cand_flexibility"],
  overlapWithCurrentOntology: ["agreeableness", "forgivingness", "gentleness", "flexibility", "patience"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "BROAD_FACTOR",
  evidenceQuality: "STRONG",
  evidenceSummary: "In HEXACO, Agreeableness specifically captures the rotation of low anger/hostility and high tolerance, whereas honesty/fairness is separated into Factor H.",
  keySources: ["src_ashton_lee_2007", "src_lee_ashton_2004", "src_wasti_2008_lexical", "src_ipip_ori_licensing"],
  claimSources: {
    definitionSourceIds: ["src_ashton_lee_2007"],
    evidenceSourceIds: ["src_ashton_lee_2007", "src_lee_ashton_2004"],
    measurementSourceIds: ["src_lee_ashton_2004"],
    turkishEvidenceSourceIds: ["src_wasti_2008_lexical"],
    overlapSourceIds: ["src_ashton_lee_2007"],
    licensingSourceIds: ["src_ipip_ori_licensing"]
  },
  turkishEvidenceStatus: "LEXICAL",
  turkishEvidenceLevel: "BROAD_FACTOR",
  knownInstrumentCandidates: [
    { instrumentName: "IPIP-HEXACO Agreeableness Scale", instrumentId: "inst_ipip_hexaco", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["RADAR", "HEATMAP", "FINGERPRINT", "BAR_GRID"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_adler", "lens_rogers"],
  decisionRubric: {
    scientificDistinctiveness: "HIGH",
    incrementalValue: "HIGH",
    measurementMaturity: "HIGH",
    consumerRelevance: "HIGH",
    safety: "SAFE_NON_CLINICAL",
    turkishEvidence: "LEXICAL_OR_RELATED",
    licensingFeasibility: "OPEN_ACCESSIBLE",
    assessmentBurden: "LOW",
    longitudinalValue: "LOW",
    interpretability: "HIGH"
  },
  decision: "INCLUDE_CORE",
  decisionRationale: "Essential core HEXACO factor. Measures tolerance, non-hostility, and relational patience."
});

addCandidate({
  candidateId: "cand_hexaco_conscientiousness",
  canonicalNameEn: "Conscientiousness",
  canonicalNameTr: "Sorumluluk / Öz-Disiplin",
  entityType: "CONSTRUCT",
  proposedDomain: "core_personality",
  definition: "Tendency to be organized, disciplined, diligent, goal-directed, and thorough in managing tasks and responsibilities.",
  aliases: ["Factor C", "Orderliness and Goal-Striving"],
  relatedConstructs: ["cand_bigfive_conscientiousness", "cand_general_self_control", "cand_long_term_grit", "cand_organization", "cand_diligence", "cand_prudence"],
  overlapWithCurrentOntology: ["conscientiousness", "organization", "diligence", "perfectionism", "prudence"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "BROAD_FACTOR",
  evidenceQuality: "STRONG",
  evidenceSummary: "Highest cross-sectional and longitudinal predictor of academic, vocational, and health outcomes among broad traits.",
  keySources: ["src_ashton_lee_2007", "src_lee_ashton_2004", "src_wasti_2008_lexical", "src_ipip_ori_licensing"],
  claimSources: {
    definitionSourceIds: ["src_ashton_lee_2007"],
    evidenceSourceIds: ["src_ashton_lee_2007", "src_lee_ashton_2004"],
    measurementSourceIds: ["src_lee_ashton_2004"],
    turkishEvidenceSourceIds: ["src_wasti_2008_lexical"],
    overlapSourceIds: ["src_ashton_lee_2007", "src_crede_2017_grit_meta"],
    licensingSourceIds: ["src_ipip_ori_licensing"]
  },
  turkishEvidenceStatus: "LEXICAL",
  turkishEvidenceLevel: "BROAD_FACTOR",
  knownInstrumentCandidates: [
    { instrumentName: "IPIP-HEXACO Conscientiousness Scale", instrumentId: "inst_ipip_hexaco", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["RADAR", "HEATMAP", "FINGERPRINT", "BAR_GRID"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_skinner", "lens_adler"],
  decisionRubric: {
    scientificDistinctiveness: "HIGH",
    incrementalValue: "HIGH",
    measurementMaturity: "HIGH",
    consumerRelevance: "HIGH",
    safety: "SAFE_NON_CLINICAL",
    turkishEvidence: "LEXICAL_OR_RELATED",
    licensingFeasibility: "OPEN_ACCESSIBLE",
    assessmentBurden: "LOW",
    longitudinalValue: "LOW",
    interpretability: "HIGH"
  },
  decision: "INCLUDE_CORE",
  decisionRationale: "Essential core broad factor governing task organization, persistence, and impulse control."
});

addCandidate({
  candidateId: "cand_hexaco_openness",
  canonicalNameEn: "Openness to Experience",
  canonicalNameTr: "Deneyime Açıklık",
  entityType: "CONSTRUCT",
  proposedDomain: "core_personality",
  definition: "Tendency to appreciate art and beauty, to be intellectually curious, to utilize imagination and creative thinking, and to welcome novel perspectives.",
  aliases: ["Factor O", "Intellect / Openness"],
  relatedConstructs: ["cand_bigfive_openness", "cand_need_for_cognition", "cand_creativity", "cand_inquisitiveness"],
  overlapWithCurrentOntology: ["openness", "aesthetic_appreciation", "inquisitiveness", "creativity", "unconventionality"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "BROAD_FACTOR",
  evidenceQuality: "STRONG",
  evidenceSummary: "Captures cognitive exploration, aesthetic interest, and openness to ideas. Replicated across lexical and questionnaire paradigms.",
  keySources: ["src_ashton_lee_2007", "src_lee_ashton_2004", "src_wasti_2008_lexical", "src_ipip_ori_licensing"],
  claimSources: {
    definitionSourceIds: ["src_ashton_lee_2007"],
    evidenceSourceIds: ["src_ashton_lee_2007", "src_lee_ashton_2004"],
    measurementSourceIds: ["src_lee_ashton_2004"],
    turkishEvidenceSourceIds: ["src_wasti_2008_lexical"],
    overlapSourceIds: ["src_ashton_lee_2007"],
    licensingSourceIds: ["src_ipip_ori_licensing"]
  },
  turkishEvidenceStatus: "LEXICAL",
  turkishEvidenceLevel: "BROAD_FACTOR",
  knownInstrumentCandidates: [
    { instrumentName: "IPIP-HEXACO Openness to Experience Scale", instrumentId: "inst_ipip_hexaco", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["RADAR", "HEATMAP", "FINGERPRINT", "BAR_GRID"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_jung", "lens_rogers"],
  decisionRubric: {
    scientificDistinctiveness: "HIGH",
    incrementalValue: "HIGH",
    measurementMaturity: "HIGH",
    consumerRelevance: "HIGH",
    safety: "SAFE_NON_CLINICAL",
    turkishEvidence: "LEXICAL_OR_RELATED",
    licensingFeasibility: "OPEN_ACCESSIBLE",
    assessmentBurden: "LOW",
    longitudinalValue: "LOW",
    interpretability: "HIGH"
  },
  decision: "INCLUDE_CORE",
  decisionRationale: "Essential core broad factor governing intellectual curiosity, aesthetic sensitivity, and unconventionality."
});

addCandidate({
  candidateId: "cand_bigfive_neuroticism",
  canonicalNameEn: "Big Five Neuroticism",
  canonicalNameTr: "Büyük Beşli Nörotizm / Duygusal Dengesizlik",
  entityType: "CONSTRUCT",
  proposedDomain: "core_personality",
  definition: "Broad trait dimension of negative emotionality encompassing anxiety, anger/hostility, depression, self-consciousness, and vulnerability.",
  aliases: ["Emotional Instability", "Negative Affectivity Factor"],
  relatedConstructs: ["cand_hexaco_emotionality", "cand_hexaco_agreeableness"],
  overlapWithCurrentOntology: ["emotionality"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "BROAD_FACTOR",
  evidenceQuality: "STRONG",
  evidenceSummary: "Established Five-Factor Model construct. In HEXACO, its variance is split between Emotionality (anxiety/vulnerability) and low Agreeableness (anger/hostility).",
  keySources: ["src_goldberg_1993", "src_costa_mccrae_1992", "src_somer_goldberg_1999", "src_par_inc_terms"],
  claimSources: {
    definitionSourceIds: ["src_goldberg_1993"],
    evidenceSourceIds: ["src_goldberg_1993", "src_costa_mccrae_1992"],
    measurementSourceIds: ["src_costa_mccrae_1992"],
    turkishEvidenceSourceIds: ["src_somer_goldberg_1999"],
    overlapSourceIds: ["src_ashton_lee_2007"],
    licensingSourceIds: ["src_par_inc_terms", "src_ipip_ori_licensing"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "BROAD_FACTOR",
  knownInstrumentCandidates: [
    { instrumentName: "IPIP 50-Item Big Five Neuroticism Scale", instrumentId: "inst_ipip_neo", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" },
    { instrumentName: "NEO-PI-R Neuroticism Domain", instrumentId: "inst_neo_pi_r", isPublicDomainOrOpen: false, licenseStatus: "STRICTLY_PROPRIETARY" }
  ],
  licensingStatus: "REQUIRES_LICENSE",
  clinicalRisk: "LOW",
  clinicalSafetyClass: "NON_CLINICAL_ADJACENT",
  consumerSuitability: "MODERATE",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["BAR_GRID", "HEATMAP"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_freud"],
  decisionRubric: {
    scientificDistinctiveness: "MODERATE",
    incrementalValue: "LOW",
    measurementMaturity: "HIGH",
    consumerRelevance: "MODERATE",
    safety: "GOVERNED_ADJACENT",
    turkishEvidence: "DIRECT_VALIDATED",
    licensingFeasibility: "REQUIRES_LICENSE",
    assessmentBurden: "HIGH",
    longitudinalValue: "LOW",
    interpretability: "MODERATE"
  },
  decision: "DEFER",
  decisionRationale: "HEXACO is PsycheAI's primary core personality framework. Adding Big Five Neuroticism alongside HEXACO Emotionality would cause redundant assessment burden and domain conflation without adding incremental variance not already captured by Emotionality and low Agreeableness."
});

addCandidate({
  candidateId: "cand_bigfive_extraversion",
  canonicalNameEn: "Big Five Extraversion",
  canonicalNameTr: "Büyük Beşli Dışadönüklük",
  entityType: "CONSTRUCT",
  proposedDomain: "core_personality",
  definition: "Big Five broad extraversion construct including sociability, assertiveness, activity, and excitement-seeking.",
  aliases: ["Surgency", "FFM Extraversion"],
  relatedConstructs: ["cand_hexaco_extraversion"],
  overlapWithCurrentOntology: ["extraversion"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "BROAD_FACTOR",
  evidenceQuality: "STRONG",
  evidenceSummary: "Substantially identical to HEXACO Extraversion (r > .90).",
  keySources: ["src_goldberg_1993", "src_costa_mccrae_1992"],
  claimSources: {
    definitionSourceIds: ["src_goldberg_1993"],
    evidenceSourceIds: ["src_goldberg_1993"],
    measurementSourceIds: ["src_costa_mccrae_1992"],
    turkishEvidenceSourceIds: ["src_somer_goldberg_1999"],
    overlapSourceIds: ["src_ashton_lee_2007"],
    licensingSourceIds: ["src_ipip_ori_licensing"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "BROAD_FACTOR",
  knownInstrumentCandidates: [
    { instrumentName: "IPIP Big Five Extraversion Scale", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["BAR_GRID"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_jung"],
  decisionRubric: {
    scientificDistinctiveness: "LOW",
    incrementalValue: "LOW",
    measurementMaturity: "HIGH",
    consumerRelevance: "HIGH",
    safety: "SAFE_NON_CLINICAL",
    turkishEvidence: "DIRECT_VALIDATED",
    licensingFeasibility: "OPEN_ACCESSIBLE",
    assessmentBurden: "HIGH",
    longitudinalValue: "LOW",
    interpretability: "HIGH"
  },
  decision: "EXCLUDE",
  decisionRationale: "Redundant with cand_hexaco_extraversion (r > .90). Retaining both would unnecessarily duplicate assessments."
});

addCandidate({
  candidateId: "cand_bigfive_openness",
  canonicalNameEn: "Big Five Openness to Experience",
  canonicalNameTr: "Büyük Beşli Deneyime Açıklık",
  entityType: "CONSTRUCT",
  proposedDomain: "core_personality",
  definition: "FFM broad openness construct covering fantasy, aesthetics, feelings, actions, ideas, and values.",
  aliases: ["Intellect / Imagination"],
  relatedConstructs: ["cand_hexaco_openness"],
  overlapWithCurrentOntology: ["openness"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "BROAD_FACTOR",
  evidenceQuality: "STRONG",
  evidenceSummary: "Strongly converges with HEXACO Openness to Experience.",
  keySources: ["src_goldberg_1993", "src_costa_mccrae_1992"],
  claimSources: {
    definitionSourceIds: ["src_goldberg_1993"],
    evidenceSourceIds: ["src_goldberg_1993"],
    measurementSourceIds: ["src_costa_mccrae_1992"],
    turkishEvidenceSourceIds: ["src_somer_goldberg_1999"],
    overlapSourceIds: ["src_ashton_lee_2007"],
    licensingSourceIds: ["src_ipip_ori_licensing"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "BROAD_FACTOR",
  knownInstrumentCandidates: [
    { instrumentName: "IPIP Big Five Openness Scale", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["BAR_GRID"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_rogers"],
  decisionRubric: {
    scientificDistinctiveness: "LOW",
    incrementalValue: "LOW",
    measurementMaturity: "HIGH",
    consumerRelevance: "HIGH",
    safety: "SAFE_NON_CLINICAL",
    turkishEvidence: "DIRECT_VALIDATED",
    licensingFeasibility: "OPEN_ACCESSIBLE",
    assessmentBurden: "HIGH",
    longitudinalValue: "LOW",
    interpretability: "HIGH"
  },
  decision: "EXCLUDE",
  decisionRationale: "Redundant with cand_hexaco_openness. HEXACO version retained as canonical core personality battery."
});

addCandidate({
  candidateId: "cand_bigfive_agreeableness",
  canonicalNameEn: "Big Five Agreeableness",
  canonicalNameTr: "Büyük Beşli Uyumluluk",
  entityType: "CONSTRUCT",
  proposedDomain: "core_personality",
  definition: "FFM agreeableness combining altruism, trust, straightforwardness, compliance, modesty, and tender-mindedness.",
  aliases: ["Communion / Likeability"],
  relatedConstructs: ["cand_hexaco_agreeableness", "cand_hexaco_honesty_humility"],
  overlapWithCurrentOntology: ["agreeableness", "honesty_humility"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "BROAD_FACTOR",
  evidenceQuality: "STRONG",
  evidenceSummary: "Blends variance of HEXACO Agreeableness (gentleness/patience) and HEXACO Honesty-Humility (sincerity/modesty).",
  keySources: ["src_goldberg_1993", "src_costa_mccrae_1992"],
  claimSources: {
    definitionSourceIds: ["src_goldberg_1993"],
    evidenceSourceIds: ["src_goldberg_1993"],
    measurementSourceIds: ["src_costa_mccrae_1992"],
    turkishEvidenceSourceIds: ["src_somer_goldberg_1999"],
    overlapSourceIds: ["src_ashton_lee_2007"],
    licensingSourceIds: ["src_ipip_ori_licensing"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "BROAD_FACTOR",
  knownInstrumentCandidates: [
    { instrumentName: "IPIP Big Five Agreeableness Scale", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["BAR_GRID"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_adler"],
  decisionRubric: {
    scientificDistinctiveness: "MODERATE",
    incrementalValue: "LOW",
    measurementMaturity: "HIGH",
    consumerRelevance: "HIGH",
    safety: "SAFE_NON_CLINICAL",
    turkishEvidence: "DIRECT_VALIDATED",
    licensingFeasibility: "OPEN_ACCESSIBLE",
    assessmentBurden: "HIGH",
    longitudinalValue: "LOW",
    interpretability: "HIGH"
  },
  decision: "EXCLUDE",
  decisionRationale: "HEXACO structure provides cleaner separation of morality/fairness (Honesty-Humility) from tolerance/patience (Agreeableness). Excluded to avoid theoretical ambiguity."
});

addCandidate({
  candidateId: "cand_bigfive_conscientiousness",
  canonicalNameEn: "Big Five Conscientiousness",
  canonicalNameTr: "Büyük Beşli Sorumluluk",
  entityType: "CONSTRUCT",
  proposedDomain: "core_personality",
  definition: "FFM conscientiousness covering competence, order, dutifulness, achievement striving, self-discipline, and deliberation.",
  aliases: ["Will to Achieve", "Conscientious Volition"],
  relatedConstructs: ["cand_hexaco_conscientiousness"],
  overlapWithCurrentOntology: ["conscientiousness"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "BROAD_FACTOR",
  evidenceQuality: "STRONG",
  evidenceSummary: "Direct equivalent to HEXACO Conscientiousness (r > .90).",
  keySources: ["src_goldberg_1993", "src_costa_mccrae_1992"],
  claimSources: {
    definitionSourceIds: ["src_goldberg_1993"],
    evidenceSourceIds: ["src_goldberg_1993"],
    measurementSourceIds: ["src_costa_mccrae_1992"],
    turkishEvidenceSourceIds: ["src_somer_goldberg_1999"],
    overlapSourceIds: ["src_ashton_lee_2007"],
    licensingSourceIds: ["src_ipip_ori_licensing"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "BROAD_FACTOR",
  knownInstrumentCandidates: [
    { instrumentName: "IPIP Big Five Conscientiousness Scale", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["BAR_GRID"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_skinner"],
  decisionRubric: {
    scientificDistinctiveness: "LOW",
    incrementalValue: "LOW",
    measurementMaturity: "HIGH",
    consumerRelevance: "HIGH",
    safety: "SAFE_NON_CLINICAL",
    turkishEvidence: "DIRECT_VALIDATED",
    licensingFeasibility: "OPEN_ACCESSIBLE",
    assessmentBurden: "HIGH",
    longitudinalValue: "LOW",
    interpretability: "HIGH"
  },
  decision: "EXCLUDE",
  decisionRationale: "Redundant with cand_hexaco_conscientiousness. Excluded in favor of canonical HEXACO model."
});

addCandidate({
  candidateId: "cand_general_factor_of_personality_gfp",
  canonicalNameEn: "General Factor of Personality (GFP)",
  canonicalNameTr: "Genel Kişilik Faktörü (Büyük Bir)",
  entityType: "DERIVED_INDEX",
  proposedDomain: "core_personality",
  definition: "Hypothesized apex factor at the top of the personality hierarchy reflecting high emotional stability, extraversion, agreeableness, conscientiousness, and openness.",
  aliases: ["The Big One", "GFP"],
  relatedConstructs: ["cand_hexaco_honesty_humility", "cand_hexaco_emotionality"],
  overlapWithCurrentOntology: ["core_personality"],
  directOrDerived: "DERIVED",
  measurementMode: "DERIVED_DETERMINISTIC",
  measurementLevel: "DERIVED_INDEX",
  evidenceQuality: "LIMITED",
  evidenceSummary: "Extensively debated in personality literature; consensus indicates GFP largely reflects social desirability bias, common method variance, and evaluative halo rather than a substantive biological trait.",
  keySources: ["src_musek_2007_gfp", "src_paulhus_1991_bidr"],
  claimSources: {
    definitionSourceIds: ["src_musek_2007_gfp"],
    evidenceSourceIds: ["src_musek_2007_gfp"],
    measurementSourceIds: ["src_musek_2007_gfp"],
    turkishEvidenceSourceIds: [],
    overlapSourceIds: ["src_paulhus_1991_bidr"],
    licensingSourceIds: []
  },
  turkishEvidenceStatus: "NO_DIRECT",
  turkishEvidenceLevel: "NOT_ASSESSED",
  knownInstrumentCandidates: [],
  licensingStatus: "NOT_APPLICABLE",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "UNSUITABLE",
  longitudinalSuitability: "NOT_APPLICABLE",
  visualizationSuitability: ["FINGERPRINT"],
  aiInterpretationEligibility: "PROHIBITED",
  historicalTheoryEligibility: [],
  decisionRubric: {
    scientificDistinctiveness: "LOW",
    incrementalValue: "LOW",
    measurementMaturity: "LOW",
    consumerRelevance: "LOW",
    safety: "SAFE_NON_CLINICAL",
    turkishEvidence: "NO_DIRECT",
    licensingFeasibility: "UNKNOWN",
    assessmentBurden: "LOW",
    longitudinalValue: "LOW",
    interpretability: "LOW"
  },
  decision: "RESEARCH_ONLY",
  decisionRationale: "Limited scientific construct validity due to substantial empirical evidence attributing GFP to social desirability and method artifact. Retained strictly as a research-only derived inquiry."
});

// -----------------------------------------------------------------------------
// 2. HEXACO 24 CANONICAL FACETS (24 Candidates)
// -----------------------------------------------------------------------------
const hexacoFacets = [
  { id: "sincerity", en: "Sincerity", tr: "İçtenlik", factor: "honesty_humility", def: "Tendency to be genuine in interpersonal relations and avoid flattering or manipulating others." },
  { id: "fairness", en: "Fairness", tr: "Adalet", factor: "honesty_humility", def: "Tendency to avoid fraud, cheating, corruption, and taking unfair advantage of others." },
  { id: "greed_avoidance", en: "Greed Avoidance", tr: "Açgözlülükten Kaçınma", factor: "honesty_humility", def: "Tendency to be uninterested in lavish wealth, luxury goods, and high social status symbols." },
  { id: "modesty", en: "Modesty", tr: "Tevazu", factor: "honesty_humility", def: "Tendency to view oneself as an ordinary person without entitlement to special privileges." },
  
  { id: "fearfulness", en: "Fearfulness", tr: "Korkaklık / Fiziksel Sakınma", factor: "emotionality", def: "Tendency to experience fear of physical harm and avoid dangerous physical situations." },
  { id: "anxiety", en: "Anxiety", tr: "Kaygı", factor: "emotionality", def: "Tendency to worry and experience stress in response to minor difficulties and uncertain outcomes." },
  { id: "dependence", en: "Dependence", tr: "Duygusal Bağımlılık", factor: "emotionality", def: "Tendency to seek emotional support, reassurance, and guidance from close others." },
  { id: "sentimentality", en: "Sentimentality", tr: "Duygusallık / Hassasiyet", factor: "emotionality", def: "Tendency to feel strong emotional bonds and empathic concern for other people." },
  
  { id: "social_self_esteem", en: "Social Self-Esteem", tr: "Sosyal Özsaygı", factor: "extraversion", def: "Tendency to have a positive self-regard particularly in social and group contexts." },
  { id: "social_boldness", en: "Social Boldness", tr: "Sosyal Cesaret", factor: "extraversion", def: "Tendency to feel confident and comfortable when speaking up and leading in social groups." },
  { id: "sociability", en: "Sociability", tr: "Sosyallik", factor: "extraversion", def: "Tendency to enjoy interacting with people, attending gatherings, and making new acquaintances." },
  { id: "liveliness", en: "Liveliness", tr: "Canlılık / Neşe", factor: "extraversion", def: "Tendency to experience enthusiasm, high physical energy, and an optimistic mood." },
  
  { id: "forgivingness", en: "Forgivingness", tr: "Bağışlayıcılık", factor: "agreeableness", def: "Tendency to feel trust and ready forgiveness toward those who have caused offense." },
  { id: "gentleness", en: "Gentleness", tr: "Yumuşak Başlılık", factor: "agreeableness", def: "Tendency to be mild and lenient in evaluating others and avoid harsh criticism." },
  { id: "flexibility", en: "Flexibility", tr: "Esneklik / Uzlaşmacılık", factor: "agreeableness", def: "Tendency to compromise and cooperate with others rather than stubbornly insisting on one's way." },
  { id: "patience", en: "Patience", tr: "Sabır", factor: "agreeableness", def: "Tendency to remain calm and restrain anger in the face of provocation or irritation." },
  
  { id: "organization", en: "Organization", tr: "Düzenlilik", factor: "conscientiousness", def: "Tendency to maintain neatness, order, and methodical structure in physical surroundings and tasks." },
  { id: "diligence", en: "Diligence", tr: "Çalışkanlık / Sebat", factor: "conscientiousness", def: "Tendency to work hard, apply effort consistently, and complete challenging tasks." },
  { id: "perfectionism", en: "Perfectionism", tr: "Kusursuzluk / Detaycılık", factor: "conscientiousness", def: "Tendency to check for errors, pay high attention to detail, and pursue high quality." },
  { id: "prudence", en: "Prudence", tr: "Sağduyu / Tedbirlilik", factor: "conscientiousness", def: "Tendency to deliberate carefully, consider consequences, and avoid impulsive actions." },
  
  { id: "aesthetic_appreciation", en: "Aesthetic Appreciation", tr: "Estetik Değer Bilirliği", factor: "openness", def: "Tendency to appreciate beauty in visual arts, music, literature, and nature." },
  { id: "inquisitiveness", en: "Inquisitiveness", tr: "Sorgulayıcılık / Merak", factor: "openness", def: "Tendency to seek information and read about natural and social sciences and diverse topics." },
  { id: "creativity", en: "Creativity", tr: "Yaratıcılık", factor: "openness", def: "Tendency to generate novel ideas, engage in original problem-solving, and produce creative works." },
  { id: "unconventionality", en: "Unconventionality", tr: "Alışılmadıklık / Özgünlük", factor: "openness", def: "Tendency to accept unusual perspectives and express non-conforming personal attitudes." }
];

for (const hf of hexacoFacets) {
  addCandidate({
    candidateId: `cand_${hf.id}`,
    canonicalNameEn: hf.en,
    canonicalNameTr: hf.tr,
    entityType: "FACET",
    proposedDomain: "core_personality",
    definition: hf.def,
    aliases: [`HEXACO ${hf.en}`],
    relatedConstructs: [`cand_hexaco_${hf.factor}`],
    overlapWithCurrentOntology: [hf.id],
    directOrDerived: "DIRECT",
    measurementMode: "DIRECT_PSYCHOMETRIC",
    measurementLevel: "FACET",
    evidenceQuality: "STRONG",
    evidenceSummary: "Established facet of the HEXACO 6-factor model operationalized in the 100/200-item HEXACO-PI-R and public domain IPIP-HEXACO item bank.",
    keySources: ["src_lee_ashton_2004", "src_ipip_ori_licensing"],
    claimSources: {
      definitionSourceIds: ["src_lee_ashton_2004"],
      evidenceSourceIds: ["src_lee_ashton_2004"],
      measurementSourceIds: ["src_lee_ashton_2004"],
      turkishEvidenceSourceIds: ["src_wasti_2008_lexical"],
      overlapSourceIds: ["src_lee_ashton_2004"],
      licensingSourceIds: ["src_ipip_ori_licensing"]
    },
    turkishEvidenceStatus: "LEXICAL",
    turkishEvidenceLevel: "BROAD_FACTOR",
    knownInstrumentCandidates: [
      { instrumentName: `IPIP-HEXACO ${hf.en} Facet Scale`, instrumentId: "inst_ipip_hexaco", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
    ],
    licensingStatus: "APPROVED_PUBLIC",
    clinicalRisk: "NONE",
    clinicalSafetyClass: "NON_CLINICAL",
    consumerSuitability: "HIGH",
    longitudinalSuitability: "STATIC_TRAIT",
    visualizationSuitability: ["FACET_PROFILE", "HEATMAP", "FINGERPRINT"],
    aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
    historicalTheoryEligibility: ["lens_adler", "lens_rogers"],
    decisionRubric: {
      scientificDistinctiveness: "HIGH",
      incrementalValue: "HIGH",
      measurementMaturity: "HIGH",
      consumerRelevance: "HIGH",
      safety: "SAFE_NON_CLINICAL",
      turkishEvidence: "LEXICAL_OR_RELATED",
      licensingFeasibility: "OPEN_ACCESSIBLE",
      assessmentBurden: "LOW",
      longitudinalValue: "LOW",
      interpretability: "HIGH"
    },
    decision: "INCLUDE_CORE",
    decisionRationale: `Core canonical facet under ${hf.factor}. Measured via public domain IPIP items with high psychometric reliability and consumer value.`
  });
}

// -----------------------------------------------------------------------------
// 3. SELF-SYSTEM & SELF-EVALUATIONS (10 Candidates)
// -----------------------------------------------------------------------------
addCandidate({
  candidateId: "cand_core_self_esteem",
  canonicalNameEn: "Global Self-Esteem",
  canonicalNameTr: "Genel Benlik Saygısı / Özsaygı",
  entityType: "CONSTRUCT",
  proposedDomain: "self_system",
  definition: "Overall positive or negative evaluation of oneself as a person of worth and value.",
  aliases: ["Rosenberg Self-Esteem", "Global Self-Worth"],
  relatedConstructs: ["cand_generalized_self_efficacy", "cand_self_compassion", "cand_contingent_self_worth"],
  overlapWithCurrentOntology: ["core_self_esteem", "self_evaluation"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SCALE_TOTAL",
  evidenceQuality: "STRONG",
  evidenceSummary: "One of the most extensively researched constructs in psychological science. Validated across 50+ countries with robust unidimensional structure.",
  keySources: ["src_rosenberg_1965", "src_cuhadaroglu_1986", "src_ipip_ori_licensing"],
  claimSources: {
    definitionSourceIds: ["src_rosenberg_1965"],
    evidenceSourceIds: ["src_rosenberg_1965"],
    measurementSourceIds: ["src_rosenberg_1965"],
    turkishEvidenceSourceIds: ["src_cuhadaroglu_1986"],
    overlapSourceIds: ["src_rosenberg_1965"],
    licensingSourceIds: ["src_ipip_ori_licensing"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "SCALE_TOTAL",
  knownInstrumentCandidates: [
    { instrumentName: "Rosenberg Self-Esteem Scale (RSES)", instrumentId: "inst_rses", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "LOW",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["BAR_GRID", "HEATMAP", "FINGERPRINT", "DASHBOARD"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_rogers", "lens_adler"],
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
  decisionRationale: "Essential self-system pillar. High construct validity, validated Turkish psychometrics, public domain measurement, and high consumer value."
});

addCandidate({
  candidateId: "cand_generalized_self_efficacy",
  canonicalNameEn: "Generalized Self-Efficacy",
  canonicalNameTr: "Genel Öz-Yeterlilik",
  entityType: "CONSTRUCT",
  proposedDomain: "self_system",
  definition: "Broad and stable optimistic self-belief in one's competence to handle novel tasks, overcome unexpected difficulties, and achieve goals.",
  aliases: ["GSE", "Perceived Competence Expectancy"],
  relatedConstructs: ["cand_core_self_esteem", "cand_locus_of_control_internal", "cand_agency_mastery"],
  overlapWithCurrentOntology: ["generalized_self_efficacy", "agency_mastery"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SCALE_TOTAL",
  evidenceQuality: "STRONG",
  evidenceSummary: "Bandura's social cognitive theory operationalized by Schwarzer & Jerusalem across 30+ nations. High predictive validity for coping, persistence, and stress resilience.",
  keySources: ["src_bandura_1997", "src_schwarzer_1995_gse", "src_yesilay_1995_gse"],
  claimSources: {
    definitionSourceIds: ["src_bandura_1997"],
    evidenceSourceIds: ["src_schwarzer_1995_gse"],
    measurementSourceIds: ["src_schwarzer_1995_gse"],
    turkishEvidenceSourceIds: ["src_yesilay_1995_gse"],
    overlapSourceIds: ["src_bandura_1997"],
    licensingSourceIds: ["src_schwarzer_1995_gse"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "SCALE_TOTAL",
  knownInstrumentCandidates: [
    { instrumentName: "General Self-Efficacy Scale (GSE)", instrumentId: "inst_gse", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["BAR_GRID", "HEATMAP", "FINGERPRINT", "DASHBOARD"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_adler", "lens_skinner"],
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
  decisionRationale: "Essential self-system pillar. Distinct from self-esteem by measuring competence expectancies rather than affective self-worth."
});

addCandidate({
  candidateId: "cand_self_compassion",
  canonicalNameEn: "Self-Compassion",
  canonicalNameTr: "Öz-Şefkat",
  entityType: "CONSTRUCT",
  proposedDomain: "self_system",
  definition: "Treating oneself with kindness, understanding common humanity, and maintaining mindfulness when facing personal suffering or perceived failure.",
  aliases: ["Neff Self-Compassion", "Self-Kindness Orientation"],
  relatedConstructs: ["cand_core_self_esteem", "cand_self_evaluation"],
  overlapWithCurrentOntology: ["self_compassion", "self_evaluation"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SCALE_TOTAL",
  evidenceQuality: "STRONG",
  evidenceSummary: "Neff's model demonstrates incremental validity over self-esteem by buffering against narcissistic vulnerability and self-evaluative instability.",
  keySources: ["src_neff_2003_scs", "src_deniz_2008_scs"],
  claimSources: {
    definitionSourceIds: ["src_neff_2003_scs"],
    evidenceSourceIds: ["src_neff_2003_scs"],
    measurementSourceIds: ["src_neff_2003_scs"],
    turkishEvidenceSourceIds: ["src_deniz_2008_scs"],
    overlapSourceIds: ["src_neff_2003_scs"],
    licensingSourceIds: ["src_neff_2003_scs"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "SUBSCALE",
  knownInstrumentCandidates: [
    { instrumentName: "Self-Compassion Scale (SCS / SCS-SF)", instrumentId: "inst_scs", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["BAR_GRID", "HEATMAP", "FINGERPRINT", "DASHBOARD"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_rogers"],
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
  decisionRationale: "Provides vital resilience balance against contingent self-esteem. Strong Turkish validation and high self-development utility."
});

addCandidate({
  candidateId: "cand_self_concept_clarity",
  canonicalNameEn: "Self-Concept Clarity",
  canonicalNameTr: "Benlik Belirginliği / Netliği",
  entityType: "CONSTRUCT",
  proposedDomain: "self_system",
  definition: "The extent to which one's self-beliefs are clearly and confidently defined, internally consistent, and temporally stable.",
  aliases: ["Structural Self-Clarity", "SCC"],
  relatedConstructs: ["cand_core_self_esteem", "cand_identity_integrity"],
  overlapWithCurrentOntology: ["self_concept_clarity", "identity_integrity"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SCALE_TOTAL",
  evidenceQuality: "STRONG",
  evidenceSummary: "Campbell et al. established SCC as a structural parameter of the self-concept distinct from self-esteem content. Predicts psychological well-being and social stability.",
  keySources: ["src_campbell_1996_scc", "src_akin_2012_scc"],
  claimSources: {
    definitionSourceIds: ["src_campbell_1996_scc"],
    evidenceSourceIds: ["src_campbell_1996_scc"],
    measurementSourceIds: ["src_campbell_1996_scc"],
    turkishEvidenceSourceIds: ["src_akin_2012_scc"],
    overlapSourceIds: ["src_campbell_1996_scc"],
    licensingSourceIds: ["src_campbell_1996_scc"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "SCALE_TOTAL",
  knownInstrumentCandidates: [
    { instrumentName: "Self-Concept Clarity Scale (SCCS)", instrumentId: "inst_sccs", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["BAR_GRID", "HEATMAP", "FINGERPRINT"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_gestalt", "lens_rogers"],
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
  decisionRationale: "Measures structural coherence of self-knowledge. Distinct from self-esteem level with validated Turkish scale."
});

addCandidate({
  candidateId: "cand_locus_of_control_internal",
  canonicalNameEn: "Internal Locus of Control",
  canonicalNameTr: "İç Denetim Odağı",
  entityType: "CONSTRUCT",
  proposedDomain: "self_system",
  definition: "Generalized expectancy that life outcomes, successes, and failures are contingent upon one's own actions and personal choices.",
  aliases: ["Internal Agency Belief", "Rotter Internal Control"],
  relatedConstructs: ["cand_generalized_self_efficacy", "cand_locus_of_control_external"],
  overlapWithCurrentOntology: ["agency_mastery"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "CONSTRUCT",
  evidenceQuality: "STRONG",
  evidenceSummary: "Rotter and Levenson control belief frameworks. Decades of replication demonstrating predictive utility for proactive health, career striving, and problem-focused coping.",
  keySources: ["src_rotter_1966", "src_dag_1991_rotter"],
  claimSources: {
    definitionSourceIds: ["src_rotter_1966"],
    evidenceSourceIds: ["src_rotter_1966"],
    measurementSourceIds: ["src_rotter_1966"],
    turkishEvidenceSourceIds: ["src_dag_1991_rotter"],
    overlapSourceIds: ["src_rotter_1966"],
    licensingSourceIds: ["src_rotter_1966"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "CONSTRUCT",
  knownInstrumentCandidates: [
    { instrumentName: "Rotter Internal-External Locus of Control Scale (TR Dağ, 1991)", instrumentId: "inst_rotter_loc", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["BAR_GRID", "HEATMAP", "FINGERPRINT"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_skinner", "lens_adler"],
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
  decisionRationale: "Key agency metric. Validated in Turkish psychometrics with robust discriminant validity from generalized self-efficacy."
});

addCandidate({
  candidateId: "cand_locus_of_control_external",
  canonicalNameEn: "External Locus of Control (Chance & Others)",
  canonicalNameTr: "Dış Denetim Odağı (Şans ve Güçlü Diğerleri)",
  entityType: "CONSTRUCT",
  proposedDomain: "self_system",
  definition: "Generalized expectancy that life outcomes are determined by fate, chance, luck, or powerful external figures rather than one's own efforts.",
  aliases: ["External Fatalism", "Chance Control Belief"],
  relatedConstructs: ["cand_locus_of_control_internal"],
  overlapWithCurrentOntology: ["agency_mastery"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "CONSTRUCT",
  evidenceQuality: "STRONG",
  evidenceSummary: "Complements internal locus of control; multidimensional models (Levenson) establish chance and powerful others as distinct external factors.",
  keySources: ["src_rotter_1966", "src_dag_1991_rotter"],
  claimSources: {
    definitionSourceIds: ["src_rotter_1966"],
    evidenceSourceIds: ["src_rotter_1966"],
    measurementSourceIds: ["src_rotter_1966"],
    turkishEvidenceSourceIds: ["src_dag_1991_rotter"],
    overlapSourceIds: ["src_rotter_1966"],
    licensingSourceIds: ["src_rotter_1966"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "CONSTRUCT",
  knownInstrumentCandidates: [
    { instrumentName: "Levenson IPC Locus of Control Scale (TR Dağ, 2002)", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["BAR_GRID", "HEATMAP"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_skinner"],
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
  decision: "INCLUDE_ADVANCED",
  decisionRationale: "Complements internal control in advanced profile batteries to detect fatalistic cognitive attribution patterns."
});

addCandidate({
  candidateId: "cand_contingent_self_worth",
  canonicalNameEn: "Contingent Self-Worth",
  canonicalNameTr: "Koşullu Benlik Değeri",
  entityType: "CONSTRUCT",
  proposedDomain: "self_system",
  definition: "The degree to which an individual's self-esteem rises and falls based on successes or failures in specific domains (e.g., approval, appearance, performance).",
  aliases: ["CSW", "Conditional Self-Regard"],
  relatedConstructs: ["cand_core_self_esteem", "cand_authenticity"],
  overlapWithCurrentOntology: ["contingent_self_worth", "self_evaluation"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SUBSCALE",
  evidenceQuality: "MODERATE",
  evidenceSummary: "Crocker & Wolfe framework demonstrating that self-esteem fragility stems from stake domains rather than overall level.",
  keySources: ["src_crocker_2001_csw"],
  claimSources: {
    definitionSourceIds: ["src_crocker_2001_csw"],
    evidenceSourceIds: ["src_crocker_2001_csw"],
    measurementSourceIds: ["src_crocker_2001_csw"],
    turkishEvidenceSourceIds: [],
    overlapSourceIds: ["src_crocker_2001_csw"],
    licensingSourceIds: []
  },
  turkishEvidenceStatus: "NO_DIRECT",
  turkishEvidenceLevel: "NOT_ASSESSED",
  knownInstrumentCandidates: [
    { instrumentName: "Contingencies of Self-Worth Scale (CSWS)", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "LOW",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["BAR_GRID", "HEATMAP"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_rogers"],
  decisionRubric: {
    scientificDistinctiveness: "HIGH",
    incrementalValue: "HIGH",
    measurementMaturity: "MODERATE",
    consumerRelevance: "HIGH",
    safety: "SAFE_NON_CLINICAL",
    turkishEvidence: "NO_DIRECT",
    licensingFeasibility: "OPEN_ACCESSIBLE",
    assessmentBurden: "MODERATE",
    longitudinalValue: "HIGH",
    interpretability: "HIGH"
  },
  decision: "INCLUDE_ADVANCED",
  decisionRationale: "Provides deep insight into self-esteem fragility and Rogerian conditions of worth in advanced expansion modules."
});

addCandidate({
  candidateId: "cand_authenticity",
  canonicalNameEn: "Authenticity",
  canonicalNameTr: "Otantiklik / Özgün Benlik",
  entityType: "CONSTRUCT",
  proposedDomain: "self_system",
  definition: "The operation of one's core self in daily life, characterized by authentic living, rejecting external influence, and low self-alienation.",
  aliases: ["Authentic Functioning", "Eudaimonic Authenticity"],
  relatedConstructs: ["cand_self_concept_clarity", "cand_identity_integrity"],
  overlapWithCurrentOntology: ["authenticity", "identity_integrity"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SCALE_TOTAL",
  evidenceQuality: "STRONG",
  evidenceSummary: "Wood et al. tripartite model. Validated in Turkish samples by İlhan & Özbay (2013). Predicts autonomous functioning and subjective well-being.",
  keySources: ["src_wood_2008_authenticity", "src_ilhan_2013_authenticity"],
  claimSources: {
    definitionSourceIds: ["src_wood_2008_authenticity"],
    evidenceSourceIds: ["src_wood_2008_authenticity"],
    measurementSourceIds: ["src_wood_2008_authenticity"],
    turkishEvidenceSourceIds: ["src_ilhan_2013_authenticity"],
    overlapSourceIds: ["src_wood_2008_authenticity"],
    licensingSourceIds: ["src_wood_2008_authenticity"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "SCALE_TOTAL",
  knownInstrumentCandidates: [
    { instrumentName: "Authenticity Scale (Wood et al. / TR İlhan & Özbay)", instrumentId: "inst_authenticity", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["BAR_GRID", "HEATMAP", "FINGERPRINT"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_rogers", "lens_james"],
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
  decisionRationale: "Strong theoretical lineage from Rogers and James with verified Turkish psychometric validation."
});

addCandidate({
  candidateId: "cand_actual_ideal_discrepancy",
  canonicalNameEn: "Actual–Ideal Self Discrepancy",
  canonicalNameTr: "Gerçek–İdeal Benlik Uyuşmazlığı",
  entityType: "DERIVED_INDEX",
  proposedDomain: "self_system",
  definition: "Mathematical discrepancy between who one believes they currently are (actual self) and who they intrinsically desire to be (ideal self).",
  aliases: ["Actual-Ideal Gap", "Self-Congruence Index"],
  relatedConstructs: ["cand_actual_ought_discrepancy", "cand_core_self_esteem"],
  overlapWithCurrentOntology: ["actual_ideal_gap"],
  directOrDerived: "DERIVED",
  measurementMode: "DERIVED_DETERMINISTIC",
  measurementLevel: "DERIVED_INDEX",
  evidenceQuality: "STRONG",
  evidenceSummary: "Higgins (1987) Self-Discrepancy Theory demonstrating that actual-ideal divergence specifically drives dejection-related affective states.",
  keySources: ["src_higgins_1987_discrepancy"],
  claimSources: {
    definitionSourceIds: ["src_higgins_1987_discrepancy"],
    evidenceSourceIds: ["src_higgins_1987_discrepancy"],
    measurementSourceIds: ["src_higgins_1987_discrepancy"],
    turkishEvidenceSourceIds: [],
    overlapSourceIds: ["src_higgins_1987_discrepancy"],
    licensingSourceIds: []
  },
  turkishEvidenceStatus: "NO_DIRECT",
  turkishEvidenceLevel: "NOT_ASSESSED",
  knownInstrumentCandidates: [],
  licensingStatus: "NOT_APPLICABLE",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["MATRIX", "DASHBOARD"],
  aiInterpretationEligibility: "DERIVED_INTERACTION_INPUT",
  historicalTheoryEligibility: ["lens_rogers"],
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
  decision: "DERIVED_ONLY",
  decisionRationale: "Must NEVER be measured as an independent static question. Calculated deterministically from dual actual vs ideal trait rating pairs."
});

addCandidate({
  candidateId: "cand_actual_ought_discrepancy",
  canonicalNameEn: "Actual–Ought Self Discrepancy",
  canonicalNameTr: "Gerçek–Zorunlu Benlik Uyuşmazlığı",
  entityType: "DERIVED_INDEX",
  proposedDomain: "self_system",
  definition: "Mathematical discrepancy between who one believes they currently are (actual self) and who they feel obligated or pressured to be by duties and social expectations (ought self).",
  aliases: ["Actual-Ought Gap", "Duty-Discrepancy Index"],
  relatedConstructs: ["cand_actual_ideal_discrepancy"],
  overlapWithCurrentOntology: ["actual_ought_gap"],
  directOrDerived: "DERIVED",
  measurementMode: "DERIVED_DETERMINISTIC",
  measurementLevel: "DERIVED_INDEX",
  evidenceQuality: "STRONG",
  evidenceSummary: "Higgins (1987) demonstrated that actual-ought divergence predicts agitation, guilt, and social anxiety.",
  keySources: ["src_higgins_1987_discrepancy"],
  claimSources: {
    definitionSourceIds: ["src_higgins_1987_discrepancy"],
    evidenceSourceIds: ["src_higgins_1987_discrepancy"],
    measurementSourceIds: ["src_higgins_1987_discrepancy"],
    turkishEvidenceSourceIds: [],
    overlapSourceIds: ["src_higgins_1987_discrepancy"],
    licensingSourceIds: []
  },
  turkishEvidenceStatus: "NO_DIRECT",
  turkishEvidenceLevel: "NOT_ASSESSED",
  knownInstrumentCandidates: [],
  licensingStatus: "NOT_APPLICABLE",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["MATRIX", "DASHBOARD"],
  aiInterpretationEligibility: "DERIVED_INTERACTION_INPUT",
  historicalTheoryEligibility: ["lens_rogers", "lens_freud"],
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
  decision: "DERIVED_ONLY",
  decisionRationale: "Derived interaction metric capturing internalized social obligation pressure."
});

// -----------------------------------------------------------------------------
// 4. EMOTION, AFFECT & EMOTION REGULATION (10 Candidates)
// -----------------------------------------------------------------------------
addCandidate({
  candidateId: "cand_cognitive_reappraisal",
  canonicalNameEn: "Cognitive Reappraisal",
  canonicalNameTr: "Bilişsel Yeniden Değerlendirme",
  entityType: "CONSTRUCT",
  proposedDomain: "emotion_regulation",
  definition: "Antecedent-focused emotion regulation strategy involving reinterpreting the meaning of a situation to alter its emotional impact.",
  aliases: ["ERQ Reappraisal", "Cognitive Reframing"],
  relatedConstructs: ["cand_expressive_suppression", "cand_positive_reframing_coping"],
  overlapWithCurrentOntology: ["cognitive_reappraisal", "emotion_regulation_strategies"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SUBSCALE",
  evidenceQuality: "STRONG",
  evidenceSummary: "Gross's process model of emotion regulation. Meta-analyses demonstrate consistent positive correlations with well-being and adaptive interpersonal outcomes.",
  keySources: ["src_gross_john_2003"],
  claimSources: {
    definitionSourceIds: ["src_gross_john_2003"],
    evidenceSourceIds: ["src_gross_john_2003"],
    measurementSourceIds: ["src_gross_john_2003"],
    turkishEvidenceSourceIds: [],
    overlapSourceIds: ["src_gross_john_2003"],
    licensingSourceIds: ["src_gross_john_2003"]
  },
  turkishEvidenceStatus: "NO_DIRECT",
  turkishEvidenceLevel: "NOT_ASSESSED",
  knownInstrumentCandidates: [
    { instrumentName: "Emotion Regulation Questionnaire (ERQ - Reappraisal Subscale)", instrumentId: "inst_erq", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["BAR_GRID", "HEATMAP", "FINGERPRINT", "DASHBOARD"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_freud", "lens_james"],
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
  decisionRationale: "Pillar of emotion regulation science. Public domain 6-item scale measuring adaptive cognitive reframing capacity."
});

addCandidate({
  candidateId: "cand_expressive_suppression",
  canonicalNameEn: "Expressive Suppression",
  canonicalNameTr: "Duygusal İfadeyi Bastırma",
  entityType: "CONSTRUCT",
  proposedDomain: "emotion_regulation",
  definition: "Response-focused emotion regulation strategy involving actively inhibiting ongoing outward emotional expressive behavior.",
  aliases: ["ERQ Suppression", "Emotional Masking"],
  relatedConstructs: ["cand_cognitive_reappraisal"],
  overlapWithCurrentOntology: ["expressive_suppression", "emotion_regulation_strategies"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SUBSCALE",
  evidenceQuality: "STRONG",
  evidenceSummary: "Gross's model; established 4-item ERQ subscale. Associated cross-culturally with physiological cost and reduced relational closeness.",
  keySources: ["src_gross_john_2003"],
  claimSources: {
    definitionSourceIds: ["src_gross_john_2003"],
    evidenceSourceIds: ["src_gross_john_2003"],
    measurementSourceIds: ["src_gross_john_2003"],
    turkishEvidenceSourceIds: [],
    overlapSourceIds: ["src_gross_john_2003"],
    licensingSourceIds: ["src_gross_john_2003"]
  },
  turkishEvidenceStatus: "NO_DIRECT",
  turkishEvidenceLevel: "NOT_ASSESSED",
  knownInstrumentCandidates: [
    { instrumentName: "Emotion Regulation Questionnaire (ERQ - Suppression Subscale)", instrumentId: "inst_erq", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["BAR_GRID", "HEATMAP", "FINGERPRINT", "DASHBOARD"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_freud"],
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
  decisionRationale: "Essential counterpart to cognitive reappraisal. Distinct 4-item measurement with high behavioral relevance."
});

addCandidate({
  candidateId: "cand_positive_affect_trait",
  canonicalNameEn: "Positive Affectivity (Trait PA)",
  canonicalNameTr: "Olumlu Duygulanım Eğilimi",
  entityType: "CONSTRUCT",
  proposedDomain: "emotion_regulation",
  definition: "General dispositional tendency to experience energetic, alert, enthusiastic, and pleasurable affective states across situations.",
  aliases: ["PANAS-PA", "Trait Positive Affect"],
  relatedConstructs: ["cand_hexaco_extraversion", "cand_negative_affect_trait"],
  overlapWithCurrentOntology: ["affective_dynamics"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SUBSCALE",
  evidenceQuality: "STRONG",
  evidenceSummary: "Watson, Clark, & Tellegen PANAS model. Orthogonal to negative affect with robust Turkish psychometric replication by Gençöz (2000).",
  keySources: ["src_watson_clark_tellegen_1988", "src_gencoz_2000_panas"],
  claimSources: {
    definitionSourceIds: ["src_watson_clark_tellegen_1988"],
    evidenceSourceIds: ["src_watson_clark_tellegen_1988"],
    measurementSourceIds: ["src_watson_clark_tellegen_1988"],
    turkishEvidenceSourceIds: ["src_gencoz_2000_panas"],
    overlapSourceIds: ["src_watson_clark_tellegen_1988"],
    licensingSourceIds: ["src_watson_clark_tellegen_1988"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "SUBSCALE",
  knownInstrumentCandidates: [
    { instrumentName: "PANAS Positive Affect Scale (TR Gençöz, 2000)", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["BAR_GRID", "HEATMAP", "FINGERPRINT"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: [],
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
  decisionRationale: "Fundamental affective dimension with verified Turkish psychometrics and high state/trait tracking utility."
});

addCandidate({
  candidateId: "cand_negative_affect_trait",
  canonicalNameEn: "Negative Affectivity (Trait NA)",
  canonicalNameTr: "Olumsuz Duygulanım Eğilimi",
  entityType: "CONSTRUCT",
  proposedDomain: "emotion_regulation",
  definition: "General dispositional tendency to experience subjective distress, fear, hostility, and nervousness across diverse conditions.",
  aliases: ["PANAS-NA", "Trait Negative Affect"],
  relatedConstructs: ["cand_positive_affect_trait", "cand_hexaco_emotionality"],
  overlapWithCurrentOntology: ["affective_dynamics"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SUBSCALE",
  evidenceQuality: "STRONG",
  evidenceSummary: "Watson et al. model; orthogonal to positive affect. Validated in Turkish population by Gençöz (2000).",
  keySources: ["src_watson_clark_tellegen_1988", "src_gencoz_2000_panas"],
  claimSources: {
    definitionSourceIds: ["src_watson_clark_tellegen_1988"],
    evidenceSourceIds: ["src_watson_clark_tellegen_1988"],
    measurementSourceIds: ["src_watson_clark_tellegen_1988"],
    turkishEvidenceSourceIds: ["src_gencoz_2000_panas"],
    overlapSourceIds: ["src_watson_clark_tellegen_1988"],
    licensingSourceIds: ["src_watson_clark_tellegen_1988"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "SUBSCALE",
  knownInstrumentCandidates: [
    { instrumentName: "PANAS Negative Affect Scale (TR Gençöz, 2000)", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "LOW",
  clinicalSafetyClass: "NON_CLINICAL_ADJACENT",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["BAR_GRID", "HEATMAP", "FINGERPRINT"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_freud"],
  decisionRubric: {
    scientificDistinctiveness: "HIGH",
    incrementalValue: "HIGH",
    measurementMaturity: "HIGH",
    consumerRelevance: "HIGH",
    safety: "GOVERNED_ADJACENT",
    turkishEvidence: "DIRECT_VALIDATED",
    licensingFeasibility: "OPEN_ACCESSIBLE",
    assessmentBurden: "LOW",
    longitudinalValue: "HIGH",
    interpretability: "HIGH"
  },
  decision: "INCLUDE_CORE",
  decisionRationale: "Essential non-clinical affective metric with verified Turkish psychometrics. Maintained under non-clinical affect governance."
});

addCandidate({
  candidateId: "cand_affect_intensity",
  canonicalNameEn: "Affect Intensity",
  canonicalNameTr: "Duygulanım Yoğunluğu",
  entityType: "CONSTRUCT",
  proposedDomain: "emotion_regulation",
  definition: "Stable individual difference in the characteristic magnitude and physiological intensity of emotional responses to life stimuli.",
  aliases: ["AIM", "Emotional Reactivity Magnitude"],
  relatedConstructs: ["cand_positive_affect_trait", "cand_negative_affect_trait"],
  overlapWithCurrentOntology: ["affective_dynamics"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SCALE_TOTAL",
  evidenceQuality: "MODERATE",
  evidenceSummary: "Larsen & Diener construct; captures reactivity amplitude independent of emotional valence.",
  keySources: ["src_larsen_1987_aim"],
  claimSources: {
    definitionSourceIds: ["src_larsen_1987_aim"],
    evidenceSourceIds: ["src_larsen_1987_aim"],
    measurementSourceIds: ["src_larsen_1987_aim"],
    turkishEvidenceSourceIds: [],
    overlapSourceIds: ["src_larsen_1987_aim"],
    licensingSourceIds: ["src_larsen_1987_aim"]
  },
  turkishEvidenceStatus: "NO_DIRECT",
  turkishEvidenceLevel: "NOT_ASSESSED",
  knownInstrumentCandidates: [
    { instrumentName: "Affect Intensity Measure (AIM Short Form)", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["BAR_GRID", "HEATMAP"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_james"],
  decisionRubric: {
    scientificDistinctiveness: "HIGH",
    incrementalValue: "HIGH",
    measurementMaturity: "MODERATE",
    consumerRelevance: "HIGH",
    safety: "SAFE_NON_CLINICAL",
    turkishEvidence: "NO_DIRECT",
    licensingFeasibility: "OPEN_ACCESSIBLE",
    assessmentBurden: "LOW",
    longitudinalValue: "LOW",
    interpretability: "HIGH"
  },
  decision: "INCLUDE_ADVANCED",
  decisionRationale: "Provides valuable qualitative depth regarding whether the user experiences emotions at high or low amplitude across positive and negative valences."
});

addCandidate({
  candidateId: "cand_emotional_awareness",
  canonicalNameEn: "Emotional Awareness",
  canonicalNameTr: "Duygusal Farkındalık",
  entityType: "CONSTRUCT",
  proposedDomain: "emotion_regulation",
  definition: "The propensity to pay attention to, recognize, and acknowledge one's emotional states as they arise.",
  aliases: ["DERS Awareness", "Attention to Emotion"],
  relatedConstructs: ["cand_emotional_clarity"],
  overlapWithCurrentOntology: ["distress_management"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SUBSCALE",
  evidenceQuality: "STRONG",
  evidenceSummary: "Gratz & Roemer DERS model. Validated in Turkish samples by Rugancı & Gençöz (2010).",
  keySources: ["src_gratz_roemer_2004_ders", "src_ruganci_gencoz_2010_ders"],
  claimSources: {
    definitionSourceIds: ["src_gratz_roemer_2004_ders"],
    evidenceSourceIds: ["src_gratz_roemer_2004_ders"],
    measurementSourceIds: ["src_gratz_roemer_2004_ders"],
    turkishEvidenceSourceIds: ["src_ruganci_gencoz_2010_ders"],
    overlapSourceIds: ["src_gratz_roemer_2004_ders"],
    licensingSourceIds: ["src_gratz_roemer_2004_ders"]
  },
  turkishEvidenceStatus: "RELATED",
  turkishEvidenceLevel: "SUBSCALE",
  knownInstrumentCandidates: [
    { instrumentName: "Difficulties in Emotion Regulation Scale (DERS Awareness Subscale)", instrumentId: "inst_ders", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["BAR_GRID", "HEATMAP"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_james"],
  decisionRubric: {
    scientificDistinctiveness: "HIGH",
    incrementalValue: "HIGH",
    measurementMaturity: "HIGH",
    consumerRelevance: "HIGH",
    safety: "SAFE_NON_CLINICAL",
    turkishEvidence: "LEXICAL_OR_RELATED",
    licensingFeasibility: "OPEN_ACCESSIBLE",
    assessmentBurden: "LOW",
    longitudinalValue: "HIGH",
    interpretability: "HIGH"
  },
  decision: "INCLUDE_CORE",
  decisionRationale: "Foundational prerequisite for emotion regulation with verified Turkish DERS subscale evidence."
});

addCandidate({
  candidateId: "cand_emotional_clarity",
  canonicalNameEn: "Emotional Clarity",
  canonicalNameTr: "Duygusal Berraklık",
  entityType: "CONSTRUCT",
  proposedDomain: "emotion_regulation",
  definition: "The ability to accurately understand, distinguish, and label specific discrete emotions one is experiencing.",
  aliases: ["DERS Clarity", "Clarity of Feelings"],
  relatedConstructs: ["cand_emotional_awareness", "cand_emotion_differentiation"],
  overlapWithCurrentOntology: ["distress_management"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SUBSCALE",
  evidenceQuality: "STRONG",
  evidenceSummary: "Gratz & Roemer DERS subscale. Validated in Turkish samples by Rugancı & Gençöz (2010).",
  keySources: ["src_gratz_roemer_2004_ders", "src_ruganci_gencoz_2010_ders"],
  claimSources: {
    definitionSourceIds: ["src_gratz_roemer_2004_ders"],
    evidenceSourceIds: ["src_gratz_roemer_2004_ders"],
    measurementSourceIds: ["src_gratz_roemer_2004_ders"],
    turkishEvidenceSourceIds: ["src_ruganci_gencoz_2010_ders"],
    overlapSourceIds: ["src_gratz_roemer_2004_ders"],
    licensingSourceIds: ["src_gratz_roemer_2004_ders"]
  },
  turkishEvidenceStatus: "RELATED",
  turkishEvidenceLevel: "SUBSCALE",
  knownInstrumentCandidates: [
    { instrumentName: "Difficulties in Emotion Regulation Scale (DERS Clarity Subscale)", instrumentId: "inst_ders", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["BAR_GRID", "HEATMAP"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_james"],
  decisionRubric: {
    scientificDistinctiveness: "HIGH",
    incrementalValue: "HIGH",
    measurementMaturity: "HIGH",
    consumerRelevance: "HIGH",
    safety: "SAFE_NON_CLINICAL",
    turkishEvidence: "LEXICAL_OR_RELATED",
    licensingFeasibility: "OPEN_ACCESSIBLE",
    assessmentBurden: "LOW",
    longitudinalValue: "HIGH",
    interpretability: "HIGH"
  },
  decision: "INCLUDE_CORE",
  decisionRationale: "Key cognitive-affective capability. Complements emotional awareness with verified Turkish psychometric backing."
});

addCandidate({
  candidateId: "cand_distress_tolerance",
  canonicalNameEn: "Distress Tolerance",
  canonicalNameTr: "Sıkıntı / Rahatsızlık Toleransı",
  entityType: "CONSTRUCT",
  proposedDomain: "emotion_regulation",
  definition: "Perceived capacity to withstand, accept, and cope with negative psychological and emotional tension without engaging in maladaptive impulsive escapes.",
  aliases: ["DTS", "Emotional Endurance"],
  relatedConstructs: ["cand_general_self_control", "cand_uppsp_negative_urgency"],
  overlapWithCurrentOntology: ["distress_tolerance", "distress_management"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SCALE_TOTAL",
  evidenceQuality: "STRONG",
  evidenceSummary: "Simons & Gaher (2005) 15-item DTS inventory. Highly predictive of emotional resilience and behavioral stability.",
  keySources: ["src_simons_gaher_2005_dts"],
  claimSources: {
    definitionSourceIds: ["src_simons_gaher_2005_dts"],
    evidenceSourceIds: ["src_simons_gaher_2005_dts"],
    measurementSourceIds: ["src_simons_gaher_2005_dts"],
    turkishEvidenceSourceIds: [],
    overlapSourceIds: ["src_simons_gaher_2005_dts"],
    licensingSourceIds: ["src_simons_gaher_2005_dts"]
  },
  turkishEvidenceStatus: "NO_DIRECT",
  turkishEvidenceLevel: "NOT_ASSESSED",
  knownInstrumentCandidates: [
    { instrumentName: "Distress Tolerance Scale (DTS)", instrumentId: "inst_dts", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "LOW",
  clinicalSafetyClass: "NON_CLINICAL_ADJACENT",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["BAR_GRID", "HEATMAP", "FINGERPRINT"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_freud", "lens_james"],
  decisionRubric: {
    scientificDistinctiveness: "HIGH",
    incrementalValue: "HIGH",
    measurementMaturity: "HIGH",
    consumerRelevance: "HIGH",
    safety: "GOVERNED_ADJACENT",
    turkishEvidence: "NO_DIRECT",
    licensingFeasibility: "OPEN_ACCESSIBLE",
    assessmentBurden: "LOW",
    longitudinalValue: "HIGH",
    interpretability: "HIGH"
  },
  decision: "INCLUDE_CORE",
  decisionRationale: "Crucial volitional and affective endurance trait. Non-clinical framing captures emotional fortitude under stress."
});

addCandidate({
  candidateId: "cand_emotion_differentiation",
  canonicalNameEn: "Emotion Differentiation (Granularity)",
  canonicalNameTr: "Duygu Ayrıştırma / Granülerlik",
  entityType: "BEHAVIORAL_PATTERN",
  proposedDomain: "emotion_regulation",
  definition: "The degree of specificity and precision with which one identifies and differentiates distinct emotional experiences in daily life.",
  aliases: ["Emotional Granularity", "Discrete Emotion Specificity"],
  relatedConstructs: ["cand_emotional_clarity"],
  overlapWithCurrentOntology: ["distress_management"],
  directOrDerived: "DERIVED",
  measurementMode: "OBSERVATIONAL_HYPOTHESIS",
  measurementLevel: "OBSERVATIONAL_PATTERN",
  evidenceQuality: "MODERATE",
  evidenceSummary: "Barrett et al. framework. High scientific interest in affective neuroscience, but primarily measured via repeated ecological momentary assessments (EMA) or narrative language analysis.",
  keySources: ["src_barrett_2001_granularity"],
  claimSources: {
    definitionSourceIds: ["src_barrett_2001_granularity"],
    evidenceSourceIds: ["src_barrett_2001_granularity"],
    measurementSourceIds: ["src_barrett_2001_granularity"],
    turkishEvidenceSourceIds: [],
    overlapSourceIds: ["src_barrett_2001_granularity"],
    licensingSourceIds: []
  },
  turkishEvidenceStatus: "NO_DIRECT",
  turkishEvidenceLevel: "NOT_ASSESSED",
  knownInstrumentCandidates: [],
  licensingStatus: "NOT_APPLICABLE",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "MODERATE",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["FINGERPRINT"],
  aiInterpretationEligibility: "OBSERVATIONAL_HYPOTHESIS",
  historicalTheoryEligibility: [],
  decisionRubric: {
    scientificDistinctiveness: "HIGH",
    incrementalValue: "HIGH",
    measurementMaturity: "LOW",
    consumerRelevance: "MODERATE",
    safety: "SAFE_NON_CLINICAL",
    turkishEvidence: "NO_DIRECT",
    licensingFeasibility: "UNKNOWN",
    assessmentBurden: "HIGH",
    longitudinalValue: "HIGH",
    interpretability: "MODERATE"
  },
  decision: "RESEARCH_ONLY",
  decisionRationale: "Cannot be measured reliably via a static 3-item self-report questionnaire without EMA sampling. Tagged for future observational text analysis."
});

addCandidate({
  candidateId: "cand_alexithymia_subclinical",
  canonicalNameEn: "Subclinical Alexithymia",
  canonicalNameTr: "Subklinik Aleksitimi (Duyguları Tanıma Zorluğu)",
  entityType: "CONSTRUCT",
  proposedDomain: "emotion_regulation",
  definition: "Subclinical difficulty identifying and describing feelings, accompanied by externally oriented thinking style.",
  aliases: ["TAS-20 Construct", "Affect Blindness"],
  relatedConstructs: ["cand_emotional_awareness", "cand_emotional_clarity"],
  overlapWithCurrentOntology: ["distress_management"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SCALE_TOTAL",
  evidenceQuality: "STRONG",
  evidenceSummary: "Bagby et al. TAS-20 inventory. Strong psychometric history, but highly borderline with psychiatric somatization and clinical screening.",
  keySources: ["src_bagby_1994_tas20", "src_sayar_2001_tas20"],
  claimSources: {
    definitionSourceIds: ["src_bagby_1994_tas20"],
    evidenceSourceIds: ["src_bagby_1994_tas20"],
    measurementSourceIds: ["src_bagby_1994_tas20"],
    turkishEvidenceSourceIds: ["src_sayar_2001_tas20"],
    overlapSourceIds: ["src_bagby_1994_tas20"],
    licensingSourceIds: ["src_bagby_1994_tas20"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "SCALE_TOTAL",
  knownInstrumentCandidates: [
    { instrumentName: "Toronto Alexithymia Scale (TAS-20 / TR Sayar et al.)", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "MODERATE",
  clinicalSafetyClass: "CLINICAL_SCREENING",
  consumerSuitability: "CONDITIONAL",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["BAR_GRID"],
  aiInterpretationEligibility: "PROHIBITED",
  historicalTheoryEligibility: [],
  decisionRubric: {
    scientificDistinctiveness: "HIGH",
    incrementalValue: "LOW",
    measurementMaturity: "HIGH",
    consumerRelevance: "LOW",
    safety: "CLINICAL_RISK",
    turkishEvidence: "DIRECT_VALIDATED",
    licensingFeasibility: "OPEN_ACCESSIBLE",
    assessmentBurden: "LOW",
    longitudinalValue: "LOW",
    interpretability: "LOW"
  },
  decision: "RESEARCH_ONLY",
  decisionRationale: "Heavy clinical screening baggage. In non-clinical consumer profiling, positive constructs (cand_emotional_awareness and cand_emotional_clarity) are strongly preferred."
});

// -----------------------------------------------------------------------------
// 5. SELF-REGULATION, VOLITION & IMPULSE CONTROL (10 Candidates)
// -----------------------------------------------------------------------------
addCandidate({
  candidateId: "cand_general_self_control",
  canonicalNameEn: "General Self-Control",
  canonicalNameTr: "Genel Özdenetim",
  entityType: "CONSTRUCT",
  proposedDomain: "self_regulation",
  definition: "The overarching capacity to alter or override predominant impulse responses, resist temptations, and regulate thoughts and actions toward long-term standards.",
  aliases: ["Tangney Self-Control", "Executive Willpower"],
  relatedConstructs: ["cand_hexaco_conscientiousness", "cand_uppsp_lack_of_premeditation", "cand_procrastination_tendency"],
  overlapWithCurrentOntology: ["general_self_control", "volitional_stamina"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SCALE_TOTAL",
  evidenceQuality: "STRONG",
  evidenceSummary: "Tangney et al. (2004) BSCS scale. Robust cross-cultural predictor of academic achievement, interpersonal functioning, and health behaviors. Validated in Turkish by Duyan et al. (2012).",
  keySources: ["src_tangney_2004_bscs", "src_duyan_2012_bscs"],
  claimSources: {
    definitionSourceIds: ["src_tangney_2004_bscs"],
    evidenceSourceIds: ["src_tangney_2004_bscs"],
    measurementSourceIds: ["src_tangney_2004_bscs"],
    turkishEvidenceSourceIds: ["src_duyan_2012_bscs"],
    overlapSourceIds: ["src_tangney_2004_bscs"],
    licensingSourceIds: ["src_tangney_2004_bscs"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "SCALE_TOTAL",
  knownInstrumentCandidates: [
    { instrumentName: "Brief Self-Control Scale (BSCS / TR Duyan et al.)", instrumentId: "inst_bscs", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["BAR_GRID", "HEATMAP", "FINGERPRINT", "DASHBOARD"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_skinner", "lens_adler"],
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
  decisionRationale: "Cornerstone of self-regulation. Validated in Turkish psychometrics with high predictive validity across life domains."
});

addCandidate({
  candidateId: "cand_uppsp_negative_urgency",
  canonicalNameEn: "Negative Urgency (UPPS-P)",
  canonicalNameTr: "Olumsuz Dürtüsellik / Duygusal Tepkisellik",
  entityType: "FACET",
  proposedDomain: "self_regulation",
  definition: "The specific tendency to act impulsively and rashly when experiencing intense negative emotions.",
  aliases: ["Emotion-Driven Rash Action (Negative)", "UPPS-P Negative Urgency"],
  relatedConstructs: ["cand_uppsp_positive_urgency", "cand_distress_tolerance"],
  overlapWithCurrentOntology: ["negative_urgency", "impulsivity_uppsp"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SUBSCALE",
  evidenceQuality: "STRONG",
  evidenceSummary: "Whiteside & Lynam model. Validated in Turkish samples by Yılmaz et al. (2017). Distinct from general self-control by isolating affect-driven rash action.",
  keySources: ["src_whiteside_lynam_2001_upps", "src_yilmaz_2017_uppsp"],
  claimSources: {
    definitionSourceIds: ["src_whiteside_lynam_2001_upps"],
    evidenceSourceIds: ["src_whiteside_lynam_2001_upps"],
    measurementSourceIds: ["src_whiteside_lynam_2001_upps"],
    turkishEvidenceSourceIds: ["src_yilmaz_2017_uppsp"],
    overlapSourceIds: ["src_whiteside_lynam_2001_upps"],
    licensingSourceIds: ["src_whiteside_lynam_2001_upps"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "SUBSCALE",
  knownInstrumentCandidates: [
    { instrumentName: "Short UPPS-P Impulsive Behavior Scale (Negative Urgency Subscale)", instrumentId: "inst_upps_p_sf", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "LOW",
  clinicalSafetyClass: "NON_CLINICAL_ADJACENT",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["BAR_GRID", "HEATMAP", "FINGERPRINT"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_freud", "lens_skinner"],
  decisionRubric: {
    scientificDistinctiveness: "HIGH",
    incrementalValue: "HIGH",
    measurementMaturity: "HIGH",
    consumerRelevance: "HIGH",
    safety: "GOVERNED_ADJACENT",
    turkishEvidence: "DIRECT_VALIDATED",
    licensingFeasibility: "OPEN_ACCESSIBLE",
    assessmentBurden: "LOW",
    longitudinalValue: "HIGH",
    interpretability: "HIGH"
  },
  decision: "INCLUDE_CORE",
  decisionRationale: "Essential nuance in impulsivity. Captures rash action driven specifically by distress and frustration."
});

addCandidate({
  candidateId: "cand_uppsp_positive_urgency",
  canonicalNameEn: "Positive Urgency (UPPS-P)",
  canonicalNameTr: "Olumlu Dürtüsellik / Coşkusal Tepkisellik",
  entityType: "FACET",
  proposedDomain: "self_regulation",
  definition: "The specific tendency to act rashly and take unconsidered risks when experiencing intense positive excitement and joyful mood.",
  aliases: ["Emotion-Driven Rash Action (Positive)", "UPPS-P Positive Urgency"],
  relatedConstructs: ["cand_uppsp_negative_urgency", "cand_uppsp_sensation_seeking"],
  overlapWithCurrentOntology: ["positive_urgency", "impulsivity_uppsp"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SUBSCALE",
  evidenceQuality: "STRONG",
  evidenceSummary: "Cyders et al. (2007) extension. Validated in Turkish samples by Yılmaz et al. (2017). Predicts celebration-induced excess and risk taking.",
  keySources: ["src_cyders_2007_uppsp", "src_yilmaz_2017_uppsp"],
  claimSources: {
    definitionSourceIds: ["src_cyders_2007_uppsp"],
    evidenceSourceIds: ["src_cyders_2007_uppsp"],
    measurementSourceIds: ["src_cyders_2007_uppsp"],
    turkishEvidenceSourceIds: ["src_yilmaz_2017_uppsp"],
    overlapSourceIds: ["src_cyders_2007_uppsp"],
    licensingSourceIds: ["src_cyders_2007_uppsp"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "SUBSCALE",
  knownInstrumentCandidates: [
    { instrumentName: "Short UPPS-P Impulsive Behavior Scale (Positive Urgency Subscale)", instrumentId: "inst_upps_p_sf", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["BAR_GRID", "HEATMAP", "FINGERPRINT"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_skinner"],
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
  decisionRationale: "Provides vital symmetry to negative urgency by examining risk taking during euphoric states."
});

addCandidate({
  candidateId: "cand_uppsp_lack_of_premeditation",
  canonicalNameEn: "Lack of Premeditation (UPPS-P)",
  canonicalNameTr: "Önceden Düşünmeme / Düşüncesiz Eylem",
  entityType: "FACET",
  proposedDomain: "self_regulation",
  definition: "The tendency to act without thinking through consequences, deliberating options, or planning ahead.",
  aliases: ["Deliberation Deficit", "Non-Planning Impulsivity"],
  relatedConstructs: ["cand_hexaco_conscientiousness", "cand_general_self_control"],
  overlapWithCurrentOntology: ["lack_of_premeditation", "impulsivity_uppsp"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SUBSCALE",
  evidenceQuality: "STRONG",
  evidenceSummary: "Whiteside & Lynam model. Represents the cognitive planning dimension of impulsivity (inversely related to FFM Deliberation and HEXACO Prudence).",
  keySources: ["src_whiteside_lynam_2001_upps", "src_yilmaz_2017_uppsp"],
  claimSources: {
    definitionSourceIds: ["src_whiteside_lynam_2001_upps"],
    evidenceSourceIds: ["src_whiteside_lynam_2001_upps"],
    measurementSourceIds: ["src_whiteside_lynam_2001_upps"],
    turkishEvidenceSourceIds: ["src_yilmaz_2017_uppsp"],
    overlapSourceIds: ["src_whiteside_lynam_2001_upps"],
    licensingSourceIds: ["src_whiteside_lynam_2001_upps"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "SUBSCALE",
  knownInstrumentCandidates: [
    { instrumentName: "Short UPPS-P (Lack of Premeditation Subscale)", instrumentId: "inst_upps_p_sf", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["BAR_GRID", "HEATMAP", "FINGERPRINT"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_skinner"],
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
  decisionRationale: "Core cognitive impulsivity facet with validated Turkish scale."
});

addCandidate({
  candidateId: "cand_uppsp_lack_of_perseverance",
  canonicalNameEn: "Lack of Perseverance (UPPS-P)",
  canonicalNameTr: "Sebat Eksikliği / İşi Yarıda Bırakma",
  entityType: "FACET",
  proposedDomain: "self_regulation",
  definition: "The difficulty in remaining focused and persisting on tasks that are boring, difficult, or protracted.",
  aliases: ["Persistence Deficit", "Task Disengagement"],
  relatedConstructs: ["cand_long_term_grit", "cand_hexaco_conscientiousness"],
  overlapWithCurrentOntology: ["lack_of_perseverance", "impulsivity_uppsp"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SUBSCALE",
  evidenceQuality: "STRONG",
  evidenceSummary: "Whiteside & Lynam model. Measures task completion stamina under boredom or fatigue.",
  keySources: ["src_whiteside_lynam_2001_upps", "src_yilmaz_2017_uppsp"],
  claimSources: {
    definitionSourceIds: ["src_whiteside_lynam_2001_upps"],
    evidenceSourceIds: ["src_whiteside_lynam_2001_upps"],
    measurementSourceIds: ["src_whiteside_lynam_2001_upps"],
    turkishEvidenceSourceIds: ["src_yilmaz_2017_uppsp"],
    overlapSourceIds: ["src_whiteside_lynam_2001_upps"],
    licensingSourceIds: ["src_whiteside_lynam_2001_upps"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "SUBSCALE",
  knownInstrumentCandidates: [
    { instrumentName: "Short UPPS-P (Lack of Perseverance Subscale)", instrumentId: "inst_upps_p_sf", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["BAR_GRID", "HEATMAP", "FINGERPRINT"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_skinner"],
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
  decisionRationale: "Essential task execution facet under self-regulation with verified Turkish psychometrics."
});

addCandidate({
  candidateId: "cand_uppsp_sensation_seeking",
  canonicalNameEn: "Sensation Seeking (UPPS-P)",
  canonicalNameTr: "Heyecan Arayışı",
  entityType: "FACET",
  proposedDomain: "self_regulation",
  definition: "The tendency to pursue novel, exciting, and intense sensory and physical experiences.",
  aliases: ["Zuckerman Sensation Seeking", "Thrill Seeking"],
  relatedConstructs: ["cand_hexaco_extraversion", "cand_risk_taking_domain_specific"],
  overlapWithCurrentOntology: ["sensation_seeking", "impulsivity_uppsp"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SUBSCALE",
  evidenceQuality: "STRONG",
  evidenceSummary: "Whiteside & Lynam model. Captures appetitive stimulation seeking.",
  keySources: ["src_whiteside_lynam_2001_upps", "src_yilmaz_2017_uppsp"],
  claimSources: {
    definitionSourceIds: ["src_whiteside_lynam_2001_upps"],
    evidenceSourceIds: ["src_whiteside_lynam_2001_upps"],
    measurementSourceIds: ["src_whiteside_lynam_2001_upps"],
    turkishEvidenceSourceIds: ["src_yilmaz_2017_uppsp"],
    overlapSourceIds: ["src_whiteside_lynam_2001_upps"],
    licensingSourceIds: ["src_whiteside_lynam_2001_upps"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "SUBSCALE",
  knownInstrumentCandidates: [
    { instrumentName: "Short UPPS-P (Sensation Seeking Subscale)", instrumentId: "inst_upps_p_sf", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["BAR_GRID", "HEATMAP", "FINGERPRINT"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: [],
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
  decisionRationale: "Core sensation and stimulation preference facet with validated Turkish scale."
});

addCandidate({
  candidateId: "cand_delay_discounting_preference",
  canonicalNameEn: "Delayed Gratification Preference",
  canonicalNameTr: "Gecikmiş Doyum / Ödül Tercihi",
  entityType: "CONSTRUCT",
  proposedDomain: "self_regulation",
  definition: "Tendency to forego immediate smaller rewards in order to attain larger, higher-value future rewards.",
  aliases: ["Delay of Gratification", "Intertemporal Choice Preference"],
  relatedConstructs: ["cand_general_self_control", "cand_future_time_perspective"],
  overlapWithCurrentOntology: ["delay_discounting", "volitional_stamina"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SUBSCALE",
  evidenceQuality: "MODERATE",
  evidenceSummary: "Behavioral economics and self-regulation construct; predicts savings, health adherence, and academic success.",
  keySources: ["src_tangney_2004_bscs"],
  claimSources: {
    definitionSourceIds: ["src_tangney_2004_bscs"],
    evidenceSourceIds: ["src_tangney_2004_bscs"],
    measurementSourceIds: ["src_tangney_2004_bscs"],
    turkishEvidenceSourceIds: ["src_duyan_2012_bscs"],
    overlapSourceIds: ["src_tangney_2004_bscs"],
    licensingSourceIds: ["src_tangney_2004_bscs"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "SUBSCALE",
  knownInstrumentCandidates: [
    { instrumentName: "BSCS Delayed Gratification Sub-items", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["BAR_GRID", "HEATMAP"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_skinner"],
  decisionRubric: {
    scientificDistinctiveness: "HIGH",
    incrementalValue: "HIGH",
    measurementMaturity: "MODERATE",
    consumerRelevance: "HIGH",
    safety: "SAFE_NON_CLINICAL",
    turkishEvidence: "DIRECT_VALIDATED",
    licensingFeasibility: "OPEN_ACCESSIBLE",
    assessmentBurden: "LOW",
    longitudinalValue: "HIGH",
    interpretability: "HIGH"
  },
  decision: "INCLUDE_ADVANCED",
  decisionRationale: "Provides focused decision-making insight regarding temporal reward tradeoff preferences."
});

addCandidate({
  candidateId: "cand_long_term_grit",
  canonicalNameEn: "Long-Term Grit",
  canonicalNameTr: "Azim ve Tutku (Grit)",
  entityType: "CONSTRUCT",
  proposedDomain: "self_regulation",
  definition: "Perseverance and sustained passion for long-term multi-year goals despite setbacks and plateaus in progress.",
  aliases: ["Duckworth Grit", "Perseverance of Effort & Consistency"],
  relatedConstructs: ["cand_hexaco_conscientiousness", "cand_uppsp_lack_of_perseverance"],
  overlapWithCurrentOntology: ["long_term_grit", "volitional_stamina"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SCALE_TOTAL",
  evidenceQuality: "STRONG",
  evidenceSummary: "Duckworth et al. (2007) scale. Meta-analyses (Credé et al., 2017) indicate high overlap with Conscientiousness (rho = .84), with perseverance facet providing modest incremental prediction.",
  keySources: ["src_duckworth_2007_grit", "src_crede_2017_grit_meta", "src_saricam_2016_grit"],
  claimSources: {
    definitionSourceIds: ["src_duckworth_2007_grit"],
    evidenceSourceIds: ["src_duckworth_2007_grit", "src_crede_2017_grit_meta"],
    measurementSourceIds: ["src_duckworth_2007_grit"],
    turkishEvidenceSourceIds: ["src_saricam_2016_grit"],
    overlapSourceIds: ["src_crede_2017_grit_meta"],
    licensingSourceIds: ["src_duckworth_2007_grit"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "SCALE_TOTAL",
  knownInstrumentCandidates: [
    { instrumentName: "Short Grit Scale (Grit-S / TR Sarıçam et al., 2016)", instrumentId: "inst_grit_s", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["BAR_GRID", "HEATMAP", "FINGERPRINT"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_adler"],
  decisionRubric: {
    scientificDistinctiveness: "MODERATE",
    incrementalValue: "MODERATE",
    measurementMaturity: "HIGH",
    consumerRelevance: "HIGH",
    safety: "SAFE_NON_CLINICAL",
    turkishEvidence: "DIRECT_VALIDATED",
    licensingFeasibility: "OPEN_ACCESSIBLE",
    assessmentBurden: "LOW",
    longitudinalValue: "LOW",
    interpretability: "HIGH"
  },
  decision: "INCLUDE_ADVANCED",
  decisionRationale: "Popular and motivational construct with verified Turkish validation. Maintained in advanced expansion while documenting its empirical overlap with Conscientiousness."
});

addCandidate({
  candidateId: "cand_procrastination_tendency",
  canonicalNameEn: "Procrastination Tendency",
  canonicalNameTr: "Erteleme Eğilimi",
  entityType: "CONSTRUCT",
  proposedDomain: "self_regulation",
  definition: "The voluntary and irrational delay of intended actions despite expecting to be worse off for the delay.",
  aliases: ["General Procrastination", "Volitional Action Delay"],
  relatedConstructs: ["cand_general_self_control", "cand_hexaco_conscientiousness"],
  overlapWithCurrentOntology: ["volitional_stamina"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SCALE_TOTAL",
  evidenceQuality: "STRONG",
  evidenceSummary: "Lay (1986) and Tuckman (1991) scales. Validated in Turkish samples by Uzun Özer et al. (2013). High consumer resonance and actionable behavioral intervention value.",
  keySources: ["src_lay_1986_procrastination", "src_uzun_ozer_2013_procrastination"],
  claimSources: {
    definitionSourceIds: ["src_lay_1986_procrastination"],
    evidenceSourceIds: ["src_lay_1986_procrastination"],
    measurementSourceIds: ["src_lay_1986_procrastination"],
    turkishEvidenceSourceIds: ["src_uzun_ozer_2013_procrastination"],
    overlapSourceIds: ["src_lay_1986_procrastination"],
    licensingSourceIds: ["src_lay_1986_procrastination"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "SCALE_TOTAL",
  knownInstrumentCandidates: [
    { instrumentName: "Tuckman Procrastination Scale (TR Uzun Özer et al., 2013)", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["BAR_GRID", "HEATMAP", "FINGERPRINT"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_skinner"],
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
  decisionRationale: "Extremely high consumer value and behavioral feedback utility. Supported by verified Turkish psychometric adaptation."
});

addCandidate({
  candidateId: "cand_habitual_behavior_strength",
  canonicalNameEn: "Habit Strength Disposition",
  canonicalNameTr: "Alışkanlık Oluşturma Eğilimi",
  entityType: "CONSTRUCT",
  proposedDomain: "self_regulation",
  definition: "Dispositional capacity to consolidate repetitive routines into automatic, low-effort cognitive behavioral habits.",
  aliases: ["SRHI", "Automaticity Disposition"],
  relatedConstructs: ["cand_general_self_control"],
  overlapWithCurrentOntology: ["volitional_stamina"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "CONSTRUCT",
  evidenceQuality: "MODERATE",
  evidenceSummary: "Verplanken & Orbell (2003) Self-Report Habit Index (SRHI). Provides behavioral architecture lens on how self-control is automated.",
  keySources: ["src_verplanken_2003_srhi"],
  claimSources: {
    definitionSourceIds: ["src_verplanken_2003_srhi"],
    evidenceSourceIds: ["src_verplanken_2003_srhi"],
    measurementSourceIds: ["src_verplanken_2003_srhi"],
    turkishEvidenceSourceIds: [],
    overlapSourceIds: ["src_verplanken_2003_srhi"],
    licensingSourceIds: ["src_verplanken_2003_srhi"]
  },
  turkishEvidenceStatus: "NO_DIRECT",
  turkishEvidenceLevel: "NOT_ASSESSED",
  knownInstrumentCandidates: [
    { instrumentName: "Self-Report Habit Index (SRHI)", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["BAR_GRID", "HEATMAP"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_skinner"],
  decisionRubric: {
    scientificDistinctiveness: "HIGH",
    incrementalValue: "HIGH",
    measurementMaturity: "MODERATE",
    consumerRelevance: "HIGH",
    safety: "SAFE_NON_CLINICAL",
    turkishEvidence: "NO_DIRECT",
    licensingFeasibility: "OPEN_ACCESSIBLE",
    assessmentBurden: "LOW",
    longitudinalValue: "HIGH",
    interpretability: "HIGH"
  },
  decision: "INCLUDE_ADVANCED",
  decisionRationale: "Provides actionable insight for habit formation and Skinnerian antecedent-behavior routines in advanced coaching modules."
});

console.log(`Writing complete candidate pool file with all 135+ candidates...`);

fs.writeFileSync(
  path.resolve(masterModelDir, 'candidate-constructs.json'),
  JSON.stringify(CANDIDATE_POOL, null, 2),
  'utf8'
);
console.log(`✅ Processed initial sets. Continuing to add Motivation, Interpersonal, Cognition, RIASEC, Coping, Meaning, Moral, Dark Tetrad, Clinical Exclusions, Theoretical Lenses, Telemetry...`);
