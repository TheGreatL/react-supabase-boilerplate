# Code Pattern Guide

This guide defines the standardized development patterns for this boilerplate. Developers and AI agents MUST follow these patterns to maintain consistency, security, and the "Gold Standard" architecture.

---

## 📂 Root Patterns

### Docker Orchestration
- **Primary Tool**: `docker-compose.yml`.
- **Management**: Interaction with Docker should happen via root-level `npm` scripts:
  - `npm run dev`: Starts the whole stack in development mode.
  - `npm run db:migrate`: Syncs schemas to the DB.
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
   - **Pattern**: Direct `PrismaClient` calls.
   - **Constraint**: No business logic. Simple CRUD operations.

### Validation & Documentation
- **Zod**: Every endpoint must have a Zod schema (`*.schema.ts`) for input validation.
- **OpenAPI**: Routes must be decorated with `@swagger` JSDoc comments.
- **Registration**: Register every Zod schema in the `OpenAPIRegistry` for accurate documentation.

### Database (Prisma)
- **Soft Delete**: The `prisma` client is extended to handle `deletedAt` automatically. Use `includeDeleted: true` in queries if you need to bypass it.
- **Migrations**: Always use `prisma migrate dev` for schema changes.

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
- **Typography**: 
  - NO `tracking-*` or `font-black`.
  - LIMIT `uppercase`.

---

## 🧪 Testing Patterns
- **Unit/Integration**: Vitest. Follow `[name].[unit|integration].test.ts`.
- **E2E**: Playwright. Located in `e2e/tests`.
