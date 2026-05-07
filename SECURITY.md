# ApsuCore — Security Checklist

## Automatisch beveiligd (ingebouwd)

| # | Maatregel | Hoe |
|---|-----------|-----|
| ✅ | HTTPS | Vercel + Railway hebben SSL standaard |
| ✅ | Wachtwoord hashing | bcryptjs, cost factor 10 |
| ✅ | JWT tokens | HS256, 30-dag expiry, jose library |
| ✅ | SQL injection | Drizzle ORM gebruikt parameterized queries |
| ✅ | XSS bescherming | React escaped output standaard |
| ✅ | Input validatie | Zod schema's op alle tRPC procedures |
| ✅ | Environment secrets | .env files, nooit in git |
| ✅ | Security headers | X-Frame-Options, X-Content-Type-Options, HSTS |
| ✅ | Rate limiting | Auth: 5/min, API: 200/min per IP |
| ✅ | CORS | Alleen eigen frontend domain in productie |
| ✅ | Request size limit | 10 MB maximum |
| ✅ | Stack traces | Nooit zichtbaar in productie responses |
| ✅ | Protected procedures | tRPC: UNAUTHORIZED error als geen JWT |

---

## Nog te doen (fase 2)

### Backend

- [ ] **httpOnly cookies** voor token opslag i.p.v. localStorage
  - Voordeel: JavaScript kan token niet lezen (XSS-proof)
  - Vereist: `credentials: include` in fetch + `SameSite=Strict` cookie

- [ ] **Refresh tokens** — 7-dag refresh + 15-min access token
  - Huidige implementatie: 30-dag access token (eenvoudig maar minder veilig)

- [ ] **Redis rate limiter** (productie)
  - Huidige in-memory rate limiter werkt niet bij meerdere server instances
  - Gebruik Upstash Redis (Railway add-on) voor distributed rate limiting

- [ ] **Email verificatie** — verifieer e-mailadres bij registratie

- [ ] **Account lockout** — 5 mislukte logins → 15 minuten wachten

- [ ] **Audit log** — log sensitive acties (login, wachtwoord wijzigen, account verwijderen)

### Frontend

- [ ] **Token in httpOnly cookie** i.p.v. localStorage
  - localStorage is kwetsbaar voor XSS aanvallen
  - Plan: server zet `Set-Cookie: token=...; HttpOnly; Secure; SameSite=Strict`

- [ ] **Content Security Policy (CSP)** header
  ```
  Content-Security-Policy: default-src 'self'; img-src 'self' https://picsum.photos https://firebasestorage.googleapis.com; font-src 'self' https://fonts.gstatic.com
  ```

### Firebase Storage

- [ ] **Storage Rules** — alleen eigen bestanden lezen/schrijven
  ```
  rules_version = '2';
  service firebase.storage {
    match /b/{bucket}/o {
      match /users/{userId}/{allPaths=**} {
        allow read: if true;
        allow write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
  ```

- [ ] **Bestandstype validatie** — alleen afbeeldingen, max 5 MB
  ```
  allow write: if request.resource.size < 5 * 1024 * 1024
    && request.resource.contentType.matches('image/.*');
  ```

### Database

- [ ] **Automatische backups** — Railway dekt dit (dagelijks, 7 dagen retentie)
- [ ] **Read-only replica** voor analytics queries (Railway add-on, later)
- [ ] **Row-level security** bij PostgreSQL (later)

---

## JWT Secret genereren

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Gebruik het resultaat als `JWT_SECRET` in Railway environment variables.

---

## Security Headers in productie

Alle responses bevatten automatisch:
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```
