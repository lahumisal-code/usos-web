import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authApi, getResetErrorMessage } from '../api/api'
import Toast from '../components/Toast'

function isValidEmail(value) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value.trim())
}

export default function ForgotPassword() {
  const [emailId, setEmailId] = useState('')
  const [emailError, setEmailError] = useState('')
  const [message, setMessage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage(null)
    if (!emailId.trim()) {
      setEmailError('Enter your email address.')
      setMessage({ type: 'error', text: 'Enter your email address.' })
      return
    }
    if (!isValidEmail(emailId)) {
      setEmailError('Enter a valid email address.')
      setMessage({ type: 'error', text: 'Enter a valid email address.' })
      return
    }
    setEmailError('')
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      await authApi.requestPasswordReset({ emailId: emailId.trim() })
      setMessage({ type: 'success', text: 'If an account exists for this email, password reset instructions will be sent.' })
    } catch (error) {
      setMessage({ type: 'error', text: getResetErrorMessage(error) })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Toast message={message} setMessage={setMessage} />
      <div className="form-wrap">
        <div className="form-heading">
          <p className="form-eyebrow">ACCOUNT RECOVERY</p>
          <h2>Forgot Password?</h2>
          <p className="form-subtitle">Enter your registered email address to reset your password.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="reset-email">Email ID</label>
            <div className={`input-shell${emailError ? ' has-error' : ''}`}>
              <span className="field-icon">
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <rect x="2.5" y="4" width="15" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="m3.5 5 6.5 5 6.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <input
                id="reset-email"
                name="emailId"
                type="email"
                autoComplete="email"
                placeholder="you@institution.edu"
                value={emailId}
                onChange={(event) => {
                  setEmailId(event.target.value)
                  if (emailError) setEmailError('')
                  setMessage(null)
                }}
                aria-invalid={Boolean(emailError)}
                required
              />
            </div>
          </div>
          <button className="submit-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <><span className="spinner" aria-hidden="true" />Sending link…</> : <>Send Reset Link</>}
          </button>
        </form>
        <Link className="back-link" to="/login">Back to Login</Link>
        <p className="form-footer">Secure access for your institution</p>
      </div>
    </>
  )
}
