import fs from 'fs';
import path from 'path';

const rootDir = path.resolve(__dirname, '..');
const masterModelDir = path.resolve(rootDir, 'data/master-model');
const candidatesFile = path.resolve(masterModelDir, 'candidate-constructs.json');

const currentPool = JSON.parse(fs.readFileSync(candidatesFile, 'utf8'));

function add(c: any) {
  currentPool.push(c);
}

// -----------------------------------------------------------------------------
// 8. COGNITION, DECISION MAKING & EPISTEMIC STYLES (10 Candidates)
// -----------------------------------------------------------------------------
add({
  candidateId: "cand_need_for_cognition",
  canonicalNameEn: "Need for Cognition",
  canonicalNameTr: "Biliş İhtiyacı / Zihinsel Çaba Motivasyonu",
  entityType: "CONSTRUCT",
  proposedDomain: "cognition_decision",
  definition: "An individual's chronic intrinsic tendency to engage in, enjoy, and seek out effortful cognitive activity and complex problem-solving.",
  aliases: ["NFC", "Epistemic Drive"],
  relatedConstructs: ["cand_rational_analytical_thinking", "cand_hexaco_openness"],
  overlapWithCurrentOntology: ["need_for_cognition", "epistemic_drive"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SCALE_TOTAL",
  evidenceQuality: "STRONG",
  evidenceSummary: "Cacioppo & Petty (1982). Validated in Turkish population by Demirtaş (2013) (alpha = 0.81). Robust predictor of analytic processing and resistance to cognitive heuristics.",
  keySources: ["src_cacioppo_petty_1982_nfc", "src_demirtas_2013_nfc", "src_ipip_ori_licensing"],
  claimSources: {
    definitionSourceIds: ["src_cacioppo_petty_1982_nfc"],
    evidenceSourceIds: ["src_cacioppo_petty_1982_nfc"],
    measurementSourceIds: ["src_cacioppo_petty_1982_nfc"],
    turkishEvidenceSourceIds: ["src_demirtas_2013_nfc"],
    overlapSourceIds: ["src_cacioppo_petty_1982_nfc"],
    licensingSourceIds: ["src_ipip_ori_licensing"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "SCALE_TOTAL",
  knownInstrumentCandidates: [
    { instrumentName: "Need for Cognition Scale (18-item / TR Demirtaş, 2013)", instrumentId: "inst_nfc", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["BAR_GRID", "HEATMAP", "FINGERPRINT", "DASHBOARD"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_james", "lens_jung"],
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
  decisionRationale: "Foundational epistemic motivation construct with verified Turkish psychometrics."
});

add({
  candidateId: "cand_rational_analytical_thinking",
  canonicalNameEn: "Rational-Analytical Thinking Style",
  canonicalNameTr: "Akılcı / Analitik Düşünme Tarzı",
  entityType: "CONSTRUCT",
  proposedDomain: "cognition_decision",
  definition: "Propensity to rely on conscious logic, analytical reasoning, and evidence-based deliberative evaluation when making decisions.",
  aliases: ["REI Rational Ability & Engagement", "System 2 Thinking Disposition"],
  relatedConstructs: ["cand_need_for_cognition", "cand_intuitive_experiential_thinking"],
  overlapWithCurrentOntology: ["rational_analytical_style", "thinking_styles"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SUBSCALE",
  evidenceQuality: "STRONG",
  evidenceSummary: "Epstein et al. (1996) Rational-Experiential Inventory (REI). Validated in Turkish by Gülgöz (2001). Orthogonal to intuitive thinking.",
  keySources: ["src_epstein_1996_rei", "src_gulgoz_2001_rei"],
  claimSources: {
    definitionSourceIds: ["src_epstein_1996_rei"],
    evidenceSourceIds: ["src_epstein_1996_rei"],
    measurementSourceIds: ["src_epstein_1996_rei"],
    turkishEvidenceSourceIds: ["src_gulgoz_2001_rei"],
    overlapSourceIds: ["src_epstein_1996_rei"],
    licensingSourceIds: ["src_epstein_1996_rei"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "SUBSCALE",
  knownInstrumentCandidates: [
    { instrumentName: "Rational-Experiential Inventory (Rational Subscale / TR Gülgöz, 2001)", instrumentId: "inst_rei_40", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["BAR_GRID", "HEATMAP", "FINGERPRINT"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_jung"],
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
  decisionRationale: "Essential dual-process cognitive style metric with verified Turkish psychometrics."
});

add({
  candidateId: "cand_intuitive_experiential_thinking",
  canonicalNameEn: "Intuitive-Experiential Thinking Style",
  canonicalNameTr: "Sezgisel / Yaşantısal Düşünme Tarzı",
  entityType: "CONSTRUCT",
  proposedDomain: "cognition_decision",
  definition: "Propensity to rely on intuitive gut feelings, preconscious impressions, and experiential heuristics when making judgments.",
  aliases: ["REI Experiential Ability & Engagement", "System 1 Intuition Disposition"],
  relatedConstructs: ["cand_rational_analytical_thinking"],
  overlapWithCurrentOntology: ["intuitive_experiential_style", "thinking_styles"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SUBSCALE",
  evidenceQuality: "STRONG",
  evidenceSummary: "Epstein et al. (1996) REI model. Validated in Turkish by Gülgöz (2001). Orthogonal to rational processing.",
  keySources: ["src_epstein_1996_rei", "src_gulgoz_2001_rei"],
  claimSources: {
    definitionSourceIds: ["src_epstein_1996_rei"],
    evidenceSourceIds: ["src_epstein_1996_rei"],
    measurementSourceIds: ["src_epstein_1996_rei"],
    turkishEvidenceSourceIds: ["src_gulgoz_2001_rei"],
    overlapSourceIds: ["src_epstein_1996_rei"],
    licensingSourceIds: ["src_epstein_1996_rei"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "SUBSCALE",
  knownInstrumentCandidates: [
    { instrumentName: "Rational-Experiential Inventory (Experiential Subscale / TR Gülgöz, 2001)", instrumentId: "inst_rei_40", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["BAR_GRID", "HEATMAP", "FINGERPRINT"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_jung"],
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
  decisionRationale: "Essential intuitive counterpart to analytical thinking with verified Turkish psychometrics."
});

add({
  candidateId: "cand_cognitive_reflection_tendency",
  canonicalNameEn: "Cognitive Reflection Tendency",
  canonicalNameTr: "Bilişsel Yansıtma ve İrdeleme Eğilimi",
  entityType: "CONSTRUCT",
  proposedDomain: "cognition_decision",
  definition: "The cognitive disposition to question intuitive first impressions and suppress prepotent responses to verify accuracy.",
  aliases: ["CRT Disposition", "Reflective Deliberation"],
  relatedConstructs: ["cand_rational_analytical_thinking"],
  overlapWithCurrentOntology: ["thinking_styles"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "CONSTRUCT",
  evidenceQuality: "STRONG",
  evidenceSummary: "Frederick (2005) CRT framework. Predicts resistance to cognitive biases and susceptibility to misinformation.",
  keySources: ["src_frederick_2005_crt"],
  claimSources: {
    definitionSourceIds: ["src_frederick_2005_crt"],
    evidenceSourceIds: ["src_frederick_2005_crt"],
    measurementSourceIds: ["src_frederick_2005_crt"],
    turkishEvidenceSourceIds: [],
    overlapSourceIds: ["src_frederick_2005_crt"],
    licensingSourceIds: ["src_frederick_2005_crt"]
  },
  turkishEvidenceStatus: "NO_DIRECT",
  turkishEvidenceLevel: "NOT_ASSESSED",
  knownInstrumentCandidates: [
    { instrumentName: "Cognitive Reflection Test (CRT-3 / CRT-7)", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["BAR_GRID", "HEATMAP"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: [],
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
  decisionRationale: "Provides objective cognitive reflection measurement in advanced reasoning modules."
});

add({
  candidateId: "cand_decision_style_maximizing",
  canonicalNameEn: "Maximizing versus Satisficing Decision Style",
  canonicalNameTr: "Maksimalist Karar Verme Tarzı (En İyiyi Arama)",
  entityType: "CONSTRUCT",
  proposedDomain: "cognition_decision",
  definition: "The propensity to seek only the optimal, best possible outcome (maximizing) versus settling for an outcome that exceeds threshold adequacy (satisficing).",
  aliases: ["Schwartz Maximization", "Maximizing vs Satisficing"],
  relatedConstructs: ["cand_perfectionism"],
  overlapWithCurrentOntology: ["decision_orientation"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SCALE_TOTAL",
  evidenceQuality: "MODERATE",
  evidenceSummary: "Schwartz et al. (2002) Maximization Scale. High maximizers engage in exhaustive search but experience higher post-decision regret.",
  keySources: ["src_schwartz_2002_maximization"],
  claimSources: {
    definitionSourceIds: ["src_schwartz_2002_maximization"],
    evidenceSourceIds: ["src_schwartz_2002_maximization"],
    measurementSourceIds: ["src_schwartz_2002_maximization"],
    turkishEvidenceSourceIds: [],
    overlapSourceIds: ["src_schwartz_2002_maximization"],
    licensingSourceIds: ["src_schwartz_2002_maximization"]
  },
  turkishEvidenceStatus: "NO_DIRECT",
  turkishEvidenceLevel: "NOT_ASSESSED",
  knownInstrumentCandidates: [
    { instrumentName: "Maximization Scale (Schwartz et al.)", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["BAR_GRID", "HEATMAP"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: [],
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
  decisionRationale: "Provides valuable consumer insight into choice overload, optimization fatigue, and post-decision satisfaction."
});

add({
  candidateId: "cand_intolerance_of_uncertainty",
  canonicalNameEn: "Intolerance of Uncertainty",
  canonicalNameTr: "Belirsizliğe Tahammülsüzlük",
  entityType: "CONSTRUCT",
  proposedDomain: "cognition_decision",
  definition: "A dispositional characteristic resulting from a negative belief that uncertain future events are unacceptable and threatening.",
  aliases: ["IUS", "Uncertainty Intolerance"],
  relatedConstructs: ["cand_ambiguity_tolerance", "cand_hexaco_emotionality"],
  overlapWithCurrentOntology: ["intolerance_of_uncertainty", "cognitive_adaptability"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SCALE_TOTAL",
  evidenceQuality: "STRONG",
  evidenceSummary: "Freeston et al. (1994) and Buhr & Dugas (2002). Validated in Turkish population by Sarı & Dağ (2009) (N=375, alpha = 0.93).",
  keySources: ["src_buhr_dugas_2002_ius", "src_sari_dag_2009_ius"],
  claimSources: {
    definitionSourceIds: ["src_buhr_dugas_2002_ius"],
    evidenceSourceIds: ["src_buhr_dugas_2002_ius"],
    measurementSourceIds: ["src_buhr_dugas_2002_ius"],
    turkishEvidenceSourceIds: ["src_sari_dag_2009_ius"],
    overlapSourceIds: ["src_buhr_dugas_2002_ius"],
    licensingSourceIds: ["src_buhr_dugas_2002_ius"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "SCALE_TOTAL",
  knownInstrumentCandidates: [
    { instrumentName: "Intolerance of Uncertainty Scale (IUS-12 / TR Sarı & Dağ, 2009)", instrumentId: "inst_ius_12", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "LOW",
  clinicalSafetyClass: "NON_CLINICAL_ADJACENT",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["BAR_GRID", "HEATMAP", "FINGERPRINT"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_gestalt", "lens_freud"],
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
  decisionRationale: "Pivotal cognitive adaptation trait with robust Turkish psychometric validation (Sarı & Dağ, 2009)."
});

add({
  candidateId: "cand_ambiguity_tolerance",
  canonicalNameEn: "Tolerance of Ambiguity",
  canonicalNameTr: "Muğlaklığa / Çok Anlamlılığa Tolerans",
  entityType: "CONSTRUCT",
  proposedDomain: "cognition_decision",
  definition: "The tendency to perceive ambiguous, contradictory, or complex situations as desirable and challenging rather than as threats.",
  aliases: ["Budner Ambiguity Tolerance", "Cognitive Ambiguity Comfort"],
  relatedConstructs: ["cand_intolerance_of_uncertainty", "cand_hexaco_openness"],
  overlapWithCurrentOntology: ["cognitive_adaptability"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "CONSTRUCT",
  evidenceQuality: "MODERATE",
  evidenceSummary: "Budner (1962). Focuses on semantic and situational vagueness/complexity, complementing probabilistic uncertainty tolerance.",
  keySources: ["src_buhr_dugas_2002_ius"],
  claimSources: {
    definitionSourceIds: ["src_buhr_dugas_2002_ius"],
    evidenceSourceIds: ["src_buhr_dugas_2002_ius"],
    measurementSourceIds: ["src_buhr_dugas_2002_ius"],
    turkishEvidenceSourceIds: [],
    overlapSourceIds: ["src_buhr_dugas_2002_ius"],
    licensingSourceIds: []
  },
  turkishEvidenceStatus: "NO_DIRECT",
  turkishEvidenceLevel: "NOT_ASSESSED",
  knownInstrumentCandidates: [
    { instrumentName: "Budner Tolerance of Ambiguity Scale", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["BAR_GRID", "HEATMAP"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_gestalt"],
  decisionRubric: {
    scientificDistinctiveness: "MODERATE",
    incrementalValue: "MODERATE",
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
  decisionRationale: "Enriches cognitive style battery in ambiguous decision contexts."
});

add({
  candidateId: "cand_risk_taking_domain_specific",
  canonicalNameEn: "Domain-Specific Risk Propensity",
  canonicalNameTr: "Alana Özgü Risk Alma Eğilimi",
  entityType: "CONSTRUCT",
  proposedDomain: "cognition_decision",
  definition: "Willingness to take risks across distinct domains: financial, health/safety, recreational, ethical, and social.",
  aliases: ["DOSPERT", "Domain Risk Taking"],
  relatedConstructs: ["cand_uppsp_sensation_seeking"],
  overlapWithCurrentOntology: ["decision_orientation"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SUBSCALE",
  evidenceQuality: "STRONG",
  evidenceSummary: "Weber, Blais, & Betz (2002) DOSPERT model. Demonstrates that generalized 'risk-taker' traits are fragmented across domains.",
  keySources: ["src_weber_2002_dospert"],
  claimSources: {
    definitionSourceIds: ["src_weber_2002_dospert"],
    evidenceSourceIds: ["src_weber_2002_dospert"],
    measurementSourceIds: ["src_weber_2002_dospert"],
    turkishEvidenceSourceIds: [],
    overlapSourceIds: ["src_weber_2002_dospert"],
    licensingSourceIds: ["src_weber_2002_dospert"]
  },
  turkishEvidenceStatus: "NO_DIRECT",
  turkishEvidenceLevel: "NOT_ASSESSED",
  knownInstrumentCandidates: [
    { instrumentName: "DOSPERT 30-item Short Scale", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
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
    turkishEvidence: "NO_DIRECT",
    licensingFeasibility: "OPEN_ACCESSIBLE",
    assessmentBurden: "MODERATE",
    longitudinalValue: "HIGH",
    interpretability: "HIGH"
  },
  decision: "INCLUDE_ADVANCED",
  decisionRationale: "Provides domain-contingent risk profiling for financial and career decisions."
});

add({
  candidateId: "cand_future_time_perspective",
  canonicalNameEn: "Future Time Perspective",
  canonicalNameTr: "Gelecek Zaman Yönelimi",
  entityType: "CONSTRUCT",
  proposedDomain: "cognition_decision",
  definition: "General disposition to frame current behaviors, decisions, and goals around future consequences and long-term planning.",
  aliases: ["ZTPI Future", "Temporal Horizon"],
  relatedConstructs: ["cand_delay_discounting_preference", "cand_hexaco_conscientiousness"],
  overlapWithCurrentOntology: ["decision_orientation"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SUBSCALE",
  evidenceQuality: "STRONG",
  evidenceSummary: "Zimbardo & Boyd (1999) ZTPI model. Predicts career success, proactive health, and financial security.",
  keySources: ["src_zimbardo_1999_ztpi"],
  claimSources: {
    definitionSourceIds: ["src_zimbardo_1999_ztpi"],
    evidenceSourceIds: ["src_zimbardo_1999_ztpi"],
    measurementSourceIds: ["src_zimbardo_1999_ztpi"],
    turkishEvidenceSourceIds: [],
    overlapSourceIds: ["src_zimbardo_1999_ztpi"],
    licensingSourceIds: ["src_zimbardo_1999_ztpi"]
  },
  turkishEvidenceStatus: "NO_DIRECT",
  turkishEvidenceLevel: "NOT_ASSESSED",
  knownInstrumentCandidates: [
    { instrumentName: "Zimbardo Time Perspective Inventory (Future Subscale)", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
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
  decisionRationale: "Assesses long-term temporal horizon and teleological planning."
});

add({
  candidateId: "cand_cognitive_flexibility",
  canonicalNameEn: "Cognitive Flexibility",
  canonicalNameTr: "Bilişsel Esneklik",
  entityType: "CONSTRUCT",
  proposedDomain: "cognition_decision",
  definition: "Awareness that in any given situation there are alternative options and possibilities available, and willingness to adapt one's thinking to new information.",
  aliases: ["CFI", "Cognitive Adaptability"],
  relatedConstructs: ["cand_hexaco_openness", "cand_intolerance_of_uncertainty"],
  overlapWithCurrentOntology: ["cognitive_flexibility", "cognitive_adaptability"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SCALE_TOTAL",
  evidenceQuality: "STRONG",
  evidenceSummary: "Martin & Rubin (1995) and Dennis & Vander Wal (2010). Validated in Turkish population by Gülüm & Dağ (2012) (N=420, alpha = 0.90).",
  keySources: ["src_gulum_dag_2012_cfi"],
  claimSources: {
    definitionSourceIds: ["src_gulum_dag_2012_cfi"],
    evidenceSourceIds: ["src_gulum_dag_2012_cfi"],
    measurementSourceIds: ["src_gulum_dag_2012_cfi"],
    turkishEvidenceSourceIds: ["src_gulum_dag_2012_cfi"],
    overlapSourceIds: ["src_gulum_dag_2012_cfi"],
    licensingSourceIds: ["src_gulum_dag_2012_cfi"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "SCALE_TOTAL",
  knownInstrumentCandidates: [
    { instrumentName: "Cognitive Flexibility Inventory (CFI / TR Gülüm & Dağ, 2012)", instrumentId: "inst_cfi", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["BAR_GRID", "HEATMAP", "FINGERPRINT", "DASHBOARD"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_gestalt", "lens_james"],
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
  decisionRationale: "Core cognitive adaptability construct with direct Turkish psychometric validation (Gülüm & Dağ, 2012)."
});

// -----------------------------------------------------------------------------
// 9. VOCATIONAL INTERESTS & WORK DISPOSITIONS (8 Candidates)
// -----------------------------------------------------------------------------
const riasecTypes = [
  { id: "realistic", en: "Realistic (Hands-on / Technical)", tr: "Gerçekçi (Uygulamalı ve Teknik)", def: "Preference for working with objects, machines, tools, animals, and outdoor physical tasks." },
  { id: "investigative", en: "Investigative (Scientific / Analytical)", tr: "Araştırmacı (Bilimsel ve Analitik)", def: "Preference for observing, learning, analyzing, evaluating, and solving theoretical and scientific problems." },
  { id: "artistic", en: "Artistic (Creative / Expressive)", tr: "Sanatsal (Yaratıcı ve Özgün)", def: "Preference for unstructured, ambiguous activities using imagination and artistic expression." },
  { id: "social", en: "Social (Helping / Educational)", tr: "Sosyal (Yardım Edici ve Eğitici)", def: "Preference for working with people to inform, enlighten, help, train, or cure them." },
  { id: "enterprising", en: "Enterprising (Leadership / Persuasion)", tr: "Girişimci (Liderlik ve İkna)", def: "Preference for working with people to influence, persuade, lead, or manage for organizational goals." },
  { id: "conventional", en: "Conventional (Organized / Data-Driven)", tr: "Geleneksel (Düzenli ve Veri Odaklı)", def: "Preference for working with data, detail, record-keeping, and structured clerical procedures." }
];

for (const rt of riasecTypes) {
  add({
    candidateId: `cand_riasec_${rt.id}`,
    canonicalNameEn: `RIASEC Interest: ${rt.en}`,
    canonicalNameTr: `RIASEC Mesleki İlgi: ${rt.tr}`,
    entityType: "CONSTRUCT",
    proposedDomain: "vocational_work",
    definition: rt.def,
    aliases: [`Holland ${rt.id.toUpperCase()}`, `RIASEC ${rt.en}`],
    relatedConstructs: ["cand_hexaco_openness", "cand_hexaco_extraversion"],
    overlapWithCurrentOntology: [],
    directOrDerived: "DIRECT",
    measurementMode: "DIRECT_PSYCHOMETRIC",
    measurementLevel: "SUBSCALE",
    evidenceQuality: "STRONG",
    evidenceSummary: "Holland (1997) RIASEC hexagon. Validated in Turkish by Yeşilyaprak et al. (2009). Must NEVER be merged with personality traits.",
    keySources: ["src_holland_1997_riasec", "src_yesilyaprak_2009_riasec"],
    claimSources: {
      definitionSourceIds: ["src_holland_1997_riasec"],
      evidenceSourceIds: ["src_holland_1997_riasec"],
      measurementSourceIds: ["src_holland_1997_riasec"],
      turkishEvidenceSourceIds: ["src_yesilyaprak_2009_riasec"],
      overlapSourceIds: ["src_holland_1997_riasec"],
      licensingSourceIds: ["src_par_inc_terms"]
    },
    turkishEvidenceStatus: "DIRECT",
    turkishEvidenceLevel: "SUBSCALE",
    knownInstrumentCandidates: [
      { instrumentName: "O*NET Interest Profiler / SDS Turkish Adaptation", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
    ],
    licensingStatus: "APPROVED_PUBLIC",
    clinicalRisk: "NONE",
    clinicalSafetyClass: "NON_CLINICAL",
    consumerSuitability: "HIGH",
    longitudinalSuitability: "STATIC_TRAIT",
    visualizationSuitability: ["HEXAGON", "BAR_GRID", "DASHBOARD"],
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
    decision: "INCLUDE_ADVANCED",
    decisionRationale: `Distinct vocational interest taxonomy under Holland's hexagonal model. Validated in Turkish.`
  });
}

add({
  candidateId: "cand_work_engagement_vigor_dedication",
  canonicalNameEn: "Work Engagement (Vigor & Dedication)",
  canonicalNameTr: "İşe Angaje Olma (Canlılık ve Adanmışlık)",
  entityType: "CONSTRUCT",
  proposedDomain: "vocational_work",
  definition: "A positive, fulfilling, work-related state of mind characterized by high energy, mental resilience while working (vigor), and a sense of significance and enthusiasm (dedication).",
  aliases: ["UWES-9", "Occupational Engagement"],
  relatedConstructs: ["cand_hexaco_conscientiousness"],
  overlapWithCurrentOntology: [],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SCALE_TOTAL",
  evidenceQuality: "STRONG",
  evidenceSummary: "Schaufeli et al. (2006) UWES-9 scale. Validated in Turkish working populations by Eryılmaz & Kara (2017).",
  keySources: ["src_schaufeli_2006_uwes", "src_eryilmaz_2017_uwes"],
  claimSources: {
    definitionSourceIds: ["src_schaufeli_2006_uwes"],
    evidenceSourceIds: ["src_schaufeli_2006_uwes"],
    measurementSourceIds: ["src_schaufeli_2006_uwes"],
    turkishEvidenceSourceIds: ["src_eryilmaz_2017_uwes"],
    overlapSourceIds: ["src_schaufeli_2006_uwes"],
    licensingSourceIds: ["src_schaufeli_2006_uwes"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "SCALE_TOTAL",
  knownInstrumentCandidates: [
    { instrumentName: "Utrecht Work Engagement Scale (UWES-9 / TR Eryılmaz & Kara, 2017)", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
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
  decision: "INCLUDE_ADVANCED",
  decisionRationale: "High value for workplace professional development modules with verified Turkish psychometrics."
});

add({
  candidateId: "cand_work_values_intrinsic_extrinsic",
  canonicalNameEn: "Work Values Orientation",
  canonicalNameTr: "Mesleki Değer Yönelimi (İçsel ve Dışsal)",
  entityType: "CONSTRUCT",
  proposedDomain: "vocational_work",
  definition: "The relative importance placed on intrinsic career factors (growth, autonomy, meaning) versus extrinsic rewards (salary, prestige, security).",
  aliases: ["Super Work Values", "Career Value Priorities"],
  relatedConstructs: ["cand_schwartz_self_enhancement"],
  overlapWithCurrentOntology: [],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "CONSTRUCT",
  evidenceQuality: "MODERATE",
  evidenceSummary: "Super's Work Values Inventory framework. Captures professional career motivations.",
  keySources: ["src_schaufeli_2006_uwes"],
  claimSources: {
    definitionSourceIds: ["src_schaufeli_2006_uwes"],
    evidenceSourceIds: ["src_schaufeli_2006_uwes"],
    measurementSourceIds: ["src_schaufeli_2006_uwes"],
    turkishEvidenceSourceIds: [],
    overlapSourceIds: ["src_schaufeli_2006_uwes"],
    licensingSourceIds: []
  },
  turkishEvidenceStatus: "NO_DIRECT",
  turkishEvidenceLevel: "NOT_ASSESSED",
  knownInstrumentCandidates: [
    { instrumentName: "Work Values Inventory (WVI)", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["BAR_GRID", "HEATMAP"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_adler", "lens_maslow"],
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
  decisionRationale: "Enriches career advisory and organizational alignment profiles."
});

// -----------------------------------------------------------------------------
// 10. COPING MECHANISMS & STRESS RESPONSES (6 Candidates)
// -----------------------------------------------------------------------------
const copingTypes = [
  { id: "problem_focused_coping", en: "Problem-Focused Active Coping", tr: "Problem Odaklı Aktif Başa Çıkma", def: "Taking direct, proactive cognitive and behavioral steps to remove or circumvent a stressor.", core: true },
  { id: "positive_reframing_coping", en: "Positive Reframing Coping", tr: "Olumlu Yeniden Çerçeveleme ile Başa Çıkma", def: "Making the best of a stressful situation by viewing it in a more positive light and seeking growth.", core: true },
  { id: "acceptance_coping", en: "Acceptance Coping", tr: "Kabullenme ile Başa Çıkma", def: "Accepting the reality of a stressful situation and learning to live with it rather than futile denial.", core: true },
  { id: "support_seeking_coping", en: "Support-Seeking Coping", tr: "Sosyal Destek Arama ile Başa Çıkma", def: "Seeking emotional support, advice, and instrumental assistance from others when facing adversity.", core: true },
  { id: "avoidant_disengagement_coping", en: "Avoidant Disengagement Coping", tr: "Kaçınmacı / Vazgeçişle Başa Çıkma", def: "Giving up the attempt to cope and using behavioral or psychological disengagement to avoid the stressor.", core: true },
  { id: "humor_coping", en: "Humor Coping", tr: "Mizah Yoluyla Başa Çıkma", def: "Making jokes, finding humor, and laughing about the stressful situation to reduce acute tension.", core: false }
];

for (const ct of copingTypes) {
  add({
    candidateId: `cand_${ct.id}`,
    canonicalNameEn: ct.en,
    canonicalNameTr: ct.tr,
    entityType: "CONSTRUCT",
    proposedDomain: "coping_resilience",
    definition: ct.def,
    aliases: [`Brief COPE ${ct.en}`],
    relatedConstructs: ["cand_cognitive_reappraisal", "cand_distress_tolerance"],
    overlapWithCurrentOntology: [],
    directOrDerived: "DIRECT",
    measurementMode: "DIRECT_PSYCHOMETRIC",
    measurementLevel: "SUBSCALE",
    evidenceQuality: "STRONG",
    evidenceSummary: "Carver (1997) Brief COPE. Validated in Turkish samples by Ağargün et al. (2005). Must be scored as discrete subscales, not collapsed into one score.",
    keySources: ["src_carver_1997_brief_cope", "src_agargun_2005_brief_cope"],
    claimSources: {
      definitionSourceIds: ["src_carver_1997_brief_cope"],
      evidenceSourceIds: ["src_carver_1997_brief_cope"],
      measurementSourceIds: ["src_carver_1997_brief_cope"],
      turkishEvidenceSourceIds: ["src_agargun_2005_brief_cope"],
      overlapSourceIds: ["src_carver_1997_brief_cope"],
      licensingSourceIds: ["src_carver_1997_brief_cope"]
    },
    turkishEvidenceStatus: "DIRECT",
    turkishEvidenceLevel: "SUBSCALE",
    knownInstrumentCandidates: [
      { instrumentName: `Brief COPE (${ct.en} / TR Ağargün et al., 2005)`, isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
    ],
    licensingStatus: "APPROVED_PUBLIC",
    clinicalRisk: "NONE",
    clinicalSafetyClass: "NON_CLINICAL",
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
      safety: "SAFE_NON_CLINICAL",
      turkishEvidence: "DIRECT_VALIDATED",
      licensingFeasibility: "OPEN_ACCESSIBLE",
      assessmentBurden: "LOW",
      longitudinalValue: "HIGH",
      interpretability: "HIGH"
    },
    decision: ct.core ? "INCLUDE_CORE" : "INCLUDE_ADVANCED",
    decisionRationale: `Distinct transactional coping strategy under Carver's Brief COPE with validated Turkish psychometrics.`
  });
}

// -----------------------------------------------------------------------------
// 11. EXISTENTIAL, MEANING & PURPOSE (3 Candidates)
// -----------------------------------------------------------------------------
add({
  candidateId: "cand_presence_of_meaning",
  canonicalNameEn: "Presence of Meaning in Life",
  canonicalNameTr: "Anlamın Varlığı",
  entityType: "CONSTRUCT",
  proposedDomain: "existential_meaning",
  definition: "The extent to which people comprehend, make sense of, or see significance in their lives, feeling they have purpose and mission.",
  aliases: ["MLQ Presence", "Meaning in Life"],
  relatedConstructs: ["cand_search_for_meaning", "cand_sense_of_coherence"],
  overlapWithCurrentOntology: ["presence_of_meaning", "existential_meaning"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SUBSCALE",
  evidenceQuality: "STRONG",
  evidenceSummary: "Steger et al. (2006) MLQ model. Validated in Turkish by Akın & Taş (2015) (N=410, alpha = 0.77). Orthogonal to Search for Meaning.",
  keySources: ["src_steger_2006_mlq", "src_akin_tas_2015_mlq"],
  claimSources: {
    definitionSourceIds: ["src_steger_2006_mlq"],
    evidenceSourceIds: ["src_steger_2006_mlq"],
    measurementSourceIds: ["src_steger_2006_mlq"],
    turkishEvidenceSourceIds: ["src_akin_tas_2015_mlq"],
    overlapSourceIds: ["src_steger_2006_mlq"],
    licensingSourceIds: ["src_steger_2006_mlq"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "SUBSCALE",
  knownInstrumentCandidates: [
    { instrumentName: "Meaning in Life Questionnaire (Presence Subscale / TR Akın & Taş)", instrumentId: "inst_mlq", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["BAR_GRID", "HEATMAP", "FINGERPRINT", "DASHBOARD"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_rogers", "lens_maslow", "lens_adler"],
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
  decisionRationale: "Essential existential pillar with verified Turkish psychometric adaptation (Akın & Taş, 2015)."
});

add({
  candidateId: "cand_search_for_meaning",
  canonicalNameEn: "Search for Meaning in Life",
  canonicalNameTr: "Anlam Arayışı",
  entityType: "CONSTRUCT",
  proposedDomain: "existential_meaning",
  definition: "The dynamic motivational drive and openness to establish, deepen, or enhance meaning and purpose in one's existence.",
  aliases: ["MLQ Search", "Existential Quest"],
  relatedConstructs: ["cand_presence_of_meaning"],
  overlapWithCurrentOntology: ["search_for_meaning", "existential_meaning"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SUBSCALE",
  evidenceQuality: "STRONG",
  evidenceSummary: "Steger et al. (2006) MLQ model. Validated in Turkish by Akın & Taş (2015) (N=410, alpha = 0.83). Orthogonal to Presence of Meaning.",
  keySources: ["src_steger_2006_mlq", "src_akin_tas_2015_mlq"],
  claimSources: {
    definitionSourceIds: ["src_steger_2006_mlq"],
    evidenceSourceIds: ["src_steger_2006_mlq"],
    measurementSourceIds: ["src_steger_2006_mlq"],
    turkishEvidenceSourceIds: ["src_akin_tas_2015_mlq"],
    overlapSourceIds: ["src_steger_2006_mlq"],
    licensingSourceIds: ["src_steger_2006_mlq"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "SUBSCALE",
  knownInstrumentCandidates: [
    { instrumentName: "Meaning in Life Questionnaire (Search Subscale / TR Akın & Taş)", instrumentId: "inst_mlq", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["BAR_GRID", "HEATMAP", "FINGERPRINT", "DASHBOARD"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_rogers", "lens_maslow", "lens_adler"],
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
  decisionRationale: "Essential existential quest dimension with verified Turkish psychometric validation."
});

add({
  candidateId: "cand_sense_of_coherence",
  canonicalNameEn: "Sense of Coherence",
  canonicalNameTr: "Tutarlılık / Anlamlılık Duygusu (Salutogenesis)",
  entityType: "CONSTRUCT",
  proposedDomain: "existential_meaning",
  definition: "A global orientation expressing the extent to which one has pervasive, enduring confidence that stimuli are comprehensible, resources are manageable, and demands are meaningful challenges.",
  aliases: ["SOC", "Antonovsky Salutogenesis"],
  relatedConstructs: ["cand_presence_of_meaning", "cand_generalized_self_efficacy"],
  overlapWithCurrentOntology: ["existential_meaning"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SCALE_TOTAL",
  evidenceQuality: "STRONG",
  evidenceSummary: "Antonovsky (1987) salutogenic model. Extensive cross-cultural evidence of health and resilience prediction.",
  keySources: ["src_antonovsky_1987_soc"],
  claimSources: {
    definitionSourceIds: ["src_antonovsky_1987_soc"],
    evidenceSourceIds: ["src_antonovsky_1987_soc"],
    measurementSourceIds: ["src_antonovsky_1987_soc"],
    turkishEvidenceSourceIds: [],
    overlapSourceIds: ["src_antonovsky_1987_soc"],
    licensingSourceIds: ["src_antonovsky_1987_soc"]
  },
  turkishEvidenceStatus: "NO_DIRECT",
  turkishEvidenceLevel: "NOT_ASSESSED",
  knownInstrumentCandidates: [
    { instrumentName: "Sense of Coherence Scale (SOC-13)", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["BAR_GRID", "HEATMAP"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_gestalt", "lens_adler"],
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
  decision: "INCLUDE_ADVANCED",
  decisionRationale: "Provides salutogenic resilience perspective in existential enrichment batteries."
});

// -----------------------------------------------------------------------------
// 12. MORAL & PROSOCIAL DISPOSITIONS (5 Candidates)
// -----------------------------------------------------------------------------
add({
  candidateId: "cand_moral_foundations_individualizing",
  canonicalNameEn: "Individualizing Moral Foundations (Care & Fairness)",
  canonicalNameTr: "Bireyci Ahlaki Temeller (Şefkat ve Adalet)",
  entityType: "CONSTRUCT",
  proposedDomain: "moral_prosocial",
  definition: "Moral orientation based on protecting individual rights, preventing harm/suffering (Care/Harm), and ensuring fairness, justice, and reciprocity (Fairness/Cheating).",
  aliases: ["MFQ Individualizing Cluster", "Care & Fairness Ethics"],
  relatedConstructs: ["cand_moral_foundations_binding", "cand_hexaco_honesty_humility"],
  overlapWithCurrentOntology: [],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SUBSCALE",
  evidenceQuality: "STRONG",
  evidenceSummary: "Graham, Haidt et al. (2011) Moral Foundations Theory. Validated in Turkish by Yılmaz et al. (2016).",
  keySources: ["src_graham_haidt_2011_mfq", "src_yilmaz_2016_mfq"],
  claimSources: {
    definitionSourceIds: ["src_graham_haidt_2011_mfq"],
    evidenceSourceIds: ["src_graham_haidt_2011_mfq"],
    measurementSourceIds: ["src_graham_haidt_2011_mfq"],
    turkishEvidenceSourceIds: ["src_yilmaz_2016_mfq"],
    overlapSourceIds: ["src_graham_haidt_2011_mfq"],
    licensingSourceIds: ["src_graham_haidt_2011_mfq"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "SUBSCALE",
  knownInstrumentCandidates: [
    { instrumentName: "Moral Foundations Questionnaire (MFQ-30 / TR Yılmaz et al., 2016)", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["BAR_GRID", "HEATMAP"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_adler", "lens_rogers"],
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
  decision: "INCLUDE_ADVANCED",
  decisionRationale: "Captures core liberal/individualizing moral intuitions with verified Turkish validation."
});

add({
  candidateId: "cand_moral_foundations_binding",
  canonicalNameEn: "Binding Moral Foundations (Loyalty, Authority, Sanctity)",
  canonicalNameTr: "Bağlayıcı Ahlaki Temeller (Sadakat, Otorite, Kutsallık)",
  entityType: "CONSTRUCT",
  proposedDomain: "moral_prosocial",
  definition: "Moral orientation based on group cohesion (Loyalty/Betrayal), respect for legitimate hierarchy and tradition (Authority/Subversion), and spiritual/bodily purity (Sanctity/Degradation).",
  aliases: ["MFQ Binding Cluster", "Communal & Sanctity Ethics"],
  relatedConstructs: ["cand_moral_foundations_individualizing", "cand_schwartz_conservation"],
  overlapWithCurrentOntology: [],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SUBSCALE",
  evidenceQuality: "STRONG",
  evidenceSummary: "Graham, Haidt et al. (2011). Validated in Turkish by Yılmaz et al. (2016). Distinct moral intuition cluster.",
  keySources: ["src_graham_haidt_2011_mfq", "src_yilmaz_2016_mfq"],
  claimSources: {
    definitionSourceIds: ["src_graham_haidt_2011_mfq"],
    evidenceSourceIds: ["src_graham_haidt_2011_mfq"],
    measurementSourceIds: ["src_graham_haidt_2011_mfq"],
    turkishEvidenceSourceIds: ["src_yilmaz_2016_mfq"],
    overlapSourceIds: ["src_graham_haidt_2011_mfq"],
    licensingSourceIds: ["src_graham_haidt_2011_mfq"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "SUBSCALE",
  knownInstrumentCandidates: [
    { instrumentName: "Moral Foundations Questionnaire (Binding Cluster / TR Yılmaz et al., 2016)", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["BAR_GRID", "HEATMAP"],
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
  decision: "INCLUDE_ADVANCED",
  decisionRationale: "Captures group-binding moral foundations with verified Turkish adaptation."
});

add({
  candidateId: "cand_prosocial_behavior_altruism",
  canonicalNameEn: "Prosocial Behavioral Tendencies (Altruistic & Dire)",
  canonicalNameTr: "Özgeci ve Prososyal Davranış Eğilimi",
  entityType: "CONSTRUCT",
  proposedDomain: "moral_prosocial",
  definition: "Dispositional tendency to engage in voluntary actions intended to benefit or assist other individuals, especially in emergencies or without expectations of reward.",
  aliases: ["PTM Altruism", "Helping Orientation"],
  relatedConstructs: ["cand_empathic_concern", "cand_hexaco_honesty_humility"],
  overlapWithCurrentOntology: [],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SUBSCALE",
  evidenceQuality: "STRONG",
  evidenceSummary: "Carlo & Randall (2002) Prosocial Tendencies Measure (PTM). Predicts actual helping behavior across diverse age groups.",
  keySources: ["src_carlo_randall_2002_ptm"],
  claimSources: {
    definitionSourceIds: ["src_carlo_randall_2002_ptm"],
    evidenceSourceIds: ["src_carlo_randall_2002_ptm"],
    measurementSourceIds: ["src_carlo_randall_2002_ptm"],
    turkishEvidenceSourceIds: [],
    overlapSourceIds: ["src_carlo_randall_2002_ptm"],
    licensingSourceIds: ["src_carlo_randall_2002_ptm"]
  },
  turkishEvidenceStatus: "NO_DIRECT",
  turkishEvidenceLevel: "NOT_ASSESSED",
  knownInstrumentCandidates: [
    { instrumentName: "Prosocial Tendencies Measure (PTM)", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["BAR_GRID", "HEATMAP"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_adler", "lens_rogers"],
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
  decisionRationale: "Measures overt prosocial behavioral tendencies."
});

add({
  candidateId: "cand_moral_identity_internalization",
  canonicalNameEn: "Moral Identity (Internalization)",
  canonicalNameTr: "Ahlaki Kimlik (İçselleştirme)",
  entityType: "CONSTRUCT",
  proposedDomain: "moral_prosocial",
  definition: "The degree to which moral traits and virtues are central to an individual's core self-concept.",
  aliases: ["Aquino Moral Identity", "Self-Concept Moral Centrality"],
  relatedConstructs: ["cand_moral_identity_symbolization", "cand_authenticity"],
  overlapWithCurrentOntology: [],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SUBSCALE",
  evidenceQuality: "MODERATE",
  evidenceSummary: "Aquino & Reed (2002). Predicts moral motivation and ethical decision making.",
  keySources: ["src_graham_haidt_2011_mfq"],
  claimSources: {
    definitionSourceIds: ["src_graham_haidt_2011_mfq"],
    evidenceSourceIds: ["src_graham_haidt_2011_mfq"],
    measurementSourceIds: ["src_graham_haidt_2011_mfq"],
    turkishEvidenceSourceIds: [],
    overlapSourceIds: ["src_graham_haidt_2011_mfq"],
    licensingSourceIds: []
  },
  turkishEvidenceStatus: "NO_DIRECT",
  turkishEvidenceLevel: "NOT_ASSESSED",
  knownInstrumentCandidates: [
    { instrumentName: "Moral Identity Scale (Internalization Subscale)", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["BAR_GRID", "HEATMAP"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_rogers", "lens_adler"],
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
  decisionRationale: "Provides self-system integration with moral principles."
});

add({
  candidateId: "cand_moral_identity_symbolization",
  canonicalNameEn: "Moral Identity (Symbolization)",
  canonicalNameTr: "Ahlaki Kimlik (Sembolleştirme / Dışa Vurma)",
  entityType: "CONSTRUCT",
  proposedDomain: "moral_prosocial",
  definition: "The degree to which moral traits are expressed publicly through actions and symbols in the social world.",
  aliases: ["Aquino Moral Symbolization", "Public Moral Expression"],
  relatedConstructs: ["cand_moral_identity_internalization"],
  overlapWithCurrentOntology: [],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SUBSCALE",
  evidenceQuality: "MODERATE",
  evidenceSummary: "Aquino & Reed (2002). Captures externalized moral communication.",
  keySources: ["src_graham_haidt_2011_mfq"],
  claimSources: {
    definitionSourceIds: ["src_graham_haidt_2011_mfq"],
    evidenceSourceIds: ["src_graham_haidt_2011_mfq"],
    measurementSourceIds: ["src_graham_haidt_2011_mfq"],
    turkishEvidenceSourceIds: [],
    overlapSourceIds: ["src_graham_haidt_2011_mfq"],
    licensingSourceIds: []
  },
  turkishEvidenceStatus: "NO_DIRECT",
  turkishEvidenceLevel: "NOT_ASSESSED",
  knownInstrumentCandidates: [
    { instrumentName: "Moral Identity Scale (Symbolization Subscale)", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
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
    incrementalValue: "MODERATE",
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
  decisionRationale: "Complements internalization subscale in advanced moral profiling."
});

// -----------------------------------------------------------------------------
// 13. SUBCLINICAL DARK TETRAD TRAITS (4 Candidates)
// -----------------------------------------------------------------------------
const darkTetrad = [
  { id: "machiavellianism_subclinical", en: "Subclinical Machiavellianism", tr: "Stratejik Faydacılık (Makyavelist Yönelim)", def: "A disposition characterized by interpersonal manipulation, strategic cynicism, calculated pragmatism, and low concern for conventional morality." },
  { id: "grandiose_narcissism_subclinical", en: "Subclinical Grandiose Narcissism", tr: "Ego Striving ve Statü İhtiyacı (Narsisistik Yönelim)", def: "A disposition characterized by grandiosity, entitlement, pursuit of high status and admiration, and self-enhancement." },
  { id: "psychopathy_subclinical", en: "Subclinical Psychopathy", tr: "Sert Mizaç ve Düşük Empati (Psikopatik Yönelim)", def: "A disposition characterized by high impulsivity, thrill-seeking, low empathy, low remorse, and interpersonal callousness." },
  { id: "everyday_sadism_subclinical", en: "Subclinical Everyday Sadism", tr: "Sert Rekabetçilik ve Acımasızlık (Sadist Yönelim)", def: "A disposition characterized by the tendency to derive enjoyment or satisfaction from dominating or causing distress to others in competitive or vicarious contexts." }
];

for (const dt of darkTetrad) {
  add({
    candidateId: `cand_${dt.id}`,
    canonicalNameEn: dt.en,
    canonicalNameTr: dt.tr,
    entityType: "CONSTRUCT",
    proposedDomain: "optional_dark_tetrad",
    definition: dt.def,
    aliases: [`SD4 ${dt.en}`, `Dark Tetrad ${dt.id}`],
    relatedConstructs: ["cand_hexaco_honesty_humility"],
    overlapWithCurrentOntology: ["dark_tetrad_traits", dt.id.replace('_subclinical', '')],
    directOrDerived: "DIRECT",
    measurementMode: "DIRECT_PSYCHOMETRIC",
    measurementLevel: "SUBSCALE",
    evidenceQuality: "MODERATE",
    evidenceSummary: "Paulhus et al. (2020) Short Dark Tetrad (SD4). Validated in Turkish samples by Özsoy et al. (2017). Subclinical non-diagnostic research tool.",
    keySources: ["src_paulhus_2020_sd4", "src_ozsoy_2017_darktriad"],
    claimSources: {
      definitionSourceIds: ["src_paulhus_2020_sd4"],
      evidenceSourceIds: ["src_paulhus_2020_sd4"],
      measurementSourceIds: ["src_paulhus_2020_sd4"],
      turkishEvidenceSourceIds: ["src_ozsoy_2017_darktriad"],
      overlapSourceIds: ["src_paulhus_2020_sd4"],
      licensingSourceIds: ["src_paulhus_2020_sd4"]
    },
    turkishEvidenceStatus: "DIRECT",
    turkishEvidenceLevel: "SUBSCALE",
    knownInstrumentCandidates: [
      { instrumentName: "Short Dark Tetrad (SD4 / TR Özsoy et al., 2017)", instrumentId: "inst_sd4", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
    ],
    licensingStatus: "APPROVED_PUBLIC",
    clinicalRisk: "MODERATE",
    clinicalSafetyClass: "NON_CLINICAL_ADJACENT",
    consumerSuitability: "CONDITIONAL",
    longitudinalSuitability: "STATIC_TRAIT",
    visualizationSuitability: ["BAR_GRID", "HEATMAP"],
    aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
    historicalTheoryEligibility: ["lens_freud", "lens_adler"],
    decisionRubric: {
      scientificDistinctiveness: "HIGH",
      incrementalValue: "MODERATE",
      measurementMaturity: "MODERATE",
      consumerRelevance: "MODERATE",
      safety: "GOVERNED_ADJACENT",
      turkishEvidence: "DIRECT_VALIDATED",
      licensingFeasibility: "OPEN_ACCESSIBLE",
      assessmentBurden: "LOW",
      longitudinalValue: "LOW",
      interpretability: "MODERATE"
    },
    decision: "INCLUDE_ADVANCED",
    decisionRationale: `Maintained strictly as an optional subclinical research module with rigorous non-clinical framing and user consent.`
  });
}

// -----------------------------------------------------------------------------
// 14. CLINICAL PATHOLOGY / HIGH-RISK EXCLUSIONS (8 Candidates - ALL EXCLUDE)
// -----------------------------------------------------------------------------
const clinicalExclusions = [
  { id: "clinical_major_depression_symptoms", en: "Clinical Major Depressive Disorder Symptoms", tr: "Klinik Majör Depresyon Belirtileri (BDI-II)", def: "Psychiatric diagnostic symptom criteria for major depressive episodes." },
  { id: "generalized_anxiety_disorder_symptoms", en: "Generalized Anxiety Disorder Symptoms", tr: "Yaygın Anksiyete Bozukluğu Belirtileri (GAD-7)", def: "Psychiatric diagnostic symptom criteria for generalized anxiety disorder." },
  { id: "borderline_personality_organization", en: "Borderline Personality Disorder Pathology", tr: "Borderline Kişilik Bozukluğu Patolojisi (SCID-II)", def: "Psychiatric personality disorder criteria involving identity diffusion and extreme affective instability." },
  { id: "schizotypy_psychosis_proneness", en: "Schizotypy & Psychosis Proneness", tr: "Şizotipi ve Psikoz Yatkınlığı (SPQ)", def: "Clinical perceptual aberration, magical ideation, and paranoid psychosis-proneness criteria." },
  { id: "post_traumatic_stress_symptoms", en: "Post-Traumatic Stress Symptoms", tr: "Travma Sonrası Stres Belirtileri (PCL-5)", def: "Psychiatric symptom criteria following severe trauma exposure." },
  { id: "obsessive_compulsive_symptoms", en: "Obsessive-Compulsive Symptoms", tr: "Obsesif-Kompulsif Klinik Belirtiler (OCI-R)", def: "Psychiatric intrusive obsessions and compulsive ritualistic symptoms." },
  { id: "bipolar_hypomania_symptoms", en: "Bipolar Hypomania / Mania Symptoms", tr: "Bipolar Hipomani / Mani Belirtileri (HCL-32)", def: "Psychiatric symptom criteria for mood elevation, grandiosity, and reduced sleep." },
  { id: "eating_disorder_pathology", en: "Eating Disorder Pathology", tr: "Yeme Bozukluğu Patolojisi (EAT-26)", def: "Clinical anorexia, bulimia, and disordered eating pathology criteria." }
];

for (const ce of clinicalExclusions) {
  add({
    candidateId: `cand_${ce.id}`,
    canonicalNameEn: ce.en,
    canonicalNameTr: ce.tr,
    entityType: "CLINICAL_CONSTRUCT",
    proposedDomain: "clinical_pathology_excluded",
    definition: ce.def,
    aliases: [`DSM-5 ${ce.en}`],
    relatedConstructs: [],
    overlapWithCurrentOntology: [],
    directOrDerived: "NOT_MEASURED",
    measurementMode: "NOT_MEASURABLE",
    measurementLevel: "SCALE_TOTAL",
    evidenceQuality: "STRONG",
    evidenceSummary: "Established psychiatric diagnostic criteria in DSM-5-TR and ICD-11. PROHIBITED from PsycheAI consumer profile model.",
    keySources: ["src_apa_dsm5_tr_2022", "src_beck_1996_bdi2", "src_spitzer_2006_gad7"],
    claimSources: {
      definitionSourceIds: ["src_apa_dsm5_tr_2022"],
      evidenceSourceIds: ["src_apa_dsm5_tr_2022"],
      measurementSourceIds: ["src_apa_dsm5_tr_2022"],
      turkishEvidenceSourceIds: [],
      overlapSourceIds: ["src_apa_dsm5_tr_2022"],
      licensingSourceIds: []
    },
    turkishEvidenceStatus: "UNKNOWN",
    turkishEvidenceLevel: "NOT_ASSESSED",
    knownInstrumentCandidates: [],
    licensingStatus: "STRICTLY_PROPRIETARY",
    clinicalRisk: "HIGH",
    clinicalSafetyClass: "CLINICAL_DIAGNOSTIC",
    consumerSuitability: "UNSUITABLE",
    longitudinalSuitability: "NOT_APPLICABLE",
    visualizationSuitability: [],
    aiInterpretationEligibility: "PROHIBITED",
    historicalTheoryEligibility: [],
    decisionRubric: {
      scientificDistinctiveness: "HIGH",
      incrementalValue: "LOW",
      measurementMaturity: "HIGH",
      consumerRelevance: "LOW",
      safety: "CLINICAL_RISK",
      turkishEvidence: "UNKNOWN",
      licensingFeasibility: "PROPRIETARY_BLOCKED",
      assessmentBurden: "HIGH",
      longitudinalValue: "LOW",
      interpretability: "LOW"
    },
    decision: "EXCLUDE",
    decisionRationale: `Strict safety gate: PsycheAI is a non-clinical consumer platform. ${ce.en} is an explicit clinical diagnostic entity and must NEVER be measured or inferred in consumer profiles.`
  });
}

// -----------------------------------------------------------------------------
// 15. HISTORICAL THEORETICAL LENSES (8 Candidates - ALL THEORY_ONLY)
// -----------------------------------------------------------------------------
const theoreticalLenses = [
  { id: "freudian_psychoanalytic_conflicts", en: "Sigmund Freud — Psychoanalytic Drive & Conflict Lens", tr: "Sigmund Freud — Klasik Psikanalitik Çatışma Merceği", figure: "Sigmund Freud", def: "Interpretive meta-framework viewing psychological tension as unconscious compromise between instinctual drives (Id) and internalized social standards (Superego)." },
  { id: "jungian_psychological_types", en: "Carl Jung — Analytical Psychology & Typology Lens", tr: "Carl Gustav Jung — Analitik Psikoloji ve Tipleme Merceği", figure: "Carl G. Jung", def: "Interpretive meta-framework examining continuous energetic orientations (introversion/extraversion) and complementary psychological functions (thinking/feeling/sensation/intuition)." },
  { id: "adlerian_lifestyle_superiority_striving", en: "Alfred Adler — Individual Psychology & Social Interest Lens", tr: "Alfred Adler — Bireysel Psikoloji ve Sosyal İlgi Merceği", figure: "Alfred Adler", def: "Interpretive meta-framework examining teleological goal striving, compensation for felt inferiority, and community feeling (Gemeinschaftsgefühl)." },
  { id: "rogerian_organismic_actualization", en: "Carl Rogers — Person-Centered / Humanistic Lens", tr: "Carl Rogers — Birey Merkezli / Hümanistik Benlik Merceği", figure: "Carl Rogers", def: "Interpretive meta-framework evaluating congruence between actual self and ideal self, and the impact of contingent conditions of worth." },
  { id: "maslow_hierarchy_of_needs_pyramid", en: "Abraham Maslow — Holistic Dynamic Needs Lens", tr: "Abraham Maslow — Bütüncül Dinamik İhtiyaçlar Merceği", figure: "Abraham Maslow", def: "Interpretive meta-framework framing human motivation as dynamic striving from deficiency needs toward self-actualization." },
  { id: "skinnerian_operant_reinforcement_history", en: "B.F. Skinner — Radical Behaviorist Contingency Lens", tr: "B.F. Skinner — Radikal Davranışçı Pekiştirme Merceği", figure: "B.F. Skinner", def: "Interpretive meta-framework explaining self-regulation and habits in terms of environmental stimulus control, reinforcement history, and behavioral consequences." },
  { id: "jamesian_functional_stream_of_self", en: "William James — Functionalist Stream of Self Lens", tr: "William James — İşlevselci ve Pragmatik Benlik Merceği", figure: "William James", def: "Interpretive meta-framework examining the functional utility of psychological traits and the multi-layered self (Material, Social, Spiritual)." },
  { id: "gestalt_field_figure_ground_closure", en: "Gestalt Psychology — Holistic Field & Closure Lens", tr: "Geştalt Psikolojisi — Bütüncül Alan ve Kapanış Merceği", figure: "Gestalt Founders", def: "Interpretive meta-framework examining structural profile emergence, figure-ground shifts in attention, and psychological need for closure." }
];

for (const tl of theoreticalLenses) {
  add({
    candidateId: `cand_${tl.id}`,
    canonicalNameEn: tl.en,
    canonicalNameTr: tl.tr,
    entityType: "HISTORICAL_CONCEPT",
    proposedDomain: "theoretical_lenses",
    definition: tl.def,
    aliases: [`Lens: ${tl.figure}`],
    relatedConstructs: [],
    overlapWithCurrentOntology: [],
    directOrDerived: "THEORETICAL",
    measurementMode: "THEORETICAL_ONLY",
    measurementLevel: "THEORETICAL_FRAMEWORK",
    evidenceQuality: "THEORETICAL_ONLY",
    evidenceSummary: "Foundational classic psychological theory. Provides rich qualitative narrative lenses for interpreting modern psychometric scores, but NEVER generates synthetic psychometric scores.",
    keySources: ["src_freud_1923_ego_id", "src_jung_1921_types", "src_adler_1927_individual", "src_rogers_1961_person", "src_maslow_1943_motivation", "src_skinner_1953_science", "src_james_1890_principles", "src_wertheimer_1923_gestalt"],
    claimSources: {
      definitionSourceIds: ["src_freud_1923_ego_id"],
      evidenceSourceIds: ["src_freud_1923_ego_id"],
      measurementSourceIds: [],
      turkishEvidenceSourceIds: [],
      overlapSourceIds: [],
      licensingSourceIds: []
    },
    turkishEvidenceStatus: "NO_DIRECT",
    turkishEvidenceLevel: "NOT_ASSESSED",
    knownInstrumentCandidates: [],
    licensingStatus: "NOT_APPLICABLE",
    clinicalRisk: "NONE",
    clinicalSafetyClass: "NON_CLINICAL",
    consumerSuitability: "HIGH",
    longitudinalSuitability: "NOT_APPLICABLE",
    visualizationSuitability: ["DASHBOARD"],
    aiInterpretationEligibility: "THEORETICAL_LENS_ONLY",
    historicalTheoryEligibility: [],
    decisionRubric: {
      scientificDistinctiveness: "HIGH",
      incrementalValue: "HIGH",
      measurementMaturity: "THEORETICAL_ONLY" as any,
      consumerRelevance: "HIGH",
      safety: "SAFE_NON_CLINICAL",
      turkishEvidence: "NO_DIRECT",
      licensingFeasibility: "OPEN_ACCESSIBLE",
      assessmentBurden: "LOW",
      longitudinalValue: "LOW",
      interpretability: "HIGH"
    },
    decision: "THEORY_ONLY",
    decisionRationale: `One-way qualitative interpretation lens only. Prohibited from generating synthetic numeric trait scores.`
  });
}

// -----------------------------------------------------------------------------
// 16. DERIVED & LONGITUDINAL DYNAMICS (6 Candidates)
// -----------------------------------------------------------------------------
const derivedDynamics = [
  { id: "actual_ideal_self_gap", en: "Actual–Ideal Self Gap Index", tr: "Gerçek–İdeal Benlik Farkı İndeksi", type: "DERIVED_ONLY", mode: "DERIVED_DETERMINISTIC", def: "Derived absolute gap calculated across paired actual vs ideal self ratings." },
  { id: "actual_ought_self_gap", en: "Actual–Ought Self Gap Index", tr: "Gerçek–Zorunlu Benlik Farkı İndeksi", type: "DERIVED_ONLY", mode: "DERIVED_DETERMINISTIC", def: "Derived absolute gap calculated across paired actual vs ought self ratings." },
  { id: "cross_domain_synergy_index", en: "Cross-Domain Synergy Interaction", tr: "Alanlar Arası Sinerji ve Uyum İndeksi", type: "DERIVED_ONLY", mode: "DERIVED_DETERMINISTIC", def: "Mathematical interaction index identifying constructive alignment between high self-regulation and high openness." },
  { id: "profile_tension_balance_index", en: "Profile Tension & Discrepancy Index", tr: "Profil Gerilim ve Denge İndeksi", type: "DERIVED_ONLY", mode: "DERIVED_DETERMINISTIC", def: "Derived tension metric identifying high perfectionism paired with high negative urgency or low self-compassion." },
  { id: "temporal_trait_stability_index", en: "Temporal Trait Stability Index", tr: "Zamansal Boyut Kararlılığı İndeksi", type: "LONGITUDINAL_ONLY", mode: "LONGITUDINAL_DERIVED", def: "Longitudinal stability metric calculated across repeated assessment administrations over time." },
  { id: "stress_induced_profile_shift", en: "Stress-Induced Profile Shift Index", tr: "Stres Altında Profil Değişim İndeksi", type: "LONGITUDINAL_ONLY", mode: "LONGITUDINAL_DERIVED", def: "Longitudinal shift index comparing baseline scores to acute stress-period responses." }
];

for (const dd of derivedDynamics) {
  add({
    candidateId: `cand_${dd.id}`,
    canonicalNameEn: dd.en,
    canonicalNameTr: dd.tr,
    entityType: "DERIVED_INDEX",
    proposedDomain: "derived_longitudinal_indices",
    definition: dd.def,
    aliases: [`Derived: ${dd.en}`],
    relatedConstructs: [],
    overlapWithCurrentOntology: [],
    directOrDerived: dd.type === "DERIVED_ONLY" ? "DERIVED" : "LONGITUDINAL",
    measurementMode: dd.mode,
    measurementLevel: "DERIVED_INDEX",
    evidenceQuality: "STRONG",
    evidenceSummary: "Deterministic computation derived from underlying psychometric scores. Must NOT be presented as independent self-reported traits.",
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
    longitudinalSuitability: dd.type === "LONGITUDINAL_ONLY" ? "HIGH_LONGITUDINAL_VALUE" : "NOT_APPLICABLE",
    visualizationSuitability: ["MATRIX", "DASHBOARD", "LONGITUDINAL"],
    aiInterpretationEligibility: "DERIVED_INTERACTION_INPUT",
    historicalTheoryEligibility: [],
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
    decision: dd.type as any,
    decisionRationale: `Derived interaction metric computed deterministically from underlying empirical measurements.`
  });
}

// -----------------------------------------------------------------------------
// 17. MEASUREMENT QUALITY & RESPONSE INTEGRITY TELEMETRY (4 Candidates)
// -----------------------------------------------------------------------------
const responseTelemetry = [
  { id: "impression_management_telemetry", en: "Impression Management Telemetry", tr: "Bilinçli Sosyal Beğenirlik Sinyali", def: "Telemetry index detecting deliberate positive self-presentation and faking good." },
  { id: "self_deceptive_enhancement_telemetry", en: "Self-Deceptive Enhancement Telemetry", tr: "Öz-Aldatma / Aşırı İyimserlik Sinyali", def: "Telemetry index detecting unconscious overly positive self-favoring bias." },
  { id: "careless_responding_longstring", en: "Longstring Invariance Telemetry", tr: "Tekdüze Yanıt Örüntüsü (Longstring)", def: "Telemetry index identifying careless straightlining responses." },
  { id: "response_latency_anomaly", en: "Response Latency Anomaly Telemetry", tr: "Yanıt Süresi Anomalisi Sinyali", def: "Telemetry index identifying abnormally fast or slow item completion times." }
];

for (const rt of responseTelemetry) {
  add({
    candidateId: `cand_${rt.id}`,
    canonicalNameEn: rt.en,
    canonicalNameTr: rt.tr,
    entityType: "DIRECT_MEASURE",
    proposedDomain: "response_integrity",
    definition: rt.def,
    aliases: [`Telemetry: ${rt.en}`],
    relatedConstructs: [],
    overlapWithCurrentOntology: [rt.id.replace('_telemetry', '').replace('_longstring', '')],
    directOrDerived: "DIRECT",
    measurementMode: "DIRECT_PSYCHOMETRIC",
    measurementLevel: "SUBSCALE",
    evidenceQuality: "STRONG",
    evidenceSummary: "Paulhus (1991) and Curran (2016). Measurement quality control telemetry; NOT a psychological personality trait.",
    keySources: ["src_paulhus_1991_bidr", "src_curran_2016_careless"],
    claimSources: {
      definitionSourceIds: ["src_paulhus_1991_bidr"],
      evidenceSourceIds: ["src_paulhus_1991_bidr", "src_curran_2016_careless"],
      measurementSourceIds: ["src_paulhus_1991_bidr"],
      turkishEvidenceSourceIds: [],
      overlapSourceIds: ["src_paulhus_1991_bidr"],
      licensingSourceIds: ["src_paulhus_1991_bidr"]
    },
    turkishEvidenceStatus: "NO_DIRECT",
    turkishEvidenceLevel: "NOT_ASSESSED",
    knownInstrumentCandidates: [
      { instrumentName: "BIDR-6 / Telemetry Logging Engine", instrumentId: "inst_bidr_6", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
    ],
    licensingStatus: "APPROVED_PUBLIC",
    clinicalRisk: "NONE",
    clinicalSafetyClass: "NON_CLINICAL",
    consumerSuitability: "HIGH",
    longitudinalSuitability: "NOT_APPLICABLE",
    visualizationSuitability: ["DASHBOARD"],
    aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
    historicalTheoryEligibility: [],
    decisionRubric: {
      scientificDistinctiveness: "HIGH",
      incrementalValue: "HIGH",
      measurementMaturity: "HIGH",
      consumerRelevance: "LOW",
      safety: "SAFE_NON_CLINICAL",
      turkishEvidence: "NO_DIRECT",
      licensingFeasibility: "OPEN_ACCESSIBLE",
      assessmentBurden: "LOW",
      longitudinalValue: "LOW",
      interpretability: "HIGH"
    },
    decision: "INCLUDE_CORE",
    decisionRationale: `Measurement quality and test validity guardrail. Preserved under response_integrity governance outside psychological trait counts.`
  });
}

console.log(`Writing complete finalized candidate pool: ${currentPool.length} candidate constructs...`);
fs.writeFileSync(candidatesFile, JSON.stringify(currentPool, null, 2), 'utf8');
console.log(`✅ Completed candidate-constructs.json with ${currentPool.length} candidate constructs!`);
