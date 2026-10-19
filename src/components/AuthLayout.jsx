function BrandMark() {
  return (
    <div className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 40 40" fill="none">
        <path d="M5.5 15.5 20 7l14.5 8.5H5.5Z" fill="currentColor" />
        <path d="M9 17.5h22M11 30.5h18M7 33h26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 18.5v10m8-10v10m8-10v10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    </div>
  )
}

export default function AuthLayout({ children }) {
  return (
    <main className="auth-shell">
      <section className="brand-panel" aria-label="USOS Management">
        <div className="brand-topline">
          <BrandMark />
          <span className="brand-name">USOS <strong>Management</strong></span>
        </div>
        <div className="brand-copy">
          <p className="brand-kicker">EDUCATION, CONNECTED</p>
          <h1>One platform.<br />Every possibility.</h1>
          <p className="brand-tagline">One Platform for University, College &amp; School Management.</p>
        </div>
        <div className="brand-bottomline">
          <span className="brand-rule" />
          <span>University · College · School</span>
          <span className="brand-rule" />
        </div>
      </section>
      <section className="form-panel">{children}</section>
    </main>
  )
}
