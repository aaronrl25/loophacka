import { describe,expect,it } from 'vitest'
import { ApprovalStore } from '../../../security/approvals.js'
import { BudgetManager } from '../budget-manager.js'
import { rankCapabilities } from '../capability-ranking.js'
import { sanitizeZeroPayload } from '../payload-sanitizer.js'
import { validateFinancialToolResult } from '../result-validator.js'
import type { ZeroCapability } from '../types.js'
import { ZeroClient, type ZeroRunner } from '../zero-client.js'

const capability:ZeroCapability={id:'cap_1',token:'z_test.1',slug:'payroll',name:'Payroll Research',description:'Compare payroll provider cost and pricing',category:'payroll',method:'POST',url:'https://example.test',inputSchema:{type:'object'},pricing:{amount:.1,currency:'USDC',model:'static'},riskLevel:'low',reliability:.9,latencyScore:.8,requiredData:['employees'],availability:'healthy'}
describe('Zero controls',()=>{
  it('ranks relevant, inspectable capabilities',()=>expect(rankCapabilities([capability],{intent:'compare payroll provider pricing',maxPrice:.2})[0]?.capability.id).toBe('cap_1'))
  it('removes secrets and masks account identifiers',()=>{const result=sanitizeZeroPayload({apiKey:'secret',accountNumber:'123456789',amount:42},{type:'object'});expect(result.payload).toEqual({accountNumber:'***6789',amount:42});expect(result.sharedDataCategories).toContain('masked_financial_identifier')})
  it('rejects impossible financial results',()=>expect(validateFinancialToolResult({currency:'usd',marginPercent:140}).trusted).toBe(false))
  it('flags missing totals and suspicious provider price spreads',()=>{const result=validateFinancialToolResult({invoiceNumber:'INV-1',providers:[{price:100},{price:900}]});expect(result.issues).toEqual(expect.arrayContaining(['Missing invoice total at root','Suspiciously large price difference at root.providers']))})
  it('enforces daily user budgets',()=>{const manager=new BudgetManager({maxPerExecutionUsd:1,maxDailyUserUsd:1,maxDailyOrganizationUsd:5,approvalThresholdUsd:.25});manager.record('u','o',.9,'first');expect(()=>manager.check('u','o',.2)).toThrow('Daily user budget exceeded')})
  it('makes approvals single-use and action-bound',()=>{const store=new ApprovalStore();const expected={userId:'u',organizationId:'o',action:'send_message',capabilityId:'c',inputDigest:'d',estimatedCost:.1};const approval=store.create(expected);expect(store.consume(approval.id,expected).usedAt).toBeTypeOf('number');expect(()=>store.consume(approval.id,expected)).toThrow()})
})
describe('Zero client integration contract',()=>{
  it('uses search then inspect without invented HTTP endpoints',async()=>{const calls:string[][]=[];const runner:ZeroRunner={async run(args){calls.push(args);return args[0]==='search'?JSON.stringify({capabilities:[{id:'cap_1',token:'z_test.1',slug:'test',canonicalName:'Test',name:'Test',whatItDoes:'financial research',method:'POST',url:'https://example.test',cost:{amount:'0.1',asset:'USDC'},rating:{successRate:'1'},availabilityStatus:'healthy'}]}):JSON.stringify({bodySchema:{type:'object'}})}};const client=new ZeroClient(runner);const found=await client.search({intent:'financial research'});expect(found[0]?.inputSchema).toEqual({type:'object'});expect(calls.map(call=>call[0])).toEqual(['search','get'])})
})
