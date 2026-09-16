import { describe, it, expect, beforeAll } from 'vitest';
import { assertTestDatabaseSafety } from '../../scripts/verify-test-db-safety';
import { importAssessmentLibrary } from '../../src/services/assessmentLibraryImporter';
import { resolveVisualArchetype } from '../../src/lib/assessmentInterpretationConfig';
import { resolveScoringStrategy } from '../../src/lib/scoringStrategies';
import { getModuleJourneyMetadata } from '../../src/lib/assessmentJourneyConfig';

describe('FAZ 2.12 Integration: Assessment Library Importer & Safety Engine', () => {
  beforeAll(() => {
    // Check DB safety gate if DB URL is provided
    if (process.env.TEST_DATABASE_URL) {
      assertTestDatabaseSafety(process.env.TEST_DATABASE_URL);
    }
  });

  it('executes dry-run import simulation idempotently and defaults to NON-PUBLISHING', async () => {
    // Calling without publishRses flag must default to non-publishing
    const dryRunResult = await importAssessmentLibrary({ dryRun: true });

    expect(dryRunResult.success).toBe(true);
    expect(dryRunResult.dryRun).toBe(true);
    expect(dryRunResult.errors).toHaveLength(0);
    expect(dryRunResult.publishedFormIds).toHaveLength(0); // STRICT: No published forms by default

    expect(dryRunResult.domainsCreatedOrUpdated).toBeGreaterThanOrEqual(3);
    expect(dryRunResult.constructsCreatedOrUpdated).toBeGreaterThanOrEqual(4);
    expect(dryRunResult.facetsCreatedOrUpdated).toBeGreaterThanOrEqual(6);
    expect(dryRunResult.sourcesCreatedOrUpdated).toBeGreaterThanOrEqual(9);
    expect(dryRunResult.instrumentsCreatedOrUpdated).toBeGreaterThanOrEqual(4);
    expect(dryRunResult.scoringModelsCreatedOrUpdated).toBeGreaterThanOrEqual(5);
    expect(dryRunResult.modulesCreatedOrUpdated).toBeGreaterThanOrEqual(4);
  });

  it('correctly maps imported modules into the onboarding journey hierarchy', () => {
    const rsesJourney = getModuleJourneyMetadata('MODULE_2_SELF_IDENTITY');
    expect(rsesJourney.classification).toBe('REQUIRED');
    expect(rsesJourney.priority).toBe(2);
    expect(rsesJourney.domainNameTr).toBe('Benlik & Öz-Düzenleme');

    const gseJourney = getModuleJourneyMetadata('MODULE_5_GENERAL_SELF_EFFICACY');
    expect(gseJourney.classification).toBe('RECOMMENDED');
    expect(gseJourney.priority).toBe(5);
    expect(gseJourney.domainNameTr).toBe('Benlik & Öz-Düzenleme');

    const erqJourney = getModuleJourneyMetadata('MODULE_3_EMOTION_REGULATION');
    expect(erqJourney.classification).toBe('REQUIRED');
    expect(erqJourney.priority).toBe(3);
    expect(erqJourney.domainNameTr).toBe('Duygular & Dayanıklılık');

    const attachmentJourney = getModuleJourneyMetadata('MODULE_6_ATTACHMENT_PATTERNS');
    expect(attachmentJourney.classification).toBe('RECOMMENDED');
    expect(attachmentJourney.priority).toBe(8);
    expect(attachmentJourney.domainNameTr).toBe('İlişkiler & Sosyal Dinamikler');
  });

  it('binds appropriate visual archetype and scoring strategy to expanded modules', () => {
    expect(resolveVisualArchetype('MODULE_2_SELF_IDENTITY')).toBe('DIMENSION_SPECTRUM');
    expect(resolveVisualArchetype('MODULE_5_GENERAL_SELF_EFFICACY')).toBe('DIMENSION_SPECTRUM');
    expect(resolveVisualArchetype('MODULE_3_EMOTION_REGULATION')).toBe('TRAIT_BREAKDOWN');

    const rsesStrategy = resolveScoringStrategy('RSES_MEAN_V1', 'MODULE_2_SELF_IDENTITY');
    expect(rsesStrategy.code).toBe('RSES_MEAN_V1');
    expect(rsesStrategy.scaleMin).toBe(1.0);
    expect(rsesStrategy.scaleMax).toBe(4.0);
    expect(rsesStrategy.scoreType).toBe('MEAN');

    const gseStrategy = resolveScoringStrategy('GSE_MEAN_V1', 'MODULE_5_GENERAL_SELF_EFFICACY');
    expect(gseStrategy.code).toBe('GSE_MEAN_V1');
    expect(gseStrategy.scaleMin).toBe(1.0);
    expect(gseStrategy.scaleMax).toBe(4.0);
    expect(gseStrategy.scoreType).toBe('MEAN');

    const erqStrategy = resolveScoringStrategy('ERQ_MEAN_V1', 'MODULE_3_EMOTION_REGULATION');
    expect(erqStrategy.code).toBe('ERQ_MEAN_V1');
    expect(erqStrategy.scaleMin).toBe(1.0);
    expect(erqStrategy.scaleMax).toBe(7.0);
    expect(erqStrategy.scoreType).toBe('MEAN');
  });
});

