import type { AuthenticatedUser } from '../types.js'

const authenticatedUser=Symbol('authenticated-user')
export type SecuredRequest=Request&{[authenticatedUser]?:AuthenticatedUser}
export function setAuthenticatedUser(request:SecuredRequest,user:AuthenticatedUser){request[authenticatedUser]=user}
export function getAuthenticatedUser(request:SecuredRequest){
  const user=request[authenticatedUser]
  if(!user)throw new Error('Security middleware did not authenticate this request')
  return user
}
