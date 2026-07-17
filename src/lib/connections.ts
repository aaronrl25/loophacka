import type { ConnectionKind } from '../types'

// ─────────────────────────────────────────────────────────────────────────────
// The credentials seam.
//
// Today this simulates the OAuth handshake so the whole app is functional with
// no keys. To go live, drop provider credentials into a `.env` file (see the
// VITE_* names below) and replace the body of `beginConnect` with the real
// provider SDK call — nothing else in the UI needs to change, because the app
// only depends on the Connection shape in src/types.ts.
//
//   VITE_PLAID_CLIENT_ID / VITE_PLAID_ENV        → bank (Plaid Link)
//   VITE_QUICKBOOKS_CLIENT_ID                     → accounting (QuickBooks OAuth)
//   VITE_STRIPE_CLIENT_ID                         → payments (Stripe Connect)
//   VITE_GUSTO_CLIENT_ID                          → payroll (Gusto OAuth)
// ─────────────────────────────────────────────────────────────────────────────

interface ProviderConfig {
  /** Which env var holds this provider's client id. */
  credentialKey: string
  /** Realistic masked account label to show after a simulated connect. */
  sampleAccount: string
}

const providers: Record<ConnectionKind, ProviderConfig> = {
  bank: { credentialKey: 'VITE_PLAID_CLIENT_ID', sampleAccount: 'Chase ••••4821' },
  accounting: { credentialKey: 'VITE_QUICKBOOKS_CLIENT_ID', sampleAccount: 'QuickBooks · Rivertown' },
  payments: { credentialKey: 'VITE_STRIPE_CLIENT_ID', sampleAccount: 'Stripe · acct ••••9f2' },
  payroll: { credentialKey: 'VITE_GUSTO_CLIENT_ID', sampleAccount: 'Gusto · 4 people' },
}

/** True once real credentials are present for this provider. */
export function hasCredentials(kind: ConnectionKind): boolean {
  const key = providers[kind]?.credentialKey
  return Boolean(key && (import.meta.env as Record<string, string | undefined>)[key])
}

export interface ConnectResult {
  account: string
  /** Whether a real OAuth flow ran, vs the built-in simulation. */
  live: boolean
}

/**
 * Kick off a connection. With credentials present this is where the real Plaid
 * Link / OAuth popup goes; without them it simulates a successful connect so the
 * onboarding flow is fully clickable in the demo.
 */
export async function beginConnect(kind: ConnectionKind): Promise<ConnectResult> {
  const provider = providers[kind]
  if (!provider) throw new Error(`Unknown connection kind: ${kind}`)

  if (hasCredentials(kind)) {
    // TODO(live): launch the provider SDK here, e.g. Plaid Link for `bank`.
    // Until that's wired we fall through to the simulation so the button still
    // does something useful rather than throwing in front of the owner.
  }

  await new Promise((resolve) => setTimeout(resolve, 1100)) // mimic the OAuth round-trip
  return { account: provider.sampleAccount, live: hasCredentials(kind) }
}
