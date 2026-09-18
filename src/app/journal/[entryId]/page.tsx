import { notFound, redirect } from 'next/navigation';
import { getCurrentUserOrNull } from '@/lib/auth';
import { getJournalEntryById } from '@/services/journalService';
import { JournalDetailClient } from '@/components/journal/JournalDetailClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Params {
  params: { entryId: string };
}

export default async function JournalDetailPage({ params }: Params) {
  const user = await getCurrentUserOrNull();

  if (!user) {
    redirect(`/login?callbackUrl=/journal/${params.entryId}`);
  }

  const entry = await getJournalEntryById(user.id, params.entryId);

  if (!entry) {
    notFound();
  }

  return <JournalDetailClient initialEntry={entry} />;
}
