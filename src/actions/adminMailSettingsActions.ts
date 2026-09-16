'use server';

import { requirePermission } from '@/lib/auth';
import {
  getSystemMailSettings,
  updateSystemMailSettings,
  SystemMailSettings,
} from '@/services/systemSettingsService';
import { logAuthAuditEvent } from '@/lib/auditLog';
import { sendTestEmail } from '@/lib/emailService';
import { revalidatePath } from 'next/cache';

export async function getMailSettingsAction(): Promise<{
  success: boolean;
  settings?: SystemMailSettings;
  error?: string;
}> {
  try {
    await requirePermission('SYSTEM_CONFIG');
    const settings = await getSystemMailSettings();
    return { success: true, settings };
  } catch (err: any) {
    return { success: false, error: err.message || 'Yetkisiz erişim.' };
  }
}

export async function saveMailSettingsAction(
  updates: Partial<SystemMailSettings>
): Promise<{ success: boolean; settings?: SystemMailSettings; error?: string }> {
  try {
    const user = await requirePermission('SYSTEM_CONFIG');
    const updated = await updateSystemMailSettings(updates, user.id);

    await logAuthAuditEvent({
      eventType: 'SYSTEM_SETTINGS_UPDATED',
      actorUserId: user.id,
      success: true,
      metadata: {
        mailIntegrationEnabled: updated.mailIntegrationEnabled,
        requireEmailVerification: updated.requireEmailVerification,
        smtpHost: updated.smtp.host,
        smtpPort: updated.smtp.port,
      },
    });

    revalidatePath('/admin/system');
    return { success: true, settings: updated };
  } catch (err: any) {
    return { success: false, error: err.message || 'Ayarlar kaydedilemedi.' };
  }
}

export async function sendTestEmailAction(
  targetEmail: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const user = await requirePermission('SYSTEM_CONFIG');
    if (!targetEmail || !targetEmail.includes('@')) {
      return { success: false, error: 'Geçerli bir e-posta adresi giriniz.' };
    }

    const result = await sendTestEmail(targetEmail);

    if (result.success) {
      await logAuthAuditEvent({
        eventType: 'TEST_EMAIL_DISPATCHED',
        actorUserId: user.id,
        success: true,
        metadata: { to: targetEmail },
      });
      return {
        success: true,
        message: result.code === 'MAIL_INTEGRATION_DISABLED'
          ? `E-posta entegrasyonu kapalı olduğu için test kaydı simüle edildi (${targetEmail}).`
          : `Test e-postası başarıyla gönderildi (${targetEmail}).`,
      };
    } else {
      return { success: false, error: result.error || 'Test e-postası gönderilemedi.' };
    }
  } catch (err: any) {
    return { success: false, error: err.message || 'Test e-postası işlemi başarısız.' };
  }
}
