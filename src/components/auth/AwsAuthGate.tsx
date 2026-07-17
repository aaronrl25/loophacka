import { useState, type FormEvent, type ReactNode } from 'react'
import mascot from '../../assets/loppie.png'
import { useAwsAuth } from '../../hooks/useAwsAuth'
import './AwsAuthGate.css'

interface AwsAuthGateProps {
  children: ReactNode
}

export function AwsAuthGate({ children }: AwsAuthGateProps) {
  const auth = useAwsAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmationValue, setConfirmationValue] = useState('')

  if (auth.status === 'checking') {
    return <main className="aws-auth-loading">Checking your secure session…</main>
  }

  if (auth.status === 'signed-in') {
    return (
      <>
        <button className="aws-sign-out" type="button" onClick={() => void auth.logout()}>
          Sign out
        </button>
        {children}
      </>
    )
  }

  const submitLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void auth.login(email.trim(), password)
  }

  const submitChallenge = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void auth.confirmChallenge(confirmationValue.trim())
  }

  return (
    <main className="aws-auth-page">
      <section className="aws-auth-card" aria-labelledby="aws-auth-title">
        <img src={mascot} alt="Loppie" />
        <small>SECURE WORKSPACE</small>
        <h1 id="aws-auth-title">Welcome back to Looper</h1>
        <p>Sign in with your AWS Cognito account to continue.</p>

        {!auth.configured && (
          <div className="aws-auth-notice" role="alert">
            AWS authentication is not configured. Add the Cognito values from
            <code>.env.example</code> to your local <code>.env</code> file.
          </div>
        )}

        {auth.status === 'challenge' ? (
          <form onSubmit={submitChallenge}>
            <label htmlFor="aws-confirmation">Verification code or response</label>
            <input
              id="aws-confirmation"
              autoComplete="one-time-code"
              value={confirmationValue}
              onChange={(event) => setConfirmationValue(event.target.value)}
              required
            />
            <button type="submit" disabled={auth.isSubmitting}>
              {auth.isSubmitting ? 'Verifying…' : 'Verify and continue'}
            </button>
          </form>
        ) : (
          <form onSubmit={submitLogin}>
            <label htmlFor="aws-email">Email</label>
            <input
              id="aws-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <label htmlFor="aws-password">Password</label>
            <input
              id="aws-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button type="submit" disabled={!auth.configured || auth.isSubmitting}>
              {auth.isSubmitting ? 'Signing in…' : 'Sign in with AWS'}
            </button>
          </form>
        )}

        {auth.error && <p className="aws-auth-error" role="alert">{auth.error}</p>}
        <a href="/">← Return to homepage</a>
      </section>
    </main>
  )
}
