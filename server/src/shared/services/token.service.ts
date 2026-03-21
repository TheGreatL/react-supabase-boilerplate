import jwt from 'jsonwebtoken';
import {promisify} from 'util';
import {config} from '../config';
import {TJWTPayload, TRefreshTokenPayload} from '../types/auth.types';

// Promisifying jwt methods to support async/await
// Using 'any' cast for the promisified function to avoid complex signature mismatch issues while keeping it safe for internal use
const signAsync = promisify(jwt.sign as any);
const verifyAsync = promisify(jwt.verify as any);

/**
 * Gold Standard:
 * TokenService encapsulates all JWT operations, ensuring a single source of truth
 * for token generation, verification, and configuration.
 * All methods are asynchronous to avoid blocking the event loop.
 */
export class TokenService {
  /**
   * Generates a new Access Token for the given payload.
   */
  static async signAccessToken(payload: TJWTPayload): Promise<string> {
    return (await signAsync(payload, config.ACCESS_TOKEN_SECRET, {
      expiresIn: config.ACCESS_TOKEN_DURATION as string
    })) as string;
  }

  /**
   * Generates a new Refresh Token for the given payload.
   */
  static async signRefreshToken(payload: TRefreshTokenPayload, expiresIn?: string | number): Promise<string> {
    return (await signAsync(payload, config.REFRESH_TOKEN_SECRET, {
      expiresIn: expiresIn || (config.REFRESH_TOKEN_DURATION as string)
    })) as string;
  }

  /**
   * Verifies a token against the provided secret.
   */
  static async verifyToken<T>(token: string, secret: string): Promise<T> {
    return (await verifyAsync(token, secret, {})) as T;
  }

  /**
   * Specifically verifies an Access Token.
   */
  static async verifyAccessToken(token: string): Promise<TJWTPayload> {
    return this.verifyToken<TJWTPayload>(token, config.ACCESS_TOKEN_SECRET as string);
  }

  /**
   * Specifically verifies a Refresh Token.
   */
  static async verifyRefreshToken(token: string): Promise<TRefreshTokenPayload> {
    return this.verifyToken<TRefreshTokenPayload>(token, config.REFRESH_TOKEN_SECRET as string);
  }
}
