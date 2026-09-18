# PSYCHEAI — GÖRSELLEŞTİRME STRATEJİSİ VE İKON SİSTEMİ (V1)

**Belge Kimliği:** `DOC-DESIGN-VISUALIZATION-V1`  
**Tarih:** 18 Eylül 2026  
**Durum:** Onaylanmış Görselleştirme Şartnamesi  
**Hedef:** Sayısal tabloları ve kuru grafikleri, kullanıcının ruhsal anatomisini yansıtan estetik, bilimsel ve interaktif bir görsel sisteme dönüştürmek.  

---

## 1. GÖRSELLEŞTİRME ENVANTERİ VE DURUM ANALİZİ

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               GÖRSELLEŞTİRME ENVANTERİ & KARARLAR                               │
├──────────────────────────┬───────────────────┬──────────────┬───────────────────────────────────┤
│ Görselleştirme Türü      │ Mevcut Durum      │ Rolü         │ Karar & Geliştirme Yönü           │
├──────────────────────────┼───────────────────┼──────────────┼───────────────────────────────────┤
│ 1. HEXACO Radar Chart    │ Var (Recharts)    │ Temel Kişilik│ KORU & Estetik/Etiket Redesign'ı  │
│ 2. Psikolojik Parmak İzi │ Var (Çubuk liste) │ Merkezi İmza │ TAMAMEN YENİDEN TASARLA (Radial)  │
│ 3. 11 Alan Çarkı (Wheel) │ Yok               │ Alan Haritası│ SIFIRDAN İNŞA ET (Domain Wheel)   │
│ 4. Spektrum Çubukları    │ Kısmen Var        │ Boyut Dağılım│ KORU & Bipolar Genişlet           │
│ 5. Isı Haritası Matrisi  │ Var (Hücreli)     │ 91 Alt Boyut │ KORU & Renk / Anlam İyileştirmesi │
│ 6. Bıyık (Whiskers) Grf. │ Var (SVG)         │ Hata Marjı   │ BİLİMSEL DETAYA TAŞI (Kullanıcıda │
│                          │                   │              │ Spektrum Çubuğuna Dönüştür)       │
│ 7. Sinerji & Gerilim Ağı │ Yok (Metin kutusu)│ Dinamikler   │ SIFIRDAN İNŞA ET (İnteraktif Ağ)  │
│ 8. Denge Terazisi        │ Yok               │ Zıtlıklar    │ SIFIRDAN İNŞA ET (Tension Scale)  │
│ 9. Karar Kadranı (2x2)   │ Yok               │ Karar Stili  │ SIFIRDAN İNŞA ET (Quadrant Chart) │
│ 10. Zaman Trajektorisi   │ Var (Basit çizgi) │ Boylamsal    │ ZENGİNLEŞTİR (Yaşam Zaman Tüneli) │
│ 11. Kapsam Göstergesi    │ Var (Düz bar)     │ İlerleme     │ KORU & Alan Parıltısıyla Birleştir│
│ 12. Bağlam Karşılaştırma │ Yok               │ Çoklu Ortam  │ SIFIRDAN İNŞA ET (Multi-radar)    │
└──────────────────────────┴───────────────────┴──────────────┴───────────────────────────────────┘
```

---

## 2. GÖRSELLEŞTİRME ARKETİPLERİ VE MİMARİ TASARIMLARI

### 2.1. Merkezi Psikolojik Parmak İzi (Psychological Fingerprint)
- **Konsept:** Kullanıcının ölçülen tüm boyutlarından beslenen, ona özel ve taklit edilemez bir görsel imza.
- **Tasarım:** 
  - Konsantrik dairelerden ve açısal sektörlerden oluşan modern polar/radial poligon.
  - Ölçülen her boyut merkeze olan uzaklığı ve renk tonunu belirler.
  - Ölçülmemiş alanlar saydam kılavuz çizgileriyle gösterilir (keşif potansiyelini simgeler).
- **Kullanım Yeri:** Profilin ve Giriş Sonrası Genel Bakışın (`/overview`) odak noktası.

### 2.2. 11 Alan Çarkı (Domain Wheel Explorer)
- **Konsept:** Master Modelin 11 ana alanını (Kişilik, Benlik, Duygu, Biliş, Motivasyon, vb.) bir saat kadranı gibi çevreleyen interaktif çark.
- **Tasarım:**
  - 11 sektörlü radyal donut dilimleri.
  - Her dilim kendi alanının ölçüm doluluk oranına göre renklenir.
  - Dilime tıklandığında çark o yöne döner ve alttaki detay paneli açılır.
- **Kullanım Yeri:** `Bölüm 2: Psikolojik Profil Haritam`.

### 2.3. Yatay İki Kutuplu Spektrum Çubukları (Bipolar Facet Bars)
- **Konsept:** Boyutları 1–5 sayısal cetveli yerine, iki anlamlı davranışsal kutup arasında konumlandırma.
- **Tasarım:**
  - Sol kutup (örn: *İçsel Sakinlik*) <———— [●] ————> Sağ kutup (örn: *Dışsal Canlılık*).
  - Orta bölge "Dengeli Duruş" olarak adlandırılır.
  - Kesinlikle kırmızı/yeşil (iyi/kötü) renkleri kullanılmaz; sakin mor, indîgo, teal ve slate tonları kullanılır.
- **Kullanım Yeri:** Değerlendirme Sonuçları ve Alt Boyut Detayları.

### 2.4. İnteraktif Zıtlık Terazisi (Tension Equilibrium Slider)
- **Konsept:** Birbirine zıt çalışan iki boyutu (örn: *Yüksek Analitik Şüphecilik* vs *Yüksek İnsan Güveni*) mekanik bir terazi üzerinde göstermek.
- **Tasarım:**
  - Kullanıcı hangi durumlarda hangi tarafın ağır bastığını interaktif olarak gözlemleyebilir.
  - Denge noktasında "Esneklik Alanı" vurgulanır.
- **Kullanım Yeri:** `Bölüm 11: Gerilimler ve Denge Noktaları`.

### 2.5. Karar ve Davranış Kadranı (2x2 Quadrant Chart)
- **Konsept:** İki temel eksenin kesişiminde kullanıcının yerini göstermek (örn: X ekseni: *Analitik vs Sezgisel Karar*; Y ekseni: *Hızlı Eylem vs Derinlemesine Planlama*).
- **Tasarım:** 4 çeyrekli koordinat düzlemi (Stratejik Mimar, Sezgisel Öncü, Titiz Uygulayıcı, Çevik Kâşif).
- **Kullanım Yeri:** `Bölüm 6: Biliş, Düşünme ve Karar Verme`.

### 2.6. Zaman İçinde Ben: Yaşam Yolculuğu Çizelgesi (Longitudinal Journey Line)
- **Konsept:** Zamana yayılan ölçümleri soğuk istatistik çizgisi yerine, kullanıcının kişisel gelişim yolculuğu olarak görselleştirmek.
- **Tasarım:**
  - Yatay zaman aksı üzerinde ölçüm durakları (Epoch 1, Epoch 2...).
  - Kararlı kalan özellikler "Sarsılmaz Temeller" şeridinde düz çizgi olarak akar.
  - Dalgalanan özellikler "Bağlamsal Esneklikler" olarak yumuşak bezier eğrileriyle gösterilir.
- **Kullanım Yeri:** `Bölüm 13: Zaman İçinde Ben`.

---

## 3. KESİN BİLİMSEL GÖRSELLEŞTİRME KURALLARI

Görselleştirme ne kadar çekici olursa olsun, şu bilimsel güvenlik kırmızı çizgileri asla aşılmayacaktır:

1. **YALANCI YÜZDELİK (FAKE PERCENTILE) YASAĞI:**
   Temsili Türk toplumu norm çalışması tamamlanana kadar hiçbir grafikte `Toplumun %85'inden yüksek` gibi yüzdelik dilim aksı çizilemez.
2. **SAHTE GÜVEN YÜZDESİ (FAKE CONFIDENCE %) YASAĞI:**
   Ölçüm hassasiyeti `87% Güvenilirlik` gibi tekil bir yüzdeye indirgenemez. Çoklu bileşenli nitel kanıt göstergesi (Yüksek/Orta/Başlangıç) kullanılır.
3. **KLİNİK NORMAL/ANORMAL SINIRI ÇİZİLEMEZ:**
   Grafiklerde "patolojik sınır", "klinik risk eşiği", "normal alan" gibi ayrımlar kesinlikle bulunamaz.
4. **YAPAY ZEKA GRAFİK KOORDİNATI ÜRETEMEZ:**
   Tüm grafik koordinatları deterministik psikometrik motor tarafından üretilir. LLM hiçbir görselleştirmenin verisini değiştiremez.

---

## 4. BÜTÜNCÜL LUCIDE İKON EŞLEŞTİRME SİSTEMİ

Rastgele ikon kullanımını önlemek amacıyla 11 alan, 37 boyut ve 91 alt boyut ailesi için bağlayıcı Lucide ikon haritası:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          LUCIDE İKON REHBERİ                                │
├──────────────────────────────────────────┬──────────────────────────────────┤
│ Psikolojik Aile / Boyut Grubu            │ Atanan Lucide İkonu              │
├──────────────────────────────────────────┼──────────────────────────────────┤
│ 1. Kişilik & Mizaç (Genel)               │ Brain                            │
│    - Dürüstlük & Alçakgönüllülük         │ ShieldCheck / Scale              │
│    - Duygusallık & Hassasiyet            │ HeartPulse / Waves               │
│    - Dışadönüklük & Sosyal Enerji        │ Users / Sparkles                 │
│    - Geçimlilik & Sabır                  │ HeartHandshake / Smile           │
│    - Sorumluluk & Düzen                  │ ListChecks / SlidersHorizontal   │
│    - Deneyime Açıklık                    │ Compass / Lightbulb              │
│ 2. Benlik Sistemi & Öz-Düzenleme         │ UserCheck / Zap                  │
│    - Öz-Değer & Öz-Saygı                 │ Sparkles / Award                 │
│    - Öz-Yeterlik & Başarı İnancı         │ Target / Trophy                  │
│    - İçsel Kontrol Odağı                 │ Anchor / Compass                 │
│    - Dürtü Kontrolü & Disiplin           │ Gauge / SlidersHorizontal        │
│ 3. Duygu Düzenleme & Dayanıklılık        │ ShieldAlert / RefreshCw          │
│    - Yeniden Çerçeveleme                 │ Eye / FlipHorizontal             │
│    - Duygu Farkındalığı                  │ HeartHandshake / Activity        │
│ 4. Biliş, Mantık & Karar Verme           │ GitBranch / Split                │
│    - Analitik Düşünme                    │ Binary / Cpu                     │
│    - Sezgisel Zekâ                       │ Wand2 / Sparkles                 │
│    - Belirsizlik Toleransı               │ HelpCircle / Shuffle             │
│ 5. Yaratıcılık, Merak & Estetik          │ Lightbulb / Palette              │
│    - Entelektüel Merak                   │ Search / BookOpen                │
│    - Yaratıcı İnovasyon                  │ Sparkles / Flame                 │
│ 6. Motivasyon, Hedefler & Değerler       │ Flame / Milestone                │
│    - İçsel Motivasyon                    │ Sun / Zap                        │
│    - Anlam ve Yaşam Amacı                │ Waypoints / Compass              │
│ 7. İlişkiler & Sosyal Bağlar             │ UsersRound / MessageCircle       │
│    - Sosyal Cesaret & Girişkenlik        │ MessageSquarePlus / Megaphone    │
│    - Empati ve Şefkat                    │ Heart / HandHeart                │
│    - Sınır Koyma                         │ Shield / Ban                     │
│ 8. Psikolojik Sağlamlık & İyi Oluş       │ Activity / SmilePlus             │
│    - Toparlanma Gücü (Resilience)        │ ShieldPlus / Mountain            │
│    - Yaşam Enerjisi ve Canlılık          │ BatteryCharging / SunMedium      │
│ 9. Dinamikler, Gerilimler & Sinerjiler   │ Scale / Shuffle / Zap            │
│ 10. Zaman Takibi & Boylamsal Gelişim     │ Clock / History / Calendar       │
│ 11. Yansımalar ve Günlük                 │ PenLine / BookText               │
│ 12. Bilimsel Kanıt & Epistemik Güvence   │ FileCheck2 / Lock                │
└──────────────────────────────────────────┴──────────────────────────────────┘
```
