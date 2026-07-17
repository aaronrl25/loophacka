import { randomUUID } from 'node:crypto'

export const sensitiveActions=['send_message','purchase','subscribe','pay_invoice','place_order','share_financial_data'] as const
export type SensitiveAction=typeof sensitiveActions[number]
export interface CapabilityApproval {id:string;userId:string;organizationId:string;action:string;capabilityId:string;inputDigest:string;estimatedCost:number;expiresAt:number;usedAt?:number}
export class ApprovalStore {
  private readonly approvals=new Map<string,CapabilityApproval>()
  create(input:Omit<CapabilityApproval,'id'|'expiresAt'>,ttlMs=10*60_000){const approval={...input,id:randomUUID(),expiresAt:Date.now()+ttlMs};this.approvals.set(approval.id,approval);return approval}
  consume(id:string,expected:Omit<CapabilityApproval,'id'|'expiresAt'|'usedAt'>){const approval=this.approvals.get(id);if(!approval||approval.usedAt||approval.expiresAt<Date.now())throw new Error('Approval is missing, expired, or already used');for(const key of ['userId','organizationId','action','capabilityId','inputDigest'] as const)if(approval[key]!==expected[key])throw new Error('Approval does not match this action');approval.usedAt=Date.now();return approval}
}
export function actionRequiresApproval(action:string,risk:'low'|'medium'|'high',cost:number,threshold:number){return sensitiveActions.includes(action as SensitiveAction)||risk==='high'||cost>threshold}
