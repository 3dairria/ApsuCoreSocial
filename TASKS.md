# ApsuCore — TASKS (Source of Truth)

> Rule: If it's not in this file, it doesn't exist.
> Update this file at the end of every session.

---

## DOING
- [ ] **Oracle Cloud** — account aanmaken (vastgelopen op hun site, wordt hervat)
  - Regio kiezen: Frankfurt / London
  - VM aanmaken (Ampere A1, Always Free)
  - PostgreSQL + Node.js installeren
  - Backend deployen + env vars instellen
  - Vercel `VITE_API_URL` invullen met Oracle backend URL

---

## BACKLOG

### Session 18 — Chat + Avatar + Collections
- [ ] ChatScreen: `messages` table in DB (senderId, receiverId, content, read, createdAt)
- [ ] `trpc.messages` router: messages.list(conversationWith), messages.send mutation
- [ ] ChatDetailScreen: load real messages via tRPC, send via mutation, auto-scroll to bottom
- [ ] Users table: add `avatarColor` column, use real color in SettingsScreen + ComposeScreen
- [ ] `saved_posts` table (userId, postId, savedAt) + migrations
- [ ] trpc.collections: save, remove, isSaved, listSaved procedures
- [ ] CollectionsScreen: show saved posts from DB (replace mock data)
- [ ] PostCard ··· menu: "Opslaan in collectie" wires up to trpc.collections.save

### Phase 2 — Security Upgrades
- [ ] httpOnly cookies for JWT (replace localStorage) — see SECURITY.md
- [ ] Refresh tokens (15min access + 7d refresh)
- [ ] Redis rate limiting (Upstash) for multi-instance Railway deployments
- [ ] Email verification on register
- [ ] Account lockout: 5 failed logins → 15 min wait

### Phase 2 — Features
- [ ] Zen Mode: ESC key closes, scroll progress bar at top
- [ ] Category feed in Discover: filter real posts by category slug
- [ ] Custom domain (apsucore.app) via Vercel + Railway
- [ ] Firebase Storage for media uploads (profile pics, post images)
- [ ] Firebase Storage Rules (see SECURITY.md)
- [ ] Content Security Policy (CSP) header
- [ ] Audio post player in feed
- [ ] Onboarding: category selection saved to DB (user_interests table)

---

## DONE

### Session 1 (2026-05-05) — Concept + Design System (HTML prototype)
- [x] Project concept, color palette, typography, logo concept
- [x] First HTML prototype (test.html)
- [x] 20 interest categories defined, PLAN.md created

### Session 2 (2026-05-06) — Navigation Screens (HTML)
- [x] Discover: 2-layer filter (content type + 20 categories)
- [x] Search, Chat, Activity screens
- [x] Follow/unfollow toggle

### Session 3 (2026-05-06) — All 12 Screens (HTML)
- [x] Collections, CreatorProfile, ChatDetail, Settings
- [x] Full history-stack navigation (screenHistory[])

### Session 4 (2026-05-06) — Interactivity (HTML)
- [x] Onboarding overlay (3 steps, localStorage)
- [x] Like animation, category feed overlay, followers modal
- [x] Music player, post dismiss, Zen mode (ESC + scroll bar)

### Session 5 (2026-05-06) — Feed + Toasts (HTML)
- [x] Toast system (green/purple/yellow + undo)
- [x] Video/Live/Blog posts in feed
- [x] Publish flow, nav badge auto-clear, live search filter

### Session 6 (2026-05-06) — React Migration Phase 1
- [x] Vite + React 19 + TypeScript + Tailwind CSS v3
- [x] All 12 screens migrated to React
- [x] history-stack navigation (navigateTo/goBack)

### Session 7 (2026-05-06) — React Polish 1
- [x] Toast system (ToastProvider context)
- [x] Share sheet, Onboarding, Category feed overlay, Zen mode

### Session 8 (2026-05-06) — React UI Refinement
- [x] Discover: full 2-layer filter
- [x] Translate button per post (NL↔EN)
- [x] PostMenu (··· dropdown) with all actions
- [x] Followers/Following modal on Profile

### Session 9 (2026-05-06) — React Router + Polish
- [x] React Router DOM v7 on all 12 screens
- [x] Skeleton loading states (PostCardSkeleton, StoryRowSkeleton)
- [x] EditProfileScreen

### Session 10 (2026-05-06) — Transitions + Pull-to-Refresh
- [x] PageTransition (fade+slide on route change)
- [x] PostDetail linked to real post data via router state
- [x] Pull-to-refresh with rubber-band effect

### Session 11 (2026-05-06) — Backend Setup
- [x] Hono + tRPC v11 + Drizzle + SQLite (WAL mode)
- [x] Schema: users, posts, follows, likes, comments (with indexes)
- [x] posts.list, posts.getById, users.me, users.updateProfile
- [x] Seed: 5 users + 5 posts

### Session 12 (2026-05-06) — Frontend ↔ Backend Connection
- [x] @trpc/client + @tanstack/react-query installed
- [x] Vite @server alias for type sharing (no duplication)
- [x] HomeScreen loads real posts from tRPC
- [x] Pull-to-refresh calls tRPC refetch()

### Session 13 (2026-05-06) — Mutations + PostDetail + Profile via API
- [x] likeToggle + commentCreate mutations
- [x] PostDetailScreen: tRPC (skeleton, fallback to mock)
- [x] ProfileScreen + EditProfileScreen: tRPC
- [x] Like button invalidates query, reacties use localReplies fallback

### Session 14 (2026-05-06) — Search + Activity + Follow via API
- [x] notifications table added to schema + seed (6 notifications)
- [x] users.search (name + handle, deduplication, followerCount)
- [x] users.getProfile, users.followToggle (optimistic UI)
- [x] notifications.list + notifications.markAllRead
- [x] SearchScreen + ActivityScreen use tRPC with fallback

### Session 15 (2026-05-06) — Authentication
- [x] bcryptjs + jose installed
- [x] auth router: register + login (bcrypt hash/compare)
- [x] JWT context in tRPC (Authorization header → ctx.userId)
- [x] All mutations use protectedProcedure
- [x] AuthScreen (login + register tabs, demo hint)
- [x] Auth gate in App.tsx, logout in SettingsScreen
- [x] Demo account: @jouwnaam / demo1234

### Session 16 (2026-05-06) — Compose + Unread Count
- [x] posts.create protectedProcedure (all post types)
- [x] ComposeScreen: tRPC mutation, real user from localStorage
- [x] notifications.unreadCount protectedProcedure
- [x] Live unread badge in App.tsx (enabled only when authed)

### Session 18 (2026-05-07/08) — Bugfixes + Vercel Live
- [x] App.tsx: `trpc` import ontbrak (ReferenceError fix)
- [x] server/src/db/index.ts: DB pad was `../../../` (projectroot, leeg) → gefixed naar `../../` (server/apsucore.db)
- [x] Demo user passwordHash was NULL in DB → bcrypt hash voor demo1234 gezet
- [x] vercel.json verplaatst naar projectroot (stond in apsucore-app/, werd niet gevonden)
- [x] Vercel buildCommand: server npm install toegevoegd zodat @server alias werkt
- [x] CategoryFeed.tsx: onNav type miste tweede parameter → gefixed
- [x] ShareSheet.tsx: ongebruikte X import verwijderd
- [x] loading="lazy" verwijderd uit 5 extra schermen (CreatorProfile, Profile, PostDetail, Discover, Collections)
- [x] Vercel live: apsu-core-social.vercel.app ✅
- [x] GitHub repo: github.com/3dairria/ApsuCoreSocial ✅
- [ ] Oracle Cloud: account aanmaken gepauzeerd → hervat volgende sessie

### Session 17 (2026-05-07) — Deployment Infrastructure
- [x] server/src/db/schema.pg.ts (PostgreSQL schema with pgEnum)
- [x] server/src/db/index.ts: conditional SQLite/PostgreSQL adapter
- [x] server/src/middleware/security.ts (rate limit, security headers, size limit)
- [x] server/src/index.ts: security middleware, CORS from env, PORT from env
- [x] server/drizzle.config.prod.ts
- [x] server/railway.json + Procfile
- [x] apsucore-app/vercel.json (SPA rewrites + cache headers)
- [x] apsucore-app/src/lib/trpc.ts: VITE_API_URL env var
- [x] .env.example (server + frontend), .env.local files
- [x] DEPLOYMENT.md + SECURITY.md
- [x] package.json: pg, @types/pg, db:push:prod, db:migrate:prod, db:seed:prod scripts
- [x] Image black bug fixed: removed loading="lazy" from PostCard (broken in overflow-y-auto)
