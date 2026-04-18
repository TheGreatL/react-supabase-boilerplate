import {Users} from '../database/db.types';
import {Selectable} from 'kysely';

/**
 * Gold Standard:
 * Centralizing complex types in a shared types directory.
 */

// TUserWithProfile is removed as Profile model is not yet implemented

export interface TUserContext extends Omit<Selectable<Users>, 'password' | 'profilePhoto'> {
  roles: string[];
  permissions: string[];
  profilePhoto: string | null;
}

export const mapToContext = (user: Selectable<Users>, roles: string[], permissions: string[]): TUserContext => {
  const {password: _, profilePhoto: _profilePhoto, ...rest} = user;
  return {
    ...rest,
    roles,
    permissions,
    profilePhoto: null // Will be signed by service
  };
};

export type TUserBasic = Pick<Selectable<Users>, 'id' | 'email' | 'firstName' | 'lastName'>;
