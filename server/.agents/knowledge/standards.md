# Backend Development Standards (Server)

This guide defines the authoritative patterns for the server-side architecture of this boilerplate. All agents working within the `/server` directory MUST follow these rules.

---

## 🏗️ Controller-Service-Repository (CSR)
We enforce a strict separation of concerns:

1. **Controllers (`*.controller.ts`)**
   - Use `asyncHandler`.
   - ONLY handle HTTP-related tasks (headers, status codes, response wrapping).
   - Use `ApiResponse` for all successful and error responses.

2. **Services (`*.service.ts`)**
   - Pure business logic.
   - Mapping database models to DTOs.
   - Handling specialized validations.

3. **Repositories (`*.repository.ts`)**
   - Direct Prisma access.
   - NO business logic.
   - Clean, performant queries.

---

## 🛡️ Security & Validation
- **Zod**: Use `*.schema.ts` for all route input validation.
- **CSRF**: Ensure `csrfMiddleware` is active on all state-changing routes.
- **Auth**: Authenticated routes must use `authMiddleware` and `requireRole` where applicable.

---

## 📡 Documentation
- Every route file MUST include JSDoc `@swagger` definitions.
- All request/response schemas must be registered in the `OpenAPIRegistry`.

---

## 🗄️ Database (Prisma)
- **Soft Delete**: All relevant models use a global `deletedAt` filter. 
- Use `includeDeleted: true` ONLY when explicitly requested (e.g., admin recovery).
