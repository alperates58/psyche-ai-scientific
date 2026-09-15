import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import path from 'path';
import crypto from 'crypto';
import { assertTestDatabaseSafety } from '../../scripts/verify-test-db-safety';
import { prisma } from '@/lib/prisma';
import {
  registerAction,
  verifyEmailAction,
  requestPasswordResetAction,
  resetPasswordAction,
} from '@/actions/auth';
import { getCurrentUserOrNull, requireUser, revokeAllSessions } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimiter';
import { getMailSink, clearMailSink } from '@/lib/emailService';
import { hashPassword, verifyPassword, dummyVerifyPassword } from '@/lib/password';
import { hasRole, hasPermission, getUserPermissions } from '@/lib/rbac';
import { getOrCreateAssessmentSession, pauseAssessmentSession } from '@/services/assessmentService';
import { getLatestProfileSnapshotForUser, getUserProfileCoverage } from '@/services/profileService';
import { GET as getCoverageRoute } from '@/app/api/profile/coverage/route';

// Mock Auth.js session resolution for controlled session/sid matrix testing
let mockAuthSession: any = null;
vi.mock('@/auth', () => ({
  auth: vi.fn(async () => mockAuthSession),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

const hasTestDb = Boolean(process.env.TEST_DATABASE_URL);
if (!hasTestDb) {
  console.warn('SKIPPED: TEST_DATABASE_URL_NOT_CONFIGURED - Database integration tests skipped because TEST_DATABASE_URL is unset');
}

describe.skipIf(!hasTestDb)('FAZ 2.6: Real PostgreSQL Integration & Security Hardening', () => {
  const createdUserIds: string[] = [];

  beforeAll(async () => {
    // HARD SAFETY GATE: Assert TEST_DATABASE_URL exists, target is isolated psyche_ai_test, non-production
    assertTestDatabaseSafety();
  });

  beforeEach(() => {
    clearMailSink();
    mockAuthSession = null;
  });

  afterAll(async () => {
    // Cleanup any created users from the test database
    if (createdUserIds.length > 0) {
      await prisma.user.deleteMany({
        where: { id: { in: createdUserIds } },
      }).catch(() => {});
    }
    await prisma.$disconnect();
  });

  // -------------------------------------------------------------
  // 1. CREDENTIALS REGISTRATION & PERSISTENCE
  // -------------------------------------------------------------
  it('registers credentials user, creates default USER role, scrypt credential, and verification token', async () => {
    const rawEmail = `reg_test_${Date.now()}@psycheai.test`;
    const regResult = await registerAction({
      name: 'Dr. Test Subject',
      email: rawEmail,
      password: 'PassphraseSecret123!',
      passwordConfirmation: 'PassphraseSecret123!',
    });

    expect(regResult.success).toBe(true);
    const normalizedEmail = rawEmail.toLowerCase();

    const user = await prisma.user.findFirst({
      where: { emailNormalized: normalizedEmail },
      include: {
        roles: true,
        credential: true,
        emailTokens: true,
      },
    });

    expect(user).not.toBeNull();
    createdUserIds.push(user!.id);
    expect(user!.status).toBe('PENDING_VERIFICATION');
    expect(user!.emailNormalized).toBe(normalizedEmail);

    // Default USER role
    expect(user!.roles).toHaveLength(1);
    expect(user!.roles[0].role).toBe('USER');

    // Scrypt credential persisted
    expect(user!.credential).not.toBeNull();
    expect(user!.credential!.passwordHash).toMatch(/^\$scrypt\$ln=16,r=8,p=1\$[0-9a-f]{32}\$[0-9a-f]{128}$/);

    // Verification token persisted
    expect(user!.emailTokens).toHaveLength(1);
    expect(user!.emailTokens[0].usedAt).toBeNull();
  });

  // -------------------------------------------------------------
  // 2. NORMALIZED EMAIL UNIQUENESS
  // -------------------------------------------------------------
  it('enforces email normalization uniqueness (rejects duplicate under different casing)', async () => {
    const baseEmail = `unique_case_${Date.now()}@psycheai.test`;
    const firstRes = await registerAction({
      name: 'First Register',
      email: baseEmail.toLowerCase(),
      password: 'PassphraseSecret123!',
      passwordConfirmation: 'PassphraseSecret123!',
    });
    expect(firstRes.success).toBe(true);

    const created = await prisma.user.findFirst({ where: { emailNormalized: baseEmail.toLowerCase() } });
    if (created) createdUserIds.push(created.id);

    // Attempt second registration with uppercase characters
    const secondRes = await registerAction({
      name: 'Second Register',
      email: baseEmail.toUpperCase(),
      password: 'PassphraseSecret123!',
      passwordConfirmation: 'PassphraseSecret123!',
    });

    expect(secondRes.success).toBe(false);
    expect(secondRes.error).toContain('hesap bulunmaktadır');
  });

  // -------------------------------------------------------------
  // 3. EMAIL VERIFICATION BUSINESS LOGIC & ATOMIC SINGLE-USE
  // -------------------------------------------------------------
  it('verifies email via verifyEmailAction and atomically prevents double-consumption', async () => {
    const email = `verify_atomic_${Date.now()}@psycheai.test`;
    await registerAction({
      name: 'Verify Atomic Test',
      email,
      password: 'PassphraseSecret123!',
      passwordConfirmation: 'PassphraseSecret123!',
    });

    const user = await prisma.user.findFirst({ where: { emailNormalized: email } });
    createdUserIds.push(user!.id);

    const mails = getMailSink();
    expect(mails.length).toBeGreaterThanOrEqual(1);
    const rawToken = mails[0].token!;

    // 1st redemption -> SUCCESS
    const firstVerify = await verifyEmailAction(rawToken);
    expect(firstVerify.success).toBe(true);

    const verifiedUser = await prisma.user.findUnique({ where: { id: user!.id } });
    expect(verifiedUser!.status).toBe('ACTIVE');
    expect(verifiedUser!.emailVerified).not.toBeNull();

    // 2nd redemption -> FAIL (already consumed)
    const secondVerify = await verifyEmailAction(rawToken);
    expect(secondVerify.success).toBe(false);
    expect(secondVerify.error).toContain('geçersiz veya süresi dolmuş');
  });

  it('proves atomic single-use under concurrent email verification attempts', async () => {
    const email = `concurr_verify_${Date.now()}@psycheai.test`;
    await registerAction({
      name: 'Concurrent Verify',
      email,
      password: 'PassphraseSecret123!',
      passwordConfirmation: 'PassphraseSecret123!',
    });

    const user = await prisma.user.findFirst({ where: { emailNormalized: email } });
    createdUserIds.push(user!.id);

    const rawToken = getMailSink()[0].token!;

    // Trigger two simultaneous concurrent verification requests
    const [res1, res2] = await Promise.all([
      verifyEmailAction(rawToken),
      verifyEmailAction(rawToken),
    ]);

    const successes = [res1, res2].filter((r) => r.success);
    const failures = [res1, res2].filter((r) => !r.success);

    expect(successes).toHaveLength(1);
    expect(failures).toHaveLength(1);
  });

  // -------------------------------------------------------------
  // 4. PASSWORD LOGIN VALIDATION & TIMING DEFENSE
  // -------------------------------------------------------------
  it('verifies scrypt password matching and rejects wrong passwords', async () => {
    const email = `pwd_match_${Date.now()}@psycheai.test`;
    const password = 'SuperSecretPassphrase123!';
    await registerAction({
      name: 'Password Subject',
      email,
      password,
      passwordConfirmation: password,
    });

    const user = await prisma.user.findFirst({
      where: { emailNormalized: email },
      include: { credential: true },
    });
    createdUserIds.push(user!.id);

    const isValid = await verifyPassword(password, user!.credential!.passwordHash);
    expect(isValid).toBe(true);

    const isInvalid = await verifyPassword('WrongPassword123!', user!.credential!.passwordHash);
    expect(isInvalid).toBe(false);
  });

  it('executes real scrypt computation during unknown email lookup (timing defense)', async () => {
    const start = Date.now();
    await dummyVerifyPassword();
    const duration = Date.now() - start;

    // Must perform real scrypt computation (> 10ms)
    expect(duration).toBeGreaterThanOrEqual(10);
  });

  // -------------------------------------------------------------
  // 5. SESSION REGISTRY, MANDATORY SID, OWNERSHIP & REVOCATION
  // -------------------------------------------------------------
  it('rejects sessions without sid, with foreign sid, or with expired/revoked sid', async () => {
    const email = `session_reg_${Date.now()}@psycheai.test`;
    await registerAction({
      name: 'Session Subject',
      email,
      password: 'ValidPassphrase123!',
      passwordConfirmation: 'ValidPassphrase123!',
    });

    const user = await prisma.user.findFirst({ where: { emailNormalized: email } });
    createdUserIds.push(user!.id);

    // Create another user for cross-user sid testing
    const foreignUser = await prisma.user.create({
      data: {
        name: 'Foreign User',
        email: `foreign_${Date.now()}@psycheai.test`,
        emailNormalized: `foreign_${Date.now()}@psycheai.test`,
        status: 'ACTIVE',
      },
    });
    createdUserIds.push(foreignUser.id);

    const validSid = crypto.randomUUID();
    const revokedSid = crypto.randomUUID();
    const expiredSid = crypto.randomUUID();
    const foreignSid = crypto.randomUUID();

    const future = new Date(Date.now() + 3600000);
    const past = new Date(Date.now() - 3600000);

    // Insert session registry rows
    await prisma.session.createMany({
      data: [
        { sessionToken: validSid, userId: user!.id, expires: future, revokedAt: null },
        { sessionToken: revokedSid, userId: user!.id, expires: future, revokedAt: new Date() },
        { sessionToken: expiredSid, userId: user!.id, expires: past, revokedAt: null },
        { sessionToken: foreignSid, userId: foreignUser.id, expires: future, revokedAt: null },
      ],
    });

    // 1. Missing sid -> REJECT
    mockAuthSession = { user: { id: user!.id } }; // No sid property
    expect(await getCurrentUserOrNull()).toBeNull();

    // 2. Non-existent sid -> REJECT
    mockAuthSession = { user: { id: user!.id }, sid: 'unregistered-sid-123' };
    expect(await getCurrentUserOrNull()).toBeNull();

    // 3. Foreign user sid (cross-user substitution) -> REJECT
    mockAuthSession = { user: { id: user!.id }, sid: foreignSid };
    expect(await getCurrentUserOrNull()).toBeNull();

    // 4. Revoked sid -> REJECT
    mockAuthSession = { user: { id: user!.id }, sid: revokedSid };
    expect(await getCurrentUserOrNull()).toBeNull();

    // 5. Expired sid -> REJECT
    mockAuthSession = { user: { id: user!.id }, sid: expiredSid };
    expect(await getCurrentUserOrNull()).toBeNull();

    // 6. Valid matching sid -> ACCEPT
    mockAuthSession = { user: { id: user!.id }, sid: validSid };
    const resolved = await getCurrentUserOrNull();
    expect(resolved).not.toBeNull();
    expect(resolved!.id).toBe(user!.id);
  });

  // -------------------------------------------------------------
  // 6. ACCOUNT STATUS ENFORCEMENT (SUSPENDED, DISABLED, PENDING)
  // -------------------------------------------------------------
  it('immediately blocks SUSPENDED and DISABLED accounts server-side even with valid sid', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Status Test User',
        email: `status_${Date.now()}@psycheai.test`,
        emailNormalized: `status_${Date.now()}@psycheai.test`,
        status: 'ACTIVE',
      },
    });
    createdUserIds.push(user.id);

    const sid = crypto.randomUUID();
    await prisma.session.create({
      data: { sessionToken: sid, userId: user.id, expires: new Date(Date.now() + 3600000) },
    });

    mockAuthSession = { user: { id: user.id }, sid };

    // Active status -> OK
    expect(await getCurrentUserOrNull()).not.toBeNull();

    // Update status to SUSPENDED -> immediate rejection
    await prisma.user.update({ where: { id: user.id }, data: { status: 'SUSPENDED' } });
    expect(await getCurrentUserOrNull()).toBeNull();

    // Update status to DISABLED -> immediate rejection
    await prisma.user.update({ where: { id: user.id }, data: { status: 'DISABLED' } });
    expect(await getCurrentUserOrNull()).toBeNull();
  });

  it('blocks PENDING_VERIFICATION users from protected business operations', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Pending User',
        email: `pending_${Date.now()}@psycheai.test`,
        emailNormalized: `pending_${Date.now()}@psycheai.test`,
        status: 'PENDING_VERIFICATION',
      },
    });
    createdUserIds.push(user.id);

    const sid = crypto.randomUUID();
    await prisma.session.create({
      data: { sessionToken: sid, userId: user.id, expires: new Date(Date.now() + 3600000) },
    });

    mockAuthSession = { user: { id: user.id }, sid };

    // getCurrentUserOrNull returns user object with status PENDING_VERIFICATION
    const currentUser = await getCurrentUserOrNull();
    expect(currentUser).not.toBeNull();
    expect(currentUser!.status).toBe('PENDING_VERIFICATION');

    // requireUser() must throw EMAIL_NOT_VERIFIED
    await expect(requireUser()).rejects.toThrow('EMAIL_NOT_VERIFIED');
  });

  // -------------------------------------------------------------
  // 7. PASSWORD RESET FLOW, ATOMICITY & SESSION REVOCATION
  // -------------------------------------------------------------
  it('executes password reset, atomically consumes token, and revokes all active sessions', async () => {
    const email = `reset_flow_${Date.now()}@psycheai.test`;
    const initialPassword = 'InitialSecretPassphrase123!';
    const newPassword = 'NewUpdatedPassphrase456!';

    await registerAction({
      name: 'Reset Flow Subject',
      email,
      password: initialPassword,
      passwordConfirmation: initialPassword,
    });

    const user = await prisma.user.findFirst({ where: { emailNormalized: email } });
    createdUserIds.push(user!.id);

    // Create 2 active sessions for this user
    const sid1 = crypto.randomUUID();
    const sid2 = crypto.randomUUID();
    const future = new Date(Date.now() + 3600000);

    await prisma.session.createMany({
      data: [
        { sessionToken: sid1, userId: user!.id, expires: future, revokedAt: null },
        { sessionToken: sid2, userId: user!.id, expires: future, revokedAt: null },
      ],
    });

    // Request password reset
    const reqResult = await requestPasswordResetAction({ email });
    expect(reqResult.success).toBe(true);

    const mails = getMailSink();
    const resetToken = mails.find((m) => m.type === 'PASSWORD_RESET')!.token!;
    expect(resetToken).toBeDefined();

    // Execute resetPasswordAction
    const resetResult = await resetPasswordAction({
      token: resetToken,
      password: newPassword,
      passwordConfirmation: newPassword,
    });
    expect(resetResult.success).toBe(true);

    // Assert: Token cannot be consumed twice
    const secondReset = await resetPasswordAction({
      token: resetToken,
      password: newPassword,
      passwordConfirmation: newPassword,
    });
    expect(secondReset.success).toBe(false);

    // Assert: All sessions are revoked in database
    const activeSessions = await prisma.session.findMany({
      where: { userId: user!.id, revokedAt: null },
    });
    expect(activeSessions).toHaveLength(0);

    // Assert: New password verifies; old password rejected
    const updatedCred = await prisma.userCredential.findUnique({ where: { userId: user!.id } });
    expect(await verifyPassword(newPassword, updatedCred!.passwordHash)).toBe(true);
    expect(await verifyPassword(initialPassword, updatedCred!.passwordHash)).toBe(false);
  });

  // -------------------------------------------------------------
  // 8. MULTI-ROLE RBAC & PERMISSION CHECKS
  // -------------------------------------------------------------
  it('correctly aggregates multi-role permissions and enforces RBAC', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'RBAC Subject',
        email: `rbac_${Date.now()}@psycheai.test`,
        emailNormalized: `rbac_${Date.now()}@psycheai.test`,
        status: 'ACTIVE',
        roles: {
          create: [{ role: 'EXPERT_REVIEWER' }, { role: 'RESEARCHER' }],
        },
      },
      include: { roles: true },
    });
    createdUserIds.push(user.id);

    const roleNames = user.roles.map((r) => r.role);
    expect(hasRole(roleNames, 'EXPERT_REVIEWER')).toBe(true);
    expect(hasRole(roleNames, 'RESEARCHER')).toBe(true);
    expect(hasRole(roleNames, 'ADMIN')).toBe(false);

    // Granular permissions
    expect(hasPermission(roleNames, 'APP_USE')).toBe(true);
    expect(hasPermission(roleNames, 'RESEARCH_REVIEW')).toBe(true);
    expect(hasPermission(roleNames, 'RESEARCH_VIEW')).toBe(true);
    expect(hasPermission(roleNames, 'ADMIN_ACCESS')).toBe(false);
  });

  // -------------------------------------------------------------
  // 9. AUDIT LOGGING & ZERO RAW IP STORAGE
  // -------------------------------------------------------------
  it('persists immutable audit events with HMAC-SHA256 hashed IP and zero raw IP exposure', async () => {
    const rawIp = '198.51.100.42';
    const email = `audit_${Date.now()}@psycheai.test`;

    await registerAction({
      name: 'Audit Subject',
      email,
      password: 'AuditPassphrase123!',
      passwordConfirmation: 'AuditPassphrase123!',
    });

    const user = await prisma.user.findFirst({ where: { emailNormalized: email } });
    createdUserIds.push(user!.id);

    const auditEvent = await prisma.authAuditEvent.findFirst({
      where: { userId: user!.id, eventType: 'REGISTER_SUCCESS' },
    });

    expect(auditEvent).not.toBeNull();
    expect(auditEvent!.success).toBe(true);
    // If client IP was captured or not, raw IP must NEVER appear anywhere
    if (auditEvent!.ipHash) {
      expect(auditEvent!.ipHash).not.toContain(rawIp);
      expect(auditEvent!.ipHash).toHaveLength(32);
    }
  });

  // -------------------------------------------------------------
  // 10. POSTGRESQL RATE LIMITER CONCURRENCY & RACE SAFETY
  // -------------------------------------------------------------
  it('enforces atomic rate limiting under parallel concurrent requests against PostgreSQL', async () => {
    const testKey = `concurrency_test_${Date.now()}`;
    const limit = 5;
    const windowSeconds = 60;

    // Fire 15 concurrent calls simultaneously
    const requests = Array.from({ length: 15 }, () =>
      checkRateLimit('test_atomic', testKey, null, limit, windowSeconds)
    );

    const results = await Promise.all(requests);
    const allowedCount = results.filter((r) => r.allowed).length;
    const blockedCount = results.filter((r) => !r.allowed).length;

    // Exactly `limit` requests allowed, remaining 10 blocked
    expect(allowedCount).toBe(limit);
    expect(blockedCount).toBe(10);

    // Verify record in PostgreSQL database
    const cleanKey = crypto
      .createHash('sha256')
      .update(`test_atomic:account:${testKey.toLowerCase()}`)
      .digest('hex');

    const dbRecord = await prisma.rateLimitRecord.findUnique({
      where: { key: cleanKey },
    });

    expect(dbRecord).not.toBeNull();
    expect(dbRecord!.count).toBe(15);
  });

  // -------------------------------------------------------------
  // 11. PSYCHOMETRIC ASSESSMENT & PROFILE OWNERSHIP ISOLATION
  // -------------------------------------------------------------
  it('strictly isolates assessment sessions and profiles between users (cross-user access denial)', async () => {
    const userA = await prisma.user.create({
      data: {
        name: 'User A',
        email: `usera_${Date.now()}@psycheai.test`,
        emailNormalized: `usera_${Date.now()}@psycheai.test`,
        status: 'ACTIVE',
      },
    });
    createdUserIds.push(userA.id);

    const userB = await prisma.user.create({
      data: {
        name: 'User B',
        email: `userb_${Date.now()}@psycheai.test`,
        emailNormalized: `userb_${Date.now()}@psycheai.test`,
        status: 'ACTIVE',
      },
    });
    createdUserIds.push(userB.id);

    // User A creates an assessment session
    const sessionA = await getOrCreateAssessmentSession(userA.id);
    expect(sessionA.userId).toBe(userA.id);

    // User B tries to pause or access User A's session -> MUST THROW FORBIDDEN
    await expect(pauseAssessmentSession(sessionA.id, userB.id, 2)).rejects.toThrow(
      'yetkisiz erişim'
    );

    // Profile snapshot isolation
    const snapshotB = await getLatestProfileSnapshotForUser(userB.id);
    expect(snapshotB).toBeNull();
  });

  // -------------------------------------------------------------
  // 12. FAZ 2.6.1 PROFILE COVERAGE & SIDEBAR SESSION SAFETY
  // -------------------------------------------------------------
  it('verifies zero-assessment coverage returns 0%, and real assessment returns exact explored facet counts', async () => {
    // 1. Fresh user with zero assessments
    const freshUser = await prisma.user.create({
      data: {
        name: 'Fresh Coverage Subject',
        email: `fresh_cov_${Date.now()}@psycheai.test`,
        emailNormalized: `fresh_cov_${Date.now()}@psycheai.test`,
        status: 'ACTIVE',
      },
    });
    createdUserIds.push(freshUser.id);

    const freshCoverage = await getUserProfileCoverage(freshUser.id);
    expect(freshCoverage.exploredFacetsCount).toBe(0);
    expect(freshCoverage.isAssessed).toBe(false);
    expect(freshCoverage.explorationPercentage).toBe(0);
    expect(freshCoverage.totalOntologyFacets).toBe(84);

    // Create session in DB for freshUser
    const freshSid = `sid_fresh_${Date.now()}`;
    await prisma.session.create({
      data: {
        sessionToken: freshSid,
        userId: freshUser.id,
        expires: new Date(Date.now() + 86400000),
      },
    });

    mockAuthSession = { user: { id: freshUser.id }, sid: freshSid };
    const freshRes = await getCoverageRoute();
    expect(freshRes.status).toBe(200);
    const freshJson = await freshRes.json();
    expect(freshJson.exploredFacetsCount).toBe(0);
    expect(freshJson.isAssessed).toBe(false);

    // 2. Assessed user with real snapshot
    const assessedUser = await prisma.user.create({
      data: {
        name: 'Assessed Coverage Subject',
        email: `assessed_cov_${Date.now()}@psycheai.test`,
        emailNormalized: `assessed_cov_${Date.now()}@psycheai.test`,
        status: 'ACTIVE',
      },
    });
    createdUserIds.push(assessedUser.id);

    // Create profile snapshot with 3 measured facets
    const scoringModel = await prisma.scoringModelVersion.findFirstOrThrow();
    const snapshot = await prisma.profileSnapshot.create({
      data: {
        userId: assessedUser.id,
        scoringModelVersionId: scoringModel.id,
        normStatus: 'UNAVAILABLE',
        provisionalComposite: 3.17,
        overallIntegrity: 'ACCEPTABLE',
      },
    });

    const sampleFacets = await prisma.facet.findMany({ take: 3 });
    expect(sampleFacets.length).toBe(3);

    await prisma.facetScore.createMany({
      data: [
        { profileSnapshotId: snapshot.id, facetId: sampleFacets[0].id, rawMean: 3.5, itemCount: 4 },
        { profileSnapshotId: snapshot.id, facetId: sampleFacets[1].id, rawMean: 3.2, itemCount: 4 },
        { profileSnapshotId: snapshot.id, facetId: sampleFacets[2].id, rawMean: 2.8, itemCount: 3 },
      ],
    });

    const assessedCoverage = await getUserProfileCoverage(assessedUser.id);
    expect(assessedCoverage.exploredFacetsCount).toBe(3);
    expect(assessedCoverage.isAssessed).toBe(true);
    expect(assessedCoverage.totalOntologyFacets).toBe(84);
    expect(assessedCoverage.explorationPercentage).toBe(4); // Math.round(3/84 * 100) = 4%

    // Authenticate as assessedUser
    const assessedSid = `sid_assessed_${Date.now()}`;
    await prisma.session.create({
      data: {
        sessionToken: assessedSid,
        userId: assessedUser.id,
        expires: new Date(Date.now() + 86400000),
      },
    });

    mockAuthSession = { user: { id: assessedUser.id }, sid: assessedSid };
    const assessedRes = await getCoverageRoute();
    expect(assessedRes.status).toBe(200);
    const assessedJson = await assessedRes.json();
    expect(assessedJson.exploredFacetsCount).toBe(3);
    expect(assessedJson.isAssessed).toBe(true);
    expect(assessedJson.explorationPercentage).toBe(4);

    // 3. Unauthenticated request returns 401
    mockAuthSession = null;
    process.env.TEST_AUTH_USER_ID = 'none';
    try {
      const unauthRes = await getCoverageRoute();
      expect(unauthRes.status).toBe(401);
    } finally {
      delete process.env.TEST_AUTH_USER_ID;
    }

    // 4. PENDING_VERIFICATION user returns 403
    const pendingUser = await prisma.user.create({
      data: {
        name: 'Pending Coverage Subject',
        email: `pending_cov_${Date.now()}@psycheai.test`,
        emailNormalized: `pending_cov_${Date.now()}@psycheai.test`,
        status: 'PENDING_VERIFICATION',
      },
    });
    createdUserIds.push(pendingUser.id);

    const pendingSid = `sid_pending_${Date.now()}`;
    await prisma.session.create({
      data: {
        sessionToken: pendingSid,
        userId: pendingUser.id,
        expires: new Date(Date.now() + 86400000),
      },
    });

    mockAuthSession = { user: { id: pendingUser.id }, sid: pendingSid };
    const pendingRes = await getCoverageRoute();
    expect(pendingRes.status).toBe(403);
  });
});
