---
name: testing-standards
description:
  This skill enforces robust testing methodologies for the backend. Use it when writing unit or integration tests using
  Vitest and Supertest.
---

# Testing Standards Skill (Server)

## 🎯 Purpose

This skill ensures that backend code is verified through rigorous, maintainable tests.

## 🛠️ Backend Testing Rules

- **Frameworks**: Use **Vitest** alongside **Supertest** to execute HTTP requests against the Express app without
  starting the actual server.
- **API Testing**: Validate that REST API endpoints respond with the correct HTTP status codes and the strict
  `ApiResponse` JSON structure.
- **Zod Validation**: Ensure validation middleware correctly intercepts bad requests with a `400 Bad Request` status.
- **Database (Prisma) Strategy**: NEVER hit a production or shared development database.
  - _Option A (Preferred for Unit Tests)_: Mock Prisma using `vitest-mock-extended` to test Service logic without IO.
  - _Option B (Preferred for E2E Tests)_: Spin up a fresh, isolated test database via Docker, run migrations, seed
    minimal data, and tear it down after.
- **Test Isolation**: Tests must run independently without polluting shared state.

### General Philosophy

- **AAA Pattern**: Structure every test using **Arrange**, **Act**, and **Assert**.
