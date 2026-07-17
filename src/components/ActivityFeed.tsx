import type { Activity, ActivityKind, ActivityStatus } from '../types'
import { relativeTime } from '../lib/format'
import './ActivityFeed.css'

interface ActivityFeedProps {
  activity: Activity[]
}

const kindIcon: Record<ActivityKind, string> = {
  report: '📄',
  anomaly: '⚠️',
  reconciliation: '🔁',
  forecast: '📈',
  approval: '✍️',
  sync: '🔗',
}

const statusLabel: Record<ActivityStatus, string> = {
  done: 'Done',
  running: 'Running',
  pending: 'Needs you',
}

function ActivityFeed({ activity }: ActivityFeedProps) {
  return (
    <section className="panel activity">
      <header className="panel__head">
        <h2 className="panel__title">Loopy activity</h2>
        <span className="activity__live">
          <span className="activity__pulse" /> Autonomous
        </span>
      </header>

      <ul className="activity__list">
        {activity.map((a) => (
          <li key={a.id} className="act">
            <span className="act__icon" aria-hidden="true">
              {kindIcon[a.kind]}
            </span>
            <div className="act__body">
              <div className="act__row">
                <h3 className="act__title">{a.title}</h3>
                <span className={`act__status act__status--${a.status}`}>{statusLabel[a.status]}</span>
              </div>
              <p className="act__detail">{a.detail}</p>
              <time className="act__time">{relativeTime(a.at)}</time>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ActivityFeed
