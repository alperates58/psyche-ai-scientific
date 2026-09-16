import fs from 'fs';
import path from 'path';

export type JourneyClassification = 'REQUIRED' | 'RECOMMENDED' | 'OPTIONAL' | 'ADVANCED';

export type JourneyStage =
  | 'ONBOARDING'
  | 'FIRST_PROFILE'
  | 'PROFILE_EXPANSION'
  | 'DEEP_PROFILE'
  | 'ADVANCED_EXPLORATION'
  | 'COMPREHENSIVE_COMPLETE';

export type ProfileDepthLevel =
  | 'STARTING'
  | 'CORE'
  | 'EXPANDED'
  | 'COMPREHENSIVE'
  | 'ADVANCED';

export type CatalogCategory =
  | 'PERSONALITY'
  | 'SELF_REGULATION'
  | 'EMOTION'
  | 'COGNITION'
  | 'MOTIVATION_VALUES'
  | 'RELATIONSHIPS'
  | 'ADVANCED';

export type AssessmentItemStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'AVAILABLE'
  | 'OPTIONAL'
  | 'RESEARCH'
  | 'CONTENT_PENDING';

export type ContentAvailabilityState =
  | 'READY'
  | 'CONTENT_PENDING'
  | 'RESEARCH_DRAFT'
  | 'LEGACY'
  | 'DISABLED';

export interface CatalogCategoryMetadata {
  id: CatalogCategory;
  nameTr: string;
  titleTr: string;
  nameEn: string;
  descriptionTr: string;
  iconName: string;
}

export const ASSESSMENT_CATALOG_CATEGORIES: Record<CatalogCategory, CatalogCategoryMetadata> = {
  PERSONALITY: {
    id: 'PERSONALITY',
    nameTr: 'Kişilik & Mizaç',
    titleTr: 'Kişilik ve Mizaç Dinamikleri',
    nameEn: 'Personality & Temperament',
    descriptionTr: 'HEXACO 6 faktör modeli temelinde temel kişilik boyutları ve mizaç özellikleri.',
    iconName: 'Brain',
  },
  SELF_REGULATION: {
    id: 'SELF_REGULATION',
    nameTr: 'Benlik & Öz-Düzenleme',
    titleTr: 'Benlik Sistemi ve İrade',
    nameEn: 'Self-System & Self-Regulation',
    descriptionTr: 'Benlik saygısı, öz-yeterlik, irade gücü ve dürtü kontrolü dinamikleri.',
    iconName: 'Zap',
  },
  EMOTION: {
    id: 'EMOTION',
    nameTr: 'Duygular & Dayanıklılık',
    titleTr: 'Duygusal Süreçler ve Başa Çıkma',
    nameEn: 'Emotion & Affective Dynamics',
    descriptionTr: 'Duygu düzenleme, sıkıntı toleransı, başa çıkma ve duygulanım dengesi.',
    iconName: 'Heart',
  },
  COGNITION: {
    id: 'COGNITION',
    nameTr: 'Biliş & Karar Verme',
    titleTr: 'Bilişsel Esneklik ve Epistemik Merak',
    nameEn: 'Cognition & Decision Styles',
    descriptionTr: 'Bilişsel esneklik, belirsizlik yönetimi, epistemik yönelim ve merak.',
    iconName: 'Lightbulb',
  },
  MOTIVATION_VALUES: {
    id: 'MOTIVATION_VALUES',
    nameTr: 'Motivasyon, Değerler & Anlam',
    titleTr: 'Motivasyon, Evrensel Değerler ve Anlam',
    nameEn: 'Motivation, Values & Meaning',
    descriptionTr: 'Temel psikolojik ihtiyaçlar, Schwartz evrensel değerleri, anlam ve canlılık.',
    iconName: 'Target',
  },
  RELATIONSHIPS: {
    id: 'RELATIONSHIPS',
    nameTr: 'İlişkiler & Sosyal Dinamikler',
    titleTr: 'İlişkiler, Bağlanma ve İletişim',
    nameEn: 'Relationships & Social Dynamics',
    descriptionTr: 'Yetişkin bağlanma örüntüleri, empati boyutları ve çatışma çözme yönelimleri.',
    iconName: 'Users',
  },
  ADVANCED: {
    id: 'ADVANCED',
    nameTr: 'İleri Düzey Keşif',
    titleTr: 'İleri Düzey ve Araştırma Modülleri',
    nameEn: 'Advanced Exploration',
    descriptionTr: 'İsteğe bağlı araştırma modülleri ve subklinik kişilik dinamikleri.',
    iconName: 'ShieldAlert',
  },
};

// Aliases for compatibility
export const CATALOG_CATEGORIES = ASSESSMENT_CATALOG_CATEGORIES;

export interface JourneyStageMetadata {
  stageKey: JourneyStage;
  titleTr: string;
  descriptionTr: string;
  targetDepthLevel: ProfileDepthLevel;
  requiredModuleCodes: string[];
}

export const JOURNEY_STAGES: Record<JourneyStage, JourneyStageMetadata> = {
  ONBOARDING: {
    stageKey: 'ONBOARDING',
    titleTr: 'Başlangıç Aşaması',
    descriptionTr: 'Psikolojik yolculuğunuza ilk temel kişilik değerlendirmesiyle adım atın.',
    targetDepthLevel: 'STARTING',
    requiredModuleCodes: ['mod_core_hexaco_60'],
  },
  FIRST_PROFILE: {
    stageKey: 'FIRST_PROFILE',
    titleTr: 'İlk Profil (Temel Katman)',
    descriptionTr: 'Kişilik, benlik, duygu düzenleme ve bilişsel tarz boyutlarını içeren 4 temel modül (189 soru).',
    targetDepthLevel: 'CORE',
    requiredModuleCodes: ['mod_core_hexaco_60', 'mod_self_agency', 'mod_emotion_regulation', 'mod_cognitive_epistemic'],
  },
  PROFILE_EXPANSION: {
    stageKey: 'PROFILE_EXPANSION',
    titleTr: 'Profil Genişletme (Genişletilmiş Katman)',
    descriptionTr: 'İrade, temel ihtiyaçlar, evrensel değerler ve ilişkisel bağlanma boyutlarıyla profilinizi genişletin (298 kümülatif soru).',
    targetDepthLevel: 'EXPANDED',
    requiredModuleCodes: [
      'mod_volition_impulse',
      'mod_basic_needs_sdt',
      'mod_universal_values',
      'mod_relational_attachment_empathy',
    ],
  },
  DEEP_PROFILE: {
    stageKey: 'DEEP_PROFILE',
    titleTr: 'Derin Profil (Kapsamlı Katman)',
    descriptionTr: 'Bilişsel esneklik, benlik bütünlüğü, çatışma, duygulanım dengesi, canlılık, başa çıkma ve yaratıcılık alanlarında derinleşin (448 kümülatif soru).',
    targetDepthLevel: 'COMPREHENSIVE',
    requiredModuleCodes: [
      'mod_cognitive_adaptability',
      'mod_meaning_compassion_grit',
      'mod_conflict_boundaries',
      'mod_affective_distress',
      'mod_flourishing_vitality',
      'mod_coping_resilience',
      'mod_creativity_growth',
    ],
  },
  ADVANCED_EXPLORATION: {
    stageKey: 'ADVANCED_EXPLORATION',
    titleTr: 'İleri Düzey İnceleme (Uç Dinamikler)',
    descriptionTr: 'Subklinik kişilik dinamikleri ve ileri düzey araştırmalar (469 kümülatif soru).',
    targetDepthLevel: 'ADVANCED',
    requiredModuleCodes: ['mod_dark_tetrad_advanced'],
  },
  COMPREHENSIVE_COMPLETE: {
    stageKey: 'COMPREHENSIVE_COMPLETE',
    titleTr: 'Tam Kapsamlı Profil',
    descriptionTr: '11 psikolojik alanın ve 37 yapının tümünde bilimsel ölçüm tamamlandı.',
    targetDepthLevel: 'COMPREHENSIVE',
    requiredModuleCodes: [],
  },
};

export interface ModulePortfolioItem {
  assessmentId: string;
  moduleCode: string;
  stage: 'CORE' | 'EXPANSION' | 'DEEP' | 'ADVANCED';
  journeyStage: JourneyStage;
  categoryKey: CatalogCategory;
  classification: JourneyClassification;
  priority: number;
  titleTr: string;
  titleEn: string;
  subtitleTr?: string;
  descriptionTr: string;
  rationaleTr: string;
  targetDomainCode: string;
  targetConstructCodes: string[];
  targetFacetCodes: string[];
  instruments: string[];
  scoringModelCode: string;
  estimatedItemCount: number;
  estimatedMinutes: number;
  requiredForFirstProfile: boolean;
  requiredForComprehensiveProfile: boolean;
  subscales: Array<{ code: string; nameTr: string; nameEn: string; itemCount: number; constructId: string }>;
  profileContribution: {
    domains: string[];
    constructs: string[];
    facets: number;
    visualizations: string[];
  };
}

export const LEGACY_FORM_CODES = ['form_hexaco_v1_0_0'];

/**
 * Authoritative Static Default Portfolio of all 16 PsycheAI Native modules.
 */
export const DEFAULT_ASSESSMENT_MODULE_PORTFOLIO: ModulePortfolioItem[] = [
  // --- CORE STAGE (4 Modules, 189 Questions) ---
  {
    assessmentId: 'mod_core_hexaco_60',
    moduleCode: 'mod_core_hexaco_60',
    stage: 'CORE',
    journeyStage: 'FIRST_PROFILE',
    categoryKey: 'PERSONALITY',
    classification: 'REQUIRED',
    priority: 1,
    titleTr: 'Temel Kişilik Yapısı',
    titleEn: 'Core Personality Structure',
    subtitleTr: 'Dürüstlük-Alçakgönüllülük, Duygusallık, Dışadönüklük, Uyumluluk, Sorumluluk, Açıklık (24 Alt Boyut)',
    descriptionTr: 'Psikolojik profilinizin temel omurgasını oluşturan 6 temel faktörü ve 24 alt boyutu kapsamlı olarak ölçer.',
    rationaleTr: 'Bireysel psikolojik analizin temel referans çerçevesidir.',
    targetDomainCode: 'core_personality',
    targetConstructCodes: [
      'hexaco_honesty_humility',
      'hexaco_emotionality',
      'hexaco_extraversion',
      'hexaco_agreeableness',
      'hexaco_conscientiousness',
      'hexaco_openness',
    ],
    targetFacetCodes: [],
    instruments: ['PSYCHEAI_NATIVE_CORE_PERSONALITY'],
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    estimatedItemCount: 124,
    estimatedMinutes: 18,
    requiredForFirstProfile: true,
    requiredForComprehensiveProfile: true,
    subscales: [],
    profileContribution: { domains: ['core_personality'], constructs: [], facets: 24, visualizations: ['HEXACO_RADAR'] },
  },
  {
    assessmentId: 'mod_self_agency',
    moduleCode: 'mod_self_agency',
    stage: 'CORE',
    journeyStage: 'FIRST_PROFILE',
    categoryKey: 'SELF_REGULATION',
    classification: 'REQUIRED',
    priority: 2,
    titleTr: 'Benlik Sistemi ve Öz-Yetkinlik',
    titleEn: 'Self-System & Agency',
    subtitleTr: 'Temel Benlik Saygısı, Koşullu Değerlilik, Genel Öz-Yetkinlik ve Özgünlük',
    descriptionTr: 'İçsel değerlilik algınızı, koşullu benlik dinamiklerinizi ve zorluklarla başa çıkma inancınızı ölçer.',
    rationaleTr: 'Duygusal dayanıklılık ve hedeflere yönelimde belirleyicidir.',
    targetDomainCode: 'self_system',
    targetConstructCodes: ['self_evaluation_agency'],
    targetFacetCodes: ['core_self_esteem', 'contingent_self_worth', 'generalized_self_efficacy', 'authenticity'],
    instruments: ['PSYCHEAI_NATIVE_SELF_AGENCY'],
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    estimatedItemCount: 22,
    estimatedMinutes: 5,
    requiredForFirstProfile: true,
    requiredForComprehensiveProfile: true,
    subscales: [],
    profileContribution: { domains: ['self_system'], constructs: [], facets: 4, visualizations: ['SPECTRUM'] },
  },
  {
    assessmentId: 'mod_emotion_regulation',
    moduleCode: 'mod_emotion_regulation',
    stage: 'CORE',
    journeyStage: 'FIRST_PROFILE',
    categoryKey: 'EMOTION',
    classification: 'REQUIRED',
    priority: 3,
    titleTr: 'Duygu Düzenleme Stratejileri',
    titleEn: 'Emotion Regulation Strategies',
    subtitleTr: 'Bilişsel Yeniden Değerlendirme, İfadeyi Bastırma, Sıkıntı Toleransı ve Yaşantısal Kaçınma',
    descriptionTr: 'Duygusal deneyimleri dönüştürme, tolere etme ve ifade etme tarzlarınızı kapsamlı eksenlerde değerlendirir.',
    rationaleTr: 'Stres yönetimi ve duygusal esenliğin anahtarıdır.',
    targetDomainCode: 'emotion_regulation',
    targetConstructCodes: ['emotion_regulation_strategies'],
    targetFacetCodes: ['cognitive_reappraisal', 'expressive_suppression', 'distress_tolerance', 'experiential_avoidance'],
    instruments: ['PSYCHEAI_NATIVE_EMOTION_REGULATION'],
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    estimatedItemCount: 21,
    estimatedMinutes: 5,
    requiredForFirstProfile: true,
    requiredForComprehensiveProfile: true,
    subscales: [],
    profileContribution: { domains: ['emotion_regulation'], constructs: [], facets: 4, visualizations: ['SPECTRUM'] },
  },
  {
    assessmentId: 'mod_cognitive_epistemic',
    moduleCode: 'mod_cognitive_epistemic',
    stage: 'CORE',
    journeyStage: 'FIRST_PROFILE',
    categoryKey: 'COGNITION',
    classification: 'REQUIRED',
    priority: 4,
    titleTr: 'Bilişsel Tarz ve Zihinsel Yönelim',
    titleEn: 'Cognitive Style & Epistemic Orientation',
    subtitleTr: 'Biliş İhtiyacı, Bilişsel Kapanma, Rasyonel ve Sezgisel Düşünme Tarzları',
    descriptionTr: 'Zihinsel çaba gösterme arzunuzu, belirsizlikten kaçınma ihtiyacınızı ve analitik-sezgisel düşünme eğilimlerinizi inceler.',
    rationaleTr: 'Karar alma kalitesi ve problem çözme yaklaşımını belirler.',
    targetDomainCode: 'cognition_decision',
    targetConstructCodes: ['epistemic_cognitive_style'],
    targetFacetCodes: ['need_for_cognition', 'need_for_cognitive_closure', 'rational_analytical_thinking', 'intuitive_experiential_thinking'],
    instruments: ['PSYCHEAI_NATIVE_COGNITIVE_EPISTEMIC'],
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    estimatedItemCount: 22,
    estimatedMinutes: 5,
    requiredForFirstProfile: true,
    requiredForComprehensiveProfile: true,
    subscales: [],
    profileContribution: { domains: ['cognition_decision'], constructs: [], facets: 4, visualizations: ['SPECTRUM'] },
  },

  // --- EXPANSION STAGE (4 Modules, 109 Questions, Cumulative: 298) ---
  {
    assessmentId: 'mod_volition_impulse',
    moduleCode: 'mod_volition_impulse',
    stage: 'EXPANSION',
    journeyStage: 'PROFILE_EXPANSION',
    categoryKey: 'SELF_REGULATION',
    classification: 'RECOMMENDED',
    priority: 5,
    titleTr: 'İrade, Öz-Kontrol ve Dürtüsellik',
    titleEn: 'Volition, Self-Control & Impulsivity',
    subtitleTr: 'Aciliyet Boyutları, Planlama, Sebat, Öz-Kontrol, Gecikmeli Ödül ve Uzun Vadeli Azim',
    descriptionTr: 'Hedefe odaklanma gücünü, anlık dürtüleri yönetme kapasitesini ve uzun vadeli sebat dinamiklerini inceler.',
    rationaleTr: 'Hedef gerçekleştirme ve alışkanlık yönetiminde kritiktir.',
    targetDomainCode: 'self_regulation',
    targetConstructCodes: ['volitional_control', 'impulsivity_facets'],
    targetFacetCodes: [
      'uppsp_negative_urgency',
      'uppsp_positive_urgency',
      'uppsp_lack_of_premeditation',
      'uppsp_lack_of_perseverance',
      'uppsp_sensation_seeking',
      'general_self_control',
      'delay_discounting_preference',
      'long_term_grit',
    ],
    instruments: ['PSYCHEAI_NATIVE_VOLITION_IMPULSE'],
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    estimatedItemCount: 43,
    estimatedMinutes: 8,
    requiredForFirstProfile: false,
    requiredForComprehensiveProfile: true,
    subscales: [],
    profileContribution: { domains: ['self_regulation'], constructs: [], facets: 8, visualizations: ['SPECTRUM'] },
  },
  {
    assessmentId: 'mod_basic_needs_sdt',
    moduleCode: 'mod_basic_needs_sdt',
    stage: 'EXPANSION',
    journeyStage: 'PROFILE_EXPANSION',
    categoryKey: 'MOTIVATION_VALUES',
    classification: 'RECOMMENDED',
    priority: 6,
    titleTr: 'Temel Psikolojik İhtiyaçlar',
    titleEn: 'Basic Psychological Needs',
    subtitleTr: 'Özerklik, Yetkinlik ve İlişkililik İhtiyaç Doyumu',
    descriptionTr: 'Yaşamınızdaki temel psikolojik besinlerin doyum düzeylerini ve özerk motivasyon kaynaklarınızı haritalandırır.',
    rationaleTr: 'İçsel motivasyon, tükenmişlik ve psikolojik canlılığın belirleyicisidir.',
    targetDomainCode: 'motivation_values',
    targetConstructCodes: ['basic_psychological_needs'],
    targetFacetCodes: ['autonomy_need_satisfaction', 'competence_need_satisfaction', 'relatedness_need_satisfaction'],
    instruments: ['PSYCHEAI_NATIVE_BASIC_NEEDS'],
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    estimatedItemCount: 15,
    estimatedMinutes: 4,
    requiredForFirstProfile: false,
    requiredForComprehensiveProfile: true,
    subscales: [],
    profileContribution: { domains: ['motivation_values'], constructs: [], facets: 3, visualizations: ['SPECTRUM'] },
  },
  {
    assessmentId: 'mod_universal_values',
    moduleCode: 'mod_universal_values',
    stage: 'EXPANSION',
    journeyStage: 'PROFILE_EXPANSION',
    categoryKey: 'MOTIVATION_VALUES',
    classification: 'RECOMMENDED',
    priority: 7,
    titleTr: 'Evrensel İnsani Değerler ve Motivasyon',
    titleEn: 'Universal Human Values & Motivation',
    subtitleTr: 'Değişime Açıklık, Öz-Aşma, Koruma, Öz-Gelişim ve Başarı Güdüsü',
    descriptionTr: 'Kararlarınıza ve yaşam tercihlerinize yön veren temel değer önceliklerinizi ve anlam dinamiklerinizi ortaya koyar.',
    rationaleTr: 'Yaşam yönelimi ve etik tutarlılığın çekirdeğidir.',
    targetDomainCode: 'motivation_values',
    targetConstructCodes: ['schwartz_higher_order_values', 'achievement_striving'],
    targetFacetCodes: [
      'schwartz_openness_to_change',
      'schwartz_self_transcendence',
      'schwartz_conservation',
      'schwartz_self_enhancement',
      'presence_of_meaning',
      'search_for_meaning',
    ],
    instruments: ['PSYCHEAI_NATIVE_UNIVERSAL_VALUES'],
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    estimatedItemCount: 31,
    estimatedMinutes: 6,
    requiredForFirstProfile: false,
    requiredForComprehensiveProfile: true,
    subscales: [],
    profileContribution: { domains: ['motivation_values'], constructs: [], facets: 6, visualizations: ['SPECTRUM'] },
  },
  {
    assessmentId: 'mod_relational_attachment_empathy',
    moduleCode: 'mod_relational_attachment_empathy',
    stage: 'EXPANSION',
    journeyStage: 'PROFILE_EXPANSION',
    categoryKey: 'RELATIONSHIPS',
    classification: 'RECOMMENDED',
    priority: 8,
    titleTr: 'İlişkisel Bağlanma ve Empati',
    titleEn: 'Relational Attachment & Empathy',
    subtitleTr: 'Bağlanma Kaygısı/Kaçınması, Bilişsel Perspektif Alma ve Empatik İlgi',
    descriptionTr: 'Yakın ilişkilerdeki güven/mesafe kalıplarınızı ve başkalarının duygularını anlama biçiminizi inceler.',
    rationaleTr: 'Sosyal uyum, iletişim derinliği ve ilişki sağlığını belirler.',
    targetDomainCode: 'social_relational',
    targetConstructCodes: ['adult_attachment', 'interpersonal_competence'],
    targetFacetCodes: [
      'attachment_anxiety',
      'attachment_avoidance',
      'cognitive_perspective_taking',
      'empathic_concern',
    ],
    instruments: ['PSYCHEAI_NATIVE_ATTACHMENT_EMPATHY'],
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    estimatedItemCount: 20,
    estimatedMinutes: 5,
    requiredForFirstProfile: false,
    requiredForComprehensiveProfile: true,
    subscales: [],
    profileContribution: { domains: ['social_relational'], constructs: [], facets: 4, visualizations: ['SPECTRUM'] },
  },

  // --- DEEP STAGE (7 Modules, 150 Questions, Cumulative: 448) ---
  {
    assessmentId: 'mod_cognitive_adaptability',
    moduleCode: 'mod_cognitive_adaptability',
    stage: 'DEEP',
    journeyStage: 'DEEP_PROFILE',
    categoryKey: 'COGNITION',
    classification: 'OPTIONAL',
    priority: 9,
    titleTr: 'Bilişsel Esneklik ve Karar Verme',
    titleEn: 'Cognitive Adaptability & Decision Making',
    subtitleTr: 'Bilişsel Esneklik, Belirsizlik Toleransı, Ruminasyon, Maksimizasyon ve Erteleme',
    descriptionTr: 'Değişen koşullara uyum sağlama hızınızı ve karar alma süreçlerindeki zihinsel kalıplarınızı ölçer.',
    rationaleTr: 'Problem çözme ve karmaşık karar alma süreçlerinde destekleyicidir.',
    targetDomainCode: 'cognition_decision',
    targetConstructCodes: ['decision_making_approach'],
    targetFacetCodes: [
      'cognitive_flexibility',
      'intolerance_of_uncertainty',
      'rumination_brooding',
      'decision_style_maximizing',
      'procrastination_tendency',
    ],
    instruments: ['PSYCHEAI_NATIVE_COGNITIVE_ADAPTABILITY'],
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    estimatedItemCount: 25,
    estimatedMinutes: 5,
    requiredForFirstProfile: false,
    requiredForComprehensiveProfile: true,
    subscales: [],
    profileContribution: { domains: ['cognition_decision'], constructs: [], facets: 5, visualizations: ['SPECTRUM'] },
  },
  {
    assessmentId: 'mod_meaning_compassion_grit',
    moduleCode: 'mod_meaning_compassion_grit',
    stage: 'DEEP',
    journeyStage: 'DEEP_PROFILE',
    categoryKey: 'SELF_REGULATION',
    classification: 'OPTIONAL',
    priority: 10,
    titleTr: 'Benlik Bütünlüğü ve Öz-Şefkat',
    titleEn: 'Self-Clarity, Continuity & Self-Compassion',
    subtitleTr: 'Öz-Şefkat, İçsel/Dışsal Denetim Odağı ve Benlik Kavramı Belirginliği',
    descriptionTr: 'Zor zamanlarda kendinize anlayış gösterme, içsel kontrol inancı ve benlik yapınızın netliğini analiz eder.',
    rationaleTr: 'Zorlu yaşam dönemlerinde içsel bütünlüğü korumanın dayanağıdır.',
    targetDomainCode: 'self_system',
    targetConstructCodes: ['self_structure'],
    targetFacetCodes: [
      'self_compassion',
      'locus_of_control_internal',
      'locus_of_control_external',
      'self_concept_clarity',
    ],
    instruments: ['PSYCHEAI_NATIVE_SELF_STRUCTURE'],
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    estimatedItemCount: 20,
    estimatedMinutes: 5,
    requiredForFirstProfile: false,
    requiredForComprehensiveProfile: true,
    subscales: [],
    profileContribution: { domains: ['self_system'], constructs: [], facets: 4, visualizations: ['SPECTRUM'] },
  },
  {
    assessmentId: 'mod_conflict_boundaries',
    moduleCode: 'mod_conflict_boundaries',
    stage: 'DEEP',
    journeyStage: 'DEEP_PROFILE',
    categoryKey: 'RELATIONSHIPS',
    classification: 'OPTIONAL',
    priority: 11,
    titleTr: 'Kişilerarası İletişim ve Sınır Yönetimi',
    titleEn: 'Interpersonal Boundaries & Assertiveness',
    subtitleTr: 'Girişkenlik, Reddedilme Duyarlılığı, Çatışmadan Kaçınma ve Sosyal Bağlılık',
    descriptionTr: 'Anlaşmazlık durumlarında sergilediğiniz iletişim biçimlerini ve sınır koyma dinamiklerinizi ölçer.',
    rationaleTr: 'İlişkilerde yıpranmayı önler ve dengeli işbirliklerini mümkün kılar.',
    targetDomainCode: 'social_relational',
    targetConstructCodes: ['interpersonal_competence'],
    targetFacetCodes: [
      'assertiveness',
      'rejection_sensitivity_nonclinical',
      'conflict_avoidance',
      'social_connectedness',
    ],
    instruments: ['PSYCHEAI_NATIVE_CONFLICT_BOUNDARIES'],
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    estimatedItemCount: 20,
    estimatedMinutes: 4,
    requiredForFirstProfile: false,
    requiredForComprehensiveProfile: true,
    subscales: [],
    profileContribution: { domains: ['social_relational'], constructs: [], facets: 4, visualizations: ['SPECTRUM'] },
  },
  {
    assessmentId: 'mod_affective_distress',
    moduleCode: 'mod_affective_distress',
    stage: 'DEEP',
    journeyStage: 'DEEP_PROFILE',
    categoryKey: 'EMOTION',
    classification: 'OPTIONAL',
    priority: 12,
    titleTr: 'Duygusal Tepkisellik ve Beden Farkındalığı',
    titleEn: 'Affective Tone & Somatic Awareness',
    subtitleTr: 'Pozitif/Negatif Duygulanım, Duygusal Şiddet, Utanç ve Suçluluk Eğilimleri',
    descriptionTr: 'Genel duygulanım dengenizi, duygusal tepki yoğunluğunuzu ve öz-bilinçli duygu örüntülerinizi analiz eder.',
    rationaleTr: 'Ruh hali dengesi ve duygusal toparlanma hızını gösterir.',
    targetDomainCode: 'emotion_regulation',
    targetConstructCodes: ['affective_style_awareness'],
    targetFacetCodes: [
      'positive_affect_trait',
      'negative_affect_trait',
      'affect_intensity',
      'shame_proneness',
      'guilt_proneness',
    ],
    instruments: ['PSYCHEAI_NATIVE_AFFECTIVE_DISTRESS'],
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    estimatedItemCount: 25,
    estimatedMinutes: 5,
    requiredForFirstProfile: false,
    requiredForComprehensiveProfile: true,
    subscales: [],
    profileContribution: { domains: ['emotion_regulation'], constructs: [], facets: 5, visualizations: ['SPECTRUM'] },
  },
  {
    assessmentId: 'mod_flourishing_vitality',
    moduleCode: 'mod_flourishing_vitality',
    stage: 'DEEP',
    journeyStage: 'DEEP_PROFILE',
    categoryKey: 'MOTIVATION_VALUES',
    classification: 'OPTIONAL',
    priority: 13,
    titleTr: 'İyilik Hali, Canlılık ve İş Birliği',
    titleEn: 'Psychological Flourishing & Vitality',
    subtitleTr: 'Psikolojik Gelişme, Öznel Canlılık, Yaşam Doyumu ve İş Birliği Yönelimi',
    descriptionTr: 'Bütüncül yaşam kalitenizi, enerjik canlılık hissinizi ve toplumsal iş birliği motivasyonunuzu değerlendirir.',
    rationaleTr: 'Yaşam kalitesi ve pozitif psikolojik işlevselliğin göstergesidir.',
    targetDomainCode: 'wellbeing_vitality',
    targetConstructCodes: ['subjective_wellbeing', 'interpersonal_competence'],
    targetFacetCodes: [
      'flourishing_scale',
      'subjective_vitality',
      'satisfaction_with_life',
      'cooperation_orientation',
    ],
    instruments: ['PSYCHEAI_NATIVE_FLOURISHING_VITALITY'],
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    estimatedItemCount: 20,
    estimatedMinutes: 4,
    requiredForFirstProfile: false,
    requiredForComprehensiveProfile: true,
    subscales: [],
    profileContribution: { domains: ['wellbeing_vitality', 'social_relational'], constructs: [], facets: 4, visualizations: ['SPECTRUM'] },
  },
  {
    assessmentId: 'mod_coping_resilience',
    moduleCode: 'mod_coping_resilience',
    stage: 'DEEP',
    journeyStage: 'DEEP_PROFILE',
    categoryKey: 'EMOTION',
    classification: 'OPTIONAL',
    priority: 14,
    titleTr: 'Stresle Başa Çıkma ve Psikolojik Dayanıklılık',
    titleEn: 'Coping Strategies & Resilience',
    subtitleTr: 'Ego Dayanıklılığı, Stresten Toparlanma, Problem ve Duygu Odaklı Başa Çıkma',
    descriptionTr: 'Stresli olaylarla yüzleşme mekanizmalarınızı ve zorluklar karşısındaki toparlanma hızınızı ölçer.',
    rationaleTr: 'Uzun vadeli zorluklar karşısında psikolojik sağlamlığı destekler.',
    targetDomainCode: 'coping_resilience',
    targetConstructCodes: ['trait_resilience', 'coping_strategies'],
    targetFacetCodes: [
      'ego_resilience',
      'stress_recovery',
      'problem_focused_coping',
      'emotion_focused_coping',
    ],
    instruments: ['PSYCHEAI_NATIVE_COPING_RESILIENCE'],
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    estimatedItemCount: 20,
    estimatedMinutes: 4,
    requiredForFirstProfile: false,
    requiredForComprehensiveProfile: true,
    subscales: [],
    profileContribution: { domains: ['coping_resilience'], constructs: [], facets: 4, visualizations: ['SPECTRUM'] },
  },
  {
    assessmentId: 'mod_creativity_growth',
    moduleCode: 'mod_creativity_growth',
    stage: 'DEEP',
    journeyStage: 'DEEP_PROFILE',
    categoryKey: 'COGNITION',
    classification: 'OPTIONAL',
    priority: 15,
    titleTr: 'Yaratıcılık, Merak ve Gelişim Zihniyeti',
    titleEn: 'Creativity, Curiosity & Growth Mindset',
    subtitleTr: 'Keşif Merakı, Yoksunluk Merakı, Yaratıcı Öz-Yetkinlik ve Gelişim Zihniyeti',
    descriptionTr: 'Yaratıcı potansiyelinize olan inancınızı, epistemik merak boyutlarınızı ve zihniyet esnekliğinizi analiz eder.',
    rationaleTr: 'Öğrenme çevikliği ve yenilikçi düşünme potansiyelini besler.',
    targetDomainCode: 'creativity_curiosity',
    targetConstructCodes: ['epistemic_curiosity', 'creative_growth_mindset'],
    targetFacetCodes: [
      'joyous_exploration_curiosity',
      'deprivation_sensitivity_curiosity',
      'creative_self_efficacy',
      'growth_mindset_intelligence',
    ],
    instruments: ['PSYCHEAI_NATIVE_CREATIVITY_GROWTH'],
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    estimatedItemCount: 20,
    estimatedMinutes: 4,
    requiredForFirstProfile: false,
    requiredForComprehensiveProfile: true,
    subscales: [],
    profileContribution: { domains: ['creativity_curiosity'], constructs: [], facets: 4, visualizations: ['SPECTRUM'] },
  },

  // --- ADVANCED STAGE (1 Module, 21 Questions, Cumulative Total: 469) ---
  {
    assessmentId: 'mod_dark_tetrad_advanced',
    moduleCode: 'mod_dark_tetrad_advanced',
    stage: 'ADVANCED',
    journeyStage: 'ADVANCED_EXPLORATION',
    categoryKey: 'ADVANCED',
    classification: 'ADVANCED',
    priority: 16,
    titleTr: 'Subklinik Kişilik Dinamikleri (Opsiyonel)',
    titleEn: 'Subclinical Dark Tetrad Dynamics (Optional)',
    subtitleTr: 'Makyavelizm, Görkemli Narsisizm, Psikopati ve Gündelik Sadizm',
    descriptionTr: 'Kişilik yapısının subklinik stratejik ve karanlık boyutlarını bilimsel araştırma sınırlarında inceler.',
    rationaleTr: 'İleri düzey psikolojik araştırma ve subklinik kişilik dinamikleri incelemesidir.',
    targetDomainCode: 'optional_dark_tetrad',
    targetConstructCodes: ['dark_tetrad_subclinical'],
    targetFacetCodes: [
      'machiavellianism',
      'grandiose_narcissism',
      'psychopathy',
      'everyday_sadism_subclinical',
    ],
    instruments: ['PSYCHEAI_NATIVE_DARK_TETRAD'],
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    estimatedItemCount: 21,
    estimatedMinutes: 4,
    requiredForFirstProfile: false,
    requiredForComprehensiveProfile: false,
    subscales: [],
    profileContribution: { domains: ['optional_dark_tetrad'], constructs: [], facets: 4, visualizations: ['SPECTRUM'] },
  },
];

export const ASSESSMENT_MODULE_PORTFOLIO = DEFAULT_ASSESSMENT_MODULE_PORTFOLIO;

export interface QuestionBudgetSummary {
  coreQuestions: number;
  expansionQuestions: number;
  deepQuestions: number;
  advancedQuestions: number;
  expansionCumulativeQuestions: number;
  comprehensiveCumulativeQuestions: number;
  advancedTotalQuestions: number;
}

/**
 * Computes dynamic cumulative question budgets from any given list of modules or active forms.
 */
export function calculateCumulativeQuestionBudget(modules: ModulePortfolioItem[] = ASSESSMENT_MODULE_PORTFOLIO): QuestionBudgetSummary {
  let coreQuestions = 0;
  let expansionQuestions = 0;
  let deepQuestions = 0;
  let advancedQuestions = 0;

  for (const m of modules) {
    const count = m.estimatedItemCount || 0;
    if (m.stage === 'CORE') {
      coreQuestions += count;
    } else if (m.stage === 'EXPANSION') {
      expansionQuestions += count;
    } else if (m.stage === 'DEEP') {
      deepQuestions += count;
    } else if (m.stage === 'ADVANCED') {
      advancedQuestions += count;
    }
  }

  const expansionCumulativeQuestions = coreQuestions + expansionQuestions;
  const comprehensiveCumulativeQuestions = expansionCumulativeQuestions + deepQuestions;
  const advancedTotalQuestions = comprehensiveCumulativeQuestions + advancedQuestions;

  return {
    coreQuestions,
    expansionQuestions,
    deepQuestions,
    advancedQuestions,
    expansionCumulativeQuestions,
    comprehensiveCumulativeQuestions,
    advancedTotalQuestions,
  };
}

export function resolveActiveModuleBudget(moduleCode: string): number {
  const mod = ASSESSMENT_MODULE_PORTFOLIO.find(
    (m) => m.moduleCode.toLowerCase() === moduleCode.toLowerCase() || m.assessmentId.toLowerCase() === moduleCode.toLowerCase()
  );
  return mod?.estimatedItemCount || 20;
}

export interface ModuleJourneyRule extends ModulePortfolioItem {
  userFacingTitleTr: string;
  userFacingTitleEn: string;
  userFacingSubtitleTr?: string;
  recommendationReasonTr: string;
  domainNameTr: string;
  questionCountPlanned: number;
  catalogCategory: CatalogCategory;
  constructIdsCovered: string[];
  facetIdsCovered: string[];
}

let cachedArchitectureModules: ModuleJourneyRule[] | null = null;

export function loadAssessmentArchitectureModules(): ModuleJourneyRule[] {
  if (cachedArchitectureModules) {
    return cachedArchitectureModules;
  }

  try {
    const batteryPath = path.join(process.cwd(), 'data/research-battery/psycheai-modules-v1.json');
    if (fs.existsSync(batteryPath)) {
      const raw = fs.readFileSync(batteryPath, 'utf-8');
      const parsed = JSON.parse(raw);
      const modulesList = parsed.modules || [];

      const defaultPortfolioMap = new Map(DEFAULT_ASSESSMENT_MODULE_PORTFOLIO.map((m) => [m.assessmentId, m]));

      const loaded: ModuleJourneyRule[] = modulesList.map((m: any, index: number) => {
        const defaultMod = defaultPortfolioMap.get(m.moduleId) || defaultPortfolioMap.get(m.moduleCode);
        const stage = m.stage || (index < 4 ? 'CORE' : index < 8 ? 'EXPANSION' : index < 15 ? 'DEEP' : 'ADVANCED');
        const journeyStage = defaultMod?.journeyStage || ((index < 4 ? 'FIRST_PROFILE' : index < 8 ? 'PROFILE_EXPANSION' : index < 15 ? 'DEEP_PROFILE' : 'ADVANCED_EXPLORATION') as JourneyStage);
        const categoryKey = defaultMod?.categoryKey || (index < 4 ? 'PERSONALITY' : 'SELF_REGULATION');

        return {
          assessmentId: m.moduleId,
          moduleCode: m.moduleCode || m.moduleId,
          stage,
          journeyStage,
          categoryKey,
          catalogCategory: categoryKey,
          classification: (defaultMod?.classification || (stage === 'CORE' ? 'REQUIRED' : stage === 'ADVANCED' ? 'ADVANCED' : 'RECOMMENDED')) as JourneyClassification,
          priority: index + 1,
          titleTr: m.titleTr || defaultMod?.titleTr || 'Psikolojik Değerlendirme Modülü',
          titleEn: m.titleEn || defaultMod?.titleEn || 'Psychological Assessment Module',
          userFacingTitleTr: m.titleTr || defaultMod?.titleTr || 'Psikolojik Değerlendirme Modülü',
          userFacingTitleEn: m.titleEn || defaultMod?.titleEn || 'Psychological Assessment Module',
          subtitleTr: defaultMod?.subtitleTr || `${m.facetIds?.length || 0} psikolojik alt boyut`,
          userFacingSubtitleTr: defaultMod?.subtitleTr || `${m.facetIds?.length || 0} psikolojik alt boyut`,
          descriptionTr: defaultMod?.descriptionTr || `${m.titleTr} — PsycheAI Özgün Araştırma Modülü`,
          rationaleTr: defaultMod?.rationaleTr || 'Psikolojik profilinizi bilimsel olarak derinleştirmek için önerilen araştırma modülü.',
          recommendationReasonTr: defaultMod?.rationaleTr || 'Psikolojik profilinizi bilimsel olarak derinleştirmek için önerilen araştırma modülü.',
          targetDomainCode: m.domainIds?.[0] || defaultMod?.targetDomainCode || 'core_personality',
          domainNameTr: ASSESSMENT_CATALOG_CATEGORIES[categoryKey]?.nameTr || 'Psikolojik Boyut',
          targetConstructCodes: m.constructIds || defaultMod?.targetConstructCodes || [],
          constructIdsCovered: m.constructIds || defaultMod?.targetConstructCodes || [],
          targetFacetCodes: m.facetIds || defaultMod?.targetFacetCodes || [],
          facetIdsCovered: m.facetIds || defaultMod?.targetFacetCodes || [],
          instruments: [`PSYCHEAI_NATIVE_${m.moduleId.toUpperCase()}`],
          scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
          estimatedItemCount: m.totalItemsCount || defaultMod?.estimatedItemCount || 20,
          questionCountPlanned: m.totalItemsCount || defaultMod?.estimatedItemCount || 20,
          estimatedMinutes: m.estimatedMinutes || defaultMod?.estimatedMinutes || 5,
          requiredForFirstProfile: stage === 'CORE',
          requiredForComprehensiveProfile: stage !== 'ADVANCED',
          subscales: defaultMod?.subscales || [],
          profileContribution: defaultMod?.profileContribution || { domains: m.domainIds || [], constructs: m.constructIds || [], facets: m.facetIds?.length || 0, visualizations: ['SPECTRUM'] },
        };
      });

      cachedArchitectureModules = loaded;
      return loaded;
    }
  } catch {
    // Fallback if file read fails
  }

  // Fallback to default portfolio
  const defaultList: ModuleJourneyRule[] = DEFAULT_ASSESSMENT_MODULE_PORTFOLIO.map((m, index) => ({
    ...m,
    priority: index + 1,
    userFacingTitleTr: m.titleTr,
    userFacingTitleEn: m.titleEn,
    userFacingSubtitleTr: m.subtitleTr,
    recommendationReasonTr: m.rationaleTr,
    domainNameTr: ASSESSMENT_CATALOG_CATEGORIES[m.categoryKey]?.nameTr || 'Psikolojik Boyut',
    questionCountPlanned: m.estimatedItemCount,
    catalogCategory: m.categoryKey,
    constructIdsCovered: m.targetConstructCodes,
    facetIdsCovered: m.targetFacetCodes,
  }));
  cachedArchitectureModules = defaultList;
  return defaultList;
}

/**
 * Legacy compatibility alias for MODULE_JOURNEY_RULES
 */
export const MODULE_JOURNEY_RULES = DEFAULT_ASSESSMENT_MODULE_PORTFOLIO;

/**
 * Deterministically resolves journey metadata for any module code or assessment ID.
 */
export function getModuleJourneyMetadata(
  moduleIdentifier: string,
  moduleTitleTr?: string
): ModuleJourneyRule {
  const allModules = loadAssessmentArchitectureModules();
  const normalized = moduleIdentifier.toLowerCase().trim();

  // 1. Direct match by assessmentId / moduleCode
  const directMatch = allModules.find(
    (m) => m.assessmentId.toLowerCase() === normalized || m.moduleCode.toLowerCase() === normalized
  );
  if (directMatch) {
    return directMatch;
  }

  // 2. Fallback Heuristic Match
  if (normalized.includes('module_1') || normalized.includes('hexaco') || normalized.includes('intake') || normalized.includes('core') || normalized.includes('personality')) {
    const match = allModules.find((m) => m.assessmentId === 'mod_core_hexaco_60');
    if (match) return match;
  }

  if (normalized.includes('module_5') || normalized.includes('gse') || normalized.includes('general_self_efficacy') || normalized.includes('volition')) {
    const match = allModules.find((m) => m.assessmentId === 'mod_volition_impulse');
    if (match) return match;
  }

  if (normalized.includes('module_2') || normalized.includes('self') || normalized.includes('agency') || normalized.includes('rses') || normalized.includes('identity') || normalized.includes('concept')) {
    const match = allModules.find((m) => m.assessmentId === 'mod_self_agency');
    if (match) return match;
  }

  if (normalized.includes('module_3') || normalized.includes('erq') || normalized.includes('emotion') || normalized.includes('duygu') || normalized.includes('stress')) {
    const match = allModules.find((m) => m.assessmentId === 'mod_emotion_regulation');
    if (match) return match;
  }

  if (normalized.includes('module_4') || normalized.includes('epistemic') || normalized.includes('nfc') || normalized.includes('executive') || (normalized.includes('cognitive') && !normalized.includes('adaptability'))) {
    const match = allModules.find((m) => m.assessmentId === 'mod_cognitive_epistemic');
    if (match) return match;
  }

  if (normalized.includes('module_6') || normalized.includes('attachment') || normalized.includes('ecr_r') || normalized.includes('iri')) {
    const match = allModules.find((m) => m.assessmentId === 'mod_relational_attachment_empathy');
    if (match) return match;
  }

  // 3. Generic fallback
  return {
    assessmentId: moduleIdentifier,
    moduleCode: moduleIdentifier.toLowerCase(),
    stage: 'EXPANSION',
    journeyStage: 'PROFILE_EXPANSION',
    catalogCategory: 'SELF_REGULATION',
    categoryKey: 'SELF_REGULATION',
    classification: 'OPTIONAL',
    priority: 50,
    titleTr: moduleTitleTr || 'Psikolojik Değerlendirme',
    titleEn: 'Psychological Assessment',
    userFacingTitleTr: moduleTitleTr || 'Psikolojik Değerlendirme',
    userFacingTitleEn: 'Psychological Assessment',
    descriptionTr: 'Profilinize özel derinlemesine psikolojik içgörüler sunar.',
    rationaleTr: 'Profilinizi derinleştirmek için önerilen bilimsel modül.',
    recommendationReasonTr: 'Profilinize özel derinlemesine psikolojik içgörüler sunar.',
    targetDomainCode: 'self_system',
    domainNameTr: 'Genişletilmiş Analiz',
    targetConstructCodes: [],
    constructIdsCovered: [],
    targetFacetCodes: [],
    facetIdsCovered: [],
    instruments: [],
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    estimatedItemCount: 20,
    questionCountPlanned: 20,
    estimatedMinutes: 5,
    requiredForFirstProfile: false,
    requiredForComprehensiveProfile: true,
    subscales: [],
    profileContribution: { domains: [], constructs: [], facets: 0, visualizations: [] },
  };
}

