import {describe, it, expect, vi, beforeEach} from 'vitest';
import type {Selectable} from 'kysely';
import type {Users} from '../../src/shared/database/db.types';

/**
 * Gold Standard Unit Test Pattern (ESM / no-DI):
 * Mock classes and their instances using vi.hoisted() for handle access.
 */

const repoMethods = vi.hoisted(() => ({
  findById: vi.fn(),
  findAll: vi.fn(),
  count: vi.fn(),
  update: vi.fn(),
  create: vi.fn()
}));

const rbacMethods = vi.hoisted(() => ({
  getUserRoles: vi.fn(),
  getUserPermissions: vi.fn()
}));

const storageMethods = vi.hoisted(() => ({
  upload: vi.fn(),
  delete: vi.fn(),
  getSignedUrl: vi.fn()
}));

const activityMethods = vi.hoisted(() => ({
  recordLog: vi.fn()
}));

vi.mock('../../src/features/user/user.repository', () => {
  class UserRepository {
    findById = repoMethods.findById;
    findAll = repoMethods.findAll;
    count = repoMethods.count;
    update = repoMethods.update;
    create = repoMethods.create;
  }
  return {UserRepository};
});

vi.mock('../../src/features/rbac/rbac.service', () => {
  class RBACService {
    getUserRoles = rbacMethods.getUserRoles;
    getUserPermissions = rbacMethods.getUserPermissions;
  }
  return {RBACService};
});

vi.mock('../../src/shared/providers/storage.provider', () => ({
  getStorageProvider: vi.fn(() => ({
    upload: storageMethods.upload,
    delete: storageMethods.delete,
    getSignedUrl: storageMethods.getSignedUrl
  }))
}));

vi.mock('../../src/shared/services/activity.service', () => ({
  activityService: {
    recordLog: activityMethods.recordLog
  }
}));

// ─── Fixtures ────────────────────────────────────────────────────────────────

const VALID_USER_ID = '550e8400-e29b-41d4-a716-446655440000';

const mockUser: Selectable<Users> = {
  id: VALID_USER_ID,
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  password: 'hashed-password',
  profilePhoto: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('UserService', () => {
  let userService: import('../../src/features/user/user.service').UserService;

  beforeEach(async () => {
    vi.clearAllMocks();
    const {UserService} = await import('../../src/features/user/user.service');
    userService = new UserService();
    
    // Default RBAC mocks
    rbacMethods.getUserRoles.mockResolvedValue(['USER']);
    rbacMethods.getUserPermissions.mockResolvedValue([{ module: 'USERS', permission: 'READ' }]);
    storageMethods.getSignedUrl.mockImplementation(async (path) => `signed-${path}`);
  });

  describe('getUserById', () => {
    it('returns the user when found with roles and permissions', async () => {
      repoMethods.findById.mockResolvedValue(mockUser);

      const result = await userService.getUserById(VALID_USER_ID);

      expect(result.id).toBe(VALID_USER_ID);
      expect(result.roles).toEqual(['USER']);
      expect(result.permissions).toContain('USERS:READ');
      expect(repoMethods.findById).toHaveBeenCalledWith(VALID_USER_ID);
    });

    it('throws NotFoundException when user does not exist', async () => {
      repoMethods.findById.mockResolvedValue(null);

      await expect(userService.getUserById(VALID_USER_ID)).rejects.toThrow('User not found');
    });
  });

  describe('getAllUsers', () => {
    it('returns paginated users with total count', async () => {
      repoMethods.findAll.mockResolvedValue([mockUser]);
      repoMethods.count.mockResolvedValue(1);

      const result = await userService.getAllUsers(1, 10);

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.data[0].roles).toBeDefined();
    });
  });

  describe('updateUser', () => {
    it('updates and returns the updated user', async () => {
      const updatedUser = {...mockUser, firstName: 'Updated'};
      repoMethods.findById.mockResolvedValue(mockUser);
      repoMethods.update.mockResolvedValue(updatedUser);

      const result = await userService.updateUser(VALID_USER_ID, {firstName: 'Updated'});

      expect(result.firstName).toBe('Updated');
      expect(activityMethods.recordLog).toHaveBeenCalledWith(
        VALID_USER_ID, 
        'USERS', 
        'Profile Updated', 
        expect.any(String)
      );
    });
  });

  describe('updateProfilePhoto', () => {
    const mockFile = {
      buffer: Buffer.from('fake'),
      originalname: 'test.png'
    } as Express.Multer.File;

    it('uploads a new photo and updates the user record', async () => {
      repoMethods.findById.mockResolvedValue(mockUser);
      storageMethods.upload.mockResolvedValue('profile-photos/new.png');
      repoMethods.update.mockResolvedValue({...mockUser, profilePhoto: 'profile-photos/new.png'});

      const result = await userService.updateProfilePhoto(VALID_USER_ID, mockFile);

      expect(storageMethods.upload).toHaveBeenCalledWith(mockFile, 'profile-photos');
      expect(repoMethods.update).toHaveBeenCalledWith(VALID_USER_ID, {profilePhoto: 'profile-photos/new.png'});
      expect(result.profilePhoto).toContain('profile-photos/new.png');
    });

    it('cleans up the old photo if one already existed', async () => {
      const userWithPhoto = {...mockUser, profilePhoto: 'profile-photos/old.png'};
      repoMethods.findById.mockResolvedValue(userWithPhoto);
      storageMethods.upload.mockResolvedValue('profile-photos/new.png');
      repoMethods.update.mockResolvedValue({...mockUser, profilePhoto: 'profile-photos/new.png'});
      storageMethods.delete.mockResolvedValue(undefined);

      await userService.updateProfilePhoto(VALID_USER_ID, mockFile);

      expect(storageMethods.delete).toHaveBeenCalledWith('profile-photos/old.png');
    });
  });
});
