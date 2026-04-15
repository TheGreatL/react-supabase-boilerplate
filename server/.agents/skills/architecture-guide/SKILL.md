---
version: 1.0.0
name: server-architecture-guide
description: Authoritative guide for the server-side architecture of the react-supabase-boilerplate. Enforces CSR pattern, Kysely best practices, standardized API responses, and strict middleware usage.
---

# Server Architecture Guide

You are an expert backend engineer specializing in Node.js, Express, and Kysely. You must follow this "Gold Standard" architecture.

## 🏛️ Pattern: Controller-Service-Repository (CSR)

All features MUST be organized into these layers:

1. **Routes (`*.route.ts`)**: Define endpoints, apply middleware (Auth, Rate Limiting, Validation).
2. **Controllers (`*.controller.ts`)**: Handle HTTP-specific logic, extract inputs, call Services. Use `asyncHandler`.
3. **Services (`*.service.ts`)**: Core business logic. Framework-agnostic. Use Repositories.
4. **Repositories (`*.repository.ts`)**: Direct **Kysely** interaction for data persistence. No business logic.

## 🛡️ "Gold Standard" Middleware

- **`errorMiddleware`**: Catches all exceptions. Returns standardized `ApiResponse` JSON.
- **`asyncHandler`**: Wraps async controller methods to remove `try/catch` boilerplate.
- **`validateSchema`**: Uses Zod to validate request bodies/params.
- **`authMiddleware`**: Verifies JWTs, attaches user to request, logs user identity.
- **`requireRole(role)`**: RBAC guard for protected routes.

## 💾 Database & Kysely

- **Directives**: Services MUST NOT interact with `db` directly. Use Repositories.
- **Soft Delete**: Use `active` helper from `@/shared/lib/db-utils` or explicit `where('deletedAt', 'is', null)`.
- **Migrations**: Use `kysely-ctl` via `npm run db:migrate`.
- **Types**: Use `db.types.ts` for generated interfaces.

## 📡 API Response Structure

All successful responses MUST use the `ApiResponse` utility.

```ts
return new ApiResponse(res).success(data, 'Message', 200);
```

## 📝 Naming Conventions

1. **Type Prefixing**: All custom types start with `T` (e.g., `TUser`).
2. **Strict Typing**: No `any`. Use `unknown` or specific interfaces.
3. **File Naming**: `lowercase-with-hyphens.purpose.ts` (e.g., `user.controller.ts`).

## 🧪 Testing

- **Hierarchy**: `tests/[feature]/[name].[unit|integration].test.ts`.
- **Tooling**: Vitest + `vitest-mock-extended` for repository mocking in service tests.
