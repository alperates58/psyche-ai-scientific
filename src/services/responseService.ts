import { prisma } from '@/lib/prisma';
import { calculateReverseScore } from '@/psychometrics/scoring';

export interface RecordResponseParams {
  userId: string;
  sessionId: string;
  formItemId: string;
  selectedOptionVersionId: string;
  rawValue: number;
  durationMs: number;
  focusLostCount?: number;
  firstInteractionAt?: Date | null;
}

export async function recordResponse(params: RecordResponseParams) {
  const {
    userId,
    sessionId,
    formItemId,
    selectedOptionVersionId,
    rawValue,
    durationMs,
    focusLostCount = 0,
    firstInteractionAt = null
  } = params;

  // 1. Session verification
  const session = await prisma.assessmentSession.findUnique({
    where: { id: sessionId },
    include: {
      formVersion: true
    }
  });

  if (!session) {
    throw new Error('Değerlendirme oturumu bulunamadı.');
  }

  if (session.userId !== userId) {
    throw new Error('Yetkisiz oturum işlemi.');
  }

  if (session.status !== 'IN_PROGRESS') {
    throw new Error(`Cevap kaydedilemez: Oturum durumu '${session.status}'.`);
  }

  // 2. Form item verification (must belong to session's frozen form version)
  const formItem = await prisma.assessmentFormItem.findUnique({
    where: { id: formItemId },
    include: {
      itemVersion: {
        include: {
          item: true,
          options: true
        }
      }
    }
  });

  if (!formItem || formItem.formVersionId !== session.formVersionId) {
    throw new Error('Geçersiz form maddesi veya dondurulmuş form sürümü uyumsuzluğu.');
  }

  // 3. Option & Value verification
  const selectedOption = formItem.itemVersion.options.find(
    opt => opt.id === selectedOptionVersionId
  );

  if (!selectedOption) {
    throw new Error('Geçersiz cevap seçeneği.');
  }

  if (selectedOption.value !== rawValue) {
    throw new Error('Cevap değeri ile seçilen opsiyon sürümü uyuşmuyor.');
  }

  // 4. Server-side reverse scoring calculation (STRICT: Client never sends scoredValue)
  const item = formItem.itemVersion.item;
  const isKeyed = item.isKeyed;
  const options = formItem.itemVersion.options;
  const optionValues = options.map(o => o.value);
  const minScale = Math.min(...optionValues);
  const maxScale = Math.max(...optionValues);

  const scoredValue = isKeyed
    ? Number(rawValue)
    : calculateReverseScore(Number(rawValue), minScale, maxScale);

  // 5. Atomic Transaction: Record or Revise Response + Log Telemetry
  return await prisma.$transaction(async tx => {
    // Check existing response
    const existing = await tx.responseRecord.findUnique({
      where: {
        sessionId_formItemId: {
          sessionId,
          formItemId
        }
      }
    });

    let recordId: string;
    let sequenceNumber: number;

    if (existing) {
      sequenceNumber = existing.revisionCount + 1;
      const updated = await tx.responseRecord.update({
        where: { id: existing.id },
        data: {
          rawValue,
          scoredValue,
          selectedOptionVersionId,
          revisionCount: sequenceNumber,
          updatedAt: new Date()
        }
      });
      recordId = updated.id;
    } else {
      sequenceNumber = 1;
      const created = await tx.responseRecord.create({
        data: {
          sessionId,
          itemId: item.id,
          itemVersionId: formItem.itemVersionId,
          formItemId,
          selectedOptionVersionId,
          rawValue,
          scoredValue,
          revisionCount: 1
        }
      });
      recordId = created.id;
    }

    // Record immutable revision audit entry
    await tx.responseRevision.create({
      data: {
        responseRecordId: recordId,
        sequence: sequenceNumber,
        rawValue,
        selectedOptionVersionId,
        durationMs: Math.max(0, Math.round(durationMs)),
        changedAt: new Date()
      }
    });

    // Record client-observed telemetry with server timestamp
    await tx.responseTelemetry.create({
      data: {
        sessionId,
        responseRecordId: recordId,
        clientObservedDurationMs: Math.max(0, Math.round(durationMs)),
        focusLostCount: Math.max(0, focusLostCount),
        firstInteractionAt,
        serverReceivedAt: new Date(),
        telemetryTrust: 'client_observed'
      }
    });

    // Update session last active timestamp
    await tx.assessmentSession.update({
      where: { id: sessionId },
      data: { lastActiveAt: new Date() }
    });

    return {
      recordId,
      sequence: sequenceNumber,
      scoredValue,
      isRevision: !!existing
    };
  });
}
