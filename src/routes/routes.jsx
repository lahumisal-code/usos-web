import { Navigate, Route, Routes } from 'react-router-dom'
import ForgotPassword from '../pages/ForgotPassword'
import Login from '../pages/Login'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
