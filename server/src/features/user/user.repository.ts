import {db} from '../../shared/database/db';
import {User} from '../../shared/database/db.types';
import {active} from '../../shared/lib/db-utils';
import {Insertable, Updateable, Selectable} from 'kysely';

export class UserRepository {
  async findById(id: string): Promise<Selectable<User> | null> {
    return (await db.selectFrom('User').selectAll().where('id', '=', id).where(active).executeTakeFirst()) || null;
  }

  async findByEmail(email: string): Promise<Selectable<User> | null> {
    return (
      (await db.selectFrom('User').selectAll().where('email', '=', email).where(active).executeTakeFirst()) || null
    );
  }

  async findAll(skip?: number, take?: number, search?: string): Promise<Selectable<User>[]> {
    let query = db.selectFrom('User').selectAll().where(active);

    if (search) {
      const searchTerm = `%${search}%`;
      query = query.where((eb) =>
        eb.or([
          eb('email', 'ilike', searchTerm),
          eb('firstName', 'ilike', searchTerm),
          eb('lastName', 'ilike', searchTerm)
        ])
      );
    }

    if (skip !== undefined) query = query.offset(skip);
    if (take !== undefined) query = query.limit(take);

    return await query.execute();
  }

  async count(search?: string): Promise<number> {
    let query = db.selectFrom('User').select(db.fn.count<number>('id').as('count')).where(active);

    if (search) {
      const searchTerm = `%${search}%`;
      query = query.where((eb) =>
        eb.or([
          eb('email', 'ilike', searchTerm),
          eb('firstName', 'ilike', searchTerm),
          eb('lastName', 'ilike', searchTerm)
        ])
      );
    }

    const result = await query.executeTakeFirst();
    return Number(result?.count || 0);
  }

  async update(id: string, data: Updateable<User>): Promise<Selectable<User>> {
    const result = await db
      .updateTable('User')
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirstOrThrow();

    return result;
  }

  async create(data: Insertable<User>): Promise<Selectable<User>> {
    const result = await db
      .insertInto('User')
      .values({
        ...data,
        updatedAt: new Date()
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return result;
  }
}
