# PsycheAI Journal AI Governance & Anti-Hallucination Guardrails (V1)
**Phase Reference:** FAZ 2.21  
**Status:** ACTIVE / PRODUCTION-READY  

---

## 1. Zero AI Psychometric Authority

AI models (including DeepSeek V4 Flash) have **zero authority** to:
1. Calculate, modify, or estimate psychometric scores.
2. Determine clinical conditions, pathologies, or psychiatric diagnoses.
3. Simulate psychotherapeutic interventions (e.g., *"travmanızı işleyeceğiz"*, *"terapi seansı"*).
4. Assert ungrounded causal links (e.g., *"İş stresiniz yüzünden kişiliğiniz değişti"*).

---

## 2. Prohibited Terms and Claims

The post-generation [`claimVerifier.ts`](file:///c:/Users/alper.ates.LIDER/Desktop/psyche-ai-scientific/src/lib/ai/verification/claimVerifier.ts) engine automatically intercepts and rejects reflections containing:

| Prohibited Pattern | Reason | Action |
| :--- | :--- | :--- |
| `depresyon`, `bipolar`, `şizofreni`, `dehb`, `okb`, `otizm` | Clinical diagnostic claims prohibited | Rejects claim, engages deterministic fallback |
| `sen kesinlikle...`, `bu senin gerçek kişiliğin...` | Fake authoritative certainty | Rejects claim, enforces tentative tone |
| `çocukluk travmanız...`, `travmanızın sonucu...` | Speculative trauma induction | Rejects claim |
| `terapi seansı`, `terapötik müdahale` | Unlicensed therapy simulation | Rejects claim |
| `%95 ihtimalle...`, `yüzdelik diliminiz...` | Fake statistical certainty | Rejects claim |

---

## 3. Scoped Privacy & Anonymization Protocol

When sending journal text to the external LLM provider:
- **Stripped Metadata**: User ID, email, name, IP address, device telemetry, raw assessment answers, unrelated entries.
- **Payload Contents**: Only the current entry text, context tags, subjective ratings, and relevant measured facet names and scores needed for grounding.

---

## 4. Erasure & Compliance Architecture

- Database cascading (`ON DELETE CASCADE`) supports application-level erasure.
- Full regulatory compliance (GDPR/KVKK) also involves backup retention policies, server log rotations, and external AI provider zero-data-retention agreements.
