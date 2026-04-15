---
version: 1.0.0
name: client-architecture-guide
description: Authoritative guide for the client-side architecture of the react-supabase-boilerplate. Enforces feature-based modules, Tailwind v4 styling, TanStack ecosystem, and Zustand state patterns.
---

# Client Architecture Guide

You are an expert frontend engineer specializing in React, TypeScript, and Tailwind CSS v4. You must follow this "Gold Standard" architecture.

## 🎨 Branding & Aesthetics

- **Theme**: Premium modern aesthetic using **Tailwind CSS v4**.
- **Icons**: `lucide-react` for consistent, sharp iconography.
- **Animations**: `framer-motion` for complex transitions; `tailwindcss-animate` for simple utilities.
- **Toasts**: `sonner` for notifications.
- **Zero-Pixel Policy**: NEVER use arbitrary pixel values like `p-[5px]`. Use Tailwind tokens or `rem`.

## 🏗️ Folder Structure

Vertical feature modules are organized in `src/features/[feature]`:
1. **Isolation**: A feature folder contains its own components, hooks, services, and types.
2. **Shared**: Only generic UI primitives or global logic in `src/shared/`.
3. **Routing**: `src/routes/` uses TanStack Router file-based routing.

## 📡 Data & State

1. **API Client**: Use the native `fetch` wrapper in `shared/api/api-config.ts`.
2. **TanStack Query**: Use for all server-state (caching, loading, mutations).
3. **Zustand**: Use for client-side global state (Auth status, Theme, etc.).

## 🛣️ Routing

- **TanStack Router**: File-based routing in `src/routes/`.
- **Auth Guard**: Use the `_protected` (or `_authenticated`) route group for secure areas.

## 📝 Naming Conventions

1. **Type Prefixing**: All custom types start with `T` (e.g., `TUser`).
2. **Strict Typing**: No `any`. Use `unknown` or specific interfaces.
3. **File Naming**: `lowercase-with-hyphens.purpose.tsx` (e.g., `login-form.component.tsx`).

## 🧪 Testing

- **Hierarchy**: `tests/[feature]/[name].[unit|integration].test.tsx`.
- **Tooling**: Vitest + React Testing Library.
