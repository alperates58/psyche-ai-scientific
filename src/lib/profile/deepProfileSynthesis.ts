import { UnifiedPsychologicalProfileV2 } from '@/types/unifiedProfileV2';
import { ProfileEvidenceBundleV2 } from '@/lib/profile/profileEvidenceBundle';
import { DeepProfileInsightResultV2 } from '@/types/aiInsightV2';

/**
 * Deterministically synthesizes an evidence-grounded deep profile analysis
 * strictly from the user's measured facet scores, cross-domain patterns, synergies and tensions.
 * Never uses unmeasured or fabricated traits.
 */
export function generateEvidenceGroundedDeepFallback(
  profile: UnifiedPsychologicalProfileV2,
  bundle: ProfileEvidenceBundleV2
): DeepProfileInsightResultV2 {
  const measured = bundle.measuredFacets;
  const facetMap = new Map(measured.map((f) => [f.facetId, f]));

  // Find most distinctive scale positions based on distance from scale midpoint (3.0)
  const distinctiveFacets = [...measured].sort(
    (a, b) => Math.abs(b.score - 3.0) - Math.abs(a.score - 3.0)
  );
  const topDistinctive = distinctiveFacets.slice(0, 4);

  // 1. Executive Summary
  let executiveSummaryTr = '';
  if (measured.length === 0) {
    executiveSummaryTr = 'Henüz tamamlanmış bir değerlendirme bulunmuyor; derin analiz için en az bir envanter tamamlanmalıdır.';
  } else {
    const distinctiveListStr = topDistinctive
      .map((f) => `${f.nameTr} (${f.band})`)
      .join(', ');
    executiveSummaryTr = `Şu ana kadar ölçülen ${measured.length} alt boyut ve %${profile.coverage.facetCoverage.percentage} keşif kapsamı üzerinden incelendiğinde; profiliniz özellikle ${distinctiveListStr} alanlarında ölçek uçlarına yaklaşan belirgin örüntüler sergilemektedir. Bu sentez, tamamladığınız ampirik ölçeklerin yanıt örüntülerini doğrudan temel alır.`;
  }

  // 2. Thinking Style (epistemic_curiosity, inquisitiveness, creativity, aesthetic_appreciation, unconventionality)
  const thinkingFacets = ['epistemic_curiosity', 'inquisitiveness', 'creativity', 'aesthetic_appreciation', 'unconventionality']
    .map((id) => facetMap.get(id))
    .filter((f): f is typeof measured[0] => !!f);
  const thinkingStyle: string[] = [];
  if (thinkingFacets.length === 0) {
    thinkingStyle.push('Bilişsel merak ve düşünme stiline dair ampirik boyutlar henüz ölçülmemiştir.');
  } else {
    for (const f of thinkingFacets) {
      if (f.score >= 3.8) {
        thinkingStyle.push(`${f.nameTr} (${f.score.toFixed(2)}): Yeni kavramları derinlemesine anlama ve zihinsel merak duyma yönelimi belirgin biçimde yüksektir.`);
      } else if (f.score <= 2.5) {
        thinkingStyle.push(`${f.nameTr} (${f.score.toFixed(2)}): Kuramsal soyutlamalar yerine daha pratik, doğrulanabilir ve somut verilere odaklanma eğilimi öne çıkmaktadır.`);
      } else {
        thinkingStyle.push(`${f.nameTr} (${f.score.toFixed(2)}): Yeni fikirleri araştırma ile pratik uygulanabilirlik arasında dengeli bir duruş sergilenmektedir.`);
      }
    }
  }

  // 3. Decision Style (prudence, deliberation, cognitive_flexibility, risk_taking_social)
  const decisionFacets = ['prudence', 'deliberation', 'cognitive_flexibility', 'risk_taking_social']
    .map((id) => facetMap.get(id))
    .filter((f): f is typeof measured[0] => !!f);
  const decisionStyle: string[] = [];
  if (decisionFacets.length === 0) {
    decisionStyle.push('Karar alma ve temkin boyutları henüz ölçülmemiştir.');
  } else {
    for (const f of decisionFacets) {
      if (f.score >= 3.8) {
        decisionStyle.push(`${f.nameTr} (${f.score.toFixed(2)}): Karar süreçlerinde acele etmek yerine olası riskleri etraflıca tartma ve tedbirli ilerleme arzusu kuvvetlidir.`);
      } else if (f.score <= 2.5) {
        decisionStyle.push(`${f.nameTr} (${f.score.toFixed(2)}): Uzun uzadıya analiz etmek yerine hızlı karar alabilme ve durumsal fırsatları anında değerlendirme çevikliği görülmektedir.`);
      } else {
        decisionStyle.push(`${f.nameTr} (${f.score.toFixed(2)}): Koşullara göre hem hızlı hareket edebilme hem de gerektiğinde ihtiyatı elden bırakmama dengesi gözlenmektedir.`);
      }
    }
  }

  // 4. Work Execution (organization, diligence, perfectionism, long_term_grit, general_self_control)
  const workFacets = ['organization', 'diligence', 'perfectionism', 'long_term_grit', 'general_self_control']
    .map((id) => facetMap.get(id))
    .filter((f): f is typeof measured[0] => !!f);
  const workExecution: string[] = [];
  if (workFacets.length === 0) {
    workExecution.push('İcra, çalışma disiplini ve azim boyutları henüz ölçülmemiştir.');
  } else {
    for (const f of workFacets) {
      if (f.score >= 3.8) {
        workExecution.push(`${f.nameTr} (${f.score.toFixed(2)}): Başlanan görevlerde yüksek standartlar arama, detaylara özen gösterme ve engellere rağmen sebatla sürdürme eğilimi güçlüdür.`);
      } else if (f.score <= 2.5) {
        workExecution.push(`${f.nameTr} (${f.score.toFixed(2)}): Katı planlar yerine durumsal esnekliğe açık olma ve değişen koşullara hızla adapte olma tarzı öne çıkmaktadır.`);
      } else {
        workExecution.push(`${f.nameTr} (${f.score.toFixed(2)}): Planlı çalışma ile durumsal uyum arasında sürdürülebilir bir tempo gözetilmektedir.`);
      }
    }
  }

  // 5. Emotional Patterns (cognitive_reappraisal, expressive_suppression, distress_tolerance, stress_recovery, anxiety, fearfulness)
  const emotionFacets = ['cognitive_reappraisal', 'expressive_suppression', 'distress_tolerance', 'stress_recovery', 'anxiety', 'fearfulness']
    .map((id) => facetMap.get(id))
    .filter((f): f is typeof measured[0] => !!f);
  const emotionalPatterns: string[] = [];
  if (emotionFacets.length === 0) {
    emotionalPatterns.push('Duygu düzenleme ve stres yönetimi boyutları henüz ölçülmemiştir.');
  } else {
    for (const f of emotionFacets) {
      if (f.facetId === 'anxiety') {
        if (f.score <= 2.5) {
          emotionalPatterns.push(`Kaygı (${f.score.toFixed(2)}): Zorlayıcı ve belirsiz koşullarda endişe düzeyini daha sakin yönetebilme eğilimi kaydedilmiştir.`);
        } else if (f.score >= 3.8) {
          emotionalPatterns.push(`Kaygı (${f.score.toFixed(2)}): Belirsizlik veya risk içeren durumlarda tetikte olma ve olası aksaklıkları erkenden sezme duyarlılığı yüksektir.`);
        } else {
          emotionalPatterns.push(`Kaygı (${f.score.toFixed(2)}): Günlük olağan dalgalanmaları karşılayabilecek dengeli bir temkin düzeyi izlenmektedir.`);
        }
      } else if (f.facetId === 'cognitive_reappraisal') {
        emotionalPatterns.push(`Bilişsel Yeniden Değerlendirme (${f.score.toFixed(2)}): Zorlayıcı deneyimleri yapıcı bir bakış açısıyla yeniden çerçeveleme yetkinliği ${f.score >= 3.8 ? 'belirgin biçimde etkindir' : 'durumsal olarak devreye girmektedir'}.`);
      } else if (f.facetId === 'distress_tolerance') {
        emotionalPatterns.push(`Sıkıntı Toleransı (${f.score.toFixed(2)}): Rahatsız edici duygular karşısında fevri tepkiler vermeden durabilme kapasitesi ${f.score >= 3.8 ? 'yüksek bir dayanıklılık sunmaktadır' : 'farkındalıkla desteklenebilir'}.`);
      } else {
        emotionalPatterns.push(`${f.nameTr} (${f.score.toFixed(2)}): ${f.band} konumunda ölçümlenmiştir.`);
      }
    }
  }

  // 6. Relationship Patterns (sincerity, fairness, social_boldness, sociability, gentleness, empathic_concern, assertiveness)
  const relFacets = ['sincerity', 'fairness', 'social_boldness', 'sociability', 'gentleness', 'empathic_concern', 'assertiveness']
    .map((id) => facetMap.get(id))
    .filter((f): f is typeof measured[0] => !!f);
  const relationshipPatterns: string[] = [];
  if (relFacets.length === 0) {
    relationshipPatterns.push('Kişilerarası ilişki ve sosyal cesaret boyutları henüz ölçülmemiştir.');
  } else {
    for (const f of relFacets) {
      if (f.facetId === 'sincerity' && f.score >= 3.8) {
        relationshipPatterns.push(`İçtenlik (${f.score.toFixed(2)}): Sosyal ilişkilerde yapmacıklıktan uzak, doğrudan ve dürüst bir etkileşim tarzı benimsenmektedir.`);
      } else if (f.facetId === 'social_boldness' && f.score >= 3.8) {
        relationshipPatterns.push(`Sosyal Cesaret (${f.score.toFixed(2)}): Topluluk önünde duygu ve fikirlerini ifade etmekten çekinmeyen girişken bir tutum sergilenmektedir.`);
      } else if (f.facetId === 'empathic_concern' && f.score >= 3.8) {
        relationshipPatterns.push(`Empatik İlgi (${f.score.toFixed(2)}): Başkalarının duygusal durumlarına ve ihtiyaçlarına karşı yüksek bir hassasiyet ve dayanışma görülmektedir.`);
      } else {
        relationshipPatterns.push(`${f.nameTr} (${f.score.toFixed(2)}): ${f.band} bandında ölçülmüştür.`);
      }
    }
  }

  // 7. Motivation Patterns
  const motFacets = ['autonomy_need_satisfaction', 'competence_need_satisfaction', 'relatedness_need_satisfaction', 'presence_of_meaning', 'search_for_meaning', 'schwartz_openness_to_change', 'schwartz_self_transcendence', 'schwartz_conservation', 'schwartz_self_enhancement']
    .map((id) => facetMap.get(id))
    .filter((f): f is typeof measured[0] => !!f);
  const motivationPatterns: string[] = [];
  if (motFacets.length === 0) {
    motivationPatterns.push('Temel psikolojik ihtiyaçlar ve motivasyonel değer boyutları henüz ölçülmemiştir.');
  } else {
    for (const f of motFacets) {
      motivationPatterns.push(`${f.nameTr} (${f.score.toFixed(2)}): ${f.band} düzeyinde içsel motivasyon ve doyum eğilimi göstermektedir.`);
    }
  }

  // 8. Trait Interactions (Synergies & Cross-Domain Patterns)
  const traitInteractions = bundle.synergies.length > 0
    ? bundle.synergies.map((s) => `${s.titleTr}: ${s.descriptionTr}`)
    : ['Mevcut ölçümlerde aktifleşen kayıtlı bir sinerji kuralı bulunmuyor; daha fazla alan tamamlandıkça etkileşimler hesaplanacaktır.'];

  // 9. Balance Points (Tensions)
  const balancePoints = bundle.tensions.length > 0
    ? bundle.tensions.map((t) => `${t.titleTr}: ${t.descriptionTr}`)
    : ['Mevcut ölçümlerde belirgin bir durumsal gerilim veya kutupsallık kuralı tetiklenmedi.'];

  // 10. Reflection Questions
  const reflectionQuestions: string[] = [];
  for (const t of bundle.tensions) {
    if (t.reflectionPromptTr) {
      reflectionQuestions.push(t.reflectionPromptTr);
    }
  }
  if (reflectionQuestions.length === 0 && topDistinctive.length > 0) {
    reflectionQuestions.push(
      `${topDistinctive[0].nameTr} özelliğinizin günlük kararlarınızda size en çok avantaj sağladığı anlar nelerdir?`,
      'Hangi durumlarda doğal eğilimlerinizin tersi yönde davranmak ekstra enerji gerektirmektedir?'
    );
  }

  // 11. Limitations
  const limitations = [
    'Bu analiz klinik bir teşhis veya psikopatoloji değerlendirmesi niteliği taşımaz; tamamlanan ampirik ölçeklere dayalı betimsel bir öz-farkındalık modelidir.',
    'Ulusal temsili norm kalibrasyonu tamamlanana kadar sonuçlar popülasyon persentili değil, ölçeğin mutlak konumunu (1.00–5.00) ifade eder.',
    profile.longitudinalReadiness.hasRepeatMeasurements
      ? 'Farklı zamanlarda tekrarlanan ölçüm verileri izlenmektedir.'
      : 'Sonuçlar tek bir ölçüm oturumuna aittir; zaman içindeki kararlılığı gözlemlemek için belirli aralıklarla tekrar ölçüm önerilir.',
  ];

  return {
    headlineTr: 'Kanıta Dayalı Çok Boyutlu Derin Profil Analizi',
    executiveSummaryTr,
    thinkingStyle,
    decisionStyle,
    workExecution,
    emotionalPatterns,
    relationshipPatterns,
    motivationPatterns,
    traitInteractions,
    balancePoints,
    reflectionQuestions,
    limitations,
    evidenceRefs: measured.map((f) => f.facetId),
    generatedAt: new Date().toISOString(),
    isFallback: true,
    modelProvider: 'PSYCHEAI_DETERMINISTIC_SYNTHESIS',
    modelName: 'evidence-grounded-deep-v3.1',
  };
}
