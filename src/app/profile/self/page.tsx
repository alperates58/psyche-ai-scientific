import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Zap, ShieldCheck, ArrowRight, ChevronRight, CheckCircle2 } from 'lucide-react';
import { getCurrentUserOrNull } from '@/lib/auth';
import { resolveUnifiedPsychologicalProfileV2 } from '@/lib/profile/masterProfileResolver';
import { PageContainer } from '@/components/ui/PageContainer';
import { UnifiedProfileEmptyState } from '@/components/profile/UnifiedProfileEmptyState';
import { ProfileTabNav } from '@/components/profile/ProfileTabNav';
import { SelfSystemProfile } from '@/components/profile/SelfSystemProfile';
import { FacetInsightCardV3 } from '@/components/profile/FacetInsightCardV3';

export const dynamic = 'force-dynamic';

export default async function SelfDomainPage() {
  const user = await getCurrentUserOrNull();
  if (!user) {
    redirect('/login?callbackUrl=/profile/self');
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

  // Filter self system & self regulation facets
  const selfFacets = profile.facets.filter(
    (f) =>
      ['core_self_esteem', 'contingent_self_worth', 'self_compassion', 'generalized_self_efficacy', 'locus_of_control_internal', 'locus_of_control_external', 'self_concept_clarity', 'authenticity', 'general_self_control', 'long_term_grit', 'uppsp_negative_urgency', 'uppsp_positive_urgency', 'delay_discounting_preference'].includes(f.facetId) &&
      f.measurementStatus !== 'NOT_MEASURED' &&
      f.score !== null
  );

  return (
    <PageContainer variant="wide" className="space-y-8 pb-16">
      {/* 6 Top-Level Profile Navigation Tabs */}
      <ProfileTabNav />

      {/* Hero / Summary (Indigo Family Identity) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-10 text-white shadow-xl border border-indigo-900/60 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5" />
          <span>Psikolojik Alan: Benlik Sistemi</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Benlik & Öz-Düzenleme Profili
        </h1>
        <p className="text-sm text-indigo-200/80 max-w-3xl leading-relaxed">
          Kendinle ilişkin ve kendini yönetme biçimin. Benlik saygısı, öz-yeterlik inancı, otantiklik, öz-kontrol ve uzun vadeli azim dinamiklerinizin ampirik görünümü.
        </p>

        <div className="pt-2 flex items-center gap-3 flex-wrap text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-white font-semibold">
            {selfFacets.length} Boyut Ölçüldü
          </span>
          <span className="text-indigo-300 font-medium">
            RSES, GSE & Öz-Düzenleme Envanterleri
          </span>
        </div>
      </div>

      {/* Synthesis Callout */}
      <div className="p-6 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/40 space-y-2">
        <h3 className="text-sm font-bold text-indigo-950 dark:text-indigo-200">
          Kendinle İlişkin ve Kendini Yönetme Biçimin
        </h3>
        <p className="text-xs text-indigo-900/80 dark:text-indigo-300/80 leading-relaxed">
          Benlik sistemi, zorluklar karşısında kendinize duyduğunuz temel güveni, hatalara verdiğiniz tepkileri ve içsel dürtüleri uzun vadeli hedefler doğrultusunda düzenleme yetinizi temsil eder.
        </p>
      </div>

      {/* Primary Visual: SelfSystemProfile */}
      <section className="space-y-3">
        <SelfSystemProfile profile={profile} />
      </section>

      {/* Measured Self Facets Cards */}
      {selfFacets.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border-default pb-3">
            <div>
              <h2 className="text-base font-bold text-text-primary">
                Ölçülen Benlik ve İrade Boyutları
              </h2>
              <p className="text-xs text-text-secondary">
                Kişisel içgörüler, günlük yaşam yansımaları ve düşünme soruları.
              </p>
            </div>
            <Link
              href="/profile/facets?domain=self_system"
              className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
            >
              <span>Tüm Benlik Boyutları</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selfFacets.map((facet) => (
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
          <span>Benlik Modeli Metodolojisi</span>
        </div>
        <p className="leading-relaxed">
          Benlik saygısı Rosenberg (RSES), öz-yeterlik Schwarzer & Jerusalem (GSE) ölçek modellerine dayalıdır. Boyut puanları bağımsız ölçülür; yapay bileşik ortalama oluşturulmaz.
        </p>
      </section>
    </PageContainer>
  );
}
