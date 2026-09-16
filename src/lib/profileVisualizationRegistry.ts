/**
 * PsycheAI Master Psychological Profile Visualization Registry
 * 
 * Central authoritative registry governing all psychological visualizations.
 * Enforces strict scientific and epistemic rules:
 * - Direct measurements vs derived relationships
 * - Activation dependencies (norms, calibration, longitudinal data, instruments)
 * - Prohibits visualizations implying evidence that does not empirically exist
 */

export type VisualStatus = 'ACTIVE' | 'CONDITIONAL' | 'BLOCKED' | 'FUTURE';

export type VisualType =
  | 'RADAR'
  | 'FACET_LIST'
  | 'HEATMAP'
  | 'FINGERPRINT'
  | 'MATRIX'
  | 'DASHBOARD'
  | 'CONFIDENCE_MAP'
  | 'INTERACTION_MAP'
  | 'CIRCUMPLEX'
  | 'HEXAGON'
  | 'LONGITUDINAL'
  | 'BAR_GRID';

export type ScientificStatus =
  | 'VALIDATED_DIRECT'
  | 'DERIVED_DETERMINISTIC'
  | 'PRE_CALIBRATION'
  | 'EXPERIMENTAL'
  | 'THEORETICAL'
  | 'BLOCKED_NO_EVIDENCE';

export interface ProfileVisualizationDefinition {
  id: string;
  titleTr: string;
  descriptionTr: string;
  dataRequirements: string[];
  scientificStatus: ScientificStatus;
  epistemicStatus: string;
  allowedWhen: string;
  blockedWhen: string;
  visualType: VisualType;
  sourceDimensions: string[];
  isNormDependent: boolean;
  isCalibrationDependent: boolean;
  isLongitudinalDependent: boolean;
  isDirectMeasurement: boolean;
  isDerived: boolean;
  userFacingDisclaimer: string;
  status: VisualStatus;
  conditionalPredicate?: (context: {
    measuredConstructCodes: string[];
    measuredFacetCodes: string[];
    hasAttachmentData: boolean;
    hasErqData: boolean;
    hasRsesData: boolean;
    hasGseData: boolean;
  }) => boolean;
}

export const MASTER_VISUALIZATION_REGISTRY: ProfileVisualizationDefinition[] = [
  // ---------------------------------------------------------
  // 1. ACTIVE NOW
  // ---------------------------------------------------------
  {
    id: 'hexaco_radar_chart',
    titleTr: 'HEXACO Radar Profili',
    descriptionTr: '6 temel kişilik faktörünün yerel ölçek değerleri ve görsel koordinatları üzerinden haritalandırılması.',
    dataRequirements: ['core_personality constructs (honesty_humility, emotionality, extraversion, agreeableness, conscientiousness, openness_to_experience)'],
    scientificStatus: 'PRE_CALIBRATION',
    epistemicStatus: 'PROVISIONAL_POINT_ESTIMATE',
    allowedWhen: 'Tüm 6 HEXACO faktörü doğrudan ölçüldüğünde.',
    blockedWhen: 'Big Five modeline dönüştürülmesi veya nüfus yüzdeliği (percentile) olarak sunulması engellenmiştir.',
    visualType: 'RADAR',
    sourceDimensions: ['honesty_humility', 'emotionality', 'extraversion', 'agreeableness', 'conscientiousness', 'openness_to_experience'],
    isNormDependent: false,
    isCalibrationDependent: false,
    isLongitudinalDependent: false,
    isDirectMeasurement: true,
    isDerived: false,
    userFacingDisclaimer: 'Görsel radar profili 0–100 ekseninde çizilmiştir; gerçek puanlar 1.0–5.0 aralığındaki ham ortalamaları yansıtır.',
    status: 'ACTIVE',
  },
  {
    id: 'hexaco_facet_profile',
    titleTr: 'HEXACO Alt Boyut Profili',
    descriptionTr: '6 faktör altındaki 24 alt boyutun ölçüm durumu, madde sayısı, kaynak formu ve ham puan dökümü.',
    dataRequirements: ['HEXACO-PI-R item responses and facet assignments'],
    scientificStatus: 'PRE_CALIBRATION',
    epistemicStatus: 'PROVISIONAL_POINT_ESTIMATE',
    allowedWhen: 'HEXACO ölçeği tamamlandığında.',
    blockedWhen: 'Ölçülmemiş alt boyutların yapay ortalama ile doldurulması veya faktör puanından kestirilmesi engellenmiştir.',
    visualType: 'FACET_LIST',
    sourceDimensions: ['hexaco_facets'],
    isNormDependent: false,
    isCalibrationDependent: false,
    isLongitudinalDependent: false,
    isDirectMeasurement: true,
    isDerived: false,
    userFacingDisclaimer: 'Yalnızca ölçülen alt boyutlar puan alır; ölçülmemiş alt boyutlar "Ölçülmedi" olarak gösterilir.',
    status: 'ACTIVE',
  },
  {
    id: 'trait_heatmap',
    titleTr: 'Psikolojik Boyut Isı Haritası',
    descriptionTr: 'Tüm ontoloji alanlarındaki alt boyutların ölçek-içi yanıt konumu yoğunluk matrisi.',
    dataRequirements: ['canonical 84 facets ontology mappings'],
    scientificStatus: 'PRE_CALIBRATION',
    epistemicStatus: 'PROVISIONAL_POINT_ESTIMATE',
    allowedWhen: 'En az bir ampirik psikolojik boyut ölçüldüğünde.',
    blockedWhen: 'Renklerin nüfus yüzdelikleri veya patolojik norm dilimleri olarak etiketlenmesi engellenmiştir.',
    visualType: 'HEATMAP',
    sourceDimensions: ['all_facets_84'],
    isNormDependent: false,
    isCalibrationDependent: false,
    isLongitudinalDependent: false,
    isDirectMeasurement: true,
    isDerived: false,
    userFacingDisclaimer: 'Bu renkler nüfus yüzdeliklerini değil, ilgili ölçekteki yanıt konumunu gösterir.',
    status: 'ACTIVE',
  },
  {
    id: 'profile_fingerprint',
    titleTr: 'Profil Parmak İzi V2',
    descriptionTr: 'Ölçülen tüm psikolojik boyutların alan gruplamalı ve kaynak ölçekli görsel imza görünümü.',
    dataRequirements: ['measured constructs/facets with scale metadata'],
    scientificStatus: 'PRE_CALIBRATION',
    epistemicStatus: 'PROVISIONAL_POINT_ESTIMATE',
    allowedWhen: 'Kullanıcının en az 1 ölçülmüş boyutu olduğunda.',
    blockedWhen: 'Biyometrik kimlik, kesin psikolojik tip veya tanısal imza olarak sunulması engellenmiştir.',
    visualType: 'FINGERPRINT',
    sourceDimensions: ['measured_dimensions'],
    isNormDependent: false,
    isCalibrationDependent: false,
    isLongitudinalDependent: false,
    isDirectMeasurement: true,
    isDerived: false,
    userFacingDisclaimer: 'Profil parmak izi, tamamlanan ampirik ölçeklerin görsel özetidir; biyometrik veya istatistiksel kimlik iddiası taşımaz.',
    status: 'ACTIVE',
  },
  {
    id: 'strength_attention_matrix',
    titleTr: 'Belirgin Eğilimler ve Dikkat Noktaları',
    descriptionTr: 'Ölçülen psikolojik boyutların aşırı veya güçlü kullanım alanlarının deterministik analizi.',
    dataRequirements: ['measured constructs with registered interpretation templates'],
    scientificStatus: 'DERIVED_DETERMINISTIC',
    epistemicStatus: 'EVIDENCE_SUPPORTED_INTERPRETATION',
    allowedWhen: 'Geçerli yorumlama şablonuna sahip en az bir boyut ölçüldüğünde.',
    blockedWhen: 'Ahlaki değer yargısı, kesin eksiklik veya klinik tanı olarak sunulması engellenmiştir.',
    visualType: 'MATRIX',
    sourceDimensions: ['measured_constructs'],
    isNormDependent: false,
    isCalibrationDependent: false,
    isLongitudinalDependent: false,
    isDirectMeasurement: false,
    isDerived: true,
    userFacingDisclaimer: 'Kişilik özellikleri ahlaki olarak iyi/kötü olarak değerlendirilmez; bağlamsal güçlü yönler ve dikkat noktaları sunulur.',
    status: 'ACTIVE',
  },
  {
    id: 'response_quality_dashboard',
    titleTr: 'Yanıt Kalitesi ve Telemetri Paneli',
    descriptionTr: 'Hız anomalileri, düz yanıtlama, dikkat kontrolleri ve tamamlama tutarlılığı dökümü.',
    dataRequirements: ['session integrity evaluation records'],
    scientificStatus: 'VALIDATED_DIRECT',
    epistemicStatus: 'OBSERVATIONAL_TELEMETRY',
    allowedWhen: 'En az bir değerlendirme oturumu tamamlandığında.',
    blockedWhen: 'Yalan makinesi, dürüstlük yüzdesi veya sahte sosyal beğenirlik puanı olarak sunulması engellenmiştir.',
    visualType: 'DASHBOARD',
    sourceDimensions: ['integrity_telemetry'],
    isNormDependent: false,
    isCalibrationDependent: false,
    isLongitudinalDependent: false,
    isDirectMeasurement: true,
    isDerived: false,
    userFacingDisclaimer: 'Yanıt kalitesi göstergeleri veri güvenilirliğini doğrular; kullanıcı hakkında psikolojik dürüstlük yargısı üretmez.',
    status: 'ACTIVE',
  },
  {
    id: 'measurement_coverage_map',
    titleTr: 'Ölçüm Kapsamı ve Ontoloji Haritası',
    descriptionTr: '84 ontolojik alt boyut üzerinden haritalandırılan ve keşfedilen psikolojik alanların dökümü.',
    dataRequirements: ['canonical facet counts and measured facet counts'],
    scientificStatus: 'VALIDATED_DIRECT',
    epistemicStatus: 'OBSERVATIONAL_FACT',
    allowedWhen: 'Her zaman aktiftir.',
    blockedWhen: 'Kapsam yüzdesinin psikolojik kesinlik veya eksiksizlik olarak yorumlanması engellenmiştir.',
    visualType: 'BAR_GRID',
    sourceDimensions: ['all_facets_84'],
    isNormDependent: false,
    isCalibrationDependent: false,
    isLongitudinalDependent: false,
    isDirectMeasurement: true,
    isDerived: false,
    userFacingDisclaimer: 'Kapsam oranı, ontolojideki taranmış alt boyut miktarını gösterir; psikolojik kesinlik veya mükemmellik göstergesi değildir.',
    status: 'ACTIVE',
  },
  {
    id: 'profile_confidence_map',
    titleTr: 'Profil Güven ve Kanıt Haritası',
    descriptionTr: 'Her bir psikolojik boyut için madde sayısı, telemetri, geçerlik kanıtı ve tekillik durumuna dayalı kanıt gücü.',
    dataRequirements: ['facet scores, item counts, session integrity, validation summaries'],
    scientificStatus: 'DERIVED_DETERMINISTIC',
    epistemicStatus: 'EPISTEMIC_GOVERNANCE',
    allowedWhen: 'Ölçülmüş boyutlar mevcut olduğunda.',
    blockedWhen: 'Sahte güven yüzdesi (%94 vb.) veya istatistiksel olasılık hesabı olarak sunulması engellenmiştir.',
    visualType: 'CONFIDENCE_MAP',
    sourceDimensions: ['measured_dimensions'],
    isNormDependent: false,
    isCalibrationDependent: false,
    isLongitudinalDependent: false,
    isDirectMeasurement: false,
    isDerived: true,
    userFacingDisclaimer: 'Güven seviyeleri ölçümün kanıt gücünü (madde sayısı, veri kalitesi, uyarlama düzeyi) gösterir; matematiksel kesinlik yüzdesi değildir.',
    status: 'ACTIVE',
  },
  {
    id: 'interaction_synergy_tension_map',
    titleTr: 'Etkileşim ve Dinamikler Haritası',
    descriptionTr: 'Ölçülen boyutlar arasındaki kayıtlı deterministik sinerjiler, gerilimler ve bağlamsal modülasyonlar.',
    dataRequirements: ['UNIFIED_INTERACTION_RULES and measured construct scores'],
    scientificStatus: 'DERIVED_DETERMINISTIC',
    epistemicStatus: 'THEORETICAL_INTERPRETATION',
    allowedWhen: 'Kayıtlı bir kuralın tüm gerektirdiği boyutlar ölçüldüğünde.',
    blockedWhen: 'Birey içi yapay korelasyon veya psikopatolojik çelişki olarak sunulması engellenmiştir.',
    visualType: 'INTERACTION_MAP',
    sourceDimensions: ['measured_constructs'],
    isNormDependent: false,
    isCalibrationDependent: false,
    isLongitudinalDependent: false,
    isDirectMeasurement: false,
    isDerived: true,
    userFacingDisclaimer: 'Etkileşim analizleri kuramsal ve ampirik eşik kurallarına dayanır; tek bir bireyden yapay korelasyon hesaplanmaz.',
    status: 'ACTIVE',
  },

  // ---------------------------------------------------------
  // 2. CONDITIONAL
  // ---------------------------------------------------------
  {
    id: 'attachment_matrix',
    titleTr: 'Bağlanma Stili Matrisi',
    descriptionTr: 'Yakın ilişkilerde kaygı ve kaçınma boyutları ekseninde iki boyutlu bağlanma haritası.',
    dataRequirements: ['attachment_anxiety', 'attachment_avoidance (e.g. ECR-R)'],
    scientificStatus: 'PRE_CALIBRATION',
    epistemicStatus: 'PROVISIONAL_POINT_ESTIMATE',
    allowedWhen: 'Geçerli bir bağlanma ölçeği doğrudan ölçüldüğünde.',
    blockedWhen: 'Kişilik özelliklerinden (HEXACO vb.) bağlanma stili kestirilmesi kesinlikle engellenmiştir.',
    visualType: 'MATRIX',
    sourceDimensions: ['attachment_anxiety', 'attachment_avoidance'],
    isNormDependent: false,
    isCalibrationDependent: false,
    isLongitudinalDependent: false,
    isDirectMeasurement: true,
    isDerived: false,
    userFacingDisclaimer: 'Bağlanma boyutları yalnızca ilgili bağlanma envanteri tamamlandığında gösterilir.',
    status: 'CONDITIONAL',
    conditionalPredicate: (ctx) => ctx.hasAttachmentData,
  },
  {
    id: 'emotion_regulation_profile',
    titleTr: 'Duygu Düzenleme Profili',
    descriptionTr: 'Bilişsel yeniden değerlendirme ve duygusal bastırma stratejileri ekseninde profil.',
    dataRequirements: ['cognitive_reappraisal', 'expressive_suppression (ERQ)'],
    scientificStatus: 'PRE_CALIBRATION',
    epistemicStatus: 'PROVISIONAL_POINT_ESTIMATE',
    allowedWhen: 'ERQ veya eşdeğer geçerli duygu düzenleme ölçeği doğrudan ölçüldüğünde.',
    blockedWhen: 'Duygusallık veya Uyumluluk faktörlerinden kestirilmesi engellenmiştir.',
    visualType: 'MATRIX',
    sourceDimensions: ['cognitive_reappraisal', 'expressive_suppression'],
    isNormDependent: false,
    isCalibrationDependent: false,
    isLongitudinalDependent: false,
    isDirectMeasurement: true,
    isDerived: false,
    userFacingDisclaimer: 'Duygu düzenleme profili doğrudan ERQ envanteri ölçüldüğünde aktifleşir.',
    status: 'CONDITIONAL',
    conditionalPredicate: (ctx) => ctx.hasErqData,
  },
  {
    id: 'self_system_profile',
    titleTr: 'Benlik Sistemi Profili',
    descriptionTr: 'Rosenberg Benlik Saygısı (RSES) ve Genel Öz-Yeterlik (GSE) bağımsız analizleri.',
    dataRequirements: ['self_evaluation (RSES) and/or agency_mastery (GSE)'],
    scientificStatus: 'PRE_CALIBRATION',
    epistemicStatus: 'PROVISIONAL_POINT_ESTIMATE',
    allowedWhen: 'RSES veya GSE ölçeklerinden en az biri doğrudan ölçüldüğünde.',
    blockedWhen: 'RSES puanından ideal benlik veya ought self uydurulması engellenmiştir.',
    visualType: 'BAR_GRID',
    sourceDimensions: ['self_evaluation', 'agency_mastery'],
    isNormDependent: false,
    isCalibrationDependent: false,
    isLongitudinalDependent: false,
    isDirectMeasurement: true,
    isDerived: false,
    userFacingDisclaimer: 'Benlik boyutları yalnızca doğrudan ölçülen RSES ve GSE ölçekleri üzerinden bağımsız olarak sunulur.',
    status: 'CONDITIONAL',
    conditionalPredicate: (ctx) => ctx.hasRsesData || ctx.hasGseData,
  },
  {
    id: 'behavioral_style_summary',
    titleTr: 'Bağlamsal Davranış Eğilimi Özeti',
    descriptionTr: 'Ölçülen boyutların iş, ilişki ve sosyal bağlamlardaki ampirik yansımaları.',
    dataRequirements: ['measured core traits with registered contextual mappings'],
    scientificStatus: 'DERIVED_DETERMINISTIC',
    epistemicStatus: 'THEORETICAL_INTERPRETATION',
    allowedWhen: 'Açık deterministik yapı eşleştirmelerine sahip temel boyutlar ölçüldüğünde.',
    blockedWhen: 'Gizli veya sentetik yeni puanlar üretilmesi engellenmiştir.',
    visualType: 'MATRIX',
    sourceDimensions: ['measured_constructs'],
    isNormDependent: false,
    isCalibrationDependent: false,
    isLongitudinalDependent: false,
    isDirectMeasurement: false,
    isDerived: true,
    userFacingDisclaimer: 'Bağlamsal özetler temel psikolojik ölçümlerin farklı yaşam alanlarındaki betimsel izdüşümleridir.',
    status: 'CONDITIONAL',
    conditionalPredicate: (ctx) => ctx.measuredConstructCodes.length >= 3,
  },

  // ---------------------------------------------------------
  // 3. BLOCKED UNTIL FUTURE EVIDENCE
  // ---------------------------------------------------------
  {
    id: 'big_five_radar',
    titleTr: 'Big Five Radar Profili',
    descriptionTr: 'Beş Faktör Kişilik Modeli (NEO-PI-R / BFI) radar gösterimi.',
    dataRequirements: ['Direct Big Five instrument measurement'],
    scientificStatus: 'BLOCKED_NO_EVIDENCE',
    epistemicStatus: 'INVALID_SYNTHETIC_INFERENCE',
    allowedWhen: 'Doğrudan Big Five envanteri uygulandığında.',
    blockedWhen: 'HEXACO verisinden yapay Big Five dönüştürmesi bilimsel olarak yasaklanmıştır.',
    visualType: 'RADAR',
    sourceDimensions: ['big_five_factors'],
    isNormDependent: false,
    isCalibrationDependent: false,
    isLongitudinalDependent: false,
    isDirectMeasurement: true,
    isDerived: false,
    userFacingDisclaimer: 'Big Five modeli HEXACO verisinden sentetik olarak üretilemez; doğrudan ölçüm gerektirir.',
    status: 'BLOCKED',
  },
  {
    id: 'percentile_profile',
    titleTr: 'Yüzdelik Dilim (Percentile) Profili',
    descriptionTr: 'Bireyin Türkiye temsil normlarına göre yüzdelik dilim sıralaması.',
    dataRequirements: ['Stratified national representative sample (N >= 2000)'],
    scientificStatus: 'BLOCKED_NO_EVIDENCE',
    epistemicStatus: 'PROHIBITED_UNVALIDATED_NORM',
    allowedWhen: 'Temsili ulusal norm tablosu ampirik olarak toplandığında.',
    blockedWhen: 'Norm olmadan sahte percentile veya toplum kıyaslaması üretilmesi engellenmiştir.',
    visualType: 'BAR_GRID',
    sourceDimensions: ['norm_scores'],
    isNormDependent: true,
    isCalibrationDependent: true,
    isLongitudinalDependent: false,
    isDirectMeasurement: false,
    isDerived: true,
    userFacingDisclaimer: 'Ulusal temsil normları toplanana kadar yüzdelik dilimler gizlenmiştir.',
    status: 'BLOCKED',
  },
  {
    id: 'norm_comparison_chart',
    titleTr: 'Nüfus Norm Kıyaslama Grafiği',
    descriptionTr: 'Yaş ve cinsiyet gruplarına göre standart z ve T puanı dağılımı.',
    dataRequirements: ['Calibrated demographic norm datasets'],
    scientificStatus: 'BLOCKED_NO_EVIDENCE',
    epistemicStatus: 'PROHIBITED_UNVALIDATED_NORM',
    allowedWhen: 'Ampirik norm kalibrasyonu tamamlandığında.',
    blockedWhen: 'Norm verisi olmadan çan eğrisi veya grup ortalaması kıyaslaması gösterilemez.',
    visualType: 'BAR_GRID',
    sourceDimensions: ['z_scores', 't_scores'],
    isNormDependent: true,
    isCalibrationDependent: true,
    isLongitudinalDependent: false,
    isDirectMeasurement: false,
    isDerived: true,
    userFacingDisclaimer: 'Demografik normlar yayınlanana kadar kıyaslama grafiği aktif değildir.',
    status: 'BLOCKED',
  },
  {
    id: 'confidence_interval_whiskers',
    titleTr: '%95 Güven Aralığı Bıyıkları (SEM Whiskers)',
    descriptionTr: 'Standart ölçme hatasına (SEM) dayalı istatistiksel güven aralığı.',
    dataRequirements: ['IRT calibrated information function or verified test-retest reliability'],
    scientificStatus: 'BLOCKED_NO_EVIDENCE',
    epistemicStatus: 'PROHIBITED_FABRICATED_STATISTICS',
    allowedWhen: 'Savunulabilir bir SEM / IRT kalibrasyon modeli hazır olduğunda.',
    blockedWhen: 'Sahte standart hata formülleriyle yapay güven aralıkları çizilmesi engellenmiştir.',
    visualType: 'BAR_GRID',
    sourceDimensions: ['standard_error_sem'],
    isNormDependent: false,
    isCalibrationDependent: true,
    isLongitudinalDependent: false,
    isDirectMeasurement: false,
    isDerived: true,
    userFacingDisclaimer: 'Ulusal kalibrasyon modeli tamamlanana kadar sahte hata aralığı bıyıkları çizilmez.',
    status: 'BLOCKED',
  },
  {
    id: 'trait_correlation_matrix',
    titleTr: 'Birey İçi Boyut Korelasyon Matrisi',
    descriptionTr: 'Boyutlar arasındaki korelasyonel bağlar.',
    dataRequirements: ['Within-person longitudinal repeated time-series measurements'],
    scientificStatus: 'BLOCKED_NO_EVIDENCE',
    epistemicStatus: 'PROHIBITED_FABRICATED_STATISTICS',
    allowedWhen: 'Tekil bireyde çoklu zaman serisi (experience sampling) verisi olduğunda.',
    blockedWhen: 'Tek bir oturumdan bireye özel korelasyon matrisi uydurulması engellenmiştir.',
    visualType: 'MATRIX',
    sourceDimensions: ['longitudinal_correlations'],
    isNormDependent: false,
    isCalibrationDependent: false,
    isLongitudinalDependent: true,
    isDirectMeasurement: false,
    isDerived: true,
    userFacingDisclaimer: 'Tekil oturum verisinden birey içi korelasyon hesaplanamaz.',
    status: 'BLOCKED',
  },
  {
    id: 'schwartz_circumplex',
    titleTr: 'Schwartz Değerler Sirkumpleksi',
    descriptionTr: '10 temel insani değerin dairesel motivasyonel yapısı (PVQ / SVS).',
    dataRequirements: ['Schwartz Portrait Values Questionnaire (PVQ) module'],
    scientificStatus: 'BLOCKED_NO_EVIDENCE',
    epistemicStatus: 'UNMEASURED_FUTURE_DOMAIN',
    allowedWhen: 'Geçerli Schwartz Değerler modülü yayınlandığında.',
    blockedWhen: 'Kişilik özelliklerinden değer sirkumpleksi türetilmesi engellenmiştir.',
    visualType: 'CIRCUMPLEX',
    sourceDimensions: ['schwartz_values'],
    isNormDependent: false,
    isCalibrationDependent: false,
    isLongitudinalDependent: false,
    isDirectMeasurement: true,
    isDerived: false,
    userFacingDisclaimer: 'Değerler sirkumpleksi doğrudan PVQ modülü tamamlandığında aktifleşecektir.',
    status: 'FUTURE',
  },
  {
    id: 'riasec_hexagon',
    titleTr: 'Holland RIASEC İlgi Hekzagonu',
    descriptionTr: 'Mesleki ilgi alanlarının 6 faktörlü hekzagon modeli.',
    dataRequirements: ['Direct RIASEC vocational interest assessment'],
    scientificStatus: 'BLOCKED_NO_EVIDENCE',
    epistemicStatus: 'UNMEASURED_FUTURE_DOMAIN',
    allowedWhen: 'RIASEC modülü canlıya alındığında.',
    blockedWhen: 'HEXACO veya benlik puanlarından mesleki hekzagon kestirilmesi engellenmiştir.',
    visualType: 'HEXAGON',
    sourceDimensions: ['riasec_dimensions'],
    isNormDependent: false,
    isCalibrationDependent: false,
    isLongitudinalDependent: false,
    isDirectMeasurement: true,
    isDerived: false,
    userFacingDisclaimer: 'RIASEC hekzagonu mesleki ilgi envanteri devreye girdiğinde sunulacaktır.',
    status: 'FUTURE',
  },
  {
    id: 'interpersonal_circumplex',
    titleTr: 'Kişilerarası Sirkumpleks (IPC)',
    descriptionTr: 'Baskınlık ve Sıcaklık eksenlerinde kişilerarası davranış döngüsü.',
    dataRequirements: ['Direct Interpersonal Circumplex instrument (e.g. IPIP-IPC)'],
    scientificStatus: 'BLOCKED_NO_EVIDENCE',
    epistemicStatus: 'UNMEASURED_FUTURE_DOMAIN',
    allowedWhen: 'Kişilerarası sirkumpleks ölçeği uygulandığında.',
    blockedWhen: 'Dışadönüklük ve Uyumluluk puanlarından yapay sirkumpleks çizilmesi engellenmiştir.',
    visualType: 'CIRCUMPLEX',
    sourceDimensions: ['ipc_octants'],
    isNormDependent: false,
    isCalibrationDependent: false,
    isLongitudinalDependent: false,
    isDirectMeasurement: true,
    isDerived: false,
    userFacingDisclaimer: 'Kişilerarası sirkumpleks doğrudan IPC ölçeği gerektirir.',
    status: 'FUTURE',
  },
  {
    id: 'affect_circumplex',
    titleTr: 'Duygulanım Sirkumpleksi (Russell Circumplex)',
    descriptionTr: 'Değerlik (Valence) ve Uyarılma (Arousal) eksenlerinde anlık duygulanım haritası.',
    dataRequirements: ['Direct Affect Grid or PANAS measurement'],
    scientificStatus: 'BLOCKED_NO_EVIDENCE',
    epistemicStatus: 'UNMEASURED_FUTURE_DOMAIN',
    allowedWhen: 'Duygulanım ölçüm modülü tamamlandığında.',
    blockedWhen: 'Kişilik özelliklerinden anlık duygulanım sirkumpleksi çıkarımı yapılması engellenmiştir.',
    visualType: 'CIRCUMPLEX',
    sourceDimensions: ['valence_arousal'],
    isNormDependent: false,
    isCalibrationDependent: false,
    isLongitudinalDependent: false,
    isDirectMeasurement: true,
    isDerived: false,
    userFacingDisclaimer: 'Duygulanım sirkumpleksi doğrudan duygulanım modülü uygulandığında açılır.',
    status: 'FUTURE',
  },
  {
    id: 'longitudinal_profile',
    titleTr: 'Boylamsal Gelişim ve Zaman Serisi Profili',
    descriptionTr: 'Zaman içindeki değişim, dalgalanma ve kararlılık grafiği.',
    dataRequirements: ['Repeated longitudinal sessions across >= 3 time points (FAZ 2.15)'],
    scientificStatus: 'BLOCKED_NO_EVIDENCE',
    epistemicStatus: 'UNMEASURED_FUTURE_DOMAIN',
    allowedWhen: 'Aynı ölçekle en az 3 farklı zaman noktasında ölçüm yapıldığında.',
    blockedWhen: 'Tekil oturumdan sahte zamansal eğri oluşturulması engellenmiştir.',
    visualType: 'LONGITUDINAL',
    sourceDimensions: ['temporal_scores'],
    isNormDependent: false,
    isCalibrationDependent: false,
    isLongitudinalDependent: true,
    isDirectMeasurement: true,
    isDerived: false,
    userFacingDisclaimer: 'Boylamsal profil FAZ 2.15 kapsamında tekrarlı ölçümlerle devreye alınacaktır.',
    status: 'FUTURE',
  },
];

/**
 * Resolves the effective runtime status of a visualization for a specific user profile context.
 */
export function evaluateVisualizationStatus(
  def: ProfileVisualizationDefinition,
  context: {
    measuredConstructCodes: string[];
    measuredFacetCodes: string[];
    hasAttachmentData: boolean;
    hasErqData: boolean;
    hasRsesData: boolean;
    hasGseData: boolean;
  }
): VisualStatus {
  if (def.status === 'BLOCKED' || def.status === 'FUTURE') {
    return def.status;
  }

  if (def.status === 'ACTIVE') {
    return 'ACTIVE';
  }

  if (def.status === 'CONDITIONAL') {
    if (def.conditionalPredicate && def.conditionalPredicate(context)) {
      return 'ACTIVE';
    }
    return 'CONDITIONAL';
  }

  return 'BLOCKED';
}

/**
 * Returns all visualizations categorized by status for the current profile context.
 */
export function getCategorizedVisualizations(context: {
  measuredConstructCodes: string[];
  measuredFacetCodes: string[];
  hasAttachmentData: boolean;
  hasErqData: boolean;
  hasRsesData: boolean;
  hasGseData: boolean;
}): {
  active: ProfileVisualizationDefinition[];
  conditional: ProfileVisualizationDefinition[];
  blocked: ProfileVisualizationDefinition[];
  future: ProfileVisualizationDefinition[];
} {
  const active: ProfileVisualizationDefinition[] = [];
  const conditional: ProfileVisualizationDefinition[] = [];
  const blocked: ProfileVisualizationDefinition[] = [];
  const future: ProfileVisualizationDefinition[] = [];

  for (const def of MASTER_VISUALIZATION_REGISTRY) {
    const effectiveStatus = evaluateVisualizationStatus(def, context);
    if (effectiveStatus === 'ACTIVE') {
      active.push(def);
    } else if (effectiveStatus === 'CONDITIONAL') {
      conditional.push(def);
    } else if (effectiveStatus === 'BLOCKED') {
      blocked.push(def);
    } else {
      future.push(def);
    }
  }

  return { active, conditional, blocked, future };
}
