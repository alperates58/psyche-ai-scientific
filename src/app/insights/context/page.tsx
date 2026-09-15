import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, GitFork, CheckCircle2, Compass } from 'lucide-react';
import { PageContainer } from '@/components/ui/PageContainer';
import { getCurrentUserOrNull } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ContextShiftsPage() {
  const user = await getCurrentUserOrNull();
  if (!user) {
    redirect('/login?callbackUrl=/insights/context');
  }
  if (user.status === 'PENDING_VERIFICATION') {
    redirect('/verify-email');
  }

  // Multi-context shifts require dedicated multi-environment assessment data.
  // Scientifically: No multi-context data => No context shift scores.
  const hasContextData = false;

  return (
    <PageContainer variant="wide" className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-border-subtle pb-5">
        <Link
          href="/overview"
          className="inline-flex items-center text-xs font-semibold text-text-tertiary hover:text-text-primary transition-colors mb-2 py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1 shrink-0" />
          <span>Genel Bakışa Dön</span>
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Bağlamsal Değişim Analizi</h1>
              <span className="text-[11px] sm:text-xs bg-surface-2 text-text-tertiary border border-border-subtle font-semibold px-2 py-0.5 rounded-full shrink-0">
                {hasContextData ? 'CANLI VERİ' : 'HENÜZ ÖLÇÜLMEDİ'}
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-1 max-w-2xl">
              İnsan kişiliği çevreye duyarlıdır. İş ortamı, yakın ilişkiler ve stres altındaki davranışsal değişimler içsel bir tutarsızlık değil, durumsal adaptasyon esnekliğini yansıtır.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-surface-1 px-3 py-2 rounded-xl border border-border-subtle text-xs text-text-tertiary">
            <GitFork className="w-4 h-4 text-brand-600 shrink-0" />
            <span>Çok Bağlamlı Gözlem Modeli</span>
          </div>
        </div>
      </div>

      {/* Conceptual Explanation Banner */}
      <div className="bg-surface-1 p-4 rounded-card border border-border-subtle shadow-xs flex items-start space-x-3">
        <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div className="text-xs text-text-secondary leading-relaxed">
          <span className="font-bold text-text-primary">Bilimsel İlke:</span> Sosyal bağlamlar arasındaki davranışsal değişim, bağlama özgü durumsal zekâ göstergesidir; patolojik çelişki olarak nitelendirilmez.
        </div>
      </div>

      {/* Empty State / Insufficient Evidence Guard */}
      <div className="bg-surface-1 p-8 sm:p-12 rounded-card border border-border-subtle shadow-xs text-center flex flex-col items-center justify-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-200/60 flex items-center justify-center text-brand-600">
          <Compass className="w-7 h-7" />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-lg font-bold text-text-primary">Henüz bağlamsal veri bulunmuyor.</h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            Farklı bağlamlardaki (iş, sosyal, genel) davranışsal değişimleriniz, ilgili değerlendirmeler tamamlandıkça burada analiz edilecektir. Ölçüm verisi olmadan yapay skor veya örüntü üretilmez.
          </p>
        </div>
        <Link
          href="/assessment"
          className="inline-flex items-center px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors duration-150"
        >
          <span>Değerlendirmeye Başla</span>
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Link>
      </div>
    </PageContainer>
  );
}
