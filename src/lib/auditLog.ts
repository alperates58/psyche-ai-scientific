import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { prisma } from './prisma';

export type AuthEventType =
  | 'REGISTER_ATTEMPT'
  | 'REGISTER_SUCCESS'
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILURE'
  | 'LOGOUT'
  | 'PASSWORD_RESET_REQUEST'
  | 'PASSWORD_RESET_SUCCESS'
  | 'EMAIL_VERIFICATION_SUCCESS'
  | 'GOOGLE_LOGIN_SUCCESS'
  | 'ROLE_GRANTED'
  | 'ROLE_REVOKED'
  | 'ACCOUNT_SUSPENDED'
  | 'ALL_SESSIONS_REVOKED'
  | 'USER_SUSPENDED'
  | 'USER_REACTIVATED'
  | 'USER_DISABLED'
  | 'USER_SESSIONS_REVOKED'
  | 'ADMIN_SECURITY_ALERT';

const IP_HASH_SALT = process.env.AUTH_RATE_LIMIT_SECRET || process.env.AUTH_SECRET || 'psyche_default_ip_anonymizer_salt';

/**
 * Anonymizes an IP address using HMAC-SHA256. Raw IP is never stored.
 */
export function hashIp(ip?: string | null): string | null {
  if (!ip || ip.trim() === '') return null;
  return crypto.createHmac('sha256', IP_HASH_SALT).update(ip.trim()).digest('hex').substring(0, 32);
}

const FORBIDDEN_METADATA_PATTERNS = [
  'password',
  'token',
  'secret',
  'cookie',
  'authorization',
  'hash',
  'derivedkey',
];

/**
 * Strips all sensitive credentials, passwords, and raw tokens from metadata before logging.
 */
export function sanitizeAuditMetadata(metadata?: Record<string, any> | null): Record<string, any> | undefined {
  if (!metadata || typeof metadata !== 'object') return undefined;

  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(metadata)) {
    const lowerKey = key.toLowerCase().replace(/[^a-z]/g, '');
    const isForbidden = FORBIDDEN_METADATA_PATTERNS.some((pattern) => lowerKey.includes(pattern));

    if (isForbidden) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeAuditMetadata(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

export interface LogAuthAuditParams {
  eventType: AuthEventType;
  userId?: string | null;
  actorUserId?: string | null;
  success: boolean;
  ip?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, any> | null;
}

/**
 * Immutable audit logger within a transaction client.
 * Fails the transaction if audit log insertion fails.
 */
export async function logAuthAuditEventTx(
  tx: Prisma.TransactionClient,
  params: LogAuthAuditParams
): Promise<void> {
  const ipHash = hashIp(params.ip);
  const sanitizedMetadata = sanitizeAuditMetadata(params.metadata);

  await tx.authAuditEvent.create({
    data: {
      eventType: params.eventType,
      userId: params.userId || null,
      actorUserId: params.actorUserId || null,
      success: params.success,
      ipHash,
      userAgent: params.userAgent ? params.userAgent.substring(0, 500) : null,
      metadata: sanitizedMetadata ? (sanitizedMetadata as any) : undefined,
    },
  });
}

/**
 * Immutable audit logger. Creates records only; no update or delete operations.
 */
export async function logAuthAuditEvent(params: LogAuthAuditParams): Promise<void> {
  try {
    const ipHash = hashIp(params.ip);
    const sanitizedMetadata = sanitizeAuditMetadata(params.metadata);

    await prisma.authAuditEvent.create({
      data: {
        eventType: params.eventType,
        userId: params.userId || null,
        actorUserId: params.actorUserId || null,
        success: params.success,
        ipHash,
        userAgent: params.userAgent ? params.userAgent.substring(0, 500) : null,
        metadata: sanitizedMetadata ? (sanitizedMetadata as any) : undefined,
      },
    });
  } catch (error) {
    // Audit logging failure outside transaction must not crash, but logs to stderr
    console.error('Failed to record auth audit event:', error);
  }
}
