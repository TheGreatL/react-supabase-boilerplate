---
name: security-standards
description:
  This skill focuses on application security, preventing vulnerabilities, and handling data safely. Use it whenever
  implementing authentication, database queries, user input handling, or setting up new routes.
---

# Security Standards Skill (Server)

## 🎯 Purpose

This skill ensures that all backend code adheres to strict industry-standard security practices.

## 🛡️ Security Rules

- **Authentication**: Use the dual-token architecture (Access in memory/headers, Refresh in HTTP-only cookies).
- **Input Validation**: NEVER trust client data; ALWAYS validate using Zod schemas on every request body.
- **Error Handling**: NEVER expose raw database errors or stack traces to the frontend. Pass all errors through
  `errorMiddleware`.
- **Sanitization**: Use Prisma's parameterized queries (automatic) and Zod for shape validation.
- **Secrets**: Never hardcode secrets or API keys; use environment variables in `.env`.
- **Middleware**:
  - Use `helmet` for security headers.
  - Configure strict CORS policies.
  - Apply rate limiting to sensitive routes (e.g., auth endpoints).
- **OWASP Top 10**: Actively prevent XSS, CSRF, and injection attacks.
