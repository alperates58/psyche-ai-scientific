import { importAssessmentLibrary } from '../src/services/assessmentLibraryImporter';
import { prisma } from '../src/lib/prisma';

async function run() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const publishRses = args.includes('--publish-rses'); // Strict requirement: false by default

  console.log('====================================================');
  console.log(' PsycheAI Assessment Library Expansion (FAZ 2.10)');
  console.log('====================================================');
  console.log(`Mode: ${dryRun ? 'DRY-RUN (Simulated)' : 'LIVE EXECUTION'}`);
  console.log(`Publish RSES: ${publishRses ? 'YES (Explicitly Requested)' : 'NO (Default: Draft Only)'}`);
  console.log('----------------------------------------------------');

  try {
    const result = await importAssessmentLibrary({
      dryRun,
      publishRses,
    });

    console.log('\n📊 Import Summary:');
    console.log(`- Success: ${result.success}`);
    console.log(`- Domains Processed: ${result.domainsCreatedOrUpdated}`);
    console.log(`- Constructs Processed: ${result.constructsCreatedOrUpdated}`);
    console.log(`- Facets Processed: ${result.facetsCreatedOrUpdated}`);
    console.log(`- Sources Processed: ${result.sourcesCreatedOrUpdated}`);
    console.log(`- Instruments Processed: ${result.instrumentsCreatedOrUpdated}`);
    console.log(`- Scoring Models Processed: ${result.scoringModelsCreatedOrUpdated}`);
    console.log(`- Assessment Modules Processed: ${result.modulesCreatedOrUpdated}`);
    console.log(`- Assessment Forms Processed: ${result.formsCreatedOrUpdated}`);
    console.log(`- Items Processed: ${result.itemsCreatedOrUpdated}`);

    console.log('\n🔍 Publication Validation Logs:');
    for (const log of result.publicationLogs) {
      console.log(`\n  Module: ${log.moduleCode} (${log.formCode})`);
      console.log(`  Publishable: ${log.publishable ? '✅ YES' : '❌ NO'}`);
      console.log(`  Live Published: ${log.isPublished ? '✅ YES' : '⏸️ DRAFT'}`);
      if (log.blockers.length > 0) {
        console.log('  Blockers:');
        for (const b of log.blockers) console.log(`    - [BLOCKER] ${b}`);
      }
      if (log.warnings.length > 0) {
        console.log('  Warnings:');
        for (const w of log.warnings) console.log(`    - [WARN] ${w}`);
      }
      if (log.info.length > 0) {
        console.log('  Info:');
        for (const i of log.info) console.log(`    - [INFO] ${i}`);
      }
    }

    if (result.errors.length > 0) {
      console.error('\n❌ Errors encountered:');
      for (const err of result.errors) {
        console.error(`  - ${err}`);
      }
      process.exit(1);
    }

    console.log('\n🎉 Assessment library import completed successfully.');
  } catch (error: any) {
    console.error('\n❌ Unhandled error during library import:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

run();
