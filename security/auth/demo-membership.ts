import type { MembershipResolver } from './pomerium.js'

// Replace with a parameterized Postgres lookup in production. Authorization data
// belongs to Looper, not to browser headers or editable IdP profile attributes.
export const resolveDemoMembership:MembershipResolver=async({email})=>email==='sarah@acme.example'?{
  organizationId:'org_acme',organizationName:'Acme LLC',workspaceId:'ws_acme_main',role:'owner',
  allowedIntegrations:['quickbooks','stripe','internal-finance','inventory'],
}:null
