'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/auth';
import { logAuthAuditEventTx } from '@/lib/auditLog';

const GOVERNANCE_ADVISORY_LOCK_KEY = '7492019827364512';

function safeRevalidatePath(path: string) {
  try {
    revalidatePath(path);
  } catch {}
}

const SuspendUserSchema = z.object({
  userId: z.string().min(1, 'Kullanıcı ID zorunludur'),
  reason: z.string().max(500).optional(),
});

const ReactivateUserSchema = z.object({
  userId: z.string().min(1, 'Kullanıcı ID zorunludur'),
  reason: z.string().max(500).optional(),
});

const DisableUserSchema = z.object({
  userId: z.string().min(1, 'Kullanıcı ID zorunludur'),
  reason: z.string().max(500).optional(),
  confirmationText: z.string().min(1, 'Onay metni zorunludur'),
});

const RevokeUserSessionsSchema = z.object({
  userId: z.string().min(1, 'Kullanıcı ID zorunludur'),
  reason: z.string().max(500).optional(),
});

interface AdminActionResult {
  success: boolean;
  error?: string;
  data?: any;
}

/**
 * Suspend user account and revoke all active sessions atomically.
 * Protected by PostgreSQL transaction-scoped advisory lock and Last Super Admin guard.
 */
export async function suspendUserAction(input: {
  userId: string;
  reason?: string;
}): Promise<AdminActionResult> {
  try {
    const actor = await requirePermission('USER_MANAGE');
    const parsed = SuspendUserSchema.parse(input);

    await prisma.$transaction(async (tx) => {
      // 1. Transaction-scoped advisory lock for governance concurrency serialization
      await tx.$executeRawUnsafe(`SELECT pg_advisory_xact_lock(${GOVERNANCE_ADVISORY_LOCK_KEY})`);

      // 2. Fetch target user and roles
      const target = await tx.user.findUnique({
        where: { id: parsed.userId },
        include: { roles: true },
      });

      if (!target) {
        throw new Error('NOT_FOUND: Hedef kullanıcı bulunamadı.');
      }

      if (target.status === 'SUSPENDED') {
        return; // Idempotent
      }

      // 3. Last SUPER_ADMIN Protection
      const isTargetActiveSuperAdmin =
        target.status === 'ACTIVE' &&
        target.roles.some((r) => r.role === 'SUPER_ADMIN');

      if (isTargetActiveSuperAdmin) {
        const activeSuperAdminCount = await tx.user.count({
          where: {
            status: 'ACTIVE',
            roles: { some: { role: 'SUPER_ADMIN' } },
          },
        });

        if (activeSuperAdminCount <= 1) {
          throw new Error(
            'LAST_SUPER_ADMIN_PROTECTION: Sistemde en az bir aktif Süper Yönetici bulunmalıdır. Son Süper Yönetici askıya alınamaz.'
          );
        }
      }

      // 4. Update status to SUSPENDED
      await tx.user.update({
        where: { id: parsed.userId },
        data: { status: 'SUSPENDED' },
      });

      // 5. Revoke all active sessions
      await tx.session.updateMany({
        where: { userId: parsed.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });

      // 6. Write atomic audit log
      await logAuthAuditEventTx(tx, {
        eventType: 'USER_SUSPENDED',
        userId: parsed.userId,
        actorUserId: actor.id,
        success: true,
        metadata: {
          previousStatus: target.status,
          reason: parsed.reason || null,
        },
      });
    });

    safeRevalidatePath('/admin/users');
    safeRevalidatePath(`/admin/users/${parsed.userId}`);
    safeRevalidatePath('/admin/audit');

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Kullanıcı askıya alınırken bir hata oluştu.',
    };
  }
}

/**
 * Reactivate suspended user with strict email verification preservation.
 * Verified -> ACTIVE, Unverified -> PENDING_VERIFICATION.
 */
export async function reactivateUserAction(input: {
  userId: string;
  reason?: string;
}): Promise<AdminActionResult> {
  try {
    const actor = await requirePermission('USER_MANAGE');
    const parsed = ReactivateUserSchema.parse(input);

    let restoredStatus = 'ACTIVE';

    await prisma.$transaction(async (tx) => {
      await tx.$executeRawUnsafe(`SELECT pg_advisory_xact_lock(${GOVERNANCE_ADVISORY_LOCK_KEY})`);

      const target = await tx.user.findUnique({
        where: { id: parsed.userId },
      });

      if (!target) {
        throw new Error('NOT_FOUND: Hedef kullanıcı bulunamadı.');
      }

      if (target.status !== 'SUSPENDED') {
        throw new Error(
          `INVALID_TRANSITION: Yalnızca askıya alınmış (SUSPENDED) kullanıcılar yeniden etkinleştirilebilir. Mevcut durum: ${target.status}`
        );
      }

      // Preserve email verification semantics
      restoredStatus = target.emailVerified !== null ? 'ACTIVE' : 'PENDING_VERIFICATION';

      await tx.user.update({
        where: { id: parsed.userId },
        data: { status: restoredStatus },
      });

      await logAuthAuditEventTx(tx, {
        eventType: 'USER_REACTIVATED',
        userId: parsed.userId,
        actorUserId: actor.id,
        success: true,
        metadata: {
          restoredStatus,
          isEmailVerified: target.emailVerified !== null,
          reason: parsed.reason || null,
        },
      });
    });

    safeRevalidatePath('/admin/users');
    safeRevalidatePath(`/admin/users/${parsed.userId}`);
    safeRevalidatePath('/admin/audit');

    return { success: true, data: { status: restoredStatus } };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Kullanıcı etkinleştirilirken bir hata oluştu.',
    };
  }
}

/**
 * Disable user permanently (destructive action) and revoke all sessions.
 */
export async function disableUserAction(input: {
  userId: string;
  reason?: string;
  confirmationText: string;
}): Promise<AdminActionResult> {
  try {
    const actor = await requirePermission('USER_MANAGE');
    const parsed = DisableUserSchema.parse(input);

    await prisma.$transaction(async (tx) => {
      await tx.$executeRawUnsafe(`SELECT pg_advisory_xact_lock(${GOVERNANCE_ADVISORY_LOCK_KEY})`);

      const target = await tx.user.findUnique({
        where: { id: parsed.userId },
        include: { roles: true },
      });

      if (!target) {
        throw new Error('NOT_FOUND: Hedef kullanıcı bulunamadı.');
      }

      // Check confirmation text
      const expectedText = target.emailNormalized || target.email || 'DEVRE DIŞI BIRAK';
      if (
        parsed.confirmationText !== 'DEVRE DIŞI BIRAK' &&
        parsed.confirmationText !== target.email &&
        parsed.confirmationText !== target.emailNormalized
      ) {
        throw new Error(
          `CONFIRMATION_MISMATCH: Onay metni eşleşmedi. Lütfen "${expectedText}" veya "DEVRE DIŞI BIRAK" yazarak onaylayın.`
        );
      }

      // Last SUPER_ADMIN Protection
      const isTargetActiveSuperAdmin =
        target.status === 'ACTIVE' &&
        target.roles.some((r) => r.role === 'SUPER_ADMIN');

      if (isTargetActiveSuperAdmin) {
        const activeSuperAdminCount = await tx.user.count({
          where: {
            status: 'ACTIVE',
            roles: { some: { role: 'SUPER_ADMIN' } },
          },
        });

        if (activeSuperAdminCount <= 1) {
          throw new Error(
            'LAST_SUPER_ADMIN_PROTECTION: Sistemde en az bir aktif Süper Yönetici bulunmalıdır. Son Süper Yönetici devre dışı bırakılamaz.'
          );
        }
      }

      // Update status to DISABLED
      await tx.user.update({
        where: { id: parsed.userId },
        data: { status: 'DISABLED' },
      });

      // Revoke all sessions
      await tx.session.updateMany({
        where: { userId: parsed.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });

      // Write atomic audit
      await logAuthAuditEventTx(tx, {
        eventType: 'USER_DISABLED',
        userId: parsed.userId,
        actorUserId: actor.id,
        success: true,
        metadata: {
          previousStatus: target.status,
          reason: parsed.reason || null,
        },
      });
    });

    safeRevalidatePath('/admin/users');
    safeRevalidatePath(`/admin/users/${parsed.userId}`);
    safeRevalidatePath('/admin/audit');

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Kullanıcı devre dışı bırakılırken bir hata oluştu.',
    };
  }
}

/**
 * Revoke all active sessions for a target user (Administrative Global Sign-out).
 * Requires USER_MANAGE permission.
 */
export async function revokeUserSessionsAction(input: {
  userId: string;
  reason?: string;
}): Promise<AdminActionResult> {
  try {
    const actor = await requirePermission('USER_MANAGE');
    const parsed = RevokeUserSessionsSchema.parse(input);

    await prisma.$transaction(async (tx) => {
      const target = await tx.user.findUnique({
        where: { id: parsed.userId },
      });

      if (!target) {
        throw new Error('NOT_FOUND: Hedef kullanıcı bulunamadı.');
      }

      const updateResult = await tx.session.updateMany({
        where: { userId: parsed.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });

      await logAuthAuditEventTx(tx, {
        eventType: 'USER_SESSIONS_REVOKED',
        userId: parsed.userId,
        actorUserId: actor.id,
        success: true,
        metadata: {
          revokedCount: updateResult.count,
          reason: parsed.reason || null,
        },
      });
    });

    safeRevalidatePath(`/admin/users/${parsed.userId}`);
    safeRevalidatePath('/admin/audit');

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Kullanıcı oturumları kapatılırken bir hata oluştu.',
    };
  }
}
