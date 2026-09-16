import { Prisma, PrismaClient } from '@prisma/client';
import { prisma as defaultPrisma } from './prisma';

export interface PublicationValidationResult {
  publishable: boolean;
  blockers: string[];
  warnings: string[];
  info: string[];
  details: {
    formVersionId: string;
    versionCode: string;
    moduleId: string;
    moduleCode: string;
    moduleTitleTr: string;
    itemCount: number;
    existingPublishedFormId: string | null;
    existingPublishedVersionCode: string | null;
    distinctFacetsCount: number;
    distinctConstructsCount: number;
    distinctDomainsCount: number;
  };
}

/**
 * Pure validation engine verifying whether an AssessmentFormVersion satisfies
 * all psychological, structural, and legal invariants required for publication.
 */
export async function validateAssessmentFormForPublication(
  formVersionId: string,
  tx?: Prisma.TransactionClient | PrismaClient
): Promise<PublicationValidationResult> {
  const db = tx || defaultPrisma;

  const blockers: string[] = [];
  const warnings: string[] = [];
  const info: string[] = [];

  // 1. Fetch form with all relations
  const form = await db.assessmentFormVersion.findUnique({
    where: { id: formVersionId },
    include: {
      module: true,
      items: {
        orderBy: { sortOrder: 'asc' },
        include: {
          itemVersion: {
            include: {
              options: {
                orderBy: { sortOrder: 'asc' },
              },
              item: {
                include: {
                  facet: {
                    include: {
                      construct: {
                        include: {
                          domain: true,
                        },
                      },
                      validationSummary: true,
                    },
                  },
                  instrument: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!form) {
    return {
      publishable: false,
      blockers: ['NOT_FOUND: Değerlendirme formu bulunamadı.'],
      warnings: [],
      info: [],
      details: {
        formVersionId,
        versionCode: 'UNKNOWN',
        moduleId: '',
        moduleCode: '',
        moduleTitleTr: '',
        itemCount: 0,
        existingPublishedFormId: null,
        existingPublishedVersionCode: null,
        distinctFacetsCount: 0,
        distinctConstructsCount: 0,
        distinctDomainsCount: 0,
      },
    };
  }

  // 2. Fetch existing published form in the same module
  const existingPublishedForm = await db.assessmentFormVersion.findFirst({
    where: {
      moduleId: form.moduleId,
      status: 'PUBLISHED',
      id: { not: form.id },
    },
    select: {
      id: true,
      versionCode: true,
    },
  });

  // 3. Blocker: Form must be DRAFT and not already published
  if (form.status !== 'DRAFT' || form.isPublished) {
    blockers.push(
      `FORM_NOT_DRAFT: Yalnızca DRAFT durumundaki formlar yayına alınabilir (Mevcut durum: '${form.status}', isPublished: ${form.isPublished}).`
    );
  }

  // 4. Blocker: Item count > 0
  if (form.items.length === 0) {
    blockers.push('EMPTY_FORM: Formda en az 1 adet madde/soru bulunmalıdır.');
  }

  // 5. Blocker: Unique itemVersion check
  const seenVersionIds = new Set<string>();
  for (const item of form.items) {
    if (seenVersionIds.has(item.itemVersionId)) {
      blockers.push(
        `DUPLICATE_ITEM_VERSION: Formda mükerrer madde sürümü (${item.itemVersion.item.itemCode} v${item.itemVersion.versionNumber}) bulunmaktadır.`
      );
    }
    seenVersionIds.add(item.itemVersionId);
  }

  // 6. Blocker: Contiguous, unique sortOrder 1..N
  for (let i = 0; i < form.items.length; i++) {
    const expectedSort = i + 1;
    if (form.items[i].sortOrder !== expectedSort) {
      blockers.push(
        `SORT_ORDER_INCONSISTENCY: Soru sıralaması 1..${form.items.length} arasında kesintisiz olmalıdır. ${i + 1}. sıradaki sorunun sıra numarası: ${form.items[i].sortOrder}.`
      );
      break;
    }
  }

  // 7. Inspect each item and itemVersion
  const facetSet = new Set<string>();
  const constructSet = new Set<string>();
  const domainSet = new Set<string>();

  for (let idx = 0; idx < form.items.length; idx++) {
    const formItem = form.items[idx];
    const itemNum = idx + 1;
    const iv = formItem.itemVersion;

    if (!iv) {
      blockers.push(`MISSING_ITEM_VERSION: Soru #${itemNum} için madde sürümü kaydı eksik.`);
      continue;
    }

    const itm = iv.item;
    if (!itm) {
      blockers.push(`MISSING_ITEM: Soru #${itemNum} için ana madde tanımı eksik.`);
      continue;
    }

    // Blocker: Deprecated version
    if (iv.status === 'DEPRECATED') {
      blockers.push(
        `DEPRECATED_ITEM: Soru #${itemNum} (${itm.itemCode} v${iv.versionNumber}) kullanımdan kaldırılmış (DEPRECATED) bir sürümdür.`
      );
    }

    // Blocker: Missing prompt texts
    if (!iv.promptTr || iv.promptTr.trim().length < 3) {
      blockers.push(
        `MISSING_PROMPT_TR: Soru #${itemNum} (${itm.itemCode}) için Türkçe önerme metni eksik veya 3 karakterden kısa.`
      );
    }
    if (!iv.promptEn || iv.promptEn.trim().length < 3) {
      blockers.push(
        `MISSING_PROMPT_EN: Soru #${itemNum} (${itm.itemCode}) için İngilizce önerme metni eksik veya 3 karakterden kısa.`
      );
    }

    // Blocker: LIKERT_5 scale options validation
    if (itm.itemType === 'LIKERT_5') {
      if (iv.options.length !== 5) {
        blockers.push(
          `INVALID_OPTION_COUNT: Soru #${itemNum} (${itm.itemCode}) LIKERT_5 ölçeğinde tam olarak 5 cevap seçeneğine sahip olmalıdır (Mevcut: ${iv.options.length}).`
        );
      } else {
        const optionValues = iv.options.map((o) => o.value).sort((a, b) => a - b);
        if (JSON.stringify(optionValues) !== JSON.stringify([1, 2, 3, 4, 5])) {
          blockers.push(
            `INVALID_OPTION_VALUES: Soru #${itemNum} (${itm.itemCode}) seçenek değerleri 1, 2, 3, 4, 5 olmalıdır.`
          );
        }
        for (const opt of iv.options) {
          if (!opt.labelTr || opt.labelTr.trim() === '') {
            blockers.push(
              `MISSING_OPTION_LABEL: Soru #${itemNum} (${itm.itemCode}) ${opt.value} puan seçeneğinin Türkçe etiketi boş.`
            );
            break;
          }
        }
      }
    }

    // Blocker: Ontology chain
    if (!itm.facet || !itm.facet.construct || !itm.facet.construct.domain) {
      blockers.push(
        `INVALID_ONTOLOGY_CHAIN: Soru #${itemNum} (${itm.itemCode}) için Alt Boyut -> Ana Yapı -> Alan ontoloji eşleşmesi eksik.`
      );
    } else {
      facetSet.add(itm.facet.id);
      constructSet.add(itm.facet.construct.id);
      domainSet.add(itm.facet.construct.domain.id);
    }

    // Blocker: License rejected
    if (
      iv.licenseStatus === 'REJECTED_PROPRIETARY' ||
      itm.instrument?.licensingDecision === 'rejected'
    ) {
      blockers.push(
        `LICENSE_REJECTED: Soru #${itemNum} (${itm.itemCode}) için lisans kararı 'REJECTED_PROPRIETARY' olarak işaretlenmiştir. Canlı değerlendirmelerde kullanılamaz.`
      );
    }

    // Warnings: License unknown or requires license
    if (
      iv.licenseStatus === 'UNKNOWN' ||
      iv.licenseStatus === 'REQUIRES_LICENSE' ||
      itm.instrument?.licensingDecision === 'restricted'
    ) {
      warnings.push(
        `LICENSE_NOTICE: Soru #${itemNum} (${itm.itemCode}) lisans durumu: ${iv.licenseStatus || itm.instrument?.licensingDecision}.`
      );
    }

    // Warnings: Validation pre-calibration status
    if (iv.validationStatus === 'RESEARCH_DRAFT' || iv.validationStatus === 'PRE_CALIBRATION') {
      warnings.push(
        `PRE_CALIBRATION: Soru #${itemNum} (${itm.itemCode}) ön-kalibrasyon aşamasındadır (${iv.validationStatus}).`
      );
    }

    // Warnings: Turkish evidence level
    if (itm.facet?.validationSummary?.overallTurkishEvidenceLevel === 'NO_DIRECT') {
      warnings.push(
        `NO_DIRECT_EVIDENCE: ${itm.facet.nameTr} alt boyutu için doğrudan Türkçe psikometrik adaptasyon kanıtı henüz kaydedilmemiştir.`
      );
    }
  }

  // Deduplicate warnings
  const uniqueWarnings = Array.from(new Set(warnings));

  // 8. Info messages
  info.push(
    `Psikometrik Kapsam: ${form.items.length} soru, ${facetSet.size} alt boyut, ${constructSet.size} ana yapı, ${domainSet.size} alan.`
  );

  if (existingPublishedForm) {
    info.push(
      `Mevcut Canlı Form: '${existingPublishedForm.versionCode}'. Bu form yayına alındığında mevcut canlı form otomatik olarak ARŞİV'e (ARCHIVED) kaldırılacaktır.`
    );
  } else {
    info.push(
      `İlk Yayın: Bu modül (${form.module.titleTr}) için henüz yayında bir form bulunmamaktadır.`
    );
  }

  return {
    publishable: blockers.length === 0,
    blockers,
    warnings: uniqueWarnings,
    info,
    details: {
      formVersionId: form.id,
      versionCode: form.versionCode,
      moduleId: form.moduleId,
      moduleCode: form.module.code,
      moduleTitleTr: form.module.titleTr,
      itemCount: form.items.length,
      existingPublishedFormId: existingPublishedForm?.id || null,
      existingPublishedVersionCode: existingPublishedForm?.versionCode || null,
      distinctFacetsCount: facetSet.size,
      distinctConstructsCount: constructSet.size,
      distinctDomainsCount: domainSet.size,
    },
  };
}
