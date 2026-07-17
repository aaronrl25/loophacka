import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execFile } from 'node:child_process'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { promisify } from 'node:util'
import { loppieSystemContext } from './src/data/loppieContext.js'
import { POST as searchZero } from './src/app/api/zero/search/route.js'
import { POST as executeZero } from './src/app/api/zero/execute/route.js'
import { POST as approveZero } from './src/app/api/zero/approvals/route.js'

const execFileAsync = promisify(execFile)
const claudeCapability='api-webbersites-com-anthropic-compatible-claude-haiku-4-5-messages-88fd97bc'
const claudeUrl='https://api.webbersites.com/v1/messages'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ZeroEnvelope {
  runId: string
  ok: boolean
  body?: {content?: {text?: string}[];error?: {message?: string}}
}

function sendJson(response:ServerResponse,status:number,body:unknown){
  response.statusCode=status
  response.setHeader('Content-Type','application/json')
  response.end(JSON.stringify(body))
}

async function readBody(request:IncomingMessage){
  const chunks:Buffer[]=[]
  for await(const chunk of request)chunks.push(Buffer.from(chunk))
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as {messages?:ChatMessage[]}
}

async function handleJsonRoute(request:IncomingMessage,response:ServerResponse,handler:(body:never)=>Promise<unknown>){
  try{return sendJson(response,200,await handler(await readBody(request) as never))}
  catch(error){return sendJson(response,error instanceof Error&&/approval|required|budget|context mismatch/i.test(error.message)?403:400,{error:error instanceof Error?error.message:'Request failed'})}
}

async function handleChat(request:IncomingMessage,response:ServerResponse){
  try{
    const body=await readBody(request)
    const messages=(body.messages??[]).filter(message=>message.content.trim()).slice(-12)
    if(messages.length===0)return sendJson(response,400,{error:'A message is required.'})
    const payload=JSON.stringify({
      model:'claude-haiku-4-5',
      system:loppieSystemContext,
      messages,
      max_tokens:600,
    })
    const {stdout}=await execFileAsync('zero',['fetch','--json','--capability',claudeCapability,'--max-pay','0.01',claudeUrl,'-d',payload],{maxBuffer:1024*1024})
    const result=JSON.parse(stdout) as ZeroEnvelope
    if(!result.ok)throw new Error(result.body?.error?.message??'Claude request failed.')
    const answer=result.body?.content?.map(item=>item.text??'').join('').trim()
    if(!answer)throw new Error('Claude returned an empty response.')
    void execFileAsync('zero',['review',result.runId,'--success','--accuracy','4','--value','4','--reliability','5']).catch(()=>undefined)
    return sendJson(response,200,{answer,model:'Claude Haiku 4.5',runId:result.runId})
  }catch(error){
    const message=error instanceof Error?error.message:'Unable to reach Claude.'
    return sendJson(response,502,{error:message})
  }
}

function loppieApi(){
  return {
    name:'loppie-claude-api',
    configureServer(server:{middlewares:{use:(path:string,handler:(request:IncomingMessage,response:ServerResponse)=>void)=>void}}){
      server.middlewares.use('/api/loppie/chat',(request,response)=>{
        if(request.method!=='POST')return sendJson(response,405,{error:'Method not allowed.'})
        void handleChat(request,response)
      })
      server.middlewares.use('/api/zero/search',(request,response)=>request.method==='POST'?void handleJsonRoute(request,response,searchZero as never):sendJson(response,405,{error:'Method not allowed.'}))
      server.middlewares.use('/api/zero/execute',(request,response)=>request.method==='POST'?void handleJsonRoute(request,response,executeZero as never):sendJson(response,405,{error:'Method not allowed.'}))
      server.middlewares.use('/api/zero/approvals',(request,response)=>request.method==='POST'?void handleJsonRoute(request,response,approveZero as never):sendJson(response,405,{error:'Method not allowed.'}))
    },
    configurePreviewServer(server:{middlewares:{use:(path:string,handler:(request:IncomingMessage,response:ServerResponse)=>void)=>void}}){
      server.middlewares.use('/api/loppie/chat',(request,response)=>{
        if(request.method!=='POST')return sendJson(response,405,{error:'Method not allowed.'})
        void handleChat(request,response)
      })
      server.middlewares.use('/api/zero/search',(request,response)=>request.method==='POST'?void handleJsonRoute(request,response,searchZero as never):sendJson(response,405,{error:'Method not allowed.'}))
      server.middlewares.use('/api/zero/execute',(request,response)=>request.method==='POST'?void handleJsonRoute(request,response,executeZero as never):sendJson(response,405,{error:'Method not allowed.'}))
      server.middlewares.use('/api/zero/approvals',(request,response)=>request.method==='POST'?void handleJsonRoute(request,response,approveZero as never):sendJson(response,405,{error:'Method not allowed.'}))
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),loppieApi()],
})
