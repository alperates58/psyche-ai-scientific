'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PageContainer } from '@/components/ui/PageContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, ArrowLeft, Loader2 } from 'lucide-react';

const ERROR_DESCRIPTIONS: Record<string, { title: string; description: string }> = {
  OAuthAccountNotLinked: {
    title: 'Hesap Bağlama Kısıtı',
    description:
      'Bu e-posta adresiyle kayıtlı bir şifreli hesap bulunmaktadır. Güvenlik gereği Google hesabı otomatik olarak bağlanamaz. Lütfen mevcut e-posta ve şifrenizle giriş yapın.',
  },
  AccessDenied: {
    title: 'Erişim Reddedildi',
    description: 'Giriş isteğiniz yetkilendirilemedi veya hesabınız askıya alınmış olabilir.',
  },
  Configuration: {
    title: 'Yapılandırma Hatası',
    description: 'Kimlik doğrulama sunucusunda geçici bir yapılandırma sorunu oluştu.',
  },
  Verification: {
    title: 'Doğrulama Hatası',
    description: 'Doğrulama anahtarı geçersiz veya süresi dolmuş.',
  },
  Default: {
    title: 'Giriş Hatası',
    description: 'Kimlik doğrulama sırasında bir hata oluştu. Lütfen tekrar deneyin.',
  },
};

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const errorKey = searchParams.get('error') || 'Default';
  const info = ERROR_DESCRIPTIONS[errorKey] || ERROR_DESCRIPTIONS.Default;

  return (
    <PageContainer variant="standard" className="py-12 sm:py-16 flex justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-status-danger/10 border border-status-danger/20 text-status-danger font-bold text-2xl mb-3 shadow-inner">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
            {info.title}
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Kimlik Doğrulama Uyarısı
          </p>
        </div>

        <Card className="p-6 sm:p-8 bg-bg-surface border-border-default shadow-sm text-center">
          <p className="text-sm text-text-secondary mb-6 leading-relaxed">
            {info.description}
          </p>

          <Link href="/login" className="block">
            <Button variant="primary" className="w-full min-h-[44px] justify-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Giriş Ekranına Dön
            </Button>
          </Link>
        </Card>
      </div>
    </PageContainer>
  );
}

export default function AuthErrorPage() {
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
      <AuthErrorContent />
    </Suspense>
  );
}
