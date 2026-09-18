import React from 'react';
import Link from 'next/link';
import { PageContainer } from '@/components/ui/PageContainer';
import { Compass, Brain, Layers, ArrowRight, Eye, Sparkles, BookOpen, Clock, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Nasıl Çalışır? — PsycheAI',
  description: 'PsycheAI 3 katmanlı bilgi modeli, yapılandırılmış değerlendirmeler ve çok kuramlı analiz süreci.',
};

export default function HowItWorksPage() {
  return (
    <PageContainer variant="wide" className="py-12 sm:py-16 space-y-16">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>DENEYİM MİMARİSİ</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
          Ölçümden Anlama: 3 Katmanlı Bilgi Modeli
        </h1>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          Karmaşık psikometrik verileri doğrudan kullanıcının önüne dökmek yerine,
          kademeli açılım (progressive disclosure) ilkesiyle her detayı anlaşılır bir hiyerarşide sunuyoruz.
        </p>
      </div>

      {/* 3-Layer Visual Journey */}
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Layer 1 */}
        <div className="p-6 sm:p-8 rounded-3xl bg-bg-surface border border-border-default shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-brand-primary bg-brand-primary/10 px-2.5 py-0.5 rounded-full">
              <span>KATMAN 1</span>
              <span>•</span>
              <span>BENİ ANLA (UNDERSTAND ME)</span>
            </div>
            <h3 className="text-xl font-bold text-text-primary">Sıcak, İnsanî ve Açık Anlatım</h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Öne çıkan eğilimlerinizin günlük hayatta, ilişkilerde, karar alma süreçlerinde ve stres anlarında nasıl yansıdığını sade bir Türkçe ile açıklar.
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
            <Eye className="w-6 h-6" />
          </div>
        </div>

        {/* Layer 2 */}
        <div className="p-6 sm:p-8 rounded-3xl bg-bg-surface border border-border-default shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">
              <span>KATMAN 2</span>
              <span>•</span>
              <span>PROFİLİMİ KEŞFET (EXPLORE MY PROFILE)</span>
            </div>
            <h3 className="text-xl font-bold text-text-primary">Görsel Haritalar ve Boyutlar Arası Etkileşimler</h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Psikolojik İmzanız (polar radar), 11 Alan Çarkı, Isı Haritası ve özellikler arasındaki içsel gerilim ve dengeleri etkileşimli grafiklerle keşfedin.
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <Compass className="w-6 h-6" />
          </div>
        </div>

        {/* Layer 3 */}
        <div className="p-6 sm:p-8 rounded-3xl bg-bg-surface border border-border-default shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
              <span>KATMAN 3</span>
              <span>•</span>
              <span>BİLİMSEL DETAY (SCIENTIFIC DETAIL)</span>
            </div>
            <h3 className="text-xl font-bold text-text-primary">Ham Puanlar, Metodoloji ve Kaynaklar</h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              İlgilenen araştırmacı ve kullanıcılar için 1–5 ham skorlar, madde sayıları, ölçek form sürümleri ve epistemik geçerlilik detayları şeffaf bir çekmecede sunulur.
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4 pt-4">
        <Link
          href="/register"
          className="inline-flex items-center px-6 py-3.5 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white text-sm font-bold shadow-md transition-all"
        >
          <span>Değerlendirmeye Başla</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </PageContainer>
  );
}
