import { useAuth } from '../../auth/useAuth'
import DashboardShell from '../../components/layout/DashboardShell'
import DashboardIcon from '../../components/dashboard/DashboardIcon'
import './AdministratorDashboard.css'

function formatValue(value) {
  if (typeof value !== 'string' || !value.trim()) return 'Not specified'
  return value
    .trim()
    .toLowerCase()
    .split(/[_\s-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function permissionIcon(permissionName) {
  const action = permissionName.trim().toUpperCase().split(/[_\s-]+/).at(-1)
  if (['CREATE', 'ADD'].includes(action)) return 'create'
  if (['UPDATE', 'EDIT', 'MODIFY'].includes(action)) return 'update'
  if (['DELETE', 'REMOVE'].includes(action)) return 'delete'
  if (['VIEW', 'READ', 'LIST', 'GET', 'DETAIL'].includes(action)) return 'view'
  return 'dashboard'
}

export default function AdministratorDashboard() {
  const { user } = useAuth()
  const universityName = user.universityName || user.collegeName
  const roleTitle = `${formatValue(user.userType)} ${formatValue(user.role)}`
  const permissions = user.allowedPermissions

  return (
    <DashboardShell roleClass="role-administrator">
      <div className="university-dashboard">
        <section className="university-dashboard-heading">
          <div>
            <p className="university-dashboard-eyebrow">{roleTitle} workspace</p>
            <h1>Welcome, {user.firstName}</h1>
            <p>Review your institution profile and account access.</p>
          </div>
          <span className="university-dashboard-role">{roleTitle}</span>
        </section>

        <div className="university-dashboard-grid">
          <section className="university-dashboard-card university-profile-card" aria-labelledby="university-profile-heading">
            <div className="university-dashboard-card-heading">
              <div>
                <h2 id="university-profile-heading">{formatValue(user.userType)} profile</h2>
                <p>Institution associated with your account</p>
              </div>
            </div>

            <div className="university-name-block">
              <strong title={universityName || 'Institution not specified'}>
                {universityName || 'Institution not specified'}
              </strong>
              <span>{formatValue(user.userType)}</span>
            </div>

            <dl className="university-account-details">
              <div>
                <dt>Account holder</dt>
                <dd>{`${user.firstName} ${user.lastName}`.trim() || 'Not specified'}</dd>
              </div>
              <div>
                <dt>Email address</dt>
                <dd title={user.email}>{user.email || 'Not specified'}</dd>
              </div>
              <div>
                <dt>Role</dt>
                <dd>{formatValue(user.role)}</dd>
              </div>
            </dl>
          </section>

          <section className="university-dashboard-card university-permissions-card" aria-labelledby="university-permissions-heading">
            <div className="university-dashboard-card-heading">
              <div>
                <h2 id="university-permissions-heading">Your permissions</h2>
                <p>Access associated with your account</p>
              </div>
              <span className="university-permission-count">{permissions.length}</span>
            </div>

            {permissions.length > 0 ? (
              <ul className="university-permission-list">
                {permissions.map((permission, permissionIndex) => (
                  <li key={`${permission.permissionName}-${permissionIndex}`}>
                    <span className="university-permission-icon">
                      <DashboardIcon name={permissionIcon(permission.permissionName)} size={18} />
                    </span>
                    <span className="university-permission-copy">
                      <strong>{formatValue(permission.permissionName)}</strong>
                      {permission.permissionDescription && (
                        <small>{permission.permissionDescription}</small>
                      )}
                    </span>
                    <span className="university-permission-status">Granted</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="university-permissions-empty">No permissions are assigned to this account.</p>
            )}
          </section>
        </div>
      </div>
    </DashboardShell>
  )
}
