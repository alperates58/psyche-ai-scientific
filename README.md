# PsycheAI Scientific Profile Engine

Bilimsel psikometri + klasik psikoloji ekollerinin yorum çerçeveleri (Theory Council) + DeepSeek V4 Flash güvenli sentez katmanı ile kapsamlı, boylamsal ve çok boyutlu **Psychological Digital Profile (Psikolojik Dijital Profil)** platformu.

> **Durum:** FAZ 1 (PostgreSQL 16, Prisma ORM, Dondurulmuş Form Sürümleri, Yanıt Denetim Geçmişi, Ön Kalibrasyon Skorlama, Boylamsal Profil Snapshotları ve Testler) Tamamlandı.
> **Tasarım Kaynağı:** Root dizinindeki `design.md` UI/UX mimarisinin değişmez source-of-truth belgesidir.

---

## Temel Bilimsel İlkeler

1. **ÖLÇÜM ≠ YORUM:** Modern psikometri ile puanlanan latent özellikler ile kuramsal yaklaşımların getirdiği açıklamalar sistemin hiçbir yerinde birbirine karıştırılamaz.
2. **LLM SKOR ÜRETMEZ:** Psikometrik skorlar deterministik algoritmalarla hesaplanır. Puanlama sunucu tarafında atomik transaction'lar içinde çalışır; istemci skor enjekte edemez.
3. **EPİSTEMİK STATÜ ETİKETLERİ:** Her çıktı 4 sınıftan birine aittir:
   - `VALIDATED_MEASUREMENT` (Ölçülen Boyut)
   - `EVIDENCE_SUPPORTED_INTERPRETATION` (Kanıt Destekli Çıkarım)
   - `THEORETICAL_INTERPRETATION` (Kuramsal Mercek)
   - `HISTORICAL_FRAMEWORK` (Tarihsel Perspektif)
4. **KLİNİK TANI KOYMAZ:** Depresyon, bipolar, DEHB, otizm veya kişilik bozukluğu gibi psikiyatrik tanılar kesinlikle üretilmez. Non-diagnostic profilleme platformudur.
5. **SAHTE HASSASİYET YASAKTIR (ÖN KALİBRASYON):** Nüfus normları toplanmadan önce (`NormVersion.status = 'UNAVAILABLE'`), standart hata ve %95 güven aralıkları kesinlikle `NULL` değerindedir. Türkiye popülasyon persentili (yüzdelik) veya T-skoru üretilmez.

---

## Paket ve Mimari İçeriği

- `design.md` — UI/UX tasarım source-of-truth (Light-first, sakin, premium SaaS).
- `prisma/schema.prisma` — PostgreSQL ilişkisel şeması (Ontoloji, Lisanslı Envanterler, Soru Bankası, Dondurulmuş Formlar, Oturumlar, Yanıt Revizyonları, Telemetri, Snapshotlar).
- `prisma/seed.ts` — `constructs.json` kaynaklı dinamik ontoloji seed betiği (9 Domain, 30 Construct, 84 Facet).
- `data/constructs.json` & `data/constructs.csv` — Kaynak ontoloji verisi.
- `data/instrument-registry.json` — 27 psikometrik aracın telif, lisans ve kullanım kararları kataloğu.
- `data/source-registry.json` — Hakemli akademik literatür, DOI ve kanıt düzeyi kayıtları.
- `data/theory-lenses.json` — 8 kuramsal merceğin kavram ve sınır tanımları.
- `docs/11-database-architecture.md` — Veritabanı mimarisi ve Mermaid ER diyagramı.
- `docs/12-assessment-runtime.md` — Değerlendirme çalışma zamanı ve telemetri motoru.
- `src/services/` — `assessmentService`, `responseService`, `integrityService`, `scoringService`, `profileService`.
- `src/actions/assessment.ts` — Zod `.strict()` doğrulamalı Next.js Server Actions.
- `tests/` — Skorlama, güvenlik, revizyon denetimi ve yanıt bütünlüğü Vitest test paketi.

---

## Geliştirme, Veritabanı ve Testler

```bash
# Bağımlılıkların yüklenmesi
npm install

# Prisma şemasını senkronize et ve veritabanını tohumla
npm run prisma:migrate
npm run prisma:seed

# Birim ve entegrasyon testlerini çalıştır
npm test

# TypeScript tip denetimi
npm run typecheck

# Üretim derlemesi
npm run build
```

---

## Local Development with Docker

Docker Desktop üzerinde PostgreSQL veritabanı ve web uygulaması birlikte ayağa kaldırılır:

```bash
# Servisleri derle ve arka planda çalıştır
docker compose up -d --build

# Konteyner durumlarını ve healthcheck kontrolünü incele
docker compose ps

# Tarayıcıdan açın:
# http://localhost:3000

# Veritabanı portu: localhost:5433 (PostgreSQL 16)

# Logları canlı takip etmek için:
docker compose logs -f

# Docker ortamını durdurmak için:
docker compose down
```
