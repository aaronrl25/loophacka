import type { CapabilityExecutor } from '../../lib/zero/capability-executor.js'
import type { ZeroExecutionRequest, ZeroUserContext } from '../../lib/zero/types.js'
export function executeExternalCapability(executor:CapabilityExecutor){return(context:ZeroUserContext,input:ZeroExecutionRequest)=>executor.execute(context,input)}
