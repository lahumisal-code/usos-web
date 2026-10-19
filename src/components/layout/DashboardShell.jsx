import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import { dashboardPath } from '../../utils/slugify'
import DashboardIcon from '../dashboard/DashboardIcon'
import './DashboardShell.css'

function initialLetters(user) {
  return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
}

function humanize(value) {
  return value
    .toLowerCase()
    .split(/[_\s-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export default function DashboardShell({ children, roleClass = '' }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const dashboard = dashboardPath(user)
  const institutionName = user.userType === 'UNIVERSITY'
    ? user.universityName || user.collegeName
    : user.collegeName || user.universityName
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [accessMessage, setAccessMessage] = useState('')
  const profileMenuRef = useRef(null)

  useEffect(() => {
    const handleForbidden = () => setAccessMessage('You do not have permission to perform that action.')
    window.addEventListener('usos:forbidden', handleForbidden)
    return () => window.removeEventListener('usos:forbidden', handleForbidden)
  }, [])

  useEffect(() => {
    const closeMenus = (event) => {
      if (event.key === 'Escape') {
        setIsMobileOpen(false)
        setIsProfileOpen(false)
      }
    }
    window.addEventListener('keydown', closeMenus)
    return () => window.removeEventListener('keydown', closeMenus)
  }, [])

  useEffect(() => {
    function closeOnOutsideClick(event) {
      if (!profileMenuRef.current?.contains(event.target)) setIsProfileOpen(false)
    }

    document.addEventListener('pointerdown', closeOnOutsideClick)
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick)
  }, [])

  function signOut() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className={`dashboard-app ${roleClass}${isCollapsed ? ' is-collapsed' : ''}${isMobileOpen ? ' mobile-open' : ''}`}>
      {isMobileOpen && (
        <button
          className="dashboard-drawer-backdrop"
          type="button"
          aria-label="Close navigation"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      <aside className="dashboard-sidebar" aria-label="Main navigation">
        <Link className="dashboard-brand" to={dashboard} onClick={() => {
          setIsMobileOpen(false)
          setIsProfileOpen(false)
        }}>
          <span className="dashboard-brand-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="m2.5 9 9.5-5 9.5 5L12 14 2.5 9Z" />
              <path d="M6 11v5.5c3.7 3.2 8.3 3.2 12 0V11M21.5 9v6" />
            </svg>
          </span>
          <span className="dashboard-brand-copy">
            <strong title={institutionName || 'Education Management'}>
              {institutionName || 'Education Management'}
            </strong>
            <small
              className="dashboard-brand-college"
              title={humanize(user.userType)}
            >
              {humanize(user.userType)}
            </small>
          </span>
        </Link>

        <div className="dashboard-nav-region">
          <p className="dashboard-nav-heading">NAVIGATION</p>
          <nav className="dashboard-nav">
            <NavLink
              to={dashboard}
              end
              title={isCollapsed ? 'Dashboard' : undefined}
              className={({ isActive }) => `dashboard-nav-link${isActive ? ' is-active' : ''}`}
              onClick={() => {
                setIsMobileOpen(false)
                setIsProfileOpen(false)
              }}
            >
              <DashboardIcon name="dashboard" />
              <span>Dashboard</span>
            </NavLink>
          </nav>
        </div>

        <div className="dashboard-sidebar-footer">
          <div className="dashboard-sidebar-user">
            <span className="dashboard-avatar">{initialLetters(user)}</span>
            <span className="dashboard-sidebar-user-copy">
              <strong>{user.firstName} {user.lastName}</strong>
              <small>{humanize(user.role)}</small>
            </span>
          </div>
          <button className="dashboard-logout" type="button" onClick={signOut}>
            <DashboardIcon name="logout" size={18} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <button
            className="dashboard-icon-button dashboard-menu-button"
            type="button"
            aria-label="Open navigation menu"
            onClick={() => setIsMobileOpen(true)}
          >
            <DashboardIcon name="menu" />
          </button>
          <button
            className="dashboard-icon-button dashboard-collapse-button"
            type="button"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-pressed={isCollapsed}
            onClick={() => setIsCollapsed((collapsed) => !collapsed)}
          >
            <DashboardIcon name="menu" />
          </button>

          <div className="dashboard-topbar-spacer" />
          {/* <div className="dashboard-institution">
            <span className="dashboard-institution-dot" />
            <span title={institutionName || 'Institution not specified'}>
              {institutionName || 'Institution not specified'}
            </span>
            <small>{humanize(user.userType)}</small>
          </div> */}
          <div className="dashboard-menu-wrap" ref={profileMenuRef}>
            <button
              className="dashboard-profile-trigger"
              type="button"
              aria-expanded={isProfileOpen}
              onClick={() => {
                setIsProfileOpen((open) => !open)
              }}
            >
              <span className="dashboard-avatar">{initialLetters(user)}</span>
              <span className="dashboard-profile-trigger-copy">
                <strong>{user.firstName} {user.lastName}</strong>
                <small>{humanize(user.role)}</small>
              </span>
              <DashboardIcon name="chevron" size={17} />
            </button>
            {isProfileOpen && (
              <div className="dashboard-popover dashboard-profile-popover">
                <div className="dashboard-profile-popover-head">
                  <span className="dashboard-avatar">{initialLetters(user)}</span>
                  <span>
                    <strong title={`${user.firstName} ${user.lastName}`}>
                      {user.firstName} {user.lastName}
                    </strong>
                    <small title={user.email}>{user.email}</small>
                  </span>
                </div>
                <div className="dashboard-profile-detail">
                  <span>Role</span><strong>{humanize(user.role)}</strong>
                </div>
                <div className="dashboard-profile-detail">
                  <span>Account type</span><strong>{humanize(user.userType)}</strong>
                </div>
                <div className="dashboard-profile-detail">
                  <span>Institution</span>
                  <strong title={institutionName || 'Not specified'}>
                    {institutionName || 'Not specified'}
                  </strong>
                </div>
                <button type="button" onClick={signOut}>
                  <DashboardIcon name="logout" size={17} /> Log out
                </button>
              </div>
            )}
          </div>
        </header>
        {accessMessage && (
          <div className="dashboard-access-message" role="alert">
            <span>{accessMessage}</span>
            <button type="button" aria-label="Dismiss message" onClick={() => setAccessMessage('')}>×</button>
          </div>
        )}
        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  )
}
