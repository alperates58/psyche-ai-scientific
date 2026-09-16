/**
 * PsycheAI Trait Heatmap Data Model
 * 
 * High-density profile matrix displaying scale-relative response range positions.
 * Enforces non-percentile semantics and instrument-specific descriptive band policies.
 */

export type HeatmapCellState =
  | 'UNMEASURED'
  | 'LOWER_RESPONSE_RANGE'
  | 'MID_RESPONSE_RANGE'
  | 'UPPER_RESPONSE_RANGE'
  | 'DESCRIPTIVE_BAND_UNAVAILABLE';

export interface HeatmapCellViewModel {
  facetId: string;
  facetCode: string;
  facetNameTr: string;
  constructCode: string;
  constructNameTr: string;
  domainCode: string;
  domainNameTr: string;
  isMeasured: boolean;
  rawScore: number | null;
  scaleMin: number | null;
  scaleMax: number | null;
  normalizedVisualCoordinate: number | null; // 0-100 visual presentation coordinate only
  cellState: HeatmapCellState;
  stateLabelTr: string;
  itemCount: number;
  measurementSupport: 'High' | 'Moderate' | 'Developing' | 'Unmeasured';
  instrumentName: string | null;
  formVersionCode: string | null;
  measuredAt: string | null;
  epistemicStatus: string;
}

export interface HeatmapRowViewModel {
  domainId: string;
  domainCode: string;
  domainNameTr: string;
  constructId: string;
  constructCode: string;
  constructNameTr: string;
  cells: HeatmapCellViewModel[];
}

export interface HeatmapMatrixViewModel {
  rows: HeatmapRowViewModel[];
  totalCells: number;
  measuredCellsCount: number;
  unmeasuredCellsCount: number;
  legendDisclaimerTr: string;
}
