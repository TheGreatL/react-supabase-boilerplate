---
name: architecture-standards
description: This skill enforces the strict directory structure and file naming conventions of the client project. Use this whenever an agent is creating new files or folders to ensure consistency.
---

# Architecture & Naming Standards Skill (Client)

## 🎯 Purpose

This skill ensures that the client codebase remains clean, predictable, and scalable by strictly enforcing a feature-based folder structure and uniform, lowercase file naming conventions.

## 🛠️ Architecture Rules

### 1. Directory Structure (Feature-Based)

- ALWAYS place new domain logic inside `src/features/[feature-name]/`.
- Do NOT dump domain-specific logic into global `src/components/` or `src/utils/`.
- **Shared Utilities**: ONLY use `src/shared/` for code that is truly agnostic and used across multiple features (e.g., global error handlers, UI primitives, generic API configuration).

### 2. File Naming Conventions

- **Strict Lowercase**: ALL file and directory names MUST be entirely lowercase.
- **No Spaces or Underscores**: Use a hyphen `-` separator (e.g., `user-profile`).
- **Logic / Hooks / Utils**: Follow dot-notation: `[domain].[purpose].ts` (e.g., `auth.store.ts`, `use-debounce.hook.ts`).
- **React Components**: Use hyphenated `.tsx` files (e.g., `login-form.tsx`, `profile-card.tsx`).
