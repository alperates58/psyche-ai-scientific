import { NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
import {
  validateResearchAccess,
  isProduction,
  isResearchConfigured
} from '@/lib/researchAuth';

const { auth } = NextAuth(authConfig);

export default auth(async function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Research routes: strict preservation of existing access key contract
  if (
    pathname === '/research' ||
    pathname.startsWith('/research/') ||
    pathname.startsWith('/api/research/')
  ) {
    const isAuthRoute =
      pathname === '/research/login' ||
      pathname.startsWith('/api/research/auth/');

    const access = await validateResearchAccess(request.headers, request.cookies);

    if (pathname === '/research/login' && access.authorized) {
      return NextResponse.redirect(new URL('/research/item-bank', request.url));
    }

    if (isAuthRoute) {
      if (isProduction() && !isResearchConfigured() && pathname === '/research/login') {
        return new NextResponse('Not Found', { status: 404 });
      }
      return NextResponse.next();
    }

    if (!access.authorized) {
      if (pathname.startsWith('/api/research/')) {
        const status = isProduction() && !isResearchConfigured() ? 404 : 401;
        return NextResponse.json(
          { error: 'Unauthorized: Valid research access key required' },
          { status }
        );
      }

      if (isProduction() && !isResearchConfigured()) {
        return new NextResponse('Not Found', { status: 404 });
      }

      return NextResponse.redirect(new URL('/research/login', request.url));
    }

    return NextResponse.next();
  }

  const isLoggedIn = !!(request as any).auth?.user;

  // 2. Protected App routes
  const isProtectedAppRoute =
    pathname === '/overview' ||
    pathname.startsWith('/overview/') ||
    pathname === '/assessment' ||
    pathname.startsWith('/assessment/') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/insights');

  if (isProtectedAppRoute && !isLoggedIn) {
    // Open redirect prevention: sanitize callbackUrl (must start with single slash)
    const rawCallback = pathname;
    const cleanCallback = rawCallback.startsWith('/') && !rawCallback.startsWith('//') ? rawCallback : '/overview';
    return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(cleanCallback)}`, request.url));
  }

  // 3. Guest Auth routes: redirect already authenticated users to /overview
  const isGuestAuthRoute =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password';

  if (isGuestAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/overview', request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/health|api/auth).*)',
  ],
};
