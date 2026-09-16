/**
 * PsycheAI Authoritative Facet Evidence Resolver
 * 
 * Derives facet-level scientific evidence strictly from normalized validation records:
 * - FacetValidationSummary
 * - FacetValidationStudyEvidence
 * - FacetReliabilityEvidence
 * 
 * Enforces:
 * 1. Zero citation string heuristics (no author substring guessing, no citation presence = DIRECT).
 * 2. Conservative ordinal evidence levels: DIRECT, LEXICAL, RELATED, NO_DIRECT, UNKNOWN.
 * 3. Scope & Alignment Guardrails:
 *    - BROAD_FACTOR lexical evidence does NOT establish FACET-level direct validation.
 *    - SCALE_TOTAL evidence does not establish subscale/facet direct validation.
 *    - EXACT_FACET / SUBSCALE_ALIGNED required for facet-level DIRECT evidence.
 * 4. Exact Instrument Matching:
 *    - Validation evidence from an unlinked/mismatched instrument does NOT validate current form.
 * 5. Honest Human Verification:
 *    - humanVerified: false is never upgraded or assumed true.
 */

export type AuthoritativeEvidenceLevel =
  | 'DIRECT'
  | 'LEXICAL'
  | 'RELATED'
  | 'NO_DIRECT'
  | 'UNKNOWN';

export type MeasurementAlignmentLevel =
  | 'EXACT_FACET'
  | 'SUBSCALE_ALIGNED'
  | 'CONSTRUCT_ALIGNED'
  | 'NOT_APPLICABLE'
  | string;

export type AppliesToLevel =
  | 'FACET'
  | 'SUBSCALE'
  | 'CONSTRUCT'
  | 'SCALE_TOTAL'
  | 'BROAD_FACTOR'
  | string;

export interface FacetValidationStudyEvidenceLike {
  id?: string;
  sourceId?: string | null;
  instrumentId?: string | null;
  evidenceType?: string;
  evidenceLevel?: string;
  appliesToLevel?: string;
  measurementAlignmentLevel?: string;
  claimVerificationStatus?: string;
  humanVerified?: boolean;
}

export interface FacetReliabilityEvidenceLike {
  id?: string;
  sourceId?: string | null;
  instrumentId?: string | null;
  evidenceLevel?: string;
  humanVerified?: boolean;
}

export interface FacetValidationSummaryLike {
  id?: string;
  facetId?: string;
  overallTurkishEvidenceLevel?: string;
  overallStatus?: string;
  measurementAlignmentLevel?: string;
  measurementInvarianceStatus?: string;
  instrumentValidationEstablished?: boolean;
  targetConstructInstrumentId?: string | null;
  supportingEvidenceInstrumentId?: string | null;
  humanVerified?: boolean;
  studyEvidences?: FacetValidationStudyEvidenceLike[];
  reliabilityEvidences?: FacetReliabilityEvidenceLike[];
}

export interface ResolveFacetEvidenceParams {
  validationSummary?: FacetValidationSummaryLike | null;
  sessionInstrumentId?: string | null;
  sessionInstrumentName?: string | null;
}

export interface ResolvedFacetEvidence {
  evidenceLevel: AuthoritativeEvidenceLevel;
  overallTurkishEvidenceLevel: AuthoritativeEvidenceLevel;
  measurementAlignmentLevel: string;
  appliesToLevel: string;
  instrumentValidationEstablished: boolean;
  instrumentMatch: boolean;
  humanVerified: boolean;
  hasTurkishEvidence: boolean;
  hasDirectFacetEvidence: boolean;
  rationaleTr: string;
}

/**
 * Resolves authoritative scientific evidence for a measured facet.
 * Strictly operates on normalized database validation records, never on raw citation strings.
 */
export function resolveFacetValidationEvidence(
  params: ResolveFacetEvidenceParams
): ResolvedFacetEvidence {
  const { validationSummary, sessionInstrumentId, sessionInstrumentName } = params;

  // 1. Missing Validation Summary -> UNKNOWN / NO_DIRECT
  if (!validationSummary) {
    return {
      evidenceLevel: 'UNKNOWN',
      overallTurkishEvidenceLevel: 'NO_DIRECT',
      measurementAlignmentLevel: 'NOT_APPLICABLE',
      appliesToLevel: 'FACET',
      instrumentValidationEstablished: false,
      instrumentMatch: false,
      humanVerified: false,
      hasTurkishEvidence: false,
      hasDirectFacetEvidence: false,
      rationaleTr: 'Bu boyut için doğrulanmış psikometrik geçerlik özeti kaydı bulunmamaktadır.',
    };
  }

  // 2. Instrument Matching
  const targetId = validationSummary.targetConstructInstrumentId || null;
  const suppId = validationSummary.supportingEvidenceInstrumentId || null;
  const studyInstIds = (validationSummary.studyEvidences || [])
    .map((s) => s.instrumentId)
    .filter((id): id is string => Boolean(id));
  const reliabilityInstIds = (validationSummary.reliabilityEvidences || [])
    .map((r) => r.instrumentId)
    .filter((id): id is string => Boolean(id));

  const knownInstrumentIds = new Set<string>();
  if (targetId) knownInstrumentIds.add(targetId);
  if (suppId) knownInstrumentIds.add(suppId);
  for (const id of studyInstIds) knownInstrumentIds.add(id);
  for (const id of reliabilityInstIds) knownInstrumentIds.add(id);

  const instrumentMatch = Boolean(
    sessionInstrumentId && knownInstrumentIds.has(sessionInstrumentId)
  );

  // If session instrument is known but does not match any linked instrument in validation records
  if (sessionInstrumentId && !instrumentMatch && knownInstrumentIds.size > 0) {
    return {
      evidenceLevel: 'NO_DIRECT',
      overallTurkishEvidenceLevel: 'NO_DIRECT',
      measurementAlignmentLevel: validationSummary.measurementAlignmentLevel || 'NOT_APPLICABLE',
      appliesToLevel: 'FACET',
      instrumentValidationEstablished: false,
      instrumentMatch: false,
      humanVerified: Boolean(validationSummary.humanVerified),
      hasTurkishEvidence: false,
      hasDirectFacetEvidence: false,
      rationaleTr: `Uygulanan envanter (${sessionInstrumentName || sessionInstrumentId}), bu boyutun geçerlik veritabanındaki envanter kayıtlarıyla eşleşmemektedir.`,
    };
  }

  // 3. Human Verification (Honest representation - never invent true)
  const humanVerified = Boolean(validationSummary.humanVerified);

  // 4. Alignment & AppliesTo Analysis
  const matchingStudyEv = (validationSummary.studyEvidences || []).find(
    (s) =>
      s.instrumentId === sessionInstrumentId ||
      (sessionInstrumentId && (sessionInstrumentId === targetId || sessionInstrumentId === suppId))
  ) || validationSummary.studyEvidences?.[0];

  const appliesToLevel = (
    matchingStudyEv?.appliesToLevel ||
    'FACET'
  ).toUpperCase();

  const measurementAlignmentLevel = (
    matchingStudyEv?.measurementAlignmentLevel ||
    validationSummary.measurementAlignmentLevel ||
    'NOT_APPLICABLE'
  ).toUpperCase();

  const rawTurkishLevel = (
    validationSummary.overallTurkishEvidenceLevel ||
    matchingStudyEv?.evidenceLevel ||
    'NO_DIRECT'
  ).toUpperCase();

  const overallTurkishEvidenceLevel: AuthoritativeEvidenceLevel =
    rawTurkishLevel === 'DIRECT'
      ? 'DIRECT'
      : rawTurkishLevel === 'LEXICAL'
      ? 'LEXICAL'
      : rawTurkishLevel === 'RELATED'
      ? 'RELATED'
      : 'NO_DIRECT';

  const isBroadFactor =
    appliesToLevel === 'BROAD_FACTOR' ||
    matchingStudyEv?.evidenceType === 'BROAD_FACTOR_LEXICAL_SUPPORT' ||
    validationSummary.overallStatus === 'LEXICAL_SUPPORT_ONLY';

  const isScaleTotalOnly = appliesToLevel === 'SCALE_TOTAL';

  const isFacetAligned =
    (appliesToLevel === 'FACET' || appliesToLevel === 'SUBSCALE') &&
    (measurementAlignmentLevel === 'EXACT_FACET' || measurementAlignmentLevel === 'SUBSCALE_ALIGNED');

  const instrumentValidationEstablished = Boolean(
    validationSummary.instrumentValidationEstablished
  );

  // 5. Evaluate Direct Facet Evidence
  const hasDirectFacetEvidence =
    instrumentMatch &&
    overallTurkishEvidenceLevel === 'DIRECT' &&
    isFacetAligned &&
    !isBroadFactor &&
    !isScaleTotalOnly &&
    instrumentValidationEstablished;

  let evidenceLevel: AuthoritativeEvidenceLevel = 'NO_DIRECT';
  let hasTurkishEvidence = false;
  let rationaleTr = '';

  if (hasDirectFacetEvidence) {
    evidenceLevel = 'DIRECT';
    hasTurkishEvidence = true;
    rationaleTr = `Doğrulanan envanter (${sessionInstrumentName || targetId}) için alt boyut düzeyinde doğrudan Türkçe ampirik uyarlama kaydı mevcuttur.`;
  } else if (isBroadFactor || overallTurkishEvidenceLevel === 'LEXICAL') {
    evidenceLevel = 'LEXICAL';
    hasTurkishEvidence = false;
    rationaleTr = 'Bu boyut için doğrudan alt ölçek uyarlaması yerine geniş faktör leksikal desteği mevcuttur.';
  } else if (overallTurkishEvidenceLevel === 'RELATED') {
    evidenceLevel = 'RELATED';
    hasTurkishEvidence = false;
    rationaleTr = 'Bu boyut doğrudan değil, ilişkili bir envanter üzerinden kuramsal/ampirik olarak desteklenmektedir.';
  } else {
    evidenceLevel = 'NO_DIRECT';
    hasTurkishEvidence = false;
    rationaleTr = 'Bu boyut için literatürde doğrulanmış doğrudan Türkçe psikometrik kanıt kaydı bulunmamaktadır.';
  }

  return {
    evidenceLevel,
    overallTurkishEvidenceLevel,
    measurementAlignmentLevel,
    appliesToLevel,
    instrumentValidationEstablished,
    instrumentMatch,
    humanVerified,
    hasTurkishEvidence,
    hasDirectFacetEvidence,
    rationaleTr,
  };
}
