import api from './api-config'
import API_ENDPOINTS from '@/shared/constants/api-endpoints'
import type { TUser } from '../stores/auth.store'

export const userService = {
  /**
   * Updates the user's avatar image.
   * Sends a multipart/form-data request to the backend.
   */
  updateAvatar: async (file: File) => {
    const formData = new FormData()
    formData.append('avatar', file)

    const response = await api.patch<TUser>(
      API_ENDPOINTS.USER.PROFILE_AVATAR || '/user/profile/avatar',
      formData,
    )
    return response.data
  },

  /**
   * Updates other profile information like first and last name.
   */
  updateProfile: async (data: Partial<TUser>) => {
    const response = await api.patch<TUser>(
      API_ENDPOINTS.USER.PROFILE || '/user/profile',
      data,
    )
    return response.data
  },
}
