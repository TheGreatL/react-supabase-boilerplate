import {config} from '../../shared/config';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import {UserRepository} from '../user/user.repository';
import {SessionRepository} from './session.repository';
import {getStorageProvider} from '../../shared/providers/storage.provider';
import {HttpException} from '../../shared/exceptions/http-exception';
import {TokenService} from '../../shared/services/token.service';
import {Users} from '../../shared/database/db.types';
import {TJWTPayload, TRefreshTokenPayload, TTokenPair} from '../../shared/types/auth.types';
import {TAuthRequest, TLogin} from './auth.schema';
import {parseDurationToMs} from '../../shared/utils/duration';
import {WelcomeEmail} from '../../shared/templates/welcome-email';
import {activityService} from '../../shared/services/activity.service';
import {mailService} from '../../shared/services/mail.service';
import {Selectable} from 'kysely';
import {RBACService} from '../rbac/rbac.service';

/**
 * Gold Standard:
 * AuthService handles all core authentication business logic using Kysely,
 * enhanced with SessionRepository for token revocation and tracking.
 */
export class AuthService {
  private userRepository: UserRepository;
  private sessionRepository: SessionRepository;
  private rbacService: RBACService;

  constructor() {
    this.userRepository = new UserRepository();
    this.sessionRepository = new SessionRepository();
    this.rbacService = new RBACService();
  }

  /**
   * Private helper to create a session record.
   */
  private async createSession(userId: string, refreshToken: string, fixedExpiresAt?: Date) {
    const expiresAt = fixedExpiresAt || new Date(Date.now() + parseDurationToMs(config.REFRESH_TOKEN_DURATION));

    await this.sessionRepository.create({
      id: crypto.randomUUID(),
      userId,
      refreshToken,
      expiresAt,
      updatedAt: new Date()
    });
  }

  /**
   * Authenticates a user with email and password.
   */
  async login(
    data: TLogin
  ): Promise<TTokenPair & {user: Omit<Selectable<Users>, 'password'> & {roles: string[]; permissions: string[]}}> {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new HttpException('Invalid email or password', httpStatus.UNAUTHORIZED);
    }

    // Fetch user roles and permissions for the token payload and frontend
    const [roles, permissionsData] = await Promise.all([
      this.rbacService.getUserRoles(user.id),
      this.rbacService.getUserPermissions(user.id)
    ]);

    const permissions = permissionsData.map((p) => `${p.module}:${p.permission}`);

    // 1. Prepare Payload for Access Token
    const payload: TJWTPayload = {
      id: String(user.id),
      email: user.email,
      roles: roles,
      profilePhoto: user.profilePhoto ? await getStorageProvider().getSignedUrl(user.profilePhoto) : null
    };

    // 2. Prepare Payload for Refresh Token with unique JTI to prevent collisions
    const refreshPayload: TRefreshTokenPayload = {
      id: String(user.id),
      email: user.email,
      jti: crypto.randomUUID()
    };

    // 3. Generate Tokens
    const [accessToken, refreshToken] = await Promise.all([
      TokenService.signAccessToken(payload),
      TokenService.signRefreshToken(refreshPayload)
    ]);

    // 4. Persistence
    await this.createSession(user.id, refreshToken);

    // Log Activity (Module placeholder for Auth)
    await activityService.recordLog(user.id, 'AUTH', 'Login', 'User logged in successfully');

    const {password: _, ...userWithoutPassword} = user;
    return {
      accessToken,
      refreshToken,
      user: {
        ...userWithoutPassword,
        profilePhoto: payload.profilePhoto,
        roles,
        permissions
      }
    };
  }

  /**
   * Registers a new user.
   */
  async register(
    data: TAuthRequest
  ): Promise<TTokenPair & {user: Omit<Selectable<Users>, 'password'> & {roles: string[]; permissions: string[]}}> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new HttpException('User already exists', httpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.userRepository.create({
      id: crypto.randomUUID(),
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      updatedAt: new Date()
    });

    // Assign default 'USER' role
    await this.rbacService.assignRoleToUser(user.id, 'USER');

    // Fetch newly assigned roles and permissions
    const [roles, permissionsData] = await Promise.all([
      this.rbacService.getUserRoles(user.id),
      this.rbacService.getUserPermissions(user.id)
    ]);

    const permissions = permissionsData.map((p) => `${p.module}:${p.permission}`);

    const payload: TJWTPayload = {
      id: String(user.id),
      email: user.email,
      roles: roles,
      profilePhoto: user.profilePhoto ? await getStorageProvider().getSignedUrl(user.profilePhoto) : null
    };

    const refreshPayload: TRefreshTokenPayload = {
      id: String(user.id),
      email: user.email,
      jti: crypto.randomUUID()
    };

    const [accessToken, refreshToken] = await Promise.all([
      TokenService.signAccessToken(payload),
      TokenService.signRefreshToken(refreshPayload)
    ]);

    await this.createSession(user.id, refreshToken);

    // Log Activity
    await activityService.recordLog(user.id, 'AUTH', 'Registration', 'New user registered');

    // Send Welcome Email (Fire and forget)
    mailService
      .sendEmail(user.email, 'Welcome to Boilerplate!', WelcomeEmail({name: `${user.firstName} ${user.lastName}`}))
      .catch((err) => console.error('Failed to send welcome email:', err));

    const {password: _, ...userWithoutPassword} = user;
    return {
      accessToken,
      refreshToken,
      user: {
        ...userWithoutPassword,
        profilePhoto: payload.profilePhoto,
        roles,
        permissions
      }
    };
  }

  /**
   * Refreshes the access token.
   */
  async refreshToken(refreshToken: string): Promise<TTokenPair & {expiresAt: Date}> {
    const session = await this.sessionRepository.findByToken(refreshToken);

    if (!session || session.expiresAt < new Date()) {
      if (session) await this.sessionRepository.deleteByToken(refreshToken);
      throw new HttpException('Session expired or invalid', httpStatus.UNAUTHORIZED);
    }

    try {
      const payload = await TokenService.verifyRefreshToken(refreshToken);
      const user = await this.userRepository.findById(payload.id);

      if (!user) {
        throw new Error();
      }

      // Fetch user roles for the new token
      const roles = await this.rbacService.getUserRoles(user.id);

      const oldExpiresAt = new Date(session.expiresAt);
      const remainingSeconds = Math.max(0, Math.floor((oldExpiresAt.getTime() - Date.now()) / 1000));

      const accessToken = await TokenService.signAccessToken({
        id: user.id,
        email: user.email,
        roles: roles,
        profilePhoto: user.profilePhoto ? await getStorageProvider().getSignedUrl(user.profilePhoto) : null
      });

      const newRefreshToken = await TokenService.signRefreshToken(
        {id: String(user.id), email: user.email, jti: crypto.randomUUID()},
        remainingSeconds
      );

      await this.sessionRepository.deleteByToken(refreshToken);
      await this.createSession(user.id, newRefreshToken, oldExpiresAt);

      return {accessToken, refreshToken: newRefreshToken, expiresAt: oldExpiresAt};
    } catch {
      await this.sessionRepository.deleteByToken(refreshToken);
      throw new HttpException('Invalid refresh token', httpStatus.UNAUTHORIZED);
    }
  }

  /**
   * Revokes a session (Logout).
   */
  async logout(refreshToken: string, userId?: string): Promise<void> {
    try {
      await this.sessionRepository.deleteByToken(refreshToken);
      if (userId) {
        await activityService.recordLog(userId, 'AUTH', 'Logout', 'User logged out');
      }
    } catch {
      // Ignore
    }
  }
}
