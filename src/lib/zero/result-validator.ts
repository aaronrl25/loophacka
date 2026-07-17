export interface FinancialValidation {trusted:boolean;issues:string[];normalized:unknown}
const currency=/^[A-Z]{3}$/
export function validateFinancialToolResult(data:unknown):FinancialValidation{
  const issues:string[]=[];const seenInvoices=new Set<string>()
  function visit(value:unknown,key='root'){
    if(Array.isArray(value)){
      const prices=value.flatMap(item=>item&&typeof item==='object'?Object.entries(item).filter(([field,amount])=>/price|cost|monthlyCost/i.test(field)&&typeof amount==='number').map(([,amount])=>amount as number):[]).filter(amount=>amount>0)
      if(prices.length>1&&Math.max(...prices)/Math.min(...prices)>5)issues.push(`Suspiciously large price difference at ${key}`)
      for(const item of value)visit(item,key);return
    }
    if(!value||typeof value!=='object')return
    const record=value as Record<string,unknown>
    const looksLikeInvoice=Object.keys(record).some(field=>/invoice.?id|invoice.?number/i.test(field))
    const hasTotal=Object.keys(record).some(field=>/amount|total|balance/i.test(field))
    if(looksLikeInvoice&&!hasTotal)issues.push(`Missing invoice total at ${key}`)
    for(const [childKey,child] of Object.entries(value)){
      const path=`${key}.${childKey}`
      if(/currency/i.test(childKey)&&typeof child==='string'&&!currency.test(child))issues.push(`Unsupported currency format at ${path}`)
      if(/percentage|percent|margin|rate/i.test(childKey)&&typeof child==='number'&&(child<0||child>100))issues.push(`Impossible percentage at ${path}`)
      if(/amount|price|cost|total|fee/i.test(childKey)&&typeof child==='number'&&(!Number.isFinite(child)||child<0))issues.push(`Invalid or negative amount at ${path}`)
      if(/fee/i.test(childKey)&&typeof child==='number'&&child>10_000)issues.push(`Unexpected provider fee at ${path}`)
      if(/date/i.test(childKey)&&typeof child==='string'&&Number.isNaN(Date.parse(child)))issues.push(`Invalid date at ${path}`)
      if(/invoice.?id|invoice.?number/i.test(childKey)&&typeof child==='string'){if(seenInvoices.has(child))issues.push(`Duplicate invoice ${child}`);seenInvoices.add(child)}
      visit(child,path)
    }
  }
  visit(data)
  if(data===null||data===undefined)issues.push('Missing result data')
  return {trusted:issues.length===0,issues,normalized:data}
}
