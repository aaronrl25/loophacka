export const loppieBusinessData = {
  business: {
    name: 'Acme Services LLC',
    owner: 'Sarah Johnson',
    industry: 'Professional services',
    period: 'May 2026',
    dataAsOf: '2026-05-18T12:30:00-07:00',
    connectedSources: ['QuickBooks', 'Stripe', 'Chase Bank', 'Square', 'Excel'],
  },
  cash: {
    bankBalance: 24780,
    netCashFlowThisMonth: 24780,
    cashCollected: 98540,
    cashPaid: 73760,
    downsideRunwayDays: 128,
    runwayDefinition: 'Days current cash covers committed obligations if new sales stop',
    projectedBalanceIn30Days: 36200,
    expected30DayInflows: 112450,
    expected30DayOutflows: 88100,
  },
  profitAndLoss: {
    revenue: 98540,
    costOfServices: 26540,
    grossProfit: 72000,
    grossMarginPercent: 73.1,
    operatingExpenses: 63760,
    netProfit: 8240,
    netMarginPercent: 8.4,
  },
  expenseCategories: [
    {category: 'Payroll and contractors', amount: 26779, sharePercent: 42},
    {category: 'Marketing', amount: 15302, sharePercent: 24},
    {category: 'Software', amount: 11477, sharePercent: 18},
    {category: 'Rent and facilities', amount: 6376, sharePercent: 10},
    {category: 'Other operating expenses', amount: 3826, sharePercent: 6},
  ],
  invoices: {
    outstandingTotal: 13200,
    records: [
      {number: 'INV-1024', customer: 'Tech Solutions Inc.', amount: 4250, status: 'Due in 2 days'},
      {number: 'INV-1023', customer: 'Greenfield Co.', amount: 5800, status: 'Sent'},
      {number: 'INV-1022', customer: 'Bright Ideas LLC', amount: 3150, status: 'Overdue by 8 days'},
      {number: 'INV-1021', customer: 'Alpha Agency', amount: 6300, status: 'Paid'},
    ],
  },
  topCustomers: [
    {name: 'Tech Solutions Inc.', monthRevenue: 18250},
    {name: 'Greenfield Co.', monthRevenue: 12400},
    {name: 'Bright Ideas LLC', monthRevenue: 8750},
    {name: 'Alpha Agency', monthRevenue: 6300},
  ],
  recentTransactions: [
    {date: '2026-05-18', description: 'Stripe payout', amount: 8420, category: 'Revenue'},
    {date: '2026-05-17', description: 'Payroll', amount: -8450, category: 'Payroll'},
    {date: '2026-05-16', description: 'Client payment', amount: 12000, category: 'Revenue'},
    {date: '2026-05-15', description: 'AWS', amount: -1284, category: 'Software'},
    {date: '2026-05-15', description: 'Google Workspace', amount: -432, category: 'Software'},
  ],
  goals: [
    {name: 'Reach $100k monthly revenue', current: 98540, target: 100000, status: '98% complete'},
    {name: 'Build a six-month reserve', current: 105080, target: 142000, status: '74% complete'},
    {name: 'Reduce software spending', currentMonthlySpend: 11477, targetMonthlySpend: 9140, status: 'Needs review'},
    {name: 'Increase net margin to 25%', currentPercent: 8.4, targetPercent: 25, status: 'Off track'},
  ],
  opportunitiesAndRisks: [
    {type: 'savings', finding: 'Three overlapping software subscriptions', estimatedMonthlyImpact: 2340},
    {type: 'growth', finding: 'Service packages appear underpriced relative to delivery hours', estimatedMonthlyImpact: 6200},
    {type: 'collections', finding: 'Three customers pay about 12 days slower than terms', cashAffected: 18450},
    {type: 'concentration', finding: 'Top four customers contribute 46% of monthly revenue'},
  ],
  hiringScenario: {
    role: 'Operations coordinator',
    monthlySalaryAndTaxes: 6500,
    oneTimeSetupCost: 1800,
    projected30DayBalanceAfterHire: 27900,
    downsideRunwayDaysAfterHire: 101,
    recommendation: 'Wait until overdue receivables are collected or recurring monthly revenue exceeds $110,000',
  },
  upcoming: [
    {item: 'Invoice INV-1024', amount: 4250, dueInDays: 2},
    {item: 'Payroll', amount: 8450, dueInDays: 5},
    {item: 'Quarterly estimated taxes', amount: 6250, dueInDays: 18},
  ],
}

export const loppieSystemContext = `
You are Loopy, the warm and practical AI CFO for Acme Services LLC.
Use the following fictional hackathon dataset as the source of truth. Clearly say when a question cannot be answered from this data. Never invent transactions, balances, forecasts, or customer facts. Distinguish cash flow from accounting profit. Give the answer first, support it with the most relevant numbers, and end with one practical next step when appropriate. Treat all amounts as USD.

BUSINESS DATA:
${JSON.stringify(loppieBusinessData)}
`.trim()
