import { SemanticCluster, LexicalAnalysisReport, LexicalPair } from './types';

const TURKISH_STOP_WORDS = new Set([
  've', 'veya', 'ile', 'bir', 'bu', 'şu', 'o', 'için', 'de', 'da', 'ki',
  'gibi', 'kadar', 'daha', 'en', 'ise', 'mi', 'mı', 'mu', 'mü', 'ben', 'bana', 'beni', 'benim', 'kendimi', 'genellikle'
]);

// Closely related facet pairs with high cross-loading or semantic overlap risk
export const CLOSE_CONSTRUCT_PAIRS: Array<[string, string]> = [
  ['sincerity', 'authenticity'],
  ['fairness', 'honesty_humility'],
  ['anxiety', 'intolerance_of_uncertainty'],
  ['prudence', 'lack_of_premeditation'],
  ['diligence', 'grit_perseverance'],
  ['empathic_concern', 'sentimentality'],
  ['assertiveness', 'social_boldness'],
  ['trait_self_control', 'lack_of_premeditation']
];

export function tokenize(text: string): Set<string> {
  const clean = (text || '')
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'’]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !TURKISH_STOP_WORDS.has(w));
  return new Set(clean);
}

export function calculateJaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export interface CandidateItemWithFacet {
  id: string;
  facetId: string;
  text_tr: string;
}

/**
 * Performs rigorous Lexical Similarity Analysis (token-set Jaccard index)
 * both within facets and across closely related / cross-loading construct facets.
 *
 * NOTE: This is strictly a LEXICAL analysis. It does not measure latent semantic embeddings
 * or psychometric construct equivalence.
 */
export function analyzeLexicalClusters(
  items: CandidateItemWithFacet[],
  threshold = 0.70
): LexicalAnalysisReport {
  const tokenizedItems = items.map(it => ({
    item: it,
    tokens: tokenize(it.text_tr)
  }));

  const withinFacetDuplicates: LexicalPair[] = [];
  const crossFacetOverlaps: LexicalPair[] = [];

  for (let i = 0; i < tokenizedItems.length; i++) {
    for (let j = i + 1; j < tokenizedItems.length; j++) {
      const itemA = tokenizedItems[i];
      const itemB = tokenizedItems[j];

      const sim = calculateJaccardSimilarity(itemA.tokens, itemB.tokens);

      if (sim >= threshold) {
        const isCross = itemA.item.facetId !== itemB.item.facetId;
        const pair: LexicalPair = {
          itemAId: itemA.item.id,
          itemBId: itemB.item.id,
          itemAText: itemA.item.text_tr,
          itemBText: itemB.item.text_tr,
          facetA: itemA.item.facetId,
          facetB: itemB.item.facetId,
          isCrossFacet: isCross,
          similarityScore: Math.round(sim * 100) / 100
        };

        if (isCross) {
          crossFacetOverlaps.push(pair);
        } else {
          withinFacetDuplicates.push(pair);
        }
      }
    }
  }

  const total = withinFacetDuplicates.length + crossFacetOverlaps.length;
  const summaryTr = total === 0
    ? `Jaccard leksikal benzerlik eşiği (>= ${threshold}) üzerinde kopya veya çakışan çift bulunmadı.`
    : `Jaccard leksikal benzerlik eşiği üzerinde ${withinFacetDuplicates.length} facet-içi, ${crossFacetOverlaps.length} çapraz-facet çift tespit edildi.`;

  return {
    method: 'LEXICAL_SIMILARITY_ANALYSIS',
    threshold,
    withinFacetDuplicates,
    crossFacetOverlaps,
    totalDuplicatesDetected: total,
    semanticDuplicateStatus: 'NOT_ASSESSED',
    summaryTr
  };
}

/**
 * Backward compatible alias for analyzeLexicalClusters.
 */
export function analyzeSemanticClusters(
  items: CandidateItemWithFacet[],
  threshold = 0.70
) {
  const rep = analyzeLexicalClusters(items, threshold);
  return {
    method: rep.method,
    duplicatePairs: rep.withinFacetDuplicates.map(d => ({
      itemAId: d.itemAId,
      itemBId: d.itemBId,
      itemAText: d.itemAText,
      itemBText: d.itemBText,
      facetId: d.facetA,
      similarityScore: d.similarityScore
    })),
    facetClusters: {} as Record<string, SemanticCluster[]>,
    totalDuplicatesDetected: rep.totalDuplicatesDetected,
    crossFacetOverlaps: rep.crossFacetOverlaps,
    semanticDuplicateStatus: 'NOT_ASSESSED' as const,
    summaryTr: rep.summaryTr
  };
}
