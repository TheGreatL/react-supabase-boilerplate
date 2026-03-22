---
name: database-standards
description:
  This skill enforces the "Gold Standard" for designing Prisma database models. Use it whenever creating or modifying
  schema files to ensure models are highly performant, scalable, and follow strict naming and audit conventions.
---

# Database Modeling Standards Skill

## 🎯 Purpose

This skill governs how agents interact with the Prisma schema. It enforces strict rules around naming conventions,
mandatory audit fields, table mapping, indexing for performance, and strict relationship definitions.

## 🏗️ Core Responsibilities

- **Naming Conventions**: Enforce consistent casing for models, fields, and tables.
- **Auditability**: Ensure all records have timestamps and support soft deletion.
- **Performance**: Mandate indexing on high-traffic fields and foreign keys.

## 📜 Key References

- [Server Architecture](../../server/ARCHITECTURE.md)

## 🛠️ Database Rules

### 1. Naming Conventions (Strict)

- **Models**: ALWAYS use PascalCase (First letter uppercase) for model names (e.g., `model UserProfile { ... }`).
- **Fields (Columns)**: ALWAYS use `camelCase` for model fields across the entire schema (e.g., `firstName String`).
- **Table Mapping (`@@map`)**: ALWAYS use the `@@map("snake_case_plural")` directive at the bottom of the model to map
  the PascalCase model to a standard snake_case plural table name in the actual database (e.g.,
  `@@map("user_profiles")`).
- **Enums**: ALWAYS use PascalCase for the Enum name and `UPPER_SNAKE_CASE` for the values.

### 2. Mandatory Audit Fields

EVERY single model created MUST include the following three fields at the bottom of the definition:

```prisma
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime? // Used for soft-deletes
```

### 3. Performance & Indexing

- **Foreign Keys**: ALWAYS add an index (`@@index([foreignKeyId])`) for any field that acts as a relational foreign key.
- **Searchable Fields**: ALWAYS add an index on fields that will be frequently searched or filtered (e.g., `email`,
  `status`, `role`).

### 4. Relationships & Integrity

- **Referential Actions**: ALWAYS explicitly define `onDelete` behaviors on relations to prevent orphaned records or
  accidental widespread deletion.
  - Use `onDelete: Cascade` ONLY when a child record cannot logically exist without its parent (e.g., `OrderItems`
    belonging to an `Order`).
  - Use `onDelete: Restrict` or `onDelete: SetNull` in other scenarios to protect data integrity.
- **Bi-directional definitions**: Ensure both sides of a 1:N or N:M relationship are properly defined in Prisma.
