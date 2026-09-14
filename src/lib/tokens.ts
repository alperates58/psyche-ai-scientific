import crypto from 'crypto';

/**
 * Generates a high-entropy random token (256-bit / 64-hex string).
 */
export function generateRawToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Computes deterministic SHA-256 hash of a raw token for secure storage at rest.
 * Prevents token extraction in case of database leakage.
 */
export function hashToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

/**
 * Default validity periods for security tokens.
 */
export const TOKEN_EXPIRY_MS = {
  EMAIL_VERIFICATION: 24 * 60 * 60 * 1000, // 24 hours
  PASSWORD_RESET: 60 * 60 * 1000,          // 1 hour
};

export function isTokenExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}
