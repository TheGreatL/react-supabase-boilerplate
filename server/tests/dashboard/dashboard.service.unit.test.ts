import {describe, it, expect, vi, beforeEach} from 'vitest';
import {DashboardService} from '../../src/features/dashboard/dashboard.service';

// 1. Setup mocks
const repoMocks = vi.hoisted(() => ({
  getUserCount: vi.fn(),
  getActivityCount: vi.fn(),
  getActiveUsersCount: vi.fn()
}));

vi.mock('../../src/features/dashboard/dashboard.repository', () => {
  return {
    dashboardRepository: {
      getUserCount: repoMocks.getUserCount,
      getActivityCount: repoMocks.getActivityCount,
      getActiveUsersCount: repoMocks.getActiveUsersCount
    },
    DashboardRepository: vi.fn()
  };
});

describe('DashboardService', () => {
  let dashboardService: DashboardService;

  beforeEach(() => {
    vi.clearAllMocks();
    // Using the exported instance logic or creating a new one with injected dependency
    dashboardService = new DashboardService();
  });

  it('should return combined statistics from the repository', async () => {
    repoMocks.getUserCount.mockResolvedValue(100);
    repoMocks.getActivityCount.mockResolvedValue(550);
    repoMocks.getActiveUsersCount.mockResolvedValue(40);

    const stats = await dashboardService.getDashboardStats();

    expect(stats).toEqual({
      totalUsers: 100,
      totalActivities: 550,
      activeUsersToday: 40,
      growthRate: expect.any(String)
    });

    expect(repoMocks.getUserCount).toHaveBeenCalled();
    expect(repoMocks.getActivityCount).toHaveBeenCalled();
  });
});
