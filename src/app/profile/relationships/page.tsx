import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Users, ShieldCheck, ArrowRight, ChevronRight, HeartHandshake } from 'lucide-react';
import { getCurrentUserOrNull } from '@/lib/auth';
import { resolveUnifiedPsychologicalProfileV2 } from '@/lib/profile/masterProfileResolver';
import { PageContainer } from '@/components/ui/PageContainer';
import { UnifiedProfileEmptyState } from '@/components/profile/UnifiedProfileEmptyState';
import { ProfileTabNav } from '@/components/profile/ProfileTabNav';
import { InterpersonalStyleCompass } from '@/components/profile/InterpersonalStyleCompass';
import { FacetInsightCardV3 } from '@/components/profile/FacetInsightCardV3';

export const dynamic = 'force-dynamic';

export default async function RelationshipsDomainPage() {
  const user = await getCurrentUserOrNull();
  if (!user) {
    redirect('/login?callbackUrl=/profile/relationships');
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

  // Filter interpersonal and relational facets
  const relationshipFacets = profile.facets.filter(
    (f) =>
      ['attachment_anxiety', 'attachment_avoidance', 'cognitive_perspective_taking', 'empathic_concern', 'assertiveness', 'social_connectedness', 'rejection_sensitivity_nonclinical', 'cooperation_orientation', 'conflict_avoidance', 'sociability', 'social_boldness', 'social_self_esteem'].includes(f.facetId) &&
      f.measurementStatus !== 'NOT_MEASURED' &&
      f.score !== null
  );

  return (
    <PageContainer variant="wide" className="space-y-8 pb-16">
      {/* 6 Top-Level Profile Navigation Tabs */}
      <ProfileTabNav />

      {/* Hero / Summary (Teal Family Identity) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 p-8 sm:p-10 text-white shadow-xl border border-teal-900/60 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold">
          <Users className="w-3.5 h-3.5" />
          <span>Psikolojik Alan: İlişkisel Dinamikler</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          İlişkisel Tarz & Kişilerarası Dinamikler
        </h1>
        <p className="text-sm text-teal-200/80 max-w-3xl leading-relaxed">
          İnsanlarla nasıl yakınlık kuruyorsun ve kendini nasıl ifade ediyorsun? Sosyal cesaret, empati, sınırlar, işbirliği ve kişilerarası yönelimlerinizin çok boyutlu haritası.
        </p>

        <div className="pt-2 flex items-center gap-3 flex-wrap text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-white font-semibold">
            {relationshipFacets.length} İlişkisel Boyut Ölçüldü
          </span>
          <span className="text-teal-300 font-medium">
            Kişilerarası Çember (IPC) & Empati Modelleri
          </span>
        </div>
      </div>

      {/* Synthesis Callout */}
      <div className="p-6 rounded-3xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200/60 dark:border-teal-900/40 space-y-2">
        <h3 className="text-sm font-bold text-teal-950 dark:text-teal-200">
          İnsanlarla Yakınlık Kurma ve Kendini Konumlandırma Biçimin
        </h3>
        <p className="text-xs text-teal-900/80 dark:text-teal-300/80 leading-relaxed">
          Kişilerarası tarz; başkalarıyla kurulan sıcaklık ve bağ (Komünyon) ile sosyal ortamlarda yönlendirici olma ve sınır koyabilme (Ajans) dengesi etrafında şekillenir.
        </p>
      </div>

      {/* Primary Visual: InterpersonalStyleCompass */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <HeartHandshake className="w-4 h-4 text-teal-600" />
          <h2 className="text-base font-bold text-text-primary">İlişkisel Tarz Haritası</h2>
        </div>
        <InterpersonalStyleCompass profile={profile} />
      </section>

      {/* Measured Facet Cards */}
      {relationshipFacets.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border-default pb-3">
            <div>
              <h2 className="text-base font-bold text-text-primary">
                Ölçülen Kişilerarası Boyutlar
              </h2>
              <p className="text-xs text-text-secondary">
                Empati, sosyal cesaret ve ilişkisel sınırlar boyutlarınızın ayrıntılı incelemesi.
              </p>
            </div>
            <Link
              href="/profile/facets?domain=social_relational"
              className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
            >
              <span>Tüm İlişkisel Boyutlar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relationshipFacets.map((facet) => (
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
          <span>İlişkisel Model ve Bağlanma Metodolojisi</span>
        </div>
        <p className="leading-relaxed">
          İlişkisel tarz haritası keşifsel türetilmiş bir görselleştirmedir. Bağlanma boyutları (kaygı/kaçınma) yalnızca doğrudan geçerlenmiş envanter tamamlandığında gösterilir; kanıtsız klinik bağlanma teşhisi konulmaz.
        </p>
      </section>
    </PageContainer>
  );
}
