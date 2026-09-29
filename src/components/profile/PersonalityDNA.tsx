'use client';

import React, { useState } from 'react';
import { Dna, Info, Sparkles, Compass, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { UnifiedPsychologicalProfileV2, FacetProfileV2 } from '@/types/unifiedProfileV2';
import { resolveConsumerScalePosition } from '@/lib/consumerLanguage';

interface PersonalityDNAProps {
  profile: UnifiedPsychologicalProfileV2;
}

const DOMAIN_COLORS: Record<string, string> = {
  domain_personality_hexaco: '#8B5CF6',
  domain_cognitive_curiosity: '#06B6D4',
  domain_emotional_regulation: '#F43F5E',
  domain_self_system: '#6366F1',
  domain_coping_resilience: '#10B981',
  domain_interpersonal_dynamics: '#14B8A6',
  domain_values_meaning: '#F59E0B',
  domain_work_learning_execution: '#EC4899',
  domain_chronotype_energy: '#EAB308',
  domain_wellbeing_satisfaction: '#84CC16',
  domain_dark_triad: '#64748B',
};

export const PersonalityDNA: React.FC<PersonalityDNAProps> = ({ profile }) => {
  const [selectedAxisId, setSelectedAxisId] = useState<string | null>(null);

  // Map domains for titles and colors
  const domainMap = new Map(profile.domains.map((d) => [d.domainId, d]));

  // 1. Filter all measured facets
  const measuredFacets = profile.facets.filter(
    (f) => f.measurementStatus !== 'NOT_MEASURED' && f.score !== null
  );

  // 2. Group by domainId
  const facetsByDomain = new Map<string, FacetProfileV2[]>();
  measuredFacets.forEach((f) => {
    const list = facetsByDomain.get(f.domainId) || [];
    list.push(f);
    facetsByDomain.set(f.domainId, list);
  });

  // Sort each domain's facets by distinctiveness (midpoint distance: Math.abs(score - 3.0))
  facetsByDomain.forEach((list) => {
    list.sort((a, b) => Math.abs((b.score ?? 3.0) - 3.0) - Math.abs((a.score ?? 3.0) - 3.0));
  });

  // 3. Balanced axis selection: at most 1–2 per measured domain, 10–16 total
  const selectedFacets: FacetProfileV2[] = [];

  // Pass 1: Take the most distinctive facet from each measured domain
  facetsByDomain.forEach((list) => {
    if (list.length > 0 && selectedFacets.length < 16) {
      selectedFacets.push(list[0]);
    }
  });

  // Pass 2: Take the 2nd most distinctive facet from each domain (if available) up to 16
  facetsByDomain.forEach((list) => {
    if (list.length > 1 && selectedFacets.length < 16) {
      selectedFacets.push(list[1]);
    }
  });

  // If still fewer than 10 axes and more measured facets exist, fill with remaining most distinctive
  if (selectedFacets.length < 10 && measuredFacets.length > selectedFacets.length) {
    const remaining = measuredFacets
      .filter((f) => !selectedFacets.some((s) => s.facetId === f.facetId))
      .sort((a, b) => Math.abs((b.score ?? 3.0) - 3.0) - Math.abs((a.score ?? 3.0) - 3.0));

    for (const f of remaining) {
      if (selectedFacets.length >= 12) break;
      selectedFacets.push(f);
    }
  }

  // Cap at 16 total
  const finalFacets = selectedFacets.slice(0, 16);

  const resolvedAxes = finalFacets.map((f) => {
    const domain = domainMap.get(f.domainId);
    const domainNameTr = domain ? domain.nameTr : 'Psikolojik Boyut';
    const color = DOMAIN_COLORS[f.domainId] || domain?.color || '#8B5CF6';

    return {
      facetId: f.facetId,
      labelTr: f.nameTr,
      domainId: f.domainId,
      domainNameTr,
      color,
      score: f.score!,
      normalizedCoordinate:
        f.normalizedVisualCoordinate ?? Math.round(((f.score! - 1) / 4) * 100),
      distinctiveness: Math.abs(f.score! - 3.0),
    };
  });

  // Count unique domains in resolved axes
  const uniqueDomainsCount = new Set(resolvedAxes.map((a) => a.domainId)).size;

  // Top 3-5 distinctive axes based on midpoint distance Math.abs(score - 3.0)
  const topDistinctiveAxes = [...resolvedAxes]
    .sort((a, b) => b.distinctiveness - a.distinctiveness)
    .slice(0, 4);

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
          <span>{resolvedAxes.length} Eksen ({uniqueDomainsCount} Alan)</span>
        </div>
      </div>

      {/* Partial Domain Warning if only 1-2 domains measured */}
      {uniqueDomainsCount > 0 && uniqueDomainsCount <= 2 && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-center gap-2.5 text-xs text-amber-800 dark:text-amber-300">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            Bu görsel şu anda yalnızca ölçülen {uniqueDomainsCount} psikolojik alana ait boyutları yansıtmaktadır; diğer modüller tamamlandıkça eksenler dengeli biçimde genişleyecektir.
          </span>
        </div>
      )}

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
                  Seçili Eksen Detayı ({activeAxis.domainNameTr})
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

          {/* Bullets: Ölçekte En Uçta Yer Alan Eksenlerin */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Ölçekte En Uçta Yer Alan Eksenlerin
            </h3>
            <ul className="space-y-2.5">
              {topDistinctiveAxes.map((axis) => {
                const pos = resolveConsumerScalePosition(axis.score);
                const poleDesc =
                  axis.score > 3.0
                    ? 'ölçeğin üst bandına yaklaşan'
                    : 'ölçeğin alt bandına yaklaşan';
                return (
                  <li
                    key={axis.facetId}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                    <div>
                      <strong className="text-slate-900 dark:text-white font-semibold">
                        {axis.labelTr} ({axis.score.toFixed(2)} — {pos.labelTr}):
                      </strong>{' '}
                      Nötr ortalamadan en çok farklılaşarak {poleDesc} karakteristik bir profil ayrışması sunmaktadır.
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Scientific Disclaimer Note & Product Metaphor */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed border border-slate-100 dark:border-slate-800 space-y-1">
            <p>
              <strong>Ürün Metaforu:</strong> Bu görsel genetik bir DNA modeli değildir; ölçülen psikolojik boyutlarının görsel imzasıdır.
            </p>
            <p>
              <strong>Bilimsel Hatırlatma:</strong> Bu harita tamamlanan ölçeklerdeki yanıt konumlarını özetleyen bir görsel koordinat haritasıdır; biyometrik veya kalıcı bir psikolojik tip iddiası taşımaz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
