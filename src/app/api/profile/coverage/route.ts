import { NextResponse } from 'next/server';
import { getCurrentUserOrNull } from '@/lib/auth';
import { getUserProfileCoverage } from '@/services/profileService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/profile/coverage
 * Authoritative psychometric coverage for the currently authenticated user.
 * 
 * Invariants:
 * 1. Requires valid authenticated session with active server-side registry.
 * 2. Unauthenticated returns 401.
 * 3. PENDING_VERIFICATION returns 403 (does not expose profile data).
 * 4. Strictly ignores any query/body userId to prevent cross-user access or IDOR.
 * 5. Returns only safe, aggregated coverage metrics without secrets.
 * 6. Dynamic response with caching disabled.
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

    const coverage = await getUserProfileCoverage(user.id);
    return NextResponse.json(
      {
        exploredFacetsCount: coverage.exploredFacetsCount,
        totalOntologyFacets: coverage.totalOntologyFacets,
        explorationPercentage: coverage.explorationPercentage,
        measurementDepthPercentage: coverage.measurementDepthPercentage,
        isAssessed: coverage.isAssessed,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error) {
    console.error('Profile coverage retrieval error:', error);
    return NextResponse.json(
      { error: 'Profil kapsam verisi alınırken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

