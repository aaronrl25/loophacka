import type { AuthenticatedUser } from '../types.js'
import { requirePermission } from '../policies/rbac.js'

export interface ApprovalRequest {id:string;organizationId:string;workspaceId:string;action:'invoice:pay';resourceId:string;description:string;amount:number;vendor:string;status:'pending'|'approved'|'cancelled';requestedAt:string;decidedAt?:string;decidedBy?:string}
export interface ApprovalRepository {find(id:string):Promise<ApprovalRequest|null>;save(request:ApprovalRequest):Promise<void>}

export async function decideApproval(repository:ApprovalRepository,user:AuthenticatedUser,id:string,decision:'approved'|'cancelled'){
  requirePermission(user,'invoices:pay')
  const approval=await repository.find(id)
  if(!approval||approval.organizationId!==user.organizationId||approval.workspaceId!==user.workspaceId)throw new Error('Approval not found')
  if(approval.status!=='pending')throw new Error('Approval already decided')
  const updated={...approval,status:decision,decidedAt:new Date().toISOString(),decidedBy:user.userId}
  await repository.save(updated)
  return updated
}
