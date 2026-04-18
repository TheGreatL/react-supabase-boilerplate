import {describe, it, expect, vi, beforeEach} from 'vitest';
import {AuthService} from '../../src/features/auth/auth.service';

// 1. Hoist mock functions
const user_findByEmail = vi.fn();
const user_findById = vi.fn();
const user_create = vi.fn();

const session_create = vi.fn();
const session_findByToken = vi.fn();
const session_deleteByToken = vi.fn();

const rbac_getUserRoles = vi.fn();
const rbac_getUserPermissions = vi.fn();
const rbac_assignRoleToUser = vi.fn();

// 2. Mock modules using Class-in-Mock pattern
vi.mock('../../src/features/user/user.repository', () => ({
  UserRepository: class {
    findByEmail = user_findByEmail;
    findById = user_findById;
    create = user_create;
  }
}));

vi.mock('../../src/features/auth/session.repository', () => ({
  SessionRepository: class {
    create = session_create;
    findByToken = session_findByToken;
    deleteByToken = session_deleteByToken;
  }
}));

vi.mock('../../src/features/rbac/rbac.service', () => ({
  RBACService: class {
    getUserRoles = rbac_getUserRoles;
    getUserPermissions = rbac_getUserPermissions;
    assignRoleToUser = rbac_assignRoleToUser;
  }
}));

vi.mock('../../src/shared/services/token.service', () => ({
  TokenService: {
    signAccessToken: vi.fn().mockResolvedValue('mock-access-token'),
    signRefreshToken: vi.fn().mockResolvedValue('mock-refresh-token'),
    verifyRefreshToken: vi.fn().mockResolvedValue({id: 'user-1', email: 't@t.com'})
  }
}));

// Mock bcrypt
vi.mock('bcrypt', () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn()
  }
}));

// Mock external services
vi.mock('../../src/shared/services/activity.service', () => ({
  activityService: {
    recordLog: vi.fn()
  }
}));

vi.mock('../../src/shared/services/mail.service', () => ({
  mailService: {
    sendEmail: vi.fn().mockResolvedValue(undefined)
  }
}));

import bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    vi.clearAllMocks();
    authService = new AuthService();
  });

  describe('login', () => {
    it('should login successfully with correct credentials', async () => {
      const mockUser = {
        id: 'user-uuid',
        email: 'test@example.com',
        password: 'hashedPassword',
        firstName: 'Test',
        lastName: 'User'
      };
      const credentials = {email: 'test@example.com', password: 'password123'};

      user_findByEmail.mockResolvedValue(mockUser);
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
      rbac_getUserRoles.mockResolvedValue(['USER']);
      rbac_getUserPermissions.mockResolvedValue([]);
      session_create.mockResolvedValue(undefined);

      const result = await authService.login(credentials);

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.user.email).toBe(mockUser.email);
      expect(session_create).toHaveBeenCalled();
    });

    it('should throw error for invalid password', async () => {
      const mockUser = {id: 'u-1', email: 'test@example.com', password: 'hashed'};
      user_findByEmail.mockResolvedValue(mockUser);
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      await expect(authService.login({email: 'test@example.com', password: 'wrong'})).rejects.toThrow(
        'Invalid email or password'
      );
    });
  });

  describe('register', () => {
    it('should register a new user and assign default role', async () => {
      const regData = {
        email: 'new@example.com',
        password: 'Pass123!',
        firstName: 'New',
        lastName: 'User'
      };

      user_findByEmail.mockResolvedValue(null);
      vi.mocked(bcrypt.hash).mockResolvedValue('newHashed' as never);
      user_create.mockResolvedValue({id: 'new-uuid', ...regData, password: 'newHashed'});
      rbac_getUserRoles.mockResolvedValue(['USER']);
      rbac_getUserPermissions.mockResolvedValue([]);

      const result = await authService.register(regData);

      expect(user_create).toHaveBeenCalled();
      expect(rbac_assignRoleToUser).toHaveBeenCalledWith('new-uuid', 'USER');
      expect(result.user.email).toBe(regData.email);
    });

    it('should throw error if user already exists', async () => {
      user_findByEmail.mockResolvedValue({id: '1'});
      await expect(authService.register({email: 'ex@ex.com', password: '123', firstName: 'f', lastName: 'l'})).rejects.toThrow('User already exists');
    });
  });

  describe('refreshToken', () => {
    it('should rotate tokens if session is valid', async () => {
      const oldToken = 'old-refresh';
      const mockSession = {
        userId: 'user-1',
        refreshToken: oldToken,
        expiresAt: new Date(Date.now() + 100000)
      };

      session_findByToken.mockResolvedValue(mockSession);
      user_findById.mockResolvedValue({id: 'user-1', email: 't@t.com'});
      rbac_getUserRoles.mockResolvedValue([]);

      const result = await authService.refreshToken(oldToken);

      expect(result.accessToken).toBeDefined();
      expect(session_deleteByToken).toHaveBeenCalledWith(oldToken);
      expect(session_create).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should delete session and record log', async () => {
      const token = 'token-to-delete';
      await authService.logout(token, 'user-1');

      expect(session_deleteByToken).toHaveBeenCalledWith(token);
    });
  });
});
