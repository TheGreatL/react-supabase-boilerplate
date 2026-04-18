# Code Pattern Guide

This document defines the standardized development patterns for this boilerplate.

> [!IMPORTANT] **Authoritative Sources of Truth (for Agents):**
>
> - **Global**:
>   [.agents/knowledge/code-patterns.md](file:///c:/Users/hp15s/Desktop/Boiler-Plates/react-supabase-boilerplate/.agents/knowledge/code-patterns.md)
> - **Server Local**:
>   [server/.agents/knowledge/standards.md](file:///c:/Users/hp15s/Desktop/Boiler-Plates/react-supabase-boilerplate/server/.agents/knowledge/standards.md)
> - **Client Local**:
>   [client/.agents/knowledge/standards.md](file:///c:/Users/hp15s/Desktop/Boiler-Plates/react-supabase-boilerplate/client/.agents/knowledge/standards.md)

---

## 💎 The "Gold Standard"

All development in this repository must adhere to the patterns defined in the internal knowledge base. These rules
ensure that the codebase remains clean, predictable, and scalable.

### Core Architecture (Server)

- **Controller**: HTTP logic.
- **Service**: Business logic.
- **Repository**: Data access.

### Core Architecture (Client)

- **Feature-Based**: Everything related to a specific domain (Auth, Dashboard, etc.) stays in its feature folder.
- **Modern Stack**: TanStack Router/Query + Zustand.

### Styling Standards

- **Pixel-Free**: No arbitrary pixels. Use `rem` or tokens.
- **Container-First**: Consistent page layouting.

For practical implementation examples and detailed rules, see the
[Full Code Pattern Guide](file:///c:/Users/hp15s/Desktop/Boiler-Plates/react-supabase-boilerplate/.agents/knowledge/code-patterns.md).
