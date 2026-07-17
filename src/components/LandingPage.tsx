import loopyCashFlow from '../assets/loopie_pose_1.png'
import loopyInsights from '../assets/loopie_pose_2.png'
import loopyPlan from '../assets/loopie_pose_3.png'
import './LandingPage.css'

function Brand() {
  return (
    <a className="public-brand" href="/">
      <span>∞</span>
      <b>Loop<em>CFO</em></b>
    </a>
  )
}

const steps = [
  ['01', 'Connect your business', 'Link the financial tools you already use. Your credentials stay protected.'],
  ['02', 'Loopy organizes it', 'Your numbers are cleaned, categorized, and translated into plain language.'],
  ['03', 'Move with confidence', 'Get forecasts, recommendations, and a practical next step for every decision.'],
]

export function LandingPage() {
  return (
    <div className="public-site">
      <header className="public-nav public-container">
        <Brand />
        <nav aria-label="Main navigation">
          <a href="#how">How it works</a>
          <a href="#product">Product</a>
          <a href="#security">Security</a>
        </nav>
        <div>
          <a href="/app">Log in</a>
          <a className="public-cta small" href="/app">Get started <span>→</span></a>
        </div>
      </header>

      <main>
        <section className="public-hero public-container">
          <div className="public-copy">
            <small>✦ YOUR AI CFO FOR SMALL BUSINESSES</small>
            <h1>Clarity.<br />Cash Flow.<br /><em>Confidence.</em></h1>
            <p>AI-powered financial guidance that helps small businesses make smarter decisions every day.</p>
            <div className="public-actions">
              <a className="public-cta" href="/app">Start your free plan <span>→</span></a>
              <a href="#product" className="public-watch"><i>▶</i> See how it works</a>
            </div>
            <div className="public-proof">
              <span><i>J</i><i>M</i><i>S</i></span>
              <p><b>4.9/5 from 2,000+ owners</b><small>No accounting degree required.</small></p>
            </div>
          </div>
          <div className="public-loopy">
            <span className="public-orbit one" />
            <span className="public-orbit two" />
            <div className="public-float cash"><small>CASH BALANCE</small><b>$284,650</b><em>↑ 12.4% this month</em></div>
            <img src={loopyPlan} alt="Loopy presenting today’s financial plan" />
            <div className="public-float insight"><i>✦</i><span><b>Smart move!</b><small>You saved $4,200</small></span></div>
          </div>
        </section>

        <section className="public-trust">
          <div className="public-container"><span>BUILT FOR THE TOOLS YOU USE</span><b>QuickBooks</b><b>stripe</b><b>CHASE</b><b>Square</b><b>Excel</b></div>
        </section>

        <section className="public-product public-container" id="product">
          <div className="public-title">
            <small>YOUR BUSINESS, IN FOCUS</small>
            <h2>Know what’s happening.<br /><em>Before it happens.</em></h2>
            <p>One intelligent command center for every number, trend, and decision that moves your business forward.</p>
          </div>
          <div className="public-product-card">
            <div className="public-product-copy"><span>✦ AI INSIGHT</span><h3>Your quarter is trending 14% above plan.</h3><p>Loopy combined cash flow, invoices, expenses, and forecast data to identify the next best move.</p><a href="/app">Open your briefing →</a></div>
            <img src={loopyInsights} alt="Loopy reviewing a financial chart" />
            <div className="public-metrics"><span><small>Cash in bank</small><b>$284,650</b></span><span><small>Revenue</small><b>$98,540</b></span><span><small>Runway</small><b>18.4 mo</b></span></div>
          </div>
        </section>

        <section className="public-how" id="how">
          <div className="public-container">
            <div className="public-title"><small>THE LOOPCFO PROCESS</small><h2>From scattered numbers<br />to <em>confident decisions.</em></h2></div>
            <div className="public-steps">{steps.map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
          </div>
        </section>

        <section className="public-security public-container" id="security">
          <img src={loopyCashFlow} alt="Loopy reviewing cash flow" />
          <div><small>SECURE BY DESIGN</small><h2>Your numbers stay protected.</h2><p>AWS Cognito handles account access, Pomerium verifies protected requests, and Zero executes only approved external capabilities within strict budgets.</p><ul><li>Zero Trust request verification</li><li>Scoped approvals for sensitive actions</li><li>Least-privilege external data sharing</li></ul></div>
        </section>

        <section className="public-final public-container"><Brand /><h2>Your next smart money move<br />starts right here.</h2><p>Clarity, cash flow, and confidence—with Loopy by your side.</p><a className="public-cta light" href="/app">Meet your AI CFO →</a></section>
      </main>

      <footer className="public-footer public-container"><Brand /><p>© 2026 LoopCFO, Inc. Made for small businesses.</p><div><a href="#security">Privacy</a><a href="#how">How it works</a><a href="/app">Log in</a></div></footer>
    </div>
  )
}
