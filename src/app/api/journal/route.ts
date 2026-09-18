import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserOrNull } from '@/lib/auth';
import { createJournalEntry, getJournalEntries } from '@/services/journalService';
import { generateJournalInsight } from '@/lib/ai/journal/journalInsightEngine';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/journal
 * Retrieves non-deleted journal entries for current authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUserOrNull();
    if (!user) {
      return NextResponse.json({ error: 'UNAUTHENTICATED' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const contextTag = searchParams.get('contextTag') || undefined;
    const entryType = searchParams.get('entryType') || undefined;
    const isLifeEvent = searchParams.get('isLifeEvent') === 'true' ? true : undefined;

    const entries = await getJournalEntries(user.id, {
      contextTag,
      entryType,
      isLifeEvent,
    });

    return NextResponse.json(entries, { status: 200 });
  } catch (error: any) {
    console.error('GET /api/journal error:', error);
    return NextResponse.json(
      { error: error?.message || 'Yansıma kayıtları getirilirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/journal
 * Creates a new journal entry and generates initial reflection
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUserOrNull();
    if (!user) {
      return NextResponse.json({ error: 'UNAUTHENTICATED' }, { status: 401 });
    }

    const body = await request.json();
    const entry = await createJournalEntry(user.id, body);

    // Asynchronously generate AI reflection or return immediately
    let reflectionResult = null;
    try {
      reflectionResult = await generateJournalInsight(user.id, entry.id);
    } catch (aiErr) {
      console.warn('Initial reflection generation non-blocking error:', aiErr);
    }

    return NextResponse.json(
      {
        entry,
        reflection: reflectionResult?.insight || null,
        relationships: reflectionResult?.relationships || [],
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('POST /api/journal error:', error);
    return NextResponse.json(
      { error: error?.message || 'Yansıma kaydı oluşturulurken bir hata oluştu.' },
      { status: 400 }
    );
  }
}
