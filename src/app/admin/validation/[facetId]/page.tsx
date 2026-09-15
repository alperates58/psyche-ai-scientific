import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requirePermission } from '@/lib/auth';
import { getValidationDetail } from '@/services/scientificService';
import { EvidenceBadge } from '@/components/admin/scientific/ScientificBadges';
import { Scale, ArrowLeft, BookMarked, CheckCircle2, AlertTriangle, ShieldCheck, FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ValidationDetailPage({
  params,
}: {
  params: { facetId: string };
}) {
  await requirePermission('SCIENTIFIC_VIEW');

  const summary = await getValidationDetail(params.facetId);
  if (!summary) notFound();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Navigation */}
      <div>
        <Link
          href="/admin/validation"
          className="inline-flex items-center text-xs font-semibold text-text-tertiary hover:text-brand-600 transition-colors mb-3 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Tüm Doğrulama Matrisine Dön
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 font-bold shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                  {summary.facet.nameTr}
                </h1>
                <EvidenceBadge level={summary.overallTurkishEvidenceLevel} size="md" />
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                {summary.facet.construct.domain.nameTr} &gt; {summary.facet.construct.nameTr} &gt; <strong className="text-text-primary font-mono">{summary.facet.code}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Notes & Alignment Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 p-5 bg-surface-1 border border-border-subtle rounded-2xl shadow-xs space-y-2">
          <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider block">
            Bilimsel Kanıt & Metodolojik Değerlendirme
          </span>
          <p className="text-sm font-semibold text-text-primary leading-relaxed">
            {summary.scientificNotes || 'Not bulunmamaktadır.'}
          </p>
          {summary.sampleDescription && (
            <p className="text-xs text-text-secondary pt-1">
              <strong>Örneklem:</strong> {summary.sampleDescription}
            </p>
          )}
        </div>

        <div className="p-5 bg-surface-1 border border-border-subtle rounded-2xl shadow-xs space-y-3">
          <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider block">
            Ölçüm Hizalama & Değişmezlik
          </span>
          <div className="text-xs text-text-secondary space-y-1.5">
            <div>
              <span className="text-text-tertiary block text-[10px]">Hizalama Düzeyi:</span>
              <span className="font-mono font-bold text-text-primary">{summary.measurementAlignmentLevel}</span>
            </div>
            <div>
              <span className="text-text-tertiary block text-[10px]">Ölçüm Değişmezliği:</span>
              <span className="font-mono font-bold text-text-primary">{summary.measurementInvarianceStatus}</span>
            </div>
            <div>
              <span className="text-text-tertiary block text-[10px]">Envanter Geçerliliği:</span>
              <span className="font-semibold text-text-primary">
                {summary.instrumentValidationEstablished ? 'Doğrulandı' : 'Doğrulanmadı'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Study Evidences Table */}
      <div className="bg-surface-1 border border-border-subtle rounded-2xl shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
          <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">
            Destekleyici Çalışma Kanıtları ({summary.studyEvidences.length})
          </h2>
        </div>

        {summary.studyEvidences.length === 0 ? (
          <div className="p-6 text-center text-xs text-text-tertiary">
            Bu alt boyut için bağımsız bir çalışma kanıtı kaydedilmemiştir.
          </div>
        ) : (
          <div className="divide-y divide-border-subtle">
            {summary.studyEvidences.map((se) => (
              <div key={se.id} className="p-5 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-brand-700">
                      {se.evidenceType}
                    </span>
                    <EvidenceBadge level={se.evidenceLevel} size="sm" />
                    {se.sampleN && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-surface-2 font-mono text-text-primary">
                        N = {se.sampleN}
                      </span>
                    )}
                  </div>
                  {se.source && (
                    <span className="text-xs text-text-tertiary font-mono">
                      Kaynak: {se.source.shortKey} ({se.source.year})
                    </span>
                  )}
                </div>

                {se.population && (
                  <p className="text-xs text-text-secondary">
                    <strong>Evren / Örneklem Grubu:</strong> {se.population} ({se.samplingMethod || 'Belirtilmemiş'})
                  </p>
                )}

                {se.notes && (
                  <p className="text-xs text-text-tertiary italic">
                    {se.notes}
                  </p>
                )}

                {/* doesNotEstablish boundary limits */}
                {Array.isArray(se.doesNotEstablish) && (se.doesNotEstablish as string[]).length > 0 && (
                  <div className="p-3 rounded-xl bg-surface-2/60 border border-border-subtle text-xs space-y-1">
                    <span className="font-bold text-amber-800 text-[10px] uppercase block">
                      ⚠️ Bu Çalışmanın Kanıtlamadığı Sınırlar (Epistemik Sınır):
                    </span>
                    <ul className="list-disc list-inside text-text-secondary space-y-0.5 text-[11px]">
                      {(se.doesNotEstablish as string[]).map((dne, idx) => (
                        <li key={idx}>{dne}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reliability Evidences Table */}
      <div className="bg-surface-1 border border-border-subtle rounded-2xl shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
          <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">
            Psikometrik Güvenilirlik Kanıtları ({summary.reliabilityEvidences.length})
          </h2>
        </div>

        {summary.reliabilityEvidences.length === 0 ? (
          <div className="p-6 text-center text-xs text-text-tertiary">
            Bu alt boyut için bağımsız bir güvenilirlik metriği kaydedilmemiştir.
          </div>
        ) : (
          <div className="divide-y divide-border-subtle">
            {summary.reliabilityEvidences.map((re) => (
              <div key={re.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-text-primary">{re.metricType}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-2">{re.metricName}</span>
                  </div>
                  {re.location && (
                    <span className="text-[11px] text-text-tertiary block">{re.location}</span>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <span className="font-mono font-bold text-sm text-brand-700">
                    {re.value !== null ? re.value.toFixed(2) : 'Değer Yok (null)'}
                  </span>
                  <EvidenceBadge level={re.evidenceLevel} size="sm" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
