# 08 — Güvenlik, Etik, Mahremiyet ve Klinik Sınırlar

## 1. Ürün Konumlandırması: Non-Diagnostic Profiling

PsycheAI platformu kesinlikle tıbbi, psikiyatrik veya klinik bir tanı aracı **değildir**.
- Depresyon, Bipolar Bozukluk, DEHB, Otizm Spektrumu, Şizofreni, Sınırda Kişilik Bozukluğu veya Travma gibi psikiyatrik tanı kategorileri sistemde yer almaz.
- İşe alımda eleme, sigorta prim belirleme veya hukuki ehliyet kararlarında otomatik karar sistemi olarak kullanılamaz.

---

## 2. Yüksek Sıkıntı ve Kriz Protokolü

Kullanıcının yanıtlarında (özellikle aşırı yüksek negatif duygulanım, çok düşük sıkıntı toleransı veya serbest metinlerde) yüksek akut kriz veya intihar riski sezildiğinde:
1. Profilleme derhal duraklatılır veya arka plana alınır.
2. Ekranda tanı veya etiket içermeyen sakin bir bilgilendirme penceresi açılır.
3. Türkiye'deki resmi ve ücretsiz destek hatları (Sağlık Bakanlığı ALO 182, Sosyal Destek 183, Acil 112) ve profesyonel psikoterapi kaynakları sunulur.

---

## 3. Privacy-by-Design (Tasarımda Mahremiyet)

1. **Veri Minimizasyonu:** Kimlik doğrulama için gerekli asgari veriler dışında özel hayatın gizliliğini ihlal edecek veriler toplanmaz.
2. **Serbest Metin Şifreleme:** Kullanıcının yazdığı serbest metinler ana veri tabanından ayrı, uçtan uca şifreli (AES-256) bir alanda saklanır.
3. **Model Sağlayıcısına Asgari Veri:** DeepSeek V4 Flash API'sine kullanıcının adı, IP'si veya kimlik bilgisi gönderilmez; yalnızca anonimleştirilmiş numerik skorlar ve `facetId` kodları iletilir.
4. **Gerçek Silme:** Kullanıcı hesabını sildiğinde profil verileri sadece bayrakla gizlenmez; kalıcı olarak veritabanından silinir (GDPR / KVKK uyumu).

---

## 4. Demografik Veri Etiği

Normlama ve araştırma amacıyla toplanan demografik veriler (yaş aralığı, cinsiyet, eğitim düzeyi, coğrafi bölge):
- Yalnızca norm tabakalandırması için kullanılır.
- Kullanıcıya yönelik ayrımcılık veya stereotipleştirme amacıyla kullanılamaz.
- Raporlama aşamasında hassas veriler ayrıştırılarak gizlilik korunur.
