import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  timingSafeEqual,
  deriveSessionToken,
  validateResearchAccess,
  RESEARCH_COOKIE_NAME
} from '@/lib/researchAuth';

describe('Research Portal Security & Token Derivation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Constant-time String Comparison (timingSafeEqual)', () => {
    it('returns true for matching strings', () => {
      expect(timingSafeEqual('valid-secret-key-123', 'valid-secret-key-123')).toBe(true);
    });

    it('returns false for different strings of same length', () => {
      expect(timingSafeEqual('valid-secret-key-123', 'valid-secret-key-124')).toBe(false);
    });

    it('returns false for strings of different length', () => {
      expect(timingSafeEqual('short', 'longer-string')).toBe(false);
    });

    it('handles non-string arguments safely', () => {
      expect(timingSafeEqual(null as any, 'string')).toBe(false);
      expect(timingSafeEqual(undefined as any, 'string')).toBe(false);
    });
  });

  describe('Derived Session Token Security', () => {
    it('generates a 64-character SHA256 hex string', async () => {
      const token = await deriveSessionToken('test-secret-key');
      expect(token).toHaveLength(64);
      expect(/^[0-9a-f]{64}$/.test(token)).toBe(true);
    });

    it('produces identical tokens for the same key (deterministic)', async () => {
      const tokenA = await deriveSessionToken('sample-key');
      const tokenB = await deriveSessionToken('sample-key');
      expect(tokenA).toBe(tokenB);
    });

    it('invalidates tokens automatically when the key is rotated', async () => {
      const tokenV1 = await deriveSessionToken('initial-key');
      const tokenV2 = await deriveSessionToken('rotated-key');
      expect(tokenV1).not.toBe(tokenV2);
    });

    it('does not leak the raw key inside the derived token', async () => {
      const rawKey = 'super-secret-key-xyz';
      const token = await deriveSessionToken(rawKey);
      expect(token.includes(rawKey)).toBe(false);
    });
  });

  describe('Production Safe-by-Default Access Control', () => {
    it('strictly denies all access in production when RESEARCH_ACCESS_KEY is unconfigured', async () => {
      process.env.NODE_ENV = 'production';
      delete process.env.RESEARCH_ACCESS_KEY;

      const headers = new Headers();
      const cookies = { get: () => undefined };

      const result = await validateResearchAccess(headers, cookies);
      expect(result.authorized).toBe(false);
      expect(result.reason).toBe('unconfigured');
    });

    it('rejects unauthorized requests in production when key is set', async () => {
      process.env.NODE_ENV = 'production';
      process.env.RESEARCH_ACCESS_KEY = 'valid-test-key-2026';

      const headers = new Headers();
      const cookies = { get: () => undefined };

      const result = await validateResearchAccess(headers, cookies);
      expect(result.authorized).toBe(false);
      expect(result.reason).toBe('unauthorized');
    });

    it('accepts valid Authorization: Bearer <key> in production', async () => {
      process.env.NODE_ENV = 'production';
      process.env.RESEARCH_ACCESS_KEY = 'valid-test-key-2026';

      const headers = new Headers({
        authorization: 'Bearer valid-test-key-2026'
      });
      const cookies = { get: () => undefined };

      const result = await validateResearchAccess(headers, cookies);
      expect(result.authorized).toBe(true);
    });

    it('rejects invalid Bearer token in production', async () => {
      process.env.NODE_ENV = 'production';
      process.env.RESEARCH_ACCESS_KEY = 'valid-test-key-2026';

      const headers = new Headers({
        authorization: 'Bearer wrong-test-key-9999'
      });
      const cookies = { get: () => undefined };

      const result = await validateResearchAccess(headers, cookies);
      expect(result.authorized).toBe(false);
    });

    it('accepts valid derived session cookie in production', async () => {
      const activeKey = 'valid-test-key-2026';
      process.env.NODE_ENV = 'production';
      process.env.RESEARCH_ACCESS_KEY = activeKey;

      const sessionToken = await deriveSessionToken(activeKey);
      const headers = new Headers();
      const cookies = {
        get: (name: string) =>
          name === RESEARCH_COOKIE_NAME ? { value: sessionToken } : undefined
      };

      const result = await validateResearchAccess(headers, cookies);
      expect(result.authorized).toBe(true);
    });

    it('rejects raw access key when passed as cookie (must be derived token)', async () => {
      const activeKey = 'valid-test-key-2026';
      process.env.NODE_ENV = 'production';
      process.env.RESEARCH_ACCESS_KEY = activeKey;

      const headers = new Headers();
      // An attacker or erroneous client sending the raw key directly in cookie
      const cookies = {
        get: (name: string) =>
          name === RESEARCH_COOKIE_NAME ? { value: activeKey } : undefined
      };

      const result = await validateResearchAccess(headers, cookies);
      expect(result.authorized).toBe(false);
    });

    it('allows frictionless local workflow in development when key is unconfigured', async () => {
      process.env.NODE_ENV = 'development';
      delete process.env.RESEARCH_ACCESS_KEY;

      const headers = new Headers();
      const cookies = { get: () => undefined };

      const result = await validateResearchAccess(headers, cookies);
      expect(result.authorized).toBe(true);
      expect(result.reason).toBe('dev_allowed');
    });
  });
});
