import { describe, it, expect } from 'vitest';
import { importAssessmentLibrary } from '../../src/services/assessmentLibraryImporter';
import { resolveVisualArchetype } from '../../src/lib/assessmentInterpretationConfig';
import { resolveScoringStrategy } from '../../src/lib/scoringStrategies';
import { getModuleJourneyMetadata } from '../../src/lib/assessmentJourneyConfig';

describe('FAZ 2.10 Integration: Assessment Library Importer & Safety Engine', () => {
  it('executes dry-run import simulation idempotently without errors', async () => {
    const dryRunResult = await importAssessmentLibrary({ dryRun: true });

    expect(dryRunResult.success).toBe(true);
    expect(dryRunResult.dryRun).toBe(true);
    expect(dryRunResult.errors).toHaveLength(0);

    expect(dryRunResult.domainsCreatedOrUpdated).toBeGreaterThanOrEqual(2);
    expect(dryRunResult.constructsCreatedOrUpdated).toBeGreaterThanOrEqual(3);
    expect(dryRunResult.facetsCreatedOrUpdated).toBeGreaterThanOrEqual(3);
    expect(dryRunResult.sourcesCreatedOrUpdated).toBeGreaterThanOrEqual(4);
    expect(dryRunResult.instrumentsCreatedOrUpdated).toBeGreaterThanOrEqual(3);
    expect(dryRunResult.scoringModelsCreatedOrUpdated).toBeGreaterThanOrEqual(3);
    expect(dryRunResult.modulesCreatedOrUpdated).toBeGreaterThanOrEqual(2);
    expect(dryRunResult.itemsCreatedOrUpdated).toBe(10);
  });

  it('correctly maps imported modules into the onboarding journey hierarchy', () => {
    const rsesJourney = getModuleJourneyMetadata('MODULE_2_SELF_IDENTITY');
    expect(rsesJourney.classification).toBe('REQUIRED');
    expect(rsesJourney.priority).toBe(2);
    expect(rsesJourney.domainNameTr).toBe('Benlik & Kimlik');

    const dersJourney = getModuleJourneyMetadata('MODULE_3_EMOTION_REGULATION');
    expect(dersJourney.classification).toBe('RECOMMENDED');
    expect(dersJourney.priority).toBe(3);
    expect(dersJourney.domainNameTr).toBe('Duygusal Süreçler');
  });

  it('binds appropriate visual archetype and scoring strategy to expanded modules', () => {
    expect(resolveVisualArchetype('MODULE_2_SELF_IDENTITY')).toBe('DIMENSION_SPECTRUM');
    expect(resolveVisualArchetype('MODULE_3_EMOTION_REGULATION')).toBe('TRAIT_BREAKDOWN');

    const rsesStrategy = resolveScoringStrategy('RSES_SUM_V1', 'MODULE_2_SELF_IDENTITY');
    expect(rsesStrategy.code).toBe('RSES_SUM_V1');
    expect(rsesStrategy.scaleMin).toBe(1.0);
    expect(rsesStrategy.scaleMax).toBe(4.0);
  });
});
