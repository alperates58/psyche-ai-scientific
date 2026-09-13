# 03 — Değerlendirme Protokolü ve Boylamsal Ölçüm Mimarisi

## 1. Neden Tek Bir Oturumda 400 Soru Sorulamaz?

Psikometrik araştırmalar (Curran, 2016; Meade & Craig, 2012), 20–25 dakikayı aşan kesintisiz test uygulamalarında bilişsel tükenmişliğin (survey fatigue) hızla arttığını, dikkat hatalarının fırladığını ve tekdüze yanıt (longstring) oranının katlandığını göstermektedir.

PsycheAI, tek bir seansta yüzlerce soru sormak yerine **Zamana Yayılan Modüler Boylamsal Ölçüm Protokolü (Longitudinal Modular Assessment)** uygular.

---

## 2. Dört Aşamalı Modüler Yol Haritası

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ MODÜL 1: DISCOVERY SPRINT (~12-14 Dakika / ~64 Madde)                       │
│ - Bilgilendirilmiş Onam ve Temel Demografi (8 soru)                         │
│ - Core Personality (IPIP-HEXACO Kısa Form: 48 soru)                         │
│ - Dikkatsiz Yanıt ve Dikkat Kontrol Maddeleri (4 soru)                       │
│ ==> Çıktı: Giriş Düzeyi Kişilik Atlası ve Temel Profil                      │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │ (24-48 Saat Dinlenme)
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ MODÜL 2: INNER COMPASS (~10-12 Dakika / ~48 Madde)                          │
│ - Benlik Sistemi: Benlik Saygısı, Öz-Yeterlilik, Netlik, Özgünlük           │
│ - Biliş ve Karar: Bilişsel İhtiyaç, Belirsizlik Toleransı, Sezgisel/Rasyonel│
│ ==> Çıktı: Bilişsel ve Benlik Haritası Kilidi Açılır                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │ (24-48 Saat Dinlenme)
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ MODÜL 3: EMOTION & REGULATION (~10-12 Dakika / ~50 Madde)                   │
│ - Duygu Düzenleme: Bilişsel Yeniden Değerlendirme, Bastırma, Tolerans       │
│ - Dürtüsellik ve İrade: UPPS-P Boyutları, Özdenetim                         │
│ ==> Çıktı: Duygu ve Dürtü Dashboard'u                                       │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │ (24-48 Saat Dinlenme)
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ MODÜL 4: RELATIONS & VALUES (~10-12 Dakika / ~52 Madde)                     │
│ - Kişilerarası Dinamikler: Yetişkin Bağlanma, Çok Boyutlu Empati, Sınırlar   │
│ - Değerler ve İhtiyaçlar: SDT İhtiyaçları, Schwartz 10 Değer Çemberi       │
│ ==> Çıktı: Tam Kapsamlı Psychological Digital Profile                       │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │ (Sürekli Gelişim)
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ GÜNLÜK MİKRO-CHECK-IN VE SENARYO DERİNLEŞTİRMELERİ (2-3 Dakika)             │
│ - Düşük güvenli veya çelişkili alanlar için bağlamsal senaryolar            │
│ - Durumsal (state) dalgalanmaları izleyen mikro-görevler                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Çok-Modlu Madde Türleri (Multi-Method Items)

Tek bir madde formatı ortak yöntem varyansına (common method bias) yol açar. Sistem aşağıdaki formatları harmanlar:

1. **Çift Kutuplu 6'lı Likert (Bipolar Likert):**
   - 1 = Kesinlikle Katılmıyorum ... 6 = Kesinlikle Katılıyorum.
   - Nötr kaçışını önlemek ve zorunlu yönelim sağlamak için çift sayıda kategori tercih edilir.
2. **Durumsal Yargı Senaryoları (Situational Judgement - SJT):**
   - Gerçekçi bir yaşam, iş veya ilişki ikilemi metni sunulur.
   - Birey 4 farklı eylem alternatifinden birini seçer veya derecelendirir.
3. **Zorunlu Seçim Çiftleri (Forced-Choice):**
   - Sosyal beğenirliği kontrol etmek amacıyla benzer beğenirlik düzeyine sahip iki olumlu ifade eşleştirilir.
   - Thurstonian IRT modelleme altyapısına uygun olarak yapılandırılır.
4. **Türetilmiş Benlik Farkı Görevleri (Self-Discrepancy Rating):**
   - Birey aynı nitelik setini (çalışkanlık, yaratıcılık, sakinlik vb.) üç ayrı mercekten puanlar:
     * *Actual Self (Şu anki gerçek benliğim)*
     * *Ideal Self (Olmak istediğim ideal benliğim)*
     * *Ought Self (Olmak zorunda olduğum görev benliğim)*

---

## 4. Ters Maddeler (Reverse Items) ve Metot Faktörü Uyarısı

Ters ifadeler ("Partileri sevmem", "Kolay sinirlenmem"):
- Katılımcının okumadan her şeye katılmasını (acquiescence bias) yakalamak için gereklidir.
- Ancak aşırı ters madde kullanımı; bilişsel yükü artırır, faktör analizinde yapay bir "metot faktörü" oluşturabilir.
- Bu nedenle ters maddeler otomatik bir sabit oranla değil; pilot faktör analizinde madde ayırt ediciliği doğrulanarak soru bankasına dahil edilir.

---

## 5. CAT Durdurma Kuralları (Bilgisayarlı Uyarlamalı Test)

Pilot kalibrasyon tamamlanıp IRT parametreleri kestirildikten sonra CAT motoru devreye girer:
1. **Minimum Madde Kuralı:** Her facet için en az 3 madde uygulanmadan test durdurulamaz.
2. **Standart Hata Eşiği:** Latent özellik için hedef $SE(\theta) \le 0.35$ değerine ulaşıldığında durdurulur.
3. **Maksimum Madde Kuralı:** $SE$ eşiğine ulaşılamasa dahi bilişsel yorgunluğu önlemek için facet başına maksimum 8 maddede sonlandırılır.
4. **İçerik Dengeleme (Content Balancing):** Hiçbir alt facet atlanamaz.
