# Server — Backend API

> The brain of the application. Handles data, logic, and security.

---

## 📖 What is this?

This is the **backend server**. It's not something users see directly — it runs in the background and handles things like:
- 🔐 Logging users in and keeping their session secure
- 📦 Storing and fetching data from the database
- 🛡️ Making sure only authorized users can access certain data

---

## 🛠️ Tools & Why We Use Them

| Tool | Purpose |
|---|---|
| **Node.js** | The runtime that lets us run JavaScript on the server |
| **Express** | A lightweight framework for building the API routes |
| **Kysely** | Talks to the database — lets us define tables and query data with full type safety |
| **PostgreSQL** | The actual database where all data is stored |
| **Zod** | Validates incoming data — ensures the server never processes garbage input |
| **JWT (JSON Web Tokens)** | Issues secure login tokens (like a digital ID card) |
| **bcrypt** | Hashes (scrambles) passwords so they're never stored in plain text |
| **Helmet** | Adds security headers to every API response |
| **express-rate-limit** | Prevents brute-force attacks (e.g., limits repeated login attempts) |
| **Swagger UI** | Auto-generates interactive API documentation at `/api/docs` |
| **Morgan** | Logs all incoming requests for debugging |

---

## 🏗️ How it's Organized

The backend follows a strict pattern called **Controller → Service → Repository**:

```
src/
├── features/           # One folder per feature (e.g., auth, users)
│   └── auth/
│       ├── auth.route.ts       # Defines the URL endpoints
│       ├── auth.controller.ts  # Handles the request/response
│       ├── auth.service.ts     # Contains the business logic
│       └── auth.repository.ts  # Talks to the database
└── shared/
    ├── middleware/     # Global reusable middlware (auth guard, error handler)
    ├── utils/          # Helpers (ApiResponse, asyncHandler)
    └── lib/            # Library configs (Kysely client, Swagger, Logger)
```

**The flow of every request:**
```
Browser → Route → Controller → Service → Repository → Database
```

---

## 📋 API Documentation

Once the server is running, visit:
**`http://localhost:3001/api/docs`**

You'll see an interactive page listing all available API endpoints where you can test them directly from the browser.

---

## 💾 Database Commands

| Command | What it does | Run in Docker? |
|---|---|---|
| `npm run db:make <name>` | Creates a new migration file | `docker compose exec api npm run db:make <name>` |
| `npm run db:generate` | Re-generates TypeScript types | `docker compose exec api npm run db:generate` |
| `npm run db:migrate` | Applies schema changes | `docker compose exec api npm run db:migrate` |
| `npm run db:seed` | Fills default test data | `docker compose exec api npm run db:seed` |
| `npm run db:reset` | **⚠️ Wipe database** | `docker compose exec api npm run db:reset` |

> [!IMPORTANT]
> To run these commands from your **host terminal**, ensure your `.env` is set to `localhost:5432`. If you have a local Postgres conflict, use `localhost:5433` instead. If running **via Docker exec**, it uses the internal network automatically.

---

## ▶️ Running Locally (Standalone)

> **Note:** You need a running PostgreSQL database. It's recommended to use Docker from the root directory instead.


```bash
npm install
cp .env.example .env  # fill in your values
npm run dev
```

---

## 🗄️ Kysely Guide

Kysely is a **type-safe SQL query builder** for TypeScript. It replaces ORMs like Prisma — you write real SQL logic, but TypeScript catches your mistakes at compile time.

---

### 📁 Database File Structure

All database-related files live under `src/shared/database/`:

```
src/shared/database/
├── db.ts              # The Kysely client (one shared instance)
├── db.types.ts        # Auto-generated table types (do NOT edit manually)
├── seed.ts            # Seeds the database with default data
└── migrations/
    └── 20260414000000_initial_schema.ts  # Schema migrations (one per change)
```

---

### 🔑 Key Concepts

#### 1. The Database Client (`db.ts`)

A single shared Kysely instance used by every repository:

```ts
import {db} from '../../shared/database/db';
```

Never create a new `Kysely` instance in a repository or service. Always import `db`.

#### 2. Type-Safe Table Types (`db.types.ts`)

This file is **auto-generated** by `kysely-codegen` — never edit it by hand.

It gives you three helper types per table:

| Type | Use case | Example |
|------|----------|---------|
| `Selectable<User>` | Rows returned from a SELECT | `findById` return type |
| `Insertable<User>` | Data passed to an INSERT | `create` parameter type |
| `Updateable<User>` | Data passed to an UPDATE (all fields optional) | `update` parameter type |

```ts
import {Selectable, Insertable, Updateable} from 'kysely';
import {User} from '../../shared/database/db.types';

async findById(id: string): Promise<Selectable<User> | null> { ... }
async create(data: Insertable<User>): Promise<Selectable<User>> { ... }
async update(id: string, data: Updateable<User>): Promise<Selectable<User>> { ... }
```

#### 3. Table Name Constants (`db.ts`)

Use the `TABLES` constant instead of magic strings:

```ts
import {TABLES} from '../../shared/database/db';

db.selectFrom(TABLES.USER)  // ✅ instead of db.selectFrom('User')
```

---

### 📝 Common Query Patterns

#### SELECT — Find one row
```ts
const user = await db
  .selectFrom('User')
  .selectAll()
  .where('id', '=', id)
  .executeTakeFirst();  // returns undefined if not found
```

#### SELECT — Find many rows with pagination
```ts
const users = await db
  .selectFrom('User')
  .selectAll()
  .limit(10)
  .offset(0)
  .execute();
```

#### SELECT — Search with OR conditions
```ts
const users = await db
  .selectFrom('User')
  .selectAll()
  .where((eb) =>
    eb.or([
      eb('email',     'ilike', `%${search}%`),
      eb('firstName', 'ilike', `%${search}%`),
      eb('lastName',  'ilike', `%${search}%`)
    ])
  )
  .execute();
```

#### SELECT — Count rows
```ts
const result = await db
  .selectFrom('User')
  .select(db.fn.count<number>('id').as('count'))
  .executeTakeFirst();

const total = Number(result?.count || 0);
```

#### INSERT — Create and return the new row
```ts
const user = await db
  .insertInto('User')
  .values({
    id: crypto.randomUUID(),
    email: 'user@example.com',
    updatedAt: new Date()
  })
  .returningAll()
  .executeTakeFirstOrThrow();  // throws if insert fails
```

#### UPDATE — Modify and return the updated row
```ts
const user = await db
  .updateTable('User')
  .set({firstName: 'Jane', updatedAt: new Date()})
  .where('id', '=', id)
  .returningAll()
  .executeTakeFirstOrThrow();
```

#### Soft DELETE — Set `deletedAt` instead of removing
```ts
await db
  .updateTable('User')
  .set({deletedAt: new Date()})
  .where('id', '=', id)
  .execute();
```

#### Filtering active (non-deleted) rows

The `active` helper from `shared/lib/db-utils` filters out soft-deleted rows automatically:

```ts
import {active} from '../../shared/lib/db-utils';

// Appends WHERE deletedAt IS NULL to the query
const users = await db.selectFrom('User').selectAll().where(active).execute();
```

---

### 🔧 Migrations

Migrations are stored in `src/shared/database/migrations/`. Each file describes a single schema change with an `up` (apply) and `down` (rollback) function.

#### Creating a new migration

Name the file with a timestamp prefix so migrations run in order:

```
src/shared/database/migrations/
├── 20260414000000_initial_schema.ts   ← existing
└── 20260501000000_add_posts_table.ts  ← your new migration
```

**Migration template:**

```ts
import {type Kysely, sql} from 'kysely';
import {DB} from '../db.types';

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable('Post')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('title', 'text', (col) => col.notNull())
    .addColumn('userId', 'text', (col) =>
      col.notNull().references('User.id').onDelete('cascade')
    )
    .addColumn('createdAt', 'timestamp', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropTable('Post').execute();
}
```

#### Migration workflow

After writing a migration:

```bash
# 1. Apply the migration
npm run db:migrate

# 2. Regenerate TypeScript types to reflect the new schema
npm run db:generate
```

> [!IMPORTANT]
> Always run `db:generate` after a migration. Your TypeScript types will be out of sync with the database until you do.

---

### ♻️ Full Database Reset

Rolls back all migrations, re-applies them, and re-seeds default data:

```bash
npm run db:reset
```

> [!CAUTION]
> This **destroys all data** in the database. Only use in development.

---

### 🏛️ Repository Pattern

Each feature has its own repository that wraps all database access for that model. Repositories are the **only** files that should import `db` directly.

```
src/features/user/user.repository.ts    ← all User queries live here
src/features/auth/session.repository.ts ← all Session queries live here
```

**Never** query `db` directly inside a service or controller — always go through a repository method.
