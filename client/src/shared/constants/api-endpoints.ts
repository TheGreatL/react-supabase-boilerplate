const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    CSRF: '/auth/csrf',
  },
  USER: {
    ID: '/users/:userId',
    PROFILE: '/user/profile',
    PROFILE_AVATAR: '/user/profile/avatar',
  },
}
export default API_ENDPOINTS
