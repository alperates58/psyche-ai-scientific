import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Credentials from 'next-auth/providers/credentials';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { authConfig } from './auth.config';
import { verifyPassword, dummyVerifyPassword } from '@/lib/password';
import { logAuthAuditEvent } from '@/lib/auditLog';
import { checkRateLimit, extractClientIp } from '@/lib/rateLimiter';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    ...authConfig.providers,
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const rawEmail = credentials?.email;
        const password = credentials?.password;

        if (!rawEmail || typeof rawEmail !== 'string' || !password || typeof password !== 'string') {
          return null;
        }

        const emailNormalized = rawEmail.trim().toLowerCase();
        const clientIp = extractClientIp(req?.headers as any);

        // 1. Rate limiting check (independent account & IP dimensions)
        const rate = await checkRateLimit('login', emailNormalized, clientIp);
        if (!rate.allowed) {
          await logAuthAuditEvent({
            eventType: 'LOGIN_FAILURE',
            success: false,
            ip: clientIp,
            metadata: { reason: 'RATE_LIMIT_EXCEEDED', email: emailNormalized },
          });
          return null;
        }

        // 2. Lookup user and credentials
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { emailNormalized },
              { email: emailNormalized },
            ],
          },
          include: {
            credential: true,
          },
        });

        if (!user || !user.credential) {
          // Timing-attack mitigation
          await dummyVerifyPassword();
          await logAuthAuditEvent({
            eventType: 'LOGIN_FAILURE',
            success: false,
            metadata: { reason: 'INVALID_CREDENTIALS', email: emailNormalized },
          });
          return null;
        }

        // 3. Check account suspension / disablement
        if (user.status === 'SUSPENDED' || user.status === 'DISABLED') {
          await logAuthAuditEvent({
            eventType: 'LOGIN_FAILURE',
            userId: user.id,
            success: false,
            metadata: { reason: 'ACCOUNT_SUSPENDED_OR_DISABLED', status: user.status },
          });
          return null;
        }

        // 4. Verify password hash using scrypt
        const isPasswordValid = await verifyPassword(password, user.credential.passwordHash);
        if (!isPasswordValid) {
          await logAuthAuditEvent({
            eventType: 'LOGIN_FAILURE',
            userId: user.id,
            success: false,
            metadata: { reason: 'INVALID_CREDENTIALS' },
          });
          return null;
        }

        // 5. Success: update lastLoginAt and audit
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        await logAuthAuditEvent({
          eventType: 'LOGIN_SUCCESS',
          userId: user.id,
          success: true,
          metadata: { method: 'credentials' },
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          status: user.status,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, account }) {
      if (user) {
        // Initial sign-in: create server-side session registry entry
        const sid = crypto.randomUUID();
        const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

        try {
          await prisma.session.create({
            data: {
              sessionToken: sid,
              userId: user.id!,
              expires,
            },
          });
        } catch (e) {
          console.error('CRITICAL: Failed to create server-side auth_sessions entry:', e);
          // Fail closed: Never issue a valid session JWT if registry row creation fails
          throw new Error('SESSION_REGISTRY_CREATION_FAILED');
        }

        token.sid = sid;
        token.id = user.id;
        token.status = (user as any).status || 'ACTIVE';
      }

      // If user signed in via Google, ensure USER role and normalized email exist
      if (account?.provider === 'google' && token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { emailNormalized: true, email: true },
          });

          if (dbUser && !dbUser.emailNormalized && dbUser.email) {
            await prisma.user.update({
              where: { id: token.id as string },
              data: {
                emailNormalized: dbUser.email.trim().toLowerCase(),
                status: 'ACTIVE',
              },
            });
          }

          // Idempotently ensure default USER role
          await prisma.userRole.upsert({
            where: {
              userId_role: {
                userId: token.id as string,
                role: 'USER',
              },
            },
            create: {
              userId: token.id as string,
              role: 'USER',
            },
            update: {},
          });
        } catch (err) {
          console.error('Error during Google sign-in role sync:', err);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        (session.user as any).status = token.status as string;
        (session as any).sid = token.sid as string;
      }
      return session;
    },
  },
  events: {
    async signOut(message) {
      // In JWT session strategy, message may contain session or token
      const token = (message as any).token;
      if (token?.sid) {
        try {
          await prisma.session.updateMany({
            where: { sessionToken: token.sid, revokedAt: null },
            data: { revokedAt: new Date() },
          });
          if (token.id) {
            await logAuthAuditEvent({
              eventType: 'LOGOUT',
              userId: token.id,
              success: true,
            });
          }
        } catch (e) {
          console.error('Failed to mark registry session as revoked on signOut:', e);
        }
      }
    },
  },
});
