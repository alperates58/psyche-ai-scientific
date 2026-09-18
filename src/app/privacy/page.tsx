import React from 'react';
import { PageContainer } from '@/components/ui/PageContainer';
import { ShieldCheck, Lock, EyeOff, Key } from 'lucide-react';

export const metadata = {
  title: 'Gizlilik ve Veri Güvenliği — PsycheAI',
  description: 'PsycheAI kullanıcı verisi mahremiyeti, AES-256 şifreleme ve sıfır PII yapay zeka aktarımı politikası.',
};

export default function PrivacyPage() {
  return (
    <PageContainer variant="standard" className="py-12 sm:py-16 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold border border-teal-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>VERİ GÜVENLİĞİ VE MAHREMİYET</span>
        </div>
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
          Gizlilik Politikası
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary max-w-2xl mx-auto">
          Psikolojik profiliniz ve değerlendirme yanıtlarınız en yüksek güvenlik ve gizlilik standartlarıyla korunur.
        </p>
      </div>

      <div className="space-y-6 text-sm text-text-secondary leading-relaxed bg-bg-surface p-8 rounded-3xl border border-border-default shadow-xs">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Lock className="w-4 h-4 text-brand-primary" />
            1. Veri Şifreleme ve Saklama
          </h2>
          <p>
            Tüm kullanıcı verileri, oturum anahtarları ve değerlendirme kayıtları endüstri standardı AES-256 şifreleme ile veritabanında saklanır.
            Verileriniz asla üçüncü taraflarla reklam veya ticari amaçlarla paylaşılmaz.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-brand-primary" />
            2. Minimum Gerekli Veri ve Sıfır PII (Kişisel Bilgi) İlkesi
          </h2>
          <p>
            Yapay zekâ destekli anlatım üretilirken adınız, e-posta adresiniz veya kimliğinizi ortaya çıkaracak hiçbir kişisel veri (PII) dış sunuculara gönderilmez.
            Yalnızca anonimleştirilmiş sayısal eğilim skorları ve boyut kodları aktarılır.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Key className="w-4 h-4 text-brand-primary" />
            3. Veri Sahipliği ve Silme Hakkı
          </h2>
          <p>
            Tüm psikometrik profil verileriniz ve günlük kayıtlarınız tamamen sizin kontrolünüzdedir.
            Hesap ayarlarınızdan dilediğiniz zaman tüm verilerinizi dışa aktarabilir veya kalıcı olarak silebilirsiniz.
          </p>
        </section>
      </div>
    </PageContainer>
  );
}
