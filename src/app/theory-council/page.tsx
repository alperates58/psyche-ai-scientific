import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, ShieldCheck } from 'lucide-react';
import { EpistemicBadge } from '@/components/shared/EpistemicBadge';
import { PageContainer } from '@/components/ui/PageContainer';
import { getCurrentUserOrNull } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface TheoreticalLens {
  lensId: string;
  theoristName: string;
  title: string;
  perspective: string;
  epistemicStatus: 'THEORETICAL_INTERPRETATION' | 'HISTORICAL_FRAMEWORK';
  frameworkSummary: string;
  limitations: string;
}

const CANONICAL_THEORY_LENSES: TheoreticalLens[] = [
  {
    lensId: 'lens_rogers',
    theoristName: 'Carl Rogers',
    title: 'Birey Merkezli Yaklaşım / Benlik Uyumu',
    perspective: 'Benlik Uyumu ve Gelişimsel Potansiyel',
    epistemicStatus: 'THEORETICAL_INTERPRETATION',
    frameworkSummary: 'Gerçek benlik ile ideal benlik arasındaki mesafe ve koşulsuz olumlu kabulün kişilik gelişimindeki rolünü inceler.',
    limitations: 'Hümanistik gelişim kavramları fenomenolojik ve danışmanlık odaklıdır; ampirik örtük özellik puanları ile karıştırılmamalıdır.',
  },
  {
    lensId: 'lens_adler',
    theoristName: 'Alfred Adler',
    title: 'Bireysel Psikoloji',
    perspective: 'Yetkinlik Çabası ve Toplumsal İlgi',
    epistemicStatus: 'THEORETICAL_INTERPRETATION',
    frameworkSummary: 'Aşağılık duygusunun telafisi, üstünlük çabası ve toplumsal ilgi (Gemeinschaftsgefühl) dinamiklerini analiz eder.',
    limitations: 'Gaye ve amaç odaklı (teleolojik) yapılar kişisel gelişim için zengin açılımlar sunar ancak psikometrik ölçüm değişmezliği taşımaz.',
  },
  {
    lensId: 'lens_freud',
    theoristName: 'Sigmund Freud',
    title: 'Klasik Psikanaliz',
    perspective: 'Yapısal Çatışma ve Yüceltme (Süblimasyon)',
    epistemicStatus: 'THEORETICAL_INTERPRETATION',
    frameworkSummary: 'İd, ego ve süperego arasındaki yapısal gerilimleri ve bilinçdışı dürtülerin savunma mekanizmalarıyla dengelenmesini inceler.',
    limitations: 'Klasik psikanalitik dürtü modelleri, standart anket ve psikometri yöntemleriyle deneysel olarak yanlışlanamaz.',
  },
  {
    lensId: 'lens_maslow',
    theoristName: 'Abraham Maslow',
    title: 'Bütüncül Dinamikler',
    perspective: 'Gelişim ve İhtiyaç Değerleri',
    epistemicStatus: 'THEORETICAL_INTERPRETATION',
    frameworkSummary: 'Temel biyolojik ve güvenlik ihtiyaçlarından kendini gerçekleştirmeye uzanan gelişimsel yönelimleri irdeler.',
    limitations: 'Katı hiyerarşik ihtiyaç basamakları modern kültürlerarası araştırmalar tarafından ampirik olarak tam doğrulanmamıştır.',
  },
  {
    lensId: 'lens_james',
    theoristName: 'William James',
    title: 'İşlevselcilik ve Pragmatizm',
    perspective: 'Davranışsal Alışkanlıkların Uyum Sağlayıcı İşlevi',
    epistemicStatus: 'HISTORICAL_FRAMEWORK',
    frameworkSummary: 'Bilinç akışı ve davranış kalıplarının bireyin çevresel uyumuna sağladığı pratik faydayı ele alır.',
    limitations: 'İşlevselcilik, niceliksel bir puanlama sisteminden ziyade yönlendirici felsefi bir tutumdur.',
  },
  {
    lensId: 'lens_frankl',
    theoristName: 'Viktor Frankl',
    title: 'Logoterapi ve Varoluşsal Analiz',
    perspective: 'Anlam İstenci ve Değerler Yönelimi',
    epistemicStatus: 'THEORETICAL_INTERPRETATION',
    frameworkSummary: 'Zorlayıcı yaşam koşullarında dahi anlam bulma arayışını ve bireyin tavır alma özgürlüğünü merkeze alır.',
    limitations: 'Varoluşsal felsefeye dayalı kavramlar bireysel deneyim zenginliği sunar ancak standart test-tekrar test güvenirliği taşımaz.',
  },
  {
    lensId: 'lens_skinner',
    theoristName: 'B.F. Skinner',
    title: 'Radikal Davranışçılık',
    perspective: 'Pekiştirme Geçmişi ve Çevresel Koşullar',
    epistemicStatus: 'HISTORICAL_FRAMEWORK',
    frameworkSummary: 'Davranışın içsel varsayımsal yapılardan ziyade pekiştirme tarifeleri ve çevresel uyaranlar tarafından şekillenişini açıklar.',
    limitations: 'İçsel bilişsel ve duyuşsal süreçleri göz ardı ettiği için karmaşık insan deneyimini eksik açıklar.',
  },
  {
    lensId: 'lens_beck',
    theoristName: 'Aaron Beck',
    title: 'Bilişsel Yaklaşım',
    perspective: 'Bilişsel Şemalar ve Otomatik Düşünceler',
    epistemicStatus: 'THEORETICAL_INTERPRETATION',
    frameworkSummary: 'Temel inançlar, ara inançlar ve durumsal otomatik düşüncelerin duygu ve davranışlar üzerindeki etkilerini modeller.',
    limitations: 'Klinik bilişsel modeller psikopatolojiye odaklıdır; genel kişilik çeşitliliğini tanımlamakta sınırlı kalabilir.',
  },
];

export default async function TheoryCouncilPage() {
  const user = await getCurrentUserOrNull();

  return (
    <PageContainer variant="wide" className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-border-subtle pb-5">
        <Link
          href="/overview"
          className="inline-flex items-center text-xs font-semibold text-text-tertiary hover:text-text-primary transition-colors mb-2 min-h-[44px] py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1 shrink-0" />
          <span>Genel Bakışa Dön</span>
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Kuramlar Konseyi — Yorum Mercekleri</h1>
              <span className="text-[11px] sm:text-xs bg-surface-2 text-text-tertiary border border-border-subtle font-semibold px-2 py-0.5 rounded-full shrink-0">
                KURAMSAL ÇERÇEVE (EĞİTİMSEL)
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-1 max-w-3xl">
              Klasik psikoloji ekolleri ölçüm üretmez. Doğrulanmış ampirik verilerinize tamamlayıcı kavramsal açıklamalar getiren analitik okuma mercekleri olarak işlev görürler.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-surface-1 px-3 py-2 rounded-xl border border-border-subtle text-xs text-text-tertiary">
            <BookOpen className="w-4 h-4 text-brand-600 shrink-0" />
            <span>8 Klasik Kuram Aktif</span>
          </div>
        </div>
      </div>

      {/* Epistemic Principles Banner */}
      <div className="bg-brand-50/70 p-4 rounded-card border border-brand-200/60 flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
        <div className="text-xs text-text-secondary leading-relaxed">
          <span className="font-bold text-brand-800">Epistemik Sınır İlkesi:</span> Aşağıdaki kartların hiçbiri tıbbi tanı, psikiyatrik değerlendirme veya ampirik kişilik puanı temsil etmez. Kişiselleştirilmiş kuramsal analizler yalnızca değerlendirme oturumları tamamlandığında ampirik kanıt tabanıyla etkinleştirilir.
        </div>
      </div>

      {/* Cards Grid: 1 col on mobile, 2 col on tablet and desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {CANONICAL_THEORY_LENSES.map((lens) => (
          <div
            key={lens.lensId}
            className="bg-surface-1 p-4 sm:p-6 rounded-card border border-border-subtle shadow-xs hover:border-brand-200 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              {/* Theorist Header */}
              <div className="flex flex-col xs:flex-row items-start justify-between gap-2 mb-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-text-primary tracking-tight">
                    {lens.theoristName}
                  </h2>
                  <div className="text-xs font-semibold text-brand-600">{lens.title}</div>
                </div>
                <div className="shrink-0">
                  <EpistemicBadge status={lens.epistemicStatus} size="sm" />
                </div>
              </div>

              <div className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider mb-2">
                Temel Bakış Açısı: {lens.perspective}
              </div>

              {/* Framework Summary */}
              <p className="text-xs text-text-secondary leading-relaxed mb-3">
                {lens.frameworkSummary}
              </p>

              {/* Educational Interpretation Guard */}
              <div className="p-3 bg-surface-2 rounded-xl border border-border-subtle/80 text-xs text-text-tertiary leading-relaxed mb-4">
                <span className="font-semibold text-text-secondary block mb-1">Kişiselleştirilmiş Analiz Durumu:</span>
                Kişiselleştirilmiş kuramsal analiz için henüz yeterli psikometrik veri bulunmuyor. Değerlendirmenizi tamamladığınızda bu mercek ampirik verileriniz üzerinden etkinleşecektir.
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-border-subtle text-xs">
              {/* Grounded Attributes Guard */}
              <div>
                <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider block mb-1.5">
                  Dayandığı Ölçülmüş Nitelikler:
                </span>
                <span className="text-[11px] bg-bg-subtle text-text-tertiary px-2 py-0.5 rounded-md border border-border-subtle inline-block">
                  Henüz ölçülmedi (Değerlendirme bekleniyor)
                </span>
              </div>

              {/* Scientific Limitation */}
              <div className="bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/50 text-[11px] text-amber-900 leading-snug">
                <span className="font-semibold">Kuramsal Sınır:</span> {lens.limitations}
              </div>

              <div className="text-[10px] text-text-tertiary italic text-center pt-1">
                &ldquo;Bu bölüm kuramsal bir yorumdur; doğrulanmış psikometrik bir ölçüm değildir.&rdquo;
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
