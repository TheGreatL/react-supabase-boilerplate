# Frontend Development Standards (Client)

This guide defines the authoritative patterns for the client-side architecture of this boilerplate. All agents working within the `/client` directory MUST follow these rules.

---

## 🏗️ Feature-Based Architecture
We organize by domain features inside `src/features/`:

1. **Isolation**: A feature folder contains its own components, hooks, services, and types.
2. **Shared**: Only generic UI primitives or global logic should be in `src/shared/`.

---

## 📡 Data & State
1. **API Client**: Use the native `fetch` wrapper in `shared/api/api-config.ts`.
2. **TanStack Query**: Use for all server-state (caching, loading, mutations).
3. **Zustand**: Use for client-side global state (Auth status, Theme, etc.).

---

## 🎨 Styling (Tailwind v4)
- **Zero-Pixels**: Never use `px` values. Use Tailwind tokens (`p-4`) or `rem`.
- **Containers**: Every major page layout MUST use the `<div className="container">` layout utility.
- **Micro-animations**: Use subtle transitions for hover states and loading skeletons.

---

## 🛣️ Routing
- **TanStack Router**: File-bases routing in `src/routes/`.
- **Auth Guard**: Use the `_protected` route group for secure areas.
