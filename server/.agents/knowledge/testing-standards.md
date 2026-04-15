# Server Testing Standards: The Gold Standard

This document defines the "Gold Standard" for testing within the server application. Every test MUST adhere to the mirrored feature-based structure and utilize the approved testing patterns to ensure reliability and architectural integrity.

---

## 🏗️ Mirrored Feature-Based Structure

The `server/tests/` directory strictly mirrors the `server/src/` directory.

### Directory Mapping Standard

| Source Path | Test Path | Verification Scope |
| :--- | :--- | :--- |
| `src/features/[feature]/*` | `tests/[feature]/*` | Domain-specific logic, controllers, and services. |
| `src/shared/utils/*` | `tests/shared/utils/*` | Utility functions and core backend helpers. |
| `src/shared/services/*` | `tests/shared/services/*` | Cross-cutting services (Mail, Activity, Token). |

---

## ⚡ Backend Testing Patterns (Vitest + Supertest)

### 1. Unit Testing Services
Services should be tested in isolation by mocking their corresponding repositories. We use `vi.hoisted` to ensure mocks are created before any imports occur.

```typescript
// tests/user/user.service.unit.test.ts
import { describe, it, expect, vi } from 'vitest';

const repoMethods = vi.hoisted(() => ({
  findById: vi.fn(),
}));

vi.mock('./user.repository', () => {
  class UserRepository {
    findById = repoMethods.findById;
  }
  return { UserRepository };
});
```

### 2. Integration Testing Controllers
Use `supertest` to execute HTTP requests against the Express `app` instance. This validates the full request lifecycle including middleware, route signatures, and response structures.

```typescript
// tests/shared/health/health.integration.test.ts
import request from 'supertest';
import app from '../../../src/app';

describe('Health Check', () => {
  it('should return 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
  });
});
```

---

## 📜 Best Practices

1. **AAA Pattern**: Structure tests into **Arrange** (set up data), **Act** (execute function), and **Assert** (check results).
2. **Explicit Imports**: Never rely on globals. Always import `describe`, `it`, `expect` from `vitest`.
3. **Mocking Integrity**: Never mock the database directly in a service test; mock the *Repository* layer instead.
4. **Clean State**: Ensure each test is independent. Use `beforeEach` to reset mocks or clean up test databases if applicable.
5. **Naming Convention**: Test descriptions should complete the sentence "it should...".
   - *Good*: `it('should return 401 when token is missing', ...)`
   - *Bad*: `it('auth fail', ...)`
