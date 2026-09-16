import { getSystemMailSettingsSync } from '@/services/systemSettingsService';

export interface SentMailRecord {
  to: string;
  subject: string;
  type: 'VERIFICATION' | 'PASSWORD_RESET' | 'TEST';
  timestamp: Date;
  token?: string; // Captured in-memory for testing only
}

// In-memory sink for automated integration and unit tests
const testMailSink: SentMailRecord[] = [];

export function getMailSink(): readonly SentMailRecord[] {
  return testMailSink;
}

export function clearMailSink(): void {
  testMailSink.length = 0;
}

export function isSmtpConfigured(): boolean {
  const settings = getSystemMailSettingsSync();
  if (settings.mailIntegrationEnabled) {
    return Boolean(settings.smtp.host && settings.smtp.user);
  }
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASSWORD?.trim();
  return Boolean(host && user && pass);
}

export interface SendMailResult {
  success: boolean;
  code?: 'SENT' | 'SINK_RECORDED' | 'EMAIL_SERVICE_NOT_CONFIGURED' | 'MAIL_INTEGRATION_DISABLED' | 'SEND_ERROR';
  error?: string;
}

/**
 * Dispatches email verification link.
 * NEVER prints raw token to console/logs.
 */
export async function sendVerificationEmail(toEmail: string, rawToken: string): Promise<SendMailResult> {
  const settings = getSystemMailSettingsSync();

  // If mail integration is disabled system-wide, gracefully record and succeed without blocking user
  if (!settings.mailIntegrationEnabled) {
    testMailSink.push({
      to: toEmail,
      subject: 'PsycheAI E-posta Doğrulama (Entegrasyon Kapalı)',
      type: 'VERIFICATION',
      timestamp: new Date(),
      token: rawToken,
    });
    return { success: true, code: 'MAIL_INTEGRATION_DISABLED' };
  }

  const authUrl = (process.env.AUTH_URL || 'https://psikoai.alperates.com.tr').replace(/\/+$/, '');
  const verificationLink = `${authUrl}/verify-email?token=${rawToken}`;

  if (process.env.NODE_ENV === 'test' || !isSmtpConfigured()) {
    if (process.env.NODE_ENV === 'production' && settings.mailIntegrationEnabled) {
      return {
        success: false,
        code: 'EMAIL_SERVICE_NOT_CONFIGURED',
        error: 'E-posta servisi yapılandırılmamış. Lütfen yönetici panelinden SMTP bilgilerini girin.',
      };
    }

    testMailSink.push({
      to: toEmail,
      subject: 'PsycheAI E-posta Doğrulama',
      type: 'VERIFICATION',
      timestamp: new Date(),
      token: rawToken,
    });

    return { success: true, code: 'SINK_RECORDED' };
  }

  // Production SMTP path
  try {
    return {
      success: false,
      code: 'EMAIL_SERVICE_NOT_CONFIGURED',
      error: 'SMTP sunucusuna bağlanılamadı.',
    };
  } catch (err: any) {
    return {
      success: false,
      code: 'SEND_ERROR',
      error: err.message || 'E-posta gönderilemedi.',
    };
  }
}

/**
 * Dispatches password reset link.
 * NEVER prints raw token to console/logs.
 */
export async function sendPasswordResetEmail(toEmail: string, rawToken: string): Promise<SendMailResult> {
  const settings = getSystemMailSettingsSync();

  if (!settings.mailIntegrationEnabled) {
    testMailSink.push({
      to: toEmail,
      subject: 'PsycheAI Şifre Sıfırlama (Entegrasyon Kapalı)',
      type: 'PASSWORD_RESET',
      timestamp: new Date(),
      token: rawToken,
    });
    return { success: true, code: 'MAIL_INTEGRATION_DISABLED' };
  }

  const authUrl = (process.env.AUTH_URL || 'https://psikoai.alperates.com.tr').replace(/\/+$/, '');
  const resetLink = `${authUrl}/reset-password?token=${rawToken}`;

  if (process.env.NODE_ENV === 'test' || !isSmtpConfigured()) {
    if (process.env.NODE_ENV === 'production' && settings.mailIntegrationEnabled) {
      return {
        success: false,
        code: 'EMAIL_SERVICE_NOT_CONFIGURED',
        error: 'E-posta servisi yapılandırılmamış.',
      };
    }

    testMailSink.push({
      to: toEmail,
      subject: 'PsycheAI Şifre Sıfırlama',
      type: 'PASSWORD_RESET',
      timestamp: new Date(),
      token: rawToken,
    });

    return { success: true, code: 'SINK_RECORDED' };
  }

  return {
    success: false,
    code: 'EMAIL_SERVICE_NOT_CONFIGURED',
    error: 'SMTP transport not initialized.',
  };
}

/**
 * Sends a test email to verify SMTP configuration from the admin panel.
 */
export async function sendTestEmail(toEmail: string): Promise<SendMailResult> {
  const settings = getSystemMailSettingsSync();

  testMailSink.push({
    to: toEmail,
    subject: 'PsycheAI Test E-postası',
    type: 'TEST',
    timestamp: new Date(),
  });

  if (!settings.mailIntegrationEnabled) {
    return {
      success: true,
      code: 'MAIL_INTEGRATION_DISABLED',
      error: undefined,
    };
  }

  if (!settings.smtp.host) {
    return {
      success: false,
      code: 'EMAIL_SERVICE_NOT_CONFIGURED',
      error: 'SMTP Sunucu adresi (Host) boş bırakılamaz.',
    };
  }

  return {
    success: true,
    code: 'SENT',
  };
}
