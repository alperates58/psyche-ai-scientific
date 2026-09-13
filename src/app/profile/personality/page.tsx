import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Info,
  ShieldCheck,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { DEMO_PROFILE_DATA } from '@/data/demo-profile';
import { HexacoRadarChart } from '@/components/charts/HexacoRadarChart';
import { FacetWhiskersChart } from '@/components/charts/FacetWhiskersChart';
import { EpistemicBadge } from '@/components/shared/EpistemicBadge';

export default function PersonalityProfilePage() {
  const { coreTraits, personalityFacets } = DEMO_PROFILE_DATA;

  return (
    <div className="space-y-8 pb-12">
      {/* Breadcrumb & Header */}
      <div className="border-b border-border-subtle pb-5">
        <Link
          href="/overview"
          className="inline-flex items-center text-xs font-semibold text-text-tertiary hover:text-text-primary transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          <span>Genel Bakışa Dön</span>
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-text-primary">Temel Kişilik Yapısı</h1>
              <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200/60 font-semibold px-2 py-0.5 rounded-full">
                ÖNİZLEME VERİSİ
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-1 max-w-2xl">
              HEXACO altı faktör modeline dayalı boyutsal ölçüm. Puanlar ön kalibrasyon döneminde geçici betimsel bileşik puanları temsil eder.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-surface-1 px-3 py-2 rounded-xl border border-border-subtle text-xs text-text-tertiary">
            <Info className="w-4 h-4 text-brand-600 flex-shrink-0" />
            <span>Temsili ulusal norm kalibrasyonu tamamlanana kadar yüzdelik dilimler gizlenmiştir.</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Radar Mini View + Whiskers Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Summary Radar */}
        <div className="lg:col-span-5 bg-surface-1 p-5 rounded-card border border-border-subtle shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-text-primary">Özellik Atlası Özeti</h2>
              <EpistemicBadge status="PROVISIONAL_PATTERN" size="sm" />
            </div>
            <p className="text-xs text-text-tertiary">
              Bu modüldeki tüm ölçülen maddeler genelindeki geçici bileşik konumları.
            </p>
          </div>

          <div className="py-4">
            <HexacoRadarChart data={coreTraits} compact />
          </div>

          <div className="bg-bg-subtle p-3 rounded-xl border border-border-subtle text-xs text-text-secondary">
            <div className="font-semibold text-text-primary mb-1">Psikometrik Not</div>
            Özellikler geniş ve genel davranışsal eğilimleri gösterir. Belirli davranışlar farklı çevresel bağlamlara göre anlamlı biçimde değişebilir.
          </div>
        </div>

        {/* Right Column: Facet Distribution Whiskers */}
        <div className="lg:col-span-7 bg-surface-1 p-5 rounded-card border border-border-subtle shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border-subtle">
            <div>
              <h2 className="text-sm font-bold text-text-primary">Alt Boyut Puan Dağılımı</h2>
              <p className="text-xs text-text-tertiary">
                Ön kalibrasyon aşamasında standart hata ve güven aralıkları nüfus normu toplanana kadar dahil edilmez.
              </p>
            </div>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200/50 px-2 py-0.5 rounded-full">
              Ön Kalibrasyon Modeli
            </span>
          </div>

          <FacetWhiskersChart facets={personalityFacets} />
        </div>
      </div>

      {/* Individual Facet Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-text-primary">Ayrıntılı Alt Boyut Analizi</h2>
            <p className="text-xs text-text-tertiary">
              Operasyonel tanımları, gözlenen örneklem büyüklüklerini ve hassasiyet sınırlarını inceleyin.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {personalityFacets.map((facet) => (
            <div
              key={facet.id}
              className="bg-surface-1 p-4 rounded-card border border-border-subtle shadow-xs hover:border-brand-200 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-text-primary">{facet.name_tr || facet.name}</h3>
                    <div className="text-[11px] text-brand-600 font-medium">{facet.constructName}</div>
                  </div>
                  <EpistemicBadge status={facet.epistemicStatus} size="sm" />
                </div>

                <p className="text-xs text-text-secondary leading-relaxed mb-4">
                  {facet.description}
                </p>
              </div>

              <div className="pt-3 border-t border-border-subtle space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-tertiary">Kestirim:</span>
                  <span className="font-mono font-bold text-text-primary text-sm">
                    {facet.score}{' '}
                    <span className="text-[11px] font-normal text-text-tertiary font-sans">
                      (±{facet.standardError})
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
                    {facet.observedItems} kalibre madde
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
    </div>
  );
}
