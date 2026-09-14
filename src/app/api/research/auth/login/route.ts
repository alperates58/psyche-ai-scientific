import { NextRequest, NextResponse } from 'next/server';
import {
  getResearchAccessKey,
  timingSafeEqual,
  deriveSessionToken,
  RESEARCH_COOKIE_NAME,
  RESEARCH_UI_COOKIE_NAME,
  isProduction
} from '@/lib/researchAuth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const configuredKey = getResearchAccessKey();

    if (!configuredKey) {
      return NextResponse.json(
        { success: false, error: 'Araştırma erişimi yapılandırılmamış.' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const submittedKey = typeof body?.accessKey === 'string' ? body.accessKey.trim() : '';

    if (!submittedKey || !timingSafeEqual(submittedKey, configuredKey)) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz erişim anahtarı.' },
        { status: 401 }
      );
    }

    const sessionToken = await deriveSessionToken(configuredKey);

    const response = NextResponse.json({ success: true }, { status: 200 });

    const maxAge = 60 * 60 * 24 * 7; // 7 days
    const secure = isProduction();

    // 1. Secure, HttpOnly cookie carrying the derived session token (NOT the secret itself)
    response.cookies.set({
      name: RESEARCH_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure,
      sameSite: 'strict',
      path: '/',
      maxAge
    });

    // 2. Non-sensitive display cookie indicating active session for client UI (Sidebar)
    response.cookies.set({
      name: RESEARCH_UI_COOKIE_NAME,
      value: '1',
      httpOnly: false,
      secure,
      sameSite: 'strict',
      path: '/',
      maxAge
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: 'Giriş işlemi sırasında hata oluştu.' },
      { status: 500 }
    );
  }
}
