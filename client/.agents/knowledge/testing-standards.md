# Frontend Testing Standards: The Gold Standard

This document defines the "Gold Standard" for testing within the client application. Every test MUST adhere to the mirrored feature-based structure and utilize the approved React Testing Library (RTL) patterns to ensure accessibility and reliability.

---

## 🏗️ Mirrored Feature-Based Structure

The `client/tests/` directory strictly mirrors the `client/src/` directory.

### Directory Mapping Standard

| Source Path | Test Path | Verification Scope |
| :--- | :--- | :--- |
| `src/features/[feature]/*` | `tests/[feature]/*` | Domain-specific logic, components, and hooks. |
| `src/shared/ui/*` | `tests/shared/ui/*` | Global primitive components (Atomic UI). |
| `src/shared/utils/*` | `tests/shared/utils/*` | Utility functions and local helpers. |
| `src/shared/api/*` | `tests/shared/api/*` | API client configurations and global interceptors. |

---

## 🎨 Frontend Testing Patterns (Vitest + RTL)

### 1. Accessibility-First Queries
ALWAYS prioritize querying elements by their accessibility roles (`getByRole`, `getByLabelText`). This ensures your tests verify what the user actually sees and interacts with, not implementation details like class names.

```typescript
// tests/shared/ui/button.unit.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/shared/ui/button';

it('renders a button label', () => {
  render(<Button>Click Me</Button>);
  expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
});
```

### 2. Testing Hooks
Use `@testing-library/react-hooks` or the `renderHook` utility from RTL to verify custom hook logic in isolation.

### 3. Mocking Dependencies
Use Vitest's `vi.mock()` to mock out external integrations (like Supabase or standard API calls) when testing components in isolation.

---

## 📜 Best Practices

1. **AAA Pattern**: Structure tests into **Arrange** (set up data/render), **Act** (fire events), and **Assert** (check expected UI state).
2. **Explicit Imports**: Never rely on globals. Always import `describe`, `it`, `expect` from `vitest`.
3. **Prefer `userEvent`**: Use `@testing-library/user-event` over `fireEvent` for more realistic simulation of browser interactions.
4. **Clean State**: Use `cleanup()` (handled automatically by most modern RTL configs) or `beforeEach` to ensure each test starts from a fresh render.
5. **Descriptive Naming**: Test descriptions should complete the sentence "it should...".
   - *Good*: `it('should display an error when email is invalid', ...)`
   - *Bad*: `it('validation fail', ...)`
