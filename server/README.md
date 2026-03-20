# Server — Backend API

> The brain of the application. Handles data, logic, and security.

---

## 📖 What is this?

This is the **backend server**. It's not something users see directly — it runs in the background and handles things like:
- 🔐 Logging users in and keeping their session secure
- 📦 Storing and fetching data from the database
- 🛡️ Making sure only authorized users can access certain data

---

## 🛠️ Tools & Why We Use Them

| Tool | Purpose |
|---|---|
| **Node.js** | The runtime that lets us run JavaScript on the server |
| **Express** | A lightweight framework for building the API routes |
| **Prisma** | Talks to the database — lets us define tables and query data using code |
| **PostgreSQL** | The actual database where all data is stored |
| **Zod** | Validates incoming data — ensures the server never processes garbage input |
| **JWT (JSON Web Tokens)** | Issues secure login tokens (like a digital ID card) |
| **bcrypt** | Hashes (scrambles) passwords so they're never stored in plain text |
| **Helmet** | Adds security headers to every API response |
| **express-rate-limit** | Prevents brute-force attacks (e.g., limits repeated login attempts) |
| **Swagger UI** | Auto-generates interactive API documentation at `/api/docs` |
| **Morgan** | Logs all incoming requests for debugging |

---

## 🏗️ How it's Organized

The backend follows a strict pattern called **Controller → Service → Repository**:

```
src/
├── features/           # One folder per feature (e.g., auth, users)
│   └── auth/
│       ├── auth.route.ts       # Defines the URL endpoints
│       ├── auth.controller.ts  # Handles the request/response
│       ├── auth.service.ts     # Contains the business logic
│       └── auth.repository.ts  # Talks to the database
└── shared/
    ├── middleware/     # Global reusable middlware (auth guard, error handler)
    ├── utils/          # Helpers (ApiResponse, asyncHandler)
    └── lib/            # Library configs (Prisma client, Swagger, Logger)
```

**The flow of every request:**
```
Browser → Route → Controller → Service → Repository → Database
```

---

## 📋 API Documentation

Once the server is running, visit:
**`http://localhost:3001/api/docs`**

You'll see an interactive page listing all available API endpoints where you can test them directly from the browser.

---

## 💾 Database Commands

| Command | What it does | Run in Docker? |
|---|---|---|
| `npm run db:generate` | Re-generates Prisma client | `docker compose exec api npm run db:generate` |
| `npm run db:migrate` | Applies schema changes | `docker compose exec api npm run db:migrate` |
| `npm run db:seed` | Fills default test data | `docker compose exec api npm run db:seed` |
| `npm run db:studio` | Opens visual browser | (Run on host terminal) |
| `npm run db:reset` | **⚠️ Wiped database** | `docker compose exec api npm run db:reset` |

> [!IMPORTANT]
> To run these commands from your **host terminal**, ensure your `.env` is set to `localhost:5432`. If you have a local Postgres conflict, use `localhost:5433` instead. If running **via Docker exec**, it uses the internal network automatically.

---

## ▶️ Running Locally (Standalone)

> **Note:** You need a running PostgreSQL database. It's recommended to use Docker from the root directory instead.

```bash
npm install
cp .env.example .env  # fill in your values
npm run dev
```
