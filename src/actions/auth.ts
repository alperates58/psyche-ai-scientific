'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { signIn, signOut } from '@/auth';
import { hashPassword, validatePasswordPolicy } from '@/lib/password';
import { generateRawToken, hashToken, TOKEN_EXPIRY_MS, isTokenExpired } from '@/lib/tokens';
import { sendVerificationEmail, sendPasswordResetEmail, isSmtpConfigured } from '@/lib/emailService';
import { checkRateLimit } from '@/lib/rateLimiter';
import { logAuthAuditEvent } from '@/lib/auditLog';
import { revokeAllSessions } from '@/lib/auth';

const RegisterSchema = z.object({
  name: z.string().trim().min(2, 'Ad Soyad en az 2 karakter olmalıdır.').max(100),
  email: z.string().trim().email('Geçerli bir e-posta adresi giriniz.').max(255),
  password: z.string().min(12, 'Şifre en az 12 karakter olmalıdır.').max(128),
  passwordConfirmation: z.string(),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: 'Şifreler birbiriyle eşleşmiyor.',
  path: ['passwordConfirmation'],
});

const LoginSchema = z.object({
  email: z.string().trim().email('Geçerli bir e-posta adresi giriniz.'),
  password: z.string().min(1, 'Şifre gereklidir.'),
});

const ForgotPasswordSchema = z.object({
  email: z.string().trim().email('Geçerli bir e-posta adresi giriniz.'),
});

const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'Sıfırlama anahtarı gereklidir.'),
  password: z.string().min(12, 'Şifre en az 12 karakter olmalıdır.').max(128),
  passwordConfirmation: z.string(),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: 'Şifreler birbiriyle eşleşmiyor.',
  path: ['passwordConfirmation'],
});

/**
 * Handles credentials user registration.
 * Creates user in PENDING_VERIFICATION status and dispatches verification link.
 */
export async function registerAction(formData: unknown) {
  try {
    const validated = RegisterSchema.parse(formData);
    const emailNormalized = validated.email.trim().toLowerCase();

    // 1. Concurrency-safe rate limit check (3 registrations / hour per IP/email)
    const rate = await checkRateLimit('register', emailNormalized, null, 5, 3600);
    if (!rate.allowed) {
      return { success: false, error: 'Çok fazla kayıt denemesi yapıldı. Lütfen daha sonra tekrar deneyin.' };
    }

    // 2. Production SMTP availability check
    if (process.env.NODE_ENV === 'production' && !isSmtpConfigured()) {
      return {
        success: false,
        error: 'E-posta doğrulama servisi şu anda aktif değil. Lütfen Google ile giriş yapın veya sistem yöneticisi ile iletişime geçin.',
      };
    }

    // 3. Password policy validation
    const policy = validatePasswordPolicy(validated.password);
    if (!policy.valid) {
      return { success: false, error: policy.error };
    }

    // 4. Check for duplicate normalized email
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { emailNormalized },
          { email: emailNormalized },
        ],
      },
    });

    if (existing) {
      await logAuthAuditEvent({
        eventType: 'REGISTER_ATTEMPT',
        success: false,
        metadata: { reason: 'DUPLICATE_EMAIL', email: emailNormalized },
      });
      // Anti-enumeration or clear guidance
      return { success: false, error: 'Bu e-posta adresi ile zaten bir hesap bulunmaktadır.' };
    }

    // 5. Hash password with scrypt
    const passwordHash = await hashPassword(validated.password);

    // 6. Generate single-use verification token
    const rawToken = generateRawToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MS.EMAIL_VERIFICATION);

    // 7. Atomic transaction: create user, credentials, default role, and verification token
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: validated.name,
          email: emailNormalized,
          emailNormalized,
          status: 'PENDING_VERIFICATION',
        },
      });

      await tx.userCredential.create({
        data: {
          userId: user.id,
          passwordHash,
        },
      });

      await tx.userRole.create({
        data: {
          userId: user.id,
          role: 'USER',
        },
      });

      await tx.emailVerificationToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt,
        },
      });

      return user;
    });

    // 8. Dispatch verification email
    await sendVerificationEmail(emailNormalized, rawToken);

    await logAuthAuditEvent({
      eventType: 'REGISTER_SUCCESS',
      userId: newUser.id,
      success: true,
      metadata: { status: 'PENDING_VERIFICATION' },
    });

    return {
      success: true,
      email: emailNormalized,
      message: 'Kayıt başarılı! Lütfen e-posta adresinize gelen doğrulama bağlantısına tıklayın.',
    };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || 'Girdi doğrulanamadı.' };
    }
    return { success: false, error: error.message || 'Kayıt sırasında bir hata oluştu.' };
  }
}

/**
 * Credentials login action. Delegates directly to Auth.js signIn("credentials").
 */
export async function loginAction(formData: unknown) {
  try {
    const validated = LoginSchema.parse(formData);
    const emailNormalized = validated.email.trim().toLowerCase();

    // Call Auth.js signIn without automatic redirect
    const result = await signIn('credentials', {
      redirect: false,
      email: emailNormalized,
      password: validated.password,
    });

    if ((result as any)?.error) {
      return { success: false, error: 'E-posta veya şifre hatalı.' };
    }

    return { success: true };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || 'Girdi doğrulanamadı.' };
    }
    // Auth.js may throw a generic CallbackRouteError for credentials rejection
    return { success: false, error: 'E-posta veya şifre hatalı.' };
  }
}

/**
 * Logout action. Revokes session registry entry and invokes Auth.js signOut.
 */
export async function logoutAction() {
  try {
    await signOut({ redirect: false });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Çıkış yapılamadı.' };
  }
}

/**
 * Initiates password reset with anti-enumeration response.
 */
export async function requestPasswordResetAction(formData: unknown) {
  const genericMessage = 'Eğer bu e-posta adresi ile kayıtlı bir hesap varsa, şifre sıfırlama bağlantısı gönderilmiştir.';

  try {
    const validated = ForgotPasswordSchema.parse(formData);
    const emailNormalized = validated.email.trim().toLowerCase();

    const rate = await checkRateLimit('forgot_password', emailNormalized, null, 3, 3600);
    if (!rate.allowed) {
      return { success: false, error: 'Çok fazla istek gönderildi. Lütfen bir süre sonra tekrar deneyin.' };
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { emailNormalized },
          { email: emailNormalized },
        ],
      },
    });

    if (user && user.status !== 'SUSPENDED' && user.status !== 'DISABLED') {
      // Invalidate existing unused reset tokens for this user
      await prisma.passwordResetToken.updateMany({
        where: {
          userId: user.id,
          usedAt: null,
        },
        data: {
          usedAt: new Date(),
        },
      });

      const rawToken = generateRawToken();
      const tokenHash = hashToken(rawToken);
      const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MS.PASSWORD_RESET);

      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt,
        },
      });

      await sendPasswordResetEmail(emailNormalized, rawToken);

      await logAuthAuditEvent({
        eventType: 'PASSWORD_RESET_REQUEST',
        userId: user.id,
        success: true,
      });
    }

    return { success: true, message: genericMessage };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || 'Geçersiz e-posta adresi.' };
    }
    return { success: true, message: genericMessage };
  }
}

/**
 * Executes password reset. Atomically consumes token, updates password hash, and revokes all active sessions.
 */
export async function resetPasswordAction(formData: unknown) {
  try {
    const validated = ResetPasswordSchema.parse(formData);
    const tokenHash = hashToken(validated.token);

    const tokenRecord = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!tokenRecord || tokenRecord.usedAt !== null || isTokenExpired(tokenRecord.expiresAt)) {
      return { success: false, error: 'Şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş.' };
    }

    const policy = validatePasswordPolicy(validated.password);
    if (!policy.valid) {
      return { success: false, error: policy.error };
    }

    const newPasswordHash = await hashPassword(validated.password);

    // Atomic transaction: mark token used, update password, revoke all sessions
    await prisma.$transaction(async (tx) => {
      await tx.passwordResetToken.update({
        where: { id: tokenRecord.id },
        data: { usedAt: new Date() },
      });

      await tx.userCredential.update({
        where: { userId: tokenRecord.userId },
        data: {
          passwordHash: newPasswordHash,
          passwordUpdatedAt: new Date(),
        },
      });
    });

    // Revoke all existing sessions across all devices
    await revokeAllSessions(tokenRecord.userId);

    await logAuthAuditEvent({
      eventType: 'PASSWORD_RESET_SUCCESS',
      userId: tokenRecord.userId,
      success: true,
    });

    return {
      success: true,
      message: 'Şifreniz başarıyla güncellendi. Yeni şifrenizle giriş yapabilirsiniz.',
    };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || 'Girdi doğrulanamadı.' };
    }
    return { success: false, error: error.message || 'Şifre sıfırlanamadı.' };
  }
}

/**
 * Confirms email verification token atomically and updates user status to ACTIVE.
 */
export async function verifyEmailAction(rawToken: string) {
  if (!rawToken || typeof rawToken !== 'string') {
    return { success: false, error: 'Doğrulama anahtarı gereklidir.' };
  }

  try {
    const tokenHash = hashToken(rawToken);

    const tokenRecord = await prisma.emailVerificationToken.findUnique({
      where: { tokenHash },
    });

    if (!tokenRecord || tokenRecord.usedAt !== null || isTokenExpired(tokenRecord.expiresAt)) {
      return { success: false, error: 'Doğrulama bağlantısı geçersiz veya süresi dolmuş.' };
    }

    // Atomic confirmation
    await prisma.$transaction(async (tx) => {
      await tx.emailVerificationToken.update({
        where: { id: tokenRecord.id },
        data: { usedAt: new Date() },
      });

      await tx.user.update({
        where: { id: tokenRecord.userId },
        data: {
          emailVerified: new Date(),
          status: 'ACTIVE',
        },
      });
    });

    await logAuthAuditEvent({
      eventType: 'EMAIL_VERIFICATION_SUCCESS',
      userId: tokenRecord.userId,
      success: true,
    });

    return {
      success: true,
      message: 'E-posta adresiniz başarıyla doğrulandı! Şimdi giriş yapabilirsiniz.',
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'Doğrulama işlemi gerçekleştirilemedi.' };
  }
}

/**
 * Resends email verification with rate limiting and anti-enumeration protection.
 */
export async function resendVerificationAction(rawEmail: string) {
  const genericMessage = 'Eğer bu e-posta adresi onay bekliyorsa, yeni bir doğrulama bağlantısı gönderilmiştir.';

  if (!rawEmail || typeof rawEmail !== 'string') {
    return { success: false, error: 'E-posta adresi gereklidir.' };
  }

  const emailNormalized = rawEmail.trim().toLowerCase();

  try {
    const rate = await checkRateLimit('resend_verification', emailNormalized, null, 3, 3600);
    if (!rate.allowed) {
      return { success: false, error: 'Çok fazla istek gönderildi. Lütfen bir süre sonra tekrar deneyin.' };
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { emailNormalized },
          { email: emailNormalized },
        ],
      },
    });

    if (user && user.status === 'PENDING_VERIFICATION') {
      // Invalidate prior unused tokens
      await prisma.emailVerificationToken.updateMany({
        where: {
          userId: user.id,
          usedAt: null,
        },
        data: {
          usedAt: new Date(),
        },
      });

      const rawToken = generateRawToken();
      const tokenHash = hashToken(rawToken);
      const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MS.EMAIL_VERIFICATION);

      await prisma.emailVerificationToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt,
        },
      });

      await sendVerificationEmail(emailNormalized, rawToken);
    }

    return { success: true, message: genericMessage };
  } catch {
    return { success: true, message: genericMessage };
  }
}
