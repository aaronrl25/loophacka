import type { Alert, Severity } from '../types'
import { formatCurrency, relativeTime } from '../lib/format'
import './AlertsPanel.css'

interface AlertsPanelProps {
  alerts: Alert[]
  onAcknowledge: (id: string) => void
}

const severityMeta: Record<Severity, { label: string; icon: string }> = {
  critical: { label: 'Critical', icon: '▲' },
  serious: { label: 'Serious', icon: '◆' },
  warning: { label: 'Warning', icon: '●' },
  good: { label: 'Healthy', icon: '✓' },
}

function AlertsPanel({ alerts, onAcknowledge }: AlertsPanelProps) {
  const openCount = alerts.filter((a) => !a.acknowledged && a.severity !== 'good').length

  return (
    <section className="panel alerts">
      <header className="panel__head">
        <h2 className="panel__title">Alerts &amp; insights</h2>
        {openCount > 0 && <span className="alerts__count">{openCount} open</span>}
      </header>

      <ul className="alerts__list">
        {alerts.map((a) => {
          const meta = severityMeta[a.severity]
          return (
            <li key={a.id} className={`alert alert--${a.severity} ${a.acknowledged ? 'alert--ack' : ''}`}>
              <div className="alert__top">
                <span className={`alert__badge alert__badge--${a.severity}`}>
                  <span aria-hidden="true">{meta.icon}</span> {meta.label}
                </span>
                <span className="alert__time">{relativeTime(a.raisedAt)}</span>
              </div>
              <h3 className="alert__title">{a.title}</h3>
              <p className="alert__detail">{a.detail}</p>
              <div className="alert__rec">
                <span className="alert__rec-label">Loopy suggests</span> {a.recommendation}
              </div>
              <div className="alert__foot">
                {a.impact != null && (
                  <span className="alert__impact">Impact ≈ {formatCurrency(a.impact)}</span>
                )}
                {a.severity !== 'good' &&
                  (a.acknowledged ? (
                    <span className="alert__acked">Acknowledged</span>
                  ) : (
                    <button type="button" className="alert__ack-btn" onClick={() => onAcknowledge(a.id)}>
                      Acknowledge
                    </button>
                  ))}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default AlertsPanel
