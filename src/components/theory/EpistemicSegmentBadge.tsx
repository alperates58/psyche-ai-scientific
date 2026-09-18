'use client';

import React from 'react';
import { EpistemicSegment, EpistemicClaimType } from '@/types/theoryLens';
import { MASTER_FACETS } from '@/lib/profile/masterModelConstants';
import { CheckCircle2, BookOpen, User, HelpCircle } from 'lucide-react';

interface EpistemicSegmentBadgeProps {
  segment: EpistemicSegment;
}

const CONFIG: Record<
  EpistemicClaimType,
  {
    labelTr: string;
    bgClass: string;
    borderClass: string;
    textClass: string;
    badgeBg: string;
    badgeText: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  MEASURED_FINDING: {
    labelTr: 'Ölçülen Psikometrik Veri',
    bgClass: 'bg-blue-50/70 dark:bg-blue-950/30',
    borderClass: 'border-blue-200 dark:border-blue-800/60',
    textClass: 'text-blue-900 dark:text-blue-200',
    badgeBg: 'bg-blue-100 dark:bg-blue-900/80',
    badgeText: 'text-blue-800 dark:text-blue-300',
    icon: CheckCircle2,
  },
  THEORETICAL_INTERPRETATION: {
    labelTr: 'Kuramsal Yorumlama',
    bgClass: 'bg-purple-50/70 dark:bg-purple-950/30',
    borderClass: 'border-purple-200 dark:border-purple-800/60',
    textClass: 'text-purple-900 dark:text-purple-200',
    badgeBg: 'bg-purple-100 dark:bg-purple-900/80',
    badgeText: 'text-purple-800 dark:text-purple-300',
    icon: BookOpen,
  },
  USER_PROVIDED_CONTEXT: {
    labelTr: 'Kullanıcı Bildirimi / Bağlam',
    bgClass: 'bg-amber-50/70 dark:bg-amber-950/30',
    borderClass: 'border-amber-200 dark:border-amber-800/60',
    textClass: 'text-amber-900 dark:text-amber-200',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/80',
    badgeText: 'text-amber-800 dark:text-amber-300',
    icon: User,
  },
  REFLECTIVE_HYPOTHESIS: {
    labelTr: 'Yansıtıcı Soru & Hipotez',
    bgClass: 'bg-emerald-50/70 dark:bg-emerald-950/30',
    borderClass: 'border-emerald-200 dark:border-emerald-800/60',
    textClass: 'text-emerald-900 dark:text-emerald-200',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-900/80',
    badgeText: 'text-emerald-800 dark:text-emerald-300',
    icon: HelpCircle,
  },
};

export const EpistemicSegmentBadge: React.FC<EpistemicSegmentBadgeProps> = ({ segment }) => {
  const config = CONFIG[segment.claimType] || CONFIG.THEORETICAL_INTERPRETATION;
  const Icon = config.icon;

  return (
    <div
      className={`p-3.5 rounded-xl border ${config.bgClass} ${config.borderClass} transition-all space-y-1.5`}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.badgeBg} ${config.badgeText}`}
        >
          <Icon className="w-3.5 h-3.5" />
          {config.labelTr}
        </span>
        {segment.evidenceRefs && segment.evidenceRefs.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {segment.evidenceRefs.map((ref) => {
              const facet = MASTER_FACETS.find((f) => f.code === ref || f.facetId === ref);
              const label = facet ? facet.nameTr : ref;
              return (
                <span
                  key={ref}
                  className="px-2 py-0.5 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-md text-[11px] font-medium text-slate-700 dark:text-slate-300"
                >
                  {label}
                </span>
              );
            })}
          </div>
        )}
      </div>
      <p className={`text-sm leading-relaxed ${config.textClass}`}>
        {segment.contentTr}
      </p>
    </div>
  );
};
