import fs from 'fs';
import path from 'path';

const rootDir = path.resolve(__dirname, '..');
const masterModelDir = path.resolve(rootDir, 'data/master-model');

// =============================================================================
// 1. DIRECTIONAL OVERLAP ANALYSIS MATRIX
// =============================================================================
export interface OverlapPair {
  pairId: string;
  constructA: string;
  constructB: string;
  overlapType: 'DISTINCT' | 'PARTIALLY_OVERLAPPING' | 'HIGHLY_REDUNDANT' | 'HIERARCHICAL_RELATION' | 'DERIVED_RELATION' | 'UNCERTAIN';
  relationDirection: 'A_SUBSUMES_B' | 'B_SUBSUMES_A' | 'SHARED_VARIANCE_WITH_DISTINCT_INCREMENT' | 'HIERARCHICAL_PARENT_CHILD' | 'THEORETICALLY_RELATED' | 'EMPIRICALLY_REDUNDANT' | 'UNCLEAR';
  conceptualOverlap: string;
  empiricalOverlap: string;
  resolutionDecision: 'MAINTAIN_BOTH_DISTINCT' | 'MERGE_INTO_A' | 'MERGE_INTO_B' | 'NEST_AS_FACET' | 'DERIVED_COMPUTATION' | 'DEFER_SECONDARY';
  sourceIds: string[];
  rationale: string;
}

export const OVERLAP_ANALYSIS: OverlapPair[] = [
  {
    pairId: "overlap_grit_vs_conscientiousness",
    constructA: "cand_long_term_grit",
    constructB: "cand_hexaco_conscientiousness",
    overlapType: "PARTIALLY_OVERLAPPING",
    relationDirection: "B_SUBSUMES_A",
    conceptualOverlap: "Both constructs evaluate dedication to effort, task persistence, and discipline over time.",
    empiricalOverlap: "Meta-analyses (Credé et al., 2017) demonstrate that Grit correlates at rho = .84 with Conscientiousness (specifically Industriousness/Diligence). However, the Perseverance of Effort facet displays modest incremental validity for long-term goal completion beyond standard conscientiousness scales.",
    resolutionDecision: "MAINTAIN_BOTH_DISTINCT",
    sourceIds: ["src_duckworth_2007_grit", "src_crede_2017_grit_meta", "src_ashton_lee_2007"],
    rationale: "Conscientiousness remains the broad foundational trait battery (P0). Grit is maintained as an advanced enrichment construct (P1) specifically capturing multi-year goal passion and sustained stamina without conflating them into a single score."
  },
  {
    pairId: "overlap_self_esteem_vs_self_worth",
    constructA: "cand_core_self_esteem",
    constructB: "cand_contingent_self_worth",
    overlapType: "PARTIALLY_OVERLAPPING",
    relationDirection: "SHARED_VARIANCE_WITH_DISTINCT_INCREMENT",
    conceptualOverlap: "Global self-esteem evaluates the general affective level of self-worth; contingent self-worth assesses the situational vulnerability and stake domains upon which that self-worth depends.",
    empiricalOverlap: "Crocker & Wolfe (2001) demonstrate that individuals with identical high self-esteem can differ dramatically in self-esteem stability and defensive reactions depending on their contingencies (r ~ -.20 to -.40 with instability).",
    resolutionDecision: "MAINTAIN_BOTH_DISTINCT",
    sourceIds: ["src_rosenberg_1965", "src_crocker_2001_csw"],
    rationale: "Both are maintained distinctly. Global Self-Esteem measures baseline trait level; Contingent Self-Worth provides structural qualitative insight into self-esteem fragility."
  },
  {
    pairId: "overlap_self_efficacy_vs_competence_need",
    constructA: "cand_generalized_self_efficacy",
    constructB: "cand_competence_need_satisfaction",
    overlapType: "PARTIALLY_OVERLAPPING",
    relationDirection: "SHARED_VARIANCE_WITH_DISTINCT_INCREMENT",
    conceptualOverlap: "Self-efficacy reflects optimistic prospective beliefs about capability to handle future obstacles; Competence Need Satisfaction reflects the experienced psychological feeling of mastery and fulfillment in current life activities.",
    empiricalOverlap: "Bandura (1997) vs Deci & Ryan (2000). While positively correlated (r ~ .50-.60), self-efficacy is a cognitive expectation whereas competence need satisfaction is an experiential affective-motivational state.",
    resolutionDecision: "MAINTAIN_BOTH_DISTINCT",
    sourceIds: ["src_bandura_1997", "src_deci_ryan_2000_sdt", "src_chen_2015_bpnsfs"],
    rationale: "Maintained in separate domains (Self-System vs Motivation & Needs). They provide complementary cognitive vs experiential perspectives."
  },
  {
    pairId: "overlap_nfc_vs_rational_thinking",
    constructA: "cand_need_for_cognition",
    constructB: "cand_rational_analytical_thinking",
    overlapType: "PARTIALLY_OVERLAPPING",
    relationDirection: "SHARED_VARIANCE_WITH_DISTINCT_INCREMENT",
    conceptualOverlap: "Need for Cognition evaluates intrinsic motivation and pleasure in thinking; Rational Thinking Style evaluates perceived ability and behavioral reliance on analytical logic.",
    empiricalOverlap: "Epstein et al. (1996) and Cacioppo & Petty (1982). Correlate at r ~ .60-.70, but REI separates rational ability/engagement from experiential intuitive processing, whereas NFC is unidimensional epistemic drive.",
    resolutionDecision: "MAINTAIN_BOTH_DISTINCT",
    sourceIds: ["src_cacioppo_petty_1982_nfc", "src_epstein_1996_rei"],
    rationale: "NFC captures epistemic motivation; REI Rational captures dual-process computational style."
  },
  {
    pairId: "overlap_uncertainty_vs_ambiguity_tolerance",
    constructA: "cand_intolerance_of_uncertainty",
    constructB: "cand_ambiguity_tolerance",
    overlapType: "PARTIALLY_OVERLAPPING",
    relationDirection: "SHARED_VARIANCE_WITH_DISTINCT_INCREMENT",
    conceptualOverlap: "Uncertainty tolerance addresses discomfort with probabilistic unknown future outcomes; Ambiguity tolerance addresses discomfort with vague, complex, or contradictory current information.",
    empiricalOverlap: "Buhr & Dugas (2002) and Budner (1962). Correlate at r ~ .45-.55, demonstrating shared variance around cognitive control but distinct cognitive triggers.",
    resolutionDecision: "MAINTAIN_BOTH_DISTINCT",
    sourceIds: ["src_buhr_dugas_2002_ius", "src_sari_dag_2009_ius"],
    rationale: "Intolerance of Uncertainty is prioritized for core battery (P0); Ambiguity Tolerance is maintained for advanced cognitive decision profiling (P1)."
  },
  {
    pairId: "overlap_self_control_vs_uppsp_impulsivity",
    constructA: "cand_general_self_control",
    constructB: "cand_uppsp_negative_urgency",
    overlapType: "PARTIALLY_OVERLAPPING",
    relationDirection: "B_SUBSUMES_A",
    conceptualOverlap: "Self-control is broad inhibitory capacity; Negative Urgency is emotion-driven rash action under acute negative distress.",
    empiricalOverlap: "Whiteside & Lynam (2001) and Tangney et al. (2004). BSCS correlates with UPPS-P Lack of Premeditation and Negative Urgency (r ~ -.50 to -.65), but fails to isolate positive urgency or sensation seeking.",
    resolutionDecision: "MAINTAIN_BOTH_DISTINCT",
    sourceIds: ["src_tangney_2004_bscs", "src_whiteside_lynam_2001_upps", "src_yilmaz_2017_uppsp"],
    rationale: "BSCS provides a fast unweighted composite for general self-regulation; UPPS-P subscales provide the essential multidimensional diagnostic clarity."
  },
  {
    pairId: "overlap_cognitive_perspective_taking_vs_empathic_concern",
    constructA: "cand_cognitive_perspective_taking",
    constructB: "cand_empathic_concern",
    overlapType: "DISTINCT",
    relationDirection: "SHARED_VARIANCE_WITH_DISTINCT_INCREMENT",
    conceptualOverlap: "Perspective taking is the cognitive understanding of others' mental states; Empathic concern is the emotional feeling of compassion and warmth for distressed others.",
    empiricalOverlap: "Davis (1983) IRI factor analysis confirms that Cognitive Perspective Taking and Empathic Concern load onto distinct, orthogonal factors (r ~ .30-.40) and have divergent neural substrates.",
    resolutionDecision: "MAINTAIN_BOTH_DISTINCT",
    sourceIds: ["src_davis_1983_iri", "src_yildirim_2013_iri"],
    rationale: "Must NEVER be collapsed into a single empathy score. Separately scored under Multidimensional Empathy."
  },
  {
    pairId: "overlap_attachment_anxiety_vs_rejection_sensitivity",
    constructA: "cand_attachment_anxiety",
    constructB: "cand_rejection_sensitivity_nonclinical",
    overlapType: "PARTIALLY_OVERLAPPING",
    relationDirection: "A_SUBSUMES_B",
    conceptualOverlap: "Both involve intense hypervigilance regarding social abandonment and fear of rejection by significant others.",
    empiricalOverlap: "Downey & Feldman (1996) and Fraley et al. (2000). Correlate at r ~ .60-.70. Attachment anxiety captures systemic working models of self-worth in relationships, while rejection sensitivity captures situational anxious expectation.",
    resolutionDecision: "MAINTAIN_BOTH_DISTINCT",
    sourceIds: ["src_fraley_2000_ecrr", "src_downey_1996_rsq", "src_sumer_2006_ecrr"],
    rationale: "Attachment Anxiety is core (P0); Rejection Sensitivity is optional advanced situational enrichment (P1)."
  },
  {
    pairId: "overlap_schwartz_values_vs_hexaco_traits",
    constructA: "cand_schwartz_self_transcendence",
    constructB: "cand_hexaco_honesty_humility",
    overlapType: "PARTIALLY_OVERLAPPING",
    relationDirection: "THEORETICALLY_RELATED",
    conceptualOverlap: "Both prioritize prosocial ethics, fairness, and care for others over selfish greed.",
    empiricalOverlap: "Roccas et al. (2002) and Ashton & Lee (2007). Personality traits describe behavioral patterns (what people DO), whereas Schwartz values describe cognitive goals and motivational ideals (what people VALUE). Correlations typically range r ~ .35-.50.",
    resolutionDecision: "MAINTAIN_BOTH_DISTINCT",
    sourceIds: ["src_ashton_lee_2007", "src_schwartz_2012_values"],
    rationale: "Maintained in separate domains (Core Personality vs Motivation & Values) preserving the essential scientific trait vs value taxonomy."
  },
  {
    pairId: "overlap_machiavellianism_vs_honesty_humility",
    constructA: "cand_machiavellianism_subclinical",
    constructB: "cand_hexaco_honesty_humility",
    overlapType: "PARTIALLY_OVERLAPPING",
    relationDirection: "B_SUBSUMES_A",
    conceptualOverlap: "Machiavellianism represents cynical manipulation and strategic deceit; low Honesty-Humility represents manipulative entitlement and greed.",
    empiricalOverlap: "Ashton & Lee (2007) and Paulhus et al. (2020). Machiavellianism correlates at r ~ -.60 to -.70 with Honesty-Humility. Factor analyses demonstrate that the Dark Triad/Tetrad is primarily located in the negative pole of HEXACO Factor H.",
    resolutionDecision: "MAINTAIN_BOTH_DISTINCT",
    sourceIds: ["src_ashton_lee_2007", "src_paulhus_2020_sd4"],
    rationale: "Honesty-Humility is the normative continuous trait (P0). Subclinical Machiavellianism is maintained as an optional subclinical dark construct (P2) for specialized research modules."
  },
  {
    pairId: "overlap_actual_ideal_gap_vs_self_esteem",
    constructA: "cand_actual_ideal_discrepancy",
    constructB: "cand_core_self_esteem",
    overlapType: "PARTIALLY_OVERLAPPING",
    relationDirection: "DERIVED_RELATION",
    conceptualOverlap: "Both reflect the positive vs negative evaluation of one's current state relative to internal standards.",
    empiricalOverlap: "Higgins (1987). Actual-ideal discrepancy correlates with low self-esteem (r ~ -.55 to -.70), but discrepancy models provide qualitative diagnostic specificity regarding dejection vs agitation.",
    resolutionDecision: "DERIVED_COMPUTATION",
    sourceIds: ["src_higgins_1987_discrepancy", "src_rosenberg_1965"],
    rationale: "Actual-Ideal Gap is derived deterministically from multi-item actual vs ideal ratings rather than measured as a static self-report trait."
  }
];

fs.writeFileSync(
  path.resolve(masterModelDir, 'overlap-analysis.json'),
  JSON.stringify(OVERLAP_ANALYSIS, null, 2),
  'utf8'
);
console.log(`✅ Generated overlap-analysis.json: ${OVERLAP_ANALYSIS.length} directional overlap pairs.`);

// =============================================================================
// 2. ONE-WAY THEORETICAL LENS MAP
// =============================================================================
export interface TheoreticalLensMapping {
  lensId: string;
  historicalFigure: string;
  theoreticalFrameworkName: string;
  historicalPeriod: string;
  epistemicStatus: 'HISTORICAL_FRAMEWORK' | 'THEORETICAL_INTERPRETATION';
  mappedModernConstructs: string[];
  interpretivePrinciple: string;
  prohibitedClaims: string[];
  references: string[];
}

export const THEORETICAL_LENS_MAP: TheoreticalLensMapping[] = [
  {
    lensId: "lens_freud",
    historicalFigure: "Sigmund Freud",
    theoreticalFrameworkName: "Classical Psychoanalysis & Drive Dynamics",
    historicalPeriod: "Late 19th - Early 20th Century (1890-1939)",
    epistemicStatus: "THEORETICAL_INTERPRETATION",
    mappedModernConstructs: [
      "cand_expressive_suppression",
      "cand_cognitive_reappraisal",
      "cand_distress_tolerance",
      "cand_general_self_control",
      "cand_uppsp_negative_urgency",
      "cand_actual_ought_discrepancy"
    ],
    interpretivePrinciple: "Frame self-regulation challenges and expressive suppression as internal compromises between instinctual urges (Id) and internalized social standards (Superego).",
    prohibitedClaims: [
      "Never compute a numerical 'Freud score' or psychoanalytic percentile.",
      "Never assert unconscious childhood trauma or repressed memories as verified facts from questionnaire responses.",
      "Never render psychiatric diagnostic classifications (e.g. neurosis, hysteria)."
    ],
    references: ["src_freud_1923_ego_id"]
  },
  {
    lensId: "lens_jung",
    historicalFigure: "Carl Gustav Jung",
    theoreticalFrameworkName: "Analytical Psychology & Psychological Types",
    historicalPeriod: "Early - Mid 20th Century (1913-1961)",
    epistemicStatus: "HISTORICAL_FRAMEWORK",
    mappedModernConstructs: [
      "cand_hexaco_extraversion",
      "cand_hexaco_openness",
      "cand_rational_analytical_thinking",
      "cand_intuitive_experiential_thinking",
      "cand_inquisitiveness",
      "cand_creativity"
    ],
    interpretivePrinciple: "Interpret extraversion/introversion as continuous energetic orientations and rational vs experiential thinking as complementary faculties working toward individuation.",
    prohibitedClaims: [
      "Never convert continuous scores into rigid 4-letter categorical MBTI boxes.",
      "Never claim collective unconscious archetypes as empirical facts.",
      "Never state relational compatibility percentages based on psychological types."
    ],
    references: ["src_jung_1921_types"]
  },
  {
    lensId: "lens_adler",
    historicalFigure: "Alfred Adler",
    theoreticalFrameworkName: "Individual Psychology & Social Interest",
    historicalPeriod: "Early 20th Century (1911-1937)",
    epistemicStatus: "THEORETICAL_INTERPRETATION",
    mappedModernConstructs: [
      "cand_hexaco_honesty_humility",
      "cand_generalized_self_efficacy",
      "cand_social_self_esteem",
      "cand_need_for_achievement",
      "cand_need_for_power",
      "cand_empathic_concern",
      "cand_cooperation_orientation",
      "cand_social_connectedness"
    ],
    interpretivePrinciple: "Examine achievement, mastery, and power striving alongside social interest (Gemeinschaftsgefühl) and constructive alignment with community tasks.",
    prohibitedClaims: [
      "Never diagnose an 'inferiority complex' as a psychiatric condition.",
      "Never assume childhood birth order determinism without empirical data."
    ],
    references: ["src_adler_1927_individual"]
  },
  {
    lensId: "lens_rogers",
    historicalFigure: "Carl Rogers",
    theoreticalFrameworkName: "Person-Centered & Humanistic Self-Actualization",
    historicalPeriod: "Mid 20th Century (1940-1987)",
    epistemicStatus: "THEORETICAL_INTERPRETATION",
    mappedModernConstructs: [
      "cand_core_self_esteem",
      "cand_authenticity",
      "cand_self_compassion",
      "cand_contingent_self_worth",
      "cand_actual_ideal_discrepancy",
      "cand_actual_ought_discrepancy",
      "cand_hexaco_openness"
    ],
    interpretivePrinciple: "Ground humanistic reflection in the mathematically derived Actual-Ideal self discrepancies and evaluate how contingent conditions of worth constrain unconditional positive self-regard.",
    prohibitedClaims: [
      "Never label a user as 'incongruent' in a diagnostic or pejorative manner.",
      "Never guarantee therapeutic transformation through self-assessment testing alone."
    ],
    references: ["src_rogers_1961_person", "src_higgins_1987_discrepancy"]
  },
  {
    lensId: "lens_maslow",
    historicalFigure: "Abraham Maslow",
    theoreticalFrameworkName: "Holistic Dynamic Need Hierarchy",
    historicalPeriod: "Mid 20th Century (1943-1970)",
    epistemicStatus: "THEORETICAL_INTERPRETATION",
    mappedModernConstructs: [
      "cand_autonomy_need_satisfaction",
      "cand_competence_need_satisfaction",
      "cand_relatedness_need_satisfaction",
      "cand_schwartz_self_transcendence",
      "cand_schwartz_conservation",
      "cand_presence_of_meaning"
    ],
    interpretivePrinciple: "Interpret human motives as overlapping, dynamic tensions between security/conservation needs and growth/actualization strivings, acknowledging that rigid step pyramids are not empirical laws.",
    prohibitedClaims: [
      "Never claim a user is 'locked at Level 3' or 'not ready for Level 4'.",
      "Never represent the step pyramid as an invariant empirical psychometric law."
    ],
    references: ["src_maslow_1943_motivation"]
  },
  {
    lensId: "lens_skinner",
    historicalFigure: "B.F. Skinner",
    theoreticalFrameworkName: "Radical Behaviorism & Contingency Management",
    historicalPeriod: "Mid - Late 20th Century (1938-1990)",
    epistemicStatus: "THEORETICAL_INTERPRETATION",
    mappedModernConstructs: [
      "cand_general_self_control",
      "cand_uppsp_negative_urgency",
      "cand_delay_discounting_preference",
      "cand_procrastination_tendency",
      "cand_habitual_behavior_strength",
      "cand_behavioral_inhibition",
      "cand_behavioral_activation"
    ],
    interpretivePrinciple: "Interpret self-regulation and impulse control difficulties in terms of immediate vs delayed reinforcement contingencies and actionable environmental stimulus cues.",
    prohibitedClaims: [
      "Never reduce human agency to pure mechanical determinism without user consent.",
      "Never assume specific unmeasured operant histories without direct situational observation."
    ],
    references: ["src_skinner_1953_science"]
  },
  {
    lensId: "lens_james",
    historicalFigure: "William James",
    theoreticalFrameworkName: "Functionalism & Multi-Layered Self",
    historicalPeriod: "Late 19th Century (1890-1910)",
    epistemicStatus: "HISTORICAL_FRAMEWORK",
    mappedModernConstructs: [
      "cand_need_for_cognition",
      "cand_cognitive_flexibility",
      "cand_affect_intensity",
      "cand_distress_tolerance",
      "cand_authenticity",
      "cand_social_self_esteem"
    ],
    interpretivePrinciple: "Ask functional evolutionary questions: 'What adaptive purpose does this trait or behavioral habit serve in the individual's ecological life context?'",
    prohibitedClaims: [
      "Never treat 19th century physiological hypotheses as contemporary neuroscience facts."
    ],
    references: ["src_james_1890_principles"]
  },
  {
    lensId: "lens_gestalt",
    historicalFigure: "Gestalt Psychology Founders",
    theoreticalFrameworkName: "Holistic Field Theory & Emergence",
    historicalPeriod: "Early - Mid 20th Century (1912-1950s)",
    epistemicStatus: "THEORETICAL_INTERPRETATION",
    mappedModernConstructs: [
      "cand_self_concept_clarity",
      "cand_cognitive_flexibility",
      "cand_intolerance_of_uncertainty",
      "cand_ambiguity_tolerance"
    ],
    interpretivePrinciple: "Examine how individual personality facets synthesize into an emergent, holistic profile Gestalt, and evaluate intolerance of uncertainty as a struggle for cognitive figure-ground closure.",
    prohibitedClaims: [
      "Never confuse perceptual laboratory Gestalt laws with clinical psychotherapy diagnoses.",
      "Never assert mystical or unverifiable field energy claims."
    ],
    references: ["src_wertheimer_1923_gestalt"]
  }
];

fs.writeFileSync(
  path.resolve(masterModelDir, 'theoretical-lens-map.json'),
  JSON.stringify(THEORETICAL_LENS_MAP, null, 2),
  'utf8'
);
console.log(`✅ Generated theoretical-lens-map.json: ${THEORETICAL_LENS_MAP.length} one-way historical lenses.`);
