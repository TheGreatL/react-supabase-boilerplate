# Project Architecture

## 🚀 Overview

This is a "Gold Standard" monorepo designed as a generic full-stack boilerplate. It leverages a modern, containerized
stack with a focus on type safety, professional architecture, and premium aesthetics.

## 📁 Monorepo Structure

- **`/client`**: React + Vite frontend leveraging TanStack Router, Tailwind v4, and a custom native **Fetch** client.
- **`/server`**: Node.js Express backend using a Controller-Service-Repository pattern and **Kysely** query builder.
- **`migrations`**: SQL/TypeScript migrations for database schema management (managed by `kysely-ctl`).
- **`docker-compose.yml`**: Orchestrates the DB (PostgreSQL), Admin (pgAdmin), API, and Client.

## 🛠️ Tech Stack

- **Database**: PostgreSQL 15
- **Backend**: Express, **Kysely**, JWT, Zod
- **Type Safety**: TypeScript, `kysely-codegen`
- **Frontend**: React, TanStack Router/Query, Zustand, Tailwind CSS v4, Lucide-React
- **Tools**: Docker, pgAdmin, ESLint, Prettier

## 📡 Communication Pattern

- **Base URL**: `http://localhost:3001/api`
- **Response Format**: Managed by the `ApiResponse` utility on the server.
  ```json
  {
    "success": true,
    "message": "...",
    "data": { ... },
    "errors": null,
    "statusCode": 200
  }
  ```
- **Error Handling**: Standardized via global `errorMiddleware` and specialized `HttpException` classes.

## 🧪 Testing Architecture

- **Structure**: All tests follow a feature-based hierarchy: `tests/[feature]/[unit|integration]`.
- **Naming Convention**: Test files MUST follow the `[name].[unit|integration].test.[ts|tsx]` format.
- **Unit & Integration**: Powered by **Vitest**.
  - **Client**: Located in `/client/tests/`, organized by feature and test type.
  - **Server**: Located in `/server/tests/`, organized by feature and test type.
- **End-to-End (E2E)**: Powered by **Playwright**.
  - Located in `/e2e/tests` at the root.
- **Execution**: Unified scripts at the root level (`npm run test`, `npm run test:e2e`).

## 🛡️ Security

- **Authentication**: Dual-token system (Short-lived Access Token in headers + Long-lived Refresh Token in HTTP-only
  cookies).
- **Rate Limiting**: Brute-force protection on authentication routes (e.g., `authAttemptLimiter`).
