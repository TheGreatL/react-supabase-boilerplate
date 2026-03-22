# Client Architecture

## 🎨 Branding & Aesthetics

- **Theme**: Premium modern aesthetic using **Tailwind CSS v4**.
- **Icons**: `lucide-react` for consistent, sharp iconography.
- **Animations**: `framer-motion` for complex entering/exiting, staggered reveals, and layout transitions to achieve a high-end "v0-level" feel, supplemented by `tailwindcss-animate` for simple utility classes.
- **Toasts**: `sonner` for rich, non-intrusive notifications.

## 🗺️ Routing & State

- **Router**: `TanStack Router` with file-based routing and strict type safety.
- **State Management**: `Zustand` for lightweight, persistent global state (e.g., `authStore`).
- **Data Fetching**: `TanStack Query` for robust API interaction and caching.

## 🏗️ Folder Structure

- **`src/routes`**: File-based route definitions and layouts.
- **`src/features`**: Vertical feature modules (e.g., `auth`, `user`). Each contains its own services, components, and schemas.
- **`src/shared`**: Cross-cutting concerns (API config, global stores, UI components, types).

## 📡 API Integration

- **Axios Configuration**: Managed in `src/shared/api/api-config.ts`.
- **Interceptors**: Automatically handles token injection and silent refresh logic (ignoring auth routes).
- **Environment**: Managed via `src/env.ts` with strict Zod validation.

## 📝 Naming Conventions & Typing

To ensure consistency and type safety throughout the project:

1. **Type/Interface Prefixing**: All custom types and interfaces MUST start with a capital `T` followed by an uppercase first letter (e.g., `TUser`, `TAuthResponse`).
2. **Strict Typing**: Avoid using the `any` type at all costs. Use descriptive interfaces or `unknown` with type guards/assertions if the shape is truly dynamic.
3. **File Naming**: Follow the `lowercase-with-hyphens.purpose.extension` format.

## 🧪 Testing Architecture

- **Structure**: All tests follow a feature-based hierarchy: `tests/[feature]/[unit|integration]`.
- **Unit & Integration**: Powered by **Vitest**.
  - **Client**: Located in `/client/tests/`, organized by feature and test type.
- **Execution**: Unified scripts at the root level (`npm run test`, `npm run test:e2e`).
