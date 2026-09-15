import React from 'react';
import { UserDetailDTO } from '@/services/adminUserService';
import { Brain, FileText, CheckCircle, Calendar, ShieldAlert } from 'lucide-react';

export interface UserPsychologySummaryCardProps {
  summary: UserDetailDTO['psychologySummary'];
}

export const UserPsychologySummaryCard: React.FC<UserPsychologySummaryCardProps> = ({
  summary,
}) => {
  return (
    <div className="bg-surface-1 rounded-2xl border border-border-subtle p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-border-subtle pb-3">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-brand-600" />
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
            Psikometrik Ölçüm & Veri Özeti
          </h3>
        </div>

        <span className="text-[11px] font-semibold text-text-tertiary bg-bg-subtle px-2 py-0.5 rounded border border-border-subtle">
          Özet Sayaçlar
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl border border-border-subtle bg-bg-subtle/50 space-y-1">
          <div className="flex items-center text-text-tertiary font-medium space-x-1.5">
            <FileText className="w-4 h-4 text-brand-600" />
            <span>Toplam Oturum</span>
          </div>
          <div className="text-xl font-bold text-text-primary">{summary.assessmentCount}</div>
          <div className="text-[11px] text-text-secondary">Başlatılan değerlendirmeler</div>
        </div>

        <div className="p-4 rounded-xl border border-border-subtle bg-bg-subtle/50 space-y-1">
          <div className="flex items-center text-text-tertiary font-medium space-x-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Tamamlanan Testler</span>
          </div>
          <div className="text-xl font-bold text-emerald-700">{summary.completedAssessmentCount}</div>
          <div className="text-[11px] text-text-secondary">Geçerli form tamamlamaları</div>
        </div>

        <div className="p-4 rounded-xl border border-border-subtle bg-bg-subtle/50 space-y-1">
          <div className="flex items-center text-text-tertiary font-medium space-x-1.5">
            <Brain className="w-4 h-4 text-purple-600" />
            <span>Profil Çıktıları</span>
          </div>
          <div className="text-xl font-bold text-purple-700">{summary.snapshotCount}</div>
          <div className="text-[11px] text-text-secondary">Oluşturulan profil anlık görüntüleri</div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between text-[11px] text-text-secondary pt-2 border-t border-border-subtle">
        <div className="flex items-center space-x-1">
          <Calendar className="w-3.5 h-3.5 text-text-tertiary" />
          <span>
            Son Test:{' '}
            {summary.latestAssessmentAt
              ? new Date(summary.latestAssessmentAt).toLocaleDateString('tr-TR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
              : 'Henüz Veri Yok'}
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <Calendar className="w-3.5 h-3.5 text-text-tertiary" />
          <span>
            Son Profil Çıktısı:{' '}
            {summary.latestSnapshotAt
              ? new Date(summary.latestSnapshotAt).toLocaleDateString('tr-TR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
              : 'Henüz Veri Yok'}
          </span>
        </div>
      </div>
    </div>
  );
};
