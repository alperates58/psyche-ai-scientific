import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Lightbulb, ShieldCheck, ArrowRight, ChevronRight } from 'lucide-react';
import { getCurrentUserOrNull } from '@/lib/auth';
import { resolveUnifiedPsychologicalProfileV2 } from '@/lib/profile/masterProfileResolver';
import { PageContainer } from '@/components/ui/PageContainer';
import { UnifiedProfileEmptyState } from '@/components/profile/UnifiedProfileEmptyState';
import { ProfileTabNav } from '@/components/profile/ProfileTabNav';
import { DecisionStyleMap } from '@/components/profile/DecisionStyleMap';
import { FacetInsightCardV3 } from '@/components/profile/FacetInsightCardV3';

export const dynamic = 'force-dynamic';

export default async function CognitionDomainPage() {
  const user = await getCurrentUserOrNull();
  if (!user) {
    redirect('/login?callbackUrl=/profile/cognition');
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

  // Filter cognitive and decision style facets
  const cognitionFacets = profile.facets.filter(
    (f) =>
      ['need_for_cognition', 'need_for_cognitive_closure', 'rational_analytical_thinking', 'intuitive_experiential_thinking', 'cognitive_flexibility', 'intolerance_of_uncertainty', 'rumination_brooding', 'decision_style_maximizing', 'procrastination_tendency'].includes(f.facetId) &&
      f.measurementStatus !== 'NOT_MEASURED' &&
      f.score !== null
  );

  return (
    <PageContainer variant="wide" className="space-y-8 pb-16">
      {/* 6 Top-Level Profile Navigation Tabs */}
      <ProfileTabNav />

      {/* Hero / Summary (Blue Family Identity) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-8 sm:p-10 text-white shadow-xl border border-blue-900/60 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Psikolojik Alan: Biliş & Karar Verme</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Karar Verme & Bilişsel Tarz Haritan
        </h1>
        <p className="text-sm text-blue-200/80 max-w-3xl leading-relaxed">
          Bilgiyi nasıl işlediğin, belirsizlikle nasıl başa çıktığın ve karar verirken analiz ile sezgiyi nasıl kullandığının bilimsel analizi.
        </p>

        <div className="pt-2 flex items-center gap-3 flex-wrap text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-white font-semibold">
            {cognitionFacets.length} Bilişsel Boyut Ölçüldü
          </span>
          <span className="text-blue-300 font-medium">
            Biliş İhtiyacı, Sezgisel/Rasyonel Düşünme & Esneklik
          </span>
        </div>
      </div>

      {/* Synthesis Callout */}
      <div className="p-6 rounded-3xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 space-y-2">
        <h3 className="text-sm font-bold text-blue-950 dark:text-blue-200">
          Düşünme ve Karar Alma Dinamiklerin
        </h3>
        <p className="text-xs text-blue-900/80 dark:text-blue-300/80 leading-relaxed">
          Rasyonel-analitik analiz ile sezgisel-deneyimsel kavrayış birbirini dışlayan zıtlıklar değil, farklı durumlarda devreye giren tamamlayıcı bilişsel sistemlerdir.
        </p>
      </div>

      {/* Primary Visual: DecisionStyleMap */}
      <section className="space-y-3">
        <DecisionStyleMap profile={profile} />
      </section>

      {/* Measured Facet Cards */}
      {cognitionFacets.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border-default pb-3">
            <div>
              <h2 className="text-base font-bold text-text-primary">
                Ölçülen Bilişsel ve Karar Boyutları
              </h2>
              <p className="text-xs text-text-secondary">
                Düşünme tarzınızın karmaşık problemler ve belirsizlik altındaki yansımaları.
              </p>
            </div>
            <Link
              href="/profile/facets?domain=cognition_decision"
              className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
            >
              <span>Tüm Bilişsel Boyutlar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cognitionFacets.map((facet) => (
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
          <span>Bilişsel Tarz Metodolojisi</span>
        </div>
        <p className="leading-relaxed">
          Bilişsel modeller yapay ikili kutuplar (ör. sadece analitik vs sadece sezgisel) üretmez. Boyutlar bağımsız süreklilikler olarak ölçülür.
        </p>
      </section>
    </PageContainer>
  );
}
