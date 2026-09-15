export type Role =
  | 'USER'
  | 'EXPERT_REVIEWER'
  | 'RESEARCHER'
  | 'ADMIN'
  | 'SUPER_ADMIN';

export type Permission =
  | 'APP_USE'
  | 'PROFILE_VIEW_SELF'
  | 'ASSESSMENT_TAKE'
  | 'RESEARCH_VIEW'
  | 'RESEARCH_REVIEW'
  | 'ADMIN_ACCESS'
  | 'USER_MANAGE'
  | 'ITEM_MANAGE'
  | 'SYSTEM_CONFIG'
  | 'ROLE_MANAGE'
  // Scientific Control Plane (FAZ 2.7C)
  | 'SCIENTIFIC_VIEW'
  | 'ITEM_AUTHOR'
  | 'FORM_DRAFT_MANAGE'
  | 'FORM_PUBLISH'
  | 'SOURCE_MANAGE'
  | 'LICENSE_MANAGE'
  | 'VALIDATION_REVIEW'
  | 'SCORING_MODEL_ACTIVATE'
  | 'NORM_ACTIVATE';

export const ALL_ROLES: Role[] = [
  'USER',
  'EXPERT_REVIEWER',
  'RESEARCHER',
  'ADMIN',
  'SUPER_ADMIN'
];

export const ALL_PERMISSIONS: Permission[] = [
  'APP_USE',
  'PROFILE_VIEW_SELF',
  'ASSESSMENT_TAKE',
  'RESEARCH_VIEW',
  'RESEARCH_REVIEW',
  'ADMIN_ACCESS',
  'USER_MANAGE',
  'ITEM_MANAGE',
  'SYSTEM_CONFIG',
  'ROLE_MANAGE',
  'SCIENTIFIC_VIEW',
  'ITEM_AUTHOR',
  'FORM_DRAFT_MANAGE',
  'FORM_PUBLISH',
  'SOURCE_MANAGE',
  'LICENSE_MANAGE',
  'VALIDATION_REVIEW',
  'SCORING_MODEL_ACTIVATE',
  'NORM_ACTIVATE'
];

// Role to permissions mapping (Versioned RBAC Policy v1.1.0)
export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  USER: [
    'APP_USE',
    'PROFILE_VIEW_SELF',
    'ASSESSMENT_TAKE'
  ],
  EXPERT_REVIEWER: [
    'APP_USE',
    'PROFILE_VIEW_SELF',
    'ASSESSMENT_TAKE',
    'RESEARCH_VIEW',
    'RESEARCH_REVIEW',
    'SCIENTIFIC_VIEW',
    'VALIDATION_REVIEW'
  ],
  RESEARCHER: [
    'APP_USE',
    'PROFILE_VIEW_SELF',
    'ASSESSMENT_TAKE',
    'RESEARCH_VIEW',
    'RESEARCH_REVIEW',
    'ITEM_MANAGE',
    'SCIENTIFIC_VIEW',
    'ITEM_AUTHOR',
    'FORM_DRAFT_MANAGE',
    'SOURCE_MANAGE',
    'VALIDATION_REVIEW'
  ],
  ADMIN: [
    'APP_USE',
    'PROFILE_VIEW_SELF',
    'ASSESSMENT_TAKE',
    'RESEARCH_VIEW',
    'RESEARCH_REVIEW',
    'ADMIN_ACCESS',
    'USER_MANAGE',
    'ITEM_MANAGE',
    'SYSTEM_CONFIG',
    'SCIENTIFIC_VIEW',
    'ITEM_AUTHOR',
    'FORM_DRAFT_MANAGE',
    'SOURCE_MANAGE',
    'LICENSE_MANAGE',
    'VALIDATION_REVIEW'
  ],
  SUPER_ADMIN: [
    'APP_USE',
    'PROFILE_VIEW_SELF',
    'ASSESSMENT_TAKE',
    'RESEARCH_VIEW',
    'RESEARCH_REVIEW',
    'ADMIN_ACCESS',
    'USER_MANAGE',
    'ITEM_MANAGE',
    'SYSTEM_CONFIG',
    'ROLE_MANAGE',
    'SCIENTIFIC_VIEW',
    'ITEM_AUTHOR',
    'FORM_DRAFT_MANAGE',
    'FORM_PUBLISH',
    'SOURCE_MANAGE',
    'LICENSE_MANAGE',
    'VALIDATION_REVIEW',
    'SCORING_MODEL_ACTIVATE',
    'NORM_ACTIVATE'
  ]
};

export function isValidRole(role: string): role is Role {
  return ALL_ROLES.includes(role as Role);
}

export function hasRole(userRoles: string[], role: Role): boolean {
  if (!userRoles || !Array.isArray(userRoles)) return false;
  return userRoles.includes(role);
}

export function hasAnyRole(userRoles: string[], roles: Role[]): boolean {
  if (!userRoles || !Array.isArray(userRoles)) return false;
  return roles.some((r) => userRoles.includes(r));
}

export function getUserPermissions(userRoles: string[]): Permission[] {
  if (!userRoles || !Array.isArray(userRoles)) return [];
  const permissions = new Set<Permission>();

  for (const r of userRoles) {
    if (isValidRole(r)) {
      for (const p of ROLE_PERMISSIONS[r]) {
        permissions.add(p);
      }
    }
  }

  return Array.from(permissions);
}

export function hasPermission(userRoles: string[], permission: Permission): boolean {
  const permissions = getUserPermissions(userRoles);
  return permissions.includes(permission);
}
