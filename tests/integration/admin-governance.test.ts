import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/prisma';
import {
  getUserDirectory,
  getUserDetail,
  getAuditLogs,
  getSystemHealthReport,
} from '@/services/adminUserService';
import {
  suspendUserAction,
  reactivateUserAction,
  disableUserAction,
  revokeUserSessionsAction,
} from '@/actions/adminUserActions';
import {
  grantUserRoleAction,
  revokeUserRoleAction,
} from '@/actions/adminRoleActions';
import { hashPassword } from '@/lib/password';

const testDbUrl =
  process.env.TEST_DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5434/psyche_ai_test?schema=public';

const isConfigured = Boolean(process.env.TEST_DATABASE_URL);

describe('FAZ 2.7B: Admin Governance & Security Real DB Integration Tests', () => {
  if (!isConfigured) {
    it.skip('Skipped: TEST_DATABASE_URL is not configured', () => {});
    return;
  }

  const timestamp = Date.now();
  let superAdmin1Id: string;
  let superAdmin2Id: string;
  let standardAdminId: string;
  let testUserVerifiedId: string;
  let testUserUnverifiedId: string;

  beforeAll(async () => {
    // 1. SAFETY GATE CHECK
    const dbUrl = process.env.DATABASE_URL || '';
    console.log('--- DATABASE SAFETY GATE CHECK ---');
    console.log(`DATABASE_URL: ${dbUrl}`);
    console.log(`TEST_DATABASE_URL: ${testDbUrl}`);

    if (
      !testDbUrl.includes('localhost:5434') &&
      !testDbUrl.includes('127.0.0.1:5434') &&
      !testDbUrl.includes('psyche_ai_test')
    ) {
      throw new Error(
        `SAFETY_GATE_VIOLATION: Refusing to run tests against non-test database: ${testDbUrl}`
      );
    }
    console.log('SAFETY_GATE: PASS (Test database is isolated, local, and psyche_ai_test)');

    // 2. Create Seed Users for Integration
    const passwordHash = await hashPassword('AdminPass123!');

    // Super Admin 1
    const sa1 = await prisma.user.create({
      data: {
        email: `sa1_${timestamp}@psycheai.test`,
        emailNormalized: `sa1_${timestamp}@psycheai.test`.toLowerCase(),
        name: 'Süper Yönetici 1',
        status: 'ACTIVE',
        emailVerified: new Date(),
        credential: { create: { passwordHash } },
        roles: { create: { role: 'SUPER_ADMIN' } },
      },
    });
    superAdmin1Id = sa1.id;

    // Super Admin 2
    const sa2 = await prisma.user.create({
      data: {
        email: `sa2_${timestamp}@psycheai.test`,
        emailNormalized: `sa2_${timestamp}@psycheai.test`.toLowerCase(),
        name: 'Süper Yönetici 2',
        status: 'ACTIVE',
        emailVerified: new Date(),
        credential: { create: { passwordHash } },
        roles: { create: { role: 'SUPER_ADMIN' } },
      },
    });
    superAdmin2Id = sa2.id;

    // Standard Admin (ADMIN role only, no ROLE_MANAGE)
    const adm = await prisma.user.create({
      data: {
        email: `admin_${timestamp}@psycheai.test`,
        emailNormalized: `admin_${timestamp}@psycheai.test`.toLowerCase(),
        name: 'Standart Admin',
        status: 'ACTIVE',
        emailVerified: new Date(),
        credential: { create: { passwordHash } },
        roles: { create: { role: 'ADMIN' } },
      },
    });
    standardAdminId = adm.id;

    // Verified Normal User
    const uVer = await prisma.user.create({
      data: {
        email: `user_ver_${timestamp}@psycheai.test`,
        emailNormalized: `user_ver_${timestamp}@psycheai.test`.toLowerCase(),
        name: 'Doğrulanmış Kullanıcı',
        status: 'ACTIVE',
        emailVerified: new Date(),
        credential: { create: { passwordHash } },
        roles: { create: { role: 'USER' } },
        authSessions: {
          create: {
            sessionToken: `sess_token_ver_${timestamp}`,
            expires: new Date(Date.now() + 86400000),
          },
        },
      },
    });
    testUserVerifiedId = uVer.id;

    // Unverified Normal User
    const uUnver = await prisma.user.create({
      data: {
        email: `user_unver_${timestamp}@psycheai.test`,
        emailNormalized: `user_unver_${timestamp}@psycheai.test`.toLowerCase(),
        name: 'Doğrulanmamış Kullanıcı',
        status: 'PENDING_VERIFICATION',
        emailVerified: null,
        credential: { create: { passwordHash } },
        roles: { create: { role: 'USER' } },
        authSessions: {
          create: {
            sessionToken: `sess_token_unver_${timestamp}`,
            expires: new Date(Date.now() + 86400000),
          },
        },
      },
    });
    testUserUnverifiedId = uUnver.id;
  });

  afterAll(async () => {
    const ids = [
      superAdmin1Id,
      superAdmin2Id,
      standardAdminId,
      testUserVerifiedId,
      testUserUnverifiedId,
    ].filter(Boolean);

    if (ids.length > 0) {
      await prisma.user.deleteMany({
        where: { id: { in: ids } },
      }).catch(() => {});
    }
    await prisma.$disconnect();
  });

  describe('1. User Directory Query & Filters', () => {
    it('paginates and retrieves users matching search query', async () => {
      const result = await getUserDirectory({
        search: `user_ver_${timestamp}`,
        page: 1,
        pageSize: 10,
      });

      expect(result.users.length).toBe(1);
      expect(result.users[0].id).toBe(testUserVerifiedId);
      expect(result.users[0].status).toBe('ACTIVE');
      expect(result.users[0].emailMasked).toBeTruthy();
    });

    it('filters users by status', async () => {
      const result = await getUserDirectory({
        status: 'PENDING_VERIFICATION',
        search: `${timestamp}`,
      });

      expect(result.users.length).toBeGreaterThanOrEqual(1);
      expect(result.users.some((u) => u.id === testUserUnverifiedId)).toBe(true);
    });

    it('filters users by role', async () => {
      const result = await getUserDirectory({
        role: 'SUPER_ADMIN',
        search: `${timestamp}`,
      });

      expect(result.users.length).toBeGreaterThanOrEqual(2);
      expect(result.users.every((u) => u.roles.includes('SUPER_ADMIN'))).toBe(true);
    });
  });

  describe('2. User Detail & DTO Sanitization', () => {
    it('retrieves user detail without leaking sessionToken', async () => {
      const detail = await getUserDetail(testUserVerifiedId);
      expect(detail).toBeDefined();
      expect(detail?.id).toBe(testUserVerifiedId);
      expect(detail?.auth.hasCredentials).toBe(true);
      expect(detail?.sessions.length).toBeGreaterThanOrEqual(1);

      // CRITICAL ASSERTION: sessionToken must NEVER exist on serialized session DTOs
      for (const sess of detail!.sessions) {
        expect((sess as any).sessionToken).toBeUndefined();
        expect(sess.id).toBeTruthy();
        expect(sess.expires).toBeDefined();
      }
    });
  });

  describe('3. Lifecycle Actions with Email Verification Preservation', () => {
    it('suspends verified user and immediately revokes active sessions', async () => {
      process.env.TEST_AUTH_USER_ID = superAdmin1Id;

      const res = await suspendUserAction({
        userId: testUserVerifiedId,
        reason: 'Güvenlik incelemesi',
      });

      expect(res.success).toBe(true);

      const user = await prisma.user.findUnique({
        where: { id: testUserVerifiedId },
        include: { authSessions: true, auditEvents: true },
      });

      expect(user?.status).toBe('SUSPENDED');
      expect(user?.authSessions.every((s) => s.revokedAt !== null)).toBe(true);
      expect(user?.auditEvents.some((a) => a.eventType === 'USER_SUSPENDED')).toBe(true);
    });

    it('reactivates verified suspended user to ACTIVE', async () => {
      process.env.TEST_AUTH_USER_ID = superAdmin1Id;

      const res = await reactivateUserAction({
        userId: testUserVerifiedId,
      });

      expect(res.success).toBe(true);
      expect(res.data?.status).toBe('ACTIVE');

      const user = await prisma.user.findUnique({ where: { id: testUserVerifiedId } });
      expect(user?.status).toBe('ACTIVE');
    });

    it('suspends and reactivates unverified user preserving PENDING_VERIFICATION (no bypass)', async () => {
      process.env.TEST_AUTH_USER_ID = superAdmin1Id;

      // 1. Suspend unverified user
      const suspRes = await suspendUserAction({
        userId: testUserUnverifiedId,
        reason: 'Şüpheli kayıt',
      });
      expect(suspRes.success).toBe(true);

      let user = await prisma.user.findUnique({ where: { id: testUserUnverifiedId } });
      expect(user?.status).toBe('SUSPENDED');

      // 2. Reactivate unverified user
      const reactRes = await reactivateUserAction({
        userId: testUserUnverifiedId,
      });
      expect(reactRes.success).toBe(true);
      expect(reactRes.data?.status).toBe('PENDING_VERIFICATION');

      user = await prisma.user.findUnique({ where: { id: testUserUnverifiedId } });
      // MUST BE PENDING_VERIFICATION, NOT ACTIVE
      expect(user?.status).toBe('PENDING_VERIFICATION');
    });

    it('disables user permanently and revokes sessions', async () => {
      process.env.TEST_AUTH_USER_ID = superAdmin1Id;

      const res = await disableUserAction({
        userId: testUserVerifiedId,
        reason: 'Kural ihlali',
        confirmationText: 'DEVRE DIŞI BIRAK',
      });

      expect(res.success).toBe(true);

      const user = await prisma.user.findUnique({ where: { id: testUserVerifiedId } });
      expect(user?.status).toBe('DISABLED');

      // Attempting reactivate on DISABLED user must be rejected
      const reactAttempt = await reactivateUserAction({ userId: testUserVerifiedId });
      expect(reactAttempt.success).toBe(false);
      expect(reactAttempt.error).toContain('INVALID_TRANSITION');
    });
  });

  describe('4. Role Governance & Permission Boundaries', () => {
    it('SUPER_ADMIN can grant and revoke roles', async () => {
      process.env.TEST_AUTH_USER_ID = superAdmin1Id;

      // Grant RESEARCHER to unverified user
      const grantRes = await grantUserRoleAction({
        userId: testUserUnverifiedId,
        role: 'RESEARCHER',
      });
      expect(grantRes.success).toBe(true);

      let user = await prisma.user.findUnique({
        where: { id: testUserUnverifiedId },
        include: { roles: true },
      });
      expect(user?.roles.some((r) => r.role === 'RESEARCHER')).toBe(true);

      // Revoke RESEARCHER from unverified user
      const revokeRes = await revokeUserRoleAction({
        userId: testUserUnverifiedId,
        role: 'RESEARCHER',
      });
      expect(revokeRes.success).toBe(true);

      user = await prisma.user.findUnique({
        where: { id: testUserUnverifiedId },
        include: { roles: true },
      });
      expect(user?.roles.some((r) => r.role === 'RESEARCHER')).toBe(false);
    });

    it('Standard ADMIN without ROLE_MANAGE is denied role management', async () => {
      process.env.TEST_AUTH_USER_ID = standardAdminId;

      const grantRes = await grantUserRoleAction({
        userId: testUserUnverifiedId,
        role: 'RESEARCHER',
      });

      expect(grantRes.success).toBe(false);
      expect(grantRes.error).toContain('ROLE_MANAGE');
    });

    it('rejects granting role to a DISABLED user', async () => {
      process.env.TEST_AUTH_USER_ID = superAdmin1Id;

      const res = await grantUserRoleAction({
        userId: testUserVerifiedId, // DISABLED
        role: 'EXPERT_REVIEWER',
      });

      expect(res.success).toBe(false);
      expect(res.error).toContain('INVALID_TARGET_STATE');
    });
  });

  describe('5. PostgreSQL Advisory Lock Concurrency & Last Super Admin Invariant', () => {
    it('prevents concurrent demotion of the last two SUPER_ADMINs down to zero', async () => {
      process.env.TEST_AUTH_USER_ID = superAdmin1Id;

      // Launch competing operations concurrently:
      // Op 1: Revoke SUPER_ADMIN from SA1
      // Op 2: Revoke SUPER_ADMIN from SA2
      const [op1, op2] = await Promise.allSettled([
        revokeUserRoleAction({
          userId: superAdmin1Id,
          role: 'SUPER_ADMIN',
          confirmSelfDemotion: true,
        }),
        revokeUserRoleAction({
          userId: superAdmin2Id,
          role: 'SUPER_ADMIN',
          confirmSelfDemotion: false,
        }),
      ]);

      // At least one operation must have succeeded or failed, but active super admins in DB MUST be >= 1
      const activeSuperAdminCount = await prisma.user.count({
        where: {
          status: 'ACTIVE',
          roles: { some: { role: 'SUPER_ADMIN' } },
        },
      });

      // Revoke down until exactly 1 active SUPER_ADMIN remains
      let allActiveSuperAdmins = await prisma.user.findMany({
        where: {
          status: 'ACTIVE',
          roles: { some: { role: 'SUPER_ADMIN' } },
        },
      });

      while (allActiveSuperAdmins.length > 1) {
        const toRevoke = allActiveSuperAdmins[0];
        const actor = allActiveSuperAdmins[1];
        process.env.TEST_AUTH_USER_ID = actor.id;

        await revokeUserRoleAction({
          userId: toRevoke.id,
          role: 'SUPER_ADMIN',
          confirmSelfDemotion: false,
        });

        allActiveSuperAdmins = await prisma.user.findMany({
          where: {
            status: 'ACTIVE',
            roles: { some: { role: 'SUPER_ADMIN' } },
          },
        });
      }

      expect(allActiveSuperAdmins.length).toBe(1);
      const lastSuperAdmin = allActiveSuperAdmins[0];
      process.env.TEST_AUTH_USER_ID = lastSuperAdmin.id;

      // 1. Attempting to revoke SUPER_ADMIN from the LAST super admin MUST FAIL
      const finalRevokeAttempt = await revokeUserRoleAction({
        userId: lastSuperAdmin.id,
        role: 'SUPER_ADMIN',
        confirmSelfDemotion: true,
      });

      expect(finalRevokeAttempt.success).toBe(false);
      expect(finalRevokeAttempt.error).toContain('LAST_SUPER_ADMIN_PROTECTION');

      // 2. Attempting to suspend the LAST super admin MUST FAIL
      const finalSuspendAttempt = await suspendUserAction({
        userId: lastSuperAdmin.id,
        reason: 'Askıya alma testi',
      });

      expect(finalSuspendAttempt.success).toBe(false);
      expect(finalSuspendAttempt.error).toContain('LAST_SUPER_ADMIN_PROTECTION');

      // 3. Attempting to disable the LAST super admin MUST FAIL
      const finalDisableAttempt = await disableUserAction({
        userId: lastSuperAdmin.id,
        reason: 'Devre dışı bırakma testi',
        confirmationText: 'DEVRE DIŞI BIRAK',
      });

      expect(finalDisableAttempt.success).toBe(false);
      expect(finalDisableAttempt.error).toContain('LAST_SUPER_ADMIN_PROTECTION');
    });
  });

  describe('6. System Health Secret Scan & Session Registry Semantics', () => {
    it('returns system health report without leaking infrastructure hosts, db names, or secrets', async () => {
      const report = await getSystemHealthReport();

      expect(report.database.status).toBe('HEALTHY');
      expect(report.database.engine).toBe('PostgreSQL');
      expect(report.database.latencyMs).toBeGreaterThanOrEqual(0);

      // Verify ZERO infrastructure leaks
      expect((report.database as any).connectedHost).toBeUndefined();
      expect((report.database as any).databaseName).toBeUndefined();
      expect((report.database as any).url).toBeUndefined();

      // Verify Google OAuth secret is NOT exposed
      expect((report.googleOAuth as any).secret).toBeUndefined();
      expect((report.googleOAuth as any).clientSecret).toBeUndefined();

      // Verify Email secret is NOT exposed
      expect((report.emailService as any).password).toBeUndefined();

      // Verify Session Registry Operational is true even if sessions are 0
      expect(report.authService.sessionRegistryOperational).toBe(true);
      expect(typeof report.authService.activeSessionCount).toBe('number');
    });
  });
});
