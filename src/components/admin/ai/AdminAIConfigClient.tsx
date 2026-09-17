'use client';

import React, { useState } from 'react';
import {
  Bot,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Server,
  Zap,
  ShieldCheck,
  Cpu,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  AdminAIConfigView,
  SaveAIConfigInput,
  saveAIConfigAction,
  testAIConnectionAction,
} from '@/actions/adminAIConfigActions';

interface AdminAIConfigClientProps {
  initialConfig: AdminAIConfigView;
}

export const AdminAIConfigClient: React.FC<AdminAIConfigClientProps> = ({
  initialConfig,
}) => {
  const [config, setConfig] = useState<AdminAIConfigView>(initialConfig);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [saveErrorMsg, setSaveErrorMsg] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
    latencyMs?: number;
    httpStatus?: number;
    resolvedModel?: string;
  } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccessMsg(null);
    setSaveErrorMsg(null);

    const payload: SaveAIConfigInput = {
      aiEnabled: config.aiEnabled,
      baseUrl: config.baseUrl,
      model: config.model,
      temperature: Number(config.temperature),
      maxTokens: Number(config.maxTokens),
      timeoutMs: Number(config.timeoutMs),
      consentEnforcement: config.consentEnforcement,
      deterministicFallback: config.deterministicFallback,
    };

    if (apiKeyInput.trim().length > 0) {
      payload.apiKey = apiKeyInput.trim();
    }

    try {
      const res = await saveAIConfigAction(payload);
      if (res.success && res.config) {
        setConfig(res.config);
        setApiKeyInput('');
        setSaveSuccessMsg('Yapay zekâ konfigürasyonu başarıyla güncellendi.');
      } else {
        setSaveErrorMsg(res.error || 'Kaydetme sırasında bir hata oluştu.');
      }
    } catch (err: any) {
      setSaveErrorMsg(err.message || 'Beklenmeyen hata.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const candidateKey = apiKeyInput.trim().length > 0 ? apiKeyInput.trim() : undefined;
      const res = await testAIConnectionAction(candidateKey);
      setTestResult(res);
      if (res.success) {
        setConfig((prev) => ({
          ...prev,
          lastConnectionTestAt: new Date().toISOString(),
          lastConnectionTestStatus: 'SUCCESS',
          lastConnectionTestLatencyMs: res.latencyMs,
          lastConnectionTestMessage: res.message,
        }));
      } else {
        setConfig((prev) => ({
          ...prev,
          lastConnectionTestAt: new Date().toISOString(),
          lastConnectionTestStatus: 'FAILED',
          lastConnectionTestLatencyMs: res.latencyMs,
          lastConnectionTestMessage: res.error,
        }));
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        error: err.message || 'Bağlantı testi başarısız oldu.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Metric Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Engine Status */}
        <div className="bg-surface-1 p-5 rounded-panel border border-border-subtle shadow-xs space-y-2">
          <div className="flex items-center justify-between text-text-tertiary text-xs font-semibold">
            <span>AI Motor Durumu</span>
            <Bot className="w-4 h-4 text-brand-600" />
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                config.isAvailable
                  ? 'bg-emerald-500 animate-pulse'
                  : config.aiEnabled
                  ? 'bg-amber-500'
                  : 'bg-slate-400'
              }`}
            />
            <span className="text-lg font-bold text-text-primary">
              {config.isAvailable
                ? 'Aktif (Harici AI)'
                : config.aiEnabled
                ? 'Yapılandırılmamış'
                : 'Kapalı (Salt Kural)'}
            </span>
          </div>
          <p className="text-[11px] text-text-secondary">
            {config.isAvailable
              ? 'DeepSeek V4 Flash devrede.'
              : 'Deterministik yedek motor aktif.'}
          </p>
        </div>

        {/* Card 2: Provider & Model */}
        <div className="bg-surface-1 p-5 rounded-panel border border-border-subtle shadow-xs space-y-2">
          <div className="flex items-center justify-between text-text-tertiary text-xs font-semibold">
            <span>Sağlayıcı & Model</span>
            <Cpu className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-base font-bold text-text-primary truncate">
            {config.provider}
          </div>
          <div className="inline-flex items-center px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-mono font-bold">
            {config.model}
          </div>
        </div>

        {/* Card 3: API Key Status */}
        <div className="bg-surface-1 p-5 rounded-panel border border-border-subtle shadow-xs space-y-2">
          <div className="flex items-center justify-between text-text-tertiary text-xs font-semibold">
            <span>API Anahtarı Güvenliği</span>
            <KeyRound className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-center space-x-2">
            {config.apiKeyConfigured ? (
              <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Tanımlı ({config.apiKeyLast4 ? `••••${config.apiKeyLast4}` : 'AES-256'})
              </span>
            ) : (
              <span className="inline-flex items-center text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                Tanımlı Değil
              </span>
            )}
          </div>
          <p className="text-[11px] text-text-tertiary">
            Sunucuda AES-256-GCM ile şifrelenir.
          </p>
        </div>

        {/* Card 4: Last Test Status */}
        <div className="bg-surface-1 p-5 rounded-panel border border-border-subtle shadow-xs space-y-2">
          <div className="flex items-center justify-between text-text-tertiary text-xs font-semibold">
            <span>Son Bağlantı Testi</span>
            <Zap className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-sm font-bold text-text-primary">
            {config.lastConnectionTestStatus === 'SUCCESS' ? (
              <span className="text-emerald-600 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Başarılı {config.lastConnectionTestLatencyMs ? `(${config.lastConnectionTestLatencyMs}ms)` : ''}
              </span>
            ) : config.lastConnectionTestStatus === 'FAILED' ? (
              <span className="text-rose-600 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1" />
                Başarısız
              </span>
            ) : (
              <span className="text-text-tertiary">Henüz test edilmedi</span>
            )}
          </div>
          <p className="text-[11px] text-text-tertiary truncate">
            {config.lastConnectionTestAt
              ? new Date(config.lastConnectionTestAt).toLocaleTimeString('tr-TR')
              : 'Test kaydı yok'}
          </p>
        </div>
      </div>

      {/* 2. Scientific Boundary Alert */}
      <div className="p-4 rounded-panel bg-brand-50/50 border border-brand-200/60 flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-brand-700 shrink-0 mt-0.5" />
        <div className="text-xs text-brand-950 leading-relaxed space-y-1">
          <div className="font-bold text-brand-900">
            Sıfır AI Puanlaması & Bilimsel Ayrım İlkesi (FAZ 2.18)
          </div>
          <p>
            Yapay zekâ modeli psikometrik puan hesaplayamaz, değiştiremez veya eksik maddeleri dolduramaz.
            Model yalnızca doğrulanmış deterministik kanıtları pedagojik ve şefkatli Türkçe anlatıma dönüştürmek için kullanılır.
          </p>
        </div>
      </div>

      {/* 3. Main Configuration Form */}
      <form onSubmit={handleSave} className="bg-surface-1 p-6 rounded-panel border border-border-subtle shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
          <div>
            <h2 className="text-base font-bold text-text-primary">
              Yapay Zekâ Motoru & DeepSeek Parametreleri
            </h2>
            <p className="text-xs text-text-tertiary mt-0.5">
              Harici LLM entegrasyonunu ve deterministik yedek mekanizmasını yönetin.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting || (!config.apiKeyConfigured && apiKeyInput.trim().length === 0)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-border-subtle bg-surface-2 hover:bg-surface-1 text-text-primary transition-colors flex items-center space-x-1.5 disabled:opacity-50"
            >
              {isTesting ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-600" />
              ) : (
                <Zap className="w-3.5 h-3.5 text-brand-600" />
              )}
              <span>{isTesting ? 'Test Ediliyor...' : 'Bağlantıyı Test Et'}</span>
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
            </button>
          </div>
        </div>

        {/* Notifications */}
        {saveSuccessMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-900 flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600 shrink-0" />
            {saveSuccessMsg}
          </div>
        )}
        {saveErrorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-900 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 text-rose-600 shrink-0" />
            {saveErrorMsg}
          </div>
        )}
        {testResult && (
          <div
            className={`p-3.5 rounded-xl border text-xs font-medium flex items-start space-x-2 ${
              testResult.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 mr-1 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-bold">
                {testResult.success ? 'Bağlantı Başarılı' : 'Bağlantı Başarısız'}
              </div>
              <div className="text-[11px] mt-0.5">
                {testResult.message || testResult.error}
              </div>
            </div>
          </div>
        )}

        {/* Toggle Switches */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-surface-2/50 border border-border-subtle">
          {/* Switch 1: AI Enabled */}
          <div className="flex items-center justify-between space-x-3">
            <div>
              <label className="text-xs font-bold text-text-primary block">
                Harici AI Aktif
              </label>
              <span className="text-[10px] text-text-tertiary">
                DeepSeek sentezini etkinleştirir.
              </span>
            </div>
            <input
              type="checkbox"
              checked={config.aiEnabled}
              onChange={(e) => setConfig({ ...config, aiEnabled: e.target.checked })}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
            />
          </div>

          {/* Switch 2: Consent Enforcement */}
          <div className="flex items-center justify-between space-x-3">
            <div>
              <label className="text-xs font-bold text-text-primary block">
                Rıza Denetimi
              </label>
              <span className="text-[10px] text-text-tertiary">
                Kullanıcı rızası olmadan AI çağrısı yapılmaz.
              </span>
            </div>
            <input
              type="checkbox"
              checked={config.consentEnforcement}
              onChange={(e) => setConfig({ ...config, consentEnforcement: e.target.checked })}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
            />
          </div>

          {/* Switch 3: Deterministic Fallback */}
          <div className="flex items-center justify-between space-x-3">
            <div>
              <label className="text-xs font-bold text-text-primary block">
                Deterministik Yedek
              </label>
              <span className="text-[10px] text-text-tertiary">
                Hata anında kural tabanlı yoruma döner.
              </span>
            </div>
            <input
              type="checkbox"
              checked={config.deterministicFallback}
              onChange={(e) => setConfig({ ...config, deterministicFallback: e.target.checked })}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Provider */}
          <div>
            <label className="text-xs font-semibold text-text-secondary block mb-1">
              Sağlayıcı (Provider)
            </label>
            <input
              type="text"
              value={config.provider}
              disabled
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-surface-2 border border-border-subtle text-text-tertiary font-medium cursor-not-allowed"
            />
          </div>

          {/* Model */}
          <div>
            <label className="text-xs font-semibold text-text-secondary block mb-1">
              Model ID
            </label>
            <input
              type="text"
              value={config.model}
              onChange={(e) => setConfig({ ...config, model: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-surface-1 border border-border-subtle text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              placeholder="deepseek-v4-flash"
            />
          </div>

          {/* Base URL */}
          <div>
            <label className="text-xs font-semibold text-text-secondary block mb-1">
              API Base URL
            </label>
            <input
              type="url"
              value={config.baseUrl}
              onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-surface-1 border border-border-subtle text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              placeholder="https://api.deepseek.com"
            />
          </div>

          {/* API Key */}
          <div>
            <label className="text-xs font-semibold text-text-secondary block mb-1 flex items-center justify-between">
              <span>DeepSeek API Key</span>
              {config.apiKeyConfigured && (
                <span className="text-[10px] text-emerald-600 font-bold">
                  Mevcut: ••••••••{config.apiKeyLast4 || ''}
                </span>
              )}
            </label>
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-surface-1 border border-border-subtle text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              placeholder={
                config.apiKeyConfigured
                  ? 'Mevcut anahtarı korumak için boş bırakın veya yenisini yazın'
                  : 'sk-...'
              }
              autoComplete="off"
            />
          </div>

          {/* Temperature */}
          <div>
            <label className="text-xs font-semibold text-text-secondary block mb-1">
              Sıcaklık (Temperature: {config.temperature})
            </label>
            <input
              type="number"
              step="0.05"
              min="0.0"
              max="1.0"
              value={config.temperature}
              onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-surface-1 border border-border-subtle text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
            <span className="text-[10px] text-text-tertiary mt-0.5 block">
              Bilimsel tutarlılık için önerilen: 0.10 - 0.20
            </span>
          </div>

          {/* Max Output Tokens */}
          <div>
            <label className="text-xs font-semibold text-text-secondary block mb-1">
              Maksimum Yanıt Belirteci (Max Tokens)
            </label>
            <input
              type="number"
              step="256"
              min="512"
              max="8192"
              value={config.maxTokens}
              onChange={(e) => setConfig({ ...config, maxTokens: parseInt(e.target.value, 10) })}
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-surface-1 border border-border-subtle text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          {/* Timeout */}
          <div>
            <label className="text-xs font-semibold text-text-secondary block mb-1">
              İstek Zaman Aşımı (ms)
            </label>
            <input
              type="number"
              step="1000"
              min="2000"
              max="30000"
              value={config.timeoutMs}
              onChange={(e) => setConfig({ ...config, timeoutMs: parseInt(e.target.value, 10) })}
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-surface-1 border border-border-subtle text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
