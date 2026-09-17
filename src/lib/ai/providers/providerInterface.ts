/**
 * PsycheAI AI Insight Provider Interface
 */

import { InterpretationPlanV2, AIInsightV2 } from '@/types/aiInsightV2';
import { ResolvedAIConfig } from '@/lib/ai/config/aiConfigResolver';

export interface AIInsightProvider {
  readonly name: string;
  generateStructuredInsight(
    plan: InterpretationPlanV2,
    config: ResolvedAIConfig
  ): Promise<AIInsightV2>;
}
