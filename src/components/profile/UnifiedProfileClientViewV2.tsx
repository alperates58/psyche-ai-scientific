'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UnifiedPsychologicalProfileV2 } from '@/types/unifiedProfileV2';
import { UnifiedProfileAISectionData } from '@/types/aiInsightV2';
import { ProfileEvidenceBundleV2 } from '@/lib/profile/profileEvidenceBundle';
import { ProfileOverviewCardV2 } from './ProfileOverviewCardV2';
import { ProfileSummarySection } from './ProfileSummarySection';
import { ProfileFingerprint } from './ProfileFingerprint';
import { DomainWheel } from './DomainWheel';
import { ProfileHeatmapV2 } from './ProfileHeatmapV2';
import { ConstructMatrixV2 } from './ConstructMatrixV2';
import { FacetExplorerV2 } from './FacetExplorerV2';
import { TensionsSynergiesViewV2 } from './TensionsSynergiesViewV2';
import { ProfileCoverageViewV2 } from './ProfileCoverageViewV2';
import { UnifiedProfileAISectionV2 } from './ai/UnifiedProfileAISectionV2';
import {
  Sparkles,
  Compass,
  Brain,
  Zap,
  Heart,
  Lightbulb,
  Target,
  Users,
  Smile,
  Scale,
  ShieldCheck,
  Grid,
  Clock,
  PenLine,
  BookOpen,
  ChevronRight,
  Info,
  Layers,
} from 'lucide-react';

export type ProfileSectionId =
  | 'summary'
  | 'map'
  | 'personality'
  | 'self_system'
  | 'emotion'
  | 'cognition'
  | 'motivation'
  | 'relationships'
  | 'wellbeing'
  | 'synergies'
  | 'tensions'
  | 'facet_explorer'
  | 'timeline'
  | 'reflections'
  | 'scientific_detail';

interface UnifiedProfileClientViewV2Props {
  profile: UnifiedPsychologicalProfileV2;
  aiSectionData?: UnifiedProfileAISectionData;
  evidenceBundle?: ProfileEvidenceBundleV2;
}

interface SectionNavConfig {
  id: ProfileSectionId;
  number: number;
  labelTr: string;
  icon: React.ComponentType<{ className?: string }>;
  descriptionTr: string;
}

const PROFILE_SECTIONS: SectionNavConfig[] = [
  { id: 'summary', number: 1, labelTr: 'Profil Özeti', icon: Sparkles, descriptionTr: 'Öne çıkan eğilim ve kimlik sentezi' },
  { id: 'map', number: 2, labelTr: 'Psikolojik Haritam', icon: Compass, descriptionTr: 'Psikolojik imza ve 11 alan çarkı' },
  { id: 'personality', number: 3, labelTr: 'Kişilik & Mizaç', icon: Brain, descriptionTr: 'HEXACO 6 eksen ve 24 alt boyut' },
  { id: 'self_system', number: 4, labelTr: 'Benlik & Öz-Düzenleme', icon: Zap, descriptionTr: 'Öz-saygı, irade ve odaklanma' },
  { id: 'emotion', number: 5, labelTr: 'Duygular & Dayanıklılık', icon: Heart, descriptionTr: 'Duygu düzenleme ve farkındalık' },
  { id: 'cognition', number: 6, labelTr: 'Biliş & Karar Verme', icon: Lightbulb, descriptionTr: 'Düşünme tarzı ve zihinsel esneklik' },
  { id: 'motivation', number: 7, labelTr: 'Motivasyon & Değerler', icon: Target, descriptionTr: 'İçsel motivasyon ve yaşam amaçları' },
  { id: 'relationships', number: 8, labelTr: 'İlişkiler & Sosyal', icon: Users, descriptionTr: 'Sosyal iletişim ve ilişki dinamikleri' },
  { id: 'wellbeing', number: 9, labelTr: 'İyi Oluş & Başa Çıkma', icon: Smile, descriptionTr: 'Psikolojik sağlamlık ve yaşam tatmini' },
  { id: 'synergies', number: 10, labelTr: 'Güçlü Kombinasyonlarım', icon: Layers, descriptionTr: 'Birbirini besleyen özellikler' },
  { id: 'tensions', number: 11, labelTr: 'Gerilimler & Denge', icon: Scale, descriptionTr: 'İçsel dengeler ve dikkat alanları' },
  { id: 'facet_explorer', number: 12, labelTr: '91 Alt Boyut Analizi', icon: Grid, descriptionTr: 'Tüm boyutların ayrıntılı kataloğu' },
  { id: 'timeline', number: 13, labelTr: 'Zaman İçinde Ben', icon: Clock, descriptionTr: 'Boylamsal değişim ve gelişim izleri' },
  { id: 'reflections', number: 14, labelTr: 'Yansımalarım', icon: PenLine, descriptionTr: 'Günlük ve bağlamsal gözlemler' },
  { id: 'scientific_detail', number: 15, labelTr: 'Bilimsel Detay', icon: ShieldCheck, descriptionTr: 'Ölçüm kalitesi ve metodoloji' },
];

export const UnifiedProfileClientViewV2: React.FC<UnifiedProfileClientViewV2Props> = ({
  profile,
  aiSectionData,
  evidenceBundle,
}) => {
  const [activeSection, setActiveSection] = useState<ProfileSectionId>('summary');
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);

  const getDomainFiltered = (domainIds: string[]) => {
    return profile.domains.filter((d) => domainIds.includes(d.domainId));
  };

  const handleDomainWheelSelect = (domainId: string) => {
    setSelectedDomainId(domainId);
    if (domainId === 'core_personality') setActiveSection('personality');
    else if (domainId === 'self_system' || domainId === 'self_regulation') setActiveSection('self_system');
    else if (domainId === 'emotion_regulation') setActiveSection('emotion');
    else if (domainId === 'cognition_decision' || domainId === 'creativity_curiosity') setActiveSection('cognition');
    else if (domainId === 'motivation_values') setActiveSection('motivation');
    else if (domainId === 'social_relational' || domainId === 'optional_dark_tetrad') setActiveSection('relationships');
    else if (domainId === 'coping_resilience' || domainId === 'wellbeing_vitality') setActiveSection('wellbeing');
    else setActiveSection('facet_explorer');
  };

  // Convert measured constructs/facets to fingerprint coordinates
  const fingerprintCoordinates = profile.facets
    .filter((f) => f.measurementStatus === 'MEASURED_PRECALIBRATION' && f.score !== null)
    .map((f) => ({
      id: f.facetId,
      nameTr: f.nameTr,
      domainId: f.domainId,
      domainNameTr: f.domainNameTr,
      normalizedScore: f.normalizedVisualCoordinate ?? 50,
      rawScore: f.score,
      scaleMin: 1.0,
      scaleMax: 5.0,
    }));

  return (
    <div className="space-y-8">
      {/* Top Profile Hero Card */}
      <ProfileOverviewCardV2 profile={profile} />

      {/* Main Layout: Desktop 15-Section Navigation Index + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Desktop 15-Section Navigation Sidebar (4 Columns) */}
        <div className="hidden lg:block lg:col-span-4 sticky top-20 space-y-3 bg-surface-1 p-4 rounded-3xl border border-border-default shadow-xs max-h-[calc(100vh-6rem)] overflow-y-auto">
          <div className="px-3 py-2 border-b border-border-subtle">
            <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-wider">
              15 Bölümlük Psikolojik Profil
            </h3>
          </div>

          <nav className="space-y-1">
            {PROFILE_SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;

              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => {
                    setActiveSection(sec.id);
                    setSelectedDomainId(null);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl transition-all duration-150 flex items-center justify-between group ${
                    isActive
                      ? 'bg-brand-primary text-white shadow-xs font-bold'
                      : 'hover:bg-bg-subtle text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span
                      className={`text-[11px] font-mono w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                        isActive
                          ? 'bg-white/20 text-white font-bold'
                          : 'bg-surface-2 text-text-tertiary group-hover:text-text-primary'
                      }`}
                    >
                      {sec.number}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs truncate">{sec.labelTr}</div>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                      isActive ? 'text-white' : 'text-text-tertiary group-hover:translate-x-0.5'
                    }`}
                  />
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile Horizontal Section Selector (< lg) */}
        <div className="lg:hidden col-span-1 border-b border-border-subtle pb-3 sticky top-16 z-20 bg-bg-app/95 backdrop-blur-md pt-2">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
            {PROFILE_SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;

              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => {
                    setActiveSection(sec.id);
                    setSelectedDomainId(null);
                  }}
                  className={`px-3 py-2 rounded-xl font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? 'bg-brand-primary text-white shadow-xs'
                      : 'bg-surface-1 text-text-secondary border border-border-default hover:bg-bg-subtle'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{sec.number}. {sec.labelTr}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Section View Surface (8 Columns) */}
        <div className="lg:col-span-8 space-y-8 min-w-0">
          {/* SECTION 1: PROFIL ÖZETİ */}
          {activeSection === 'summary' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {aiSectionData && evidenceBundle && (
                <UnifiedProfileAISectionV2
                  data={aiSectionData}
                  bundle={evidenceBundle}
                />
              )}

              {/* Theory Council CTA Banner */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-indigo-900/50">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-semibold">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Kuramlar Konseyi</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Profilinizi 10 Büyük Psikoloji Merceğinden İnceleyin
                  </h3>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    Deterministik Master Model ile ölçülen profilinizi Freud, Jung, Adler, Rogers, Maslow, Skinner, William James, Gestalt, Frankl ve Beck kavramlarıyla keşfedin.
                  </p>
                </div>
                <Link
                  href="/theory-council"
                  className="shrink-0 px-6 py-3 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <span>Konseyi İncele</span>
                  <ChevronRight className="w-4 h-4 text-indigo-600" />
                </Link>
              </div>

              <ProfileSummarySection profile={profile} />
            </div>
          )}

          {/* SECTION 2: PSİKOLOJİK HARİTAM */}
          {activeSection === 'map' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <ProfileFingerprint
                coordinates={fingerprintCoordinates}
                summaryText="11 ampirik araştırma alanındaki ölçülen boyutlarınızın polar görsel imzası."
              />
              <DomainWheel
                domains={profile.domains}
                selectedDomainId={selectedDomainId}
                onSelectDomain={handleDomainWheelSelect}
              />
              <ProfileHeatmapV2 domains={profile.domains} />
            </div>
          )}

          {/* SECTION 3: KİŞİLİK & MİZAÇ (HEXACO) */}
          {activeSection === 'personality' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <ConstructMatrixV2
                domains={getDomainFiltered(['core_personality'])}
                selectedDomainId="core_personality"
              />
              <FacetExplorerV2
                facets={profile.facets.filter((f) => f.domainId === 'core_personality')}
                domains={getDomainFiltered(['core_personality'])}
              />
            </div>
          )}

          {/* SECTION 4: BENLİK & ÖZ-DÜZENLEME */}
          {activeSection === 'self_system' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <ConstructMatrixV2
                domains={getDomainFiltered(['self_system', 'self_regulation'])}
                selectedDomainId={null}
              />
              <FacetExplorerV2
                facets={profile.facets.filter(
                  (f) => f.domainId === 'self_system' || f.domainId === 'self_regulation'
                )}
                domains={getDomainFiltered(['self_system', 'self_regulation'])}
              />
            </div>
          )}

          {/* SECTION 5: DUYGULAR & DAYANIKLILIK */}
          {activeSection === 'emotion' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <ConstructMatrixV2
                domains={getDomainFiltered(['emotion_regulation'])}
                selectedDomainId="emotion_regulation"
              />
              <FacetExplorerV2
                facets={profile.facets.filter((f) => f.domainId === 'emotion_regulation')}
                domains={getDomainFiltered(['emotion_regulation'])}
              />
            </div>
          )}

          {/* SECTION 6: BİLİŞ & KARAR VERME */}
          {activeSection === 'cognition' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <ConstructMatrixV2
                domains={getDomainFiltered(['cognition_decision', 'creativity_curiosity'])}
                selectedDomainId={null}
              />
              <FacetExplorerV2
                facets={profile.facets.filter(
                  (f) => f.domainId === 'cognition_decision' || f.domainId === 'creativity_curiosity'
                )}
                domains={getDomainFiltered(['cognition_decision', 'creativity_curiosity'])}
              />
            </div>
          )}

          {/* SECTION 7: MOTİVASYON & DEĞERLER */}
          {activeSection === 'motivation' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <ConstructMatrixV2
                domains={getDomainFiltered(['motivation_values'])}
                selectedDomainId="motivation_values"
              />
              <FacetExplorerV2
                facets={profile.facets.filter((f) => f.domainId === 'motivation_values')}
                domains={getDomainFiltered(['motivation_values'])}
              />
            </div>
          )}

          {/* SECTION 8: İLİŞKİLER & SOSYAL */}
          {activeSection === 'relationships' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <ConstructMatrixV2
                domains={getDomainFiltered(['social_relational', 'optional_dark_tetrad'])}
                selectedDomainId={null}
              />
              <FacetExplorerV2
                facets={profile.facets.filter(
                  (f) => f.domainId === 'social_relational' || f.domainId === 'optional_dark_tetrad'
                )}
                domains={getDomainFiltered(['social_relational', 'optional_dark_tetrad'])}
              />
            </div>
          )}

          {/* SECTION 9: İYİ OLUŞ & BAŞA ÇIKMA */}
          {activeSection === 'wellbeing' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <ConstructMatrixV2
                domains={getDomainFiltered(['coping_resilience', 'wellbeing_vitality'])}
                selectedDomainId={null}
              />
              <FacetExplorerV2
                facets={profile.facets.filter(
                  (f) => f.domainId === 'coping_resilience' || f.domainId === 'wellbeing_vitality'
                )}
                domains={getDomainFiltered(['coping_resilience', 'wellbeing_vitality'])}
              />
            </div>
          )}

          {/* SECTION 10: GÜÇLÜ KOMBİNASYONLARIM (SYNERGIES) */}
          {activeSection === 'synergies' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="bg-surface-1 p-6 sm:p-8 rounded-3xl border border-border-default shadow-xs space-y-4">
                <div className="flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-brand-primary" />
                  <h3 className="text-lg font-bold text-text-primary">
                    İçsel Sinerjiler ve Güçlü Kombinasyonlar
                  </h3>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Farklı ampirik psikoloji boyutlarının bir araya gelerek birbirini desteklediği özellik kombinasyonları.
                </p>

                {profile.synergies && profile.synergies.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 pt-2">
                    {profile.synergies.map((syn) => (
                      <div key={syn.id} className="p-5 rounded-2xl bg-bg-subtle border border-border-subtle space-y-2">
                        <div className="text-sm font-bold text-brand-primary">{syn.titleTr}</div>
                        <p className="text-xs text-text-secondary leading-relaxed">{syn.descriptionTr}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-bg-subtle text-center text-xs text-text-tertiary">
                    Yeterli değerlendirme tamamlandıkça aktif sinerjileriniz burada listelenir.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION 11: GERİLİMLER & DENGE NOKTALARI */}
          {activeSection === 'tensions' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <TensionsSynergiesViewV2
                tensions={profile.tensions}
                synergies={profile.synergies}
                crossDomainPatterns={profile.crossDomainPatterns}
              />
            </div>
          )}

          {/* SECTION 12: 91 ALT BOYUT ANALİZİ */}
          {activeSection === 'facet_explorer' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <FacetExplorerV2 facets={profile.facets} domains={profile.domains} />
            </div>
          )}

          {/* SECTION 13: ZAMAN İÇİNDE BEN (TIMELINE) */}
          {activeSection === 'timeline' && (
            <div className="space-y-6 animate-in fade-in duration-200 bg-surface-1 p-6 sm:p-8 rounded-3xl border border-border-default shadow-xs">
              <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-brand-primary" />
                    <h3 className="text-lg font-bold text-text-primary">Zaman İçinde Ben</h3>
                  </div>
                  <p className="text-xs text-text-secondary">
                    Tekrarlayan değerlendirmeler ve boylamsal ölçüm izleri.
                  </p>
                </div>
                <Link
                  href="/profile/timeline"
                  className="px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-bold transition-all shadow-xs"
                >
                  Tam Zaman Çizelgesini Aç
                </Link>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                PsycheAI, tekrarlayan ölçümler arasındaki değişimleri nedensel iddialar üretmeden betimler.
                Zaman içindeki farklılaşmaları takip etmek için değerlendirmeleri belirli aralıklarla tekrar edebilirsiniz.
              </p>
            </div>
          )}

          {/* SECTION 14: YANSIMALARIM (JOURNAL) */}
          {activeSection === 'reflections' && (
            <div className="space-y-6 animate-in fade-in duration-200 bg-surface-1 p-6 sm:p-8 rounded-3xl border border-border-default shadow-xs">
              <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <PenLine className="w-5 h-5 text-brand-primary" />
                    <h3 className="text-lg font-bold text-text-primary">Yansımalarım & Günlük</h3>
                  </div>
                  <p className="text-xs text-text-secondary">
                    Günlük bağlamları ve öz-bildirim gözlemleri.
                  </p>
                </div>
                <Link
                  href="/journal"
                  className="px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-bold transition-all shadow-xs"
                >
                  Günlüğe Git
                </Link>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Günlük kayıtları psikometrik ölçüm yerine geçmez; öz-farkındalığınızı zenginleştiren bağlamsal yansımalardır.
              </p>
            </div>
          )}

          {/* SECTION 15: BİLİMSEL DETAY */}
          {activeSection === 'scientific_detail' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <ProfileCoverageViewV2
                coverage={profile.coverage}
                confidenceMap={profile.confidenceMap}
                responseQuality={profile.responseQuality}
                longitudinalReadiness={profile.longitudinalReadiness}
                recentAssessments={profile.recentAssessments}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
