export type AuditResult='success'|'denied'|'failure'
export interface AuditEvent {userId:string;organizationId:string;workspaceId:string;timestamp:string;action:string;ip:string;resource:string;result:AuditResult;requestId:string;metadata?:Record<string,unknown>}
export interface AuditLogger {write(event:AuditEvent):Promise<void>}
export interface Queryable {query(sql:string,values:readonly unknown[]):Promise<unknown>}

export class PostgresAuditLogger implements AuditLogger {
  constructor(private readonly db:Queryable){}
  async write(event:AuditEvent){
    await this.db.query('INSERT INTO audit_events (user_id, organization_id, workspace_id, occurred_at, action, ip, resource, result, request_id, metadata) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
      [event.userId,event.organizationId,event.workspaceId,event.timestamp,event.action,event.ip,event.resource,event.result,event.requestId,JSON.stringify(event.metadata??{})])
  }
}
