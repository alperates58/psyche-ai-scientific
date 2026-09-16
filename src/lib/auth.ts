import { auth } from '@/auth';
import { prisma } from './prisma';
import { Role, Permission, getUserPermissions, hasRole, hasPermission } from './rbac';
import { logAuthAuditEvent } from './auditLog';
import { isEmailVerificationEnforced } from '@/services/systemSettingsService';

export interface AuthUser {
  id: string;
  email: string | null;
  name: string;
  image: string | null;
  status: string; // 'ACTIVE', 'PENDING_VERIFICATION', 'SUSPENDED', 'DISABLED'
  isDemoUser: boolean;
  roles: Role[];
  permissions: Permission[];
}

/**
 * Resolves the currently authenticated user from Auth.js session and verifies
 * it against the authoritative server-side session revocation registry (auth_sessions).
 * Returns null if unauthenticated, session revoked, expired, or account suspended/disabled.
 */
export async function getCurrentUserOrNull(): Promise<AuthUser | null> {
  let session: any = null;
  try {
    session = await auth();
  } catch {
    // When invoked outside Next.js request context (e.g. background tasks or unit/integration tests)
    session = null;
  }

  // 1. Session presence check
  if (!session?.user?.id) {
    // In test environment without explicit session, resolve test demo user
    if (process.env.NODE_ENV === 'test') {
      if (process.env.TEST_AUTH_USER_ID === 'none') {
        return null;
      }
      const targetUserId = process.env.TEST_AUTH_USER_ID;
      const mock = targetUserId
        ? await prisma.user.findUnique({
            where: { id: targetUserId },
            include: { roles: true },
          })
        : await prisma.user.findFirst({
            where: { isDemoUser: true },
            include: { roles: true },
          });

      if (mock) {
        const roles = mock.roles.map((r) => r.role as Role);
        if (roles.length === 0) roles.push('USER');
        return {
          id: mock.id,
          email: mock.email,
          name: mock.name,
          image: mock.image,
          status: mock.status,
          isDemoUser: mock.isDemoUser,
          roles,
          permissions: getUserPermissions(roles),
        };
      }
    }
    return null;
  }

  const userId = session.user.id;
  const sid = (session as any).sid;

  // 2. Authoritative server-side session registry & revocation check
  // MANDATORY: Any authenticated session missing a valid `sid` is invalid.
  if (!sid || typeof sid !== 'string') {
    return null;
  }

  const activeRegistrySession = await prisma.session.findUnique({
    where: { sessionToken: sid },
    select: { userId: true, revokedAt: true, expires: true },
  });

  // Session must exist, belong to the authenticated user, not be revoked, and not be expired
  if (!activeRegistrySession) {
    return null;
  }

  if (
    activeRegistrySession.userId !== userId ||
    activeRegistrySession.revokedAt !== null ||
    activeRegistrySession.expires <= new Date()
  ) {
    return null;
  }

  // 3. User status and role verification
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { roles: true },
  });

  if (!user) {
    return null;
  }

  // Suspended or disabled accounts are immediately blocked on all server-side operations
  if (user.status === 'SUSPENDED' || user.status === 'DISABLED') {
    return null;
  }

  // If email verification is disabled system-wide, auto-upgrade PENDING_VERIFICATION to ACTIVE
  let userStatus = user.status;
  if (userStatus === 'PENDING_VERIFICATION' && !isEmailVerificationEnforced()) {
    userStatus = 'ACTIVE';
    prisma.user
      .update({
        where: { id: user.id },
        data: { status: 'ACTIVE', emailVerified: user.emailVerified || new Date() },
      })
      .catch((e) => console.error('Failed to auto-activate user status:', e));
  }

  const roles = user.roles.map((r) => r.role as Role);
  if (roles.length === 0) {
    roles.push('USER');
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    status: userStatus,
    isDemoUser: user.isDemoUser,
    roles,
    permissions: getUserPermissions(roles),
  };
}

/**
 * Requires an authenticated, active user.
 * Throws UNAUTHENTICATED if session is missing or revoked.
 * Throws EMAIL_NOT_VERIFIED if account is PENDING_VERIFICATION.
 */
export async function requireUser(): Promise<AuthUser> {
  const user = await getCurrentUserOrNull();

  if (!user) {
    throw new Error('UNAUTHENTICATED: Giriş yapmanız gerekmektedir.');
  }

  if (user.status === 'PENDING_VERIFICATION' && isEmailVerificationEnforced()) {
    throw new Error('EMAIL_NOT_VERIFIED: Lütfen e-posta adresinizi doğrulayın.');
  }

  return user;
}

/**
 * Alias for requireUser to support existing services.
 */
export async function getCurrentUser(): Promise<AuthUser> {
  return requireUser();
}

/**
 * Requires the user to have a specific role.
 */
export async function requireRole(role: Role): Promise<AuthUser> {
  const user = await requireUser();
  if (!hasRole(user.roles, role)) {
    throw new Error(`FORBIDDEN: Bu işlem için '${role}' rolü gereklidir.`);
  }
  return user;
}

/**
 * Requires the user to have at least one of the specified roles.
 */
export async function requireAnyRole(roles: Role[]): Promise<AuthUser> {
  const user = await requireUser();
  const hasAny = roles.some((r) => hasRole(user.roles, r));
  if (!hasAny) {
    throw new Error(`FORBIDDEN: Bu işlem için yetkiniz bulunmamaktadır.`);
  }
  return user;
}

/**
 * Requires the user to have a specific permission.
 */
export async function requirePermission(permission: Permission): Promise<AuthUser> {
  const user = await requireUser();
  if (!hasPermission(user.roles, permission)) {
    throw new Error(`FORBIDDEN: Bu işlem için '${permission}' yetkisi gereklidir.`);
  }
  return user;
}

/**
 * Revokes all active database registry sessions for a user (Global Sign-out).
 */
export async function revokeAllSessions(userId: string): Promise<void> {
  await prisma.session.updateMany({
    where: {
      userId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });

  await logAuthAuditEvent({
    eventType: 'ALL_SESSIONS_REVOKED',
    userId,
    success: true,
  });
}
