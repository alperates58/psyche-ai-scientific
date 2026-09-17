import { NextResponse } from 'next/server';
import { getAllTheoryLenses, getAllTheorySources } from '@/lib/ai/theoryLens/theoryLensRegistry';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const lenses = getAllTheoryLenses();
    const sources = getAllTheorySources();

    const enrichedLenses = lenses.map((lens) => {
      const lensSources = sources.filter((s) => s.lensId === lens.lensId);
      return {
        ...lens,
        sourcesCount: lensSources.length,
        sources: lensSources,
      };
    });

    return NextResponse.json({
      success: true,
      count: enrichedLenses.length,
      lenses: enrichedLenses,
    });
  } catch (error: any) {
    console.error('Error fetching theory lenses:', error);
    return NextResponse.json(
      { error: 'Kuramsal mercekler listelenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
