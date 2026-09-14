'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageContainer } from '@/components/ui/PageContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { requestPasswordResetAction } from '@/actions/auth';
import { Mail, CheckCircle2, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);
    setLoading(true);

    try {
      const res = await requestPasswordResetAction({ email });
      if (res.success) {
        setStatusMessage(res.message || 'Sıfırlama bağlantısı gönderildi.');
      } else {
        setErrorMessage(res.error || 'İşlem gerçekleştirilemedi.');
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
            Şifre Sıfırlama
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Kayıtlı e-posta adresinize sıfırlama bağlantısı gönderelim
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

          {statusMessage ? (
            <div
              role="alert"
              className="p-4 rounded-xl bg-status-success/10 border border-status-success/20 flex items-start space-x-3 text-status-success text-sm"
            >
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Bağlantı Gönderildi</p>
                <p>{statusMessage}</p>
                <Link
                  href="/login"
                  className="mt-4 inline-flex items-center text-xs font-semibold text-brand-primary underline min-h-[44px] py-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                  Giriş ekranına dön
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="reset-email" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-tertiary">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="adiniz@example.com"
                    className="w-full min-h-[44px] pl-10 pr-3.5 py-2.5 rounded-xl border border-border-default bg-bg-subtle text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full min-h-[44px] mt-2 justify-center"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sıfırlama Bağlantısı Gönder'}
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
