'use server';

import { requirePermission } from '@/lib/auth';
import { logAuthAuditEvent } from '@/lib/auditLog';
import { revalidatePath } from 'next/cache';
import {
  getSystemAISettings,
  updateSystemAISettings,
  SystemAISettings,
} from '@/services/systemSettingsService';
import {
  savePersistentAIKey,
  getResolvedAIKey,
  isAIKeyConfigured,
  getAIKeyLast4,
} from '@/lib/ai/config/aiSecretStore';
import { getAIConfig, ResolvedAIConfig } from '@/lib/ai/config/aiConfigResolver';

export interface AdminAIConfigView {
  aiEnabled: boolean;
  provider: 'DeepSeek';
  baseUrl: string;
  model: string;
  temperature: number;
  maxTokens: number;
  timeoutMs: number;
  consentEnforcement: boolean;
  deterministicFallback: boolean;
  apiKeyConfigured: boolean;
  apiKeyLast4?: string;
  isAvailable: boolean;
  lastConnectionTestAt?: string;
  lastConnectionTestStatus?: 'SUCCESS' | 'FAILED';
  lastConnectionTestLatencyMs?: number;
  lastConnectionTestMessage?: string;
}

export interface SaveAIConfigInput {
  aiEnabled?: boolean;
  baseUrl?: string;
  model?: string;
  apiKey?: string; // If empty/undefined, keeps existing key
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
  consentEnforcement?: boolean;
  deterministicFallback?: boolean;
}

export async function getAIConfigAdminAction(): Promise<{
  success: boolean;
  config?: AdminAIConfigView;
  error?: string;
}> {
  try {
    await requirePermission('SYSTEM_CONFIG');
    const resolved = await getAIConfig();

    return {
      success: true,
      config: {
        aiEnabled: resolved.aiEnabled,
        provider: 'DeepSeek',
        baseUrl: resolved.baseUrl,
        model: resolved.model,
        temperature: resolved.temperature,
        maxTokens: resolved.maxTokens,
        timeoutMs: resolved.timeoutMs,
        consentEnforcement: resolved.consentEnforcement,
        deterministicFallback: resolved.deterministicFallback,
        apiKeyConfigured: resolved.apiKeyConfigured,
        apiKeyLast4: resolved.apiKeyLast4,
        isAvailable: resolved.isAvailable,
        lastConnectionTestAt: resolved.lastConnectionTestAt,
        lastConnectionTestStatus: resolved.lastConnectionTestStatus,
        lastConnectionTestLatencyMs: resolved.lastConnectionTestLatencyMs,
        lastConnectionTestMessage: resolved.lastConnectionTestMessage,
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Yetkisiz erişim.' };
  }
}

export async function saveAIConfigAction(
  updates: SaveAIConfigInput
): Promise<{ success: boolean; config?: AdminAIConfigView; error?: string }> {
  try {
    const user = await requirePermission('SYSTEM_CONFIG');

    // 1. If a new API key was submitted, save it in the encrypted secret store
    if (updates.apiKey !== undefined && updates.apiKey.trim().length > 0) {
      await savePersistentAIKey(updates.apiKey.trim());
    }

    // 2. Update non-secret system AI settings
    const updatedSettings = await updateSystemAISettings(
      {
        aiEnabled: updates.aiEnabled,
        provider: 'DeepSeek',
        baseUrl: updates.baseUrl || 'https://api.deepseek.com',
        model: updates.model || 'deepseek-v4-flash',
        temperature: updates.temperature,
        maxTokens: updates.maxTokens,
        timeoutMs: updates.timeoutMs,
        consentEnforcement: updates.consentEnforcement,
        deterministicFallback: updates.deterministicFallback,
      },
      user.id
    );

    await logAuthAuditEvent({
      eventType: 'SYSTEM_SETTINGS_UPDATED',
      actorUserId: user.id,
      success: true,
      metadata: {
        settingType: 'AI_CONFIGURATION',
        aiEnabled: updatedSettings.aiEnabled,
        provider: 'DeepSeek',
        model: updatedSettings.model,
        apiKeyUpdated: Boolean(updates.apiKey && updates.apiKey.trim().length > 0),
      },
    });

    revalidatePath('/admin/ai-config');
    revalidatePath('/admin/system');

    const resolved = await getAIConfig();
    return {
      success: true,
      config: {
        aiEnabled: resolved.aiEnabled,
        provider: 'DeepSeek',
        baseUrl: resolved.baseUrl,
        model: resolved.model,
        temperature: resolved.temperature,
        maxTokens: resolved.maxTokens,
        timeoutMs: resolved.timeoutMs,
        consentEnforcement: resolved.consentEnforcement,
        deterministicFallback: resolved.deterministicFallback,
        apiKeyConfigured: resolved.apiKeyConfigured,
        apiKeyLast4: resolved.apiKeyLast4,
        isAvailable: resolved.isAvailable,
        lastConnectionTestAt: resolved.lastConnectionTestAt,
        lastConnectionTestStatus: resolved.lastConnectionTestStatus,
        lastConnectionTestLatencyMs: resolved.lastConnectionTestLatencyMs,
        lastConnectionTestMessage: resolved.lastConnectionTestMessage,
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Ayarlar kaydedilemedi.' };
  }
}

export async function testAIConnectionAction(candidateApiKey?: string): Promise<{
  success: boolean;
  httpStatus?: number;
  latencyMs?: number;
  resolvedModel?: string;
  message?: string;
  error?: string;
}> {
  const startTime = Date.now();
  try {
    const user = await requirePermission('SYSTEM_CONFIG');
    const settings = await getSystemAISettings();

    const apiKey = candidateApiKey && candidateApiKey.trim().length > 0
      ? candidateApiKey.trim()
      : await getResolvedAIKey();

    if (!apiKey) {
      return {
        success: false,
        error: 'API anahtarı bulunamadı. Lütfen önce bir API anahtarı giriniz.',
      };
    }

    const baseUrl = settings.baseUrl || 'https://api.deepseek.com';
    const model = settings.model || 'deepseek-v4-flash';
    const timeoutMs = 8000;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        max_tokens: 5,
        messages: [
          { role: 'system', content: 'Connection test ping.' },
          { role: 'user', content: 'Ping' },
        ],
      }),
    });

    clearTimeout(timeoutId);
    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      const status = response.status;
      const errorMsg = `DeepSeek API hata döndürdü (HTTP ${status})`;

      await updateSystemAISettings({
        lastConnectionTestAt: new Date().toISOString(),
        lastConnectionTestStatus: 'FAILED',
        lastConnectionTestLatencyMs: latencyMs,
        lastConnectionTestMessage: errorMsg,
      });

      return {
        success: false,
        httpStatus: status,
        latencyMs,
        resolvedModel: model,
        error: errorMsg,
      };
    }

    const rawJson = await response.json();
    const returnedModel = rawJson?.model || model;

    await updateSystemAISettings({
      lastConnectionTestAt: new Date().toISOString(),
      lastConnectionTestStatus: 'SUCCESS',
      lastConnectionTestLatencyMs: latencyMs,
      lastConnectionTestMessage: `Bağlantı başarılı (${latencyMs}ms)`,
    });

    await logAuthAuditEvent({
      eventType: 'AI_CONNECTION_TEST',
      actorUserId: user.id,
      success: true,
      metadata: {
        provider: 'DeepSeek',
        model: returnedModel,
        latencyMs,
      },
    });

    revalidatePath('/admin/ai-config');

    return {
      success: true,
      httpStatus: response.status,
      latencyMs,
      resolvedModel: returnedModel,
      message: `DeepSeek API bağlantısı başarıyla doğrulandı (${latencyMs}ms).`,
    };
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    const errorMsg = err?.name === 'AbortError'
      ? 'Bağlantı zaman aşımına uğradı (8000ms).'
      : err?.message || 'Bağlantı testi sırasında bir hata oluştu.';

    await updateSystemAISettings({
      lastConnectionTestAt: new Date().toISOString(),
      lastConnectionTestStatus: 'FAILED',
      lastConnectionTestLatencyMs: latencyMs,
      lastConnectionTestMessage: errorMsg,
    }).catch(() => {});

    return {
      success: false,
      latencyMs,
      error: errorMsg,
    };
  }
}
