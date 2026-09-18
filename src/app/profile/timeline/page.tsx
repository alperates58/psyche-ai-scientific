import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUserOrNull } from '@/lib/auth';
import { getUserLongitudinalProfile } from '@/services/longitudinalService';
import { PageContainer } from '@/components/ui/PageContainer';
import { ProfileTimelineClient } from '@/components/profile/timeline/ProfileTimelineClient';
import { Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ProfileTimelinePage() {
  // 1. Authenticated User Check
  const user = await getCurrentUserOrNull();
  if (!user) {
    redirect('/login?callbackUrl=/profile/timeline');
  }
  if (user.status === 'PENDING_VERIFICATION') {
    redirect('/verify-email');
  }

  // 2. Fetch authoritative Longitudinal Profile V1
  const longitudinalProfile = await getUserLongitudinalProfile(user.id);

  return (
    <PageContainer variant="wide" className="space-y-6 pb-16">
      {/* Header & Back Navigation */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Link href="/profile" className="flex items-center gap-1 hover:text-slate-800">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Bütünsel Profil</span>
            </Link>
            <span>/</span>
            <span className="text-slate-700">Zaman Çizgisi & Değişim Takibi</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Profil Zaman Çizgisi & Değişim Takibi
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Farklı ölçüm dönemlerinde tamamlanan değerlendirmeler üzerinden kararlılık, gözlenen puan farklılıkları ve keşif kapsamının gelişimi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/profile"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            Mevcut Profil
          </Link>
          <Link
            href="/assessments"
            className="rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-700 shadow-sm"
          >
            Değerlendirmelere Git
          </Link>
        </div>
      </div>

      {/* Main Longitudinal Timeline View */}
      <ProfileTimelineClient longitudinalProfile={longitudinalProfile} />
    </PageContainer>
  );
}
