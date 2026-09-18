/**
 * PsycheAI Centralized Facet & Domain Lucide Icon Mapping System
 *
 * Provides consistent, psychologically grounded icon assignments across:
 * - 11 Master Domains
 * - 37 Constructs
 * - 91 Master Facets
 */

import React from 'react';
import {
  Brain,
  Compass,
  Heart,
  HeartHandshake,
  Zap,
  Lightbulb,
  Target,
  Users,
  UsersRound,
  MessageCircle,
  MessagesSquare,
  Smile,
  Shield,
  ShieldCheck,
  Scale,
  Sparkles,
  SlidersHorizontal,
  ListChecks,
  Search,
  RefreshCw,
  GitBranch,
  Flame,
  Activity,
  Layers,
  Cpu,
  Feather,
  Anchor,
  Sun,
  Eye,
  Award,
  BookOpen,
  HelpCircle,
  LucideIcon,
} from 'lucide-react';

const DOMAIN_ICON_MAP: Record<string, LucideIcon> = {
  core_personality: Compass,
  self_system: Target,
  self_regulation: SlidersHorizontal,
  emotion_regulation: Heart,
  coping_resilience: Shield,
  cognition_decision: Brain,
  creativity_curiosity: Lightbulb,
  motivation_values: Flame,
  social_relational: Users,
  wellbeing_vitality: Sun,
  optional_dark_tetrad: Eye,
};

const CONSTRUCT_ICON_MAP: Record<string, LucideIcon> = {
  // HEXACO
  hexaco_honesty_humility: Scale,
  hexaco_emotionality: Heart,
  hexaco_extraversion: MessageCircle,
  hexaco_agreeableness: HeartHandshake,
  hexaco_conscientiousness: ListChecks,
  hexaco_openness: Lightbulb,

  // Self System
  self_esteem: Award,
  self_efficacy: Target,
  locus_of_control: SlidersHorizontal,
  authenticity: Feather,

  // Self Regulation
  impulse_control: SlidersHorizontal,
  grit_perseverance: Anchor,
  procrastination_management: ListChecks,

  // Emotion
  affective_reactivity: Activity,
  cognitive_reappraisal: RefreshCw,
  expressive_suppression: SlidersHorizontal,
  mindfulness_presence: Sun,

  // Coping & Resilience
  problem_focused_coping: Target,
  emotion_focused_coping: Heart,
  psychological_resilience: Shield,

  // Cognition & Decision
  need_for_cognition: Search,
  decision_making_style: GitBranch,
  cognitive_flexibility: RefreshCw,
  critical_thinking: Cpu,

  // Creativity & Curiosity
  epistemic_curiosity: Search,
  divergent_thinking: Sparkles,
  aesthetic_sensitivity: Feather,

  // Motivation & Values
  intrinsic_motivation: Flame,
  achievement_striving: Award,
  core_life_values: Compass,

  // Social & Relational
  attachment_style: HeartHandshake,
  social_assertiveness: MessagesSquare,
  empathy_compassion: HeartHandshake,
  interpersonal_trust: UsersRound,

  // Wellbeing
  subjective_vitality: Sun,
  life_satisfaction: Smile,
  flourishing_meaning: Compass,

  // Dark Tetrad
  dark_traits_subclinical: Eye,
};

const FACET_ICON_KEYWORDS: Array<{ keywords: string[]; icon: LucideIcon }> = [
  { keywords: ['sincerity', 'samimiyet', 'dürüstlük', 'honesty', 'fairness', 'hakkaniyet'], icon: Scale },
  { keywords: ['modesty', 'alçakgönüllülük', 'humility'], icon: Feather },
  { keywords: ['fearfulness', 'korku', 'kaygı', 'anxiety', 'hassasiyet', 'duygusallık'], icon: Heart },
  { keywords: ['sentimentality', 'duygusallık', 'bağlılık', 'attachment'], icon: HeartHandshake },
  { keywords: ['social_boldness', 'sosyal_cesaret', 'cesaret', 'assertiveness'], icon: MessagesSquare },
  { keywords: ['sociability', 'sosyallik', 'dışadönüklük', 'liveliness', 'canlılık'], icon: UsersRound },
  { keywords: ['forgiveness', 'bağışlayıcılık', 'gentleness', 'yumuşak başlılık', 'flexibility'], icon: HeartHandshake },
  { keywords: ['patience', 'sabır', 'tolerans'], icon: Anchor },
  { keywords: ['organization', 'düzen', 'organization_orderliness', 'diligence', 'çalışkanlık'], icon: ListChecks },
  { keywords: ['perfectionism', 'mükemmeliyetçilik', 'prudence', 'ihtiyat'], icon: Target },
  { keywords: ['curiosity', 'merak', 'intellectual', 'entellektüel', 'inquisitiveness'], icon: Search },
  { keywords: ['creativity', 'yaratıcılık', 'unconventionality', 'özgünlük'], icon: Lightbulb },
  { keywords: ['resilience', 'dayanıklılık', 'grit', 'azim'], icon: Shield },
  { keywords: ['decision', 'karar', 'deliberation', 'mantık'], icon: GitBranch },
  { keywords: ['empathy', 'empati', 'şefkat', 'compassion'], icon: HeartHandshake },
  { keywords: ['values', 'değerler', 'meaning', 'anlam', 'purpose', 'amaç'], icon: Compass },
  { keywords: ['energy', 'enerji', 'vitality', 'canlılık'], icon: Sun },
];

/**
 * Resolves the most appropriate Lucide icon for a given facet, construct, or domain code.
 */
export function getFacetIcon(facetCodeOrId?: string, domainId?: string): LucideIcon {
  if (!facetCodeOrId) {
    if (domainId && DOMAIN_ICON_MAP[domainId.toLowerCase()]) {
      return DOMAIN_ICON_MAP[domainId.toLowerCase()];
    }
    return Brain;
  }

  const clean = facetCodeOrId.toLowerCase();

  // 1. Direct construct match
  if (CONSTRUCT_ICON_MAP[clean]) {
    return CONSTRUCT_ICON_MAP[clean];
  }

  // 2. Keyword based matching
  for (const group of FACET_ICON_KEYWORDS) {
    if (group.keywords.some((kw) => clean.includes(kw))) {
      return group.icon;
    }
  }

  // 3. Domain fallback
  if (domainId && DOMAIN_ICON_MAP[domainId.toLowerCase()]) {
    return DOMAIN_ICON_MAP[domainId.toLowerCase()];
  }

  return Sparkles;
}

/**
 * Resolves the primary Lucide icon for an 11-domain id.
 */
export function getDomainIcon(domainId: string): LucideIcon {
  return DOMAIN_ICON_MAP[domainId.toLowerCase()] || Compass;
}
