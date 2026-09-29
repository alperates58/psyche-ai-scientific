import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Sun, ShieldCheck, ArrowRight, ChevronRight, Target } from 'lucide-react';
import { getCurrentUserOrNull } from '@/lib/auth';
import { resolveUnifiedPsychologicalProfileV2 } from '@/lib/profile/masterProfileResolver';
import { PageContainer } from '@/components/ui/PageContainer';
import { UnifiedProfileEmptyState } from '@/components/profile/UnifiedProfileEmptyState';
import { ProfileTabNav } from '@/components/profile/ProfileTabNav';
import { NeedsProfile } from '@/components/profile/NeedsProfile';
import { SchwartzValuesCircle } from '@/components/profile/SchwartzValuesCircle';
import { FacetInsightCardV3 } from '@/components/profile/FacetInsightCardV3';

export const dynamic = 'force-dynamic';

export default async function MotivationDomainPage() {
  const user = await getCurrentUserOrNull();
  if (!user) {
    redirect('/login?callbackUrl=/profile/motivation');
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

  // Filter motivation & values facets
  const motivationFacets = profile.facets.filter(
    (f) =>
      ['autonomy_need_satisfaction', 'competence_need_satisfaction', 'relatedness_need_satisfaction', 'schwartz_openness_to_change', 'schwartz_self_transcendence', 'schwartz_conservation', 'schwartz_self_enhancement', 'presence_of_meaning', 'search_for_meaning'].includes(f.facetId) &&
      f.measurementStatus !== 'NOT_MEASURED' &&
      f.score !== null
  );

  return (
    <PageContainer variant="wide" className="space-y-8 pb-16">
      {/* 6 Top-Level Profile Navigation Tabs */}
      <ProfileTabNav />

      {/* Hero / Summary (Amber Family Identity) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 p-8 sm:p-10 text-white shadow-xl border border-amber-900/60 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold">
          <Sun className="w-3.5 h-3.5" />
          <span>Psikolojik Alan: Motivasyon & Değerler</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Motivasyon, İhtiyaçlar ve Değerler Haritan
        </h1>
        <p className="text-sm text-amber-200/80 max-w-3xl leading-relaxed">
          Seni ne harekete geçiriyor? Temel psikolojik ihtiyaçlar (Özerklik, Yetkinlik, İlişkililik), Schwartz evrensel insan değerleri ve varoluşsal anlam arayışı.
        </p>

        <div className="pt-2 flex items-center gap-3 flex-wrap text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-white font-semibold">
            {motivationFacets.length} Boyut Ölçüldü
          </span>
          <span className="text-amber-300 font-medium">
            Öz-Belirleme Kuramı (Deci & Ryan) & Schwartz Değerler Modeli
          </span>
        </div>
      </div>

      {/* Synthesis Callout */}
      <div className="p-6 rounded-3xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 space-y-2">
        <h3 className="text-sm font-bold text-amber-950 dark:text-amber-200">
          Seni Ne Harekete Geçiriyor?
        </h3>
        <p className="text-xs text-amber-900/80 dark:text-amber-300/80 leading-relaxed">
          İnsan motivasyonu yalnızca dışsal ödüllerle değil; kendi seçimlerini yapabilme (özerklik), yapabilirlik hissi (yetkinlik) ve bağ kurabilme (ilişkililik) temel ihtiyaçlarının karşılanmasıyla beslenir.
        </p>
      </div>

      {/* Primary Visual 1: NeedsProfile (Basic Psychological Needs) */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Target className="w-4 h-4 text-amber-600" />
          <h2 className="text-base font-bold text-text-primary">Temel Psikolojik İhtiyaçlar</h2>
        </div>
        <NeedsProfile profile={profile} />
      </section>

      {/* Primary Visual 2: Schwartz Values Circle (#values anchor) */}
      <section id="values" className="scroll-mt-20 space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Sun className="w-4 h-4 text-amber-600" />
          <h2 className="text-base font-bold text-text-primary">Değerler Haritam (Schwartz Dairesi)</h2>
        </div>
        <SchwartzValuesCircle profile={profile} />
      </section>

      {/* Measured Facet Cards */}
      {motivationFacets.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border-default pb-3">
            <div>
              <h2 className="text-base font-bold text-text-primary">
                Ölçülen Motivasyon ve Değer Boyutları
              </h2>
              <p className="text-xs text-text-secondary">
                İçsel güdülerinizin ve temel önceliklerinizin bireysel analizi.
              </p>
            </div>
            <Link
              href="/profile/facets?domain=motivation_values"
              className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
            >
              <span>Tüm Motivasyon Boyutları</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {motivationFacets.map((facet) => (
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
          <span>Değerler ve İhtiyaçlar Metodolojisi</span>
        </div>
        <p className="leading-relaxed">
          Schwartz değer çemberi 4 üst-düzey kadran (Açıklık, Aşkınlık, Muhafazacılık, Gelişim) ekseninde çalışır. Kısmi ölçümlerde yalnızca tamamlanan boyutlar gösterilir; uydurma değer puanı üretilmez.
        </p>
      </section>
    </PageContainer>
  );
}
