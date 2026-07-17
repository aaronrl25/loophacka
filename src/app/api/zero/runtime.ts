import { MemoryZeroAuditLogger } from '../../../audit/zero-audit-logger.js'
import { ApprovalStore } from '../../../security/approvals.js'
import { BudgetManager, defaultToolBudget } from '../../../lib/zero/budget-manager.js'
import { CapabilityExecutor } from '../../../lib/zero/capability-executor.js'
import { CapabilitySearchService } from '../../../lib/zero/capability-search.js'
import { ZeroClient } from '../../../lib/zero/zero-client.js'
import type { ZeroUserContext } from '../../../lib/zero/types.js'

export const zeroAudit=new MemoryZeroAuditLogger()
export const zeroApprovals=new ApprovalStore()
export const zeroBudgets=new BudgetManager(defaultToolBudget)
export const zeroClient=new ZeroClient()
export const zeroSearch=new CapabilitySearchService(zeroClient,zeroAudit)
export const zeroExecutor=new CapabilityExecutor(zeroClient,zeroSearch,zeroBudgets,zeroApprovals,zeroAudit)
// Demo identity only. A deployed API must build this from verified Pomerium middleware.
export const demoContext:ZeroUserContext={userId:'usr_sarah',organizationId:'org_acme',workspaceId:'ws_acme_main',role:'owner',permissions:['ai:ask','integrations:use']}
