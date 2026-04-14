import api from '../../shared/api/api-config'
import API_ENDPOINTS from '../../shared/constants/api-endpoints'
import type { TLogin, TRegister, TAuthResponse, TUser } from './auth.schema'

export const authService = {
  login: async (data: TLogin) => {
    return await api.post<TAuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data)
  },

  register: async (data: TRegister) => {
    return await api.post<TAuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data)
  },

  logout: async () => {
    return await api.post(API_ENDPOINTS.AUTH.LOGOUT)
  },

  getMe: async () => {
    return await api.get<TUser>(API_ENDPOINTS.AUTH.ME)
  },

  initCsrf: async () => {
    return await api.get(API_ENDPOINTS.AUTH.CSRF)
  },
}
