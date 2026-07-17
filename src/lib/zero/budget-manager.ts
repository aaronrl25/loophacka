export interface ToolBudget {maxPerExecutionUsd:number;maxDailyUserUsd:number;maxDailyOrganizationUsd:number;approvalThresholdUsd:number}
interface Spend {userId:string;organizationId:string;amount:number;at:number;idempotencyKey:string}
export class BudgetManager {
  private readonly spend:Spend[]=[]
  readonly limits:ToolBudget
  constructor(limits:ToolBudget){this.limits=limits}
  check(userId:string,organizationId:string,estimatedCost:number){
    const since=Date.now()-86_400_000;const recent=this.spend.filter(item=>item.at>=since)
    if(estimatedCost>this.limits.maxPerExecutionUsd)throw new Error('Execution exceeds per-request budget')
    if(recent.filter(item=>item.userId===userId).reduce((sum,item)=>sum+item.amount,0)+estimatedCost>this.limits.maxDailyUserUsd)throw new Error('Daily user budget exceeded')
    if(recent.filter(item=>item.organizationId===organizationId).reduce((sum,item)=>sum+item.amount,0)+estimatedCost>this.limits.maxDailyOrganizationUsd)throw new Error('Daily organization budget exceeded')
    return {requiresCostApproval:estimatedCost>this.limits.approvalThresholdUsd}
  }
  record(userId:string,organizationId:string,amount:number,idempotencyKey:string){if(this.spend.some(item=>item.idempotencyKey===idempotencyKey))return;this.spend.push({userId,organizationId,amount,at:Date.now(),idempotencyKey})}
}
export const defaultToolBudget:ToolBudget={maxPerExecutionUsd:Number(process.env.ZERO_MAX_EXECUTION_COST_USD??1),maxDailyUserUsd:Number(process.env.ZERO_DAILY_USER_BUDGET_USD??5),maxDailyOrganizationUsd:Number(process.env.ZERO_DAILY_ORG_BUDGET_USD??25),approvalThresholdUsd:Number(process.env.ZERO_APPROVAL_THRESHOLD_USD??.25)}
