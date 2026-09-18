import React from 'react';
import Link from 'next/link';
import { PageContainer } from '@/components/ui/PageContainer';
import { ShieldCheck, Compass, Brain, Layers, ArrowRight, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export const metadata = {
  title: 'Bilimsel Yaklaşım & Metodoloji — PsycheAI',
  description: 'PsycheAI kanıta dayalı psikometrik ölçüm mimarisi, epistemik ayrım ilkesi ve veri güvenliği.',
};

export default function SciencePage() {
  return (
    <PageContainer variant="wide" className="py-12 sm:py-16 space-y-16">
      {/* Hero Section */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>BİLİMSEL YÖNETİŞİM VE STANDARTLAR</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
          Ölçüm Bilimi ve Epistemik Ayrım
        </h1>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          PsycheAI, ampirik psikometrik ölçüm ile kuramsal yorumlamayı kesin ve şeffaf sınırlarla birbirinden ayırır.
          Yapay zekâ asla skor üretmez; yalnızca ölçülmüş ampirik kanıtları anlaşılır bir dille açıklar.
        </p>
      </div>

      {/* Core Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-bg-surface p-6 rounded-2xl border border-border-default shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            1
          </div>
          <h3 className="text-base font-bold text-text-primary">Master Model Mimarisi</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            11 psikolojik alan, 37 yapı ve 91 alt boyuttan oluşan kapsamlı bir ontolojiye dayanır.
            Boyutlar arası etkileşimler keyfi değil, literatürdeki kanıtlanmış kurallara göre modellenir.
          </p>
        </div>

        <div className="bg-bg-surface p-6 rounded-2xl border border-border-default shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            2
          </div>
          <h3 className="text-base font-bold text-text-primary">Deterministik Hesaplama</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Puanlarınız ve ölçek konumlarınız matematiksel psikometrik algoritmalarla hesaplanır.
            Yapay zekâ modelleri puanları değiştiremez, tahmin yürütemez veya uyduramaz.
          </p>
        </div>

        <div className="bg-bg-surface p-6 rounded-2xl border border-border-default shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            3
          </div>
          <h3 className="text-base font-bold text-text-primary">Tanısal Olmayan Yaklaşım</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Platform klinik tanı, psikopatoloji teşhisi veya tıbbi tedavi amacı taşımaz.
            Amaç bireysel öz-farkındalık, güçlü yönleri anlama ve dengeli gelişimdir.
          </p>
        </div>
      </div>

      {/* Pre-calibration Transparency */}
      <div className="p-8 rounded-3xl bg-bg-subtle border border-border-default space-y-4">
        <div className="flex items-center space-x-2 text-text-primary font-bold text-lg">
          <AlertCircle className="w-5 h-5 text-brand-primary" />
          <h2>Ön Kalibrasyon ve Norm Şeffaflığı</h2>
        </div>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-4xl">
          PsycheAI, doğrulanmamış nüfus ortalamaları veya uydurma yüzdelik (percentile) iddialarında bulunmaz.
          Sonuçlar, yanıtlarınızın 1–5 ölçüm ölçeğindeki mutlak konumunu (Örn: "orta-üst bölge", "yüksek uca yakın") yansıtır.
          Temsili norm verisi oluşana kadar tüm skorlar şeffaf biçimde yerel ölçek bazında raporlanır.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4 pt-4">
        <Link
          href="/register"
          className="inline-flex items-center px-6 py-3.5 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white text-sm font-bold shadow-md transition-all"
        >
          <span>Profilinizi Keşfetmeye Başlayın</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </PageContainer>
  );
}
