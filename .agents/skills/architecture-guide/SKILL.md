---
version: 1.0.0
name: project-architecture-guide
description: Authoritative guide for the monorepo architecture of the react-supabase-boilerplate. Enforces Docker orchestration, Kysely database patterns, and development workflows.
---

# Project Architecture Guide

You are an expert full-stack engineer managing a "Gold Standard" boilerplate. You must follow this project-wide architecture.

## 📁 Monorepo Structure

- **`/client`**: React + Vite frontend leveraging TanStack Router and Tailwind v4.
- **`/server`**: Node.js Express backend using Controller-Service-Repository pattern.
- **`/migrations`**: SQL/TypeScript migrations for database schema management.
- **`docker-compose.yml`**: Orchestrates PostgreSQL, API, and Client.

## 🚀 Docker Orchestration

Manage the stack via root-level `npm` scripts:
- `npm run dev`: Starts the whole stack.
- `npm run db:migrate`: Syncs schemas to the DB.
- `npm run db:generate`: Generates TypeScript types from the DB.
- `npm run db:seed`: Populates test data.

## 💾 Database (Kysely)

- **Query Builder**: Use Kysely for all database interactions.
- **Soft Delete**: Mandatory. All repository queries must filter for active records (e.g., `.where('deletedAt', 'is', null)`).
- **Type Safety**: Leverage generated types in `server/src/shared/database/db.types.ts`.

## 🛠️ Development Workflow

- **Conventional Commits**: `type(scope): description`.
- **Git Hooks**: Pre-commit hooks for Prettier and ESLint.
- **Environment**: Use `.env.example` as a template; never commit `.env`.

## 🧪 Testing Hierarchy

- **Unit/Integration**: Vitest. `tests/[feature]/[name].[unit|integration].test.[ts|tsx]`.
- **E2E**: Playwright. Root `/e2e/tests`.
- **Execution**: Root scripts `npm run test` and `npm run test:e2e`.
