import {Request} from 'express';

/**
 * Payload stored within identifying JWT tokens
 */
export interface TJWTPayload {
  id: string;
  email: string;
  roles: string[];
  profilePhoto: string | null;
}

/**
 * Payload for refresh tokens (typically contains less info)
 */
export interface TRefreshTokenPayload {
  id: string;
  email: string;
  jti?: string;
}

/**
 * Standard pair of tokens returned upon successful authentication
 */
export interface TTokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Request object with user payload attached
 */
export interface TAuthenticatedRequest extends Request {
  user?: TJWTPayload;
}
