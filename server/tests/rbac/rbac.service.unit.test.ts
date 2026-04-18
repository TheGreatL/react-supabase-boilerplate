import {describe, it, expect, vi, beforeEach} from 'vitest';
import {RBACService} from '../../src/features/rbac/rbac.service';

// 1. Setup repo mocks using hoisted functions
const findRoleByNameMock = vi.fn();
const getUserPermissionsMock = vi.fn();
const getUserRolesMock = vi.fn();
const assignRoleToUserMock = vi.fn();

vi.mock('../../src/features/rbac/rbac.repository', () => {
  return {
    RBACRepository: class {
      findRoleByName = findRoleByNameMock;
      getUserPermissions = getUserPermissionsMock;
      getUserRoles = getUserRolesMock;
      assignRoleToUser = assignRoleToUserMock;
    }
  };
});

describe('RBACService', () => {
  let rbacService: RBACService;
  const mockUserId = '123e4567-e89b-12d3-a456-426614174000';

  beforeEach(() => {
    vi.clearAllMocks();
    rbacService = new RBACService();
  });

  describe('getUserPermissions', () => {
    it('should return permissions for a user', async () => {
      const mockPermissions = [
        {module: 'USERS', permission: 'READ'},
        {module: 'USERS', permission: 'WRITE'}
      ];
      getUserPermissionsMock.mockResolvedValue(mockPermissions);

      const result = await rbacService.getUserPermissions(mockUserId);

      expect(getUserPermissionsMock).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(mockPermissions);
    });
  });

  describe('getUserRoles', () => {
    it('should return roles for a user', async () => {
      const mockRoles = ['ADMIN', 'USER'];
      getUserRolesMock.mockResolvedValue(mockRoles);

      const result = await rbacService.getUserRoles(mockUserId);

      expect(getUserRolesMock).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(mockRoles);
    });
  });

  describe('assignRoleToUser', () => {
    it('should assign a role if it exists', async () => {
      const roleName = 'ADMIN';
      const mockRole = {id: 'role-uuid', name: roleName};
      findRoleByNameMock.mockResolvedValue(mockRole);
      assignRoleToUserMock.mockResolvedValue(undefined);

      await rbacService.assignRoleToUser(mockUserId, roleName);

      expect(findRoleByNameMock).toHaveBeenCalledWith(roleName);
      expect(assignRoleToUserMock).toHaveBeenCalledWith(mockUserId, mockRole.id);
    });

    it('should throw error if role is not found', async () => {
      const roleName = 'NON_EXISTENT';
      findRoleByNameMock.mockResolvedValue(null);

      await expect(rbacService.assignRoleToUser(mockUserId, roleName)).rejects.toThrow(
        `Role ${roleName} not found`
      );

      expect(assignRoleToUserMock).not.toHaveBeenCalled();
    });
  });
});
