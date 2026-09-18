/**
 * PsycheAI Longitudinal Version Compatibility Engine (FAZ 2.20)
 *
 * Enforces scientific invariants for cross-temporal measurement comparison:
 * 1. Longitudinal comparison is strictly authorized only when measurement battery versions,
 *    scoring models, and underlying construct ontologies are identical OR have an explicit,
 *    empirically validated equivalence mapping.
 * 2. The legacy 17-item screening form (v1.0.0_legacy / LEGACY_FORM_HEXACO) is NOT directly
 *    comparable to the Native Scientific Research Battery (NATIVE_RESEARCH_BATTERY_V1 / PSYCHEAI_MASTER_MODEL_V1).
 *    Any attempted direct delta computation between legacy and native batteries is flagged as VERSION_INCOMPATIBLE.
 * 3. Pre-calibration scoring models (PRE_CALIBRATION_MEAN_V1) are compatible across identical native forms.
 */

export interface VersionSignature {
  batteryVersion: string;
  measurementModelVersion: string;
  scoringVersion: string;
}

export interface VersionCompatibilityResult {
  isCompatible: boolean;
  compatibilityType: 'IDENTICAL' | 'EXPLICIT_MAPPING_AVAILABLE' | 'VERSION_INCOMPATIBLE' | 'UNKNOWN';
  reasonTr: string;
  allowDirectTrajectory: boolean;
}

export const CANONICAL_VERSIONS = {
  BATTERY_CURRENT: 'NATIVE_RESEARCH_BATTERY_V1',
  MODEL_CURRENT: 'PSYCHEAI_MASTER_MODEL_V1',
  SCORING_CURRENT: 'PRE_CALIBRATION_MEAN_V1',
  LEGACY_BATTERY: 'LEGACY_17_ITEM_FORM',
  LEGACY_SCORING: 'LEGACY_HEURISTIC_V1',
} as const;

/**
 * Checks whether two measurement snapshots or epochs can be directly compared
 * along a longitudinal time series.
 */
export function evaluateVersionCompatibility(
  source: Partial<VersionSignature>,
  target: Partial<VersionSignature>
): VersionCompatibilityResult {
  const sourceBattery = source.batteryVersion || CANONICAL_VERSIONS.BATTERY_CURRENT;
  const targetBattery = target.batteryVersion || CANONICAL_VERSIONS.BATTERY_CURRENT;

  const sourceModel = source.measurementModelVersion || CANONICAL_VERSIONS.MODEL_CURRENT;
  const targetModel = target.measurementModelVersion || CANONICAL_VERSIONS.MODEL_CURRENT;

  const sourceScoring = source.scoringVersion || CANONICAL_VERSIONS.SCORING_CURRENT;
  const targetScoring = target.scoringVersion || CANONICAL_VERSIONS.SCORING_CURRENT;

  // 1. Check for Legacy 17-item form isolation
  const isSourceLegacy =
    sourceBattery.includes('LEGACY') ||
    sourceBattery.includes('legacy') ||
    sourceScoring.includes('LEGACY') ||
    sourceModel.includes('LEGACY');

  const isTargetLegacy =
    targetBattery.includes('LEGACY') ||
    targetBattery.includes('legacy') ||
    targetScoring.includes('LEGACY') ||
    targetModel.includes('LEGACY');

  if (isSourceLegacy !== isTargetLegacy) {
    return {
      isCompatible: false,
      compatibilityType: 'VERSION_INCOMPATIBLE',
      reasonTr:
        'Eski 17 maddelik tarama formu ile 91 boyutlu PsycheAI Bilimsel Araştırma Bataryası doğrudan puan karşılaştırmasına uygun değildir. Tarihsel kayıt olarak saklanır ancak trend çizgisine dahil edilmez.',
      allowDirectTrajectory: false,
    };
  }

  // 2. Exact match check
  if (
    sourceBattery === targetBattery &&
    sourceModel === targetModel &&
    sourceScoring === targetScoring
  ) {
    return {
      isCompatible: true,
      compatibilityType: 'IDENTICAL',
      reasonTr: 'Ölçüm bataryası, ontoloji modeli ve puanlama sürümleri tam uyumludur.',
      allowDirectTrajectory: true,
    };
  }

  // 3. Check for explicitly mapped versions (future extension hook)
  // Example: Future v2 with psychometric equating crosswalk
  const explicitEquatingKey = `${sourceBattery}__TO__${targetBattery}`;
  const KNOWN_EQUATING_MAPS: Record<string, string> = {
    // None established in PRE_CALIBRATION state
  };

  if (KNOWN_EQUATING_MAPS[explicitEquatingKey]) {
    return {
      isCompatible: true,
      compatibilityType: 'EXPLICIT_MAPPING_AVAILABLE',
      reasonTr: `Doğrulanmış psikometrik eşleme tablosu kullanılarak karşılaştırma yapılabilir (${KNOWN_EQUATING_MAPS[explicitEquatingKey]}).`,
      allowDirectTrajectory: true,
    };
  }

  // 4. Default: Incompatible versions
  return {
    isCompatible: false,
    compatibilityType: 'VERSION_INCOMPATIBLE',
    reasonTr: `Farklı batarya veya puanlama sürümleri (${sourceBattery} vs ${targetBattery}) arasında doğrudan karşılaştırma desteklenmemektedir.`,
    allowDirectTrajectory: false,
  };
}

/**
 * Validates a list of epoch signatures for longitudinal continuity.
 */
export function validateSeriesCompatibility(
  epochs: Array<{ batteryVersion: string; measurementModelVersion: string; scoringModelVersion: string }>
): { allCompatible: boolean; incompatibleIndices: number[]; summaryTr: string } {
  if (epochs.length <= 1) {
    return { allCompatible: true, incompatibleIndices: [], summaryTr: 'Tekil veya boş seri; sürüm uyumsuzluğu yok.' };
  }

  const baseline = epochs[0];
  const incompatibleIndices: number[] = [];

  for (let i = 1; i < epochs.length; i++) {
    const result = evaluateVersionCompatibility(
      {
        batteryVersion: baseline.batteryVersion,
        measurementModelVersion: baseline.measurementModelVersion,
        scoringVersion: baseline.scoringModelVersion,
      },
      {
        batteryVersion: epochs[i].batteryVersion,
        measurementModelVersion: epochs[i].measurementModelVersion,
        scoringVersion: epochs[i].scoringModelVersion,
      }
    );

    if (!result.isCompatible) {
      incompatibleIndices.push(i);
    }
  }

  return {
    allCompatible: incompatibleIndices.length === 0,
    incompatibleIndices,
    summaryTr:
      incompatibleIndices.length === 0
        ? 'Tüm ölçüm dönemleri sürümsel olarak uyumlu ve karşılaştırılabilirdir.'
        : `${incompatibleIndices.length} ölçüm dönemi sürüm uyumsuzluğu nedeniyle doğrudan seriye dahil edilemez.`,
  };
}
