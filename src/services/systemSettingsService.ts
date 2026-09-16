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

let cachedSettings: SystemMailSettings | null = null;

export function getSystemMailSettingsSync(): SystemMailSettings {
  if (cachedSettings) return cachedSettings;

  try {
    if (fs.existsSync(SETTINGS_FILE_PATH)) {
      const raw = fs.readFileSync(SETTINGS_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      cachedSettings = {
        ...DEFAULT_MAIL_SETTINGS,
        ...parsed,
        smtp: { ...DEFAULT_MAIL_SETTINGS.smtp, ...(parsed.smtp || {}) },
        imap: { ...DEFAULT_MAIL_SETTINGS.imap, ...(parsed.imap || {}) },
      };
      return cachedSettings!;
    }
  } catch (err) {
    console.error('Error reading system-settings.json, using defaults:', err);
  }

  cachedSettings = { ...DEFAULT_MAIL_SETTINGS };
  return cachedSettings;
}

export async function getSystemMailSettings(): Promise<SystemMailSettings> {
  return getSystemMailSettingsSync();
}

export async function updateSystemMailSettings(
  updates: Partial<SystemMailSettings>,
  actorUserId?: string
): Promise<SystemMailSettings> {
  const current = getSystemMailSettingsSync();
  const next: SystemMailSettings = {
    ...current,
    ...updates,
    smtp: {
      ...current.smtp,
      ...(updates.smtp || {}),
    },
    imap: {
      ...current.imap,
      ...(updates.imap || {}),
    },
    updatedAt: new Date().toISOString(),
    updatedBy: actorUserId || current.updatedBy,
  };

  try {
    fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(next, null, 2), 'utf-8');
    cachedSettings = next;
  } catch (err) {
    console.error('Failed to write system-settings.json:', err);
    throw new Error('Sistem ayarları kaydedilemedi.');
  }

  return next;
}

export function isEmailVerificationEnforced(): boolean {
  const settings = getSystemMailSettingsSync();
  // Strictly enforced ONLY if mail integration is enabled AND requireEmailVerification is true
  return Boolean(settings.mailIntegrationEnabled && settings.requireEmailVerification);
}
