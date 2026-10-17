export interface LoginRequest {
  emailId: string
  password: string
}

export interface ForgotPasswordRequest {
  emailId: string
}

export interface LoginResponse {
  redirectUrl?: string
  [key: string]: unknown
}