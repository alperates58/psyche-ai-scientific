'use client';

import React from 'react';
import { Compass, Users, Info, Sparkles, AlertCircle } from 'lucide-react';
import { UnifiedPsychologicalProfileV2, FacetProfileV2 } from '@/types/unifiedProfileV2';

interface InterpersonalStyleCompassProps {
  profile: UnifiedPsychologicalProfileV2;
}

export const InterpersonalStyleCompass: React.FC<InterpersonalStyleCompassProps> = ({ profile }) => {
  const facetMap = new Map<string, FacetProfileV2>();
  profile.facets.forEach((f) => {
    if (f.measurementStatus !== 'NOT_MEASURED' && f.score !== null) {
      facetMap.set(f.facetId, f);
    }
  });

  // Derived Agency / Dominance (Girişkenlik / Yönlendiricilik)
  // Sourced from assertiveness and social_boldness
  const agencyCandidateIds = ['assertiveness', 'social_boldness'];
  const agencyFacets = agencyCandidateIds
    .map((id) => facetMap.get(id))
    .filter((f): f is FacetProfileV2 => !!f && f.score !== null);
  const agencyScores = agencyFacets.map((f) => f.score as number);

  // Derived Communion / Warmth (Yakınlık / İlişki Odaklılığı)
  // Sourced from empathic_concern, cooperation_orientation, sociability, gentleness
  const communionCandidateIds = ['empathic_concern', 'cooperation_orientation', 'sociability', 'gentleness'];
  const communionFacets = communionCandidateIds
    .map((id) => facetMap.get(id))
    .filter((f): f is FacetProfileV2 => !!f && f.score !== null);
  const communionScores = communionFacets.map((f) => f.score as number);

  // Scientific operational threshold: require >= 2 measured indicators for Agency AND >= 2 for Communion
  const hasSufficientEvidence = agencyScores.length >= 2 && communionScores.length >= 2;

  if (!hasSufficientEvidence) {
    return (
      <div className="p-6 rounded-3xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/60 dark:border-teal-900/40 space-y-3">
        <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300">
          <Compass className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <h4 className="text-sm font-bold">İlişkisel Tarz Haritası</h4>
          <span className="text-[10px] font-semibold bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 px-2 py-0.5 rounded-full ml-auto">
            Keşifsel türetilmiş görünüm
          </span>
        </div>
        <div className="flex items-start gap-2.5 text-xs text-teal-950 dark:text-teal-200">
          <AlertCircle className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Henüz yeterli veri yok. Kişilerarası pusula için hem yönlendiricilik hem de ilişki odaklılığı boyutlarında en az ikişer gösterge ölçülmelidir. (Şu an ölçülen: Yönlendiricilik: {agencyScores.length}/2, İlişki Odaklılığı: {communionScores.length}/2).
          </p>
        </div>
      </div>
    );
  }

  // Calculate derived coordinates (normalized -1 to +1 relative to scale midpoint 3.0)
  const avgAgency = agencyScores.reduce((a, b) => a + b, 0) / agencyScores.length;
  const avgCommunion = communionScores.reduce((a, b) => a + b, 0) / communionScores.length;

  // Normalized coordinate for 2D map: X is Communion (-1 to +1), Y is Agency (-1 to +1)
  const normX = (avgCommunion - 3.0) / 2.0;
  const normY = (avgAgency - 3.0) / 2.0;

  // SVG coordinates in 300x300 box
  const posX = 150 + normX * 110;
  const posY = 150 - normY * 110; // invert Y for SVG

  // Resolve descriptive regional area label
  let quadrantTitle = '';
  let quadrantDescription = '';

  if (normY >= 0 && normX >= 0) {
    quadrantTitle = 'Yakınlık ve girişkenliğin birlikte daha yüksek olduğu bölge';
    quadrantDescription = 'Sosyal ortamlarda hem kendini net bir dille ifade edebilen hem de başkalarıyla sıcak, empatik ve yapıcı bağlar kuran bir ilişkisel duruş.';
  } else if (normY >= 0 && normX < 0) {
    quadrantTitle = 'Girişkenliğin yüksek, yakınlık ihtiyacının daha sınırlı olduğu bölge';
    quadrantDescription = 'Kendi haklarını ve sınırlarını kararlılıkla savunan, hedefe odaklanan ve duygusal mesafesini koruyan özerk bir sosyal tutum.';
  } else if (normY < 0 && normX >= 0) {
    quadrantTitle = 'Yakınlığın yüksek, yönlendiriciliğin daha geri planda olduğu bölge';
    quadrantDescription = 'Çatışmadan kaçınan, başkalarının ihtiyaçlarına duyarlı, yumuşak başlı ve güven veren sakin bir ilişki tarzı.';
  } else {
    quadrantTitle = 'Girişkenliğin ve yakınlık ihtiyacının görece düşük olduğu bölge';
    quadrantDescription = 'Gereksiz sosyal gürültüden uzak duran, kendi kabuğunda rahat eden ve az sayıda insanla derin bağları tercih eden kontrollü bir duruş.';
  }

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
              <Compass className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              İlişkisel Tarz Haritası
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Girişkenlik (Agency) ve Yakınlık (Communion) eksenlerinde sosyal davranış dinamiklerin.
          </p>
        </div>

        <div className="text-[11px] text-teal-700 dark:text-teal-300 font-semibold bg-teal-50 dark:bg-teal-950/50 px-3 py-1 rounded-xl border border-teal-200 dark:border-teal-800 self-start sm:self-auto">
          Keşifsel türetilmiş görünüm
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* 2D Circumplex Plot SVG (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 flex flex-col items-center justify-center border border-slate-100 dark:border-slate-800">
          <div className="relative w-full max-w-[280px] aspect-square">
            <svg viewBox="0 0 300 300" className="w-full h-full">
              {/* Outer guide circle */}
              <circle cx="150" cy="150" r="120" fill="none" stroke="currentColor" strokeDasharray="3 3" className="text-slate-300 dark:text-slate-700" />
              <circle cx="150" cy="150" r="60" fill="none" stroke="currentColor" strokeDasharray="3 3" className="text-slate-200 dark:text-slate-800" />

              {/* Quadrant dividing axes */}
              <line x1="150" y1="20" x2="150" y2="280" stroke="currentColor" strokeWidth="1.5" className="text-slate-300 dark:text-slate-700" />
              <line x1="20" y1="150" x2="280" y2="150" stroke="currentColor" strokeWidth="1.5" className="text-slate-300 dark:text-slate-700" />

              {/* Axis labels */}
              <text x="150" y="16" textAnchor="middle" className="text-[10px] font-bold fill-slate-500 uppercase tracking-wider">
                Girişkenlik (+Agency)
              </text>
              <text x="150" y="295" textAnchor="middle" className="text-[10px] font-bold fill-slate-500 uppercase tracking-wider">
                Daha geri planda / daha az yönlendirici (-Agency)
              </text>
              <text x="290" y="153" textAnchor="end" className="text-[10px] font-bold fill-teal-600 uppercase tracking-wider">
                Sıcaklık (+Communion)
              </text>
              <text x="10" y="153" textAnchor="start" className="text-[10px] font-bold fill-slate-500 uppercase tracking-wider">
                Mesafeli (-Communion)
              </text>

              {/* User Position Point */}
              <circle cx={posX} cy={posY} r="8" fill="#0d9488" stroke="white" strokeWidth="2.5" className="shadow-lg animate-pulse" />
              <text x={posX} y={posY - 12} textAnchor="middle" className="text-[11px] font-bold fill-teal-700 dark:fill-teal-300 font-mono">
                Profilin
              </text>
            </svg>
          </div>
        </div>

        {/* Narrative and Derivation Details (7 Cols) */}
        <div className="lg:col-span-7 space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/60 space-y-2">
            <div className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider">
              {quadrantTitle}
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {quadrantDescription}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-800 dark:text-slate-200">Girişkenlik (Agency)</div>
              <div className="text-sm font-mono font-bold text-teal-600 dark:text-teal-400">
                {avgAgency.toFixed(2)} / 5.00
              </div>
              <div className="text-[10px] text-slate-400">
                Kaynak: {agencyFacets.map((f) => `${f.nameTr} (${f.score?.toFixed(1)})`).join(', ')}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-800 dark:text-slate-200">Yakınlık (Communion)</div>
              <div className="text-sm font-mono font-bold text-teal-600 dark:text-teal-400">
                {avgCommunion.toFixed(2)} / 5.00
              </div>
              <div className="text-[10px] text-slate-400">
                Kaynak: {communionFacets.map((f) => `${f.nameTr} (${f.score?.toFixed(1)})`).join(', ')}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed border border-slate-100 dark:border-slate-800">
            <strong>Bilimsel Türetim Notu:</strong> Bu gösterim doğrudan tek bir IPC ölçeği yerine, ölçülen {agencyFacets.length + communionFacets.length} ampirik alt boyutun koordinat bileşkesidir. Tanısal bir bağlanma veya ilişki patolojisi teşhisi içermez.
          </div>
        </div>
      </div>
    </div>
  );
};
