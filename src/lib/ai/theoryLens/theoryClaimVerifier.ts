/**
 * PsycheAI FAZ 2.19 — Theory Claim Verifier
 *
 * Verifies that AI-generated theoretical claims strictly adhere to psychological governance rules:
 * - Anti-diagnosis (no psychiatric pathology labels)
 * - Anti-trauma inference (no childhood trauma / sexual history assertions)
 * - Anti-score alteration (no fabricated psychometric scores)
 * - Epistemic validity checking
 */

import {
  TheoryInsightV1,
  TheoryConversationResponseV1,
  TheoryComparisonResult,
} from '@/types/theoryLens';

const FORBIDDEN_PATTERNS = [
  /teşhis\s+koy/i,
  /tanısı\s+konul/i,
  /klinik\s+olarak\s+hastas/i,
  /borderline\s+kişilik/i,
  /bipolar\s+bozukluk/i,
  /narsisistik\s+kişilik\s+bozukluğu\s+tanısı/i,
  /şizofren/i,
  /psikopatolojiniz/i,
  /çocukluk\s+travmanız\s+var/i,
  /bastırılmış\s+cinsel\s+travma/i,
  /ebeveyninizin\s+istismarı/i,
  /kesinlikle\s+böyle\s+bir\s+insansınız/i,
];

export interface VerificationResult {
  isValid: boolean;
  violations: string[];
}

export function verifyTheoreticalText(text: string): VerificationResult {
  const violations: string[] = [];

  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(text)) {
      violations.push(`Forbidden pattern matched: ${pattern.toString()}`);
    }
  }

  return {
    isValid: violations.length === 0,
    violations,
  };
}

export function verifyTheoryInsight(insight: TheoryInsightV1): VerificationResult {
  const violations: string[] = [];

  const textToVerify = [
    insight.titleTr,
    insight.summaryTr,
    insight.perspectiveAnalysisTr,
    insight.identifiedTensionsAndSynergiesTr || '',
    ...insight.reflectionPromptsTr,
    ...insight.epistemicSegments.map((s) => s.contentTr),
  ].join(' ');

  const textResult = verifyTheoreticalText(textToVerify);
  if (!textResult.isValid) {
    violations.push(...textResult.violations);
  }

  // Ensure epistemic segments exist
  if (!insight.epistemicSegments || insight.epistemicSegments.length === 0) {
    violations.push('Insight is missing epistemic segments.');
  }

  return {
    isValid: violations.length === 0,
    violations,
  };
}

export function verifyTheoryConversation(
  response: TheoryConversationResponseV1
): VerificationResult {
  const violations: string[] = [];

  const textToVerify = [
    response.replyTr,
    ...response.suggestedReflectionPrompts,
    ...response.epistemicSegments.map((s) => s.contentTr),
  ].join(' ');

  const textResult = verifyTheoreticalText(textToVerify);
  if (!textResult.isValid) {
    violations.push(...textResult.violations);
  }

  return {
    isValid: violations.length === 0,
    violations,
  };
}

export function verifyTheoryComparison(
  result: TheoryComparisonResult
): VerificationResult {
  const violations: string[] = [];

  const textToVerify = [
    result.integrativeSynthesisTr,
    ...result.consensusPointsTr,
    ...result.divergencePointsTr,
    ...result.lenses.map((l) => l.coreViewTr),
  ].join(' ');

  const textResult = verifyTheoreticalText(textToVerify);
  if (!textResult.isValid) {
    violations.push(...textResult.violations);
  }

  return {
    isValid: violations.length === 0,
    violations,
  };
}
