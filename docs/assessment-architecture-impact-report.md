# FAZ 2.15 — Değerlendirme Mimarisi ve Envanter Eşleme Etki Raporu
## Assessment Architecture & Instrument Mapping Impact Report

Bu doküman, **FAZ 2.14 Konsolide Master Psikolojik Model**'in bilimsel temellerini somut bir **Değerlendirme Mimarisi**'ne dönüştüren FAZ 2.15 kararlarını, 4 aşamalı ürün kapısı (*Four-Way Product Gates*) denetim sonuçlarını, platform alt sistemleri üzerindeki mimari etkilerini ve mevcut üretim formlarının sınıflandırmasını detaylandırır.

---

## 1. Yönetişim İlkesi ve Sıfır Mutasyon Güvencesi

> [!IMPORTANT]
> **Sıfır Üretim Mutasyonu İlkesi**:
> - Üretim ontolojisi (`data/constructs.json`) ve veritabanı şeması bu fazda **kesinlikle değiştirilmemiştir**.
> - Canlı değerlendirme oturumları, form sürümleri veya geçmiş kullanıcı snapshot'ları üzerinde hiçbir yazma işlemi gerçekleştirilmemiştir.
> - Tüm çıktılar `data/assessment-architecture/` dizininde izole edilmiş planlama ve mimari kayıtları olarak oluşturulmuştur.

---

## 2. Dört Aşamalı Ürün Kapısı (Four-Way Product Gate) Denetim Sonuçları

PsycheAI platformunda hiçbir envanter yalnızca "popüler" veya "ünlü" olduğu için ürün sürümüne dahil edilmez. Her aday envanter 4 bağımsız kapıdan geçirilmiştir:

```
┌───────────────────────────┐    ┌───────────────────────────┐
│ KAPISI A:                 │    │ KAPISI B:                 │
│ Yapı / Psikometrik        │───▶│ Türkiye Psikometrik       │
│ Geçerlilik (Factor / CFA) │    │ Örneklem Kanıtı           │
└───────────────────────────┘    └───────────────────────────┘
              │                                │
              ▼                                ▼
┌───────────────────────────┐    ┌───────────────────────────┐
│ KAPISI C:                 │    │ KAPISI D:                 │
│ Özgün Türkçe Madde Metni  │───▶│ Ticari / SaaS Ürün        │
│ Doğrulanmış Kaynağı       │    │ Yayım ve Çoğaltma Hakkı   │
└───────────────────────────┘    └───────────────────────────┘
```

### Kapı Sonuçları ve Hazırlık Sınıflandırması:
1. **Dört Kapıyı da Koşulsuz Geçen — `PRODUCT_READY_NOW` (Hemen Üretime Açılabilir)**:
   - `inst_rses` (10 madde): Rosenberg (1965) public domain (University of Maryland); Çuhadaroğlu (1986) Türkiye standardizasyonu ve özgün madde metinleri doğrulanmış.
   - *Toplam Hemen Üretime Hazır Madde:* **10 Soru**.

2. **Bilimsel Olarak Hazır / Ticari Yayım veya Yazar İzni Koşullu — `READY_BUT_NOT_PUBLISHED` (Koşullu İzin)**:
   - `inst_hexaco_60` (60 madde, Ashton & Lee 2009): Resmi 60 maddelik kısa form; 6 geniş faktörü ölçer, faset temalarını örnekler. Akademik araştırma serbesttir; ticari SaaS yayımı için telif sahibi yazarlardan izin gerektirir.
   - `inst_gses` (10 madde, Schwarzer & Jerusalem 1995): FU Berlin / yazarlardan izin gerektirir.
   - `inst_erq` (10 madde, Gross & John 2003): Stanford / yazarlardan ticari izin gerektirir.
   - `inst_nfc_sf` (18 madde, Cacioppo et al. 1984): Akademik açık, ticari izin teyidi gerekir.
   - `inst_bscs` (13 madde, Tangney et al. 2004): Duyan et al. (2012) Türkçe validasyonu; ticari izin teyidi gerekir.
   - `inst_upps_p_sf` (20 madde, Cyders et al. 2014): UPPS-P kısa form.
   - `inst_bpnsfs` (24 madde, Chen et al. 2015): Deci & Ryan SDT Enstitüsü izni.
   - `inst_pvq_40` / `inst_pvq_21` (40 / 21 madde, Schwartz 1992, 2001): Shalom Schwartz onaylı formlar; ticari çoğaltma izni gerektirir.
   - `inst_ecr_r` (36 madde, Fraley et al. 2000): Sümer (2006) Türkçe standardizasyonu.
   - `inst_iri` (14 madde, Davis 1983 / Yıldırım 2008): Empatik Eğilim.
   - `inst_cfi` (20 madde, Dennis & Vander Wal 2010): Gülüm & Dağ (2012) Türkçe standardizasyonu.
   - `inst_ius_12` (12 madde, Carleton et al. 2007): Sarı & Dağ (2009) Türkçe standardizasyonu.
   - `inst_mlq` (10 madde, Steger et al. 2006): Akın & Taş (2015) Türkçe standardizasyonu.
   - `inst_scs_sf` (12 madde, Raes et al. 2011): Öz-Şefkat Kısa Formu.
   - `inst_grit_s` (8 madde, Duckworth & Quinn 2009): Sarıçam et al. (2016) Türkçe standardizasyonu.
   - `inst_dutch` (20 madde, De Dreu et al. 2001): Çatışma Stilleri.
   - `inst_panas` (20 madde, Watson et al. 1988): Gençöz (2000) Türkçe standardizasyonu.
   - `inst_dts` (15 madde, Simons & Gaher 2005): Sıkıntıya Dayanma.
   - *Toplam İzin Alındığında Yayına Hazır Madde:* **372 Soru** (12 Tüketici Modülü).

3. **İleri Düzey Araştırma / Opt-in — `RESEARCH_ONLY`**:
   - `inst_ipip_hexaco` (240 madde, Ashton, Lee & Goldberg 2007): 24 faset için 240 maddelik kamu malı araştırma madde havuzu. Doğrulanmamış 60 maddelik türetmeler tüketicide kullanılamaz.
   - `inst_ipip_schwartz_values` (50 madde): Kamu malı araştırma madde havuzu.
   - `inst_sd4` (28 madde, Paulhus et al. 2021): Subklinik Karanlık Dörtlü (Makyavelizm, Narsisizm, Psikopati, Sadizm). Yalnızca açık rıza ile ileri araştırma amaçlı.

4. **Kesinlikle Reddedilen / Telifli Engelli — `REJECTED` / `BLOCKED_LICENSE`**:
   - `inst_neo_pi_r` (PAR Inc. özel mülkiyeti — REJECTED)
   - `inst_mbti` (The Myers-Briggs Company — REJECTED)
   - `inst_tki` (The Myers-Briggs Company — REJECTED)
   - `inst_pvq_rr` (Shalom Schwartz ticari lisans kısıtı — REJECTED/BLOCKED)
   - `inst_tosca_3` (Senaryo tabanlı ticari kısıt — BLOCKED; PsycheAI araştırma formu planlandı)

---

## 3. Kullanıcı Yolculuğu ve Ampirik Soru Bütçesi

Yapay yuvarlama yapılmaksızın, doğrulanmış ölçek uzunluklarından türetilen gerçek soru ve süre dağılımları:

| Yolculuk Kademesi | Modül Sayısı | Doğrulanmış Envanter Sayısı | Toplam Soru Sayısı | Tahmini Süre | Oturum Formatı | Kilidi Açılan Profil Katmanı |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **First Meaningful Profile (Core)** | **4 Modül** | **5 Envanter** | **108 Soru** | **~22.5 Dakika** | Tek Oturum (Onboarding) | HEXACO Kişilik Radarı, 24 Facet Baseline, Benlik & Yetkinlik, ERQ Duygu Esnekliği, NFC Biliş İhtiyacı |
| **Expanded Profile (P1 Genişleme)** | **8 Modül** | **11 Envanter** | **265 Soru** | **~54.5 Dakika** | 2 Oturum ($22.5 + 32$ dk) | İrade & Dürtüsellik (UPPS-P), SDT Temel İhtiyaçlar, Schwartz Değer Çemberi, ECR-R Bağlanma & Empati |
| **Comprehensive Profile (Tüketici Maksimum)** | **12 Modül** | **20 Envanter** | **382 Soru** | **~79.5 Dakika** | 3–4 Oturum (Boylamsal) | Bilişsel Esneklik, Varoluşsal Anlam (Frankl), DUTCH Çatışma Pentagonu, PANAS Duygulanım Dengesi |
| **İleri Araştırma Modülü (Opsiyonel)** | **+1 Modül** | **1 Envanter** | **+28 Soru** | **+6.0 Dakika** | Ayrı Araştırma Oturumu | Subklinik Karanlık Dörtlü (SD4) |

---

## 4. Mevcut Canlı Formların Durumu ve Sınıflandırması

Veritabanında kayıtlı mevcut canlı formlar incelenmiş ve aşağıdaki şekilde sınıflandırılmıştır:

| Form Kodu | Modül | Mevcut Madde Sayısı | Bilimsel Sınıflandırma | Gelecek Eylem Planı |
| :--- | :--- | :---: | :---: | :--- |
| `form_hexaco_v1_0_0` | `MODULE_1_CORE_PERSONALITY` | 17 Madde (Ön Kalibrasyon) | **EXPAND_LATER** | Faz 3'te doğrulanmış 60 maddelik IPIP-HEXACO standardına yükseltilecek. |
| `usr_alex_mercer_demo` | Demo Kullanıcı Snapshot | 1 Snapshot | **KEEP** | Geriye dönük uyumluluk ve UI testleri için korunacak. |

---

## 5. Platform Alt Sistemlerine Etki Analizi

### A. Onboarding Arayüzü (`src/app/onboarding/page.tsx`)
- Onboarding süreci kullanıcıyı yormayacak şekilde tasarlanmıştır.
- İlk oturumda **4 modül (108 soru, ~22.5 dakika)** tamamlandığında kullanıcı derhal ilk anlamlı profiline (*First Meaningful Profile*) ulaşır.
- Kalan 8 modül kullanıcıya zorla tek oturumda dayatılmaz; kademeli rozetler ve bildirimlerle sonraki oturumlara dağıtılır.

### B. Değerlendirme Yolculuk Motoru (`src/services/assessmentJourneyService.ts`)
- `getUserAssessmentJourney` servisi, 12 tüketici modülünün öncelik sırasını ve deterministik *Next Best Action* mantığını yönetir.
- Bir modülde birden fazla envanter bulunsa dahi (`mod_self_agency`: RSES + GSES), puanlama motoru bağımsız alt ölçek puanları hesaplar; yapay birleşik toplam puan üretilmez.

### C. Birleşik Profil ve Veri Görselleştirmeleri (`src/app/profile/...`)
- Her modül doğrudan doğrulanmış bir görselleştirme bileşenine bağlanır:
  - HEXACO $\rightarrow$ 6-Eksenli Radar ve 24-Facet Whiskers
  - Schwartz Değerleri $\rightarrow$ 10-Değerlikli Dairesel Çember (Circumplex)
  - ECR-R $\rightarrow$ 2 Boyutlu Bağlanma Matrisi (Kaygı vs Kaçınma)
  - DUTCH $\rightarrow$ 5 Boyutlu Çatışma Çözme Pentagonu
  - ERQ $\rightarrow$ 4 Bölmeli Duygu Düzenleme Kadranı

### D. Profil Güvenilirlik Mimarisi ve AI İçgörü Motoru (`src/services/aiInsightService.ts`)
- DeepSeek V4 Flash için sağlanan prompt bağlamı, yalnızca tamamlanan modüllerin güvenilirlik derecelerini (`STRONG`, `MODERATE`, `PRE_CALIBRATION`) içerir.
- Henüz tamamlanmamış alanlar için AI halüsinasyon üretmez; "Bu alan henüz ölçülmemiştir" koruması uygulanır.

### E. Boylamsal Ölçüm ve Gözlemsel AI Ayrımı
- `LONGITUDINAL_OUTPUT` metrikleri (özellik kararlılığı, stres kaynaklı sapma) anket maddesi eklemez; zaman serisi üzerinden hesaplanır.
- `OBSERVATIONAL_PROMPT` metinleri nitel bağlamdır; psikometrik puanları kesinlikle manipüle edemez.

---

## 6. Sonuç ve Faz Durumu

FAZ 2.15 kapsamında geliştirilen Değerlendirme Mimarisi, PsycheAI'ın bilimsel güvenilirliğini ticari ve hukuki gerçeklerle tam olarak hizalamıştır.

**Mevcut Faz Durumu:**
`FAZ 2.15 CODE COMPLETE — AWAITING PRODUCT & SCIENTIFIC REVIEW`
