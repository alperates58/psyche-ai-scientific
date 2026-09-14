import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Layers, GitCompare, Sparkles } from 'lucide-react';
import { DEMO_PROFILE_DATA } from '@/data/demo-profile';
import { EpistemicBadge } from '@/components/shared/EpistemicBadge';
import { PageContainer } from '@/components/ui/PageContainer';

export default function PatternsPage() {
  const { tensionsAndSynergies } = DEMO_PROFILE_DATA;

  const tensions = tensionsAndSynergies.filter((p) => p.type === 'tension');
  const synergies = tensionsAndSynergies.filter((p) => p.type === 'synergy');

  return (
    <PageContainer variant="wide" className="space-y-8 pb-12">
      {/* Header */}
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
              <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Gerilimler ve Sinerjiler</h1>
              <span className="text-[11px] sm:text-xs bg-amber-50 text-amber-800 border border-amber-200/60 font-semibold px-2 py-0.5 rounded-full shrink-0">
                ÖNİZLEME VERİSİ
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-1 max-w-2xl">
              Üst düzey özellik etkileşimleri. Karşıt hedefleri olan dinamik içsel gerilimler ile birbirini katlayan güçlendirici sinerjiler analiz edilir.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-surface-1 px-3 py-2 rounded-xl border border-border-subtle text-xs text-text-tertiary">
            <Layers className="w-4 h-4 text-brand-600 shrink-0" />
            <span>Etkileşimli Düğüm Matrisi</span>
          </div>
        </div>
      </div>

      {/* Tensions Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <GitCompare className="w-4 h-4 text-amber-700 shrink-0" />
          <h2 className="text-base font-bold text-text-primary">İçsel Gerilimler (Gelişim Alanları)</h2>
          <span className="text-xs text-text-tertiary hidden sm:inline">&bull; Farklı hedefleri olan ve birlikte bulunan özellikler</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tensions.map((item) => (
            <div
              key={item.id}
              className="bg-surface-1 p-4 sm:p-6 rounded-card border border-border-subtle shadow-xs space-y-4 hover:border-amber-200 transition-colors"
            >
              <div className="flex flex-col xs:flex-row items-start justify-between gap-2">
                <h3 className="text-sm font-bold text-text-primary">{item.title}</h3>
                <div className="shrink-0">
                  <EpistemicBadge status="EVIDENCE_SUPPORTED_INTERPRETATION" size="sm" />
                </div>
              </div>

              {/* Node link graphic */}
              <div className="flex items-center justify-between p-3 sm:p-3.5 bg-amber-50/40 rounded-xl border border-amber-200/50 gap-2">
                <div className="text-center flex-1 min-w-0">
                  <div className="text-[10px] uppercase font-bold text-amber-900 tracking-wide">Düğüm A</div>
                  <div className="text-xs font-semibold text-text-primary mt-0.5 break-words">{item.facetA}</div>
                </div>

                <div className="px-1.5 sm:px-3 flex flex-col items-center shrink-0">
                  <span className="text-[10px] font-mono font-bold text-amber-800 whitespace-nowrap">
                    %{Math.round(item.strength * 100)} Gerilim
                  </span>
                  <div className="w-8 sm:w-16 h-[2px] bg-amber-400 relative my-1">
                    <span className="w-2 h-2 rounded-full bg-amber-600 absolute left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="text-center flex-1 min-w-0">
                  <div className="text-[10px] uppercase font-bold text-amber-900 tracking-wide">Düğüm B</div>
                  <div className="text-xs font-semibold text-text-primary mt-0.5 break-words">{item.facetB}</div>
                </div>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed">
                {item.description}
              </p>

              <div className="p-3 bg-surface-2 rounded-xl border border-border-subtle text-xs text-text-secondary">
                <span className="font-semibold text-text-primary">Gelişim Önerisi:</span>{' '}
                {item.recommendation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Synergies Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
          <h2 className="text-base font-bold text-text-primary">Güçlendirici Sinerjiler (Katalitik Güçler)</h2>
          <span className="text-xs text-text-tertiary hidden sm:inline">&bull; Birlikte etkinliği artıran ve güçlendiren özellikler</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {synergies.map((item) => (
            <div
              key={item.id}
              className="bg-surface-1 p-4 sm:p-6 rounded-card border border-border-subtle shadow-xs space-y-4 hover:border-teal-200 transition-colors"
            >
              <div className="flex flex-col xs:flex-row items-start justify-between gap-2">
                <h3 className="text-sm font-bold text-text-primary">{item.title}</h3>
                <div className="shrink-0">
                  <EpistemicBadge status="EVIDENCE_SUPPORTED_INTERPRETATION" size="sm" />
                </div>
              </div>

              {/* Node link graphic */}
              <div className="flex items-center justify-between p-3 sm:p-3.5 bg-teal-50/40 rounded-xl border border-teal-200/50 gap-2">
                <div className="text-center flex-1 min-w-0">
                  <div className="text-[10px] uppercase font-bold text-teal-900 tracking-wide">Düğüm A</div>
                  <div className="text-xs font-semibold text-text-primary mt-0.5 break-words">{item.facetA}</div>
                </div>

                <div className="px-1.5 sm:px-3 flex flex-col items-center shrink-0">
                  <span className="text-[10px] font-mono font-bold text-teal-800 whitespace-nowrap">
                    %{Math.round(item.strength * 100)} Sinerji
                  </span>
                  <div className="w-8 sm:w-16 h-[2px] bg-teal-400 relative my-1">
                    <span className="w-2 h-2 rounded-full bg-teal-600 absolute left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="text-center flex-1 min-w-0">
                  <div className="text-[10px] uppercase font-bold text-teal-900 tracking-wide">Düğüm B</div>
                  <div className="text-xs font-semibold text-text-primary mt-0.5 break-words">{item.facetB}</div>
                </div>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed">
                {item.description}
              </p>

              <div className="p-3 bg-surface-2 rounded-xl border border-border-subtle text-xs text-text-secondary">
                <span className="font-semibold text-text-primary">Kaldıraç Stratejisi:</span>{' '}
                {item.recommendation}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
