import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export interface NativeBatterySeedResult {
  success: boolean;
  metrics: {
    domainsUpserted: number;
    constructsUpserted: number;
    facetsUpserted: number;
    itemsUpserted: number;
    itemVersionsUpserted: number;
    optionsUpserted: number;
    modulesUpserted: number;
    formVersionsUpserted: number;
    formItemsUpserted: number;
    scoringModelsUpserted: number;
  };
  errors: string[];
}

export async function seedPsycheAiNativeBattery(): Promise<NativeBatterySeedResult> {
  const root = path.resolve(__dirname, '..');
  const errors: string[] = [];

  const batteryDir = path.resolve(root, 'data/research-battery');
  const itemBankPath = path.join(batteryDir, 'psycheai-item-bank-v1.json');
  const modulesPath = path.join(batteryDir, 'psycheai-modules-v1.json');
  const scoringPath = path.join(batteryDir, 'psycheai-scoring-v1.json');
  const blueprintsPath = path.join(batteryDir, 'facet-measurement-blueprints-v1.json');
  const proposedModelPath = path.resolve(root, 'data/master-model/proposed-master-model.json');

  console.log('='.repeat(95));
  console.log('SEEDING PSYCHEAI NATIVE SCIENTIFIC RESEARCH BATTERY (FAZ 2.16.1)');
  console.log('='.repeat(95));

  // 1. Load data files
  const itemBankData = JSON.parse(fs.readFileSync(itemBankPath, 'utf8'));
  const modulesData = JSON.parse(fs.readFileSync(modulesPath, 'utf8'));
  const blueprintsData = JSON.parse(fs.readFileSync(blueprintsPath, 'utf8'));
  const proposedModel = JSON.parse(fs.readFileSync(proposedModelPath, 'utf8'));

  const items = itemBankData.items || [];
  const modules = modulesData.modules || [];
  const blueprints = blueprintsData.blueprints || [];
  const proposedDomains = proposedModel.domains || [];

  let domainsCount = 0;
  let constructsCount = 0;
  let facetsCount = 0;
  let itemsCount = 0;
  let itemVersionsCount = 0;
  let optionsCount = 0;
  let modulesCount = 0;
  let formVersionsCount = 0;
  let formItemsCount = 0;
  let scoringModelsCount = 0;

  try {
    // 2. Seed Domains
    for (const d of proposedDomains) {
      await prisma.domain.upsert({
        where: { id: d.domainId },
        update: {
          code: d.domainId,
          nameTr: d.domainNameTr,
          nameEn: d.domainNameEn,
          descriptionTr: d.descriptionTr || d.domainNameTr,
          descriptionEn: d.descriptionEn || d.domainNameEn,
        },
        create: {
          id: d.domainId,
          code: d.domainId,
          nameTr: d.domainNameTr,
          nameEn: d.domainNameEn,
          descriptionTr: d.descriptionTr || d.domainNameTr,
          descriptionEn: d.descriptionEn || d.domainNameEn,
        },
      });
      domainsCount++;

      // Seed Constructs
      for (const c of d.constructs || []) {
        await prisma.construct.upsert({
          where: { id: c.constructId },
          update: {
            code: c.constructId,
            domainId: d.domainId,
            nameTr: c.nameTr,
            nameEn: c.nameEn,
            descriptionTr: c.nameTr,
            descriptionEn: c.nameEn,
          },
          create: {
            id: c.constructId,
            code: c.constructId,
            domainId: d.domainId,
            nameTr: c.nameTr,
            nameEn: c.nameEn,
            descriptionTr: c.nameTr,
            descriptionEn: c.nameEn,
          },
        });
        constructsCount++;
      }
    }

    // Ensure Response Validity domain and construct exist
    await prisma.domain.upsert({
      where: { id: 'response_integrity' },
      update: {
        code: 'response_integrity',
        nameTr: 'Yanıt Geçerliği ve Veri Bütünlüğü',
        nameEn: 'Response Validity & Data Integrity',
        descriptionTr: 'Protokol kalitesi, dikkat kontrolü ve yanıt tutarlılığı.',
        descriptionEn: 'Protocol quality, attention checks, and response consistency.',
      },
      create: {
        id: 'response_integrity',
        code: 'response_integrity',
        nameTr: 'Yanıt Geçerliği ve Veri Bütünlüğü',
        nameEn: 'Response Validity & Data Integrity',
        descriptionTr: 'Protokol kalitesi, dikkat kontrolü ve yanıt tutarlılığı.',
        descriptionEn: 'Protocol quality, attention checks, and response consistency.',
      },
    });

    await prisma.construct.upsert({
      where: { id: 'response_quality' },
      update: {
        code: 'response_quality',
        domainId: 'response_integrity',
        nameTr: 'Protokol Kalite Kontrolü',
        nameEn: 'Protocol Quality Control',
        descriptionTr: 'Dikkatsiz yanıtlama ve tutarsızlık kontrolleri.',
        descriptionEn: 'Inattentive responding and consistency checks.',
      },
      create: {
        id: 'response_quality',
        code: 'response_quality',
        domainId: 'response_integrity',
        nameTr: 'Protokol Kalite Kontrolü',
        nameEn: 'Protocol Quality Control',
        descriptionTr: 'Dikkatsiz yanıtlama ve tutarsızlık kontrolleri.',
        descriptionEn: 'Inattentive responding and consistency checks.',
      },
    });

    // Ensure all blueprint constructs exist
    for (const bp of blueprints) {
      if (bp.constructId) {
        await prisma.construct.upsert({
          where: { id: bp.constructId },
          update: {
            code: bp.constructId,
            domainId: bp.domainId,
            nameTr: bp.nameTr || bp.constructId,
            nameEn: bp.nameEn || bp.constructId,
            descriptionTr: bp.scientificDefinitionTr || bp.nameTr,
            descriptionEn: bp.nameEn || bp.constructId,
          },
          create: {
            id: bp.constructId,
            code: bp.constructId,
            domainId: bp.domainId,
            nameTr: bp.nameTr || bp.constructId,
            nameEn: bp.nameEn || bp.constructId,
            descriptionTr: bp.scientificDefinitionTr || bp.nameTr,
            descriptionEn: bp.nameEn || bp.constructId,
          },
        });
        constructsCount++;
      }
    }

    // 3. Seed Facets
    for (const bp of blueprints) {
      await prisma.facet.upsert({
        where: { id: bp.facetId },
        update: {
          code: bp.facetId,
          constructId: bp.constructId,
          nameTr: bp.nameTr,
          nameEn: bp.nameEn,
          descriptionTr: bp.scientificDefinitionTr,
          descriptionEn: bp.nameEn,
        },
        create: {
          id: bp.facetId,
          code: bp.facetId,
          constructId: bp.constructId,
          nameTr: bp.nameTr,
          nameEn: bp.nameEn,
          descriptionTr: bp.scientificDefinitionTr,
          descriptionEn: bp.nameEn,
        },
      });
      facetsCount++;
    }

    // Response quality facets
    const qualityFacets = [
      { id: 'attention_check', nameTr: 'Dikkat Kontrolü', nameEn: 'Attention Check' },
      { id: 'paired_consistency', nameTr: 'Çiftli Tutarlılık', nameEn: 'Paired Consistency' },
      { id: 'infrequency_check', nameTr: 'Olasılıksız Yanıt Kontrolü', nameEn: 'Infrequency Check' },
    ];
    for (const qf of qualityFacets) {
      await prisma.facet.upsert({
        where: { id: qf.id },
        update: {
          code: qf.id,
          constructId: 'response_quality',
          nameTr: qf.nameTr,
          nameEn: qf.nameEn,
          descriptionTr: qf.nameTr,
          descriptionEn: qf.nameEn,
        },
        create: {
          id: qf.id,
          code: qf.id,
          constructId: 'response_quality',
          nameTr: qf.nameTr,
          nameEn: qf.nameEn,
          descriptionTr: qf.nameTr,
          descriptionEn: qf.nameEn,
        },
      });
      facetsCount++;
    }

    // 4. Seed Native Instrument Record
    const nativeInstrument = await prisma.instrument.upsert({
      where: { id: 'inst_psycheai_native_v1' },
      update: {
        code: 'PSYCHEAI_NATIVE_BATTERY',
        name: 'PsycheAI Native Research Battery',
        fullName: 'PsycheAI Construct-Derived Scientific Psychological Research Battery (v1.0.0)',
        licenseType: 'ORIGINAL_PROPRIETARY',
        licensingDecision: 'approved',
        citation: 'PsycheAI Scientific Research Consortium (2026). Native Turkish Psychological Research Battery.',
      },
      create: {
        id: 'inst_psycheai_native_v1',
        code: 'PSYCHEAI_NATIVE_BATTERY',
        name: 'PsycheAI Native Research Battery',
        fullName: 'PsycheAI Construct-Derived Scientific Psychological Research Battery (v1.0.0)',
        licenseType: 'ORIGINAL_PROPRIETARY',
        licensingDecision: 'approved',
        citation: 'PsycheAI Scientific Research Consortium (2026). Native Turkish Psychological Research Battery.',
      },
    });

    // 5. Seed Items, ItemVersions, ItemOptions
    const STANDARD_LIKERT_OPTIONS = [
      { value: 1, labelTr: 'Kesinlikle Katılmıyorum', labelEn: 'Strongly Disagree', sortOrder: 1 },
      { value: 2, labelTr: 'Katılmıyorum', labelEn: 'Disagree', sortOrder: 2 },
      { value: 3, labelTr: 'Nötr / Kararsızım', labelEn: 'Neutral / Undecided', sortOrder: 3 },
      { value: 4, labelTr: 'Katılıyorum', labelEn: 'Agree', sortOrder: 4 },
      { value: 5, labelTr: 'Kesinlikle Katılıyorum', labelEn: 'Strongly Agree', sortOrder: 5 },
    ];

    for (const item of items) {
      const facetId = item.itemCategory === 'RESPONSE_QUALITY'
        ? item.qualityType.toLowerCase()
        : item.facetId;

      const isAttention = item.qualityType === 'ATTENTION_CHECK';
      const isKeyed = !item.reverseKeyed;

      const dbItem = await prisma.item.upsert({
        where: { itemCode: item.itemId },
        update: {
          facetId: facetId,
          instrumentId: nativeInstrument.id,
          isKeyed: isKeyed,
          itemType: 'LIKERT_5',
          isAttentionCheck: isAttention,
        },
        create: {
          id: item.itemId,
          itemCode: item.itemId,
          facetId: facetId,
          instrumentId: nativeInstrument.id,
          isKeyed: isKeyed,
          itemType: 'LIKERT_5',
          isAttentionCheck: isAttention,
        },
      });
      itemsCount++;

      // Item Version
      const itemVersion = await prisma.itemVersion.upsert({
        where: {
          itemId_versionNumber: {
            itemId: dbItem.id,
            versionNumber: 1,
          },
        },
        update: {
          promptTr: item.promptTr,
          promptEn: item.promptEn || item.promptTr,
          status: 'ACTIVE',
          validationStatus: 'PRE_CALIBRATION',
          licenseStatus: 'APPROVED_PUBLIC',
          authorType: 'GENERATIVE_AI',
          sourceType: item.originalityMethod || 'CONSTRUCT_DERIVED',
          isActive: true,
          notes: item.itemCategory === 'RESPONSE_QUALITY' ? `Response Quality: ${item.qualityType}` : `Facet: ${item.facetId}`,
        },
        create: {
          itemId: dbItem.id,
          versionNumber: 1,
          promptTr: item.promptTr,
          promptEn: item.promptEn || item.promptTr,
          status: 'ACTIVE',
          validationStatus: 'PRE_CALIBRATION',
          licenseStatus: 'APPROVED_PUBLIC',
          authorType: 'GENERATIVE_AI',
          sourceType: item.originalityMethod || 'CONSTRUCT_DERIVED',
          isActive: true,
          notes: item.itemCategory === 'RESPONSE_QUALITY' ? `Response Quality: ${item.qualityType}` : `Facet: ${item.facetId}`,
        },
      });
      itemVersionsCount++;

      // Options
      for (const opt of STANDARD_LIKERT_OPTIONS) {
        await prisma.itemVersionOption.upsert({
          where: {
            itemVersionId_value: {
              itemVersionId: itemVersion.id,
              value: opt.value,
            },
          },
          update: {
            labelTr: opt.labelTr,
            labelEn: opt.labelEn,
            sortOrder: opt.sortOrder,
          },
          create: {
            itemVersionId: itemVersion.id,
            value: opt.value,
            labelTr: opt.labelTr,
            labelEn: opt.labelEn,
            sortOrder: opt.sortOrder,
          },
        });
        optionsCount++;
      }
    }

    // 6. Seed Scoring Models
    const preCalibScoringModel = await prisma.scoringModelVersion.upsert({
      where: { code: 'PRE_CALIBRATION_MEAN_V1' },
      update: {
        description: 'PsycheAI Deterministic Unweighted Facet Mean Scoring Engine (1-5 Bounds)',
        algorithm: 'PRE_CALIBRATION_UNWEIGHTED_FACET_MEAN_V1',
        isPreCalibration: true,
      },
      create: {
        id: 'scoring_pre_calibration_mean_v1',
        code: 'PRE_CALIBRATION_MEAN_V1',
        description: 'PsycheAI Deterministic Unweighted Facet Mean Scoring Engine (1-5 Bounds)',
        algorithm: 'PRE_CALIBRATION_UNWEIGHTED_FACET_MEAN_V1',
        isPreCalibration: true,
      },
    });
    scoringModelsCount++;

    // 7. Seed Assessment Modules, FormVersions & FormItems
    const itemMap = new Map<string, any>();
    const allDbItemVersions = await prisma.itemVersion.findMany({
      include: { item: true },
    });
    allDbItemVersions.forEach(iv => {
      itemMap.set(iv.item.itemCode, iv);
    });

    for (const mod of modules) {
      const dbModule = await prisma.assessmentModule.upsert({
        where: { code: mod.moduleCode },
        update: {
          titleTr: mod.titleTr,
          titleEn: mod.titleEn,
          descriptionTr: `${mod.titleTr} — PsycheAI Özgün Bilimsel Araştırma Formu (${mod.totalItemsCount} Soru)`,
          descriptionEn: `${mod.titleEn} — PsycheAI Native Research Form (${mod.totalItemsCount} Questions)`,
          estimatedMinutes: mod.estimatedMinutes,
        },
        create: {
          id: mod.moduleId,
          code: mod.moduleCode,
          titleTr: mod.titleTr,
          titleEn: mod.titleEn,
          descriptionTr: `${mod.titleTr} — PsycheAI Özgün Bilimsel Araştırma Formu (${mod.totalItemsCount} Soru)`,
          descriptionEn: `${mod.titleEn} — PsycheAI Native Research Form (${mod.totalItemsCount} Questions)`,
          estimatedMinutes: mod.estimatedMinutes,
        },
      });
      modulesCount++;

      // Archive/unpublish legacy form versions for this module
      await prisma.assessmentFormVersion.updateMany({
        where: {
          moduleId: dbModule.id,
          versionCode: { not: 'v1.0.0-psycheai-native' },
        },
        data: {
          isPublished: false,
        },
      });

      // Create distinct native form version
      const nativeVersionCode = 'v1.0.0-psycheai-native';
      const formVersionId = `form_${mod.moduleId}_psycheai_v1_0_0`;

      // Upsert by id first or by moduleId_versionCode
      const formVersion = await prisma.assessmentFormVersion.upsert({
        where: {
          moduleId_versionCode: {
            moduleId: dbModule.id,
            versionCode: nativeVersionCode,
          },
        },
        update: {
          isPublished: true,
          status: 'PUBLISHED',
          itemCount: mod.totalItemsCount,
          publishedAt: new Date(),
          description: `PsycheAI Native Araştırma Formu (${mod.totalItemsCount} soru)`,
        },
        create: {
          id: formVersionId,
          moduleId: dbModule.id,
          versionCode: nativeVersionCode,
          isPublished: true,
          status: 'PUBLISHED',
          itemCount: mod.totalItemsCount,
          publishedAt: new Date(),
          description: `PsycheAI Native Araştırma Formu (${mod.totalItemsCount} soru)`,
        },
      });
      formVersionsCount++;

      // Form items: psychological items + response quality items
      const allItemCodesInModule = [
        ...(mod.psychologicalItemIds || []),
        ...(mod.responseQualityItemIds || []),
      ];

      // Cleanly clear existing form items for this form version if no session is active
      const sessionCount = await prisma.assessmentSession.count({
        where: { formVersionId: formVersion.id },
      });

      if (sessionCount === 0) {
        await prisma.assessmentFormItem.deleteMany({
          where: { formVersionId: formVersion.id },
        });
      }

      for (let idx = 0; idx < allItemCodesInModule.length; idx++) {
        const itemCode = allItemCodesInModule[idx];
        const iv = itemMap.get(itemCode);
        if (!iv) {
          errors.push(`ItemVersion not found for item code: ${itemCode} in module ${mod.moduleCode}`);
          continue;
        }

        if (sessionCount === 0) {
          await prisma.assessmentFormItem.create({
            data: {
              formVersionId: formVersion.id,
              itemVersionId: iv.id,
              sortOrder: idx + 1,
            },
          });
        } else {
          await prisma.assessmentFormItem.upsert({
            where: {
              formVersionId_itemVersionId: {
                formVersionId: formVersion.id,
                itemVersionId: iv.id,
              },
            },
            update: {
              sortOrder: idx + 1,
            },
            create: {
              formVersionId: formVersion.id,
              itemVersionId: iv.id,
              sortOrder: idx + 1,
            },
          });
        }
        formItemsCount++;
      }
    }

    console.log(`- Domains Upserted: ${domainsCount}`);
    console.log(`- Constructs Upserted: ${constructsCount}`);
    console.log(`- Facets Upserted: ${facetsCount}`);
    console.log(`- Items Upserted: ${itemsCount}`);
    console.log(`- ItemVersions Upserted: ${itemVersionsCount}`);
    console.log(`- Option Versions Upserted: ${optionsCount}`);
    console.log(`- Modules Upserted: ${modulesCount}`);
    console.log(`- Published FormVersions: ${formVersionsCount}`);
    console.log(`- FormItems Mapped: ${formItemsCount}`);
    console.log(`- Scoring Models: ${scoringModelsCount}`);
    console.log('='.repeat(95));
    console.log('✅ PSYCHEAI NATIVE BATTERY SEEDING COMPLETED SUCCESSFULLY');

    return {
      success: errors.length === 0,
      metrics: {
        domainsUpserted: domainsCount,
        constructsUpserted: constructsCount,
        facetsUpserted: facetsCount,
        itemsUpserted: itemsCount,
        itemVersionsUpserted: itemVersionsCount,
        optionsUpserted: optionsCount,
        modulesUpserted: modulesCount,
        formVersionsUpserted: formVersionsCount,
        formItemsUpserted: formItemsCount,
        scoringModelsUpserted: scoringModelsCount,
      },
      errors,
    };
  } catch (err: any) {
    console.error('SEEDING FAILED WITH ERROR:', err);
    errors.push(err.message || String(err));
    return {
      success: false,
      metrics: {
        domainsUpserted: domainsCount,
        constructsUpserted: constructsCount,
        facetsUpserted: facetsCount,
        itemsUpserted: itemsCount,
        itemVersionsUpserted: itemVersionsCount,
        optionsUpserted: optionsCount,
        modulesUpserted: modulesCount,
        formVersionsUpserted: formVersionsCount,
        formItemsUpserted: formItemsCount,
        scoringModelsUpserted: scoringModelsCount,
      },
      errors,
    };
  }
}

if (require.main === module) {
  seedPsycheAiNativeBattery()
    .then((res) => {
      if (!res.success) {
        process.exit(1);
      }
    })
    .finally(() => prisma.$disconnect());
}
