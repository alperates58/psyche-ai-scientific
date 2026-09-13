# 06 — AI ve DeepSeek V4 Flash Entegrasyon Mimarisi

## 1. Mimari İlke: AI Ölçmez, Yorumlar

PsycheAI platformunda DeepSeek V4 Flash, bir ölçüm motoru değil; deterministik psikometri servisinin ürettiği yapılandırılmış verileri insani, pedagojik ve anlaşılır bir dille sentezleyen bir **araştırma ve içgörü tercümanıdır**.

```
[KULLANICI YANITLARI]
         │
         ▼
[PSİKOMETRİK HESAPLAMA MOTORU (Deterministik CTT / IRT / Scoring.ts)]
         │
         ▼
[VERİ KALİTESİ VE BÜTÜNLÜK DENETİMİ (Response Integrity / Integrity.ts)]
         │
         ▼
[GÜVENLİK VE EPİSTEMİK SINIRLANDIRMA (Zod Payload Validator)]
         │
         ▼
[DEEPSEEK V4 FLASH (Yapılandırılmış JSON Sentezi)]
         │
         ▼
[KLİNİK GÜVENLİK VE İDDİA DENETİMİ (Safety Guard Filter)]
         │
         ▼
[SONUÇ DASHBOARD'U / RAPOR RENDERER]
```

---

## 2. DeepSeek V4 Flash Görev Sınırları

### KESİNLİKLE YAPABİLİR:
1. Önceden hesaplanmış puanları, standart hataları ve güven aralıklarını pedagojik ve sıcak bir Türkçe anlatıya dönüştürmek.
2. Birden fazla construct arasındaki etkileşimleri (sinerji ve gerilimleri) somutlaştırarak kullanıcıya ayna tutmak.
3. Seçilen Theory Council ekolünün kavramsal çerçevesini, belirtilen epistemik etiket altında açıklamak.
4. Ölçüm güveni düşük olan veya çelişkili bulunan alanlar için kullanıcıya derinleştirici takip soruları (follow-up inquiry) önermek.
5. Zaman serisi verisindeki boylamsal trendleri özetlemek.

### KESİNLİKLE YAPAMAZ (YASAKLAR):
1. **Skor Üretmek/Değiştirmek:** Hiçbir psikometrik skoru tahmin edemez, uyduramaz veya değiştiremez.
2. **Klinik Tanı Koymak:** Depresyon, bipolar, DEHB, otizm, narsisistik kişilik bozukluğu vb. klinik tanı veya patoloji imasında bulunamaz.
3. **Persentil Uydurmak:** Validated norm verisi olmadan "toplumun %80'inden daha yüksek" gibi ifadeler kullanamaz.
4. **Ölçülmeyen Boyut Tahmini:** Payload'da yer almayan bir özellik hakkında spekülasyonda bulunamaz (hallucination engeli).
5. **Kuramları Bilimsel Gerçek Diye Sunmak:** Freudyen veya Jungiyen kavramları modern biyolojik veya ampirik gerçekler gibi aktaramaz.
6. **Astroloji / Fal Dili:** Barnum (Forer) etkisi taşıyan genel-geçer ve pohpohlayıcı boş övgüler üretemez.

---

## 3. Zod Şema Doğrulaması ve Tip Güvenliği

DeepSeek'e gönderilen veri ve DeepSeek'ten alınan JSON yanıtı; çalışma zamanında (runtime) **Zod kütüphanesi** ile şemaya karşı katı biçimde doğrulanır (`src/ai/deepseek.ts`).

Şema ihlali veya yasaklı klinik tanı kelimesi (`validateSafetyGuards`) saptandığı an işlem iptal edilir ve ham psikometrik veriler AI anlatısı olmadan güvenle kullanıcıya gösterilir.

---

## 4. Prompt Injection Savunması

Kullanıcının değerlendirme sırasında serbest metin olarak girdiği hiçbir içerik, sistem talimatlarının bulunduğu alana doğrudan gömülmez.

Kullanıcı metni, `<user_untrusted_narrative>` etiketleri arasına hapsedilir. Sistem promptu modele bu alanın kesinlikle bir komut olmadığını, analiz edilecek pasif bir veri nesnesi olduğunu ve içindeki hiçbir yönergeye uyulmaması gerektiğini kesin bir dille bildirir.

---

## 5. AI Servisi Kesintisi (Degradation Mode)

Eğer DeepSeek API'sine erişilemezse veya yanıt şemayı geçemezse:
- Platform çalışmaya eksiksiz devam eder.
- Tüm radar grafikleri, facet dağılımları, güven aralıkları, çelişki matrisleri ve kuramsal kartlar deterministik kurallarla render edilir.
- AI anlatısı, platformun vazgeçilmez bir bağımlılığı değil; zenginleştirici bir ek katmandır.
