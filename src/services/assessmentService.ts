import { prisma } from '@/lib/prisma';

export async function getOrCreateAssessmentSession(
  userId: string,
  moduleCode?: string
) {
  // Find published form version for this module (or fallback to default core module if omitted)
  let moduleRecord = null;

  if (moduleCode) {
    // 1. Direct search by code or id
    const cleanCode = moduleCode.trim();
    moduleRecord = await prisma.assessmentModule.findFirst({
      where: {
        OR: [
          { code: cleanCode },
          { id: cleanCode },
          { code: cleanCode.toLowerCase() },
          { code: cleanCode.toUpperCase() },
        ],
      },
      include: {
        formVersions: {
          where: { isPublished: true, status: 'PUBLISHED' },
          orderBy: [
            { versionCode: 'desc' },
            { publishedAt: 'desc' },
          ],
        },
      },
    });

    if (moduleRecord && moduleRecord.formVersions.length === 0) {
      throw new Error(`Bu değerlendirme modülünün içerik formu henüz hazırlanma aşamasındadır (${moduleCode})`);
    }
  }

  // Fallback if no module code provided: default to core personality module
  if (!moduleRecord || moduleRecord.formVersions.length === 0) {
    if (moduleCode) {
      throw new Error(`Aktif bir değerlendirme formu bulunamadı (${moduleCode})`);
    }

    moduleRecord = await prisma.assessmentModule.findFirst({
      where: {
        code: 'mod_core_hexaco_60',
        formVersions: {
          some: { isPublished: true, status: 'PUBLISHED' },
        },
      },
      include: {
        formVersions: {
          where: { isPublished: true, status: 'PUBLISHED' },
          orderBy: [
            { versionCode: 'desc' },
            { publishedAt: 'desc' },
          ],
        },
      },
    });
  }

  if (!moduleRecord || moduleRecord.formVersions.length === 0) {
    throw new Error(`Aktif bir değerlendirme formu bulunamadı (${moduleCode || 'Genel'})`);
  }

  // Prefer native form version if available
  const activeFormVersion =
    moduleRecord.formVersions.find((f) => f.versionCode === 'v1.0.0-psycheai-native') ||
    moduleRecord.formVersions[0];

  // Check if there is an in-progress or paused session for this user and form version
  const existingSession = await prisma.assessmentSession.findFirst({
    where: {
      userId,
      formVersionId: activeFormVersion.id,
      status: { in: ['IN_PROGRESS', 'PAUSED'] }
    },
    orderBy: { startedAt: 'desc' }
  });

  if (existingSession) {
    const updated = await prisma.assessmentSession.update({
      where: { id: existingSession.id },
      data: {
        status: 'IN_PROGRESS',
        lastActiveAt: new Date()
      }
    });
    return getSessionWithDetails(updated.id, userId);
  }

  // Create new session
  const newSession = await prisma.assessmentSession.create({
    data: {
      userId,
      formVersionId: activeFormVersion.id,
      status: 'IN_PROGRESS',
      currentStep: 1
    }
  });

  return getSessionWithDetails(newSession.id, userId);
}

export async function getSessionWithDetails(sessionId: string, userId: string) {
  const session = await prisma.assessmentSession.findUnique({
    where: { id: sessionId },
    include: {
      formVersion: {
        include: {
          module: true,
          items: {
            orderBy: { sortOrder: 'asc' },
            include: {
              itemVersion: {
                include: {
                  item: {
                    include: {
                      instrument: true,
                      facet: {
                        include: {
                          construct: {
                            include: {
                              domain: true
                            }
                          }
                        }
                      }
                    }
                  },
                  options: {
                    orderBy: { sortOrder: 'asc' }
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        include: {
          revisions: {
            orderBy: { sequence: 'asc' }
          }
        }
      }
    }
  });

  if (!session) {
    throw new Error('Değerlendirme oturumu bulunamadı.');
  }

  if (session.userId !== userId) {
    throw new Error('Yetkisiz oturum erişimi.');
  }

  return session;
}

export async function pauseAssessmentSession(
  sessionId: string,
  userId: string,
  currentStep: number
) {
  const session = await prisma.assessmentSession.findUnique({
    where: { id: sessionId }
  });

  if (!session || session.userId !== userId) {
    throw new Error('Oturum bulunamadı veya yetkisiz erişim.');
  }

  if (session.status === 'COMPLETED') {
    throw new Error('Tamamlanmış bir oturum duraklatılamaz.');
  }

  return prisma.assessmentSession.update({
    where: { id: sessionId },
    data: {
      status: 'PAUSED',
      currentStep,
      lastActiveAt: new Date()
    }
  });
}
