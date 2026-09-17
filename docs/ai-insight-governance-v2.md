# PsycheAI AI Insight Governance V2 — Scientific Control & Security

## 1. Centralized Governance Object (`AIInsightGovernanceV2`)

PsycheAI establishes inviolable governance defaults for all AI operations:

```typescript
export interface AIInsightGovernanceV2 {
  allowExternalProvider: boolean; // default: false
  requireConsent: boolean; // default: true
  allowRawResponses: false; // strictly locked
  allowClinicalDiagnosis: false; // strictly locked
  allowScoreCalculation: false; // strictly locked
  allowMissingTraitInference: false; // strictly locked
  allowLongitudinalClaimsWithoutRepeat: false; // strictly locked
  allowNormativeClaims: false; // strictly locked
}
```

---

## 2. Inviolable Governance Boundaries

| Boundary | Rule | Enforcement Mechanism |
|---|---|---|
| **Zero Psychometric Scoring** | AI cannot score items, reverse score, aggregate facets, or calculate coverage | Upstream deterministic pipeline only |
| **No Raw Answer Transmission** | Raw item responses and item prompts are never sent to external LLMs | Evidence Selection Layer filter |
| **No Clinical Diagnoses** | AI cannot generate disease labels (depression, ADHD, bipolar, autism, borderline) | Anti-Hallucination Claim Verifier |
| **No Pre-Calibration Norms** | AI cannot claim population rankings or percentiles (e.g. "%80'inden yüksek") | Anti-Percentile Pattern Regex Filter |
| **No False Longitudinal Trajectories**| AI cannot claim trait change without repeated measurements | Longitudinal Guard |
| **No Categorical Labeling** | AI cannot apply identity labels ("introvert", "narcissist", "toxic") | Prompt Governance + Tendency Language Directive |
| **No Speculative Causality** | AI cannot assert definitive causes ("çocukluğunuzdan kaynaklanıyor") | Anti-Causal Verification Filter |

---

## 3. Configuration Resolution Hierarchy

The single source of truth for AI configuration (`src/lib/ai/config/aiConfigResolver.ts`) resolves settings in the following strict priority:

1. **Persistent Admin Settings & AES-256 Secret Store**:
   - Non-secrets stored in `data/system-settings.json`
   - API key encrypted at rest in `.secrets/ai-secrets.enc`
2. **Environment Variables (Fallback)**:
   - `DEEPSEEK_API_KEY`, `DEEPSEEK_BASE_URL`, `DEEPSEEK_MODEL_ID`
3. **Safe Disabled Default**:
   - External AI remains inactive until explicitly enabled by an authorized Admin.

---

## 4. Admin Control Plane (`/admin/ai-config`)

Authorized Administrators manage AI configuration under:
`PLATFORM & ALTYAPI → Yapay Zekâ Konfigürasyonu`

Available Controls:
- **AI Engine Toggle**: ON / OFF
- **Provider & Model**: DeepSeek (`deepseek-v4-flash`)
- **API Key**: Input with masked display (`••••••••abcd`)
- **Temperature**: Default `0.15`
- **Max Output Tokens**: Default `4096`
- **Request Timeout**: Configurable in milliseconds
- **Consent Enforcement Toggle**: ON / OFF
- **Deterministic Fallback Toggle**: ON / OFF
- **Connection Test Action**: `POST /chat/completions` non-intrusive ping measuring latency and HTTP status without exposing the API key.

---

## 5. Automated Governance Audit

Run the audit suite to verify all governance invariants:

```bash
npm run audit:ai-insight-v2
```
