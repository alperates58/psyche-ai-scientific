import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { runMasterModelAudit } from '../../scripts/audit-master-model';

describe('FAZ 2.14: Master Psychological Model Invariants & Epistemic Audit', () => {
  const root = path.resolve(__dirname, '../..');
  const protocolPath = path.resolve(root, 'data/master-model/literature-screening-protocol.json');
  const sourcesPath = path.resolve(root, 'data/master-model/master-model-sources.json');
  const baselinePath = path.resolve(root, 'data/master-model/current-ontology-baseline.json');
  const candidatesPath = path.resolve(root, 'data/master-model/candidate-constructs.json');
  const overlapPath = path.resolve(root, 'data/master-model/overlap-analysis.json');
  const lensesPath = path.resolve(root, 'data/master-model/theoretical-lens-map.json');
  const crosswalkPath = path.resolve(root, 'data/master-model/current-to-master-crosswalk.json');
  const proposedPath = path.resolve(root, 'data/master-model/proposed-master-model.json');
  const constructsJsonPath = path.resolve(root, 'data/constructs.json');

  it('1. Automated audit script runs cleanly with 0 errors', () => {
    const auditResult = runMasterModelAudit();
    if (auditResult.errors.length > 0) {
      console.error('Audit Errors:', auditResult.errors);
    }
    expect(auditResult.errors).toEqual([]);
    expect(auditResult.success).toBe(true);
  });

  it('2. Candidate constructs pool contains 100-150+ constructs with unique IDs', () => {
    const candidates = JSON.parse(fs.readFileSync(candidatesPath, 'utf8'));
    expect(Array.isArray(candidates)).toBe(true);
    expect(candidates.length).toBeGreaterThanOrEqual(100);
    expect(candidates.length).toBeLessThanOrEqual(200);

    const ids = candidates.map((c: any) => c.candidateId);
    const idSet = new Set(ids);
    expect(ids.length).toBe(idSet.size);
  });

  it('3. Invariant: Production constructs.json is strictly NOT mutated (84 facets, 30 constructs, 9 domains)', () => {
    const currentConstructs = JSON.parse(fs.readFileSync(constructsJsonPath, 'utf8'));
    expect(currentConstructs.length).toBe(84);

    const constructIds = new Set(currentConstructs.map((c: any) => c.constructId));
    expect(constructIds.size).toBe(30);

    const domainIds = new Set(currentConstructs.map((c: any) => c.domainId));
    expect(domainIds.size).toBe(9);
  });

  it('4. Invariant: All sources referenced across candidate pool exist in master-model-sources.json', () => {
    const sources = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));
    const sourceIdSet = new Set(sources.map((s: any) => s.sourceId));

    const candidates = JSON.parse(fs.readFileSync(candidatesPath, 'utf8'));
    for (const c of candidates) {
      if (c.keySources && Array.isArray(c.keySources)) {
        for (const sId of c.keySources) {
          expect(sourceIdSet.has(sId), `Unknown keySource ${sId} in candidate ${c.candidateId}`).toBe(true);
        }
      }
    }
  });

  it('5. Invariant: High-risk clinical screeners are strictly excluded from production scoring', () => {
    const candidates = JSON.parse(fs.readFileSync(candidatesPath, 'utf8'));
    const highRiskCandidates = candidates.filter(
      (c: any) => c.clinicalSafetyClass === 'HIGH_RISK_EXCLUDE_FROM_PRODUCTION_SCORING'
    );

    expect(highRiskCandidates.length).toBeGreaterThan(0);
    for (const c of highRiskCandidates) {
      expect(c.finalConsolidationDecision).toBe('EXCLUDED_CLINICAL_SAFETY');
      expect(c.measurementMode).toBe('CLINICAL_SCREENER_ONLY');
    }
  });

  it('6. Invariant: Theoretical lenses have isSyntheticTraitScore === false and modern->lens directionality', () => {
    const lenses = JSON.parse(fs.readFileSync(lensesPath, 'utf8'));
    expect(lenses.length).toBe(8);

    for (const lens of lenses) {
      expect(lens.isSyntheticTraitScore).toBe(false);
      expect(lens.directionality).toBe('MODERN_TO_HISTORICAL_INTERPRETIVE');
      expect(lens.prohibitedClaims.length).toBeGreaterThan(0);
    }
  });

  it('7. Invariant: Crosswalk accounts for 100% of baseline constructs (30) and facets (84)', () => {
    const crosswalk = JSON.parse(fs.readFileSync(crosswalkPath, 'utf8'));
    expect(crosswalk.length).toBe(114);

    const mappedConstructs = crosswalk.filter((e: any) => e.currentEntityType === 'CONSTRUCT');
    const mappedFacets = crosswalk.filter((e: any) => e.currentEntityType === 'FACET');

    expect(mappedConstructs.length).toBe(30);
    expect(mappedFacets.length).toBe(84);
  });

  it('8. Invariant: No fake numeric overlap percentages in candidate decision rationales', () => {
    const candidates = JSON.parse(fs.readFileSync(candidatesPath, 'utf8'));
    const fakeOverlapPattern = /\b\d{1,3}%\s*overlap/i;

    for (const c of candidates) {
      expect(fakeOverlapPattern.test(c.decisionRationale || '')).toBe(false);
    }
  });

  it('9. Invariant: Directional overlap analysis contains structured conceptual and empirical justifications', () => {
    const overlaps = JSON.parse(fs.readFileSync(overlapPath, 'utf8'));
    expect(overlaps.length).toBeGreaterThanOrEqual(10);

    for (const pair of overlaps) {
      expect(pair.pairId).toBeDefined();
      expect(pair.constructA).toBeDefined();
      expect(pair.constructB).toBeDefined();
      expect(pair.relationDirection).toBeDefined();
      expect(pair.resolutionDecision).toBeDefined();
      expect(pair.substantiveRationale.length).toBeGreaterThan(15);
    }
  });

  it('10. Invariant: Literature screening protocol contains comprehensive search and inclusion policies', () => {
    const protocol = JSON.parse(fs.readFileSync(protocolPath, 'utf8'));
    expect(protocol.protocolVersion).toBeDefined();
    expect(protocol.screeningDate).toBeDefined();
    expect(protocol.keywordFamilies.length).toBeGreaterThanOrEqual(15);
    expect(protocol.databasesSearched.length).toBeGreaterThanOrEqual(5);
    expect(protocol.inclusionCriteria.length).toBeGreaterThan(0);
    expect(protocol.exclusionCriteria.length).toBeGreaterThan(0);
  });
});
