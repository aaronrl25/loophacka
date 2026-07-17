import type { AuthenticatedUser, Permission, Role } from '../types.js'
import { AuthorizationError } from '../types.js'

const rolePermissions: Record<Role, readonly Permission[]> = {
  owner: ['dashboard:read','reports:read','reports:create','transactions:read','ai:ask','receipts:upload','expenses:create','invoices:pay','integrations:use','audit:read'],
  accountant: ['dashboard:read','reports:read','reports:create','transactions:read','ai:ask','receipts:upload','expenses:create'],
  employee: ['receipts:upload','expenses:create'],
  viewer: ['dashboard:read','reports:read','transactions:read'],
}

export function permissionsForRole(role:Role):readonly Permission[]{return rolePermissions[role]}
export function hasPermission(user:AuthenticatedUser,permission:Permission){return user.permissions.includes(permission)}
export function requirePermission(user:AuthenticatedUser,permission:Permission){
  if(!hasPermission(user,permission))throw new AuthorizationError(`Missing permission: ${permission}`)
}
