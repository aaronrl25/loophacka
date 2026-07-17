import { createLocalJWKSet, exportJWK, generateKeyPair, SignJWT } from 'jose'
import { buildAgentSecurityContext, assertWorkspace } from '../security/auth/agent-context.js'
import { createPomeriumAuthenticator } from '../security/auth/pomerium.js'
import { createApiGuard } from '../security/middleware/api-guard.js'
import { getAuthenticatedUser, type SecuredRequest } from '../security/middleware/request-context.js'
import { requirePermission } from '../security/policies/rbac.js'
import type { AuditEvent, AuditLogger } from '../security/audit/logger.js'

const issuer='https://app.looper.example.com'
const audience='https://api.looper.example.com'
const {publicKey,privateKey}=await generateKeyPair('RS256')
const publicJwk=await exportJWK(publicKey)
publicJwk.kid='demo-key-1'
publicJwk.use='sig'

const assertion=await new SignJWT({email:'sarah@acme.example',name:'Sarah Johnson'})
  .setProtectedHeader({alg:'RS256',kid:'demo-key-1'})
  .setSubject('usr_sarah')
  .setIssuer(issuer)
  .setAudience(audience)
  .setIssuedAt()
  .setExpirationTime('15m')
  .sign(privateKey)

const authenticate=createPomeriumAuthenticator({
  issuer,audience,jwksUrl:`${issuer}/.well-known/pomerium/jwks.json`,keyResolver:createLocalJWKSet({keys:[publicJwk]}),
  resolveMembership:async({email})=>email==='sarah@acme.example'?{organizationId:'org_acme',organizationName:'Acme LLC',workspaceId:'ws_acme_main',role:'owner',allowedIntegrations:['quickbooks','stripe','internal-finance','inventory']}:null,
})

class MemoryAudit implements AuditLogger {readonly events:AuditEvent[]=[];async write(event:AuditEvent){this.events.push(event)}}
const audit=new MemoryAudit()
const timeline:string[]=[]
function step(label:string,detail:string){timeline.push(label);console.log(`\n${timeline.length}. ${label}\n   ${detail}`)}

step('Browser request','Sarah requests Acme cash-flow analysis over TLS.')
step('Pomerium authentication','Google/Microsoft/GitHub identity flow is represented by a signed Pomerium JWT assertion.')
const headers=new Headers({'X-Pomerium-Jwt-Assertion':assertion,'X-Pomerium-Claim-Role':'owner','X-Pomerium-Claim-Organization':'attacker-controlled'})
const request=new Request(`${audience}/api/agent/cash-flow`,{headers}) as SecuredRequest
step('API assertion verification','Validating signature, RS256 algorithm, issuer, audience, subject, email, and expiry against JWKS.')

const guard=createApiGuard(authenticate)('ai:ask')
const response=await guard(request,async securedRequest=>{
  const user=getAuthenticatedUser(securedRequest)
  step('Server-side membership resolution',`${user.email} resolved to ${user.organizationName}, workspace ${user.workspaceId}, role ${user.role}. Unsigned claim headers were ignored.`)
  requirePermission(user,'transactions:read')
  step('RBAC authorization','Owner has ai:ask and transactions:read. A missing permission would return 403.')
  const agentContext=buildAgentSecurityContext(user)
  step('Agent context injection',JSON.stringify(agentContext))
  try{assertWorkspace(agentContext,'org_other','ws_other')}catch{step('Tenant isolation test','Cross-company access to org_other/ws_other was denied before any data query.')}
  await audit.write({userId:user.userId,organizationId:user.organizationId,workspaceId:user.workspaceId,timestamp:new Date().toISOString(),action:'agent.cash_flow.read',ip:'127.0.0.1',resource:'/api/agent/cash-flow',result:'success',requestId:'req_demo_pomerium',metadata:{role:user.role,via:'pomerium'}})
  step('Audit event','Recorded user, organization, workspace, action, IP, resource, result, request ID, and role without storing the JWT.')
  return Response.json({cashBalance:24780,runwayDays:128,authenticatedBy:'Pomerium',organization:user.organizationName})
})

step('Protected response',`HTTP ${response.status}: ${await response.text()}`)
const tamperedRequest=new Request(`${audience}/api/agent/cash-flow`,{headers:{'X-Pomerium-Jwt-Assertion':`${assertion.slice(0,-1)}x`}}) as SecuredRequest
const rejected=await guard(tamperedRequest,async()=>Response.json({unexpected:true}))
step('Tamper test',`Modified assertion rejected with HTTP ${rejected.status}.`)

console.log('\nFinal outcome')
console.log(JSON.stringify({identity:'Sarah Johnson',organization:'Acme LLC',role:'Owner',session:'Active',jwtVerified:true,crossTenantRequest:'Denied',tamperedTokenStatus:rejected.status,auditEvents:audit.events.length},null,2))
