'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Info, HelpCircle, Layers } from 'lucide-react';
import { EpistemicBadge } from '@/components/shared/EpistemicBadge';

interface HeatmapCell {
  facetId: string;
  name: string;
  score: number;
  precision: 'High' | 'Moderate' | 'Developing';
  items: number;
}

interface HeatmapDomainRow {
  domainId: string;
  domainName: string;
  facets: HeatmapCell[];
}

const HEATMAP_DATA: HeatmapDomainRow[] = [
  {
    domainId: 'core_personality',
    domainName: 'Temel Kişilik',
    facets: [
      { facetId: 'sincerity', name: 'İçtenlik', score: 79, precision: 'High', items: 6 },
      { facetId: 'fairness', name: 'Adalet ve Hakkaniyet', score: 82, precision: 'High', items: 6 },
      { facetId: 'greed_avoidance', name: 'Açgözlülükten Kaçınma', score: 71, precision: 'Moderate', items: 6 },
      { facetId: 'modesty', name: 'Alçakgönüllülük', score: 74, precision: 'High', items: 6 },
      { facetId: 'fearfulness', name: 'Korkusuzluk/Tedbirlilik', score: 54, precision: 'Moderate', items: 6 },
      { facetId: 'anxiety', name: 'Kaygı Eğilimi', score: 58, precision: 'Moderate', items: 6 },
      { facetId: 'social_boldness', name: 'Sosyal Cesaret', score: 71, precision: 'Moderate', items: 6 },
      { facetId: 'organization', name: 'Düzenlilik', score: 84, precision: 'High', items: 6 },
      { facetId: 'inquisitiveness', name: 'Entelektüel Merak', score: 88, precision: 'High', items: 6 },
      { facetId: 'creativity', name: 'Yaratıcılık', score: 82, precision: 'High', items: 6 },
    ],
  },
  {
    domainId: 'self_system',
    domainName: 'Benlik Sistemi ve Kimlik',
    facets: [
      { facetId: 'self_esteem', name: 'Temel Benlik Saygısı', score: 76, precision: 'High', items: 6 },
      { facetId: 'contingent_worth', name: 'Koşullu Benlik Değeri', score: 65, precision: 'Moderate', items: 6 },
      { facetId: 'self_compassion', name: 'Öz-Şefkat', score: 62, precision: 'Moderate', items: 6 },
      { facetId: 'self_efficacy', name: 'Öz-Yeterlik', score: 78, precision: 'High', items: 6 },
      { facetId: 'locus_control', name: 'İçsel Denetim Odağı', score: 74, precision: 'High', items: 6 },
      { facetId: 'authenticity', name: 'Otantiklik', score: 80, precision: 'High', items: 6 },
    ],
  },
  {
    domainId: 'emotion_regulation',
    domainName: 'Duygu ve Duygulanım',
    facets: [
      { facetId: 'reappraisal', name: 'Bilişsel Yeniden Çerçeveleme', score: 75, precision: 'High', items: 6 },
      { facetId: 'suppression', name: 'Dışavurumsal Baskılama', score: 48, precision: 'Moderate', items: 6 },
      { facetId: 'reactivity', name: 'Duygusal Tepkisellik', score: 52, precision: 'Moderate', items: 6 },
      { facetId: 'distress_tolerance', name: 'Sıkıntı Toleransı', score: 68, precision: 'High', items: 6 },
      { facetId: 'pos_affect', name: 'Pozitif Duygulanım', score: 72, precision: 'High', items: 6 },
      { facetId: 'neg_affect', name: 'Negatif Duygulanım', score: 44, precision: 'High', items: 6 },
    ],
  },
  {
    domainId: 'cognition_decision',
    domainName: 'Biliş ve Karar Verme',
    facets: [
      { facetId: 'need_cognition', name: 'Biliş İhtiyacı', score: 86, precision: 'High', items: 6 },
      { facetId: 'closure', name: 'Bilişsel Kapanma İhtiyacı', score: 42, precision: 'Moderate', items: 6 },
      { facetId: 'rational_style', name: 'Rasyonel İşleme', score: 80, precision: 'High', items: 6 },
      { facetId: 'intuitive_style', name: 'Sezgisel İşleme', score: 64, precision: 'Moderate', items: 6 },
      { facetId: 'flexibility', name: 'Bilişsel Esneklik', score: 81, precision: 'High', items: 6 },
      { facetId: 'uncertainty_tol', name: 'Belirsizlik Toleransı', score: 69, precision: 'Moderate', items: 6 },
    ],
  },
  {
    domainId: 'self_regulation',
    domainName: 'Öz-Düzenleme ve İrade',
    facets: [
      { facetId: 'neg_urgency', name: 'Negatif Dürtüsellik', score: 38, precision: 'High', items: 4 },
      { facetId: 'pos_urgency', name: 'Pozitif Dürtüsellik', score: 45, precision: 'Moderate', items: 4 },
      { facetId: 'premeditation', name: 'Önceden Tasarlama', score: 79, precision: 'High', items: 4 },
      { facetId: 'self_control', name: 'Genel Öz-Kontrol', score: 78, precision: 'High', items: 6 },
      { facetId: 'grit', name: 'Uzun Vadeli Azim', score: 82, precision: 'High', items: 6 },
    ],
  },
  {
    domainId: 'motivation_values',
    domainName: 'Motivasyon ve Değerler',
    facets: [
      { facetId: 'autonomy', name: 'Özerklik İhtiyacı', score: 85, precision: 'High', items: 6 },
      { facetId: 'competence', name: 'Yetkinlik İhtiyacı', score: 82, precision: 'High', items: 6 },
      { facetId: 'relatedness', name: 'İlişkisellik İhtiyacı', score: 70, precision: 'Moderate', items: 6 },
      { facetId: 'self_transcendence', name: 'Aşkınlık Değerleri', score: 79, precision: 'High', items: 6 },
      { facetId: 'openness_values', name: 'Değişime Açıklık', score: 83, precision: 'High', items: 6 },
      { facetId: 'presence_meaning', name: 'Anlam Varlığı', score: 76, precision: 'High', items: 5 },
    ],
  },
  {
    domainId: 'social_relational',
    domainName: 'Sosyal ve Kişilerarası İlişkiler',
    facets: [
      { facetId: 'perspective_taking', name: 'Perspektif Alma', score: 84, precision: 'High', items: 6 },
      { facetId: 'empathic_concern', name: 'Empatik İlgi', score: 77, precision: 'High', items: 6 },
      { facetId: 'assertiveness', name: 'Kendini Ortaya Koyma', score: 72, precision: 'Moderate', items: 6 },
      { facetId: 'boundary_setting', name: 'Sınır Koyma', score: 66, precision: 'Moderate', items: 6 },
      { facetId: 'collaborating', name: 'İşbirlikçi Çatışma Tarzı', score: 80, precision: 'High', items: 5 },
    ],
  },
];

export default function ProfileHeatmapPage() {
  const [selectedCell, setSelectedCell] = useState<HeatmapCell | null>(null);

  // Returns morally neutral purple/slate intensity based on numerical position
  const getCellShade = (score: number) => {
    if (score >= 80) return 'bg-brand-600 text-white';
    if (score >= 70) return 'bg-brand-500/80 text-white';
    if (score >= 60) return 'bg-brand-200 text-brand-900';
    if (score >= 50) return 'bg-brand-100 text-brand-800';
    if (score >= 40) return 'bg-slate-200 text-slate-800';
    return 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
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
              <h1 className="text-2xl font-bold text-text-primary">Psikolojik Profil Haritası</h1>
              <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200/60 font-semibold px-2 py-0.5 rounded-full">
                ÖNİZLEME VERİSİ
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-1 max-w-2xl">
              Alanlar arası yoğunluk matrisi. Renk tonu, boyutsal ölçek üzerindeki kestirilen özellik düzeyini gösterir; ahlaki iyi/kötü yargılarından tamamen bağımsızdır.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-surface-1 px-3 py-2 rounded-xl border border-border-subtle text-xs text-text-tertiary">
            <Info className="w-4 h-4 text-brand-600 flex-shrink-0" />
            <span>Hassasiyeti ve gözlenen madde sayısını incelemek için herhangi bir hücreye tıklayın.</span>
          </div>
        </div>
      </div>

      {/* Heatmap Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Heatmap Matrix */}
        <div className="lg:col-span-8 bg-surface-1 p-6 rounded-card border border-border-subtle shadow-xs space-y-6">
          {HEATMAP_DATA.map((domain) => (
            <div key={domain.domainId} className="space-y-2">
              <div className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center justify-between">
                <span>{domain.domainName}</span>
                <span className="text-[11px] font-normal text-text-tertiary">{domain.facets.length} Alt Boyut</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {domain.facets.map((facet) => {
                  const isSelected = selectedCell?.facetId === facet.facetId;
                  const shade = getCellShade(facet.score);

                  return (
                    <button
                      key={facet.facetId}
                      onClick={() => setSelectedCell(facet)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 border flex items-center space-x-2 ${
                        isSelected
                          ? 'ring-2 ring-brand-600 ring-offset-2 scale-105 shadow-sm'
                          : 'hover:opacity-90'
                      } ${shade} border-black/5`}
                    >
                      <span>{facet.name}</span>
                      <span className="font-mono font-bold text-[11px] opacity-90">{facet.score}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Neutral Legend */}
          <div className="pt-4 border-t border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-text-tertiary">
            <span className="font-medium">Ölçek Gösterimi:</span>
            <div className="flex items-center space-x-2 text-[11px]">
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-border-subtle">&lt;40 Düşük</span>
              <span className="px-2 py-0.5 rounded bg-brand-100 text-brand-800">50 Orta</span>
              <span className="px-2 py-0.5 rounded bg-brand-200 text-brand-900">60-70 Belirgin</span>
              <span className="px-2 py-0.5 rounded bg-brand-600 text-white font-semibold">80+ Çok Yüksek</span>
            </div>
          </div>
        </div>

        {/* Right Inspector Drawer */}
        <div className="lg:col-span-4 bg-surface-1 p-5 rounded-card border border-border-subtle shadow-xs sticky top-24">
          <h2 className="text-sm font-bold text-text-primary mb-1">Alt Boyut Denetçisi</h2>
          <p className="text-xs text-text-tertiary mb-4">
            {selectedCell ? 'Seçilen hücre için ayrıntılı ölçüm parametreleri.' : 'Ampirik parametreleri incelemek için haritadaki herhangi bir hücreyi seçin.'}
          </p>

          {selectedCell ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-surface-2 border border-border-subtle">
                <div className="text-base font-bold text-text-primary">{selectedCell.name}</div>
                <div className="text-xs text-brand-600 font-medium mt-0.5">Alt Boyut Kodu: {selectedCell.facetId}</div>

                <div className="mt-4 flex items-baseline space-x-2">
                  <span className="text-3xl font-bold font-mono text-text-primary">{selectedCell.score}</span>
                  <span className="text-xs text-text-tertiary">/ 100 betimsel düzey</span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-border-subtle">
                  <span className="text-text-tertiary">Ölçüm Derinliği:</span>
                  <span className="font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full text-[11px]">
                    {selectedCell.precision === 'High' ? 'Araştırma Formu Düzeyi' : selectedCell.precision === 'Moderate' ? 'Orta Düzey' : 'Başlangıç Düzeyi (Ön Kalibrasyon)'}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-border-subtle">
                  <span className="text-text-tertiary">Gözlenen Maddeler:</span>
                  <span className="font-semibold text-text-primary">{selectedCell.items} madde tamamlandı</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-border-subtle">
                  <span className="text-text-tertiary">Epistemik Kademe:</span>
                  <span className="font-semibold text-text-primary">A Kademesi (Literatür Tanımlı)</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-border-subtle">
                  <span className="text-text-tertiary">Norm Kıyaslaması:</span>
                  <span className="text-text-secondary italic">Gizlendi (Ön-Kalibrasyon Aşaması)</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-48 border border-dashed border-border-default rounded-xl flex flex-col items-center justify-center text-center p-4 text-xs text-text-tertiary">
              <Layers className="w-8 h-8 text-brand-500/40 mb-2" />
              <span>Ölçüm kapsamını ve hassasiyetini görmek için profil haritasındaki bir alt boyuta tıklayın.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
