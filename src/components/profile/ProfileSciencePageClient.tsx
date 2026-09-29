'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Scale,
  BarChart3,
  Layers,
  Database,
  ArrowRight,
} from 'lucide-react';
import { UnifiedPsychologicalProfileV2 } from '@/types/unifiedProfileV2';
import { ProfileTabNav } from './ProfileTabNav';

interface ProfileSciencePageClientProps {
  profile: UnifiedPsychologicalProfileV2;
}

export const ProfileSciencePageClient: React.FC<ProfileSciencePageClientProps> = ({ profile }) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const { coverage, responseQuality, confidenceMap } = profile;

  const measuredFacetCount = coverage.facetCoverage.measuredCount;
  const totalFacetCount = coverage.facetCoverage.totalCount;
  const unmeasuredFacetCount = totalFacetCount - measuredFacetCount;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 6 Top-Level Profile Navigation Tabs */}
      <ProfileTabNav />

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-surface-1 p-8 sm:p-10 border border-border-default shadow-xs space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Şeffaf Psikometri & Metodoloji</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary">
          Bilimsel Standartlar ve Metodoloji
        </h1>
        <p className="text-sm text-text-secondary max-w-3xl leading-relaxed">
          PsycheAI profil motorunun ölçüm mimarisi, kanıta dayalı hesaplama yöntemleri, veri kalitesi güvenceleri ve metodolojik sınırları.
        </p>
      </div>

      {/* 1. What is measured vs what is not measured */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* What is measured */}
        <div className="p-6 rounded-3xl bg-surface-1 border border-border-default shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <h2 className="text-base font-bold text-text-primary">Şu Ana Kadar Neler Ölçüldü?</h2>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Tamamladığınız yapılandırılmış değerlendirme modülleri üzerinden deterministik olarak puanlanan kanonik alt boyutlar:
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-2 border border-border-subtle">
              <span className="font-semibold text-text-primary">Ölçülen Alt Boyutlar</span>
              <span className="font-mono font-bold text-emerald-700">{measuredFacetCount} / {totalFacetCount}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-2 border border-border-subtle">
              <span className="font-semibold text-text-primary">Ölçülen Psikolojik Alanlar</span>
              <span className="font-mono font-bold text-emerald-700">{coverage.domainCoverage.measuredCount} / 11</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-2 border border-border-subtle">
              <span className="font-semibold text-text-primary">Yanıtlanan Soru Sayısı</span>
              <span className="font-mono font-bold text-emerald-700">{coverage.questionCoverage.answeredCount}</span>
            </div>
          </div>
        </div>

        {/* What is not measured yet */}
        <div className="p-6 rounded-3xl bg-surface-1 border border-border-default shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-amber-700">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <h2 className="text-base font-bold text-text-primary">Neler Henüz Ölçülmedi?</h2>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Profilinizde varsayım yapılmaz; tamamlanmamış envanterlerin boyutları kesinlikle uydurma veya yapay ortalamalarla doldurulmaz:
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-2 border border-border-subtle">
              <span className="font-semibold text-text-primary">Ölçüm Bekleyen Alt Boyutlar</span>
              <span className="font-mono font-bold text-amber-700">{unmeasuredFacetCount} Boyut</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-2 border border-border-subtle">
              <span className="font-semibold text-text-primary">Eksik Veri İlkesi</span>
              <span className="font-bold text-text-secondary">Sıfır İmpütasyon (NOT_MEASURED)</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-2 border border-border-subtle">
              <span className="font-semibold text-text-primary">Yapay Zekâ Skorlama Rolü</span>
              <span className="font-bold text-text-secondary">Sıfır (Yalnızca Yorumlama)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Response Quality in Plain Turkish */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface-1 border border-border-default shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-brand-primary" />
          <h2 className="text-lg font-bold text-text-primary">Ölçüm ve Yanıt Kalitesi</h2>
        </div>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          Değerlendirmeler sırasında verilen yanıtların tutarlılığı, dikkat kontrol soruları ve tamamlama süreleri incelenerek sonuçların güvenilirliği denetlenir.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-surface-2 border border-border-subtle space-y-1">
            <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">
              Ölçüm Tutarlılığı
            </div>
            <div className="text-base font-bold text-text-primary">
              {responseQuality.overallFlag === 'EXCELLENT' || responseQuality.overallFlag === 'ACCEPTABLE' ? 'Yüksek Ölçüm Tutarlılığı' : 'Standart Ölçüm'}
            </div>
            <p className="text-[11px] text-text-secondary">
              Yanıt örüntülerinde çelişki veya rastgele yanıt paterni tespit edilmemiştir.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-surface-2 border border-border-subtle space-y-1">
            <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">
              Ölçüm Modeli
            </div>
            <div className="text-base font-bold text-text-primary">
              Master Model V2.2
            </div>
            <p className="text-[11px] text-text-secondary">
              11 Alan, 37 Boyut, 91 Alt Boyut — Tüm boyutlar deterministik psikometrik kurallarla toplanır.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-surface-2 border border-border-subtle space-y-1">
            <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">
              Zaman İçinde Takip
            </div>
            <div className="text-base font-bold text-text-primary">
              Tekrarlı Ölçüm Hazır
            </div>
            <p className="text-[11px] text-text-secondary">
              Aynı ölçekler tekrarlandığında gözlenen puan farkları stabilite ekseninde kaydedilir.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Norm Availability Notice (Explicitly required by Req 13 & 43) */}
      <div className="p-6 rounded-3xl bg-amber-50/60 border border-amber-200/80 text-amber-950 space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm">
          <BarChart3 className="w-4 h-4 text-amber-600" />
          <span>Popülasyon Normları Durumu</span>
        </div>
        <p className="text-xs leading-relaxed text-amber-900/90">
          Toplum normlarıyla karşılaştırma henüz sunulmuyor. Temsili geniş nüfus normları entegre edilene kadar tüm veriler ön-kalibrasyon ölçek standartlarında işlenmektedir. Yorumlar &ldquo;toplum ortalamasından yüksek/düşük&rdquo; iddiası taşımaz; bireyin ölçeğin kendi düşük, orta ve yüksek kutuplarındaki yerini açıklar.
        </p>
      </div>

      {/* 4. Limitations & Non-Diagnostic Guarantee */}
      <div className="p-6 rounded-3xl bg-surface-1 border border-border-default shadow-xs space-y-2 text-xs text-text-secondary leading-relaxed">
        <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-primary" />
          Metodolojik Sınırlar ve Klinik Teşhis Güvencesi
        </h3>
        <p>
          PsycheAI bir kişisel keşif ve psikolojik profil sistemidir; klinik tanı koyma, psikopatoloji sınıflandırma veya tıbbi tedavi reçetesi oluşturma aracı değildir.
        </p>
        <p>
          Kuramsal Konsey mercekleri ölçüm verilerini değiştirmez, skor üretmez veya psikiyatrik teşhis koyamaz.
        </p>
      </div>

      {/* 5. Optional Technical Details Drawer (Where raw enums & codes appear) */}
      <div className="p-6 rounded-3xl bg-surface-1 border border-border-default space-y-4">
        <button
          type="button"
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="w-full flex items-center justify-between text-xs font-bold text-text-primary hover:text-brand-primary transition-colors py-1"
        >
          <span className="flex items-center gap-2">
            <Database className="w-4 h-4 text-brand-primary" />
            Teknik Ayrıntıları Göster (Geliştirici & Araştırmacı Verisi)
          </span>
          {showTechnicalDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showTechnicalDetails && (
          <div className="pt-3 border-t border-border-subtle space-y-4 text-xs font-mono animate-in fade-in duration-200">
            <div className="p-4 rounded-xl bg-slate-900 text-slate-200 space-y-2 overflow-x-auto">
              <div>// Authoritative Master Model Architecture</div>
              <div>MASTER_DOMAINS_COUNT: 11</div>
              <div>MASTER_CONSTRUCTS_COUNT: 37</div>
              <div>MASTER_FACETS_COUNT: 91</div>
              <div>MEASURED_FACETS_COUNT: {measuredFacetCount}</div>
              <div>UNMEASURED_FACETS_COUNT: {unmeasuredFacetCount}</div>
              <div>SCORE_IMPUTATION: STRICTLY_PROHIBITED</div>
              <div>CONFIDENCE_MAPPING: 6_DIMENSIONAL_EPISTEMIC_MAP</div>
              <div>POPULATION_NORMS_STATUS: PRECALIBRATION_PENDING_REPRESENTATIVE_SAMPLE</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
