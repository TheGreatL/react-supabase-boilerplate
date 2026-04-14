# Kysely Knowledge Base

This guide covers the specialized Kysely setup used in this project.

## 🛠️ Overview
Instead of a heavyweight ORM, we use **Kysely**, a type-safe SQL query builder for Node.js. It provides absolute control over SQL while maintaining 100% type safety.

## 📁 Key Files
- `src/shared/lib/db.ts`: The global Kysely instance.
- `src/shared/lib/db-utils.ts`: Shared helpers (soft-delete, active filters).
- `src/shared/types/db.ts`: Auto-generated types from the live DB schema.
- `migrations/`: TypeScript migration files.

## 🔄 Workflow

### 1. Schema Changes (Migrations)
We use `kysely-ctl` for migrations.
- **Create**: `npx kysely migrate:make <name>`
- **Apply**: `npm run db:migrate` (Latest)
- **Rollback**: `npx kysely migrate:rollback`

### 2. Type Generation
Every time the schema changes, you MUST update the TypeScript interfaces.
- **Command**: `npm run db:generate`
- **Output**: `src/shared/types/db.ts`

## 🧩 Common Patterns

### Repository Layer
Always inject `db` from `@/shared/lib/db`.

```typescript
import { db } from '@/shared/lib/db';
import { active } from '@/shared/lib/db-utils';
import { Selectable } from 'kysely';
import { User } from '@/shared/types/db';

export class UserRepository {
  async findById(id: string) {
    return await db
      .selectFrom('user')
      .selectAll()
      .where('id', '=', id)
      .where(active) // Soft-delete filter
      .executeTakeFirst();
  }
}
```

### Soft Delete Helper
The `active` filter is a pre-calculated expression:
```typescript
// db-utils.ts
export const active = (eb: any) => eb('deletedAt', 'is', null);
```

### Transaction Management
Use `db.transaction()` for multi-step operations.
```typescript
await db.transaction().execute(async (tx) => {
  await tx.insertInto('user').values(...).execute();
  await tx.insertInto('session').values(...).execute();
});
```

### Complex Joins
```typescript
const sessions = await db
  .selectFrom('session as s')
  .innerJoin('user as u', 'u.id', 's.userId')
  .select([
    's.id',
    's.expiresAt',
    'u.email as userEmail',
    'u.firstName',
  ])
  .where('u.id', '=', userId)
  .execute();
```
