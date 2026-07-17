import { useLoopy } from './hooks/useLoopy'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import KpiCard from './components/KpiCard'
import CashFlowChart from './components/CashFlowChart'
import AlertsPanel from './components/AlertsPanel'
import ActivityFeed from './components/ActivityFeed'
import ChatPanel from './components/ChatPanel'
import './App.css'

function App() {
  const { data, loading, error, chat, sending, sendChat, acknowledgeAlert } = useLoopy()

  return (
    <div className="shell">
      <Sidebar />

      <main className="main">
        {error && <div className="state state--error">{error}</div>}

        {loading && !data && (
          <div className="state">
            <span className="state__spinner" /> Loopy is pulling your latest numbers…
          </div>
        )}

        {data && (
          <>
            <TopBar company={data.company} />

            <section className="kpis" aria-label="Key financial metrics">
              {data.kpis.map((kpi) => (
                <KpiCard key={kpi.id} kpi={kpi} />
              ))}
            </section>

            <div className="grid">
              <div className="grid__main">
                <CashFlowChart data={data.cashFlow} />
                <AlertsPanel alerts={data.alerts} onAcknowledge={acknowledgeAlert} />
              </div>
              <div className="grid__side">
                <ChatPanel messages={chat} sending={sending} onSend={sendChat} />
                <ActivityFeed activity={data.activity} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default App
