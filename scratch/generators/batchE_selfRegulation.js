// BATCH E: SELF-REGULATION & VOLITION (8 Facets)
// 10 candidate items per facet = 80 items

const DEFAULT_TRANSLATION_PROVENANCE = {
  originalLanguage: "tr",
  translationMethod: "DIRECT_NATIVE_TURKISH_AUTHORING",
  translatorType: "SCIENTIFIC_RESEARCH_TEAM",
  backTranslationStatus: "PENDING_PILOT_VERIFICATION",
  culturalReviewStatus: "COMPLETED_INTERNAL_REVIEW"
};

const LIKERT_6_AGREEMENT = {
  scaleId: "scale_likert_6_agreement",
  min: 1,
  max: 6,
  step: 1,
  labels_tr: ["Kesinlikle Katılmıyorum", "Katılmıyorum", "Biraz Katılmıyorum", "Biraz Katılıyorum", "Katılıyorum", "Kesinlikle Katılıyorum"],
  labels_en: ["Strongly Disagree", "Disagree", "Slightly Disagree", "Slightly Agree", "Agree", "Strongly Agree"]
};

const LIKERT_6_FREQUENCY = {
  scaleId: "scale_likert_6_frequency",
  min: 1,
  max: 6,
  step: 1,
  labels_tr: ["Hiçbir Zaman", "Çok Nadir", "Bazen", "Sık Sık", "Çoğu Zaman", "Her Zaman"],
  labels_en: ["Never", "Very Rarely", "Sometimes", "Often", "Most of the Time", "Always"]
};

function createItem(props) {
  return {
    id: props.id,
    domainId: "self_regulation",
    constructId: props.constructId,
    facetId: props.facetId,
    primaryFacet: props.facetId,
    possibleCrossLoadings: props.possibleCrossLoadings || [],
    itemType: props.itemType || "likert",
    text_tr: props.text_tr,
    text_en: props.text_en || "",
    responseScale: props.responseScale || LIKERT_6_AGREEMENT,
    keying: props.keying || "POSITIVE",
    reverseWorded: props.keying === "NEGATIVE",
    context: props.context || "general",
    measurementPurpose: props.measurementPurpose || "trait_level",
    observableIndicatorId: props.observableIndicatorId || `${props.facetId}_ind_1`,
    sourceType: props.sourceType || "ORIGINAL_AI_ASSISTED_RESEARCH_DRAFT",
    sourceIds: props.sourceIds || ["src_cyders_2014_uppsp"],
    instrumentIds: props.instrumentIds || ["inst_upps_p_sf"],
    licenseStatus: "APPROVED_WITH_ATTRIBUTION",
    validationStatus: "RESEARCH_DRAFT",
    candidateStatus: "INTERNAL_REVIEW",
    socialDesirabilitySensitivity: props.socialDesirabilitySensitivity || "moderate",
    acquiescenceRisk: props.acquiescenceRisk || "low",
    readingDifficulty: props.readingDifficulty || "easy",
    estimatedCompletionSeconds: props.estimatedCompletionSeconds || 7,
    semanticCluster: props.semanticCluster || `${props.facetId}_cluster`,
    pairedItemId: props.pairedItemId || null,
    forcedChoiceBlock: props.forcedChoiceBlock || null,
    situationalScenarios: props.situationalScenarios || null,
    translationProvenance: DEFAULT_TRANSLATION_PROVENANCE,
    version: "1.0.0-draft"
  };
}

const items = [];

function addFacetItems(facetDef) {
  facetDef.items.forEach((it, idx) => {
    const num = String(idx + 1).padStart(3, '0');
    const id = `${facetDef.prefix}-${num}`;
    items.push(createItem({
      id,
      constructId: facetDef.constructId,
      facetId: facetDef.facetId,
      ...it
    }));
  });
}

// 1. NEGATIVE URGENCY
addFacetItems({
  prefix: "SR-UP-NUR",
  constructId: "impulsivity_uppsp",
  facetId: "negative_urgency",
  items: [
    { text_tr: "Kendimi çok kötü veya öfkeli hissettiğimde sonradan pişman olacağım fevri şeyler yaparım.", text_en: "When I feel bad or angry, I do impulsive things I later regret.", keying: "POSITIVE" },
    { text_tr: "Moralim çok bozulsa bile kendime hakim olur ve sakin kalırım.", text_en: "Even when terribly upset, I retain self-control and stay calm.", keying: "NEGATIVE" },
    { text_tr: "Yoğun üzüntü veya stres altındayken kontrolümü kaybetmeye eğilimliyimdir.", text_en: "Under deep grief or stress, I am prone to losing control.", keying: "POSITIVE" },
    { text_tr: "Canım sıkkınken kendime veya çevreme zarar verebilecek adımlar atarım.", text_en: "When distressed, I act out in ways harmful to myself or others.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Öfke patlaması yaşasam bile mantığımı devre dışı bırakmam.", text_en: "Even during a flash of anger, I do not shut off reason.", keying: "NEGATIVE" },
    { text_tr: "Duygusal acı çektiğim anlarda o acıyı dindirmek için hesapsızca harcama veya tüketim yaparım.", text_en: "When hurting emotionally, I indulge in reckless consumption to numb it.", keying: "POSITIVE" },
    { text_tr: "Stres altındayken kırıcı sözler söylemeden önce durup bekleyebilirim.", text_en: "Under stress, I pause before uttering wounding remarks.", keying: "NEGATIVE" },
    { text_tr: "Hayal kırıklığına uğradığımda kapıları çarpmak veya eşyaları fırlatmak isterim.", text_en: "When disappointed, I feel an impulse to slam doors or throw things.", keying: "POSITIVE" },
    { text_tr: "İş yerinde azarlandığımda anlık bir öfkeyle istifa etmeyi düşünürüm.", text_en: "When rebuked at work, I impulsively think of quitting on the spot.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Tartışma anında telefonumu fırlatıp konuşmayı öfkeyle keserim.", text_en: "During disputes, I fling down my phone and terminate talks furiously.", keying: "POSITIVE", itemType: "contextual", context: "relationship" }
  ]
});

// 2. POSITIVE URGENCY
addFacetItems({
  prefix: "SR-UP-PUR",
  constructId: "impulsivity_uppsp",
  facetId: "positive_urgency",
  items: [
    { text_tr: "Aşırı sevinçli veya heyecanlı olduğumda düşünmeden riskli kararlar veririm.", text_en: "When overly overjoyed or ecstatic, I make risky choices without thought.", keying: "POSITIVE" },
    { text_tr: "Büyük bir kutlama veya coşku anında bile ölçülü davranırım.", text_en: "Even in great celebrations, I maintain measured behavior.", keying: "NEGATIVE" },
    { text_tr: "Çok mutlu olduğumda sonradan altından kalkamayacağım sözler veririm.", text_en: "When riding high on joy, I commit to promises I cannot sustain.", keying: "POSITIVE" },
    { text_tr: "Coşkulu anlarımda bütçemi aşan çılgınca harcamalar yaparım.", text_en: "In euphoric states, I make wild spendings that demolish my budget.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Keyfim ne kadar yerinde olursa olsun temkinli olmayı elden bırakmam.", text_en: "No matter how high my spirits, I never abandon prudence.", keying: "NEGATIVE" },
    { text_tr: "Kutlama ortamlarında kendimi kaptırıp aşırıya kaçarım.", text_en: "In party environments, I get carried away and go to extremes.", keying: "POSITIVE" },
    { text_tr: "Çok güzel bir haber aldığımda heyecandan mantıklı düşünemem.", text_en: "Upon stellar news, excitement impairs my logical reasoning.", keying: "POSITIVE" },
    { text_tr: "Zafer veya sevinç anlarında bile adımlarımı dikkatle hesaplarım.", text_en: "Even amidst victory and joy, I calculate my moves carefully.", keying: "NEGATIVE" },
    { text_tr: "İş yerinde büyük bir başarı kazandığımda hemen rehavete kapılıp gereksiz sözler veririm.", text_en: "After a big win at work, I succumb to complacency and overpromise.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Arkadaşlarımın coşkusuna kapılıp riskli eğlencelere düşünmeden katılırım.", text_en: "Swept by friends' euphoria, I join risky antics without thinking.", keying: "POSITIVE", itemType: "contextual", context: "social" }
  ]
});

// 3. LACK OF PREMEDITATION
addFacetItems({
  prefix: "SR-UP-LPR",
  constructId: "impulsivity_uppsp",
  facetId: "lack_of_premeditation",
  items: [
    { text_tr: "Bir eyleme geçmeden önce olası sonuçlarını nadiren düşünürüm.", text_en: "I rarely consider possible consequences before taking action.", keying: "POSITIVE" },
    { text_tr: "Harekete geçmeden önce her zaman artıları ve eksileri tartarim.", text_en: "Before acting, I consistently weigh pros and cons.", keying: "NEGATIVE" },
    { text_tr: "Aklıma gelen ilk fikri sonuçlarını tartmadan hemen uygularım.", text_en: "I immediately execute the first thought hitting my head.", keying: "POSITIVE" },
    { text_tr: "Sonuçlarını önceden kestiremediğim kararlar veririm.", text_en: "I make moves without anticipating the aftermath.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Önemli adımlar atmadan önce durup düşünmek benim için bir kuraldır.", text_en: "Stopping to think before major steps is a baseline rule for me.", keying: "NEGATIVE" },
    { text_tr: "Düşünmeden söylediğim laflar yüzünden sık sık zor duruma düşerim.", text_en: "I often find myself cornered due to unconsidered remarks.", keying: "POSITIVE" },
    { text_tr: "Riskleri önceden planlayıp önlem almaktan hoşlanırım.", text_en: "I enjoy planning risks beforehand and taking precautions.", keying: "NEGATIVE" },
    { text_tr: "Olayların sonunu beklemeden hemen kararımı açıklarım.", text_en: "I announce my verdict without waiting for things to unfold.", keying: "POSITIVE" },
    { text_tr: "İş yerinde araştırmadan bir teklifi kabul edip sonradan pişman olurum.", text_en: "At work, I accept proposals without vetting and regret later.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Alışveriş yaparken etiketi okumadan doğrudan kasaya giderim.", text_en: "When shopping, I carry items to the checkout without reading labels.", keying: "POSITIVE", itemType: "contextual", context: "general" }
  ]
});

// 4. LACK OF PERSEVERANCE
addFacetItems({
  prefix: "SR-UP-LPE",
  constructId: "impulsivity_uppsp",
  facetId: "lack_of_perseverance",
  items: [
    { text_tr: "Bir görev zor veya sıkıcı hale geldiğinde devam etmekte çok zorlanırım.", text_en: "When a task turns tedious or hard, I struggle greatly to persist.", keying: "POSITIVE" },
    { text_tr: "Monoton işlerde bile dikkatimi dağıtmadan sonuna kadar çalışırım.", text_en: "Even in monotone jobs, I work through to completion without distraction.", keying: "NEGATIVE" },
    { text_tr: "Başladığım kitapları, projeleri veya kursları yarıda bırakırım.", text_en: "I abandon started books, projects, or courses halfway.", keying: "POSITIVE" },
    { text_tr: "Sıkıcı ayrıntılarla uğraşırken işi bırakıp dikkat dağıtıcı şeylere yönelirim.", text_en: "Wrestling with boring details, I quit and drift toward distractions.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Bir görevi bitirene kadar masadan kalkmama disiplinim vardır.", text_en: "I hold the discipline not to leave the desk until the mission is done.", keying: "NEGATIVE" },
    { text_tr: "Zorluk karşısında çabuk yılar ve başka kolay şeylere geçerim.", text_en: "Facing friction, I lose steam quickly and shift to easier pursuits.", keying: "POSITIVE" },
    { text_tr: "İlgi çekiciliğini yitiren bir işi sürdürmek benim için bir işkencedir.", text_en: "Sustaining work that lost novelty is pure torture for me.", keying: "POSITIVE" },
    { text_tr: "Uzun vadeli ve tekdüze görevleri sabırla sonlandırırım.", text_en: "I bring long-range and repetitive tasks to closure with patience.", keying: "NEGATIVE" },
    { text_tr: "İş yerinde rutin raporlamaları tamamlamayı günlerce ertelerim.", text_en: "At work, I put off completing routine reporting for days.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Spor veya diyet gibi süreklilik isteyen programları sürdüremem.", text_en: "I fail to sustain routines demanding continuity like exercise or diet.", keying: "POSITIVE", itemType: "contextual", context: "general" }
  ]
});

// 5. SENSATION SEEKING
addFacetItems({
  prefix: "SR-UP-SEN",
  constructId: "impulsivity_uppsp",
  facetId: "sensation_seeking",
  items: [
    { text_tr: "Adrenalin dolu, heyecan verici ve sıradışı deneyimlerin peşinde koşarım.", text_en: "I chase adrenaline-fueled, exhilarating, and novel experiences.", keying: "POSITIVE" },
    { text_tr: "Öngörülebilir, sakin ve risksiz bir yaşam temposunu tercih ederim.", text_en: "I prefer a predictable, peaceful, and risk-free life pace.", keying: "NEGATIVE" },
    { text_tr: "Yeni ve şaşırtıcı duyumlar yaşatacak maceralara atılmaktan hoşlanırım.", text_en: "I enjoy plunging into ventures offering startling sensations.", keying: "POSITIVE" },
    { text_tr: "Monotonluktan kurtulmak için tehlikeli sayılan aktivitelere katılırım.", text_en: "To shatter monotony, I participate in borderline dangerous thrills.", keying: "POSITIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Büyük hızlar, sarsıcı yükseklikler veya fırtınalı durumlar beni cezbetmez.", text_en: "Great speeds, dizzying heights, or tempestuous scenes do not allure me.", keying: "NEGATIVE" },
    { text_tr: "Güvenli sularda kalmaktansa fırtınalı denizlerde olmayı yeğlerim.", text_en: "I'd rather be in choppy seas than lingering in safe shallows.", keying: "POSITIVE" },
    { text_tr: "Aynı rutini her gün yaşamak beni ruhen boğar.", text_en: "Living the exact same routine every day suffocates me mentally.", keying: "POSITIVE" },
    { text_tr: "Aşırı heyecan veren ortamlardan ziyade sessizliği ararım.", text_en: "I seek stillness over super-stimulating environments.", keying: "NEGATIVE" },
    { text_tr: "Tatilde bilmediğim ıssız rotaları tek başıma keşfe çıkarım.", text_en: "On holiday, I explore unmapped wilderness routes solo.", keying: "POSITIVE", itemType: "contextual", context: "general" },
    { text_tr: "Eğlence parklarındaki en çılgın trenlere binmek için sabırsızlanırım.", text_en: "I can't wait to ride the most insane rollercoasters in theme parks.", keying: "POSITIVE", itemType: "contextual", context: "general" }
  ]
});

// 6. GENERAL SELF-CONTROL
addFacetItems({
  prefix: "SR-VS-GSC",
  constructId: "volitional_stamina",
  facetId: "general_self_control",
  items: [
    { text_tr: "Zararlı olduğunu bildiğim anlık ayartmalara ve zevklere karşı koyabilirim.", text_en: "I can resist immediate temptations that I know are harmful.", keying: "POSITIVE" },
    { text_tr: "Kötü alışkanlıklarımdan vazgeçmekte büyük zorluk çekerim.", text_en: "I struggle immensely to break free from bad habits.", keying: "NEGATIVE" },
    { text_tr: "Çalışmam gereken zamanlarda dikkatimi dağıtacak şeyleri kolayca elimin tersiyle iterim.", text_en: "When study or work is due, I effortlessly brush off distractions.", keying: "POSITIVE" },
    { text_tr: "Kendime koyduğum kuralları birkaç gün içinde delerim.", text_en: "I breach personal rules I set for myself within a few days.", keying: "NEGATIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Özdenetimim sayesinde hedeflerime sadık kalırım.", text_en: "Thanks to self-discipline, I stay faithful to my objectives.", keying: "POSITIVE" },
    { text_tr: "Canım istemediği halde yapmam gereken şeyleri disiplinle yaparım.", text_en: "I execute mandatory chores with discipline even when reluctant.", keying: "POSITIVE" },
    { text_tr: "Bir zevk teklif edildiğinde 'hayır' demekte zorlanırım.", text_en: "When pleasure is offered, I find it hard to say 'no'.", keying: "NEGATIVE" },
    { text_tr: "Kendi dürtülerimi ve isteklerimi irademle yönetebilirim.", text_en: "I govern my drives and appetites through willpower.", keying: "POSITIVE" },
    { text_tr: "İş yerinde mesai bitmeden sosyal medyada kaybolmam.", text_en: "At work, I don't get lost in social feeds before the shift ends.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Sağlıklı beslenme hedefime rağmen gece atıştırmalıklarına yenik düşerim.", text_en: "Despite health goals, I succumb to late-night junk cravings.", keying: "NEGATIVE", itemType: "contextual", context: "general" }
  ]
});

// 7. DELAYED GRATIFICATION / DISCOUNTING
addFacetItems({
  prefix: "SR-VS-DGR",
  constructId: "volitional_stamina",
  facetId: "delay_discounting",
  items: [
    { text_tr: "Gelecekte daha büyük bir ödül alabilmek için bugünkü küçük zevkleri erteleyebilirim.", text_en: "I can defer small present rewards to harvest larger future prizes.", keying: "POSITIVE" },
    { text_tr: "Geleceği beklemektense hemen şimdi alabileceğim küçük kazancı tercih ederim.", text_en: "I choose immediate small gains rather than waiting for future windfalls.", keying: "NEGATIVE" },
    { text_tr: "Uzun vadeli refahım için bugünkü harcamalarımı kısmayı bilirim.", text_en: "I curb today's expenses for long-range financial wellness.", keying: "POSITIVE" },
    { text_tr: "Bir ödülü beklemek zorunda kalmak beni çileden çıkarır.", text_en: "Having to wait for a reward drives me crazy.", keying: "NEGATIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Sabırla biriktirip ileride büyük bir yatırım yapmaktan keyif alırım.", text_en: "I enjoy patiently saving up to make substantial future investments.", keying: "POSITIVE" },
    { text_tr: "'Bugün ye, iç, eğlen; yarını sonra düşünürüz' felsefesine yakınım.", text_en: "I resonate with 'eat, drink and be merry today, worry tomorrow'.", keying: "NEGATIVE" },
    { text_tr: "Kariyerimde yıllar sonra meyve verecek bir eğitime bugünden yatırım yaparım.", text_en: "I invest today in training that will yield fruits years later.", keying: "POSITIVE" },
    { text_tr: "Hızlı tatmin sağlayan şeyleri daima uzun vadeli hedeflerin önüne koyarım.", text_en: "I consistently prioritize quick fixes over long-term visions.", keying: "NEGATIVE" },
    { text_tr: "İş hayatında anlık primler yerine kalıcı hisse ortaklığını tercih ederim.", text_en: "In business, I choose enduring equity partnerships over quick bonuses.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Maaşımı alır almaz anlık zevkler için tüketip ay sonunu zor getiririm.", text_en: "I exhaust my salary on immediate whims right away and struggle by month's end.", keying: "NEGATIVE", itemType: "contextual", context: "general" }
  ]
});

// 8. LONG-TERM GRIT
addFacetItems({
  prefix: "SR-VS-GRI",
  constructId: "volitional_stamina",
  facetId: "long_term_grit",
  items: [
    { text_tr: "Yıllar süren büyük hedeflerime aylar ve yıllar boyunca aynı tutkuyla bağlı kalırım.", text_en: "I sustain passion and dedication to multi-year goals over years.", keying: "POSITIVE" },
    { text_tr: "Yeni bir hedefe büyük bir hevesle başlarım ama birkaç ay sonra ilgimi kaybederim.", text_en: "I start a goal with great zeal but lose interest a few months later.", keying: "NEGATIVE" },
    { text_tr: "Büyük bir projede başarısızlıklar yaşasam dahi asla pes etmem.", text_en: "I do not surrender even after suffering setbacks in a grand undertaking.", keying: "POSITIVE" },
    { text_tr: "İlgi alanlarım ve kariyer hedeflerim sürekli değişir.", text_en: "My interests and career ambitions pivot continuously.", keying: "NEGATIVE", itemType: "behavior_frequency", responseScale: LIKERT_6_FREQUENCY },
    { text_tr: "Zorluklar karşısında dayanıklılığımı koruyarak hedefime doğru yürümeye devam ederim.", text_en: "Preserving endurance through adversity, I march steadily toward my aim.", keying: "POSITIVE" },
    { text_tr: "Bir engelle karşılaştığımda yönümü hemen başka bir alana çeviririm.", text_en: "Hitting a roadblock, I instantly redirect toward another field.", keying: "NEGATIVE" },
    { text_tr: "Ustalık kazanmanın yıllar boyu süren sabırlı bir adanmışlık gerektirdiğini bilirim.", text_en: "I know mastery demands years of patient devotion.", keying: "POSITIVE" },
    { text_tr: "Çabuk sonuç alamadığım hedefleri değersiz görüp bırakırım.", text_en: "I write off goals lacking quick results and drop them.", keying: "NEGATIVE" },
    { text_tr: "Mesleğimde en üst yetkinliğe ulaşmak için on yıl boyunca ter dökmeye hazırım.", text_en: "I am ready to sweat a decade to attain pinnacle competence in my trade.", keying: "POSITIVE", itemType: "contextual", context: "work" },
    { text_tr: "Öğrenmek istediğim bir dili veya enstrümanı zorlandığım anda bir kenara atarım.", text_en: "I toss aside a language or instrument the second learning turns rough.", keying: "NEGATIVE", itemType: "contextual", context: "general" }
  ]
});

module.exports = {
  batchName: "BATCH_E_SELF_REGULATION",
  items
};
