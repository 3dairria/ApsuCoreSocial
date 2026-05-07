# ApsuCore — Project Memory

> Architecture decisions, technical context, key choices.
> Update when a significant decision is made or a pattern is established.

---

## ARCHITECTURE

### Database Strategy
- **Local dev**: SQLite (`apsucore.db` in project root) — zero setup, `npm run dev` just works
- **Production**: PostgreSQL on Railway via `DATABASE_URL` env var
- **Switch mechanism**: `server/src/db/index.ts` uses top-level `await` + conditional dynamic imports
  - `DATABASE_URL` present → imports `pg` + `drizzle-orm/node-postgres` + `schema.pg.ts`
  - No `DATABASE_URL` → imports `better-sqlite3` + `drizzle-orm/better-sqlite3` + `schema.ts`
- **TypeScript type trick**: PostgreSQL result cast to `as unknown as ReturnType<typeof sqliteDrizzle<typeof schema>>` — works because both adapters produce identical SQL for all CRUD ops used in this project

### Authentication
- **Method**: JWT HS256, 30-day expiry, signed with `JWT_SECRET` env var
- **Library**: `jose` (Web Crypto API compatible, ESM-native)
- **Storage**: `localStorage` key `apsucore_auth` → `{ token, userId, handle, name, avatarColor }`
- **Flow**: Login/register → server returns `{ token, user }` → client stores → all tRPC calls send `Authorization: Bearer <token>`
- **Server context**: tRPC `createContext()` reads Authorization header → `verifyToken()` → `ctx.userId`
- **Procedure types**: `publicProcedure` (auth, health) vs `protectedProcedure` (everything else)
- **Gate**: `App.tsx` calls `isLoggedIn()` — renders `<AuthScreen>` if false
- **Demo account**: handle `@jouwnaam`, password `demo1234` (hash seeded in DB)

### tRPC Setup
- **Version**: tRPC v11 (not v10 — API differs significantly)
- **Client**: `createTRPCReact<AppRouter>` in `src/lib/trpc.ts`
- **Transport**: `httpBatchLink` — batches multiple queries into one HTTP request
- **URL**: `${import.meta.env.VITE_API_URL ?? 'http://localhost:3001'}/trpc`
- **Type sharing**: Vite alias `@server` → `../server/src` (no code generation, no package.json link needed)

### Frontend → Backend Type Sharing
- `apsucore-app/vite.config.ts`: `resolve.alias['@server']` → `'../server/src'`
- `tsconfig.app.json`: `paths['@server/*']` + `include: ['../server/src/router/index.ts']`
- Frontend imports: `import type { AppRouter } from '@server/router/index'`
- Constraint: server src must be TypeScript-compatible at Vite build time (no circular deps)

### Security Middleware (`server/src/middleware/security.ts`)
- **Rate limiter**: in-memory `Map<string, {count, reset}>`, keyed by IP + route
  - Auth routes: 5/min (register), 10/min (login)
  - General API: 200/min
  - Auto-cleanup every 60s to prevent memory leak
  - Returns 429 with `Retry-After` header
- **Security headers**: X-Frame-Options DENY, X-Content-Type-Options nosniff, X-XSS-Protection, Referrer-Policy, Permissions-Policy, HSTS (production only)
- **Request size limit**: checks `Content-Length` header, returns 413 if > 10MB

---

## KEY FILES

| File | Purpose |
|------|---------|
| `server/src/db/schema.ts` | SQLite schema (local dev) — integer, text, real types |
| `server/src/db/schema.pg.ts` | PostgreSQL schema — pgTable, pgEnum, boolean, timestamp |
| `server/src/db/index.ts` | Conditional DB adapter (SQLite local / PostgreSQL prod) |
| `server/src/db/seed.ts` | Seed data: 7 users, 7 posts, follows, likes, 6 notifications |
| `server/src/lib/jwt.ts` | signToken(userId) → JWT, verifyToken(token) → userId |
| `server/src/middleware/security.ts` | rateLimit(), securityHeaders(), requestSizeLimit() |
| `server/src/router/index.ts` | AppRouter (merges all sub-routers) |
| `server/src/router/auth.ts` | register + login procedures |
| `server/src/router/posts.ts` | posts.list, posts.getById, posts.create |
| `server/src/router/users.ts` | users.me, users.search, users.getProfile, users.updateProfile, users.followToggle |
| `server/src/router/interactions.ts` | interactions.likeToggle, interactions.commentCreate |
| `server/src/router/notifications.ts` | notifications.list, notifications.markAllRead, notifications.unreadCount |
| `server/src/index.ts` | Hono app entry: CORS, security middleware, tRPC adapter, /health |
| `server/drizzle.config.ts` | Drizzle-kit config for SQLite (local) |
| `server/drizzle.config.prod.ts` | Drizzle-kit config for PostgreSQL (Railway) |
| `apsucore-app/src/lib/trpc.ts` | tRPC client + QueryClient setup |
| `apsucore-app/src/lib/auth.ts` | getToken(), saveAuth(), clearAuth(), isLoggedIn() |
| `apsucore-app/src/lib/types.ts` | TypeScript types: Post, User, Story, ChatItem, Notification, Screen |
| `apsucore-app/src/lib/data.ts` | Mock/fallback data (used when API unavailable) |
| `apsucore-app/src/App.tsx` | Root: auth gate + React Router + screen rendering + unread badge |

---

## ENVIRONMENT VARIABLES

### Server
| Variable | Local | Production |
|----------|-------|-----------|
| `DATABASE_URL` | Not set (SQLite) | Railway PostgreSQL URL |
| `JWT_SECRET` | `dev-secret-change-in-production` | Random 64-byte hex (see SECURITY.md) |
| `NODE_ENV` | `development` | `production` |
| `PORT` | `3001` | Set by Railway automatically |
| `CORS_ORIGIN` | Not set (all origins allowed) | `https://apsucore.vercel.app` |

### Frontend
| Variable | Local | Production |
|----------|-------|-----------|
| `VITE_API_URL` | Not set (defaults to `http://localhost:3001`) | `https://<service>.railway.app` |

---

## DEPLOYMENT

- **Backend**: Railway — Root Directory: `/server`, NIXPACKS builder, auto-deploy on git push
- **Frontend**: Vercel — Build: `cd apsucore-app && npm install && npm run build`, Output: `apsucore-app/dist`
- **DB schema push to Railway**: `DATABASE_URL=<url> npm run db:push:prod` (in server/)
- **Health check**: `GET /health` → `{"ok":true}`
- **SPA routing**: `vercel.json` rewrites all routes to `/` so React Router handles them
- See `DEPLOYMENT.md` for full step-by-step guide

---

## DESIGN DECISIONS

### Why SQLite locally
No Docker, no PostgreSQL install. Fresh clone + `npm install` + `npm run dev` = working app. Zero friction.

### Why presence of DATABASE_URL as the switch
Railway sets `DATABASE_URL` automatically when a PostgreSQL service is attached. No manual flag needed — the adapter switches itself in production.

### Why localStorage for JWT (current)
Fastest implementation for MVP. Tradeoff: XSS-vulnerable. Phase 2 upgrade: httpOnly cookie + SameSite=Strict (listed in SECURITY.md).

### Why @server alias over shared npm package
Monorepo with a proper shared package requires extra build tooling. Vite resolves the alias at compile time, importing types directly from server TypeScript source. Adequate for this scale.

### Why tRPC over REST
End-to-end type safety without code generation. Type errors at compile time. The frontend knows exactly what every procedure returns.

### Why loading="lazy" was removed from PostCard
`loading="lazy"` uses the document viewport for Intersection Observer. When the page scrolls via `main.overflow-y-auto` (not the document), images are always "outside viewport" and never load. Fix: eager loading (default).

---

## OPEN QUESTIONS (not yet decided)
- Logo: ambigram/ligature A+C as one symbol — needs manual vector work in Illustrator/Figma
- Primary language: NL-only or multilingual from launch?
- Web version: mobile-only or desktop responsive too?
- Payment model: Free / Freemium / Creator subscription?
- Audio posts: external transcoding service or own hosting?
- Video: own hosting or YouTube/Vimeo embed?
- Moderation: who manages content per category?
