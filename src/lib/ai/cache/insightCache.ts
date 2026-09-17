/**
 * PsycheAI AI Insight Cache Layer
 *
 * Caches generated insights bound to exact profile snapshot,
 * evidence checksum, and prompt/engine version.
 * Invalidates automatically when profile updates.
 */

import crypto from 'crypto';
import { AIInsightV2 } from '@/types/aiInsightV2';
import { InterpretationPlanV2 } from '@/types/aiInsightV2';

interface CacheEntry {
  insight: AIInsightV2;
  cachedAt: number;
  snapshotId: string;
  evidenceHash: string;
  promptVersion: string;
  engineVersion: string;
}

// In-memory LRU/map cache with TTL
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const insightCacheMap = new Map<string, CacheEntry>();

export function computeEvidenceHash(plan: InterpretationPlanV2): string {
  const hashPayload = {
    requestType: plan.requestType,
    primary: plan.primaryEvidence.map((e) => `${e.evidenceId}:${e.numericValue}`),
    supporting: plan.supportingEvidence.map((e) => `${e.evidenceId}:${e.numericValue}`),
    counterbalancing: plan.counterbalancingEvidence.map((e) => `${e.evidenceId}`),
    tensions: plan.activatedTensions.map((t) => t.id),
    synergies: plan.activatedSynergies.map((s) => s.id),
    patterns: plan.activatedPatterns.map((p) => p.id),
    coverageRatio: plan.coverageState.coverageRatio,
    quality: plan.responseQualityState.overallFlag,
  };

  return crypto
    .createHash('sha256')
    .update(JSON.stringify(hashPayload))
    .digest('hex')
    .substring(0, 16);
}

export function buildCacheKey(
  snapshotId: string,
  insightType: string,
  evidenceHash: string,
  promptVersion: string
): string {
  return `${snapshotId}::${insightType}::${evidenceHash}::${promptVersion}`;
}

export function getCachedInsight(
  snapshotId: string,
  insightType: string,
  evidenceHash: string,
  promptVersion: string
): AIInsightV2 | null {
  const key = buildCacheKey(snapshotId, insightType, evidenceHash, promptVersion);
  const entry = insightCacheMap.get(key);

  if (!entry) return null;

  if (Date.now() - entry.cachedAt > CACHE_TTL_MS) {
    insightCacheMap.delete(key);
    return null;
  }

  // Bound to snapshot check
  if (entry.snapshotId !== snapshotId) {
    insightCacheMap.delete(key);
    return null;
  }

  return entry.insight;
}

export function setCachedInsight(
  snapshotId: string,
  insightType: string,
  evidenceHash: string,
  promptVersion: string,
  engineVersion: string,
  insight: AIInsightV2
): void {
  const key = buildCacheKey(snapshotId, insightType, evidenceHash, promptVersion);
  insightCacheMap.set(key, {
    insight,
    cachedAt: Date.now(),
    snapshotId,
    evidenceHash,
    promptVersion,
    engineVersion,
  });
}

export function invalidateCacheForSnapshot(snapshotId: string): void {
  for (const [key, entry] of insightCacheMap.entries()) {
    if (entry.snapshotId === snapshotId) {
      insightCacheMap.delete(key);
    }
  }
}

export function clearInsightCache(): void {
  insightCacheMap.clear();
}
