# PsycheAI Profile Visualization System (v1.0)
**Psikolojik Profil Görselleştirme Mimarisi, Amiral Gemisi Grafikler ve Katmanlı IA**

---

## 1. Görselleştirme Stratejisi & İlkeler

PsycheAI görselleştirme mimarisi 3 temel kural üzerine kuruludur:
1. **İndirgemeci Olmayan Bütünlük:** İnsanı tek bir basite indirgenmiş sayıya veya sahte "kişilik tipine" sıkıştırmak yerine; çok boyutlu zenginliği görsel imzalarla yansıtır.
2. **Sahte Alan Ortalaması (Domain Aggregation) Yasağı:** Bağımsız veya zıt alt boyutları (örn. Dışsal Denetim vs İçsel Denetim; Pozitif vs Negatif Duygulanım) yapay bir genel alan ortalamasında eritmek yasaktır.
3. **Kademeli Açılma ve İnteraktiflik:** Her görsel bileşen tıklanabilir, filtrelenebilir ve tıklandığında alt boyut kartlarını ve bilimsel detayları tetikler.

---

## 2. Amiral Gemisi Görsel Bileşenler

### 1. Profil Parmak İzi (Profile Fingerprint — Flagship Visual Signature)
- **Dosya:** `src/components/profile/ProfileFingerprint.tsx`
- **Tasarım:** 11 ana alan ekseninde ölçülen 91 alt boyutu polar koordinat uzayında benzersiz bir eğri, renk halkaları ve veri noktaları olarak çizen SVG görsel imza.
- **Epistemik Bütünlük:** Alanları tek bir toplama indirgemez; ölçülmüş alt boyutların ölçek konumlarını (1–5) radyal mesafeler olarak çizer.
- **İnteraktiflik:** Eksenlerin veya noktaların üzerine gelindiğinde alt boyut adı, ölçek konumu ve ölçüm durumu gösterilir.

### 2. 11-Alan İnteraktif Keşif Çarkı (Domain Wheel)
- **Dosya:** `src/components/profile/DomainWheel.tsx`
- **Tasarım:** 11 psikolojik alanı (HEXACO, Benlik Sistemi, Duygu Düzenleme, Biliş & Karar, Öz-Düzenleme, Motivasyon & Değerler, İlişkisel Dinamikler, İyi Oluş, Başa Çıkma, Yaratıcılık, İleri Düzey Modül) dairesel veya ızgara biçiminde sunan bütünsel harita.
- **İşlev:** Alan seçildiğinde o alana ait alt boyutların keşif durumunu (`%65 keşfedildi`) ve öne çıkan eğilimleri filtreler.

### 3. Alt Boyut Gezgini V2 (Facet Explorer V2)
- **Dosya:** `src/components/profile/FacetExplorerV2.tsx`
- **Tasarım:** 91 alt boyut için Lucide ikonları, Türkçe açıklamalar, 5-bantlı ölçek konum çubukları ve 3 katmanlı kart yapısı.
- **Katmanlar:**
  - *Varsayılan:* Boyut adı, alan rozeti, ölçek konumu ve 1 cümlelik özet.
  - *Genişletilmiş (Katman 2):* Günlük hayattaki yansımalar ve düşünme soruları.
  - *Bilimsel Çekmece (Katman 3):* Ölçülen madde sayısı, ham skor, ölçek aralığı ve psikometrik tanım.

### 4. HEXACO 6-Faktör Radar Grafiği
- **Dosya:** `src/components/profile/HexacoRadarSection.tsx`
- **Tasarım:** Dürüstlük-Alçakgönüllülük, Duygusallık, Dışadönüklük, Geçimlilik, Sorumluluk ve Deneyime Açıklık faktörlerinin 1–5 ölçeğindeki dağılımını gösteren temiz radar grafiği.

---

## 3. 15 Bölümlük Birleşik Profil Bilgi Mimarisi (IA)

`src/components/profile/UnifiedProfileClientViewV2.tsx` içinde yapılandırılan 15 bölüm:

1. `#section-hero`: Profil Başlığı & Bütünsel Keşif Özeti
2. `#section-summary`: Seni En İyi Anlatan Eğilimler (ProfileSummarySection)
3. `#section-fingerprint`: Psikolojik Parmak İzin (ProfileFingerprint)
4. `#section-domains`: 11 Psikolojik Alan Keşfi (DomainWheel)
5. `#section-hexaco`: Temel Kişilik Boyutları Radarı (HEXACO 6 Faktör)
6. `#section-facets`: Tüm Alt Boyutlar Gezgini (FacetExplorerV2 - 91 Boyut)
7. `#section-patterns`: Dikkat Çeken Boyut Kombinasyonları
8. `#section-synergies`: Birbirini Destekleyen Güçlü Yönler (Sinerjiler)
9. `#section-tensions`: Hassas Denge Noktaları (Nötr İfadeler)
10. `#section-stability`: Boyut Kararlılığı ve Gelişim Alanları
11. `#section-theory-council`: Kuramsal Konsil Entegrasyonu (10 Mercek)
12. `#section-comparisons`: Zaman İçindeki Değişim & Karşılaştırmalar
13. `#section-science`: Bilimsel Şeffaflık, Metodoloji & Ölçüm Derinliği
14. `#section-exports`: Rapor Dışa Aktarma & Paylaşım Seçenekleri
15. `#section-growth-prep`: Bireysel Farkındalık & Gelişime Hazırlık Alanları

> Masaüstünde sol tarafta yapışkan (sticky) navigasyon indeksi, mobilde ise yatay kaydırılabilir çip seçici yer alır.
