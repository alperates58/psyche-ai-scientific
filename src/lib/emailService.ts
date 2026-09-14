export interface SentMailRecord {
  to: string;
  subject: string;
  type: 'VERIFICATION' | 'PASSWORD_RESET';
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
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASSWORD?.trim();
  return Boolean(host && user && pass);
}

export interface SendMailResult {
  success: boolean;
  code?: 'SENT' | 'SINK_RECORDED' | 'EMAIL_SERVICE_NOT_CONFIGURED' | 'SEND_ERROR';
  error?: string;
}

/**
 * Dispatches email verification link.
 * NEVER prints raw token to console/logs.
 */
export async function sendVerificationEmail(toEmail: string, rawToken: string): Promise<SendMailResult> {
  const authUrl = (process.env.AUTH_URL || 'https://psikoai.alperates.com.tr').replace(/\/+$/, '');
  const verificationLink = `${authUrl}/verify-email?token=${rawToken}`;

  // If in test or development, record into in-memory sink without printing raw token to console
  if (process.env.NODE_ENV === 'test' || !isSmtpConfigured()) {
    if (process.env.NODE_ENV === 'production') {
      return {
        success: false,
        code: 'EMAIL_SERVICE_NOT_CONFIGURED',
        error: 'E-posta servisi yapılandırılmamış. Lütfen sistem yöneticisiyle iletişime geçin.',
      };
    }

    // In dev / test: store in testMailSink
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
    // Note: When SMTP credentials are provided in Coolify, dynamic transport or fetch can be used
    // For now, return error if SMTP host fails or is unreachable
    return {
      success: false,
      code: 'EMAIL_SERVICE_NOT_CONFIGURED',
      error: 'SMTP transport not initialized.',
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
  const authUrl = (process.env.AUTH_URL || 'https://psikoai.alperates.com.tr').replace(/\/+$/, '');
  const resetLink = `${authUrl}/reset-password?token=${rawToken}`;

  if (process.env.NODE_ENV === 'test' || !isSmtpConfigured()) {
    if (process.env.NODE_ENV === 'production') {
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
