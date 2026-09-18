# PsycheAI Boylamsal Değişim Yönetişimi ve Bilimsel Sınırlar (FAZ 2.20)

## 1. Bilimsel İhtiyat ve Ön-Kalibrasyon Sınırları

PsycheAI platformundaki tüm envanterler mevcut aşamada `PRE_CALIBRATION` (temsili ulusal norm kalibrasyonu öncesi) durumundadır.

Bu aşamada:
1. **İstatistiksel Anlamlılık Yasağı:** Gözlenen puan farkları "istatistiksel olarak anlamlı değişim" olarak adlandırılamaz.
2. **RCI (Reliable Change Index) Yasağı:** Standart ölçüm hatası ($SEM$) ve ampirik test-tekrar-test güvenirlik katsayısı yerel temsili örneklemde doğrulanana kadar RCI hesaplanamaz ve sunulamaz.
3. **Klinik Anlamlılık Yasağı:** Sonuçlar tedavi etkisi, iyileşme veya patolojik gerileme olarak yorumlanamaz.
4. **Değer Yargısı Yasağı:** Puanın yükselmesi otomatik olarak "iyileşme/gelişme", düşmesi "kötüleşme/bozulma" olarak adlandırılamaz (örneğin dikkatlilik, duygusallık veya sosyal cesaret puanlarındaki artışlar ahlaki birer başarı değildir).

---

## 2. Değişim Sınıflandırma Taksonomisi (Taxonomy)

| Sınıflandırma Kodu | Puan Farkı ($| \Delta |$) | Anlamı ve Bilimsel Karşılığı |
| :--- | :--- | :--- |
| `NO_REPEAT_DATA` | - | Tekil kesitsel ölçüm; değişim iddia edilemez. |
| `STABLE_RANGE` | $< 0.20$ | Ölçüm hatası ve doğal dalgalanma aralığında benzer düzey (stabil). |
| `SMALL_OBSERVED_SHIFT` | $0.20 - 0.49$ | Hafif düzeyde gözlenen puan farkı. |
| `MODERATE_OBSERVED_SHIFT` | $0.50 - 0.79$ | Belirgin düzeyde gözlenen puan farkı. |
| `LARGE_OBSERVED_SHIFT` | $\ge 0.80$ | Yüksek düzeyde gözlenen puan farkı. |
| `VARIABLE_PATTERN` | Değişken ($>0.40$ aralık) | Zaman içinde dalgalı seyreden eğilim. |
| `CONTEXTUAL_SHIFT` | Bağlamsal | Genel mizaç ile durumsal bağlam (iş/ilişki/stres) arasındaki fark. |
| `QUALITY_LIMITED` | Kalite Uyarılı | Yanıt hızı veya dikkat uyarısı bulunan oturum; temkinli yorum. |
| `VERSION_INCOMPATIBLE` | Uyumsuz | Farklı envanter sürümleri doğrudan karşılaştırılamaz. |

---

## 3. Nedensellik (Causality) ve Zihin Okuma Koruması

- **Otomatik Neden Çıkarımı Yasaktır:** Sistem hiçbir zaman "Bu değişim iş değişikliğinizden kaynaklandı" veya "Bu yüzden ilişkiniz bitti" şeklinde nedensel bağ kuramaz.
- **Kullanıcı Beyanlı Yaşam Olayları (User-Reported Context):** Yalnızca kullanıcı açıkça bir yaşam olayı belirttiğinde eşleşme kurulabilir: "Bu değişim iş değişikliği dönemine denk geliyor."

---

## 4. Yapay Zeka Boylamsal Dil Kuralları (AI Guardrails)

Yapay Zeka Yorumlama Motoru (AI Insight Engine V2), boylamsal kanıt paketini (`LongitudinalEvidenceBundleV1`) tüketirken aşağıdaki kurallara kesinlikle uymak zorundadır:

### İzin Verilen Nötr İfadeler:
- *"Son iki ölçüm arasında..."*
- *"Üç ölçüm dönemi boyunca benzer düzeyde..."*
- *"Bu dönemde önceki ölçüme göre gözlenen hafif bir artış/azalış..."*
- *"Farklı ölçüm zamanlarında tutarlı seyreden eğilim..."*

### Kesinlikle Yasaklanan İfadeler:
- *"Zamanla giderek artıyor / azalıyor"*
- *"Kalıcı olarak değişti"*
- *"Kişiliğiniz dönüştü / değişti"*
- *"Significant improvement"*
- *"İstatistiksel olarak anlamlı değişim"*
- *"Kişilik gelişimi"*
- *"Kötüleşme / gerileme"*
