import {db} from '../../shared/database/db';
import {TUser} from '../../shared/database/db.types';
import {active} from '../../shared/lib/db-utils';
import {Insertable, Updateable, Selectable} from 'kysely';

export class UserRepository {
  async findById(id: string): Promise<Selectable<TUser> | null> {
    return (await db.selectFrom('User').selectAll().where('id', '=', id).where(active).executeTakeFirst()) || null;
  }

  async findByEmail(email: string): Promise<Selectable<TUser> | null> {
    return (
      (await db.selectFrom('User').selectAll().where('email', '=', email).where(active).executeTakeFirst()) || null
    );
  }

  async findAll(skip: number, limit: number, search?: string): Promise<Selectable<TUser>[]> {
    let query = db.selectFrom('User').selectAll().where(active).offset(skip).limit(limit);

    if (search) {
      query = query.where((eb) =>
        eb.or([
          eb('firstName', 'ilike', `%${search}%`),
          eb('lastName', 'ilike', `%${search}%`),
          eb('email', 'ilike', `%${search}%`)
        ])
      );
    }

    return await query.execute();
  }

  async count(search?: string): Promise<number> {
    let query = db.selectFrom('User').select(db.fn.count<number>('id').as('count')).where(active);

    if (search) {
      query = query.where((eb) =>
        eb.or([
          eb('firstName', 'ilike', `%${search}%`),
          eb('lastName', 'ilike', `%${search}%`),
          eb('email', 'ilike', `%${search}%`)
        ])
      );
    }

    const result = await query.executeTakeFirst();
    return Number(result?.count) || 0;
  }

  async create(data: Insertable<TUser>): Promise<Selectable<TUser>> {
    return await db
      .insertInto('User')
      .values({
        ...data,
        updatedAt: new Date()
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async update(id: string, data: Updateable<TUser>): Promise<Selectable<TUser>> {
    return await db
      .updateTable('User')
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirstOrThrow();
  }
}
