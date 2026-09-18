# PSYCHEAI — KAMUSAL SİTE, KİMLİK DOĞRULAMA VE ERİŞİM YENİDEN TASARIMI (V1)

**Belge Kimliği:** `DOC-DESIGN-PUBLIC-AUTH-V1`  
**Tarih:** 18 Eylül 2026  
**Durum:** Onaylanmış Mimari Şartname  
**Hedef:** Ziyaretçiyi karşılayan etkileyici bir Landing Page inşa etmek, kimlik doğrulama ekranlarını onboarding vitrinine dönüştürmek ve rota koruma (middleware) açıklarını kapatmak.  

---

## 1. KAMUSAL AÇILIŞ SAYFASI (PUBLIC LANDING PAGE — `/`)

Şu anda `/` rotası doğrudan `/overview`a ve ardından `/login`e yönlenmektedir. Bu durum ziyaretçilerin platformun değerini anlamadan sayfadan çıkmasına neden olmaktadır.

### 1.1. Yeni Açılış Sayfası Mimarisi

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. HERO BÖLÜMÜ (Ana Manşet & CTA)                                           │
│ Manşet: "Kendini birkaç etiketle değil, çok boyutlu bir psikolojik          │
│ haritayla keşfet."                                                          │
│ Alt Metin: 91 ampirik boyut, 11 yaşam alanı ve 10 büyük kuramcı merceğiyle  │
│ Türkiye'nin en kapsamlı bilimsel öz-farkındalık platformu.                 │
│ CTA'lar: [ Ücretsiz Profilini Başlat → ]   [ Giriş Yap ]                    │
│ Görsel: Canlı İnteraktif Radar & Psikolojik Parmak İzi Önizlemesi           │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. PSYCHEAI NASIL ÇALIŞIR? (3 Adımlı Yolculuk)                              │
│ • Adım 1: Yapılandırılmış Bilimsel Değerlendirmeleri Tamamla                │
│ • Adım 2: 91 Boyutlu Dinamik Profil Haritanın Oluşmasını İzle               │
│ • Adım 3: Kuramlar Konseyi ve Zaman Çizgisiyle Derinleş                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. 11 YAŞAM ALANI & 91 BOYUT ATLASI (İnteraktif Alan Kartları)              │
│ Kişilik, Benlik, Duygu, Biliş, Motivasyon, İlişkiler, Dayanıklılık...       │
├─────────────────────────────────────────────────────────────────────────────┤
│ 4. YAPAY ZEKÂNIN ROLÜ (Etik ve Güvenilir Sentez)                            │
│ "AI puan üretmez; deterministik bilimsel ölçümlerinizi şefkatli bir Türkçe  │
│ dille anlamlandırır ve size ayna tutar."                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ 5. BİLİMSEL SAĞLAMLIK VE EPİSTEMİK AYRIM                                    │
│ Dondurulmuş form sürümleri, ampirik güvenilirlik ve tanı koymayan yaklaşım. │
├─────────────────────────────────────────────────────────────────────────────┤
│ 6. KURAMLAR KONSEYİ ÖNİZLEMESİ (10 Büyük Deha)                              │
│ Freud, Jung, Adler, Rogers, Frankl, Maslow'un profilinizi okuma biçimleri.  │
├─────────────────────────────────────────────────────────────────────────────┤
│ 7. GİZLİLİK, GÜVENLİK VE VERİ HAKLARI                                       │
│ AES-256 şifreleme, sıfır üçüncü taraf veri paylaşımı, tam kullanıcı kontrolü│
├─────────────────────────────────────────────────────────────────────────────┤
│ 8. DÖNÜŞÜM ÇAĞRISI (Final CTA & Footer)                                     │
│ "Kendi psikolojik haritanı çizmeye bugün başla." [ Ücretsiz Başla ]         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. ROTA ERİŞİM KONTROLÜ VE MIDDLEWARE GÜVENLİK MATRİSİ

Mevcut `src/middleware.ts` denetlendiğinde; `/assessments` (çoğul), `/journal` ve `/theory-council` rotalarının `isProtectedAppRoute` listesinde eksik olduğu tespit edilmiştir. Bu açık DERHAL kapatılacaktır.

### 2.1. Rota Erişim İzinleri Matrisi

```
┌────────────────────────────────┬──────────────────────────┬─────────────────────────────┐
│ Rota                           │ Erişim Tipi              │ Kimliksiz Kullanıcı Aksiyonu│
├────────────────────────────────┼──────────────────────────┼─────────────────────────────┤
│ /                              │ KAMUSAL (Public)         │ Landing Page gösterilir     │
│ /science                       │ KAMUSAL (Public)         │ Bilimsel Metodoloji sayfası │
│ /how-it-works                  │ KAMUSAL (Public)         │ Nasıl Çalışır sayfası       │
│ /privacy & /terms              │ KAMUSAL (Public)         │ Hukuki ve Gizlilik metinleri│
│ /login & /register             │ MİSAFİR (Guest Only)     │ Form (Giriş yapılmışsa      │
│ /forgot-password               │ MİSAFİR (Guest Only)     │ -> /overview'a yönlenir)    │
│ /overview                      │ KORUMALI (Auth Only)     │ -> /login'e yönlendirilir   │
│ /assessments                   │ KORUMALI (Auth Only)     │ -> /login'e yönlendirilir   │
│ /assessment                    │ KORUMALI (Auth Only)     │ -> /login'e yönlendirilir   │
│ /assessments/results/*         │ KORUMALI (Auth Only)     │ -> /login'e yönlendirilir   │
│ /profile & /profile/*          │ KORUMALI (Auth Only)     │ -> /login'e yönlendirilir   │
│ /insights & /insights/*        │ KORUMALI (Auth Only)     │ -> /login'e yönlendirilir   │
│ /journal & /journal/*          │ KORUMALI (Auth Only)     │ -> /login'e yönlendirilir   │
│ /theory-council & /*           │ KORUMALI (Auth Only)     │ -> /login'e yönlendirilir   │
│ /admin & /admin/*              │ YÖNETİCİ (Admin Only)    │ -> 404 / /login             │
│ /research & /research/*        │ ARAŞTIRMACI (ResearchKey)│ -> /research/login          │
└────────────────────────────────┴──────────────────────────┴─────────────────────────────┘
```

---

## 3. GİRİŞ VE KAYIT EKRANI YENİDEN TASARIMI (50/50 ONBOARDING SPLIT)

Masaüstünde tek sütunlu gri form yerine, modern SaaS standartlarında iki sütunlu bölünmüş düzen uygulanacaktır:

### 3.1. Sol Sütun: Ürün Değer Vitrini (Brand Showcase)
- **Arka Plan:** Sakin koyu indigo/lacivert degrade.
- **Vitrindeki 3 Ana Söz:**
  1. *"91 Alt Boyutta Bütüncül Profil:"* Yüzeysel kişilik testlerinin ötesine geçin.
  2. *"10 Büyük Psikoloji Ekolüyle Keşif:"* Profilinizi Freud, Jung ve Rogers'ın gözünden inceleyin.
  3. *"Zaman İçindeki Gelişimini İzle:"* Dönemler arası kararlılık ve değişim dinamiklerinizi takip edin.
- **Görsel Element:** Canlı radar ve psikolojik parmak izi grafik animasyonu.

### 3.2. Sağ Sütun: Akıcı Form Alanı
- Tek tıkla Google ile Giriş / Kayıt.
- E-posta ve şifre kutuları (temiz, odaklanmış tipografi).
- Açık ve net güvenlik garantisi: *"Verileriniz şifrelenir ve asla reklam amaçlı paylaşılmaz."*

---

## 4. GİRİŞ SONRASI KARŞILAMA EKRANI (`/overview`) YENİDEN TASARIMI

Kullanıcı giriş yaptığında bu sayfa tek bir soruya odaklanacaktır:  
**"Şimdi ne yapmalıyım ve profilimde en son ne oldu?"**

### 4.1. Bölüm Düzeni
1. **Hoş Geldin & Kişisel Durum:**  
   *"İyi günler, [İsim]. Profilin şu ana kadar 11 alanın 6'sını kapsıyor."*
2. **Dominant Sıradaki Adım Kartı (Hero Action):**  
   *"Sıradaki Önerilen Değerlendirme: Düşünme ve Karar Stilleri Modülü (~8 dk)"*  
   Neden önerildiği: *"Bu test, profilindeki analitik ve sezgisel dengeyi haritaya ekleyecek."*
3. **En Son Ölçümden Çarpıcı İçgörü:**  
   Son tamamlanan testten çıkarılan en taze güçlü yön rozeti.
4. **Mini Profil Haritası & Canlı Parmak İzi:**  
   Tek tıkla tam profile (`/profile`) geçiş sağlayan interaktif önizleme.
5. **Günlük & Yansıma Hatırlatıcısı:**  
   *"Bu hafta üzerine düşünebileceğin soru: ..."*

---

## 5. SOL MENÜ (SIDEBAR) VE GEZİNME HİYERARŞİSİ PLANI

Sol menüdeki dağınıklık 3 ana kümede toplanacaktır:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PSYCHEAI [BİLİMSEL]                                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ 🧭 ANA GEZİNME                                                              │
│ • Genel Bakış (/overview)                                                   │
│ • Psikolojik Profilim (/profile) [Tüm 15 Bölümün Ana Evi]                   │
│ • Değerlendirme Kataloğu (/assessments)                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 💡 DERİNLEŞME & PERSPEKTİFLER                                               │
│ • Kuramlar Konseyi (/theory-council)                                        │
│ • Yansımalarım & Günlük (/journal)                                          │
│ • Zaman Çizelgesi (/profile/timeline)                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ 🔬 ŞEFFAFLIK & AYARLAR                                                      │
│ • Bilimsel Metodoloji (/science)                                            │
│ • Hesap & Gizlilik Ayarları                                                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

Menüdeki gereksiz tekil sayfalar (`/insights/context`, `/insights/patterns`, `/profile/personality`, `/profile/heatmap`) bağımsız ölü linkler olmaktan çıkarılıp, `/profile` içerisindeki ilgili 15 bölümün altına entegre edilecektir.
