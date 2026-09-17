/**
 * PsycheAI FAZ 2.19 — Theory Comparison Engine
 *
 * Facilitates multi-lens comparative synthesis across 2 or 3 theoretical perspectives
 * grounded in identical measured profile evidence.
 */

import {
  TheoryLensDefinition,
  ScopedLensEvidenceBundle,
  TheoryComparisonResult,
} from '@/types/theoryLens';
import { getAIConfig } from '@/lib/ai/config/aiConfigResolver';
import { buildTheoryComparisonPrompt } from './theoryPromptTemplates';
import { verifyTheoryComparison } from './theoryClaimVerifier';
import { generateFallbackTheoryComparison } from './theoryFallbackEngine';
import { getTheorySourcesForLens } from './theoryLensRegistry';

export async function compareTheoreticalLenses(
  lenses: TheoryLensDefinition[],
  bundle: ScopedLensEvidenceBundle,
  topicOrDomain?: string
): Promise<TheoryComparisonResult> {
  if (lenses.length < 2 || lenses.length > 3) {
    throw new Error('Theory comparison supports between 2 and 3 lenses.');
  }

  const config = await getAIConfig();

  // If AI is not available or fallback preferred, use deterministic comparison
  if (!config.isAvailable || !config.apiKey) {
    return generateFallbackTheoryComparison(lenses, bundle, topicOrDomain);
  }

  const { systemPrompt, userPrompt } = buildTheoryComparisonPrompt(
    lenses,
    bundle,
    topicOrDomain
  );

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs || 12000);

  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model || 'deepseek-v4-flash',
        temperature: config.temperature ?? 0.2,
        max_tokens: config.maxTokens ?? 4096,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.warn(`DeepSeek API returned ${response.status}. Falling back to deterministic comparison.`);
      return generateFallbackTheoryComparison(lenses, bundle, topicOrDomain);
    }

    const rawJson = await response.json();
    const content = rawJson?.choices?.[0]?.message?.content;
    if (!content) {
      return generateFallbackTheoryComparison(lenses, bundle, topicOrDomain);
    }

    const parsed = JSON.parse(content);
    const validatedResult: TheoryComparisonResult = {
      comparisonId: parsed.comparisonId || `comp_${Date.now()}`,
      comparedLensIds: lenses.map((l) => l.lensId),
      topicOrDomain: topicOrDomain || parsed.topicOrDomain || 'Kişilik Dinamikleri',
      lenses: lenses.map((lens) => {
        const matchingLensParsed = parsed.lenses?.find(
          (pl: any) => pl.lensId?.toUpperCase() === lens.lensId
        );
        return {
          lensId: lens.lensId,
          lensNameTr: lens.displayNameTr,
          theoristName: lens.theoristName,
          coreViewTr:
            matchingLensParsed?.coreViewTr ||
            `${lens.theoristName} açısından profil dinamikleri ve uyum.`,
          keyConceptsUsed:
            matchingLensParsed?.keyConceptsUsed ||
            lens.coreConcepts.map((c) => c.nameTr).slice(0, 3),
          epistemicSegments: matchingLensParsed?.epistemicSegments || [],
          sources: getTheorySourcesForLens(lens.lensId),
        };
      }),
      consensusPointsTr: parsed.consensusPointsTr || [
        'Kuramlar, profildeki temel eğilimlerin bireyin işlevsel uyumunu yansıttığı konusunda uzlaşır.',
      ],
      divergencePointsTr: parsed.divergencePointsTr || [
        'Kuramlar, odaklandıkları içsel ve çevresel mekanizmalar açısından farklılaşır.',
      ],
      integrativeSynthesisTr:
        parsed.integrativeSynthesisTr ||
        'Farklı kuramların sunduğu pencereler, bireyin kendini çok boyutlu anlamlandırmasını destekler.',
      evidenceRefs: bundle.scopedFacets.map((f) => f.code),
      isFallback: false,
      generatedAt: new Date().toISOString(),
    };

    const verifier = verifyTheoryComparison(validatedResult);
    if (!verifier.isValid) {
      console.warn('Theory comparison failed verification:', verifier.violations);
      return generateFallbackTheoryComparison(lenses, bundle, topicOrDomain);
    }

    return validatedResult;
  } catch (err) {
    clearTimeout(timeout);
    console.warn('Error during AI theory comparison, using fallback:', err);
    return generateFallbackTheoryComparison(lenses, bundle, topicOrDomain);
  }
}
