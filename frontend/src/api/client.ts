import axios from 'axios'

import { useAuthStore } from '../store/authStore'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1'

export const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status

    if (status !== 401 || originalRequest?._retry) {
      return Promise.reject(error)
    }

    originalRequest._retry = true
    const { refreshToken, setTokens, clear } = useAuthStore.getState()

    if (!refreshToken) {
      clear()
      return Promise.reject(error)
    }

    try {
      const refreshResponse = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
        refresh: refreshToken,
      })
      const newAccess = refreshResponse.data.access
      setTokens(newAccess, refreshToken)
      originalRequest.headers.Authorization = `Bearer ${newAccess}`
      return api(originalRequest)
    } catch (refreshError) {
      clear()
      return Promise.reject(refreshError)
    }
  },
)
