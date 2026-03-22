---
name: feature-development
description:
  This is the MASTER ORCHESTRATOR skill. Use this skill whenever building a new "feature", "module", "API endpoint", or
  "full-stack page". It strictly enforces a 5-step process that guarantees all code aligns with the project's Gold
  Standards.
---

# Feature Development Orchestrator Skill

## 🎯 Purpose

This skill ensures that whenever a new feature is requested, it is built systematically, securely, and uniformly. It
acts as a project manager, reading all local standards before writing a single line of code.

## 🔄 The 5-Step Orchestration Process

Whenever tasked with building a feature, you MUST execute these steps in order. Do not skip ahead.

### Pre-Requisite

Before writing any code, READ `.agents/skills/architecture-standards/SKILL.md` to ensure all new files and directories
follow the strict lowercase, hyphenated, and feature-based (`[domain].[purpose].[ext]`) conventions.

### Step 1: Database & Migrations (Prisma)

1. Read `.agents/skills/database-standards/SKILL.md` to understand the Gold Standard for models (camelCase fields,
   PascalCase models, precise map directives, and mandatory audit fields).
2. Navigate to `server/prisma/schema/`.
3. Determine if a new schema file (`[domain].prisma`) is needed or if an existing one should be modified.
4. Validate the relationships (1:1, 1:N).
5. Run migrations using `npm run db:migrate` in the server directory (or Docker equivalent).

### Step 2: Backend Architecture (The "Gold Standard")

1. Read `.agents/skills/server-standards/SKILL.md` and `.agents/skills/security-standards/SKILL.md`.
2. Create the exact flow: `Route -> Controller -> Service -> Repository`.
3. Use Zod in the Route for validation (`validateSchema` middleware), specifically for pagination and filter parameters
   (`?page=1&limit=10`).
4. Ensure the Controller extracts data and passes it to the Service, wrapping the function in `asyncHandler`.
5. Ensure the Service throws predictable `HttpException`s on logic failure.
6. Ensure the Controller returns the precise `ApiResponse.success` wrapper.
7. Ensure the Repository handles all Prisma queries securely, including pagination (`skip`, `take`) and filtering
   (`where`).
8. Add Swagger JSDoc annotations (`/** @openapi ... */`) above the Route/Controller for automatic documentation.

### Step 3: API Integration

1. Define the Axios fetch/post functions in `client/src/shared/api/services/*`.
2. Ensure they point to the correct routes and handle the expected `ApiResponse<{data}>` structural unwrapping.

### Step 4: Frontend Implementation (Premium UI)

1. Read `.agents/skills/client-standards/SKILL.md` and `.agents/skills/library-utilization/SKILL.md`.
2. Define the exact TanStack routes (`src/routes`), ensuring URL Search Parameters define current state for tables/lists
   (page, sort, filters).
3. Build Data Fetching hooks using `@tanstack/react-query`, passing the Search Params.
4. Build forms strictly using `react-hook-form` + `@hookform/resolvers/zod`.
5. Design the UI using existing Tailwind v4 aesthetics, Radix UI primitives, `lucide-react` icons, and `sonner` toasts.
6. Use `pendingComponent` for loading states to eliminate UI jank.

### Step 5: Testing & Verification

1. Read `.agents/skills/testing-standards/SKILL.md`.
2. **Backend Tests**: Create new test files in `server/tests/[feature]/unit/[domain].test.ts` and
   `server/tests/[feature]/integration/[domain].test.ts` using Supertest/Mocks (explicitly importing `describe`, `it`,
   `expect` from `vitest`) to verify the new endpoint's success and error paths.
3. **Frontend Tests**: Create new component tests in `client/tests/[feature]/unit/[domain].test.tsx` (explicitly
   importing `describe`, `it`, `expect` from `vitest`) to verify key user interaction and UI state.
4. **E2E Tests**: (Optional for small features) Update or add an E2E spec in `tests-e2e/` for critical flows.
5. **Run Verification**: Ensure all tests pass by running `npm run test` from the project root.

## 📜 Enforcement Rule

If at any point during feature development you encounter a conflict or uncertainty, refer back to the project's Core
Skills. NEVER introduce a new native feature if an established library or pattern exists in the instructions.
