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
