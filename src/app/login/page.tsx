'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { PageContainer } from '@/components/ui/PageContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { loginAction } from '@/actions/auth';
import {
  ShieldCheck,
  Mail,
  Lock,
  AlertCircle,
  Loader2,
  Sparkles,
  Compass,
  Layers,
  BookOpen,
  Clock,
  ArrowRight,
} from 'lucide-react';

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
        window.location.href = callbackUrl;
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
    <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Product Story & Visual Benefits (Desktop 50/50 split) */}
        <div className="hidden lg:flex lg:col-span-6 flex-col space-y-6 pr-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BİLİMSEL KİŞİLİK PROFİLİ</span>
            </div>
            <h1 className="text-3xl font-extrabold text-text-primary tracking-tight leading-tight">
              Kişisel Psikolojik Haritanıza Giriş Yapın
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed">
              Tamamladığınız değerlendirmeler üzerinden çok boyutlu psikolojik profilinizi inceleyin, kuramsal merceklerle derinleşin.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-2xl bg-surface-1 border border-border-default shadow-xs flex items-start space-x-3.5">
              <div className="w-9 h-9 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0 mt-0.5">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-text-primary">91 Alt Boyutta Ayrıntılı Profil</h4>
                <p className="text-[11px] text-text-secondary mt-0.5">
                  11 psikoloji alanı ve 37 yapı üzerinden derinlemesine öz-farkındalık.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-1 border border-border-default shadow-xs flex items-start space-x-3.5">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-text-primary">Zaman İçindeki Değişimlerini Keşfet</h4>
                <p className="text-[11px] text-text-secondary mt-0.5">
                  Tekrarlayan değerlendirmelerle zaman içindeki eğilim farklılaşmalarını izleyin.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-1 border border-border-default shadow-xs flex items-start space-x-3.5">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-text-primary">10 Psikoloji Kuramıyla İncele</h4>
                <p className="text-[11px] text-text-secondary mt-0.5">
                  Freud, Jung, Adler, Rogers, Maslow ve Beck mercekleriyle profilinizi çoklu açıdan keşfedin.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Clean Authentication Form */}
        <div className="w-full lg:col-span-6 max-w-md mx-auto">
          <Card className="p-6 sm:p-8 bg-surface-1 border-border-default shadow-sm rounded-3xl">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary font-bold text-2xl mb-3 shadow-inner">
                Ψ
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
                PsycheAI Giriş
              </h2>
              <p className="mt-1 text-xs text-text-secondary">
                Oturum açarak profilinize ve değerlendirmelerinize erişin
              </p>
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="mb-5 p-3.5 rounded-xl bg-status-danger/10 border border-status-danger/20 flex items-start space-x-2.5 text-status-danger text-xs"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Google Sign-In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || loading}
              className="w-full min-h-[44px] flex items-center justify-center space-x-3 px-4 py-2.5 rounded-xl border border-border-default hover:bg-bg-subtle active:scale-[0.99] transition-all font-medium text-text-primary text-xs shadow-xs focus:outline-none focus:ring-2 focus:ring-brand-primary/20 disabled:opacity-50"
            >
              {googleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-text-secondary" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
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

            <div className="relative my-5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-default" />
              </div>
              <span className="relative px-3 bg-surface-1 text-[11px] text-text-tertiary uppercase tracking-wider font-semibold">
                veya e-posta ile
              </span>
            </div>

            {/* Credentials Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
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
                    className="w-full min-h-[44px] pl-10 pr-3.5 py-2 rounded-xl border border-border-default bg-bg-subtle text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="login-password" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Şifre
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-brand-primary hover:underline font-medium min-h-[36px] flex items-center"
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
                    className="w-full min-h-[44px] pl-10 pr-3.5 py-2 rounded-xl border border-border-default bg-bg-subtle text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={loading || googleLoading}
                className="w-full min-h-[44px] mt-2 justify-center"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Giriş Yap'}
              </Button>
            </form>

            <div className="mt-5 text-center text-xs text-text-secondary border-t border-border-default pt-4">
              Hesabınız yok mu?{' '}
              <Link
                href="/register"
                className="text-brand-primary font-semibold hover:underline inline-flex items-center min-h-[36px]"
              >
                Kayıt Ol
              </Link>
            </div>
          </Card>

          {/* Security Notice */}
          <div className="mt-4 flex items-center justify-center space-x-2 text-[11px] text-text-tertiary text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
            <span>Şifrelenmiş kimlik doğrulama ve güvenli oturum yönetimi</span>
          </div>
        </div>
      </div>
    </div>
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
