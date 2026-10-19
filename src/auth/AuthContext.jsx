import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './context'
import { isValidUser } from './authValidation'

const STORAGE_KEY = 'usos.auth'

function readUser() {
  try {
    const serializedUser = window.localStorage.getItem(STORAGE_KEY)
    if (!serializedUser) return null
    const user = JSON.parse(serializedUser)
    if (isValidUser(user)) return user
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
    return null
  }
  window.localStorage.removeItem(STORAGE_KEY)
  return null
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser)

  const login = useCallback((response) => {
    if (!isValidUser(response)) {
      throw new Error('The login response is missing required account information.')
    }
    const safeUser = {
      userId: response.userId,
      firstName: response.firstName,
      lastName: response.lastName,
      email: response.email,
      role: response.role,
      userType: response.userType,
      token: response.token,
      universityName: response.universityName ?? null,
      collegeName: response.collegeName ?? null,
      allowedPermissions: response.allowedPermissions,
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser))
    setUser(safeUser)
  }, [])

  const logout = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }, [])

  useEffect(() => {
    window.addEventListener('usos:unauthorized', logout)
    return () => window.removeEventListener('usos:unauthorized', logout)
  }, [logout])

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
