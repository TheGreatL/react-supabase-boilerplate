---
name: architecture-standards
description:
  This skill enforces the strict directory structure and file naming conventions of the server project. Use this
  whenever an agent is creating new files or folders to ensure consistency.
---

# Architecture & Naming Standards Skill (Server)

## 🎯 Purpose

This skill ensures that the server codebase remains clean, predictable, and scalable by strictly enforcing a
feature-based folder structure and uniform, lowercase file naming conventions.

## 🛠️ Architecture Rules

### 1. Directory Structure (Feature-Based)

- ALWAYS place new domain logic inside `src/features/[feature-name]/`.
- Do NOT dump domain-specific logic into global folders.
- **Shared Utilities**: ONLY use `src/shared/` for truly agnostic cross-feature utilities (e.g., `errorMiddleware`,
  `ApiResponse`, generic config).

### 2. File Naming Conventions

- **Strict Lowercase**: ALL file and directory names MUST be entirely lowercase.
- **No Spaces or Underscores**: Use a hyphen `-` separator for multi-word names.
- **Dot-notation**: Always state the file's purpose using: `[feature/domain].[purpose].ts`.
- **Examples**:
  - `auth.controller.ts`
  - `auth.service.ts`
  - `auth.repository.ts`
  - `auth.route.ts`
  - `error.middleware.ts`
