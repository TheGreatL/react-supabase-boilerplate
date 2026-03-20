import 'dotenv/config';
import {Pool} from 'pg';
import bcrypt from 'bcrypt';
import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaClient, Role} from '@prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({connectionString});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({adapter});

async function main() {
  console.log('🌱 Starting seeding...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 2. Create Admin
  const admin = await prisma.user.upsert({
    where: {email: 'admin@example.com'},
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Admin',
      role: Role.ADMIN
    }
  });
  console.log('✅ Admin created:', admin.email);

  // 4. Create standard Users
  const user = await prisma.user.upsert({
    where: {email: 'user@example.com'},
    update: {},
    create: {
      email: 'user@example.com',
      password: hashedPassword,
      firstName: 'Jane',
      lastName: 'User',
      role: Role.USER
    }
  });
  console.log('✅ Standard User created:', user.email);

  console.log('✨ Seeding finished successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
