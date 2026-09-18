import { NextResponse } from 'next/server';
import { getCurrentUserOrNull } from '@/lib/auth';
import { computeDynamicObservationSummary } from '@/services/journalObservationService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/journal/summary
 * Returns dynamically computed observational summary, repeated themes, and contextual variations
 */
export async function GET() {
  try {
    const user = await getCurrentUserOrNull();
    if (!user) {
      return NextResponse.json({ error: 'UNAUTHENTICATED' }, { status: 401 });
    }

    const summary = await computeDynamicObservationSummary(user.id);

    return NextResponse.json(summary, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      },
    });
  } catch (error: any) {
    console.error('GET /api/journal/summary error:', error);
    return NextResponse.json(
      { error: error?.message || 'Gözlem özeti hesaplanırken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
