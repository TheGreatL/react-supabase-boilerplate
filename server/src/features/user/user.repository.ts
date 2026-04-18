import {db} from '../../shared/database/db';
import {Users} from '../../shared/database/db.types';
import {active} from '../../shared/lib/db-utils';
import {Insertable, Updateable, Selectable} from 'kysely';

export class UserRepository {
  async findById(id: string): Promise<Selectable<Users> | null> {
    return (await db.selectFrom('Users').selectAll().where('id', '=', id).where(active).executeTakeFirst()) || null;
  }

  async findByEmail(email: string): Promise<Selectable<Users> | null> {
    return (
      (await db.selectFrom('Users').selectAll().where('email', '=', email).where(active).executeTakeFirst()) || null
    );
  }

  async findAll(skip: number, limit: number, search?: string): Promise<Selectable<Users>[]> {
    let query = db.selectFrom('Users').selectAll().where(active).offset(skip).limit(limit);

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
    let query = db.selectFrom('Users').select(db.fn.count<number>('id').as('count')).where(active);

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

  async create(data: Insertable<Users>): Promise<Selectable<Users>> {
    return await db
      .insertInto('Users')
      .values({
        ...data,
        updatedAt: new Date()
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async update(id: string, data: Updateable<Users>): Promise<Selectable<Users>> {
    return await db
      .updateTable('Users')
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirstOrThrow();
  }
}
