import { describe, it, expect } from 'vitest';
import { MASTER_DOMAINS, MASTER_FACETS } from '@/lib/profile/masterModelConstants';
import { getDomainIcon, getFacetIcon } from '@/lib/facetIcons';
import { generateFallbackInsight } from '@/lib/ai/providers/fallbackProvider';
import { AIInterpretationPlanV2 } from '@/types/aiInsightV2';

describe('Profile Information Architecture V3 & Depth Modes', () => {
  describe('Domain & Facet Icon System', () => {
    it('provides distinct Lucide icons for all 11 master domains', () => {
      expect(MASTER_DOMAINS.length).toBe(11);
      for (const d of MASTER_DOMAINS) {
        const icon = getDomainIcon(d.domainId);
        expect(icon).toBeDefined();
      }
    });

    it('resolves semantic icons for key psychological facets', () => {
      const sincerityIcon = getFacetIcon('sincerity');
      const anxietyIcon = getFacetIcon('anxiety');
      const curiosityIcon = getFacetIcon('epistemic_curiosity');

      expect(sincerityIcon).toBeDefined();
      expect(anxietyIcon).toBeDefined();
      expect(curiosityIcon).toBeDefined();
    });
  });

  describe('Deterministic Fallback AI Insight Generator with Depth Modes', () => {
    const mockPlan: AIInterpretationPlanV2 = {
      planId: 'test_plan_001',
      requestType: 'FACET_DEEP_DIVE',
      depthMode: 'GLANCE',
      primaryEvidence: [
        {
          evidenceType: 'FACET',
          sourceId: 'sincerity',
          titleTr: 'İçtenlik',
          numericValue: 4.4,
          bandLabelTr: 'Yüksek uca yakın',
          scientificRationaleTr: 'Kişilerarası ilişkilerde dürüst ve yapmacıksız olma eğilimi.',
        },
      ],
      supportingEvidence: [],
      tensionsOrSynergies: [],
      targetDomainIds: ['core_personality'],
      targetConstructIds: ['hexaco_honesty_humility'],
      targetFacetIds: ['sincerity'],
      requiredSections: ['summary', 'lifeImpact', 'reflectionQuestions'],
      reflectionQuestions: ['İçtenliğinizin en çok zorlandığı anlar nelerdir?'],
      epistemicRequirements: ['GROUNDED_IN_MEASUREMENT'],
      forbiddenTerms: ['klinik teşhis'],
    };

    it('generates a concise GLANCE mode insight', () => {
      const glancePlan: AIInterpretationPlanV2 = { ...mockPlan, depthMode: 'GLANCE' };
      const res = generateFallbackInsight(glancePlan);

      expect(res.depthMode).toBe('GLANCE');
      expect(res.headlineTr).toBeDefined();
      expect(res.summaryTr).toBeDefined();
      expect(res.whatStandsOut.length).toBeGreaterThan(0);
      expect(res.epistemicSegments.length).toBeGreaterThan(0);
      expect(res.groundedFacetIds).toContain('sincerity');
    });

    it('generates a rich NARRATIVE mode insight', () => {
      const narrativePlan: AIInterpretationPlanV2 = { ...mockPlan, depthMode: 'NARRATIVE' };
      const res = generateFallbackInsight(narrativePlan);

      expect(res.depthMode).toBe('NARRATIVE');
      expect(res.dailyLifePatterns.length).toBeGreaterThan(0);
      expect(res.reflectionQuestions.length).toBeGreaterThan(0);
    });

    it('generates a comprehensive DEEP_ANALYSIS mode insight with science details', () => {
      const deepPlan: AIInterpretationPlanV2 = { ...mockPlan, depthMode: 'DEEP_ANALYSIS' };
      const res = generateFallbackInsight(deepPlan);

      expect(res.depthMode).toBe('DEEP_ANALYSIS');
      expect(res.scientificEvidenceNotesTr).toBeDefined();
      expect(res.potentialBiasesOrCaveatsTr).toBeDefined();
    });
  });
});
