'use server';

import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth';
import {
  getOrCreateAssessmentSession,
  getSessionWithDetails,
  pauseAssessmentSession,
} from '@/services/assessmentService';
import { recordResponse } from '@/services/responseService';
import {
  finalizeAssessmentAndCreateSnapshot,
  getLatestProfileSnapshotForUser,
} from '@/services/profileService';
import { getUserAssessmentJourney } from '@/services/assessmentJourneyService';

const SubmitResponseSchema = z.object({
  sessionId: z.string().min(1, 'Oturum kimliği gereklidir'),
  formItemId: z.string().min(1, 'Form maddesi kimliği gereklidir'),
  selectedOptionVersionId: z.string().min(1, 'Seçenek sürüm kimliği gereklidir'),
  rawValue: z.number().int().min(1).max(7),
  durationMs: z.number().nonnegative('Süre negatif olamaz'),
  focusLostCount: z.number().int().nonnegative().optional(),
  firstInteractionAt: z.string().datetime().optional().nullable()
}).strict(); // STRICT: Rejects any extra fields (e.g. client attempts to send scoredValue, standardError, percentiles)

const PauseAssessmentSchema = z.object({
  sessionId: z.string().min(1, 'Oturum kimliği gereklidir'),
  currentStep: z.number().int().min(1)
}).strict();

const FinalizeAssessmentSchema = z.object({
  sessionId: z.string().min(1, 'Oturum kimliği gereklidir')
}).strict();

export async function startOrResumeAssessmentAction(moduleCode: string = 'MODULE_1_CORE_PERSONALITY') {
  try {
    const user = await getCurrentUser();
    const session = await getOrCreateAssessmentSession(user.id, moduleCode);
    return { success: true, data: session };
  } catch (error: any) {
    return { success: false, error: error.message || 'Değerlendirme başlatılamadı.' };
  }
}

export async function getAssessmentSessionAction(sessionId: string) {
  try {
    const user = await getCurrentUser();
    const session = await getSessionWithDetails(sessionId, user.id);
    return { success: true, data: session };
  } catch (error: any) {
    return { success: false, error: error.message || 'Oturum detayları alınamadı.' };
  }
}

export async function submitResponseAction(input: z.infer<typeof SubmitResponseSchema>) {
  try {
    const validated = SubmitResponseSchema.parse(input);
    const user = await getCurrentUser();

    const result = await recordResponse({
      userId: user.id,
      sessionId: validated.sessionId,
      formItemId: validated.formItemId,
      selectedOptionVersionId: validated.selectedOptionVersionId,
      rawValue: validated.rawValue,
      durationMs: validated.durationMs,
      focusLostCount: validated.focusLostCount ?? 0,
      firstInteractionAt: validated.firstInteractionAt ? new Date(validated.firstInteractionAt) : null
    });

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || 'Cevap kaydedilemedi.' };
  }
}

export async function pauseAssessmentAction(input: z.infer<typeof PauseAssessmentSchema>) {
  try {
    const validated = PauseAssessmentSchema.parse(input);
    const user = await getCurrentUser();

    const updated = await pauseAssessmentSession(validated.sessionId, user.id, validated.currentStep);
    return { success: true, data: { status: updated.status, currentStep: updated.currentStep } };
  } catch (error: any) {
    return { success: false, error: error.message || 'Oturum duraklatılamadı.' };
  }
}

export async function finalizeAssessmentAction(input: z.infer<typeof FinalizeAssessmentSchema>) {
  try {
    const validated = FinalizeAssessmentSchema.parse(input);
    const user = await getCurrentUser();

    const snapshot = await finalizeAssessmentAndCreateSnapshot(validated.sessionId, user.id);
    return { success: true, data: snapshot };
  } catch (error: any) {
    return { success: false, error: error.message || 'Değerlendirme tamamlanamadı.' };
  }
}

export async function getUserLatestProfileAction() {
  try {
    const user = await getCurrentUser();
    const snapshot = await getLatestProfileSnapshotForUser(user.id);
    return { success: true, data: snapshot };
  } catch (error: any) {
    return { success: false, error: error.message || 'Profil verisi alınamadı.' };
  }
}

export async function getUserAssessmentJourneyAction() {
  try {
    const user = await getCurrentUser();
    const journey = await getUserAssessmentJourney(user.id);
    return { success: true, data: journey };
  } catch (error: any) {
    return { success: false, error: error.message || 'Yolculuk verisi alınamadı.' };
  }
}

