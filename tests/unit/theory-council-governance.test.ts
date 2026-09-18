import { describe, it, expect } from 'vitest';
import { getAllTheoryLenses, getTheoryLens } from '@/lib/ai/theoryLens/theoryLensRegistry';

describe('Theory Council Scientific Governance & Lens Integrity', () => {
  it('preserves exactly 10 authoritative lenses in the registry', () => {
    const lenses = getAllTheoryLenses();
    expect(lenses.length).toBe(10);
  });

  it('contains the canonical 10 psychological thinkers without unauthorized additions', () => {
    const expectedIds = [
      'FREUD',
      'JUNG',
      'ADLER',
      'ROGERS',
      'MASLOW',
      'SKINNER',
      'WILLIAM_JAMES',
      'GESTALT',
      'FRANKL',
      'BECK',
    ];

    const actualIds = getAllTheoryLenses().map((l) => l.lensId);
    expect(actualIds.sort()).toEqual(expectedIds.sort());
  });

  it('provides rich Turkish descriptions, historical context, and reflection prompts for all lenses', () => {
    for (const lens of getAllTheoryLenses()) {
      expect(lens.displayNameTr).toBeDefined();
      expect(lens.theoristName).toBeDefined();
      expect(lens.shortDescriptionTr).toBeDefined();
      expect(lens.historicalContextTr).toBeDefined();
      expect(lens.coreConcepts.length).toBeGreaterThan(0);
      expect(lens.historicalLimitations.length).toBeGreaterThan(0);
      expect(lens.modernEvidenceLimitations.length).toBeGreaterThan(0);
      expect(lens.reflectionPrompts.length).toBeGreaterThan(0);
      expect(lens.sourceIds.length).toBeGreaterThan(0);
    }
  });

  it('correctly retrieves individual lenses by ID (case insensitive)', () => {
    const freud = getTheoryLens('FREUD');
    expect(freud).toBeDefined();
    expect(freud?.theoristName).toBe('Sigmund Freud');

    const rogers = getTheoryLens('rogers');
    expect(rogers).toBeDefined();
    expect(rogers?.theoristName).toBe('Carl Rogers');

    const nonExistent = getTheoryLens('INVALID_LENS');
    expect(nonExistent).toBeNull();
  });
});
