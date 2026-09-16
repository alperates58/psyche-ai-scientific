import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { seedExecutableAssessments } from '../scripts/seed-executable-assessments';

const prisma = new PrismaClient();


interface ConstructJsonEntry {
  domainId: string;
  domainName: string;
  constructId: string;
  constructName: string;
  facetId: string;
  facetName: string;
  definition: string;
  observableIndicators?: string[];
  epistemicTier?: string;
  isOptionalModule?: boolean;
  sourceIds?: string[];
  primaryInstrumentId?: string;
  applicableTheoryLenses?: string[];
}

interface SourceRegistryEntry {
  sourceId: string;
  citation: string;
  year?: number | null;
  doi?: string | null;
  url?: string | null;
}

interface InstrumentRegistryEntry {
  instrumentId: string;
  name: string;
  fullName?: string | null;
  license: string;
  decision: string;
  notes?: string | null;
}

interface TheoryLensRegistryEntry {
  lensId: string;
  name: string;
  coreConcepts?: string[];
  limitations?: string;
}

function parseTrEn(combined: string): { tr: string; en: string } {
  const match = combined.match(/^(.*?)\s*\((.*?)\)$/);
  if (match) {
    return { en: match[1].trim(), tr: match[2].trim() };
  }
  return { en: combined, tr: combined };
}

const DOMAIN_TRANSLATIONS: Record<string, { tr: string; en: string; descTr: string; descEn: string }> = {
  core_personality: {
    tr: 'Temel Kişilik Boyutları',
    en: 'Core Personality',
    descTr: 'HEXACO 6 faktör modeli temelinde bireyin temel kişilik özelliklerinin incelenmesi.',
    descEn: 'Investigation of core personality traits based on the HEXACO 6-factor framework.'
  },
  self_system: {
    tr: 'Benlik ve Öz-Düzenleme',
    en: 'Self-System & Self-Regulation',
    descTr: 'Bireyin özsaygı, özşefkat, öz-yeterlilik ve benlik belirginliği dinamikleri.',
    descEn: 'Dynamics of self-esteem, self-compassion, self-efficacy, and self-concept clarity.'
  },
  emotional_affective: {
    tr: 'Duygusal ve Duygulanımsal Tarzlar',
    en: 'Emotional & Affective Styles',
    descTr: 'Duygu düzenleme stratejileri, sıkıntı toleransı ve duygulanım eğilimleri.',
    descEn: 'Emotion regulation strategies, distress tolerance, and affective dispositions.'
  },
  regulatory_volitional: {
    tr: 'Düzenleyici ve İradevi Nitelikler',
    en: 'Regulatory & Volitional Processes',
    descTr: 'Dürtüsellik kontrolü, genel özdenetim ve iradi hedeflere bağlılık.',
    descEn: 'Impulsivity control, general self-control, and goal-directed volition.'
  },
  motivational_value: {
    tr: 'Motivasyonel ve Değer Yönelimleri',
    en: 'Motivational & Value Orientations',
    descTr: 'Schwartz evrensel değerler kuramı ve temel psikolojik ihtiyaç doyumu.',
    descEn: 'Schwartz universal values theory and basic psychological need satisfaction.'
  },
  relational_interpersonal: {
    tr: 'İlişkisel ve Kişilerarası Dinamikler',
    en: 'Relational & Interpersonal Dynamics',
    descTr: 'Yetişkin bağlanma stilleri, empati boyutları ve çatışma yönetimi eğilimleri.',
    descEn: 'Adult attachment orientations, empathy dimensions, and conflict management modes.'
  },
  cognitive_epistemic: {
    tr: 'Bilişsel ve Epistemik Tarzlar',
    en: 'Cognitive & Epistemic Styles',
    descTr: 'Biliş ihtiyacı, bilişsel kapanma ihtiyacı ve belirsizliğe tahammülsüzlük.',
    descEn: 'Need for cognition, need for cognitive closure, and intolerance of uncertainty.'
  },
  existential_meaning: {
    tr: 'Varoluşsal ve Anlam Dinamikleri',
    en: 'Existential & Meaning Dynamics',
    descTr: 'Hayatta anlam arayışı, anlam varlığı ve varoluşsal yönelimler.',
    descEn: 'Presence of meaning, search for meaning, and existential orientations.'
  },
  integrity_validity: {
    tr: 'Test Geçerliliği ve Cevap Bütünlüğü',
    en: 'Test Validity & Response Integrity',
    descTr: 'Sosyal beğenirlik, öz-aldatma ve cevap verme bütünlüğü telemetrisi.',
    descEn: 'Social desirability, self-deceptive enhancement, and response integrity telemetry.'
  }
};

async function main() {
  console.log('🚀 PsycheAI Faz 1 Veritabanı Seed İşlemi Başlatılıyor...');

  const dataDir = path.join(process.cwd(), 'data');
  const rawConstructs = fs.readFileSync(path.join(dataDir, 'constructs.json'), 'utf-8');
  const rawSources = fs.readFileSync(path.join(dataDir, 'source-registry.json'), 'utf-8');
  const rawInstruments = fs.readFileSync(path.join(dataDir, 'instrument-registry.json'), 'utf-8');
  const rawLenses = fs.readFileSync(path.join(dataDir, 'theory-lenses.json'), 'utf-8');

  const constructsData: ConstructJsonEntry[] = JSON.parse(rawConstructs);
  const sourcesData: SourceRegistryEntry[] = JSON.parse(rawSources);
  const instrumentsData: InstrumentRegistryEntry[] = JSON.parse(rawInstruments);
  const lensesData: TheoryLensRegistryEntry[] = JSON.parse(rawLenses);

  // 1. DYNAMIC EXTRACTION OF ONTOLOGY ENTITIES
  const uniqueDomains = new Map<string, { id: string; name: string }>();
  const uniqueConstructs = new Map<string, { id: string; name: string; domainId: string }>();
  const uniqueFacets = new Map<string, ConstructJsonEntry>();

  for (const entry of constructsData) {
    if (!uniqueDomains.has(entry.domainId)) {
      uniqueDomains.set(entry.domainId, { id: entry.domainId, name: entry.domainName });
    }
    if (!uniqueConstructs.has(entry.constructId)) {
      uniqueConstructs.set(entry.constructId, {
        id: entry.constructId,
        name: entry.constructName,
        domainId: entry.domainId
      });
    }
    if (!uniqueFacets.has(entry.facetId)) {
      uniqueFacets.set(entry.facetId, entry);
    }
  }

  // 2. SEED SCIENTIFIC SOURCES
  console.log('📚 Bilimsel kaynaklar kaydediliyor...');
  for (const src of sourcesData) {
    await prisma.scientificSource.upsert({
      where: { id: src.sourceId },
      update: {
        citation: src.citation,
        year: src.year ?? null,
        doi: src.doi ?? null,
        url: src.url ?? null
      },
      create: {
        id: src.sourceId,
        shortKey: src.sourceId,
        citation: src.citation,
        year: src.year ?? null,
        doi: src.doi ?? null,
        url: src.url ?? null
      }
    });
  }

  // 3. SEED INSTRUMENTS (WITH LICENSING DECISION)
  console.log('⚖️ Psikometrik envanterler ve lisans kararları kaydediliyor...');
  for (const inst of instrumentsData) {
    await prisma.instrument.upsert({
      where: { id: inst.instrumentId },
      update: {
        code: inst.instrumentId.toUpperCase(),
        name: inst.name,
        fullName: inst.fullName ?? inst.name,
        licenseType: inst.license,
        licensingDecision: inst.decision,
        citation: inst.notes ?? null
      },
      create: {
        id: inst.instrumentId,
        code: inst.instrumentId.toUpperCase(),
        name: inst.name,
        fullName: inst.fullName ?? inst.name,
        licenseType: inst.license,
        licensingDecision: inst.decision,
        citation: inst.notes ?? null
      }
    });
  }

  // 4. SEED THEORY LENSES
  console.log('🔭 Tarihsel ve kuramsal mercekler kaydediliyor...');
  for (const lens of lensesData) {
    const theorist = lens.name.includes('—') ? lens.name.split('—')[0].trim() : lens.name;
    const school = lens.name.includes('—') ? lens.name.split('—')[1].trim() : lens.name;

    await prisma.theoryLens.upsert({
      where: { id: lens.lensId },
      update: {
        lensId: lens.lensId,
        theorist,
        school,
        description: lens.limitations || lens.name,
        primaryFocus: lens.coreConcepts?.[0] ?? null
      },
      create: {
        id: lens.lensId,
        lensId: lens.lensId,
        theorist,
        school,
        description: lens.limitations || lens.name,
        primaryFocus: lens.coreConcepts?.[0] ?? null
      }
    });
  }

  // 5. SEED DOMAINS
  console.log('🌐 Psikolojik alanlar (Domains) kaydediliyor...');
  let domainOrder = 0;
  for (const [domainId, dom] of uniqueDomains.entries()) {
    domainOrder++;
    const trans = DOMAIN_TRANSLATIONS[domainId] || {
      tr: dom.name,
      en: dom.name,
      descTr: `${dom.name} psikolojik alanı.`,
      descEn: `${dom.name} psychological domain.`
    };

    await prisma.domain.upsert({
      where: { id: domainId },
      update: {
        code: domainId.toUpperCase(),
        nameTr: trans.tr,
        nameEn: trans.en,
        descriptionTr: trans.descTr,
        descriptionEn: trans.descEn,
        sortOrder: domainOrder
      },
      create: {
        id: domainId,
        code: domainId.toUpperCase(),
        nameTr: trans.tr,
        nameEn: trans.en,
        descriptionTr: trans.descTr,
        descriptionEn: trans.descEn,
        sortOrder: domainOrder
      }
    });
  }

  // 6. SEED CONSTRUCTS
  console.log('🧩 Psikolojik yapılar (Constructs) kaydediliyor...');
  let constructOrder = 0;
  for (const [constructId, con] of uniqueConstructs.entries()) {
    constructOrder++;
    const parsed = parseTrEn(con.name);

    await prisma.construct.upsert({
      where: { id: constructId },
      update: {
        code: constructId.toUpperCase(),
        domainId: con.domainId,
        nameTr: parsed.tr,
        nameEn: parsed.en,
        descriptionTr: `${parsed.tr} psikolojik yapısı.`,
        descriptionEn: `${parsed.en} construct.`,
        sortOrder: constructOrder
      },
      create: {
        id: constructId,
        code: constructId.toUpperCase(),
        domainId: con.domainId,
        nameTr: parsed.tr,
        nameEn: parsed.en,
        descriptionTr: `${parsed.tr} psikolojik yapısı.`,
        descriptionEn: `${parsed.en} construct.`,
        sortOrder: constructOrder
      }
    });
  }

  // 7. SEED FACETS & RELATIONS
  console.log('🔬 Alt boyutlar (Facets) ve çapraz bağlantılar kaydediliyor...');
  let facetOrder = 0;
  for (const [facetId, facetEntry] of uniqueFacets.entries()) {
    facetOrder++;
    const parsed = parseTrEn(facetEntry.facetName);

    await prisma.facet.upsert({
      where: { id: facetId },
      update: {
        code: facetId.toUpperCase(),
        constructId: facetEntry.constructId,
        nameTr: parsed.tr,
        nameEn: parsed.en,
        descriptionTr: facetEntry.definition,
        descriptionEn: facetEntry.definition,
        sortOrder: facetOrder
      },
      create: {
        id: facetId,
        code: facetId.toUpperCase(),
        constructId: facetEntry.constructId,
        nameTr: parsed.tr,
        nameEn: parsed.en,
        descriptionTr: facetEntry.definition,
        descriptionEn: facetEntry.definition,
        sortOrder: facetOrder
      }
    });

    // Link Scientific Sources
    if (facetEntry.sourceIds && facetEntry.sourceIds.length > 0) {
      for (const sId of facetEntry.sourceIds) {
        const srcExists = sourcesData.some(s => s.sourceId === sId);
        if (srcExists) {
          await prisma.facetScientificSource.upsert({
            where: { facetId_sourceId: { facetId, sourceId: sId } },
            update: {},
            create: { facetId, sourceId: sId }
          });
        }
      }
    }

    // Link Primary Instrument
    if (facetEntry.primaryInstrumentId) {
      const instExists = instrumentsData.some(i => i.instrumentId === facetEntry.primaryInstrumentId);
      if (instExists) {
        await prisma.facetInstrument.upsert({
          where: { facetId_instrumentId: { facetId, instrumentId: facetEntry.primaryInstrumentId } },
          update: {},
          create: { facetId, instrumentId: facetEntry.primaryInstrumentId }
        });
      }
    }

    // Link Theory Lenses
    if (facetEntry.applicableTheoryLenses && facetEntry.applicableTheoryLenses.length > 0) {
      for (const lId of facetEntry.applicableTheoryLenses) {
        const lensExists = lensesData.some(l => l.lensId === lId);
        if (lensExists) {
          await prisma.facetTheoryLens.upsert({
            where: { facetId_theoryLensId: { facetId, theoryLensId: lId } },
            update: {},
            create: { facetId, theoryLensId: lId }
          });
        }
      }
    }
  }

  // 8. SEED NORMS & SCORING MODEL (PRE-CALIBRATION ONLY)
  console.log('📐 Ön kalibrasyon puanlama modeli kaydediliyor...');
  await prisma.normVersion.upsert({
    where: { code: 'TR-GENERAL-2026-PRE' },
    update: {
      name: 'Türkiye Genel Ön Kalibrasyon Örneklemi (Henüz Kalibre Edilmedi)',
      status: 'UNAVAILABLE',
      isCalibrated: false,
      sampleSize: 0
    },
    create: {
      code: 'TR-GENERAL-2026-PRE',
      name: 'Türkiye Genel Ön Kalibrasyon Örneklemi (Henüz Kalibre Edilmedi)',
      status: 'UNAVAILABLE',
      isCalibrated: false,
      sampleSize: 0
    }
  });

  const scoringModel = await prisma.scoringModelVersion.upsert({
    where: { code: 'PRE_CALIBRATION_MEAN_V1' },
    update: {
      description: 'Standartlaştırılmamış, nüfus iddiası barındırmayan ham aritmetik bileşik ortalama modeli',
      algorithm: 'UNWEIGHTED_COMPOSITE_MEAN',
      isPreCalibration: true
    },
    create: {
      code: 'PRE_CALIBRATION_MEAN_V1',
      description: 'Standartlaştırılmamış, nüfus iddiası barındırmayan ham aritmetik bileşik ortalama modeli',
      algorithm: 'UNWEIGHTED_COMPOSITE_MEAN',
      isPreCalibration: true
    }
  });

  // 9. SEED ASSESSMENT MODULE & FROZEN FORM VERSION
  console.log('📋 Modül 1 (HEXACO Kişilik) ve dondurulmuş form sürümü (v1.0.0) oluşturuluyor...');
  const module1 = await prisma.assessmentModule.upsert({
    where: { code: 'MODULE_1_CORE_PERSONALITY' },
    update: {
      titleTr: 'Modül 1: Temel Kişilik Boyutları (HEXACO)',
      titleEn: 'Module 1: Core Personality Structure (HEXACO)',
      descriptionTr: 'Altı temel kişilik faktörünün (Dürüstlük-Alçakgönüllülük, Duygusallık, Dışadönüklük, Uyumluluk, Sorumluluk, Deneyime Açıklık) bilimsel ve psikometrik ölçümü.',
      descriptionEn: 'Scientific and psychometric measurement of the six core personality factors.',
      estimatedMinutes: 12
    },
    create: {
      id: 'mod_core_personality_hexaco',
      code: 'MODULE_1_CORE_PERSONALITY',
      titleTr: 'Modül 1: Temel Kişilik Boyutları (HEXACO)',
      titleEn: 'Module 1: Core Personality Structure (HEXACO)',
      descriptionTr: 'Altı temel kişilik faktörünün (Dürüstlük-Alçakgönüllülük, Duygusallık, Dışadönüklük, Uyumluluk, Sorumluluk, Deneyime Açıklık) bilimsel ve psikometrik ölçümü.',
      descriptionEn: 'Scientific and psychometric measurement of the six core personality factors.',
      estimatedMinutes: 12
    }
  });

  const formVersion = await prisma.assessmentFormVersion.upsert({
    where: {
      moduleId_versionCode: {
        moduleId: module1.id,
        versionCode: 'v1.0.0'
      }
    },
    update: {
      isPublished: true
    },
    create: {
      id: 'form_hexaco_v1_0_0',
      moduleId: module1.id,
      versionCode: 'v1.0.0',
      isPublished: true,
      itemCount: 0
    }
  });

  // 10. SEED ITEMS WITH DEEP VERSIONING & LIKERT 5-POINT OPTIONS
  console.log('📝 Soru maddeleri, madde sürümleri ve cevap seçenekleri kaydediliyor...');

  // Standard 5-point Likert Scale labels
  const standardOptions = [
    { value: 1, labelTr: 'Kesinlikle Katılmıyorum', labelEn: 'Strongly Disagree', sortOrder: 1 },
    { value: 2, labelTr: 'Katılmıyorum', labelEn: 'Disagree', sortOrder: 2 },
    { value: 3, labelTr: 'Kararsızım', labelEn: 'Neutral', sortOrder: 3 },
    { value: 4, labelTr: 'Katılıyorum', labelEn: 'Agree', sortOrder: 4 },
    { value: 5, labelTr: 'Kesinlikle Katılıyorum', labelEn: 'Strongly Agree', sortOrder: 5 }
  ];

  // Defined items covering HEXACO facets, with positive and negative keying + attention check
  const seedItems = [
    {
      itemCode: 'itm_hex_sinc_01',
      facetId: 'sincerity',
      instrumentId: 'inst_ipip_hexaco',
      isKeyed: true,
      promptTr: 'İnsanları etkilemek veya çıkar sağlamak için sahte övgülerde bulunmaktan kaçınırım.',
      promptEn: 'I avoid flattering people to get what I want or gain favors.'
    },
    {
      itemCode: 'itm_hex_fair_01',
      facetId: 'fairness',
      instrumentId: 'inst_ipip_hexaco',
      isKeyed: true,
      promptTr: 'Fark edilmeyeceğimi bilsem bile kuralları kendi çıkarım uğruna çiğnemem.',
      promptEn: 'I would not cheat even if I knew I would not get caught.'
    },
    {
      itemCode: 'itm_hex_greed_01',
      facetId: 'greed_avoidance',
      instrumentId: 'inst_ipip_hexaco',
      isKeyed: false, // REVERSE KEYED
      promptTr: 'Lüks eşyalar ve pahalı statü sembollerine sahip olmak benim için birincil önceliktir.',
      promptEn: 'Owning luxury items and expensive status symbols is a top priority for me.'
    },
    {
      itemCode: 'itm_hex_mod_01',
      facetId: 'modesty',
      instrumentId: 'inst_ipip_hexaco',
      isKeyed: true,
      promptTr: 'Kendimi başkalarından üstün veya ayrıcalıklı bir konumda görmem.',
      promptEn: 'I do not see myself as superior to or entitled over other people.'
    },
    {
      itemCode: 'itm_hex_fear_01',
      facetId: 'fearfulness',
      instrumentId: 'inst_ipip_hexaco',
      isKeyed: false, // REVERSE KEYED
      promptTr: 'Fiziksel tehlike içeren veya riskli durumlardan korkmam, oldukça cesur davranırım.',
      promptEn: 'I am not afraid of physically dangerous or risky situations; I act boldly.'
    },
    {
      itemCode: 'itm_hex_anx_01',
      facetId: 'anxiety_proneness',
      instrumentId: 'inst_ipip_hexaco',
      isKeyed: true,
      promptTr: 'Gelecekteki belirsizlikler ve olası terslikler beni sıklıkla endişelendirir.',
      promptEn: 'Future uncertainties and potential setbacks often make me worry.'
    },
    {
      itemCode: 'itm_hex_soc_01',
      facetId: 'sociability',
      instrumentId: 'inst_ipip_hexaco',
      isKeyed: true,
      promptTr: 'Geniş insan topluluklarıyla tanışmaktan ve sosyal ortamlarda bulunmaktan keyif alırım.',
      promptEn: 'I enjoy meeting large groups of people and being in social settings.'
    },
    {
      itemCode: 'itm_hex_livel_01',
      facetId: 'liveliness',
      instrumentId: 'inst_ipip_hexaco',
      isKeyed: false, // REVERSE KEYED
      promptTr: 'Genellikle düşük enerjiliyimdir ve nadiren coşkulu ya da neşeli hissederim.',
      promptEn: 'I generally have low energy and rarely feel enthusiastic or cheerful.'
    },
    {
      itemCode: 'itm_hex_forg_01',
      facetId: 'forgiveness',
      instrumentId: 'inst_ipip_hexaco',
      isKeyed: true,
      promptTr: 'Bana haksızlık yapan insanları zamanla affedebilir ve kin tutmaktan kaçınırım.',
      promptEn: 'I can forgive people who wronged me and avoid holding grudges.'
    },
    {
      itemCode: 'itm_hex_pat_01',
      facetId: 'patience',
      instrumentId: 'inst_ipip_hexaco',
      isKeyed: false, // REVERSE KEYED
      promptTr: 'İşler istediğim gibi gitmediğinde hızla öfkelenir ve sabrımı kaybederim.',
      promptEn: 'I quickly get angry and lose my temper when things do not go as planned.'
    },
    {
      itemCode: 'itm_hex_org_01',
      facetId: 'organization',
      instrumentId: 'inst_ipip_hexaco',
      isKeyed: true,
      promptTr: 'Eşyalarımı ve günlük planlarımı düzenli ve intizamlı tutmaya özen gösteririm.',
      promptEn: 'I make sure to keep my belongings and daily plans orderly and neat.'
    },
    {
      itemCode: 'itm_hex_dilig_01',
      facetId: 'diligence',
      instrumentId: 'inst_ipip_hexaco',
      isKeyed: true,
      promptTr: 'Başladığım zorlu bir işi, yorulsam bile sonuna kadar tamamlamak için azimle çabalarım.',
      promptEn: 'I persist until I complete a demanding task, even when feeling exhausted.'
    },
    {
      itemCode: 'itm_hex_prud_01',
      facetId: 'prudence',
      instrumentId: 'inst_ipip_hexaco',
      isKeyed: false, // REVERSE KEYED
      promptTr: 'Düşünmeden, anlık heveslerle ve sonunu tartmadan fevri kararlar alırım.',
      promptEn: 'I make rash decisions on impulse without considering consequences.'
    },
    {
      itemCode: 'itm_hex_aes_01',
      facetId: 'aesthetic_appreciation',
      instrumentId: 'inst_ipip_hexaco',
      isKeyed: true,
      promptTr: 'Sanat eserleri, müzik veya doğanın görsel zarafeti beni derinden etkiler.',
      promptEn: 'Works of art, music, or the elegance of nature deeply move me.'
    },
    {
      itemCode: 'itm_hex_inq_01',
      facetId: 'inquisitiveness',
      instrumentId: 'inst_ipip_hexaco',
      isKeyed: true,
      promptTr: 'Bilimsel konuları, felsefi teorileri ve karmaşık fikirleri derinlemesine araştırmayı severim.',
      promptEn: 'I love researching scientific topics, philosophical theories, and complex concepts.'
    },
    {
      itemCode: 'itm_hex_cre_01',
      facetId: 'creativity',
      instrumentId: 'inst_ipip_hexaco',
      isKeyed: true,
      promptTr: 'Karşılaştığım güçlüklere alışılagelmişin dışında, yaratıcı çözümler üretirim.',
      promptEn: 'I generate novel, creative solutions to difficulties I encounter.'
    },
    {
      itemCode: 'itm_attn_chk_01',
      facetId: 'sincerity',
      instrumentId: 'inst_ipip_hexaco',
      isKeyed: true,
      isAttentionCheck: true,
      promptTr: 'Veri kalitesini teyit etmek için lütfen bu soruda "Katılıyorum" seçeneğini işaretleyiniz.',
      promptEn: 'To verify response data quality, please select "Agree" for this item.'
    }
  ];

  let sortIndex = 0;
  for (const itemDef of seedItems) {
    sortIndex++;

    const item = await prisma.item.upsert({
      where: { itemCode: itemDef.itemCode },
      update: {
        facetId: itemDef.facetId,
        instrumentId: itemDef.instrumentId,
        isKeyed: itemDef.isKeyed,
        isAttentionCheck: itemDef.isAttentionCheck ?? false
      },
      create: {
        itemCode: itemDef.itemCode,
        facetId: itemDef.facetId,
        instrumentId: itemDef.instrumentId,
        isKeyed: itemDef.isKeyed,
        isAttentionCheck: itemDef.isAttentionCheck ?? false
      }
    });

    const itemVersion = await prisma.itemVersion.upsert({
      where: {
        itemId_versionNumber: {
          itemId: item.id,
          versionNumber: 1
        }
      },
      update: {
        promptTr: itemDef.promptTr,
        promptEn: itemDef.promptEn,
        validationStatus: 'PRE_CALIBRATION',
        licenseStatus: 'approved'
      },
      create: {
        itemId: item.id,
        versionNumber: 1,
        promptTr: itemDef.promptTr,
        promptEn: itemDef.promptEn,
        validationStatus: 'PRE_CALIBRATION',
        licenseStatus: 'approved'
      }
    });

    // Create / ensure 5 options attached to ItemVersion
    for (const opt of standardOptions) {
      await prisma.itemVersionOption.upsert({
        where: {
          itemVersionId_value: {
            itemVersionId: itemVersion.id,
            value: opt.value
          }
        },
        update: {
          labelTr: opt.labelTr,
          labelEn: opt.labelEn,
          sortOrder: opt.sortOrder
        },
        create: {
          itemVersionId: itemVersion.id,
          value: opt.value,
          labelTr: opt.labelTr,
          labelEn: opt.labelEn,
          sortOrder: opt.sortOrder
        }
      });
    }

    // Freeze into form version
    await prisma.assessmentFormItem.upsert({
      where: {
        formVersionId_sortOrder: {
          formVersionId: formVersion.id,
          sortOrder: sortIndex
        }
      },
      update: {
        itemVersionId: itemVersion.id
      },
      create: {
        formVersionId: formVersion.id,
        itemVersionId: itemVersion.id,
        sortOrder: sortIndex
      }
    });
  }

  // Update item count on form version
  await prisma.assessmentFormVersion.update({
    where: { id: formVersion.id },
    data: { itemCount: seedItems.length }
  });

  // 11. SEED DEMO USER (Alex Mercer)
  console.log('👤 Demo kullanıcı (Alex Mercer) kaydediliyor...');
  const demoUser = await prisma.user.upsert({
    where: { email: 'alex.mercer@psycheai.internal' },
    update: {
      name: 'Alex Mercer',
      isDemoUser: true
    },
    create: {
      id: 'usr_alex_mercer_demo',
      email: 'alex.mercer@psycheai.internal',
      name: 'Alex Mercer',
      isDemoUser: true
    }
  });

  // 12. SEED EXECUTABLE ASSESSMENTS (16 MODULES)
  await seedExecutableAssessments();

  // 13. DYNAMIC TERMINAL OUTPUT CONFIRMING SOURCE-OF-TRUTH
  console.log('\n==================================================');
  console.log('ONTOLOGY SEED VERIFICATION (SOURCE-OF-TRUTH)');
  console.log('==================================================');
  console.log(`Domains:    ${uniqueDomains.size}`);
  console.log(`Constructs: ${uniqueConstructs.size}`);
  console.log(`Facets:     ${uniqueFacets.size}`);
  console.log(`Items:      ${seedItems.length} (Form: ${formVersion.versionCode})`);
  console.log(`Scoring:    ${scoringModel.code} (Pre-Calibration, No Population Claims)`);
  console.log(`Demo User:  ${demoUser.name} (${demoUser.id})`);
  console.log('==================================================\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed işleminde hata:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
