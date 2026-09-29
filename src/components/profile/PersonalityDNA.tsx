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

export interface HigherLevelTheme {
  id: string;
  titleTr: string;
  descriptionTr: string;
  color: string;
  mappedFacetIds: string[];
}

export const HIGHER_LEVEL_THEMES: HigherLevelTheme[] = [
  {
    id: 'organization_effort',
    titleTr: 'Düzen & Çaba',
    descriptionTr: 'Yapılandırma, planlılık, hedef odaklı çalışma ve mükemmeliyet standartları.',
    color: '#3B82F6',
    mappedFacetIds: ['organization', 'diligence', 'perfectionism', 'prudence'],
  },
  {
    id: 'curiosity_creativity',
    titleTr: 'Merak & Yaratıcılık',
    descriptionTr: 'Entelektüel keşif, yaratıcı problem çözme ve yenilikçi fikirlere açıklık.',
    color: '#8B5CF6',
    mappedFacetIds: ['creativity', 'inquisitiveness', 'unconventionality', 'joyous_exploration_curiosity', 'need_for_cognition'],
  },
  {
    id: 'self_efficacy',
    titleTr: 'Öz-Yeterlik',
    descriptionTr: 'Kendi kapasitesine, zorlukları aşabilme becerisine ve hedeflere ulaşma gücüne inanç.',
    color: '#10B981',
    mappedFacetIds: ['generalized_self_efficacy', 'core_self_esteem', 'social_self_esteem', 'creative_self_efficacy'],
  },
  {
    id: 'emotional_intensity',
    titleTr: 'Duygusal Yoğunluk',
    descriptionTr: 'Duyguların içsel deneyim derinliği, duyarlılık ve stres anlarındaki uyarılma düzeyi.',
    color: '#EC4899',
    mappedFacetIds: ['anxiety', 'fearfulness', 'sentimentality', 'affect_intensity', 'positive_affect_trait', 'negative_affect_trait'],
  },
  {
    id: 'self_control',
    titleTr: 'Öz-Kontrol',
    descriptionTr: 'Anlık dürtüleri yönetebilme, dikkati sürdürme ve uzun vadeli amaçlara sadakat.',
    color: '#F59E0B',
    mappedFacetIds: ['general_self_control', 'long_term_grit', 'patience', 'uppsp_lack_of_premeditation', 'delay_discounting_preference'],
  },
  {
    id: 'social_approach',
    titleTr: 'Sosyal Yaklaşım',
    descriptionTr: 'İnsanlarla etkileşimde canlılık, sosyal ortamlarda rahatlık ve girişkenlik.',
    color: '#6366F1',
    mappedFacetIds: ['sociability', 'social_boldness', 'liveliness', 'assertiveness'],
  },
  {
    id: 'relational_sensitivity',
    titleTr: 'İlişkisel Duyarlılık',
    descriptionTr: 'İlişkilerde başkalarının duygularını gözetme, şefkat, adalet ve bağışlayıcılık.',
    color: '#14B8A6',
    mappedFacetIds: ['empathic_concern', 'gentleness', 'forgivingness', 'sincerity', 'fairness'],
  },
  {
    id: 'value_orientation',
    titleTr: 'Değer Yönelimi',
    descriptionTr: 'Hayata yön veren temel ilkeler, evrensel değerler ve varoluşsal anlam arayışı.',
    color: '#EAB308',
    mappedFacetIds: ['schwartz_self_transcendence', 'schwartz_openness_to_change', 'schwartz_conservation', 'schwartz_self_enhancement', 'presence_of_meaning'],
  },
];

export const PersonalityDNA: React.FC<PersonalityDNAProps> = ({ profile }) => {
  const [selectedAxisId, setSelectedAxisId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'THEMES' | 'RADIAL'>('THEMES');

  // Map domains for titles and colors
  const domainMap = new Map(profile.domains.map((d) => [d.domainId, d]));

  // 1. Filter all measured facets
  const measuredFacets = profile.facets.filter(
    (f) => f.measurementStatus !== 'NOT_MEASURED' && f.score !== null
  );

  // Facet lookup map
  const facetLookup = new Map(profile.facets.map((f) => [f.facetId, f]));

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
      {/* Title & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Dna className="w-4 h-4" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Psikolojik İmzan
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ölçülen özelliklerinizin yüksek düzeyli tematik özeti ve radyal koordinat haritası.
          </p>
        </div>

        {/* View Switcher: Temalar vs Radyal DNA */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('THEMES')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'THEMES'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Geniş Temalar (8 Boyut)
          </button>
          <button
            type="button"
            onClick={() => setViewMode('RADIAL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'RADIAL'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Radyal Koordinatlar (DNA)
          </button>
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

      {/* VIEW MODE 1: HIGHER-LEVEL THEMATIC SUMMARY (8 THEMES) */}
      {viewMode === 'THEMES' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {HIGHER_LEVEL_THEMES.map((theme) => {
              const mappedFacets = theme.mappedFacetIds
                .map((fId) => facetLookup.get(fId))
                .filter((f): f is FacetProfileV2 => Boolean(f && f.measurementStatus !== 'NOT_MEASURED' && f.score !== null));

              const isMeasured = mappedFacets.length > 0;

              return (
                <div
                  key={theme.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isMeasured
                      ? 'bg-surface-1 border-border-default shadow-xs hover:border-brand-primary/40'
                      : 'bg-bg-subtle/50 border-border-subtle opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.color }} />
                      {theme.titleTr}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isMeasured
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-bg-subtle text-text-disabled'
                      }`}
                    >
                      {isMeasured ? `${mappedFacets.length} Gösterge` : 'Henüz Ölçülmedi'}
                    </span>
                  </div>

                  <p className="text-[11px] text-text-secondary leading-relaxed mb-3">
                    {theme.descriptionTr}
                  </p>

                  {/* Grouped Facet Indicators (Visual Grouped Summary, No Fake Composite Score) */}
                  {isMeasured ? (
                    <div className="space-y-1.5 pt-2 border-t border-border-subtle">
                      <div className="text-[10px] font-semibold text-text-tertiary">Ölçülen Alt Boyutlar:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {mappedFacets.map((facet) => {
                          const scalePos = resolveConsumerScalePosition(facet.score);
                          return (
                            <span
                              key={facet.facetId}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-surface-2 border border-border-subtle text-[11px] text-text-primary"
                              title={`${facet.nameTr}: ${facet.score?.toFixed(2)} (${scalePos.labelTr})`}
                            >
                              <span className="font-medium">{facet.nameTr}</span>
                              <span className="text-[10px] text-brand-primary font-bold">({scalePos.labelTr})</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-[10px] text-text-tertiary pt-2 border-t border-border-subtle italic">
                      Bu temayı haritalamak için ilgili değerlendirme modüllerini tamamlayabilirsiniz.
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Scientific Disclaimer Note & Product Metaphor */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/30 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed border border-slate-100 dark:border-slate-800 space-y-1">
            <p>
              <strong>Ürün Metaforu:</strong> Bu görsel genetik bir DNA modeli değildir; ölçülen psikolojik boyutlarının görsel imzasıdır.
            </p>
            <p>
              <strong>Bilimsel Hatırlatma:</strong> Yüksek düzeyli temalar deterministik olarak ölçülmüş alt boyutları gruplar; bilimsel yetkilendirme olmaksızın yapay aritmetik bileşik skor hesaplamaz.
            </p>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: RADIAL DNA COORDINATE VIEW */}
      {viewMode === 'RADIAL' && (
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
      )}
    </div>
  );
};
