import {Role} from '@prisma/client';

/**
 * Payload stored within identifying JWT tokens
 */
export interface TJWTPayload {
  id: string;
  email: string;
  role: Role;
}

/**
 * Payload for refresh tokens (typically contains less info)
 */
export interface TRefreshTokenPayload {
  id: string;
  email: string;
}

/**
 * Standard pair of tokens returned upon successful authentication
 */
export interface TTokenPair {
  accessToken: string;
  refreshToken: string;
}
