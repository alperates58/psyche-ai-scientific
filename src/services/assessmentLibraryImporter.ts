import { prisma } from '@/lib/prisma';
import { validateAssessmentFormForPublication, PublicationValidationResult } from '@/lib/publicationValidator';
import { publishAssessmentFormVersion } from './scientificAdminService';

export interface ImportLibraryOptions {
  dryRun?: boolean;
  publishRses?: boolean; // STRICT DEFAULT: false. Must explicitly be passed as true to publish.
}

export interface PublicationLogEntry {
  formCode: string;
  moduleCode: string;
  publishable: boolean;
  isPublished: boolean;
  blockers: string[];
  warnings: string[];
  info: string[];
}

export interface ImportLibraryResult {
  success: boolean;
  dryRun: boolean;
  domainsCreatedOrUpdated: number;
  constructsCreatedOrUpdated: number;
  facetsCreatedOrUpdated: number;
  sourcesCreatedOrUpdated: number;
  instrumentsCreatedOrUpdated: number;
  scoringModelsCreatedOrUpdated: number;
  modulesCreatedOrUpdated: number;
  formsCreatedOrUpdated: number;
  itemsCreatedOrUpdated: number;
  publishedFormIds: string[];
  publicationLogs: PublicationLogEntry[];
  errors: string[];
}

const RSES_CANONICAL_ITEMS = [
  {
    code: 'RSES_01',
    promptTr: 'Genel olarak kendimden memnunum.',
    promptEn: 'On the whole, I am satisfied with myself.',
    isKeyed: true, // Positive (+)
  },
  {
    code: 'RSES_02',
    promptTr: 'Zaman zaman kendimin hiçbir işe yaramadığını düşünürüm.',
    promptEn: 'At times I think I am no good at all.',
    isKeyed: false, // Reversed (-)
  },
  {
    code: 'RSES_03',
    promptTr: 'Birtakım iyi niteliklerim olduğunu hissediyorum.',
    promptEn: 'I feel that I have a number of good qualities.',
    isKeyed: true, // Positive (+)
  },
  {
    code: 'RSES_04',
    promptTr: 'Çoğu insan kadar iyi şeyler yapabilirim.',
    promptEn: 'I am able to do things as well as most other people.',
    isKeyed: true, // Positive (+)
  },
  {
    code: 'RSES_05',
    promptTr: 'Kendimle gurur duyacak pek bir şeyim olmadığını hissediyorum.',
    promptEn: 'I feel I do not have much to be proud of.',
    isKeyed: false, // Reversed (-)
  },
  {
    code: 'RSES_06',
    promptTr: 'Zaman zaman kesinlikle kendimi işe yaramaz hissediyorum.',
    promptEn: 'I certainly feel useless at times.',
    isKeyed: false, // Reversed (-)
  },
  {
    code: 'RSES_07',
    promptTr: 'Kendimi en az diğer insanlar kadar değerli bir insan olarak görüyorum.',
    promptEn: "I feel that I'm a person of worth, at least on an equal plane with others.",
    isKeyed: true, // Positive (+)
  },
  {
    code: 'RSES_08',
    promptTr: 'Kendime daha fazla saygı duyabilmeyi isterdim.',
    promptEn: 'I wish I could have more respect for myself.',
    isKeyed: false, // Reversed (-)
  },
  {
    code: 'RSES_09',
    promptTr: 'Her şeyi göz önüne aldığımda, kendimi bir başarısızlık olarak görme eğilimindeyim.',
    promptEn: 'All in all, I am inclined to feel that I am a failure.',
    isKeyed: false, // Reversed (-)
  },
  {
    code: 'RSES_10',
    promptTr: 'Kendime karşı olumlu bir tutum içindeyim.',
    promptEn: 'I take a positive attitude toward myself.',
    isKeyed: true, // Positive (+)
  },
];

const LIKERT_4_OPTIONS = [
  { value: 1, labelTr: 'Kesinlikle Katılmıyorum', labelEn: 'Strongly Disagree', sortOrder: 1 },
  { value: 2, labelTr: 'Katılmıyorum', labelEn: 'Disagree', sortOrder: 2 },
  { value: 3, labelTr: 'Katılıyorum', labelEn: 'Agree', sortOrder: 3 },
  { value: 4, labelTr: 'Kesinlikle Katılıyorum', labelEn: 'Strongly Agree', sortOrder: 4 },
];

/**
 * Idempotent psychometric assessment library importer.
 * Registers scientific domains, constructs, facets, instruments, scoring models,
 * and valid assessment forms with full provenance, C2 immutability verification,
 * and canonical C3 publication validation.
 */
export async function importAssessmentLibrary(
  options: ImportLibraryOptions = {}
): Promise<ImportLibraryResult> {
  const dryRun = !!options.dryRun;
  // STRICT REQUIREMENT: Default is false. Library importer never publishes by default.
  const publishRses = options.publishRses === true;

  const result: ImportLibraryResult = {
    success: true,
    dryRun,
    domainsCreatedOrUpdated: 0,
    constructsCreatedOrUpdated: 0,
    facetsCreatedOrUpdated: 0,
    sourcesCreatedOrUpdated: 0,
    instrumentsCreatedOrUpdated: 0,
    scoringModelsCreatedOrUpdated: 0,
    modulesCreatedOrUpdated: 0,
    formsCreatedOrUpdated: 0,
    itemsCreatedOrUpdated: 0,
    publishedFormIds: [],
    publicationLogs: [],
    errors: [],
  };

  try {
    // ---------------------------------------------------------
    // 1. SCIENTIFIC SOURCES
    // ---------------------------------------------------------
    const sourcesToUpsert = [
      {
        id: 'src_rosenberg_1965',
        shortKey: 'src_rosenberg_1965',
        citation: 'Rosenberg, M. (1965). Society and the adolescent self-image. Princeton University Press.',
        year: 1965,
        url: 'https://socy.umd.edu/about-us/rosenberg-self-esteem-scale',
      },
      {
        id: 'src_cuhadaroglu_1986',
        shortKey: 'src_cuhadaroglu_1986',
        citation: 'Çuhadaroğlu, F. (1986). Adolesanlarda benlik saygısı. Yayımlanmamış Uzmanlık Tezi, Hacettepe Üniversitesi Tıp Fakültesi Psikiyatri Anabilim Dalı, Ankara.',
        year: 1986,
        url: null,
      },
      {
        id: 'src_schwarzer_jerusalem_1995',
        shortKey: 'src_schwarzer_jerusalem_1995',
        citation: "Schwarzer, R., & Jerusalem, M. (1995). Generalized Self-Efficacy scale. In J. Weinman, S. Wright, & M. Johnston (Eds.), Measures in health psychology: A user's portfolio. Causal and control beliefs (pp. 35-37). NFER-NELSON.",
        year: 1995,
        url: 'https://userpage.fu-berlin.de/~health/engscal.htm',
      },
      {
        id: 'src_gratz_roemer_2004_ders',
        shortKey: 'src_gratz_roemer_2004_ders',
        citation: 'Gratz, K. L., & Roemer, L. (2004). Multidimensional assessment of emotion regulation and dysregulation: Development, factor structure, and initial validation of the difficulties in emotion regulation scale. Journal of Psychopathology and Behavioral Assessment, 26(1), 41-54.',
        year: 2004,
        url: 'https://doi.org/10.1023/B:JOBA.0000007455.08539.94',
      },
    ];

    for (const src of sourcesToUpsert) {
      if (!dryRun) {
        await prisma.scientificSource.upsert({
          where: { id: src.id },
          update: { citation: src.citation, year: src.year, url: src.url },
          create: src,
        });
      }
      result.sourcesCreatedOrUpdated++;
    }

    // ---------------------------------------------------------
    // 2. INSTRUMENTS & LICENSING
    // ---------------------------------------------------------
    const instrumentsToUpsert = [
      {
        id: 'inst_rses',
        code: 'INST_RSES',
        name: 'Rosenberg Self-Esteem Scale',
        fullName: 'Rosenberg Self-Esteem Scale (RSES)',
        licenseType: 'Public Domain',
        licensingDecision: 'approved',
        citation: 'University of Maryland Department of Sociology confirms public domain status for academic and assessment use with citation.',
      },
      {
        id: 'inst_gses',
        code: 'INST_GSES',
        name: 'General Self-Efficacy Scale',
        fullName: 'General Self-Efficacy Scale (GSE)',
        licenseType: 'Open Academic with Citation',
        licensingDecision: 'restricted',
        citation: 'Schwarzer & Jerusalem (1995). Research draft only; formal commercial authorization required for production.',
      },
      {
        id: 'inst_ders',
        code: 'INST_DERS',
        name: 'Difficulties in Emotion Regulation Scale',
        fullName: 'Difficulties in Emotion Regulation Scale (DERS)',
        licenseType: 'Proprietary Academic',
        licensingDecision: 'restricted',
        citation: 'Gratz & Roemer (2004). Research draft only; requires formal author license.',
      },
    ];

    for (const inst of instrumentsToUpsert) {
      if (!dryRun) {
        await prisma.instrument.upsert({
          where: { id: inst.id },
          update: {
            code: inst.code,
            name: inst.name,
            fullName: inst.fullName,
            licenseType: inst.licenseType,
            licensingDecision: inst.licensingDecision,
            citation: inst.citation,
          },
          create: inst,
        });
      }
      result.instrumentsCreatedOrUpdated++;
    }

    // ---------------------------------------------------------
    // 3. ONTOLOGY DOMAINS, CONSTRUCTS & FACETS
    // ---------------------------------------------------------
    const domainsToUpsert = [
      {
        id: 'self_system',
        code: 'self_system',
        nameTr: 'Benlik ve Öz-Düzenleme',
        nameEn: 'Self-System & Self-Regulation',
        descriptionTr: 'Bireyin özsaygı, öz-yeterlilik ve benlik algısı dinamikleri.',
        descriptionEn: 'Dynamics of self-esteem, self-efficacy, and self-concept.',
        sortOrder: 2,
      },
      {
        id: 'emotional_affective',
        code: 'emotional_affective',
        nameTr: 'Duygusal ve Duygulanımsal Tarzlar',
        nameEn: 'Emotional & Affective Styles',
        descriptionTr: 'Duygu düzenleme stratejileri ve duygulanım eğilimleri.',
        descriptionEn: 'Emotion regulation strategies and affective dispositions.',
        sortOrder: 3,
      },
    ];

    for (const dom of domainsToUpsert) {
      if (!dryRun) {
        await prisma.domain.upsert({
          where: { id: dom.id },
          update: {
            code: dom.code,
            nameTr: dom.nameTr,
            nameEn: dom.nameEn,
            descriptionTr: dom.descriptionTr,
            descriptionEn: dom.descriptionEn,
            sortOrder: dom.sortOrder,
          },
          create: dom,
        });
      }
      result.domainsCreatedOrUpdated++;
    }

    const constructsToUpsert = [
      {
        id: 'self_evaluation',
        code: 'self_evaluation',
        domainId: 'self_system',
        nameTr: 'Benlik Değerlendirmesi',
        nameEn: 'Self-Evaluation',
        descriptionTr: 'Bireyin kendine yönelik genel değeri ve benlik algısı.',
        descriptionEn: 'General self-worth and self-evaluation.',
        sortOrder: 1,
      },
      {
        id: 'agency_mastery',
        code: 'agency_mastery',
        domainId: 'self_system',
        nameTr: 'Yetkinlik ve İrade',
        nameEn: 'Agency & Mastery',
        descriptionTr: 'Zorlu durumlarla başa çıkabilme ve hedeflere ulaşma inancı.',
        descriptionEn: 'Belief in coping with challenges and achieving goals.',
        sortOrder: 2,
      },
      {
        id: 'emotion_regulation',
        code: 'emotion_regulation',
        domainId: 'emotional_affective',
        nameTr: 'Duygu Düzenleme',
        nameEn: 'Emotion Regulation',
        descriptionTr: 'Duygusal farkındalık, kabul ve düzenleme stratejileri.',
        descriptionEn: 'Emotional awareness, acceptance, and regulation.',
        sortOrder: 1,
      },
    ];

    for (const con of constructsToUpsert) {
      if (!dryRun) {
        await prisma.construct.upsert({
          where: { id: con.id },
          update: {
            code: con.code,
            domainId: con.domainId,
            nameTr: con.nameTr,
            nameEn: con.nameEn,
            descriptionTr: con.descriptionTr,
            descriptionEn: con.descriptionEn,
            sortOrder: con.sortOrder,
          },
          create: con,
        });
      }
      result.constructsCreatedOrUpdated++;
    }

    const facetsToUpsert = [
      {
        id: 'core_self_esteem',
        code: 'core_self_esteem',
        constructId: 'self_evaluation',
        nameTr: 'Temel Benlik Saygısı',
        nameEn: 'Core Self-Esteem',
        descriptionTr: 'Rosenberg Benlik Saygısı Ölçeği (RSES) ile ölçülen temel özsaygı.',
        descriptionEn: 'Core self-esteem measured via the Rosenberg Self-Esteem Scale (RSES).',
        sortOrder: 1,
      },
      {
        id: 'generalized_self_efficacy',
        code: 'generalized_self_efficacy',
        constructId: 'agency_mastery',
        nameTr: 'Genel Öz-Yeterlilik',
        nameEn: 'Generalized Self-Efficacy',
        descriptionTr: 'Schwarzer & Jerusalem Genel Öz-Yeterlik Ölçeği (GSE) ile ölçülen başa çıkma inancı.',
        descriptionEn: 'Generalized self-efficacy measured via Schwarzer & Jerusalem GSE.',
        sortOrder: 1,
      },
      {
        id: 'cognitive_reappraisal',
        code: 'cognitive_reappraisal',
        constructId: 'emotion_regulation',
        nameTr: 'Bilişsel Yeniden Değerlendirme',
        nameEn: 'Cognitive Reappraisal',
        descriptionTr: 'Duygusal durumları yeniden çerçeveleme becerisi.',
        descriptionEn: 'Ability to cognitively reframe emotional situations.',
        sortOrder: 1,
      },
    ];

    for (const fac of facetsToUpsert) {
      if (!dryRun) {
        await prisma.facet.upsert({
          where: { id: fac.id },
          update: {
            code: fac.code,
            constructId: fac.constructId,
            nameTr: fac.nameTr,
            nameEn: fac.nameEn,
            descriptionTr: fac.descriptionTr,
            descriptionEn: fac.descriptionEn,
            sortOrder: fac.sortOrder,
          },
          create: fac,
        });
      }
      result.facetsCreatedOrUpdated++;
    }

    // ---------------------------------------------------------
    // 4. SCORING MODELS
    // ---------------------------------------------------------
    const scoringModelsToUpsert = [
      {
        id: 'model_pre_cal_mean_v1',
        code: 'PRE_CALIBRATION_MEAN_V1',
        description: 'Ağırlıksız Ön-Kalibrasyon Ortalama Modeli (V1)',
        algorithm: 'UNWEIGHTED_COMPOSITE_MEAN',
        isPreCalibration: true,
      },
      {
        id: 'model_rses_mean_v1',
        code: 'RSES_MEAN_V1',
        description: 'Rosenberg Benlik Saygısı Ortalama Puan Modeli (V1)',
        algorithm: 'RSES_MEAN_1_4',
        isPreCalibration: true,
      },
      {
        id: 'model_gse_mean_v1',
        code: 'GSE_MEAN_V1',
        description: 'Genel Öz-Yeterlik Ortalama Puan Modeli (V1)',
        algorithm: 'GSE_MEAN_1_4',
        isPreCalibration: true,
      },
    ];

    for (const sm of scoringModelsToUpsert) {
      if (!dryRun) {
        await prisma.scoringModelVersion.upsert({
          where: { code: sm.code },
          update: {
            description: sm.description,
            algorithm: sm.algorithm,
            isPreCalibration: sm.isPreCalibration,
          },
          create: sm,
        });
      }
      result.scoringModelsCreatedOrUpdated++;
    }

    // ---------------------------------------------------------
    // 5. ASSESSMENT MODULES
    // ---------------------------------------------------------
    const modulesToUpsert = [
      {
        id: 'mod_self_identity',
        code: 'MODULE_2_SELF_IDENTITY',
        titleTr: 'Benlik ve Kimlik Sistemi',
        titleEn: 'Self-System and Identity Dynamics',
        descriptionTr: 'Rosenberg Benlik Saygısı Ölçeği (RSES) doğrultusunda bireyin temel özsaygı ve benlik değerlendirmesini haritalandırır.',
        descriptionEn: 'Assesses core self-esteem and self-worth based on the Rosenberg Self-Esteem Scale (RSES).',
        estimatedMinutes: 5,
      },
      {
        id: 'mod_emotion_regulation',
        code: 'MODULE_3_EMOTION_REGULATION',
        titleTr: 'Duygu Düzenleme ve Esneklik',
        titleEn: 'Emotion Regulation & Resilience',
        descriptionTr: 'Zorlayıcı durumlarda duygusal farkındalık, kabul ve düzenleme stratejilerini haritalandırır.',
        descriptionEn: 'Maps emotional awareness, acceptance, and regulation strategies under stress.',
        estimatedMinutes: 8,
      },
    ];

    for (const mod of modulesToUpsert) {
      if (!dryRun) {
        await prisma.assessmentModule.upsert({
          where: { code: mod.code },
          update: {
            titleTr: mod.titleTr,
            titleEn: mod.titleEn,
            descriptionTr: mod.descriptionTr,
            descriptionEn: mod.descriptionEn,
            estimatedMinutes: mod.estimatedMinutes,
          },
          create: mod,
        });
      }
      result.modulesCreatedOrUpdated++;
    }

    // ---------------------------------------------------------
    // 6. RSES ITEMS & ITEM VERSIONS (IMMUTABILITY & FAIL-CLOSED VERIFICATION)
    // ---------------------------------------------------------
    const rsesItemVersionIds: string[] = [];

    for (const itemDef of RSES_CANONICAL_ITEMS) {
      let item = null;
      let itemVersion = null;

      if (!dryRun) {
        // C2 Immutability Check: Do NOT mutate existing Item metadata in-place!
        const existingItem = await prisma.item.findUnique({
          where: { itemCode: itemDef.code },
        });

        if (!existingItem) {
          item = await prisma.item.create({
            data: {
              itemCode: itemDef.code,
              facetId: 'core_self_esteem',
              instrumentId: 'inst_rses',
              isKeyed: itemDef.isKeyed,
              itemType: 'LIKERT_4',
              isAttentionCheck: false,
            },
          });
        } else {
          // Compare immutable scientific metadata
          const isFacetMismatch = existingItem.facetId !== 'core_self_esteem';
          const isInstrumentMismatch = existingItem.instrumentId !== 'inst_rses';
          const isKeyedMismatch = existingItem.isKeyed !== itemDef.isKeyed;
          const isTypeMismatch = existingItem.itemType !== 'LIKERT_4';
          const isAttentionMismatch = existingItem.isAttentionCheck !== false;

          if (isFacetMismatch || isInstrumentMismatch || isKeyedMismatch || isTypeMismatch || isAttentionMismatch) {
            throw new Error(
              `SEMANTIC_MISMATCH: Item '${itemDef.code}' exists with different immutable scientific metadata. Expected (facetId='core_self_esteem', isKeyed=${itemDef.isKeyed}, itemType='LIKERT_4'), found (facetId='${existingItem.facetId}', isKeyed=${existingItem.isKeyed}, itemType='${existingItem.itemType}'). Importer fails closed to preserve C2 immutability.`
            );
          }

          item = existingItem;
        }

        // Check ItemVersion v1
        const existingVersion = await prisma.itemVersion.findUnique({
          where: {
            itemId_versionNumber: {
              itemId: item.id,
              versionNumber: 1,
            },
          },
        });

        if (!existingVersion) {
          // Create new ItemVersion strictly as DRAFT and isActive: false
          itemVersion = await prisma.itemVersion.create({
            data: {
              itemId: item.id,
              versionNumber: 1,
              promptTr: itemDef.promptTr,
              promptEn: itemDef.promptEn,
              status: 'DRAFT', // Requirement 3: Never create live ItemVersions directly
              isActive: false, // Requirement 3: Activation reserved for C3 publication engine
              validationStatus: 'PRE_CALIBRATION', // Requirement 4 & 5: Honest pre-calibration state
              licenseStatus: 'APPROVED_PUBLIC', // Requirement 5: Public domain license
              authorType: 'ADAPTATION', // Requirement 4: Provenance is scale adaptation
              sourceType: 'ACADEMIC_ADAPTATION',
              notes: 'Çuhadaroğlu (1986) Türkçeye uyarlanan Rosenberg Benlik Saygısı Alt Ölçeği maddesi. Ön-kalibrasyon araştırma sürümüdür.',
              options: {
                create: LIKERT_4_OPTIONS.map((opt) => ({
                  value: opt.value,
                  labelTr: opt.labelTr,
                  labelEn: opt.labelEn,
                  sortOrder: opt.sortOrder,
                })),
              },
            },
          });
        } else {
          // Compare version content for semantic mismatch
          if (
            existingVersion.promptTr !== itemDef.promptTr ||
            existingVersion.promptEn !== itemDef.promptEn
          ) {
            throw new Error(
              `SEMANTIC_MISMATCH: ItemVersion '${itemDef.code} v1' exists with different prompt text. Importer fails closed to preserve C2 immutability.`
            );
          }

          itemVersion = existingVersion;
        }

        rsesItemVersionIds.push(itemVersion.id);
      } else {
        rsesItemVersionIds.push(`mock_version_${itemDef.code}`);
      }

      result.itemsCreatedOrUpdated++;
    }

    // ---------------------------------------------------------
    // 7. RSES FORM VERSION (MODULE_2_SELF_IDENTITY) & C3 CANONICAL PUBLICATION
    // ---------------------------------------------------------
    const selfIdentityModule = dryRun
      ? { id: 'mod_self_identity', code: 'MODULE_2_SELF_IDENTITY', titleTr: 'Benlik ve Kimlik Sistemi' }
      : await prisma.assessmentModule.findUnique({ where: { code: 'MODULE_2_SELF_IDENTITY' } });

    if (selfIdentityModule) {
      let rsesFormVersion = null;

      if (!dryRun) {
        rsesFormVersion = await prisma.assessmentFormVersion.findUnique({
          where: {
            moduleId_versionCode: {
              moduleId: selfIdentityModule.id,
              versionCode: 'v1.0.0',
            },
          },
          include: { items: true },
        });

        if (!rsesFormVersion) {
          rsesFormVersion = await prisma.assessmentFormVersion.create({
            data: {
              moduleId: selfIdentityModule.id,
              versionCode: 'v1.0.0',
              status: 'DRAFT',
              isPublished: false,
              itemCount: RSES_CANONICAL_ITEMS.length,
              description: 'Rosenberg Benlik Saygısı Ölçeği (RSES) 10 maddelik standart form sürümü.',
              items: {
                create: rsesItemVersionIds.map((itemVersionId, index) => ({
                  itemVersionId,
                  sortOrder: index + 1,
                })),
              },
            },
            include: { items: true },
          });
        }
      }

      result.formsCreatedOrUpdated++;

      // Validate Form with C3 Validation Engine
      if (rsesFormVersion) {
        const validation = await validateAssessmentFormForPublication(rsesFormVersion.id);

        let isPublished = rsesFormVersion.isPublished;

        // Requirement 6 & 7: Only publish when publishRses is explicitly TRUE and call canonical publishAssessmentFormVersion
        if (validation.publishable && publishRses && !dryRun && !rsesFormVersion.isPublished) {
          const publishedResult = await publishAssessmentFormVersion(
            { formVersionId: rsesFormVersion.id },
            {
              actorUserId: 'system_importer',
              ip: '127.0.0.1',
              userAgent: 'PsycheAI-Assessment-Importer/1.0',
            }
          );

          isPublished = true;
          result.publishedFormIds.push(publishedResult.publishedForm.id);
        }

        result.publicationLogs.push({
          formCode: 'v1.0.0',
          moduleCode: 'MODULE_2_SELF_IDENTITY',
          publishable: validation.publishable,
          isPublished,
          blockers: validation.blockers,
          warnings: validation.warnings,
          info: validation.info,
        });
      }
    }

    // ---------------------------------------------------------
    // 8. DRAFT EMOTION REGULATION FORM (MODULE_3_EMOTION_REGULATION - NON-LIVE)
    // ---------------------------------------------------------
    const emotionModule = dryRun
      ? { id: 'mod_emotion_regulation', code: 'MODULE_3_EMOTION_REGULATION', titleTr: 'Duygu Düzenleme ve Esneklik' }
      : await prisma.assessmentModule.findUnique({ where: { code: 'MODULE_3_EMOTION_REGULATION' } });

    if (emotionModule) {
      let draftForm = null;

      if (!dryRun) {
        draftForm = await prisma.assessmentFormVersion.findUnique({
          where: {
            moduleId_versionCode: {
              moduleId: emotionModule.id,
              versionCode: 'v1.0.0-draft',
            },
          },
        });

        if (!draftForm) {
          draftForm = await prisma.assessmentFormVersion.create({
            data: {
              moduleId: emotionModule.id,
              versionCode: 'v1.0.0-draft',
              status: 'DRAFT',
              isPublished: false,
              itemCount: 0,
              description: 'Duygu Düzenleme Araştırma Taslağı (DERS/ERQ). Lisans onayı ve araştırma maddeleri beklenmektedir.',
            },
          });
        }
      }

      result.formsCreatedOrUpdated++;

      if (draftForm) {
        const validation = await validateAssessmentFormForPublication(draftForm.id);
        result.publicationLogs.push({
          formCode: 'v1.0.0-draft',
          moduleCode: 'MODULE_3_EMOTION_REGULATION',
          publishable: validation.publishable,
          isPublished: false,
          blockers: validation.blockers,
          warnings: validation.warnings,
          info: validation.info,
        });
      }
    }
  } catch (err: any) {
    result.success = false;
    result.errors.push(err.message || String(err));
  }

  return result;
}
