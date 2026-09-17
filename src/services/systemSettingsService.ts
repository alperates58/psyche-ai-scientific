import fs from 'fs';
import path from 'path';

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  fromEmail: string;
  fromName: string;
}

export interface ImapConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
}

export interface SystemMailSettings {
  mailIntegrationEnabled: boolean; // default: false (KAPALI)
  requireEmailVerification: boolean; // default: false (KAPALI)
  allowDirectLoginWithoutVerification: boolean; // default: true
  smtp: SmtpConfig;
  imap: ImapConfig;
  updatedAt: string;
  updatedBy?: string;
}

export interface SystemAISettings {
  aiEnabled: boolean; // default: false (KAPALI)
  provider: 'DeepSeek';
  baseUrl: string; // default: https://api.deepseek.com
  model: string; // default: deepseek-v4-flash
  temperature: number; // default: 0.15
  maxTokens: number; // default: 4096
  timeoutMs: number; // default: 10000
  consentEnforcement: boolean; // default: true
  deterministicFallback: boolean; // default: true
  lastConnectionTestAt?: string;
  lastConnectionTestStatus?: 'SUCCESS' | 'FAILED';
  lastConnectionTestLatencyMs?: number;
  lastConnectionTestMessage?: string;
  updatedAt: string;
  updatedBy?: string;
}

export interface FullSystemSettings {
  mail: SystemMailSettings;
  ai: SystemAISettings;
  updatedAt: string;
  updatedBy?: string;
}

const SETTINGS_FILE_PATH = path.join(process.cwd(), 'data/system-settings.json');

const DEFAULT_MAIL_SETTINGS: SystemMailSettings = {
  mailIntegrationEnabled: false,
  requireEmailVerification: false,
  allowDirectLoginWithoutVerification: true,
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
    fromEmail: process.env.SMTP_FROM_EMAIL || 'noreply@psyche.ai',
    fromName: process.env.SMTP_FROM_NAME || 'PsycheAI Scientific',
  },
  imap: {
    host: process.env.IMAP_HOST || '',
    port: process.env.IMAP_PORT ? parseInt(process.env.IMAP_PORT, 10) : 993,
    secure: process.env.IMAP_SECURE !== 'false',
    user: process.env.IMAP_USER || '',
    password: process.env.IMAP_PASSWORD || '',
  },
  updatedAt: new Date().toISOString(),
};

const DEFAULT_AI_SETTINGS: SystemAISettings = {
  aiEnabled: process.env.ENABLE_EXTERNAL_AI_INSIGHTS === 'true',
  provider: 'DeepSeek',
  baseUrl: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
  model: process.env.DEEPSEEK_MODEL_ID || process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash',
  temperature: 0.15,
  maxTokens: 4096,
  timeoutMs: Number(process.env.AI_INSIGHT_TIMEOUT_MS) || 10000,
  consentEnforcement: true,
  deterministicFallback: true,
  updatedAt: new Date().toISOString(),
};

let cachedFullSettings: FullSystemSettings | null = null;

function readFullSettingsSync(): FullSystemSettings {
  if (cachedFullSettings) return cachedFullSettings;

  try {
    if (fs.existsSync(SETTINGS_FILE_PATH)) {
      const raw = fs.readFileSync(SETTINGS_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);

      // Handle both legacy flat mail schema and structured full schema
      const mailParsed = parsed.mail ? parsed.mail : parsed;
      const aiParsed = parsed.ai || {};

      cachedFullSettings = {
        mail: {
          ...DEFAULT_MAIL_SETTINGS,
          ...mailParsed,
          smtp: { ...DEFAULT_MAIL_SETTINGS.smtp, ...(mailParsed.smtp || {}) },
          imap: { ...DEFAULT_MAIL_SETTINGS.imap, ...(mailParsed.imap || {}) },
        },
        ai: {
          ...DEFAULT_AI_SETTINGS,
          ...aiParsed,
          provider: 'DeepSeek',
          model: aiParsed.model || DEFAULT_AI_SETTINGS.model,
          baseUrl: aiParsed.baseUrl || DEFAULT_AI_SETTINGS.baseUrl,
        },
        updatedAt: parsed.updatedAt || new Date().toISOString(),
        updatedBy: parsed.updatedBy,
      };
      return cachedFullSettings!;
    }
  } catch (err) {
    console.error('Error reading system-settings.json, using defaults:', err);
  }

  cachedFullSettings = {
    mail: { ...DEFAULT_MAIL_SETTINGS },
    ai: { ...DEFAULT_AI_SETTINGS },
    updatedAt: new Date().toISOString(),
  };
  return cachedFullSettings;
}

function writeFullSettingsSync(settings: FullSystemSettings): void {
  try {
    fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(settings, null, 2), 'utf-8');
    cachedFullSettings = settings;
  } catch (err) {
    console.error('Failed to write system-settings.json:', err);
    throw new Error('Sistem ayarları kaydedilemedi.');
  }
}

// Mail Settings Accessors
export function getSystemMailSettingsSync(): SystemMailSettings {
  return readFullSettingsSync().mail;
}

export async function getSystemMailSettings(): Promise<SystemMailSettings> {
  return getSystemMailSettingsSync();
}

export async function updateSystemMailSettings(
  updates: Partial<SystemMailSettings>,
  actorUserId?: string
): Promise<SystemMailSettings> {
  const current = readFullSettingsSync();
  const nextMail: SystemMailSettings = {
    ...current.mail,
    ...updates,
    smtp: {
      ...current.mail.smtp,
      ...(updates.smtp || {}),
    },
    imap: {
      ...current.mail.imap,
      ...(updates.imap || {}),
    },
    updatedAt: new Date().toISOString(),
    updatedBy: actorUserId || current.mail.updatedBy,
  };

  const nextFull: FullSystemSettings = {
    ...current,
    mail: nextMail,
    updatedAt: new Date().toISOString(),
    updatedBy: actorUserId || current.updatedBy,
  };

  writeFullSettingsSync(nextFull);
  return nextMail;
}

// AI Settings Accessors (Non-secret only)
export function getSystemAISettingsSync(): SystemAISettings {
  return readFullSettingsSync().ai;
}

export async function getSystemAISettings(): Promise<SystemAISettings> {
  return getSystemAISettingsSync();
}

export async function updateSystemAISettings(
  updates: Partial<SystemAISettings>,
  actorUserId?: string
): Promise<SystemAISettings> {
  const current = readFullSettingsSync();
  const nextAI: SystemAISettings = {
    ...current.ai,
    ...updates,
    provider: 'DeepSeek', // strictly locked to DeepSeek
    updatedAt: new Date().toISOString(),
    updatedBy: actorUserId || current.ai.updatedBy,
  };

  const nextFull: FullSystemSettings = {
    ...current,
    ai: nextAI,
    updatedAt: new Date().toISOString(),
    updatedBy: actorUserId || current.updatedBy,
  };

  writeFullSettingsSync(nextFull);
  return nextAI;
}

export function isEmailVerificationEnforced(): boolean {
  const mail = getSystemMailSettingsSync();
  return Boolean(mail.mailIntegrationEnabled && mail.requireEmailVerification);
}
