import type { AgentSecurityContext } from '../types.js'

const integrationTools:Record<string,readonly string[]>={
  quickbooks:['quickbooks.read_*','quickbooks.create_report'],stripe:['stripe.read_*','stripe.create_invoice'],
  'internal-finance':['finance.read_*','finance.forecast'],inventory:['inventory.read_*'],
}
export function allowedMcpTools(context:AgentSecurityContext){return context.allowedIntegrations.flatMap(name=>integrationTools[name]??[])}
