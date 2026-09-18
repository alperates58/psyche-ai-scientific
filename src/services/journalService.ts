/**
 * FAZ 2.21: Journal & Reflection Service
 * Authoritative CRUD, Ownership Validation, Soft-Delete & Edit Invalidation
 */

import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import {
  JournalEntryV1,
  CreateJournalEntryInput,
  UpdateJournalEntryInput,
  JournalContextTag,
  VALID_JOURNAL_CONTEXT_TAGS,
  VALID_JOURNAL_ENTRY_TYPES,
  VALID_LIFE_EVENT_TYPES,
  JournalEntryType,
  JournalLifeEventType,
} from '@/types/journal';

/**
 * Deterministic hash generator for entry content invalidation check
 */
export function generateEntryContentHash(content: {
  title?: string | null;
  body: string;
  entryType?: string;
  contextTags?: string[];
  moodSelfReport?: number | null;
  energySelfReport?: number | null;
  stressSelfReport?: number | null;
}): string {
  const norm = [
    (content.title || '').trim(),
    content.body.trim(),
    content.entryType || '',
    (content.contextTags || []).slice().sort().join(','),
    content.moodSelfReport ?? '',
    content.energySelfReport ?? '',
    content.stressSelfReport ?? '',
  ].join('|');

  return crypto.createHash('sha256').update(norm).digest('hex').substring(0, 16);
}

/**
 * Validates subjective rating value (1 <= value <= 5)
 */
export function validateRating(val: number | null | undefined, fieldName: string): number | null {
  if (val === null || val === undefined) return null;
  if (!Number.isInteger(val) || val < 1 || val > 5) {
    throw new Error(`Invalid rating for ${fieldName}: must be an integer between 1 and 5 (got ${val})`);
  }
  return val;
}

/**
 * Validates and filters context tags against controlled taxonomy
 */
export function validateContextTags(tags?: string[]): JournalContextTag[] {
  if (!tags || !Array.isArray(tags)) return ['GENERAL'];
  const validSet = new Set<string>(VALID_JOURNAL_CONTEXT_TAGS);
  const validated = tags
    .map((t) => t.trim().toUpperCase())
    .filter((t): t is JournalContextTag => validSet.has(t));
  return validated.length > 0 ? Array.from(new Set(validated)) : ['GENERAL'];
}

/**
 * Create a new Journal Entry
 */
export async function createJournalEntry(
  userId: string,
  input: CreateJournalEntryInput
): Promise<JournalEntryV1> {
  if (!userId) {
    throw new Error('Unauthorized: userId is required to create a journal entry.');
  }

  const cleanBody = (input.body || '').trim();
  if (!cleanBody) {
    throw new Error('Journal entry body cannot be empty.');
  }

  const mood = validateRating(input.moodSelfReport, 'moodSelfReport');
  const energy = validateRating(input.energySelfReport, 'energySelfReport');
  const stress = validateRating(input.stressSelfReport, 'stressSelfReport');

  const contextTags = validateContextTags(input.contextTags);
  const userTags = Array.isArray(input.userTags)
    ? Array.from(new Set(input.userTags.map((t) => t.trim()).filter(Boolean)))
    : [];

  const entryType: JournalEntryType =
    input.entryType && VALID_JOURNAL_ENTRY_TYPES.includes(input.entryType)
      ? input.entryType
      : 'FREE_REFLECTION';

  const lifeEventType: JournalLifeEventType | null =
    input.isLifeEvent && input.lifeEventType && VALID_LIFE_EVENT_TYPES.includes(input.lifeEventType)
      ? input.lifeEventType
      : null;

  const entry = await prisma.journalEntry.create({
    data: {
      userId,
      title: input.title?.trim() || null,
      body: cleanBody,
      entryType,
      moodSelfReport: mood,
      energySelfReport: energy,
      stressSelfReport: stress,
      contextTags,
      userTags,
      isLifeEvent: Boolean(input.isLifeEvent),
      lifeEventType,
    },
    include: {
      insights: true,
      relationships: true,
    },
  });

  return formatJournalEntry(entry);
}

/**
 * Get active journal entries for a user
 */
export async function getJournalEntries(
  userId: string,
  options?: {
    contextTag?: string;
    entryType?: string;
    isLifeEvent?: boolean;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }
): Promise<JournalEntryV1[]> {
  if (!userId) return [];

  const where: any = {
    userId,
    deletedAt: null,
  };

  if (options?.contextTag && options.contextTag !== 'ALL') {
    where.contextTags = { has: options.contextTag };
  }

  if (options?.entryType && options.entryType !== 'ALL') {
    where.entryType = options.entryType;
  }

  if (options?.isLifeEvent !== undefined) {
    where.isLifeEvent = options.isLifeEvent;
  }

  if (options?.startDate || options?.endDate) {
    where.createdAt = {};
    if (options.startDate) where.createdAt.gte = options.startDate;
    if (options.endDate) where.createdAt.lte = options.endDate;
  }

  const entries = await prisma.journalEntry.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: options?.limit ?? 100,
    skip: options?.offset ?? 0,
    include: {
      insights: true,
      relationships: true,
    },
  });

  return entries.map(formatJournalEntry);
}

/**
 * Get single journal entry by ID with strict ownership validation
 */
export async function getJournalEntryById(
  userId: string,
  entryId: string
): Promise<JournalEntryV1 | null> {
  if (!userId || !entryId) return null;

  const entry = await prisma.journalEntry.findFirst({
    where: {
      id: entryId,
      userId,
      deletedAt: null,
    },
    include: {
      insights: true,
      relationships: true,
    },
  });

  if (!entry) return null;
  return formatJournalEntry(entry);
}

/**
 * Update an existing Journal Entry
 * Invariant: Invalidates and deletes all previously derived insights & relationships
 */
export async function updateJournalEntry(
  userId: string,
  entryId: string,
  input: UpdateJournalEntryInput
): Promise<JournalEntryV1> {
  if (!userId || !entryId) {
    throw new Error('Unauthorized');
  }

  // 1. Verify ownership & existence
  const existing = await prisma.journalEntry.findFirst({
    where: { id: entryId, userId, deletedAt: null },
  });

  if (!existing) {
    throw new Error('Journal entry not found or unauthorized.');
  }

  const dataToUpdate: any = {};

  if (input.title !== undefined) dataToUpdate.title = input.title?.trim() || null;
  if (input.body !== undefined) {
    const cleanBody = input.body.trim();
    if (!cleanBody) throw new Error('Journal entry body cannot be empty.');
    dataToUpdate.body = cleanBody;
  }
  if (input.entryType !== undefined) {
    if (VALID_JOURNAL_ENTRY_TYPES.includes(input.entryType)) {
      dataToUpdate.entryType = input.entryType;
    }
  }
  if (input.moodSelfReport !== undefined) {
    dataToUpdate.moodSelfReport = validateRating(input.moodSelfReport, 'moodSelfReport');
  }
  if (input.energySelfReport !== undefined) {
    dataToUpdate.energySelfReport = validateRating(input.energySelfReport, 'energySelfReport');
  }
  if (input.stressSelfReport !== undefined) {
    dataToUpdate.stressSelfReport = validateRating(input.stressSelfReport, 'stressSelfReport');
  }
  if (input.contextTags !== undefined) {
    dataToUpdate.contextTags = validateContextTags(input.contextTags);
  }
  if (input.userTags !== undefined) {
    dataToUpdate.userTags = Array.isArray(input.userTags)
      ? Array.from(new Set(input.userTags.map((t) => t.trim()).filter(Boolean)))
      : [];
  }
  if (input.isLifeEvent !== undefined) {
    dataToUpdate.isLifeEvent = Boolean(input.isLifeEvent);
    if (input.lifeEventType && VALID_LIFE_EVENT_TYPES.includes(input.lifeEventType)) {
      dataToUpdate.lifeEventType = input.lifeEventType;
    } else if (!input.isLifeEvent) {
      dataToUpdate.lifeEventType = null;
    }
  }

  // 2. Execute Edit Invalidation Transaction
  const updated = await prisma.$transaction(async (tx) => {
    // Delete stale derived insights
    await tx.journalInsight.deleteMany({
      where: { entryId },
    });

    // Delete stale profile relationships
    await tx.journalProfileRelationship.deleteMany({
      where: { entryId },
    });

    // Update entry
    return tx.journalEntry.update({
      where: { id: entryId },
      data: dataToUpdate,
      include: {
        insights: true,
        relationships: true,
      },
    });
  });

  return formatJournalEntry(updated);
}

/**
 * Soft Delete Journal Entry (User Delete Action)
 * Invariant: Explicitly deletes derived insights & relationships, sets deletedAt = now()
 */
export async function softDeleteJournalEntry(userId: string, entryId: string): Promise<boolean> {
  if (!userId || !entryId) return false;

  const existing = await prisma.journalEntry.findFirst({
    where: { id: entryId, userId, deletedAt: null },
  });

  if (!existing) {
    throw new Error('Journal entry not found or unauthorized.');
  }

  await prisma.$transaction(async (tx) => {
    // 1. Delete derived insights for entry
    await tx.journalInsight.deleteMany({
      where: { entryId },
    });

    // 2. Delete derived relationships for entry
    await tx.journalProfileRelationship.deleteMany({
      where: { entryId },
    });

    // 3. Set deletedAt
    await tx.journalEntry.update({
      where: { id: entryId },
      data: { deletedAt: new Date() },
    });
  });

  return true;
}

/**
 * Permanently Delete Journal Entry (Hard Purge)
 * Cascades child deletions automatically
 */
export async function deleteJournalEntryPermanently(
  userId: string,
  entryId: string
): Promise<boolean> {
  if (!userId || !entryId) return false;

  const existing = await prisma.journalEntry.findFirst({
    where: { id: entryId, userId },
  });

  if (!existing) {
    throw new Error('Journal entry not found or unauthorized.');
  }

  await prisma.journalEntry.delete({
    where: { id: entryId },
  });

  return true;
}

/**
 * Export User Journal Data (Privacy Compliant)
 */
export async function exportUserJournalData(userId: string) {
  if (!userId) throw new Error('Unauthorized');

  const entries = await prisma.journalEntry.findMany({
    where: { userId, deletedAt: null },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      title: true,
      body: true,
      entryType: true,
      contextTags: true,
      userTags: true,
      moodSelfReport: true,
      energySelfReport: true,
      stressSelfReport: true,
      isLifeEvent: true,
      lifeEventType: true,
      createdAt: true,
      updatedAt: true,
      insights: {
        select: {
          insightType: true,
          evidenceClass: true,
          summaryTr: true,
          reflectivePrompt: true,
          createdAt: true,
        },
      },
      relationships: {
        select: {
          relationshipType: true,
          evidenceType: true,
          strength: true,
          relatedFacetIds: true,
          relatedConstructIds: true,
          narrativeTr: true,
        },
      },
    },
  });

  return {
    exportedAt: new Date().toISOString(),
    entryCount: entries.length,
    disclaimer:
      'Bu dışa aktarma kişisel yansıma ve gözlem kayıtlarınızı içerir. Psikometrik ölçüm veya tanı yerine geçmez.',
    entries,
  };
}

/**
 * Helper to map Prisma entity to JournalEntryV1 DTO
 */
function formatJournalEntry(entry: any): JournalEntryV1 {
  return {
    id: entry.id,
    userId: entry.userId,
    title: entry.title,
    body: entry.body,
    entryType: entry.entryType as JournalEntryType,
    moodSelfReport: entry.moodSelfReport,
    energySelfReport: entry.energySelfReport,
    stressSelfReport: entry.stressSelfReport,
    contextTags: (entry.contextTags || []) as JournalContextTag[],
    userTags: entry.userTags || [],
    isLifeEvent: entry.isLifeEvent,
    lifeEventType: entry.lifeEventType as JournalLifeEventType | null,
    createdAt: entry.createdAt.toISOString ? entry.createdAt.toISOString() : new Date(entry.createdAt).toISOString(),
    updatedAt: entry.updatedAt.toISOString ? entry.updatedAt.toISOString() : new Date(entry.updatedAt).toISOString(),
    deletedAt: entry.deletedAt
      ? entry.deletedAt.toISOString
        ? entry.deletedAt.toISOString()
        : new Date(entry.deletedAt).toISOString()
      : null,
    insights: (entry.insights || []).map((i: any) => ({
      id: i.id,
      entryId: i.entryId,
      userId: i.userId,
      insightType: i.insightType,
      evidenceClass: i.evidenceClass,
      summaryTr: i.summaryTr,
      reflectivePrompt: i.reflectivePrompt,
      isFallback: i.isFallback,
      engineVersion: i.engineVersion,
      promptVersion: i.promptVersion,
      provider: i.provider,
      modelId: i.modelId,
      sourceContentHash: i.sourceContentHash,
      createdAt: i.createdAt.toISOString ? i.createdAt.toISOString() : new Date(i.createdAt).toISOString(),
    })),
    relationships: (entry.relationships || []).map((r: any) => ({
      id: r.id,
      entryId: r.entryId,
      relationshipType: r.relationshipType,
      evidenceType: r.evidenceType,
      strength: r.strength,
      relatedFacetIds: r.relatedFacetIds || [],
      relatedConstructIds: r.relatedConstructIds || [],
      relatedDomainIds: r.relatedDomainIds || [],
      narrativeTr: r.narrativeTr,
      createdAt: r.createdAt.toISOString ? r.createdAt.toISOString() : new Date(r.createdAt).toISOString(),
    })),
  };
}
