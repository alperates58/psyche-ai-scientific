import { NextResponse } from 'next/server';
import { getCurrentUserOrNull } from '@/lib/auth';
import {
  getUserReassessmentRecommendations,
  getModuleRepeatComparison,
} from '@/services/longitudinalService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/assessment/reassessment?moduleId=...
 * Returns reassessment recommendations, or module repeat comparison if moduleId is provided.
 */
export async function GET(request: Request) {
  try {
    const user = await getCurrentUserOrNull();
    if (!user) {
      return NextResponse.json(
        { error: 'UNAUTHENTICATED: Oturum açmanız gerekmektedir.' },
        { status: 401 }
      );
    }

    if (user.status === 'PENDING_VERIFICATION') {
      return NextResponse.json(
        { error: 'FORBIDDEN: E-posta doğrulaması tamamlanmamış hesaplar bu veriye erişemez.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');

    if (moduleId) {
      const comparison = await getModuleRepeatComparison(user.id, moduleId);
      return NextResponse.json(
        { comparison },
        {
          status: 200,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          },
        }
      );
    }

    const recommendations = await getUserReassessmentRecommendations(user.id);
    return NextResponse.json(
      { recommendations },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      }
    );
  } catch (error) {
    console.error('Reassessment API error:', error);
    return NextResponse.json(
      { error: 'Yeniden değerlendirme verisi alınırken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
