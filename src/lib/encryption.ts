import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96 bits for GCM
const AUTH_TAG_LENGTH = 16; // 128 bits for GCM

function getMasterKey(): Buffer {
  const secret =
    process.env.SETTINGS_ENCRYPTION_KEY ||
    process.env.NEXTAUTH_SECRET ||
    'psycheai-server-system-encryption-master-key-v2';
  return crypto.createHash('sha256').update(secret).digest();
}

/**
 * Encrypts a plaintext secret string using AES-256-GCM.
 * Output format: base64(iv + authTag + cipherText)
 */
export function encryptSecret(plainText: string): string {
  if (!plainText) return '';
  const key = getMasterKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plainText, 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  // Combine iv (12) + authTag (16) + encrypted
  const combined = Buffer.concat([iv, authTag, encrypted]);
  return combined.toString('base64');
}

/**
 * Decrypts a base64 string encrypted with encryptSecret.
 */
export function decryptSecret(encryptedBase64: string): string {
  if (!encryptedBase64) return '';
  try {
    const key = getMasterKey();
    const combined = Buffer.from(encryptedBase64, 'base64');

    if (combined.length < IV_LENGTH + AUTH_TAG_LENGTH) {
      throw new Error('Invalid encrypted payload length.');
    }

    const iv = combined.subarray(0, IV_LENGTH);
    const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const cipherText = combined.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(cipherText),
      decipher.final(),
    ]);

    return decrypted.toString('utf8');
  } catch (err: any) {
    console.error('Failed to decrypt secret:', err.message);
    return '';
  }
}

/**
 * Masks a secret key for display in user interfaces.
 * e.g., "sk-deepseek-12345678abcd" -> "••••••••••••abcd"
 */
export function maskSecretKey(secret: string): string {
  if (!secret) return '';
  const clean = secret.trim();
  if (clean.length <= 4) {
    return '••••••••';
  }
  const last4 = clean.slice(-4);
  return `••••••••••••${last4}`;
}

/**
 * Extracts last 4 characters safely.
 */
export function getSecretLast4(secret: string): string | undefined {
  if (!secret) return undefined;
  const clean = secret.trim();
  if (clean.length < 4) return undefined;
  return clean.slice(-4);
}
