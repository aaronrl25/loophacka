import type { AuthenticatedUser, Permission } from '../types.js'
import { AuthenticationError, AuthorizationError } from '../types.js'
import { requirePermission } from '../policies/rbac.js'

export interface ExpressRequestLike {headers:Record<string,string|string[]|undefined>;auth?:AuthenticatedUser}
export interface ExpressResponseLike {status(code:number):ExpressResponseLike;json(body:unknown):unknown}
export type ExpressNext=(error?:unknown)=>void

export function expressPomeriumMiddleware(authenticate:(headers:Headers)=>Promise<AuthenticatedUser>){
  return async(request:ExpressRequestLike,response:ExpressResponseLike,next:ExpressNext)=>{
    try{
      const headers=new Headers()
      for(const [key,value] of Object.entries(request.headers))if(value)headers.set(key,Array.isArray(value)?value.join(','):value)
      request.auth=await authenticate(headers)
      next()
    }catch(error){
      if(error instanceof AuthenticationError)return response.status(401).json({error:'Unauthorized'})
      next(error)
    }
  }
}
export function expressRequire(permission:Permission){return(request:ExpressRequestLike,response:ExpressResponseLike,next:ExpressNext)=>{
  try{if(!request.auth)throw new AuthenticationError();requirePermission(request.auth,permission);next()}
  catch(error){if(error instanceof AuthenticationError)return response.status(401).json({error:'Unauthorized'});if(error instanceof AuthorizationError)return response.status(403).json({error:'Forbidden'});next(error)}
}}
