'use client';

import React from 'react';
import {
  ProfileCoverageV2,
  ConfidenceMapV2,
  ResponseQualityV2,
  LongitudinalReadinessV2,
  RecentAssessmentProvenanceV2,
} from '@/types/unifiedProfileV2';
import {
  ShieldCheck,
  Compass,
  CheckCircle2,
  Clock,
  History,
  Info,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

interface ProfileCoverageViewV2Props {
  coverage: ProfileCoverageV2;
  confidenceMap: ConfidenceMapV2;
  responseQuality: ResponseQualityV2;
  longitudinalReadiness: LongitudinalReadinessV2;
  recentAssessments: RecentAssessmentProvenanceV2[];
}

export const ProfileCoverageViewV2: React.FC<ProfileCoverageViewV2Props> = ({
  coverage,
  confidenceMap,
  responseQuality,
  longitudinalReadiness,
  recentAssessments,
}) => {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          Ölçüm Kapsamı ve Epistemik Güvenilirlik Haritası
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Ölçülen verinin sınırlarını, telemetri kalitesini ve bilimsel kesinlik düzeyini şeffaf olarak gösterir.
        </p>
      </div>

      {/* 6 Independent Confidence Components */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-500" />
          Bağımsız Epistemik Bileşenler (Tekil Yüzdeye İndirgenmez)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Component 1: Measurement Coverage */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              1. Model Kapsamı
            </div>
            <div className="text-base font-bold text-indigo-700 dark:text-indigo-300">
              {confidenceMap.measurementCoverage}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              {coverage.facetCoverage.measuredCount} / {coverage.facetCoverage.totalCount} Alt Boyut (%{coverage.facetCoverage.percentage})
            </div>
          </div>

          {/* Component 2: Response Quality */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              2. Yanıt Kalitesi
            </div>
            <div className="text-base font-bold text-emerald-700 dark:text-emerald-300">
              {confidenceMap.responseQuality}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              {responseQuality.speedViolationsCount} hız aşımı, {responseQuality.straightliningDetected ? 'Düz çizgi var' : 'Temiz telemetri'}
            </div>
          </div>

          {/* Component 3: Item Completion */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              3. Madde Tamlığı
            </div>
            <div className="text-base font-bold text-sky-700 dark:text-sky-300">
              {confidenceMap.itemCompletion}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              {coverage.questionCoverage.answeredCount} / {coverage.questionCoverage.totalCount} Madde Cevaplandı
            </div>
          </div>

          {/* Component 4: Repeat Measurement */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              4. Tekrar Ölçüm
            </div>
            <div className="text-base font-bold text-amber-700 dark:text-amber-300">
              {confidenceMap.repeatMeasurement}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              {longitudinalReadiness.statusLabelTr}
            </div>
          </div>

          {/* Component 5: Method Diversity */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              5. Yöntem Çeşitliliği
            </div>
            <div className="text-base font-bold text-purple-700 dark:text-purple-300">
              {confidenceMap.methodDiversity}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Standartlaştırılmış öz-bildirim araştırma bataryası
            </div>
          </div>

          {/* Component 6: Calibration Status */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              6. Kalibrasyon Durumu
            </div>
            <div className="text-base font-bold text-slate-800 dark:text-slate-200">
              {confidenceMap.calibrationStatus}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Norm çalışması devam etmektedir (Nüfus yüzdeliği hariç)
            </div>
          </div>
        </div>
      </div>

      {/* Completed Sessions Timeline */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-500" />
          Tamamlanan Değerlendirme Oturumları ({recentAssessments.length})
        </h3>

        {recentAssessments.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentAssessments.map((session) => (
              <div
                key={session.sessionId}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {session.moduleTitleTr}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Modül Kodu: {session.moduleCode} | Form: {session.formVersionCode}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    {new Date(session.completedAt).toLocaleDateString('tr-TR')}
                  </span>
                  <span className="px-2 py-0.5 rounded-md font-semibold text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                    Bütünlük: {session.integrityFlag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Henüz tamamlanmış oturum bulunmuyor.
          </p>
        )}
      </div>
    </div>
  );
};
