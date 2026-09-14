export const RESEARCH_COOKIE_NAME = 'psyche_research_session';
export const RESEARCH_UI_COOKIE_NAME = 'psyche_research_auth';

export function getResearchAccessKey(): string {
  return process.env.RESEARCH_ACCESS_KEY?.trim() || '';
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function isResearchConfigured(): boolean {
  return getResearchAccessKey().length > 0;
}

/**
 * Derives a deterministic, high-entropy HMAC/SHA256 session token from the access key.
 * The raw access key is NEVER stored in cookies or logs.
 * If the access key in environment is changed or rotated, all existing session tokens
 * automatically become invalid.
 */
export async function deriveSessionToken(accessKey: string): Promise<string> {
  if (!accessKey) return '';
  const msgUint8 = new TextEncoder().encode(`${accessKey}:psyche_research_session_salt_v1`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Constant-time string comparison to prevent timing attacks.
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export interface ResearchAccessResult {
  authorized: boolean;
  reason?: 'unconfigured' | 'unauthorized' | 'dev_allowed';
}

/**
 * Validates request access against configured research security rules.
 * Supports:
 * 1. Authorization: Bearer <RESEARCH_ACCESS_KEY> (API / programmatic access)
 * 2. Secure HttpOnly session cookie (derived token from POST login)
 * 
 * In production: safe-by-default (unconfigured => unauthorized).
 * In development: allowed by default unless RESEARCH_ACCESS_KEY is explicitly configured.
 */
export async function validateResearchAccess(
  headers: Headers,
  cookies: { get: (name: string) => { value: string } | undefined }
): Promise<ResearchAccessResult> {
  const configuredKey = getResearchAccessKey();

  // In development: if no key is configured, allow frictionless local workflow
  if (!isProduction() && !configuredKey) {
    return { authorized: true, reason: 'dev_allowed' };
  }

  // Safe-by-default in production: if key is missing or empty, deny all access
  if (!configuredKey) {
    return { authorized: false, reason: 'unconfigured' };
  }

  // 1. Check Authorization: Bearer <key>
  const authHeader = headers.get('authorization') || headers.get('Authorization');
  if (authHeader) {
    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    if (match) {
      const bearerToken = match[1].trim();
      if (timingSafeEqual(bearerToken, configuredKey)) {
        return { authorized: true };
      }
    }
  }

  // 2. Check Session Cookie (derived token, NOT the raw secret)
  const sessionCookie = cookies.get(RESEARCH_COOKIE_NAME)?.value;
  if (sessionCookie) {
    const expectedSessionToken = await deriveSessionToken(configuredKey);
    if (timingSafeEqual(sessionCookie, expectedSessionToken)) {
      return { authorized: true };
    }
  }

  return { authorized: false, reason: 'unauthorized' };
}
