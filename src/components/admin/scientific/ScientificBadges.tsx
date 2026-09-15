import React from 'react';
import { NormalizedLicenseDecision, LICENSE_DISPLAY_MAP } from '@/lib/licenseNormalization';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, ShieldCheck, FileClock, Archive, Eye } from 'lucide-react';

export interface EvidenceBadgeProps {
  level: 'DIRECT' | 'LEXICAL' | 'RELATED' | 'NO_DIRECT' | string;
  size?: 'sm' | 'md';
}

export const EvidenceBadge: React.FC<EvidenceBadgeProps> = ({ level, size = 'sm' }) => {
  const norm = level.toUpperCase();

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  if (norm === 'DIRECT') {
    return (
      <span className={`inline-flex items-center font-semibold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 ${sizeClass}`}>
        <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
        DIRECT (Doğrudan Türkçe)
      </span>
    );
  }

  if (norm === 'LEXICAL') {
    return (
      <span className={`inline-flex items-center font-semibold rounded-md bg-blue-50 text-blue-700 border border-blue-200/60 ${sizeClass}`}>
        <Eye className="w-3 h-3 mr-1 text-blue-600" />
        LEXICAL (Leksikal Destek)
      </span>
    );
  }

  if (norm === 'RELATED') {
    return (
      <span className={`inline-flex items-center font-semibold rounded-md bg-amber-50 text-amber-800 border border-amber-200/60 ${sizeClass}`}>
        <AlertTriangle className="w-3 h-3 mr-1 text-amber-600" />
        RELATED (İlişkili Yapı)
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center font-medium rounded-md bg-surface-2 text-text-tertiary border border-border-subtle ${sizeClass}`}>
      <HelpCircle className="w-3 h-3 mr-1 opacity-60" />
      NO_DIRECT (Doğrudan Yok)
    </span>
  );
};

export interface LicenseBadgeProps {
  decision: NormalizedLicenseDecision | string;
  size?: 'sm' | 'md';
}

export const LicenseBadge: React.FC<LicenseBadgeProps> = ({ decision, size = 'sm' }) => {
  const meta = LICENSE_DISPLAY_MAP[decision as NormalizedLicenseDecision] || LICENSE_DISPLAY_MAP.UNKNOWN;
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  let colorClass = 'bg-surface-2 text-text-tertiary border-border-subtle';
  let Icon = HelpCircle;

  if (meta.badgeVariant === 'success') {
    colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
    Icon = ShieldCheck;
  } else if (meta.badgeVariant === 'warning') {
    colorClass = 'bg-amber-50 text-amber-800 border-amber-200/60';
    Icon = AlertTriangle;
  } else if (meta.badgeVariant === 'error') {
    colorClass = 'bg-rose-50 text-rose-700 border-rose-200/60';
    Icon = XCircle;
  }

  return (
    <span className={`inline-flex items-center font-semibold rounded-md border ${colorClass} ${sizeClass}`} title={meta.descriptionTr}>
      <Icon className="w-3 h-3 mr-1 shrink-0" />
      {meta.labelTr}
    </span>
  );
};

export interface LifecycleBadgeProps {
  status: 'PUBLISHED' | 'ACTIVE' | 'DRAFT' | 'ARCHIVED' | 'DEPRECATED' | string;
  size?: 'sm' | 'md';
}

export const LifecycleBadge: React.FC<LifecycleBadgeProps> = ({ status, size = 'sm' }) => {
  const norm = status.toUpperCase();
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  if (norm === 'PUBLISHED' || norm === 'ACTIVE') {
    return (
      <span className={`inline-flex items-center font-semibold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 ${sizeClass}`}>
        <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
        {norm === 'PUBLISHED' ? 'YAYINDA' : 'AKTİF'}
      </span>
    );
  }

  if (norm === 'DRAFT') {
    return (
      <span className={`inline-flex items-center font-semibold rounded-md bg-amber-50 text-amber-800 border border-amber-200/60 ${sizeClass}`}>
        <FileClock className="w-3 h-3 mr-1 text-amber-600" />
        TASLAK
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center font-medium rounded-md bg-surface-2 text-text-tertiary border border-border-subtle ${sizeClass}`}>
      <Archive className="w-3 h-3 mr-1 opacity-60" />
      {norm === 'ARCHIVED' ? 'ARŞİVLENDİ' : 'KULLANIM DIŞI'}
    </span>
  );
};
