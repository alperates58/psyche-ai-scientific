import { NextRequest, NextResponse } from 'next/server';
import { validateResearchAccess } from '@/lib/researchAuth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const result = await validateResearchAccess(request.headers, request.cookies);
  return NextResponse.json(
    { authenticated: result.authorized },
    { status: 200 }
  );
}
