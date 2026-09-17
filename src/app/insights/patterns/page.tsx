import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Layers, Compass, Sparkles, AlertCircle, Zap, ShieldCheck } from 'lucide-react';
import { PageContainer } from '@/components/ui/PageContainer';
import { getCurrentUserOrNull } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { resolveUnifiedPsychologicalProfileV2 } from '@/lib/profile/masterProfileResolver';
import { EpistemicBadge } from '@/components/shared/EpistemicBadge';

export const dynamic = 'force-dynamic';

export default async function PatternsPage() {
  const user = await getCurrentUserOrNull();
  if (!user) {
    redirect('/login?callbackUrl=/insights/patterns');
  }
  if (user.status === 'PENDING_VERIFICATION') {
    redirect('/verify-email');
  }

  // 1. Fetch authoritative Master Model Unified Psychological Profile V2
  const profile = await resolveUnifiedPsychologicalProfileV2(user.id);
  const isAssessed = profile.hasAssessments;

  // Scientifically: Patterns require verified multi-trait interaction evidence.
  const hasSufficientPatternEvidence =
    isAssessed &&
    (profile.tensions.length > 0 ||
      profile.synergies.length > 0 ||
      profile.crossDomainPatterns.length > 0);

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

      {!hasSufficientPatternEvidence ? (
        /* Empty State / Insufficient Evidence Guard */
        <div className="bg-surface-1 p-8 sm:p-12 rounded-card border border-border-subtle shadow-xs text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-200/60 flex items-center justify-center text-brand-600">
            <Compass className="w-7 h-7" />
          </div>
          <div className="max-w-md space-y-2">
            <h2 className="text-lg font-bold text-text-primary">Henüz yeterli ampirik veri yok.</h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              İçsel gerilimler ve sinerjiler, tamamlanan psikometrik değerlendirmelerdeki boyut etkileşimlerine göre hesaplanır. Yeterli ampirik veri olmadan yapay örüntü veya korelasyon iddiaları üretilmez.
            </p>
          </div>
          <Link
            href="/assessments"
            className="inline-flex items-center px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors duration-150"
          >
            <span>{isAssessed ? 'Yeni Değerlendirme Modülü' : 'Değerlendirmeye Başla'}</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Tensions Section */}
          {profile.tensions.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-text-primary flex items-center">
                  <AlertCircle className="w-4 h-4 text-amber-600 mr-2" />
                  İçsel Kutuplaşmalar ve Gerilimler ({profile.tensions.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.tensions.map((t) => (
                  <div
                    key={t.id}
                    className="p-5 rounded-2xl bg-surface-1 border border-border-subtle shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-text-primary">{t.titleTr}</h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        Gerilim
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">{t.descriptionTr}</p>
                    <div className="p-3 bg-surface-2 rounded-xl border border-border-subtle text-xs text-text-tertiary">
                      <span className="font-semibold text-text-primary block mb-0.5">Bilimsel Temel:</span>
                      {t.scientificRationaleTr}
                    </div>
                    {t.reflectionPromptTr && (
                      <div className="text-xs text-brand-700 italic bg-brand-50/50 p-2.5 rounded-lg border border-brand-200/40">
                        &ldquo;{t.reflectionPromptTr}&rdquo;
                      </div>
                    )}
                    <div className="text-[11px] text-text-tertiary flex items-center justify-between pt-2 border-t border-border-subtle">
                      <span>Dayandığı Boyutlar: {t.sourceFacetNamesTr.join(', ')}</span>
                      <span className="font-semibold text-text-secondary">Güven: {t.confidence}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Synergies Section */}
          {profile.synergies.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-text-primary flex items-center">
                  <Zap className="w-4 h-4 text-emerald-600 mr-2" />
                  Güçlendirici Sinerjiler ({profile.synergies.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.synergies.map((s) => (
                  <div
                    key={s.id}
                    className="p-5 rounded-2xl bg-surface-1 border border-border-subtle shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-text-primary">{s.titleTr}</h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Sinerji
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">{s.descriptionTr}</p>
                    <div className="p-3 bg-surface-2 rounded-xl border border-border-subtle text-xs text-text-tertiary">
                      <span className="font-semibold text-text-primary block mb-0.5">Bilimsel Temel:</span>
                      {s.scientificRationaleTr}
                    </div>
                    {s.reflectionPromptTr && (
                      <div className="text-xs text-emerald-800 italic bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-200/40">
                        &ldquo;{s.reflectionPromptTr}&rdquo;
                      </div>
                    )}
                    <div className="text-[11px] text-text-tertiary flex items-center justify-between pt-2 border-t border-border-subtle">
                      <span>Dayandığı Boyutlar: {s.sourceFacetNamesTr.join(', ')}</span>
                      <span className="font-semibold text-text-secondary">Güven: {s.confidence}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cross Domain Patterns */}
          {profile.crossDomainPatterns.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-text-primary flex items-center">
                  <Sparkles className="w-4 h-4 text-brand-600 mr-2" />
                  Alanlar Arası Örüntüler ({profile.crossDomainPatterns.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.crossDomainPatterns.map((p) => (
                  <div
                    key={p.id}
                    className="p-5 rounded-2xl bg-surface-1 border border-border-subtle shadow-xs space-y-3"
                  >
                    <h3 className="text-sm font-bold text-text-primary">{p.titleTr}</h3>
                    <p className="text-xs text-text-secondary leading-relaxed">{p.descriptionTr}</p>
                    <div className="p-3 bg-surface-2 rounded-xl border border-border-subtle text-xs text-text-tertiary">
                      <span className="font-semibold text-text-primary block mb-0.5">Bilimsel Temel:</span>
                      {p.scientificRationaleTr}
                    </div>
                    <div className="text-[11px] text-text-tertiary flex items-center justify-between pt-2 border-t border-border-subtle">
                      <span>Dayandığı Boyutlar: {p.sourceFacetNamesTr.join(', ')}</span>
                      <span className="font-semibold text-text-secondary">Güven: {p.confidence}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </PageContainer>
  );
}
