import { TUser } from '../database/db.types';
import { Selectable } from 'kysely';

/**
 * Gold Standard:
 * Centralizing complex types in a shared types directory.
 */

// TUserWithProfile is removed as Profile model is not yet implemented

export type TUserBasic = Pick<Selectable<TUser>, 'id' | 'email' | 'firstName' | 'lastName' | 'role'>;
