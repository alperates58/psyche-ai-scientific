'use client';

import React from 'react';
import { UnifiedPsychologicalProfileV2 } from '@/types/unifiedProfileV2';
import { resolveConsumerScalePosition, SCALE_POSITION_EXPLANATION_NOTE } from '@/lib/consumerLanguage';
import {
  Sparkles,
  Compass,
  Heart,
  Users,
  Brain,
  Scale,
  ShieldCheck,
  Target,
  Flame,
  Activity,
  Lightbulb,
} from 'lucide-react';

interface ProfileSummarySectionProps {
  profile: UnifiedPsychologicalProfileV2;
}

export const ProfileSummarySection: React.FC<ProfileSummarySectionProps> = ({ profile }) => {
  const measuredFacets = profile.facets.filter(
    (f) => f.measurementStatus === 'MEASURED_PRECALIBRATION' && f.score !== null
  );

  if (measuredFacets.length === 0) {
    return (
      <div className="bg-surface-1 p-8 rounded-3xl border border-border-default shadow-xs text-center space-y-3">
        <Compass className="w-10 h-10 text-brand-primary mx-auto opacity-70" />
        <h3 className="text-base font-bold text-text-primary">Profil Özeti Ölçüm Bekliyor</h3>
        <p className="text-xs text-text-secondary max-w-md mx-auto">
          İlk değerlendirmelerinizi tamamladığınızda, öne çıkan eğilimleriniz ve özellik kombinasyonlarınız burada sentezlenecektir.
        </p>
      </div>
    );
  }

  // 1. Seni En İyi Anlatan Eğilimler (Top standout high or low facets)
  const standoutFacets = [...measuredFacets].sort((a, b) => {
    const diffA = Math.abs((a.score || 3) - 3);
    const diffB = Math.abs((b.score || 3) - 3);
    return diffB - diffA;
  }).slice(0, 4);

  // 2. Karar Verme Tarzı Facets (from cognition_decision or self_regulation)
  const decisionFacets = measuredFacets.filter(
    (f) => f.domainId === 'cognition_decision' || f.domainId === 'self_regulation'
  );

  // 3. İlişkilerde Belirgin Eğilimler (from social_relational or core_personality extraversion/agreeableness)
  const relationalFacets = measuredFacets.filter(
    (f) => f.domainId === 'social_relational' || f.code.includes('EXTRAVERSION') || f.code.includes('AGREEABLENESS')
  );

  // 4. Motivasyonu Besleyen Unsurlar (from motivation_values or creativity_curiosity)
  const motivationFacets = measuredFacets.filter(
    (f) => f.domainId === 'motivation_values' || f.domainId === 'creativity_curiosity'
  );

  // 5. Stres & Dayanıklılık (from emotion_regulation or coping_resilience)
  const stressFacets = measuredFacets.filter(
    (f) => f.domainId === 'emotion_regulation' || f.domainId === 'coping_resilience'
  );

  return (
    <div className="bg-surface-1 p-6 sm:p-8 rounded-3xl border border-border-default shadow-xs space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-brand-primary" />
            <h2 className="text-lg sm:text-xl font-extrabold text-text-primary tracking-tight">
              Bütüncül Profil Özeti
            </h2>
          </div>
          <p className="text-xs text-text-secondary">
            Tamamlanan ampirik değerlendirmelerinizden elde edilen çok boyutlu psikolojik kimlik sentezi.
          </p>
        </div>

        <span className="text-[11px] font-semibold text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full border border-brand-primary/20 self-start sm:self-auto">
          {measuredFacets.length} Alt Boyut Sentezlendi
        </span>
      </div>

      {/* Grid of Synthesized Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section A: Seni En İyi Anlatan Eğilimler */}
        {standoutFacets.length > 0 && (
          <div className="p-5 rounded-2xl bg-bg-subtle/80 border border-border-default space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-text-primary">
              <Compass className="w-4 h-4 text-brand-primary" />
              <span>Seni En İyi Anlatan Eğilimler</span>
            </div>
            <div className="space-y-2">
              {standoutFacets.map((f) => {
                const pos = resolveConsumerScalePosition(f.score);
                return (
                  <div key={f.facetId} className="p-3 rounded-xl bg-surface-1 border border-border-subtle flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-text-primary">{f.nameTr}</div>
                      <div className="text-[10px] text-text-tertiary">{f.domainNameTr}</div>
                    </div>
                    <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                      {pos.labelTr} ({f.score?.toFixed(2)})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section B: Dikkat Çeken Özellik Kombinasyonları (Synergies & Patterns) */}
        {profile.synergies && profile.synergies.length > 0 ? (
          <div className="p-5 rounded-2xl bg-bg-subtle/80 border border-border-default space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-text-primary">
              <Sparkles className="w-4 h-4 text-brand-primary" />
              <span>Dikkat Çeken Özellik Kombinasyonları</span>
            </div>
            <div className="space-y-2">
              {profile.synergies.slice(0, 3).map((syn) => (
                <div key={syn.id} className="p-3 rounded-xl bg-surface-1 border border-border-subtle space-y-1">
                  <div className="text-xs font-bold text-brand-primary">{syn.titleTr}</div>
                  <p className="text-[11px] text-text-secondary leading-relaxed">
                    {syn.descriptionTr}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Section C: Karar Verme Tarzında Öne Çıkanlar */}
        {decisionFacets.length > 0 && (
          <div className="p-5 rounded-2xl bg-bg-subtle/80 border border-border-default space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-text-primary">
              <Brain className="w-4 h-4 text-brand-primary" />
              <span>Karar Verme Tarzında Öne Çıkanlar</span>
            </div>
            <div className="space-y-2">
              {decisionFacets.slice(0, 3).map((f) => {
                const pos = resolveConsumerScalePosition(f.score);
                return (
                  <div key={f.facetId} className="p-3 rounded-xl bg-surface-1 border border-border-subtle flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-text-primary">{f.nameTr}</div>
                      <div className="text-[10px] text-text-tertiary">{f.scientificDefinitionTr?.slice(0, 60)}...</div>
                    </div>
                    <span className="text-[10px] font-semibold text-text-secondary bg-surface-2 px-2 py-0.5 rounded-md">
                      {pos.labelTr}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section D: İlişkilerde Belirgin Eğilimler */}
        {relationalFacets.length > 0 && (
          <div className="p-5 rounded-2xl bg-bg-subtle/80 border border-border-default space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-text-primary">
              <Users className="w-4 h-4 text-brand-primary" />
              <span>İlişkilerde Belirgin Eğilimlerin</span>
            </div>
            <div className="space-y-2">
              {relationalFacets.slice(0, 3).map((f) => {
                const pos = resolveConsumerScalePosition(f.score);
                return (
                  <div key={f.facetId} className="p-3 rounded-xl bg-surface-1 border border-border-subtle flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-text-primary">{f.nameTr}</div>
                      <div className="text-[10px] text-text-tertiary">{f.scientificDefinitionTr?.slice(0, 60)}...</div>
                    </div>
                    <span className="text-[10px] font-semibold text-text-secondary bg-surface-2 px-2 py-0.5 rounded-md">
                      {pos.labelTr}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section E: Motivasyonunu Besleyen Unsurlar */}
        {motivationFacets.length > 0 && (
          <div className="p-5 rounded-2xl bg-bg-subtle/80 border border-border-default space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-text-primary">
              <Flame className="w-4 h-4 text-brand-primary" />
              <span>Motivasyonunu Besleyen Unsurlar</span>
            </div>
            <div className="space-y-2">
              {motivationFacets.slice(0, 3).map((f) => {
                const pos = resolveConsumerScalePosition(f.score);
                return (
                  <div key={f.facetId} className="p-3 rounded-xl bg-surface-1 border border-border-subtle flex items-center justify-between">
                    <div className="text-xs font-bold text-text-primary">{f.nameTr}</div>
                    <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                      {pos.labelTr}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section F: Gerilimler ve Üzerinde Düşünmeye Değer Denge Noktaları */}
        {profile.tensions && profile.tensions.length > 0 ? (
          <div className="p-5 rounded-2xl bg-bg-subtle/80 border border-border-default space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-text-primary">
              <Scale className="w-4 h-4 text-brand-primary" />
              <span>Üzerinde Düşünmeye Değer Denge Noktaları</span>
            </div>
            <div className="space-y-2">
              {profile.tensions.slice(0, 2).map((ten) => (
                <div key={ten.id} className="p-3 rounded-xl bg-surface-1 border border-border-subtle space-y-1">
                  <div className="text-xs font-bold text-text-primary">{ten.titleTr}</div>
                  <p className="text-[11px] text-text-secondary leading-relaxed">
                    {ten.descriptionTr}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="text-[11px] text-text-tertiary pt-2 border-t border-border-subtle">
        {SCALE_POSITION_EXPLANATION_NOTE}
      </div>
    </div>
  );
};
