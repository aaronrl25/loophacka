import { useCallback, useEffect, useState } from 'react'
import { loopyService } from '../data/loopyService'
import { beginConnect } from '../lib/connections'
import type { ChatMessage, ConnectionKind, DashboardSummary } from '../types'

interface UseLoopy {
  data: DashboardSummary | null
  loading: boolean
  error: string | null
  chat: ChatMessage[]
  sending: boolean
  sendChat: (text: string) => Promise<void>
  acknowledgeAlert: (id: string) => void
  /** Which connection is mid-handshake, if any. */
  connecting: ConnectionKind | null
  connect: (kind: ConnectionKind) => Promise<void>
}

export function useLoopy(): UseLoopy {
  const [data, setData] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chat, setChat] = useState<ChatMessage[]>([])
  const [sending, setSending] = useState(false)
  const [connecting, setConnecting] = useState<ConnectionKind | null>(null)

  useEffect(() => {
    let active = true
    loopyService
      .getSummary()
      .then((summary) => {
        if (!active) return
        setData(summary)
        setChat(summary.chatHistory)
      })
      .catch(() => active && setError('Could not reach Loopy.'))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  const sendChat = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: trimmed,
      at: new Date().toISOString(),
    }
    setChat((prev) => [...prev, userMsg])
    setSending(true)
    try {
      const reply = await loopyService.sendMessage(trimmed)
      setChat((prev) => [...prev, reply])
    } finally {
      setSending(false)
    }
  }, [])

  const acknowledgeAlert = useCallback((id: string) => {
    setData((prev) =>
      prev
        ? {
            ...prev,
            alerts: prev.alerts.map((a) =>
              a.id === id ? { ...a, acknowledged: true } : a,
            ),
          }
        : prev,
    )
  }, [])

  const connect = useCallback(async (kind: ConnectionKind) => {
    setConnecting(kind)
    try {
      const result = await beginConnect(kind)
      setData((prev) =>
        prev
          ? {
              ...prev,
              connections: prev.connections.map((c) =>
                c.kind === kind
                  ? { ...c, status: 'connected', account: result.account }
                  : c,
              ),
            }
          : prev,
      )
    } finally {
      setConnecting(null)
    }
  }, [])

  return {
    data,
    loading,
    error,
    chat,
    sending,
    sendChat,
    acknowledgeAlert,
    connecting,
    connect,
  }
}
