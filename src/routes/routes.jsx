import { Navigate, Route, Routes } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { useAuth } from '../auth/useAuth'
import { isUniversityAdministrator } from '../auth/authValidation'
import RoleRoute from '../auth/RoleRoute'
import ForgotPassword from '../pages/ForgotPassword'
import Login from '../pages/Login'
import AdministratorDashboard from '../pages/administrator/AdministratorDashboard'
import { dashboardPath } from '../utils/slugify'

function HomeRedirect() {
  const { user } = useAuth()
  return <Navigate to={isUniversityAdministrator(user) ? dashboardPath(user) : '/login'} replace />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
      <Route path="/forgot-password" element={<AuthLayout><ForgotPassword /></AuthLayout>} />
      <Route element={<RoleRoute role="ADMINISTRATOR" userType="UNIVERSITY" />}>
        <Route path="/:universitySlug/:collegeSlug/administrator/dashboard" element={<AdministratorDashboard />} />
      </Route>
      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  )
}
