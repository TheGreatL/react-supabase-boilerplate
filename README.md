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

## 🚀 Step-by-Step Setup Guide

### 1. Initial Launch
After cloning the repo, simply run:
```bash
npm run docker:dev
```
This will build and start all containers. The first time you run this, it may take a few minutes to download images and build the frontend/backend.

### 2. Database Migrations & Seeding
Once the containers are running, you need to set up your database tables and initial data.

**Option A: From your Host Machine (Recommended during development)**
You can run Prisma commands directly from your VS Code terminal (inside the `/server` folder):
```bash
cd server
npm run db:migrate  # Applies schema changes
npm run db:seed     # Adds test data
```
*Note: Ensure your `server/.env` uses `localhost:5432` for this to work.*

> [!TIP]
> **Port Conflicts:** If you already have PostgreSQL installed on your computer, you might get an error that port `5432` is already in use. To fix this, change `POSTGRES_PORT` in your root `.env` to `5433` and update the `DATABASE_URL` in `server/.env` to use `localhost:5433`.

**Option B: From inside Docker**
Use this if you don't want to install dependencies locally:
```bash
docker compose exec api npm run db:migrate
docker compose exec api npm run db:seed
```

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
    - **Host name/address**: `db` (⚠️ Important: Use the Docker service name when connecting *from inside* pgAdmin)
    - **Port**: `5432` (⚠️ Important: Use the internal Docker port)
    - **Maintenance database**: `boilerplate_db` (or check your `.env`)
    - **Username**: `postgres`
    - **Password**: `postgres123` (or check your `.env`)
4.  **Click Save**.

> [!TIP]
> **Connecting from your Host Machine:** If you use an external tool like TablePlus or DBeaver, use **`localhost`** as the host and **`5432`** as the port (or `5433` if you encountered a port conflict).

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

This project follows the **Gold Standard** for collaborative development to ensure a clean, readable, and trackable history.

### 📂 Primary Branches

| Branch | Purpose | Description |
|---|---|---|
| `main` | **Production** | Highly stable code. Only merged from `test` after thorough verification. |
| `test` | **Development / Testing** | Integration branch where features are combined and tested before production. |

---

### 🌳 Branch Naming Strategy

Always create a new branch for your work. Use the following prefix pattern: `type/description-slug`

| Prefix | Use Case | Example |
|---|---|---|
| `feat/` | A new feature | `feat/google-login` |
| `fix/` | A bug fix | `fix/header-overflow` |
| `refactor/` | Code change that neither fixes a bug nor adds a feature | `refactor/auth-logic` |
| `docs/` | Documentation only changes | `docs/update-readme` |
| `style/` | Formatting, missing semi-colons, etc; no code change | `style/fix-indentation` |
| `perf/` | A code change that improves performance | `perf/speed-up-queries` |
| `test/` | Adding missing tests or correcting existing tests | `test/auth-service` |
| `chore/` | Updating build tasks, package manager configs, etc | `chore/update-deps` |

**Workflow:**
1. **Pull latest test** → `git checkout test && git pull`
2. **Create branch** → `git checkout -b feat/my-new-feature`
3. **Work & Commit** → (See Commit Convention below)
4. **Push & PR** → `git push origin feat/my-new-feature` then open a PR into `test`.

---

### 💬 Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. This allows for automated changelogs and easier history browsing.

**Pattern:** `type(scope): description`

- **Type**: Must be one of the prefixes from the table above (feat, fix, etc.).
- **Scope**: (Optional) The module or feature being changed (e.g., auth, ui, db).
- **Description**: A brief, imperative-style summary (e.g., "add validation", "fix crash").

**Examples:**
- `feat(api): add logout endpoint`
- `fix(client): resolve button double-click issue`
- `docs: fix typo in setup instructions`
- `chore!: upgrade node version` (The `!` indicates a breaking change)

---

### 🎨 Automatic Code Quality

This project enforces consistency on **3 levels**:

This project enforces consistent formatting on **3 levels** so no one has to think about it:

| Level | Tool | When it runs |
|---|---|---|
| **1 — On Save** | VS Code + Prettier | Every time you press `Ctrl+S` |
| **2 — On Commit** | Husky + lint-staged | Every time you run `git commit` |
| **3 — Editor Setup** | `.vscode/extensions.json` | VS Code prompts you to install everything when you open the project |

> **First-time setup:** When you open the project, VS Code will show a popup — **"Install Recommended Extensions?"** — click **Install All**. This installs Prettier, ESLint, Prisma, Tailwind, and GitLens automatically.

After installing extensions, saving any file will auto-format it. You never need to run Prettier manually.

