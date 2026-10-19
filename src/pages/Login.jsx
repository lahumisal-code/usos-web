import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authApi, getLoginErrorMessage } from '../api/api'
import Toast from '../components/Toast'
import { EMAIL_REGEX, PASSWORD_REGEX } from '../constants/regex'

function MailIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="2.5" y="4" width="15" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="m3.5 5 6.5 5 6.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="3.5" y="8.5" width="13" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.5 8.5v-3a3.5 3.5 0 0 1 7 0v3m-3.5 4v1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function EyeIcon({ hidden }) {
  return hidden ? (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 3 17 17M8.6 8.7a2 2 0 0 0 2.7 2.7M6.2 5.3A9.2 9.2 0 0 1 10 4.5c4.7 0 7.5 5.5 7.5 5.5a12 12 0 0 1-2.1 2.8M4.5 6.5A12 12 0 0 0 2.5 10s2.8 5.5 7.5 5.5c.8 0 1.5-.2 2.2-.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M2.5 10S5.3 4.5 10 4.5s7.5 5.5 7.5 5.5-2.8 5.5-7.5 5.5S2.5 10 2.5 10Z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="2.25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export default function Login() {
  const [emailId, setEmailId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState(null)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  function validateEmail() {
    if (!emailId.trim()) {
      setEmailError('Enter your email address.')
      return false
    }
    if (!EMAIL_REGEX.test(emailId.trim())) {
      setEmailError('Enter a valid email address.')
      return false
    }
    setEmailError('')
    return true
  }

  async function handleLogin(event) {
    event.preventDefault()
    setMessage(null)
    const validEmail = validateEmail()
    const validPassword = PASSWORD_REGEX.test(password)
    setPasswordError(validPassword ? '' : password ? 'Enter a valid password.' : 'Enter your password.')
    if (!validEmail || !validPassword) {
      const hasEmail = Boolean(emailId.trim())
      setMessage({
        type: 'error',
        text: !hasEmail && !validPassword
          ? 'Please enter username and password.'
          : !hasEmail
            ? 'Please enter username.'
            : !validEmail
              ? 'Please enter a valid email address.'
              : password
                ? 'Please enter a valid password.'
                : 'Please enter password.',
      })
      return
    }
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      const response = await authApi.login({ username: emailId.trim(), password })
      const redirectUrl = response.redirectUrl
      if (typeof redirectUrl === 'string' && redirectUrl.startsWith('/') && !redirectUrl.startsWith('//')) {
        const destination = new URL(redirectUrl, window.location.origin)
        if (destination.origin === window.location.origin) {
          window.location.assign(destination.href)
          return
        }
      }
      setMessage({ type: 'success', text: 'You have signed in successfully.' })
    } catch (error) {
      setMessage({ type: 'error', text: getLoginErrorMessage(error) })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Toast message={message} setMessage={setMessage} />
      <div className="form-wrap">
        <div className="form-heading">
          <p className="form-eyebrow">USOS MANAGEMENT</p>
          <h2>Welcome Back</h2>
          <p className="form-subtitle">Sign in to your account.</p>
        </div>
        <form className="auth-form" onSubmit={handleLogin} noValidate>
          <div className="field-group">
            <label htmlFor="login-email">Email ID</label>
            <div className={`input-shell${emailError ? ' has-error' : ''}`}>
              <span className="field-icon"><MailIcon /></span>
              <input
                id="login-email"
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

          <div className="field-group">
            <label htmlFor="login-password">Password</label>
            <div className={`input-shell${passwordError ? ' has-error' : ''}`}>
              <span className="field-icon"><LockIcon /></span>
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  if (passwordError) setPasswordError('')
                  setMessage(null)
                }}
                aria-invalid={Boolean(passwordError)}
                required
              />
              <button
                type="button"
                className="visibility-button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                <EyeIcon hidden={showPassword} />
              </button>
            </div>
            <Link
              className="text-link forgot-link"
              to="/forgot-password"
              onClick={() => {
                setEmailId('')
                setPassword('')
                setShowPassword(false)
                setEmailError('')
                setPasswordError('')
                setMessage(null)
              }}
            >
              Forgot Password?
            </Link>
          </div>

          <button className="submit-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <><span className="spinner" aria-hidden="true" />Signing in…</> : <>Login</>}
          </button>
        </form>
        <p className="form-footer">Secure access for your institution</p>
      </div>
    </>
  )
}
