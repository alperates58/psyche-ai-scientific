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
    descriptionTr: 'Kişilik, benlik, duygu düzenleme ve biliş boyutlarını içeren 4 temel modül (108 soru).',
    targetDepthLevel: 'CORE',
    requiredModuleCodes: ['mod_core_hexaco_60', 'mod_self_agency', 'mod_emotion_regulation', 'mod_cognitive_epistemic'],
  },
  PROFILE_EXPANSION: {
    stageKey: 'PROFILE_EXPANSION',
    titleTr: 'Profil Genişletme (Genişletilmiş Katman)',
    descriptionTr: 'İrade, temel ihtiyaçlar, değerler ve bağlanma boyutlarıyla profilinizi genişletin (265 kümülatif soru).',
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
    descriptionTr: 'Bilişsel esneklik, anlam, çatışma, sıkıntı, canlılık, başa çıkma ve yaratıcılık alanlarında derinleşin (431 kümülatif soru).',
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
    descriptionTr: 'Karanlık Dörtlü ve ileri düzey kişilik araştırmaları (459 kümülatif soru).',
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
 * Authoritative Static Default Portfolio of all 16 modules.
 */
export const DEFAULT_ASSESSMENT_MODULE_PORTFOLIO: ModulePortfolioItem[] = [
  // --- CORE STAGE (4 Modules, 108 Questions) ---
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
    subtitleTr: 'Dürüstlük-Alçakgönüllülük, Duygusallık, Dışadönüklük, Uyumluluk, Sorumluluk, Deneyime Açıklık',
    descriptionTr: 'Psikolojik profilinizin temel omurgasını oluşturan 6 temel faktörü ve alt boyutları ölçer.',
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
    instruments: ['HEXACO-60'],
    scoringModelCode: 'HEXACO_PRECALIBRATION_V1',
    estimatedItemCount: 60,
    estimatedMinutes: 12,
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
    titleEn: 'Self-System & Generalized Agency',
    subtitleTr: 'Temel Benlik Saygısı ve Genel Öz-Yeterlik',
    descriptionTr: 'İçsel değerlilik algınızı ve zorluklarla başa çıkma inancınızı bağımsız ölçeklerle ölçer.',
    rationaleTr: 'Duygusal dayanıklılık ve hedeflere yönelimde belirleyicidir.',
    targetDomainCode: 'self_system',
    targetConstructCodes: ['core_self_esteem', 'generalized_self_efficacy'],
    targetFacetCodes: [],
    instruments: ['RSES-10', 'GSE-10'],
    scoringModelCode: 'SELF_AGENCY_PRECALIBRATION_V1',
    estimatedItemCount: 20,
    estimatedMinutes: 4,
    requiredForFirstProfile: true,
    requiredForComprehensiveProfile: true,
    subscales: [],
    profileContribution: { domains: ['self_system'], constructs: [], facets: 3, visualizations: ['SPECTRUM'] },
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
    subtitleTr: 'Bilişsel Yeniden Değerlendirme ve İfadeyi Bastırma',
    descriptionTr: 'Duygusal deneyimleri dönüştürme ve ifade etme tarzlarınızı iki bağımsız eksende değerlendirir.',
    rationaleTr: 'Stres yönetimi ve duygusal esenliğin anahtarıdır.',
    targetDomainCode: 'emotional_affective',
    targetConstructCodes: ['cognitive_reappraisal', 'expressive_suppression'],
    targetFacetCodes: [],
    instruments: ['ERQ-10'],
    scoringModelCode: 'ERQ_MEAN_V1',
    estimatedItemCount: 10,
    estimatedMinutes: 2,
    requiredForFirstProfile: true,
    requiredForComprehensiveProfile: true,
    subscales: [],
    profileContribution: { domains: ['emotional_affective'], constructs: [], facets: 2, visualizations: ['SPECTRUM'] },
  },
  {
    assessmentId: 'mod_cognitive_epistemic',
    moduleCode: 'mod_cognitive_epistemic',
    stage: 'CORE',
    journeyStage: 'FIRST_PROFILE',
    categoryKey: 'COGNITION',
    classification: 'REQUIRED',
    priority: 4,
    titleTr: 'Bilişsel ve Epistemik Yönelim',
    titleEn: 'Cognitive & Epistemic Orientation',
    subtitleTr: 'Biliş İhtiyacı ve Epistemik Merak Boyutları',
    descriptionTr: 'Zihinsel çaba gösterme arzunuzu ve bilgiye ulaşma motivasyonunuzu analiz eder.',
    rationaleTr: 'Karar alma kalitesi ve problem çözme yaklaşımını belirler.',
    targetDomainCode: 'cognitive_epistemic',
    targetConstructCodes: ['epistemic_drive', 'epistemic_curiosity'],
    targetFacetCodes: [],
    instruments: ['NFC-18'],
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    estimatedItemCount: 18,
    estimatedMinutes: 4,
    requiredForFirstProfile: true,
    requiredForComprehensiveProfile: true,
    subscales: [],
    profileContribution: { domains: ['cognitive_epistemic'], constructs: [], facets: 3, visualizations: ['SPECTRUM'] },
  },

  // --- EXPANSION STAGE (4 Modules, 157 Questions, Cumulative: 265) ---
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
    subtitleTr: 'Öz-Kontrol Gücü ve Çok Boyutlu Dürtüsellik Dinamikleri',
    descriptionTr: 'Hedefe odaklanma gücünü, anlık dürtüleri erteleme kapasitesini ve sebat dinamiklerini inceler.',
    rationaleTr: 'Hedef gerçekleştirme ve alışkanlık yönetiminde kritiktir.',
    targetDomainCode: 'regulatory_volitional',
    targetConstructCodes: ['inhibitory_control', 'impulsivity_facets'],
    targetFacetCodes: [],
    instruments: ['BSCS-13', 'UPPS-P-Short-20'],
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    estimatedItemCount: 33,
    estimatedMinutes: 7,
    requiredForFirstProfile: false,
    requiredForComprehensiveProfile: true,
    subscales: [],
    profileContribution: { domains: ['regulatory_volitional'], constructs: [], facets: 7, visualizations: ['SPECTRUM'] },
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
    subtitleTr: 'Özerklik, Yetkinlik ve İlişkililik Doyumu ile Engellenmesi',
    descriptionTr: 'Yaşamınızdaki temel psikolojik besinlerin doyumunu ve engellenme düzeylerini haritalandırır.',
    rationaleTr: 'İçsel motivasyon, tükenmişlik ve psikolojik canlılığın belirleyicisidir.',
    targetDomainCode: 'motivational_value',
    targetConstructCodes: ['autonomy_need', 'competence_need', 'relatedness_need'],
    targetFacetCodes: [],
    instruments: ['BPNSFS-24'],
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    estimatedItemCount: 24,
    estimatedMinutes: 5,
    requiredForFirstProfile: false,
    requiredForComprehensiveProfile: true,
    subscales: [],
    profileContribution: { domains: ['motivational_value'], constructs: [], facets: 3, visualizations: ['SPECTRUM'] },
  },
  {
    assessmentId: 'mod_universal_values',
    moduleCode: 'mod_universal_values',
    stage: 'EXPANSION',
    journeyStage: 'PROFILE_EXPANSION',
    categoryKey: 'MOTIVATION_VALUES',
    classification: 'RECOMMENDED',
    priority: 7,
    titleTr: 'Evrensel İnsani Değerler',
    titleEn: 'Universal Human Values',
    subtitleTr: 'Schwartz Değerler Sistemi: Öz-Gelişim, Koruma, Öz-Aşma, Değişime Açıklık',
    descriptionTr: 'Kararlarınıza ve yaşam tercihlerinize yön veren temel değer önceliklerinizi ortaya koyar.',
    rationaleTr: 'Yaşam yönelimi ve etik tutarlılığın çekirdeğidir.',
    targetDomainCode: 'motivational_value',
    targetConstructCodes: ['conservation_values', 'openness_to_change_values', 'self_enhancement_values', 'self_transcendence_values'],
    targetFacetCodes: [],
    instruments: ['PVQ-RR-50'],
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    estimatedItemCount: 50,
    estimatedMinutes: 10,
    requiredForFirstProfile: false,
    requiredForComprehensiveProfile: true,
    subscales: [],
    profileContribution: { domains: ['motivational_value'], constructs: [], facets: 4, visualizations: ['SPECTRUM'] },
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
    subtitleTr: 'Bağlanma Kaygısı/Kaçınması ve Bilişsel/Duygusal Empati Boyutları',
    descriptionTr: 'Yakın ilişkilerdeki güven/mesafe kalıplarınızı ve başkalarının duygularını anlama biçiminizi inceler.',
    rationaleTr: 'Sosyal uyum, iletişim derinliği ve ilişki sağlığını belirler.',
    targetDomainCode: 'relational_interpersonal',
    targetConstructCodes: ['attachment_anxiety', 'attachment_avoidance', 'perspective_taking', 'empathic_concern'],
    targetFacetCodes: [],
    instruments: ['ECR-R-36', 'IRI-14'],
    scoringModelCode: 'ECR_R_MEAN_V1',
    estimatedItemCount: 50,
    estimatedMinutes: 10,
    requiredForFirstProfile: false,
    requiredForComprehensiveProfile: true,
    subscales: [],
    profileContribution: { domains: ['relational_interpersonal'], constructs: [], facets: 4, visualizations: ['SPECTRUM'] },
  },

  // --- DEEP STAGE (7 Modules, 166 Questions, Cumulative: 431) ---
  {
    assessmentId: 'mod_cognitive_adaptability',
    moduleCode: 'mod_cognitive_adaptability',
    stage: 'DEEP',
    journeyStage: 'DEEP_PROFILE',
    categoryKey: 'COGNITION',
    classification: 'OPTIONAL',
    priority: 9,
    titleTr: 'Bilişsel Esneklik ve Belirsizlik Yönetimi',
    titleEn: 'Cognitive Adaptability & Uncertainty Management',
    subtitleTr: 'Belirsizliğe Tahammülsüzlük ve Bilişsel Esneklik',
    descriptionTr: 'Değişen koşullara uyum sağlama hızınızı ve belirsizlik durumlarındaki zihinsel dayanıklılığınızı ölçer.',
    rationaleTr: 'Problem çözme ve karmaşık karar alma süreçlerinde destekleyicidir.',
    targetDomainCode: 'cognitive_epistemic',
    targetConstructCodes: ['ambiguity_tolerance', 'cognitive_flexibility'],
    targetFacetCodes: [],
    instruments: ['CFI-20', 'IUS-12'],
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    estimatedItemCount: 32,
    estimatedMinutes: 7,
    requiredForFirstProfile: false,
    requiredForComprehensiveProfile: true,
    subscales: [],
    profileContribution: { domains: ['cognitive_epistemic'], constructs: [], facets: 3, visualizations: ['SPECTRUM'] },
  },
  {
    assessmentId: 'mod_meaning_compassion_grit',
    moduleCode: 'mod_meaning_compassion_grit',
    stage: 'DEEP',
    journeyStage: 'DEEP_PROFILE',
    categoryKey: 'MOTIVATION_VALUES',
    classification: 'OPTIONAL',
    priority: 10,
    titleTr: 'Yaşam Anlamı, Öz-Şefkat ve Sebat',
    titleEn: 'Existential Meaning, Self-Compassion & Grit',
    subtitleTr: 'Anlam Arayışı/Varlığı, Kendine Şefkat ve Uzun Vadeli Azim',
    descriptionTr: 'Hayatın anlamını bulma, zor zamanlarda kendine anlayış gösterme ve hedeflere tutkuyla bağlılık seviyenizi analiz eder.',
    rationaleTr: 'Zorlu yaşam dönemlerinde içsel bütünlüğü korumanın dayanağıdır.',
    targetDomainCode: 'existential_meaning',
    targetConstructCodes: ['meaning_in_life', 'self_compassion', 'grit_perseverance'],
    targetFacetCodes: [],
    instruments: ['MLQ-10', 'SCS-SF-12', 'Grit-S-8'],
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    estimatedItemCount: 30,
    estimatedMinutes: 6,
    requiredForFirstProfile: false,
    requiredForComprehensiveProfile: true,
    subscales: [],
    profileContribution: { domains: ['existential_meaning', 'self_system'], constructs: [], facets: 4, visualizations: ['SPECTRUM'] },
  },
  {
    assessmentId: 'mod_conflict_boundaries',
    moduleCode: 'mod_conflict_boundaries',
    stage: 'DEEP',
    journeyStage: 'DEEP_PROFILE',
    categoryKey: 'RELATIONSHIPS',
    classification: 'OPTIONAL',
    priority: 11,
    titleTr: 'Çatışma Çözümü ve İlişki Sınırları',
    titleEn: 'Conflict Resolution Styles & Boundaries',
    subtitleTr: 'Çatışma Yönetim Stilleri ve Sağlıklı Kişisel Sınırlar',
    descriptionTr: 'Anlaşmazlık durumlarında sergilediğiniz davranış biçimlerini ve sınır koyma dinamiklerinizi ölçer.',
    rationaleTr: 'İlişkilerde yıpranmayı önler ve dengeli işbirliklerini mümkün kılar.',
    targetDomainCode: 'relational_interpersonal',
    targetConstructCodes: ['conflict_management_styles', 'boundary_regulation'],
    targetFacetCodes: [],
    instruments: ['DUTCH-20'],
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    estimatedItemCount: 20,
    estimatedMinutes: 4.5,
    requiredForFirstProfile: false,
    requiredForComprehensiveProfile: true,
    subscales: [],
    profileContribution: { domains: ['relational_interpersonal'], constructs: [], facets: 3, visualizations: ['SPECTRUM'] },
  },
  {
    assessmentId: 'mod_affective_distress',
    moduleCode: 'mod_affective_distress',
    stage: 'DEEP',
    journeyStage: 'DEEP_PROFILE',
    categoryKey: 'EMOTION',
    classification: 'OPTIONAL',
    priority: 12,
    titleTr: 'Duygusal Esenlik ve Sıkıntı Toleransı',
    titleEn: 'Affective Tone & Distress Tolerance',
    subtitleTr: 'Pozitif/Negatif Duygulanım Dengesi ve Zorlayıcı Duyguları Tolere Etme',
    descriptionTr: 'Genel duygulanım dengenizi ve yoğun stres/sıkıntı anlarındaki dayanma kapasitenizi analiz eder.',
    rationaleTr: 'Ruh hali dengesi ve duygusal toparlanma hızını gösterir.',
    targetDomainCode: 'emotional_affective',
    targetConstructCodes: ['positive_negative_affect', 'distress_tolerance'],
    targetFacetCodes: [],
    instruments: ['PANAS-20', 'DTS-15'],
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    estimatedItemCount: 35,
    estimatedMinutes: 7.5,
    requiredForFirstProfile: false,
    requiredForComprehensiveProfile: true,
    subscales: [],
    profileContribution: { domains: ['emotional_affective'], constructs: [], facets: 5, visualizations: ['SPECTRUM'] },
  },
  {
    assessmentId: 'mod_flourishing_vitality',
    moduleCode: 'mod_flourishing_vitality',
    stage: 'DEEP',
    journeyStage: 'DEEP_PROFILE',
    categoryKey: 'MOTIVATION_VALUES',
    classification: 'OPTIONAL',
    priority: 13,
    titleTr: 'Gelişme ve Psikolojik Canlılık',
    titleEn: 'Psychological Flourishing & Life Satisfaction',
    subtitleTr: 'Psikolojik İyilik Hali ve Öznel Canlılık Düzeyi',
    descriptionTr: 'Bütüncül yaşam kalitenizi, sosyal işlevselliğinizi ve enerjik canlılık hissinizi değerlendirir.',
    rationaleTr: 'Yaşam kalitesi ve pozitif psikolojik işlevselliğin göstergesidir.',
    targetDomainCode: 'motivational_value',
    targetConstructCodes: ['psychological_flourishing', 'subjective_vitality'],
    targetFacetCodes: [],
    instruments: ['FS-8', 'SWLS-5'],
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    estimatedItemCount: 13,
    estimatedMinutes: 3,
    requiredForFirstProfile: false,
    requiredForComprehensiveProfile: true,
    subscales: [],
    profileContribution: { domains: ['motivational_value'], constructs: [], facets: 3, visualizations: ['SPECTRUM'] },
  },
  {
    assessmentId: 'mod_coping_resilience',
    moduleCode: 'mod_coping_resilience',
    stage: 'DEEP',
    journeyStage: 'DEEP_PROFILE',
    categoryKey: 'EMOTION',
    classification: 'OPTIONAL',
    priority: 14,
    titleTr: 'Stresle Başa Çıkma ve Dayanıklılık',
    titleEn: 'Coping Strategies & Stress Resilience',
    subtitleTr: 'Problem/Duygu Odaklı Başa Çıkma ve Psikolojik Sağlamlık',
    descriptionTr: 'Stresli yaşam olaylarıyla yüzleşme biçiminizi ve toparlanma hızınızı ölçer.',
    rationaleTr: 'Uzun vadeli zorluklar karşısında psikolojik sağlamlığı destekler.',
    targetDomainCode: 'emotional_affective',
    targetConstructCodes: ['coping_repertoires', 'psychological_resilience'],
    targetFacetCodes: [],
    instruments: ['Brief-COPE-14', 'BRS-6'],
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    estimatedItemCount: 20,
    estimatedMinutes: 4.5,
    requiredForFirstProfile: false,
    requiredForComprehensiveProfile: true,
    subscales: [],
    profileContribution: { domains: ['emotional_affective'], constructs: [], facets: 4, visualizations: ['SPECTRUM'] },
  },
  {
    assessmentId: 'mod_creativity_growth',
    moduleCode: 'mod_creativity_growth',
    stage: 'DEEP',
    journeyStage: 'DEEP_PROFILE',
    categoryKey: 'COGNITION',
    classification: 'OPTIONAL',
    priority: 15,
    titleTr: 'Yaratıcı Öz-İnanç ve Gelişim Zihniyeti',
    titleEn: 'Creative Mindset & Epistemic Curiosity',
    subtitleTr: 'Yaratıcı Öz-Yeterlik ve Zihniyet Esnekliği',
    descriptionTr: 'Yaratıcı potansiyelinize olan inancınızı ve yeteneklerin geliştirilebilirliğine dair bakış açınızı analiz eder.',
    rationaleTr: 'Öğrenme çevikliği ve yenilikçi düşünme potansiyelini besler.',
    targetDomainCode: 'cognitive_epistemic',
    targetConstructCodes: ['creative_self_efficacy', 'growth_mindset'],
    targetFacetCodes: [],
    instruments: ['5DCR-10', 'CreativeSE-6'],
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    estimatedItemCount: 16,
    estimatedMinutes: 3.5,
    requiredForFirstProfile: false,
    requiredForComprehensiveProfile: true,
    subscales: [],
    profileContribution: { domains: ['cognitive_epistemic'], constructs: [], facets: 4, visualizations: ['SPECTRUM'] },
  },

  // --- ADVANCED STAGE (1 Module, 28 Questions, Cumulative Total: 459) ---
  {
    assessmentId: 'mod_dark_tetrad_advanced',
    moduleCode: 'mod_dark_tetrad_advanced',
    stage: 'ADVANCED',
    journeyStage: 'ADVANCED_EXPLORATION',
    categoryKey: 'ADVANCED',
    classification: 'ADVANCED',
    priority: 16,
    titleTr: 'Uç Kişilik Eğilimleri ve Dinamikler',
    titleEn: 'Short Dark Tetrad Personality Dimensions',
    subtitleTr: 'Makyavelizm, Narsisizm, Psikopati ve Sadizm Eğilimleri',
    descriptionTr: 'Kişilik yapısının uç ve gölgede kalan stratejik dinamiklerini bilimsel sınırlarla inceler.',
    rationaleTr: 'İleri düzey psikolojik araştırma ve uç kişilik dinamikleri incelemesidir.',
    targetDomainCode: 'integrity_validity',
    targetConstructCodes: ['machiavellianism', 'narcissism', 'psychopathy', 'sadism'],
    targetFacetCodes: [],
    instruments: ['SD4-28'],
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    estimatedItemCount: 28,
    estimatedMinutes: 6,
    requiredForFirstProfile: false,
    requiredForComprehensiveProfile: false,
    subscales: [],
    profileContribution: { domains: ['integrity_validity'], constructs: [], facets: 4, visualizations: ['SPECTRUM'] },
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
    const filePath = path.join(process.cwd(), 'data/assessment-architecture/assessment-architecture.json');
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      const loaded: ModuleJourneyRule[] = parsed.map((m: any, index: number) => ({
        assessmentId: m.assessmentId,
        moduleCode: m.assessmentId.toLowerCase(),
        stage: m.stage || (index < 4 ? 'CORE' : index < 8 ? 'EXPANSION' : index < 15 ? 'DEEP' : 'ADVANCED'),
        journeyStage: (index < 4 ? 'FIRST_PROFILE' : index < 8 ? 'PROFILE_EXPANSION' : index < 15 ? 'DEEP_PROFILE' : 'ADVANCED_EXPLORATION') as JourneyStage,
        categoryKey: (m.catalogCategory || 'PERSONALITY') as CatalogCategory,
        catalogCategory: (m.catalogCategory || 'PERSONALITY') as CatalogCategory,
        classification: (m.requiredForFirstProfile ? 'REQUIRED' : m.stage === 'ADVANCED' ? 'ADVANCED' : 'RECOMMENDED') as JourneyClassification,
        priority: index + 1,
        titleTr: m.titleTr,
        titleEn: m.titleEn,
        userFacingTitleTr: m.titleTr,
        userFacingTitleEn: m.titleEn,
        subtitleTr: m.subtitleTr,
        userFacingSubtitleTr: m.subtitleTr || `${m.constructIdsCovered?.length || 0} psikolojik yapı analizi`,
        descriptionTr: m.descriptionTr || m.rationale || 'Bilimsel psikometrik değerlendirme modülü.',
        rationaleTr: m.rationale || 'Profilinizi derinleştirmek için önerilen bilimsel modül.',
        recommendationReasonTr: m.rationale || 'Profilinizi derinleştirmek için önerilen bilimsel modül.',
        targetDomainCode: m.profileContribution?.domains?.[0] || 'core_personality',
        domainNameTr: ASSESSMENT_CATALOG_CATEGORIES[(m.catalogCategory || 'PERSONALITY') as CatalogCategory]?.nameTr || 'Psikolojik Boyut',
        targetConstructCodes: m.constructIdsCovered || [],
        constructIdsCovered: m.constructIdsCovered || [],
        targetFacetCodes: m.facetIdsCovered || [],
        facetIdsCovered: m.facetIdsCovered || [],
        instruments: m.instruments || [],
        scoringModelCode: m.scoringStrategyCode || 'PRE_CALIBRATION_MEAN_V1',
        estimatedItemCount: m.questionCountPlanned || 20,
        questionCountPlanned: m.questionCountPlanned || 20,
        estimatedMinutes: m.estimatedMinutes || 5,
        requiredForFirstProfile: !!m.requiredForFirstProfile,
        requiredForComprehensiveProfile: !!m.requiredForComprehensiveProfile,
        subscales: m.subscales || [],
        profileContribution: m.profileContribution || { domains: [], constructs: [], facets: 0, visualizations: [] },
      }));
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

