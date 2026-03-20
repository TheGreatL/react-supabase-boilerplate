# Project Architecture

## 🚀 Overview

This is a "Gold Standard" monorepo designed as a generic full-stack boilerplate. It leverages a modern, containerized
stack with a focus on type safety, professional architecture, and premium aesthetics.

## 📁 Monorepo Structure

- **`/client`**: React + Vite frontend leveraging TanStack Router and Tailwind v4.
- **`/server`**: Node.js Express backend using a Controller-Service-Repository pattern and Prisma ORM.
- **`/prisma`**: Shared database schemas (managed within the server directory but accessible via root scripts).
- **`docker-compose.yml`**: Orchestrates the DB (PostgreSQL), Admin (pgAdmin), API, and Client.

## 🛠️ Tech Stack

- **Database**: PostgreSQL 15
- **Backend**: Express, Prisma, JWT, Zod
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

## 🛡️ Security

- **Authentication**: Dual-token system (Short-lived Access Token in headers + Long-lived Refresh Token in HTTP-only
  cookies).
- **Rate Limiting**: Brute-force protection on authentication routes (e.g., `authAttemptLimiter`).
