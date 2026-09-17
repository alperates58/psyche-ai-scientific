import fs from 'fs';
import path from 'path';
import { encryptSecret, decryptSecret, getSecretLast4 } from '@/lib/encryption';

const SECRETS_DIR = path.join(process.cwd(), '.secrets');
const AI_SECRET_FILE = path.join(SECRETS_DIR, 'ai-secrets.enc');

interface EncryptedAISecretPayload {
  version: 1;
  encryptedKey: string;
  last4: string;
  updatedAt: string;
}

/**
 * Ensures the server-only .secrets directory exists.
 */
function ensureSecretsDir(): void {
  if (!fs.existsSync(SECRETS_DIR)) {
    fs.mkdirSync(SECRETS_DIR, { recursive: true, mode: 0o700 });
  }
}

/**
 * Saves an API key encrypted at rest in the server-only .secrets/ai-secrets.enc file.
 * The raw key is NEVER stored in git-tracked files or data/system-settings.json.
 */
export async function savePersistentAIKey(apiKey: string): Promise<void> {
  if (!apiKey || !apiKey.trim()) {
    await deletePersistentAIKey();
    return;
  }

  ensureSecretsDir();
  const trimmed = apiKey.trim();
  const encrypted = encryptSecret(trimmed);
  const last4 = getSecretLast4(trimmed) || '';

  const payload: EncryptedAISecretPayload = {
    version: 1,
    encryptedKey: encrypted,
    last4,
    updatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(AI_SECRET_FILE, JSON.stringify(payload, null, 2), {
    encoding: 'utf-8',
    mode: 0o600,
  });
}

/**
 * Reads and decrypts the persistent API key.
 * Priority: 1. Persistent encrypted secret file, 2. Environment variables.
 */
export async function getResolvedAIKey(): Promise<string | null> {
  try {
    if (fs.existsSync(AI_SECRET_FILE)) {
      const raw = fs.readFileSync(AI_SECRET_FILE, 'utf-8');
      const parsed: EncryptedAISecretPayload = JSON.parse(raw);
      if (parsed.encryptedKey) {
        const decrypted = decryptSecret(parsed.encryptedKey);
        if (decrypted) return decrypted;
      }
    }
  } catch (err) {
    console.error('Failed to read persistent AI secret file:', err);
  }

  // Fallback to environment variables
  const envKey = process.env.DEEPSEEK_API_KEY || process.env.AI_INSIGHT_API_KEY;
  if (envKey && envKey.trim()) {
    return envKey.trim();
  }

  return null;
}

/**
 * Checks whether an API key is configured (either in persistent store or env).
 */
export function isAIKeyConfigured(): boolean {
  try {
    if (fs.existsSync(AI_SECRET_FILE)) {
      const raw = fs.readFileSync(AI_SECRET_FILE, 'utf-8');
      const parsed: EncryptedAISecretPayload = JSON.parse(raw);
      if (parsed.encryptedKey && parsed.encryptedKey.length > 0) {
        return true;
      }
    }
  } catch {
    // ignore
  }

  const envKey = process.env.DEEPSEEK_API_KEY || process.env.AI_INSIGHT_API_KEY;
  return Boolean(envKey && envKey.trim().length > 0);
}

/**
 * Returns safe last 4 characters for UI masking (never raw key).
 */
export function getAIKeyLast4(): string | undefined {
  try {
    if (fs.existsSync(AI_SECRET_FILE)) {
      const raw = fs.readFileSync(AI_SECRET_FILE, 'utf-8');
      const parsed: EncryptedAISecretPayload = JSON.parse(raw);
      if (parsed.last4) {
        return parsed.last4;
      }
    }
  } catch {
    // ignore
  }

  const envKey = process.env.DEEPSEEK_API_KEY || process.env.AI_INSIGHT_API_KEY;
  if (envKey) {
    return getSecretLast4(envKey);
  }

  return undefined;
}

/**
 * Deletes persistent key file.
 */
export async function deletePersistentAIKey(): Promise<void> {
  try {
    if (fs.existsSync(AI_SECRET_FILE)) {
      fs.unlinkSync(AI_SECRET_FILE);
    }
  } catch (err) {
    console.error('Failed to delete persistent AI secret file:', err);
  }
}
