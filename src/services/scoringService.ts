import { prisma } from '@/lib/prisma';

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
      responses: {
        include: {
          item: {
            include: {
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
          }
        }
      }
    }
  });

  if (!session) {
    throw new Error('Değerlendirme oturumu bulunamadı.');
  }

  // Get active pre-calibration scoring model
  const scoringModel = await prisma.scoringModelVersion.findUnique({
    where: { code: 'PRE_CALIBRATION_MEAN_V1' }
  });

  if (!scoringModel) {
    throw new Error('Ön kalibrasyon puanlama modeli (PRE_CALIBRATION_MEAN_V1) bulunamadı.');
  }

  // Group responses by Facet (excluding attention check items from psychological scoring)
  const facetItemsMap = new Map<string, { constructId: string; domainId: string; scoredValues: number[] }>();

  for (const resp of session.responses) {
    if (resp.item.isAttentionCheck) {
      continue; // Attention checks are validity indicators, not latent trait items
    }

    const facet = resp.item.facet;
    const facetId = facet.id;
    const constructId = facet.construct.id;
    const domainId = facet.construct.domain.id;

    if (!facetItemsMap.has(facetId)) {
      facetItemsMap.set(facetId, { constructId, domainId, scoredValues: [] });
    }
    facetItemsMap.get(facetId)!.scoredValues.push(resp.scoredValue);
  }

  // 1. Calculate Facet Scores (Raw arithmetic mean of scored values)
  const facetScores: CalculatedFacetScore[] = [];
  const constructFacetsMap = new Map<string, { domainId: string; facetMeans: number[] }>();

  for (const [facetId, data] of facetItemsMap.entries()) {
    const sum = data.scoredValues.reduce((acc, v) => acc + v, 0);
    const rawMean = Number((sum / data.scoredValues.length).toFixed(4));

    facetScores.push({
      facetId,
      rawMean,
      itemCount: data.scoredValues.length,
      standardError: null,
      ci95Lower: null,
      ci95Upper: null,
      normVersionId: null
    });

    if (!constructFacetsMap.has(data.constructId)) {
      constructFacetsMap.set(data.constructId, { domainId: data.domainId, facetMeans: [] });
    }
    constructFacetsMap.get(data.constructId)!.facetMeans.push(rawMean);
  }

  // 2. Calculate Construct Scores (Unweighted mean of facet means)
  const constructScores: CalculatedConstructScore[] = [];
  const domainConstructsMap = new Map<string, number[]>();

  for (const [constructId, data] of constructFacetsMap.entries()) {
    const sum = data.facetMeans.reduce((acc, v) => acc + v, 0);
    const compositeScore = Number((sum / data.facetMeans.length).toFixed(4));

    constructScores.push({
      constructId,
      compositeScore,
      facetCount: data.facetMeans.length,
      standardError: null,
      ci95Lower: null,
      ci95Upper: null,
      normVersionId: null
    });

    if (!domainConstructsMap.has(data.domainId)) {
      domainConstructsMap.set(data.domainId, []);
    }
    domainConstructsMap.get(data.domainId)!.push(compositeScore);
  }

  // 3. Calculate Domain Scores (Unweighted mean of construct composites)
  const domainScores: CalculatedDomainScore[] = [];

  for (const [domainId, constructs] of domainConstructsMap.entries()) {
    const sum = constructs.reduce((acc, v) => acc + v, 0);
    const compositeScore = Number((sum / constructs.length).toFixed(4));

    domainScores.push({
      domainId,
      compositeScore,
      constructCount: constructs.length,
      standardError: null,
      ci95Lower: null,
      ci95Upper: null,
      normVersionId: null
    });
  }

  // 4. Calculate Overall Provisional Composite (Mean across measured domains)
  const totalDomainSum = domainScores.reduce((acc, d) => acc + d.compositeScore, 0);
  const provisionalComposite =
    domainScores.length > 0 ? Number((totalDomainSum / domainScores.length).toFixed(4)) : 0;

  return {
    provisionalComposite,
    normStatus: 'UNAVAILABLE',
    standardError: null,
    ci95Lower: null,
    ci95Upper: null,
    scoringModelVersionId: scoringModel.id,
    facetScores,
    constructScores,
    domainScores
  };
}
