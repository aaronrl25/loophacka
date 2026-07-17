import type { Kpi } from '../types'
import { deltaTone, formatDelta, formatValue } from '../lib/format'
import Sparkline from './Sparkline'
import './KpiCard.css'

interface KpiCardProps {
  kpi: Kpi
}

function KpiCard({ kpi }: KpiCardProps) {
  const tone = deltaTone(kpi.delta, kpi.higherIsBetter)
  const arrow = kpi.delta > 0 ? '↑' : kpi.delta < 0 ? '↓' : '→'

  return (
    <article className="kpi">
      <p className="kpi__label">{kpi.label}</p>
      <div className="kpi__value">{formatValue(kpi.value, kpi.unit)}</div>
      <div className="kpi__footer">
        <span
          className={`kpi__delta kpi__delta--${tone}`}
          title={`${formatDelta(kpi.delta)} ${kpi.deltaPeriod}`}
        >
          <span aria-hidden="true">{arrow}</span> {formatDelta(kpi.delta)}
        </span>
        <span className="kpi__spark">
          <Sparkline data={kpi.trend} width={72} height={26} />
        </span>
      </div>
      <p className="kpi__period">{kpi.deltaPeriod}</p>
    </article>
  )
}

export default KpiCard
