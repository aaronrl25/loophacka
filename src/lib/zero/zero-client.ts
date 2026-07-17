import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import type { ZeroCapability, ZeroExecutionResult, ZeroSearchRequest } from './types.js'

const execFileAsync=promisify(execFile)
interface Runner {run(args:string[],timeoutMs?:number):Promise<string>}
const defaultRunner:Runner={async run(args,timeoutMs=30_000){const {stdout}=await execFileAsync(process.env.ZERO_RUNNER||'zero',args,{timeout:timeoutMs,maxBuffer:2*1024*1024});return stdout}}
interface RawCapability {id:string;token:string;slug:string;canonicalName?:string;name:string;description?:string;whatItDoes?:string;method:string;url:string;cost?:{amount:string;asset:string};pricing?:{kind:string};rating?:{successRate:string};availabilityStatus?:'healthy'|'unknown'|'down'}

function inferRisk(capability:RawCapability){const text=`${capability.canonicalName} ${capability.description} ${capability.whatItDoes}`.toLowerCase();return /\b(send|pay|purchase|order|subscribe|delete|write)\b/.test(text)?'high':/\b(upload|document|customer|invoice)\b/.test(text)?'medium':'low'}
function inferCategory(text:string){for(const category of ['payroll','messaging','research','shipping','document','invoice','market'])if(text.includes(category))return category;return 'general'}

export class ZeroClient {
  private readonly runner:Runner
  constructor(runner:Runner=defaultRunner){this.runner=runner}
  async search(request:ZeroSearchRequest):Promise<ZeroCapability[]>{
    const args=['search',request.intent,'--json','--limit','10','--max-cost',String(request.maxPrice??1)]
    const raw=JSON.parse(await this.runner.run(args)) as {capabilities:RawCapability[]}
    return Promise.all(raw.capabilities.map(async item=>{
      let metadata:{bodySchema?:Record<string,unknown>|null;responseSchema?:Record<string,unknown>;latencyMs?:number}={}
      try{metadata=JSON.parse(await this.runner.run(['get',item.token,'--json'])) as typeof metadata}catch{metadata={}}
      const text=`${item.canonicalName??item.name} ${item.description??''} ${item.whatItDoes??''}`.toLowerCase()
      return {id:item.id,token:item.token,slug:item.slug,name:item.canonicalName??item.name,description:item.whatItDoes??item.description??'',category:inferCategory(text),method:item.method,url:item.url,inputSchema:metadata.bodySchema??null,outputSchema:metadata.responseSchema,pricing:item.cost?{amount:Number(item.cost.amount),currency:item.cost.asset,model:item.pricing?.kind??'unknown'}:undefined,riskLevel:inferRisk(item),reliability:Number(item.rating?.successRate??0),latencyScore:metadata.latencyMs?Math.max(0,1-metadata.latencyMs/10_000):0.5,requiredData:request.requiredInputs??[],availability:item.availabilityStatus??'unknown'}
    }))
  }
  async execute(capability:ZeroCapability,input:Record<string,unknown>,maxCostUsd:number):Promise<ZeroExecutionResult>{
    if(!capability.inputSchema)throw new Error('Capability has no inspectable input schema')
    const target=new URL(capability.url)
    if(capability.method==='GET')for(const [key,value] of Object.entries(input))target.searchParams.set(key,typeof value==='string'?value:JSON.stringify(value))
    const args=['fetch','--json','--capability',capability.token,'--max-pay',String(maxCostUsd),'--timeout','60',target.toString()]
    if(capability.method!=='GET')args.push('-d',JSON.stringify(input))
    const envelope=JSON.parse(await this.retry(()=>this.runner.run(args,70_000))) as {runId:string;ok:boolean;body?:unknown;payment?:{amount?:string};status:number}
    if(envelope.runId)void this.runner.run(['review',envelope.runId,envelope.ok?'--success':'--no-success','--accuracy','4','--value','4','--reliability',envelope.ok?'5':'2']).catch(()=>undefined)
    return {success:envelope.ok,data:envelope.body,error:envelope.ok?undefined:`Provider returned ${envelope.status}`,cost:Number(envelope.payment?.amount??0),provider:capability.name,executionId:envelope.runId,trusted:false}
  }
  private async retry<T>(operation:()=>Promise<T>,attempts=3){let last:unknown;for(let attempt=0;attempt<attempts;attempt++){try{return await operation()}catch(error){last=error;if(attempt<attempts-1)await new Promise(resolve=>setTimeout(resolve,250*2**attempt))}}throw last}
}
export type {Runner as ZeroRunner}
