import { User } from './db';
import { Selectable } from 'kysely';

/**
 * Gold Standard:
 * Centralizing complex types in a shared types directory.
 */

// TUserWithProfile is removed as Profile model is not yet implemented

export type TUserBasic = Pick<Selectable<User>, 'id' | 'email' | 'firstName' | 'lastName' | 'role'>;
