'use client';

import React from 'react';
import { TheorySource } from '@/types/theoryLens';
import { BookOpen, ExternalLink, Award } from 'lucide-react';

interface TheorySourcesListProps {
  sources: TheorySource[];
}

export const TheorySourcesList: React.FC<TheorySourcesListProps> = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
        <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        <span>Akademik ve Tarihsel Kaynakça ({sources.length} Doğrulanmış Eser)</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sources.map((source) => (
          <div
            key={source.sourceId}
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2 flex flex-col justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <Award className="w-3 h-3" />
                  {source.verificationStatus.replace(/_/g, ' ')}
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  {source.year}
                </span>
              </div>
              <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                {source.title}
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {source.author} — <em>{source.publisherOrJournal}</em>
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1 flex-wrap">
                {source.conceptsSupported?.slice(0, 2).map((c) => (
                  <span
                    key={c}
                    className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400 font-mono"
                  >
                    {c}
                  </span>
                ))}
              </div>
              {source.doiOrCanonicalUrl && (
                <a
                  href={source.doiOrCanonicalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline font-medium text-[11px]"
                >
                  Kaynak Bağlantısı <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
