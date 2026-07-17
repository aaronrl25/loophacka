import { MemoryZeroAuditLogger } from '../src/audit/zero-audit-logger.js'
import { planExternalWork } from '../src/agents/looper-agent.js'
import { ApprovalStore } from '../src/security/approvals.js'
import { BudgetManager } from '../src/lib/zero/budget-manager.js'
import { CapabilityExecutor } from '../src/lib/zero/capability-executor.js'
import { CapabilitySearchService } from '../src/lib/zero/capability-search.js'
import { sanitizeZeroPayload } from '../src/lib/zero/payload-sanitizer.js'
import { ZeroClient, type ZeroRunner } from '../src/lib/zero/zero-client.js'

const request='Find a cheaper payroll provider. We currently pay $620 per month for 12 employees.'
const providerResult={currency:'USD',currentMonthlyCost:620,alternatives:[{provider:'Gusto Plus',monthlyCost:444,reliability:.93},{provider:'Patriot Full Service',monthlyCost:449,reliability:.88},{provider:'OnPay',monthlyCost:496,reliability:.91}]}

const runner:ZeroRunner={async run(args){
  if(args[0]==='search')return JSON.stringify({capabilities:[{id:'cap_payroll_demo',token:'z_demo.1',slug:'payroll-research',canonicalName:'Payroll Market Research',name:'Payroll Research',whatItDoes:'Compares payroll provider pricing and features for small businesses',method:'POST',url:'https://provider.invalid/research',cost:{amount:'0.20',asset:'USDC'},pricing:{kind:'static'},rating:{successRate:'0.95'},availabilityStatus:'healthy'}]})
  if(args[0]==='get')return JSON.stringify({bodySchema:{type:'object',required:['employeeCount','currentMonthlyCost','country'],properties:{employeeCount:{type:'number'},currentMonthlyCost:{type:'number'},country:{type:'string'}}},responseSchema:{currency:{type:'string'},alternatives:{type:'array'}}})
  if(args[0]==='fetch')return JSON.stringify({runId:'run_demo_payroll',ok:true,status:200,latencyMs:420,payment:{amount:'0.20'},body:providerResult})
  return ''
}}

const context={userId:'usr_sarah',organizationId:'org_acme',workspaceId:'ws_acme_main',role:'owner',permissions:['ai:ask','integrations:use'],allowedIntegrations:[]}
const audit=new MemoryZeroAuditLogger()
const approvals=new ApprovalStore()
const budgets=new BudgetManager({maxPerExecutionUsd:1,maxDailyUserUsd:5,maxDailyOrganizationUsd:25,approvalThresholdUsd:.25})
const client=new ZeroClient(runner)
const search=new CapabilitySearchService(client,audit)
const executor=new CapabilityExecutor(client,search,budgets,approvals,audit)

const timeline:string[]=[]
function step(label:string,detail:string){timeline.push(label);console.log(`\n${timeline.length}. ${label}\n   ${detail}`)}

step('Analyzing request',request)
const plan=planExternalWork(request)
step('Planning',`External capability required: ${plan.requiresExternalCapability}; action: ${plan.action}`)
step('Searching capabilities','Zero search intent: payroll provider pricing comparison; maximum cost: $0.25')
const [selected]=await search.search(context,{intent:request,category:'payroll',requiredInputs:['employeeCount','currentMonthlyCost','country'],maxPrice:.25})
if(!selected)throw new Error('No safe capability found')
step('Evaluating providers',`${selected.capability.name} selected; score ${selected.score}; risk ${selected.capability.riskLevel}; expected cost $${selected.capability.pricing?.amount}`)

const input={action:'share_financial_data',employeeCount:12,currentMonthlyCost:620,country:'US',payrollRecords:['not shared'],bankAccountNumber:'123456789',apiToken:'not-shared'}
const sanitized=sanitizeZeroPayload(input,selected.capability.inputSchema)
step('Minimizing data',`Shared categories: ${sanitized.sharedDataCategories.join(', ')}; fields sent: ${Object.keys(sanitized.payload).join(', ')}`)
const approval=approvals.create({userId:context.userId,organizationId:context.organizationId,action:'share_financial_data',capabilityId:selected.capability.id,inputDigest:sanitized.digest,estimatedCost:selected.capability.pricing?.amount??0})
step('Waiting for approval',`Approval ${approval.id} is user-, organization-, action-, payload-, and cost-bound; expires in 10 minutes`)
step('Approval received','Sarah approved this single research execution. No subscription or purchase was authorized.')
step('Running tool','Executing through Zero with a hard $1.00 request cap and idempotency key')
const result=await executor.execute(context,{capabilityId:selected.capability.id,input,userId:context.userId,organizationId:context.organizationId,approvalId:approval.id,maxCostUsd:1,idempotencyKey:'demo-payroll-research-0001'})
step('Validating result',`Trusted: ${result.trusted}; actual cost: $${result.cost}; issues: ${result.validationIssues?.join(', ')||'none'}`)

const alternatives=[...providerResult.alternatives].sort((a,b)=>a.monthlyCost-b.monthlyCost)
const best=alternatives[0]!
const monthlySavings=providerResult.currentMonthlyCost-best.monthlyCost
step('Financial recommendation ready',`${best.provider}: $${best.monthlyCost}/month; save $${monthlySavings}/month or $${monthlySavings*12}/year; confidence high`)

console.log('\nFinal outcome')
console.log(JSON.stringify({currentCost:providerResult.currentMonthlyCost,recommendedOption:best.provider,recommendedCost:best.monthlyCost,monthlySavings,annualSavings:monthlySavings*12,confidence:'High',action:'Review provider details — no subscription created',auditEvents:audit.events.length},null,2))
