# 01 — Bilimsel Temel ve Epistemik Mimari

## 1. Amaç ve Vizyon: Psychological Digital Profile

PsycheAI Scientific Profile Engine, tek atımlık yüzeysel kişilik testleri veya astroloji/fal formatına bürünmüş popüler quiz sitelerinden radikal biçimde ayrışır. 

Temel amaç: Birey hakkında modern psikometri, davranış bilimleri, bilişsel psikoloji, motivasyon, benlik, duygu düzenleme ve kişilerarası dinamikleri temel alan; zaman içinde gelişen, ölçüm hatasını açıkça raporlayan ve kuramsal yaklaşımları ampirik veriden titizlikle ayıran kapsamlı bir **Psychological Digital Profile (Psikolojik Dijital Profil)** oluşturmaktır.

---

## 2. En Temel Bilimsel Kural: Ölçüm ≠ Yorum (Measurement ≠ Interpretation)

Sistemin hiçbir aşamasında ampirik ölçüm ile kuramsal yorum birbirine karıştırılamaz:

1. **Ölçüm (Measurement):** Modern psikometri kurallarına (Klasik Test Kuramı - CTT, Doğrulayıcı Faktör Analizi - CFA, Madde Tepki Kuramı - IRT) dayanan; ters kodlama, faktör ağırlıkları, standart hata ($SEM$) ve güven aralıkları ile hesaplanan latent (örtük) özellik tahminleridir.
2. **Yorum (Interpretation):** Ölçülmüş nesnel verilere; psikoloji tarihindeki ekollerin (Freud, Jung, Adler, Rogers, Maslow, Skinner, James, Gestalt) veya modern bilişsel modellerin getirdiği kavramsal açıklamalardır.

> [!IMPORTANT]
> **Kırmızı Çizgi:**
> - "Freud Skoru: %84", "Jung Tipi Uyumu: %92", "Maslow Seviyesi: 4" gibi bilimsel temeli olmayan sahte sayılar sistem tarafından ASLA üretilemez.
> - LLM (DeepSeek V4 Flash) hiçbir psikometrik skoru hesaplayamaz, değiştiremez veya tahmin edemez.

---

## 3. Dört Katmanlı Epistemik Statü Sistemi

Sistemde sunulan her grafik, veri noktası, yorum ve içgörü kartı aşağıdaki 4 epistemik sınıftan birini açık bir rozet (badge) ve metin ile taşımak zorundadır:

| Epistemik Statü | UI Etiketi | Tanım ve Bilimsel Kriter |
|---|---|---|
| `VALIDATED_MEASUREMENT` | **Ölçülen Boyut (Measured)** | Doğrulanmış psikometrik araçlarla doğrudan ölçülen ve psikometrik geçerliği gösterilmiş latent özellikler. |
| `EVIDENCE_SUPPORTED_INTERPRETATION` | **Kanıt Destekli Çıkarım (Evidence-Supported)** | Birden fazla ölçülen construct arasındaki ampirik korelasyon veya matematiksel farklardan türetilen örüntüler (örn: Higgins benlik farkı, bağlanma koordinatları). |
| `THEORETICAL_INTERPRETATION` | **Kuramsal Mercek (Theoretical Lens)** | Tarihsel veya çağdaş bir psikolojik kuramın (Freud, Adler, Maslow vb.) ölçülen verilere getirdiği kavramsal hipotez. |
| `HISTORICAL_FRAMEWORK` | **Tarihsel Perspektif (Historical Perspective)** | Psikoloji tarihindeki erken dönem felsefi veya eğitsel modeller (örn: James işlevselciliği, Jungiyen yönelimler); ampirik gerçek gibi sunulamaz. |

---

## 4. Sahte Hassasiyetin (Pseudo-Precision) Reddi ve Hata Marjı

Hiçbir psikometrik araç insan zihnini sıfır hata ile ölçemez. Bu nedenle:
- Kullanıcıya "Dürtüsellik: %78.4" gibi tekil ve yanıltıcı nokta tahminleri sunulmaz.
- Her ölçüme mutlaka **Ölçüm Standart Hatası ($SEM$)** ve **%95 Güven Aralığı ($95\% \text{ CI}$)** eşlik eder.
- Türkiye temsili norm çalışması tamamlanana kadar **Toplum Persentili (Percentile) ve T-Skorları KESİNLİKLE ÜRETİLMEZ**.

---

## 5. Çok-Boyutlu Ölçüm Güveni (Confidence System)

"Confidence: %95" gibi kullanıcının bu özelliğinin %95 doğru olduğu yanılsamasını yaratan ifadeler yasaklanmıştır.

Ölçüm Güveni (Measurement Confidence); aşağıdaki bileşenlerin şeffaf bir fonksiyonu olarak raporlanır:
- **Ölçüm Hassasiyeti (Measurement Precision):** Standart hatanın küçüklüğü.
- **Madde Kapsamı (Item Coverage):** O boyut için hedeflenen madde sayısına ne kadar ulaşıldığı.
- **Yanıt Kalitesi (Response Quality):** Dikkatsiz yanıt, sayfa süresi ve tekdüzelik sinyalleri.
- **Yöntem Çeşitliliği (Method Diversity):** Boyutun Likert, Senaryo ve Davranışsal sıklık gibi farklı formatlarla desteklenme derecesi.
- **Boylamsal Kararlılık (Temporal Stability):** Tekrar ölçümlerindeki test-tekrar test tutarlılığı.
- **Kalibrasyon Durumu (Calibration Status):** Boyutun ön-kalibrasyon mu yoksa IRT kalibrasyonlu mu olduğu.

---

## 6. Bağlamsal Ayrışma vs Çelişki (Context Shift ≠ Inconsistency)

Bireyin farklı yaşam alanlarında farklı davranış örüntüleri sergilemesi otomatik olarak bir "hata" veya "tutarsızlık" değildir:
1. **Ölçüm Hatası / Dikkatsiz Yanıt (Inconsistency):** Zıt maddelere aynı anda onay verme gibi psikometrik geçersizlik sinyalleri.
2. **Kişilik İçi Gerilim (Intrapersonal Tension):** Birbirine zıt iki hedefin aynı anda yüksek çıkması (örn: Yüksek Özerklik + Yüksek Sosyal Onay İhtiyacı).
3. **Bağlamsal Esneklik (Contextual Modulation):** Bireyin işte iddiacı (assertive) iken romantik ilişkide uyumlu (accommodating) olması; sağlıklı bir durumsal esneklik olarak modellenir.

---

## 7. Klinik Güvenlik ve Non-Diagnostic Konumlandırma

PsycheAI bir psikiyatrik tanı veya klinik değerlendirme aracı **değildir**:
- Depresyon, Bipolar Bozukluk, DEHB, Otizm Spektrumu, Sınırda Kişilik Bozukluğu veya Travma tanısı konulamaz.
- Kullanıcıya patoloji veya bozukluk ima eden hiçbir dil kullanılamaz.
- Yüksek duygusal sıkıntı veya negatif duygulanım sinyalleri saptandığında sistem teşhis koymaz; profesyonel psikolojik destek kaynaklarına yönlendiren etik bilgilendirme panelleri sunar.
