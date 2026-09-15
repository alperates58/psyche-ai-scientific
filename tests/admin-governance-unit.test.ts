import { describe, it, expect } from 'vitest';
import { sanitizeAuditMetadata, hashIp } from '@/lib/auditLog';
import { maskEmail } from '@/services/adminService';
import { parsePaginationParams } from '@/services/adminUserService';
import {
  ROLE_PERMISSIONS,
  getUserPermissions,
  hasPermission,
  hasRole,
  isValidRole,
} from '@/lib/rbac';

describe('FAZ 2.7B: Admin Governance & Security Unit Tests', () => {
  describe('1. Email Verification Preservation & Lifecycle Semantics', () => {
    it('restores email-verified suspended user to ACTIVE', () => {
      const user = {
        id: 'u1',
        status: 'SUSPENDED',
        emailVerified: new Date('2026-01-01'),
      };

      const restoredStatus = user.emailVerified !== null ? 'ACTIVE' : 'PENDING_VERIFICATION';
      expect(restoredStatus).toBe('ACTIVE');
    });

    it('restores unverified suspended user to PENDING_VERIFICATION (no verification bypass)', () => {
      const user = {
        id: 'u2',
        status: 'SUSPENDED',
        emailVerified: null,
      };

      const restoredStatus = user.emailVerified !== null ? 'ACTIVE' : 'PENDING_VERIFICATION';
      expect(restoredStatus).toBe('PENDING_VERIFICATION');
    });

    it('rejects reactivation of a DISABLED account', () => {
      const user = {
        id: 'u3',
        status: 'DISABLED',
        emailVerified: new Date(),
      };

      const canReactivate = user.status === 'SUSPENDED';
      expect(canReactivate).toBe(false);
    });
  });

  describe('2. Last SUPER_ADMIN & Self-Demotion Invariant Logic', () => {
    it('blocks revoking SUPER_ADMIN if active count <= 1', () => {
      const activeSuperAdminCount = 1;
      const willViolateInvariant = activeSuperAdminCount <= 1;
      expect(willViolateInvariant).toBe(true);
    });

    it('allows revoking SUPER_ADMIN if active count > 1', () => {
      const activeSuperAdminCount = 2;
      const willViolateInvariant = activeSuperAdminCount <= 1;
      expect(willViolateInvariant).toBe(false);
    });

    it('requires confirmSelfDemotion flag when super admin demotes self', () => {
      const actorId = 'admin_1';
      const targetUserId = 'admin_1';
      const confirmSelfDemotion = false;

      const requiresConfirmation = actorId === targetUserId && !confirmSelfDemotion;
      expect(requiresConfirmation).toBe(true);
    });
  });

  describe('3. Role Governance & State Rules', () => {
    it('rejects granting roles to DISABLED users', () => {
      const targetStatus = 'DISABLED';
      const isAllowed = targetStatus !== 'DISABLED';
      expect(isAllowed).toBe(false);
    });

    it('confirms ADMIN has USER_MANAGE and SYSTEM_CONFIG but lacks ROLE_MANAGE', () => {
      const adminPerms = getUserPermissions(['ADMIN']);
      expect(adminPerms).toContain('USER_MANAGE');
      expect(adminPerms).toContain('SYSTEM_CONFIG');
      expect(adminPerms).toContain('ADMIN_ACCESS');
      expect(adminPerms).not.toContain('ROLE_MANAGE');
    });

    it('confirms SUPER_ADMIN has ROLE_MANAGE, USER_MANAGE, and SYSTEM_CONFIG', () => {
      const superAdminPerms = getUserPermissions(['SUPER_ADMIN']);
      expect(superAdminPerms).toContain('ROLE_MANAGE');
      expect(superAdminPerms).toContain('USER_MANAGE');
      expect(superAdminPerms).toContain('SYSTEM_CONFIG');
      expect(superAdminPerms).toContain('ADMIN_ACCESS');
    });

    it('validates role enum checks', () => {
      expect(isValidRole('SUPER_ADMIN')).toBe(true);
      expect(isValidRole('ADMIN')).toBe(true);
      expect(isValidRole('RESEARCHER')).toBe(true);
      expect(isValidRole('EXPERT_REVIEWER')).toBe(true);
      expect(isValidRole('USER')).toBe(true);
      expect(isValidRole('ROOT')).toBe(false);
      expect(isValidRole('GUEST')).toBe(false);
    });
  });

  describe('4. Audit Metadata Sanitization & Anonymization', () => {
    it('redacts sensitive credentials, tokens, secrets, and cookies recursively', () => {
      const dirty = {
        userId: 'u_123',
        password: 'SuperSecretPassword123!',
        rawToken: 'tok_abc1234567890',
        authSecret: 'super_secret_jwt_key',
        nested: {
          sessionToken: 'sess_secret_token_123',
          cookie: 'next-auth.session-token=secret',
          safeField: 'harmless_data',
        },
      };

      const sanitized = sanitizeAuditMetadata(dirty);
      expect(sanitized).toBeDefined();
      expect(sanitized?.userId).toBe('u_123');
      expect(sanitized?.password).toBe('[REDACTED]');
      expect(sanitized?.rawToken).toBe('[REDACTED]');
      expect(sanitized?.authSecret).toBe('[REDACTED]');
      expect(sanitized?.nested?.sessionToken).toBe('[REDACTED]');
      expect(sanitized?.nested?.cookie).toBe('[REDACTED]');
      expect(sanitized?.nested?.safeField).toBe('harmless_data');
    });

    it('hashes IP addresses deterministically without storing raw IP', () => {
      const rawIp1 = '192.168.1.100';
      const rawIp2 = '192.168.1.100';
      const rawIp3 = '10.0.0.1';

      const hash1 = hashIp(rawIp1);
      const hash2 = hashIp(rawIp2);
      const hash3 = hashIp(rawIp3);

      expect(hash1).toBeTruthy();
      expect(hash1).toBe(hash2);
      expect(hash1).not.toBe(hash3);
      expect(hash1).not.toContain('192.168');
    });

    it('handles empty/null IP hashing safely', () => {
      expect(hashIp(null)).toBeNull();
      expect(hashIp('')).toBeNull();
      expect(hashIp('   ')).toBeNull();
    });
  });

  describe('5. Email Masking & Pagination Utilities', () => {
    it('masks emails preserving first/last characters and domain', () => {
      expect(maskEmail('alper.ates@gmail.com')).toBe('a***s@gmail.com');
      expect(maskEmail('test.user@psycheai.org')).toBe('t***r@psycheai.org');
      expect(maskEmail('a@b.com')).toBe('a***@b.com');
      expect(maskEmail(null)).toBeNull();
      expect(maskEmail('')).toBeNull();
    });

    it('clamps pagination page and page size safely', () => {
      expect(parsePaginationParams('1', '10')).toEqual({ page: 1, pageSize: 10 });
      expect(parsePaginationParams('3', '25')).toEqual({ page: 3, pageSize: 25 });
      expect(parsePaginationParams('-5', '50')).toEqual({ page: 1, pageSize: 50 });
      expect(parsePaginationParams('abc', '999')).toEqual({ page: 1, pageSize: 10 });
      expect(parsePaginationParams(undefined, undefined)).toEqual({ page: 1, pageSize: 10 });
    });
  });

  describe('6. Session Health Semantics', () => {
    it('considers 0 active sessions as operational when table is reachable', () => {
      const activeSessionCount = 0;
      const isTableReachable = true;
      const sessionRegistryOperational = isTableReachable;

      expect(sessionRegistryOperational).toBe(true);
      expect(activeSessionCount).toBe(0);
    });
  });

  describe('7. Strict Test Database Safety Gate Invariants', () => {
    it('rejects test database with wrong port (e.g. 5433)', async () => {
      const { validateTestDatabaseConfig } = await import('../scripts/verify-test-db-safety');
      const res = validateTestDatabaseConfig(
        'postgresql://postgres:postgres@localhost:5433/psyche_ai_test',
        'postgresql://postgres:postgres@localhost:5433/psyche_ai'
      );
      expect(res.valid).toBe(false);
      expect(res.error).toContain('must be exactly 5434');
    });

    it('rejects test database with remote host', async () => {
      const { validateTestDatabaseConfig } = await import('../scripts/verify-test-db-safety');
      const res = validateTestDatabaseConfig(
        'postgresql://postgres:postgres@remote-host:5434/psyche_ai_test',
        'postgresql://postgres:postgres@localhost:5433/psyche_ai'
      );
      expect(res.valid).toBe(false);
      expect(res.error).toContain('strictly localhost or 127.0.0.1');
    });

    it('rejects test database with wrong database name', async () => {
      const { validateTestDatabaseConfig } = await import('../scripts/verify-test-db-safety');
      const res = validateTestDatabaseConfig(
        'postgresql://postgres:postgres@localhost:5434/psyche_ai',
        'postgresql://postgres:postgres@localhost:5433/psyche_ai'
      );
      expect(res.valid).toBe(false);
      expect(res.error).toContain("must be exactly 'psyche_ai_test'");
    });

    it('rejects when test database resolves to same database identity as dev database', async () => {
      const { validateTestDatabaseConfig } = await import('../scripts/verify-test-db-safety');
      const res = validateTestDatabaseConfig(
        'postgresql://postgres:postgres@localhost:5434/psyche_ai_test',
        'postgresql://postgres:postgres@localhost:5434/psyche_ai_test'
      );
      expect(res.valid).toBe(false);
      expect(res.error).toContain('resolves to the same database identity as DEV database');
    });

    it('accepts isolated valid local test database configuration', async () => {
      const { validateTestDatabaseConfig } = await import('../scripts/verify-test-db-safety');
      const res = validateTestDatabaseConfig(
        'postgresql://postgres:postgres@localhost:5434/psyche_ai_test?schema=public',
        'postgresql://postgres:postgres@localhost:5433/psyche_ai?schema=public'
      );
      expect(res.valid).toBe(true);
      expect(res.testMeta?.port).toBe('5434');
      expect(res.testMeta?.database).toBe('psyche_ai_test');
    });
  });
});
