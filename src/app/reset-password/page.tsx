'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PageContainer } from '@/components/ui/PageContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { resetPasswordAction } from '@/actions/auth';
import { Lock, CheckCircle2, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    !token ? 'Geçersiz veya eksik şifre sıfırlama bağlantısı.' : null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!token) {
      setErrorMessage('Geçerli bir sıfırlama anahtarı bulunamadı.');
      return;
    }

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
      const res = await resetPasswordAction({
        token,
        password,
        passwordConfirmation,
      });

      if (res.success) {
        setSuccessMessage(res.message || 'Şifreniz başarıyla güncellendi.');
        setPassword('');
        setPasswordConfirmation('');
      } else {
        setErrorMessage(res.error || 'Şifre güncellenemedi.');
      }
    } catch {
      setErrorMessage('Beklenmeyen bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer variant="standard" className="py-12 sm:py-16 flex justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary font-bold text-2xl mb-3 shadow-inner">
            Ψ
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
            Yeni Şifre Belirleyin
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Hesabınız için yeni ve güvenli bir şifre oluşturun
          </p>
        </div>

        <Card className="p-6 sm:p-8 bg-bg-surface border-border-default shadow-sm">
          {errorMessage && (
            <div
              role="alert"
              className="mb-6 p-4 rounded-xl bg-status-danger/10 border border-status-danger/20 flex items-start space-x-3 text-status-danger text-sm"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <span>{errorMessage}</span>
                {!token && (
                  <div className="mt-3">
                    <Link
                      href="/forgot-password"
                      className="inline-flex items-center text-xs font-semibold text-brand-primary underline min-h-[44px] py-1"
                    >
                      Yeni bir sıfırlama bağlantısı isteyin →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {successMessage ? (
            <div
              role="alert"
              className="p-4 rounded-xl bg-status-success/10 border border-status-success/20 flex items-start space-x-3 text-status-success text-sm"
            >
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Şifre Güncellendi</p>
                <p>{successMessage}</p>
                <Link
                  href="/login"
                  className="mt-4 inline-flex items-center text-xs font-semibold text-brand-primary underline min-h-[44px] py-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                  Giriş sayfasına git
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="new-password" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                  Yeni Şifre
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-tertiary">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="new-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="En az 12 karakter"
                    className="w-full min-h-[44px] pl-10 pr-3.5 py-2.5 rounded-xl border border-border-default bg-bg-subtle text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="new-password-confirm" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                  Yeni Şifre Tekrarı
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-tertiary">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="new-password-confirm"
                    type="password"
                    required
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    placeholder="Şifrenizi tekrar girin"
                    className="w-full min-h-[44px] pl-10 pr-3.5 py-2.5 rounded-xl border border-border-default bg-bg-subtle text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={loading || !token}
                className="w-full min-h-[44px] mt-2 justify-center"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Şifreyi Güncelle'}
              </Button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="text-xs text-text-secondary hover:text-text-primary inline-flex items-center min-h-[44px] py-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                  Giriş ekranına dön
                </Link>
              </div>
            </form>
          )}
        </Card>
      </div>
    </PageContainer>
  );
}

export default function ResetPasswordPage() {
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
      <ResetPasswordForm />
    </Suspense>
  );
}
