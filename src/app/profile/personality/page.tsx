import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Brain, ArrowLeft, Sparkles, Layers, Grid, Info, ShieldCheck, ChevronRight } from 'lucide-react';
import { getCurrentUserOrNull } from '@/lib/auth';
import { resolveUnifiedPsychologicalProfileV2 } from '@/lib/profile/masterProfileResolver';
import { PageContainer } from '@/components/ui/PageContainer';
import { UnifiedProfileEmptyState } from '@/components/profile/UnifiedProfileEmptyState';
import { ProfileTabNav } from '@/components/profile/ProfileTabNav';
import { HexacoRadarV2 } from '@/components/profile/HexacoRadarV2';
import { HexacoFacetHeatmap } from '@/components/profile/HexacoFacetHeatmap';
import { FacetInsightCardV3 } from '@/components/profile/FacetInsightCardV3';
import { TraitInteractionMatrix } from '@/components/profile/TraitInteractionMatrix';

export const dynamic = 'force-dynamic';

export default async function PersonalityDomainPage() {
  const user = await getCurrentUserOrNull();
  if (!user) {
    redirect('/login?callbackUrl=/profile/personality');
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

  // Personality domain facets (24 HEXACO facets)
  const personalityFacets = profile.facets.filter(
    (f) => f.domainId === 'core_personality' || f.domainId === 'domain_personality_hexaco'
  );
  const measuredPersonalityFacets = personalityFacets.filter(
    (f) => f.measurementStatus !== 'NOT_MEASURED' && f.score !== null
  );

  return (
    <PageContainer variant="wide" className="space-y-8 pb-16">
      {/* 6 Top-Level Profile Navigation Tabs */}
      <ProfileTabNav />

      {/* 1. Personality Domain Hero / Summary (Violet Family Identity) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 p-8 sm:p-10 text-white shadow-xl border border-violet-900/60 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-300 text-xs font-semibold">
          <Brain className="w-3.5 h-3.5" />
          <span>Psikolojik Alan: Kişilik Yapısı</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Temel Kişilik Yapısı (HEXACO)
        </h1>
        <p className="text-sm text-purple-200/80 max-w-3xl leading-relaxed">
          Kişiliğinizi oluşturan 6 temel faktör (Dürüstlük-Alçakgönüllülük, Duygusallık, Dışadönüklük, Geçimlilik, Sorumluluk, Deneyime Açıklık) ve bu faktörlerin altındaki 24 kanonik boyutun çok yönlü analizi.
        </p>

        <div className="pt-2 flex items-center gap-3 flex-wrap text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-white font-semibold">
            {measuredPersonalityFacets.length} / 24 Alt Boyut Ölçüldü
          </span>
          <span className="text-purple-300 font-medium">
            HEXACO-60 & Kanonik Psikometrik Standartlar
          </span>
        </div>
      </div>

      {/* 2. HEXACO Radar Chart (High Prominence) */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Brain className="w-4 h-4 text-purple-600" />
          <h2 className="text-base font-bold text-text-primary">6 Faktör Radarı</h2>
        </div>
        <HexacoRadarV2 profile={profile} />
      </section>

      {/* 3. HEXACO 24 Facet Heatmap (True Matrix) */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Grid className="w-4 h-4 text-purple-600" />
          <h2 className="text-base font-bold text-text-primary">24 Alt Boyut Isı Haritası Matrisi</h2>
        </div>
        <HexacoFacetHeatmap profile={profile} />
      </section>

      {/* 4 & 5. Selected Facet Deep Dives (Top distinctive personality facets) */}
      {measuredPersonalityFacets.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border-default pb-3">
            <div>
              <h2 className="text-base font-bold text-text-primary">
                Öne Çıkan Kişilik Alt Boyutların
              </h2>
              <p className="text-xs text-text-secondary">
                Kişilik yapında en belirgin profil ayrışması sunan alt boyutların günlük yaşam yansımaları.
              </p>
            </div>
            <Link
              href="/profile/facets?domain=core_personality"
              className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1 shrink-0"
            >
              <span>Tüm Kişilik Boyutlarını Gör</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {measuredPersonalityFacets
              .sort((a, b) => Math.abs((b.score ?? 3.0) - 3.0) - Math.abs((a.score ?? 3.0) - 3.0))
              .slice(0, 4)
              .map((facet) => (
                <FacetInsightCardV3
                  key={facet.facetId}
                  facet={facet}
                  allFacets={profile.facets}
                />
              ))}
          </div>
        </section>
      )}

      {/* 6. Interaction Patterns */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border-default pb-3">
          <Layers className="w-4 h-4 text-purple-600" />
          <div>
            <h2 className="text-base font-bold text-text-primary">Kişilik İçi Etkileşimler</h2>
            <p className="text-xs text-text-secondary">
              Faktörlerinizin birbirini nasıl dengelediği veya desteklediği.
            </p>
          </div>
        </div>
        <TraitInteractionMatrix profile={profile} />
      </section>

      {/* 7. Scientific Detail Drawer */}
      <section className="p-5 rounded-2xl bg-surface-1 border border-border-default text-xs text-text-secondary space-y-2">
        <div className="flex items-center gap-2 font-bold text-text-primary">
          <ShieldCheck className="w-4 h-4 text-brand-primary" />
          <span>Bilimsel Metodoloji ve Norm Bilgisi</span>
        </div>
        <p className="leading-relaxed">
          Kişilik boyutları HEXACO kuramsal modeline uygun olarak 1.0–5.0 aralığındaki yanıt ortalamaları üzerinden hesaplanmaktadır. Toplum normlarıyla karşılaştırma henüz sunulmamaktadır; tüm yorumlar ölçeğin kendi içsel kutuplarına (düşük, orta, yüksek) dayanır.
        </p>
        <div className="pt-1">
          <Link
            href="/profile/science"
            className="text-xs font-bold text-brand-primary hover:underline"
          >
            Metodoloji ve Psikometrik Sınırlar Detayları →
          </Link>
        </div>
      </section>
    </PageContainer>
  );
}
