'use client';

import React from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Scale,
  Sparkles,
  HelpCircle,
  Activity,
} from 'lucide-react';
import { EvidenceTransparencyInfo } from '@/types/aiInsightV2';

interface EvidenceProvenanceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  info: EvidenceTransparencyInfo | null;
}

export const EvidenceProvenanceDrawer: React.FC<EvidenceProvenanceDrawerProps> = ({
  isOpen,
  onClose,
  info,
}) => {
  if (!isOpen || !info) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-surface-1 min-h-screen shadow-2xl border-l border-border-subtle p-6 flex flex-col space-y-6 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-700 border border-brand-200/60 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary">
                Bu Yorum Neye Dayanıyor?
              </h3>
              <p className="text-[11px] text-text-tertiary">
                Şeffaf Kanıt Provenansı ve Ölçüm Temeli
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Insight Title & Claim Strength */}
        <div className="p-3.5 rounded-xl bg-surface-2/60 border border-border-subtle space-y-1.5">
          <div className="text-xs font-bold text-text-primary">
            {info.titleTr}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-semibold text-brand-700 bg-brand-50 border border-brand-200/60 px-2 py-0.5 rounded">
              {info.claimStrength === 'DIRECT_MEASUREMENT'
                ? 'Doğrudan Ölçüm'
                : info.claimStrength === 'MULTI_EVIDENCE_INTERPRETATION'
                ? 'Çoklu Kanıt Yorumu'
                : info.claimStrength === 'DETERMINISTIC_PATTERN'
                ? 'Deterministik Örüntü'
                : 'Yansıtıcı Hipotez'}
            </span>
            <span className="text-[10px] text-text-tertiary">
              {info.coverageContextTr}
            </span>
          </div>
        </div>

        {/* Measured Dimensions Used */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center space-x-1.5">
            <Scale className="w-4 h-4 text-brand-600" />
            <span>Kullanılan Ölçülmüş Psikolojik Boyutlar</span>
          </div>

          {info.dimensions.length === 0 ? (
            <p className="text-xs text-text-tertiary">
              Bu genel yorum doğrudan bir boyuta bağlı olmaksızın bütünsel profil yapısını özetler.
            </p>
          ) : (
            <div className="space-y-2">
              {info.dimensions.map((dim) => (
                <div
                  key={dim.facetId}
                  className="p-3 rounded-xl bg-surface-1 border border-border-subtle space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-primary">
                      {dim.nameTr}
                    </span>
                    <span className="text-[11px] font-semibold text-brand-700">
                      {dim.bandLabelTr}
                    </span>
                  </div>
                  {dim.scientificRationaleTr && (
                    <p className="text-[11px] text-text-secondary leading-relaxed">
                      {dim.scientificRationaleTr}
                    </p>
                  )}
                  <div className="text-[10px] text-text-tertiary flex items-center space-x-2 pt-0.5">
                    <span>Durum: {dim.status}</span>
                    {dim.score !== null && <span>Puan: {dim.score.toFixed(2)} / 5.00</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Source Assessment Modules */}
        {info.sourceModules.length > 0 && (
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center space-x-1.5">
              <FileCheck2 className="w-4 h-4 text-brand-600" />
              <span>Kaynak Değerlendirme Modülleri</span>
            </div>
            <div className="space-y-1.5">
              {info.sourceModules.map((m, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-surface-2/40 border border-border-subtle text-xs text-text-secondary flex items-center justify-between"
                >
                  <span className="font-medium">{m.titleTr}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Response Quality Note */}
        <div className="p-3.5 rounded-xl bg-surface-2/40 border border-border-subtle space-y-1">
          <div className="text-xs font-bold text-text-primary flex items-center space-x-1.5">
            <Activity className="w-3.5 h-3.5 text-brand-600" />
            <span>Yanıt Kalitesi & Güvenilirlik</span>
          </div>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            {info.responseQualityNoteTr}
          </p>
        </div>

        {/* Scientific Limitations */}
        <div className="space-y-2 pt-2 border-t border-border-subtle mt-auto">
          <div className="text-[11px] font-bold text-text-secondary">
            Bilimsel Sınırlar ve Yasal Çerçeve
          </div>
          <ul className="text-[10px] text-text-tertiary space-y-1">
            {info.limitationsTr.map((lim, idx) => (
              <li key={idx}>&bull; {lim}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
