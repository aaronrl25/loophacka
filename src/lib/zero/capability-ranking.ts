import type { RankedCapability, ZeroCapability, ZeroSearchRequest } from './types.js'

const words=(value:string)=>new Set(value.toLowerCase().match(/[a-z0-9]+/g)??[])
export function rankCapabilities(capabilities:ZeroCapability[],request:ZeroSearchRequest):RankedCapability[]{
  const intent=words(request.intent)
  return capabilities.map(capability=>{
    const description=words(`${capability.name} ${capability.description} ${capability.category}`)
    const overlap=[...intent].filter(word=>description.has(word)).length/Math.max(intent.size,1)
    const compatibility=capability.inputSchema?1:0
    const financial=/payroll|price|cost|invoice|financial|supplier|shipping|market|document/.test(capability.description.toLowerCase())?1:.3
    const price=capability.pricing?.amount??0
    const affordability=request.maxPrice===undefined?1:Math.max(0,1-price/Math.max(request.maxPrice,.01))
    const quality=capability.availability==='healthy'?1:capability.availability==='unknown'?0.5:0
    const risk=capability.riskLevel==='low'?1:capability.riskLevel==='medium'?0.6:0.2
    const score=overlap*.3+capability.reliability*.2+financial*.2+affordability*.15+quality*.1+capability.latencyScore*.05
    const adjusted=score*compatibility*risk
    return {capability,score:Number(adjusted.toFixed(4)),reasons:[`${Math.round(overlap*100)}% intent overlap`,`${Math.round(capability.reliability*100)}% observed reliability`,`${capability.riskLevel} risk`,`${price} ${capability.pricing?.currency??'USD'}`]}
  }).filter(item=>item.capability.inputSchema&&item.capability.availability!=='down'&&(request.maxPrice===undefined||(item.capability.pricing?.amount??0)<=request.maxPrice)).sort((a,b)=>b.score-a.score)
}
