---
name: architecture-standards
description:
  This skill enforces the strict directory structure and file naming conventions of the project. Use this whenever an
  agent is creating new files or folders to ensure consistency across the client and server.
---

# Architecture & Naming Standards Skill

## 🎯 Purpose

This skill ensures that the codebase remains clean, predictable, and scalable by strictly enforcing a feature-based
folder structure and uniform, lowercase file naming conventions.

## 🏗️ Core Responsibilities

- **Preserve Feature Isolation**: Ensure domains of logic (e.g., Auth, Orders, Products) remain self-contained.
- **Enforce Naming Rules**: Maintain a strict `lowercase-with-hyphens.purpose.extension` format for all files across the
  stack to prevent casing issues across different operating systems.

## 📜 Key References

- [Client Architecture](../../client/ARCHITECTURE.md)
- [Server Architecture](../../server/ARCHITECTURE.md)

## 🛠️ Architecture Rules

### 1. Directory Structure (Feature-Based)

- **Feature Modules**: Both the `client` and `server` strictly follow a Feature-Based architecture.
  - ALWAYS place new domain logic inside `src/features/[feature-name]/`.
  - Do NOT dump domain-specific logic into global `src/components/`, `src/utils/`, or `src/controllers/` folders.
  - A feature folder should contain its own specific routing, state, components, or controller/service/repository logic.
- **Shared Utilities**: ONLY use `src/shared/` for code that is truly agnostic and used across _multiple_ features
  (e.g., global error handlers, UI primitives, generic API configuration).
- **Testing Structure**: All tests MUST be located in the `tests/` directory of the `client` or `server`, following the
  `tests/[feature]/[unit|integration]` pattern.

### 2. File Naming Conventions

- **Strict Lowercase**: ALL file and directory names MUST be entirely lowercase. (e.g., `userComponent.tsx` is
  forbidden; use `user-component.tsx`).
- **No Spaces or Underscores**: If a filename contains multiple words, use a hyphen `-` separator (e.g.,
  `user-profile`).

#### Backend Files (Node/Express)

- Use standard dot-notation to explicitly state the file's purpose: `[feature/domain].[purpose].ts`.
- **Examples**:
  - `auth.controller.ts`
  - `auth.service.ts`
  - `auth.repository.ts`
  - `auth.route.ts`
  - `error.middleware.ts`

#### Frontend Files (React/Vite)

- **Logic / Hooks / Utils**: Follow the same dot-notation: `[domain].[purpose].ts` (e.g., `auth.store.ts`,
  `use-debounce.hook.ts`, `data-table.util.ts`).
- **React Components**: Use hyphenated `.tsx` or `.ts` files, generally ending with the element type if ambiguous. The
  purpose notation is optional here if the feature folder implies the component type.
- **Examples**:
  - `login-form.tsx`
  - `profile-card.tsx`
  - `dashboard.page.tsx` (if representing a full route layout)

#### 4. Naming Conventions for Types & Interfaces

- **T-Prefix Rule**: ALL types and interfaces MUST start with a capital `T` followed by an uppercase first letter.
  - **Correct**: `TJWTPayload`, `TAuthResponse`
  - **Incorrect**: `JWTPayload`, `AuthResponse`

#### 5. Strict Typing

- **No `any`**: The use of `any` is strictly forbidden.
  - Use specific interfaces, types, or `Record<string, unknown>`.
  - If a type is truly unknown, use `unknown` and perform type checking before access.
