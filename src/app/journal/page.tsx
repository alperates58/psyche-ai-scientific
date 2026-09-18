import { redirect } from 'next/navigation';
import { getCurrentUserOrNull } from '@/lib/auth';
import { JournalMasterClient } from '@/components/journal/JournalMasterClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Yansımalarım | PsycheAI',
  description: 'Kişisel yansımalar, günlük gözlemler ve psikolojik profil bağlantıları.',
};

export default async function JournalPage() {
  const user = await getCurrentUserOrNull();

  if (!user) {
    redirect('/login?callbackUrl=/journal');
  }

  return <JournalMasterClient />;
}
