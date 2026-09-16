import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUserOrNull } from '@/lib/auth';
import { getUserAssessmentJourney } from '@/services/assessmentJourneyService';
import { PageContainer } from '@/components/ui/PageContainer';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Lock,
  Clock,
  Layers,
  HeartHandshake,
  HelpCircle,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function OnboardingPage() {
  const user = await getCurrentUserOrNull();
  if (!user) {
    redirect('/login?callbackUrl=/onboarding');
  }

  const journey = await getUserAssessmentJourney(user.id);

  // If user already completed core profile, send them to overview
  if (journey.coreProfileReady) {
    redirect('/overview');
  }

  const nextAction = journey.nextAction;
  const startUrl = nextAction ? nextAction.url : '/assessment';

  return (
    <PageContainer variant="standard" className="py-8 sm:py-12 space-y-10 max-w-3xl mx-auto">
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 font-bold text-2xl shadow-xs mx-auto">
          Ψ
        </div>
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-brand-700 bg-brand-50/80 px-3 py-1 rounded-full border border-brand-200/50">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Kişiselleştirilmiş Psikolojik Haritalama</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-text-primary">
            Psikolojik profilini oluşturmaya başlayalım
          </h1>
          <p className="text-sm sm:text-base text-text-secondary max-w-xl mx-auto leading-relaxed">
            Hoş geldin, <strong className="text-text-primary">{user.name}</strong>. PsycheAI, kişiliğinizi, duygu dinamiklerinizi ve karar örüntülerinizi bilimsel modellerle adım adım haritalandırır.
          </p>
        </div>
      </div>

      {/* Guiding Principles Grid (Calm, Trustworthy, Non-Clinical) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-surface-1 border border-border-subtle shadow-xs space-y-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-50 border border-brand-200/60 flex items-center justify-center text-brand-700 font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-text-primary">Kademeli Gelişim</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Profiliniz tek bir testle sınırlandırılmaz; tamamladığınız her değerlendirmeyle daha derin ve bütüncül hale gelir.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-1 border border-border-subtle shadow-xs space-y-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-700 font-bold">
            <HeartHandshake className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-text-primary">Doğru ya da Yanlış Yok</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Bu bir sınav veya performans testi değildir. Kendinizi olduğunuz gibi yansıtmanız en güvenilir sonucu sağlar.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-1 border border-border-subtle shadow-xs space-y-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700 font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-text-primary">Klinik Tanı Değildir</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Sonuçlar tıbbi veya psikiyatrik bir teşhis içermez; bilimsel bir öz-farkındalık ve psikolojik gelişim aracıdır.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-1 border border-border-subtle shadow-xs space-y-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200/60 flex items-center justify-center text-purple-700 font-bold">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-text-primary">Veri Güvenliği & Gizlilik</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Yanıtlarınız şifrelenerek saklanır, üçüncü taraflarla paylaşılmaz ve yalnızca profilinizi oluşturmak için kullanılır.
          </p>
        </div>
      </div>

      {/* Starting Journey Sequence Card */}
      <div className="bg-surface-1 border border-border-subtle rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-4">
          <div>
            <h2 className="text-base font-bold text-text-primary tracking-tight">
              Başlangıç Yolculuğun
            </h2>
            <p className="text-xs text-text-tertiary mt-0.5">
              Temel profilinizi tamamlamak için gereken adımlar
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200/60 self-start sm:self-auto">
            {journey.completedAssessmentsCount} / {journey.requiredAssessments.length} Tamamlandı
          </span>
        </div>

        {/* Real Required Steps List */}
        <div className="space-y-3">
          {journey.requiredAssessments.map((item, index) => {
            const isDone = item.status === 'COMPLETED';
            const isInProg = item.status === 'IN_PROGRESS';
            const isNext = nextAction?.assessment.moduleId === item.moduleId;

            return (
              <div
                key={item.moduleId}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                  isNext
                    ? 'bg-brand-50/40 border-brand-300 ring-2 ring-brand-500/20'
                    : isDone
                    ? 'bg-emerald-50/30 border-emerald-200'
                    : 'bg-surface-2/60 border-border-subtle opacity-75'
                }`}
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : isNext
                        ? 'bg-brand-600 text-white'
                        : 'bg-surface-2 text-text-tertiary border border-border-subtle'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-text-primary truncate">
                        {item.title}
                      </h4>
                      {isNext && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-600 text-white">
                          Sıradaki Adım
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-tertiary truncate mt-0.5">
                      {item.recommendationReason}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0 text-xs">
                  <span className="hidden sm:inline-flex items-center text-text-tertiary">
                    <Clock className="w-3.5 h-3.5 mr-1 text-brand-600" />
                    ~{item.estimatedMinutes} dk
                  </span>
                  {isDone ? (
                    <span className="text-emerald-700 font-semibold text-xs">Tamamlandı</span>
                  ) : (
                    <Link
                      href={item.startOrResumeUrl}
                      className={`inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isNext
                          ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-xs'
                          : 'bg-surface-2 hover:bg-bg-subtle text-text-primary border border-border-subtle'
                      }`}
                    >
                      {isInProg ? 'Devam Et' : 'Başla'}
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border-subtle">
          <Link
            href="/overview"
            className="text-xs font-semibold text-text-tertiary hover:text-text-primary transition-colors text-center sm:text-left min-h-[44px] flex items-center justify-center sm:justify-start"
          >
            Daha sonra devam et (Genel Bakışa Git)
          </Link>

          <Link
            href={startUrl}
            className="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold shadow-md shadow-brand-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] min-h-[48px]"
          >
            <span>
              {nextAction
                ? nextAction.status === 'IN_PROGRESS'
                  ? `Kaldığın Yerden Devam Et (${nextAction.title})`
                  : `İlk Adıma Başla (${nextAction.title})`
                : 'Değerlendirmeye Başla'}
            </span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
