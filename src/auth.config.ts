import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

export const authConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET || 'psyche-e2e-auth-test-secret-minimum-32-chars-long-abcdef',
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || '',
      clientSecret: process.env.AUTH_GOOGLE_SECRET || '',
      // STRICT MANDATORY: Never silently link Google accounts to existing credentials
      allowDangerousEmailAccountLinking: false,
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      // Note: Authoritative authorization is performed server-side in data operations.
      // Middleware provides preliminary UX routing.
      const isProtected =
        pathname.startsWith('/overview') ||
        pathname.startsWith('/assessment') ||
        pathname.startsWith('/profile') ||
        pathname.startsWith('/insights');

      if (isProtected) {
        if (isLoggedIn) return true;
        return false; // Redirects to signIn page
      }

      const isAuthPage =
        pathname === '/login' ||
        pathname === '/register' ||
        pathname === '/forgot-password' ||
        pathname === '/reset-password';

      if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL('/overview', nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
