'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requirePermission } from '@/lib/auth';
import {
  createAssessmentFormDraft,
  cloneAssessmentFormDraft,
  updateAssessmentFormDraftMetadata,
  addQuestionToFormDraft,
  removeQuestionFromFormDraft,
  reorderFormDraftItems,
  createNewItem,
  createNewItemVersion,
  updateDraftItemVersion,
  updateItemMetadata,
} from '@/services/scientificAdminService';

function safeRevalidatePath(path: string) {
  try {
    revalidatePath(path);
  } catch {}
}

export interface ActionResult<T = any> {
  success: boolean;
  error?: string;
  data?: T;
}

// =========================================================
// ZOD VALIDATION SCHEMAS
// =========================================================

export const CreateFormDraftSchema = z.object({
  moduleId: z.string().min(1, 'Modül seçimi zorunludur'),
  versionCode: z
    .string()
    .min(2, 'Sürüm kodu en az 2 karakter olmalıdır')
    .max(50, 'Sürüm kodu en fazla 50 karakter olabilir')
    .regex(/^[a-zA-Z0-9_.\-]+$/, 'Sürüm kodu yalnızca alfanumerik ve .-_ karakterleri içerebilir'),
  description: z.string().max(1000, 'Açıklama 1000 karakterden uzun olamaz').optional(),
});

export const CloneFormDraftSchema = z.object({
  sourceFormVersionId: z.string().min(1, 'Kaynak form ID zorunludur'),
  newVersionCode: z
    .string()
    .min(2, 'Yeni sürüm kodu en az 2 karakter olmalıdır')
    .max(50, 'Yeni sürüm kodu en fazla 50 karakter olabilir')
    .regex(/^[a-zA-Z0-9_.\-]+$/, 'Sürüm kodu yalnızca alfanumerik ve .-_ karakterleri içerebilir'),
  description: z.string().max(1000, 'Açıklama 1000 karakterden uzun olamaz').optional(),
});

export const UpdateFormMetadataSchema = z.object({
  formVersionId: z.string().min(1, 'Form ID zorunludur'),
  description: z.string().max(1000).optional(),
  versionCode: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-zA-Z0-9_.\-]+$/)
    .optional(),
});

export const AddQuestionToFormSchema = z.object({
  formVersionId: z.string().min(1, 'Form ID zorunludur'),
  itemVersionId: z.string().min(1, 'Madde sürüm ID zorunludur'),
});

export const RemoveQuestionFromFormSchema = z.object({
  formVersionId: z.string().min(1, 'Form ID zorunludur'),
  formItemId: z.string().min(1, 'Form madde ID zorunludur'),
});

export const ReorderFormItemsSchema = z.object({
  formVersionId: z.string().min(1, 'Form ID zorunludur'),
  orderedFormItemIds: z.array(z.string().min(1)).min(1, 'En az bir madde ID gereklidir'),
});

export const CreateNewItemSchema = z.object({
  facetId: z.string().min(1, 'Alt boyut (Facet) seçimi zorunludur'),
  itemCode: z
    .string()
    .min(2, 'Madde kodu en az 2 karakter olmalıdır')
    .max(60, 'Madde kodu en fazla 60 karakter olabilir')
    .regex(/^[a-zA-Z0-9_\-]+$/, 'Madde kodu yalnızca alfanumerik, alt çizgi ve tire içerebilir'),
  itemType: z.string().default('LIKERT_5'),
  isKeyed: z.boolean(),
  isAttentionCheck: z.boolean().default(false),
  instrumentId: z.string().nullable().optional(),
  promptTr: z.string().min(3, 'Türkçe önerme metni en az 3 karakter olmalıdır').max(1000),
  promptEn: z.string().min(3, 'İngilizce önerme metni en az 3 karakter olmalıdır').max(1000),
  notes: z.string().max(1000).optional(),
  authorType: z.string().default('ADMIN_AUTHORED'),
});

export const CreateNewItemVersionSchema = z.object({
  itemId: z.string().min(1, 'Madde ID zorunludur'),
  promptTr: z.string().min(3, 'Türkçe önerme metni en az 3 karakter olmalıdır').max(1000),
  promptEn: z.string().min(3, 'İngilizce önerme metni en az 3 karakter olmalıdır').max(1000),
  notes: z.string().max(1000).optional(),
  authorType: z.string().default('ADMIN_AUTHORED'),
  cloneOptionsFromVersionId: z.string().optional(),
  customOptions: z
    .array(
      z.object({
        value: z.number().int(),
        labelTr: z.string().min(1),
        labelEn: z.string().min(1),
        sortOrder: z.number().int(),
      })
    )
    .optional(),
});

export const UpdateDraftItemVersionSchema = z.object({
  itemVersionId: z.string().min(1, 'Madde sürüm ID zorunludur'),
  promptTr: z.string().min(3).max(1000).optional(),
  promptEn: z.string().min(3).max(1000).optional(),
  notes: z.string().max(1000).optional(),
  options: z
    .array(
      z.object({
        id: z.string().optional(),
        value: z.number().int(),
        labelTr: z.string().min(1),
        labelEn: z.string().min(1),
      })
    )
    .optional(),
});

export const UpdateItemMetadataSchema = z.object({
  itemId: z.string().min(1, 'Madde ID zorunludur'),
  facetId: z.string().optional(),
  isKeyed: z.boolean().optional(),
  isAttentionCheck: z.boolean().optional(),
  instrumentId: z.string().nullable().optional(),
});

// =========================================================
// SERVER ACTIONS
// =========================================================

export async function createAssessmentFormDraftAction(
  input: z.infer<typeof CreateFormDraftSchema>
): Promise<ActionResult> {
  try {
    const actor = await requirePermission('FORM_DRAFT_MANAGE');
    const parsed = CreateFormDraftSchema.parse(input);

    const form = await createAssessmentFormDraft(parsed, {
      actorUserId: actor.id,
    });

    safeRevalidatePath('/admin/assessment-forms');
    safeRevalidatePath(`/admin/assessment-forms/${form.id}`);

    return { success: true, data: form };
  } catch (error: any) {
    return { success: false, error: error.message || 'Taslak form oluşturulamadı.' };
  }
}

export async function cloneAssessmentFormDraftAction(
  input: z.infer<typeof CloneFormDraftSchema>
): Promise<ActionResult> {
  try {
    const actor = await requirePermission('FORM_DRAFT_MANAGE');
    const parsed = CloneFormDraftSchema.parse(input);

    const cloned = await cloneAssessmentFormDraft(parsed, {
      actorUserId: actor.id,
    });

    safeRevalidatePath('/admin/assessment-forms');
    safeRevalidatePath(`/admin/assessment-forms/${cloned.id}`);

    return { success: true, data: cloned };
  } catch (error: any) {
    return { success: false, error: error.message || 'Form klonlanamadı.' };
  }
}

export async function updateAssessmentFormDraftMetadataAction(
  input: z.infer<typeof UpdateFormMetadataSchema>
): Promise<ActionResult> {
  try {
    const actor = await requirePermission('FORM_DRAFT_MANAGE');
    const parsed = UpdateFormMetadataSchema.parse(input);

    const updated = await updateAssessmentFormDraftMetadata(parsed, {
      actorUserId: actor.id,
    });

    safeRevalidatePath('/admin/assessment-forms');
    safeRevalidatePath(`/admin/assessment-forms/${input.formVersionId}`);

    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, error: error.message || 'Form üst verisi güncellenemedi.' };
  }
}

export async function addQuestionToFormDraftAction(
  input: z.infer<typeof AddQuestionToFormSchema>
): Promise<ActionResult> {
  try {
    const actor = await requirePermission('FORM_DRAFT_MANAGE');
    const parsed = AddQuestionToFormSchema.parse(input);

    const formItem = await addQuestionToFormDraft(parsed, {
      actorUserId: actor.id,
    });

    safeRevalidatePath(`/admin/assessment-forms/${input.formVersionId}`);
    safeRevalidatePath('/admin/assessment-forms');

    return { success: true, data: formItem };
  } catch (error: any) {
    return { success: false, error: error.message || 'Soru forma eklenemedi.' };
  }
}

export async function removeQuestionFromFormDraftAction(
  input: z.infer<typeof RemoveQuestionFromFormSchema>
): Promise<ActionResult> {
  try {
    const actor = await requirePermission('FORM_DRAFT_MANAGE');
    const parsed = RemoveQuestionFromFormSchema.parse(input);

    const result = await removeQuestionFromFormDraft(parsed, {
      actorUserId: actor.id,
    });

    safeRevalidatePath(`/admin/assessment-forms/${input.formVersionId}`);
    safeRevalidatePath('/admin/assessment-forms');

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || 'Soru formdan çıkarılamadı.' };
  }
}

export async function reorderFormDraftItemsAction(
  input: z.infer<typeof ReorderFormItemsSchema>
): Promise<ActionResult> {
  try {
    const actor = await requirePermission('FORM_DRAFT_MANAGE');
    const parsed = ReorderFormItemsSchema.parse(input);

    const result = await reorderFormDraftItems(parsed, {
      actorUserId: actor.id,
    });

    safeRevalidatePath(`/admin/assessment-forms/${input.formVersionId}`);

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || 'Sorular yeniden sıralanamadı.' };
  }
}

export async function createNewItemAction(
  input: z.infer<typeof CreateNewItemSchema>
): Promise<ActionResult> {
  try {
    const actor = await requirePermission('ITEM_AUTHOR');
    const parsed = CreateNewItemSchema.parse(input);

    const result = await createNewItem(parsed, {
      actorUserId: actor.id,
    });

    safeRevalidatePath('/admin/item-bank');
    safeRevalidatePath(`/admin/item-bank/${result.item.id}`);

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || 'Yeni madde oluşturulamadı.' };
  }
}

export async function createNewItemVersionAction(
  input: z.infer<typeof CreateNewItemVersionSchema>
): Promise<ActionResult> {
  try {
    const actor = await requirePermission('ITEM_AUTHOR');
    const parsed = CreateNewItemVersionSchema.parse(input);

    const newVersion = await createNewItemVersion(parsed, {
      actorUserId: actor.id,
    });

    safeRevalidatePath('/admin/item-bank');
    safeRevalidatePath(`/admin/item-bank/${input.itemId}`);

    return { success: true, data: newVersion };
  } catch (error: any) {
    return { success: false, error: error.message || 'Yeni madde sürümü oluşturulamadı.' };
  }
}

export async function updateDraftItemVersionAction(
  input: z.infer<typeof UpdateDraftItemVersionSchema>
): Promise<ActionResult> {
  try {
    const actor = await requirePermission('ITEM_AUTHOR');
    const parsed = UpdateDraftItemVersionSchema.parse(input);

    const updated = await updateDraftItemVersion(parsed, {
      actorUserId: actor.id,
    });

    safeRevalidatePath('/admin/item-bank');

    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, error: error.message || 'Taslak madde güncellenemedi.' };
  }
}

export async function updateItemMetadataAction(
  input: z.infer<typeof UpdateItemMetadataSchema>
): Promise<ActionResult> {
  try {
    const actor = await requirePermission('ITEM_AUTHOR');
    const parsed = UpdateItemMetadataSchema.parse(input);

    const updated = await updateItemMetadata(parsed, {
      actorUserId: actor.id,
    });

    safeRevalidatePath('/admin/item-bank');
    safeRevalidatePath(`/admin/item-bank/${input.itemId}`);

    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, error: error.message || 'Madde üst verisi güncellenemedi.' };
  }
}
