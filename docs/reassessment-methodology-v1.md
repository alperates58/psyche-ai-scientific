# PsycheAI Yeniden Değerlendirme Metodolojisi ve Ürün Deneyimi (FAZ 2.20)

## 1. Yeniden Değerlendirme Aralıkları ve Prensipleri

Psikolojik boyutların zaman içindeki kararlılık ve durum değişimlerini takip etmek için operasyonel yeniden değerlendirme öneri motoru kullanılır.

**Önemli Bilimsel Not:**
Yeniden değerlendirme aralıkları mutlak psikometrik reçeteler değil, bilimsel literatür ve kullanıcı deneyimi doğrultusunda yapılandırılmış **operasyonel ürün varsayımlarıdır**.

### Operasyonel Aralıklar:
1. **Kısa Aralık (30 Gün):** Hızlı durum değişkenliği gösterebilecek duygu düzenleme ve öz-yetkinlik alanları için opsiyonel takip aralığı.
2. **Standart Aralık (90 Gün / 3 Ay):** Mizaç ve temel kişilik yapısı için önerilen standart takip aralığı.
3. **Uzun Aralık (180 Gün / 6 Ay):** Geniş çaplı boylamsal profil güncelleme periyodu.

---

## 2. Yeniden Değerlendirme Öneri Mantığı (Deterministic Logic)

Yeniden değerlendirme önerisi aşağıdaki faktörlere göre belirlenir:
1. **Geçen Süre (Elapsed Time):** Son tamamlanma tarihinden bu yana geçen gün sayısı ($>90$ gün ise yüksek öncelik).
2. **Düşük Tekrar Sayısı (Low Repeat Count):** Yalnızca 1 kez tamamlanmış modüller önceliklendirilir.
3. **Keşif Kapsamı (Uncovered Coverage):** Henüz hiç çözülmemiş modüller `NEW_MODULE` önceliğiyle önerilir.
4. **Modül Süresi (Duration):** Kullanıcıyı yormayacak dengeli dağılım.

**Yasak:**
> Hiçbir değerlendirme, kullanıcının bir boyutta "düşük" veya "istenmeyen" puan alması gerekçe gösterilerek **"Bu puanı düzeltmek için tekrar çöz"** mantığıyla ÖNERİLEMEZ.

---

## 3. Kullanıcı Deneyimi (UX) ve Sonuç Karşılaştırma

1. **"Tekrar Ölç" Butonu:** Tamamlanan tüm değerlendirme kartlarında yer alır. Önceki tamamlama tarihini ve tekrar sayısını gösterir.
2. **Oturum Geçmişi (Session History):** Modül detayında `Tamamlama #1 (Tarih)`, `Tamamlama #2 (Tarih)` şeklinde tüm geçmiş saklanır. Eski sonuçlar asla ezilmez.
3. **"Önceki Ölçümle Karşılaştır" Paneli:** Bir modül tekrar tamamlandığında sonuç sayfasında aynı boyutların önceki puanı, güncel puanı, gözlenen farkı ve kalite notu nötr bir dille sunulur.
4. **Zaman Çizelgesi Bağlantısı (`/profile/timeline`):** Kullanıcı tüm modüllerin boylamsal seyrini tek bir bütünleşik arayüzde inceleyebilir.
