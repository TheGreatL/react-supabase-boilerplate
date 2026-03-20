---
name: project-orchestration
description:
  This skill handles high-level project orchestration, Docker management, and ensures cross-project consistency. Use it
  when for tasks related to docker-compose, root-level scripts, or syncing environment variables.
---

# Project Orchestration Skill

## 🎯 Purpose

This skill is designed for high-level project orchestration, Docker management, and ensuring cross-project consistency.
It serves as the "umbrella" skill that understands the relationship between the client and server.

## 🏗️ Core Responsibilities

- **Docker Orchestration**: Manage container lifecycle, volume persistence, and network connectivity between services.
- **Environment Management**: Synchronize `.env` files across root, client, and server.
- **Seeding & Migrations**: Coordinate database schema updates and data initialization.
- **Shared Standards**: Ensure the "Gold Standard" architecture is upheld in both client and server sub-skills.

## 📜 Key References

- [Main Architecture](../../ARCHITECTURE.md)
- [Client Architecture](../../client/ARCHITECTURE.md)
- [Server Architecture](../../server/ARCHITECTURE.md)

## 🛠️ Orchestration Gold Standards

- **Docker Best Practices**:
  - Ensure services are decoupled and isolated.
  - Use Docker Compose for starting the stack: `npm run docker:dev`.
  - Rely on `package.json` scripts to trigger database migrations within the container.
- **Environment Configuration Parity**:
  - Manage the root `.env`, `client/.env`, and `server/.env` files securely.
  - NEVER commit sensitive real values to `.env.example`.
  - ALWAYS ensure that if a new environment variable is added, removed, or modified in any `.env` file, the
    corresponding `.env.example` file MUST be updated simultaneously with the key and a placeholder/dummy value. This
    prevents configuration drift.
- **Workflow Quality**:
  - Before committing or declaring a feature "complete", ensure `npm run lint` and `npm run test` pass in both
    directories.
