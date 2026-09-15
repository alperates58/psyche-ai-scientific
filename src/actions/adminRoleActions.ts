'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/auth';
import { Role, ALL_ROLES } from '@/lib/rbac';
import { logAuthAuditEventTx } from '@/lib/auditLog';

const GOVERNANCE_ADVISORY_LOCK_KEY = '7492019827364512';

interface AdminActionResult {
  success: boolean;
  error?: string;
  data?: any;
}

function safeRevalidatePath(path: string) {
  try {
    revalidatePath(path);
  } catch {}
}

const GrantRoleSchema = z.object({
  userId: z.string().min(1, 'Kullanıcı ID zorunludur'),
  role: z.enum(ALL_ROLES as [Role, ...Role[]]),
});

const RevokeRoleSchema = z.object({
  userId: z.string().min(1, 'Kullanıcı ID zorunludur'),
  role: z.enum(ALL_ROLES as [Role, ...Role[]]),
  confirmSelfDemotion: z.boolean().optional(),
});

/**
 * Grant a role to a target user.
 * Requires ROLE_MANAGE permission (SUPER_ADMIN only).
 * Role changes never mutate account lifecycle status.
 * Granting roles to DISABLED accounts is rejected.
 */
export async function grantUserRoleAction(input: {
  userId: string;
  role: Role;
}): Promise<AdminActionResult> {
  try {
    const actor = await requirePermission('ROLE_MANAGE');
    const parsed = GrantRoleSchema.parse(input);

    await prisma.$transaction(async (tx) => {
      await tx.$executeRawUnsafe(`SELECT pg_advisory_xact_lock(${GOVERNANCE_ADVISORY_LOCK_KEY})`);

      const target = await tx.user.findUnique({
        where: { id: parsed.userId },
        include: { roles: true },
      });

      if (!target) {
        throw new Error('NOT_FOUND: Hedef kullanıcı bulunamadı.');
      }

      if (target.status === 'DISABLED') {
        throw new Error('INVALID_TARGET_STATE: Devre dışı bırakılmış (DISABLED) hesaplara rol atanamaz.');
      }

      const hasRoleAlready = target.roles.some((r) => r.role === parsed.role);
      if (hasRoleAlready) {
        return; // Idempotent
      }

      await tx.userRole.create({
        data: {
          userId: parsed.userId,
          role: parsed.role,
          grantedBy: actor.id,
        },
      });

      await logAuthAuditEventTx(tx, {
        eventType: 'ROLE_GRANTED',
        userId: parsed.userId,
        actorUserId: actor.id,
        success: true,
        metadata: {
          grantedRole: parsed.role,
          targetStatus: target.status,
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
      error: error.message || 'Rol atanırken bir hata oluştu.',
    };
  }
}

/**
 * Revoke a role from a target user.
 * Requires ROLE_MANAGE permission (SUPER_ADMIN only).
 * Protected by PostgreSQL advisory lock, Last Super Admin guard, and self-demotion verification.
 */
export async function revokeUserRoleAction(input: {
  userId: string;
  role: Role;
  confirmSelfDemotion?: boolean;
}): Promise<AdminActionResult> {
  try {
    const actor = await requirePermission('ROLE_MANAGE');
    const parsed = RevokeRoleSchema.parse(input);

    await prisma.$transaction(async (tx) => {
      await tx.$executeRawUnsafe(`SELECT pg_advisory_xact_lock(${GOVERNANCE_ADVISORY_LOCK_KEY})`);

      const target = await tx.user.findUnique({
        where: { id: parsed.userId },
        include: { roles: true },
      });

      if (!target) {
        throw new Error('NOT_FOUND: Hedef kullanıcı bulunamadı.');
      }

      const existingRole = target.roles.find((r) => r.role === parsed.role);
      if (!existingRole) {
        return; // Idempotent
      }

      // Last SUPER_ADMIN Protection
      if (parsed.role === 'SUPER_ADMIN') {
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
              'LAST_SUPER_ADMIN_PROTECTION: Sistemde en az bir aktif Süper Yönetici bulunmalıdır. Son Süper Yönetici rolü kaldırılamaz.'
            );
          }
        }

        // Self-demotion confirmation check
        if (actor.id === parsed.userId && !parsed.confirmSelfDemotion) {
          throw new Error(
            'SELF_DEMOTION_CONFIRM_REQUIRED: Kendi Süper Yönetici yetkinizi kaldırmak üzeresiniz. Lütfen işlemi açıkça onaylayın.'
          );
        }
      }

      await tx.userRole.delete({
        where: {
          id: existingRole.id,
        },
      });

      await logAuthAuditEventTx(tx, {
        eventType: 'ROLE_REVOKED',
        userId: parsed.userId,
        actorUserId: actor.id,
        success: true,
        metadata: {
          revokedRole: parsed.role,
          targetStatus: target.status,
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
      error: error.message || 'Rol kaldırılırken bir hata oluştu.',
    };
  }
}
