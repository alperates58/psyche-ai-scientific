/**
 * PsycheAI Deterministic Interpretation Planner V2
 *
 * Builds a deterministic InterpretationPlanV2 before any AI narrative generation.
 * Enforces:
 * - Deterministic identification of primary, supporting, and counterbalancing evidence.
 * - Multi-evidence balance (no one-dimensional personality caricatures).
 * - Explicit allowed claims and forbidden claims list.
 * - Longitudinal guards: prohibits change/trajectory claims when repeated measurements do not exist.
 * - Coverage-aware guards: returns clean unmeasured guidance when target domain is not measured.
 */

import { ProfileEvidenceBundleV2, GroundedEvidenceEntry } from '@/lib/profile/profileEvidenceBundle';
import {
  InterpretationPlanV2,
  InsightType,
  ClaimStrength,
} from '@/types/aiInsightV2';
import {
  EvidenceSelectionRequest,
  selectEvidenceForInterpretation,
} from '@/lib/ai/evidence/evidenceSelector';

// Counterbalancing Trait Rules Registry (Nuanced Psychological Balance)
interface CounterbalanceRule {
  primaryFacetCode: string;
  balancingFacetCode: string;
  moderatingRationaleTr: string;
}

const COUNTERBALANCE_RULES: CounterbalanceRule[] = [
  {
    primaryFacetCode: 'empathic_concern',
    balancingFacetCode: 'assertiveness',
    moderatingRationaleTr: 'Yüksek empati ve başkalarını önemseme duyarlılığı, hak arama ve sınır koyma (assertiveness) eğilimiyle dengelenerek öz-fedakarlık yerine bilinçli ve korunaklı bir yakınlık oluşturur.',
  },
  {
    primaryFacetCode: 'cognitive_perspective_taking',
    balancingFacetCode: 'assertiveness',
    moderatingRationaleTr: 'Başkalarının bakış açısını anlama yetisi, sınır koyma ile birlikte kendi ihtiyaçlarını koruyarak sürdürülür.',
  },
  {
    primaryFacetCode: 'generalized_self_efficacy',
    balancingFacetCode: 'self_compassion',
    moderatingRationaleTr: 'Yüksek başarı inancı, öz-şefkat ile dengelenerek başarısızlık anlarında yıkıcı özeleştiri yerine esnek toparlanmayı destekler.',
  },
  {
    primaryFacetCode: 'creativity',
    balancingFacetCode: 'organization',
    moderatingRationaleTr: 'Yaratıcı düşünme eğilimi, düzenlilik ve yapılandırma yetisi ile somut projelere dönüştürülür.',
  },
  {
    primaryFacetCode: 'social_boldness',
    balancingFacetCode: 'modesty',
    moderatingRationaleTr: 'Sosyal ortamlarda rahatlık ve öne çıkma, alçakgönüllülük ile dengelenerek yapıcı ve samimi ilişkileri besler.',
  },
  {
    primaryFacetCode: 'perfectionism',
    balancingFacetCode: 'self_compassion',
    moderatingRationaleTr: 'Yüksek standartlar ve detaycılık, öz-şefkat ile dengelenerek mükemmeliyetçi kaygıyı azaltır.',
  },
  {
    primaryFacetCode: 'diligence',
    balancingFacetCode: 'self_compassion',
    moderatingRationaleTr: 'Yüksek çalışma disiplini ve sebat, öz-şefkat ile dengelenerek aşırı tükenmişliği önler.',
  },
];

export function buildInterpretationPlanV2(
  bundle: ProfileEvidenceBundleV2,
  request: EvidenceSelectionRequest
): InterpretationPlanV2 {
  const planId = `plan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const selected = selectEvidenceForInterpretation(bundle, request);

  const primaryEvidence: GroundedEvidenceEntry[] = [];
  const supportingEvidence: GroundedEvidenceEntry[] = [];
  const counterbalancingEvidence: GroundedEvidenceEntry[] = [];

  const evidenceByFacetCode = new Map<string, GroundedEvidenceEntry>();
  for (const entry of bundle.evidenceEntries) {
    if (entry.type === 'FACET_SCORE') {
      const facet = bundle.measuredFacets.find((f) => f.facetId === entry.targetId);
      if (facet) {
        evidenceByFacetCode.set(facet.code, entry);
      }
    }
  }

  // 1. Identify Primary Evidence
  for (const f of selected.selectedFacets) {
    const entry = bundle.evidenceEntries.find(
      (e) => e.type === 'FACET_SCORE' && e.targetId === f.facetId
    );
    if (entry) {
      primaryEvidence.push(entry);
    }
  }

  // 2. Identify Counterbalancing Evidence across profile
  const primaryCodes = new Set(selected.selectedFacets.map((f) => f.code));
  for (const rule of COUNTERBALANCE_RULES) {
    if (primaryCodes.has(rule.primaryFacetCode)) {
      const balancingEntry = evidenceByFacetCode.get(rule.balancingFacetCode);
      if (balancingEntry && !primaryEvidence.some((e) => e.evidenceId === balancingEntry.evidenceId)) {
        counterbalancingEvidence.push({
          ...balancingEntry,
          scientificRationaleTr: rule.moderatingRationaleTr,
        });
      }
    }
  }

  // 3. Identify Supporting Evidence (Construct & Pattern level)
  for (const c of selected.selectedConstructs) {
    const entry = bundle.evidenceEntries.find(
      (e) => e.type === 'CONSTRUCT_PATTERN' && e.targetId === c.constructId
    );
    if (entry) {
      supportingEvidence.push(entry);
    }
  }

  // 4. Construct Allowed Claims
  const allowedClaims: string[] = [];
  for (const f of selected.selectedFacets) {
    allowedClaims.push(
      `${f.nameTr} boyutunda ${f.band.toLowerCase()} eğilim gözlenmektedir.`
    );
  }
  for (const t of selected.selectedTensions) {
    allowedClaims.push(`Aktif gerilim: ${t.titleTr}`);
  }
  for (const s of selected.selectedSynergies) {
    allowedClaims.push(`Aktif sinerji: ${s.titleTr}`);
  }

  // 5. Construct Forbidden Claims
  const forbiddenClaims: string[] = [
    'Klinik tanı veya psikiyatrik hastalık teşhisi (depresyon, DEHB, bipolar, otizm, borderline, narsisistik kişilik bozukluğu)',
    'Temsili nüfus yüzdeliği veya norm sıralaması (Ön-kalibrasyon aşamasında percentil hesaplanamaz)',
    'Zaman içindeki değişim veya gelişim iddiaları (Boylamsal tekrar ölçüm bulunmadığından "arttı/azaldı" denemez)',
    'Kesin nedensellik iddiaları ("çocukluğunuzdan kaynaklanır", "bu yüzden başarısız olursunuz")',
    'Ölçülmemiş boyutlar hakkında tahmin yürütme (Zihin okuma veya eksik veriyi uydurma yapılamaz)',
    'Kategorik etiketleme ("içe dönük birisiniz", "narsistsiniz", "toksiksiniz")',
  ];

  return {
    planId,
    requestType: request.requestType,
    targetDomainIds: request.targetDomainIds || [],
    targetConstructIds: request.targetConstructIds || [],
    targetFacetIds: request.targetFacetIds || [],
    targetModuleCode: request.targetModuleCode,
    primaryEvidence,
    supportingEvidence,
    counterbalancingEvidence,
    activatedPatterns: bundle.crossDomainPatterns.filter((p) =>
      selected.selectedPatterns.some((sp) => sp.id === p.id)
    ),
    activatedTensions: bundle.tensions.filter((t) =>
      selected.selectedTensions.some((st) => st.id === t.id)
    ),
    activatedSynergies: bundle.synergies.filter((s) =>
      selected.selectedSynergies.some((ss) => ss.id === s.id)
    ),
    coverageState: {
      coverageRatio: bundle.coverage.facetCoverage.ratio,
      unmeasuredDomainNames: selected.coverage.unmeasuredDomainNamesTr,
      unmeasuredFacetCount: 91 - bundle.measuredFacets.length,
    },
    responseQualityState: {
      overallFlag: bundle.responseQuality.overallFlag,
      isClean: selected.responseQuality.isClean,
      cautiousRequired: selected.responseQuality.cautionRequired,
      cautionReasons: selected.responseQuality.cautionReasonsTr,
    },
    calibrationState: 'PRE_CALIBRATION',
    longitudinalState: {
      hasRepeat: false,
      epochCount: 1,
    },
    allowedClaims,
    forbiddenClaims,
  };
}
