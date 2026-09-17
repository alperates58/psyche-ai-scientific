/**
 * PsycheAI Single Source of Truth AI Configuration Resolver
 *
 * Centralized resolver combining:
 * 1. Encrypted admin/system settings
 * 2. Environment variable fallbacks
 * 3. Safe disabled state
 *
 * All AI Insight Engine V2 modules MUST use this resolver.
 */

import { getSystemAISettingsSync, getSystemAISettings, SystemAISettings } from '@/services/systemSettingsService';
import { getResolvedAIKey, isAIKeyConfigured, getAIKeyLast4 } from '@/lib/ai/config/aiSecretStore';

export interface ResolvedAIConfig {
  aiEnabled: boolean;
  provider: 'DeepSeek';
  baseUrl: string;
  model: string;
  apiKey: string | null;
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

export async function getAIConfig(): Promise<ResolvedAIConfig> {
  const settings = await getSystemAISettings();
  const apiKey = await getResolvedAIKey();
  const hasKey = isAIKeyConfigured();
  const last4 = getAIKeyLast4();

  const isAvailable = Boolean(settings.aiEnabled && hasKey && apiKey);

  return {
    aiEnabled: settings.aiEnabled,
    provider: 'DeepSeek',
    baseUrl: settings.baseUrl || 'https://api.deepseek.com',
    model: settings.model || 'deepseek-v4-flash',
    apiKey,
    temperature: settings.temperature ?? 0.15,
    maxTokens: settings.maxTokens ?? 4096,
    timeoutMs: settings.timeoutMs ?? 10000,
    consentEnforcement: settings.consentEnforcement ?? true,
    deterministicFallback: settings.deterministicFallback ?? true,
    apiKeyConfigured: hasKey,
    apiKeyLast4: last4,
    isAvailable,
    lastConnectionTestAt: settings.lastConnectionTestAt,
    lastConnectionTestStatus: settings.lastConnectionTestStatus,
    lastConnectionTestLatencyMs: settings.lastConnectionTestLatencyMs,
    lastConnectionTestMessage: settings.lastConnectionTestMessage,
  };
}

export function getAIConfigSync(): Omit<ResolvedAIConfig, 'apiKey'> {
  const settings = getSystemAISettingsSync();
  const hasKey = isAIKeyConfigured();
  const last4 = getAIKeyLast4();

  return {
    aiEnabled: settings.aiEnabled,
    provider: 'DeepSeek',
    baseUrl: settings.baseUrl || 'https://api.deepseek.com',
    model: settings.model || 'deepseek-v4-flash',
    temperature: settings.temperature ?? 0.15,
    maxTokens: settings.maxTokens ?? 4096,
    timeoutMs: settings.timeoutMs ?? 10000,
    consentEnforcement: settings.consentEnforcement ?? true,
    deterministicFallback: settings.deterministicFallback ?? true,
    apiKeyConfigured: hasKey,
    apiKeyLast4: last4,
    isAvailable: Boolean(settings.aiEnabled && hasKey),
    lastConnectionTestAt: settings.lastConnectionTestAt,
    lastConnectionTestStatus: settings.lastConnectionTestStatus,
    lastConnectionTestLatencyMs: settings.lastConnectionTestLatencyMs,
    lastConnectionTestMessage: settings.lastConnectionTestMessage,
  };
}

export const getDeepSeekConfig = getAIConfig;
