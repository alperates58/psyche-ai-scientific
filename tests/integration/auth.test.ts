import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/password';
import { generateRawToken, hashToken, TOKEN_EXPIRY_MS } from '@/lib/tokens';
import { hasRole, hasPermission, getUserPermissions } from '@/lib/rbac';
import { revokeAllSessions } from '@/lib/auth';
import { logAuthAuditEvent } from '@/lib/auditLog';

const hasTestDb = Boolean(process.env.TEST_DATABASE_URL);
if (!hasTestDb) {
  console.warn('SKIPPED: TEST_DATABASE_URL_NOT_CONFIGURED - Database integration tests skipped because TEST_DATABASE_URL is unset');
}

describe.skipIf(!hasTestDb)('Authentication, Identity & RBAC Foundation (Integration)', () => {
  const testEmail = `auth_test_${Date.now()}@psycheai.test`;
  const testPassword = 'SecurePassword123!';
  let testUserId: string;

  afterAll(async () => {
    if (testUserId) {
      await prisma.user.delete({ where: { id: testUserId } }).catch(() => {});
    }
  });

  it('registers user with scrypt credential and PENDING_VERIFICATION status', async () => {
    const passwordHash = await hashPassword(testPassword);

    const user = await prisma.user.create({
      data: {
        name: 'Auth Test Subject',
        email: testEmail,
        emailNormalized: testEmail.toLowerCase(),
        status: 'PENDING_VERIFICATION',
        isDemoUser: false,
        credentials: {
          create: {
            passwordHash,
          },
        },
        roles: {
          create: {
            role: 'USER',
          },
        },
      },
      include: {
        credentials: true,
        roles: true,
      },
    });

    testUserId = user.id;
    expect(user.id).toBeDefined();
    expect(user.status).toBe('PENDING_VERIFICATION');
    expect(user.credentials).toBeDefined();
    expect(user.roles).toHaveLength(1);
    expect(user.roles[0].role).toBe('USER');

    // Verify scrypt hash against stored password
    const verified = await verifyPassword(testPassword, user.credentials!.passwordHash);
    expect(verified).toBe(true);
  });

  it('creates hashed email verification token and activates user on verification', async () => {
    const rawToken = generateRawToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MS.EMAIL_VERIFICATION);

    // Store token
    await prisma.emailVerificationToken.create({
      data: {
        userId: testUserId,
        tokenHash,
        expiresAt,
      },
    });

    // Simulate verification
    const foundToken = await prisma.emailVerificationToken.findUnique({
      where: { tokenHash },
    });
    expect(foundToken).not.toBeNull();
    expect(foundToken!.userId).toBe(testUserId);
    expect(foundToken!.usedAt).toBeNull();

    // Mark verified
    await prisma.$transaction([
      prisma.emailVerificationToken.update({
        where: { id: foundToken!.id },
        data: { usedAt: new Date() },
      }),
      prisma.user.update({
        where: { id: testUserId },
        data: {
          emailVerified: new Date(),
          status: 'ACTIVE',
        },
      }),
    ]);

    const updatedUser = await prisma.user.findUnique({ where: { id: testUserId } });
    expect(updatedUser?.status).toBe('ACTIVE');
    expect(updatedUser?.emailVerified).not.toBeNull();
  });

  it('manages sessions and supports instantaneous all-device revocation', async () => {
    const sessionToken1 = generateRawToken();
    const sessionToken2 = generateRawToken();
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Create 2 active sessions
    await prisma.session.createMany({
      data: [
        { userId: testUserId, sessionToken: sessionToken1, expires },
        { userId: testUserId, sessionToken: sessionToken2, expires },
      ],
    });

    const activeBefore = await prisma.session.findMany({
      where: { userId: testUserId, revokedAt: null },
    });
    expect(activeBefore).toHaveLength(2);

    // Revoke all sessions for this user
    await revokeAllSessions(testUserId);

    const activeAfter = await prisma.session.findMany({
      where: { userId: testUserId, revokedAt: null },
    });
    expect(activeAfter).toHaveLength(0);
  });

  it('handles password reset token flow with hash at rest and credential update', async () => {
    const rawResetToken = generateRawToken();
    const tokenHash = hashToken(rawResetToken);
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MS.PASSWORD_RESET);

    await prisma.passwordResetToken.create({
      data: {
        userId: testUserId,
        tokenHash,
        expiresAt,
      },
    });

    const storedToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });
    expect(storedToken).not.toBeNull();
    expect(storedToken!.usedAt).toBeNull();

    // Reset password
    const newPassword = 'NewlyUpdatedPassword456!';
    const newHash = await hashPassword(newPassword);

    await prisma.$transaction([
      prisma.passwordResetToken.update({
        where: { id: storedToken!.id },
        data: { usedAt: new Date() },
      }),
      prisma.userCredential.update({
        where: { userId: testUserId },
        data: { passwordHash: newHash, passwordUpdatedAt: new Date() },
      }),
    ]);

    const updatedCred = await prisma.userCredential.findUnique({
      where: { userId: testUserId },
    });
    const verified = await verifyPassword(newPassword, updatedCred!.passwordHash);
    expect(verified).toBe(true);
  });

  it('grants multiple roles and correctly derives aggregated permissions', async () => {
    // Grant EXPERT_REVIEWER and ADMIN roles
    await prisma.userRole.createMany({
      data: [
        { userId: testUserId, role: 'EXPERT_REVIEWER' },
        { userId: testUserId, role: 'ADMIN' },
      ],
      skipDuplicates: true,
    });

    const userRoles = await prisma.userRole.findMany({
      where: { userId: testUserId },
    });
    const roleNames = userRoles.map((r) => r.role);

    expect(hasRole(roleNames, 'USER')).toBe(true);
    expect(hasRole(roleNames, 'EXPERT_REVIEWER')).toBe(true);
    expect(hasRole(roleNames, 'ADMIN')).toBe(true);
    expect(hasRole(roleNames, 'SUPER_ADMIN')).toBe(false);

    // Derived permissions
    expect(hasPermission(roleNames, 'ADMIN_ACCESS')).toBe(true);
    expect(hasPermission(roleNames, 'USER_MANAGE')).toBe(true);
    expect(hasPermission(roleNames, 'RESEARCH_REVIEW')).toBe(true);
    expect(hasPermission(roleNames, 'ROLE_MANAGE')).toBe(false);
  });

  it('records immutable audit events with IP anonymization', async () => {
    await logAuthAuditEvent({
      eventType: 'LOGIN_SUCCESS',
      userId: testUserId,
      success: true,
      ip: '203.0.113.195',
      userAgent: 'IntegrationTestRunner/1.0',
      metadata: { method: 'credentials', test: true },
    });

    const event = await prisma.authAuditEvent.findFirst({
      where: { userId: testUserId, eventType: 'LOGIN_SUCCESS' },
      orderBy: { createdAt: 'desc' },
    });

    expect(event).not.toBeNull();
    expect(event!.success).toBe(true);
    expect(event!.ipHash).toBeDefined();
    // Raw IP is NEVER stored
    expect(event!.ipHash).not.toContain('203.0.113.195');
    expect(event!.ipHash).toHaveLength(32);
  });
});
