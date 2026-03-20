---
name: database-standards
description:
  This skill enforces the "Gold Standard" for designing Prisma database models. Use it whenever creating or modifying
  schema files to ensure models are highly performant, scalable, and follow strict naming and audit conventions.
---

# Database Modeling Standards Skill (Server)

## 🎯 Purpose

This skill governs how agents interact with the Prisma schema, enforcing strict naming conventions, mandatory audit
fields, table mapping, indexing, and relationship integrity.

## 🛠️ Database Rules

### 1. Naming Conventions (Strict)

- **Models**: ALWAYS use `PascalCase` for model names (e.g., `model UserProfile { ... }`).
- **Fields (Columns)**: ALWAYS use `camelCase` for model fields (e.g., `firstName String`).
- **Table Mapping**: ALWAYS use `@@map("snake_case_plural")` to map to a standard database table name (e.g.,
  `@@map("user_profiles")`).
- **Enums**: `PascalCase` for name, `UPPER_SNAKE_CASE` for values.

### 2. Mandatory Audit Fields

EVERY single model MUST include these fields at the bottom:

```prisma
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime? // Used for soft-deletes
```

### 3. Performance & Indexing

- ALWAYS add `@@index([foreignKeyId])` for any field that acts as a relational foreign key.
- ALWAYS add `@@index` on fields that will be frequently searched (e.g., `email`, `status`, `role`).

### 4. Relationships & Integrity

- ALWAYS explicitly define `onDelete` behaviors on relations.
  - Use `onDelete: Cascade` ONLY when the child record cannot exist without its parent.
  - Use `onDelete: Restrict` or `onDelete: SetNull` for other scenarios.
