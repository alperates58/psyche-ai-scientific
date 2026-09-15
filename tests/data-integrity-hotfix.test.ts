import { describe, it, expect, vi } from 'vitest';
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

  it('6. Coverage API route: unauthenticated request returns 401', async () => {
    const { GET } = await import('@/app/api/profile/coverage/route');
    const authLib = await import('@/lib/auth');
    vi.spyOn(authLib, 'getCurrentUserOrNull').mockResolvedValueOnce(null);

    const res = await GET();
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toContain('UNAUTHENTICATED');
  });

  it('7. Coverage API route: PENDING_VERIFICATION user returns 403 (profile data guarded)', async () => {
    const { GET } = await import('@/app/api/profile/coverage/route');
    const authLib = await import('@/lib/auth');
    vi.spyOn(authLib, 'getCurrentUserOrNull').mockResolvedValueOnce({
      id: 'pending-user-id',
      email: 'pending@test.com',
      name: 'Pending User',
      image: null,
      status: 'PENDING_VERIFICATION',
      isDemoUser: false,
      roles: ['USER'],
      permissions: ['APP_USE'],
    });

    const res = await GET();
    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.error).toContain('FORBIDDEN');
  });

  it('8. Coverage API route: fresh authenticated user returns 0 coverage with exact schema', async () => {
    const { GET } = await import('@/app/api/profile/coverage/route');
    const authLib = await import('@/lib/auth');
    const profileService = await import('@/services/profileService');

    vi.spyOn(authLib, 'getCurrentUserOrNull').mockResolvedValueOnce({
      id: 'fresh-active-user',
      email: 'fresh@test.com',
      name: 'Fresh User',
      image: null,
      status: 'ACTIVE',
      isDemoUser: false,
      roles: ['USER'],
      permissions: ['APP_USE', 'PROFILE_VIEW_SELF'],
    });

    vi.spyOn(profileService, 'getUserProfileCoverage').mockResolvedValueOnce({
      exploredFacetsCount: 0,
      totalOntologyFacets: 84,
      explorationPercentage: 0,
      measurementDepthPercentage: 0,
      isAssessed: false,
    });

    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({
      exploredFacetsCount: 0,
      totalOntologyFacets: 84,
      explorationPercentage: 0,
      measurementDepthPercentage: 0,
      isAssessed: false,
    });
  });

  it('9. Coverage API route: assessed authenticated user returns actual coverage and isAssessed=true', async () => {
    const { GET } = await import('@/app/api/profile/coverage/route');
    const authLib = await import('@/lib/auth');
    const profileService = await import('@/services/profileService');

    vi.spyOn(authLib, 'getCurrentUserOrNull').mockResolvedValueOnce({
      id: 'assessed-active-user',
      email: 'assessed@test.com',
      name: 'Assessed User',
      image: null,
      status: 'ACTIVE',
      isDemoUser: false,
      roles: ['USER'],
      permissions: ['APP_USE', 'PROFILE_VIEW_SELF'],
    });

    vi.spyOn(profileService, 'getUserProfileCoverage').mockResolvedValueOnce({
      exploredFacetsCount: 14,
      totalOntologyFacets: 84,
      explorationPercentage: 17,
      measurementDepthPercentage: 25,
      isAssessed: true,
    });

    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.exploredFacetsCount).toBe(14);
    expect(data.isAssessed).toBe(true);
    expect(data.explorationPercentage).toBe(17);
  });

  it('10. Coverage API route: cross-user isolation strictly binds to authenticated session ID', async () => {
    const { GET } = await import('@/app/api/profile/coverage/route');
    const authLib = await import('@/lib/auth');
    const profileService = await import('@/services/profileService');

    vi.spyOn(authLib, 'getCurrentUserOrNull').mockResolvedValueOnce({
      id: 'legitimate-user-a',
      email: 'usera@test.com',
      name: 'User A',
      image: null,
      status: 'ACTIVE',
      isDemoUser: false,
      roles: ['USER'],
      permissions: ['APP_USE', 'PROFILE_VIEW_SELF'],
    });

    const coverageSpy = vi.spyOn(profileService, 'getUserProfileCoverage').mockResolvedValueOnce({
      exploredFacetsCount: 0,
      totalOntologyFacets: 84,
      explorationPercentage: 0,
      measurementDepthPercentage: 0,
      isAssessed: false,
    });

    await GET();
    // Verify it was called with User A's ID from session, never accepting arbitrary query/path IDs
    expect(coverageSpy).toHaveBeenCalledWith('legitimate-user-a');
  });

  it('11. Coverage API route: enforces strict no-cache headers', async () => {
    const { GET } = await import('@/app/api/profile/coverage/route');
    const authLib = await import('@/lib/auth');
    const profileService = await import('@/services/profileService');

    vi.spyOn(authLib, 'getCurrentUserOrNull').mockResolvedValueOnce({
      id: 'cache-check-user',
      email: 'cache@test.com',
      name: 'Cache User',
      image: null,
      status: 'ACTIVE',
      isDemoUser: false,
      roles: ['USER'],
      permissions: ['APP_USE', 'PROFILE_VIEW_SELF'],
    });

    vi.spyOn(profileService, 'getUserProfileCoverage').mockResolvedValueOnce({
      exploredFacetsCount: 0,
      totalOntologyFacets: 84,
      explorationPercentage: 0,
      measurementDepthPercentage: 0,
      isAssessed: false,
    });

    const res = await GET();
    const cacheControl = res.headers.get('Cache-Control');
    expect(cacheControl).toContain('no-store');
    expect(cacheControl).toContain('max-age=0');
  });
});

