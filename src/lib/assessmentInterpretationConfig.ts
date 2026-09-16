export type VisualRepresentationType =
  | 'HEXACO_RADAR'
  | 'TRAIT_BREAKDOWN'
  | 'DIMENSION_SPECTRUM'
  | 'GENERIC_DIMENSION_PROFILE';

export type ScoreBand = 'LOW' | 'BALANCED' | 'HIGH';

export interface ScoreBandDetails {
  band: ScoreBand;
  labelTr: string;
  shortLabelTr: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

/**
 * Maps module codes to their primary visual representation archetype.
 * Strictly controlled: only explicit HEXACO modules map to HEXACO_RADAR.
 */
export const ASSESSMENT_VISUAL_REGISTRY: Record<string, VisualRepresentationType> = {
  MODULE_1_CORE_PERSONALITY: 'HEXACO_RADAR',
  CORE_INTAKE: 'HEXACO_RADAR',
  MODULE_2_SELF_IDENTITY: 'DIMENSION_SPECTRUM',
  MODULE_5_GENERAL_SELF_EFFICACY: 'DIMENSION_SPECTRUM',
  MODULE_3_EMOTION_REGULATION: 'TRAIT_BREAKDOWN',
  MODULE_4_VOLITION_CONTROL: 'TRAIT_BREAKDOWN',
  MODULE_6_ATTACHMENT_PATTERNS: 'GENERIC_DIMENSION_PROFILE',
};

/**
 * Resolves visual representation archetype for any module code safely.
 * Never falls back to HEXACO_RADAR for unknown or non-personality modules.
 */
export function resolveVisualArchetype(moduleCode?: string | null): VisualRepresentationType {
  if (!moduleCode) return 'GENERIC_DIMENSION_PROFILE';
  const norm = moduleCode.toUpperCase().trim();
  if (ASSESSMENT_VISUAL_REGISTRY[norm]) {
    return ASSESSMENT_VISUAL_REGISTRY[norm];
  }
  return 'GENERIC_DIMENSION_PROFILE';
}

/**
 * Deterministic score band threshold evaluator.
 * Supports both 1.0–5.0 Likert (HEXACO) and 1.0–4.0 Likert (RSES/GSE) scales.
 */
export function getScoreBand(score: number, maxScale: number = 5.0): ScoreBandDetails {
  const isFourPoint = maxScale <= 4.0;
  const lowThreshold = isFourPoint ? 2.25 : 2.50;
  const highThreshold = isFourPoint ? 3.25 : 3.50;

  if (score < lowThreshold) {
    return {
      band: 'LOW',
      labelTr: 'Daha Düşük Eğilim',
      shortLabelTr: 'Düşük',
      colorClass: 'text-sky-700',
      bgClass: 'bg-sky-50',
      borderClass: 'border-sky-200',
    };
  }
  if (score <= highThreshold) {
    return {
      band: 'BALANCED',
      labelTr: 'Dengeli / Orta Düzey Eğilim',
      shortLabelTr: 'Dengeli',
      colorClass: 'text-emerald-700',
      bgClass: 'bg-emerald-50',
      borderClass: 'border-emerald-200',
    };
  }
  return {
    band: 'HIGH',
    labelTr: 'Daha Yüksek Eğilim',
    shortLabelTr: 'Yüksek',
    colorClass: 'text-brand-700',
    bgClass: 'bg-brand-50',
    borderClass: 'border-brand-200',
  };
}

export interface TraitInterpretationDefinition {
  code: string;
  nameTr: string;
  shortDescriptionTr: string;
  interpretationByBand: {
    HIGH: string;
    BALANCED: string;
    LOW: string;
  };
  strengths: {
    HIGH: string[];
    BALANCED: string[];
    LOW: string[];
  };
  risks: {
    HIGH: string[];
    BALANCED: string[];
    LOW: string[];
  };
}

export const ALL_TRAIT_INTERPRETATIONS: Record<string, TraitInterpretationDefinition> = {
  // ---------------------------------------------------------
  // 1. HEXACO Core Personality Dimensions
  // ---------------------------------------------------------
  honesty_humility: {
    code: 'honesty_humility',
    nameTr: 'Dürüstlük-Alçakgönüllülük',
    shortDescriptionTr: 'İçtenlik, adalet, açgözlülükten kaçınma ve tevazu boyutları.',
    interpretationByBand: {
      HIGH: 'İlişkilerinizde şeffaflık, hakkaniyet ve gösterişsiz duruş ön plandadır. Çıkar odaklı manipülasyonlardan kaçınır, ilkelere sadık kalırsınız.',
      BALANCED: 'Etik ilkelere değer verirken durumsal gereksinimler ve stratejik hedefler arasında dengeli bir pragmatizm sergilersiniz.',
      LOW: 'Fırsatları değerlendirmede pragmatik, rekabetçi ve kendi hedeflerini savunmada doğrudan ve stratejik bir yaklaşım benimsersiniz.',
    },
    strengths: {
      HIGH: ['Yüksek güvenilirlik ve ilkeli duruş', 'Kişilerarası ilişkilerde samimiyet ve şeffaflık', 'Haksız avantajlardan kaçınma'],
      BALANCED: ['Dengeli müzakere becerisi', 'Etik duyarlılık ile pratik hedefleri bağdaştırma', 'Gerçekçi öz-değerlendirme'],
      LOW: ['Rekabetçi ortamlarda güçlü konumlanma', 'Müzakerelerde kararlı ve çıkarlarını koruyan tutum', 'Pragmatik problem çözme'],
    },
    risks: {
      HIGH: ['Politik ve stratejik manevra gerektiren ortamlarda dezavantaj', 'Başkalarından da aynı şeffaflığı bekleyip hayal kırıklığı yaşama'],
      BALANCED: ['Zorlu etik ikilemlerde karar verme süresinin uzaması'],
      LOW: ['İlişkilerde güven aşınması riski', 'Kısa vadeli kazanımlar uğruna uzun vadeli işbirliklerini zorlama'],
    },
  },
  emotionality: {
    code: 'emotionality',
    nameTr: 'Duygusallık',
    shortDescriptionTr: 'Korku/endişe duyarlılığı, duygusal bağlanma ve empati derinliği.',
    interpretationByBand: {
      HIGH: 'Çevresel tehditlere ve belirsizliklere karşı yüksek duyarlılık sergiler, yakın ilişkilerde derin empatik bağlar kurarsınız.',
      BALANCED: 'Duygusal tepkileriniz ile mantıksal değerlendirmeleriniz arasında sağlıklı bir denge kurarak stresle başa çıkarsınız.',
      LOW: 'Baskı ve belirsizlik altında sakinliğinizi korur, duygusal dalgalanmalardan minimum düzeyde etkilenerek soğukkanlı kalırsınız.',
    },
    strengths: {
      HIGH: ['Güçlü empati ve duygusal derinlik', 'Olası risk ve tehlikeleri erkenden sezme', 'Duygusal destek sağlama kapasitesi'],
      BALANCED: ['Stres yönetimi ve esneklik', 'Duygusal farkındalık ile rasyonel eylemi birleştirme', 'Dengeli risk alma'],
      LOW: ['Kriz anlarında soğukkanlılık', 'Yüksek duygusal dayanıklılık', 'Baskı altında net karar verebilme'],
    },
    risks: {
      HIGH: ['Belirsizlik durumlarında aşırı kaygı ve stres yaşama', 'Duygusal yükleri uzun süre taşıma eğilimi'],
      BALANCED: ['Aşırı yoğun krizlerde geçici duygusal yorulma'],
      LOW: ['Başkalarının duygusal ihtiyaçlarını fark etmede gecikme', 'Tehlikeleri olduğundan hafif algılama'],
    },
  },
  extraversion: {
    code: 'extraversion',
    nameTr: 'Dışadönüklük',
    shortDescriptionTr: 'Sosyal özgüven, cesaret, sosyallik ve canlılık boyutları.',
    interpretationByBand: {
      HIGH: 'Sosyal ortamlarda enerjik, girişken, özgüvenli ve etkileşimden beslenen bir dinamizme sahipsiniz.',
      BALANCED: 'Gerektiğinde sosyal ortamlarda etkin rol alırken, tek başına odaklanarak çalışmaktan da verim alırsınız.',
      LOW: 'Daha sakin, içsel süreçlere odaklı, kalabalık gruplar yerine birebir ve derin paylaşımları tercih eden bir tutum sergilersiniz.',
    },
    strengths: {
      HIGH: ['Sosyal cesaret ve liderlik enerjisi', 'Coşku aşılama ve motivasyon oluşturma', 'Geniş iletişim ağı kurma'],
      BALANCED: ['Farklı sosyal bağlamlara kolay uyum sağlama', 'İçsel ve dışsal odak dengesi', 'Sosyal yorgunluk yaşamadan etkileşim yönetimi'],
      LOW: ['Derin odaklanma ve bağımsız çalışma kapasitesi', 'Dinleme ve gözlemleme yeteneği', 'Seçici ve sağlam ilişkiler'],
    },
    risks: {
      HIGH: ['Sürekli dışsal uyarılma ihtiyacı', 'Yalnız çalışma süreçlerinde motivasyon düşüşü'],
      BALANCED: ['Sosyal tempo ile dinlenme ihtiyacı arasında zaman planlama gereksinimi'],
      LOW: ['Büyük gruplarda fikirlerini ifade etmekte çekingen kalma', 'Sosyal fırsatları kaçırma riski'],
    },
  },
  agreeableness: {
    code: 'agreeableness',
    nameTr: 'Uyumluluk',
    shortDescriptionTr: 'Bağışlayıcılık, nezaket, esneklik ve sabır boyutları.',
    interpretationByBand: {
      HIGH: 'Hoşgörülü, affedici, yapıcı işbirliğine açık ve çatışmalardan kaçınan uzlaşmacı bir yaklaşımınız vardır.',
      BALANCED: 'İşbirliğine açık olmakla birlikte, gerektiğinde sınırlarınızı net bir şekilde çizebilen esnek bir dengedesiniz.',
      LOW: 'Fikir ayrılıklarında doğrudan yüzleşmekten çekinmeyen, eleştirel düşünen ve tavizsiz bir duruş sergileyen yapıdasınız.',
    },
    strengths: {
      HIGH: ['Uyumlu ekip çalışması ve çatışma çözme', 'Sabır, nezaket ve empati', 'İlişkilerde güven ve sıcaklık ortamı yaratma'],
      BALANCED: ['Dengeli sınır koyma', 'Farklı görüşleri dinleyerek objektif karar alma', 'Yapıcı müzakere'],
      LOW: ['Haksızlıklara veya yetersizliklere karşı doğrudan tepki', 'Zor ve sert kararları alabilme', 'Eleştirel filtreleme'],
    },
    risks: {
      HIGH: ['Aşırı taviz vererek kişisel sınırları zayıflatma', 'Gerekli eleştirileri dile getirmeyi erteleme'],
      BALANCED: ['Çok taraflı çatışmalarda tarafsız kalmanın getirdiği baskı'],
      LOW: ['İletişimde sertlik veya sürtüşme yaşama', 'Başkalarının motivasyonunu istemeden kırma riski'],
    },
  },
  conscientiousness: {
    code: 'conscientiousness',
    nameTr: 'Sorumluluk',
    shortDescriptionTr: 'Düzenlilik, çalışkanlık, mükemmeliyetçilik ve tedbirlilik boyutları.',
    interpretationByBand: {
      HIGH: 'Disiplinli, düzenli, detaylara özen gösteren, planlı ve başladığı işi titizlikle bitiren bir çalışma tarzınız var.',
      BALANCED: 'Planlı çalışma ile durumsal esneklik arasında dengeli bir uyum sergiler, gerektiğinde rotanızı güncellersiniz.',
      LOW: 'Daha esnek, spontane, katı kurallardan ziyade anlık çözümlere ve akışa odaklanan bir yaklaşımınız var.',
    },
    strengths: {
      HIGH: ['Yüksek organizasyon ve hedef takibi', 'Metodolojik çalışma ve güvenilirlik', 'Hata payını minimize etme'],
      BALANCED: ['Hedef odaklılık ile esnekliğin dengesi', 'Değişen koşullara uyarlanabilir planlama', 'Zaman yönetimi'],
      LOW: ['Belirsizlik altında hızlı manevra kabiliyeti', 'Katı kural baskısından bağımsız yaratıcı çözümler', 'Doğaçlama yeteneği'],
    },
    risks: {
      HIGH: ['Aşırı mükemmeliyetçilik ve kontrol ihtiyacı', 'Beklenmeyen değişimler karşısında esneklik kaybı'],
      BALANCED: ['Yoğun dönemlerde önceliklendirme yükü'],
      LOW: ['Uzun vadeli planları tamamlamada erteleme', 'Detay gerektiren işlerde hata payının artması'],
    },
  },
  openness_to_experience: {
    code: 'openness_to_experience',
    nameTr: 'Deneyime Açıklık',
    shortDescriptionTr: 'Estetik duyarlılık, entelektüel merak, yaratıcılık ve sıra dışılık.',
    interpretationByBand: {
      HIGH: 'Entelektüel merakı yüksek, yeniliklere ve farklı fikirlere açık, estetik duyarlılığı güçlü ve yaratıcı bir zihne sahipsiniz.',
      BALANCED: 'Hem yenilikçi fikirlere ilgi duyar hem de kanıtlanmış pratik yaklaşımların değerini göz ardı etmezsiniz.',
      LOW: 'Geleneksel, kanıtlanmış, somut ve pratik çözümleri soyut teorilere tercih eden sağlamcı bir yaklaşımınız vardır.',
    },
    strengths: {
      HIGH: ['Yenilikçi problem çözme ve vizyoner bakış', 'Farklı bakış açılarına entelektüel merak', 'Yaratıcı düşünce'],
      BALANCED: ['Teori ile pratiği birleştirme', 'Yeni fikirlere açık ancak seçici filtreleme', 'Uygulanabilir inovasyon'],
      LOW: ['Pratik, somut ve hızlı uygulanabilir çözümler', 'Mevcut sistemleri ve gelenekleri koruma', 'Sağduyulu yaklaşım'],
    },
    risks: {
      HIGH: ['Soyut fikirlere odaklanıp pratik uygulama detaylarını kaçırma', 'Sürekli yenilik arayışıyla rutinleri bozma'],
      BALANCED: ['Radikal inovasyon ile geleneksel güvence arasında karar aşaması'],
      LOW: ['Yenilikçi yöntemlere karşı mesafeli durma', 'Farklı alternatifleri değerlendirmeyi erken sonlandırma'],
    },
  },

  // ---------------------------------------------------------
  // 2. Self-System & Identity (RSES / GSE)
  // ---------------------------------------------------------
  self_evaluation: {
    code: 'self_evaluation',
    nameTr: 'Benlik Değerlendirmesi (Özsaygı)',
    shortDescriptionTr: 'Rosenberg Benlik Saygısı Ölçeği (RSES) doğrultusunda genel öz-değer algısı.',
    interpretationByBand: {
      HIGH: 'Bu değerlendirmedeki yanıtlarınız, ölçeğin yanıt aralığında daha yüksek bir genel benlik saygısı ve öz-değer algısına işaret ediyor. Kişisel niteliklerinizi takdir etme ve zorluklar karşısında varoluşsal değerinizi koruma eğilimindesiniz.',
      BALANCED: 'Bu değerlendirmedeki yanıtlarınız, genel benlik saygısı düzeyinizin dengeli bir aralıkta olduğunu gösteriyor. Güçlü yönlerinizi farkında olmakla birlikte, zorlayıcı dönemlerde durumsal öz-eleştiriler geliştirebilirsiniz.',
      LOW: 'Bu değerlendirmedeki yanıtlarınız, ölçeğin yanıt aralığında daha temkinli veya düşük bir benlik saygısı eğilimine işaret ediyor. Zaman zaman kendi yeterliliğinize veya değerinize dair şüpheler deneyimliyor olabilirsiniz.',
    },
    strengths: {
      HIGH: ['Güçlü öz-değer ve içsel güven', 'Hataları felaketleştirmeden öğrenme fırsatı olarak görme', 'Sosyal karşılaştırmalardan minimum düzeyde etkilenme'],
      BALANCED: ['Gerçekçi ve dengeli öz-farkındalık', 'Kişisel sınırları koruma kapasitesi', 'Geri bildirimlere yapıcı yaklaşım'],
      LOW: ['Yüksek alçakgönüllülük ve derin öz-eleştiri kapasitesi', 'Gelişime açık olma', 'Kendi sınırlarını dikkatle tartma'],
    },
    risks: {
      HIGH: ['Gelişime açık zayıf noktaları gözden kaçırma riski'],
      BALANCED: ['Aşırı stresli dönemlerde geçici öz-güven dalgalanmaları'],
      LOW: ['Kişisel başarıları şansa bağlama eğilimi', 'Hatalar karşısında aşırı özeleştirel tutum'],
    },
  },
  core_self_esteem: {
    code: 'core_self_esteem',
    nameTr: 'Temel Benlik Saygısı (RSES)',
    shortDescriptionTr: 'Rosenberg Benlik Saygısı Ölçeği üzerinden ölçülen temel özsaygı.',
    interpretationByBand: {
      HIGH: 'Kendinizi değerli, yetkin ve olumlu niteliklere sahip bir birey olarak değerlendirme eğilimindesiniz.',
      BALANCED: 'Kendinize dair değerlendirmeleriniz duruma göre esneyebilen dengeli bir düzeydedir.',
      LOW: 'Kendinize dair algınızda zaman zaman yetersizlik veya değer şüphesi öne çıkabilmektedir.',
    },
    strengths: {
      HIGH: ['İçsel öz-değer hissi', 'Dirençlilik'],
      BALANCED: ['Dengeli öz-saygı'],
      LOW: ['Alçakgönüllülük'],
    },
    risks: {
      HIGH: ['Eleştirilere karşı aşırı rahatlık'],
      BALANCED: ['Dönemsel şüphe'],
      LOW: ['Öz-şefkat eksikliği'],
    },
  },
  agency_mastery: {
    code: 'agency_mastery',
    nameTr: 'Yetkinlik ve İrade (Genel Öz-Yeterlik)',
    shortDescriptionTr: 'Schwarzer & Jerusalem Genel Öz-Yeterlik Ölçeği (GSE) doğrultusunda başa çıkma inancı.',
    interpretationByBand: {
      HIGH: 'Bu değerlendirmede yeni veya zorlayıcı durumlarla karşılaştığınızda gerekli adımları başarıyla organize edip yürütebileceğinize dair inancınız yüksek düzeydedir.',
      BALANCED: 'Zorluklar karşısında kendi başa çıkma kapasitenize dair inancınız dengeli bir düzeydedir; tanıdık durumlarda kendinize güvenirken yeni belirsizliklerde durumsal hazırlık ihtiyacı duyarsınız.',
      LOW: 'Beklenmedik veya karmaşık zorluklar karşısında kendi başa çıkma kaynaklarınıza dair algınız daha temkinli ve tereddütlü bir eğilim sergilemektedir.',
    },
    strengths: {
      HIGH: ['Engeller karşısında sebat ve ısrar', 'Hedef odaklı eylem organizasyonu', 'Çözüm üretme odaklılık'],
      BALANCED: ['Gerçekçi kapasite değerlendirmesi', 'Riskleri tartarak adım atma', 'Gerektiğinde destek arayışı'],
      LOW: ['Tedbirli ve hazırlıklı yaklaşım', 'Kapasiteyi aşan risklere girmeme', 'Detaylı durum analizi'],
    },
    risks: {
      HIGH: ['Kapasiteyi aşan durumlarda aşırı yüklenme ve yardımı reddetme'],
      BALANCED: ['Belirsizlik anlarında karar alma sürecinin uzaması'],
      LOW: ['Zorlu fırsatları denemekten erken vazgeçme riski'],
    },
  },
  generalized_self_efficacy: {
    code: 'generalized_self_efficacy',
    nameTr: 'Genel Öz-Yeterlilik (GSE)',
    shortDescriptionTr: 'Zorlu durumlarla başa çıkabilme ve hedeflere ulaşabilme inancı.',
    interpretationByBand: {
      HIGH: 'Karmaşık engeller karşısında çözüm üretebilme inancınız güçlüdür.',
      BALANCED: 'Başa çıkma kapasitenize dair dengeli bir güven duyarsınız.',
      LOW: 'Beklenmedik zorluklarda daha temkinli bir başa çıkma algısına sahipsiniz.',
    },
    strengths: {
      HIGH: ['Yüksek başa çıkma direnci', 'Hedef odaklılık'],
      BALANCED: ['Gerçekçi planlama'],
      LOW: ['Riskten kaçınma'],
    },
    risks: {
      HIGH: ['Sınırları aşırı zorlama'],
      BALANCED: ['Geçici tereddüt'],
      LOW: ['Erteleme eğilimi'],
    },
  },
  // ---------------------------------------------------------
  // 3. Emotion Regulation (ERQ - Gross & John, 2003)
  // ---------------------------------------------------------
  emotion_regulation: {
    code: 'emotion_regulation',
    nameTr: 'Duygu Düzenleme Stratejileri',
    shortDescriptionTr: 'Duygusal durumları anlamlandırma, dönüştürme ve ifade etme yaklaşımları.',
    interpretationByBand: {
      HIGH: 'Duygusal deneyimlerinizi yönetmede aktif ve bilinçli düzenleme stratejileri kullanırsınız.',
      BALANCED: 'Duygusal durumlarınıza göre durumsal ve esnek düzenleme tercihleri sergilersiniz.',
      LOW: 'Duygusal tepkilerinizi doğrudan akışına bırakmayı tercih edersiniz.',
    },
    strengths: {
      HIGH: ['Duygusal farkındalık ve esneklik', 'Stresli durumlarda içsel dengeyi yeniden kurabilme'],
      BALANCED: ['Duruma göre esnek uyum', 'Doğal duygu akışı ile rasyonel kontrol dengesi'],
      LOW: ['Duyguları filtresiz ve doğrudan yaşayabilme'],
    },
    risks: {
      HIGH: ['Aşırı bilişsel kontrol nedeniyle spontane duygulanımı sınırlama'],
      BALANCED: ['Aşırı yoğun kriz anlarında strateji seçmede duraksama'],
      LOW: ['Zorlayıcı duygulanım anlarında toparlanma süresinin uzaması'],
    },
  },
  cognitive_reappraisal: {
    code: 'cognitive_reappraisal',
    nameTr: 'Bilişsel Yeniden Değerlendirme (Reappraisal)',
    shortDescriptionTr: 'Olaylara ve stres kaynaklarına bakış açısını değiştirerek duygusal etkiyi düzenleme becerisi.',
    interpretationByBand: {
      HIGH: 'Zorlayıcı durumlarda olayları farklı perspektiflerden ele alarak olumlu veya yapıcı yönleri görme eğiliminiz yüksektir.',
      BALANCED: 'Duruma göre bakış açınızı esnetebilir veya olayları olduğu gibi kabullenerek ilerlersiniz.',
      LOW: 'Olayları ilk algılandığı şekliyle deneyimlemeye odaklanırsınız.',
    },
    strengths: {
      HIGH: ['Stres anında yapıcı anlamlandırma', 'Duygusal dayanıklılık', 'Çözüm odaklı bakış açısı'],
      BALANCED: ['Gerçekçi durum değerlendirmesi', 'Dengeli bilişsel esneklik'],
      LOW: ['Olayların duygusal etkisini doğrudan kabul etme'],
    },
    risks: {
      HIGH: ['Gerçekten çözülmesi gereken somut problemleri yalnızca zihinsel olarak geçiştirme riski'],
      BALANCED: ['Ani ve beklenmedik krizlerde anlamlandırmanın zaman alması'],
      LOW: ['Olumsuz bakış açısında takılı kalma eğilimi'],
    },
  },
  expressive_suppression: {
    code: 'expressive_suppression',
    nameTr: 'Duygusal Bastırma / Dışavurum Kontrolü (Suppression)',
    shortDescriptionTr: 'Duyguların dışa yansımasını sınırlandırma ve içsel tutma eğilimi.',
    interpretationByBand: {
      HIGH: 'Duygularınızı başkalarına göstermeme ve dışavurumu kontrol altında tutma eğiliminiz belirgindir.',
      BALANCED: 'Sosyal bağlama uygun olarak duygularınızı ne zaman paylaşacağınızı dengelersiniz.',
      LOW: 'Duygusal durumlarınızı açıkça ve şeffaf biçimde dışa yansıtırsınız.',
    },
    strengths: {
      HIGH: ['Resmi ve profesyonel ortamlarda duygusal kontrol', 'Dürtüsel tepkileri dizginleme'],
      BALANCED: ['Bağlama duyarlı duygusal ifade', 'Sağlıklı paylaşım dengesi'],
      LOW: ['Açık, şeffaf ve anlaşılır iletişim', 'Yakın ilişkilerde içtenlik'],
    },
    risks: {
      HIGH: ['İçsel duygusal yük birikimi', 'Yakın ilişkilerde mesafe algısı oluşması'],
      BALANCED: ['Belirsiz ortamlarda çekingenlik'],
      LOW: ['Profesyonel sınırlarda istemeden fazla duygusal tepki verme'],
    },
  },
  // ---------------------------------------------------------
  // 4. Attachment & Relational Patterns (ECR-R)
  // ---------------------------------------------------------
  attachment_patterns: {
    code: 'attachment_patterns',
    nameTr: 'İlişkisel Bağlanma Örüntüleri',
    shortDescriptionTr: 'Yakın ilişkilerde güven, özerklik ve yakınlık kurma dinamikleri.',
    interpretationByBand: {
      HIGH: 'Yakın ilişkilerde güven ve paylaşım dengesine dair belirgin tercihleriniz vardır.',
      BALANCED: 'İlişkilerde yakınlık ile kişisel özerklik arasında dengeli bir uyum sergilersiniz.',
      LOW: 'İlişkisel dinamiklerinizde esnek ve durumsal bir yaklaşım benimsersiniz.',
    },
    strengths: {
      HIGH: ['İlişki ihtiyaçlarının farkındalığı', 'Özerklik ve yakınlık bilinci'],
      BALANCED: ['Sağlıklı sınırlar koyabilme', 'Dengeli güven inşası'],
      LOW: ['Farklı ilişki türlerine kolay uyum'],
    },
    risks: {
      HIGH: ['İlişkisel beklentilerde katılık'],
      BALANCED: ['Yeni ilişkilerde güven tesisinin zaman alması'],
      LOW: ['Sınır belirlemede belirsizlik'],
    },
  },
  attachment_anxiety: {
    code: 'attachment_anxiety',
    nameTr: 'Bağlanma Duyarlılığı (Anxiety Dimension)',
    shortDescriptionTr: 'Yakın ilişkilerde onay, ilgi ve güvence arayışı duyarlılığı.',
    interpretationByBand: {
      HIGH: 'İlişkilerinizde duygusal yakınlık, netlik ve karşılıklı bağın sürekliliğine yüksek önem verirsiniz.',
      BALANCED: 'Yakınlık ihtiyacınız ile bireysel alanınız arasında dengeli bir güven duygusu taşırsınız.',
      LOW: 'İlişkilerdeki mesafelerden veya belirsizliklerden minimum düzeyde etkilenirsiniz.',
    },
    strengths: {
      HIGH: ['İlişki dinamiklerine yüksek duyarlılık', 'Bağ kurma arzusu ve özen'],
      BALANCED: ['Kendi kendine yetebilme ile bağ kurmayı dengeleme', 'Güvenli iletişim'],
      LOW: ['Bireysel bağımsızlık ve rahatlık'],
    },
    risks: {
      HIGH: ['İlişkilerde aşırı güvence arayışı ve kaygılanma eğilimi'],
      BALANCED: ['İletişim kopukluklarında geçici huzursuzluk'],
      LOW: ['Karşı tarafın duygusal ihtiyaçlarını gözden kaçırma riski'],
    },
  },
  attachment_avoidance: {
    code: 'attachment_avoidance',
    nameTr: 'Bağlanma Mesafesi (Avoidance Dimension)',
    shortDescriptionTr: 'Yakın ilişkilerde özerklik, bağımsızlık ve duygusal mesafe tercihi.',
    interpretationByBand: {
      HIGH: 'Kişisel bağımsızlığınıza ve özerkliğinize yüksek değer verir, duygusal mesafeyi korumayı tercih edersiniz.',
      BALANCED: 'Gerektiğinde duygusal yakınlık kurabilir, gerektiğinde kendi alanınızı koruyabilirsiniz.',
      LOW: 'Yakınlık kurmaktan, duygularınızı paylaşmaktan ve başkalarına güvenmekten rahatlık duyarsınız.',
    },
    strengths: {
      HIGH: ['Yüksek bireysel özerklik ve kendi kendine yetebilme', 'Bağımsız problem çözme'],
      BALANCED: ['Kişisel sınırları korurken yakın bağlar kurabilme'],
      LOW: ['Derin duygusal yakınlık kurabilme', 'Açık ve savunmasız paylaşım'],
    },
    risks: {
      HIGH: ['Duygusal desteğe ihtiyaç duyulduğunda yardım istemekten kaçınma'],
      BALANCED: ['Aşırı yoğun duygusal beklentilerde geri çekilme'],
      LOW: ['Aşırı bağımlı ilişki dinamiklerine açık olma riski'],
    },
  },
};

export const HEXACO_CONSTRUCT_INTERPRETATIONS = ALL_TRAIT_INTERPRETATIONS;

export interface TraitDynamicRule {
  id: string;
  titleTr: string;
  type: 'SYNERGY' | 'TENSION';
  descriptionTr: string;
  condition: (scores: Record<string, number>) => boolean;
}

export const TRAIT_DYNAMIC_RULES: TraitDynamicRule[] = [
  {
    id: 'goal_execution_dynamic',
    titleTr: 'Eylem ve Hedef Odaklılık',
    type: 'SYNERGY',
    descriptionTr:
      'Yüksek Dışadönüklük ve Yüksek Sorumluluk birlikteliği; vizyoner hedefleri disiplinli bir planlama ve sosyal motivasyonla somut başarılara dönüştürme gücü verir.',
    condition: (s) => (s['extraversion'] ?? 0) > 3.5 && (s['conscientiousness'] ?? 0) > 3.5,
  },
  {
    id: 'stress_sensitivity_friction',
    titleTr: 'Tepkisel Hassasiyet ve Gerilim Riski',
    type: 'TENSION',
    descriptionTr:
      'Yüksek Duygusallık ile Düşük Uyumluluk; stresli durumlarda duygusal baskının doğrudan ve sert tepkilere dönüşmesine yol açabilir. Çatışma anlarında bilinçli bir duraklama önerilir.',
    condition: (s) => (s['emotionality'] ?? 0) > 3.5 && (s['agreeableness'] ?? 0) < 2.5,
  },
  {
    id: 'trusted_collaboration_dynamic',
    titleTr: 'İşbirlikçi Güvenilirlik',
    type: 'SYNERGY',
    descriptionTr:
      'Yüksek Dürüstlük-Alçakgönüllülük ve Yüksek Uyumluluk birlikteliği; derin ve samimi güven ilişkileri kurarak ekiplerde yapıcı ve huzurlu bir işbirliği zemini oluşturur.',
    condition: (s) => (s['honesty_humility'] ?? 0) > 3.5 && (s['agreeableness'] ?? 0) > 3.5,
  },
  {
    id: 'innovative_execution_dynamic',
    titleTr: 'Yenilikçi Uygulama ve Üretkenlik',
    type: 'SYNERGY',
    descriptionTr:
      'Yüksek Deneyime Açıklık ve Yüksek Sorumluluk; soyut yaratıcılığı ve özgün fikirleri havada bırakmayıp somut, metodolojik projelere dönüştürmeyi sağlar.',
    condition: (s) => (s['openness_to_experience'] ?? 0) > 3.5 && (s['conscientiousness'] ?? 0) > 3.5,
  },
  {
    id: 'exploratory_focus_tension',
    titleTr: 'Keşif Arzusu ve Odak Dağılması',
    type: 'TENSION',
    descriptionTr:
      'Yüksek Deneyime Açıklık ile Düşük Sorumluluk; zengin ve yeni fikirlere hızla yönelme sağlarken, başlanan projeleri sonlandırmada ekstra yapılandırma ve dışsal takip desteği gerektirebilir.',
    condition: (s) => (s['openness_to_experience'] ?? 0) > 3.5 && (s['conscientiousness'] ?? 0) < 2.5,
  },
  {
    id: 'prepared_prudence_dynamic',
    titleTr: 'Öngörülü Tedbirlilik ve Risk Kontrolü',
    type: 'SYNERGY',
    descriptionTr:
      'Yüksek Duygusallık ile Yüksek Sorumluluk; risk algısını titiz bir hazırlık ve detaylı önlem planlarına dönüştürerek olası krizlerin önüne geçer.',
    condition: (s) => (s['emotionality'] ?? 0) > 3.5 && (s['conscientiousness'] ?? 0) > 3.5,
  },
  {
    id: 'assertive_directness_tension',
    titleTr: 'İddialı Doğrudanlık ve Sürtüşme Riski',
    type: 'TENSION',
    descriptionTr:
      'Yüksek Dışadönüklük ve Düşük Uyumluluk; toplantı ve tartışmalarda cesur ve baskın bir duruş sağlarken, diplomatik incelik gerektiren anlarda sürtüşmelere yol açabilir.',
    condition: (s) => (s['extraversion'] ?? 0) > 3.5 && (s['agreeableness'] ?? 0) < 2.5,
  },
  {
    id: 'calm_pragmatism_dynamic',
    titleTr: 'Soğukkanlı Pragmatizm',
    type: 'SYNERGY',
    descriptionTr:
      'Düşük Duygusallık ve Yüksek Sorumluluk; yüksek baskı altındaki kriz ortamlarında soğukkanlılığı koruyarak adım adım rasyonel eylem planları uygulamayı sağlar.',
    condition: (s) => (s['emotionality'] ?? 0) < 2.5 && (s['conscientiousness'] ?? 0) > 3.5,
  },
];

/**
 * Deterministically derives 2 to 4 key observations from measured traits.
 */
export function deriveKeyObservations(
  constructScores: Array<{ code: string; nameTr: string; compositeScore: number; scaleMax?: number }>
): string[] {
  if (!constructScores || constructScores.length === 0) {
    return ['Değerlendirme sonucunda temel yanıt profili kaydedilmiştir.'];
  }

  const observations: string[] = [];

  // Sort constructs by deviation from scale center
  const sortedBySalience = [...constructScores].sort((a, b) => {
    const centerA = (a.scaleMax || 5.0) / 2.0 + 0.5;
    const centerB = (b.scaleMax || 5.0) / 2.0 + 0.5;
    return Math.abs(b.compositeScore - centerB) - Math.abs(a.compositeScore - centerA);
  });

  for (const item of sortedBySalience) {
    if (observations.length >= 4) break;

    const maxScale = item.scaleMax || 5.0;
    const interp = ALL_TRAIT_INTERPRETATIONS[item.code];
    const bandInfo = getScoreBand(item.compositeScore, maxScale);

    if (bandInfo.band === 'HIGH') {
      const text = interp
        ? `${item.nameTr} boyutunda yüksek eğilim (${item.compositeScore.toFixed(1)} / ${maxScale.toFixed(1)}) belirginleşmektedir. ${interp.interpretationByBand.HIGH}`
        : `${item.nameTr} boyutunda ortalamanın üzerinde bir eğilim (${item.compositeScore.toFixed(1)} / ${maxScale.toFixed(1)}) gözlemlenmiştir.`;
      observations.push(text);
    } else if (bandInfo.band === 'LOW') {
      const text = interp
        ? `${item.nameTr} boyutunda daha düşük eğilim (${item.compositeScore.toFixed(1)} / ${maxScale.toFixed(1)}) öne çıkmaktadır. ${interp.interpretationByBand.LOW}`
        : `${item.nameTr} boyutunda daha düşük bir eğilim (${item.compositeScore.toFixed(1)} / ${maxScale.toFixed(1)}) kaydedilmiştir.`;
      observations.push(text);
    }
  }

  // If mostly balanced traits, add a stabilizing observation
  if (observations.length < 2) {
    const balancedCount = constructScores.filter(
      (c) => getScoreBand(c.compositeScore, c.scaleMax || 5.0).band === 'BALANCED'
    ).length;
    if (balancedCount > 0) {
      observations.push(
        'Ölçülen psikolojik boyutlarınız genel olarak dengeli bir dağılım sergilemekte olup, durumsal esnekliğinizin yüksek olduğunu göstermektedir.'
      );
    }
  }

  if (observations.length === 0) {
    observations.push('Değerlendirme profili ön kalibrasyon modeliyle başarıyla işlenmiştir.');
  }

  return observations.slice(0, 4);
}
