import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUserOrNull } from '@/lib/auth';
import { hasPermission } from '@/lib/rbac';
import { getAIConfig } from '@/lib/ai/config/aiConfigResolver';
import { AdminAIConfigClient } from '@/components/admin/ai/AdminAIConfigClient';
import { PageContainer } from '@/components/ui/PageContainer';
import { Bot } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Yapay Zekâ Konfigürasyonu — PsycheAI Admin',
  description: 'DeepSeek V4 Flash entegrasyonu ve yorum motoru yönetim kontrol düzlemi',
};

export default async function AdminAIConfigPage() {
  const user = await getCurrentUserOrNull();
  if (!user) {
    redirect('/login?callbackUrl=/admin/ai-config');
  }

  if (!hasPermission(user.roles, 'ADMIN_ACCESS')) {
    redirect('/admin');
  }

  const resolvedConfig = await getAIConfig();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-700 border border-brand-200/60 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary tracking-tight">
                Yapay Zekâ Konfigürasyonu
              </h1>
              <p className="text-xs text-text-tertiary">
                PLATFORM & ALTYAPI &bull; DeepSeek V4 Flash & Deterministik Sentez Kontrolü
              </p>
            </div>
          </div>
        </div>
      </div>

      <AdminAIConfigClient
        initialConfig={{
          aiEnabled: resolvedConfig.aiEnabled,
          provider: 'DeepSeek',
          baseUrl: resolvedConfig.baseUrl,
          model: resolvedConfig.model,
          temperature: resolvedConfig.temperature,
          maxTokens: resolvedConfig.maxTokens,
          timeoutMs: resolvedConfig.timeoutMs,
          consentEnforcement: resolvedConfig.consentEnforcement,
          deterministicFallback: resolvedConfig.deterministicFallback,
          apiKeyConfigured: resolvedConfig.apiKeyConfigured,
          apiKeyLast4: resolvedConfig.apiKeyLast4,
          isAvailable: resolvedConfig.isAvailable,
          lastConnectionTestAt: resolvedConfig.lastConnectionTestAt,
          lastConnectionTestStatus: resolvedConfig.lastConnectionTestStatus,
          lastConnectionTestLatencyMs: resolvedConfig.lastConnectionTestLatencyMs,
          lastConnectionTestMessage: resolvedConfig.lastConnectionTestMessage,
        }}
      />
    </div>
  );
}
