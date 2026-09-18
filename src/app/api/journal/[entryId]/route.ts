import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserOrNull } from '@/lib/auth';
import {
  getJournalEntryById,
  updateJournalEntry,
  softDeleteJournalEntry,
} from '@/services/journalService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Params {
  params: { entryId: string };
}

/**
 * GET /api/journal/[entryId]
 */
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUserOrNull();
    if (!user) {
      return NextResponse.json({ error: 'UNAUTHENTICATED' }, { status: 401 });
    }

    const entry = await getJournalEntryById(user.id, params.entryId);
    if (!entry) {
      return NextResponse.json({ error: 'NOT_FOUND_OR_UNAUTHORIZED' }, { status: 404 });
    }

    return NextResponse.json(entry, { status: 200 });
  } catch (error: any) {
    console.error('GET /api/journal/[entryId] error:', error);
    return NextResponse.json(
      { error: error?.message || 'Yansıma kaydı alınamadı.' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/journal/[entryId]
 * Updates entry and invalidates stale derived insights/relationships
 */
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUserOrNull();
    if (!user) {
      return NextResponse.json({ error: 'UNAUTHENTICATED' }, { status: 401 });
    }

    const body = await request.json();
    const updated = await updateJournalEntry(user.id, params.entryId, body);

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    console.error('PUT /api/journal/[entryId] error:', error);
    return NextResponse.json(
      { error: error?.message || 'Yansıma kaydı güncellenemedi.' },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/journal/[entryId]
 * Soft-deletes entry and purges derived insights/relationships
 */
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUserOrNull();
    if (!user) {
      return NextResponse.json({ error: 'UNAUTHENTICATED' }, { status: 401 });
    }

    const success = await softDeleteJournalEntry(user.id, params.entryId);
    if (!success) {
      return NextResponse.json({ error: 'NOT_FOUND_OR_UNAUTHORIZED' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('DELETE /api/journal/[entryId] error:', error);
    return NextResponse.json(
      { error: error?.message || 'Yansıma kaydı silinemedi.' },
      { status: 400 }
    );
  }
}
