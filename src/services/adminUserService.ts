import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { maskEmail } from './adminService';
import { isSmtpConfigured } from '@/lib/emailService';
import { isResearchConfigured } from '@/lib/researchAuth';
import { Role, isValidRole } from '@/lib/rbac';

export interface UserDirectoryItem {
  id: string;
  name: string;
  email: string | null;
  emailMasked: string | null;
  emailNormalizedMasked: string | null;
  status: string;
  emailVerified: Date | null;
  isDemoUser: boolean;
  roles: Role[];
  authMethods: Array<'credentials' | 'google'>;
  lastLoginAt: Date | null;
  createdAt: Date;
  assessmentCount: number;
  snapshotCount: number;
}

export interface UserDirectoryResult {
  users: UserDirectoryItem[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface UserDetailDTO {
  id: string;
  name: string;
  email: string | null;
  emailMasked: string | null;
  emailNormalized: string | null;
  emailNormalizedMasked: string | null;
  emailVerified: Date | null;
  status: string;
  isDemoUser: boolean;
  createdAt: Date;
  lastLoginAt: Date | null;
  auth: {
    hasCredentials: boolean;
    hasGoogleOAuth: boolean;
    googleAccountId: string | null;
  };
  roles: Array<{
    id: string;
    role: Role;
    grantedAt: Date;
    grantedBy: string | null;
  }>;
  sessions: Array<{
    id: string; // Session.id, NEVER sessionToken
    expires: Date;
    revokedAt: Date | null;
    ipHash: string | null;
    userAgent: string | null;
    createdAt: Date;
  }>;
  psychologySummary: {
    assessmentCount: number;
    completedAssessmentCount: number;
    snapshotCount: number;
    latestAssessmentAt: Date | null;
    latestSnapshotAt: Date | null;
  };
  recentAudits: Array<{
    id: string;
    eventType: string;
    actorUserId: string | null;
    success: boolean;
    ipHash: string | null;
    userAgent: string | null;
    metadata: Record<string, any> | null;
    createdAt: Date;
  }>;
}

export interface AuditExplorerItem {
  id: string;
  eventType: string;
  userId: string | null;
  targetEmailMasked: string | null;
  targetName: string | null;
  actorUserId: string | null;
  actorName: string | null;
  success: boolean;
  ipHash: string | null;
  userAgent: string | null;
  metadata: Record<string, any> | null;
  createdAt: Date;
}

export interface AuditExplorerResult {
  events: AuditExplorerItem[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface SystemHealthReport {
  application: {
    environment: 'production' | 'development' | 'test';
    appVersion: string;
    nodeVersion: string;
    uptimeSeconds: number;
    timestamp: Date;
  };
  database: {
    status: 'HEALTHY' | 'DEGRADED' | 'UNREACHABLE';
    latencyMs: number;
    engine: 'PostgreSQL';
  };
  authService: {
    authJsConfigured: boolean;
    sessionRegistryOperational: boolean;
    activeSessionCount: number;
    rateLimiterActive: boolean;
    rateLimiterStatus: 'ACTIVE' | 'IN_MEMORY' | 'DEGRADED' | 'UNKNOWN';
  };
  googleOAuth: {
    configured: boolean;
    maskedClientId: string | null;
    isSecretSet: boolean;
  };
  emailService: {
    configured: boolean;
    host: string | null;
    port: number | null;
    isPasswordSet: boolean;
  };
  researchGate: {
    configured: boolean;
    isKeySet: boolean;
  };
  scientificState: {
    activeFormVersionCode: string | null;
    activeFormModuleTitle: string | null;
    liveItemCount: number;
    domainCount: number;
    constructCount: number;
    facetCount: number;
    scoringModelCode: string | null;
    scoringAlgorithm: string | null;
    normStatusCode: string;
    normSampleSize: number;
  };
}

/**
 * Parses and clamps pagination parameters
 */
export function parsePaginationParams(pageInput?: any, pageSizeInput?: any) {
  let page = parseInt(String(pageInput || '1'), 10);
  if (isNaN(page) || page < 1) page = 1;

  let pageSize = parseInt(String(pageSizeInput || '10'), 10);
  if (![10, 25, 50].includes(pageSize)) pageSize = 10;

  return { page, pageSize };
}

/**
 * Server-driven user directory query with filtering, search, sorting, and pagination.
 */
export async function getUserDirectory(params: {
  search?: string;
  status?: string;
  role?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}): Promise<UserDirectoryResult> {
  const { page, pageSize } = parsePaginationParams(params.page, params.pageSize);
  const skip = (page - 1) * pageSize;

  const where: any = {};

  // Search filter (name or normalized email)
  if (params.search && params.search.trim()) {
    const term = params.search.trim().substring(0, 100);
    where.OR = [
      { name: { contains: term, mode: 'insensitive' } },
      { emailNormalized: { contains: term.toLowerCase(), mode: 'insensitive' } },
    ];
  }

  // Status filter
  if (params.status && ['ACTIVE', 'PENDING_VERIFICATION', 'SUSPENDED', 'DISABLED'].includes(params.status)) {
    where.status = params.status;
  }

  // Role filter
  if (params.role && isValidRole(params.role)) {
    where.roles = {
      some: {
        role: params.role,
      },
    };
  }

  // Sorting
  let orderBy: any = { createdAt: 'desc' };
  if (params.sort === 'createdAt_asc') {
    orderBy = { createdAt: 'asc' };
  } else if (params.sort === 'createdAt_desc') {
    orderBy = { createdAt: 'desc' };
  } else if (params.sort === 'lastLogin_desc') {
    orderBy = { lastLoginAt: { sort: 'desc', nulls: 'last' } };
  } else if (params.sort === 'name_asc') {
    orderBy = { name: 'asc' };
  }

  const [total, rawUsers] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
      include: {
        roles: true,
        credential: { select: { id: true } },
        authAccounts: { select: { provider: true } },
        _count: {
          select: {
            sessions: true,
            snapshots: true,
          },
        },
      },
    }),
  ]);

  const users: UserDirectoryItem[] = rawUsers.map((u) => {
    const roles = u.roles.map((r) => r.role as Role);
    const authMethods: Array<'credentials' | 'google'> = [];
    if (u.credential) authMethods.push('credentials');
    if (u.authAccounts.some((a) => a.provider === 'google')) authMethods.push('google');

    return {
      id: u.id,
      name: u.name,
      email: u.email,
      emailMasked: maskEmail(u.email),
      emailNormalizedMasked: maskEmail(u.emailNormalized),
      status: u.status,
      emailVerified: u.emailVerified,
      isDemoUser: u.isDemoUser,
      roles: roles.length > 0 ? roles : (['USER'] as Role[]),
      authMethods,
      lastLoginAt: u.lastLoginAt,
      createdAt: u.createdAt,
      assessmentCount: u._count.sessions,
      snapshotCount: u._count.snapshots,
    };
  });

  return {
    users,
    pagination: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize) || 1,
    },
  };
}

/**
 * Fetches full user detail DTO without leaking sessionToken, secrets, or raw psychometric scores.
 */
export async function getUserDetail(userId: string): Promise<UserDetailDTO | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      credential: { select: { id: true, passwordUpdatedAt: true } },
      roles: { orderBy: { grantedAt: 'asc' } },
      authAccounts: { select: { id: true, provider: true, providerAccountId: true } },
      authSessions: {
        select: {
          id: true, // NEVER sessionToken!
          expires: true,
          revokedAt: true,
          ipHash: true,
          userAgent: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 15,
      },
      _count: {
        select: {
          sessions: true,
          snapshots: true,
        },
      },
    },
  });

  if (!user) return null;

  // Aggregate psychological stats
  const [completedAssessmentsCount, latestSession, latestSnapshot, recentAudits] = await Promise.all([
    prisma.assessmentSession.count({
      where: { userId, status: 'COMPLETED' },
    }),
    prisma.assessmentSession.findFirst({
      where: { userId },
      orderBy: { startedAt: 'desc' },
      select: { startedAt: true },
    }),
    prisma.profileSnapshot.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    }),
    prisma.authAuditEvent.findMany({
      where: {
        OR: [{ userId }, { actorUserId: userId }],
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ]);

  const googleAccount = user.authAccounts.find((a) => a.provider === 'google');

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailMasked: maskEmail(user.email),
    emailNormalized: user.emailNormalized,
    emailNormalizedMasked: maskEmail(user.emailNormalized),
    emailVerified: user.emailVerified,
    status: user.status,
    isDemoUser: user.isDemoUser,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
    auth: {
      hasCredentials: Boolean(user.credential),
      hasGoogleOAuth: Boolean(googleAccount),
      googleAccountId: googleAccount ? googleAccount.providerAccountId : null,
    },
    roles: user.roles.map((r) => ({
      id: r.id,
      role: r.role as Role,
      grantedAt: r.grantedAt,
      grantedBy: r.grantedBy,
    })),
    sessions: user.authSessions.map((s) => ({
      id: s.id,
      expires: s.expires,
      revokedAt: s.revokedAt,
      ipHash: s.ipHash,
      userAgent: s.userAgent,
      createdAt: s.createdAt,
    })),
    psychologySummary: {
      assessmentCount: user._count.sessions,
      completedAssessmentCount: completedAssessmentsCount,
      snapshotCount: user._count.snapshots,
      latestAssessmentAt: latestSession?.startedAt || null,
      latestSnapshotAt: latestSnapshot?.createdAt || null,
    },
    recentAudits: recentAudits.map((a) => ({
      id: a.id,
      eventType: a.eventType,
      actorUserId: a.actorUserId,
      success: a.success,
      ipHash: a.ipHash,
      userAgent: a.userAgent,
      metadata: (a.metadata as Record<string, any>) || null,
      createdAt: a.createdAt,
    })),
  };
}

/**
 * Queries security & governance audit logs with comprehensive filters.
 */
export async function getAuditLogs(params: {
  eventType?: string;
  actorUserId?: string;
  userId?: string;
  success?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}): Promise<AuditExplorerResult> {
  const { page, pageSize } = parsePaginationParams(params.page, params.pageSize);
  const skip = (page - 1) * pageSize;

  const where: any = {};

  if (params.eventType && params.eventType.trim()) {
    where.eventType = params.eventType.trim();
  }

  if (params.actorUserId && params.actorUserId.trim()) {
    where.actorUserId = params.actorUserId.trim();
  }

  if (params.userId && params.userId.trim()) {
    where.userId = params.userId.trim();
  }

  if (typeof params.success === 'boolean') {
    where.success = params.success;
  }

  if (params.startDate || params.endDate) {
    where.createdAt = {};
    if (params.startDate) {
      const sDate = new Date(params.startDate);
      if (!isNaN(sDate.getTime())) where.createdAt.gte = sDate;
    }
    if (params.endDate) {
      const eDate = new Date(params.endDate);
      if (!isNaN(eDate.getTime())) where.createdAt.lte = eDate;
    }
  }

  const [total, rawEvents] = await Promise.all([
    prisma.authAuditEvent.count({ where }),
    prisma.authAuditEvent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
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
    }),
  ]);

  const events: AuditExplorerItem[] = rawEvents.map((e) => {
    const rawTargetEmail = e.user?.email || e.user?.emailNormalized;
    const metadata = e.metadata as Record<string, any> | null;
    const metadataEmail = metadata?.email ? String(metadata.email) : null;
    const targetEmail = rawTargetEmail || metadataEmail;

    return {
      id: e.id,
      eventType: e.eventType,
      userId: e.userId,
      targetEmailMasked: maskEmail(targetEmail),
      targetName: e.user?.name || null,
      actorUserId: e.actorUserId,
      actorName: e.actorUserId ? `Admin (${e.actorUserId.substring(0, 6)})` : 'Sistem / Anonim',
      success: e.success,
      ipHash: e.ipHash,
      userAgent: e.userAgent,
      metadata,
      createdAt: e.createdAt,
    };
  });

  return {
    events,
    pagination: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize) || 1,
    },
  };
}

/**
 * Fetches safe system health metrics without leaking database hostnames, db names, or secrets.
 */
export async function getSystemHealthReport(): Promise<SystemHealthReport> {
  const dbStart = Date.now();
  let dbHealthy = false;
  let dbLatencyMs = 0;

  try {
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - dbStart;
    dbHealthy = true;
  } catch {
    dbLatencyMs = Date.now() - dbStart;
    dbHealthy = false;
  }

  // Session registry operational test (verifies table reachability, count=0 is valid)
  let sessionRegistryOperational = false;
  let activeSessionCount = 0;
  try {
    const [countResult] = await Promise.all([
      prisma.session.count({ where: { revokedAt: null, expires: { gt: new Date() } } }),
    ]);
    activeSessionCount = countResult;
    sessionRegistryOperational = true;
  } catch {
    sessionRegistryOperational = false;
  }

  // Scientific ontology counts
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

  const googleOAuthConfigured = Boolean(
    process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
  );
  const smtpConfigured = isSmtpConfigured();
  const researchGateConfigured = isResearchConfigured();

  // Authoritative Application Version (from APP_VERSION, npm_package_version, or package.json)
  let appVersion = 'UNKNOWN';
  if (process.env.APP_VERSION && process.env.APP_VERSION.trim()) {
    appVersion = process.env.APP_VERSION.trim();
  } else if (process.env.npm_package_version && process.env.npm_package_version.trim()) {
    appVersion = process.env.npm_package_version.trim();
  } else {
    try {
      const pkgPath = path.resolve(process.cwd(), 'package.json');
      if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        if (pkg.version) appVersion = pkg.version;
      }
    } catch {
      appVersion = 'UNKNOWN';
    }
  }

  // Real Auth.js Configuration Status (requires AUTH_SECRET / NEXTAUTH_SECRET)
  const authJsConfigured = Boolean(
    (process.env.AUTH_SECRET && process.env.AUTH_SECRET.trim().length > 0) ||
    (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.trim().length > 0)
  );

  // Real Rate Limiter Operational Status (verified against rate_limit_records table reachability)
  let rateLimiterActive = false;
  let rateLimiterStatus: 'ACTIVE' | 'IN_MEMORY' | 'DEGRADED' | 'UNKNOWN' = 'UNKNOWN';

  if (dbHealthy) {
    try {
      await prisma.$queryRaw`SELECT 1 FROM "rate_limit_records" LIMIT 1`;
      rateLimiterActive = true;
      rateLimiterStatus = 'ACTIVE';
    } catch {
      rateLimiterActive = false;
      rateLimiterStatus = process.env.NODE_ENV === 'production' ? 'DEGRADED' : 'IN_MEMORY';
    }
  } else {
    rateLimiterActive = false;
    rateLimiterStatus = process.env.NODE_ENV === 'production' ? 'DEGRADED' : 'UNKNOWN';
  }

  let maskedGoogleClientId: string | null = null;
  if (process.env.AUTH_GOOGLE_ID) {
    const rawId = process.env.AUTH_GOOGLE_ID;
    if (rawId.length > 8) {
      maskedGoogleClientId = `${rawId.substring(0, 5)}***${rawId.substring(rawId.length - 8)}`;
    } else {
      maskedGoogleClientId = '***';
    }
  }

  const safeSmtpHost = process.env.SMTP_HOST || null;
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : null;

  return {
    application: {
      environment: (process.env.NODE_ENV as any) || 'development',
      appVersion,
      nodeVersion: process.version,
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date(),
    },
    database: {
      status: dbHealthy ? 'HEALTHY' : 'UNREACHABLE',
      latencyMs: dbLatencyMs,
      engine: 'PostgreSQL',
    },
    authService: {
      authJsConfigured,
      sessionRegistryOperational,
      activeSessionCount,
      rateLimiterActive,
      rateLimiterStatus,
    },
    googleOAuth: {
      configured: googleOAuthConfigured,
      maskedClientId: maskedGoogleClientId,
      isSecretSet: Boolean(process.env.AUTH_GOOGLE_SECRET),
    },
    emailService: {
      configured: smtpConfigured,
      host: safeSmtpHost,
      port: smtpPort,
      isPasswordSet: Boolean(process.env.SMTP_PASSWORD),
    },
    researchGate: {
      configured: researchGateConfigured,
      isKeySet: Boolean(process.env.RESEARCH_ACCESS_KEY),
    },
    scientificState: {
      activeFormVersionCode: activeFormVersion?.versionCode ?? null,
      activeFormModuleTitle: activeFormVersion?.module?.titleTr ?? null,
      liveItemCount: activeFormVersion?.itemCount ?? liveItemCount,
      domainCount,
      constructCount,
      facetCount,
      scoringModelCode: scoringModel?.code ?? null,
      scoringAlgorithm: scoringModel?.algorithm ?? null,
      normStatusCode: normVersion?.status ?? 'UNAVAILABLE',
      normSampleSize: normVersion?.sampleSize ?? 0,
    },
  };
}
