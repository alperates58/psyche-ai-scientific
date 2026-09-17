/**
 * PsycheAI FAZ 2.19 — Theory Fallback Engine
 *
 * Provides deterministic, high-quality, scientifically grounded theoretical interpretations
 * when external LLM providers are unavailable, disabled, unconsented, or fail verification.
 *
 * Invariants:
 * - 100% deterministic & offline capable.
 * - Adheres strictly to the Master Model and scoped evidence bundle.
 * - Never hallucinates unmeasured facets or makes clinical claims.
 */

import {
  TheoryLensDefinition,
  ScopedLensEvidenceBundle,
  TheoryInsightV1,
  TheoryConversationResponseV1,
  TheoryComparisonResult,
  EpistemicSegment,
} from '@/types/theoryLens';

export function generateFallbackTheoryInsight(
  lens: TheoryLensDefinition,
  bundle: ScopedLensEvidenceBundle
): TheoryInsightV1 {
  const sources = bundle.sources;
  const facets = bundle.scopedFacets;

  // Identify high, balanced, and low facets from measured set
  const sortedByScore = [...facets].sort((a, b) => b.score - a.score);
  const highestFacet = sortedByScore[0];
  const lowestFacet = sortedByScore[sortedByScore.length - 1];

  const primaryConcept = lens.coreConcepts[0] || {
    nameTr: 'Kişilik Dinamikleri',
    definitionTr: 'Temel kuramsal çerçeve.',
  };
  const secondaryConcept = lens.coreConcepts[1] || primaryConcept;

  const epistemicSegments: EpistemicSegment[] = [];

  if (highestFacet) {
    epistemicSegments.push({
      claimType: 'MEASURED_FINDING',
      contentTr: `Profil ölçümlerinizde "${highestFacet.nameTr}" (${highestFacet.domainNameTr}) alt boyutu ${highestFacet.score.toFixed(
        2
      )} puan ile "${highestFacet.bandLabelTr}" düzeyinde belirlenmiştir.`,
      evidenceRefs: [highestFacet.code],
    });

    epistemicSegments.push({
      claimType: 'THEORETICAL_INTERPRETATION',
      contentTr: `${lens.theoristName}'ın "${primaryConcept.nameTr}" kavramı açısından incelendiğinde, bu belirgin düzey bireyin günlük yaşantısında geliştirdiği temel bir uyum veya güç alanı olarak değerlendirilebilir.`,
      evidenceRefs: [primaryConcept.conceptId],
    });
  }

  if (lowestFacet && lowestFacet.code !== highestFacet?.code) {
    epistemicSegments.push({
      claimType: 'MEASURED_FINDING',
      contentTr: `Diğer taraftan "${lowestFacet.nameTr}" alt boyutu ${lowestFacet.score.toFixed(
        2
      )} puan ile "${lowestFacet.bandLabelTr}" bandında yer almaktadır.`,
      evidenceRefs: [lowestFacet.code],
    });

    epistemicSegments.push({
      claimType: 'THEORETICAL_INTERPRETATION',
      contentTr: `${lens.theoristName}'ın "${secondaryConcept.nameTr}" perspektifinden bakıldığında, bu alan gelişime ve yeni stratejilerle desteklenmeye açık bir potansiyel olarak okunabilir.`,
      evidenceRefs: [secondaryConcept.conceptId],
    });
  }

  epistemicSegments.push({
    claimType: 'REFLECTIVE_HYPOTHESIS',
    contentTr: `Bu iki farklı eğilim arasındaki dengeyi kendi günlük kararlarınızda ve ilişkilerinizde nasıl gözlemliyorsunuz?`,
    evidenceRefs: [],
  });

  const titleTr = `${lens.theoristName} Merceğinden Kişilik ve Dinamik Analiz`;
  const summaryTr = `${lens.displayNameTr} çerçevesinde mevcut profil bulgularınız (${bundle.scopedFacets.length} ölçülen alt boyut), ${primaryConcept.nameTr} ve ${secondaryConcept.nameTr} kavramsal ekseninde incelenmiştir.`;

  let perspectiveAnalysisTr = `${lens.historicalContextTr}\n\n`;
  perspectiveAnalysisTr += `Mevcut profilinizde öne çıkan ${highestFacet ? `"${highestFacet.nameTr}" (${highestFacet.bandLabelTr})` : 'ölçümler'}, ${lens.theoristName}'ın kuramsal yapısında ${primaryConcept.definitionTr} ilkesiyle paralellik gösterir. `;
  perspectiveAnalysisTr += `Bu durum bireyin içsel ve çevresel talepler karşısında geliştirdiği işlevsel stratejileri temsil eder.\n\n`;
  perspectiveAnalysisTr += `Kuramsal açıdan bu profil, bireyin tek bir kalıba sıkıştırılması yerine boyutsal dengelerin ve kişisel farkındalığın ön planda tutulmasını önerir.`;

  let tensionsAnalysisTr: string | undefined;
  if (bundle.activatedTensions.length > 0) {
    tensionsAnalysisTr = `Profilinizdeki "${bundle.activatedTensions[0].titleTr}" gerilimi, ${lens.theoristName} yaklaşımında farklı içsel güçlerin veya zıt kutupların dengelenme çabası olarak yorumlanabilir.`;
  } else if (bundle.activatedSynergies.length > 0) {
    tensionsAnalysisTr = `Profilinizdeki "${bundle.activatedSynergies[0].titleTr}" sinerjisi, kuramın öngördüğü bütünleşme ve uyum dinamiğini desteklemektedir.`;
  }

  return {
    insightId: `ti_det_${lens.lensId.toLowerCase()}_${Date.now()}`,
    lensId: lens.lensId,
    titleTr,
    summaryTr,
    epistemicSegments,
    perspectiveAnalysisTr,
    identifiedTensionsAndSynergiesTr: tensionsAnalysisTr,
    reflectionPromptsTr: lens.reflectionPrompts.slice(0, 4),
    historicalLimitationsTr: lens.historicalLimitations,
    modernLimitationsTr: lens.modernEvidenceLimitations,
    evidenceRefs: facets.map((f) => f.code),
    isFallback: true,
    modelProvider: 'deterministic',
    modelName: 'psycheai-deterministic-theory-v1',
    generatedAt: new Date().toISOString(),
    sourcesUsed: sources,
    groundedFacetDetails: facets,
  };
}

export function generateFallbackTheoryChatResponse(
  lens: TheoryLensDefinition,
  bundle: ScopedLensEvidenceBundle,
  userMessage: string
): TheoryConversationResponseV1 {
  const sources = bundle.sources;
  const primaryConcept = lens.coreConcepts[0] || {
    nameTr: 'Kişilik Gözlemi',
    definitionTr: 'Temel kavram.',
  };

  const replyTr = `${lens.theoristName} perspektifinden sorunuza baktığımızda: "${userMessage}" konusundaki değerlendirmeniz, kuramımızın temel taşlarından biri olan **${primaryConcept.nameTr}** (${primaryConcept.definitionTr}) ile yakından ilişkilidir.\n\nÖlçülen profil verilerinizde yer alan boyutlar, bireyin karşılaştığı durumlara nasıl tepki verdiğini ve hangi içsel mekanizmaları devreye soktuğunu gösteren ipuçları sunar. Bilimsel bir kuram olarak amacımız kesin bir yargıya varmak değil, kendi deneyiminizi daha derinlikli anlamlandırmanız için bir düşünce alanı açmaktır.`;

  const epistemicSegments: EpistemicSegment[] = [
    {
      claimType: 'USER_PROVIDED_CONTEXT',
      contentTr: `Kullanıcı şu konuyu tartışmaya açtı: "${userMessage}"`,
    },
    {
      claimType: 'THEORETICAL_INTERPRETATION',
      contentTr: `${lens.theoristName} kuramı bu yaşantıyı "${primaryConcept.nameTr}" odağında değerlendirmeyi önerir.`,
    },
    {
      claimType: 'REFLECTIVE_HYPOTHESIS',
      contentTr: `Bu durumla karşılaştığınızda hissettiğiniz ilk tepkiyi ve sonrasındaki düşünce akışınızı nasıl tanımlarsınız?`,
    },
  ];

  return {
    lensId: lens.lensId,
    replyTr,
    epistemicSegments,
    evidenceRefs: bundle.scopedFacets.map((f) => f.code).slice(0, 5),
    suggestedReflectionPrompts: lens.reflectionPrompts.slice(0, 2),
    isFallback: true,
    modelProvider: 'deterministic',
    modelName: 'psycheai-deterministic-theory-v1',
    sourcesUsed: sources,
  };
}

export function generateFallbackTheoryComparison(
  lenses: TheoryLensDefinition[],
  bundle: ScopedLensEvidenceBundle,
  topicOrDomain?: string
): TheoryComparisonResult {
  const comparisonId = `comp_det_${Date.now()}`;
  const topic = topicOrDomain || 'Kişilik Yapısı ve Davranışsal Uyum Dinamikleri';

  const lensViews = lenses.map((lens) => {
    const concept = lens.coreConcepts[0] || { nameTr: 'Temel Kavram' };
    const segments: EpistemicSegment[] = [
      {
        claimType: 'THEORETICAL_INTERPRETATION',
        contentTr: `${lens.theoristName}, profildeki verileri "${concept.nameTr}" ve ${lens.theoreticalTradition} ilkeleri doğrultusunda açıklar.`,
      },
    ];

    return {
      lensId: lens.lensId,
      lensNameTr: lens.displayNameTr,
      theoristName: lens.theoristName,
      coreViewTr: `${lens.theoristName} yaklaşımında temel odak: ${lens.shortDescriptionTr} Bu mercek, ölçülen özelliklerin bireyin içsel dinamiklerinde ve çevreyle etkileşiminde oynadığı kuramsal rolü vurgular.`,
      keyConceptsUsed: lens.coreConcepts.map((c) => c.nameTr).slice(0, 3),
      epistemicSegments: segments,
      sources: bundle.sources.filter((s) => s.lensId === lens.lensId),
    };
  });

  const consensusPointsTr = [
    `Her iki kuram da bireyin davranışlarının ve eğilimlerinin rastlantısal olmadığını, belirli içsel ve çevresel mekanizmaların etkileşimiyle biçimlendiğini kabul eder.`,
    `Profilde ölçülen alt boyutlar (örn. duygu ve öz-düzenleme eğilimleri), her iki kuram tarafından da bireyin uyum kapasitesini yansıtan temel değişkenler olarak görülür.`,
  ];

  const divergencePointsTr = lenses.map((lens, idx) => {
    const otherLens = lenses[(idx + 1) % lenses.length];
    return `${lens.theoristName} odağını daha çok "${lens.coreConcepts[0]?.nameTr || 'içsel süreçler'}" üzerine kurarken, ${otherLens.theoristName} yaklaşımı "${otherLens.coreConcepts[0]?.nameTr || 'farklı dinamikler'}" eksenine yoğunlaşır.`;
  });

  const integrativeSynthesisTr = `Psikolojik profili birden fazla kuramsal mercekten okumak, tek bir ekolün sınırlılığına hapsolmadan insan deneyiminin çok boyutluluğunu görmemizi sağlar. Ölçülmüş nesnel bulgular temel zemin olmak üzere, her iki kuramın sunduğu kavramsal araçlar kullanıcının kendi zihninde tamamlayıcı bir bütünlük oluşturabilir.`;

  return {
    comparisonId,
    comparedLensIds: lenses.map((l) => l.lensId),
    topicOrDomain: topic,
    lenses: lensViews,
    consensusPointsTr,
    divergencePointsTr,
    integrativeSynthesisTr,
    evidenceRefs: bundle.scopedFacets.map((f) => f.code),
    isFallback: true,
    generatedAt: new Date().toISOString(),
  };
}
