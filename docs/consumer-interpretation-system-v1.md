# PsycheAI Consumer Interpretation System (v1.0)
**6 Soruluk Sonuç Çerçevesi, 5 Ölçek Konumu, Çok Kademeli AI Derinliği ve Terminoloji Kılavuzu**

---

## 1. 6 Soruluk Tüketici Sonuç Çerçevesi

Geleneksel test raporları yalnızca soyut puanlar veya teknik yüzdelikler sunarken; PsycheAI tüketici yorumlama sistemi her değerlendirme ve alt boyut sonucunu 6 temel insani soru etrafında yapılandırır:

1. **Bu Sonuç Benim Hakkımda Ne Söylüyor? (Temel Anlam)**
   - Boyutun ölçüm ölçeğindeki konumuna göre kullanıcının temel eğilimini net, sıcak ve güçlendirici bir dille açıklar.
2. **Bu Puan Ne Anlama Geliyor? (Ölçek Konumu)**
   - Puanı toplum normu veya "iyi/kötü" olarak etiketlemeden, 1.0–5.0 ölçeğindeki yerini (örn. "Orta-üst bölge: 3.41 – 4.20") açıklar.
3. **Günlük Hayatımda Nasıl Görünüyor? (Yaşam Yansımaları)**
   - Karar alma, ilişkiler, çalışma tarzı veya stres anlarındaki somut davranışsal örüntüleri örneklendirir.
4. **Diğer Özelliklerimle Nasıl Birleşiyor? (Örüntüler ve Etkileşimler)**
   - Tekil boyutu izole bırakmaz; profildeki diğer ölçülmüş boyutlarla sinerjilerini ve denge noktalarını gösterir.
5. **Kuramlar Bu Özelliğimi Nasıl Okuyor? (Kuramsal Çerçeveler)**
   - Freud, Jung, Rogers, Maslow veya Beck gibi büyük ekollerin bu eğilimi nasıl anlamlandırdığını epistemik ayrım ile aktarır.
6. **Bunun Üzerine Nasıl Düşünebilirim? (Yansıtıcı Sorular)**
   - Kullanıcıyı etiketlemek yerine, içgörüsünü artıracak 2-3 derinleştirici soru yöneltir.

---

## 2. 5-Bantlı Tüketici Ölçek Konumlandırma Sistemi

Popülasyon normu veya yüzdelik dilim uydurulmasını engellemek amacıyla merkezi `resolveConsumerScalePosition` fonksiyonu kullanılır:

| Skor Aralığı | Bant Kodu | Tüketici Etiketi | Tüketici Açıklaması |
| :--- | :--- | :--- | :--- |
| **1.00 – 1.79** | `VERY_LOW` | Düşük uca yakın | Ölçüm ölçeğinin düşük ucuna yakın bir konum. |
| **1.80 – 2.59** | `LOW_MID` | Orta-alt bölge | Ölçüm ölçeğinin orta bölgesinin altında bir konum. |
| **2.60 – 3.40** | `MID` | Orta bölge | Ölçüm ölçeğinin orta bölgesinde bir konum. |
| **3.41 – 4.20** | `MID_HIGH` | Orta-üst bölge | Ölçüm ölçeğinin orta bölgesinin üzerinde bir konum. |
| **4.21 – 5.00** | `HIGH` | Yüksek uca yakın | Ölçüm ölçeğinin yüksek ucuna yakın bir konum. |

> [!NOTE]
> Her ölçek konumunun altında şu açık bilgilendirme yer alır:
> *"Bu ifade toplum ortalaması veya norm karşılaştırması değildir. Yalnızca yanıtlarınızın 1–5 ölçüm ölçeğindeki konumunu gösterir."*

---

## 3. Çok Kademeli AI Yorumlama Derinliği (Multi-Tier AI Depth)

AI İçgörü Motoru V2.1 (`src/types/aiInsightV2.ts`, `promptTemplatesV2.ts`, `fallbackProvider.ts`), kullanıcının ihtiyacına göre 3 farklı bilişsel derinlik modunu destekler:

1. **GLANCE (Hızlı Bakış):**
   - 1 vurucu manşet (`headlineTr`), 2-3 cümlelik net özet (`summaryTr`) ve 2-3 madde halinde öne çıkan noktalar (`whatStandsOut`).
   - Mobil görünüm, ilk sonuç kartları ve genel bakış için optimize edilmiştir.
2. **NARRATIVE (Anlatısal Derinleşme):**
   - Günlük hayat örüntüleri (`dailyLifePatterns`), boyut etkileşimleri (`traitInteractions`), kuramsal bağlantılar ve yansıtıcı düşünme soruları (`reflectionQuestions`).
   - Profil keşfi ve kendini tanıma akışları için uygundur.
3. **DEEP_ANALYSIS (Kapsamlı Analiz & Bilimsel Çekmece):**
   - Tüm anlatısal unsurlara ek olarak; epistemik kanıt dökümü (`epistemicSegments`), bilimsel kanıt notları (`scientificEvidenceNotesTr`), metodolojik sınırlar ve dikkat edilmesi gereken dinamikler (`potentialBiasesOrCaveatsTr`).

---

## 4. Epistemik İddia Katmanları ve Nötr Dil Güvenceleri

Tüm yorumlarda 4 epistemik katman açık rozetlerle ayrıştırılır:
- 🔵 **Ölçülen Dayanak:** Deterministik test yanıtlarından elde edilen psikometrik veri.
- 🟣 **Kuramsal Yorum:** Psikoloji ekollerinin felsefi ve kavramsal okuması.
- 🟡 **Kullanıcı Bildirimi / Günlük:** Kullanıcının serbest metin olarak eklediği bağlam.
- 🟢 **Üzerinde Düşünebileceğin Sorular:** Teşhis içermeyen yansıtıcı hipotez ve sorular.

### Nötr & Güçlendirici Dil Dönüşümü:
- ❌ *"Tükenmişlik riski"* $\to$ ✅ *"Zorlayıcı olabilecek denge noktası"*
- ❌ *"Depresyon riski"* $\to$ ✅ *"Duygusal yük oluşturabilecek alan"*
- ❌ *"Kişilik problemi"* $\to$ ✅ *"Daha fazla dikkat gerektiren eğilim"*
- ❌ *"Klinik risk"* $\to$ ✅ *"Hassas denge alanı"*
