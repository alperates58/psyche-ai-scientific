import { Prisma } from '@prisma/client';
import { hashIp, sanitizeAuditMetadata } from './auditLog';

export type ScientificAuditEventType =
  | 'FORM_VERSION_CREATED'
  | 'FORM_VERSION_CLONED'
  | 'FORM_ITEMS_UPDATED'
  | 'FORM_METADATA_UPDATED'
  | 'FORM_PUBLISHED'
  | 'FORM_ARCHIVED'
  | 'ITEM_CREATED'
  | 'ITEM_VERSION_CREATED'
  | 'ITEM_VERSION_UPDATED_DRAFT'
  | 'ITEM_METADATA_UPDATED';

export interface LogScientificAuditParams {
  eventType: ScientificAuditEventType;
  actorUserId?: string | null;
  targetEntityType: 'AssessmentFormVersion' | 'Item' | 'ItemVersion' | 'AssessmentFormItem';
  targetEntityId?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, any> | null;
}

/**
 * Transactional scientific audit logger.
 * MUST be executed within the same Prisma transaction client as the mutation.
 * If audit logging fails, the surrounding transaction will roll back.
 */
export async function logScientificAuditEventTx(
  tx: Prisma.TransactionClient,
  params: LogScientificAuditParams
): Promise<void> {
  const ipHash = hashIp(params.ip);
  const sanitizedMetadata = sanitizeAuditMetadata(params.metadata);

  await tx.scientificAuditEvent.create({
    data: {
      eventType: params.eventType,
      actorUserId: params.actorUserId || null,
      targetEntityType: params.targetEntityType,
      targetEntityId: params.targetEntityId || null,
      ipHash,
      userAgent: params.userAgent ? params.userAgent.substring(0, 500) : null,
      metadata: sanitizedMetadata ? (sanitizedMetadata as any) : undefined,
    },
  });
}
