import { Prisma, PrismaClient } from '@prisma/client';
import { prisma as defaultPrisma } from './prisma';

export interface MutabilityCheckResult {
  isMutable: boolean;
  reason?: string;
}

/**
 * Asserts that an AssessmentFormVersion is mutable (status === 'DRAFT' and isPublished === false).
 * Throws an error if the form is published or archived.
 */
export async function assertFormVersionMutable(
  formVersionId: string,
  tx?: Prisma.TransactionClient | PrismaClient
): Promise<any> {
  const db = tx || defaultPrisma;

  const form = await db.assessmentFormVersion.findUnique({
    where: { id: formVersionId },
    select: {
      id: true,
      moduleId: true,
      versionCode: true,
      status: true,
      isPublished: true,
      itemCount: true,
    },
  });

  if (!form) {
    throw new Error('NOT_FOUND: Değerlendirme formu bulunamadı.');
  }

  if (form.status !== 'DRAFT' || form.isPublished) {
    throw new Error(
      `FORM_IMMUTABLE: Yalnızca DRAFT durumundaki değerlendirme formları düzenlenebilir. Bu form (${form.versionCode}) '${form.status}' durumundadır ve dondurulmuştur.`
    );
  }

  return form;
}

/**
 * Evaluates whether an ItemVersion is mutable without throwing.
 * Useful for UI state, badge rendering, and disabling edit actions.
 */
export function checkItemVersionMutability(version: {
  status: string;
  isActive: boolean;
  formItems?: {
    formVersion: {
      status: string;
      isPublished: boolean;
      versionCode?: string;
    };
  }[];
  _count?: {
    responses?: number;
  };
  responsesCount?: number;
}): MutabilityCheckResult {
  if (version.status !== 'DRAFT' || version.isActive) {
    return {
      isMutable: false,
      reason: `Sürüm durumu '${version.status}' olduğu için dondurulmuştur.`,
    };
  }

  const responsesCount = version.responsesCount ?? version._count?.responses ?? 0;
  if (responsesCount > 0) {
    return {
      isMutable: false,
      reason: `Bu sürüme ait ${responsesCount} adet toplanmış katılımcı yanıtı bulunmaktadır.`,
    };
  }

  if (version.formItems && version.formItems.length > 0) {
    for (const fi of version.formItems) {
      if (fi.formVersion.status === 'PUBLISHED' || fi.formVersion.status === 'ARCHIVED' || fi.formVersion.isPublished) {
        return {
          isMutable: false,
          reason: `Bu sürüm yayınlanmış veya arşivlenmiş bir formda (${fi.formVersion.versionCode || fi.formVersion.status}) kullanılmaktadır.`,
        };
      }
    }
  }

  return { isMutable: true };
}

/**
 * Asserts that an ItemVersion is mutable.
 * Throws ITEM_VERSION_IMMUTABLE if:
 * 1. status !== 'DRAFT' or isActive === true
 * 2. referenced in a PUBLISHED or ARCHIVED form
 * 3. has collected responses (ResponseRecord count > 0)
 */
export async function assertItemVersionMutable(
  itemVersionId: string,
  tx?: Prisma.TransactionClient | PrismaClient
): Promise<any> {
  const db = tx || defaultPrisma;

  const version = await db.itemVersion.findUnique({
    where: { id: itemVersionId },
    include: {
      formItems: {
        include: {
          formVersion: {
            select: {
              id: true,
              versionCode: true,
              status: true,
              isPublished: true,
            },
          },
        },
      },
      _count: {
        select: {
          responses: true,
        },
      },
    },
  });

  if (!version) {
    throw new Error('NOT_FOUND: Madde sürümü bulunamadı.');
  }

  const check = checkItemVersionMutability(version);
  if (!check.isMutable) {
    throw new Error(`ITEM_VERSION_IMMUTABLE: ${check.reason}`);
  }

  return version;
}

/**
 * Evaluates whether an Item's core scientific metadata is mutable without throwing.
 */
export function checkItemMetadataMutability(item: {
  versions?: {
    status: string;
    formItems?: {
      formVersion: {
        status: string;
        isPublished: boolean;
        versionCode?: string;
      };
    }[];
    _count?: {
      responses?: number;
    };
  }[];
  _count?: {
    responses?: number;
  };
  responsesCount?: number;
}): MutabilityCheckResult {
  const totalResponses = item.responsesCount ?? item._count?.responses ?? 0;
  if (totalResponses > 0) {
    return {
      isMutable: false,
      reason: `Bu maddeye ait toplanmış ${totalResponses} yanıt bulunmaktadır. Bilimsel boyut ve puanlama yönü dondurulmuştur.`,
    };
  }

  if (item.versions) {
    for (const ver of item.versions) {
      if (ver._count?.responses && ver._count.responses > 0) {
        return {
          isMutable: false,
          reason: `Maddenin bir sürümüne ait toplanmış yanıt bulunmaktadır.`,
        };
      }
      if (ver.formItems) {
        for (const fi of ver.formItems) {
          if (fi.formVersion.status === 'PUBLISHED' || fi.formVersion.status === 'ARCHIVED' || fi.formVersion.isPublished) {
            return {
              isMutable: false,
              reason: `Bu madde yayınlanmış/arşivlenmiş bir formda (${fi.formVersion.versionCode || fi.formVersion.status}) kullanılmıştır.`,
            };
          }
        }
      }
    }
  }

  return { isMutable: true };
}

/**
 * Asserts that an Item's core scientific metadata (facetId, isKeyed, itemType, isAttentionCheck, instrumentId) is mutable.
 * Throws ITEM_METADATA_IMMUTABLE if any version is published/archived or has responses.
 */
export async function assertItemMetadataMutable(
  itemId: string,
  tx?: Prisma.TransactionClient | PrismaClient
): Promise<any> {
  const db = tx || defaultPrisma;

  const item = await db.item.findUnique({
    where: { id: itemId },
    include: {
      versions: {
        include: {
          formItems: {
            include: {
              formVersion: {
                select: {
                  id: true,
                  versionCode: true,
                  status: true,
                  isPublished: true,
                },
              },
            },
          },
          _count: {
            select: {
              responses: true,
            },
          },
        },
      },
      _count: {
        select: {
          responses: true,
        },
      },
    },
  });

  if (!item) {
    throw new Error('NOT_FOUND: Madde bulunamadı.');
  }

  const check = checkItemMetadataMutability(item);
  if (!check.isMutable) {
    throw new Error(`ITEM_METADATA_IMMUTABLE: ${check.reason}`);
  }

  return item;
}
