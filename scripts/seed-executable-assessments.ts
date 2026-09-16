import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ModuleSeedConfig {
  assessmentId: string;
  code: string;
  titleTr: string;
  titleEn: string;
  descriptionTr: string;
  descriptionEn: string;
  estimatedMinutes: number;
  stage: 'CORE' | 'EXPANSION' | 'DEEP' | 'ADVANCED';
  category: string;
  isExecutable: boolean;
  expectedItemCount: number;
  scoringModelCode: string;
  facetItemAllocations: Array<{ facetId: string; count: number }>;
}

export const MODULE_CONFIGS: ModuleSeedConfig[] = [
  // 1. CORE PERSONALITY (HEXACO-60)
  {
    assessmentId: 'mod_core_hexaco_60',
    code: 'mod_core_hexaco_60',
    titleTr: 'Modül 1: Temel Kişilik Boyutları (HEXACO-60)',
    titleEn: 'Module 1: Core Personality Dimensions (HEXACO-60)',
    descriptionTr: 'Altı temel kişilik faktörünün (Dürüstlük-Alçakgönüllülük, Duygusallık, Dışadönüklük, Uyumluluk, Sorumluluk, Deneyime Açıklık) ve 24 alt boyutunun psikometrik ölçümü.',
    descriptionEn: 'Psychometric measurement of the six core personality factors and 24 facets.',
    estimatedMinutes: 12,
    stage: 'CORE',
    category: 'PERSONALITY',
    isExecutable: true,
    expectedItemCount: 60,
    scoringModelCode: 'HEXACO_PRECALIBRATION_V1',
    facetItemAllocations: [
      { facetId: 'sincerity', count: 3 },
      { facetId: 'fairness', count: 3 },
      { facetId: 'greed_avoidance', count: 2 },
      { facetId: 'modesty', count: 2 },
      { facetId: 'fearfulness', count: 3 },
      { facetId: 'anxiety_proneness', count: 3 },
      { facetId: 'dependence', count: 2 },
      { facetId: 'sentimentality', count: 2 },
      { facetId: 'social_self_esteem', count: 3 },
      { facetId: 'social_boldness', count: 3 },
      { facetId: 'sociability', count: 2 },
      { facetId: 'liveliness', count: 2 },
      { facetId: 'forgiveness', count: 3 },
      { facetId: 'gentleness', count: 3 },
      { facetId: 'flexibility', count: 2 },
      { facetId: 'patience', count: 2 },
      { facetId: 'organization', count: 3 },
      { facetId: 'diligence', count: 3 },
      { facetId: 'perfectionism', count: 2 },
      { facetId: 'prudence', count: 2 },
      { facetId: 'aesthetic_appreciation', count: 3 },
      { facetId: 'inquisitiveness', count: 3 },
      { facetId: 'creativity', count: 2 },
      { facetId: 'unconventionality', count: 2 },
    ],
  },

  // 2. SELF-AGENCY (RSES & GSE)
  {
    assessmentId: 'mod_self_agency',
    code: 'mod_self_agency',
    titleTr: 'Modül 2: Benlik Sistemi ve Öz-Yetkinlik (RSES & GSE)',
    titleEn: 'Module 2: Self-System & Generalized Agency (RSES & GSE)',
    descriptionTr: 'Rosenberg Benlik Saygısı ve Schwarzer-Jerusalem Genel Öz-Yeterlik ölçekleri ile içsel değerlilik ve başa çıkma inancının ölçümü.',
    descriptionEn: 'Measurement of self-esteem and generalized self-efficacy via RSES and GSE scales.',
    estimatedMinutes: 4,
    stage: 'CORE',
    category: 'SELF_REGULATION',
    isExecutable: true,
    expectedItemCount: 20,
    scoringModelCode: 'SELF_AGENCY_PRECALIBRATION_V1',
    facetItemAllocations: [
      { facetId: 'core_self_esteem', count: 10 },
      { facetId: 'generalized_self_efficacy', count: 10 },
    ],
  },

  // 3. EMOTION REGULATION (ERQ)
  {
    assessmentId: 'mod_emotion_regulation',
    code: 'mod_emotion_regulation',
    titleTr: 'Modül 3: Duygu Düzenleme Stratejileri (ERQ)',
    titleEn: 'Module 3: Emotion Regulation Strategies (ERQ)',
    descriptionTr: 'Gross & John Duygu Düzenleme Anketi doğrultusunda bilişsel yeniden değerlendirme ve duygusal bastırma stratejilerinin ölçümü.',
    descriptionEn: 'Measurement of cognitive reappraisal and expressive suppression strategies via ERQ.',
    estimatedMinutes: 2,
    stage: 'CORE',
    category: 'EMOTION',
    isExecutable: true,
    expectedItemCount: 10,
    scoringModelCode: 'ERQ_MEAN_V1',
    facetItemAllocations: [
      { facetId: 'cognitive_reappraisal', count: 6 },
      { facetId: 'expressive_suppression', count: 4 },
    ],
  },

  // 4. COGNITIVE & EPISTEMIC ORIENTATION (NFC & NFCS)
  {
    assessmentId: 'mod_cognitive_epistemic',
    code: 'mod_cognitive_epistemic',
    titleTr: 'Modül 4: Bilişsel ve Epistemik Yönelim (NFC & NFCS)',
    titleEn: 'Module 4: Cognitive & Epistemic Orientation (NFC & NFCS)',
    descriptionTr: 'Biliş ihtiyacı ve bilişsel kapanma ihtiyacı üzerinden zihinsel çaba harcama ve belirsizliği sonlandırma eğilimlerinin ölçümü.',
    descriptionEn: 'Measurement of need for cognition and need for cognitive closure.',
    estimatedMinutes: 4,
    stage: 'CORE',
    category: 'COGNITION',
    isExecutable: true,
    expectedItemCount: 18,
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    facetItemAllocations: [
      { facetId: 'need_for_cognition', count: 10 },
      { facetId: 'need_for_cognitive_closure', count: 8 },
    ],
  },

  // 5. VOLITION & IMPULSE CONTROL (BSCS & UPPS-P)
  {
    assessmentId: 'mod_volition_impulse',
    code: 'mod_volition_impulse',
    titleTr: 'Modül 5: İrade, Özdenetim ve Dürtü Kontrolü (BSCS & UPPS-P)',
    titleEn: 'Module 5: Volition, Self-Control & Impulsivity (BSCS & UPPS-P)',
    descriptionTr: 'Genel özdenetim, gecikme indirgeme ve çok boyutlu dürtüsellik dinamiklerinin (acil tepkisellik, sebat, planlılık, heyecan arayışı) ölçümü.',
    descriptionEn: 'Measurement of general self-control and multidimensional impulsivity via BSCS and UPPS-P.',
    estimatedMinutes: 7,
    stage: 'EXPANSION',
    category: 'SELF_REGULATION',
    isExecutable: true,
    expectedItemCount: 33,
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    facetItemAllocations: [
      { facetId: 'general_self_control', count: 8 },
      { facetId: 'delay_discounting', count: 5 },
      { facetId: 'negative_urgency', count: 4 },
      { facetId: 'positive_urgency', count: 4 },
      { facetId: 'lack_of_premeditation', count: 4 },
      { facetId: 'lack_of_perseverance', count: 4 },
      { facetId: 'sensation_seeking', count: 4 },
    ],
  },

  // 6. BASIC PSYCHOLOGICAL NEEDS (BPNSFS)
  {
    assessmentId: 'mod_basic_needs_sdt',
    code: 'mod_basic_needs_sdt',
    titleTr: 'Modül 6: Temel Psikolojik İhtiyaçlar (BPNSFS)',
    titleEn: 'Module 6: Basic Psychological Needs (BPNSFS)',
    descriptionTr: 'Öz-Belirleme Kuramı doğrultusunda özerklik, yetkinlik ve ilişkili olma temel ihtiyaçlarının doyumunun ölçümü.',
    descriptionEn: 'Measurement of autonomy, competence, and relatedness need satisfaction via BPNSFS.',
    estimatedMinutes: 5,
    stage: 'EXPANSION',
    category: 'MOTIVATION_VALUES',
    isExecutable: true,
    expectedItemCount: 24,
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    facetItemAllocations: [
      { facetId: 'autonomy_need', count: 8 },
      { facetId: 'competence_need', count: 8 },
      { facetId: 'relatedness_need', count: 8 },
    ],
  },

  // 7. UNIVERSAL VALUES (PVQ-RR)
  {
    assessmentId: 'mod_universal_values',
    code: 'mod_universal_values',
    titleTr: 'Modül 7: Evrensel İnsani Değerler (PVQ-RR)',
    titleEn: 'Module 7: Universal Human Values (PVQ-RR)',
    descriptionTr: 'Schwartz evrensel değerler çemberi doğrultusunda değişime açıklık, öz-aşma, koruma ve öz-gelişim değer önceliklerinin ölçümü.',
    descriptionEn: 'Measurement of universal human values across openness to change, self-transcendence, conservation, and self-enhancement.',
    estimatedMinutes: 8,
    stage: 'EXPANSION',
    category: 'MOTIVATION_VALUES',
    isExecutable: true,
    expectedItemCount: 40,
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    facetItemAllocations: [
      { facetId: 'values_openness_to_change', count: 10 },
      { facetId: 'values_self_transcendence', count: 10 },
      { facetId: 'values_conservation', count: 10 },
      { facetId: 'values_self_enhancement', count: 10 },
    ],
  },

  // 8. RELATIONAL ATTACHMENT & EMPATHY (ECR-R & IRI)
  {
    assessmentId: 'mod_relational_attachment_empathy',
    code: 'mod_relational_attachment_empathy',
    titleTr: 'Modül 8: İlişkisel Bağlanma ve Empati (ECR-R & IRI)',
    titleEn: 'Module 8: Relational Attachment & Empathy (ECR-R & IRI)',
    descriptionTr: 'Yakın ilişkilerde yetişkin bağlanma boyutları (kaygı, kaçınma) ve çok boyutlu empati (bilişsel perspektif alma, empatik ilgi) analizi.',
    descriptionEn: 'Assessment of adult attachment anxiety/avoidance and multidimensional empathy via ECR-R and IRI.',
    estimatedMinutes: 8,
    stage: 'EXPANSION',
    category: 'RELATIONSHIPS',
    isExecutable: true,
    expectedItemCount: 40,
    scoringModelCode: 'ECR_R_MEAN_V1',
    facetItemAllocations: [
      { facetId: 'attachment_anxiety', count: 10 },
      { facetId: 'attachment_avoidance', count: 10 },
      { facetId: 'cognitive_perspective_taking', count: 10 },
      { facetId: 'empathic_concern', count: 10 },
    ],
  },

  // 9. COGNITIVE ADAPTABILITY & THINKING STYLES (CFI, IUS, REI)
  {
    assessmentId: 'mod_cognitive_adaptability',
    code: 'mod_cognitive_adaptability',
    titleTr: 'Modül 9: Bilişsel Esneklik ve Belirsizlik Yönetimi (CFI & IUS)',
    titleEn: 'Module 9: Cognitive Adaptability & Uncertainty Management (CFI & IUS)',
    descriptionTr: 'Bilişsel esneklik, belirsizliğe tahammülsüzlük, ruminasyon ve rasyonel/sezgisel düşünme tarzlarının ölçümü.',
    descriptionEn: 'Measurement of cognitive flexibility, intolerance of uncertainty, rumination, and dual-process thinking styles.',
    estimatedMinutes: 7,
    stage: 'DEEP',
    category: 'COGNITION',
    isExecutable: true,
    expectedItemCount: 32,
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    facetItemAllocations: [
      { facetId: 'cognitive_flexibility', count: 10 },
      { facetId: 'intolerance_of_uncertainty', count: 10 },
      { facetId: 'rumination_brooding', count: 6 },
      { facetId: 'rational_analytical_style', count: 3 },
      { facetId: 'intuitive_experiential_style', count: 3 },
    ],
  },

  // 10. EXISTENTIAL MEANING, COMPASSION & GRIT (MLQ, SCS, GRIT)
  {
    assessmentId: 'mod_meaning_compassion_grit',
    code: 'mod_meaning_compassion_grit',
    titleTr: 'Modül 10: Yaşam Anlamı, Öz-Şefkat ve Azim (MLQ, SCS, GRIT)',
    titleEn: 'Module 10: Existential Meaning, Self-Compassion & Grit (MLQ, SCS, GRIT)',
    descriptionTr: 'Yaşamda anlam varlığı, anlam arayışı, kendine şefkatli yaklaşım ve uzun vadeli azim-sebat dinamiklerinin ölçümü.',
    descriptionEn: 'Measurement of presence and search for meaning, self-compassion, and long-term grit.',
    estimatedMinutes: 6,
    stage: 'DEEP',
    category: 'MOTIVATION_VALUES',
    isExecutable: true,
    expectedItemCount: 30,
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    facetItemAllocations: [
      { facetId: 'presence_of_meaning', count: 5 },
      { facetId: 'search_for_meaning', count: 5 },
      { facetId: 'self_compassion', count: 10 },
      { facetId: 'long_term_grit', count: 10 },
    ],
  },

  // 11. CONFLICT STYLES & BOUNDARIES (DUTCH, TKI)
  {
    assessmentId: 'mod_conflict_boundaries',
    code: 'mod_conflict_boundaries',
    titleTr: 'Modül 11: Çatışma Çözme Yönelimleri ve Sınırlar (DUTCH & TKI)',
    titleEn: 'Module 11: Conflict Resolution Styles & Boundaries (DUTCH & TKI)',
    descriptionTr: 'İşbirliği, kaçınma, atılganlık (assertiveness) ve ilişkisel sınır koyma dinamiklerinin ölçümü.',
    descriptionEn: 'Measurement of cooperation, avoidance, assertiveness, and personal boundary setting.',
    estimatedMinutes: 4,
    stage: 'DEEP',
    category: 'RELATIONSHIPS',
    isExecutable: true,
    expectedItemCount: 20,
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    facetItemAllocations: [
      { facetId: 'conflict_collaborating', count: 5 },
      { facetId: 'conflict_avoiding', count: 5 },
      { facetId: 'assertiveness', count: 5 },
      { facetId: 'boundary_setting', count: 5 },
    ],
  },

  // 12. AFFECTIVE DYNAMICS & DISTRESS TOLERANCE (PANAS, DTS)
  {
    assessmentId: 'mod_affective_distress',
    code: 'mod_affective_distress',
    titleTr: 'Modül 12: Duygulanım Dengesi ve Sıkıntı Toleransı (PANAS & DTS)',
    titleEn: 'Module 12: Affective Dynamics & Distress Tolerance (PANAS & DTS)',
    descriptionTr: 'Pozitif ve negatif mizaç duygulanımı, duygusal tepkisellik, sıkıntı toleransı ve yaşantısal kaçınmanın ölçümü.',
    descriptionEn: 'Measurement of positive/negative trait affect, emotional reactivity, and distress tolerance.',
    estimatedMinutes: 7,
    stage: 'DEEP',
    category: 'EMOTION',
    isExecutable: true,
    expectedItemCount: 35,
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    facetItemAllocations: [
      { facetId: 'trait_positive_affect', count: 10 },
      { facetId: 'trait_negative_affect', count: 10 },
      { facetId: 'emotional_reactivity', count: 5 },
      { facetId: 'distress_tolerance', count: 5 },
      { facetId: 'experiential_avoidance', count: 5 },
    ],
  },

  // 13. FLOURISHING & VITALITY (CONTENT PENDING)
  {
    assessmentId: 'mod_flourishing_vitality',
    code: 'mod_flourishing_vitality',
    titleTr: 'Modül 13: Psikolojik Gelişme ve Öznel Canlılık (FS & SVS)',
    titleEn: 'Module 13: Psychological Flourishing & Subjective Vitality (FS & SVS)',
    descriptionTr: 'Psikolojik gelişme, yaşam doyumu ve öznel canlılık dinamiklerinin ölçümü (İçerik araştırma aşamasındadır).',
    descriptionEn: 'Psychological flourishing and subjective vitality (Content in authoring phase).',
    estimatedMinutes: 3,
    stage: 'DEEP',
    category: 'MOTIVATION_VALUES',
    isExecutable: false,
    expectedItemCount: 13,
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    facetItemAllocations: [],
  },

  // 14. COPING & RESILIENCE (CONTENT PENDING)
  {
    assessmentId: 'mod_coping_resilience',
    code: 'mod_coping_resilience',
    titleTr: 'Modül 14: Başa Çıkma Stratejileri ve Stres Dayanıklılığı (Brief-COPE & BRS)',
    titleEn: 'Module 14: Coping Strategies & Stress Resilience (Brief-COPE & BRS)',
    descriptionTr: 'Problem ve duygu odaklı başa çıkma ile stres toparlanma gücünün ölçümü (İçerik araştırma aşamasındadır).',
    descriptionEn: 'Problem/emotion focused coping and stress recovery (Content in authoring phase).',
    estimatedMinutes: 4,
    stage: 'DEEP',
    category: 'EMOTION',
    isExecutable: false,
    expectedItemCount: 20,
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    facetItemAllocations: [],
  },

  // 15. CREATIVITY & GROWTH MINDSET (CONTENT PENDING)
  {
    assessmentId: 'mod_creativity_growth',
    code: 'mod_creativity_growth',
    titleTr: 'Modül 15: Yaratıcı Zihniyet ve Epistemik Merak (5DCR & Dweck)',
    titleEn: 'Module 15: Creative Mindset & Epistemic Curiosity (5DCR & Dweck)',
    descriptionTr: 'Yaratıcı öz-yeterlik, zihinsel merak ve gelişim zihniyetinin ölçümü (İçerik araştırma aşamasındadır).',
    descriptionEn: 'Creative self-efficacy and growth mindset (Content in authoring phase).',
    estimatedMinutes: 3,
    stage: 'DEEP',
    category: 'COGNITION',
    isExecutable: false,
    expectedItemCount: 16,
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    facetItemAllocations: [],
  },

  // 16. ADVANCED DARK TETRAD (SD4)
  {
    assessmentId: 'mod_dark_tetrad_advanced',
    code: 'mod_dark_tetrad_advanced',
    titleTr: 'Modül 16: Subklinik Kişilik Dinamikleri (Short Dark Tetrad - SD4)',
    titleEn: 'Module 16: Subclinical Personality Dynamics (Short Dark Tetrad - SD4)',
    descriptionTr: 'Makyevelizm, narsisizm, psikopati ve gündelik sadizm eğilimlerinin subklinik ölçümü (İsteğe bağlı ileri düzey araştırma modülü).',
    descriptionEn: 'Subclinical assessment of Machiavellianism, narcissism, psychopathy, and sadism via SD4.',
    estimatedMinutes: 6,
    stage: 'ADVANCED',
    category: 'ADVANCED',
    isExecutable: true,
    expectedItemCount: 28,
    scoringModelCode: 'PRE_CALIBRATION_MEAN_V1',
    facetItemAllocations: [
      { facetId: 'machiavellianism', count: 7 },
      { facetId: 'grandiose_narcissism', count: 7 },
      { facetId: 'subclinical_psychopathy', count: 7 },
      { facetId: 'everyday_sadism', count: 7 },
    ],
  },
];

export async function seedExecutableAssessments() {
  console.log('='.repeat(65));
  console.log('SEEDING EXECUTABLE ASSESSMENT SYSTEM & FORMS (FAZ 2.16)');
  console.log('='.repeat(65));

  // 1. Ensure scoring models exist
  const scoringModels = [
    { code: 'PRE_CALIBRATION_MEAN_V1', description: 'Standartlaştırılmamış ham aritmetik bileşik ortalama modeli', algorithm: 'UNWEIGHTED_COMPOSITE_MEAN' },
    { code: 'HEXACO_PRECALIBRATION_V1', description: 'HEXACO 6 faktör ve 24 facet ön kalibrasyon puanlama modeli', algorithm: 'HEXACO_60_MEAN' },
    { code: 'SELF_AGENCY_PRECALIBRATION_V1', description: 'Benlik Saygısı (RSES) ve Öz-Yeterlik (GSE) bağımsız alt ölçek puanlama modeli', algorithm: 'SELF_AGENCY_INDEPENDENT_MEAN' },
    { code: 'ERQ_MEAN_V1', description: 'Duygu Düzenleme Anketi (Bilişsel Yeniden Değerlendirme & Bastırma) puanlama modeli', algorithm: 'ERQ_INDEPENDENT_MEAN' },
    { code: 'ECR_R_MEAN_V1', description: 'Yakın İlişkilerde Yaşantılar (Kaygı & Kaçınma) puanlama modeli', algorithm: 'ECR_R_INDEPENDENT_MEAN' },
  ];

  for (const sm of scoringModels) {
    await prisma.scoringModelVersion.upsert({
      where: { code: sm.code },
      update: { description: sm.description, algorithm: sm.algorithm, isPreCalibration: true },
      create: { code: sm.code, description: sm.description, algorithm: sm.algorithm, isPreCalibration: true },
    });
  }
  console.log('✓ Scoring models verified in DB.');

  // 2. Fetch all ItemVersions with Items and Options from DB
  const allItemVersions = await prisma.itemVersion.findMany({
    where: { isActive: true },
    include: {
      item: {
        include: { facet: true },
      },
      options: {
        orderBy: { sortOrder: 'asc' },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  console.log(`✓ Loaded ${allItemVersions.length} active ItemVersions from DB.`);

  let totalFormsPublished = 0;
  let totalFormItemsCreated = 0;

  for (const conf of MODULE_CONFIGS) {
    // Upsert AssessmentModule
    const moduleRecord = await prisma.assessmentModule.upsert({
      where: { code: conf.code },
      update: {
        titleTr: conf.titleTr,
        titleEn: conf.titleEn,
        descriptionTr: conf.descriptionTr,
        descriptionEn: conf.descriptionEn,
        estimatedMinutes: conf.estimatedMinutes,
      },
      create: {
        id: conf.assessmentId,
        code: conf.code,
        titleTr: conf.titleTr,
        titleEn: conf.titleEn,
        descriptionTr: conf.descriptionTr,
        descriptionEn: conf.descriptionEn,
        estimatedMinutes: conf.estimatedMinutes,
      },
    });

    if (!conf.isExecutable) {
      console.log(`- [CONTENT_PENDING] ${conf.code}: Module metadata registered (No active form).`);
      continue;
    }

    // Collect ItemVersions matching the facet allocations
    const selectedItemVersions: typeof allItemVersions = [];
    const usedItemVersionIds = new Set<string>();

    for (const alloc of conf.facetItemAllocations) {
      const candidates = allItemVersions.filter(
        (iv) => iv.item.facetId === alloc.facetId && !usedItemVersionIds.has(iv.id)
      );

      if (candidates.length < alloc.count) {
        console.warn(`[WARN] Not enough items for facet '${alloc.facetId}' in module '${conf.code}'. Expected ${alloc.count}, found ${candidates.length}`);
      }

      const picked = candidates.slice(0, alloc.count);
      for (const p of picked) {
        selectedItemVersions.push(p);
        usedItemVersionIds.add(p.id);
      }
    }

    if (selectedItemVersions.length !== conf.expectedItemCount) {
      console.warn(`[WARN] Module ${conf.code} item count mismatch: selected ${selectedItemVersions.length}, expected ${conf.expectedItemCount}`);
    }

    // Upsert AssessmentFormVersion
    const formVersionId = `form_${conf.code}_v1_0_0`;
    const formVersion = await prisma.assessmentFormVersion.upsert({
      where: {
        moduleId_versionCode: {
          moduleId: moduleRecord.id,
          versionCode: 'v1.0.0',
        },
      },
      update: {
        isPublished: true,
        status: 'PUBLISHED',
        itemCount: selectedItemVersions.length,
        publishedAt: new Date(),
      },
      create: {
        id: formVersionId,
        moduleId: moduleRecord.id,
        versionCode: 'v1.0.0',
        isPublished: true,
        status: 'PUBLISHED',
        itemCount: selectedItemVersions.length,
        publishedAt: new Date(),
        description: `${conf.titleTr} Form Versiyonu 1.0.0`,
      },
    });

    // Delete existing form items and recreate sequentially
    await prisma.assessmentFormItem.deleteMany({
      where: { formVersionId: formVersion.id },
    });

    let sortOrder = 1;
    for (const iv of selectedItemVersions) {
      await prisma.assessmentFormItem.create({
        data: {
          id: `fitem_${conf.code}_${sortOrder}`,
          formVersionId: formVersion.id,
          itemVersionId: iv.id,
          sortOrder,
        },
      });
      sortOrder++;
      totalFormItemsCreated++;
    }

    totalFormsPublished++;
    console.log(`✓ [EXECUTABLE] ${conf.code}: Published form v1.0.0 with ${selectedItemVersions.length} items.`);
  }

  // Also ensure legacy form version is kept in PUBLISHED state for historical sessions
  const legacyModule = await prisma.assessmentModule.findUnique({
    where: { code: 'MODULE_1_CORE_PERSONALITY' },
  });
  if (legacyModule) {
    await prisma.assessmentFormVersion.updateMany({
      where: { moduleId: legacyModule.id, versionCode: 'v1.0.0' },
      data: { isPublished: true, status: 'PUBLISHED' },
    });
  }

  console.log('='.repeat(65));
  console.log(`SEEDING COMPLETE: ${totalFormsPublished} active forms published, ${totalFormItemsCreated} form items mapped.`);
  console.log('='.repeat(65));
}

if (require.main === module) {
  seedExecutableAssessments()
    .catch((err) => {
      console.error('Fatal error during seeding:', err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
