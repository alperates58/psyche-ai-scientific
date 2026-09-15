'use client';

import React, { useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface UserPaginationProps {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const UserPagination: React.FC<UserPaginationProps> = ({
  total,
  page,
  pageSize,
  totalPages,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updatePage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const updatePageSize = (newSize: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('pageSize', String(newSize));
    params.set('page', '1');
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  if (total === 0) return null;

  const startIdx = (page - 1) * pageSize + 1;
  const endIdx = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 border-t border-border-subtle text-xs text-text-secondary">
      {/* Total & Current slice info */}
      <div className="flex items-center space-x-2">
        <span>
          Toplam <strong className="text-text-primary font-semibold">{total}</strong> kayıttan{' '}
          <strong className="text-text-primary font-semibold">{startIdx} - {endIdx}</strong> arası gösteriliyor
        </span>
      </div>

      {/* Page Size & Navigation Controls */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1.5">
          <span>Sayfa Başına:</span>
          <select
            value={pageSize}
            onChange={(e) => updatePageSize(parseInt(e.target.value, 10))}
            className="px-2 py-1 rounded-lg border border-border-subtle bg-bg-subtle text-text-primary font-medium focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
            aria-label="Sayfa Boyutu"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>

        {/* Page Nav Buttons */}
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => updatePage(page - 1)}
            disabled={page <= 1 || isPending}
            className="p-2 rounded-lg border border-border-subtle text-text-secondary hover:text-text-primary hover:bg-bg-subtle disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center touch-manipulation"
            aria-label="Önceki Sayfa"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 py-1 font-semibold text-text-primary">
            {page} / {totalPages}
          </span>

          <button
            type="button"
            onClick={() => updatePage(page + 1)}
            disabled={page >= totalPages || isPending}
            className="p-2 rounded-lg border border-border-subtle text-text-secondary hover:text-text-primary hover:bg-bg-subtle disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center touch-manipulation"
            aria-label="Sonraki Sayfa"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
