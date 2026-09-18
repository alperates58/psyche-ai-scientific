import { NextResponse } from 'next/server';
import { getCurrentUserOrNull } from '@/lib/auth';
import { exportUserJournalData } from '@/services/journalService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/journal/export
 * Downloads privacy-compliant JSON export of user's active journal reflections
 */
export async function GET() {
  try {
    const user = await getCurrentUserOrNull();
    if (!user) {
      return NextResponse.json({ error: 'UNAUTHENTICATED' }, { status: 401 });
    }

    const exportData = await exportUserJournalData(user.id);

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="psycheai-yansimalar-${Date.now()}.json"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error: any) {
    console.error('GET /api/journal/export error:', error);
    return NextResponse.json(
      { error: error?.message || 'Dışa aktarma gerçekleştirilemedi.' },
      { status: 500 }
    );
  }
}
