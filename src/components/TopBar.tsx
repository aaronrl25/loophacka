import type { CompanyInfo } from '../types'
import './TopBar.css'

interface TopBarProps {
  company: CompanyInfo
}

function TopBar({ company }: TopBarProps) {
  const asOf = new Date(company.asOf).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

  return (
    <header className="topbar">
      <div>
        <h1 className="topbar__title">Financial overview</h1>
        <p className="topbar__meta">
          {company.name} · {company.fiscalPeriod}
        </p>
      </div>
      <div className="topbar__right">
        <span className="topbar__sync">
          <span className="topbar__sync-dot" /> Updated {asOf}
        </span>
        <div className="topbar__user" title="CFO">
          CFO
        </div>
      </div>
    </header>
  )
}

export default TopBar
