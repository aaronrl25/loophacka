import { useCallback, useEffect, useState } from 'react'
import { loopyService } from '../data/loopyService'
import type { ChatMessage, DashboardSummary } from '../types'

interface UseLoopy {
  data: DashboardSummary | null
  loading: boolean
  error: string | null
  chat: ChatMessage[]
  sending: boolean
  sendChat: (text: string) => Promise<void>
  acknowledgeAlert: (id: string) => void
}

export function useLoopy(): UseLoopy {
  const [data, setData] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chat, setChat] = useState<ChatMessage[]>([])
  const [sending, setSending] = useState(false)

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

  return { data, loading, error, chat, sending, sendChat, acknowledgeAlert }
}
