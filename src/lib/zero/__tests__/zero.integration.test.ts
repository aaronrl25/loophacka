import { describe,expect,it } from 'vitest'
import { MemoryZeroAuditLogger } from '../../../audit/zero-audit-logger.js'
import { ApprovalStore } from '../../../security/approvals.js'
import { BudgetManager } from '../budget-manager.js'
import { CapabilityExecutor } from '../capability-executor.js'
import { CapabilitySearchService } from '../capability-search.js'
import { sanitizeZeroPayload } from '../payload-sanitizer.js'
import { ZeroClient, type ZeroRunner } from '../zero-client.js'

describe('search to approved execution',()=>{
  it('discovers, approves, pays, validates, and audits one capability',async()=>{
    const runner:ZeroRunner={async run(args){if(args[0]==='search')return JSON.stringify({capabilities:[{id:'cap_send',token:'z_send.1',slug:'send',canonicalName:'Invoice Email',name:'Mail',whatItDoes:'send invoice reminder message',method:'POST',url:'https://mail.test',cost:{amount:'0.02',asset:'USDC'},rating:{successRate:'1'},availabilityStatus:'healthy'}]});if(args[0]==='get')return JSON.stringify({bodySchema:{type:'object'}});if(args[0]==='fetch')return JSON.stringify({runId:'run_1',ok:true,status:200,payment:{amount:'0.02'},body:{messageId:'msg_1'}});return ''}}
    const audit=new MemoryZeroAuditLogger();const approvals=new ApprovalStore();const budgets=new BudgetManager({maxPerExecutionUsd:1,maxDailyUserUsd:5,maxDailyOrganizationUsd:25,approvalThresholdUsd:.25});const client=new ZeroClient(runner);const search=new CapabilitySearchService(client,audit);const executor=new CapabilityExecutor(client,search,budgets,approvals,audit);const context={userId:'u',organizationId:'o',workspaceId:'w',role:'owner',permissions:['ai:ask'],allowedIntegrations:[]}
    const [ranked]=await search.search(context,{intent:'send overdue invoice reminder',maxPrice:.1});expect(ranked).toBeDefined();const input={action:'send_message',invoiceNumber:'INV-1',amount:100,email:'a@example.test'};const sanitized=sanitizeZeroPayload(input,ranked!.capability.inputSchema);const approval=approvals.create({userId:'u',organizationId:'o',action:'send_message',capabilityId:ranked!.capability.id,inputDigest:sanitized.digest,estimatedCost:.02});const result=await executor.execute(context,{capabilityId:ranked!.capability.id,input,userId:'u',organizationId:'o',approvalId:approval.id,idempotencyKey:'invoice-reminder-0001'});expect(result).toMatchObject({success:true,trusted:true,cost:.02});expect(audit.events.map(event=>event.event)).toEqual(['capability_search','capability_execute_started','capability_execute_finished'])
  })
})
