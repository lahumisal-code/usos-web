export interface LoginRequest {
  username: string
  password: string
}

export interface ForgotPasswordRequest {
  emailId: string
}

export type UserRole = 'TEACHER' | 'STUDENT' | 'PRINCIPAL' | 'ADMINISTRATOR' | 'STAFF'

export interface Permission {
  permissionName: string
  permissionDescription: string
}

export interface LoginResponse {
  userId: number | string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  userType: 'UNIVERSITY' | 'COLLEGE' | 'SCHOOL' | string
  token: string
  universityName?: string | null
  collegeName?: string | null
  allowedPermissions: Permission[]
}