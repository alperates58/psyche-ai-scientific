'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TheoryLensDefinition,
  TheorySource,
  TheoryInsightV1,
  TheoryChatMessage,
} from '@/types/theoryLens';
import { EpistemicSegmentBadge } from './EpistemicSegmentBadge';
import { TheoryEvidenceDrawer } from './TheoryEvidenceDrawer';
import { TheorySourcesList } from './TheorySourcesList';
import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  Send,
  MessageSquare,
  AlertCircle,
  HelpCircle,
  Scale,
  Brain,
  Layers,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

interface TheoryLensDetailClientProps {
  lens: TheoryLensDefinition;
  sources: TheorySource[];
  initialInsight: TheoryInsightV1;
}

export const TheoryLensDetailClient: React.FC<TheoryLensDetailClientProps> = ({
  lens,
  sources,
  initialInsight,
}) => {
  const [insight, setInsight] = useState<TheoryInsightV1>(initialInsight);
  const [messages, setMessages] = useState<TheoryChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isChatLoading) return;

    const userMessageId = `msg_user_${Date.now()}`;
    const userMsg: TheoryChatMessage = {
      id: userMessageId,
      role: 'user',
      content: query.trim(),
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/theory-council/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lensId: lens.lensId,
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          message: query.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.response) {
          const botMsg: TheoryChatMessage = {
            id: `msg_bot_${Date.now()}`,
            role: 'assistant',
            content: data.response.replyTr,
            epistemicSegments: data.response.epistemicSegments,
            evidenceRefs: data.response.evidenceRefs,
            sourcesUsed: data.response.sourcesUsed,
            isFallback: data.response.isFallback,
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, botMsg]);
        }
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Mesaj gönderilirken bir hata oluştu.');
      }
    } catch (err) {
      console.error('Chat error:', err);
      alert('Diyalog servisine bağlanırken bir hata oluştu.');
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const response = await fetch('/api/theory-council/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lensId: lens.lensId }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.insight) {
          setInsight(data.insight);
        }
      }
    } catch (err) {
      console.error('Regenerate error:', err);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Link
          href="/theory-council"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-slate-300 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Tüm Kuramlar Konsili&apos;ne Dön
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/theory-council/compare"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 transition-all border border-indigo-200 dark:border-indigo-800"
          >
            <Scale className="w-3.5 h-3.5" />
            Bu Kuramı Karşılaştır
          </Link>
          <button
            type="button"
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:border-slate-300 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            Yeniden Değerlendir
          </button>
        </div>
      </div>

      {/* Lens Header Banner */}
      <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300">
                {lens.historicalPeriod}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {lens.theoreticalTradition}
              </span>
              {insight.isFallback && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                  Deterministik Kuramsal Sentez
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {lens.displayNameTr}
            </h1>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {lens.theoristName} — <em>{lens.shortDescriptionTr}</em>
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
          {lens.historicalContextTr}
        </p>

        {/* Core Concepts */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Merceğin Temel Kavramları:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {lens.coreConcepts.map((concept) => (
              <div
                key={concept.conceptId}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 space-y-1"
              >
                <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {concept.nameTr}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {concept.definitionTr}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Analysis Section */}
      <div className="space-y-6">
        <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              Gözlem ve Kuramsal Okuma
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {insight.titleTr}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {insight.summaryTr}
            </p>
          </div>

          {/* Epistemic Segments */}
          {insight.epistemicSegments && insight.epistemicSegments.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Epistemik İddia Katmanları (Veri vs Yorum):
              </div>
              <div className="space-y-2.5">
                {insight.epistemicSegments.map((segment, idx) => (
                  <EpistemicSegmentBadge key={idx} segment={segment} />
                ))}
              </div>
            </div>
          )}

          {/* Perspective Analysis Text */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Derinlemesine Kuramsal Değerlendirme
            </h3>
            <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 whitespace-pre-line">
              {insight.perspectiveAnalysisTr}
            </div>
          </div>

          {/* Identified Tensions/Synergies */}
          {insight.identifiedTensionsAndSynergiesTr && (
            <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              <h4 className="font-bold text-indigo-900 dark:text-indigo-200 text-sm flex items-center gap-2">
                <Scale className="w-4 h-4" />
                Kuramsal Denge ve Zıtlık Analizi
              </h4>
              <p className="leading-relaxed">{insight.identifiedTensionsAndSynergiesTr}</p>
            </div>
          )}

          {/* Evidence Drawer ("Bu yorum neye dayanıyor?") */}
          <TheoryEvidenceDrawer facets={insight.groundedFacetDetails || []} />

          {/* Limitations Alerts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 space-y-2 text-xs">
              <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Tarihsel Kuram Sınırlılıkları
              </div>
              <ul className="list-disc list-inside space-y-1 text-amber-800 dark:text-amber-300">
                {lens.historicalLimitations.map((lim, i) => (
                  <li key={i}>{lim}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 space-y-2 text-xs">
              <div className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-blue-600" />
                Modern Ampirik Kanıt Çerçevesi
              </div>
              <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-300">
                {lens.modernEvidenceLimitations.map((lim, i) => (
                  <li key={i}>{lim}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Canonical Literature & Sources */}
          <TheorySourcesList sources={sources} />
        </div>
      </div>

      {/* Interactive Dialogue Section */}
      <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            <MessageSquare className="w-3.5 h-3.5" />
            İnteraktif Kuramsal Diyalog
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {lens.theoristName} ile Yansıtıcı Düşünce Alanı
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ölçülen profilinizi daha derin kavramak için sorular sorabilir veya kuramın yansıtıcı soruları üzerinden düşünebilirsiniz.
          </p>
        </div>

        {/* Reflection Prompts Chips */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" />
            Önerilen Düşünme Soruları:
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {lens.reflectionPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                disabled={isChatLoading}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 transition-all text-left"
              >
                &ldquo;{prompt}&rdquo;
              </button>
            ))}
          </div>
        </div>

        {/* Message Stream */}
        {messages.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 max-h-[500px] overflow-y-auto pr-1">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 rounded-2xl space-y-2 text-sm ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white ml-8 sm:ml-16 rounded-br-none'
                    : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 mr-8 sm:mr-16 rounded-bl-none'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold opacity-80 mb-1">
                  <span>{msg.role === 'user' ? 'Siz' : lens.theoristName}</span>
                  <span className="font-normal font-mono text-[10px]">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="leading-relaxed whitespace-pre-line">{msg.content}</p>

                {msg.epistemicSegments && msg.epistemicSegments.length > 0 && (
                  <div className="pt-2 space-y-1.5">
                    {msg.epistemicSegments.map((seg, i) => (
                      <EpistemicSegmentBadge key={i} segment={seg} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Chat Input */}
        <div className="space-y-3 pt-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`${lens.theoristName} merceğinden sormak istediğiniz bir konu veya durum yazın...`}
              disabled={isChatLoading}
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isChatLoading}
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
            >
              {isChatLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Gönder</span>
            </button>
          </form>

          <p className="text-[11px] text-slate-400 text-center">
            <strong>Etik & Bilimsel Uyarı:</strong> Bu diyalog alanı klinik teşhis veya psikoterapi seansı değildir; kişisel farkındalık ve felsefi/kuramsal derinleşme amaçlıdır.
          </p>
        </div>
      </div>
    </div>
  );
};
