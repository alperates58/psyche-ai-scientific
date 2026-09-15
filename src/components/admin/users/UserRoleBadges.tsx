import React from 'react';
import { Role } from '@/lib/rbac';
import { ShieldAlert, ShieldCheck, Microscope, UserCheck, User } from 'lucide-react';

export interface UserRoleBadgesProps {
  roles: Role[];
  className?: string;
  size?: 'sm' | 'md';
}

const ROLE_CONFIG: Record<
  Role,
  { label: string; icon: React.ElementType; bg: string; text: string; border: string }
> = {
  SUPER_ADMIN: {
    label: 'SUPER_ADMIN',
    icon: ShieldAlert,
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
  },
  ADMIN: {
    label: 'ADMIN',
    icon: ShieldCheck,
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
  },
  RESEARCHER: {
    label: 'RESEARCHER',
    icon: Microscope,
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-200',
  },
  EXPERT_REVIEWER: {
    label: 'EXPERT_REVIEWER',
    icon: UserCheck,
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  USER: {
    label: 'USER',
    icon: User,
    bg: 'bg-surface-2',
    text: 'text-text-secondary',
    border: 'border-border-subtle',
  },
};

export const UserRoleBadges: React.FC<UserRoleBadgesProps> = ({
  roles,
  className = '',
  size = 'sm',
}) => {
  if (!roles || roles.length === 0) {
    const cfg = ROLE_CONFIG.USER;
    const Icon = cfg.icon;
    return (
      <span
        className={`inline-flex items-center rounded-md font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border} ${
          size === 'sm' ? 'px-1.5 py-0.5 text-[11px]' : 'px-2 py-1 text-xs'
        } ${className}`}
      >
        <Icon className={`${size === 'sm' ? 'w-3 h-3 mr-1' : 'w-3.5 h-3.5 mr-1.5'} shrink-0`} />
        {cfg.label}
      </span>
    );
  }

  return (
    <div className={`inline-flex flex-wrap items-center gap-1.5 ${className}`}>
      {roles.map((r) => {
        const cfg = ROLE_CONFIG[r] || ROLE_CONFIG.USER;
        const Icon = cfg.icon;
        return (
          <span
            key={r}
            className={`inline-flex items-center rounded-md font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border} ${
              size === 'sm' ? 'px-1.5 py-0.5 text-[11px]' : 'px-2 py-1 text-xs'
            }`}
          >
            <Icon className={`${size === 'sm' ? 'w-3 h-3 mr-1' : 'w-3.5 h-3.5 mr-1.5'} shrink-0`} />
            {cfg.label}
          </span>
        );
      })}
    </div>
  );
};
