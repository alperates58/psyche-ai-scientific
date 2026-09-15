import { prisma } from '@/lib/prisma';
import { isSmtpConfigured } from '@/lib/emailService';
import { isResearchConfigured } from '@/lib/researchAuth';

export interface AdminDashboardMetrics {
  users: {
    total: number;
    active: number;
    pendingVerification: number;
    suspendedOrDisabled: number;
    roleDistribution: Record<string, number>;
  };
  scientific: {
    domainCount: number;
    constructCount: number;
    facetCount: number;
    liveFormItemCount: number;
    totalBankItemCount: number;
    activeFormVersionCode: string | null;
    activeFormModuleTitle: string | null;
    scoringModelCode: string | null;
    scoringModelAlgorithm: string | null;
    normStatusCode: string | null;
    normSampleSize: number;
  };
  operational: {
    dbHealthy: boolean;
    dbLatencyMs: number;
    googleOAuthConfigured: boolean;
    smtpConfigured: boolean;
    researchGateConfigured: boolean;
    nodeEnv: string;
  };
  recentAudits: Array<{
    id: string;
    eventType: string;
    actorName: string;
    actorEmailMasked: string | null;
    targetEmailMasked: string | null;
    success: boolean;
    createdAt: Date;
  }>;
}

/**
 * Safely masks an email address to minimize PII exposure in administrative dashboards.
 * e.g., "alper.ates@gmail.com" -> "a***s@gmail.com"
 */
export function maskEmail(email?: string | null): string | null {
  if (!email || !email.includes('@')) return null;
  const [localPart, domain] = email.split('@');
  if (localPart.length <= 2) {
    return `${localPart[0] || '*'}***@${domain}`;
  }
  return `${localPart[0]}***${localPart[localPart.length - 1]}@${domain}`;
}

/**
 * Fetches 100% database-derived metrics for the Admin Control Plane Dashboard.
 * Zero hardcoded figures; all ontology, user, form, and operational stats are dynamically queried.
 */
export async function getAdminDashboardMetrics(): Promise<AdminDashboardMetrics> {
  const dbStart = Date.now();
  let dbHealthy = false;
  let dbLatencyMs = 0;

  try {
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - dbStart;
    dbHealthy = true;
  } catch (err) {
    dbLatencyMs = Date.now() - dbStart;
    dbHealthy = false;
    console.error('Admin DB Ping failed:', err);
  }

  // Aggregate user statistics
  const [
    totalUsers,
    activeUsers,
    pendingVerificationUsers,
    suspendedOrDisabledUsers,
    roleGroups,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: 'ACTIVE' } }),
    prisma.user.count({ where: { status: 'PENDING_VERIFICATION' } }),
    prisma.user.count({ where: { status: { in: ['SUSPENDED', 'DISABLED'] } } }),
    prisma.userRole.groupBy({
      by: ['role'],
      _count: { role: true },
    }),
  ]);

  const roleDistribution: Record<string, number> = {};
  for (const group of roleGroups) {
    roleDistribution[group.role] = group._count.role;
  }

  // Aggregate psychological ontology and scientific form assets
  const [
    domainCount,
    constructCount,
    facetCount,
    liveItemCount,
    activeFormVersion,
    scoringModel,
    normVersion,
  ] = await Promise.all([
    prisma.domain.count(),
    prisma.construct.count(),
    prisma.facet.count(),
    prisma.itemVersion.count({ where: { isActive: true } }),
    prisma.assessmentFormVersion.findFirst({
      where: { isPublished: true },
      include: { module: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.scoringModelVersion.findFirst({
      where: { isPreCalibration: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.normVersion.findFirst({
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  // Fetch recent audit events with actor/target identity
  const auditLogs = await prisma.authAuditEvent.findMany({
    take: 8,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          emailNormalized: true,
        },
      },
    },
  });

  const recentAudits = auditLogs.map((log) => {
    const rawTargetEmail = log.user?.email || log.user?.emailNormalized;
    const metadata = log.metadata as Record<string, any> | null;
    const metadataEmail = metadata?.email ? String(metadata.email) : null;
    const targetEmail = rawTargetEmail || metadataEmail;

    return {
      id: log.id,
      eventType: log.eventType,
      actorName: log.actorUserId ? `Kullanıcı (${log.actorUserId.substring(0, 6)})` : 'Sistem / Anonim',
      actorEmailMasked: null,
      targetEmailMasked: maskEmail(targetEmail),
      success: log.success,
      createdAt: log.createdAt,
    };
  });

  const googleOAuthConfigured = Boolean(
    process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
  );
  const smtpConfigured = isSmtpConfigured();
  const researchGateConfigured = isResearchConfigured();

  return {
    users: {
      total: totalUsers,
      active: activeUsers,
      pendingVerification: pendingVerificationUsers,
      suspendedOrDisabled: suspendedOrDisabledUsers,
      roleDistribution,
    },
    scientific: {
      domainCount,
      constructCount,
      facetCount,
      liveFormItemCount: activeFormVersion?.itemCount ?? 0,
      totalBankItemCount: liveItemCount,
      activeFormVersionCode: activeFormVersion?.versionCode ?? null,
      activeFormModuleTitle: activeFormVersion?.module?.titleTr ?? null,
      scoringModelCode: scoringModel?.code ?? null,
      scoringModelAlgorithm: scoringModel?.algorithm ?? null,
      normStatusCode: normVersion?.status ?? 'UNAVAILABLE',
      normSampleSize: normVersion?.sampleSize ?? 0,
    },
    operational: {
      dbHealthy,
      dbLatencyMs,
      googleOAuthConfigured,
      smtpConfigured,
      researchGateConfigured,
      nodeEnv: process.env.NODE_ENV || 'development',
    },
    recentAudits,
  };
}
