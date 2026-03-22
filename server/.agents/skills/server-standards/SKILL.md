---
name: server-standards
description:
  This skill focuses on backend architecture (Controller/Service/Repository), Prisma interaction, and standardized
  error/response middleware. Use it when building or modifying backend routes, controllers, or services.
---

# Server Standards Skill

## 🎯 Purpose

This skill focuses on delivering a robust, scalable, and secure backend using the "Gold Standard" architecture.

## 🏗️ Core Responsibilities

- **Pattern Adherence**: Enforce the Controller-Service-Repository pattern.
- **API Predictability**: Ensure all responses use the `ApiResponse` utility and `asyncHandler`.
- **Database integrity**: Manage Prisma schemas, migrations, and repository-level data access.
- **Security First**: Implement rigorous validation (Zod), auth guards, and rate limiting.

## 🛡️ Backend Gold Standards

- **Security First**:
  - Use `helmet` for security headers.
  - Implement rigorous CORS policies.
  - Validate all inputs using Zod (Schema Validation).
  - Prevent raw Prisma errors from leaking; use `errorMiddleware`.
- **API Design**:
  - Follow RESTful principles (standard HTTP verbs, status codes).
  - Always return the unified `ApiResponse` format.
  - Use `asyncHandler` to keep controllers clean and boilerplate-free.
- **Architecture**:
  - Strict adherence to Controller-Service-Repository pattern.
  - Use `HttpException` for predictive, status-aware error throwing.
  - Ensure all logic lives in Services, keeping Controllers and Repositories thin.
- **Data Processing (Pagination & Filtering)**:
  - ALWAYS implement server-side pagination (offset/cursor), filtering (WHERE clauses), and sorting (ORDER BY) for list
    endpoints.
  - NEVER return raw, unfiltered data dumps for the frontend to format. Validate and sanitize pagination parameters
    (`page`, `limit`) using Zod.
- **API Documentation**:
  - ALWAYS write Swagger JSDoc annotations (`/** @openapi ... */`) above new Routes/Controllers to ensure the
    `/api/docs` endpoint is automatically updated.
- **Industry Standards**:
  - Follow SOLID and DRY principles.
  - Maintain structured logging for observability.
  - Ensure all code is strictly typed with TypeScript.
