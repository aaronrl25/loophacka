// Domain model for Loopy — the plain-language cash-flow copilot for small
// business owners. These types are the contract between the UI and the data
// layer (see src/data/loopyService.ts). A real backend implements LoopyService
// against the same shapes with no UI changes — so wiring Plaid / QuickBooks
// later is a data-layer swap, not a UI rewrite.

export type Unit = 'currency' | 'percent' | 'months' | 'days' | 'number'

export type Severity = 'critical' | 'serious' | 'warning' | 'good'

/**
 * The three urgency tiers the owner actually sees in the feed. Derived from
 * severity via tierOf() so the data layer only ever sets severity.
 *   critical  — act now            (🔴 severity: critical | serious)
 *   watch     — worth a look       (🟡 severity: warning)
 *   opportunity — FYI / wins       (🟢 severity: good)
 */
export type Tier = 'critical' | 'watch' | 'opportunity'

export interface Kpi {
  id: string
  label: string
  value: number
  unit: Unit
  /** Signed percentage change vs the comparison period. */
  delta: number
  /** Comparison period label, e.g. "vs last month". */
  deltaPeriod: string
  /** Whether an increase is a good thing (sales) or bad (money going out). */
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

/** A single tap the owner can take on an alert. */
export interface AlertAction {
  label: string
  /** primary = the recommended move; danger = destructive/flagging. */
  kind: 'primary' | 'default' | 'danger'
}

export interface Alert {
  id: string
  severity: Severity
  /** Plain-language headline — the meaning, never the raw event. */
  title: string
  detail: string
  /** ISO timestamp of when Loopy raised it. */
  raisedAt: string
  /** Why this is happening — the reasoning that earns the owner's trust. */
  context?: string
  /** Loopy's recommended action, in words. */
  recommendation: string
  /** Tappable actions; the feed renders these as buttons. */
  actions?: AlertAction[]
  /** Estimated financial impact in currency, if quantifiable. */
  impact?: number
  acknowledged: boolean
}

/**
 * The headline "where do I stand" numbers that lead the daily briefing. These
 * are interpreted values (runway in days, a projected zero date) rather than
 * raw ledger figures — the interpretation is the product.
 */
export interface FinancialStatus {
  /** Days of runway at today's pace. */
  runwayDays: number
  /** Change in runway days over the comparison period (signed). */
  runwayDeltaDays: number
  deltaPeriod: string
  /** ~12-point runway history for the hero sparkline. */
  runwayTrend: number[]
  /** Human date the owner would hit $0 at today's pace, e.g. "Nov 22". */
  zeroDate: string
  cashOnHand: number
  monthlyBurn: number
  owedToYou: number
}

export type ConnectionKind = 'bank' | 'accounting' | 'payments' | 'payroll'
export type ConnectionStatus = 'connected' | 'available'

/** A data source the owner can connect. The credentials seam lives in
 * src/lib/connections.ts — this is just the display + status contract. */
export interface Connection {
  id: string
  kind: ConnectionKind
  /** Provider brand, e.g. "QuickBooks". */
  provider: string
  /** One-line description of what connecting it unlocks. */
  purpose: string
  status: ConnectionStatus
  /** Masked account label once connected, e.g. "Chase ••••4821". */
  account?: string
  /** Whether this connection is required to get first value. */
  required: boolean
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
  /** The owner's first name, for the greeting. */
  ownerName: string
  fiscalPeriod: string
  /** ISO timestamp of the latest data sync. */
  asOf: string
}

export interface DashboardSummary {
  company: CompanyInfo
  status: FinancialStatus
  kpis: Kpi[]
  cashFlow: CashFlowPoint[]
  alerts: Alert[]
  connections: Connection[]
  activity: Activity[]
  chatHistory: ChatMessage[]
}
