'use client';

import React, { useState } from 'react';
import { ShieldCheck, ChevronDown, ChevronUp, Info, Database, Layers, CheckCircle2 } from 'lucide-react';
import { UnifiedPsychologicalProfileV2 } from '@/types/unifiedProfileV2';

interface ScientificDetailPanelV2Props {
  profile: UnifiedPsychologicalProfileV2;
}

export const ScientificDetailPanelV2: React.FC<ScientificDetailPanelV2Props> = ({ profile }) => {
  const [showTechnicalDrawer, setShowTechnicalDrawer] = useState(false);
  const { coverage, responseQuality, confidenceMap } = profile;

  // Human Turkish explanations for consumers
  const qualityExplanation = responseQuality.overallFlag === 'EXCELLENT'
    ? 'Yanıt örüntüleriniz yüksek dikkat, tutarlılık ve güvenilirlik standartlarını karşılamaktadır.'
    : responseQuality.overallFlag === 'ACCEPTABLE'
    ? 'Yanıt kalitesi genel analizler için yeterli tutarlılık düzeyindedir.'
    : 'Bazı oturumlardaki hız veya yanıt örüntüleri nedeniyle sonuçları daha temkinli yorumlamak önerilir.';

  const repeatMeasurementText = profile.longitudinalReadiness.hasRepeatMeasurements
    ? 'Bazı alanlarda farklı zamanlarda tekrarlanan ölçüm verisi kaydedilmiştir.'
    : 'Sonuçlar tek bir ölçüm dönemine aittir; henüz boylamsal tekrar verisi bulunmuyor.';

  const methodDiversityText = 'Sonuçlar standartlaştırılmış bilimsel öz-bildirim ölçeklerine dayanmaktadır.';

  const calibrationText = 'Henüz ulusal temsili referans popülasyon normları aktif değildir; puanlar yerel ölçek ortalamalarını gösterir.';

  return (
    <div
      id="section-science"
      className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Bilimsel Metodoloji ve Ölçüm Güvencesi
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Profilinin hangi bilimsel standartlara, veri kalitesine ve psikometrik sınırlılıklara dayandığını incele.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowTechnicalDrawer(!showTechnicalDrawer)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors self-start sm:self-auto shrink-0"
        >
          <span>{showTechnicalDrawer ? 'Teknik Ayrıntıları Gizle' : 'Teknik Ayrıntıları Göster'}</span>
          {showTechnicalDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Human Consumer Layer: 6 Dimension Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Dimension 1: Model Kapsamı */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1.5">
          <div className="text-xs font-bold text-slate-900 dark:text-white">Model Kapsamı</div>
          <div className="text-base font-bold text-indigo-600 dark:text-indigo-400">
            {coverage.facetCoverage.measuredCount} / {coverage.facetCoverage.totalCount} alt boyut
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            11 psikolojik alanın %{coverage.domainCoverage.percentage}&apos;i haritalandırıldı.
          </p>
        </div>

        {/* Dimension 2: Yanıt Kalitesi */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1.5">
          <div className="text-xs font-bold text-slate-900 dark:text-white">Yanıt Kalitesi & Bütünlük</div>
          <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">
            Yüksek Güvenilirlik
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            {qualityExplanation}
          </p>
        </div>

        {/* Dimension 3: Madde Kapsamı */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1.5">
          <div className="text-xs font-bold text-slate-900 dark:text-white">Madde Kapsamı</div>
          <div className="text-base font-bold text-slate-900 dark:text-white">
            {coverage.questionCoverage.answeredCount} / {coverage.questionCoverage.totalCount} soru
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Toplam soru bankasının %{coverage.questionCoverage.percentage}&apos;i tamamlandı.
          </p>
        </div>

        {/* Dimension 4: Tekrar Ölçüm */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1.5">
          <div className="text-xs font-bold text-slate-900 dark:text-white">Tekrar Ölçüm Durumu</div>
          <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {profile.longitudinalReadiness.statusLabelTr}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            {repeatMeasurementText}
          </p>
        </div>

        {/* Dimension 5: Yöntem Çeşitliliği */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1.5">
          <div className="text-xs font-bold text-slate-900 dark:text-white">Yöntem Çeşitliliği</div>
          <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Psikometrik Öz-Bildirim
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            {methodDiversityText}
          </p>
        </div>

        {/* Dimension 6: Kalibrasyon */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1.5">
          <div className="text-xs font-bold text-slate-900 dark:text-white">Norm Kalibrasyonu</div>
          <div className="text-sm font-bold text-amber-600 dark:text-amber-400">
            Ön Kalibrasyon Aşaması
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            {calibrationText}
          </p>
        </div>
      </div>

      {/* Collapsible Technical Drawer: ONLY here do raw enums / statuses appear */}
      {showTechnicalDrawer && (
        <div className="p-5 rounded-2xl bg-slate-950 text-slate-300 font-mono text-xs space-y-3 border border-slate-800 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
            <span className="font-bold">TEKNİK TELEMETRİ VE MODEL DURUMU</span>
            <span>v{profile.profileVersion}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px]">
            <div>
              <span className="text-slate-500">model_version:</span> {profile.measurementModelVersion}
            </div>
            <div>
              <span className="text-slate-500">battery_version:</span> {profile.batteryVersion}
            </div>
            <div>
              <span className="text-slate-500">response_quality_flag:</span> {responseQuality.overallFlag}
            </div>
            <div>
              <span className="text-slate-500">calibration_status:</span> PRE_CALIBRATION
            </div>
            <div>
              <span className="text-slate-500">speed_violations:</span> {responseQuality.speedViolationsCount}
            </div>
            <div>
              <span className="text-slate-500">straightlining:</span> {String(responseQuality.straightliningDetected)}
            </div>
            <div>
              <span className="text-slate-500">inconsistency_count:</span> {responseQuality.inconsistencyViolationsCount}
            </div>
            <div>
              <span className="text-slate-500">total_audited_sessions:</span> {responseQuality.totalAssessmentsAudited}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
