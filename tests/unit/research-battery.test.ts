import { describe, it, expect } from 'vitest';
import { runResearchBatteryAudit } from '../../scripts/audit-research-battery';
import { runResearchSourcesAudit } from '../../scripts/audit-research-sources';
import fs from 'fs';
import path from 'path';

describe('FAZ 2.16.1 — PsycheAI Native Scientific Research Battery Tests', () => {
  const batteryDir = path.resolve(__dirname, '../../data/research-battery');

  it('should pass full research battery audit with zero errors', () => {
    const auditResult = runResearchBatteryAudit();
    expect(auditResult.success).toBe(true);
    expect(auditResult.errors).toHaveLength(0);
    expect(auditResult.metrics.totalBlueprints).toBe(91);
    expect(auditResult.metrics.totalPsychologicalItems).toBe(455);
    expect(auditResult.metrics.totalResponseQualityItems).toBe(14);
    expect(auditResult.metrics.totalItemBankCount).toBe(469);
    expect(auditResult.metrics.coverageCompletenessPercent).toBe(100);
    expect(auditResult.metrics.existingBankReviewedCount).toBe(832);
  });

  it('should pass scientific sources audit with zero unresolved references', () => {
    const sourcesResult = runResearchSourcesAudit();
    expect(sourcesResult.success).toBe(true);
    expect(sourcesResult.errors).toHaveLength(0);
    expect(sourcesResult.metrics.totalSources).toBeGreaterThanOrEqual(100);
    expect(sourcesResult.metrics.unresolvedSourceReferences).toBe(0);
  });

  it('should verify deterministic scoring rule integrity for all facets', () => {
    const scoringData = JSON.parse(fs.readFileSync(path.join(batteryDir, 'psycheai-scoring-v1.json'), 'utf8'));
    expect(scoringData.facetsScoring).toHaveLength(91);

    scoringData.facetsScoring.forEach((f: any) => {
      expect(f.itemCount).toBe(5);
      expect(f.scoreRange.min).toBe(1.0);
      expect(f.scoreRange.max).toBe(5.0);
      expect(f.positiveItemIds.length + f.reverseKeyedItemIds.length).toBe(5);
      expect(f.positiveItemIds.length).toBeGreaterThanOrEqual(3);
      expect(f.reverseKeyedItemIds.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('should verify response quality subsystem structure', () => {
    const itemBankData = JSON.parse(fs.readFileSync(path.join(batteryDir, 'psycheai-item-bank-v1.json'), 'utf8'));
    const qualityItems = itemBankData.items.filter((i: any) => i.itemCategory === 'RESPONSE_QUALITY');
    expect(qualityItems.length).toBe(14);

    const attentionChecks = qualityItems.filter((i: any) => i.qualityType === 'ATTENTION_CHECK');
    const pairChecks = qualityItems.filter((i: any) => i.qualityType === 'PAIRED_CONSISTENCY');
    const infreqChecks = qualityItems.filter((i: any) => i.qualityType === 'INFREQUENCY_CHECK');

    expect(attentionChecks.length).toBe(4);
    expect(pairChecks.length).toBe(6);
    expect(infreqChecks.length).toBe(4);
  });
});
