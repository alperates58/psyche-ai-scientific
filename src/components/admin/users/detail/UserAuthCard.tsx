import React from 'react';
import { UserDetailDTO } from '@/services/adminUserService';
import { Key, Globe, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';

export interface UserAuthCardProps {
  auth: UserDetailDTO['auth'];
}

export const UserAuthCard: React.FC<UserAuthCardProps> = ({ auth }) => {
  return (
    <div className="bg-surface-1 rounded-2xl border border-border-subtle p-6 shadow-xs space-y-4">
      <div className="flex items-center space-x-2 border-b border-border-subtle pb-3">
        <ShieldCheck className="w-5 h-5 text-brand-600" />
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
          Kimlik Doğrulama Sağlayıcıları
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Credentials / Password Auth */}
        <div className="p-4 rounded-xl border border-border-subtle bg-bg-subtle/50 flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center text-text-secondary shrink-0">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-text-primary text-xs">E-posta & Şifre (Credentials)</div>
              <p className="text-[11px] text-text-secondary mt-0.5">
                {auth.hasCredentials
                  ? 'Kullanıcı şifreli kimlik doğrulamaya sahip (scrypt hash).'
                  : 'Şifreli giriş henüz tanımlanmamış.'}
              </p>
            </div>
          </div>
          {auth.hasCredentials ? (
            <span className="inline-flex items-center text-emerald-700 font-semibold text-[11px] shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              Aktif
            </span>
          ) : (
            <span className="inline-flex items-center text-text-tertiary font-medium text-[11px] shrink-0">
              <XCircle className="w-3.5 h-3.5 mr-1 opacity-60" />
              Yok
            </span>
          )}
        </div>

        {/* Google OAuth */}
        <div className="p-4 rounded-xl border border-border-subtle bg-bg-subtle/50 flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 border border-blue-200">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-text-primary text-xs">Google OAuth 2.0</div>
              <p className="text-[11px] text-text-secondary mt-0.5">
                {auth.hasGoogleOAuth
                  ? `Google hesabı bağlı (Sağlayıcı ID: ${auth.googleAccountId ? auth.googleAccountId.substring(0, 8) + '...' : 'Bağlı'}).`
                  : 'Google OAuth bağlantısı bulunmuyor.'}
              </p>
            </div>
          </div>
          {auth.hasGoogleOAuth ? (
            <span className="inline-flex items-center text-emerald-700 font-semibold text-[11px] shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              Bağlı
            </span>
          ) : (
            <span className="inline-flex items-center text-text-tertiary font-medium text-[11px] shrink-0">
              <XCircle className="w-3.5 h-3.5 mr-1 opacity-60" />
              Yok
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
