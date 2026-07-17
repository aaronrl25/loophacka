import { createHash } from 'node:crypto'

const secretPattern=/password|secret|token|api.?key|authorization|credential|private.?key/i
const financialIdPattern=/account.?number|routing.?number|tax.?id|ssn|ein/i
export interface SanitizedPayload {payload:Record<string,unknown>;sharedDataCategories:string[];digest:string}
function clean(value:unknown,key:string,categories:Set<string>):unknown{
  if(secretPattern.test(key))return undefined
  if(financialIdPattern.test(key)){categories.add('masked_financial_identifier');const text=String(value);return `***${text.slice(-4)}`}
  if(Array.isArray(value))return value.slice(0,50).map(item=>clean(item,key,categories)).filter(item=>item!==undefined)
  if(value&&typeof value==='object'){const output:Record<string,unknown>={};for(const [childKey,child] of Object.entries(value))if(clean(child,childKey,categories)!==undefined)output[childKey]=clean(child,childKey,categories);return output}
  if(/email/i.test(key))categories.add('contact_email');else if(/invoice/i.test(key))categories.add('invoice_metadata');else if(/amount|price|cost|total/i.test(key))categories.add('financial_amount');else categories.add('business_context')
  return value
}
export function sanitizeZeroPayload(input:Record<string,unknown>,schema:Record<string,unknown>|null,allowedFields?:readonly string[]):SanitizedPayload{
  if(!schema)throw new Error('Cannot share data without an inspected capability schema')
  const schemaProperties=schema.properties&&typeof schema.properties==='object'?Object.keys(schema.properties):undefined
  const permitted=allowedFields??schemaProperties
  const categories=new Set<string>();const payload:Record<string,unknown>={}
  for(const [key,value] of Object.entries(input)){if(permitted&&!permitted.includes(key))continue;const cleaned=clean(value,key,categories);if(cleaned!==undefined)payload[key]=cleaned}
  const required=Array.isArray(schema.required)?schema.required.filter((key):key is string=>typeof key==='string'):[]
  const missing=required.filter(key=>payload[key]===undefined)
  if(missing.length)throw new Error(`Missing required capability input: ${missing.join(', ')}`)
  const encoded=JSON.stringify(payload);if(encoded.length>100_000)throw new Error('Sanitized payload exceeds 100KB limit')
  return {payload,sharedDataCategories:[...categories].sort(),digest:createHash('sha256').update(encoded).digest('hex')}
}
