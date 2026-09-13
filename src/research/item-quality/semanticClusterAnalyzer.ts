import { SemanticCluster } from './types';

const TURKISH_STOP_WORDS = new Set([
  've', 'veya', 'ile', 'bir', 'bu', 'şu', 'o', 'için', 'de', 'da', 'ki',
  'gibi', 'kadar', 'daha', 'en', 'ise', 'mi', 'mı', 'mu', 'mü', 'ben', 'bana', 'beni', 'benim', 'kendimi', 'genellikle'
]);

function tokenize(text: string): Set<string> {
  const clean = text
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'’]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !TURKISH_STOP_WORDS.has(w));
  return new Set(clean);
}

function calculateJaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
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

export interface SemanticAnalysisReport {
  duplicatePairs: Array<{
    itemAId: string;
    itemBId: string;
    itemAText: string;
    itemBText: string;
    facetId: string;
    similarityScore: number;
  }>;
  facetClusters: Record<string, SemanticCluster[]>;
  totalDuplicatesDetected: number;
}

/**
 * Analyzes candidate items within each facet to find duplicate or near-duplicate clusters.
 */
export function analyzeSemanticClusters(
  items: CandidateItemWithFacet[],
  threshold = 0.65
): SemanticAnalysisReport {
  // Group items by facet
  const byFacet: Record<string, CandidateItemWithFacet[]> = {};
  for (const it of items) {
    if (!byFacet[it.facetId]) byFacet[it.facetId] = [];
    byFacet[it.facetId].push(it);
  }

  const duplicatePairs: SemanticAnalysisReport['duplicatePairs'] = [];
  const facetClusters: Record<string, SemanticCluster[]> = {};

  for (const [facetId, facetItems] of Object.entries(byFacet)) {
    const itemTokens = facetItems.map(it => ({
      item: it,
      tokens: tokenize(it.text_tr)
    }));

    const clusters: SemanticCluster[] = [];
    const visited = new Set<string>();

    for (let i = 0; i < itemTokens.length; i++) {
      for (let j = i + 1; j < itemTokens.length; j++) {
        const itemA = itemTokens[i];
        const itemB = itemTokens[j];
        const sim = calculateJaccardSimilarity(itemA.tokens, itemB.tokens);

        if (sim >= threshold) {
          duplicatePairs.push({
            itemAId: itemA.item.id,
            itemBId: itemB.item.id,
            itemAText: itemA.item.text_tr,
            itemBText: itemB.item.text_tr,
            facetId,
            similarityScore: Math.round(sim * 100) / 100
          });

          // Form or add to cluster
          const clusterId = `cluster_${facetId}_${clusters.length + 1}`;
          clusters.push({
            clusterId,
            facetId,
            itemIds: [itemA.item.id, itemB.item.id],
            themeDescription: `Anlamsal Yakınlık Kümesi (Benzerlik: %${Math.round(sim * 100)})`,
            pairSimilarities: [
              {
                itemA: itemA.item.id,
                itemB: itemB.item.id,
                similarityScore: sim
              }
            ]
          });
        }
      }
    }

    facetClusters[facetId] = clusters;
  }

  return {
    duplicatePairs,
    facetClusters,
    totalDuplicatesDetected: duplicatePairs.length
  };
}
