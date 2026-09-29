'use client';

import React, { useState } from 'react';
import { Dna, Info, Sparkles, Compass, CheckCircle2, ShieldCheck } from 'lucide-react';
import { UnifiedPsychologicalProfileV2, FacetProfileV2 } from '@/types/unifiedProfileV2';
import { resolveConsumerScalePosition } from '@/lib/consumerLanguage';

interface PersonalityDNAProps {
  profile: UnifiedPsychologicalProfileV2;
}

// 12-16 canonical flagship candidate axes across the 11 domains
const FLAGSHIP_AXES_CANDIDATES = [
  { facetId: 'sincerity', labelTr: 'İçtenlik', domainNameTr: 'Kişilik & Mizaç', color: '#8B5CF6' },
  { facetId: 'fairness', labelTr: 'Hakkaniyet', domainNameTr: 'Kişilik & Mizaç', color: '#8B5CF6' },
  { facetId: 'social_boldness', labelTr: 'Sosyal Cesaret', domainNameTr: 'Kişilik & Mizaç', color: '#8B5CF6' },
  { facetId: 'sociability', labelTr: 'Sosyallik', domainNameTr: 'Kişilik & Mizaç', color: '#8B5CF6' },
  { facetId: 'patience', labelTr: 'Sabır & Hoşgörü', domainNameTr: 'Kişilik & Mizaç', color: '#8B5CF6' },
  { facetId: 'organization', labelTr: 'Düzen & Tertip', domainNameTr: 'Kişilik & Mizaç', color: '#8B5CF6' },
  { facetId: 'diligence', labelTr: 'Çalışkanlık & Özen', domainNameTr: 'Kişilik & Mizaç', color: '#8B5CF6' },
  { facetId: 'perfectionism', labelTr: 'Mükemmeliyetçilik', domainNameTr: 'Kişilik & Mizaç', color: '#8B5CF6' },
  { facetId: 'inquisitiveness', labelTr: 'Zihinsel Merak', domainNameTr: 'Kişilik & Mizaç', color: '#8B5CF6' },
  { facetId: 'aesthetic_appreciation', labelTr: 'Estetik Duyarlık', domainNameTr: 'Kişilik & Mizaç', color: '#8B5CF6' },
  { facetId: 'core_self_esteem', labelTr: 'Benlik Değeri', domainNameTr: 'Benlik Sistemi', color: '#6366F1' },
  { facetId: 'general_self_control', labelTr: 'Öz-Kontrol', domainNameTr: 'Öz-Düzenleme', color: '#6366F1' },
  { facetId: 'long_term_grit', labelTr: 'Uzun Vadeli Azim', domainNameTr: 'Öz-Düzenleme', color: '#6366F1' },
  { facetId: 'cognitive_reappraisal', labelTr: 'Bilişsel Yeniden Değerlendirme', domainNameTr: 'Duygu Düzenleme', color: '#F43F5E' },
  { facetId: 'distress_tolerance', labelTr: 'Sıkıntı Toleransı', domainNameTr: 'Başa Çıkma & Dayanıklılık', color: '#06B6D4' },
  { facetId: 'empathic_concern', labelTr: 'Empatik İlgi', domainNameTr: 'Kişilerarası Dinamikler', color: '#14B8A6' },
];

export const PersonalityDNA: React.FC<PersonalityDNAProps> = ({ profile }) => {
  const [selectedAxisId, setSelectedAxisId] = useState<string | null>(null);

  // Resolve measured axes from candidate list first, then append other measured facets if needed up to 14
  const measuredMap = new Map<string, FacetProfileV2>();
  profile.facets.forEach((f) => {
    if (f.measurementStatus !== 'NOT_MEASURED' && f.score !== null) {
      measuredMap.set(f.facetId, f);
    }
  });

  const resolvedAxes: Array<{
    facetId: string;
    labelTr: string;
    domainNameTr: string;
    color: string;
    score: number;
    normalizedCoordinate: number;
  }> = [];

  for (const candidate of FLAGSHIP_AXES_CANDIDATES) {
    const f = measuredMap.get(candidate.facetId);
    if (f && f.score !== null) {
      resolvedAxes.push({
        facetId: f.facetId,
        labelTr: f.nameTr,
        domainNameTr: candidate.domainNameTr,
        color: candidate.color,
        score: f.score,
        normalizedCoordinate: f.normalizedVisualCoordinate ?? Math.round(((f.score - 1) / 4) * 100),
      });
    }
  }

  // If fewer than 8, fill from other measured facets
  if (resolvedAxes.length < 8) {
    for (const [id, f] of measuredMap.entries()) {
      if (!resolvedAxes.some((a) => a.facetId === id) && f.score !== null) {
        resolvedAxes.push({
          facetId: f.facetId,
          labelTr: f.nameTr,
          domainNameTr: 'Psikolojik Boyut',
          color: '#8B5CF6',
          score: f.score,
          normalizedCoordinate: f.normalizedVisualCoordinate ?? Math.round(((f.score - 1) / 4) * 100),
        });
        if (resolvedAxes.length >= 12) break;
      }
    }
  }

  // Top 3-5 distinctive axes for text summary
  const topAxes = [...resolvedAxes].sort((a, b) => b.score - a.score).slice(0, 4);
  const activeAxis = resolvedAxes.find((a) => a.facetId === selectedAxisId) || resolvedAxes[0];

  return (
    <div
      id="section-fingerprint"
      className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6"
    >
      {/* Title & Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Dna className="w-4 h-4" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Psikolojik İmzan (Personality DNA)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ölçülen kanonik özelliklerinin çok eksenli koordinat profili. Bu görsel değişmez bir tip değil, ölçülen yanıtlarının görsel özetidir.
          </p>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-1.5 self-start sm:self-auto shrink-0">
          <Info className="w-3.5 h-3.5 text-indigo-500" />
          <span>{resolvedAxes.length} Ana Eksen Haritalandı</span>
        </div>
      </div>

      {/* Main Visual & Interpretation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Interactive Radial/Circular Coordinate DNA Visual (7 Columns) */}
        <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center">
          {resolvedAxes.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Henüz ölçülmüş boyut bulunmuyor.
            </div>
          ) : (
            <div className="w-full max-w-[420px] aspect-square relative flex items-center justify-center">
              {/* Center Core Badge */}
              <div className="absolute z-10 w-24 h-24 rounded-full bg-white dark:bg-slate-900 shadow-lg border border-indigo-100 dark:border-indigo-900 flex flex-col items-center justify-center text-center p-2">
                <Dna className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-0.5" />
                <span className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  DNA
                </span>
                <span className="text-[9px] text-slate-400 font-mono">
                  {resolvedAxes.length} Eksen
                </span>
              </div>

              {/* Concentric Guide Circles */}
              <svg className="w-full h-full" viewBox="0 0 400 400">
                <circle cx="200" cy="200" r="50" fill="none" stroke="currentColor" strokeDasharray="3 3" className="text-slate-200 dark:text-slate-700" />
                <circle cx="200" cy="200" r="95" fill="none" stroke="currentColor" strokeDasharray="3 3" className="text-slate-200 dark:text-slate-700" />
                <circle cx="200" cy="200" r="140" fill="none" stroke="currentColor" strokeDasharray="3 3" className="text-slate-200 dark:text-slate-700" />

                {/* Axis Radial Rays & Score Nodes */}
                {resolvedAxes.map((axis, i) => {
                  const angle = (i / resolvedAxes.length) * 2 * Math.PI - Math.PI / 2;
                  const maxRadius = 150;
                  const minRadius = 55;
                  const currentRadius = minRadius + ((axis.score - 1) / 4) * (maxRadius - minRadius);

                  const xOuter = 200 + Math.cos(angle) * maxRadius;
                  const yOuter = 200 + Math.sin(angle) * maxRadius;
                  const xPoint = 200 + Math.cos(angle) * currentRadius;
                  const yPoint = 200 + Math.sin(angle) * currentRadius;

                  const isSelected = selectedAxisId === axis.facetId;

                  return (
                    <g
                      key={axis.facetId}
                      className="cursor-pointer transition-all duration-200"
                      onClick={() => setSelectedAxisId(axis.facetId)}
                    >
                      {/* Guide ray line */}
                      <line
                        x1="200"
                        y1="200"
                        x2={xOuter}
                        y2={yOuter}
                        stroke="currentColor"
                        strokeWidth={isSelected ? 1.5 : 1}
                        className={isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-200 dark:text-slate-800'}
                      />

                      {/* Bar fill from min to current */}
                      <line
                        x1={200 + Math.cos(angle) * minRadius}
                        y1={200 + Math.sin(angle) * minRadius}
                        x2={xPoint}
                        y2={yPoint}
                        stroke={axis.color}
                        strokeWidth={isSelected ? 6 : 3.5}
                        strokeLinecap="round"
                        className="transition-all duration-300"
                      />

                      {/* Marker circle */}
                      <circle
                        cx={xPoint}
                        cy={yPoint}
                        r={isSelected ? 6 : 4}
                        fill={axis.color}
                        stroke="white"
                        strokeWidth={1.5}
                        className="transition-all duration-200 hover:scale-125"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>
          )}

          {/* Interactive Axis Selector Pills */}
          <div className="flex flex-wrap justify-center gap-1.5 mt-4 max-w-lg">
            {resolvedAxes.map((axis) => {
              const isSelected = selectedAxisId === axis.facetId;
              return (
                <button
                  key={axis.facetId}
                  type="button"
                  onClick={() => setSelectedAxisId(axis.facetId)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {axis.labelTr} ({axis.score.toFixed(1)})
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Textual Interpretation & Distinctive Axes (5 Columns) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Active Inspected Axis Card */}
          {activeAxis && (
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                  Seçili Eksen Detayı
                </span>
                <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                  {activeAxis.score.toFixed(2)} / 5.00
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {activeAxis.labelTr}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {resolveConsumerScalePosition(activeAxis.score).descriptionTr}
              </p>
              <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                Konum: {resolveConsumerScalePosition(activeAxis.score).labelTr}
              </div>
            </div>
          )}

          {/* Bullets: Profilinin En Belirgin Eksenleri */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Profilinin En Belirgin Eksenleri
            </h3>
            <ul className="space-y-2.5">
              {topAxes.map((axis) => {
                const pos = resolveConsumerScalePosition(axis.score);
                return (
                  <li
                    key={axis.facetId}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                    <div>
                      <strong className="text-slate-900 dark:text-white font-semibold">
                        {axis.labelTr} ({pos.labelTr}):
                      </strong>{' '}
                      Ölçüm ölçeğinde belirgin bir yer tutarak karar ve çalışma süreçlerindeki karakteristik eğilimini pekiştiriyor.
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Scientific Disclaimer Note */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed border border-slate-100 dark:border-slate-800">
            <strong>Bilimsel Hatırlatma:</strong> Bu harita tamamlanan ölçeklerdeki yanıt konumlarını özetleyen bir görsel koordinat haritasıdır; biyometrik veya kalıcı bir psikolojik tip iddiası taşımaz.
          </div>
        </div>
      </div>
    </div>
  );
};
