import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { lintItemBank, lintItem, analyzeLexicalClusters } from '../src/research/item-quality';
import { prisma } from '../src/lib/prisma';

describe('FAZ 2 & 2.1: Forensic Scientific Master Item Bank Integrity & Epistemics', () => {
  const masterBankPath = path.resolve(__dirname, '../data/master-item-bank.json');
  const evidenceMapPath = path.resolve(__dirname, '../research/facet-evidence-map.json');
  const trMatrixPath = path.resolve(__dirname, '../research/turkish-validation-matrix.json');
  const constructsPath = path.resolve(__dirname, '../data/constructs.json');
  const instrumentsPath = path.resolve(__dirname, '../data/instrument-registry.json');
  const sourcesPath = path.resolve(__dirname, '../data/source-registry.json');

  const items = JSON.parse(fs.readFileSync(masterBankPath, 'utf8'));
  const evidenceMap = JSON.parse(fs.readFileSync(evidenceMapPath, 'utf8'));
  const trMatrix = JSON.parse(fs.readFileSync(trMatrixPath, 'utf8'));
  const constructs = JSON.parse(fs.readFileSync(constructsPath, 'utf8'));
  const instruments = JSON.parse(fs.readFileSync(instrumentsPath, 'utf8'));
  const sources = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));

  // 1. Coverage
  it('1. every facet in constructs ontology has an evidence map entry', () => {
    expect(evidenceMap.length).toBe(84);
    const ontologyFacetIds = new Set(constructs.map((c: any) => c.facetId));
    const evidenceFacetIds = new Set(evidenceMap.map((e: any) => e.facetId));

    expect(evidenceFacetIds.size).toBe(84);
    for (const id of ontologyFacetIds) {
      expect(evidenceFacetIds.has(id)).toBe(true);
    }
  });

  it('2. every evidence map entry has operational definitions, boundaries, indicators and honest evidence level', () => {
    for (const ev of evidenceMap) {
      expect(ev.operationalDefinition_tr).toBeTruthy();
      expect(ev.operationalDefinition_en).toBeTruthy();
      expect(ev.constructBoundary).toBeTruthy();
      expect(ev.whatItMeasures).toBeTruthy();
      expect(ev.whatItDoesNotMeasure).toBeTruthy();
      expect(Array.isArray(ev.observableIndicators)).toBe(true);
      expect(ev.observableIndicators.length).toBeGreaterThan(0);
      expect(ev.evidenceLevel).toMatch(/STRONG_DIRECT_EVIDENCE|MODERATE_DIRECT_EVIDENCE|INDIRECT_EVIDENCE|THEORETICAL_SUPPORT|LIMITED_EVIDENCE|UNVERIFIED/);
    }
  });

  it('3. every candidate item belongs to a valid facet in constructs.json', () => {
    const validFacetIds = new Set(constructs.map((c: any) => c.facetId));
    expect(items.length).toBe(832);

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
    const validLicenses = new Set(['ORIGINAL_WORDING_UNRESTRICTED', 'APPROVED_PUBLIC', 'APPROVED_WITH_ATTRIBUTION', 'RESEARCH_ONLY']);

    for (const item of items) {
      expect(item.constructEvidenceSources).toBeDefined();
      expect(Array.isArray(item.constructEvidenceSources)).toBe(true);
      expect(item.constructEvidenceSources.length).toBeGreaterThan(0);
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
    try {
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

      expect(publishedForms.length).toBeGreaterThanOrEqual(1);
      for (const form of publishedForms) {
        expect(form.items.length).toBe(17);
        for (const formItem of form.items) {
          expect(formItem.itemVersion.validationStatus).toBe('PRE_CALIBRATION');
          expect(formItem.itemVersion.item.itemCode).toMatch(/^itm_/);
          expect(items.some((it: any) => it.id === formItem.itemVersion.item.itemCode)).toBe(false);
        }
      }
    } catch (e: any) {
      if (
        e?.message?.includes("Can't reach database server") ||
        e?.message?.includes("Environment variable not found") ||
        e?.name === 'PrismaClientInitializationError'
      ) {
        // Offline / No-DB mode: verify source-of-truth seed definition directly
        const seedPath = path.resolve(__dirname, '../prisma/seed.ts');
        const seedContent = fs.readFileSync(seedPath, 'utf8');
        expect(seedContent).toContain("versionCode: 'v1.0.0'");
        const seedItemCodes = (seedContent.match(/itemCode:\s*'itm_[^']+'/g) || [])
          .map(m => m.replace(/itemCode:\s*'/, '').replace(/'/, ''));
        const uniqueCodes = new Set(seedItemCodes);
        expect(uniqueCodes.size).toBe(17);
        for (const code of uniqueCodes) {
          expect(items.some((it: any) => it.id === code)).toBe(false);
        }
        return;
      }
      throw e;
    }
  });

  it('8. all item IDs are globally unique', () => {
    const idSet = new Set<string>();
    for (const item of items) {
      expect(idSet.has(item.id)).toBe(false);
      idSet.add(item.id);
    }
    expect(idSet.size).toBe(832);
  });

  it('9. reverse scored items use dynamic min/max scale and have reverseWorded true', () => {
    const reverseItems = items.filter((it: any) => it.keying === 'NEGATIVE');
    expect(reverseItems.length).toBeGreaterThan(84);

    for (const it of reverseItems) {
      expect(it.reverseWorded).toBe(true);
      if (it.responseScale) {
        expect(it.responseScale.min).toBeDefined();
        expect(it.responseScale.max).toBeDefined();
        expect(it.responseScale.max).toBeGreaterThan(it.responseScale.min);
      }
    }
  });

  it('10. no candidate item has uncalibrated VALIDATED status', () => {
    for (const item of items) {
      expect(item.validationStatus).toBe('RESEARCH_DRAFT');
    }
  });

  it('11. dark tetrad items are isolated as RESEARCH_ONLY', () => {
    const dtItems = items.filter((it: any) => it.domainId === 'optional_dark_tetrad');
    expect(dtItems.length).toBe(40);

    for (const it of dtItems) {
      expect(it.candidateStatus).toBe('RESEARCH_ONLY');
      expect(it.licenseStatus).toBe('RESEARCH_ONLY');
    }
  });

  // =========================================================================
  // FAZ 2.1 FORENSIC AUDIT TESTS (14 Strict Epistemic & Forensic Rules)
  // =========================================================================

  it('12. FORENSIC: missing metadata cannot become VALIDATED_AVAILABLE', () => {
    for (const ev of evidenceMap) {
      expect(ev.turkishValidationStatus).not.toBe('VALIDATED_AVAILABLE');
      expect(ev.turkishValidationStatus).toMatch(/DIRECT_FACET_VALIDATION|LEXICAL_SUPPORT_ONLY|RELATED_MEASURE_VALIDATION|NO_DIRECT_TURKISH_VALIDATION/);
    }
  });

  it('13. FORENSIC: epistemic tier cannot auto-create gold_standard evidenceLevel', () => {
    // Check that not every tier A construct receives gold_standard
    const tierAFacets = constructs.filter((c: any) => c.epistemicTier === 'A').map((c: any) => c.facetId);
    const goldStandardCount = evidenceMap.filter((ev: any) => tierAFacets.includes(ev.facetId) && ev.evidenceLevel === 'STRONG_DIRECT_EVIDENCE').length;
    // Only facets with actual direct peer-reviewed Turkish empirical data should have STRONG_DIRECT_EVIDENCE
    expect(goldStandardCount).toBeLessThan(tierAFacets.length);
  });

  it('14. FORENSIC: AI authored item cannot claim scientific research team authorship', () => {
    for (const item of items) {
      expect(item.translationProvenance?.authorType).toBe('GENERATIVE_AI');
      expect(item.translationProvenance?.authoringMethod).toBe('AI_ASSISTED_ORIGINAL_DRAFT');
      expect(item.translationProvenance?.translatorType).toBeUndefined();
      expect(item.humanExpertReviewed).toBe(false);
    }
  });

  it('15. FORENSIC: AI item cannot inherit IPIP public-domain wording license automatically', () => {
    for (const item of items) {
      expect(item.itemWordingSource).toBe('ORIGINAL_AI_ASSISTED');
      expect(item.licenseBasis).toBe('ORIGINAL_WORDING');
    }
  });

  it('16. FORENSIC: numeric correlation claims require claim-level source (no unverified r values)', () => {
    for (const ev of evidenceMap) {
      const corrStr = JSON.stringify(ev.expectedCorrelates || []);
      expect(corrStr).not.toContain('r =');
      expect(corrStr).not.toContain('r=');
    }
  });

  it('17. FORENSIC: cultural claim requires verified source or hypothesis tag', () => {
    for (const ev of evidenceMap) {
      if (ev.culturalSensitivity) {
        const hasVerifiedSource = ev.culturalSensitivity.includes('src_wasti_2008')
          || ev.culturalSensitivity.includes('src_kagitcibasi_2005_self')
          || ev.culturalSensitivity.includes('src_cuhadaroglu_1986');
        const isTaggedHypothesis = ev.culturalSensitivity.includes('CULTURAL_HYPOTHESIS_UNVERIFIED');
        expect(hasVerifiedSource || isTaggedHypothesis).toBe(true);
      }
    }
  });

  it('18. FORENSIC: lexical analyzer cannot label result as semantic similarity', () => {
    const sample = items.slice(0, 10).map((it: any) => ({ id: it.id, facetId: it.facetId, text_tr: it.text_tr }));
    const rep = analyzeLexicalClusters(sample, 0.70);
    expect(rep.method).toBe('LEXICAL_SIMILARITY_ANALYSIS');
    expect(rep.semanticDuplicateStatus).toBe('NOT_ASSESSED');
  });

  it('19. FORENSIC: duplicateClustersCount cannot be hard-coded to 0 in lintItemBank', () => {
    const mockItems = [
      { id: 'TEST-1', facetId: 'f1', text_tr: 'Bu tamamen aynı cümle kalıbıdır ve test edilir.' },
      { id: 'TEST-2', facetId: 'f1', text_tr: 'Bu tamamen aynı cümle kalıbıdır ve test edilir.' }
    ];
    const lint = lintItemBank(mockItems as any);
    expect(lint.summary.duplicateClustersCount).toBeGreaterThanOrEqual(1);
  });

  it('20. FORENSIC: SJT requires >=3 plausible options before review-ready (internal design heuristic)', () => {
    const sjtItems = items.filter((it: any) => it.itemType === 'situational_judgement');
    expect(sjtItems.length).toBeGreaterThanOrEqual(4);

    for (const sjt of sjtItems) {
      const scenarios = sjt.situationalScenarios || [];
      if (scenarios.length < 3) {
        expect(sjt.sjtReviewStatus).toBe('SJT_REQUIRES_REVISION');
        expect(sjt.triageStatus).toBe('REQUIRES_INTERNAL_REVISION');
        expect(sjt.isPsychometricallyScored).toBe(false);
      }
    }
  });

  it('21. FORENSIC: forced-choice requires desirability review and is not calibrated', () => {
    const fcItems = items.filter((it: any) => it.itemType === 'forced_choice');
    expect(fcItems.length).toBeGreaterThanOrEqual(4);

    for (const fc of fcItems) {
      expect(fc.forcedChoiceDesirabilityStatus).toBe('FORCED_CHOICE_DESIRABILITY_MISMATCH');
      expect(fc.triageStatus).toBe('REQUIRES_INTERNAL_REVISION');
      expect(fc.forcedChoiceBlock?.scoringApproach).toBe('SCORING_NOT_CALIBRATED');
    }
  });

  it('22. FORENSIC: unverified Turkish adaptation cannot count as validated (Wasti 2008 is lexical support only)', () => {
    const hexacoFacets = trMatrix.filter((m: any) => m.domainId === 'core_personality');
    expect(hexacoFacets.length).toBe(24);

    for (const hf of hexacoFacets) {
      expect(hf.status).toBe('LEXICAL_SUPPORT_ONLY');
      expect(hf.status).not.toBe('DIRECT_FACET_VALIDATION');
    }
  });

  it('23. FORENSIC: generic fallback evidence strings are strictly prohibited', () => {
    for (const ev of evidenceMap) {
      expect(ev.observableIndicators).not.toContain('Bu psikolojik yapıya uygun davranışsal eğilim sergiler.');
      expect(JSON.stringify(ev.expectedCorrelates)).not.toContain('İlgili psikolojik domain değişkenleri ile beklenen kuramsal ilişkiler');
    }
  });

  it('24. FORENSIC: instrument approved status requires license evidence and verification', () => {
    const approvedInsts = instruments.filter((i: any) => i.decision === 'APPROVED_PUBLIC' || i.decision === 'APPROVED_WITH_ATTRIBUTION');
    expect(approvedInsts.length).toBeGreaterThanOrEqual(3);

    for (const inst of approvedInsts) {
      expect(inst.verificationStatus).toBe('VERIFIED_AUTHORITATIVE');
      expect(inst.licenseEvidenceUrl).toBeTruthy();
      expect(inst.licenseEvidenceTextSummary).toBeTruthy();
      expect(inst.commercialUseVerified).toBe(true);
    }
  });

  it('25. FORENSIC: automated tests verify software & data integrity, not scientific validity', () => {
    // Epistemic boundary meta-test: confirm no item claims human expert sign-off
    const expertReviewedCount = items.filter((it: any) => it.humanExpertReviewed === true).length;
    expect(expertReviewedCount).toBe(0);
    const validCount = items.filter((it: any) => it.validationStatus === 'VALIDATED').length;
    expect(validCount).toBe(0);
  });

  // =========================================================================
  // FAZ 2.2 EVIDENCE CLOSURE AUDIT TESTS (Strict Claim-Level & Provenance Rules)
  // =========================================================================

  it('26. CLOSURE: DIRECT_FACET_VALIDATION strictly requires verified Turkish source', () => {
    const sourceMap = new Map<string, any>();
    sources.forEach((s: any) => sourceMap.set(s.sourceId, s));

    const directFacets = trMatrix.filter((f: any) => f.status === 'DIRECT_FACET_VALIDATION');
    expect(directFacets.length).toBe(14);

    for (const facet of directFacets) {
      expect(facet.sourceIds.length).toBeGreaterThanOrEqual(1);
      const hasVerifiedTurkishSource = facet.sourceIds.some((sid: string) => {
        const src = sourceMap.get(sid);
        return (
          src &&
          (src.language === 'tr' || src.isTurkishAdaptation === true) &&
          (src.bibliographicVerificationStatus === 'VERIFIED_PRIMARY' || src.bibliographicVerificationStatus === 'VERIFIED_SECONDARY') &&
          src.evidenceScope === 'DIRECT_FACET'
        );
      });
      expect(hasVerifiedTurkishSource).toBe(true);
    }
  });

  it('27. CLOSURE: English original instrument source alone cannot satisfy Turkish direct validation', () => {
    // Facets that only have English instrument papers MUST be NO_DIRECT_TURKISH_VALIDATION
    const unadaptedEnglishFacets = [
      'cognitive_reappraisal',
      'expressive_suppression',
      'distress_tolerance',
      'need_for_cognition',
      'empathic_concern',
      'impression_management'
    ];

    for (const fid of unadaptedEnglishFacets) {
      const facet = trMatrix.find((f: any) => f.facetId === fid);
      expect(facet).toBeDefined();
      expect(facet.status).toBe('NO_DIRECT_TURKISH_VALIDATION');
      expect(facet.status).not.toBe('DIRECT_FACET_VALIDATION');
    }
  });

  it('28. CLOSURE: sampleDescription cannot act as provenance (zero unverified citations)', () => {
    // Unverified citations that were previously in sampleDescription without registered sources
    const forbiddenCitationPhrases = [
      'Yurtsever, 2008',
      'Yılmaz, 2005',
      'Demirtaş, 2013',
      'Yıldırım et al.',
      'Sarı & Dağ, 2009 on DTS'
    ];

    for (const facet of trMatrix) {
      for (const phrase of forbiddenCitationPhrases) {
        expect(facet.sampleDescription).not.toContain(phrase);
      }
      if (facet.status === 'NO_DIRECT_TURKISH_VALIDATION') {
        expect(facet.sampleDescription).toBe('Henüz doğrudan Türkçe psikometrik adaptasyon çalışması doğrulanmamıştır.');
      }
    }
  });

  it('29. CLOSURE: all non-null reliability numbers require registered sourceId and claimVerificationStatus', () => {
    const validClaimStatuses = new Set(['VERIFIED_EXACT', 'VERIFIED_GENERAL', 'NOT_VERIFIED', 'CONFLICTING_EVIDENCE', 'NOT_ASSESSED']);
    const sourceIds = new Set(sources.map((s: any) => s.sourceId));

    for (const facet of trMatrix) {
      const claims = [
        facet.reliabilityEvidence.internalConsistency,
        facet.reliabilityEvidence.testRetest,
        facet.studyEvidence.sampleN
      ];

      claims.forEach((claim: any) => {
        expect(claim).toBeDefined();
        expect(validClaimStatuses.has(claim.claimVerificationStatus)).toBe(true);

        if (claim.value !== null) {
          expect(claim.sourceId).toBeTruthy();
          expect(sourceIds.has(claim.sourceId)).toBe(true);
          expect(claim.claimVerificationStatus).toBe('VERIFIED_EXACT');
        } else {
          expect(['NOT_VERIFIED', 'NOT_ASSESSED']).toContain(claim.claimVerificationStatus);
        }
      });
    }
  });

  it('30. CLOSURE: VERIFIED_EXACT claims strictly require location field (page/table reference)', () => {
    for (const facet of trMatrix) {
      const claims = [
        facet.reliabilityEvidence.internalConsistency,
        facet.reliabilityEvidence.testRetest,
        facet.studyEvidence.sampleN
      ];
      claims.forEach((claim: any) => {
        if (claim.claimVerificationStatus === 'VERIFIED_EXACT') {
          expect(claim.location).toBeTruthy();
          expect(typeof claim.location).toBe('string');
          expect(claim.location.length).toBeGreaterThan(2);
        }
      });
    }
  });

  it('31. CLOSURE: every source in source-registry has bibliographicVerificationStatus, language, and evidenceScope', () => {
    const validBibStatuses = new Set(['VERIFIED_PRIMARY', 'VERIFIED_SECONDARY', 'UNVERIFIED']);
    const validScopes = new Set(['DIRECT_FACET', 'DIRECT_CONSTRUCT', 'RELATED_CONSTRUCT', 'LEXICAL', 'TRANSLATION_ONLY', 'METHODOLOGICAL']);

    for (const src of sources) {
      expect(validBibStatuses.has(src.bibliographicVerificationStatus)).toBe(true);
      expect(['tr', 'en']).toContain(src.language);
      expect(typeof src.isTurkishAdaptation).toBe('boolean');
      expect(validScopes.has(src.evidenceScope)).toBe(true);
    }
  });

  it('32. CLOSURE: runtime report generator dynamically computes statistics matching JSON files exactly', async () => {
    const { generateScientificAuditReport } = await import('../scripts/generate-scientific-audit-report');
    const reportText = generateScientificAuditReport();

    expect(reportText).toContain(`Toplam Kaynak: ${sources.length}`);
    expect(reportText).toContain(`Toplam: 14 / 84 facet`);
    expect(reportText).toContain(`Toplam: 24 / 84 facet`);
    expect(reportText).toContain(`Toplam: 44 / 84 facet`);
    expect(reportText).toContain(`Toplam: 2 / 84 facet`);
    expect(reportText).toContain(`Toplam: 252 iddia`);
    expect(reportText).toContain(`Toplam Doğrulanmış İddia: 32`);
    expect(reportText).toContain(`Toplam: 148`);
    expect(reportText).toContain(`Toplam: 72`);
  });

  it('33. CLOSURE: related measure validation requires registered related Turkish instrument', () => {
    const relatedFacets = trMatrix.filter((f: any) => f.status === 'RELATED_MEASURE_VALIDATION');
    expect(relatedFacets.length).toBe(2);

    for (const rf of relatedFacets) {
      expect(['emotional_reactivity', 'emotional_recovery']).toContain(rf.facetId);
      expect(rf.sourceIds).toContain('src_ruganci_gencoz_2010');
    }

    // conflict_collaborating and conflict_avoiding must NOT be RELATED_MEASURE_VALIDATION
    const conflictFacets = trMatrix.filter((f: any) => f.facetId === 'conflict_collaborating' || f.facetId === 'conflict_avoiding');
    for (const cf of conflictFacets) {
      expect(cf.status).toBe('NO_DIRECT_TURKISH_VALIDATION');
    }
  });

  // =========================================================================
  // FAZ 2.3 EVIDENCE SEMANTICS & REPORT PURITY TESTS (10 Forensic Semantics Tests)
  // =========================================================================

  it('34. SEMANTICS: lexical study cannot be classified as Turkish scale adaptation', () => {
    const wasti = sources.find((s: any) => s.sourceId === 'src_wasti_2008');
    expect(wasti).toBeDefined();
    expect(wasti.isTurkishAdaptation).toBe(false);
    expect(wasti.studyType).toBe('TURKISH_LEXICAL_STUDY');
    expect(wasti.studyPopulationCountry).toBe('TR');
    expect(wasti.studyLanguageContext).toBe('tr');
    expect(wasti.evidenceScope).toBe('LEXICAL');
  });

  it('35. SEMANTICS: Turkish context != Turkish adaptation', () => {
    const trContextStudies = sources.filter((s: any) => s.studyPopulationCountry === 'TR' || s.studyLanguageContext === 'tr');
    const trScaleAdaptations = sources.filter((s: any) => s.studyType === 'TURKISH_SCALE_ADAPTATION');
    const trLexicalStudies = sources.filter((s: any) => s.studyType === 'TURKISH_LEXICAL_STUDY');
    const trTheoreticalModels = sources.filter((s: any) => s.studyType === 'TURKISH_THEORETICAL_MODEL');

    expect(trContextStudies.length).toBe(15);
    expect(trScaleAdaptations.length).toBe(13);
    expect(trLexicalStudies.length).toBe(1);
    expect(trTheoreticalModels.length).toBe(1);
    expect(trScaleAdaptations.length).toBeLessThan(trContextStudies.length);
  });

  it('36. SEMANTICS: lexical facet cannot inherit study N as facet validation N', () => {
    const lexicalFacets = trMatrix.filter((f: any) => f.status === 'LEXICAL_SUPPORT_ONLY');
    expect(lexicalFacets.length).toBe(24);

    for (const lf of lexicalFacets) {
      expect(lf.studyEvidence.sampleN.value).toBeNull();
      expect(lf.studyEvidence.sampleN.claimVerificationStatus).toBe('NOT_ASSESSED');
      expect(lf.supportingEvidence).toBeDefined();
      expect(lf.supportingEvidence.length).toBeGreaterThanOrEqual(1);
      expect(lf.supportingEvidence[0].studySampleN).toBe(521);
      expect(lf.supportingEvidence[0].appliesToLevel).toBe('BROAD_FACTOR');
      expect(lf.supportingEvidence[0].doesNotEstablish).toContain('facet reliability');
    }
  });

  it('37. SEMANTICS: lexical facet factor structure must not be SUPPORTED at facet level', () => {
    const lexicalFacets = trMatrix.filter((f: any) => f.status === 'LEXICAL_SUPPORT_ONLY');
    for (const lf of lexicalFacets) {
      expect(lf.factorStructureEvidence.status).toBe('NOT_ASSESSED');
      expect(lf.factorStructureEvidence.level).toBe('FACET');
    }
  });

  it('38. SEMANTICS: Wasti cannot validate IPIP-HEXACO Turkish instrument', () => {
    const lexicalFacets = trMatrix.filter((f: any) => f.status === 'LEXICAL_SUPPORT_ONLY');
    for (const lf of lexicalFacets) {
      expect(lf.targetConstructInstrumentId).toBe('inst_ipip_hexaco');
      expect(lf.supportingEvidenceInstrumentId).toBeNull();
      expect(lf.instrumentValidationEstablished).toBe(false);
      expect(lf.instrumentId).toBeNull();
    }
  });

  it('39. SEMANTICS: report verified exact count changes dynamically after lexical sample cleanup', () => {
    let exactCount = 0;
    trMatrix.forEach((f: any) => {
      const claims = [
        f.reliabilityEvidence.internalConsistency,
        f.reliabilityEvidence.testRetest,
        f.studyEvidence.sampleN
      ];
      claims.forEach((c: any) => {
        if (c.claimVerificationStatus === 'VERIFIED_EXACT') exactCount++;
      });
    });

    expect(exactCount).toBe(32);
    expect(exactCount).not.toBe(56);
  });

  it('40. SEMANTICS: sampleN is not stored under reliability evidence', () => {
    for (const f of trMatrix) {
      expect(f.studyEvidence).toBeDefined();
      expect(f.studyEvidence.sampleN).toBeDefined();
      expect(f.reliabilityEvidence.internalConsistency).toBeDefined();
      expect(f.reliabilityEvidence.testRetest).toBeDefined();
      expect(f.reliabilityEvidence.sampleN).toBeUndefined();
      expect('sampleN' in f.reliabilityEvidence).toBe(false);
    }
  });

  it('41. SEMANTICS: report downgrade list is source-derived', () => {
    const downgradedFacets = trMatrix.filter((f: any) => f.auditHistory && f.auditHistory.length > 0);
    expect(downgradedFacets.length).toBe(8);

    const downgradedIds = new Set(downgradedFacets.map((f: any) => f.facetId));
    expect(downgradedIds.has('cognitive_reappraisal')).toBe(true);
    expect(downgradedIds.has('expressive_suppression')).toBe(true);
    expect(downgradedIds.has('distress_tolerance')).toBe(true);
    expect(downgradedIds.has('need_for_cognition')).toBe(true);
    expect(downgradedIds.has('empathic_concern')).toBe(true);
    expect(downgradedIds.has('impression_management')).toBe(true);
    expect(downgradedIds.has('conflict_collaborating')).toBe(true);
    expect(downgradedIds.has('conflict_avoiding')).toBe(true);
  });

  it('42. SEMANTICS: report new-source list is source-derived', () => {
    const newSources = sources.filter((s: any) => s.addedInPhase === 'FAZ 2.2');
    expect(newSources.length).toBe(7);

    const newSourceIds = new Set(newSources.map((s: any) => s.sourceId));
    expect(newSourceIds.has('src_sumer_2006_ecrr')).toBe(true);
    expect(newSourceIds.has('src_sari_dag_2009_ius')).toBe(true);
    expect(newSourceIds.has('src_gulum_dag_2012_cfi')).toBe(true);
    expect(newSourceIds.has('src_erdur_baker_bugay_2010_rrs')).toBe(true);
    expect(newSourceIds.has('src_duyan_2012_bscs')).toBe(true);
    expect(newSourceIds.has('src_saricam_2016_grit')).toBe(true);
    expect(newSourceIds.has('src_akin_tas_2015_mlq')).toBe(true);
  });

  it('43. SEMANTICS: VERIFIED_EXACT does not imply humanVerified', () => {
    let exactClaimsCount = 0;
    let humanVerifiedCount = 0;

    trMatrix.forEach((f: any) => {
      const claims = [
        f.reliabilityEvidence.internalConsistency,
        f.reliabilityEvidence.testRetest,
        f.studyEvidence.sampleN
      ];
      claims.forEach((c: any) => {
        if (c.claimVerificationStatus === 'VERIFIED_EXACT') {
          exactClaimsCount++;
          if (c.humanVerified === true) humanVerifiedCount++;
          expect(c.verificationMethod).toBe('AI_ASSISTED_SOURCE_AUDIT');
          expect(c.humanVerified).toBe(false);
        }
      });
    });

    expect(exactClaimsCount).toBe(32);
    expect(humanVerifiedCount).toBe(0);
  });
});


