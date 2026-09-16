/**
 * PsycheAI AI Insight Engine Data Model & Validation Schemas
 * 
 * Defines structured input and output schemas for AI-assisted profile synthesis.
 * Strictly enforces grounding, non-diagnostic boundaries, and zero psychometric scoring.
 */

import { z } from 'zod';
import { DimensionConfidenceLevel } from './confidence';

export type EpistemicFrameworkTier =
  | 'VALIDATED_MEASUREMENT'
  | 'EVIDENCE_SUPPORTED_INTERPRETATION'
  | 'THEORETICAL_INTERPRETATION'
  | 'HISTORICAL_FRAMEWORK'
  | 'OBSERVATIONAL_HYPOTHESIS';

export const AIInsightInputSchema = z.object({
  userId: z.string(),
  measuredDimensions: z.array(
    z.object({
      dimensionId: z.string(),
      code: z.string(),
      nameTr: z.string(),
      domainNameTr: z.string(),
      rawScore: z.number(),
      scaleMin: z.number(),
      scaleMax: z.number(),
      epistemicStatus: z.string(),
      confidenceLevel: z.enum(['VERY_LOW', 'LOW', 'MODERATE', 'HIGH']),
      itemCount: z.number(),
    })
  ),
  responseQualitySummary: z.object({
    overallFlag: z.enum(['EXCELLENT', 'ACCEPTABLE', 'QUESTIONABLE', 'COMPROMISED']),
    isClean: z.boolean(),
    headlineTr: z.string(),
    speedViolationsCount: z.number(),
    straightliningDetected: z.boolean(),
    attentionChecksPassed: z.boolean(),
  }),
  registeredInteractions: z.array(
    z.object({
      id: z.string(),
      titleTr: z.string(),
      type: z.enum(['SYNERGY', 'TENSION', 'MODULATION']),
      descriptionTr: z.string(),
      epistemicStatus: z.string(),
      sourceDimensions: z.array(z.string()),
    })
  ),
  unmeasuredGaps: z.array(
    z.object({
      domainCode: z.string(),
      domainNameTr: z.string(),
      whyItMattersTr: z.string(),
      availableAssessmentTitleTr: z.string().optional(),
    })
  ),
  sourceInstruments: z.array(
    z.object({
      instrumentName: z.string(),
      formVersion: z.string(),
      scoringModel: z.string(),
      measuredAt: z.string(),
    })
  ),
});

export type AIInsightInput = z.infer<typeof AIInsightInputSchema>;

export const AIObservationItemSchema = z.object({
  sourceDimensionIds: z.array(z.string()).min(1),
  observationTr: z.string().min(10).max(500),
  confidenceLevel: z.enum(['VERY_LOW', 'LOW', 'MODERATE', 'HIGH']),
  epistemicStatus: z.string(),
});

export const AITensionInsightSchema = z.object({
  sourceDimensionIds: z.array(z.string()).min(1),
  registeredInteractionId: z.string().optional(),
  tensionTr: z.string().min(10).max(500),
  reflectionQuestionTr: z.string().min(10).max(300),
});

export const AISynergyInsightSchema = z.object({
  sourceDimensionIds: z.array(z.string()).min(1),
  registeredInteractionId: z.string().optional(),
  synergyTr: z.string().min(10).max(500),
});

export const AIProfileGapItemSchema = z.object({
  domainCode: z.string(),
  domainNameTr: z.string(),
  reasonTr: z.string(),
  recommendedAssessmentTitleTr: z.string().optional(),
});

export const AIInsightOutputSchema = z.object({
  headline: z.string().min(10).max(160),
  summary: z.string().min(40).max(800),
  observations: z.array(AIObservationItemSchema),
  tensions: z.array(AITensionInsightSchema),
  synergies: z.array(AISynergyInsightSchema),
  profileGaps: z.array(AIProfileGapItemSchema),
  reflectionQuestions: z.array(z.string().min(10).max(250)).max(5),
  provenanceReferences: z.array(
    z.object({
      instrumentName: z.string(),
      formVersion: z.string(),
    })
  ),
  limitations: z.array(z.string().min(10).max(300)),
});

export type AIInsightOutput = z.infer<typeof AIInsightOutputSchema>;
