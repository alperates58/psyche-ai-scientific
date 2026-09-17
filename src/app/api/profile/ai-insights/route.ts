import { NextResponse } from 'next/server';
import { getCurrentUserOrNull } from '@/lib/auth';
import { resolveUnifiedPsychologicalProfileV2 } from '@/lib/profile/masterProfileResolver';
import { getUnifiedProfileAISectionData } from '@/services/aiInsightService';

export const dynamic = 'force-dynamic';

export async function GET() {
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

    // 3. Synthesize grounded AI insights
    const insights = await getUnifiedProfileAISectionData(profile);

    return NextResponse.json(insights);
  } catch (error) {
    console.error('Error generating profile AI insights:', error);
    return NextResponse.json(
      { error: 'Profil içgörüleri oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
}
