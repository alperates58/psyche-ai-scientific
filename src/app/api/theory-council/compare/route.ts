import { NextResponse } from 'next/server';
import { getCurrentUserOrNull } from '@/lib/auth';
import { compareTheoryLensesService } from '@/services/theoryLensService';
import { isTheoryLensId } from '@/lib/ai/theoryLens/theoryLensRegistry';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUserOrNull();
    if (!user) {
      return NextResponse.json(
        { error: 'Yetkilendirme gerekli (Oturum bulunamadı)' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { lensIds, topicOrDomain } = body;

    if (!lensIds || !Array.isArray(lensIds) || lensIds.length < 2 || lensIds.length > 3) {
      return NextResponse.json(
        { error: 'Karşılaştırma için 2 veya 3 geçerli kuramsal mercek seçilmelidir.' },
        { status: 400 }
      );
    }

    for (const id of lensIds) {
      if (!isTheoryLensId(id)) {
        return NextResponse.json(
          { error: `Geçersiz kuramsal mercek kimliği: ${id}` },
          { status: 400 }
        );
      }
    }

    const comparison = await compareTheoryLensesService(
      user.id,
      lensIds,
      topicOrDomain
    );

    return NextResponse.json({
      success: true,
      comparison,
    });
  } catch (error: any) {
    console.error('Error comparing theory lenses:', error);
    return NextResponse.json(
      { error: error.message || 'Kuramsal karşılaştırma üretilirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
