import {config} from '../../shared/config';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import {UserRepository} from '../user/user.repository';
import {SessionRepository} from './session.repository';
import {HttpException} from '../../shared/exceptions/http-exception';
import {TokenService} from '../../shared/services/token.service';
import {TJWTPayload, TRefreshTokenPayload, TTokenPair} from '../../shared/types/auth.types';
import {TAuthRequest, TLogin} from './auth.schema';

import {parseDurationToMs} from '../../shared/utils/duration';

/**
 * Gold Standard:
 * AuthService handles all core authentication business logic, including
 * registration, login, and token management. It delegates token operations
 * to TokenService and interacts with UserRepository for data persistence.
 * Now enhanced with SessionRepository for token revocation and tracking.
 */
export class AuthService {
  private userRepository: UserRepository;
  private sessionRepository: SessionRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.sessionRepository = new SessionRepository();
  }

  /**
   * Private helper to create a session record.
   */
  private async createSession(userId: string, refreshToken: string, fixedExpiresAt?: Date) {
    const expiresAt = fixedExpiresAt || new Date(Date.now() + parseDurationToMs(config.REFRESH_TOKEN_DURATION));

    await this.sessionRepository.create({
      userId,
      refreshToken,
      expiresAt
    });
  }

  /**
   * Authenticates a user with email and password.
   * Gold Standard: Password comparison is done using bcrypt.
   */
  async login(data: TLogin): Promise<TTokenPair> {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new HttpException('Invalid email or password', httpStatus.UNAUTHORIZED);
    }

    // 1. Prepare Payload for Access Token
    const payload: TJWTPayload = {
      id: String(user.id),
      email: user.email,
      role: user.role
    };

    // 2. Prepare Payload for Refresh Token
    const refreshPayload: TRefreshTokenPayload = {
      id: String(user.id),
      email: user.email
    };

    // 3. Generate Tokens asynchronously using TokenService
    const [accessToken, refreshToken] = await Promise.all([
      TokenService.signAccessToken(payload),
      TokenService.signRefreshToken(refreshPayload)
    ]);

    // 4. Persistence: Store the refresh token in the Session table
    await this.createSession(user.id, refreshToken);

    return {accessToken, refreshToken};
  }

  /**
   * Registers a new user.
   * Gold Standard: Hashes the password before storing and generates tokens immediately.
   */
  async register(data: TAuthRequest): Promise<TTokenPair> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new HttpException('User already exists', httpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.userRepository.create({
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      role: 'USER'
    });

    const payload: TJWTPayload = {
      id: String(user.id),
      email: user.email,
      role: user.role
    };

    const refreshPayload: TRefreshTokenPayload = {
      id: String(user.id),
      email: user.email
    };

    const [accessToken, refreshToken] = await Promise.all([
      TokenService.signAccessToken(payload),
      TokenService.signRefreshToken(refreshPayload)
    ]);

    // 4. Persistence: Store the refresh token in the Session table
    await this.createSession(user.id, refreshToken);

    return {accessToken, refreshToken};
  }

  /**
   * Refreshes the access token using a valid refresh token and rotates the refresh token.
   */
  async refreshToken(refreshToken: string): Promise<TTokenPair & {expiresAt: Date}> {
    // 1. Database Check: Ensure the token hasn't been revoked/logged out
    const session = await this.sessionRepository.findByToken(refreshToken);

    if (!session || session.expiresAt < new Date()) {
      if (session) await this.sessionRepository.deleteByToken(refreshToken);
      throw new HttpException('Session expired or invalid', httpStatus.UNAUTHORIZED);
    }

    try {
      // 2. JWT Validation
      const payload = await TokenService.verifyRefreshToken(refreshToken);
      const user = await this.userRepository.findById(payload.id);

      if (!user) {
        throw new Error();
      }

      // 3. Absolute Expiry Management
      // Calculate remaining time until the ORIGINAL session expires
      const oldExpiresAt = new Date(session.expiresAt);
      const remainingSeconds = Math.max(0, Math.floor((oldExpiresAt.getTime() - Date.now()) / 1000));

      // 4. Token Rotation (Issue new tokens with the SAME absolute deadline)
      const accessToken = await TokenService.signAccessToken({
        id: user.id,
        email: user.email,
        role: user.role
      });

      const newRefreshToken = await TokenService.signRefreshToken(
        {id: String(user.id), email: user.email},
        remainingSeconds // <-- Preserve the deadline in the new JWT
      );

      // 5. Session Rotation (Replace old session with new one under the SAME deadline)
      await this.sessionRepository.deleteByToken(refreshToken);
      await this.createSession(user.id, newRefreshToken, oldExpiresAt);

      return {accessToken, refreshToken: newRefreshToken, expiresAt: oldExpiresAt};
    } catch {
      // If JWT verification fails, cleanup database record
      await this.sessionRepository.deleteByToken(refreshToken);
      throw new HttpException('Invalid refresh token', httpStatus.UNAUTHORIZED);
    }
  }

  /**
   * Revokes a session (Logout).
   */
  async logout(refreshToken: string): Promise<void> {
    try {
      await this.sessionRepository.deleteByToken(refreshToken);
    } catch {
      // Ignore if session already deleted
    }
  }
}
