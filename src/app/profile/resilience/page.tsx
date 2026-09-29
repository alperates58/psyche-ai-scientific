import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Shield, ShieldCheck, ArrowRight, ChevronRight, Activity } from 'lucide-react';
import { getCurrentUserOrNull } from '@/lib/auth';
import { resolveUnifiedPsychologicalProfileV2 } from '@/lib/profile/masterProfileResolver';
import { PageContainer } from '@/components/ui/PageContainer';
import { UnifiedProfileEmptyState } from '@/components/profile/UnifiedProfileEmptyState';
import { ProfileTabNav } from '@/components/profile/ProfileTabNav';
import { ResilienceProfile } from '@/components/profile/ResilienceProfile';
import { FacetInsightCardV3 } from '@/components/profile/FacetInsightCardV3';

export const dynamic = 'force-dynamic';

export default async function ResilienceDomainPage() {
  const user = await getCurrentUserOrNull();
  if (!user) {
    redirect('/login?callbackUrl=/profile/resilience');
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

  // Filter resilience, coping and vitality facets
  const resilienceFacets = profile.facets.filter(
    (f) =>
      ['distress_tolerance', 'ego_resilience', 'stress_recovery', 'problem_focused_coping', 'emotion_focused_coping', 'subjective_vitality', 'flourishing_scale', 'satisfaction_with_life'].includes(f.facetId) &&
      f.measurementStatus !== 'NOT_MEASURED' &&
      f.score !== null
  );

  return (
    <PageContainer variant="wide" className="space-y-8 pb-16">
      {/* 6 Top-Level Profile Navigation Tabs */}
      <ProfileTabNav />

      {/* Hero / Summary (Cyan Family Identity) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-900 p-8 sm:p-10 text-white shadow-xl border border-cyan-900/60 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5" />
          <span>Psikolojik Alan: Zorlanma & Toparlanma</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Zorlanma ve Toparlanma Profili
        </h1>
        <p className="text-sm text-cyan-200/80 max-w-3xl leading-relaxed">
          Stresli durumlar karşısında esneklik, başa çıkma stratejileri, sıkıntı toleransı, toparlanma hızı ve öznel canlılık dinamiklerinizin psikolojik görünümü.
        </p>

        <div className="pt-2 flex items-center gap-3 flex-wrap text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-white font-semibold">
            {resilienceFacets.length} Dayanıklılık Boyutu Ölçüldü
          </span>
          <span className="text-cyan-300 font-medium">
            BRS (Smith et al.), Brief COPE & Ego-Sağlamlığı
          </span>
        </div>
      </div>

      {/* Synthesis Callout */}
      <div className="p-6 rounded-3xl bg-cyan-50/70 dark:bg-cyan-950/30 border border-cyan-200/60 dark:border-cyan-900/40 space-y-2">
        <h3 className="text-sm font-bold text-cyan-950 dark:text-cyan-200">
          Zorlukları Göğüsleme ve Dengeni Yeniden Kurma Biçimin
        </h3>
        <p className="text-xs text-cyan-900/80 dark:text-cyan-300/80 leading-relaxed">
          Psikolojik dayanıklılık hiç stres yaşamamak değil; zorlayıcı yaşam olayları sonrasında zihinsel ve duygusal dengenizi nasıl ve ne hızda yeniden inşa ettiğinizdir.
        </p>
      </div>

      {/* Primary Visual: ResilienceProfile */}
      <section className="space-y-3">
        <ResilienceProfile profile={profile} />
      </section>

      {/* Measured Facet Cards */}
      {resilienceFacets.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border-default pb-3">
            <div>
              <h2 className="text-base font-bold text-text-primary">
                Ölçülen Başa Çıkma ve Toparlanma Boyutları
              </h2>
              <p className="text-xs text-text-secondary">
                Stres anlarında öne çıkan stratejiler ve toparlanma dinamikleri.
              </p>
            </div>
            <Link
              href="/profile/facets?domain=coping_resilience"
              className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
            >
              <span>Tüm Dayanıklılık Boyutları</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resilienceFacets.map((facet) => (
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
          <span>Dayanıklılık Metodolojisi ve Güvenlik Güvencesi</span>
        </div>
        <p className="leading-relaxed">
          Zorlanma ve toparlanma profili klinik teşhis (tükenmişlik riski, depresyon vb.) iddiası taşımaz. Yalnızca bireyin zorluklar karşısındaki gözlenen başa çıkma yönelimlerini yansıtır.
        </p>
      </section>
    </PageContainer>
  );
}
