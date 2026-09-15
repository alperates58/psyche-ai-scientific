import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { assertTestDatabaseSafety } from '../../scripts/verify-test-db-safety';
import { prisma } from '@/lib/prisma';
import { getAdminDashboardMetrics } from '@/services/adminService';
import { hasPermission } from '@/lib/rbac';
import { requirePermission, requireRole, AuthUser } from '@/lib/auth';

const hasTestDb = Boolean(process.env.TEST_DATABASE_URL || process.env.DATABASE_URL);

describe('FAZ 2.7A: Admin Control Plane Real DB Integration & Permission Guardrails', () => {
  beforeAll(async () => {
    if (process.env.TEST_DATABASE_URL) {
      assertTestDatabaseSafety();
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('fetches 100% DB-derived metrics with real ontology and form counts', async () => {
    const metrics = await getAdminDashboardMetrics();

    // 1. Psychological Ontology Integrity
    expect(metrics.scientific.domainCount).toBe(9);
    expect(metrics.scientific.constructCount).toBe(30);
    expect(metrics.scientific.facetCount).toBe(84);
    expect(metrics.scientific.liveFormItemCount).toBe(17);
    expect(metrics.scientific.totalBankItemCount).toBeGreaterThanOrEqual(17);

    // 2. Form & Measurement Version Freeze
    expect(metrics.scientific.activeFormVersionCode).toBe('v1.0.0');
    expect(metrics.scientific.activeFormModuleTitle).toBe('Modül 1: Temel Kişilik Boyutları (HEXACO)');

    // 3. Scoring & Pre-calibration Invariants
    expect(metrics.scientific.scoringModelCode).toBe('PRE_CALIBRATION_MEAN_V1');
    expect(metrics.scientific.normStatusCode).toBe('UNAVAILABLE');

    // 4. Operational Health
    expect(metrics.operational.dbHealthy).toBe(true);
    expect(metrics.operational.dbLatencyMs).toBeGreaterThanOrEqual(0);

    // 5. Zero Secret Leakage Invariant
    const serialized = JSON.stringify(metrics);
    expect(serialized).not.toContain('AUTH_SECRET');
    expect(serialized).not.toContain('passwordHash');
    expect(serialized).not.toContain('DATABASE_URL');
    expect(serialized).not.toContain('sessionToken');
  });

  it('enforces RBAC permission boundaries for admin access', () => {
    // Standard User
    const standardUserRoles = ['USER'];
    expect(hasPermission(standardUserRoles, 'ADMIN_ACCESS')).toBe(false);

    // Researcher
    const researcherRoles = ['RESEARCHER'];
    expect(hasPermission(researcherRoles, 'ADMIN_ACCESS')).toBe(false);
    expect(hasPermission(researcherRoles, 'ITEM_MANAGE')).toBe(true);

    // Admin
    const adminRoles = ['ADMIN'];
    expect(hasPermission(adminRoles, 'ADMIN_ACCESS')).toBe(true);
    expect(hasPermission(adminRoles, 'USER_MANAGE')).toBe(true);
    expect(hasPermission(adminRoles, 'ROLE_MANAGE')).toBe(false);

    // Super Admin
    const superAdminRoles = ['SUPER_ADMIN'];
    expect(hasPermission(superAdminRoles, 'ADMIN_ACCESS')).toBe(true);
    expect(hasPermission(superAdminRoles, 'ROLE_MANAGE')).toBe(true);
    expect(hasPermission(superAdminRoles, 'SYSTEM_CONFIG')).toBe(true);
  });
});
