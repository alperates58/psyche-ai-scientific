/**
 * PsycheAI Profile Evidence Bundle V2 (AI Preparation Layer for FAZ 2.18 Grounding)
 *
 * Enforces strict scientific and AI governance invariants:
 * - Deterministic psychometric grounding.
 * - AI Insight Engine MUST consume this evidence bundle strictly as ground truth.
 * - AI NEVER calculates, imputes, alters, or invents psychometric scores.
 * - Every evidence entry includes provenance, source session IDs, facet IDs, and epistemic status.
 */

import {
  UnifiedPsychologicalProfileV2,
  FacetProfileV2,
  ConstructProfileV2,
  ProfilePatternItemV2,
  ProfileCoverageV2,
  ResponseQualityV2,
} from '@/types/unifiedProfileV2';

export type ProfileEvidenceType =
  | 'FACET_SCORE'
  | 'CONSTRUCT_PATTERN'
  | 'TENSION'
  | 'SYNERGY'
  | 'COVERAGE'
  | 'RESPONSE_QUALITY';

export interface GroundedEvidenceEntry {
  evidenceId: string;
  type: ProfileEvidenceType;
  titleTr: string;
  targetId: string; // facetId, constructId, ruleId, etc.
  numericValue: number | null;
  status: string;
  sourceSessionIds: string[];
  sourceFacetIds: string[];
  epistemicStatus: string;
  scientificRationaleTr?: string;
  timestamp: string;
}

export interface ProfileEvidenceBundleV2 {
  bundleVersion: '2.0.0';
  generatedAt: string;
  userId: string;
  measurementModelVersion: 'PSYCHEAI_MASTER_MODEL_V1';
  batteryVersion: 'NATIVE_RESEARCH_BATTERY_V1';
  aiGovernanceRule: string;

  coverage: ProfileCoverageV2;
  responseQuality: ResponseQualityV2;

  measuredFacets: Array<{
    facetId: string;
    code: string;
    nameTr: string;
    domainId: string;
    constructId: string;
    score: number;
    scaleRange: [number, number];
    itemCount: number;
    band: string;
    epistemicStatus: string;
    sourceSessionIds: string[];
    latestMeasuredAt: string | null;
  }>;

  constructPatterns: Array<{
    constructId: string;
    nameTr: string;
    domainId: string;
    aggregationStatus: string;
    constructScore: number | null;
    measuredFacetCount: number;
    totalFacetCount: number;
  }>;

  tensions: ProfilePatternItemV2[];
  synergies: ProfilePatternItemV2[];
  crossDomainPatterns: ProfilePatternItemV2[];

  legacyEvidence: {
    hasLegacy17ItemData: boolean;
    legacyFacetScores: Record<string, number>;
  };

  measurementStatuses: Record<string, string>;

  // Granular Evidence Registry for LLM Retrieval
  evidenceEntries: GroundedEvidenceEntry[];
}

export function buildProfileEvidenceBundleV2(
  profile: UnifiedPsychologicalProfileV2
): ProfileEvidenceBundleV2 {
  const evidenceEntries: GroundedEvidenceEntry[] = [];
  const measuredFacetsData: ProfileEvidenceBundleV2['measuredFacets'] = [];
  const measurementStatuses: Record<string, string> = {};

  // 1. Facet Evidences
  for (const facet of profile.facets) {
    measurementStatuses[facet.facetId] = facet.measurementStatus;

    if (facet.measurementStatus === 'MEASURED_PRECALIBRATION' && facet.score !== null) {
      const sourceSessionIds = facet.sourceAssessmentModules
        .map((m) => m.sessionId)
        .filter((id): id is string => typeof id === 'string');

      measuredFacetsData.push({
        facetId: facet.facetId,
        code: facet.code,
        nameTr: facet.nameTr,
        domainId: facet.domainId,
        constructId: facet.constructId,
        score: facet.score,
        scaleRange: [1.0, 5.0],
        itemCount: facet.itemCountAnswered,
        band: facet.bandInfo?.shortLabelTr || 'Dengeli',
        epistemicStatus: facet.epistemicStatus,
        sourceSessionIds,
        latestMeasuredAt: facet.latestMeasuredAt,
      });

      evidenceEntries.push({
        evidenceId: `ev_facet_${facet.facetId}`,
        type: 'FACET_SCORE',
        titleTr: facet.nameTr,
        targetId: facet.facetId,
        numericValue: facet.score,
        status: facet.measurementStatus,
        sourceSessionIds,
        sourceFacetIds: [facet.facetId],
        epistemicStatus: facet.epistemicStatus,
        scientificRationaleTr: facet.scientificDefinitionTr,
        timestamp: facet.latestMeasuredAt || profile.generatedAt,
      });
    }
  }

  // 2. Construct Evidences
  const constructPatternsData: ProfileEvidenceBundleV2['constructPatterns'] = [];
  for (const construct of profile.constructs) {
    constructPatternsData.push({
      constructId: construct.constructId,
      nameTr: construct.nameTr,
      domainId: construct.domainId,
      aggregationStatus: construct.aggregationStatus,
      constructScore: construct.constructScore,
      measuredFacetCount: construct.measuredFacetCount,
      totalFacetCount: construct.totalFacetCount,
    });

    if (construct.constructScore !== null) {
      evidenceEntries.push({
        evidenceId: `ev_construct_${construct.constructId}`,
        type: 'CONSTRUCT_PATTERN',
        titleTr: construct.nameTr,
        targetId: construct.constructId,
        numericValue: construct.constructScore,
        status: construct.aggregationStatus,
        sourceSessionIds: [],
        sourceFacetIds: construct.facetIds,
        epistemicStatus: 'PROVISIONAL_POINT_ESTIMATE',
        timestamp: profile.generatedAt,
      });
    }
  }

  // 3. Tension Evidences
  for (const tension of profile.tensions) {
    evidenceEntries.push({
      evidenceId: `ev_tension_${tension.id}`,
      type: 'TENSION',
      titleTr: tension.titleTr,
      targetId: tension.id,
      numericValue: null,
      status: 'ACTIVE_TENSION',
      sourceSessionIds: [],
      sourceFacetIds: tension.sourceFacetIds,
      epistemicStatus: tension.epistemicStatus,
      scientificRationaleTr: tension.scientificRationaleTr,
      timestamp: profile.generatedAt,
    });
  }

  // 4. Synergy Evidences
  for (const synergy of profile.synergies) {
    evidenceEntries.push({
      evidenceId: `ev_synergy_${synergy.id}`,
      type: 'SYNERGY',
      titleTr: synergy.titleTr,
      targetId: synergy.id,
      numericValue: null,
      status: 'ACTIVE_SYNERGY',
      sourceSessionIds: [],
      sourceFacetIds: synergy.sourceFacetIds,
      epistemicStatus: synergy.epistemicStatus,
      scientificRationaleTr: synergy.scientificRationaleTr,
      timestamp: profile.generatedAt,
    });
  }

  // 5. Response Quality Evidence
  evidenceEntries.push({
    evidenceId: 'ev_response_quality_summary',
    type: 'RESPONSE_QUALITY',
    titleTr: 'Yanıt Kalitesi Özeti',
    targetId: 'telemetry_overall',
    numericValue: null,
    status: profile.responseQuality.overallFlag,
    sourceSessionIds: profile.recentAssessments.map((a) => a.sessionId),
    sourceFacetIds: [],
    epistemicStatus: 'OBSERVED_TELEMETRY',
    scientificRationaleTr: profile.responseQuality.explanationTr,
    timestamp: profile.generatedAt,
  });

  return {
    bundleVersion: '2.0.0',
    generatedAt: profile.generatedAt,
    userId: profile.userId,
    measurementModelVersion: profile.measurementModelVersion,
    batteryVersion: profile.batteryVersion,
    aiGovernanceRule:
      'AI Insight Engine MUST consume this bundle as authoritative grounding and MUST NOT calculate, modify, or invent psychometric trait scores.',
    coverage: profile.coverage,
    responseQuality: profile.responseQuality,
    measuredFacets: measuredFacetsData,
    constructPatterns: constructPatternsData,
    tensions: profile.tensions,
    synergies: profile.synergies,
    crossDomainPatterns: profile.crossDomainPatterns,
    legacyEvidence: {
      hasLegacy17ItemData: profile.legacyCompatibility.hasLegacy17ItemData,
      legacyFacetScores: profile.legacyCompatibility.legacyFacetScores,
    },
    measurementStatuses,
    evidenceEntries,
  };
}
