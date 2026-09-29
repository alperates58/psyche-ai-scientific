import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Briefcase, ArrowLeft, Clock, Sparkles } from 'lucide-react';
import { getCurrentUserOrNull } from '@/lib/auth';
import { PageContainer } from '@/components/ui/PageContainer';
import { ProfileTabNav } from '@/components/profile/ProfileTabNav';

export const dynamic = 'force-dynamic';

export default async function CareerProfilePage() {
  const user = await getCurrentUserOrNull();
  if (!user) {
    redirect('/login?callbackUrl=/profile/career');
  }

  return (
    <PageContainer variant="wide" className="space-y-8 pb-16">
      <ProfileTabNav />

      <div className="max-w-2xl mx-auto py-12 text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center mx-auto shadow-xs">
          <Briefcase className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>Geliştirilme Aşamasında</span>
          </span>
          <h1 className="text-2xl font-bold text-text-primary">
            Kariyer ve İlgi Alanları Haritası (RIASEC)
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            Holland Tipolojisine (RIASEC) dayalı mesleki ilgi alanı haritalaması, uyumlu psikometrik değerlendirme modülü tamamlandığında aktive olacaktır. Henüz boş veya tahmini bir skor sunulmamaktadır.
          </p>
        </div>

        <div className="pt-2 flex justify-center gap-3">
          <Link
            href="/profile"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold shadow-xs hover:bg-brand-primary/90 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Profile Dön</span>
          </Link>
          <Link
            href="/assessments"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-1 border border-border-default text-text-primary text-xs font-semibold shadow-xs hover:bg-bg-subtle transition-all"
          >
            <span>Mevcut Değerlendirmeleri İncele</span>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
