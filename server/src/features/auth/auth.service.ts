import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import {UserRepository} from '../user/user.repository';
import {HttpException} from '../../shared/exceptions/http-exception';
import {TokenService} from '../../shared/services/token.service';
import {TJWTPayload, TRefreshTokenPayload, TTokenPair} from '../../shared/types/auth.types';
import {TAuthRequest, TLogin} from './auth.schema';

/**
 * Gold Standard:
 * AuthService handles all core authentication business logic, including
 * registration, login, and token management. It delegates token operations
 * to TokenService and interacts with UserRepository for data persistence.
 */
export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
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

    return {accessToken, refreshToken};
  }

  /**
   * Issues a new access token using a valid refresh token.
   * Gold Standard: Decentralized validation via TokenService.
   */
  async refreshToken(refreshToken: string): Promise<string> {
    try {
      // 1. Verify Refresh Token asynchronously
      const decoded = await TokenService.verifyRefreshToken(refreshToken);

      // 2. Fetch User to ensure they still exist and get current role
      const user = await this.userRepository.findById(decoded.id);
      if (!user) throw new HttpException('User no longer exists', httpStatus.UNAUTHORIZED);

      // 3. Issue new Access Token
      const payload: TJWTPayload = {
        id: String(user.id),
        email: user.email,
        role: user.role
      };

      return await TokenService.signAccessToken(payload);
    } catch {
      throw new HttpException('Invalid refresh token', httpStatus.UNAUTHORIZED);
    }
  }
}
