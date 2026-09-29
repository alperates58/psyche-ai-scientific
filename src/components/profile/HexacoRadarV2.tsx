'use client';

import React, { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { Brain, Info, ArrowRight, Sparkles } from 'lucide-react';
import { UnifiedPsychologicalProfileV2, ConstructProfileV2 } from '@/types/unifiedProfileV2';
import { resolveConsumerScalePosition } from '@/lib/consumerLanguage';

interface HexacoRadarV2Props {
  profile: UnifiedPsychologicalProfileV2;
  onFactorSelect?: (constructId: string) => void;
}

const HEXACO_BROAD_FACTORS = [
  { id: 'hexaco_honesty_humility', nameTr: 'Dürüstlük-Alçakgönüllülük', nameEn: 'Honesty-Humility', color: '#8B5CF6' },
  { id: 'hexaco_emotionality', nameTr: 'Duygusallık', nameEn: 'Emotionality', color: '#6366F1' },
  { id: 'hexaco_extraversion', nameTr: 'Dışadönüklük', nameEn: 'Extraversion', color: '#3B82F6' },
  { id: 'hexaco_agreeableness', nameTr: 'Geçimlilik', nameEn: 'Agreeableness', color: '#14B8A6' },
  { id: 'hexaco_conscientiousness', nameTr: 'Sorumluluk', nameEn: 'Conscientiousness', color: '#F59E0B' },
  { id: 'hexaco_openness_to_experience', nameTr: 'Deneyime Açıklık', nameEn: 'Openness to Experience', color: '#A855F7' },
];

export const HexacoRadarV2: React.FC<HexacoRadarV2Props> = ({ profile, onFactorSelect }) => {
  const [selectedFactorId, setSelectedFactorId] = useState<string>('hexaco_honesty_humility');

  // Find constructs for the 6 broad factors
  const radarData = HEXACO_BROAD_FACTORS.map((factor) => {
    const construct = profile.constructs.find(
      (c) => c.constructId === factor.id || c.code === factor.id
    );

    // Relevant facets measured for this broad factor
    const relevantFacets = profile.facets.filter(
      (f) => f.constructId === factor.id && f.score !== null
    );

    // Broad factor scores must strictly use canonical constructScore (zero fabrication via averaging)
    const score = construct?.constructScore ?? null;

    const pos = resolveConsumerScalePosition(score);

    return {
      id: factor.id,
      nameTr: factor.nameTr,
      nameEn: factor.nameEn,
      score,
      visualCoordinate: score !== null ? Math.round(((score - 1) / 4) * 100) : 0,
      bandLabelTr: pos.labelTr,
      descriptionTr: pos.descriptionTr,
      measuredCount: relevantFacets.length,
      totalCount: 4,
    };
  });

  const measuredCount = radarData.filter((d) => d.score !== null).length;
  const activeFactor = radarData.find((d) => d.id === selectedFactorId) || radarData[0];

  return (
    <div
      id="section-hexaco"
      className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400">
              <Brain className="w-4 h-4" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              HEXACO Kişilik Radarı
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            6 temel kişilik boyutunun 1.0–5.0 yerel ölçek değerleri üzerinden çok eksenli radar gösterimi.
          </p>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-1.5 self-start sm:self-auto shrink-0">
          <Info className="w-3.5 h-3.5 text-violet-500" />
          <span>{measuredCount} / 6 Faktör Ölçüldü</span>
        </div>
      </div>

      {/* 2-Column: Radar Visual + Factor Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Recharts Radar */}
        <div className="lg:col-span-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 sm:p-6 border border-slate-100 dark:border-slate-800 flex flex-col items-center">
          <div className="w-full h-[320px] sm:h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
                <PolarAngleAxis
                  dataKey="nameTr"
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={false}
                  axisLine={false}
                />
                <Radar
                  name="Ölçülen Boyut"
                  dataKey="visualCoordinate"
                  stroke="#7c3aed"
                  fill="#8b5cf6"
                  fillOpacity={0.4}
                  strokeWidth={2}
                />
                <Tooltip
                  content={({ payload }) => {
                    if (payload && payload.length > 0) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-2.5 rounded-xl bg-slate-900 text-white text-xs shadow-lg space-y-1">
                          <div className="font-bold">{data.nameTr}</div>
                          <div className="text-slate-300">
                            Puan: {data.score !== null ? `${data.score.toFixed(2)}/5.00` : 'Ölçülmedi'}
                          </div>
                          <div className="text-violet-300 text-[11px] font-medium">
                            {data.bandLabelTr}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-slate-400 text-center mt-2">
            Görsel koordinatlar 0–100 eksenindedir. Gerçek puanlar 1.0–5.0 aralığındaki ham ortalamaları yansıtır.
          </div>
        </div>

        {/* Right Column: 6 Factor Cards & Active Inspection */}
        <div className="lg:col-span-6 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {radarData.map((factor) => {
              const isSelected = selectedFactorId === factor.id;
              const isMeasured = factor.score !== null;

              return (
                <button
                  key={factor.id}
                  type="button"
                  onClick={() => {
                    setSelectedFactorId(factor.id);
                    if (onFactorSelect) onFactorSelect(factor.id);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-violet-50 dark:bg-violet-950/50 border-violet-300 dark:border-violet-700 shadow-xs'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {factor.nameTr}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">
                      {isMeasured ? `${factor.score?.toFixed(1)}/5` : '—'}
                    </span>
                  </div>
                  <div className="text-[11px] text-violet-700 dark:text-violet-300 font-medium">
                    {factor.bandLabelTr}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {factor.measuredCount} / {factor.totalCount} alt boyut ölçüldü
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Factor Textual Detail */}
          {activeFactor && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 space-y-1.5 mt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white">
                  {activeFactor.nameTr} ({activeFactor.nameEn})
                </span>
                <span className="font-semibold text-violet-600 dark:text-violet-400">
                  {activeFactor.bandLabelTr}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeFactor.descriptionTr} Bu faktör günlük yaşamda çalışma standartlarını, sosyal ilişkileri ve durumsal karar alma dinamiklerini doğrudan etkiler.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Profilinde Ne Dikkat Çekiyor? (3-5 Evidence-Grounded Bullets) */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Profilinde Ne Dikkat Çekiyor?
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {radarData
            .filter((d) => d.score !== null)
            .sort((a, b) => Math.abs((b.score ?? 3.0) - 3.0) - Math.abs((a.score ?? 3.0) - 3.0))
            .slice(0, 3)
            .map((factor) => {
              const score = factor.score!;
              const isHigh = score >= 3.5;
              const isLow = score <= 2.5;
              let interpretation = '';

              if (factor.id === 'hexaco_honesty_humility') {
                interpretation = isHigh
                  ? 'Samimiyet, hakkaniyet ve adalet beklentin ölçeğin yüksek ucunda yer alarak sosyal etkileşimlerde dürüstlüğü birincil ilke kılıyor.'
                  : isLow
                  ? 'Stratejik esneklik ve çıkarları koruma eğilimi ön planda; durumlara pragmatik yaklaşabiliyorsun.'
                  : 'Sosyal ilişkilerinde dürüstlük ve pragmatizmi dengeli bir eksende yönetiyorsun.';
              } else if (factor.id === 'hexaco_emotionality') {
                interpretation = isHigh
                  ? 'Duygusal duyarlılık ve empati kapasiten yüksek; yakın bağlarda koruyucu ve içten bir yaklaşım sergiliyorsun.'
                  : isLow
                  ? 'Zorlu durumlar karşısında duygusal dayanıklılık ve soğukkanlılık göstererek sakin kalabiliyorsun.'
                  : 'Stresli anlarda duygusal uyarılma ile sakinliği dengeli bir aralıkta deneyimliyorsun.';
              } else if (factor.id === 'hexaco_extraversion') {
                interpretation = isHigh
                  ? 'Sosyal ortamlarda canlılık, enerji ve girişkenlik sergileyerek grup dinamiklerini canlandırıyorsun.'
                  : isLow
                  ? 'Sosyal enerjini seçici kullanıyor; derinlemesine bire bir veya sakin ortamlarda daha rahat üretiyorsun.'
                  : 'Sosyal ortamlarda duruma göre hem aktif katılım hem de gözlemci bir duruş sergileyebiliyorsun.';
              } else if (factor.id === 'hexaco_agreeableness') {
                interpretation = isHigh
                  ? 'Uyum, sabır ve bağışlayıcılık eğilimin yüksek; çatışmaları yatıştırma ve işbirliğini sürdürme gücün belirgin.'
                  : isLow
                  ? 'Eleştirel bakış açın ve sınır koyma kararlılığın güçlü; gerektiğinde doğrudan fikir ayrılığı ifade edebiliyorsun.'
                  : 'Farklı görüşler karşısında yapıcı bir uzlaşı ararken kendi sınırlarını da koruyabiliyorsun.';
              } else if (factor.id === 'hexaco_conscientiousness') {
                interpretation = isHigh
                  ? 'Planlılık, düzen ve mükemmeliyet standartların yüksek; sorumluluklarını disiplinle yerine getirme eğilimindesin.'
                  : isLow
                  ? 'Katı kurallar yerine durumsal esnekliği ve anlık uyum yeteneğini önceleyen bir çalışma tarzına sahipsin.'
                  : 'Planlı çalışma ile durumsal esnekliği bir arada tutarak dengeli bir tempo yakalayabiliyorsun.';
              } else {
                interpretation = isHigh
                  ? 'Entelektüel merak, sanatsal duyarlılık ve yenilikçi fikirlere açıklığın profilinde belirgin biçimde öne çıkıyor.'
                  : isLow
                  ? 'Kanıtlanmış pratik yöntemleri ve somut uygulamaları soyut kuramlara tercih eden bir yaklaşımın var.'
                  : 'Yenilikçi fikirlerle denenmiş pratik yöntemleri harmanlayabilen dengeli bir bilişsel açıklığa sahipsin.';
              }

              return (
                <div
                  key={factor.id}
                  className="p-3.5 rounded-2xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/40 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-violet-900 dark:text-violet-200">
                    <span>{factor.nameTr}</span>
                    <span className="text-[11px] font-mono font-semibold text-violet-700 dark:text-violet-300">
                      {factor.bandLabelTr}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {interpretation}
                  </p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
