import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Layers, Compass } from 'lucide-react';
import { PageContainer } from '@/components/ui/PageContainer';
import { getCurrentUserOrNull } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getLatestProfileSnapshotForUser } from '@/services/profileService';

export const dynamic = 'force-dynamic';

export default async function PatternsPage() {
  const user = await getCurrentUserOrNull();
  if (!user) {
    redirect('/login?callbackUrl=/insights/patterns');
  }
  if (user.status === 'PENDING_VERIFICATION') {
    redirect('/verify-email');
  }

  const latestSnapshot = await getLatestProfileSnapshotForUser(user.id);
  const isAssessed = !!latestSnapshot && latestSnapshot.facetScores.length > 0;

  // Scientifically: Snapshot existence alone is NOT sufficient.
  // Patterns require verified multi-trait interaction evidence.
  // When evidence is insufficient, system strictly renders the scientific empty state.
  const hasSufficientPatternEvidence = false;

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
              <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Gerilimler ve Sinerjiler</h1>
              <span
                className={`text-[11px] sm:text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 border ${
                  hasSufficientPatternEvidence
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200/60'
                    : 'bg-surface-2 text-text-tertiary border-border-subtle'
                }`}
              >
                {hasSufficientPatternEvidence ? 'CANLI ANALİZ' : 'YETERSİZ VERİ'}
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-1 max-w-2xl">
              Üst düzey özellik etkileşimleri. Karşıt hedefleri olan dinamik içsel gerilimler ile birbirini katlayan güçlendirici sinerjiler analiz edilir.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-surface-1 px-3 py-2 rounded-xl border border-border-subtle text-xs text-text-tertiary">
            <Layers className="w-4 h-4 text-brand-600 shrink-0" />
            <span>Etkileşimli Düğüm Matrisi</span>
          </div>
        </div>
      </div>

      {/* Empty State / Insufficient Evidence Guard */}
      <div className="bg-surface-1 p-8 sm:p-12 rounded-card border border-border-subtle shadow-xs text-center flex flex-col items-center justify-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-200/60 flex items-center justify-center text-brand-600">
          <Compass className="w-7 h-7" />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-lg font-bold text-text-primary">Henüz yeterli veri yok.</h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            İçsel gerilimler ve sinerjiler, tamamlanan psikometrik değerlendirmelerdeki boyut etkileşimlerine göre hesaplanır. Yeterli ampirik veri olmadan yapay örüntü veya korelasyon iddiaları üretilmez.
          </p>
        </div>
        <Link
          href="/assessment"
          className="inline-flex items-center px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors duration-150"
        >
          <span>{isAssessed ? 'Yeni Değerlendirme Modülü' : 'Değerlendirmeye Başla'}</span>
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Link>
      </div>
    </PageContainer>
  );
}
