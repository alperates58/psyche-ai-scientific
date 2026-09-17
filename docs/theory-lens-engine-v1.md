# PsycheAI FAZ 2.19 — Theory Lens & Kuramsal Konsil Engine Specification

## 1. Executive Summary
**FAZ 2.19 (Theory Lens & Kuramsal Konsil Engine)** implements an evidence-grounded, historical and theoretical interpretation layer downstream of deterministic psychometric scoring.

The engine enables users to explore their authoritative psychometric profile (11 Domains, 37 Constructs, 91 Facets) through 10 seminal psychological frameworks while strictly maintaining psychometric integrity, clinical safety, and epistemic boundaries.

---

## 2. Core Architectural Invariants

1. **Deterministic Master Model is Authoritative**:
   - Theories **never** calculate, alter, or impute psychometric scores.
   - Theories **never** fill missing or unmeasured facets with simulated data.
   - Single source of truth runtime: All theory pipelines consume `resolveUnifiedPsychologicalProfileV2(userId)` -> `buildScopedLensEvidenceBundle(profile, lensId)`.

2. **Strict Epistemic Separation**:
   Every claim produced by the engine is explicitly tagged into one of four distinct epistemic categories:
   - `MEASURED_FINDING`: Deterministik psikometrik ölçüm verileri (örn: HEXACO, Duygu Düzenleme, vb.).
   - `THEORETICAL_INTERPRETATION`: Kuramsal ekolün kavramsal merceğinden yapılan okuma ve yorumlama.
   - `USER_PROVIDED_CONTEXT`: Kullanıcının diyalog sırasında kendisi hakkında paylaştığı bağlamsal bilgiler.
   - `REFLECTIVE_HYPOTHESIS`: Kullanıcının kendi yaşamında gözlemlemesi için sunulan yansıtıcı sorular ve hipotezler.

3. **Zero Clinical Pathology & Anti-Trauma Protection**:
   - No diagnostic labeling (e.g. Bipolar, Borderline, Narsisistik Kişilik Bozukluğu).
   - No assumption or assertion of childhood trauma, parental abuse, or sexual conflict.
   - The interactive chat is explicitly framed as personal reflection and awareness, **not** psychotherapy or clinical treatment.

4. **Dual-Path Generation & Deterministic Fallback**:
   - Primary: DeepSeek V4 Flash (`/chat/completions`) using strict JSON schema contracts and temperature controls.
   - Fallback: Comprehensive deterministic synthesis (`theoryFallbackEngine.ts`) guaranteeing 100% offline uptime and zero dependency failure risk.

---

## 3. Supported Theoretical Lenses (10 Ekol)

| Lens ID | Kuram / Ekol | Kuramcı | Tarihsel Dönem | Temel Odak |
| :--- | :--- | :--- | :--- | :--- |
| `FREUD` | Klasik Psikanalitik Dinamikler | Sigmund Freud | 1895–1939 | Yapısal Model (İd-Ego-Süperego), Savunmalar, Yüceltme |
| `JUNG` | Analitik Psikoloji & Bireyleşme | Carl Gustav Jung | 1912–1961 | Bireyleşme, Persona, Gölge Metaforu, Zıt Kutuplar |
| `ADLER` | Bireysel Psikoloji & Sosyal İlgi | Alfred Adler | 1912–1937 | Sosyal İlgi (Gemeinschaftsgefühl), Telafi, Hedef Yönelimi |
| `ROGERS` | Danışan Merkezli & Kendini Gerçekleştirme | Carl Rogers | 1942–1987 | Gerçek Benlik vs İdeal Benlik, Koşulsuz Öz-Kabul, Bütünleşme |
| `MASLOW` | İhtiyaçlar Hiyerarşisi & Kendini Aşma | Abraham Maslow | 1943–1970 | Kendini Gerçekleştirme (Self-Actualization), Zirve Yaşantılar |
| `SKINNER` | Radikal Davranışçılık & Pekiştirme | B. F. Skinner | 1938–1990 | Çevresel Uyaranlar, Pekiştirme Dinamikleri, İşlevsel Analiz |
| `WILLIAM_JAMES`| Pragmatizm & Bilinç Akışı | William James | 1890–1910 | Bilinç Akışı, Çoğul Benlik (Maddi, Sosyal, Ruhsal), Alışkanlıklar |
| `GESTALT` | Temas Sınırları & Bütünsel Farkındalık | Fritz Perls / F. Koffka | 1923–1970 | Şimdi ve Burada Farkındalığı, Temas Biçimleri, Şekil-Zemin |
| `FRANKL` | Logoterapi & Anlam İstenci | Viktor Frankl | 1946–1997 | Anlam İstenci (Will to Meaning), Trajik İyimserlik, Değerler |
| `BECK` | Bilişsel Davranışçı Şemalar | Aaron T. Beck | 1967–2021 | Bilişsel Şemalar, Otomatik Düşünceler, Bilişsel Esneklik |

---

## 4. API Endpoints

- `GET /api/theory-council/lenses`: Returns list of 10 supported lenses and verified academic bibliography.
- `POST /api/theory-council/interpret`: Generates or retrieves grounded profile interpretation for a chosen lens.
- `POST /api/theory-council/chat`: Conducts multi-turn reflective dialogue with epistemic tagging.
- `POST /api/theory-council/compare`: Generates multi-lens comparative synthesis across 2–3 chosen lenses.
