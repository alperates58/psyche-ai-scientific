'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ChevronRight,
  Clock,
  Tag,
  Flag,
  HelpCircle,
  Layers,
} from 'lucide-react';
import { JournalEntryV1 } from '@/types/journal';

interface JournalTimelineCardProps {
  entry: JournalEntryV1;
}

export const JournalTimelineCard: React.FC<JournalTimelineCardProps> = ({ entry }) => {
  const latestInsight = entry.insights?.[0];
  const dateStr = new Date(entry.createdAt).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-surface-1 border border-border-subtle hover:border-brand-300 rounded-2xl p-5 shadow-xs transition-all space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
            {getEntryTypeLabel(entry.entryType)}
          </span>
          {entry.isLifeEvent && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
              <Flag className="w-3 h-3" />
              Yaşam Olayı
            </span>
          )}
        </div>

        <div className="text-[11px] text-text-tertiary flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{dateStr}</span>
        </div>
      </div>

      {/* Title & Body */}
      <div>
        {entry.title && (
          <h3 className="text-sm font-semibold text-text-primary mb-1">{entry.title}</h3>
        )}
        <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
          {entry.body}
        </p>
      </div>

      {/* Tags & Subjective Ratings */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border-subtle/60 text-xs">
        {/* Context Tags */}
        <div className="flex flex-wrap gap-1 items-center">
          <Tag className="w-3 h-3 text-text-tertiary" />
          {entry.contextTags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2 py-0.5 rounded-md bg-bg-subtle text-text-tertiary border border-border-subtle"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* State Ratings */}
        <div className="flex items-center gap-2 text-[11px] text-text-tertiary">
          {entry.moodSelfReport && (
            <span className="bg-surface-2 px-1.5 py-0.5 rounded-sm border border-border-subtle">
              Ruh: <strong className="text-text-primary">{entry.moodSelfReport}/5</strong>
            </span>
          )}
          {entry.energySelfReport && (
            <span className="bg-surface-2 px-1.5 py-0.5 rounded-sm border border-border-subtle">
              Enerji: <strong className="text-text-primary">{entry.energySelfReport}/5</strong>
            </span>
          )}
          {entry.stressSelfReport && (
            <span className="bg-surface-2 px-1.5 py-0.5 rounded-sm border border-border-subtle">
              Stres: <strong className="text-text-primary">{entry.stressSelfReport}/5</strong>
            </span>
          )}
        </div>
      </div>

      {/* AI Reflection Snippet */}
      {latestInsight && (
        <div className="bg-brand-50/50 border border-brand-100 rounded-xl p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-brand-700 font-semibold text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Gözlem & Yansıma İçgörüsü</span>
            </div>
            <span className="text-[10px] text-text-tertiary font-mono">
              {latestInsight.evidenceClass}
            </span>
          </div>
          <p className="text-text-secondary leading-relaxed">{latestInsight.summaryTr}</p>

          {latestInsight.reflectivePrompt && (
            <div className="bg-surface-1 p-2 rounded-lg border border-brand-200/60 text-[11px] text-brand-900 flex items-start gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
              <span>{latestInsight.reflectivePrompt}</span>
            </div>
          )}
        </div>
      )}

      {/* Footer Link */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1 text-[11px] text-text-tertiary">
          <Layers className="w-3 h-3" />
          <span>{entry.relationships?.length || 0} profil ilişkisi</span>
        </div>
        <Link
          href={`/journal/${entry.id}`}
          className="text-xs font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1 hover:underline"
        >
          <span>Detay & Kanıt Sayfası</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

function getEntryTypeLabel(type: string): string {
  switch (type) {
    case 'FREE_REFLECTION':
      return 'Serbest Yansıma';
    case 'EVENT':
      return 'Olay';
    case 'EMOTION':
      return 'Duygu';
    case 'DECISION':
      return 'Karar';
    case 'RELATIONSHIP':
      return 'İlişki';
    case 'WORK':
      return 'İş & Görev';
    case 'GOAL':
      return 'Hedef';
    case 'STRESS':
      return 'Stres';
    case 'SUCCESS':
      return 'Başarı';
    case 'CHALLENGE':
      return 'Zorluk';
    default:
      return 'Yansıma';
  }
}
