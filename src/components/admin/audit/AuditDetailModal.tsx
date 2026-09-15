'use client';

import React from 'react';
import { AuditExplorerItem } from '@/services/adminUserService';
import { X, Shield, FileText } from 'lucide-react';

export interface AuditDetailModalProps {
  event: AuditExplorerItem | null;
  onClose: () => void;
}

export const AuditDetailModal: React.FC<AuditDetailModalProps> = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="audit-detail-title"
    >
      <div className="bg-surface-1 border border-border-subtle rounded-2xl max-w-xl w-full p-6 shadow-xl space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2.5">
            <Shield className="w-5 h-5 text-brand-600" />
            <div>
              <h3 id="audit-detail-title" className="text-base font-bold text-text-primary">
                Denetim Olay Detayı
              </h3>
              <span className="font-mono text-xs text-text-tertiary">ID: {event.id}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-text-tertiary hover:text-text-primary rounded-lg hover:bg-bg-subtle transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center touch-manipulation"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-bg-subtle/60 rounded-xl border border-border-subtle">
            <span className="text-[10px] text-text-tertiary font-semibold uppercase block">Olay Türü</span>
            <span className="font-mono font-bold text-text-primary">{event.eventType}</span>
          </div>

          <div className="p-3 bg-bg-subtle/60 rounded-xl border border-border-subtle">
            <span className="text-[10px] text-text-tertiary font-semibold uppercase block">Durum</span>
            <span className={`font-bold ${event.success ? 'text-emerald-700' : 'text-rose-700'}`}>
              {event.success ? 'BAŞARILI' : 'BAŞARISIZ'}
            </span>
          </div>

          <div className="p-3 bg-bg-subtle/60 rounded-xl border border-border-subtle">
            <span className="text-[10px] text-text-tertiary font-semibold uppercase block">İşlemi Yapan (Aktör)</span>
            <span className="font-mono text-text-primary">{event.actorName || 'Sistem / Anonim'}</span>
          </div>

          <div className="p-3 bg-bg-subtle/60 rounded-xl border border-border-subtle">
            <span className="text-[10px] text-text-tertiary font-semibold uppercase block">Hedef Kullanıcı</span>
            <span className="font-mono text-text-primary">
              {event.targetName ? `${event.targetName} (${event.targetEmailMasked})` : event.targetEmailMasked || '—'}
            </span>
          </div>

          <div className="p-3 bg-bg-subtle/60 rounded-xl border border-border-subtle">
            <span className="text-[10px] text-text-tertiary font-semibold uppercase block">Zaman Damgası</span>
            <span className="text-text-primary">
              {new Date(event.createdAt).toLocaleString('tr-TR')}
            </span>
          </div>

          <div className="p-3 bg-bg-subtle/60 rounded-xl border border-border-subtle">
            <span className="text-[10px] text-text-tertiary font-semibold uppercase block">IP Hash</span>
            <span className="font-mono text-[11px] text-text-secondary">
              {event.ipHash ? event.ipHash.substring(0, 16) + '...' : '—'}
            </span>
          </div>
        </div>

        {event.userAgent && (
          <div className="p-3 bg-bg-subtle/60 rounded-xl border border-border-subtle text-xs space-y-1">
            <span className="text-[10px] text-text-tertiary font-semibold uppercase block">User Agent</span>
            <p className="text-[11px] text-text-secondary break-all font-mono">{event.userAgent}</p>
          </div>
        )}

        <div className="space-y-1.5 text-xs">
          <span className="text-[10px] text-text-tertiary font-semibold uppercase flex items-center">
            <FileText className="w-3 h-3 mr-1 text-brand-600" />
            Sanitize Edilmiş Yapılandırılmış Metadata
          </span>
          <pre className="p-3.5 rounded-xl bg-slate-950 text-slate-100 font-mono text-[11px] overflow-x-auto max-h-48 border border-slate-800">
            {event.metadata ? JSON.stringify(event.metadata, null, 2) : 'Metadata kaydı yok.'}
          </pre>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-surface-2 text-text-primary font-semibold text-xs hover:bg-bg-subtle transition-colors min-h-[44px] touch-manipulation"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
