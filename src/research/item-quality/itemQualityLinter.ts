import { ItemBankItem } from '../../types/item';
import { QualityRuleCode, QualityWarning, ItemQualityResult, BankQualitySummary, ItemTriageStatus } from './types';
import { analyzeLexicalClusters } from './semanticClusterAnalyzer';

// Academic and unnatural jargon to avoid in Turkish psychometric items
const ACADEMIC_JARGON_TERMS = [
  'yaklaşım davranışı',
  'kaçınma davranışı',
  'bilişsel çarpıtma',
  'psikopatoloji',
  'epistemik',
  'affektif',
  'otonom motivasyon',
  'içselleştirme',
  'dürtüsel regülasyon',
  'nevrotik',
  'psikolojik sermaye',
  'bilişsel yük'
];

// Absolute wording tokens that distort response curves
const ABSOLUTE_WORDING_TOKENS = [
  'asla',
  'her zaman',
  'kesinlikle',
  'hiçbir zaman',
  'tamamen',
  'istisnasız',
  'yüzde yüz',
  'hiç kimse',
  'herkes'
];

// Complex or double negation patterns in Turkish
const COMPLEX_NEGATION_PATTERNS = [
  /olmadığı söylenemez/i,
  /yapmadığı(m|n)? söylenemez/i,
  /etmediği(m|n)? söylenemez/i,
  /değil değil(im)?/i,
  /istemiyor değil(im)?/i,
  /bilmiyor değil(im)?/i,
  /sevmiyor değil(im)?/i,
  /yok değil/i
];

// Moralized or leading adverbs that push user towards or away from a response
const MORALIZED_LEADING_PATTERNS = [
  /haklı olarak/i,
  /akıllıca/i,
  /aptalca/i,
  /kötü niyetle/i,
  /şeytanca/i,
  /ahmakça/i,
  /doğal olarak herkes gibi/i,
  /bencilce/i
];

// Obvious social desirability traps that inflate response bias
const OBVIOUS_DESIRABILITY_PATTERNS = [
  /asla yalan söylemem/i,
  /asla hata yapmam/i,
  /herkes beni (çok )?sever/i,
  /kusursuz bir(iyim| insanım)/i,
  /hiç kimseyi kırmam/i,
  /her zaman doğruyu söylerim/i
];

// Common Turkish stop words to ignore when checking repeated wording
const STOP_WORDS = new Set([
  've', 'veya', 'ile', 'bir', 'bu', 'şu', 'o', 'için', 'de', 'da', 'ki', 'gibi', 'kadar', 'daha', 'en', 'ise', 'mi', 'mı', 'mu', 'mü'
]);

const DISCLAIMER_TR = 'Bu otomatik tarama yalnızca yazım, uzunluk ve biçimsel kural denetimi yapar. Psikometrik geçerlilik, faktör saflığı, güvenilirlik veya IRT ayırt ediciliği hakkında kanıt teşkil etmez.';

/**
 * Lints a single candidate psychometric item against formatting and wording heuristics.
 */
export function lintItem(item: Partial<ItemBankItem> & { text_tr: string; id: string; facetId: string }): ItemQualityResult {
  const warnings: QualityWarning[] = [];
  const text = (item.text_tr || '').trim();
  const lowerText = text.toLowerCase();
  const isSjt = item.itemType === 'situational_judgement';
  const isForcedChoice = item.itemType === 'forced_choice';
  const isAttentionCheck = item.attentionCheck || item.facetId === 'response_time_analysis' || item.facetId === 'longstring_index';
  const isImpressionManagement = item.facetId === 'impression_management';

  // 1. TOO_LONG check (excluding SJT scenarios)
  const words = text.split(/\s+/).filter(w => w.length > 0);
  if (!isSjt && !isForcedChoice) {
    if (text.length > 130 || words.length > 24) {
      warnings.push({
        ruleCode: 'TOO_LONG',
        severity: 'WARNING',
        messageTr: `Madde ifadesi uzun (${words.length} kelime, ${text.length} karakter). Bilişsel yükü azaltmak için 20 kelimenin altında tutulması önerilir.`,
        messageEn: `Item text is too long (${words.length} words, ${text.length} chars). Keep under 20 words to reduce cognitive fatigue.`,
        suggestionTr: 'Cümleyi tek bir doğrudan davranışsal eyleme odaklayarak kısaltın.'
      });
    }
  }

  // 2. TOO_SHORT check
  if (text.length < 12 || words.length < 3) {
    warnings.push({
      ruleCode: 'TOO_SHORT',
      severity: 'WARNING',
      messageTr: 'Madde ifadesi aşırı kısa veya eksik yüklemli.',
      messageEn: 'Item text is too short or lacks full syntactic predicate.',
      suggestionTr: 'İfadeyi net bir davranışsal veya tutumsal bağlam ekleyerek tamamlayın.'
    });
  }

  // 3. DOUBLE_BARRELED check
  if (!isAttentionCheck && !isForcedChoice) {
    const doubleBarreledMatch = text.match(/\b(ve bu nedenle|ve bundan dolayı|hem\s+.*\s+hem\s+de)\b/i);
    if (doubleBarreledMatch) {
      warnings.push({
        ruleCode: 'DOUBLE_BARRELED',
        severity: 'CRITICAL',
        messageTr: `Çift namlulu (double-barreled) madde şüphesi: "${doubleBarreledMatch[0]}". İki ayrı önerme tek soruda birleştirilmemelidir.`,
        messageEn: `Double-barreled item suspected: "${doubleBarreledMatch[0]}". Do not combine multiple propositions in one item.`,
        matchedText: doubleBarreledMatch[0],
        suggestionTr: 'İki ayrı durumu veya nedeni iki bağımsız maddeye bölün.'
      });
    }
  }

  // 4. ABSOLUTE_WORDING check
  if (!isAttentionCheck && !isImpressionManagement) {
    for (const token of ABSOLUTE_WORDING_TOKENS) {
      const regex = new RegExp(`\\b${token}\\b`, 'i');
      if (regex.test(text)) {
        warnings.push({
          ruleCode: 'ABSOLUTE_WORDING',
          severity: 'INFO',
          messageTr: `Kesinlik/uç frekans zarfı ("${token}") kullanımı. Yanıt dağılımını uçlara itebilir veya varyansı daraltabilir.`,
          messageEn: `Absolute wording token ("${token}") used. May restrict variance or create ceiling/floor effects.`,
          matchedText: token,
          suggestionTr: `"${token}" yerine sıklık veya eğilim belirten daha dengeli ifadeler (genellikle, çoğunlukla) tercih edilebilir.`
        });
        break;
      }
    }
  }

  // 5. COMPLEX_NEGATION check
  for (const pattern of COMPLEX_NEGATION_PATTERNS) {
    const m = text.match(pattern);
    if (m) {
      warnings.push({
        ruleCode: 'COMPLEX_NEGATION',
        severity: 'CRITICAL',
        messageTr: `Karmaşık veya çift olumsuzluk ("${m[0]}"). Katılımcılarda bilişsel karışıklık ve yanıt hatası yaratır.`,
        messageEn: `Complex or double negation detected ("${m[0]}"). Causes high cognitive error rates.`,
        matchedText: m[0],
        suggestionTr: 'İfadeyi yalın ve olumlu bir fiille yeniden yazın.'
      });
      break;
    }
  }

  // 6. READING_DIFFICULTY (Academic Jargon)
  for (const term of ACADEMIC_JARGON_TERMS) {
    if (lowerText.includes(term)) {
      warnings.push({
        ruleCode: 'READING_DIFFICULTY',
        severity: 'WARNING',
        messageTr: `Akademik veya yabancı psikolojik jargon ("${term}"). Madde halk dili normlarına uygun olmalıdır.`,
        messageEn: `Academic psychological jargon detected ("${term}"). Items should use everyday natural language.`,
        matchedText: term,
        suggestionTr: `"${term}" kavramını somut bir günlük davranışla ifade edin.`
      });
      break;
    }
  }

  // 7. MORALIZED_WORDING
  for (const pattern of MORALIZED_LEADING_PATTERNS) {
    const m = text.match(pattern);
    if (m) {
      warnings.push({
        ruleCode: 'MORALIZED_WORDING',
        severity: 'WARNING',
        messageTr: `Ahlaki veya yönlendirici niteleyici ("${m[0]}"). Katılımcıyı doğru yanıta yönlendirebilir.`,
        messageEn: `Moralized or leading wording detected ("${m[0]}").`,
        matchedText: m[0],
        suggestionTr: 'Yargılayıcı sıfat ve zarfları çıkararak eylemi nötr aktarın.'
      });
      break;
    }
  }

  // 8. OBVIOUS_DESIRABILITY
  if (!isImpressionManagement && !isAttentionCheck) {
    for (const pattern of OBVIOUS_DESIRABILITY_PATTERNS) {
      const m = text.match(pattern);
      if (m) {
        warnings.push({
          ruleCode: 'OBVIOUS_DESIRABILITY',
          severity: 'WARNING',
          messageTr: `Sosyal beğenirlik tuzağı ("${m[0]}"). Yanıtların büyük çoğunluğu erdemli seçenekte toplanabilir.`,
          messageEn: `Obvious social desirability trap ("${m[0]}"). Response will severely skew towards positive evaluation.`,
          matchedText: m[0],
          suggestionTr: 'Davranışı idealize edilmiş genel geçer erdem yerine gerçekçi bir ikilem olarak sunun.'
        });
        break;
      }
    }
  }

  // 9. AMBIGUOUS_TIMEFRAME
  if (item.itemType === 'behavior_frequency') {
    if (/\b(bazen|arasıra|sık sık|çoğunlukla|nadiren)\b/i.test(lowerText)) {
      warnings.push({
        ruleCode: 'AMBIGUOUS_TIMEFRAME',
        severity: 'INFO',
        messageTr: 'Davranış sıklığı ölçeğinde soru gövdesinde sıklık zarfı ("bazen/nadiren/sık sık") yer alıyor.',
        messageEn: 'Frequency adverb inside prompt body of a behavior_frequency item.',
        suggestionTr: 'Soru gövdesinden sıklık zarfını çıkarın; sıklığı seçeneklere bırakın.'
      });
    }
  }

  // 10. REPEATED_WORDING
  const cleanTokens = lowerText
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, '')
    .split(/\s+/)
    .filter(t => t.length > 3 && !STOP_WORDS.has(t));
  const tokenCounts: Record<string, number> = {};
  for (const t of cleanTokens) {
    tokenCounts[t] = (tokenCounts[t] || 0) + 1;
    if (tokenCounts[t] >= 3) {
      warnings.push({
        ruleCode: 'REPEATED_WORDING',
        severity: 'INFO',
        messageTr: `Cümle içinde aynı kelime kökü ("${t}") 3 veya daha fazla kez tekrarlanmış.`,
        messageEn: `Word root ("${t}") repeated 3+ times in the item.`,
        matchedText: t
      });
      break;
    }
  }

  // 11. SJT INTERNAL DESIGN HEURISTIC CHECK (>=3 plausible options)
  if (isSjt) {
    const scenarios = (item as any).situationalScenarios || [];
    if (scenarios.length < 3) {
      warnings.push({
        ruleCode: 'SJT_REQUIRES_REVISION',
        severity: 'WARNING',
        messageTr: `SJT senaryosunda ${scenarios.length} seçenek bulunuyor. Zengin ikilem için en az 3 makul seçenek önerilir (Kriter: INTERNAL_DESIGN_HEURISTIC).`,
        messageEn: `SJT scenario contains only ${scenarios.length} options. Minimum 3 plausible options recommended for genuine trade-offs.`,
        suggestionTr: 'Tek bariz doğru cevabı önlemek için 3. veya 4. dengeli seçenekler ekleyin.'
      });
    }
  }

  // 12. FORCED-CHOICE DESIRABILITY MISMATCH CHECK
  if (isForcedChoice) {
    warnings.push({
      ruleCode: 'FORCED_CHOICE_DESIRABILITY_MISMATCH',
      severity: 'WARNING',
      messageTr: 'Zorunlu seçim çiftinde belirgin sosyal beğenirlik asimetrisi şüphesi. İki kutup arasındaki erdem çekiciliği eşitlenmelidir.',
      messageEn: 'Suspected social desirability asymmetry in forced-choice pair. Poles should be matched in social desirability.',
      suggestionTr: 'Her iki seçeneği de olumlu veya her ikisini de nötr tutumsal gerekçelerle eşleştirin.'
    });
  }

  // Compute Formatting / Wording Lint Score (100 base)
  let score = 100;
  for (const w of warnings) {
    if (w.severity === 'CRITICAL') score -= 30;
    else if (w.severity === 'WARNING') score -= 10;
    else if (w.severity === 'INFO') score -= 3;
  }
  score = Math.max(0, score);

  // Compute Triage Status
  let triageStatus: ItemTriageStatus = 'READY_FOR_EXPERT_REVIEW';
  const hasCritical = warnings.some(w => w.severity === 'CRITICAL');
  const hasSjtOrFcWarning = warnings.some(w => w.ruleCode === 'SJT_REQUIRES_REVISION' || w.ruleCode === 'FORCED_CHOICE_DESIRABILITY_MISMATCH');

  if (item.licenseStatus === 'REJECTED' || (item as any).licenseStatus === 'BLOCKED') {
    triageStatus = 'BLOCKED_PROVENANCE_OR_LICENSE';
  } else if (hasCritical || hasSjtOrFcWarning || score < 80) {
    triageStatus = 'REQUIRES_INTERNAL_REVISION';
  } else {
    triageStatus = 'READY_FOR_EXPERT_REVIEW';
  }

  return {
    itemId: item.id,
    facetId: item.facetId,
    warnings,
    wordingLintScore: score,
    formattingHeuristicScore: score,
    qualityScore: score, // Deprecated alias
    passed: !hasCritical && score >= 70,
    automatedHeuristicOnly: true,
    triageStatus,
    disclaimerTr: DISCLAIMER_TR
  };
}

/**
 * Lints an entire item bank, calculates real lexical overlap clusters, and aggregates triage metrics.
 */
export function lintItemBank(items: Array<Partial<ItemBankItem> & { text_tr: string; id: string; facetId: string }>): {
  itemResults: ItemQualityResult[];
  summary: BankQualitySummary;
} {
  const itemResults = items.map(it => lintItem(it));
  const cleanCount = itemResults.filter(r => r.warnings.length === 0).length;
  const criticalCount = itemResults.filter(r => r.warnings.some(w => w.severity === 'CRITICAL')).length;
  const flaggedCount = itemResults.filter(r => r.warnings.length > 0).length;

  const warningsByRule: Record<QualityRuleCode, number> = {
    TOO_LONG: 0,
    TOO_SHORT: 0,
    DOUBLE_BARRELED: 0,
    ABSOLUTE_WORDING: 0,
    COMPLEX_NEGATION: 0,
    REPEATED_WORDING: 0,
    NEAR_DUPLICATE: 0,
    READING_DIFFICULTY: 0,
    LEADING_WORDING: 0,
    MORALIZED_WORDING: 0,
    OBVIOUS_DESIRABILITY: 0,
    AMBIGUOUS_TIMEFRAME: 0,
    CONSTRUCT_LEAKAGE: 0,
    SJT_REQUIRES_REVISION: 0,
    FORCED_CHOICE_DESIRABILITY_MISMATCH: 0
  };

  for (const r of itemResults) {
    for (const w of r.warnings) {
      warningsByRule[w.ruleCode] = (warningsByRule[w.ruleCode] || 0) + 1;
    }
  }

  const avgScore = itemResults.length > 0
    ? Math.round(itemResults.reduce((acc, r) => acc + r.wordingLintScore, 0) / itemResults.length)
    : 100;

  // Real Lexical Cluster Analysis (NO HARD-CODED 0)
  const lexicalReport = analyzeLexicalClusters(
    items.map(it => ({ id: it.id, facetId: it.facetId, text_tr: it.text_tr })),
    0.70
  );

  const triageCounts = {
    readyForExpertReview: itemResults.filter(r => r.triageStatus === 'READY_FOR_EXPERT_REVIEW').length,
    requiresInternalRevision: itemResults.filter(r => r.triageStatus === 'REQUIRES_INTERNAL_REVISION').length,
    blockedProvenanceOrLicense: itemResults.filter(r => r.triageStatus === 'BLOCKED_PROVENANCE_OR_LICENSE').length
  };

  return {
    itemResults,
    summary: {
      totalItemsScanned: items.length,
      cleanItemsCount: cleanCount,
      flaggedItemsCount: flaggedCount,
      criticalIssuesCount: criticalCount,
      warningsByRule,
      duplicateClustersCount: lexicalReport.totalDuplicatesDetected,
      averageQualityScore: avgScore, // Deprecated alias
      averageWordingLintScore: avgScore,
      triageSummary: triageCounts,
      disclaimerTr: DISCLAIMER_TR
    }
  };
}
