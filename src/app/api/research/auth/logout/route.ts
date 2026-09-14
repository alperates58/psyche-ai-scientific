import { NextResponse } from 'next/server';
import { RESEARCH_COOKIE_NAME, RESEARCH_UI_COOKIE_NAME, isProduction } from '@/lib/researchAuth';

export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json({ success: true }, { status: 200 });
  const secure = isProduction();

  response.cookies.set({
    name: RESEARCH_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure,
    sameSite: 'strict',
    path: '/',
    maxAge: 0
  });

  response.cookies.set({
    name: RESEARCH_UI_COOKIE_NAME,
    value: '',
    httpOnly: false,
    secure,
    sameSite: 'strict',
    path: '/',
    maxAge: 0
  });

  return response;
}
