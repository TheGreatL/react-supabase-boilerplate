import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import {UserRepository} from '../user/user.repository';
import {SessionRepository} from './session.repository';
import {HttpException} from '../../shared/exceptions/http-exception';
import {TokenService} from '../../shared/services/token.service';
import {TJWTPayload, TRefreshTokenPayload, TTokenPair} from '../../shared/types/auth.types';
import {TAuthRequest, TLogin} from './auth.schema';

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
  private async createSession(userId: string, refreshToken: string) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days matching cookie maxAge

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
   * Issues a new token pair using a valid refresh token.
   * Gold Standard: Implements Refresh Token Rotation — the old token is
   * invalidated and a brand-new token pair is issued on every refresh.
   * This limits the theft window to a single use of a stolen token.
   */
  async refreshToken(refreshToken: string): Promise<TTokenPair> {
    // 1. Database Check: Ensure the token hasn't been revoked/logged out
    const session = await this.sessionRepository.findByToken(refreshToken);

    if (!session || session.expiresAt < new Date()) {
      if (session) await this.sessionRepository.deleteByToken(refreshToken);
      throw new HttpException('Session expired or invalid', httpStatus.UNAUTHORIZED);
    }

    try {
      // 2. JWT Validation
      await TokenService.verifyRefreshToken(refreshToken);

      // 3. Build payload from session's user data (no extra DB call needed)
      const accessPayload: TJWTPayload = {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role
      };

      const refreshPayload: TRefreshTokenPayload = {
        id: session.user.id,
        email: session.user.email
      };

      // 4. Rotation: Atomically delete old session and issue fresh tokens
      const [newAccessToken, newRefreshToken] = await Promise.all([
        TokenService.signAccessToken(accessPayload),
        TokenService.signRefreshToken(refreshPayload),
        this.sessionRepository.deleteByToken(refreshToken)
      ]);

      // 5. Persist the new session
      await this.createSession(session.user.id, newRefreshToken);

      return {accessToken: newAccessToken, refreshToken: newRefreshToken};
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
