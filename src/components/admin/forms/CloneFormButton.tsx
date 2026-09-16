'use client';

import React, { useState } from 'react';
import { CloneFormModal } from './CloneFormModal';
import { Copy } from 'lucide-react';

interface CloneFormButtonProps {
  form: {
    id: string;
    versionCode: string;
    moduleCode: string;
    moduleTitleTr: string;
    itemCount: number;
    description?: string | null;
  };
}

export const CloneFormButton: React.FC<CloneFormButtonProps> = ({ form }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-3.5 py-2 rounded-xl bg-surface-1 hover:bg-surface-2 border border-border-subtle text-xs font-semibold text-text-primary transition-colors shadow-xs"
      >
        <Copy className="w-4 h-4 mr-1.5 text-text-tertiary" />
        Bu Formu Klonla
      </button>

      {isOpen && (
        <CloneFormModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          sourceForm={form}
        />
      )}
    </>
  );
};
