# PsycheAI Insight Engine V2 — Grounding and Claim Verification Architecture

## 1. Overview & Core Philosophy

PsycheAI Insight Engine V2 is strictly designed around the **Evidence-Grounded Psychological Interpretation Principle**.
In standard generative AI applications, language models are prone to hallucinating psychological traits, giving flattering Barnum/Forer-style cold readings, or overreaching into clinical diagnostic territory.

In PsycheAI Scientific:
- **Scoring is 100% Deterministic**: Psychometric calculations, norm mappings, standard errors, confidence intervals, and profile aggregation are executed solely by deterministic TypeScript math modules (`ProfileEvidenceBundleV2`).
- **AI Never Calculates or Imputes Scores**: The AI engine receives only curated, pre-computed evidence snapshots. It cannot alter scores, fill missing facets, or invent unmeasured dimensions.
- **Strict Grounding & Verification**: All generated text is passed through an automated verification pipeline (`ClaimVerifier`) that cross-checks psychological claims against the deterministic evidence bundle before displaying results to the user.

---

## 2. Claim Strength Hierarchy

Every psychological assertion synthesized by the engine is classified into one of three claim strength levels based on psychometric evidence depth:

| Claim Strength | Required Evidence Depth | Score Quality / Facet Status | Narrative Phrasing Guideline |
| :--- | :--- | :--- | :--- |
| **`ROBUST`** | Multiple high-reliability facets ($\ge 2$), consistent across modules, low SEM | Fully measured, calibrated, $N \ge 8$ items | Confident, well-grounded behavioral synthesis ("Ölçümlenen profilinde X ve Y boyutları güçlü bir eğilim sergilemektedir...") |
| **`SUPPORTED`** | Single validated facet or moderate item count ($4 \le N < 8$) | Standard reliability, consistent response pattern | Descriptive, contextualized interpretation ("X boyutu bağlamında belirgin bir yönelim gözlemlenmektedir...") |
| **`TENTATIVE`** | Preliminary facet, low item count, or high item variance | Exploratory / Initial calibration | Hedged, hypothesis-oriented framing ("Mevcut ilk veriler doğrultusunda X eğilimi görülebilir; bu durum bağlamsal faktörlerle şekillenebilir...") |

---

## 3. Prohibited Claim Classes (Strictly Enforced)

The engine rejects or redacts outputs containing any of the following 5 prohibited claim classes:

1. **Clinical Diagnoses & Pathologizing Language**:
   - Prohibited terms: *depresyon teşhisi, anksiyete bozukluğu, bipolar, narsisistik kişilik bozukluğu, klinik düzeyde, patolojik, tedavi gerektirir*.
   - Acceptable equivalent: Constructive, non-diagnostic dimensional descriptions (e.g., *duygusal dalgalanmalara yatkınlık, stres tepkiselliği*).

2. **Uncalibrated Norm & Percentile Claims**:
   - Prohibited patterns: Claiming normative rank (e.g., *toplumun %95'inden daha yüksek, Türkiye ortalamasının 2 katı*) during pre-calibration or when population calibration data is unavailable.
   - Acceptable equivalent: Categorical and dimensional levels (*yüksek, ortalama, odaklanmış gelişim alanı*).

3. **Unmeasured Facet Imputation**:
   - The engine explicitly detects unmeasured facets (`isMeasured === false`) in the profile. Any attempt to describe unmeasured constructs as measured facts is flagged as a hallucination.

4. **False Longitudinal Assertions**:
   - Prohibited patterns: Asserting historical trend changes (e.g., *geçen yıla göre empati düzeyiniz %30 arttı*) on cross-sectional, single-session snapshots.

5. **Unsupported Causal & Deterministic Extrapolations**:
   - Prohibited patterns: Asserting absolute behavioral causation (e.g., *bu skor yüzünden kesinlikle ilişkilerinizde başarısız olacaksınız*).
   - Acceptable equivalent: Probabilistic, interactional framing with counterbalancing evidence.

---

## 4. Anti-Hallucination & Anti-Barnum Verification Pipeline

The `claimVerifier.ts` module performs multi-stage post-generation validation:

1. **Lexical Regex & Semantic Safety Scan**: Scans Turkish and English terminology for diagnostic, causal, and normative violations.
2. **Facet Mention & Hallucination Cross-Check**: Identifies psychological trait mentions in the narrative and checks if they correspond to measured dimensions in `ProfileEvidenceBundleV2`.
3. **Barnum / Forer Effect Filtration**: Rejects vague, universal flattery (e.g., *bazen dışa dönük bazen içe dönük birisiniz*) by requiring specific facet score references and tension/counterbalance points.
4. **Contradiction Detection**: Flags conflicting statements between primary evidence and counterbalancing facets.
5. **Zero-Tolerance Enforcement**: If `unsupportedClaims > 0`, the engine automatically intercepts the output and replaces it with the deterministic rule-based interpretation fallback (`FallbackAIProvider`).

---

## 5. User-Facing Evidence Transparency ("Bu yorum neye dayanıyor?")

Transparency is a core user right in PsycheAI. Every AI insight card is accompanied by an interactive **Evidence Provenance Drawer** (`EvidenceProvenanceDrawer.tsx`).

### What Users See:
- **Directly Measured Dimensions**: Facets, normalized scores (1-100), item count, reliability index.
- **Source Modules**: Scientific assessment tools that generated the data (e.g., PsycheAI Native Big Five, Work Style Inventory).
- **Supporting Evidence & Nuance**: Specific behavioral indicators and counterbalancing dimensions.
- **Psychometric Limitations**: Assessment confidence intervals, coverage completeness, and pre-calibration notices.

### What is Kept Internal (Security & IP Protection):
- Raw system prompt templates and few-shot calibration guides.
- Internal database IDs, raw vector embeddings, and LLM API keys.

---

## 6. Deterministic Fallback & Graceful Degradation

If the external LLM provider (DeepSeek V4 Flash) is:
- Disabled in Admin settings (`aiEnabled === false`),
- Missing API credentials,
- Experiencing network timeout or rate limits,
- Failing claim verification checks,

The system seamlessly switches to `FallbackAIProvider`. The fallback engine uses deterministic rule-based templates to generate scientifically sound, grounded Turkish psychological narratives directly from `ProfileEvidenceBundleV2`. Users never experience broken layouts or empty cards.
