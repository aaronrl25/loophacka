import type { ZeroAuditLogger } from '../../audit/zero-audit-logger.js'
import { rankCapabilities } from './capability-ranking.js'
import { zeroSearchRequestSchema, type RankedCapability, type ZeroSearchRequest, type ZeroUserContext } from './types.js'
import type { ZeroClient } from './zero-client.js'

export class CapabilitySearchService {
  private readonly registry=new Map<string,RankedCapability>()
  private readonly client:ZeroClient
  private readonly audit:ZeroAuditLogger
  constructor(client:ZeroClient,audit:ZeroAuditLogger){this.client=client;this.audit=audit}
  async search(context:ZeroUserContext,input:ZeroSearchRequest){
    const request=zeroSearchRequestSchema.parse(input);const capabilities=await this.client.search(request);const ranked=rankCapabilities(capabilities,request)
    for(const item of ranked)this.registry.set(item.capability.id,item)
    await this.audit.write({timestamp:new Date().toISOString(),userId:context.userId,organizationId:context.organizationId,event:'capability_search',intent:request.intent,capabilityIds:ranked.map(item=>item.capability.id)})
    return ranked
  }
  get(id:string){const item=this.registry.get(id);if(!item)throw new Error('Capability must be discovered and evaluated before execution');return item}
}
