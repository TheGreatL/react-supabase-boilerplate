---
name: testing-standards
description:
  This skill enforces robust, scalable testing methodologies for both the frontend and backend. Use it when writing unit
  or integration tests, setting up testing frameworks like Vitest, or verifying that features conform to the "Gold
  Standard".
---

# Testing Standards Skill

## 🎯 Purpose

This skill ensures that code is verified through rigorous, maintainable tests. It enforces the use of modern testing
tools and methodologies to prevent regressions and validate behavior without writing fragile, implementation-coupled
tests.

## 🏗️ Core Responsibilities

- **Frontend Testing**: Focus on user interactions and accessibility roles, not implementation details or fragile HTML
  selectors.
- **Backend Testing**: Focus on API contracts, middleware validation, and database abstraction.
- **Test Isolation**: Ensure tests run independently and reliably without side-effects or database pollution.

## 📜 Key References

- [Client Architecture](../../client/ARCHITECTURE.md)
- [Server Architecture](../../server/ARCHITECTURE.md)

## 🛠️ Testing Rules

### Frontend Testing (React / Vite)

- **Frameworks**: ALWAYS use **Vitest** for the test runner and **React Testing Library** (`@testing-library/react`) for
  component testing.
- **Queries**: ALWAYS prioritize **Accessibility Queries** (`getByRole`, `getByLabelText`). Do NOT use fragile selectors
  like `querySelector('.my-class')` or `getByTestId` unless absolutely necessary as a last resort.
- **User Events**: Synthesize interactions using `@testing-library/user-event` rather than `fireEvent` to accurately
  simulate real user behavior.
- **Mocks**: When testing components, properly mock external dependencies like `TanStack Router` (navigation) or
  `TanStack Query` (data fetching wrappers) so tests remain fast and isolated.

### Backend Testing (Node / Express)

- **Frameworks**: Use **Vitest** (or `Jest`) alongside **Supertest** to execute HTTP requests against the Express app
  without starting the actual server.
- **Controller/Route Testing**: Validate that the REST API responds with the correct HTTP status codes and the strict
  `ApiResponse` JSON structure. Check that Zod validation middleware intercepts bad requests (`400 Bad Request`).
- **Database (Prisma) Strategy**: Never hit a production or shared development database.
  - _Option A (Preferred for Unit Tests)_: Mock Prisma using `vitest-mock-extended` to test Service logic without IO.
  - _Option B (Preferred for E2E Tests)_: Spin up a fresh, isolated test database inside Docker, run migrations, seed
    minimal data, and wipe it down after tests run.

### General Philosophy

- **Test-Driven Design (TDD)**: Write tests for edge cases and core logic paths (e.g., authentication, role-based access
  control, billing) _before_ finalizing the implementation.
- **AAA Pattern**: Structure every test clearly using **Arrange** (setup), **Act** (execution), and **Assert**
  (verification).
