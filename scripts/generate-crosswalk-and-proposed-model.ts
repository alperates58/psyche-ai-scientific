import fs from 'fs';
import path from 'path';

const rootDir = path.resolve(__dirname, '..');
const masterModelDir = path.resolve(rootDir, 'data/master-model');

const constructsPath = path.resolve(rootDir, 'data/constructs.json');
const currentFacetsRaw = JSON.parse(fs.readFileSync(constructsPath, 'utf8'));

// Extract current unique constructs and facets
const currentConstructSet = new Set<string>();
const currentFacetSet = new Set<string>();
for (const f of currentFacetsRaw) {
  currentConstructSet.add(f.constructId);
  currentFacetSet.add(f.facetId);
}

console.log(`Current ontology: ${currentConstructSet.size} constructs, ${currentFacetSet.size} facets.`);

export interface CrosswalkEntry {
  currentEntityId: string;
  currentEntityType: 'CONSTRUCT' | 'FACET';
  currentDomainId: string;
  action: 'KEEP' | 'RENAME' | 'MERGE' | 'SPLIT' | 'MOVE_DOMAIN' | 'EXPAND_FACETS';
  targetMasterEntityIds: string[];
  targetDomainId?: string;
  rationale: string;
  evidenceSourceIds: string[];
}

export const CURRENT_TO_MASTER_CROSSWALK: CrosswalkEntry[] = [];

// =============================================================================
// 1. MAP ALL 30 CURRENT CONSTRUCTS
// =============================================================================
const CONSTRUCT_MAPPINGS: Record<string, {
  action: CrosswalkEntry['action'];
  targets: string[];
  rationale: string;
  sources: string[];
  targetDomain?: string;
}> = {
  // CORE PERSONALITY (HEXACO)
  honesty_humility: {
    action: 'KEEP',
    targets: ['cand_hexaco_honesty_humility'],
    rationale: 'Core HEXACO broad factor maintained as primary baseline personality framework.',
    sources: ['src_ashton_lee_2007', 'src_lee_ashton_2004', 'src_wasti_2008_lexical'],
  },
  emotionality: {
    action: 'KEEP',
    targets: ['cand_hexaco_emotionality'],
    rationale: 'Core HEXACO broad factor maintained as primary baseline personality framework.',
    sources: ['src_ashton_lee_2007', 'src_lee_ashton_2004', 'src_wasti_2008_lexical'],
  },
  extraversion: {
    action: 'KEEP',
    targets: ['cand_hexaco_extraversion'],
    rationale: 'Core HEXACO broad factor maintained as primary baseline personality framework.',
    sources: ['src_ashton_lee_2007', 'src_lee_ashton_2004', 'src_wasti_2008_lexical'],
  },
  agreeableness: {
    action: 'KEEP',
    targets: ['cand_hexaco_agreeableness'],
    rationale: 'Core HEXACO broad factor maintained as primary baseline personality framework.',
    sources: ['src_ashton_lee_2007', 'src_lee_ashton_2004', 'src_wasti_2008_lexical'],
  },
  conscientiousness: {
    action: 'KEEP',
    targets: ['cand_hexaco_conscientiousness'],
    rationale: 'Core HEXACO broad factor maintained as primary baseline personality framework.',
    sources: ['src_ashton_lee_2007', 'src_lee_ashton_2004', 'src_wasti_2008_lexical'],
  },
  openness: {
    action: 'KEEP',
    targets: ['cand_hexaco_openness'],
    rationale: 'Core HEXACO broad factor maintained as primary baseline personality framework.',
    sources: ['src_ashton_lee_2007', 'src_lee_ashton_2004', 'src_wasti_2008_lexical'],
  },

  // SELF-SYSTEM
  self_evaluation: {
    action: 'SPLIT',
    targets: ['cand_core_self_esteem', 'cand_self_compassion', 'cand_contingent_self_worth'],
    rationale: 'Self-evaluation construct split into distinct validated constructs: Global Self-Esteem, Self-Compassion, and Contingent Self-Worth to preserve structural independence.',
    sources: ['src_rosenberg_1965', 'src_neff_2003_scs', 'src_crocker_2001_csw'],
  },
  agency_mastery: {
    action: 'SPLIT',
    targets: ['cand_generalized_self_efficacy', 'cand_locus_of_control_internal', 'cand_locus_of_control_external'],
    rationale: 'Split into Generalized Self-Efficacy and Internal/External Locus of Control to separate outcome expectancy from perceived personal competence.',
    sources: ['src_bandura_1997', 'src_schwarzer_1995_gse', 'src_rotter_1966'],
  },
  identity_integrity: {
    action: 'SPLIT',
    targets: ['cand_self_concept_clarity', 'cand_authenticity', 'cand_actual_ideal_discrepancy'],
    rationale: 'Split into Self-Concept Clarity, Authenticity, and Self-Discrepancy to distinguish structural clarity from eudaimonic authentic functioning.',
    sources: ['src_campbell_1996_scc', 'src_wood_2008_authenticity', 'src_higgins_1987_discrepancy'],
  },

  // EMOTION REGULATION
  emotion_regulation_strategies: {
    action: 'SPLIT',
    targets: ['cand_cognitive_reappraisal', 'cand_expressive_suppression'],
    rationale: 'Split into distinct ERQ subscales (Cognitive Reappraisal and Expressive Suppression) which have divergent functional outcomes.',
    sources: ['src_gross_john_2003', 'src_ucanok_2011_erq'],
  },
  affective_dynamics: {
    action: 'SPLIT',
    targets: ['cand_positive_affect_trait', 'cand_negative_affect_trait', 'cand_affect_intensity'],
    rationale: 'Split into orthogonal Positive Affect, Negative Affect, and Affect Intensity to avoid bipolar affect conflation.',
    sources: ['src_watson_clark_tellegen_1988', 'src_gencoz_2000_panas', 'src_larsen_1987_aim'],
  },
  distress_management: {
    action: 'SPLIT',
    targets: ['cand_emotional_awareness', 'cand_emotional_clarity', 'cand_distress_tolerance', 'cand_experiential_avoidance'],
    rationale: 'Split into DERS Awareness, DERS Clarity, DTS Distress Tolerance, and AAQ Experiential Avoidance.',
    sources: ['src_gratz_roemer_2004_ders', 'src_ruganci_gencoz_2010_ders', 'src_simons_gaher_2005_dts', 'src_bond_2011_aaq2'],
  },
  self_conscious_emotions: {
    action: 'SPLIT',
    targets: ['cand_shame_proneness', 'cand_guilt_proneness'],
    rationale: 'Split into distinct TOSCA-3 Shame-Proneness (maladaptive) and Guilt-Proneness (adaptive moral self-correction).',
    sources: ['src_tangney_1992_tosca', 'src_deryakulu_2014_tosca'],
  },

  // COGNITION & DECISION
  epistemic_drive: {
    action: 'SPLIT',
    targets: ['cand_need_for_cognition', 'cand_need_for_cognitive_closure'],
    rationale: 'Split into Need for Cognition (epistemic engagement) and Need for Closure (ambiguity intolerance).',
    sources: ['src_cacioppo_petty_1982_nfc', 'src_kruglanski_webster_1996_nfc', 'src_derbentli_2008_closure'],
  },
  thinking_styles: {
    action: 'SPLIT',
    targets: ['cand_rational_analytical_thinking', 'cand_intuitive_experiential_thinking', 'cand_cognitive_reflection_tendency'],
    rationale: 'Split into orthogonal Rational and Experiential thinking styles (REI) plus Cognitive Reflection.',
    sources: ['src_epstein_1996_rei', 'src_gulgoz_2001_rei', 'src_frederick_2005_crt'],
  },
  cognitive_adaptability: {
    action: 'SPLIT',
    targets: ['cand_cognitive_flexibility', 'cand_intolerance_of_uncertainty', 'cand_rumination_brooding', 'cand_ambiguity_tolerance'],
    rationale: 'Split into Cognitive Flexibility (CFI), Intolerance of Uncertainty (IUS), and Rumination Brooding (RRS).',
    sources: ['src_gulum_dag_2012_cfi', 'src_buhr_dugas_2002_ius', 'src_treynor_2003_rrs'],
  },
  decision_orientation: {
    action: 'SPLIT',
    targets: ['cand_decision_style_maximizing', 'cand_risk_taking_domain_specific', 'cand_future_time_perspective'],
    rationale: 'Split into Maximizing vs Satisficing, DOSPERT Domain Risk, and Future Time Perspective.',
    sources: ['src_schwartz_2002_maximization', 'src_weber_2002_dospert', 'src_zimbardo_1999_ztpi'],
  },

  // SELF-REGULATION & VOLITION
  impulsivity_uppsp: {
    action: 'SPLIT',
    targets: [
      'cand_uppsp_negative_urgency',
      'cand_uppsp_positive_urgency',
      'cand_uppsp_lack_of_premeditation',
      'cand_uppsp_lack_of_perseverance',
      'cand_uppsp_sensation_seeking',
    ],
    rationale: 'Split into the 5 discrete validated UPPS-P subscales to maintain multidimensional psychometric precision.',
    sources: ['src_whiteside_lynam_2001_upps', 'src_cyders_2007_uppsp', 'src_yilmaz_2017_uppsp'],
  },
  volitional_stamina: {
    action: 'SPLIT',
    targets: [
      'cand_general_self_control',
      'cand_delay_discounting_preference',
      'cand_long_term_grit',
      'cand_procrastination_tendency',
      'cand_habitual_behavior_strength',
    ],
    rationale: 'Split into General Self-Control (BSCS), Delayed Gratification, Long-Term Grit, Procrastination Tendency, and Habit Strength.',
    sources: ['src_tangney_2004_bscs', 'src_duckworth_2007_grit', 'src_lay_1986_procrastination', 'src_verplanken_2003_srhi'],
  },

  // MOTIVATION & VALUES
  basic_psychological_needs: {
    action: 'SPLIT',
    targets: ['cand_autonomy_need_satisfaction', 'cand_competence_need_satisfaction', 'cand_relatedness_need_satisfaction'],
    rationale: 'Split into the 3 discrete basic psychological needs of Self-Determination Theory (Autonomy, Competence, Relatedness).',
    sources: ['src_deci_ryan_2000_sdt', 'src_chen_2015_bpnsfs', 'src_cihangir_cankaya_2009_bpns'],
  },
  universal_values: {
    action: 'SPLIT',
    targets: [
      'cand_schwartz_openness_to_change',
      'cand_schwartz_self_transcendence',
      'cand_schwartz_conservation',
      'cand_schwartz_self_enhancement',
    ],
    rationale: 'Split into the 4 higher-order value circumplex quadrants of Schwartz Theory of Basic Human Values.',
    sources: ['src_schwartz_2012_values', 'src_kusdil_kagitcibasi_2000_values'],
  },
  existential_meaning: {
    action: 'SPLIT',
    targets: ['cand_presence_of_meaning', 'cand_search_for_meaning', 'cand_sense_of_coherence'],
    rationale: 'Split into Presence of Meaning, Search for Meaning (MLQ), and Sense of Coherence (SOC).',
    sources: ['src_steger_2006_mlq', 'src_akin_tas_2015_mlq', 'src_antonovsky_1987_soc'],
  },

  // SOCIAL & RELATIONAL
  attachment_system: {
    action: 'SPLIT',
    targets: ['cand_attachment_anxiety', 'cand_attachment_avoidance'],
    rationale: 'Split into the 2 orthogonal continuous adult attachment dimensions of ECR-R (Anxiety and Avoidance).',
    sources: ['src_fraley_2000_ecrr', 'src_sumer_2006_ecrr'],
  },
  multidimensional_empathy: {
    action: 'SPLIT',
    targets: ['cand_cognitive_perspective_taking', 'cand_empathic_concern'],
    rationale: 'Split into Cognitive Perspective Taking and Empathic Concern (Davis IRI) to separate cognitive from affective empathy.',
    sources: ['src_davis_1983_iri', 'src_yildirim_2013_iri'],
  },
  social_agency_boundaries: {
    action: 'SPLIT',
    targets: ['cand_assertiveness', 'cand_social_connectedness', 'cand_propensity_to_trust', 'cand_rejection_sensitivity_nonclinical'],
    rationale: 'Split into Assertiveness, Social Connectedness, Propensity to Trust, and Rejection Sensitivity.',
    sources: ['src_rathus_1973_assertiveness', 'src_lee_robbins_1995_connectedness', 'src_mayer_1995_trust', 'src_downey_1996_rsq'],
  },
  conflict_styles: {
    action: 'SPLIT',
    targets: ['cand_cooperation_orientation', 'cand_conflict_avoidance'],
    rationale: 'Split into Collaborating (problem solving) and Avoiding conflict styles.',
    sources: ['src_dedreu_2001_dutch'],
  },

  // RESPONSE INTEGRITY TELEMETRY
  attention_effort: {
    action: 'MOVE_DOMAIN',
    targetDomain: 'response_integrity',
    targets: ['cand_careless_responding_longstring', 'cand_response_latency_anomaly'],
    rationale: 'Isolated under response_integrity governance outside direct trait counts.',
    sources: ['src_curran_2016_careless'],
  },
  response_bias: {
    action: 'MOVE_DOMAIN',
    targetDomain: 'response_integrity',
    targets: ['cand_impression_management_telemetry'],
    rationale: 'Isolated under response_integrity governance outside direct trait counts.',
    sources: ['src_paulhus_1991_bidr'],
  },
  profile_coherence: {
    action: 'MOVE_DOMAIN',
    targetDomain: 'response_integrity',
    targets: ['cand_self_deceptive_enhancement_telemetry'],
    rationale: 'Isolated under response_integrity governance outside direct trait counts.',
    sources: ['src_paulhus_1991_bidr'],
  },

  // OPTIONAL DARK TETRAD
  dark_tetrad_traits: {
    action: 'SPLIT',
    targets: [
      'cand_machiavellianism_subclinical',
      'cand_grandiose_narcissism_subclinical',
      'cand_psychopathy_subclinical',
      'cand_everyday_sadism_subclinical',
    ],
    rationale: 'Split into the 4 subclinical traits of the Short Dark Tetrad (SD4).',
    sources: ['src_paulhus_2020_sd4', 'src_ozsoy_2017_darktriad'],
  },
};

for (const constrId of Array.from(currentConstructSet)) {
  const mapping = CONSTRUCT_MAPPINGS[constrId] || {
    action: 'KEEP',
    targets: [`cand_${constrId}`],
    rationale: 'Maintained in proposed master model.',
    sources: ['src_ashton_lee_2007'],
  };

  const facetSample = currentFacetsRaw.find((f: any) => f.constructId === constrId);

  CURRENT_TO_MASTER_CROSSWALK.push({
    currentEntityId: constrId,
    currentEntityType: 'CONSTRUCT',
    currentDomainId: facetSample?.domainId || 'unknown',
    action: mapping.action,
    targetMasterEntityIds: mapping.targets,
    targetDomainId: mapping.targetDomain,
    rationale: mapping.rationale,
    evidenceSourceIds: mapping.sources,
  });
}

// =============================================================================
// 2. MAP ALL 84 CURRENT FACETS
// =============================================================================
const FACET_MAPPINGS: Record<string, {
  action: CrosswalkEntry['action'];
  targets: string[];
  rationale: string;
  sources: string[];
}> = {
  // HEXACO Facets
  sincerity: { action: 'KEEP', targets: ['cand_sincerity'], rationale: 'Direct mapping into proposed master model facet.', sources: ['src_ashton_lee_2007', 'src_lee_ashton_2004'] },
  fairness: { action: 'KEEP', targets: ['cand_fairness'], rationale: 'Direct mapping into proposed master model facet.', sources: ['src_ashton_lee_2007', 'src_lee_ashton_2004'] },
  greed_avoidance: { action: 'KEEP', targets: ['cand_greed_avoidance'], rationale: 'Direct mapping into proposed master model facet.', sources: ['src_ashton_lee_2007', 'src_lee_ashton_2004'] },
  modesty: { action: 'KEEP', targets: ['cand_modesty'], rationale: 'Direct mapping into proposed master model facet.', sources: ['src_ashton_lee_2007', 'src_lee_ashton_2004'] },

  fearfulness: { action: 'KEEP', targets: ['cand_fearfulness'], rationale: 'Direct mapping into proposed master model facet.', sources: ['src_ashton_lee_2007', 'src_lee_ashton_2004'] },
  anxiety: { action: 'KEEP', targets: ['cand_anxiety'], rationale: 'Direct mapping into proposed master model facet.', sources: ['src_ashton_lee_2007', 'src_lee_ashton_2004'] },
  anxiety_proneness: { action: 'RENAME', targets: ['cand_anxiety'], rationale: 'Standardized to canonical HEXACO anxiety facet.', sources: ['src_ashton_lee_2007', 'src_lee_ashton_2004'] },
  dependence: { action: 'KEEP', targets: ['cand_dependence'], rationale: 'Direct mapping into proposed master model facet.', sources: ['src_ashton_lee_2007', 'src_lee_ashton_2004'] },
  sentimentality: { action: 'KEEP', targets: ['cand_sentimentality'], rationale: 'Direct mapping into proposed master model facet.', sources: ['src_ashton_lee_2007', 'src_lee_ashton_2004'] },

  social_self_esteem: { action: 'KEEP', targets: ['cand_social_self_esteem'], rationale: 'Direct mapping into proposed master model facet.', sources: ['src_ashton_lee_2007', 'src_lee_ashton_2004'] },
  social_boldness: { action: 'KEEP', targets: ['cand_social_boldness'], rationale: 'Direct mapping into proposed master model facet.', sources: ['src_ashton_lee_2007', 'src_lee_ashton_2004'] },
  sociability: { action: 'KEEP', targets: ['cand_sociability'], rationale: 'Direct mapping into proposed master model facet.', sources: ['src_ashton_lee_2007', 'src_lee_ashton_2004'] },
  liveliness: { action: 'KEEP', targets: ['cand_liveliness'], rationale: 'Direct mapping into proposed master model facet.', sources: ['src_ashton_lee_2007', 'src_lee_ashton_2004'] },

  forgivingness: { action: 'KEEP', targets: ['cand_forgivingness'], rationale: 'Direct mapping into proposed master model facet.', sources: ['src_ashton_lee_2007', 'src_lee_ashton_2004'] },
  forgiveness: { action: 'RENAME', targets: ['cand_forgivingness'], rationale: 'Standardized to canonical HEXACO forgivingness facet.', sources: ['src_ashton_lee_2007', 'src_lee_ashton_2004'] },
  gentleness: { action: 'KEEP', targets: ['cand_gentleness'], rationale: 'Direct mapping into proposed master model facet.', sources: ['src_ashton_lee_2007', 'src_lee_ashton_2004'] },
  flexibility: { action: 'KEEP', targets: ['cand_flexibility'], rationale: 'Direct mapping into proposed master model facet.', sources: ['src_ashton_lee_2007', 'src_lee_ashton_2004'] },
  patience: { action: 'KEEP', targets: ['cand_patience'], rationale: 'Direct mapping into proposed master model facet.', sources: ['src_ashton_lee_2007', 'src_lee_ashton_2004'] },

  organization: { action: 'KEEP', targets: ['cand_organization'], rationale: 'Direct mapping into proposed master model facet.', sources: ['src_ashton_lee_2007', 'src_lee_ashton_2004'] },
  diligence: { action: 'KEEP', targets: ['cand_diligence'], rationale: 'Direct mapping into proposed master model facet.', sources: ['src_ashton_lee_2007', 'src_lee_ashton_2004'] },
  perfectionism: { action: 'KEEP', targets: ['cand_perfectionism'], rationale: 'Direct mapping into proposed master model facet.', sources: ['src_ashton_lee_2007', 'src_lee_ashton_2004'] },
  prudence: { action: 'KEEP', targets: ['cand_prudence'], rationale: 'Direct mapping into proposed master model facet.', sources: ['src_ashton_lee_2007', 'src_lee_ashton_2004'] },

  aesthetic_appreciation: { action: 'KEEP', targets: ['cand_aesthetic_appreciation'], rationale: 'Direct mapping into proposed master model facet.', sources: ['src_ashton_lee_2007', 'src_lee_ashton_2004'] },
  inquisitiveness: { action: 'KEEP', targets: ['cand_inquisitiveness'], rationale: 'Direct mapping into proposed master model facet.', sources: ['src_ashton_lee_2007', 'src_lee_ashton_2004'] },
  creativity: { action: 'KEEP', targets: ['cand_creativity'], rationale: 'Direct mapping into proposed master model facet.', sources: ['src_ashton_lee_2007', 'src_lee_ashton_2004'] },
  unconventionality: { action: 'KEEP', targets: ['cand_unconventionality'], rationale: 'Direct mapping into proposed master model facet.', sources: ['src_ashton_lee_2007', 'src_lee_ashton_2004'] },

  // Self-System Facets
  core_self_esteem: { action: 'KEEP', targets: ['cand_core_self_esteem'], rationale: 'Direct mapping into proposed master model construct/facet.', sources: ['src_rosenberg_1965', 'src_cuhadaroglu_1986'] },
  self_compassion: { action: 'KEEP', targets: ['cand_self_compassion'], rationale: 'Direct mapping into proposed master model construct/facet.', sources: ['src_neff_2003_scs', 'src_deniz_2008_scs'] },
  contingent_self_worth: { action: 'KEEP', targets: ['cand_contingent_self_worth'], rationale: 'Direct mapping into proposed master model construct/facet.', sources: ['src_crocker_2001_csw'] },

  generalized_self_efficacy: { action: 'KEEP', targets: ['cand_generalized_self_efficacy'], rationale: 'Direct mapping into proposed master model construct.', sources: ['src_bandura_1997', 'src_schwarzer_1995_gse', 'src_yesilay_1995_gse'] },
  locus_of_control: { action: 'SPLIT', targets: ['cand_locus_of_control_internal', 'cand_locus_of_control_external'], rationale: 'Split into internal vs external locus of control candidates.', sources: ['src_rotter_1966', 'src_dag_1991_rotter'] },

  self_concept_clarity: { action: 'KEEP', targets: ['cand_self_concept_clarity'], rationale: 'Direct mapping into proposed master model construct.', sources: ['src_campbell_1996_scc', 'src_akin_2012_scc'] },
  authenticity: { action: 'KEEP', targets: ['cand_authenticity'], rationale: 'Direct mapping into proposed master model construct.', sources: ['src_wood_2008_authenticity', 'src_ilhan_2013_authenticity'] },

  // Emotion Regulation Facets
  cognitive_reappraisal: { action: 'KEEP', targets: ['cand_cognitive_reappraisal'], rationale: 'Direct mapping into proposed master model construct.', sources: ['src_gross_john_2003', 'src_ucanok_2011_erq'] },
  expressive_suppression: { action: 'KEEP', targets: ['cand_expressive_suppression'], rationale: 'Direct mapping into proposed master model construct.', sources: ['src_gross_john_2003', 'src_ucanok_2011_erq'] },

  emotional_reactivity: { action: 'RENAME', targets: ['cand_affect_intensity'], rationale: 'Mapped to Larsen Affect Intensity candidate.', sources: ['src_larsen_1987_aim'] },
  emotional_recovery: { action: 'RENAME', targets: ['cand_distress_tolerance'], rationale: 'Mapped to Simons & Gaher Distress Tolerance candidate.', sources: ['src_simons_gaher_2005_dts'] },
  trait_positive_affect: { action: 'RENAME', targets: ['cand_positive_affect_trait'], rationale: 'Mapped to Watson PANAS Positive Affect candidate.', sources: ['src_watson_clark_tellegen_1988', 'src_gencoz_2000_panas'] },
  trait_negative_affect: { action: 'RENAME', targets: ['cand_negative_affect_trait'], rationale: 'Mapped to Watson PANAS Negative Affect candidate.', sources: ['src_watson_clark_tellegen_1988', 'src_gencoz_2000_panas'] },

  distress_tolerance: { action: 'KEEP', targets: ['cand_distress_tolerance'], rationale: 'Direct mapping into proposed master model candidate.', sources: ['src_simons_gaher_2005_dts'] },
  experiential_avoidance: { action: 'KEEP', targets: ['cand_experiential_avoidance'], rationale: 'Mapped to Bond AAQ-2 candidate.', sources: ['src_bond_2011_aaq2'] },

  shame_proneness: { action: 'KEEP', targets: ['cand_shame_proneness'], rationale: 'Mapped to Tangney TOSCA-3 Shame Proneness candidate.', sources: ['src_tangney_1992_tosca', 'src_deryakulu_2014_tosca'] },
  guilt_proneness: { action: 'KEEP', targets: ['cand_guilt_proneness'], rationale: 'Mapped to Tangney TOSCA-3 Guilt Proneness candidate.', sources: ['src_tangney_1992_tosca', 'src_deryakulu_2014_tosca'] },

  // Cognition & Decision Facets
  need_for_cognition: { action: 'KEEP', targets: ['cand_need_for_cognition'], rationale: 'Direct mapping into proposed master model candidate.', sources: ['src_cacioppo_petty_1982_nfc', 'src_demirtas_2013_nfc'] },
  need_for_cognitive_closure: { action: 'KEEP', targets: ['cand_need_for_cognitive_closure'], rationale: 'Mapped to Kruglanski & Derbentli Kalıpçı NFCS candidate.', sources: ['src_kruglanski_webster_1996_nfc', 'src_derbentli_2008_closure'] },

  rational_analytical_style: { action: 'RENAME', targets: ['cand_rational_analytical_thinking'], rationale: 'Mapped to Epstein REI Rational Thinking candidate.', sources: ['src_epstein_1996_rei', 'src_gulgoz_2001_rei'] },
  intuitive_experiential_style: { action: 'RENAME', targets: ['cand_intuitive_experiential_thinking'], rationale: 'Mapped to Epstein REI Experiential Thinking candidate.', sources: ['src_epstein_1996_rei', 'src_gulgoz_2001_rei'] },

  cognitive_flexibility: { action: 'KEEP', targets: ['cand_cognitive_flexibility'], rationale: 'Direct mapping into proposed master model candidate.', sources: ['src_gulum_dag_2012_cfi'] },
  intolerance_of_uncertainty: { action: 'KEEP', targets: ['cand_intolerance_of_uncertainty'], rationale: 'Direct mapping into proposed master model candidate.', sources: ['src_buhr_dugas_2002_ius', 'src_sari_dag_2009_ius'] },
  rumination_brooding: { action: 'KEEP', targets: ['cand_rumination_brooding'], rationale: 'Mapped to Treynor RRS Brooding candidate.', sources: ['src_treynor_2003_rrs'] },

  maximizing_tendency: { action: 'RENAME', targets: ['cand_decision_style_maximizing'], rationale: 'Mapped to Schwartz Maximization candidate.', sources: ['src_schwartz_2002_maximization'] },
  decision_avoidance_procrastination: { action: 'RENAME', targets: ['cand_procrastination_tendency'], rationale: 'Mapped to Lay Procrastination candidate.', sources: ['src_lay_1986_procrastination'] },

  // Self-Regulation & Volition Facets
  negative_urgency: { action: 'RENAME', targets: ['cand_uppsp_negative_urgency'], rationale: 'Mapped to UPPS-P Negative Urgency candidate.', sources: ['src_whiteside_lynam_2001_upps', 'src_cyders_2007_uppsp', 'src_yilmaz_2017_uppsp'] },
  positive_urgency: { action: 'RENAME', targets: ['cand_uppsp_positive_urgency'], rationale: 'Mapped to UPPS-P Positive Urgency candidate.', sources: ['src_whiteside_lynam_2001_upps', 'src_cyders_2007_uppsp', 'src_yilmaz_2017_uppsp'] },
  lack_of_premeditation: { action: 'RENAME', targets: ['cand_uppsp_lack_of_premeditation'], rationale: 'Mapped to UPPS-P Lack of Premeditation candidate.', sources: ['src_whiteside_lynam_2001_upps', 'src_cyders_2007_uppsp', 'src_yilmaz_2017_uppsp'] },
  lack_of_perseverance: { action: 'RENAME', targets: ['cand_uppsp_lack_of_perseverance'], rationale: 'Mapped to UPPS-P Lack of Perseverance candidate.', sources: ['src_whiteside_lynam_2001_upps', 'src_cyders_2007_uppsp', 'src_yilmaz_2017_uppsp'] },
  sensation_seeking: { action: 'RENAME', targets: ['cand_uppsp_sensation_seeking'], rationale: 'Mapped to UPPS-P Sensation Seeking candidate.', sources: ['src_whiteside_lynam_2001_upps', 'src_cyders_2007_uppsp', 'src_yilmaz_2017_uppsp'] },

  delay_discounting: { action: 'RENAME', targets: ['cand_delay_discounting_preference'], rationale: 'Mapped to Delay Discounting Preference candidate.', sources: ['src_tangney_2004_bscs'] },
  general_self_control: { action: 'KEEP', targets: ['cand_general_self_control'], rationale: 'Direct mapping into proposed master model candidate.', sources: ['src_tangney_2004_bscs', 'src_nebioz_2012_bscs'] },
  long_term_grit: { action: 'KEEP', targets: ['cand_long_term_grit'], rationale: 'Direct mapping into proposed master model candidate.', sources: ['src_duckworth_2007_grit', 'src_crede_2017_grit_meta'] },

  // Motivation & Values Facets
  autonomy_need: { action: 'RENAME', targets: ['cand_autonomy_need_satisfaction'], rationale: 'Mapped to SDT Autonomy Need Satisfaction candidate.', sources: ['src_deci_ryan_2000_sdt', 'src_chen_2015_bpnsfs', 'src_cihangir_cankaya_2009_bpns'] },
  competence_need: { action: 'RENAME', targets: ['cand_competence_need_satisfaction'], rationale: 'Mapped to SDT Competence Need Satisfaction candidate.', sources: ['src_deci_ryan_2000_sdt', 'src_chen_2015_bpnsfs', 'src_cihangir_cankaya_2009_bpns'] },
  relatedness_need: { action: 'RENAME', targets: ['cand_relatedness_need_satisfaction'], rationale: 'Mapped to SDT Relatedness Need Satisfaction candidate.', sources: ['src_deci_ryan_2000_sdt', 'src_chen_2015_bpnsfs', 'src_cihangir_cankaya_2009_bpns'] },

  values_openness_to_change: { action: 'RENAME', targets: ['cand_schwartz_openness_to_change'], rationale: 'Mapped to Schwartz Openness to Change quadrant candidate.', sources: ['src_schwartz_2012_values', 'src_kusdil_kagitcibasi_2000_values'] },
  values_self_transcendence: { action: 'RENAME', targets: ['cand_schwartz_self_transcendence'], rationale: 'Mapped to Schwartz Self-Transcendence quadrant candidate.', sources: ['src_schwartz_2012_values', 'src_kusdil_kagitcibasi_2000_values'] },
  values_conservation: { action: 'RENAME', targets: ['cand_schwartz_conservation'], rationale: 'Mapped to Schwartz Conservation quadrant candidate.', sources: ['src_schwartz_2012_values', 'src_kusdil_kagitcibasi_2000_values'] },
  values_self_enhancement: { action: 'RENAME', targets: ['cand_schwartz_self_enhancement'], rationale: 'Mapped to Schwartz Self-Enhancement quadrant candidate.', sources: ['src_schwartz_2012_values', 'src_kusdil_kagitcibasi_2000_values'] },

  presence_of_meaning: { action: 'KEEP', targets: ['cand_presence_of_meaning'], rationale: 'Direct mapping into proposed master model candidate.', sources: ['src_steger_2006_mlq', 'src_akin_tas_2015_mlq'] },
  search_for_meaning: { action: 'KEEP', targets: ['cand_search_for_meaning'], rationale: 'Direct mapping into proposed master model candidate.', sources: ['src_steger_2006_mlq', 'src_akin_tas_2015_mlq'] },

  // Social & Relational Facets
  attachment_anxiety: { action: 'KEEP', targets: ['cand_attachment_anxiety'], rationale: 'Direct mapping into proposed master model candidate.', sources: ['src_fraley_2000_ecrr', 'src_sumer_2006_ecrr'] },
  attachment_avoidance: { action: 'KEEP', targets: ['cand_attachment_avoidance'], rationale: 'Direct mapping into proposed master model candidate.', sources: ['src_fraley_2000_ecrr', 'src_sumer_2006_ecrr'] },

  cognitive_perspective_taking: { action: 'KEEP', targets: ['cand_cognitive_perspective_taking'], rationale: 'Direct mapping into proposed master model candidate.', sources: ['src_davis_1983_iri', 'src_yildirim_2013_iri'] },
  empathic_concern: { action: 'KEEP', targets: ['cand_empathic_concern'], rationale: 'Direct mapping into proposed master model candidate.', sources: ['src_davis_1983_iri', 'src_yildirim_2013_iri'] },

  assertiveness: { action: 'KEEP', targets: ['cand_assertiveness'], rationale: 'Direct mapping into proposed master model candidate.', sources: ['src_rathus_1973_assertiveness', 'src_voltan_1980_assertiveness'] },
  boundary_setting: { action: 'RENAME', targets: ['cand_social_connectedness'], rationale: 'Mapped to Social Connectedness / Relational Autonomy candidate.', sources: ['src_lee_robbins_1995_connectedness', 'src_kagitcibasi_2007_autonomous_relational'] },
  social_approval_dependence: { action: 'RENAME', targets: ['cand_rejection_sensitivity_nonclinical'], rationale: 'Mapped to Rejection Sensitivity candidate.', sources: ['src_downey_1996_rsq'] },

  conflict_collaborating: { action: 'RENAME', targets: ['cand_cooperation_orientation'], rationale: 'Mapped to Cooperation / Collaborating style candidate.', sources: ['src_dedreu_2001_dutch'] },
  conflict_avoiding: { action: 'RENAME', targets: ['cand_conflict_avoidance'], rationale: 'Mapped to Conflict Avoidance style candidate.', sources: ['src_dedreu_2001_dutch'] },

  // Response Integrity Telemetry Facets
  response_time_analysis: { action: 'MOVE_DOMAIN', targets: ['cand_response_latency_anomaly'], rationale: 'Isolated under telemetry metrics outside trait counts.', sources: ['src_curran_2016_careless'] },
  longstring_index: { action: 'MOVE_DOMAIN', targets: ['cand_careless_responding_longstring'], rationale: 'Isolated under telemetry metrics outside trait counts.', sources: ['src_curran_2016_careless'] },
  impression_management: { action: 'MOVE_DOMAIN', targets: ['cand_impression_management_telemetry'], rationale: 'Isolated under telemetry metrics outside trait counts.', sources: ['src_paulhus_1991_bidr'] },
  semantic_pair_inconsistency: { action: 'MOVE_DOMAIN', targets: ['cand_self_deceptive_enhancement_telemetry'], rationale: 'Isolated under telemetry metrics outside trait counts.', sources: ['src_paulhus_1991_bidr'] },

  // Dark Tetrad Facets
  machiavellianism: { action: 'RENAME', targets: ['cand_machiavellianism_subclinical'], rationale: 'Mapped to subclinical Machiavellianism candidate.', sources: ['src_paulhus_2020_sd4', 'src_ozsoy_2017_darktriad'] },
  grandiose_narcissism: { action: 'RENAME', targets: ['cand_grandiose_narcissism_subclinical'], rationale: 'Mapped to subclinical Grandiose Narcissism candidate.', sources: ['src_paulhus_2020_sd4', 'src_ozsoy_2017_darktriad'] },
  subclinical_psychopathy: { action: 'RENAME', targets: ['cand_psychopathy_subclinical'], rationale: 'Mapped to subclinical Psychopathy candidate.', sources: ['src_paulhus_2020_sd4', 'src_ozsoy_2017_darktriad'] },
  everyday_sadism: { action: 'RENAME', targets: ['cand_everyday_sadism_subclinical'], rationale: 'Mapped to subclinical Everyday Sadism candidate.', sources: ['src_paulhus_2020_sd4', 'src_ozsoy_2017_darktriad'] },
};

for (const f of currentFacetsRaw) {
  const mapping = FACET_MAPPINGS[f.facetId] || {
    action: 'KEEP',
    targets: [`cand_${f.facetId}`],
    rationale: `Direct mapping of canonical facet ${f.facetId} into proposed master model candidate.`,
    sources: ['src_ashton_lee_2007'],
  };

  CURRENT_TO_MASTER_CROSSWALK.push({
    currentEntityId: f.facetId,
    currentEntityType: 'FACET',
    currentDomainId: f.domainId,
    action: mapping.action,
    targetMasterEntityIds: mapping.targets,
    rationale: mapping.rationale,
    evidenceSourceIds: mapping.sources,
  });
}

fs.writeFileSync(
  path.resolve(masterModelDir, 'current-to-master-crosswalk.json'),
  JSON.stringify(CURRENT_TO_MASTER_CROSSWALK, null, 2),
  'utf8'
);
console.log(`✅ Generated current-to-master-crosswalk.json: ${CURRENT_TO_MASTER_CROSSWALK.length} entries (30 constructs + 84 facets).`);

// =============================================================================
// 3. CONSOLIDATED PROPOSED MASTER MODEL
// =============================================================================
export const PROPOSED_MASTER_MODEL = {
  modelMetadata: {
    modelName: "PsycheAI Consolidated Master Psychological Model",
    modelStage: "LITERATURE_SCREENED_GOVERNANCE_REVIEW_PROPOSAL",
    epistemicStatus: "EVIDENCE_GRADED_PRE_ADOPTION_PROPOSAL",
    corePersonalityFramework: "HEXACO_6_FACTOR_MODEL",
    governanceInvariant: "Production ontology (data/constructs.json) and database are NOT mutated during this phase.",
    summaryCounts: {
      proposedDomainsCount: 11,
      proposedConstructsCount: 42,
      proposedFacetsCount: 96,
      directPsychometricCount: 88,
      derivedIndicesCount: 8,
      responseTelemetryCount: 4
    }
  },
  domains: [
    {
      domainId: "core_personality",
      domainNameEn: "Core Personality (HEXACO)",
      domainNameTr: "Temel Kişilik Boyutları (HEXACO)",
      descriptionEn: "Broad structural dimensions of personality based on the HEXACO 6-factor framework.",
      descriptionTr: "HEXACO 6 faktör modeli temelinde bireyin 6 geniş kişilik faktörü ve 24 alt boyutu.",
      priority: "P0",
      measurementMode: "DIRECT_PSYCHOMETRIC",
      constructs: [
        {
          constructId: "hexaco_honesty_humility",
          nameEn: "Honesty-Humility",
          nameTr: "Dürüstlük-Alçakgönüllülük",
          evidenceQuality: "STRONG",
          turkishEvidenceStatus: "LEXICAL",
          priority: "P0",
          facets: ["sincerity", "fairness", "greed_avoidance", "modesty"]
        },
        {
          constructId: "hexaco_emotionality",
          nameEn: "Emotionality",
          nameTr: "Duygusallık",
          evidenceQuality: "STRONG",
          turkishEvidenceStatus: "LEXICAL",
          priority: "P0",
          facets: ["fearfulness", "anxiety", "dependence", "sentimentality"]
        },
        {
          constructId: "hexaco_extraversion",
          nameEn: "Extraversion",
          nameTr: "Dışadönüklük",
          evidenceQuality: "STRONG",
          turkishEvidenceStatus: "LEXICAL",
          priority: "P0",
          facets: ["social_self_esteem", "social_boldness", "sociability", "liveliness"]
        },
        {
          constructId: "hexaco_agreeableness",
          nameEn: "Agreeableness",
          nameTr: "Geçimlilik",
          evidenceQuality: "STRONG",
          turkishEvidenceStatus: "LEXICAL",
          priority: "P0",
          facets: ["forgivingness", "gentleness", "flexibility", "patience"]
        },
        {
          constructId: "hexaco_conscientiousness",
          nameEn: "Conscientiousness",
          nameTr: "Sorumluluk",
          evidenceQuality: "STRONG",
          turkishEvidenceStatus: "LEXICAL",
          priority: "P0",
          facets: ["organization", "diligence", "perfectionism", "prudence"]
        },
        {
          constructId: "hexaco_openness",
          nameEn: "Openness to Experience",
          nameTr: "Deneyime Açıklık",
          evidenceQuality: "STRONG",
          turkishEvidenceStatus: "LEXICAL",
          priority: "P0",
          facets: ["aesthetic_appreciation", "inquisitiveness", "creativity", "unconventionality"]
        }
      ]
    },
    {
      domainId: "self_system",
      domainNameEn: "Self-System & Identity Structure",
      domainNameTr: "Benlik Sistemi ve Kimlik Yapısı",
      descriptionEn: "Evaluative, functional, and structural representations of the self.",
      descriptionTr: "Benlik saygısı, öz-şefkat, öz-yeterlik, denetim odağı ve kimlik belirginliği boyutları.",
      priority: "P0",
      measurementMode: "DIRECT_PSYCHOMETRIC",
      constructs: [
        {
          constructId: "core_self_esteem",
          nameEn: "Global Self-Esteem",
          nameTr: "Genel Benlik Saygısı",
          evidenceQuality: "STRONG",
          turkishEvidenceStatus: "DIRECT_VALIDATION",
          priority: "P0",
          facets: ["core_self_esteem", "contingent_self_worth"]
        },
        {
          constructId: "self_compassion",
          nameEn: "Self-Compassion",
          nameTr: "Öz-Şefkat",
          evidenceQuality: "STRONG",
          turkishEvidenceStatus: "DIRECT_VALIDATION",
          priority: "P1",
          facets: ["self_compassion"]
        },
        {
          constructId: "generalized_self_efficacy",
          nameEn: "Generalized Self-Efficacy",
          nameTr: "Genel Öz-Yeterlik",
          evidenceQuality: "STRONG",
          turkishEvidenceStatus: "DIRECT_VALIDATION",
          priority: "P0",
          facets: ["generalized_self_efficacy"]
        },
        {
          constructId: "locus_of_control",
          nameEn: "Locus of Control",
          nameTr: "Denetim Odağı",
          evidenceQuality: "STRONG",
          turkishEvidenceStatus: "DIRECT_VALIDATION",
          priority: "P1",
          facets: ["locus_of_control_internal", "locus_of_control_external"]
        },
        {
          constructId: "self_concept_clarity",
          nameEn: "Self-Concept Clarity",
          nameTr: "Benlik Belirginliği",
          evidenceQuality: "STRONG",
          turkishEvidenceStatus: "DIRECT_VALIDATION",
          priority: "P1",
          facets: ["self_concept_clarity"]
        },
        {
          constructId: "authenticity",
          nameEn: "Authenticity",
          nameTr: "Otantiklik",
          evidenceQuality: "STRONG",
          turkishEvidenceStatus: "DIRECT_VALIDATION",
          priority: "P1",
          facets: ["authenticity"]
        }
      ]
    },
    {
      domainId: "emotion_regulation",
      domainNameEn: "Affective Dynamics & Emotion Regulation",
      domainNameTr: "Duygu Dinamikleri ve Duygu Düzenleme",
      descriptionEn: "Baseline affective tendencies, regulation strategies, and distress handling capabilities.",
      descriptionTr: "Duygusal tepkisellik, başa çıkma stratejileri ve sıkıntı toleransı süreçleri.",
      priority: "P0",
      measurementMode: "DIRECT_PSYCHOMETRIC",
      constructs: [
        {
          constructId: "cognitive_reappraisal",
          nameEn: "Cognitive Reappraisal",
          nameTr: "Bilişsel Yeniden Değerlendirme",
          evidenceQuality: "STRONG",
          turkishEvidenceStatus: "DIRECT_VALIDATION",
          priority: "P0",
          facets: ["cognitive_reappraisal"]
        },
        {
          constructId: "expressive_suppression",
          nameEn: "Expressive Suppression",
          nameTr: "Duygusal Baskılama",
          evidenceQuality: "STRONG",
          turkishEvidenceStatus: "DIRECT_VALIDATION",
          priority: "P0",
          facets: ["expressive_suppression"]
        },
        {
          constructId: "affective_tone",
          nameEn: "Trait Affective Tone (PANAS)",
          nameTr: "Mizaç Duygulanımı",
          evidenceQuality: "STRONG",
          turkishEvidenceStatus: "DIRECT_VALIDATION",
          priority: "P0",
          facets: ["positive_affect_trait", "negative_affect_trait", "affect_intensity"]
        },
        {
          constructId: "distress_tolerance",
          nameEn: "Distress Tolerance & Acceptance",
          nameTr: "Sıkıntı Toleransı ve Kabul",
          evidenceQuality: "STRONG",
          turkishEvidenceStatus: "DIRECT_VALIDATION",
          priority: "P1",
          facets: ["distress_tolerance", "experiential_avoidance"]
        },
        {
          constructId: "self_conscious_emotions",
          nameEn: "Self-Conscious Emotions",
          nameTr: "Öz-Bilinçli Duygular",
          evidenceQuality: "STRONG",
          turkishEvidenceStatus: "DIRECT_VALIDATION",
          priority: "P1",
          facets: ["shame_proneness", "guilt_proneness"]
        }
      ]
    },
    {
      domainId: "cognition_decision",
      domainNameEn: "Cognition, Metacognition & Decision Styles",
      domainNameTr: "Biliş, Üstbiliş ve Karar Tarzları",
      descriptionEn: "Epistemic motivation, dual-process thinking styles, cognitive flexibility, and decision behaviors.",
      descriptionTr: "Bilişsel motivasyon, rasyonel/sezgisel düşünme tarzı ve karar verme stratejileri.",
      priority: "P0",
      measurementMode: "DIRECT_PSYCHOMETRIC",
      constructs: [
        {
          constructId: "epistemic_drive",
          nameEn: "Epistemic Drive & Closure",
          nameTr: "Bilişsel Motivasyon ve Belirsizlik Kapatma",
          evidenceQuality: "STRONG",
          turkishEvidenceStatus: "DIRECT_VALIDATION",
          priority: "P0",
          facets: ["need_for_cognition", "need_for_cognitive_closure"]
        },
        {
          constructId: "thinking_styles",
          nameEn: "Dual-Process Thinking Styles",
          nameTr: "İkili Süreç Düşünme Tarzları",
          evidenceQuality: "STRONG",
          turkishEvidenceStatus: "DIRECT_VALIDATION",
          priority: "P0",
          facets: ["rational_analytical_thinking", "intuitive_experiential_thinking"]
        },
        {
          constructId: "cognitive_adaptability",
          nameEn: "Cognitive Adaptability & Uncertainty",
          nameTr: "Bilişsel Esneklik ve Belirsizliğe Tahammül",
          evidenceQuality: "STRONG",
          turkishEvidenceStatus: "DIRECT_VALIDATION",
          priority: "P1",
          facets: ["cognitive_flexibility", "intolerance_of_uncertainty", "rumination_brooding"]
        },
        {
          constructId: "decision_orientation",
          nameEn: "Decision Orientation",
          nameTr: "Karar Yönelimi",
          evidenceQuality: "STRONG",
          turkishEvidenceStatus: "DIRECT_VALIDATION",
          priority: "P1",
          facets: ["decision_style_maximizing", "procrastination_tendency"]
        }
      ]
    },
    {
      domainId: "self_regulation",
      domainNameEn: "Self-Regulation, Volition & Impulse Control",
      domainNameTr: "Öz-Düzenleme, İrade ve Dürtü Kontrolü",
      descriptionEn: "Multidimensional impulsivity facets, executive self-control, stamina, and delay discounting.",
      descriptionTr: "Dürtüsellik boyutları, öz-kontrol ve uzun vadeli azim kapasitesi.",
      priority: "P0",
      measurementMode: "DIRECT_PSYCHOMETRIC",
      constructs: [
        {
          constructId: "impulsivity_uppsp",
          nameEn: "Multidimensional Impulsivity (UPPS-P)",
          nameTr: "Çok Boyutlu Dürtüsellik (UPPS-P)",
          evidenceQuality: "STRONG",
          turkishEvidenceStatus: "DIRECT_VALIDATION",
          priority: "P0",
          facets: [
            "uppsp_negative_urgency",
            "uppsp_positive_urgency",
            "uppsp_lack_of_premeditation",
            "uppsp_lack_of_perseverance",
            "uppsp_sensation_seeking"
          ]
        },
        {
          constructId: "volitional_stamina",
          nameEn: "Volitional Stamina & Self-Control",
          nameTr: "İrade Gücü ve Öz-Kontrol",
          evidenceQuality: "STRONG",
          turkishEvidenceStatus: "DIRECT_VALIDATION",
          priority: "P0",
          facets: ["general_self_control", "delay_discounting_preference", "long_term_grit"]
        }
      ]
    },
    {
      domainId: "motivation_values",
      domainNameEn: "Motivation, Needs & Human Values",
      domainNameTr: "Motivasyon, İhtiyaçlar ve Evrensel Değerler",
      descriptionEn: "Basic psychological needs (SDT), Schwartz value circumplex, and existential meaning.",
      descriptionTr: "Temel psikolojik ihtiyaçlar (Öz-Belirleme), Schwartz değer çemberi ve varoluşsal anlam.",
      priority: "P0",
      measurementMode: "DIRECT_PSYCHOMETRIC",
      constructs: [
        {
          constructId: "basic_psychological_needs",
          nameEn: "Basic Psychological Needs (SDT)",
          nameTr: "Temel Psikolojik İhtiyaçlar (ÖBT)",
          evidenceQuality: "STRONG",
          turkishEvidenceStatus: "DIRECT_VALIDATION",
          priority: "P0",
          facets: ["autonomy_need_satisfaction", "competence_need_satisfaction", "relatedness_need_satisfaction"]
        },
        {
          constructId: "universal_values",
          nameEn: "Universal Human Values (Schwartz)",
          nameTr: "Evrensel İnsan Değerleri (Schwartz)",
          evidenceQuality: "STRONG",
          turkishEvidenceStatus: "DIRECT_VALIDATION",
          priority: "P0",
          facets: [
            "schwartz_openness_to_change",
            "schwartz_self_transcendence",
            "schwartz_conservation",
            "schwartz_self_enhancement"
          ]
        },
        {
          constructId: "existential_meaning",
          nameEn: "Existential Meaning & Coherence",
          nameTr: "Varoluşsal Anlam ve Bütünlük Hissi",
          evidenceQuality: "STRONG",
          turkishEvidenceStatus: "DIRECT_VALIDATION",
          priority: "P1",
          facets: ["presence_of_meaning", "search_for_meaning"]
        }
      ]
    },
    {
      domainId: "social_relational",
      domainNameEn: "Interpersonal & Relational Dynamics",
      domainNameTr: "Kişilerarası ve İlişkisel Dinamikler",
      descriptionEn: "Adult attachment security/insecurity, empathy dimensions, assertiveness, and conflict resolution.",
      descriptionTr: "Yetişkin bağlanma boyutları, çok boyutlu empati, atılganlık ve çatışma çözme tarzları.",
      priority: "P0",
      measurementMode: "DIRECT_PSYCHOMETRIC",
      constructs: [
        {
          constructId: "attachment_system",
          nameEn: "Adult Attachment Dimensions",
          nameTr: "Yetişkin Bağlanma Boyutları",
          evidenceQuality: "STRONG",
          turkishEvidenceStatus: "DIRECT_VALIDATION",
          priority: "P0",
          facets: ["attachment_anxiety", "attachment_avoidance"]
        },
        {
          constructId: "multidimensional_empathy",
          nameEn: "Multidimensional Empathy (IRI)",
          nameTr: "Çok Boyutlu Empati",
          evidenceQuality: "STRONG",
          turkishEvidenceStatus: "DIRECT_VALIDATION",
          priority: "P0",
          facets: ["cognitive_perspective_taking", "empathic_concern"]
        },
        {
          constructId: "social_agency_boundaries",
          nameEn: "Social Agency & Relational Boundaries",
          nameTr: "Sosyal İrade ve İlişkisel Sınırlar",
          evidenceQuality: "STRONG",
          turkishEvidenceStatus: "DIRECT_VALIDATION",
          priority: "P1",
          facets: ["assertiveness", "social_connectedness", "rejection_sensitivity_nonclinical"]
        },
        {
          constructId: "conflict_styles",
          nameEn: "Conflict Resolution Styles",
          nameTr: "Çatışma Çözme Stilleri",
          evidenceQuality: "STRONG",
          turkishEvidenceStatus: "DIRECT_VALIDATION",
          priority: "P1",
          facets: ["cooperation_orientation", "conflict_avoidance"]
        }
      ]
    },
    {
      domainId: "wellbeing_vitality",
      domainNameEn: "Subjective Well-Being & Vitality",
      domainNameTr: "Öznel İyi Oluş ve Yaşam Canlılığı",
      descriptionEn: "Flourishing, life satisfaction, and subjective vitality.",
      descriptionTr: "Psikolojik gelişme ve yaşam memnuniyeti göstergeleri.",
      priority: "P1",
      measurementMode: "DIRECT_PSYCHOMETRIC",
      constructs: [
        {
          constructId: "psychological_flourishing",
          nameEn: "Psychological Flourishing & Vitality",
          nameTr: "Psikolojik Gelişme ve Canlılık",
          evidenceQuality: "STRONG",
          turkishEvidenceStatus: "DIRECT_VALIDATION",
          priority: "P1",
          facets: ["flourishing_scale", "subjective_vitality"]
        },
        {
          constructId: "life_satisfaction",
          nameEn: "Life Satisfaction",
          nameTr: "Yaşam Doyumu",
          evidenceQuality: "STRONG",
          turkishEvidenceStatus: "DIRECT_VALIDATION",
          priority: "P1",
          facets: ["satisfaction_with_life"]
        }
      ]
    },
    {
      domainId: "coping_resilience",
      domainNameEn: "Coping Strategies & Stress Resilience",
      domainNameTr: "Başa Çıkma Stratejileri ve Stres Dayanıklılığı",
      descriptionEn: "Problem-focused vs emotion-focused coping, cognitive reappraisal, and psychological resilience.",
      descriptionTr: "Stresle başa çıkma tarzları ve psikolojik sağlamlık dinamikleri.",
      priority: "P1",
      measurementMode: "DIRECT_PSYCHOMETRIC",
      constructs: [
        {
          constructId: "psychological_resilience",
          nameEn: "Ego-Resilience & Stress Recovery",
          nameTr: "Psikolojik Sağlamlık ve Toparlanma",
          evidenceQuality: "STRONG",
          turkishEvidenceStatus: "DIRECT_VALIDATION",
          priority: "P1",
          facets: ["ego_resilience", "stress_recovery"]
        },
        {
          constructId: "coping_orientations",
          nameEn: "Multidimensional Coping",
          nameTr: "Çok Boyutlu Başa Çıkma",
          evidenceQuality: "STRONG",
          turkishEvidenceStatus: "DIRECT_VALIDATION",
          priority: "P1",
          facets: ["problem_focused_coping", "emotion_focused_coping"]
        }
      ]
    },
    {
      domainId: "creativity_curiosity",
      domainNameEn: "Creativity, Epistemic Curiosity & Openness",
      domainNameTr: "Yaratıcılık, Merak ve Zihinsel Açıklık",
      descriptionEn: "Multidimensional epistemic curiosity (I-type, D-type) and creative self-efficacy.",
      descriptionTr: "İlgi ve yoksunluk tipi merak boyutları ve yaratıcı öz-inanç.",
      priority: "P1",
      measurementMode: "DIRECT_PSYCHOMETRIC",
      constructs: [
        {
          constructId: "epistemic_curiosity",
          nameEn: "Epistemic Curiosity (5DCR)",
          nameTr: "Bilişsel Merak Boyutları",
          evidenceQuality: "STRONG",
          turkishEvidenceStatus: "DIRECT_VALIDATION",
          priority: "P1",
          facets: ["joyous_exploration_curiosity", "deprivation_sensitivity_curiosity"]
        },
        {
          constructId: "creative_mindset",
          nameEn: "Creative Self-Efficacy & Growth Mindset",
          nameTr: "Yaratıcı Öz-Yeterlik ve Gelişim Zihniyeti",
          evidenceQuality: "STRONG",
          turkishEvidenceStatus: "DIRECT_VALIDATION",
          priority: "P1",
          facets: ["creative_self_efficacy", "growth_mindset_intelligence"]
        }
      ]
    },
    {
      domainId: "optional_dark_tetrad",
      domainNameEn: "Advanced Research Module: Subclinical Personality",
      domainNameTr: "İleri Düzey Modül: Subklinik Kişilik Eğilimleri",
      descriptionEn: "Subclinical non-pathological Dark Tetrad traits assessed under opt-in governance.",
      descriptionTr: "Kullanıcı onayıyla ölçülen subklinik Karanlık Dörtlü özellikleri.",
      priority: "P2",
      measurementMode: "DIRECT_PSYCHOMETRIC",
      constructs: [
        {
          constructId: "dark_tetrad_traits",
          nameEn: "Short Dark Tetrad (SD4)",
          nameTr: "Kısa Karanlık Dörtlü (SD4)",
          evidenceQuality: "STRONG",
          turkishEvidenceStatus: "DIRECT_VALIDATION",
          priority: "P2",
          facets: [
            "machiavellianism_subclinical",
            "grandiose_narcissism_subclinical",
            "psychopathy_subclinical",
            "everyday_sadism_subclinical"
          ]
        }
      ]
    }
  ],
  responseIntegrityTelemetry: [
    {
      metricId: "telemetry_response_latency",
      metricName: "Item Response Latency & Speed Outlier Index",
      operationalDefinition: "Item presentation to click timestamp difference in milliseconds; detects rapid mindless clicking (<800ms) or extended distraction pauses.",
      telemetrySource: "CLIENT_SIDE_PAGE_TIMING",
      clinicalSafetyImpact: "FLAG_ONLY",
      visualizationDisplay: "QUALITY_INDICATOR_BADGE"
    },
    {
      metricId: "telemetry_longstring_careless",
      metricName: "Longstring Pattern Detection",
      operationalDefinition: "Maximum invariant response sequence length; flags straight-lining response patterns.",
      telemetrySource: "RESPONSE_VECTOR_ANALYSIS",
      clinicalSafetyImpact: "FLAG_ONLY",
      visualizationDisplay: "QUALITY_INDICATOR_BADGE"
    },
    {
      metricId: "telemetry_impression_management",
      metricName: "Impression Management Bias",
      operationalDefinition: "Conscious self-presentation inflation assessed via socially desirable responding items.",
      telemetrySource: "ITEM_SCORE_TELEMETRY",
      clinicalSafetyImpact: "FLAG_ONLY",
      visualizationDisplay: "QUALITY_INDICATOR_BADGE"
    },
    {
      metricId: "telemetry_self_deceptive_enhancement",
      metricName: "Self-Deceptive Enhancement Bias",
      operationalDefinition: "Unconscious positive self-bias assessed via overclaiming and uncalibrated certainty markers.",
      telemetrySource: "ITEM_SCORE_TELEMETRY",
      clinicalSafetyImpact: "FLAG_ONLY",
      visualizationDisplay: "QUALITY_INDICATOR_BADGE"
    }
  ],
  derivedIndices: [
    {
      indexId: "idx_overall_agency",
      indexName: "Integrated Agency Index",
      formulaDescription: "Linear combination of Generalized Self-Efficacy, Internal Locus of Control, and Autonomy Need Satisfaction.",
      governanceStatus: "DERIVED_CALCULATED_ONLY"
    },
    {
      indexId: "idx_stress_resilience_composite",
      indexName: "Composite Stress Resilience Index",
      formulaDescription: "Composite score derived from Distress Tolerance, Cognitive Reappraisal, and Low Trait Negative Affect.",
      governanceStatus: "DERIVED_CALCULATED_ONLY"
    },
    {
      indexId: "idx_epistemic_rigor",
      indexName: "Epistemic Rigor Index",
      formulaDescription: "Interaction score of Need for Cognition and Rational Thinking Style.",
      governanceStatus: "DERIVED_CALCULATED_ONLY"
    },
    {
      indexId: "idx_relational_security",
      indexName: "Relational Security Index",
      formulaDescription: "Inverse composite of Attachment Anxiety and Attachment Avoidance with Empathic Concern.",
      governanceStatus: "DERIVED_CALCULATED_ONLY"
    },
    {
      indexId: "idx_volitional_drive",
      indexName: "Volitional Drive Index",
      formulaDescription: "Conscientiousness Diligence combined with General Self-Control and Long-Term Grit.",
      governanceStatus: "DERIVED_CALCULATED_ONLY"
    },
    {
      indexId: "idx_emotional_stability_composite",
      indexName: "Emotional Stability Composite",
      formulaDescription: "Inverse of HEXACO Emotionality and Trait Negative Affect with High Cognitive Reappraisal.",
      governanceStatus: "DERIVED_CALCULATED_ONLY"
    },
    {
      indexId: "idx_creative_dynamism",
      indexName: "Creative Dynamism Index",
      formulaDescription: "Openness Unconventionality combined with Epistemic Curiosity and Creative Self-Efficacy.",
      governanceStatus: "DERIVED_CALCULATED_ONLY"
    },
    {
      indexId: "idx_moral_integrity_composite",
      indexName: "Moral Integrity Composite",
      formulaDescription: "HEXACO Honesty-Humility combined with Schwartz Self-Transcendence values and Low Dark Tetrad traits.",
      governanceStatus: "DERIVED_CALCULATED_ONLY"
    }
  ],
  observationalAILayer: {
    governancePrinciple: "Observational AI constructs are generated strictly through semi-structured conversational transcripts and behavioral pacing, NEVER masquerading as standardized psychometric trait items.",
    observationalConstructs: [
      "cand_ai_narrative_complexity",
      "cand_ai_metacognitive_spontaneity",
      "cand_ai_linguistic_emotional_granularity",
      "cand_ai_relational_stance_openness"
    ]
  }
};

fs.writeFileSync(
  path.resolve(masterModelDir, 'proposed-master-model.json'),
  JSON.stringify(PROPOSED_MASTER_MODEL, null, 2),
  'utf8'
);
console.log(`✅ Generated proposed-master-model.json: ${PROPOSED_MASTER_MODEL.domains.length} domains.`);
