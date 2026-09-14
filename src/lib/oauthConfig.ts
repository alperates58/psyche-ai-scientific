export interface GoogleOAuthConfigStatus {
  configured: boolean;
  clientIdConfigured: boolean;
  clientSecretConfigured: boolean;
  redirectUri: string;
}

/**
 * Server-side helper to check Google OAuth configuration status safely.
 * Strictly withholds secret values.
 */
export function getGoogleOAuthConfigStatus(): GoogleOAuthConfigStatus {
  const clientId = process.env.AUTH_GOOGLE_ID?.trim() || '';
  const clientSecret = process.env.AUTH_GOOGLE_SECRET?.trim() || '';
  const authUrl = process.env.AUTH_URL?.trim() || 'https://psikoai.alperates.com.tr';

  const clientIdConfigured = clientId.length > 0;
  const clientSecretConfigured = clientSecret.length > 0;
  const configured = clientIdConfigured && clientSecretConfigured;

  // Standard Auth.js / NextAuth Google callback path
  const normalizedBase = authUrl.replace(/\/+$/, '');
  const redirectUri = `${normalizedBase}/api/auth/callback/google`;

  return {
    configured,
    clientIdConfigured,
    clientSecretConfigured,
    redirectUri,
  };
}
