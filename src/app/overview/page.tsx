import React from 'react';
import Link from 'next/link';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Layers,
  Activity,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { DEMO_PROFILE_DATA, DemoCoreTrait } from '@/data/demo-profile';
import { HexacoRadarChart } from '@/components/charts/HexacoRadarChart';
import { EpistemicBadge } from '@/components/shared/EpistemicBadge';
import { prisma } from '@/lib/prisma';
import { getCurrentUserOrNull } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getLatestProfileSnapshotForUser } from '@/services/profileService';

import { calculateProfileCoverage } from '@/psychometrics/coverage';
import { PageContainer } from '@/components/ui/PageContainer';

export const dynamic = 'force-dynamic';

export default async function OverviewPage() {
  const user = await getCurrentUserOrNull();
  if (!user) {
    redirect('/login?callbackUrl=/overview');
  }
  if (user.status === 'PENDING_VERIFICATION') {
    redirect('/verify-email');
  }

  const latestSnapshot = await getLatestProfileSnapshotForUser(user.id);

  const isLiveProfile = !!latestSnapshot;
  const { overallCoverage, measurementQuality, keyInsights } = DEMO_PROFILE_DATA;

  // Compute or map traits
  let displayTraits: DemoCoreTrait[] = DEMO_PROFILE_DATA.coreTraits;
  let overallIntegrityLabel = 'Belirgin Kalite Sorunu Saptanmadı';
  let isIntegrityGood = true;

  if (latestSnapshot && latestSnapshot.constructScores.length > 0) {
    const constructMap = new Map<string, number>();
    for (const cs of latestSnapshot.constructScores) {
      constructMap.set(cs.constructId, cs.compositeScore);
    }

    const traitMapping = [
      { id: 'honesty_humility', name: 'Honesty-Humility', name_tr: 'Dürüstlük-Alçakgönüllülük' },
      { id: 'emotionality', name: 'Emotionality', name_tr: 'Duygusallık' },
      { id: 'extraversion', name: 'Extraversion', name_tr: 'Dışadönüklük' },
      { id: 'agreeableness', name: 'Agreeableness', name_tr: 'Uyumluluk' },
      { id: 'conscientiousness', name: 'Conscientiousness', name_tr: 'Sorumluluk' },
      { id: 'openness', name: 'Openness to Experience', name_tr: 'Deneyime Açıklık' },
    ];

    displayTraits = traitMapping.map(t => {
      const rawScore = constructMap.get(t.id) ?? 3.0;
      // Convert 1-5 Likert mean to 0-100 preview scale for radar visualization
      const normalizedScore = Math.round(((rawScore - 1) / 4) * 100);
      return {
        name: t.name,
        name_tr: t.name_tr,
        score: normalizedScore,
        standardError: 0, // Pre-calibration null displayed as 0 or null
        ci95: [0, 0] as [number, number],
        facetCount: 4,
        coverage: 100
      };
    });

    overallIntegrityLabel =
      latestSnapshot.overallIntegrity === 'EXCELLENT'
        ? 'Yanıt Bütünlüğü: Temiz'
        : latestSnapshot.overallIntegrity === 'ACCEPTABLE'
        ? 'Belirgin Kalite Sorunu Saptanmadı'
        : latestSnapshot.overallIntegrity === 'QUESTIONABLE'
        ? 'İncelenmesi Önerilir'
        : 'Düşük Veri Kalitesi';

    isIntegrityGood =
      latestSnapshot.overallIntegrity === 'EXCELLENT' ||
      latestSnapshot.overallIntegrity === 'ACCEPTABLE';
  }

  const totalFacetsCount = isLiveProfile ? await prisma.facet.count() : 84;
  const facetItemCounts: Record<string, number> = {};
  if (latestSnapshot) {
    for (const fs of latestSnapshot.facetScores) {
      facetItemCounts[fs.facetId] = fs.itemCount;
    }
  }
  const coverageMetrics = calculateProfileCoverage(facetItemCounts, totalFacetsCount, 6);

  return (
    <PageContainer variant="wide" className="space-y-8 pb-12">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs text-brand-700 font-semibold tracking-wide uppercase mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
            <span>Dijital Psikolojik Profil</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
            İyi akşamlar, {user.name}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Psikolojik profiliniz, yapılandırılmış ölçümler ve bilimsel değerlendirmeler tamamlandıkça gelişmeye devam eder.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/assessment"
            className="inline-flex items-center px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors duration-150"
          >
            <span>{isLiveProfile ? 'Yeni Değerlendirme Başlat' : 'Değerlendirmeye Başla'}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>
      </div>

      {/* Progressive Disclosure: 2 Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Coverage Card */}
        <div className="bg-surface-1 p-5 rounded-card border border-border-subtle shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
              Profil Kapsamı ve Ölçüm Derinliği
            </span>
            <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200/50">
              %{coverageMetrics.explorationPercentage} Keşfedildi
            </span>
          </div>
          <div className="flex items-baseline space-x-3 mb-2">
            <div className="text-2xl font-bold text-text-primary">
              {coverageMetrics.exploredFacetsCount}{' '}
              <span className="text-xs font-normal text-text-tertiary">/ {coverageMetrics.totalOntologyFacets} Alt Boyut</span>
            </div>
            <div className="text-xs text-text-tertiary border-l border-border-subtle pl-3">
              Ölçüm Derinliği: <span className="font-semibold text-text-primary">%{coverageMetrics.measurementDepthPercentage}</span> (Hedef: 6 Madde/Boyut)
            </div>
          </div>
          <div className="w-full bg-bg-subtle h-2.5 rounded-full overflow-hidden mb-3 border border-border-subtle">
            <div
              className="bg-brand-600 h-full rounded-full transition-all duration-700"
              style={{ width: `${coverageMetrics.explorationPercentage}%` }}
            />
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            {isLiveProfile
              ? `Ön kalibrasyon formundaki ${latestSnapshot.facetScores.length} alt boyut başlangıç seviyesinde taranmıştır. Tek maddeli tarama yüksek ölçüm hassasiyeti taşımaz; boylamsal modüllerle geliştirilmektedir.`
              : 'Henüz tamamlanmamış alt boyutlar için yeni değerlendirme modülleri mevcuttur.'}
          </p>
        </div>

        {/* Measurement Quality / Integrity Card */}
        <div className="bg-surface-1 p-5 rounded-card border border-border-subtle shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                Ölçüm Kalitesi ve Geçerlilik
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-md border ${
                  isIntegrityGood
                    ? 'text-teal-700 bg-teal-50 border-teal-200/60'
                    : 'text-amber-700 bg-amber-50 border-amber-200/60'
                }`}
              >
                {isLiveProfile ? 'CANLI VERİ KAYDI (ÖN KALİBRASYON)' : 'ÖNİZLEME VERİSİ'}
              </span>
            </div>
            <div className="flex items-baseline space-x-2 mb-2">
              <div className="text-3xl font-bold text-text-primary">
                {isLiveProfile ? 'Ön Kalibrasyon' : 'Yüksek'}
              </div>
              <span className="text-xs text-text-tertiary">
                {isLiveProfile ? '(Nüfus Normu Hariç)' : '(SEM ±2.8)'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 my-3">
            <div className="bg-surface-2 p-2.5 rounded-lg border border-border-subtle/80">
              <div className="text-[11px] text-text-tertiary">Örneklem Durumu</div>
              <div className="font-semibold text-text-primary mt-0.5">
                {isLiveProfile ? 'TR-Ön-Kalibrasyon' : measurementQuality.precision}
              </div>
            </div>
            <div className="bg-surface-2 p-2.5 rounded-lg border border-border-subtle/80">
              <div className="text-[11px] text-text-tertiary">Yanıt Bütünlüğü</div>
              <div className="font-semibold text-text-primary mt-0.5 truncate">
                {overallIntegrityLabel}
              </div>
            </div>
          </div>
          <div className="flex items-center text-[11px] text-text-tertiary">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 mr-1.5 flex-shrink-0" />
            <span>Çoklu telemetri bütünlük takibi aktif (yanıt süresi, düz yanıtlama ve doğrulama maddesi).</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Core Personality Radar + Key Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: HEXACO Radar Card (7 Columns) */}
        <div className="lg:col-span-7 bg-surface-1 p-6 rounded-card border border-border-subtle shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border-subtle">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-text-primary">Temel Kişilik Yapısı</h2>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    isLiveProfile
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200/60'
                      : 'bg-amber-50 text-amber-800 border-amber-200/60'
                  }`}
                >
                  {isLiveProfile ? 'ÖN KALİBRASYON (v1.0.0)' : 'ÖNİZLEME VERİSİ'}
                </span>
              </div>
              <p className="text-xs text-text-tertiary mt-0.5">
                HEXACO boyutları genelinde geçici betimsel bileşik puanlar (Ön kalibrasyon modeli)
              </p>
            </div>
            <Link
              href="/profile/personality"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center transition-colors"
            >
              <span>Alt Boyutları İncele</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {/* Radar Chart Component */}
          <div className="py-2">
            <HexacoRadarChart data={displayTraits} />
          </div>

          <div className="mt-4 pt-4 border-t border-border-subtle grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center">
            {displayTraits.map((t) => (
              <div key={t.name} className="p-2 rounded-lg bg-surface-2 border border-border-subtle flex flex-col justify-between">
                <div className="min-h-[30px] flex items-center justify-center text-[9.5px] font-medium text-text-tertiary leading-tight break-words text-center">
                  {t.name_tr || t.name}
                </div>
                <div className="text-sm font-bold text-text-primary mt-1">{t.score}</div>
                <div className="text-[9px] text-text-tertiary font-mono">
                  {isLiveProfile ? 'Geçici Bileşik' : `±${t.standardError}`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Key Synthesized Insights (5 Columns) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-text-primary flex items-center">
              <Sparkles className="w-4 h-4 text-brand-600 mr-2" />
              Öne Çıkan Psikolojik Örüntüler
            </h2>
            <Link
              href="/insights/context"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              Tümünü Gör
            </Link>
          </div>

          <div className="space-y-3.5">
            {keyInsights.map((insight) => (
              <div
                key={insight.id}
                className="bg-surface-1 p-4 rounded-card border border-border-subtle shadow-xs hover:border-brand-200 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-xs font-bold text-text-primary leading-tight">
                    {insight.title}
                  </h3>
                  <EpistemicBadge status={insight.badge} size="sm" />
                </div>
                <p className="text-xs text-text-secondary leading-relaxed mb-3">
                  {insight.body}
                </p>
                <div className="flex items-center flex-wrap gap-1.5 pt-2 border-t border-border-subtle/60">
                  <span className="text-[10px] text-text-tertiary mr-1 font-medium">Dayanak:</span>
                  {insight.groundedFacets.map((f) => (
                    <span
                      key={f}
                      className="text-[10px] bg-bg-subtle text-text-secondary px-2 py-0.5 rounded border border-border-subtle"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Epistemic Transparency Callout */}
      <div className="bg-surface-1 p-5 rounded-panel border border-border-subtle shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 shrink-0 mt-0.5">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Epistemik Ayrım İlkesi
              </h3>
              <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded">
                Aktif Standart
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-1 leading-relaxed max-w-3xl">
              PsycheAI, ampirik psikometrik ölçüm ile kuramsal/tarihsel yorumlamayı kesin sınırlarla birbirinden ayırır.
              Grafiklerde ve alt boyutlarda sunulan skorlar psychometric algoritmalar tarafından hesaplanır; hiçbir yapay zekâ veya kuramcı merceği ham puanınızı değiştiremez.
            </p>
          </div>
        </div>

        <Link
          href="/theory-council"
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-border-default hover:bg-surface-2 text-xs font-semibold text-text-secondary transition-colors whitespace-nowrap min-h-[44px]"
        >
          <span>Kuramcılar Konseyi’ni İncele</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Link>
      </div>
    </PageContainer>
  );
}
