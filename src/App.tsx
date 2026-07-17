import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import mascot from './assets/loppie.png'
import { useLoopy } from './hooks/useLoopy'
import { formatValue, deltaTone, formatDelta } from './lib/format'
import StatusCard from './components/StatusCard'
import AlertsPanel from './components/AlertsPanel'
import Onboarding from './components/Onboarding'
import KpiCard from './components/KpiCard'
import CashFlowChart from './components/CashFlowChart'
import ActivityFeed from './components/ActivityFeed'
import ChatPanel from './components/ChatPanel'
import { AwsAuthGate } from './components/auth/AwsAuthGate'
import { ExternalToolCard } from './components/agent/ExternalToolCard'
import { ApprovalCard } from './components/security/ApprovalCard'
import { SecurityStatus } from './components/security/SecurityStatus'
import { LandingPage } from './components/LandingPage'
import type { ConnectionKind } from './types'
import './App.css'


type View = 'briefing' | 'money' | 'assistant' | 'connect' | 'security'

const NAV: { id: View; label: string; icon: ReactNode }[] = [
  {
    id: 'briefing',
    label: 'Briefing',
    icon: (
      <>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v10h14V10" />
      </>
    ),
  },
  {
    id: 'money',
    label: 'Money',
    icon: (
      <>
        <path d="M3 17 9 11l4 4 8-9" />
        <path d="M16 6h5v5" />
      </>
    ),
  },
  {
    id: 'assistant',
    label: 'Ask Loopy',
    icon: (
      <>
        <path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5Z" />
      </>
    ),
  },
  {
    id: 'connect',
    label: 'Connect',
    icon: (
      <>
        <path d="M8 3v5M16 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4" />
      </>
    ),
  },
  {
    id: 'security',
    label: 'Security & tools',
    icon: (
      <>
        <path d="M12 3 4 6v6c0 5 3.4 8 8 9 4.6-1 8-4 8-9V6z" />
        <path d="m9 12 2 2 4-5" />
      </>
    ),
  },
]

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

/** Friendly confirmation copy for each alert action, in the owner's language. */
const ACTION_TOAST: Record<string, string> = {
  'Move money': 'Opening a $3,000 transfer from savings — clears before payroll.',
  'See the math': 'Here’s the day-by-day balance around the 30th.',
  "That's expected": 'Got it — I won’t flag NORTHBAY LLC again.',
  'Flag it': 'Flagged. I’ll help you start a dispute with the bank.',
  'Send a reminder': 'Drafted a friendly nudge to Bright Ideas LLC.',
  'See invoice': 'Opening invoice #1042.',
  'Review each': 'Pulling up your 3 unused subscriptions.',
  'Show me how': 'Comparing high-yield options with same-day access.',
}

function greetingWord(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function DashboardApp() {
  const { data, loading, error, chat, sending, sendChat, acknowledgeAlert, connecting, connect } =
    useLoopy()
  const [view, setView] = useState<View>('briefing')
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(t)
  }, [toast])

  const showToast = (msg: string) => setToast(msg)

  const handleAction = (alertId: string, action: string) => {
    showToast(ACTION_TOAST[action] ?? `On it — ${action}.`)
    if (action === "That's expected" || action === 'Flag it') acknowledgeAlert(alertId)
  }

  const handleConnect = (kind: ConnectionKind) => {
    const provider = data?.connections.find((c) => c.kind === kind)?.provider ?? 'source'
    connect(kind).then(() => showToast(`${provider} connected — refreshing your numbers.`))
  }

  if (loading) {
    return (
      <div className="boot">
        <img src={mascot} alt="" className="boot__mascot" />
        <p>Reading your accounts…</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="boot">
        <p>{error ?? 'Something went wrong.'}</p>
      </div>
    )
  }

  const { company, status, kpis, cashFlow, alerts, connections, activity } = data
  const openCount = alerts.filter((a) => !a.acknowledged && a.severity !== 'good').length
  const asOf = new Date(company.asOf).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
  const pendingConnections = connections.filter((c) => c.status === 'available').length

  return (
    <div className="app">
      {/* ── Desktop sidebar ─────────────────────────────── */}
      <aside className="sidebar">
        <div className="brand">
          <img src={mascot} alt="" className="brand__mark" />
          <span className="brand__name">Loopy</span>
        </div>
        <nav className="sidenav">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`sidenav__item ${view === item.id ? 'is-active' : ''}`}
              onClick={() => setView(item.id)}
            >
              <Icon>{item.icon}</Icon>
              <span>{item.label}</span>
              {item.id === 'briefing' && openCount > 0 && (
                <span className="sidenav__badge">{openCount}</span>
              )}
              {item.id === 'connect' && pendingConnections > 0 && (
                <span className="sidenav__badge sidenav__badge--muted">{pendingConnections}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidefoot">
          <p className="sidefoot__co">{company.name}</p>
          <p className="sidefoot__sync">Synced {asOf.split(', ')[0]}</p>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────── */}
      <main className="main">
        <header className="topbar">
          <div>
            <h1 className="topbar__greet">
              {greetingWord()}, {company.ownerName}
            </h1>
            <p className="topbar__date">{asOf}</p>
          </div>
          <button type="button" className="topbar__connect" onClick={() => setView('connect')}>
            <Icon>
              <>
                <path d="M8 3v5M16 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4" />
              </>
            </Icon>
            <span>Connect data</span>
          </button>
        </header>

        {view === 'briefing' && (
          <div className="briefing">
            <div className="briefing__main">
              <StatusCard status={status} openCount={openCount} />
              <AlertsPanel
                alerts={alerts}
                onAcknowledge={acknowledgeAlert}
                onAction={handleAction}
              />
            </div>
            <div className="briefing__rail">
              <ChatPanel messages={chat} sending={sending} onSend={sendChat} />
              <ActivityFeed activity={activity} />
            </div>
          </div>
        )}

        {view === 'money' && (
          <div className="money">
            <div className="kpi-grid">
              {kpis.map((kpi) => (
                <KpiCard key={kpi.id} kpi={kpi} />
              ))}
            </div>
            <section className="panel money__chart">
              <CashFlowChart data={cashFlow} />
            </section>
            <div className="money__lower">
              <ActivityFeed activity={activity} />
              <section className="panel money__note">
                <header className="panel__head">
                  <h2 className="panel__title">Plain-language totals</h2>
                </header>
                <ul className="money__list">
                  {kpis.map((kpi) => {
                    const tone = deltaTone(kpi.delta, kpi.higherIsBetter)
                    return (
                      <li key={kpi.id}>
                        <span>{kpi.label}</span>
                        <span className="money__val">{formatValue(kpi.value, kpi.unit)}</span>
                        <span className={`money__delta money__delta--${tone}`}>
                          {formatDelta(kpi.delta)}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </section>
            </div>
          </div>
        )}

        {view === 'assistant' && (
          <div className="assistant">
            <ChatPanel messages={chat} sending={sending} onSend={sendChat} />
          </div>
        )}

        {view === 'connect' && (
          <div className="connect-view">
            <Onboarding
              connections={connections}
              status={status}
              connecting={connecting}
              onConnect={handleConnect}
              onDone={() => setView('briefing')}
            />
          </div>
        )}

        {view === 'security' && (
          <div className="security-tools-view">
            <header className="security-tools-view__head">
              <p className="eyebrow">HACKATHON SECURITY LAYER</p>
              <h2>Pomerium protects Loopy. Zero extends what Loopy can do.</h2>
              <p>
                Identity, permissions, approvals, external capability budgets, and audit
                context stay visible in one place.
              </p>
            </header>
            <div className="security-tools-view__grid">
              <SecurityStatus
                name="Sarah Johnson"
                email="sarah@acme.example"
                organization="Acme Services LLC"
                role="Owner"
                expiresAt="Today at 6:30 PM"
                identityProvider="AWS Cognito"
              />
              <ExternalToolCard />
            </div>
            <ApprovalCard />
          </div>
        )}
      </main>

      {/* ── Mobile bottom tab bar ───────────────────────── */}
      <nav className="tabbar">
        {NAV.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`tabbar__item ${view === item.id ? 'is-active' : ''}`}
            onClick={() => setView(item.id)}
          >
            <Icon>{item.icon}</Icon>
            <span>{item.label}</span>
            {item.id === 'briefing' && openCount > 0 && <i className="tabbar__badge" />}
          </button>
        ))}
      </nav>

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  )
}

function App() {
  return window.location.pathname.startsWith('/app') ? (
    <AwsAuthGate>
      <DashboardApp />
    </AwsAuthGate>
  ) : (
    <LandingPage />
  )
}

export default App
