# PsycheAI Native Scientific Research Battery (v1.0.0)
**FAZ 2.16.1 — Evidence-Grounded Psychological Measurement Battery & Specification**

---

## 1. Executive Summary & Architecture Overview

The **PsycheAI Native Scientific Research Battery (v1.0.0)** is an evidence-grounded, original Turkish psychological measurement battery designed to provide 100% operational coverage of the **PsycheAI Master Psychological Model (FAZ 2.14)** across all 11 psychological domains, 37 active constructs, and 91 master facets.

Unlike legacy collections of fragmented, copyrighted, or uncalibrated questionnaires, every item in this battery has been authored using the **PsycheAI Construct-Derived Item Authoring Methodology**. All items reflect original Turkish phrasing derived directly from granular behavioral indicators, cognitive manifestations, and affective markers established in foundational peer-reviewed literature.

```
+---------------------------------------------------------------------------------------------------+
|                            PSYCHEAI NATIVE RESEARCH BATTERY (v1.0.0)                              |
+---------------------------------------------------------------------------------------------------+
|  11 Psychological Domains  |  37 Active Constructs  |  91 Master Facets  |  469 Total Bank Items  |
+---------------------------------------------------------------------------------------------------+
|  455 Original Psychological Items (5 items / facet) | 14 Response Quality & Validity Items        |
|  112 Verified Scientific Literature Sources         | 13 Dynamic Assessment Modules               |
|  Deterministic Unweighted Mean Scoring Engine       | Research Reserve Pool (832 Legacy Items)   |
+---------------------------------------------------------------------------------------------------+
```

### Key Measurement Metrics
- **Total Master Facets**: 91 facets (100% covered)
- **Psychological Items**: 455 original items (5 items per facet)
- **Response Quality Items**: 14 items (4 attention checks, 6 paired consistency items, 4 infrequency checks)
- **Total Administered Bank**: 469 items
- **Scientific Literature Base**: 112 peer-reviewed sources (primary foundational papers, scale development studies, and Turkish psychometric adaptations)
- **Scoring Engine**: `PRE_CALIBRATION_MEAN_V1` (strictly deterministic unweighted facet arithmetic mean, 1.00–5.00 bounds)
- **Measurement Status**: `PRE_CALIBRATION` / `RESEARCH_DRAFT` (Strict non-clinical, non-normative research status with mandatory scientific disclaimers)

---

## 2. Complete Domain & Facet Blueprint Architecture

The battery systematically covers all 11 domains established in the PsycheAI Master Psychological Model:

### Domain 1: Core Personality Dimensions (HEXACO & Lexical) — 24 Facets (120 Items)
Based on Ashton & Lee (2007), Lee & Ashton (2004), Goldberg (1999), and Wasti et al. (2008):
- **Honesty-Humility (4 Facets, 20 Items)**:
  - `sincerity` (İçtenlik) — *5 items (1 reverse)*
  - `fairness` (Adillik) — *5 items (2 reverse)*
  - `greed_avoidance` (Açgözlülükten Kaçınma) — *5 items (2 reverse)*
  - `modesty` (Alçakgönüllülük) — *5 items (2 reverse)*
- **Emotionality (4 Facets, 20 Items)**:
  - `fearfulness` (Korkuya Yatkınlık) — *5 items (2 reverse)*
  - `anxiety` (Kaygıya Yatkınlık) — *5 items (2 reverse)*
  - `dependence` (Bağlılık ve Destek Arayışı) — *5 items (2 reverse)*
  - `sentimentality` (Duygusallık ve İçsel Duyarlık) — *5 items (1 reverse)*
- **Extraversion (4 Facets, 20 Items)**:
  - `social_self_esteem` (Sosyal Öz-Saygı) — *5 items (2 reverse)*
  - `social_boldness` (Sosyal Cesaret ve Girişkenlik) — *5 items (2 reverse)*
  - `sociability` (Sosyallik ve İnsan Sevgisi) — *5 items (2 reverse)*
  - `liveliness` (Yaşam Sevinci ve Coşku) — *5 items (2 reverse)*
- **Agreeableness (4 Facets, 20 Items)**:
  - `forgivingness` (Bağışlayıcılık ve Hoşgörü) — *5 items (2 reverse)*
  - `gentleness` (Nezaket ve Yumuşak Başlılık) — *5 items (2 reverse)*
  - `flexibility` (Esneklik ve Uzlaşmacılık) — *5 items (2 reverse)*
  - `patience` (Sabır ve Sakinlik) — *5 items (2 reverse)*
- **Conscientiousness (4 Facets, 20 Items)**:
  - `organization` (Düzenlilik ve Metodoloji) — *5 items (2 reverse)*
  - `diligence` (Çalışkanlık ve Gayret) — *5 items (2 reverse)*
  - `perfectionism` (Mükemmeliyetçilik ve Özen) — *5 items (2 reverse)*
  - `prudence` (İtina, Tedbirlilik ve Sağduyu) — *5 items (2 reverse)*
- **Openness to Experience (4 Facets, 20 Items)**:
  - `aesthetic_appreciation` (Estetik Takdir ve Sanatsal Duyarlık) — *5 items (2 reverse)*
  - `inquisitiveness` (Entelektüel Merak ve Bilgi İsteği) — *5 items (2 reverse)*
  - `creativity` (Yaratıcılık ve Özgünlük) — *5 items (2 reverse)*
  - `unconventionality` (Kalıp Dışılık ve Özgür Düşünce) — *5 items (2 reverse)*

---

### Domain 2: Self-System & Identity Structure — 8 Facets (40 Items)
Based on Rosenberg (1965), Bandura (2006), Wood et al. (2008), Kernis (2003), and Linville (1987):
- `core_self_esteem` (Temel Benlik Saygısı) — *5 items (2 reverse)*
- `generalized_self_efficacy` (Genellenmiş Öz-Yeterlik) — *5 items (2 reverse)*
- `authenticity` (Otantiklik ve İçsel Bütünlük) — *5 items (2 reverse)*
- `self_esteem_stability` (Öz-Saygı Kararlılığı) — *5 items (2 reverse)*
- `self_concept_clarity` (Benlik Kavramı Belirginliği) — *5 items (2 reverse)*
- `self_complexity` (Benlik Karmaşıklığı ve Rol Çeşitliliği) — *5 items (1 reverse)*
- `self_continuity` (Zamansal Benlik Sürekliliği) — *5 items (1 reverse)*
- `self_compassion` (Öz-Şefkat ve Kendini Anlayışla Karşılama) — *5 items (2 reverse)*

---

### Domain 3: Emotion, Affect & Regulation — 9 Facets (45 Items)
Based on Gross & John (2003), Watson et al. (1988), Salovey & Mayer (1995), and Mehling et al. (2012):
- `cognitive_reappraisal` (Bilişsel Yeniden Çerçeveleme) — *5 items (1 reverse)*
- `expressive_suppression` (Duygusal Dışavurumu Bastırma) — *5 items (2 reverse)*
- `acceptance_mindfulness` (Duygusal Kabul ve Farkındalık) — *5 items (2 reverse)*
- `rumination_brooding` (Kara Kara Düşünme / Gelecek Kaygısı) — *5 items (2 reverse)*
- `positive_affectivity` (Olumlu Duygulanım Eğilimi) — *5 items (2 reverse)*
- `negative_affectivity` (Olumsuz Duygulanım Eğilimi) — *5 items (2 reverse)*
- `emotional_awareness_clarity` (Duygu Farkındalığı ve Berraklığı) — *5 items (2 reverse)*
- `interoceptive_awareness` (Bedensel/İçsel Farkındalık) — *5 items (2 reverse)*
- `emotional_reactivity` (Duygusal Tepkisellik ve Hassasiyet) — *5 items (2 reverse)*

---

### Domain 4: Cognition, Decision & Epistemic Style — 9 Facets (45 Items)
Based on Cacioppo & Petty (1982), Webster & Kruglanski (1994), Stanovich & West (2000), and Baron (1995):
- `need_for_cognition` (Bilişsel Çaba İhtiyacı) — *5 items (2 reverse)*
- `need_for_cognitive_closure` (Bilişsel Kapanma İhtiyacı) — *5 items (2 reverse)*
- `intellectual_humility` (Entelektüel Alçakgönüllülük) — *5 items (2 reverse)*
- `intolerance_of_uncertainty` (Belirsizliğe Tahammülsüzlük) — *5 items (2 reverse)*
- `actively_open_minded_thinking` (Açık Fikirli Düşünme) — *5 items (2 reverse)*
- `analytical_rational_style` (Analitik / Rasyonel Karar Verme) — *5 items (2 reverse)*
- `intuitive_heuristic_style` (Sezgisel Karar Verme) — *5 items (2 reverse)*
- `maximizing_decision_style` (Maksimize Etme Eğilimi) — *5 items (2 reverse)*
- `regret_proneness` (Karar Sonrası Pişmanlık Duyarlılığı) — *5 items (2 reverse)*

---

### Domain 5: Self-Regulation, Volition & Impulsivity — 8 Facets (40 Items)
Based on Tangney et al. (2004), Whiteside & Lynam (2001), Duckworth et al. (2007), and Kuhl (1994):
- `trait_self_control` (Öz-Kontrol Kapasitesi) — *5 items (2 reverse)*
- `action_orientation_decision` (Eylem Odaklılık) — *5 items (2 reverse)*
- `perseverance_grit` (Azim ve Sebat / Grit) — *5 items (2 reverse)*
- `habitual_consistency` (Alışkanlık Tutarlılığı) — *5 items (2 reverse)*
- `negative_urgency` (Olumsuz Aciliyet / Dürtüsellik) — *5 items (2 reverse)*
- `positive_urgency` (Olumlu Aciliyet) — *5 items (2 reverse)*
- `lack_of_premeditation` (Düşüncesizce / Plansızca Hareket Etme) — *5 items (2 reverse)*
- `sensation_seeking` (Heyecan ve Macera Arayışı) — *5 items (2 reverse)*

---

### Domain 6: Motivation, Needs & Universal Values — 9 Facets (45 Items)
Based on Deci & Ryan (2000), Chen et al. (2015), Schwartz (1992, 2012), and McClelland (1985):
- `autonomy_need_satisfaction` (Özerklik İhtiyacı Doyumu) — *5 items (2 reverse)*
- `competence_need_satisfaction` (Yetkinlik İhtiyacı Doyumu) — *5 items (2 reverse)*
- `relatedness_need_satisfaction` (İlişkisellik ve Bağlanma İhtiyacı Doyumu) — *5 items (2 reverse)*
- `self_transcendence_values` (Aşkın Değerler: Evrensellik ve İyilikseverlik) — *5 items (2 reverse)*
- `self_enhancement_values` (Güç ve Başarı Değerleri) — *5 items (2 reverse)*
- `openness_to_change_values` (Değişime Açıklık Değerleri) — *5 items (2 reverse)*
- `conservation_values` (Muhafaza ve Güvenlik Değerleri) — *5 items (2 reverse)*
- `achievement_motivation` (Başarı Motivasyonu) — *5 items (2 reverse)*
- `hope_for_success` (Başarı Umudu ve Yaklaşma Motivasyonu) — *5 items (2 reverse)*

---

### Domain 7: Social & Relational Dynamics — 9 Facets (45 Items)
Based on Fraley et al. (2000), Davis (1983), Alberti & Emmons (2017), Lee & Robbins (1995), and Downey & Feldman (1996):
- `attachment_anxiety` (Bağlanma Kaygısı) — *5 items (2 reverse)*
- `attachment_avoidance` (Bağlanma Kaçınması) — *5 items (2 reverse)*
- `cognitive_perspective_taking` (Bilişsel Perspektif Alma) — *5 items (2 reverse)*
- `empathic_concern` (Empatik İlgi ve Şefkat) — *5 items (2 reverse)*
- `assertiveness` (Girişkenlik ve Kendini İfade Etme) — *5 items (2 reverse)*
- `social_connectedness` (Sosyal Bağlılık ve Aidiyet) — *5 items (2 reverse)*
- `rejection_sensitivity_nonclinical` (Reddedilme Hassasiyeti - Subklinik) — *5 items (2 reverse)*
- `cooperation_orientation` (İş Birliği ve Ortak Fayda Yönelimi) — *5 items (2 reverse)*
- `conflict_avoidance` (Çatışma Kaçınması ve Uyum Sağlama) — *5 items (2 reverse)*

---

### Domain 8: Wellbeing, Flourishing & Vitality — 3 Facets (15 Items)
Based on Diener et al. (2010), Ryan & Frederick (1997), and Diener et al. (1985):
- `flourishing_scale` (Psikolojik Gelişme ve Çiçeklenme / Flourishing) — *5 items (2 reverse)*
- `subjective_vitality` (Öznel Canlılık ve Enerji) — *5 items (2 reverse)*
- `satisfaction_with_life` (Yaşam Doyumu) — *5 items (2 reverse)*

---

### Domain 9: Coping, Adaptation & Psychological Resilience — 4 Facets (20 Items)
Based on Block & Kremen (1996), Smith et al. (2008), and Carver et al. (1989):
- `ego_resilience` (Ego Dayanıklılığı ve Esnek Uyum) — *5 items (2 reverse)*
- `stress_recovery` (Stresten Toparlanma Hızı / Bounce-Back) — *5 items (2 reverse)*
- `problem_focused_coping` (Problem Odaklı Başa Çıkma) — *5 items (2 reverse)*
- `emotion_focused_coping` (Duygu Odaklı Başa Çıkma ve Anlamlandırma) — *5 items (2 reverse)*

---

### Domain 10: Creativity, Curiosity & Intellectual Openness — 4 Facets (20 Items)
Based on Kashdan et al. (2018), Tierney & Farmer (2002), and Dweck (2006):
- `joyous_exploration_curiosity` (Neşeli Keşif Merakı) — *5 items (2 reverse)*
- `deprivation_sensitivity_curiosity` (Yoksunluk Duyarlılığı Merakı) — *5 items (2 reverse)*
- `creative_self_efficacy` (Yaratıcı Öz-Yeterlik) — *5 items (2 reverse)*
- `growth_mindset_intelligence` (Gelişim Zihniyeti / Growth Mindset) — *5 items (2 reverse)*

---

### Domain 11: Optional / Research-Only Dark Tetrad (Subclinical) — 4 Facets (20 Items)
Based on Paulhus & Williams (2002), Buckels et al. (2013), and Özsoy et al. (2017):
- `machiavellianism` (Makyavelizm / Stratejik Manipülasyon) — *5 items (2 reverse)*
- `grandiose_narcissism` (Büyüklenmeci Narsisizm - Subklinik) — *5 items (2 reverse)*
- `psychopathy` (Subklinik Psikopati / Duygusal Soğukluk ve Dürtüsellik) — *5 items (2 reverse)*
- `everyday_sadism_subclinical` (Gündelik Sadizm - Subklinik) — *5 items (2 reverse)*

---

## 3. Response Quality & Validity Subsystem (14 Items)

To ensure high data integrity, detect straightlining, inattention, acquiescence bias, and random responding, 14 specialized quality assurance items are integrated into assessment sessions:

### 1. Attention Checks (Directed Response) — 4 Items
Direct instructions requiring specific option selection:
- `psi_rq_attn_01`: "Bu madde dikkatinizi ölçmek amacıyla yerleştirilmiştir; lütfen bu ifade için 'Kesinlikle Katılıyorum' seçeneğini işaretleyiniz." (Expected: 5)
- `psi_rq_attn_02`: "Lütfen bu soruyu yanıtlarken doğrudan 'Kesinlikle Katılmıyorum' seçeneğini işaretleyiniz." (Expected: 1)
- `psi_rq_attn_03`: "Araştırma kalitesi kontrolü için bu ifadede lütfen 'Nötr / Kararsızım' seçeneğini tercih ediniz." (Expected: 3)
- `psi_rq_attn_04`: "Veri güvenilirliği doğrulaması: Lütfen bu maddede yalnızca 'Katılıyorum' seçeneğini işaretleyiniz." (Expected: 4)

### 2. Paired Consistency Checks — 6 Items (3 Antonym Pairs)
Items measuring diametrically opposed psychological states embedded across distant sequence points:
- **Pair 1 (Calmness vs Restlessness)**:
  - `psi_rq_pair_01a`: "Genel olarak kendimi çoğu zaman sakin, huzurlu ve kaygısız hissederim."
  - `psi_rq_pair_01b`: "Genel olarak kendimi çoğu zaman son derece gergin, huzursuz ve kaygılı hissederim."
- **Pair 2 (Sociability Seeking vs Avoidance)**:
  - `psi_rq_pair_02a`: "İnsanlarla bir arada vakit geçirmek bana yüksek enerji verir ve beni mutlu eder."
  - `psi_rq_pair_02b`: "İnsanlarla bir arada bulunmaktan hiç hoşlanmam ve sosyal ortamlardan tamamen uzak dururum."
- **Pair 3 (Task Completion vs Abandonment)**:
  - `psi_rq_pair_03a`: "Başladığım bir işi veya projeyi ne olursa olsun sonuna kadar bitirmeye odaklanırım."
  - `psi_rq_pair_03b`: "Başladığım işleri genellikle yarıda bırakır, sonunu hiçbir zaman getiremem."

### 3. Infrequency / Improbable Items — 4 Items
Statistically near-zero probability statements to detect random clicking and non-attentive answering:
- `psi_rq_infreq_01`: "Günde 24 saatin tamamını hiç uyumadan, gözümü kırpmadan ve mola vermeden aralıksız kitap okuyarak geçiririm."
- `psi_rq_infreq_02`: "Hayatım boyunca hiçbir zaman tek bir saniye bile su içmeye veya nefes almaya ihtiyaç duymadım."
- `psi_rq_infreq_03`: "Dünyadaki bütün dilleri ve lehçeleri ana dilim gibi eksiksiz ve akıcı bir şekilde konuşup yazabilirim."
- `psi_rq_infreq_04`: "Her gün yüzlerce kilometre mesafeyi hiç yorulmadan ve durmadan koşarak katederim."

### Validity Protocol Rules
- **0 Flags**: `VALID_PROTOCOL` — High confidence data protocol.
- **1 Flag**: `CAUTION_PROTOCOL` — Advisory warning attached to profile report; confidence metrics slightly reduced.
- **>= 2 Flags**: `INVALID_PROTOCOL` — Profile synthesis withheld or marked uncalibrated; user prompted to retake session.

---

## 4. Deterministic Scoring & Aggregation Engine

```
                                    +-----------------------+
                                    | Raw Item Responses    |
                                    | (1 to 5 Likert Scale) |
                                    +-----------+-----------+
                                                |
                                                v
                               +---------------------------------+
                               | Item Direction Inversion:       |
                               | If reverseKeyed: 6 - RawScore   |
                               | Else: RawScore                  |
                               +----------------+----------------+
                                                |
                                                v
                               +---------------------------------+
                               | Facet Score Arithmetic Mean:    |
                               | Mean(5 Transformed Item Scores) |
                               | Range: [1.00, 5.00]             |
                               +----------------+----------------+
                                                |
                                                v
                               +---------------------------------+
                               | Pre-Calibration Facet Score     |
                               | (No fake percentiles/cutoffs)   |
                               +---------------------------------+
```

### Purely Deterministic Scoring Rules
1. **No AI Scoring**: AI models NEVER compute scores. All math is performed by pure TypeScript deterministic arithmetic functions.
2. **Standard Scale**: 5-point Likert scale (1 = Strongly Disagree to 5 = Strongly Agree).
3. **Reverse Scoring**: $S_{\text{reversed}} = 6 - S_{\text{raw}}$.
4. **Facet Score Calculation**:
   $$\text{Facet Score} = \frac{\sum_{i \in \text{Pos}} S_i + \sum_{j \in \text{Rev}} (6 - S_j)}{5}$$
5. **No Fabricated Population Norms**: All results are explicitly reported as raw arithmetic sample means with mandatory disclaimer:
   > **Ön Kalibrasyon Ölçümü**: *Bu skor bireyin göreli eğilimini temsil eden araştırma düzeyinde aritmetik ortalamadır. Klinik teşhis veya psikiyatrik tanı amacı taşımaz. Norm çalışmaları sürmektedir.*

---

## 5. Assessment Journey & Module Mapping

The battery is deployed across 13 modular assessments structured into progressive journey stages:

| Stage | Module ID | Title (TR) | Facets | Total Items | Duration |
|---|---|---|---|---|---|
| **STAGE 1: ONBOARDING** | `mod_core_hexaco_60` | Temel Kişilik Yapısı (HEXACO) | 24 | 124 | ~18 min |
| | `mod_self_agency` | Benlik Sistemi, Öz-Saygı ve Fail Olma | 8 | 42 | ~8 min |
| | `mod_emotion_regulation` | Duygu Düzenleme ve Beden Farkındalığı | 9 | 46 | ~9 min |
| | `mod_cognitive_epistemic` | Bilişsel Tarz ve Karar Verme | 9 | 47 | ~9 min |
| **STAGE 2: EXPANSION** | `mod_volition_impulse` | Öz-Düzenleme ve Dürtüsellik | 8 | 43 | ~8 min |
| | `mod_basic_needs_sdt` | Temel Psikolojik İhtiyaçlar | 3 | 15 | ~4 min |
| | `mod_universal_values` | Evrensel İnsani Değerler | 6 | 31 | ~6 min |
| **STAGE 3: DEEP DIVES** | `mod_adult_attachment` | Yetişkin Bağlanma Stilleri | 2 | 10 | ~3 min |
| | `mod_interpersonal_dynamics` | Kişilerarası Yetkinlik ve Sosyal Dinamikler | 7 | 35 | ~7 min |
| | `mod_wellbeing_vitality` | İyilik Hali, Gelişme ve Yaşam Canlılığı | 3 | 15 | ~3 min |
| | `mod_coping_resilience` | Başa Çıkma ve Psikolojik Dayanıklılık | 4 | 20 | ~4 min |
| | `mod_creativity_curiosity` | Yaratıcılık, Merak ve Gelişim Zihniyeti | 4 | 20 | ~4 min |
| **STAGE 4: RESEARCH OPTIONAL** | `mod_optional_dark_tetrad` | Subklinik Karanlık Dörtlü (Opsiyonel) | 4 | 21 | ~4 min |
| **TOTALS** | **13 Modules** | **Full Master Coverage** | **91 Facets** | **469 Items** | **~87 min** |

---

## 6. Legacy Master Item Bank (832 Items) Audit & Preservation

All 832 legacy research items in `data/master-item-bank.json` have been audited in `data/research-battery/existing-bank-review-v1.json`.
- **Isolation Status**: `CONTENT_PENDING_PROVENANCE` (preserved as a post-calibration reserve research pool; not used in native forms without individual empirical validation).
- **Native Battery Independence**: All active PsycheAI assessment modules run strictly on the 469 verified PsycheAI-native authored items.

---

## 7. Verification & Audit Trail

The entire battery is validated through automated CI/CD audits:
- `npm run audit:research-battery` -> 100% compliant across blueprints, item bank, modules, scoring, and coverage.
- `npm run audit:research-sources` -> 100% verified against 112 peer-reviewed sources.
