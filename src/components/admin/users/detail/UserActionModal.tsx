'use client';

import React, { useState } from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';

export interface UserActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string, confirmText?: string) => Promise<void>;
  title: string;
  description: string;
  confirmLabel: string;
  variant?: 'danger' | 'warning' | 'primary';
  requiresTextInput?: boolean;
  textInputPlaceholder?: string;
  expectedConfirmationText?: string;
  requiresReason?: boolean;
}

export const UserActionModal: React.FC<UserActionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  variant = 'danger',
  requiresTextInput = false,
  textInputPlaceholder = '',
  expectedConfirmationText = '',
  requiresReason = false,
}) => {
  const [reason, setReason] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const isTextInputValid = !requiresTextInput || confirmText.trim() === expectedConfirmationText.trim();
  const isFormValid = isTextInputValid && (!requiresReason || reason.trim().length > 0);

  const handleConfirm = async () => {
    if (!isFormValid || isLoading) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      await onConfirm(reason.trim() || undefined, confirmText.trim() || undefined);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'İşlem gerçekleştirilirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonStyles = () => {
    if (variant === 'danger') {
      return 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500/30';
    }
    if (variant === 'warning') {
      return 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500/30';
    }
    return 'bg-brand-600 hover:bg-brand-700 text-white focus:ring-brand-500/30';
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-surface-1 border border-border-subtle rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-5 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                variant === 'danger'
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : variant === 'warning'
                  ? 'bg-amber-50 text-amber-600 border border-amber-200'
                  : 'bg-brand-50 text-brand-600 border border-brand-200'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 id="modal-title" className="text-base font-bold text-text-primary">
                {title}
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">{description}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 text-text-tertiary hover:text-text-primary rounded-lg hover:bg-bg-subtle transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center touch-manipulation"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium">
            {errorMessage}
          </div>
        )}

        {/* Inputs */}
        <div className="space-y-4 text-xs">
          {requiresTextInput && (
            <div className="space-y-1.5">
              <label className="font-semibold text-text-primary block">
                Onaylamak için <span className="font-mono text-rose-600 font-bold select-all">{expectedConfirmationText}</span> yazın:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={textInputPlaceholder || expectedConfirmationText}
                className="w-full px-3.5 py-2 rounded-xl border border-border-subtle bg-bg-subtle text-text-primary font-mono text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 min-h-[44px]"
                disabled={isLoading}
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="font-semibold text-text-primary block">
              Gerekçe / Not {requiresReason ? '(Zorunlu)' : '(İsteğe Bağlı)'}:
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Yönetimsel işlem gerekçesi (Denetim günlüğüne kaydedilecektir)..."
              className="w-full px-3.5 py-2 rounded-xl border border-border-subtle bg-bg-subtle text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl border border-border-subtle text-text-secondary hover:text-text-primary hover:bg-bg-subtle font-semibold text-xs transition-colors min-h-[44px] touch-manipulation"
          >
            İptal
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!isFormValid || isLoading}
            className={`inline-flex items-center px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-xs min-h-[44px] touch-manipulation focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${getButtonStyles()}`}
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
