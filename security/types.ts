export const roles = ['owner','accountant','employee','viewer'] as const
export type Role = typeof roles[number]

export const permissions = [
  'dashboard:read','reports:read','reports:create','transactions:read','ai:ask',
  'receipts:upload','expenses:create','invoices:pay','integrations:use','audit:read',
] as const
export type Permission = typeof permissions[number]

export interface AuthenticatedUser {
  userId: string
  email: string
  name?: string
  organizationId: string
  organizationName: string
  workspaceId: string
  role: Role
  permissions: readonly Permission[]
  allowedIntegrations: readonly string[]
  sessionExpiresAt: string
}

export interface AgentSecurityContext {
  userId: string
  organizationId: string
  workspaceId: string
  role: Role
  permissions: readonly Permission[]
  allowedIntegrations: readonly string[]
}

export class AuthenticationError extends Error {}
export class AuthorizationError extends Error {}
