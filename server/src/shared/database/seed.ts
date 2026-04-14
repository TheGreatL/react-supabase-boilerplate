import {Kysely, PostgresDialect} from 'kysely';
import {Pool} from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import {DB} from './db.types';

dotenv.config();

async function seed() {
  const db = new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: process.env.DATABASE_URL
      })
    })
  });

  try {
    console.log('🌱 Starting database seeding...');

    // 1. Clear existing users (optional, but good for a clean seed)
    // await db.deleteFrom('User').execute();

    // 2. Prepare seed data
    const password = await bcrypt.hash('password123', 10);

    const now = new Date();

    const users = [
      {
        id: crypto.randomUUID(),
        email: 'admin@example.com',
        password,
        firstName: 'System',
        lastName: 'Admin',
        role: 'ADMIN' as const,
        updatedAt: now
      },
      {
        id: crypto.randomUUID(),
        email: 'user@example.com',
        password,
        firstName: 'Test',
        lastName: 'User',
        role: 'USER' as const,
        updatedAt: now
      }
    ];

    for (const user of users) {
      // Use upsert-like logic: insert if email doesn't exist
      const existing = await db.selectFrom('User').where('email', '=', user.email).executeTakeFirst();

      if (!existing) {
        await db.insertInto('User').values(user).execute();
        console.log(`✅ Created user: ${user.email} (${user.role})`);
      } else {
        console.log(`⏩ User already exists: ${user.email}`);
      }
    }

    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:');
    console.error(error);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

seed();
