import { useCallback, useEffect, useState } from 'react'
import {
  confirmSignIn,
  getCurrentUser,
  signIn,
  signOut,
  type AuthUser,
} from 'aws-amplify/auth'
import { isAwsAuthConfigured } from '../lib/aws/amplify'

type AuthStatus = 'checking' | 'signed-out' | 'challenge' | 'signed-in'

function authErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Authentication failed. Please try again.'
}

export function useAwsAuth() {
  const [status, setStatus] = useState<AuthStatus>('checking')
  const [user, setUser] = useState<AuthUser | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const restoreSession = useCallback(async () => {
    if (!isAwsAuthConfigured) {
      setStatus('signed-out')
      return
    }

    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      setStatus('signed-in')
    } catch {
      setUser(null)
      setStatus('signed-out')
    }
  }, [])

  useEffect(() => {
    void restoreSession()
  }, [restoreSession])

  const login = async (username: string, password: string) => {
    setIsSubmitting(true)
    setError(null)
    try {
      const result = await signIn({ username, password })
      if (result.isSignedIn) {
        await restoreSession()
      } else {
        setStatus('challenge')
      }
    } catch (caught) {
      setError(authErrorMessage(caught))
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmChallenge = async (confirmationValue: string) => {
    setIsSubmitting(true)
    setError(null)
    try {
      const result = await confirmSignIn({ challengeResponse: confirmationValue })
      if (result.isSignedIn) {
        await restoreSession()
      } else {
        setStatus('challenge')
      }
    } catch (caught) {
      setError(authErrorMessage(caught))
    } finally {
      setIsSubmitting(false)
    }
  }

  const logout = async () => {
    await signOut()
    setUser(null)
    setStatus('signed-out')
  }

  return {
    configured: isAwsAuthConfigured,
    status,
    user,
    error,
    isSubmitting,
    login,
    confirmChallenge,
    logout,
  }
}
