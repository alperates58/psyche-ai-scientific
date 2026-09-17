import { NextResponse } from 'next/server';
import { getCurrentUserOrNull } from '@/lib/auth';
import { sendTheoryChatMessage } from '@/services/theoryLensService';
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
    const { lensId, messages = [], message } = body;

    if (!lensId || typeof lensId !== 'string' || !isTheoryLensId(lensId)) {
      return NextResponse.json(
        { error: 'Geçersiz veya eksik kuramsal mercek kimliği (lensId).' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Mesaj içeriği boş olamaz.' },
        { status: 400 }
      );
    }

    const response = await sendTheoryChatMessage(
      user.id,
      lensId,
      messages,
      message.trim()
    );

    return NextResponse.json({
      success: true,
      response,
    });
  } catch (error: any) {
    console.error('Error in theory chat:', error);
    return NextResponse.json(
      { error: error.message || 'Kuramsal diyalog yanıtı oluşturulurken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
