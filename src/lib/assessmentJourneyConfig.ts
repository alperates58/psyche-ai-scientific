export type JourneyClassification = 'REQUIRED' | 'RECOMMENDED' | 'OPTIONAL';

export type JourneyStage =
  | 'ONBOARDING_NOT_STARTED'
  | 'ONBOARDING_IN_PROGRESS'
  | 'CORE_PROFILE_READY'
  | 'PROGRESSIVE_STAGE';

export type AssessmentItemStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface ModuleJourneyRule {
  classification: JourneyClassification;
  priority: number; // Lower number = higher priority
  stepNumber?: number;
  userFacingTitleTr?: string;
  userFacingSubtitleTr?: string;
  recommendationReasonTr: string;
  domainNameTr?: string;
}

/**
 * Static & deterministic journey configuration rules.
 * Maps known module codes to their journey role and user-facing rationale.
 */
export const MODULE_JOURNEY_RULES: Record<string, ModuleJourneyRule> = {
  MODULE_1_CORE_PERSONALITY: {
    classification: 'REQUIRED',
    priority: 1,
    stepNumber: 1,
    userFacingTitleTr: 'Temel Kişilik Yapısı (HEXACO)',
    userFacingSubtitleTr: 'Kişiliğin 6 ana boyutunun kapsamlı analizi',
    recommendationReasonTr: 'Psikolojik profilinizin temelini oluşturan 6 ana kişilik faktörünü ölçer.',
    domainNameTr: 'Kişilik & Mizaç',
  },
  CORE_INTAKE: {
    classification: 'REQUIRED',
    priority: 1,
    stepNumber: 1,
    userFacingTitleTr: 'Temel Değerlendirme Formu',
    userFacingSubtitleTr: 'Başlangıç psikolojik profil haritası',
    recommendationReasonTr: 'Profilinizi oluşturmak için gereken ilk temel psikometrik değerlendirme.',
    domainNameTr: 'Kişilik & Mizaç',
  },
  MODULE_2_SELF_IDENTITY: {
    classification: 'REQUIRED',
    priority: 2,
    stepNumber: 2,
    userFacingTitleTr: 'Benlik ve Kimlik Sistemi',
    userFacingSubtitleTr: 'Öz-değer, benlik saygısı ve kimlik bütünlüğü',
    recommendationReasonTr: 'Kişisel değerleriniz ve benlik algınızın dinamiklerini haritalandırır.',
    domainNameTr: 'Benlik & Kimlik',
  },
  MODULE_3_EMOTION_REGULATION: {
    classification: 'RECOMMENDED',
    priority: 3,
    stepNumber: 3,
    userFacingTitleTr: 'Duygu Düzenleme ve Esneklik',
    userFacingSubtitleTr: 'Stres yönetimi, bilişsel yeniden değerlendirme ve duygusal dayanıklılık',
    recommendationReasonTr: 'Zorlayıcı durumlarda duygularınızı nasıl yönettiğinizi keşfetmenizi sağlar.',
    domainNameTr: 'Duygusal Süreçler',
  },
  MODULE_4_VOLITION_CONTROL: {
    classification: 'RECOMMENDED',
    priority: 4,
    stepNumber: 4,
    userFacingTitleTr: 'Özdenetim ve İrade Dinamikleri',
    userFacingSubtitleTr: 'Hedef odaklılık, dürtü kontrolü ve azim',
    recommendationReasonTr: 'Hedeflerinize ulaşma ve dikkatinizi odaklama stratejilerinizi ortaya koyar.',
    domainNameTr: 'Bilişsel & İrade',
  },
};

/**
 * Deterministically resolves journey metadata for any module code.
 * Uses explicit dictionary if available, or derives intelligent defaults based on code heuristics.
 */
export function getModuleJourneyMetadata(
  moduleCode: string,
  moduleTitleTr?: string
): ModuleJourneyRule {
  const normalized = moduleCode.toUpperCase().trim();

  // 1. Direct match
  if (MODULE_JOURNEY_RULES[normalized]) {
    return MODULE_JOURNEY_RULES[normalized];
  }

  // 2. Heuristic pattern matches
  if (normalized.includes('CORE') || normalized.includes('INTAKE') || normalized.includes('TEMEL') || normalized.includes('MODULE_1')) {
    return {
      classification: 'REQUIRED',
      priority: 1,
      userFacingTitleTr: moduleTitleTr || 'Temel Değerlendirme',
      recommendationReasonTr: 'Psikolojik profilinizi başlatmak için gereken temel değerlendirme.',
      domainNameTr: 'Temel Profil',
    };
  }

  if (normalized.includes('IDENTITY') || normalized.includes('SELF') || normalized.includes('BENLIK')) {
    return {
      classification: 'REQUIRED',
      priority: 2,
      userFacingTitleTr: moduleTitleTr || 'Benlik ve Kimlik',
      recommendationReasonTr: 'Benlik yapınızı ve kimlik bütünlüğünüzü anlamanızı sağlar.',
      domainNameTr: 'Benlik & Kimlik',
    };
  }

  if (
    normalized.includes('EMOTION') ||
    normalized.includes('AFFECT') ||
    normalized.includes('DUYGU') ||
    normalized.includes('STRESS')
  ) {
    return {
      classification: 'RECOMMENDED',
      priority: 10,
      userFacingTitleTr: moduleTitleTr || 'Duygu Düzenleme',
      recommendationReasonTr: 'Duygusal dayanıklılık ve stres yönetim dinamiklerinizi tamamlar.',
      domainNameTr: 'Duygusal Süreçler',
    };
  }

  if (
    normalized.includes('COGNITIVE') ||
    normalized.includes('VOLITION') ||
    normalized.includes('IRADE') ||
    normalized.includes('ODAK')
  ) {
    return {
      classification: 'RECOMMENDED',
      priority: 11,
      userFacingTitleTr: moduleTitleTr || 'Bilişsel ve İrade Dinamikleri',
      recommendationReasonTr: 'Hedef belirleme ve yürütücü işlevlerinizi analiz eder.',
      domainNameTr: 'Bilişsel & İrade',
    };
  }

  // 3. Fallback: Optional deep-dive assessment
  return {
    classification: 'OPTIONAL',
    priority: 50,
    userFacingTitleTr: moduleTitleTr || 'Genişletilmiş Değerlendirme',
    recommendationReasonTr: 'Profilinize özel derinlemesine içgörüler sunar.',
    domainNameTr: 'Genişletilmiş Analiz',
  };
}
