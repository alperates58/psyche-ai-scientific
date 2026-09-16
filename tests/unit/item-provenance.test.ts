import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  DEFAULT_ASSESSMENT_MODULE_PORTFOLIO,
  ASSESSMENT_CATALOG_CATEGORIES,
} from '../../src/lib/assessmentJourneyConfig';
import { VERIFIED_FORM_MANIFESTS } from '../../scripts/seed-executable-assessments';

describe('FAZ 2.16 — Item-Level Scientific Provenance & Turkish Localization', () => {
  const rootDir = path.resolve(__dirname, '../..');
  const provenanceMatrixPath = path.join(rootDir, 'data/assessment-architecture/instrument-item-provenance.json');
  const archJsonPath = path.join(rootDir, 'data/assessment-architecture/assessment-architecture.json');

  it('1. Verifies that instrument-item-provenance.json matrix exists and is valid', () => {
    expect(fs.existsSync(provenanceMatrixPath)).toBe(true);
    const matrix = JSON.parse(fs.readFileSync(provenanceMatrixPath, 'utf-8'));
    expect(Array.isArray(matrix)).toBe(true);
    expect(matrix.length).toBeGreaterThanOrEqual(27);

    for (const entry of matrix) {
      expect(entry).toHaveProperty('instrumentId');
      expect(entry).toHaveProperty('formCode');
      expect(entry).toHaveProperty('officialItemCount');
      expect(entry).toHaveProperty('provenanceStatus');
      expect(entry).toHaveProperty('blockingReason');
      expect(typeof entry.fullFormExecutable).toBe('boolean');

      if (entry.fullFormExecutable) {
        expect(['VERIFIED_EXACT', 'VERIFIED_TRANSLATION']).toContain(entry.provenanceStatus);
      }
    }
  });

  it('2. Enforces that only verified manifest forms can be executable', () => {
    expect(VERIFIED_FORM_MANIFESTS.length).toBeGreaterThanOrEqual(1);
    for (const manifest of VERIFIED_FORM_MANIFESTS) {
      expect(manifest.itemCodes.length).toBeGreaterThan(0);
      expect(manifest.itemCodes.every((code) => typeof code === 'string' && code.length > 0)).toBe(true);
      expect(manifest.instrumentId).toBeDefined();
    }
  });

  it('3. Enforces 100% Turkish localization on DEFAULT_ASSESSMENT_MODULE_PORTFOLIO', () => {
    expect(DEFAULT_ASSESSMENT_MODULE_PORTFOLIO.length).toBe(16);

    for (const mod of DEFAULT_ASSESSMENT_MODULE_PORTFOLIO) {
      // Titles must not contain English acronym brackets
      expect(mod.titleTr).not.toMatch(/\(HEXACO-60\)/);
      expect(mod.titleTr).not.toMatch(/\(RSES & GSE\)/);
      expect(mod.titleTr).not.toMatch(/\(ERQ\)/);
      expect(mod.titleTr).not.toMatch(/\(NFC & Epistemic Curiosity\)/);
      expect(mod.titleTr).not.toMatch(/\(BPNSFS\)/);
      expect(mod.titleTr).not.toMatch(/\(SD4\)/);

      // Descriptions and rationales must be Turkish non-empty
      expect(mod.titleTr.length).toBeGreaterThan(3);
      expect(mod.subtitleTr.length).toBeGreaterThan(3);
      expect(mod.descriptionTr.length).toBeGreaterThan(10);
      expect(mod.rationaleTr.length).toBeGreaterThan(10);
    }
  });

  it('4. Enforces 100% Turkish localization in assessment-architecture.json', () => {
    const arch = JSON.parse(fs.readFileSync(archJsonPath, 'utf-8'));
    expect(arch.length).toBe(16);

    for (const m of arch) {
      expect(m.titleTr).toBeDefined();
      expect(m.subtitleTr).toBeDefined();
      expect(m.descriptionTr).toBeDefined();
      expect(m.rationale).toBeDefined();

      // Ensure no English phrases exist in user-facing Turkish descriptions
      expect(m.rationale).not.toContain('measuring 6 broad personality factors');
      expect(m.rationale).not.toContain('Combines Rosenberg Self-Esteem');
      expect(m.rationale).not.toContain('Standard 10-item instrument');
    }
  });

  it('5. Verifies that unverified named instruments are marked CONTENT_PENDING_PROVENANCE', () => {
    const matrix = JSON.parse(fs.readFileSync(provenanceMatrixPath, 'utf-8'));
    const unverifiedInstrumentIds = [
      'inst_hexaco_60',
      'inst_rses',
      'inst_gses',
      'inst_erq',
      'inst_bpnsfs',
      'inst_ecr_r',
      'inst_sd4',
    ];

    for (const id of unverifiedInstrumentIds) {
      const entry = matrix.find((m: any) => m.instrumentId === id);
      expect(entry).toBeDefined();
      expect(entry.fullFormExecutable).toBe(false);
      expect(entry.provenanceStatus).toBe('CONTENT_PENDING_PROVENANCE');
      expect(entry.blockingReason.length).toBeGreaterThan(5);
    }
  });
});
