import React from 'react';
import { SystemHealthReport } from '@/services/adminUserService';
import { Mail, FlaskConical, CheckCircle2, XCircle } from 'lucide-react';

export interface SystemIntegrationCardProps {
  emailService: SystemHealthReport['emailService'];
  researchGate: SystemHealthReport['researchGate'];
}

export const SystemIntegrationCard: React.FC<SystemIntegrationCardProps> = ({
  emailService,
  researchGate,
}) => {
  return (
    <div className="bg-surface-1 rounded-2xl border border-border-subtle p-6 shadow-xs space-y-4">
      <div className="flex items-center space-x-2 border-b border-border-subtle pb-3">
        <Mail className="w-5 h-5 text-brand-600" />
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
          Entegrasyon & İletişim Servisleri
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* SMTP Mail Service */}
        <div className="p-3.5 bg-bg-subtle/60 rounded-xl border border-border-subtle space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-text-primary flex items-center">
              <Mail className="w-3.5 h-3.5 mr-1 text-purple-600" />
              SMTP E-posta Servisi
            </span>
            {emailService.configured ? (
              <span className="inline-flex items-center text-emerald-700 font-semibold text-[10px] bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                <CheckCircle2 className="w-2.5 h-2.5 mr-1 text-emerald-600" />
                Aktif
              </span>
            ) : (
              <span className="inline-flex items-center text-amber-700 font-semibold text-[10px] bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                Devre Dışı (Konsol Modu)
              </span>
            )}
          </div>
          <div className="text-[11px] text-text-secondary">
            {emailService.host
              ? `Sunucu: ${emailService.host}${emailService.port ? `:${emailService.port}` : ''}`
              : 'E-postalar geliştirme ortamında konsola yazdırılır.'}
          </div>
        </div>

        {/* Research Gate */}
        <div className="p-3.5 bg-bg-subtle/60 rounded-xl border border-border-subtle space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-text-primary flex items-center">
              <FlaskConical className="w-3.5 h-3.5 mr-1 text-teal-600" />
              Araştırma Geçidi (Research Gate)
            </span>
            {researchGate.configured ? (
              <span className="inline-flex items-center text-emerald-700 font-semibold text-[10px] bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                <CheckCircle2 className="w-2.5 h-2.5 mr-1 text-emerald-600" />
                Korumalı & Aktif
              </span>
            ) : (
              <span className="inline-flex items-center text-text-tertiary font-medium text-[10px] bg-bg-subtle px-1.5 py-0.2 rounded border border-border-subtle">
                Varsayılan Deny
              </span>
            )}
          </div>
          <div className="text-[11px] text-text-secondary">
            {researchGate.configured
              ? 'Akademik veri dışa aktarım anahtarı yapılandırılmış.'
              : 'Harici araştırma anahtarı tanımlanmamış.'}
          </div>
        </div>
      </div>
    </div>
  );
};
