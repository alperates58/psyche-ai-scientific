'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  Compass,
  Brain,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Layers,
  Heart,
  Users,
  Lightbulb,
  Clock,
  BookOpen,
  Activity,
  CheckCircle2,
  Lock,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  Target,
  Sun,
  Flame,
  Scale,
} from 'lucide-react';

export default function HomePage() {
  const { data: session } = useSession();
  const [activePreviewTab, setActivePreviewTab] = useState<'fingerprint' | 'radar' | 'wheel' | 'facets' | 'theory'>('fingerprint');

  const destinationHref = session?.user ? '/overview' : '/register';

  return (
    <div className="min-h-screen bg-bg-app text-text-primary selection:bg-brand-primary/20 selection:text-brand-primary">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-border-subtle">
        {/* Soft Radial Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-brand-primary/10 via-indigo-500/5 to-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Scientific Pill Tag */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold shadow-2xs animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Sparkles className="w-3.5 h-3.5" />
            <span>11 Alan • 37 Yapı • 91 Alt Boyutlu Psikolojik Mimari</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary max-w-4xl mx-auto leading-[1.15]">
            Kendini birkaç etiketle değil,{' '}
            <span className="bg-gradient-to-r from-brand-primary via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              çok boyutlu bir psikolojik haritayla
            </span>{' '}
            keşfet.
          </h1>

          {/* Supporting Subtext */}
          <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            PsycheAI; yapılandırılmış psikometrik ölçümü, görsel profillemeyi, yapay zekâ destekli derin anlamlandırmayı,
            boylamsal takibi ve 10 büyük psikoloji ekolünü bir araya getirir.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href={destinationHref}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-sm shadow-md shadow-brand-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98] min-h-[50px]"
            >
              <span>{session?.user ? 'Profilime Git' : 'Profilimi Keşfet'}</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            {!session?.user && (
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 rounded-2xl bg-surface-1 hover:bg-bg-subtle text-text-primary font-semibold text-sm border border-border-default shadow-xs transition-all min-h-[50px]"
              >
                <span>Giriş Yap</span>
              </Link>
            )}
          </div>

          {/* Governance Notice */}
          <div className="flex items-center justify-center space-x-2 text-xs text-text-tertiary pt-2">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Yapay zekâ puan üretmez; ölçülen sonuçları açık ve derin bir dille anlamlandırır.</span>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE PRODUCT PREVIEW SHOWCASE */}
      <section className="py-16 sm:py-24 bg-surface-1 border-b border-border-subtle">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              Kişisel Psikolojik Pasaportunuzu İnceleyin
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary">
              Aşağıdaki etkileşimli sekmeleri kullanarak PsycheAI profil motorunun örnek görünümünü deneyimleyin.
            </p>
          </div>

          {/* Preview Navigation Tabs */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 no-scrollbar text-xs">
            <button
              type="button"
              onClick={() => setActivePreviewTab('fingerprint')}
              className={`px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center space-x-2 shrink-0 ${
                activePreviewTab === 'fingerprint'
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'bg-bg-subtle text-text-secondary hover:text-text-primary border border-border-subtle'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Psikolojik İmza</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePreviewTab('radar')}
              className={`px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center space-x-2 shrink-0 ${
                activePreviewTab === 'radar'
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'bg-bg-subtle text-text-secondary hover:text-text-primary border border-border-subtle'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>HEXACO Radarı</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePreviewTab('wheel')}
              className={`px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center space-x-2 shrink-0 ${
                activePreviewTab === 'wheel'
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'bg-bg-subtle text-text-secondary hover:text-text-primary border border-border-subtle'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>11 Alan Çarkı</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePreviewTab('facets')}
              className={`px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center space-x-2 shrink-0 ${
                activePreviewTab === 'facets'
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'bg-bg-subtle text-text-secondary hover:text-text-primary border border-border-subtle'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Alt Boyut Kartları</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePreviewTab('theory')}
              className={`px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center space-x-2 shrink-0 ${
                activePreviewTab === 'theory'
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'bg-bg-subtle text-text-secondary hover:text-text-primary border border-border-subtle'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Kuramlar Konseyi</span>
            </button>
          </div>

          {/* Preview Canvas Container */}
          <div className="bg-bg-surface p-6 sm:p-10 rounded-3xl border border-border-default shadow-sm min-h-[420px] flex items-center justify-center">
            {activePreviewTab === 'fingerprint' && (
              <div className="w-full max-w-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                  <div>
                    <h3 className="text-base font-bold text-text-primary">Psikolojik İmzanız (Örnek Profil)</h3>
                    <p className="text-xs text-text-secondary">11 psikolojik alanda ölçülen alt boyutların görsel özeti</p>
                  </div>
                  <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                    Kişisel Koordinat Haritası
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  {[
                    { label: 'Zihinsel Merak', score: '4.35', band: 'Yüksek uca yakın', icon: Lightbulb },
                    { label: 'Duygusal Denge', score: '3.80', band: 'Orta-üst bölge', icon: Heart },
                    { label: 'Öz-Düzenleme', score: '4.10', band: 'Orta-üst bölge', icon: Target },
                    { label: 'Sosyal Cesaret', score: '2.90', band: 'Orta bölge', icon: Users },
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className="p-4 rounded-2xl bg-bg-subtle border border-border-subtle space-y-1">
                        <Icon className="w-5 h-5 mx-auto text-brand-primary" />
                        <div className="text-xs font-bold text-text-primary pt-1">{item.label}</div>
                        <div className="text-lg font-extrabold text-brand-primary">{item.score}</div>
                        <div className="text-[10px] text-text-secondary">{item.band}</div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 rounded-2xl bg-brand-primary/5 border border-brand-primary/20 text-xs text-text-secondary leading-relaxed">
                  <span className="font-bold text-text-primary">Profil Özeti İçgörüsü:</span> Yüksek zihinsel merakınız ve planlı öz-düzenleme eğiliminiz, soyut hedefleri disiplinle somut projelere dönüştürebilen dengeli bir stratejik yönelime işaret etmektedir.
                </div>
              </div>
            )}

            {activePreviewTab === 'radar' && (
              <div className="w-full max-w-xl text-center space-y-4">
                <h3 className="text-base font-bold text-text-primary">HEXACO Temel Kişilik Boyutları</h3>
                <p className="text-xs text-text-secondary">
                  Dürüstlük-Alçakgönüllülük, Duygusallık, Dışadönüklük, Uyumluluk, Sorumluluk ve Deneyime Açıklık
                </p>
                <div className="py-8 bg-bg-subtle rounded-2xl border border-dashed border-border-default flex items-center justify-center">
                  <div className="space-y-2">
                    <Compass className="w-12 h-12 text-brand-primary mx-auto opacity-80" />
                    <div className="text-xs font-semibold text-text-primary">6 Eksenli Çokgen Radarı</div>
                    <div className="text-[11px] text-text-secondary max-w-xs mx-auto">
                      Testi tamamladığınızda 24 alt boyutu besleyen 6 temel ekseniniz burada görselleştirilir.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === 'wheel' && (
              <div className="w-full max-w-3xl space-y-4">
                <div className="text-center space-y-1">
                  <h3 className="text-base font-bold text-text-primary">11 Master Psikoloji Alanı</h3>
                  <p className="text-xs text-text-secondary">Bütünsel benliğinizi oluşturan 11 temel araştırma sütunu</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {[
                    'Kişilik & Mizaç',
                    'Benlik Sistemi',
                    'Öz-Düzenleme & İrade',
                    'Duygu Düzenleme',
                    'Başa Çıkma & Dayanıklılık',
                    'Biliş & Karar Verme',
                    'Yaratıcılık & Merak',
                    'Motivasyon & Değerler',
                    'Sosyal & İlişkiler',
                    'İyi Oluş & Canlılık',
                    'Özel Boyutlar',
                  ].map((dom, i) => (
                    <div key={i} className="p-3 rounded-xl bg-bg-subtle border border-border-subtle text-xs font-semibold text-text-primary flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-brand-primary" />
                      <span className="truncate">{dom}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activePreviewTab === 'facets' && (
              <div className="w-full max-w-lg space-y-4">
                <div className="p-5 rounded-2xl bg-surface-1 border border-border-default shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="text-[11px] font-bold text-brand-primary uppercase tracking-wider flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>Yaratıcılık & Merak &rsaquo; Entelektüel Merak</span>
                      </div>
                      <h4 className="text-base font-bold text-text-primary">Zihinsel Merak ve Keşif</h4>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-extrabold text-brand-primary">4.30 <span className="text-xs font-normal text-text-tertiary">/ 5</span></div>
                      <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                        Yüksek uca yakın
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Karmaşık, soyut ve derin konuları anlama, yeni kuramlar keşfetme ve soru sorma konusundaki belirgin içsel isteğiniz.
                  </p>
                  <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-[11px] text-brand-primary font-semibold">
                    <span>Günlük Yaşam Yansımaları ve Sorular</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === 'theory' && (
              <div className="w-full max-w-2xl space-y-4 text-center">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>10 BÜYÜK KURAMCI MERCEĞİ</span>
                </div>
                <h3 className="text-base font-bold text-text-primary">
                  Profilinizi Tarihsel Psikoloji Ekolleriyle İnceleyin
                </h3>
                <p className="text-xs text-text-secondary max-w-md mx-auto">
                  Freud, Jung, Adler, Rogers, Maslow, Skinner, William James, Gestalt, Frankl ve Beck'in kuramsal kavramlarıyla ölçülmüş profilinizi farklı açılardan keşfedin.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (3-LAYER INFORMATION MODEL) */}
      <section className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">
            <span>YAKLAŞIMIMIZ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            Ölçümden Anlama: 3 Kademeli Deneyim
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            Kullanıcıyı teknik terimlerle boğmak yerine bilgiyi kademeli olarak açıyoruz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-1 p-6 rounded-3xl border border-border-default shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="text-base font-bold text-text-primary">Beni Anla</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Öne çıkan eğilimlerinizin günlük hayatta, ilişkilerde ve karar anlarında nasıl yansıdığını anlatan sıcak, insani özet.
            </p>
          </div>

          <div className="bg-surface-1 p-6 rounded-3xl border border-border-default shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="text-base font-bold text-text-primary">Profilimi Keşfet</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              İçsel dengeler, özellik etkileşimleri, 91 alt boyut ve zaman içindeki değişim izlerini gösteren görsel analizler.
            </p>
          </div>

          <div className="bg-surface-1 p-6 rounded-3xl border border-border-default shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="text-base font-bold text-text-primary">Bilimsel Detay</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              1–5 ham ölçek puanları, madde sayıları, form sürümleri ve epistemik geçerlilik şeffaflığı.
            </p>
          </div>
        </div>
      </section>

      {/* 4. SCIENTIFIC CREDIBILITY & PRIVACY */}
      <section className="py-16 sm:py-20 bg-surface-1 border-t border-border-subtle">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>GÜVENİLİR VE ŞEFFAF</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              Kişisel Veri Mahremiyeti ve Bilimsel Standartlar
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              PsycheAI, verilerinizi ticari veya reklam amaçlarıyla paylaşmaz.
              Yapay zekâya hiçbir kişisel veri (PII) aktarılmaz; yalnızca anonim eğilim skorları yorumlanır.
              Uydurma nüfus yüzdelikleri veya sahte güvenilirlik oranları üretilmez.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <Link
                href="/science"
                className="text-xs font-bold text-brand-primary hover:underline inline-flex items-center"
              >
                <span>Bilimsel Metodolojiyi İncele</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Link>
              <Link
                href="/privacy"
                className="text-xs font-bold text-text-secondary hover:underline"
              >
                Gizlilik Politikası
              </Link>
            </div>
          </div>

          <div className="bg-bg-subtle p-6 rounded-3xl border border-border-default space-y-4">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-bold text-text-primary">Deterministik Psikometrik Skorlama</div>
                <div className="text-[11px] text-text-secondary">Puanlar matematiksel algoritmalarla hesaplanır; yapay zekâ skor üretemez.</div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-bold text-text-primary">Klinik Olmayan Öz-Farkındalık</div>
                <div className="text-[11px] text-text-secondary">Teşhis ve patoloji etiketleri içermez; sağlıklı bireysel farkındalık odaklıdır.</div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-bold text-text-primary">Güvenli & Sıfır PII Altyapı</div>
                <div className="text-[11px] text-text-secondary">Sistem anahtarları AES-256-GCM ile korunur; yapay zekâya kişisel kimlik iletilmez.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CALL TO ACTION */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
          Kendi Psikolojik Haritanızı Keşfetmeye Hazır Mısınız?
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary max-w-xl mx-auto">
          Yapılandırılmış değerlendirmelere başlayarak 91 alt boyutta ayrıntılı profilinizi oluşturun.
        </p>
        <div className="pt-2">
          <Link
            href={destinationHref}
            className="inline-flex items-center px-8 py-4 rounded-2xl bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-sm shadow-lg shadow-brand-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{session?.user ? 'Profilime Devam Et' : 'Profilimi Keşfet'}</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
