import React from 'react';
import { PageContainer } from '@/components/ui/PageContainer';
import { ShieldCheck, AlertCircle, FileText } from 'lucide-react';

export const metadata = {
  title: 'Kullanım Koşulları — PsycheAI',
  description: 'PsycheAI kullanım koşulları, araştırma beyanı ve tıbbi sorumluluk reddi.',
};

export default function TermsPage() {
  return (
    <PageContainer variant="standard" className="py-12 sm:py-16 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
          <FileText className="w-3.5 h-3.5" />
          <span>HUKUKİ ÇERÇEVE VE BEYANLAR</span>
        </div>
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
          Kullanım Koşulları
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary max-w-2xl mx-auto">
          PsycheAI platformunu kullanmadan önce lütfen aşağıdaki şartları ve bilimsel sorumluluk sınırlarını inceleyiniz.
        </p>
      </div>

      <div className="space-y-6 text-sm text-text-secondary leading-relaxed bg-bg-surface p-8 rounded-3xl border border-border-default shadow-xs">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            1. Tıbbi / Klinik Teşhis Sorumluluk Reddi (Disclaimer)
          </h2>
          <p>
            PsycheAI bir sağlık hizmeti sağlayıcısı, psikiyatri kliniği veya tıbbi teşhis aracı değildir.
            Sunulan profiller, puanlar ve kuramsal içgörüler yalnızca bireysel öz-farkındalık ve bilimsel araştırma amaçlıdır.
            Ruh sağlığı ile ilgili herhangi bir tıbbi şüphe durumunda yetkili bir psikiyatrist veya klinik psikoloğa başvurulmalıdır.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-primary" />
            2. Hizmetin Niteliği ve Bilimsel Ön Kalibrasyon
          </h2>
          <p>
            Platformda yer alan araçlar kanıta dayalı Master Model ontolojisi üzerinde çalışır.
            Ön kalibrasyon aşamasında sağlanan sonuçlar yerel ölçek ortalamalarını gösterir ve temsili nüfus yüzdelikleri iddiasında bulunmaz.
          </p>
        </section>
      </div>
    </PageContainer>
  );
}
