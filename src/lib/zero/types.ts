import { z } from 'zod'

export const riskLevelSchema=z.enum(['low','medium','high'])
export type RiskLevel=z.infer<typeof riskLevelSchema>
export interface ZeroCapability {id:string;token:string;slug:string;name:string;description:string;category:string;method:string;url:string;inputSchema:Record<string,unknown>|null;outputSchema?:Record<string,unknown>;pricing?:{amount:number;currency:string;model:string};riskLevel:RiskLevel;reliability:number;latencyScore:number;requiredData:string[];availability:'healthy'|'unknown'|'down'}
export const zeroSearchRequestSchema=z.object({intent:z.string().trim().min(3).max(500),category:z.string().trim().max(80).optional(),requiredInputs:z.array(z.string().trim().max(80)).max(20).optional(),maxPrice:z.number().min(0).max(100).optional()})
export type ZeroSearchRequest=z.infer<typeof zeroSearchRequestSchema>
export const zeroExecutionRequestSchema=z.object({capabilityId:z.string().min(3),input:z.record(z.string(),z.unknown()),userId:z.string().min(1),organizationId:z.string().min(1),approvalId:z.string().optional(),maxCostUsd:z.number().positive().max(100).optional(),idempotencyKey:z.string().min(8).max(200)})
export type ZeroExecutionRequest=z.infer<typeof zeroExecutionRequestSchema>
export interface ZeroExecutionResult {success:boolean;data?:unknown;error?:string;cost?:number;provider?:string;executionId?:string;trusted:boolean;validationIssues?:string[]}
export interface RankedCapability {capability:ZeroCapability;score:number;reasons:string[]}
export interface ZeroUserContext {userId:string;organizationId:string;workspaceId:string;role:string;permissions:readonly string[]}
export interface ZeroAuditEvent {timestamp:string;userId:string;organizationId:string;event:string;request?:string;intent?:string;capabilityIds?:string[];selectedCapabilityId?:string;selectionScore?:number;sharedDataCategories?:string[];approvalStatus?:string;estimatedCost?:number;actualCost?:number;result?:string;error?:string;recommendation?:string}
