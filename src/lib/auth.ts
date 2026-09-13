import { prisma } from './prisma';

export interface AuthUser {
  id: string;
  email: string | null;
  name: string;
  isDemoUser: boolean;
}

/**
 * Server-side user identity abstraction.
 * Resolves the primary test user (Alex Mercer) or creates if missing.
 * Prevents client-side identity spoofing.
 */
export async function getCurrentUser(): Promise<AuthUser> {
  const user = await prisma.user.findFirst({
    where: { isDemoUser: true },
    orderBy: { createdAt: 'asc' }
  });

  if (user) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      isDemoUser: user.isDemoUser
    };
  }

  // Fallback if database was cleared without seeding
  const created = await prisma.user.create({
    data: {
      id: 'usr_alex_mercer_demo',
      email: 'alex.mercer@psycheai.internal',
      name: 'Alex Mercer',
      isDemoUser: true
    }
  });

  return {
    id: created.id,
    email: created.email,
    name: created.name,
    isDemoUser: created.isDemoUser
  };
}
