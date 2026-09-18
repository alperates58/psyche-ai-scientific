/**
 * FAZ 2.21: Journal Observation & Dynamic Pattern Service
 * Dynamic Repeated-Theme Computation, Contextual Variation & Evidence Grounding
 */

import {
  JournalEntryV1,
  JournalObservationSummaryV1,
  RepeatedThemeV1,
  MultiContextThemeV1,
  JournalObservationBundleV1,
  JournalContextTag,
  VALID_JOURNAL_CONTEXT_TAGS,
  JournalRelationshipType,
  JournalProfileRelationshipV1,
} from '@/types/journal';
import { UnifiedPsychologicalProfileV2, FacetProfileV2 } from '@/types/unifiedProfileV2';
import { MASTER_FACETS, MASTER_DOMAINS, MASTER_CONSTRUCTS } from '@/lib/profile/masterModelConstants';
import { getJournalEntries } from './journalService';
import { getCurrentUnifiedProfile } from './unifiedProfileService';

/**
 * Common emotion dictionary for descriptive self-expression extraction
 * Strictly non-diagnostic (USER_EXPRESSED_EMOTION)
 */
const EMOTION_LEXICON: Record<string, string[]> = {
  öfke: ['öfke', 'kızgın', 'sinirli', 'öfkelendim', 'çıldırdım'],
  kaygı: ['kaygı', 'endişe', 'tedirgin', 'korku', 'panik', 'endişeliyim'],
  üzüntü: ['üzüntü', 'üzgün', 'kırgın', 'mutsuz', 'hüzün', 'moralim bozuk'],
  rahatlama: ['rahatlama', 'hafifleme', 'ferahlama', 'huzurlu', 'dingin'],
  heyecan: ['heyecan', 'coşku', 'istekli', 'hevesli', 'motive'],
  hayal_kırıklığı: ['hayal kırıklığı', 'beklenti', 'boşa gitti', 'yenilgi'],
  yorgunluk: ['tükenmişlik', 'yorgunluk', 'bitkin', 'yorgunum', 'aşırı stres'],
};

/**
 * Context-to-Facet relevance mapping for observational alignment
 */
const CONTEXT_FACET_MAP: Record<JournalContextTag, string[]> = {
  WORK: [
    'diligence',
    'perfectionism',
    'organization',
    'liveliness',
    'social_boldness',
    'long_term_grit',
    'general_self_control',
    'competence_need_satisfaction',
    'anxiety',
    'stress_recovery',
  ],
  RELATIONSHIPS: [
    'forgivingness',
    'gentleness',
    'flexibility',
    'patience',
    'empathic_concern',
    'cognitive_perspective_taking',
    'attachment_anxiety',
    'attachment_avoidance',
    'relatedness_need_satisfaction',
  ],
  FAMILY: [
    'forgivingness',
    'sentimentality',
    'attachment_anxiety',
    'attachment_avoidance',
    'relatedness_need_satisfaction',
  ],
  DECISION_MAKING: [
    'prudence',
    'rational_analytical_thinking',
    'intuitive_experiential_thinking',
    'intolerance_of_uncertainty',
    'need_for_cognitive_closure',
    'decision_style_maximizing',
  ],
  STRESS: [
    'fearfulness',
    'anxiety',
    'dependence',
    'distress_tolerance',
    'stress_recovery',
    'ego_resilience',
    'negative_affect_trait',
  ],
  SOCIAL: [
    'social_self_esteem',
    'social_boldness',
    'sociability',
    'liveliness',
    'social_connectedness',
    'assertiveness',
  ],
  SELF_IMAGE: [
    'core_self_esteem',
    'generalized_self_efficacy',
    'authenticity',
    'self_compassion',
    'self_concept_clarity',
  ],
  GOALS: [
    'long_term_grit',
    'diligence',
    'presence_of_meaning',
    'search_for_meaning',
    'competence_need_satisfaction',
  ],
  HEALTH: [
    'subjective_vitality',
    'stress_recovery',
    'flourishing_scale',
  ],
  LIFE_EVENT: [
    'ego_resilience',
    'stress_recovery',
    'cognitive_flexibility',
    'presence_of_meaning',
  ],
  GENERAL: [
    'inquisitiveness',
    'authenticity',
    'growth_mindset_intelligence',
  ],
};

/**
 * Computes dynamic observation summary from active user journal entries
 * Invariant: Never modifies psychometric scores or profile coverage
 */
export async function computeDynamicObservationSummary(
  userId: string,
  providedEntries?: JournalEntryV1[],
  providedProfile?: UnifiedPsychologicalProfileV2
): Promise<JournalObservationSummaryV1> {
  const entries = providedEntries || (await getJournalEntries(userId));
  const profile = providedProfile || (await getCurrentUnifiedProfile(userId));

  const activeEntries = entries.filter((e) => !e.deletedAt);
  const entryCount = activeEntries.length;

  // 1. Date Range
  let dateRange: { start: string; end: string } | null = null;
  if (entryCount > 0) {
    const dates = activeEntries.map((e) => e.createdAt).sort();
    dateRange = { start: dates[0], end: dates[dates.length - 1] };
  }

  // 2. Dominant Context Distribution
  const contextCounts: Record<JournalContextTag, number> = {} as any;
  for (const t of VALID_JOURNAL_CONTEXT_TAGS) contextCounts[t] = 0;

  for (const entry of activeEntries) {
    for (const tag of entry.contextTags) {
      if (contextCounts[tag] !== undefined) {
        contextCounts[tag]++;
      }
    }
  }

  const totalContextOccurrences = Object.values(contextCounts).reduce((a, b) => a + b, 0);
  const dominantContexts = Object.entries(contextCounts)
    .filter(([_, count]) => count > 0)
    .map(([context, count]) => ({
      context: context as JournalContextTag,
      count,
      percentage:
        totalContextOccurrences > 0 ? Math.round((count / totalContextOccurrences) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // 3. Repeated Themes (Rule: >= 3 entries, >= 2 distinct calendar dates)
  const repeatedThemes = computeRepeatedThemes(activeEntries);

  // 4. Multi-Context Themes (Rule: >= 3 entries, >= 2 contexts, >= 2 distinct dates)
  const multiContextThemes = computeMultiContextThemes(activeEntries);

  // 5. Emotion Extraction (Descriptive)
  const repeatedEmotions = extractEmotions(activeEntries);

  // 6. Profile Alignment & Contextual Variations
  const { profileAlignedThemes, contextualVariations, unmeasuredRelevantAreas } =
    evaluateProfileObservationalLinks(activeEntries, profile);

  // 7. Life Events
  const lifeEvents = activeEntries
    .filter((e) => e.isLifeEvent && e.lifeEventType)
    .map((e) => ({
      entryId: e.id,
      date: e.createdAt,
      eventType: e.lifeEventType!,
      title: e.title || null,
    }));

  return {
    userId,
    entryCount,
    activeEntriesCount: entryCount,
    dateRange,
    dominantContexts,
    repeatedThemes,
    multiContextThemes,
    repeatedEmotions,
    profileAlignedThemes,
    contextualVariations,
    unmeasuredRelevantAreas,
    lifeEvents,
    limitations: [
      'Günlük kayıtları kişisel öz-bildirimlerdir; psikometrik ölçüm yerine geçmez.',
      'Tekrarlanan temalar operasyonel gözlemlerdir; psikolojik tanı teşkil etmez.',
      'Bağlamsal farklılıklar genel kişiliği geçersiz kılmaz, durumsal dinamikleri betimler.',
    ],
  };
}

/**
 * Compute Repeated Themes
 * Invariant: >= 3 entries AND >= 2 distinct calendar dates
 */
function computeRepeatedThemes(entries: JournalEntryV1[]): RepeatedThemeV1[] {
  const contextGroups: Record<JournalContextTag, JournalEntryV1[]> = {} as any;
  for (const tag of VALID_JOURNAL_CONTEXT_TAGS) contextGroups[tag] = [];

  for (const entry of entries) {
    for (const tag of entry.contextTags) {
      if (contextGroups[tag]) {
        contextGroups[tag].push(entry);
      }
    }
  }

  const repeated: RepeatedThemeV1[] = [];

  for (const tag of VALID_JOURNAL_CONTEXT_TAGS) {
    const group = contextGroups[tag];
    if (!group || group.length < 3) continue;

    // Check distinct calendar dates (YYYY-MM-DD)
    const distinctDates = new Set(group.map((e) => e.createdAt.split('T')[0]));
    if (distinctDates.size < 2) continue;

    const dates = group.map((e) => e.createdAt).sort();
    const relatedFacets = (CONTEXT_FACET_MAP[tag] || []).slice(0, 3);

    repeated.push({
      themeKey: `theme_${tag.toLowerCase()}_repeated`,
      themeTitleTr: getContextThemeTitle(tag),
      context: tag,
      entryCount: group.length,
      distinctDatesCount: distinctDates.size,
      dateRange: { start: dates[0], end: dates[dates.length - 1] },
      sampleEntryIds: group.slice(0, 5).map((e) => e.id),
      status: 'REPEATED_SELF_REPORT',
      relatedFacetIds: relatedFacets,
      summaryTr: `Farklı ${distinctDates.size} günde kaydedilen ${group.length} yansımada ${getContextLabelTr(tag)} bağlamı belirgin şekilde tekrar etti.`,
    });
  }

  return repeated;
}

/**
 * Compute Multi-Context Themes
 * Invariant: >= 3 entries, >= 2 distinct contexts, >= 2 distinct dates
 */
function computeMultiContextThemes(entries: JournalEntryV1[]): MultiContextThemeV1[] {
  // Check decision or stress across multiple contexts
  const multiThemes: MultiContextThemeV1[] = [];

  // Theme 1: Cross-context stress / challenge
  const stressEntries = entries.filter(
    (e) =>
      e.entryType === 'STRESS' ||
      e.entryType === 'CHALLENGE' ||
      e.contextTags.includes('STRESS') ||
      (e.stressSelfReport !== null && e.stressSelfReport !== undefined && e.stressSelfReport >= 4)
  );

  if (stressEntries.length >= 3) {
    const distinctDates = new Set(stressEntries.map((e) => e.createdAt.split('T')[0]));
    const allContexts = new Set<JournalContextTag>();
    stressEntries.forEach((e) => e.contextTags.forEach((t) => allContexts.add(t)));

    if (distinctDates.size >= 2 && allContexts.size >= 2) {
      multiThemes.push({
        themeKey: 'multi_context_stress_demand',
        themeTitleTr: 'Çoklu Bağlamda Stres ve Zorlanma Deneyimi',
        contexts: Array.from(allContexts),
        entryCount: stressEntries.length,
        distinctDatesCount: distinctDates.size,
        sampleEntryIds: stressEntries.slice(0, 5).map((e) => e.id),
        summaryTr: `Hem ${Array.from(allContexts).slice(0, 2).map(getContextLabelTr).join(' hem de ')} bağlamında stres ve zorlanma teması gözlendi.`,
      });
    }
  }

  // Theme 2: Cross-context decision making
  const decisionEntries = entries.filter(
    (e) => e.entryType === 'DECISION' || e.contextTags.includes('DECISION_MAKING')
  );

  if (decisionEntries.length >= 3) {
    const distinctDates = new Set(decisionEntries.map((e) => e.createdAt.split('T')[0]));
    const allContexts = new Set<JournalContextTag>();
    decisionEntries.forEach((e) => e.contextTags.forEach((t) => allContexts.add(t)));

    if (distinctDates.size >= 2 && allContexts.size >= 2) {
      multiThemes.push({
        themeKey: 'multi_context_deliberation',
        themeTitleTr: 'Farklı Alanlarda Karar Verme Süreçleri',
        contexts: Array.from(allContexts),
        entryCount: decisionEntries.length,
        distinctDatesCount: distinctDates.size,
        sampleEntryIds: decisionEntries.slice(0, 5).map((e) => e.id),
        summaryTr: `Farklı yaşam alanlarında (${Array.from(allContexts).slice(0, 2).map(getContextLabelTr).join(', ')}) karar alma süreçleri üzerine odaklanma görüldü.`,
      });
    }
  }

  return multiThemes;
}

/**
 * Extract descriptive emotions
 */
function extractEmotions(entries: JournalEntryV1[]): { emotion: string; count: number }[] {
  const counts: Record<string, number> = {};

  for (const entry of entries) {
    const text = (entry.title + ' ' + entry.body).toLowerCase();
    for (const [emotion, keywords] of Object.entries(EMOTION_LEXICON)) {
      const match = keywords.some((kw) => text.includes(kw));
      if (match) {
        counts[emotion] = (counts[emotion] || 0) + 1;
      }
    }
  }

  return Object.entries(counts)
    .map(([emotion, count]) => ({ emotion, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Evaluates observational profile links & contextual variations
 */
function evaluateProfileObservationalLinks(
  entries: JournalEntryV1[],
  profile: UnifiedPsychologicalProfileV2
) {
  const profileAlignedThemes: JournalObservationSummaryV1['profileAlignedThemes'] = [];
  const contextualVariations: JournalObservationSummaryV1['contextualVariations'] = [];
  const unmeasuredRelevantAreas: JournalObservationSummaryV1['unmeasuredRelevantAreas'] = [];

  const measuredFacetsMap = new Map<string, FacetProfileV2>();
  if (Array.isArray(profile.facets)) {
    for (const f of profile.facets) {
      if (f.measurementStatus !== 'NOT_MEASURED' && f.score !== null) {
        measuredFacetsMap.set(f.facetId, f);
      }
    }
  }

  // Evaluate each context tag
  for (const tag of VALID_JOURNAL_CONTEXT_TAGS) {
    const relevantFacets = CONTEXT_FACET_MAP[tag] || [];
    const entriesInContext = entries.filter((e) => e.contextTags.includes(tag));
    if (entriesInContext.length === 0) continue;

    for (const facetId of relevantFacets) {
      const facetMeta = MASTER_FACETS.find((f) => f.facetId === facetId);
      if (!facetMeta) continue;

      const profileFacet = measuredFacetsMap.get(facetId);
      if (profileFacet && profileFacet.score !== null) {
        const score = profileFacet.score;

        // Contextual Variation Check (e.g. Work stress high while measured anxiety is low, or social avoidance at work while extraversion is high)
        const hasHighStressInContext = entriesInContext.some(
          (e) => (e.stressSelfReport !== null && e.stressSelfReport !== undefined && e.stressSelfReport >= 4) || e.entryType === 'STRESS'
        );

        if (tag === 'WORK' && facetId === 'anxiety' && score <= 2.5 && hasHighStressInContext) {
          contextualVariations.push({
            context: 'WORK',
            facetId,
            facetNameTr: facetMeta.nameTr,
            measuredScore: score,
            userReportedTendencyTr: 'İş ortamında yoğun baskı ve stres bildirimleri',
            narrativeTr: `Genel profilinizde sakinlik ve düşük kaygı düzeyi (${score.toFixed(2)}) ölçülmüşken, iş bağlamında daha yüksek stres bildirdiğiniz gözleniyor. Bu durum bağlamsal bir farklılaşmaya işaret eder.`,
          });
        } else if (score >= 3.5 || score <= 2.2) {
          profileAlignedThemes.push({
            relationshipType: 'ALIGNED_WITH_MEASUREMENT',
            facetId,
            facetNameTr: facetMeta.nameTr,
            constructId: facetMeta.constructId,
            summaryTr: `${getContextLabelTr(tag)} bağlamındaki yansımalarınız, ölçülen ${facetMeta.nameTr} (${score.toFixed(2)}) alanı ile aynı yönde betimlemeler içeriyor.`,
          });
        }
      } else {
        // Unmeasured relevant area
        if (entriesInContext.length >= 2) {
          if (!unmeasuredRelevantAreas.some((a) => a.areaNameTr === facetMeta.nameTr)) {
            unmeasuredRelevantAreas.push({
              areaNameTr: facetMeta.nameTr,
              context: tag,
              entryCount: entriesInContext.length,
            });
          }
        }
      }
    }
  }

  return { profileAlignedThemes, contextualVariations, unmeasuredRelevantAreas };
}

/**
 * Builds scoped, privacy-preserving AI observation bundle
 * Strict Invariant: NO name, email, userId, IP, raw assessment questions, or unrelated history
 */
export async function buildJournalObservationBundle(
  userId: string,
  entry: JournalEntryV1,
  profile?: UnifiedPsychologicalProfileV2,
  providedRecentEntries?: JournalEntryV1[]
): Promise<JournalObservationBundleV1> {
  const currentProfile = profile || (await getCurrentUnifiedProfile(userId));
  let activeEntries: JournalEntryV1[] = [];

  if (providedRecentEntries) {
    activeEntries = providedRecentEntries.filter((e) => !e.deletedAt && e.id !== entry.id);
  } else {
    try {
      const recentEntries = await getJournalEntries(userId, { limit: 10 });
      activeEntries = recentEntries.filter((e) => !e.deletedAt && e.id !== entry.id);
    } catch {
      // In offline / unit-testing environments without live DB
      activeEntries = [];
    }
  }

  // Scoped context distribution
  const contextCounts: Record<JournalContextTag, number> = {} as any;
  for (const e of activeEntries) {
    for (const t of e.contextTags) {
      contextCounts[t] = (contextCounts[t] || 0) + 1;
    }
  }

  const recentContextDistribution = Object.entries(contextCounts)
    .filter(([_, count]) => count > 0)
    .map(([context, count]) => ({ context: context as JournalContextTag, count }));

  // Scoped profile evidence relevant to entry's context tags
  const relevantFacetIds = new Set<string>();
  for (const tag of entry.contextTags) {
    (CONTEXT_FACET_MAP[tag] || []).forEach((id) => relevantFacetIds.add(id));
  }

  const scopedProfileEvidence: JournalObservationBundleV1['scopedProfileEvidence'] = [];
  const measuredFacetsMap = new Map<string, FacetProfileV2>();
  if (Array.isArray(currentProfile.facets)) {
    for (const f of currentProfile.facets) {
      if (f.measurementStatus !== 'NOT_MEASURED' && f.score !== null) {
        measuredFacetsMap.set(f.facetId, f);
      }
    }
  }

  for (const facetId of Array.from(relevantFacetIds)) {
    const pf = measuredFacetsMap.get(facetId);
    const facetMeta = MASTER_FACETS.find((f) => f.facetId === facetId);
    if (pf && pf.score !== null && facetMeta) {
      const constructMeta = MASTER_CONSTRUCTS.find((c) => c.constructId === facetMeta.constructId);
      scopedProfileEvidence.push({
        facetId,
        facetNameTr: facetMeta.nameTr,
        constructId: facetMeta.constructId,
        constructNameTr: constructMeta?.nameTr || facetMeta.constructId,
        domainId: facetMeta.domainId,
        score: pf.score,
        confidenceLevel: pf.confidenceComponents?.coverage || 'MODERATE',
      });
    }
  }

  // Active repeated themes
  const allActive = [entry, ...activeEntries];
  const repeated = computeRepeatedThemes(allActive);

  return {
    currentEntryExcerpt: {
      title: entry.title,
      body: entry.body,
      entryType: entry.entryType,
      contextTags: entry.contextTags,
      moodSelfReport: entry.moodSelfReport,
      energySelfReport: entry.energySelfReport,
      stressSelfReport: entry.stressSelfReport,
      isLifeEvent: entry.isLifeEvent,
      lifeEventType: entry.lifeEventType,
      createdAt: entry.createdAt,
    },
    recentContextDistribution,
    activeRepeatedThemes: repeated.map((r) => ({
      titleTr: r.themeTitleTr,
      context: r.context,
      entryCount: r.entryCount,
      summaryTr: r.summaryTr,
    })),
    scopedProfileEvidence,
    limitations: [
      'Günlük kayıtları öz-bildirimdir; doğrudan ölçüm değildir.',
      'Kesin tanısal iddialarda bulunulamaz.',
    ],
  };
}

/**
 * Resolves observational relationships between entry and Master Model
 */
export function resolveJournalProfileRelationships(
  entry: JournalEntryV1,
  profile: UnifiedPsychologicalProfileV2
): JournalProfileRelationshipV1[] {
  const relationships: JournalProfileRelationshipV1[] = [];
  const measuredFacetsMap = new Map<string, FacetProfileV2>();
  if (Array.isArray(profile.facets)) {
    for (const f of profile.facets) {
      if (f.measurementStatus !== 'NOT_MEASURED' && f.score !== null) {
        measuredFacetsMap.set(f.facetId, f);
      }
    }
  }

  for (const tag of entry.contextTags) {
    const relevantFacets = CONTEXT_FACET_MAP[tag] || [];
    for (const facetId of relevantFacets) {
      const facetMeta = MASTER_FACETS.find((f) => f.facetId === facetId);
      if (!facetMeta) continue;

      const profileFacet = measuredFacetsMap.get(facetId);
      if (profileFacet && profileFacet.score !== null) {
        relationships.push({
          id: `rel_${entry.id}_${facetId}`,
          entryId: entry.id,
          relationshipType: 'ALIGNED_WITH_MEASUREMENT',
          evidenceType: 'OBSERVATIONAL_DATA',
          strength: entry.body.length > 200 ? 'MODERATE' : 'WEAK',
          relatedFacetIds: [facetId],
          relatedConstructIds: [facetMeta.constructId],
          relatedDomainIds: [facetMeta.domainId],
          narrativeTr: `Bu yansımada belirtilen durum, profilinizdeki ${facetMeta.nameTr} (${profileFacet.score.toFixed(2)}) ölçümü ile paralellik taşımaktadır.`,
          createdAt: new Date().toISOString(),
        });
      } else {
        relationships.push({
          id: `rel_${entry.id}_${facetId}_unmeasured`,
          entryId: entry.id,
          relationshipType: 'UNMEASURED_RELEVANT_AREA',
          evidenceType: 'USER_REPORTED_CONTEXT',
          strength: 'WEAK',
          relatedFacetIds: [facetId],
          relatedConstructIds: [facetMeta.constructId],
          relatedDomainIds: [facetMeta.domainId],
          narrativeTr: `Bu alandaki deneyiminiz (${facetMeta.nameTr}), profilinizde henüz doğrudan bir modül ile ölçülmemiştir.`,
          createdAt: new Date().toISOString(),
        });
      }
    }
  }

  return relationships;
}

function getContextLabelTr(tag: JournalContextTag): string {
  switch (tag) {
    case 'WORK':
      return 'İş ve Çalışma';
    case 'RELATIONSHIPS':
      return 'İlişkiler';
    case 'FAMILY':
      return 'Aile';
    case 'DECISION_MAKING':
      return 'Karar Alma';
    case 'STRESS':
      return 'Stres ve Zorlanma';
    case 'SOCIAL':
      return 'Sosyal Çevre';
    case 'SELF_IMAGE':
      return 'Benlik Algısı';
    case 'GOALS':
      return 'Hedefler ve Başarı';
    case 'HEALTH':
      return 'Sağlık ve Zindelik';
    case 'LIFE_EVENT':
      return 'Önemli Yaşam Olayı';
    case 'GENERAL':
    default:
      return 'Genel Yansıma';
  }
}

function getContextThemeTitle(tag: JournalContextTag): string {
  switch (tag) {
    case 'WORK':
      return 'İş Odaklı Süreçler ve Deneyimler';
    case 'RELATIONSHIPS':
      return 'İlişkisel Dinamikler ve İletişim';
    case 'FAMILY':
      return 'Aile İçi Dinamikler';
    case 'DECISION_MAKING':
      return 'Karar Alma ve Değerlendirme Süreçleri';
    case 'STRESS':
      return 'Stres, Baskı ve Başa Çıkma';
    case 'SOCIAL':
      return 'Sosyal Etkileşim ve İfade';
    case 'SELF_IMAGE':
      return 'Benlik Algısı ve İçsel Değerlendirme';
    case 'GOALS':
      return 'Hedef Takibi ve Kararlılık';
    case 'HEALTH':
      return 'Bedensel ve Zihinsel İyilik Hali';
    case 'LIFE_EVENT':
      return 'Geçiş Dönemi ve Yaşam Değişiklikleri';
    case 'GENERAL':
    default:
      return 'Genel Farkındalık ve Düşünceler';
  }
}
