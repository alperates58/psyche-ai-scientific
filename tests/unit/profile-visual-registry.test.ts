import { describe, it, expect } from 'vitest';
import {
  MASTER_VISUALIZATION_REGISTRY,
  evaluateVisualizationStatus,
  getCategorizedVisualizations,
} from '@/lib/profileVisualizationRegistry';

describe('FAZ 2.13 — Master Psychological Profile Visualization Registry Unit Tests', () => {
  it('contains all 20 canonical visualization definitions with explicit scientific metadata', () => {
    expect(MASTER_VISUALIZATION_REGISTRY.length).toBeGreaterThanOrEqual(18);

    const ids = MASTER_VISUALIZATION_REGISTRY.map((v) => v.id);
    expect(ids).toContain('hexaco_radar_chart');
    expect(ids).toContain('hexaco_facet_profile');
    expect(ids).toContain('trait_heatmap');
    expect(ids).toContain('profile_fingerprint');
    expect(ids).toContain('strength_attention_matrix');
    expect(ids).toContain('response_quality_dashboard');
    expect(ids).toContain('measurement_coverage_map');
    expect(ids).toContain('profile_confidence_map');
    expect(ids).toContain('interaction_synergy_tension_map');
    expect(ids).toContain('attachment_matrix');
    expect(ids).toContain('emotion_regulation_profile');
    expect(ids).toContain('self_system_profile');
    expect(ids).toContain('behavioral_style_summary');
    expect(ids).toContain('big_five_radar');
    expect(ids).toContain('percentile_profile');
    expect(ids).toContain('norm_comparison_chart');
    expect(ids).toContain('confidence_interval_whiskers');
    expect(ids).toContain('trait_correlation_matrix');
    expect(ids).toContain('schwartz_circumplex');
    expect(ids).toContain('riasec_hexagon');
    expect(ids).toContain('interpersonal_circumplex');
    expect(ids).toContain('affect_circumplex');
    expect(ids).toContain('longitudinal_profile');
  });

  it('classifies direct measurement visualizations as ACTIVE NOW', () => {
    const activeNowIds = [
      'hexaco_radar_chart',
      'hexaco_facet_profile',
      'trait_heatmap',
      'profile_fingerprint',
      'strength_attention_matrix',
      'response_quality_dashboard',
      'measurement_coverage_map',
      'profile_confidence_map',
      'interaction_synergy_tension_map',
    ];

    for (const id of activeNowIds) {
      const def = MASTER_VISUALIZATION_REGISTRY.find((v) => v.id === id);
      expect(def).toBeDefined();
      expect(def?.status).toBe('ACTIVE');
    }
  });

  it('classifies conditional visualizations as CONDITIONAL with valid predicates', () => {
    const conditionalIds = [
      'attachment_matrix',
      'emotion_regulation_profile',
      'self_system_profile',
      'behavioral_style_summary',
    ];

    for (const id of conditionalIds) {
      const def = MASTER_VISUALIZATION_REGISTRY.find((v) => v.id === id);
      expect(def).toBeDefined();
      expect(def?.status).toBe('CONDITIONAL');
      expect(def?.conditionalPredicate).toBeDefined();
    }
  });

  it('dynamically activates CONDITIONAL visualizations only when required data is present', () => {
    const attachmentDef = MASTER_VISUALIZATION_REGISTRY.find((v) => v.id === 'attachment_matrix')!;
    const erqDef = MASTER_VISUALIZATION_REGISTRY.find((v) => v.id === 'emotion_regulation_profile')!;
    const selfDef = MASTER_VISUALIZATION_REGISTRY.find((v) => v.id === 'self_system_profile')!;

    // Context without attachment or ERQ data
    const contextA = {
      measuredConstructCodes: ['honesty_humility'],
      measuredFacetCodes: ['fairness'],
      hasAttachmentData: false,
      hasErqData: false,
      hasRsesData: true,
      hasGseData: false,
    };

    expect(evaluateVisualizationStatus(attachmentDef, contextA)).toBe('CONDITIONAL');
    expect(evaluateVisualizationStatus(erqDef, contextA)).toBe('CONDITIONAL');
    expect(evaluateVisualizationStatus(selfDef, contextA)).toBe('ACTIVE');

    // Context with attachment and ERQ data
    const contextB = {
      measuredConstructCodes: ['attachment_anxiety', 'cognitive_reappraisal'],
      measuredFacetCodes: ['attachment_anxiety', 'cognitive_reappraisal'],
      hasAttachmentData: true,
      hasErqData: true,
      hasRsesData: false,
      hasGseData: true,
    };

    expect(evaluateVisualizationStatus(attachmentDef, contextB)).toBe('ACTIVE');
    expect(evaluateVisualizationStatus(erqDef, contextB)).toBe('ACTIVE');
    expect(evaluateVisualizationStatus(selfDef, contextB)).toBe('ACTIVE');
  });

  it('strictly BLOCKS visualizations that would imply unverified evidence or fake statistics', () => {
    const blockedDefs = [
      'big_five_radar',
      'percentile_profile',
      'norm_comparison_chart',
      'confidence_interval_whiskers',
      'trait_correlation_matrix',
    ];

    for (const id of blockedDefs) {
      const def = MASTER_VISUALIZATION_REGISTRY.find((v) => v.id === id);
      expect(def).toBeDefined();
      expect(def?.status).toBe('BLOCKED');
      expect(def?.scientificStatus).toBe('BLOCKED_NO_EVIDENCE');
      expect(def?.blockedWhen).toBeDefined();
    }
  });

  it('categorizes all visualizations into clean active, conditional, blocked, and future buckets', () => {
    const context = {
      measuredConstructCodes: ['extraversion', 'conscientiousness'],
      measuredFacetCodes: ['liveliness', 'organization'],
      hasAttachmentData: false,
      hasErqData: false,
      hasRsesData: true,
      hasGseData: false,
    };

    const categorized = getCategorizedVisualizations(context);

    expect(categorized.active.length).toBeGreaterThanOrEqual(9);
    expect(categorized.conditional.length).toBeGreaterThanOrEqual(1);
    expect(categorized.blocked.length).toBeGreaterThanOrEqual(5);
    expect(categorized.future.length).toBeGreaterThanOrEqual(4);
  });

  // ---------------------------------------------------------
  // REGRESSION TESTS: Server Component -> Client Component Serialization Boundary
  // ---------------------------------------------------------
  describe('Regression: RSC Boundary JSON-Serializability (No Functions in Payload)', () => {
    it('ensures getCategorizedVisualizations produces strictly JSON-serializable DTOs with ZERO functions', () => {
      const context = {
        measuredConstructCodes: ['extraversion', 'conscientiousness'],
        measuredFacetCodes: ['liveliness', 'organization'],
        hasAttachmentData: true,
        hasErqData: true,
        hasRsesData: true,
        hasGseData: true,
      };

      const categorized = getCategorizedVisualizations(context);

      const allBuckets = [
        ...categorized.active,
        ...categorized.conditional,
        ...categorized.blocked,
        ...categorized.future,
      ];

      expect(allBuckets.length).toBe(MASTER_VISUALIZATION_REGISTRY.length);

      for (const item of allBuckets) {
        // Assert no function properties exist
        for (const [key, value] of Object.entries(item)) {
          expect(
            typeof value,
            `Property "${key}" on visualization "${item.id}" must NOT be a function`
          ).not.toBe('function');
        }

        // Specifically assert conditionalPredicate is undefined on the DTO
        expect((item as any).conditionalPredicate).toBeUndefined();

        // Assert all required serializable metadata fields are preserved
        expect(typeof item.id).toBe('string');
        expect(typeof item.titleTr).toBe('string');
        expect(typeof item.descriptionTr).toBe('string');
        expect(Array.isArray(item.dataRequirements)).toBe(true);
        expect(typeof item.scientificStatus).toBe('string');
        expect(typeof item.epistemicStatus).toBe('string');
        expect(typeof item.allowedWhen).toBe('string');
        expect(typeof item.blockedWhen).toBe('string');
        expect(typeof item.visualType).toBe('string');
        expect(Array.isArray(item.sourceDimensions)).toBe(true);
        expect(typeof item.isNormDependent).toBe('boolean');
        expect(typeof item.isCalibrationDependent).toBe('boolean');
        expect(typeof item.isLongitudinalDependent).toBe('boolean');
        expect(typeof item.isDirectMeasurement).toBe('boolean');
        expect(typeof item.isDerived).toBe('boolean');
        expect(typeof item.userFacingDisclaimer).toBe('string');
        expect(typeof item.status).toBe('string');
      }

      // Assert perfect JSON serialization round-trip without stripping any keys
      const jsonString = JSON.stringify(categorized);
      const deserialized = JSON.parse(jsonString);
      expect(deserialized).toEqual(categorized);
    });

    it('preserves server-side conditionalPredicate execution in MASTER_VISUALIZATION_REGISTRY', () => {
      const conditionalDefs = MASTER_VISUALIZATION_REGISTRY.filter((v) => v.status === 'CONDITIONAL');
      expect(conditionalDefs.length).toBeGreaterThanOrEqual(4);

      for (const def of conditionalDefs) {
        expect(typeof def.conditionalPredicate).toBe('function');
      }
    });

    it('correctly maps status to ACTIVE in active bucket when conditional predicate evaluates to true', () => {
      const activeCtx = {
        measuredConstructCodes: ['honesty_humility', 'emotionality', 'extraversion'],
        measuredFacetCodes: ['fairness', 'fearfulness', 'expressiveness'],
        hasAttachmentData: true,
        hasErqData: true,
        hasRsesData: true,
        hasGseData: true,
      };

      const categorized = getCategorizedVisualizations(activeCtx);

      const attachmentDto = categorized.active.find((v) => v.id === 'attachment_matrix');
      const erqDto = categorized.active.find((v) => v.id === 'emotion_regulation_profile');
      const selfDto = categorized.active.find((v) => v.id === 'self_system_profile');
      const behavioralDto = categorized.active.find((v) => v.id === 'behavioral_style_summary');

      expect(attachmentDto).toBeDefined();
      expect(attachmentDto?.status).toBe('ACTIVE');

      expect(erqDto).toBeDefined();
      expect(erqDto?.status).toBe('ACTIVE');

      expect(selfDto).toBeDefined();
      expect(selfDto?.status).toBe('ACTIVE');

      expect(behavioralDto).toBeDefined();
      expect(behavioralDto?.status).toBe('ACTIVE');
    });

    it('correctly maps status to CONDITIONAL in conditional bucket when predicate evaluates to false', () => {
      const inactiveCtx = {
        measuredConstructCodes: ['honesty_humility'], // < 3 constructs
        measuredFacetCodes: ['fairness'],
        hasAttachmentData: false,
        hasErqData: false,
        hasRsesData: false,
        hasGseData: false,
      };

      const categorized = getCategorizedVisualizations(inactiveCtx);

      const attachmentDto = categorized.conditional.find((v) => v.id === 'attachment_matrix');
      const erqDto = categorized.conditional.find((v) => v.id === 'emotion_regulation_profile');
      const selfDto = categorized.conditional.find((v) => v.id === 'self_system_profile');
      const behavioralDto = categorized.conditional.find((v) => v.id === 'behavioral_style_summary');

      expect(attachmentDto).toBeDefined();
      expect(attachmentDto?.status).toBe('CONDITIONAL');

      expect(erqDto).toBeDefined();
      expect(erqDto?.status).toBe('CONDITIONAL');

      expect(selfDto).toBeDefined();
      expect(selfDto?.status).toBe('CONDITIONAL');

      expect(behavioralDto).toBeDefined();
      expect(behavioralDto?.status).toBe('CONDITIONAL');
    });
  });
});
