import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { lintItemBank, lintItem } from '../src/research/item-quality';
import { prisma } from '../src/lib/prisma';

describe('FAZ 2: Scientific Master Item Bank Integrity & Epistemics', () => {
  const masterBankPath = path.resolve(__dirname, '../data/master-item-bank.json');
  const evidenceMapPath = path.resolve(__dirname, '../research/facet-evidence-map.json');
  const constructsPath = path.resolve(__dirname, '../data/constructs.json');
  const instrumentsPath = path.resolve(__dirname, '../data/instrument-registry.json');
  const sourcesPath = path.resolve(__dirname, '../data/source-registry.json');

  const items = JSON.parse(fs.readFileSync(masterBankPath, 'utf8'));
  const evidenceMap = JSON.parse(fs.readFileSync(evidenceMapPath, 'utf8'));
  const constructs = JSON.parse(fs.readFileSync(constructsPath, 'utf8'));
  const instruments = JSON.parse(fs.readFileSync(instrumentsPath, 'utf8'));
  const sources = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));

  it('1. every facet in constructs ontology has an evidence map entry', () => {
    expect(evidenceMap.length).toBe(84);
    const ontologyFacetIds = new Set(constructs.map((c: any) => c.facetId));
    const evidenceFacetIds = new Set(evidenceMap.map((e: any) => e.facetId));

    expect(evidenceFacetIds.size).toBe(84);
    for (const id of ontologyFacetIds) {
      expect(evidenceFacetIds.has(id)).toBe(true);
    }
  });

  it('2. every evidence map entry has operational definitions, boundaries, and observable indicators', () => {
    for (const ev of evidenceMap) {
      expect(ev.operationalDefinition_tr).toBeTruthy();
      expect(ev.operationalDefinition_en).toBeTruthy();
      expect(ev.constructBoundary).toBeTruthy();
      expect(ev.whatItMeasures).toBeTruthy();
      expect(ev.whatItDoesNotMeasure).toBeTruthy();
      expect(Array.isArray(ev.observableIndicators)).toBe(true);
      expect(ev.observableIndicators.length).toBeGreaterThan(0);
      expect(ev.evidenceLevel).toMatch(/gold_standard|tier_a|tier_b/);
    }
  });

  it('3. every candidate item belongs to a valid facet in constructs.json', () => {
    const validFacetIds = new Set(constructs.map((c: any) => c.facetId));
    expect(items.length).toBeGreaterThanOrEqual(700);

    for (const item of items) {
      expect(validFacetIds.has(item.facetId)).toBe(true);
    }
  });

  it('4. all 84 facets have at least 6 candidate items in the master bank', () => {
    const facetCounts: Record<string, number> = {};
    for (const item of items) {
      facetCounts[item.facetId] = (facetCounts[item.facetId] || 0) + 1;
    }

    const ontologyFacetIds = constructs.map((c: any) => c.facetId);
    for (const id of ontologyFacetIds) {
      const count = facetCounts[id] || 0;
      expect(count).toBeGreaterThanOrEqual(6);
    }
  });

  it('5. every item has valid provenance, sources, and confirmed license status', () => {
    const validLicenses = new Set(['APPROVED_PUBLIC', 'APPROVED_WITH_ATTRIBUTION', 'RESEARCH_ONLY']);

    for (const item of items) {
      expect(item.sourceType).toBeTruthy();
      expect(item.sourceIds).toBeDefined();
      expect(Array.isArray(item.sourceIds)).toBe(true);
      expect(item.sourceIds.length).toBeGreaterThan(0);
      expect(validLicenses.has(item.licenseStatus)).toBe(true);
    }
  });

  it('6. no rejected instrument items enter the bank', () => {
    const rejectedInstrumentIds = new Set(
      instruments.filter((inst: any) => inst.decision === 'REJECTED' || inst.decision === 'rejected').map((inst: any) => inst.instrumentId)
    );

    for (const item of items) {
      if (item.instrumentIds) {
        for (const instId of item.instrumentIds) {
          expect(rejectedInstrumentIds.has(instId)).toBe(false);
        }
      }
    }
  });

  it('7. no candidate item is automatically published into live assessment form v1.0.0', async () => {
    const publishedForms = await prisma.assessmentFormVersion.findMany({
      where: { isPublished: true },
      include: {
        items: {
          include: {
            itemVersion: {
              include: { item: true }
            }
          }
        }
      }
    });

    expect(publishedForms.length).toBeGreaterThan(0);

    for (const form of publishedForms) {
      // Form v1.0.0 must remain frozen with exactly 17 items
      expect(form.versionCode).toBe('v1.0.0');
      expect(form.items.length).toBe(17);

      // Verify none of the newly generated candidate items (e.g. CP-HH-*, SS-*, etc.) are in this form
      for (const formItem of form.items) {
        const itemCode = formItem.itemVersion.item.itemCode;
        expect(itemCode.startsWith('CP-')).toBe(false);
        expect(itemCode.startsWith('SS-')).toBe(false);
        expect(itemCode.startsWith('ER-')).toBe(false);
      }
    }
  });

  it('8. stable item IDs are globally unique', () => {
    const seenIds = new Set<string>();
    for (const item of items) {
      expect(seenIds.has(item.id)).toBe(false);
      seenIds.add(item.id);
    }
  });

  it('9. all response scales are valid (1 to 6 or 1 to 5) with proper step and labels', () => {
    for (const item of items) {
      if (item.responseScale) {
        expect(item.responseScale.min).toBeGreaterThanOrEqual(1);
        expect(item.responseScale.max).toBeGreaterThan(item.responseScale.min);
        expect(item.responseScale.labels_tr.length).toBe(item.responseScale.max - item.responseScale.min + 1);
      }
    }
  });

  it('10. no newly generated candidate item has VALIDATED status (must be RESEARCH_DRAFT or INTERNAL_REVIEW)', () => {
    for (const item of items) {
      expect(item.validationStatus).not.toBe('VALIDATED');
      expect(item.validationStatus).toBe('RESEARCH_DRAFT');
      expect(item.candidateStatus).toMatch(/INTERNAL_REVIEW|DRAFT|RESEARCH_ONLY/);
    }
  });

  it('11. optional Dark Tetrad items are strictly isolated under optional_dark_tetrad domain and marked RESEARCH_ONLY', () => {
    const darkTetradItems = items.filter((it: any) => it.domainId === 'optional_dark_tetrad');
    expect(darkTetradItems.length).toBe(40);

    for (const dtItem of darkTetradItems) {
      expect(dtItem.isOptionalModule).toBe(true);
      expect(dtItem.candidateStatus).toBe('RESEARCH_ONLY');
      expect(dtItem.sourceType).toBe('RESEARCH_ONLY');
    }
  });

  it('12. attention checks are isolated under response_integrity and not psychometrically scored', () => {
    const attentionItems = items.filter((it: any) => it.attentionCheck === true);
    expect(attentionItems.length).toBeGreaterThanOrEqual(8);

    for (const att of attentionItems) {
      expect(att.domainId).toBe('response_integrity');
      expect(att.measurementPurpose).toBe('careless_detection');
    }
  });

  it('13. translation provenance is documented for all items', () => {
    for (const item of items) {
      expect(item.translationProvenance).toBeDefined();
      expect(item.translationProvenance.originalLanguage).toBe('tr');
      expect(item.translationProvenance.translationMethod).toBeTruthy();
      expect(item.translationProvenance.translatorType).toBeTruthy();
    }
  });

  it('14. Item Quality Linter runs cleanly with zero critical issues', () => {
    const lintReport = lintItemBank(items);
    expect(lintReport.summary.criticalIssuesCount).toBe(0);
    expect(lintReport.summary.averageQualityScore).toBeGreaterThanOrEqual(95);
    expect(lintReport.summary.totalItemsScanned).toBe(items.length);
  });
});
