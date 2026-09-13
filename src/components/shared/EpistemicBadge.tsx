import React from 'react';

export type BadgeType =
  | 'VALIDATED_MEASUREMENT'
  | 'EVIDENCE_SUPPORTED_INTERPRETATION'
  | 'THEORETICAL_INTERPRETATION'
  | 'HISTORICAL_FRAMEWORK'
  | 'CONTEXTUAL_PATTERN'
  | 'PROVISIONAL'
  | 'PROVISIONAL_PATTERN'
  | 'RESEARCH_DRAFT';

interface EpistemicBadgeProps {
  status: BadgeType | string;
  customLabel?: string;
  size?: 'sm' | 'md';
}

export const EpistemicBadge: React.FC<EpistemicBadgeProps> = ({
  status,
  customLabel,
  size = 'md',
}) => {
  let label = customLabel;
  let styleClasses = 'bg-gray-100 text-gray-700 border-gray-200';

  switch (status) {
    case 'PROVISIONAL_PATTERN':
    case 'Geçici Örüntü':
    case 'Geçici Örüntü (Ön Kalibrasyon)':
    case 'Araştırma Önizlemesi':
      label = label || 'Geçici Örüntü (Ön Kalibrasyon)';
      styleClasses = 'bg-sky-50 text-sky-800 border-sky-200/60';
      break;

    case 'RESEARCH_DRAFT':
    case 'Araştırma Taslağı':
      label = label || 'Araştırma Taslağı';
      styleClasses = 'bg-amber-50 text-amber-800 border-amber-200/60';
      break;
    case 'VALIDATED_MEASUREMENT':
    case 'Measured':
    case 'Ölçülmüş Veri':
      label = label || 'Ölçülmüş Veri';
      styleClasses = 'bg-teal-50 text-teal-700 border-teal-200/60';
      break;

    case 'EVIDENCE_SUPPORTED_INTERPRETATION':
    case 'Evidence-supported':
    case 'Evidence-supported interpretation':
    case 'Kanıt Destekli Yorum':
      label = label || 'Kanıt Destekli Yorum';
      styleClasses = 'bg-blue-50 text-blue-700 border-blue-200/60';
      break;

    case 'THEORETICAL_INTERPRETATION':
    case 'Theoretical lens':
    case 'Kuramsal Yorum':
      label = label || 'Kuramsal Yorum';
      styleClasses = 'bg-amber-50 text-amber-800 border-amber-200/70';
      break;

    case 'HISTORICAL_FRAMEWORK':
    case 'Historical perspective':
    case 'Tarihsel Yaklaşım':
      label = label || 'Tarihsel Yaklaşım';
      styleClasses = 'bg-slate-100 text-slate-700 border-slate-200';
      break;

    case 'CONTEXTUAL_PATTERN':
    case 'Contextual pattern':
    case 'Bağlamsal Örüntü':
      label = label || 'Bağlamsal Örüntü';
      styleClasses = 'bg-purple-50 text-purple-700 border-purple-200/60';
      break;

    case 'PROVISIONAL':
    case 'Provisional':
    case 'Provisional Research':
    case 'Ön-Kalibrasyon Araştırması':
      label = label || 'Ön-Kalibrasyon Araştırması';
      styleClasses = 'bg-indigo-50/70 text-indigo-700 border-indigo-200/50';
      break;

    case 'PREVIEW_DATA':
    case 'Önizleme Verisi':
      label = label || 'Önizleme Verisi';
      styleClasses = 'bg-amber-50 text-amber-800 border-amber-200/60';
      break;

    default:
      label = label || String(status);
      styleClasses = 'bg-gray-50 text-gray-600 border-gray-200';
      break;
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border transition-colors ${sizeClasses} ${styleClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70" />
      {label}
    </span>
  );
};
