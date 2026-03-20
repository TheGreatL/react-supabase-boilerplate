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
