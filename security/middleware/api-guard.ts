import type { Permission } from '../types.js'
import { AuthenticationError, AuthorizationError } from '../types.js'
import { requirePermission } from '../policies/rbac.js'
import { setAuthenticatedUser, type SecuredRequest } from './request-context.js'

export function createApiGuard(authenticate:(headers:Headers)=>Promise<import('../types.js').AuthenticatedUser>){
  return function guard(permission?:Permission){
    return async(request:SecuredRequest,next:(request:SecuredRequest)=>Promise<Response>):Promise<Response>=>{
      try{
        const user=await authenticate(request.headers)
        if(permission)requirePermission(user,permission)
        setAuthenticatedUser(request,user)
        return await next(request)
      }catch(error){
        if(error instanceof AuthenticationError)return Response.json({error:'Unauthorized'},{status:401})
        if(error instanceof AuthorizationError)return Response.json({error:'Forbidden'},{status:403})
        throw error
      }
    }
  }
}
