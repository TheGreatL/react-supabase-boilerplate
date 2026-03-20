---
name: client-standards
description: This skill focuses on frontend tech stack (React, Vite, TanStack Router), Tailwind v4 aesthetics, and store patterns. Use it when building or modifying frontend components, routes, or stores.
---

# Client Standards Skill

## 🎯 Purpose

This skill focuses on building and maintaining a premium, high-performance web experience.

## 🏗️ Core Responsibilities

- **Premium Aesthetics**: Enforce Tailwind CSS v4 best practices, smooth animations, and clean layouts.
- **Type-Safe Routing**: Manage file-based routes using TanStack Router.
- **State Integrity**: Maintain clear state boundaries using Zustand and TanStack Query.
- **API Reliability**: Ensure Axios interceptors and environment variables are correctly configured.

## 🎨 Frontend Gold Standards

- **Visual Design**:
  - Follow a unified, premium design system (no ad-hoc styles).
  - Use HSL-based color tokens for consistency.
  - Implement smooth micro-animations for interactivity.
- **Motion & Transitions**:
  - ALWAYS use `framer-motion` for complex layout changes, staggered list reveals, and page transitions.
  - Treat animation as a core part of the UX to achieve a premium, customized look.
- **Performance**:
  - Use `pendingComponent` for all transitions to eliminate "blank" states.
  - Optimize asset loading and leverage TanStack Query's caching.
  - Ensure the UI feels snappy and responsive (mobile-first).
- **Data Handling (Pagination & Filtering)**:
  - NEVER fetch all rows to `.filter()` or `.map()` manually on the client for presentation constraints.
  - ALWAYS drive pagination, sorting, and filtering via URL Search Parameters using TanStack Router.
  - ALWAYS pass these URL parameters to TanStack Query hooks to trigger server-side processing.
- **Accessibility (a11y)**:
  - Use semantic HTML elements.
  - Ensure proper contrast ratios and keyboard navigation support.
  - Use descriptive `aria` labels where necessary.
- **Code Standards**:
  - Maintain type safety across all components and routes.
  - Keep state localized where possible; use global stores sparingly.
  - Use `sonner` for all user-facing success/error feedback.
