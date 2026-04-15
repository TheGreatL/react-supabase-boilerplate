import {describe, it, expect, vi, beforeEach} from 'vitest';
import type {Selectable} from 'kysely';
import type {TUser} from '../../src/shared/database/db.types';

/**
 * Gold Standard Unit Test Pattern (ESM / no-DI):
 *
 * When a service instantiates its own repository (no constructor injection),
 * mock the class in vi.mock() by providing a class body. The trick for
 * getting a handle on the instance's methods is to store them on a shared
 * object via vi.hoisted(), because vi.mock() runs before all imports.
 */

// vi.hoisted() runs before any imports — safe to reference inside vi.mock()
const repoMethods = vi.hoisted(() => ({
  findById: vi.fn(),
  findAll: vi.fn(),
  count: vi.fn(),
  update: vi.fn(),
  create: vi.fn()
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

// ─── Fixtures ────────────────────────────────────────────────────────────────

const mockUser: Selectable<TUser> = {
  id: 'user-1',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  password: 'hashed-password',
  role: 'USER',
  avatar: null,
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
  });

  describe('getUserById', () => {
    it('returns the user when found', async () => {
      repoMethods.findById.mockResolvedValue(mockUser);

      const result = await userService.getUserById('user-1');

      expect(result).toEqual(mockUser);
      expect(repoMethods.findById).toHaveBeenCalledWith('user-1');
    });

    it('throws NotFoundException when user does not exist', async () => {
      repoMethods.findById.mockResolvedValue(null);

      await expect(userService.getUserById('nonexistent-id')).rejects.toThrow('User not found');
    });
  });

  describe('getAllUsers', () => {
    it('returns paginated users with total count', async () => {
      repoMethods.findAll.mockResolvedValue([mockUser]);
      repoMethods.count.mockResolvedValue(1);

      const result = await userService.getAllUsers(1, 10);

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(repoMethods.findAll).toHaveBeenCalledWith(0, 10, undefined);
    });

    it('calculates correct skip offset for page 2', async () => {
      repoMethods.findAll.mockResolvedValue([]);
      repoMethods.count.mockResolvedValue(0);

      await userService.getAllUsers(2, 10);

      expect(repoMethods.findAll).toHaveBeenCalledWith(10, 10, undefined);
    });
  });

  describe('updateUser', () => {
    it('updates and returns the updated user', async () => {
      const updatedUser = {...mockUser, firstName: 'Updated'};
      repoMethods.findById.mockResolvedValue(mockUser);
      repoMethods.update.mockResolvedValue(updatedUser);

      const result = await userService.updateUser('user-1', {firstName: 'Updated'});

      expect(result.firstName).toBe('Updated');
    });

    it('throws NotFoundException if user does not exist before update', async () => {
      repoMethods.findById.mockResolvedValue(null);

      await expect(userService.updateUser('bad-id', {firstName: 'X'})).rejects.toThrow('User not found');
      expect(repoMethods.update).not.toHaveBeenCalled();
    });
  });
});
