import { useEffect } from 'react'

export default function Toast({ message, setMessage }) {
  useEffect(() => {
    if (!message) return undefined

    const timer = window.setTimeout(() => setMessage(null), 4500)
    return () => window.clearTimeout(timer)
  }, [message, setMessage])

  if (!message) return null

  return (
    <div className={`toast toast-${message.type}`} role={message.type === 'error' ? 'alert' : 'status'} aria-live="polite">
      <span className="toast-mark" aria-hidden="true">{message.type === 'error' ? '!' : '✓'}</span>
      <p>{message.text}</p>
      <button type="button" className="toast-dismiss" onClick={() => setMessage(null)} aria-label="Dismiss notification">
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="m5 5 10 10M15 5 5 15" />
        </svg>
      </button>
    </div>
  )
}