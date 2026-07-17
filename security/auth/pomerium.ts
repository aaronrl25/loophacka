import { createRemoteJWKSet, jwtVerify, type JWTPayload, type JWTVerifyGetKey } from 'jose'
import { AuthenticationError, roles, type AuthenticatedUser, type Role } from '../types.js'
import { permissionsForRole } from '../policies/rbac.js'

export interface Membership {
  organizationId:string
  organizationName:string
  workspaceId:string
  role:Role
  allowedIntegrations:readonly string[]
}
export type MembershipResolver=(identity:{userId:string;email:string;claims:JWTPayload})=>Promise<Membership|null>
export interface PomeriumAuthOptions {issuer:string;audience:string;jwksUrl:string;resolveMembership:MembershipResolver;keyResolver?:JWTVerifyGetKey}

export function createPomeriumAuthenticator(options:PomeriumAuthOptions){
  const jwks=options.keyResolver??createRemoteJWKSet(new URL(options.jwksUrl))
  return async function authenticate(headers:Headers):Promise<AuthenticatedUser>{
    const assertion=headers.get('x-pomerium-jwt-assertion')
    if(!assertion)throw new AuthenticationError('Missing Pomerium JWT assertion')
    let payload:JWTPayload
    try{
      ;({payload}=await jwtVerify(assertion,jwks,{issuer:options.issuer,audience:options.audience,algorithms:['ES256','RS256']}))
    }catch{
      throw new AuthenticationError('Invalid Pomerium JWT assertion')
    }
    const userId=typeof payload.sub==='string'?payload.sub:''
    const email=typeof payload.email==='string'?payload.email.toLowerCase():''
    if(!userId||!email||!payload.exp)throw new AuthenticationError('Required identity claims are missing')
    const membership=await options.resolveMembership({userId,email,claims:payload})
    if(!membership||!roles.includes(membership.role))throw new AuthenticationError('No active Looper organization membership')
    return {
      userId,email,name:typeof payload.name==='string'?payload.name:undefined,
      ...membership,permissions:permissionsForRole(membership.role),
      sessionExpiresAt:new Date(payload.exp*1000).toISOString(),
    }
  }
}
