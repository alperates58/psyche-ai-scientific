'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { PageContainer } from '@/components/ui/PageContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { loginAction } from '@/actions/auth';
import { ShieldCheck, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallback = searchParams.get('callbackUrl') || '/overview';
  const callbackUrl =
    rawCallback.startsWith('/') && !rawCallback.startsWith('//') && !rawCallback.startsWith('/\\')
      ? rawCallback
      : '/overview';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await loginAction({ email, password });
      if (res.success) {
        router.push(callbackUrl);
        router.refresh();
      } else {
        setErrorMessage(res.error || 'Giriş yapılamadı.');
      }
    } catch {
      setErrorMessage('Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    setErrorMessage(null);
    signIn('google', { callbackUrl });
  };

  return (
    <PageContainer variant="standard" className="py-12 sm:py-16 flex justify-center">
      <div className="w-full max-w-md">
        {/* Branding Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary font-bold text-2xl mb-3 shadow-inner">
            Ψ
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
            PsycheAI Giriş
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Bilimsel kişilik profili ve araştırma platformu
          </p>
        </div>

        <Card className="p-6 sm:p-8 bg-bg-surface border-border-default shadow-sm">
          {errorMessage && (
            <div
              role="alert"
              className="mb-6 p-4 rounded-xl bg-status-danger/10 border border-status-danger/20 flex items-start space-x-3 text-status-danger text-sm"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Official Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="w-full min-h-[44px] flex items-center justify-center space-x-3 px-4 py-2.5 rounded-xl border border-border-default hover:bg-bg-subtle active:scale-[0.99] transition-all font-medium text-text-primary text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 disabled:opacity-50"
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-text-secondary" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Google ile Devam Et</span>
          </button>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-default" />
            </div>
            <span className="relative px-3 bg-bg-surface text-xs text-text-tertiary uppercase tracking-wider font-semibold">
              veya e-posta ile
            </span>
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                E-posta Adresi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-tertiary">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="adiniz@example.com"
                  className="w-full min-h-[44px] pl-10 pr-3.5 py-2.5 rounded-xl border border-border-default bg-bg-subtle text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Şifre
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-brand-primary hover:underline font-medium min-h-[44px] py-3.5 flex items-center"
                >
                  Şifremi Unuttum
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-tertiary">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full min-h-[44px] pl-10 pr-3.5 py-2.5 rounded-xl border border-border-default bg-bg-subtle text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={loading || googleLoading}
              className="w-full min-h-[44px] mt-2 justify-center"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Giriş Yap'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-text-secondary border-t border-border-default pt-4">
            Hesabınız yok mu?{' '}
            <Link
              href="/register"
              className="text-brand-primary font-semibold hover:underline inline-flex items-center min-h-[44px] py-2"
            >
              Kayıt Ol
            </Link>
          </div>
        </Card>

        {/* Security / Epistemic Notice */}
        <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-text-tertiary text-center">
          <ShieldCheck className="w-4 h-4 text-brand-primary flex-shrink-0" />
          <span>Şifrelenmiş kimlik doğrulama ve güvenli oturum yönetimi</span>
        </div>
      </div>
    </PageContainer>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <PageContainer variant="standard" className="py-12 sm:py-16 flex justify-center">
          <div className="w-full max-w-md text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-primary" />
          </div>
        </PageContainer>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
