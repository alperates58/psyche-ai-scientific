import React from 'react';
import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { getCurrentUserOrNull } from '@/lib/auth';
import { getAssessmentResultView } from '@/services/assessmentResultService';
import { PageContainer } from '@/components/ui/PageContainer';
import { ResultSummaryHero } from '@/components/results/ResultSummaryHero';
import { HexacoRadarSection } from '@/components/results/HexacoRadarSection';
import { HexacoFacetProfile } from '@/components/results/HexacoFacetProfile';
import { TraitHeatmapSection } from '@/components/results/TraitHeatmapSection';
import { DimensionSpectrumView } from '@/components/results/DimensionSpectrumView';
import { StrengthsRisksPanel } from '@/components/results/StrengthsRisksPanel';
import { TensionsSynergiesPanel } from '@/components/results/TensionsSynergiesPanel';
import { ResponseQualityPanel } from '@/components/results/ResponseQualityPanel';
import { MeasurementCoveragePanel } from '@/components/results/MeasurementCoveragePanel';
import { NextAssessmentHandoff } from '@/components/results/NextAssessmentHandoff';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AssessmentResultPage({
  params,
}: {
  params: Promise<{ sessionId: string }> | { sessionId: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const sessionId = resolvedParams.sessionId;

  const user = await getCurrentUserOrNull();
  if (!user) {
    redirect(`/login?callbackUrl=/assessments/results/${encodeURIComponent(sessionId)}`);
  }

  let resultData;
  try {
    resultData = await getAssessmentResultView(user.id, sessionId);
  } catch (err: any) {
    return (
      <PageContainer variant="standard" className="py-16 space-y-6">
        <div className="max-w-xl mx-auto bg-surface-1 p-8 rounded-panel border border-border-subtle shadow-sm text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-text-primary">Sonuç Görüntülenemedi</h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            {err.message || 'Değerlendirme sonucunuza erişirken bir hata oluştu.'}
          </p>
          <div className="pt-2">
            <Link
              href="/assessments"
              className="inline-flex items-center px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              <span>Değerlendirmeler Sayfasına Dön</span>
            </Link>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer variant="standard" className="space-y-8 pb-20">
      {/* 1. Hero & Key Observations */}
      <ResultSummaryHero result={resultData} />

      {/* 2. Visual Archetype Section */}
      {resultData.visualType === 'HEXACO_RADAR' ? (
        <>
          {/* HEXACO Radar for Core Personality */}
          <HexacoRadarSection
            radarData={resultData.radarData}
            totalDimensions={6}
          />

          {/* Deep Facet Breakdown */}
          <HexacoFacetProfile constructs={resultData.constructs} />

          {/* Measurement Heatmap & Unmeasured Matrix */}
          <TraitHeatmapSection
            constructs={resultData.constructs}
            unmeasuredDomains={resultData.unmeasuredDomains}
          />
        </>
      ) : (
        /* Dimension Spectrum / Trait Breakdown for other modules (RSES, GSE, etc.) */
        <DimensionSpectrumView
          constructs={resultData.constructs}
          moduleTitle={resultData.module.titleTr}
        />
      )}

      {/* 3. Strengths & Potential Overuse Areas */}
      {(resultData.strengths.length > 0 || resultData.growthAndRisks.length > 0) && (
        <StrengthsRisksPanel
          strengths={resultData.strengths}
          growthAndRisks={resultData.growthAndRisks}
        />
      )}

      {/* 4. Synergies & Tensions Dynamic Interactions (Only rendered if evidence-based dynamics exist) */}
      {resultData.dynamics && resultData.dynamics.length > 0 && (
        <TensionsSynergiesPanel dynamics={resultData.dynamics} />
      )}

      {/* 5. Psychometric Integrity & Response Quality Telemetry */}
      <ResponseQualityPanel
        integrity={resultData.integrity}
        durationFormatted={resultData.timestamps.durationFormatted}
        scoringModelCode={resultData.snapshot.scoringModelCode}
      />

      {/* 6. Ontological Coverage Map */}
      <MeasurementCoveragePanel
        measuredModuleName={resultData.module.titleTr}
        constructs={resultData.constructs}
        unmeasuredDomains={resultData.unmeasuredDomains}
      />

      {/* 7. Next Assessment Handoff */}
      <NextAssessmentHandoff nextAction={resultData.nextAction} />
    </PageContainer>
  );
}
