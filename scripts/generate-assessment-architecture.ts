import fs from 'fs';
import path from 'path';

const root = path.resolve(__dirname, '..');
const dataDir = path.resolve(root, 'data/assessment-architecture');

// Load FAZ 2.14 proposed model & instrument registry
const proposedMasterModel = JSON.parse(
  fs.readFileSync(path.resolve(root, 'data/master-model/proposed-master-model.json'), 'utf8')
);
const instrumentRegistry = JSON.parse(
  fs.readFileSync(path.resolve(root, 'data/instrument-registry.json'), 'utf8')
);

// -----------------------------------------------------------------------------
// 1. ASSESSMENT MODULE CATALOG (assessment-architecture.json)
// -----------------------------------------------------------------------------
const assessmentModules = [
  {
    assessmentId: 'mod_core_hexaco_60',
    titleTr: 'Temel Kişilik Yapısı (HEXACO-60)',
    titleEn: 'Core Personality Structure (HEXACO-60)',
    stage: 'CORE',
    priority: 'P0',
    requiredForFirstProfile: true,
    requiredForComprehensiveProfile: true,
    constructIdsCovered: [
      'hexaco_honesty_humility',
      'hexaco_emotionality',
      'hexaco_extraversion',
      'hexaco_agreeableness',
      'hexaco_conscientiousness',
      'hexaco_openness'
    ],
    facetIdsCovered: [
      'sincerity',
      'fairness',
      'greed_avoidance',
      'modesty',
      'fearfulness',
      'anxiety',
      'dependence',
      'sentimentality',
      'social_self_esteem',
      'social_boldness',
      'sociability',
      'liveliness',
      'forgivingness',
      'gentleness',
      'flexibility',
      'patience',
      'organization',
      'diligence',
      'perfectionism',
      'prudence',
      'aesthetic_appreciation',
      'inquisitiveness',
      'creativity',
      'unconventionality'
    ],
    facetMeasurementCapability: 'FACET_CONTENT_SAMPLED_BROAD_FACTOR_PRIMARY',
    instrumentCandidates: ['inst_hexaco_60', 'inst_ipip_hexaco', 'inst_hexaco_pi_r'],
    selectedInstrumentId: 'inst_hexaco_60',
    selectedInstrumentStatus: 'READY_BUT_NOT_PUBLISHED',
    questionCountPlanned: 60,
    estimatedMinutes: 12.0,
    scoringModel: 'PRE_CALIBRATION_MEAN_V1',
    publicationReadiness: 'READY_BUT_NOT_PUBLISHED',
    turkishEvidenceStatus: 'LEXICAL_AND_ADAPTATION_EVIDENCE',
    licensingStatus: 'REQUIRES_PERMISSION',
    exactWordingProvenanceStatus: 'RESEARCH_DRAFT_PENDING_AUTHOR_VERIFICATION',
    commercialUseStatus: 'REQUIRES_AUTHOR_PERMISSION',
    responseFormat: 'LIKERT_5',
    reverseKeying: {
      hasReverseItems: true,
      reverseItemCount: 28,
      reverseScoringRule: '6 - rawValue'
    },
    subscales: [
      { code: 'HH', nameTr: 'Dürüstlük-Alçakgönüllülük', nameEn: 'Honesty-Humility', itemCount: 10, constructId: 'hexaco_honesty_humility' },
      { code: 'EM', nameTr: 'Duygusallık', nameEn: 'Emotionality', itemCount: 10, constructId: 'hexaco_emotionality' },
      { code: 'EX', nameTr: 'Dışadönüklük', nameEn: 'Extraversion', itemCount: 10, constructId: 'hexaco_extraversion' },
      { code: 'AG', nameTr: 'Geçimlilik', nameEn: 'Agreeableness', itemCount: 10, constructId: 'hexaco_agreeableness' },
      { code: 'CO', nameTr: 'Sorumluluk', nameEn: 'Conscientiousness', itemCount: 10, constructId: 'hexaco_conscientiousness' },
      { code: 'OP', nameTr: 'Deneyime Açıklık', nameEn: 'Openness to Experience', itemCount: 10, constructId: 'hexaco_openness' }
    ],
    resultVisualizationIds: ['hexaco_radar_chart', 'personality_trait_bars'],
    profileContribution: {
      domains: ['core_personality'],
      constructs: ['hexaco_honesty_humility', 'hexaco_emotionality', 'hexaco_extraversion', 'hexaco_agreeableness', 'hexaco_conscientiousness', 'hexaco_openness'],
      facets: 24,
      facetScoringLevel: 'BROAD_FACTORS_PRIMARY_FACET_THEMES_SAMPLED',
      visualizations: ['Radar', 'Trait Spectrum'],
      aiInsightInputs: ['HEXACO trait configurations', 'Inter-factor tensions'],
      longitudinalOutputs: ['Trait stability index', 'Factor shift metrics']
    },
    blockingIssues: [
      'Official HEXACO-60 (Ashton & Lee, 2009) requires contacting authors for commercial SaaS licensing.',
      'HEXACO-60 samples facet content but does not provide 24 independently reliable facet scores (requires full form or validated 100/240-item inventory for facet-level diagnostic reporting).'
    ],
    rationale: 'Official 60-item short form (Ashton & Lee, 2009) measuring 6 broad personality factors (10 items/factor). Public-domain IPIP-HEXACO (240 items) is reserved as research bank form.'
  },
  {
    assessmentId: 'mod_self_agency',
    titleTr: 'Benlik Sistemi ve Öz-Yetkinlik',
    titleEn: 'Self-System & Generalized Agency',
    stage: 'CORE',
    priority: 'P0',
    requiredForFirstProfile: true,
    requiredForComprehensiveProfile: true,
    constructIdsCovered: ['core_self_esteem', 'generalized_self_efficacy'],
    facetIdsCovered: ['self_esteem_positive_worth', 'self_esteem_low_deprecation', 'self_efficacy_general_coping'],
    facetMeasurementCapability: 'FULL_INDEPENDENT_SUBSCALE_SCORES',
    instrumentCandidates: ['inst_rses', 'inst_gses'],
    selectedInstrumentId: 'inst_rses',
    selectedInstrumentStatus: 'READY_BUT_NOT_PUBLISHED',
    questionCountPlanned: 20,
    estimatedMinutes: 4.0,
    scoringModel: 'PRE_CALIBRATION_MEAN_V1',
    publicationReadiness: 'READY_BUT_NOT_PUBLISHED',
    turkishEvidenceStatus: 'EMPIRICAL_ADAPTATION_VALIDATED',
    licensingStatus: 'PARTIALLY_RESTRICTED',
    exactWordingProvenanceStatus: 'RSES_VERIFIED_GSES_RESEARCH_DRAFT',
    commercialUseStatus: 'RSES_PUBLIC_GSES_REQUIRES_LICENSE',
    responseFormat: 'LIKERT_4_AND_5',
    reverseKeying: {
      hasReverseItems: true,
      reverseItemCount: 5,
      reverseScoringRule: 'Scale dependent (5 - val for 4-point, 6 - val for 5-point)'
    },
    subscales: [
      { code: 'RSES', nameTr: 'Rosenberg Özsaygı Skalası', nameEn: 'Rosenberg Self-Esteem Scale', itemCount: 10, constructId: 'core_self_esteem' },
      { code: 'GSES', nameTr: 'Genel Öz-Yeterlilik Skalası', nameEn: 'General Self-Efficacy Scale', itemCount: 10, constructId: 'generalized_self_efficacy' }
    ],
    resultVisualizationIds: ['self_system_gauge', 'agency_profile_cards'],
    profileContribution: {
      domains: ['self_system'],
      constructs: ['core_self_esteem', 'generalized_self_efficacy'],
      facets: 3,
      facetScoringLevel: 'INDEPENDENT_SUBSCALE_SCORES',
      visualizations: ['Self-Worth Gauge', 'Efficacy Horizon'],
      aiInsightInputs: ['Self-esteem stability', 'Efficacy-coping alignment'],
      longitudinalOutputs: ['Self-esteem fluctuation over time']
    },
    blockingIssues: [
      'GSES requires verified commercial license from Schwarzer / FU Berlin for unrestricted production SaaS deployment.',
      'RSES original English is public domain (University of Maryland); Turkish standardized wording (Çuhadaroğlu, 1986) is verified for research use.'
    ],
    rationale: 'Combines Rosenberg Self-Esteem (10 items, public domain) and General Self-Efficacy (10 items). Evaluates core self-worth and general competence expectancy with independent subscale scoring.'
  },
  {
    assessmentId: 'mod_emotion_regulation',
    titleTr: 'Duygu Düzenleme Stratejileri (ERQ)',
    titleEn: 'Emotion Regulation Strategies (ERQ)',
    stage: 'CORE',
    priority: 'P0',
    requiredForFirstProfile: true,
    requiredForComprehensiveProfile: true,
    constructIdsCovered: ['cognitive_reappraisal', 'expressive_suppression'],
    facetIdsCovered: ['reappraisal_tendency', 'suppression_tendency'],
    facetMeasurementCapability: 'FULL_INDEPENDENT_SUBSCALE_SCORES',
    instrumentCandidates: ['inst_erq', 'inst_ders'],
    selectedInstrumentId: 'inst_erq',
    selectedInstrumentStatus: 'READY_BUT_NOT_PUBLISHED',
    questionCountPlanned: 10,
    estimatedMinutes: 2.5,
    scoringModel: 'PRE_CALIBRATION_MEAN_V1',
    publicationReadiness: 'READY_BUT_NOT_PUBLISHED',
    turkishEvidenceStatus: 'EMPIRICAL_ADAPTATION_VALIDATED',
    licensingStatus: 'RESEARCH_ONLY',
    exactWordingProvenanceStatus: 'RESEARCH_DRAFT',
    commercialUseStatus: 'REQUIRES_EXPLICIT_PERMISSION',
    responseFormat: 'LIKERT_7',
    reverseKeying: {
      hasReverseItems: false,
      reverseItemCount: 0,
      reverseScoringRule: 'NONE'
    },
    subscales: [
      { code: 'CR', nameTr: 'Bilişsel Yeniden Değerlendirme', nameEn: 'Cognitive Reappraisal', itemCount: 6, constructId: 'cognitive_reappraisal' },
      { code: 'ES', nameTr: 'Duygusal Bastırma', nameEn: 'Expressive Suppression', itemCount: 4, constructId: 'expressive_suppression' }
    ],
    resultVisualizationIds: ['emotion_regulation_quadrant', 'regulation_balance_bars'],
    profileContribution: {
      domains: ['emotion_regulation'],
      constructs: ['cognitive_reappraisal', 'expressive_suppression'],
      facets: 2,
      facetScoringLevel: 'INDEPENDENT_SUBSCALE_SCORES',
      visualizations: ['ERQ Quadrant', 'Regulation Strategy Split'],
      aiInsightInputs: ['Suppression vs reappraisal ratio', 'Affect modulation capacity'],
      longitudinalOutputs: ['Stress-induced regulation shifts']
    },
    blockingIssues: [
      'ERQ is open for academic research; commercial SaaS usage requires publisher / author written permission.'
    ],
    rationale: 'Standard 10-item instrument cleanly differentiating antecedent-focused cognitive reappraisal from response-focused expressive suppression.'
  },
  {
    assessmentId: 'mod_cognitive_epistemic',
    titleTr: 'Bilişsel ve Epistemik Yönelim (NFC-SF)',
    titleEn: 'Cognitive & Epistemic Orientation (NFC-SF)',
    stage: 'CORE',
    priority: 'P0',
    requiredForFirstProfile: true,
    requiredForComprehensiveProfile: true,
    constructIdsCovered: ['epistemic_drive'],
    facetIdsCovered: ['need_for_cognition', 'need_for_cognitive_closure'],
    facetMeasurementCapability: 'UNIDIMENSIONAL_TOTAL_SCORE',
    instrumentCandidates: ['inst_nfc_sf', 'inst_nfcs_sf'],
    selectedInstrumentId: 'inst_nfc_sf',
    selectedInstrumentStatus: 'READY_BUT_NOT_PUBLISHED',
    questionCountPlanned: 18,
    estimatedMinutes: 4.0,
    scoringModel: 'PRE_CALIBRATION_MEAN_V1',
    publicationReadiness: 'READY_BUT_NOT_PUBLISHED',
    turkishEvidenceStatus: 'EMPIRICAL_ADAPTATION_VALIDATED',
    licensingStatus: 'RESEARCH_ONLY',
    exactWordingProvenanceStatus: 'RESEARCH_DRAFT',
    commercialUseStatus: 'REQUIRES_EXPLICIT_PERMISSION',
    responseFormat: 'LIKERT_5',
    reverseKeying: {
      hasReverseItems: true,
      reverseItemCount: 9,
      reverseScoringRule: '6 - rawValue'
    },
    subscales: [
      { code: 'NFC', nameTr: 'Biliş İhtiyacı', nameEn: 'Need for Cognition', itemCount: 18, constructId: 'epistemic_drive' }
    ],
    resultVisualizationIds: ['epistemic_drive_spectrum', 'cognitive_effort_index'],
    profileContribution: {
      domains: ['cognition_decision'],
      constructs: ['epistemic_drive'],
      facets: 2,
      facetScoringLevel: 'UNIDIMENSIONAL_SCALE_SCORE',
      visualizations: ['Epistemic Drive Gauge', 'Cognitive Engagement Score'],
      aiInsightInputs: ['Analytical vs heuristic preference', 'Intellectual curiosity depth'],
      longitudinalOutputs: ['Epistemic stamina trajectory']
    },
    blockingIssues: [
      'NFC-SF wording in Turkish requires authoritative verification against published Turkish adaptation studies.'
    ],
    rationale: 'Measures intrinsic motivation to engage in and enjoy effortful cognitive endeavors. Essential for cognitive style characterization in first meaningful profile.'
  },
  {
    assessmentId: 'mod_volition_impulse',
    titleTr: 'İrade, Özdenetim ve Dürtü Dinamikleri',
    titleEn: 'Volition, Self-Control & Impulsivity',
    stage: 'EXPANSION',
    priority: 'P0',
    requiredForFirstProfile: false,
    requiredForComprehensiveProfile: true,
    constructIdsCovered: ['volitional_stamina', 'impulsivity_uppsp'],
    facetIdsCovered: [
      'general_self_control',
      'inhibitory_discipline',
      'negative_urgency',
      'positive_urgency',
      'lack_of_premeditation',
      'lack_of_perseverance',
      'sensation_seeking'
    ],
    facetMeasurementCapability: 'FULL_INDEPENDENT_SUBSCALE_SCORES',
    instrumentCandidates: ['inst_bscs', 'inst_upps_p_sf'],
    selectedInstrumentId: 'inst_bscs',
    selectedInstrumentStatus: 'READY_BUT_NOT_PUBLISHED',
    questionCountPlanned: 33,
    estimatedMinutes: 7.0,
    scoringModel: 'PRE_CALIBRATION_MEAN_V1',
    publicationReadiness: 'READY_BUT_NOT_PUBLISHED',
    turkishEvidenceStatus: 'EMPIRICAL_ADAPTATION_VALIDATED',
    licensingStatus: 'RESEARCH_ONLY',
    exactWordingProvenanceStatus: 'RESEARCH_DRAFT',
    commercialUseStatus: 'REQUIRES_EXPLICIT_PERMISSION',
    responseFormat: 'LIKERT_5',
    reverseKeying: {
      hasReverseItems: true,
      reverseItemCount: 15,
      reverseScoringRule: '6 - rawValue'
    },
    subscales: [
      { code: 'BSCS', nameTr: 'Kısa Özdenetim Skalası', nameEn: 'Brief Self-Control Scale', itemCount: 13, constructId: 'volitional_stamina' },
      { code: 'UPPSP_NU', nameTr: 'Olumsuz Aciliyet', nameEn: 'Negative Urgency', itemCount: 4, constructId: 'impulsivity_uppsp' },
      { code: 'UPPSP_PU', nameTr: 'Olumlu Aciliyet', nameEn: 'Positive Urgency', itemCount: 4, constructId: 'impulsivity_uppsp' },
      { code: 'UPPSP_PRE', nameTr: 'Düşünmeden Hareket (Planlama Eksikliği)', nameEn: 'Lack of Premeditation', itemCount: 4, constructId: 'impulsivity_uppsp' },
      { code: 'UPPSP_PER', nameTr: 'Sebatsızlık', nameEn: 'Lack of Perseverance', itemCount: 4, constructId: 'impulsivity_uppsp' },
      { code: 'UPPSP_SS', nameTr: 'Heyecan Arayışı', nameEn: 'Sensation Seeking', itemCount: 4, constructId: 'impulsivity_uppsp' }
    ],
    resultVisualizationIds: ['volition_impulse_matrix', 'impulsivity_profile_radar'],
    profileContribution: {
      domains: ['self_regulation'],
      constructs: ['volitional_stamina', 'impulsivity_uppsp'],
      facets: 7,
      facetScoringLevel: 'INDEPENDENT_SUBSCALE_SCORES',
      visualizations: ['Self-Control Spectrum', 'UPPS-P 5-Factor Radar'],
      aiInsightInputs: ['Executive function regulation', 'Impulsive risk tendencies under stress'],
      longitudinalOutputs: ['Volitional stamina index']
    },
    blockingIssues: [
      'Commercial SaaS permission required for BSCS (Tangney) and UPPS-P Short Form (Cyders).'
    ],
    rationale: 'Combines Brief Self-Control (13 items) with the UPPS-P 5-factor impulsivity model (20 items) for complete voluntary and reactive action regulation coverage.'
  },
  {
    assessmentId: 'mod_basic_needs_sdt',
    titleTr: 'Temel Psikolojik İhtiyaçlar (SDT)',
    titleEn: 'Basic Psychological Needs (SDT)',
    stage: 'EXPANSION',
    priority: 'P0',
    requiredForFirstProfile: false,
    requiredForComprehensiveProfile: true,
    constructIdsCovered: ['basic_psychological_needs'],
    facetIdsCovered: [
      'autonomy_satisfaction_frustration',
      'competence_satisfaction_frustration',
      'relatedness_satisfaction_frustration'
    ],
    facetMeasurementCapability: 'FULL_INDEPENDENT_SUBSCALE_SCORES',
    instrumentCandidates: ['inst_bpnsfs'],
    selectedInstrumentId: 'inst_bpnsfs',
    selectedInstrumentStatus: 'READY_BUT_NOT_PUBLISHED',
    questionCountPlanned: 24,
    estimatedMinutes: 5.0,
    scoringModel: 'PRE_CALIBRATION_MEAN_V1',
    publicationReadiness: 'READY_BUT_NOT_PUBLISHED',
    turkishEvidenceStatus: 'EMPIRICAL_ADAPTATION_VALIDATED',
    licensingStatus: 'RESEARCH_ONLY',
    exactWordingProvenanceStatus: 'RESEARCH_DRAFT',
    commercialUseStatus: 'REQUIRES_EXPLICIT_PERMISSION',
    responseFormat: 'LIKERT_5',
    reverseKeying: {
      hasReverseItems: true,
      reverseItemCount: 12,
      reverseScoringRule: '6 - rawValue'
    },
    subscales: [
      { code: 'AUT_SAT', nameTr: 'Özerklik Doyumu', nameEn: 'Autonomy Satisfaction', itemCount: 4, constructId: 'basic_psychological_needs' },
      { code: 'AUT_FRU', nameTr: 'Özerklik Engellenmesi', nameEn: 'Autonomy Frustration', itemCount: 4, constructId: 'basic_psychological_needs' },
      { code: 'COM_SAT', nameTr: 'Yetkinlik Doyumu', nameEn: 'Competence Satisfaction', itemCount: 4, constructId: 'basic_psychological_needs' },
      { code: 'COM_FRU', nameTr: 'Yetkinlik Engellenmesi', nameEn: 'Competence Frustration', itemCount: 4, constructId: 'basic_psychological_needs' },
      { code: 'REL_SAT', nameTr: 'İlişkililik Doyumu', nameEn: 'Relatedness Satisfaction', itemCount: 4, constructId: 'basic_psychological_needs' },
      { code: 'REL_FRU', nameTr: 'İlişkililik Engellenmesi', nameEn: 'Relatedness Frustration', itemCount: 4, constructId: 'basic_psychological_needs' }
    ],
    resultVisualizationIds: ['sdt_needs_balance_chart', 'need_frustration_warnings'],
    profileContribution: {
      domains: ['motivation_values'],
      constructs: ['basic_psychological_needs'],
      facets: 3,
      facetScoringLevel: 'INDEPENDENT_SUBSCALE_SCORES',
      visualizations: ['SDT Triangle', 'Satisfaction vs Frustration Balance'],
      aiInsightInputs: ['Self-Determination fulfillment', 'Psychological vitality drivers'],
      longitudinalOutputs: ['Need satisfaction state tracking']
    },
    blockingIssues: [
      'BPNSFS academic free under citation; commercial SaaS usage requires formal author licensing.'
    ],
    rationale: 'Gold standard 24-item measure of autonomy, competence, and relatedness satisfaction and frustration based on Self-Determination Theory (Ryan & Deci).'
  },
  {
    assessmentId: 'mod_universal_values',
    titleTr: 'Evrensel İnsani Değerler (Schwartz)',
    titleEn: 'Universal Human Values (Schwartz)',
    stage: 'EXPANSION',
    priority: 'P0',
    requiredForFirstProfile: false,
    requiredForComprehensiveProfile: true,
    constructIdsCovered: ['universal_values'],
    facetIdsCovered: [
      'openness_to_change_values',
      'self_transcendence_values',
      'conservation_values',
      'self_enhancement_values'
    ],
    facetMeasurementCapability: 'CIRCUMPLEX_HIGHER_ORDER_QUADRANTS',
    instrumentCandidates: ['inst_pvq_rr', 'inst_pvq_21', 'inst_ipip_schwartz_values'],
    selectedInstrumentId: 'inst_pvq_rr',
    selectedInstrumentStatus: 'READY_BUT_NOT_PUBLISHED',
    questionCountPlanned: 50,
    estimatedMinutes: 10.0,
    scoringModel: 'PRE_CALIBRATION_MEAN_V1',
    publicationReadiness: 'READY_BUT_NOT_PUBLISHED',
    turkishEvidenceStatus: 'EMPIRICAL_ADAPTATION_VALIDATED',
    licensingStatus: 'REQUIRES_PERMISSION',
    exactWordingProvenanceStatus: 'RESEARCH_DRAFT',
    commercialUseStatus: 'REQUIRES_AUTHOR_PERMISSION',
    responseFormat: 'LIKERT_6',
    reverseKeying: {
      hasReverseItems: false,
      reverseItemCount: 0,
      reverseScoringRule: 'NONE'
    },
    subscales: [
      { code: 'VAL_OC', nameTr: 'Değişime Açıklık', nameEn: 'Openness to Change', itemCount: 15, constructId: 'universal_values' },
      { code: 'VAL_ST', nameTr: 'Özaşkınlık', nameEn: 'Self-Transcendence', itemCount: 10, constructId: 'universal_values' },
      { code: 'VAL_CO', nameTr: 'Muhafazacılık', nameEn: 'Conservation', itemCount: 15, constructId: 'universal_values' },
      { code: 'VAL_SE', nameTr: 'Özyükselim', nameEn: 'Self-Enhancement', itemCount: 10, constructId: 'universal_values' }
    ],
    resultVisualizationIds: ['schwartz_circumplex_radar', 'value_hierarchy_ladder'],
    profileContribution: {
      domains: ['motivation_values'],
      constructs: ['universal_values'],
      facets: 4,
      facetScoringLevel: 'CIRCUMPLEX_4_QUADRANT_SCORES',
      visualizations: ['Schwartz Circumplex', 'Value Hierarchy Chart'],
      aiInsightInputs: ['Core motivational drivers', 'Value-behavior incongruence'],
      longitudinalOutputs: ['Value stability metrics']
    },
    blockingIssues: [
      'Canonical Schwartz values instruments (PVQ-RR / PVQ-21 / SVS) require formal author licensing for commercial SaaS platform use.',
      'IPIP preliminary item markers lack independent peer-reviewed Turkish standardization.'
    ],
    rationale: 'Measures Schwartz 10 basic values aggregated across 4 higher-order quadrants (Openness to Change, Self-Transcendence, Conservation, Self-Enhancement).'
  },
  {
    assessmentId: 'mod_relational_attachment_empathy',
    titleTr: 'İlişkisel Bağlanma ve Empati',
    titleEn: 'Relational Attachment & Empathy',
    stage: 'EXPANSION',
    priority: 'P0',
    requiredForFirstProfile: false,
    requiredForComprehensiveProfile: true,
    constructIdsCovered: ['attachment_system', 'multidimensional_empathy'],
    facetIdsCovered: [
      'attachment_anxiety',
      'attachment_avoidance',
      'cognitive_perspective_taking',
      'empathic_concern'
    ],
    facetMeasurementCapability: 'FULL_INDEPENDENT_SUBSCALE_SCORES',
    instrumentCandidates: ['inst_ecr_r', 'inst_iri'],
    selectedInstrumentId: 'inst_ecr_r',
    selectedInstrumentStatus: 'READY_BUT_NOT_PUBLISHED',
    questionCountPlanned: 50,
    estimatedMinutes: 10.0,
    scoringModel: 'PRE_CALIBRATION_MEAN_V1',
    publicationReadiness: 'READY_BUT_NOT_PUBLISHED',
    turkishEvidenceStatus: 'EMPIRICAL_ADAPTATION_VALIDATED',
    licensingStatus: 'RESEARCH_ONLY',
    exactWordingProvenanceStatus: 'RESEARCH_DRAFT',
    commercialUseStatus: 'REQUIRES_EXPLICIT_PERMISSION',
    responseFormat: 'LIKERT_7_AND_5',
    reverseKeying: {
      hasReverseItems: true,
      reverseItemCount: 18,
      reverseScoringRule: 'Scale dependent'
    },
    subscales: [
      { code: 'ECR_ANX', nameTr: 'Bağlanma Kaygısı', nameEn: 'Attachment Anxiety', itemCount: 18, constructId: 'attachment_system' },
      { code: 'ECR_AVO', nameTr: 'Bağlanma Kaçınması', nameEn: 'Attachment Avoidance', itemCount: 18, constructId: 'attachment_system' },
      { code: 'IRI_PT', nameTr: 'Perspektif Alma', nameEn: 'Perspective Taking', itemCount: 7, constructId: 'multidimensional_empathy' },
      { code: 'IRI_EC', nameTr: 'Empatik İlgi', nameEn: 'Empathic Concern', itemCount: 7, constructId: 'multidimensional_empathy' }
    ],
    resultVisualizationIds: ['attachment_2d_grid', 'empathy_profile_bars'],
    profileContribution: {
      domains: ['social_relational'],
      constructs: ['attachment_system', 'multidimensional_empathy'],
      facets: 4,
      facetScoringLevel: 'INDEPENDENT_SUBSCALE_SCORES',
      visualizations: ['Attachment 4-Quadrant Map (Bartholomew)', 'Empathy Horizon'],
      aiInsightInputs: ['Attachment security style (Secure, Preoccupied, Dismissing, Fearful)', 'Relational vulnerability dynamics'],
      longitudinalOutputs: ['Relational security index']
    },
    blockingIssues: [
      'ECR-R and IRI are open for academic research; commercial SaaS validation required.'
    ],
    rationale: 'Combines ECR-R (36 items: 18 anxiety, 18 avoidance) with IRI cognitive and affective empathy subscales (14 items) for comprehensive relational dynamics.'
  },
  {
    assessmentId: 'mod_cognitive_adaptability',
    titleTr: 'Bilişsel Esneklik ve Belirsizlik Yönetimi',
    titleEn: 'Cognitive Adaptability & Uncertainty Management',
    stage: 'EXPANSION',
    priority: 'P1',
    requiredForFirstProfile: false,
    requiredForComprehensiveProfile: true,
    constructIdsCovered: ['cognitive_adaptability', 'thinking_styles'],
    facetIdsCovered: [
      'cognitive_flexibility_alternatives',
      'cognitive_flexibility_control',
      'intolerance_of_uncertainty'
    ],
    facetMeasurementCapability: 'FULL_INDEPENDENT_SUBSCALE_SCORES',
    instrumentCandidates: ['inst_cfi', 'inst_ius_12', 'inst_rei_40'],
    selectedInstrumentId: 'inst_cfi',
    selectedInstrumentStatus: 'READY_BUT_NOT_PUBLISHED',
    questionCountPlanned: 32,
    estimatedMinutes: 7.0,
    scoringModel: 'PRE_CALIBRATION_MEAN_V1',
    publicationReadiness: 'READY_BUT_NOT_PUBLISHED',
    turkishEvidenceStatus: 'EMPIRICAL_ADAPTATION_VALIDATED',
    licensingStatus: 'RESEARCH_ONLY',
    exactWordingProvenanceStatus: 'RESEARCH_DRAFT',
    commercialUseStatus: 'REQUIRES_EXPLICIT_PERMISSION',
    responseFormat: 'LIKERT_5',
    reverseKeying: {
      hasReverseItems: true,
      reverseItemCount: 10,
      reverseScoringRule: '6 - rawValue'
    },
    subscales: [
      { code: 'CFI_ALT', nameTr: 'Alternatif Üretme', nameEn: 'Alternatives Subscale', itemCount: 13, constructId: 'cognitive_adaptability' },
      { code: 'CFI_CTRL', nameTr: 'Denetim Algısı', nameEn: 'Control Subscale', itemCount: 7, constructId: 'cognitive_adaptability' },
      { code: 'IUS_12', nameTr: 'Belirsizliğe Tahammülsüzlük', nameEn: 'Intolerance of Uncertainty', itemCount: 12, constructId: 'cognitive_adaptability' }
    ],
    resultVisualizationIds: ['cognitive_adaptability_gauge', 'uncertainty_tolerance_meter'],
    profileContribution: {
      domains: ['cognition_decision'],
      constructs: ['cognitive_adaptability', 'thinking_styles'],
      facets: 3,
      facetScoringLevel: 'INDEPENDENT_SUBSCALE_SCORES',
      visualizations: ['Adaptability Matrix', 'Ambiguity Resilience Index'],
      aiInsightInputs: ['Problem-solving flexibility under ambiguity'],
      longitudinalOutputs: ['Adaptive problem solving trajectories']
    },
    blockingIssues: [
      'Commercial SaaS terms verification needed for CFI (Dennis) and IUS-12 (Carleton).'
    ],
    rationale: 'Measures alternative perspective generation, control perception, and emotional tolerance of ambiguous situations (20 items CFI + 12 items IUS-12).'
  },
  {
    assessmentId: 'mod_meaning_compassion_grit',
    titleTr: 'Varoluşsal Anlam, Öz-Şefkat ve Azim',
    titleEn: 'Existential Meaning, Self-Compassion & Grit',
    stage: 'EXPANSION',
    priority: 'P1',
    requiredForFirstProfile: false,
    requiredForComprehensiveProfile: true,
    constructIdsCovered: ['existential_meaning', 'self_compassion', 'volitional_stamina'],
    facetIdsCovered: [
      'presence_of_meaning',
      'search_for_meaning',
      'self_compassion_composite',
      'long_term_grit'
    ],
    facetMeasurementCapability: 'FULL_INDEPENDENT_SUBSCALE_SCORES',
    instrumentCandidates: ['inst_mlq', 'inst_scs_sf', 'inst_grit_s'],
    selectedInstrumentId: 'inst_mlq',
    selectedInstrumentStatus: 'READY_BUT_NOT_PUBLISHED',
    questionCountPlanned: 30,
    estimatedMinutes: 6.0,
    scoringModel: 'PRE_CALIBRATION_MEAN_V1',
    publicationReadiness: 'READY_BUT_NOT_PUBLISHED',
    turkishEvidenceStatus: 'EMPIRICAL_ADAPTATION_VALIDATED',
    licensingStatus: 'RESEARCH_ONLY',
    exactWordingProvenanceStatus: 'RESEARCH_DRAFT',
    commercialUseStatus: 'REQUIRES_EXPLICIT_PERMISSION',
    responseFormat: 'LIKERT_5_AND_7',
    reverseKeying: {
      hasReverseItems: true,
      reverseItemCount: 11,
      reverseScoringRule: 'Scale dependent'
    },
    subscales: [
      { code: 'MLQ_PRES', nameTr: 'Anlam Varlığı', nameEn: 'Presence of Meaning', itemCount: 5, constructId: 'existential_meaning' },
      { code: 'MLQ_SRCH', nameTr: 'Anlam Arayışı', nameEn: 'Search for Meaning', itemCount: 5, constructId: 'existential_meaning' },
      { code: 'SCS_SF', nameTr: 'Kısa Öz-Şefkat Skalası', nameEn: 'Self-Compassion Scale (SF)', itemCount: 12, constructId: 'self_compassion' },
      { code: 'GRIT_S', nameTr: 'Kısa Azim Skalası', nameEn: 'Short Grit Scale', itemCount: 8, constructId: 'volitional_stamina' }
    ],
    resultVisualizationIds: ['meaning_compassion_grid', 'grit_perseverance_dial'],
    profileContribution: {
      domains: ['motivation_values', 'self_system', 'self_regulation'],
      constructs: ['existential_meaning', 'self_compassion', 'volitional_stamina'],
      facets: 4,
      facetScoringLevel: 'INDEPENDENT_SUBSCALE_SCORES',
      visualizations: ['Meaning Matrix (Frankl Lens)', 'Self-Compassion Compass', 'Grit Score'],
      aiInsightInputs: ['Existential fulfillment vs crisis dynamics', 'Self-criticism vs self-kindness balance'],
      longitudinalOutputs: ['Existential coherence over life transitions']
    },
    blockingIssues: [
      'MLQ (Steger), SCS-SF (Neff), and Grit-S (Duckworth) require commercial product licensing confirmation.'
    ],
    rationale: 'Triangulates existential purpose (MLQ: 10 items), emotional self-resilience (SCS-SF: 12 items), and multi-year passion/perseverance (Grit-S: 8 items).'
  },
  {
    assessmentId: 'mod_conflict_boundaries',
    titleTr: 'Çatışma Çözme Yönelimleri ve Sınırlar',
    titleEn: 'Conflict Resolution Styles & Boundaries',
    stage: 'EXPANSION',
    priority: 'P1',
    requiredForFirstProfile: false,
    requiredForComprehensiveProfile: true,
    constructIdsCovered: ['conflict_styles', 'social_agency_boundaries'],
    facetIdsCovered: [
      'conflict_problem_solving',
      'conflict_yielding_avoiding',
      'interpersonal_boundary_clarity'
    ],
    facetMeasurementCapability: 'FULL_INDEPENDENT_SUBSCALE_SCORES',
    instrumentCandidates: ['inst_dutch', 'inst_tki'],
    selectedInstrumentId: 'inst_dutch',
    selectedInstrumentStatus: 'READY_BUT_NOT_PUBLISHED',
    questionCountPlanned: 20,
    estimatedMinutes: 4.5,
    scoringModel: 'PRE_CALIBRATION_MEAN_V1',
    publicationReadiness: 'READY_BUT_NOT_PUBLISHED',
    turkishEvidenceStatus: 'EMPIRICAL_ADAPTATION_VALIDATED',
    licensingStatus: 'RESEARCH_ONLY',
    exactWordingProvenanceStatus: 'RESEARCH_DRAFT',
    commercialUseStatus: 'REQUIRES_EXPLICIT_PERMISSION',
    responseFormat: 'LIKERT_5',
    reverseKeying: {
      hasReverseItems: false,
      reverseItemCount: 0,
      reverseScoringRule: 'NONE'
    },
    subscales: [
      { code: 'DUTCH_PS', nameTr: 'Problem Çözme / İşbirliği', nameEn: 'Problem Solving', itemCount: 4, constructId: 'conflict_styles' },
      { code: 'DUTCH_FC', nameTr: 'Dayatma / Güç Kullanma', nameEn: 'Forcing', itemCount: 4, constructId: 'conflict_styles' },
      { code: 'DUTCH_YD', nameTr: 'Uyum Sağlama / Alttan Alma', nameEn: 'Yielding', itemCount: 4, constructId: 'conflict_styles' },
      { code: 'DUTCH_AV', nameTr: 'Kaçınma', nameEn: 'Avoiding', itemCount: 4, constructId: 'conflict_styles' },
      { code: 'DUTCH_CP', nameTr: 'Uzlaşma', nameEn: 'Compromising', itemCount: 4, constructId: 'conflict_styles' }
    ],
    resultVisualizationIds: ['conflict_style_pentagon', 'boundary_profile_bars'],
    profileContribution: {
      domains: ['social_relational'],
      constructs: ['conflict_styles', 'social_agency_boundaries'],
      facets: 3,
      facetScoringLevel: 'INDEPENDENT_SUBSCALE_SCORES',
      visualizations: ['Conflict Style Pentagon', 'Interpersonal Boundary Strength'],
      aiInsightInputs: ['Assertiveness vs accommodation balance', 'Conflict de-escalation strategies'],
      longitudinalOutputs: ['Interpersonal conflict adaptability']
    },
    blockingIssues: [
      'DUTCH test is academic open with citation; commercial deployment verification pending.'
    ],
    rationale: 'DUTCH 20-item package (De Dreu et al.) provides scientifically superior 5-mode conflict handling without proprietary TKI legal restrictions.'
  },
  {
    assessmentId: 'mod_affective_distress',
    titleTr: 'Duygulanım Dengesi ve Sıkıntı Toleransı',
    titleEn: 'Affective Tone & Distress Tolerance',
    stage: 'EXPANSION',
    priority: 'P0',
    requiredForFirstProfile: false,
    requiredForComprehensiveProfile: true,
    constructIdsCovered: ['affective_tone', 'distress_tolerance'],
    facetIdsCovered: [
      'positive_affect_trait',
      'negative_affect_trait',
      'affect_balance',
      'distress_tolerance_absorption',
      'distress_tolerance_regulation'
    ],
    facetMeasurementCapability: 'FULL_INDEPENDENT_SUBSCALE_SCORES',
    instrumentCandidates: ['inst_panas', 'inst_dts'],
    selectedInstrumentId: 'inst_panas',
    selectedInstrumentStatus: 'READY_BUT_NOT_PUBLISHED',
    questionCountPlanned: 35,
    estimatedMinutes: 7.5,
    scoringModel: 'PRE_CALIBRATION_MEAN_V1',
    publicationReadiness: 'READY_BUT_NOT_PUBLISHED',
    turkishEvidenceStatus: 'EMPIRICAL_ADAPTATION_VALIDATED',
    licensingStatus: 'RESEARCH_ONLY',
    exactWordingProvenanceStatus: 'RESEARCH_DRAFT',
    commercialUseStatus: 'REQUIRES_EXPLICIT_PERMISSION',
    responseFormat: 'LIKERT_5',
    reverseKeying: {
      hasReverseItems: true,
      reverseItemCount: 8,
      reverseScoringRule: '6 - rawValue'
    },
    subscales: [
      { code: 'PANAS_PA', nameTr: 'Olumlu Duygulanım', nameEn: 'Positive Affect', itemCount: 10, constructId: 'affective_tone' },
      { code: 'PANAS_NA', nameTr: 'Olumsuz Duygulanım', nameEn: 'Negative Affect', itemCount: 10, constructId: 'affective_tone' },
      { code: 'DTS', nameTr: 'Sıkıntıya Tahammül Skalası', nameEn: 'Distress Tolerance Scale', itemCount: 15, constructId: 'distress_tolerance' }
    ],
    resultVisualizationIds: ['panas_affect_balance_meter', 'distress_tolerance_spectrum'],
    profileContribution: {
      domains: ['emotion_regulation'],
      constructs: ['affective_tone', 'distress_tolerance'],
      facets: 5,
      facetScoringLevel: 'INDEPENDENT_SUBSCALE_SCORES',
      visualizations: ['PANAS Balance Meter', 'Distress Tolerance Thermometer'],
      aiInsightInputs: ['Affective baseline balance', 'Emotional distress threshold'],
      longitudinalOutputs: ['Affective volatility tracking']
    },
    blockingIssues: [
      'PANAS (APA) and DTS (Simons & Gaher) require commercial reproduction permissions.'
    ],
    rationale: 'Measures trait emotional experience (PANAS: 20 items) and capacity to tolerate negative emotional states (DTS: 15 items).'
  },
  {
    assessmentId: 'mod_dark_tetrad_advanced',
    titleTr: 'Subklinik Kişilik Dinamikleri (SD4)',
    titleEn: 'Subclinical Personality Dynamics (SD4)',
    stage: 'ADVANCED',
    priority: 'P2',
    requiredForFirstProfile: false,
    requiredForComprehensiveProfile: false,
    constructIdsCovered: ['dark_tetrad_traits'],
    facetIdsCovered: [
      'machiavellianism_subclinical',
      'grandiose_narcissism_subclinical',
      'psychopathy_subclinical',
      'everyday_sadism_subclinical'
    ],
    facetMeasurementCapability: 'FULL_INDEPENDENT_SUBSCALE_SCORES',
    instrumentCandidates: ['inst_sd4'],
    selectedInstrumentId: 'inst_sd4',
    selectedInstrumentStatus: 'RESEARCH_ONLY',
    questionCountPlanned: 28,
    estimatedMinutes: 6.0,
    scoringModel: 'PRE_CALIBRATION_MEAN_V1',
    publicationReadiness: 'RESEARCH_ONLY',
    turkishEvidenceStatus: 'EMPIRICAL_ADAPTATION_VALIDATED',
    licensingStatus: 'RESEARCH_ONLY',
    exactWordingProvenanceStatus: 'RESEARCH_DRAFT',
    commercialUseStatus: 'NON_COMMERCIAL_RESEARCH_ONLY',
    responseFormat: 'LIKERT_5',
    reverseKeying: {
      hasReverseItems: true,
      reverseItemCount: 6,
      reverseScoringRule: '6 - rawValue'
    },
    subscales: [
      { code: 'SD4_MACH', nameTr: 'Makyavelizm', nameEn: 'Machiavellianism', itemCount: 7, constructId: 'dark_tetrad_traits' },
      { code: 'SD4_NARC', nameTr: 'Narsisizm', nameEn: 'Narcissism', itemCount: 7, constructId: 'dark_tetrad_traits' },
      { code: 'SD4_PSYC', nameTr: 'Psikopati', nameEn: 'Psychopathy', itemCount: 7, constructId: 'dark_tetrad_traits' },
      { code: 'SD4_SDSM', nameTr: 'Gündelik Sadizm', nameEn: 'Everyday Sadism', itemCount: 7, constructId: 'dark_tetrad_traits' }
    ],
    resultVisualizationIds: ['dark_tetrad_radar', 'interpersonal_risk_gauge'],
    profileContribution: {
      domains: ['optional_dark_tetrad'],
      constructs: ['dark_tetrad_traits'],
      facets: 4,
      facetScoringLevel: 'INDEPENDENT_SUBSCALE_SCORES',
      visualizations: ['Dark Tetrad 4-Factor Radar'],
      aiInsightInputs: ['Subclinical interpersonal dynamics'],
      longitudinalOutputs: ['Subclinical trait stability']
    },
    blockingIssues: [
      'Strictly non-clinical research module. Excluded from default consumer journey; available only via explicit opt-in advanced research setting.'
    ],
    rationale: '28-item validated scale for subclinical personality traits (Paulhus et al. 2021). Strict non-clinical framing ensures absolute consumer safety.'
  }
];

fs.writeFileSync(
  path.resolve(dataDir, 'assessment-architecture.json'),
  JSON.stringify(assessmentModules, null, 2),
  'utf8'
);
console.log('✅ Generated assessment-architecture.json (13 modules)');

// -----------------------------------------------------------------------------
// 2. CONSTRUCT TO INSTRUMENT MAP (construct-to-instrument-map.json)
// -----------------------------------------------------------------------------
const allMasterConstructs: any[] = [];
proposedMasterModel.domains.forEach((dom: any) => {
  (dom.constructs || []).forEach((c: any) => {
    allMasterConstructs.push({
      domainId: dom.domainId,
      ...c
    });
  });
});

const constructInstrumentMapping = allMasterConstructs.map((c: any) => {
  const cId = c.constructId;

  // HEXACO Domain Constructs
  if (cId.startsWith('hexaco_')) {
    return {
      constructId: cId,
      constructNameTr: c.nameTr,
      measurementMode: 'DIRECT_PSYCHOMETRIC_ITEM_BANK',
      preferredInstrumentCandidates: ['inst_hexaco_60', 'inst_ipip_hexaco'],
      selectedInstrument: 'inst_hexaco_60',
      selectionRationale: 'Official HEXACO-60 short form (Ashton & Lee, 2009) measuring 6 broad factors (10 items/factor). Research bank alternative is 240-item IPIP-HEXACO.',
      alternativeInstruments: ['inst_ipip_hexaco', 'inst_hexaco_pi_r'],
      instrumentCoverage: 'BROAD_FACTOR_PRIMARY_FACET_CONTENT_SAMPLED',
      facetCoverage: (c.facets || []).length,
      questionCount: 10,
      turkishEvidence: 'LEXICAL_AND_ADAPTATION_EVIDENCE',
      licensing: 'REQUIRES_PERMISSION',
      commercialRights: 'REQUIRES_AUTHOR_PERMISSION',
      exactItemProvenance: 'RESEARCH_DRAFT_PENDING_AUTHOR_VERIFICATION',
      scoringAvailability: 'PRE_CALIBRATION_MEAN_IMPLEMENTED',
      currentImplementationStatus: 'FORM_V1_SEED_COMPLIANT',
      readiness: 'READY_BUT_NOT_PUBLISHED',
      gapType: 'COMMERCIAL_RIGHTS_UNKNOWN'
    };
  }

  // Self System Constructs
  if (cId === 'core_self_esteem') {
    return {
      constructId: cId,
      constructNameTr: c.nameTr,
      measurementMode: 'DIRECT_PSYCHOMETRIC_ITEM_BANK',
      preferredInstrumentCandidates: ['inst_rses'],
      selectedInstrument: 'inst_rses',
      selectionRationale: 'Rosenberg Self-Esteem Scale (10 items). University of Maryland confirms public domain status of original English; standard Turkish adaptation (Çuhadaroğlu, 1986).',
      alternativeInstruments: [],
      instrumentCoverage: 'FULL_CONSTRUCT_AND_FACETS',
      facetCoverage: (c.facets || []).length,
      questionCount: 10,
      turkishEvidence: 'VALIDATED_DIRECT',
      licensing: 'APPROVED_FOR_PRODUCT',
      commercialRights: 'VERIFIED_COMMERCIAL_PERMITTED',
      exactItemProvenance: 'VERIFIED_ACADEMIC_ADAPTATION',
      scoringAvailability: 'PRE_CALIBRATION_MEAN_IMPLEMENTED',
      currentImplementationStatus: 'FORM_SPECIFIED',
      readiness: 'READY_FOR_PRODUCT_REVIEW',
      gapType: 'NONE'
    };
  }

  if (cId === 'generalized_self_efficacy') {
    return {
      constructId: cId,
      constructNameTr: c.nameTr,
      measurementMode: 'DIRECT_PSYCHOMETRIC_ITEM_BANK',
      preferredInstrumentCandidates: ['inst_gses'],
      selectedInstrument: 'inst_gses',
      selectionRationale: 'Schwarzer & Jerusalem General Self-Efficacy Scale (10 items). Robust coping competence measure.',
      alternativeInstruments: [],
      instrumentCoverage: 'FULL_CONSTRUCT_AND_FACETS',
      facetCoverage: (c.facets || []).length,
      questionCount: 10,
      turkishEvidence: 'VALIDATED_DIRECT',
      licensing: 'REQUIRES_PERMISSION',
      commercialRights: 'COMMERCIAL_LICENSE_REQUIRED',
      exactItemProvenance: 'RESEARCH_DRAFT_VERIFICATION_PENDING',
      scoringAvailability: 'PRE_CALIBRATION_MEAN_IMPLEMENTED',
      currentImplementationStatus: 'FORM_SPECIFIED',
      readiness: 'READY_BUT_NOT_PUBLISHED',
      gapType: 'COMMERCIAL_RIGHTS_UNKNOWN'
    };
  }

  if (cId === 'self_compassion') {
    return {
      constructId: cId,
      constructNameTr: c.nameTr,
      measurementMode: 'DIRECT_PSYCHOMETRIC_ITEM_BANK',
      preferredInstrumentCandidates: ['inst_scs_sf'],
      selectedInstrument: 'inst_scs_sf',
      selectionRationale: 'Self-Compassion Scale Short Form (12 items, Raes & Neff). Measures self-kindness vs self-judgment.',
      alternativeInstruments: [],
      instrumentCoverage: 'FULL_CONSTRUCT_AND_FACETS',
      facetCoverage: (c.facets || []).length,
      questionCount: 12,
      turkishEvidence: 'VALIDATED_DIRECT',
      licensing: 'REQUIRES_PERMISSION',
      commercialRights: 'ACADEMIC_FREE_COMMERCIAL_PENDING',
      exactItemProvenance: 'RESEARCH_DRAFT_VERIFICATION_PENDING',
      scoringAvailability: 'PRE_CALIBRATION_MEAN_IMPLEMENTED',
      currentImplementationStatus: 'FORM_SPECIFIED',
      readiness: 'READY_BUT_NOT_PUBLISHED',
      gapType: 'COMMERCIAL_RIGHTS_UNKNOWN'
    };
  }

  if (cId === 'self_concept_clarity') {
    return {
      constructId: cId,
      constructNameTr: c.nameTr,
      measurementMode: 'DIRECT_PSYCHOMETRIC_ITEM_BANK',
      preferredInstrumentCandidates: ['inst_sccs'],
      selectedInstrument: 'inst_sccs',
      selectionRationale: 'Self-Concept Clarity Scale (12 items, Campbell et al.). Structural certainty and consistency of self-beliefs.',
      alternativeInstruments: [],
      instrumentCoverage: 'FULL_CONSTRUCT_AND_FACETS',
      facetCoverage: (c.facets || []).length,
      questionCount: 12,
      turkishEvidence: 'VALIDATED_DIRECT',
      licensing: 'REQUIRES_PERMISSION',
      commercialRights: 'COMMERCIAL_LICENSE_REQUIRED',
      exactItemProvenance: 'RESEARCH_DRAFT_VERIFICATION_PENDING',
      scoringAvailability: 'PRE_CALIBRATION_MEAN_IMPLEMENTED',
      currentImplementationStatus: 'FORM_SPECIFIED',
      readiness: 'READY_BUT_NOT_PUBLISHED',
      gapType: 'COMMERCIAL_RIGHTS_UNKNOWN'
    };
  }

  if (cId === 'locus_of_control' || cId === 'authenticity') {
    return {
      constructId: cId,
      constructNameTr: c.nameTr,
      measurementMode: 'DIRECT_PSYCHOMETRIC_ITEM_BANK',
      preferredInstrumentCandidates: [],
      selectedInstrument: null,
      selectionRationale: 'PsycheAI native research form required to measure internal vs external locus and authentic living without proprietary barriers.',
      alternativeInstruments: [],
      instrumentCoverage: 'NEEDS_FORM_DEVELOPMENT',
      facetCoverage: (c.facets || []).length,
      questionCount: 8,
      turkishEvidence: 'NEEDS_EMPIRICAL_EVALUATION',
      licensing: 'UNKNOWN',
      commercialRights: 'UNKNOWN',
      exactItemProvenance: 'MISSING',
      scoringAvailability: 'PENDING_ITEM_AUTHORING',
      currentImplementationStatus: 'RESEARCH_ROADMAP_SPECIFIED',
      readiness: 'RESEARCH_FORM_REQUIRED',
      gapType: 'RESEARCH_FORM_REQUIRED'
    };
  }

  // Emotion Regulation Constructs
  if (cId === 'cognitive_reappraisal' || cId === 'expressive_suppression') {
    return {
      constructId: cId,
      constructNameTr: c.nameTr,
      measurementMode: 'DIRECT_PSYCHOMETRIC_ITEM_BANK',
      preferredInstrumentCandidates: ['inst_erq'],
      selectedInstrument: 'inst_erq',
      selectionRationale: 'Gross & John Emotion Regulation Questionnaire (10 items total: 6 reappraisal, 4 suppression).',
      alternativeInstruments: ['inst_ders'],
      instrumentCoverage: 'FULL_CONSTRUCT_AND_FACETS',
      facetCoverage: (c.facets || []).length,
      questionCount: cId === 'cognitive_reappraisal' ? 6 : 4,
      turkishEvidence: 'VALIDATED_DIRECT',
      licensing: 'REQUIRES_PERMISSION',
      commercialRights: 'ACADEMIC_FREE_COMMERCIAL_PENDING',
      exactItemProvenance: 'RESEARCH_DRAFT_VERIFICATION_PENDING',
      scoringAvailability: 'PRE_CALIBRATION_MEAN_IMPLEMENTED',
      currentImplementationStatus: 'FORM_SPECIFIED',
      readiness: 'READY_BUT_NOT_PUBLISHED',
      gapType: 'COMMERCIAL_RIGHTS_UNKNOWN'
    };
  }

  if (cId === 'affective_tone') {
    return {
      constructId: cId,
      constructNameTr: c.nameTr,
      measurementMode: 'DIRECT_PSYCHOMETRIC_ITEM_BANK',
      preferredInstrumentCandidates: ['inst_panas'],
      selectedInstrument: 'inst_panas',
      selectionRationale: 'PANAS 20-item mood & trait affect schedule (10 positive, 10 negative affect descriptors).',
      alternativeInstruments: [],
      instrumentCoverage: 'FULL_CONSTRUCT_AND_FACETS',
      facetCoverage: (c.facets || []).length,
      questionCount: 20,
      turkishEvidence: 'VALIDATED_DIRECT',
      licensing: 'REQUIRES_PERMISSION',
      commercialRights: 'COMMERCIAL_LICENSE_REQUIRED',
      exactItemProvenance: 'RESEARCH_DRAFT_VERIFICATION_PENDING',
      scoringAvailability: 'PRE_CALIBRATION_MEAN_IMPLEMENTED',
      currentImplementationStatus: 'FORM_SPECIFIED',
      readiness: 'READY_BUT_NOT_PUBLISHED',
      gapType: 'COMMERCIAL_RIGHTS_UNKNOWN'
    };
  }

  if (cId === 'distress_tolerance') {
    return {
      constructId: cId,
      constructNameTr: c.nameTr,
      measurementMode: 'DIRECT_PSYCHOMETRIC_ITEM_BANK',
      preferredInstrumentCandidates: ['inst_dts'],
      selectedInstrument: 'inst_dts',
      selectionRationale: 'Distress Tolerance Scale (15 items, Simons & Gaher). Measures emotional absorption, regulation and tolerance.',
      alternativeInstruments: [],
      instrumentCoverage: 'FULL_CONSTRUCT_AND_FACETS',
      facetCoverage: (c.facets || []).length,
      questionCount: 15,
      turkishEvidence: 'VALIDATED_DIRECT',
      licensing: 'REQUIRES_PERMISSION',
      commercialRights: 'ACADEMIC_FREE_COMMERCIAL_PENDING',
      exactItemProvenance: 'RESEARCH_DRAFT_VERIFICATION_PENDING',
      scoringAvailability: 'PRE_CALIBRATION_MEAN_IMPLEMENTED',
      currentImplementationStatus: 'FORM_SPECIFIED',
      readiness: 'READY_BUT_NOT_PUBLISHED',
      gapType: 'COMMERCIAL_RIGHTS_UNKNOWN'
    };
  }

  if (cId === 'self_conscious_emotions') {
    return {
      constructId: cId,
      constructNameTr: c.nameTr,
      measurementMode: 'DIRECT_PSYCHOMETRIC_ITEM_BANK',
      preferredInstrumentCandidates: ['inst_tosca_3'],
      selectedInstrument: null,
      selectionRationale: 'TOSCA-3 is proprietary. Requires PsycheAI non-clinical shame/guilt proneness research scale development.',
      alternativeInstruments: [],
      instrumentCoverage: 'NEEDS_FORM_DEVELOPMENT',
      facetCoverage: (c.facets || []).length,
      questionCount: 12,
      turkishEvidence: 'NEEDS_EMPIRICAL_EVALUATION',
      licensing: 'BLOCKED_PROPRIETARY',
      commercialRights: 'REJECTED',
      exactItemProvenance: 'MISSING',
      scoringAvailability: 'PENDING_ITEM_AUTHORING',
      currentImplementationStatus: 'RESEARCH_ROADMAP_SPECIFIED',
      readiness: 'BLOCKED_LICENSE',
      gapType: 'LICENSE_BLOCKED'
    };
  }

  // Cognition & Decision Constructs
  if (cId === 'epistemic_drive') {
    return {
      constructId: cId,
      constructNameTr: c.nameTr,
      measurementMode: 'DIRECT_PSYCHOMETRIC_ITEM_BANK',
      preferredInstrumentCandidates: ['inst_nfc_sf', 'inst_nfcs_sf'],
      selectedInstrument: 'inst_nfc_sf',
      selectionRationale: 'Need for Cognition Short Form (18 items, Cacioppo et al.). Standard for cognitive engagement.',
      alternativeInstruments: ['inst_nfcs_sf'],
      instrumentCoverage: 'FULL_CONSTRUCT_AND_FACETS',
      facetCoverage: (c.facets || []).length,
      questionCount: 18,
      turkishEvidence: 'VALIDATED_DIRECT',
      licensing: 'REQUIRES_PERMISSION',
      commercialRights: 'ACADEMIC_FREE_COMMERCIAL_PENDING',
      exactItemProvenance: 'RESEARCH_DRAFT_VERIFICATION_PENDING',
      scoringAvailability: 'PRE_CALIBRATION_MEAN_IMPLEMENTED',
      currentImplementationStatus: 'FORM_SPECIFIED',
      readiness: 'READY_BUT_NOT_PUBLISHED',
      gapType: 'COMMERCIAL_RIGHTS_UNKNOWN'
    };
  }

  if (cId === 'thinking_styles') {
    return {
      constructId: cId,
      constructNameTr: c.nameTr,
      measurementMode: 'DIRECT_PSYCHOMETRIC_ITEM_BANK',
      preferredInstrumentCandidates: ['inst_rei_40'],
      selectedInstrument: 'inst_rei_40',
      selectionRationale: 'Rational-Experiential Inventory (Epstein et al.). Measures dual-process rational analytical vs intuitive experiential systems.',
      alternativeInstruments: [],
      instrumentCoverage: 'FULL_CONSTRUCT_AND_FACETS',
      facetCoverage: (c.facets || []).length,
      questionCount: 24,
      turkishEvidence: 'VALIDATED_DIRECT',
      licensing: 'REQUIRES_PERMISSION',
      commercialRights: 'ACADEMIC_FREE_COMMERCIAL_PENDING',
      exactItemProvenance: 'RESEARCH_DRAFT_VERIFICATION_PENDING',
      scoringAvailability: 'PRE_CALIBRATION_MEAN_IMPLEMENTED',
      currentImplementationStatus: 'FORM_SPECIFIED',
      readiness: 'READY_BUT_NOT_PUBLISHED',
      gapType: 'COMMERCIAL_RIGHTS_UNKNOWN'
    };
  }

  if (cId === 'cognitive_adaptability') {
    return {
      constructId: cId,
      constructNameTr: c.nameTr,
      measurementMode: 'DIRECT_PSYCHOMETRIC_ITEM_BANK',
      preferredInstrumentCandidates: ['inst_cfi', 'inst_ius_12'],
      selectedInstrument: 'inst_cfi',
      selectionRationale: 'Cognitive Flexibility Inventory (20 items) and Intolerance of Uncertainty Scale Short Form (12 items).',
      alternativeInstruments: [],
      instrumentCoverage: 'FULL_CONSTRUCT_AND_FACETS',
      facetCoverage: (c.facets || []).length,
      questionCount: 32,
      turkishEvidence: 'VALIDATED_DIRECT',
      licensing: 'REQUIRES_PERMISSION',
      commercialRights: 'ACADEMIC_FREE_COMMERCIAL_PENDING',
      exactItemProvenance: 'RESEARCH_DRAFT_VERIFICATION_PENDING',
      scoringAvailability: 'PRE_CALIBRATION_MEAN_IMPLEMENTED',
      currentImplementationStatus: 'FORM_SPECIFIED',
      readiness: 'READY_BUT_NOT_PUBLISHED',
      gapType: 'COMMERCIAL_RIGHTS_UNKNOWN'
    };
  }

  if (cId === 'decision_orientation') {
    return {
      constructId: cId,
      constructNameTr: c.nameTr,
      measurementMode: 'DIRECT_PSYCHOMETRIC_ITEM_BANK',
      preferredInstrumentCandidates: ['inst_maximization_scale'],
      selectedInstrument: 'inst_maximization_scale',
      selectionRationale: 'Schwartz Maximization Scale (13 items) measuring maximizing vs satisficing decision strategy.',
      alternativeInstruments: [],
      instrumentCoverage: 'FULL_CONSTRUCT_AND_FACETS',
      facetCoverage: (c.facets || []).length,
      questionCount: 13,
      turkishEvidence: 'VALIDATED_DIRECT',
      licensing: 'REQUIRES_PERMISSION',
      commercialRights: 'ACADEMIC_FREE_COMMERCIAL_PENDING',
      exactItemProvenance: 'RESEARCH_DRAFT_VERIFICATION_PENDING',
      scoringAvailability: 'PRE_CALIBRATION_MEAN_IMPLEMENTED',
      currentImplementationStatus: 'FORM_SPECIFIED',
      readiness: 'READY_BUT_NOT_PUBLISHED',
      gapType: 'COMMERCIAL_RIGHTS_UNKNOWN'
    };
  }

  // Self Regulation Constructs
  if (cId === 'volitional_stamina') {
    return {
      constructId: cId,
      constructNameTr: c.nameTr,
      measurementMode: 'DIRECT_PSYCHOMETRIC_ITEM_BANK',
      preferredInstrumentCandidates: ['inst_bscs', 'inst_grit_s'],
      selectedInstrument: 'inst_bscs',
      selectionRationale: 'Brief Self-Control Scale (13 items) and Short Grit Scale (8 items). Measures inhibitory control and long-term grit.',
      alternativeInstruments: [],
      instrumentCoverage: 'FULL_CONSTRUCT_AND_FACETS',
      facetCoverage: (c.facets || []).length,
      questionCount: 21,
      turkishEvidence: 'VALIDATED_DIRECT',
      licensing: 'REQUIRES_PERMISSION',
      commercialRights: 'ACADEMIC_FREE_COMMERCIAL_PENDING',
      exactItemProvenance: 'RESEARCH_DRAFT_VERIFICATION_PENDING',
      scoringAvailability: 'PRE_CALIBRATION_MEAN_IMPLEMENTED',
      currentImplementationStatus: 'FORM_SPECIFIED',
      readiness: 'READY_BUT_NOT_PUBLISHED',
      gapType: 'COMMERCIAL_RIGHTS_UNKNOWN'
    };
  }

  if (cId === 'impulsivity_uppsp') {
    return {
      constructId: cId,
      constructNameTr: c.nameTr,
      measurementMode: 'DIRECT_PSYCHOMETRIC_ITEM_BANK',
      preferredInstrumentCandidates: ['inst_upps_p_sf'],
      selectedInstrument: 'inst_upps_p_sf',
      selectionRationale: 'UPPS-P Impulsive Behavior Short Form (20 items: 5 distinct dimensions, 4 items each).',
      alternativeInstruments: [],
      instrumentCoverage: 'FULL_CONSTRUCT_AND_FACETS',
      facetCoverage: (c.facets || []).length,
      questionCount: 20,
      turkishEvidence: 'VALIDATED_DIRECT',
      licensing: 'REQUIRES_PERMISSION',
      commercialRights: 'ACADEMIC_FREE_COMMERCIAL_PENDING',
      exactItemProvenance: 'RESEARCH_DRAFT_VERIFICATION_PENDING',
      scoringAvailability: 'PRE_CALIBRATION_MEAN_IMPLEMENTED',
      currentImplementationStatus: 'FORM_SPECIFIED',
      readiness: 'READY_BUT_NOT_PUBLISHED',
      gapType: 'COMMERCIAL_RIGHTS_UNKNOWN'
    };
  }

  // Motivation & Values Constructs
  if (cId === 'basic_psychological_needs') {
    return {
      constructId: cId,
      constructNameTr: c.nameTr,
      measurementMode: 'DIRECT_PSYCHOMETRIC_ITEM_BANK',
      preferredInstrumentCandidates: ['inst_bpnsfs'],
      selectedInstrument: 'inst_bpnsfs',
      selectionRationale: 'Basic Psychological Need Satisfaction and Frustration Scale (24 items, Chen et al. 2015).',
      alternativeInstruments: [],
      instrumentCoverage: 'FULL_CONSTRUCT_AND_FACETS',
      facetCoverage: (c.facets || []).length,
      questionCount: 24,
      turkishEvidence: 'VALIDATED_DIRECT',
      licensing: 'REQUIRES_PERMISSION',
      commercialRights: 'ACADEMIC_FREE_COMMERCIAL_PENDING',
      exactItemProvenance: 'RESEARCH_DRAFT_VERIFICATION_PENDING',
      scoringAvailability: 'PRE_CALIBRATION_MEAN_IMPLEMENTED',
      currentImplementationStatus: 'FORM_SPECIFIED',
      readiness: 'READY_BUT_NOT_PUBLISHED',
      gapType: 'COMMERCIAL_RIGHTS_UNKNOWN'
    };
  }

  if (cId === 'universal_values') {
    return {
      constructId: cId,
      constructNameTr: c.nameTr,
      measurementMode: 'DIRECT_PSYCHOMETRIC_ITEM_BANK',
      preferredInstrumentCandidates: ['inst_pvq_rr', 'inst_pvq_21', 'inst_ipip_schwartz_values'],
      selectedInstrument: 'inst_pvq_rr',
      selectionRationale: 'Portrait Values Questionnaire (PVQ-RR / PVQ-21). Official operationalization of Schwartz circular continuum.',
      alternativeInstruments: ['inst_ipip_schwartz_values'],
      instrumentCoverage: 'FULL_CONSTRUCT_AND_FACETS',
      facetCoverage: (c.facets || []).length,
      questionCount: 50,
      turkishEvidence: 'EMPIRICAL_ADAPTATION_VALIDATED',
      licensing: 'REQUIRES_PERMISSION',
      commercialRights: 'REQUIRES_AUTHOR_PERMISSION',
      exactItemProvenance: 'RESEARCH_DRAFT',
      scoringAvailability: 'PRE_CALIBRATION_MEAN_IMPLEMENTED',
      currentImplementationStatus: 'FORM_SPECIFIED',
      readiness: 'READY_BUT_NOT_PUBLISHED',
      gapType: 'COMMERCIAL_RIGHTS_UNKNOWN'
    };
  }

  if (cId === 'existential_meaning') {
    return {
      constructId: cId,
      constructNameTr: c.nameTr,
      measurementMode: 'DIRECT_PSYCHOMETRIC_ITEM_BANK',
      preferredInstrumentCandidates: ['inst_mlq'],
      selectedInstrument: 'inst_mlq',
      selectionRationale: 'Meaning in Life Questionnaire (10 items: 5 presence, 5 search). Steger et al. (2006).',
      alternativeInstruments: [],
      instrumentCoverage: 'FULL_CONSTRUCT_AND_FACETS',
      facetCoverage: (c.facets || []).length,
      questionCount: 10,
      turkishEvidence: 'VALIDATED_DIRECT',
      licensing: 'REQUIRES_PERMISSION',
      commercialRights: 'ACADEMIC_FREE_COMMERCIAL_PENDING',
      exactItemProvenance: 'RESEARCH_DRAFT_VERIFICATION_PENDING',
      scoringAvailability: 'PRE_CALIBRATION_MEAN_IMPLEMENTED',
      currentImplementationStatus: 'FORM_SPECIFIED',
      readiness: 'READY_BUT_NOT_PUBLISHED',
      gapType: 'COMMERCIAL_RIGHTS_UNKNOWN'
    };
  }

  // Social & Relational Constructs
  if (cId === 'attachment_system') {
    return {
      constructId: cId,
      constructNameTr: c.nameTr,
      measurementMode: 'DIRECT_PSYCHOMETRIC_ITEM_BANK',
      preferredInstrumentCandidates: ['inst_ecr_r'],
      selectedInstrument: 'inst_ecr_r',
      selectionRationale: 'Experiences in Close Relationships - Revised (36 items: 18 anxiety, 18 avoidance, Fraley et al.).',
      alternativeInstruments: [],
      instrumentCoverage: 'FULL_CONSTRUCT_AND_FACETS',
      facetCoverage: (c.facets || []).length,
      questionCount: 36,
      turkishEvidence: 'VALIDATED_DIRECT',
      licensing: 'REQUIRES_PERMISSION',
      commercialRights: 'ACADEMIC_FREE_COMMERCIAL_PENDING',
      exactItemProvenance: 'RESEARCH_DRAFT_VERIFICATION_PENDING',
      scoringAvailability: 'PRE_CALIBRATION_MEAN_IMPLEMENTED',
      currentImplementationStatus: 'FORM_SPECIFIED',
      readiness: 'READY_BUT_NOT_PUBLISHED',
      gapType: 'COMMERCIAL_RIGHTS_UNKNOWN'
    };
  }

  if (cId === 'multidimensional_empathy') {
    return {
      constructId: cId,
      constructNameTr: c.nameTr,
      measurementMode: 'DIRECT_PSYCHOMETRIC_ITEM_BANK',
      preferredInstrumentCandidates: ['inst_iri'],
      selectedInstrument: 'inst_iri',
      selectionRationale: 'Interpersonal Reactivity Index (14 items: 7 perspective taking, 7 empathic concern).',
      alternativeInstruments: [],
      instrumentCoverage: 'FULL_CONSTRUCT_AND_FACETS',
      facetCoverage: (c.facets || []).length,
      questionCount: 14,
      turkishEvidence: 'VALIDATED_DIRECT',
      licensing: 'REQUIRES_PERMISSION',
      commercialRights: 'ACADEMIC_FREE_COMMERCIAL_PENDING',
      exactItemProvenance: 'RESEARCH_DRAFT_VERIFICATION_PENDING',
      scoringAvailability: 'PRE_CALIBRATION_MEAN_IMPLEMENTED',
      currentImplementationStatus: 'FORM_SPECIFIED',
      readiness: 'READY_BUT_NOT_PUBLISHED',
      gapType: 'COMMERCIAL_RIGHTS_UNKNOWN'
    };
  }

  if (cId === 'conflict_styles') {
    return {
      constructId: cId,
      constructNameTr: c.nameTr,
      measurementMode: 'DIRECT_PSYCHOMETRIC_ITEM_BANK',
      preferredInstrumentCandidates: ['inst_dutch'],
      selectedInstrument: 'inst_dutch',
      selectionRationale: 'DUTCH Test for Conflict Handling (20 items: 5 modes x 4 items). De Dreu et al. (2001).',
      alternativeInstruments: ['inst_tki'],
      instrumentCoverage: 'FULL_CONSTRUCT_AND_FACETS',
      facetCoverage: (c.facets || []).length,
      questionCount: 20,
      turkishEvidence: 'VALIDATED_DIRECT',
      licensing: 'REQUIRES_PERMISSION',
      commercialRights: 'ACADEMIC_FREE_COMMERCIAL_PENDING',
      exactItemProvenance: 'RESEARCH_DRAFT_VERIFICATION_PENDING',
      scoringAvailability: 'PRE_CALIBRATION_MEAN_IMPLEMENTED',
      currentImplementationStatus: 'FORM_SPECIFIED',
      readiness: 'READY_BUT_NOT_PUBLISHED',
      gapType: 'COMMERCIAL_RIGHTS_UNKNOWN'
    };
  }

  if (cId === 'social_agency_boundaries') {
    return {
      constructId: cId,
      constructNameTr: c.nameTr,
      measurementMode: 'DIRECT_PSYCHOMETRIC_ITEM_BANK',
      preferredInstrumentCandidates: [],
      selectedInstrument: null,
      selectionRationale: 'Interpersonal boundary setting and social assertiveness scales require PsycheAI research form authoring.',
      alternativeInstruments: [],
      instrumentCoverage: 'NEEDS_FORM_DEVELOPMENT',
      facetCoverage: (c.facets || []).length,
      questionCount: 10,
      turkishEvidence: 'NEEDS_EMPIRICAL_EVALUATION',
      licensing: 'UNKNOWN',
      commercialRights: 'UNKNOWN',
      exactItemProvenance: 'MISSING',
      scoringAvailability: 'PENDING_ITEM_AUTHORING',
      currentImplementationStatus: 'RESEARCH_ROADMAP_SPECIFIED',
      readiness: 'RESEARCH_FORM_REQUIRED',
      gapType: 'RESEARCH_FORM_REQUIRED'
    };
  }

  // Well-being, Coping, Creativity, Dark Tetrad
  if (cId === 'life_satisfaction' || cId === 'psychological_flourishing') {
    return {
      constructId: cId,
      constructNameTr: c.nameTr,
      measurementMode: 'DIRECT_PSYCHOMETRIC_ITEM_BANK',
      preferredInstrumentCandidates: [],
      selectedInstrument: null,
      selectionRationale: 'SWLS / Diener Flourishing Scale integration scheduled for post-P0 expansion.',
      alternativeInstruments: [],
      instrumentCoverage: 'NEEDS_FORM_DEVELOPMENT',
      facetCoverage: (c.facets || []).length,
      questionCount: 8,
      turkishEvidence: 'NEEDS_EMPIRICAL_EVALUATION',
      licensing: 'UNKNOWN',
      commercialRights: 'UNKNOWN',
      exactItemProvenance: 'MISSING',
      scoringAvailability: 'PENDING_ITEM_AUTHORING',
      currentImplementationStatus: 'RESEARCH_ROADMAP_SPECIFIED',
      readiness: 'RESEARCH_FORM_REQUIRED',
      gapType: 'RESEARCH_FORM_REQUIRED'
    };
  }

  if (cId === 'psychological_resilience' || cId === 'coping_orientations') {
    return {
      constructId: cId,
      constructNameTr: c.nameTr,
      measurementMode: 'DIRECT_PSYCHOMETRIC_ITEM_BANK',
      preferredInstrumentCandidates: [],
      selectedInstrument: null,
      selectionRationale: 'Brief COPE / Connor-Davidson Resilience scale integration pending publisher licensing check.',
      alternativeInstruments: [],
      instrumentCoverage: 'NEEDS_FORM_DEVELOPMENT',
      facetCoverage: (c.facets || []).length,
      questionCount: 14,
      turkishEvidence: 'NEEDS_EMPIRICAL_EVALUATION',
      licensing: 'UNKNOWN',
      commercialRights: 'UNKNOWN',
      exactItemProvenance: 'MISSING',
      scoringAvailability: 'PENDING_ITEM_AUTHORING',
      currentImplementationStatus: 'RESEARCH_ROADMAP_SPECIFIED',
      readiness: 'RESEARCH_FORM_REQUIRED',
      gapType: 'RESEARCH_FORM_REQUIRED'
    };
  }

  if (cId === 'epistemic_curiosity' || cId === 'creative_mindset') {
    return {
      constructId: cId,
      constructNameTr: c.nameTr,
      measurementMode: 'DIRECT_PSYCHOMETRIC_ITEM_BANK',
      preferredInstrumentCandidates: [],
      selectedInstrument: null,
      selectionRationale: 'Litman 5DCR Epistemic Curiosity and Creative Self-Efficacy research forms scheduled for Phase 3.',
      alternativeInstruments: [],
      instrumentCoverage: 'NEEDS_FORM_DEVELOPMENT',
      facetCoverage: (c.facets || []).length,
      questionCount: 10,
      turkishEvidence: 'NEEDS_EMPIRICAL_EVALUATION',
      licensing: 'UNKNOWN',
      commercialRights: 'UNKNOWN',
      exactItemProvenance: 'MISSING',
      scoringAvailability: 'PENDING_ITEM_AUTHORING',
      currentImplementationStatus: 'RESEARCH_ROADMAP_SPECIFIED',
      readiness: 'RESEARCH_FORM_REQUIRED',
      gapType: 'RESEARCH_FORM_REQUIRED'
    };
  }

  if (cId === 'dark_tetrad_traits') {
    return {
      constructId: cId,
      constructNameTr: c.nameTr,
      measurementMode: 'DIRECT_PSYCHOMETRIC_ITEM_BANK',
      preferredInstrumentCandidates: ['inst_sd4'],
      selectedInstrument: 'inst_sd4',
      selectionRationale: 'Short Dark Tetrad (28 items: Machiavellianism, Narcissism, Psychopathy, Sadism, Paulhus et al. 2021).',
      alternativeInstruments: [],
      instrumentCoverage: 'FULL_CONSTRUCT_AND_FACETS',
      facetCoverage: (c.facets || []).length,
      questionCount: 28,
      turkishEvidence: 'VALIDATED_DIRECT',
      licensing: 'RESEARCH_ONLY',
      commercialRights: 'NON_COMMERCIAL_RESEARCH_ONLY',
      exactItemProvenance: 'RESEARCH_DRAFT_VERIFICATION_PENDING',
      scoringAvailability: 'PRE_CALIBRATION_MEAN_IMPLEMENTED',
      currentImplementationStatus: 'FORM_SPECIFIED',
      readiness: 'RESEARCH_ONLY',
      gapType: 'COMMERCIAL_RIGHTS_UNKNOWN'
    };
  }

  // Default fallback for any remaining
  return {
    constructId: cId,
    constructNameTr: c.nameTr,
    measurementMode: 'DIRECT_PSYCHOMETRIC_ITEM_BANK',
    preferredInstrumentCandidates: [],
    selectedInstrument: null,
    selectionRationale: 'Research form development required.',
    alternativeInstruments: [],
    instrumentCoverage: 'NEEDS_FORM_DEVELOPMENT',
    facetCoverage: (c.facets || []).length,
    questionCount: 10,
    turkishEvidence: 'NEEDS_EMPIRICAL_EVALUATION',
    licensing: 'UNKNOWN',
    commercialRights: 'UNKNOWN',
    exactItemProvenance: 'MISSING',
    scoringAvailability: 'PENDING_ITEM_AUTHORING',
    currentImplementationStatus: 'RESEARCH_ROADMAP_SPECIFIED',
    readiness: 'RESEARCH_FORM_REQUIRED',
    gapType: 'RESEARCH_FORM_REQUIRED'
  };
});

fs.writeFileSync(
  path.resolve(dataDir, 'construct-to-instrument-map.json'),
  JSON.stringify(constructInstrumentMapping, null, 2),
  'utf8'
);
console.log('✅ Generated construct-to-instrument-map.json (37 constructs)');

// -----------------------------------------------------------------------------
// 3. USER BURDEN & QUESTION BUDGET (assessment-question-budget.json)
// -----------------------------------------------------------------------------
const coreModules = assessmentModules.filter(m => m.requiredForFirstProfile);
const coreTargetQuestions = coreModules.reduce((acc, m) => acc + m.questionCountPlanned, 0);
const coreTargetMinutes = coreModules.reduce((acc, m) => acc + m.estimatedMinutes, 0);

const expandedModules = assessmentModules.filter(m => m.stage === 'CORE' || m.stage === 'EXPANSION').slice(0, 8);
const expandedTargetQuestions = expandedModules.reduce((acc, m) => acc + m.questionCountPlanned, 0);
const expandedTargetMinutes = expandedModules.reduce((acc, m) => acc + m.estimatedMinutes, 0);

const compConsumerModules = assessmentModules.filter(m => m.stage === 'CORE' || m.stage === 'EXPANSION');
const compConsumerTargetQuestions = compConsumerModules.reduce((acc, m) => acc + m.questionCountPlanned, 0);
const compConsumerTargetMinutes = compConsumerModules.reduce((acc, m) => acc + m.estimatedMinutes, 0);

// Product-ready calculations:
// Only inst_rses (10 items) passes all 4 gates unconditionally right now.
const productReadyQuestionsCore = 10; // inst_rses
const productReadyQuestionsExpanded = 10; // inst_rses
const productReadyQuestionsComp = 10; // inst_rses

const questionBudget = {
  budgetMetadata: {
    averageItemReadingSeconds: 12.0,
    fatigueThresholdMinutesPerSession: 25.0,
    governanceRule: 'Target question counts derived from verified scientific scale lengths. Clear distinction between TARGET architecture and PRODUCT_READY_NOW.'
  },
  tiers: {
    FIRST_MEANINGFUL_PROFILE: {
      tierName: 'First Meaningful Profile (Core Battery)',
      stage: 'ONBOARDING_CORE',
      assessmentCountPlanned: coreModules.length,
      targetQuestionCount: coreTargetQuestions,
      targetEstimatedMinutes: coreTargetMinutes,
      productReadyNowQuestionCount: productReadyQuestionsCore,
      conditionalPermissionQuestionCount: coreTargetQuestions - productReadyQuestionsCore,
      domainsCovered: ['core_personality', 'self_system', 'emotion_regulation', 'cognition_decision'],
      constructsCoveredCount: 11,
      facetsCoveredCount: 31,
      recommendedSessionsCount: 1,
      coverageGaps: [
        'Volition, attachment, and values deferred to expansion tier to keep onboarding strictly under 25 minutes.',
        'HEXACO-60, GSES, ERQ, and NFC-SF are pending commercial permissions for immediate production deployment.'
      ]
    },
    EXPANDED_PROFILE: {
      tierName: 'Expanded Profile (Core + High-Value P1 Expansion)',
      stage: 'EXPANSION',
      assessmentCountPlanned: expandedModules.length,
      targetQuestionCount: expandedTargetQuestions,
      targetEstimatedMinutes: expandedTargetMinutes,
      productReadyNowQuestionCount: productReadyQuestionsExpanded,
      conditionalPermissionQuestionCount: expandedTargetQuestions - productReadyQuestionsExpanded,
      domainsCovered: [
        'core_personality',
        'self_system',
        'emotion_regulation',
        'cognition_decision',
        'self_regulation',
        'motivation_values',
        'social_relational'
      ],
      constructsCoveredCount: 18,
      facetsCoveredCount: 51,
      recommendedSessionsCount: 2,
      coverageGaps: [
        'Cognitive flexibility, existential meaning, and conflict resolution deferred to comprehensive tier.'
      ]
    },
    COMPREHENSIVE_PROFILE: {
      tierName: 'Comprehensive Profile (Full Multi-Domain Psychometric Battery)',
      stage: 'COMPREHENSIVE_CONSUMER_MAXIMUM',
      assessmentCountPlanned: compConsumerModules.length,
      targetQuestionCount: compConsumerTargetQuestions,
      targetEstimatedMinutes: compConsumerTargetMinutes,
      productReadyNowQuestionCount: productReadyQuestionsComp,
      conditionalPermissionQuestionCount: compConsumerTargetQuestions - productReadyQuestionsComp,
      domainsCovered: [
        'core_personality',
        'self_system',
        'emotion_regulation',
        'cognition_decision',
        'self_regulation',
        'motivation_values',
        'social_relational'
      ],
      constructsCoveredCount: 26,
      facetsCoveredCount: 66,
      recommendedSessionsCount: 3,
      coverageGaps: [
        'Subclinical Dark Tetrad traits excluded from standard consumer package; available only as explicit opt-in advanced research module.'
      ]
    },
    OPTIONAL_ADVANCED_RESEARCH_MODULE: {
      tierName: 'Optional Advanced Research Exploration',
      stage: 'OPTIONAL_ADVANCED',
      assessmentCountPlanned: 1,
      targetQuestionCount: 28,
      targetEstimatedMinutes: 6.0,
      domainsCovered: ['optional_dark_tetrad'],
      constructsCoveredCount: 1,
      facetsCoveredCount: 4,
      researchOnlyQuestionCount: 28
    }
  },
  grandTotals: {
    totalPlannedConsumerModules: 12,
    totalPlannedConsumerQuestions: compConsumerTargetQuestions,
    totalPlannedConsumerMinutes: compConsumerTargetMinutes,
    totalProductReadyNowQuestions: productReadyQuestionsComp,
    totalConditionalPermissionQuestions: compConsumerTargetQuestions - productReadyQuestionsComp,
    totalResearchOnlyQuestions: 28
  }
};

fs.writeFileSync(
  path.resolve(dataDir, 'assessment-question-budget.json'),
  JSON.stringify(questionBudget, null, 2),
  'utf8'
);
console.log('✅ Generated assessment-question-budget.json');

// -----------------------------------------------------------------------------
// 4. ASSESSMENT JOURNEY PLAN (assessment-journey-plan.json)
// -----------------------------------------------------------------------------
const journeyPlan = {
  journeyMetadata: {
    modelName: 'PsycheAI Adaptive Multi-Session Assessment Journey',
    primaryGoal: 'Deliver immediate scientific value at each step without cognitive fatigue or straightlining.',
    surveyFatigueLimitMinutes: 25.0
  },
  stages: [
    {
      stageId: 'ONBOARDING',
      stageNameTr: 'Başlangıç ve Temel Profil (Core Onboarding)',
      stageNameEn: 'Onboarding & First Meaningful Profile',
      entryCriteria: 'User account created; no prior completed sessions.',
      targetSessionDurationMinutes: 22.5,
      requiredModules: [
        'mod_core_hexaco_60',
        'mod_self_agency',
        'mod_emotion_regulation',
        'mod_cognitive_epistemic'
      ],
      recommendedNextModules: ['mod_volition_impulse', 'mod_basic_needs_sdt'],
      optionalModules: [],
      completionCondition: 'All 4 core modules completed (108 target questions answered).',
      profileUnlocks: [
        'Core Personality Radar (6 broad factors)',
        'Self-Esteem & Generalized Agency Index',
        'Emotion Regulation Quadrant (Reappraisal vs Suppression)',
        'Epistemic Drive Baseline Score',
        'First DeepSeek AI Psychological Synthesis'
      ],
      nextBestAssessmentLogic: 'Guide directly to Module 1 (HEXACO-60), followed sequentially by Self-Agency, ERQ, and NFC-SF.'
    },
    {
      stageId: 'FIRST_PROFILE_DELIVERY',
      stageNameTr: 'Temel Profil Raporu ve İçgörü İnceleme',
      stageNameEn: 'First Profile Delivery & Insight Exploration',
      entryCriteria: 'Core Onboarding completed.',
      targetSessionDurationMinutes: 5.0,
      requiredModules: [],
      recommendedNextModules: ['mod_volition_impulse', 'mod_basic_needs_sdt', 'mod_universal_values'],
      optionalModules: [],
      completionCondition: 'User reviews initial personality atlas, trait radar, and AI synthesis report.',
      profileUnlocks: [
        'Unified Profile Dashboard Access',
        'Adlerian & Rogerian Core Lens Perspectives',
        'Initial Confidence Indicators (Baseline Sample Size = 108)'
      ],
      nextBestAssessmentLogic: 'Recommend a 24-hour cognitive resting window before starting Stage 2 (Expansion).'
    },
    {
      stageId: 'PROFILE_EXPANSION',
      stageNameTr: 'Genişletilmiş Profil ve Değer Haritası',
      stageNameEn: 'Profile Expansion & Motivation Mapping',
      entryCriteria: 'First Profile reviewed; minimum 12 hours since Session 1.',
      targetSessionDurationMinutes: 32.0,
      requiredModules: [
        'mod_volition_impulse',
        'mod_basic_needs_sdt',
        'mod_universal_values',
        'mod_relational_attachment_empathy'
      ],
      recommendedNextModules: ['mod_cognitive_adaptability', 'mod_meaning_compassion_grit'],
      optionalModules: [],
      completionCondition: 'All 4 expansion modules completed (cumulative 265 target questions answered).',
      profileUnlocks: [
        'Schwartz Universal Value Circumplex (10 basic values)',
        'SDT Basic Needs Satisfaction & Frustration Balance',
        'Adult Attachment 4-Quadrant Vector (Anxiety vs Avoidance)',
        'UPPS-P 5-Factor Impulsivity Profile & General Self-Control',
        'Theory Council Multi-Theorist Tension Analysis'
      ],
      nextBestAssessmentLogic: 'Recommend highest consumer-value unmeasured module: Basic Psychological Needs (SDT) followed by Schwartz Values.'
    },
    {
      stageId: 'DEEP_PROFILE',
      stageNameTr: 'Kapsamlı Derin Haritalama (Master Consumer Tier)',
      stageNameEn: 'Comprehensive Deep Mapping',
      entryCriteria: 'Profile Expansion completed.',
      targetSessionDurationMinutes: 25.0,
      requiredModules: [
        'mod_cognitive_adaptability',
        'mod_meaning_compassion_grit',
        'mod_conflict_boundaries',
        'mod_affective_distress'
      ],
      recommendedNextModules: ['mod_dark_tetrad_advanced'],
      optionalModules: ['mod_dark_tetrad_advanced'],
      completionCondition: 'All 12 consumer modules completed (cumulative 382 target questions answered).',
      profileUnlocks: [
        'Full 66-Facet Master Psychological Profile',
        'Cognitive Flexibility & Ambiguity Resilience Matrix',
        'Frankl Existential Meaning Horizon & Grit Persistence Score',
        'DUTCH 5-Mode Conflict Handling Pentagon',
        'PANAS Affect Balance & Distress Tolerance Metric',
        'Comprehensive 8-Theorist DeepSeek AI Integrative Analysis'
      ],
      nextBestAssessmentLogic: 'Offer user choice between Cognitive Adaptability, Meaning Dynamics, or Conflict Resolution based on user interest.'
    },
    {
      stageId: 'ADVANCED_EXPLORATION',
      stageNameTr: 'İleri Araştırma ve Boylamsal Takip',
      stageNameEn: 'Advanced Research & Longitudinal Tracking',
      entryCriteria: 'Comprehensive Profile completed.',
      targetSessionDurationMinutes: 6.0,
      requiredModules: [],
      recommendedNextModules: [],
      optionalModules: ['mod_dark_tetrad_advanced'],
      completionCondition: 'Explicit opt-in research consent.',
      profileUnlocks: [
        'Subclinical Dark Tetrad Exploration (Machiavellianism, Narcissism, Psychopathy, Sadism)',
        'Longitudinal Trait Stability Tracking Engine'
      ],
      nextBestAssessmentLogic: 'Notify user of longitudinal micro-check-ins and state fluctuation tracking.'
    }
  ],
  repeatTestPolicy: {
    stablePersonalityHEXACO: {
      minimumRetestIntervalDays: 180,
      scientificRationale: 'Broad personality traits exhibit high 6-month test-retest stability (r > 0.80). Retesting before 6 months measures practice artifacts rather than true psychological change.'
    },
    relationalAttachment: {
      minimumRetestIntervalDays: 90,
      scientificRationale: 'Attachment orientations can shift following major relational events, requiring at least 3-month observation windows.'
    },
    affectiveToneAndDistress: {
      minimumRetestIntervalDays: 14,
      scientificRationale: 'Trait-state affect balances (PANAS) can be tracked at bi-weekly intervals to detect environmental mood shifts.'
    },
    defaultUnspecifiedInterval: 'RETEST_INTERVAL_UNSPECIFIED'
  },
  longitudinalOutputsSeparation: {
    definition: 'Longitudinal outputs are derived mathematically across multi-wave snapshot histories. They do NOT add questionnaire items.',
    trackedMetrics: [
      'idx_temporal_trait_stability',
      'idx_stress_induced_profile_shift',
      'idx_need_satisfaction_volatility',
      'idx_affect_balance_trend'
    ]
  },
  observationalAiSeparation: {
    definition: 'Observational AI prompts (e.g. self-reflection text, life story narratives) are qualitative grounding context only. They NEVER alter psychometric scores or scale metrics.',
    mode: 'OBSERVATIONAL_PROMPT_ONLY'
  }
};

fs.writeFileSync(
  path.resolve(dataDir, 'assessment-journey-plan.json'),
  JSON.stringify(journeyPlan, null, 2),
  'utf8'
);
console.log('✅ Generated assessment-journey-plan.json');

// -----------------------------------------------------------------------------
// 5. LICENSING READINESS MATRIX (licensing-readiness-matrix.json)
// -----------------------------------------------------------------------------
const licensingMatrix = instrumentRegistry.map((inst: any) => {
  let outcome = 'UNKNOWN';
  let blocker = null;
  let nextAction = 'Verify terms with authors / publisher.';

  if (inst.decision === 'APPROVED_PUBLIC' && inst.commercialUseVerified) {
    outcome = 'APPROVED_FOR_PRODUCT';
    nextAction = 'Maintain open-science attribution in application legal notices.';
  } else if (inst.decision === 'REJECTED') {
    outcome = 'REJECTED';
    blocker = `Proprietary instrument (${inst.license}). Strictly forbidden to store, host or reproduce items.`;
    nextAction = 'Use approved public domain or PsycheAI native research alternative.';
  } else if (inst.decision === 'REQUIRES_LICENSE') {
    outcome = 'REQUIRES_PERMISSION';
    blocker = `Commercial license required by copyright holder (${inst.authors ? inst.authors[0] : 'Author'}).`;
    nextAction = 'Initiate formal publisher licensing agreement or author permission query.';
  } else if (inst.decision === 'RESEARCH_ONLY') {
    outcome = 'RESEARCH_ONLY';
    blocker = 'Author permits academic / educational research; commercial product reproduction requires verification.';
    nextAction = 'Review open academic license terms or author distribution policy.';
  }

  return {
    instrumentId: inst.instrumentId,
    instrumentName: inst.name,
    copyrightHolder: inst.authors ? inst.authors.join('; ') : 'Unknown',
    year: inst.year || null,
    scientificStatus: 'VALIDATED_SCIENTIFIC_STANDARD',
    licenseType: inst.license,
    commercialUsePermitted: inst.commercialUse,
    commercialUseVerified: inst.commercialUseVerified || false,
    itemReproductionVerified: inst.itemReproductionVerified || false,
    translationRightsVerified: inst.translationPermissionVerified || false,
    evidenceSourceIds: inst.doi ? [`doi:${inst.doi}`] : [],
    licensingOutcome: outcome,
    blockerDescription: blocker,
    recommendedNextAction: nextAction
  };
});

fs.writeFileSync(
  path.resolve(dataDir, 'licensing-readiness-matrix.json'),
  JSON.stringify(licensingMatrix, null, 2),
  'utf8'
);
console.log(`✅ Generated licensing-readiness-matrix.json (${licensingMatrix.length} instruments)`);

// -----------------------------------------------------------------------------
// 6. TURKISH VALIDATION READINESS (turkish-validation-readiness.json)
// -----------------------------------------------------------------------------
const turkishValidationData = [
  {
    instrumentId: 'inst_hexaco_60',
    instrumentName: 'HEXACO-60 Short Form',
    constructsCovered: ['hexaco_honesty_humility', 'hexaco_emotionality', 'hexaco_extraversion', 'hexaco_agreeableness', 'hexaco_conscientiousness', 'hexaco_openness'],
    turkishEvidenceLevel: 'LEXICAL_AND_ADAPTATION_EVIDENCE',
    appliesToLevel: 'BROAD_FACTOR_PRIMARY',
    sampleEvidence: 'Wasti et al. (2008) Turkish lexical study; Göz (2018) HEXACO validation thesis.',
    factorEvidence: '6-factor structure replicates cross-culturally at broad factor level.',
    reliabilityEvidence: null,
    sourceIds: ['src_ashton_lee_2007'],
    exactFormMatch: 'EXACT_60_ITEM_SHORT_FORM',
    translationProvenance: 'RESEARCH_DRAFT_PENDING_AUTHOR_VERIFICATION',
    readiness: 'READY_BUT_NOT_PUBLISHED'
  },
  {
    instrumentId: 'inst_ipip_hexaco',
    instrumentName: 'IPIP-HEXACO 240-Item Research Form',
    constructsCovered: ['hexaco_honesty_humility', 'hexaco_emotionality', 'hexaco_extraversion', 'hexaco_agreeableness', 'hexaco_conscientiousness', 'hexaco_openness'],
    turkishEvidenceLevel: 'LEXICAL_AND_RELATED',
    appliesToLevel: 'RESEARCH_BANK_LEVEL',
    sampleEvidence: 'Ashton, Lee & Goldberg (2007); Goldberg (2006).',
    factorEvidence: 'Full 24-facet public domain item pool.',
    reliabilityEvidence: null,
    sourceIds: ['src_ashton_lee_2007', 'src_goldberg_2006'],
    exactFormMatch: 'FULL_240_ITEM_RESEARCH_POOL',
    translationProvenance: 'PUBLIC_DOMAIN_RESEARCH_TRANSLATION',
    readiness: 'RESEARCH_ONLY'
  },
  {
    instrumentId: 'inst_rses',
    instrumentName: 'Rosenberg Self-Esteem Scale (RSES)',
    constructsCovered: ['core_self_esteem'],
    turkishEvidenceLevel: 'EMPIRICAL_ADAPTATION',
    appliesToLevel: 'FULL_SCALE',
    sampleEvidence: 'Çuhadaroğlu (1986) Turkish adaptation; widely replicated in Turkish literature.',
    factorEvidence: 'Unidimensional self-esteem structure confirmed in Turkish samples.',
    reliabilityEvidence: null,
    sourceIds: ['src_rosenberg_1965'],
    exactFormMatch: 'EXACT_10_ITEM_STANDARD',
    translationProvenance: 'VERIFIED_ACADEMIC_ADAPTATION',
    readiness: 'READY_FOR_PRODUCT_REVIEW'
  },
  {
    instrumentId: 'inst_gses',
    instrumentName: 'General Self-Efficacy Scale (GSES)',
    constructsCovered: ['generalized_self_efficacy'],
    turkishEvidenceLevel: 'EMPIRICAL_ADAPTATION',
    appliesToLevel: 'FULL_SCALE',
    sampleEvidence: 'Yeşilayaprak et al. (1999); Aygün & Akçamete (2000).',
    factorEvidence: 'Single-factor general self-efficacy structure replicated.',
    reliabilityEvidence: null,
    sourceIds: ['src_schwarzer_1995'],
    exactFormMatch: 'EXACT_10_ITEM_FORM',
    translationProvenance: 'RESEARCH_DRAFT_VERIFICATION_PENDING',
    readiness: 'READY_BUT_NOT_PUBLISHED'
  },
  {
    instrumentId: 'inst_erq',
    instrumentName: 'Emotion Regulation Questionnaire (ERQ)',
    constructsCovered: ['cognitive_reappraisal', 'expressive_suppression'],
    turkishEvidenceLevel: 'EMPIRICAL_ADAPTATION',
    appliesToLevel: 'SUBSCALE_LEVEL',
    sampleEvidence: 'Yurtsever (2008); Uçanok (2012).',
    factorEvidence: 'Two orthogonal factors (Cognitive Reappraisal, Expressive Suppression) replicated.',
    reliabilityEvidence: null,
    sourceIds: ['src_gross_john_2003'],
    exactFormMatch: 'EXACT_10_ITEM_FORM',
    translationProvenance: 'RESEARCH_DRAFT_VERIFICATION_PENDING',
    readiness: 'READY_BUT_NOT_PUBLISHED'
  },
  {
    instrumentId: 'inst_nfc_sf',
    instrumentName: 'Need for Cognition Scale (Short Form)',
    constructsCovered: ['epistemic_drive'],
    turkishEvidenceLevel: 'EMPIRICAL_ADAPTATION',
    appliesToLevel: 'FULL_SCALE',
    sampleEvidence: 'Gülgöz & Sancar (2004); Güvenç (2011).',
    factorEvidence: 'Unidimensional structure supported in Turkish cohorts.',
    reliabilityEvidence: null,
    sourceIds: ['src_cacioppo_1982'],
    exactFormMatch: 'EXACT_18_ITEM_SHORT_FORM',
    translationProvenance: 'RESEARCH_DRAFT_VERIFICATION_PENDING',
    readiness: 'READY_BUT_NOT_PUBLISHED'
  },
  {
    instrumentId: 'inst_bscs',
    instrumentName: 'Brief Self-Control Scale (BSCS)',
    constructsCovered: ['volitional_stamina'],
    turkishEvidenceLevel: 'EMPIRICAL_ADAPTATION',
    appliesToLevel: 'FULL_SCALE',
    sampleEvidence: 'Nebioğlu et al. (2012); Duru et al. (2018).',
    factorEvidence: 'General self-control factor structure supported.',
    reliabilityEvidence: null,
    sourceIds: ['src_tangney_2004'],
    exactFormMatch: 'EXACT_13_ITEM_FORM',
    translationProvenance: 'RESEARCH_DRAFT_VERIFICATION_PENDING',
    readiness: 'READY_BUT_NOT_PUBLISHED'
  },
  {
    instrumentId: 'inst_upps_p_sf',
    instrumentName: 'UPPS-P Impulsive Behavior Scale (Short Form)',
    constructsCovered: ['impulsivity_uppsp'],
    turkishEvidenceLevel: 'EMPIRICAL_ADAPTATION',
    appliesToLevel: '5_DISTINCT_FACETS',
    sampleEvidence: 'Yargıç et al. (2016) Turkish validation study.',
    factorEvidence: '5-factor impulsivity structure replicated.',
    reliabilityEvidence: null,
    sourceIds: ['src_cyders_2014'],
    exactFormMatch: 'EXACT_20_ITEM_FORM',
    translationProvenance: 'RESEARCH_DRAFT_VERIFICATION_PENDING',
    readiness: 'READY_BUT_NOT_PUBLISHED'
  },
  {
    instrumentId: 'inst_bpnsfs',
    instrumentName: 'Basic Psychological Need Satisfaction and Frustration Scale',
    constructsCovered: ['basic_psychological_needs'],
    turkishEvidenceLevel: 'EMPIRICAL_ADAPTATION',
    appliesToLevel: '6_SUB_DIMENSIONS',
    sampleEvidence: 'Başyurt & Şahin (2018).',
    factorEvidence: '6-factor CFA confirmed for satisfaction and frustration across 3 needs.',
    reliabilityEvidence: null,
    sourceIds: ['src_chen_2015'],
    exactFormMatch: 'EXACT_24_ITEM_FORM',
    translationProvenance: 'RESEARCH_DRAFT_VERIFICATION_PENDING',
    readiness: 'READY_BUT_NOT_PUBLISHED'
  },
  {
    instrumentId: 'inst_pvq_rr',
    instrumentName: 'Portrait Values Questionnaire - Revised (PVQ-RR)',
    constructsCovered: ['universal_values'],
    turkishEvidenceLevel: 'EMPIRICAL_ADAPTATION',
    appliesToLevel: 'CIRCUMPLEX_CONTINUUM',
    sampleEvidence: 'Kuşdil & Kağıtçıbaşı (2000); Demirutku (2007).',
    factorEvidence: 'Schwartz circumplex circular structure verified in Turkish culture.',
    reliabilityEvidence: null,
    sourceIds: ['src_schwartz_1992'],
    exactFormMatch: 'EXACT_57_ITEM_FORM',
    translationProvenance: 'RESEARCH_DRAFT',
    readiness: 'READY_BUT_NOT_PUBLISHED'
  },
  {
    instrumentId: 'inst_ecr_r',
    instrumentName: 'Experiences in Close Relationships - Revised (ECR-R)',
    constructsCovered: ['attachment_system'],
    turkishEvidenceLevel: 'EMPIRICAL_ADAPTATION',
    appliesToLevel: '2_ORTHOGONAL_DIMENSIONS',
    sampleEvidence: 'Selçuk et al. (2005); Sümer (2006).',
    factorEvidence: 'Two-factor structure (Anxiety, Avoidance) confirmed in Turkish population.',
    reliabilityEvidence: null,
    sourceIds: ['src_fraley_2000'],
    exactFormMatch: 'EXACT_36_ITEM_FORM',
    translationProvenance: 'RESEARCH_DRAFT_VERIFICATION_PENDING',
    readiness: 'READY_BUT_NOT_PUBLISHED'
  },
  {
    instrumentId: 'inst_iri',
    instrumentName: 'Interpersonal Reactivity Index (IRI)',
    constructsCovered: ['multidimensional_empathy'],
    turkishEvidenceLevel: 'EMPIRICAL_ADAPTATION',
    appliesToLevel: 'SUBSCALE_LEVEL',
    sampleEvidence: 'Engeler & Yücel (2009).',
    factorEvidence: 'Perspective Taking and Empathic Concern factors supported.',
    reliabilityEvidence: null,
    sourceIds: ['src_davis_1983'],
    exactFormMatch: 'EXACT_14_ITEM_NORMAL_SUBSET',
    translationProvenance: 'RESEARCH_DRAFT_VERIFICATION_PENDING',
    readiness: 'READY_BUT_NOT_PUBLISHED'
  },
  {
    instrumentId: 'inst_cfi',
    instrumentName: 'Cognitive Flexibility Inventory (CFI)',
    constructsCovered: ['cognitive_adaptability'],
    turkishEvidenceLevel: 'EMPIRICAL_ADAPTATION',
    appliesToLevel: '2_SUB_DIMENSIONS',
    sampleEvidence: 'Gülüm & Dağ (2012).',
    factorEvidence: 'Alternatives and Control factors confirmed in Turkish sample.',
    reliabilityEvidence: null,
    sourceIds: ['src_dennis_2010'],
    exactFormMatch: 'EXACT_20_ITEM_FORM',
    translationProvenance: 'RESEARCH_DRAFT_VERIFICATION_PENDING',
    readiness: 'READY_BUT_NOT_PUBLISHED'
  },
  {
    instrumentId: 'inst_ius_12',
    instrumentName: 'Intolerance of Uncertainty Scale Short Form (IUS-12)',
    constructsCovered: ['cognitive_adaptability'],
    turkishEvidenceLevel: 'EMPIRICAL_ADAPTATION',
    appliesToLevel: 'FULL_SCALE',
    sampleEvidence: 'Sarı & Dağ (2009).',
    factorEvidence: 'Prospective and inhibitory anxiety factors supported.',
    reliabilityEvidence: null,
    sourceIds: ['src_carleton_2007'],
    exactFormMatch: 'EXACT_12_ITEM_FORM',
    translationProvenance: 'RESEARCH_DRAFT_VERIFICATION_PENDING',
    readiness: 'READY_BUT_NOT_PUBLISHED'
  },
  {
    instrumentId: 'inst_mlq',
    instrumentName: 'Meaning in Life Questionnaire (MLQ)',
    constructsCovered: ['existential_meaning'],
    turkishEvidenceLevel: 'EMPIRICAL_ADAPTATION',
    appliesToLevel: '2_ORTHOGONAL_DIMENSIONS',
    sampleEvidence: 'Boyraz et al. (2013).',
    factorEvidence: 'Presence of Meaning and Search for Meaning confirmed orthogonal.',
    reliabilityEvidence: null,
    sourceIds: ['src_steger_2006'],
    exactFormMatch: 'EXACT_10_ITEM_FORM',
    translationProvenance: 'RESEARCH_DRAFT_VERIFICATION_PENDING',
    readiness: 'READY_BUT_NOT_PUBLISHED'
  },
  {
    instrumentId: 'inst_grit_s',
    instrumentName: 'Short Grit Scale (Grit-S)',
    constructsCovered: ['volitional_stamina'],
    turkishEvidenceLevel: 'EMPIRICAL_ADAPTATION',
    appliesToLevel: '2_SUB_DIMENSIONS',
    sampleEvidence: 'Sarısakaloğlu et al. (2014).',
    factorEvidence: 'Consistency of Interest and Perseverance of Effort factors supported.',
    reliabilityEvidence: null,
    sourceIds: ['src_duckworth_2009'],
    exactFormMatch: 'EXACT_8_ITEM_FORM',
    translationProvenance: 'RESEARCH_DRAFT_VERIFICATION_PENDING',
    readiness: 'READY_BUT_NOT_PUBLISHED'
  },
  {
    instrumentId: 'inst_dutch',
    instrumentName: 'DUTCH Conflict Management Package',
    constructsCovered: ['conflict_styles'],
    turkishEvidenceLevel: 'EMPIRICAL_ADAPTATION',
    appliesToLevel: '5_DISTINCT_MODES',
    sampleEvidence: 'Arslan (2017); Kozan (1989).',
    factorEvidence: '5-factor structure (Problem Solving, Forcing, Yielding, Avoiding, Compromising) replicated.',
    reliabilityEvidence: null,
    sourceIds: ['src_dedreu_2001'],
    exactFormMatch: 'EXACT_20_ITEM_FORM',
    translationProvenance: 'RESEARCH_DRAFT_VERIFICATION_PENDING',
    readiness: 'READY_BUT_NOT_PUBLISHED'
  },
  {
    instrumentId: 'inst_panas',
    instrumentName: 'Positive and Negative Affect Schedule (PANAS)',
    constructsCovered: ['affective_tone'],
    turkishEvidenceLevel: 'EMPIRICAL_ADAPTATION',
    appliesToLevel: '2_ORTHOGONAL_DIMENSIONS',
    sampleEvidence: 'Gençöz (2000).',
    factorEvidence: 'Positive Affect and Negative Affect confirmed orthogonal in Turkish sample.',
    reliabilityEvidence: null,
    sourceIds: ['src_watson_1988'],
    exactFormMatch: 'EXACT_20_ITEM_FORM',
    translationProvenance: 'RESEARCH_DRAFT_VERIFICATION_PENDING',
    readiness: 'READY_BUT_NOT_PUBLISHED'
  },
  {
    instrumentId: 'inst_dts',
    instrumentName: 'Distress Tolerance Scale (DTS)',
    constructsCovered: ['distress_tolerance'],
    turkishEvidenceLevel: 'EMPIRICAL_ADAPTATION',
    appliesToLevel: 'FULL_SCALE',
    sampleEvidence: 'Sarı et al. (2017).',
    factorEvidence: 'Distress tolerance general factor supported in Turkish sample.',
    reliabilityEvidence: null,
    sourceIds: ['src_simons_2005'],
    exactFormMatch: 'EXACT_15_ITEM_FORM',
    translationProvenance: 'RESEARCH_DRAFT_VERIFICATION_PENDING',
    readiness: 'READY_BUT_NOT_PUBLISHED'
  },
  {
    instrumentId: 'inst_sd4',
    instrumentName: 'Short Dark Tetrad (SD4)',
    constructsCovered: ['dark_tetrad_traits'],
    turkishEvidenceLevel: 'EMPIRICAL_ADAPTATION',
    appliesToLevel: '4_DISTINCT_FACTORS',
    sampleEvidence: 'Özsoy et al. (2022).',
    factorEvidence: '4-factor structure (Machiavellianism, Narcissism, Psychopathy, Sadism) confirmed via CFA.',
    reliabilityEvidence: null,
    sourceIds: ['src_paulhus_2021'],
    exactFormMatch: 'EXACT_28_ITEM_FORM',
    translationProvenance: 'RESEARCH_DRAFT_VERIFICATION_PENDING',
    readiness: 'RESEARCH_ONLY'
  }
];

fs.writeFileSync(
  path.resolve(dataDir, 'turkish-validation-readiness.json'),
  JSON.stringify(turkishValidationData, null, 2),
  'utf8'
);
console.log(`✅ Generated turkish-validation-readiness.json (${turkishValidationData.length} instruments)`);

// -----------------------------------------------------------------------------
// 7. ASSESSMENT GAP ANALYSIS (assessment-gap-analysis.json)
// -----------------------------------------------------------------------------
const gapAnalysis = [
  {
    constructId: 'authenticity',
    domainId: 'self_system',
    constructNameTr: 'Özgünlük (Authenticity)',
    gapType: 'RESEARCH_FORM_REQUIRED',
    severity: 'MEDIUM',
    description: 'No unencumbered public-domain Turkish scale measuring Wood et al. authentic living exists.',
    proposedSolution: 'Author PsycheAI native 8-item research form with EFA/CFA pilot calibration.',
    targetItemPoolSize: 16,
    validationRoadmapPhase: 'FAZ_3_RESEARCH_FORMS'
  },
  {
    constructId: 'locus_of_control',
    domainId: 'self_system',
    constructNameTr: 'Denetim Odağı (Locus of Control)',
    gapType: 'RESEARCH_FORM_REQUIRED',
    severity: 'LOW',
    description: 'Rotter forced-choice scale has poor modern psychometric properties; Levenson scale has licensing barriers.',
    proposedSolution: 'Develop brief 8-item Likert internal vs external locus research module.',
    targetItemPoolSize: 16,
    validationRoadmapPhase: 'FAZ_3_RESEARCH_FORMS'
  },
  {
    constructId: 'self_conscious_emotions',
    domainId: 'emotion_regulation',
    constructNameTr: 'Kendilik Bilinci Duyguları (Utanç ve Suçluluk)',
    gapType: 'LICENSE_BLOCKED',
    severity: 'MEDIUM',
    description: 'TOSCA-3 is proprietary and scenario-based. Cannot be used in production SaaS.',
    proposedSolution: 'Develop non-clinical scenario-free shame and guilt proneness brief scale (10 items).',
    targetItemPoolSize: 20,
    validationRoadmapPhase: 'FAZ_3_RESEARCH_FORMS'
  },
  {
    constructId: 'social_agency_boundaries',
    domainId: 'social_relational',
    constructNameTr: 'Sosyal Özerklik ve Kişilerarası Sınırlar',
    gapType: 'RESEARCH_FORM_REQUIRED',
    severity: 'LOW',
    description: 'Relational boundary clarity and social assertiveness lack a unified open-source Turkish scale.',
    proposedSolution: 'Author 10-item boundary clarity research scale.',
    targetItemPoolSize: 20,
    validationRoadmapPhase: 'FAZ_3_RESEARCH_FORMS'
  },
  {
    constructId: 'psychological_flourishing',
    domainId: 'wellbeing_vitality',
    constructNameTr: 'Psikolojik Gelişme ve Canlılık (Flourishing)',
    gapType: 'RESEARCH_FORM_REQUIRED',
    severity: 'LOW',
    description: 'Diener Flourishing Scale requires commercial permission review.',
    proposedSolution: 'Review Diener open-science policy or develop 8-item flourishing research form.',
    targetItemPoolSize: 16,
    validationRoadmapPhase: 'FAZ_3_RESEARCH_FORMS'
  },
  {
    constructId: 'psychological_resilience',
    domainId: 'coping_resilience',
    constructNameTr: 'Ego Sağlamlığı ve Stres İyileşmesi',
    gapType: 'RESEARCH_FORM_REQUIRED',
    severity: 'LOW',
    description: 'Connor-Davidson (CD-RISC) and Brief Resilience Scale require publisher copyright clearance.',
    proposedSolution: 'Develop PsycheAI 10-item ego-resilience research form.',
    targetItemPoolSize: 20,
    validationRoadmapPhase: 'FAZ_3_RESEARCH_FORMS'
  },
  {
    constructId: 'epistemic_curiosity',
    domainId: 'creativity_curiosity',
    constructNameTr: 'Epistemik Merak (5DCR)',
    gapType: 'RESEARCH_FORM_REQUIRED',
    severity: 'LOW',
    description: 'Litman Epistemic Curiosity scale requires formal Turkish psychometric replication.',
    proposedSolution: 'Develop 10-item epistemic curiosity and exploration module.',
    targetItemPoolSize: 20,
    validationRoadmapPhase: 'FAZ_3_RESEARCH_FORMS'
  }
];

fs.writeFileSync(
  path.resolve(dataDir, 'assessment-gap-analysis.json'),
  JSON.stringify(gapAnalysis, null, 2),
  'utf8'
);
console.log(`✅ Generated assessment-gap-analysis.json (${gapAnalysis.length} construct gaps identified)`);

console.log('\n======================================================');
console.log('FAZ 2.15 REFINED ASSESSMENT ARCHITECTURE GENERATED');
console.log('======================================================');
