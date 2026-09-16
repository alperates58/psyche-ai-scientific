'use client';

import React, { useState, useTransition } from 'react';
import { SystemMailSettings } from '@/services/systemSettingsService';
import {
  saveMailSettingsAction,
  sendTestEmailAction,
} from '@/actions/adminMailSettingsActions';
import {
  Mail,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send,
  Save,
  Server,
  Key,
  Inbox,
  Info,
  Lock,
} from 'lucide-react';

interface SystemMailSettingsCardProps {
  initialSettings: SystemMailSettings;
}

export const SystemMailSettingsCard: React.FC<SystemMailSettingsCardProps> = ({
  initialSettings,
}) => {
  const [settings, setSettings] = useState<SystemMailSettings>(initialSettings);
  const [testEmail, setTestEmail] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [testFeedback, setTestFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [isPending, startTransition] = useTransition();
  const [isTestPending, startTestTransition] = useTransition();

  const handleSave = () => {
    setFeedback(null);
    startTransition(async () => {
      const res = await saveMailSettingsAction(settings);
      if (res.success && res.settings) {
        setSettings(res.settings);
        setFeedback({
          type: 'success',
          message: 'E-posta ve doğrulama ayarları başarıyla kaydedildi.',
        });
      } else {
        setFeedback({
          type: 'error',
          message: res.error || 'Ayarlar kaydedilemedi.',
        });
      }
    });
  };

  const handleSendTest = () => {
    setTestFeedback(null);
    if (!testEmail || !testEmail.includes('@')) {
      setTestFeedback({ type: 'error', message: 'Lütfen geçerli bir e-posta adresi girin.' });
      return;
    }

    startTestTransition(async () => {
      const res = await sendTestEmailAction(testEmail);
      if (res.success) {
        setTestFeedback({
          type: 'success',
          message: res.message || 'Test e-postası başarıyla gönderildi.',
        });
      } else {
        setTestFeedback({
          type: 'error',
          message: res.error || 'Test e-postası gönderilemedi.',
        });
      }
    });
  };

  return (
    <div className="bg-surface-1 rounded-2xl border border-border-subtle p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center border border-purple-200">
            <Mail className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
              E-posta Entegrasyonu & Doğrulama Ayarları (SMTP / IMAP)
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              E-posta gönderim altyapısını yapılandırın ve zorunlu e-posta doğrulaması politikasını yönetin.
            </p>
          </div>
        </div>

        <div>
          {settings.mailIntegrationEnabled ? (
            <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              Entegrasyon Aktif
            </span>
          ) : (
            <span className="inline-flex items-center text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />
              Entegrasyon Kapalı (Varsayılan)
            </span>
          )}
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center space-x-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Main Switches */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Switch 1: Mail Integration Active */}
        <div className="p-4 bg-bg-subtle/70 rounded-xl border border-border-subtle flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="font-semibold text-xs text-text-primary flex items-center">
              <Server className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
              E-posta Entegrasyonunu Etkinleştir
            </div>
            <p className="text-[11px] text-text-secondary">
              Açıldığında sistem doğrulama, şifre sıfırlama ve bildirimleri yapılandırılan SMTP sunucusu üzerinden gönderir.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
            <input
              type="checkbox"
              checked={settings.mailIntegrationEnabled}
              onChange={(e) =>
                setSettings({ ...settings, mailIntegrationEnabled: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-surface-3 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border-default after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {/* Switch 2: Require Email Verification */}
        <div className="p-4 bg-bg-subtle/70 rounded-xl border border-border-subtle flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="font-semibold text-xs text-text-primary flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-brand-600" />
              Kayıtta E-posta Doğrulamasını Zorunlu Kıl
            </div>
            <p className="text-[11px] text-text-secondary">
              Kapalıyken yeni kayıt olan kullanıcılar doğrudan <strong>AKTİF</strong> olur ve e-posta beklemeden giriş yapabilir.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
            <input
              type="checkbox"
              checked={settings.requireEmailVerification}
              onChange={(e) =>
                setSettings({ ...settings, requireEmailVerification: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-surface-3 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border-default after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
          </label>
        </div>
      </div>

      {/* Info notice about current state */}
      {!settings.mailIntegrationEnabled && (
        <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start space-x-2.5">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold">E-posta Entegrasyonu Şu Anda Kapalı</div>
            <div className="text-[11px] text-amber-800">
              Yeni kullanıcılar kayıt olduğunda e-posta doğrulaması engeline takılmadan doğrudan sisteme giriş yapabilir. E-posta sunucu bilgilerinizi tamamladıktan sonra yukarıdaki anahtarı açabilirsiniz.
            </div>
          </div>
        </div>
      )}

      {/* Configuration Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SMTP Settings */}
        <div className="p-4 rounded-xl border border-border-subtle bg-surface-2/40 space-y-3.5">
          <div className="flex items-center space-x-2 pb-2 border-b border-border-subtle">
            <Send className="w-4 h-4 text-purple-600" />
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
              SMTP Gönderim Yapılandırması
            </h4>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2 space-y-1">
                <label className="font-semibold text-text-secondary text-[11px]">
                  SMTP Sunucu (Host)
                </label>
                <input
                  type="text"
                  value={settings.smtp.host}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      smtp: { ...settings.smtp, host: e.target.value },
                    })
                  }
                  placeholder="smtp.gmail.com veya mail.domain.com"
                  className="w-full px-3 py-1.5 rounded-lg bg-surface-1 border border-border-subtle text-text-primary text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-text-secondary text-[11px]">
                  Port
                </label>
                <input
                  type="number"
                  value={settings.smtp.port}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      smtp: { ...settings.smtp, port: parseInt(e.target.value, 10) || 587 },
                    })
                  }
                  placeholder="587"
                  className="w-full px-3 py-1.5 rounded-lg bg-surface-1 border border-border-subtle text-text-primary text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="smtp-secure"
                checked={settings.smtp.secure}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    smtp: { ...settings.smtp, secure: e.target.checked },
                  })
                }
                className="rounded text-purple-600 border-border-subtle"
              />
              <label htmlFor="smtp-secure" className="text-[11px] text-text-secondary font-medium">
                SSL / TLS Kullan (Port 465 için önerilir)
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-semibold text-text-secondary text-[11px]">
                  Kullanıcı Adı (Email)
                </label>
                <input
                  type="text"
                  value={settings.smtp.user}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      smtp: { ...settings.smtp, user: e.target.value },
                    })
                  }
                  placeholder="user@domain.com"
                  className="w-full px-3 py-1.5 rounded-lg bg-surface-1 border border-border-subtle text-text-primary text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-text-secondary text-[11px]">
                  Parola / Uygulama Şifresi
                </label>
                <input
                  type="password"
                  value={settings.smtp.password}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      smtp: { ...settings.smtp, password: e.target.value },
                    })
                  }
                  placeholder="••••••••••••"
                  className="w-full px-3 py-1.5 rounded-lg bg-surface-1 border border-border-subtle text-text-primary text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-semibold text-text-secondary text-[11px]">
                  Gönderen E-posta (From)
                </label>
                <input
                  type="email"
                  value={settings.smtp.fromEmail}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      smtp: { ...settings.smtp, fromEmail: e.target.value },
                    })
                  }
                  placeholder="noreply@psyche.ai"
                  className="w-full px-3 py-1.5 rounded-lg bg-surface-1 border border-border-subtle text-text-primary text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-text-secondary text-[11px]">
                  Gönderen Adı
                </label>
                <input
                  type="text"
                  value={settings.smtp.fromName}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      smtp: { ...settings.smtp, fromName: e.target.value },
                    })
                  }
                  placeholder="PsycheAI Scientific"
                  className="w-full px-3 py-1.5 rounded-lg bg-surface-1 border border-border-subtle text-text-primary text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* IMAP Settings */}
        <div className="p-4 rounded-xl border border-border-subtle bg-surface-2/40 space-y-3.5">
          <div className="flex items-center space-x-2 pb-2 border-b border-border-subtle">
            <Inbox className="w-4 h-4 text-brand-600" />
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
              IMAP Gelen Kutu Yapılandırması (Opsiyonel)
            </h4>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2 space-y-1">
                <label className="font-semibold text-text-secondary text-[11px]">
                  IMAP Sunucu (Host)
                </label>
                <input
                  type="text"
                  value={settings.imap.host}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      imap: { ...settings.imap, host: e.target.value },
                    })
                  }
                  placeholder="imap.gmail.com veya imap.domain.com"
                  className="w-full px-3 py-1.5 rounded-lg bg-surface-1 border border-border-subtle text-text-primary text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-text-secondary text-[11px]">
                  Port
                </label>
                <input
                  type="number"
                  value={settings.imap.port}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      imap: { ...settings.imap, port: parseInt(e.target.value, 10) || 993 },
                    })
                  }
                  placeholder="993"
                  className="w-full px-3 py-1.5 rounded-lg bg-surface-1 border border-border-subtle text-text-primary text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="imap-secure"
                checked={settings.imap.secure}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    imap: { ...settings.imap, secure: e.target.checked },
                  })
                }
                className="rounded text-brand-600 border-border-subtle"
              />
              <label htmlFor="imap-secure" className="text-[11px] text-text-secondary font-medium">
                SSL / TLS Güvenli Bağlantı (Port 993 için önerilir)
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-semibold text-text-secondary text-[11px]">
                  Kullanıcı Adı
                </label>
                <input
                  type="text"
                  value={settings.imap.user}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      imap: { ...settings.imap, user: e.target.value },
                    })
                  }
                  placeholder="user@domain.com"
                  className="w-full px-3 py-1.5 rounded-lg bg-surface-1 border border-border-subtle text-text-primary text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-text-secondary text-[11px]">
                  Parola
                </label>
                <input
                  type="password"
                  value={settings.imap.password}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      imap: { ...settings.imap, password: e.target.value },
                    })
                  }
                  placeholder="••••••••••••"
                  className="w-full px-3 py-1.5 rounded-lg bg-surface-1 border border-border-subtle text-text-primary text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border-subtle">
        {/* Test Email Form */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="Test e-posta adresi"
            className="px-3 py-1.5 rounded-xl bg-surface-1 border border-border-subtle text-xs text-text-primary focus:ring-1 focus:ring-brand-500 focus:outline-none w-full sm:w-64"
          />
          <button
            type="button"
            onClick={handleSendTest}
            disabled={isTestPending}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-surface-2 border border-border-subtle text-text-primary hover:bg-surface-3 transition-colors inline-flex items-center shrink-0 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5 mr-1 text-purple-600" />
            {isTestPending ? 'Gönderiliyor...' : 'Test Et'}
          </button>
        </div>

        {/* Save Settings Button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="px-5 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-colors inline-flex items-center justify-center shadow-xs disabled:opacity-50 shrink-0"
        >
          <Save className="w-4 h-4 mr-1.5" />
          {isPending ? 'Kaydediliyor...' : 'E-posta Ayarlarını Kaydet'}
        </button>
      </div>

      {testFeedback && (
        <div
          className={`p-3 rounded-xl border text-xs flex items-center space-x-2 ${
            testFeedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          {testFeedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{testFeedback.message}</span>
        </div>
      )}
    </div>
  );
};
