import type { Alert } from '../types'
import { formatCurrency, relativeTime } from '../lib/format'
import { tierMeta, tierOf, tierOrder } from '../lib/tiers'
import './AlertsPanel.css'

interface AlertsPanelProps {
  alerts: Alert[]
  onAcknowledge: (id: string) => void
  /** Fired when the owner taps an action; wire to the agent/approvals layer. */
  onAction?: (alertId: string, action: string) => void
}

// The daily feed. Alerts are grouped into the three urgency tiers and each card
// follows the same shape as the mockup: plain-language headline → why → action.
function AlertsPanel({ alerts, onAcknowledge, onAction }: AlertsPanelProps) {
  const groups = tierOrder
    .map((tier) => ({
      tier,
      items: alerts.filter((a) => tierOf(a.severity) === tier),
    }))
    .filter((g) => g.items.length > 0)

  return (
    <div className="feed">
      {groups.map(({ tier, items }) => {
        const meta = tierMeta[tier]
        return (
          <section className="feed__group" key={tier}>
            <header className="feed__head">
              <span className="feed__dot" style={{ background: meta.dot }} aria-hidden="true" />
              <h3 className="feed__heading">{meta.heading}</h3>
              <span className="feed__count">{items.length}</span>
            </header>

            {items.map((a) => (
              <article
                key={a.id}
                className={`alert alert--${a.severity} ${a.acknowledged ? 'alert--ack' : ''}`}
              >
                <div className="alert__top">
                  <h4 className="alert__title">{a.title}</h4>
                  <span className="alert__time">{relativeTime(a.raisedAt)}</span>
                </div>

                <p className="alert__why">
                  <span className="alert__detail">{a.detail}</span>
                  {a.context ? ` ${a.context}` : ''}
                </p>

                {(a.actions?.length || a.severity !== 'good') && (
                  <div className="alert__actions">
                    {a.actions?.map((action) => (
                      <button
                        type="button"
                        key={action.label}
                        className={`btn btn--${action.kind}`}
                        onClick={() => onAction?.(a.id, action.label)}
                      >
                        {action.label}
                      </button>
                    ))}
                    {a.severity !== 'good' &&
                      (a.acknowledged ? (
                        <span className="alert__acked">Handled ✓</span>
                      ) : (
                        <button
                          type="button"
                          className="btn btn--ghost alert__dismiss"
                          onClick={() => onAcknowledge(a.id)}
                        >
                          Dismiss
                        </button>
                      ))}
                  </div>
                )}

                {a.impact != null && (
                  <p className="alert__impact">
                    {tierOf(a.severity) === 'opportunity' ? 'Upside' : 'Impact'} ≈{' '}
                    {formatCurrency(a.impact, false)}
                    {a.id === 'a5' ? '/mo' : ''}
                  </p>
                )}
              </article>
            ))}
          </section>
        )
      })}
    </div>
  )
}

export default AlertsPanel
