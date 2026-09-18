import { NextResponse } from 'next/server';
import { getCurrentUserOrNull } from '@/lib/auth';
import { getUserLongitudinalProfile } from '@/services/longitudinalService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/profile/timeline
 * Profile timeline data including measurement epochs, coverage growth, and stability summaries.
 */
export async function GET() {
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
        { error: 'FORBIDDEN: E-posta doğrulaması tamamlanmamış hesaplar profil verilerine erişemez.' },
        { status: 403 }
      );
    }

    const profile = await getUserLongitudinalProfile(user.id);

    return NextResponse.json(
      {
        epochs: profile.measurementEpochs,
        readiness: profile.longitudinalReadiness,
        coverageTimeline: profile.domainCoverageTimeline,
        qualityTimeline: profile.responseQualityTimeline,
        stabilitySummary: profile.stabilitySummary,
        changeSummary: profile.changeSummary,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      }
    );
  } catch (error) {
    console.error('Profile timeline API error:', error);
    return NextResponse.json(
      { error: 'Zaman çizelgesi verisi alınırken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
