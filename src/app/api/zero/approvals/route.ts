import { sanitizeZeroPayload } from '../../../../lib/zero/payload-sanitizer.js'
import { demoContext, zeroApprovals, zeroSearch } from '../runtime.js'
export interface ApprovalInput {capabilityId:string;action:string;input:Record<string,unknown>}
export async function POST(input:ApprovalInput){const ranked=zeroSearch.get(input.capabilityId);const sanitized=sanitizeZeroPayload(input.input,ranked.capability.inputSchema);return zeroApprovals.create({userId:demoContext.userId,organizationId:demoContext.organizationId,action:input.action,capabilityId:input.capabilityId,inputDigest:sanitized.digest,estimatedCost:ranked.capability.pricing?.amount??0})}
