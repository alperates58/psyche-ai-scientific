/**
 * PSYCHEAI RESPONSE QUALITY & VALIDITY ITEM BANK (14 ITEMS)
 * Attention checks, Paired consistency checks, Infrequency/Improbable items.
 */

const RESPONSE_QUALITY_ITEMS = [
  // 1. Attention Checks (Directed Response)
  {
    itemId: "psi_rq_attn_01",
    type: "ATTENTION_CHECK",
    promptTr: "Bu madde dikkatinizi ölçmek amacıyla yerleştirilmiştir; lütfen bu ifade için 'Kesinlikle Katılıyorum' seçeneğini işaretleyiniz.",
    promptEn: "This item is placed to measure your attention; please select the 'Strongly Agree' option for this statement.",
    expectedResponseValue: 5,
    expectedOptionLabelTr: "Kesinlikle Katılıyorum",
    scoringRule: "EXACT_MATCH",
    flagThreshold: "VALUE_NOT_EQUAL_5"
  },
  {
    itemId: "psi_rq_attn_02",
    type: "ATTENTION_CHECK",
    promptTr: "Lütfen bu soruyu yanıtlarken doğrudan 'Kesinlikle Katılmıyorum' seçeneğini işaretleyiniz.",
    promptEn: "Please select the 'Strongly Disagree' option directly when answering this question.",
    expectedResponseValue: 1,
    expectedOptionLabelTr: "Kesinlikle Katılmıyorum",
    scoringRule: "EXACT_MATCH",
    flagThreshold: "VALUE_NOT_EQUAL_1"
  },
  {
    itemId: "psi_rq_attn_03",
    type: "ATTENTION_CHECK",
    promptTr: "Araştırma kalitesi kontrolü için bu ifadede lütfen 'Nötr / Kararsızım' seçeneğini tercih ediniz.",
    promptEn: "For research quality control, please select the 'Neutral / Undecided' option on this statement.",
    expectedResponseValue: 3,
    expectedOptionLabelTr: "Nötr / Kararsızım",
    scoringRule: "EXACT_MATCH",
    flagThreshold: "VALUE_NOT_EQUAL_3"
  },
  {
    itemId: "psi_rq_attn_04",
    type: "ATTENTION_CHECK",
    promptTr: "Veri güvenilirliği doğrulaması: Lütfen bu maddede yalnızca 'Katılıyorum' seçeneğini işaretleyiniz.",
    promptEn: "Data reliability verification: Please select only the 'Agree' option for this item.",
    expectedResponseValue: 4,
    expectedOptionLabelTr: "Katılıyorum",
    scoringRule: "EXACT_MATCH",
    flagThreshold: "VALUE_NOT_EQUAL_4"
  },

  // 2. Paired Consistency Items
  {
    itemId: "psi_rq_pair_01a",
    type: "PAIRED_CONSISTENCY",
    pairGroupId: "pair_calm_anxious",
    promptTr: "Genel olarak kendimi çoğu zaman sakin, huzurlu ve kaygısız hissederim.",
    promptEn: "In general, I feel calm, peaceful, and unanxious most of the time.",
    expectedPairTargetId: "psi_rq_pair_01b",
    expectedRelation: "NEGATIVE_CORRELATION",
    flagThreshold: "ABSOLUTE_DIFF_LESS_THAN_1_WHEN_UNREVERSED"
  },
  {
    itemId: "psi_rq_pair_01b",
    type: "PAIRED_CONSISTENCY",
    pairGroupId: "pair_calm_anxious",
    promptTr: "Genel olarak kendimi çoğu zaman son derece gergin, huzursuz ve kaygılı hissederim.",
    promptEn: "In general, I feel extremely tense, restless, and anxious most of the time.",
    expectedPairTargetId: "psi_rq_pair_01a",
    expectedRelation: "NEGATIVE_CORRELATION",
    flagThreshold: "ABSOLUTE_DIFF_LESS_THAN_1_WHEN_UNREVERSED"
  },
  {
    itemId: "psi_rq_pair_02a",
    type: "PAIRED_CONSISTENCY",
    pairGroupId: "pair_social_seeking",
    promptTr: "İnsanlarla bir arada vakit geçirmek bana yüksek enerji verir ve beni mutlu eder.",
    promptEn: "Spending time together with people gives me high energy and makes me happy.",
    expectedPairTargetId: "psi_rq_pair_02b",
    expectedRelation: "NEGATIVE_CORRELATION",
    flagThreshold: "ABSOLUTE_DIFF_LESS_THAN_1_WHEN_UNREVERSED"
  },
  {
    itemId: "psi_rq_pair_02b",
    type: "PAIRED_CONSISTENCY",
    pairGroupId: "pair_social_seeking",
    promptTr: "İnsanlarla bir arada bulunmaktan hiç hoşlanmam ve sosyal ortamlardan tamamen uzak dururum.",
    promptEn: "I do not enjoy being around people at all and avoid social settings completely.",
    expectedPairTargetId: "psi_rq_pair_02a",
    expectedRelation: "NEGATIVE_CORRELATION",
    flagThreshold: "ABSOLUTE_DIFF_LESS_THAN_1_WHEN_UNREVERSED"
  },
  {
    itemId: "psi_rq_pair_03a",
    type: "PAIRED_CONSISTENCY",
    pairGroupId: "pair_task_completion",
    promptTr: "Başladığım bir işi veya projeyi ne olursa olsun sonuna kadar bitirmeye odaklanırım.",
    promptEn: "Whatever happens, I focus on finishing a task or project I started until the very end.",
    expectedPairTargetId: "psi_rq_pair_03b",
    expectedRelation: "NEGATIVE_CORRELATION",
    flagThreshold: "ABSOLUTE_DIFF_LESS_THAN_1_WHEN_UNREVERSED"
  },
  {
    itemId: "psi_rq_pair_03b",
    type: "PAIRED_CONSISTENCY",
    pairGroupId: "pair_task_completion",
    promptTr: "Başladığım işleri genellikle yarıda bırakır, sonunu hiçbir zaman getiremem.",
    promptEn: "I usually leave the tasks I start unfinished and never bring them to conclusion.",
    expectedPairTargetId: "psi_rq_pair_03a",
    expectedRelation: "NEGATIVE_CORRELATION",
    flagThreshold: "ABSOLUTE_DIFF_LESS_THAN_1_WHEN_UNREVERSED"
  },

  // 3. Infrequency / Improbable Items
  {
    itemId: "psi_rq_infreq_01",
    type: "INFREQUENCY_CHECK",
    promptTr: "Günde 24 saatin tamamını hiç uyumadan, gözümü kırpmadan ve mola vermeden aralıksız kitap okuyarak geçiririm.",
    promptEn: "I spend all 24 hours of every day reading books non-stop without sleeping, blinking, or taking breaks.",
    expectedResponseValue: 1,
    scoringRule: "EXTREME_DISAGREEMENT_EXPECTED",
    flagThreshold: "VALUE_GREATER_THAN_2"
  },
  {
    itemId: "psi_rq_infreq_02",
    type: "INFREQUENCY_CHECK",
    promptTr: "Hayatım boyunca hiçbir zaman tek bir saniye bile su içmeye veya nefes almaya ihtiyaç duymadım.",
    promptEn: "In my entire life, I have never needed to drink water or breathe for even a single second.",
    expectedResponseValue: 1,
    scoringRule: "EXTREME_DISAGREEMENT_EXPECTED",
    flagThreshold: "VALUE_GREATER_THAN_2"
  },
  {
    itemId: "psi_rq_infreq_03",
    type: "INFREQUENCY_CHECK",
    promptTr: "Dünyadaki bütün dilleri ve lehçeleri ana dilim gibi eksiksiz ve akıcı bir şekilde konuşup yazabilirim.",
    promptEn: "I can speak and write all languages and dialects in the world fluently and flawlessly like my native tongue.",
    expectedResponseValue: 1,
    scoringRule: "EXTREME_DISAGREEMENT_EXPECTED",
    flagThreshold: "VALUE_GREATER_THAN_2"
  },
  {
    itemId: "psi_rq_infreq_04",
    type: "INFREQUENCY_CHECK",
    promptTr: "Her gün yüzlerce kilometre mesafeyi hiç yorulmadan ve durmadan koşarak katederim.",
    promptEn: "Every day, I run hundreds of kilometers continuously without getting tired at all.",
    expectedResponseValue: 1,
    scoringRule: "EXTREME_DISAGREEMENT_EXPECTED",
    flagThreshold: "VALUE_GREATER_THAN_2"
  }
];

module.exports = RESPONSE_QUALITY_ITEMS;
