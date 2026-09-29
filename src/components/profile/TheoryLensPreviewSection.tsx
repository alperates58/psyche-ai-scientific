'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight, Sparkles, ChevronRight } from 'lucide-react';
import { UnifiedPsychologicalProfileV2 } from '@/types/unifiedProfileV2';

interface TheoryLensPreviewSectionProps {
  profile: UnifiedPsychologicalProfileV2;
}

export const TheoryLensPreviewSection: React.FC<TheoryLensPreviewSectionProps> = ({ profile }) => {
  // 3 canonical lenses for preview
  const previewLenses = [
    {
      id: 'JUNG',
      theoristName: 'Carl Gustav Jung',
      traditionTr: 'Analitik Psikoloji & Arketipler',
      color: 'from-amber-950/40 to-slate-900',
      borderColor: 'border-amber-900/50',
      accentColor: 'text-amber-300',
      previewSynthesisTr: [
        'Jung merceğinden bakıldığında, profilinizdeki belirgin bilişsel merak ve özgün düşünme eğilimleri, içsel dünyanızdaki arketipsel bilgelik arayışı ve bireyleşme (individuation) süreciyle güçlü bir paralellik taşır.',
        'Sosyal cesaretiniz ile içsel düşünme derinliğiniz arasındaki denge, Persona (sosyal maske) ile Gölge (bastırılmış potansiyel) arasındaki uyumlu bütünleşme kapasitenizi simgeler.'
      ],
      coreConceptNameTr: 'Bireyleşme ve Persona Uyumu',
    },
    {
      id: 'ROGERS',
      theoristName: 'Carl Rogers',
      traditionTr: 'İnsancıl & Danışan Merkezli',
      color: 'from-indigo-950/40 to-slate-900',
      borderColor: 'border-indigo-900/50',
      accentColor: 'text-indigo-300',
      previewSynthesisTr: [
        'Rogers’ın insancıl yaklaşımı açısından incelendiğinde, ölçülen içtenlik ve dürüstlük düzeyiniz, gerçek benliğiniz (real self) ile günlük deneyimleriniz arasındaki yüksek uyumu (congruence) açıkça ortaya koymaktadır.',
        'Kendinizi dışsal onay baskılarından bağımsız kılabilme eğiliminiz, koşulsuz öz-kabul ve kendini gerçekleştirme yolculuğunuzun temel dayanak noktasıdır.'
      ],
      coreConceptNameTr: 'Benlik Uyumu (Congruence)',
    },
    {
      id: 'BECK',
      theoristName: 'Aaron T. Beck',
      traditionTr: 'Bilişsel Davranışçı Model',
      color: 'from-blue-950/40 to-slate-900',
      borderColor: 'border-blue-900/50',
      accentColor: 'text-blue-300',
      previewSynthesisTr: [
        'Beck’in bilişsel modeli açısından, karar alma süreçlerinizde gözlenen analitik temkin ve bilişsel yeniden değerlendirme eğilimi, zihninizin otomatik düşünceleri nesnel kanıtlarla test edebildiğini gösterir.',
        'Mükemmeliyetçilik eğiliminizin getirdiği yüksek standartları esnek bilişsel şemalarla yönetebilmek, performansınızı kaygıya dönüştürmeden korumanızı sağlar.'
      ],
      coreConceptNameTr: 'Bilişsel Şemalar ve Yeniden Değerlendirme',
    },
  ];

  return (
    <div
      id="section-theory-council"
      className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-indigo-900/50 text-white shadow-xl space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-900/40 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Kuramlar Konseyi Entegrasyonu</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Profiline Kuramsal Bakış
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Ölçülen ampirik profilini psikoloji tarihinin 10 büyük düşünürünün kavramsal merceğinden keşfet.
          </p>
        </div>

        <Link
          href="/theory-council"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white border border-white/20 transition-all self-start sm:self-auto shrink-0"
        >
          <span>Tüm 10 Merceği Gör</span>
          <ChevronRight className="w-4 h-4 text-indigo-400" />
        </Link>
      </div>

      {/* 3 Lens Preview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {previewLenses.map((lens) => (
          <div
            key={lens.id}
            className={`rounded-2xl p-5 bg-gradient-to-b ${lens.color} border ${lens.borderColor} flex flex-col justify-between space-y-4 shadow-lg hover:border-indigo-400/50 transition-all`}
          >
            <div className="space-y-3">
              <div>
                <span className={`text-[11px] font-bold ${lens.accentColor} uppercase tracking-wider block`}>
                  {lens.traditionTr}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {lens.theoristName}
                </h3>
                <div className="text-[11px] text-slate-400 font-medium">
                  Odak: {lens.coreConceptNameTr}
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-200 leading-relaxed">
                {lens.previewSynthesisTr.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Ölçülen kanıtlara dayalı</span>
              <Link
                href={`/theory-council/${lens.id.toLowerCase()}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-white hover:text-indigo-300 transition-colors"
              >
                <span>Derin İnceleme</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
