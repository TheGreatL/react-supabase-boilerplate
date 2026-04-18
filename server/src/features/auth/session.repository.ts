import {db} from '../../shared/database/db';
import {Sessions, Users} from '../../shared/database/db.types';
import {Insertable, Selectable, Updateable} from 'kysely';

export class SessionRepository {
  async create(data: Insertable<Sessions>): Promise<Selectable<Sessions>> {
    return await db
      .insertInto('Sessions')
      .values({
        ...data,
        id: data.id || crypto.randomUUID(),
        lastLogin: new Date(),
        updatedAt: new Date()
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async findByToken(refreshToken: string): Promise<(Selectable<Sessions> & {user: Selectable<Users>}) | null> {
    const result = await db
      .selectFrom('Sessions')
      .innerJoin('Users', 'Users.id', 'Sessions.userId')
      .selectAll('Sessions')
      .select([
        'Users.id as user_id',
        'Users.email as user_email',
        'Users.firstName as user_firstName',
        'Users.lastName as user_lastName',
        'Users.profilePhoto as user_profilePhoto',
        'Users.createdAt as user_createdAt',
        'Users.updatedAt as user_updatedAt',
        'Users.deletedAt as user_deletedAt'
      ])
      .where('Sessions.refreshToken', '=', refreshToken)
      .where('Sessions.deletedAt', 'is', null)
      .executeTakeFirst();

    if (!result) return null;

    // Map back to nested structure for compatibility
    const {
      user_id,
      user_email,
      user_firstName,
      user_lastName,
      user_profilePhoto,
      user_createdAt,
      user_updatedAt,
      user_deletedAt,
      ...session
    } = result;

    return {
      ...(session as Selectable<Sessions>),
      user: {
        id: user_id,
        email: user_email,
        firstName: user_firstName,
        lastName: user_lastName,
        profilePhoto: user_profilePhoto,
        createdAt: user_createdAt,
        updatedAt: user_updatedAt,
        deletedAt: user_deletedAt
      } as Selectable<Users>
    };
  }

  async deleteByToken(refreshToken: string) {
    // Soft delete session
    return await db
      .updateTable('Sessions')
      .set({deletedAt: new Date()})
      .where('refreshToken', '=', refreshToken)
      .execute();
  }

  async deleteExpired() {
    // Hard delete expired sessions to keep DB clean
    return await db.deleteFrom('Sessions').where('expiresAt', '<', new Date()).execute();
  }

  async deleteAllUserSessions(userId: string) {
    return await db.updateTable('Sessions').set({deletedAt: new Date()}).where('userId', '=', userId).execute();
  }

  async update(id: string, data: Updateable<Sessions>): Promise<Selectable<Sessions>> {
    return await db
      .updateTable('Sessions')
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirstOrThrow();
  }
}
