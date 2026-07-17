import { executeExternalCapability } from '../../../../agents/tools/execute-external-capability.js'
import type { ZeroExecutionRequest } from '../../../../lib/zero/types.js'
import { demoContext, zeroExecutor } from '../runtime.js'
export async function POST(input:Omit<ZeroExecutionRequest,'userId'|'organizationId'>){return executeExternalCapability(zeroExecutor)(demoContext,{...input,userId:demoContext.userId,organizationId:demoContext.organizationId})}
