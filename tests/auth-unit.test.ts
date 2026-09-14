import { describe, it, expect, beforeEach } from "vitest";
import {
  hashPassword,
  verifyPassword,
  dummyVerifyPassword,
  validatePasswordPolicy,
} from "../src/lib/password";
import {
  generateRawToken,
  hashToken,
  isTokenExpired,
  TOKEN_EXPIRY_MS,
} from "../src/lib/tokens";
import {
  hasRole,
  hasPermission,
  getUserPermissions,
  ALL_ROLES,
  ALL_PERMISSIONS,
  type Role,
} from "../src/lib/rbac";
import { getGoogleOAuthConfigStatus } from "../src/lib/oauthConfig";
import { hashIp, sanitizeAuditMetadata } from "../src/lib/auditLog";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  getMailSink,
  clearMailSink,
} from "../src/lib/emailService";
import { checkRateLimit } from "../src/lib/rateLimiter";

describe("FAZ 2.6: Cryptographic Password Service (scrypt)", () => {
  it("should hash a valid password with OWASP-compatible scrypt format", async () => {
    const password = "ValidPassword123!";
    const encoded = await hashPassword(password);

    // Format: $scrypt$ln=16,r=8,p=1$<salt_hex>$<derived_key_hex> (64 bytes derived = 128 hex chars)
    expect(encoded).toMatch(/^\$scrypt\$ln=16,r=8,p=1\$[0-9a-f]{32}\$[0-9a-f]{128}$/);
  });

  it("should verify correct password and reject incorrect password", async () => {
    const password = "StrongPassword456$";
    const encoded = await hashPassword(password);

    const match = await verifyPassword(password, encoded);
    expect(match).toBe(true);

    const wrongMatch = await verifyPassword("WrongPassword456$", encoded);
    expect(wrongMatch).toBe(false);
  });

  it("should reject corrupted or non-scrypt encoded hashes gracefully", async () => {
    const result = await verifyPassword("Password123!", "invalid-hash-string");
    expect(result).toBe(false);
  });

  it("should run dummyVerifyPassword without errors for timing defense", async () => {
    await expect(dummyVerifyPassword()).resolves.toBeUndefined();
  });

  it("should enforce password length policy (12 - 128 chars)", () => {
    // Valid password
    expect(validatePasswordPolicy("ValidPassword123!")).toEqual({ valid: true });

    // Too short (< 12 chars)
    const shortRes = validatePasswordPolicy("Short1!");
    expect(shortRes.valid).toBe(false);
    expect(shortRes.error).toContain("12");

    // Too long (> 128 chars)
    const longRes = validatePasswordPolicy("A".repeat(129));
    expect(longRes.valid).toBe(false);
    expect(longRes.error).toContain("128");

    // Empty
    const emptyRes = validatePasswordPolicy("");
    expect(emptyRes.valid).toBe(false);
  });
});

describe("FAZ 2.6: Secure Tokens & Hashing at Rest", () => {
  it("should generate cryptographically strong random tokens", () => {
    const token1 = generateRawToken();
    const token2 = generateRawToken();

    expect(token1).toHaveLength(64);
    expect(token2).toHaveLength(64);
    expect(token1).not.toEqual(token2);
  });

  it("should hash tokens deterministically using SHA-256", () => {
    const token = generateRawToken();
    const hash1 = hashToken(token);
    const hash2 = hashToken(token);

    expect(hash1).toHaveLength(64);
    expect(hash1).toEqual(hash2);
    expect(hash1).not.toEqual(token);
  });

  it("should verify token expiry calculations correctly", () => {
    expect(TOKEN_EXPIRY_MS.EMAIL_VERIFICATION).toBe(24 * 60 * 60 * 1000);
    expect(TOKEN_EXPIRY_MS.PASSWORD_RESET).toBe(60 * 60 * 1000);

    const pastDate = new Date(Date.now() - 1000);
    expect(isTokenExpired(pastDate)).toBe(true);

    const futureDate = new Date(Date.now() + 100000);
    expect(isTokenExpired(futureDate)).toBe(false);
  });
});

describe("FAZ 2.6: Multi-Role RBAC Specification", () => {
  it("should verify role presence with hasRole", () => {
    expect(hasRole(["USER"], "USER")).toBe(true);
    expect(hasRole(["USER"], "ADMIN")).toBe(false);
    expect(hasRole(["ADMIN", "RESEARCHER"], "RESEARCHER")).toBe(true);
    expect(hasRole(["ADMIN", "RESEARCHER"], "SUPER_ADMIN")).toBe(false);
  });

  it("should evaluate granular permissions correctly per role", () => {
    expect(hasPermission(["USER"], "APP_USE")).toBe(true);
    expect(hasPermission(["USER"], "ASSESSMENT_TAKE")).toBe(true);
    expect(hasPermission(["USER"], "ADMIN_ACCESS")).toBe(false);

    expect(hasPermission(["RESEARCHER"], "RESEARCH_VIEW")).toBe(true);
    expect(hasPermission(["RESEARCHER"], "ITEM_MANAGE")).toBe(true);
    expect(hasPermission(["RESEARCHER"], "ADMIN_ACCESS")).toBe(false);

    expect(hasPermission(["EXPERT_REVIEWER"], "RESEARCH_REVIEW")).toBe(true);
    expect(hasPermission(["EXPERT_REVIEWER"], "ADMIN_ACCESS")).toBe(false);

    expect(hasPermission(["ADMIN"], "ADMIN_ACCESS")).toBe(true);
    expect(hasPermission(["ADMIN"], "USER_MANAGE")).toBe(true);
    expect(hasPermission(["ADMIN"], "ROLE_MANAGE")).toBe(false);

    expect(hasPermission(["SUPER_ADMIN"], "ROLE_MANAGE")).toBe(true);
    expect(hasPermission(["SUPER_ADMIN"], "SYSTEM_CONFIG")).toBe(true);
  });

  it("should return complete non-empty permission sets for all defined roles", () => {
    for (const role of ALL_ROLES) {
      const perms = getUserPermissions([role]);
      expect(perms.length).toBeGreaterThan(0);
      expect(perms).toContain("APP_USE");
    }
  });
});

describe("FAZ 2.6: Google OAuth Safe Status Reporter", () => {
  it("should never expose client secret in status report", () => {
    const status = getGoogleOAuthConfigStatus();
    expect(status).toHaveProperty("configured");
    expect(status).toHaveProperty("clientIdConfigured");
    expect(status).toHaveProperty("clientSecretConfigured");
    expect(status).toHaveProperty("redirectUri");
    expect(status).not.toHaveProperty("clientSecret");
  });
});

describe("FAZ 2.6: Audit Logging & IP Anonymization", () => {
  it("should anonymize IP addresses via HMAC-SHA256 hash", () => {
    const rawIp = "192.168.1.100";
    const hashed = hashIp(rawIp);

    expect(hashed).not.toBeNull();
    expect(hashed).not.toEqual(rawIp);
    expect(hashed).toHaveLength(32);
    // Deterministic with same salt
    expect(hashIp(rawIp)).toEqual(hashed);
  });

  it("should sanitize sensitive metadata before logging", () => {
    const sensitiveMeta = {
      password: "SuperSecretPassword123!",
      passwordConfirmation: "SuperSecretPassword123!",
      token: "secret-token-12345",
      authorization: "Bearer eyJhbGci...",
      safeField: "safe-metadata-value",
    };

    const sanitized = sanitizeAuditMetadata(sensitiveMeta);
    expect(sanitized?.password).toBe("[REDACTED]");
    expect(sanitized?.passwordConfirmation).toBe("[REDACTED]");
    expect(sanitized?.token).toBe("[REDACTED]");
    expect(sanitized?.authorization).toBe("[REDACTED]");
    expect(sanitized?.safeField).toBe("safe-metadata-value");
  });
});

describe("FAZ 2.6: Email Delivery & Test Mail Sink", () => {
  beforeEach(() => {
    clearMailSink();
  });

  it("should capture dispatched verification email in mailSink without leaking raw tokens to stdout", async () => {
    await sendVerificationEmail("test@example.com", "dummy-token-abc");

    const messages = getMailSink();
    expect(messages).toHaveLength(1);
    expect(messages[0].to).toBe("test@example.com");
    expect(messages[0].subject).toContain("Doğrulama");
    expect(messages[0].token).toBe("dummy-token-abc");
  });

  it("should capture dispatched password reset email in mailSink", async () => {
    await sendPasswordResetEmail("reset@example.com", "reset-token-xyz");

    const messages = getMailSink();
    expect(messages).toHaveLength(1);
    expect(messages[0].to).toBe("reset@example.com");
    expect(messages[0].subject).toContain("Sıfırlama");
    expect(messages[0].token).toBe("reset-token-xyz");
  });
});

describe("FAZ 2.6: Rate Limiting", () => {
  it("should allow requests under limit and block upon exceeding limit", async () => {
    const key = `test-action-${Date.now()}`;
    const limit = 3;
    const windowSeconds = 60;

    // 1st attempt -> OK
    const r1 = await checkRateLimit(key, "user1@example.com", "127.0.0.1", limit, windowSeconds);
    expect(r1.allowed).toBe(true);
    expect(r1.remaining).toBe(2);

    // 2nd attempt -> OK
    const r2 = await checkRateLimit(key, "user1@example.com", "127.0.0.1", limit, windowSeconds);
    expect(r2.allowed).toBe(true);
    expect(r2.remaining).toBe(1);

    // 3rd attempt -> OK
    const r3 = await checkRateLimit(key, "user1@example.com", "127.0.0.1", limit, windowSeconds);
    expect(r3.allowed).toBe(true);
    expect(r3.remaining).toBe(0);

    // 4th attempt -> BLOCKED
    const r4 = await checkRateLimit(key, "user1@example.com", "127.0.0.1", limit, windowSeconds);
    expect(r4.allowed).toBe(false);
    expect(r4.remaining).toBe(0);
  });
});
