import type { ZeroAuditEvent } from '../lib/zero/types.js'
export interface ZeroAuditLogger {write(event:ZeroAuditEvent):Promise<void>}
export class MemoryZeroAuditLogger implements ZeroAuditLogger {readonly events:ZeroAuditEvent[]=[];async write(event:ZeroAuditEvent){this.events.push(structuredClone(event))}}
export class SafeConsoleZeroAuditLogger implements ZeroAuditLogger {async write(event:ZeroAuditEvent){console.info(JSON.stringify({audit:'zero',...event}))}}
