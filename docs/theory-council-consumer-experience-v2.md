# PsycheAI Theory Council Consumer Experience (v2.0)
**10 Kuram Merceği, Epistemik Ayrım, İnteraktif Diyalog ve Kanıt Çekmecesi**

---

## 1. Kuramsal Konsil Vizyonu

Kuramsal Konsil, kullanıcının deterministik olarak ölçülmüş psikolojik profilini (11 Alan, 37 Yapı, 91 Alt Boyut) psikoloji tarihinin en köklü 10 kuramsal okulu üzerinden derinleştiren felsefi ve kuramsal bir aynadır.

Kuramsal Konsil bir psikoterapi veya tanı aracı değildir; **kendini çok boyutlu anlama ve felsefi yansıtma platformudur.**

---

## 2. 10 Yetkili Kuram Merceği (Authoritative Lenses)

Kayıtlı ve değişmez 10 ekol:

1. **Sigmund Freud (Psikanalitik Mercek):**
   - *Odak:* Bilinçdışı dürtüler, savunma mekanizmaları, id-ego-süperego dengesi ve bastırılan arzular.
2. **Carl Gustav Jung (Analitik Psikoloji Merceği):**
   - *Odak:* Gölge arketipi, persona, bireyleşme süreci, animus/anima ve içe/dışadönüklük dengesi.
3. **Alfred Adler (Bireysel Psikoloji Merceği):**
   - *Odak:* Aşağılık duygusunun telafisi, üstünlük çabası, toplumsal ilgi ve yaşam tarzı.
4. **Carl Rogers (Kişi Merkezli Hümanist Mercek):**
   - *Odak:* Kendini gerçekleştirme eğilimi, gerçek ve ideal benlik tutarlılığı, koşulsuz öz-kabul.
5. **Abraham Maslow (Bütüncül Dinamik İhtiyaçlar Merceği):**
   - *Odak:* İhtiyaçlar hiyerarşisi, doruk deneyimler, B-değerleri ve kendini aşma.
6. **B.F. Skinner (Radikal Davranışçılık Merceği):**
   - *Odak:* Pekiştirme geçmişi, çevresel ipuçları, edimsel koşullanma ve davranış örüntüleri.
7. **William James (Fonksiyonel Pragmatizm Merceği):**
   - *Odak:* Bilinç akışı, alışkanlık mimarisi, ampirik benlikler ve pragmatik işlevsellik.
8. **Gestalt Psikolojisi (Fritz Perls & Bütüncül Alan Merceği):**
   - *Odak:* Burada ve şimdi farkındalığı, temas sınırı, tamamlanmamış işler ve bütünsel figür-zemin algısı.
9. **Viktor Frankl (Logoterapi & Varoluşçu Mercek):**
   - *Odak:* Anlam istenci, trajik iyimserlik, varoluşsal boşluk ve sorumluluk bilinci.
10. **Aaron T. Beck (Bilişsel Ekol Merceği):**
    - *Odak:* Otomatik düşünceler, bilişsel çarpıtmalar, temel inançlar ve bilişsel üçlü.

---

## 3. Epistemik Ayrım ve Kanıt Çekmecesi (Evidence Grounding)

Tüm kuram analizlerinde ve diyalog mesajlarında bilimsel ayrım 4 renk kodlu rozetle korunur:
- **Ölçülen Psikometrik Veri:** Testlerden gelen kanıtlanmış alt boyut puanları (`sincerity`, `locus_of_control` vb. yerine Türkçe isimlerle sunulur).
- **Kuramsal Yorumlama:** Düşünürün kavramsal çerçevesinden bakış.
- **Kullanıcı Bildirimi / Bağlam:** Kullanıcının eklediği notlar.
- **Yansıtıcı Soru & Hipotez:** Düşünmeye sevk eden açık uçlu sorular.

### "Bu Yorum Neye Dayanıyor?" Çekmecesi:
Her kuramsal değerlendirmenin altında yer alan katlanabilir kanıt çekmecesi (`TheoryEvidenceDrawer.tsx`), bu yorumun dayandığı alt boyutları, puanlarını ve 5-bantlı ölçek konumlarını (`Yüksek uca yakın`, `Orta bölge` vb.) şeffaflıkla listeler.

---

## 4. Kuramsal Karşılaştırma Masası (Theory Comparison Desk)

`/theory-council/compare` sayfasında kullanıcı:
1. 2 veya 3 farklı kuramı seçer (örn. *Freud vs Rogers* veya *Beck vs Frankl*).
2. Odak bir tema belirler (örn. *Duygu Düzenleme ve Savunma Biçimleri*).
3. Sistem deterministik profil kanıt setini iki ekol açısından yan yana analiz eder; **Uzlaşma Noktaları (Consensus)**, **Ayrışma Noktaları (Divergence)** ve **Bütünleştirici Sentez (Integrative Synthesis)** sunar.
