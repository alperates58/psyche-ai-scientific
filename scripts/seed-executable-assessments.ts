import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface VerifiedFormManifest {
  moduleCode: string;
  formVersionCode: string;
  instrumentId: string;
  titleTr: string;
  titleEn: string;
  descriptionTr: string;
  descriptionEn: string;
  estimatedMinutes: number;
  itemCodes: string[];
}

/**
 * Authoritative Manifests of Exact Validated Forms.
 * In accordance with FAZ 2.16 Provenance Lock:
 * A named form can ONLY be seeded/published if its exact item IDs/codes are explicitly verified.
 */
export const VERIFIED_FORM_MANIFESTS: VerifiedFormManifest[] = [
  {
    moduleCode: 'mod_core_hexaco_60',
    formVersionCode: 'v1.0.0',
    instrumentId: 'inst_ipip_hexaco',
    titleTr: 'Temel Kişilik Yapısı',
    titleEn: 'Core Personality Structure',
    descriptionTr: 'Psikolojik profilinizin temel omurgasını oluşturan 6 temel faktörü ve alt boyutları ölçer (IPIP-HEXACO Ön-Kalibrasyon Formu).',
    descriptionEn: 'Measures the 6 core personality factors and sub-facets (IPIP-HEXACO Pre-Calibration Form).',
    estimatedMinutes: 5,
    itemCodes: [
      'itm_hex_sinc_01',
      'itm_hex_fair_01',
      'itm_hex_greed_01',
      'itm_hex_mod_01',
      'itm_hex_fear_01',
      'itm_hex_anx_01',
      'itm_hex_soc_01',
      'itm_hex_livel_01',
      'itm_hex_forg_01',
      'itm_hex_pat_01',
      'itm_hex_org_01',
      'itm_hex_dilig_01',
      'itm_hex_prud_01',
      'itm_hex_aes_01',
      'itm_hex_inq_01',
      'itm_hex_cre_01',
      'itm_attn_chk_01',
    ],
  },
];

export const ALL_16_MODULE_DEFINITIONS = [
  {
    code: 'mod_core_hexaco_60',
    titleTr: 'Temel Kişilik Yapısı',
    titleEn: 'Core Personality Structure',
    descriptionTr: 'Psikolojik profilinizin temel omurgasını oluşturan 6 temel faktörü ve alt boyutları ölçer.',
    descriptionEn: 'Measures 6 core personality factors and sub-facets.',
    estimatedMinutes: 5,
  },
  {
    code: 'mod_self_agency',
    titleTr: 'Benlik Sistemi ve Öz-Yetkinlik',
    titleEn: 'Self-System & Generalized Agency',
    descriptionTr: 'İçsel değerlilik algınızı ve zorluklarla başa çıkma inancınızı bağımsız ölçeklerle ölçer.',
    descriptionEn: 'Measures core self-worth and general competence expectancy.',
    estimatedMinutes: 4,
  },
  {
    code: 'mod_emotion_regulation',
    titleTr: 'Duygu Düzenleme Stratejileri',
    titleEn: 'Emotion Regulation Strategies',
    descriptionTr: 'Duygusal deneyimleri dönüştürme ve ifade etme tarzlarınızı iki bağımsız eksende değerlendirir.',
    descriptionEn: 'Evaluates cognitive reappraisal and expressive suppression.',
    estimatedMinutes: 2,
  },
  {
    code: 'mod_cognitive_epistemic',
    titleTr: 'Bilişsel ve Epistemik Yönelim',
    titleEn: 'Cognitive & Epistemic Orientation',
    descriptionTr: 'Zihinsel çaba gösterme arzunuzu ve bilgiye ulaşma motivasyonunuzu analiz eder.',
    descriptionEn: 'Analyzes need for cognition and epistemic curiosity.',
    estimatedMinutes: 4,
  },
  {
    code: 'mod_volition_impulse',
    titleTr: 'İrade, Öz-Kontrol ve Dürtüsellik',
    titleEn: 'Volition, Self-Control & Impulsivity',
    descriptionTr: 'Hedefe odaklanma gücünü, anlık dürtüleri erteleme kapasitesini ve sebat dinamiklerini inceler.',
    descriptionEn: 'Evaluates self-control and impulsivity dimensions.',
    estimatedMinutes: 7,
  },
  {
    code: 'mod_basic_needs_sdt',
    titleTr: 'Temel Psikolojik İhtiyaçlar',
    titleEn: 'Basic Psychological Needs',
    descriptionTr: 'Yaşamınızdaki temel psikolojik besinlerin doyumunu ve engellenme düzeylerini haritalandırır.',
    descriptionEn: 'Maps basic psychological need satisfaction and frustration.',
    estimatedMinutes: 5,
  },
  {
    code: 'mod_universal_values',
    titleTr: 'Evrensel İnsani Değerler',
    titleEn: 'Universal Human Values',
    descriptionTr: 'Kararlarınıza ve yaşam tercihlerinize yön veren temel değer önceliklerinizi ortaya koyar.',
    descriptionEn: 'Reveals universal human value priorities.',
    estimatedMinutes: 10,
  },
  {
    code: 'mod_relational_attachment_empathy',
    titleTr: 'İlişkisel Bağlanma ve Empati',
    titleEn: 'Relational Attachment & Empathy',
    descriptionTr: 'Yakın ilişkilerdeki güven/mesafe kalıplarınızı ve başkalarının duygularını anlama biçiminizi inceler.',
    descriptionEn: 'Evaluates adult attachment and cognitive/affective empathy.',
    estimatedMinutes: 10,
  },
  {
    code: 'mod_cognitive_adaptability',
    titleTr: 'Bilişsel Esneklik ve Belirsizlik Yönetimi',
    titleEn: 'Cognitive Adaptability & Uncertainty Management',
    descriptionTr: 'Değişen koşullara uyum sağlama hızınızı ve belirsizlik durumlarındaki zihinsel dayanıklılığınızı ölçer.',
    descriptionEn: 'Assesses cognitive flexibility and intolerance of uncertainty.',
    estimatedMinutes: 7,
  },
  {
    code: 'mod_meaning_compassion_grit',
    titleTr: 'Yaşam Anlamı, Öz-Şefkat ve Sebat',
    titleEn: 'Existential Meaning, Self-Compassion & Grit',
    descriptionTr: 'Hayatın anlamını bulma, zor zamanlarda kendine anlayış gösterme ve hedeflere tutkuyla bağlılık seviyenizi analiz eder.',
    descriptionEn: 'Synthesizes meaning in life, self-compassion, and grit.',
    estimatedMinutes: 6,
  },
  {
    code: 'mod_conflict_boundaries',
    titleTr: 'Çatışma Çözümü ve İlişki Sınırları',
    titleEn: 'Conflict Resolution Styles & Boundaries',
    descriptionTr: 'Anlaşmazlık durumlarında sergilediğiniz davranış biçimlerini ve sınır koyma dinamiklerinizi ölçer.',
    descriptionEn: 'Maps conflict styles and personal boundary regulation.',
    estimatedMinutes: 4.5,
  },
  {
    code: 'mod_affective_distress',
    titleTr: 'Duygusal Esenlik ve Sıkıntı Toleransı',
    titleEn: 'Affective Tone & Distress Tolerance',
    descriptionTr: 'Genel duygulanım dengenizi ve yoğun stres/sıkıntı anlarındaki dayanma kapasitenizi analiz eder.',
    descriptionEn: 'Analyzes affect balance and distress tolerance.',
    estimatedMinutes: 7.5,
  },
  {
    code: 'mod_flourishing_vitality',
    titleTr: 'Gelişme ve Psikolojik Canlılık',
    titleEn: 'Psychological Flourishing & Life Satisfaction',
    descriptionTr: 'Bütüncül yaşam kalitenizi, sosyal işlevselliğinizi ve enerjik canlılık hissinizi değerlendirir.',
    descriptionEn: 'Evaluates psychological flourishing and subjective vitality.',
    estimatedMinutes: 3,
  },
  {
    code: 'mod_coping_resilience',
    titleTr: 'Stresle Başa Çıkma ve Dayanıklılık',
    titleEn: 'Coping Strategies & Stress Resilience',
    descriptionTr: 'Stresli yaşam olaylarıyla yüzleşme biçiminizi ve toparlanma hızınızı ölçer.',
    descriptionEn: 'Measures coping repertoires and psychological resilience.',
    estimatedMinutes: 4.5,
  },
  {
    code: 'mod_creativity_growth',
    titleTr: 'Yaratıcı Öz-İnanç ve Gelişim Zihniyeti',
    titleEn: 'Creative Mindset & Epistemic Curiosity',
    descriptionTr: 'Yaratıcı potansiyelinize olan inancınızı ve yeteneklerin geliştirilebilirliğine dair bakış açınızı analiz eder.',
    descriptionEn: 'Maps creative self-efficacy and growth mindset.',
    estimatedMinutes: 3.5,
  },
  {
    code: 'mod_dark_tetrad_advanced',
    titleTr: 'Uç Kişilik Eğilimleri ve Dinamikler',
    titleEn: 'Short Dark Tetrad Personality Dimensions',
    descriptionTr: 'Kişilik yapısının uç ve gölgede kalan stratejik dinamiklerini bilimsel sınırlarla inceler.',
    descriptionEn: 'Examines subclinical dark tetrad personality tendencies.',
    estimatedMinutes: 6,
  },
];

export async function seedExecutableAssessments() {
  console.log('='.repeat(75));
  console.log('FAZ 2.16: SCIENTIFIC ASSESSMENT SEEDING (ITEM PROVENANCE LOCK)');
  console.log('='.repeat(75));

  // 1. Ensure all 16 AssessmentModule metadata records exist with 100% Turkish text
  for (const def of ALL_16_MODULE_DEFINITIONS) {
    await prisma.assessmentModule.upsert({
      where: { code: def.code },
      update: {
        titleTr: def.titleTr,
        titleEn: def.titleEn,
        descriptionTr: def.descriptionTr,
        descriptionEn: def.descriptionEn,
        estimatedMinutes: Math.round(def.estimatedMinutes),
      },
      create: {
        id: def.code,
        code: def.code,
        titleTr: def.titleTr,
        titleEn: def.titleEn,
        descriptionTr: def.descriptionTr,
        descriptionEn: def.descriptionEn,
        estimatedMinutes: Math.round(def.estimatedMinutes),
      },
    });
  }
  console.log('✓ All 16 AssessmentModule records registered/updated in Turkish.');

  // 2. Process Verified Form Manifests
  let publishedFormsCount = 0;
  let totalMappedItems = 0;

  for (const manifest of VERIFIED_FORM_MANIFESTS) {
    const mod = await prisma.assessmentModule.findUnique({
      where: { code: manifest.moduleCode },
    });
    if (!mod) {
      throw new Error(`Module ${manifest.moduleCode} not found in DB`);
    }

    // Load exact items by itemCode
    const items = await prisma.item.findMany({
      where: { itemCode: { in: manifest.itemCodes } },
      include: {
        versions: {
          where: { versionNumber: 1 },
        },
      },
    });

    const itemMap = new Map<string, typeof items[0]>();
    for (const itm of items) {
      itemMap.set(itm.itemCode, itm);
    }

    // Verify all manifest items exist
    const missingCodes = manifest.itemCodes.filter((code) => !itemMap.has(code));
    if (missingCodes.length > 0) {
      throw new Error(`Manifest for ${manifest.moduleCode} has missing items: ${missingCodes.join(', ')}`);
    }

    // Upsert Form Version
    const formVersion = await prisma.assessmentFormVersion.upsert({
      where: {
        moduleId_versionCode: {
          moduleId: mod.id,
          versionCode: manifest.formVersionCode,
        },
      },
      update: {
        isPublished: true,
        status: 'PUBLISHED',
        itemCount: manifest.itemCodes.length,
        description: manifest.descriptionTr,
        publishedAt: new Date(),
      },
      create: {
        id: `form_${manifest.moduleCode}_${manifest.formVersionCode.replace(/\\./g, '_')}`,
        moduleId: mod.id,
        versionCode: manifest.formVersionCode,
        isPublished: true,
        status: 'PUBLISHED',
        itemCount: manifest.itemCodes.length,
        description: manifest.descriptionTr,
        publishedAt: new Date(),
      },
    });

    // Check if responses exist for this form version
    const linkedResponses = await prisma.responseRecord.count({
      where: {
        formItem: {
          formVersionId: formVersion.id,
        },
      },
    });

    if (linkedResponses === 0) {
      await prisma.assessmentFormItem.deleteMany({
        where: { formVersionId: formVersion.id },
      });
    }

    // Map items sequentially
    let sortOrder = 1;
    for (const code of manifest.itemCodes) {
      const itm = itemMap.get(code)!;
      const iv = itm.versions[0];
      if (!iv) {
        throw new Error(`ItemVersion missing for item ${code}`);
      }

      await prisma.itemVersion.update({
        where: { id: iv.id },
        data: { status: 'ACTIVE', isActive: true },
      });

      await prisma.assessmentFormItem.upsert({
        where: {
          formVersionId_sortOrder: {
            formVersionId: formVersion.id,
            sortOrder,
          },
        },
        update: {
          itemVersionId: iv.id,
        },
        create: {
          id: `fitem_${manifest.moduleCode}_${sortOrder}`,
          formVersionId: formVersion.id,
          itemVersionId: iv.id,
          sortOrder,
        },
      });

      sortOrder++;
      totalMappedItems++;
    }

    publishedFormsCount++;
    console.log(`✓ [VALIDATED_FORM_EXECUTABLE] ${manifest.moduleCode} (${manifest.formVersionCode}): ${manifest.itemCodes.length} verified items published.`);
  }

  // 3. Mark unverified forms from any prior seed as DRAFT (fail-closed provenance lock)
  const allModules = await prisma.assessmentModule.findMany({
    where: {
      code: {
        notIn: VERIFIED_FORM_MANIFESTS.map((m) => m.moduleCode).concat(['MODULE_1_CORE_PERSONALITY']),
      },
    },
    include: {
      formVersions: true,
    },
  });

  for (const unverifiedMod of allModules) {
    if (unverifiedMod.formVersions.length > 0) {
      await prisma.assessmentFormVersion.updateMany({
        where: { moduleId: unverifiedMod.id },
        data: {
          isPublished: false,
          status: 'DRAFT',
          description: 'Bilimsel Doğrulama ve Telif İzin Süreci Bekleniyor (CONTENT_PENDING_PROVENANCE)',
        },
      });
      console.log(`- [CONTENT_PENDING_PROVENANCE] ${unverifiedMod.code}: Form set to DRAFT / unpublished.`);
    }
  }

  console.log('='.repeat(75));
  console.log(`PROVENANCE SEED COMPLETE: ${publishedFormsCount} validated forms published (${totalMappedItems} items).`);
  console.log('='.repeat(75));
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
