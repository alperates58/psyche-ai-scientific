# PsycheAI Unified Psychological Profile V2 (Master Model Adoption)

## 1. Overview & Architectural Purpose
**FAZ 2.17 — Master Model Adoption & Unified Psychological Profile V2** establishes the authoritative Master Psychological Model (**11 Domains, 37 Constructs, 91 Granular Facets, 469 Administered Items across 16 Assessment Modules**) as the sole foundational representation of a user's psychological state.

Previous iterations relied on legacy flat structures and isolated 17-item screening summaries. Profile V2 establishes an epistemically rigorous, multi-tiered measurement hierarchy that strictly differentiates raw psychometric evidence from construct aggregation, profile coverage, and interpretive confidence.

```
       [ DOMAIN LAYER (11) ]  — strictly domainScore = null (no collapsing)
                 ▲
      [ CONSTRUCT LAYER (37) ] — aggregation ONLY when authorized & complete
                 ▲
       [ FACET LAYER (91) ]   — primary measurement layer (1.00–5.00 scale)
                 ▲
      [ ITEM RESPONSES (469) ] — 455 psychological items + 14 telemetry/integrity
```

---

## 2. Core Invariants & Scientific Guardrails

### 2.1 Primary Facet Measurement Layer
- Every measured facet is scored on its native **1.00–5.00 psychometric Likert scale**.
- Facet scores are computed strictly from completed item responses belonging to that facet.
- **Missing Facets Invariant**: When a facet has not been administered or completed, it remains strictly `measurementStatus: 'NOT_MEASURED'` and `score: null`. **Midpoint imputation (e.g. injecting 3.00) is strictly prohibited.**

### 2.2 Construct Aggregation Rules
- Construct aggregation is governed by `CONSTRUCT_AGGREGATION_RULES`.
- Aggregation is authorized only when:
  1. The construct definition explicitly specifies `allowsDirectAggregation: true`.
  2. All constituent facets of that construct have been measured (`measuredFacetCount === totalFacetCount`).
- If aggregation is not authorized (e.g. orthogonal axes like *Locus of Control*, *Attachment Dimensions*, *Schwartz Value Circumplex*, *Dual-Process Thinking Styles*, *PANAS Affective Tone*), `constructScore` remains `null` and `aggregationStatus: 'FACET_PATTERN_ONLY'`.
- If only a subset of facets is measured, `constructScore` remains `null` and `aggregationStatus: 'PARTIAL_CONSTRUCT_PATTERN'`.

### 2.3 Prohibition of Domain-Level Collapsing
- Domains represent thematic groupings of independent psychological constructs.
- Collapsing 8–24 diverse facets into a single global mean domain number obscures critical intra-domain variance.
- Therefore, `domain.domainScore` is strictly `null` across all 11 domains.

### 2.4 Visual Coordinates vs. Normative Percentiles
- Visual coordinates [0–100] are strictly linear rendering projections:
  $$\text{Coordinate} = \text{round}\left(\frac{\text{Score} - 1.0}{4.0} \times 100\right)$$
- Visual coordinates are explicitly **NOT percentiles, population norms, or clinical cutoffs**. All items currently remain `RESEARCH_DRAFT / PRE_CALIBRATION`.

---

## 3. Epistemic Confidence Map V2
Instead of computing a single arbitrary percentage (e.g., "83% Confidence"), Profile V2 evaluates **6 independent epistemic dimensions**:

| Dimension | Possible States | Epistemic Basis |
|---|---|---|
| **Measurement Coverage** | `HIGH`, `MODERATE`, `LOW`, `NONE` | Proportion of 91 master facets administered and scored |
| **Response Quality** | `EXCELLENT`, `ACCEPTABLE`, `QUESTIONABLE`, `COMPROMISED` | Telemetry, response latencies, straightlining, attention checks |
| **Item Completion** | `ADEQUATE`, `PARTIAL`, `UNMEASURED` | Depth of completed items per constituent facet |
| **Repeat Measurement** | `LONGITUDINAL`, `SINGLE_FOLLOWUP`, `NONE` | Availability of multi-epoch historical test-retest data |
| **Method Diversity** | `MULTI_METHOD`, `MULTI_INVENTORY`, `SELF_REPORT_ONLY` | Cross-instrument validation |
| **Calibration Status** | `PRE_CALIBRATION` | Acknowledges ongoing empirical normative sample collection |

---

## 4. Measurement Model Coverage
Profile V2 separates **epistemic confidence** from **pure measurement model coverage**:
- **Domain Coverage**: Measured Domains / 11
- **Construct Coverage**: Measured Constructs / 37
- **Facet Coverage**: Measured Facets / 91
- **Question Coverage**: Answered Items / 469

---

## 5. Deterministic Psychological Dynamics

### 5.1 Cross-Domain Patterns (8 Models)
Deterministic, rule-based co-occurrences that identify emergent cognitive and behavioral styles:
1. `pat_analytical_epistemic_style`: Need for Cognition + Rational Thinking + Inquisitiveness
2. `pat_autonomous_self_direction`: Autonomy Satisfaction + Openness to Change + Authenticity
3. `pat_prudent_self_regulation`: Prudence + General Self-Control + Low Lack of Premeditation
4. `pat_cooperative_relational_style`: Forgivingness + Gentleness + Cooperation Orientation
5. `pat_reflective_meaning_orientation`: Presence of Meaning + Self-Concept Clarity
6. `pat_creative_exploration_mindset`: Joyous Exploration + Creative Self-Efficacy + Growth Mindset
7. `pat_sober_emotional_stability`: Low Anxiety + Low Fearfulness + High Distress Tolerance
8. `pat_ethical_transcendence_core`: Fairness + Sincerity + Self-Transcendence Values

### 5.2 Deterministic Synergies (8 Rules)
Mutually reinforcing psychological strengths with developmental reflection prompts:
- *Self-Efficacy & Persistence*, *Empathy & Perspective Taking*, *Curiosity & Openness*, *Self-Compassion & Resilience*, *Reappraisal & Distress Tolerance*, *Moral Integrity*, *Vitality & Flourishing*, *Growth Mindset & Competence*.

### 5.3 Deterministic Tensions (8 Rules)
Intrapersonal polarities, competing needs, and developmental friction points (strictly non-pathological):
- *Cognitive Closure vs. Openness*, *Empathy vs. Boundary Setting*, *Perfectionism vs. Flexibility*, *Maximizing vs. Decisiveness*, *Attachment Anxiety vs. Emotional Suppression*, *Urgency vs. Volitional Control*, *Meaning Search vs. Meaning Presence*, *Social Boldness vs. Rejection Sensitivity*.

---

## 6. Self-System, Contextual & Longitudinal Views
- **Self-System Views**: Reflects **Actual Self** metrics based on Rosenberg, Neff, Schwarzer, and Campbell scales. **Ideal Self** and **Social Self** remain strictly `null` as they are unmeasured by current self-report batteries.
- **Contextual Views**: Prepared schemas for *Work*, *Relationships*, *Stress*, and *Decision-Making* contexts; strictly `null` until situational vignettes are administered.
- **Longitudinal Readiness**: Evaluates measurement epochs ($N \ge 3$ required for latent trajectory modeling).

---

## 7. Legacy Compatibility Isolation
- Historical 17-item screening responses are preserved exclusively in `legacyCompatibility`.
- Legacy scores are never mixed into or used to calibrate native 91-facet profile scores.

---

## 8. Verification & Test Coverage
- **Scientific Audit**: `npm run audit:unified-profile-v2` verifies all structural, scoring, and epistemic invariants.
- **Unit Tests**: `tests/unit/unified-profile-v2.test.ts` covers all 16 required invariants across 17 test cases with 100% pass rate.
