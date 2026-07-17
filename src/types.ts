// Domain model for Loopy — the CFO agent. These types are the contract between
// the UI and the data layer (see src/data/loopyService.ts). A real backend can
// implement LoopyService against the same shapes with no UI changes.

export type Unit = 'currency' | 'percent' | 'months' | 'number'

export type Severity = 'critical' | 'serious' | 'warning' | 'good'

export interface Kpi {
  id: string
  label: string
  value: number
  unit: Unit
  /** Signed percentage change vs the comparison period. */
  delta: number
  /** Comparison period label, e.g. "vs last month". */
  deltaPeriod: string
  /** Whether an increase is a good thing (revenue) or bad (burn). */
  higherIsBetter: boolean
  /** ~12-point history, oldest → newest, for the sparkline. */
  trend: number[]
}

export interface CashFlowPoint {
  /** Short month label, e.g. "Jan". */
  month: string
  /** Actual closing cash for past months; null for future months. */
  actual: number | null
  /** Loopy's projected closing cash; present for every month. */
  projected: number
}

export interface Alert {
  id: string
  severity: Severity
  title: string
  detail: string
  /** ISO timestamp of when Loopy raised it. */
  raisedAt: string
  /** Loopy's recommended action. */
  recommendation: string
  /** Estimated financial impact in currency, if quantifiable. */
  impact?: number
  acknowledged: boolean
}

export type ActivityKind =
  | 'report'
  | 'anomaly'
  | 'reconciliation'
  | 'forecast'
  | 'approval'
  | 'sync'

export type ActivityStatus = 'done' | 'running' | 'pending'

export interface Activity {
  id: string
  kind: ActivityKind
  title: string
  detail: string
  at: string
  status: ActivityStatus
}

export type ChatRole = 'user' | 'loopy'

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  at: string
}

export interface CompanyInfo {
  name: string
  fiscalPeriod: string
  /** ISO timestamp of the latest data sync. */
  asOf: string
}

export interface DashboardSummary {
  company: CompanyInfo
  kpis: Kpi[]
  cashFlow: CashFlowPoint[]
  alerts: Alert[]
  activity: Activity[]
  chatHistory: ChatMessage[]
}
