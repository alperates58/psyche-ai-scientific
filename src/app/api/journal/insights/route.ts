import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserOrNull } from '@/lib/auth';
import { generateJournalInsight } from '@/lib/ai/journal/journalInsightEngine';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * POST /api/journal/insights
 * Generates or refreshes reflection insight for a specified entry
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUserOrNull();
    if (!user) {
      return NextResponse.json({ error: 'UNAUTHENTICATED' }, { status: 401 });
    }

    const body = await request.json();
    const { entryId } = body;

    if (!entryId) {
      return NextResponse.json({ error: 'entryId is required' }, { status: 400 });
    }

    const result = await generateJournalInsight(user.id, entryId);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('POST /api/journal/insights error:', error);
    return NextResponse.json(
      { error: error?.message || 'Yansıma analizi üretilemedi.' },
      { status: 500 }
    );
  }
}
