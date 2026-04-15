# Testing Guide: The Gold Standard

This document defines the "Gold Standard" for testing within this monorepo. Every test MUST adhere to the mirrored feature-based structure and utilize the approved testing patterns to ensure reliability, scalability, and developer productivity.

---

## 🏗️ Mirrored Feature-Based Structure

The `tests/` directory strictly mirrors the `src/` directory. This organization makes it trivial to locate the verification layer for any given piece of logic.

### Directory Mapping Standard

| Source Path | Test Path | Verification Scope |
| :--- | :--- | :--- |
| `src/features/[feature]/*` | `tests/[feature]/*` | Domain-specific logic, components, and services. |
| `src/shared/ui/*` | `tests/shared/ui/*` | Global primitive components (Atomic UI). |
| `src/shared/utils/*` | `tests/shared/utils/*` | Utility functions and core helpers. |
| `src/shared/api/*` | `tests/shared/api/*` | API client configurations and global interceptors. |

### Classification
- **Unit Tests (`*.unit.test.ts[x]`)**: Focus on a single function, component, or service in isolation. External dependencies are mocked.
- **Integration Tests (`*.integration.test.ts[x]`)**: Focus on the interaction between multiple modules or verifying an API contract end-to-end.

---

## ⚡ Backend Testing Standards (Vitest + Supertest)

### Unit Testing Services
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

### Integration Testing Controllers
Use `supertest` to execute HTTP requests against the Express `app` instance. This validates middleware, route signatures, and response structures.

```typescript
// tests/shared/health.integration.test.ts
import request from 'supertest';
import app from '../../src/app';

describe('Health Check', () => {
  it('should return 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
  });
});
```

---

## 🎨 Frontend Testing Standards (Vitest + RTL)

### Accessibility-First Queries
ALWAYS prioritize querying elements by their accessibility roles (`getByRole`, `getByLabelText`). This ensures your tests verify what the user actually sees and interacts with.

```typescript
// tests/shared/ui/button.unit.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/shared/ui/button';

it('renders a button label', () => {
  render(<Button>Click Me</Button>);
  expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
});
```

---

## 📜 Best Practices

1. **AAA Pattern**: Structure tests into **Arrange** (set up data), **Act** (execute function), and **Assert** (check results).
2. **Explicit Imports**: Never rely on globals. Always import `describe`, `it`, `expect` from `vitest`.
3. **Descriptive Naming**: Test descriptions should complete the sentence "it should...".
   - *Good*: `it('should return 401 when token is missing', ...)`
   - *Bad*: `it('auth fail', ...)`
4. **Clean State**: Ensure each test is independent. Use `beforeEach` to reset mocks or local storage.
