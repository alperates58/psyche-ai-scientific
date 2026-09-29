/**
 * PsycheAI Profile Interpretation & Narrative Synthesis Engine V3
 *
 * Deterministically synthesizes rich, human, non-clinical psychological reports
 * and deep personalized facet interpretations based strictly on measured profile data.
 *
 * Principles:
 * - Evidence grounded: Every interpretation cites real measured facets.
 * - Value-neutral: High is not good, low is not bad. No moral rankings.
 * - Non-clinical: No psychiatric or diagnostic vocabulary.
 * - Actionable: Helps users understand themselves in work, relationships, and decisions.
 */

import { UnifiedPsychologicalProfileV2, FacetProfileV2 } from '@/types/unifiedProfileV2';
import { resolveConsumerScalePosition } from '@/lib/consumerLanguage';
import { MASTER_FACETS, MASTER_DOMAINS } from './masterModelConstants';

export interface ProfileHeroSynthesis {
  headlineTr: string;
  synthesisTextTr: string;
  themeChips: Array<{
    id: string;
    labelTr: string;
    category: string;
    highlightScore?: string;
  }>;
  summaryBulletPoints: string[];
}

export interface PsychologicalReportSection {
  id: string;
  titleTr: string;
  subtitleTr: string;
  narrativeParagraphs: string[];
  groundedFacetIds: string[];
  keyStrengths?: string[];
  balanceNotes?: string[];
}

export interface PersonalizedFacetCardData {
  facetId: string;
  nameTr: string;
  score: number | null;
  bandLabelTr: string;
  scalePositionDescriptionTr: string;
  selfMeaningTr: string;
  dailyLifeTr: string;
  strengthsContextTr: string;
  energyCostContextTr: string;
  relatedTraitsTr: Array<{ facetId: string; nameTr: string; score: number | null }>;
  reflectionQuestionTr: string;
  scientificDefinitionTr: string;
}

/**
 * Generates the hero synthesis answering: "Şu ana kadar profilimde en çok ne öne çıkıyor?"
 */
export function generateProfileHeroSynthesis(profile: UnifiedPsychologicalProfileV2): ProfileHeroSynthesis {
  const measured = profile.facets.filter(
    (f) => f.measurementStatus !== 'NOT_MEASURED' && f.score !== null
  );

  if (measured.length === 0) {
    return {
      headlineTr: 'Psikolojik Profilin Keşif Aşamasında',
      synthesisTextTr: 'Henüz tamamlanmış bir değerlendirme bulunmuyor. İlk envanteri tamamladığında profil sentezin burada belirecektir.',
      themeChips: [
        { id: 'start', labelTr: 'İlk Değerlendirmeyi Başlat', category: 'neutral' }
      ],
      summaryBulletPoints: [
        'Profilinizi oluşturmak için önerilen değerlendirmelere başlayabilirsiniz.'
      ],
    };
  }

  // Sort by score descending to find distinctive high anchors
  const sortedDesc = [...measured].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  // Sort by score ascending to find distinctive lower-end anchors
  const sortedAsc = [...measured].sort((a, b) => (a.score ?? 0) - (b.score ?? 0));

  const top3 = sortedDesc.slice(0, 4);
  const topNames = top3.map((f) => f.nameTr);

  // Determine key themes
  const themeChips: ProfileHeroSynthesis['themeChips'] = [];

  const hasHighConscientiousness = measured.some(
    (f) => ['perfectionism', 'organization', 'diligence', 'long_term_grit'].includes(f.facetId) && (f.score ?? 0) >= 3.8
  );
  const hasHighCuriosity = measured.some(
    (f) => ['epistemic_curiosity', 'inquisitiveness', 'creativity'].includes(f.facetId) && (f.score ?? 0) >= 3.8
  );
  const hasHighHonesty = measured.some(
    (f) => ['sincerity', 'fairness', 'greed_avoidance', 'modesty'].includes(f.facetId) && (f.score ?? 0) >= 3.8
  );
  const hasHighEmpathy = measured.some(
    (f) => ['empathic_concern', 'cognitive_perspective_taking', 'gentleness'].includes(f.facetId) && (f.score ?? 0) >= 3.8
  );
  const hasHighResilience = measured.some(
    (f) => ['distress_tolerance', 'stress_recovery', 'ego_resilience'].includes(f.facetId) && (f.score ?? 0) >= 3.8
  );
  const hasHighSocialBoldness = measured.some(
    (f) => ['social_boldness', 'assertiveness', 'sociability'].includes(f.facetId) && (f.score ?? 0) >= 3.8
  );

  if (hasHighConscientiousness) {
    themeChips.push({ id: 'conscientiousness', labelTr: 'Özen & Yüksek Standartlar', category: 'work' });
  }
  if (hasHighCuriosity) {
    themeChips.push({ id: 'curiosity', labelTr: 'Özgün Düşünme & Merak', category: 'cognition' });
  }
  if (hasHighHonesty) {
    themeChips.push({ id: 'honesty', labelTr: 'İçtenlik & Hakkaniyet', category: 'social' });
  }
  if (hasHighEmpathy) {
    themeChips.push({ id: 'empathy', labelTr: 'İlişkisel Duyarlık & İşbirliği', category: 'relationships' });
  }
  if (hasHighResilience) {
    themeChips.push({ id: 'resilience', labelTr: 'Sağlamlık & Çabuk Toparlanma', category: 'resilience' });
  }
  if (hasHighSocialBoldness) {
    themeChips.push({ id: 'boldness', labelTr: 'Sosyal Girişkenlik & Açıklık', category: 'social' });
  }

  // Fallback chips if domain-specific flags did not trigger
  if (themeChips.length < 3) {
    for (const f of top3) {
      if (!themeChips.some((c) => c.labelTr.includes(f.nameTr))) {
        themeChips.push({
          id: f.facetId,
          labelTr: f.nameTr,
          category: 'personality',
          highlightScore: f.score ? `${f.score.toFixed(1)}/5` : undefined,
        });
      }
    }
  }

  const unmeasuredDomainsCount = profile.domains.filter((d) => d.measuredFacetCount === 0).length;
  const coverageNote = unmeasuredDomainsCount > 0
    ? `Bazı sosyal, duygusal ve değer boyutları henüz daha sınırlı ölçülmüş durumda.`
    : `Tüm temel alanlarda kapsamlı veri kaydedildi.`;

  const synthesisTextTr = `Şu ana kadar ölçülen sonuçlarında özellikle ${topNames.slice(0, 3).join(', ')} gibi özelliklerin öne çıkıyor. Karar alma ve çalışma süreçlerinde belirgin bir tutarlılık ve odak gözlenirken, ${coverageNote}`;

  const summaryBulletPoints = [
    `En belirgin eğilimlerin: ${top3.map((f) => `${f.nameTr} (${resolveConsumerScalePosition(f.score).labelTr})`).join(', ')}.`,
    hasHighConscientiousness
      ? 'Çalışma tarzında detaylara özen, disiplinli planlama ve standartları yüksek tutma isteği belirleyici.'
      : 'Çalışma tarzında esneklik ve durumsal akışa uyum sağlama eğilimi gözleniyor.',
    hasHighCuriosity
      ? 'Düşünme biçiminde yeni fikirleri araştırma, derinlemesine anlama ve kavramsal merak kuvvetli.'
      : 'Düşünme tarzında daha pratik, somut ve doğrudan sonuç veren yöntemleri tercih etme eğilimi var.',
    hasHighHonesty
      ? 'Kişilerarası ilişkilerde dürüstlük, yapmacıksızlık ve adalete saygı öncelikli bir duruş oluşturuyor.'
      : 'Sosyal süreçlerde stratejik esneklik ve pragmatik denge arayışı öne çıkıyor.',
  ];

  return {
    headlineTr: 'Psikolojik Profilin',
    synthesisTextTr,
    themeChips: themeChips.slice(0, 5),
    summaryBulletPoints,
  };
}

/**
 * Builds the comprehensive structured psychological report answering the 10 core questions (Section 15).
 */
export function generateStructuredPsychologicalReport(
  profile: UnifiedPsychologicalProfileV2
): PsychologicalReportSection[] {
  const sections: PsychologicalReportSection[] = [];
  const facetsMap = new Map<string, FacetProfileV2>();
  for (const f of profile.facets) {
    if (f.measurementStatus !== 'NOT_MEASURED' && f.score !== null) {
      facetsMap.set(f.facetId, f);
    }
  }

  // 1. GENEL PSİKOLOJİK PORTRE
  const topFacets = Array.from(facetsMap.values()).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  if (topFacets.length >= 2) {
    sections.push({
      id: 'portrait',
      titleTr: 'GENEL PSİKOLOJİK PORTRE',
      subtitleTr: 'Profilin bütününe bakıldığında kendini nasıl ortaya koyuyorsun?',
      narrativeParagraphs: [
        `Tamamlanan değerlendirmeler üzerinden oluşan psikolojik portren, belirli alanlarda yüksek bir içsel netlik ve kararlılık gösterdiğini ortaya koyuyor. Özellikle ${topFacets.slice(0, 3).map((f) => f.nameTr).join(', ')} alanlarındaki belirgin yanıt konumu, yaşamındaki temel motivasyonların ve eylem tarzının ana omurgasını oluşturuyor.`,
        `Bu profil, tek bir dar etiketle tanımlanmaktan ziyade, farklı durumlar karşısında nasıl düşündüğünü, başkalarıyla nasıl bağ kurduğunu ve zorluklar karşısında enerjini nasıl yönettiğini gösteren çok katmanlı bir koordinat bütünüdür.`
      ],
      groundedFacetIds: topFacets.slice(0, 4).map((f) => f.facetId),
    });
  }

  // 2. NASIL DÜŞÜNÜYORSUN (Cognitive style, curiosity, openness)
  const cogFacets = ['epistemic_curiosity', 'inquisitiveness', 'creativity', 'aesthetic_appreciation', 'unconventionality']
    .map((id) => facetsMap.get(id))
    .filter((f): f is FacetProfileV2 => !!f);

  if (cogFacets.length >= 1) {
    const highCuriosity = cogFacets.some((f) => (f.score ?? 0) >= 3.6);
    sections.push({
      id: 'thinking',
      titleTr: 'NASIL DÜŞÜNÜYORSUN',
      subtitleTr: 'Zihinsel merak, kavrayış ve yeni fikirlere yaklaşım tarzın',
      narrativeParagraphs: [
        highCuriosity
          ? 'Zihinsel dünyan, yüzeysel açıklamalarla yetinmeyip konuların derinine inmeyi ve kavramsal bağlantılar kurmayı seven bir yapı sergiliyor. Yeni fikirler ve sıra dışı bakış açıları zihnini canlandırırken, bilginin mantıksal tutarlılığı senin için önemli bir kıstas.'
          : 'Düşünme tarzında daha çok somut, uygulanabilir ve pratik çözümlere odaklanan bir zihinsel tutum öne çıkıyor. Soyut teoriler yerine, gerçek hayatta işe yarayan net yaklaşımlar senin için daha çekici.',
        'Karşılaştığın problemlere yaklaşırken bilgiyi nasıl işlediğin, sadece neyi bildiğinle değil, yeni durumlara ne kadar açık olduğunla da yakından ilgilidir.'
      ],
      groundedFacetIds: cogFacets.map((f) => f.facetId),
    });
  }

  // 3. NASIL KARAR VERİYORSUN (Decision-making, prudence, flexibility)
  const decFacets = ['prudence', 'deliberation', 'risk_taking_social', 'cognitive_flexibility']
    .map((id) => facetsMap.get(id))
    .filter((f): f is FacetProfileV2 => !!f);

  if (decFacets.length >= 1) {
    const isDeliberate = decFacets.some((f) => ['prudence', 'deliberation'].includes(f.facetId) && (f.score ?? 0) >= 3.6);
    sections.push({
      id: 'deciding',
      titleTr: 'NASIL KARAR VERİYORSUN',
      subtitleTr: 'Seçim yaparken içgüdülerin, analitik değerlendirmelerin ve tempo dinamiklerin',
      narrativeParagraphs: [
        isDeliberate
          ? 'Karar süreçlerinde aceleci adımlar yerine olası sonuçları tartma, riskleri minimize etme ve planlı ilerleme eğilimi gösteriyorsun. Karar vermeden önce seçenekleri düşünmek sana güven sağlarken, belirsiz adımlardan kaçınma ihtiyacı duyuyorsun.'
          : 'Karar alırken uzun uzadıya beklemek yerine durumsal sezgilerine ve anlık fırsatlara daha fazla güvenebiliyorsun. Hızlı karar alabilme kapasiten seni çevik kılarken, kimi zaman ayrıntıları sonradan toparlama gereği doğabiliyor.'
      ],
      groundedFacetIds: decFacets.map((f) => f.facetId),
    });
  }

  // 4. İŞLERİ NASIL YÜRÜTÜYORSUN (Execution, organization, diligence, grit)
  const workFacets = ['organization', 'diligence', 'perfectionism', 'long_term_grit', 'general_self_control']
    .map((id) => facetsMap.get(id))
    .filter((f): f is FacetProfileV2 => !!f);

  if (workFacets.length >= 1) {
    const isHighOrg = workFacets.some((f) => ['organization', 'perfectionism', 'diligence'].includes(f.facetId) && (f.score ?? 0) >= 3.8);
    sections.push({
      id: 'execution',
      titleTr: 'İŞLERİ NASIL YÜRÜTÜYORSUN',
      subtitleTr: 'Hedef takibi, çalışma disiplini, düzen ve sürdürülebilir çaba',
      narrativeParagraphs: [
        isHighOrg
          ? 'Bir işe giriştiğinde yüksek kalite standartları, detaylara sadakat ve düzenli takip senin doğal çalışma ritmini oluşturuyor. Başladığın işi yarım bırakmama arzusu ve sorumluluk bilinci, uzun vadeli projelerde seni son derece güvenilir bir icracı kılıyor.'
          : 'Çalışma tarzında katı kurallardan ziyade esnek çalışma modelleri ve durumsal öncelikler öne çıkıyor. Planlar değiştiğinde hızlı adapte olabiliyor, kuralları duruma göre esnetebiliyorsun.'
      ],
      groundedFacetIds: workFacets.map((f) => f.facetId),
      keyStrengths: isHighOrg ? ['Yüksek kalite ve titizlik', 'Uzun soluklu görevlerde sebat'] : ['Esnek çalışma kapasitesi', 'Değişen koşullara uyum'],
    });
  }

  // 5. İNSANLARLA NASIL İLİŞKİ KURUYORSUN (Interpersonal dynamics, empathy, assertiveness)
  const relFacets = ['sincerity', 'fairness', 'social_boldness', 'sociability', 'gentleness', 'forgivingness', 'empathic_concern', 'assertiveness']
    .map((id) => facetsMap.get(id))
    .filter((f): f is FacetProfileV2 => !!f);

  if (relFacets.length >= 1) {
    const sincerity = facetsMap.get('sincerity')?.score ?? 3.5;
    const boldness = facetsMap.get('social_boldness')?.score ?? 3.5;
    sections.push({
      id: 'relationships',
      titleTr: 'İNSANLARLA NASIL İLİŞKİ KURUYORSUN',
      subtitleTr: 'Sosyal yakınlık, ifade cesareti, güven ve sınır koyma dinamiklerin',
      narrativeParagraphs: [
        sincerity >= 3.8
          ? 'Sosyal ilişkilerinde yapmacıklıktan ve manipülatif tavırlardan hoşlanmayan, doğrudan ve içten bir iletişim tonunu benimsiyorsun. İnsanlarla bağ kurarken dürüstlük ve karşılıklı güven senin için temel vazgeçilmez.'
          : 'İlişkilerinde daha stratejik ve diplomatik bir denge gözetebiliyor, sosyal duruma göre esnek pozisyonlar alabiliyorsun.',
        boldness >= 3.8
          ? 'Topluluk önünde konuşmaktan, kendini ifade etmekten ve yeni ortamlara girmekten çekinmiyorsun. Girişkenliğin sosyal kapıları daha hızlı açmanı sağlıyor.'
          : 'Sosyal ortamlarda daha gözlemci, seçici ve derin bağları az sayıda kişiyle kurmayı tercih eden bir profil sergiliyorsun.'
      ],
      groundedFacetIds: relFacets.map((f) => f.facetId),
    });
  }

  // 6. BASKI VE STRES ALTINDA NASIL ÇALIŞIYORSUN (Stress resilience, anxiety, emotion regulation)
  const stressFacets = ['anxiety', 'fearfulness', 'stress_recovery', 'distress_tolerance', 'cognitive_reappraisal']
    .map((id) => facetsMap.get(id))
    .filter((f): f is FacetProfileV2 => !!f);

  if (stressFacets.length >= 1) {
    const anxietyScore = facetsMap.get('anxiety')?.score ?? 3.0;
    const recoveryScore = facetsMap.get('stress_recovery')?.score ?? 3.0;
    sections.push({
      id: 'stress',
      titleTr: 'BASKI VE STRES ALTINDA NASIL ÇALIŞIYORSUN',
      subtitleTr: 'Zorlayıcı koşullarda duygusal toparlanma ve baskı yönetimi',
      narrativeParagraphs: [
        anxietyScore <= 2.5
          ? 'Zorlu durumlar karşısında soğukkanlılığını koruyabilen ve endişenin zihnini esir almasına izin vermeyen bir dayanıklılık örüntüsü gösteriyorsun. Baskı altında paniklemek yerine odağını çözüme yöneltebiliyorsun.'
          : anxietyScore >= 3.8
          ? 'Baskı ve belirsizlik anlarında zihninin olası risk senaryolarına hızla yöneldiği ve içsel gerilim hissettiğin durumlar olabiliyor. Bu duyarlık seni dikkatli kılarken, toparlanma için güvenli ortamlara ihtiyaç duymanı sağlayabiliyor.'
          : 'Stresli durumlarda orta düzey bir temkin ve denge sergiliyorsun; olağan dalgalanmaları yönetebilecek bir dayanıklılık düzeyine sahipsin.'
      ],
      groundedFacetIds: stressFacets.map((f) => f.facetId),
    });
  }

  // 7. SENİ NE MOTİVE EDİYOR (Needs, values, drives)
  const motFacets = ['autonomy_need_satisfaction', 'competence_need_satisfaction', 'relatedness_need_satisfaction', 'presence_of_meaning', 'search_for_meaning']
    .map((id) => facetsMap.get(id))
    .filter((f): f is FacetProfileV2 => !!f);

  if (motFacets.length >= 1) {
    sections.push({
      id: 'motivation',
      titleTr: 'SENİ NE MOTİVE EDİYOR',
      subtitleTr: 'İçsel yakıtın, tatmin kaynakların ve yaşamında anlam arayışın',
      narrativeParagraphs: [
        'Eylemlerini harekete geçiren en temel güçler, sadece dışsal ödüller değil; kendi kararlarını alabilme (özerklik), bir alanda ustalaşma (yetkinlik) ve değer ürettiğini hissetme arzusudur.',
        'Kendi kontrolünde olan hedefler üzerinde çalışmak ve emeğinin somut sonuçlarını görmek içsel motivasyonunu en üst seviyede tutuyor.'
      ],
      groundedFacetIds: motFacets.map((f) => f.facetId),
    });
  }

  // 8. BİRBİRİNİ DESTEKLEYEN ÖZELLİKLERİN (Synergies)
  if (profile.synergies && profile.synergies.length > 0) {
    sections.push({
      id: 'synergies',
      titleTr: 'BİRBİRİNİ DESTEKLEYEN ÖZELLİKLERİN',
      subtitleTr: 'Birlikte yüksek düzeyde ölçülen ve gücünü artıran kombinasyonlar',
      narrativeParagraphs: profile.synergies.map((s) => `${s.titleTr}: ${s.descriptionTr}`),
      groundedFacetIds: profile.synergies.flatMap((s) => s.sourceFacetIds || []),
    });
  }

  // 9. HASSAS DENGE NOKTALARIN (Tensions)
  if (profile.tensions && profile.tensions.length > 0) {
    sections.push({
      id: 'tensions',
      titleTr: 'HASSAS DENGE NOKTALARIN',
      subtitleTr: 'Farklı bağlamlarda birbirini dengelemesi gereken içsel dinamikler',
      narrativeParagraphs: profile.tensions.map((t) => `${t.titleTr}: ${t.descriptionTr}`),
      groundedFacetIds: profile.tensions.flatMap((t) => t.sourceFacetIds || []),
    });
  }

  // 10. HENÜZ YETERİNCE KEŞFEDİLMEYEN ALANLAR
  const unmeasuredDomains = profile.domains.filter((d) => d.measuredFacetCount === 0);
  if (unmeasuredDomains.length > 0) {
    sections.push({
      id: 'unmeasured',
      titleTr: 'HENÜZ YETERİNCE KEŞFEDİLMEYEN ALANLAR',
      subtitleTr: 'Profilini tamamlamak için keşfedilmeyi bekleyen alanlar',
      narrativeParagraphs: [
        `Şu an profilinde ${unmeasuredDomains.map((d) => d.nameTr).join(', ')} alanları henüz ölçülmemiştir.`,
        'Bu alanları tamamlamak, kendini anlama sürecini daha bütüncül ve derin bir perspektife taşıyacaktır.'
      ],
      groundedFacetIds: [],
    });
  }

  return sections;
}

/**
 * Generates deep personalized interpretations for an individual Facet card V3.
 * Replaces dictionary-style static definitions with score-specific consumer text.
 */
export function generatePersonalizedFacetInterpretation(
  facet: FacetProfileV2,
  allFacets: FacetProfileV2[]
): PersonalizedFacetCardData {
  const score = facet.score;
  const pos = resolveConsumerScalePosition(score);

  // Fallback scientific definition
  const meta = MASTER_FACETS.find((m) => m.facetId === facet.facetId);
  const scientificDef = facet.scientificDefinitionTr || meta?.scientificDefinitionTr || 'Bu alt boyut ilgili psikolojik yapının temel bir bileşenini ölçmektedir.';

  // Build personalized interpretations based on scale position
  let selfMeaningTr = '';
  let dailyLifeTr = '';
  let strengthsContextTr = '';
  let energyCostContextTr = '';
  let reflectionQuestionTr = '';

  const isHigh = (score ?? 3.0) >= 3.8;
  const isLow = (score ?? 3.0) <= 2.5;

  switch (facet.facetId) {
    case 'sincerity':
      selfMeaningTr = isHigh
        ? 'İlişkilerinde yapmacıksız, dürüst ve olduğun gibi davranmayı temel bir ilke olarak benimsiyorsun.'
        : isLow
        ? 'Sosyal ortamlarda daha esnek, stratejik ve duruma göre uyumlanan bir iletişim tarzı tercih edebiliyorsun.'
        : 'Doğallık ile sosyal nezaket arasında durumsal bir denge kurarak hareket ediyorsun.';
      dailyLifeTr = isHigh
        ? 'İnsanlara arkalarından konuşmak yerine açık ve net olmayı seçiyor, manipülatif davranışlardan uzak duruyorsun.'
        : 'Sosyal ortamlarda ne zaman ne söyleyeceğini dikkatle tartan diplomatik bir tutum sergiliyorsun.';
      strengthsContextTr = isHigh
        ? 'Derin güven gerektiren dostluklarda ve uzun vadeli ortaklıklarda çok sağlam bir temel sağlar.'
        : 'Politik ve hassas ortamlarda çatışma yaratmadan ilerlemene yardımcı olur.';
      energyCostContextTr = isHigh
        ? 'Aşırı yüzeysel veya politik sosyal ortamlarda kendini rol yapmak zorunda hissettiğinde enerjin hızla düşebilir.'
        : 'Sürekli hesaplı davranmak gerektiğinde içsel bir yorgunluk oluşabilir.';
      reflectionQuestionTr = 'İçtenliğinin sana en çok güç verdiği ve en çok zorlandığı anlar hangileri?';
      break;

    case 'perfectionism':
      selfMeaningTr = isHigh
        ? 'Yaptığın işlerde yüksek standartlar koyuyor, detaylardaki kusurları hızla fark edip iyileştirmek istiyorsun.'
        : isLow
        ? 'Aşırı detaylara takılmadan işin ana hatlarına ve hızla tamamlanmasına odaklanmayı seçiyorsun.'
        : 'Standart ile pratiklik arasında duruma göre değişen bir denge gözetiyorsun.';
      dailyLifeTr = isHigh
        ? 'Bir projeyi teslim etmeden önce defalarca kontrol eder, hataları görmezden gelmekte zorlanırsın.'
        : 'Yeterince iyi olanı belirleyip sonraki göreve geçmekte zorlanmazsın.';
      strengthsContextTr = isHigh
        ? 'Hata payının sıfır olduğu kritik ve hassas projelerde mükemmel sonuçlar üretmeni sağlar.'
        : 'Zaman kısıtlı olduğunda hızlı ilerlemeni ve tıkanmamanı sağlar.';
      energyCostContextTr = isHigh
        ? 'Hızlı bitmesi gereken işlerde ayrıntılara fazla odaklandığında zaman baskısı hissedebilirsin.'
        : 'Yüksek hassasiyet gerektiren detaylı kontrollerde çabuk sıkılabilirsin.';
      reflectionQuestionTr = 'Mükemmel olan ile yeterince iyi olan arasındaki sınırı hangi durumlarda daha rahat çekebiliyorsun?';
      break;

    case 'long_term_grit':
      selfMeaningTr = isHigh
        ? 'Karşına çıkan engellere rağmen belirlediğin uzun vadeli hedeflerden kolayca vazgeçmeyen bir sebat sergiliyorsun.'
        : isLow
        ? 'Süreç tıkandığında rotanı hızla değiştirebilen, katı ısrarlardan kaçınan esnek bir duruşun var.'
        : 'Önem verdiğin konularda sabır gösterirken, gereksiz ısrarlardan kaçınabiliyorsun.';
      dailyLifeTr = isHigh
        ? 'Zorluklar seni hemen yıldırmaz; motivasyonun düşse dahi çalışmaya ve planına sadık kalmaya devam edersin.'
        : 'Bir yaklaşım sonuç vermediğinde alternatif yolları denemekte tereddüt etmezsin.';
      strengthsContextTr = isHigh
        ? 'Aylar veya yıllar süren büyük projelerde, sabır gerektiren kariyer ve eğitim süreçlerinde başarı getirir.'
        : 'Hızla değişen çevresel şartlarda esnek rota düzeltmeleri yapmanı sağlar.';
      energyCostContextTr = isHigh
        ? 'Artık sana hizmet etmeyen bir hedefi bırakmakta ya da gereksiz bir inada dönüştüğünde zorlanabilirsin.'
        : 'Sıkıcı ve rutin uzun vadeli süreçlerde odaklanmak zorlaşabilir.';
      reflectionQuestionTr = 'Sebatın ne zaman senin en büyük gücün, ne zaman gereksiz bir yıpranma haline geliyor?';
      break;

    case 'epistemic_curiosity':
      selfMeaningTr = isHigh
        ? 'Yeni kavramları, kuramları ve bilinmeyenleri öğrenmeye karşı güçlü bir zihinsel açlık ve merak duyuyorsun.'
        : isLow
        ? 'Pratik hayatta işine yaramayacak teorik bilgiler yerine somut gerçeklere odaklanmayı yeğliyorsun.'
        : 'İlgi duyduğun alanlarda meraklı, diğer konularda daha pragmatik bir bilgi yaklaşımın var.';
      dailyLifeTr = isHigh
        ? 'Bir konuyu merak ettiğinde saatlerce araştırabilir, farklı kaynaklardan bilgi toplamaktan keyif alırsın.'
        : 'Bilgiyi ancak doğrudan bir problemi çözmek için gerektiğinde edinmeyi seçersin.';
      strengthsContextTr = isHigh
        ? 'Yenilikçi fikirler geliştirme, karmaşık sistemleri kavrama ve entelektüel derinlik gerektiren alanlarda parlar.'
        : 'Uygulamaya yönelik işlerde kafa karışıklığı yaşamadan hızla aksiyon almanı sağlar.';
      energyCostContextTr = isHigh
        ? 'Aşırı bilgi toplama isteği bazen uygulamaya geçmeyi ertelemene yol açabilir.'
        : 'Kuramsal ve soyut tartışmalar içeren ortamlarda çabuk sıkılabilirsin.';
      reflectionQuestionTr = 'Öğrenme merakın günlük hayatındaki pratik hedeflerini nasıl besliyor?';
      break;

    default:
      // Generic personalized template
      selfMeaningTr = isHigh
        ? `${facet.nameTr} eğilimin profilinin üst bandında yer alıyor. Bu durum, ilgili alandaki davranış örüntülerinde belirgin ve tutarlı bir yönelim sergilediğini gösteriyor.`
        : isLow
        ? `${facet.nameTr} eğilimin profilinin alt bandına yakın. Bu durum bir eksiklik değil; bu alanda daha serbest, esnek ve zorunluluk hissetmeden hareket ettiğin anlamına gelir.`
        : `${facet.nameTr} eğilimin ölçeğin dengeli orta bölgesinde yer alıyor. Duruma ve bağlama göre esneklik gösterebilen bir profil çiziyorsun.`;
      dailyLifeTr = isHigh
        ? `Günlük yaşamında bu eğilim, kararlarında ve tepkilerinde öncelikli bir referans noktası olarak sıkça kendini hissettirir.`
        : isLow
        ? `Bu alan günlük kararlarında seni katı bir biçimde sınırlamaz; durumsal koşullara göre davranırsın.`
        : `Durumun gerektirdiği anlarda bu özelliği devreye sokabilir, gerekmediğinde geri planda tutabilirsin.`;
      strengthsContextTr = isHigh
        ? 'Bu özelliğin gerektirdiği odaklanma, özen ve netlik isteyen durumlarda sana belirgin bir avantaj kazandırır.'
        : 'Esneklik, hız ve duruma göre uyarlanabilirlik gerektiren anlarda işini kolaylaştırır.';
      energyCostContextTr = isHigh
        ? 'Bu eğilimin tam tersinin talep edildiği ortamlarda kendini biraz kısıtlanmış hissedebilirsin.'
        : 'Bu alanda yüksek bir standart veya ısrar talep edildiğinde ek bir efor sarf etmen gerekebilir.';
      reflectionQuestionTr = `Bu özelliğin (${facet.nameTr}) günlük hayatında en çok hangi durumlarda sana fayda sağlıyor?`;
      break;
  }

  // Find related measured facets from the same construct or domain
  const relatedTraitsTr = allFacets
    .filter((f) => f.facetId !== facet.facetId && f.score !== null && (f.constructId === facet.constructId || f.domainId === facet.domainId))
    .slice(0, 3)
    .map((f) => ({
      facetId: f.facetId,
      nameTr: f.nameTr,
      score: f.score,
    }));

  return {
    facetId: facet.facetId,
    nameTr: facet.nameTr,
    score,
    bandLabelTr: pos.labelTr,
    scalePositionDescriptionTr: pos.descriptionTr,
    selfMeaningTr,
    dailyLifeTr,
    strengthsContextTr,
    energyCostContextTr,
    relatedTraitsTr,
    reflectionQuestionTr,
    scientificDefinitionTr: scientificDef,
  };
}
