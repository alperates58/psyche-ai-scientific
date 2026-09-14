import crypto from 'crypto';

function scryptAsync(
  password: crypto.BinaryLike,
  salt: crypto.BinaryLike,
  keylen: number,
  options: crypto.ScryptOptions
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, keylen, options, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey as Buffer);
    });
  });
}

// OWASP Recommended scrypt parameters
// N = 2^16 (65536), r = 8, p = 1, keylen = 64 bytes
const SCRYPT_N = 65536;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_KEYLEN = 64;
const SCRYPT_MAXMEM = 128 * 1024 * 1024; // 128 MB
const SALT_BYTES = 16;

export interface PasswordPolicyResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates password length and structure.
 * Supports long passphrases (12 - 128 characters) without arbitrary character composition rules.
 */
export function validatePasswordPolicy(password: string): PasswordPolicyResult {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Şifre gereklidir.' };
  }
  if (password.length < 12) {
    return { valid: false, error: 'Şifre en az 12 karakter uzunluğunda olmalıdır.' };
  }
  if (password.length > 128) {
    return { valid: false, error: 'Şifre en fazla 128 karakter olabilir.' };
  }
  return { valid: true };
}

/**
 * Encodes password using Node.js built-in crypto.scrypt (asynchronous).
 * Stored format: $scrypt$ln=16,r=8,p=1$<salt_hex>$<derived_key_hex>
 */
export async function hashPassword(password: string): Promise<string> {
  const policy = validatePasswordPolicy(password);
  if (!policy.valid) {
    throw new Error(policy.error || 'Şifre politikaya uymuyor.');
  }

  const salt = crypto.randomBytes(SALT_BYTES).toString('hex');
  const derivedKey = (await scryptAsync(password, salt, SCRYPT_KEYLEN, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
    maxmem: SCRYPT_MAXMEM,
  })) as Buffer;

  return `$scrypt$ln=16,r=${SCRYPT_R},p=${SCRYPT_P}$${salt}$${derivedKey.toString('hex')}`;
}

/**
 * Verifies a plaintext password against a versioned encoded hash.
 * Designed to be upgradeable to Argon2id in the future.
 */
export async function verifyPassword(password: string, encodedHash: string): Promise<boolean> {
  if (!password || !encodedHash) return false;

  if (encodedHash.startsWith('$scrypt$')) {
    const parts = encodedHash.split('$');
    // Format: ["", "scrypt", "ln=16,r=8,p=1", salt, derivedKey]
    if (parts.length !== 5) return false;

    const paramsStr = parts[2];
    const salt = parts[3];
    const expectedDerivedKeyHex = parts[4];

    // Parse parameters
    let N = SCRYPT_N;
    let r = SCRYPT_R;
    let p = SCRYPT_P;

    const matchLn = paramsStr.match(/ln=(\d+)/);
    const matchR = paramsStr.match(/r=(\d+)/);
    const matchP = paramsStr.match(/p=(\d+)/);

    if (matchLn) N = 2 ** parseInt(matchLn[1], 10);
    if (matchR) r = parseInt(matchR[1], 10);
    if (matchP) p = parseInt(matchP[1], 10);

    const actualDerivedKey = (await scryptAsync(password, salt, Buffer.from(expectedDerivedKeyHex, 'hex').length, {
      N,
      r,
      p,
      maxmem: SCRYPT_MAXMEM,
    })) as Buffer;

    const expectedBuffer = Buffer.from(expectedDerivedKeyHex, 'hex');
    if (actualDerivedKey.length !== expectedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(actualDerivedKey, expectedBuffer);
  }

  // Unsupported algorithm
  return false;
}

// Dummy hash for constant-time response on missing user lookup
const DUMMY_HASH = `$scrypt$ln=16,r=8,p=1$${'0'.repeat(32)}${'0'.repeat(128)}`;

/**
 * Runs a dummy verification calculation to maintain consistent timing
 * when a user is not found, protecting against user enumeration via response timing.
 */
export async function dummyVerifyPassword(): Promise<void> {
  try {
    await verifyPassword('dummy_password_timing_pad', DUMMY_HASH);
  } catch {
    // Ignore error
  }
}
