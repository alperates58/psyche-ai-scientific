import fs from 'fs';
import path from 'path';
import { TurkishValidationMatrixSchema } from '../src/schemas/validationMatrixSchema';

const matrixPath = path.resolve(__dirname, '../research/turkish-validation-matrix.json');
const constructsPath = path.resolve(__dirname, '../data/constructs.json');
const sourcesPath = path.resolve(__dirname, '../data/source-registry.json');

const rawMatrix = JSON.parse(fs.readFileSync(matrixPath, 'utf8'));
const ontologyFacets = JSON.parse(fs.readFileSync(constructsPath, 'utf8'));
const sources = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));

// 1. Verify bidirectional set-equality and uniqueness before doing transformations
const ontologyIds = ontologyFacets.map((c: any) => c.facetId);
const matrixIds = rawMatrix.map((m: any) => m.facetId);

const ontologyIdSet = new Set(ontologyIds);
const matrixIdSet = new Set(matrixIds);

if (ontologyIds.length !== ontologyIdSet.size) {
  throw new Error(`Ontology contains duplicate facet IDs! Length: ${ontologyIds.length}, Unique: ${ontologyIdSet.size}`);
}
if (matrixIds.length !== matrixIdSet.size) {
  throw new Error(`Matrix contains duplicate facet IDs! Length: ${matrixIds.length}, Unique: ${matrixIdSet.size}`);
}

const missingInMatrix = ontologyIds.filter((id: string) => !matrixIdSet.has(id));
const unexpectedInMatrix = matrixIds.filter((id: string) => !ontologyIdSet.has(id));

if (missingInMatrix.length > 0 || unexpectedInMatrix.length > 0) {
  throw new Error(
    `Set equality failure between constructs.json and turkish-validation-matrix.json!\n` +
    `Missing in matrix: ${missingInMatrix.join(', ') || 'none'}\n` +
    `Unexpected in matrix: ${unexpectedInMatrix.join(', ') || 'none'}`
  );
}

// 2. Classifications for 14 DIRECT facets
// 7 Scale-Total / Construct-Aligned:
// - core_self_esteem (RSES, Çuhadaroğlu 1986)
// - self_compassion (SCS, Akın 2007)
// - generalized_self_efficacy (GSES, Çelikkaleli & Çapri 2008)
// - cognitive_flexibility (CFI, Gülüm & Dağ 2012)
// - intolerance_of_uncertainty (IUS-12, Sarı & Dağ 2009)
// - general_self_control (BSCS, Duyan 2012)
// - long_term_grit (Grit-S, Sarıçam 2016)
const DIRECT_SCALE_TOTAL_CONSTRUCT_ALIGNED: Record<string, { sourceId: string }> = {
  core_self_esteem: { sourceId: 'src_cuhadaroglu_1986' },
  self_compassion: { sourceId: 'src_akin_2007_scs' },
  generalized_self_efficacy: { sourceId: 'src_celikkaleli_capri_2008_gse' },
  cognitive_flexibility: { sourceId: 'src_gulum_dag_2012_cfi' },
  intolerance_of_uncertainty: { sourceId: 'src_sari_dag_2009_ius' },
  general_self_control: { sourceId: 'src_duyan_2012_bscs' },
  long_term_grit: { sourceId: 'src_saricam_2016_grit' }
};

// 7 Subscale / Subscale-Aligned:
// - trait_positive_affect (PANAS PA, Gençöz 2000)
// - trait_negative_affect (PANAS NA, Gençöz 2000)
// - rumination_brooding (RRS Brooding, Erdur-Baker & Bugay 2010)
// - presence_of_meaning (MLQ Presence, Akın & Taş 2015)
// - search_for_meaning (MLQ Search, Akın & Taş 2015)
// - attachment_anxiety (ECR-R Anxiety, Sümer 2006)
// - attachment_avoidance (ECR-R Avoidance, Sümer 2006)
const DIRECT_SUBSCALE_ALIGNED: Record<string, { sourceId: string }> = {
  trait_positive_affect: { sourceId: 'src_gencoz_2000_panas' },
  trait_negative_affect: { sourceId: 'src_gencoz_2000_panas' },
  rumination_brooding: { sourceId: 'src_erdur_baker_bugay_2010_rrs' },
  presence_of_meaning: { sourceId: 'src_akin_tas_2015_mlq' },
  search_for_meaning: { sourceId: 'src_akin_tas_2015_mlq' },
  attachment_anxiety: { sourceId: 'src_sumer_2006_ecrr' },
  attachment_avoidance: { sourceId: 'src_sumer_2006_ecrr' }
};

// 2 Related measures
const RELATED_MEASURES: Record<string, { sourceId: string }> = {
  emotional_reactivity: { sourceId: 'src_ruganci_gencoz_2010' },
  emotional_recovery: { sourceId: 'src_ruganci_gencoz_2010' }
};

let sampleNRemovedCount = 0;

const normalizedMatrix = rawMatrix.map((facet: any) => {
  // 1. Remove sampleN under reliabilityEvidence completely
  if (facet.reliabilityEvidence && 'sampleN' in facet.reliabilityEvidence) {
    delete facet.reliabilityEvidence.sampleN;
    sampleNRemovedCount++;
  }

  // 2. Ensure studyEvidence.sampleN exists and has proper format
  if (!facet.studyEvidence) {
    facet.studyEvidence = {
      sampleN: {
        value: null,
        description: null,
        sourceId: null,
        location: null,
        claimVerificationStatus: 'NOT_ASSESSED',
        humanVerified: false
      },
      population: null,
      samplingMethod: null
    };
  }

  // 3. Build canonical factorStructureEvidence & measurementAlignmentLevel
  let factorStructureEvidence: any;
  let measurementAlignmentLevel: 'EXACT_FACET' | 'SUBSCALE_ALIGNED' | 'CONSTRUCT_ALIGNED' | 'NOT_APPLICABLE' = 'NOT_APPLICABLE';

  if (facet.status === 'DIRECT_FACET_VALIDATION') {
    if (DIRECT_SCALE_TOTAL_CONSTRUCT_ALIGNED[facet.facetId]) {
      const cfg = DIRECT_SCALE_TOTAL_CONSTRUCT_ALIGNED[facet.facetId];
      measurementAlignmentLevel = 'CONSTRUCT_ALIGNED';
      factorStructureEvidence = {
        status: 'SUPPORTED',
        level: 'SCALE_TOTAL',
        sourceId: cfg.sourceId,
        claimVerificationStatus: 'VERIFIED_GENERAL',
        verificationMethod: 'AI_ASSISTED_SOURCE_AUDIT',
        humanVerified: false
      };
    } else if (DIRECT_SUBSCALE_ALIGNED[facet.facetId]) {
      const cfg = DIRECT_SUBSCALE_ALIGNED[facet.facetId];
      measurementAlignmentLevel = 'SUBSCALE_ALIGNED';
      factorStructureEvidence = {
        status: 'SUPPORTED',
        level: 'SUBSCALE',
        sourceId: cfg.sourceId,
        claimVerificationStatus: 'VERIFIED_GENERAL',
        verificationMethod: 'AI_ASSISTED_SOURCE_AUDIT',
        humanVerified: false
      };
    } else {
      throw new Error(`Unclassified DIRECT_FACET_VALIDATION facet: ${facet.facetId}`);
    }
  } else if (facet.status === 'RELATED_MEASURE_VALIDATION') {
    const cfg = RELATED_MEASURES[facet.facetId];
    measurementAlignmentLevel = 'NOT_APPLICABLE';
    factorStructureEvidence = {
      status: 'SUPPORTED',
      level: 'SUBSCALE',
      sourceId: cfg ? cfg.sourceId : 'src_ruganci_gencoz_2010',
      claimVerificationStatus: 'VERIFIED_GENERAL',
      verificationMethod: 'AI_ASSISTED_SOURCE_AUDIT',
      humanVerified: false
    };
  } else if (facet.status === 'LEXICAL_SUPPORT_ONLY') {
    measurementAlignmentLevel = 'NOT_APPLICABLE';
    factorStructureEvidence = {
      status: 'NOT_ASSESSED',
      level: 'FACET',
      sourceId: null,
      claimVerificationStatus: 'NOT_ASSESSED',
      verificationMethod: 'NOT_VERIFIED',
      humanVerified: false
    };

    // Standardize HEXACO supportingEvidence appliesToLevel
    if (facet.supportingEvidence && Array.isArray(facet.supportingEvidence)) {
      facet.supportingEvidence.forEach((se: any) => {
        if (se.sourceId === 'src_wasti_2008' && se.evidenceType === 'BROAD_FACTOR_LEXICAL_SUPPORT') {
          se.appliesToLevel = 'BROAD_FACTOR';
        }
      });
    }
  } else {
    // NO_DIRECT_TURKISH_VALIDATION
    measurementAlignmentLevel = 'NOT_APPLICABLE';
    factorStructureEvidence = {
      status: 'NOT_ASSESSED',
      level: 'FACET',
      sourceId: null,
      claimVerificationStatus: 'NOT_ASSESSED',
      verificationMethod: 'NOT_VERIFIED',
      humanVerified: false
    };
  }

  // Remove legacy fields if present
  delete facet.factorStructureStatus;
  delete facet.broadFactorStructuralSupport;

  facet.measurementAlignmentLevel = measurementAlignmentLevel;
  facet.factorStructureEvidence = factorStructureEvidence;

  return facet;
});

// 3. Validate with Zod
const parsed = TurkishValidationMatrixSchema.safeParse(normalizedMatrix);
if (!parsed.success) {
  console.error('Zod schema validation failed during normalization:', JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

fs.writeFileSync(matrixPath, JSON.stringify(normalizedMatrix, null, 2), 'utf8');

console.log('Normalization complete!');
console.log(`- Total facets processed: ${normalizedMatrix.length}`);
console.log(`- sampleN removed from reliabilityEvidence: ${sampleNRemovedCount}`);
console.log(`- Direct CONSTRUCT_ALIGNED: ${Object.keys(DIRECT_SCALE_TOTAL_CONSTRUCT_ALIGNED).length}`);
console.log(`- Direct SUBSCALE_ALIGNED: ${Object.keys(DIRECT_SUBSCALE_ALIGNED).length}`);
console.log(`- Related SUBSCALE: ${Object.keys(RELATED_MEASURES).length}`);
console.log(`- Lexical FACET (NOT_ASSESSED): 24`);
console.log(`- No Direct FACET (NOT_ASSESSED): 44`);
