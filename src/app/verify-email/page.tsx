'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PageContainer } from '@/components/ui/PageContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { verifyEmailAction, resendVerificationAction } from '@/actions/auth';
import { MailCheck, CheckCircle2, AlertCircle, ArrowRight, Loader2, RefreshCw } from 'lucide-react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [verifying, setVerifying] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [resendEmail, setResendEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    const executeVerification = async () => {
      setVerifying(true);
      setErrorMessage(null);

      try {
        const res = await verifyEmailAction(token);
        if (!isMounted) return;
        if (res.success) {
          setSuccessMessage(res.message || 'E-posta adresiniz başarıyla doğrulandı.');
        } else {
          setErrorMessage(res.error || 'Doğrulama başarısız oldu.');
        }
      } catch {
        if (isMounted) {
          setErrorMessage('Beklenmeyen bir hata oluştu.');
        }
      } finally {
        if (isMounted) {
          setVerifying(false);
        }
      }
    };

    executeVerification();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) return;

    setResendLoading(true);
    setResendMessage(null);

    try {
      const res = await resendVerificationAction(resendEmail);
      setResendMessage(res.message || 'Doğrulama bağlantısı tekrar gönderildi.');
    } catch {
      setResendMessage('İstek iletildi.');
    } finally {
      setResendLoading(false);
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
            E-posta Doğrulama
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Psikometrik değerlendirme güvenliği için hesap doğrulaması zorunludur
          </p>
        </div>

        <Card className="p-6 sm:p-8 bg-bg-surface border-border-default shadow-sm">
          {verifying && (
            <div className="py-8 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-brand-primary mx-auto" />
              <p className="text-sm font-medium text-text-secondary">Doğrulama kontrol ediliyor...</p>
            </div>
          )}

          {successMessage && (
            <div
              role="alert"
              className="p-4 rounded-xl bg-status-success/10 border border-status-success/20 flex items-start space-x-3 text-status-success text-sm"
            >
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Hesabınız Doğrulandı</p>
                <p>{successMessage}</p>
                <Link
                  href="/login"
                  className="mt-4 inline-flex items-center text-xs font-semibold text-brand-primary underline min-h-[44px] py-2"
                >
                  Giriş yapın ve değerlendirmeye başlayın
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>
          )}

          {errorMessage && (
            <div
              role="alert"
              className="mb-6 p-4 rounded-xl bg-status-danger/10 border border-status-danger/20 flex items-start space-x-3 text-status-danger text-sm"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {!token && !successMessage && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-bg-subtle border border-border-default text-xs text-text-secondary space-y-2">
                <div className="flex items-center space-x-2 font-semibold text-text-primary">
                  <MailCheck className="w-4 h-4 text-brand-primary" />
                  <span>Doğrulama E-postası Bekleniyor</span>
                </div>
                <p>
                  Kayıt olduğunuzda e-posta adresinize bir doğrulama bağlantısı gönderilmiştir.
                  Hesabınız onaylanmadan psikolojik değerlendirmelere erişilemez.
                </p>
              </div>

              {/* Resend Form */}
              <form onSubmit={handleResend} className="space-y-3 pt-2">
                <label htmlFor="resend-email" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Bağlantıyı Tekrar Gönder
                </label>
                <input
                  id="resend-email"
                  type="email"
                  required
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder="Kayıtlı e-posta adresiniz"
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-border-default bg-bg-subtle text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors"
                />

                <Button
                  type="submit"
                  variant="secondary"
                  disabled={resendLoading}
                  className="w-full min-h-[44px] justify-center"
                >
                  {resendLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Yeniden Bağlantı İste
                    </>
                  )}
                </Button>
              </form>

              {resendMessage && (
                <p className="text-xs text-center text-status-success font-medium">
                  {resendMessage}
                </p>
              )}

              <div className="text-center pt-2 border-t border-border-default">
                <Link
                  href="/login"
                  className="text-xs text-brand-primary font-semibold hover:underline min-h-[44px] py-2 inline-flex items-center"
                >
                  Giriş ekranına dön
                </Link>
              </div>
            </div>
          )}
        </Card>
      </div>
    </PageContainer>
  );
}

export default function VerifyEmailPage() {
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
      <VerifyEmailContent />
    </Suspense>
  );
}
