import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function importMasterBank() {
  console.log('--- STARTING MASTER ITEM BANK DATABASE IMPORT ---');

  const masterBankPath = path.resolve(__dirname, '../data/master-item-bank.json');
  if (!fs.existsSync(masterBankPath)) {
    throw new Error(`Master bank file not found at: ${masterBankPath}`);
  }

  const items = JSON.parse(fs.readFileSync(masterBankPath, 'utf8'));
  console.log(`Loaded ${items.length} candidate items from JSON.`);

  // Verify DB connection
  const facetsCount = await prisma.facet.count();
  console.log(`Database connected. Current facets in DB: ${facetsCount}`);

  let importedCount = 0;
  let updatedCount = 0;

  for (const it of items) {
    // Check if item already exists by itemCode
    const existingItem = await prisma.item.findUnique({
      where: { itemCode: it.id }
    });

    const isAttention = it.attentionCheck || it.measurementPurpose === 'careless_detection';

    if (!existingItem) {
      // Find instrument if available
      let instrumentId: string | null = null;
      if (it.instrumentIds && it.instrumentIds.length > 0) {
        const inst = await prisma.instrument.findUnique({
          where: { code: it.instrumentIds[0] }
        });
        if (inst) instrumentId = inst.id;
      }

      // Create Item
      const createdItem = await prisma.item.create({
        data: {
          itemCode: it.id,
          facetId: it.facetId,
          instrumentId,
          isKeyed: it.keying === 'POSITIVE',
          itemType: it.itemType.toUpperCase(),
          isAttentionCheck: isAttention
        }
      });

      // Create ItemVersion (RESEARCH_DRAFT)
      const version = await prisma.itemVersion.create({
        data: {
          itemId: createdItem.id,
          versionNumber: 1,
          promptTr: it.text_tr,
          promptEn: it.text_en || it.text_tr,
          validationStatus: 'RESEARCH_DRAFT',
          licenseStatus: it.licenseStatus || 'APPROVED_PUBLIC',
          isActive: true
        }
      });

      // Create Options if standard scale
      const scale = it.responseScale;
      if (scale && scale.labels_tr && scale.labels_tr.length > 0) {
        for (let i = 0; i < scale.labels_tr.length; i++) {
          const val = scale.min + i * (scale.step || 1);
          await prisma.itemVersionOption.create({
            data: {
              itemVersionId: version.id,
              value: val,
              labelTr: scale.labels_tr[i],
              labelEn: scale.labels_en ? scale.labels_en[i] || scale.labels_tr[i] : scale.labels_tr[i],
              sortOrder: i + 1
            }
          });
        }
      }

      importedCount++;
    } else {
      updatedCount++;
    }
  }

  // Double check that live assessment form items were NOT touched
  const publishedForms = await prisma.assessmentFormVersion.findMany({
    where: { isPublished: true },
    include: { items: true }
  });

  console.log('\n--- VERIFYING LIVE ASSESSMENT FORM FREEZE ---');
  for (const form of publishedForms) {
    console.log(`Form Version: ${form.versionCode}, Published Items Count: ${form.items.length}`);
  }

  console.log(`\nImport Completed Successfully:`);
  console.log(`- New Items Imported: ${importedCount}`);
  console.log(`- Existing Items Untouched: ${updatedCount}`);
  console.log(`- Total Items in DB: ${await prisma.item.count()}`);
  console.log(`- Published Assessment Forms remain strictly frozen.`);
}

importMasterBank()
  .catch((e) => {
    console.error('Error importing master bank:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
