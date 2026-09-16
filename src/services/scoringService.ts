import { prisma } from '@/lib/prisma';
import { resolveScoringStrategy, ScoredResponseItem } from '@/lib/scoringStrategies';

export interface CalculatedFacetScore {
  facetId: string;
  rawMean: number;
  itemCount: number;
  standardError: null;
  ci95Lower: null;
  ci95Upper: null;
  normVersionId: null;
}

export interface CalculatedConstructScore {
  constructId: string;
  compositeScore: number;
  facetCount: number;
  standardError: null;
  ci95Lower: null;
  ci95Upper: null;
  normVersionId: null;
}

export interface CalculatedDomainScore {
  domainId: string;
  compositeScore: number;
  constructCount: number;
  standardError: null;
  ci95Lower: null;
  ci95Upper: null;
  normVersionId: null;
}

export interface CalculatedPreCalibrationProfile {
  provisionalComposite: number;
  normStatus: 'UNAVAILABLE';
  standardError: null;
  ci95Lower: null;
  ci95Upper: null;
  scoringModelVersionId: string;
  facetScores: CalculatedFacetScore[];
  constructScores: CalculatedConstructScore[];
  domainScores: CalculatedDomainScore[];
}

export async function calculatePreCalibrationScores(sessionId: string): Promise<CalculatedPreCalibrationProfile> {
  const session = await prisma.assessmentSession.findUnique({
    where: { id: sessionId },
    include: {
      formVersion: {
        include: {
          module: true,
        },
      },
      responses: {
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
            },
          },
        },
      },
    },
  });

  if (!session) {
    throw new Error('Değerlendirme oturumu bulunamadı.');
  }

  const moduleCode = session.formVersion?.module?.code;
  const strategy = resolveScoringStrategy(null, moduleCode);

  // Get or find active pre-calibration scoring model for this strategy
  let scoringModel = await prisma.scoringModelVersion.findUnique({
    where: { code: strategy.code },
  });

  if (!scoringModel) {
    // Fallback to default pre-calibration model or create
    scoringModel = await prisma.scoringModelVersion.findFirst({
      where: { isPreCalibration: true },
    });
  }

  if (!scoringModel) {
    throw new Error(`Puanlama modeli (${strategy.code}) veritabanında bulunamadı.`);
  }

  // Transform responses into ScoredResponseItem format
  const scoredItems: ScoredResponseItem[] = session.responses.map((resp) => ({
    itemId: resp.itemId,
    facetId: resp.item.facet.id,
    constructId: resp.item.facet.construct.id,
    domainId: resp.item.facet.construct.domain.id,
    rawValue: resp.rawValue,
    scoredValue: resp.scoredValue,
    isKeyed: resp.item.isKeyed,
    isAttentionCheck: resp.item.isAttentionCheck,
  }));

  const calculated = strategy.calculate(scoredItems);

  return {
    provisionalComposite: calculated.provisionalComposite,
    normStatus: 'UNAVAILABLE',
    standardError: null,
    ci95Lower: null,
    ci95Upper: null,
    scoringModelVersionId: scoringModel.id,
    facetScores: calculated.facetScores.map((fs) => ({
      facetId: fs.facetId,
      rawMean: fs.rawMean,
      itemCount: fs.itemCount,
      standardError: null,
      ci95Lower: null,
      ci95Upper: null,
      normVersionId: null,
    })),
    constructScores: calculated.constructScores.map((cs) => ({
      constructId: cs.constructId,
      compositeScore: cs.compositeScore,
      facetCount: cs.facetCount,
      standardError: null,
      ci95Lower: null,
      ci95Upper: null,
      normVersionId: null,
    })),
    domainScores: calculated.domainScores.map((ds) => ({
      domainId: ds.domainId,
      compositeScore: ds.compositeScore,
      constructCount: ds.constructCount,
      standardError: null,
      ci95Lower: null,
      ci95Upper: null,
      normVersionId: null,
    })),
  };
}
