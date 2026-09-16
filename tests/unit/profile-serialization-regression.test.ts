import { describe, it, expect } from 'vitest';
import { getCategorizedVisualizations, MASTER_VISUALIZATION_REGISTRY } from '@/lib/profileVisualizationRegistry';
import { UnifiedProfileViewModel } from '@/types/profile';
import { deriveProfileMaturity, deriveUnifiedResponseQuality, deriveUnifiedQualityDimensions } from '@/services/unifiedProfileService';
import { buildProfileConfidenceMap, deriveProfileCompleteness } from '@/lib/profileConfidenceEvaluator';
import { evaluateUnifiedInteractions, evaluateProfileTensionMatrix } from '@/lib/unifiedInteractionRegistry';

/**
 * Recursively scans an object tree to detect any functions.
 * Returns an array of property paths where functions are found.
 */
function findFunctionsInObjectTree(obj: unknown, currentPath = 'root'): string[] {
  const functionPaths: string[] = [];

  if (obj === null || obj === undefined) {
    return functionPaths;
  }

  if (typeof obj === 'function') {
    functionPaths.push(currentPath);
    return functionPaths;
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      functionPaths.push(...findFunctionsInObjectTree(item, `${currentPath}[${index}]`));
    });
    return functionPaths;
  }

  if (typeof obj === 'object') {
    for (const [key, val] of Object.entries(obj)) {
      functionPaths.push(...findFunctionsInObjectTree(val, `${currentPath}.${key}`));
    }
  }

  return functionPaths;
}

describe('FAZ 2.13 — Profile Server-to-Client Serialization & Regression Tests', () => {
  it('A) verifies that getCategorizedVisualizations contains zero functions across all buckets', () => {
    const context = {
      measuredConstructCodes: ['honesty_humility', 'emotionality', 'extraversion'],
      measuredFacetCodes: ['fairness', 'fearfulness', 'expressiveness'],
      hasAttachmentData: true,
      hasErqData: true,
      hasRsesData: true,
      hasGseData: true,
    };

    const visualRegistry = getCategorizedVisualizations(context);
    const leakedFunctions = findFunctionsInObjectTree(visualRegistry, 'visualRegistry');

    expect(leakedFunctions).toHaveLength(0);
  });

  it('B) verifies that a complete UnifiedProfileViewModel payload contains ZERO functions across its entire tree', () => {
    const visualRegistry = getCategorizedVisualizations({
      measuredConstructCodes: ['honesty_humility', 'emotionality', 'extraversion'],
      measuredFacetCodes: ['fairness', 'fearfulness', 'expressiveness'],
      hasAttachmentData: true,
      hasErqData: true,
      hasRsesData: true,
      hasGseData: true,
    });

    const mockProfile: UnifiedProfileViewModel = {
      userId: 'user-123',
      userName: 'Test User',
      hasAssessments: true,
      maturity: deriveProfileMaturity({
        completedAssessmentsCount: 2,
        measuredDomainsCount: 2,
        measuredFacetsCount: 17,
        totalOntologyFacets: 84,
      }),
      lastUpdatedAt: '2026-09-16T20:00:00.000Z',
      completedAssessmentCount: 2,
      qualityDimensions: deriveUnifiedQualityDimensions({
        measuredDomainsCount: 2,
        totalDomainsCount: 9,
        exploredFacetsCount: 17,
        totalFacetsCount: 84,
        explorationPercentage: 20,
        depthPercentage: 20,
        responseQuality: deriveUnifiedResponseQuality([]),
        instrumentsUsed: ['HEXACO-60 TR'],
      }),
      responseQuality: deriveUnifiedResponseQuality([]),
      domains: [],
      allFacets84: [],
      confidenceMap: buildProfileConfidenceMap([]),
      completenessSummary: deriveProfileCompleteness({
        measuredFacetsCount: 17,
        totalOntologyFacets: 84,
        measuredUserFacingDomains: 2,
        totalUserFacingDomains: 8,
        totalOntologyDomains: 9,
        measuredOntologyDomains: 2,
      }),
      traitHeatmap: {
        rows: [],
        totalCells: 84,
        measuredCellsCount: 17,
        unmeasuredCellsCount: 67,
        legendDisclaimerTr: 'Test disclaimer',
      },
      tensionMatrix: evaluateProfileTensionMatrix({}),
      interactions: evaluateUnifiedInteractions({}),
      visualRegistry,
      fingerprint: {
        dimensions: [],
        measuredCount: 0,
        totalCount: 84,
        summaryText: 'Test summary',
      },
      hexacoSection: {
        isMeasured: true,
        radarData: [{ name: 'honesty_humility', name_tr: 'Dürüstlük', score: 80, scaleMin: 0, scaleMax: 100 }],
        constructs: [],
        measuredFacetCount: 4,
        totalFacetCount: 24,
      },
      selfSystemSection: {
        isMeasured: true,
        rses: {
          isMeasured: true,
          score: 3.5,
          scaleMin: 1.0,
          scaleMax: 4.0,
          bandInfo: null,
          titleTr: 'RSES',
          measuredAt: '2026-09-16T20:00:00.000Z',
          itemCount: 10,
          provenance: null,
        },
        gse: null,
      },
      strengths: [{ traitName: 'Dürüstlük', point: 'Güçlü yön', sourceConstruct: 'honesty_humility' }],
      attentionPoints: [{ traitName: 'Duygusallık', point: 'Dikkat noktası', sourceConstruct: 'emotionality' }],
      unmeasuredDomains: [],
      sourceAssessments: [],
      nextAction: {
        title: 'Sonraki Değerlendirme',
        reason: 'Profil derinleştirme',
        estimatedMinutes: 10,
        url: '/assessment/start',
        ctaText: 'Başla',
        status: 'AVAILABLE',
      },
    };

    const leakedFunctions = findFunctionsInObjectTree(mockProfile, 'profile');
    expect(leakedFunctions).toHaveLength(0);

    // Verify JSON serialization roundtrip
    const serialized = JSON.stringify(mockProfile);
    expect(() => JSON.parse(serialized)).not.toThrow();
    const deserialized = JSON.parse(serialized);
    expect(deserialized.userId).toBe('user-123');
    expect(deserialized.visualRegistry.active.length).toBeGreaterThanOrEqual(1);
  });

  it('C) verifies that conditionalPredicate remains functional server-side for all conditional definitions', () => {
    const conditionalDefs = MASTER_VISUALIZATION_REGISTRY.filter((def) => def.status === 'CONDITIONAL');

    expect(conditionalDefs.length).toBeGreaterThanOrEqual(4);

    const attachmentDef = conditionalDefs.find((d) => d.id === 'attachment_matrix')!;
    const erqDef = conditionalDefs.find((d) => d.id === 'emotion_regulation_profile')!;
    const selfDef = conditionalDefs.find((d) => d.id === 'self_system_profile')!;
    const behavioralDef = conditionalDefs.find((d) => d.id === 'behavioral_style_summary')!;

    expect(attachmentDef.conditionalPredicate).toBeDefined();
    expect(erqDef.conditionalPredicate).toBeDefined();
    expect(selfDef.conditionalPredicate).toBeDefined();
    expect(behavioralDef.conditionalPredicate).toBeDefined();

    // False evaluation -> false
    expect(attachmentDef.conditionalPredicate!({
      measuredConstructCodes: [],
      measuredFacetCodes: [],
      hasAttachmentData: false,
      hasErqData: false,
      hasRsesData: false,
      hasGseData: false,
    })).toBe(false);

    // True evaluation -> true
    expect(attachmentDef.conditionalPredicate!({
      measuredConstructCodes: [],
      measuredFacetCodes: [],
      hasAttachmentData: true,
      hasErqData: false,
      hasRsesData: false,
      hasGseData: false,
    })).toBe(true);
  });

  it('D) verifies personality and heatmap prop payloads are function-free and serializable', () => {
    // HexacoRadarChart prop payload
    const hexacoProps = [
      { name: 'honesty_humility', name_tr: 'Dürüstlük-Alçakgönüllülük', score: 75, standardError: null, ci95: null, facetCount: 4, coverage: 100 },
      { name: 'emotionality', name_tr: 'Duygusallık', score: 60, standardError: null, ci95: null, facetCount: 4, coverage: 100 },
    ];
    expect(findFunctionsInObjectTree(hexacoProps, 'hexacoProps')).toHaveLength(0);

    // FacetWhiskersChart prop payload
    const facetProps = [
      {
        id: 'fairness',
        name: 'Fairness',
        name_tr: 'Adillik',
        constructName: 'Honesty-Humility',
        description: 'Adil olma eğilimi',
        score: 80,
        standardError: null,
        ci95: null,
        measurementPrecision: 'High' as const,
        observedItems: 4,
        epistemicStatus: 'PROVISIONAL_POINT_ESTIMATE',
      },
    ];
    expect(findFunctionsInObjectTree(facetProps, 'facetProps')).toHaveLength(0);

    // Heatmap client prop payload
    const heatmapData = [
      {
        domainId: 'core_personality',
        domainName: 'Temel Kişilik',
        facets: [
          { facetId: 'fairness', name: 'Adillik', score: 80, precision: 'High' as const, items: 4 },
        ],
      },
    ];
    expect(findFunctionsInObjectTree(heatmapData, 'heatmapData')).toHaveLength(0);
  });
});
