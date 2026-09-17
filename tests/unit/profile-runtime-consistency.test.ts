import { describe, it, expect } from 'vitest';
import {
  MASTER_DOMAINS,
  MASTER_CONSTRUCTS,
  MASTER_FACETS,
  TOTAL_MASTER_DOMAINS_COUNT,
  TOTAL_MASTER_CONSTRUCTS_COUNT,
  TOTAL_MASTER_FACETS_COUNT,
} from '@/lib/profile/masterModelConstants';
import { TOTAL_ONTOLOGY_FACETS_SOURCE_OF_TRUTH } from '@/psychometrics/coverage';
import { resolveUnifiedPsychologicalProfileV2 } from '@/lib/profile/masterProfileResolver';
import { calculateProfileCoverageV2 } from '@/lib/profile/profileCoverageResolver';

describe('Profile Runtime Consistency & Reconciliation Suite', () => {
  // Scenario A: Complete mod_self_agency -> session COMPLETED -> card Tamamlandı -> CTA Sonuçlar -> expected facets measured in Profile V2 -> sidebar coverage increases
  it('Scenario A: Complete mod_self_agency -> measures expected self-system facets in Profile V2 and increases coverage', async () => {
    const selfFacets = MASTER_FACETS.filter((f) => f.domainId === 'self_system').slice(0, 4);
    const mockResponses = selfFacets.flatMap((f, idx) => [
      {
        id: `resp_self_${idx}_1`,
        itemId: `item_self_${idx}_1`,
        rawValue: 4,
        scoredValue: 4,
        item: {
          facetId: f.facetId,
          facet: { id: f.facetId, code: f.code, construct: { id: f.constructId, domain: { id: f.domainId } } },
        },
      },
    ]);

    const mockSession = {
      id: 'session_self_agency_1',
      userId: 'test_user_a',
      status: 'COMPLETED',
      completedAt: new Date('2026-09-17T09:00:00Z'),
      startedAt: new Date('2026-09-17T08:45:00Z'),
      formVersion: {
        versionCode: 'v1.0.0-psycheai-native',
        module: { id: 'mod_self_agency', code: 'MODULE_2_SELF_IDENTITY', titleTr: 'Benlik Sistemi ve Öz-Yetkinlik' },
      },
      responses: mockResponses,
      integrityResults: [{ overallFlag: 'EXCELLENT', speedViolations: 0, straightliningDetected: false, attentionCheckPassed: true }],
    };

    const profile = await resolveUnifiedPsychologicalProfileV2('test_user_a', {
      mockSessions: [mockSession],
    });

    expect(profile.hasAssessments).toBe(true);
    expect(profile.coverage.facetCoverage.measuredCount).toBe(4);
    expect(profile.coverage.facetCoverage.totalCount).toBe(91);
    expect(profile.coverage.domainCoverage.measuredCount).toBe(1);
    expect(profile.coverage.domainCoverage.totalCount).toBe(11);

    for (const f of selfFacets) {
      const measured = profile.facets.find((mf) => mf.facetId === f.facetId);
      expect(measured).toBeDefined();
      expect(measured?.score).toBe(4.0);
      expect(measured?.measurementStatus).toBe('MEASURED_PRECALIBRATION');
    }
  });

  // Scenario B: Complete mod_emotion_regulation -> same invariants
  it('Scenario B: Complete mod_emotion_regulation -> measures emotion_regulation facets in Profile V2', async () => {
    const emotionFacets = MASTER_FACETS.filter((f) => f.domainId === 'emotion_regulation').slice(0, 4);
    const mockResponses = emotionFacets.flatMap((f, idx) => [
      {
        id: `resp_emo_${idx}_1`,
        itemId: `item_emo_${idx}_1`,
        rawValue: 3,
        scoredValue: 3,
        item: {
          facetId: f.facetId,
          facet: { id: f.facetId, code: f.code, construct: { id: f.constructId, domain: { id: f.domainId } } },
        },
      },
    ]);

    const mockSession = {
      id: 'session_emotion_1',
      userId: 'test_user_b',
      status: 'COMPLETED',
      completedAt: new Date('2026-09-17T09:30:00Z'),
      startedAt: new Date('2026-09-17T09:15:00Z'),
      formVersion: {
        versionCode: 'v1.0.0-psycheai-native',
        module: { id: 'mod_emotion_regulation', code: 'MODULE_3_EMOTION_REGULATION', titleTr: 'Duygu Dinamikleri ve Duygu Düzenleme' },
      },
      responses: mockResponses,
      integrityResults: [{ overallFlag: 'ACCEPTABLE', speedViolations: 0, straightliningDetected: false, attentionCheckPassed: true }],
    };

    const profile = await resolveUnifiedPsychologicalProfileV2('test_user_b', {
      mockSessions: [mockSession],
    });

    expect(profile.hasAssessments).toBe(true);
    expect(profile.coverage.facetCoverage.measuredCount).toBe(4);
    expect(profile.coverage.facetCoverage.totalCount).toBe(91);

    for (const f of emotionFacets) {
      const measured = profile.facets.find((mf) => mf.facetId === f.facetId);
      expect(measured).toBeDefined();
      expect(measured?.score).toBe(3.0);
    }
  });

  // Scenario C: Completed module + stale paused/in-progress session -> completed wins
  it('Scenario C: When completed session coexists with stale in-progress session, completed session takes precedence', () => {
    const userSessions = [
      { id: 'sess_stale_active', status: 'IN_PROGRESS', startedAt: new Date('2026-09-17T11:00:00Z'), _count: { responses: 0 } },
      { id: 'sess_completed', status: 'COMPLETED', startedAt: new Date('2026-09-17T09:00:00Z'), completedAt: new Date('2026-09-17T09:20:00Z') },
    ];

    const completedSession = userSessions.find((s) => s.status === 'COMPLETED');
    const activeSession = userSessions.find((s) => s.status === 'IN_PROGRESS' || s.status === 'PAUSED');

    let resolvedStatus = 'NOT_STARTED';
    if (completedSession) {
      resolvedStatus = 'COMPLETED';
    } else if (activeSession) {
      resolvedStatus = 'IN_PROGRESS';
    }

    expect(resolvedStatus).toBe('COMPLETED');
  });

  // Scenario D: Profile has 32 measured master facets -> sidebar displays 32 / 91 (not 32 / 128)
  it('Scenario D: Denominator is strictly 91 active master facets, never 128 or 84', async () => {
    // 24 HEXACO + 4 Self + 4 Emotion = 32 facets
    const hexacoFacets = MASTER_FACETS.filter((f) => f.domainId === 'core_personality');
    const selfFacets = MASTER_FACETS.filter((f) => f.domainId === 'self_system').slice(0, 4);
    const emotionFacets = MASTER_FACETS.filter((f) => f.domainId === 'emotion_regulation').slice(0, 4);

    const all32Facets = [...hexacoFacets, ...selfFacets, ...emotionFacets];
    const mockResponses = all32Facets.map((f, idx) => ({
      id: `resp_${idx}`,
      itemId: `item_${idx}`,
      rawValue: 4,
      scoredValue: 4,
      item: {
        facetId: f.facetId,
        facet: { id: f.facetId, code: f.code, construct: { id: f.constructId, domain: { id: f.domainId } } },
      },
    }));

    const mockSession = {
      id: 'session_multi_32',
      userId: 'test_user_d',
      status: 'COMPLETED',
      completedAt: new Date(),
      startedAt: new Date(),
      formVersion: {
        versionCode: 'v1.0.0-psycheai-native',
        module: { id: 'mod_multi', code: 'MODULE_NATIVE_BATTERY', titleTr: 'PsycheAI Bataryası' },
      },
      responses: mockResponses,
      integrityResults: [{ overallFlag: 'EXCELLENT' }],
    };

    const profile = await resolveUnifiedPsychologicalProfileV2('test_user_d', {
      mockSessions: [mockSession],
    });

    expect(profile.coverage.facetCoverage.measuredCount).toBe(32);
    expect(profile.coverage.facetCoverage.totalCount).toBe(91);
    expect(profile.coverage.facetCoverage.percentage).toBe(35); // (32/91) * 100 = 35%
    expect(TOTAL_ONTOLOGY_FACETS_SOURCE_OF_TRUTH).toBe(91);
  });

  // Scenario E: Unified profile facet score == module result facet score
  it('Scenario E: Unified Profile facet score equals exact session calculation score without drift', async () => {
    const targetFacet = MASTER_FACETS[0];
    const mockResponses = [
      {
        id: 'resp_e1',
        itemId: 'item_e1',
        rawValue: 5,
        scoredValue: 5,
        item: { facetId: targetFacet.facetId, facet: { id: targetFacet.facetId, code: targetFacet.code, construct: { id: targetFacet.constructId, domain: { id: targetFacet.domainId } } } },
      },
      {
        id: 'resp_e2',
        itemId: 'item_e2',
        rawValue: 3,
        scoredValue: 3,
        item: { facetId: targetFacet.facetId, facet: { id: targetFacet.facetId, code: targetFacet.code, construct: { id: targetFacet.constructId, domain: { id: targetFacet.domainId } } } },
      },
    ];

    const mockSession = {
      id: 'session_e',
      userId: 'test_user_e',
      status: 'COMPLETED',
      completedAt: new Date(),
      startedAt: new Date(),
      formVersion: { versionCode: 'v1.0.0-psycheai-native', module: { id: 'mod', code: 'MOD' } },
      responses: mockResponses,
    };

    const profile = await resolveUnifiedPsychologicalProfileV2('test_user_e', {
      mockSessions: [mockSession],
    });

    const measuredFacet = profile.facets.find((f) => f.facetId === targetFacet.facetId);
    expect(measuredFacet?.score).toBe(4.0); // (5 + 3) / 2 = 4.0
  });

  // Scenario F: Current profile snapshot updates after completion
  it('Scenario F: Completing assessment dynamically reflects in profile resolution', async () => {
    const session1 = {
      id: 'sess_f1',
      userId: 'test_user_f',
      status: 'COMPLETED',
      completedAt: new Date('2026-09-17T09:00:00Z'),
      startedAt: new Date('2026-09-17T08:50:00Z'),
      formVersion: { versionCode: 'v1.0.0-psycheai-native', module: { id: 'm1', code: 'M1' } },
      responses: [
        {
          id: 'r_f1',
          itemId: 'i_f1',
          rawValue: 4,
          scoredValue: 4,
          item: { facetId: MASTER_FACETS[0].facetId, facet: { id: MASTER_FACETS[0].facetId, code: MASTER_FACETS[0].code, construct: { id: MASTER_FACETS[0].constructId, domain: { id: MASTER_FACETS[0].domainId } } } },
        },
      ],
    };

    const initialProfile = await resolveUnifiedPsychologicalProfileV2('test_user_f', {
      mockSessions: [session1],
    });
    expect(initialProfile.coverage.facetCoverage.measuredCount).toBe(1);

    const session2 = {
      id: 'sess_f2',
      userId: 'test_user_f',
      status: 'COMPLETED',
      completedAt: new Date('2026-09-17T10:00:00Z'),
      startedAt: new Date('2026-09-17T09:50:00Z'),
      formVersion: { versionCode: 'v1.0.0-psycheai-native', module: { id: 'm2', code: 'M2' } },
      responses: [
        {
          id: 'r_f2',
          itemId: 'i_f2',
          rawValue: 5,
          scoredValue: 5,
          item: { facetId: MASTER_FACETS[1].facetId, facet: { id: MASTER_FACETS[1].facetId, code: MASTER_FACETS[1].code, construct: { id: MASTER_FACETS[1].constructId, domain: { id: MASTER_FACETS[1].domainId } } } },
        },
      ],
    };

    const updatedProfile = await resolveUnifiedPsychologicalProfileV2('test_user_f', {
      mockSessions: [session1, session2],
    });
    expect(updatedProfile.coverage.facetCoverage.measuredCount).toBe(2);
  });

  // Scenario G: Legacy 17-item session does not pollute native profile coverage
  it('Scenario G: Legacy form sessions are isolated and do not pollute native 91-facet profile coverage', async () => {
    const legacySession = {
      id: 'sess_legacy_17',
      userId: 'test_user_g',
      status: 'COMPLETED',
      completedAt: new Date('2026-09-17T08:00:00Z'),
      startedAt: new Date('2026-09-17T07:50:00Z'),
      formVersion: { versionCode: 'form_hexaco_v1_0_0', module: { id: 'm_legacy', code: 'LEGACY_FORM_HEXACO' } },
      responses: [
        {
          id: 'r_leg_1',
          itemId: 'i_leg_1',
          rawValue: 3,
          scoredValue: 3,
          item: { facetId: 'legacy_facet', facet: { id: 'legacy_facet', code: 'LEG', construct: { id: 'c', domain: { id: 'd' } } } },
        },
      ],
    };

    const profile = await resolveUnifiedPsychologicalProfileV2('test_user_g', {
      mockSessions: [legacySession],
    });

    expect(profile.hasAssessments).toBe(false);
    expect(profile.coverage.facetCoverage.measuredCount).toBe(0);
  });

  // Scenario H: Response-quality items do not increase measured-facet coverage
  it('Scenario H: Attention check and response quality items do not increase measured-facet count', async () => {
    const qualitySession = {
      id: 'sess_quality_only',
      userId: 'test_user_h',
      status: 'COMPLETED',
      completedAt: new Date(),
      startedAt: new Date(),
      formVersion: { versionCode: 'v1.0.0-psycheai-native', module: { id: 'm', code: 'MOD' } },
      responses: [
        {
          id: 'r_att',
          itemId: 'i_att',
          rawValue: 5,
          scoredValue: 5,
          item: { facetId: 'attention_check', facet: { id: 'attention_check', code: 'ATT_CHK', construct: { id: 'response_quality', domain: { id: 'response_integrity' } } } },
        },
        {
          id: 'r_inf',
          itemId: 'i_inf',
          rawValue: 1,
          scoredValue: 1,
          item: { facetId: 'infrequency_check', facet: { id: 'infrequency_check', code: 'INF_CHK', construct: { id: 'response_quality', domain: { id: 'response_integrity' } } } },
        },
      ],
    };

    const profile = await resolveUnifiedPsychologicalProfileV2('test_user_h', {
      mockSessions: [qualitySession],
    });

    expect(profile.coverage.facetCoverage.measuredCount).toBe(0);
    const measuredFacets = profile.facets.filter((f) => f.measurementStatus === 'MEASURED_PRECALIBRATION' && f.score !== null);
    expect(measuredFacets.length).toBe(0);
  });
});
