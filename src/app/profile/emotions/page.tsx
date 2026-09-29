import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Heart, ShieldCheck, ArrowRight, ChevronRight, Activity } from 'lucide-react';
import { getCurrentUserOrNull } from '@/lib/auth';
import { resolveUnifiedPsychologicalProfileV2 } from '@/lib/profile/masterProfileResolver';
import { PageContainer } from '@/components/ui/PageContainer';
import { UnifiedProfileEmptyState } from '@/components/profile/UnifiedProfileEmptyState';
import { ProfileTabNav } from '@/components/profile/ProfileTabNav';
import { EmotionRegulationProfile } from '@/components/profile/EmotionRegulationProfile';
import { FacetInsightCardV3 } from '@/components/profile/FacetInsightCardV3';

export const dynamic = 'force-dynamic';

export default async function EmotionsDomainPage() {
  const user = await getCurrentUserOrNull();
  if (!user) {
    redirect('/login?callbackUrl=/profile/emotions');
  }
  if (user.status === 'PENDING_VERIFICATION') {
    redirect('/verify-email');
  }

  const profile = await resolveUnifiedPsychologicalProfileV2(user.id);

  if (!profile.hasAssessments) {
    return (
      <PageContainer variant="wide" className="space-y-8 pb-16">
        <UnifiedProfileEmptyState
          userName={profile.userName}
          nextAssessmentUrl={profile.nextBestAssessment?.url}
          nextAssessmentTitle={profile.nextBestAssessment?.titleTr}
        />
      </PageContainer>
    );
  }

  // Filter emotion regulation domain facets
  const emotionFacets = profile.facets.filter(
    (f) =>
      ['cognitive_reappraisal', 'expressive_suppression', 'positive_affect_trait', 'negative_affect_trait', 'affect_intensity', 'distress_tolerance', 'experiential_avoidance', 'shame_proneness', 'guilt_proneness'].includes(f.facetId) &&
      f.measurementStatus !== 'NOT_MEASURED' &&
      f.score !== null
  );

  return (
    <PageContainer variant="wide" className="space-y-8 pb-16">
      {/* 6 Top-Level Profile Navigation Tabs */}
      <ProfileTabNav />

      {/* Hero / Summary (Rose Family Identity) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 p-8 sm:p-10 text-white shadow-xl border border-rose-900/60 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-semibold">
          <Heart className="w-3.5 h-3.5" />
          <span>Psikolojik Alan: Duygusal İşleyiş</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Duygusal İşleyiş Haritan
        </h1>
        <p className="text-sm text-rose-200/80 max-w-3xl leading-relaxed">
          Duygularınla nasıl çalışıyorsun? Bilişsel yeniden değerlendirme, duygusal baskılama, duygulanım yoğunluğu ve sıkıntı toleransı eğilimlerinizin psikolojik analizi.
        </p>

        <div className="pt-2 flex items-center gap-3 flex-wrap text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-white font-semibold">
            {emotionFacets.length} Duygu Boyutu Ölçüldü
          </span>
          <span className="text-rose-300 font-medium">
            ERQ (Gross & John) & Duygu Dinamikleri
          </span>
        </div>
      </div>

      {/* Synthesis Callout */}
      <div className="p-6 rounded-3xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 space-y-2">
        <h3 className="text-sm font-bold text-rose-950 dark:text-rose-200">
          Duygularınla Nasıl Çalışıyorsun?
        </h3>
        <p className="text-xs text-rose-900/80 dark:text-rose-300/80 leading-relaxed">
          Duygusal işleyiş, içsel uyarılma anlarında hisleri nasıl anlamlandırdığınızı ve ifade ettiğinizi belirler. Yeniden çerçeveleme (reappraisal) olaylara farklı açılardan bakmayı sağlarken, baskılama (suppression) dışarıya yansıtmayı kontrol etmeye odaklanır.
        </p>
      </div>

      {/* Primary Visual: EmotionRegulationProfile */}
      <section className="space-y-3">
        <EmotionRegulationProfile profile={profile} />
      </section>

      {/* Measured Emotion Facet Cards */}
      {emotionFacets.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border-default pb-3">
            <div>
              <h2 className="text-base font-bold text-text-primary">
                Ölçülen Duygu Düzenleme Boyutları
              </h2>
              <p className="text-xs text-text-secondary">
                Duygu dinamiklerinizin günlük yaşam ve stres anlarındaki yansımaları.
              </p>
            </div>
            <Link
              href="/profile/facets?domain=emotion_regulation"
              className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
            >
              <span>Tüm Duygu Boyutları</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emotionFacets.map((facet) => (
              <FacetInsightCardV3
                key={facet.facetId}
                facet={facet}
                allFacets={profile.facets}
              />
            ))}
          </div>
        </section>
      )}

      {/* Scientific Notice */}
      <section className="p-5 rounded-2xl bg-surface-1 border border-border-default text-xs text-text-secondary space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-text-primary">
          <ShieldCheck className="w-4 h-4 text-brand-primary" />
          <span>Duygu Düzenleme Metodolojisi</span>
        </div>
        <p className="leading-relaxed">
          Duygu düzenleme stratejileri Gross & John (ERQ) modeline uygun olarak bilişsel yeniden çerçeveleme ve dışsal baskılama eksenlerinde ölçülür. Boyutlar klinik teşhis niteliği taşımaz.
        </p>
      </section>
    </PageContainer>
  );
}
