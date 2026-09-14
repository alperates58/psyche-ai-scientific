'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';

import { PageContainer } from '@/components/ui/PageContainer';
import { Button } from '@/components/ui/Button';

export default function ResearchLoginPage() {
  const router = useRouter();
  const [accessKey, setAccessKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessKey.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/research/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ accessKey: accessKey.trim() })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        router.push('/research/item-bank');
        router.refresh();
      } else {
        setErrorMessage(data.error || 'Erişim anahtarı doğrulanamadı.');
      }
    } catch {
      setErrorMessage('Bağlantı hatası oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer variant="standard">
      <div className="min-h-[70vh] flex flex-col justify-center items-center py-6 sm:py-12">
        <div className="w-full max-w-md bg-surface-1 p-6 sm:p-8 rounded-card border border-border-subtle shadow-md space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-brand-50 text-brand-600 border border-brand-200/60 mb-2">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">
              PsycheAI Bilimsel Araştırma Portalı
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary">
              Madde havuzu, psikometrik kanıt haritası ve uzman inceleme dışa aktarımı yetkili erişim gerektirir.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center space-x-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="accessKey"
                className="block text-xs font-semibold text-text-secondary mb-1.5"
              >
                Araştırmacı Erişim Anahtarı
              </label>
              <input
                id="accessKey"
                type="password"
                autoComplete="current-password"
                required
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                placeholder="RESEARCH_ACCESS_KEY giriniz"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-strong bg-surface-2 text-text-primary text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-text-tertiary min-h-[44px]"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !accessKey.trim()}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <span>Doğrulanıyor...</span>
              ) : (
                <>
                  <span>Güvenli Oturum Aç</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </>
              )}
            </Button>
          </form>

          <div className="pt-4 border-t border-border-subtle flex items-center justify-between text-xs text-text-tertiary">
            <Link
              href="/overview"
              className="min-h-[44px] inline-flex items-center hover:text-text-primary transition-colors py-2"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>Genel Bakışa Dön</span>
            </Link>
            <span className="inline-flex items-center text-teal-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Safe-by-Default
            </span>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
