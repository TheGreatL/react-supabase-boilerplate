# Project Architecture

This document provides a high-level overview of the project's architecture. For the **authoritative, machine-readable
source of truth** used by AI agents, please refer to the internal knowledge base.

> [!TIP] **Authoritative Sources of Truth (for Agents):**
>
> - **Global**:
>   [.agents/knowledge/architecture.md](file:///c:/Users/hp15s/Desktop/Boiler-Plates/react-supabase-boilerplate/.agents/knowledge/architecture.md)
> - **Server Local**:
>   [server/.agents/knowledge/standards.md](file:///c:/Users/hp15s/Desktop/Boiler-Plates/react-supabase-boilerplate/server/.agents/knowledge/standards.md)
> - **Client Local**:
>   [client/.agents/knowledge/standards.md](file:///c:/Users/hp15s/Desktop/Boiler-Plates/react-supabase-boilerplate/client/.agents/knowledge/standards.md)

---

## 🧪 Quality & Verification

We maintain a high bar for stability through a multi-layered testing strategy that strictly mirrors the source directory
structure.

- **Mirrored Test Structure**: All tests are located in a `tests/` directory at the project root that replicates the
  `src/` feature structure.
- **Backend Verification**: Unit tests for services and integration tests for API contract validation.
- **Frontend Verification**: Accessibility-driven component tests using Vitest and React Testing Library.
- **End-to-End**: Critical user journeys verified via Playwright.

For the full specification of testing patterns, see the
[Testing Guide](file:///c:/Users/hp15s/Desktop/Boiler-Plates/react-supabase-boilerplate/TESTING.md).

---

## 🏗️ High-Level Design

This boilerplate follows a **"Gold Standard"** monorepo structure designed for production-scale React and Node.js
applications.

### Key Pillars:

- **Scalability**: Feature-based modularity in both client and server.
- **Type Safety**: End-to-end TypeScript with Zod validation.
- **DevOps**: Fully containerized local development with Docker.
- **UX**: Premium, high-fidelity UI standards enforced at the primitive level.

### Infrastructure:

- **Monorepo Management**: Root `package.json` scripts for cross-project orchestration.
- **Database**: PostgreSQL with Kysely Query Builder and built-in Soft Delete support.
- **CI/CD**: Pre-configured GitHub Actions for linting, testing, and builds.

For more detailed technical specs, see the
[Monorepo Documentation](file:///c:/Users/hp15s/Desktop/Boiler-Plates/react-supabase-boilerplate/.agents/knowledge/architecture.md).
