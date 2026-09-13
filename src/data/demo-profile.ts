export interface DemoCoreTrait {
  name: string;
  name_tr: string;
  score: number; // 0-100 preview score
  standardError: number;
  ci95: [number, number];
  facetCount: number;
  coverage: number; // percentage
}

export interface DemoFacetDetail {
  id: string;
  name: string;
  name_tr: string;
  constructId: string;
  constructName: string;
  score: number;
  standardError: number;
  ci95: [number, number];
  observedItems: number;
  measurementPrecision: 'High' | 'Moderate' | 'Developing';
  epistemicStatus: 'VALIDATED_MEASUREMENT' | 'EVIDENCE_SUPPORTED_INTERPRETATION' | 'THEORETICAL_INTERPRETATION';
  validationStatus: 'Provisional' | 'Pilot' | 'Standardized';
  description: string;
}

export interface DemoInsight {
  id: string;
  title: string;
  badge: string;
  badgeTone: 'brand' | 'blue' | 'amber' | 'neutral';
  body: string;
  groundedFacets: string[];
}

export interface DemoContextShift {
  constructName: string;
  constructName_tr: string;
  general: number;
  work: number;
  relationship: number;
  stress: number;
  variabilityIndex: number;
  interpretation: string;
}

export interface DemoTensionSynergy {
  id: string;
  type: 'tension' | 'synergy';
  facetA: string;
  facetB: string;
  strength: number; // 0 to 1
  title: string;
  description: string;
  recommendation: string;
}

export interface DemoTheoryCouncilCard {
  lensId: string;
  theoristName: string;
  title: string;
  perspective: string;
  epistemicStatus: 'THEORETICAL_INTERPRETATION' | 'HISTORICAL_FRAMEWORK';
  interpretation: string;
  groundedAttributes: string[];
  limitations: string;
}

export interface DemoAssessmentQuestion {
  id: string;
  moduleName: string;
  type: 'likert' | 'situational_judgement';
  questionNumber: number;
  totalQuestions: number;
  estimatedMinutesLeft: number;
  text: string;
  text_tr: string;
  contextTag?: string;
  scenarioBody?: string;
  sjtOptions?: {
    id: string;
    text: string;
    text_tr: string;
  }[];
}

export const DEMO_PROFILE_DATA = {
  isDemoProfile: true,
  disclaimer: 'ÖNİZLEME VERİSİ — Mimari inceleme ve arayüz denetimi için hazırlanmıştır',
  userName: 'Alex',
  overallCoverage: {
    percentage: 50,
    exploredFacets: 42,
    totalFacets: 84,
  },
  measurementQuality: {
    status: 'Ön-Kalibrasyon Araştırma Modeli',
    precision: 'Gelişiyor (Tek Maddeli Başlangıç)',
    responseQuality: 'Belirgin Kalite Sorunu Saptanmadı',
    methodDiversity: 'Çok Yöntemli (Likert + Durumsal Senaryolar)',
    temporalStability: 'Gelişiyor (Temel Seviye Sprint Tamamlandı)',
    calibrationStatus: 'Ön-Kalibrasyon Araştırma Modeli (Nüfus Normu Hariç)',
  },
  coreTraits: [
    { name: 'Dürüstlük-Alçakgönüllülük', name_tr: 'Dürüstlük-Alçakgönüllülük', score: 76, standardError: 4.8, ci95: [67, 85], facetCount: 4, coverage: 75 },
    { name: 'Duygusallık', name_tr: 'Duygusallık', score: 58, standardError: 5.2, ci95: [48, 68], facetCount: 4, coverage: 60 },
    { name: 'Dışadönüklük', name_tr: 'Dışadönüklük', score: 64, standardError: 4.5, ci95: [55, 73], facetCount: 4, coverage: 70 },
    { name: 'Uyumluluk', name_tr: 'Uyumluluk', score: 72, standardError: 5.0, ci95: [62, 82], facetCount: 4, coverage: 65 },
    { name: 'Sorumluluk', name_tr: 'Sorumluluk', score: 81, standardError: 4.1, ci95: [73, 89], facetCount: 4, coverage: 80 },
    { name: 'Deneyime Açıklık', name_tr: 'Deneyime Açıklık', score: 85, standardError: 3.9, ci95: [77, 93], facetCount: 4, coverage: 85 },
  ] as DemoCoreTrait[],

  personalityFacets: [
    {
      id: 'f_soc_bold',
      name: 'Sosyal Cesaret',
      name_tr: 'Sosyal Cesaret',
      constructId: 'extraversion',
      constructName: 'Dışadönüklük',
      score: 71,
      standardError: 4.2,
      ci95: [63, 79],
      observedItems: 6,
      measurementPrecision: 'Moderate',
      epistemicStatus: 'VALIDATED_MEASUREMENT',
      validationStatus: 'Provisional',
      description: 'Topluluk önünde rahat konuşma, inisiyatif alma ve sosyal ortamlarda kendini güvende hissetme eğilimi.',
    },
    {
      id: 'f_sincerity',
      name: 'İçtenlik',
      name_tr: 'İçtenlik',
      constructId: 'honesty_humility',
      constructName: 'Dürüstlük-Alçakgönüllülük',
      score: 79,
      standardError: 3.8,
      ci95: [72, 86],
      observedItems: 6,
      measurementPrecision: 'High',
      epistemicStatus: 'VALIDATED_MEASUREMENT',
      validationStatus: 'Provisional',
      description: 'Kişilerarası ilişkilerde yapmacıklıktan ve manipülatif tavırlardan kaçınma, dürüst ve doğrudan iletişim kurma.',
    },
    {
      id: 'f_organization',
      name: 'Düzenlilik',
      name_tr: 'Düzenlilik',
      constructId: 'conscientiousness',
      constructName: 'Sorumluluk',
      score: 84,
      standardError: 3.6,
      ci95: [77, 91],
      observedItems: 6,
      measurementPrecision: 'High',
      epistemicStatus: 'VALIDATED_MEASUREMENT',
      validationStatus: 'Provisional',
      description: 'İş ve yaşam ortamını sistematik, planlı, yapılandırılmış ve titiz biçimde yönetme eğilimi.',
    },
    {
      id: 'f_inquisitiveness',
      name: 'Entelektüel Merak',
      name_tr: 'Entelektüel Merak',
      constructId: 'openness',
      constructName: 'Deneyime Açıklık',
      score: 88,
      standardError: 3.4,
      ci95: [81, 95],
      observedItems: 6,
      measurementPrecision: 'High',
      epistemicStatus: 'VALIDATED_MEASUREMENT',
      validationStatus: 'Provisional',
      description: 'Bilim, felsefe, doğa ve yeni bilgi alanlarını derinlemesine keşfetmeye yönelik güçlü zihinsel merak.',
    },
    {
      id: 'f_patience',
      name: 'Sabır ve Sakinlik',
      name_tr: 'Sabır ve Sakinlik',
      constructId: 'agreeableness',
      constructName: 'Uyumluluk',
      score: 69,
      standardError: 4.9,
      ci95: [59, 79],
      observedItems: 6,
      measurementPrecision: 'Moderate',
      epistemicStatus: 'VALIDATED_MEASUREMENT',
      validationStatus: 'Provisional',
      description: 'Tahrik edici durumlar ve beklenmedik aksaklıklar karşısında soğukkanlı kalabilme, öfkeyi kontrol edebilme toleransı.',
    },
    {
      id: 'f_anxiety',
      name: 'Kaygı Eğilimi',
      name_tr: 'Kaygı Eğilimi',
      constructId: 'emotionality',
      constructName: 'Duygusallık',
      score: 55,
      standardError: 5.1,
      ci95: [45, 65],
      observedItems: 6,
      measurementPrecision: 'Moderate',
      epistemicStatus: 'VALIDATED_MEASUREMENT',
      validationStatus: 'Provisional',
      description: 'Gelecek belirsizlikleri, olası riskler ve stresörler karşısında endişe hissetme sıklığı.',
    },
  ] as DemoFacetDetail[],

  keyInsights: [
    {
      id: 'ins_1',
      title: 'Güçlü Özerklik + Yüksek Sosyal Duyarlılık',
      badge: 'Geçici Örüntü (Ön Kalibrasyon)',
      badgeTone: 'brand',
      body: 'Kararlarınızda belirgin bir bağımsızlık ve özerklik tercihi sergilerken, bu durum yüksek kişilerarası farkındalıkla dengelenmektedir. Başkalarına keyfi kurallar dayatmak yerine ortak paydayı gözetirsiniz.',
      groundedFacets: ['Özerklik İhtiyacı', 'Perspektif Alma', 'Dürüstlük-Alçakgönüllülük'],
    },
    {
      id: 'ins_2',
      title: 'Bağlama Duyarlı Kendini Ortaya Koyma',
      badge: 'Bağlamsal Örüntü',
      badgeTone: 'blue',
      body: 'İddiacılık ve kendini ortaya koyma düzeyiniz profesyonel ve hedef odaklı ortamlarda (84/100), yakın ve kişisel ilişkilere (58/100) kıyasla belirgin şekilde daha güçlüdür. Bu durum bir tutarsızlık değil, sağlıklı bir durumsal esneklik göstergesidir.',
      groundedFacets: ['Kendini Ortaya Koyma', 'Sınır Koyma'],
    },
    {
      id: 'ins_3',
      title: 'Yüksek Zihinsel Merak ve Planlı Tedbirlilik',
      badge: 'Geçici Örüntü (Ön Kalibrasyon)',
      badgeTone: 'brand',
      body: 'Yeni fikirlere olan yüksek açıklığınız, güçlü bir organizasyonel planlama ile çıpalanmıştır. Yapılandırılmış uygulamayı elden bırakmadan yenilikçi kavramları araştırmaktan keyif alırsınız.',
      groundedFacets: ['Entelektüel Merak', 'Tedbirlilik', 'Düzenlilik'],
    },
  ] as DemoInsight[],

  contextShifts: [
    {
      constructName: 'Kendini Ortaya Koyma',
      constructName_tr: 'Kendini Ortaya Koyma',
      general: 72,
      work: 84,
      relationship: 58,
      stress: 63,
      variabilityIndex: 0.18,
      interpretation: 'İş ortamında net ve yönlendirici sınırlar çizerken, yakın ilişkilerde uyum ve empati lehine iddiacılığı yumuşatma eğilimi.',
    },
    {
      constructName: 'Duygusal Paylaşım',
      constructName_tr: 'Duygusal Paylaşım',
      general: 68,
      work: 42,
      relationship: 82,
      stress: 55,
      variabilityIndex: 0.24,
      interpretation: 'Profesyonel ortamda duygusal mesafeyi korurken, güvendiği ikili ilişkilerde yüksek açıklık ve derin paylaşım sergileme.',
    },
    {
      constructName: 'Tedbirlilik ve Planlama',
      constructName_tr: 'Tedbirlilik ve Planlama',
      general: 75,
      work: 88,
      relationship: 60,
      stress: 79,
      variabilityIndex: 0.16,
      interpretation: 'Görev ve stres anlarında planlama hassasiyeti belirgin şekilde yükselmekte, hata toleransı daralmaktadır.',
    },
  ] as DemoContextShift[],

  tensionsAndSynergies: [
    {
      id: 'pat_1',
      type: 'tension',
      facetA: 'Özerklik İhtiyacı',
      facetB: 'Dış Onay Duyarlılığı',
      strength: 0.74,
      title: 'Özerklik ve Dış Onay Gerilimi',
      description: 'Ölçümleriniz, kendi yolunuzu çizmeye yönelik otantik bir arzu ile çevrenizden onay alma konusundaki yüksek hassasiyetin bir arada bulunduğunu gösterir. Bu durum, tartışmalı kararlar öncesinde yoğun bir içsel müzakere yaratır.',
      recommendation: 'Hangi kararların mutlak uzlaşı, hangilerinin ise kişisel inisiyatif gerektirdiğini netleştirmek zihinsel yükü azaltacaktır.',
    },
    {
      id: 'pat_2',
      type: 'synergy',
      facetA: 'Sorumluluk ve Düzen',
      facetB: 'Uzun Vadeli Azim',
      strength: 0.86,
      title: 'Sistematik İcra Sinerjisi',
      description: 'Günlük hayattaki yüksek düzenlilik ve planlılık, uzun vadeli hedef azmiyle kusursuz bir şekilde eşleşmektedir. Bu sinerji, karmaşık projelerde istikrarlı bir sonuç üretme gücü sağlar.',
      recommendation: 'Aşırı yüklenmeyi ve tükenmişliği önlemek için planlarınıza düzenli dinlenme aralıkları ekleyin.',
    },
  ] as DemoTensionSynergy[],

  theoryCouncilLenses: [
    {
      lensId: 'lens_rogers',
      theoristName: 'Carl Rogers',
      title: 'Birey Merkezli Yaklaşım / Benlik Uyumu',
      perspective: 'Benlik Uyumu ve Gelişimsel Potansiyel',
      epistemicStatus: 'THEORETICAL_INTERPRETATION',
      interpretation: 'Rogers perspektifinden bakıldığında; mevcut benliğiniz ile ideal benliğiniz arasındaki dengeli mesafe, aşırı özeleştiriye kaçmadan sağlıklı bir gelişimsel farkındalık taşıdığınızı gösterir. İş hayatında gözlenen şartlı benlik değeri, zamanla yumuşatılabilecek içselleştirilmiş koşulları yansıtır.',
      groundedAttributes: ['Temel Benlik Saygısı', 'Gerçek-İdeal Benlik Mesafesi', 'Otantiklik'],
      limitations: 'Hümanistik gelişim kavramları fenomenolojik ve danışmanlık odaklıdır; ampirik örtük özellik puanları ile karıştırılmamalıdır.',
    },
    {
      lensId: 'lens_adler',
      theoristName: 'Alfred Adler',
      title: 'Bireysel Psikoloji',
      perspective: 'Yetkinlik Çabası ve Toplumsal İlgi',
      epistemicStatus: 'THEORETICAL_INTERPRETATION',
      interpretation: 'Adler kuramı, yüksek çalışma disiplininiz ile gelişmiş işbirlikçi empatinizin (Gemeinschaftsgefühl) birleşimine odaklanır. Yetkinlik arayışınız bencil bir tahakküm kurmaktan ziyade toplumsal ve kurumsal faydaya hizmet eder.',
      groundedAttributes: ['Sosyal Cesaret', 'Adalet ve Hakkaniyet', 'İşbirlikçi Çatışma Tarzı'],
      limitations: 'Gaye ve amaç odaklı (teleolojik) yapılar kişisel gelişim için zengin açılımlar sunar ancak psikometrik ölçüm değişmezliği taşımaz.',
    },
    {
      lensId: 'lens_freud',
      theoristName: 'Sigmund Freud',
      title: 'Klasik Psikanaliz',
      perspective: 'Yapısal Çatışma ve Yüceltme (Süblimasyon)',
      epistemicStatus: 'THEORETICAL_INTERPRETATION',
      interpretation: 'Psikanalitik mercekten bakıldığında, düşük negatif tepkiselliğiniz ile yüksek yaratıcı merakınızın birlikteliği başarılı bir yüceltmeye işaret eder. İçsel dürtüsel gerilimlerin entelektüel ve üretken alanlara yapıcı bir şekilde kanalize edildiği görülmektedir.',
      groundedAttributes: ['Dürtüsellik Kontrolü', 'Yaratıcılık', 'Bilişsel Yeniden Çerçeveleme'],
      limitations: 'Klasik psikanalitik dürtü modelleri, standart anket ve psikometri yöntemleriyle deneysel olarak yanlışlanamaz.',
    },
    {
      lensId: 'lens_maslow',
      theoristName: 'Abraham Maslow',
      title: 'Bütüncül Dinamikler',
      perspective: 'Gelişim ve İhtiyaç Değerleri',
      epistemicStatus: 'THEORETICAL_INTERPRETATION',
      interpretation: 'Evrensel değerler ve zihinsel merak boyutlarındaki yüksek düzeyleriniz, kişisel istikrar zeminine oturan belirgin bir kendini gerçekleştirme yönelimine işaret eder.',
      groundedAttributes: ['Aşkınlık Değerleri', 'Deneyime Açıklık', 'Anlam Varlığı'],
      limitations: 'Katı hiyerarşik ihtiyaç basamakları modern kültürlerarası araştırmalar tarafından ampirik olarak tam doğrulanmamıştır.',
    },
    {
      lensId: 'lens_james',
      theoristName: 'William James',
      title: 'İşlevselcilik ve Pragmatizm',
      perspective: 'Davranışsal Alışkanlıkların Uyum Sağlayıcı İşlevi',
      epistemicStatus: 'HISTORICAL_FRAMEWORK',
      interpretation: 'James, bağlamsal değişkenlik gösteren iddiacılığınızın işlevsel faydasına dikkat çekerdi: Profesyonel müzakerelerde net bir duruş sergilerken kişisel bağlarda yumuşamak, enerjiyi akılcı kullanan işlevsel bir davranış ekonomisidir.',
      groundedAttributes: ['Bilişsel Esneklik', 'Bağlamsal Uyum', 'Biliş İhtiyacı'],
      limitations: 'İşlevselcilik, niceliksel bir puanlama sisteminden ziyade yönlendirici felsefi bir tutumdur.',
    },
  ] as DemoTheoryCouncilCard[],

  assessmentSample: {
    likert: {
      id: 'itm_dec_eval_01',
      moduleName: 'Bilişsel ve Karar Tarzları',
      type: 'likert',
      questionNumber: 14,
      totalQuestions: 48,
      estimatedMinutesLeft: 7,
      text: 'Önemli bir karar verirken genellikle harekete geçmeden önce olası birçok sonucu dikkatle gözden geçiririm.',
      text_tr: 'Önemli bir karar verirken genellikle harekete geçmeden önce olası birçok sonucu dikkatle gözden geçiririm.',
      contextTag: 'Karar Alma / Genel',
    } as DemoAssessmentQuestion,
    scenario: {
      id: 'itm_sjt_team_02',
      moduleName: 'İlişkisel ve Çatışma Senaryoları',
      type: 'situational_judgement',
      questionNumber: 22,
      totalQuestions: 48,
      estimatedMinutesLeft: 5,
      text: 'Proje Teslim Tarihi ve Ekip İçi Anlaşmazlık',
      text_tr: 'Proje Teslim Tarihi ve Ekip İçi Anlaşmazlık',
      contextTag: 'İş Yeri / Ekip Dinamikleri',
      scenarioBody: 'Müşteri sunumuna 48 saat kala yürütülen kritik bir projeye liderlik ediyorsunuz. Ekipteki kilit çalışma arkadaşlarınızdan biri, projenin lansmanını 1 hafta ertelemeyi veya ekipçe çok stresli bir gece çalışmasını gerektirecek ciddi bir tasarım açığı tespit ediyor.',
      sjtOptions: [
        {
          id: 'opt_a',
          text: 'Derhal 20 dakikalık bir durum değerlendirme toplantısı yapar, riskleri şeffaflıkla tartarak müşteriye aşamalı teslim alternatifi sunarım.',
          text_tr: 'Derhal 20 dakikalık bir durum değerlendirme toplantısı yapar, riskleri şeffaflıkla tartarak müşteriye aşamalı teslim alternatifi sunarım.',
        },
        {
          id: 'opt_b',
          text: 'İnisiyatifi ele alarak mevcut sürümü planlandığı gibi teslim eder, tasarım iyileştirmelerini lansman sonrası ilk güncellemeye bırakırım.',
          text_tr: 'İnisiyatifi ele alarak mevcut sürümü planlandığı gibi teslim eder, tasarım iyileştirmelerini lansman sonrası ilk güncellemeye bırakırım.',
        },
        {
          id: 'opt_c',
          text: 'Ekibi ortak bir hedef etrafında motive ederek kusuru teslim tarihinden önce çözmek için doğrudan desteğimi ortaya koyarım.',
          text_tr: 'Ekibi ortak bir hedef etrafında motive ederek kusuru teslim tarihinden önce çözmek için doğrudan desteğimi ortaya koyarım.',
        },
        {
          id: 'opt_d',
          text: 'Zaman ve kalite arasındaki bu tercihin sorumluluğunu üst yöneticiye veya proje sponsoruna danışarak belirlerim.',
          text_tr: 'Zaman ve kalite arasındaki bu tercihin sorumluluğunu üst yöneticiye veya proje sponsoruna danışarak belirlerim.',
        },
      ],
    } as DemoAssessmentQuestion,
  },
};
