import React from 'react';
import { CheckCircle2, AlertCircle, Ban, Clock } from 'lucide-react';

export interface UserStatusBadgeProps {
  status: string;
  className?: string;
}

export const UserStatusBadge: React.FC<UserStatusBadgeProps> = ({ status, className = '' }) => {
  switch (status) {
    case 'ACTIVE':
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 ${className}`}
        >
          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600 shrink-0" />
          Aktif
        </span>
      );
    case 'PENDING_VERIFICATION':
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80 ${className}`}
        >
          <Clock className="w-3 h-3 mr-1 text-amber-600 shrink-0" />
          Doğrulama Bekliyor
        </span>
      );
    case 'SUSPENDED':
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200/80 ${className}`}
        >
          <AlertCircle className="w-3 h-3 mr-1 text-orange-600 shrink-0" />
          Askıya Alındı
        </span>
      );
    case 'DISABLED':
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80 ${className}`}
        >
          <Ban className="w-3 h-3 mr-1 text-rose-600 shrink-0" />
          Devre Dışı
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-200 ${className}`}
        >
          {status}
        </span>
      );
  }
};
