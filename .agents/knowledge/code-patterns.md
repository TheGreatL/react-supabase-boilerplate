# Code Pattern Guide

This guide defines the standardized development patterns for this boilerplate. Developers and AI agents MUST follow these patterns to maintain consistency, security, and the "Gold Standard" architecture.

---

## 📂 Root Patterns

### Docker Orchestration
- **Primary Tool**: `docker-compose.yml`.
- **Management**: Interaction with Docker should happen via root-level `npm` scripts:
  - `npm run dev`: Starts the whole stack in development mode.
  - `npm run db:migrate`: Syncs schemas to the DB (Kysely).
  - `npm run db:generate`: Generates TypeScript types from the DB (Kysely).
  - `npm run db:seed`: Populates test data.

### Environment Configuration
- **Variables**: Managed via `.env` files.
- **Bootstrapping**: Always provide `.env.example` in each directory.
- **Secrets**: Never commit `.env` files.

### Development Workflow
- **Conventional Commits**: Commit messages must follow the `type(scope): description` pattern (e.g., `feat(auth): add google sign-in`).
- **Git Hooks**: Pre-commit hooks (Husky + lint-staged) automatically run Prettier and ESLint. Do not bypass them.

---

## 🏢 Server Patterns (Node.js + Express)

### Controller-Service-Repository (CSR) Architecture
All features MUST be organized into these three layers:

1. **Controllers (`*.controller.ts`)**
   - **Role**: Entry point. Handles Request/Response logic.
   - **Pattern**: Use the `asyncHandler` wrapper to catch errors.
   - **Constraint**: No direct DB access. Delegates all business logic to Services.
   - **Exports**: Static methods class.

2. **Services (`*.service.ts`)**
   - **Role**: Business logic, DTO mapping, and model transformations.
   - **Pattern**: Handle complex validations and data formatting here.
   - **Constraint**: No direct HTTP/Express knowledge. Delegates data access to Repositories.

3. **Repositories (`*.repository.ts`)**
   - **Role**: Pure data access.
   - **Pattern**: Direct **Kysely** query builder calls using the global `db` client.
   - **Constraint**: No business logic. Simple CRUD operations using `active` filter for soft-deletes.

### Validation & Documentation (Triple-Sync Rule)
All endpoints must adhere to the **Triple-Sync Rule**:
1. **Zod**: Every endpoint must have a Zod schema (`*.schema.ts`) for input validation.
2. **Middleware**: Apply the `validateSchema` middleware to enforce the schema.
3. **Swagger Registration**: Register every schema and path in the `OpenAPIRegistry` (in the schema file) to keep the documentation at `/api/docs` perfectly synchronized.

### Database & RBAC
- **Dynamic RBAC**: Authorization is handled via total permissions. We use `authorize('MODULE', 'PERMISSION')`. Enums for roles are deprecated; we use strings (names) for dynamic role identification in the `Roles` table.
- **Soft Delete**: Use the `active` helper from `@/shared/lib/db-utils` in repository queries.
  - Example: `.where(active)`
- **Type Safety**: Leverage `Selectable<User>`, `Insertable<User>`, and `Updateable<User>` types from the generated `DB` interface.
- **Migrations**: Always use `kysely-ctl` for schema changes.

---

## 🎨 Client Patterns (React + Vite)

### Feature-Based Structure
- **Location**: `src/features/[feature]`.
- **Contents**: Feature-specific components, hooks, and services.
- **Shared**: Common logic goes into `src/shared`.

### Data Management
- **API Client**: Use the custom `fetch`-based `api` utility in `shared/api/api-config.ts`. It handles:
  - **CSRF**: Automatically attaches `X-CSRF-Token`.
  * **Auth**: Automatically attaches Bearer tokens and handles refreshes.
- **TanStack Query**: Used for all server state (GETs and Mutations).
- **Zustand**: Used for global UI/App state (e.g., Auth state, Sidebar open/close).

### Routing
- **TanStack Router**: File-based routing in `src/routes/`.
- **Protected Routes**: Use the `_protected` layout for routes requiring authentication.

### Styling (Tailwind v4)
- **Zero-Pixel Policy**: NEVER use arbitrary pixel values like `p-[5px]`. Use Tailwind tokens or `rem`.
- **Layout**: Every page MUST start with a `<div className="container">` (or equivalent) for consistent spacing.

---

## 🧪 Testing Patterns
- **Unit/Integration**: Vitest. Follow `[name].[unit|integration].test.ts`.
- **E2E**: Playwright. Located in `e2e/tests`.
