import { NextResponse } from 'next/server';
import { getCurrentUserOrNull } from '@/lib/auth';
import { getUnifiedPsychologicalProfile } from '@/services/unifiedProfileService';
import { getProfileAIInsights } from '@/services/aiInsightService';

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

    // 2. Fetch authoritative profile for authenticated user
    const profile = await getUnifiedPsychologicalProfile(user.id);

    // 3. Synthesize grounded AI insights
    const insights = await getProfileAIInsights(profile);

    return NextResponse.json(insights);
  } catch (error) {
    console.error('Error generating profile AI insights:', error);
    return NextResponse.json(
      { error: 'Profil içgörüleri oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
}
