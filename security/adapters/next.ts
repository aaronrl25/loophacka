import type { Permission } from '../types.js'
import { createApiGuard } from '../middleware/api-guard.js'
import type { SecuredRequest } from '../middleware/request-context.js'

// Framework-neutral Web API adapter used by Next.js route handlers. The root
// middleware should authenticate broadly; route handlers still authorize the action.
export function createNextRouteGuard(authenticate:Parameters<typeof createApiGuard>[0]){
  const guard=createApiGuard(authenticate)
  return(permission:Permission|undefined,handler:(request:SecuredRequest)=>Promise<Response>)=>
    (request:Request)=>guard(permission)(request as SecuredRequest,handler)
}
