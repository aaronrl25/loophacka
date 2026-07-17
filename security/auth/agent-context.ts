import type { AgentSecurityContext, AuthenticatedUser } from '../types.js'

export function buildAgentSecurityContext(user:AuthenticatedUser):Readonly<AgentSecurityContext>{
  return Object.freeze({userId:user.userId,organizationId:user.organizationId,workspaceId:user.workspaceId,
    role:user.role,permissions:[...user.permissions],allowedIntegrations:[...user.allowedIntegrations]})
}

export function assertWorkspace(context:AgentSecurityContext,organizationId:string,workspaceId:string){
  if(context.organizationId!==organizationId||context.workspaceId!==workspaceId)throw new Error('Cross-tenant access denied')
}
