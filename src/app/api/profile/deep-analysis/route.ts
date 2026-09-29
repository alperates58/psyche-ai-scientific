import { NextResponse } from 'next/server';
import { getCurrentUserOrNull } from '@/lib/auth';
import { resolveUnifiedPsychologicalProfileV2 } from '@/lib/profile/masterProfileResolver';
import { getDeepProfileInsight } from '@/services/aiInsightService';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // 1. Authenticate user from server session strictly
    const user = await getCurrentUserOrNull();
    if (!user) {
      return NextResponse.json(
        { error: 'Yetkilendirme gerekli (Oturum bulunamadı)' },
        { status: 401 }
      );
    }

    if (user.status === 'PENDING_VERIFICATION') {
      return NextResponse.json(
        { error: 'E-posta doğrulaması tamamlanmalıdır' },
        { status: 403 }
      );
    }

    // 2. Fetch authoritative Master Model profile for authenticated user
    const profile = await resolveUnifiedPsychologicalProfileV2(user.id);

    // 3. Synthesize evidence-grounded deep profile analysis
    const deepInsight = await getDeepProfileInsight(profile);

    return NextResponse.json(deepInsight);
  } catch (error) {
    console.error('Error generating deep profile insight:', error);
    return NextResponse.json(
      { error: 'Derin profil analizi oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
