/**
 * PsycheAI Deterministic Fallback Engine V2
 *
 * Generates rich, nuanced, evidence-grounded Turkish profile insights
 * from InterpretationPlanV2 without external network or LLM dependencies.
 *
 * Guarantees that the product remains 100% useful and scientific
 * even when external AI is disabled, offline, or restricted.
 */

import { AIInsightProvider } from './providerInterface';
import { InterpretationPlanV2, AIInsightV2, InsightType } from '@/types/aiInsightV2';
import { ResolvedAIConfig } from '@/lib/ai/config/aiConfigResolver';
import { PROMPT_VERSION_ID, PROMPT_ENGINE_VERSION } from '@/lib/ai/prompts/promptTemplatesV2';

export class DeterministicFallbackProvider implements AIInsightProvider {
  readonly name = 'DeterministicFallback';

  async generateStructuredInsight(
    plan: InterpretationPlanV2,
    _config?: ResolvedAIConfig
  ): Promise<AIInsightV2> {
    const insightId = `fallback_${plan.requestType.toLowerCase()}_${Date.now()}`;
    const generatedAt = new Date().toISOString();

    const primaryEvidenceRefs = plan.primaryEvidence.map((e) => e.evidenceId);
    const supportingEvidenceRefs = plan.supportingEvidence.map((e) => e.evidenceId);
    const counterbalancingEvidenceRefs = plan.counterbalancingEvidence.map((e) => e.evidenceId);
    const allEvidenceRefs = Array.from(
      new Set([
        ...primaryEvidenceRefs,
        ...supportingEvidenceRefs,
        ...counterbalancingEvidenceRefs,
        ...plan.activatedTensions.map((t) => `ev_tension_${t.id}`),
        ...plan.activatedSynergies.map((s) => `ev_synergy_${s.id}`),
        ...plan.activatedPatterns.map((p) => p.id),
      ])
    );

    let titleTr = 'Psikolojik Ölçüm ve Profil Analizi';
    let summaryTr = '';
    let bodyTr = '';
    const reflectionPrompts: string[] = [];
    const limitations: string[] = [
      'Ön-kalibrasyon aşaması: Puanlar yerel ölçek ortalamalarını yansıtır, temsili nüfus yüzdeliği içermez.',
      'Klinik tanısal değildir: Kişilik ve benlik özellikleri klinik tanı veya patoloji amacı taşımaz.',
      'Öz-bildirim esası: Sonuçlar kullanıcının ampirik değerlendirmelerdeki öz-bildirim yanıtlarına dayanır.',
    ];

    if (plan.responseQualityState.cautiousRequired) {
      limitations.push('Yanıt kalitesi uyarısı: Bu bölümdeki yanıt örüntülerini temkinli yorumlamak önerilir.');
    }

    // 1. Profile Overview Generator
    if (plan.requestType === 'PROFILE_OVERVIEW') {
      const measuredCount = plan.primaryEvidence.length;
      if (measuredCount === 0) {
        titleTr = 'Henüz Tamamlanmış Psikolojik Ölçüm Bulunmuyor';
        summaryTr =
          'Profilinizi oluşturmak ve güçlü yönlerinizi bilimsel olarak keşfetmek için ilk değerlendirme modülünü tamamlayabilirsiniz.';
        bodyTr =
          'PsycheAI Bilimsel Profil Motoru, 11 temel alan ve 91 psikolojik boyut üzerinden ölçüm yapar. Değerlendirmeleri tamamladıkça ampirik örüntüleriniz, içsel sinerjileriniz ve dengeleyici özellikleriniz bu alanda listelenecektir.';
        reflectionPrompts.push('Hangi yaşam veya kişilik alanınızı ilk olarak keşfetmek istersiniz?');
      } else {
        titleTr = `${measuredCount} Psikolojik Boyut Üzerinden Bütünsel Profil Özeti`;
        summaryTr = `Profilinizde şu ana kadar tamamlanan değerlendirmeler ${measuredCount} boyutta belirgin eğilimleri ve içsel dinamikleri ortaya koymaktadır.`;

        const prominentSnippets = plan.primaryEvidence
          .slice(0, 4)
          .map((e) => {
            const scoreStr = e.numericValue !== null ? `(${e.numericValue.toFixed(2)}/5.00)` : '';
            return `• ${e.titleTr} ${scoreStr}: ${e.scientificRationaleTr || 'Profilinizde ölçülen temel eğilimlerden biridir.'}`;
          });

        const balancingSnippets = plan.counterbalancingEvidence.map(
          (e) => `• ${e.titleTr}: ${e.scientificRationaleTr || 'Dengeleyici bir rol oynamaktadır.'}`
        );

        const tensionSnippets = plan.activatedTensions.map(
          (t) => `• ${t.titleTr}: ${t.descriptionTr}`
        );

        const synergySnippets = plan.activatedSynergies.map(
          (s) => `• ${s.titleTr}: ${s.descriptionTr}`
        );

        bodyTr = [
          '1. ÖLÇÜM KAPSAMI & GENEL YAPI:',
          `Profiliniz 11 psikolojik alanın %${plan.coverageState.coverageRatio ? (plan.coverageState.coverageRatio * 100).toFixed(0) : '0'}'ini kapsamaktadır.`,
          '',
          '2. DİKKAT ÇEKEN ÖRÜNTÜLER:',
          ...prominentSnippets,
          '',
          balancingSnippets.length > 0
            ? ['3. DENGELEYİCİ ÖZELLİKLER:', ...balancingSnippets, ''].join('\n')
            : '',
          tensionSnippets.length > 0
            ? ['4. AKTİF İÇSEL GERLİMLER:', ...tensionSnippets, ''].join('\n')
            : '',
          synergySnippets.length > 0
            ? ['5. GÜÇLENDİRİCİ SİNERJİLER:', ...synergySnippets, ''].join('\n')
            : '',
          '6. GELİŞİM VE ÖZ-FARKINDALIK:',
          'Bu ampirik eğilimler değişmez birer etiket değil, farklı yaşam bağlamlarında nasıl hareket etmeyi tercih ettiğinizi gösteren eğilimlerdir.',
        ].filter(Boolean).join('\n');

        reflectionPrompts.push(
          'Günlük yaşamınızda bu eğilimlerin en çok hangi durumlarda size avantaj sağladığını düşünüyorsunuz?',
          'Karar verme anlarında dengeleyici özelliklerinizi nasıl devreye sokuyorsunuz?'
        );
      }
    } else if (plan.requestType === 'TENSION_INTERPRETATION') {
      const tension = plan.activatedTensions[0];
      if (tension) {
        titleTr = `Gerilim Açıklaması: ${tension.titleTr}`;
        summaryTr = tension.descriptionTr;
        bodyTr = [
          'Bir yandan profilinizde belirli bir alanda güçlü bir eğilim gözlenirken, diğer yandan ilişkili başka bir boyutta farklı bir yönelim dikkat çekmektedir.',
          '',
          `Detay: ${tension.descriptionTr}`,
          '',
          'Bu iki eğilim bazı durumlarda farklı yönlere çekebilir; ancak bu bir içsel çelişki ya da sorun anlamına gelmez. Aksine duruma göre esneklik sağlayan bir zenginliktir.',
        ].join('\n');
        reflectionPrompts.push(
          'Bu iki eğilimin karşı karşıya geldiği durumlarda hangi tarafın karar süreçlerinizi yönlendirmesini tercih edersiniz?'
        );
      } else {
        titleTr = 'Aktif Gerilim Bulunmuyor';
        summaryTr = 'Ölçülen boyutlarınız arasında belirgin bir içsel gerilim kuralı tetiklenmemiştir.';
        bodyTr = 'Mevcut ölçümleriniz dengeli bir dağılım göstermektedir.';
      }
    } else if (plan.requestType === 'SYNERGY_INTERPRETATION') {
      const synergy = plan.activatedSynergies[0];
      if (synergy) {
        titleTr = `Sinerji Açıklaması: ${synergy.titleTr}`;
        summaryTr = synergy.descriptionTr;
        bodyTr = [
          'Profilinizde birlikte yüksek düzeyde ölçülen bu iki eğilim birbirini desteklemekte ve pekiştirmektedir.',
          '',
          `Detay: ${synergy.descriptionTr}`,
          '',
          'Bu kombinasyon hedeflerinize odaklanırken ve ilişkilerinizi yönetirken birbirini tamamlayan bir güç oluşturur.',
        ].join('\n');
        reflectionPrompts.push(
          'Bu iki özelliğin birbirini beslediği somut bir başarı anınızı hatırlıyor musunuz?'
        );
      } else {
        titleTr = 'Aktif Sinerji';
        summaryTr = 'Ölçülen boyutlar üzerinden genel profil uyumu gözlemlenmektedir.';
        bodyTr = 'Tamamlanan değerlendirmeleriniz temel psikolojik işlevselliğinizi desteklemektedir.';
      }
    } else if (plan.requestType === 'DOMAIN_INTERPRETATION' || plan.requestType === 'CONSTRUCT_INTERPRETATION' || plan.requestType === 'FACET_INTERPRETATION') {
      const targetFacet = plan.primaryEvidence[0];
      if (targetFacet) {
        titleTr = `${targetFacet.titleTr} Boyut Analizi`;
        summaryTr = `${targetFacet.titleTr} boyutu profilinizde ${targetFacet.numericValue !== null ? targetFacet.numericValue.toFixed(2) + '/5.00 puanıyla' : ''} yer almaktadır.`;
        bodyTr = [
          `Tanım: ${targetFacet.scientificRationaleTr || 'Bu boyut temel psikolojik eğilimlerinizi tanımlar.'}`,
          '',
          `Gözlenen Eğilim: Ölçüm sonuçlarınız bu alanda belirgin bir tutarlılık sergilediğinizi göstermektedir.`,
          plan.counterbalancingEvidence.length > 0
            ? `Dengeleyici Faktör: ${plan.counterbalancingEvidence.map((c) => c.titleTr).join(', ')} özellikleri bu eğilimin tek yönlü bir aşırılığa dönüşmesini dengeler.`
            : '',
        ].filter(Boolean).join('\n');
        reflectionPrompts.push(
          `${targetFacet.titleTr} eğiliminizin en belirgin ortaya çıktığı anları gözlemleyin.`
        );
      } else {
        titleTr = 'Ölçüm Henüz Tamamlanmadı';
        summaryTr = 'Bu alan profilinizde henüz doğrudan ölçülmedi.';
        bodyTr = 'Bu alan profilinizde henüz doğrudan ölçülmedi. Daha güvenilir ve kişiselleştirilmiş bir yorum için ilgili değerlendirme modülünü tamamlamanız önerilir.';
        reflectionPrompts.push('Bu alanı keşfetmek için bir sonraki değerlendirmeyi tamamlayabilirsiniz.');
      }
    } else if (plan.requestType === 'ASSESSMENT_RESULT') {
      titleTr = 'Değerlendirme Sonuç Özeti ve Profil Anlamı';
      summaryTr = `Tamamladığınız bu değerlendirme profilinize ${plan.primaryEvidence.length} yeni ölçülmüş boyut kazandırmıştır.`;
      bodyTr = [
        'Bu değerlendirmede elde ettiğiniz sonuçlar, öz-farkındalığınızı derinleştirmek için profilinizin diğer alanlarıyla birlikte analiz edilmektedir.',
        '',
        ...plan.primaryEvidence.map(
          (e) => `• ${e.titleTr}: ${e.numericValue ? e.numericValue.toFixed(2) + '/5.00 — ' : ''}${e.scientificRationaleTr || 'Ölçüm kaydedildi.'}`
        ),
      ].join('\n');
      reflectionPrompts.push(
        'Bu değerlendirmedeki soruları yanıtlarken kendinizle ilgili en çok dikkatinizi çeken farkındalık ne oldu?'
      );
    } else {
      titleTr = 'Psikolojik Değerlendirme İçgörüsü';
      summaryTr = 'Ölçülen kanıtlar üzerinden yapılandırılmış psikolojik analiz.';
      bodyTr = 'Profilinizdeki ampirik ölçümler gelişim ve öz-farkındalık odaklı olarak derlenmiştir.';
    }

    return {
      insightId,
      type: plan.requestType,
      titleTr,
      summaryTr,
      bodyTr,
      claimStrength: plan.primaryEvidence.length > 1
        ? 'MULTI_EVIDENCE_INTERPRETATION'
        : 'DIRECT_MEASUREMENT',
      evidenceRefs: allEvidenceRefs,
      primaryEvidenceRefs,
      supportingEvidenceRefs,
      counterbalancingEvidenceRefs,
      measurementStatus: plan.primaryEvidence.length > 0 ? 'MEASURED_PRECALIBRATION' : 'NOT_MEASURED',
      coverageStatus: `Kapsam: %${(plan.coverageState.coverageRatio * 100).toFixed(0)}`,
      responseQualityStatus: plan.responseQualityState.overallFlag,
      reflectionPrompts,
      limitations,
      generatedAt,
      modelProvider: 'DeterministicFallback',
      modelName: 'psycheai-rules-v2',
      promptVersion: PROMPT_VERSION_ID,
      engineVersion: PROMPT_ENGINE_VERSION,
      isFallback: true,
    };
  }
}

export const deterministicFallbackProvider = new DeterministicFallbackProvider();
