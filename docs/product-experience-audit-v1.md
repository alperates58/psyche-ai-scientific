# PSYCHEAI — ÜRÜN DENEYİMİ, ANLAMLANDIRMA VE GÖRSELLEŞTİRME KAPSAMLI DENETİM RAPORU (V1)

**Belge Kimliği:** `DOC-UX-AUDIT-2026-V1`  
**Tarih:** 18 Eylül 2026  
**Durum:** Kesin Denetim Raporu (Redesign Uygulaması Öncesi Mimari Referans)  
**Kapsam:** Tüm Kullanıcı Arayüzü Rotaları, Bileşenler, Yorumlama Katmanları, Görselleştirme Altyapısı ve Dil Denetimi  

---

## 1. YÜRÜTÜCÜ ÖZET VE TEMEL ÜRÜN PROBLEMİ

PsycheAI, arka planda son derece titiz, 11 alanlı (Master Model), 37 boyutlu ve 91 alt boyutlu psikometrik bir ontolojiye, dondurulmuş form sürümlerine, deterministik kanıt paketleme motorlarına ve 10 büyük kuramcı merceğine sahiptir. Ancak ürün deneyimi ve kullanıcıya dönük anlamlandırma katmanı, bu bilimsel derinliğin çok gerisinde kalmıştır.

### 1.1. Temel Teşhis
Kullanıcılar 50–100 maddelik kapsamlı psikolojik ölçekleri tamamladıklarında şu anki sistemde:
1. **Yetersiz ve Kuru Sayısal Sonuçlar:** `4.12 / 5.00` gibi ham ortalamalar ve 2-3 satırlık kısa açıklamalar görmektedir.
2. **Korkutucu ve Anlamsız Geliştirici Terminolojisi:** Normal bir bireye `PROVISIONAL_POINT_ESTIMATE`, `MEASURED_PRECALIBRATION`, `Likert`, `calibrationStatus`, `straightliningDetected`, `scoringModelCode` gibi dahili durumlar gösterilmektedir.
3. **Kopuk ve Parçalanmış Rota Mimarisi:** Temel Kişilik, Profil Haritası, Zaman Çizgisi, Bağlamsal Değişimler ve Kuramlar Konseyi sanki 5 farklı ürünmüş gibi sol menüde dağınık durmakta, bütüncül bir benlik anlatısı sunamamaktadır.
4. **Yapay Zeka Yorumlarının Sığ Kalması:** AI üretim motoru, aşırı katı kısıtlar ve yapısal yönlendirme eksikliği nedeniyle 2-3 cümlelik genel geçer özetlere sıkışmakta; kullanıcının günlük hayatına, karar alma tarzına ve ilişkilerine dokunan derin analizler sunamamaktadır.
5. **Kuramlar Konseyi'nin Akademik Bir Kağıt Gibi Durması:** Freud, Jung, Rogers gibi büyük mercekler, kullanıcıya canlı ve felsefi bir ayna tutmak yerine `#facet_code_1` gibi etiketler ve teknik epistemik uyarı bloklarıyla sunulmaktadır.
6. **Eksik Açılış ve Karşılama Deneyimi:** `/` rotası doğrudan `/overview`a yönlenmekte, giriş yapmamış bir ziyaretçiye PsycheAI'ın ne olduğunu, 91 alt boyutu nasıl haritalandırdığını ve neden güvenilir olduğunu anlatan bir Landing Page bulunmamaktadır.

---

## 2. TÜM KULLANICI ROTALARI İÇİN EKSİKSİZ ENVANTER

Aşağıdaki tabloda platformdaki tüm kullanıcıya açık (Public ve Authenticated) rotalar 14 ölçüt üzerinden denetlenmiştir.

---

### ROTA 1: `/` (Açılış / Kök Dizin)
- **Mevcut Durum:** `redirect('/overview')` yapıyor. Ziyaretçi doğrudan `/login` sayfasına fırlatılıyor.
- **Mevcut İçerik:** Yok (boş yönlendirme).
- **Mevcut Görseller:** Yok.
- **Mevcut AI Yorumu:** Yok.
- **Mevcut Teknik Terimler:** Yok.
- **Mevcut UX Sorunları:** Ziyaretçi ürünün ne olduğunu görmeden oturum açma formuyla karşılaşıyor. Dönüşüm ve güven sıfır.
- **Mevcut Boş/Yararsız Durumlar:** Tamamen atıl rota.
- **Önerilen Amaç:** Etkileyici, modern, bilimsel güven veren, interaktif örnek görseller içeren ana vitrin (Public Landing Page).
- **Ne Kalmalı:** Hızlı yüklenme, sade tipografi.
- **Ne Değişmeli:** Gerçek bir pazarlama/tanıtım açılış sayfası inşa edilmeli.
- **Ne Bilimsel Detaya Taşınmalı:** N/A.
- **Kullanıcı Görünümünden Ne Kaldırılmalı:** Otomatik kör yönlendirme kaldırılmalı (sadece oturum açmış kullanıcılar `/overview`a yönlendirilmeli).
- **Gereken Yeni Görseller:** İnteraktif Radar Mockup'ı, Psikolojik Parmak İzi vizüeli, 11 Alan Haritası demosu, Kuramcılar Konseyi kartları, Zaman Trajektorisi görseli.
- **Gereken Yeni Yorumlar:** "Kendini etiketlerle değil, 91 boyutlu derin bir haritayla keşfet" gibi güçlü ürün manifestosu.

---

### ROTA 2: `/login` & `/register` & `/forgot-password` (Kimlik Doğrulama)
- **Mevcut Durum:** Ortalanmış, tek sütunlu, çıplak form kutuları.
- **Mevcut İçerik:** Sadece e-posta ve şifre giriş alanları.
- **Mevcut Görseller:** Sadece küçük `Ψ` ikonu.
- **Mevcut AI Yorumu:** Yok.
- **Mevcut Teknik Terimler:** "Dondurulmuş form sürümleri", "Epistemik güvenlik", "SHA-256".
- **Mevcut UX Sorunları:** B2B ERP yazılımı hissi veriyor; kullanıcının neye kaydolduğuna dair motivasyon veya heyecan yaratmıyor.
- **Mevcut Boş/Yararsız Durumlar:** Sol veya arka plan tamamen boş gri alan.
- **Önerilen Amaç:** İki sütunlu Onboarding Split Ekranı (Sol: Ürün vaatleri ve görsel vitrin; Sağ: Sadeleştirilmiş güvenli form).
- **Ne Kalmalı:** Google OAuth ve e-posta doğrulama akışı, şifre gücü kontrolleri.
- **Ne Değişmeli:** Masaüstünde 50/50 bölünmüş görsel karşılama düzenine geçilmeli.
- **Ne Bilimsel Detaya Taşınmalı:** Kriptografik anahtar açıklamaları.
- **Kullanıcı Görünümünden Ne Kaldırılmalı:** Kuru kurumsal metinler.
- **Gereken Yeni Görseller:** 3 ana değer önerisi kartı (91 Boyut, 10 Kuramcı, Zaman Çizelgesi).
- **Gereken Yeni Yorumlar:** "Bilimsel Öz-Farkındalık Yolculuğuna Başla".

---

### ROTA 3: `/onboarding` (Yeni Kullanıcı İlk Adım)
- **Mevcut Durum:** 0 değerlendirmesi olan kullanıcıyı ilk teste yönlendiren sakin karşılama sayfası.
- **Mevcut İçerik:** 4 prensip kartı ve "Başlangıç Yolculuğun" adımları.
- **Mevcut Görseller:** Standart Lucide ikonları.
- **Mevcut AI Yorumu:** Yok.
- **Mevcut Teknik Terimler:** "Ön Kalibrasyon", "Deterministik Master Model".
- **Mevcut UX Sorunları:** Metinler fazla formel; kullanıcının ilk testten sonra ne kazanacağı görselleştirilmemiş.
- **Mevcut Boş/Yararsız Durumlar:** Tamamlanmamış adımlar gri ve soluk kutular olarak duruyor.
- **Önerilen Amaç:** "İlk Değerlendirmenden Sonra Kilidi Açılacak Alanlar" önizlemesi sunan heyecan verici onboarding.
- **Ne Kalmalı:** Sakin, klinik olmayan rehberlik dili.
- **Ne Değişmeli:** Kullanıcıya ilk testin ardından oluşacak Profil Parmak İzi taslağı gösterilmeli.
- **Ne Bilimsel Detaya Taşınmalı:** Modülün soru bütçesi ve psikometrik çekirdek kodları.
- **Kullanıcı Görünümünden Ne Kaldırılmalı:** "Ön kalibrasyon modeli kısıtı" gibi soğuk uyarılar.
- **Gereken Yeni Görseller:** Boş/dolacak harita illüstrasyonu.
- **Gereken Yeni Yorumlar:** "Bu ilk adım 15 dakika sürer ve temel kişilik dinamiklerinin ilk katmanını açar."

---

### ROTA 4: `/overview` (Kullanıcı Karşılama / Ana Kontrol Paneli)
- **Mevcut Durum:** HEXACO Radarı, Sıradaki Adım kartı, 2 KPI kartı (Kapsam & Kalite) ve Epistemik Ayrım Çağrısı.
- **Mevcut İçerik:** Ham skorlar (ör. `4.12`), "Ön Kalibrasyon (v1.0.0)", "Örneklem Durumu: TR-Ön-Kalibrasyon", "Yanıt Bütünlüğü: Temiz".
- **Mevcut Görseller:** HexacoRadarChart (recharts), minik özet barları.
- **Mevcut AI Yorumu:** Sağ kolonda 1 paragraflık "Temel Profil Analizi" (çoğu zaman jenerik).
- **Mevcut Teknik Terimler:** `CANLI VERİ KAYDI (ÖN KALİBRASYON)`, `Geçici Bileşik`, `Nüfus Normu Hariç`, `Epistemik Ayrım İlkesi`, `Çoklu telemetri bütünlük takibi`.
- **Mevcut UX Sorunları:** Çok fazla "uyarı" ve "teknik kalkan" rozeti var. Kullanıcı "Ben kimim?" sorusuna hemen sıcak bir yanıt alamıyor.
- **Mevcut Boş/Yararsız Durumlar:** AI içgörüsü alanı tek bir kutuda çok kısa kalıyor.
- **Önerilen Amaç:** Kullanıcının son durumunu, en çarpıcı kişilik kombinasyonlarını, güncel yansıma temasını ve sıradaki en mantıklı adımı gösteren "Kişisel Yaşam Odası".
- **Ne Kalmalı:** Sıradaki adım yönlendirmesi, HEXACO radarının görsel çekiciliği, keşif ilerleme çubuğu.
- **Ne Değişmeli:** Teknik telemetri kartı yerine "Profilinin Öne Çıkan Güçleri" kartı gelmeli.
- **Ne Bilimsel Detaya Taşınmalı:** Örneklem durumu, telemetri analiz detayları, form sürüm numaraları.
- **Kullanıcı Görünümünden Ne Kaldırılmalı:** "Geçici Bileşik", "Ön Kalibrasyon v1.0.0" rozetleri.
- **Gereken Yeni Görseller:** Kişiselleştirilmiş 3 Boyutlu Eğilim Kartları, Günlük / Yansıma Nabzı Grafiği.
- **Gereken Yeni Yorumlar:** "Seni En İyi Anlatan 3 Eğilim", "Karar Anlarında Nasıl Bir Denge Kuruyorsun?".

---

### ROTA 5: `/assessments` (Değerlendirme Kataloğu ve Yolculuk)
- **Mevcut Durum:** `AssessmentsJourneyView` bileşeni üzerinden zorunlu ve opsiyonel modüllerin listesi.
- **Mevcut İçerik:** Modül başlıkları, tahmini süreler, soru sayıları, kilitli/açık durumları.
- **Mevcut Görseller:** Adım rozetleri, ilerleme çubukları.
- **Mevcut AI Yorumu:** Her modül için öneri gerekçesi metni.
- **Mevcut Teknik Terimler:** `CORE_FACET_COVERAGE`, `RESEARCH_BATTERY`, `MEASUREMENT_GOAL`.
- **Mevcut UX Sorunları:** Test listesi bir ders programı veya sınav listesi gibi hissettiriyor. Hangi testin kullanıcının hangi merakını gidereceği (ilişkiler, stres, kariyer, değerler) yeterince çekici anlatılmıyor.
- **Mevcut Boş/Yararsız Durumlar:** Kilitli testlerin neden kilitli olduğu salt teknik kurallarla ifade ediliyor.
- **Önerilen Amaç:** Merak uyandıran, yaşam alanlarına göre tematik gruplanmış (Kişilik, İlişkiler, Zihin & Karar, Duygusal Dayanıklılık) keşif kataloğu.
- **Ne Kalmalı:** Tahmini süreler, ilerleme yüzdesi, sıradaki adım vurgusu.
- **Ne Değişmeli:** "Zorunlu Başlangıç" yerine "Temel Profilini Başlat"; "Opsiyonel Modül" yerine "İlişkiler & Sosyal Dinamikleri Keşfet" gibi tüketici odaklı başlıklar.
- **Ne Bilimsel Detaya Taşınmalı:** Ontoloji madde eşleme kodları ve batarya lisans referansları.
- **Kullanıcı Görünümünden Ne Kaldırılmalı:** Dahili sınıflandırma enum'ları.
- **Gereken Yeni Görseller:** Her modül ailesi için özgün illüstratif ikonlar ve mini profil önizlemeleri.
- **Gereken Yeni Yorumlar:** "Bu değerlendirmeyi tamamladığında: Stres altındaki karar mekanizmalarını ve 4 alt boyutunu öğreneceksin."

---

### ROTA 6: `/assessment` (Değerlendirme Çözme Ekranı)
- **Mevcut Durum:** Tek soru odaklı, klavye destekli, dinamik Likert skalası içeren soru çözme arayüzü.
- **Mevcut İçerik:** Soru metni, 1-5 veya 1-7 Likert seçenekleri, soru sayacı, kalan süre, "Doğrulama Sorusu" rozeti.
- **Mevcut Görseller:** Seçenek butonları, ilerleme çubuğu.
- **Mevcut AI Yorumu:** Yok.
- **Mevcut Teknik Terimler:** `Doğrulama Sorusu` (Attention Check ifşa edilmiş!), `Ölçek Bölümü: RSES v1`, `Likert`.
- **Mevcut UX Sorunları:** Attention check sorusunun üzerine "Doğrulama Sorusu" yazılarak bilimsel geçerlilik zedeleniyor. Sayfa tepesinde çok fazla teknik ölçek adı geçiyor.
- **Mevcut Boş/Yararsız Durumlar:** Sorular arası geçişte nefes alma ve bağlam açıklayıcı mikro metinler eksik.
- **Önerilen Amaç:** Minimalist, dikkat dağıtmayan, huzurlu, bilimsel olarak kullanıcıyı yönlendirmeyen akıcı yanıt deneyimi.
- **Ne Kalmalı:** Klavye kısayolları (1-5, Enter), otomatik kaydetme, tahmini kalan dakika, mobil uyumlu dokunmatik alanlar.
- **Ne Değişmeli:** Dikkat kontrolü sorusundaki "Doğrulama Sorusu" etiketi DERHAL kaldırılmalı (bilimsel güvenlik kuralı).
- **Ne Bilimsel Detaya Taşınmalı:** Ölçek form versiyon kodları (`form_hexaco_60_v1.0.0`).
- **Kullanıcı Görünümünden Ne Kaldırılmalı:** `Likert` kelimesi, `Attention Check` göstergesi.
- **Gereken Yeni Görseller:** Sakinleştirici odaklanma modu tasarımı.
- **Gereken Yeni Yorumlar:** Tamamlama sonrasında anında gelen "Teşekkürler, yanıtların işlendi" rahatlatıcı mikro geri bildirimi.

---

### ROTA 7: `/assessments/results/[sessionId]` (Değerlendirme Sonuç Raporu)
- **Mevcut Durum:** 11 parçalı, son derece yüklü ama kullanıcı anlamlandırması sığ sonuç sayfası.
- **Mevcut İçerik:** `ResultSummaryHero`, `AssessmentResultAISection`, `HexacoRadarSection`, `HexacoFacetProfile`, `TraitHeatmapSection`, `DimensionSpectrumView`, `StrengthsRisksPanel`, `TensionsSynergiesPanel`, `ResponseQualityPanel`, `MeasurementCoveragePanel`, `NextAssessmentHandoff`.
- **Mevcut Görseller:** Radar grafiği, spektrum çubukları, renkli ısı matrisi.
- **Mevcut AI Yorumu:** 2-3 paragraflık kısa özet ve 1 adet düşünme sorusu.
- **Mevcut Teknik Terimler:** `Ön-Kalibrasyon Puanı`, `Likert`, `speedViolations: 0`, `straightliningDetected: false`, `attentionCheckPassed: true`, `scoringModelCode: SC_HEXACO_60_ARITHMETIC`, `Ontoloji Kapsamı`.
- **Mevcut UX Sorunları:** Kullanıcı tamamladığı testin kendisi için ne anlama geldiğini kavramadan telemetri ve hata denetim raporlarına boğuluyor. Skorlar 1-5 arasında salt sayı olarak duruyor.
- **Mevcut Boş/Yararsız Durumlar:** ResponseQualityPanel normal kullanıcı için anlamsız veri gürültüsü üretiyor.
- **Önerilen Amaç:** Kullanıcıya "Aha! Kendimi şimdi çok daha iyi anladım" dedirten 3 katmanlı (Özet -> Detay -> Derin Analiz) sonuç şaheseri.
- **Ne Kalmalı:** Boyut radarı / spektrum grafiği, güçlü yönler ve denge noktaları, sıradaki teste geçiş köprüsü.
- **Ne Değişmeli:** Tüm alt boyutlara 6 sorulu tüketici anlamlandırma şablonu getirilmeli ("Bu ne demek?", "Günlük hayatta nasıl görünür?", "Hangi durumlarda avantaj?", vb.).
- **Ne Bilimsel Detaya Taşınmalı:** Yanıt hızı ihlalleri, tekdüze yanıt telemetrisi, dondurulmuş form modeli kodu.
- **Kullanıcı Görünümünden Ne Kaldırılmalı:** `ResponseQualityPanel` (sadece kritik veri bozulması varsa tek satır nazik uyarı gösterilmeli, aksi halde tamamen gizlenmeli).
- **Gereken Yeni Görseller:** Boyut Denge Terazisi, Karar Verme & İlişki Tarzı Kartları, Etkileşim Haritası.
- **Gereken Yeni Yorumlar:** En az 350–700 kelimelik zengin, pedagojik, şefkatli ve kanıta dayalı analiz.

---

### ROTA 8: `/profile` (Master Bütünleşik Psikolojik Profil)
- **Mevcut Durum:** 11 tab'lı yatay sekme navigasyonu (`UnifiedProfileClientViewV2`), AI bölümü, 11 Alan Haritası, Isı Haritası, Dinamikler, 91 Alt Boyut Gezgini.
- **Mevcut İçerik:** 11 alan, 37 boyut, 91 alt boyut listesi, gerilimler, sinerjiler, kapsam kartları, Kuramlar Konseyi CTA'sı (`FAZ 2.19 — Kuramsal Konsil`).
- **Mevcut Görseller:** Radar, alan ilerleme barları, ısı haritası kutuları.
- **Mevcut AI Yorumu:** Bütünsel profil özeti, sinerji yorumları, gerilim yorumları.
- **Mevcut Teknik Terimler:** `FAZ 2.19`, `MEASURED_PRECALIBRATION`, `Durum: PROVISIONAL_POINT_ESTIMATE | Norm Durumu: PRE_CALIBRATION`, `confidenceComponents.coverage`.
- **Mevcut UX Sorunları:** Mobilde 11 sekme sağa doğru taşıyor ve kullanımı zorlaştırıyor. `FAZ 2.19` gibi yazılım sürüm numaraları başlıkta duruyor. Kartların içinde ham kodlar (`facet.code`) ve İngilizce isimler kullanıcıyı yoruyor.
- **Mevcut Boş/Yararsız Durumlar:** Ölçülmemiş sekmelere tıklandığında donuk bir tablo çıkıyor, kullanıcıya orayı nasıl açacağı samimi şekilde anlatılmıyor.
- **Önerilen Amaç:** 15 Bölümlük Zengin ve Katmanlı Benlik Portresi (Profil Özeti, Harita, Kişilik, Benlik, Duygu, Biliş, Motivasyon, İlişkiler, Dayanıklılık, Kombinasyonlar, Gerilimler, 91 Alt Boyut, Zaman Çizgisi, Yansımalar, Bilimsel Detay).
- **Ne Kalmalı:** 91 alt boyutun eksiksiz zenginliği, alanlar arası dinamikler, şeffaf kanıt çekmecesi ("Bu yorum neye dayanıyor?").
- **Ne Değişmeli:** Yatay taşan sekmeler yerine akıllı kategori seçici / sticky alt navigasyon gelmeli; `FAZ 2.x` yazıları temizlenmeli.
- **Ne Bilimsel Detaya Taşınmalı:** Kapsam seviyesi ve norm kalibrasyon durum stringleri.
- **Kullanıcı Görünümünden Ne Kaldırılmalı:** `MEASURED_PRECALIBRATION`, `PROVISIONAL_POINT_ESTIMATE`, yazılım faz numaraları.
- **Gereken Yeni Görseller:** Merkezi Psikolojik Parmak İzi, 11 Alan Çarkı (Domain Wheel), Karakteristik Kombinasyon Rozetleri, Boyut Ağ Yapısı.
- **Gereken Yeni Yorumlar:** Her alt boyut için tüketici diliyle hazırlanmış davranışsal göstergeler ve yansıtıcı sorular.

---

### ROTA 9: `/profile/personality` (Temel Kişilik ve Mizaç Görünümü)
- **Mevcut Durum:** HEXACO Radarı, Bıyık (Whiskers) Dağılım Grafiği ve 24 Alt Boyut Kartı.
- **Mevcut İçerik:** 6 ana faktör, 24 kişilik alt boyutu.
- **Mevcut Görseller:** `HexacoRadarChart`, `FacetWhiskersChart`.
- **Mevcut AI Yorumu:** Yok (Sadece statik psikometrik notlar).
- **Mevcut Teknik Terimler:** `CANLI VERİ KAYDI`, `Geçici betimsel bileşik puanlar`, `Özellik Atlası Özeti`, `EpistemicBadge PROVISIONAL_PATTERN`, `Hassasiyet: Developing`, `Ön-Kalibrasyon Modeli`.
- **Mevcut UX Sorunları:** Sayfa bir akademik laboratuvar raporuna benziyor. Whiskers grafiğindeki hata çizgileri kullanıcıda "Acaba bir hata mı yaptım?" endişesi uyandırıyor.
- **Mevcut Boş/Yararsız Durumlar:** Kartların altında "Doğrulama Durumu: Ön-Kalibrasyon Modeli" gibi tekrar eden yararsız metinler var.
- **Önerilen Amaç:** Kullanıcının temel mizaç yapısını (Dürüstlük, Duygusallık, Dışadönüklük, Geçimlilik, Sorumluluk, Deneyime Açıklık) hayatın içinden örneklerle anlatan sürükleyici bir kişilik atlası.
- **Ne Kalmalı:** 6 faktör ve 24 alt boyut yapısı, radar grafiği, alt boyut kartları.
- **Ne Değişmeli:** Bıyık grafiği yerine anlaşılır yatay spektrum çubukları; kartlarda ham sayı yerine seviye konumlandırması ("Yüksek uca yakın", "Dengeli alan").
- **Ne Bilimsel Detaya Taşınmalı:** Bıyık grafiğinin standart hata detayları ve epistemic rozetler.
- **Kullanıcı Görünümünden Ne Kaldırılmalı:** `PROVISIONAL_PATTERN`, `Ön-Kalibrasyon Modeli` tekrarları.
- **Gereken Yeni Görseller:** 6 Ana Mizaç Kutbu Karşılaştırması, Mizaç Güç Alanları Rozetleri.
- **Gereken Yeni Yorumlar:** Kişiliğin sosyal ilişkilere, çalışma biçimine ve stres tepkilerine yansımalarını anlatan zengin AI sentezi.

---

### ROTA 10: `/profile/heatmap` (Psikolojik Profil Haritası & Matris)
- **Mevcut Durum:** 11 alanın ve 91 alt boyutun renkli kutular halinde dizildiği tam sayfa ısı haritası ve sağ denetçi paneli.
- **Mevcut İçerik:** Hücre puanları (`0-100` veya `1-5`), tıklanınca açılan Alt Boyut Denetçisi.
- **Mevcut Görseller:** Grid matris kutuları.
- **Mevcut AI Yorumu:** Yok.
- **Mevcut Teknik Terimler:** `Epistemik Kademe: A Kademesi (Literatür Tanımlı)`, `Norm Kıyaslaması: Gizlendi (Ön-Kalibrasyon Aşaması)`, `Hassasiyet: Başlangıç Düzeyi (Ön Kalibrasyon)`.
- **Mevcut UX Sorunları:** Matris bir Excel tablosu veya veritabanı şeması gibi duruyor. Kullanıcı hücrelerin birbiriyle ilişkisini göremiyor.
- **Mevcut Boş/Yararsız Durumlar:** Ölçülmemiş hücrelere tıklandığında sadece "Ölçüm yapılmadı (0 madde)" yazıyor, o boyutu hangi testin ölçeceği yazmıyor.
- **Önerilen Amaç:** "Benim Psikolojik Haritam" hissi veren, ölçülen alanların parladığı, tıklanan boyutun yaşamdaki karşılığını ve hangi testle derinleşeceğini gösteren görsel keşif haritası.
- **Ne Kalmalı:** 11 alan ve 91 alt boyutun tek bakışta bütünsel görünmesi, interaktif hücre seçimi.
- **Ne Değişmeli:** "A Kademesi" gibi jargonlar yerine "Kanıt Düzeyi: Güçlü"; ölçülmemiş hücreler için "Bu Boyutu Aç" butonu.
- **Ne Bilimsel Detaya Taşınmalı:** Epistemik kademe sınıfları.
- **Kullanıcı Görünümünden Ne Kaldırılmalı:** "Literatür tanımlı kademe", "Gizlendi (Ön-kalibrasyon)".
- **Gereken Yeni Görseller:** Domain Çarkı entegrasyonu, Boyutlar Arası Bağlantı Çizgileri (Etkileşim Ağı).
- **Gereken Yeni Yorumlar:** Seçilen her alt boyut için 100 kelimelik canlı açıklama ve 1 adet düşündürücü soru.

---

### ROTA 11: `/profile/timeline` (Zaman Çizelgesi ve Boylamsal Takip)
- **Mevcut Durum:** Boylamsal hazır oluşluk durumu, ölçüm dönemleri (Epochs), kararlı ve değişen alt boyutlar, trajektori grafiği.
- **Mevcut İçerik:** Ölçüm geçmişi, değişim gösteren alt boyutlar listesi, admin bilim çekmecesi linki.
- **Mevcut Görseller:** `FacetTrajectoryChart` (çizgi grafik), dönem kartları.
- **Mevcut AI Yorumu:** Boylamsal değişim özeti.
- **Mevcut Teknik Terimler:** `Epoch`, `Longitudinal Readiness`, `SEM Band`, `Single Epoch Baseline`, `Reliable Change Index (RCI)`.
- **Mevcut UX Sorunları:** Tek bir ölçümü olan kullanıcıya sürekli "Henüz yeterli boylamsal veri yok, Epoch 2 bekleniyor" uyarısı veriliyor; kullanıcının ilk ölçümünün zaman içindeki değeri hissettirilmiyor.
- **Mevcut Boş/Yararsız Durumlar:** Tek ölçüm varken trajektori grafiği boş nokta olarak kalıyor.
- **Önerilen Amaç:** "Zaman İçinde Ben" — Kullanıcının psikolojik yolculuğunu, hangi dönemde hangi değerlendirmeyi tamamladığını, hayatındaki dönüm noktalarıyla psikolojik eğilimlerinin nasıl örtüştüğünü gösteren bir yaşam hikayesi akışı.
- **Ne Kalmalı:** Tekrar ölçüm karşılaştırmaları, kararlı kalan güçlü yönler, dikkat çeken dalgalanmalar.
- **Ne Değişmeli:** `Epoch` yerine "Ölçüm Dönemi"; `Longitudinal Readiness` yerine "Zaman Takibi Durumu".
- **Ne Bilimsel Detaya Taşınmalı:** RCI (Reliable Change Index) formülleri ve SEM bant katsayıları.
- **Kullanıcı Görünümünden Ne Kaldırılmalı:** `Epoch 1`, `Single Epoch Baseline`.
- **Gereken Yeni Görseller:** İnteraktif Yaşam Çizelgesi (Timeline Journey), Öncesi/Sonrası Karşılaştırma Terazisi.
- **Gereken Yeni Yorumlar:** "Son 6 ayda dikkat çeken en belirgin kararlılık: Duygusal denge skorlarınız tutarlı bir güç sergiliyor."

---

### ROTA 12: `/journal` & `/journal/[entryId]` (Yansımalarım / Günlük)
- **Mevcut Durum:** Serbest metin yazma alanı, psikolojik etiketleme, tekrar eden temalar paneli ve profil bağlantıları.
- **Mevcut İçerik:** Günlük kayıtları listesi, kayıt editörü, otomatik çıkarılan temalar, "Bu yansıma neye dayanıyor?" çekmecesi.
- **Mevcut Görseller:** Tema etiketleri, takvim kartları.
- **Mevcut AI Yorumu:** Günlük girdisi ile psikolojik boyutlar arasındaki gözlemsel yansıma çıkarımları.
- **Mevcut Teknik Terimler:** `USER_PROVIDED_CONTEXT`, `Observational Evidence`, `Epistemic Claim`.
- **Mevcut UX Sorunları:** Günlük yazarken kullanıcının psikolojik profiliyle nasıl bir köprü kurulduğu yeterince net hissettirilmiyor; AI yansımaları bazen çok mesafeli kalıyor.
- **Mevcut Boş/Yararsız Durumlar:** 0 günlük varken boş bir kutu görünüyor; ilham verici yansıma soruları sunulmuyor.
- **Önerilen Amaç:** "Kişisel Psikolojik Günlüğüm" — Kullanıcının gün içindeki olayları, hislerini ve kararlarını yazıp, profilindeki eğilimlerle ("Örneğin yüksek sorumluluk eğilimin bugün seni nasıl etkiledi?") yüzleştiği güvenli alan.
- **Ne Kalmalı:** Şifreli gizlilik garantisi, profil boyutlarına bağlama özelliği, tekrar eden temalar analizi.
- **Ne Değişmeli:** Boş durumda profile dayalı kişiselleştirilmiş günlük yazma soruları ("Bugün karar verirken seni en çok zorlayan an neydi?").
- **Ne Bilimsel Detaya Taşınmalı:** Epistemik katman kodları (`USER_PROVIDED_CONTEXT`).
- **Kullanıcı Görünümünden Ne Kaldırılmalı:** Gözlemsel telemetri terimleri.
- **Gereken Yeni Görseller:** Duygu & Tema Isı Takvimi (Mood & Theme Calendar), Yansıma-Boyut Bağlantı Ağı.
- **Gereken Yeni Yorumlar:** "Son 3 günlüğünde 'Zaman Yönetimi' ve 'Sorumluluk' temaları öne çıktı."

---

### ROTA 13: `/insights/context` (Bağlamsal Değişimler)
- **Mevcut Durum:** Henüz çoklu ortam değerlendirmesi yapılmadığı için statik boş ekran ve "Sosyal bağlamlar arası adaptasyon" ilkesi açıklaması.
- **Mevcut İçerik:** 1 adet prensip kutusu ve "Henüz bağlamsal veri bulunmuyor" boş durum kartı.
- **Mevcut Görseller:** `GitFork` ikonu.
- **Mevcut AI Yorumu:** Yok.
- **Mevcut Teknik Terimler:** `Çok Bağlamlı Gözlem Modeli`, `Epistemik İlke`.
- **Mevcut UX Sorunları:** Kullanıcı menüden tıkladığında tamamen boş bir sayfaya düşüyor ve ne yapması gerektiğini anlayamıyor.
- **Mevcut Boş/Yararsız Durumlar:** Bütün sayfa tek bir "Veri Yok" uyarısından ibaret.
- **Önerilen Amaç:** Ayrı bir izole boş rota olmak yerine, `/profile` içerisindeki **"8. İlişkiler & Sosyal Dinamikler"** veya **"11. Gerilimler & Denge Noktaları"** altına entegre edilmeli.
- **Ne Kalmalı:** "Farklı ortamlarda farklı davranmak iki yüzlülük değil, durumsal zekadır" bilimsel prensibi.
- **Ne Değişmeli:** Ayrı bir sayfa olarak menüde yer işgal etmemeli; profilin ilgili alanının altında bağlam kartı olarak açılmalı.
- **Ne Bilimsel Detaya Taşınmalı:** N/A.
- **Kullanıcı Görünümünden Ne Kaldırılmalı:** İzole boş sayfa kaldırılmalı.
- **Gereken Yeni Görseller:** İş vs Sosyal vs Yalnızlık radar karşılaştırma şablonu.
- **Gereken Yeni Yorumlar:** "İş ortamında daha planlı ve mesafeliyken, yakın ilişkilerinde şefkat ve esneklik öne çıkıyor."

---

### ROTA 14: `/insights/patterns` (Gerilimler ve Sinerjiler)
- **Mevcut Durum:** Tetiklenen içsel gerilimlerin, sinerjilerin ve çapraz örüntülerin kartlar halinde listelendiği sayfa.
- **Mevcut İçerik:** Gerilim kartları, sinerji kartları, bilimsel dayanaklar, öz-yansıtma soruları.
- **Mevcut Görseller:** Uyarı ve şimşek ikonları.
- **Mevcut AI Yorumu:** Dinamik etkileşim açıklamaları.
- **Mevcut Teknik Terimler:** `Etkileşimli Düğüm Matrisi`, `CANLI ANALİZ`, `Dayandığı Boyutlar: facet_1, facet_2`, `Güven: HIGH`.
- **Mevcut UX Sorunları:** Bu sayfa `/profile` içindeki sekme ile neredeyse %100 aynı içeriği kopyalıyor (duplikasyon).
- **Mevcut Boş/Yararsız Durumlar:** Profilde zaten olan bir bilginin ayrı bir URL'de gereksiz tekrarı.
- **Önerilen Amaç:** Profil mimarisiyle tam birleştirilmeli; profilin 10. ve 11. bölümlerinde ("Güçlü Kombinasyonlarım" ve "Gerilimler & Denge Noktaları") interaktif görsel haritayla sunulmalı.
- **Ne Kalmalı:** Zengin gerilim ve sinerji kuralları, düşündürücü yansıtma soruları.
- **Ne Değişmeli:** Bağımsız kopuk sayfa yerine zenginleştirilmiş profil bileşenine dönüştürülmeli.
- **Ne Bilimsel Detaya Taşınmalı:** Kural motoru ID'leri ve ham korelasyon güven skorları.
- **Kullanıcı Görünümünden Ne Kaldırılmalı:** `Etkileşimli Düğüm Matrisi` gibi soğuk mühendislik ifadeleri.
- **Gereken Yeni Görseller:** İnteraktif Zıtlık Terazisi (Tension Balance Scale), Sinerji Güç Çemberi.
- **Gereken Yeni Yorumlar:** "Yüksek Analitik Düşünme ile Yüksek Empati eğilimin bir araya geldiğinde: Hem rasyonel hem insan odaklı stratejiler geliştirebiliyorsun."

---

### ROTA 15: `/theory-council` (Kuramlar Konseyi Ana Sayfası)
- **Mevcut Durum:** 10 büyük kuramcı merceğinin (Freud, Jung, Adler, Rogers, Maslow, Skinner, James, Gestalt, Frankl, Beck) kartlar halinde listelendiği ana sayfa.
- **Mevcut İçerik:** Kuramcı adı, tarihsel dönem, gelenek, 1 paragraflık profil ön okuması, "Merceği İncele" ve "Karşılaştır" butonları.
- **Mevcut Görseller:** Kuramcı avatarları / ikonik mizaç kartları.
- **Mevcut AI Yorumu:** Her kuramcı için kısa önizleme yorumu.
- **Mevcut Teknik Terimler:** `Epistemik İddia Katmanları`, `Master Model V2 Adapter`, `FAZ 2.19`.
- **Mevcut UX Sorunları:** Kullanıcı bu sayfanın değerini anlamakta zorlanıyor: "Bu kuramcılar bana ne söyleyecek?". Kartlar çok metin ağırlıklı.
- **Mevcut Boş/Yararsız Durumlar:** Ölçüm tamamlanmamışsa kartlar sönük kalıyor.
- **Önerilen Amaç:** "10 Büyük Psikoloji Dehasının Gözünden Senin Profilin" — Kullanıcının ölçülmüş profilini tarihsel ekollerin gözlüğüyle okuyan büyüleyici bir felsefi/psikolojik danışma masası.
- **Ne Kalmalı:** 10 kuramcının eksiksiz listesi, kuramlar arası karşılaştırma özelliği, kaynakça şeffaflığı.
- **Ne Değişmeli:** `FAZ 2.19` temizlenmeli; her kuramcının kullanıcının profiline dair söylediği en çarpıcı "tek cümlelik içgörü" kartın vitrinine taşınmalı.
- **Ne Bilimsel Detaya Taşınmalı:** Kuram kısıtları ve epistemik ontoloji haritaları.
- **Kullanıcı Görünümünden Ne Kaldırılmalı:** Yazılım faz etiketleri.
- **Gereken Yeni Görseller:** Ekol Zaman Tüneli, Kuramcı Portreleri, 10 Mercek Konsil Masası Görseli.
- **Gereken Yeni Yorumlar:** "Rogers diyor ki: 'Öz-kabul eğiliminiz yüksek, kendinizle barışık bir gelişim çizgisi sergiliyorsunuz.'"

---

### ROTA 16: `/theory-council/[lensId]` (Kuramcı Mercek Detay & Diyalog)
- **Mevcut Durum:** Kuramcı başlığı, tarihsel bağlam, temel kavramlar, `EpistemicSegmentBadge` blokları, detaylı metin, kanıt çekmecesi, sınırlılıklar ve interaktif sohbet arayüzü.
- **Mevcut İçerik:** `TheoryLensDetailClient` bileşeni.
- **Mevcut Görseller:** Epistemik renkli rozetler, sohbet akışı.
- **Mevcut AI Yorumu:** Kuramsal analiz metni, zıtlık analizi, yansıtıcı diyalog yanıtları.
- **Mevcut Teknik Terimler:** `#facet_openness_creativity`, `Epistemik İddia Katmanları (Veri vs Yorum)`, `MEASURED_FINDING`, `THEORETICAL_INTERPRETATION`, `REFLECTIVE_HYPOTHESIS`, `USER_PROVIDED_CONTEXT`.
- **Mevcut UX Sorunları:** Yorum metninin içi `#facet_code_1` gibi kod parçacıklarıyla dolu. Kullanıcı kendini bir yapay zeka deneyi veya araştırma asistanı gibi hissediyor.
- **Mevcut Boş/Yararsız Durumlar:** Epistemik rozetler cümlenin akışını bölüyor ve okunabilirliği bozuyor.
- **Önerilen Amaç:** Kullanıcının seçtiği kuramcıyla (ör. Jung veya Frankl) sanki derin bir felsefi seanstaymış gibi hissettiği, 3 katmanlı (Kısa Görüş -> Detaylı Analiz -> Derin İnceleme) muazzam bir içgörü deneyimi.
- **Ne Kalmalı:** Bilimsel ayrım (ölçüm vs kuramsal yorum), interaktif yansıtıcı diyalog, literatür kaynakçası.
- **Ne Değişmeli:** Ham etiketler (`#facet_...`) metinden kaldırılmalı; epistemik ayrım cümlenin içine doğal bir anlatımla yedirilmeli ("Ölçüm verileriniz gösteriyor ki... Kuramımız açısından bu durum...").
- **Ne Bilimsel Detaya Taşınmalı:** Ham kaynak kodları ve ontoloji referans anahtarları.
- **Kullanıcı Görünümünden Ne Kaldırılmalı:** `MEASURED_FINDING` rozetleri, teknik segment etiketleri.
- **Gereken Yeni Görseller:** Kuramın Temel Kavram Şeması, Kuramsal Profil Odak Çemberi.
- **Gereken Yeni Yorumlar:** En az 600–1200 kelimelik, 4 ana bölümden oluşan (Odak Noktası, Dikkat Çeken 3 Dinamik, Günlük Yaşam Yansıması, Yansıtıcı Sorular) derin analiz.

---

### ROTA 17: `/theory-council/compare` (Kuramlar Arası Karşılaştırma)
- **Mevcut Durum:** 2 veya daha fazla kuramcının seçilerek aynı profil verisi üzerinde uzlaştığı ve ayrıştığı noktaları gösteren masa.
- **Mevcut İçerik:** `TheoryComparisonClient` bileşeni, uzlaşma noktaları, ayrışma noktaları, bütünleştirici sentez.
- **Mevcut Görseller:** Yan yana kuramcı kartları, karşılaştırma ikonları.
- **Mevcut AI Yorumu:** Karşılaştırmalı kuramsal sentez.
- **Mevcut Teknik Terimler:** `Epistemik konsensüs`, `Ontolojik ayrışma`, `Kanıt Ref: #facet_...`.
- **Mevcut UX Sorunları:** Karşılaştırma sonucu çok teorik bir makale gibi duruyor; kullanıcının günlük kararlarında bu iki kuramın nasıl yol göstereceği netleştirilmemiş.
- **Mevcut Boş/Yararsız Durumlar:** Ayrışma noktaları salt soyut kuram tartışması olarak kalabiliyor.
- **Önerilen Amaç:** "Farklı Gözlükler, Tek Bir Sen" — Örneğin Freud'un içsel çatışma olarak gördüğü bir durumu Rogers'ın büyüme potansiyeli olarak nasıl okuduğunu gösteren büyüleyici bir zihin jimnastiği.
- **Ne Kalmalı:** Uzlaşma ve ayrışma noktaları yapısı, çoklu kuram seçici.
- **Ne Değişmeli:** Karşılaştırma sonuçlarına "Senin İçin Pratik Çıkarım" bölümü eklenmeli.
- **Ne Bilimsel Detaya Taşınmalı:** Akademik referans kodları.
- **Kullanıcı Görünümünden Ne Kaldırılmalı:** Ham facet hashtag'leri.
- **Gereken Yeni Görseller:** İki Kutuplu Perspektif Matrisi (Dialectical Lens Matrix).
- **Gereken Yeni Yorumlar:** İki kuramın çatıştığı durumlar için somut karar verme rehberliği.

---

## 3. MEVCUT BİLEŞENLERİN VE GÖRSELLERİN DURUM MATRİSİ

| Bileşen / Görsel Adı | Konum | Mevcut Durum | Sorun / Eksiklik | Nihai Karar |
| :--- | :--- | :--- | :--- | :--- |
| **HexacoRadarChart** | `components/charts` | Aktif (recharts) | İyi çalışıyor ancak 0-100 indeksi ve Likert dönüşümü kafa karıştırıyor. | **Koru & Yeniden Tasarla** |
| **FacetWhiskersChart** | `components/charts` | Aktif (SVG) | Hata marjı çizgileri kullanıcıyı ürkütüyor, B2B bilimsel duruyor. | **Bilimsel Detaya Taşı / Sadeleştir** |
| **ProfileFingerprint** | `components/profile` | Aktif | Statik yatay çubuklar; parmak izi hissi vermiyor. | **Merkezi İmzaya Dönüştür (Redesign)** |
| **TraitHeatmapSection** | `components/results` | Aktif | Sonuç sayfasında çok erken ve aşırı teknik bir matris sunuyor. | **Profil Haritasına Taşı / Sonuçta Sadeleştir** |
| **DimensionSpectrumView** | `components/results` | Aktif | İyi bir temel; ancak yorum metinleri ve avantaj/dezavantaj katmanları sığ. | **Koru & Tüketici Anlamlandırmasıyla Genişlet** |
| **StrengthsRisksPanel** | `components/results` | Aktif | "Aşırı kullanım riskleri" iyi düşünülmüş; ancak maddeler kısa kalıyor. | **Koru & Günlük Yaşam Örnekleriyle Zenginleştir** |
| **TensionsSynergiesPanel** | `components/results` | Aktif | Zengin kurallar var; ancak salt metin kutusu olarak duruyor. | **Koru & İnteraktif Denge Terazisi Ekle** |
| **ResponseQualityPanel** | `components/results` | Aktif | Düz yanıtlama, hız ihlali, dikkat kontrolü vb. ifşa ediyor. | **NORMAL KULLANICIDAN KALDIR (Admin/Bilimsel Detay)** |
| **MeasurementCoveragePanel**| `components/results` | Aktif | "Ontoloji kapsamı" başlığıyla yazılım mimarisi anlatıyor. | **"Sırada Ne Var?" Handoff'una Entegre Et** |
| **FacetExplorerV2** | `components/profile` | Aktif | 91 boyutu listeliyor ama `4.12 / 5.00` ve epistemic kodlarla dolu. | **TAMAMEN YENİDEN TASARLA (Tüketici Kartları)** |
| **UnifiedProfileAISectionV2**| `components/profile/ai`| Aktif | Çok kısa, 2-3 cümlelik özetlerle sınırlı kalıyor. | **3 Katmanlı Derin Analiz Motoruna Dönüştür** |
| **EpistemicSegmentBadge** | `components/theory` | Aktif | `#facet_code` etiketleri ve akademik rozetler okumayı zorlaştırıyor. | **Doğal Metin Akışına Dönüştür / Çekmeceye Taşı** |
| **LongitudinalReadinessBanner**| `components/profile/timeline`| Aktif | Tek ölçümü olan kullanıcıya sürekli "Eksiksin" hissi veriyor. | **Pozitif İlerleme Rehberine Dönüştür** |

---

## 4. TEMEL BULGULAR VE DÖNÜŞÜM YOL HARİTASI

1. **Bilimsel Çekirdek Korunacak, Sunum İnsanileştirilecek:**
   Arka plandaki hiçbir psikometrik kural, veri bütünlüğü telemetrisi veya epistemik ayrım gevşetilmeyecektir. Yapılan işlem; geliştirici konsolu gibi duran arayüzü, kullanıcının ruhuna dokunan seçkin bir ürüne dönüştürmektir.

2. **Sayısal Puanların Yerini Anlam Alacak:**
   `3.84` puanı tek başına bir şey ifade etmez. Kullanıcı; bu puanın ölçekteki yerini ("Dengeli uca yakın"), günlük hayattaki yansımasını, getirdiği durumsal avantajları ve dikkat etmesi gereken sürtüşme noktalarını okuyacaktır.

3. **Görsel Bir Şölen İnşa Edilecek:**
   Tek tip çubuk grafikler yerine; Psikolojik Parmak İzi, 11 Alan Çarkı, Karar Terazileri, Boyut Ağları ve Yaşam Çizelgeleri ile kullanıcının profili yaşayan bir haritaya dönüşecektir.

4. **AI Sentezi Derinleştirilecek:**
   Yapay zeka sadece özet geçmeyecek; kullanıcının ampirik kanıtlarını birleştirerek 350–1500 kelimelik, gerçek içgörüler içeren, Barnum etkisi taşımayan ve kanıtlara sımsıkı bağlı derin profiller üretecektir.

---
*Bu denetim raporu, FAZ 2.22 ve sonraki tüm görselleştirme/anlamlandırma yeniden inşa çalışmalarının bağlayıcı mimari şartnamesidir.*
