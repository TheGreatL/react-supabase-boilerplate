# Client — Frontend

> The user-facing website built with React.

---

## 📖 What is this?

This is the **frontend** (what people see in the browser). It talks to the backend server to fetch data and display it. Think of it like the "face" of the application.

---

## 🛠️ Tools & Why We Use Them

| Tool | Purpose |
|---|---|
| **React** | The main library for building the UI — everything is made of reusable "components" |
| **Vite** | Starts and builds the app extremely fast during development |
| **TanStack Router** | Handles navigation between pages with full type-safety |
| **TanStack Query** | Fetches data from the server and caches it automatically |
| **Zustand** | Stores global app state (e.g., the currently logged-in user) |
| **Tailwind CSS v4** | Utility-first CSS framework for styling components quickly |
| **Framer Motion** | Powers smooth animations and transitions |
| **React Hook Form + Zod** | Manages form inputs and validates them before submission |
| **Axios** | Sends HTTP requests to the backend API |
| **Sonner** | Shows clean, non-intrusive notification toasts (success/error messages) |
| **Lucide React** | A clean, consistent icon library |

---

## 🏗️ How it's Organized

```
src/
├── features/         # One folder per feature (e.g., auth, users, orders)
│   └── auth/         # Everything for the auth feature lives here
│       ├── components/  # UI components (login-form.tsx, etc.)
│       └── services/    # API calls (auth.service.ts)
├── routes/           # Page definitions and layouts
└── shared/           # Reusable utilities used across multiple features
    ├── api/          # Axios configuration & interceptors
    ├── components/   # Generic UI components (buttons, modals)
    └── stores/       # Global state (auth.store.ts)
```

> **Rule:** Keep each feature self-contained. Don't mix `auth` logic into the `orders` folder.

---

## ▶️ Running Locally (Standalone)

```bash
npm install
npm run dev
```

> The app will run at `http://localhost:5173`.  
> Make sure the backend server is also running, otherwise API calls will fail.
