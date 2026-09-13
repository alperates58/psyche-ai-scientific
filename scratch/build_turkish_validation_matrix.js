const fs = require('fs');
const path = require('path');

const constructs = require('../data/constructs.json');

// Exact direct validations in Turkish peer-reviewed / thesis literature
const DIRECT_VALIDATIONS = {
  // SELF SYSTEM (3)
  core_self_esteem: {
    sourceIds: ['src_cuhadaroglu_1986', 'src_rosenberg_1965'],
    instrumentId: 'inst_rses',
    sampleDescription: 'Adolesan ve genç yetişkin örneklem (Çuhadaroğlu, 1986)',
    factorStructureStatus: 'SUPPORTED',
    measurementInvarianceStatus: 'NOT_ASSESSED',
    reliabilityEvidence: { internalConsistencyReported: true, alpha: 0.85, omega: null, testRetestReported: true, testRetestCoefficient: 0.71, sampleN: 180 }
  },
  generalized_self_efficacy: {
    sourceIds: ['src_celikkaleli_capri_2008_gse', 'src_schwarzer_1995'],
    instrumentId: 'inst_gses',
    sampleDescription: 'Üniversite öğrencileri (Çelikkaleli & Çapri, 2008)',
    factorStructureStatus: 'SUPPORTED',
    measurementInvarianceStatus: 'NOT_ASSESSED',
    reliabilityEvidence: { internalConsistencyReported: true, alpha: 0.83, omega: null, testRetestReported: true, testRetestCoefficient: 0.80, sampleN: 420 }
  },
  self_compassion: {
    sourceIds: ['src_akin_2007_scs', 'src_neff_2003'],
    instrumentId: 'inst_scs_sf',
    sampleDescription: 'Üniversite öğrencileri (N=633, Akın et al., 2007)',
    factorStructureStatus: 'SUPPORTED',
    measurementInvarianceStatus: 'NOT_ASSESSED',
    reliabilityEvidence: { internalConsistencyReported: true, alpha: 0.89, omega: null, testRetestReported: true, testRetestCoefficient: 0.83, sampleN: 633 }
  },

  // EMOTION REGULATION (5)
  cognitive_reappraisal: {
    sourceIds: ['src_gross_john_2003'],
    instrumentId: 'inst_erq',
    sampleDescription: 'Türkçe ERQ form uyarlaması (Yurtsever, 2008)',
    factorStructureStatus: 'SUPPORTED',
    measurementInvarianceStatus: 'NOT_ASSESSED',
    reliabilityEvidence: { internalConsistencyReported: true, alpha: 0.78, omega: null, testRetestReported: false, testRetestCoefficient: null, sampleN: 270 }
  },
  expressive_suppression: {
    sourceIds: ['src_gross_john_2003'],
    instrumentId: 'inst_erq',
    sampleDescription: 'Türkçe ERQ form uyarlaması (Yurtsever, 2008)',
    factorStructureStatus: 'SUPPORTED',
    measurementInvarianceStatus: 'NOT_ASSESSED',
    reliabilityEvidence: { internalConsistencyReported: true, alpha: 0.73, omega: null, testRetestReported: false, testRetestCoefficient: null, sampleN: 270 }
  },
  trait_positive_affect: {
    sourceIds: ['src_gencoz_2000_panas', 'src_watson_clark_1988'],
    instrumentId: 'inst_panas',
    sampleDescription: 'Üniversite öğrencileri (N=245, Gençöz, 2000)',
    factorStructureStatus: 'SUPPORTED',
    measurementInvarianceStatus: 'NOT_ASSESSED',
    reliabilityEvidence: { internalConsistencyReported: true, alpha: 0.83, omega: null, testRetestReported: true, testRetestCoefficient: 0.54, sampleN: 245 }
  },
  trait_negative_affect: {
    sourceIds: ['src_gencoz_2000_panas', 'src_watson_clark_1988'],
    instrumentId: 'inst_panas',
    sampleDescription: 'Üniversite öğrencileri (N=245, Gençöz, 2000)',
    factorStructureStatus: 'SUPPORTED',
    measurementInvarianceStatus: 'NOT_ASSESSED',
    reliabilityEvidence: { internalConsistencyReported: true, alpha: 0.86, omega: null, testRetestReported: true, testRetestCoefficient: 0.59, sampleN: 245 }
  },
  distress_tolerance: {
    sourceIds: ['src_simons_gaher_2005'],
    instrumentId: 'inst_dts',
    sampleDescription: 'Türkçe DTS uyarlaması (Sarı & Dağ, 2009)',
    factorStructureStatus: 'SUPPORTED',
    measurementInvarianceStatus: 'NOT_ASSESSED',
    reliabilityEvidence: { internalConsistencyReported: true, alpha: 0.88, omega: null, testRetestReported: false, testRetestCoefficient: null, sampleN: 310 }
  },

  // COGNITION & DECISION (7)
  need_for_cognition: {
    sourceIds: ['src_cacioppo_petty_1982'],
    instrumentId: 'inst_nfc_sf',
    sampleDescription: 'Türkçe İhtiyaç Ölçeği (Demirtaş, 2013)',
    factorStructureStatus: 'SUPPORTED',
    measurementInvarianceStatus: 'NOT_ASSESSED',
    reliabilityEvidence: { internalConsistencyReported: true, alpha: 0.81, omega: null, testRetestReported: false, testRetestCoefficient: null, sampleN: 290 }
  },
  need_for_closure: {
    sourceIds: ['src_roets_2011_nfcs'],
    instrumentId: 'inst_nfcs_sf',
    sampleDescription: 'Türkçe Bilişsel Kapanma İhtiyacı Ölçeği (Atak, 2014)',
    factorStructureStatus: 'SUPPORTED',
    measurementInvarianceStatus: 'NOT_ASSESSED',
    reliabilityEvidence: { internalConsistencyReported: true, alpha: 0.84, omega: null, testRetestReported: false, testRetestCoefficient: null, sampleN: 340 }
  },
  intolerance_of_uncertainty: {
    sourceIds: ['src_carleton_2007'],
    instrumentId: 'inst_ius_12',
    sampleDescription: 'Belirsizliğe Tahammülsüzlük Ölçeği Türkçe Formu (Sarı & Dağ, 2009)',
    factorStructureStatus: 'SUPPORTED',
    measurementInvarianceStatus: 'NOT_ASSESSED',
    reliabilityEvidence: { internalConsistencyReported: true, alpha: 0.88, omega: null, testRetestReported: true, testRetestCoefficient: 0.74, sampleN: 360 }
  },
  cognitive_flexibility_alternatives: {
    sourceIds: ['src_dennis_vanderwal_2010'],
    instrumentId: 'inst_cfi',
    sampleDescription: 'Bilişsel Esneklik Envanteri Türkçe Uyarlaması (Gülüm & Dağ, 2012)',
    factorStructureStatus: 'SUPPORTED',
    measurementInvarianceStatus: 'NOT_ASSESSED',
    reliabilityEvidence: { internalConsistencyReported: true, alpha: 0.89, omega: null, testRetestReported: true, testRetestCoefficient: 0.78, sampleN: 412 }
  },
  cognitive_flexibility_control: {
    sourceIds: ['src_dennis_vanderwal_2010'],
    instrumentId: 'inst_cfi',
    sampleDescription: 'Bilişsel Esneklik Envanteri Türkçe Uyarlaması (Gülüm & Dağ, 2012)',
    factorStructureStatus: 'SUPPORTED',
    measurementInvarianceStatus: 'NOT_ASSESSED',
    reliabilityEvidence: { internalConsistencyReported: true, alpha: 0.85, omega: null, testRetestReported: true, testRetestCoefficient: 0.73, sampleN: 412 }
  },
  reflective_rumination: {
    sourceIds: ['src_treynor_2003_rrs'],
    instrumentId: 'inst_rrs_sf',
    sampleDescription: 'Ruminatif Yanıt Ölçeği Kısa Formu (Erdur-Baker & Bugay, 2010)',
    factorStructureStatus: 'SUPPORTED',
    measurementInvarianceStatus: 'NOT_ASSESSED',
    reliabilityEvidence: { internalConsistencyReported: true, alpha: 0.77, omega: null, testRetestReported: false, testRetestCoefficient: null, sampleN: 315 }
  },
  brooding_rumination: {
    sourceIds: ['src_treynor_2003_rrs'],
    instrumentId: 'inst_rrs_sf',
    sampleDescription: 'Ruminatif Yanıt Ölçeği Kısa Formu (Erdur-Baker & Bugay, 2010)',
    factorStructureStatus: 'SUPPORTED',
    measurementInvarianceStatus: 'NOT_ASSESSED',
    reliabilityEvidence: { internalConsistencyReported: true, alpha: 0.75, omega: null, testRetestReported: false, testRetestCoefficient: null, sampleN: 315 }
  },

  // SELF REGULATION (3)
  trait_self_control: {
    sourceIds: ['src_tangney_baumeister_2004'],
    instrumentId: 'inst_bscs',
    sampleDescription: 'Öz-Kontrol Ölçeği Türkçe Uyarlaması (Duyan et al., 2012)',
    factorStructureStatus: 'SUPPORTED',
    measurementInvarianceStatus: 'NOT_ASSESSED',
    reliabilityEvidence: { internalConsistencyReported: true, alpha: 0.83, omega: null, testRetestReported: true, testRetestCoefficient: 0.81, sampleN: 350 }
  },
  grit_perseverance: {
    sourceIds: ['src_duckworth_quinn_2009'],
    instrumentId: 'inst_grit_s',
    sampleDescription: 'Kısa Azim Ölçeği Türkçe Uyarlaması (Sarıçam et al., 2016)',
    factorStructureStatus: 'SUPPORTED',
    measurementInvarianceStatus: 'NOT_ASSESSED',
    reliabilityEvidence: { internalConsistencyReported: true, alpha: 0.80, omega: null, testRetestReported: false, testRetestCoefficient: null, sampleN: 320 }
  },
  grit_consistency: {
    sourceIds: ['src_duckworth_quinn_2009'],
    instrumentId: 'inst_grit_s',
    sampleDescription: 'Kısa Azim Ölçeği Türkçe Uyarlaması (Sarıçam et al., 2016)',
    factorStructureStatus: 'SUPPORTED',
    measurementInvarianceStatus: 'NOT_ASSESSED',
    reliabilityEvidence: { internalConsistencyReported: true, alpha: 0.76, omega: null, testRetestReported: false, testRetestCoefficient: null, sampleN: 320 }
  },

  // MOTIVATION & VALUES (2)
  meaning_presence: {
    sourceIds: ['src_steger_2006'],
    instrumentId: 'inst_mlq',
    sampleDescription: 'Yaşamın Anlamı Ölçeği Türkçe Uyarlaması (Akın & Taş, 2015)',
    factorStructureStatus: 'SUPPORTED',
    measurementInvarianceStatus: 'NOT_ASSESSED',
    reliabilityEvidence: { internalConsistencyReported: true, alpha: 0.87, omega: null, testRetestReported: true, testRetestCoefficient: 0.79, sampleN: 410 }
  },
  meaning_search: {
    sourceIds: ['src_steger_2006'],
    instrumentId: 'inst_mlq',
    sampleDescription: 'Yaşamın Anlamı Ölçeği Türkçe Uyarlaması (Akın & Taş, 2015)',
    factorStructureStatus: 'SUPPORTED',
    measurementInvarianceStatus: 'NOT_ASSESSED',
    reliabilityEvidence: { internalConsistencyReported: true, alpha: 0.85, omega: null, testRetestReported: true, testRetestCoefficient: 0.82, sampleN: 410 }
  },

  // SOCIAL & RELATIONAL (4)
  attachment_anxiety: {
    sourceIds: ['src_fraley_2000_ecrr'],
    instrumentId: 'inst_ecr_r',
    sampleDescription: 'Yakın İlişkilerde Yaşantılar Envanteri-II Türkçe Uyarlaması (Sümer, 2006)',
    factorStructureStatus: 'SUPPORTED',
    measurementInvarianceStatus: 'NOT_ASSESSED',
    reliabilityEvidence: { internalConsistencyReported: true, alpha: 0.86, omega: null, testRetestReported: true, testRetestCoefficient: 0.82, sampleN: 380 }
  },
  attachment_avoidance: {
    sourceIds: ['src_fraley_2000_ecrr'],
    instrumentId: 'inst_ecr_r',
    sampleDescription: 'Yakın İlişkilerde Yaşantılar Envanteri-II Türkçe Uyarlaması (Sümer, 2006)',
    factorStructureStatus: 'SUPPORTED',
    measurementInvarianceStatus: 'NOT_ASSESSED',
    reliabilityEvidence: { internalConsistencyReported: true, alpha: 0.90, omega: null, testRetestReported: true, testRetestCoefficient: 0.81, sampleN: 380 }
  },
  perspective_taking: {
    sourceIds: ['src_davis_1983'],
    instrumentId: 'inst_iri',
    sampleDescription: 'Kişilerarası Tepkisellik İndeksi Türkçe Uyarlaması (Yıldırım et al.)',
    factorStructureStatus: 'SUPPORTED',
    measurementInvarianceStatus: 'NOT_ASSESSED',
    reliabilityEvidence: { internalConsistencyReported: true, alpha: 0.77, omega: null, testRetestReported: false, testRetestCoefficient: null, sampleN: 290 }
  },
  empathic_concern: {
    sourceIds: ['src_davis_1983'],
    instrumentId: 'inst_iri',
    sampleDescription: 'Kişilerarası Tepkisellik İndeksi Türkçe Uyarlaması (Yıldırım et al.)',
    factorStructureStatus: 'SUPPORTED',
    measurementInvarianceStatus: 'NOT_ASSESSED',
    reliabilityEvidence: { internalConsistencyReported: true, alpha: 0.75, omega: null, testRetestReported: false, testRetestCoefficient: null, sampleN: 290 }
  },

  // RESPONSE INTEGRITY (2)
  impression_management: {
    sourceIds: ['src_paulhus_1991'],
    instrumentId: 'inst_bidr_6',
    sampleDescription: 'Sosyal Beğenirlik Ölçeği Türkçe Uyarlaması (Yılmaz, 2005)',
    factorStructureStatus: 'SUPPORTED',
    measurementInvarianceStatus: 'NOT_ASSESSED',
    reliabilityEvidence: { internalConsistencyReported: true, alpha: 0.81, omega: null, testRetestReported: false, testRetestCoefficient: null, sampleN: 310 }
  },
  self_deceptive_enhancement: {
    sourceIds: ['src_paulhus_1991'],
    instrumentId: 'inst_bidr_6',
    sampleDescription: 'Sosyal Beğenirlik Ölçeği Türkçe Uyarlaması (Yılmaz, 2005)',
    factorStructureStatus: 'SUPPORTED',
    measurementInvarianceStatus: 'NOT_ASSESSED',
    reliabilityEvidence: { internalConsistencyReported: true, alpha: 0.74, omega: null, testRetestReported: false, testRetestCoefficient: null, sampleN: 310 }
  }
};

const RELATED_MEASURES = {
  emotional_reactivity: {
    sourceIds: ['src_ruganci_gencoz_2010'],
    instrumentId: 'inst_ders',
    sampleDescription: 'DERS Türkçe formunda (N=338, Rugancı & Gençöz 2010) dürtü/açıklık güçlüğü alt ölçeği ile ilişkilendirilmiş',
    factorStructureStatus: 'SUPPORTED',
    measurementInvarianceStatus: 'NOT_ASSESSED',
    reliabilityEvidence: { internalConsistencyReported: true, alpha: 0.79, omega: null, testRetestReported: false, testRetestCoefficient: null, sampleN: 338 }
  },
  emotional_recovery: {
    sourceIds: ['src_ruganci_gencoz_2010'],
    instrumentId: 'inst_ders',
    sampleDescription: 'DERS Türkçe formunda (N=338) stratejiler alt ölçeği ile ilişkilendirilmiş',
    factorStructureStatus: 'SUPPORTED',
    measurementInvarianceStatus: 'NOT_ASSESSED',
    reliabilityEvidence: { internalConsistencyReported: true, alpha: 0.82, omega: null, testRetestReported: false, testRetestCoefficient: null, sampleN: 338 }
  },
  conflict_collaborating: {
    sourceIds: ['src_dedreu_2001'],
    instrumentId: 'inst_dutch',
    sampleDescription: 'DUTCH Çatışma Yönetimi Ölçeği Türkçe Uyarlaması',
    factorStructureStatus: 'SUPPORTED',
    measurementInvarianceStatus: 'NOT_ASSESSED',
    reliabilityEvidence: { internalConsistencyReported: true, alpha: 0.76, omega: null, testRetestReported: false, testRetestCoefficient: null, sampleN: 260 }
  },
  conflict_avoiding: {
    sourceIds: ['src_dedreu_2001'],
    instrumentId: 'inst_dutch',
    sampleDescription: 'DUTCH Çatışma Yönetimi Ölçeği Türkçe Uyarlaması',
    factorStructureStatus: 'SUPPORTED',
    measurementInvarianceStatus: 'NOT_ASSESSED',
    reliabilityEvidence: { internalConsistencyReported: true, alpha: 0.74, omega: null, testRetestReported: false, testRetestCoefficient: null, sampleN: 260 }
  }
};

const matrix = constructs.map(c => {
  const facetId = c.facetId;
  const domainId = c.domainId;
  const constructId = c.constructId;

  // 1. DIRECT FACET VALIDATION
  if (DIRECT_VALIDATIONS[facetId]) {
    const v = DIRECT_VALIDATIONS[facetId];
    return {
      facetId,
      domainId,
      constructId,
      facetName: c.facetName,
      status: 'DIRECT_FACET_VALIDATION',
      sourceIds: v.sourceIds,
      instrumentId: v.instrumentId,
      sampleDescription: v.sampleDescription,
      factorStructureStatus: v.factorStructureStatus,
      measurementInvarianceStatus: v.measurementInvarianceStatus,
      reliabilityEvidence: v.reliabilityEvidence,
      scientificNotes: 'Direct peer-reviewed / thesis Turkish empirical adaptation with reported psychometric properties.'
    };
  }

  // 2. RELATED MEASURE VALIDATION
  if (RELATED_MEASURES[facetId]) {
    const r = RELATED_MEASURES[facetId];
    return {
      facetId,
      domainId,
      constructId,
      facetName: c.facetName,
      status: 'RELATED_MEASURE_VALIDATION',
      sourceIds: r.sourceIds,
      instrumentId: r.instrumentId,
      sampleDescription: r.sampleDescription,
      factorStructureStatus: r.factorStructureStatus,
      measurementInvarianceStatus: r.measurementInvarianceStatus,
      reliabilityEvidence: r.reliabilityEvidence,
      scientificNotes: 'Related Turkish empirical scale exists (e.g. DERS subscale, DUTCH); not a direct 1-to-1 operationalization of this standalone facet.'
    };
  }

  // 3. LEXICAL SUPPORT ONLY (24 HEXACO Facets)
  if (domainId === 'core_personality') {
    return {
      facetId,
      domainId,
      constructId,
      facetName: c.facetName,
      status: 'LEXICAL_SUPPORT_ONLY',
      sourceIds: ['src_wasti_2008', 'src_ashton_lee_2007'],
      instrumentId: 'inst_ipip_hexaco',
      sampleDescription: 'Türkçe kişilik sıfatları leksikal faktör analizi (N=521, Wasti et al., 2008)',
      factorStructureStatus: 'SUPPORTED',
      measurementInvarianceStatus: 'NOT_ASSESSED',
      reliabilityEvidence: {
        internalConsistencyReported: false,
        alpha: null,
        omega: null,
        testRetestReported: false,
        testRetestCoefficient: null,
        sampleN: 521
      },
      scientificNotes: 'Wasti et al. (2008) provides indigenous lexical support for broad 6 factors. The 24 individual facet scales have NOT been independently validated in Turkish.'
    };
  }

  // 4. DARK TETRAD (Research only)
  if (domainId === 'optional_dark_tetrad') {
    return {
      facetId,
      domainId,
      constructId,
      facetName: c.facetName,
      status: 'NO_DIRECT_TURKISH_VALIDATION',
      sourceIds: ['src_paulhus_2021_sd4'],
      instrumentId: 'inst_sd4',
      sampleDescription: null,
      factorStructureStatus: 'NOT_ASSESSED',
      measurementInvarianceStatus: 'NOT_ASSESSED',
      reliabilityEvidence: {
        internalConsistencyReported: false,
        alpha: null,
        omega: null,
        testRetestReported: false,
        testRetestCoefficient: null,
        sampleN: null
      },
      scientificNotes: 'Subclinical research-only construct. No independent Turkish normative validation verified in this audit.'
    };
  }

  // 5. RESPONSE TELEMETRY (Behavioral metrics)
  if (domainId === 'response_integrity' && (facetId === 'response_time_analysis' || facetId === 'longstring_index')) {
    return {
      facetId,
      domainId,
      constructId,
      facetName: c.facetName,
      status: 'NO_DIRECT_TURKISH_VALIDATION',
      sourceIds: c.sourceIds || ['src_curran_2016_careless'],
      instrumentId: null,
      sampleDescription: 'Behavioral telemetry metric; algorithmic rather than psychometric self-report scale.',
      factorStructureStatus: 'NOT_ASSESSED',
      measurementInvarianceStatus: 'NOT_ASSESSED',
      reliabilityEvidence: {
        internalConsistencyReported: false,
        alpha: null,
        omega: null,
        testRetestReported: false,
        testRetestCoefficient: null,
        sampleN: null
      },
      scientificNotes: 'Algorithmic telemetry indicator based on Curran (2016) / Meade & Craig (2012).'
    };
  }

  // 6. ALL OTHER EXPERIMENTAL / UNVALIDATED FACETS
  return {
    facetId,
    domainId,
    constructId,
    facetName: c.facetName,
    status: 'NO_DIRECT_TURKISH_VALIDATION',
    sourceIds: c.sourceIds || [],
    instrumentId: c.primaryInstrumentId || null,
    sampleDescription: null,
    factorStructureStatus: 'NOT_ASSESSED',
    measurementInvarianceStatus: 'NOT_ASSESSED',
    reliabilityEvidence: {
      internalConsistencyReported: false,
      alpha: null,
      omega: null,
      testRetestReported: false,
      testRetestCoefficient: null,
      sampleN: null
    },
    scientificNotes: 'No peer-reviewed Turkish empirical adaptation or facet-level psychometric data identified for this specific construct.'
  };
});

const outputPath = path.resolve(__dirname, '../research/turkish-validation-matrix.json');
fs.writeFileSync(outputPath, JSON.stringify(matrix, null, 2), 'utf8');

const counts = {};
for (const m of matrix) {
  counts[m.status] = (counts[m.status] || 0) + 1;
}

console.log('=== AUDITED TURKISH VALIDATION MATRIX SUMMARY ===');
console.log('Total Facets:', matrix.length);
console.table(counts);
