# CLAUDE.md — Project Standards & AI Guardrails

This file contains the "Gold Standard" rules for this repository. All AI assistants MUST adhere to these patterns.

## 🧪 Testing Standards (CRITICAL)
- **Location**: All tests MUST be placed in the root `tests/` directory of their respective project (`/client/tests` or `/server/tests`).
- **Hierarchy**: Tests must mirror the `src` structure (e.g., `tests/features/[name]` or `tests/shared/`).
- **Naming Convention**: Files MUST use the `[name].[unit|integration].test.[ts|tsx]` format.
    - Example: `auth.integration.test.ts`, `button.unit.test.tsx`.
- **Environment**: Use **Vitest** for all unit/integration tests.

## 🏗️ Architecture & Patterns

### Client (React + Vite)
- **Structure**: Vertical Feature Modules in `src/features/` (logic, components, services).
- **Shared**: Global UI components, utils, and constants in `src/shared/`.
- **API Client**: Native `fetch` API wrapper in `src/shared/api/api-config.ts` (replaces Axios).
- **Routing**: TanStack Router (File-based).
- **State**: Zustand for global stores, TanStack Query for server state.
- **Styling**: Tailwind CSS v4.

### Server (Express + Node.js)
- **Pattern**: Controller-Service-Repository separation.
- **Data**: Prisma ORM (Services MUST NOT call prisma directly; use Repositories).
- **Responses**: Always use the `ApiResponse` utility for standardized JSON.
- **Error Handling**: Use the global `errorMiddleware` and `HttpException` classes.

## 📝 Naming & Typing
- **TypeScript**: Prefix all custom types/interfaces with a capital `T` (e.g., `TUser`, `TAuthResponse`).
- **Files**: Use `lowercase-with-hyphens.purpose.extension` format.
- **Pagination**: All listing endpoints (`getAll`) MUST be paginated using `ApiResponse.paginated`.

## 🛠️ Common Commands
- **Root**: `npm run dev` (Full stack), `npm run test` (All tests).
- **Client**: `npm run dev` in `/client`.
- **Server**: `npm run dev` in `/server`, `prisma generate`, `prisma migrate dev`.

## 🎨 UI Development Standards (NEW)
- **Colors**: Use semantic Tailwind classes (`text-foreground`, `bg-primary`, `border-border`).
- **Layout**: **ALWAYS** use the `container` class for page layouting to ensure consistent centering and padding.
- **Typography**: 
    - **NO** `tracking-*` classes (letter-spacing).
    - **NO** `font-black` class (use `font-bold` or `font-extrabold` instead).
    - **LIMIT** `uppercase` class (reserved for small labels and accents only).
- **Units & Sizing**: 
    - **NEVER** use pixel values (`px`) in components or utilities.
    - **ALWAYS** use `rem` or standard Tailwind utility classes (e.g., `p-4`, `w-25`, `min-w-32`).
    - Standard border radius: `0.1875rem` (3px) or `rounded` token.
- **Hardcoding**: NEVER use static hex, RGB, or custom OKLCH values directly in components.
