'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Sparkles,
  Layers,
  Clock,
  Tag,
  Trash2,
  Edit3,
  RefreshCw,
  HelpCircle,
  ShieldCheck,
  Flag,
  AlertTriangle,
  Sliders,
} from 'lucide-react';
import {
  JournalEntryV1,
  JournalInsightV1,
  JournalProfileRelationshipV1,
  JournalContextTag,
  JournalEntryType,
  VALID_JOURNAL_CONTEXT_TAGS,
} from '@/types/journal';

interface JournalDetailClientProps {
  initialEntry: JournalEntryV1;
}

export const JournalDetailClient: React.FC<JournalDetailClientProps> = ({ initialEntry }) => {
  const router = useRouter();
  const [entry, setEntry] = useState<JournalEntryV1>(initialEntry);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState(entry.title || '');
  const [editBody, setEditBody] = useState(entry.body);
  const [editType, setEditType] = useState<JournalEntryType>(entry.entryType);
  const [editContextTags, setEditContextTags] = useState<JournalContextTag[]>(entry.contextTags);
  const [editMood, setEditMood] = useState<number | null>(entry.moodSelfReport ?? null);
  const [editEnergy, setEditEnergy] = useState<number | null>(entry.energySelfReport ?? null);
  const [editStress, setEditStress] = useState<number | null>(entry.stressSelfReport ?? null);
  const [editLifeEvent, setEditLifeEvent] = useState(entry.isLifeEvent);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const latestInsight = entry.insights?.[0];

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBody.trim()) {
      setErrorMsg('Yansıma metni boş olamaz.');
      return;
    }

    try {
      const res = await fetch(`/api/journal/${entry.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle.trim() || null,
          body: editBody.trim(),
          entryType: editType,
          contextTags: editContextTags,
          moodSelfReport: editMood,
          energySelfReport: editEnergy,
          stressSelfReport: editStress,
          isLifeEvent: editLifeEvent,
        }),
      });

      if (!res.ok) throw new Error('Güncelleme başarısız.');
      const updated = await res.json();
      setEntry(updated);
      setIsEditing(false);

      // Trigger re-analysis after edit invalidation
      handleGenerateInsight();
    } catch (err: any) {
      setErrorMsg(err.message || 'Hata oluştu.');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Bu yansıma kaydını silmek istediğinize emin misiniz?')) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/journal/${entry.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/journal');
      } else {
        alert('Kayıt silinemedi.');
      }
    } catch {
      alert('Silme işlemi sırasında bir hata oluştu.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleGenerateInsight = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/journal/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entryId: entry.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setEntry((prev) => ({
          ...prev,
          insights: [data.insight],
          relationships: data.relationships,
        }));
      }
    } catch (err) {
      console.error('Insight generation error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleContextTag = (tag: JournalContextTag) => {
    setEditContextTags((prev) => {
      if (prev.includes(tag)) {
        const next = prev.filter((t) => t !== tag);
        return next.length > 0 ? next : ['GENERAL'];
      }
      return [...prev.filter((t) => t !== 'GENERAL'), tag];
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/journal"
          className="text-xs font-medium text-text-secondary hover:text-brand-600 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tüm Yansımalara Dön</span>
        </Link>

        <div className="flex items-center gap-2">
          {!isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 rounded-xl bg-surface-2 border border-border-subtle hover:bg-surface-3 text-text-secondary text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Düzenle</span>
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 hover:bg-red-100 text-red-600 text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Sil</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Entry Card */}
      <div className="bg-surface-1 border border-border-subtle rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        {isEditing ? (
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <h3 className="text-base font-semibold text-text-primary">Yansımayı Düzenle</h3>
            <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
              Not: Yansıma güncellendiğinde önceki yapay zeka çıkarımı geçersiz kılınır ve yeniden analiz edilir.
            </p>

            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Başlık..."
              className="w-full text-sm px-3.5 py-2 rounded-xl bg-surface-2 border border-border-subtle text-text-primary"
            />

            <textarea
              rows={6}
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              className="w-full text-sm p-3.5 rounded-xl bg-surface-2 border border-border-subtle text-text-primary leading-relaxed resize-y"
            />

            <div className="flex flex-wrap gap-1.5">
              {VALID_JOURNAL_CONTEXT_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleContextTag(tag)}
                  className={`text-xs px-2.5 py-1 rounded-lg border ${
                    editContextTags.includes(tag)
                      ? 'bg-brand-50 text-brand-700 border-brand-300 font-medium'
                      : 'bg-surface-1 text-text-tertiary border-border-subtle'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {errorMsg && <p className="text-xs text-red-600">{errorMsg}</p>}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl bg-surface-2 text-text-secondary text-xs"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-medium"
              >
                Kaydet & Yeniden Analiz Et
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                  {entry.entryType}
                </span>
                {entry.isLifeEvent && (
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                    <Flag className="w-3.5 h-3.5" />
                    Önemli Yaşam Olayı
                  </span>
                )}
              </div>

              <div className="text-xs text-text-tertiary flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {new Date(entry.createdAt).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>

            {entry.title && (
              <h1 className="text-lg font-bold text-text-primary">{entry.title}</h1>
            )}

            <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
              {entry.body}
            </div>

            {/* Tags & Ratings */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border-subtle text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-text-tertiary" />
                {entry.contextTags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-md bg-bg-subtle text-text-secondary border border-border-subtle"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 text-text-tertiary">
                {entry.moodSelfReport && (
                  <span>
                    Ruh Hali: <strong className="text-text-primary">{entry.moodSelfReport}/5</strong>
                  </span>
                )}
                {entry.energySelfReport && (
                  <span>
                    Enerji: <strong className="text-text-primary">{entry.energySelfReport}/5</strong>
                  </span>
                )}
                {entry.stressSelfReport && (
                  <span>
                    Stres: <strong className="text-text-primary">{entry.stressSelfReport}/5</strong>
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* AI Reflection Card */}
      <div className="bg-surface-1 border border-border-subtle rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-text-primary">Gözlemsel Yansıma Analizi</h2>
              <span className="text-[10px] text-text-tertiary font-mono">
                {latestInsight?.evidenceClass || 'OBSERVATIONAL_DATA'} • Motor {latestInsight?.engineVersion || 'v1.0.0'}
              </span>
            </div>
          </div>

          <button
            onClick={handleGenerateInsight}
            disabled={isAnalyzing}
            className="px-3 py-1.5 rounded-xl bg-surface-2 hover:bg-surface-3 text-text-secondary text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>Yeniden Değerlendir</span>
          </button>
        </div>

        {latestInsight ? (
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              {latestInsight.summaryTr}
            </p>

            {latestInsight.reflectivePrompt && (
              <div className="bg-brand-50/70 border border-brand-200/80 rounded-2xl p-4 text-xs text-brand-950 flex items-start gap-3">
                <HelpCircle className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold block">Düşünceyi Derinleştiren Soru:</span>
                  <span className="leading-relaxed">{latestInsight.reflectivePrompt}</span>
                </div>
              </div>
            )}

            {latestInsight.isFallback && (
              <div className="text-[11px] text-text-tertiary italic">
                * Bu analiz deterministik kural motoru tarafından üretilmiştir (Çevrimdışı / Güvenli Mod).
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-text-tertiary space-y-2">
            <p>Bu kayıt için henüz bir analiz oluşturulmadı.</p>
            <button
              onClick={handleGenerateInsight}
              disabled={isAnalyzing}
              className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-medium"
            >
              Analiz Oluştur
            </button>
          </div>
        )}
      </div>

      {/* Evidence Transparency ("Bu yorum neye dayanıyor?") */}
      <div className="bg-bg-subtle/70 border border-border-subtle rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-text-primary uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-brand-600" />
          <span>Bu Yorum Neye Dayanıyor? (Kanıt Şeffaflığı)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-surface-1 p-4 rounded-2xl border border-border-subtle space-y-1.5">
            <span className="text-[11px] font-semibold text-text-tertiary uppercase">GÜNLÜK KAYDI</span>
            <p className="text-text-secondary text-[11px] leading-relaxed">
              Kullanıcının {entry.contextTags.join(', ')} bağlamında oluşturduğu öz-bildirim metni ve durum derecelendirmeleri.
            </p>
          </div>

          <div className="bg-surface-1 p-4 rounded-2xl border border-border-subtle space-y-1.5">
            <span className="text-[11px] font-semibold text-text-tertiary uppercase">ÖLÇÜM DAYANAĞI</span>
            <p className="text-text-secondary text-[11px] leading-relaxed">
              {entry.relationships?.length || 0} master boyut ile kurulan gözlemsel ilişki. Puanlar değiştirilmez, bağlamsal paralellik aranır.
            </p>
          </div>

          <div className="bg-surface-1 p-4 rounded-2xl border border-border-subtle space-y-1.5">
            <span className="text-[11px] font-semibold text-text-tertiary uppercase">GÖZLEM STATÜSÜ</span>
            <p className="text-text-secondary text-[11px] leading-relaxed">
              Tekil öz-bildirim (USER_REPORTED_CONTEXT). En az 3 kayıt ve 2 farklı günde tekrarlandığında tekrarlanan tema olarak değerlendirilir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
