export type AgentStep='analyzing'|'searching'|'evaluating'|'waiting_approval'|'running'|'validating'|'ready'
export interface AgentPlan {requiresExternalCapability:boolean;intent:string;action:string;steps:AgentStep[]}
export function planExternalWork(userRequest:string):AgentPlan{
  const value=userRequest.toLowerCase();const external=/find|compare|competitive|provider|supplier|shipping|send reminder|lender-ready|research/.test(value)
  const action=/send reminder/.test(value)?'send_message':/purchase|order/.test(value)?'place_order':/subscribe/.test(value)?'subscribe':'research'
  return {requiresExternalCapability:external,intent:userRequest,action,steps:external?['analyzing','searching','evaluating',action==='research'?'running':'waiting_approval','validating','ready']:['analyzing','ready']}
}
