'use client';

import React from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  hideOnTablet?: boolean;
}

export interface ResponsiveDataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T, index: number) => string;
  renderMobileCard?: (item: T, index: number) => React.ReactNode;
  emptyMessage?: string;
  className?: string;
  maxHeight?: string;
}

export function ResponsiveDataTable<T>({
  data,
  columns,
  keyExtractor,
  renderMobileCard,
  emptyMessage = 'Kayıt bulunamadı.',
  className = '',
  maxHeight = '600px',
}: ResponsiveDataTableProps<T>) {
  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-text-tertiary border border-dashed border-border-default rounded-xl bg-surface-2/50">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* 1. Mobile Cards View (< sm / < 640px) */}
      <div className="block sm:hidden space-y-3">
        {data.map((item, idx) => {
          const key = keyExtractor(item, idx);
          if (renderMobileCard) {
            return <React.Fragment key={key}>{renderMobileCard(item, idx)}</React.Fragment>;
          }
          // Default key-value card representation
          return (
            <div
              key={key}
              className="bg-surface-1 p-4 rounded-xl border border-border-subtle shadow-xs space-y-2 text-xs"
            >
              {columns.map((col) => (
                <div key={col.key} className="flex justify-between items-start gap-2 py-1 border-b border-border-subtle/50 last:border-b-0">
                  <span className="text-text-tertiary font-medium shrink-0">{col.header}:</span>
                  <div className="text-right text-text-primary">
                    {col.render ? col.render(item, idx) : (item as any)[col.key]}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* 2. Tablet & Desktop Table View (>= sm) with controlled internal horizontal scroll */}
      <div
        className="hidden sm:block overflow-x-auto overflow-y-auto rounded-xl border border-border-subtle shadow-xs bg-surface-1"
        style={{ maxHeight }}
      >
        <table className="w-full text-left text-xs md:text-sm border-collapse">
          <thead className="bg-surface-2 sticky top-0 border-b border-border-subtle z-10">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`py-3 px-3.5 font-semibold text-text-tertiary uppercase tracking-wider text-[11px] ${
                    col.hideOnTablet ? 'hidden lg:table-cell' : ''
                  } ${col.headerClassName || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {data.map((item, idx) => {
              const key = keyExtractor(item, idx);
              return (
                <tr
                  key={key}
                  className="hover:bg-bg-subtle/60 transition-colors duration-100"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`py-3 px-3.5 text-text-primary ${
                        col.hideOnTablet ? 'hidden lg:table-cell' : ''
                      } ${col.className || ''}`}
                    >
                      {col.render ? col.render(item, idx) : (item as any)[col.key]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
