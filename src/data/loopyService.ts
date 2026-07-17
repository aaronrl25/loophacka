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
// would call the copilot's LLM endpoint here instead — everything is in plain
// language because the owner isn't an accountant.
function draftReply(text: string): string {
  const q = text.toLowerCase()
  if (q.includes('runway'))
    return "You've got 128 days of runway — that's how long your cash lasts at today's pace. It slipped 22 days this month, mostly because Bright Ideas LLC is 45 days late on an $8,750 invoice. Get that paid and you claw back about three weeks."
  if (q.includes('payroll') || q.includes('overdraft') || q.includes('30th'))
    return "Payroll is $11,200 and clears on the 30th. Your balance that day would dip about $2,400 below zero, because Bright Ideas' payment isn't due until Aug 4. Easiest fix: move $3,000 from savings before the 29th. Want me to set that up?"
  if (q.includes('charge') || q.includes('northbay') || q.includes('5,000') || q.includes('5000'))
    return "The $5,000 to “NORTHBAY LLC” hit on Jul 16. It's not a vendor you've paid before and it's your largest charge this year. If it doesn't ring a bell, tap Flag it and I'll help you dispute it with the bank."
  if (q.includes('spend') || q.includes('cut') || q.includes('save') || q.includes('subscription'))
    return "Quickest win: three subscriptions — Figma, Loom, and Notion — have gone unused for 60+ days and cost $180/mo together. Cancelling adds about 3 days of runway. Want the cancel links?"
  if (q.includes('cash') || q.includes('bank') || q.includes('balance'))
    return "You have $24,780 in the bank right now, down 12.5% this month. At today's pace that runs to $0 around Nov 22 — but that assumes the overdue invoice never comes in, which it should."
  if (q.includes('sales') || q.includes('revenue') || q.includes('down'))
    return "Sales are $41,900 this month, down 18%. Almost all of that is one late invoice from Bright Ideas LLC — the rest of your revenue is steady. Want me to send them a reminder?"
  if (q.includes('owe') || q.includes('invoice') || q.includes('overdue'))
    return "You're owed $13,200 total, and $8,750 of it (Bright Ideas LLC, invoice #1042) is 45 days overdue. I've got a friendly reminder drafted — say the word and I'll send it and schedule a follow-up."
  return "I can explain your runway, this month's sales, that unfamiliar charge, or where to trim spending — all in plain English. I flagged 2 things that need you today; want me to start with the payroll overdraft?"
}

class MockLoopyService implements LoopyService {
  async getSummary(): Promise<DashboardSummary> {
    await delay(400)
    return mockSummary
  }

  async sendMessage(text: string): Promise<ChatMessage> {
    // Keep the hackathon mock pending long enough to demonstrate Loopy's
    // complete three-pose thinking sequence. A real API uses its actual latency.
    await delay(9_500)
    return {
      id: `m-${Date.now()}`,
      role: 'loopy',
      content: draftReply(text),
      at: new Date().toISOString(),
    }
  }
}

export const loopyService: LoopyService = new MockLoopyService()
