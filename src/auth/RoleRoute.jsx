import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom'
import { useAuth } from './useAuth'
import { dashboardPath, institutionSlugs } from '../utils/slugify'

export default function RoleRoute({ role, userType, permission }) {
  const { user } = useAuth()
  const location = useLocation()
  const { universitySlug, collegeSlug } = useParams()

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />

  const slugs = institutionSlugs(user)
  const ownDashboard = dashboardPath(user)
  if (user.role !== role
    || (userType && user.userType !== userType)
    || universitySlug !== slugs.universitySlug
    || collegeSlug !== slugs.collegeSlug) {
    if (user.role !== role || (userType && user.userType !== userType)) {
      return <Navigate to="/login" replace />
    }
    return <Navigate to={ownDashboard} replace />
  }
  if (permission && !user.allowedPermissions.some((item) => item.permissionName === permission)) {
    return <Navigate to={ownDashboard} replace />
  }
  return <Outlet />
}
