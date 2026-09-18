'use client';

import React, { useState } from 'react';
import {
  PenLine,
  Send,
  Sparkles,
  AlertCircle,
  Tag,
  Sliders,
  Flag,
} from 'lucide-react';
import {
  JournalEntryType,
  JournalContextTag,
  JournalLifeEventType,
  VALID_JOURNAL_CONTEXT_TAGS,
  VALID_JOURNAL_ENTRY_TYPES,
  VALID_LIFE_EVENT_TYPES,
  JournalEntryV1,
} from '@/types/journal';

interface JournalComposerProps {
  onEntryCreated?: (entry: JournalEntryV1) => void;
}

const QUICK_PROMPTS = [
  { label: 'Bugün', text: 'Bugün seni en çok düşündüren ya da sende iz bırakan ne oldu?' },
  { label: 'İş & Kariyer', text: 'İş ortamında veya bir görev sırasında nasıl hissettin? Hangi durum seni zorladı?' },
  { label: 'İlişkiler', text: 'Birisiyle iletişiminde bugün fark ettiğin veya seni etkileyen bir anı yaz.' },
  { label: 'Karar', text: 'Yakın zamanda aldığın ya da almakta zorlandığın bir kararı düşün.' },
  { label: 'Stres', text: 'Bugün stres veya baskı hissettiğin bir anı ve buna verdiğin tepkiyi not et.' },
  { label: 'Hedefler', text: 'Önceliklerin veya kişisel hedeflerinle ilgili bir gözlemini yaz.' },
  { label: 'Kendim Hakkında', text: 'Bugün kendinle, tepkilerinle veya alışkanlıklarınla ilgili fark ettiğin bir şey neydi?' },
];

export const JournalComposer: React.FC<JournalComposerProps> = ({ onEntryCreated }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [entryType, setEntryType] = useState<JournalEntryType>('FREE_REFLECTION');
  const [contextTags, setContextTags] = useState<JournalContextTag[]>(['GENERAL']);
  const [userTagsInput, setUserTagsInput] = useState('');

  const [moodRating, setMoodRating] = useState<number | null>(null);
  const [energyRating, setEnergyRating] = useState<number | null>(null);
  const [stressRating, setStressRating] = useState<number | null>(null);

  const [isLifeEvent, setIsLifeEvent] = useState(false);
  const [lifeEventType, setLifeEventType] = useState<JournalLifeEventType>('OTHER');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleApplyPrompt = (promptText: string) => {
    setBody((prev) => (prev ? `${prev}\n\n${promptText}` : promptText));
  };

  const toggleContextTag = (tag: JournalContextTag) => {
    setContextTags((prev) => {
      if (prev.includes(tag)) {
        const next = prev.filter((t) => t !== tag);
        return next.length > 0 ? next : ['GENERAL'];
      } else {
        return [...prev.filter((t) => t !== 'GENERAL'), tag];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) {
      setErrorMsg('Lütfen bir yansıma metni yazın.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const userTags = userTagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim() || null,
          body: body.trim(),
          entryType,
          contextTags,
          userTags,
          moodSelfReport: moodRating,
          energySelfReport: energyRating,
          stressSelfReport: stressRating,
          isLifeEvent,
          lifeEventType: isLifeEvent ? lifeEventType : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Kayıt oluşturulamadı.');
      }

      const result = await res.json();
      setSuccessMsg('Yansımanız kaydedildi ve gözlem analizi tamamlandı.');
      setTitle('');
      setBody('');
      setContextTags(['GENERAL']);
      setUserTagsInput('');
      setMoodRating(null);
      setEnergyRating(null);
      setStressRating(null);
      setIsLifeEvent(false);

      if (onEntryCreated && result.entry) {
        onEntryCreated(result.entry);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface-1 border border-border-subtle rounded-2xl p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-border-subtle pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
            <PenLine className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-text-primary">Yeni Yansıma Yaz</h2>
            <p className="text-xs text-text-tertiary">
              Düşüncelerinizi ve deneyimlerinizi kaydedin. Bu kayıtlar psikometrik ölçüm yerine geçmez.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Prompts */}
      <div>
        <div className="text-xs font-semibold text-text-secondary mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-500" />
          <span>Hızlı Yansıma İpuçları</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_PROMPTS.map((qp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPrompt(qp.text)}
              className="text-xs px-2.5 py-1 rounded-lg bg-bg-subtle text-text-secondary hover:bg-brand-50 hover:text-brand-600 border border-border-subtle transition-colors"
            >
              {qp.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title & Entry Type */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Başlık (isteğe bağlı)..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border-subtle focus:outline-hidden focus:border-brand-500 text-text-primary placeholder:text-text-tertiary"
            />
          </div>
          <div>
            <select
              value={entryType}
              onChange={(e) => setEntryType(e.target.value as JournalEntryType)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border-subtle focus:outline-hidden focus:border-brand-500 text-text-primary"
            >
              <option value="FREE_REFLECTION">Serbest Yansıma</option>
              <option value="EVENT">Olay / Deneyim</option>
              <option value="EMOTION">Duygu Odaklı</option>
              <option value="DECISION">Karar Süreci</option>
              <option value="RELATIONSHIP">İlişki & İletişim</option>
              <option value="WORK">İş & Çalışma</option>
              <option value="GOAL">Hedef & Başarı</option>
              <option value="STRESS">Stres & Zorlanma</option>
              <option value="CHALLENGE">Meydan Okuma</option>
              <option value="SUCCESS">Kazanım / Başarı</option>
              <option value="OTHER">Diğer</option>
            </select>
          </div>
        </div>

        {/* Body */}
        <div>
          <textarea
            rows={5}
            placeholder="Aklındakileri, hissettiklerini veya bugün deneyimlediğin bir olayı serbestçe yaz..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full text-sm p-3.5 rounded-xl bg-surface-2 border border-border-subtle focus:outline-hidden focus:border-brand-500 text-text-primary placeholder:text-text-tertiary leading-relaxed resize-y"
          />
        </div>

        {/* Context Tags Selection */}
        <div>
          <div className="text-xs font-semibold text-text-secondary mb-2 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-text-tertiary" />
            <span>Bağlam Etiketleri</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {VALID_JOURNAL_CONTEXT_TAGS.map((tag) => {
              const isSelected = contextTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleContextTag(tag)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-brand-50 text-brand-700 border-brand-300 font-medium'
                      : 'bg-surface-1 text-text-tertiary border-border-subtle hover:text-text-secondary'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Subjective State Ratings (1-5) */}
        <div className="bg-bg-subtle/50 p-3.5 rounded-xl border border-border-subtle space-y-3">
          <div className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-text-tertiary" />
            <span>Öz-Bildirim Durum Değerlendirmeleri (1 - 5 İsteğe Bağlı)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Mood */}
            <div>
              <div className="text-text-secondary mb-1 flex justify-between">
                <span>Ruh Hali:</span>
                <span className="font-semibold text-text-primary">{moodRating || '-'}</span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setMoodRating(moodRating === val ? null : val)}
                    className={`flex-1 py-1 rounded-md text-xs font-medium border ${
                      moodRating === val
                        ? 'bg-brand-600 text-white border-brand-600'
                        : 'bg-surface-1 text-text-secondary border-border-subtle hover:bg-surface-2'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Energy */}
            <div>
              <div className="text-text-secondary mb-1 flex justify-between">
                <span>Enerji Düzeyi:</span>
                <span className="font-semibold text-text-primary">{energyRating || '-'}</span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setEnergyRating(energyRating === val ? null : val)}
                    className={`flex-1 py-1 rounded-md text-xs font-medium border ${
                      energyRating === val
                        ? 'bg-brand-600 text-white border-brand-600'
                        : 'bg-surface-1 text-text-secondary border-border-subtle hover:bg-surface-2'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Stress */}
            <div>
              <div className="text-text-secondary mb-1 flex justify-between">
                <span>Stres & Baskı:</span>
                <span className="font-semibold text-text-primary">{stressRating || '-'}</span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setStressRating(stressRating === val ? null : val)}
                    className={`flex-1 py-1 rounded-md text-xs font-medium border ${
                      stressRating === val
                        ? 'bg-brand-600 text-white border-brand-600'
                        : 'bg-surface-1 text-text-secondary border-border-subtle hover:bg-surface-2'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Life Event Checkbox */}
        <div className="flex items-center gap-4 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-text-secondary">
            <input
              type="checkbox"
              checked={isLifeEvent}
              onChange={(e) => setIsLifeEvent(e.target.checked)}
              className="rounded-sm text-brand-600 focus:ring-brand-500"
            />
            <span className="flex items-center gap-1 font-medium">
              <Flag className="w-3.5 h-3.5 text-text-tertiary" />
              Önemli bir Yaşam Olayı veya Dönüm Noktası
            </span>
          </label>

          {isLifeEvent && (
            <select
              value={lifeEventType}
              onChange={(e) => setLifeEventType(e.target.value as JournalLifeEventType)}
              className="text-xs px-2.5 py-1 rounded-lg bg-surface-2 border border-border-subtle text-text-primary"
            >
              <option value="JOB_CHANGE">İş / Kariyer Değişimi</option>
              <option value="RELOCATION">Taşınma / Şehir Değişimi</option>
              <option value="RELATIONSHIP_TRANSITION">İlişki Geçişi / Evlilik vb.</option>
              <option value="MAJOR_GOAL">Büyük Bir Hedefe Ulaşma</option>
              <option value="HIGH_STRESS_PERIOD">Yoğun Stresli Dönem</option>
              <option value="OTHER">Diğer Yaşam Olayı</option>
            </select>
          )}
        </div>

        {/* Status messages */}
        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs">
            {successMsg}
          </div>
        )}

        {/* Submit button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting || !body.trim()}
            className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-medium text-xs hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-xs transition-colors"
          >
            {isSubmitting ? (
              <span>Kaydediliyor & Analiz Ediliyor...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Yansımayı Kaydet</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
