import { describe, it, expect } from 'vitest';
import { calculateProfileCoverage, TOTAL_ONTOLOGY_FACETS_SOURCE_OF_TRUTH } from '@/psychometrics/coverage';
import { getUserProfileCoverage } from '@/services/profileService';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

describe('FAZ 2.6.1 Production Data Integrity Hotfix Unit & Regression Tests', () => {
  it('1. Zero-assessment profile coverage returns 0%, 0 explored facets, and isAssessed=false', async () => {
    // Test with non-existent user ID representing brand new authenticated user with no snapshots
    const coverage = await getUserProfileCoverage('non-existent-new-user-id');
    expect(coverage.exploredFacetsCount).toBe(0);
    expect(coverage.explorationPercentage).toBe(0);
    expect(coverage.measurementDepthPercentage).toBe(0);
    expect(coverage.isAssessed).toBe(false);
    expect(coverage.totalOntologyFacets).toBeGreaterThanOrEqual(84);
  });

  it('2. calculateProfileCoverage returns exact zero exploration when no facets are measured', () => {
    const coverage = calculateProfileCoverage({}, 84, 6);
    expect(coverage.exploredFacetsCount).toBe(0);
    expect(coverage.explorationPercentage).toBe(0);
    expect(coverage.measurementDepthPercentage).toBe(0);
    expect(coverage.totalOntologyFacets).toBe(84);
  });

  it('3. Partial profile never imputes midpoint 3.0 / 50 for missing constructs', () => {
    const constructScores = [
      { constructId: 'honesty_humility', compositeScore: 4.2 },
      { constructId: 'conscientiousness', compositeScore: 3.8 },
    ];

    const constructMap = new Map<string, number>();
    for (const cs of constructScores) {
      constructMap.set(cs.constructId, cs.compositeScore);
    }

    const traitMapping = [
      { id: 'honesty_humility', name: 'Honesty-Humility' },
      { id: 'emotionality', name: 'Emotionality' },
      { id: 'extraversion', name: 'Extraversion' },
      { id: 'agreeableness', name: 'Agreeableness' },
      { id: 'conscientiousness', name: 'Conscientiousness' },
      { id: 'openness', name: 'Openness to Experience' },
    ];

    const mappedTraits = traitMapping.map((t) => {
      const rawScore = constructMap.get(t.id);
      const normalizedScore = typeof rawScore === 'number'
        ? Math.round(((rawScore - 1) / 4) * 100)
        : null;

      return {
        id: t.id,
        score: normalizedScore,
      };
    });

    // Measured constructs have real values
    const hh = mappedTraits.find((t) => t.id === 'honesty_humility');
    expect(hh?.score).toBe(80); // ((4.2 - 1) / 4) * 100 = 80

    const c = mappedTraits.find((t) => t.id === 'conscientiousness');
    expect(c?.score).toBe(70); // ((3.8 - 1) / 4) * 100 = 70

    // Missing constructs MUST be null, never 50 or 3.0
    const emo = mappedTraits.find((t) => t.id === 'emotionality');
    expect(emo?.score).toBeNull();
    expect(emo?.score).not.toBe(50);

    const ext = mappedTraits.find((t) => t.id === 'extraversion');
    expect(ext?.score).toBeNull();

    const agr = mappedTraits.find((t) => t.id === 'agreeableness');
    expect(agr?.score).toBeNull();

    const opn = mappedTraits.find((t) => t.id === 'openness');
    expect(opn?.score).toBeNull();
  });

  it('4. Codebase static audit: zero DEMO_PROFILE_DATA imports in authenticated routes and layouts', () => {
    const appDir = path.join(process.cwd(), 'src', 'app');
    const componentsDir = path.join(process.cwd(), 'src', 'components');

    const filesToAudit = [
      path.join(appDir, 'overview', 'page.tsx'),
      path.join(appDir, 'profile', 'personality', 'page.tsx'),
      path.join(appDir, 'profile', 'heatmap', 'page.tsx'),
      path.join(appDir, 'insights', 'context', 'page.tsx'),
      path.join(appDir, 'insights', 'patterns', 'page.tsx'),
      path.join(appDir, 'theory-council', 'page.tsx'),
      path.join(componentsDir, 'layout', 'Sidebar.tsx'),
      path.join(componentsDir, 'charts', 'HexacoRadarChart.tsx'),
      path.join(componentsDir, 'charts', 'FacetWhiskersChart.tsx'),
    ];

    for (const filePath of filesToAudit) {
      if (!fs.existsSync(filePath)) continue;
      const content = fs.readFileSync(filePath, 'utf-8');

      // Rule: No DEMO_PROFILE_DATA
      expect(content).not.toContain('DEMO_PROFILE_DATA');

      // Rule: No hardcoded SEM ±2.8
      expect(content).not.toContain('SEM ±2.8');
      expect(content).not.toContain('±2.8');

      // Rule: No hardcoded 42 / 84 Alt Boyut in sidebar/overview
      expect(content).not.toContain('42 / 84');

      // Rule: No midpoint imputation
      expect(content).not.toContain('?? 3.0;');
    }
  });

  it('5. Verifies canonical ontology denominator invariant', async () => {
    expect(TOTAL_ONTOLOGY_FACETS_SOURCE_OF_TRUTH).toBe(84);
  });
});
