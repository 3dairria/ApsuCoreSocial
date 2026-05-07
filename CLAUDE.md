# ApsuCore — Claude Identity & Session Instructions

## HOW TO START EVERY SESSION
1. Read this file (CLAUDE.md) first
2. Read TASKS.md — find what is DOING or next in BACKLOG
3. Read CONTEXT.md — refresh architecture and key decisions
4. Say: "I've read the files. We are at [task]. Context is [summary]. Ready to start with [next task]."

Do NOT ask what to do. Read the files and resume.

---

## PROJECT
**ApsuCore** — Social platform for AI creators (images, music, video, quotes, blogs)
Tagline: Maak. Deel. Verbind.
Design: Dark theme, purple (#7C3AED) + yellow (#D4A843) accent, Cormorant Garamond + DM Sans

---

## TECH STACK
| Layer | Tech |
|-------|------|
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS v3 |
| Routing | React Router v7 |
| API | tRPC v11 + Hono |
| ORM | Drizzle ORM |
| DB (local) | SQLite (better-sqlite3, WAL mode) |
| DB (prod) | PostgreSQL (Railway) |
| Auth | JWT HS256 (jose) + bcryptjs |
| Icons | Lucide React |
| Deploy | Railway (backend) + Vercel (frontend) |

---

## FOLDER STRUCTURE
```
apsucore-social-media/
├── apsucore-app/        ← React frontend (Vite, port 5173-5174)
│   └── src/
│       ├── components/  ← Reusable UI (feed/, layout/, post/, ui/)
│       ├── screens/     ← 12 app screens
│       └── lib/         ← trpc.ts, types.ts, data.ts, auth.ts
├── server/              ← Hono + tRPC backend (port 3001)
│   └── src/
│       ├── db/          ← schema.ts (SQLite), schema.pg.ts (PG), index.ts, seed.ts
│       ├── lib/         ← jwt.ts
│       ├── middleware/  ← security.ts (rate limit, headers, size limit)
│       └── router/      ← auth, posts, users, interactions, notifications
├── extra/               ← LOCAL ONLY (gitignored) — docs, old HTML prototypes, PLAN.md
├── code/                ← LOCAL ONLY (gitignored) — scratch code snippets
├── CLAUDE.md            ← This file: identity + session rules
├── TASKS.md             ← Source of Truth: Backlog / Doing / Done
├── CONTEXT.md           ← Project Memory: decisions + architecture
├── DEPLOYMENT.md        ← Railway + Vercel step-by-step guide
├── SECURITY.md          ← Security checklist (done + todo)
├── .gitignore           ← Excludes extra/, code/, .env files, *.db
└── .railwayignore       ← Excludes frontend from Railway deploy
```

---

## BEHAVIOR RULES
- NEVER commit or push without explicit user request
- NEVER delete files without confirming with user
- NEVER add features not in TASKS.md or explicitly requested
- ALWAYS run `npx tsc --noEmit` after backend changes (in server/)
- ALWAYS update TASKS.md when a task is completed
- ALWAYS update CONTEXT.md when a significant decision is made
- Local dev: `npm run dev` in both server/ and apsucore-app/
- After schema changes: `npm run db:push` in server/
- Production DB: `npm run db:push:prod` (uses drizzle.config.prod.ts + PostgreSQL)

---

## LOCAL DEV COMMANDS
```bash
# Backend (SQLite, no DATABASE_URL needed)
cd server && npm run dev        # port 3001

# Frontend
cd apsucore-app && npm run dev  # port 5173

# After schema change
cd server && npm run db:push

# Type check
cd server && npx tsc --noEmit
cd apsucore-app && npx tsc --noEmit
```

---

## IGNORED FOLDERS
`extra/` and `code/` are strictly local. Never upload, index, or reference files inside them unless the user explicitly pastes content from them into the chat.
