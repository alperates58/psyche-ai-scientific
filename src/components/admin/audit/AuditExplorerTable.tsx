'use client';

import React, { useState } from 'react';
import { AuditExplorerItem } from '@/services/adminUserService';
import { AuditDetailModal } from './AuditDetailModal';
import { UserPagination } from '../users/UserPagination';
import { ShieldCheck, ShieldAlert, History, Info, ChevronRight } from 'lucide-react';

export interface AuditExplorerTableProps {
  events: AuditExplorerItem[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export const AuditExplorerTable: React.FC<AuditExplorerTableProps> = ({
  events,
  pagination,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<AuditExplorerItem | null>(null);

  if (events.length === 0) {
    return (
      <div className="bg-surface-1 rounded-2xl border border-border-subtle p-12 text-center shadow-xs">
        <History className="w-10 h-10 text-text-tertiary mx-auto mb-3 opacity-60" />
        <h3 className="text-base font-bold text-text-primary mb-1">Denetim Kaydı Bulunamadı</h3>
        <p className="text-xs text-text-secondary max-w-md mx-auto">
          Belirtilen filtrelere uygun güvenlik veya yönetimsel denetim olayı bulunamadı.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface-1 rounded-2xl border border-border-subtle shadow-xs overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left text-xs" aria-label="Denetim Günlüğü Listesi">
          <thead className="bg-bg-subtle/80 text-text-tertiary uppercase text-[10px] tracking-wider border-b border-border-subtle select-none font-semibold">
            <tr>
              <th className="py-3.5 px-4 font-semibold">Zaman</th>
              <th className="py-3.5 px-4 font-semibold">Olay Türü</th>
              <th className="py-3.5 px-4 font-semibold">Aktör</th>
              <th className="py-3.5 px-4 font-semibold">Hedef Kullanıcı</th>
              <th className="py-3.5 px-4 font-semibold">Sonuç</th>
              <th className="py-3.5 px-4 font-semibold">IP Hash</th>
              <th className="py-3.5 px-4 text-right font-semibold">Detay</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle font-normal">
            {events.map((e) => (
              <tr key={e.id} className="hover:bg-bg-subtle/50 transition-colors">
                <td className="py-3 px-4 whitespace-nowrap text-text-secondary text-[11px]">
                  {new Date(e.createdAt).toLocaleString('tr-TR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </td>

                <td className="py-3 px-4 whitespace-nowrap">
                  <span className="font-mono font-bold text-[11px] text-text-primary bg-bg-subtle px-1.5 py-0.5 rounded border border-border-subtle">
                    {e.eventType}
                  </span>
                </td>

                <td className="py-3 px-4 whitespace-nowrap text-text-primary text-[11px] font-medium">
                  {e.actorName}
                </td>

                <td className="py-3 px-4 whitespace-nowrap text-text-secondary text-[11px] font-mono">
                  {e.targetEmailMasked || (e.userId ? `ID: ${e.userId.substring(0, 8)}...` : '—')}
                </td>

                <td className="py-3 px-4 whitespace-nowrap">
                  {e.success ? (
                    <span className="inline-flex items-center text-emerald-700 font-semibold text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
                      Başarılı
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-rose-700 font-semibold text-[10px] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      <ShieldAlert className="w-3 h-3 mr-1 text-rose-600" />
                      Başarısız
                    </span>
                  )}
                </td>

                <td className="py-3 px-4 whitespace-nowrap font-mono text-[10px] text-text-tertiary">
                  {e.ipHash ? e.ipHash.substring(0, 10) + '...' : '—'}
                </td>

                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => setSelectedEvent(e)}
                    className="inline-flex items-center px-2.5 py-1.5 rounded-lg border border-border-subtle bg-surface-1 text-text-secondary hover:text-brand-600 hover:border-brand-300 transition-colors font-medium text-xs min-h-[36px] touch-manipulation"
                    aria-label="Olay Detayını İncele"
                  >
                    <Info className="w-3.5 h-3.5 mr-1" />
                    <span>İncele</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="block lg:hidden divide-y divide-border-subtle">
        {events.map((e) => (
          <div key={e.id} className="p-4 space-y-2.5 text-xs">
            <div className="flex items-start justify-between gap-2">
              <span className="font-mono font-bold text-[11px] text-text-primary bg-bg-subtle px-1.5 py-0.5 rounded border border-border-subtle">
                {e.eventType}
              </span>
              {e.success ? (
                <span className="inline-flex items-center text-emerald-700 font-semibold text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
                  Başarılı
                </span>
              ) : (
                <span className="inline-flex items-center text-rose-700 font-semibold text-[10px] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  <ShieldAlert className="w-3 h-3 mr-1 text-rose-600" />
                  Başarısız
                </span>
              )}
            </div>

            <div className="text-text-secondary text-[11px]">
              <div>
                <strong>Aktör:</strong> {e.actorName}
              </div>
              {e.targetEmailMasked && (
                <div>
                  <strong>Hedef:</strong> {e.targetEmailMasked}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border-subtle/50 text-[10px] text-text-tertiary">
              <span>{new Date(e.createdAt).toLocaleString('tr-TR')}</span>
              <button
                type="button"
                onClick={() => setSelectedEvent(e)}
                className="inline-flex items-center px-3 py-1 rounded-lg border border-border-subtle bg-surface-1 text-text-primary font-semibold text-xs min-h-[44px] touch-manipulation"
              >
                <span>Detay</span>
                <ChevronRight className="w-3 h-3 ml-1" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <UserPagination
        total={pagination.total}
        page={pagination.page}
        pageSize={pagination.pageSize}
        totalPages={pagination.totalPages}
      />

      {/* Detail Modal */}
      <AuditDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
};
