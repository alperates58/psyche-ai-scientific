/**
 * PsycheAI FAZ 2.19 — Theory Lens & Kuramsal Konsil Service
 *
 * Authoritative orchestrator for Evidence-Grounded Historical & Theoretical Interpretation Layer.
 *
 * Invariants:
 * - Single source of truth: Consumes resolveUnifiedPsychologicalProfileV2.
 * - AI sits strictly at interpretation layer and never computes scores or diagnoses.
 * - Epistemic provenance: MEASURED_FINDING, THEORETICAL_INTERPRETATION, USER_PROVIDED_CONTEXT, REFLECTIVE_HYPOTHESIS.
 * - Seamless DeepSeek V4 Flash integration with 100% reliable deterministic fallback.
 */

import { resolveUnifiedPsychologicalProfileV2 } from '@/lib/profile/masterProfileResolver';
import {
  TheoryLensId,
  TheoryLensDefinition,
  TheorySource,
  TheoryInsightV1,
  TheoryInsightV1Schema,
  TheoryConversationResponseV1,
  TheoryConversationResponseSchema,
  TheoryComparisonResult,
} from '@/types/theoryLens';
import {
  getAllTheoryLenses,
  getTheoryLens,
  getAllTheorySources,
  getTheorySourcesForLens,
  isTheoryLensId,
} from '@/lib/ai/theoryLens/theoryLensRegistry';
import { buildScopedLensEvidenceBundle } from '@/lib/ai/theoryLens/theoryLensAdapter';
import {
  buildTheoryInterpretationPrompt,
  buildTheoryChatPrompt,
} from '@/lib/ai/theoryLens/theoryPromptTemplates';
import {
  verifyTheoryInsight,
  verifyTheoryConversation,
} from '@/lib/ai/theoryLens/theoryClaimVerifier';
import {
  generateFallbackTheoryInsight,
  generateFallbackTheoryChatResponse,
} from '@/lib/ai/theoryLens/theoryFallbackEngine';
import { compareTheoreticalLenses } from '@/lib/ai/theoryLens/theoryComparisonEngine';
import { getAIConfig } from '@/lib/ai/config/aiConfigResolver';
import {
  getCachedInsight,
  setCachedInsight,
} from '@/lib/ai/cache/insightCache';

// Dedicated in-memory cache for theory insights
const theoryInsightCache = new Map<string, { data: TheoryInsightV1; expiresAt: number }>();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

export function getAvailableTheoryLenses(): TheoryLensDefinition[] {
  return getAllTheoryLenses();
}

export function getTheoryLensById(lensId: string): TheoryLensDefinition | null {
  return getTheoryLens(lensId);
}

export function getTheorySources(lensId?: string): TheorySource[] {
  if (lensId) {
    return getTheorySourcesForLens(lensId);
  }
  return getAllTheorySources();
}

/**
 * Generates an evidence-grounded theoretical interpretation for a user profile under a chosen lens.
 */
export async function generateTheoryInsight(
  userId: string,
  lensId: TheoryLensId | string
): Promise<TheoryInsightV1> {
  const lens = getTheoryLens(lensId);
  if (!lens) {
    throw new Error(`Invalid theory lens requested: ${lensId}`);
  }

  // 1. Authoritative Unified Profile V2
  const profile = await resolveUnifiedPsychologicalProfileV2(userId);

  // 2. Scoped Evidence Bundle
  const scopedBundle = buildScopedLensEvidenceBundle(profile, lens.lensId);
  const sources = getTheorySourcesForLens(lens.lensId);

  // 3. Cache Check
  const cacheKey = `theory:${userId}:${lens.lensId}:${profile.generatedAt}`;
  const cached = theoryInsightCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  // 4. AI Config Check
  const config = await getAIConfig();

  let insight: TheoryInsightV1 | null = null;

  if (config.isAvailable && config.apiKey) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.timeoutMs || 10000);

    try {
      const { systemPrompt, userPrompt } = buildTheoryInterpretationPrompt(
        lens,
        scopedBundle
      );

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
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
        }),
      });

      clearTimeout(timeout);

      if (response.ok) {
        const rawJson = await response.json();
        const content = rawJson?.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          const parsedInsight = TheoryInsightV1Schema.parse({
            ...parsed,
            insightId: parsed.insightId || `ti_${lens.lensId.toLowerCase()}_${Date.now()}`,
            lensId: lens.lensId,
            generatedAt: new Date().toISOString(),
            modelProvider: 'DeepSeek',
            modelName: config.model || 'deepseek-v4-flash',
            isFallback: false,
          });

          const fullInsight: TheoryInsightV1 = {
            ...parsedInsight,
            sourcesUsed: sources,
            groundedFacetDetails: scopedBundle.scopedFacets,
          };

          const verification = verifyTheoryInsight(fullInsight);
          if (verification.isValid) {
            insight = fullInsight;
          } else {
            console.warn(
              `Theory insight failed governance verification:`,
              verification.violations
            );
          }
        }
      } else {
        console.warn(`DeepSeek API returned HTTP ${response.status} for theory insight.`);
      }
    } catch (err) {
      clearTimeout(timeout);
      console.warn('Error fetching DeepSeek theory insight, falling back to deterministic:', err);
    }
  }

  // 5. Safe Deterministic Fallback if AI output not available
  if (!insight) {
    insight = generateFallbackTheoryInsight(lens, scopedBundle);
  }

  // 6. Cache and Return
  theoryInsightCache.set(cacheKey, {
    data: insight,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });

  return insight;
}

/**
 * Conducts an interactive theoretical reflection dialogue with the user under a chosen lens.
 */
export async function sendTheoryChatMessage(
  userId: string,
  lensId: TheoryLensId | string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
  userMessage: string
): Promise<TheoryConversationResponseV1> {
  const lens = getTheoryLens(lensId);
  if (!lens) {
    throw new Error(`Invalid theory lens requested: ${lensId}`);
  }

  const profile = await resolveUnifiedPsychologicalProfileV2(userId);
  const scopedBundle = buildScopedLensEvidenceBundle(profile, lens.lensId);
  const sources = getTheorySourcesForLens(lens.lensId);

  const config = await getAIConfig();

  if (config.isAvailable && config.apiKey) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.timeoutMs || 10000);

    try {
      const { systemPrompt, userPrompt } = buildTheoryChatPrompt(
        lens,
        scopedBundle,
        conversationHistory,
        userMessage
      );

      const response = await fetch(`${config.baseUrl}/chat/completions`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model: config.model || 'deepseek-v4-flash',
          temperature: config.temperature ?? 0.25,
          max_tokens: config.maxTokens ?? 3000,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
        }),
      });

      clearTimeout(timeout);

      if (response.ok) {
        const rawJson = await response.json();
        const content = rawJson?.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          const parsedResponse = TheoryConversationResponseSchema.parse({
            ...parsed,
            lensId: lens.lensId,
            isFallback: false,
            modelProvider: 'DeepSeek',
            modelName: config.model || 'deepseek-v4-flash',
          });

          const fullResponse: TheoryConversationResponseV1 = {
            ...parsedResponse,
            sourcesUsed: sources,
          };

          const verification = verifyTheoryConversation(fullResponse);
          if (verification.isValid) {
            return fullResponse;
          }
          console.warn(
            'Theory chat response failed governance verification:',
            verification.violations
          );
        }
      }
    } catch (err) {
      clearTimeout(timeout);
      console.warn('Error in DeepSeek theory chat, falling back to deterministic:', err);
    }
  }

  return generateFallbackTheoryChatResponse(lens, scopedBundle, userMessage);
}

/**
 * Conducts a multi-theory comparative evaluation over the user's measured profile.
 */
export async function compareTheoryLensesService(
  userId: string,
  lensIds: Array<TheoryLensId | string>,
  topicOrDomain?: string
): Promise<TheoryComparisonResult> {
  const resolvedLenses: TheoryLensDefinition[] = [];
  for (const id of lensIds) {
    const lens = getTheoryLens(id);
    if (lens) {
      resolvedLenses.push(lens);
    }
  }

  if (resolvedLenses.length < 2) {
    throw new Error('At least 2 valid theory lenses are required for comparison.');
  }

  const profile = await resolveUnifiedPsychologicalProfileV2(userId);
  const primaryLensId = resolvedLenses[0].lensId;
  const scopedBundle = buildScopedLensEvidenceBundle(profile, primaryLensId);

  return compareTheoreticalLenses(resolvedLenses, scopedBundle, topicOrDomain);
}
