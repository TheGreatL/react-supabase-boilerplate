import {Prisma} from '@prisma/client';

/**
 * Gold Standard:
 * Centralizing complex Prisma-derived types in a shared types directory
 * makes them reusable across features (e.g., when a Post repository needs a User with Profile).
 */

export type TUserWithProfile = Prisma.UserGetPayload<{
  include: {profile: true};
}>;

// You can also define custom selects here
export const UserBasicSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true
} as const;

export type TUserBasic = Prisma.UserGetPayload<{
  select: typeof UserBasicSelect;
}>;
