import { useState } from "react";
import type { FormEvent } from "react";
import loppieCashFlow from './assets/loopie_pose_1.png'
import loppieInsights from './assets/loopie_pose_2.png'
import loppiePlan from './assets/loopie_pose_3.png'
import { SecurityStatus } from "./components/security/SecurityStatus";
import { ApprovalCard } from "./components/security/ApprovalCard";
import { ExternalToolCard } from "./components/agent/ExternalToolCard";
import { AwsAuthGate } from './components/auth/AwsAuthGate'
import "./App.css";

type IconName =
  | "home"
  | "grid"
  | "cash"
  | "card"
  | "file"
  | "receipt"
  | "report"
  | "trend"
  | "goal"
  | "spark"
  | "plug"
  | "settings"
  | "help"
  | "logout"
  | "search"
  | "bell"
  | "send"
  | "bank"
  | "clock"
  | "users"
  | "calendar"
  | "brain"
  | "link";

const paths: Record<IconName, React.ReactNode> = {
  home: (
    <>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10M9 20v-6h6v6" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),
  link: (
    <>
      <path d="M10 13a5 5 0 0 0 7.1.1l2-2A5 5 0 0 0 12 4l-1 1" />
      <path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1-1" />
    </>
  ),
  cash: (
    <>
      <path d="M12 2v20M17 6.5c0-1.4-2.2-2.5-5-2.5S7 5.1 7 6.5 9.2 9 12 9s5 1.1 5 2.5S14.8 14 12 14s-5 1.1-5 2.5S9.2 19 12 19s5-1.1 5-2.5" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18M7 15h3" />
    </>
  ),
  file: (
    <>
      <path d="M6 2h8l4 4v16H6zM14 2v5h5M9 12h6M9 16h6" />
    </>
  ),
  receipt: (
    <>
      <path d="M5 3v18l3-2 4 2 4-2 3 2V3l-3 2-4-2-4 2zM9 10h6M9 14h6" />
    </>
  ),
  report: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 15v2M12 11v6M16 8v9" />
    </>
  ),
  trend: (
    <>
      <path d="M3 17 9 11l4 4 8-9M16 6h5v5" />
    </>
  ),
  goal: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <path d="m15 9 6-6" />
    </>
  ),
  spark: (
    <>
      <path d="m12 2 1.4 5.6L19 9l-5.6 1.4L12 16l-1.4-5.6L5 9l5.6-1.4zM19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z" />
    </>
  ),
  plug: (
    <>
      <path d="M8 3v5M16 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a8 8 0 0 0-1.8-1L14.5 3h-5l-.4 3a8 8 0 0 0-1.8 1l-2.4-1-2 3.4 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a8 8 0 0 0 1.8 1l.4 3h5l.4-3a8 8 0 0 0 1.8-1l2.4 1 2-3.4-2-1.5a7 7 0 0 0 .1-1Z" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.8 9a2.3 2.3 0 1 1 3.6 1.9c-1 .7-1.4 1.1-1.4 2.1M12 17h.01" />
    </>
  ),
  logout: (
    <>
      <path d="M10 4H4v16h6M14 8l4 4-4 4M8 12h10" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m16 16 5 5" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7M10 19h4" />
    </>
  ),
  send: (
    <>
      <path d="m3 3 18 9-18 9 4-9zM7 12h14" />
    </>
  ),
  bank: (
    <>
      <path d="m3 9 9-6 9 6M5 10h14M6 10v8M10 10v8M14 10v8M18 10v8M3 20h18" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6l4 2" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2" />
      <path d="M3 20c0-4 2.5-7 6-7s6 3 6 7M15 14c3 0 5 2.2 5 5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M7 2v6M17 2v6M3 10h18" />
    </>
  ),
  brain: (
    <>
      <path d="M9 5a3 3 0 0 0-5 2 3 3 0 0 0 0 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3M15 5a3 3 0 0 1 5 2 3 3 0 0 1 0 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3M9 5v15M15 5v15M9 9H7M15 9h2M9 15H7M15 15h2" />
    </>
  ),
};
function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

const nav: [IconName, string][] = [
  ["home", "Home"],
  ["brain", "Ask Loppie"],
  ["grid", "Dashboard"],
  ["cash", "Cash Flow"],
  ["card", "Transactions"],
  ["file", "Invoices"],
  ["receipt", "Expenses"],
  ["report", "Reports"],
  ["trend", "Forecast"],
  ["goal", "Goals"],
  ["spark", "AI Insights"],
];

function Logo() {
  return (
    <a className="brand" href="/">
      <span>∞</span>
      <div>
        <b>LoopCFO</b>
        <small>AI CFO AGENT</small>
      </div>
    </a>
  );
}

function TinyLine({ variant = 0 }: { variant?: number }) {
  return (
    <svg className="tinyline" viewBox="0 0 220 70" preserveAspectRatio="none">
      <path
        d={
          variant
            ? "M0 55 C22 43 26 27 46 32S75 51 96 36 128 22 150 29 182 5 220 12"
            : "M0 54 C25 51 29 35 48 27S76 43 99 47 134 31 151 29 177 35 198 18 220 10"
        }
      />
      <path
        className="fill"
        d={
          (variant
            ? "M0 55 C22 43 26 27 46 32S75 51 96 36 128 22 150 29 182 5 220 12"
            : "M0 54 C25 51 29 35 48 27S76 43 99 47 134 31 151 29 177 35 198 18 220 10") +
          "V70H0Z"
        }
      />
    </svg>
  );
}

function Sidebar({
  active,
  setActive,
}: {
  active: string;
  setActive: (x: string) => void;
}) {
  return (
    <aside className="sidebar">
      <Logo />
      <nav>
        {nav.map(([icon, label]) => (
          <button
            type="button"
            className={active === label ? "active" : ""}
            onClick={() => setActive(label)}
            key={label}
          >
            <Icon name={icon} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="side-sep" />
      <nav>
        <button
          type="button"
          className={active === "Integrations" ? "active" : ""}
          onClick={() => setActive("Integrations")}
        >
          <Icon name="plug" />
          <span>Integrations</span>
        </button>
        <button
          type="button"
          className={active === "Settings" ? "active" : ""}
          onClick={() => setActive("Settings")}
        >
          <Icon name="settings" />
          <span>Settings</span>
        </button>
      </nav>
      <div className="business">
        <small>Your Business</small>
        <b>Acme Services LLC</b>
        <a href="#switch">
          Switch Business <span>›</span>
        </a>
      </div>
      <div className="upgrade">
        <span>✦</span>
        <b>Upgrade to Pro</b>
        <p>Unlock advanced AI insights, forecasting and automation.</p>
        <button type="button">Upgrade Now</button>
      </div>
      <nav className="side-bottom">
        <button type="button">
          <Icon name="help" />
          <span>Help Center</span>
        </button>
        <a className="side-home" href="/">
          <Icon name="logout" />
          <span>Website</span>
        </a>
      </nav>
    </aside>
  );
}

const metrics = [
  ["bank", "Cash in Bank", "$24,780", "↑ 12.5% vs last week"],
  ["trend", "Net Profit", "$8,240", "↑ 8.2% vs last month"],
  ["clock", "Runway", "128 days", "↑ 16 days vs last month"],
  ["file", "Open Invoices", "$13,200", "3 overdue"],
];
function MetricCards() {
  return (
    <div className="metrics">
      {metrics.map(([icon, title, value, note], i) => (
        <article key={title}>
          <div className="metric-title">
            <span>{title}</span>
            <i>
              <Icon name={icon as IconName} size={16} />
            </i>
          </div>
          <b>{value}</b>
          <small className={i === 3 ? "red" : ""}>{note}</small>
        </article>
      ))}
    </div>
  );
}

function Overview() {
  return (
    <section className="panel overview">
      <div className="panel-head">
        <h2>Financial Overview</h2>
        <button type="button">May 12 – May 18⌄</button>
      </div>
      <div className="overview-grid">
        <article>
          <small>Cash Flow</small>
          <span>This Week</span>
          <b>$24,780</b>
          <em>↑ 12.5% vs last week</em>
          <TinyLine />
        </article>
        <article>
          <small>Revenue</small>
          <span>This Month</span>
          <b>$98,540</b>
          <em>↑ 18.3% vs last month</em>
          <div className="bars">
            {[32, 48, 62, 53, 68, 65, 76, 57, 82, 70, 88, 66, 91, 100].map(
              (n, i) => (
                <i key={i} style={{ height: `${n}%` }} />
              ),
            )}
          </div>
        </article>
        <article>
          <small>Expenses</small>
          <span>This Month</span>
          <b>$63,760</b>
          <em>↓ 6.2% vs last month</em>
          <div className="pie">
            <i />
          </div>
          <ul>
            <li>
              Payroll <b>42%</b>
            </li>
            <li>
              Marketing <b>24%</b>
            </li>
            <li>
              Software <b>18%</b>
            </li>
            <li>
              Rent <b>10%</b>
            </li>
          </ul>
        </article>
        <article>
          <small>Profit Margin</small>
          <span>This Month</span>
          <b>22%</b>
          <em>↑ 4.1% vs last month</em>
          <TinyLine variant={1} />
        </article>
      </div>
    </section>
  );
}

function SmallPanels() {
  return (
    <>
      <div className="twocol">
        <section className="panel insights">
          <div className="panel-head">
            <div>
              <h2>AI Insights</h2>
              <small>Powered by Looper</small>
            </div>
            <Icon name="brain" size={35} />
          </div>
          {[
            [
              "You could save $2,340/month",
              "by optimizing your software subscriptions.",
            ],
            [
              "Your best growth opportunity",
              "is increasing pricing for service packages.",
            ],
            ["Customers of yours are paying", "12 days slower than average."],
          ].map(([a, b], i) => (
            <div className="insight" key={a}>
              <i>{i === 0 ? "▣" : i === 1 ? "✣" : "◴"}</i>
              <span>
                <b>{a}</b>
                <small>{b}</small>
              </span>
              <b>›</b>
            </div>
          ))}
          <a href="#all">View all insights　›</a>
        </section>
        <section className="panel upcoming">
          <div className="panel-head">
            <h2>Upcoming</h2>
          </div>
          {[
            ["calendar", "Invoice #INV-1024", "$4,250 due in 2 days"],
            ["users", "Payroll", "$8,450 due in 5 days"],
            ["file", "Quarterly Taxes", "$6,250 due in 18 days"],
          ].map(([icon, a, b]) => (
            <div className="event" key={a}>
              <Icon name={icon as IconName} />
              <span>
                <b>{a}</b>
                <small>{b}</small>
              </span>
            </div>
          ))}
          <a href="#cal">View calendar　›</a>
        </section>
      </div>
      <div className="twocol bottom-panels">
        <section className="panel forecast">
          <div className="panel-head">
            <div>
              <h2>Cash Flow Forecast</h2>
              <b>$36,200</b>
              <small>Projected cash balance</small>
            </div>
            <button type="button">Next 30 Days⌄</button>
          </div>
          <div className="legend">
            <span>━ Optimistic</span>
            <span>┅ Realistic</span>
            <span>━ Pessimistic</span>
          </div>
          <TinyLine />
        </section>
        <section className="panel customers">
          <div className="panel-head">
            <div>
              <h2>Top Customers</h2>
              <small>This Month</small>
            </div>
          </div>
          {[
            ["1", "Tech Solutions Inc.", "$18,250"],
            ["2", "Greenfield Co.", "$12,400"],
            ["3", "Bright Ideas LLC", "$8,750"],
            ["4", "Alpha Agency", "$6,300"],
          ].map((x) => (
            <div className="customer" key={x[0]}>
              <span>{x[0]}</span>
              <b>{x[1]}</b>
              <em>{x[2]}</em>
            </div>
          ))}
          <a href="#customers">View all customers　›</a>
        </section>
      </div>
    </>
  );
}

function Chat() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  function submit(e: FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((x) => [...x, input.trim()]);
    setInput("");
  }
  return (
    <aside className="chat">
      <div className="chat-head">
        <span className="chat-avatar">
          <img src={loppieCashFlow} alt="Looper mascot" />
        </span>
        <div>
          <b>Looper Agent</b>
          <small>
            <i /> Online⌄
          </small>
        </div>
        <button type="button">⋮</button>
      </div>
      <div className="messages">
        <div className="bot row">
          <img src={loppiePlan} alt="" />
          <p>
            Hi Sarah! I’m Looper,
            <br />
            your AI CFO Agent.
          </p>
        </div>
        <div className="bot row">
          <img src={loppieInsights} alt="" />
          <p>
            I can help you with:
            <br />
            <span>
              ✓ Cash flow analysis
              <br />✓ Expense optimization
              <br />✓ Financial forecasting
              <br />✓ Scenario planning
              <br />✓ And much more!
            </span>
          </p>
        </div>
        <div className="user">
          <p>
            How is my cash flow
            <br />
            looking this month?
          </p>
        </div>
        <div className="bot row">
          <img src={loppieCashFlow} alt="" />
          <p>
            Your cash flow is strong! 💪
            <br />
            You’ve increased 12.5% compared to last month. Would you like me to
            break down the details?
          </p>
        </div>
        <div className="user">
          <p>
            Yes, show me
            <br />
            the breakdown
          </p>
        </div>
        <div className="bot row">
          <img src={loppieInsights} alt="" />
          <div className="bot-stack">
            <p>Here’s your cash flow breakdown for May:</p>
            <div className="chat-chart">
              <small>Cash Flow This Month</small>
              <b>$24,780</b>
              <em>↑ 12.5% vs April</em>
              <TinyLine />
            </div>
          </div>
        </div>
        {messages.map((m, i) => (
          <div className="user" key={i}>
            <p>{m}</p>
          </div>
        ))}
      </div>
      <form onSubmit={submit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Looper anything..."
          aria-label="Ask Looper"
        />
        <button type="submit" aria-label="Send">
          <Icon name="send" />
        </button>
      </form>
    </aside>
  );
}

const pageConfig: Record<
  string,
  {
    title: string;
    sub: string;
    metric: string;
    value: string;
    rows: string[][];
  }
> = {
  "Cash Flow": {
    title: "Cash Flow",
    sub: "Understand every dollar moving through your business.",
    metric: "Net cash flow",
    value: "+$24,780",
    rows: [
      ["May 18", "Stripe payout", "+$8,420", "Income"],
      ["May 17", "Payroll", "−$8,450", "Payroll"],
      ["May 16", "Acme Bank transfer", "+$12,000", "Transfer"],
      ["May 15", "Google Workspace", "−$432", "Software"],
    ],
  },
  Transactions: {
    title: "Transactions",
    sub: "All your business activity, organized automatically.",
    metric: "May activity",
    value: "148",
    rows: [
      ["Today", "Stripe payout", "+$8,420", "Matched"],
      ["Yesterday", "AWS", "−$1,284", "Software"],
      ["May 16", "Fresh Foods Inc.", "−$2,810", "Inventory"],
      ["May 15", "Client payment", "+$12,000", "Revenue"],
    ],
  },
  Invoices: {
    title: "Invoices",
    sub: "Create, send, and collect without chasing.",
    metric: "Outstanding",
    value: "$13,200",
    rows: [
      ["INV-1024", "Tech Solutions Inc.", "$4,250", "Due in 2 days"],
      ["INV-1023", "Greenfield Co.", "$5,800", "Sent"],
      ["INV-1022", "Bright Ideas LLC", "$3,150", "Overdue"],
      ["INV-1021", "Alpha Agency", "$6,300", "Paid"],
    ],
  },
  Expenses: {
    title: "Expenses",
    sub: "See where your money goes and find savings.",
    metric: "This month",
    value: "$63,760",
    rows: [
      ["Payroll", "Team & contractors", "$26,779", "42%"],
      ["Marketing", "Ads & campaigns", "$15,302", "24%"],
      ["Software", "Tools & subscriptions", "$11,477", "18%"],
      ["Rent", "Office & facilities", "$6,376", "10%"],
    ],
  },
  Reports: {
    title: "Reports",
    sub: "Investor-ready financials, generated in seconds.",
    metric: "Reports ready",
    value: "12",
    rows: [
      ["Profit & Loss", "May 2026", "Updated today", "Ready"],
      ["Balance Sheet", "May 2026", "Updated today", "Ready"],
      ["Cash Flow Statement", "Q2 2026", "Updated today", "Ready"],
      ["Tax Summary", "2026 YTD", "Updated yesterday", "Ready"],
    ],
  },
  Forecast: {
    title: "Forecast",
    sub: "See what comes next and plan with confidence.",
    metric: "Projected cash",
    value: "$36,200",
    rows: [
      ["Optimistic", "Strong sales, stable costs", "$62,400", "+72%"],
      ["Realistic", "Current growth continues", "$36,200", "Base"],
      ["Conservative", "Slower sales cycle", "$24,100", "−33%"],
      ["Custom scenario", "Build your own assumptions", "—", "Create"],
    ],
  },
  Goals: {
    title: "Goals",
    sub: "Turn financial ambition into measurable progress.",
    metric: "On track",
    value: "3 of 4",
    rows: [
      ["Reach $100k MRR", "$98,540", "98%", "On track"],
      ["Build 6-month reserve", "$142,000", "74%", "On track"],
      ["Reduce software spend", "$8,420", "62%", "Needs review"],
      ["Increase margin to 25%", "22%", "88%", "On track"],
    ],
  },
  "AI Insights": {
    title: "AI Insights",
    sub: "The decisions that matter, surfaced before you ask.",
    metric: "Savings found",
    value: "$4,820",
    rows: [
      [
        "Software overlap",
        "Cancel 3 duplicate tools",
        "$2,340/mo",
        "High impact",
      ],
      [
        "Pricing opportunity",
        "Service packages underpriced",
        "+$6,200/mo",
        "High impact",
      ],
      ["Slow payments", "3 customers pay 12 days late", "$18,450", "Review"],
      [
        "Inventory risk",
        "Stock level rising faster than sales",
        "$7,800",
        "Monitor",
      ],
    ],
  },
  Integrations: {
    title: "Integrations",
    sub: "Keep your entire financial stack in one loop.",
    metric: "Connected",
    value: "5 apps",
    rows: [
      ["QuickBooks", "Accounting", "Synced 2 min ago", "Connected"],
      ["Stripe", "Payments", "Synced just now", "Connected"],
      ["Chase Bank", "Banking", "Synced 8 min ago", "Connected"],
      ["Square", "Point of sale", "Not connected", "Connect"],
    ],
  },
  Settings: {
    title: "Settings",
    sub: "Manage your business, team, and preferences.",
    metric: "Plan",
    value: "Growth",
    rows: [
      ["Business profile", "Acme Services LLC", "Complete", "Manage"],
      ["Team access", "4 members", "2 admins", "Manage"],
      ["Notifications", "Weekly digest", "Enabled", "Edit"],
      ["Security", "Two-factor authentication", "Enabled", "Manage"],
    ],
  },
};

function PageMetrics({ items }: { items: [string, string, string][] }) {
  return (
    <div className="page-metrics">
      {items.map(([label, value, note]) => (
        <article key={label}>
          <small>{label}</small>
          <b>{value}</b>
          <em>{note}</em>
        </article>
      ))}
    </div>
  );
}
function DataRows({ rows }: { rows: string[][] }) {
  return (
    <div className="page-rows">
      {rows.map((row, i) => (
        <div className="table-row" key={row[0]}>
          <span className="row-icon">
            <Icon name={i % 2 ? "file" : "trend"} size={16} />
          </span>
          {row.map((cell, j) => (
            <span className={j === 2 ? "amount" : ""} key={`${cell}-${j}`}>
              {cell}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
function CashFlowPage() {
  return (
    <>
      <PageMetrics
        items={[
          ["Net cash flow", "+$24,780", "↑ 12.5% vs last month"],
          ["Cash in", "$98,540", "18 payments received"],
          ["Cash out", "$73,760", "↓ 6.2% vs last month"],
        ]}
      />
      <div className="split-panels">
        <section className="panel page-chart">
          <div className="panel-head">
            <div>
              <h2>Cash position</h2>
              <small>Actual vs forecast</small>
            </div>
            <button type="button">Last 6 months⌄</button>
          </div>
          <div className="big-chart">
            <TinyLine />
            <span className="chart-grid" />
          </div>
        </section>
        <section className="panel flow-summary">
          <div className="panel-head">
            <h2>Money movement</h2>
          </div>
          <div className="flow-ring">
            <span>
              <b>+$24.8k</b>
              <small>Net</small>
            </span>
          </div>
          <div className="flow-legend">
            <span>
              <i />
              Cash in <b>$98.5k</b>
            </span>
            <span>
              <i />
              Cash out <b>$73.8k</b>
            </span>
          </div>
        </section>
      </div>
      <section className="panel data-table">
        <div className="panel-head">
          <h2>Recent cash activity</h2>
          <button type="button">Export CSV</button>
        </div>
        <DataRows rows={pageConfig["Cash Flow"].rows} />
      </section>
    </>
  );
}
function TransactionsPage() {
  const [filter, setFilter] = useState("All");
  return (
    <>
      <PageMetrics
        items={[
          ["Total transactions", "148", "May 1–31"],
          ["Needs review", "7", "3 possible duplicates"],
          ["Auto-categorized", "94%", "Powered by LoopCFO AI"],
        ]}
      />
      <section className="panel data-table transaction-table">
        <div className="table-tools">
          <div className="filter-tabs">
            {["All", "Income", "Expenses", "Needs review"].map((x) => (
              <button
                className={filter === x ? "selected" : ""}
                type="button"
                onClick={() => setFilter(x)}
                key={x}
              >
                {x}
              </button>
            ))}
          </div>
          <div className="table-search">
            <Icon name="search" size={14} /> Search transactions
          </div>
        </div>
        <DataRows rows={pageConfig.Transactions.rows} />
        <div className="table-footer">
          Showing 4 of 148 transactions <span>‹　1　2　3　…　12　›</span>
        </div>
      </section>
    </>
  );
}
function InvoicesPage() {
  return (
    <>
      <PageMetrics
        items={[
          ["Outstanding", "$13,200", "3 open invoices"],
          ["Overdue", "$3,150", "1 invoice · 8 days"],
          ["Paid this month", "$42,680", "↑ 18% vs April"],
        ]}
      />
      <div className="invoice-board">
        {[
          ["Draft", "2", "$1,850"],
          ["Sent", "3", "$13,200"],
          ["Overdue", "1", "$3,150"],
          ["Paid", "12", "$42,680"],
        ].map(([status, count, total], i) => (
          <section className={`panel invoice-column status-${i}`} key={status}>
            <div className="panel-head">
              <h2>
                {status} <span>{count}</span>
              </h2>
              <b>{total}</b>
            </div>
            {pageConfig.Invoices.rows.slice(i, i + 2).map((row) => (
              <article className="invoice-card" key={row[0]}>
                <small>{row[0]}</small>
                <b>{row[1]}</b>
                <strong>{row[2]}</strong>
                <span>{row[3]}</span>
              </article>
            ))}
            <button type="button">+ Add invoice</button>
          </section>
        ))}
      </div>
    </>
  );
}
function ExpensesPage() {
  return (
    <>
      <PageMetrics
        items={[
          ["Total expenses", "$63,760", "↓ 6.2% vs April"],
          ["Largest category", "Payroll", "42% of spending"],
          ["Potential savings", "$2,340", "AI recommendation"],
        ]}
      />
      <div className="split-panels">
        <section className="panel expense-breakdown">
          <div className="panel-head">
            <h2>Spending by category</h2>
            <button type="button">May 2026⌄</button>
          </div>
          <div className="expense-donut">
            <span>
              $63.8k<small>Total</small>
            </span>
          </div>
        </section>
        <section className="panel category-list">
          <div className="panel-head">
            <h2>Category trends</h2>
          </div>
          {pageConfig.Expenses.rows.map((r) => (
            <div className="category-row" key={r[0]}>
              <i style={{ "--w": r[3] } as React.CSSProperties} />
              <span>
                <b>{r[0]}</b>
                <small>{r[1]}</small>
              </span>
              <strong>
                {r[2]} <small>{r[3]}</small>
              </strong>
            </div>
          ))}
        </section>
      </div>
      <section className="ai-banner">
        <Icon name="spark" />
        <div>
          <b>LoopCFO found $2,340 in monthly savings</b>
          <p>
            You have overlapping subscriptions across three software categories.
          </p>
        </div>
        <button type="button">Review savings →</button>
      </section>
    </>
  );
}
function ReportsPage() {
  return (
    <>
      <PageMetrics
        items={[
          ["Reports ready", "12", "All data current"],
          ["Next close", "8 days", "June 1, 2026"],
          ["Shared reports", "4", "2 external viewers"],
        ]}
      />
      <div className="report-grid">
        {pageConfig.Reports.rows
          .concat([
            ["Accounts Receivable", "May 2026", "Updated today", "Ready"],
            ["Expense Detail", "May 2026", "Updated today", "Ready"],
          ])
          .map((r, i) => (
            <article className="panel report-card" key={r[0]}>
              <span>
                <Icon name={i % 2 ? "cash" : "report"} size={22} />
              </span>
              <button type="button">•••</button>
              <h3>{r[0]}</h3>
              <p>
                {r[1]} · {r[2]}
              </p>
              <a href="#open">Open report →</a>
            </article>
          ))}
      </div>
    </>
  );
}
function ForecastPage() {
  const [scenario, setScenario] = useState("Realistic");
  return (
    <>
      <PageMetrics
        items={[
          ["Projected balance", "$36,200", "In 30 days"],
          ["Expected inflow", "$112,450", "Based on open pipeline"],
          ["Expected outflow", "$88,100", "Includes planned spend"],
        ]}
      />
      <section className="panel forecast-builder">
        <div className="panel-head">
          <div>
            <h2>Cash flow forecast</h2>
            <small>Next 90 days</small>
          </div>
          <div className="scenario-tabs">
            {["Optimistic", "Realistic", "Conservative"].map((x) => (
              <button
                className={scenario === x ? "selected" : ""}
                type="button"
                onClick={() => setScenario(x)}
                key={x}
              >
                {x}
              </button>
            ))}
          </div>
        </div>
        <div className="forecast-chart">
          <TinyLine variant={scenario === "Conservative" ? 1 : 0} />
          <span className="forecast-band" />
        </div>
      </section>
      <div className="forecast-assumptions">
        {pageConfig.Forecast.rows.slice(0, 3).map((r, i) => (
          <article
            className={`panel assumption ${scenario === r[0] ? "active" : ""}`}
            onClick={() => setScenario(r[0])}
            key={r[0]}
          >
            <span>{i === 0 ? "↗" : i === 1 ? "→" : "↘"}</span>
            <h3>{r[0]}</h3>
            <p>{r[1]}</p>
            <b>{r[2]}</b>
          </article>
        ))}
      </div>
    </>
  );
}
function GoalsPage() {
  return (
    <>
      <PageMetrics
        items={[
          ["On track", "3 of 4", "One goal needs attention"],
          ["Average progress", "81%", "↑ 7% this month"],
          ["Next milestone", "$100k MRR", "$1,460 remaining"],
        ]}
      />
      <div className="goals-grid">
        {pageConfig.Goals.rows.map((r, i) => (
          <article className="panel goal-card" key={r[0]}>
            <div>
              <span>
                <Icon name={i % 2 ? "cash" : "goal"} size={20} />
              </span>
              <em>{r[3]}</em>
            </div>
            <h3>{r[0]}</h3>
            <b>{r[1]}</b>
            <div className="progress">
              <i style={{ width: r[2] }} />
            </div>
            <small>{r[2]} complete</small>
          </article>
        ))}
        <button className="new-goal" type="button">
          <span>＋</span>
          <b>Create a new goal</b>
          <small>Set a target with LoopCFO</small>
        </button>
      </div>
    </>
  );
}
function InsightsPage() {
  return (
    <>
      <section className="insight-hero">
        <div>
          <small>YOUR WEEKLY BRIEFING</small>
          <h2>
            Good news, Sarah.
            <br />
            Your business is getting stronger.
          </h2>
          <p>
            LoopCFO analyzed 148 transactions, 12 invoices, and your latest
            forecast.
          </p>
        </div>
        <img src={loppieInsights} alt="Loppie presenting business insights" />
      </section>
      <div className="insight-grid">
        {pageConfig["AI Insights"].rows.map((r, i) => (
          <article className={`panel action-card impact-${i}`} key={r[0]}>
            <span className="impact">{r[3]}</span>
            <i>
              <Icon name={i % 2 ? "trend" : "spark"} size={20} />
            </i>
            <h3>{r[0]}</h3>
            <p>{r[1]}</p>
            <b>{r[2]}</b>
            <button type="button">Take action →</button>
          </article>
        ))}
      </div>
    </>
  );
}
function IntegrationsPage() {
  const apps = [
    ["QuickBooks", "QB", "Accounting", "Connected"],
    ["Stripe", "S", "Payments", "Connected"],
    ["Chase", "C", "Banking", "Connected"],
    ["Square", "□", "Point of sale", "Connect"],
    ["Shopify", "S", "Commerce", "Connect"],
    ["Gusto", "G", "Payroll", "Connect"],
    ["Excel", "X", "Spreadsheets", "Connected"],
    ["Plaid", "P", "Bank data", "Connect"],
  ];
  return (
    <>
      <PageMetrics
        items={[
          ["Connected apps", "5", "All syncing normally"],
          ["Last sync", "Just now", "Stripe payments"],
          ["Data health", "Excellent", "100% coverage"],
        ]}
      />
      <div className="integration-toolbar">
        <h2>All integrations</h2>
        <div className="table-search">
          <Icon name="search" size={14} /> Search 40+ apps
        </div>
      </div>
      <div className="integration-grid">
        {apps.map(([name, letter, type, state]) => (
          <article className="panel integration-card" key={name}>
            <i>{letter}</i>
            <div>
              <h3>{name}</h3>
              <p>{type}</p>
            </div>
            <button
              className={state === "Connected" ? "connected" : ""}
              type="button"
            >
              {state === "Connected" ? "✓ Connected" : "+ Connect"}
            </button>
          </article>
        ))}
      </div>
    </>
  );
}
function SettingsPage() {
  const [section, setSection] = useState("Business profile");
  return (
    <div className="settings-layout">
      <nav>
        {[
          "Business profile",
          "Team & access",
          "Notifications",
          "Billing",
          "Security",
        ].map((x) => (
          <button
            className={section === x ? "active" : ""}
            type="button"
            onClick={() => setSection(x)}
            key={x}
          >
            {x}
          </button>
        ))}
      </nav>
      <section className="panel settings-form">
        <div className="settings-head">
          <div>
            <h2>{section}</h2>
            <p>Manage your {section.toLowerCase()} preferences.</p>
          </div>
          <button type="button">Save changes</button>
        </div>
        {section === "Security" && <SecurityStatus name="Sarah Johnson" email="sarah@acme.example" organization="Acme LLC" role="Owner" expiresAt="Today at 6:30 PM" identityProvider="AWS Cognito" />}
        <label>
          Business name
          <input defaultValue="Acme Services LLC" />
        </label>
        <div className="form-row">
          <label>
            Industry
            <select defaultValue="Professional services">
              <option>Professional services</option>
            </select>
          </label>
          <label>
            Business type
            <select defaultValue="LLC">
              <option>LLC</option>
            </select>
          </label>
        </div>
        <label>
          Business email
          <input defaultValue="finance@acmeservices.com" />
        </label>
        <div className="form-row">
          <label>
            Fiscal year start
            <select defaultValue="January">
              <option>January</option>
            </select>
          </label>
          <label>
            Currency
            <select defaultValue="USD">
              <option>USD</option>
            </select>
          </label>
        </div>
        <div className="danger-zone">
          <div>
            <b>Connected business data</b>
            <p>Manage or remove imported financial information.</p>
          </div>
          <button type="button">Manage data</button>
        </div>
      </section>
    </div>
  );
}

function ProductPage({ name }: { name: string }) {
  const p = pageConfig[name] ?? pageConfig.Transactions;
  const action =
    name === "Invoices"
      ? "+ New invoice"
      : name === "Goals"
        ? "+ New goal"
        : name === "Reports"
          ? "+ Create report"
          : "Export";
  let body: React.ReactNode;
  switch (name) {
    case "Cash Flow":
      body = <CashFlowPage />;
      break;
    case "Transactions":
      body = <TransactionsPage />;
      break;
    case "Invoices":
      body = <InvoicesPage />;
      break;
    case "Expenses":
      body = <ExpensesPage />;
      break;
    case "Reports":
      body = <ReportsPage />;
      break;
    case "Forecast":
      body = <ForecastPage />;
      break;
    case "Goals":
      body = <GoalsPage />;
      break;
    case "AI Insights":
      body = <InsightsPage />;
      break;
    case "Integrations":
      body = <IntegrationsPage />;
      break;
    case "Settings":
      body = <SettingsPage />;
      break;
    default:
      body = <TransactionsPage />;
  }
  return (
    <div className="content product-page">
      <div className="page-title">
        <div>
          <small>ACME SERVICES LLC</small>
          <h1>{p.title}</h1>
          <p>{p.sub}</p>
        </div>
        {name !== "Settings" && <button type="button">{action}</button>}
      </div>
      {body}
    </div>
  );
}

function HackathonTools({ openLoppie }: { openLoppie: () => void }) {
  const [receiptState, setReceiptState] = useState<
    "idle" | "processing" | "done"
  >("idle");
  const [fileName, setFileName] = useState("");
  const [verified, setVerified] = useState(false);
  function scanReceipt(file: File) {
    setFileName(file.name);
    setReceiptState("processing");
    window.setTimeout(() => setReceiptState("done"), 900);
  }
  return (
    <section className="hack-tools">
      <div className="hack-heading">
        <div>
          <small>HACKATHON DEMO</small>
          <h2>Secure intelligence, ready to use.</h2>
          <p>
            Pomerium protects the financial layer. Zero gives Loppie new
            capabilities on demand.
          </p>
        </div>
        <span>
          <i /> Live demo
        </span>
      </div>
      <div className="hack-grid">
        <article className="hack-card zero-receipt">
          <div className="hack-card-head">
            <span className="hack-logo zero-logo">Z</span>
            <div>
              <small>POWERED BY ZERO</small>
              <h3>Smart receipt scanner</h3>
            </div>
            <em>$0.054 / scan</em>
          </div>
          {receiptState === "idle" && (
            <label className="receipt-drop">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) scanReceipt(file);
                }}
              />
              <Icon name="receipt" size={24} />
              <b>Drop a receipt here</b>
              <small>or click to upload a photo or PDF</small>
            </label>
          )}
          {receiptState === "processing" && (
            <div className="receipt-processing">
              <span className="scan-document">
                <Icon name="receipt" size={27} />
                <i />
              </span>
              <b>Reading {fileName}</b>
              <small>Zero is extracting and categorizing the expense…</small>
            </div>
          )}
          {receiptState === "done" && (
            <div className="receipt-result">
              <div>
                <span>
                  <small>VENDOR</small>
                  <b>Coffee House Cafe</b>
                </span>
                <span>
                  <small>DATE</small>
                  <b>May 18, 2026</b>
                </span>
              </div>
              <div>
                <span>
                  <small>CATEGORY</small>
                  <b>Meals & entertainment</b>
                </span>
                <span>
                  <small>TOTAL</small>
                  <b>$48.90</b>
                </span>
              </div>
              <footer>
                <span>✓ Totals reconciled</span>
                <button type="button" onClick={() => setReceiptState("idle")}>
                  Scan another
                </button>
              </footer>
            </div>
          )}
        </article>
        <article className="hack-card secure-loppie">
          <div className="hack-card-head">
            <span className="hack-logo pom-logo">P</span>
            <div>
              <small>PROTECTED BY POMERIUM</small>
              <h3>Secure Ask Loppie</h3>
            </div>
            <em className={verified ? "verified" : ""}>
              {verified ? "Verified" : "Locked"}
            </em>
          </div>
          <div className="identity-card">
            <span className="identity-avatar">SJ</span>
            <div>
              <small>CURRENT IDENTITY</small>
              <b>Sarah Johnson</b>
              <em>
                {verified
                  ? "Owner · Financial access granted"
                  : "Identity verification required"}
              </em>
            </div>
            <i>{verified ? "✓" : "⌁"}</i>
          </div>
          <div className="access-list">
            <span>
              <i className={verified ? "on" : ""} /> Cash flow data
            </span>
            <span>
              <i className={verified ? "on" : ""} /> Forecasting tools
            </span>
            <span>
              <i className={verified ? "on" : ""} /> Zero capabilities
            </span>
          </div>
          {verified ? (
            <button
              className="secure-action ready"
              type="button"
              onClick={openLoppie}
            >
              Ask Loppie securely <span>→</span>
            </button>
          ) : (
            <button
              className="secure-action"
              type="button"
              onClick={() => setVerified(true)}
            >
              Verify with Pomerium <span>→</span>
            </button>
          )}
        </article>
      </div>
    </section>
  );
}

function DashboardHome({ openLoppie }: { openLoppie: () => void }) {
  return (
    <div className="content">
      <div className="greeting">
        <h1>
          Good morning, Sarah! <span>👋</span>
        </h1>
        <p>Here’s what’s happening with your business.</p>
      </div>
      <section className="agent-hero">
        <div>
          <small>
            LoopCFO Agent <b>AI</b>
          </small>
          <h2>
            I’ve analyzed your data.
            <br />
            Here’s what matters today.
          </h2>
          <button type="button" onClick={openLoppie}>
            Ask LoopCFO anything　›
          </button>
        </div>
        <img src={loppiePlan} alt="Loppie presenting today’s financial plan" />
      </section>
      <HackathonTools openLoppie={openLoppie} />
      <MetricCards />
      <Overview />
      <SmallPanels />
    </div>
  );
}

function ZeroIntegration() {
  const [testResult, setTestResult] = useState<"idle" | "running" | "success">(
    "idle",
  );
  function runTest() {
    setTestResult("running");
    window.setTimeout(() => setTestResult("success"), 700);
  }
  return (
    <div className="content product-page zero-page">
      <div className="page-title">
        <div>
          <small>INTEGRATIONS</small>
          <h1>Zero</h1>
          <p>
            Discover and pay for agent capabilities without managing individual
            API keys.
          </p>
        </div>
        <span className="zero-connected">
          <i /> Connected
        </span>
      </div>
      <section className="zero-summary">
        <article>
          <span className="zero-mark">Z</span>
          <div>
            <small>ZERO ACCOUNT</small>
            <b>Managed wallet</b>
            <em>0x73d5…772</em>
          </div>
        </article>
        <article>
          <small>AVAILABLE BALANCE</small>
          <b>4.999 USDC</b>
          <em>Welcome credit active</em>
        </article>
        <article>
          <small>SPEND PROTECTION</small>
          <b>Per-call caps</b>
          <em>Enabled on every request</em>
        </article>
      </section>
      <section className="panel zero-workflow">
        <div className="panel-head">
          <div>
            <h2>Capability workflow</h2>
            <small>Every Zero request follows the same auditable path.</small>
          </div>
          <span>Ready</span>
        </div>
        <div className="zero-steps">
          {[
            ["01", "Search", "Find a live capability"],
            ["02", "Inspect", "Review schema and price"],
            ["03", "Call", "Pay with a hard spend cap"],
            ["04", "Review", "Record quality and reliability"],
          ].map(([no, title, copy], i) => (
            <article key={title}>
              <span>{no}</span>
              <i>
                <Icon
                  name={
                    i === 0
                      ? "search"
                      : i === 1
                        ? "file"
                        : i === 2
                          ? "send"
                          : "spark"
                  }
                  size={18}
                />
              </i>
              <b>{title}</b>
              <small>{copy}</small>
            </article>
          ))}
        </div>
      </section>
      <section className="panel zero-test">
        <div className="zero-test-copy">
          <small>CONNECTION TEST</small>
          <h2>Test your Zero setup</h2>
          <p>
            Replay the verified current-time capability check. This UI preview
            uses the last successful run; live paid calls remain in the
            authenticated Zero runner.
          </p>
          <button
            type="button"
            onClick={runTest}
            disabled={testResult === "running"}
          >
            {testResult === "running"
              ? "Running check…"
              : "Run connection test"}{" "}
            <span>→</span>
          </button>
        </div>
        <div className={`zero-console ${testResult}`}>
          <div>
            <span />
            <span />
            <span />
            <em>zero / test</em>
          </div>
          {testResult === "idle" && (
            <p>
              <i>$</i> Ready to test the connection.
            </p>
          )}
          {testResult === "running" && (
            <p>
              <i>$</i> Checking authenticated capability…
              <b className="zero-cursor" />
            </p>
          )}
          {testResult === "success" && (
            <>
              <p>
                <i>✓</i> Capability discovered
              </p>
              <p>
                <i>✓</i> Schema inspected · GET /api/time
              </p>
              <p>
                <i>✓</i> Payment verified · 0.001 USDC
              </p>
              <p>
                <i>✓</i> Response received · America/Los_Angeles
              </p>
              <footer>
                <span>200 OK</span>
                <b>Zero is working</b>
              </footer>
            </>
          )}
        </div>
      </section>
      <section className="panel zero-activity">
        <div className="panel-head">
          <div>
            <h2>Latest verified run</h2>
            <small>Completed through the Zero runner</small>
          </div>
          <span className="zero-run-status">
            <i /> Success
          </span>
        </div>
        <div className="zero-run-grid">
          <span>
            <small>Capability</small>
            <b>Current Time API</b>
          </span>
          <span>
            <small>Protocol</small>
            <b>x402 · Base</b>
          </span>
          <span>
            <small>Cost</small>
            <b>0.001 USDC</b>
          </span>
          <span>
            <small>Result</small>
            <b>12:28:14 PDT</b>
          </span>
        </div>
      </section>
    </div>
  );
}

const loppiePrompts = [
  "How is my cash flow looking?",
  "Where can I reduce expenses?",
  "Can I afford a new hire?",
  "Find a cheaper payroll provider",
];
function AskLoppie() {
  const [messages, setMessages] = useState<
    { role: "user" | "loppie"; text: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "thinking" | "error">("idle");
  async function ask(text: string) {
    const question = text.trim();
    if (!question || status === "thinking") return;
    const nextMessages = [
      ...messages,
      { role: "user" as const, text: question },
    ];
    setMessages(nextMessages);
    setInput("");
    setStatus("thinking");
    try {
      const response = await fetch("/api/loppie/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((message) => ({
            role: message.role === "loppie" ? "assistant" : "user",
            content: message.text,
          })),
        }),
      });
      const result = (await response.json()) as {
        answer?: string;
        error?: string;
      };
      if (!response.ok || !result.answer)
        throw new Error(result.error ?? "Loppie could not answer right now.");
      setMessages((current) => [
        ...current,
        { role: "loppie", text: result.answer as string },
      ]);
      setStatus("idle");
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "loppie",
          text:
            error instanceof Error
              ? error.message
              : "Loppie could not answer right now.",
        },
      ]);
      setStatus("error");
    }
  }
  function submit(e: FormEvent) {
    e.preventDefault();
    void ask(input);
  }
  return (
    <div className="loppie-page">
      <header>
        <span>ASK LOPPIE · CLAUDE HAIKU 4.5</span>
        <h1>Your numbers, made simple.</h1>
        <p>Ask anything about your business finances and get a clear answer.</p>
      </header>
      <div
        className={`loppie-conversation ${messages.length ? "has-messages" : ""}`}
      >
        {messages.length === 0 ? (
          <>
            <div className="loppie-portrait">
              <span />
              <img src={loppieInsights} alt="Loppie, your AI CFO" />
              <i>✦</i>
            </div>
            <div className="loppie-welcome">
              <b>Hi Sarah, what can I help you figure out?</b>
              <small>
                I’m here to make the numbers feel a little less complicated.
              </small>
            </div>
            <div className="loppie-prompts">
              {loppiePrompts.map((prompt) => (
                <button
                  type="button"
                  onClick={() => void ask(prompt)}
                  key={prompt}
                >
                  {prompt}
                  <span>↗</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="loppie-thread">
            {messages.map((message, index) => (
              <div className={message.role} key={`${message.role}-${index}`}>
                {message.role === "loppie" && <img src={loppieCashFlow} alt="" />}
                <p>{message.text}</p>
              </div>
            ))}
            {status === "thinking" && (
              <div className="loppie loppie-loading-answer" role="status" aria-label="Loppie is preparing an answer">
                <div className="loppie-loading-card">
                  <div className="loppie-loading-copy">
                    <b>Loppie is working on your idea</b>
                    <span>Checking the numbers and preparing a clear answer</span>
                  </div>
                  <div className="loppie-thinking-poses" aria-hidden="true">
                    <span>
                      <img src={loppieInsights} alt="" />
                      <small>Analyzing</small>
                    </span>
                    <span>
                      <img src={loppieCashFlow} alt="" />
                      <small>Calculating</small>
                    </span>
                    <span>
                      <img src={loppiePlan} alt="" />
                      <small>Preparing</small>
                    </span>
                  </div>
                  <p className="loppie-thinking" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </p>
                </div>
              </div>
            )}
            {messages.some(message => message.role === "user" && message.text.toLowerCase().includes("pay invoice")) && <ApprovalCard />}
            {messages.some(message => message.role === "user" && /payroll provider|cheaper payroll/i.test(message.text)) && <ExternalToolCard />}
          </div>
        )}
      </div>
      <form className="loppie-input" onSubmit={submit}>
        <span>✦</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Loppie anything about your finances..."
          aria-label="Ask Loppie"
          disabled={status === "thinking"}
        />
        <button
          type="submit"
          aria-label="Send message"
          disabled={status === "thinking" || !input.trim()}
        >
          <Icon name="send" size={17} />
        </button>
      </form>
      <small className={`loppie-note ${status === "error" ? "error" : ""}`}>
        {status === "error"
          ? "The last request failed. You can try again."
          : "Powered by Claude through Zero · Loppie can make mistakes, so review important decisions."}
      </small>
    </div>
  );
}

function DashboardApp() {
  const [active, setActive] = useState("Home");
  return (
    <div className={`app ${active === "Ask Loppie" ? "loppie-active" : ""}`}>
      <Sidebar active={active} setActive={setActive} />
      <main className="workspace">
        <header className="top">
          <div className="search">
            <Icon name="search" size={16} />
            <input placeholder="Search anything..." />
            <kbd>⌘ K</kbd>
          </div>
          <button className="bell" type="button">
            <Icon name="bell" />
            <i />
          </button>
          <div className="profile">
            <span>SJ</span>
            <div>
              <b>Sarah Johnson</b>
              <small>Owner</small>
            </div>
            <b>⌄</b>
          </div>
        </header>
        {active === "Home" || active === "Dashboard" ? (
          <DashboardHome openLoppie={() => setActive("Ask Loppie")} />
        ) : active === "Ask Loppie" ? (
          <AskLoppie />
        ) : active === "Integrations" ? (
          <ZeroIntegration />
        ) : (
          <ProductPage name={active} />
        )}
      </main>
      {active !== "Ask Loppie" && <Chat />}
    </div>
  );
}

const landingSteps = [
  [
    "link",
    "Connect your data",
    "Bring in QuickBooks, Stripe, your bank, and spreadsheets in minutes.",
  ],
  [
    "spark",
    "LoopCFO organizes it",
    "Your financial data is cleaned, categorized, and kept continuously up to date.",
  ],
  [
    "trend",
    "Move with confidence",
    "Get clear recommendations, forecasts, and a practical plan for what to do next.",
  ],
] as const;
function PublicLogo() {
  return (
    <a className="public-logo" href="/">
      <span>∞</span>
      <b>
        Loop<span>CFO</span>
      </b>
    </a>
  );
}
function Landing() {
  return (
    <div className="landing">
      <header className="landing-nav public-wrap">
        <PublicLogo />
        <nav>
          <a href="#how">How it works</a>
          <a href="#product">Product</a>
          <a href="#why">Why LoopCFO</a>
        </nav>
        <div>
          <a href="/app">Log in</a>
          <a className="public-button small" href="/app">
            Get started <span>→</span>
          </a>
        </div>
      </header>
      <main>
        <section className="landing-hero public-wrap">
          <div className="landing-copy">
            <div className="landing-kicker">
              ✦ YOUR AI CFO FOR SMALL BUSINESSES
            </div>
            <h1>
              Clarity.
              <br />
              Cash Flow.
              <br />
              <em>Confidence.</em>
            </h1>
            <p>
              AI-powered financial guidance that helps small businesses make
              smarter decisions every day.
            </p>
            <div className="landing-actions">
              <a className="public-button" href="/app">
                Start your free plan <span>→</span>
              </a>
              <a className="watch-link" href="#product">
                <i>▶</i> See how it works
              </a>
            </div>
            <div className="landing-proof">
              <span className="proof-faces">
                <i>J</i>
                <i>M</i>
                <i>S</i>
              </span>
              <p>
                <b>4.9/5 from 2,000+ owners</b>
                <small>No accounting degree required.</small>
              </p>
            </div>
          </div>
          <div className="landing-mascot">
            <span className="mascot-orbit one" />
            <span className="mascot-orbit two" />
            <div className="landing-float cash">
              <small>CASH BALANCE</small>
              <b>$284,650</b>
              <em>↑ 12.4% this month</em>
            </div>
            <img
              src={loppiePlan}
              alt="Friendly LoopCFO snake mascot holding a calculator and today's plan"
            />
            <div className="landing-float insight">
              <i>✦</i>
              <span>
                <b>Smart move!</b>
                <small>You saved $4,200</small>
              </span>
            </div>
          </div>
        </section>
        <section className="trust-strip">
          <div className="public-wrap">
            <span>BUILT FOR THE TOOLS YOU USE</span>
            <b>QuickBooks</b>
            <b>stripe</b>
            <b>CHASE</b>
            <b>Square</b>
            <b>Excel</b>
          </div>
        </section>
        <section className="product-showcase public-wrap" id="product">
          <div className="landing-section-title">
            <small>YOUR BUSINESS, IN FOCUS</small>
            <h2>
              Know what’s happening.
              <br />
              <em>Before it happens.</em>
            </h2>
            <p>
              One intelligent command center for every number, trend, and
              decision that moves your business forward.
            </p>
          </div>
          <div className="showcase-window">
            <div className="showcase-top">
              <span>◉　LoopCFO Overview</span>
              <em>Live data</em>
            </div>
            <div className="showcase-kpis">
              <span>
                <small>Cash in bank</small>
                <b>$284,650</b>
              </span>
              <span>
                <small>Revenue</small>
                <b>$98,540</b>
              </span>
              <span>
                <small>Runway</small>
                <b>18.4 mo</b>
              </span>
            </div>
            <div className="showcase-grid">
              <div>
                <small>CASH FLOW</small>
                <b>$142,890</b>
                <TinyLine />
              </div>
              <aside>
                <span>✦ AI INSIGHT</span>
                <p>
                  You’re on track to exceed your quarterly target by <b>14%.</b>
                </p>
                <a href="/app">View recommendation →</a>
              </aside>
            </div>
          </div>
        </section>
        <section className="how" id="how">
          <div className="public-wrap">
            <div className="landing-section-title">
              <small>THE LOOPCFO PROCESS</small>
              <h2>
                From scattered numbers
                <br />
                to <em>confident decisions.</em>
              </h2>
            </div>
            <div className="how-grid">
              {landingSteps.map(([icon, title, text], i) => (
                <article key={title}>
                  <span className="how-no">0{i + 1}</span>
                  <i>
                    <Icon name={icon} />
                  </i>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="why public-wrap" id="why">
          <div className="why-copy">
            <small>FINANCE WITH A HUMAN PULSE</small>
            <h2>
              Your financial partner,
              <br />
              <em>not another dashboard.</em>
            </h2>
            <p>
              LoopCFO combines the depth of an experienced CFO with the calm,
              clear guidance of a partner who knows your business.
            </p>
            <ul>
              <li>Plain-English answers, never jargon</li>
              <li>Proactive alerts before problems grow</li>
              <li>Recommendations grounded in your real data</li>
            </ul>
          </div>
          <div className="why-mascot">
            <img src={loppieCashFlow} alt="Loppie reviewing cash flow" />
            <div>
              <span>Today’s outlook</span>
              <b>Looking strong</b>
              <small>Cash flow is up 12.5%</small>
            </div>
          </div>
        </section>
        <section className="landing-cta public-wrap">
          <PublicLogo />
          <h2>
            Your next smart money move
            <br />
            starts right here.
          </h2>
          <p>
            Join thousands of owners building with clarity, cash flow, and
            confidence.
          </p>
          <a className="public-button light" href="/app">
            Meet your AI CFO　→
          </a>
          <small>No credit card required · Free 14-day trial</small>
        </section>
      </main>
      <footer className="landing-footer public-wrap">
        <PublicLogo />
        <p>© 2026 LoopCFO, Inc. Made for small businesses.</p>
        <div>
          <a href="#why">Privacy</a>
          <a href="#why">Terms</a>
          <a href="/app">Log in</a>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return window.location.pathname.startsWith("/app") ? (
    <AwsAuthGate>
      <DashboardApp />
    </AwsAuthGate>
  ) : (
    <Landing />
  );
}
export default App;
