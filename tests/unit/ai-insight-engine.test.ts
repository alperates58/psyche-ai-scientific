import { describe, it, expect } from 'vitest';
import {
  buildAIInsightInputPayload,
  generateDeterministicAIInsights,
} from '@/services/aiInsightService';
import { validateAIInsightPolicy } from '@/lib/aiInsightPolicy';
import { AIInsightInput, AIInsightOutput } from '@/types/aiInsight';

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
        epistemicStatus: 'PROVISIONAL_POINT_ESTIMATE',
        confidenceLevel: 'HIGH',
        itemCount: 10,
      },
      {
        dimensionId: 'dim-conscientiousness',
        code: 'conscientiousness',
        nameTr: 'Sorumluluk',
        domainNameTr: 'Temel Kişilik',
        rawScore: 4.1,
        scaleMin: 1.0,
        scaleMax: 5.0,
        epistemicStatus: 'PROVISIONAL_POINT_ESTIMATE',
        confidenceLevel: 'HIGH',
        itemCount: 10,
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
        scoringModel: 'PRE_CALIBRATION_MEAN_V1',
        measuredAt: '2026-09-16T12:00:00Z',
      },
    ],
  };

  // ---------------------------------------------------------
  // 1. Deterministic Grounded Synthesis Fallback
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
  // 2. Structured Policy Validation & Guardrails
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
