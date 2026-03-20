# React Node Boilerplate

> A full-stack web application 

---

## 📖 What is this?

This project is a **full-stack web application** split into two parts:
- **`/client`** — What users see in the browser (the website).
- **`/server`** — The behind-the-scenes logic that handles data, user accounts, and security.

Everything runs inside **Docker** — a tool that packages all the services together so anyone can run the app with a single command, without manually installing a database or configuring a server.

---

## 🛠️ Tools Used

| Tool | What it does |
|---|---|
| **Docker** | Packages and runs the entire app (database, server, client) together |
| **PostgreSQL** | The database — stores all your data |
| **pgAdmin** | A visual tool to browse and manage your database through a browser |
| **Node.js / Express** | Runs the backend server that handles API requests |
| **React / Vite** | Powers the frontend — the website UI |
| **Prisma** | Manages the database tables and lets the server talk to the database |

---

## ⚡ How to Run the App

### Prerequisites (Install these first)
- [Node.js](https://nodejs.org/) (v18+)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Steps

**1. Clone the project**
```bash
git clone <your-repo-url>
```

**2. Set up your environment variables**

Copy all `.env.example` files to `.env` in the root, `/client`, and `/server` directories and fill in their values.
```bash
cp .env.example .env
cp server/.env.example server/.env
cp client/.env.example client/.env
```
> ⚠️ **Important:** Never share your `.env` file. It contains passwords and secret keys.

**3. Start the app**
```bash
npm run docker:dev
```
This starts everything: the database, the server, and the frontend — all at once.

**4. Open in your browser**
- 🌐 **Frontend (website):** `http://localhost:5173`
- ⚙️ **Backend API:** `http://localhost:3001/api`
- 📋 **API Docs (Swagger):** `http://localhost:3001/api/docs`
- 🗄️ **Database UI (pgAdmin):** `http://localhost:5050`

---

## 🗄️ Database Guide

**View & manage your data** via pgAdmin at `http://localhost:5050`.

Login with:
**Email**: the value of `PGADMIN_EMAIL` in your `.env` (default: `admin@admin.com`)
**Password**: the value of `PGADMIN_PASSWORD` in your `.env` (default: `admin123`)

### 🔌 How to Connect to the Database
Once logged into pgAdmin, follow these steps to see your data:

1.  **Right-click** on `Servers` > `Register` > `Server...`
2.  **General Tab**: Name it something like `Boilerplate DB`
3.  **Connection Tab**:
    - **Host name/address**: `db` (⚠️ Important: Use the service name, not `localhost` or `postgres`)
    - **Port**: `5432` (⚠️ Important: Use the internal Docker port)
    - **Maintenance database**: `boilerplate_db` (or check your `.env`)
    - **Username**: `postgres`
    - **Password**: `postgres123` (or check your `.env`)
4.  **Click Save**.

**Seed your database** (add default test data):
```bash
npm run docker:seed
```

**Reset your database** (wipe everything and start fresh):
```bash
# Stop the stack first, then remove volumes
npm run docker:down
docker-compose down -v
npm run docker:dev
```

---

## 📝 First Time Setup Checklist

After cloning the repo, make sure you do these things:

- [ ] Install Docker Desktop and make sure it's running.
- [ ] Create your `.env` files for the **root**, **server**, and **client** from their respective `.env.example` files and fill in any required values.
- [ ] Run `npm run docker:dev` to start the app.
- [ ] Run `npm run docker:seed` to populate the database with test users.

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `POSTGRES_USER` | Database username |
| `POSTGRES_PASSWORD` | Database password |
| `POSTGRES_DB` | Database name |
| `PGADMIN_EMAIL` | pgAdmin login email |
| `PGADMIN_PASSWORD` | pgAdmin login password |
| `SERVER_PORT` | Port the API runs on (default: `3001`) |
| `CLIENT_PORT` | Port the website runs on (default: `5173`) |

> See `server/.env.example` for server-specific variables (JWT secrets, etc.)

---

## 👥 Working as a Team

This project is set up for collaborative development. Here's what keeps everyone's code consistent.

### 🌳 Git Branching Strategy

| Branch | Purpose |
|---|---|
| `main` | Production-ready code only — **never commit directly here** |
| `test` | Integration branch — merge your feature here first |
| `feat/your-feature-name` | Your individual feature work |
| `fix/bug-description` | Bug fix branches |

**Workflow:**
```
1. Pull latest test      →  git checkout test && git pull
2. Create your branch  →  git checkout -b feat/my-feature
3. Make your changes   →  (write code, commit often)
4. Push your branch    →  git push origin feat/my-feature
5. Open a Pull Request →  feat/my-feature → test
```
> **Rule:** Never push directly to `main` or `test`. Always go through a Pull Request.

---

### 🎨 Automatic Code Formatting

This project enforces consistent formatting on **3 levels** so no one has to think about it:

| Level | Tool | When it runs |
|---|---|---|
| **1 — On Save** | VS Code + Prettier | Every time you press `Ctrl+S` |
| **2 — On Commit** | Husky + lint-staged | Every time you run `git commit` |
| **3 — Editor Setup** | `.vscode/extensions.json` | VS Code prompts you to install everything when you open the project |

> **First-time setup:** When you open the project, VS Code will show a popup — **"Install Recommended Extensions?"** — click **Install All**. This installs Prettier, ESLint, Prisma, Tailwind, and GitLens automatically.

After installing extensions, saving any file will auto-format it. You never need to run Prettier manually.

