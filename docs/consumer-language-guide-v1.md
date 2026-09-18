# PSYCHEAI — TÜKETİCİ DİLİ, TERMİNOLOJİ VE BİLİMSEL İLETİŞİM REHBERİ (V1)

**Belge Kimliği:** `DOC-GUIDE-CONSUMER-LANGUAGE-V1`  
**Tarih:** 18 Eylül 2026  
**Durum:** Bağlayıcı Ürün Metin ve Dil Sözlüğü  
**Hedef:** Dahili yazılım ve psikometri jargonunu tüketici arayüzünden tamamen arındırmak; sıcak, saygın, yetkin ve insan odaklı bir Türkçe üslup standardı kurmak.  

---

## 1. TEMEL ÜSLUP VE TON (TONE OF VOICE)

### 1.1. Hedeflenen Kimlik
- **Seçkin ve Saygın:** Kullanıcıya bir laboratuvar deneyi veya hasta gibi değil; kendi hayatının kâşifi olan bilinçli bir birey gibi yaklaşır.
- **Sakin ve Huzurlu:** Kırmızı alarmlar, bağıran rozetler veya yapay kriz uyarıları içermez.
- **Bilimsel ama İnsani:** Arkasındaki katı psikometrik matematiği bilir; ancak kullanıcıya formülleri değil, o matematiğin hayattaki anlamını anlatır.
- **Yargısız ve Şefkatli:** Özellikleri "iyi/kötü" veya "başarılı/başarısız" diye etiketlemez; her eğilimin bir güç alanı ve bir kör noktası olduğunu gösterir.

### 1.2. Kaçınılacak Tuzaklar
- ❌ **Hastane / Klinik Arayüzü:** "Patoloji", "semptom", "tedavi", "hasta", "bozukluk", "tanı" kesinlikle yasaktır.
- ❌ **ERP / Yönetim Paneli:** "Veritabanı", "ontoloji", "telemetri", "kayıt logları", "kalibrasyon durumu" tüketiciye gösterilmez.
- ❌ **Astroloji / Fal:** "Sen kesin böylesin", "Kaderin bu", "Auran şöyle" gibi ciddiyetsiz ve bilimsellik dışı kehanetler yasaktır.
- ❌ **Çocuksu Test / Quiz Dili:** "Hangi hayvansın?", "Puanın 100!" gibi yüzeysel magazin yaklaşımları yasaktır.
- ❌ **Siberpunk / Neon AI Jargonu:** "Yapay Zekâ Beyni", "Nöral Sentez Modülü" gibi gösterişli ama içi boş ifadeler yasaktır.

---

## 2. TEKNİK DİL TEMİZLEME VE DÖNÜŞÜM MATRİSİ

Aşağıdaki tabloda platformda yer alan tüm teknik kavramların kullanıcı arayüzündeki nihai karşılıkları tanımlanmıştır:

```
┌──────────────────────────────────────┬────────────────────────────────┬─────────────────────────────────────────────────┐
│ Dahili / Teknik Terim                │ Sınıflandırma                  │ Tüketici Arayüzündeki Karşılığı / Aksiyon       │
├──────────────────────────────────────┼────────────────────────────────┼─────────────────────────────────────────────────┤
│ PROVISIONAL_POINT_ESTIMATE           │ NORMAL KULLANICIDA GİZLE       │ Gösterilmez (Doğal puanlama olarak sunulur)     │
│ MEASURED_PRECALIBRATION              │ TÜKETİCİ DİLİNE ÇEVİR          │ "Ölçüldü"                                       │
│ PRE_CALIBRATION                      │ GİZLE / AÇIKLAMA GEREKİRSE     │ "Yerel Ölçek Analizi (Toplum Normu Hariç)"      │
│ calibrationStatus                    │ GİZLE (Admin/Bilimsel Detay)   │ Boşsa gösterilmez; Bilimsel Detay'a taşınır     │
│ epistemicStatus                      │ GİZLE (Doğal Anlatıma Çevir)   │ Rozet kaldırılır; cümle içinde doğal ifade edilir│
│ Likert                               │ GİZLE / GEREKİRSE SADELEŞTİR   │ "5 seçenekli yanıt ölçeği" (Çoğu yerde gizlenir)│
│ confidenceComponents                 │ BİLİMSEL DETAYA TAŞI           │ "Ölçüm Gücü: Yüksek / Dengeli"                  │
│ responseQuality                      │ GİZLE (Sorun Varsa Uyar)       │ Yalnızca bozulma varsa nazikçe uyarılır         │
│ straightliningDetected               │ ADMIN / BİLİMSEL DETAY ONLY    │ Normal kullanıcı ekranından tamamen kaldırılır  │
│ speedViolations                      │ ADMIN / BİLİMSEL DETAY ONLY    │ Normal kullanıcı ekranından tamamen kaldırılır  │
│ attentionCheckPassed                 │ ADMIN / BİLİMSEL DETAY ONLY    │ Normal kullanıcı ekranından tamamen kaldırılır  │
│ Attention Check (Doğrulama Sorusu)   │ TEST EKRANINDAN SİL            │ Kullanıcıya sorunun dikkat kontrolü olduğu SÖYLENMEZ│
│ Norm unavailable / Comparison unavail│ BOŞSA GÖSTERME (Remove Empty)  │ Alan tamamen gizlenir, "N/A" yazılmaz           │
│ point estimate                       │ GİZLE                          │ "Ölçülen Değer" veya "Eğilim Puanı"             │
│ scoringModelCode                     │ ADMIN / BİLİMSEL DETAY ONLY    │ "SC_HEXACO_..." kullanıcıya gösterilmez        │
│ ontology                             │ TÜKETİCİ DİLİNE ÇEVİR          │ "Psikolojik Harita" veya "Boyut Modeli"         │
│ measurement model version            │ BİLİMSEL DETAYA TAŞI           │ Sayfa başlıklarından kaldırılır                 │
│ FAZ 2.x (Yazılım Faz Numarası)       │ KULLANICIDAN DERHAL SİL        │ Arayüzde hiçbir faz numarası görünemez         │
│ item count diagnostics               │ SADELEŞTİR                     │ "12 soru ile değerlendirildi"                   │
│ Epoch 1, Single Epoch                │ TÜKETİCİ DİLİNE ÇEVİR          │ "1. Ölçüm Dönemi"                               │
│ Reliable Change Index (RCI)          │ BİLİMSEL DETAYA TAŞI           │ "Belirgin Değişim" / "Kararlı Duruş"            │
│ SEM Band                             │ BİLİMSEL DETAYA TAŞI           │ "Doğal Değişim Aralığı"                         │
│ USER_PROVIDED_CONTEXT                │ GİZLE                          │ "Senin Paylaştığın Günlük Gözlemi"              │
│ THEORETICAL_INTERPRETATION           │ GİZLE (Doğal Akış)             │ "Kuramsal Bakış Açısı"                          │
│ MEASURED_FINDING                     │ GİZLE (Doğal Akış)             │ "Ölçülen Eğilim"                                │
└──────────────────────────────────────┴────────────────────────────────┴─────────────────────────────────────────────────┘
```

---

## 3. TÜKETİCİ DİLİ ÇEVİRİ VE CÜMLE ŞABLONLARI

### 3.1. Norm Karşılaştırması Olmayan Durumlar (Pre-Calibration)
- ❌ **Eski/Kötü:** *"Norm comparison unavailable. Provisional point estimate based on raw mean under pre-calibration model."*
- ✅ **Yeni/Tüketici:** *"Bu sonuçlar, ölçekteki yanıt dağılımınızı yansıtır; henüz temsili toplum ortalamalarıyla karşılaştırılmamaktadır."*

### 3.2. Boyut Seviyesi İfadeleri
- ❌ **Eski/Kötü:** *"Score: 4.60 (HIGH_SEVERITY). Epistemic status: PROVISIONAL_POINT_ESTIMATE."*
- ✅ **Yeni/Tüketici:** *"Öz-Disiplin boyutunda belirgin yüksek bir eğilim sergiliyorsunuz."*

### 3.3. Düşük Puan Yorumlama (Asla Olumsuzlamadan)
- ❌ **Eski/Kötü:** *"Duygusal Dayanıklılık puanınız düşük (2.10). Geliştirilmesi gerekir."*
- ✅ **Yeni/Tüketici:** *"Duygusal Hassasiyet boyutunda çevresel etkilere daha açık ve duyarlı bir eğilimdesiniz. Bu durum empati ve derin hissetme gücü sağlarken, yoğun stres anlarında dinlenme ihtiyacınızı artırabilir."*

### 3.4. İçsel Gerilimlerin İfadesi
- ❌ **Eski/Kötü:** *"Detected Tension Rule TR-04: Construct conflict between O-Creativity and C-Organization."*
- ✅ **Yeni/Tüketici:** *"Profilinizde iki güçlü eğilim bir arada yer alıyor: Bir yandan yeni ve yaratıcı fikirlere açıkken, diğer yandan düzen ve yapı kurmayı seviyorsunuz. Bu iki yön zaman zaman birbiriyle yarışabilir; ancak doğru dengelendiğinde harika bir vizyon-uygulama ortaklığı yaratır."*

### 3.5. Yanıt Kalitesi Uyarısı (Sadece Gerekliyse)
- ❌ **Eski/Kötü:** *"Telemetry Alert: Speed violations exceeded threshold (8 items < 1200ms). Flag: COMPROMISED."*
- ✅ **Yeni/Tüketici:** *"Bu değerlendirmede bazı sorular çok hızlı yanıtlanmış olabilir. Profilinizin en yüksek doğrulukta kalması için testi ileride dilediğiniz bir zaman sakin bir ortamda yeniden çözebilirsiniz."*

---

## 4. DOKUNULMAZ BİLİMSEL GÜVENLİK KURALLARI (INVIOLABLE PRINCIPLES)

Kullanıcı arayüzünden teknik terminolojinin temizlenmesi, arka plandaki bilimsel güvenliğin gevşetildiği anlamına ASLA gelmez. Aşağıdaki kurallar sistem genelinde katı olarak işletilmeye devam edecektir:

1. **AI ASLA SKOR HESAPLAYAMAZ:** Skorlar yalnızca deterministik Master Model servisleri tarafından hesaplanır.
2. **KLİNİK TEŞHİS KESİNLİKLE YASAKTIR:** Hiçbir metinde veya AI çıktısında psikiyatrik tanı konulamaz.
3. **NORM VERİSİ OLMADAN YÜZDELİK ÜRETİLEMEZ:** Yalan norm üretimi etik suçtur.
4. **KURAM VE GÜNLÜK ÖLÇÜMLE KARIŞTIRILAMAZ:** Kuramcı yorumları ve günlük yansımaları, ampirik psikometrik skorları değiştiremez.
5. **BOYLAMSAL NEDENSELLİK İDDİASI YAPILAMAZ:** Tek ölçümle "kişiliğin değişti", "çocukluk travman yüzünden" gibi uydurma nedensellikler kurulamaz.
