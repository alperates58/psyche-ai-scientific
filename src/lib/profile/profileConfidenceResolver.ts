/**
 * PsycheAI Epistemic Confidence Resolver V2
 *
 * Implements strict epistemic separation:
 * - NO fake single confidence percentage (e.g. "83% Confidence").
 * - Evaluates 6 independent epistemic dimensions:
 *   1. MEASUREMENT_COVERAGE
 *   2. RESPONSE_QUALITY
 *   3. ITEM_COMPLETION
 *   4. REPEAT_MEASUREMENT
 *   5. METHOD_DIVERSITY
 *   6. CALIBRATION_STATUS
 */

import {
  ConfidenceMapV2,
  FacetConfidenceComponents,
  ResponseQualityStatus,
  ResponseQualityV2,
} from '@/types/unifiedProfileV2';

export function deriveFacetConfidenceComponents(params: {
  itemCountAnswered: number;
  itemCountExpected: number;
  responseQuality: ResponseQualityStatus;
  measurementCount?: number;
  distinctInstrumentsCount?: number;
}): FacetConfidenceComponents {
  const {
    itemCountAnswered,
    itemCountExpected,
    responseQuality,
    measurementCount = 1,
    distinctInstrumentsCount = 1,
  } = params;

  // 1. Coverage
  let coverage: 'HIGH' | 'MODERATE' | 'LOW' | 'NONE' = 'NONE';
  if (itemCountAnswered >= itemCountExpected) {
    coverage = 'HIGH';
  } else if (itemCountAnswered >= 3) {
    coverage = 'MODERATE';
  } else if (itemCountAnswered > 0) {
    coverage = 'LOW';
  }

  // 2. Response Quality
  let rqComp: 'EXCELLENT' | 'ACCEPTABLE' | 'CAUTION' | 'COMPROMISED' | 'NO_DATA' = 'NO_DATA';
  if (responseQuality === 'EXCELLENT') rqComp = 'EXCELLENT';
  else if (responseQuality === 'ACCEPTABLE') rqComp = 'ACCEPTABLE';
  else if (responseQuality === 'QUESTIONABLE') rqComp = 'CAUTION';
  else if (responseQuality === 'COMPROMISED') rqComp = 'COMPROMISED';

  // 3. Repeat Measurement
  let repeat: 'NONE' | 'SINGLE_FOLLOWUP' | 'LONGITUDINAL' = 'NONE';
  if (measurementCount > 2) repeat = 'LONGITUDINAL';
  else if (measurementCount === 2) repeat = 'SINGLE_FOLLOWUP';

  // 4. Method Diversity
  let method: 'SELF_REPORT_ONLY' | 'MULTI_INVENTORY' | 'MULTI_METHOD' = 'SELF_REPORT_ONLY';
  if (distinctInstrumentsCount > 1) method = 'MULTI_INVENTORY';

  return {
    coverage,
    responseQuality: rqComp,
    calibrationStatus: 'PRE_CALIBRATION',
    repeatMeasurement: repeat,
    methodDiversity: method,
  };
}

export function buildConfidenceMapV2(params: {
  measuredFacetsCount: number;
  totalFacetsCount: number;
  responseQuality: ResponseQualityV2;
  hasRepeatMeasurements: boolean;
  distinctInstrumentsCount: number;
}): ConfidenceMapV2 {
  const {
    measuredFacetsCount,
    totalFacetsCount,
    responseQuality,
    hasRepeatMeasurements,
    distinctInstrumentsCount,
  } = params;

  // Measurement coverage level
  const coverageRatio = totalFacetsCount > 0 ? measuredFacetsCount / totalFacetsCount : 0;
  let measurementCoverage: 'HIGH' | 'MODERATE' | 'LOW' | 'NONE' = 'NONE';
  if (coverageRatio >= 0.7) {
    measurementCoverage = 'HIGH';
  } else if (coverageRatio >= 0.35) {
    measurementCoverage = 'MODERATE';
  } else if (coverageRatio > 0) {
    measurementCoverage = 'LOW';
  }

  // Item completion
  let itemCompletion: 'ADEQUATE' | 'PARTIAL' | 'UNMEASURED' = 'UNMEASURED';
  if (measuredFacetsCount >= 24) {
    itemCompletion = 'ADEQUATE';
  } else if (measuredFacetsCount > 0) {
    itemCompletion = 'PARTIAL';
  }

  // Repeat measurement
  const repeatMeasurement: 'NONE' | 'SINGLE_FOLLOWUP' | 'LONGITUDINAL' = hasRepeatMeasurements
    ? 'SINGLE_FOLLOWUP'
    : 'NONE';

  // Method diversity
  const methodDiversity: 'SELF_REPORT_ONLY' | 'MULTI_INVENTORY' | 'MULTI_METHOD' =
    distinctInstrumentsCount > 1 ? 'MULTI_INVENTORY' : 'SELF_REPORT_ONLY';

  const summary = `Ölçüm Kapsamı: ${measurementCoverage} | Yanıt Bütünlüğü: ${responseQuality.overallFlag} | Kalibrasyon: Ön Kalibrasyon (Norm çalışması devam etmektedir).`;

  return {
    measurementCoverage,
    responseQuality: responseQuality.overallFlag,
    itemCompletion,
    repeatMeasurement,
    methodDiversity,
    calibrationStatus: 'PRE_CALIBRATION',
    componentsSummaryTr: summary,
  };
}
