/**
 * FAZ 2.21: Journal Insight Engine & AI Reflection Pipeline
 * Enforces:
 * - Scoped Minimum Necessary Data Privacy
 * - Epistemic Separation (USER_REPORTED_CONTEXT, OBSERVATIONAL_DATA)
 * - Zero Psychometric Scoring Role
 * - Non-Diagnostic, Non-Therapeutic Exploration Style
 * - Deterministic Fallback on DeepSeek Failure / Disabled AI
 */

import { prisma } from '@/lib/prisma';
import {
  JournalEntryV1,
  JournalInsightV1,
  JournalProfileRelationshipV1,
  JournalObservationBundleV1,
} from '@/types/journal';
import { getAIConfig } from '@/lib/ai/config/aiConfigResolver';
import { verifyJournalReflectionClaims } from '@/lib/ai/verification/claimVerifier';
import {
  buildJournalObservationBundle,
  resolveJournalProfileRelationships,
} from '@/services/journalObservationService';
import { generateEntryContentHash } from '@/services/journalService';
import { getCurrentUnifiedProfile } from '@/services/unifiedProfileService';

export const JOURNAL_ENGINE_VERSION = 'v1.0.0';
export const JOURNAL_PROMPT_VERSION = 'v2.21.0';

export interface GenerateJournalInsightResult {
  insight: JournalInsightV1;
  relationships: JournalProfileRelationshipV1[];
  isFallback: boolean;
}

/**
 * Main AI Reflection Generation Pipeline
 */
export async function generateJournalInsight(
  userId: string,
  entryId: string
): Promise<GenerateJournalInsightResult> {
  // 1. Fetch Entry & Validate Ownership
  const entry = await prisma.journalEntry.findFirst({
    where: { id: entryId, userId, deletedAt: null },
    include: { insights: true, relationships: true },
  });

  if (!entry) {
    throw new Error('Journal entry not found or unauthorized.');
  }

  const contentHash = generateEntryContentHash({
    title: entry.title,
    body: entry.body,
    entryType: entry.entryType,
    contextTags: entry.contextTags,
    moodSelfReport: entry.moodSelfReport,
    energySelfReport: entry.energySelfReport,
    stressSelfReport: entry.stressSelfReport,
  });

  // 2. Cache Validation Check: If existing insight has matching hash, reuse
  const existingInsight = entry.insights.find((i) => i.sourceContentHash === contentHash);
  if (existingInsight) {
    return {
      insight: {
        id: existingInsight.id,
        entryId: existingInsight.entryId,
        userId: existingInsight.userId,
        insightType: existingInsight.insightType as any,
        evidenceClass: existingInsight.evidenceClass as any,
        summaryTr: existingInsight.summaryTr,
        reflectivePrompt: existingInsight.reflectivePrompt,
        isFallback: existingInsight.isFallback,
        engineVersion: existingInsight.engineVersion,
        promptVersion: existingInsight.promptVersion,
        provider: existingInsight.provider,
        modelId: existingInsight.modelId,
        sourceContentHash: existingInsight.sourceContentHash,
        createdAt: existingInsight.createdAt.toISOString(),
      },
      relationships: entry.relationships.map((r) => ({
        id: r.id,
        entryId: r.entryId,
        relationshipType: r.relationshipType as any,
        evidenceType: r.evidenceType as any,
        strength: r.strength as any,
        relatedFacetIds: r.relatedFacetIds || [],
        relatedConstructIds: r.relatedConstructIds || [],
        relatedDomainIds: r.relatedDomainIds || [],
        narrativeTr: r.narrativeTr,
        createdAt: r.createdAt.toISOString(),
      })),
      isFallback: existingInsight.isFallback,
    };
  }

  // 3. Build Scoped Privacy Observation Bundle & Profile
  const profile = await getCurrentUnifiedProfile(userId);
  const entryDto: JournalEntryV1 = {
    id: entry.id,
    userId: entry.userId,
    title: entry.title,
    body: entry.body,
    entryType: entry.entryType as any,
    moodSelfReport: entry.moodSelfReport,
    energySelfReport: entry.energySelfReport,
    stressSelfReport: entry.stressSelfReport,
    contextTags: entry.contextTags as any,
    userTags: entry.userTags || [],
    isLifeEvent: entry.isLifeEvent,
    lifeEventType: entry.lifeEventType as any,
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
    deletedAt: entry.deletedAt ? entry.deletedAt.toISOString() : null,
  };

  const bundle = await buildJournalObservationBundle(userId, entryDto, profile);
  const resolvedRelationships = resolveJournalProfileRelationships(entryDto, profile);

  // 4. Try AI Generation with DeepSeek
  let summaryTr = '';
  let reflectivePrompt = '';
  let isFallback = false;
  let providerName = 'DeepSeek';
  let modelId = 'deepseek-v4-flash';

  const aiConfig = await getAIConfig();

  if (aiConfig && aiConfig.aiEnabled && aiConfig.apiKey) {
    try {
      const { summary, prompt } = await executeDeepSeekJournalReflection(bundle, aiConfig);
      const verification = verifyJournalReflectionClaims(summary);
      if (verification.isValid) {
        summaryTr = summary;
        reflectivePrompt = prompt;
      } else {
        console.warn('AI reflection failed claim verification; engaging fallback:', verification.errors);
        isFallback = true;
      }
    } catch (err) {
      console.warn('DeepSeek journal reflection failed; engaging deterministic fallback:', err);
      isFallback = true;
    }
  } else {
    isFallback = true;
  }

  // 5. Deterministic Fallback if AI was unavailable or rejected
  if (isFallback || !summaryTr) {
    const fallbackOutput = generateDeterministicJournalReflection(bundle);
    summaryTr = fallbackOutput.summaryTr;
    reflectivePrompt = fallbackOutput.reflectivePrompt;
    isFallback = true;
    providerName = 'DeterministicFallback';
    modelId = 'rule-engine-v1';
  }

  // 6. Persist Insight & Relationships in Transaction
  const savedInsight = await prisma.$transaction(async (tx) => {
    // Delete any previous insight for entry
    await tx.journalInsight.deleteMany({ where: { entryId } });
    await tx.journalProfileRelationship.deleteMany({ where: { entryId } });

    // Save relationships
    for (const rel of resolvedRelationships) {
      await tx.journalProfileRelationship.create({
        data: {
          entryId,
          relationshipType: rel.relationshipType,
          evidenceType: rel.evidenceType,
          strength: rel.strength,
          relatedFacetIds: rel.relatedFacetIds,
          relatedConstructIds: rel.relatedConstructIds,
          relatedDomainIds: rel.relatedDomainIds,
          narrativeTr: rel.narrativeTr,
        },
      });
    }

    // Save new insight
    return tx.journalInsight.create({
      data: {
        entryId,
        userId,
        insightType: 'ENTRY_REFLECTION',
        evidenceClass: 'OBSERVATIONAL_DATA',
        summaryTr,
        reflectivePrompt,
        isFallback,
        engineVersion: JOURNAL_ENGINE_VERSION,
        promptVersion: JOURNAL_PROMPT_VERSION,
        provider: providerName,
        modelId,
        sourceContentHash: contentHash,
      },
    });
  });

  return {
    insight: {
      id: savedInsight.id,
      entryId: savedInsight.entryId,
      userId: savedInsight.userId,
      insightType: savedInsight.insightType as any,
      evidenceClass: savedInsight.evidenceClass as any,
      summaryTr: savedInsight.summaryTr,
      reflectivePrompt: savedInsight.reflectivePrompt,
      isFallback: savedInsight.isFallback,
      engineVersion: savedInsight.engineVersion,
      promptVersion: savedInsight.promptVersion,
      provider: savedInsight.provider,
      modelId: savedInsight.modelId,
      sourceContentHash: savedInsight.sourceContentHash,
      createdAt: savedInsight.createdAt.toISOString(),
    },
    relationships: resolvedRelationships,
    isFallback,
  };
}

/**
 * Calls DeepSeek with Scoped Privacy Payload
 */
async function executeDeepSeekJournalReflection(
  bundle: JournalObservationBundleV1,
  config: any
): Promise<{ summary: string; prompt: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs || 10000);

  const systemPrompt = `Sen PsycheAI Yansıma ve Öz-Gözlem Asistanısın.
GÖREV: Kullanıcının günlüğüne yazdığı yansımayı, profilindeki psikolojik boyutlarla ilişkilendirerek özet ve düşündürücü bir geri bildirim sunmak.

KESİN KURALLAR:
1. KESİNLİKLE TANI KOYMA (depresyon, anksiyete, travma, kişilik bozukluğu vb. yasaktır).
2. TERAPİST ROLÜNE GİRME ("terapi seansı", "travmanızı işleyeceğiz" vb. yasaktır).
3. PSİKOMETRİK PUAN HESAPLAMA VEYA DEĞİŞTİRME. Günlük kayıtları öz-bildirimdir (USER_REPORTED_CONTEXT).
4. İFADE TARZI: "Bu kayıtta dikkat çeken...", "Profilinizdeki X ölçümüyle kısmen paralel...", "Bu bağlamda...", "Kesin çıkarım yerine bir eğilim..." gibi keşifçi ve yumuşak bir dil kullan.
5. TÜRKÇE VE JSON FORMATINDA CEVAP VER:
{
  "summary": "2-3 cümlelik yansıma özeti ve profil bağlamı",
  "prompt": "Kullanıcının kendine sorabileceği 1 açık uçlu derinleştirici soru"
}`;

  const userPrompt = `Aşağıdaki yansıma kaydını analiz et:

YANSIMA BAĞLAMI:
- Başlık: ${bundle.currentEntryExcerpt.title || 'Başlıksız'}
- Tür: ${bundle.currentEntryExcerpt.entryType}
- Bağlamlar: ${bundle.currentEntryExcerpt.contextTags.join(', ')}
- Öz-Bildirim Derecelendirmeleri: Ruh Hali=${bundle.currentEntryExcerpt.moodSelfReport || 'Belirtilmedi'}, Enerji=${bundle.currentEntryExcerpt.energySelfReport || 'Belirtilmedi'}, Stres=${bundle.currentEntryExcerpt.stressSelfReport || 'Belirtilmedi'}
- Yaşam Olayı: ${bundle.currentEntryExcerpt.isLifeEvent ? 'Evet' : 'Hayır'}

YANSIMA METNİ:
"${bundle.currentEntryExcerpt.body}"

İLGİLİ ÖLÇÜLEN PROFİL KANITLARI:
${bundle.scopedProfileEvidence.map((e) => `- ${e.facetNameTr} (${e.constructNameTr}): Puan ${e.score.toFixed(2)}/5.00 [${e.confidenceLevel}]`).join('\n') || 'Bu bağlamda henüz doğrudan bir ölçüm bulunmuyor.'}

Lütfen JSON formatında summary ve prompt üret.`;

  try {
    const res = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model || 'deepseek-v4-flash',
        temperature: 0.2,
        max_tokens: 1000,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`DeepSeek API error ${res.status}`);
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content);

    return {
      summary: parsed.summary || 'Yansıma kaydınız başarıyla analiz edildi.',
      prompt: parsed.prompt || 'Bu durumla ilgili bir sonraki adımda neyi farklı yapmak istersiniz?',
    };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Deterministic Fallback Generator
 * Always works offline with zero dependencies
 */
export function generateDeterministicJournalReflection(
  bundle: JournalObservationBundleV1
): { summaryTr: string; reflectivePrompt: string } {
  const excerpt = bundle.currentEntryExcerpt;
  const contextList = excerpt.contextTags.join(', ');
  const relevantFacets = bundle.scopedProfileEvidence;

  let summaryTr = '';
  let reflectivePrompt = '';

  if (relevantFacets.length > 0) {
    const topFacet = relevantFacets[0];
    summaryTr = `Bu yansımanızda ${contextList} bağlamındaki deneyimleriniz öne çıkıyor. İfade ettiğiniz durum, profilinizde ölçülen ${topFacet.facetNameTr} (${topFacet.score.toFixed(2)}) boyutuyla örtüşen gözlemler içeriyor. Bu kayıt psikometrik bir puanlama değil, kendi yaşantınızı anlamlandırma sürecinize eşlik eden bir öz-bildirimdir.`;
    reflectivePrompt = `Bu ${contextList} deneyiminde benimsediğiniz tutum, genel yaşam alışkanlıklarınızla nasıl bir uyum gösteriyor?`;
  } else {
    summaryTr = `Bu kayıtta ${contextList} bağlamındaki düşünce ve farkındalıklarınızı not ettiniz. Bu alan profilinizde henüz doğrudan bir modül ile ölçülmemiş olmakla birlikte, kişisel deneyim dağarcığınız için değerli bir gözlem oluşturmaktadır.`;
    reflectivePrompt = `Bu farkındalığı günlük kararlarınızda veya ilişkilerinizde nasıl bir eyleme dönüştürmek istersiniz?`;
  }

  if (excerpt.stressSelfReport && excerpt.stressSelfReport >= 4) {
    summaryTr += ' Kayıtta belirtilen yüksek stres bildiriminiz, bu alanda içsel kaynaklarınızı veya destek mekanizmalarınızı değerlendirmenin yararlı olabileceğine işaret ediyor.';
  }

  return { summaryTr, reflectivePrompt };
}
