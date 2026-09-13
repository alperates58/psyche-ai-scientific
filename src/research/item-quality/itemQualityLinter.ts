import { ItemBankItem } from '../../types/item';
import { QualityRuleCode, QualityWarning, ItemQualityResult } from './types';

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

/**
 * Lints a single candidate psychometric item against scientific quality heuristics.
 */
export function lintItem(item: Partial<ItemBankItem> & { text_tr: string; id: string; facetId: string }): ItemQualityResult {
  const warnings: QualityWarning[] = [];
  const text = (item.text_tr || '').trim();
  const lowerText = text.toLowerCase();
  const isSjt = item.itemType === 'situational_judgement';
  const isAttentionCheck = item.attentionCheck || item.facetId === 'response_time_analysis' || item.facetId === 'longstring_index';
  const isImpressionManagement = item.facetId === 'impression_management';

  // 1. TOO_LONG check (excluding SJT scenarios)
  const words = text.split(/\s+/).filter(w => w.length > 0);
  if (!isSjt) {
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
      messageTr: `Madde ifadesi çok kısa (${words.length} kelime). Yetersiz bağlam yanıt varyansını düşürebilir.`,
      messageEn: `Item text is too short (${words.length} words). Insufficient context may reduce response variance.`,
      suggestionTr: 'Daha açık bir davranış veya tercih bağlamı ekleyin.'
    });
  }

  // 3. COMPLEX_NEGATION check (Double Negation)
  for (const pattern of COMPLEX_NEGATION_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      warnings.push({
        ruleCode: 'COMPLEX_NEGATION',
        severity: 'CRITICAL',
        messageTr: `Çift olumsuzluk ("${match[0]}") saptandı. Kullanıcıların kafasını karıştırır ve yöntem etkisi (method artifact) üretir.`,
        messageEn: `Double negation detected ("${match[0]}"). Confuses respondents and introduces method artifacts.`,
        matchedText: match[0],
        suggestionTr: 'Cümleyi doğrudan olumlu veya tek olumsuzluk içeren açık bir ifadeye dönüştürün.'
      });
    }
  }

  // 4. ABSOLUTE_WORDING check
  if (!isAttentionCheck && !isImpressionManagement) {
    for (const token of ABSOLUTE_WORDING_TOKENS) {
      // Check word boundary
      const regex = new RegExp(`\\b${token}\\b`, 'i');
      if (regex.test(lowerText)) {
        warnings.push({
          ruleCode: 'ABSOLUTE_WORDING',
          severity: 'WARNING',
          messageTr: `Mutlak ifade ("${token}") saptandı. Aşırı uç yanıt eğilimi yaratabilir.`,
          messageEn: `Absolute wording token ("${token}") detected. May cause extreme response avoidance.`,
          matchedText: token,
          suggestionTr: 'Mutlak zarfı kaldırarak "genellikle", "çoğunlukla" veya doğrudan eylem yüklemi kullanın.'
        });
        break; // report first instance
      }
    }
  }

  // 5. DOUBLE_BARRELED check
  // Patterns like "planlarım ve bitiririm", "hem X hem de Y yaparım"
  if (/\bhem\b.+\bhem\b/i.test(lowerText) || /\bve aynı zamanda\b/i.test(lowerText)) {
    warnings.push({
      ruleCode: 'DOUBLE_BARRELED',
      severity: 'WARNING',
      messageTr: 'Çift odaklı (double-barreled) ifade kalıbı ("hem... hem" veya "ve aynı zamanda") saptandı. İki ayrı davranışı aynı anda ölçüyor olabilir.',
      messageEn: 'Double-barreled construct pattern detected. Might be measuring two distinct behaviors simultaneously.',
      suggestionTr: 'İki iddiayı iki ayrı maddeye bölün.'
    });
  }

  // 6. READING_DIFFICULTY (Academic Jargon)
  for (const jargon of ACADEMIC_JARGON_TERMS) {
    if (lowerText.includes(jargon)) {
      warnings.push({
        ruleCode: 'READING_DIFFICULTY',
        severity: 'WARNING',
        messageTr: `Ağır akademik terim ("${jargon}") saptandı. Doğal günlük Türkçe kullanılmalıdır.`,
        messageEn: `Academic jargon ("${jargon}") detected. Use natural conversational Turkish instead.`,
        matchedText: jargon,
        suggestionTr: `"${jargon}" yerine sıradan insanların günlük hayatta kullandığı somut bir ifade seçin.`
      });
    }
  }

  // 7. MORALIZED_WORDING / LEADING_WORDING
  for (const pattern of MORALIZED_LEADING_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      warnings.push({
        ruleCode: 'MORALIZED_WORDING',
        severity: 'WARNING',
        messageTr: `Yönlendirici veya ahlaki yargı içeren ifade ("${match[0]}") saptandı.`,
        messageEn: `Leading or moralizing wording ("${match[0]}") detected.`,
        matchedText: match[0],
        suggestionTr: 'Yargı belirten nitelemeler yerine nötr davranışsal tasvir kullanın.'
      });
    }
  }

  // 8. OBVIOUS_DESIRABILITY
  if (!isImpressionManagement) {
    for (const pattern of OBVIOUS_DESIRABILITY_PATTERNS) {
      const match = text.match(pattern);
      if (match) {
        warnings.push({
          ruleCode: 'OBVIOUS_DESIRABILITY',
          severity: 'WARNING',
          messageTr: `Aşırı sosyal beğenirlik içeren ifade ("${match[0]}") saptandı. Katılımcıların neredeyse tamamı bu maddeye aynı yönde yanıt verecektir.`,
          messageEn: `Obvious social desirability detected ("${match[0]}"). Induces ceiling or floor effects.`,
          matchedText: match[0],
          suggestionTr: 'Davranış sıklığı veya dolaylı bağlam kullanarak sosyal baskıyı hafifletin.'
        });
      }
    }
  }

  // 9. AMBIGUOUS_TIMEFRAME (e.g. "bazen", "arasıra" inside behavior frequency items)
  if (item.itemType === 'behavior_frequency') {
    if (/\b(bazen|arasıra|sık sık|çoğunlukla|nadiren)\b/i.test(lowerText)) {
      warnings.push({
        ruleCode: 'AMBIGUOUS_TIMEFRAME',
        severity: 'INFO',
        messageTr: 'Davranış sıklığı ölçeği kullanılan bir maddede soru gövdesinde sıklık zarfı ("bazen/nadiren/sık sık") yer alıyor. Seçeneklerle çakışma yaratabilir.',
        messageEn: 'Frequency adverb inside prompt body of a behavior_frequency item. May conflict with response options.',
        suggestionTr: 'Soru gövdesinden sıklık zarfını çıkarın; sıklığı cevap seçeneklerine (Hiç / Nadiren / Bazen...) bırakın.'
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

  // Compute Quality Score (100 base)
  let score = 100;
  for (const w of warnings) {
    if (w.severity === 'CRITICAL') score -= 30;
    else if (w.severity === 'WARNING') score -= 10;
    else if (w.severity === 'INFO') score -= 3;
  }
  score = Math.max(0, score);

  return {
    itemId: item.id,
    facetId: item.facetId,
    warnings,
    qualityScore: score,
    passed: warnings.filter(w => w.severity === 'CRITICAL').length === 0 && score >= 70
  };
}

/**
 * Lints an entire item bank and aggregates quality metrics.
 */
export function lintItemBank(items: Array<Partial<ItemBankItem> & { text_tr: string; id: string; facetId: string }>) {
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
    CONSTRUCT_LEAKAGE: 0
  };

  for (const r of itemResults) {
    for (const w of r.warnings) {
      warningsByRule[w.ruleCode] = (warningsByRule[w.ruleCode] || 0) + 1;
    }
  }

  const avgScore = itemResults.length > 0
    ? Math.round(itemResults.reduce((acc, r) => acc + r.qualityScore, 0) / itemResults.length)
    : 100;

  return {
    itemResults,
    summary: {
      totalItemsScanned: items.length,
      cleanItemsCount: cleanCount,
      flaggedItemsCount: flaggedCount,
      criticalIssuesCount: criticalCount,
      warningsByRule,
      duplicateClustersCount: 0,
      averageQualityScore: avgScore
    }
  };
}
