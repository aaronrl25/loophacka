import { searchExternalCapabilities } from '../../../../agents/tools/search-external-capabilities.js'
import { demoContext, zeroSearch } from '../runtime.js'
import type { ZeroSearchRequest } from '../../../../lib/zero/types.js'
export async function POST(input:ZeroSearchRequest){return searchExternalCapabilities(zeroSearch)(demoContext,input)}
