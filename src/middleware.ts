import { NextRequest, NextResponse } from 'next/server';
import {
  validateResearchAccess,
  isProduction,
  isResearchConfigured
} from '@/lib/researchAuth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow public authentication endpoints and login gate
  const isAuthRoute =
    pathname === '/research/login' ||
    pathname.startsWith('/api/research/auth/');

  const access = await validateResearchAccess(request.headers, request.cookies);

  // If already authenticated and trying to visit login page, redirect to item-bank
  if (pathname === '/research/login' && access.authorized) {
    return NextResponse.redirect(new URL('/research/item-bank', request.url));
  }

  if (isAuthRoute) {
    // In production, if research is not configured at all, even the login gate returns 404
    if (isProduction() && !isResearchConfigured() && pathname === '/research/login') {
      return new NextResponse('Not Found', { status: 404 });
    }
    return NextResponse.next();
  }

  // 2. Protect research pages and research APIs
  if (!access.authorized) {
    // API route rejection
    if (pathname.startsWith('/api/research/')) {
      const status = isProduction() && !isResearchConfigured() ? 404 : 401;
      return NextResponse.json(
        { error: 'Unauthorized: Valid research access key required' },
        { status }
      );
    }

    // Page route rejection (/research/*)
    // In production when not configured: safe-by-default 404
    if (isProduction() && !isResearchConfigured()) {
      return new NextResponse('Not Found', { status: 404 });
    }

    // When configured but unauthorized: redirect to clean POST-based login page
    return NextResponse.redirect(new URL('/research/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/research', '/research/:path*', '/api/research/:path*']
};
