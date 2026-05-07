# ApsuCore — Deployment Guide

## Stack
- **Frontend** → Vercel (gratis tier volstaat)
- **Backend** → Railway (Starter plan, ~$5/maand)
- **Database** → Railway PostgreSQL (ingebouwd)
- **Storage** → Firebase Storage (gratis tier)

---

## Vereisten

- GitHub account (repo: `github.com/3dairria/ApsuCoreSocial`)
- Railway account: railway.app
- Vercel account: vercel.com
- Node.js 20+

---

## Stap 1 — GitHub push

```bash
# Vanuit de project root
git add .
git commit -m "feat: deployment infrastructure"
git push origin main
```

**Let op**: controleer dat `.gitignore` de volgende bestanden **UITSLUIT**:
```
server/.env.local
server/.env.production
apsucore-app/.env.local
apsucore-app/.env.production
*.db
```

---

## Stap 2 — Railway: Backend + PostgreSQL

### 2.1 Maak Railway project aan
1. Ga naar railway.app → **New Project**
2. Kies **Deploy from GitHub repo**
3. Selecteer `ApsuCoreSocial`
4. Railway detecteert automatisch de Node.js server

### 2.2 Stel Root Directory in
In Railway → Service Settings → **Root Directory**: zet op `/server`

Dit zorgt dat Railway alleen de backend deployt.

### 2.3 Voeg PostgreSQL toe
1. In Railway project → **+ New** → **Database** → **PostgreSQL**
2. Railway maakt automatisch de database aan
3. Kopieer de `DATABASE_URL` van de PostgreSQL service (Connection tab)

### 2.4 Stel Environment Variables in
In Railway → Backend Service → **Variables**:

```env
DATABASE_URL=postgresql://...  (automatisch van PostgreSQL service)
JWT_SECRET=<genereer met: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")>
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://apsucore.vercel.app
```

### 2.5 Database schema aanmaken
Na eerste deploy, run in Railway terminal (of lokaal met productie DATABASE_URL):

```bash
# Schema aanmaken op PostgreSQL
DATABASE_URL=<jouw-railway-url> npm run db:push:prod

# Test data seeden (optioneel)
DATABASE_URL=<jouw-railway-url> npm run db:seed:prod
```

### 2.6 Deploy
Railway deployed automatisch bij elke git push naar main.

Controleer de health check:
```
https://<jouw-service>.railway.app/health
```
Verwacht: `{"ok":true}`

---

## Stap 3 — Vercel: Frontend

### 3.1 Importeer GitHub repo
1. Ga naar vercel.com → **Add New Project**
2. Importeer `github.com/3dairria/ApsuCoreSocial`
3. **Root Directory**: laat leeg (root van repo)
4. Framework Preset: **Vite** (of "Other")

### 3.2 Build instellingen
Vercel pikt `vercel.json` automatisch op. Controleer:
- Build Command: `cd apsucore-app && npm install && npm run build`
- Output Directory: `apsucore-app/dist`

### 3.3 Stel Environment Variable in
In Vercel → Project Settings → **Environment Variables**:

```env
VITE_API_URL=https://<jouw-backend>.railway.app
```

### 3.4 Deploy
```
Vercel → Deploy → klaar
```

Controleer: `https://apsucore.vercel.app` → login + create post

---

## Stap 4 — CORS verbinden

Na deployment, update Railway environment variable:
```
CORS_ORIGIN=https://apsucore.vercel.app
```

En eventueel in Vercel de `VITE_API_URL` updaten met de echte Railway URL.

Redeploy beide services.

---

## Stap 5 — Testen

```bash
# Health check backend
curl https://<railway-url>/health

# Test login
curl -X POST https://<railway-url>/trpc/auth.login \
  -H "Content-Type: application/json" \
  -d '{"json":{"handle":"jouwnaam","password":"demo1234"}}'
```

---

## Lokale ontwikkeling (ongewijzigd)

```bash
# Terminal 1: Backend (SQLite, geen DATABASE_URL nodig)
cd server
npm run dev

# Terminal 2: Frontend
cd apsucore-app
npm run dev
```

Geen Docker, geen PostgreSQL vereist voor lokale ontwikkeling.

---

## Monitoring

- **Railway**: Logs tab → real-time server logs
- **Vercel**: Functions tab → frontend errors
- **Health endpoint**: `GET /health` → `{"ok":true}`

---

## Veelgestelde problemen

| Probleem | Oplossing |
|---------|-----------|
| CORS error in browser | Controleer `CORS_ORIGIN` in Railway (moet exacte Vercel URL zijn) |
| 401 Unauthorized | JWT_SECRET moet identiek zijn aan wat lokaal werd gebruikt voor tokens |
| DB connection error | Controleer `DATABASE_URL` in Railway variables |
| Build fails op Vercel | Controleer dat `apsucore-app/` correct is als build directory |
| `pg` module not found | Run `npm install` in de server directory op Railway |

---

## Toekomstige upgrades

- [ ] Custom domain (apsucore.app) via Vercel + Railway
- [ ] Firebase Storage voor mediabestanden
- [ ] Sentry voor error tracking
- [ ] Upstash Redis voor distributed rate limiting
