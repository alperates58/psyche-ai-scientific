import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export interface ItemProvenanceAuditResult {
  passed: boolean;
  totalItems: number;
  verifiedExactCount: number;
  verifiedTranslationCount: number;
  researchDraftCount: number;
  unknownCount: number;
  publishedFormsCount: number;
  publishedFormItemsCount: number;
  violations: string[];
}

export async function runItemProvenanceAudit(): Promise<ItemProvenanceAuditResult> {
  console.log('='.repeat(95));
  console.log('PSYCHE-AI SCIENTIFIC ITEM-LEVEL PROVENANCE AUDIT (FAZ 2.16)');
  console.log('='.repeat(95));

  const violations: string[] = [];

  // 1. Audit Database Items & ItemVersions
  const allItems = await prisma.item.findMany({
    include: {
      instrument: true,
      facet: true,
      versions: {
        include: {
          options: true,
        },
      },
    },
  });

  let verifiedExactCount = 0;
  let verifiedTranslationCount = 0;
  let researchDraftCount = 0;
  let unknownCount = 0;

  for (const item of allItems) {
    const v1 = item.versions.find((v) => v.versionNumber === 1) || item.versions[0];
    if (!v1) {
      violations.push(`Item ${item.itemCode} has NO ItemVersion.`);
      continue;
    }

    if (v1.validationStatus === 'PRE_CALIBRATION' && item.instrumentId === 'inst_ipip_hexaco') {
      verifiedExactCount++;
    } else if (v1.validationStatus === 'VALIDATED') {
      verifiedTranslationCount++;
    } else if (v1.validationStatus === 'RESEARCH_DRAFT') {
      researchDraftCount++;
    } else {
      unknownCount++;
    }
  }

  // 2. Audit Published Assessment Forms & Form Items
  const publishedForms = await prisma.assessmentFormVersion.findMany({
    where: { isPublished: true, status: 'PUBLISHED' },
    include: {
      module: true,
      items: {
        include: {
          itemVersion: {
            include: {
              item: {
                include: {
                  instrument: true,
                  facet: true,
                },
              },
              options: true,
            },
          },
        },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  console.log(`\nAuditing ${publishedForms.length} Published Form(s)...`);
  let publishedFormItemsCount = 0;

  for (const form of publishedForms) {
    console.log(`\n- Form: ${form.module.code} / ${form.versionCode} (${form.items.length} items)`);

    if (form.items.length === 0) {
      violations.push(`Published form ${form.module.code} has 0 items.`);
    }

    let expectedSortOrder = 1;
    for (const formItem of form.items) {
      publishedFormItemsCount++;
      const iv = formItem.itemVersion;
      const itm = iv.item;

      // Check continuous sort order
      if (formItem.sortOrder !== expectedSortOrder) {
        violations.push(`Form ${form.module.code} item sortOrder mismatch: found ${formItem.sortOrder}, expected ${expectedSortOrder}`);
      }
      expectedSortOrder++;

      // Strict Named Instrument Identity check
      if (form.module.code.includes('hexaco') || form.module.code.includes('HEXACO')) {
        if (itm.instrumentId !== 'inst_ipip_hexaco' && itm.instrumentId !== 'inst_hexaco_60') {
          violations.push(`Form ${form.module.code} contains item ${itm.itemCode} with unauthorized instrumentId: ${itm.instrumentId || 'NULL'}`);
        }
      }

      // Check that options exist
      if (!iv.options || iv.options.length === 0) {
        violations.push(`FormItem #${formItem.sortOrder} (${itm.itemCode}) has 0 response scale options.`);
      }

      // Check reverse-key metadata is valid boolean
      if (typeof itm.isKeyed !== 'boolean') {
        violations.push(`FormItem #${formItem.sortOrder} (${itm.itemCode}) has invalid isKeyed value.`);
      }
    }
  }

  // 3. Audit Provenance Matrix File
  const provenanceMatrixPath = path.join(process.cwd(), 'data/assessment-architecture/instrument-item-provenance.json');
  if (!fs.existsSync(provenanceMatrixPath)) {
    violations.push(`Provenance matrix file missing at ${provenanceMatrixPath}`);
  } else {
    const matrix = JSON.parse(fs.readFileSync(provenanceMatrixPath, 'utf-8'));
    console.log(`\n✓ Provenance Matrix contains ${matrix.length} instrument records.`);

    for (const entry of matrix) {
      if (entry.fullFormExecutable && entry.provenanceStatus !== 'VERIFIED_EXACT' && entry.provenanceStatus !== 'VERIFIED_TRANSLATION') {
        violations.push(`Instrument ${entry.instrumentId} marked executable but provenanceStatus is ${entry.provenanceStatus}`);
      }
    }
  }

  console.log('\n' + '='.repeat(95));
  console.log('ITEM-LEVEL SCIENTIFIC PROVENANCE METRICS:');
  console.log(`TOTAL DATABASE ITEMS:                    ${allItems.length}`);
  console.log(`VERIFIED VALIDATED-INSTRUMENT ITEMS:     ${verifiedExactCount}`);
  console.log(`VERIFIED TRANSLATED ITEMS:               ${verifiedTranslationCount}`);
  console.log(`RESEARCH-DRAFT ITEMS:                    ${researchDraftCount}`);
  console.log(`UNKNOWN / SEMANTIC-MATCH ITEMS:          ${unknownCount}`);
  console.log(`PUBLISHED EXECUTABLE FORMS:              ${publishedForms.length}`);
  console.log(`PUBLISHED EXECUTABLE ITEMS:              ${publishedFormItemsCount}`);
  console.log('='.repeat(95));

  if (violations.length > 0) {
    console.error('\n❌ AUDIT FAILED WITH VIOLATIONS:');
    for (const v of violations) {
      console.error(`  - ${v}`);
    }
    return {
      passed: false,
      totalItems: allItems.length,
      verifiedExactCount,
      verifiedTranslationCount,
      researchDraftCount,
      unknownCount,
      publishedFormsCount: publishedForms.length,
      publishedFormItemsCount,
      violations,
    };
  }

  console.log('\n✅ ITEM-LEVEL SCIENTIFIC PROVENANCE AUDIT PASSED (100% Coherent).');
  return {
    passed: true,
    totalItems: allItems.length,
    verifiedExactCount,
    verifiedTranslationCount,
    researchDraftCount,
    unknownCount,
    publishedFormsCount: publishedForms.length,
    publishedFormItemsCount,
    violations: [],
  };
}

if (require.main === module) {
  runItemProvenanceAudit()
    .then((res) => {
      if (!res.passed) {
        process.exit(1);
      }
    })
    .catch((err) => {
      console.error('Fatal audit error:', err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
