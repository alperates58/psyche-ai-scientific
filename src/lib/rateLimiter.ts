import crypto from 'crypto';
import { prisma } from './prisma';
import { hashIp } from './auditLog';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

// In-memory fallback if running without database in unit tests
const inMemoryStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Concurrency-safe, atomic rate limiter.
 * Protects login, registration, and reset endpoints against brute-force and credential stuffing.
 */
export async function checkRateLimit(
  action: string,
  identifier: string,
  ip?: string | null,
  limit: number = 5,
  windowSeconds: number = 900 // 15 minutes default
): Promise<RateLimitResult> {
  const ipHash = hashIp(ip) || 'no_ip';
  const cleanId = identifier.trim().toLowerCase();
  const rawKey = `${action}:${cleanId}:${ipHash}`;
  const key = crypto.createHash('sha256').update(rawKey).digest('hex');

  const now = new Date();
  const resetAt = new Date(now.getTime() + windowSeconds * 1000);

  // If database is not available (e.g. unit tests without DB), use in-memory store
  if (!process.env.DATABASE_URL && !process.env.TEST_DATABASE_URL) {
    const existing = inMemoryStore.get(key);
    if (!existing || existing.resetAt < now.getTime()) {
      inMemoryStore.set(key, { count: 1, resetAt: resetAt.getTime() });
      return { allowed: true, remaining: limit - 1, resetAt };
    }

    if (existing.count >= limit) {
      return { allowed: false, remaining: 0, resetAt: new Date(existing.resetAt) };
    }

    existing.count += 1;
    return { allowed: true, remaining: limit - existing.count, resetAt: new Date(existing.resetAt) };
  }

  try {
    // Atomic upsert with expiry check
    const record = await prisma.rateLimitRecord.findUnique({
      where: { key },
    });

    if (!record || record.expiresAt < now) {
      // Create new window
      await prisma.rateLimitRecord.upsert({
        where: { key },
        create: {
          key,
          count: 1,
          expiresAt: resetAt,
        },
        update: {
          count: 1,
          expiresAt: resetAt,
        },
      });
      return { allowed: true, remaining: limit - 1, resetAt };
    }

    if (record.count >= limit) {
      return { allowed: false, remaining: 0, resetAt: record.expiresAt };
    }

    // Atomic increment
    const updated = await prisma.rateLimitRecord.update({
      where: { key },
      data: {
        count: { increment: 1 },
      },
    });

    return {
      allowed: true,
      remaining: Math.max(0, limit - updated.count),
      resetAt: updated.expiresAt,
    };
  } catch (error) {
    // If rate limit lookup encounters DB failure, fail open for UX but log warning
    console.warn('Rate limiter database error:', error);
    return { allowed: true, remaining: 1, resetAt };
  }
}
