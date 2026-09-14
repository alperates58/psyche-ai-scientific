# PsycheAI Architecture: Authentication, Identity & RBAC Foundation (FAZ 2.6)

This document defines the technical architecture, security mechanisms, session model, role-based access control (RBAC), and migration specifications introduced in **FAZ 2.6**.

---

## 1. Architectural Overview & Security Objectives

PsycheAI transitions from a demo-user bootstrap identity model to an enterprise-grade, privacy-first authentication and authorization infrastructure:
- **Authentication Framework:** Auth.js v5 (NextAuth v5 beta) with Edge-compatible routing and Node.js backend provider validation.
- **Identity Providers:**
  - **Credentials:** Email + password with asynchronous Node.js built-in `crypto.scrypt` hashing.
  - **Google OAuth 2.0:** Standard OpenID Connect flow with strict account hijacking prevention (`allowDangerousEmailAccountLinking: false`).
- **Session Architecture:** Encrypted JWT tokens in HTTP-only `Secure` cookies paired with a server-side **revocation and liveness registry** (`auth_sessions`).
- **Multi-Role RBAC:** Discrete roles (`USER`, `EXPERT_REVIEWER`, `RESEARCHER`, `ADMIN`, `SUPER_ADMIN`) with granular permissions.
- **Privacy & Anonymization:** Zero raw IP storage (HMAC-SHA256 hashed with rotating salt), sanitization of metadata, and strict email normalization (`example.user+tag@gmail.com` -> `exampleuser@gmail.com`).
- **Psychometric Data Isolation:** Strict server-side ownership enforcement; users can only access their own assessments, profiles, and responses. Unverified credentials accounts (`PENDING_VERIFICATION`) are blocked from accessing assessment runtimes and psychological profiles.

---

## 2. Cryptographic Standards & Password Hashing

### 2.1 Password Hashing Specification
- **Algorithm:** Node.js native `crypto.scrypt` (asynchronous).
- **OWASP Compatible Parameters:**
  - Cost factor $N = 65536$ ($2^{16}$)
  - Block size $r = 8$
  - Parallelization $p = 1$
  - Key length = $32$ bytes (256 bits)
  - Max memory = $128$ MB (`maxmem: 128 * 1024 * 1024`)
- **Salt:** Cryptographically random $\ge 16$ bytes generated via `crypto.randomBytes(16)`.
- **Encoded Storage Format:**
  `$scrypt$ln=16,r=8,p=1$<salt_hex>$<derived_key_hex>`
- **Constant-Time Verification:** Verification utilizes `crypto.timingSafeEqual` to eliminate timing side-channels.
- **Timing Defense:** When a user is not found during login, `dummyVerifyPassword()` runs a dummy scrypt computation to prevent user enumeration via timing differentials.
- **Upgrade Path:** The modular design in `src/lib/password.ts` supports future transparent algorithm upgrades (e.g. Argon2id) without modifying business logic.

### 2.2 Password Policy
- Minimum 12 characters, maximum 128 characters.
- Requires at least 1 uppercase letter, 1 lowercase letter, and 1 digit or symbol.
- Disallows common trivial sequences.

---

## 3. Session Management & Server-Side Revocation Registry

Auth.js credentials authentication requires `session.strategy = "jwt"`. To guarantee immediate server-side revocation capability (e.g. password resets, security breaches, admin suspensions), PsycheAI uses a hybrid session model:

1. **Client/Cookie Layer:** Auth.js encrypted JWT cookie containing user claims and a unique session ID (`sid`).
2. **Server-Side Registry (`auth_sessions`):**
   - Each login generates a unique `sessionToken` (`sid`) recorded in `auth_sessions`.
   - Fields: `id`, `sessionToken`, `userId`, `expires`, `revokedAt`, `ipHash`, `userAgent`.
3. **Liveness & Revocation Check (`requireUser` / `getCurrentSession`):**
   - On every protected server request, the session's `sid` is validated against `auth_sessions`.
   - If `revokedAt` is not null or the record is missing/expired, the session is immediately invalidated.
   - If the user's status in `users` is `SUSPENDED` or `DISABLED`, access is instantly blocked.
4. **All-Device Revocation:**
   - When a user resets their password, `revokeAllSessions(userId)` marks all active sessions for that user as revoked (`revokedAt = NOW()`).

---

## 4. Multi-Role RBAC Specification

### 4.1 Roles Hierarchy & Permissions
PsycheAI implements 5 distinct roles:

| Role | Description | Permissions |
|---|---|---|
| `USER` | Standard end-user taking assessments | `APP_USE`, `PROFILE_VIEW_SELF`, `ASSESSMENT_TAKE` |
| `EXPERT_REVIEWER` | Domain psychologist / psychometric validator | `USER` permissions + `RESEARCH_VIEW`, `RESEARCH_REVIEW` |
| `RESEARCHER` | Scientific researcher analyzing psychometrics | `USER` permissions + `RESEARCH_VIEW` |
| `ADMIN` | System administrator managing operations | All above + `ADMIN_ACCESS`, `USER_MANAGE`, `ITEM_MANAGE` |
| `SUPER_ADMIN` | Top-level system authority | All permissions + `SYSTEM_CONFIG`, `ROLE_MANAGE` |

### 4.2 Storage & CLI Bootstrapping
- Roles are stored in `user_roles` (`userId`, `role`, `grantedAt`, `grantedBy`).
- Super admin accounts are bootstrapped using the idempotent CLI tool:
  ```bash
  npm run admin:grant-role -- --email="admin@example.com" --role="SUPER_ADMIN"
  ```

---

## 5. Verification Tokens & Flow State Machines

### 5.1 Email Verification
- Credentials registration sets user status to `PENDING_VERIFICATION`.
- Unhashed token (32 bytes hex) is sent to user via email/sink; hashed token (`SHA-256`) is stored in `email_verification_tokens` with 24-hour expiry.
- Upon successful verification:
  - Token is marked `usedAt = NOW()`.
  - User's `emailVerified` is set to `NOW()`.
  - User's `status` transitions from `PENDING_VERIFICATION` to `ACTIVE`.

### 5.2 Password Reset
- Password reset request generates a 32-byte token, stores SHA-256 hash in `password_reset_tokens` with 1-hour expiry.
- When redeemed:
  - Token is marked `usedAt = NOW()`.
  - New password is scrypt hashed and updated in `user_credentials`.
  - All existing sessions are revoked via `revokeAllSessions(userId)`.
  - An audit event `PASSWORD_RESET_SUCCESS` is logged.

---

## 6. Rate Limiting & Audit Logging

### 6.1 Concurrency-Safe Rate Limiting (`rate_limit_records`)
- Backed by PostgreSQL `rate_limit_records` (`key`, `count`, `expiresAt`) with atomic upsert, falling back to in-memory store in isolated environments.
- Protects:
  - `/api/auth/callback/credentials` (5 attempts per 15-minute window per IP/email).
  - Registration (3 attempts per hour per IP).
  - Password reset requests (3 attempts per hour per IP).
  - Email verification requests (5 attempts per hour per IP).

### 6.2 Privacy-Preserving Immutable Audit Log (`auth_audit_events`)
- Logs security lifecycle events: `REGISTER_SUCCESS`, `REGISTER_FAILURE`, `LOGIN_SUCCESS`, `LOGIN_FAILURE`, `LOGOUT`, `PASSWORD_RESET_REQUEST`, `PASSWORD_RESET_SUCCESS`, `EMAIL_VERIFY_SUCCESS`, `ACCOUNT_SUSPENDED`, `ROLE_GRANTED`.
- IP addresses are never stored in plain text: transformed into HMAC-SHA256 hashes (`ipHash`).
- Metadata fields are strictly sanitized: passwords, tokens, and authorization headers are stripped.
- Foreign key uses `ON DELETE SET NULL`, ensuring immutable audit trails even if a user account is deleted under GDPR/KVKK compliance requests.

---

## 7. Migration & Deployment Runbook

### 7.1 Database Migration Safety
- Migration `20260914140000_auth_identity_rbac_foundation`:
  - Strictly additive.
  - Zero `DROP TABLE`, zero `DROP COLUMN`, zero `TRUNCATE`.
  - All new columns on `users` are nullable or have default values.
  - Existing live psychometric data (17-item live assessment v1.0.0, responses, domains, facets) is 100% preserved.

### 7.2 Deployment Checklist
1. Pre-deploy PostgreSQL backup executed in Coolify host (`/data/psyche-ai/backups`).
2. Environment variables set in Coolify:
   - `AUTH_SECRET`
   - `AUTH_URL=https://psikoai.alperates.com.tr`
   - `AUTH_TRUST_HOST=true`
   - `AUTH_GOOGLE_ID` (if Google Login enabled)
   - `AUTH_GOOGLE_SECRET` (if Google Login enabled)
3. Deploy application container via Coolify Git push trigger.
4. Execute `prisma migrate deploy` on production database.
5. Smoke test:
   - Verify `/api/health` returns `status: "ok"`.
   - Verify `/login` and `/register` render cleanly.
   - Verify unauthenticated visits to `/overview` redirect to `/login`.
   - Verify research routes `/research/*` return 404 (default-deny).
