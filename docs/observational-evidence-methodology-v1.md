# PsycheAI Observational Evidence & Repetition Methodology (V1)
**Phase Reference:** FAZ 2.21  
**Status:** ACTIVE / PRODUCTION-READY  

---

## 1. Dynamic Observational Signal Processing

Unlike static test scores, journal observations are **dynamically evaluated** across the user's active history.

### A. Repetition Operational Rules

| Classification | Rule Threshold | Epistemic Label | Description |
| :--- | :--- | :--- | :--- |
| **Single Report** | 1–2 entries or entries on the same date | `USER_REPORTED_CONTEXT` | A situational observation or snapshot. |
| **Repeated Self-Report** | $\ge 3$ entries across $\ge 2$ distinct calendar dates | `REPEATED_SELF_REPORT` | A recurring theme in a specific context. |
| **Multi-Context Pattern** | $\ge 3$ entries across $\ge 2$ contexts on $\ge 2$ distinct dates | `OBSERVATIONAL_DATA` | A theme that transcends situational boundaries. |

*Note: These thresholds are operational heuristic boundaries designed for software clarity, not validated psychometric norms.*

---

## 2. Contextual Variations vs. Profile Conflicts

When user reflections describe behaviors or feelings that seem different from measured psychometric scores (e.g., highly stressed at work despite low measured baseline anxiety):
- **Prohibited terminology**: *"Profiliniz çelişkili"*, *"Testiniz hatalı"*, *"Kişiliğiniz tutarsız"*.
- **Authoritative terminology**: `CONTEXTUAL_VARIATION` (*"Genel profiliniz ile iş bağlamındaki öz-bildiriminiz arasında bağlamsal farklılaşma görülmektedir."*).

This acknowledges human behavioral flexibility across different environmental contexts without undermining psychometric validity.

---

## 3. Preparation for FAZ 2.22 (Personal Growth Engine)

FAZ 2.21 exports the structural contract:
```typescript
interface GrowthCandidateAreaV1 {
  candidateId: string;
  sourceType: 'JOURNAL_OBSERVATION' | 'PROFILE_TENSION' | 'LONGITUDINAL_VARIATION';
  relatedFacetIds: string[];
  relatedJournalThemes: string[];
  userPriority?: 'LOW' | 'MEDIUM' | 'HIGH';
  repeatEvidenceCount: number;
}
```
This enables downstream development in FAZ 2.22 without prematurely introducing coaching algorithms in this phase.
