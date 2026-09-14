import crypto from 'crypto';
import { prisma } from './prisma';
import { hashIp } from './auditLog';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

// In-memory fallback ONLY for isolated unit tests without database in test/dev environments
const inMemoryStore = new Map<string, { count: number; resetAt: number }>();

export function extractClientIp(
  headersObj?: Headers | Record<string, string | string[] | undefined> | null
): string | null {
  if (!headersObj) return null;

  let forwarded: string | undefined;
  let realIp: string | undefined;

  if (typeof (headersObj as any).get === 'function') {
    forwarded = (headersObj as Headers).get('x-forwarded-for') || undefined;
    realIp = (headersObj as Headers).get('x-real-ip') || undefined;
  } else {
    const raw = headersObj as Record<string, string | string[] | undefined>;
    const f = raw['x-forwarded-for'];
    forwarded = Array.isArray(f) ? f[0] : f;
    const r = raw['x-real-ip'];
    realIp = Array.isArray(r) ? r[0] : r;
  }

  if (forwarded) {
    const clientIp = forwarded.split(',')[0].trim();
    if (clientIp) return clientIp;
  }

  if (realIp) {
    return realIp.trim();
  }

  return null;
}

/**
 * Checks a single rate limit key atomically in PostgreSQL.
 * Uses a single-statement INSERT ... ON CONFLICT DO UPDATE to ensure race-free evaluation.
 */
async function checkSingleAtomicLimit(
  rawKey: string,
  limit: number,
  windowSeconds: number,
  isSecurityCritical: boolean = true
): Promise<RateLimitResult> {
  const key = crypto.createHash('sha256').update(rawKey).digest('hex');
  const now = new Date();
  const resetAt = new Date(now.getTime() + windowSeconds * 1000);

  const hasDb = Boolean(process.env.DATABASE_URL || process.env.TEST_DATABASE_URL);

  // In-memory fallback STRICTLY permitted only in test or development when DB is not configured
  if (!hasDb) {
    if (process.env.NODE_ENV === 'production') {
      console.error('CRITICAL: Rate limiter missing database configuration in production environment.');
      return { allowed: false, remaining: 0, resetAt };
    }

    const existing = inMemoryStore.get(key);
    if (!existing || existing.resetAt < now.getTime()) {
      inMemoryStore.set(key, { count: 1, resetAt: resetAt.getTime() });
      return { allowed: true, remaining: limit - 1, resetAt };
    }

    if (existing.count >= limit) {
      return { allowed: false, remaining: 0, resetAt: new Date(existing.resetAt) };
    }

    existing.count += 1;
    return {
      allowed: true,
      remaining: Math.max(0, limit - existing.count),
      resetAt: new Date(existing.resetAt),
    };
  }

  try {
    const recordId = crypto.randomUUID();

    // Single-statement atomic PostgreSQL upsert:
    // Handles window expiry reset, counter increment, and returns updated count atomically.
    const rows = await prisma.$queryRaw<Array<{ count: number; expiresAt: Date }>>`
      INSERT INTO "rate_limit_records" ("id", "key", "count", "expiresAt", "updatedAt")
      VALUES (${recordId}, ${key}, 1, ${resetAt}, NOW())
      ON CONFLICT ("key") DO UPDATE
      SET
        "count" = CASE
          WHEN "rate_limit_records"."expiresAt" < NOW() THEN 1
          ELSE "rate_limit_records"."count" + 1
        END,
        "expiresAt" = CASE
          WHEN "rate_limit_records"."expiresAt" < NOW() THEN ${resetAt}
          ELSE "rate_limit_records"."expiresAt"
        END,
        "updatedAt" = NOW()
      RETURNING "count", "expiresAt";
    `;

    if (!rows || rows.length === 0) {
      throw new Error('Atomic rate limit query returned zero rows.');
    }

    const currentCount = Number(rows[0].count);
    const rowExpiresAt = new Date(rows[0].expiresAt);

    if (currentCount > limit) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: rowExpiresAt,
      };
    }

    return {
      allowed: true,
      remaining: Math.max(0, limit - currentCount),
      resetAt: rowExpiresAt,
    };
  } catch (error) {
    console.error('Rate limiter database error:', error);
    // For security-critical endpoints (login, register, forgot-password), FAIL CLOSED
    // to prevent unlimited brute-force attacks during database errors or saturation.
    if (isSecurityCritical) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: new Date(Date.now() + 60 * 1000), // 1-minute backoff
      };
    }

    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(Date.now() + 60 * 1000),
    };
  }
}

/**
 * Concurrency-safe, atomic multi-dimensional rate limiter.
 * Independently enforces:
 * - Account limit (e.g. 5 attempts / 15 min per account)
 * - IP limit (e.g. 20 attempts / 15 min per IP) when IP is provided
 */
export async function checkRateLimit(
  action: string,
  identifier: string,
  ip?: string | null,
  limit: number = 5,
  windowSeconds: number = 900,
  ipLimit: number = 20
): Promise<RateLimitResult> {
  const isSecurityCritical = ['login', 'register', 'forgot_password', 'resend_verification'].includes(action);

  // 1. IP Dimension (if real client IP is provided)
  let ipResult: RateLimitResult | null = null;
  if (ip && ip.trim()) {
    const ipHash = hashIp(ip.trim());
    if (ipHash) {
      ipResult = await checkSingleAtomicLimit(
        `${action}:ip:${ipHash}`,
        ipLimit,
        windowSeconds,
        isSecurityCritical
      );

      if (!ipResult.allowed) {
        return ipResult;
      }
    }
  }

  // 2. Account / Identifier Dimension
  const cleanId = identifier.trim().toLowerCase();
  const accountResult = await checkSingleAtomicLimit(
    `${action}:account:${cleanId}`,
    limit,
    windowSeconds,
    isSecurityCritical
  );

  if (!accountResult.allowed) {
    return accountResult;
  }

  const remaining = ipResult ? Math.min(accountResult.remaining, ipResult.remaining) : accountResult.remaining;
  const resetAt = ipResult && ipResult.resetAt < accountResult.resetAt ? ipResult.resetAt : accountResult.resetAt;

  return {
    allowed: true,
    remaining,
    resetAt,
  };
}
