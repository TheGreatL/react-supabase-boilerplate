# Contributing Guide

A practical reference for adding new features or fixing bugs in this boilerplate.

---

## 🚀 Getting Started

```bash
# From the root directory
docker compose up -d          # Start PostgreSQL + API + Client

# Or run each service standalone
cd server && npm install && npm run dev
cd client && npm install && npm run dev
```

---

## 🏗️ Adding a New Feature (Server)

Every feature follows the **Controller → Service → Repository** pattern. Use the existing `user` feature as the reference implementation.

### 1. Create the feature folder

```
src/features/<feature-name>/
├── <feature>.route.ts       # URL definitions + middleware chain
├── <feature>.controller.ts  # Request/response handling only
├── <feature>.service.ts     # Business logic
├── <feature>.repository.ts  # Kysely queries (only place that imports db)
└── <feature>.schema.ts      # Zod schemas for input validation
```

### 2. Write the repository

```ts
import {db} from '../../shared/database/db';
import {active} from '../../shared/lib/db-utils';
import {Insertable, Updateable, Selectable} from 'kysely';
import {Post} from '../../shared/database/db.types';

export class PostRepository {
  async findById(id: string): Promise<Selectable<Post> | null> {
    return (await db.selectFrom('Post').selectAll()
      .where('id', '=', id).where(active).executeTakeFirst()) || null;
  }
}
```

### 3. Write the service

Throw exceptions — never call `res` directly:

```ts
import {NotFoundException} from '../../shared/exceptions';

export class PostService {
  private postRepository = new PostRepository();

  async getPostById(id: string) {
    const post = await this.postRepository.findById(id);
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }
}
```

### 4. Write the controller

```ts
import {asyncHandler} from '../../shared/utils';
import {ApiResponse} from '../../shared/utils/api-response';

export class PostController {
  static getById = asyncHandler(async (req, res) => {
    const post = await postService.getPostById(req.params.id);
    return ApiResponse.success(res, post);
  });
}
```

### 5. Define the route

```ts
import {authMiddleware, requireRole} from '../../shared/middleware';

route.get('/:id', authMiddleware, PostController.getById);
route.delete('/:id', authMiddleware, requireRole('ADMIN'), PostController.delete);
```

### 6. Mount in `routes.ts`

```ts
routes.use('/posts', postRoute);
```

---

## 🗄️ Adding a Database Table

### 1. Create a migration

```bash
npm run db:make add_posts_table
```

Edit the generated file in `src/shared/database/migrations/`:

```ts
export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable('Post')
    .addColumn('id', 'text', col => col.primaryKey())
    .addColumn('title', 'text', col => col.notNull())
    .addColumn('userId', 'text', col => col.notNull().references('User.id').onDelete('cascade'))
    .addColumn('createdAt', 'timestamp', col => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updatedAt', 'timestamp', col => col.notNull())
    .addColumn('deletedAt', 'timestamp')   // soft delete
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropTable('Post').execute();
}
```

### 2. Apply and regenerate types

```bash
npm run db:migrate    # Apply migration
npm run db:generate   # Regenerate db.types.ts
```

> ⚠️ Always run `db:generate` after a migration — otherwise your TypeScript types are out of sync.

---

## 🧪 Writing Tests

### Unit tests (services)

Use `vi.hoisted()` so the mock is available inside the hoisted `vi.mock()` factory:

```ts
const repoMethods = vi.hoisted(() => ({
  findById: vi.fn(),
  create: vi.fn(),
}));

vi.mock('./post.repository', () => {
  class PostRepository {
    findById = repoMethods.findById;
    create = repoMethods.create;
  }
  return {PostRepository};
});
```

Assert on messages, not `instanceof`, when checking thrown errors:

```ts
// ✅ Works across Vitest module boundaries
await expect(service.getPostById('bad')).rejects.toThrow('Post not found');

// ❌ Unreliable in Vitest isolated modules
await expect(service.getPostById('bad')).rejects.toThrow(NotFoundException);
```

### Integration tests

Use `supertest` against the full app — see `tests/api.integration.test.ts` and `tests/health.integration.test.ts` as references.

Run all tests:

```bash
npm test
```

---

## 🛡️ Using RBAC

`requireRole` must come **after** `authMiddleware` in the middleware chain:

```ts
// Anyone authenticated
route.get('/', authMiddleware, PostController.getAll);

// Admin only
route.delete('/:id', authMiddleware, requireRole('ADMIN'), PostController.delete);

// Admin or User (multiple roles)
route.post('/', authMiddleware, requireRole('ADMIN', 'USER'), PostController.create);
```

---

## 📋 Commit Checklist

Before pushing, make sure:

- [ ] `npm run lint` passes
- [ ] `npm test` passes
- [ ] `db:generate` was run after any migration
- [ ] New routes have `@swagger` JSDoc annotations
- [ ] Repositories only use `db` — services never touch it directly
- [ ] Exceptions are thrown (not `res.status(...)`-d) in services
