/**
 * PsycheAI Anti-Hallucination & Claim Verification Engine V2
 *
 * Deterministic post-generation verification pass.
 * Enforces:
 * - Structural grounding: Every claim must reference valid, measured evidence IDs.
 * - Anti-diagnostic guard: Blocks all clinical/psychiatric disease labels.
 * - Anti-percentile guard: Blocks population norm claims in pre-calibration mode.
 * - Anti-causal guard: Blocks speculative historical causation claims.
 * - Anti-longitudinal guard: Blocks change/trajectory claims when repeated data is absent.
 * - Anti-Barnum filter: Flags generic, unfalsifiable, or universally flattering claims.
 * - Internal QA: unsupportedClaims MUST equal 0.
 */

import { AIInsightV2, InterpretationPlanV2 } from '@/types/aiInsightV2';

const FORBIDDEN_CLINICAL_KEYWORDS = [
  'depresyon tanısı',
  'depresif bozukluk',
  'bipolar bozukluk',
  'bipolar teşhisi',
  'dehb teşhisi',
  'dehb tanısı',
  'adhd',
  'otizm spektrum',
  'borderline',
  'şizofreni',
  'narsisistik kişilik bozukluğu',
  'psikiyatrik tanı',
  'klinik patoloji',
  'tedavi edilmeli',
  'ilaç tedavisi',
  'hastalık teşhisi',
  'klinik tanı',
];

const FORBIDDEN_PERCENTILE_PATTERNS = [
  /toplum(un|unun)?\s*%\s*\d+/i,
  /nüfus(un|unun)?\s*%\s*\d+/i,
  /yüzdelik\s*dilim/i,
  /percentile/i,
  /türkiye\s*(geneli|ortalamas[ı|ının]?|toplumunun)?\s*%\s*\d+/i,
  /popülasyon(un|unun)?\s*%\s*\d+/i,
  /yüzde\s*\d+\s*dilim/i,
  /%\s*\d+['’]?(si|sinden|inden|sından|ından|den|dan)?\s*(daha|üzerinde|altında)/i,
];

const FORBIDDEN_CAUSAL_PATTERNS = [
  /kesinlikle\s*neden\s*olur/i,
  /sebebi\s*kesin\s*olarak/i,
  /kaçınılmaz\s*olarak\s*sonuçlanır/i,
  /çocukluğunuzdan\s*kaynaklan/i,
  /bu\s*yüzden\s*ilişkileriniz\s*başarısız/i,
  /bu\s*nedenle\s*başarısız\s*olursunuz/i,
];

const FORBIDDEN_LONGITUDINAL_PATTERNS = [
  /önceki\s*ölçüme\s*göre/i,
  /zamanla\s*(arttı|azaldı|yükseldi|düştü|güçlendi)/i,
  /geçmiş\s*testinize\s*göre/i,
  /zaman\s*içinde\s*değişti/i,
  /gelişim\s*gösterdi/i,
  /ilerleme\s*kaydetti/i,
];

const FORBIDDEN_UNGROUNDED_LONGITUDINAL_PATTERNS = [
  /sürekli\s+art(ıyor|maktadır|tı)/i,
  /sürekli\s+azal(ıyor|maktadır|dı)/i,
  /kalıcı\s+olarak\s+değiş(ti|miştir)/i,
  /kişiliğiniz\s+değiş(ti|miştir)/i,
  /kişilik\s+gelişimi/i,
  /significant\s+improvement/i,
  /istatistiksel\s+olarak\s+anlamlı\s+değişim/i,
  /klinik\s+olarak\s+anlamlı\s+değişim/i,
  /kişiliğiniz\s+dönüştü/i,
  /tamamen\s+değişti/i,
];

const BARNUM_GENERIC_PATTERNS = [
  /bazen\s*böyle\s*bazen\s*şöyle/i,
  /her\s*insan\s*gibi\s*siz\s*de/i,
  /içinizde\s*büyük\s*bir\s*potansiyel\s*var\s*ancak\s*bunu\s*kullanamıyorsunuz/i,
  /dışarıdan\s*güçlü\s*görünseniz\s*de\s*içinizde/i,
];

export interface VerificationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  metrics: {
    totalPsychologicalClaims: number;
    groundedClaims: number;
    unsupportedClaims: number;
  };
}

export function verifyAIInsightClaims(
  insight: AIInsightV2,
  plan: InterpretationPlanV2
): VerificationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Build valid evidence ID registry from plan
  const validEvidenceIdSet = new Set<string>();
  const validFacetIdSet = new Set<string>();

  for (const e of plan.primaryEvidence) {
    validEvidenceIdSet.add(e.evidenceId);
    validEvidenceIdSet.add(e.targetId);
    if (e.type === 'FACET_SCORE') validFacetIdSet.add(e.targetId);
  }
  for (const e of plan.supportingEvidence) {
    validEvidenceIdSet.add(e.evidenceId);
    validEvidenceIdSet.add(e.targetId);
    if (e.type === 'FACET_SCORE') validFacetIdSet.add(e.targetId);
  }
  for (const e of plan.counterbalancingEvidence) {
    validEvidenceIdSet.add(e.evidenceId);
    validEvidenceIdSet.add(e.targetId);
    if (e.type === 'FACET_SCORE') validFacetIdSet.add(e.targetId);
  }
  for (const t of plan.activatedTensions) {
    validEvidenceIdSet.add(`ev_tension_${t.id}`);
    validEvidenceIdSet.add(t.id);
  }
  for (const s of plan.activatedSynergies) {
    validEvidenceIdSet.add(`ev_synergy_${s.id}`);
    validEvidenceIdSet.add(s.id);
  }
  for (const p of plan.activatedPatterns) {
    validEvidenceIdSet.add(p.id);
  }

  // 1. Evidence Grounding Verification
  let totalClaims = 0;
  let groundedClaims = 0;
  let unsupportedClaims = 0;

  const allRefs = [
    ...(insight.evidenceRefs || []),
    ...(insight.primaryEvidenceRefs || []),
    ...(insight.supportingEvidenceRefs || []),
    ...(insight.counterbalancingEvidenceRefs || []),
  ];

  if (plan.primaryEvidence.length > 0 && allRefs.length === 0) {
    errors.push('Yorum hiçbir kanıt referansı (evidenceRefs) içermiyor.');
    unsupportedClaims++;
  }

  for (const ref of allRefs) {
    totalClaims++;
    const isKnown = validEvidenceIdSet.has(ref) ||
      Array.from(validEvidenceIdSet).some((k) => k.includes(ref) || ref.includes(k));

    if (isKnown) {
      groundedClaims++;
    } else {
      unsupportedClaims++;
      errors.push(`Yorum, planda tanımlı olmayan geçersiz veya ölçülmemiş kanıt referansı içeriyor: "${ref}"`);
    }
  }

  // 2. Prohibited Text Content Auditing
  const fullText = `${insight.titleTr} ${insight.summaryTr} ${insight.bodyTr} ${(insight.reflectionPrompts || []).join(' ')}`.toLowerCase();

  // Clinical Keywords
  for (const kw of FORBIDDEN_CLINICAL_KEYWORDS) {
    if (fullText.includes(kw)) {
      errors.push(`Yasaklı klinik/psikiyatrik tanı ifadesi tespit edildi: "${kw}"`);
    }
  }

  // Percentiles in Pre-Calibration
  for (const pat of FORBIDDEN_PERCENTILE_PATTERNS) {
    if (pat.test(fullText)) {
      errors.push('Ön kalibrasyon aşamasında yasaklı yüzdelik (percentile) veya norm karşılaştırma iddiası tespit edildi.');
    }
  }

  // Causal Certainty
  for (const pat of FORBIDDEN_CAUSAL_PATTERNS) {
    if (pat.test(fullText)) {
      errors.push('Yasaklı kesin nedensellik veya geçmişe dönük zihin okuma iddiası tespit edildi.');
    }
  }

  // Longitudinal Claims without Repeat Data
  if (!plan.longitudinalState.hasRepeat) {
    for (const pat of FORBIDDEN_LONGITUDINAL_PATTERNS) {
      if (pat.test(fullText)) {
        errors.push('Tekil ölçüm aşamasında boylamsal değişim/gelişim ("arttı", "azaldı") iddiası tespit edildi.');
      }
    }
  }

  // Ungrounded / Overly Bold Longitudinal Expressions
  for (const pat of FORBIDDEN_UNGROUNDED_LONGITUDINAL_PATTERNS) {
    if (pat.test(fullText)) {
      errors.push('Kanıta dayanmayan veya aşırı iddialı boylamsal değişim ifadesi ("sürekli artıyor", "kalıcı olarak değişti", "significant improvement", "kişilik gelişimi") tespit edildi.');
    }
  }

  // Anti-Barnum Generic Flattery
  for (const pat of BARNUM_GENERIC_PATTERNS) {
    if (pat.test(fullText)) {
      warnings.push('Barnum etkisi riski: Yorum genel-geçer veya evrensel iltifat şablonu içeriyor olabilir.');
    }
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    warnings,
    metrics: {
      totalPsychologicalClaims: totalClaims,
      groundedClaims,
      unsupportedClaims,
    },
  };
}

/**
 * FAZ 2.21: Verification of AI-generated Journal Reflections & Observational Text
 */
const FORBIDDEN_JOURNAL_PATTERNS = [
  /sen\s+kesinlikle/i,
  /bu\s+senin\s+gerçek\s+kişiliğin/i,
  /profiliniz\s+bunu\s+kanıtlıyor/i,
  /günlükleriniz\s+gösteriyor\s+ki\s+siz/i,
  /kesin\s+olarak\s+kanıtlı/i,
  /neden\s+oluyor/i,
  /neden\s+olmuştur/i,
  /terapi\s+seansı/i,
  /terapötik\s+müdahale/i,
  /travmanızı\s+işley/i,
  /tedavi\s+uygul/i,
  /depresyon\s+belirtisi/i,
  /depresyon\s+tanısı/i,
  /depresif\s+bozukluk/i,
  /anksiyete\s+bozukluğu/i,
  /kaygı\s+bozukluğu/i,
  /bipolar/i,
  /borderline/i,
  /şizofren/i,
  /okb/i,
  /obsesif/i,
  /dehb\s+tanısı/i,
  /adhd/i,
  /travmanız\s+var/i,
  /çocukluk\s+travmanız/i,
  /travmanızın\s+sonucu/i,
  /kişilik\s+bozukluğu/i,
  /narsisistik\s+kişilik/i,
];

export interface JournalVerificationResult {
  isValid: boolean;
  errors: string[];
}

export function verifyJournalReflectionClaims(text: string): JournalVerificationResult {
  const errors: string[] = [];
  const clean = text.toLowerCase();

  for (const pat of FORBIDDEN_JOURNAL_PATTERNS) {
    if (pat.test(clean)) {
      errors.push(`Yasaklı veya aşırı iddialı yansıma ifadesi tespit edildi: ${pat.toString()}`);
    }
  }

  for (const kw of FORBIDDEN_CLINICAL_KEYWORDS) {
    if (clean.includes(kw)) {
      errors.push(`Yasaklı klinik/psikiyatrik tanı kelimesi tespit edildi: "${kw}"`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

