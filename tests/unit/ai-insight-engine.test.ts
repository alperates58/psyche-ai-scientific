import { describe, it, expect } from 'vitest';
import {
  buildAIInsightInputPayload,
  generateDeterministicAIInsights,
} from '@/services/aiInsightService';
import { validateAIInsightPolicy } from '@/lib/aiInsightPolicy';
import { AIInsightInput, AIInsightOutput } from '@/types/aiInsight';
import { UnifiedProfileViewModel } from '@/types/profile';

describe('FAZ 2.13 — AI Insight Engine Policy, Grounding & Safety Unit Tests', () => {
  const sampleInput: AIInsightInput = {
    userId: 'user-123',
    measuredDimensions: [
      {
        dimensionId: 'dim-extraversion',
        code: 'extraversion',
        nameTr: 'Dışadönüklük',
        domainNameTr: 'Temel Kişilik',
        rawScore: 3.8,
        scaleMin: 1.0,
        scaleMax: 5.0,
        scoringStrategyCode: 'HEXACO_60_STRATEGY',
        epistemicStatus: 'PROVISIONAL_POINT_ESTIMATE',
        confidenceLevel: 'HIGH',
        itemCount: 10,
        instrumentProvenance: 'HEXACO-60 TR',
      },
      {
        dimensionId: 'dim-conscientiousness',
        code: 'conscientiousness',
        nameTr: 'Sorumluluk',
        domainNameTr: 'Temel Kişilik',
        rawScore: 4.1,
        scaleMin: 1.0,
        scaleMax: 5.0,
        scoringStrategyCode: 'HEXACO_60_STRATEGY',
        epistemicStatus: 'PROVISIONAL_POINT_ESTIMATE',
        confidenceLevel: 'HIGH',
        itemCount: 10,
        instrumentProvenance: 'HEXACO-60 TR',
      },
    ],
    responseQualitySummary: {
      overallFlag: 'EXCELLENT',
      isClean: true,
      headlineTr: 'Yanıt kalitesi yüksek',
      speedViolationsCount: 0,
      straightliningDetected: false,
      attentionChecksPassed: true,
    },
    registeredInteractions: [
      {
        id: 'goal_execution_dynamic',
        titleTr: 'Eylem ve Hedef Odaklılık Sinerjisi',
        type: 'SYNERGY',
        descriptionTr: 'Yüksek Dışadönüklük ve Yüksek Sorumluluk vizyoner hedefleri somut başarılara dönüştürür.',
        epistemicStatus: 'THEORETICAL_INTERPRETATION',
        sourceDimensions: ['Dışadönüklük', 'Sorumluluk'],
        sourceDimensionCodes: ['extraversion', 'conscientiousness'],
      },
    ],
    unmeasuredGaps: [
      {
        domainCode: 'emotional_affective',
        domainNameTr: 'Duygusal Dayanıklılık',
        whyItMattersTr: 'Duygu düzenleme stratejilerini analiz eder.',
        availableAssessmentTitleTr: 'Duygu Düzenleme Ölçeği',
      },
    ],
    sourceInstruments: [
      {
        instrumentName: 'HEXACO-60 TR',
        formVersion: 'v1.0.0',
        scoringModel: 'HEXACO_60_STRATEGY',
        measuredAt: '2026-09-16T12:00:00Z',
      },
    ],
  };

  // ---------------------------------------------------------
  // 1. AI Payload Truthfulness Tests
  // ---------------------------------------------------------
  describe('AI Payload Truthfulness & Extraction', () => {
    it('uses real confidence level and exact item count without fabricating itemCount=4', () => {
      const mockProfile = {
        userId: 'user-xyz',
        fingerprint: {
          dimensions: [
            {
              id: 'facet-org',
              code: 'organization',
              nameTr: 'Düzenlilik',
              domainNameTr: 'Temel Kişilik',
              nativeScore: 4.2,
              scaleMin: 1.0,
              scaleMax: 5.0,
              normalizedCoordinate: 80,
              isMeasured: true,
              bandInfo: null,
              measurementSupport: 'High',
              instrumentName: 'HEXACO-60',
              measuredAt: '2026-09-16',
            },
          ],
          measuredCount: 1,
          totalCount: 84,
          summaryText: 'Özet',
        },
        confidenceMap: {
          distribution: { high: 1, moderate: 0, low: 0, veryLow: 0, totalMeasured: 1 },
          dimensions: [
            {
              dimensionId: 'facet-org',
              dimensionCode: 'organization',
              dimensionNameTr: 'Düzenlilik',
              domainCode: 'core_personality',
              domainNameTr: 'Temel Kişilik',
              level: 'HIGH' as const,
              levelLabelTr: 'Yüksek',
              itemCount: 10,
              responseQuality: 'EXCELLENT' as const,
              evidenceLevel: 'DIRECT',
              calibrationState: 'PRE_CALIBRATION' as const,
              temporalSignal: 'SINGLE_MEASUREMENT' as const,
              measurementCount: 1,
              provenanceCompleteness: true,
              positiveFactors: ['10 madde'],
              uncertainties: [],
              missingSignals: [],
              explanationTr: 'Güçlü kanıt',
            },
          ],
          headlineTr: 'Başlık',
          overallNoteTr: 'Not',
        },
        allFacets84: [
          {
            facetId: 'facet-org',
            code: 'organization',
            nameTr: 'Düzenlilik',
            nameEn: 'Organization',
            descriptionTr: 'Açıklama',
            constructId: 'c-1',
            constructCode: 'conscientiousness',
            constructNameTr: 'Sorumluluk',
            domainId: 'd-1',
            domainCode: 'core_personality',
            domainNameTr: 'Temel Kişilik',
            isMeasured: true,
            rawMean: 4.2,
            scorePercentage: 80,
            scale: {
              scaleMin: 1.0,
              scaleMax: 5.0,
              scoreType: 'MEAN',
              scoringModelCode: 'HEXACO_60_STRATEGY',
            },
            itemCount: 10,
            bandInfo: null,
            provenance: null,
            epistemicStatus: 'PROVISIONAL_POINT_ESTIMATE',
            precision: 'High',
            measurementSupport: 'High',
            confidenceLevel: 'HIGH',
            responseRangeState: 'UPPER_RESPONSE_RANGE',
          },
        ],
        responseQuality: {
          overallFlag: 'EXCELLENT' as const,
          isClean: true,
          totalAssessmentsAudited: 1,
          statusCounts: { excellent: 1, acceptable: 0, questionable: 0, compromised: 0 },
          speedViolationsCount: 0,
          straightliningDetected: false,
          attentionChecksPassed: true,
          headlineTr: 'Kalite yüksek',
          explanationTr: 'Açıklama',
        },
        interactions: [],
        unmeasuredDomains: [],
        sourceAssessments: [],
      } as unknown as UnifiedProfileViewModel;

      const payload = buildAIInsightInputPayload(mockProfile);
      expect(payload.measuredDimensions).toHaveLength(1);
      const dim = payload.measuredDimensions[0];

      // Assert real values are preserved
      expect(dim.itemCount).toBe(10);
      expect(dim.confidenceLevel).toBe('HIGH');
      expect(dim.scoringStrategyCode).toBe('HEXACO_60_STRATEGY');
    });
  });

  // ---------------------------------------------------------
  // 2. Deterministic Grounded Synthesis Fallback
  // ---------------------------------------------------------
  describe('Deterministic AI Insight Fallback Engine', () => {
    it('generates fully grounded insights from valid measured dimensions', () => {
      const output = generateDeterministicAIInsights(sampleInput);

      expect(output.headline).toContain('Psikolojik Boyut');
      expect(output.summary).toBeDefined();
      expect(output.observations.length).toBeGreaterThanOrEqual(2);

      // Verify all observations reference valid dimension IDs
      for (const obs of output.observations) {
        expect(obs.sourceDimensionIds.length).toBeGreaterThan(0);
        for (const dimId of obs.sourceDimensionIds) {
          expect(['dim-extraversion', 'dim-conscientiousness']).toContain(dimId);
        }
      }

      // Verify policy validation passes
      const policyCheck = validateAIInsightPolicy(output, sampleInput);
      expect(policyCheck.isValid).toBe(true);
      expect(policyCheck.errors).toHaveLength(0);
    });

    it('omits interaction insights when required source dimensions are not measured (no fake fallback ID)', () => {
      const partialInput: AIInsightInput = {
        ...sampleInput,
        measuredDimensions: [
          // Only extraversion is measured; conscientiousness is missing
          sampleInput.measuredDimensions[0],
        ],
        registeredInteractions: [
          {
            id: 'goal_execution_dynamic',
            titleTr: 'Eylem ve Hedef Odaklılık Sinerjisi',
            type: 'SYNERGY',
            descriptionTr: 'Yüksek Dışadönüklük ve Yüksek Sorumluluk',
            epistemicStatus: 'THEORETICAL_INTERPRETATION',
            sourceDimensions: ['Dışadönüklük', 'Sorumluluk'],
            sourceDimensionCodes: ['extraversion', 'conscientiousness'],
          },
        ],
      };

      const output = generateDeterministicAIInsights(partialInput);
      // Since conscientiousness is missing, synergy MUST NOT be emitted
      expect(output.synergies).toHaveLength(0);
    });

    it('handles empty profile gracefully with clean non-hallucinatory output', () => {
      const emptyInput: AIInsightInput = {
        userId: 'user-empty',
        measuredDimensions: [],
        responseQualitySummary: {
          overallFlag: 'ACCEPTABLE',
          isClean: true,
          headlineTr: 'Veri kaydı yok',
          speedViolationsCount: 0,
          straightliningDetected: false,
          attentionChecksPassed: true,
        },
        registeredInteractions: [],
        unmeasuredGaps: [],
        sourceInstruments: [],
      };

      const output = generateDeterministicAIInsights(emptyInput);
      expect(output.headline).toContain('Henüz Tamamlanmış Psikolojik Ölçüm Bulunmuyor');
      expect(output.observations).toHaveLength(0);
      expect(output.synergies).toHaveLength(0);
    });
  });

  // ---------------------------------------------------------
  // 3. Structured Policy Validation & Guardrails
  // ---------------------------------------------------------
  describe('Structured Policy Validation Guardrails', () => {
    it('rejects output with ungrounded (fake) dimension IDs', () => {
      const fakeOutput: AIInsightOutput = {
        headline: 'Test Başlık',
        summary: 'Test özeti geçerli ve yeterlidir.',
        observations: [
          {
            sourceDimensionIds: ['fake-dimension-id-999'],
            observationTr: 'Bu gözlem uydurma bir boyuta dayanıyor.',
            confidenceLevel: 'HIGH',
            epistemicStatus: 'PROVISIONAL_POINT_ESTIMATE',
          },
        ],
        tensions: [],
        synergies: [],
        profileGaps: [],
        reflectionQuestions: ['Soru 1?'],
        provenanceReferences: [],
        limitations: ['Ön kalibrasyon'],
      };

      const check = validateAIInsightPolicy(fakeOutput, sampleInput);
      expect(check.isValid).toBe(false);
      expect(check.errors.some((e) => e.includes('fake-dimension-id-999'))).toBe(true);
    });

    it('rejects observation with empty sourceDimensionIds list', () => {
      const emptySourceOutput: AIInsightOutput = {
        headline: 'Test Başlık',
        summary: 'Test özeti geçerli ve yeterlidir.',
        observations: [
          {
            sourceDimensionIds: [],
            observationTr: 'Bu gözlem hiçbir kaynağa dayanmıyor.',
            confidenceLevel: 'HIGH',
            epistemicStatus: 'PROVISIONAL_POINT_ESTIMATE',
          },
        ],
        tensions: [],
        synergies: [],
        profileGaps: [],
        reflectionQuestions: ['Soru 1?'],
        provenanceReferences: [],
        limitations: ['Ön kalibrasyon'],
      };

      const check = validateAIInsightPolicy(emptySourceOutput, sampleInput);
      expect(check.isValid).toBe(false);
      expect(check.errors.some((e) => e.includes('boş kaynak boyut listesi'))).toBe(true);
    });

    it('rejects tension or synergy with ungrounded interaction ID', () => {
      const invalidInteractionOutput: AIInsightOutput = {
        headline: 'Test Başlık',
        summary: 'Test özeti geçerli ve yeterlidir.',
        observations: [
          {
            sourceDimensionIds: ['dim-extraversion'],
            observationTr: 'Dışadönüklük puanı yeterlidir.',
            confidenceLevel: 'HIGH',
            epistemicStatus: 'PROVISIONAL_POINT_ESTIMATE',
          },
        ],
        tensions: [
          {
            sourceDimensionIds: ['dim-extraversion'],
            registeredInteractionId: 'unregistered_fake_tension_id',
            tensionTr: 'Uydurma gerilim açıklaması.',
            reflectionQuestionTr: 'Yansıtma sorusu?',
          },
        ],
        synergies: [],
        profileGaps: [],
        reflectionQuestions: ['Soru 1?'],
        provenanceReferences: [],
        limitations: ['Ön kalibrasyon'],
      };

      const check = validateAIInsightPolicy(invalidInteractionOutput, sampleInput);
      expect(check.isValid).toBe(false);
      expect(check.errors.some((e) => e.includes('kayıtlı ve geçerli bir etkileşim ID'))).toBe(true);
    });

    it('rejects epistemic ceiling upgrade for low-confidence dimensions', () => {
      const lowConfidenceInput: AIInsightInput = {
        ...sampleInput,
        measuredDimensions: [
          {
            ...sampleInput.measuredDimensions[0],
            confidenceLevel: 'LOW',
          },
        ],
      };

      const upgradedOutput: AIInsightOutput = {
        headline: 'Test Başlık',
        summary: 'Test özeti geçerli ve yeterlidir.',
        observations: [
          {
            sourceDimensionIds: ['dim-extraversion'],
            observationTr: 'Düşük kanıtlı boyut için kesin yorum yapıldı.',
            confidenceLevel: 'HIGH',
            epistemicStatus: 'EVIDENCE_SUPPORTED_INTERPRETATION', // Illegal upgrade!
          },
        ],
        tensions: [],
        synergies: [],
        profileGaps: [],
        reflectionQuestions: ['Soru 1?'],
        provenanceReferences: [],
        limitations: ['Ön kalibrasyon'],
      };

      const check = validateAIInsightPolicy(upgradedOutput, lowConfidenceInput);
      expect(check.isValid).toBe(false);
      expect(check.errors.some((e) => e.includes('EVIDENCE_SUPPORTED_INTERPRETATION'))).toBe(true);
    });

    it('rejects output containing clinical diagnosis keywords', () => {
      const diagnosticOutput: AIInsightOutput = {
        headline: 'Klinik Profil',
        summary: 'Kullanıcıda hafif depresyon tanısı ve borderline eğilimleri görülmektedir.',
        observations: [
          {
            sourceDimensionIds: ['dim-extraversion'],
            observationTr: 'Dışadönüklük puanı normaldir.',
            confidenceLevel: 'HIGH',
            epistemicStatus: 'PROVISIONAL_POINT_ESTIMATE',
          },
        ],
        tensions: [],
        synergies: [],
        profileGaps: [],
        reflectionQuestions: ['Soru 1?'],
        provenanceReferences: [],
        limitations: ['Ön kalibrasyon'],
      };

      const check = validateAIInsightPolicy(diagnosticOutput, sampleInput);
      expect(check.isValid).toBe(false);
      expect(check.errors.some((e) => e.includes('depresyon tanısı'))).toBe(true);
      expect(check.errors.some((e) => e.includes('borderline'))).toBe(true);
    });

    it('rejects output claiming percentiles or population rankings in pre-calibration', () => {
      const percentileOutput: AIInsightOutput = {
        headline: 'Percentile Kıyaslaması',
        summary: 'Kullanıcı Türkiye toplumunun %85\'inden daha sorumludur.',
        observations: [
          {
            sourceDimensionIds: ['dim-conscientiousness'],
            observationTr: 'Sorumluluk puanı toplumun %85\'indedir.',
            confidenceLevel: 'HIGH',
            epistemicStatus: 'PROVISIONAL_POINT_ESTIMATE',
          },
        ],
        tensions: [],
        synergies: [],
        profileGaps: [],
        reflectionQuestions: ['Soru 1?'],
        provenanceReferences: [],
        limitations: ['Ön kalibrasyon'],
      };

      const check = validateAIInsightPolicy(percentileOutput, sampleInput);
      expect(check.isValid).toBe(false);
      expect(check.errors.some((e) => e.includes('yüzdelik (percentile) iddiası'))).toBe(true);
    });

    it('rejects output claiming absolute causal certainty', () => {
      const causalOutput: AIInsightOutput = {
        headline: 'Nedensellik Analizi',
        summary: 'Düşük puanlar kesinlikle geçmiş travmalardan kaynaklanır ve sebebi kesin olarak budur.',
        observations: [
          {
            sourceDimensionIds: ['dim-extraversion'],
            observationTr: 'Dışadönüklük ölçüldü.',
            confidenceLevel: 'HIGH',
            epistemicStatus: 'PROVISIONAL_POINT_ESTIMATE',
          },
        ],
        tensions: [],
        synergies: [],
        profileGaps: [],
        reflectionQuestions: ['Soru 1?'],
        provenanceReferences: [],
        limitations: ['Ön kalibrasyon'],
      };

      const check = validateAIInsightPolicy(causalOutput, sampleInput);
      expect(check.isValid).toBe(false);
      expect(check.errors.some((e) => e.includes('nedensellik'))).toBe(true);
    });
  });
});
