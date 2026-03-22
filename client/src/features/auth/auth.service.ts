import api from '../../shared/api/api-config'
import type { TLogin, TRegister } from './auth.schema'

export const authService = {
  login: async (data: TLogin) => {
    const response = await api.post('/auth/login', data)
    return response.data
  },

  register: async (data: TRegister) => {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },

  getMe: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },
}
