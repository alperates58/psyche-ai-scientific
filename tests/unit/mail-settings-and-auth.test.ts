import { describe, it, expect, beforeEach } from 'vitest';
import {
  getSystemMailSettings,
  getSystemMailSettingsSync,
  updateSystemMailSettings,
  isEmailVerificationEnforced,
} from '@/services/systemSettingsService';
import { sendTestEmail, sendVerificationEmail, getMailSink, clearMailSink } from '@/lib/emailService';

describe('System Mail & Email Verification Governance (Admin Settings)', () => {
  beforeEach(async () => {
    clearMailSink();
    // Reset to default disabled state
    await updateSystemMailSettings({
      mailIntegrationEnabled: false,
      requireEmailVerification: false,
      smtp: {
        host: '',
        port: 587,
        secure: false,
        user: '',
        password: '',
        fromEmail: 'noreply@psyche.ai',
        fromName: 'PsycheAI Scientific',
      },
      imap: {
        host: '',
        port: 993,
        secure: true,
        user: '',
        password: '',
      },
    });
  });

  it('defaults to mail integration disabled and verification NOT required', async () => {
    const settings = await getSystemMailSettings();
    expect(settings.mailIntegrationEnabled).toBe(false);
    expect(settings.requireEmailVerification).toBe(false);
    expect(isEmailVerificationEnforced()).toBe(false);
  });

  it('updates mail settings and toggles integration and verification state', async () => {
    const updated = await updateSystemMailSettings({
      mailIntegrationEnabled: true,
      requireEmailVerification: true,
      smtp: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        user: 'admin@psyche.ai',
        password: 'secret-app-password',
        fromEmail: 'admin@psyche.ai',
        fromName: 'PsycheAI Admin',
      },
      imap: {
        host: 'imap.gmail.com',
        port: 993,
        secure: true,
        user: 'admin@psyche.ai',
        password: 'secret-app-password',
      },
    }, 'admin-user-id');

    expect(updated.mailIntegrationEnabled).toBe(true);
    expect(updated.requireEmailVerification).toBe(true);
    expect(updated.smtp.host).toBe('smtp.gmail.com');
    expect(updated.imap.host).toBe('imap.gmail.com');
    expect(isEmailVerificationEnforced()).toBe(true);

    const reloaded = getSystemMailSettingsSync();
    expect(reloaded.mailIntegrationEnabled).toBe(true);
    expect(reloaded.requireEmailVerification).toBe(true);
  });

  it('gracefully handles verification emails when mail integration is disabled', async () => {
    await updateSystemMailSettings({ mailIntegrationEnabled: false });

    const result = await sendVerificationEmail('test@example.com', 'sample-token-123');
    expect(result.success).toBe(true);
    expect(result.code).toBe('MAIL_INTEGRATION_DISABLED');

    const sink = getMailSink();
    expect(sink).toHaveLength(1);
    expect(sink[0].to).toBe('test@example.com');
  });

  it('dispatches test email when testing SMTP configuration', async () => {
    const res = await sendTestEmail('alperates58@gmail.com');
    expect(res.success).toBe(true);

    const sink = getMailSink();
    expect(sink.some((m) => m.to === 'alperates58@gmail.com' && m.type === 'TEST')).toBe(true);
  });
});
