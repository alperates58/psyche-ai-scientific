# 09 — Faz Planları ve Geliştirme Yol Haritası

PsycheAI geliştirme süreci, aceleyle görsel üretmek yerine bilimsel temelleri sağlamlaştırarak ilerleyen 9 aşamalı bir yol haritasını takip eder:

---

## Faz 0: Bilimsel Temel ve Ontoloji Konsolidasyonu (TAMAMLANDI)
- Hiyerarşik ontolojinin (`Domain` $\rightarrow$ `Construct` $\rightarrow$ `Facet` $\rightarrow$ `Observable Indicators`) oluşturulması.
- 121 construct'lık şişkin listenin temizlenmesi, jingle-jangle problemlerinin giderilmesi.
- `instrument-registry.json` ve `source-registry.json` oluşturulması.
- Telifli araçların elenmesi (NEO, TKI, MBTI) ve açık kaynak (IPIP, Rosenberg vb.) araçların onaylanması.
- `item-bank.schema.json` ve `profile-output.schema.json` dosyalarının güncellenmesi.
- TypeScript tip tanımları, deterministik skorlama kontratları ve DeepSeek Zod güvenlik katmanı.

---

## Faz 1: Veritabanı Şeması ve Deterministik Skorlama Çekirdeği
- PostgreSQL + Prisma/Drizzle veri modellerinin kurulması (`Domain`, `Construct`, `Facet`, `Item`, `Response`, `ProfileSnapshot`).
- Ön-kalibrasyon (Pre-Calibration) skorlama fonksiyonlarının ve eksik veri kurallarının implementasyonu.
- Dikkatsiz yanıt (longstring, rapid response, semantic pair) tespit algoritmalarının veri katmanına bağlanması.

---

## Faz 2: Modüler Değerlendirme Arayüzü (Assessment Runner)
- `design.md` ilkelerine tam uyumlu, açık tema ve dikkat dağıtmayan değerlendirme ekranı.
- 4 aşamalı modüler değerlendirme akışı (Sprint 1: Kişilik $\rightarrow$ Sprint 2: Benlik $\rightarrow$ Sprint 3: Duygu $\rightarrow$ Sprint 4: İlişkiler).
- Çift kutuplu 6'lı Likert, Durumsal Yargı Senaryoları (SJT) ve Higgins benlik farkı arayüzleri.
- Oturum kaydetme ve kaldığı yerden devam etme (save-and-return) mekanizması.

---

## Faz 3: Theory Council ve DeepSeek V4 Flash Entegrasyonu
- 8 kuramcı için deterministik hipotez eşleme motoru (Theory Council Rule Engine).
- Server-side DeepSeek V4 Flash adaptörü, Zod doğrulaması ve non-diagnostic klinik güvenlik filtreleri.
- Prompt injection izolasyonu (`<user_untrusted_narrative>`).

---

## Faz 4: Dashboard ve Bilimsel Veri Görselleştirmeleri
- 14 grafik ve matris bileşeninin (Radar, Facet Dağılım Whiskers, Heatmap, Tension Map, Self-Discrepancy, Value Circumplex vb.) inşası.
- İnteraktif tooltip sistemi (Ham skor, %95 Güven Aralığı, SEM, Ölçüm sürümü).
- Kademeli açıklama (Progressive Disclosure) mimarisi ile sakin ve derin kullanıcı deneyimi.

---

## Faz 5: Pilot Veri Toplama ve Psikometrik Kalibrasyon (EFA / CFA)
- N = 800+ katılımcı ile pilot araştırma verisi toplanması.
- Madde ayırt ediciliği ve güvenirlik (McDonald Omega $\ge 0.80$) analizleri.
- Polychoric korelasyon matrisi üzerinden EFA ve bağımsız örneklemde CFA uyum testleri.
- Zayıf maddelerin ayıklanması ve faktör ağırlıklarının (`lambda_i`) sisteme işlenmesi.

---

## Faz 6: Türkiye Standardizasyonu ve Normlama
- Türkiye İBBS-1 bölgeleri, yaş, cinsiyet ve eğitim kotalarına göre tabakalı N = 2000+ örneklem.
- Sürekli normlama (Continuous Norming) algoritmalarıyla z-skoru, T-skoru ve ampirik Persentil tablolarının oluşturulması.
- Cinsiyet ve yaş grupları arası Ölçüm Değişmezliği (Measurement Invariance) ve DIF taraması.

---

## Faz 7: Madde Tepki Kuramı (IRT) ve Bilgisayarlı Uyarlamalı Test (CAT)
- Graded Response Model (GRM) parametrelerinin ($a, b_k$) kestirilmesi.
- Test Bilgi Eğrisi (TIF) tabanlı bilgisayarlı uyarlamalı test (CAT) motoru.
- Bireysel standart hata ($SE \le 0.35$) durdurma kuralı ile soru sayısının optimize edilmesi.

---

## Faz 8: Boylamsal Profil ve Üretim Düzeyi İzleme
- Tekrar ölçümler üzerinden boylamsal zaman serisi analizi (State vs Trait ayrımı).
- Kişiselleştirilmiş mikro-check-in bildirimleri.
- Akademik teknik kılavuz (Technical Manual) ve metodoloji şeffaflık raporunun yayınlanması.
