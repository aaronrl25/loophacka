import type { FinancialStatus } from '../types'
import { formatCurrency } from '../lib/format'
import Sparkline from './Sparkline'
import './StatusCard.css'

interface StatusCardProps {
  status: FinancialStatus
  /** Number of open (unacknowledged, non-good) alerts, to set the tone line. */
  openCount: number
}

// The lead of the daily briefing. It states where the owner stands as a
// meaning ("128 days of runway"), not a raw balance — the interpretation is the
// product. Everything here is derived from FinancialStatus.
function StatusCard({ status, openCount }: StatusCardProps) {
  const down = status.runwayDeltaDays < 0
  const deltaLabel = `${down ? '▼' : '▲'} ${down ? 'Down' : 'Up'} ${Math.abs(
    status.runwayDeltaDays,
  )} days ${status.deltaPeriod}`

  return (
    <section className="status" aria-label="Your cash position">
      <div className="status__top">
        <p className="status__label">Cash runway</p>
        <Sparkline data={status.runwayTrend} color="#bfe6d4" width={104} height={40} />
      </div>

      <div className="status__big">
        <span className="status__num">{status.runwayDays}</span>
        <span className="status__unit">days</span>
      </div>

      <p className="status__trend">{deltaLabel}</p>
      <p className="status__read">
        At today’s pace you’d reach <strong>$0 around {status.zeroDate}</strong>.
        {openCount > 0 && ` ${openCount} thing${openCount > 1 ? 's' : ''} below ${
          openCount > 1 ? 'are' : 'is'
        } pulling it down.`}
      </p>

      <div className="status__divider" />

      <dl className="status__stats">
        <div>
          <dt>In the bank</dt>
          <dd>{formatCurrency(status.cashOnHand, false)}</dd>
        </div>
        <div>
          <dt>Going out / mo</dt>
          <dd>{formatCurrency(status.monthlyBurn, false)}</dd>
        </div>
        <div>
          <dt>Owed to you</dt>
          <dd>{formatCurrency(status.owedToYou, false)}</dd>
        </div>
      </dl>
    </section>
  )
}

export default StatusCard
