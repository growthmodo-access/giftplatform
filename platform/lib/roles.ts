/**
 * Application roles: 3 roles only.
 * - SUPER_ADMIN: platform owner (you)
 * - HR: Company HR / company admin (combined former ADMIN + HR + MANAGER)
 * - EMPLOYEE: employee access
 */

export type AppRole = 'SUPER_ADMIN' | 'HR' | 'EMPLOYEE'

/** DB may still have legacy ADMIN or MANAGER; we normalize to HR for app logic. */
export type DbRole = 'SUPER_ADMIN' | 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE'

const COMPANY_HR_DB_ROLES: DbRole[] = ['ADMIN', 'HR', 'MANAGER']

/** Normalize DB role to one of the 3 app roles. */
export function toAppRole(dbRole: string | null | undefined): AppRole {
  if (!dbRole) return 'EMPLOYEE'
  const r = String(dbRole).trim().toUpperCase()
  if (r === 'SUPER_ADMIN') return 'SUPER_ADMIN'
  if (COMPANY_HR_DB_ROLES.includes(r as DbRole)) return 'HR'
  return 'EMPLOYEE'
}

export function isCompanyHR(role: AppRole): boolean {
  return role === 'HR'
}

export function isSuperAdmin(role: AppRole): boolean {
  return role === 'SUPER_ADMIN'
}

export function isEmployee(role: AppRole): boolean {
  return role === 'EMPLOYEE'
}

/** Label for UI (e.g. dropdowns, settings). */
export const APP_ROLE_LABELS: Record<AppRole, string> = {
  SUPER_ADMIN: 'Super Admin',
  HR: 'Company HR',
  EMPLOYEE: 'Employee',
}

/** True if DB role is company-level (ADMIN, HR, or MANAGER). Use in server actions. */
export function isCompanyHRDb(dbRole: string | null | undefined): boolean {
  if (!dbRole) return false
  return COMPANY_HR_DB_ROLES.includes(String(dbRole).trim().toUpperCase() as DbRole)
}
