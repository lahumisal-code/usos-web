import axios from 'axios'

const API_BASE_URL = '/api'

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
  },
}

const apiClient = axios.create({
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const authApi = {
  async login(payload) {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, payload)
    return response.data
  },

  async requestPasswordReset(payload) {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, payload)
    return response.data
  },
}

function getApiError(error) {
  if (!axios.isAxiosError(error)) {
    return { status: null, message: 'Something went wrong. Please try again.' }
  }

  return {
    status: error.response?.status ?? null,
    message: error.response?.data?.message ?? error.response?.data?.error ?? null,
    hasResponse: Boolean(error.response),
  }
}

export function getLoginErrorMessage(error) {
  const apiError = getApiError(error)
  if (apiError.status === 401 || apiError.status === 403) {
    return 'The email address or password is incorrect.'
  }
  if (!apiError.hasResponse) {
    return 'Unable to connect to the server. Check your connection and try again.'
  }
  return apiError.message || 'We could not sign you in right now. Please try again.'
}

export function getResetErrorMessage(error) {
  const apiError = getApiError(error)
  if (apiError.status === 404 || apiError.status === 405) {
    return 'Password reset is not available yet. Ask your system administrator to enable this endpoint.'
  }
  if (!apiError.hasResponse) {
    return 'Unable to connect to the server. Check your connection and try again.'
  }
  return apiError.message || 'We could not send reset instructions. Please try again.'
}