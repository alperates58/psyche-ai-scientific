# PsycheAI AI Insight Engine V2 — Architecture & Implementation

## 1. Primary Objective & Core Architecture

The **AI Insight Engine V2** transforms structured, deterministic psychological profile evidence into understandable personal insights, cross-domain interpretations, pattern explanations, tension explanations, synergy explanations, reflective observations, practical self-reflection suggestions, profile summaries, and assessment-result narratives—**WITHOUT altering or computing any psychometric scores**.

### Core Data Flow

```
DETERMINISTIC MEASUREMENT (FAZ 2.17)
  ↓
ProfileEvidenceBundleV2
  ↓
Evidence Selection Layer (Minimum Necessary Data Principle)
  ↓
Interpretation Planning Layer (Deterministic InterpretationPlanV2)
  ↓
AI Narrative Generation (DeepSeek V4 Flash / Deterministic Fallback)
  ↓
Grounding / Anti-Hallucination Claim Verification Pass (unsupportedClaims = 0)
  ↓
User-Facing Psychological Insight & Evidence Transparency Drawer
```

AI operates **exclusively at the interpretation layer**, downstream of deterministic scoring.

---

## 2. Hard Invariant: Zero AI Scoring

AI must NEVER receive responsibility for:
- Item scoring
- Reverse scoring
- Facet scoring
- Construct aggregation
- Coverage calculation
- Response quality calculation
- Tension rule activation
- Synergy rule activation
- Pattern rule activation

All psychometric scores are resolved deterministically upstream and sealed in `ProfileEvidenceBundleV2`. Hard invariant tests verify that `facet.score`, `constructScore`, `domainScore`, `coverage`, and `measurementStatus` cannot be mutated by the AI layer.

---

## 3. Evidence Selection Layer & Minimum Necessary Data Principle

To protect user privacy and optimize LLM reasoning, the Evidence Selection Layer (`src/lib/ai/evidence/evidenceSelector.ts`) extracts only the minimum necessary evidence for the requested scope:
- **No Raw Responses**: Raw item responses and item texts are strictly stripped.
- **No Personally Identifying Information**: Name, email, IP, and internal user IDs are excluded.
- **Targeted Scope**: When a user queries a single domain or facet, unrelated dark traits or other domains are omitted.
- **Unmeasured Domain Protection**: If an unmeasured domain is queried, the engine refuses to extrapolate from adjacent traits and clearly states that the domain has not yet been measured.

---

## 4. Deterministic Interpretation Planner (`InterpretationPlanV2`)

Before invoking any language model, a deterministic `InterpretationPlanV2` (`src/lib/ai/planning/interpretationPlanner.ts`) is constructed:
- **Primary Evidence**: Directly measured traits for the target scope.
- **Supporting Evidence**: Compatible traits in related constructs.
- **Counterbalancing Evidence**: Moderating traits that prevent one-dimensional caricatures (e.g., high empathy moderated by high assertiveness/boundary-setting).
- **Active Dynamics**: Deterministically activated tensions and synergies.
- **Allowed Claims & Forbidden Claims**: Strict boundary list enforced during post-generation verification.

---

## 5. Supported Insight Types

1. `PROFILE_OVERVIEW`: Holistic profile summary covering coverage, prominent patterns, counterbalancing traits, active tensions, synergies, and unmeasured areas.
2. `DOMAIN_INTERPRETATION`: Nuanced explanation of a specific psychological domain.
3. `CONSTRUCT_INTERPRETATION`: Construct-level pattern explanation.
4. `FACET_INTERPRETATION`: Dimensional definition, provisional tendency, real-life manifestation, and balancing factors.
5. `ASSESSMENT_RESULT`: Immediate post-assessment narrative contextualizing the module's findings.
6. `CROSS_DOMAIN_PATTERN`: Co-occurrence of traits across independent domains.
7. `TENSION_INTERPRETATION`: "Bir yandan... Diğer yandan..." perspective explaining situational tradeoffs without pathology.
8. `SYNERGY_INTERPRETATION`: Explanation of mutually reinforcing positive psychological tendencies.
9. `REFLECTION_PROMPT`: Practical self-awareness prompts (no clinical treatment advice).
10. `NEXT_EXPLORATION`: Guidance for uncovering unmeasured areas.
11. `LONGITUDINAL_INTERPRETATION`: Guarded; strictly unavailable without repeated measurement epochs.
12. `THEORY_READY_SUMMARY`: Prepares normalized evidence for future theoretical lenses (FAZ 2.19).

---

## 6. DeepSeek V4 Flash Provider Integration

PsycheAI designates **DeepSeek** as the primary external AI provider:
- **Default Model**: `deepseek-v4-flash`
- **Base URL**: `https://api.deepseek.com`
- **Default Temperature**: `0.15`
- **Default Max Tokens**: `4096`
- **Response Format**: Strict JSON object verified by Zod schema (`AIInsightV2Schema`).

---

## 7. Server-Side Secret Storage & Masking

- The DeepSeek API key is encrypted at rest using **AES-256-GCM** in `.secrets/ai-secrets.enc` (strictly non-Git, outside the repository tree, never in `data/system-settings.json`).
- Master encryption keys are derived from `SETTINGS_ENCRYPTION_KEY` or `NEXTAUTH_SECRET`.
- The browser and client JavaScript **NEVER** receive raw API keys. GET endpoints return only `apiKeyConfigured: boolean` and `apiKeyLast4: string`.

---

## 8. Deterministic Fallback Engine

When external AI is disabled, offline, or times out, the `DeterministicFallbackProvider` (`src/lib/ai/providers/fallbackProvider.ts`) generates rich, nuanced Turkish insights directly from the `InterpretationPlanV2`. The profile **never breaks** and remains 100% functional.

---

## 9. Cache Strategy & Snapshot Binding

Insights are cached in `src/lib/ai/cache/insightCache.ts` bound to:
`profileSnapshotId` + `insightType` + `evidenceHash` + `promptVersion` + `engineVersion`.
When a user completes a new assessment or their profile changes, the cache is automatically invalidated.

---

## 10. Theory Lens Ready Export (FAZ 2.19 Preparation)

`TheoryLensEvidenceBundle` (`src/lib/ai/theoryLens/theoryLensAdapter.ts`) exports normalized evidence bundles for future consumption by historical theory lenses (Freud, Jung, Adler, Rogers, Maslow, etc.). In FAZ 2.18, **NO theoretical personas are implemented**.
