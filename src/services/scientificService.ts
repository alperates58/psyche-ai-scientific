import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { normalizeInstrumentLicensingDecision, normalizeItemLicenseStatus } from '@/lib/licenseNormalization';

// ---------------------------------------------------------
// 1. ASSESSMENT FORMS
// ---------------------------------------------------------

export interface AssessmentFormListItem {
  id: string;
  moduleId: string;
  moduleCode: string;
  moduleTitleTr: string;
  moduleTitleEn: string;
  versionCode: string;
  status: string; // "DRAFT", "PUBLISHED", "ARCHIVED"
  isPublished: boolean;
  itemCount: number;
  publishedAt: Date | null;
  archivedAt: Date | null;
  createdAt: Date;
  sessionCount: number;
}

export async function getAssessmentFormsList(): Promise<AssessmentFormListItem[]> {
  const forms = await prisma.assessmentFormVersion.findMany({
    include: {
      module: true,
      _count: {
        select: {
          sessions: true,
          items: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return forms.map((f) => ({
    id: f.id,
    moduleId: f.moduleId,
    moduleCode: f.module.code,
    moduleTitleTr: f.module.titleTr,
    moduleTitleEn: f.module.titleEn,
    versionCode: f.versionCode,
    status: f.status,
    isPublished: f.isPublished,
    itemCount: f.itemCount || f._count.items,
    publishedAt: f.publishedAt,
    archivedAt: f.archivedAt,
    createdAt: f.createdAt,
    sessionCount: f._count.sessions,
  }));
}

export async function getAssessmentFormDetail(idOrCode: string) {
  const form = await prisma.assessmentFormVersion.findFirst({
    where: {
      OR: [{ id: idOrCode }, { versionCode: idOrCode }],
    },
    include: {
      module: true,
      items: {
        include: {
          itemVersion: {
            include: {
              item: {
                include: {
                  facet: {
                    include: {
                      construct: {
                        include: {
                          domain: true,
                        },
                      },
                    },
                  },
                  instrument: true,
                },
              },
              options: {
                orderBy: { sortOrder: 'asc' },
              },
            },
          },
        },
        orderBy: { sortOrder: 'asc' },
      },
      _count: {
        select: { sessions: true },
      },
    },
  });

  return form;
}

// ---------------------------------------------------------
// 2. ITEM BANK
// ---------------------------------------------------------

export interface ItemBankFilterParams {
  domainId?: string;
  constructId?: string;
  facetId?: string;
  validationStatus?: string;
  licenseStatus?: string;
  status?: string;
  isKeyed?: boolean;
  isAttentionCheck?: boolean;
  search?: string;
}

export async function getItemBankList(params?: ItemBankFilterParams) {
  const items = await prisma.item.findMany({
    where: {
      isKeyed: params?.isKeyed !== undefined ? params.isKeyed : undefined,
      isAttentionCheck: params?.isAttentionCheck !== undefined ? params.isAttentionCheck : undefined,
      facet: {
        id: params?.facetId || undefined,
        construct: {
          id: params?.constructId || undefined,
          domainId: params?.domainId || undefined,
        },
      },
    },
    include: {
      facet: {
        include: {
          construct: {
            include: {
              domain: true,
            },
          },
        },
      },
      instrument: true,
      versions: {
        orderBy: { versionNumber: 'desc' },
        include: {
          options: {
            orderBy: { sortOrder: 'asc' },
          },
          _count: {
            select: {
              formItems: true,
              responses: true,
            },
          },
        },
      },
      _count: {
        select: {
          responses: true,
        },
      },
    },
    orderBy: { itemCode: 'asc' },
  });

  // Client-side / in-memory search filtering if search query provided
  let filtered = items;
  if (params?.search && params.search.trim()) {
    const q = params.search.toLowerCase().trim();
    filtered = filtered.filter((it) => {
      const matchCode = it.itemCode.toLowerCase().includes(q);
      const matchFacet = it.facet.nameTr.toLowerCase().includes(q) || it.facet.nameEn.toLowerCase().includes(q);
      const matchPrompt = it.versions.some(
        (v) => v.promptTr.toLowerCase().includes(q) || v.promptEn.toLowerCase().includes(q)
      );
      return matchCode || matchFacet || matchPrompt;
    });
  }

  // Load research bank count for comparison
  let researchCandidateCount = 832;
  try {
    const masterBankPath = path.resolve(process.cwd(), 'data/master-item-bank.json');
    if (fs.existsSync(masterBankPath)) {
      const masterItems = JSON.parse(fs.readFileSync(masterBankPath, 'utf8'));
      researchCandidateCount = masterItems.length;
    }
  } catch {}

  return {
    items: filtered,
    stats: {
      totalLiveItems: items.length,
      totalLiveVersions: items.reduce((acc, it) => acc + it.versions.length, 0),
      researchCandidateCount,
    },
  };
}

export async function getItemDetail(id: string) {
  const item = await prisma.item.findUnique({
    where: { id },
    include: {
      facet: {
        include: {
          construct: {
            include: {
              domain: true,
            },
          },
          scientificSources: {
            include: {
              source: true,
            },
          },
          instruments: {
            include: {
              instrument: true,
            },
          },
        },
      },
      instrument: true,
      versions: {
        orderBy: { versionNumber: 'desc' },
        include: {
          options: {
            orderBy: { sortOrder: 'asc' },
          },
          formItems: {
            include: {
              formVersion: {
                include: {
                  module: true,
                },
              },
            },
          },
          _count: {
            select: {
              responses: true,
            },
          },
        },
      },
      _count: {
        select: {
          responses: true,
        },
      },
    },
  });

  return item;
}

// ---------------------------------------------------------
// 3. ONTOLOGY MANAGEMENT
// ---------------------------------------------------------

export async function getOntologyTree() {
  const domains = await prisma.domain.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      constructs: {
        orderBy: { sortOrder: 'asc' },
        include: {
          facets: {
            orderBy: { sortOrder: 'asc' },
            include: {
              validationSummary: true,
              _count: {
                select: {
                  items: true,
                  scientificSources: true,
                  instruments: true,
                  theoryLenses: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const totalDomains = domains.length;
  const totalConstructs = domains.reduce((acc, d) => acc + d.constructs.length, 0);
  const totalFacets = domains.reduce(
    (acc, d) => acc + d.constructs.reduce((cAcc, c) => cAcc + c.facets.length, 0),
    0
  );

  return {
    domains,
    stats: {
      totalDomains,
      totalConstructs,
      totalFacets,
    },
  };
}

export async function getFacetDetail(facetId: string) {
  const facet = await prisma.facet.findUnique({
    where: { id: facetId },
    include: {
      construct: {
        include: {
          domain: true,
        },
      },
      validationSummary: {
        include: {
          studyEvidences: {
            include: {
              source: true,
              instrument: true,
            },
          },
          reliabilityEvidences: {
            include: {
              source: true,
              instrument: true,
            },
          },
        },
      },
      scientificSources: {
        include: {
          source: true,
        },
      },
      instruments: {
        include: {
          instrument: true,
        },
      },
      theoryLenses: {
        include: {
          theoryLens: true,
        },
      },
      items: {
        include: {
          versions: {
            orderBy: { versionNumber: 'desc' },
          },
        },
      },
    },
  });

  return facet;
}

// ---------------------------------------------------------
// 4. SCIENTIFIC SOURCES
// ---------------------------------------------------------

export async function getSourcesList() {
  const sources = await prisma.scientificSource.findMany({
    include: {
      facets: {
        include: {
          facet: true,
        },
      },
      validationStudyEvidences: {
        include: {
          validationSummary: {
            include: {
              facet: true,
            },
          },
        },
      },
      validationReliabilityEvidences: {
        include: {
          validationSummary: {
            include: {
              facet: true,
            },
          },
        },
      },
      _count: {
        select: {
          facets: true,
          theoryLenses: true,
          validationStudyEvidences: true,
          validationReliabilityEvidences: true,
        },
      },
    },
    orderBy: [{ year: 'desc' }, { shortKey: 'asc' }],
  });

  return sources;
}

export async function getSourceDetail(id: string) {
  const source = await prisma.scientificSource.findUnique({
    where: { id },
    include: {
      facets: {
        include: {
          facet: {
            include: {
              construct: {
                include: {
                  domain: true,
                },
              },
            },
          },
        },
      },
      theoryLenses: {
        include: {
          theoryLens: true,
        },
      },
      validationStudyEvidences: {
        include: {
          validationSummary: {
            include: {
              facet: true,
            },
          },
        },
      },
      validationReliabilityEvidences: {
        include: {
          validationSummary: {
            include: {
              facet: true,
            },
          },
        },
      },
    },
  });

  return source;
}

// ---------------------------------------------------------
// 5. LICENSING REGISTRY
// ---------------------------------------------------------

export async function getLicensesList() {
  const instruments = await prisma.instrument.findMany({
    include: {
      facets: {
        include: {
          facet: true,
        },
      },
      items: true,
      _count: {
        select: {
          facets: true,
          items: true,
          validationStudyEvidences: true,
          validationReliabilityEvidences: true,
        },
      },
    },
    orderBy: { code: 'asc' },
  });

  return instruments.map((inst) => ({
    ...inst,
    normalizedDecision: normalizeInstrumentLicensingDecision(inst.licensingDecision),
  }));
}

export async function getLicenseDetail(id: string) {
  const inst = await prisma.instrument.findUnique({
    where: { id },
    include: {
      facets: {
        include: {
          facet: {
            include: {
              construct: {
                include: {
                  domain: true,
                },
              },
            },
          },
        },
      },
      items: {
        include: {
          versions: true,
        },
      },
      validationStudyEvidences: {
        include: {
          validationSummary: {
            include: {
              facet: true,
            },
          },
        },
      },
    },
  });

  if (!inst) return null;

  return {
    ...inst,
    normalizedDecision: normalizeInstrumentLicensingDecision(inst.licensingDecision),
  };
}

// ---------------------------------------------------------
// 6. VALIDATION MATRIX
// ---------------------------------------------------------

export async function getValidationMatrixList() {
  const summaries = await prisma.facetValidationSummary.findMany({
    include: {
      facet: {
        include: {
          construct: {
            include: {
              domain: true,
            },
          },
        },
      },
      studyEvidences: {
        include: {
          source: true,
          instrument: true,
        },
      },
      reliabilityEvidences: {
        include: {
          source: true,
          instrument: true,
        },
      },
    },
    orderBy: [
      { facet: { construct: { domain: { sortOrder: 'asc' } } } },
      { facet: { construct: { sortOrder: 'asc' } } },
      { facet: { sortOrder: 'asc' } },
    ],
  });

  const levelCounts = {
    DIRECT: 0,
    LEXICAL: 0,
    RELATED: 0,
    NO_DIRECT: 0,
  };

  for (const s of summaries) {
    if (s.overallTurkishEvidenceLevel in levelCounts) {
      levelCounts[s.overallTurkishEvidenceLevel as keyof typeof levelCounts]++;
    }
  }

  return {
    summaries,
    stats: {
      total: summaries.length,
      levelCounts,
    },
  };
}

export async function getValidationDetail(facetId: string) {
  const summary = await prisma.facetValidationSummary.findUnique({
    where: { facetId },
    include: {
      facet: {
        include: {
          construct: {
            include: {
              domain: true,
            },
          },
        },
      },
      targetConstructInstrument: true,
      supportingEvidenceInstrument: true,
      verifiedByUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      studyEvidences: {
        include: {
          source: true,
          instrument: true,
        },
      },
      reliabilityEvidences: {
        include: {
          source: true,
          instrument: true,
        },
      },
    },
  });

  return summary;
}

// ---------------------------------------------------------
// 7. SCORING MODELS
// ---------------------------------------------------------

export async function getScoringModelsList() {
  const models = await prisma.scoringModelVersion.findMany({
    include: {
      _count: {
        select: {
          snapshots: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return models;
}

export async function getScoringModelDetail(idOrCode: string) {
  const model = await prisma.scoringModelVersion.findFirst({
    where: {
      OR: [{ id: idOrCode }, { code: idOrCode }],
    },
    include: {
      snapshots: {
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      _count: {
        select: {
          snapshots: true,
        },
      },
    },
  });

  return model;
}

// ---------------------------------------------------------
// 8. NORM TABLES
// ---------------------------------------------------------

export async function getNormsList() {
  const norms = await prisma.normVersion.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return norms;
}

export async function getNormDetail(id: string) {
  const norm = await prisma.normVersion.findUnique({
    where: { id },
  });

  return norm;
}
