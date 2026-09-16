import fs from 'fs';
import path from 'path';

const rootDir = path.resolve(__dirname, '..');
const masterModelDir = path.resolve(rootDir, 'data/master-model');
const candidatesFile = path.resolve(masterModelDir, 'candidate-constructs.json');

const currentPool = JSON.parse(fs.readFileSync(candidatesFile, 'utf8'));

// Helper to push
function add(c: any) {
  currentPool.push(c);
}

// -----------------------------------------------------------------------------
// 7. INTERPERSONAL, SOCIAL & RELATIONAL DYNAMICS (12 Candidates)
// -----------------------------------------------------------------------------
add({
  candidateId: "cand_attachment_anxiety",
  canonicalNameEn: "Attachment Anxiety",
  canonicalNameTr: "Bağlanma Kaygısı (Terk Edilme ve Reddedilme Korkusu)",
  entityType: "CONSTRUCT",
  proposedDomain: "social_relational",
  definition: "The degree to which a person worries about being rejected, abandoned, unloved, or insufficiently valued by close relationship partners.",
  aliases: ["ECR-R Anxiety", "Anxious Attachment Dimension"],
  relatedConstructs: ["cand_attachment_avoidance", "cand_rejection_sensitivity_nonclinical"],
  overlapWithCurrentOntology: ["attachment_anxiety", "attachment_system"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SUBSCALE",
  evidenceQuality: "STRONG",
  evidenceSummary: "Brennan, Clark, & Shaver (1998) and Fraley et al. (2000) ECR-R model. Verified in Turkish population by Sümer (2006) (N=380, alpha = 0.86).",
  keySources: ["src_fraley_2000_ecrr", "src_sumer_2006_ecrr"],
  claimSources: {
    definitionSourceIds: ["src_fraley_2000_ecrr"],
    evidenceSourceIds: ["src_fraley_2000_ecrr"],
    measurementSourceIds: ["src_fraley_2000_ecrr"],
    turkishEvidenceSourceIds: ["src_sumer_2006_ecrr"],
    overlapSourceIds: ["src_fraley_2000_ecrr"],
    licensingSourceIds: ["src_fraley_2000_ecrr"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "SUBSCALE",
  knownInstrumentCandidates: [
    { instrumentName: "Experiences in Close Relationships-Revised (ECR-R Anxiety / TR Sümer, 2006)", instrumentId: "inst_ecr_r", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "LOW",
  clinicalSafetyClass: "NON_CLINICAL_ADJACENT",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["MATRIX", "BAR_GRID", "HEATMAP", "FINGERPRINT"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_freud", "lens_adler"],
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
  decisionRationale: "Essential adult attachment dimension. Verified Turkish psychometrics (Sümer, 2006) with high relational insight value."
});

add({
  candidateId: "cand_attachment_avoidance",
  canonicalNameEn: "Attachment Avoidance",
  canonicalNameTr: "Bağlanma Kaçınması (Yakınlıktan Kaçınma ve Aşırı Bağımsızlık)",
  entityType: "CONSTRUCT",
  proposedDomain: "social_relational",
  definition: "The degree to which a person feels uncomfortable with emotional closeness, intimacy, and depending on relationship partners, striving for defensive self-reliance.",
  aliases: ["ECR-R Avoidance", "Avoidant Attachment Dimension"],
  relatedConstructs: ["cand_attachment_anxiety"],
  overlapWithCurrentOntology: ["attachment_avoidance", "attachment_system"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SUBSCALE",
  evidenceQuality: "STRONG",
  evidenceSummary: "Fraley et al. (2000) ECR-R model. Verified in Turkish population by Sümer (2006) (N=380, alpha = 0.90). Orthogonal to Attachment Anxiety.",
  keySources: ["src_fraley_2000_ecrr", "src_sumer_2006_ecrr"],
  claimSources: {
    definitionSourceIds: ["src_fraley_2000_ecrr"],
    evidenceSourceIds: ["src_fraley_2000_ecrr"],
    measurementSourceIds: ["src_fraley_2000_ecrr"],
    turkishEvidenceSourceIds: ["src_sumer_2006_ecrr"],
    overlapSourceIds: ["src_fraley_2000_ecrr"],
    licensingSourceIds: ["src_fraley_2000_ecrr"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "SUBSCALE",
  knownInstrumentCandidates: [
    { instrumentName: "Experiences in Close Relationships-Revised (ECR-R Avoidance / TR Sümer, 2006)", instrumentId: "inst_ecr_r", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "LOW",
  clinicalSafetyClass: "NON_CLINICAL_ADJACENT",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["MATRIX", "BAR_GRID", "HEATMAP", "FINGERPRINT"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_freud", "lens_adler"],
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
  decisionRationale: "Essential attachment dimension completing the 2-dimensional adult attachment quadrant matrix."
});

add({
  candidateId: "cand_interpersonal_dominance_agency",
  canonicalNameEn: "Interpersonal Dominance (Agency)",
  canonicalNameTr: "Kişilerarası Baskınlık / Sosyal Liderlik",
  entityType: "CONSTRUCT",
  proposedDomain: "social_relational",
  definition: "Vertical axis of the Interpersonal Circumplex capturing social assertiveness, dominance, and willingness to take charge in group interactions.",
  aliases: ["IPC Agency", "Dominance vs Submissiveness"],
  relatedConstructs: ["cand_interpersonal_warmth_communion", "cand_assertiveness"],
  overlapWithCurrentOntology: ["social_agency_boundaries"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SUBSCALE",
  evidenceQuality: "STRONG",
  evidenceSummary: "Wiggins (1979) Interpersonal Circumplex (IPC). Replicated extensively in social psychology as the agency dimension.",
  keySources: ["src_wiggins_1979_ipc"],
  claimSources: {
    definitionSourceIds: ["src_wiggins_1979_ipc"],
    evidenceSourceIds: ["src_wiggins_1979_ipc"],
    measurementSourceIds: ["src_wiggins_1979_ipc"],
    turkishEvidenceSourceIds: [],
    overlapSourceIds: ["src_wiggins_1979_ipc"],
    licensingSourceIds: ["src_wiggins_1979_ipc"]
  },
  turkishEvidenceStatus: "NO_DIRECT",
  turkishEvidenceLevel: "NOT_ASSESSED",
  knownInstrumentCandidates: [
    { instrumentName: "IPIP Interpersonal Circumplex (Dominance Axis)", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["CIRCUMPLEX", "BAR_GRID", "HEATMAP"],
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
  decisionRationale: "Provides circumplex structural mapping of social agency in advanced social profiles."
});

add({
  candidateId: "cand_interpersonal_warmth_communion",
  canonicalNameEn: "Interpersonal Warmth (Communion)",
  canonicalNameTr: "Kişilerarası Sıcaklık / Yakınlık Eğilimi",
  entityType: "CONSTRUCT",
  proposedDomain: "social_relational",
  definition: "Horizontal axis of the Interpersonal Circumplex capturing social warmth, friendliness, compassion, and nurturing orientation versus cold detachment.",
  aliases: ["IPC Communion", "Warmth vs Coldness"],
  relatedConstructs: ["cand_interpersonal_dominance_agency", "cand_empathic_concern"],
  overlapWithCurrentOntology: ["social_agency_boundaries"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SUBSCALE",
  evidenceQuality: "STRONG",
  evidenceSummary: "Wiggins (1979) IPC model. Establishes the communion axis of social interaction.",
  keySources: ["src_wiggins_1979_ipc"],
  claimSources: {
    definitionSourceIds: ["src_wiggins_1979_ipc"],
    evidenceSourceIds: ["src_wiggins_1979_ipc"],
    measurementSourceIds: ["src_wiggins_1979_ipc"],
    turkishEvidenceSourceIds: [],
    overlapSourceIds: ["src_wiggins_1979_ipc"],
    licensingSourceIds: ["src_wiggins_1979_ipc"]
  },
  turkishEvidenceStatus: "NO_DIRECT",
  turkishEvidenceLevel: "NOT_ASSESSED",
  knownInstrumentCandidates: [
    { instrumentName: "IPIP Interpersonal Circumplex (Warmth Axis)", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["CIRCUMPLEX", "BAR_GRID", "HEATMAP"],
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
  decisionRationale: "Completes the 2D Interpersonal Circumplex model."
});

add({
  candidateId: "cand_assertiveness",
  canonicalNameEn: "Assertiveness",
  canonicalNameTr: "Kendini Ortaya Koyma / Atılganlık",
  entityType: "CONSTRUCT",
  proposedDomain: "social_relational",
  definition: "The ability to directly, honestly, and appropriately express one's opinions, feelings, needs, and boundaries without passive submission or aggressive hostility.",
  aliases: ["Rathus Assertiveness", "Constructive Assertion"],
  relatedConstructs: ["cand_social_boldness", "cand_cooperation_orientation"],
  overlapWithCurrentOntology: ["assertiveness", "social_agency_boundaries"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SCALE_TOTAL",
  evidenceQuality: "STRONG",
  evidenceSummary: "Rathus (1973) Assertiveness Schedule. Decades of behavioral research in communication skills and social competence.",
  keySources: ["src_rathus_1973_assertiveness"],
  claimSources: {
    definitionSourceIds: ["src_rathus_1973_assertiveness"],
    evidenceSourceIds: ["src_rathus_1973_assertiveness"],
    measurementSourceIds: ["src_rathus_1973_assertiveness"],
    turkishEvidenceSourceIds: [],
    overlapSourceIds: ["src_rathus_1973_assertiveness"],
    licensingSourceIds: ["src_rathus_1973_assertiveness"]
  },
  turkishEvidenceStatus: "NO_DIRECT",
  turkishEvidenceLevel: "NOT_ASSESSED",
  knownInstrumentCandidates: [
    { instrumentName: "Rathus Assertiveness Schedule (RAS / Short Form)", instrumentId: "inst_dutch", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["BAR_GRID", "HEATMAP", "FINGERPRINT"],
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
    longitudinalValue: "HIGH",
    interpretability: "HIGH"
  },
  decision: "INCLUDE_CORE",
  decisionRationale: "Core interpersonal competence trait with high practical relevance for professional and personal communication."
});

add({
  candidateId: "cand_social_connectedness",
  canonicalNameEn: "Social Connectedness",
  canonicalNameTr: "Sosyal Bağlılık ve Aidiyet Hissi",
  entityType: "CONSTRUCT",
  proposedDomain: "social_relational",
  definition: "Subjective sense of close interpersonal connection, belongingness, and emotional bonding with the broader social environment and community.",
  aliases: ["Belongingness", "Social Connectedness Scale"],
  relatedConstructs: ["cand_relatedness_need_satisfaction"],
  overlapWithCurrentOntology: ["social_agency_boundaries"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SCALE_TOTAL",
  evidenceQuality: "STRONG",
  evidenceSummary: "Lee & Robbins (1995) Social Connectedness Scale. Validated in Turkish population by Duru (2007). Strong buffer against loneliness and social alienation.",
  keySources: ["src_lee_robbins_1995_connectedness", "src_duru_2007_connectedness"],
  claimSources: {
    definitionSourceIds: ["src_lee_robbins_1995_connectedness"],
    evidenceSourceIds: ["src_lee_robbins_1995_connectedness"],
    measurementSourceIds: ["src_lee_robbins_1995_connectedness"],
    turkishEvidenceSourceIds: ["src_duru_2007_connectedness"],
    overlapSourceIds: ["src_lee_robbins_1995_connectedness"],
    licensingSourceIds: ["src_lee_robbins_1995_connectedness"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "SCALE_TOTAL",
  knownInstrumentCandidates: [
    { instrumentName: "Social Connectedness Scale (SCS / TR Duru, 2007)", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["BAR_GRID", "HEATMAP", "FINGERPRINT"],
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
    longitudinalValue: "HIGH",
    interpretability: "HIGH"
  },
  decision: "INCLUDE_CORE",
  decisionRationale: "Fundamental metric of social belonging with verified Turkish psychometric adaptation."
});

add({
  candidateId: "cand_propensity_to_trust",
  canonicalNameEn: "Propensity to Trust",
  canonicalNameTr: "Genel Güven Eğilimi",
  entityType: "CONSTRUCT",
  proposedDomain: "social_relational",
  definition: "A generalized dispositional expectation about the trustworthiness, benevolence, and honesty of others across unspecified situations.",
  aliases: ["Dispositional Trust", "Generalized Trust"],
  relatedConstructs: ["cand_hexaco_agreeableness", "cand_forgivingness"],
  overlapWithCurrentOntology: ["social_agency_boundaries"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "CONSTRUCT",
  evidenceQuality: "STRONG",
  evidenceSummary: "Mayer, Davis, & Schoorman (1995) trust model. Predicts cooperation, collaborative behavior, and positive team dynamics.",
  keySources: ["src_mayer_1995_trust"],
  claimSources: {
    definitionSourceIds: ["src_mayer_1995_trust"],
    evidenceSourceIds: ["src_mayer_1995_trust"],
    measurementSourceIds: ["src_mayer_1995_trust"],
    turkishEvidenceSourceIds: [],
    overlapSourceIds: ["src_mayer_1995_trust"],
    licensingSourceIds: ["src_mayer_1995_trust"]
  },
  turkishEvidenceStatus: "NO_DIRECT",
  turkishEvidenceLevel: "NOT_ASSESSED",
  knownInstrumentCandidates: [
    { instrumentName: "IPIP Generalized Trust Scale", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["BAR_GRID", "HEATMAP", "FINGERPRINT"],
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
  decision: "INCLUDE_CORE",
  decisionRationale: "Crucial interpersonal trait governing relational risk-taking and collaborative openness."
});

add({
  candidateId: "cand_cooperation_orientation",
  canonicalNameEn: "Cooperation Orientation (Collaborating Conflict Style)",
  canonicalNameTr: "İşbirlikçi Çözüm ve Dayanışma Eğilimi",
  entityType: "CONSTRUCT",
  proposedDomain: "social_relational",
  definition: "The propensity to manage interpersonal disputes by integrating all parties' interests and seeking mutually beneficial win-win solutions.",
  aliases: ["Collaborating Conflict Mode", "DUTCH Problem Solving"],
  relatedConstructs: ["cand_conflict_avoidance", "cand_assertiveness"],
  overlapWithCurrentOntology: ["conflict_collaborating", "conflict_styles"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SUBSCALE",
  evidenceQuality: "STRONG",
  evidenceSummary: "De Dreu et al. (2001) DUTCH conflict management model. Replicated across organizational and interpersonal conflict literature.",
  keySources: ["src_dedreu_2001_dutch"],
  claimSources: {
    definitionSourceIds: ["src_dedreu_2001_dutch"],
    evidenceSourceIds: ["src_dedreu_2001_dutch"],
    measurementSourceIds: ["src_dedreu_2001_dutch"],
    turkishEvidenceSourceIds: [],
    overlapSourceIds: ["src_dedreu_2001_dutch"],
    licensingSourceIds: ["src_dedreu_2001_dutch"]
  },
  turkishEvidenceStatus: "NO_DIRECT",
  turkishEvidenceLevel: "NOT_ASSESSED",
  knownInstrumentCandidates: [
    { instrumentName: "DUTCH Conflict Management Scale (Collaborating Subscale)", instrumentId: "inst_dutch", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["BAR_GRID", "HEATMAP", "FINGERPRINT"],
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
    longitudinalValue: "HIGH",
    interpretability: "HIGH"
  },
  decision: "INCLUDE_CORE",
  decisionRationale: "Essential conflict management style predicting positive relationship and workplace teamwork resolution."
});

add({
  candidateId: "cand_conflict_avoidance",
  canonicalNameEn: "Conflict Avoidance Style",
  canonicalNameTr: "Çatışmadan Kaçınma Tarzı",
  entityType: "CONSTRUCT",
  proposedDomain: "social_relational",
  definition: "The propensity to withdraw from, sidestep, or postpone overt disagreements and confrontations in interpersonal interactions.",
  aliases: ["Avoiding Conflict Mode", "DUTCH Avoiding"],
  relatedConstructs: ["cand_cooperation_orientation"],
  overlapWithCurrentOntology: ["conflict_avoiding", "conflict_styles"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SUBSCALE",
  evidenceQuality: "STRONG",
  evidenceSummary: "De Dreu et al. (2001) DUTCH model. Highlights conflict management trade-offs.",
  keySources: ["src_dedreu_2001_dutch"],
  claimSources: {
    definitionSourceIds: ["src_dedreu_2001_dutch"],
    evidenceSourceIds: ["src_dedreu_2001_dutch"],
    measurementSourceIds: ["src_dedreu_2001_dutch"],
    turkishEvidenceSourceIds: [],
    overlapSourceIds: ["src_dedreu_2001_dutch"],
    licensingSourceIds: ["src_dedreu_2001_dutch"]
  },
  turkishEvidenceStatus: "NO_DIRECT",
  turkishEvidenceLevel: "NOT_ASSESSED",
  knownInstrumentCandidates: [
    { instrumentName: "DUTCH Conflict Management Scale (Avoiding Subscale)", instrumentId: "inst_dutch", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["BAR_GRID", "HEATMAP"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_freud", "lens_adler"],
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
  decisionRationale: "Identifies conflict suppression and interpersonal withdrawal tendencies."
});

add({
  candidateId: "cand_cognitive_perspective_taking",
  canonicalNameEn: "Cognitive Perspective Taking",
  canonicalNameTr: "Bilişsel Perspektif Alma (Zihin Kuramı)",
  entityType: "CONSTRUCT",
  proposedDomain: "social_relational",
  definition: "The cognitive capacity and spontaneous tendency to adopt the psychological viewpoint and mental state of others.",
  aliases: ["Davis IRI Perspective Taking", "Cognitive Empathy"],
  relatedConstructs: ["cand_empathic_concern"],
  overlapWithCurrentOntology: ["cognitive_perspective_taking", "multidimensional_empathy"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SUBSCALE",
  evidenceQuality: "STRONG",
  evidenceSummary: "Davis (1983) Interpersonal Reactivity Index. Validated in Turkish samples by Yıldırım & Baloğlu (2013). Clearly separated from emotional empathy.",
  keySources: ["src_davis_1983_iri", "src_yildirim_2013_iri"],
  claimSources: {
    definitionSourceIds: ["src_davis_1983_iri"],
    evidenceSourceIds: ["src_davis_1983_iri"],
    measurementSourceIds: ["src_davis_1983_iri"],
    turkishEvidenceSourceIds: ["src_yildirim_2013_iri"],
    overlapSourceIds: ["src_davis_1983_iri"],
    licensingSourceIds: ["src_davis_1983_iri"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "SUBSCALE",
  knownInstrumentCandidates: [
    { instrumentName: "Interpersonal Reactivity Index (Perspective Taking / TR Yıldırım & Baloğlu)", instrumentId: "inst_iri", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["BAR_GRID", "HEATMAP", "FINGERPRINT", "DASHBOARD"],
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
  decision: "INCLUDE_CORE",
  decisionRationale: "Essential cognitive empathy faculty with validated Turkish psychometrics."
});

add({
  candidateId: "cand_empathic_concern",
  canonicalNameEn: "Empathic Concern (Affective Empathy)",
  canonicalNameTr: "Empatik Şefkat ve Duygusal İlgi",
  entityType: "CONSTRUCT",
  proposedDomain: "social_relational",
  definition: "The affective tendency to experience feelings of warmth, compassion, and concern for unfortunate or distressed individuals.",
  aliases: ["Davis IRI Empathic Concern", "Compassionate Empathy"],
  relatedConstructs: ["cand_cognitive_perspective_taking", "cand_hexaco_emotionality"],
  overlapWithCurrentOntology: ["empathic_concern", "multidimensional_empathy"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SUBSCALE",
  evidenceQuality: "STRONG",
  evidenceSummary: "Davis (1983) IRI model. Validated in Turkish by Yıldırım & Baloğlu (2013). Measures other-oriented compassionate affect distinct from self-oriented personal distress.",
  keySources: ["src_davis_1983_iri", "src_yildirim_2013_iri"],
  claimSources: {
    definitionSourceIds: ["src_davis_1983_iri"],
    evidenceSourceIds: ["src_davis_1983_iri"],
    measurementSourceIds: ["src_davis_1983_iri"],
    turkishEvidenceSourceIds: ["src_yildirim_2013_iri"],
    overlapSourceIds: ["src_davis_1983_iri"],
    licensingSourceIds: ["src_davis_1983_iri"]
  },
  turkishEvidenceStatus: "DIRECT",
  turkishEvidenceLevel: "SUBSCALE",
  knownInstrumentCandidates: [
    { instrumentName: "Interpersonal Reactivity Index (Empathic Concern / TR Yıldırım & Baloğlu)", instrumentId: "inst_iri", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "NONE",
  clinicalSafetyClass: "NON_CLINICAL",
  consumerSuitability: "HIGH",
  longitudinalSuitability: "STATIC_TRAIT",
  visualizationSuitability: ["BAR_GRID", "HEATMAP", "FINGERPRINT", "DASHBOARD"],
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
  decision: "INCLUDE_CORE",
  decisionRationale: "Essential affective empathy faculty with validated Turkish psychometrics."
});

add({
  candidateId: "cand_rejection_sensitivity_nonclinical",
  canonicalNameEn: "Rejection Sensitivity (Non-Clinical)",
  canonicalNameTr: "Sosyal Reddedilme Hassasiyeti",
  entityType: "CONSTRUCT",
  proposedDomain: "social_relational",
  definition: "Tendency to anxiously expect, readily perceive, and intensely react to perceived social rejection in interpersonal scenarios.",
  aliases: ["Downey RSQ", "Rejection Expectancy"],
  relatedConstructs: ["cand_attachment_anxiety"],
  overlapWithCurrentOntology: ["social_agency_boundaries"],
  directOrDerived: "DIRECT",
  measurementMode: "DIRECT_PSYCHOMETRIC",
  measurementLevel: "SCALE_TOTAL",
  evidenceQuality: "MODERATE",
  evidenceSummary: "Downey & Feldman (1996) RSQ scale. Moderate overlap with attachment anxiety; requires non-clinical framing to avoid diagnostic borderline conflation.",
  keySources: ["src_downey_1996_rsq"],
  claimSources: {
    definitionSourceIds: ["src_downey_1996_rsq"],
    evidenceSourceIds: ["src_downey_1996_rsq"],
    measurementSourceIds: ["src_downey_1996_rsq"],
    turkishEvidenceSourceIds: [],
    overlapSourceIds: ["src_downey_1996_rsq"],
    licensingSourceIds: ["src_downey_1996_rsq"]
  },
  turkishEvidenceStatus: "NO_DIRECT",
  turkishEvidenceLevel: "NOT_ASSESSED",
  knownInstrumentCandidates: [
    { instrumentName: "Rejection Sensitivity Questionnaire (RSQ Short Form)", isPublicDomainOrOpen: true, licenseStatus: "APPROVED_PUBLIC" }
  ],
  licensingStatus: "APPROVED_PUBLIC",
  clinicalRisk: "LOW",
  clinicalSafetyClass: "NON_CLINICAL_ADJACENT",
  consumerSuitability: "MODERATE",
  longitudinalSuitability: "HIGH_LONGITUDINAL_VALUE",
  visualizationSuitability: ["BAR_GRID", "HEATMAP"],
  aiInterpretationEligibility: "DIRECT_PSYCHOMETRIC_INPUT",
  historicalTheoryEligibility: ["lens_adler", "lens_freud"],
  decisionRubric: {
    scientificDistinctiveness: "MODERATE",
    incrementalValue: "MODERATE",
    measurementMaturity: "MODERATE",
    consumerRelevance: "HIGH",
    safety: "GOVERNED_ADJACENT",
    turkishEvidence: "NO_DIRECT",
    licensingFeasibility: "OPEN_ACCESSIBLE",
    assessmentBurden: "LOW",
    longitudinalValue: "HIGH",
    interpretability: "MODERATE"
  },
  decision: "INCLUDE_ADVANCED",
  decisionRationale: "Provides situational insight into relational vulnerability for advanced relational deep-dives."
});

console.log(`Writing expanded candidate pool with Interpersonal constructs (${currentPool.length} total)...`);
fs.writeFileSync(candidatesFile, JSON.stringify(currentPool, null, 2), 'utf8');
