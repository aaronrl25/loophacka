import type { Connection, ConnectionKind, FinancialStatus } from '../types'
import { hasCredentials } from '../lib/connections'
import './Onboarding.css'

interface OnboardingProps {
  connections: Connection[]
  status: FinancialStatus
  connecting: ConnectionKind | null
  onConnect: (kind: ConnectionKind) => void
  /** Leave onboarding for the briefing. */
  onDone: () => void
}

// The 3-step connect flow from the mockup. It's fully clickable now (the
// connect buttons run the simulated OAuth in src/lib/connections.ts) and shows
// real value — the runway number — before setup is even finished.
function Onboarding({ connections, status, connecting, onConnect, onDone }: OnboardingProps) {
  const bank = connections.find((c) => c.kind === 'bank')
  const bankConnected = bank?.status === 'connected'
  const secondary = connections.filter((c) => c.kind !== 'bank')
  const anySecondaryConnected = secondary.some((c) => c.status === 'connected')

  return (
    <div className="onboard">
      <header className="onboard__top">
        <span className="onboard__brand">Set up Loopy</span>
        <div className="onboard__dots" aria-hidden="true">
          <i className={bankConnected ? 'on' : ''} />
          <i className={anySecondaryConnected ? 'on' : ''} />
          <i />
        </div>
      </header>

      <h1 className="onboard__title">Two connections and you’re live.</h1>
      <p className="onboard__sub">
        Add more anytime for sharper accuracy — but you’ll see a real number after the first one.
      </p>

      {/* Step 1 — bank */}
      <section className={`step ${bankConnected ? 'step--done' : 'step--active'}`}>
        <span className="step__num">{bankConnected ? '✓' : '1'}</span>
        <div className="step__body">
          <h2>Connect your bank</h2>
          <p className="step__hint">The ground truth for your cash position.</p>
          {bankConnected ? (
            <span className="step__connected">● {bank?.account} connected</span>
          ) : (
            <button
              type="button"
              className="conn-btn conn-btn--primary"
              onClick={() => onConnect('bank')}
              disabled={connecting === 'bank'}
            >
              {connecting === 'bank' ? 'Connecting…' : 'Connect with Plaid'}
            </button>
          )}
        </div>
      </section>

      {/* Step 2 — accounting / payments / payroll */}
      <section className={`step ${bankConnected ? 'step--active' : 'step--locked'}`}>
        <span className="step__num">2</span>
        <div className="step__body">
          <h2>Connect accounting, sales, or payroll</h2>
          <p className="step__hint">One tap each — no API keys, no spreadsheets.</p>
          <div className="conn-grid">
            {secondary.map((c) => {
              const isConnected = c.status === 'connected'
              const isBusy = connecting === c.kind
              return (
                <button
                  type="button"
                  key={c.id}
                  className={`conn-btn ${isConnected ? 'conn-btn--done' : ''}`}
                  onClick={() => onConnect(c.kind)}
                  disabled={isBusy || isConnected || !bankConnected}
                  title={c.purpose}
                >
                  {isConnected
                    ? `✓ ${c.provider}`
                    : isBusy
                      ? 'Connecting…'
                      : `Connect ${c.provider}`}
                  {!isConnected && hasCredentials(c.kind) && <span className="conn-live">live</span>}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Step 3 — about the business */}
      <section className="step step--locked">
        <span className="step__num">3</span>
        <div className="step__body">
          <h2>Tell us about your business</h2>
          <p className="step__hint">Three quick taps — no forms.</p>
          <div className="onboard__chips">
            <span>Industry</span>
            <span>Team size</span>
            <span>Biggest worry</span>
          </div>
        </div>
      </section>

      {/* Instant value */}
      <div className="reveal">
        <span className="reveal__num">{status.runwayDays}</span>
        <p className="reveal__text">
          <strong>Already: {status.runwayDays} days of runway.</strong> That’s from your bank alone —
          connect step 2 and we’ll sharpen it with what’s owed to you.
        </p>
      </div>

      <button type="button" className="onboard__cta" onClick={onDone}>
        {bankConnected ? 'Go to my briefing' : 'Skip for now'}
      </button>
      <p className="onboard__trust">Bank-level encryption · Read-only access · Cancel anytime</p>
    </div>
  )
}

export default Onboarding
