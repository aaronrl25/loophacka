import type { ZeroAuditLogger } from '../../audit/zero-audit-logger.js'
import { actionRequiresApproval, type ApprovalStore } from '../../security/approvals.js'
import type { BudgetManager } from './budget-manager.js'
import type { CapabilitySearchService } from './capability-search.js'
import { sanitizeZeroPayload } from './payload-sanitizer.js'
import { validateFinancialToolResult } from './result-validator.js'
import { zeroExecutionRequestSchema, type ZeroExecutionRequest, type ZeroExecutionResult, type ZeroUserContext } from './types.js'
import type { ZeroClient } from './zero-client.js'

export class CapabilityExecutor {
  private readonly results=new Map<string,ZeroExecutionResult>()
  private readonly client:ZeroClient
  private readonly search:CapabilitySearchService
  private readonly budgets:BudgetManager
  private readonly approvals:ApprovalStore
  private readonly audit:ZeroAuditLogger
  constructor(client:ZeroClient,search:CapabilitySearchService,budgets:BudgetManager,approvals:ApprovalStore,audit:ZeroAuditLogger){this.client=client;this.search=search;this.budgets=budgets;this.approvals=approvals;this.audit=audit}
  async execute(context:ZeroUserContext,input:ZeroExecutionRequest):Promise<ZeroExecutionResult>{
    const request=zeroExecutionRequestSchema.parse(input)
    if(request.userId!==context.userId||request.organizationId!==context.organizationId)throw new Error('Execution context mismatch')
    const prior=this.results.get(request.idempotencyKey);if(prior)return prior
    const ranked=this.search.get(request.capabilityId);const capability=ranked.capability;const estimatedCost=capability.pricing?.amount??0
    const budget=this.budgets.check(context.userId,context.organizationId,estimatedCost)
    const sanitized=sanitizeZeroPayload(request.input,capability.inputSchema)
    const action=typeof request.input.action==='string'?request.input.action:'external_capability'
    if(actionRequiresApproval(action,capability.riskLevel,estimatedCost,this.budgets.limits.approvalThresholdUsd)||budget.requiresCostApproval){
      if(!request.approvalId)throw new Error('Explicit approval required')
      this.approvals.consume(request.approvalId,{userId:context.userId,organizationId:context.organizationId,action,capabilityId:capability.id,inputDigest:sanitized.digest,estimatedCost})
    }
    await this.audit.write({timestamp:new Date().toISOString(),userId:context.userId,organizationId:context.organizationId,event:'capability_execute_started',selectedCapabilityId:capability.id,selectionScore:ranked.score,sharedDataCategories:sanitized.sharedDataCategories,approvalStatus:request.approvalId?'approved':'not_required',estimatedCost})
    const raw=await this.client.execute(capability,sanitized.payload,Math.min(request.maxCostUsd??this.budgets.limits.maxPerExecutionUsd,this.budgets.limits.maxPerExecutionUsd))
    const validation=validateFinancialToolResult(raw.data);const result={...raw,trusted:raw.success&&validation.trusted,validationIssues:validation.issues}
    this.results.set(request.idempotencyKey,result);this.budgets.record(context.userId,context.organizationId,result.cost??0,request.idempotencyKey)
    await this.audit.write({timestamp:new Date().toISOString(),userId:context.userId,organizationId:context.organizationId,event:'capability_execute_finished',selectedCapabilityId:capability.id,actualCost:result.cost,result:result.trusted?'trusted':result.success?'untrusted':'failure',error:result.error})
    return result
  }
}
