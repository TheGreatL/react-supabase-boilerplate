---
name: library-utilization
description:
  This skill enforces the usage of existing, top-tier libraries already installed in the project, discouraging
  reinventing the wheel with native or ad-hoc solutions. Use this when deciding how to implement forms, state, data
  fetching, or UI components.
---

# Library Utilization Skill

## 🎯 Purpose

This project is built on a modern, powerful stack. This skill ensures that we fully leverage the tools we have
installed, writing less boilerplate and relying on community-tested solutions.

## 🏗️ Core Responsibilities

- **Avoid "Native" Boilerplate**: Default to using installed libraries over writing native React/Node implementations
  for complex problems.
- **Maintain Consistency**: Ensure new features match the implementation patterns of existing features.
- **Dependency Awareness**: Know what is in `package.json` and use it.

## 📜 Key References

- [Client Architecture](../../client/ARCHITECTURE.md)
- [Server Architecture](../../server/ARCHITECTURE.md)

## 🛠️ Implementation Rules

### Frontend (React/Vite)

- **Forms**: ALWAYS use `react-hook-form` paired with `@hookform/resolvers/zod`. Do NOT use native React `useState` for
  complex form state.
- **Data Fetching**: ALWAYS use `@tanstack/react-query`. Do NOT use `useEffect` + `fetch`/`axios` for data fetching.
- **Routing**: ALWAYS use `@tanstack/react-router`. Use its native `<Link>` component for navigation, not `<a href>`.
- **Global State**: Use `zustand` for shared state (e.g., AuthStore). Avoid React Context unless specifically required
  for a localized provider pattern.
- **UI Components**: Rely on the established Tailwind v4 + Radix UI/Shadcn pattern. Do not build complex accessible
  components (like Modals or Selects) from scratch if a robust primitive exists.
- **Animations**: Use `framer-motion` for complex entry/exit animations, layout transitions, and staggered reveals.
  Relying solely on standard CSS transitions for complex choreography is discouraged.
- **Notifications**: Use `sonner` (`toast.success`, `toast.error`).

### Backend (Node/Express)

- **Validation**: ALWAYS use `zod` schemas to parse and validate request bodies (`req.body`). Do not write manual
  `if (!req.body.x)` checks.
- **Error Handling**: Use the custom `HttpException` class and `asyncHandler` wrapper. Do not write manual `try/catch`
  blocks in controllers.
- **Database**: Use Prisma ORM methods exclusively. Do not write raw SQL unless explicitly required for a complex
  performance optimization.
