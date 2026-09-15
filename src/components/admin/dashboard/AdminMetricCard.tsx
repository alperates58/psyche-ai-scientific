import React from 'react';

export interface AdminMetricCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  badgeText?: string;
  badgeVariant?: 'neutral' | 'brand' | 'success' | 'warning' | 'teal';
  icon: React.ElementType;
}

export const AdminMetricCard: React.FC<AdminMetricCardProps> = ({
  title,
  value,
  subtitle,
  badgeText,
  badgeVariant = 'brand',
  icon: Icon,
}) => {
  const badgeColors: Record<string, string> = {
    neutral: 'bg-bg-subtle text-text-secondary border-border-subtle',
    brand: 'bg-brand-50 text-brand-700 border-brand-200/60',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    warning: 'bg-amber-50 text-amber-800 border-amber-200/60',
    teal: 'bg-teal-50 text-teal-700 border-teal-200/60',
  };

  return (
    <div className="bg-surface-1 rounded-2xl border border-border-subtle p-5 sm:p-6 shadow-xs hover:border-border-default transition-all duration-150 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider truncate">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-text-primary mt-2 font-mono tracking-tight">
            {value}
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 shrink-0">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || badgeText) && (
        <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-xs">
          {subtitle && <span className="text-text-secondary truncate">{subtitle}</span>}
          {badgeText && (
            <span
              className={`px-2 py-0.5 rounded-md font-semibold text-[11px] border shrink-0 ${
                badgeColors[badgeVariant] || badgeColors.brand
              }`}
            >
              {badgeText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
