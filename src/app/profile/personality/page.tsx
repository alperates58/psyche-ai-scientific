import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Info, Compass } from 'lucide-react';
import { HexacoRadarChart, HexacoTraitData } from '@/components/charts/HexacoRadarChart';
import { FacetWhiskersChart, FacetDetailItem } from '@/components/charts/FacetWhiskersChart';
import { EpistemicBadge } from '@/components/shared/EpistemicBadge';
import { PageContainer } from '@/components/ui/PageContainer';
import { getCurrentUserOrNull } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { resolveUnifiedPsychologicalProfileV2 } from '@/lib/profile/masterProfileResolver';

export const dynamic = 'force-dynamic';

export default async function PersonalityProfilePage() {
  const user = await getCurrentUserOrNull();
  if (!user) {
    redirect('/login?callbackUrl=/profile/personality');
  }
  if (user.status === 'PENDING_VERIFICATION') {
    redirect('/verify-email');
  }

  // 1. Fetch authoritative Master Model Unified Psychological Profile V2
  const profile = await resolveUnifiedPsychologicalProfileV2(user.id);
  const personalityDomain = profile.domains.find((d) => d.code === 'core_personality');
  const isLiveProfile = profile.hasAssessments && (personalityDomain?.measuredFacetCount ?? 0) > 0;

  let coreTraits: HexacoTraitData[] = [];
  let personalityFacets: FacetDetailItem[] = [];

  if (isLiveProfile && personalityDomain) {
    // 6 Core Constructs (Honesty-Humility, Emotionality, Extraversion, Agreeableness, Conscientiousness, Openness)
    coreTraits = personalityDomain.constructs.map((c) => ({
      name: c.nameEn,
      name_tr: c.nameTr,
      score: c.normalizedVisualCoordinate,
      standardError: null,
      ci95: null,
      facetCount: c.totalFacetCount,
      coverage: Math.round(c.coverageRatio * 100),
    }));

    // 24 Master Facets in Personality Domain
    personalityFacets = personalityDomain.constructs
      .flatMap((c) =>
        c.facets.map((f) => ({
          ...f,
          constructNameTr: c.nameTr,
        }))
      )
      .filter((f) => f.measurementStatus !== 'NOT_MEASURED' && f.score !== null)
      .map((f) => ({
        id: f.facetId,
        name: f.nameEn,
        name_tr: f.nameTr,
        constructName: f.constructNameTr,
        description: f.scientificDefinitionTr || '',
        score: f.normalizedVisualCoordinate ?? Math.round(((f.score! - 1) / 4) * 100),
        standardError: null,
        ci95: null,
        measurementPrecision:
          f.itemCountAnswered >= 6
            ? 'High'
            : f.itemCountAnswered >= 3
            ? 'Moderate'
            : 'Developing',
        observedItems: f.itemCountAnswered,
        epistemicStatus: f.epistemicStatus,
      }));
  }

  return (
    <PageContainer variant="wide" className="space-y-8 pb-12">
      {/* Breadcrumb & Header */}
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
              <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Temel Kişilik Yapısı</h1>
              <span
                className={`text-[11px] sm:text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 border ${
                  isLiveProfile
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200/60'
                    : 'bg-surface-2 text-text-tertiary border-border-subtle'
                }`}
              >
                {isLiveProfile ? 'CANLI VERİ KAYDI' : 'HENÜZ ÖLÇÜLMEDİ'}
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-1 max-w-2xl">
              HEXACO altı faktör modeline dayalı boyutsal ölçüm. Puanlar ön kalibrasyon döneminde geçici betimsel bileşik puanları temsil eder.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-surface-1 px-3 py-2 rounded-xl border border-border-subtle text-xs text-text-tertiary">
            <Info className="w-4 h-4 text-brand-600 shrink-0" />
            <span>Temsili ulusal norm kalibrasyonu tamamlanana kadar yüzdelik dilimler ve hata marjları gizlenmiştir.</span>
          </div>
        </div>
      </div>

      {!isLiveProfile ? (
        /* Zero Assessment Empty State */
        <div className="bg-surface-1 p-8 sm:p-12 rounded-card border border-border-subtle shadow-xs text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-200/60 flex items-center justify-center text-brand-600">
            <Compass className="w-7 h-7" />
          </div>
          <div className="max-w-md space-y-2">
            <h2 className="text-lg font-bold text-text-primary">Henüz Kişilik Ölçümü Bulunmuyor</h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              İlk değerlendirmenizi tamamladığınızda HEXACO boyutlarınız ve alt boyut puan dağılımınız ampirik verilere dayanarak burada görüntülenecektir.
            </p>
          </div>
          <Link
            href="/assessments"
            className="inline-flex items-center px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors duration-150"
          >
            <span>Değerlendirmeye Başla</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>
      ) : (
        <>
          {/* Two Column Layout: Radar Mini View + Whiskers Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Summary Radar */}
            <div className="lg:col-span-5 bg-surface-1 p-4 sm:p-5 rounded-card border border-border-subtle shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-bold text-text-primary">Özellik Atlası Özeti</h2>
                  <EpistemicBadge status="PROVISIONAL_PATTERN" size="sm" />
                </div>
                <p className="text-xs text-text-tertiary">
                  Bu modüldeki tüm ölçülen maddeler genelindeki geçici bileşik konumları.
                </p>
              </div>

              <div className="py-3">
                <HexacoRadarChart data={coreTraits} compact />
              </div>

              <div className="bg-bg-subtle p-3 rounded-xl border border-border-subtle text-xs text-text-secondary mt-2">
                <div className="font-semibold text-text-primary mb-1">Psikometrik Not</div>
                Özellikler geniş ve genel davranışsal eğilimleri gösterir. Belirli davranışlar farklı çevresel bağlamlara göre anlamlı biçimde değişebilir.
              </div>
            </div>

            {/* Right Column: Facet Distribution Whiskers */}
            <div className="lg:col-span-7 bg-surface-1 p-4 sm:p-5 rounded-card border border-border-subtle shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-border-subtle">
                <div>
                  <h2 className="text-sm font-bold text-text-primary">Alt Boyut Puan Dağılımı</h2>
                  <p className="text-xs text-text-tertiary">
                    Ön kalibrasyon aşamasında sahte güven aralıkları üretilmez; betimsel nokta kestirimleri sunulur.
                  </p>
                </div>
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200/50 px-2 py-0.5 rounded-full self-start sm:self-auto shrink-0">
                  Ön Kalibrasyon Modeli
                </span>
              </div>

              <FacetWhiskersChart facets={personalityFacets} isPreCalibration={true} />
            </div>
          </div>

          {/* Individual Facet Cards Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-text-primary">Ayrıntılı Alt Boyut Analizi</h2>
                <p className="text-xs text-text-tertiary">
                  Ölçülen alt boyutların operasyonel tanımlarını ve gözlenen madde sayılarını inceleyin.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {personalityFacets.map((facet) => (
                <div
                  key={facet.id}
                  className="bg-surface-1 p-4 rounded-card border border-border-subtle shadow-xs hover:border-brand-200 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-text-primary truncate">{facet.name_tr || facet.name}</h3>
                        <div className="text-[11px] text-brand-600 font-medium truncate">{facet.constructName}</div>
                      </div>
                      <div className="shrink-0">
                        <EpistemicBadge status={facet.epistemicStatus} size="sm" />
                      </div>
                    </div>

                    <p className="text-xs text-text-secondary leading-relaxed mb-4">
                      {facet.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border-subtle space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-tertiary">Betimsel Puan:</span>
                      <span className="font-mono font-bold text-text-primary text-sm">
                        {facet.score}{' '}
                        <span className="text-[10px] font-normal text-text-tertiary font-sans">
                          (Ön-Kalibr.)
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-tertiary">Hassasiyet:</span>
                      <span className="font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded text-[11px]">
                        {facet.measurementPrecision === 'High' ? 'Yüksek' : facet.measurementPrecision === 'Moderate' ? 'Orta' : 'Gelişiyor'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-tertiary">Kanıt Tabanı:</span>
                      <span className="text-text-secondary font-medium">
                        {facet.observedItems} madde tamamlandı
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-tertiary">Doğrulama Durumu:</span>
                      <span className="text-text-secondary font-medium text-[11px]">
                        Ön-Kalibrasyon Modeli
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </PageContainer>
  );
}
