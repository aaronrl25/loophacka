import './Sidebar.css'

interface NavItem {
  id: string
  label: string
  icon: string
}

const nav: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: '▦' },
  { id: 'cash', label: 'Cash & runway', icon: '◷' },
  { id: 'alerts', label: 'Alerts', icon: '⚑' },
  { id: 'reports', label: 'Reports', icon: '▤' },
  { id: 'transactions', label: 'Transactions', icon: '⇄' },
  { id: 'settings', label: 'Settings', icon: '⚙' },
]

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__logo" aria-hidden="true">
          L
        </span>
        <div>
          <div className="sidebar__name">Loopy</div>
          <div className="sidebar__role">CFO Agent</div>
        </div>
      </div>

      <nav className="sidebar__nav">
        {nav.map((item, i) => (
          <button key={item.id} type="button" className={`sidebar__item ${i === 0 ? 'sidebar__item--active' : ''}`}>
            <span className="sidebar__icon" aria-hidden="true">
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar__status">
        <span className="sidebar__dot" />
        All systems synced
      </div>
    </aside>
  )
}

export default Sidebar
