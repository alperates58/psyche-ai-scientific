import { NextResponse } from 'next/server';
import { getCurrentUserOrNull } from '@/lib/auth';
import { generateTheoryInsight } from '@/services/theoryLensService';
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
    const { lensId } = body;

    if (!lensId || typeof lensId !== 'string' || !isTheoryLensId(lensId)) {
      return NextResponse.json(
        { error: 'Geçersiz veya eksik kuramsal mercek kimliği (lensId).' },
        { status: 400 }
      );
    }

    const insight = await generateTheoryInsight(user.id, lensId);

    return NextResponse.json({
      success: true,
      insight,
    });
  } catch (error: any) {
    console.error('Error generating theory insight:', error);
    return NextResponse.json(
      { error: error.message || 'Kuramsal yorum üretilirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
