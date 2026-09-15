import { describe, it, expect } from 'vitest';
import { hasPermission, getUserPermissions, type Role } from '../src/lib/rbac';
import { maskEmail } from '../src/services/adminService';

describe('FAZ 2.7A: Admin RBAC & Permission Boundaries', () => {
  it('strictly denies ADMIN_ACCESS to USER role', () => {
    expect(hasPermission(['USER'], 'ADMIN_ACCESS')).toBe(false);
  });

  it('strictly denies ADMIN_ACCESS to RESEARCHER role', () => {
    expect(hasPermission(['RESEARCHER'], 'ADMIN_ACCESS')).toBe(false);
    expect(hasPermission(['RESEARCHER'], 'ITEM_MANAGE')).toBe(true);
  });

  it('strictly denies ADMIN_ACCESS to EXPERT_REVIEWER role', () => {
    expect(hasPermission(['EXPERT_REVIEWER'], 'ADMIN_ACCESS')).toBe(false);
    expect(hasPermission(['EXPERT_REVIEWER'], 'RESEARCH_REVIEW')).toBe(true);
  });

  it('grants ADMIN_ACCESS to ADMIN role', () => {
    expect(hasPermission(['ADMIN'], 'ADMIN_ACCESS')).toBe(true);
    expect(hasPermission(['ADMIN'], 'USER_MANAGE')).toBe(true);
    expect(hasPermission(['ADMIN'], 'SYSTEM_CONFIG')).toBe(true);
    expect(hasPermission(['ADMIN'], 'ROLE_MANAGE')).toBe(false);
  });

  it('grants ADMIN_ACCESS and ROLE_MANAGE to SUPER_ADMIN role', () => {
    expect(hasPermission(['SUPER_ADMIN'], 'ADMIN_ACCESS')).toBe(true);
    expect(hasPermission(['SUPER_ADMIN'], 'ROLE_MANAGE')).toBe(true);
    expect(hasPermission(['SUPER_ADMIN'], 'SYSTEM_CONFIG')).toBe(true);
    expect(hasPermission(['SUPER_ADMIN'], 'USER_MANAGE')).toBe(true);
  });
});

describe('FAZ 2.7A: Audit PII Minimization & Masking', () => {
  it('correctly masks standard email addresses', () => {
    expect(maskEmail('alper.ates@gmail.com')).toBe('a***s@gmail.com');
    expect(maskEmail('admin@psycheai.com')).toBe('a***n@psycheai.com');
    expect(maskEmail('user@test.org')).toBe('u***r@test.org');
  });

  it('handles short usernames safely', () => {
    expect(maskEmail('ab@example.com')).toBe('a***@example.com');
    expect(maskEmail('a@example.com')).toBe('a***@example.com');
  });

  it('handles null, undefined, or invalid emails gracefully', () => {
    expect(maskEmail(null)).toBeNull();
    expect(maskEmail(undefined)).toBeNull();
    expect(maskEmail('')).toBeNull();
    expect(maskEmail('invalid-email')).toBeNull();
  });
});
