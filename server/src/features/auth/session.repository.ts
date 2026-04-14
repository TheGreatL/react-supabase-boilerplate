import {db} from '../../shared/database/db';
import {Session, User} from '../../shared/types/db';
import {active} from '../../shared/lib/db-utils';
import {Insertable, Selectable} from 'kysely';

export class SessionRepository {
  async create(data: {userId: string; refreshToken: string; expiresAt: Date}) {
    return await db
      .insertInto('Session')
      .values({
        id: crypto.randomUUID(),
        userId: data.userId,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt,
        lastLogin: new Date(),
        updatedAt: new Date()
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async findByToken(refreshToken: string) {
    const result = await db
      .selectFrom('Session')
      .innerJoin('User', 'User.id', 'Session.userId')
      .selectAll('Session')
      .select([
        'User.id as user_id',
        'User.email as user_email',
        'User.firstName as user_firstName',
        'User.lastName as user_lastName',
        'User.role as user_role',
        'User.avatar as user_avatar',
        'User.createdAt as user_createdAt',
        'User.updatedAt as user_updatedAt',
        'User.deletedAt as user_deletedAt'
      ])
      .where('Session.refreshToken', '=', refreshToken)
      .where('Session.deletedAt', 'is', null)
      .executeTakeFirst();

    if (!result) return null;

    // Map back to nested structure for compatibility
    const {
      user_id,
      user_email,
      user_firstName,
      user_lastName,
      user_role,
      user_avatar,
      user_createdAt,
      user_updatedAt,
      user_deletedAt,
      ...session
    } = result;

    return {
      ...session,
      user: {
        id: user_id,
        email: user_email,
        firstName: user_firstName,
        lastName: user_lastName,
        role: user_role,
        avatar: user_avatar,
        createdAt: user_createdAt,
        updatedAt: user_updatedAt,
        deletedAt: user_deletedAt
      }
    };
  }

  async deleteByToken(refreshToken: string) {
    // Soft delete session
    return await db
      .updateTable('Session')
      .set({deletedAt: new Date()})
      .where('refreshToken', '=', refreshToken)
      .execute();
  }

  async deleteExpired() {
    // Hard delete expired sessions to keep DB clean
    return await db.deleteFrom('Session').where('expiresAt', '<', new Date()).execute();
  }

  async deleteAllUserSessions(userId: string) {
    return await db.updateTable('Session').set({deletedAt: new Date()}).where('userId', '=', userId).execute();
  }
}
