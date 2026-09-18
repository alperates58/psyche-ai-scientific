'use client';

import React, { useState, useEffect } from 'react';
import {
  PenLine,
  ListFilter,
  Sparkles,
  Compass,
  Download,
  AlertCircle,
  Filter,
} from 'lucide-react';
import {
  JournalEntryV1,
  JournalObservationSummaryV1,
  JournalContextTag,
  VALID_JOURNAL_CONTEXT_TAGS,
} from '@/types/journal';
import { JournalComposer } from './JournalComposer';
import { JournalTimelineCard } from './JournalTimelineCard';
import { JournalRepeatedThemesPanel } from './JournalRepeatedThemesPanel';
import { JournalProfileLinksPanel } from './JournalProfileLinksPanel';

export const JournalMasterClient: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'composer' | 'themes' | 'profileLinks'>('timeline');
  const [entries, setEntries] = useState<JournalEntryV1[]>([]);
  const [summary, setSummary] = useState<JournalObservationSummaryV1 | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [selectedContext, setSelectedContext] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const fetchJournalData = async () => {
    setIsLoading(true);
    try {
      const [entriesRes, summaryRes] = await Promise.all([
        fetch('/api/journal'),
        fetch('/api/journal/summary'),
      ]);

      if (entriesRes.ok) {
        const entriesData = await entriesRes.json();
        setEntries(entriesData);
      }
      if (summaryRes.ok) {
        const summaryData = await summaryRes.json();
        setSummary(summaryData);
      }
    } catch (err) {
      console.error('Error fetching journal data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJournalData();
  }, []);

  const handleEntryCreated = (newEntry: JournalEntryV1) => {
    setEntries((prev) => [newEntry, ...prev]);
    setActiveTab('timeline');
    fetchJournalData(); // Refresh dynamic summary
  };

  // Filtered entries
  const filteredEntries = entries.filter((entry) => {
    if (selectedContext !== 'ALL' && !entry.contextTags.includes(selectedContext as JournalContextTag)) {
      return false;
    }
    if (selectedType !== 'ALL' && entry.entryType !== selectedType) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="bg-surface-1 border border-border-subtle rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold shadow-xs">
              <PenLine className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                Yansımalarım
              </h1>
              <p className="text-xs sm:text-sm text-text-tertiary">
                Düşüncelerinizi, deneyimlerinizi ve fark ettiklerinizi kaydedin.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/api/journal/export"
              download
              className="px-3.5 py-2 rounded-xl bg-surface-2 border border-border-subtle hover:bg-surface-3 text-text-secondary text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Dışa Aktar</span>
            </a>
            <button
              onClick={() => setActiveTab('composer')}
              className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-medium hover:bg-brand-700 flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <PenLine className="w-3.5 h-3.5" />
              <span>Yeni Yansıma Yaz</span>
            </button>
          </div>
        </div>

        {/* Limitation Notice */}
        <div className="p-3 bg-bg-subtle/80 border border-border-subtle rounded-xl text-xs text-text-tertiary flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
          <span>
            <strong>Bilimsel Hatırlatma:</strong> Günlük kayıtları kişisel öz-bildirimlerdir; psikometrik
            ölçüm yerine geçmez. Profilinizi anlamlandırmanıza yardımcı olan gözlemsel bir katmandır.
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle pb-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'timeline'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-surface-1 text-text-secondary border border-border-subtle hover:bg-surface-2'
            }`}
          >
            Son Kayıtlar ({entries.length})
          </button>
          <button
            onClick={() => setActiveTab('composer')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'composer'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-surface-1 text-text-secondary border border-border-subtle hover:bg-surface-2'
            }`}
          >
            Yansıma Yaz
          </button>
          <button
            onClick={() => setActiveTab('themes')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'themes'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-surface-1 text-text-secondary border border-border-subtle hover:bg-surface-2'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tekrarlayan Temalar ({summary?.repeatedThemes.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('profileLinks')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'profileLinks'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-surface-1 text-text-secondary border border-border-subtle hover:bg-surface-2'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Profilimle Bağlantılar</span>
          </button>
        </div>

        {/* Filter dropdowns when on timeline tab */}
        {activeTab === 'timeline' && entries.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-text-tertiary" />
            <select
              value={selectedContext}
              onChange={(e) => setSelectedContext(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-surface-1 border border-border-subtle text-text-secondary"
            >
              <option value="ALL">Tüm Bağlamlar</option>
              {VALID_JOURNAL_CONTEXT_TAGS.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tab Contents */}
      {activeTab === 'composer' && (
        <JournalComposer onEntryCreated={handleEntryCreated} />
      )}

      {activeTab === 'timeline' && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12 bg-surface-1 rounded-2xl border border-border-subtle text-xs text-text-tertiary">
              Yansımalar yükleniyor...
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center py-16 bg-surface-1 border border-border-subtle rounded-3xl p-6 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
                <PenLine className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-text-primary">
                  Henüz bir yansıma kaydın yok.
                </h3>
                <p className="text-xs text-text-tertiary max-w-sm mx-auto leading-relaxed">
                  Günün getirdiklerini, aldığın kararları veya hissettiğin duyguları not ederek başla.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('composer')}
                className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-medium hover:bg-brand-700 transition-colors shadow-xs"
              >
                İlk Yansımamı Yaz
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredEntries.map((entry) => (
                <JournalTimelineCard key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'themes' && (
        <JournalRepeatedThemesPanel
          contextFrequencies={summary?.contextFrequencies || []}
          repeatedThemes={summary?.repeatedThemes || []}
          multiContextThemes={summary?.multiContextThemes || []}
        />
      )}

      {activeTab === 'profileLinks' && (
        <JournalProfileLinksPanel summary={summary} />
      )}
    </div>
  );
};
