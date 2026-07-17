import type { ChatMessage, DashboardSummary } from '../types'
import { mockSummary } from './mockData'

// The data boundary. The UI depends only on this interface, so a real backend
// drops in by implementing LoopyService (e.g. HttpLoopyService fetching an API)
// and swapping the `loopyService` export below — no component changes needed.

export interface LoopyService {
  getSummary(): Promise<DashboardSummary>
  sendMessage(text: string): Promise<ChatMessage>
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Canned, data-aware replies so the demo feels alive. A real implementation
// would call the CFO agent's LLM endpoint here instead.
function draftReply(text: string): string {
  const q = text.toLowerCase()
  if (q.includes('runway'))
    return "Runway is 14.6 months at the current burn. It's tightening — the burn curve steepened 7.1% last month, which is what drives my October alert. Freezing the 6 open reqs adds roughly 2 months back."
  if (q.includes('burn'))
    return 'Net burn was $576K in July, up from $538K. The jump is mostly the new inference cluster on AWS (+$36K over forecast). Everything else is within plan.'
  if (q.includes('cash'))
    return 'Cash on hand is $8.42M, down 4.2% this month. At the projected burn curve I have you at $4.38M by January 2026.'
  if (q.includes('margin'))
    return 'Gross margin is 71.2%, up 0.9pt this quarter on lower support costs after the self-serve onboarding launch. That trend is the healthiest line on the board.'
  if (q.includes('overdue') || q.includes('invoice') || q.includes('ar'))
    return 'You have $145K in overdue enterprise invoices — Meridian ($84K) and Delta Logistics ($61K), both past net-30. I can trigger the dunning sequence and notify the account owners.'
  if (q.includes('board') || q.includes('report'))
    return "I've drafted the June board pack — financial summary plus the KPI appendix. It's queued for your review; say the word and I'll finalize it."
  return "I can break down cash, runway, burn, margins, AR, or the board pack. I've also flagged 1 critical and 1 serious item today — want me to walk through the October runway risk?"
}

class MockLoopyService implements LoopyService {
  async getSummary(): Promise<DashboardSummary> {
    await delay(400)
    return mockSummary
  }

  async sendMessage(text: string): Promise<ChatMessage> {
    await delay(700)
    return {
      id: `m-${Date.now()}`,
      role: 'loopy',
      content: draftReply(text),
      at: new Date().toISOString(),
    }
  }
}

export const loopyService: LoopyService = new MockLoopyService()
