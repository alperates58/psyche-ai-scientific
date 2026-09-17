/**
 * PsycheAI DeepSeek V4 Flash Provider Adapter
 *
 * Implements AIInsightProvider using DeepSeek OpenAI-compatible Chat Completions API.
 * Uses strict JSON object response format and Zod schema parsing.
 */

import { AIInsightProvider } from './providerInterface';
import { InterpretationPlanV2, AIInsightV2, AIInsightV2Schema } from '@/types/aiInsightV2';
import { ResolvedAIConfig } from '@/lib/ai/config/aiConfigResolver';
import {
  SYSTEM_GOVERNANCE_PROMPT_V2,
  PROMPT_VERSION_ID,
  PROMPT_ENGINE_VERSION,
  buildInterpretationTaskPrompt,
} from '@/lib/ai/prompts/promptTemplatesV2';

export class DeepSeekInsightProvider implements AIInsightProvider {
  readonly name = 'DeepSeek';

  async generateStructuredInsight(
    plan: InterpretationPlanV2,
    config: ResolvedAIConfig
  ): Promise<AIInsightV2> {
    if (!config.apiKey) {
      throw new Error('DeepSeek API key is not configured.');
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.timeoutMs || 10000);

    try {
      const userContent = buildInterpretationTaskPrompt(plan);

      const response = await fetch(`${config.baseUrl}/chat/completions`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model: config.model || 'deepseek-v4-flash',
          temperature: config.temperature ?? 0.15,
          max_tokens: config.maxTokens ?? 4096,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: SYSTEM_GOVERNANCE_PROMPT_V2 },
            { role: 'user', content: userContent },
          ],
        }),
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`DeepSeek API returned HTTP ${response.status}: ${response.statusText}`);
      }

      const rawJson = await response.json();
      const content = rawJson?.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('DeepSeek returned empty message content.');
      }

      const parsed = JSON.parse(content);
      const validated = AIInsightV2Schema.parse({
        ...parsed,
        insightId: parsed.insightId || `insight_${plan.requestType.toLowerCase()}_${Date.now()}`,
        type: plan.requestType,
        generatedAt: new Date().toISOString(),
        modelProvider: 'DeepSeek',
        modelName: config.model || 'deepseek-v4-flash',
        promptVersion: PROMPT_VERSION_ID,
        engineVersion: PROMPT_ENGINE_VERSION,
        isFallback: false,
      });

      return validated;
    } catch (err: any) {
      clearTimeout(timeout);
      if (err?.name === 'AbortError') {
        throw new Error(`DeepSeek API request timed out after ${config.timeoutMs}ms`);
      }
      throw err;
    }
  }
}

export const deepSeekProvider = new DeepSeekInsightProvider();
