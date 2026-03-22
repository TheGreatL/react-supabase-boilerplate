# Server Architecture

## 🏛️ Pattern: Controller-Service-Repository

This project follows a strict separation of concerns to ensure maintainability and testability:

1. **Routes**: Define endpoints and apply middleware (Auth, Rate Limiting, Validation).
2. **Controllers**: Handle HTTP-specific logic, extract input, and call Services.
3. **Services**: Contain the core business logic. They are framework-agnostic.
4. **Repositories**: Interact directly with Prisma for data persistence.

## 🛡️ "Gold Standard" Middleware

- **`errorMiddleware`**: Catches all exceptions and returns standardized `ApiResponse` JSON.
- **`asyncHandler`**: Wraps async controller methods to remove `try/catch` boilerplate.
- **`validateSchema`**: Uses Zod to validate request bodies before they reach the controller.
- **`authMiddleware`**: Verifies JWTs and attaches the authenticated user to the request.

## 💾 Database & Prisma

- **Multi-File Schema**: Schemas are split for organization (e.g., `user.prisma`, `profile.prisma`).
- **Driver Adapters**: Uses `@prisma/adapter-pg` with a connection pool for robust Docker performance.
- **Seeding**: Managed via `prisma/seed.ts` with structured, role-based user data.

## 📡 API Response Structure

Every response MUST use the `ApiResponse` utility to ensure the client receives a predictable structure.

- **Status 2xx**: Success
- **Status 4xx**: Client Error (Validation, Auth, Rate Limit)
- **Status 500**: Unexpected Internal Error

## 📝 Naming Conventions & Typing

To ensure consistency and type safety throughout the project:

1. **Type/Interface Prefixing**: All custom types and interfaces MUST start with a capital `T` followed by an uppercase
   first letter (e.g., `TUser`, `TAuthResponse`).
2. **Strict Typing**: Avoid using the `any` type at all costs. Use descriptive interfaces or `unknown` with type
   guards/assertions if the shape is truly dynamic.
3. **File Naming**: Follow the `lowercase-with-hyphens.purpose.extension` format.

---

## 🎖️ Gold Standard Principles

### 1. Single Source of Truth (Repository Pattern)

Services MUST NOT interact with `prisma` directly. All data access must go through **Repositories**. This ensures a
single source of truth for queries and makes it easier to change the data source (e.g., from Prisma to another ORM)
without affecting business logic.

### 2. Mandatory Pagination

All listing/collection endpoints (`getAll`) MUST return a paginated response using the `ApiResponse.paginated` utility.
This ensures the API is scalable and prevents performance issues as the data grows.

- Default: `page=1`, `limit=10`
- Response includes `meta` with `total`, `totalPages`, `hasNextPage`, and `hasPrevPage`.

## 🧪 Testing Architecture

- **Structure**: All tests follow a feature-based hierarchy: `tests/[feature]/[unit|integration]`.
- **Unit & Integration**: Powered by **Vitest**.
  - **Server**: Located in `/server/tests/`, organized by feature and test type.
- **Execution**: Unified scripts at the root level (`npm run test`, `npm run test:e2e`).

## 🛡️ Security

- **Authentication**: Dual-token system (Short-lived Access Token in headers + Long-lived Refresh Token in HTTP-only
  cookies).
- **Rate Limiting**: Brute-force protection on authentication routes (e.g., `authAttemptLimiter`).
