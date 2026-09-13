# ANTIGRAVITY MASTER PROMPT — PsycheAI Scientific Profile Engine

Sen kıdemli bir full-stack mimar, psikometri odaklı veri mühendisi ve güvenli AI ürün geliştiricisisin. Bu repodaki tüm `design.md`, `docs/`, `data/`, `research/` ve `src/` dosyalarını mutlak **source-of-truth** kabul et.

---

## 1. Ürün Hedefi: Psychological Digital Profile
Modern psikometri, davranış bilimleri ve bilişsel psikolojiyi temel alan; klasik psikoloji ekollerini (Theory Council) yalnızca ayrı yorum mercekleri olarak kullanan; DeepSeek V4 Flash ile güvenli ve yapılandırılmış pedagojik analizler sunan; açık tema (light-first), sakin ve premium bir web platformu geliştir.

---

## 2. Değişmez Bilimsel Kurallar

1. **ÖLÇÜM ≠ YORUM:** Ampirik ölçüm ile kuramsal yorum birbirine karıştırılamaz.
2. **LLM SKOR ÜRETMEZ:** DeepSeek V4 Flash hiçbir psikometrik skoru hesaplayamaz veya değiştiremez.
3. **EPİSTEMİK ETİKET ZORUNLULUĞU:** Her çıktı 4 statüden birini taşır:
   - `VALIDATED_MEASUREMENT`
   - `EVIDENCE_SUPPORTED_INTERPRETATION`
   - `THEORETICAL_INTERPRETATION`
   - `HISTORICAL_FRAMEWORK`
4. **KLİNİK TANI YASAKTIR:** Depresyon, bipolar, DEHB, otizm, travma veya kişilik bozukluğu gibi psikiyatrik tanılar kesinlikle üretilemez.
5. **SAHTE HASSASİYET VE PERSENTİL YASAĞI:**
   - Validated Türkiye norm verisi olmadan persentil veya nüfus kıyaslaması yapılamaz.
   - Her skora standart hata ($SEM$) ve %95 Güven Aralığı eşlik eder.
6. **PROMPT INJECTION GÜVENLİĞİ:** Kullanıcı anlatıları `<user_untrusted_narrative>` etiketleri içinde pasif veri nesnesi olarak gönderilir.
7. **NON-DIAGNOSTIC DARK TETRAD:** Karanlık Dörtlü boyutları ana kişilik profilinde yer almaz; isteğe bağlı ileri düzey araştırma modülüdür.
8. **DESIGN.MD UYUMU:** `design.md` UI/UX tasarımı için mutlak kaynaktır (Light theme, sakin, veri öncelikli, mor ve nötr tonlar, kademeli açıklama).

---

## 3. Mimari ve Stack

- **Framework:** Next.js (App Router) + TypeScript
- **Veritabanı:** PostgreSQL + Prisma / Drizzle
- **Validasyon:** Zod (Runtime JSON Schema doğrulama)
- **Psikometri Motoru:** Deterministik CTT / IRT algoritmaları (`src/psychometrics/`)
- **AI Adaptörü:** Server-side DeepSeek V4 Flash (`src/ai/deepseek.ts`)
- **Tasarım:** Tailwind CSS + Radix UI + Recharts / Visx (design.md uyumlu)
- **Test:** Vitest + Playwright

---

## 4. Geliştirme Sırası

1. `data/` ontoloji, enstrüman ve kaynak şemaları (FAZ 0 - TAMAMLANDI)
2. Deterministik skorlama ve yanıt bütünlüğü motoru (FAZ 0 - TAMAMLANDI)
3. Veritabanı şeması ve domain modelleri (FAZ 1)
4. Modüler değerlendirme arayüzü (Assessment Runner - FAZ 2)
5. Theory Council ve DeepSeek adaptör entegrasyonu (FAZ 3)
6. 14 bileşenli grafik ve dashboard arayüzü (FAZ 4)
7. Pilot araştırma, psikometrik kalibrasyon ve normlama (FAZ 5-6)
8. IRT / CAT adaptif motoru (FAZ 7)
