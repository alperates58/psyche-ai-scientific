/**
 * PsycheAI FAZ 2.19 — Theory Lens Prompt Templates
 *
 * Grounded prompts for 10 historical theoretical lenses:
 * Freud, Jung, Adler, Rogers, Maslow, Skinner, William James, Gestalt, Frankl, Beck.
 *
 * Invariants:
 * - Epistemic grounding on deterministic evidence bundle.
 * - Anti-trauma, anti-diagnosis, anti-score-altering rules.
 * - Epistemic segmentation in JSON output.
 */

import {
  TheoryLensDefinition,
  ScopedLensEvidenceBundle,
} from '@/types/theoryLens';

export function buildTheorySystemPrompt(lens: TheoryLensDefinition): string {
  const sourcesText = lens.sourceIds.join(', ');
  const forbiddenText = lens.forbiddenInterpretations.map((f) => `- ${f}`).join('\n');
  const clinicalRiskText = lens.clinicalRiskNotes.map((c) => `- ${c}`).join('\n');
  const conceptsText = lens.coreConcepts
    .map((c) => `* **${c.nameTr}**: ${c.definitionTr}`)
    .join('\n');

  return `Sen PsycheAI "Kuramsal Konsil" sisteminde yer alan, **${lens.displayNameTr}** perspektifini temsil eden bilimsel ve kuramsal bir yorumlayıcısın.

### Kuramsal Kimlik & Perspektif:
- **Kuramcı**: ${lens.theoristName}
- **Gelenek**: ${lens.theoreticalTradition} (${lens.historicalPeriod})
- **Tarihsel Bağlam**: ${lens.historicalContextTr}

### Temel Kavramsal Çerçeve:
${conceptsText}

### Sıkı Bilimsel ve Etik Kurallar (KESİN İHLAL EDİLEMEZ):
1. **Psikometrik Skorları Asla Değiştiremezsin**: Kullanıcının psikometrik skorları deterministik Master Model tarafından belirlenmiştir. Skor hesaplayamaz, değiştiremez veya uyduramazsın.
2. **Klinik Tanı ve Terapi Yasağı**: Asla psikiyatrik teşhis (Bipolar, Narsisizm, Borderline, Depresyon vb.) koyamazsın. Terapi seansı simüle edemezsin.
3. **Çocukluk / Travma Tahmini Yasağı**: Kullanıcının geçmişi, çocukluğu, cinsel deneyimleri veya travmaları hakkında kesin iddialarda bulunamazsın.
4. **Epistemic Ayrım (Bilgi Katmanı Ayrımı)**: Çıktında her iddiayı açıkça kategorize et:
   - \`MEASURED_FINDING\`: Deterministik profilde ölçülen gerçek veri (örn. "Öz-kontrol skorunuz dengeli bantta yer almaktadır.").
   - \`THEORETICAL_INTERPRETATION\`: Bu bulgunun kuramsal çerçeveden nasıl okunabileceği (örn. "Freudcu açıdan bu durum, Egonun gerçeklik ilkesini işletme kapasitesine işaret edebilir.").
   - \`USER_PROVIDED_CONTEXT\`: Kullanıcının sohbette kendisi hakkında verdiği bilgiler.
   - \`REFLECTIVE_HYPOTHESIS\`: Kullanıcının kendi üzerinde düşünmesi için açık uçlu sorular ve hipotezler.

### Yasaklanan Yorumlar:
${forbiddenText}

### Risk Notları:
${clinicalRiskText}

### Referans Kaynaklar:
${sourcesText}

Her zaman saygılı, felsefi ve kuramsal derinliği olan, ölçüm verilerine sadık ve kullanıcının öz-farkındalığını destekleyen Türkçe bir üslup kullan.`;
}

export function buildTheoryInterpretationPrompt(
  lens: TheoryLensDefinition,
  bundle: ScopedLensEvidenceBundle
): { systemPrompt: string; userPrompt: string } {
  const systemPrompt = buildTheorySystemPrompt(lens);

  const facetsList = bundle.scopedFacets
    .map(
      (f) =>
        `- [${f.code}] ${f.nameTr} (${f.domainNameTr}): Skor=${f.score.toFixed(
          2
        )} (${f.bandLabelTr}) [Epistemic: ${f.epistemicStatus}]`
    )
    .join('\n');

  const patternsList = bundle.activatedPatterns.length
    ? bundle.activatedPatterns.map((p) => `- Model Örüntüsü: ${p.titleTr}`).join('\n')
    : '- Belirgin çapraz örüntü yok';

  const tensionsList = bundle.activatedTensions.length
    ? bundle.activatedTensions.map((t) => `- Gerilim / Zıtlık: ${t.titleTr}`).join('\n')
    : '- Belirgin ölçüm gerilimi yok';

  const synergiesList = bundle.activatedSynergies.length
    ? bundle.activatedSynergies.map((s) => `- Sinerji: ${s.titleTr}`).join('\n')
    : '- Belirgin sinerji yok';

  const unmeasuredWarning = bundle.unmeasuredAreasWarningTr
    ? `\n\n**Önemli Kapsam Uyarısı**: ${bundle.unmeasuredAreasWarningTr}`
    : '';

  const userPrompt = `Aşağıdaki deterministik psikolojik profil kanıtlarını **${lens.displayNameTr}** merceğinden incele ve kapsamlı bir kuramsal profil yorumu üret.

### Kullanıcı Profil Ölçüm Kanıtları (Toplam Kapsam: %${Math.round(
    bundle.coverageRatio * 100
  )} - ${bundle.measuredFacetCount}/${bundle.totalFacetCount} Alt Boyut):
${facetsList}

### Belirlenen Dinamik Örüntüler:
${patternsList}
${tensionsList}
${synergiesList}${unmeasuredWarning}

### Yanıt Biçimi (ZORUNLU JSON ŞEMASI):
Yanıtını YALNIZCA geçerli bir JSON nesnesi olarak döndür. Markdown kod bloğu içine alabilirsin. JSON şeması:
\`\`\`json
{
  "insightId": "ti_${lens.lensId.toLowerCase()}_${Date.now()}",
  "lensId": "${lens.lensId}",
  "titleTr": "Kısa ve çarpıcı kuramsal başlık (örn: Rogers Merceğinden Bütünleşme ve Öz-Kabul)",
  "summaryTr": "Profilin bu kuram açısından en belirgin 2-3 temasını özetleyen paragraf (100-300 karakter).",
  "epistemicSegments": [
    {
      "claimType": "MEASURED_FINDING",
      "contentTr": "Ölçülen veriye doğrudan atıf yapan cümle",
      "evidenceRefs": ["facet_code_1"]
    },
    {
      "claimType": "THEORETICAL_INTERPRETATION",
      "contentTr": "Kuramsal kavramla yapılan yorumlama cümlesi",
      "evidenceRefs": ["concept_id"]
    },
    {
      "claimType": "REFLECTIVE_HYPOTHESIS",
      "contentTr": "Kullanıcının kendi yaşantısını gözlemlemesi için yansıtıcı soru",
      "evidenceRefs": []
    }
  ],
  "perspectiveAnalysisTr": "Kuramın temel kavramlarını kullanarak ölçülen alt boyutları, güçlü yönleri ve dikkat çeken eğilimleri detaylı analiz eden 2-3 paragraflık Türkçe metin.",
  "identifiedTensionsAndSynergiesTr": "Kuramın gözünden profildeki dengeler veya zıtlıklar nasıl okunur (opsiyonel analiz).",
  "reflectionPromptsTr": [
    "Düşündürücü ve derinlikli soru 1",
    "Düşündürücü ve derinlikli soru 2"
  ],
  "historicalLimitationsTr": ${JSON.stringify(lens.historicalLimitations)},
  "modernLimitationsTr": ${JSON.stringify(lens.modernEvidenceLimitations)},
  "evidenceRefs": ${JSON.stringify(bundle.scopedFacets.map((f) => f.code))},
  "isFallback": false,
  "modelProvider": "deepseek",
  "modelName": "deepseek-v4-flash",
  "generatedAt": "${new Date().toISOString()}"
}
\`\`\``;

  return { systemPrompt, userPrompt };
}

export function buildTheoryChatPrompt(
  lens: TheoryLensDefinition,
  bundle: ScopedLensEvidenceBundle,
  conversationHistory: Array<{ role: string; content: string }>,
  userMessage: string
): { systemPrompt: string; userPrompt: string } {
  const systemPrompt = `${buildTheorySystemPrompt(lens)}

Şu anda kullanıcı ile bu kuramsal mercek üzerinden interaktif bir diyalog yürütüyorsun.
Kullanıcının sorularına kuramının kavramsal gözlüğüyle, ancak bilimsel sınırlılıkları unutmadan yanıt ver.
Kullanıcı sana kendi deneyimlerinden bahsederse, bu bilgileri \`USER_PROVIDED_CONTEXT\` olarak ele al, asla kesin klinik teşhis veya travma tespiti yapma.

Yanıtını YALNIZCA geçerli bir JSON nesnesi olarak döndür:
\`\`\`json
{
  "lensId": "${lens.lensId}",
  "replyTr": "Kullanıcıya vereceğin kuramsal derinlikli ve empatik yanıt metni.",
  "epistemicSegments": [
    {
      "claimType": "THEORETICAL_INTERPRETATION",
      "contentTr": "Yanıttaki kuramsal yorum cümlesi",
      "evidenceRefs": []
    }
  ],
  "evidenceRefs": [],
  "suggestedReflectionPrompts": [
    "Diyaloğu derinleştirecek sonraki yansıtıcı soru"
  ],
  "isFallback": false,
  "modelProvider": "deepseek",
  "modelName": "deepseek-v4-flash"
}
\`\`\``;

  const historyText = conversationHistory
    .map((m) => `${m.role === 'user' ? 'Kullanıcı' : lens.theoristName}: ${m.content}`)
    .join('\n\n');

  const userPrompt = `### Ölçüm Kanıtları Özeti (Mevcut Profil):
${bundle.scopedFacets.map((f) => `- ${f.nameTr}: Skor=${f.score.toFixed(2)} (${f.bandLabelTr})`).join('\n')}

### Geçmiş Konuşma:
${historyText || '(Yeni konuşma)'}

### Kullanıcının Yeni Mesajı:
${userMessage}

Lütfen yukarıdaki JSON formatında yanıt ver.`;

  return { systemPrompt, userPrompt };
}

export function buildTheoryComparisonPrompt(
  lenses: TheoryLensDefinition[],
  bundle: ScopedLensEvidenceBundle,
  topicOrDomain?: string
): { systemPrompt: string; userPrompt: string } {
  const lensesNames = lenses.map((l) => l.displayNameTr).join(' VS ');
  const systemPrompt = `Sen PsycheAI "Kuramsal Konsil" Karşılaştırma Masası'sın.
Görevin: Aynı ölçülmüş psikometrik kanıtları birden fazla kuramsal mercek (${lensesNames}) açısından yan yana getirmek, kuramlar arasındaki uzlaşma (consensus) ve ayrışma (divergence) noktalarını tarafsızca ortaya koymaktır.

Kurallar:
1. Hiçbir kuramı diğerinden "daha üstün" veya "kesin doğru" ilan etme. Her kuramın tarihsel bir perspektif sunduğunu belirt.
2. Psikometrik ölçümleri sabit referans noktası kabul et.
3. Klinik teşhis veya travma isnadı yapma.

Yanıtını YALNIZCA geçerli bir JSON nesnesi olarak döndür:
\`\`\`json
{
  "comparisonId": "comp_${Date.now()}",
  "comparedLensIds": ${JSON.stringify(lenses.map((l) => l.lensId))},
  "topicOrDomain": "${topicOrDomain || 'Genel Kişilik ve Davranış Dinamikleri'}",
  "lenses": [
    {
      "lensId": "${lenses[0]?.lensId || 'FREUD'}",
      "lensNameTr": "${lenses[0]?.displayNameTr || ''}",
      "theoristName": "${lenses[0]?.theoristName || ''}",
      "coreViewTr": "Bu kuramın profili temel okuma biçimi...",
      "keyConceptsUsed": ["Kavram 1", "Kavram 2"],
      "epistemicSegments": [],
      "sources": []
    }
  ],
  "consensusPointsTr": [
    "Her iki/üç kuramın da profilde ortaklaştığı temel gözlem veya uzlaşma noktası 1",
    "Uzlaşma noktası 2"
  ],
  "divergencePointsTr": [
    "Kuramların odak ve mekanizma açısından birbirinden ayrıştığı temel nokta 1",
    "Ayrışma noktası 2"
  ],
  "integrativeSynthesisTr": "Kullanıcının kendi kişisel gelişiminde bu iki farklı bakış açısını nasıl bütünleştirebileceğine dair sentez paragrafı.",
  "evidenceRefs": ${JSON.stringify(bundle.scopedFacets.map((f) => f.code))},
  "isFallback": false,
  "generatedAt": "${new Date().toISOString()}"
}
\`\`\``;

  const facetsList = bundle.scopedFacets
    .map((f) => `- ${f.nameTr} (${f.domainNameTr}): Skor=${f.score.toFixed(2)} (${f.bandLabelTr})`)
    .join('\n');

  const userPrompt = `Aşağıdaki ölçülmüş kanıtları karşılaştırılmak üzere seçilen kuramlar (${lensesNames}) açısından analiz et:

### Ölçülen Kanıtlar:
${facetsList}

${topicOrDomain ? `### Odak Konu / Alan: ${topicOrDomain}` : ''}

Lütfen yukarıdaki JSON formatında karşılaştırmalı analizi üret.`;

  return { systemPrompt, userPrompt };
}
