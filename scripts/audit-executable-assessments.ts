import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { resolveScoringStrategy } from '../src/lib/scoringStrategies';

const prisma = new PrismaClient();

export interface ModuleAuditDetail {
  assessmentId: string;
  title: string;
  catalogCategory: string;
  journeyStage: string;
  plannedQuestionCount: number;
  instrumentIds: string[];
  dbModuleExists: boolean;
  instrumentRecordsExist: boolean;
  formExists: boolean;
  formVersionExists: boolean;
  publishedFormVersionExists: boolean;
  formItemCount: number;
  expectedItemCount: number;
  responseScaleConfigured: boolean;
  scoringStrategyExists: boolean;
  moduleToFormMappingExists: boolean;
  isExecutable: boolean;
  classification:
    | 'EXECUTABLE'
    | 'RESEARCH_CONTENT_PENDING'
    | 'CONTENT_MISSING'
    | 'FORM_MISSING'
    | 'FORM_VERSION_MISSING'
    | 'ITEMS_MISSING'
    | 'NOT_PUBLISHED'
    | 'MAPPING_MISSING'
    | 'SCORING_MISSING';
  blockers: string[];
}

export interface ExecutableAssessmentsAuditReport {
  success: boolean;
  modules: ModuleAuditDetail[];
  totals: {
    totalModules: number;
    consumerModulesTotal: number;
    executableConsumerModules: number;
    contentPendingConsumerModules: number;
    advancedExecutableModules: number;
    plannedConsumerQuestions: number;
    actuallyExecutableConsumerQuestions: number;
    contentPendingConsumerQuestions: number;
    plannedAllQuestions: number;
    actuallyExecutableAllQuestions: number;
  };
  errors: string[];
}

export async function runExecutableAssessmentsAudit(): Promise<ExecutableAssessmentsAuditReport> {
  const root = path.resolve(__dirname, '..');
  const archPath = path.resolve(root, 'data/assessment-architecture/assessment-architecture.json');
  const architectureModules = JSON.parse(fs.readFileSync(archPath, 'utf8'));

  const errors: string[] = [];
  const moduleDetails: ModuleAuditDetail[] = [];

  // Fetch all modules from DB with form versions and items
  const dbModules = await prisma.assessmentModule.findMany({
    include: {
      formVersions: {
        include: {
          items: {
            include: {
              itemVersion: {
                include: {
                  options: true,
                },
              },
            },
          },
        },
      },
    },
  });

  // Fetch instruments
  const dbInstruments = await prisma.instrument.findMany();
  const dbInstrumentCodes = new Set(dbInstruments.map((i) => i.code.toLowerCase()));

  // Fetch scoring models
  const dbScoringModels = await prisma.scoringModelVersion.findMany();
  const dbScoringModelCodes = new Set(dbScoringModels.map((sm) => sm.code));

  for (const arch of architectureModules) {
    const blockers: string[] = [];

    // 1. DB Module check
    const matchingDbMod = dbModules.find(
      (m) =>
        m.code.toLowerCase() === arch.assessmentId.toLowerCase() ||
        m.id.toLowerCase() === arch.assessmentId.toLowerCase()
    );
    const dbModuleExists = !!matchingDbMod;
    if (!dbModuleExists) {
      blockers.push(`DB AssessmentModule record missing for ${arch.assessmentId}`);
    }

    // 2. Instrument check
    const instCandidates: string[] = arch.instrumentCandidates || [];
    const instrumentRecordsExist = instCandidates.some((code) =>
      dbInstrumentCodes.has(code.toLowerCase())
    );

    // 3. Form & FormVersion check
    const formVersions = matchingDbMod?.formVersions || [];
    const formExists = formVersions.length > 0;
    const publishedForm = formVersions.find((fv) => fv.isPublished && fv.status === 'PUBLISHED');
    const formVersionExists = formExists;
    const publishedFormVersionExists = !!publishedForm;

    // 4. Form Items & Response Scale check
    const formItems = publishedForm?.items || [];
    const formItemCount = formItems.length;
    const expectedItemCount = publishedForm ? publishedForm.itemCount : arch.questionCountPlanned;

    let responseScaleConfigured = false;
    if (formItems.length > 0) {
      responseScaleConfigured = formItems.every(
        (fi) => fi.itemVersion && fi.itemVersion.options && fi.itemVersion.options.length >= 2
      );
    }

    // 5. Scoring Strategy check
    let scoringStrategyExists = false;
    try {
      const resolved = resolveScoringStrategy(null, arch.assessmentId);
      scoringStrategyExists = !!resolved && dbScoringModelCodes.has(resolved.code);
    } catch {
      scoringStrategyExists = false;
    }

    // 6. Mapping check
    const moduleToFormMappingExists =
      dbModuleExists && publishedFormVersionExists && publishedForm?.moduleId === matchingDbMod?.id;

    // Determine Classification
    let classification: ModuleAuditDetail['classification'];
    let isExecutable = false;

    if (publishedFormVersionExists && formItemCount > 0) {
      if (formItemCount !== expectedItemCount) {
        classification = 'ITEMS_MISSING';
        blockers.push(`Item count mismatch: form has ${formItemCount}, expected ${expectedItemCount}`);
      } else if (!responseScaleConfigured) {
        classification = 'ITEMS_MISSING';
        blockers.push('Response scale options missing on one or more items');
      } else if (!scoringStrategyExists) {
        classification = 'SCORING_MISSING';
        blockers.push('Scoring strategy not registered in DB');
      } else if (!moduleToFormMappingExists) {
        classification = 'MAPPING_MISSING';
        blockers.push('Module to FormVersion relational mapping broken');
      } else {
        classification = 'EXECUTABLE';
        isExecutable = true;
      }
    } else {
      if (arch.stage === 'ADVANCED' || ['mod_flourishing_vitality', 'mod_coping_resilience', 'mod_creativity_growth'].includes(arch.assessmentId)) {
        classification = 'RESEARCH_CONTENT_PENDING';
      } else if (!dbModuleExists) {
        classification = 'CONTENT_MISSING';
      } else if (!formExists) {
        classification = 'FORM_MISSING';
      } else if (!publishedFormVersionExists) {
        classification = 'NOT_PUBLISHED';
      } else {
        classification = 'ITEMS_MISSING';
      }
    }

    // Critical Invariant: If marked playable or executable, it MUST be 100% valid
    if (isExecutable && blockers.length > 0) {
      errors.push(`Module ${arch.assessmentId} marked EXECUTABLE but has blockers: ${blockers.join(', ')}`);
    }

    moduleDetails.push({
      assessmentId: arch.assessmentId,
      title: arch.titleTr,
      catalogCategory: arch.catalogCategory,
      journeyStage: arch.stage,
      plannedQuestionCount: arch.questionCountPlanned,
      instrumentIds: arch.instrumentCandidates || [],
      dbModuleExists,
      instrumentRecordsExist,
      formExists,
      formVersionExists,
      publishedFormVersionExists,
      formItemCount,
      expectedItemCount,
      responseScaleConfigured,
      scoringStrategyExists,
      moduleToFormMappingExists,
      isExecutable,
      classification,
      blockers,
    });
  }

  const consumerModules = moduleDetails.filter((m) => m.journeyStage !== 'ADVANCED');
  const advancedModules = moduleDetails.filter((m) => m.journeyStage === 'ADVANCED');

  const executableConsumer = consumerModules.filter((m) => m.isExecutable);
  const pendingConsumer = consumerModules.filter((m) => !m.isExecutable);

  const executableConsumerQuestions = executableConsumer.reduce((acc, m) => acc + m.formItemCount, 0);
  const pendingConsumerQuestions = pendingConsumer.reduce((acc, m) => acc + m.plannedQuestionCount, 0);
  const advancedQuestions = advancedModules.reduce((acc, m) => acc + (m.isExecutable ? m.formItemCount : m.plannedQuestionCount), 0);

  const success = errors.length === 0;

  return {
    success,
    modules: moduleDetails,
    totals: {
      totalModules: moduleDetails.length,
      consumerModulesTotal: consumerModules.length,
      executableConsumerModules: executableConsumer.length,
      contentPendingConsumerModules: pendingConsumer.length,
      advancedExecutableModules: advancedModules.filter((m) => m.isExecutable).length,
      plannedConsumerQuestions: executableConsumerQuestions + pendingConsumerQuestions,
      actuallyExecutableConsumerQuestions: executableConsumerQuestions,
      contentPendingConsumerQuestions: pendingConsumerQuestions,
      plannedAllQuestions: executableConsumerQuestions + pendingConsumerQuestions + advancedQuestions,
      actuallyExecutableAllQuestions: executableConsumerQuestions + (advancedModules.find((m) => m.isExecutable)?.formItemCount || 0),
    },
    errors,
  };
}

if (require.main === module) {
  runExecutableAssessmentsAudit()
    .then((report) => {
      console.log('='.repeat(95));
      console.log('PSYCHE-AI EXECUTABLE ASSESSMENTS AUDIT & CONTENT VERIFICATION REPORT');
      console.log('='.repeat(95));

      console.log(`\n${'MODULE'.padEnd(36)} ${'STAGE'.padEnd(12)} ${'EXP'.padEnd(6)} ${'ACT'.padEnd(6)} ${'STATUS'.padEnd(26)} ${'EXECUTABLE'}`);
      console.log('-'.repeat(95));

      for (const m of report.modules) {
        const execLabel = m.isExecutable ? 'YES' : 'NO';
        console.log(
          `${m.assessmentId.padEnd(36)} ${m.journeyStage.padEnd(12)} ${String(m.expectedItemCount).padEnd(6)} ${String(m.formItemCount).padEnd(6)} ${m.classification.padEnd(26)} ${execLabel}`
        );
      }

      console.log('\n' + '='.repeat(95));
      console.log('PORTFOLIO TOTALS:');
      console.log(`Consumer Modules Total:              ${report.totals.consumerModulesTotal}`);
      console.log(`Executable Consumer Modules:         ${report.totals.executableConsumerModules}`);
      console.log(`Content-Pending Consumer Modules:    ${report.totals.contentPendingConsumerModules}`);
      console.log(`Advanced Executable Modules:         ${report.totals.advancedExecutableModules}`);
      console.log(`Planned Consumer Questions:          ${report.totals.plannedConsumerQuestions}`);
      console.log(`Actually Executable Questions:       ${report.totals.actuallyExecutableAllQuestions}`);
      console.log(`Content-Pending Questions:           ${report.totals.contentPendingConsumerQuestions}`);
      console.log('='.repeat(95));

      if (!report.success) {
        console.error('\n❌ AUDIT FAILED with errors:');
        report.errors.forEach((e) => console.error(` - ${e}`));
        process.exit(1);
      } else {
        console.log('\n✅ EXECUTABLE ASSESSMENT AUDIT PASSED: All playable forms verified.');
        process.exit(0);
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
