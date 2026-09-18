# PsycheAI Boylamsal Profil ve Zaman İçi Takip Mimarisi (FAZ 2.20)

## 1. Genel Bakış ve Temel İlke

PsycheAI Boylamsal Profil ve Zaman İçi Değişim Motoru (Longitudinal Profile Engine V1), kullanıcının farklı zaman noktalarında tamamladığı psikolojik değerlendirmeleri ampirik olarak haritalandıran ve zaman içindeki kararlılık ile gözlenen puan farklılıklarını izleyen bilimsel ölçüm katmanıdır.

**Temel Kural:**
> **"TEKRARLANAN ÖLÇÜM VERİSİ OLMADAN HİÇBİR BOYLAMSAL İDDİA ÜRETİLEMEZ."**

---

## 2. Boylamsal Veri Modeli (`LongitudinalProfileV1`)

Boylamsal veri yapısı deterministik olarak hesaplanır ve yapay zeka tarafından değiştirilemez:

```typescript
export interface LongitudinalProfileV1 {
  profileVersion: '1.0.0';
  userId: string;
  userName: string;
  generatedAt: string;
  measurementEpochs: MeasurementEpoch[];
  facetTrajectories: FacetTrajectory[];
  constructTrajectories: ConstructTrajectory[];
  domainCoverageTimeline: DomainCoverageTimelineEntry[];
  responseQualityTimeline: ResponseQualityTimelineEntry[];
  contextualObservations: ContextualObservation[];
  stabilitySummary: StabilitySummary;
  changeSummary: ChangeSummary;
  longitudinalReadiness: LongitudinalReadiness;
  evidenceRefs: string[];
  governanceNoticeTr: string;
}
```

---

## 3. Ölçüm Dönemi (Measurement Epoch) ve Gruplama Kuralları

- **Ölçüm Dönemi Tanımı:** Bir dönem, tekil bir soru ya da anlık bir tıklama değildir; belirli bir zaman aralığında tamamlanan tutarlı değerlendirme oturumları bütünüdür.
- **Operasyonel Gruplama Penceresi:** Varsayılan olarak 14 gün içinde tamamlanan modüller aynı ölçüm dönemine (`MeasurementEpoch`) dahil edilir.
- **Bilimsel Not:** 14 günlük pencere operasyonel bir ürün gruplama kuralıdır, mutlak bir psikometrik doğa yasası değildir.
- **Anlamlı Zaman Farkı:** 14 günü aşan sonraki değerlendirmeler yeni bir ölçüm dönemi (Epoch 2, Epoch 3...) oluşturur.

---

## 4. Boylamsal Hazırlık Seviyeleri (Longitudinal Readiness)

Sistem ölçüm sayısına göre konservatif hazırlık seviyeleri uygular:

1. **`NO_REPEAT_DATA` (1 Dönem):**
   - Tekil kesitsel ölçüm.
   - Değişim/trend hesaplanamaz (`NOT_ELIGIBLE`).
2. **`TWO_EPOCHS` (2 Dönem):**
   - Yalnızca iki nokta arası gözlenen fark (`PAIRWISE_CHANGE_ONLY`).
   - 2 nokta kesinlikle bir "trend" veya "kalıcı eğilim" olarak adlandırılamaz.
3. **`THREE_PLUS_EPOCHS` (3–4 Dönem):**
   - Zaman serisi analizine uygun (`TRAJECTORY_ELIGIBLE`).
   - 3 noktalı seyir çizgisi oluşturulabilir.
4. **`LONGITUDINAL_SERIES` (5+ Dönem):**
   - Boylamsal seri ve betimsel kararlılık analizi (`STABILITY_PATTERN_ELIGIBLE`).

---

## 5. Değişim Eşikleri ve Sınıflandırma Taksonomisi

Ön-kalibrasyon (PRE_CALIBRATION) aşamasında istatistiksel veya klinik anlamlılık iddia edilmez. Betimsel gözlenen puan farkı bantları kullanılır:

- **`STABLE_RANGE`:** $| \Delta | < 0.20$ puan (Stabil seyir)
- **`SMALL_OBSERVED_SHIFT`:** $0.20 \le | \Delta | < 0.50$ puan (Hafif gözlenen fark)
- **`MODERATE_OBSERVED_SHIFT`:** $0.50 \le | \Delta | < 0.80$ puan (Belirgin gözlenen fark)
- **`LARGE_OBSERVED_SHIFT`:** $| \Delta | \ge 0.80$ puan (Yüksek düzey gözlenen fark)
- **`QUALITY_LIMITED`:** Yanıt kalitesi uyarılı oturumlarda güven düşürülür (`CHANGE_CONFIDENCE_REDUCED`), puanlar silinmez veya değiştirilmez.
- **`VERSION_INCOMPATIBLE`:** Uyumsuz ölçek sürümleri doğrudan karşılaştırılmaz.

---

## 6. Eksik Veri ve Kısmi Tekrar Ölçüm İlkeleri

1. **Ara Değerleme (Enterpolasyon) Yasağı:** Ölçülmemiş ara dönemler yapay çizgilerle veya orta nokta atamasıyla doldurulmaz.
2. **Kısmi Tekrar Ölçüm (Partial Reassessment):** Kullanıcı yalnızca belirli bir modülü (örneğin Öz-Sistem) tekrarlarsa, yalnızca o modüle ait alt boyutların (Öz-saygı, Öz-yetkinlik vb.) seyir çizgisi güncellenir. Diğer boyutlar önceki tarihsel noktalarını korur, sahte bir biçimde "tekrar ölçüldü" olarak işaretlenmez.
3. **Mevcut Profil Tutarlılığı:** Seyir çizgisindeki en son ölçüm noktası, daima `getCurrentUnifiedProfile(userId)` / `resolveUnifiedPsychologicalProfileV2(userId)` çıktısındaki güncel boyut puanına eşit olmak zorundadır.
