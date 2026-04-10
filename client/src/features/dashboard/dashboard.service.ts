import api from '@/shared/api/api-config';

export interface TDashboardStats {
  totalUsers: number;
  totalActivities: number;
  activeUsersToday: number;
  growthRate: string;
}

export interface TActivity {
  id: string;
  type: string;
  action: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export const dashboardService = {
  getStats: async () => {
    // Note: We'll need to add /dashboard/stats to API_ENDPOINTS or use string
    const response = await api.get<TDashboardStats>('/dashboard/stats');
    return response.data;
  },

  getActivities: async () => {
    const response = await api.get<TActivity[]>('/dashboard/activities');
    return response.data;
  }
};
