---
name: testing-standards
description: This skill enforces robust, scalable testing methodologies for the frontend. Use it when writing component tests or integration tests using Vitest and React Testing Library.
---

# Testing Standards Skill (Frontend)

## 🎯 Purpose

This skill ensures that frontend code is verified through rigorous, maintainable tests using modern tooling.

## 🛠️ Frontend Testing Rules

- **Frameworks**: ALWAYS use **Vitest** for the test runner and **React Testing Library** (`@testing-library/react`) for component testing.
- **Queries**: ALWAYS prioritize **Accessibility Queries** (`getByRole`, `getByLabelText`). Do NOT use fragile selectors like `querySelector('.my-class')` or `getByTestId` unless as a last resort.
- **User Events**: Synthesize interactions using `@testing-library/user-event` rather than `fireEvent`.
- **Mocks**: When testing components, properly mock external dependencies like TanStack Router (navigation) or TanStack Query (data fetching wrappers).

### General Philosophy

- **AAA Pattern**: Structure every test using **Arrange** (setup), **Act** (execution), and **Assert** (verification).
- **Test Isolation**: Tests must run independently without shared state side-effects.
