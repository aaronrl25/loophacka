import { useEffect, useRef, useState } from 'react'
import type { ChatMessage } from '../types'
import './ChatPanel.css'

interface ChatPanelProps {
  messages: ChatMessage[]
  sending: boolean
  onSend: (text: string) => void
}

const suggestions = ['Why is runway shrinking?', 'Break down the burn', 'Any overdue invoices?']

function ChatPanel({ messages, sending, onSend }: ChatPanelProps) {
  const [draft, setDraft] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, sending])

  const submit = () => {
    if (!draft.trim() || sending) return
    onSend(draft)
    setDraft('')
  }

  return (
    <section className="panel chat">
      <header className="panel__head">
        <h2 className="panel__title">
          <span className="chat__avatar" aria-hidden="true">
            L
          </span>
          Ask Loopy
        </h2>
        <span className="chat__hint">Your CFO agent</span>
      </header>

      <div className="chat__scroll" ref={scrollRef}>
        {messages.map((m) => (
          <div key={m.id} className={`bubble bubble--${m.role}`}>
            {m.content}
          </div>
        ))}
        {sending && (
          <div className="bubble bubble--loopy bubble--typing" aria-label="Loopy is typing">
            <span />
            <span />
            <span />
          </div>
        )}
      </div>

      <div className="chat__suggest">
        {suggestions.map((s) => (
          <button key={s} type="button" className="chat__chip" disabled={sending} onClick={() => onSend(s)}>
            {s}
          </button>
        ))}
      </div>

      <div className="chat__input">
        <textarea
          className="chat__field"
          rows={1}
          placeholder="Ask about cash, runway, burn, margins…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              submit()
            }
          }}
        />
        <button type="button" className="chat__send" onClick={submit} disabled={sending || !draft.trim()}>
          Send
        </button>
      </div>
    </section>
  )
}

export default ChatPanel
