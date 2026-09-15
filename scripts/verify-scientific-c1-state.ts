import { PrismaClient } from '@prisma/client';
import { verifyScientificC1State } from '../src/lib/scientificC1Verifier';

const prisma = new PrismaClient();

async function main() {
  console.log('==================================================');
  console.log('FAZ 2.7C-1: SCIENTIFIC C1 STATE VERIFIER');
  console.log('==================================================\n');

  try {
    const result = await verifyScientificC1State(prisma);

    console.log('Verification Details:');
    console.log(`- Schema Tables Ready:         ${result.details.schemaReady}`);
    console.log(`- Published Forms Count:       ${result.details.publishedFormsCount}`);
    console.log(`- Live Form Version:           ${result.details.liveFormCode}`);
    console.log(`- Live Form Items:             ${result.details.liveFormItemCount}`);
    console.log(`- Coherent Live Item Versions: ${result.details.liveItemVersionsCount}`);
    console.log(`- Ambiguous Items Outside:     ${result.details.activeItemsOutsideLiveFormCount}`);
    console.log(`- Validation Summaries:        ${result.details.validationSummariesCount} / 84`);
    console.log(`- Study Evidence Records:      ${result.details.studyEvidencesCount}`);
    console.log(`- Reliability Evidence Records:${result.details.reliabilityEvidencesCount}`);
    console.log('- Evidence Level Distribution:');
    console.log(`  * DIRECT:    ${result.details.evidenceDistribution.DIRECT} (Expected: 14)`);
    console.log(`  * LEXICAL:   ${result.details.evidenceDistribution.LEXICAL} (Expected: 24)`);
    console.log(`  * RELATED:   ${result.details.evidenceDistribution.RELATED} (Expected: 2)`);
    console.log(`  * NO_DIRECT: ${result.details.evidenceDistribution.NO_DIRECT} (Expected: 44)`);
    console.log('==================================================\n');

    if (!result.isComplete) {
      console.error('❌ SCIENTIFIC C1 STATE INCOMPLETE with errors:');
      result.errors.forEach((err, idx) => console.error(`  ${idx + 1}. ${err}`));
      process.exit(1);
    }

    console.log('✅ SCIENTIFIC C1 STATE VERIFIED: Complete, coherent, and ready for production serving.\n');
    process.exit(0);
  } catch (err: any) {
    console.error('❌ VERIFIER_UNEXPECTED_ERROR:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}
