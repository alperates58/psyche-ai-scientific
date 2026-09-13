# 04 — Psikometrik Doğrulama Yol Haritası (Validation Roadmap)

PsycheAI platformu, ampirik doğrulama süreçleri tamamlanana kadar **araştırma ve ön-kalibrasyon (provisional/research)** statüsündedir. Aşağıdaki 22 aşamalı doğrulama programı, sistemin üretim seviyesinde bilimsel güvenilirliğe ulaşması için gereken eksiksiz metodolojik rehberdir.

> [!NOTE]
> Uyum indeksleri (CFI, RMSEA, SRMR) dogmatik ve mutlak yasalar değildir; model karmaşıklığı, serbestlik derecesi ve örneklem büyüklüğü bağlamında çok kriterli olarak değerlendirilmelidir (Marsh, Hau & Wen, 2004).

---

## 22 Aşamalı Doğrulama Programı

```
FAZ I: KAVRAMSAL VE İÇERİK MODELLEME
├── 1. Construct Tanımlama (Operasyonel ve kavramsal sınırların netleştirilmesi)
├── 2. Literatür Haritalama (Source & Instrument Registry entegrasyonu)
├── 3. Uzman İncelemesi (En az 7 psikometrist/uzman ile İçerik Geçerlik İndeksi - CVI)
└── 4. Madde Bankası Üretimi (Teliften arındırılmış, çok modlu madde yazımı)

FAZ II: NİTEL VE ÖN TEST DOĞRULAMASI
├── 5. Bilişsel Görüşmeler (Cognitive Interviews / Sesli Düşünme: N = 30-50)
└── 6. Küçük Ön Test (Small Pretest: N = 100; anlaşılırlık ve süre kalibrasyonu)

FAZ III: PİLOT ÇALIŞMA VE BOYUTLULUK
├── 7. Pilot Çalışma (N = 600 - 1000 heterojen örneklem)
├── 8. Madde Analizi (Madde-toplam korelasyonu, varyans ve uç kategori analizleri)
├── 9. Açımlayıcı Faktör Analizi (EFA - Polychoric korelasyon ve Parallel Analysis)
└── 10. Doğrulayıcı Faktör Analizi (CFA - Bağımsız örneklemde alternatif yapısal modeller)

FAZ IV: GÜVENİRLİK VE GEÇERLİK ANALİZLERİ
├── 11. Güvenirlik Testleri (McDonald Omega Hiyerarşik ve Cronbach Alfa)
├── 12. Test-Tekrar Test Kararlılığı (2-4 hafta arayla N = 200 örneklemde kararlılık)
├── 13. Yakınsak Geçerlik (Convergent Validity - AVE > 0.50)
├── 14. Ayrışan Geçerlik (Discriminant Validity - HTMT < 0.85 ve Fornell-Larcker)
└── 15. Kriter ve Yordama Geçerliği (İş performansı, iyi oluş, ilişki doyumu kriterleri)

FAZ V: ADALET, DEĞİŞMEZLİK VE NORMLAMA
├── 16. Ölçüm Değişmezliği (Measurement Invariance - Yapısal, Metrik, Skalar, Katı)
├── 17. Madde Yanlılığı Taraması (Differential Item Functioning - DIF: Cinsiyet/Yaş/Bölge)
└── 18. Türkiye Standardizasyonu ve Normlama (Temsili tabakalı örneklem: N = 2000+)

FAZ VI: MADDE TEPKİ KURAMI VE ADAPTİF UYGULAMA
├── 19. IRT Kalibrasyonu (Polytomous Graded Response Model - GRM parametre kestirimi)
├── 20. CAT Simülasyonu (Monte Carlo simülasyonları ile durdurma ve maruziyet testleri)
├── 21. CAT Canlı Yayını (Standart formdan bilgisayarlı uyarlamalı teste geçiş)
└── 22. Sürekli İzleme ve Madde Eskitme (Post-Deployment Quality Audit)
```

---

## Model Uyum Kriterleri ve İstatistiksel Değerlendirme

| Analiz Türü | İncelenen İstatistik | Kabul Edilebilir Aralık | Mükemmel Aralık |
|---|---|---|---|
| **CFA Model Uyumu** | RMSEA | $\le 0.08$ | $\le 0.05$ |
| **CFA Model Uyumu** | CFI / TLI | $\ge 0.90$ | $\ge 0.95$ |
| **CFA Model Uyumu** | SRMR | $\le 0.08$ | $\le 0.05$ |
| **İç Tutarlık** | McDonald Omega ($\omega$) | $\ge 0.70$ | $\ge 0.82$ |
| **Madde Ayırt Ediciliği** | Corrected Item-Total ($r_{it}$) | $\ge 0.30$ | $\ge 0.45$ |
| **Ayrışan Geçerlik** | HTMT Oranı | $< 0.90$ | $< 0.85$ |
| **Ölçüm Değişmezliği** | $\Delta \text{CFI}$ (Grup Değişimi) | $\le 0.010$ | $\le 0.005$ |
| **IRT Ayırt Edicilik ($a$)** | Slope Parameter ($a$) | $\ge 0.65$ | $1.35 - 2.50$ |
