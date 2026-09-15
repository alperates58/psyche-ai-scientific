import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/prisma';
import { assertTestDatabaseSafety } from '../../scripts/verify-test-db-safety';
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
import { logAuthAuditEventTx } from '@/lib/auditLog';

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
    // 1. HARD CANONICAL SAFETY GATE CHECK
    assertTestDatabaseSafety(testDbUrl);

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
    it('Case A: Concurrent competing revokeUserRoleAction on exactly 2 SUPER_ADMINs allows exactly 1 and rejects 1 with LAST_SUPER_ADMIN_PROTECTION', async () => {
      // 1. Ensure exactly 2 active SUPER_ADMINs exist
      // Clean up any extra active super admins from prior test runs
      const existingSuperAdmins = await prisma.user.findMany({
        where: {
          status: 'ACTIVE',
          roles: { some: { role: 'SUPER_ADMIN' } },
        },
      });

      for (const sa of existingSuperAdmins) {
        if (sa.id !== superAdmin1Id && sa.id !== superAdmin2Id) {
          await prisma.userRole.deleteMany({
            where: { userId: sa.id, role: 'SUPER_ADMIN' },
          });
        }
      }

      // Ensure superAdmin1 and superAdmin2 are ACTIVE and have SUPER_ADMIN role
      await prisma.user.updateMany({
        where: { id: { in: [superAdmin1Id, superAdmin2Id] } },
        data: { status: 'ACTIVE' },
      });

      for (const saId of [superAdmin1Id, superAdmin2Id]) {
        const hasRole = await prisma.userRole.findFirst({
          where: { userId: saId, role: 'SUPER_ADMIN' },
        });
        if (!hasRole) {
          await prisma.userRole.create({
            data: { userId: saId, role: 'SUPER_ADMIN', grantedBy: superAdmin1Id },
          });
        }
      }

      const initialCount = await prisma.user.count({
        where: {
          status: 'ACTIVE',
          roles: { some: { role: 'SUPER_ADMIN' } },
        },
      });
      expect(initialCount).toBe(2);

      // 2. Launch concurrent competing operations
      process.env.TEST_AUTH_USER_ID = superAdmin1Id;
      const [res1, res2] = await Promise.all([
        revokeUserRoleAction({
          userId: superAdmin1Id,
          role: 'SUPER_ADMIN',
          confirmSelfDemotion: true,
        }),
        revokeUserRoleAction({
          userId: superAdmin2Id,
          role: 'SUPER_ADMIN',
          confirmSelfDemotion: true,
        }),
      ]);

      // 3. Verify exactly one succeeded and exactly one failed with LAST_SUPER_ADMIN_PROTECTION
      const succeeded = [res1, res2].filter((r) => r.success);
      const failed = [res1, res2].filter((r) => !r.success);

      expect(succeeded.length).toBe(1);
      expect(failed.length).toBe(1);
      expect(failed[0].error).toContain('LAST_SUPER_ADMIN_PROTECTION');

      // 4. Verify DB state has exactly 1 active SUPER_ADMIN remaining
      const finalActiveCount = await prisma.user.count({
        where: {
          status: 'ACTIVE',
          roles: { some: { role: 'SUPER_ADMIN' } },
        },
      });
      expect(finalActiveCount).toBe(1);
    });

    it('Case B (Mixed Mutation): Concurrent suspendUserAction vs revokeUserRoleAction on exactly 2 SUPER_ADMINs allows exactly 1 and rejects 1 with LAST_SUPER_ADMIN_PROTECTION', async () => {
      // 1. Find the remaining active super admin and seed a second active super admin
      const remainingSuperAdmins = await prisma.user.findMany({
        where: {
          status: 'ACTIVE',
          roles: { some: { role: 'SUPER_ADMIN' } },
        },
      });
      expect(remainingSuperAdmins.length).toBe(1);
      const primarySuperAdmin = remainingSuperAdmins[0];

      // Re-grant or create second active super admin
      const secondarySuperAdminId =
        primarySuperAdmin.id === superAdmin1Id ? superAdmin2Id : superAdmin1Id;

      await prisma.user.update({
        where: { id: secondarySuperAdminId },
        data: { status: 'ACTIVE' },
      });
      const hasSecondaryRole = await prisma.userRole.findFirst({
        where: { userId: secondarySuperAdminId, role: 'SUPER_ADMIN' },
      });
      if (!hasSecondaryRole) {
        await prisma.userRole.create({
          data: {
            userId: secondarySecondaryAdminId(secondarySuperAdminId),
            role: 'SUPER_ADMIN',
            grantedBy: primarySuperAdmin.id,
          },
        });
      }

      function secondarySecondaryAdminId(id: string) {
        return id;
      }

      const activeCountBeforeMixed = await prisma.user.count({
        where: {
          status: 'ACTIVE',
          roles: { some: { role: 'SUPER_ADMIN' } },
        },
      });
      expect(activeCountBeforeMixed).toBe(2);

      // 2. Launch concurrent mixed destructive operations:
      // Op 1: suspend primarySuperAdmin
      // Op 2: revoke SUPER_ADMIN from secondarySuperAdmin
      process.env.TEST_AUTH_USER_ID = primarySuperAdmin.id;
      const [resSuspend, resRevoke] = await Promise.all([
        suspendUserAction({
          userId: primarySuperAdmin.id,
          reason: 'Mixed concurrent suspend test',
        }),
        revokeUserRoleAction({
          userId: secondarySuperAdminId,
          role: 'SUPER_ADMIN',
          confirmSelfDemotion: true,
        }),
      ]);

      // 3. Verify exactly one succeeded and exactly one failed with LAST_SUPER_ADMIN_PROTECTION
      const succeededMixed = [resSuspend, resRevoke].filter((r) => r.success);
      const failedMixed = [resSuspend, resRevoke].filter((r) => !r.success);

      expect(succeededMixed.length).toBe(1);
      expect(failedMixed.length).toBe(1);
      expect(failedMixed[0].error).toContain('LAST_SUPER_ADMIN_PROTECTION');

      // 4. Verify DB state has exactly 1 active SUPER_ADMIN remaining
      const finalCountAfterMixed = await prisma.user.count({
        where: {
          status: 'ACTIVE',
          roles: { some: { role: 'SUPER_ADMIN' } },
        },
      });
      expect(finalCountAfterMixed).toBe(1);

      // Restore primarySuperAdmin and superAdmin1/2 for remaining tests
      await prisma.user.update({
        where: { id: superAdmin1Id },
        data: { status: 'ACTIVE' },
      });
      const sa1Role = await prisma.userRole.findFirst({
        where: { userId: superAdmin1Id, role: 'SUPER_ADMIN' },
      });
      if (!sa1Role) {
        await prisma.userRole.create({
          data: { userId: superAdmin1Id, role: 'SUPER_ADMIN' },
        });
      }
    });
  });

  describe('6. System Health Secret Scan & Real Derived Semantics', () => {
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

      // Verify Real Derived App Version & Rate Limiter Status
      expect(report.application.appVersion).toBeTruthy();
      expect(typeof report.application.appVersion).toBe('string');
      expect(typeof report.authService.authJsConfigured).toBe('boolean');
      expect(['ACTIVE', 'IN_MEMORY', 'DEGRADED', 'UNKNOWN']).toContain(
        report.authService.rateLimiterStatus
      );
    });
  });

  describe('7. Audit Logging Atomicity & Transaction Rollback Regression', () => {
    it('guarantees atomic rollback of user mutation when audit log insertion fails', async () => {
      // 1. Create an isolated active user
      const atomicTestUser = await prisma.user.create({
        data: {
          email: `atomic_rollback_${timestamp}@psycheai.test`,
          emailNormalized: `atomic_rollback_${timestamp}@psycheai.test`.toLowerCase(),
          name: 'Atomik Geri Alma Test Kullanıcısı',
          status: 'ACTIVE',
          emailVerified: new Date(),
          credential: {
            create: { passwordHash: await hashPassword('TestPass123!') },
          },
          roles: { create: { role: 'USER' } },
        },
      });

      // 2. Execute a transaction that updates user status to SUSPENDED,
      // but forces audit insert failure (violates foreign key constraint on auth_audit_events.userId)
      let transactionThrown = false;
      try {
        await prisma.$transaction(async (tx) => {
          // A. Update status to SUSPENDED
          await tx.user.update({
            where: { id: atomicTestUser.id },
            data: { status: 'SUSPENDED' },
          });

          // B. Force audit log insertion failure by referencing non-existent userId foreign key
          await logAuthAuditEventTx(tx, {
            eventType: 'USER_SUSPENDED',
            userId: '00000000-0000-0000-0000-000000000000', // Non-existent foreign key target
            actorUserId: superAdmin1Id,
            success: true,
          });
        });
      } catch {
        transactionThrown = true;
      }

      expect(transactionThrown).toBe(true);

      // 3. Verify user status in database ROLLED BACK and remains strictly 'ACTIVE'
      const freshUser = await prisma.user.findUnique({
        where: { id: atomicTestUser.id },
      });
      expect(freshUser?.status).toBe('ACTIVE');

      // Cleanup
      await prisma.user.delete({ where: { id: atomicTestUser.id } }).catch(() => {});
    });
  });
});
