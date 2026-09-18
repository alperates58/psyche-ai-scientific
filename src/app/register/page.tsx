'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { registerAction } from '@/actions/auth';
import {
  ShieldCheck,
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
  Layers,
  Clock,
  BookOpen,
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (password !== passwordConfirmation) {
      setErrorMessage('Şifreler birbiriyle eşleşmiyor.');
      return;
    }

    if (password.length < 12) {
      setErrorMessage('Şifreniz en az 12 karakter olmalıdır.');
      return;
    }

    setLoading(true);

    try {
      const res = await registerAction({
        name,
        email,
        password,
        passwordConfirmation,
      });

      if (res.success) {
        setSuccessMessage(res.message || 'Kayıt başarılı! Lütfen e-postanızı kontrol edin.');
        setName('');
        setEmail('');
        setPassword('');
        setPasswordConfirmation('');
      } else {
        setErrorMessage(res.error || 'Kayıt işlemi başarısız oldu.');
      }
    } catch {
      setErrorMessage('Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    setGoogleLoading(true);
    setErrorMessage(null);
    signIn('google', { callbackUrl: '/overview' });
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
              Kişisel Psikolojik Haritanızı Oluşturun
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed">
              Tek bir test veya basit bir etiketle değil, 11 temel alanda derinleşen çok boyutlu bir psikolojik profil inşa edin.
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
                Hesap Oluştur
              </h2>
              <p className="mt-1 text-xs text-text-secondary">
                PsycheAI bilimsel değerlendirme ekosistemine katılın
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

            {successMessage && (
              <div
                role="alert"
                className="mb-5 p-3.5 rounded-xl bg-status-success/10 border border-status-success/20 flex items-start space-x-2.5 text-status-success text-xs"
              >
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">Kayıt Başarılı</p>
                  <p>{successMessage}</p>
                  <Link
                    href="/login"
                    className="mt-2 inline-flex items-center text-xs font-semibold text-brand-primary underline"
                  >
                    Giriş sayfasına git →
                  </Link>
                </div>
              </div>
            )}

            {/* Google Sign-Up */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
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
              <span>Google ile Kayıt Ol</span>
            </button>

            <div className="relative my-5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-default" />
              </div>
              <span className="relative px-3 bg-surface-1 text-[11px] text-text-tertiary uppercase tracking-wider font-semibold">
                veya form ile
              </span>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label htmlFor="reg-name" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                  Ad Soyad
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-tertiary">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Adınız Soyadınız"
                    className="w-full min-h-[44px] pl-10 pr-3.5 py-2 rounded-xl border border-border-default bg-bg-subtle text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-email" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-tertiary">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-email"
                    name="email"
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
                <label htmlFor="reg-password" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                  Şifre
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-tertiary">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="En az 12 karakter"
                    className="w-full min-h-[44px] pl-10 pr-3.5 py-2 rounded-xl border border-border-default bg-bg-subtle text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors"
                  />
                </div>
                <p className="mt-1 text-[10px] text-text-tertiary">
                  En az 12 karakter olmalıdır.
                </p>
              </div>

              <div>
                <label htmlFor="reg-password-confirm" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                  Şifre Tekrarı
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-tertiary">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-password-confirm"
                    name="confirmPassword"
                    type="password"
                    required
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    placeholder="Şifrenizi tekrar girin"
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
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Kayıt Ol'}
              </Button>
            </form>

            <div className="mt-5 text-center text-xs text-text-secondary border-t border-border-default pt-4">
              Zaten hesabınız var mı?{' '}
              <Link
                href="/login"
                className="text-brand-primary font-semibold hover:underline inline-flex items-center min-h-[36px]"
              >
                Giriş Yap
              </Link>
            </div>
          </Card>

          <div className="mt-4 flex items-center justify-center space-x-2 text-[11px] text-text-tertiary text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
            <span>Gizlilik ve bilimsel veri bütünlüğü standartları</span>
          </div>
        </div>
      </div>
    </div>
  );
}
