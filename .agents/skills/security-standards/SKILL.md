---
name: security-standards
description:
  This skill focuses on application security, preventing vulnerabilities, and handling data safely. Use it whenever
  implementing authentication, database queries, user input handling, or setting up new routes.
---

# Security Standards Skill

## 🎯 Purpose

This skill ensures that all code written adheres to strict industry-standard security practices, preventing common
vulnerabilities before they reach production.

## 🏗️ Core Responsibilities

- **Input Validation**: Never trust client data; always validate using Zod.
- **OWASP Top 10 Prevention**: Actively prevent XSS, CSRF, and SQL/NoSQL injections.
- **Data Protection**: Ensure passwords, tokens, and sensitive PII are never leaked or stored in plain text.
- **Middleware Enforcement**: Ensure routes are properly protected by auth guards, rate limiters, and `helmet`.

## 📜 Key References

- [Main Architecture](../../ARCHITECTURE.md)
- [Server Architecture](../../server/ARCHITECTURE.md)

## 🛡️ Security Rules

- **Authentication**: Use the dual-token architecture (Access in memory/headers, Refresh in HTTP-only cookies).
- **Error Handling**: NEVER expose raw database errors or stack traces to the frontend. Pass all errors through
  `errorMiddleware`.
- **Sanitization**: Assume all inputs are malicious. Use Prisma's parameterized queries (which happens automatically
  when using the Prisma client) and Zod for shape validation.
- **Secrets**: Never hardcode secrets or API keys. Always use environment variables configured in `.env`.
