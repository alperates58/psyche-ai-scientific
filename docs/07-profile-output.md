# 07 — Psychological Digital Profile Çıktısı ve Dashboard Mimarisi

> **Tasarım Kaynağı:** Bu doküman, root dizinindeki `design.md` UI/UX yönergelerine %100 uyumlu olarak hazırlanmıştır.

---

## 1. Temel Arayüz İlkesi: Kademeli Açıklama (Progressive Disclosure)

PsycheAI profil ekranı, kullanıcının önüne 20 farklı grafiği aynı anda yığan karmaşık bir uçak kokpiti veya kripto kontrol paneli **değildir**.

Tasarım dili; ölçülen veriyi birinci plana koyan, sakin, güven verici, beyaz ve yumuşak gri yüzeylerden oluşan **açık tema (light-first) premium SaaS** estetiğine dayanır.

- **Genel Bakış (Overview):** Sadece 4 ana soruyu cevaplar: Profil kapsamı, en güçlü ölçülen alanlar, öne çıkan ana örüntü ve bir sonraki tavsiye edilen modül.
- **Detaylı Alanlar (Domain Pages):** Her domain kendi sayfasında (`/profile/personality`, `/profile/emotion` vb.) ilgili derinlikli grafiklerini barındırır.

---

## 2. Bilimsel Veri Görselleştirme Atlası

### 2.1 Core Personality Radar (Yönetici Özeti)
- **Kullanım:** Sadece HEXACO 6 ana kişilik eksenini özetlemek için kullanılır.
- **Kural:** Asla 24 alt facet tek bir radara sıkıştırılamaz. Tooltip içinde: Nokta tahmini, %95 Güven Aralığı, Güven düzeyi ve Ölçüm sürümü yer alır.

### 2.2 Facet Distribution (Facet Dağılım Çubukları)
- **Kullanım:** 24+ kişilik facet'inin ayrıntılı analizi.
- **Görsel:** Yatay çubuk veya nokta grafiği + güven bıyıkları (error whiskers: $T \pm 1.96 \cdot SEM$).

### 2.3 Psychological Heatmap (Bütüncül Profil Isı Haritası)
- **Kullanım:** Tüm constructların tek ekranda kuşbakışı taranması.
- **Sütunlar:** Standartlaştırılmış konum, Ölçüm güveni, Bağlamsal değişkenlik, Veri güncelliği.

### 2.4 Tension Map (İçsel Gerilim ve Çelişki Haritası)
- **Kullanım:** Birbiriyle gerilim yaşayan construct çiftlerinin düğümlü ağ (node-link) grafiği.
- **Kural:** Kullanıcıya "tutarsızsın" denilmez; "Kişilik içi gerilim alanı" olarak çerçevelenir (örn: Yüksek Özerklik + Yüksek Onay İhtiyacı).

### 2.5 Synergy Map (Sinerji Ağı)
- **Kullanım:** Birbirini olumlu yönde destekleyen ve besleyen construct çiftlerinin gösterimi.

### 2.6 Self-Discrepancy (Benlik Farkı Çubukları)
- **Kullanım:** Higgins Benlik Farkları (Actual vs Ideal Self, Actual vs Ought Self).
- **Görsel:** Eşleştirilmiş çift nokta grafiği ve aradaki mesafe ($d$-distance).

### 2.7 Schwartz Value Circumplex (Evrensel Değerler Çemberi)
- **Kullanım:** 10 temel değerin dairesel karşıtlık ve komşuluk modeline göre dağılımı.

### 2.8 Cognitive Style Balance (Bilişsel Tarz Dengesi)
- **Kullanım:** Rasyonel/Analitik Düşünme vs Sezgisel/Deneyimsel Düşünme.

### 2.9 Emotion Regulation Quadrants (Duygu Düzenleme Koordinatı)
- **Kullanım:** Bilişsel Yeniden Değerlendirme ($X$) vs Duygusal Bastırma ($Y$) 2D saçılım grafiği.

### 2.10 Adult Attachment Space (Yetişkin Bağlanma Uzayı)
- **Kullanım:** Bağlanma Kaygısı ($X$) ve Bağlanma Kaçınması ($Y$) sürekli koordinat sistemi.
- **Kural:** Katı tip etiketleri (örn: "Sen Kaçınmacısın") yerine sürekli koordinat ekseninde bulunulan bölge açıklanır.

### 2.11 Context Shift Profile (Bağlamsal Esneklik Matrisi)
- **Kullanım:** Aynı özelliğin Genel, İş, Romantik İlişki ve Stres bağlamlarındaki puanlarının karşılaştırılması.

### 2.12 Longitudinal Timeline (Zaman Serisi Çizgisi)
- **Kullanım:** Constructların aylar/yıllar içindeki değişim eğrisi.
- **Görsel:** Çizgi grafik + etrafında güven bandı (uncertainty ribbon). State check-in'ler ile kalıcı Trait tahminleri açıkça ayrılır.

### 2.13 Profile Confidence Map (Ölçüm Güven Haritası)
- **Kullanım:** Hangi boyutun ne kadar güvenilir ölçüldüğünü gösteren şeffaf bilimsel panel.
- **Bileşenler:** Hassasiyet, yanıt kalitesi, madde kapsamı, yöntem çeşitliliği.

### 2.14 Theory Council Consensus Grid (Kuramlar Konseyi Izgarası)
- **Kullanım:** Satırlarda ölçülen temalar, sütunlarda 8 kuramsal mercek; hücreye tıklandığında açılan kavramsal okuma kartı.

---

## 3. Norm Olmadığında Arayüz Davranışı

Türkiye temsili norm çalışması tamamlanana kadar persentil veya nüfus kıyaslaması yapılmaz:
- Yüzdelik yerine: *"Bu ölçüm sürümünde henüz toplum normu mevcut değildir; ham skor ve güven aralığı gösterilmektedir."*
- "Toplumun %85'inden daha sorumlusun" gibi ifadeler arayüzde KESİNLİKLE yer almaz.
