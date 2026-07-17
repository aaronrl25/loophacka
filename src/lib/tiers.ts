import type { Severity, Tier } from '../types'

// The mapping from an alert's severity (what the data layer sets) to the three
// urgency tiers the owner sees. Keeping this in one place means the feed, the
// counts, and any future digest all group alerts the same way.

export function tierOf(severity: Severity): Tier {
  switch (severity) {
    case 'critical':
    case 'serious':
      return 'critical'
    case 'warning':
      return 'watch'
    case 'good':
      return 'opportunity'
  }
}

interface TierMeta {
  /** Section heading in the feed. */
  heading: string
  /** The traffic-light dot color token. */
  dot: string
  /** Emoji used in compact contexts / the briefing summary. */
  emoji: string
}

export const tierMeta: Record<Tier, TierMeta> = {
  critical: { heading: 'Needs your attention', dot: 'var(--critical)', emoji: '🔴' },
  watch: { heading: 'Worth a look this week', dot: 'var(--warning)', emoji: '🟡' },
  opportunity: { heading: 'Opportunities & wins', dot: 'var(--good)', emoji: '🟢' },
}

export const tierOrder: Tier[] = ['critical', 'watch', 'opportunity']
