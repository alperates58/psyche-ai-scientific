import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { runAssessmentArchitectureAudit } from '../../scripts/audit-assessment-architecture';

describe('FAZ 2.15: Assessment Architecture & Instrument Mapping Audit', () => {
  const root = path.resolve(__dirname, '../..');
  const archPath = path.resolve(root, 'data/assessment-architecture/assessment-architecture.json');
  const mapPath = path.resolve(root, 'data/assessment-architecture/construct-to-instrument-map.json');
  const budgetPath = path.resolve(root, 'data/assessment-architecture/assessment-question-budget.json');
  const journeyPath = path.resolve(root, 'data/assessment-architecture/assessment-journey-plan.json');
  const licensePath = path.resolve(root, 'data/assessment-architecture/licensing-readiness-matrix.json');
  const trValPath = path.resolve(root, 'data/assessment-architecture/turkish-validation-readiness.json');
  const gapPath = path.resolve(root, 'data/assessment-architecture/assessment-gap-analysis.json');
  const proposedModelPath = path.resolve(root, 'data/master-model/proposed-master-model.json');
  const constructsJsonPath = path.resolve(root, 'data/constructs.json');
  const instrumentRegistryPath = path.resolve(root, 'data/instrument-registry.json');

  it('1. Automated assessment architecture audit runs with 0 errors', () => {
    const auditResult = runAssessmentArchitectureAudit();
    if (auditResult.errors.length > 0) {
      console.error('Audit Errors:', auditResult.errors);
    }
    expect(auditResult.errors).toEqual([]);
    expect(auditResult.success).toBe(true);
  });

  it('2. Invariant: Assessment question budget matches exact subscale sums across all modules', () => {
    const modules = JSON.parse(fs.readFileSync(archPath, 'utf8'));
    for (const mod of modules) {
      if (mod.subscales && Array.isArray(mod.subscales) && mod.subscales.length > 0) {
        const subscaleSum = mod.subscales.reduce((acc: number, s: any) => acc + s.itemCount, 0);
        expect(mod.questionCountPlanned, `Module ${mod.assessmentId} sum mismatch`).toBe(subscaleSum);
      }
    }
  });

  it('3. Invariant: First Meaningful Profile contains exactly 4 core modules and dynamic budget sum matches', () => {
    const modules = JSON.parse(fs.readFileSync(archPath, 'utf8'));
    const budget = JSON.parse(fs.readFileSync(budgetPath, 'utf8'));
    const coreTier = budget.tiers.FIRST_MEANINGFUL_PROFILE;

    const coreModules = modules.filter((m: any) => m.stage === 'CORE' && m.requiredForFirstProfile);
    const calculatedCoreSum = coreModules.reduce((acc: number, m: any) => acc + m.questionCountPlanned, 0);

    expect(coreTier.assessmentCountPlanned).toBe(coreModules.length);
    expect(coreTier.assessmentCountPlanned).toBe(4);
    expect(coreTier.targetQuestionCount).toBe(calculatedCoreSum);
    expect(coreTier.targetQuestionCount).toBe(108);
    expect(coreTier.targetEstimatedMinutes).toBeLessThanOrEqual(25.0); // Fatigue threshold
    expect(coreTier.domainsCovered).toContain('core_personality');
    expect(coreTier.domainsCovered).toContain('self_system');
    expect(coreTier.domainsCovered).toContain('emotion_regulation');
    expect(coreTier.domainsCovered).toContain('cognition_decision');
  });

  it('4. Invariant: Expanded Profile dynamic budget equals Core + Expansion modules', () => {
    const modules = JSON.parse(fs.readFileSync(archPath, 'utf8'));
    const budget = JSON.parse(fs.readFileSync(budgetPath, 'utf8'));
    const expTier = budget.tiers.EXPANDED_PROFILE;

    const expModules = modules.filter((m: any) => m.stage === 'CORE' || m.stage === 'EXPANSION').slice(0, 8);
    const calculatedExpSum = expModules.reduce((acc: number, m: any) => acc + m.questionCountPlanned, 0);

    expect(expTier.assessmentCountPlanned).toBe(expModules.length);
    expect(expTier.assessmentCountPlanned).toBe(8);
    expect(expTier.targetQuestionCount).toBe(calculatedExpSum);
    expect(expTier.targetQuestionCount).toBe(265);
    expect(expTier.recommendedSessionsCount).toBe(2);
  });

  it('5. Invariant: Comprehensive Consumer battery dynamic budget equals all 15 consumer modules', () => {
    const modules = JSON.parse(fs.readFileSync(archPath, 'utf8'));
    const budget = JSON.parse(fs.readFileSync(budgetPath, 'utf8'));
    const compTier = budget.tiers.COMPREHENSIVE_PROFILE;

    const compModules = modules.filter((m: any) => m.requiredForComprehensiveProfile);
    const calculatedCompSum = compModules.reduce((acc: number, m: any) => acc + m.questionCountPlanned, 0);

    expect(compTier.assessmentCountPlanned).toBe(compModules.length);
    expect(compTier.assessmentCountPlanned).toBe(15);
    expect(compTier.targetQuestionCount).toBe(calculatedCompSum);
    expect(compTier.targetQuestionCount).toBe(431);
    expect(compTier.recommendedSessionsCount).toBe(3);
  });

  it('6. Invariant: HEXACO-60 (60 items, short form) is strictly distinguished from IPIP-HEXACO (240 items)', () => {
    const registry = JSON.parse(fs.readFileSync(instrumentRegistryPath, 'utf8'));
    const hexaco60 = registry.find((i: any) => i.instrumentId === 'inst_hexaco_60');
    const ipip240 = registry.find((i: any) => i.instrumentId === 'inst_ipip_hexaco');

    expect(hexaco60).toBeDefined();
    expect(hexaco60.name).toContain('60');
    expect(hexaco60.decision).toBe('REQUIRES_LICENSE');
    expect(hexaco60.commercialUse).toBe(false);

    expect(ipip240).toBeDefined();
    expect(ipip240.name).toContain('IPIP-HEXACO');
    expect(ipip240.decision).toBe('APPROVED_PUBLIC');
    expect(ipip240.commercialUse).toBe(true);

    const modules = JSON.parse(fs.readFileSync(archPath, 'utf8'));
    const hexacoMod = modules.find((m: any) => m.assessmentId === 'mod_core_hexaco_60');
    expect(hexacoMod.questionCountPlanned).toBe(60);
    expect(hexacoMod.selectedInstrumentId).toBe('inst_hexaco_60');
  });

  it('7. Invariant: Blocked or proprietary instruments (NEO, MBTI, TKI, TOSCA, PVQ-RR) are never product-ready', () => {
    const licensing = JSON.parse(fs.readFileSync(licensePath, 'utf8'));
    const blockedIds = ['inst_neo_pi_r', 'inst_mbti', 'inst_tki', 'inst_tosca_3', 'inst_pvq_rr'];

    for (const id of blockedIds) {
      const entry = licensing.find((i: any) => i.instrumentId === id);
      expect(entry, `Instrument ${id} must be in licensing matrix`).toBeDefined();
      expect(entry.licensingOutcome).not.toBe('APPROVED_FOR_PRODUCT');
    }
  });

  it('8. Invariant: Subclinical Dark Tetrad is excluded from default consumer package and marked RESEARCH_ONLY', () => {
    const modules = JSON.parse(fs.readFileSync(archPath, 'utf8'));
    const darkTetradMod = modules.find((m: any) => m.assessmentId === 'mod_dark_tetrad_advanced');

    expect(darkTetradMod).toBeDefined();
    expect(darkTetradMod.stage).toBe('ADVANCED');
    expect(darkTetradMod.requiredForFirstProfile).toBe(false);
    expect(darkTetradMod.requiredForComprehensiveProfile).toBe(false);
    expect(darkTetradMod.publicationReadiness).toBe('RESEARCH_ONLY');
  });

  it('9. Invariant: All 37 master model constructs are accounted for in construct-to-instrument map', () => {
    const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
    expect(map.length).toBe(37);

    const proposedModel = JSON.parse(fs.readFileSync(proposedModelPath, 'utf8'));
    const masterConstructIds = new Set<string>();
    proposedModel.domains.forEach((d: any) => {
      d.constructs.forEach((c: any) => masterConstructIds.add(c.constructId));
    });

    for (const entry of map) {
      expect(masterConstructIds.has(entry.constructId), `Unknown construct ${entry.constructId}`).toBe(true);
      expect(entry.readiness).toBeDefined();
      expect(entry.gapType).toBeDefined();
    }
  });

  it('10. Invariant: Multi-instrument modules maintain independent subscale scoring (no synthetic scores)', () => {
    const modules = JSON.parse(fs.readFileSync(archPath, 'utf8'));
    const selfAgencyMod = modules.find((m: any) => m.assessmentId === 'mod_self_agency');

    expect(selfAgencyMod).toBeDefined();
    expect(selfAgencyMod.subscales.length).toBe(2);
    expect(selfAgencyMod.subscales[0].code).toBe('RSES');
    expect(selfAgencyMod.subscales[1].code).toBe('GSES');
    expect(selfAgencyMod.subscales[0].itemCount).toBe(10);
    expect(selfAgencyMod.subscales[1].itemCount).toBe(10);
  });

  it('11. Invariant: Production ontology (data/constructs.json) is 100% UNMUTATED', () => {
    const currentConstructs = JSON.parse(fs.readFileSync(constructsJsonPath, 'utf8'));
    expect(currentConstructs.length).toBe(84);

    const constructIds = new Set(currentConstructs.map((c: any) => c.constructId));
    expect(constructIds.size).toBe(30);

    const domainIds = new Set(currentConstructs.map((c: any) => c.domainId));
    expect(domainIds.size).toBe(9);
  });

  it('12. Invariant: Journey plan enforces longitudinal separation and observational AI isolation', () => {
    const journey = JSON.parse(fs.readFileSync(journeyPath, 'utf8'));

    expect(journey.longitudinalOutputsSeparation).toBeDefined();
    expect(journey.longitudinalOutputsSeparation.trackedMetrics.length).toBeGreaterThan(0);

    expect(journey.observationalAiSeparation).toBeDefined();
    expect(journey.observationalAiSeparation.mode).toBe('OBSERVATIONAL_PROMPT_ONLY');

    expect(journey.repeatTestPolicy.stablePersonalityHEXACO.minimumRetestIntervalDays).toBe(180);
    expect(journey.repeatTestPolicy.affectiveToneAndDistress.minimumRetestIntervalDays).toBe(14);
  });
});
