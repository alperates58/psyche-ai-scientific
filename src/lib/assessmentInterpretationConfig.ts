export type VisualRepresentationType = 'HEXACO_RADAR' | 'TRAIT_BREAKDOWN' | 'MULTIDIMENSIONAL_BAR';

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
 */
export const ASSESSMENT_VISUAL_REGISTRY: Record<string, VisualRepresentationType> = {
  MODULE_1_CORE_PERSONALITY: 'HEXACO_RADAR',
  CORE_INTAKE: 'HEXACO_RADAR',
  MODULE_2_SELF_IDENTITY: 'TRAIT_BREAKDOWN',
  MODULE_3_EMOTION_REGULATION: 'TRAIT_BREAKDOWN',
  MODULE_4_VOLITION_CONTROL: 'TRAIT_BREAKDOWN',
};

/**
 * Deterministic score band threshold evaluator (1.0 to 5.0 Likert scale).
 * Low: < 2.50
 * Balanced: 2.50 to 3.50
 * High: > 3.50
 */
export function getScoreBand(score: number): ScoreBandDetails {
  if (score < 2.5) {
    return {
      band: 'LOW',
      labelTr: 'Daha Düşük Eğilim',
      shortLabelTr: 'Düşük',
      colorClass: 'text-sky-700',
      bgClass: 'bg-sky-50',
      borderClass: 'border-sky-200',
    };
  }
  if (score <= 3.5) {
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

export const HEXACO_CONSTRUCT_INTERPRETATIONS: Record<string, TraitInterpretationDefinition> = {
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
};

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
  constructScores: Array<{ code: string; nameTr: string; compositeScore: number }>
): string[] {
  if (!constructScores || constructScores.length === 0) {
    return ['Değerlendirme sonucunda temel yanıt profili kaydedilmiştir.'];
  }

  const observations: string[] = [];

  // Sort constructs by deviation from scale center (3.0)
  const sortedBySalience = [...constructScores].sort(
    (a, b) => Math.abs(b.compositeScore - 3.0) - Math.abs(a.compositeScore - 3.0)
  );

  for (const item of sortedBySalience) {
    if (observations.length >= 4) break;

    const interp = HEXACO_CONSTRUCT_INTERPRETATIONS[item.code];
    const bandInfo = getScoreBand(item.compositeScore);

    if (bandInfo.band === 'HIGH') {
      const text = interp
        ? `${item.nameTr} boyutunda yüksek eğilim (${item.compositeScore.toFixed(1)} / 5.0) belirginleşmektedir. ${interp.interpretationByBand.HIGH}`
        : `${item.nameTr} boyutunda ortalamanın üzerinde bir eğilim (${item.compositeScore.toFixed(1)} / 5.0) gözlemlenmiştir.`;
      observations.push(text);
    } else if (bandInfo.band === 'LOW') {
      const text = interp
        ? `${item.nameTr} boyutunda daha düşük eğilim (${item.compositeScore.toFixed(1)} / 5.0) öne çıkmaktadır. ${interp.interpretationByBand.LOW}`
        : `${item.nameTr} boyutunda daha düşük bir eğilim (${item.compositeScore.toFixed(1)} / 5.0) kaydedilmiştir.`;
      observations.push(text);
    }
  }

  // If mostly balanced traits, add a stabilizing observation
  if (observations.length < 2) {
    const balancedCount = constructScores.filter((c) => getScoreBand(c.compositeScore).band === 'BALANCED').length;
    if (balancedCount > 0) {
      observations.push(
        'Ölçülen kişilik boyutlarınız genel olarak dengeli bir dağılım sergilemekte olup, durumsal esnekliğinizin yüksek olduğunu göstermektedir.'
      );
    }
  }

  if (observations.length === 0) {
    observations.push('Değerlendirme profili ön kalibrasyon modeliyle başarıyla işlenmiştir.');
  }

  return observations.slice(0, 4);
}
