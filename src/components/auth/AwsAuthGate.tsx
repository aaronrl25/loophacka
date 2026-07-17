import { useState, type FormEvent, type ReactNode } from 'react'
import mascot from '../../assets/loopie_pose_1.png'
import { useAwsAuth } from '../../hooks/useAwsAuth'
import './AwsAuthGate.css'

interface AwsAuthGateProps {
  children: ReactNode
}

type AuthMode = 'sign-in' | 'sign-up'

export function AwsAuthGate({ children }: AwsAuthGateProps) {
  const auth = useAwsAuth()
  const [demoAccess, setDemoAccess] = useState(
    () => sessionStorage.getItem('looper-demo-access') === 'true',
  )
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirmationValue, setConfirmationValue] = useState('')
  const [mode, setMode] = useState<AuthMode>('sign-in')
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  if (auth.status === 'checking') {
    return <main className="aws-auth-loading">Checking your secure session…</main>
  }

  if (auth.status === 'signed-in' || demoAccess) {
    const logout = async () => {
      if (demoAccess) {
        sessionStorage.removeItem('looper-demo-access')
        setDemoAccess(false)
        return
      }
      await auth.logout()
    }

    return (
      <>
        {demoAccess && <div className="demo-access-banner">Demo access · Authentication bypassed</div>}
        <button className="aws-sign-out" type="button" onClick={() => void logout()}>
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

  const submitRegistration = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSuccessMessage(null)
    const completed = await auth.register(name.trim(), email.trim(), password)
    if (completed) {
      setMode('sign-in')
      setSuccessMessage('Account created. You can now sign in.')
    }
  }

  const submitRegistrationCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const completed = await auth.confirmRegistration(confirmationValue.trim())
    if (completed) {
      setMode('sign-in')
      setConfirmationValue('')
      setSuccessMessage('Email verified. Sign in to continue.')
    }
  }

  const continueWithDemo = () => {
    sessionStorage.setItem('looper-demo-access', 'true')
    setDemoAccess(true)
  }

  return (
    <main className="aws-auth-page">
      <section className="aws-auth-card" aria-labelledby="aws-auth-title">
        <img src={mascot} alt="Loppie" />
        <small>SECURE WORKSPACE</small>
        <h1 id="aws-auth-title">
          {mode === 'sign-up' ? 'Create your Looper account' : 'Welcome back to Looper'}
        </h1>
        <p>
          {mode === 'sign-up'
            ? 'Create a secure AWS Cognito account for your workspace.'
            : 'Sign in with your AWS Cognito account to continue.'}
        </p>

        {!auth.configured && (
          <div className="aws-auth-notice" role="alert">
            AWS authentication is not configured. Add the Cognito values from
            <code>.env.example</code> to your local <code>.env</code> file.
          </div>
        )}

        {auth.status === 'signup-confirmation' ? (
          <form onSubmit={(event) => void submitRegistrationCode(event)}>
            <label htmlFor="aws-signup-code">Email verification code</label>
            <input
              id="aws-signup-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={confirmationValue}
              onChange={(event) => setConfirmationValue(event.target.value)}
              required
            />
            <button type="submit" disabled={auth.isSubmitting}>
              {auth.isSubmitting ? 'Confirming…' : 'Confirm account'}
            </button>
            <button
              className="aws-auth-text-button"
              type="button"
              disabled={auth.isSubmitting}
              onClick={() => void auth.resendRegistrationCode()}
            >
              Resend verification code
            </button>
          </form>
        ) : auth.status === 'challenge' ? (
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
        ) : mode === 'sign-up' ? (
          <form onSubmit={(event) => void submitRegistration(event)}>
            <label htmlFor="aws-name">Full name</label>
            <input
              id="aws-name"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
            <label htmlFor="aws-signup-email">Email</label>
            <input
              id="aws-signup-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <label htmlFor="aws-signup-password">Password</label>
            <input
              id="aws-signup-password"
              type="password"
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-describedby="aws-password-help"
              required
            />
            <small id="aws-password-help" className="aws-password-help">
              Use at least 8 characters. Your Cognito policy may require more.
            </small>
            <button type="submit" disabled={!auth.configured || auth.isSubmitting}>
              {auth.isSubmitting ? 'Creating account…' : 'Create account'}
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
        {successMessage && <p className="aws-auth-success" role="status">{successMessage}</p>}
        {auth.status !== 'signup-confirmation' && auth.status !== 'challenge' && (
          <p className="aws-auth-switch">
            {mode === 'sign-up' ? 'Already have an account?' : 'New to Looper?'}
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'sign-up' ? 'sign-in' : 'sign-up')
                setSuccessMessage(null)
              }}
            >
              {mode === 'sign-up' ? 'Sign in' : 'Create an account'}
            </button>
          </p>
        )}
        <div className="aws-auth-divider"><span>or</span></div>
        <button className="demo-access-button" type="button" onClick={continueWithDemo}>
          Continue with demo access
        </button>
        <small className="demo-access-note">
          Demo only — no AWS account or protected backend access.
        </small>
        <a href="/">← Return to homepage</a>
      </section>
    </main>
  )
}
