/**
 * PsycheAI FAZ 2.19 — Theory Lens & Source Registry
 *
 * Authoritative registry for 10 historical psychological lenses and their peer-reviewed/canonical sources.
 */

import theoryLensesData from '../../../../data/theory-lenses/theory-lenses-v1.json';
import theorySourcesData from '../../../../data/theory-lenses/theory-sources-v1.json';
import {
  TheoryLensId,
  TheoryLensDefinition,
  TheorySource,
  ALL_THEORY_LENS_IDS,
} from '@/types/theoryLens';

const lenses = (theoryLensesData as unknown) as TheoryLensDefinition[];
const rawSources = (theorySourcesData as unknown) as TheorySource[];

// Add generated citation string if missing
const sources: TheorySource[] = rawSources.map((s) => ({
  ...s,
  citationTr: s.citationTr || `${s.author} (${s.year}). *${s.title}*. ${s.publisherOrJournal}.`,
}));

export function getAllTheoryLenses(): TheoryLensDefinition[] {
  return lenses;
}

export function getTheoryLens(lensId: TheoryLensId | string): TheoryLensDefinition | null {
  const match = lenses.find((l) => l.lensId.toUpperCase() === lensId.toUpperCase());
  return match || null;
}

export function getAllTheorySources(): TheorySource[] {
  return sources;
}

export function getTheorySourcesForLens(lensId: TheoryLensId | string): TheorySource[] {
  return sources.filter((s) => s.lensId.toUpperCase() === lensId.toUpperCase());
}

export function getTheorySourceById(sourceId: string): TheorySource | null {
  const match = sources.find((s) => s.sourceId === sourceId);
  return match || null;
}

export function isTheoryLensId(id: string): id is TheoryLensId {
  return ALL_THEORY_LENS_IDS.includes(id.toUpperCase() as TheoryLensId);
}
