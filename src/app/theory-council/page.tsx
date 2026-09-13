import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';
import { DEMO_PROFILE_DATA } from '@/data/demo-profile';
import { EpistemicBadge } from '@/components/shared/EpistemicBadge';

export default function TheoryCouncilPage() {
  const { theoryCouncilLenses } = DEMO_PROFILE_DATA;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-border-subtle pb-5">
        <Link
          href="/overview"
          className="inline-flex items-center text-xs font-semibold text-text-tertiary hover:text-text-primary transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          <span>Genel Bakışa Dön</span>
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-text-primary">Kuramlar Konseyi — Yorum Mercekleri</h1>
              <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200/60 font-semibold px-2 py-0.5 rounded-full">
                ÖNİZLEME VERİSİ
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-1 max-w-3xl">
              Klasik psikoloji ekolleri ölçüm üretmez. Doğrulanmış ampirik verilerinize tamamlayıcı kavramsal açıklamalar getiren analitik okuma mercekleri olarak işlev görürler.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-surface-1 px-3 py-2 rounded-xl border border-border-subtle text-xs text-text-tertiary">
            <BookOpen className="w-4 h-4 text-brand-600 flex-shrink-0" />
            <span>8 Klasik Kuram Aktif</span>
          </div>
        </div>
      </div>

      {/* Epistemic Principles Banner */}
      <div className="bg-brand-50/70 p-4 rounded-card border border-brand-200/60 flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-text-secondary leading-relaxed">
          <span className="font-bold text-brand-800">Epistemik Sınır İlkesi:</span> Aşağıdaki kartların hiçbiri tıbbi tanı, psikiyatrik değerlendirme veya ampirik kişilik puanı temsil etmez. İfadeler, yapılandırılmış psikometrik verilerinize tarihsel kuramların uygulanmasıyla elde edilen kavramsal hipotezlerdir.
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {theoryCouncilLenses.map((lens) => (
          <div
            key={lens.lensId}
            className="bg-surface-1 p-6 rounded-card border border-border-subtle shadow-xs hover:border-brand-200 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              {/* Theorist Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h2 className="text-lg font-bold text-text-primary tracking-tight">
                    {lens.theoristName}
                  </h2>
                  <div className="text-xs font-semibold text-brand-600">{lens.title}</div>
                </div>
                <EpistemicBadge status={lens.epistemicStatus} size="sm" />
              </div>

              <div className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider mb-2">
                Temel Bakış Açısı: {lens.perspective}
              </div>

              {/* Interpretation Body */}
              <p className="text-xs text-text-secondary leading-relaxed mb-4 bg-surface-2 p-3.5 rounded-xl border border-border-subtle/80">
                {lens.interpretation}
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-border-subtle text-xs">
              {/* Grounded Attributes */}
              <div>
                <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider block mb-1.5">
                  Dayandığı Ölçülmüş Nitelikler:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {lens.groundedAttributes.map((attr) => (
                    <span
                      key={attr}
                      className="text-[11px] bg-bg-subtle text-text-secondary px-2 py-0.5 rounded-md border border-border-subtle"
                    >
                      {attr}
                    </span>
                  ))}
                </div>
              </div>

              {/* Scientific Limitation */}
              <div className="bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/50 text-[11px] text-amber-900 leading-snug">
                <span className="font-semibold">Kuramsal Sınır:</span> {lens.limitations}
              </div>

              <div className="text-[10px] text-text-tertiary italic text-center pt-1">
                "Bu bölüm kuramsal bir yorumdur; doğrulanmış psikometrik bir ölçüm değildir."
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
